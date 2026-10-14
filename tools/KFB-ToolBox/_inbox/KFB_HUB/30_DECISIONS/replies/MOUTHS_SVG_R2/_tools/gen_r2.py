#!/usr/bin/env python3
"""KFB mouth set R2 - one SVG per mouth shape, with soft clay shading (gradients only, no filters).
viewBox 0 0 256 128, anchor = mouth centre at (128,64). Same 12 ids/proportions as R1.
Variant switches:  --lip thin|full   --teeth row|gap|none
usage: gen_r2.py <svg_out_dir> [--lip full] [--teeth row] [--json shapes.json]"""
import os, sys, json, math, re, argparse

ap = argparse.ArgumentParser()
ap.add_argument('out'); ap.add_argument('--lip', default='full', choices=['thin', 'full'])
ap.add_argument('--teeth', default='row', choices=['row', 'gap', 'none']); ap.add_argument('--json')
A = ap.parse_args()
OUT = A.out
os.makedirs(OUT, exist_ok=True)

C = dict(outline="#3A2318", interior="#4E1A20", tongue="#E3828C", teeth="#F4EBD4", lip="#E4B53C")
SW, SW2, SW3 = 8, 5.5, 3.4   # main outline, creases, teeth dividers

# ---------- tiny cubic-path sampler (absolute M/C only) ----------
def segs(d):
    nums = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
    p0 = (nums[0], nums[1]); out = []; i = 2
    while i + 5 < len(nums):
        c1, c2, p3 = (nums[i], nums[i+1]), (nums[i+2], nums[i+3]), (nums[i+4], nums[i+5])
        out.append((p0, c1, c2, p3)); p0 = p3; i += 6
    return out

def bez(s, t):
    (a, b, c, d) = s; u = 1 - t
    x = u**3*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t**3*d[0]
    y = u**3*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t**3*d[1]
    return x, y

def sample(sl, n=40):
    pts = []
    for k, s in enumerate(sl):
        for j in range(n + 1):
            if k and j == 0: continue
            pts.append(bez(s, j / n))
    return pts

def normals(pts, sign=1):
    out = []
    for i in range(len(pts)):
        a = pts[max(i-1, 0)]; b = pts[min(i+1, len(pts)-1)]
        tx, ty = b[0]-a[0], b[1]-a[1]; L = math.hypot(tx, ty) or 1
        out.append((-ty/L*sign, tx/L*sign))
    return out

def poly(pts):
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ' Z'

def lens_pad(d, up=(3, 5), dn=(4, 10)):
    """tapered lip pad around a closed-mouth line: thin upper lip, fuller lower lip"""
    pts = sample(segs(d)); ns = normals(pts); N = len(pts) - 1
    top, bot = [], []
    for i, (p, n) in enumerate(zip(pts, ns)):
        w = math.sin(math.pi * i / N) ** 0.7
        tu = up[0] + (up[1]-up[0]) * w; td = dn[0] + (dn[1]-dn[0]) * w
        top.append((p[0]-n[0]*tu, p[1]-n[1]*tu)); bot.append((p[0]+n[0]*td, p[1]+n[1]*td))
    return poly(top + bot[::-1])

def lowerlip_pad(open_d, t=(4, 13)):
    """fuller lower lip under an open mouth: offset of the bottom contour (segments after the first)"""
    sl = segs(open_d)[1:]
    pts = sample(sl); ns = normals(pts, sign=-1); N = len(pts) - 1
    outer = []
    for i, (p, n) in enumerate(zip(pts, ns)):
        w = math.sin(math.pi * i / N) ** 0.8
        tt = t[0] + (t[1]-t[0]) * w
        outer.append((p[0]+n[0]*tt, p[1]+n[1]*tt))
    return poly(pts + outer[::-1])

def tuck(x, y, side, dy=0, s=.8):
    """small clay corner dimple: short arc just outside the corner, concave toward the mouth"""
    x0 = x + side * 6; h = 7 * s
    return (f'M{x0:.1f},{y-h+dy:.1f} C{x0+side*5*s:.1f},{y-h*.4+dy:.1f} '
            f'{x0+side*5*s:.1f},{y+h*.4+dy:.1f} {x0:.1f},{y+h+dy:.1f}')

