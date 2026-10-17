"""LP01 · Elevated loop with free underpass + lane-change split · route proof v2 · Claude Coworker 27.09.2026
Georg's idea (27.09): the loop gets its own climb; keep right = straight through UNDER the loop at full speed,
keep left = lane change (small drift) -> climb -> loop -> descent -> merge. Built on a bridge deck.
v2 (Georg 27.09): v1 ring was a squashed mini loop -> now a big CLASSIC loop (clothoid / teardrop, 50 m high),
earlier and longer run-up, cartoon physics budget explicit. NO structure in the proof (v1 beams/hangers crossed the
track and were not cartoon): structures come from the design-language job, not from here.
v2 also adds real junction pieces (split / merge = 'Weiche'): shared widened deck up to a gore nose, inner edges and
barriers start at the nose, dashed lane divider across the junction. v1 had two decks simply overlapping.
Centrelines + ribbon-cable layers only (one centreline -> parallel layers). Preview/oracle, NOT a second SSOT:
the Track Core builds the drivable surface from the exported routes.
Blender frame: x forward, y left, z up, metres. exec globals: LP_OUT."""
import bpy, bmesh, math, json, os
from mathutils import Vector

OUT = globals().get('LP_OUT', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/LP01-ELEVATED-LOOP/')
P = dict(lane=10.8, shoulder=0.6, deck_t=0.45, v_full=27.0, g=9.81,
         x_start=-480.0, x_end=480.0, x_split=-400.0, s_len=110.0, shift=16.0, gore_gap=1.4,
         climb_len=200.0, ramp_frac=0.2, z_base=10.0, flat=30.0, loop_H=50.0,
         bridge_w=64.0, bridge_t=2.0, clear_req=5.0)
W = P['lane'] + 2 * P['shoulder']
COLL = 'LP01_LOOP'


# ---------------------------------------------------------------- helpers
def coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.objects):
            bpy.data.objects.remove(o, do_unlink=True)
    else:
        c = bpy.data.collections.new(COLL); bpy.context.scene.collection.children.link(c)
    return c


def mat(name, rgb, rough=0.85):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    m.diffuse_color = (*rgb, 1)
    return m


def mesh_obj(c, name, bm, m, role):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(m)
    o = bpy.data.objects.new(name, me); c.objects.link(o)
    o['kfb_module'] = 'scenery_shell'; o['kfb_lp01_role'] = role
    return o


def q5(t):                       # quintic smoothstep: curvature-continuous lateral S / corkscrew
    t = min(1.0, max(0.0, t)); return t * t * t * (10 - 15 * t + 6 * t * t)


def ramp(t, f):                  # height profile: linear grade with parabolic vertical curves (fraction f each end)
    t = min(1.0, max(0.0, t)); gmax = 1.0 / (1.0 - f)
    if t < f:
        return gmax * t * t / (2 * f)
    if t > 1 - f:
        u = 1 - t; return 1.0 - gmax * u * u / (2 * f)
    return gmax * (t - f / 2)


def lin(a, b, step=1.0):
    n = max(1, int(abs(b - a) / step)); return [a + (b - a) * i / n for i in range(n + 1)]


def frames(pts, guide=Vector((0.0, 1.0, 0.0))):
    """guide-vector frames: lateral L = world +y projected perpendicular to the tangent; up U = T x L.
    v1 used rotation-minimising frames -> the corkscrew loop gave ~126 deg roll at the loop exit (holonomy).
    Lesson for the Track Core: a loop needs an explicit roll law, not free parallel transport."""
    P3 = [Vector(p) for p in pts]; n = len(P3); out = []
    for i in range(n):
        T = (P3[min(n - 1, i + 1)] - P3[max(0, i - 1)]).normalized()
        L = (guide - guide.dot(T) * T).normalized()
        out.append((P3[i], T, L, T.cross(L).normalized()))
    return out


