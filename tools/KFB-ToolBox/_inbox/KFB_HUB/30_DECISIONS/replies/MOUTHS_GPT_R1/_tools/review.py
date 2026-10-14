#!/usr/bin/env python3
"""MOUTHS_GPT_R1 step 5-6: FB retouch, review PNGs (1920x1080, V-253), talk/reaction clips (12 fps MP4).
usage: python3 review.py   (after cut_align.py)
"""
import json, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as nd
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src'); REV = os.path.join(ROOT, 'review')
W, H = 1920, 1080
FPS = 12
BG_PAGE = (239, 232, 220); INK = (58, 35, 24); RED = (181, 67, 47)
CLAY = (226, 178, 60)            # neutral clay-yellow (close to FB skin)
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'; FONTB = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
f = lambda s, b=False: ImageFont.truetype(FONTB if b else FONT, s)


# ---------------------------------------------------------------- FrizzleBob retouch (port of MOUTHS_SVG_R1/_tools/mockup.cjs)
def fb_clean():
    im = Image.open(os.path.join(SRC, 'fb_pair.png')).convert('RGB').crop((0, 0, 452, 478))
    d = np.array(im).astype(np.float32)
    Wp, Hp = 452, 478
    sub = d[258:315, 150:295]
    r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    mx = sub.max(-1); mn = sub.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    hue_yellow = (r >= g) & (g > b) & ((g - b) > 0.45 * (r - b))
    reddish = r > 1.6 * g
    m = ~(hue_yellow & (sat > 0.55)) & ~reddish
    ys, xs = np.nonzero(m)
    x0, x1, y0, y1 = xs.min() + 150, xs.max() + 150, ys.min() + 258, ys.max() + 258
    cx, cy, w, h = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0
    rx, ry = w / 2 + 26, h / 2 + 13
    o = d.copy()
    def px(i, j):
        return d[int(np.clip(round(j), 0, Hp - 1)), int(np.clip(round(i), 0, Wp - 1))]
    def avg(i, j):
        s = np.zeros(3); n = 0
        for a in range(-6, 7):
            for bq in range(-2, 3):
                s += px(i + a, j + bq); n += 1
        return s / n
    for i in range(int(np.floor(cx - rx - 6)), int(np.ceil(cx + rx + 6)) + 1):
        u = (i - cx) / (rx * 1.24 + 1)
        if abs(u) >= 1: continue
        half = (ry * 1.24 + 1) * np.sqrt(1 - u * u)
        ya = max(cy - half, 254) if abs(i - cx) < 26 else cy - half
        yb = cy + half
        A, B = avg(i, ya), avg(i, yb)
        for j in range(int(np.floor(ya)), int(np.ceil(yb)) + 1):
            e = np.hypot((i - cx) / rx, (j - cy) / ry)
            al = 1 if e <= 1 else max(0, 1 - (e - 1) / 0.22)
            if al <= 0: continue
            t = (j - ya) / (yb - ya)
            v = A * (1 - t) + B * t
            o[j, i] = o[j, i] * (1 - al) + v * al
    jj, ii = np.mgrid[0:Hp, 0:Wp]
    e = np.hypot((ii - cx) / rx, (jj - cy) / ry)
    M = np.where(e <= 1, 1, np.clip(1 - (e - 1) / 0.22, 0, 1))[..., None]
    for _ in range(3):
        bl = nd.uniform_filter(o, size=(3, 9, 1), mode='nearest')
        o = o * (1 - M) + bl * M
    return im, Image.fromarray(np.clip(o, 0, 255).astype(np.uint8)), dict(cx=cx, cy=cy, w=w, h=h)


# ---------------------------------------------------------------- helpers
def load(d):
    meta = json.load(open(os.path.join(ROOT, d, 'anchors.json')))
    by = {m['id']: m for m in meta['mouths']}
    imgs = {k: Image.open(os.path.join(ROOT, d, v['file'])).convert('RGBA') for k, v in by.items()}
    return meta, by, imgs


def lifted(meta, by, imgs, mid, lift):
    """canvas image shifted up by upperLift * extra height"""
    dy = -lift * by[mid]['extra_height_px']
    im = imgs[mid]
    if abs(dy) < 0.01: return im
    can = Image.new('RGBA', im.size, (0, 0, 0, 0))
    can.alpha_composite(im, (0, int(round(dy))))
    return can