def bottom_weight(open_d, extra=3.6, base=3.4):
    """crescent that thickens the outline toward the bottom (clay: heavier lower lip line)"""
    pts = sample(segs(open_d), 30)
    cx = sum(p[0] for p in pts)/len(pts); cy = sum(p[1] for p in pts)/len(pts)
    my = max(p[1] for p in pts)
    ns = normals(pts); outer = []
    for p, n in zip(pts, ns):
        if (p[0]-cx)*n[0] + (p[1]-cy)*n[1] < 0: n = (-n[0], -n[1])
        w = max(0.0, (p[1]-cy)/(my-cy)) ** 0.9
        t = base + extra * w
        outer.append((p[0]+n[0]*t, p[1]+n[1]*t))
    return poly(pts + outer[::-1])

SHAPES = {}
def shape(sid, label, **k):
    base = dict(opening=None, line=None, lens=None, teeth=None, teeth_lo=None, dividers=(), dividers_lo=(),
                tongue=None, groove=None, creases=(), ring=16, lowerlip=None, lowerlip_top=None, lens_pad_cfg=None)
    base.update(k); base['label'] = label; SHAPES[sid] = base

# ---------------- closed shapes ----------------
shape('rest_closed', 'Ruhe, zu',
      line='M56,63 C82,70 118,72 146,70 C170,68 188,63 200,58',
      creases=[tuck(56, 63, -1, 0), tuck(200, 58, 1, -1), 'M106,84 C118,89 138,89 150,84'])

shape('mbp', 'M/B/P (Lippen gepresst)',
      lens='M54,63 C90,58 166,57 202,61 C166,67 92,68 54,63 Z',
      creases=[tuck(54, 63, -1, 0, .9), tuck(202, 61, 1, 0, .9),
               'M96,51 C112,46 146,46 162,51', 'M92,76 C112,84 146,84 166,76'])

shape('smile_closed', 'Lächeln, zu',
      line='M52,50 C75,74 103,82 131,81 C160,80 187,68 205,47',
      creases=[tuck(52, 50, -1, -2, .85), tuck(205, 47, 1, -2, .85), 'M110,95 C121,99 137,99 148,95'])

shape('sad', 'traurig',
      line='M58,78 C77,63 104,58 130,58 C157,58 182,63 199,75',
      creases=[tuck(58, 78, -1, 2, .8), tuck(199, 75, 1, 2, .8)])

shape('grumpy', 'grummelig',
      line='M56,73 C72,63 92,69 110,65 C130,61 146,59 166,65 C182,70 194,67 203,70',
      creases=[tuck(56, 73, -1, 1, .85), tuck(203, 70, 1, 0, .7)])

# ---------------- open shapes ----------------
shape('talk_small', 'Sprechen klein',
      opening='M70,61 C96,54 158,52 186,57 C178,75 154,85 127,85 C101,85 79,77 70,61 Z',
      teeth='M0,0 H256 V57 C178,67 154,69 128,69 C102,69 82,68 0,63 Z',
      dividers=['M107,55 L108,68', 'M134,54 L133,69', 'M160,55 L159,66'],
      tongue='M90,96 C95,81 112,78 131,79 C150,80 164,84 168,96 Z',
      creases=[tuck(70, 61, -1, 0, .75), tuck(186, 57, 1, 0, .75), 'M110,99 C120,103 136,103 146,99'])

shape('talk_open', 'Sprechen offen (Ah)',
      opening='M64,53 C92,45 162,43 192,49 C193,80 166,105 129,105 C94,105 63,85 64,53 Z',
      teeth='M0,0 H256 V50 C188,62 160,65 128,65 C96,65 72,62 0,57 Z',
      dividers=['M103,50 L104,62', 'M128,47 L127,65', 'M153,47 L152,64', 'M175,48 L174,60'],
      tongue='M82,113 C88,92 108,85 129,85 C152,85 170,92 176,113 Z',
      groove='M129,92 C128,97 129,101 130,104',
      creases=[tuck(64, 53, -1, 0, .8), tuck(192, 49, 1, 0, .8), 'M110,119 C121,123 139,123 150,119'])

