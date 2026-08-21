#!/usr/bin/env bash
#
# provision.sh — stand WAHA up inside the existing n8n compose project.
#
# Idempotent and non-destructive: backs the compose file up before touching it,
# refuses to run twice, validates before starting, and brings up ONLY the waha
# service so n8n and Traefik are never restarted.
#
#   bash provision.sh
#
# Written against the live stack (Hostinger "Ubuntu 24.04 with n8n" template):
# Traefik is a service inside the n8n project, the cert resolver is
# `mytlschallenge`, and there is no external proxy network. All three are
# re-checked at run time rather than assumed.

set -euo pipefail

WAHA_HOST="${WAHA_HOST:-waha.zamratravels.com}"
IMAGE="${IMAGE:-devlikeapro/waha:noweb-2026.8.1}"
PROJECT_DIR="${PROJECT_DIR:-/docker/n8n}"

say()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m !  %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m X  %s\033[0m\n' "$*" >&2; exit 1; }

COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
[ -f "$COMPOSE_FILE" ] || die "No compose file at $COMPOSE_FILE"

say "Preflight"
grep -q '^\s*waha:' "$COMPOSE_FILE" && die "A 'waha' service already exists. Nothing to do."

# The resolver name must match what Traefik actually defines, or Traefik falls
# back to its self-signed cert and every HTTPS call fails verification.
RESOLVER="$(grep -oE 'certificatesresolvers\.[a-zA-Z0-9_-]+\.acme' "$COMPOSE_FILE" | head -1 | cut -d. -f2 || true)"
[ -n "$RESOLVER" ] || die "Could not determine the Traefik cert resolver from $COMPOSE_FILE"
echo "    cert resolver : $RESOLVER"
echo "    compose file  : $COMPOSE_FILE"

# DNS must already point here or the ACME challenge is answered by whoever the
# wildcard points at (Vercel, in this zone).
MY_IP="$(curl -fsS --max-time 10 https://api.ipify.org || true)"
RESOLVED="$(getent ahostsv4 "$WAHA_HOST" | awk '{print $1}' | sort -u | tr '\n' ' ')"
echo "    this box      : ${MY_IP:-unknown}"
echo "    $WAHA_HOST -> ${RESOLVED:-nothing}"
if [ -n "$MY_IP" ] && ! echo "$RESOLVED" | grep -qF "$MY_IP"; then
  die "$WAHA_HOST does not resolve here yet. Add the A record (the zone is on
     Vercel DNS and a wildcard catches everything until a specific record
     exists), wait for it, then re-run."
fi

# ── credentials ─────────────────────────────────────────────────────────────
say "Generating credentials"
ENV_FILE="$PROJECT_DIR/.waha.env"        # mounted into the container
SECRETS_FILE="$PROJECT_DIR/.waha.secrets" # NOT mounted — values for Firebase

if [ -f "$ENV_FILE" ]; then
  warn "$ENV_FILE already exists; reusing it."
else
  umask 077
  WAHA_KEY="$(tr -d '-' < /proc/sys/kernel/random/uuid)"
  WAHA_KEY_SHA512="$(printf '%s' "$WAHA_KEY" | sha512sum | cut -d' ' -f1)"
  DASH_PASS="$(openssl rand -base64 18)"
  SWAGGER_PASS="$(openssl rand -base64 18)"
  WEBHOOK_SECRET="$(openssl rand -hex 32)"

  cat > "$ENV_FILE" <<EOF
# Passed into the WAHA container. Only the HASH of the API key lives here.
WAHA_API_KEY=sha512:$WAHA_KEY_SHA512
WAHA_DASHBOARD_USERNAME=zamra
WAHA_DASHBOARD_PASSWORD=$DASH_PASS
WHATSAPP_DEFAULT_ENGINE=NOWEB
WAHA_PRINT_QR=False
WHATSAPP_RESTART_ALL_SESSIONS=True
WAHA_MEDIA_STORAGE=LOCAL
WHATSAPP_FILES_FOLDER=/app/.media
WHATSAPP_FILES_LIFETIME=604800
WAHA_LOG_FORMAT=JSON
WAHA_LOG_LEVEL=info
# Pinned deliberately: WAHA generates fresh Swagger credentials on every start
# and prints them to the log if these are unset.
WHATSAPP_SWAGGER_USERNAME=zamra
WHATSAPP_SWAGGER_PASSWORD=$SWAGGER_PASS
EOF

  # Kept out of the container: WAHA never needs the plaintext key, and the
  # webhook secret belongs to the Cloud Function, not to WAHA's environment.
  cat > "$SECRETS_FILE" <<EOF
# Generated $(date -u +%FT%TZ). The ONLY copy of these values.
# Set both as Firebase secrets, then they are needed nowhere else.
WAHA_API_KEY_PLAINTEXT=$WAHA_KEY
WAHA_WEBHOOK_SECRET=$WEBHOOK_SECRET
WAHA_DASHBOARD_PASSWORD=$DASH_PASS
WAHA_SWAGGER_PASSWORD=$SWAGGER_PASS
EOF
  chmod 600 "$ENV_FILE" "$SECRETS_FILE"
  echo "    wrote $ENV_FILE and $SECRETS_FILE (0600)"
