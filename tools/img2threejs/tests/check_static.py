#!/usr/bin/env python3
"""Offline source checks. A PASS does not assert a working or accurate 3D render."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / 'archive/2026-09-18/koelner_dom_lowpoly_threejs.html'
CURRENT = ROOT / 'prototypes/koelner-dom/v0.1/index.html'
EXPECTED_ORIGINAL_SHA256 = '7df3afec91969eaed56b42f28b7b9f04acebfad4e04dab54d165389874c70e49'


def main() -> int:
    old = ORIGINAL.read_text(encoding='utf-8')
    new = CURRENT.read_text(encoding='utf-8')
    checks = []

    def check(name: str, condition: bool) -> None:
        checks.append({'check': name, 'status': 'PASS' if condition else 'FAIL'})

    check('original_archive_byte_identity', hashlib.sha256(ORIGINAL.read_bytes()).hexdigest() == EXPECTED_ORIGINAL_SHA256)
    maps = re.findall(r'<script type="importmap">(.*?)</script>', new, re.S)
    mapping = json.loads(maps[0])['imports'] if len(maps) == 1 else {}
    check('single_version_pinned_importmap', mapping == {
        'three': 'https://unpkg.com/three@0.161.0/build/three.module.js',
        'three/addons/': 'https://unpkg.com/three@0.161.0/examples/jsm/'})
    check('importmap_precedes_module', new.find('type="importmap"') < new.find('type="module"'))
    check('addon_uses_mapped_specifier', 'await import("three/addons/controls/OrbitControls.js")' in new)
    old_model = old.split('// Materials', 1)[1].split('// Animation loop', 1)[0].strip()
    new_model = new.split('// Materials', 1)[1].split('// v0.1:', 1)[0].strip()
    check('model_building_block_unchanged', old_model == new_model)
    check('english_current_ui', '<html lang="en"' in new)
    check('visible_startup_error_handler_present', 'Viewer could not start:' in new)
    check('original_has_no_importmap', 'type="importmap"' not in old)
    node = shutil.which('node')
    if node:
        for label, text in [('archive', old), ('v0.1', new)]:
            for i, module in enumerate(re.findall(r'<script type="module">(.*?)</script>', text, re.S)):
                result = subprocess.run([node, '--input-type=module', '--check'], input=module, text=True, capture_output=True)
                check(f'{label}_module_{i}_syntax', result.returncode == 0)
                if result.returncode:
                    checks[-1]['error'] = result.stderr.strip()
    else:
        checks.append({'check': 'javascript_syntax', 'status': 'NOT_TESTED', 'reason': 'Node.js unavailable'})
    failed = any(c['status'] != 'PASS' for c in checks)
    report = {
        'scope': 'STATIC SOURCE CHECKS ONLY',
        'status': 'INCOMPLETE_OR_FAILED' if failed else 'PASS',
        'checks': checks,
        'files': {str(p.relative_to(ROOT)): {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in (ORIGINAL, CURRENT)},
        'notProven': ['CDN availability', '3D rendering', 'architectural accuracy', 'ToolBox integration', 'public deployment', 'Georg acceptance']}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
