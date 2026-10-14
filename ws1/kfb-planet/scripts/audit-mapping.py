#!/usr/bin/env python3
"""Kartenvertrag gegen das gedruckte PDF prüfen, für alle Nicht-MED-Decks des Spielpools.
Je Deck: PDF laden (MEDIA_COMMIT), mit scripts/audit-mapping.swift (PDFKit + Apple Vision) die Viertel lesen und
den erkannten Titel mit dem Kartennamen aus src/data/cards.json vergleichen.
Ergebnis: src/data/mapping-audit.json (Status je Deck) und test/out/audit/<deck>.json (Rohdaten).
Aufruf: python3 scripts/audit-mapping.py [deckId ...]   (ohne Argumente: alle Nicht-MED-Decks)
Braucht: swiftc-Binary test/out/bin/audit-mapping (swiftc -O scripts/audit-mapping.swift -o test/out/bin/audit-mapping)"""
import json, os, re, subprocess, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher

commit = re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)
base = f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/'
reg = {d['packId']: d for d in json.load(urllib.request.urlopen(base + 'index.json'))['decks']}
cards = json.load(open('src/data/cards.json'))
deck_ids = [d[0] for d in cards['decks']]
names = {}
for c in cards['cards']: names.setdefault(deck_ids[c[0]], {})[c[1]] = c[2]
todo = sys.argv[1:] or [d for d in deck_ids if not d.startswith('medkayfab_')]
os.makedirs('test/out/pdf', exist_ok=True); os.makedirs('test/out/audit', exist_ok=True)

norm = lambda s: re.sub(r'[^A-Z0-9 ]+', ' ', s.upper().replace('’', "'")).split()
def match(name, lines):
    nt = [t for t in norm(name) if len(t) >= 3] or norm(name)
    if not nt or not lines: return False
    head = lines[:5]
    joined = set(t for l in head for t in norm(l))
    if sum(t in joined for t in nt) / len(nt) >= 0.7: return True
    nn = ' '.join(norm(name))
    return any(SequenceMatcher(None, nn, ' '.join(norm(l))).ratio() >= 0.8 for l in head)

def audit(deck):
    try: return audit1(deck)
    except Exception as e: return deck, {'status': 'ERROR', 'error': f'{type(e).__name__}: {e}'[:200]}

def audit1(deck):
    d = reg.get(deck)
    if not d or not d.get('pdf'): return deck, {'status': 'NO_PDF'}
    off = d['coverOffset'] if d['coverOffset'] is not None else 1
    pdf = 'test/out/pdf/' + d['pdf']
    if not os.path.exists(pdf): urllib.request.urlretrieve(base + urllib.parse.quote(d['pdf']), pdf)
    nm = names.get(deck, {})
    count = max(nm) if nm else d['cardCount']
    raw = json.loads(subprocess.run(['test/out/bin/audit-mapping', pdf, str(off), str(count)], capture_output=True, check=True).stdout)
    ocr = {c['n']: c['text'] for c in raw['cards']}
    json.dump({'deck': deck, 'coverOffset': off, **raw}, open(f'test/out/audit/{deck}.json', 'w'), ensure_ascii=False)
    readable = [n for n in nm if ocr.get(n)]
    # Verschiebung prüfen: PDF-Viertel n zeigt Karte n+shift?
    score = {s: sum(match(nm[n + s], ocr[n]) for n in readable if (n + s) in nm) for s in range(-8, 9)}
    best = max(score, key=lambda s: (score[s], -abs(s)))
    ok = score[0]
    rate = ok / len(readable) if readable else 0
    wrong = [n for n in readable if not match(nm[n], ocr[n])][:12]
    status = 'SAFE' if readable and len(readable) >= 0.5 * len(nm) and rate >= 0.85 else 'UNSAFE'
    return deck, {'status': status, 'cards': len(nm), 'readable': len(readable), 'matched': ok, 'rate': round(rate, 3),
                  'bestShift': best, 'bestShiftMatched': score[best], 'coverOffset': off, 'pdfPages': raw['pdfPages'],
                  'mismatchSample': wrong}

path = 'src/data/mapping-audit.json'
prev = json.load(open(path)) if os.path.exists(path) else {'decks': {}}
prev.update({'schema': 'kfb.ws1.mapping-audit/1', 'media': commit,
             'method': 'PDFKit-Render (scale 1.5) + Apple Vision OCR je Viertel; Titel gegen cards.json; SAFE = ≥85 % der lesbaren Karten passen bei Verschiebung 0'})
with ThreadPoolExecutor(max_workers=3) as ex:
    for deck, r in ex.map(audit, todo):
        prev['decks'][deck] = r
        json.dump(prev, open(path, 'w'), ensure_ascii=False, indent=1, sort_keys=True)  # nach jedem Deck sichern
        print(deck, r.get('status'), r.get('matched'), '/', r.get('readable'), 'shift', r.get('bestShift'), r.get('error', ''), flush=True)
s = [k for k, v in prev['decks'].items() if v.get('status') == 'SAFE']
print(f"SAFE {len(s)} / {len(prev['decks'])}")
