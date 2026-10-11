"""KFB Coconino Mesas R4 · step 1 · round 3 ("grown, not baked") · M01 Flat-Top Mesa with arch, M02 Needle Butte, M03 Bench Mesa.

Georg 11.10. (evening): the R4 round 1/2 modules looked baked: columns pulled up, a lid on top, white lines straight across,
sand as glued-on balls. Wanted: natural, grown terrain in a cartoon reading of real mesas (Road Runner deserts), forms that thin
upward, arches under the mesas, sand that behaves like sand, no constructed look.

Mental model (see `RESEARCH_CC_R4_MESA_FORM.md`):
- one mass of horizontal strata; the top is simply where the resistant layer stops, NOT a lid. No overhang anywhere:
  the radius never grows with height, so every form thins upward;
- cliff-and-bench: hard layers make steep cliffs, soft layers make sloping benches (M03), soft steps at strata (M01);
- the cliff is cut by joints/gullies: deep near the foot, fading upward, irregular spacing; the ribs between them are buttresses;
- upper cliffs retreat more on one side (asymmetry), plan outlines have lobes and concave bays;
- arches form in a thin fin where a soft layer undercuts a hard one (M01: a spur fin with an archway at its foot);
- talus and sand: debris cones under every gully at the angle of repose (concave, steepest at the apex), merged into an apron;
  wind drags the apron out into a tail on the lee side; fallen blocks lie at the foot (big blocks roll furthest) and sand banks
  against them. Nothing is glued on: everything is one signed-distance field, meshed once (marching cubes) = one closed mesh.
Colour: soft, warped strata tones (no lines), lighter salmon zone under the top, sandy top and talus.
Run:  python kfb_cc_mesa_v2.py -- OUTDIR M01|M02|M03
"""
import bpy, bmesh, sys, os, math, json, random, time
import numpy as np
from skimage.measure import marching_cubes
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT, MID = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)
MC, H_ = 6.4, 3.64
VOX = float(os.environ.get('CC_VOX', '0.3'))
TRIS = int(os.environ.get('CC_TRIS', '110000'))
t0 = time.time()
def log(*a):
    print(f'[{time.time() - t0:6.1f}s]', *a, flush=True)

SPEC = {
    'M01': dict(seed=411, R=14.5, aspect=1.45, H=32.0, ht=0.3, lean=0.34, lobes=[(2, 0.05), (3, 0.06), (5, 0.03)],
                bays=3, gully_gap=(5.0, 11.0), steps=[(0.55, 0.06), (0.8, 0.05)], arch=True, wind=-0.6, blocks=30),
    'M02': dict(seed=422, R=4.6, aspect=1.15, H=42.0, ht=0.24, lean=0.42, lobes=[(2, 0.08), (3, 0.06)],
                bays=1, gully_gap=(2.6, 4.4), steps=[(0.42, 0.08), (0.66, 0.08), (0.84, 0.06)], arch=False, wind=-0.6, blocks=22),
    'M03': dict(seed=433, R=18.5, aspect=1.25, H=33.0, ht=0.24, lean=0.22, lobes=[(2, 0.05), (3, 0.05), (4, 0.03)],
                bays=3, gully_gap=(5.0, 11.0), steps=[(0.3, 0.04), (0.78, 0.05)], bench=(0.46, 0.12, 0.62), arch=False, wind=-0.6, blocks=30),
}[MID]
rs = random.Random(SPEC['seed']); rng = np.random.default_rng(SPEC['seed'])
R, ASP, H = SPEC['R'], SPEC['aspect'], SPEC['H']
TAU = math.tau

# ---------------- smooth noise (sum of random plane waves) ----------------
def make_noise(n, scale):
    d = rng.normal(size=(n, 3)); d /= np.linalg.norm(d, axis=1, keepdims=True)
    return d / scale * TAU, rng.uniform(0, TAU, n)
NZ = [make_noise(10, s) for s in (14.0, 6.0, 2.4)]
def noise(P, amps):
    v = np.zeros(P.shape[0], np.float32)
    for (k, ph), a in zip(NZ, amps):
        v += a * np.sin(P @ k.T + ph).sum(1) / math.sqrt(len(ph))
    return v

