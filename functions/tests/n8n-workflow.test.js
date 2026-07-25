"use strict";

// Exercises the Code nodes inside n8n/zamra-rates.workflow.json against a mock
// n8n runtime. The workflow is the only thing standing between a supplier's
// screenshot and agent_fares, so its validation must stay honest — and its
// output must keep matching what ingestFaresFromN8n reads.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const workflow = require(path.join(__dirname, "..", "..", "n8n", "zamra-rates.workflow.json"));

const codeOf = (name) => {
  const node = workflow.nodes.find((n) => n.name === name);
  assert.ok(node, `workflow has no node named "${name}"`);
  return node.parameters.jsCode;
};

/**
 * Runs a Code node body with `$json` and `$('Node Name')` stubbed the way n8n
 * exposes them.
 * @param {string} name
 * @param {{json: object, nodes?: object}} ctx
 * @return {Array<{json: object}>}
 */
function runNode(name, { json, nodes = {} }) {
  const $ = (n) => {
    assert.ok(n in nodes, `mock is missing node "${n}"`);
    return { first: () => ({ json: nodes[n] }) };
  };
  return new Function("$json", "$", codeOf(name))(json, $);
}

const FLIGHT_DETAILS = {
  details: {
    "IX_CCJJED": { flightTime: "19:40 - 22:55", baggage: 30 },
    "SG_COKDXB": { flightTime: "04:05 - 11:10", baggage: 30 },
    "G9_CCJSHJ": { flightTime: "", baggage: 30 },
  },
};

const WEBHOOK_BODY = {
  body: {
    agent_id: "102",
    raw_text: "*CCJ JED IX FARES*\n04 MAR 15500\n05 MAR 15500",
    images: [
      { name: "sheet.png", mime_type: "image/png", size: 1234, data: "AAAA" },
      { name: "photo.jpg", mime_type: "image/jpg", size: 2345, data: "BBBB" },
      { name: "notes.pdf", mime_type: "application/pdf", size: 99, data: "CCCC" },
      { name: "empty.png", mime_type: "image/png", size: 0, data: "" },
    ],
  },
};

const META = {
  agent_id: "102",
  valid_sectors: ["CCJ JED", "COK DXB"],
  valid_airlines: ["IX", "SG"],
  skipped_images: ["notes.pdf"],
};

/** Shapes an OpenAI chat-completions response the way the workflow reads it. */
const openaiResponse = (rows, notes = "") => ({
  choices: [
    { finish_reason: "stop", message: { role: "assistant", content: JSON.stringify({ rows, notes }) } },
  ],
  usage: { prompt_tokens: 100, completion_tokens: 50 },
});

/** User-turn content parts of the built request. */
const userContent = (built) => built.request.messages[1].content;

test("every Code node in the workflow parses", () => {
  const codeNodes = workflow.nodes.filter((n) => n.type === "n8n-nodes-base.code");
  assert.ok(codeNodes.length >= 2);
  for (const node of codeNodes) {
    assert.doesNotThrow(() => new Function(node.parameters.jsCode), `${node.name} has a syntax error`);
  }
});

test("Build Vision Request merges text and images and normalizes media types", () => {
  const built = runNode("Build Vision Request", {
    json: FLIGHT_DETAILS,
    nodes: { "Rate Upload Webhook": WEBHOOK_BODY },
  })[0].json;

  assert.equal(built.agent_id, "102");
  assert.deepEqual(built.valid_sectors, ["CCJ JED", "CCJ SHJ", "COK DXB"]);
  assert.deepEqual(built.valid_airlines, ["G9", "IX", "SG"]);
  // A PDF and a zero-byte image are reported, not silently dropped.
  assert.deepEqual(built.skipped_images, ["notes.pdf", "empty.png"]);

  const images = userContent(built).filter((b) => b.type === "image_url");
  assert.equal(images.length, 2);
  assert.ok(images[0].image_url.url.startsWith("data:image/png;base64,AAAA"));
  assert.ok(
    images[1].image_url.url.startsWith("data:image/jpeg;base64,BBBB"),
    "image/jpg must be normalized to image/jpeg",
  );
  // Rate sheets are dense grids of small digits — low detail downsamples them.
  assert.equal(images[0].image_url.detail, "high");
  assert.ok(userContent(built).some((b) => b.type === "text" && b.text.includes("04 MAR 15500")));
});

