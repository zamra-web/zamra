"use strict";

// Exercises n8n/zamra-whatsapp-intake.workflow.json — the workflow that turns a
// supplier's WhatsApp message into agent_fares rows with nobody clicking Submit.
//
// It deliberately extracts NOTHING itself: it assembles a payload and posts it
// to the zamra-rates webhook the Rate Upload tab already uses, so the vision
// prompt, the closed sector/airline vocabulary and the rate band exist once.
// The test that matters most here is the contract one — if the payload this
// builds ever stops matching what that webhook consumes, this file fails
// instead of production.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const intake = require(path.join(__dirname, "..", "..", "n8n", "zamra-whatsapp-intake.workflow.json"));
const rates = require(path.join(__dirname, "..", "..", "n8n", "zamra-rates.workflow.json"));

const nodeOf = (workflow, name) => {
  const node = workflow.nodes.find((n) => n.name === name);
  assert.ok(node, `workflow has no node named "${name}"`);
  return node;
};

/** Same mock runtime as n8n-workflow.test.js, plus $input and $execution. */
function runNode(name, { json, input = null, nodes = {}, executionId = "4711" }) {
  const $ = (n) => {
    assert.ok(n in nodes, `mock is missing node "${n}"`);
    return { first: () => ({ json: nodes[n] }) };
  };
  $.first = () => ({ json });
  const $input = { all: () => (input || [{ json }]) };
  const $execution = { id: executionId };
  return new Function(
    "$json", "$", "$input", "$execution",
    nodeOf(intake, name).parameters.jsCode,
  )(json, $, $input, $execution);
}

const BATCH = {
  batchId: "B1",
  agentId: "102",
  agentName: "Al Noor Travels",
  chatId: "919812345678@c.us",
  rawText: "*CCJ JED IX FARES*\n04 MAR 15500\n05 MAR 15800",
  media: [
    { messageId: "m1", path: "/api/files/a.jpg", mimetype: "image/jpeg", likelyExpired: false },
    { messageId: "m2", path: "/api/files/b.png", mimetype: "image/png", likelyExpired: false },
  ],
};

// ── the contract that justifies the self-webhook call ───────────────────────

