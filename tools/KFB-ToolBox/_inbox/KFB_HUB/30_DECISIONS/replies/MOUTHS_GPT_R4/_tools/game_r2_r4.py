#!/usr/bin/env python3
"""MOUTHS_GPT_R4 -> Spiel-Format R2 (wie src/assets/actors/mouths-gpt-a|b), V-1817.
Eingang: ../<typ>/trim/<form>.png (Schnitt aus cut_align_r4.py). Ausgang: ../game/<typ>/ (<form>.png mit Schatten, noshadow/, trim/, anchors.json).
Aus R2 importiert und unveraendert: measure, fix_hidden_rgb, place (Schatten), shadow_layer, ANCHOR (256, 220), LIFT_BAKED 0.35, LIMIT_RATIO 1.7, SHADOW.
Neu nur:
  1. gleichmaessige Skalierung je Typ (x und y gleich), bis closed so breit ist wie closed von Satz A (332 px) -> gleiche ToolBox-Groesse wie gpt_a_r2.
  2. Hoehengrenze fuer flache Ruheformen: 1,7 x max(closed-Hoehe, REF x closed-Breite); REF = Median des closed-Seitenverhaeltnisses
     der sechs Brief-Typen. Duenne Lippen (sausage_coral, yellow_buck) werden so nicht wegen ihrer flachen Ruheform gestaucht.
  3. ERSATZ: kaputte Zellen werden nicht ausgeliefert (sausage_coral fv, disgust); das Spiel nimmt die Ersatzform (mundSaetze.js ERSATZ).
Aufruf:  python3 game_r2_r4.py [typ ...]
"""
import json, os, sys
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), 'MOUTHS_GPT_R2', '_tools'))
import cut_align as r2   # noqa: E402  (nur Funktionen und Konstanten, main() laeuft nicht)

TYPEN = ['round_clay', 'full_soft', 'buck_grin', 'yellow_buck', 'sausage', 'sausage_coral', 'crooked_rogue', 'monster_maw']
BRIEF_TYPEN = ['round_clay', 'buck_grin', 'full_soft', 'sausage', 'crooked_rogue', 'monster_maw']
FORMEN = ['closed', 'mbp', 'small_open', 'mid_open', 'ah', 'ee_wide', 'oh', 'oo', 'fv', 'l_th',
          'smile_closed', 'smile_teeth', 'laugh', 'smirk', 'grimace', 'sad', 'angry', 'surprised', 'scared', 'disgust']
CLOSED_FAMILY = ['closed', 'mbp', 'smile_closed']
ERSATZ = {'sausage_coral': {'fv': 'l_th', 'disgust': 'grimace'}}
LABEL = {'round_clay': 'Rund, Rosé, Zahnlücke', 'full_soft': 'Voll, Mauve, Zahnlücke', 'buck_grin': 'Braun, Hasenzähne',
         'yellow_buck': 'Gelb, Hasenzähne', 'sausage': 'Tomatenrot, drei Zähne', 'sausage_coral': 'Koralle-Wurstlippe, Zahnlücke',
         'crooked_rogue': 'Gauner, Eckzahn', 'monster_maw': 'Monster violett, Spitzzähne'}
TARGET_W = 332   # closed_width_px von mouths-gpt-a (Satz A)


def lade(typ, f):
    return np.array(Image.open(os.path.join(ROOT, typ, 'trim', f + '.png')).convert('RGBA'))


def skaliere(rgba, s):
    im = Image.fromarray(rgba).convert('RGBa')
    im = im.resize((max(1, int(round(rgba.shape[1] * s))), max(1, int(round(rgba.shape[0] * s)))), Image.LANCZOS).convert('RGBA')
    return r2.fix_hidden_rgb(np.array(im))


def ref_seitenverhaeltnis():
    v = []
    for t in BRIEF_TYPEN:
        m = r2.measure(lade(t, 'closed'), 'darkest'); v.append(m['bbox'][3] / m['bbox'][2])
    return float(np.median(v))


