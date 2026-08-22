# Infrastructure

Everything Zamra runs outside Firebase and Vercel. Today that is one Hostinger
VPS (`srv1491832.hstgr.cloud`) running **n8n** and **WAHA** behind a shared
Traefik reverse proxy.

> **This repository is public.** No IP address, API key, password or token
> belongs in these files. Where a value is needed, there is a placeholder and a
> command to derive it. The VPS IP is in hPanel → VPS → Overview.

| | |
|---|---|
| Plan | Hostinger KVM 2 — **2 vCPU**, 8 GB RAM, 100 GB disk |
| OS | Ubuntu 24.04 (provisioned from the n8n template) |
| Region | India — Mumbai 2 |
| Backups | Weekly snapshots |
| DNS for `zamratravels.com` | **Vercel** (`ns1/ns2.vercel-dns.com`), with a wildcard `*` → Vercel |

**The binding constraint is CPU, not memory.** At rest the box sits near 1 GB of
8 GB used, so RAM is not what rules out the WEBJS engine — two vCPUs shared with
n8n's GPT-vision rate-upload workflow is. NOWEB is a plain WebSocket client with
no browser to schedule.

**Mumbai is a happy accident worth keeping.** Cloud Functions run in
`asia-south1`, which is also Mumbai, so the admin proxy hop to WAHA stays
intra-region. Do not move either side without noticing the other.

The VPS was provisioned from Hostinger's n8n template and, until this directory
existed, had no infra-as-code at all — if it died, both the rate-upload pipeline
and the homepage enquiry form would fail with nothing in git to restore from.
Keep these files in step with what is actually deployed.

| Service | Public URL | Internal | Purpose |
|---|---|---|---|
| n8n | `https://n8n.srv1491832.hstgr.cloud` | `http://n8n:5678` | Rate-upload vision pipeline, enquiry webhook, WhatsApp automation |
| WAHA | `https://waha.zamratravels.com` | `http://waha:3000` | WhatsApp HTTP API for +91 9846606731 |

## WAHA

`waha/docker-compose.waha.yml` is a **fragment** appended to the existing n8n
compose file, not a standalone project — both containers must live in one
project so n8n reaches WAHA internally rather than over the public internet.

**Verified topology** (checked on the live box, not assumed — an earlier draft
of this doc got all three wrong):

| | |
|---|---|
| Project | `/docker/n8n/docker-compose.yml`, project name `n8n` |
| Reverse proxy | Traefik is a **service inside that project**, not a separate stack. There is no external `traefik-proxy` network — everything shares `n8n_default`, which is why the WAHA service declares no `networks:` block. Adding one would move it off the project default and n8n could no longer resolve `waha`. |
| Cert resolver | **`mytlschallenge`** (TLS-ALPN-01 on :443), *not* `letsencrypt`. Naming a resolver that does not exist makes Traefik serve its self-signed default and every HTTPS call fails verification — with nothing obvious in the logs. |
| Exposure | Traefik runs `--providers.docker.exposedbydefault=false`, so `traefik.enable=true` is required or no router is created. |

`zamratravels.com` also carries CAA records (`pki.goog`, `sectigo.com`,
`letsencrypt.org`). Let's Encrypt is on that list, so issuance works — but if a
future subdomain ever fails to get a certificate, check CAA first.

WAHA has been fully free and open source since **2026.6.1**. There is no
Core/Plus split and no `waha-plus` image; any guide recommending one is stale.

### First-time setup

0. **Check how the n8n stack is managed.** hPanel has a Docker Manager, and if
   the n8n project was deployed through it, hand-edits to the compose file may
   be overwritten on the next panel-driven action. Confirm before editing —
   either edit through the Manager, or verify it is not managing that project.

1. **DNS — this is at Vercel, not Hostinger.** The zone's nameservers are
   `ns1/ns2.vercel-dns.com`, and there is a **wildcard `*.zamratravels.com`
   pointing at Vercel**, so `waha.zamratravels.com` already resolves and serves
   a Vercel 404. Add an explicit `A` record for `waha` → the VPS IPv4 (hPanel →
   VPS → Overview) in the Vercel dashboard; the more specific record wins over
   the wildcard.

   Verify it has actually flipped before starting the container, or the Let's
   Encrypt HTTP-01 challenge is answered by Vercel and fails:

   ```bash
   dig +short waha.zamratravels.com      # must be the VPS IP, not 64.29.x / 216.198.x
   ```

2. **Recon** — Hostinger's template puts the project at `/docker/n8n/`, but
   confirm rather than assume:

   ```bash
   ssh root@srv1491832.hstgr.cloud
   docker compose ls                 # real project path
   docker network ls | grep traefik  # confirm the external network name
   free -m && df -h
   cd /docker/n8n && cp docker-compose.yml docker-compose.yml.bak
   ```

3. **Generate credentials** — the plaintext key goes in the password manager,
   the Firebase `WAHA_API_KEY` secret, and the n8n credential. Only the hash
   goes on the box.

   ```bash
   KEY=$(uuidgen | tr -d '-')
   echo -n "$KEY" | shasum -a 512 | cut -d' ' -f1   # -> WAHA_API_KEY_SHA512
   openssl rand -hex 32                             # -> WAHA_WEBHOOK_SECRET (Firebase secret)
   ```

4. **Merge** the `waha:` service and the `networks:` block into
   `/docker/n8n/docker-compose.yml`, and write the values into a sibling `.env`
   (see `waha/.env.example`).

   > If the n8n service declares an explicit `networks:` list, add `default` to
   > it — otherwise the two containers never share a network and `http://waha:3000`
   > will not resolve.

