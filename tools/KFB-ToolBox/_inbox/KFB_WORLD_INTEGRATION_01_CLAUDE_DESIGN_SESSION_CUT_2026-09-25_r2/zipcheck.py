#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parent
REQUIRED = [
    "START_HERE.md", "RETURN.md", "HANDOVER.md", "CURRENT_STATE.md",
    "CHANGELOG.md", "HOUSEKEEPING.md", "SOURCE.json",
    "EXPORT_MANIFEST.json", "TEST_REPORT.md", "CHECKSUMS.sha256",
    "NEXT_CHAT.md",
]
errors = []

for name in REQUIRED:
    if not (ROOT / name).exists():
        errors.append(f"missing required file: {name}")

for p in ROOT.rglob("*"):
    if p.is_file() and p.name != "zipcheck.py" and p.stat().st_size > 2 * 1024 * 1024:
        errors.append(f"file >2MB: {p.relative_to(ROOT)} ({p.stat().st_size} bytes)")

manifest = {}
try:
    manifest = json.loads((ROOT / "EXPORT_MANIFEST.json").read_text(encoding="utf-8"))
    if not isinstance(manifest, dict):
        errors.append("EXPORT_MANIFEST.json is not an object")
except Exception as exc:
    errors.append(f"bad EXPORT_MANIFEST.json: {exc}")

try:
    source = json.loads((ROOT / "SOURCE.json").read_text(encoding="utf-8"))
    if source.get("schema") != "kfb.claude-design-session-cut/1":
        errors.append("SOURCE.json schema mismatch")
except Exception as exc:
    errors.append(f"bad SOURCE.json: {exc}")

# extension (documented, stricter): every EXPORT_MANIFEST.files entry exists with its recorded size
for f in (manifest.get("files", []) if isinstance(manifest, dict) else []):
    p = ROOT / f["exportPath"]
    if not p.exists():
        errors.append(f"manifest file missing: {f['exportPath']}")
    elif p.stat().st_size != f["size"]:
        errors.append(f"size mismatch: {f['exportPath']}")

if errors:
    print("ZIPCHECK FAIL")
    for e in errors:
        print("-", e)
    sys.exit(1)

print("ZIPCHECK PASS")
