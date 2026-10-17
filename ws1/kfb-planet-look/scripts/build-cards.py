# Baut src/data/cards.json aus der KFB-Deck-Registry (registry/assets/v1/decks/*.json).
# Nur Karten mit cardName + power + lore. Texte unverändert.
import json, glob, sys, os
src = sys.argv[1]; out = sys.argv[2]
decks, cards = [], []
for f in sorted(glob.glob(os.path.join(src, '*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    if 'cards' not in d: continue
    di = len(decks)
    decks.append([d['deckId'], d.get('title') or d['deckId'], d.get('deckType') or '', d.get('gameUse') or ''])
    for c in d['cards']:
        if c.get('cardName') and c.get('power') and c.get('lore'):
            cards.append([di, c.get('cardNumber'), c['cardName'].strip(), c['power'].strip(), c['lore'].strip()])
json.dump({'source': 'georg-doc/kayfabizarro registry/assets/v1/decks', 'decks': decks, 'cards': cards}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(decks), 'decks', len(cards), 'cards', os.path.getsize(out), 'bytes')
