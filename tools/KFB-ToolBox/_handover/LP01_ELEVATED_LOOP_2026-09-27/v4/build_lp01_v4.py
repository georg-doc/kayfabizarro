"""LP01 v4 core (pure python, no bpy): Sky-Deck double loop on the SC01 MB bridge + continuous cable bundles.
Georg 27.09: loops use the two pylon cross-beams (portals) as their LOWER APEX (Sky-Deck); cable logic = cables are
continuous from start to end, skins are parameter presets that blend over the section borders; decoration (rings, ties)
is not part of the route proof. Structures must fit the SC01 bridge model later -> SC01 MB envelope is checked here.
Frame: x forward (bridge axis), y left, z up, metres. Deck top of the bridge = z 0."""
import math

# ------------------------------------------------------------------ parameters
P = dict(
    # SC01 MB reference (sc01_bridge_shells.sockets.json + build_sc01_bridge_shells.py DEFAULT)
    x_pyl_W=0.0, x_pyl_E=317.98, deck_half=14.8, cable_off=0.75, above_deck=46.0, portal_spring=39.5, portal_rise=3.0,
    portal_th=2.2, portal_depth=2.6, leg_top_half=1.3, crown_z=47.2, crown_r=2.8, x_anchor_W=-130.0, x_anchor_E=392.48,
    # lanes on the bridge deck
    y_T=-7.0, y_L=7.0, W_road=12.0, W_coaster=10.0,
    # loop branch
    s_len=110.0, lift_grade=0.30, ramp_frac=0.2, flat=30.0, loop_H=40.0, knot_y=6.6, knot_clear=1.0, deck_t=0.45,
    sky_S_len=150.0, alt_S_len=110.0, runout=40.0, gore_gap=1.4,
    # coaster drive
    v_full=27.0, v_launch=34.0, v_min_locked=8.0, v_max_locked=40.0, g=9.81, bank_k=8.0, bank_clamp_deg=35.0,
    trans_len=24.0, decision_window=45.0,
)
P['portal_top'] = P['portal_spring'] + P['portal_rise'] + P['portal_th'] / 2
P['cable_y'] = P['deck_half'] + P['cable_off']


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


# ------------------------------------------------------------------ routes
def route_T():
    return [(x, P['y_T'], 0.0) for x in lin(-520.0, 900.0, 1.0)]


