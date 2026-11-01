#!/usr/bin/env python3
"""Schnittlinie je Seite und Spalte, ohne Modell. Erkannte Textzeilen (Apple Vision, ganze Seite) werden über die Wörter im Karten-JSON
den vier Karten zugeordnet. Grundsatz (Georg): glatte Viertelseite. Die Linie wandert nur so weit von der Mitte weg, wie nötig ist,
damit kein Text der oberen oder unteren Karte durchtrennt wird. Kopfzeilen oben auf der Seite zählen nicht als Kartentext.
Dasselbe senkrecht: asymmetrische Seiten bekommen je Reihe eine eigene Spaltengrenze.
python3 page_split.py <vision_pages.json> <deck.json-Quelle> -> 'seite=xOben,xUnten,yLinks,yRechts' je Seite; Bericht auf stderr."""
import json, re, sys
vis, src = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))
off = 1
toks = lambda s: {w for w in re.sub(r'[^a-z0-9 ]+', ' ', (s or '').lower()).split() if len(w) >= 3}
cards = {(c.get('cardNumber') or c.get('num')): c for c in src['cards']}
ctok = {n: toks(c.get('cardName')) | toks(c.get('power')) | toks(c.get('lore')) for n, c in cards.items()}
for name, v in sorted(vis.items()):
    p = int(re.search(r'p(\d+)', name).group(1))
    if p <= off:
        continue
    base = (p - off - 1) * 4
    ns = [base + i + 1 for i in range(4)]  # TL TR BL BR
    cut = []
    notes = []
    for col in (0, 1):
        top, bot = ns[col], ns[col + 2]
        ytop, ybot = None, None
        for t in v.get('text', []):
            cx = t['x'] + t['w'] / 2
            if (cx < .5) != (col == 0):
                continue
            w = toks(t['s'])
            if len(w) < 2 and not (len(w) == 1 and len(t['s']) > 5):
                continue
            a = len(w & ctok.get(top, set())) / len(w)
            b = len(w & ctok.get(bot, set())) / len(w)
            if a >= .6 and a > b and t['y'] + t['h'] < .60:
                ytop = max(ytop or 0, t['y'] + t['h'])
            elif b >= .6 and b > a and t['y'] > .40:
                ybot = min(ybot if ybot is not None else 1, t['y'])
        lo = (ytop + .012) if ytop is not None else 0
        hi = (ybot - .02) if ybot is not None else 1
        if lo > hi:
            y = round((ytop + ybot) / 2, 3); notes.append(f"Spalte {col}: Text überlappt ({ytop:.3f}/{ybot:.3f})")
        else:
            y = round(min(max(.5, lo), hi), 3)
        if ytop is None or ybot is None:
            notes.append(f"Spalte {col}: nur teilweise zugeordnet")
        cut.append(y)
    xs = []
    for row in (0, 1):
        left, right = ns[row * 2], ns[row * 2 + 1]
        xl, xr = None, None
        ylo, yhi = (.20, cut[0]) if row == 0 else (min(cut), 1)  # Kopfzeile oben nicht werten
        for t in v.get('text', []):
            cy = t['y'] + t['h'] / 2
            w = toks(t['s'])
            if not (ylo <= cy <= yhi) or (len(w) < 2 and not (len(w) == 1 and len(t['s']) > 5)):
                continue
            a = len(w & ctok.get(left, set())) / len(w)
            b = len(w & ctok.get(right, set())) / len(w)
            if a >= .6 and a > b:
                xl = max(xl or 0, t['x'] + t['w'])
            elif b >= .6 and b > a:
                xr = min(xr if xr is not None else 1, t['x'])
        lo = (xl + .006) if xl is not None else 0
        hi = (xr - .006) if xr is not None else 1
        if lo > hi:
            xs.append(round((xl + xr) / 2, 3)); notes.append(f"Reihe {row}: Text überlappt waagerecht ({xl:.3f}/{xr:.3f})")
        else:
            xs.append(round(min(max(.5, lo), hi), 3))
    print(f'{p}={xs[0]},{xs[1]},{cut[0]},{cut[1]}')
    if notes:
        print(f'p{p}: ' + '; '.join(notes), file=sys.stderr)
