from pathlib import Path
import json, os, subprocess, sys

root = Path(sys.argv[1]).resolve()
report = Path(sys.argv[2]).resolve()

expo_package = json.loads((root / "node_modules/expo/package.json").read_text(encoding="utf-8"))
expo_version = str(expo_package.get("version", ""))
expo_major = int(expo_version.split(".", 1)[0]) if expo_version.split(".", 1)[0].isdigit() else 0
bundled = json.loads((root / "node_modules/expo/bundledNativeModules.json").read_text(encoding="utf-8"))
root_rn_package = root / "node_modules/react-native/package.json"
root_rn = json.loads(root_rn_package.read_text(encoding="utf-8"))
lock = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))

physical = []
for package in (root / "node_modules").glob("**/react-native/package.json"):
    try:
        resolved = package.resolve()
        data = json.loads(resolved.read_text(encoding="utf-8"))
    except Exception:
        continue
    if resolved.parent.name != "react-native":
        continue
    physical.append({
        "version": str(data.get("version", "")),
        "path": str(resolved),
    })

# Path-based lockfile detection is required because package-lock v3 entries
# commonly omit the `name` field.
lock_rows = []
for key, value in (lock.get("packages") or {}).items():
    normalized = key.replace("\\", "/").rstrip("/")
    if normalized == "node_modules/react-native" or normalized.endswith("/node_modules/react-native"):
        lock_rows.append({
            "path": key or ".",
            "version": str((value or {}).get("version", "")),
        })

npm_ls_path = report.parent / "npm_ls_react_native.json"
npm_ls_stderr = report.parent / "npm_ls_react_native.stderr"
completed = subprocess.run(
    ["npm", "ls", "react-native", "--all", "--json"],
    cwd=root,
    text=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
npm_ls_path.write_text(completed.stdout or "{}", encoding="utf-8")
npm_ls_stderr.write_text(completed.stderr or "", encoding="utf-8")

try:
    npm_tree = json.loads(completed.stdout or "{}")
except Exception:
    npm_tree = {}

npm_rows = []
def walk(value, trail):
    if not isinstance(value, dict):
        return
    deps = value.get("dependencies")
    if not isinstance(deps, dict):
        return
    for name, child in deps.items():
        next_trail = trail + [name]
        if name == "react-native" and isinstance(child, dict):
            npm_rows.append({
                "version": str(child.get("version", "")),
                "path": " > ".join(next_trail),
                "invalid": bool(child.get("invalid")),
                "extraneous": bool(child.get("extraneous")),
            })
        walk(child, next_trail)
walk(npm_tree, [])

physical_unique = []
seen = set()
for row in physical:
    if row["path"] in seen:
        continue
    seen.add(row["path"])
    physical_unique.append(row)

physical_versions = sorted({row["version"] for row in physical_unique if row["version"]})
lock_versions = sorted({row["version"] for row in lock_rows if row["version"]})
npm_versions = sorted({row["version"] for row in npm_rows if row["version"]})
expected = str(bundled.get("react-native", ""))
root_version = str(root_rn.get("version", ""))

same_version_duplicate_count = max(0, len(physical_unique) - len(physical_versions))
invalid_npm_rows = [row for row in npm_rows if row["invalid"] or row["extraneous"]]

green = all([
    expo_major == 54,
    root_version == expected,
    len(physical_unique) == 1,
    len(physical_versions) == 1,
    physical_versions[0] == expected,
    len(lock_rows) == 1,
    len(lock_versions) == 1,
    lock_versions[0] == expected,
    completed.returncode == 0,
    not invalid_npm_rows,
])

result = {
    "method": "FILESYSTEM_PLUS_PACKAGE_LOCK_V3_PATHS_PLUS_NPM_LS",
    "expoVersion": expo_version,
    "expoSdkMajor": expo_major,
    "expectedReactNative": expected,
    "rootReactNativeVersion": root_version,
    "filesystemCopies": physical_unique,
    "filesystemCopyCount": len(physical_unique),
    "filesystemDistinctVersions": physical_versions,
    "packageLockCopies": lock_rows,
    "packageLockCopyCount": len(lock_rows),
    "packageLockDistinctVersions": lock_versions,
    "npmLsRc": completed.returncode,
    "npmLsRows": npm_rows,
    "npmLsDistinctVersions": npm_versions,
    "npmLsInvalidRows": invalid_npm_rows,
    "sameVersionDuplicateCount": same_version_duplicate_count,
    "green": green,
}
report.write_text(json.dumps(result, indent=2), encoding="utf-8")

print(f"EXPO_VERSION={result['expoVersion']}")
print(f"EXPO_SDK_MAJOR={result['expoSdkMajor']}")
print(f"SDK54_EXPECTED_REACT_NATIVE={expected}")
print(f"ROOT_REACT_NATIVE_VERSION={root_version}")
print(f"FILESYSTEM_REACT_NATIVE_COPY_COUNT={len(physical_unique)}")
print(f"FILESYSTEM_REACT_NATIVE_VERSIONS={','.join(physical_versions)}")
print(f"LOCKFILE_REACT_NATIVE_COPY_COUNT={len(lock_rows)}")
print(f"LOCKFILE_REACT_NATIVE_VERSIONS={','.join(lock_versions)}")
print(f"NPM_LS_REACT_NATIVE_RC={completed.returncode}")
print(f"NPM_LS_REACT_NATIVE_ROWS={len(npm_rows)}")
print(f"NPM_LS_REACT_NATIVE_VERSIONS={','.join(npm_versions)}")
print(f"SAME_VERSION_DUPLICATE_COUNT={same_version_duplicate_count}")
for row in physical_unique:
    print(f"REACT_NATIVE_PHYSICAL_COPY={row['version']}|{row['path']}")
for row in lock_rows:
    print(f"REACT_NATIVE_LOCK_COPY={row['version']}|{row['path']}")
for row in npm_rows:
    print(f"REACT_NATIVE_NPM_TREE={row['version']}|{row['path']}|INVALID={row['invalid']}|EXTRANEOUS={row['extraneous']}")
print(f"DEPENDENCY_CONVERGENCE_GREEN={str(green).lower()}")
raise SystemExit(0 if green else 30)
