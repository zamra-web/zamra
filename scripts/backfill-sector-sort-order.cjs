#!/usr/bin/env node
/**
 * One-off Firestore maintenance script: seed missing `sortOrder` values on
 * `sectors` documents without overwriting any existing valid custom order.
 *
 * Uses the Firebase CLI access token already stored on the local machine.
 *
 * Usage:
 *   node scripts/backfill-sector-sort-order.cjs
 *   FIREBASE_PROJECT_ID=zamra-web-01 node scripts/backfill-sector-sort-order.cjs
 */

const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { planSectorSortOrderBackfill } = require("../functions/sectorOrdering");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "zamra-web-01";
const SECTORS_COLLECTION = "sectors";

function getAccessToken() {
  const configPath = path.join(
    os.homedir(),
    ".config",
    "configstore",
    "firebase-tools.json",
  );

  if (!fs.existsSync(configPath)) {
    throw new Error("Firebase CLI config not found. Please run `firebase login` first.");
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const token = config.tokens && config.tokens.access_token;
  if (!token) {
    throw new Error("Access token not found in Firebase config. Please run `firebase login` again.");
  }

  return token;
}

function request(method, url, token, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      method,
      hostname: parsed.hostname,
      path: `${parsed.pathname}${parsed.search}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : null);
          return;
        }
        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function readStringField(fields = {}, key) {
  const field = fields[key];
  if (!field) return "";
  if (typeof field.stringValue === "string") return field.stringValue;
  return "";
}

function readIntegerField(fields = {}, key) {
  const field = fields[key];
  if (!field) return null;
  const rawValue = field.integerValue ?? field.doubleValue ?? null;
  if (rawValue === null || rawValue === undefined || rawValue === "") return null;
  const numeric = Number(rawValue);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  return numeric;
}

async function listSectors(token) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${SECTORS_COLLECTION}?pageSize=1000`;
  const response = await request("GET", url, token);
  const docs = response.documents || [];

  return docs.map((doc) => {
    const fields = doc.fields || {};
    return {
      id: doc.name.split("/").pop(),
      name: doc.name,
      sectorFrom: readStringField(fields, "sectorFrom"),
      sectorTo: readStringField(fields, "sectorTo"),
      sectorCode: readStringField(fields, "sectorCode"),
      sortOrder: readIntegerField(fields, "sortOrder"),
    };
  });
}

async function patchSectorSortOrder(docName, sortOrder, token) {
  const url = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=sortOrder`;
  await request("PATCH", url, token, {
    fields: {
      sortOrder: { integerValue: String(sortOrder) },
    },
  });
}

async function main() {
  try {
    const token = getAccessToken();
    console.log(`🔥 Backfilling sector sort order in Firestore project: ${PROJECT_ID}`);

    const sectors = await listSectors(token);
    if (!sectors.length) {
      console.log("No sectors found. Nothing to update.");
      process.exit(0);
    }

    const updates = planSectorSortOrderBackfill(sectors);
    if (!updates.length) {
      console.log(`All ${sectors.length} sector document(s) already have valid sortOrder values.`);
      process.exit(0);
    }

    const docNameById = new Map(sectors.map((sector) => [sector.id, sector.name]));
    for (const update of updates) {
      const docName = docNameById.get(update.id);
      if (!docName) continue;
      await patchSectorSortOrder(docName, update.sortOrder, token);
      console.log(
        `  - ${update.id} (${update.sectorCode || "NO CODE"}) -> sortOrder ${update.sortOrder}`,
      );
    }

    console.log(`\n✅ Added sortOrder to ${updates.length} sector document(s).\n`);
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Script failed:", err.message);
    if (err.message.includes("HTTP 401")) {
      console.error(
        "   Your Firebase token may be expired. Run `npx firebase-tools@latest login --reauth` and try again.",
      );
    }
    process.exit(1);
  }
}

main();