shape('wide', 'breit (Ee)',
      opening='M40,56 C78,46 178,44 216,51 C204,74 166,85 129,85 C92,85 54,77 40,56 Z',
      teeth='M0,0 H256 V50 C190,64 162,67 128,67 C94,67 66,64 0,57 Z',
      teeth_lo='M0,128 H256 V71 C190,72 160,74 128,75 C96,75 66,73 0,70 Z',
      dividers=['M81,50 L82,62', 'M104,48 L105,65', 'M127,46 L127,67', 'M151,46 L150,66', 'M175,47 L174,62'],
      dividers_lo=['M110,75 L109,85', 'M146,75 L147,85'],
      creases=[tuck(40, 56, -1, 0, .85), tuck(216, 51, 1, 0, .85), 'M110,98 C121,102 137,102 148,98'])

shape('round', 'rund (Oh/Oo)',
      opening='M127,40 C148,39 161,52 160,67 C159,83 147,93 128,93 C108,93 96,82 96,67 C96,51 107,41 127,40 Z',
      teeth='M0,0 H256 V45 C160,52 144,54 128,54 C112,54 100,52 0,46 Z',
      dividers=['M128,40 L128,54'],
      tongue='M101,101 C105,85 116,81 129,81 C142,81 153,85 157,101 Z',
      creases=['M114,108 C122,111 134,111 142,108'],
      ring=26)

shape('fv', 'F/V (Zähne auf Lippe)',
      opening='M70,58 C96,40 160,39 186,56 C172,76 150,82 128,82 C106,82 84,76 70,58 Z',
      teeth='M0,0 H256 V128 H0 Z',
      dividers=['M104,44 L105,68', 'M129,41 L128,68', 'M153,43 L152,68'],
      lowerlip='M64,70 C96,64 160,63 192,68 C182,92 154,98 128,98 C102,98 74,92 64,70 Z',
      lowerlip_top='M64,70 C96,64 160,63 192,68',
      creases=['M108,106 C119,110 137,110 148,106'])

shape('smile_open', 'Lächeln offen',
      opening='M48,49 C88,59 168,58 208,45 C201,84 166,107 128,107 C90,107 55,87 48,49 Z',
      teeth='M0,0 H256 V47 C190,66 162,73 128,73 C94,73 66,67 0,51 Z',
      dividers=['M82,54 L83,65', 'M105,57 L106,70', 'M128,58 L128,73', 'M151,57 L150,71', 'M174,53 L173,65'],
      tongue='M80,116 C88,94 108,88 129,88 C151,88 171,94 178,116 Z',
      groove='M129,95 C128,99 129,103 130,107',
      creases=[tuck(48, 49, -1, -2, .85), tuck(208, 45, 1, -2, .85)])

shape('surprised', 'überrascht',
      opening='M126,31 C150,30 164,49 163,71 C162,93 148,109 128,109 C106,109 92,93 93,71 C94,48 104,32 126,31 Z',
      teeth='M0,0 H256 V38 C160,45 146,47 128,47 C110,47 98,45 0,39 Z',
      dividers=['M117,30 L118,46', 'M139,30 L138,46'],
      tongue='M99,117 C103,97 114,91 128,91 C142,91 155,97 159,117 Z',
      groove='M128,97 C127,101 128,105 129,109',
      creases=['M116,122 C123,124 133,124 140,122'],
      ring=20)

ORDER = ['rest_closed', 'talk_small', 'talk_open', 'wide', 'round', 'mbp', 'fv',
         'smile_closed', 'smile_open', 'sad', 'surprised', 'grumpy']

ORDER = ['rest_closed', 'talk_small', 'talk_open', 'wide', 'round', 'mbp', 'fv',
         'smile_closed', 'smile_open', 'sad', 'surprised', 'grumpy']

# ---------------- variant parameters ----------------
LIPV = {
    'thin': dict(ring=12, ll=(7, 11), lens_up=(1.8, 3.0), lens_dn=(2.6, 7.0), ringd=-8, hl=.20, sh_ry=7.5, cs_r=12),
    'full': dict(ring=22, ll=(8, 19), lens_up=(3.2, 6.0), lens_dn=(4.0, 13.5), ringd=4, hl=.27, sh_ry=9.5, cs_r=14.5),
}[A.lip]
TEETH = A.teeth
SHADE = dict(in0="#74303A", in1=C['interior'], in2="#2A0B10",
             tg0="#F4A9B1", tg1=C['tongue'], tg2="#C65F6C",
             th0="#BCAA84", th1=C['teeth'])
LIP_BOTTOM_MAX, SHADOW_BOTTOM_MAX = 118, 127.5

