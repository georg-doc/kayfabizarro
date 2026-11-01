#!/usr/bin/env python3
"""Texterkennung aus einem früheren Lauf auf neue Schnittlinien umrechnen, Vordergrund aus dem neuen Lauf behalten.
python3 merge_vision.py <alt_bake.json> <alt_vision.json> <neu_vision.json> <neu_rects.json> <out.json>
neu_rects.json: {"n": [x,y,w,h]} in Seitenanteilen."""
import json, sys
ab, av, nv, nr, out = sys.argv[1:6]
ab = {c['n']: c for c in json.load(open(ab))['cards']}
av, nv, nr = json.load(open(av)), json.load(open(nv)), json.load(open(nr))
res = {}
for n, rect in nr.items():
    n = int(n); key = f'k{n:02d}.png'
    o = ab[n]['rect']
    text = []
    for t in av.get(key, {}).get('text', []):
        px, py = o[0] + t['x'] * o[2], o[1] + t['y'] * o[3]
        pw, ph = t['w'] * o[2], t['h'] * o[3]
        if py + ph / 2 < rect[1] or py + ph / 2 > rect[1] + rect[3] or px + pw / 2 < rect[0] or px + pw / 2 > rect[0] + rect[2]:
            continue  # Zeile liegt nach dem neuen Schnitt auf der Nachbarkarte
        text.append({'x': (px - rect[0]) / rect[2], 'y': (py - rect[1]) / rect[3], 'w': pw / rect[2], 'h': ph / rect[3], 's': t['s']})
    v = nv.get(key, {})
    res[key] = {'text': text, 'fg': v.get('fg', []), 'salient': v.get('salient', [])}
json.dump(res, open(out, 'w'), ensure_ascii=False)
print(len(res), 'mit Text', sum(1 for x in res.values() if x['text']))
