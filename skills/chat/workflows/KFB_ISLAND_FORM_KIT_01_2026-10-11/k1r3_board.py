"""K1 R3 board: Georg's references IB1-IB3 on top, variants A / B (side, underside 3/4, 3/4 above), detail row, measured values, notes.
Run: python3 k1r3_board.py SRC REFDIR NOTES.json OUT.png"""
import json, sys
from PIL import Image, ImageDraw, ImageFont
SRC, REFD, NOTES, OUT = sys.argv[1:5]
BG = (59, 63, 69); PANEL = (236, 226, 210); FG = (236, 232, 224); DIM = (170, 170, 165); ACC = (255, 196, 92)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
def text(d, xy, s, size, col=FG, bold=False, anchor='la'):
    d.text(xy, s, fill=col, font=font(size, bold), anchor=anchor)
notes = json.load(open(NOTES))
W = 3200; M = 40
refs = [Image.open(f'{REFD}/IB{i}.png').convert('RGB') for i in (1, 2, 3)]
rh = 560; refs = [r.resize((int(r.width * rh / r.height), rh), Image.LANCZOS) for r in refs]
views = [('SIDE', 'Side 12° (same camera)'), ('UNDER', 'Underside 3/4'), ('HERO', '3/4 from above')]
var = [('A', 'A · boulders, short band'), ('B', 'B · long rock band')]
ims = {(v, vw): Image.open(f'{SRC}/K1R3_{v}_{vw}.png').convert('RGBA') for v, _ in var for vw, _ in views}
def bbox(im):
    return im.getchannel('A').getbbox()
cells = {}
colw = (W - 2 * M - 260) // 3
for vw, _ in views:
    bbs = [bbox(ims[(v, vw)]) for v, _ in var]
    bb = (min(b[0] for b in bbs) - 12, min(b[1] for b in bbs) - 12, max(b[2] for b in bbs) + 12, max(b[3] for b in bbs) + 12)
    s = (colw - 30) / (bb[2] - bb[0])
    for v, _ in var:
        c = ims[(v, vw)].crop(bb); cells[(v, vw)] = c.resize((int(c.width * s), int(c.height * s)), Image.LANCZOS)
rowh = {v: max(cells[(v, vw)].height for vw, _ in views) + 30 for v, _ in var}
dets = [('A', 'RIM', 'A · rim: earth rounds into the top, moss clumps hang over'), ('A', 'BOULDER', 'A · boulder half embedded, fused with the earth'),
        ('A', 'NICHE', 'A · niche with pebbles'), ('A', 'BAND', 'A · short rock band'), ('B', 'BAND', 'B · long rock band (stratum)')]
dw = (W - 2 * M - 4 * 24) // 5
dimgs = []
for v, k, t in dets:
    im = Image.open(f'{SRC}/K1R3_{v}_{k}.png').convert('RGBA')
    im = im.resize((dw, int(im.height * dw / im.width)), Image.LANCZOS); dimgs.append((im, t))
dh = max(i.height for i, _ in dimgs)
head = 250
H = head + rh + 70 + sum(rowh.values()) + 90 + dh + 80 + 110 + 36 * len(notes['lines']) + 60
board = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(board)
text(d, (M, 28), 'KFB Island Form Kit 01 · K1 R3 · clay island base after Georg\'s references IB1–IB3', 44, bold=True)
text(d, (M, 92), 'Brief R3 (V-142). Start: Scholle v7 port (R1, preset C, 20 MC = 128). On it: faceted clay clods in tiers with ledges, half-embedded faceted boulders, grey rock band, moss clumps on the rim,', 21, DIM)
text(d, (M, 122), 'niches with pebbles, stone groups on the sandy top. Roots dropped (Georg 11.10.). All fused by ONE voxel remesh: one closed mesh per island. K2 units. Figure 1 H (red) and car 6 × 2.9 (blue) on top for scale.', 21, DIM)
text(d, (M, 158), notes['critic'], 22, ACC)
text(d, (M, 194), notes.get('critic2', ''), 20, DIM)
y = head
x = M
for i, r in enumerate(refs):
    board.paste(r, (x, y)); x += r.width + 20
text(d, (M, y + rh + 10), 'References: IB1 underside variants · IB2 whole island · IB3 underside details (Georg 11.10., REFS_INSELBODEN_2026-10-11; style direction, not a pixel target)', 18, DIM)
y += rh + 70
for vw_i, (vw, vt) in enumerate(views):
    text(d, (M + 260 + vw_i * colw, y - 10), vt, 24, bold=True, anchor='ld')
for v, vt in var:
    d.rectangle((M + 250, y, W - M, y + rowh[v] - 10), fill=PANEL)
    text(d, (M, y + rowh[v] // 2), vt.split(' · ')[0], 40, bold=True, anchor='lm')
    text(d, (M, y + rowh[v] // 2 + 40), vt.split(' · ')[1], 17, DIM, anchor='lm')
    for i, (vw, _) in enumerate(views):
        c = cells[(v, vw)]
        board.paste(c, (M + 260 + i * colw + (colw - c.width) // 2, y + (rowh[v] - 10 - c.height) // 2), c)
    y += rowh[v]
y += 50
text(d, (M, y - 8), 'Details (same build, close cameras)', 24, bold=True, anchor='ld')
x = M
for im, t in dimgs:
    d.rectangle((x, y, x + dw, y + dh), fill=PANEL); board.paste(im, (x, y), im)
    text(d, (x, y + dh + 8), t, 17, FG); x += dw + 24
y += dh + 60
text(d, (M, y), 'Measured', 24, bold=True)
for i, (v, _) in enumerate(var):
    m = json.load(open(f'{SRC}/K1R3_{v}_metrics.json'))
    ln = (f"{v}:  width {m['W_MC']} MC · depth {m['depth_W']} W (incl. tip) · {m['tris']:,} tris · objects {m['objects']} · shells {m['shells']} · "
          f"open edges {m['open_edges']} · non-manifold {m['non_manifold_edges']} · boulders {m['boulders']} · band slabs {m.get('band_slabs', m.get('band_stones'))} · roots {m['roots']} · niches {m['niches']}")
    text(d, (M + 160, y + 4 + i * 32), ln, 19, ACC if i == 0 else FG)
y += 100
for k, ln in enumerate(notes['lines']):
    text(d, (M, y + k * 36), ln, 19, DIM)
board.save(OUT, optimize=True); print(board.size)
