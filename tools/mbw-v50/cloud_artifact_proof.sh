#!/usr/bin/env bash
set -euo pipefail
ARTIFACT="$1"
OUT="${2:-mbw-v50-cloud-artifact-proof.json}"
test -f "$ARTIFACT"
SHA="$(sha256sum "$ARTIFACT" | awk '{print $1}')"
SIZE="$(stat -c '%s' "$ARTIFACT")"
unzip -t "$ARTIFACT" >/dev/null
TYPE="UNKNOWN"
if [[ "$ARTIFACT" == *.apk ]]; then
  TYPE="APK"
  unzip -l "$ARTIFACT" | grep -q 'AndroidManifest.xml'
  unzip -l "$ARTIFACT" | grep -Eq 'classes[0-9]*\.dex'
  unzip -l "$ARTIFACT" | grep -q 'resources.arsc'
elif [[ "$ARTIFACT" == *.aab ]]; then
  TYPE="AAB"
  unzip -l "$ARTIFACT" | grep -q 'BundleConfig.pb'
  unzip -l "$ARTIFACT" | grep -q 'base/manifest/AndroidManifest.xml'
  unzip -l "$ARTIFACT" | grep -Eq 'base/dex/classes[0-9]*\.dex'
  unzip -l "$ARTIFACT" | grep -q 'base/resources.pb'
else
  echo "UNSUPPORTED_ARTIFACT=$ARTIFACT" >&2
  exit 2
fi
SIGNATURE_COUNT="$(unzip -Z1 "$ARTIFACT" | grep -Ei '^META-INF/.*\.(RSA|DSA|EC|SF)$' | wc -l | tr -d ' ')"
test "$SIZE" -gt 1000000
printf '{"green":true,"artifact_type":"%s","sha256":"%s","size":%s,"signature_entries":%s}
' "$TYPE" "$SHA" "$SIZE" "$SIGNATURE_COUNT" > "$OUT"
set-output artifact_sha256 "$SHA"
set-output artifact_size "$SIZE"
set-output artifact_type "$TYPE"
set-output proof_state "GREEN"
