#!/usr/bin/env python3
"""MOUTHS_R3 review: per set one 1600px-wide sheet (all shapes on neutral grey, then on FrizzleBob yellow),
anchor guide lines (closed upper-lip top + anchor lip line), plus an anchor overlay and a 4x fringe zoom.
usage: python3 review_r3.py   (after cut_align_r3.py)
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REV = os.path.join(ROOT, 'review')
W = 1600
NEUTRAL = (196, 194, 190); CLAY = (226, 178, 60)   # CLAY = FB yellow, same value as R2 review.py
INK = (58, 35, 24); GUIDE_TOP = (40, 110, 200); GUIDE_LINE = (200, 40, 40)
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'; FONTB = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
f = lambda s, b=False: ImageFont.truetype(FONTB if b else FONT, s)
CROP = (0, 70, 512, 400)   # canvas window shown per cell (all mouths lie inside, checked below)


def load(sid):
    meta = json.load(open(os.path.join(ROOT, sid, 'anchors.json')))
    return meta, [m for m in meta['mouths'] if not m['variant_of']]


def grid(sid, meta, ms, bg, title):
    cols = 5 if len(ms) > 16 else 4
    cw = W // cols; scale = cw / (CROP[2] - CROP[0]); ch = int((CROP[3] - CROP[1]) * scale) + 34
    rows = (len(ms) + cols - 1) // cols
    head = 56
    img = Image.new('RGB', (W, head + rows * ch), bg)
    d = ImageDraw.Draw(img)
    d.text((16, 14), title, fill=INK, font=f(26, True))
    top_y = meta['anchor']['closed_upper_lip_top_y']; ay = meta['anchor']['y']
    for k, m in enumerate(ms):
        cx, cy = (k % cols) * cw, head + (k // cols) * ch
        im = Image.open(os.path.join(ROOT, sid, m['file'])).convert('RGBA').crop(CROP)
        im = im.resize((cw, int(im.height * scale)), Image.LANCZOS)
        for yy, col in ((top_y, GUIDE_TOP), (ay, GUIDE_LINE)):
            py = cy + int((yy - CROP[1]) * scale)
            for x in range(cx + 6, cx + cw - 6, 10): d.line([(x, py), (x + 5, py)], fill=col, width=1)
        img.paste(im, (cx, cy), im)
        lab = m['id'] + ('  [' + m['sheet_label'] + ']' if m.get('sheet_label') else '')
        d.text((cx + 10, cy + ch - 30), lab, fill=INK, font=f(17, True))
        d.text((cx + cw - 118, cy + ch - 28), f"h {m['height_ratio_to_closed']:.2f}× {m['anchor_mode']}", fill=INK, font=f(13))
    return img


def overlay(sid, meta, ms, bg):
    """all shapes stacked at 18% opacity per shape on one canvas: anchor must hold (upper lips bunch on the guide)."""
    can = Image.new('RGBA', (512, 512), bg + (255,))
    acc = np.zeros((512, 512), np.float32)
    for m in ms:
        a = np.array(Image.open(os.path.join(ROOT, sid, m['noshadow'])).convert('RGBA'))[..., 3].astype(np.float32) / 255
        acc += a
    acc = np.clip(acc / max(1, len(ms)) * 2.2, 0, 1)
    lay = np.zeros((512, 512, 4), np.uint8); lay[..., :3] = INK; lay[..., 3] = (acc * 255).astype(np.uint8)
    can.alpha_composite(Image.fromarray(lay))
    d = ImageDraw.Draw(can)
    d.line([(0, meta['anchor']['closed_upper_lip_top_y']), (512, meta['anchor']['closed_upper_lip_top_y'])], fill=GUIDE_TOP, width=1)
    d.line([(0, meta['anchor']['y']), (512, meta['anchor']['y'])], fill=GUIDE_LINE, width=1)
    d.line([(256, 0), (256, 512)], fill=GUIDE_LINE, width=1)
    return can.convert('RGB').crop(CROP)


def fringe_zoom(sid, ms, bg):
    """4x nearest zoom on the left lip corner of 4 shapes on the given bg: white/green halos would show here."""
    pick = [m for m in ms if m['id'] in ('closed', 'ah', 'oh', 'smile_teeth', 'surprised', 'oo')][:4]
    tiles = []
    for m in pick:
        im = Image.open(os.path.join(ROOT, sid, m['noshadow'])).convert('RGBA')
        x, y, w, h = m['bbox_canvas']
        box = (max(0, x - 10), max(0, y + h // 2 - 50), max(0, x - 10) + 100, max(0, y + h // 2 - 50) + 100)
        t = Image.new('RGBA', (100, 100), bg + (255,)); t.alpha_composite(im.crop(box))
        tiles.append(t.convert('RGB').resize((400, 400), Image.NEAREST))
    out = Image.new('RGB', (W, 400), bg)
    for i, t in enumerate(tiles): out.paste(t, (i * 400, 0))
    return out


def main():
    os.makedirs(REV, exist_ok=True)
    order = [('clay_yellow_r3', '01'), ('clay_neutral_r3', '02'), ('monster_lila_r3', '03')]
    for sid, num in order:
        meta, ms = load(sid)
        for m in meta['mouths']:
            x, y, w, h = m['bbox_canvas']
            assert y >= CROP[1] and y + h <= CROP[3], (sid, m['id'], m['bbox_canvas'])
        lab = json.load(open(os.path.join(ROOT, sid, 'set.json')))['label'] if os.path.exists(os.path.join(ROOT, sid, 'set.json')) else sid
        g1 = grid(sid, meta, ms, NEUTRAL, f'{sid} · {lab} · {len(ms)} Formen · auf Neutralgrau  (blau = Oberlippe closed, rot = Anker-Lippenlinie)')
        g2 = grid(sid, meta, ms, CLAY, f'{sid} · auf FrizzleBob-Gelb')
        sheet = Image.new('RGB', (W, g1.height + g2.height), NEUTRAL)
        sheet.paste(g1, (0, 0)); sheet.paste(g2, (0, g1.height))
        sheet.save(os.path.join(REV, f'{num}_{sid}_formen.png'))
        ov = [overlay(sid, meta, ms, NEUTRAL), overlay(sid, meta, ms, CLAY)]
        o = Image.new('RGB', (W, ov[0].height * 2 + 50), NEUTRAL)
        d = ImageDraw.Draw(o); d.text((16, 12), f'{sid} · Anker-Overlay aller {len(ms)} Formen (dunkler = mehr Formen deckungsgleich)', fill=INK, font=f(24, True))
        for i, im in enumerate(ov):
            im2 = im.resize((im.width * 2 // 1, im.height * 2 // 1), Image.LANCZOS) if False else im
            o.paste(im2.resize((int(im2.width * 1.5), int(im2.height * 1.5))), (40 + i * 800, 50))
        o = o.crop((0, 0, W, 50 + int(ov[0].height * 1.5)))
        o.save(os.path.join(REV, f'{num}_{sid}_anker_overlay.png'))
        z = Image.new('RGB', (W, 850), NEUTRAL)
        z.paste(fringe_zoom(sid, ms, NEUTRAL), (0, 40)); z.paste(fringe_zoom(sid, ms, CLAY), (0, 450))
        ImageDraw.Draw(z).text((16, 8), f'{sid} · Randkontrolle 4× (linker Mundwinkel, ohne Schatten)', fill=INK, font=f(22, True))
        z.save(os.path.join(REV, f'{num}_{sid}_rand_zoom.png'))
        print('review', sid)


if __name__ == '__main__':
    main()
