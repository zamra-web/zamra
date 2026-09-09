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
 *   re-quote %     Of the routes a supplier quoted in EARLIER uploads today,
 *                  what share does a later upload quote again? A complete-list
 *                  desk re-sends its whole route book each time and scores
 *                  high; an incremental desk touches a couple of sectors per
 *                  message and scores low.
 *
 * The window is one day, not several, because `agent_fares` is deliberately
 * cleared daily — so cross-day comparison is impossible and, more to the point,
 * unnecessary: the wipe already removes yesterday's stale rows. What this
 * feature adds under that regime is the INTRA-day case, where a supplier sends
 * a second complete list hours later with a flight missing from it.
 *
 * --simulate is the check that actually decides an enablement. It replays
 * planSupersede + planAbsenceSoldOut over today's real uploads in the order
 * they arrived and prints every fare that would have been hidden, so the
 * blast radius is read off the data instead of predicted.
 *
 * Run (read-only report, writes nothing):
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/enable-absence-soldout.js
 *
 * Replay the algorithm over today's real data before trusting it:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/enable-absence-soldout.js --simulate [minRows] [minAgeHours]
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
const { planSupersede, planAbsenceSoldOut } = require("../functions/fareSupersede");

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const GLOBAL_ON = argv.includes("--global-on");
const DAYS = Number((argv.find((a) => a.startsWith("--days=")) || "").split("=")[1]) || 21;

