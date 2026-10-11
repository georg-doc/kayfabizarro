"""K1 R2 board: reference M1 on top, three candidate bodies (side, 3/4 above, underside), measured values, critic scores."""
import json, sys
from PIL import Image, ImageDraw, ImageFont
SRC, REF, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
BG = (59, 63, 69); FG = (236, 232, 224); DIM = (170, 170, 165); ACC = (255, 196, 92)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
def text(d, xy, s, size, col=FG, bold=False, anchor='la'):
    d.text(xy, s, fill=col, font=font(size, bold), anchor=anchor)
def ubox(ims):
    bb = [im.getchannel('A').getbbox() for im in ims]
    return (min(b[0] for b in bb) - 10, min(b[1] for b in bb) - 10, max(b[2] for b in bb) + 10, max(b[3] for b in bb) + 10)
met = json.load(open(f'{SRC}/K1R2_metrics.json'))
cols = [('A', 'A · Columns', 'tall chiselled blocks, 3 tiers, hanging spires'),
        ('B', 'B · Wide blocks', 'wider, rounder blocks, same tiers'),
        ('C', 'C · Columns + openings', 'A + road-tunnel portal (2.2 × 1.8 MC) + drainage pipe')]
views = [('SIDE', 'Side 12°'), ('HERO', '3/4 from above'), ('UNDER', 'Underside 3/4')]
rows = []
for v, _ in views:
    ims = [Image.open(f'{SRC}/K1R2_{c}_{v}.png').convert('RGBA') for c, _, _ in cols]
    bb = ubox(ims); s = 0.62
    rows.append([im.crop(bb).resize((int((bb[2] - bb[0]) * s), int((bb[3] - bb[1]) * s)), Image.LANCZOS) for im in ims])
colw = max(max(r[i].width for r in rows) for i in range(3)) + 40
left = 200; W = left + colw * 3 + 30
ref = Image.open(REF).convert('RGB'); ref = ref.resize((W - 60, int(ref.height * (W - 60) / ref.width)))
top = 200 + ref.height + 90
H = top + sum(max(i.height for i in r) + 40 for r in rows) + 330
board = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(board)
text(d, (30, 26), 'KFB Island Form Kit 01 · K1 R2 · rock-block body after M1', 40, bold=True)
text(d, (30, 82), "Georg 11.10.: R1 = big TUNE (lid plate, hex contour, fake roots FAIL, holes unclean). Target chosen by Georg: golden candidate M1 (top). Roots dropped.", 20, DIM)
text(d, (30, 110), 'Built in K2 units (island 20 MC = 128). No purchased assets: all geometry generated. Top left empty on purpose (Georg composes the top in God-Mode).', 20, DIM)
text(d, (30, 138), 'External critic (blind, vs M1): round 1  A 5 · B 4 · C 4   →   round 2  A 5 · B 5.5 · C 4  (pass = 8).  Not passed: stop rule after 2 repairs, Georg decides.', 20, ACC)
board.paste(ref, (30, 180)); text(d, (30, 180 + ref.height + 8), 'Reference M1 (golden candidate, protopia-makerspace 2026-10-11) — style direction, not a pixel target (V-013)', 16, DIM)
for i, (_, t, sub) in enumerate(cols):
    x = left + i * colw; text(d, (x, top - 70), t, 28, bold=True); text(d, (x, top - 36), sub, 17, DIM)
y = top
for (v, vt), r in zip(views, rows):
    rh = max(i.height for i in r); text(d, (30, y + rh // 2), vt, 22, bold=True, anchor='lm')
    for i, im in enumerate(r):
        board.paste(im, (left + i * colw + (colw - 40 - im.width) // 2, y + (rh - im.height) // 2), im)
    y += rh + 40
text(d, (30, y), 'Measured', 22, bold=True)
for i, (c, _, _) in enumerate(cols):
    m = met[c]; x = left + i * colw
    for k, ln in enumerate([f"width {m['W_MC']} MC   depth {m['depth_W']} W (incl. spires)", f"objects {m['objects']}   triangles {m['tris']}"]):
        text(d, (x, y + 4 + k * 28), ln, 18, ACC if k == 0 else FG)
y += 90
notes = ['Critic, still open: grass top reads as a flat sheet (needs lumps, tufts, thickness variation); flat even light and one beige for all blocks;',
         'body too deep and too cone-like (target 0.6–0.75 of top width, 3–5 hanging lobes); some long straight edge runs; portal still a boxy notch; pipe small.',
         'Fixed vs R1: no lid plate edge, no polygon facets, everything hangs down, no roots, openings modelled as parts (portal recess, jambs, lintel; pipe with rim).',
         'Not one closed mesh: ground is one closed mesh, every block is its own closed mesh (M1 is built from blocks). Needs a steering decision against the old one-mesh rule.']
for k, ln in enumerate(notes):
    text(d, (30, y + k * 28), ln, 17, DIM)
board.save(OUT, optimize=True); print(board.size)
