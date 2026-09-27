"""LP01 v5 core (pure python, no bpy) · Sky-Deck double loop ON THE APPROVED SC01 MB BRIDGE (use what works)
Georg 27.09 (v4 review): PASS on the cable look; TUNE:
  - no self-made bridge parts: the SC01 builder (approved) builds the bridge in the same file, LP01 follows its route
    (RKIT-11 fixture profile: banks 9 m, deck 17 m, crown) and its pylon stations (s 314.41 / 632.39 -> runtime z -158.59 / 159.39)
  - loops at least as high as the pylons are above the water surface (deck 17 + 46 = 63 m) -> loop_H 64 m
  - exit/entry lanes that start small and widen (taper lane next to the through lane, like v1), dashed lane divider
  - try a dashed centre stripe on road skins (dash = a skin parameter; the cable stays ONE strand, gaps are r->min)
Frame (my): x forward = runtime z, y left = runtime x, z up = runtime y (absolute, water/ground reference of the fixture = 0).
Blender = (y, -x, z) (= rkit_lib.to_bl of runtime (x,y,z), SC_OFFSET (0,0))."""
import math

# ------------------------------------------------------------------ parameters
P = dict(
    # SC01 MB (sc01_bridge_shells.sockets.json, build_sc01_bridge_shells.py DEFAULT + fixture_route defaults)
    fx_z0=-473.0, fx_z1=241.0, fx_bank=9.0, fx_crest=17.0, fx_half_span=157.5, fx_ramp_w=-175.0, fx_ramp_e=150.0,
    x_pyl_W=-473.0 + 314.41, x_pyl_E=-473.0 + 632.39, deck_half=14.8, cable_off=0.75, above_deck=46.0,
    portal_spring=39.5, portal_rise=3.0, portal_th=2.2,
    # lanes on the bridge deck (Track Core stand-ins)
    y_T=-7.0, y_L=7.0, W_road=12.0, W_coaster=10.0,
    # loop branch
    taper_len=90.0, split_S_len=70.0, lift_grade=0.30, ramp_frac=0.2, flat=30.0, loop_H=64.0, knot_y=6.6, knot_clear=3.0,
    deck_t=0.45, sky_S_len=150.0, alt_S_len=110.0, runout=40.0, gore_gap=1.4,
    # coaster drive
    v_full=27.0, v_launch=42.0, v_min_locked=8.0, v_max_locked=45.0, g=9.81, bank_k=8.0, bank_clamp_deg=35.0,
    trans_len=24.0, decision_window=45.0, dash_on=3.0, dash_off=3.0,
)


def deck_y(x):
    """RKIT-11 fixture deck height (SC01 fixture_route.y), my x = runtime z"""
    def ss(a, b, v):
        t = max(0.0, min(1.0, (v - a) / (b - a))); return t * t * (3 - 2 * t)
    up = ss(P['fx_z0'], P['fx_ramp_w'], x) * (1.0 - ss(P['fx_ramp_e'], P['fx_z1'], x))
    crown = 1.2 * math.cos(math.pi * max(-1.0, min(1.0, x / P['fx_half_span']))) * 0.5 + 0.6 if abs(x) < P['fx_half_span'] else 0.0
    return P['fx_bank'] + (P['fx_crest'] - P['fx_bank']) * up + crown * up


# ------------------------------------------------------------------ small vector helpers
def add(a, b): return (a[0] + b[0], a[1] + b[1], a[2] + b[2])
def sub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def mul(a, k): return (a[0] * k, a[1] * k, a[2] * k)
def dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def norm(a):
    l = math.sqrt(dot(a, a)) or 1e-12
    return (a[0] / l, a[1] / l, a[2] / l)
def dist(a, b): return math.sqrt(dot(sub(a, b), sub(a, b)))


def q5(t):
    t = min(1.0, max(0.0, t)); return t * t * t * (10 - 15 * t + 6 * t * t)


def smooth(t):
    t = min(1.0, max(0.0, t)); return t * t * (3 - 2 * t)


def ramp(t, f):
    t = min(1.0, max(0.0, t)); gmax = 1.0 / (1.0 - f)
    if t < f: return gmax * t * t / (2 * f)
    if t > 1 - f:
        u = 1 - t; return 1.0 - gmax * u * u / (2 * f)
    return gmax * (t - f / 2)


def lin(a, b, step=1.0):
    n = max(1, int(abs(b - a) / step)); return [a + (b - a) * i / n for i in range(n + 1)]


