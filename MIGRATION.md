# Zamra Travels Migration Guide

This guide covers a safe, end‑to‑end migration of the Zamra codebase and Firebase data to a new owner account (jobslive49@gmail.com), plus GitHub and Vercel ownership changes. It includes two paths so you can choose the safest fit for your goals.

If you want, tell me which option you plan to use (A or B) and I can tailor the steps to your exact choice.

**Quick Decision**
1. Choose Option A if you want to keep the existing Firebase project and only change ownership. This is the fastest path and avoids data export/import.
2. Choose Option B if you want a brand‑new Firebase project under the new Gmail and to copy all data into it.

**Key Files You Will Touch**
1. `.firebaserc`
2. `web/src/js/admin/firebase-config.js`
3. `web/src/js/web/tours.js`
4. `web/src/js/web/hajj-umrah.js`

**Important Notes**
1. Firebase Auth admin access is enforced via the `admin: true` custom claim. You must ensure admin users still have this claim after migration.
2. Cloud Functions run in `asia-south1`. Keep that consistent unless you intentionally change it (and update both server and client settings).
3. The `ingestFaresFromN8n` function uses a hardcoded Bearer token. If you migrate, rotate that token and update your n8n workflow to the new endpoint.
4. The local `.env.local` contains Vercel CLI credentials. Do not copy it to the new owner. Have the new owner generate their own.

---

**Option A: Transfer Ownership (No Data Copy)**

This keeps the existing Firebase project (`zamra-web`) and simply transfers ownership to `jobslive49@gmail.com`.

**A1. Firebase Ownership Transfer**
1. Add `jobslive49@gmail.com` as an **Owner** in Google Cloud Console for the existing project (`zamra-web`).
2. Confirm the new owner can open Firebase Console and access Firestore, Storage, Auth, and Functions.

**A2. GitHub Transfer**
1. In GitHub, transfer the repository to the new Gmail’s GitHub account or add them as an owner/admin if you want shared control.
2. Confirm the new account can push and manage repository settings.

**A3. Vercel Transfer**
1. In Vercel, transfer the existing project to the new account or recreate the project under the new account.
2. If you need to keep the same domain, transfer the project rather than recreating it.

**A4. Verify**
1. Log in to the admin dashboard with an existing admin user and confirm the `admin` claim still works.
2. Confirm public pages can read from Firestore.
3. Confirm the Cloud Functions appear in the new owner’s Vercel and Firebase dashboards.

This option has the least risk and near‑zero downtime.

---

**Option B: Full Clone to a New Firebase Project**

This creates a new Firebase project under `jobslive49@gmail.com` and migrates all data and storage.

**B1. Create the New Firebase Project**
1. Create a new Firebase project in the new Gmail account.
2. Enable Firestore in **native mode** and choose the same Firestore location as the old project.
3. Enable Firebase Storage (choose the same location if prompted).
4. Enable Firebase Auth (Email/Password).
5. Upgrade to Blaze plan (required for Functions and Firestore exports).

**B2. Create a Web App and Update Firebase Config**
1. In Firebase Console, create a new Web app and copy the `firebaseConfig` values.
2. Update `web/src/js/admin/firebase-config.js` with the new values.
3. Update `web/src/js/web/tours.js` with the new values.
4. Update `web/src/js/web/hajj-umrah.js` with the new values.

**B3. Update Firebase Project Mapping**
1. Update `.firebaserc` with the new project id.
2. Do not deploy yet.

**B4. Export Firestore Data From Old Project**
1. Use `gcloud` to export Firestore to a GCS bucket in the same location as the old Firestore database.
2. Example (replace placeholders):

```bash
# Login using the old Firebase/Google account

gcloud config set project OLD_PROJECT_ID

gcloud firestore export gs://OLD_EXPORT_BUCKET/zamra-firestore-export
```

**B5. Import Firestore Data Into the New Project**
1. Use `gcloud` to import into the new project.
2. Example:

```bash
# Login using the new Firebase/Google account

gcloud config set project NEW_PROJECT_ID

gcloud firestore import gs://OLD_EXPORT_BUCKET/zamra-firestore-export
```

**B6. Migrate Firebase Auth Users**
1. Export users from the old project.
2. Import users into the new project.
3. Example:

```bash
firebase auth:export users.json --project OLD_PROJECT_ID --format=JSON
firebase auth:import users.json --project NEW_PROJECT_ID --hash-algo=STANDARD_SCRYPT
```

4. If any admin users are missing custom claims after import, set them explicitly:

```bash
firebase auth:set-custom-claims UID '{"admin":true}' --project NEW_PROJECT_ID
```

**B7. Migrate Firebase Storage**
1. Sync objects between buckets using `gsutil`.
2. Example:

```bash
gsutil -m rsync -r gs://OLD_BUCKET gs://NEW_BUCKET
```

**B8. Deploy Rules, Indexes, and Functions**
1. From the repo root:

```bash
npx firebase-tools@latest deploy --only firestore,storage,functions --project NEW_PROJECT_ID
```

2. Confirm indexes in `firestore.indexes.json` deploy successfully.

**B9. Rotate and Update the n8n Ingest Token**
1. Update the Bearer token in `functions/index.js`.
2. Deploy functions again.
3. Update the n8n workflow to hit the new URL and token.

---

**GitHub Migration (for either option)**

1. Create a new GitHub repo under the new Gmail account, or transfer the existing repo.
2. If pushing to a new repo, add a new remote and push:

```bash
git remote add neworigin git@github.com:NEW_OWNER/NEW_REPO.git
git push neworigin main
```

3. Make sure the new repo has the latest code and branch protections if needed.

---

**Vercel Migration (for either option)**

1. In the new Vercel account, import the GitHub repo.
2. Set **Root Directory** to `web`.
3. Set Build Command to `npm run build`.
4. Set Output Directory to `dist`.
5. Add your custom domain and remove it from the old Vercel project to avoid conflicts.

---

**Post‑Migration Verification Checklist**

1. Public website loads (home, tours, hajj/umrah, visa).
2. Admin login works and admin users can write to Firestore.
3. Firestore collections contain expected data counts.
4. Storage assets (logos, tours, hajj/umrah images) load correctly.
5. Poster generator only shows fares from today onward and dedupes identical flights to the lowest price.
5. Cloud Functions deploy and callable functions succeed.
6. n8n ingest works with the new endpoint.
7. Authorized domains in Firebase Auth include the new Vercel domain.

---

**Rollback Plan (If Anything Breaks)**

1. Keep the old Firebase project intact until you confirm the new one is stable.
2. Keep the old Vercel project active during validation.
3. If a critical issue appears, revert DNS or Vercel domain to the old project and pause migration.

---

**Security Cleanup**

1. Delete any exported user JSON files after import.
2. Rotate the `ingestFaresFromN8n` token if migrating projects.
3. Ensure `.env.local` is not shared; the new owner should generate their own Vercel credentials.
