#!/usr/bin/env node
/**
 * Decide — from real ingest history — which suppliers may have a flight
 * missing from their newest sheet treated as SOLD OUT, then switch it on.
 *
 * The feature (functions/fareSupersede.js → planAbsenceSoldOut) hides live,
 * bookable fares on an INFERENCE: the supplier did not say "sold out", they
 * simply stopped quoting the flight. That is only true for a desk that sends a
 * COMPLETE list every time. For a desk that sends per-sector updates, absence
 * means nothing, and acting on it delists fares that are still for sale.
 *
 * Which desk is which is a question about observed behaviour, not opinion, so
 * this reports the evidence rather than asking anyone to remember:
 *
 *   rows/upload    Does one upload carry enough rows to BE a list? The sweep
 *                  needs >= minRows (default 6) or it declines to act at all.
 *   sector repeat  Of the routes a supplier quoted yesterday, what share did
 *                  they quote again today? A complete-list desk re-sends its
 *                  whole route book daily and scores high. An incremental desk
 *                  touches a couple of sectors a day and scores low — and for
 *                  them a high score is impossible to fake, because absence is
 *                  measured over exactly the routes they did re-quote.
 *
 * Run (read-only report, writes nothing):
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/enable-absence-soldout.js
 *
 * Then, to switch it on for the suppliers you accept:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/enable-absence-soldout.js --apply --agents 1,8,4
 *
 * --global-on additionally sets config/whatsapp.rateIntakeAbsenceSoldOut. That
 * flag is the master switch; without it the per-supplier flags do nothing, and
 * it is deliberately a separate argument so the blast radius of a typo in
 * --agents is one supplier rather than the whole system.
 *
 * Safe to re-run. Every write is a targeted merge of ONE boolean field, so
 * unlike scripts/wire-rate-intake.js this cannot clobber a neighbouring field.
 */

"use strict";

const path = require("path");
const { createRequire } = require("module");
const requireFromFunctions = createRequire(path.join(__dirname, "..", "functions", "package.json"));
const admin = requireFromFunctions("firebase-admin");

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const GLOBAL_ON = argv.includes("--global-on");
const DAYS = Number((argv.find((a) => a.startsWith("--days=")) || "").split("=")[1]) || 21;

const agentsArg = argv[argv.indexOf("--agents") + 1];
const CHOSEN = argv.includes("--agents") && agentsArg && !agentsArg.startsWith("--")
  ? agentsArg.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

/** Mirrors the ingest gate: only these sources are read as a complete sheet. */
const COMPLETE_SOURCES = new Set(["whatsapp-intake"]);
/** The ingest defaults, restated so the report predicts what would actually happen. */
const MIN_ROWS = 6;

admin.initializeApp({ projectId: "zamra-web-01" });
const db = admin.firestore();

const dayOf = (d) => d.toISOString().slice(0, 10);

