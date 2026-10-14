#!/usr/bin/env python3
"""Kartenvertrag gegen das gedruckte PDF prüfen, für alle Nicht-MED-Decks des Spielpools.
Je Deck: PDF laden (MEDIA_COMMIT), mit scripts/audit-mapping.swift (PDFKit + Apple Vision) die Viertel lesen und
den erkannten Titel mit dem Kartennamen aus src/data/cards.json vergleichen.
Ergebnis: src/data/mapping-audit.json (Status je Deck) und test/audit/<deck>.json (Rohdaten).
Aufruf: python3 scripts/audit-mapping.py [deckId ...]   (ohne Argumente: alle Nicht-MED-Decks)
Braucht: swiftc-Binary test/out/bin/audit-mapping (swiftc -O scripts/audit-mapping.swift -o test/out/bin/audit-mapping)"""
import json, os, re, subprocess, sys, unicodedata, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher

# MEDIA=<commit> prüft einen anderen Registry-Stand; OUT=<datei> und RAW=<ordner> trennen die Ergebnisse vom Spielstand.
# NAMES=media vergleicht mit den Kartennamen aus den Deck-JSONs in media/kfb (statt src/data/cards.json).
commit = os.environ.get('MEDIA') or re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)
RAW = os.environ.get('RAW', 'test/audit'); OUT = os.environ.get('OUT', 'src/data/mapping-audit.json'); NAMES = os.environ.get('NAMES', 'cards')
base = f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/'
reg = {d['packId']: d for d in json.load(urllib.request.urlopen(base + 'index.json'))['decks']}
cards = json.load(open('src/data/cards.json'))
deck_ids = [d[0] for d in cards['decks']]
names = {}
for c in cards['cards']: names.setdefault(deck_ids[c[0]], {})[c[1]] = c[2]
if NAMES == 'media':  # Kartennamen aus den Deck-JSONs am geprüften Registry-Stand
    names = {}
    for d in deck_ids:
        rd = reg.get(d)
        if not rd or not rd.get('data'): continue
        try:
            dj = json.load(urllib.request.urlopen(base + urllib.parse.quote(rd['data'])))
            names[d] = {int(c['cardNumber']): c['cardName'] for c in dj.get('cards', []) if str(c.get('cardNumber', '')).isdigit()}
        except Exception as e: print('names', d, e)
args = [a for a in sys.argv[1:] if not a.startswith('--')]
RESCORE = '--rescore' in sys.argv  # vorhandene OCR-Rohdaten test/audit/<deck>.json neu bewerten, ohne PDF/OCR
todo = args or [d for d in deck_ids if not d.startswith('medkayfab_')]
os.makedirs('test/out/pdf', exist_ok=True); os.makedirs(RAW, exist_ok=True)

# Je Karte: Der Titel im Viertel muss den eigenen Namen tragen und darf zu keiner anderen Karte des Decks
# gleich gut oder besser passen (doppelte Namen, Nachbarkarten). Füllwörter zählen nicht; Unicode bleibt erhalten.
STOP = {'THE', 'A', 'AN', 'OF', 'AND', 'TO', 'IN', 'ON', 'FOR', 'DER', 'DIE', 'DAS', 'UND', 'LE', 'LA'}
def toks(s): return [t for t in re.split(r'[^\w]+', unicodedata.normalize('NFKC', s).upper().replace('’', "'")) if t]
def score(name, lines):
    head = lines[:7]
    if not head: return 0.0
    got = set(t for l in head for t in toks(l))
    nt = [t for t in toks(name) if t not in STOP and len(t) >= 2] or toks(name)
    if not nt: return 0.0
    tok = sum(t in got for t in nt) / len(nt)
    nn = ' '.join(toks(name))
    seq = max(SequenceMatcher(None, nn, ' '.join(toks(l))).ratio() for l in head)
    return max(tok, seq)
def card_ok(n, nm, lines):
    own = score(nm[n], lines)
    if own < 0.75: return False
    other = max((score(nm[m], lines) for m in nm if m != n), default=0)
    return own > other
def match(name, lines): return score(name, lines) >= 0.75  # nur für die Verschiebungs-Diagnose

def audit(deck):
    try: return audit1(deck)
    except Exception as e: return deck, {'status': 'ERROR', 'error': f'{type(e).__name__}: {e}'[:200]}

def audit1(deck):
    d = reg.get(deck)
    if not d or not d.get('pdf'): return deck, {'status': 'NO_PDF'}
    off = d['coverOffset'] if d['coverOffset'] is not None else 1
    nm = names.get(deck, {})
    count = max(nm) if nm else d['cardCount']
    rawp = f'{RAW}/{deck}.json'
    if RESCORE and os.path.exists(rawp):
        raw = json.load(open(rawp))
    else:
        pdf = 'test/out/pdf/' + d['pdf']
        if not os.path.exists(pdf): urllib.request.urlretrieve(base + urllib.parse.quote(d['pdf']), pdf)
        raw = json.loads(subprocess.run(['test/out/bin/audit-mapping', pdf, str(off), str(count)], capture_output=True, check=True).stdout)
        json.dump({'deck': deck, 'coverOffset': off, **raw}, open(rawp, 'w'), ensure_ascii=False)
    ocr = {c['n']: c['text'] for c in raw['cards']}
    readable = [n for n in nm if ocr.get(n)]
    # Verschiebung prüfen: PDF-Viertel n zeigt Karte n+shift?
    score = {s: sum(match(nm[n + s], ocr[n]) for n in readable if (n + s) in nm) for s in range(-8, 9)}
    best = max(score, key=lambda s: (score[s], -abs(s)))
    okc = sorted(n for n in readable if card_ok(n, nm, ocr[n]))
    rate = len(okc) / len(readable) if readable else 0
    status = 'SAFE' if readable and len(readable) >= 0.5 * len(nm) and rate >= 0.85 else 'UNSAFE'
    # Freigabe je Karte: nur Karten mit eindeutig belegtem Titel (unlesbare und zweideutige bleiben gesperrt)
    return deck, {'status': status, 'cards': len(nm), 'readable': len(readable), 'matched': len(okc), 'rate': round(rate, 3),
                  'bestShift': best, 'bestShiftMatched': score[best], 'coverOffset': off, 'pdfPages': raw['pdfPages'],
                  'ok': okc if status == 'SAFE' else [], 'blocked': sorted(set(nm) - set(okc)) if status == 'SAFE' else sorted(nm)}

path = OUT
prev = json.load(open(path)) if os.path.exists(path) else {'decks': {}}
prev.update({'schema': 'kfb.ws1.mapping-audit/1', 'media': commit,
             'method': 'PDFKit-Render (scale 1.5) + Apple Vision OCR je Viertel; Titel (erste 7 Zeilen, ohne Füllwörter) gegen cards.json; Karte ok = eigener Name ≥0,75 und besser als jede andere Karte des Decks; Deck SAFE = ≥85 % der lesbaren Karten ok; Bilder nur für Karten in ok'})
with ThreadPoolExecutor(max_workers=3) as ex:
    for deck, r in ex.map(audit, todo):
        prev['decks'][deck] = r
        json.dump(prev, open(path, 'w'), ensure_ascii=False, indent=1, sort_keys=True)  # nach jedem Deck sichern
        print(deck, r.get('status'), r.get('matched'), '/', r.get('readable'), 'shift', r.get('bestShift'), r.get('error', ''), flush=True)
s = [k for k, v in prev['decks'].items() if v.get('status') == 'SAFE']
print(f"SAFE {len(s)} / {len(prev['decks'])}")
