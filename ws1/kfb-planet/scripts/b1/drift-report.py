# Drift-Bericht (Georg 15.10.: Karten nur vierteln, nichts messen oder beschneiden – aber auf Drift achten).
# Liest die vorhandenen OCR-Rohdaten (test/audit/<deck>.json, je Viertel die Textzeilen in Lesereihenfolge) und meldet Seiten,
# auf denen eine untere Karte mit einer POWER:/LORE:-Zeile BEGINNT: diese Zeile gehört zur Karte darüber (Karten sitzen tiefer als die Seitenmitte).
# Ändert nichts am Bild. Ausgabe: test/out/drift/drift-report.json + Tabelle.
import json, glob, os, re
LINE = re.compile(r'^\s*(POWER|LORE)\s*[:.]', re.I)
out = {}
for f in sorted(glob.glob('test/audit/*.json')):
    j = json.load(open(f)); d = j['deck']; hits = []
    for c in j.get('cards', []):
        if c.get('quad') not in (2, 3): continue
        head = [t for t in c.get('text', [])[:3] if t.strip()]
        if head and LINE.match(head[0]): hits.append({'page': c['page'], 'n': c['n'], 'quad': c['quad'], 'line': head[0][:70]})
    pages = sorted({h['page'] for h in hits})
    allp = sorted({c['page'] for c in j.get('cards', [])})
    if hits: out[d] = {'pages': pages, 'pagesTotal': len(allp), 'hits': hits}
os.makedirs('test/out/drift', exist_ok=True)
json.dump(out, open('test/out/drift/drift-report.json', 'w'), ensure_ascii=False, indent=1)
A = json.load(open('src/data/mapping-audit.json')); A = A.get('decks', A)
print(f"{'Deck':48s} {'Status':7s} Seiten mit Drift")
for d, v in sorted(out.items(), key=lambda x: -len(x[1]['pages'])):
    print(f"{d:48s} {A.get(d, {}).get('status', '?'):7s} {len(v['pages'])}/{v['pagesTotal']}")
print(len(out), 'Decks mit vertikaler Drift von', len(glob.glob('test/audit/*.json')))
