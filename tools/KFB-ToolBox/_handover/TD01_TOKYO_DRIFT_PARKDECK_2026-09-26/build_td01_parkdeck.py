"""TD01 · Tokyo-Drift parking deck · raw build (form + scale only, no look) · Claude Coworker 26.09.2026
For Elisa (Georg, 26.09). Scenery shell + route sockets only: the drivable surface comes later from the Track Core
(W0 frame stream). This file gives: building shell, helix ramp shell, roof drift deck, and the route centrelines as JSON.

Concept
- Central HELIX ramp, one full turn per level, levels every 4.0 m, 5 turns: street (z 0) -> roof (z 20).
  Centre radius 22 m, lane 10.8 m (+0.6 shoulders = 12 m deck). Grade = 4 / (2*pi*22) = 2.9 % (calm, drift-friendly).
- Square car-park floors (90 x 90 m) around the helix, with a round hole the helix passes through.
  At angle 0 of every turn the helix is exactly at floor level -> 14 m gap in the outer parapet = level entry.
- Roof = open drift deck with a perimeter parapet; the helix arrives at its hole. A rounded-rectangle drift loop is
  exported as a second route.
- Hollow core cylinder inside the helix (lift/stair tower look), columns on an 8.5 m grid on the floors.
Units metres, Blender z-up. exec globals: TD_OUT (folder), TD_EXPORT (bool)."""
import bpy, bmesh, math, json, os
from mathutils import Vector

OUT = globals().get('TD_OUT', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TD01-TOKYO-DRIFT/')
P = dict(levels=5, floor_h=4.0, R=22.0, lane=10.8, shoulder=0.6, deck_t=0.45, parapet_h=1.1, parapet_t=0.3,
         seg_per_turn=96, slab=90.0, slab_t=0.5, entry_gap=14.0, core_r=13.0, core_wall=0.6,
         col=0.6, col_grid=8.5, roof_parapet=1.2)
W = P['lane'] + 2 * P['shoulder']
R_IN, R_OUT = P['R'] - W / 2, P['R'] + W / 2
H_TOP = P['levels'] * P['floor_h']
COLL = 'TD01_PARKDECK'


def coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.objects):
            me = o.data if o.type == 'MESH' else None
            bpy.data.objects.remove(o, do_unlink=True)
            if me is not None and me.users == 0:
                bpy.data.meshes.remove(me)
    else:
        c = bpy.data.collections.new(COLL); bpy.context.scene.collection.children.link(c)
    return c


def mat(name, rgb, rough=0.8):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    return m


def obj(c, name, bm, m, role):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    me.materials.append(m)
    o = bpy.data.objects.new(name, me); c.objects.link(o)
    o['kfb_module'] = 'scenery_shell'; o['kfb_td01_role'] = role
    return o


def helix_z(a):
    return P['floor_h'] * a / (2 * math.pi)


def sweep_band(bm, r0, r1, z0, z1, a0, a1, n, zfun):
    """closed box band along the helix between radii r0..r1, heights zfun(a)+z0 .. zfun(a)+z1"""
    rings = []
    for i in range(n + 1):
        a = a0 + (a1 - a0) * i / n; z = zfun(a); c, s = math.cos(a), math.sin(a)
        rings.append([bm.verts.new((r * c, r * s, z + h)) for r, h in ((r0, z0), (r1, z0), (r1, z1), (r0, z1))])
    for i in range(n):
        A, B = rings[i], rings[i + 1]
        for k in range(4):
            bm.faces.new((A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])