def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1); return b + (a - b) * h - k * h * (1 - h)
def smax(a, b, k):
    return -smin(-a, -b, k)
def angd(a, b):
    return (a - b + np.pi) % TAU - np.pi

# ---------------- plan outline with lobes and concave bays ----------------
LPH = [rs.uniform(0, TAU) for _ in SPEC['lobes']]
BAYS = [(rs.uniform(0, TAU), rs.uniform(0.1, 0.18), rs.uniform(0.16, 0.3)) for _ in range(SPEC['bays'])]   # (angle, depth, width)
def rplan(th):
    c, s = np.cos(th), np.sin(th); n = 2.6
    se = (np.abs(c / ASP) ** n + np.abs(s) ** n) ** (-1.0 / n)
    lob = 1 + sum(a * np.sin(k * th + LPH[i]) for i, (k, a) in enumerate(SPEC['lobes']))
    bay = 1 - sum(d * np.exp(-(angd(th, a) / w) ** 2) for a, d, w in BAYS)
    return R * se * lob * bay
RET_A = rs.uniform(0, TAU)
def retreat(th):                                          # upper cliffs retreat more on one side
    return 0.55 + 0.45 * (0.5 + 0.5 * np.cos(th - RET_A))

# gullies: irregular spacing along the perimeter, depth fading upward, some stop short of the top
GUL = []
a = rs.uniform(0, 0.3)
while a < TAU - 0.05:
    r_here = float(rplan(np.array(a)))
    GUL.append(dict(a=a, depth=rs.uniform(0.6, 1.0) * (0.12 if MID == 'M02' else 0.13) * R, w=rs.uniform(1.0, 3.2) * (0.5 if MID == 'M02' else 1.0),
                    top=rs.uniform(0.6, 1.0), wig=rs.uniform(0, TAU), cone=0.92 + 0.15 * rs.random()))
    a += rs.uniform(*SPEC['gully_gap']) / max(3.0, r_here)

def facet(th, n, rot):
    """Chamfered polygon radius factor (1 at the corners), rounded a little."""
    a = (th - rot) % (TAU / n) - TAU / (2 * n)
    return np.clip(math.cos(math.pi / n) / np.cos(a), 0, 1.0) ** 0.8 * 1.08

def body_radius(th, z):
    """Radius of the rock body at angle th and height z (never grows with height)."""
    h = np.clip(z / H, 0, 1.2)
    ht = SPEC['ht']
    t = np.clip((h - ht) / (1 - ht), 0, 1)
    rp = rplan(th)
    if MID == 'M02':                                      # spire: strong taper, faceted (chamfered polygon) section
        prof = (1 - SPEC['lean'] * t ** 0.85) * facet(th, 5, 0.5)
    else:
        prof = 1 - SPEC['lean'] * t ** 0.75 * retreat(th)     # cartoon taper: flares at the foot, thins upward
    for hs, st in SPEC['steps']:                          # soft strata steps (slight set-back, no ledge line)
        prof = prof - st * retreat(th) * np.clip((h - hs) / 0.05, 0, 1) ** 2 * (3 - 2 * np.clip((h - hs) / 0.05, 0, 1))
    r = rp * prof
    # gullies / joints
    g = np.zeros_like(r)
    for G in GUL:
        aa = G['a'] + 0.04 * np.sin(z * 0.25 + G['wig'])
        ds = angd(th, aa) * rp
        fade = np.clip(1 - t / G['top'], 0, 1) ** 0.7 * (0.55 + 0.45 * np.clip(1 - t, 0, 1))
        g = np.maximum(g, G['depth'] * fade * np.exp(-(ds / G['w']) ** 2))
    return r - g

# ---------------- grid ----------------
pad = 3.0
apex0 = SPEC['ht'] * H * 1.05
ext_xy = R * ASP * 1.25 + apex0 / math.tan(math.radians(33)) * (1.0 if MID == 'M02' else 1.3) * 1.8 + 8 + (R * 1.6 if MID == 'M02' else 0)
lo = np.array([-ext_xy, -ext_xy, -1.0]); hi = np.array([ext_xy, ext_xy, H + 4.0])
nx, ny, nz = [int(math.ceil((hi[i] - lo[i]) / VOX)) + 1 for i in range(3)]
log('grid', nx, ny, nz, nx * ny * nz / 1e6, 'M voxels')
xs = lo[0] + np.arange(nx) * VOX; ys = lo[1] + np.arange(ny) * VOX; zs = lo[2] + np.arange(nz) * VOX
X, Y = np.meshgrid(xs, ys, indexing='ij'); X = X.astype(np.float32); Y = Y.astype(np.float32)

