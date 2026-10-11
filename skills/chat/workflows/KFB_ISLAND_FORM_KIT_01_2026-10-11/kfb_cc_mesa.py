"""KFB Coconino Mesas R4 · step 1 · mesa modules M01 Flat Cap Mesa, M02 Needle Butte, M03 Stepped Mesa (brief V-167).

Reference: Georg's sheet `REFS_COCONINO_2026-10-11/CC1_mesa_modelle_M01-M03.png` (+ mood ME1/ME2). Logic and style, not pixels.
Form logic from the sheet: Cap Layer -> Main Body -> Erosion Skirt / Talus. The layers are form logic only:
all parts are joined and fused by ONE voxel remesh into one closed mesh per module (V-136).

Construction (K2 units, H = 3.64, MC = 6.4; ground at z = 0). Round 2, after critic round 1:
- plan outline: rounded, lobed shape r(theta) per module;
- main body (M01, M03): a core prism per tier + convex, rounded columns standing proud of the outline (fluted cliffs),
  rounded column tops; one stratum slab per tier; M03 upper tiers sit toward the back (one side nearly flush);
- cap layer (M01, M03): a distinct slab with a bullnose edge; terrace tops are flat;
- M02: an asymmetric cluster of prismatic fins (5-7 sides) stepping down to one side, stacked segments, small cap block;
- talus: a raised mound with a convex slope, scree fans against the cliff foot, half-buried boulders;
- dressing hints only: a few small cacti and stones;
- voxel remesh + smooth = rounded erosion edges; cut flat at z = 0 and closed; decimate.
Colour: vertex colours (red-orange body, sand-ochre flat tops, dusty talus, green cacti); the shader adds cream stratum bands
from world Z (constant ramp), pits and crevice AO. Dressing sockets are named Empties (SOCKET_*), not geometry.
Run:  python kfb_cc_mesa.py -- OUTDIR M01|M02|M03
"""
import bpy, bmesh, sys, os, math, json, random, time
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index('--') + 1:]
OUT, MID = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)
MC, H = 6.4, 3.64
VOX = float(os.environ.get('CC_VOX', '0.32'))
TRIS = int(os.environ.get('CC_TRIS', '90000'))
t0 = time.time()
def log(*a):
    print(f'[{time.time() - t0:6.1f}s]', *a, flush=True)

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
def mix(a, b, t):
    return [a[i] + (b[i] - a[i]) * t for i in range(3)]

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
coll = bpy.data.collections.new(MID); sc.collection.children.link(coll)

# ---------------- module specs (round 2, after critic round 1) ----------------
SPEC = {
    # tiers: (scale of the outline, z0, z1); one stratum slab per tier; tier_shift moves upper tiers toward the back (+y)
    'M01': dict(seed=101, R=15.0, aspect=1.4, lobes=[(2, 0.04), (4, 0.1), (7, 0.03)], sq=3.0,
                tiers=[(1.0, 2.0, 25.0)], cap=(1.04, 4.0), talus=(1.22, 5.5),
                pillar=(1.2, 1.9), cacti=5, stones=12),
    'M03': dict(seed=303, R=19.0, aspect=1.22, lobes=[(2, 0.04), (3, 0.06), (4, 0.03)], sq=2.6,
                tiers=[(1.0, 2.0, 11.0), (0.74, 11.0, 20.0), (0.5, 20.0, 29.0)],
                cap=(1.03, 2.2), talus=(1.2, 4.5), pillar=(1.2, 1.8), cacti=6, stones=12),
    'M02': dict(seed=202, R=11.0, aspect=1.15, lobes=[(3, 0.06), (5, 0.04)], sq=2.0,
                talus=(1.0, 9.0), cacti=3, stones=10),
}[MID]
rs = random.Random(SPEC['seed'])
if MID == 'M03':                                          # one side nearly flush: upper tiers sit toward the back
    SPEC['tier_shift'] = [(0.0, 0.0)] + [(0.0, SPEC['R'] * (1 - s) * 0.85) for s, _, _ in SPEC['tiers'][1:]]

