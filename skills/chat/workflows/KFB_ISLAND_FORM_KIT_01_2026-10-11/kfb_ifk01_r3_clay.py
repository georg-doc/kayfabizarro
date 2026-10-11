"""KFB Island Form Kit 01 · K1 R3 · clay island base after Georg's references IB1-IB3 (brief R3, V-142). Round 2 (after critic round 1).

Template first (V-001): the body starts from the Scholle v7 port (`kfb_ifk01_scholle.py`, preset C, 20 MC = 128),
warped to a steady taper (widest right under the rim). On that body, in K2 units:
- niches: one larger soft hollow + small pockets, cut into the body (boolean), pebbles on each floor;
- grey rock band: big faceted slabs that stick out 0.02-0.035 W (A: 33 % of the rim, B: 65 %), earth may spill over them;
- grey boulders, half embedded, mostly toward the tip;
- clay clods: lumpy chunks with flat cuts (flat underside = ledge, flat-ish front) in 7 overlapping tiers; small rim chunks
  flush with the top outline, so the earth rounds into the top; 4 lobes make a blunt, off-centre tip;
- moss: clumps of 3-12 balls on about 70 % of the rim with gaps, about a third hang down as curtains; a little moss in niches;
- top: 4-5 stone groups (1 big + 2-4 small) ringed with moss, moss patches, pebbles.
Roots: dropped on Georg's call (11.10.); the root code stays but `roots=0`.
Everything is joined and fused by ONE voxel remesh into one closed mesh (V-136), lightly smoothed, decimated.
Colour per vertex comes from the nearest source part (clay / rock / moss / root / sand top);
rock vertices are projected back onto their faceted source, so rocks keep flat facets.
Run:  python kfb_ifk01_r3_clay.py -- OUTDIR VARIANT   (VARIANT: A = boulders + short band, B = long rock band)
Needs `kfb_ifk01_scholle.py` (R1, same folder) on sys.path.
"""
import bpy, bmesh, sys, math, json, os, random, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kfb_ifk01_scholle as S
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index('--') + 1:]
OUT, VID = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)
MC, H = S.MC, S.H
VOX = float(os.environ.get('IFK_VOX', '0.3'))
TRIS = int(os.environ.get('IFK_TRIS', '160000'))
SAMPLES = int(os.environ.get('IFK_SAMPLES', '32'))
RENDER = os.environ.get('IFK_RENDER', 'all')          # all | main | none
CFG = {
    'A': dict(seed=11, boulders=7, band_span=0.33, pockets=5, roots=0, moss_gap=0.3, top_groups=4),
    'B': dict(seed=23, boulders=4, band_span=0.65, pockets=4, roots=0, moss_gap=0.27, top_groups=5),
}[VID]
rs = random.Random(CFG['seed'])
t0 = time.time()
def log(*a):
    print(f'[{time.time() - t0:6.1f}s]', *a, flush=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
coll = bpy.data.collections.new('R3_' + VID); sc.collection.children.link(coll)

# ---------- 1. v7 body (template) ----------
pr = dict(S.PRESETS['C'])
m = S.build_scholle(pr, 128.0, soft=2)
meta = m['meta']; R0 = meta['R0']; D = meta['D']; rimT = meta['rimT']
body = S.to_object(m, 'R3_BODY', coll)
# R3 round 2 (critic 1): widest right under the rim, then a steady taper to a blunt tip; no stalk.
TAPER = [1.0, 0.95, 0.88, 0.8, 0.71, 0.62, 0.53, 0.44, 0.36, 0.28, 0.2]
ZS = float(os.environ.get('IFK_ZS', '1.0'))
def taper(u):
    f = min(max(u, 0), 1) * 10; i = min(9, int(f)); return TAPER[i] + (TAPER[i + 1] - TAPER[i]) * (f - i)
for v in body.data.vertices:
    z = v.co.z
    if z < -rimT:
        u = (-rimT - z) / D
        ft = 0.9 * taper(u) / max(0.2, meta['shape'](u))
        f = 1 + (ft - 1) * min(1.0, u / 0.06)
        v.co.x *= f; v.co.y *= f; v.co.z = -rimT - u * D * ZS
D = D * ZS
ZBOT = -rimT - D
log('v7 body', len(body.data.polygons), 'tris  depth', round(rimT + D, 1))

def bm_of(o):
    b = bmesh.new(); b.from_mesh(o.data); b.transform(o.matrix_world); return b

def hit(bvh, th, z, far=220.0):
    d = Vector((math.cos(th), math.sin(th), 0.0))
    loc, nor, i, dist = bvh.ray_cast(Vector((0, 0, z)) + d * far, -d)
    return (loc, nor) if loc is not None else (None, None)
FRONT = -math.pi / 2                                    # the side camera looks from -Y
def front_angle(spread):
    return FRONT + rs.uniform(-spread, spread)

# round off the v7 facets and spike fins (the clods go on top of this)
rb_ = body.modifiers.new('RB', 'REMESH'); rb_.mode = 'VOXEL'; rb_.voxel_size = 0.9
sb_ = body.modifiers.new('SB', 'SMOOTH'); sb_.factor = 0.8; sb_.iterations = 12
with bpy.context.temp_override(object=body, active_object=body):
    bpy.ops.object.modifier_apply(modifier='RB'); bpy.ops.object.modifier_apply(modifier='SB')
bvh_body = BVHTree.FromBMesh(bm_of(body))

def u_z(u):
    return -rimT - u * D

# ---------- 2. niches: one larger soft hollow + small pockets (0.03-0.06 W deep), cut into the body ----------
niches = []
spots = [(FRONT + (0.55 if VID == 'A' else -0.15), 0.3, (4.8, 8.5, 5.4))]
for k in range(CFG['pockets']):
    spots.append((front_angle(1.6) if k < 4 else rs.uniform(0, math.tau), rs.uniform(0.2, 0.7), (3.4, rs.uniform(4.2, 5.4), rs.uniform(3.0, 3.8))))
for th, u, rad in spots:
    p, n = hit(bvh_body, th, u_z(u))
    if p is None or any((p - q['p']).length < 14 for q in niches):
        continue
    c = p - n * 0.6
    niches.append(dict(c=c, r=rad, th=th, n=n.copy(), p=p.copy()))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1.0, location=c)
    e = bpy.context.active_object; e.scale = rad; e.rotation_euler = (0, 0, th)
    bo = body.modifiers.new('NICHE', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.solver = 'EXACT'; bo.object = e
    with bpy.context.temp_override(object=body, active_object=body):
        bpy.ops.object.modifier_apply(modifier='NICHE')
    bpy.data.objects.remove(e)
bvh_body = BVHTree.FromBMesh(bm_of(body))
log('niches', len(niches))

# ---------- part builders (each category is one bmesh, faces mapped to part ids) ----------
class Cat:
    def __init__(s, name):
        s.name = name; s.bm = bmesh.new(); s.face_part = []; s.parts = []
    def add(s, mat, subdiv=2, jitter=0.0, tone=1.0, kind='', lumps=0.0, cuts=()):
        """Icosphere -> optional jitter / soft lumps -> optional flat cuts (local axis, limit): vertices beyond the
        limit are pressed onto the plane, which leaves a flat face with a crisp edge (the remesh bevels it)."""
        g = bmesh.ops.create_icosphere(s.bm, subdivisions=subdiv, radius=1.0)
        vs = g['verts']
        if lumps:
            dirs = [(Vector((rs.gauss(0, 1), rs.gauss(0, 1), rs.gauss(0, 1))).normalized(), rs.uniform(0, 6.28), rs.uniform(0.6, 1.0)) for _ in range(4)]
        for v in vs:
            if jitter:
                v.co *= 1 + rs.uniform(-jitter, jitter)
            if lumps:
                v.co *= 1 + lumps * sum(w * math.cos(2.6 * v.co.dot(d) + ph_) for d, ph_, w in dirs) / 2.5
            for ax, lim in cuts:
                dd = v.co.dot(ax) - lim
                if dd > 0:
                    v.co -= ax * dd
            v.co = mat @ v.co
        nf = len({f for v in vs for f in v.link_faces})
        pid = len(s.parts); s.parts.append(dict(tone=tone, kind=kind, c=mat.translation.copy()))
        s.face_part += [pid] * nf
        return pid
    def bvh(s):
        s.bm.faces.ensure_lookup_table()
        return BVHTree.FromBMesh(s.bm)
CLAY, ROCK, MOSS, ROOT = Cat('clay'), Cat('rock'), Cat('moss'), Cat('root')

def ell(c, th, sr, st, sz, tilt=0.0):
    """Ellipsoid transform: radial (sr), tangential (st), vertical (sz) semi-axes, turned to angle th."""
    return Matrix.Translation(c) @ Matrix.Rotation(th, 4, 'Z') @ Matrix.Rotation(tilt, 4, 'Y') @ Matrix.Diagonal((sr, st, sz, 1.0))

def body_r(u):
    return R0 * 0.9 * taper(u)

def clod_cuts():
    """Flat underside (a ledge that casts a shadow line), a flat-ish front, sometimes one more random face."""
    cuts = [(Vector((0, 0, -1)), rs.uniform(0.45, 0.65)), (Vector((1, 0, 0.15)).normalized(), rs.uniform(0.7, 0.85))]
    if rs.random() < 0.6:
        a = rs.uniform(0, math.tau)
        cuts.append((Vector((math.cos(a) * 0.6, math.sin(a), rs.uniform(-0.3, 0.5))).normalized(), rs.uniform(0.7, 0.85)))
    return cuts

blocked = [(nc['c'], max(nc['r']) + 2.0) for nc in niches]

# ---------- 3. rock band: big fused faceted slabs, sticking out, earth spilling over them ----------
band_pts = []; band_zone = None
if CFG['band_span']:
    span = CFG['band_span'] * math.tau; th0 = FRONT - span * 0.55; u = 0.55
    nb = max(5, int(span * body_r(u) / 13.0))
    for k in range(nb):
        th = th0 + span * (k + 0.5) / nb + rs.uniform(-0.05, 0.05)
        uu = u + 0.06 * math.sin(k * 1.1 + CFG['seed']) + rs.uniform(-0.02, 0.02)
        p, n = hit(bvh_body, th, u_z(uu))
        if p is None:
            continue
        st = rs.uniform(10.0, 12.5); sz = rs.uniform(4.8, 6.2); sr = 5.0
        c = p - n * (sr - rs.uniform(2.8, 4.5))                 # sticks out 2.8-4.5 (0.02-0.035 W)
        ROCK.add(ell(c, th, sr, st, sz, rs.uniform(-0.12, 0.12)), subdiv=2, jitter=0.07, tone=rs.uniform(0.9, 1.1), kind='band',
                 cuts=[(Vector((1, 0, 0)), rs.uniform(0.75, 0.9)), (Vector((0, 0, 1)), 0.8), (Vector((0, 0, -1)), 0.8)])
        band_pts.append(c); blocked.append((c, 6.5))
    band_zone = (u_z(u + 0.12), u_z(u - 0.12))
    log('band slabs', len(band_pts))

# ---------- 4. boulders: half embedded, mostly toward the tip, union with the earth ----------
boulders = []
for k in range(CFG['boulders']):
    for _try in range(60):
        th = front_angle(1.4) if k < 4 else rs.uniform(0, math.tau)
        u = rs.uniform(0.62, 0.88) if k < CFG['boulders'] - 2 else rs.uniform(0.25, 0.5)
        p, n = hit(bvh_body, th, u_z(u))
        if p is None:
            continue
        rb = rs.uniform(5.0, 8.5) * (1.15 if k == 0 else 1.0)
        c = p - n * 0.1 * rb
        if all((c - b['c']).length > (rb + b['r']) * 1.05 for b in boulders) and all((c - q).length > rb + 8 for q in band_pts) \
                and all((c - nc['c']).length > rb + max(nc['r']) + 2 for nc in niches):
            break
    ROCK.add(ell(c, th, rb * 0.95, rb * 1.05, rb * 0.9, rs.uniform(-0.3, 0.3)), subdiv=2, jitter=0.1, tone=rs.uniform(0.88, 1.12), kind='boulder',
             cuts=[(Vector((rs.gauss(0, 1), rs.gauss(0, 1), rs.gauss(0, 1))).normalized(), rs.uniform(0.75, 0.88)) for _ in range(3)])
    boulders.append(dict(c=c, r=rb, n=n.copy(), th=th, u=u))
    blocked.append((c, rb * 0.8))
log('boulders', len(boulders))

# ---------- 5. clods: big faceted chunks (0.12-0.25 W) in overlapping tiers with ledges ----------
rows = [0.05, 0.19, 0.34, 0.5, 0.66, 0.8, 0.92]
nlobe = 0
for ri, u in enumerate(rows):
    rr = body_r(u)
    rad = (12.5 - 7.5 * u)
    n_ = max(3, int(math.tau * rr / (rad * 1.45)))
    off = rs.random()
    for j in range(n_):
        th = (j + off + rs.uniform(-0.25, 0.25)) / n_ * math.tau
        uu = min(0.97, max(0.03, u + rs.uniform(-0.035, 0.035)))
        p, n = hit(bvh_body, th, u_z(uu))
        if p is None:
            continue
        r = rad * rs.uniform(0.8, 1.2)
        sr, st, sz = r * 0.6, r * rs.uniform(0.95, 1.25), r * rs.uniform(0.6, 0.8)
        c = p - n * sr * 0.45
        c.z = min(c.z, -1.6 - sz * 1.1)                     # the top stays flat
        if c.z + sz > -rimT - 8.0:                           # near the rim: stay inside the top outline
            pr_, _n = hit(bvh_body, th, -0.5)
            rmax = (pr_.xy.length if pr_ is not None else R0) - 0.8 - sr * 1.0
            if c.xy.length > rmax:
                c.x, c.y = (c.xy.normalized() * rmax)
        bl = [(q, br) for q, br in blocked if (c - q).length < br + r * 0.5]
        if bl:
            # earth may spill over a band slab from above, but never cover a boulder or a niche
            if not (band_zone and all(any((q - bp).length < 1e-6 for bp in band_pts) for q, _ in bl) and c.z > band_zone[1]):
                continue
        CLAY.add(ell(c, th, sr, st, sz, rs.uniform(-0.12, 0.12)), subdiv=2, lumps=0.12, tone=rs.choice([0.9, 0.97, 1.0, 1.05, 1.1]),
                 kind='clod', cuts=clod_cuts() if u < 0.72 else ())
        nlobe += 1
# rim row: small chunks over the v7 rim band, flush with the top outline, so the earth rounds into the top
nrim = 58
for j in range(nrim):
    th = (j + rs.uniform(-0.3, 0.3)) / nrim * math.tau
    p, n = hit(bvh_body, th, -0.5)
    if p is None:
        continue
    sz = rs.uniform(2.6, 3.4); st = rs.uniform(3.8, 5.4); sr = rs.uniform(2.6, 3.2)
    rr_ = p.xy.length - sr * rs.uniform(0.45, 0.7)
    c = Vector((math.cos(th) * rr_, math.sin(th) * rr_, rs.uniform(-2.6, -1.8)))
    CLAY.add(ell(c, th, sr, st, sz, rs.uniform(-0.2, 0.2)), subdiv=2, lumps=0.2, tone=rs.uniform(0.92, 1.06), kind='rimchunk')
# blunt, off-centre tip: 2-3 secondary lobes instead of a stalk
ax, ay = meta['apexXZ'][0], -meta['apexXZ'][1]
a0 = rs.uniform(0, math.tau)
for k in range(4):                                         # 3 lobes cover the flat v7 bottom, the 4th is the off-centre tip
    a = a0 + k * math.tau / 3 + rs.uniform(-0.4, 0.4); off = rs.uniform(5.0, 8.0) if k < 3 else 3.5
    r = rs.uniform(6.5, 8.0) if k < 3 else 5.2
    c = Vector((ax + math.cos(a) * off, ay + math.sin(a) * off, ZBOT + r * 0.35 if k < 3 else ZBOT - 2.5))
    CLAY.add(ell(c, a, r, r * 1.1, r * 0.85), subdiv=2, lumps=0.15, tone=0.9, kind='tip', cuts=[(Vector((0, 0, 1)), 0.6)])
log('clods', nlobe)

# ---------- 6. raw union BVH for things that sit on the outside (roots, moss) ----------
def joined_bvh():
    b = bm_of(body)
    for cat in (CLAY, ROCK):
        me = bpy.data.meshes.new('tmp'); cat.bm.to_mesh(me); b.from_mesh(me); bpy.data.meshes.remove(me)
    return BVHTree.FromBMesh(b)
bvh_out = joined_bvh()

# ---------- 7. roots: many thin tapered roots from under overhangs; they hug the wall, then hang free ----------
roots = []
def grow(th, z, length, r0, r1, drift, free_max):
    pts = []; s = 0.0
    p, n = hit(bvh_out, th, z)
    if p is None:
        return pts
    cur = p + n * 0.4 * r0; free = 0.0; sway = Vector((rs.uniform(-1, 1), rs.uniform(-1, 1), 0)) * 0.08
    while s < length:
        f = s / length; r = r0 + (r1 - r0) * f
        ROOT.add(ell(cur, th, r, r, r), subdiv=1, kind='root')
        pts.append((cur.copy(), th, cur.z))
        step = max(0.25, r * 0.6)
        nxt = cur + Vector((0, 0, -step))
        th = math.atan2(nxt.y, nxt.x) + drift * step / 10.0
        pw, nw = hit(bvh_out, th, nxt.z)
        if pw is not None and pw.xy.length >= nxt.xy.length - 1.6 * r and free == 0.0:
            nxt = pw + nw * 0.4 * r                       # still on the wall: hug it
        else:                                             # the wall falls away under an overhang: hang free
            free += step; nxt += sway * step; sway.x += rs.uniform(-0.03, 0.03); sway.y += rs.uniform(-0.03, 0.03)
            if free > free_max:
                break
        cur = nxt; s += step
    return pts
for k in range(CFG['roots']):
    th = front_angle(1.7) if k < CFG['roots'] * 0.7 else rs.uniform(0, math.tau)
    z0 = rs.choice([-rimT - 1.5, -rimT - 2.5, u_z(rs.uniform(0.12, 0.4))])
    main = grow(th, z0, rs.uniform(14, 28), rs.uniform(0.55, 0.75), 0.3, rs.uniform(-0.06, 0.06), rs.uniform(6, 16))
    if not main:
        continue
    roots.append(main)
    for bi in range(rs.randint(1, 2)):
        if len(main) < 10:
            break
        c, th2, z2 = main[int(len(main) * rs.uniform(0.25, 0.6))]
        grow(th2 + rs.uniform(-0.05, 0.05), z2, rs.uniform(5, 11), 0.42, 0.28, (0.3 if bi == 0 else -0.3), rs.uniform(3, 9))
log('roots', len(roots), 'spheres', len(ROOT.parts))

# ---------- 8. moss: rim clumps (3-12 balls) over 60-75 % of the rim with gaps, 30 % hang down; a few in ledges/niches ----------
nclump = 72
for j in range(nclump):
    a = (j + rs.uniform(-0.3, 0.3)) / nclump * math.tau
    if rs.random() < CFG['moss_gap']:
        continue                                          # gap: bare earth lip
    p, n = hit(bvh_out, a, -0.6)
    if p is None:
        continue
    d = Vector((math.cos(a), math.sin(a), 0)); t = Vector((-d.y, d.x, 0))
    cnt = rs.randint(3, 12)
    for q in range(cnt):
        r = min(3.8, max(1.1, rs.gauss(2.4, 0.75)))
        o = t * rs.gauss(0, 2.6) - d * abs(rs.gauss(0, 2.2)) + d * 0.4 * r
        MOSS.add(ell(p + o + Vector((0, 0, rs.uniform(-0.5, 0.35) * r)), a, r, r, r * 0.9), subdiv=2, tone=rs.uniform(0.82, 1.15), kind='rim')
    if rs.random() < 0.32:                                # curtain: hangs 4-10 down the side
        zz = -1.2; rr = rs.uniform(1.8, 2.6); drop = rs.uniform(4.0, 10.0); o = t * rs.gauss(0, 1.5)
        while -zz < drop:
            rr *= rs.uniform(0.82, 0.95); zz -= rr * 1.25
            pp, nn = hit(bvh_out, math.atan2((p + o).y, (p + o).x), zz)
            if pp is None:
                break
            MOSS.add(ell(pp + nn * 0.5 * rr, a, rr, rr, rr), subdiv=2, tone=rs.uniform(0.8, 1.05), kind='spill')
for nc in niches[:3]:                                     # a little moss in the niches and on 3 ledges
    for q in range(rs.randint(3, 5)):
        r = rs.uniform(1.0, 1.6)
        pp, nn = hit(bvh_out, nc['th'] + rs.uniform(-0.1, 0.1), nc['c'].z + nc['r'][2] * 0.9)
        if pp is not None:
            MOSS.add(ell(pp + nn * 0.4 * r, 0, r, r, r), subdiv=2, tone=rs.uniform(0.85, 1.05), kind='niche')

# ---------- 9. top: 3-5 stone groups at the rim (1 big + 2-4 small, ringed with moss), moss patches, pebbles ----------
ng = CFG['top_groups']
for g in range(ng):
    a = FRONT + (g + 0.5) / ng * math.tau + rs.uniform(-0.35, 0.35)
    rr = R0 * rs.uniform(0.74, 0.84) * (1 + 0.04 * math.sin(a * 3))
    base = Vector((math.cos(a) * rr, math.sin(a) * rr, 0))
    big = rs.uniform(4.0, 5.0); sizes = [big] + sorted([rs.uniform(1.2, 2.6) for _ in range(rs.choice([2, 4]))], reverse=True)
    for i, s in enumerate(sizes):
        off = Vector((rs.uniform(-1, 1), rs.uniform(-1, 1), 0)).normalized() * (0 if i == 0 else big + s * rs.uniform(0.5, 1.1))
        c = base + off + Vector((0, 0, s * 0.3))
        ROCK.add(ell(c, rs.uniform(0, 6.28), s, s * rs.uniform(0.85, 1.1), s * 0.85), subdiv=2, jitter=0.08, tone=rs.uniform(0.92, 1.12), kind='top',
                 cuts=[(Vector((rs.gauss(0, 1), rs.gauss(0, 1), rs.uniform(0, 1))).normalized(), rs.uniform(0.75, 0.88)) for _ in range(3)])
    for q in range(rs.randint(7, 11)):                    # moss ring around the group
        r = rs.uniform(1.0, 1.9); aa = rs.uniform(0, math.tau)
        c = base + Vector((math.cos(aa), math.sin(aa), 0)) * rs.uniform(big * 1.1, big * 2.3)
        MOSS.add(ell(c + Vector((0, 0, r * 0.2)), 0, r, r, r * 0.8), subdiv=2, tone=rs.uniform(0.9, 1.15), kind='top')
for k in range(14):                                       # moss patches on the sand, denser toward the rim
    a = rs.uniform(0, math.tau); rr = R0 * (math.sqrt(rs.uniform(0.1, 0.6)) if k < 5 else rs.uniform(0.76, 0.9))
    base = Vector((math.cos(a) * rr, math.sin(a) * rr, 0))
    for q in range(rs.randint(5, 12)):
        r = rs.uniform(0.8, 1.6)
        c = base + Vector((rs.gauss(0, 2.3), rs.gauss(0, 2.3), 0))
        MOSS.add(ell(c + Vector((0, 0, -r * 0.15)), 0, r, r, r * 0.6), subdiv=2, tone=rs.uniform(0.95, 1.2), kind='patch')
for k in range(30):                                       # pebbles
    a = rs.uniform(0, math.tau); rr = R0 * math.sqrt(rs.uniform(0.0, 0.85))
    s = rs.uniform(0.5, 1.0)
    ROCK.add(ell(Vector((math.cos(a) * rr, math.sin(a) * rr, s * 0.2)), rs.uniform(0, 6.28), s, s * 0.9, s * 0.7), subdiv=1, jitter=0.15, tone=rs.uniform(0.9, 1.1), kind='pebble')
for nc in niches:                                         # pebbles on every niche floor
    for q in range(rs.randint(2, 4)):
        s = rs.uniform(0.7, 1.3)
        p, n = hit(bvh_body, nc['th'] + rs.uniform(-0.1, 0.1), nc['c'].z - nc['r'][2] * 0.6)
        if p is not None:
            ROCK.add(ell(p - n * 0.1, rs.uniform(0, 6.28), s, s, s * 0.75), subdiv=1, jitter=0.15, tone=rs.uniform(0.9, 1.1), kind='pebble')
log('rock parts', len(ROCK.parts), 'moss balls', len(MOSS.parts), 'clay parts', len(CLAY.parts))

# ---------- 10. ONE mesh: join everything, voxel remesh, light smooth, decimate ----------
src = {}
def cat_obj(cat):
    me = bpy.data.meshes.new('SRC_' + cat.name); cat.bm.to_mesh(me)
    o = bpy.data.objects.new('SRC_' + cat.name, me); coll.objects.link(o); src[cat.name] = o; return o
ball = bm_of(body)
for cat in (CLAY, ROCK, MOSS, ROOT):
    o = cat_obj(cat)
    ball.from_mesh(o.data)
me = bpy.data.meshes.new('IFK01_K1R3_' + VID); ball.to_mesh(me); ball.free()
isl = bpy.data.objects.new('IFK01_K1R3_' + VID, me); coll.objects.link(isl)
for o in [body] + list(src.values()):
    o.hide_render = True; o.hide_viewport = True
rm = isl.modifiers.new('REMESH', 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = VOX; rm.adaptivity = 0.0
with bpy.context.temp_override(object=isl, active_object=isl):
    bpy.ops.object.modifier_apply(modifier='REMESH')
log('remesh', len(isl.data.polygons), 'faces')
sm = isl.modifiers.new('SMOOTH', 'SMOOTH'); sm.factor = 0.5; sm.iterations = 6
with bpy.context.temp_override(object=isl, active_object=isl):
    bpy.ops.object.modifier_apply(modifier='SMOOTH')
# keep only the main shell (drop any floating crumb the remesh may leave)
bm = bmesh.new(); bm.from_mesh(isl.data); bm.verts.ensure_lookup_table()
seen = set(); comps = []
for v0 in bm.verts:
    if v0.index in seen:
        continue
    stack = [v0]; comp = []; seen.add(v0.index)
    while stack:
        v = stack.pop(); comp.append(v)
        for e in v.link_edges:
            w = e.other_vert(v)
            if w.index not in seen:
                seen.add(w.index); stack.append(w)
    comps.append(comp)
comps.sort(key=len, reverse=True)
dropped = sum(len(c) for c in comps[1:])
if len(comps) > 1:
    bmesh.ops.delete(bm, geom=[v for c in comps[1:] for v in c], context='VERTS')
bm.to_mesh(isl.data); bm.free()
log('shells', len(comps), 'dropped verts', dropped)
n0 = sum(len(p.vertices) - 2 for p in isl.data.polygons)
dec = isl.modifiers.new('DEC', 'DECIMATE'); dec.decimate_type = 'COLLAPSE'; dec.ratio = min(1.0, TRIS / max(1, n0)); dec.use_collapse_triangulate = True
with bpy.context.temp_override(object=isl, active_object=isl):
    bpy.ops.object.modifier_apply(modifier='DEC')
log('decimated', len(isl.data.polygons), 'tris')

# ---------- 11. colour by nearest source part; rock facets restored ----------
bvhs = {k: (Cat_.bvh(), Cat_) for k, Cat_ in (('clay', CLAY), ('rock', ROCK), ('moss', MOSS), ('root', ROOT))}
bvhs['body'] = (bvh_body, None)
COL = dict(clay='#c8742f', clay_deep='#a5552a', clay_hi='#d89048', sand='#d9a24c', rock='#8d857c', moss='#a7b832', moss_dark='#5c771a', root='#80603f')
L = {k: S.hexlin(v) for k, v in COL.items()}
mesh = isl.data
bm = bmesh.new(); bm.from_mesh(mesh); bm.verts.ensure_lookup_table(); bm.normal_update()
ca = []; mask = []
rock_pull = 0
for v in bm.verts:
    co = v.co; best = None
    for k, (bv, cat) in bvhs.items():
        loc, nor, fi, d = bv.find_nearest(co)
        if loc is None:
            continue
        if best is None or d < best[1]:
            best = (k, d, fi, loc, cat)
    k, d, fi, loc, cat = best
    tone = cat.parts[cat.face_part[fi]]['tone'] if cat is not None and fi < len(cat.face_part) else 1.0
    zf = min(1.0, max(0.0, -co.z / (rimT + D)))
    if k in ('clay', 'body'):
        if co.z > -0.7 and v.normal.z > 0.55:
            rgb = [c * tone ** 0.3 for c in L['sand']]; mk = (0.0, 0.0, 0.0)
        else:
            base = S.mix(L['clay'], L['clay_deep'], 0.15 + 0.55 * zf)
            base = S.mix(base, L['clay_hi'], max(0.0, (tone - 1.0) * 3)) if tone > 1.0 else S.mix(base, L['clay_deep'], (1.0 - tone) * 4)
            rgb = base; mk = (1.0, 0.0, 0.0)
    elif k == 'rock':
        rgb = [c * tone for c in L['rock']]; mk = (0.0, 0.0, 1.0)
        if d < 0.45:
            v.co = loc.copy(); rock_pull += 1
    elif k == 'moss':
        rgb = S.mix(L['moss_dark'], L['moss'], min(1.0, max(0.0, 0.35 + 0.5 * (tone - 0.85) / 0.35 + 0.3 * v.normal.z)))
        mk = (0.0, 1.0, 0.0)
    else:
        rgb = list(L['root']); mk = (0.2, 0.0, 0.0)
    ca.append(rgb); mask.append(mk)
bm.to_mesh(mesh); bm.free()
log('coloured, rock verts on facets', rock_pull)
cA = mesh.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
cM = mesh.color_attributes.new('Mask', 'FLOAT_COLOR', 'POINT')
for i in range(len(mesh.vertices)):
    cA.data[i].color = (*ca[i], 1.0); cM.data[i].color = (*mask[i], 1.0)
mesh.color_attributes.active_color = cA
for p in mesh.polygons:
    p.use_smooth = True
# sharp edges only between rock faces (boulder facets), everything else stays soft clay
bm = bmesh.new(); bm.from_mesh(mesh); bm.edges.ensure_lookup_table()
isrock = [mk[2] > 0.5 for mk in mask]
sharp = [False] * len(bm.edges)
for e in bm.edges:
    if len(e.link_faces) == 2 and all(isrock[v.index] for f in e.link_faces for v in f.verts):
        if e.calc_face_angle(0.0) > math.radians(18):
            sharp[e.index] = True
bm.free()
at = mesh.attributes.get('sharp_edge') or mesh.attributes.new('sharp_edge', 'BOOLEAN', 'EDGE')
at.data.foreach_set('value', sharp)
log('sharp rock edges', sum(sharp))

# ---------- 12. material: clay pores (voronoi pits), moss fuzz, rock grain, AO in the creases ----------
def material():
    """Clay: pits at three sizes + fine crack lines (bump) and darker pits; moss fuzz; rock grain with a sheen on facet edges;
    strong crevice AO. Mask attribute: R = clay, G = moss, B = rock."""
    mt = bpy.data.materials.new('KFB_R3_CLAY'); mt.use_nodes = True
    nt = mt.node_tree; N = nt.nodes; Lk = nt.links.new
    b = N['Principled BSDF']
    col = N.new('ShaderNodeVertexColor'); col.layer_name = 'Col'
    msk = N.new('ShaderNodeVertexColor'); msk.layer_name = 'Mask'
    sep = N.new('ShaderNodeSeparateColor'); Lk(msk.outputs['Color'], sep.inputs[0])
    tc = N.new('ShaderNodeTexCoord')
    def math_(op, a, bb=None, v=None):
        n = N.new('ShaderNodeMath'); n.operation = op
        (Lk(a, n.inputs[0]) if not isinstance(a, (int, float)) else n.inputs[0].__setattr__('default_value', a))
        if bb is not None:
            (Lk(bb, n.inputs[1]) if not isinstance(bb, (int, float)) else n.inputs[1].__setattr__('default_value', bb))
        return n.outputs[0]
    def pits(scale, lo, hi):
        vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = scale; Lk(tc.outputs['Object'], vo.inputs['Vector'])
        mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = lo; mr.inputs['From Max'].default_value = hi
        Lk(vo.outputs['Distance'], mr.inputs['Value']); return mr.outputs['Result']
    p = math_('MULTIPLY', math_('MULTIPLY', pits(0.45, 0.05, 0.14), pits(1.1, 0.05, 0.17)), pits(2.6, 0.06, 0.2))
    cr = N.new('ShaderNodeTexVoronoi'); cr.feature = 'DISTANCE_TO_EDGE'; cr.inputs['Scale'].default_value = 0.16
    wv = N.new('ShaderNodeTexNoise'); wv.inputs['Scale'].default_value = 0.6; wv.inputs['Detail'].default_value = 3
    Lk(tc.outputs['Object'], wv.inputs['Vector'])
    wm = N.new('ShaderNodeVectorMath'); wm.operation = 'MULTIPLY_ADD'; wm.inputs[1].default_value = (1.6, 1.6, 1.6)
    Lk(wv.outputs['Color'], wm.inputs[0]); Lk(tc.outputs['Object'], wm.inputs[2]); Lk(wm.outputs[0], cr.inputs['Vector'])
    crm = N.new('ShaderNodeMapRange'); crm.inputs['From Min'].default_value = 0.0; crm.inputs['From Max'].default_value = 0.014
    Lk(cr.outputs['Distance'], crm.inputs['Value'])
    sp = N.new('ShaderNodeTexNoise'); sp.inputs['Scale'].default_value = 0.09; Lk(tc.outputs['Object'], sp.inputs['Vector'])
    spm = N.new('ShaderNodeMapRange'); spm.inputs['From Min'].default_value = 0.5; spm.inputs['From Max'].default_value = 0.62
    Lk(sp.outputs['Fac'], spm.inputs['Value'])
    crack = math_('MAXIMUM', crm.outputs['Result'], math_('SUBTRACT', 1.0, spm.outputs['Result']))   # 0 in a crack, only in some areas
    clayh = math_('MULTIPLY', p, crack)
    nzm = N.new('ShaderNodeTexNoise'); nzm.inputs['Scale'].default_value = 9.0; nzm.inputs['Detail'].default_value = 8; Lk(tc.outputs['Object'], nzm.inputs['Vector'])
    nzr = N.new('ShaderNodeTexNoise'); nzr.inputs['Scale'].default_value = 2.5; nzr.inputs['Detail'].default_value = 6; Lk(tc.outputs['Object'], nzr.inputs['Vector'])
    R_, G_, B_ = sep.outputs[0], sep.outputs[1], sep.outputs[2]
    h = math_('ADD', math_('MULTIPLY', R_, clayh), math_('SUBTRACT', 1.0, R_))
    h = math_('ADD', h, math_('MULTIPLY', G_, nzm.outputs['Fac']))
    h = math_('ADD', h, math_('MULTIPLY', B_, math_('MULTIPLY', nzr.outputs['Fac'], 0.3)))
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6; bump.inputs['Distance'].default_value = 0.3
    Lk(h, bump.inputs['Height']); Lk(bump.outputs['Normal'], b.inputs['Normal'])
    # shade: pits and cracks darker on clay, strong crevice AO everywhere
    dark = math_('ADD', math_('MULTIPLY', p, 0.35), 0.65)              # 0.65 in a pit/crack, 1 on the surface
    dark = math_('ADD', math_('MULTIPLY', R_, math_('SUBTRACT', dark, 1.0)), 1.0)
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 4.0; ao.samples = 12
    aom = N.new('ShaderNodeMapRange'); aom.inputs['To Min'].default_value = 0.25; aom.inputs['To Max'].default_value = 1.0
    Lk(ao.outputs['AO'], aom.inputs['Value'])
    f = math_('MULTIPLY', dark, aom.outputs['Result'])
    fc = N.new('ShaderNodeCombineColor'); [Lk(f, fc.inputs[i]) for i in range(3)]
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1.0
    Lk(col.outputs['Color'], mul.inputs['A']); Lk(fc.outputs[0], mul.inputs['B'])
    Lk(mul.outputs['Result'], b.inputs['Base Color'])
    # roughness: clay/moss 0.9, rock 0.55 (sheen on the facets)
    Lk(math_('SUBTRACT', 0.9, math_('MULTIPLY', B_, 0.35)), b.inputs['Roughness'])
    return mt
mesh.materials.clear(); mesh.materials.append(material())

# ---------- 13. checks ----------
bm = bmesh.new(); bm.from_mesh(mesh)
nonman = sum(1 for e in bm.edges if not e.is_manifold)
openb = sum(1 for e in bm.edges if e.is_boundary)
bm.free()
xs = [v.co.x for v in mesh.vertices]; ys = [v.co.y for v in mesh.vertices]; zs = [v.co.z for v in mesh.vertices]
W = max(max(xs) - min(xs), max(ys) - min(ys))
met = dict(variant=VID, W_MC=round(W / MC, 1), depth_W=round((max(zs) - min(zs)) / W, 2), top_z=round(max(zs), 2),
           tris=len(mesh.polygons), objects=1, shells=1, dropped_crumb_verts=dropped, open_edges=openb, non_manifold_edges=nonman,
           parts=dict(clay=len(CLAY.parts), rock=len(ROCK.parts), moss=len(MOSS.parts), root_spheres=len(ROOT.parts)),
           boulders=len(boulders), band_slabs=len(band_pts), roots=len(roots), niches=len(niches), voxel=VOX, seed=CFG['seed'])
log('METRICS', json.dumps(met))
json.dump(met, open(f'{OUT}/K1R3_{VID}_metrics.json', 'w'), indent=1)

# detail targets for the renders
det = dict(
    rim=Vector((math.cos(FRONT - 0.25) * R0 * 0.98, math.sin(FRONT - 0.25) * R0 * 0.98, -4.0)),
    boulder=boulders[0]['c'] if boulders else (band_pts[len(band_pts) // 2] if band_pts else Vector((0, -50, -20))),
    root=max(roots[:6], key=len)[len(max(roots[:6], key=len)) // 3][0] if roots else Vector((0, -55, -12)),
    niche=niches[0]['p'] if niches else Vector((0, -50, -20)),
    band=band_pts[len(band_pts) // 2] if band_pts else None,
)
json.dump({k: list(v) if v is not None else None for k, v in det.items()}, open(f'{OUT}/K1R3_{VID}_targets.json', 'w'))

# ---------- 14. scale props (separate objects, not part of the island): figure 1 H (red), car 6 x 2.9 (blue) ----------
def prop_mat(name, h):
    mt = bpy.data.materials.new(name); mt.use_nodes = True
    mt.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*S.hexlin(h), 1); return mt
bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=H * 0.78, location=(-8, -R0 * 0.62, H * 0.39))
fig = bpy.context.active_object; fig.name = 'SCALE_FIGURE_1H'; fig.data.materials.append(prop_mat('FIG', '#e0245e'))
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.62, location=(-8, -R0 * 0.62, H * 0.78 + 0.5))
hd = bpy.context.active_object; hd.name = 'SCALE_FIGURE_HEAD'; hd.data.materials.append(fig.data.materials[0])
bpy.ops.mesh.primitive_cube_add(size=1, location=(2, -R0 * 0.64, 1.1))
car = bpy.context.active_object; car.name = 'SCALE_CAR'; car.scale = (6.0, 2.9, 2.2); car.data.materials.append(prop_mat('CAR', '#1f5fd6'))
for o in (fig, hd, car):
    if o.name not in coll.objects:
        coll.objects.link(o)
    for c_ in list(o.users_collection):
        if c_ != coll:
            c_.objects.unlink(o)

# ---------- 15. export + save ----------
for o in bpy.context.view_layer.objects:
    o.select_set(False)
isl.select_set(True)
bpy.context.view_layer.objects.active = isl
try:
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/IFK01_K1R3_{VID}_M20MC.glb', use_selection=True, export_format='GLB',
                              export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/IFK01_K1R3_{VID}_M20MC.glb', use_selection=True, export_format='GLB')
for o in [body] + list(src.values()):
    bpy.data.objects.remove(o)
bpy.ops.wm.save_as_mainfile(filepath=f'{OUT}/IFK01_K1R3_{VID}.blend', compress=True)
log('saved')
