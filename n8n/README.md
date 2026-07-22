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