5. **Start and verify**

   ```bash
   cd /docker/n8n && docker compose up -d waha && docker compose logs -f waha
   curl -sS -H "X-Api-Key: $KEY" https://waha.zamratravels.com/api/sessions   # []
   curl -sS -o /dev/null -w '%{http_code}\n' https://waha.zamratravels.com/api/sessions  # 401
   docker exec n8n wget -qO- http://waha:3000/health
   ```

   Also confirm port 3000 is **not** reachable on the bare VPS IP. The compose
   fragment has no `ports:` mapping on purpose: publishing it makes Docker write
   iptables rules that bypass UFW and expose the unproxied API.

6. **n8n community node** — Settings → Community nodes →
   `@devlikeapro/n8n-nodes-waha`. Add a **WAHA API** credential with host URL
   `http://waha:3000` (internal, not the public hostname) and the plaintext key.

7. **Pair the number** — do this from the Zamra admin dashboard at
   `/admin/whatsapp`, not by hand-curling WAHA. The `ensureWhatsappSession`
   callable is what teaches WAHA its webhook URL and HMAC key; a hand-created
   session has neither, and inbound messages vanish silently.

### Media URLs are localhost, and must never be followed

WAHA builds `media.url` as
`{WHATSAPP_API_SCHEMA}://{WHATSAPP_API_HOSTNAME}:{WHATSAPP_API_PORT}/api/files/<id>.<ext>`.
`.waha.env` sets neither `WAHA_BASE_URL` nor `WHATSAPP_API_HOSTNAME`, so the hostname
defaults to `localhost` — which means every `whatsapp_messages.mediaUrl` in production
reads `http://localhost:3000/api/files/…` and resolves only inside that container.

Two consequences:

- **n8n must rebuild the URL.** `whatsappRateIntakeForN8n` returns an allow-listed **path**
  and the intake workflow prepends `http://waha:3000`. `/api/files` is key-protected
  (`WHATSAPP_API_KEY_EXCLUDE_PATH` is unset), so that request needs `X-Api-Key` — a
  generic Header Auth credential, since an HTTP Request node cannot use the WAHA
  community-node credential.
- **The allow-list is a security control.** n8n shares `n8n_default` with Traefik and WAHA.
  A `media.url` followed verbatim is an SSRF primitive aimed at `http://n8n:5678/rest/…`
  from inside the trusted network, and the value arrives in a webhook payload.
  `wahaMediaPath()` in `functions/whatsapp/rateIntakeRules.js` is what stops that; its
  tests are in `functions/tests/whatsapp-rate-intake.test.js`.

Setting `WAHA_BASE_URL=http://waha:3000` in `/docker/n8n/.waha.env` would make the stored
value internally meaningful, but it needs a container restart and the path-only approach
works without it. Do not treat it as a fix for the allow-list.

Media files live 7 days (`WHATSAPP_FILES_LIFETIME=604800`) against a 90-second intake
window, so expiry is not a practical risk; the claim response flags anything past 6 days
as `likelyExpired` anyway.

### Address formats: NOWEB speaks JIDs, and WhatsApp now uses LIDs

`GET /api/zamra/chats` returns ids like `919846606755@s.whatsapp.net` and
`224876132614243@lid`, not the `@c.us` form the WEBJS engine uses. A LID is an
opaque identifier and cannot be converted to a phone number — but WAHA carries
the real JID in each message's `_data.key.remoteJidAlt`, which is what makes a
supplier recognisable.

This is worth knowing before debugging anything downstream: an unrecognised chat
id is dropped as "not mirrorable" with a **200 and no error**, so the symptom is
total silence rather than a failure.

### If inbound messages stop being mirrored

Symptom: the dashboard's WhatsApp tab shows a healthy `Connected` session, but
**Last event** never becomes `message`, and the function log carries
`whatsappWebhook: rejected unsigned or mis-signed request { event: 'message' }`.

That is an HMAC mismatch: WAHA is signing with a different key than the deployed
`WAHA_WEBHOOK_SECRET`. It happens when the session was created by hand rather
than through the dashboard, or when the secret was set after the session was
paired — **only `ensureWhatsappSession` writes the webhook URL and signing key
into WAHA's session config.**

Fix: **WhatsApp tab → Repair webhook.** It re-runs `ensureWhatsappSession`
against the live session, which PUTs the config with the current key. The
session stays linked; no QR scan.

**Restart does not fix this** — it restarts the session and leaves the config
untouched. Do not reach for Unlink, which forces a needless re-pair.

### Operational notes

- **The Hostinger firewall currently has 0 rules**, so nothing is filtered at the
  edge and the box's own iptables is the only thing standing between the
  internet and any published port. That is what makes the missing `ports:`
  mapping above load-bearing rather than belt-and-braces. Worth adding rules
  allowing only 22, 80 and 443 while you are in there.
- `waha/sessions/` is the WhatsApp auth state. Backups are **weekly**, so a
  restore can be up to seven days stale — which for session state means a
  re-pair. That is an annoyance, not a data loss: the message history lives in
  Firestore, not on the VPS.
- The number (+91 9846606731) is on WhatsApp Business and WAHA links as a
  **companion device**; the handset stays primary.
- If WhatsApp restricts the number (error 463 shadow-restriction, 475 message
  capping), **do not re-pair or restart the session** — restrictions lift on
  their own, and churning the session makes it worse.
- Engine is NOWEB. `noweb.store.enabled` must stay on for chat/contact history,
  and neither it nor `fullSync` should be changed after the QR is scanned —
  WAHA loses chat history when they move.