def route_L():
    lp, r_top = clothoid_loop(P['loop_H']); n = len(lp) - 1
    u_c, h_e, h_x, ie, ix = knot(lp)
    # loop base so that the lower of the two knot runs clears the portal top by knot_clear (deck underside)
    zb = P['portal_top'] + P['knot_clear'] + P['deck_t'] - min(h_e, h_x)
    foot = lp[-1][0]
    lift_len = zb / (P['lift_grade'] * (1 - P['ramp_frac']))       # max grade = lift_grade
    x_loop1 = P['x_pyl_W'] - u_c; x_loop2 = P['x_pyl_E'] - u_c
    x_lift_end = x_loop1 - P['flat']; x_lift_start = x_lift_end - lift_len; x_split = x_lift_start - P['s_len']
    pts = []; M = {}
    yT, yL = P['y_T'], P['y_L']; ky = P['knot_y']
    def seg(xs, f):
        for x in xs:
            pts.append(f(x))
    # 1 split S (on the deck, from the through lane to the left lane)
    seg(lin(x_split, x_split + P['s_len']), lambda x: (x, yT + (yL - yT) * q5((x - x_split) / P['s_len']), 0.0))
    M['lift_start'] = len(pts) - 1
    # 2 lift hill (magnet lift), lane moves from yL to knot_y entry offset (+ky) during the lift
    seg(lin(x_lift_start, x_lift_end)[1:], lambda x: (x, yL + (ky - yL) * q5((x - x_lift_start) / lift_len),
                                                      zb * ramp((x - x_lift_start) / lift_len, P['ramp_frac'])))
    M['lift_end'] = len(pts) - 1
    seg(lin(x_lift_end, x_loop1)[1:], lambda x: (x, ky, zb))
    # 3 loop 1 (+ky -> -ky) around the W portal
    M['loop1_in'] = len(pts) - 1
    for i, (u, v) in enumerate(lp[1:], 1):
        pts.append((x_loop1 + u, ky - 2 * ky * q5(i / n), zb + v))
    M['loop1_out'] = len(pts) - 1
    # 4 sky run between the pylons: flat, S (-ky -> +ky), flat
    xa = x_loop1 + foot; xs0 = xa + P['flat']; xs1 = xs0 + P['sky_S_len']
    seg(lin(xa, xs0)[1:], lambda x: (x, -ky, zb))
    seg(lin(xs0, xs1)[1:], lambda x: (x, -ky + 2 * ky * q5((x - xs0) / P['sky_S_len']), zb))
    seg(lin(xs1, x_loop2)[1:], lambda x: (x, ky, zb))
    # 5 loop 2 around the E portal
    M['loop2_in'] = len(pts) - 1
    for i, (u, v) in enumerate(lp[1:], 1):
        pts.append((x_loop2 + u, ky - 2 * ky * q5(i / n), zb + v))
    M['loop2_out'] = len(pts) - 1
    # 6 exit flat, S at altitude back to the left lane, drop, run-out, merge S into the through lane
    xa = x_loop2 + foot; xb = xa + P['flat']; xc = xb + P['alt_S_len']
    seg(lin(xa, xb)[1:], lambda x: (x, -ky, zb))
    seg(lin(xb, xc)[1:], lambda x: (x, -ky + (yL + ky) * q5((x - xb) / P['alt_S_len']), zb))
    M['drop_start'] = len(pts) - 1
    xd = xc + lift_len
    seg(lin(xc, xd)[1:], lambda x: (x, yL, zb * (1 - ramp((x - xc) / lift_len, P['ramp_frac']))))
    M['drop_end'] = len(pts) - 1
    xe = xd + P['runout']
    seg(lin(xd, xe)[1:], lambda x: (x, yL, 0.0))
    M['merge_start'] = len(pts) - 1
    seg(lin(xe, xe + P['s_len'])[1:], lambda x: (x, yL + (yT - yL) * q5((x - xe) / P['s_len']), 0.0))
    M['merge'] = len(pts) - 1
    info = dict(zb=zb, r_top=r_top, u_c=u_c, h_knot_entry=h_e, h_knot_exit=h_x, foot=foot, lift_len=lift_len,
                x_split=x_split, x_merge_start=xe, x_merge=xe + P['s_len'], x_loop1=x_loop1, x_loop2=x_loop2)
    return pts, M, info


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
    cuts = [0, M['lift_start'], M['lift_end'], M['loop1_in'], M['loop1_out'], M['loop2_in'], M['loop2_out'],
            M['drop_start'], M['drop_end'], M['merge_start'], n - 1]
    spec = [('road', 'assist', 'flat'),               # split S on the shared bridge deck: no bank (v4 run 1: banked edge dipped into the deck)
            ('magnet', 'magnet_push', 'auto_bank'),   # magnet lift
            ('coaster', 'locked', 'auto_bank'),       # approach
            ('coaster', 'locked', 'loop'),            # loop 1 (W portal = lower apex)
            ('coaster', 'locked', 'auto_bank'),       # sky run
            ('coaster', 'locked', 'loop'),            # loop 2 (E portal)
            ('coaster', 'locked', 'auto_bank'),       # exit + S at altitude
            ('coaster', 'locked', 'auto_bank'),       # drop
            ('road', 'assist', 'flat'),               # run-out on the bridge deck (release zone at its start)
            ('road', 'assist', 'flat')]               # merge S on the shared deck
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
SKIN = {  # per cable: lateral, height, radius ; deck width ; colour
    'road':    dict(W=P['W_road'], railL=(6.2, 1.0, 0.25), railR=(-6.2, 1.0, 0.25), edgeL=(5.4, 0.08, 0.18), edgeR=(-5.4, 0.08, 0.18),
                    centre=(0.0, 0.08, 0.10), spine=(0.0, -0.5, 0.05), col=(0.95, 0.40, 0.30)),
    'coaster': dict(W=P['W_coaster'], railL=(4.8, 0.45, 0.42), railR=(-4.8, 0.45, 0.42), edgeL=(4.3, 0.06, 0.05), edgeR=(-4.3, 0.06, 0.05),
                    centre=(0.0, 0.06, 0.05), spine=(0.0, -1.4, 0.75), col=(0.35, 0.55, 0.95)),
    'magnet':  dict(W=P['W_coaster'], railL=(4.8, 0.45, 0.42), railR=(-4.8, 0.45, 0.42), edgeL=(4.3, 0.06, 0.05), edgeR=(-4.3, 0.06, 0.05),
                    centre=(0.0, 0.10, 0.22), spine=(0.0, -1.4, 0.75), col=(0.75, 0.35, 0.95)),
}
FLUSH = (0.05, 0.08)   # inner rail on a shared junction deck: height, radius (a flush gore line, still the same cable)


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
    out = {'W': a['W'] + (b['W'] - a['W']) * t, 'col': lerp3(a['col'], b['col'], t)}
    for c in CABLES:
        out[c] = lerp3(a[c], b[c], t)
    return out


