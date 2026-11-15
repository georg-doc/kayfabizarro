#!/usr/bin/env python3
"""MOUTHS_GPT_R4 (V-1765): Mund-Boegen 5x4 schneiden, freistellen, verankern – wie MOUTHS_GPT_R1/_tools/cut_align.py (unveraendert, hier importiert),
nur Raster 5x4, Reihenfolge aus BRIEF_CHATGPT_MOUTHS_R4.md, transparenter ODER gruener Hintergrund (#00FF00 wird freigestellt).
Aufruf:  python3 cut_align_r4.py [typ …]      Quelle: ../_src/mouths_r4_<typ>.png   Ziel: ../<typ>/ (PNG je Form 512x512, trim/, anchors.json)
Dateinamen = Formen des Spiels (src/modules/mundSaetze.js FORM): closed, mbp, small_open, ah, ee_wide, oh, oo, smile_closed, th_tongue (= l_th),
teeth_small (= grimace, S mit Zaehnen zusammen), dazu die neuen: mid_open, fv, smile_teeth, laugh, smirk, grimace, sad, angry, surprised, scared, disgust.
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R1', '_tools'))
import cut_align as R1   # measure, place, fix_hidden_rgb, Konstanten (CANVAS 512, ANCHOR, SQUASH)

COLS, ROWS = 5, 4
IDS = ['closed', 'mbp', 'small_open', 'mid_open', 'ah',
       'ee_wide', 'oh', 'oo', 'fv', 'l_th',
       'smile_closed', 'smile_teeth', 'laugh', 'smirk', 'grimace',
       'sad', 'angry', 'surprised', 'scared', 'disgust']
ALIAS = {'th_tongue': 'l_th', 'teeth_small': 'grimace'}          # Spiel-Dateinamen, die es im R4-Raster unter anderem Namen gibt
CLOSED_FAMILY = ['closed', 'mbp', 'smile_closed']   # Lippenlinie wie closed (sad und smirk sind in allen R4-Bögen offen, V-1817)
TALL_RATIO = 1.7

def alpha_of(path):
    a = np.array(Image.open(path).convert('RGBA')).astype(np.float32)
    if (a[..., 3] < 250).mean() < 0.05:   # kein echter Alphakanal → Gruen freistellen
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        green = (g > 150) & (g > r * 1.4) & (g > b * 1.4)
        a[..., 3] = np.where(green, 0, 255)
        a[..., 3] = nd.gaussian_filter(a[..., 3], 0.6)
    return a

def cut_sheet(path):
    a = alpha_of(path); A = a[..., 3]; H, W = A.shape
    core = A > 128; lab, n = nd.label(core); area = nd.sum(core, lab, range(1, n + 1)); objs = nd.find_objects(lab)
    cellA = (H / ROWS) * (W / COLS); big = [i for i in range(n) if area[i] > 0.02 * cellA]
    cells = {}
    for i in big:   # je Rasterzelle das groesste Objekt (Zaehne/Inseln kommen ueber die Bbox dazu)
        s = objs[i]; cy = (s[0].start + s[0].stop) / 2; cx = (s[1].start + s[1].stop) / 2
        k = (min(ROWS - 1, int(cy // (H / ROWS))), min(COLS - 1, int(cx // (W / COLS))))
        if k not in cells or area[i] > area[cells[k]]: cells[k] = i
    out = []
    for r in range(ROWS):
        for c in range(COLS):
            i = cells.get((r, c))
            if i is None: out.append(None); continue
            sl = objs[i]; m = lab == (i + 1)
            for j in range(n):
                if j == i or area[j] < 30: continue
                s2 = objs[j]
                if s2[0].start >= sl[0].start and s2[0].stop <= sl[0].stop and s2[1].start >= sl[1].start and s2[1].stop <= sl[1].stop: m |= lab == (j + 1)
            region = nd.binary_fill_holes(m); support = nd.binary_dilation(region, iterations=2)
            cross = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], bool)
            alpha = nd.gaussian_filter(nd.grey_erosion(A * support, footprint=cross), 0.5); alpha[alpha < 3] = 0
            rgb = a[..., :3].copy(); solid = nd.binary_erosion(region, iterations=3) & (A >= 250)
            bad = (support & ~solid & (A < 250)) | ~support
            if solid.any():
                _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True); rgb[bad] = a[..., :3][iy[bad], ix[bad]]
            y0, y1 = max(0, sl[0].start - 4), min(H, sl[0].stop + 4); x0, x1 = max(0, sl[1].start - 4), min(W, sl[1].stop + 4)
            out.append(dict(rgba=np.clip(np.dstack([rgb, alpha])[y0:y1, x0:x1], 0, 255).astype(np.uint8), sheet_xy=(x0, y0)))
    return out

def run(typ):
    src = os.path.join(ROOT, '_src', f'mouths_r4_{typ}.png'); od = os.path.join(ROOT, typ)
    cuts = cut_sheet(src); fehlt = [IDS[k] for k, c in enumerate(cuts) if c is None]
    if fehlt: print(typ, 'STOPP: leere Zellen', fehlt); return False
    os.makedirs(os.path.join(od, 'trim'), exist_ok=True)
    ms = {mid: dict(R1.measure(c['rgba']), rgba=c['rgba'], sheet_xy=c['sheet_xy']) for mid, c in zip(IDS, cuts)}
    mc = ms['closed']; hc = mc['bbox'][3]; seam_c = mc['seam'] - mc['top']; entries = []
    for mid in IDS:
        m = ms[mid]; ratio = m['bbox'][3] / hc; sy = R1.SQUASH if ratio >= TALL_RATIO else 1.0
        mode = 'seam' if mid in CLOSED_FAMILY else 'upper_lip_top'; dy0 = (seam_c - (m['seam'] - m['top'])) if mode == 'seam' else 0.0
        can, ox, oy = R1.place(m['rgba'], m, dy0, sy); can.save(os.path.join(od, mid + '.png'))
        R1.fix_hidden_rgb(Image.fromarray(m['rgba'])).save(os.path.join(od, 'trim', mid + '.png'))
        entries.append(dict(id=mid, file=f'{mid}.png', squash_y=sy, height_ratio_to_closed=round(m['bbox'][3] * sy / hc, 3),
                            width_ratio_to_closed=round(m['bbox'][2] / mc['bbox'][2], 3), anchor_mode=mode, anchor_dy=round(dy0, 1), offset=[ox, oy]))
    for game, r4 in ALIAS.items(): Image.open(os.path.join(od, r4 + '.png')).save(os.path.join(od, game + '.png')); entries.append(dict(id=game, file=f'{game}.png', alias_of=r4))
    json.dump(dict(design=typ, source=f'_src/mouths_r4_{typ}.png', grid=[COLS, ROWS], canvas=list(R1.CANVAS), anchor=dict(x=R1.ANCHOR[0], y=R1.ANCHOR[1]),
                   closed_height_px=hc, mouths=entries), open(os.path.join(od, 'anchors.json'), 'w'), indent=1)
    zu_hoch = [e['id'] for e in entries if e.get('squash_y', 1) < 1]
    print(typ, 'ok', len(entries), 'Dateien, closed h', hc, '| gestaucht:', zu_hoch); return True

if __name__ == '__main__':
    typen = sys.argv[1:] or sorted(f[len('mouths_r4_'):-4] for f in os.listdir(os.path.join(ROOT, '_src')) if f.startswith('mouths_r4_') and f.endswith('.png'))
    for t in typen: run(t)