def run(typ, REF):
    od = os.path.join(ROOT, 'game', typ)
    for sub in ('', 'noshadow', 'trim'): os.makedirs(os.path.join(od, sub), exist_ok=True)
    wc0 = r2.measure(lade(typ, 'closed'), 'darkest')['bbox'][2]; s = TARGET_W / wc0
    raw = {}
    for f in FORMEN:
        rgba = skaliere(lade(typ, f), s); raw[f] = dict(rgba=rgba, m=r2.measure(rgba, 'darkest'))
    mc = raw['closed']['m']; hc, wc = mc['bbox'][3], mc['bbox'][2]
    limit_h = r2.LIMIT_RATIO * max(hc, REF * wc)
    seam_rel_c = mc['seam'] - mc['top']; hc_c = mc['bbox'][1] + mc['bbox'][3] - mc['top']; closed_top_canvas = r2.ANCHOR[1] - seam_rel_c
    ers = ERSATZ.get(typ, {}); entries = []
    for f in FORMEN:
        if f in ers: continue
        r = raw[f]; h_full = r['m']['bbox'][3]; sy = min(1.0, limit_h / h_full); sy = 1.0 if sy > 0.995 else sy
        rgba = r2.squash(r['rgba'], sy) if sy < 1.0 else r['rgba']; m = r2.measure(rgba, 'darkest'); bx, by, bw, bh = m['bbox']
        if f in CLOSED_FAMILY:
            mode, extra = 'seam', 0.0; oy = int(round(r2.ANCHOR[1] - m['seam']))
        else:
            mode = 'lift'; extra = max(0.0, (by + bh - m['top']) - hc_c); oy = int(round(closed_top_canvas - r2.LIFT_BAKED * extra - m['top']))
        ox = int(round(r2.ANCHOR[0] - m['cx']))
        r2.place(rgba, ox, oy, True).save(os.path.join(od, f + '.png'), optimize=True)
        nos = r2.place(rgba, ox, oy, False); nos.save(os.path.join(od, 'noshadow', f + '.png'), optimize=True)
        Image.fromarray(rgba).save(os.path.join(od, 'trim', f + '.png'), optimize=True)
        a = np.array(nos)[..., 3]; ys, xs = np.nonzero(a > 0)
        rand = bool(ys.min() == 0 or xs.min() == 0 or ys.max() == a.shape[0] - 1 or xs.max() == a.shape[1] - 1)
        entries.append(dict(id=f, file=f'{f}.png', noshadow=f'noshadow/{f}.png', trim=f'trim/{f}.png', squash_y=round(sy, 3), squashed=sy < 1.0,
                            canvas=list(r2.CANVAS), offset=[ox, oy], bbox_canvas=[ox + bx, oy + by, bw, bh], height_ratio_to_closed=round(bh / hc, 3),
                            width_ratio_to_closed=round(bw / wc, 3), height_to_closed_width=round(bh / wc, 3), anchor_mode=mode,
                            upper_lip_top_canvas=round(oy + m['top'], 1), lip_line_canvas=round(oy + m['seam'], 1), extra_height_px=round(extra, 1),
                            dy_from_baked={str(L): round(-(L - r2.LIFT_BAKED) * extra, 1) for L in [0.0] + r2.LIFT_TESTED}, touches_canvas_edge=rand))
    meta = dict(design='r4_' + typ, label=LABEL[typ], note='MOUTHS_GPT_R4 (V-1765/V-1817), Georg q705', source=f'replies/MOUTHS_GPT_R4/_src/mouths_r4_{typ}.png',
                canvas=list(r2.CANVAS), scale=dict(factor=round(s, 4), rule=f'gleichmaessig x=y, closed-Breite {wc0} -> {TARGET_W} px (= Satz A)'),
                anchor=dict(x=r2.ANCHOR[0], y=r2.ANCHOR[1], closed_upper_lip_top_y=round(closed_top_canvas, 1),
                            rule='wie R2: closed-Familie (closed, mbp, smile_closed) Lippenlinie auf den Anker; offene Formen: Oberlippe = closed-Oberlippe - upperLift * extra'),
                upperLift=dict(value=r2.LIFT_BAKED, value_baked=r2.LIFT_BAKED, range=[0.0, 1.0], tested=r2.LIFT_TESTED,
                               rule='dy = -(upperLift - value_baked) * extra_height_px relative to the baked PNG (dy_from_baked)'),
                height_limit=dict(max_px=round(limit_h, 1), ratio_to_closed=round(limit_h / hc, 3), ref_closed_aspect=round(REF, 3),
                                  rule='1,7 x max(closed-Hoehe, REF x closed-Breite); REF = Median closed-Seitenverhaeltnis der sechs Brief-Typen'),
                shadow=dict(r2.SHADOW, note='unter dem Mund eingebacken in X.png; noshadow/X.png ohne'),
                ersatz=ers, closed_height_px=hc, closed_width_px=wc, mouths=entries)
    json.dump(meta, open(os.path.join(od, 'anchors.json'), 'w'), indent=1, ensure_ascii=False)
    gest = [e['id'] for e in entries if e['squashed']]; rand = [e['id'] for e in entries if e['touches_canvas_edge']]
    hmax = max(entries, key=lambda e: e['height_to_closed_width'])
    print(f"{typ:14s} s {s:.3f} closed {wc}x{hc} limit {limit_h:.0f} | hoechste {hmax['id']} {hmax['height_ratio_to_closed']:.2f}x closed | gestaucht {gest} | Rand {rand} | ersatz {ers}")
    return dict(gestaucht=gest, rand=rand)


if __name__ == '__main__':
    REF = ref_seitenverhaeltnis(); print('REF closed h/w', round(REF, 3))
    for t in (sys.argv[1:] or TYPEN): run(t, REF)
