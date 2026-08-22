# n8n — Rate Upload Pipeline

The admin dashboard's **Rate Upload** tab posts raw fare dumps (pasted text, rate-sheet
screenshots, or both) to an n8n webhook. n8n runs them through a vision model, validates
what comes back, and writes the result to Firestore via `ingestFaresFromN8n`.

`zamra-rates.workflow.json` mirrors what is deployed. The two Code nodes inside it are
tested by [functions/tests/n8n-workflow.test.js](../functions/tests/n8n-workflow.test.js)
(`cd functions && npm test`) — that suite is what stops the workflow drifting away from
the Cloud Function contract, so run it after editing either side.

## Deployed state

| | |
|---|---|
| Instance | `https://n8n.srv1491832.hstgr.cloud` |
| Live workflow | **Zamra Rate Upload (Vision)** — id `N9gXV8vLF5Z9rvGw`, active |
| Webhook | `https://n8n.srv1491832.hstgr.cloud/webhook/zamra-rates` |
| Predecessor | **Flight Rate Parser Web** — id `9KaII1g0RODipyrT`, **deactivated, not deleted** |
| Intake workflow | **Zamra WhatsApp Rate Intake** — id `ktNVea06JocIpmhH`. Created 2026-08-22, **inactive** until `whatsappRateIntakeForN8n` is deployed |

To roll back: deactivate `N9gXV8vLF5Z9rvGw`, then reactivate `9KaII1g0RODipyrT`. Both own
the `zamra-rates` path, so exactly one may be active at a time — activating the second
without deactivating the first fails.

## Flow

```
Admin dashboard (Rate Upload tab)
  │  POST { agent_id, raw_text, parsed_rows, images[], ... }
  ▼
Rate Upload Webhook
  ▼
Fetch Flight Details ──── GET exportFlightDetailsForN8n  (valid sectors + airlines)
  ▼
Build Vision Request ──── merges text + images, injects the route catalogue
  ▼
GPT Extract ───────────── POST api.openai.com/v1/chat/completions  (vision + structured output)
  ▼
Build Firebase Payload ── validates and drops every row that fails a check
  ▼
Ingest To Firestore ───── POST ingestFaresFromN8n  → agent_fares
  ▼
Respond Success ────────── { success: true, saved: N }
```

Every fallible node has an error output wired to **Respond Error**, which answers
`{ success: false, saved: 0, error }`. The portal blocks on this response, so a node that
fails without responding would leave the admin staring at a spinner until the HTTP timeout.

## Credentials

The workflow reuses credentials that already existed on the instance — no secrets are
stored in this file:

| Node | Credential | Type |
|---|---|---|
| Fetch Flight Details, Ingest To Firestore | `Firestore` (`fXwTRbR6c38XVUkO`) | Header Auth — carries the `Bearer` token |
| GPT Extract | `OpenAi` (`YGWeDiVLF9ZLVWKM`) | OpenAI API |

Re-importing this JSON onto a **different** n8n instance requires recreating both
credentials and repointing the node `credentials` blocks at the new ids.

## Contracts

### In — what the portal sends

```jsonc
{
  "agent_id": "102",
  "raw_text": "*CCJ JED IX FARES*\n04 MAR 15500",
  "parsed_rows": [],          // client-side preview only; the workflow ignores it
  "parsed_count": 0,
  "images": [
    { "name": "sheet.png", "mime_type": "image/png", "size": 84213, "data": "<bare base64>" }
  ],
  "image_count": 1,
  "timestamp": "2026-07-23T09:12:00.000Z",
  "source": "zamra-portal"
}
```

`data` is bare base64 with no data-URL prefix — the workflow assembles
`data:<mime_type>;base64,<data>` for the `image_url` content part. Only `image/jpeg`,
`image/png`, `image/gif`, and `image/webp` are accepted; `image/jpg` is normalized to
`image/jpeg`, and anything else is reported in `skipped_images` rather than silently
dropped. The portal caps uploads at 10 images / 8 MB each / 20 MB total.

### Out — what the portal requires

```jsonc
{ "success": true, "saved": 12, "notes": "", "rejected": [], "skipped_images": [] }
```

`success` must be exactly `true` and `saved` must be a finite number, or the portal treats
the submission as failed. `saved: 0` is a valid, honest answer when nothing parsed — an
empty `firebaseData` array is accepted by `ingestFaresFromN8n` and returns `saved: 0`.

### Between — what n8n sends Firestore

```jsonc
{ "firebaseData": [
  { "agent_id": "102", "sector_code": "CCJ JED", "flight_code": "IX",
    "date": "2026-03-04", "sp_rate": 15500, "show": "yes" }
]}
```

