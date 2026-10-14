#!/usr/bin/env python3
"""Unabhängige Referenz für ein Bildpaar: Deck-PDF laden (MEDIA_COMMIT) und mit macOS PDFKit
(scripts/crop.swift, aus MODULE_INVENTORY_R1/proofs) die Viertelseite schneiden. Kein pdf.js im Spiel.
Aufruf: python3 scripts/make-ref.py <deckId> <n>  ->  test/ref/card_<deckId>_<n>.png (745 px) + .json
Die .json hält den mit Apple Vision gelesenen Text der Referenz (aus test/out/audit/<deck>.json, scripts/audit-mapping.py),
damit der Test Name gegen Bild prüfen kann, nicht nur Name gegen Name."""
import json, math, os, re, subprocess, sys, urllib.parse, urllib.request
deck, n = sys.argv[1], int(sys.argv[2])
commit = re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)
base = f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/'
reg = json.load(urllib.request.urlopen(base + 'index.json'))
d = next(x for x in reg['decks'] if x['packId'] == deck)
off = d['coverOffset'] if d['coverOffset'] is not None else 1
page, quad = off + 1 + (n - 1) // 4, (n - 1) % 4
os.makedirs('test/out/pdf', exist_ok=True)
pdf = 'test/out/pdf/' + d['pdf']
if not os.path.exists(pdf): urllib.request.urlretrieve(base + urllib.parse.quote(d['pdf']), pdf)
out = f'test/ref/card_{deck}_{n}.png'
subprocess.run(['swift', 'scripts/crop.swift', pdf, str(page), str(quad), out], check=True)
subprocess.run(['sips', '-s', 'format', 'png', '--resampleWidth', '745', out, '--out', out], check=True, capture_output=True)
audit = json.load(open(f'test/out/audit/{deck}.json'))
ocr = next(c['text'] for c in audit['cards'] if c['n'] == n)
json.dump({'deck': deck, 'n': n, 'page': page, 'quad': quad, 'media': commit, 'ocr': ocr[:6]}, open(out[:-4] + '.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({'deck': deck, 'n': n, 'page': page, 'quad': quad, 'out': out, 'media': commit}))
