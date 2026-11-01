#!/usr/bin/env python3
"""Kontaktbogen: Karten mit eingezeichnetem Motiv-Rechteck. python3 motiv_sheet.py <paket> <bake.json> <out.jpg> [cols] [cellW] [n,n,...]"""
import json, sys
from PIL import Image, ImageDraw
pak, bake, out = sys.argv[1:4]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 7
cw = int(sys.argv[5]) if len(sys.argv) > 5 else 220
only = set(map(int, sys.argv[6].split(','))) if len(sys.argv) > 6 else None
cs = [c for c in json.load(open(bake))['cards'] if not only or c['n'] in only]
ch = int(cw * 762 / 1366) + 16
S = Image.new('RGB', (cols * (cw + 6) + 6, ((len(cs) + cols - 1) // cols) * (ch + 6) + 6), (60, 60, 60))
d = ImageDraw.Draw(S)
for i, c in enumerate(cs):
    x, y = 6 + (i % cols) * (cw + 6), 6 + (i // cols) * (ch + 6)
    im = Image.open(f"{pak}/bilder/karte/{c['n']:02d}.webp").convert('RGB').resize((cw, ch - 16), Image.LANCZOS)
    S.paste(im, (x, y + 16))
    r = c['motivRect']
    d.rectangle((x + r[0] * cw, y + 16 + r[1] * (ch - 16), x + (r[0] + r[2]) * cw, y + 16 + (r[1] + r[3]) * (ch - 16)), outline=(255, 0, 80), width=2)
    d.text((x + 2, y + 2), f"{c['n']:02d} g={c['motivGuete']}", fill=(255, 255, 255))
S.save(out, quality=82)
print(out, S.size)