def sweep(bm, fr, o0, o1, h0, h1):
    """band between lateral offsets o0..o1 and heights h0..h1 (local frame)"""
    rings = []
    for p, t, l, u in fr:
        rings.append([bm.verts.new(p + l * o + u * h) for o, h in ((o0, h0), (o1, h0), (o1, h1), (o0, h1))])
    for A, B in zip(rings, rings[1:]):
        for k in range(4):
            bm.faces.new((A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])


# ---------------------------------------------------------------- routes
def route_through():
    return [(x, 0.0, 0.0) for x in lin(P['x_start'], P['x_end'], 2.0)]


def clothoid_loop(H, n=400):
    """classic loop: curvature rises linearly 0 -> k_max at the top, then falls back to 0 (teardrop, no curvature jump).
    local 2D (u forward, v up), scaled to height H. returns points, top radius"""
    L = 1.0; a = math.pi / (L * L / 2); N = 8000; ds = 2 * L / N
    u = v = th = 0.0; raw = [(0.0, 0.0)]
    for i in range(N):
        s_ = (i + 0.5) * ds; k = a * s_ if s_ <= L else a * (2 * L - s_)
        th += k * ds; u += math.cos(th) * ds; v += math.sin(th) * ds; raw.append((u, v))
    sc = H / max(p[1] for p in raw)
    pts = [(raw[int(N * i / n)][0] * sc, raw[int(N * i / n)][1] * sc) for i in range(n + 1)]
    return pts, sc / (a * L)


def route_loop_branch():
    """split S -> long climb -> flat -> classic clothoid loop (lateral shift +sh -> -sh) -> flat -> descent -> merge S"""
    sh, zb = P['shift'], P['z_base']; pts = []; marks = {}
    x = P['x_split']
    for xx in lin(x, x + P['s_len'], 1.0):
        pts.append((xx, sh * q5((xx - x) / P['s_len']), 0.0))
    x += P['s_len']; marks['climb_start'] = len(pts) - 1
    for xx in lin(x, x + P['climb_len'], 1.0)[1:]:
        pts.append((xx, sh, zb * ramp((xx - x) / P['climb_len'], P['ramp_frac'])))
    x += P['climb_len']
    for xx in lin(x, x + P['flat'], 1.0)[1:]:
        pts.append((xx, sh, zb))
    x += P['flat']; marks['loop_entry'] = len(pts) - 1; x0 = x
    lp, r_top = clothoid_loop(P['loop_H']); n = len(lp) - 1
    for i, (u, v) in enumerate(lp[1:], 1):
        pts.append((x0 + u, sh - 2 * sh * q5(i / n), zb + v))
    marks['loop_exit'] = len(pts) - 1; x = x0 + lp[-1][0]
    for xx in lin(x, x + P['flat'], 1.0)[1:]:
        pts.append((xx, -sh, zb))
    x += P['flat']
    for xx in lin(x, x + P['climb_len'], 1.0)[1:]:
        pts.append((xx, -sh, zb * (1 - ramp((xx - x) / P['climb_len'], P['ramp_frac']))))
    x += P['climb_len']; marks['merge_start'] = len(pts) - 1; P['_x_merge_start'] = x
    for xx in lin(x, x + P['s_len'], 1.0)[1:]:
        pts.append((xx, -sh * (1 - q5((xx - x) / P['s_len'])), 0.0))
    marks['merge'] = len(pts) - 1
    P['_r_top'] = r_top; P['_loop_len'] = lp[-1][0]
    return pts, marks, x0


# ---------------------------------------------------------------- junctions (split / merge = one Track Core piece each)
def yL_split(x):
    return P['shift'] * q5((x - P['x_split']) / P['s_len'])


def yL_merge(x):
    return -P['shift'] * (1 - q5((x - P['_x_merge_start']) / P['s_len']))