def build():
    c = coll()
    m_con = mat('TD01_concrete', (0.42, 0.42, 0.44), 0.9)
    m_deck = mat('TD01_deck', (0.2, 0.2, 0.22), 0.85)
    m_par = mat('TD01_parapet', (0.62, 0.62, 0.6), 0.85)
    m_core = mat('TD01_core', (0.5, 0.47, 0.44), 0.9)
    turns = P['levels']; n = P['seg_per_turn'] * turns; aend = 2 * math.pi * turns
    # helix deck (top surface = route surface at helix_z)
    bm = bmesh.new(); sweep_band(bm, R_IN, R_OUT, -P['deck_t'], 0.0, 0.0, aend, n, helix_z)
    obj(c, 'TD01_helix_deck', bm, m_deck, 'helix_deck')
    # inner parapet (continuous), outer parapet with an entry gap at every level (angle 0 of each turn)
    bm = bmesh.new(); sweep_band(bm, R_IN, R_IN + P['parapet_t'], 0.0, P['parapet_h'], 0.0, aend, n, helix_z)
    obj(c, 'TD01_helix_parapet_in', bm, m_par, 'parapet')
    gap = P['entry_gap'] / R_OUT                     # angular width of the entry gap
    bm = bmesh.new()
    for t in range(turns):
        a0 = 2 * math.pi * t + gap / 2; a1 = 2 * math.pi * (t + 1) - gap / 2
        sweep_band(bm, R_OUT - P['parapet_t'], R_OUT, 0.0, P['parapet_h'], a0, a1, P['seg_per_turn'], helix_z)
    obj(c, 'TD01_helix_parapet_out', bm, m_par, 'parapet')
    # hollow core
    bm = bmesh.new(); segs = 64
    for r0, r1 in ((P['core_r'] - P['core_wall'], P['core_r']),):
        sweep_band(bm, r0, r1, -0.5, H_TOP + 3.0, 0.0, 2 * math.pi, segs, lambda a: 0.0)
    obj(c, 'TD01_core', bm, m_core, 'core')
    # floors: square slab with round hole (hole radius = outer helix edge) at z = k*floor_h (k=0..levels)
    half = P['slab'] / 2
    for k in range(P['levels'] + 1):
        z = k * P['floor_h']
        bm = bmesh.new(); ns = 96
        outer, inner = [], []
        for i in range(ns):
            a = 2 * math.pi * i / ns; c_, s_ = math.cos(a), math.sin(a)
            f = half / max(abs(c_), abs(s_))            # ray to square boundary
            outer.append((f * c_, f * s_)); inner.append((R_OUT * c_, R_OUT * s_))
        top = [(bm.verts.new((x, y, z)), bm.verts.new((u, v, z))) for (x, y), (u, v) in zip(outer, inner)]
        bot = [(bm.verts.new((x, y, z - P['slab_t'])), bm.verts.new((u, v, z - P['slab_t']))) for (x, y), (u, v) in zip(outer, inner)]
        for i in range(ns):
            j = (i + 1) % ns
            bm.faces.new((top[i][0], top[j][0], top[j][1], top[i][1]))          # top
            bm.faces.new((bot[i][1], bot[j][1], bot[j][0], bot[i][0]))          # bottom
            bm.faces.new((bot[i][0], bot[j][0], top[j][0], top[i][0]))          # outer rim
            bm.faces.new((top[i][1], top[j][1], bot[j][1], bot[i][1]))          # hole rim
        role = 'roof_deck' if k == P['levels'] else ('street_plate' if k == 0 else 'floor')
        obj(c, f'TD01_{role}_L{k}', bm, m_con, role)
    # roof perimeter parapet
    t = P['parapet_t']; hgt = P['roof_parapet']; bm = bmesh.new()
    for (cx, cy, sx, sy) in ((0, -half + t / 2, P['slab'], t), (0, half - t / 2, P['slab'], t),
                             (-half + t / 2, 0, t, P['slab']), (half - t / 2, 0, t, P['slab'])):
        r = bmesh.ops.create_cube(bm, size=1.0)
        for v in r['verts']:
            v.co = Vector((cx + v.co.x * sx, cy + v.co.y * sy, H_TOP + (v.co.z + 0.5) * hgt))
    obj(c, 'TD01_roof_parapet', bm, m_par, 'parapet')
    # columns on a grid, only outside the hole (+1 m) and inside the slab, between levels 0..levels-1
    bm = bmesh.new(); g = P['col_grid']; nG = int(half // g); ncol = 0
    for ix in range(-nG, nG + 1):
        for iy in range(-nG, nG + 1):
            x, y = ix * g, iy * g
            if math.hypot(x, y) < R_OUT + 1.5 or abs(x) > half - 1.5 or abs(y) > half - 1.5:
                continue
            for k in range(P['levels']):
                z0 = k * P['floor_h']; z1 = (k + 1) * P['floor_h'] - P['slab_t']
                r = bmesh.ops.create_cube(bm, size=1.0)
                for v in r['verts']:
                    v.co = Vector((x + v.co.x * P['col'], y + v.co.y * P['col'], z0 + (v.co.z + 0.5) * (z1 - z0)))
                ncol += 1
    obj(c, 'TD01_columns', bm, m_con, 'columns')
    return c, ncol


def routes():
    """route centrelines (runtime frame x right, y up, z forward = Blender x, z, -y) + level sockets"""
    turns = P['levels']; n = P['seg_per_turn'] * turns
    hel = []
    s = 0.0; prev = None
    for i in range(n + 1):
        a = 2 * math.pi * turns * i / n
        p = (P['R'] * math.cos(a), helix_z(a), -P['R'] * math.sin(a))
        if prev: s += math.dist(p, prev)
        hel.append(dict(s=round(s, 3), p=[round(v, 3) for v in p], bank=0.0)); prev = p
    sockets = [dict(id=f'level_{k}_entry', s=round(2 * math.pi * P['R'] * k * math.sqrt(1 + (P['floor_h'] / (2 * math.pi * P['R'])) ** 2), 3),
                    y=k * P['floor_h'], note='outer parapet gap, floor level') for k in range(P['levels'] + 1)]
    # roof drift loop: rounded rectangle around the hole, 6 m inside the roof parapet
    half = R_OUT + 4.6 + P['lane'] / 2; rr = 12.0; loop = []   # straights: inner lane edge 4.6 m outside the hole
    corners = [(half - rr, half - rr, 0), (-(half - rr), half - rr, 90), (-(half - rr), -(half - rr), 180), (half - rr, -(half - rr), 270)]
    for cx, cy, a0 in corners:
        for j in range(13):
            a = math.radians(a0 + 90 * j / 12)
            loop.append([round(cx + rr * math.cos(a), 3), H_TOP, round(-(cy + rr * math.sin(a)), 3)])
    clear_hole = round(half - P['lane'] / 2 - R_OUT, 2)
    clear_parapet = round(P['slab'] / 2 - P['parapet_t'] - (half + P['lane'] / 2), 2)
    return dict(helix=hel, sockets=sockets, roof_loop=loop, roof_loop_clear_to_hole=clear_hole, roof_loop_clear_to_parapet=clear_parapet)


def checks():
    grade = P['floor_h'] / (2 * math.pi * P['R'])
    return dict(grade_pct=round(100 * grade, 2), headroom_between_turns_m=round(P['floor_h'] - P['deck_t'], 2),
                min_centre_radius_m=P['R'], inner_edge_radius=R_IN, outer_edge_radius=R_OUT,
                hole_radius=R_OUT, core_clear_to_inner_edge=round(R_IN - P['core_r'], 2),
                deck_width=W, top_z=H_TOP)


c, ncol = build()
rt = routes(); ck = checks()
os.makedirs(OUT, exist_ok=True)
json.dump(dict(schema='kfb.scenery-shell.v0', id='td01-parkdeck', status='RAW BUILD · form + scale only · for Elisa',
               params=P, checks=ck, routes=rt), open(OUT + 'td01_parkdeck.routes.json', 'w'), indent=1)
if globals().get('TD_EXPORT'):
    bpy.ops.object.select_all(action='DESELECT')
    for o in c.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=OUT + 'td01_parkdeck_raw.glb', export_format='GLB', use_selection=True, export_yup=True)
result = dict(objects=len(c.objects), columns=ncol, checks=ck, helix_len_m=rt['helix'][-1]['s'], roof_clear=(rt['roof_loop_clear_to_hole'], rt['roof_loop_clear_to_parapet']))
