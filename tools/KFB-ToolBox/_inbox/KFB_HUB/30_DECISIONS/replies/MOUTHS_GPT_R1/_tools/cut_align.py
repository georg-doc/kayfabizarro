#!/usr/bin/env python3
"""MOUTHS_GPT_R1 step 1-4: cut, defringe, name, align, squash variants, anchors.json.
usage: python3 cut_align.py   (paths relative to the MOUTHS_GPT_R1 folder)
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src')

# reading order: row by row, left to right (4x3 sheet)
DESIGNS = {
  'A': dict(sheet='sheet1.png', note='Design A: runde Lippen, kleine Zaehne',
    ids=['closed', 'smile_closed', 'mbp', 'small_open',
         'ah', 'smile_teeth', 'oh', 'oo',
         'teeth_small', 'th_tongue', 'ee_wide', 'surprised_tall'],
    use_as={'closed': 'X rest / MBP', 'mbp': 'MBP (pressed, cupid bow)', 'small_open': 'C small open',
            'ah': 'D AA wide open', 'oh': 'E AO/OH round', 'oo': 'F UW/OO pucker',
            'teeth_small': 'B teeth (S/T/K)', 'th_tongue': 'C EH/AE (tongue low behind teeth, NOT a true TH)',
            'ee_wide': 'B EE / S (both rows of teeth)', 'surprised_tall': 'reaction: surprised / gasp',
            'smile_closed': 'reaction: smile closed', 'smile_teeth': 'reaction: grin'}),
  'B': dict(sheet='sheet2.png', note='Design B: Zahnluecke/Hasenzaehne, expressiver',
    ids=['closed', 'smile_closed', 'smile_teeth', 'laugh',
         'scream', 'oh', 'small_open', 'ah',
         'grit', 'tongue_out', 'grimace', 'smirk'],
    use_as={'closed': 'X rest / MBP', 'small_open': 'X/C slit open', 'ah': 'C/D talk open (teeth + tongue)',
            'oh': 'E+F round ring (one shape for OH and OO)', 'grit': 'B EE/S (clenched teeth)',
            'tongue_out': 'reaction: tongue out (L/TH stand-in at best)', 'scream': 'reaction: scream / D extreme',
            'laugh': 'reaction: laugh', 'smile_closed': 'reaction: smile closed', 'smile_teeth': 'reaction: grin gap teeth',
            'grimace': 'reaction: grimace / lip bite', 'smirk': 'reaction: smirk (asymmetric)'}),
}
TALK_CORE = {'A': ['closed', 'small_open', 'ah', 'oh', 'oo', 'teeth_small', 'ee_wide', 'th_tongue', 'mbp'],
             'B': ['closed', 'small_open', 'ah', 'oh', 'grit', 'scream']}
CANVAS = (512, 512)          # native pixel scale of the GPT sheets (no resampling)
ANCHOR = (256, 112)          # canvas point = mouth centre-x / upper-lip top edge (closed)
SQUASH = 0.8                 # vertical squash for too-tall shapes
TALL_RATIO = {'A': 1.8, 'B': 1.7}   # height / closed above which a _sq80 variant is made (B: less room on the face)
# closed shapes anchor by the LIP LINE (seam) of `closed`; all others by the upper-lip top of `closed`
CLOSED_FAMILY = {'A': ['closed', 'smile_closed', 'mbp'], 'B': ['closed', 'smile_closed', 'small_open']}


def cut_sheet(path):
    a = np.array(Image.open(path).convert('RGBA')).astype(np.float32)
    A = a[..., 3]
    core = A > 128
    lab, n = nd.label(core)
    area = nd.sum(core, lab, range(1, n + 1))
    objs = nd.find_objects(lab)
    big = [i for i in range(n) if area[i] > 5000]
    # order by row (y centre in 3 bands of the 4x3 sheet) then x
    def key(i):
        s = objs[i]; cy = (s[0].start + s[0].stop) / 2; cx = (s[1].start + s[1].stop) / 2
        return (int(cy // (a.shape[0] / 3)), cx)
    big.sort(key=key)
    out = []
    for i in big:
        sl = objs[i]
        m = lab == (i + 1)
        # add components overlapping the bbox that are clearly part of the mouth (teeth islands etc.)
        for j in range(n):
            if j == i or j in big or area[j] < 150: continue
            s2 = objs[j]
            if s2[0].start >= sl[0].start and s2[0].stop <= sl[0].stop and s2[1].start >= sl[1].start and s2[1].stop <= sl[1].stop:
                m |= lab == (j + 1)
        region = nd.binary_fill_holes(m)
        support = nd.binary_dilation(region, iterations=2)
        # alpha: keep only the mouth's own soft edge, erode ~1 px, slight feather
        # grey erosion keeps the original anti-aliased gradient, just 1 px further in; then a slight feather
        cross = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], bool)
        alpha = nd.grey_erosion(A * support, footprint=cross)
        alpha = nd.gaussian_filter(alpha, 0.5)
        alpha[alpha < 3] = 0
        # colour decontamination: edge band + red-shifted pixels take the colour of the nearest solid lip pixel
        rgb = a[..., :3].copy()
        r, g = rgb[..., 0], rgb[..., 1]
        band = support & ~nd.binary_erosion(region, iterations=4)
        reddish = (g / np.maximum(r, 1) < 0.45) & (r > 120)
        solid = nd.binary_erosion(region, iterations=4) & (A >= 250) & ~reddish
        # edge band: red-shifted or semi-transparent pixels; outside the mouth: every pixel (kills hidden RGB under alpha 0)
        bad = (band & ((A < 250) | reddish)) | ~support
        _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True)
        rgb[bad] = a[..., :3][iy[bad], ix[bad]]
        y0, y1 = sl[0].start, sl[0].stop; x0, x1 = sl[1].start, sl[1].stop
        y0 = max(0, y0 - 4); x0 = max(0, x0 - 4); y1 = min(a.shape[0], y1 + 4); x1 = min(a.shape[1], x1 + 4)
        rgba = np.dstack([rgb, alpha])[y0:y1, x0:x1]
        out.append(dict(rgba=np.clip(rgba, 0, 255).astype(np.uint8), sheet_xy=(x0, y0)))
    return out


def measure(rgba):
    A = rgba[..., 3].astype(np.float32)
    ys, xs = np.nonzero(A > 128)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cx = (x0 + x1) / 2
    w = x1 - x0
    cols = range(int(cx - 0.08 * w), int(cx + 0.08 * w) + 1)
    tops = [np.argmax(A[:, c] > 128) for c in cols if (A[:, c] > 128).any()]
    top = float(np.median(tops))
    # lip line (seam) = darkest row between 20% and 80% of the height, averaged over columns 8-25% left/right of centre
    # (skips the centre crease of mbp); for open shapes this lands in the dark mouth interior (info only)
    h = y1 - y0
    cols = [c for c in range(x0, x1) if 0.08 * w <= abs(c - cx) <= 0.25 * w]
    lum = (rgba[:, cols, :3].astype(np.float32) @ np.array([.299, .587, .114])).mean(1)
    r0, r1 = int(y0 + 0.2 * h), int(y0 + 0.8 * h)
    seam = r0 + int(np.argmin(lum[r0:r1]))
    return dict(bbox=[int(x0), int(y0), int(x1 - x0), int(y1 - y0)], cx=float(cx), top=top,
                seam=None if seam is None else int(seam))


def place(rgba, m, dy=0.0, sy=1.0):
    """Put a tight cut on the canvas: centre-x -> ANCHOR.x, upper-lip top -> ANCHOR.y + dy.
    sy<1 squashes vertically around the upper-lip top (it stays where it is)."""
    im = Image.fromarray(rgba)
    top = m['top']
    if sy != 1.0:
        h = rgba.shape[0]
        im = im.convert('RGBa').resize((rgba.shape[1], max(1, int(round(h * sy)))), Image.LANCZOS).convert('RGBA')
        top = top * sy
    can = Image.new('RGBA', CANVAS, (0, 0, 0, 0))
    ox = int(round(ANCHOR[0] - m['cx'])); oy = int(round(ANCHOR[1] + dy - top))
    can.alpha_composite(im, (ox, oy))
    return fix_hidden_rgb(can), ox, oy


def fix_hidden_rgb(im):
    """semi/fully transparent pixels get the colour of the nearest opaque pixel (no red bleed after resampling)"""
    a = np.array(im).astype(np.float32)
    al = a[..., 3]; al[al < 4] = 0
    solid = al >= 250
    _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True)
    m = ~solid
    a[..., :3][m] = a[..., :3][iy[m], ix[m]]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def main():
    allmeta = {}
    for d, cfg in DESIGNS.items():
        cuts = cut_sheet(os.path.join(SRC, cfg['sheet']))
        assert len(cuts) == 12, (d, len(cuts))
        od = os.path.join(ROOT, d); os.makedirs(os.path.join(od, 'trim'), exist_ok=True)
        ms = {}
        for mid, c in zip(cfg['ids'], cuts):
            ms[mid] = measure(c['rgba']); ms[mid]['rgba'] = c['rgba']; ms[mid]['sheet_xy'] = c['sheet_xy']
        hc = ms['closed']['bbox'][3]
        mc = ms['closed']; seam_rel_closed = mc['seam'] - mc['top']
        hc_c = mc['bbox'][1] + mc['bbox'][3] - mc['top']      # closed: upper-lip top (centre) -> lowest point
        entries = []
        for mid in cfg['ids'] + [i + '_sq80' for i in cfg['ids']]:
            base = mid.replace('_sq80', '')
            m = ms[base]; sq = mid.endswith('_sq80')
            ratio = m['bbox'][3] / hc
            if sq and ratio < TALL_RATIO[d]: continue
            sy = SQUASH if sq else 1.0
            mode = 'seam' if base in CLOSED_FAMILY[d] else 'upper_lip_top'
            dy0 = (seam_rel_closed - (m['seam'] - m['top'])) if mode == 'seam' else 0.0
            can, ox, oy = place(m['rgba'], m, dy0, sy)
            can.save(os.path.join(od, mid + '.png'))
            if not sq:
                fix_hidden_rgb(Image.fromarray(m['rgba'])).save(os.path.join(od, 'trim', mid + '.png'))
            bx, by, bw, bh = m['bbox']
            bh_s = bh * sy
            h_open = (by + bh - m['top']) * sy          # upper-lip top (centre) -> lowest point
            extra = 0.0 if mode == 'seam' else max(0.0, h_open - hc_c)
            # red-pixel check outside the lips (pure red with any alpha)
            arr = np.array(can)
            red_out = int(((arr[..., 3] > 0) & (arr[..., 0] > 200) & (arr[..., 1] < 50)).sum())
            entries.append(dict(
                id=mid, file=f'{mid}.png', trim=None if sq else f'trim/{base}.png',
                use_as=cfg['use_as'].get(base, ''), talk_core=base in TALK_CORE[d], variant_of=base if sq else None,
                squash_y=sy, canvas=list(CANVAS),
                offset=[ox, oy],  # where the tight trim's top-left lands on the canvas (upperLift 0)
                bbox_canvas=[ox + bx, int(round(oy + by * sy)), bw, int(round(bh_s))],
                bbox_trim=[bx, by, bw, bh],
                height_ratio_to_closed=round(bh_s / hc, 3),
                width_ratio_to_closed=round(bw / ms['closed']['bbox'][2], 3),
                anchor_mode=mode, anchor_dy=round(dy0, 1),
                upper_lip_top_canvas=round(ANCHOR[1] + dy0, 1),
                seam_canvas=int(round(oy + m['seam'] * sy)),
                extra_height_px=round(extra, 1),
                lift_dy_px={'0': 0, '0.15': -round(0.15 * extra, 1)},
                sheet_bbox=[m['sheet_xy'][0] + bx, m['sheet_xy'][1] + by, bw, bh],
                red_px_outside=red_out))
        meta = dict(design=d, note=cfg['note'], source=f"media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs ({cfg['sheet']})",
                    canvas=list(CANVAS), scale='1.0 = native GPT sheet pixels (relative scale untouched)',
                    anchor=dict(x=ANCHOR[0], y=ANCHOR[1],
                                rule='x = horizontal bbox centre of the mouth. y: OPEN shapes put their upper-lip top edge '
                                     '(median over the central 16% of columns) on anchor.y = upper-lip top of closed, so the '
                                     'upper lip stays under the nose and the jaw opens downward. CLOSED shapes '
                                     '(anchor_mode seam) put their lip line on the lip line of closed (anchor.y + seam_offset).',
                                seam_offset=int(seam_rel_closed)),
                    upperLift=dict(value=0.0, value_baked=0.0, range=[0.0, 1.0], tested=[0.0, 0.15],
                                   rule='dy = -upperLift * extra_height_px, extra = max(0, h_shape - h_closed) measured from '
                                        'the upper-lip top (centre) to the lowest point; 0 for closed shapes. The upper lip rises by that share '
                                        'of the extra opening height, the rest goes down. PNGs are baked at 0; apply dy '
                                        'in the engine (lift_dy_px lists 0.15).'),
                    closed_height_px=hc, closed_width_px=ms['closed']['bbox'][2],
                    squash=dict(factor=SQUASH, applied_when=f'height_ratio_to_closed >= {TALL_RATIO[d]}',
                                pivot='upper-lip top (stays fixed)'),
                    mouths=entries)
        with open(os.path.join(od, 'anchors.json'), 'w') as f:
            json.dump(meta, f, indent=1)
        allmeta[d] = meta
        print(d, 'closed h', hc)
        for e in entries:
            print(f"  {e['id']:16s} h/closed {e['height_ratio_to_closed']:.2f}  w/closed {e['width_ratio_to_closed']:.2f}"
                  f"  bbox {e['bbox_canvas']}  seam {e['seam_canvas']}  red {e['red_px_outside']}")


if __name__ == '__main__':
    main()
