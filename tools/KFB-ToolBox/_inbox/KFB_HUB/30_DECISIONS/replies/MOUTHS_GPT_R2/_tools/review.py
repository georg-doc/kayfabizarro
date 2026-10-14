#!/usr/bin/env python3
"""MOUTHS_GPT_R2 review: single 1920x1080 PNGs (max 4 mouths, pairs), 12 fps MP4 clips.
usage: python3 review.py   (after cut_align.py)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as nd
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src'); REV = os.path.join(ROOT, 'review')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cut_align import LIFT_BAKED, LIFT_TESTED, ANCHOR  # noqa: E402
# FrizzleBob retouch: same code path as R1 (MOUTHS_GPT_R1/_tools/review.py -> fb_clean)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R1', '_tools'))
import importlib.util
_spec = importlib.util.spec_from_file_location('r1review', os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R1', '_tools', 'review.py'))
r1 = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(r1)
r1.SRC = SRC   # same fb_pair.png copy

W, H, FPS = 1920, 1080, 12
BG_PAGE = (239, 232, 220); INK = (58, 35, 24); RED = (181, 67, 47); SUBC = (110, 90, 72)
CLAY = (226, 178, 60)
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'; FONTB = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
f = lambda s, b=False: ImageFont.truetype(FONTB if b else FONT, s)
BADGE = '2D-Montage, kein 3D'


def load(d):
    meta = json.load(open(os.path.join(ROOT, d, 'anchors.json')))
    by = {m['id']: m for m in meta['mouths']}
    imgs = {k: Image.open(os.path.join(ROOT, d, v['file'])).convert('RGBA') for k, v in by.items()}
    nos = {k: Image.open(os.path.join(ROOT, d, v['noshadow'])).convert('RGBA') for k, v in by.items()}
    return meta, by, imgs, nos


def lifted(by, imgs, mid, lift):
    dy = by[mid]['dy_from_baked'].get(str(lift), -(lift - LIFT_BAKED) * by[mid]['extra_height_px'])
    im = imgs[mid]
    if abs(dy) < 0.5: return im
    can = Image.new('RGBA', im.size, (0, 0, 0, 0)); can.alpha_composite(im, (0, int(round(dy))))
    return can


def header(img, title, sub=None, badge=None):
    dr = ImageDraw.Draw(img)
    dr.rectangle((0, 0, W, 118 if sub else 80), fill=BG_PAGE)
    dr.text((36, 18), title, font=f(46, True), fill=INK)
    if badge:
        tw = dr.textlength(title, font=f(46, True)); bw = dr.textlength(badge, font=f(34, True))
        dr.rounded_rectangle((60 + tw, 20, 60 + tw + bw + 28, 70), 10, fill=RED)
        dr.text((74 + tw, 25), badge, font=f(34, True), fill=(255, 255, 255))
    if sub: dr.text((36, 76), sub, font=f(32), fill=SUBC)


def mouth_panel(im, size, scale, bg=CLAY, lines=None):
    """canvas anchor (lip line of closed) at 50% panel height"""
    p = Image.new('RGBA', size, bg + (255,))
    s = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    ox = size[0] // 2 - int(ANCHOR[0] * scale); oy = int(size[1] * 0.5) - int(ANCHOR[1] * scale)
    p.alpha_composite(s, (ox, oy))
    if lines:
        dr = ImageDraw.Draw(p)
        for y, col, dash in lines:
            yy = oy + int(y * scale)
            for xx in range(0, size[0], dash * 2): dr.line((xx, yy, xx + dash, yy), fill=col, width=2)
    return p


class FB:
    def __init__(self, meta, Z=3.4):
        self.orig, self.clean, self.old = r1.fb_clean()
        self.Z = Z
        self.big = self.clean.resize((int(452 * Z), int(478 * Z)), Image.LANCZOS).convert('RGBA')
        self.bigorig = self.orig.resize((int(452 * Z), int(478 * Z)), Image.LANCZOS).convert('RGBA')
        self.s = meta['fb']['scale_to_fb_panel'] * Z
        self.ax, self.ay = self.old['cx'] * Z, self.old['cy'] * Z     # closed lip line on old mouth centre

    def frame(self, im, size, orig=False, zoom=1.0, ypos=0.52):
        if zoom != 1.0:
            return self.frame(im, (int(size[0] / zoom), int(size[1] / zoom)), orig, 1.0, ypos).resize(size, Image.LANCZOS)
        base = (self.bigorig if orig else self.big).copy()
        if im is not None:
            s = im.resize((max(1, int(im.width * self.s)), max(1, int(im.height * self.s))), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))
            base.alpha_composite(s, (int(round(self.ax - ANCHOR[0] * self.s)), int(round(self.ay - ANCHOR[1] * self.s))))
        x0 = int(self.ax - size[0] / 2); y0 = int(self.ay - size[1] * ypos)
        crop = Image.new('RGBA', size, (217, 210, 198, 255)); crop.alpha_composite(base, (-x0, -y0))
        return crop


def save(img, name):
    img.convert('RGB').save(os.path.join(REV, name)); print('wrote', name)


def pair_image(title, sub, panels, badge=None):
    """panels: list of (PIL image 930x880, label) – 2 panels side by side"""
    img = Image.new('RGB', (W, H), BG_PAGE); header(img, title, sub, badge)
    for k, (p, lab) in enumerate(panels):
        img.paste(p.convert('RGB'), (20 + k * 950, 132))
        dr = ImageDraw.Draw(img)
        tw = dr.textlength(lab, font=f(38, True))
        dr.rounded_rectangle((32 + k * 950, 146, 32 + k * 950 + tw + 24, 196), 8, fill=(255, 255, 255))
        dr.text((44 + k * 950, 150), lab, font=f(38, True), fill=INK)
    return img


def quad_image(title, sub, panels, badge=None):
    """4 panels 2x2 (each 935x430) with label below"""
    img = Image.new('RGB', (W, H), BG_PAGE); header(img, title, sub, badge)
    pw, ph = 935, 418
    for k, (p, lab, right) in enumerate(panels):
        c, r = k % 2, k // 2
        x, y = 17 + c * (pw + 16), 128 + r * (ph + 54)
        img.paste(p.convert('RGB').resize((pw, ph)) if p.size != (pw, ph) else p.convert('RGB'), (x, y))
        dr = ImageDraw.Draw(img)
        dr.text((x + 6, y + ph + 6), lab, font=f(36, True), fill=INK)
        if right: dr.text((x + pw - 8 - dr.textlength(right, font=f(32)), y + ph + 9), right, font=f(32), fill=SUBC)
    return img


def outline(im, col, width=3):
    a = np.array(im)[..., 3] > 128
    e = a & ~nd.binary_erosion(a, iterations=width)
    o = np.zeros(a.shape + (4,), np.uint8); o[e] = col + (255,)
    return Image.fromarray(o)


def overlay_panel(by, nos, ids, lift, meta):
    cols = [(40, 40, 40), (200, 60, 40), (40, 110, 200), (40, 150, 70), (170, 70, 170), (220, 140, 20), (0, 150, 150), (120, 80, 40), (90, 90, 200)]
    p = Image.new('RGBA', (930, 880), (246, 241, 232, 255))
    sc = 1.55
    for i, mid in enumerate(ids):
        o = outline(lifted(by, nos, mid, lift), cols[i % len(cols)]).resize((int(512 * sc), int(512 * sc)), Image.NEAREST)
        p.alpha_composite(o, (465 - int(ANCHOR[0] * sc), 470 - int(ANCHOR[1] * sc)))
    dr = ImageDraw.Draw(p)
    for y, col, dash in [(ANCHOR[1], (90, 90, 90), 11), (meta['anchor']['closed_upper_lip_top_y'], (180, 120, 90), 5)]:
        yy = 470 + int((y - ANCHOR[1]) * sc)
        for xx in range(0, 930, dash * 2): dr.line((xx, yy, xx + dash, yy), fill=col, width=2)
    return p, cols


def clip(name, frames):
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    p = subprocess.Popen([exe, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                          '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
                          os.path.join(REV, name)], stdin=subprocess.PIPE)
    for fr in frames: p.stdin.write(fr.convert('RGB').tobytes())
    p.stdin.close(); p.wait(); print('wrote', name, len(frames), 'frames')


def seq_frames(by, imgs, fb, seq, title, lift, loops):
    flat = [mid for mid, n in seq for _ in range(n)]
    cache = {}
    frames = []
    for li in range(loops):
        for k, mid in enumerate(flat):
            if mid not in cache:
                im = lifted(by, imgs, mid, lift)
                cache[mid] = (mouth_panel(im, (940, 880), 1.5), fb.frame(im, (940, 880)))
            left, right = cache[mid]
            img = Image.new('RGB', (W, H), BG_PAGE); header(img, title, None, BADGE)
            img.paste(left.convert('RGB'), (13, 90)); img.paste(right.convert('RGB'), (967, 90))
            dr = ImageDraw.Draw(img); dr.rectangle((0, 975, W, H), fill=BG_PAGE)
            dr.text((36, 990), mid, font=f(44, True), fill=INK)
            dr.text((560, 996), f"upperLift {lift:g}  ·  12 fps  ·  Bild {k + 1}/{len(flat)}  ·  links Ton-Gelb, rechts FrizzleBob", font=f(32), fill=SUBC)
            frames.append(img)
    return frames


def jump_stats(by, seq, lift):
    flat = [m for m, _ in seq]; out = []
    for a, b in zip(flat, flat[1:]):
        A, B = by[a], by[b]
        dA = -(lift - LIFT_BAKED) * A['extra_height_px']; dB = -(lift - LIFT_BAKED) * B['extra_height_px']
        out.append(dict(swap=f'{a}->{b}', d_upper=round((B['upper_lip_top_canvas'] + dB) - (A['upper_lip_top_canvas'] + dA), 1),
                        d_bottom=round((B['bbox_canvas'][1] + B['bbox_canvas'][3] + dB) - (A['bbox_canvas'][1] + A['bbox_canvas'][3] + dA), 1),
                        d_width=B['bbox_canvas'][2] - A['bbox_canvas'][2]))
    return out


TALK = {'A': [('closed', 3), ('small_open', 2), ('ah', 3), ('oh', 3), ('small_open', 2), ('closed', 2), ('teeth_small', 2),
              ('ee_wide', 3), ('th_tongue', 2), ('oo', 3), ('small_open', 2), ('mbp', 2), ('closed', 4)],
        'B': [('closed', 3), ('small_open', 2), ('ah', 3), ('oh', 3), ('small_open', 2), ('closed', 2), ('grit', 3),
              ('ah', 2), ('small_open', 2), ('closed', 4)],
        'C': [('closed', 3), ('small_open', 2), ('eh_teeth', 3), ('ah', 3), ('oh', 3), ('small_open', 2), ('closed', 2),
              ('grit', 3), ('eh_teeth', 2), ('lip_bite', 2), ('small_open', 2), ('closed', 4)]}
REACT = {'A': [('closed', 8), ('smile_closed', 12), ('smile_teeth', 12), ('closed', 6), ('surprised_tall', 12), ('oo', 10), ('mbp', 10), ('closed', 8)],
         'B': [('closed', 8), ('smile_closed', 12), ('smile_teeth', 12), ('laugh', 12), ('scream', 12), ('grit', 10), ('grimace', 12),
               ('smirk', 12), ('tongue_out', 12), ('closed', 8)],
         'C': [('closed', 8), ('smile_closed', 12), ('smirk_closed', 12), ('grin', 12), ('laugh_open', 12), ('ah', 12), ('grit', 10),
               ('tongue_out', 12), ('lip_bite', 10), ('closed', 8)]}
HEIGHT_PAIRS = {'A': ['ah', 'surprised_tall'], 'B': ['scream', 'tongue_out'], 'C': ['ah', 'tongue_out']}
SHADOW_DEMO = {'A': 'small_open', 'B': 'ah', 'C': 'eh_teeth'}
OVER = {'A': ['closed', 'small_open', 'ah', 'oh', 'oo', 'teeth_small', 'ee_wide', 'th_tongue', 'mbp'],
        'B': ['closed', 'small_open', 'ah', 'oh', 'grit'],
        'C': ['closed', 'small_open', 'eh_teeth', 'ah', 'oh', 'grit', 'lip_bite']}


def main():
    os.makedirs(REV, exist_ok=True)
    for fn in os.listdir(REV): os.remove(os.path.join(REV, fn))
    n = 1; stats = {}
    metaA = json.load(open(os.path.join(ROOT, 'A', 'anchors.json')))
    fb0 = FB(metaA)
    save(pair_image("FrizzleBob · alter Mund entfernt", "Panel ToolBox P08 vorn (ws1/r3f-frame, fb-v240). Retusche wie R1.",
                    [(fb0.frame(None, (930, 880), orig=True), "vorher"), (fb0.frame(None, (930, 880)), "nachher")], BADGE),
         f'{n:02d}_FB_retusche_vorher_nachher.png'); n += 1
    for d in ['A', 'B', 'C']:
        meta, by, imgs, nos = load(d)
        fb = FB(meta)
        ids = [m['id'] for m in meta['mouths'] if not m['variant_of']]
        hc = meta['closed_height_px']
        if d == 'C':   # cleanup pair only for the new sheet (A/B: see R1 02/11)
            m = by['eh_teeth']; bx, by_, bw, bh = m['sheet_bbox']
            raw = Image.open(os.path.join(SRC, 'sheet3.png')).convert('RGBA'); pad = 60
            box = (max(0, bx - pad), max(0, by_ - pad), bx + bw + pad, by_ + bh + pad)
            t = Image.open(os.path.join(ROOT, d, 'noshadow', 'eh_teeth.png')).convert('RGBA')
            clean = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
            clean.alpha_composite(t, (m['sheet_bbox'][0] - m['bbox_canvas'][0] - box[0], m['sheet_bbox'][1] - m['bbox_canvas'][1] - box[1]))
            pans = []
            for src, lab in [(raw.crop(box), "vorher (Roh-Sheet)"), (clean, "nachher (sauber)")]:
                a = np.array(src); a[..., 3] = np.clip(a[..., 3].astype(int) * 12, 0, 255).astype(np.uint8)
                s = Image.fromarray(a); sc = min(900 / s.width, 840 / s.height)
                s = s.resize((int(s.width * sc), int(s.height * sc)), Image.LANCZOS)
                p = Image.new('RGBA', (930, 880), (255, 255, 255, 255)); p.alpha_composite(s, ((930 - s.width) // 2, (880 - s.height) // 2 + 20))
                pans.append((p, lab))
            save(pair_image("Design C · Säuberung: eh_teeth", "Alpha ×12 verstärkt, damit auch fast unsichtbare rote Sprenkel auffallen.", pans),
                 f'{n:02d}_C_saeuberung_vorher_nachher.png'); n += 1
        # forms, 4 per image, on clay with shadow; lines = lip line (anchor) and closed upper-lip top
        lines = [(ANCHOR[1], (120, 70, 30), 11), (meta['anchor']['closed_upper_lip_top_y'], (160, 110, 60), 5)]
        for g in range(3):
            chunk = ids[g * 4:(g + 1) * 4]
            pans = [(mouth_panel(imgs[mid], (935, 418), 1.0, CLAY, lines), f"{g * 4 + k + 1}. {mid}",
                     f"Höhe {by[mid]['height_ratio_to_closed']:.2f}×" + (" (gestaucht)" if by[mid]['squashed'] else ""))
                    for k, mid in enumerate(chunk)]
            save(quad_image(f"Design {d} · Mundformen {g * 4 + 1}–{g * 4 + 4}",
                            "Mit Kontaktschatten, upperLift 0,35. Lang gestrichelt = Lippenlinie von closed (Anker), kurz = Oberlippe closed.", pans),
                 f'{n:02d}_{d}_formen_{g * 4 + 1}-{g * 4 + 4}.png'); n += 1
        sd = SHADOW_DEMO[d]
        save(pair_image(f"Design {d} · Kontaktschatten: {sd}", "Gleicher Mund auf FrizzleBob, links ohne, rechts mit weichem Schatten.",
                        [(fb.frame(nos[sd], (930, 880), zoom=1.25, ypos=0.5), "ohne Schatten"), (fb.frame(imgs[sd], (930, 880), zoom=1.25, ypos=0.5), "mit Schatten")], BADGE),
             f'{n:02d}_{d}_schatten_paar.png'); n += 1
        lim = meta['height_limit']
        pans = []
        for mid in HEIGHT_PAIRS[d]:
            for vid, lab in [(mid + '_full', 'Original'), (mid, 'gestaucht')]:
                pans.append((fb.frame(imgs[vid], (935, 418), zoom=0.62, ypos=0.45), f"{mid} · {lab}",
                             f"{by[vid]['height_ratio_to_closed']:.2f}× closed"))
        save(quad_image(f"Design {d} · Höhe auf FrizzleBob", f"Grenze {lim['ratio_to_closed']:.2f}× closed = {lim['max_px']:.0f} px nativ. Paare: links Original, rechts gestaucht.", pans, BADGE),
             f'{n:02d}_{d}_hoehe_paare.png'); n += 1
        pans = []
        for lift in LIFT_TESTED:
            p, cols = overlay_panel(by, nos, OVER[d], lift, meta); pans.append((p, f"upperLift {lift:g}"))
        img = pair_image(f"Design {d} · Anker-Overlay Sprechformen", "Umrisse übereinander. Lang gestrichelt = Lippenlinie closed (Anker), kurz = Oberlippe closed.", pans)
        dr = ImageDraw.Draw(img); x = 30
        for i, mid in enumerate(OVER[d]):
            tw = dr.textlength(mid, font=f(32))
            if x + 48 + tw > W - 20: break
            dr.rectangle((x, 1030, x + 30, 1060), fill=cols[i % len(cols)]); dr.text((x + 38, 1024), mid, font=f(32), fill=INK); x += 48 + tw + 24
        save(img, f'{n:02d}_{d}_anker_overlay.png'); n += 1
        for lift in LIFT_TESTED:
            tag = f'{int(round(lift * 100)):03d}'
            clip(f'{n:02d}_{d}_talk_upperLift{tag}.mp4', seq_frames(by, imgs, fb, TALK[d], f"Design {d} · Sprech-Loop · upperLift {lift:g}", lift, 3)); n += 1
            stats[f'{d}_talk_lift{tag}'] = jump_stats(by, TALK[d], lift)
        clip(f'{n:02d}_{d}_reaktionen.mp4', seq_frames(by, imgs, fb, REACT[d], f"Design {d} · Reaktionen · upperLift {LIFT_BAKED:g}", LIFT_BAKED, 1)); n += 1
    json.dump(stats, open(os.path.join(REV, 'jump_stats.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