def outline(s=1.0, R=None, shift=(0, 0)):
    """r(theta) for a rounded, lobed plan (superellipse with aspect, plus lobes)."""
    R = R or SPEC['R']; asp = SPEC['aspect']; n = SPEC['sq']
    ph = OUT_PH
    def f(th):
        c, s_ = math.cos(th), math.sin(th)
        se = (abs(c / asp) ** n + abs(s_) ** n) ** (-1.0 / n)
        lob = 1 + sum(a * math.sin(k * th + ph[i]) for i, (k, a) in enumerate(SPEC['lobes']))
        return R * s * se * lob
    return f, shift
OUT_PH = [rs.uniform(0, math.tau) for _ in SPEC['lobes']]

class Cat:
    def __init__(s, name):
        s.name = name; s.bm = bmesh.new()
    def bvh(s):
        s.bm.faces.ensure_lookup_table(); return BVHTree.FromBMesh(s.bm)
ROCK, TALUS, STONE, CACT = Cat('rock'), Cat('talus'), Cat('stone'), Cat('cactus')

def prism(cat, f, shift, z0, z1, n=128, profile=None):
    bm = cat.bm
    prof = profile or [(0.0, 1.0), (1.0, 1.0)]
    rings = []
    for t, s in prof:
        z = z0 + (z1 - z0) * t
        ring = []
        for i in range(n):
            th = i / n * math.tau; r = f(th) * s
            ring.append(bm.verts.new((shift[0] + math.cos(th) * r, shift[1] + math.sin(th) * r, z)))
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.faces.new(list(reversed(rings[0]))); bm.faces.new(rings[-1])

def cylinder(cat, c, r, z0, z1, seg=14, rtop=None):
    g = bmesh.ops.create_cone(cat.bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r, radius2=rtop if rtop else r, depth=z1 - z0)
    for v in g['verts']:
        v.co = Vector((c[0] + v.co.x, c[1] + v.co.y, (z0 + z1) / 2 + v.co.z))

def blob(cat, c, sx, sy, sz, jitter=0.12, subdiv=1, rot=0.0):
    g = bmesh.ops.create_icosphere(cat.bm, subdivisions=subdiv, radius=1.0)
    m = Matrix.Translation(c) @ Matrix.Rotation(rot, 4, 'Z') @ Matrix.Diagonal((sx, sy, sz, 1))
    for v in g['verts']:
        v.co *= 1 + rs.uniform(-jitter, jitter); v.co = m @ v.co

def fin(cat, c, r, z0, z1, sides=6, rot=0.0, taper=0.8, jit=0.18):
    """Prismatic fin / column: a low-sided prism (rounded later by the remesh), tapering, irregular radii."""
    rad = [r * rs.uniform(1 - jit, 1 + jit) for _ in range(sides)]
    f = lambda th: rad[int(((th - rot) % math.tau) / math.tau * sides) % sides]
    def fr(th):                                           # interpolate the polygon corners
        u = ((th - rot) % math.tau) / math.tau * sides; i = int(u) % sides; t = u - int(u)
        return rad[i] * (1 - t) + rad[(i + 1) % sides] * t
    prism(cat, fr, c, z0, z1, n=sides * 4, profile=[(0, 1.0), (1, taper)])

def pillars(f, shift, z0, z1, prad):
    """Fluted cliff: convex, rounded columns (5-8 % of the module width) standing proud of the core, rounded tops."""
    th = rs.uniform(0, 0.3)
    while th < math.tau + rs.uniform(-0.05, 0.0):
        pr = rs.uniform(prad[0] * 0.75, prad[1] * 1.2)
        r = f(th)
        out = rs.uniform(0.15, 0.45) * pr                  # how far the column stands proud of the outline
        top = z1 - (0.3 if rs.random() < 0.6 else rs.uniform(0.8, max(1.0, 0.22 * (z1 - z0))))
        c = (shift[0] + math.cos(th) * (r - pr + out), shift[1] + math.sin(th) * (r - pr + out))
        cylinder(ROCK, c, pr, z0 + 0.2, top - pr * 0.5, seg=14, rtop=pr * rs.uniform(0.9, 1.0))
        blob(ROCK, Vector((c[0], c[1], top - pr * 0.55)), pr * 0.95, pr * 0.95, pr * 0.6, jitter=0.0, subdiv=2)   # rounded top
        th += (pr * rs.uniform(1.75, 2.15)) / max(5.0, r)

sockets = []
def socket(name, p):
    sockets.append((name, Vector(p)))

