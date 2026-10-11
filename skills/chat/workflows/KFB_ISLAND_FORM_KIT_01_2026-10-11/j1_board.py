"""J1 board: CC2 (J1 half) + ME2 on top, island J1 in Hero 3/4, side, underside 3/4, top; measured values; notes."""
import json, sys
from PIL import Image, ImageDraw, ImageFont
SRC, REF1, REF2, NOTES, OUT = sys.argv[1:6]
BG = (59, 63, 69); PANEL = (236, 226, 214); FG = (236, 232, 224); DIM = (170, 170, 165); ACC = (255, 196, 92)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
def text(d, xy, s, size, col=FG, bold=False):
    d.text(xy, s, fill=col, font=font(size, bold))
n = json.load(open(NOTES)); m = json.load(open(f'{SRC}/CC_J1_metrics.json'))
W = 3000; M = 40
refs = [Image.open(r).convert('RGB') for r in (REF1, REF2)]; rh = 820
refs = [r.resize((int(r.width * rh / r.height), rh), Image.LANCZOS) for r in refs]
sc = min(1.0, (W - 2 * M - 20) / sum(r.width for r in refs)); refs = [r.resize((int(r.width * sc), int(r.height * sc))) for r in refs]; rh = refs[0].height
def crop(v):
    im = Image.open(f'{SRC}/CC_J1_{v}.png').convert('RGBA'); bb = im.getchannel('A').getbbox(); return im.crop(bb)
cells = [('HERO', 'Hero 3/4 from above'), ('SIDE', 'Side'), ('UNDER', 'Underside 3/4'), ('TOP', 'Top')]
cw = (W - 2 * M - 20) // 2; ch = 900
ims = []
for v, t in cells:
    im = crop(v); s = min((cw - 40) / im.width, (ch - 40) / im.height); ims.append((im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS), t))
H = 230 + rh + 60 + 2 * (ch + 50) + 60 + 40 + 34 * len(n['lines']) + 60
b = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(b)
text(d, (M, 28), n['title'], 44, bold=True); text(d, (M, 92), n['sub1'], 21, DIM); text(d, (M, 122), n['sub2'], 21, DIM)
text(d, (M, 158), n['critic'], 22, ACC); text(d, (M, 192), n['critic2'], 20, DIM)
x = M
for r in refs:
    b.paste(r, (x, 230)); x += r.width + 20
text(d, (M, 230 + rh + 10), n['refcap'], 18, DIM)
y = 230 + rh + 60
for i, (im, t) in enumerate(ims):
    cx = M + (i % 2) * (cw + 20); cy = y + (i // 2) * (ch + 50)
    d.rectangle((cx, cy, cx + cw, cy + ch), fill=PANEL); text(d, (cx, cy - 30), t, 22, FG, True)
    b.paste(im, (cx + (cw - im.width) // 2, cy + (ch - im.height) // 2), im)
y += 2 * (ch + 50) + 10
text(d, (M, y), f"Measured: {m['width_MC']} × {m['depth_MC']} MC · underside depth {m['underside_depth_W']} W · top {m['top_MC']} MC · {m['tris']:,} tris · objects 1 · shells {m['shells']} · open {m['open_edges']} · non-manifold {m['non_manifold_edges']} · mesas {', '.join(m['mesas'])} · track anchors {m['track_anchors']} · road half width {m['road_half_width']}", 19, ACC)
y += 50
for k, ln in enumerate(n['lines']):
    text(d, (M, y + k * 34), ln, 19, DIM)
b.save(OUT, optimize=True); print(b.size)
