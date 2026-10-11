#!/usr/bin/env python3
"""Acceptance index: collects every Georg PASS/TUNE/FAIL/OPEN marker from STATUS/RETURN/CHANGELOG/PROJECT_STATE files.
No LLM needed. Usage: python3 build_index.py > docs/ACCEPTANCE_INDEX.md"""
import os, re, sys, datetime
ROOT = os.path.expanduser('~/Dropbox/CLAUDE')
SKIP = ('KFB Open World', 'node_modules', '.git', 'NOTEBOOKLM_UPLOAD')
NAMES = re.compile(r'(STATUS|RETURN|CHANGELOG|PROJECT_STATE|TEST_REPORT|HANDOVER)[^/]*\.md$', re.I)
VERDICT = re.compile(r'\b(PASS|TUNE|FAIL|FAILED|OPEN|PENDING|ACCEPTED[A-Z ]*)\b')
HEAD = re.compile(r'GEORG[ -]?ACCEPTANCE|Georg-Abnahme', re.I)
rows = []
for dp, dn, fn in os.walk(ROOT):
    if any(s in dp for s in SKIP): dn[:] = []; continue
    for f in fn:
        if not NAMES.search(f): continue
        p = os.path.join(dp, f)
        try: lines = open(p, encoding='utf-8', errors='ignore').read().splitlines()
        except Exception: continue
        col = None
        for i, l in enumerate(lines):
            cells = [c.strip() for c in l.strip().strip('|').split('|')] if l.strip().startswith('|') else None
            if cells and any(HEAD.search(c) for c in cells) and len(cells) > 2:
                col = next(k for k, c in enumerate(cells) if HEAD.search(c)); continue
            if cells and col is not None:
                if set(''.join(cells)) <= set('-: '): continue
                if col < len(cells) and cells[col] and cells[col] not in ('–', '-'):
                    rows.append((p, i + 1, cells[0][:80], cells[col][:120])); continue
            elif not cells: col = None
            if HEAD.search(l) and VERDICT.search(l):
                rows.append((p, i + 1, '', l.strip()[:160]))
print(f'# Acceptance-Index (automatisch, {datetime.date.today()})\n')
print('Quelle: alle STATUS/RETURN/CHANGELOG/PROJECT_STATE/TEST_REPORT/HANDOVER-Dateien unter ~/Dropbox/CLAUDE (ohne KFB Open World). Spalte bzw. Zeile „GEORG ACCEPTANCE“ bzw. „Georg-Abnahme“.\n')
print('| Datei:Zeile | Teil | Georg |\n| --- | --- | --- |')
for p, n, part, v in rows:
    print(f"| `{os.path.relpath(p, ROOT)}:{n}` | {part.replace('|','/')} | {v.replace('|','/')} |")
print(f'\n{len(rows)} Einträge.', file=sys.stderr)
