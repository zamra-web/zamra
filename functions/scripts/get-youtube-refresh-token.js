#!/usr/bin/env node
/**
 * One-time helper: obtain a YouTube refresh token for the auto-post Cloud Function.
 *
 * Prereqs
 *   1. Enable YouTube Data API v3 on the Firebase/GCP project.
 *   2. Create an OAuth 2.0 Client ID (Application type: Desktop).
 *   3. Note the Client ID + Client Secret.
 *
 * Usage
 *   cd functions
 *   node scripts/get-youtube-refresh-token.js
 *
 * The script prints a consent URL. Open it, pick the YouTube channel you want
 * to post Shorts to, copy the authorization code shown on the success page,
 * and paste it back into the terminal. It prints a refresh token, which you
 * then store in Firebase Secret Manager:
 *
 *   firebase functions:secrets:set YOUTUBE_REFRESH_TOKEN
 *
 * This script does NOT get deployed — it's a developer tool only.
 */

const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

async function main() {
  const clientId = process.env.YOUTUBE_CLIENT_ID || process.argv[2];
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.argv[3];

  if (!clientId || !clientSecret) {
    console.error("Provide creds via env (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET) or argv:");
    console.error("  node scripts/get-youtube-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>");
    process.exit(1);
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, "urn:ietf:wg:oauth:2.0:oob");

  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // ensure a refresh_token is returned
  });

  console.log("\n1. Open this URL in a browser signed in to the target YouTube channel:\n");
  console.log(url);
  console.log("\n2. Approve access, then copy the authorization code from the success page.\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise((resolve) => rl.question("Paste the authorization code here: ", resolve));
  rl.close();

  const { tokens } = await oauth2.getToken(code.trim());
  if (!tokens.refresh_token) {
    console.error("\nNo refresh_token returned. Revoke access at https://myaccount.google.com/permissions and retry.");
    process.exit(1);
  }

  console.log("\n✓ Refresh token:\n");
  console.log(tokens.refresh_token);
  console.log("\nStore it with:  firebase functions:secrets:set YOUTUBE_REFRESH_TOKEN");
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