**Only what the sheet actually prints.** Everything else is derived server-side and must
not be asserted here:

| Field | Derived by |
|---|---|
| `finalRate` | `sp_rate` + the agent's commission from `agents.commission` |
| `commission` | `agents.commission`, falling back to 500 |
| `baggage` / `extraBaggage` | airline policy — [functions/airlineBaggage.js](../functions/airlineBaggage.js) |
| `flightTime` | payload keys, else the `flight_details` mapping — [functions/flightTime.js](../functions/flightTime.js) |

This is why the predecessor's separate `commisions` node (a direct Firestore REST read) is
gone — the commission is applied inside the Cloud Function now.

`sector_code` is **space**-separated (`CCJ JED`). `exportFlightDetailsForN8n` keys its
route map without the space (`IX_CCJJED`), so Build Vision Request translates between the
two — don't "fix" one side in isolation.

## The extraction step

- **Model** `gpt-5-mini` at `reasoning_effort: low` — the cheapest vision-capable model
  already credentialed on this instance. **If extraction quality is poor, raise
  `reasoning_effort` to `medium` before changing model**; it is the cheaper lever.
- **`detail: "high"` on every image.** A rate sheet is a dense grid of small digits;
  `detail: "low"` downsamples to 512px and misreads them. This is the main cost driver per
  screenshot and should not be lowered.
- **Structured outputs** (`response_format: json_schema`, `strict: true`) guarantee
  schema-valid JSON, so there is no regex fallback to maintain.
- **Closed vocabulary.** The system prompt lists the sector and airline codes pulled live
  from Firestore (currently 100 sectors / 13 airlines), and Build Firebase Payload rejects
  anything outside them — a hallucinated route can't reach `agent_fares`.
- **Year inference.** Rate sheets write `04 MAR` with no year. The predecessor hardcoded
  "use year 2026"; today's IST date is now injected instead and the model rolls a past
  month/day forward to its next occurrence.
- **Validation is belt-and-braces.** Rates outside ₹1,000–99,999, malformed dates, unknown
  routes, and duplicate sector+airline+date rows are dropped and listed in `rejected`.

> ⚠️ `gpt-5-mini` is a cost choice, not an accuracy choice. The validation layer catches
> structurally wrong rows (bad route, impossible rate), but it cannot catch a plausible
> misread — `15500` transcribed as `16500` passes every check. Spot-check the Database tab
> after the first few image uploads.

## Editing

`zamra-rates.workflow.json` is the checked-in mirror of the deployed workflow. After
changing anything in the n8n UI, **re-export over this file and run
`cd functions && npm test`** — the Code nodes are executed against a mock n8n runtime
there, so a syntax error, a dropped validation check, or an unwired error output fails the
build instead of reaching production. Prompt edits are worth a real upload against a known
rate sheet as well; the tests check the plumbing, not extraction accuracy.

To exercise the whole chain without writing any fares, post a payload whose sector header
is not in the catalogue (e.g. `*ZZZ QQQ XX FARES*`). Every row is rejected, `firebaseData`
comes out empty, and the response is `saved: 0`.

## Cost

One upload is one `gpt-5-mini` request. A text-only sheet is ~1–2k tokens. Each
`detail: high` screenshot adds roughly a few thousand image tokens depending on
resolution, so a typical upload lands well under a cent.

---

## Automatic rate intake from WhatsApp

A second workflow closes the loop the Rate Upload tab leaves open: a supplier WhatsApps
their sheet and the fares land in `agent_fares` with nobody clicking Submit.

`zamra-whatsapp-intake.workflow.json` mirrors it, and
[functions/tests/n8n-intake-workflow.test.js](../functions/tests/n8n-intake-workflow.test.js)
executes its Code nodes — including a round trip that feeds its payload through the real
`Build Vision Request` node above.

```
supplier WhatsApps a rate sheet
  ▼  WAHA → whatsappWebhook (HMAC-verified) → whatsapp_messages
     an inbound message from a LINKED supplier is flagged rateIntakeStatus:"pending"
  ▼
Intake Schedule ───────── every 3 minutes
  ▼
Claim Batches ─────────── POST whatsappRateIntakeForN8n { action:"claim" }
                          groups that chat's pending messages into ONE batch and leases it
  ▼
Loop Batches ──────────── batchSize 1
  ├─ Media To Items → Download Media (http://waha:3000/api/files/…) → Encode Media
  └─ No Media
  ▼
Build Rate Payload ────── the exact { agent_id, raw_text, images[] } contract above
  ▼
Extract Rates ─────────── POST http://localhost:5678/webhook/zamra-rates   ← the workflow above, untouched
  ▼
Complete Batch ────────── POST whatsappRateIntakeForN8n { action:"complete", saved }
```

