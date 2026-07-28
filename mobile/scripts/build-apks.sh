#!/usr/bin/env bash
#
# Builds signed release APKs for both portals into mobile/dist/.
#
#   ./scripts/build-apks.sh            # both flavours
#   ./scripts/build-apks.sh admin      # just the admin app
#   ./scripts/build-apks.sh b2b        # just the B2B app
#
# Requires android/keystore.properties (see README). Without it Gradle still builds, but the
# APKs come out unsigned and Android will refuse to install them.
set -euo pipefail

cd "$(dirname "$0")/.."

FLAVOUR="${1:-both}"
case "$FLAVOUR" in
    admin) TASKS=(":app:assembleAdminRelease") ;;
    b2b)   TASKS=(":app:assembleB2bRelease") ;;
    both)  TASKS=(":app:assembleAdminRelease" ":app:assembleB2bRelease") ;;
    *)     echo "Unknown flavour '$FLAVOUR' (expected: admin, b2b, both)" >&2; exit 1 ;;
esac

if [ ! -f android/keystore.properties ]; then
    echo "warning: android/keystore.properties is missing — the APKs will be unsigned." >&2
fi

# Refreshes assets/public and the base capacitor.config.json. The per-flavour configs in
# android/app/src/{admin,b2b}/assets override the base one at merge time; this only keeps the
# offline page in sync.
npx cap copy android

./android/gradlew -p android "${TASKS[@]}"

mkdir -p dist
for apk in android/app/build/outputs/apk/*/release/*.apk; do
    [ -e "$apk" ] || continue
    cp "$apk" dist/
done

echo
echo "Built:"
ls -lh dist/*.apk | awk '{ print "  " $9 "  " $5 }'