test("Build Vision Request pins the model, schema, and route catalogue", () => {
  const req = runNode("Build Vision Request", {
    json: FLIGHT_DETAILS,
    nodes: { "Rate Upload Webhook": WEBHOOK_BODY },
  })[0].json.request;

  assert.equal(req.model, "gpt-5-mini");
  assert.equal(req.response_format.type, "json_schema");
  // OpenAI strict mode requires additionalProperties:false on every object and
  // every property listed in `required`.
  const jsonSchema = req.response_format.json_schema;
  assert.equal(jsonSchema.strict, true);
  assert.equal(jsonSchema.schema.additionalProperties, false);
  const item = jsonSchema.schema.properties.rows.items;
  assert.equal(item.additionalProperties, false);
  assert.deepEqual(item.required.sort(), Object.keys(item.properties).sort());
  // route_text carries the printed direction so Build Firebase Payload can catch
  // an origin/destination the model transposed.
  assert.ok(item.properties.route_text, "row schema must include route_text");
  assert.ok(item.required.includes("route_text"), "route_text must be required");

  const system = req.messages[0];
  assert.equal(system.role, "system");
  assert.ok(system.content.includes("CCJ JED, CCJ SHJ, COK DXB"));
  assert.ok(/Today is \d{4}-\d{2}-\d{2}/.test(system.content), "year inference needs today's date");
  assert.ok(/DIRECTION/i.test(system.content), "the prompt must warn the model about route direction");
});

test("Build Vision Request accepts an images-only submission", () => {
  const built = runNode("Build Vision Request", {
    json: FLIGHT_DETAILS,
    nodes: {
      "Rate Upload Webhook": { body: { agent_id: "7", raw_text: "", images: WEBHOOK_BODY.body.images } },
    },
  })[0].json;

  assert.equal(userContent(built).filter((b) => b.type === "image_url").length, 2);
});

test("Build Vision Request refuses payloads it cannot parse", () => {
  const cases = [
    [{ raw_text: "x", images: [] }, /agent_id/],
    [{ agent_id: "1", raw_text: "", images: [] }, /neither/],
  ];
  for (const [body, re] of cases) {
    assert.throws(
      () => runNode("Build Vision Request", {
        json: FLIGHT_DETAILS,
        nodes: { "Rate Upload Webhook": { body } },
      }),
      re,
    );
  }

  assert.throws(
    () => runNode("Build Vision Request", {
      json: { details: {} },
      nodes: { "Rate Upload Webhook": WEBHOOK_BODY },
    }),
    /No flight_details/,
  );
});

test("Build Firebase Payload drops every row that fails validation", () => {
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([
      { sector_code: "ccj jed", flight_code: "ix", date: "2026-03-04", sp_rate: 15500, show: "yes" },
      { sector_code: "CCJ JED", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
      { sector_code: "COK DXB", flight_code: "SG", date: "2026-03-05", sp_rate: 14900, show: "no" },
      { sector_code: "CCJ AUH", flight_code: "IX", date: "2026-03-06", sp_rate: 12000, show: "yes" },
      { sector_code: "CCJ JED", flight_code: "AI", date: "2026-03-07", sp_rate: 12000, show: "yes" },
      { sector_code: "CCJ JED", flight_code: "IX", date: "04-03-2026", sp_rate: 12000, show: "yes" },
      { sector_code: "CCJ JED", flight_code: "IX", date: "2026-03-08", sp_rate: 12, show: "yes" },
      { sector_code: "CCJ JED", flight_code: "IX", date: "2026-03-09", sp_rate: 999999, show: "yes" },
    ], "One sector unreadable."),
    nodes: { "Build Vision Request": META },
  })[0].json;

  assert.deepEqual(out.firebaseData, [
    { agent_id: "102", sector_code: "CCJ JED", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
    { agent_id: "102", sector_code: "COK DXB", flight_code: "SG", date: "2026-03-05", sp_rate: 14900, show: "no" },
  ]);
  assert.equal(out.parsed_count, 2);
  assert.equal(out.rejected.length, 5, "unknown sector/airline, bad date, and both out-of-band rates");
  assert.equal(out.notes, "One sector unreadable.");
});

test("Build Firebase Payload repairs a transposed origin/destination", () => {
  // Both directions are sellable; the model saved the reverse of what the sheet
  // prints. route_text names the two codes in the printed order, so the guard
  // flips sector_code back rather than saving a Jeddah->Calicut fare.
  const meta = { ...META, valid_sectors: ["CCJ JED", "JED CCJ", "COK DXB"] };
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([
      { sector_code: "JED CCJ", route_text: "CCJ-JED", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
      { sector_code: "CCJ JED", route_text: "CCJ/JED", flight_code: "IX", date: "2026-03-05", sp_rate: 15600, show: "yes" },
    ]),
    nodes: { "Build Vision Request": meta },
  })[0].json;

  assert.deepEqual(out.firebaseData.map((r) => [r.sector_code, r.date]), [
    ["CCJ JED", "2026-03-04"],
    ["CCJ JED", "2026-03-05"],
  ]);
});