def talus_mound(f0, ts, th_, body_top):
    """Raised mound: convex slope out to ts x footprint; scree fans climb the cliff base irregularly."""
    prism(TALUS, f0, (0, 0), 0.0, th_, profile=[(0, ts), (0.35, 1 + (ts - 1) * 0.62), (0.7, 1 + (ts - 1) * 0.28), (1.0, 0.98)])
    n = 11
    for k in range(n):                                    # scree fans against the cliff foot, irregular
        th = (k + rs.uniform(-0.35, 0.35)) / n * math.tau
        rr = f0(th) * 1.0; hgt = th_ * rs.uniform(1.1, 1.6)
        w = rs.uniform(4.0, 7.0)
        blob(TALUS, Vector((math.cos(th) * rr, math.sin(th) * rr, hgt * 0.35)), w * 0.7, w, hgt * 0.65, jitter=0.1, subdiv=2, rot=th)
    for k in range(SPEC['stones']):                       # half-buried boulders, 2-6 % of the module width
        th = rs.uniform(0, math.tau); u = rs.uniform(0.1, 0.9)
        rr = f0(th) * (ts - (ts - 1.0) * u); z = th_ * u * 0.8
        r = rs.uniform(0.012, 0.03) * 2 * SPEC['R'] * SPEC['aspect']
        blob(STONE, Vector((math.cos(th) * rr, math.sin(th) * rr, z + r * 0.15)), r, r * 0.85, r * 0.75, jitter=0.14, subdiv=1, rot=rs.uniform(0, 6))

# ---------------- build ----------------
if MID in ('M01', 'M03'):
    f0, _ = outline(1.0)
    shifts = SPEC.get('tier_shift', [(0, 0)] * len(SPEC['tiers']))
    for ti, ((s, z0, z1), sh) in enumerate(zip(SPEC['tiers'], shifts)):
        f, _ = outline(s)
        last = ti == len(SPEC['tiers']) - 1
        prism(ROCK, f, sh, 0.0 if ti == 0 else z0 - 2.0, z1, profile=[(0, 0.95), (1, 0.95)])      # core
        pillars(f, sh, z0, z1 - (SPEC['cap'][1] if last else 0.8), SPEC['pillar'])
        if last:                                          # cap layer: a distinct slab with a bullnose edge, overhanging a little
            cs, ct = SPEC['cap']
            prism(ROCK, outline(s * cs)[0], sh, z1 - ct, z1, profile=[(0, 0.97), (0.3, 1.0), (0.75, 1.0), (1.0, 0.97)])
            socket('SOCKET_plateau_top', (sh[0], sh[1], z1))
        else:                                             # terrace top: flat, flush with the column faces
            prism(ROCK, outline(s * 1.0)[0], sh, z1 - 0.8, z1)
            nxt = SPEC['tiers'][ti + 1][0]; nsh = shifts[ti + 1]
            th = -math.pi / 2 + 0.3 * ti
            rr = (f(th) + outline(nxt)[0](th) + nsh[1] * math.sin(th)) / 2
            socket(f'SOCKET_terrace_{ti + 1}', (sh[0] + math.cos(th) * rr, sh[1] + math.sin(th) * rr, z1))
    TOPZ = SPEC['tiers'][-1][2]
    ts, th_ = SPEC['talus']
    talus_mound(f0, ts, th_, True)
    for k in range(2):
        th = -math.pi / 2 + (k * 2 - 1) * 0.9
        rr = f0(th) * (1 + (ts - 1) * 0.5)
        socket(f'SOCKET_talus_{k + 1}', (math.cos(th) * rr, math.sin(th) * rr, th_ * 0.55))
    FLAT = [t[2] for t in SPEC['tiers']]