# M03: upper cliff sits toward the back (+y): one side nearly flush, wide bench in front
def centre(z):
    if MID == 'M03':
        b0, bh, sc = SPEC['bench']
        s = np.clip((z / H - b0) / bh, 0, 1); s = s * s * (3 - 2 * s)
        return 0.0, R * (1 - sc) * 0.9 * s
    if MID == 'M02':
        return 0.06 * R * (z / H) * 8, 0.0                # slight lean of the spire
    return 0.0, 0.0
def m03_scale(z):
    b0, bh, sc = SPEC['bench']
    h = z / H
    s = np.clip((h - b0) / bh, 0, 1) ** 0.55                 # soft-layer bench: a concave slope, steepest at its top
    return 1 - (1 - sc) * s

# arch (M01): a spur fin from one lobe, archway at its foot (soft layer undercut)
if SPEC['arch']:
    AA = rs.uniform(0, TAU) if False else math.pi * 0.08         # toward +x, visible from the front-right
    r_at = float(rplan(np.array(AA)))
    ARCH = dict(dir=np.array([math.cos(AA), math.sin(AA)]), base=r_at * 0.8, L=1.45 * R, w=0.3 * R, hgt=0.86 * H)

# talus: debris cones under the gully mouths + an apron with a lee-side tail; blocks at the foot
ANG = math.radians(33)                                     # angle of repose of sandstone scree
LA_F = 0.8 if MID == 'M02' else 0.72
WIND = SPEC['wind'] * math.pi                              # direction the sand is blown toward (lee side)
def talus_height(Xs, Ys):
    th = np.arctan2(Ys, Xs); rho = np.hypot(Xs, Ys)
    rb = body_radius(th, np.full_like(th, SPEC['ht'] * H))
    out = np.maximum(rho - rb, 0)
    apex = SPEC['ht'] * H * 1.05
    La = apex / math.tan(ANG) * LA_F * (1 + 0.4 * (0.5 + 0.5 * np.cos(th - WIND)) ** 3)      # longer on the lee side
    apron = apex * 0.86 * np.clip(1 - out / La, 0, 1) ** 1.6
    T = apron
    for G in GUL:                                          # one cone per gully mouth
        a = G['a']; rpa = float(rplan(np.array(a)))
        cx, cy = math.cos(a) * rpa * 0.97, math.sin(a) * rpa * 0.97
        d = np.hypot(Xs - cx, Ys - cy)
        Lc = apex / math.tan(ANG) * 0.95 * (0.8 + 0.5 * G['depth'] / (0.085 * R))
        cone = apex * G['cone'] * np.clip(1 - d / Lc, 0, 1) ** 1.45
        T = np.maximum(T, cone)
    return T - 0.7 - 2.5 * np.clip(1 - T / 0.6, 0, 1)      # well below zero beyond the apron: no ground plate
SUBS = []
if MID == 'M02':                                           # secondary spires: shorter, thinner, fused at the foot, one side
    for k, (ang, dist, rf, hf) in enumerate([(0.3, 1.15, 0.75, 0.66), (-0.6, 1.25, 0.65, 0.48), (1.2, 1.35, 0.55, 0.34)]):
        SUBS.append(dict(c=(math.cos(ang) * R * dist, math.sin(ang) * R * dist), r=R * rf, h=H * hf * rs.uniform(0.92, 1.08), ph=rs.uniform(0, TAU)))