def junction_flush(route, x, y_L_now):
    """0..1: how 'flush' the inner rails are. 1 on the shared deck, 0 once the decks are gore_gap apart.
    route 'T': inner = railL (the branch is on the left); route 'L': inner = railR."""
    sep = abs(y_L_now - P['y_T'])
    full = P['W_road'] + P['gore_gap']
    return 1.0 - smooth((sep - (full - 8.0)) / 8.0)


def cable_points(route, pts, fr, params_at, flush_at):
    """returns {cable: [(point, radius, colour)]} - ONE continuous list per cable"""
    out = {c: [] for c in CABLES}; out['deck'] = []
    for i, (p, T, L, U) in enumerate(fr):
        prm = params_at(i); fl = flush_at(i)
        for c in CABLES:
            lat, h, r = prm[c]
            inner = (c == 'railL' and route == 'T') or (c == 'railR' and route == 'L')
            if inner and fl > 0:
                h = h + (FLUSH[0] - h) * fl; r = r + (FLUSH[1] - r) * fl
            out[c].append((add(add(p, mul(L, lat)), mul(U, h)), r, prm['col'] if route == 'L' else (0.35, 0.8, 0.45)))
        out['deck'].append((p, prm['W'], L, U))
    return out


# ------------------------------------------------------------------ checks
def check_continuity(cp, S):
    """every cable is one list (by construction) -> check jumps: position step vs centreline step, radius step"""
    worst_pos, worst_r = 0.0, 0.0
    for c in CABLES:
        pts = cp[c]
        for k in range(1, len(pts)):
            ds = S[k] - S[k - 1]
            worst_pos = max(worst_pos, dist(pts[k][0], pts[k - 1][0]) - 3.0 * ds)   # loops scale offsets ~2.5x at 4 m laterals
            worst_r = max(worst_r, abs(pts[k][1] - pts[k - 1][1]) / max(ds, 1e-6))
    return round(max(0.0, worst_pos), 3), round(worst_r, 3)


def check_roll(fr, S, roll):
    worst = 0.0; flip = False
    for k in range(1, len(fr)):
        worst = max(worst, abs(math.degrees(roll[k] - roll[k - 1])) / max(1e-6, S[k] - S[k - 1]))
        if dot(fr[k][3], fr[k - 1][3]) < math.cos(math.radians(45)): flip = True
    return round(worst, 2), flip


def check_sc01(cp, info):
    """clearance of rails + deck edges of L to the SC01 MB pylon envelope (legs, crowns, portal beams)"""
    worst = dict(leg=1e9, crown=1e9, portal=1e9)
    cy = P['cable_y']; inner_leg = cy - P['leg_top_half']
    probes = [q for c in ('railL', 'railR') for q in cp[c]]
    for d in cp['deck']:
        p, W, L, U = d
        probes.append((add(p, mul(L, W / 2)), 0.0, None)); probes.append((add(p, mul(L, -W / 2)), 0.0, None))
        probes.append((sub(p, mul(U, P['deck_t'])), 0.0, None))
    for xp in (P['x_pyl_W'], P['x_pyl_E']):
        for q, r, _ in probes:
            x, y, z = q
            if abs(x - xp) < 3.0 and z < P['above_deck']:
                worst['leg'] = min(worst['leg'], inner_leg - abs(y) - r)
            for sy in (-1, 1):
                worst['crown'] = min(worst['crown'], dist(q, (xp, sy * cy, P['crown_z'])) - P['crown_r'] - r)
            if abs(x - xp) < P['portal_depth'] / 2 + 0.5 and abs(y) < cy:
                dz = z - P['portal_top']
                if dz > -8.0:
                    worst['portal'] = min(worst['portal'], dz - r)
    return {k: round(v, 2) for k, v in worst.items()}