def junctions():
    """gore nose = where the two decks separate by gore_gap (centre distance W + gap)"""
    d = W + P['gore_gap']; xs = P['x_split']; xm0 = P['_x_merge_start']
    xg1 = next(x for x in lin(xs, xs + P['s_len'], 0.1) if yL_split(x) >= d)
    xg2 = next(x for x in lin(xm0, xm0 + P['s_len'], 0.1) if abs(yL_merge(x)) <= d)
    return dict(x_split=xs, x_gore_split=round(xg1, 1), x_gore_merge=round(xg2, 1), x_merge=xm0 + P['s_len'])


# ---------------------------------------------------------------- build
def build(c, thr, lb, marks, x0):
    m_bridge = mat('LP01_bridge', (0.5, 0.5, 0.52)); m_deck = mat('LP01_deck', (0.22, 0.22, 0.24))
    
    # bridge deck under everything (top = underside of the road decks)
    bm = bmesh.new(); r = bmesh.ops.create_cube(bm, size=1.0)
    L = P['x_end'] - P['x_start']
    for v in r['verts']:
        v.co = Vector(((P['x_start'] + P['x_end']) / 2 + v.co.x * L, v.co.y * P['bridge_w'],
                       -P['deck_t'] - P['bridge_t'] / 2 + v.co.z * P['bridge_t']))
    mesh_obj(c, 'LP01_bridge_deck', bm, m_bridge, 'bridge_deck')
    # road decks with real junction pieces ("Weiche"): widened shared deck from split to gore nose, then two decks
    # separated by the gore gap; same at the merge. No overlapping / z-fighting decks.
    J = junctions(); xs, xg1, xg2, xm = J['x_split'], J['x_gore_split'], J['x_gore_merge'], J['x_merge']
    def strip(nm, x0_, x1_, y_lo, y_hi):
        bm = bmesh.new(); xs_ = lin(x0_, x1_, 1.0); top = []; bot = []
        for x in xs_:
            lo, hi = y_lo(x), y_hi(x)
            top.append((bm.verts.new((x, lo, 0.0)), bm.verts.new((x, hi, 0.0))))
            bot.append((bm.verts.new((x, lo, -P['deck_t'])), bm.verts.new((x, hi, -P['deck_t']))))
        for k in range(len(xs_) - 1):
            (a0, a1), (b0, b1) = top[k], top[k + 1]; (c0, c1), (d0, d1) = bot[k], bot[k + 1]
            bm.faces.new((a0, b0, b1, a1)); bm.faces.new((c1, d1, d0, c0))
            bm.faces.new((c0, d0, b0, a0)); bm.faces.new((a1, b1, d1, c1))
        mesh_obj(c, f'LP01_{nm}', bm, m_deck, nm)
    h = W / 2
    strip('through_deck_A', P['x_start'], xs, lambda x: -h, lambda x: h)
    strip('junction_split_deck', xs, xg1, lambda x: -h, lambda x: yL_split(x) + h)
    strip('through_deck_B', xg1, xg2, lambda x: -h, lambda x: h)
    strip('junction_merge_deck', xg2, xm, lambda x: yL_merge(x) - h, lambda x: h)
    strip('through_deck_C', xm, P['x_end'], lambda x: -h, lambda x: h)
    i1 = min(range(len(lb)), key=lambda i: abs(lb[i][0] - xg1) if i < marks['loop_entry'] else 1e9)
    i2 = min(range(len(lb)), key=lambda i: abs(lb[i][0] - xg2) if i > marks['loop_exit'] else 1e9)
    bm = bmesh.new(); sweep(bm, frames(lb)[i1:i2 + 1], -W / 2, W / 2, -P['deck_t'], 0.0)
    mesh_obj(c, 'LP01_loop_branch_deck', bm, m_deck, 'loop_branch_deck')
    # gore noses (crash-cushion markers, part of the junction piece)
    m_nose = mat('LP01_gore_nose', (0.98, 0.62, 0.1), 0.5)
    for xg, yg in ((xg1, (h + yL_split(xg1) - h) / 2), (xg2, (yL_merge(xg2) - h + h) / 2)):
        bm = bmesh.new(); cyl = bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.7, radius2=0.7, depth=1.2)
        for v in cyl['verts']:
            v.co += Vector((xg, yg, 0.6))
        mesh_obj(c, f'LP01_gore_nose_{int(xg)}', bm, m_nose, 'gore_nose')
    ns = nh = 0                                   # v2: no structure in the route proof (see header)
    return ns, nh


