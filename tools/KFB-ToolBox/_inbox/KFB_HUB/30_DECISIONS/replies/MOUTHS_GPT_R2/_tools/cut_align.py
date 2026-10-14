#!/usr/bin/env python3
"""MOUTHS_GPT_R2: cut + defringe (as R1), height limit, lowered anchor with upperLift, contact shadow, anchors.json.
usage: python3 cut_align.py   (paths relative to the MOUTHS_GPT_R2 folder)
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src')

DESIGNS = {
  'A': dict(sheet='sheet1.png', note='Design A: runde Lippen, kleine Zaehne',
    ids=['closed', 'smile_closed', 'mbp', 'small_open', 'ah', 'smile_teeth', 'oh', 'oo',
         'teeth_small', 'th_tongue', 'ee_wide', 'surprised_tall'],
    closed_family=['closed', 'smile_closed', 'mbp'], seam_mode='darkest',
    use_as={'closed': 'X rest / MBP', 'mbp': 'MBP (pressed, cupid bow)', 'small_open': 'C small open',
            'ah': 'D AA wide open', 'oh': 'E OH round', 'oo': 'F OO pucker', 'teeth_small': 'B teeth S/T/K',
            'th_tongue': 'C EH/AE (tongue low, NOT a true TH)', 'ee_wide': 'B EE/S', 'surprised_tall': 'reaction surprised',
            'smile_closed': 'reaction smile', 'smile_teeth': 'reaction grin'}),
  'B': dict(sheet='sheet2.png', note='Design B: Zahnluecke/Hasenzaehne, expressiver',
    ids=['closed', 'smile_closed', 'smile_teeth', 'laugh', 'scream', 'oh', 'small_open', 'ah',
         'grit', 'tongue_out', 'grimace', 'smirk'],
    closed_family=['closed', 'smile_closed', 'small_open'], seam_mode='darkest',
    use_as={'closed': 'X rest / MBP', 'small_open': 'X/C slit', 'ah': 'C/D talk open', 'oh': 'E+F ring (OH and OO)',
            'grit': 'B EE/S clenched', 'tongue_out': 'reaction tongue (L/TH stand-in)', 'scream': 'reaction scream',
            'laugh': 'reaction laugh', 'smile_closed': 'reaction smile', 'smile_teeth': 'reaction grin',
            'grimace': 'reaction grimace / lip bite', 'smirk': 'reaction smirk'}),
  'C': dict(sheet='sheet3.png', note='Design C: duenne Wurst-Lippen (Strich-Mund)',
    ids=['closed', 'smile_closed', 'smirk_closed', 'small_open', 'eh_teeth', 'ah', 'oh', 'grin',
         'grit', 'tongue_out', 'lip_bite', 'laugh_open'],
    closed_family=['closed', 'smile_closed', 'smirk_closed'], seam_mode='centre',
    use_as={'closed': 'X rest / MBP (single clay line)', 'smile_closed': 'reaction smile', 'smirk_closed': 'reaction smirk',
            'small_open': 'C small open / OH small', 'eh_teeth': 'C/D talk open (upper teeth + tongue)', 'ah': 'D AA wide',
            'oh': 'E+F ring (OH and OO)', 'grin': 'B EE wide grin (both rows)', 'grit': 'B EE/S clenched',
            'tongue_out': 'reaction tongue (L/TH stand-in)', 'lip_bite': 'G F/V candidate (upper teeth on lower lip)',
            'laugh_open': 'reaction laugh / D'}),
}
CANVAS = (512, 512)
ANCHOR = (256, 220)          # canvas point = mouth centre-x / LIP LINE (mouth centre) of closed -> headroom above
LIFT_BAKED = 0.35            # upperLift baked into the PNGs (tested 0.3 and 0.4)
LIFT_TESTED = [0.3, 0.4]
LIMIT_RATIO = 1.7            # max height relative to closed (A, B)
FB_OLD_MOUTH_W = 91.0        # px, old FB decal width in the 452px front panel (R1 measurement) = closed width on FB
# C: closed is a single clay line, so x-closed is meaningless -> same absolute face budget as A (1.7 x A-closed on FB)
SHADOW = dict(color=(62, 38, 16), tight_sigma=3.0, tight_alpha=0.40, drop_sigma=9.0, drop_dy=8, drop_alpha=0.38)


def cut_sheet(path):
    a = np.array(Image.open(path).convert('RGBA')).astype(np.float32)
    A = a[..., 3]
    core = A > 128
    lab, n = nd.label(core)
    area = nd.sum(core, lab, range(1, n + 1))
    objs = nd.find_objects(lab)
    big = [i for i in range(n) if area[i] > 5000]
    big.sort(key=lambda i: (int(((objs[i][0].start + objs[i][0].stop) / 2) // (a.shape[0] / 3)), (objs[i][1].start + objs[i][1].stop) / 2))
    out = []
    for i in big:
        sl = objs[i]
        m = lab == (i + 1)
        for j in range(n):
            if j == i or j in big or area[j] < 150: continue
            s2 = objs[j]
            if s2[0].start >= sl[0].start and s2[0].stop <= sl[0].stop and s2[1].start >= sl[1].start and s2[1].stop <= sl[1].stop:
                m |= lab == (j + 1)
        region = nd.binary_fill_holes(m)
        support = nd.binary_dilation(region, iterations=2)
        cross = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], bool)
        alpha = nd.gaussian_filter(nd.grey_erosion(A * support, footprint=cross), 0.5)
        alpha[alpha < 3] = 0
        rgb = a[..., :3].copy()
        r, g = rgb[..., 0], rgb[..., 1]
        band = support & ~nd.binary_erosion(region, iterations=4)
        reddish = (g / np.maximum(r, 1) < 0.45) & (r > 120)
        solid = nd.binary_erosion(region, iterations=4) & (A >= 250) & ~reddish
        bad = (band & ((A < 250) | reddish)) | ~support
        _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True)
        rgb[bad] = a[..., :3][iy[bad], ix[bad]]
        y0, y1 = max(0, sl[0].start - 4), min(a.shape[0], sl[0].stop + 4)
        x0, x1 = max(0, sl[1].start - 4), min(a.shape[1], sl[1].stop + 4)
        out.append(dict(rgba=np.clip(np.dstack([rgb, alpha])[y0:y1, x0:x1], 0, 255).astype(np.uint8), sheet_xy=(x0, y0)))
    return out


def fix_hidden_rgb(arr):
    a = arr.astype(np.float32)
    al = a[..., 3]; al[al < 4] = 0
    solid = al >= 250
    _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True)
    m = ~solid
    a[..., :3][m] = a[..., :3][iy[m], ix[m]]
    return np.clip(a, 0, 255).astype(np.uint8)


def squash(rgba, sy):
    im = Image.fromarray(rgba).convert('RGBa')
    im = im.resize((rgba.shape[1], max(1, int(np.floor(rgba.shape[0] * sy)))), Image.LANCZOS).convert('RGBA')
    return fix_hidden_rgb(np.array(im))


def measure(rgba, seam_mode):
    A = rgba[..., 3].astype(np.float32)
    ys, xs = np.nonzero(A > 128)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cx = (x0 + x1) / 2; w = x1 - x0; h = y1 - y0
    cols = [c for c in range(int(cx - 0.08 * w), int(cx + 0.08 * w) + 1) if (A[:, c] > 128).any()]
    top = float(np.median([np.argmax(A[:, c] > 128) for c in cols]))
    bot_c = float(np.median([A.shape[0] - np.argmax(A[::-1, c] > 128) for c in cols]))
    if seam_mode == 'centre':                       # thin line mouths: lip line = middle of the line at the centre
        seam = (top + bot_c) / 2
    else:                                           # darkest row 20-80% height, columns 8-25% off centre
        sc = [c for c in range(x0, x1) if 0.08 * w <= abs(c - cx) <= 0.25 * w]
        lum = (rgba[:, sc, :3].astype(np.float32) @ np.array([.299, .587, .114])).mean(1)
        r0, r1 = int(y0 + 0.2 * h), int(y0 + 0.8 * h)
        seam = float(r0 + int(np.argmin(lum[r0:r1])))
    return dict(bbox=[int(x0), int(y0), int(w), int(h)], cx=float(cx), top=top, seam=seam)


def shadow_layer(alpha):
    """soft contact shadow from the mouth alpha: tight occlusion ring + soft drop below (warm clay dark)"""
    a = alpha.astype(np.float32) / 255
    t = nd.gaussian_filter(a, SHADOW['tight_sigma']) * SHADOW['tight_alpha'] * 1.6
    d = nd.gaussian_filter(np.roll(a, SHADOW['drop_dy'], axis=0), SHADOW['drop_sigma']) * SHADOW['drop_alpha'] * 1.4
    s = np.clip(np.maximum(t, d), 0, max(SHADOW['tight_alpha'], SHADOW['drop_alpha']))
    out = np.zeros(alpha.shape + (4,), np.uint8)
    out[..., :3] = SHADOW['color']; out[..., 3] = (s * 255).astype(np.uint8)
    return Image.fromarray(out)


def place(rgba, ox, oy, with_shadow):
    can = Image.new('RGBA', CANVAS, (0, 0, 0, 0))
    can.alpha_composite(Image.fromarray(rgba), (ox, oy))
    mouth = Image.fromarray(fix_hidden_rgb(np.array(can)))
    if not with_shadow: return mouth
    base = shadow_layer(np.array(mouth)[..., 3])
    base.alpha_composite(mouth)
    return base


def main():
    fb_budget_px = LIMIT_RATIO * 116 * (FB_OLD_MOUTH_W / 332)       # A closed (116x332) on FB, x1.7
    for d, cfg in DESIGNS.items():
        cuts = cut_sheet(os.path.join(SRC, cfg['sheet']))
        assert len(cuts) == 12, (d, len(cuts))
        od = os.path.join(ROOT, d)
        for sub in ('', 'noshadow', 'trim'): os.makedirs(os.path.join(od, sub), exist_ok=True)
        for fn in os.listdir(od):
            if fn.endswith('.png'): os.remove(os.path.join(od, fn))
        raw = {mid: dict(rgba=c['rgba'], sheet_xy=c['sheet_xy'], m=measure(c['rgba'], cfg['seam_mode'])) for mid, c in zip(cfg['ids'], cuts)}
        mc = raw['closed']['m']; hc = mc['bbox'][3]; wc = mc['bbox'][2]
        fb_scale = FB_OLD_MOUTH_W / wc
        limit_h = LIMIT_RATIO * hc if d in ('A', 'B') else fb_budget_px / fb_scale
        seam_rel_c = mc['seam'] - mc['top']
        hc_c = mc['bbox'][1] + mc['bbox'][3] - mc['top']
        closed_top_canvas = ANCHOR[1] - seam_rel_c
        entries = []
        for mid in cfg['ids']:
            r = raw[mid]; h_full = r['m']['bbox'][3]
            sy = min(1.0, limit_h / h_full)
            sy = 1.0 if sy > 0.995 else sy
            versions = [(mid, sy)] + ([(mid + '_full', 1.0)] if sy < 0.95 else [])   # _full only when the squash is visible
            for vid, s in versions:
                rgba = squash(r['rgba'], s) if s < 1.0 else fix_hidden_rgb(r['rgba'])
                m = measure(rgba, cfg['seam_mode'])
                bx, by, bw, bh = m['bbox']
                if mid in cfg['closed_family']:
                    mode, extra = 'seam', 0.0
                    oy = int(round(ANCHOR[1] - m['seam']))
                else:
                    mode = 'lift'
                    extra = max(0.0, (by + bh - m['top']) - hc_c)
                    oy = int(round(closed_top_canvas - LIFT_BAKED * extra - m['top']))
                ox = int(round(ANCHOR[0] - m['cx']))
                place(rgba, ox, oy, True).save(os.path.join(od, vid + '.png'))
                place(rgba, ox, oy, False).save(os.path.join(od, 'noshadow', vid + '.png'))
                Image.fromarray(rgba).save(os.path.join(od, 'trim', vid + '.png'))
                arr = np.array(place(rgba, ox, oy, False))
                entries.append(dict(
                    id=vid, file=f'{vid}.png', noshadow=f'noshadow/{vid}.png', trim=f'trim/{vid}.png',
                    use_as=cfg['use_as'].get(mid, ''), variant_of=mid if vid != mid else None,
                    squash_y=round(s, 3), squashed=s < 1.0, canvas=list(CANVAS), offset=[ox, oy],
                    bbox_canvas=[ox + bx, oy + by, bw, bh], bbox_trim=[bx, by, bw, bh],
                    height_ratio_to_closed=round(bh / hc, 3), width_ratio_to_closed=round(bw / wc, 3),
                    height_full_ratio_to_closed=round(h_full / hc, 3),
                    anchor_mode=mode, upper_lip_top_canvas=round(oy + m['top'], 1), lip_line_canvas=round(oy + m['seam'], 1),
                    extra_height_px=round(extra, 1),
                    dy_from_baked={str(L): round(-(L - LIFT_BAKED) * extra, 1) for L in [0.0] + LIFT_TESTED},
                    fb_height_px_at_1x=round(bh * fb_scale, 1),
                    sheet_bbox=[r['sheet_xy'][0] + r['m']['bbox'][0], r['sheet_xy'][1] + r['m']['bbox'][1]] + r['m']['bbox'][2:],
                    red_px_outside=int(((arr[..., 3] > 0) & (arr[..., 0] > 200) & (arr[..., 1] < 50)).sum())))
        meta = dict(
            design=d, note=cfg['note'], source=f"media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs ({cfg['sheet']})",
            canvas=list(CANVAS), scale='native GPT sheet pixels; only tall shapes squashed vertically',
            anchor=dict(x=ANCHOR[0], y=ANCHOR[1], closed_upper_lip_top_y=round(closed_top_canvas, 1),
                        rule='Canvas anchor = horizontal centre + LIP LINE (mouth centre) of closed; headroom above. '
                             'Closed shapes (anchor_mode seam) put their lip line on the anchor. Open shapes (anchor_mode lift) '
                             'grow up AND down: upper-lip top = closed upper-lip top - upperLift * extra_height_px, the rest of '
                             'the extra height goes down.'),
            upperLift=dict(value=LIFT_BAKED, value_baked=LIFT_BAKED, range=[0.0, 1.0], tested=LIFT_TESTED,
                           rule='dy = -(upperLift - value_baked) * extra_height_px relative to the baked PNG (dy_from_baked)'),
            height_limit=dict(max_px=round(limit_h, 1), ratio_to_closed=round(limit_h / hc, 3),
                              rule=('<= 1.7 x closed height' if d in ('A', 'B') else
                                    'closed is a single line, so x closed is meaningless: same absolute face budget as A '
                                    '(1.7 x A-closed height on FrizzleBob = %.1f px at the 452px panel)' % fb_budget_px),
                              originals='*_full.png = unsquashed original'),
            shadow=dict(SHADOW, note='baked under the mouth in X.png; noshadow/X.png without'),
            fb=dict(closed_width_equals_old_mouth_px=FB_OLD_MOUTH_W, scale_to_fb_panel=round(fb_scale, 4)),
            closed_height_px=hc, closed_width_px=wc, mouths=entries)
        json.dump(meta, open(os.path.join(od, 'anchors.json'), 'w'), indent=1)
        print(d, 'closed', wc, 'x', hc, 'limit_h', round(limit_h, 1), 'fb_scale', round(fb_scale, 3))
        for e in entries:
            print(f"  {e['id']:18s} h/c {e['height_ratio_to_closed']:5.2f} (full {e['height_full_ratio_to_closed']:5.2f}) sy {e['squash_y']:.2f}"
                  f" FBpx {e['fb_height_px_at_1x']:5.1f} top {e['upper_lip_top_canvas']} line {e['lip_line_canvas']} bbox {e['bbox_canvas']} red {e['red_px_outside']}")


if __name__ == '__main__':
    main()