def check_knot_gap(pts, M, x_p):
    """lateral edge gap of the two knot runs above the portal"""
    ys = [p[1] for i, p in enumerate(pts) if abs(p[0] - x_p) < 1.0 and M['loop1_in'] - 50 <= i <= M['loop2_out'] + 50 and p[2] < 60]
    return ys


def speeds_in_loops(pts, M, info):
    vmin = 1e9
    for a, b in (('loop1_in', 'loop1_out'), ('loop2_in', 'loop2_out')):
        for i in range(M[a], M[b] + 1):
            v = math.sqrt(max(0.0, P['v_launch'] ** 2 - 2 * P['g'] * (pts[i][2] - info['zb'])))
            vmin = min(vmin, min(P['v_max_locked'], max(P['v_min_locked'], v)))
    return round(vmin, 1), round(math.sqrt(P['g'] * info['r_top']), 1)


def build_all():
    T = route_T(); L, M, info = route_L()
    ST, SL = arclen(T), arclen(L)
    secs = sections_L(M, len(L))
    rollL = roll_channel(L, SL, secs); rollT = [0.0] * len(T)
    frL, frT = frames(L, rollL), frames(T, rollT)
    paramsL = lambda i: skin_params(secs, SL, i)
    paramsT = lambda i: dict(SKIN['road'])
    # junction flush factors: from the L lane's lateral position near split/merge
    def flushL(i):
        if i <= M['lift_start'] or i >= M['merge_start']:
            return junction_flush('L', L[i][0], L[i][1])
        return 0.0
    def yL_at_x(x):
        if info['x_split'] <= x <= info['x_split'] + P['s_len']:
            return P['y_T'] + (P['y_L'] - P['y_T']) * q5((x - info['x_split']) / P['s_len'])
        if info['x_merge_start'] <= x <= info['x_merge']:
            return P['y_L'] + (P['y_T'] - P['y_L']) * q5((x - info['x_merge_start']) / P['s_len'])
        return None
    def flushT(i):
        """T's inner (left) barrier hands over to L's outer barrier: L.railL starts exactly on T.railL; T.railL then dips
        flush over the first 20 m of the split (both coincide there), stays flush across the shared deck and rises again
        at the gore. At the merge the same in reverse: T.railL is back up during the last 20 m, where L.railL lies on it."""
        x = T[i][0]; y = yL_at_x(x)
        if y is None:
            return 0.0
        f = junction_flush('T', x, y)
        if x <= info['x_split'] + P['s_len']:
            return min(f, smooth((x - info['x_split']) / 20.0))
        return min(f, 1.0 - smooth((x - (info['x_merge'] - 20.0)) / 20.0))
    cpL = cable_points('L', L, frL, paramsL, flushL)
    cpT = cable_points('T', T, frT, paramsT, flushT)
    return dict(T=T, L=L, M=M, info=info, ST=ST, SL=SL, secs=secs, rollL=rollL, frL=frL, frT=frT, cpL=cpL, cpT=cpT)



# ================================================================== Blender layer (preview/oracle only)
import bpy, bmesh, json, os
from mathutils import Vector, kdtree

OUT = globals().get('LP_OUT', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/LP01-ELEVATED-LOOP/')
COLL = 'LP01_V4'


def coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.objects):
            bpy.data.objects.remove(o, do_unlink=True)
    else:
        c = bpy.data.collections.new(COLL); bpy.context.scene.collection.children.link(c)
    return c


def mat(name, rgb, rough=0.8):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1)
    return m


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


def box(bm, cx, cy, cz, sx, sy, sz):
    r = bmesh.ops.create_cube(bm, size=1.0)
    for v in r['verts']:
        v.co = Vector((cx + v.co.x * sx, cy + v.co.y * sy, cz + v.co.z * sz))