# ------------------------------------------------------------------ classic clothoid loop + knot over the portal
def clothoid_loop(H, n=360):
    L = 1.0; a = math.pi / (L * L / 2); N = 8000; ds = 2 * L / N
    u = v = th = 0.0; raw = [(0.0, 0.0)]
    for i in range(N):
        s_ = (i + 0.5) * ds; k = a * s_ if s_ <= L else a * (2 * L - s_)
        th += k * ds; u += math.cos(th) * ds; v += math.sin(th) * ds; raw.append((u, v))
    sc = H / max(p[1] for p in raw)
    pts = [(raw[int(N * i / n)][0] * sc, raw[int(N * i / n)][1] * sc) for i in range(n + 1)]
    return pts, sc / (a * L)


def knot(lp):
    """crossing of the low entry run and the low exit run (the loop's 'lower apex') -> (u_c, h_entry, h_exit, i_e, i_x)"""
    n = len(lp) - 1; best = None
    ent = [(i, p) for i, p in enumerate(lp[: n // 2])]
    ext = [(i, p) for i, p in enumerate(lp) if i > n // 2]
    low_e = [(i, p) for i, p in ent if p[1] < lp[-1][0] * 0.4]
    low_x = [(i, p) for i, p in ext if p[1] < lp[-1][0] * 0.4]
    for ie, pe in low_e:
        for ix, px in low_x:
            if abs(pe[0] - px[0]) < 0.4:
                score = max(pe[1], px[1])
                if best is None or score < best[0]:
                    best = (score, (pe[0] + px[0]) / 2, pe[1], px[1], ie, ix)
    return best[1:]


# ------------------------------------------------------------------ classic clothoid loop + knot over the portal
def clothoid_loop(H, n=360):
    L = 1.0; a = math.pi / (L * L / 2); N = 8000; ds = 2 * L / N
    u = v = th = 0.0; raw = [(0.0, 0.0)]
    for i in range(N):
        s_ = (i + 0.5) * ds; k = a * s_ if s_ <= L else a * (2 * L - s_)
        th += k * ds; u += math.cos(th) * ds; v += math.sin(th) * ds; raw.append((u, v))
    sc = H / max(p[1] for p in raw)
    pts = [(raw[int(N * i / n)][0] * sc, raw[int(N * i / n)][1] * sc) for i in range(n + 1)]
    return pts, sc / (a * L)


def knot(lp):
    """crossing of the low entry run and the low exit run (the loop's 'lower apex') -> (u_c, h_entry, h_exit, i_e, i_x)"""
    n = len(lp) - 1; best = None
    ent = [(i, p) for i, p in enumerate(lp[: n // 2])]
    ext = [(i, p) for i, p in enumerate(lp) if i > n // 2]
    low_e = [(i, p) for i, p in ent if p[1] < lp[-1][0] * 0.4]
    low_x = [(i, p) for i, p in ext if p[1] < lp[-1][0] * 0.4]
    for ie, pe in low_e:
        for ix, px in low_x:
            if abs(pe[0] - px[0]) < 0.4:
                score = max(pe[1], px[1])
                if best is None or score < best[0]:
                    best = (score, (pe[0] + px[0]) / 2, pe[1], px[1], ie, ix)
    return best[1:]


# ------------------------------------------------------------------ routes
def route_T():
    return [(x, P['y_T'], deck_y(x)) for x in lin(-720.0, 760.0, 1.0)]


def route_L():
    """taper (exit lane grows next to T) -> S to the left lane -> magnet lift -> loop 1 (knot on W portal) -> sky run ->
    loop 2 (knot on E portal) -> S at altitude -> drop -> run-out -> S back -> taper (lane shrinks into T)"""
    lp, r_top = clothoid_loop(P['loop_H']); n = len(lp) - 1
    u_c, h_e, h_x, ie, ix = knot(lp)
    portal_top_W = deck_y(P['x_pyl_W']) + P['portal_spring'] + P['portal_rise'] + P['portal_th'] / 2
    portal_top_E = deck_y(P['x_pyl_E']) + P['portal_spring'] + P['portal_rise'] + P['portal_th'] / 2
    zb = max(portal_top_W, portal_top_E) + P['knot_clear'] + P['deck_t'] - min(h_e, h_x)
    foot = lp[-1][0]
    x_loop1 = P['x_pyl_W'] - u_c; x_loop2 = P['x_pyl_E'] - u_c
    x_lift_end = x_loop1 - P['flat']
    lift_len = (zb - deck_y(x_lift_end)) / (P['lift_grade'] * (1 - P['ramp_frac']))
    x_lift_start = x_lift_end - lift_len
    x_S = x_lift_start - P['split_S_len']; x_taper = x_S - P['taper_len']
    yT, yL, ky, Wr = P['y_T'], P['y_L'], P['knot_y'], P['W_road']
    y_glue = yT + Wr / 2                                       # L's right edge is glued to T's left edge during the taper
    pts, wid = [], []; M = {}
    def seg(xs, f, w=lambda x: Wr):
        for x in xs:
            pts.append(f(x)); wid.append(w(x))
    # 1 taper: width 0 -> W, centre = glue + w/2 (right edge stays on T's left edge)
    wt = lambda x: Wr * smooth((x - x_taper) / P['taper_len'])
    seg(lin(x_taper, x_S), lambda x: (x, y_glue + wt(x) / 2, deck_y(x)), wt)
    M['taper_end'] = len(pts) - 1
    # 2 S from glued (centre yT+W) to the left lane yL (edge gap opens -> gore)
    y0 = y_glue + Wr / 2
    seg(lin(x_S, x_lift_start)[1:], lambda x: (x, y0 + (yL - y0) * q5((x - x_S) / P['split_S_len']), deck_y(x)))
    M['lift_start'] = len(pts) - 1
    # 3 magnet lift (lane drifts to the knot offset)
    seg(lin(x_lift_start, x_lift_end)[1:], lambda x: (x, yL + (ky - yL) * q5((x - x_lift_start) / lift_len),
                                                      deck_y(x) + (zb - deck_y(x)) * ramp((x - x_lift_start) / lift_len, P['ramp_frac'])))
    M['lift_end'] = len(pts) - 1
    seg(lin(x_lift_end, x_loop1)[1:], lambda x: (x, ky, zb))
    M['loop1_in'] = len(pts) - 1
    for i, (u, v) in enumerate(lp[1:], 1):
        pts.append((x_loop1 + u, ky - 2 * ky * q5(i / n), zb + v)); wid.append(Wr)
    M['loop1_out'] = len(pts) - 1
    xa = x_loop1 + foot; xs0 = xa + P['flat']; xs1 = xs0 + P['sky_S_len']
    seg(lin(xa, xs0)[1:], lambda x: (x, -ky, zb))
    seg(lin(xs0, xs1)[1:], lambda x: (x, -ky + 2 * ky * q5((x - xs0) / P['sky_S_len']), zb))
    seg(lin(xs1, x_loop2)[1:], lambda x: (x, ky, zb))
    M['loop2_in'] = len(pts) - 1
    for i, (u, v) in enumerate(lp[1:], 1):
        pts.append((x_loop2 + u, ky - 2 * ky * q5(i / n), zb + v)); wid.append(Wr)
    M['loop2_out'] = len(pts) - 1
    xa = x_loop2 + foot; xb = xa + P['flat']; xc = xb + P['alt_S_len']
    seg(lin(xa, xb)[1:], lambda x: (x, -ky, zb))
    seg(lin(xb, xc)[1:], lambda x: (x, -ky + (yL + ky) * q5((x - xb) / P['alt_S_len']), zb))
    M['drop_start'] = len(pts) - 1
    drop_len = (zb - deck_y(xc + 150)) / (P['lift_grade'] * (1 - P['ramp_frac']))
    xd = xc + drop_len
    seg(lin(xc, xd)[1:], lambda x: (x, yL, zb + (deck_y(x) - zb) * ramp((x - xc) / drop_len, P['ramp_frac'])))
    M['drop_end'] = len(pts) - 1
    xe = xd + P['runout']
    seg(lin(xd, xe)[1:], lambda x: (x, yL, deck_y(x)))
    M['merge_start'] = len(pts) - 1
    xf = xe + P['split_S_len']
    seg(lin(xe, xf)[1:], lambda x: (x, yL + (y0 - yL) * q5((x - xe) / P['split_S_len']), deck_y(x)))
    M['taper_in'] = len(pts) - 1
    xg = xf + P['taper_len']
    wm = lambda x: Wr * (1 - smooth((x - xf) / P['taper_len']))
    seg(lin(xf, xg)[1:], lambda x: (x, y_glue + wm(x) / 2, deck_y(x)), wm)
    M['merge'] = len(pts) - 1
    info = dict(zb=zb, zb_above_deck=zb - deck_y(P['x_pyl_W']), loop_top=zb + P['loop_H'], r_top=r_top, u_c=u_c,
                h_knot_entry=h_e, h_knot_exit=h_x, foot=foot, lift_len=lift_len, drop_len=drop_len,
                x_taper=x_taper, x_S=x_S, x_merge_start=xe, x_taper_in=xf, x_merge=xg, x_loop1=x_loop1, x_loop2=x_loop2,
                portal_top_W=portal_top_W, pylon_top_above_water=deck_y(P['x_pyl_W']) + P['above_deck'])
    return pts, wid, M, info


# ------------------------------------------------------------------ arc length, frames, roll
def arclen(pts):
    S = [0.0]
    for a, b in zip(pts, pts[1:]):
        S.append(S[-1] + dist(a, b))
    return S


def frames(pts, roll):
    """guide-vector frame (lateral = +y projected), then rolled about the tangent"""
    out = []; n = len(pts)
    for i in range(n):
        T = norm(sub(pts[min(n - 1, i + 1)], pts[max(0, i - 1)]))
        g = (0.0, 1.0, 0.0); L = norm(sub(g, mul(T, dot(g, T)))); U = norm(cross(T, L))
        r = roll[i]; c, s = math.cos(r), math.sin(r)
        L2 = norm(add(mul(L, c), mul(cross(T, L), s))); U2 = norm(add(mul(U, c), mul(cross(T, U), s)))
        out.append((pts[i], T, L2, U2))
    return out


def auto_bank(pts, S, i, lo, hi, win=10.0):
    j0 = j1 = i
    while j0 > lo and S[i] - S[j0] < win: j0 -= 1
    while j1 < hi and S[j1] - S[i] < win: j1 += 1
    def hd(j):
        a, b = pts[max(lo, j - 1)], pts[min(hi, j + 1)]
        return math.atan2(b[1] - a[1], b[0] - a[0])
    dh = (hd(j1) - hd(j0) + math.pi) % (2 * math.pi) - math.pi
    cl = math.radians(P['bank_clamp_deg'])
    return max(-cl, min(cl, -math.atan(dh * P['bank_k']) * 0.5))


# ------------------------------------------------------------------ sections (mode / skin / roll law)
def sections_L(M, n):
    cuts = [0, M['taper_end'], M['lift_start'], M['lift_end'], M['loop1_in'], M['loop1_out'], M['loop2_in'], M['loop2_out'],
            M['drop_start'], M['drop_end'], M['merge_start'], M['taper_in'], n - 1]
    spec = [('road', 'assist', 'flat'),              # taper: exit lane grows next to T (dashed divider)
            ('road', 'assist', 'flat'),              # S to the left lane on the deck, gore
            ('magnet', 'magnet_push', 'auto_bank'),  # magnet lift
            ('coaster', 'locked', 'auto_bank'),      # approach
            ('coaster', 'locked', 'loop'),           # loop 1, knot on the W portal
            ('coaster', 'locked', 'auto_bank'),      # sky run
            ('coaster', 'locked', 'loop'),           # loop 2, knot on the E portal
            ('coaster', 'locked', 'auto_bank'),      # exit + S at altitude
            ('coaster', 'locked', 'auto_bank'),      # drop
            ('road', 'assist', 'flat'),              # run-out (release zone)
            ('road', 'assist', 'flat'),              # S back to the glued position
            ('road', 'assist', 'flat')]              # taper in: lane shrinks into T
    return [dict(i0=cuts[k], i1=cuts[k + 1], skin=a, mode=b, roll_law=c) for k, (a, b, c) in enumerate(spec)]


def roll_channel(pts, S, secs):
    """auto_bank windows stay inside the contiguous run of auto_bank sections (never look into loops or flat deck parts)"""
    roll = [0.0] * len(pts)
    k = 0
    while k < len(secs):
        if secs[k]['roll_law'] != 'auto_bank':
            k += 1; continue
        j = k
        while j + 1 < len(secs) and secs[j + 1]['roll_law'] == 'auto_bank':
            j += 1
        lo, hi = secs[k]['i0'], secs[j]['i1']
        for i in range(lo, hi + 1):
            roll[i] = auto_bank(pts, S, i, lo, hi)
        k = j + 1
    return roll


# ------------------------------------------------------------------ cable bundle = continuous strands, skins = presets
CABLES = ['railL', 'railR', 'edgeL', 'edgeR', 'centre', 'spine']
SKIN = {  # per cable: lateral (at nominal width), height, radius ; deck width ; colour ; dashed centre
    'road':    dict(W=P['W_road'], railL=(6.2, 1.0, 0.25), railR=(-6.2, 1.0, 0.25), edgeL=(5.4, 0.08, 0.18), edgeR=(-5.4, 0.08, 0.18),
                    centre=(0.0, 0.08, 0.14), spine=(0.0, -0.5, 0.05), col=(0.95, 0.40, 0.30), dash=1.0),
    'coaster': dict(W=P['W_coaster'], railL=(4.8, 0.45, 0.42), railR=(-4.8, 0.45, 0.42), edgeL=(4.3, 0.06, 0.05), edgeR=(-4.3, 0.06, 0.05),
                    centre=(0.0, 0.06, 0.05), spine=(0.0, -1.4, 0.75), col=(0.35, 0.55, 0.95), dash=0.0),
    'magnet':  dict(W=P['W_coaster'], railL=(4.8, 0.45, 0.42), railR=(-4.8, 0.45, 0.42), edgeL=(4.3, 0.06, 0.05), edgeR=(-4.3, 0.06, 0.05),
                    centre=(0.0, 0.10, 0.22), spine=(0.0, -1.4, 0.75), col=(0.75, 0.35, 0.95), dash=0.0),
}
FLUSH = (0.05, 0.08)
R_MIN = 0.02


def lerp3(a, b, t): return tuple(a[k] + (b[k] - a[k]) * t for k in range(len(a)))


def skin_params(secs, S, i):
    """blend the presets of neighbouring sections over trans_len centred on each border"""
    k = next(j for j, sc in enumerate(secs) if sc['i0'] <= i <= sc['i1'])
    cur = SKIN[secs[k]['skin']]; s = S[i]; h = P['trans_len'] / 2
    if k > 0:
        sb = S[secs[k]['i0']]
        if s < sb + h and secs[k - 1]['skin'] != secs[k]['skin']:
            t = smooth((s - (sb - h)) / (2 * h)); return blend(SKIN[secs[k - 1]['skin']], cur, t)
    if k < len(secs) - 1:
        sb = S[secs[k]['i1']]
        if s > sb - h and secs[k + 1]['skin'] != secs[k]['skin']:
            t = smooth((s - (sb - h)) / (2 * h)); return blend(cur, SKIN[secs[k + 1]['skin']], t)
    return dict(cur)


def blend(a, b, t):
    out = {'W': a['W'] + (b['W'] - a['W']) * t, 'col': lerp3(a['col'], b['col'], t), 'dash': a['dash'] + (b['dash'] - a['dash']) * t}
    for c in CABLES:
        out[c] = lerp3(a[c], b[c], t)
    return out


def dash_factor(s, amount):
    """1 = visible, R_MIN-scaled in the gaps; amount 0..1 blends dashed <-> solid (skin parameter)"""
    on = (s % (P['dash_on'] + P['dash_off'])) < P['dash_on']
    return 1.0 if on else (1.0 - amount)


def cable_points(route, pts, S, fr, params_at, wscale_at, flush_at, divider_at):
    """{cable: [(point, radius, colour)]}, ONE list per cable. wscale scales laterals (taper lanes start small);
    flush lowers the inner rail; divider turns the inner edge line into a dashed lane divider."""
    out = {c: [] for c in CABLES}; out['deck'] = []
    for i, (p, T, L, U) in enumerate(fr):
        prm = params_at(i); ws = wscale_at(i); fl = flush_at(i); dv = divider_at(i)
        for c in CABLES:
            lat, h, r = prm[c]
            lat *= ws
            inner_rail = (c == 'railL' and route == 'T') or (c == 'railR' and route == 'L')
            inner_edge = (c == 'edgeL' and route == 'T') or (c == 'edgeR' and route == 'L')
            if inner_rail and fl > 0:
                h = h + (FLUSH[0] - h) * fl; r = r + (FLUSH[1] - r) * fl
            if c == 'centre':
                r = max(R_MIN, r * dash_factor(S[i], prm['dash']))
            if inner_edge and dv > 0:
                r = max(R_MIN, r * (1 - dv) + r * dv * dash_factor(S[i], 1.0))
            if c == 'centre' and ws < 0.5:
                r = R_MIN + (r - R_MIN) * ws * 2
            col = prm['col'] if route == 'L' else (0.35, 0.8, 0.45)
            out[c].append((add(add(p, mul(L, lat)), mul(U, h)), max(r, R_MIN), col))
        out['deck'].append((p, prm['W'] * ws, L, U))
    return out


# ------------------------------------------------------------------ checks (dashed strokes excluded from the radius-slope check)
def check_continuity(cp, S):
    """every cable is one list (by construction) -> check jumps: position step vs centreline step, radius step"""
    worst_pos, worst_r = 0.0, 0.0
    for c in CABLES:
        pts = cp[c]
        for k in range(1, len(pts)):
            ds = S[k] - S[k - 1]
            worst_pos = max(worst_pos, dist(pts[k][0], pts[k - 1][0]) - 3.0 * ds)   # loops scale offsets ~2.5x at 4 m laterals
            worst_r = max(worst_r, abs(pts[k][1] - pts[k - 1][1]) / max(ds, 1e-6)) if c not in ('centre', 'edgeL', 'edgeR') else worst_r
    return round(max(0.0, worst_pos), 3), round(worst_r, 3)


def check_roll(fr, S, roll):
    worst = 0.0; flip = False
    for k in range(1, len(fr)):
        worst = max(worst, abs(math.degrees(roll[k] - roll[k - 1])) / max(1e-6, S[k] - S[k - 1]))
        if dot(fr[k][3], fr[k - 1][3]) < math.cos(math.radians(45)): flip = True
    return round(worst, 2), flip


def speeds_in_loops(pts, M, info):
    vmin = 1e9
    for a, b in (('loop1_in', 'loop1_out'), ('loop2_in', 'loop2_out')):
        for i in range(M[a], M[b] + 1):
            v = math.sqrt(max(0.0, P['v_launch'] ** 2 - 2 * P['g'] * (pts[i][2] - info['zb'])))
            vmin = min(vmin, min(P['v_max_locked'], max(P['v_min_locked'], v)))
    return round(vmin, 1), round(math.sqrt(P['g'] * info['r_top']), 1)


def build_all():
    T = route_T(); L, WL, M, info = route_L()
    ST, SL = arclen(T), arclen(L)
    secs = sections_L(M, len(L))
    rollL = roll_channel(L, SL, secs)
    frL, frT = frames(L, rollL), frames(T, [0.0] * len(T))
    xt0, xt1 = info['x_taper'], info['x_S'] + P['split_S_len']        # shared zone at the exit (taper + S up to the gore)
    xm0, xm1 = info['x_merge_start'], info['x_merge']
    gap_open = lambda y_c, w: abs(y_c - P['y_T']) - (P['W_road'] + w) / 2   # edge gap between the two decks
    def flush_from_gap(g):
        return 1.0 - smooth((g - 0.2) / (P['gore_gap'] - 0.2))
    # L: width scale from the taper; inner rail flush until the gore; inner edge dashed while the decks touch
    wsL = lambda i: WL[i] / P['W_road'] if (i <= M['taper_end'] or i >= M['taper_in']) else 1.0
    def flushL(i):
        if i <= M['lift_start'] or i >= M['merge_start']:
            return flush_from_gap(gap_open(L[i][1], WL[i]))
        return 0.0
    def divL(i):
        return 0.0
    # T: its left barrier dips as the taper opens (the exit lane takes over as the outer barrier), dashed left edge
    def lane_at(x):
        best = None
        for i in list(range(0, M['lift_start'] + 1)) + list(range(M['merge_start'], len(L))):
            if abs(L[i][0] - x) < 0.51:
                best = i; break
        return best
    idx_cache = {}
    def Li(x):
        k = round(x)
        if k not in idx_cache:
            idx_cache[k] = lane_at(x)
        return idx_cache[k]
    def flushT(i):
        x = T[i][0]
        if not (xt0 - 20 <= x <= xt1 + 5 or xm0 - 5 <= x <= xm1 + 20):
            return 0.0
        j = Li(x)
        if j is None:
            return 0.0
        return flush_from_gap(gap_open(L[j][1], WL[j])) * smooth(WL[j] / 3.0)
    def divT(i):
        x = T[i][0]
        j = Li(x) if (xt0 <= x <= xt1 or xm0 <= x <= xm1) else None
        if j is None:
            return 0.0
        return flush_from_gap(gap_open(L[j][1], WL[j])) * smooth(WL[j] / 3.0)
    cpL = cable_points('L', L, SL, frL, lambda i: skin_params(secs, SL, i), wsL, flushL, divL)
    cpT = cable_points('T', T, ST, frT, lambda i: dict(SKIN['road']), lambda i: 1.0, flushT, divT)
    return dict(T=T, L=L, WL=WL, M=M, info=info, ST=ST, SL=SL, secs=secs, rollL=rollL, frL=frL, frT=frT, cpL=cpL, cpT=cpT)



# ================================================================== Blender layer (preview/oracle only)
import bpy, bmesh, json, os
from mathutils import Vector, kdtree
from mathutils.bvhtree import BVHTree

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit'
OUT = globals().get('LP_OUT', KIT + '/LP01-ELEVATED-LOOP/')
COLL = 'LP01_V5'


def BL(p):
    """my frame -> Blender (= rkit_lib.to_bl(runtime) with SC_OFFSET (0,0)); runtime = (y, z, x)"""
    return Vector((p[0 + 1], -p[0], p[2]))


def BLv(v):
    return Vector((v[1], -v[0], v[2]))


def coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.objects):
            bpy.data.objects.remove(o, do_unlink=True)
    else:
        c = bpy.data.collections.new(COLL); bpy.context.scene.collection.children.link(c)
    return c


def colour_attr(me, cols):
    a = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    for k, cl in enumerate(cols):
        a.data[k].color = (*cl, 1.0)


def mesh_from_bm(c, name, bm, rgb=None, role=''):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    if rgb is not None:
        colour_attr(me, [rgb] * len(me.vertices))
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_lp01_role'] = role
    return o


def deck_band(c, name, deck, rgb):
    bm = bmesh.new(); rings = []
    for (p, W, L, U) in deck:
        pp, Lv, Uv = BL(p), BLv(L), BLv(U); W = max(W, 0.02)
        rings.append([bm.verts.new(pp + Lv * o + Uv * h) for o, h in ((-W / 2, -P['deck_t']), (W / 2, -P['deck_t']), (W / 2, 0.0), (-W / 2, 0.0))])
    for A, B_ in zip(rings, rings[1:]):
        for k in range(4):
            bm.faces.new((A[k], A[(k + 1) % 4], B_[(k + 1) % 4], B_[k]))
    return mesh_from_bm(c, name, bm, rgb, 'deck')


def cable_obj(c, name, pts):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.0; cu.bevel_resolution = 3
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for k, (q, r, col) in enumerate(pts):
        b = BL(q); sp.points[k].co = (b.x, b.y, b.z, 1.0); sp.points[k].radius = max(r, 0.02)
    tmp = bpy.data.objects.new(name + '_tmp', cu); c.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get(); ev = tmp.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev); bpy.data.objects.remove(tmp, do_unlink=True); bpy.data.curves.remove(cu)
    kd = kdtree.KDTree(len(pts))
    for k, (q, r, col) in enumerate(pts):
        kd.insert(BL(q), k)
    kd.balance()
    colour_attr(me, [pts[kd.find(v.co)[1]][2] for v in me.vertices])
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_lp01_role'] = 'cable'; o['kfb_cable_splines'] = 1
    return o


def build_sc01():
    """the APPROVED SC01 builder, unchanged, MB variant at SC_OFFSET (0,0) -> same frame as LP01"""
    import sys
    p2 = KIT + '/RKIT-02/scripts'                 # rkit3_lib imports rkit2_lib; SC01 assumed it on sys.path
    if p2 not in sys.path:
        sys.path.insert(0, p2)
    src = open(KIT + '/SC01-BRIDGE-SHELLS/scripts/build_sc01_bridge_shells.py').read()
    g = {'__name__': 'sc01', 'SC_OFFSET': (0.0, 0.0), 'SC_VARIANTS': [dict(tag='MB')]}
    exec(src, g)
    return g.get('result')


def sc01_clearance(cp_list):
    """real clearance: rails + deck edges/underside of L vs every SC01 MB mesh (route proxy excluded)"""
    dg = bpy.context.evaluated_depsgraph_get()
    trees = []
    for o in bpy.data.collections['SC01_BRIDGE_SHELLS'].objects:
        if o.type != 'MESH' or 'ROUTE_PROXY' in o.name:
            continue
        me = o.evaluated_get(dg).to_mesh()
        vs = [o.matrix_world @ v.co for v in me.vertices]; fs = [tuple(p.vertices) for p in me.polygons]
        trees.append((o.name, BVHTree.FromPolygons(vs, fs)))
        o.evaluated_get(dg).to_mesh_clear()
    worst = (1e9, None, None)
    for cp in cp_list:
        probes = [(BL(q), r) for c in ('railL', 'railR', 'spine') for (q, r, _) in cp[c]]
        for (p, W, L, U) in cp['deck']:
            pp, Lv, Uv = BL(p), BLv(L), BLv(U)
            probes += [(pp + Lv * (W / 2), 0.0), (pp - Lv * (W / 2), 0.0), (pp - Uv * P['deck_t'], 0.0)]
        for q, r in probes:
            for name, t in trees:
                hit = t.find_nearest(q, 30.0)
                if hit[0] is not None:
                    d = hit[3] - r
                    if d < worst[0]:
                        worst = (d, name, tuple(round(v, 1) for v in q))
    return dict(min_clear_m=round(worst[0], 2), nearest_sc01_piece=worst[1], at_blender=worst[2])


def run():
    sc = build_sc01()
    R = build_all(); c = coll()
    deck_band(c, 'LP01_T_deck', R['cpT']['deck'], (0.24, 0.24, 0.26))
    deck_band(c, 'LP01_L_deck', R['cpL']['deck'], (0.22, 0.22, 0.25))
    for route, cp in (('T', R['cpT']), ('L', R['cpL'])):
        for cab in CABLES:
            cable_obj(c, f'LP01_{route}_cable_{cab}', cp[cab])
    return R, sc


def export(R, sc):
    info = R['info']; M = R['M']; SL = R['SL']
    to_rt = lambda q: [round(q[1], 3), round(q[2], 3), round(q[0], 3)]          # runtime (x right, y up, z forward)
    ck = dict(continuity_L=check_continuity(R['cpL'], R['SL']), continuity_T=check_continuity(R['cpT'], R['ST']),
              cable_splines_per_route=1, roll=check_roll(R['frL'], R['SL'], R['rollL']),
              loop_speed=speeds_in_loops(R['L'], M, info), sc01_real_geometry=sc01_clearance([R['cpL']]),
              sc01_builder_checks=sc)
    data = dict(schema='kfb.route-proof.v0', spec='TRACK_MODES_AND_SKINS_SPEC_v0.1 (+ cable rule, v0.2 candidate)',
                id='lp01-skydeck-double-loop', status='ROUTE PROOF v5 · on the approved SC01 MB bridge (same builder, same frame)',
                frame='runtime: x right, y up, z forward (SC01/RKIT-11 fixture); Blender = rkit_lib.to_bl, SC_OFFSET (0,0)',
                params=P, info={k: round(v, 3) for k, v in info.items()}, checks=ck,
                cable_rule='each cable is ONE continuous strand per route; skins are presets blended over trans_len; taper lanes scale '
                           'the laterals from 0; inner rails go flush while the decks touch; dashes are radius gaps of the same strand',
                skins=SKIN,
                routes=dict(T_through=dict(samples=[dict(s=round(s, 2), p=to_rt(p)) for s, p in zip(R['ST'], R['T'])],
                                           sections=[dict(s0=0.0, s1=round(R['ST'][-1], 2), skin='road', mode='free', roll_law='flat')]),
                            L_skydeck=dict(samples=[dict(s=round(s, 2), p=to_rt(p), roll=round(r, 4), width=round(w, 3))
                                                    for s, p, r, w in zip(SL, R['L'], R['rollL'], R['WL'])],
                                           sections=[dict(s0=round(SL[sc_['i0']], 2), s1=round(SL[sc_['i1']], 2), skin=sc_['skin'],
                                                          mode=sc_['mode'], roll_law=sc_['roll_law']) for sc_ in R['secs']])),
                zones=[dict(id='capture_lift', kind='capture', s0=round(SL[M['lift_start']], 2), s1=round(SL[M['lift_start']] + 40, 2),
                            params=dict(heading_err_deg=25, lat_off_max=6.0, v_lo=15.0, v_hi=45.0, blend_t=0.45)),
                       dict(id='release_runout', kind='release', s0=round(SL[M['drop_end']], 2), s1=round(SL[M['drop_end']] + 10, 2))],
                junctions=[dict(id='skydeck_exit', kind='junction', runtime_z=round(info['x_taper'], 2), type='taper_lane',
                                taper_len=P['taper_len'], decision_window_m=P['decision_window'], default_option='T_through',
                                options=[dict(route='T_through', mode='free', hint='arrow_straight'),
                                         dict(route='L_skydeck', mode='assist', hint='arrow_left_magnet_lift')]),
                           dict(id='skydeck_entry', kind='merge', runtime_z=round(info['x_merge'], 2), type='taper_lane')],
                sockets=[dict(id='knot_W', kind='sc01_portal', sc01_pylon='W', s_sc01=314.41),
                         dict(id='knot_E', kind='sc01_portal', sc01_pylon='E', s_sc01=632.39)])
    os.makedirs(OUT, exist_ok=True)
    json.dump(data, open(OUT + 'lp01_v5.routes.json', 'w'), indent=1, default=str)
    return ck


R, SC = run()
result = dict(objects=len(bpy.data.collections[COLL].objects), sc01_objects=len(bpy.data.collections['SC01_BRIDGE_SHELLS'].objects),
              info={k: round(v, 2) for k, v in R['info'].items()}, checks=export(R, SC))