**It extracts nothing itself, on purpose.** Calling the existing webhook keeps the vision
prompt, the closed vocabulary, the direction guard and the rate band in exactly one place,
and touches the live rate-upload path zero times — so the rollback documented above still
works. n8n runs in regular mode with no fixed execution pool, so the self-call cannot
deadlock; `batchSize: 1` is what bounds it to one image set in flight.

Three things that look like details and are not:

- **`Extract Rates` must never retry.** `ingestFaresFromN8n` writes a new auto-id doc per
  row and never dedupes, so a retry after a partial success republishes every fare.
- **Branch on `$json.success`, not on the status code.** `Respond Error` answers HTTP 200
  with `{success:false}`, so an `onError` output can never fire for a parse failure.
- **The claim response carries a media *path*, never a URL.** The workflow prepends
  `http://waha:3000`. `whatsapp_messages.mediaUrl` is `http://localhost:3000/...` — WAHA
  builds it from `WHATSAPP_API_HOSTNAME`, which the VPS does not set — and following a
  webhook-supplied URL from inside `n8n_default` would be an SSRF primitive.

### Two credentials to create before importing

| Credential | Id | Type | Value |
|---|---|---|---|
| `Zamra Ingest` | `qu93czX3nEMrFcId` | Header Auth | `Authorization: Bearer <N8N_INGEST_TOKEN>` |
| `WAHA Header Auth` | `loEibRmdWpRqtw7n` | Header Auth | `X-Api-Key: <WAHA plaintext key>` |

> ⚠️ **`WAHA Header Auth` currently holds the literal `REPLACE_WITH_WAHA_API_KEY_PLAINTEXT`.**
> The plaintext key lives only in `/docker/n8n/.waha.secrets` on the VPS and in the
> `WAHA_API_KEY` Firebase secret, so it could not be filled in automatically. Until it is
> replaced, `/api/files` answers 401, `Download Media` continues past it, and the image is
> reported in `skipped_images` and shown in the dashboard. **Text-only rate sheets — the
> common case — are unaffected.** A deliberately invalid value was chosen over a
> plausible-looking one so the gap cannot be mistaken for working configuration.

`WAHA Header Auth` is separate from the `@devlikeapro/n8n-nodes-waha` community-node
credential — an HTTP Request node cannot use that one, and `/api/files` is key-protected.

The same `N8N_INGEST_TOKEN` replaces the old `Bearer ZamraFirestore` literal on the
`Firestore` credential (`fXwTRbR6c38XVUkO`). Both endpoints accept either during the
migration, logging a warning on the legacy path.

### Switching it on

Intake ships **off**. `config/whatsapp.rateIntakeEnabled` starts `false` and the claim
endpoint answers `{ok:true, enabled:false, batches:[]}` until it is flipped, so the cron
does not alarm 480 times a day. Per supplier, `agents.rateIntakeMode` also starts `"off"` —
link a number and switch it on in the Agents tab, one trusted supplier at a time. Both
toggles live in the dashboard's WhatsApp tab.

Latency, supplier sends → fares live: ~90 s quiet window + ≤3 min poll + ~90 s ≈ 6 minutes.

## WhatsApp (WAHA)

WAHA runs in Docker on the same VPS as n8n, reachable internally at `http://waha:3000` and
publicly at `https://waha.zamratravels.com`. Setup, credentials and operational notes are in
[infra/README.md](../infra/README.md).

Install the community node `@devlikeapro/n8n-nodes-waha` (Settings → Community nodes) and add a
**WAHA API** credential pointing at the internal URL — not the public hostname, which would
route traffic out to Traefik and back for no reason.

**n8n owns the messaging logic.** The Zamra repo only proxies WAHA for the admin dashboard and
mirrors inbound messages into Firestore; anything with a decision in it — auto-replies, AI
answers, escalation, broadcasts — belongs in a workflow here.

**Scheduled broadcasts use n8n's Schedule Trigger, not a Cloud Function.** The Firebase project
runs exactly three Cloud Scheduler jobs and a fourth starts monthly billing, so n8n's own cron
is the free path.

### Ban-risk rules any outbound workflow must respect

WhatsApp restricts numbers that behave like bulk senders, and +91 9846606731 is a real business
line. From WAHA's own guidance:

- **Never initiate** a conversation with a new contact — reply only.
- Send seen, then typing, then a delay proportional to message length, then the message.
- Randomise spacing (30–60s between new contacts); cap around 4 messages/hour to one contact.
- Posting to groups Zamra owns is far safer than cold DMs.
- On error **463** (shadow restriction) or **475** (message capping), **do not re-pair or
  restart the session** — the restriction lifts on its own, and churning the session makes it
  worse.