def deck_band(c, name, deck, z_off_at, rgb):
    """continuous deck band with per-sample width (the widest 'cable')"""
    bm = bmesh.new(); rings = []
    for i, (p, W, L, U) in enumerate(deck):
        dz = z_off_at(i)
        pp = Vector(p) + Vector((0, 0, dz)); Lv, Uv = Vector(L), Vector(U)
        rings.append([bm.verts.new(pp + Lv * o + Uv * h) for o, h in ((-W / 2, -P['deck_t']), (W / 2, -P['deck_t']), (W / 2, 0.0), (-W / 2, 0.0))])
    for A, B in zip(rings, rings[1:]):
        for k in range(4):
            bm.faces.new((A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k]))
    return mesh_from_bm(c, name, bm, rgb, 'deck')


def cable_obj(c, name, pts):
    """ONE spline per cable, radius per point; converted to mesh with per-vertex skin colour"""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.0; cu.bevel_resolution = 3
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for k, (q, r, col) in enumerate(pts):
        sp.points[k].co = (q[0], q[1], q[2], 1.0); sp.points[k].radius = max(r, 0.02)
    tmp = bpy.data.objects.new(name + '_tmp', cu); c.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get(); ev = tmp.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev); bpy.data.objects.remove(tmp, do_unlink=True); bpy.data.curves.remove(cu)
    kd = kdtree.KDTree(len(pts))
    for k, (q, r, col) in enumerate(pts):
        kd.insert(q, k)
    kd.balance()
    colour_attr(me, [pts[kd.find(v.co)[1]][2] for v in me.vertices])
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_lp01_role'] = 'cable'; o['kfb_cable_splines'] = 1
    return o


def sc01_reference(c):
    """SC01 MB pylons/portals/crowns/main cables as a light reference (existing bridge model, not new structure)"""
    bm = bmesh.new(); cy = P['cable_y']
    for xp in (P['x_pyl_W'], P['x_pyl_E']):
        for sy in (-1, 1):
            box(bm, xp, sy * cy, (P['above_deck'] - 4.0) / 2, 3.4, 2.6, P['above_deck'] + 4.0)
            s = bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=P['crown_r'])
            for v in s['verts']:
                v.co += Vector((xp, sy * cy, P['crown_z']))
        box(bm, xp, 0.0, P['portal_top'] - P['portal_th'] / 2, P['portal_depth'], 2 * cy, P['portal_th'])
    o = mesh_from_bm(c, 'SC01_MB_REF_pylons', bm, (0.82, 0.8, 0.76), 'sc01_reference')
    # main cables (parabolic sag between the tops, straight to the anchors), both sides
    for sy in (-1, 1):
        pts = []
        for x in lin(P['x_anchor_W'], P['x_pyl_W'], 5.0):
            t = (x - P['x_anchor_W']) / (P['x_pyl_W'] - P['x_anchor_W']); pts.append((x, sy * cy, -2.5 + (P['above_deck'] + 2.5) * t))
        span = P['x_pyl_E'] - P['x_pyl_W']
        for x in lin(P['x_pyl_W'], P['x_pyl_E'], 5.0)[1:]:
            t = (x - P['x_pyl_W']) / span; pts.append((x, sy * cy, 2.4 + (P['above_deck'] - 2.4) * (2 * t - 1) ** 2))
        for x in lin(P['x_pyl_E'], P['x_anchor_E'], 5.0)[1:]:
            t = (x - P['x_pyl_E']) / (P['x_anchor_E'] - P['x_pyl_E']); pts.append((x, sy * cy, P['above_deck'] - (P['above_deck'] + 2.5) * t))
        cable_obj(c, f'SC01_MB_REF_main_cable_{"L" if sy > 0 else "R"}', [(q, 0.55, (0.82, 0.8, 0.76)) for q in pts])
    return o


