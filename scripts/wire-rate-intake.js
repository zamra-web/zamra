#!/usr/bin/env node
/**
 * One-off: wire the supplier announcement groups into agents.rateIntake* fields.
 *
 * Values were read from the live WAHA instance on 2026-09-02 — group ids from
 * GET /api/{session}/groups, posting numbers from the actual message history of
 * each group (_data.key.participantAlt), not from group ownership, which turned
 * out to name the wrong person for four suppliers out of five.
 *
 * Safe to re-run: every write is a merge, and each agent is verified by name
 * before it is touched, so a renumbered agents collection makes this skip rather
 * than write the wrong supplier's config.
 *
 * Run:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/wire-rate-intake.js            # dry run, prints the diff
 *   GOOGLE_APPLICATION_CREDENTIALS=~/.config/zamra/zamra-web-01-sa.json \
 *     node scripts/wire-rate-intake.js --apply    # actually writes
 */

"use strict";

// firebase-admin is a dependency of functions/, not of the repo root, so it is
// resolved from there rather than requiring a NODE_PATH the caller must remember.
const path = require("path");
const { createRequire } = require("module");
const requireFromFunctions = createRequire(path.join(__dirname, "..", "functions", "package.json"));
const admin = requireFromFunctions("firebase-admin");

const APPLY = process.argv.includes("--apply");

admin.initializeApp({ projectId: "zamra-web-01" });
const db = admin.firestore();
const FV = admin.firestore.FieldValue;

/**
 * `name` is asserted against the stored document before anything is written.
 * `num` null means the supplier posts from a number we have not seen yet: the
 * group is linked so the traffic mirrors, and the first rate-shaped message
 * records its sender as `rateIntakeSeenSender` for approval.
 */
const PLAN = [
  // Santorian posts from five numbers; the busiest goes in whatsappNumber and the
  // rest in senders. Confirmed 2026-09-02 that agent 1 "Mustaque" is Santorian —
  // the records name the contact, not the business, throughout (Niba gafoor is
  // Airguide, AMEER.G is Glansa, SHIMIL MJI is Flyora).
  { id: "1", name: "Mustaque", num: "+918893794427",
    groups: ["120363407041069291@g.us"],
    senders: ["918089420222@c.us", "919400351796@c.us", "917736870222@c.us", "919072422522@c.us"] },
  { id: "2", name: "Amie", num: "+919447631419", groups: ["120363411379659977@g.us"], senders: [] },
  { id: "4", name: "Niba gafoor", num: "+919207703370", groups: ["120363404452854249@g.us"], senders: ["919207703371@c.us"] },
  { id: "5", name: "Jubair", num: "+917025060055", groups: ["120363426777820011@g.us"], senders: [] },
  { id: "6", name: "Samad", num: null, groups: ["120363421418897405@g.us"], senders: [] },
  // Aysha broadcasts, which arrives as an ordinary 1:1 chat. No group, and no
  // verified senders: for a direct chat the chat id IS the sender.
  { id: "7", name: "AYSHA", num: "+918943227700", groups: [], senders: [] },
  { id: "8", name: "AMEER.G", num: "+918714664639", groups: ["120363402822330940@g.us"], senders: ["918714664645@c.us"] },
  { id: "9", name: "SHUHAIB.MA", num: "+919746366606", groups: ["120363149915735185@g.us"], senders: [] },
  { id: "11", name: "TWGROUP", num: "+919447424327", groups: ["120363431262351055@g.us"], senders: [] },
  { id: "12", name: "SHIMIL MJI", num: "+919895261451", groups: ["120363420301869785@g.us"], senders: [] },
  // Flyunited's community lists three groups and zamrabot is in two; its
  // Announcements group is empty. If rates turn out to flow in the third,
  // replace this id with that group's.
  { id: "13", name: "FLY.UNITED", num: "+919809883343", groups: ["120363428053040134@g.us"], senders: [] },
];

function chatIdFor(num) {
  return `${String(num).replace(/[^0-9]/g, "")}@c.us`;
}

async function main() {
  console.log(APPLY ? "APPLYING writes\n" : "DRY RUN — nothing is written. Re-run with --apply\n");

  let wrote = 0;
  let skipped = 0;

  for (const p of PLAN) {
    const ref = db.collection("agents").doc(p.id);
    const snap = await ref.get();

    if (!snap.exists) {
      console.log(`  SKIP  ${p.id} — no agents/${p.id} document`);
      skipped += 1;
      continue;
    }

    // Guard against a renumbered collection writing one supplier's groups onto
    // another. A wrong agentId here would file ingested fares under the wrong
    // supplier, at the wrong commission.
    const actual = String(snap.data().name ?? "").trim();
    if (actual !== p.name) {
      console.log(`  SKIP  ${p.id} — expected "${p.name}", document says "${actual}"`);
      skipped += 1;
      continue;
    }

    const patch = {
      rateIntakeMode: "auto",
      rateIntakeGroupIds: p.groups,
      rateIntakeSenderIds: p.senders,
      updatedAt: FV.serverTimestamp(),
    };
    if (p.num) {
      patch.whatsappNumber = p.num;
      patch.whatsappChatId = chatIdFor(p.num);
    }

    if (APPLY) await ref.set(patch, { merge: true });
    wrote += 1;
    console.log(
      `  ${APPLY ? "WROTE" : "would"} ${p.id.padStart(2)} ${p.name.padEnd(13)}` +
      ` num=${(p.num ?? "(none yet)").padEnd(14)} groups=${p.groups.length} senders=${p.senders.length}`,
    );
  }

  if (APPLY) {
    // db.js stamps this whenever a group link changes; the webhook reads
    // config/whatsapp on every event, so a stamp newer than the supplier cache
    // forces a re-read on the very next message instead of up to five minutes
    // later. Writing the agents directly bypasses db.js, so stamp it here.
    await db.collection("config").doc("whatsapp").set(
      { rateIntakeGroupsUpdatedAt: FV.serverTimestamp() },
      { merge: true },
    );
    console.log("\n  stamped config/whatsapp.rateIntakeGroupsUpdatedAt");
  }

  console.log(`\n  ${APPLY ? "written" : "would write"}: ${wrote}   skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
});