test("Build Rate Payload emits exactly the zamra-rates webhook contract", () => {
  const [out] = runNode("Build Rate Payload", {
    json: BATCH,
    nodes: { "Loop Batches": BATCH },
    input: [
      { json: { name: "whatsapp-1.jpeg", mimetype: "image/jpeg", b64: "AAAA" } },
      { json: { name: "whatsapp-2.png", mimetype: "image/png", b64: "BBBB" } },
    ],
  });

  // These are the keys n8n/README.md documents the portal sending, and the keys
  // Build Vision Request in zamra-rates.workflow.json reads.
  for (const key of ["agent_id", "raw_text", "parsed_rows", "images", "image_count", "timestamp", "source"]) {
    assert.ok(key in out.json, `payload is missing "${key}"`);
  }
  assert.equal(out.json.agent_id, "102");
  assert.equal(out.json.raw_text, BATCH.rawText);
  assert.equal(out.json.source, "whatsapp-intake");
  assert.equal(out.json.batch_id, "B1");
  assert.equal(out.json.image_count, 2);

  // Each image must carry the four keys the vision request assembles a data URL
  // from: data:<mime_type>;base64,<data>.
  for (const image of out.json.images) {
    assert.deepEqual(Object.keys(image).sort(), ["data", "mime_type", "name", "size"]);
    assert.match(image.mime_type, /^image\//);
    assert.ok(image.data.length > 0);
  }
});

test("Build Rate Payload feeds the vision node the same shape the portal does", () => {
  // Run the intake output straight through zamra-rates' first Code node. If the
  // two workflows have drifted, this throws or produces no image parts.
  const [payload] = runNode("Build Rate Payload", {
    json: BATCH,
    nodes: { "Loop Batches": BATCH },
    input: [{ json: { name: "whatsapp-1.jpeg", mimetype: "image/jpeg", b64: "AAAA" } }],
  });

  // In zamra-rates, Build Vision Request sits after Fetch Flight Details, so
  // $json is the route catalogue and the payload arrives via the webhook node.
  const visionCode = nodeOf(rates, "Build Vision Request").parameters.jsCode;
  const catalogue = { details: { "IX_CCJJED": { flightTime: "19:40 - 22:55" } } };
  const mocked = { "Rate Upload Webhook": { body: payload.json }, "Fetch Flight Details": catalogue };
  const $ = (n) => {
    assert.ok(n in mocked, `vision request reached for unmocked node "${n}"`);
    return { first: () => ({ json: mocked[n] }) };
  };
  const out = new Function("$json", "$", visionCode)(catalogue, $);

  assert.ok(Array.isArray(out) && out.length > 0, "vision request produced nothing");
  const serialized = JSON.stringify(out);
  assert.match(serialized, /data:image\/jpeg;base64,AAAA/, "the image never reached the vision request");
  assert.match(serialized, /CCJ JED/, "the sector catalogue was not injected");
});

test("Build Rate Payload normalises image/jpg, matching what zamra-rates accepts", () => {
  const [out] = runNode("Build Rate Payload", {
    json: BATCH,
    nodes: { "Loop Batches": BATCH },
    input: [{ json: { name: "whatsapp-1.jpg", mimetype: "image/jpg", b64: "AAAA" } }],
  });
  assert.equal(out.json.images[0].mime_type, "image/jpeg");
});

test("Build Rate Payload records a failed download instead of dropping it silently", () => {
  const [out] = runNode("Build Rate Payload", {
    json: BATCH,
    nodes: { "Loop Batches": BATCH },
    input: [
      { json: { name: "whatsapp-1.jpeg", mimetype: "image/jpeg", b64: "AAAA" } },
      // WAHA expired this file, or the download 404'd. The good one must still go.
      { json: { name: "whatsapp-2.png", mimetype: "image/png" } },
    ],
  });

  assert.equal(out.json.image_count, 1);
  assert.equal(out.json.skipped_images.length, 1);
  assert.equal(out.json.skipped_images[0].reason, "download failed");
});

test("Build Rate Payload caps images and total size the way the portal does", () => {
  const many = Array.from({ length: 14 }, (_, i) => ({
    json: { name: `whatsapp-${i}.jpeg`, mimetype: "image/jpeg", b64: "A".repeat(1000) },
  }));
  const [capped] = runNode("Build Rate Payload", {
    json: BATCH, nodes: { "Loop Batches": BATCH }, input: many,
  });
  assert.equal(capped.json.image_count, 10, "image cap must match the portal's 10");
  assert.equal(capped.json.skipped_images.filter((s) => s.reason === "image cap").length, 4);

  const huge = Array.from({ length: 4 }, (_, i) => ({
    json: { name: `big-${i}.jpeg`, mimetype: "image/jpeg", b64: "A".repeat(6 * 1024 * 1024) },
  }));
  const [sized] = runNode("Build Rate Payload", {
    json: BATCH, nodes: { "Loop Batches": BATCH }, input: huge,
  });
  assert.ok(sized.json.image_count < 4, "the 12 MB budget must reject something");
  assert.ok(sized.json.skipped_images.some((s) => s.reason === "size cap"));
});

test("a text-only sheet still produces a valid payload", () => {
  // The common case: suppliers mostly type their rates rather than screenshot them.
  const textOnly = { ...BATCH, media: [] };
  const [out] = runNode("Build Rate Payload", {
    json: textOnly, nodes: { "Loop Batches": textOnly }, input: [{ json: {} }],
  });
  assert.equal(out.json.image_count, 0);
  assert.equal(out.json.raw_text, BATCH.rawText);
  assert.equal(out.json.agent_id, "102");
});

// ── the other Code nodes ────────────────────────────────────────────────────

test("Split Batches ends the run quietly when the queue is empty", () => {
  // Returning [] means nothing downstream executes — no IF node needed, and no
  // spurious failure on the 470-odd empty runs a day this makes.
  assert.deepEqual(runNode("Split Batches", { json: { ok: true, enabled: true, batches: [] } }), []);
  assert.deepEqual(runNode("Split Batches", { json: { ok: true, enabled: false, batches: [] } }), []);
  assert.deepEqual(runNode("Split Batches", { json: {} }), []);

  const two = runNode("Split Batches", { json: { batches: [BATCH, { ...BATCH, batchId: "B2" }] } });
  assert.equal(two.length, 2);
  assert.equal(two[0].json.batchId, "B1");
});

test("Media To Items keeps the WAHA host in the workflow, not in the payload", () => {
  const items = runNode("Media To Items", { json: BATCH });
  assert.equal(items.length, 2);
  // The Cloud Function hands over an allow-listed PATH; prefixing the host is
  // the workflow's job, so a crafted media.url can never redirect the fetch.
  assert.equal(items[0].json.path, "/api/files/a.jpg");
  assert.ok(!JSON.stringify(items).includes("http"), "no absolute URL may come from the payload");
  assert.equal(items[0].json.batchId, "B1");
  assert.match(items[0].json.name, /\.jpeg$/);
  assert.match(items[1].json.name, /\.png$/);
});

// ── wiring invariants ───────────────────────────────────────────────────────

test("Extract Rates never retries, because a retried ingest is a duplicated ingest", () => {
  // ingestFaresFromN8n writes a new auto-id doc per row and never dedupes, so a
  // retry after a partial success republishes every fare at the second reading.
  const node = nodeOf(intake, "Extract Rates");
  assert.notEqual(node.retryOnFail, true);
});

test("Extract Rates calls the existing webhook on localhost, not through Traefik", () => {
  const node = nodeOf(intake, "Extract Rates");
  assert.equal(node.parameters.url, "http://localhost:5678/webhook/zamra-rates");
  assert.equal(node.parameters.url.includes(rates.nodes.find((n) => n.type === "n8n-nodes-base.webhook").parameters.path), true);
  // Long enough for gpt-5-mini on a dense rate sheet.
  assert.ok(node.parameters.options.timeout >= 300000);
});

test("every failure path reaches a complete-with-failed call", () => {
  // The mirror of zamra-rates' "must always respond": a batch that is claimed
  // and never completed sits leased until it goes stale and needs a human.
  const failed = "Complete Failed";
  const { connections } = intake;

  assert.deepEqual(connections["Build Rate Payload"].main[1], [{ node: failed, type: "main", index: 0 }]);
  assert.deepEqual(connections["Extract Rates"].main[1], [{ node: failed, type: "main", index: 0 }]);
  // Respond Error in zamra-rates answers HTTP 200 with {success:false}, so an
  // error output can never fire for a parse failure. The IF false branch is
  // what actually catches it.
  assert.deepEqual(connections["Ingest Succeeded?"].main[1], [{ node: failed, type: "main", index: 0 }]);

  const ifNode = nodeOf(intake, "Ingest Succeeded?");
  assert.match(JSON.stringify(ifNode.parameters), /\$json\.success/);
});

test("both completion paths return to the loop, so one batch cannot strand the rest", () => {
  for (const name of ["Complete Batch", "Complete Failed"]) {
    assert.deepEqual(
      intake.connections[name].main[0],
      [{ node: "Loop Batches", type: "main", index: 0 }],
      `${name} must feed the loop`,
    );
    assert.equal(nodeOf(intake, name).onError, "continueRegularOutput");
  }
});

test("the loop runs one batch at a time, bounding memory to one image set", () => {
  const loop = nodeOf(intake, "Loop Batches");
  // n8n strips any parameter equal to its default on re-export, and splitInBatches
  // defaults to 1 — so assert the EFFECTIVE value. Asserting the explicit form
  // would turn a harmless re-export from the UI into a red build, which is how
  // a mirror file stops being re-exported and starts drifting for real.
  assert.equal(loop.parameters.batchSize ?? 1, 1);
  // Output 0 is the "done" branch and must terminate; output 1 carries items.
  assert.deepEqual(intake.connections["Loop Batches"].main[0], []);
  assert.deepEqual(intake.connections["Loop Batches"].main[1], [{ node: "Has Media?", type: "main", index: 0 }]);
});

test("the media branch and the no-media branch both reach the merge", () => {
  // Without the No Media branch, a text-only sheet — the common case — would
  // stall at the merge and the batch would go stale.
  assert.deepEqual(intake.connections["Has Media?"].main[0], [{ node: "Media To Items", type: "main", index: 0 }]);
  assert.deepEqual(intake.connections["Has Media?"].main[1], [{ node: "No Media", type: "main", index: 0 }]);
  assert.deepEqual(intake.connections["Encode Media"].main[0], [{ node: "Merge Media", type: "main", index: 0 }]);
  assert.deepEqual(intake.connections["No Media"].main[0], [{ node: "Merge Media", type: "main", index: 1 }]);
  assert.equal(nodeOf(intake, "Merge Media").parameters.numberInputs ?? 2, 2);
});

test("a single dead file does not fail the whole batch", () => {
  for (const name of ["Download Media", "Encode Media"]) {
    const node = nodeOf(intake, name);
    assert.equal(node.onError, "continueRegularOutput", `${name} must continue past one bad file`);
    assert.equal(node.alwaysOutputData, true);
  }
});

test("the binary property name agrees end to end, explicitly or by default", () => {
  // Download Media writes the file to a binary property and Encode Media reads
  // it back; both default to "data". If either is ever set explicitly, they must
  // still name the SAME property or every image silently arrives without b64.
  const download = nodeOf(intake, "Download Media");
  const encode = nodeOf(intake, "Encode Media");
  const written = download.parameters.options?.response?.response?.outputPropertyName ?? "data";
  const read = encode.parameters.binaryPropertyName ?? "data";
  assert.equal(written, read);
  assert.equal(encode.parameters.destinationKey, "b64", "Build Rate Payload reads item.json.b64");
});

test("this workflow is a Schedule Trigger, not a fourth Cloud Scheduler job", () => {
  // Google bills per Cloud Scheduler job beyond the first three, and this
  // project runs exactly three on purpose.
  const trigger = nodeOf(intake, "Intake Schedule");
  assert.equal(trigger.type, "n8n-nodes-base.scheduleTrigger");
  assert.equal(trigger.parameters.rule.interval[0].minutesInterval, 3);
});

test("no secret is inlined; both authenticated calls use a credential", () => {
  for (const name of ["Claim Batches", "Complete Batch", "Complete Failed", "Download Media"]) {
    const node = nodeOf(intake, name);
    assert.ok(node.credentials?.httpHeaderAuth, `${name} must authenticate through a credential`);
  }
  assert.ok(
    !/Bearer\s+\w|x-api-key\s*[:=]\s*\w/i.test(JSON.stringify(intake)),
    "no token may be inlined in the workflow JSON",
  );
});

test("every node the workflow declares is actually wired", () => {
  const named = new Set(intake.nodes.map((n) => n.name));
  const referenced = new Set(Object.keys(intake.connections));
  for (const outputs of Object.values(intake.connections)) {
    for (const branch of outputs.main) {
      for (const link of branch) {
        assert.ok(named.has(link.node), `connection points at unknown node "${link.node}"`);
        referenced.add(link.node);
      }
    }
  }
  for (const name of named) {
    assert.ok(referenced.has(name), `node "${name}" is orphaned`);
  }
});