const SIMULATE = argv.includes("--simulate");
const SIM_ARGS = argv.filter((a) => /^\d+$/.test(a)).map(Number);

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
    if (!stats.has(id)) stats.set(id, { uploads: new Map(), days: new Map(), batches: new Map() });
    const s = stats.get(id);
    const batchId = String(f.ingestBatchId || "(none)");
    s.uploads.set(batchId, (s.uploads.get(batchId) || 0) + 1);
    const created = f.createdAt && f.createdAt.toDate ? f.createdAt.toDate() : null;
    if (!s.batches.has(batchId)) s.batches.set(batchId, { sec: new Set(), rows: 0, t: null });
    const b = s.batches.get(batchId);
    b.rows++;
    if (f.sectorId) b.sec.add(String(f.sectorId));
    // The upload's own clock is its EARLIEST row: that is the instant the ingest
    // ran, and what the age guard is measured from.
    if (created && (!b.t || created < b.t)) b.t = created;
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

    // Intra-day: of the sectors quoted in EARLIER uploads, what share does each
    // later big upload quote again? Measured against the accumulated set rather
    // than the immediately preceding upload, because a complete-list desk is
    // claiming to restate its whole book, not just the last message.
    const ordered = [...s.batches.values()].filter((e) => e.t).sort((a, b) => a.t - b.t);
    const shares = [];
    for (let i = 1; i < ordered.length; i++) {
      if (ordered[i].rows < MIN_ROWS) continue;
      const earlier = new Set();
      for (let j = 0; j < i; j++) for (const sec of ordered[j].sec) earlier.add(sec);
      if (!earlier.size) continue;
      let hit = 0;
      for (const sec of earlier) if (ordered[i].sec.has(sec)) hit++;
      shares.push(hit / earlier.size);
    }
    const repeat = shares.length
      ? shares.reduce((a, b) => a + b, 0) / shares.length : null;
    const days = [...s.days.keys()];

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
  console.log("  agent  name                 uploads  med.rows  >=6rows  days     re-quote  verdict");
  for (const r of rows) {
    // A supplier qualifies only on BOTH axes: their uploads must be large
    // enough for the sweep to act on at all, and their route book must
    // genuinely repeat day over day.
    const verdict = r.repeat === null ? "only one upload — nothing to compare"
      : (r.bigPct >= 0.5 && r.repeat >= 0.7) ? "COMPLETE-LIST → candidate"
        : (r.repeat < 0.4) ? "incremental → do NOT enable"
          : "mixed → simulate before enabling";
    console.log(
      `  ${r.id.padEnd(6)} ${r.name.padEnd(20)} ${String(r.uploads).padStart(7)} ` +
      `${String(r.median).padStart(9)} ${(Math.round(r.bigPct * 100) + "%").padStart(8)} ` +
      `${String(r.days).padStart(5)} ${(r.repeat === null ? "n/a" : Math.round(r.repeat * 100) + "%").padStart(14)}  ` +
      `${verdict}${r.on ? "  [already on]" : ""}`,
    );
  }

  if (SIMULATE) {
    const minRows = SIM_ARGS[0] || MIN_ROWS;
    const minAgeMs = (SIM_ARGS[1] || 6) * 60 * 60 * 1000;
    console.log(`\n── simulation: minRows=${minRows} minAgeHours=${minAgeMs / 3600000} ──`);
    console.log("   Replaying today's uploads in arrival order. Everything listed");
    console.log("   below WOULD BE HIDDEN if the feature were on for that supplier.\n");

    const sectorName = new Map();
    (await db.collection("sectors").get()).forEach((d) => sectorName.set(d.id, d.data().sectorCode || d.id));
    const airlineName = new Map();
    (await db.collection("airlines").get()).forEach((d) => airlineName.set(d.id, d.data().code || d.id));

    const full = await db.collection("agent_fares").get();
    const byAgent = new Map();
    full.forEach((d) => {
      const f = { id: d.id, ...d.data() };
      if (!COMPLETE_SOURCES.has(String(f.ingestSource || ""))) return;
      const k = String(f.agentId || "");
      if (!byAgent.has(k)) byAgent.set(k, []);
      byAgent.get(k).push(f);
    });

    let grand = 0;
    for (const [id, rows] of [...byAgent].sort((a, b) => Number(a[0]) - Number(b[0]))) {
      const groups = new Map();
      for (const r of rows) {
        const b = String(r.ingestBatchId || "(none)");
        if (!groups.has(b)) groups.set(b, []);
        groups.get(b).push(r);
      }
      const ordered = [...groups.entries()]
        .map(([bid, rs]) => ({
          bid,
          rs,
          t: rs.map((r) => (r.createdAt && r.createdAt.toDate ? r.createdAt.toDate() : new Date(0)))
            .sort((a, b) => a - b)[0],
        }))
        .sort((a, b) => a.t - b.t);

      // Replay exactly as ingest does: supersede first, then absence, against
      // only the rows that were visible at that moment.
      const written = [];
      const hidden = new Set();
      const killed = [];
      for (const b of ordered) {
        const existing = written.filter((r) => !hidden.has(r.id));
        for (const x of planSupersede(b.rs, existing)) hidden.add(x);
        for (const x of planAbsenceSoldOut(b.rs, existing, { now: b.t, minRows, minAgeMs })) {
          hidden.add(x);
          const r = written.find((w) => w.id === x);
          if (r) killed.push({ at: b.t, r });
        }
        written.push(...b.rs);
      }
      if (!killed.length) continue;
      grand += killed.length;
      console.log(`  agent ${id} ${(agents.get(id) || {}).name || "?"} — ${ordered.length} uploads, ${rows.length} rows → would hide ${killed.length}`);
      for (const k of killed.slice(0, 15)) {
        const fd = k.r.flightDate && k.r.flightDate.toDate
          ? k.r.flightDate.toDate().toISOString().slice(0, 10) : "?";
        console.log(`      ${k.at.toISOString().slice(11, 16)}  ${String(sectorName.get(k.r.sectorId) || k.r.sectorId).padEnd(16)}` +
          ` ${String(airlineName.get(k.r.airlineId) || k.r.airlineId).padEnd(4)} ${fd}  INR ${k.r.finalRate}`);
      }
      if (killed.length > 15) console.log(`      … ${killed.length - 15} more`);
    }
    console.log(`\n  TOTAL would hide: ${grand} of ${full.size} live fares`);
    if (!APPLY) return;
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
