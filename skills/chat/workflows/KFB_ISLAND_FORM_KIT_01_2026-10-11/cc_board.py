"""R4 Coconino board: CC1 on top, then one row per module (Hero 3/4, Front, Side, Top), measured values, notes.
Run: python3 cc_board.py SRC REF_CC1 NOTES.json OUT.png"""
import json, sys
from PIL import Image, ImageDraw, ImageFont
SRC, REF, NOTES, OUT = sys.argv[1:5]
BG = (59, 63, 69); PANEL = (236, 226, 214); FG = (236, 232, 224); DIM = (170, 170, 165); ACC = (255, 196, 92)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
def text(d, xy, s, size, col=FG, bold=False, anchor='la'):
    d.text(xy, s, fill=col, font=font(size, bold), anchor=anchor)
notes = json.load(open(NOTES))
W = 3000; M = 40; LEFT = 300
mods = [('M01', 'M01 · Flat Cap Mesa'), ('M02', 'M02 · Needle Butte'), ('M03', 'M03 · Stepped Mesa')]
views = [('HERO', 'Hero 3/4', 1.45), ('FRONT', 'Front', 1.0), ('SIDE', 'Side', 1.0), ('TOP', 'Top', 0.85)]
ref = Image.open(REF).convert('RGB'); rh = 900; ref = ref.resize((int(ref.width * rh / ref.height), rh), Image.LANCZOS)
tot = sum(w for _, _, w in views); avail = W - 2 * M - LEFT - 20 * (len(views) - 1)
rows = []
for mid, _ in mods:
    cells = []
    for v, _, wgt in views:
        im = Image.open(f'{SRC}/CC_{mid}_{v}.png').convert('RGBA'); bb = im.getchannel('A').getbbox()
        im = im.crop((bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10))
        cw = int(avail * wgt / tot); ch = 480
        s = min(cw / im.width, ch / im.height); cells.append((im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS), cw))
    rows.append(cells)
head = 240
H = head + rh + 70 + len(mods) * 540 + 60 + 40 * 3 + 40 + 34 * len(notes['lines']) + 60
b = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(b)
text(d, (M, 28), 'KFB Coconino Mesas · R4 step 1 · modules M01 / M02 / M03 after CC1', 44, bold=True)
text(d, (M, 92), 'Brief R4 (V-167). Form logic from the sheet: cap layer → main body → erosion skirt / talus, all fused by ONE voxel remesh: one closed mesh per module.', 21, DIM)
text(d, (M, 122), 'Fluted cliffs = rounded pillars per stratum band; light band at the top of each stratum; cacti and stones as hints only. Sockets = named Empties. K2 units, figure 1 H (red) + car (blue).', 21, DIM)
text(d, (M, 158), notes['critic'], 22, ACC)
text(d, (M, 192), notes.get('critic2', ''), 20, DIM)
b.paste(ref, (M, head)); text(d, (M, head + rh + 10), "Reference CC1 (Georg 11.10., REFS_COCONINO_2026-10-11 · 'Blender MCP Prep'; logic and style, not a pixel target)", 18, DIM)
y = head + rh + 70
x = M + LEFT
for (v, vt, _), (_, cw) in zip(views, rows[0]):
    text(d, (x, y - 12), vt, 24, bold=True, anchor='ld'); x += cw + 20
for (mid, title), cells in zip(mods, rows):
    d.rectangle((M + LEFT - 10, y, W - M, y + 520), fill=PANEL)
    text(d, (M, y + 230), title.split(' · ')[0], 44, bold=True, anchor='lm'); text(d, (M, y + 280), title.split(' · ')[1], 20, DIM, anchor='lm')
    x = M + LEFT
    for im, cw in cells:
        b.paste(im, (x + (cw - im.width) // 2, y + (520 - im.height) // 2), im); x += cw + 20
    y += 540
y += 30
text(d, (M, y), 'Measured', 24, bold=True)
for i, (mid, _) in enumerate(mods):
    m = json.load(open(f'{SRC}/CC_{mid}_metrics.json'))
    ln = (f"{mid}:  footprint {m['footprint_MC'][0]} × {m['footprint_MC'][1]} MC (with talus) · height {m['height_MC']} MC = {m['height_H']} H · {m['tris']:,} tris · "
          f"objects 1 · shells {m['shells']} · open {m['open_edges']} · non-manifold {m['non_manifold_edges']} · sockets: {', '.join(s.replace('SOCKET_', '') for s in m['sockets'])}")
    text(d, (M + 160, y + 4 + i * 34), ln, 18, ACC if i == 0 else FG)
y += 34 * 3 + 40
for k, ln in enumerate(notes['lines']):
    text(d, (M, y + k * 34), ln, 19, DIM)
b.save(OUT, optimize=True); print(b.size)