async function main() {
  const cfgSnap = await db.doc("config/whatsapp").get();
  const cfg = cfgSnap.exists ? cfgSnap.data() || {} : {};
  console.log("── config/whatsapp ──────────────────────────────────────────");
  console.log("  rateIntakeEnabled        :", cfg.rateIntakeEnabled === true);
  console.log("  rateIntakeAbsenceSoldOut :", cfg.rateIntakeAbsenceSoldOut === true);
  console.log("  rateIntakeAbsenceSources :", cfg.rateIntakeAbsenceSources || '(default ["whatsapp-intake"])');

  const agentsSnap = await db.collection("agents").get();
  const agents = new Map();
  agentsSnap.forEach((d) => agents.set(d.id, d.data()));

  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
  const faresSnap = await db.collection("agent_fares")
    .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(cutoff))
    .select("agentId", "sectorId", "ingestSource", "ingestBatchId", "createdAt")
    .get();

  // agent → { uploads: Map<batchId, rows>, days: Map<day, Set<sector>> }
  const stats = new Map();
  faresSnap.forEach((doc) => {
    const f = doc.data();
    if (!COMPLETE_SOURCES.has(String(f.ingestSource || ""))) return;
    const id = String(f.agentId || "");
    if (!id) return;
    if (!stats.has(id)) stats.set(id, { uploads: new Map(), days: new Map() });
    const s = stats.get(id);
    const batchId = String(f.ingestBatchId || "(none)");
    s.uploads.set(batchId, (s.uploads.get(batchId) || 0) + 1);
    const created = f.createdAt && f.createdAt.toDate ? f.createdAt.toDate() : null;
    if (created && f.sectorId) {
      const day = dayOf(created);
      if (!s.days.has(day)) s.days.set(day, new Set());
      s.days.get(day).add(String(f.sectorId));
    }
  });

  console.log(`\n── evidence, last ${DAYS} days, source=whatsapp-intake ──────`);
  if (stats.size === 0) {
    console.log("  NO auto-ingested fares in this window.");
    console.log("  Nothing to judge — the sweep would never fire. Do not enable blind.");
  }

  const rows = [];
  for (const [id, s] of stats) {
    const counts = [...s.uploads.values()].sort((a, b) => a - b);
    const median = counts[Math.floor(counts.length / 2)] || 0;
    const bigEnough = counts.filter((c) => c >= MIN_ROWS).length;

    // Day-over-day: of the sectors quoted on the previous active day, how many
    // were quoted again? Averaged over consecutive pairs.
    const days = [...s.days.keys()].sort();
    const overlaps = [];
    for (let i = 1; i < days.length; i++) {
      const prev = s.days.get(days[i - 1]);
      const cur = s.days.get(days[i]);
      if (!prev.size) continue;
      let hit = 0;
      for (const sec of prev) if (cur.has(sec)) hit++;
      overlaps.push(hit / prev.size);
    }
    const repeat = overlaps.length
      ? overlaps.reduce((a, b) => a + b, 0) / overlaps.length : null;

    rows.push({
      id,
      name: String((agents.get(id) || {}).name || "?").slice(0, 20),
      uploads: s.uploads.size,
      median,
      bigPct: counts.length ? bigEnough / counts.length : 0,
      days: days.length,
      repeat,
      on: (agents.get(id) || {}).rateIntakeAbsenceSoldOut === true,
    });
  }

  rows.sort((a, b) => (b.repeat ?? -1) - (a.repeat ?? -1));
  console.log("  agent  name                 uploads  med.rows  >=6rows  days  sector-repeat  verdict");
  for (const r of rows) {
    // A supplier qualifies only on BOTH axes: their uploads must be large
    // enough for the sweep to act on at all, and their route book must
    // genuinely repeat day over day.
    const verdict = r.repeat === null || r.days < 3 ? "too little history"
      : (r.bigPct >= 0.5 && r.repeat >= 0.7) ? "COMPLETE-LIST → candidate"
        : (r.repeat < 0.4) ? "incremental → do NOT enable"
          : "mixed → review by hand";
    console.log(
      `  ${r.id.padEnd(6)} ${r.name.padEnd(20)} ${String(r.uploads).padStart(7)} ` +
      `${String(r.median).padStart(9)} ${(Math.round(r.bigPct * 100) + "%").padStart(8)} ` +
      `${String(r.days).padStart(5)} ${(r.repeat === null ? "n/a" : Math.round(r.repeat * 100) + "%").padStart(14)}  ` +
      `${verdict}${r.on ? "  [already on]" : ""}`,
    );
  }

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply --agents <ids> to enable.");
    return;
  }

  if (!CHOSEN.length && !GLOBAL_ON) {
    console.log("\n--apply needs --agents <ids> and/or --global-on. Nothing to do.");
    return;
  }

  console.log("\n── applying ────────────────────────────────────────────────");
  for (const id of CHOSEN) {
    if (!agents.has(id)) {
      console.log(`  SKIP ${id}: no such agent document`);
      continue;
    }
    await db.collection("agents").doc(id).set({
      rateIntakeAbsenceSoldOut: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`  agents/${id} (${agents.get(id).name}) rateIntakeAbsenceSoldOut = true`);
  }
  if (GLOBAL_ON) {
    await db.doc("config/whatsapp").set({
      rateIntakeAbsenceSoldOut: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log("  config/whatsapp.rateIntakeAbsenceSoldOut = true");
  }
  console.log("Done.");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