test("Build Firebase Payload drops a reversed fare when the flip is not sellable", () => {
  // Only the outbound direction is valid. The model transposed it and the sheet
  // confirms the outbound order — but "AUH CCJ" is not a sector, so rather than
  // guess we reject the row.
  const meta = { ...META, valid_sectors: ["CCJ AUH", "COK DXB"] };
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([
      { sector_code: "CCJ AUH", route_text: "AUH-CCJ", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
    ]),
    nodes: { "Build Vision Request": meta },
  })[0].json;

  assert.deepEqual(out.firebaseData, []);
  assert.equal(out.rejected.length, 1);
  assert.match(out.rejected[0], /direction conflicts/);
});

test("Build Firebase Payload leaves direction alone when route_text is city names", () => {
  // City-name route_text contains no matching IATA codes, so the guard cannot
  // second-guess the model — it must trust the extracted sector_code.
  const meta = { ...META, valid_sectors: ["CCJ JED", "JED CCJ"] };
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([
      { sector_code: "CCJ JED", route_text: "Calicut to Jeddah", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
    ]),
    nodes: { "Build Vision Request": meta },
  })[0].json;

  assert.deepEqual(out.firebaseData.map((r) => r.sector_code), ["CCJ JED"]);
});

test("Build Firebase Payload emits only fields the sheet actually states", () => {
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([
      { sector_code: "CCJ JED", flight_code: "IX", date: "2026-03-04", sp_rate: 15500, show: "yes" },
    ]),
    nodes: { "Build Vision Request": META },
  })[0].json;

  // finalRate, commission, baggage, and flightTime are all derived inside
  // ingestFaresFromN8n — n8n must never assert them.
  assert.deepEqual(
    Object.keys(out.firebaseData[0]).sort(),
    ["agent_id", "date", "flight_code", "sector_code", "show", "sp_rate"],
  );
});

test("Build Firebase Payload treats an empty extraction as saved:0, not a failure", () => {
  const out = runNode("Build Firebase Payload", {
    json: openaiResponse([], "Nothing readable."),
    nodes: { "Build Vision Request": META },
  })[0].json;

  assert.deepEqual(out.firebaseData, []);
  assert.equal(out.parsed_count, 0);
});

test("Build Firebase Payload surfaces refusal, truncation, and malformed output", () => {
  const cases = [
    [{ choices: [] }, /no choices/],
    [{ choices: [{ message: { refusal: "no" }, finish_reason: "stop" }] }, /refused/],
    [{ choices: [{ message: { content: "{}" }, finish_reason: "length" }] }, /token cap/],
    [{ choices: [{ message: { content: "" }, finish_reason: "stop" }] }, /empty message/],
    [{ choices: [{ message: { content: "{oops" }, finish_reason: "stop" }] }, /unparseable/],
  ];
  for (const [response, re] of cases) {
    assert.throws(
      () => runNode("Build Firebase Payload", { json: response, nodes: { "Build Vision Request": META } }),
      re,
    );
  }
});

test("every node routes its failures to the error responder", () => {
  const fallible = [
    "Fetch Flight Details",
    "Build Vision Request",
    "GPT Extract",
    "Build Firebase Payload",
    "Ingest To Firestore",
  ];
  for (const name of fallible) {
    const node = workflow.nodes.find((n) => n.name === name);
    assert.equal(node.onError, "continueErrorOutput", `${name} must expose an error output`);
    assert.deepEqual(
      workflow.connections[name].main[1],
      [{ node: "Respond Error", type: "main", index: 0 }],
      `${name} must route failures to Respond Error, or the portal hangs until timeout`,
    );
  }
});

test("HTTP nodes reuse the existing n8n credentials", () => {
  const byName = Object.fromEntries(workflow.nodes.map((n) => [n.name, n]));
  for (const name of ["Fetch Flight Details", "Ingest To Firestore"]) {
    assert.equal(byName[name].credentials.httpHeaderAuth.name, "Firestore");
  }
  assert.equal(byName["GPT Extract"].credentials.openAiApi.name, "OpenAi");
  // The bearer token must come from the credential, never be inlined here.
  const serialized = JSON.stringify(workflow);
  assert.ok(!serialized.includes("ZamraFirestore"), "bearer token must not be hardcoded in the workflow");
});
