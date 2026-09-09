#!/usr/bin/env node
/**
 * Approve a supplier's desk numbers as WhatsApp rate-intake senders.
 *
 * Fixes the never-wired-senders bug: an announcement group is linked, but the
 * numbers that actually post into it were never added to `rateIntakeSenderIds`,
 * so every sheet is discarded `sender-not-verified`. Nothing about that is an
 * error — the message is marked skipped, no batch is created, and the agent's
 * config still reads as correct because it *is* correct and merely incomplete.
 * It reached fourteen suppliers before anyone noticed.
 *
 * It costs more than fares. `applySoldOut` gates on the same check, so an
 * unapproved number's "CCJ AAN 09 SEP SOLD OUT" is dropped too, leaving a
 * flight bookable that is gone. Agents 1 and 13 were losing almost nothing BUT
 * sold-out notices, so a sweep counting only rate-shaped messages calls them
 * healthy. The dashboard's "numbers sent rate sheets that were thrown away"
 * warning is the standing detector; this script is how you act on it.
 *
 * ── The numbers live OUTSIDE this repo ──────────────────────────────────────
 * github.com/zamra-web/zamra is PUBLIC and these are supplier staff mobile
 * numbers, so the roster is read from a local file, default:
 *
 *   ~/.config/zamra/supplier-senders.json   (chmod 600)
 *
 * shaped { agents: { "<id>": { name, senders: [[address, why], …] } },
 *          excluded: { "<id>": [[address, why], …] } }.
 *
 * `excluded` are real supplier numbers that must NOT be approved, because they
 * staff the visa/attestation desk in the same group. Their price tables trip the
 * rate-shape heuristic, so approving one buys a detail:high vision call per post
 * and returns nothing — the closed sector vocabulary rejects every row. Verify
 * what a number posts before adding it to either list.
 *
 * They ARE written, to `rateIntakeIgnoredSenderIds` — a field the dashboard
 * warning reads and `rateIntake.js` does not. Their sheets stay rejected exactly
 * as before; the only effect is that a number triaged once stops appearing in
 * the "sheets thrown away" warning, so that warning can reach zero. A warning
 * that permanently shows known-fine rows is one people stop reading.
 *
 * Additive by design: `arrayUnion`, never a blind overwrite, and every agent is
 * verified by name before it is touched, so a renumbered collection skips rather
 * than approving one supplier's desk under another's commission.
 *
 * Run:
 *   node scripts/approve-supplier-senders.js               # dry run, all agents
 *   node scripts/approve-supplier-senders.js --apply
 *   node scripts/approve-supplier-senders.js --agent 11 --apply
 *   ZAMRA_SENDER_ROSTER=/path/to/roster.json node scripts/approve-supplier-senders.js
 */

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRequire } = require("module");

// firebase-admin is a dependency of functions/, not of the repo root, so it is
// resolved from there rather than requiring a NODE_PATH the caller must set.
const requireFromFunctions = createRequire(path.join(__dirname, "..", "functions", "package.json"));
const admin = requireFromFunctions("firebase-admin");

const APPLY = process.argv.includes("--apply");
const agentFlag = process.argv.indexOf("--agent");
const ONLY_AGENT = agentFlag !== -1 ? String(process.argv[agentFlag + 1] || "").trim() : "";

const ROSTER_PATH = process.env.ZAMRA_SENDER_ROSTER ||
  path.join(os.homedir(), ".config", "zamra", "supplier-senders.json");
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(os.homedir(), ".config", "zamra", "zamra-web-01-sa.json");

if (!fs.existsSync(ROSTER_PATH)) {
  console.error(`No sender roster at ${ROSTER_PATH}.\n` +
    "It is kept out of the repo on purpose — see the header. Set ZAMRA_SENDER_ROSTER to point elsewhere.");
  process.exit(1);
}

const roster = JSON.parse(fs.readFileSync(ROSTER_PATH, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(require(KEY_PATH)) });
const db = admin.firestore();
const FV = admin.firestore.FieldValue;

async function main() {
  console.log(APPLY ? "APPLYING writes\n" : "DRY RUN — nothing is written. Re-run with --apply\n");

  const entries = Object.entries(roster.agents || {})
    .filter(([id]) => !ONLY_AGENT || id === ONLY_AGENT)
    .sort((a, b) => Number(a[0]) - Number(b[0]));

  if (!entries.length) {
    console.log(ONLY_AGENT ? `No roster entry for agent ${ONLY_AGENT}.` : "Roster is empty.");
    return;
  }

  let added = 0;
  let ignored = 0;
  let skipped = 0;

  for (const [id, plan] of entries) {
    const ref = db.collection("agents").doc(id);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`  SKIP agent ${id} — no document`); skipped++; continue; }

    const data = snap.data() || {};
    const actual = String(data.name ?? "").trim();
    if (actual !== plan.name) {
      console.log(`  SKIP agent ${id} — expected "${plan.name}", document says "${actual}"`);
      skipped++;
      continue;
    }

    const existing = new Set((data.rateIntakeSenderIds || []).map((s) => String(s).toLowerCase()));
    const senders = plan.senders || [];
    const toAdd = senders.filter(([address]) => !existing.has(String(address).toLowerCase()));

    console.log(`agent ${id.padStart(2)} ${actual}  (${existing.size} already approved)`);
    for (const [address, why] of senders) {
      const have = existing.has(String(address).toLowerCase());
      console.log(`   ${have ? "have " : APPLY ? "ADD  " : "would"} ${String(address).padEnd(22)} ${why}`);
    }
    const ignoredNow = new Set((data.rateIntakeIgnoredSenderIds || []).map((s) => String(s).toLowerCase()));
    const excluded = (roster.excluded || {})[id] || [];
    const toIgnore = excluded.filter(([address]) => !ignoredNow.has(String(address).toLowerCase()));
    for (const [address, why] of excluded) {
      const have = ignoredNow.has(String(address).toLowerCase());
      console.log(`   ${have ? "excl " : APPLY ? "EXCL " : "would"} ${String(address).padEnd(22)} not a fare desk — ${why}`);
    }

    if (APPLY && (toAdd.length || toIgnore.length)) {
      const patch = { updatedAt: FV.serverTimestamp() };
      if (toAdd.length) patch.rateIntakeSenderIds = FV.arrayUnion(...toAdd.map(([a]) => a));
      if (toIgnore.length) patch.rateIntakeIgnoredSenderIds = FV.arrayUnion(...toIgnore.map(([a]) => a));
      await ref.set(patch, { merge: true });
    }
    added += toAdd.length;
    ignored += toIgnore.length;
  }

  if (APPLY && (added || ignored)) {
    // The webhook caches the supplier allow-list for five minutes, and a message
    // is evaluated exactly once on arrival — so without this a sheet sent inside
    // that window is lost rather than merely late.
    await db.collection("config").doc("whatsapp").set({
      rateIntakeGroupsUpdatedAt: FV.serverTimestamp(),
    }, { merge: true });
  }

  console.log(`\n${APPLY ? "Added" : "Would add"} ${added} sender(s), ` +
    `${APPLY ? "marked" : "would mark"} ${ignored} as not-a-fare-desk; ${skipped} agent(s) skipped.`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err.message); process.exit(1); });
