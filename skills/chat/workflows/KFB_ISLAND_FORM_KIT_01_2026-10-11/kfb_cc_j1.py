"""KFB Coconino R4 · step 2 · island J1 "Sunset Mesa Serpentine" (brief V-167, CC2).

One continuous island clod (single mesh): the round-3 mesa modules M03 (bench mesa) and M02 (needle butte) stand on it,
embedded in the ground (Georg 12.10.: larger structures stand IN the terrain, sand and earth bank up against them, never set on
top). The underside is a layered, cohesive rock mass (ME2, V-152/V-164): an inverted cliff-and-bench clod with gullies and blunt
hanging lobes, no separate rock balls. The track is only a placeholder band (flattened, embedded road surface, no piers) plus an
anchor line for the J17 track (Track Core builds the real road in the Lab).
The mesa SDFs are taken unchanged from `kfb_cc_mesa_v2.py` (round 3, PASS with tune later), evaluated in island coordinates.
Run:  python kfb_cc_j1.py -- OUTDIR
"""
import bpy, bmesh, sys, os, math, json, random, time
import numpy as np
from skimage.measure import marching_cubes
from mathutils import Vector

OUT = sys.argv[sys.argv.index('--') + 1]
os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
MC, H_ = 6.4, 3.64
VOX = float(os.environ.get('J1_VOX', '0.45'))
TRIS = int(os.environ.get('J1_TRIS', '260000'))
t0 = time.time()
def log(*a):
    print(f'[{time.time() - t0:6.1f}s]', *a, flush=True)
TAU = math.tau

# ---------------- mesa modules: the round-3 generator, executed up to its grid stage ----------------
SRC = open(os.path.join(HERE, 'kfb_cc_mesa_v2.py')).read()
HEAD = SRC[:SRC.index('vol = np.empty')]
def load_mesa(mid):
    os.environ['CC_VOX'] = '4.0'                           # tiny throw-away grid inside the module script
    argv_keep = sys.argv; sys.argv = ['kfb_cc_mesa_v2.py', '--', '/tmp/_cc_dummy', mid]
    ns = {'__name__': 'mesa_' + mid, '__file__': os.path.join(HERE, 'kfb_cc_mesa_v2.py')}
    exec(compile(HEAD, 'kfb_cc_mesa_v2.py', 'exec'), ns)
    sys.argv = argv_keep
    return ns
MESAS = []
for mid, (ox, oy, rot) in (('M03', (-26.0, 16.0, 0.25)), ('M02', (40.0, 18.0, -0.4))):
    ns = load_mesa(mid)
    MESAS.append(dict(mid=mid, ns=ns, ox=ox, oy=oy, rot=rot, H=ns['H']))
    log('mesa', mid, 'H', ns['H'])

rs = random.Random(717); rng = np.random.default_rng(717)
def make_noise(n, scale):
    d = rng.normal(size=(n, 3)); d /= np.linalg.norm(d, axis=1, keepdims=True)
    return d / scale * TAU, rng.uniform(0, TAU, n)
NZ = [make_noise(10, s) for s in (30.0, 12.0, 4.0)]
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

# ---------------- island outline (20 MC = 128 wide), lobes and bays ----------------
RX, RY = 64.0, 49.0
LOB = [(2, 0.04, rs.uniform(0, TAU)), (3, 0.05, rs.uniform(0, TAU)), (5, 0.03, rs.uniform(0, TAU)), (7, 0.015, rs.uniform(0, TAU))]
BAYS = [(rs.uniform(0, TAU), rs.uniform(0.05, 0.1), rs.uniform(0.12, 0.25)) for _ in range(3)]
def risl(th):
    c, s = np.cos(th), np.sin(th); n = 2.8
    se = (np.abs(c / RX) ** n + np.abs(s / RY) ** n) ** (-1.0 / n)
    lob = 1 + sum(a * np.sin(k * th + p) for k, a, p in LOB)
    bay = 1 - sum(d * np.exp(-(angd(th, a) / w) ** 2) for a, d, w in BAYS)
    return se * lob * bay