STYLE = f"""
    .kfb-mouth .lip {{ fill: var(--kfb-lip, {C['lip']}); stroke: var(--kfb-lip, {C['lip']}); stroke-linejoin: round; stroke-linecap: round; }}
    .kfb-mouth .lipf {{ fill: var(--kfb-lip, {C['lip']}); stroke: none; }}
    .kfb-mouth .ol {{ fill: none; stroke: {C['outline']}; stroke-width: {SW}; stroke-linejoin: round; stroke-linecap: round; }}
    .kfb-mouth .cr {{ fill: none; stroke: {C['outline']}; stroke-width: {SW2}; stroke-linejoin: round; stroke-linecap: round; }}
    .kfb-mouth .dv {{ fill: none; stroke: {C['outline']}; stroke-width: {SW3}; stroke-linecap: round; stroke-linejoin: round; }}
    .kfb-mouth .gv {{ fill: none; stroke: {C['interior']}; stroke-width: {SW3}; stroke-linecap: round; }}
    .kfb-mouth .ink2 {{ fill: {C['outline']}; stroke: {C['outline']}; stroke-width: 2; stroke-linejoin: round; }}
    .kfb-mouth .inkf {{ fill: {C['outline']}; stroke: none; }}
    .kfb-mouth .ink {{ fill: {C['outline']}; stroke: {C['outline']}; stroke-width: 3; stroke-linejoin: round; }}
"""

def bbox(d):
    pts = sample(segs(d), 30)
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys), pts

def defs(sid, top=None, lotop=None):
    q = sid
    g = [f'<radialGradient id="{q}-in" cx=".5" cy=".92" r=".85"><stop offset="0" stop-color="{SHADE["in0"]}"/><stop offset=".55" stop-color="{SHADE["in1"]}"/><stop offset="1" stop-color="{SHADE["in2"]}"/></radialGradient>',
         f'<radialGradient id="{q}-tg" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="{SHADE["tg0"]}"/><stop offset=".6" stop-color="{SHADE["tg1"]}"/><stop offset="1" stop-color="{SHADE["tg2"]}"/></radialGradient>',
         f'<radialGradient id="{q}-hl"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".48"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".2"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>',
         f'<radialGradient id="{q}-sh"><stop offset="0" stop-color="{C["outline"]}" stop-opacity=".40"/><stop offset=".5" stop-color="{C["outline"]}" stop-opacity=".17"/><stop offset="1" stop-color="{C["outline"]}" stop-opacity="0"/></radialGradient>',
         f'<radialGradient id="{q}-ao"><stop offset="0" stop-color="{C["outline"]}" stop-opacity=".16"/><stop offset=".55" stop-color="{C["outline"]}" stop-opacity=".08"/><stop offset="1" stop-color="{C["outline"]}" stop-opacity="0"/></radialGradient>',
         f'<radialGradient id="{q}-cs"><stop offset="0" stop-color="{C["outline"]}" stop-opacity=".55"/><stop offset=".5" stop-color="{C["outline"]}" stop-opacity=".22"/><stop offset="1" stop-color="{C["outline"]}" stop-opacity="0"/></radialGradient>']
    if top is not None:
        g.append(f'<linearGradient id="{q}-th" gradientUnits="userSpaceOnUse" x1="0" y1="{top-2:.1f}" x2="0" y2="{top+13:.1f}"><stop offset="0" stop-color="{SHADE["th0"]}"/><stop offset="1" stop-color="{SHADE["th1"]}"/></linearGradient>')
    if lotop is not None:
        g.append(f'<linearGradient id="{q}-tl" gradientUnits="userSpaceOnUse" x1="0" y1="{lotop:.1f}" x2="0" y2="{lotop+14:.1f}"><stop offset="0" stop-color="{SHADE["th1"]}"/><stop offset="1" stop-color="{SHADE["th0"]}"/></linearGradient>')
    return '<defs>' + ''.join(g) + '</defs>'

