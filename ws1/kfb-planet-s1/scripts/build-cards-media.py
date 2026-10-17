# Baut src/data/cards.json aus dem kanonischen Kartentext (V-242: Kartentext = Druck) in media/kfb am MEDIA_COMMIT.
# Deckliste und -reihenfolge bleiben wie im bisherigen cards.json (Deck-Index ist Teil des Kartenschlüssels im Spiel); je Deck kommen
# Nummer, Titel, Power und Lore aus dem Deck-JSON der Registry-Fassung media/kfb (index.json → data). Nur Karten mit Titel + Power + Lore.
# Felder: cardNumber/cardName oder num/name (drei Decks); Deck ganz ohne Nummern → Listenplatz = Kartennummer (geprüft 156/156).
# python3 scripts/build-cards-media.py [MEDIA_COMMIT]   (ohne Angabe: MEDIA_COMMIT aus src/cardMapping.js)
import json, os, re, sys, urllib.parse, urllib.request
commit = (sys.argv[1:] or [re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", open('src/cardMapping.js').read()).group(1)])[0]
base = f'https://raw.githubusercontent.com/georg-doc/kayfabizarro/{commit}/media/kfb/'
reg = {d['packId']: d for d in json.load(urllib.request.urlopen(base + 'index.json'))['decks']}
old = json.load(open('src/data/cards.json', encoding='utf-8'))
num = lambda c: str(c.get('cardNumber', c.get('num', '')) or '')
nm = lambda c: (c.get('cardName') or c.get('name') or '').strip()
cards, missing = [], []
for di, d in enumerate(old['decks']):
    rd = reg.get(d[0])
    if not rd or not rd.get('data'):
        missing.append(d[0]); cards += [c for c in old['cards'] if c[0] == di]; continue  # kein Media-Deck: bisheriger Text bleibt
    cs = json.load(urllib.request.urlopen(base + urllib.parse.quote(rd['data']))).get('cards', [])
    numbered = any(num(c).isdigit() for c in cs)
    for i, c in enumerate(cs):
        n = int(num(c)) if numbered and num(c).isdigit() else (None if numbered else i + 1)
        if n is None or not (nm(c) and (c.get('power') or '').strip() and (c.get('lore') or '').strip()): continue
        cards.append([di, n, nm(c), c['power'].strip(), c['lore'].strip()])
out = {'source': f'georg-doc/kayfabizarro media/kfb @{commit} (V-242 Kartentext = Druck)', 'decks': old['decks'], 'cards': cards}
json.dump(out, open('src/data/cards.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(old['decks']), 'decks', len(cards), 'cards (vorher', len(old['cards']), ') ohne Media-Deck:', missing, os.path.getsize('src/data/cards.json'), 'bytes')