DEPTH = 0.42 * 2 * RX                                      # ~54
# inverted cliff-and-bench profile (u = depth fraction): cliffs nearly vertical, benches step in, blunt bottom
PROF = [(0.0, 1.0), (0.08, 0.98), (0.12, 0.9), (0.24, 0.87), (0.29, 0.79), (0.42, 0.76), (0.47, 0.66), (0.6, 0.62), (0.65, 0.52), (0.76, 0.48), (0.82, 0.37), (0.92, 0.28), (1.0, 0.0)]
def prof_down(u):
    u = np.clip(u, 0, 1)
    out = np.zeros_like(u)
    for (u0, r0), (u1, r1) in zip(PROF, PROF[1:]):
        m = (u >= u0) & (u <= u1)
        t = (u[m] - u0) / (u1 - u0); t = t * t * (3 - 2 * t)
        out[m] = r0 + (r1 - r0) * t
    return out
GUL = []
a = 0.1
while a < TAU - 0.05:
    GUL.append(dict(a=a, d=rs.uniform(0.8, 2.4), w=rs.uniform(2.0, 4.5), top=rs.uniform(0.0, 0.25)))
    a += rs.uniform(7.0, 16.0) / 55.0
LOBES = [dict(c=(math.cos(a_) * rs.uniform(6, 12), math.sin(a_) * rs.uniform(4, 9)), r=rs.uniform(7, 10), z=-DEPTH * rs.uniform(0.8, 0.88)) for a_ in [k * TAU / 2 + rs.uniform(-0.5, 0.5) for k in range(2)]]
STRATA_PH = [rs.uniform(0, TAU) for _ in range(3)]
def u_warp(th):
    """strata dip and wave around the island, so the benches are not concentric rings"""
    return 0.05 * np.sin(2 * th + STRATA_PH[0]) + 0.035 * np.sin(5 * th + STRATA_PH[1]) + 0.02 * np.sin(9 * th + STRATA_PH[2])

