"""LP01 · Elevated loop with free underpass + lane-change split · route proof v1 · Claude Coworker 27.09.2026
Georg's idea (27.09): the loop gets its own climb; keep right = straight through UNDER the loop at full speed,
keep left = lane change (small drift) -> climb -> loop -> descent -> merge. Built on a bridge deck; the loop ring hangs
between two SC01-style pylons, the elevated run-up / run-out stands on SC02b classic supports (proxies here).
Centrelines + ribbon-cable layers only (one centreline -> parallel layers). Preview/oracle, NOT a second SSOT:
the Track Core builds the drivable surface from the exported routes.
Blender frame: x forward, y left, z up, metres. exec globals: LP_OUT."""
import bpy, bmesh, math, json, os
from mathutils import Vector

OUT = globals().get('LP_OUT', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/LP01-ELEVATED-LOOP/')
P = dict(lane=10.8, shoulder=0.6, deck_t=0.45, v_full=27.0, g=9.81,
         x_start=-420.0, x_end=320.0, x_split=-330.0, s_len=110.0, shift=14.0,
         climb_len=120.0, ramp_frac=0.2, z_base=7.5, flat=20.0, R=11.0,
         support_step=15.0, support_r=0.9, pylon_off=25.0, pylon_h=45.0, beam_z=42.0,
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


def route_loop_branch():
    """split S-curve -> climb -> flat -> corkscrew loop (+shift -> -shift) -> flat -> descent -> merge S-curve.
    returns points and named section boundaries (index)"""
    sh, zb, R = P['shift'], P['z_base'], P['R']; pts = []; marks = {}
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
    n = 160
    for i in range(1, n + 1):
        th = 2 * math.pi * i / n
        pts.append((x0 + R * math.sin(th), sh - 2 * sh * q5(i / n), zb + R * (1 - math.cos(th))))
    marks['loop_exit'] = len(pts) - 1
    for xx in lin(x, x + P['flat'], 1.0)[1:]:
        pts.append((xx, -sh, zb))
    x += P['flat']
    for xx in lin(x, x + P['climb_len'], 1.0)[1:]:
        pts.append((xx, -sh, zb * (1 - ramp((xx - x) / P['climb_len'], P['ramp_frac']))))
    x += P['climb_len']; marks['merge_start'] = len(pts) - 1
    for xx in lin(x, x + P['s_len'], 1.0)[1:]:
        pts.append((xx, -sh * (1 - q5((xx - x) / P['s_len'])), 0.0))
    marks['merge'] = len(pts) - 1
    return pts, marks, x0


# ---------------------------------------------------------------- build
def build(c, thr, lb, marks, x0):
    m_bridge = mat('LP01_bridge', (0.5, 0.5, 0.52)); m_deck = mat('LP01_deck', (0.22, 0.22, 0.24))
    m_sup = mat('LP01_support_classic', (0.68, 0.66, 0.62)); m_pyl = mat('LP01_pylon', (0.6, 0.58, 0.55))
    # bridge deck under everything (top = underside of the road decks)
    bm = bmesh.new(); r = bmesh.ops.create_cube(bm, size=1.0)
    L = P['x_end'] - P['x_start']
    for v in r['verts']:
        v.co = Vector(((P['x_start'] + P['x_end']) / 2 + v.co.x * L, v.co.y * P['bridge_w'],
                       -P['deck_t'] - P['bridge_t'] / 2 + v.co.z * P['bridge_t']))
    mesh_obj(c, 'LP01_bridge_deck', bm, m_bridge, 'bridge_deck')
    # road decks (thin shells, Track Core will replace)
    for nm, pts in (('through', thr), ('loop_branch', lb)):
        bm = bmesh.new(); sweep(bm, frames(pts), -W / 2, W / 2, -P['deck_t'], 0.0)
        mesh_obj(c, f'LP01_{nm}_deck', bm, m_deck, f'{nm}_deck')
    # SC02b classic support proxies under the elevated run-up / run-out (not under the ring)
    bm = bmesh.new(); ns = 0; last = -1e9
    fr = frames(lb)
    for i, (p, t, l, u) in enumerate(fr):
        if marks['loop_entry'] < i < marks['loop_exit']:
            continue
        if p.z - P['deck_t'] < 1.5 or abs(p.x - last) < P['support_step']:
            continue
        last = p.x; top = p.z - P['deck_t']
        cyl = bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=P['support_r'], radius2=P['support_r'] * 0.85, depth=top)
        for v in cyl['verts']:
            v.co += Vector((p.x, p.y, top / 2))
        cap = bmesh.ops.create_cube(bm, size=1.0)
        for v in cap['verts']:
            v.co = Vector((p.x + v.co.x * 2.4, p.y + v.co.y * (W - 1), top - 0.4 + v.co.z * 0.8))
        ns += 1
    mesh_obj(c, 'LP01_supports_SC02b_classic_proxy', bm, m_sup, 'supports')
    # SC01-style pylon pair + crossbeam + hangers carrying the loop ring
    bm = bmesh.new()
    for sy in (1, -1):
        pyl = bmesh.ops.create_cube(bm, size=1.0)
        for v in pyl['verts']:
            v.co = Vector((x0 + v.co.x * 3.5, sy * P['pylon_off'] + v.co.y * 3.5, (v.co.z + 0.5) * P['pylon_h']))
    beam = bmesh.ops.create_cube(bm, size=1.0)
    for v in beam['verts']:
        v.co = Vector((x0 + v.co.x * 3.0, v.co.y * (2 * P['pylon_off'] + 3.5), P['beam_z'] + v.co.z * 2.5))
    mesh_obj(c, 'LP01_pylons_SC01_style', bm, m_pyl, 'pylons')
    bm = bmesh.new(); nh = 0
    ring = lb[marks['loop_entry']:marks['loop_exit'] + 1]
    for k in range(1, 8):
        p = Vector(ring[int(len(ring) * k / 8)])
        if p.z < P['z_base'] + 2:
            continue
        a = Vector((x0, p.y, P['beam_z'] - 1.25)); d = a - p
        cy = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.15, radius2=0.15, depth=d.length)
        rotq = Vector((0, 0, 1)).rotation_difference(d.normalized())
        for v in cy['verts']:
            v.co = p + d / 2 + rotq @ v.co
        nh += 1
    mesh_obj(c, 'LP01_hangers', bm, m_pyl, 'hangers')
    return ns, nh