# ---------------------------------------------------------------- ribbon-cable layers (the layer set = input for the layer spec)
LAYERS = [('edgeL', P['lane'] / 2, 0.08, 0.18), ('edgeR', -P['lane'] / 2, 0.08, 0.18), ('centre', 0.0, 0.08, 0.10),
          ('barrierL', W / 2 + 0.2, 1.0, 0.25), ('barrierR', -W / 2 - 0.2, 1.0, 0.25)]


def layer_state(route, tag, x, i, marks):
    """junction rules: 'solid' | 'dash' | None. Inner edges/barriers vanish on the shared junction deck and start at the
    gore nose; the inner edge line of the through lane is a dashed lane divider across the junction."""
    J = junctions(); xs, xg1, xg2, xm = J['x_split'], J['x_gore_split'], J['x_gore_merge'], J['x_merge']
    if route == 'T':
        if xs < x < xg1 and tag in ('edgeL', 'barrierL'):
            return 'dash' if tag == 'edgeL' else None
        if xg2 < x < xm and tag in ('edgeR', 'barrierR'):
            return 'dash' if tag == 'edgeR' else None
        return 'solid'
    if i <= marks['loop_entry'] and x < xg1:                   # branch on the shared split deck
        return 'solid' if tag in ('edgeL', 'barrierL') else None
    if i >= marks['loop_exit'] and x > xg2:                    # branch on the shared merge deck
        return 'solid' if tag in ('edgeR', 'barrierR') else None
    return 'solid'


def ribbons(c, name, route, pts, color, marks):
    m = mat(f'LP01_ribbon_{name}', color, 0.4); fr = frames(pts)
    for tag, off, h, bev in LAYERS:
        cu = bpy.data.curves.new(f'LP01_rib_{name}_{tag}', 'CURVE'); cu.dimensions = '3D'
        cu.bevel_depth = bev; cu.bevel_resolution = 2; run = []
        def flush():
            if len(run) > 1:
                sp = cu.splines.new('POLY'); sp.points.add(len(run) - 1)
                for k, q in enumerate(run):
                    sp.points[k].co = (q.x, q.y, q.z, 1.0)
            run.clear()
        s_acc = 0.0; prev = None
        for i, (p, t, l, u) in enumerate(fr):
            if prev is not None:
                s_acc += (p - prev).length
            prev = p
            st = layer_state(route, tag, p.x, i, marks)
            if st == 'dash' and (s_acc % 6.0) > 3.0:
                st = None
            if st is None:
                flush(); continue
            run.append(p + l * off + u * h)
        flush()
        cu.materials.append(m)
        o = bpy.data.objects.new(cu.name, cu); c.objects.link(o); o['kfb_lp01_role'] = 'route_preview'


