#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import hashlib
import json
import re
import sys
import zipfile

APK = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
OUT = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path.cwd() / 'MBW_APK_FORENSIC_REPAIR_V3.json'
CUSTODY = Path(sys.argv[3]).resolve() if len(sys.argv) > 3 else None
EXPECTED_CINEMATIC_SHA256 = 'e08160ee0cd29d6c283cf54fd3100d1af17851ce8599bac1efca844990c92122'

if APK is None or not APK.is_file():
    raise SystemExit('APK_MISSING')

sha = hashlib.sha256(APK.read_bytes()).hexdigest()
custody = {}
expected_posters = []
if CUSTODY is not None and CUSTODY.is_file():
    custody = json.loads(CUSTODY.read_text(encoding='utf-8'))
    expected_posters = [
        item for item in custody.get('mapping', [])
        if item.get('medium') == 'POSTER'
    ]
required_utf8 = [
    'MBW', '1.0.42', 'MATCHMAKING', 'MASTER OF GAMES', 'MASTER OF COINS',
    'TRAVEL LOCAL', 'TRAVEL OVERSEAS', 'MERCHANDISE', 'KAMASHASTRA',
    'LIVE LOUNGE', 'MEN’S LOUNGE', 'NEARBY', 'AI POSTER', 'PRIVACY',
    'TERMS', 'ACCOUNT CONTROL', 'MBW_GOLDEN_MASTER_STATE_V2',
    'MBW_GOLDEN_MASTER_DEVICE_KEY_V2', 'STATE_INTEGRITY_FAILED',
    'LUDO_ROLL', 'SEEP_PLAY', 'SICBO_PLAY', 'TRAVEL_BOOK', 'TRAVEL_CANCEL',
    'POSTER_SAVE', 'CHECKOUT', 'KAMA_RESULT', 'ACE 444 REQUIRED',
    'ORDERED_PREVIEW_NO_SETTLEMENT', '2026-07-13-v1',
]
forbidden_runtime = [
    'MBW_FINAL_APK',
    'ONLYONEGOD',
    '$ONLY1GOD$',
    'PAID_PREVIEW',
]
forbidden_manifest_permissions = [
    'android.permission.CAMERA',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.READ_MEDIA_IMAGES',
    'android.permission.READ_MEDIA_VIDEO',
    'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
    'android.permission.RECORD_AUDIO',
    'android.permission.ACCESS_BACKGROUND_LOCATION',
]

with zipfile.ZipFile(APK) as zf:
    bad_crc = zf.testzip()
    names = zf.namelist()
    blobs = []
    manifest_blob = b''
    bundle_names = []
    image_hashes = {}
    cinematic_matches = []
    for info in zf.infolist():
        lower = info.filename.lower()
        if info.filename == 'AndroidManifest.xml':
            try:
                manifest_blob = zf.read(info)
            except Exception:
                manifest_blob = b''
        if info.file_size <= 12_000_000 and (
            lower.endswith(('.bundle', '.hbc', '.json', '.xml', '.arsc', '.dex'))
            or 'assets/' in lower
            or 'manifest' in lower
        ):
            try:
                data = zf.read(info)
                blobs.append(data)
                if lower.endswith(('.bundle', '.hbc')) or 'index.android' in lower:
                    bundle_names.append(info.filename)
            except Exception:
                pass
        if lower.endswith(('.jpg', '.jpeg', '.png', '.webp')) and info.file_size > 1024:
            try:
                digest = hashlib.sha256(zf.read(info)).hexdigest()
                image_hashes.setdefault(digest, []).append(info.filename)
            except Exception:
                pass
        if lower.endswith('.mp4'):
            try:
                data = zf.read(info)
                cinematic_matches.append({
                    'entry': info.filename,
                    'bytes': len(data),
                    'sha256': hashlib.sha256(data).hexdigest(),
                })
            except Exception:
                pass

blob = b'\n'.join(blobs)

def carried(token):
    raw = token.encode('utf-8')
    wide = token.encode('utf-16le')
    return raw in blob or wide in blob

missing = [token for token in required_utf8 if not carried(token)]
forbidden_runtime_hits = [token for token in forbidden_runtime if carried(token)]
forbidden_permission_hits = [
    token for token in forbidden_manifest_permissions
    if token.encode('utf-8') in manifest_blob or token.encode('utf-16le') in manifest_blob
]
forbidden_hits = forbidden_runtime_hits + forbidden_permission_hits
hermes_libs = [name for name in names if re.search(r'lib/[^/]+/libhermes\.so$', name)]
jsc_libs = [name for name in names if 'libjsc' in name.lower()]
signature_entries = [name for name in names if name.upper().startswith('META-INF/') and name.upper().endswith(('.RSA', '.DSA', '.EC'))]
duplicate_image_groups = [group for group in image_hashes.values() if len(group) > 1]
poster_apk_mapping = []
poster_missing_routes = []
for item in expected_posters:
    digest = item.get('sourceSha256')
    entries = image_hashes.get(digest, []) if digest else []
    row = {
        'route': item.get('route'),
        'component': item.get('component'),
        'source': item.get('source'),
        'sourceSha256': digest,
        'apkEntries': entries,
        'carried': bool(entries),
    }
    poster_apk_mapping.append(row)
    if not entries:
        poster_missing_routes.append(item.get('route'))
cinematic_green = any(item['sha256'] == EXPECTED_CINEMATIC_SHA256 for item in cinematic_matches)

result = {
    'apk': str(APK),
    'bytes': APK.stat().st_size,
    'sha256': sha,
    'zip_entry_count': len(names),
    'zip_crc_failure': bad_crc,
    'bundle_entries': bundle_names,
    'hermes_library_count': len(hermes_libs),
    'hermes_libraries': hermes_libs,
    'jsc_library_count': len(jsc_libs),
    'signature_entry_count': len(signature_entries),
    'required_token_missing': missing,
    'forbidden_runtime_hits': forbidden_runtime_hits,
    'forbidden_manifest_permission_hits': forbidden_permission_hits,
    'forbidden_token_hits': forbidden_hits,
    'cinematic_assets': cinematic_matches,
    'cinematic_exact_11s_source_hash': cinematic_green,
    'exact_duplicate_image_group_count': len(duplicate_image_groups),
    'poster_route_expected_count': len(expected_posters),
    'poster_route_carried_count': sum(1 for item in poster_apk_mapping if item['carried']),
    'poster_missing_routes': poster_missing_routes,
    'poster_apk_mapping': poster_apk_mapping,
    'green': (
        bad_crc is None
        and len(hermes_libs) > 0
        and not jsc_libs
        and not missing
        and not forbidden_hits
        and cinematic_green
        and len(expected_posters) == 30
        and not poster_missing_routes
    ),
    'generated_at': datetime.now().isoformat(),
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(result, indent=2), encoding='utf-8')
for key, value in result.items():
    if isinstance(value, (list, dict)):
        print(f'{key.upper()}={json.dumps(value, ensure_ascii=False)}')
    else:
        print(f'{key.upper()}={value}')
print('FINAL=MBW_APK_FORENSIC_REPAIR_V3_GREEN' if result['green'] else 'FINAL=MBW_APK_FORENSIC_REPAIR_V3_BLOCKED')
raise SystemExit(0 if result['green'] else 95)