else:                                                     # M02 Needle Butte: asymmetric cluster of prismatic fins
    f0, _ = outline(1.0)
    ts, th_ = SPEC['talus']
    prism(TALUS, f0, (0, 0), 0.0, th_, profile=[(0, 1.0), (0.35, 0.75), (0.7, 0.5), (1.0, 0.36)])
    for k in range(SPEC['stones']):
        th = rs.uniform(0, math.tau); u = rs.uniform(0.05, 0.75)
        rr = f0(th) * (1.0 - 0.64 * u); z = th_ * u
        r = rs.uniform(0.04, 0.07) * 2 * SPEC['R']
        blob(STONE, Vector((math.cos(th) * rr, math.sin(th) * rr, z + r * 0.1)), r, r * 0.85, r * 0.75, jitter=0.14, subdiv=1, rot=rs.uniform(0, 6))
    HT = 40.0; base_w = 2 * SPEC['R'] * SPEC['aspect']
    spire_r = 0.1 * base_w                                # spire 20 % of the base width
    fins = [((-1.0, 0.0), spire_r, HT * 0.9, 6)]          # central spire (+ small cap block on top)
    side = 1.0                                            # flanking fins cluster to +x and step down
    for k, (dx, dy, rf, hf) in enumerate([(2.6, 0.8, 0.8, 0.75), (3.2, -1.6, 0.75, 0.62), (5.0, 0.4, 0.7, 0.5), (5.8, -2.2, 0.6, 0.4),
                                          (1.0, 2.6, 0.7, 0.55), (-3.4, -1.2, 0.7, 0.42), (6.8, 1.6, 0.55, 0.35)]):
        fins.append(((dx * side - 1.0 + rs.uniform(-0.3, 0.3), dy + rs.uniform(-0.3, 0.3)), spire_r * rf * rs.uniform(0.9, 1.1), HT * hf * rs.uniform(0.95, 1.05), rs.choice([5, 6, 7])))
    STR = []
    for (cx, cy), r, hgt, sd in fins:
        nseg = 2 if hgt < 20 else 3                       # stacked segments, slight lateral offsets (strata), no flared lips
        z = th_ * 0.4; dz = (hgt - z) / nseg; rr = r; rot = rs.uniform(0, math.tau); off = Vector((0, 0))
        for i in range(nseg):
            fin(ROCK, (cx + off.x, cy + off.y), rr, z, z + dz + 0.3, sides=sd, rot=rot + i * 0.2, taper=0.86)
            z += dz; rr *= 0.86; off += Vector((rs.uniform(-0.25, 0.25), rs.uniform(-0.25, 0.25)))
            STR.append(z)
        if hgt < HT * 0.85:
            socket(f'SOCKET_ledge_{len([s for s in sockets if "ledge" in s[0]]) + 1:02d}', (cx + off.x, cy + off.y, hgt + 0.3))
    # cap block on the spire: small, flat-topped, about 10 % of the height
    cx, cy = fins[0][0]
    fin(ROCK, (cx, cy), spire_r * 0.62, HT * 0.9, HT, sides=5, rot=0.3, taper=0.92, jit=0.1)
    socket('SOCKET_spire_top', (cx, cy, HT))
    TOPZ = HT; DRUM_TOPS = STR
    FLAT = [HT] + [h for _, _, h, _ in fins[1:]]

# cacti: hints only (a column with 1-2 arms), on flat tops and the talus
def cactus(p, hgt):
    r = 0.6
    blob(CACT, Vector((p[0], p[1], p[2] + hgt * 0.5)), r, r, hgt * 0.5, jitter=0.0, subdiv=2)
    for side in rs.sample([-1, 1], rs.choice([1, 2])):
        a = rs.uniform(0, math.tau); ax = Vector((math.cos(a), math.sin(a), 0)) * side
        base = Vector((p[0], p[1], p[2] + hgt * rs.uniform(0.35, 0.55)))
        blob(CACT, base + ax * 0.9, 0.9, 0.5, 0.5, jitter=0.0, subdiv=2, rot=a)
        blob(CACT, base + ax * 1.6 + Vector((0, 0, hgt * 0.18)), 0.5, 0.5, hgt * 0.22, jitter=0.0, subdiv=2)
nc = SPEC['cacti']
for k in range(nc):
    th = rs.uniform(0, math.tau)
    if MID == 'M02' or k >= nc - 2:                      # on the talus
        rr = f0(th) * (0.7 if MID == 'M02' else 1.12); z = (SPEC['talus'][1] * (0.35 if MID == 'M02' else 0.3))
    else:                                                 # on a flat top / terrace
        if MID == 'M01':
            rr = f0(th) * rs.uniform(0.3, 0.75); z = TOPZ
        else:
            ti = k % 3; s = SPEC['tiers'][ti][0]; sh = SPEC['tier_shift'][ti]
            nxt = SPEC['tiers'][ti + 1][0] if ti < 2 else 0.0
            rr = outline(s)[0](th) * (0.95 + nxt) / 2 if ti < 2 else outline(s)[0](th) * 0.5
            z = SPEC['tiers'][ti][2]
            th_c = th
            p = (sh[0] + math.cos(th) * rr, sh[1] + math.sin(th) * rr, z); cactus(p, rs.uniform(3.0, 4.2)); continue
    cactus((math.cos(th) * rr, math.sin(th) * rr, z), rs.uniform(3.0, 4.2))
