"""TD02 · Uni-Center Y-Drift-Tower · greybox v1 (real metres, form + scale + routes only) · Claude Coworker 27.09.2026
For Elisa. Rule (Georg 27.09): OMS only rough architecture; driving flow + chill/fun/stunt beat map fidelity;
recognition via signature elements -> here: Y plan, central tower, parking podium, wing colour code (orange/green/yellow).
Scope v1 (Perplexity's own advice + Coworker scale correction): podium + core + ONE wing (yellow) + 3 route knots:
  K1  helix (TD01 reused as ONE knot, not the whole level): street 0 m -> podium roof 15 m, 3 turns x 5 m
  K2  podium-roof drift loop around the helix hole (open deck, several lines)
  K3  yellow-wing balcony climb: rounded-rectangle wrap around the wing, 2 laps 15 m -> 27 m, ends at a jump socket
Route preview = "ribbon cable" layers (idea: r/geometrynodes procedural ribbon cables, Georg 27.09): one centreline,
parallel strands offset along the local normal = lane edges + centre stripe + barrier lines. Preview only, not drivable.
Units metres, Blender z-up. exec globals: TD_OUT, TD_EXPORT."""
import bpy, bmesh, math, json, os
from mathutils import Vector

OUT = globals().get('TD_OUT', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TD02-UNICENTER-Y/')
P = dict(hub_r=44.0, hole_r=28.0, core_r=13.0, core_h=60.0, podium_levels=3, podium_h=5.0, slab_t=0.5,
         arm_w=28.0, arm_len=50.0, arms={'orange': 90.0, 'green': 210.0, 'yellow': 330.0},
         wing='yellow', wing_decks=6, wing_h=6.0, wing_taper=0.03,
         helix_R=22.0, lane=10.8, shoulder=0.6, deck_t=0.45, parapet_h=1.1, parapet_t=0.3,
         balcony_off=7.0, balcony_corner=12.0, balcony_laps=2, col_grid=9.0, col=0.7)
W = P['lane'] + 2 * P['shoulder']
TOP_POD = P['podium_levels'] * P['podium_h']
COLL = 'TD02_YTOWER'
D0 = math.sqrt(P['hub_r'] ** 2 - (P['arm_w'] / 2) ** 2)      # arm starts at the hub chord


# ---------------------------------------------------------------- helpers
def coll():
    c = bpy.data.collections.get(COLL)
    if c:
        for o in list(c.objects):
            d = o.data
            bpy.data.objects.remove(o, do_unlink=True)
            if d is not None and getattr(d, 'users', 1) == 0:
                (bpy.data.meshes if isinstance(d, bpy.types.Mesh) else bpy.data.curves).remove(d)
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
    o['kfb_module'] = 'scenery_shell'; o['kfb_td02_role'] = role
    return o


def rot(v, deg):
    a = math.radians(deg); c, s = math.cos(a), math.sin(a)
    return (v[0] * c - v[1] * s, v[0] * s + v[1] * c)


def slab_from_outline(bm, outer, holes, z, t):
    """prism with optional polygon holes, built as a ring strip between outer and ONE hole (same vertex count) or a fan"""
    if holes:
        inner = holes[0]; n = len(outer); assert len(inner) == n
        T = [(bm.verts.new((*o, z)), bm.verts.new((*i, z))) for o, i in zip(outer, inner)]
        B = [(bm.verts.new((*o, z - t)), bm.verts.new((*i, z - t))) for o, i in zip(outer, inner)]
        for k in range(n):
            j = (k + 1) % n
            bm.faces.new((T[k][0], T[j][0], T[j][1], T[k][1])); bm.faces.new((B[k][1], B[j][1], B[j][0], B[k][0]))
            bm.faces.new((B[k][0], B[j][0], T[j][0], T[k][0])); bm.faces.new((T[k][1], T[j][1], B[j][1], B[k][1]))
    else:
        top = [bm.verts.new((*o, z)) for o in outer]; bot = [bm.verts.new((*o, z - t)) for o in outer]
        bm.faces.new(top); bm.faces.new(bot[::-1])
        n = len(outer)
        for k in range(n):
            j = (k + 1) % n; bm.faces.new((bot[k], bot[j], top[j], top[k]))


def hub_outline(n=180):
    """circle r=hub_r whose arcs under the three arms are replaced by the arm chords (arms attach flush)"""
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n; p = (P['hub_r'] * math.cos(a), P['hub_r'] * math.sin(a))
        for ang in P['arms'].values():
            d = math.radians(ang)
            u = (math.cos(d), math.sin(d)); v = (-u[1], u[0])
            along = p[0] * u[0] + p[1] * u[1]; across = p[0] * v[0] + p[1] * v[1]
            if along > D0 and abs(across) <= P['arm_w'] / 2 + 1e-6:
                p = (D0 * u[0] + across * v[0], D0 * u[1] + across * v[1])
        pts.append(p)
    return pts


def circle(r, n=180):
    return [(r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def arm_rect(ang, taper=0.0):
    w = P['arm_w'] * (1 - taper) / 2; L = P['arm_len'] * (1 - taper)
    return [rot(p, ang) for p in ((D0, -w), (D0 + L, -w), (D0 + L, w), (D0, w))]


def sweep(bm, samples, w, t, h0=0.0, h1=None):
    """band along samples [(x,y,z,tx,ty)]: width w (h1=None) = deck (top at z, thickness t);
    with h0/h1 = a wall band between lateral offsets (w = (o0, o1)) and heights z+h0..z+h1"""
    rings = []
    for x, y, z, tx, ty in samples:
        nx, ny = -ty, tx
        if h1 is None:
            prof = [(-w / 2, -t), (w / 2, -t), (w / 2, 0.0), (-w / 2, 0.0)]
        else:
            o0, o1 = w; prof = [(o0, h0), (o1, h0), (o1, h1), (o0, h1)]
        rings.append([bm.verts.new((x + nx * o, y + ny * o, z + hz)) for o, hz in prof])
    for A, B in zip(rings, rings[1:]):
        for k in range(4):
            bm.faces.new((A[k], A[(k + 1) % 4], B[(k + 1) % 4], B[k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])


def tangents(pts):
    out = []
    for i, (x, y, z) in enumerate(pts):
        a = pts[max(0, i - 1)]; b = pts[min(len(pts) - 1, i + 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1.0
        out.append((x, y, z, dx / L, dy / L))
    return out


# ---------------------------------------------------------------- routes (centrelines)
def route_helix():
    turns = P['podium_levels']; n = 96 * turns
    return [(P['helix_R'] * math.cos(2 * math.pi * turns * i / n), P['helix_R'] * math.sin(2 * math.pi * turns * i / n),
             P['podium_h'] * turns * i / n) for i in range(n + 1)]


def rounded_rect(x0, x1, y0, y1, r, n_arc=12):
    """closed CCW loop, start mid of the bottom edge"""
    pts = []
    cs = [(x1 - r, y0 + r, -90), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90), (x0 + r, y0 + r, 180)]
    pts.append(((x0 + x1) / 2, y0))
    for cx, cy, a0 in cs:
        for j in range(n_arc + 1):
            a = math.radians(a0 + 90 * j / n_arc); pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    pts.append(((x0 + x1) / 2, y0))
    return pts


def resample(pts2, step=2.0):
    out = [pts2[0]]; acc = 0.0
    for a, b in zip(pts2, pts2[1:]):
        L = math.dist(a, b); k = max(1, int(L // step))
        for j in range(1, k + 1):
            out.append((a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k))
    return out


def route_roof_loop():
    r_in = P['hole_r'] + 1.5 + W / 2                          # clear of the hole parapet
    return [(r_in * math.cos(2 * math.pi * i / 120), r_in * math.sin(2 * math.pi * i / 120), TOP_POD) for i in range(121)]


def route_balcony():
    ang = P['arms'][P['wing']]; o = P['balcony_off']
    loop = resample(rounded_rect(D0 - o, D0 + P['arm_len'] + o, -P['arm_w'] / 2 - o, P['arm_w'] / 2 + o, P['balcony_corner']))
    # start right after the hub-end corner (outside the roof), so the hub-end segment is crossed at the END of a lap
    # -> maximum headroom over the podium-roof drift loop (v1 check found 3.32 m with a mid-edge start)
    st = (D0 - o + P['balcony_corner'], -P['arm_w'] / 2 - o)
    ring = loop[:-1]; i0 = min(range(len(ring)), key=lambda i: math.dist(ring[i], st))
    loop = ring[i0:] + ring[:i0] + [ring[i0]]
    lap = sum(math.dist(a, b) for a, b in zip(loop, loop[1:]))
    pts = []; s = 0.0; laps = P['balcony_laps']
    for L in range(laps):
        for i, p in enumerate(loop if L == 0 else loop[1:]):
            if pts:
                s += math.dist(p, prev)
            prev = p
            x, y = rot(p, ang); pts.append((x, y, TOP_POD + P['wing_h'] * s / lap))
    return pts, lap


# ---------------------------------------------------------------- build
def build():
    c = coll()
    m_con = mat('TD02_concrete', (0.45, 0.45, 0.47)); m_deck = mat('TD02_deck', (0.22, 0.22, 0.24))
    m_par = mat('TD02_parapet', (0.64, 0.64, 0.62)); m_core = mat('TD02_core', (0.55, 0.5, 0.56))
    wcol = {'orange': (0.91, 0.51, 0.35), 'green': (0.47, 0.68, 0.53), 'yellow': (0.91, 0.78, 0.35)}
    m_wing = mat('TD02_wing_' + P['wing'], wcol[P['wing']])
    # podium decks (hub with helix hole) + three podium arms
    hub = hub_outline(); hole = circle(P['hole_r'], len(hub))
    for k in range(P['podium_levels'] + 1):
        z = k * P['podium_h']
        bm = bmesh.new(); slab_from_outline(bm, hub, [hole], z, P['slab_t'])
        for ang in P['arms'].values():
            slab_from_outline(bm, arm_rect(ang), [], z, P['slab_t'])
        mesh_obj(c, f'TD02_podium_L{k}', bm, m_con, 'podium_roof' if k == P['podium_levels'] else 'podium_deck')
    # core tower
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=P['core_r'], radius2=P['core_r'] * 0.9,
                                            depth=P['core_h'])
    for v in bm.verts: v.co.z += P['core_h'] / 2
    mesh_obj(c, 'TD02_core_tower', bm, m_core, 'core')
    # yellow wing: stacked tapering decks above the podium arm
    ang = P['arms'][P['wing']]
    for k in range(1, P['wing_decks'] + 1):
        bm = bmesh.new(); slab_from_outline(bm, arm_rect(ang, taper=P['wing_taper'] * k), [], TOP_POD + k * P['wing_h'], P['slab_t'])
        mesh_obj(c, f'TD02_wing_{P["wing"]}_D{k}', bm, m_wing, 'wing_deck')
    # columns: podium (hub ring + arms) and wing
    bm = bmesh.new(); g = P['col_grid']; n = 0
    def col(x, y, z0, z1):
        r = bmesh.ops.create_cube(bm, size=1.0)
        for v in r['verts']:
            v.co = Vector((x + v.co.x * P['col'], y + v.co.y * P['col'], z0 + (v.co.z + 0.5) * (z1 - z0)))
    for ix in range(-12, 13):
        for iy in range(-12, 13):
            x, y = ix * g, iy * g; rr = math.hypot(x, y)
            inside_hub = P['hole_r'] + 2 < rr < P['hub_r'] - 2
            inside_arm = None
            for name, a in P['arms'].items():
                lx, ly = rot((x, y), -a)
                if D0 + 2 < lx < D0 + P['arm_len'] - 2 and abs(ly) < P['arm_w'] / 2 - 2:
                    inside_arm = name
            if not (inside_hub or inside_arm):
                continue
            for k in range(P['podium_levels']):
                col(x, y, k * P['podium_h'], (k + 1) * P['podium_h'] - P['slab_t']); n += 1
            if inside_arm == P['wing']:
                for k in range(P['wing_decks']):
                    z0 = TOP_POD + k * P['wing_h']; lx, ly = rot((x, y), -ang)
                    col(x, y, z0, z0 + P['wing_h'] - P['slab_t']); n += 1
    mesh_obj(c, 'TD02_columns', bm, m_con, 'columns')
    # routes as shells: helix deck + parapets, balcony deck + outer parapet
    hel = tangents(route_helix()); bal, lap = route_balcony(); balt = tangents(bal)
    for nm, smp in (('helix', hel), ('balcony', balt)):
        bm = bmesh.new(); sweep(bm, smp, W, P['deck_t']); mesh_obj(c, f'TD02_{nm}_deck', bm, m_deck, f'{nm}_deck')
    bm = bmesh.new()
    sweep(bm, hel, (-W / 2, -W / 2 + P['parapet_t']), 0, 0.0, P['parapet_h'])
    sweep(bm, balt, (-W / 2, -W / 2 + P['parapet_t']), 0, 0.0, P['parapet_h'])     # outer side of the CCW balcony
    mesh_obj(c, 'TD02_route_parapets', bm, m_par, 'parapet')
    return c, lap, n


# ---------------------------------------------------------------- ribbon-cable route preview (Georg's reference)
def ribbons(c, name, pts, color):
    """one centreline -> parallel strands (lane edges, centre stripe, barrier line): the 'ribbon cable' idea"""
    m = mat(f'TD02_ribbon_{name}', color, 0.4)
    smp = tangents(pts)
    for tag, off, zoff, bev in (('edgeL', -P['lane'] / 2, 0.08, 0.18), ('edgeR', P['lane'] / 2, 0.08, 0.18),
                                ('centre', 0.0, 0.08, 0.10), ('barrierL', -W / 2 - 0.2, 1.0, 0.25), ('barrierR', W / 2 + 0.2, 1.0, 0.25)):
        cu = bpy.data.curves.new(f'TD02_rib_{name}_{tag}', 'CURVE'); cu.dimensions = '3D'
        cu.bevel_depth = bev; cu.bevel_resolution = 2
        sp = cu.splines.new('POLY'); sp.points.add(len(smp) - 1)
        for i, (x, y, z, tx, ty) in enumerate(smp):
            sp.points[i].co = (x - ty * off, y + tx * off, z + zoff, 1.0)
        cu.materials.append(m)
        o = bpy.data.objects.new(cu.name, cu); c.objects.link(o); o['kfb_td02_role'] = 'route_preview'


# ---------------------------------------------------------------- checks + export
def overpass_gap(bal):
    """where the balcony passes over the roof-loop band in plan: minimum clear height above the loop surface"""
    r_loop = P['hole_r'] + 1.5 + W / 2; gaps = []
    for x, y, z, tx, ty in tangents(bal):                     # sample the whole balcony deck width, not just the centreline
        for k in range(-4, 5):
            o = k * W / 8
            if abs(math.hypot(x - ty * o, y + tx * o) - r_loop) < W / 2:
                gaps.append(z - TOP_POD - P['deck_t'])
    return round(min(gaps), 2) if gaps else None


def checks(lap):
    hel_grade = P['podium_h'] / (2 * math.pi * P['helix_R'])
    bal_grade = P['wing_h'] / lap
    r_bal_inner_clear = P['balcony_off'] - W / 2                            # balcony inner edge to wing / podium-arm edge
    return dict(helix_grade_pct=round(100 * hel_grade, 2), helix_headroom_m=round(P['podium_h'] - P['deck_t'], 2),
                balcony_lap_m=round(lap, 1), balcony_grade_pct=round(100 * bal_grade, 2),
                balcony_headroom_m=round(P['wing_h'] - P['deck_t'], 2), balcony_clear_to_wing_m=round(r_bal_inner_clear, 2),
                balcony_min_radius_m=P['balcony_corner'], roof_loop_radius_m=round(P['hole_r'] + 1.5 + W / 2, 2),
                roof_loop_outer_edge_m=round(P['hole_r'] + 1.5 + W, 2), hub_radius_m=P['hub_r'],
                core_clear_to_helix_inner_m=round(P['helix_R'] - W / 2 - P['core_r'], 2),
                podium_top_m=TOP_POD, wing_top_m=TOP_POD + P['wing_decks'] * P['wing_h'], core_top_m=P['core_h'])


def to_rt(pts):
    return [[round(x, 3), round(z, 3), round(-y, 3)] for x, y, z in pts]


c, lap, ncol = build()
bal, _ = route_balcony(); hel = route_helix(); roof = route_roof_loop()
for nm, pts, colr in (('helix', hel, (0.95, 0.35, 0.3)), ('roofloop', roof, (0.3, 0.8, 0.85)), ('balcony', bal, (0.95, 0.75, 0.2))):
    ribbons(c, nm, pts, colr)
ck = checks(lap); ck['balcony_over_roofloop_min_headroom_m'] = overpass_gap(bal)
os.makedirs(OUT, exist_ok=True)
json.dump(dict(schema='kfb.scenery-shell.v0', id='td02-unicenter-ytower', status='GREYBOX v1 · form + scale + routes · for Elisa',
               rule='OMS rough architecture only; flow/fun first; recognition via Y plan, tower, podium, wing colours',
               params={k: v for k, v in P.items()}, checks=ck,
               routes=dict(K1_helix=to_rt(hel), K2_roof_loop=to_rt(roof), K3_yellow_balcony=to_rt(bal)),
               sockets=[dict(id='street_entry', route='K1_helix', at='start'), dict(id='podium_roof', route='K1_helix', at='end'),
                        dict(id='balcony_start', route='K3_yellow_balcony', at='start'),
                        dict(id='crane_jump_start', route='K3_yellow_balcony', at='end', note='v2: crane-arm jump finale')]),
          open(OUT + 'td02_ytower.routes.json', 'w'), indent=1)
result = dict(objects=len(c.objects), columns=ncol, checks=ck)