BLOCKS = []
nclus = max(3, SPEC['blocks'] // 6)
for k in range(SPEC['blocks']):
    ci = k % nclus
    a = (ci / nclus) * TAU + 0.5 + rs.uniform(-0.18, 0.18); rp = float(rplan(np.array(a)))
    f = rs.random() ** 0.8                                 # 0 = at the cliff foot, 1 = far out
    dist = rp + 1.0 + f * (rp * 0.32 if MID != 'M02' else 9.0)
    s = (3.2 - 2.4 * f) * rs.uniform(0.75, 1.15) * (0.7 if MID == 'M02' else 1.0)
    zc = (SPEC['ht'] * H) * (1 - f) ** 1.6 * 0.75          # sitting on the slope
    BLOCKS.append(dict(c=np.array([math.cos(a) * dist, math.sin(a) * dist, zc + s * 0.1]), s=np.array([s * rs.uniform(1.0, 1.4), s, s * 0.55]), rot=rs.uniform(0, TAU)))

def sdf_slice(z):
    """Signed distance (approx.) on one horizontal slice of the grid."""
    cx, cy = centre(z)
    Xc, Yc = X - cx, Y - cy
    th = np.arctan2(Yc, Xc); rho = np.hypot(Xc, Yc)
    if MID == 'M03':
        sc = m03_scale(z)
        rb = body_radius(th, np.full_like(th, z)) * sc
    else:
        rb = body_radius(th, np.full_like(th, z))
    d = rho - rb
    # top: the end of the resistant layer, slightly domed, rim rounded by a smooth max (no lid, no overhang)
    if MID == 'M02':                                       # broken, slanted flat top (no rounded tip)
        ztop = H - 0.18 * Xc - 0.1 * Yc
        d = smax(d, z - ztop, 0.6)
    else:
        ztop = H + 0.6 * np.cos(np.clip(rho / max(1.0, R * ASP), 0, 1) * math.pi / 2) - 0.6
        d = smax(d, z - ztop, 1.6)
    if SPEC['arch']:
        A = ARCH; u = Xc * A['dir'][0] + Yc * A['dir'][1]; v = -Xc * A['dir'][1] + Yc * A['dir'][0]
        uu = np.clip(u, A['base'], A['base'] + A['L'])
        tL = (uu - A['base']) / A['L']
        top = A['hgt'] * (1 - 0.22 * tL ** 1.5)            # the fin drops a little toward its tip
        wid = A['w'] * (1.15 - 0.3 * tL) * (1 - 0.3 * np.clip(z / top, 0, 1)) * (1 + 0.7 * np.clip(1 - z / (0.3 * A['hgt']), 0, 1) ** 2)
        du = np.maximum(A['base'] - u, u - (A['base'] + A['L']))
        dfin = np.maximum(np.maximum(du, np.abs(v) - wid), z - top)
        d = smin(d, dfin, 2.0)
        # archway: soft-layer undercut at the fin's foot, elliptic opening through the fin
        um = A['base'] + A['L'] * 0.6
        dh = np.sqrt(((u - um) / (A['L'] * 0.2)) ** 2 + ((z - A['hgt'] * 0.28) / (A['hgt'] * 0.3)) ** 2) - 1.0
        d = smax(d, -dh * A['L'] * 0.2, 1.0)
    for S_ in SUBS:
        sx, sy = S_['c']; rho2 = np.hypot(X - sx, Y - sy); th2 = np.arctan2(Y - sy, X - sx)
        t2 = np.clip(z / S_['h'], 0, 1)
        r2 = S_['r'] * (1 - 0.45 * t2 ** 0.9) * facet(th2, 4, S_['ph'])
        d2 = smax(rho2 - r2, z - (S_['h'] - 0.15 * (X - sx)), 0.5)
        d = smin(d, d2, 1.8)
    # talus / sand: a height field, merged softly so sand banks against the rock
    dt = (z - TGRID) * 0.8
    d = smin(d, dt, 1.4)
    for B in BLOCKS:                                       # fallen blocks, half buried, sand drifted around them
        c, s = B['c'], B['s']
        ca, sa = math.cos(B['rot']), math.sin(B['rot'])
        lx = (X - c[0]) * ca + (Y - c[1]) * sa; ly = -(X - c[0]) * sa + (Y - c[1]) * ca; lz = z - c[2]
        q = np.stack([np.abs(lx) - s[0], np.abs(ly) - s[1], np.full_like(lx, abs(lz) - s[2])], 0)
        db = np.linalg.norm(np.maximum(q, 0), axis=0) + np.minimum(q.max(0), 0) - 0.6
        d = smin(d, db, 0.8)
    # clay: soft lumps on everything
    P = np.stack([X.ravel(), Y.ravel(), np.full(X.size, z, np.float32)], 1)
    wrock = np.clip((z - TGRID) / 1.5, 0.12, 1.0)         # sand stays smooth (wind), rock gets clay lumps
    Pa = P * np.array([1.0, 1.0, 0.22], np.float32)       # vertical streaks: rain-washed sandstone, not cobbles
    d = d + (noise(P, (0.45, 0.08, 0.03)) + noise(Pa, (0.0, 0.25, 0.08))).reshape(X.shape) * wrock
    d = np.maximum(d, -z)                                  # flat base at z = 0
    return d.astype(np.float32)

TGRID = talus_height(X, Y).astype(np.float32)
log('talus field')
vol = np.empty((nx, ny, nz), np.float32)
for k, z in enumerate(zs):
    vol[:, :, k] = sdf_slice(np.float32(z))
vol[0, :, :] = vol[-1, :, :] = 5; vol[:, 0, :] = vol[:, -1, :] = 5; vol[:, :, 0] = vol[:, :, -1] = 5
log('sdf done')
verts, faces, normals, _ = marching_cubes(vol, level=0.0, spacing=(VOX, VOX, VOX))
verts = verts + lo
log('marching cubes', len(verts), 'verts', len(faces), 'faces')

# ---------------- Blender mesh: one shell, smooth, decimate ----------------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
coll = bpy.data.collections.new(MID); sc.collection.children.link(coll)
me = bpy.data.meshes.new(f'KFB_CC_{MID}')
me.vertices.add(len(verts)); me.vertices.foreach_set('co', verts.astype(np.float32).ravel())
me.loops.add(len(faces) * 3); me.loops.foreach_set('vertex_index', faces[:, ::-1].astype(np.int32).ravel())
me.polygons.add(len(faces)); me.polygons.foreach_set('loop_start', np.arange(0, len(faces) * 3, 3, dtype=np.int32))
me.update(calc_edges=True); me.validate()
obj = bpy.data.objects.new(f'KFB_CC_{MID}', me); coll.objects.link(obj)
def apply(mod):
    with bpy.context.temp_override(object=obj, active_object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)
bm = bmesh.new(); bm.from_mesh(me)
bm.verts.ensure_lookup_table()
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
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(me); bm.free()
sm = obj.modifiers.new('SM', 'SMOOTH'); sm.factor = 0.5; sm.iterations = 3; apply(sm)
n0 = len(me.polygons)
dec = obj.modifiers.new('DEC', 'DECIMATE'); dec.ratio = min(1.0, TRIS / n0); dec.use_collapse_triangulate = True; apply(dec)
log('mesh', len(me.polygons), 'tris  shells', len(comps), 'dropped', dropped)

# ---------------- colour: soft warped strata, sandy top and talus ----------------
def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return np.array([x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c], np.float32)
PAL = dict(deep=srgb('#93371f'), red=srgb('#b8482a'), mid=srgb('#cc6535'), salmon=srgb('#c9705a'), pale=srgb('#d98c55'),
           top=srgb('#dca56a'), sand=srgb('#e2b27a'), sand_lt=srgb('#ecc28e'))
co = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
nm = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('normal', nm); nm = nm.reshape(-1, 3)
z = co[:, 2]
# sand mask: the talus height field reaches the vertex (on or near the apron / cones)
Tv = talus_height(co[:, 0], co[:, 1])
sand = np.clip(1 - (z - Tv) / 0.8, 0, 1)
# strata: relative height warped by low-frequency noise, soft ramps between tones (no lines)
hw = z / H + 0.03 * np.sin(co @ np.array([0.11, 0.07, 0.0], np.float32) + 1.3) + 0.045 * noise(co, (1.0, 0.5, 0.0)) + 0.015 * co[:, 0] / R
stops = [(0.0, PAL['deep']), (0.24, PAL['deep']), (0.32, PAL['red']), (0.46, PAL['red']), (0.54, PAL['mid']), (0.62, PAL['mid']), (0.7, PAL['red']), (0.82, PAL['red']), (0.9, PAL['mid']), (1.05, PAL['mid'])]
col = np.zeros((len(z), 3), np.float32)
for (h0, c0), (h1, c1) in zip(stops, stops[1:]):
    m = (hw >= h0) & (hw < h1)
    t = ((hw[m] - h0) / (h1 - h0))[:, None]; t = t * t * (3 - 2 * t)
    col[m] = c0 * (1 - t) + c1 * t
col[hw >= stops[-1][0]] = stops[-1][1]; col[hw < 0] = PAL['deep']
up = nm[:, 2]
topm = np.clip((up - 0.7) / 0.2, 0, 1) * np.clip((z / H - 0.85) / 0.06, 0, 1)
if MID == 'M03':
    b0, bh, _ = SPEC['bench']
    topm = np.maximum(topm, np.clip((up - 0.65) / 0.2, 0, 1) * np.exp(-((z / H - (b0 + bh * 0.6)) / 0.08) ** 2))
col = col * (1 - topm[:, None]) + PAL['top'] * topm[:, None]
sandc = PAL['sand'] * (1 - np.clip(up, 0, 1)[:, None] * 0.0) * 0.5 + PAL['sand_lt'] * 0.5
col = col * (1 - sand[:, None]) + sandc * sand[:, None]
col *= (1 + 0.06 * noise(co, (0.0, 1.0, 0.6)))[:, None]
mask = np.stack([1 - sand, sand, topm], 1)
ca = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT'); cm = me.color_attributes.new('Mask', 'FLOAT_COLOR', 'POINT')
ca.data.foreach_set('color', np.concatenate([col, np.ones((len(z), 1), np.float32)], 1).ravel())
cm.data.foreach_set('color', np.concatenate([mask, np.ones((len(z), 1), np.float32)], 1).astype(np.float32).ravel())
me.color_attributes.active_color = ca
for p in me.polygons:
    p.use_smooth = True

def material():
    mt = bpy.data.materials.new('KFB_CC_CLAY_SANDSTONE'); mt.use_nodes = True
    nt = mt.node_tree; N = nt.nodes; L = nt.links.new
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 0.85
    col = N.new('ShaderNodeVertexColor'); col.layer_name = 'Col'
    msk = N.new('ShaderNodeVertexColor'); msk.layer_name = 'Mask'
    sep = N.new('ShaderNodeSeparateColor'); L(msk.outputs['Color'], sep.inputs[0])
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.5; nz.inputs['Detail'].default_value = 6
    L(tc.outputs['Object'], nz.inputs['Vector'])
    vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 1.4; L(tc.outputs['Object'], vo.inputs['Vector'])
    pit = N.new('ShaderNodeMapRange'); pit.inputs['From Min'].default_value = 0.03; pit.inputs['From Max'].default_value = 0.11
    L(vo.outputs['Distance'], pit.inputs['Value'])
    h = N.new('ShaderNodeMath'); h.operation = 'MULTIPLY'; L(nz.outputs['Fac'], h.inputs[0]); L(pit.outputs['Result'], h.inputs[1])
    hm = N.new('ShaderNodeMath'); hm.operation = 'MULTIPLY'; L(h.outputs[0], hm.inputs[0]); L(sep.outputs[0], hm.inputs[1])
    sn = N.new('ShaderNodeTexNoise'); sn.inputs['Scale'].default_value = 3.0; sn.inputs['Detail'].default_value = 4; L(tc.outputs['Object'], sn.inputs['Vector'])
    hs = N.new('ShaderNodeMath'); hs.operation = 'MULTIPLY'; L(sn.outputs['Fac'], hs.inputs[0]); L(sep.outputs[1], hs.inputs[1])
    hh = N.new('ShaderNodeMath'); hh.operation = 'ADD'; L(hm.outputs[0], hh.inputs[0]); L(hs.outputs[0], hh.inputs[1])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.3; bump.inputs['Distance'].default_value = 0.3
    L(hh.outputs[0], bump.inputs['Height']); L(bump.outputs['Normal'], b.inputs['Normal'])
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 3.0; ao.samples = 16
    aom = N.new('ShaderNodeMapRange'); aom.inputs['To Min'].default_value = 0.3; L(ao.outputs['AO'], aom.inputs['Value'])
    geo = N.new('ShaderNodeNewGeometry')
    pt = N.new('ShaderNodeMapRange'); pt.inputs['From Min'].default_value = 0.5; pt.inputs['From Max'].default_value = 0.56
    pt.inputs['To Min'].default_value = 0.0; pt.inputs['To Max'].default_value = 0.12
    L(geo.outputs['Pointiness'], pt.inputs['Value'])                   # soft highlight on convex edges (clay sheen)
    f = N.new('ShaderNodeMath'); f.operation = 'ADD'; L(aom.outputs['Result'], f.inputs[0]); L(pt.outputs['Result'], f.inputs[1])
    fc = N.new('ShaderNodeCombineColor'); [L(f.outputs[0], fc.inputs[i]) for i in range(3)]
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1.0
    L(col.outputs['Color'], mul.inputs['A']); L(fc.outputs[0], mul.inputs['B']); L(mul.outputs['Result'], b.inputs['Base Color'])
    return mt
me.materials.append(material())

# ---------------- sockets (Empties), scale props ----------------
sockets = []
def socket(name, p):
    sockets.append((name, Vector(p)))
topz = float(z.max())
topv = co[(z > topz - 1.5)]
socket('SOCKET_plateau_top', (float(topv[:, 0].mean()), float(topv[:, 1].mean()), topz))
if SPEC['arch']:
    um = ARCH['base'] + ARCH['L'] * 0.6
    socket('SOCKET_arch_portal', (ARCH['dir'][0] * um, ARCH['dir'][1] * um, 0.0))
if MID == 'M03':
    b0, bh, _ = SPEC['bench']
    zb = (b0 + bh * 0.5) * H
    cand = co[(np.abs(z - zb) < 1.2) & (nm[:, 2] > 0.6) & (co[:, 1] < 0)]
    if len(cand):
        p = cand[np.argmin(cand[:, 1])]; socket('SOCKET_bench_front', (float(p[0]), float(p[1]) * 0.9, float(p[2])))
if MID == 'M02':
    for i, (G) in enumerate([0, 1, 2]):
        pass
for k, a in enumerate([-math.pi / 2 - 0.8, -math.pi / 2 + 0.8]):
    rp = float(rplan(np.array(a))) * 1.3 + (5 if MID == 'M02' else 0)
    p = np.array([math.cos(a) * rp, math.sin(a) * rp], np.float32)
    socket(f'SOCKET_talus_{k + 1}', (float(p[0]), float(p[1]), float(talus_height(p[:1], p[1:])[0])))
emps = []
for name, p in sockets:
    e = bpy.data.objects.new(name, None); e.empty_display_type = 'ARROWS'; e.empty_display_size = 2.0; e.location = p
    coll.objects.link(e); e.parent = obj; emps.append(e)
def prop(name, size, loc, hx):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object; o.name = name; o.scale = size
    mt = bpy.data.materials.new(name); mt.use_nodes = True; mt.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*srgb(hx), 1)
    o.data.materials.append(mt)
    for c_ in list(o.users_collection):
        c_.objects.unlink(o)
    coll.objects.link(o); return o
ymin = float(co[:, 1].min()); xmin = float(co[:, 0].min())
prop('SCALE_FIGURE_1H', (0.9, 0.9, H_), (xmin + 3, ymin - 4, H_ / 2), '#e0245e')
prop('SCALE_CAR', (6.0, 2.9, 2.2), (xmin + 11, ymin - 5, 1.1), '#1f5fd6')

# ---------------- checks, export ----------------
bm = bmesh.new(); bm.from_mesh(me)
nonman = sum(1 for e in bm.edges if not e.is_manifold); openb = sum(1 for e in bm.edges if e.is_boundary); bm.free()
met = dict(module=MID, footprint_MC=[round(float(co[:, 0].max() - co[:, 0].min()) / MC, 1), round(float(co[:, 1].max() - co[:, 1].min()) / MC, 1)],
           height_MC=round(topz / MC, 1), height_H=round(topz / H_, 1), tris=len(me.polygons), objects=1, shells=1, dropped_crumb_verts=dropped,
           open_edges=openb, non_manifold_edges=nonman, gullies=len(GUL), sockets=[s[0] for s in sockets], voxel=VOX, seed=SPEC['seed'])
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