# ---------------------------------------------------------------- checks
def checks(lb, marks):
    g, v0, zb, H, rt = P['g'], P['v_full'], P['z_base'], P['loop_H'], P['_r_top']
    k_s = P['shift'] * (10 / math.sqrt(3)) / P['s_len'] ** 2               # max curvature of the quintic S
    gr = []
    for i in list(range(marks['climb_start'], marks['loop_entry'])) + list(range(marks['loop_exit'], marks['merge_start'])):
        a, b = lb[i], lb[i + 1]; gr.append(abs(b[2] - a[2]) / (math.hypot(b[0] - a[0], b[1] - a[1]) or 1e-9))
    v_entry2 = v0 ** 2 - 2 * g * zb                                         # real physics after the climb
    v_need2 = 2 * g * H + g * rt                                            # needed at the loop base to reach the top
    # underpass: whole loop-branch deck width over the through-lane band |y| < W/2 -> clear height above the road
    fr = frames(lb); clear = []
    for i, (p, t, l, u) in enumerate(fr):
        if i < marks['climb_start'] or i > marks['merge_start']:
            continue
        for k in range(-4, 5):
            q = p + l * (k * W / 8) - u * P['deck_t']                        # underside of the deck
            if abs(q.y) < W / 2 and q.z > 0.5:
                clear.append(q.z)
    # side gap to the through lane where both run low (edge to edge), outside the split/merge S-curves
    gaps = [abs(p[1]) - W for i, p in enumerate(lb) if marks['climb_start'] <= i <= marks['merge_start'] and p[2] < P['clear_req'] + P['deck_t']]
    # self-clearance of the ring (non-neighbouring samples)
    ring = lb[marks['loop_entry'] - 40: marks['loop_exit'] + 40]; self_min = 1e9
    for i in range(0, len(ring), 2):
        for j in range(i + 120, len(ring), 2):
            self_min = min(self_min, math.dist(ring[i], ring[j]))
    return dict(split_S_len_m=P['s_len'], split_shift_m=P['shift'], split_min_radius_m=round(1 / k_s, 1),
                split_lat_acc_g_at_full=round(v0 ** 2 * k_s / g, 2),
                climb_len_m=P['climb_len'], max_grade_pct=round(100 * max(gr), 2), loop_base_z_m=zb,
                loop_height_m=H, loop_top_z_m=zb + H, loop_top_radius_m=round(rt, 1), loop_footprint_len_m=round(P['_loop_len'], 1),
                loop_shift_m=2 * P['shift'],
                speed_full_ms=v0, speed_loop_base_real_ms=round(math.sqrt(v_entry2), 1),
                speed_loop_base_needed_ms=round(math.sqrt(v_need2), 1),
                cartoon_boost_factor=round(math.sqrt(v_need2 / v_entry2), 2),
                underpass_min_clear_m=round(min(clear), 2) if clear else None,
                side_gap_to_through_min_m=round(min(gaps), 2) if gaps else None,
                ring_self_clear_min_m=round(self_min, 2))


def to_rt(pts):
    return [[round(x, 3), round(z, 3), round(-y, 3)] for x, y, z in pts]


c = coll()
thr = route_through(); lb, marks, x0 = route_loop_branch()
ns, nh = build(c, thr, lb, marks, x0)
ribbons(c, 'through', 'T', thr, (0.35, 0.8, 0.45), marks); ribbons(c, 'loop_branch', 'L', lb, (0.95, 0.4, 0.3), marks)
ck = checks(lb, marks); ck.update(junctions())
os.makedirs(OUT, exist_ok=True)
json.dump(dict(schema='kfb.route-proof.v0', id='lp01-elevated-loop-underpass', status='ROUTE PROOF v2 · big classic loop · centrelines + checks, no structure',
               recipe='split S -> long climb -> classic clothoid loop (lateral shift) over the through lane -> descent -> merge S (one core, pieces as data)',
               params=P, checks=ck,
               ribbon_layers=[dict(id=t, lateral_m=round(o, 2), height_m=h) for t, o, h, b in LAYERS],
               routes=dict(T_through=to_rt(thr), L_loop_branch=to_rt(lb)),
               sockets=[dict(id='split', route='T_through', x=P['x_split']), dict(id='climb_start', route='L_loop_branch', i=marks['climb_start']),
                        dict(id='loop_entry', route='L_loop_branch', i=marks['loop_entry']),
                        dict(id='loop_exit', route='L_loop_branch', i=marks['loop_exit']),
                        dict(id='merge', route='L_loop_branch', i=marks['merge'])]),
          open(OUT + 'lp01_loop.routes.json', 'w'), indent=1)
result = dict(objects=len(c.objects), checks=ck)