# ---------------- track placeholder: serpentine centre line, gentle grade, embedded ----------------
CTRL = np.array([(-67, -14, 0.8), (-50, -30, 0.8), (-30, -33, 0.9), (-13, -26, 1.2), (-12, -10, 2.2), (2, -3, 3.4), (16, -10, 5.0), (18, -26, 6.6), (34, -32, 7.2), (48, -22, 7.4), (50, -6, 7.4), (66, 0, 7.4)], np.float32)
def catmull(P, n=40):
    pts = []
    Pp = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]])
    for i in range(1, len(Pp) - 2):
        p0, p1, p2, p3 = Pp[i - 1], Pp[i], Pp[i + 1], Pp[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            pts.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    pts.append(P[-1])
    return np.array(pts, np.float32)
ROAD = catmull(CTRL)
HW = 5.0                                                   # half width of the placeholder band (two lanes + shoulders)
def road_field(Xs, Ys):
    """distance to the centre line and the road height at the nearest point (2D)."""
    P = np.stack([Xs.ravel(), Ys.ravel()], 1)
    best = np.full(len(P), 1e9, np.float32); zr = np.zeros(len(P), np.float32)
    A = ROAD[:-1]; B = ROAD[1:]
    for i in range(len(A)):
        ab = B[i, :2] - A[i, :2]; L2 = float(ab @ ab) + 1e-9
        t = np.clip(((P - A[i, :2]) @ ab) / L2, 0, 1)
        q = A[i, :2] + t[:, None] * ab
        d = np.hypot(*(P - q).T)
        m = d < best
        best[m] = d[m]; zr[m] = (A[i, 2] + (B[i, 2] - A[i, 2]) * t)[m]
    return best.reshape(Xs.shape), zr.reshape(Xs.shape)

# ---------------- grid ----------------
lo = np.array([-RX * 1.12 - 4, -RY * 1.15 - 4, -DEPTH - 4]); hi = np.array([RX * 1.12 + 4, RY * 1.15 + 4, max(m['H'] for m in MESAS) + 4])
nx, ny, nz = [int(math.ceil((hi[i] - lo[i]) / VOX)) + 1 for i in range(3)]
log('grid', nx, ny, nz, round(nx * ny * nz / 1e6, 1), 'M voxels')
xs = lo[0] + np.arange(nx) * VOX; ys = lo[1] + np.arange(ny) * VOX; zs = lo[2] + np.arange(nz) * VOX
X, Y = np.meshgrid(xs, ys, indexing='ij'); X = X.astype(np.float32); Y = Y.astype(np.float32)
TH = np.arctan2(Y, X); RHO = np.hypot(X, Y)
RI = risl(TH).astype(np.float32)                           # island radius at the rim, per column
DR, ZR = road_field(X, Y)
# ground: gentle undulation + road shaping (cut/fill banks) + the mesas' own sand aprons (embedding)
Pg = np.stack([X.ravel(), Y.ravel(), np.zeros(X.size, np.float32)], 1)
G = 1.4 * noise(Pg, (1.0, 0.5, 0.0)).reshape(X.shape) + 0.8
# middle terrace (front right): a grown rock bench, cliff edge cut by gullies, top at ~+7
TC = (30.0, -14.0); TRX, TRY = 40.0, 24.0
tth = np.arctan2(Y - TC[1], X - TC[0])
trad = 1 + 0.08 * np.sin(3 * tth + 0.7) + 0.05 * np.sin(5 * tth + 2.1) + 0.03 * np.sin(11 * tth)
tdist = np.hypot((X - TC[0]) / TRX, (Y - TC[1]) / TRY) / trad
tedge = np.clip((1 - tdist) / 0.07, 0, 1); tedge = tedge * tedge * (3 - 2 * tedge)
TERR = 7.0 * tedge + 0.6 * noise(Pg, (0.0, 1.0, 0.3)).reshape(X.shape) * tedge
G = np.maximum(G, TERR)
# rim: rock ledges push through the top on part of the edge (no uniform sand lip)
rimmask = np.clip((noise(np.stack([np.cos(TH.ravel()) * 40, np.sin(TH.ravel()) * 40, np.zeros(TH.size, np.float32)], 1), (1.0, 0.6, 0.0)).reshape(X.shape) + 0.1) / 0.3, 0, 1)
RIMR = 2.4 * rimmask * np.clip((RHO / RI - 0.88) / 0.08, 0, 1) ** 1.5
G = G + RIMR
for M in MESAS:                                            # local coords for each mesa (rotation + offset)
    c, s = math.cos(M['rot']), math.sin(M['rot'])
    M['Xl'] = ((X - M['ox']) * c + (Y - M['oy']) * s).astype(np.float32)
    M['Yl'] = (-(X - M['ox']) * s + (Y - M['oy']) * c).astype(np.float32)
    ns = M['ns']
    M['T'] = ns['talus_height'](M['Xl'], M['Yl']).astype(np.float32)
    G = np.maximum(G, np.where(DR < HW + 1.5, -5, M['T']))   # sand aprons merge into the island ground (embedding)
wroad = np.clip(1 - (DR - HW) / 5.0, 0, 1); wroad = wroad * wroad * (3 - 2 * wroad)
G = G * (1 - wroad) + (ZR + 0.6) * wroad                   # road band: cut through the terrace edge, fill on the plain
log('ground field')

def island_slice(z):
    u = np.clip(-z / DEPTH, 0, 1)
    rr = RI * (prof_down(np.clip(u + u_warp(TH), 0, 1) if z < -2.0 else np.full_like(RI, u)) if z < 0 else 1.0)
    # gullies down the island walls
    g = np.zeros_like(rr)
    if z < 0:
        for Gl in GUL:
            ds = angd(TH, Gl['a']) * RI
            fade = np.clip((u - Gl['top']) / 0.1, 0, 1) * np.clip(1 - u / 0.95, 0, 1)
            g = np.maximum(g, Gl['d'] * fade * np.exp(-(ds / Gl['w']) ** 2))
    d = RHO - (rr - g)
    d = smax(d, z - G, 1.2)                                # top: the ground (road band flattened in)
    for L in LOBES:                                        # blunt hanging lobes under the clod
        dl = np.sqrt(((X - L['c'][0]) / L['r']) ** 2 + ((Y - L['c'][1]) / L['r']) ** 2 + ((z - L['z']) / (L['r'] * 1.7)) ** 2) - 1
        d = smin(d, dl * L['r'] * 0.8, 5.0)
    # mesas, standing in the ground and clipped to the island outline
    for M in MESAS:
        if z < -1.0 or z > M['H'] + 3:
            continue
        ns = M['ns']; ns['X'] = M['Xl']; ns['Y'] = M['Yl']; ns['TGRID'] = M['T']
        dm = ns['sdf_slice'](np.float32(z))
        dm = np.maximum(dm, RHO - RI * 0.985)
        dm = np.where(DR < HW + 0.5, np.maximum(dm, 0.5), dm)   # keep the road band clear
        d = smin(d, dm, 1.2)
    P = np.stack([X.ravel(), Y.ravel(), np.full(X.size, z, np.float32)], 1)
    wrock = np.clip((G - z) / 2.0, 0.2, 1.0) if z < 0 else np.float32(0.15)
    Ph = P * np.array([0.35, 0.35, 2.2], np.float32)       # horizontal ledges in the sandstone, not vertical streaks
    d = d + (noise(P, (0.6, 0.3, 0.04)) + noise(Ph, (0.0, 0.45, 0.0))).reshape(X.shape) * wrock * (1 - 0.85 * wroad)
    return d.astype(np.float32)

vol = np.empty((nx, ny, nz), np.float32)
for k, z in enumerate(zs):
    vol[:, :, k] = island_slice(np.float32(z))
    if k % 40 == 0:
        log('slice', k, '/', nz)
vol[0], vol[-1] = 5, 5; vol[:, 0], vol[:, -1] = 5, 5; vol[:, :, 0], vol[:, :, -1] = 5, 5
verts, faces, _, _ = marching_cubes(vol, level=0.0, spacing=(VOX, VOX, VOX))
verts = verts + lo
del vol
log('marching cubes', len(verts), len(faces))

# ---------------- mesh ----------------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
coll = bpy.data.collections.new('J1'); sc.collection.children.link(coll)
me = bpy.data.meshes.new('KFB_CC_J1')
me.vertices.add(len(verts)); me.vertices.foreach_set('co', verts.astype(np.float32).ravel())
me.loops.add(len(faces) * 3); me.loops.foreach_set('vertex_index', faces[:, ::-1].astype(np.int32).ravel())
me.polygons.add(len(faces)); me.polygons.foreach_set('loop_start', np.arange(0, len(faces) * 3, 3, dtype=np.int32))
me.update(calc_edges=True); me.validate()
obj = bpy.data.objects.new('KFB_CC_J1', me); coll.objects.link(obj)
def apply(mod):
    with bpy.context.temp_override(object=obj, active_object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)
bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
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
dec = obj.modifiers.new('DEC', 'DECIMATE'); dec.ratio = min(1.0, TRIS / len(me.polygons)); dec.use_collapse_triangulate = True; apply(dec)
log('mesh', len(me.polygons), 'shells', len(comps), 'dropped', dropped)

# ---------------- colour ----------------
def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return np.array([x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c], np.float32)
PAL = dict(deep=srgb('#93371f'), red=srgb('#b8482a'), mid=srgb('#cc6535'), pale=srgb('#d98c55'), dark=srgb('#7d3220'), plum=srgb('#7a4a52'),
           ground=srgb('#d9944f'), sand=srgb('#e0a35e'), top=srgb('#d58a4e'), road=srgb('#5c595d'), shoulder=srgb('#b98e6a'))
co = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
nm = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('normal', nm); nm = nm.reshape(-1, 3)
z = co[:, 2]; up = nm[:, 2]
# strata on the island walls and underside: soft warped tones by depth
hw = -z / DEPTH + u_warp(np.arctan2(co[:, 1], co[:, 0])) + 0.03 * noise(co, (1.0, 0.5, 0.0))
stops = [(-0.2, PAL['pale']), (0.04, PAL['mid']), (0.16, PAL['red']), (0.3, PAL['mid']), (0.44, PAL['red']), (0.6, PAL['deep']), (0.76, PAL['red']), (0.9, PAL['plum']), (1.1, PAL['plum'])]
col = np.tile(PAL['mid'], (len(z), 1)).astype(np.float32)
for (h0, c0), (h1, c1) in zip(stops, stops[1:]):
    m = (hw >= h0) & (hw < h1)
    t = ((hw[m] - h0) / (h1 - h0))[:, None]; t = t * t * (3 - 2 * t)
    col[m] = c0 * (1 - t) + c1 * t
col[hw >= stops[-1][0]] = stops[-1][1]
# mesas: their own strata (height above ground), by proximity to each mesa
for M in MESAS:
    c, s = math.cos(M['rot']), math.sin(M['rot'])
    xl = (co[:, 0] - M['ox']) * c + (co[:, 1] - M['oy']) * s; yl = -(co[:, 0] - M['ox']) * s + (co[:, 1] - M['oy']) * c
    ns = M['ns']
    inb = (np.hypot(xl, yl) < ns['R'] * ns['ASP'] * 1.6) & (z > 0.5)
    hm = z / M['H'] + 0.03 * np.sin(xl * 0.11 + 1.3) + 0.045 * noise(co, (1.0, 0.5, 0.0))
    mst = [(0.0, PAL['deep']), (0.24, PAL['deep']), (0.32, PAL['red']), (0.46, PAL['red']), (0.54, PAL['mid']), (0.62, PAL['mid']), (0.7, PAL['red']), (0.82, PAL['red']), (0.9, PAL['mid']), (1.05, PAL['mid'])]
    for (h0, c0), (h1, c1) in zip(mst, mst[1:]):
        m = inb & (hm >= h0) & (hm < h1)
        t = ((hm[m] - h0) / (h1 - h0))[:, None]; t = t * t * (3 - 2 * t)
        col[m] = c0 * (1 - t) + c1 * t
    col[inb & (hm >= 1.05)] = PAL['mid']
# ground and sand: up-facing surfaces near the ground field; road band
Gv_x = np.clip(((co[:, 0] - lo[0]) / VOX).astype(int), 0, nx - 1); Gv_y = np.clip(((co[:, 1] - lo[1]) / VOX).astype(int), 0, ny - 1)
Gv = G[Gv_x, Gv_y]; Tv = TERR[Gv_x, Gv_y]; Rv = RIMR[Gv_x, Gv_y]
Dv, _ = road_field(co[:, 0], co[:, 1])                     # exact distance per vertex: clean road edges
ground = np.clip(1 - np.abs(z - Gv) / 1.2, 0, 1) * np.clip((up - 0.45) / 0.3, 0, 1)
ground *= np.clip(1 - Rv / 0.8, 0, 1)                      # rim rock stays rock
terr_top = np.clip((Tv - 5.0) / 1.5, 0, 1)                 # terrace top: rock-ochre, sand only in hollows
gcol = (PAL['ground'] * 0.6 + PAL['sand'] * 0.4)[None, :] * (1 - terr_top[:, None]) + PAL['top'][None, :] * terr_top[:, None]
col = col * (1 - ground[:, None]) + gcol * ground[:, None]
road = ground * np.clip(1 - (Dv - HW + 0.6) / 0.6, 0, 1)
shoulder = ground * np.clip(1 - np.abs(Dv - HW - 0.8) / 1.0, 0, 1) * (1 - road)
col = col * (1 - road[:, None]) + PAL['road'] * road[:, None]
col = col * (1 - shoulder[:, None] * 0.5) + PAL['shoulder'] * (shoulder[:, None] * 0.5)
col *= (1 + 0.06 * noise(co, (0.0, 1.0, 0.6)))[:, None]
mask = np.stack([1 - ground, ground, road], 1)
ca = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT'); cm = me.color_attributes.new('Mask', 'FLOAT_COLOR', 'POINT')
ca.data.foreach_set('color', np.concatenate([col, np.ones((len(z), 1), np.float32)], 1).ravel())
cm.data.foreach_set('color', np.concatenate([mask, np.ones((len(z), 1), np.float32)], 1).astype(np.float32).ravel())
me.color_attributes.active_color = ca
for p in me.polygons:
    p.use_smooth = True
# material: the round-3 clay sandstone shader (same nodes), built here
def material():
    mt = bpy.data.materials.new('KFB_CC_CLAY_SANDSTONE'); mt.use_nodes = True
    nt = mt.node_tree; N = nt.nodes; L = nt.links.new
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 0.85
    col_ = N.new('ShaderNodeVertexColor'); col_.layer_name = 'Col'
    msk = N.new('ShaderNodeVertexColor'); msk.layer_name = 'Mask'
    sep = N.new('ShaderNodeSeparateColor'); L(msk.outputs['Color'], sep.inputs[0])
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.5; nz.inputs['Detail'].default_value = 6; L(tc.outputs['Object'], nz.inputs['Vector'])
    vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 1.4; L(tc.outputs['Object'], vo.inputs['Vector'])
    pit = N.new('ShaderNodeMapRange'); pit.inputs['From Min'].default_value = 0.03; pit.inputs['From Max'].default_value = 0.11; L(vo.outputs['Distance'], pit.inputs['Value'])
    h = N.new('ShaderNodeMath'); h.operation = 'MULTIPLY'; L(nz.outputs['Fac'], h.inputs[0]); L(pit.outputs['Result'], h.inputs[1])
    hm_ = N.new('ShaderNodeMath'); hm_.operation = 'MULTIPLY'; L(h.outputs[0], hm_.inputs[0]); L(sep.outputs[0], hm_.inputs[1])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.3; bump.inputs['Distance'].default_value = 0.3
    L(hm_.outputs[0], bump.inputs['Height']); L(bump.outputs['Normal'], b.inputs['Normal'])
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 4.0; ao.samples = 16
    aom = N.new('ShaderNodeMapRange'); aom.inputs['To Min'].default_value = 0.3; L(ao.outputs['AO'], aom.inputs['Value'])
    geo = N.new('ShaderNodeNewGeometry')
    pt = N.new('ShaderNodeMapRange'); pt.inputs['From Min'].default_value = 0.5; pt.inputs['From Max'].default_value = 0.56; pt.inputs['To Max'].default_value = 0.12
    L(geo.outputs['Pointiness'], pt.inputs['Value'])
    f = N.new('ShaderNodeMath'); f.operation = 'ADD'; L(aom.outputs['Result'], f.inputs[0]); L(pt.outputs['Result'], f.inputs[1])
    fc = N.new('ShaderNodeCombineColor'); [L(f.outputs[0], fc.inputs[i]) for i in range(3)]
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1.0
    L(col_.outputs['Color'], mul.inputs['A']); L(fc.outputs[0], mul.inputs['B']); L(mul.outputs['Result'], b.inputs['Base Color'])
    return mt
me.materials.clear(); me.materials.append(material())

# ---------------- sockets and track anchors ----------------
emps = []
def empty(name, p, kind='ARROWS'):
    e = bpy.data.objects.new(name, None); e.empty_display_type = kind; e.empty_display_size = 2.5; e.location = p
    coll.objects.link(e); e.parent = obj; emps.append(e); return e
step = max(1, len(ROAD) // 24)
anchors = []
for i, p in enumerate(ROAD[::step]):
    gx = int(np.clip((p[0] - lo[0]) / VOX, 0, nx - 1)); gy = int(np.clip((p[1] - lo[1]) / VOX, 0, ny - 1))
    zz = float(G[gx, gy]); anchors.append([float(p[0]), float(p[1]), zz])
    empty(f'TRACK_ANCHOR_{i:02d}', (float(p[0]), float(p[1]), zz), 'PLAIN_AXES')
empty('SOCKET_track_entry', anchors[0]); empty('SOCKET_track_exit', anchors[-1])
for M in MESAS:
    ns = M['ns']
    empty(f'SOCKET_{M["mid"]}_plateau_top', (M['ox'], M['oy'], M['H']))
empty('SOCKET_viewpoint_front', (-8.0, -38.0, float(G[int((-8 - lo[0]) / VOX), int((-38 - lo[1]) / VOX)])))
json.dump(dict(anchors=anchors, half_width=HW, note='placeholder centre line for the J17 track (Track Core builds the real road)'),
          open(f'{OUT}/CC_J1_track_anchor.json', 'w'), indent=1)
# scale props on the road
def prop(name, size, loc, hx):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object; o.name = name; o.scale = size
    mt = bpy.data.materials.new(name); mt.use_nodes = True; mt.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*srgb(hx), 1)
    o.data.materials.append(mt)
    for c_ in list(o.users_collection):
        c_.objects.unlink(o)
    coll.objects.link(o); return o
pa = anchors[6]; pb = anchors[7]
ang = math.atan2(pb[1] - pa[1], pb[0] - pa[0])
car = prop('SCALE_CAR', (6.0, 2.9, 2.2), (pa[0], pa[1], pa[2] + 1.1), '#1f5fd6'); car.rotation_euler = (0, 0, ang)
prop('SCALE_FIGURE_1H', (0.9, 0.9, H_), (pa[0] + 3, pa[1] + 7, pa[2] + H_ / 2), '#e0245e')

# ---------------- checks, export ----------------
bm = bmesh.new(); bm.from_mesh(me)
nonman = sum(1 for e in bm.edges if not e.is_manifold); openb = sum(1 for e in bm.edges if e.is_boundary); bm.free()
met = dict(island='J1', width_MC=round(float(co[:, 0].max() - co[:, 0].min()) / MC, 1), depth_MC=round(float(co[:, 1].max() - co[:, 1].min()) / MC, 1),
           underside_depth_W=round(float(-z.min()) / float(co[:, 0].max() - co[:, 0].min()), 2), top_MC=round(float(z.max()) / MC, 1),
           tris=len(me.polygons), objects=1, shells=1, dropped_crumb_verts=dropped, open_edges=openb, non_manifold_edges=nonman,
           mesas=[m['mid'] for m in MESAS], track_anchors=len(anchors), road_half_width=HW, voxel=VOX)
log('METRICS', json.dumps(met))
json.dump(met, open(f'{OUT}/CC_J1_metrics.json', 'w'), indent=1)
for o in bpy.context.view_layer.objects:
    o.select_set(False)
obj.select_set(True)
for e in emps:
    e.select_set(True)
bpy.context.view_layer.objects.active = obj
bpy.ops.export_scene.gltf(filepath=f'{OUT}/KFB_CC_J1.glb', use_selection=True, export_format='GLB', export_vertex_color='ACTIVE')
bpy.ops.wm.save_as_mainfile(filepath=f'{OUT}/KFB_CC_J1.blend', compress=True)
log('saved')