def header(img, title, sub=None, badge=None):
    dr = ImageDraw.Draw(img)
    dr.rectangle((0, 0, W, 118 if sub else 80), fill=BG_PAGE)
    dr.text((36, 18), title, font=f(46, True), fill=INK)
    if badge:
        tw = dr.textlength(title, font=f(46, True))
        bw = dr.textlength(badge, font=f(34, True))
        dr.rounded_rectangle((60 + tw, 20, 60 + tw + bw + 28, 70), 10, fill=RED)
        dr.text((74 + tw, 25), badge, font=f(34, True), fill=(255, 255, 255))
    if sub: dr.text((36, 76), sub, font=f(32), fill=(110, 90, 72))


def mouth_on(bg_rgb, im, size, scale):
    """mouth canvas (512) scaled and centred on a panel; anchor stays at the same panel spot"""
    p = Image.new('RGBA', size, bg_rgb + (255,))
    s = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    ox = size[0] // 2 - int(256 * scale); oy = int(size[1] * 0.40) - int(112 * scale) - int(85 * scale)
    p.alpha_composite(s, (ox, oy))
    return p, (ox, oy)


class FB:
    def __init__(self, design_meta, Z=3.4):
        self.orig, self.clean, self.old = fb_clean()
        self.Z = Z
        self.big = self.clean.resize((int(452 * Z), int(478 * Z)), Image.LANCZOS).convert('RGBA')
        self.bigorig = self.orig.resize((int(452 * Z), int(478 * Z)), Image.LANCZOS).convert('RGBA')
        self.meta = design_meta
        cw, ch = design_meta['closed_width_px'], design_meta['closed_height_px']
        self.s = self.old['w'] / cw * Z                          # closed width = old decal width
        # closed mouth centre sits on old mouth centre -> anchor (upper-lip top) y in panel px
        self.ay = self.old['cy'] * Z - ch / 2 * self.s
        self.ax = self.old['cx'] * Z

    def frame(self, im, size, orig=False, zoom=1.0, ypos=0.56):
        """face crop of `size`, mouth centred horizontally, anchor at `ypos` of the height; zoom<1 shows more face"""
        if zoom != 1.0:
            big = self.frame(im, (int(size[0] / zoom), int(size[1] / zoom)), orig, 1.0, ypos)
            return big.resize(size, Image.LANCZOS)
        base = (self.bigorig if orig else self.big).copy()
        if im is not None:
            s = im.resize((max(1, int(im.width * self.s)), max(1, int(im.height * self.s))), Image.LANCZOS)
            # light softening so the photo-clay mouth sits in the softer render
            s = s.filter(ImageFilter.GaussianBlur(0.4))
            base.alpha_composite(s, (int(round(self.ax - 256 * self.s)), int(round(self.ay - 112 * self.s))))
        cx, cy = self.ax, self.ay
        x0 = int(cx - size[0] / 2); y0 = int(cy - size[1] * ypos)
        crop = Image.new('RGBA', size, (217, 210, 198, 255))
        crop.alpha_composite(base, (-x0, -y0))
        return crop


def panel_label(img, xy, text, sub=None):
    dr = ImageDraw.Draw(img)
    dr.text(xy, text, font=f(36, True), fill=INK)
    if sub: dr.text((xy[0], xy[1] + 44), sub, font=f(32), fill=(110, 90, 72))


def save(img, name):
    p = os.path.join(REV, name); img.convert('RGB').save(p); print('wrote', name)


# ---------------------------------------------------------------- review stills
def still_ids(d, meta, by, imgs, ids, n, title):
    img = Image.new('RGB', (W, H), BG_PAGE)
    header(img, title, f"Anker: offen = Oberlippe oben (gestrichelt), geschlossen = Lippenlinie von closed. Originalgrößen.")
    pw, ph = 620, 440
    for k, mid in enumerate(ids):
        c, r = k % 3, k // 3
        x, y = 15 + c * (pw + 15), 130 + r * (ph + 30 + 0)
        p, (ox, oy) = mouth_on((226, 218, 204), imgs[mid], (pw, ph - 60), 1.0)
        dr = ImageDraw.Draw(p)
        ay = oy + 112
        for xx in range(0, pw, 22): dr.line((xx, ay, xx + 11, ay), fill=(150, 120, 100), width=2)
        img.paste(p.convert('RGB'), (x, y))
        rat = by[mid]['height_ratio_to_closed']
        panel_label(img, (x + 8, y + ph - 56), f"{n + k}. {mid}", None)
        dr2 = ImageDraw.Draw(img); t = f"Höhe {rat:.2f}×"
        dr2.text((x + pw - 12 - dr2.textlength(t, font=f(32)), y + ph - 52), t, font=f(32), fill=(110, 90, 72))
    return img


