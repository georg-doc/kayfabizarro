#!/usr/bin/env python3
"""Zuschnitt prüfen ohne Modell: steht der Kartentext vollständig im Viertel? python3 crop_check.py <bake.json> <vision.json> <deck.json-Quelle>
Meldet Karten, bei denen das Lore- oder Power-Ende in der lokalen Texterkennung fehlt, oder Textzeilen an der Schnittkante liegen."""
import json, re, sys
bake, vis, src = (json.load(open(p)) for p in sys.argv[1:4])
norm = lambda s: re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()
cards = {(c.get('cardNumber') or c.get('num')): c for c in src['cards']}
out = []
for r in bake['cards']:
    n, v = r['n'], vis.get(f"k{r['n']:02d}.png", {})
    c = cards.get(n, {})
    ocr = norm(' '.join(t['s'] for t in v.get('text', [])))
    flags = []
    for f in ('power', 'lore'):
        w = norm(c.get(f)).split()
        if len(w) >= 3 and ' '.join(w[-2:]) not in ocr and w[-1] not in ocr:
            flags.append(f + '-Ende fehlt: ' + ' '.join(w[-3:]))
    words = set(norm(' '.join([c.get('cardName') or '', c.get('power') or '', c.get('lore') or ''])).split())
    for t in v.get('text', []):
        bot, top = t['y'] + t['h'], t['y']
        lw = norm(t['s']).split()
        if not lw or sum(1 for w in lw if w in words) / len(lw) < .6:
            continue  # Kopfzeilen, Stempel, Randnotizen gehören nicht zur Karte
        # Seitenrand ist keine Schnittkante: unten nur bei oberer Reihe, oben nur bei unterer Reihe prüfen
        if r['quad'] in ('TL', 'TR') and bot > .992 and len(t['s']) > 6:
            flags.append('Text an Unterkante: ' + t['s'][:40])
        if r['quad'] in ('TL', 'BL') and t['x'] + t['w'] > .992 and len(t['s']) > 6:
            flags.append('Text an Schnittkante rechts: ' + t['s'][-40:])
        if r['quad'] in ('TR', 'BR') and t['x'] < .008 and len(t['s']) > 6:
            flags.append('Text an Schnittkante links: ' + t['s'][:40])
        if r['quad'] in ('BL', 'BR') and top < .004 and len(t['s']) > 6:
            flags.append('Text an Oberkante: ' + t['s'][:40])
    if flags:
        out.append({'n': n, 'page': r['page'], 'quad': r['quad'], 'flags': flags})
print(json.dumps(out, ensure_ascii=False, indent=0) if '--json' in sys.argv else '\n'.join(f"#{x['n']} p{x['page']} {x['quad']}: " + ' | '.join(x['flags']) for x in out))
print(f"-- {len(out)} von {len(bake['cards'])} Karten markiert", file=sys.stderr)