# ---------------------------------------------------------------- ribbon-cable layers (the layer set = input for the layer spec)
LAYERS = [('edgeL', -P['lane'] / 2, 0.08, 0.18), ('edgeR', P['lane'] / 2, 0.08, 0.18), ('centre', 0.0, 0.08, 0.10),
          ('barrierL', -W / 2 - 0.2, 1.0, 0.25), ('barrierR', W / 2 + 0.2, 1.0, 0.25)]


def ribbons(c, name, pts, color):
    m = mat(f'LP01_ribbon_{name}', color, 0.4); fr = frames(pts)
    for tag, off, h, bev in LAYERS:
        cu = bpy.data.curves.new(f'LP01_rib_{name}_{tag}', 'CURVE'); cu.dimensions = '3D'
        cu.bevel_depth = bev; cu.bevel_resolution = 2
        sp = cu.splines.new('POLY'); sp.points.add(len(fr) - 1)
        for i, (p, t, l, u) in enumerate(fr):
            q = p + l * off + u * h; sp.points[i].co = (q.x, q.y, q.z, 1.0)
        cu.materials.append(m)
        o = bpy.data.objects.new(cu.name, cu); c.objects.link(o); o['kfb_lp01_role'] = 'route_preview'


# ---------------------------------------------------------------- checks
def checks(lb, marks):
    g, v0, R, zb = P['g'], P['v_full'], P['R'], P['z_base']
    k_s = P['shift'] * (10 / math.sqrt(3)) / P['s_len'] ** 2               # max curvature of the quintic S
    # grades outside the ring
    gr = []
    for i in list(range(marks['climb_start'], marks['loop_entry'])) + list(range(marks['loop_exit'], marks['merge_start'])):
        a, b = lb[i], lb[i + 1]; gr.append(abs(b[2] - a[2]) / (math.hypot(b[0] - a[0], b[1] - a[1]) or 1e-9))
    v_entry2 = v0 ** 2 - 2 * g * zb; v_top2 = v_entry2 - 2 * g * 2 * R
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
        for j in range(i + 60, len(ring), 2):
            self_min = min(self_min, math.dist(ring[i], ring[j]))
    return dict(split_S_len_m=P['s_len'], split_shift_m=P['shift'], split_min_radius_m=round(1 / k_s, 1),
                split_lat_acc_g_at_full=round(v0 ** 2 * k_s / g, 2),
                climb_len_m=P['climb_len'], max_grade_pct=round(100 * max(gr), 2), loop_base_z_m=zb,
                loop_R_m=R, loop_top_z_m=zb + 2 * R, corkscrew_shift_m=2 * P['shift'],
                speed_full_ms=v0, speed_loop_entry_ms=round(math.sqrt(v_entry2), 1),
                speed_loop_top_ms=round(math.sqrt(max(0, v_top2)), 1), speed_top_required_ms=round(math.sqrt(g * R), 1),
                loop_entry_load_g_circular=round(v_entry2 / R / g + 1, 1),
                underpass_min_clear_m=round(min(clear), 2) if clear else None,
                side_gap_to_through_min_m=round(min(gaps), 2) if gaps else None,
                ring_self_clear_min_m=round(self_min, 2))


def to_rt(pts):
    return [[round(x, 3), round(z, 3), round(-y, 3)] for x, y, z in pts]


c = coll()
thr = route_through(); lb, marks, x0 = route_loop_branch()
ns, nh = build(c, thr, lb, marks, x0)
ribbons(c, 'through', thr, (0.35, 0.8, 0.45)); ribbons(c, 'loop_branch', lb, (0.95, 0.4, 0.3))
ck = checks(lb, marks)
os.makedirs(OUT, exist_ok=True)
json.dump(dict(schema='kfb.route-proof.v0', id='lp01-elevated-loop-underpass', status='ROUTE PROOF v1 · centrelines + checks',
               recipe='split S -> climb -> corkscrew loop over the through lane -> descent -> merge S (one core, pieces as data)',
               params=P, checks=ck,
               ribbon_layers=[dict(id=t, lateral_m=round(o, 2), height_m=h) for t, o, h, b in LAYERS],
               routes=dict(T_through=to_rt(thr), L_loop_branch=to_rt(lb)),
               sockets=[dict(id='split', route='T_through', x=P['x_split']), dict(id='climb_start', route='L_loop_branch', i=marks['climb_start']),
                        dict(id='loop_entry', route='L_loop_branch', i=marks['loop_entry']),
                        dict(id='loop_exit', route='L_loop_branch', i=marks['loop_exit']),
                        dict(id='merge', route='L_loop_branch', i=marks['merge'])]),
          open(OUT + 'lp01_loop.routes.json', 'w'), indent=1)
result = dict(objects=len(c.objects), supports=ns, hangers=nh, checks=ck)