log('parts built')

# ---------------- ONE mesh: join, voxel remesh, smooth, decimate ----------------
ball = bmesh.new()
for cat in (ROCK, TALUS, STONE, CACT):
    me = bpy.data.meshes.new('tmp'); cat.bm.to_mesh(me); ball.from_mesh(me); bpy.data.meshes.remove(me)
me = bpy.data.meshes.new(f'KFB_CC_{MID}'); ball.to_mesh(me); ball.free()
obj = bpy.data.objects.new(f'KFB_CC_{MID}', me); coll.objects.link(obj)
def apply(mod):
    with bpy.context.temp_override(object=obj, active_object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)
rm = obj.modifiers.new('RM', 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = VOX; apply(rm)
log('remesh', len(obj.data.polygons))
sm = obj.modifiers.new('SM', 'SMOOTH'); sm.factor = 0.6; sm.iterations = 8; apply(sm)
bm = bmesh.new(); bm.from_mesh(obj.data)
res_ = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0.0), plane_no=(0, 0, 1), clear_inner=True)
cut = [e for e in res_['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
bmesh.ops.holes_fill(bm, edges=cut, sides=0)
bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
bm.to_mesh(obj.data); bm.free()
log('flat base cut at z = 0')
# one shell only
bm = bmesh.new(); bm.from_mesh(obj.data); bm.verts.ensure_lookup_table()
seen = set(); comps = []
for v0 in bm.verts:
    if v0.index in seen:
        continue
    st = [v0]; comp = []; seen.add(v0.index)
    while st:
        v = st.pop(); comp.append(v)
        for e in v.link_edges:
            w = e.other_vert(v)
            if w.index not in seen:
                seen.add(w.index); st.append(w)
    comps.append(comp)
comps.sort(key=len, reverse=True)
dropped = sum(len(c) for c in comps[1:])
if len(comps) > 1:
    bmesh.ops.delete(bm, geom=[v for c in comps[1:] for v in c], context='VERTS')
bm.to_mesh(obj.data); bm.free()
n0 = sum(len(p.vertices) - 2 for p in obj.data.polygons)
dec = obj.modifiers.new('DEC', 'DECIMATE'); dec.ratio = min(1.0, TRIS / n0); dec.use_collapse_triangulate = True; apply(dec)
log('decimated', len(obj.data.polygons), 'shells', len(comps), 'dropped', dropped)

# ---------------- colour ----------------
C = {k: srgb(v) for k, v in dict(red='#c25a35', red_dk='#a0442c', band='#ebb98c', sand='#d9944a', talus='#c4734f', talus_hi='#d08a5f',
                                  stone='#b0573c', cactus='#5d8a38').items()}
# stratum bands (world Z, crisp): (centre, width) per module; drawn in the shader, not in the vertex colours
if MID == 'M01':
    BANDS = [(20.4, 1.2), (14.0, 0.9), (7.6, 0.8), (24.3, 0.7)]
elif MID == 'M03':
    BANDS = [b for (_, z0, z1) in SPEC['tiers'] for b in ((z1 - 1.5, 0.9), (z0 + 0.42 * (z1 - z0), 0.6))]
else:
    BANDS = [(10.5, 1.0), (19.0, 0.7), (27.5, 1.1), (34.5, 0.6)]
FLAT_TOPS = FLAT
bv = {k: c.bvh() for k, c in (('rock', ROCK), ('talus', TALUS), ('stone', STONE), ('cactus', CACT))}
mesh = obj.data
bm = bmesh.new(); bm.from_mesh(mesh); bm.verts.ensure_lookup_table(); bm.normal_update()
cols, mask = [], []
zmax = max(v.co.z for v in bm.verts)
for v in bm.verts:
    best = None
    for k, b in bv.items():
        loc, nor, fi, d = b.find_nearest(v.co)
        if loc is not None and (best is None or d < best[1]):
            best = (k, d)
    k = best[0]; z = v.co.z; up = v.normal.z
    if k == 'cactus':
        rgb = C['cactus']; mk = (0, 1, 0)
    elif k == 'stone':
        rgb = C['stone']; mk = (0.6, 0, 0)
    elif k == 'talus':
        rgb = mix(C['talus'], C['talus_hi'], max(0.0, up)); mk = (0.5, 0, 0)
    else:
        if up > 0.75 and any(abs(z - t) < 0.9 for t in FLAT_TOPS):
            rgb = C['sand']; mk = (0.3, 0, 0)
        else:
            rgb = mix(C['red_dk'], C['red'], min(1.0, z / max(1.0, zmax * 0.5)))
            mk = (1, 0, 1)                                # B = 1: stratum bands may show here
    cols.append(rgb); mask.append(mk)
bm.free()
ca = mesh.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT'); cm = mesh.color_attributes.new('Mask', 'FLOAT_COLOR', 'POINT')
for i in range(len(mesh.vertices)):
    ca.data[i].color = (*cols[i], 1); cm.data[i].color = (*mask[i], 1)
mesh.color_attributes.active_color = ca
for p in mesh.polygons:
    p.use_smooth = True

def material():
    mt = bpy.data.materials.new('KFB_CC_SANDSTONE'); mt.use_nodes = True
    nt = mt.node_tree; N = nt.nodes; L = nt.links.new
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 0.88
    col = N.new('ShaderNodeVertexColor'); col.layer_name = 'Col'
    msk = N.new('ShaderNodeVertexColor'); msk.layer_name = 'Mask'
    sep = N.new('ShaderNodeSeparateColor'); L(msk.outputs['Color'], sep.inputs[0])
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.35; nz.inputs['Detail'].default_value = 8; nz.inputs['Roughness'].default_value = 0.6
    L(tc.outputs['Object'], nz.inputs['Vector'])
    vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 1.2; L(tc.outputs['Object'], vo.inputs['Vector'])
    pit = N.new('ShaderNodeMapRange'); pit.inputs['From Min'].default_value = 0.04; pit.inputs['From Max'].default_value = 0.14
    L(vo.outputs['Distance'], pit.inputs['Value'])
    h = N.new('ShaderNodeMath'); h.operation = 'MULTIPLY'; L(nz.outputs['Fac'], h.inputs[0]); L(pit.outputs['Result'], h.inputs[1])
    hm = N.new('ShaderNodeMath'); hm.operation = 'MULTIPLY'; L(h.outputs[0], hm.inputs[0]); L(sep.outputs[0], hm.inputs[1])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.35; bump.inputs['Distance'].default_value = 0.4
    L(hm.outputs[0], bump.inputs['Height']); L(bump.outputs['Normal'], b.inputs['Normal'])
    # tone variation + crevice AO
    vr = N.new('ShaderNodeMapRange'); vr.inputs['To Min'].default_value = 0.86; vr.inputs['To Max'].default_value = 1.08
    L(nz.outputs['Fac'], vr.inputs['Value'])
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 2.5; ao.samples = 16
    aom = N.new('ShaderNodeMapRange'); aom.inputs['To Min'].default_value = 0.22; aom.inputs['To Max'].default_value = 1.0
    L(ao.outputs['AO'], aom.inputs['Value'])
    f = N.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; L(vr.outputs['Result'], f.inputs[0]); L(aom.outputs['Result'], f.inputs[1])
    fc = N.new('ShaderNodeCombineColor'); [L(f.outputs[0], fc.inputs[i]) for i in range(3)]
    # stratum bands: object Z (+ a warp of at most 2 % of the height) through a constant colour ramp
    sxyz = N.new('ShaderNodeSeparateXYZ'); L(tc.outputs['Object'], sxyz.inputs[0])
    wn = N.new('ShaderNodeTexNoise'); wn.inputs['Scale'].default_value = 0.08; L(tc.outputs['Object'], wn.inputs['Vector'])
    wm = N.new('ShaderNodeMapRange'); wm.inputs['To Min'].default_value = -0.02 * ZMAX; wm.inputs['To Max'].default_value = 0.02 * ZMAX
    L(wn.outputs['Fac'], wm.inputs['Value'])
    zw = N.new('ShaderNodeMath'); zw.operation = 'ADD'; L(sxyz.outputs['Z'], zw.inputs[0]); L(wm.outputs['Result'], zw.inputs[1])
    zn = N.new('ShaderNodeMapRange'); zn.inputs['From Max'].default_value = ZMAX; L(zw.outputs[0], zn.inputs['Value'])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation = 'CONSTANT'
    els = ramp.color_ramp.elements; els[0].position = 0.0; els[0].color = (0, 0, 0, 1); els[1].position = 0.999; els[1].color = (0, 0, 0, 1)
    for zc, wd in sorted(BANDS):
        e1 = els.new(max(0.001, (zc - wd / 2) / ZMAX)); e1.color = (1, 1, 1, 1)
        e2 = els.new(min(0.998, (zc + wd / 2) / ZMAX)); e2.color = (0, 0, 0, 1)
    L(zn.outputs['Result'], ramp.inputs['Fac'])
    bf = N.new('ShaderNodeMath'); bf.operation = 'MULTIPLY'; L(ramp.outputs['Color'], bf.inputs[0]); L(sep.outputs[2], bf.inputs[1])
    bmx = N.new('ShaderNodeMix'); bmx.data_type = 'RGBA'; L(bf.outputs[0], bmx.inputs['Factor'])
    L(col.outputs['Color'], bmx.inputs['A']); bmx.inputs['B'].default_value = (*C['band'], 1)
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1.0
    L(bmx.outputs['Result'], mul.inputs['A']); L(fc.outputs[0], mul.inputs['B']); L(mul.outputs['Result'], b.inputs['Base Color'])
    return mt
ZMAX = max(v.co.z for v in mesh.vertices)
mesh.materials.append(material())

# ---------------- sockets (Empties), scale props ----------------
emps = []
for name, p in sockets:
    e = bpy.data.objects.new(name, None); e.empty_display_type = 'ARROWS'; e.empty_display_size = 2.0; e.location = p
    coll.objects.link(e); e.parent = obj; emps.append(e)
def prop(name, size, loc, h):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object; o.name = name; o.scale = size
    mt = bpy.data.materials.new(name); mt.use_nodes = True; mt.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*srgb(h), 1)
    o.data.materials.append(mt)
    for c_ in list(o.users_collection):
        c_.objects.unlink(o)
    coll.objects.link(o); return o
ymin = min(v.co.y for v in mesh.vertices); xmin = min(v.co.x for v in mesh.vertices)
fig = prop('SCALE_FIGURE_1H', (0.9, 0.9, H), (xmin + 4, ymin - 4, H / 2), '#e0245e')
car = prop('SCALE_CAR', (6.0, 2.9, 2.2), (xmin + 12, ymin - 5, 1.1), '#1f5fd6')

# ---------------- checks, export ----------------
bm = bmesh.new(); bm.from_mesh(mesh)
nonman = sum(1 for e in bm.edges if not e.is_manifold); openb = sum(1 for e in bm.edges if e.is_boundary); bm.free()
xs = [v.co.x for v in mesh.vertices]; ys = [v.co.y for v in mesh.vertices]; zs = [v.co.z for v in mesh.vertices]
met = dict(module=MID, footprint_MC=[round((max(xs) - min(xs)) / MC, 1), round((max(ys) - min(ys)) / MC, 1)], height_MC=round(max(zs) / MC, 1),
           height_H=round(max(zs) / H, 1), tris=len(mesh.polygons), objects=1, shells=1, dropped_crumb_verts=dropped,
           open_edges=openb, non_manifold_edges=nonman, sockets=[s[0] for s in sockets], voxel=VOX, seed=SPEC['seed'])
log('METRICS', json.dumps(met))
json.dump(met, open(f'{OUT}/CC_{MID}_metrics.json', 'w'), indent=1)
for o in bpy.context.view_layer.objects:
    o.select_set(False)
obj.select_set(True)
for e in emps:
    e.select_set(True)
bpy.context.view_layer.objects.active = obj
bpy.ops.export_scene.gltf(filepath=f'{OUT}/KFB_CC_{MID}.glb', use_selection=True, export_format='GLB', export_vertex_color='ACTIVE')
bpy.ops.wm.save_as_mainfile(filepath=f'{OUT}/KFB_CC_{MID}.blend', compress=True)
log('saved')