def run():
    R = build_all(); info = R['info']; c = coll()
    # bridge deck slab
    bm = bmesh.new(); box(bm, 190.0, 0.0, -P['deck_t'] - 1.0, 1420.0, 2 * P['deck_half'], 2.0)
    mesh_from_bm(c, 'LP01_bridge_deck', bm, (0.5, 0.5, 0.52), 'bridge_deck')
    sc01_reference(c)
    M = R['M']
    deck_band(c, 'LP01_T_deck', R['cpT']['deck'], lambda i: 0.0, (0.24, 0.24, 0.26))
    deck_band(c, 'LP01_L_deck', R['cpL']['deck'],
              lambda i: -0.03 if (i <= M['lift_start'] or i >= M['merge_start']) else 0.0, (0.22, 0.22, 0.25))
    for route, cp in (('T', R['cpT']), ('L', R['cpL'])):
        for cab in CABLES:
            cable_obj(c, f'LP01_{route}_cable_{cab}', cp[cab])
    return R


def export(R):
    info = R['info']; M = R['M']; SL = R['SL']
    secs_out = []
    for sc in R['secs']:
        secs_out.append(dict(s0=round(SL[sc['i0']], 2), s1=round(SL[sc['i1']], 2), skin=sc['skin'], mode=sc['mode'], roll_law=sc['roll_law']))
    to_rt = lambda q: [round(q[0], 3), round(q[2], 3), round(-q[1], 3)]
    ck = dict(continuity_L=check_continuity(R['cpL'], R['SL']), continuity_T=check_continuity(R['cpT'], R['ST']),
              cable_splines_per_route=1, roll=check_roll(R['frL'], R['SL'], R['rollL']), sc01_clearance=check_sc01(R['cpL'], info),
              loop_speed=speeds_in_loops(R['L'], M, info))
    data = dict(schema='kfb.route-proof.v0', spec='TRACK_MODES_AND_SKINS_SPEC_v0.1 (+ cable rule for v0.2)',
                id='lp01-skydeck-double-loop', status='ROUTE PROOF v4 · sky-deck double loop on SC01 MB · continuous cables',
                params=P, info={k: round(v, 3) for k, v in info.items()}, checks=ck,
                cable_rule='each cable is ONE continuous strand per route; skins are parameter presets blended over trans_len; '
                           'inner rails go flush on shared junction decks and hand over to the branch outer rail',
                skins={k: {kk: vv for kk, vv in v.items()} for k, v in SKIN.items()},
                routes=dict(T_through=dict(samples=[dict(s=round(s, 2), p=to_rt(p)) for s, p in zip(R['ST'], R['T'])],
                                           sections=[dict(s0=0.0, s1=round(R['ST'][-1], 2), skin='road', mode='free', roll_law='auto_bank')]),
                            L_skydeck=dict(samples=[dict(s=round(s, 2), p=to_rt(p), roll=round(r, 4)) for s, p, r in zip(SL, R['L'], R['rollL'])],
                                           sections=secs_out)),
                zones=[dict(id='capture_lift', kind='capture', s0=round(SL[M['lift_start']], 2), s1=round(SL[M['lift_start']] + 40, 2),
                            params=dict(heading_err_deg=25, lat_off_max=6.0, v_lo=15.0, v_hi=40.0, blend_t=0.45)),
                       dict(id='release_runout', kind='release', s0=round(SL[M['drop_end']], 2), s1=round(SL[M['drop_end']] + 10, 2))],
                junctions=[dict(id='skydeck_split', kind='junction', x=round(info['x_split'], 2), decision_window_m=P['decision_window'],
                                default_option='T_through',
                                options=[dict(route='T_through', mode='free', hint='arrow_straight'),
                                         dict(route='L_skydeck', mode='assist', hint='arrow_left_magnet_lift')]),
                           dict(id='skydeck_merge', kind='merge', x=round(info['x_merge'], 2))],
                sockets=[dict(id='portal_W_knot', kind='sc01_pylon', x=P['x_pyl_W']), dict(id='portal_E_knot', kind='sc01_pylon', x=P['x_pyl_E'])])
    os.makedirs(OUT, exist_ok=True)
    json.dump(data, open(OUT + 'lp01_v4.routes.json', 'w'), indent=1)
    return ck


R = run()
result = dict(objects=len(bpy.data.collections[COLL].objects), info={k: round(v, 2) for k, v in R['info'].items()}, checks=export(R))
