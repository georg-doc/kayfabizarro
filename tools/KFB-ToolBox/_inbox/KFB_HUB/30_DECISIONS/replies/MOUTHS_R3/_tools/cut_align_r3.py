#!/usr/bin/env python3
"""MOUTHS_R3: three new sheets (16.10., main ea603d31d) through the R2 pipeline.

Same code path as MOUTHS_GPT_R2/_tools/cut_align.py: measure / squash / fix_hidden_rgb / place / shadow_layer
and all constants (ANCHOR, LIFT_BAKED 0.35, LIMIT_RATIO 1.7, SHADOW, FB budget) are IMPORTED from R2.
Only two adapters are new:
  1. key_white(): sheets on white without alpha -> alpha from the border-connected white background
     (flood fill, so cream teeth inside the lips stay opaque; label text is dropped later by the area filter).
  2. cut_sheet_rows(): R2 cut_sheet with the row count as a parameter (R2 hard-codes 3 rows = 4x3).
usage: python3 cut_align_r3.py   (paths relative to the MOUTHS_R3 folder)
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, '_src')
R2_TOOLS = os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R2', '_tools')
sys.path.insert(0, R2_TOOLS)
import cut_align as r2  # noqa: E402  (R2 module: functions + constants, main() not run)

COMMIT = 'ea603d31d'
REPO_DIR = 'media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs'

SETS = {
  'monster_lila_r3': dict(
    sheet='monster_lila.png', grid=(4, 3), bg='white',
    source_name='Lila Monster-Mundausdrücke als Animationsvorlage.png',
    label='Monster lila (Reißzähne)', note='Lila Knet-Lippen, Reisszaehne, Monster-Rachen; 4x3 auf Weiss',
    ids=['closed', 'mbp', 'small_open', 'mid_open', 'ah', 'smile_teeth', 'oh', 'oo',
         'fangs_peek', 'grumpy', 'snarl', 'smirk'],
    closed_family=['closed', 'mbp'], seam_mode='darkest', limit='ratio',
    use_as={'closed': 'X rest', 'mbp': 'MBP (pressed, slightly fuller than closed)', 'small_open': 'C small open (4 fangs)',
            'mid_open': 'C/D half open', 'ah': 'D AA wide open (tongue)', 'smile_teeth': 'reaction grin (two fang rows)',
            'oh': 'E OH tall oval', 'oo': 'F OO small round', 'fangs_peek': 'B EE/S stand-in (lips parted, fangs peek)',
            'grumpy': 'reaction grumpy / clenched teeth (also B EE/S)', 'snarl': 'reaction snarl (teeth bared, slightly open)',
            'smirk': 'reaction smirk (asymmetric, one side open)'}),
  'clay_yellow_r3': dict(
    sheet='clay_yellow.png', grid=(5, 4), bg='white',
    source_name='YELLOW_Clay-Mundvisemen für Lippen-Synchronisation.png',
    label='Knete gelb (FrizzleBob-Viseme)', note='FrizzleBob-gelbe Knet-Lippen, Zahnreihe, 20 beschriftete Formen; 5x4 auf Weiss',
    ids=['closed', 'smile_teeth', 'ah', 'eh', 'oh', 'oo', 'clench', 'fv', 'mbp', 'th',
         'l', 'd', 's_z', 'ch_j', 'r', 'sad', 'surprised', 'tongue_out', 'smirk', 'angry'],
    sheet_labels=['REST', 'SMILE', 'A', 'E', 'O', 'U', 'CLENCH', 'F/V', 'M/B/P', 'TH',
                  'L', 'D', 'S/Z', 'CH/J', 'R', 'SAD', 'SURPRISED', 'TONGUE', 'SMIRK', 'ANGRY'],
    closed_family=['closed', 'mbp'], seam_mode='darkest', limit='ratio',
    use_as={'closed': 'X rest (sheet label REST)', 'smile_teeth': 'reaction smile with teeth (label SMILE)',
            'ah': 'D AA wide open (label A)', 'eh': 'C/D open with both teeth rows (label E; more EH than a wide EE)',
            'oh': 'E OH round (label O)', 'oo': 'F OO pucker (label U)', 'clench': 'B EE/S clenched (label CLENCH)',
            'fv': 'G F/V upper teeth on lower lip (label F/V)', 'mbp': 'MBP pressed (label M/B/P)',
            'th': 'H L/TH tongue behind upper teeth (label TH)', 'l': 'H L slightly open, upper teeth (label L)',
            'd': 'C D/T/N slightly open (label D)', 's_z': 'B S/Z teeth almost together (label S/Z)',
            'ch_j': 'B CH/J teeth, lips forward (label CH/J)', 'r': 'R asymmetric (label R)', 'sad': 'reaction sad',
            'surprised': 'reaction surprised', 'tongue_out': 'reaction tongue out (fun shape, not for talk)',
            'smirk': 'reaction smirk / sly grin', 'angry': 'reaction angry, teeth bared'}),
  'clay_neutral_r3': dict(
    sheet='clay_neutral.png', grid=(4, 4), bg='alpha',
    source_name='NEUTRAL_Claymation-Mund-Sprite-Sheet in 4×4 Raster.png',
    label='Knete neutral (lippenlos, für jede Hautfarbe)',
    note='Lippenloser Mund-Einsatz: dunkelbrauner Rand, Zaehne, roter Rachen; 4x4 nach V-255-Reihenfolge; Alpha vorhanden',
    ids=['closed', 'mbp', 'small_open', 'mid_open', 'ah', 'ee', 'oh', 'oo',
         'fv', 'l_th', 'smile_closed', 'smile_teeth', 'sad', 'surprised', 'grumpy', 'smirk_tongue'],
    closed_family=['closed', 'mbp', 'smile_closed', 'grumpy'], seam_mode='centre_gap', limit='face_budget', repaint_band=False,
    use_as={'closed': 'X rest (teeth together, thin)', 'mbp': 'MBP slot (teeth together, slightly taller; lipless = no pressed lips)',
            'small_open': 'C small open', 'mid_open': 'C/D half open', 'ah': 'D AA wide open', 'ee': 'B EE wide, both rows',
            'oh': 'E OH tall round', 'oo': 'F OO small round', 'fv': 'G F/V upper teeth on dark lower edge',
            'l_th': 'H L/TH tongue tip behind upper teeth', 'smile_closed': 'reaction smile (teeth together, curved)',
            'smile_teeth': 'reaction open smile with teeth', 'sad': 'reaction sad (frown arc, upper teeth)',
            'surprised': 'reaction surprised (tall open)', 'grumpy': 'reaction grumpy (clenched, wavy)',
            'smirk_tongue': 'signature: sly smirk, tongue in the corner'}),
}


def key_white(path):
    """white background -> alpha. Background = near-white AND low saturation AND connected to the sheet border."""
    a = np.array(Image.open(path).convert('RGB')).astype(np.int16)
    mn, mx = a.min(2), a.max(2)
    whiteish = (mn >= 228) & ((mx - mn) <= 24)
    lab, _ = nd.label(whiteish)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bg = np.isin(lab, border[border > 0])
    fg = ~bg
    # soft edge from whiteness on the 1px ring (the R2 cut then erodes + blurs and repaints edge RGB from the interior)
    alpha = np.where(fg, 255, 0).astype(np.float32)
    ring = fg & nd.binary_dilation(bg, iterations=1)
    lum = mn.astype(np.float32)
    alpha[ring] = np.clip((255 - lum[ring]) / (255 - 200) * 255, 0, 255)
    return np.dstack([a.astype(np.uint8), alpha.astype(np.uint8)])


_R2_FIX_HIDDEN = r2.fix_hidden_rgb


def fix_hidden_rgb_clean(arr):
    """for sheets with a clean straight alpha (neutral): keep the real RGB of semi-transparent edge pixels (the dark rim)
    and only fill fully hidden pixels (alpha < 4) from the nearest visible pixel. R2's version repaints every pixel
    below alpha 250 from the solid interior, which is right for GPT fringes but smears teeth colour over a thin rim."""
    a = arr.astype(np.float32)
    al = a[..., 3]; al[al < 4] = 0
    vis = al >= 4
    if vis.any():
        _, (iy, ix) = nd.distance_transform_edt(~vis, return_indices=True)
        m = ~vis
        a[..., :3][m] = a[..., :3][iy[m], ix[m]]
    return np.clip(a, 0, 255).astype(np.uint8)


def measure_r3(rgba, seam_mode):
    """R2 measure; extra seam mode 'centre_gap' for the lipless set: the dark RIM is the darkest row there, so R2
    'darkest' lands on the rim of curved shapes. centre_gap = darkest row in the central columns (+-8% w) between
    25% and 75% of the local column extent (= gap between the teeth rows at the mouth centre)."""
    if seam_mode != 'centre_gap':
        return r2.measure(rgba, seam_mode)
    m = r2.measure(rgba, 'centre')
    A = rgba[..., 3].astype(np.float32)
    x0, _, w, _ = m['bbox']; cx = m['cx']
    cols = [c for c in range(int(cx - 0.08 * w), int(cx + 0.08 * w) + 1) if (A[:, c] > 128).any()]
    t = int(np.median([np.argmax(A[:, c] > 128) for c in cols]))
    b = int(np.median([A.shape[0] - np.argmax(A[::-1, c] > 128) for c in cols]))
    lum = (rgba[:, cols, :3].astype(np.float32) @ np.array([.299, .587, .114])).mean(1)
    r0, r1 = t + int(0.25 * (b - t)), t + max(int(0.75 * (b - t)), int(0.25 * (b - t)) + 1)
    m['seam'] = float(r0 + int(np.argmin(lum[r0:r1])))
    return m


def cut_sheet_rows(rgba_u8, rows, n_expected, repaint_band=True):
    """R2 cut_sheet, unchanged except: row count is a parameter, the input is an array, and the edge-band repaint
    (R2 fix for GPT green/red fringes) can be switched off for sheets with a clean source alpha whose dark rim IS the
    edge (neutral set: repainting the band smeared teeth colour over the thin rim)."""
    a = rgba_u8.astype(np.float32)
    A = a[..., 3]
    core = A > 128
    lab, n = nd.label(core)
    area = nd.sum(core, lab, range(1, n + 1))
    objs = nd.find_objects(lab)
    big = [i for i in range(n) if area[i] > 5000]
    big.sort(key=lambda i: (int(((objs[i][0].start + objs[i][0].stop) / 2) // (a.shape[0] / rows)), (objs[i][1].start + objs[i][1].stop) / 2))
    assert len(big) == n_expected, (len(big), n_expected)
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
        bad = ((band & ((A < 250) | reddish)) | ~support) if repaint_band else ~support
        _, (iy, ix) = nd.distance_transform_edt(~solid, return_indices=True)
        rgb[bad] = a[..., :3][iy[bad], ix[bad]]
        y0, y1 = max(0, sl[0].start - 4), min(a.shape[0], sl[0].stop + 4)
        x0, x1 = max(0, sl[1].start - 4), min(a.shape[1], sl[1].stop + 4)
        # keep only this mouth inside its crop (neighbours never overlap in these sheets, but be strict)
        crop = np.clip(np.dstack([rgb, alpha])[y0:y1, x0:x1], 0, 255).astype(np.uint8)
        crop[..., 3] = (crop[..., 3] * support[y0:y1, x0:x1]).astype(np.uint8)
        out.append(dict(rgba=crop, sheet_xy=(x0, y0)))
    return out


def edge_stats(arr):
    """fringe check on the shadow-free canvas: semi-transparent edge pixels that are near-white / near-green / reddish."""
    al = arr[..., 3]; rgb = arr[..., :3].astype(np.int16)
    edge = (al > 0) & (al < 250)
    mn, mx = rgb.min(2), rgb.max(2)
    white = edge & (mn > 215) & ((mx - mn) < 30)
    green = edge & (rgb[..., 1] > rgb[..., 0] + 40) & (rgb[..., 1] > rgb[..., 2] + 40)
    return int(white.sum()), int(green.sum()), int(edge.sum())


def tint_mask(arr):
    """neutral set: rim mask (dark brown outer edge = the only 'skin-side' colour) -> 0..255 grey PNG."""
    al = arr[..., 3].astype(np.float32)
    rgb = arr[..., :3].astype(np.float32)
    lum = rgb @ np.array([.299, .587, .114])
    inside = al > 128
    outer = inside & ~nd.binary_erosion(inside, iterations=14)
    dark = (lum < 75) & ((rgb.max(2) - rgb.min(2)) < 60)
    m = (outer & dark) | ((al > 0) & ~nd.binary_erosion(inside, iterations=3))
    m = nd.gaussian_filter(m.astype(np.float32), 0.8) * (al / 255)
    return Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8))


def main():
    CANVAS, ANCHOR, LIFT_BAKED, LIFT_TESTED, LIMIT_RATIO = r2.CANVAS, r2.ANCHOR, r2.LIFT_BAKED, r2.LIFT_TESTED, r2.LIMIT_RATIO
    fb_budget_px = LIMIT_RATIO * 116 * (r2.FB_OLD_MOUTH_W / 332)       # identical to R2 (A closed 116x332 on FB, x1.7)
    report = {}
    for sid, cfg in SETS.items():
        sp = os.path.join(SRC, cfg['sheet'])
        if cfg['bg'] == 'white':
            rgba = key_white(sp)
            Image.fromarray(rgba).save(os.path.join(SRC, cfg['sheet'].replace('.png', '_keyed.png')))
        else:
            rgba = np.array(Image.open(sp).convert('RGBA'))
        r2.fix_hidden_rgb = _R2_FIX_HIDDEN if cfg.get('repaint_band', True) else fix_hidden_rgb_clean
        cols, rows = cfg['grid']
        cuts = cut_sheet_rows(rgba, rows, cols * rows, cfg.get('repaint_band', True))
        od = os.path.join(ROOT, sid)
        subs = ('', 'noshadow', 'trim') + (('tintmask',) if sid == 'clay_neutral_r3' else ())
        for sub in subs: os.makedirs(os.path.join(od, sub), exist_ok=True)
        raw = {mid: dict(rgba=c['rgba'], sheet_xy=c['sheet_xy'], m=measure_r3(c['rgba'], cfg['seam_mode'])) for mid, c in zip(cfg['ids'], cuts)}
        mc = raw['closed']['m']; hc = mc['bbox'][3]; wc = mc['bbox'][2]
        fb_scale = r2.FB_OLD_MOUTH_W / wc
        limit_h = LIMIT_RATIO * hc if cfg['limit'] == 'ratio' else fb_budget_px / fb_scale
        seam_rel_c = mc['seam'] - mc['top']
        hc_c = mc['bbox'][1] + mc['bbox'][3] - mc['top']
        closed_top_canvas = ANCHOR[1] - seam_rel_c
        entries = []
        for mid in cfg['ids']:
            r = raw[mid]; h_full = r['m']['bbox'][3]
            sy = min(1.0, limit_h / h_full)
            sy = 1.0 if sy > 0.995 else sy
            versions = [(mid, sy)] + ([(mid + '_full', 1.0)] if sy < 0.95 else [])
            for vid, s in versions:
                im = r2.squash(r['rgba'], s) if s < 1.0 else r2.fix_hidden_rgb(r['rgba'])  # module attr: R2 or clean variant
                m = measure_r3(im, cfg['seam_mode'])
                bx, by, bw, bh = m['bbox']
                if mid in cfg['closed_family']:
                    mode, extra = 'seam', 0.0
                    oy = int(round(ANCHOR[1] - m['seam']))
                else:
                    mode = 'lift'
                    extra = max(0.0, (by + bh - m['top']) - hc_c)
                    oy = int(round(closed_top_canvas - LIFT_BAKED * extra - m['top']))
                ox = int(round(ANCHOR[0] - m['cx']))
                if oy + by < 0 or oy + by + bh > CANVAS[1] or ox + bx < 0 or ox + bx + bw > CANVAS[0]:
                    raise SystemExit(f'{sid}/{vid} leaves the canvas: {ox},{oy} {m["bbox"]}')
                r2.place(im, ox, oy, True).save(os.path.join(od, vid + '.png'))
                nos = r2.place(im, ox, oy, False); nos.save(os.path.join(od, 'noshadow', vid + '.png'))
                Image.fromarray(im).save(os.path.join(od, 'trim', vid + '.png'))
                arr = np.array(nos)
                if sid == 'clay_neutral_r3':
                    tint_mask(arr).save(os.path.join(od, 'tintmask', vid + '.png'))
                wpx, gpx, epx = edge_stats(arr)
                e = dict(
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
                    red_px_outside=int(((arr[..., 3] > 0) & (arr[..., 0] > 200) & (arr[..., 1] < 50)).sum()),
                    fringe_white_px=wpx, fringe_green_px=gpx, edge_px=epx)
                if 'sheet_labels' in cfg:
                    e['sheet_label'] = cfg['sheet_labels'][cfg['ids'].index(mid)]
                if sid == 'clay_neutral_r3':
                    e['tintmask'] = f'tintmask/{vid}.png'
                entries.append(e)
        meta = dict(
            design=sid, note=cfg['note'],
            source=f"{REPO_DIR}/{cfg['source_name']} @ main {COMMIT}",
            canvas=list(CANVAS), scale='native sheet pixels; only tall shapes squashed vertically',
            grid=dict(cols=cfg['grid'][0], rows=cfg['grid'][1], background=cfg['bg']),
            anchor=dict(x=ANCHOR[0], y=ANCHOR[1], closed_upper_lip_top_y=round(closed_top_canvas, 1),
                        rule='Canvas anchor = horizontal centre + LIP LINE (mouth centre) of closed; headroom above. '
                             'Closed shapes (anchor_mode seam) put their lip line on the anchor. Open shapes (anchor_mode lift) '
                             'grow up AND down: upper-lip top = closed upper-lip top - upperLift * extra_height_px, the rest of '
                             'the extra height goes down.'),
            upperLift=dict(value=LIFT_BAKED, value_baked=LIFT_BAKED, range=[0.0, 1.0], tested=LIFT_TESTED,
                           rule='dy = -(upperLift - value_baked) * extra_height_px relative to the baked PNG (dy_from_baked)'),
            height_limit=dict(max_px=round(limit_h, 1), ratio_to_closed=round(limit_h / hc, 3),
                              rule=('<= 1.7 x closed height' if cfg['limit'] == 'ratio' else
                                    'closed is a thin teeth strip (lipless), so x closed is meaningless: same absolute face budget '
                                    'as A / C (1.7 x A-closed height on FrizzleBob = %.1f px at the 452px panel)' % fb_budget_px),
                              originals='*_full.png = unsquashed original'),
            width_rule='native widths kept (no horizontal rescale); width_ratio_to_closed per shape documents V-255 "same width"',
            shadow=dict(r2.SHADOW, note='baked under the mouth in X.png; noshadow/X.png without'),
            fb=dict(closed_width_equals_old_mouth_px=r2.FB_OLD_MOUTH_W, scale_to_fb_panel=round(fb_scale, 4)),
            closed_height_px=hc, closed_width_px=wc, mouths=entries)
        json.dump(meta, open(os.path.join(od, 'anchors.json'), 'w'), indent=1, ensure_ascii=False)
        print(sid, 'closed', wc, 'x', hc, 'limit_h', round(limit_h, 1), 'fb_scale', round(fb_scale, 3))
        for e in entries:
            print(f"  {e['id']:18s} h/c {e['height_ratio_to_closed']:5.2f} (full {e['height_full_ratio_to_closed']:5.2f}) w/c {e['width_ratio_to_closed']:4.2f} sy {e['squash_y']:.2f}"
                  f" top {e['upper_lip_top_canvas']} line {e['lip_line_canvas']} bbox {e['bbox_canvas']} red {e['red_px_outside']} white {e['fringe_white_px']}/{e['edge_px']}")
        report[sid] = meta
    return report


if __name__ == '__main__':
    main()