def still_cleanup(d, sheet, mid, by, imgs):
    m = by[mid]; bx, by_, bw, bh = m['sheet_bbox']
    raw = Image.open(os.path.join(SRC, sheet)).convert('RGBA')
    pad = 60
    box = (max(0, bx - pad), max(0, by_ - pad), bx + bw + pad, by_ + bh + pad)
    img = Image.new('RGB', (W, H), BG_PAGE)
    header(img, f"Design {d} · Säuberung: {mid}", "Alpha beider Seiten ×12 verstärkt, damit auch fast unsichtbare rote Sprenkel auffallen. Hintergrund weiß.")
    for k, (lab, src) in enumerate([("vorher (Roh-Sheet)", raw.crop(box)), ("nachher (sauberes PNG)", None)]):
        if src is None:
            t = Image.open(os.path.join(ROOT, d, m['trim'])).convert('RGBA')
            src = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
            src.alpha_composite(t, (bx - m['bbox_trim'][0] - box[0], by_ - m['bbox_trim'][1] - box[1]))
        a = np.array(src); a[..., 3] = np.clip(a[..., 3].astype(int) * 12, 0, 255).astype(np.uint8)   # alpha x8: faint specks visible
        src = Image.fromarray(a)
        sc = min(900 / src.width, 860 / src.height)
        s = src.resize((int(src.width * sc), int(src.height * sc)), Image.LANCZOS)
        p = Image.new('RGBA', (930, 880), (255, 255, 255, 255)); p.alpha_composite(s, ((930 - s.width) // 2, (880 - s.height) // 2))
        img.paste(p.convert('RGB'), (20 + k * 950, 135))
        ImageDraw.Draw(img).text((40 + k * 950, 150), lab, font=f(38, True), fill=INK)
    return img


def still_heights(d, meta, by, imgs, tall, fb=None):
    img = Image.new('RGB', (W, H), BG_PAGE)
    hc = meta['closed_height_px']
    if fb is None:
        header(img, f"Design {d} · Höhen-Check (neutral)", f"oben Original, unten 0,8 gestaucht (Oberlippe bleibt). Gestrichelt: Unterkante von closed ({hc} px).")
    else:
        header(img, f"Design {d} · Höhen-Check auf FrizzleBob", "oben Original, unten 0,8 gestaucht. Mundbreite = alte Mundbreite.", badge="2D-Montage, kein 3D")
    pw, ph = 620, 445
    for c, mid in enumerate(tall[:3]):
        for r, var in enumerate([mid, mid + '_sq80']):
            x, y = 15 + c * (pw + 15), 128 + r * (ph + 2)
            if fb is None:
                p, (ox, oy) = mouth_on((226, 218, 204), imgs[var], (pw, ph - 58), 0.95)
                dr = ImageDraw.Draw(p); yl = oy + int((112 + hc) * 0.95)
                for xx in range(0, pw, 22): dr.line((xx, yl, xx + 11, yl), fill=(150, 90, 70), width=3)
            else:
                p = fb.frame(imgs[var], (pw, ph - 58), zoom=0.5, ypos=0.42)
            img.paste(p.convert('RGB'), (x, y))
            rat = by[var]['height_ratio_to_closed']
            ImageDraw.Draw(img).text((x + 8, y + ph - 54), f"{var}  ·  {rat:.2f}× closed", font=f(34, True), fill=INK)
    return img


def outline(im, col, width=3):
    a = np.array(im)[..., 3] > 128
    e = a & ~nd.binary_erosion(a, iterations=width)
    o = np.zeros(a.shape + (4,), np.uint8); o[e] = col + (255,)
    return Image.fromarray(o)


def still_overlay(d, meta, by, imgs, ids):
    img = Image.new('RGB', (W, H), BG_PAGE)
    header(img, f"Design {d} · Anker-Overlay der Sprech-Formen", "alle Talk-Formen übereinander (Umriss). Links upperLift 0, rechts upperLift 0,15.")
    cols = [(40, 40, 40), (200, 60, 40), (40, 110, 200), (40, 150, 70), (170, 70, 170), (220, 140, 20), (0, 150, 150), (120, 80, 40), (90, 90, 200)]
    for k, lift in enumerate([0.0, 0.15]):
        p = Image.new('RGBA', (930, 760), (246, 241, 232, 255))
        for i, mid in enumerate(ids):
            o = outline(lifted(meta, by, imgs, mid, lift), cols[i % len(cols)])
            o = o.resize((int(512 * 1.45), int(512 * 1.45)), Image.NEAREST)
            p.alpha_composite(o, (465 - int(256 * 1.45), 40 - int(40 * 1.45)))
        dr = ImageDraw.Draw(p)
        ay = 40 - int(40 * 1.45) + int(112 * 1.45)
        for xx in range(0, 930, 22): dr.line((xx, ay, xx + 11, ay), fill=(120, 120, 120), width=2)
        img.paste(p.convert('RGB'), (20 + k * 950, 130))
        ImageDraw.Draw(img).text((40 + k * 950, 140), f"upperLift {lift:g}", font=f(38, True), fill=INK)
    # legend
    x = 30
    for i, mid in enumerate(ids):
        dr = ImageDraw.Draw(img); dr.rectangle((x, 912, x + 30, 942), fill=cols[i % len(cols)])
        dr.text((x + 38, 906), mid, font=f(32), fill=INK); x += 48 + int(dr.textlength(mid, font=f(32))) + 26
        if x > W - 250 and i < len(ids) - 1: x = 30; break
    ImageDraw.Draw(img).text((30, 990), "Gestrichelt = Anker-Linie (Oberlippe oben von closed).", font=f(32), fill=(110, 90, 72))
    return img


# ---------------------------------------------------------------- clips
def clip(name, frames):
    path = os.path.join(REV, name)
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                          '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path],
                         stdin=subprocess.PIPE)
    for fr in frames: p.stdin.write(fr.convert('RGB').tobytes())
    p.stdin.close(); p.wait(); print('wrote', name, len(frames), 'frames')


def seq_frames(d, meta, by, imgs, fb, seq, title, lift, loops=3):
    frames = []
    flat = [mid for mid, n in seq for _ in range(n)]
    for li in range(loops):
        for k, mid in enumerate(flat):
            img = Image.new('RGB', (W, H), BG_PAGE)
            header(img, title, None, badge="2D-Montage, kein 3D")
            im = lifted(meta, by, imgs, mid, lift)
            left, _ = mouth_on(CLAY, im, (940, 880), 1.55)
            img.paste(left.convert('RGB'), (13, 90))
            right = fb.frame(im, (940, 880))
            img.paste(right.convert('RGB'), (967, 90))
            dr = ImageDraw.Draw(img)
            dr.rectangle((0, 975, W, H), fill=BG_PAGE)
            dr.text((36, 990), f"{mid}", font=f(44, True), fill=INK)
            dr.text((520, 996), f"upperLift {lift:g}  ·  12 fps  ·  Bild {k + 1}/{len(flat)}  ·  links neutral Ton-Gelb, rechts FrizzleBob", font=f(32), fill=(110, 90, 72))
            frames.append(img)
    return frames


def jump_stats(by, seq, lift):
    """per swap: change of upper-lip-top (anchor), centre-x, and lip-corner y in canvas px"""
    flat = [mid for mid, _ in seq]
    out = []
    for a, b in zip(flat, flat[1:]):
        A, B = by[a], by[b]
        ta = A['upper_lip_top_canvas'] - lift * A['extra_height_px']; tb = B['upper_lip_top_canvas'] - lift * B['extra_height_px']
        out.append(dict(swap=f'{a}->{b}', d_upper=round(tb - ta, 1),
                        d_cx=round((B['bbox_canvas'][0] + B['bbox_canvas'][2] / 2) - (A['bbox_canvas'][0] + A['bbox_canvas'][2] / 2), 1),
                        d_width=B['bbox_canvas'][2] - A['bbox_canvas'][2],
                        d_bottom=round((B['bbox_canvas'][1] + B['bbox_canvas'][3] - lift * B['extra_height_px']) - (A['bbox_canvas'][1] + A['bbox_canvas'][3] - lift * A['extra_height_px']), 1)))
    return out


TALK = {'A': [('closed', 3), ('small_open', 2), ('ah', 3), ('oh', 3), ('small_open', 2), ('closed', 2), ('teeth_small', 2),
              ('ee_wide', 3), ('th_tongue', 2), ('oo', 3), ('small_open', 2), ('mbp', 2), ('closed', 4)],
        'B': [('closed', 3), ('small_open', 2), ('ah', 3), ('oh', 3), ('small_open', 2), ('closed', 2), ('grit', 3),
              ('ah', 2), ('small_open', 2), ('closed', 4)]}
REACT = {'A': [('closed', 8), ('smile_closed', 12), ('smile_teeth', 12), ('closed', 6), ('surprised_tall', 12), ('surprised_tall_sq80', 12),
               ('oo', 10), ('mbp', 10), ('closed', 8)],
         'B': [('closed', 8), ('smile_closed', 12), ('smile_teeth', 12), ('laugh', 12), ('scream', 12), ('scream_sq80', 12),
               ('grit', 10), ('grimace', 12), ('smirk', 12), ('tongue_out', 12), ('closed', 8)]}
TALL = {'A': ['ah', 'oh', 'surprised_tall'], 'B': ['scream', 'tongue_out', 'oh']}
OVER = {'A': ['closed', 'small_open', 'ah', 'oh', 'oo', 'teeth_small', 'ee_wide', 'th_tongue', 'mbp'],
        'B': ['closed', 'small_open', 'ah', 'oh', 'grit']}
SHEET = {'A': 'sheet1.png', 'B': 'sheet2.png'}
CLEAN_DEMO = {'A': 'ah', 'B': 'scream'}


def main():
    os.makedirs(REV, exist_ok=True)
    for fn in os.listdir(REV): os.remove(os.path.join(REV, fn))
    n = 1
    stats = {}
    # 01: retouch
    metaA, byA, imgsA = load('A')
    fbA = FB(metaA)
    img = Image.new('RGB', (W, H), BG_PAGE)
    header(img, "FrizzleBob · alter Mund entfernt", "Quelle ws1/r3f-frame · fb_georg_pair_front_q_side.png, Panel ToolBox P08 vorn. Retusche wie R1.", badge="2D-Montage, kein 3D")
    for k, (lab, orig) in enumerate([("vorher", True), ("nachher (Haut retuschiert)", False)]):
        img.paste(fbA.frame(None, (930, 900), orig=orig).convert('RGB'), (20 + k * 950, 135))
        ImageDraw.Draw(img).text((40 + k * 950, 150), lab, font=f(40, True), fill=INK)
    save(img, f'{n:02d}_FB_retusche_vorher_nachher.png'); n += 1
    for d in ['A', 'B']:
        meta, by, imgs = load(d)
        fb = FB(meta)
        ids = [m['id'] for m in meta['mouths'] if not m['variant_of']]
        save(still_cleanup(d, SHEET[d], CLEAN_DEMO[d], by, imgs), f'{n:02d}_{d}_saeuberung_vorher_nachher.png'); n += 1
        save(still_ids(d, meta, by, imgs, ids[:6], 1, f"Design {d} · Mundformen 1–6"), f'{n:02d}_{d}_formen_1-6.png'); n += 1
        save(still_ids(d, meta, by, imgs, ids[6:], 7, f"Design {d} · Mundformen 7–12"), f'{n:02d}_{d}_formen_7-12.png'); n += 1
        save(still_heights(d, meta, by, imgs, TALL[d]), f'{n:02d}_{d}_hoehe_neutral.png'); n += 1
        save(still_heights(d, meta, by, imgs, TALL[d], fb), f'{n:02d}_{d}_hoehe_frizzlebob.png'); n += 1
        save(still_overlay(d, meta, by, imgs, OVER[d]), f'{n:02d}_{d}_anker_overlay.png'); n += 1
        for lift in (0.0, 0.15):
            tag = '0' if lift == 0 else '015'
            clip(f'{n:02d}_{d}_talk_upperLift{tag}.mp4',
                 seq_frames(d, meta, by, imgs, fb, TALK[d], f"Design {d} · Sprech-Loop · upperLift {lift:g}", lift)); n += 1
            stats[f'{d}_talk_lift{tag}'] = jump_stats(by, TALK[d], lift)
        clip(f'{n:02d}_{d}_reaktionen.mp4', seq_frames(d, meta, by, imgs, fb, REACT[d], f"Design {d} · Reaktionen", 0.0, loops=1)); n += 1
    json.dump(dict(fb_old_mouth=fbA.old, jumps=stats), open(os.path.join(REV, 'jump_stats.json'), 'w'), indent=1, default=float)


if __name__ == '__main__':
    main()
