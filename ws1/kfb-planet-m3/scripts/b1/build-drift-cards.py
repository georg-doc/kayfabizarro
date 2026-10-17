# Drift-Karten für die Kartenauswahl (WS0 zu §24.2: die Dialog-Szene wählt bevorzugt Karten von drift-freien Seiten – Auswahl, nicht Beschnitt).
# Liest test/out/drift/drift-report.json (scripts/b1/drift-report.py) und die OCR-Rohdaten test/audit/<deck>.json (Seite je Karte)
# und schreibt src/data/drift-cards.json: je Deck die Kartennummern auf Seiten mit Drift. Am Bild ändert sich nichts.
import json, re
src = open('src/cardMapping.js').read(); media = re.search(r"MEDIA_COMMIT = '([0-9a-f]{40})'", src).group(1)
R = json.load(open('test/out/drift/drift-report.json'))
out = {}
for d, v in sorted(R.items()):
    pages = set(v['pages']); A = json.load(open(f'test/audit/{d}.json'))
    out[d] = sorted(c['n'] for c in A['cards'] if c['page'] in pages)
json.dump({'schema': 'kfb.drift-cards/1', 'media': media, 'rule': 'Karte auf einer Seite, deren untere Karte mit POWER:/LORE: beginnt (Inhalt sitzt tiefer als die Seitenmitte); alle Karten dieser Seite',
           'decks': out}, open('src/data/drift-cards.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'Decks,', sum(len(x) for x in out.values()), 'Karten auf Drift-Seiten')
