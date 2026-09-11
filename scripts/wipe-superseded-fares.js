#!/usr/bin/env node
/**
 * Delete the hidden, superseded rows sitting in `agent_fares`.
 *
 * A supersede HIDES the row it replaces rather than deleting it, on the
 * reasoning that "what were we quoting at 11:00" is worth keeping when a
 * customer disputes a price (see functions/fareSupersede.js). That was written
 * assuming the collection was cleared daily. It is not: on 2026-09-12 it held
 * 7,700 rows spanning three days, 5,509 of them hidden — every one of them a
 * price with a live replacement sitting beside it, read by nothing.
 *
 * This removed that backlog on 2026-09-12. Ingest has since been changed to
 * DELETE the row it supersedes rather than hide it, so nothing writes
 * `supersededAt` any more and a run today should find zero — which makes this a
 * check as much as a cleanup: a non-zero count means something started hiding
 * rows again. It is NOT part of any pipeline, and it is deliberately
 * conservative about what counts as dead:
 *
 *   supersededAt required   A row is only deleted if a later upload actually
 *                           replaced it. That field is what separates "history"
 *                           from every other reason a row can be invisible.
 *
 *   switches respected      `bulkToggleAgentVisibility` and
 *                           `bulkToggleSectorVisibility` hide fares as a
 *                           REVERSIBLE switch — an admin expects "Show" to
 *                           bring them back. Rows belonging to a supplier with
 *                           `isActive: false` or a sector with `isHidden: true`
 *                           are therefore never touched, even if they also
 *                           carry supersededAt.
 *
 *   re-checked at delete    The guards are evaluated against the documents read
 *                           in this run, not a prior audit, so a supplier
 *                           switched off mid-run is still safe.
 *
 * Rows hidden for any other reason — an admin hiding one fare from the Database
 * tab, an ingest row whose sheet said "sold out" — have no supersededAt and are
 * left alone. They are somebody's decision, not dead weight.
 *
 * Dry run (reads only, prints the breakdown):
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/wipe-superseded-fares.js
 *
 * Then, to delete:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/wipe-superseded-fares.js --apply
 *
 * There is no undo. Safe to re-run: a second pass finds nothing.
 */

"use strict";

const path = require("path");
const { createRequire } = require("module");
const requireFromFunctions = createRequire(path.join(__dirname, "..", "functions", "package.json"));
const admin = requireFromFunctions("firebase-admin");

const APPLY = process.argv.includes("--apply");
/** Firestore's cap is 500 writes per batch; the headroom index.js also leaves. */
const BATCH_LIMIT = 400;

admin.initializeApp({ projectId: "zamra-web-01" });
const db = admin.firestore();

async function main() {
  // The two reversible switches. Read first so the filter below can honour a
  // supplier or sector that is merely switched off rather than superseded.
  const inactiveAgents = new Map();
  (await db.collection("agents").get()).forEach((d) => {
    if (d.data().isActive === false) inactiveAgents.set(d.id, d.data().name || d.id);
  });
  const hiddenSectors = new Map();
  (await db.collection("sectors").get()).forEach((d) => {
    if (d.data().isHidden === true) hiddenSectors.set(d.id, d.data().sectorCode || d.id);
  });

  console.log("── protected by a visibility switch ─────────────────────────");
  console.log("  suppliers off :", inactiveAgents.size ? [...inactiveAgents].map(([i, n]) => `${i} ${n}`).join(", ") : "none");
  console.log("  sectors off   :", hiddenSectors.size ? [...hiddenSectors].map(([i, c]) => `${i} ${c}`).join(", ") : "none");

  const snap = await db.collection("agent_fares").where("isHidden", "==", true).get();

  const doomed = [];
  const kept = { "switched off": 0, "no supersededAt (someone's decision)": 0 };
  for (const doc of snap.docs) {
    const f = doc.data();
    if (inactiveAgents.has(String(f.agentId)) || hiddenSectors.has(String(f.sectorId))) {
      kept["switched off"]++;
      continue;
    }
    if (!f.supersededAt) {
      kept["no supersededAt (someone's decision)"]++;
      continue;
    }
    doomed.push(doc);
  }

  const byAgent = {};
  for (const d of doomed) {
    const a = String(d.data().agentId || "?");
    byAgent[a] = (byAgent[a] || 0) + 1;
  }

  console.log("\n── hidden rows ──────────────────────────────────────────────");
  console.log(`  total hidden        : ${snap.size}`);
  console.log(`  superseded, delete  : ${doomed.length}`);
  for (const [reason, n] of Object.entries(kept)) {
    if (n) console.log(`  kept, ${reason.padEnd(14)}: ${n}`);
  }
  console.log("  per supplier        :", JSON.stringify(byAgent));

  if (!APPLY) {
    console.log("\nDry run — nothing deleted. Re-run with --apply.");
    return;
  }

  let done = 0;
  for (let i = 0; i < doomed.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    for (const doc of doomed.slice(i, i + BATCH_LIMIT)) batch.delete(doc.ref);
    await batch.commit();
    done += Math.min(BATCH_LIMIT, doomed.length - i);
    process.stdout.write(`\r  deleted ${done}/${doomed.length}`);
  }
  console.log("\n");

  const after = await db.collection("agent_fares").select("isHidden").get();
  const stillHidden = after.docs.filter((d) => d.data().isHidden === true).length;
  console.log(`agent_fares now: ${after.size} rows, ${stillHidden} hidden`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