def ell(cx, cy, rx, ry, fill):
    return f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" style="fill:url(#{fill})"/>'

def is_tuck(d):
    n = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
    xs = n[0::2]; return max(xs) - min(xs) < 15

def teeth_bottom_at_centre(d, default=72):
    m = re.search(r'128,(\d+)', d or '')
    return float(m.group(1)) if m else default

def build(sid, s, standalone=True):
    p = []; q = f'kfbm-{sid}'
    cid = f'{q}-clip'
    has_teeth = bool(s['teeth']) and (TEETH != 'none' or sid == 'fv')
    top = lotop = None
    if s['opening']:
        x0, top, x1, by, _ = bbox(s['opening'])
    if s['teeth_lo'] and has_teeth:
        lotop = teeth_bottom_at_centre(s['teeth_lo'], 74)
    p.append(defs(q, top, lotop))
    over = []   # soft shading drawn above lips, below the opening
    AO = ''
    if s['opening']:
        ocx, ocy = (x0 + x1) / 2, (top + by) / 2
        arx, ary = min((x1 - x0) * .72 + 10, 126), min((by - top) * .5 + 26, 62)
        ocy = min(max(ocy, ary + .5), 127.5 - ary)
        AO = f'<ellipse cx="{ocx:.1f}" cy="{ocy:.1f}" rx="{arx:.1f}" ry="{ary:.1f}" style="fill:url(#{q}-ao)"/>'
        over.append(AO)
    # ---------------- lips + shading ----------------
    if s['opening']:
        ringshape = s['ring'] > 16
        ring = s['ring'] + LIPV['ringd'] if ringshape else LIPV['ring']
        p.append(f'<path class="lip" stroke-width="{ring}" d="{s["opening"]}"/>')
        cx = (x0 + x1) / 2; w = x1 - x0
        if ringshape:
            lb = by + ring / 2
        elif s['lowerlip']:
            lb = 98
            p.append(f'<path class="lipf" d="{s["lowerlip"]}"/>')
        else:
            t1 = min(LIPV['ll'][1], LIP_BOTTOM_MAX - by)
            p.append(f'<path class="lipf" d="{lowerlip_pad(s["opening"], (LIPV["ll"][0], t1))}"/>')
            lb = by + t1
        vis = lb - (by + 7.5)
        shry = LIPV['sh_ry'] * (.8 if ringshape else 1); shcy = min(lb + (0 if ringshape else 2.0), SHADOW_BOTTOM_MAX - shry)
        over.append(ell(cx, shcy, w * (.32 if not ringshape else .46), shry, f'{q}-sh'))
        if ringshape:
            over.append(ell(cx, top - 1, w * .44, ring / 2 - 2, f'{q}-hl'))
        else:
            over.append(ell(cx, top - 5.5, w * .32, 7.0 if A.lip == 'full' else 5.5, f'{q}-hl'))
        if not ringshape and not s['lowerlip']:
            c0 = segs(s['opening'])[0]
            for (xx, yy) in (c0[0], c0[3]):
                over.append(ell(xx, yy + 1.5, LIPV['cs_r'], LIPV['cs_r'] * .9, f'{q}-cs'))
        hl_after = []
        if s['lowerlip']:
            hl_after.append(ell(128, 82 if A.lip == 'full' else 80.5, 30, 5.2 if A.lip == 'full' else 3.8, f'{q}-hl'))
            for (xx, yy) in ((70, 60), (186, 58)):
                over.append(ell(xx, yy, LIPV['cs_r'], LIPV['cs_r'] * .9, f'{q}-cs'))
        elif vis >= 2.5:
            over.append(ell(cx, by + 6 + vis * .35, w * LIPV['hl'] * (1.3 if ringshape else 1.25), max(6.0, vis * .9), f'{q}-hl'))
    if s['line'] or s['lens']:
        base = s['line'] or s['lens'].split(' C166,67')[0]
        up, dn = LIPV['lens_up'], LIPV['lens_dn']
        if s['lens']:
            up, dn = (up[0] + 1, up[1] + 1), (dn[0], dn[1] + 1)
        p.append(f'<path class="lipf" d="{lens_pad(base, up, dn)}"/>')
        sl = segs(base); pts = sample(sl); _xc = (min(p_[0] for p_ in pts) + max(p_[0] for p_ in pts)) / 2; mid = min(pts, key=lambda p_: abs(p_[0] - _xc))
        xs = [pp[0] for pp in pts]; w = max(xs) - min(xs)
        ink_bot = mid[1] + 5.6
        vis = (mid[1] + dn[1]) - ink_bot
        over.append(ell(mid[0], min(mid[1] + dn[1] + 2.0, SHADOW_BOTTOM_MAX - LIPV['sh_ry']), w * .28, LIPV['sh_ry'] * .85, f'{q}-sh'))
        for (xx, yy) in (pts[0], pts[-1]):
            over.append(ell(xx, yy + 1, LIPV['cs_r'] * .85, LIPV['cs_r'] * .75, f'{q}-cs'))
        if vis >= 2.5:
            over.append(ell(mid[0], ink_bot + vis * .3, w * LIPV['hl'] * 1.2, max(5.0, vis * .9), f'{q}-hl'))
    p.extend(over)
    # ---------------- opening ----------------
    if s['opening']:
        p.append(f'<clipPath id="{cid}"><path d="{s["opening"]}"/></clipPath>')
        if s['lowerlip']:   # lower lip must hide teeth + outline even when the lip tint is transparent
            p.append(f'<mask id="{q}-llm" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="128"><rect width="256" height="128" fill="#fff"/><path d="{s["lowerlip"]}" fill="#000"/></mask><g mask="url(#{q}-llm)">')
        p.append(f'<path d="{s["opening"]}" style="fill:url(#{q}-in)"/>')
        g = []
        if s['tongue']:
            g.append(f'<path d="{s["tongue"]}" style="fill:url(#{q}-tg)"/>')
            if s['groove']: g.append(f'<path class="gv" d="{s["groove"]}"/>')
        if has_teeth:
            g.append(f'<path d="{s["teeth"]}" style="fill:url(#{q}-th)"/>')
            if s['teeth_lo']:
                g.append(f'<path d="{s["teeth_lo"]}" style="fill:url(#{q}-tl)"/>')
            divs = list(s['dividers'])
            if TEETH == 'gap' and sid != 'fv':
                divs = [d for d in divs if abs(float(re.findall(r'-?\d+\.?\d*', d)[0]) - 128) > 9]
                tb = teeth_bottom_at_centre(s['teeth'])
                g.append(f'<path d="M123,0 H133 V{tb-3:.1f} Q128,{tb+1:.1f} 123,{tb-3:.1f} Z" style="fill:url(#{q}-in)"/>')
                g.append(f'<path class="dv" d="M123,{top-4:.1f} V{tb-3:.1f} Q128,{tb+1:.1f} 133,{tb-3:.1f} V{top-4:.1f}"/>')
            for d in divs + list(s['dividers_lo']):
                g.append(f'<path class="dv" d="{d}"/>')
            if not s['lowerlip']:
                g.append(f'<path class="dv" d="{s["teeth"]}"/>')
            if s['teeth_lo']:
                g.append(f'<path class="dv" d="{s["teeth_lo"]}"/>')
        p.append(f'<g clip-path="url(#{cid})">' + ''.join(g) + '</g>')
        p.append(f'<path class="ol" d="{s["opening"]}"/>')
        p.append(f'<path class="inkf" d="{bottom_weight(s["opening"])}"/>')
        if s['lowerlip']:
            p.append('</g>')
        if s['lowerlip']:
            p.extend(hl_after)
            p.append(f'<path class="ol" d="{s["lowerlip_top"]}"/>')
    if s['line']:
        p.append(f'<path class="ink2" d="{lens_pad(s["line"], (2.2, 3.4), (2.2, 4.6))}"/>')
    if s['lens']:
        p.append(f'<path class="ink" d="{s["lens"]}"/>')
    for d in s['creases']:
        if is_tuck(d) or sid == 'mbp':
            p.append(f'<path class="cr" d="{d}"/>')
    body = '\n  '.join(p)
    g = f'<g class="kfb-mouth" id="{sid}" data-anchor="128,64" data-variant="lip={A.lip} teeth={TEETH}">\n  {body}\n</g>'
    if not standalone:
        return g
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 128" width="256" height="128">\n'
            f'<!-- KFB mouth set R2 · {sid} · {s["label"]} · lip={A.lip} teeth={TEETH} · anchor 128,64 · lip tint: CSS custom property kfb-lip, see README (default {C["lip"]}) -->\n'
            f'<style>{STYLE}</style>\n{g}\n</svg>\n')

for sid in ORDER:
    with open(os.path.join(OUT, f'{sid}.svg'), 'w') as f:
        f.write(build(sid, SHAPES[sid]))
if A.json:
    with open(A.json, 'w') as f:
        json.dump({'order': ORDER, 'labels': {k: SHAPES[k]['label'] for k in ORDER}, 'colors': C, 'shade': SHADE,
                   'variant': {'lip': A.lip, 'teeth': TEETH}}, f, indent=1)
print('ok', len(ORDER), A.lip, TEETH)