fi

# ── append the service ──────────────────────────────────────────────────────
say "Backing up and editing the compose file"
BACKUP="$COMPOSE_FILE.bak.$(date -u +%Y%m%d%H%M%S)"
cp -a "$COMPOSE_FILE" "$BACKUP"
echo "    backup: $BACKUP"
mkdir -p "$PROJECT_DIR/waha/sessions" "$PROJECT_DIR/waha/media"

python3 - "$COMPOSE_FILE" "$IMAGE" "$WAHA_HOST" "$RESOLVER" <<'PY'
import sys, re, io
path, image, host, resolver = sys.argv[1:5]
s = io.open(path, encoding='utf-8').read()

# No `networks:` block on purpose — Traefik is a service in THIS project, so the
# project default network is what lets n8n resolve http://waha:3000. Adding a
# networks list here would move waha off it.
service = f"""
  waha:
    image: {image}
    container_name: waha
    restart: always
    # No `ports:` — publishing 3000 writes iptables rules that bypass UFW.
    # Traefik is the only ingress.
    volumes:
      - ./waha/sessions:/app/.sessions
      - ./waha/media:/app/.media
    env_file:
      - ./.waha.env
    labels:
      - traefik.enable=true
      - traefik.http.routers.waha.rule=Host(`{host}`)
      - traefik.http.routers.waha.entrypoints=websecure
      - traefik.http.routers.waha.tls=true
      - traefik.http.routers.waha.tls.certresolver={resolver}
      - traefik.http.services.waha.loadbalancer.server.port=3000
"""

m = re.search(r'^services:\s*$', s, re.M)
if not m:
    sys.exit("no top-level 'services:' key")
nxt = re.search(r'^(?!\s|#)(\w[\w-]*):', s[m.end():], re.M)
cut = m.end() + (nxt.start() if nxt else len(s) - m.end())
io.open(path, 'w', encoding='utf-8').write(
    s[:cut].rstrip('\n') + '\n' + service + '\n' + s[cut:])
print("    waha service appended")
PY

say "Validating"
( cd "$PROJECT_DIR" && docker compose config >/dev/null ) \
  || { cp -a "$BACKUP" "$COMPOSE_FILE"; die "Validation failed; compose file restored from backup."; }
echo "    docker compose config OK"

# ── start ───────────────────────────────────────────────────────────────────
say "Starting waha only (n8n and traefik are left running)"
( cd "$PROJECT_DIR" && docker compose up -d waha )

say "Waiting for WAHA to answer"
# The image ships curl, not wget. /health and /api/sessions both require the
# API key, so a 401 is a perfectly good liveness signal — what we are waiting
# for is any HTTP response rather than a connection refusal.
for i in $(seq 1 60); do
  code="$(docker exec waha curl -s -o /dev/null -w '%{http_code}' --max-time 3 \
            http://localhost:3000/api/sessions 2>/dev/null || echo 000)"
  if [ "$code" != "000" ]; then echo "    answering after ${i}s (HTTP $code)"; break; fi
  [ "$i" = 60 ] && warn "No response yet — check: docker logs waha"
  sleep 1
done

# ── verify ──────────────────────────────────────────────────────────────────
say "Verifying"
set -a; . "$SECRETS_FILE"; set +a

printf '    public, no key    : '
curl -s -o /dev/null -w '%{http_code} (want 401)\n' --max-time 25 "https://$WAHA_HOST/api/sessions"

printf '    public, with key  : '
curl -s -o /dev/null -w '%{http_code} (want 200)\n' --max-time 25 \
  -H "X-Api-Key: $WAHA_API_KEY_PLAINTEXT" "https://$WAHA_HOST/api/sessions"

printf '    TLS issuer        : '
echo | openssl s_client -connect "$WAHA_HOST:443" -servername "$WAHA_HOST" 2>/dev/null \
  | openssl x509 -noout -issuer 2>/dev/null | sed 's/issuer=//'

printf '    port 3000 public  : '
timeout 6 bash -c "</dev/tcp/${MY_IP}/3000" 2>/dev/null \
  && echo '!! REACHABLE — remove any ports: mapping' || echo 'refused (correct)'

say "Done. Firebase secret values are in $SECRETS_FILE"
echo "    Set them with:"
echo "      functions:secrets:set WAHA_API_KEY        <- WAHA_API_KEY_PLAINTEXT"
echo "      functions:secrets:set WAHA_WEBHOOK_SECRET <- WAHA_WEBHOOK_SECRET"
echo "    Then pair the number from /admin/whatsapp — NOT by hand. Only"
echo "    ensureWhatsappSession registers the webhook URL and HMAC key, and a"
echo "    session created without them drops every inbound message silently." 
