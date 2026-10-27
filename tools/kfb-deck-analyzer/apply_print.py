#!/usr/bin/env python3
"""Deck-Analyzer R1: Druck-Transkription (pilot/<packId>.print.json) in das Deck-JSON eintragen.

Nutzung: python3 apply_print.py <repo> <packId> [--dry]
- Karten über Nummer zuordnen (cardNumber oder num). Felder bleiben, nur Text/Bewertung kommt dazu.
- Alte Werte: jsonLegacy {cardName, power, lore} (nur wenn noch keins da ist), gradeLegacy bleibt als grade (1–3, Spiel liest es).
- Deck: deckRating neu; topCards/worstCards/viralScore alt → *Legacy.
Gibt eine Änderungsliste als JSON auf stdout aus.
"""
import json, sys, os, re

repo, pack = sys.argv[1], sys.argv[2]
dry = '--dry' in sys.argv
here = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(here, 'pilot', f'{pack}.print.json')))
idx = json.load(open(os.path.join(repo, 'media/kfb/index.json')))
entry = next(d for d in idx['decks'] if d['packId'] == pack)
path = os.path.join(repo, 'media/kfb', entry['data'])
raw = open(path, encoding='utf-8').read()
doc = json.loads(raw)
indent = None if '\n' not in raw.strip()[:200] else 2
cards = doc['cards']
NUM = 'cardNumber' if any('cardNumber' in c for c in cards) else 'num'
NAME = 'cardName' if any('cardName' in c for c in cards) else 'name'
byNum = {c.get(NUM): c for c in cards}
norm = lambda s: re.sub(r'\s+', ' ', (s or '').strip())
# Titel: gerade Apostrophe/Anführungszeichen wie im Kanon 14.10. (Titel-Zuordnung in Spiel/Triplets); Druckform bleibt in cardNamePrint
plain = lambda s: (s or '').replace('\u2019', "'").replace('\u2018', "'").replace('\u201c', '"').replace('\u201d', '"')
log = {'packId': pack, 'file': entry['data'], 'changed': [], 'confirmed': [], 'added': [], 'notInPrint': [], 'open': []}

def put(card, key, val, after=None):
    """Schlüssel setzen; neue Schlüssel hinter `after` einfügen, damit die Reihenfolge lesbar bleibt."""
    if key in card or after not in card:
        card[key] = val; return
    items = list(card.items()); card.clear()
    for k, v in items:
        card[k] = v
        if k == after: card[key] = val

seen = set()
for pc in P['cards']:
    n = pc['cardNumber']; seen.add(n)
    c = byNum.get(n)
    if c is None:
        c = {NUM: n, NAME: pc['cardName']}; cards.append(c); log['added'].append(n)
    old = {'cardName': c.get(NAME), 'power': c.get('power'), 'lore': c.get('lore')}
    new = {'cardName': plain(pc['cardName']), 'power': pc.get('power'), 'lore': pc.get('lore')}
    diff = [k for k in new if norm(old[k]) != norm(new[k])]
    if diff and n not in log['added']:
        log['changed'].append({'n': n, 'fields': diff, 'old': {k: old[k] for k in diff}, 'new': {k: new[k] for k in diff}})
        if 'jsonLegacy' not in c: c['jsonLegacy'] = old
    elif n not in log['added']:
        log['confirmed'].append(n)
    c[NAME] = new['cardName']
    pc.setdefault('cardNamePrint', pc['cardName'] if plain(pc['cardName']) != pc['cardName'] else None)
    if pc.get('cardNamePrint') and pc['cardNamePrint'] != new['cardName']:
        put(c, 'cardNamePrint', pc['cardNamePrint'], NAME)
    elif 'cardNamePrint' in c and not pc.get('cardNamePrint'):
        del c['cardNamePrint']
    c['power'], c['lore'] = new['power'], new['lore']
    for k in ('stats', 'statsAlt', 'statsMarks', 'printTypo', 'printOpen'):
        if pc.get(k): c[k] = pc[k]
    if pc.get('printOpen'): log['open'].append({'n': n, 'why': pc['printOpen']})
    c['source'] = 'print'
    c['textSource'] = pc['textSource']
    c['rating'] = pc['rating']

for c in cards:
    if c.get(NUM) not in seen:
        c['printMissing'] = True; log['notInPrint'].append(c.get(NUM))
cards.sort(key=lambda c: (c.get(NUM) is None, c.get(NUM) or 0))
if 'cardCount' in doc: doc['cardCount'] = len(cards)

D = P['deck']
for k in ('topCards', 'worstCards', 'viralScore'):
    if k in doc and f'{k}Legacy' not in doc: doc[f'{k}Legacy'] = doc[k]
names = lambda xs: [x['cardName'] if isinstance(x, dict) else x for x in xs]  # Bestandsformat: Liste von Titeln
doc['topCards'], doc['worstCards'] = names(D['topCards']), names(D['worstCards'])
doc['viralScore'], doc['viralReason'] = D['viralScore'], D['viralReason']
doc['deckRating'] = D['deckRating']
doc['printSync'] = {'source': f"PDF {P['pdf']} – Deck-Analyzer R1 visuelle Transkription {P['checkedAt']}",
                    'rule': 'Georg 23.10.: PDF führt immer', 'grading': 'GRADING_R1 (Georg 27.10.: 5 Kriterien, Sterne 1–5)'}
log['cards'] = len(cards)
if not dry:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=indent)
        if raw.endswith('\n'): f.write('\n')
json.dump(log, sys.stdout, ensure_ascii=False, indent=1)
