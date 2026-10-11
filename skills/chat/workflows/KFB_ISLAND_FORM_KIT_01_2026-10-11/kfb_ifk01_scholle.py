"""KFB Island Form Kit 01 · island body generator (Blender 5.2).

Template first (V-001): a 1:1 port of Scholle v7, `buildScholle()` and `soften()` in
`KFB World Core R2D v0 Insel + KFB Scholle Bench v7/kfb-r2d-session-2026-10-03/KFB_R2D_v0/scholle-bench.js` (03.10.2026).
The construction is ONE mesh per island:
- flat top with colour bands;
- vertical rim in the surface colour;
- faceted inverted cone (rings 32 -> 16 -> 13 -> 10 -> 8 -> 6 -> 4 corners, zipped);
- main apex.
Spikes are corners pulled down; nothing is attached. Clay = midpoint subdivision + Taubin smoothing, with the top pinned.
Georg's v7 decisions (03.10.): soft over the facets, no stone band, no separate base plate.

The same RNG (mulberry32) and the same call order are kept. The one exception is the spike pick: JS uses `sort(() => R() - 0.5)`,
whose order depends on the engine, so a seeded Fisher-Yates pick stands in for it.

Added for the form kit (K1, K2), all on the same single mesh:
- `outline`: a plan-shape function r(theta) for the K2 silhouettes (long, bean, twin, shard); None keeps the v7 lobed outline;
- `terrace`: a raised inner plateau on the top (K2 'stepped plateau');
- family 'blast': strata bands with terraced flanks, flat fracture faces, pipe/cellar/tunnel openings cut into the body;
- family 'roots': strata bands plus a few thick, short, tapering roots grown out of the body (extruded, not attached).

Coordinates: the port computes in three.js space (Y up) and converts to Blender with (x, y, z) -> (x, -z, y), a proper rotation.
Units: K2 lab units (H = 3.64, MC = 6.4). `Dm` is the island diameter in lab units (equal-area diameter for non-round outlines).
"""
import bpy, bmesh, math
from mathutils import Vector

MC, H = 6.4, 3.64
TAU = 2 * math.pi


# ---------- template data (scholle-bench.js PRESETS, unchanged) ----------
PRESETS = {
    'C': dict(id='C', label='Garten', elev=0.32, depth=0.48, prof=[1, 0.94, 0.88, 0.81, 0.76, 0.69, 0.64, 0.56, 0.49, 0.33, 0.01],
              rim=0.028, inset=0.05, c=0.5, saw=0.05, zack=5, zackD=0.32, off=0.03, lobes=[[3, 0.05], [8, 0.035]],
              bands=[[1, '#6ccb35']], body='#7c4a26', seed=37),
    'D': dict(id='D', label='Food Point', elev=0.25, depth=0.45, prof=[1, 0.89, 0.81, 0.75, 0.67, 0.59, 0.55, 0.45, 0.37, 0.25, 0.05],
              rim=0.025, inset=0.02, c=0.85, saw=0.05, zack=3, zackD=0.32, off=0.05, lobes=[[4, 0.05], [7, 0.05]],
              bands=[[1, '#5fbf2b']], body='#8f5524', seed=23),
    'E': dict(id='E', label='Strand', elev=0.36, depth=0.47, prof=[1, 0.9, 0.81, 0.74, 0.65, 0.59, 0.53, 0.47, 0.36, 0.23, 0.01],
              rim=0.05, inset=0.05, c=0.95, saw=0.05, zack=2, zackD=0.22, off=0.05, lobes=[[2, 0.04], [6, 0.02]],
              bands=[[0.35, '#8fd247'], [0.5, '#c79a6c'], [1, '#86dcc8']], body='#b78849', seed=67),
}


def srgb_to_lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hexlin(h):
    h = h.lstrip('#')
    return [srgb_to_lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)]


def mix(a, b, t):
    return [a[i] + (b[i] - a[i]) * t for i in range(3)]


def rng(seed):
    """mulberry32, as in scholle-bench.js."""
    s = [seed & 0xffffffff]

    def imul(a, b):
        return (a * b) & 0xffffffff

    def f():
        s[0] = (s[0] + 0x6D2B79F5) & 0xffffffff
        a = s[0]
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & 0xffffffff) ^ t
        return ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
    return f


# ---------- plan outlines for K2 (r(theta) relative to R0, roughly equal area) ----------
def _angdiff(a, b):
    return (a - b + math.pi) % TAU - math.pi


def ellipse(a, b):
    return lambda th: 1.0 / math.sqrt((math.cos(th) / a) ** 2 + (math.sin(th) / b) ** 2)


def outline_long():
    return ellipse(1.38, 0.72)


def outline_bean():
    e = ellipse(1.22, 0.86)
    return lambda th: e(th) * (1 - 0.32 * math.exp(-(_angdiff(th, math.pi / 2) / 0.55) ** 2))


def outline_twin():
    e = ellipse(1.5, 0.74)
    return lambda th: e(th) * (1 - 0.36 * math.exp(-(_angdiff(th, math.pi / 2) / 0.36) ** 2)
                               - 0.36 * math.exp(-(_angdiff(th, -math.pi / 2) / 0.36) ** 2))


def outline_shard(seed=5, n=7):
    R = rng(seed)
    ang = sorted(((i + (R() - 0.5) * 0.5) / n * TAU) for i in range(n))
    rad = [0.85 + 0.32 * R() for _ in range(n)]
    pts = [(math.cos(a) * r, math.sin(a) * r) for a, r in zip(ang, rad)]

    def f(th):
        dx, dy = math.cos(th), math.sin(th)
        best = 1.0
        for i in range(n):
            (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
            ex, ey = x2 - x1, y2 - y1
            den = dx * ey - dy * ex
            if abs(den) < 1e-9:
                continue
            t = (x1 * ey - y1 * ex) / den
            u = (x1 * dy - y1 * dx) / den
            if t > 0 and -1e-6 <= u <= 1 + 1e-6:
                best = t
        return best
    return f


OUTLINES = {'round': None, 'long': outline_long, 'bean': outline_bean, 'twin': outline_twin, 'shard': outline_shard}


# ---------- the port ----------
def build_scholle(pr, Dm, outline=None, terrace=None, soft=2):
    """Returns dict(pos, col, tris, pin, meta) in three.js space. Same steps as buildScholle()."""
    R = rng(pr['seed'] * 7919 + 3)
    R0 = Dm / 2
    ph = [R() * TAU for _ in pr['lobes']]

    def rlob(th):
        return 1 + sum(a * math.sin(th * f + ph[k]) for k, (f, a) in enumerate(pr['lobes']))
    if outline is None:
        rOut = lambda th: R0 * rlob(th)
    else:
        rOut = lambda th: R0 * outline(th) * (1 + 0.35 * (rlob(th) - 1))

    P, C, idx, pin = [], [], [], []

    def v(x, y, z, col, pinned=False):
        P.append([x, y, z]); C.append(list(col)); pin.append(pinned); return len(P) - 1

    n0 = 32
    ang = [(i + (R() - 0.5) * 0.35) / n0 * TAU for i in range(n0)]
    bands = pr['bands']

    def bandCol(u):
        for lim, c in bands:
            if u <= lim + 1e-6:
                return c
        return bands[-1][1]
    us = []
    for k, (lim, _) in enumerate(bands):
        if k < len(bands) - 1:
            us += [[lim - 0.012, bands[k][1]], [lim + 0.012, bands[k + 1][1]]]
    raw = sorted([[0.3, bandCol(0.3)], [0.65, bandCol(0.65)]] + us, key=lambda x: x[0])
    topU = [x for i, x in enumerate(raw) if i == 0 or x[0] - raw[i - 1][0] > 0.005]
    if terrace:                                   # raised plateau: two rings make the step
        topU += [[terrace['u'] - 0.015, bandCol(terrace['u'])], [terrace['u'] + 0.015, bandCol(terrace['u'])]]
        topU = sorted(topU, key=lambda x: x[0])
    topU.append([1, bands[-1][1]])

    def topY(u):
        return terrace['h'] if (terrace and u <= terrace['u']) else 0.0

    centre = v(0, topY(0), 0, hexlin(bandCol(0)), True)
    ringIdx = []
    for u, col in topU:
        ringIdx.append([v(math.cos(a) * rOut(a) * u, topY(u), math.sin(a) * rOut(a) * u, hexlin(col), u < 0.999) for a in ang])
    for i in range(n0):
        idx.append([centre, ringIdx[0][(i + 1) % n0], ringIdx[0][i]])

    def strip(A, B):
        for i in range(n0):
            j = (i + 1) % n0
            idx.append([A[i], A[j], B[i]]); idx.append([A[j], B[j], B[i]])
    for k in range(len(ringIdx) - 1):
        strip(ringIdx[k], ringIdx[k + 1])

    rimT = pr['rim'] * Dm
    edgeCol = hexlin(bands[-1][1])
    top = ringIdx[-1]
    rimB = [v(math.cos(a) * rOut(a) * 1.005, -rimT, math.sin(a) * rOut(a) * 1.005, edgeCol) for a in ang]
    strip(top, rimB)

    D = pr['depth'] * Dm
    oa = R() * TAU
    apexXZ = (math.cos(oa) * pr['off'] * Dm, math.sin(oa) * pr['off'] * Dm)
    prof = pr['prof']

    def shape(u):
        f = min(max(u, 0), 1) * 10; i = min(9, int(math.floor(f)))
        return max(0.03, prof[i] + (prof[i + 1] - prof[i]) * (f - i))
    rings = [(n0, 0), (16, 0.1), (13, 0.25), (10, 0.42), (8, 0.6), (6, 0.76), (4, 0.9)]
    body = hexlin(pr['body'])

    def bodyCol(u):
        return [c * (1 - 0.12 * u) for c in body]

    def zip_(Aid, Aa, Bid, Ba):
        norm = lambda a: ((a % TAU) + TAU) % TAU
        a0 = [norm(a) for a in Aa]; b0 = [norm(b) for b in Ba]
        oA = sorted(range(len(a0)), key=lambda p: a0[p]); oB = sorted(range(len(b0)), key=lambda p: b0[p])
        i = j = 0; nA, nB = len(oA), len(oB)
        while i < nA or j < nB:
            ai = Aid[oA[i % nA]]; bj = Bid[oB[j % nB]]
            an = a0[oA[(i + 1) % nA]] + (TAU if i + 1 >= nA else 0)
            bn = b0[oB[(j + 1) % nB]] + (TAU if j + 1 >= nB else 0)
            if j >= nB or (i < nA and an <= bn):
                idx.append([ai, Aid[oA[(i + 1) % nA]], bj]); i += 1
            else:
                idx.append([ai, Bid[oB[(j + 1) % nB]], bj]); j += 1

    prev, prevA, ringV = rimB, ang, []
    for k, (n, u) in enumerate(rings):
        s = 1 - pr['inset'] * 0.3 if k == 0 else shape(u)
        cx, cz = apexXZ[0] * u, apexXZ[1] * u
        A = ang if k == 0 else [(i + 0.5 * k + (R() - 0.5) * 0.5) / n * TAU for i in range(n)]
        low = u > 0.5
        jr = 0.02 if k == 0 else (0.18 if low else 0.07)
        jy = 0.01 if k == 0 else (0.1 if low else 0.04)
        ids = []
        for i, a in enumerate(A):
            sw = 0.0
            if u > 0.6:
                sw = pr['saw'] * ((0.35 + 0.3 * R()) if i % 2 else (0.75 + 0.5 * R())) * (1 if u > 0.8 else 0.6)
            r = rOut(a) * s * (1 + (R() - 0.5) * 2 * jr) * (1 - 0.35 * sw)
            y = -rimT - (0.04 * D if k == 0 else u * D) + (R() - 0.5) * 2 * jy * D - sw * D
            ids.append(v(cx + math.cos(a) * r, y, cz + math.sin(a) * r, bodyCol(u)))
        if k == 0:
            strip(prev, ids)
        else:
            zip_(prev, prevA, ids, A)
        ringV.append((ids, A)); prev, prevA = ids, A

    cand = ringV[-1][0] + ringV[-2][0]
    for i in range(len(cand) - 1, 0, -1):          # seeded Fisher-Yates instead of JS random sort
        j = int(R() * (i + 1)); cand[i], cand[j] = cand[j], cand[i]
    apexY = -rimT - D
    for vid in cand[:pr['zack']]:
        P[vid][1] = max(apexY + 0.05 * D, P[vid][1] - pr['zackD'] * D * (0.7 + 0.6 * R()))
        P[vid][0] = P[vid][0] + (apexXZ[0] - P[vid][0]) * -0.04
        P[vid][2] = P[vid][2] + (apexXZ[1] - P[vid][2]) * -0.04
        pin[vid] = 'z'
    ap = v(apexXZ[0], -rimT - D, apexXZ[1], bodyCol(1))
    L = ringV[-1][0]
    for i in range(len(L)):
        idx.append([L[i], L[(i + 1) % len(L)], ap])

    meta = dict(R0=R0, D=D, rimT=rimT, apexXZ=apexXZ, facets=len(idx), shape=shape, rOut=rOut)
    out = dict(pos=P, col=C, tris=idx, pin=pin, meta=meta)
    if soft > 0:
        out = soften(out, soft)
    return out


def soften(m, levels):
    """Midpoint subdivision + Taubin lambda/mu, top (pin True) fixed, spikes (pin 'z') smoothed at 0.35. As soften() in JS."""
    pos = [p[:] for p in m['pos']]; col = [c[:] for c in m['col']]; pn = m['pin'][:]; tris = [t[:] for t in m['tris']]
    for _ in range(levels):
        mid = {}; nt = []

        def mp(a, b):
            k = (a, b) if a < b else (b, a)
            if k in mid:
                return mid[k]
            n = len(pos)
            pos.append([(pos[a][d] + pos[b][d]) / 2 for d in range(3)])
            col.append([(col[a][d] + col[b][d]) / 2 for d in range(3)])
            pn.append(pn[a] is True and pn[b] is True)
            mid[k] = n
            return n
        for a, b, c in tris:
            ab, bc, ca = mp(a, b), mp(b, c), mp(c, a)
            nt += [[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]]
        tris = nt
    n = len(pos)
    nb = [set() for _ in range(n)]
    for t in tris:
        for e in range(3):
            a, b = t[e], t[(e + 1) % 3]; nb[a].add(b); nb[b].add(a)
    N = [list(s) for s in nb]

    def step(f):
        o = [p[:] for p in pos]
        for i in range(n):
            if pn[i] is True:
                continue
            ns = N[i]; w = 0.35 if pn[i] == 'z' else 1.0; k = len(ns) or 1
            for d in range(3):
                s = 0.0
                for j in ns:
                    s += o[j][d]
                pos[i][d] += w * f * (s / k - o[i][d])
    for _ in range(1 + levels):
        step(0.5); step(-0.53)
    return dict(pos=pos, col=col, tris=tris, pin=pn, meta=m['meta'])


# ---------- families (post-soften, still three.js space) ----------
STRATA = ['#4a3220', '#9a5e34', '#c08a52', '#7a6a5d', '#5a4d45']   # topsoil, clay, sand, rock, deep rock (sRGB)


def depth_u(y, meta):
    return min(max((-y - meta['rimT']) / meta['D'], 0.0), 1.0)


def apply_strata(m, nS=4, terraces=0.04, seed=3):
    """Colour bands by depth with wavy boundaries; each stratum flares at its top and tucks in below (a terraced flank)."""
    meta = m['meta']; R = rng(seed); ph = [R() * TAU for _ in range(3)]
    cols = [hexlin(h) for h in STRATA]
    for i, p in enumerate(m['pos']):
        if p[1] > -meta['rimT'] * 0.999:
            continue                                # top and rim keep their colour
        u = depth_u(p[1], meta)
        th = math.atan2(p[2], p[0])
        wob = 0.015 * math.sin(3 * th + ph[0]) + 0.008 * math.sin(7 * th + ph[1])
        g = (u + wob) * nS
        band = min(int(max(g, 0)), nS)
        fr = g - math.floor(g)
        c = cols[min(band, len(cols) - 1)]
        if fr > 0.9 and band + 1 < len(cols):        # short blend at the lower edge of each band
            c = mix(c, cols[band + 1], (fr - 0.9) / 0.1)
        m['col'][i] = [x * (1 - 0.1 * u) for x in c]
        w = min(1.0, u / 0.06)                      # no terrace right under the rim
        cx, cz = meta['apexXZ'][0] * u, meta['apexXZ'][1] * u
        f = 1 + w * terraces * ((1 - fr) - 0.5)
        p[0] = cx + (p[0] - cx) * f; p[2] = cz + (p[2] - cz) * f


def apply_fractures(m, n=3, seed=9, depth_to=0.75, cut=0.84):
    """Flat fracture faces: body vertices beyond a vertical plane are projected onto it (lighter, fresh break colour)."""
    meta = m['meta']; R = rng(seed)
    fresh = hexlin('#b9a48c')
    planes = []
    for k in range(n):
        a = (k + 0.3 * R()) / n * TAU + 0.6
        planes.append((math.cos(a), math.sin(a), cut * (0.96 + 0.08 * R())))
    for i, p in enumerate(m['pos']):
        if p[1] > -meta['rimT'] - 0.03 * meta['D']:
            continue
        u = depth_u(p[1], meta)
        if u > depth_to:
            continue
        for nx, nz, c in planes:
            th = math.atan2(nz, nx)
            lim = c * meta['rOut'](th) * meta['shape'](u)
            d = p[0] * nx + p[2] * nz
            if d > lim:
                p[0] -= (d - lim) * nx; p[2] -= (d - lim) * nz
                m['col'][i] = mix(m['col'][i], fresh, 0.55)


# ---------- to Blender ----------
def to_object(m, name, coll):
    bm = bmesh.new()
    lay = bm.verts.layers.float_color.new('Col')
    vs = []
    for p, c in zip(m['pos'], m['col']):
        bv = bm.verts.new((p[0], -p[2], p[1]))
        bv[lay] = (c[0], c[1], c[2], 1.0)
        vs.append(bv)
    for t in m['tris']:
        try:
            bm.faces.new((vs[t[0]], vs[t[1]], vs[t[2]]))
        except ValueError:
            pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.get(name) or bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for poly in me.polygons:
        poly.use_smooth = True
    o = bpy.data.objects.get(name) or bpy.data.objects.new(name, me)
    o.data = me
    if o.name not in coll.objects:
        coll.objects.link(o)
    me.materials.clear(); me.materials.append(island_material())
    return o


def island_material():
    m = bpy.data.materials.get('IFK_ISLAND_VCOL')
    if m:
        return m
    m = bpy.data.materials.new('IFK_ISLAND_VCOL'); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = 0.82
    a = nt.nodes.new('ShaderNodeVertexColor'); a.layer_name = 'Col'
    nt.links.new(a.outputs['Color'], b.inputs['Base Color'])
    return m


# ---------- bmesh features on the final object (Blender space, Z up) ----------
def _patch(bm, seed_face, radius):
    c0 = seed_face.calc_center_median(); out = {seed_face}; front = [seed_face]
    while front:
        nf = []
        for f in front:
            for e in f.edges:
                for g in e.link_faces:
                    if g not in out and (g.calc_center_median() - c0).length < radius:
                        out.add(g); nf.append(g)
        front = nf
    return list(out)


def _pick_faces(bm, meta, n, u_lo, u_hi, seed, nz_max=0.35, avoid=(), targets=None):
    """n faces spread by angle, in a depth band, facing outward or down."""
    R = rng(seed); D, rimT = meta['D'], meta['rimT']
    cands = []
    for f in bm.faces:
        c = f.calc_center_median(); u = min(max((-c.z - rimT) / D, 0), 1)
        if u_lo <= u <= u_hi and f.normal.z < nz_max and Vector((c.x, c.y)).length > 1e-3:
            radial = Vector((c.x, c.y)).normalized()
            if radial.dot(Vector((f.normal.x, f.normal.y))) > 0.25:
                cands.append((math.atan2(c.y, c.x), f))
    picks = []
    off = R() * TAU
    for k in range(n):
        target = math.radians(targets[k]) if targets else off + k / n * TAU + (R() - 0.5) * 0.6
        best = min(cands, key=lambda af: abs(_angdiff(af[0], target)) + 0.3 * R(), default=None)
        if best and all((best[1].calc_center_median() - a).length > 0.12 * meta['R0'] for a in avoid):
            picks.append(best[1]); avoid = tuple(avoid) + (best[1].calc_center_median(),)
    return picks


def _set_col(verts, lay, rgb):
    for v in verts:
        v[lay] = (rgb[0], rgb[1], rgb[2], 1.0)


def _extrude(bm, faces):
    """Extrude a face region and drop the original faces (bmesh keeps them), so the mesh stays closed.
    Returns the new vertices and the new cap faces."""
    ret = bmesh.ops.extrude_face_region(bm, geom=faces)
    nv = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMVert)]
    nvs = set(nv)
    cap = [g for g in ret['geom'] if isinstance(g, bmesh.types.BMFace) and all(v in nvs for v in g.verts)]
    bmesh.ops.delete(bm, geom=[f for f in faces if f.is_valid], context='FACES')
    return nv, cap


def _round_patch(bm, faces, rr):
    """Make a patch planar and its rim a clean circle of radius rr (so openings read as round, not ragged)."""
    vs = {v for f in faces for v in f.verts}
    bnd = {v for f in faces for e in f.edges if sum(1 for g in e.link_faces if g in faces) == 1 for v in e.verts}
    c = sum((v.co for v in vs), Vector()) / len(vs)
    n = sum((f.normal for f in faces), Vector()).normalized()
    a = n.orthogonal().normalized(); b = n.cross(a)
    rmax = max(((v.co - c) - n * (v.co - c).dot(n)).length for v in bnd) or 1.0
    for v in vs:
        d = v.co - c; d = d - n * d.dot(n)
        ang = math.atan2(d.dot(b), d.dot(a))
        r = rr if v in bnd else min(d.length / rmax, 0.85) * rr
        v.co = c + (a * math.cos(ang) + b * math.sin(ang)) * r
    return c, n


def _grow_one(bm, lay, f0, rp, L, segs, d, R, bark, tip, zcap):
    faces = [f for f in _patch(bm, f0, rp) if f.is_valid and f.calc_center_median().z < zcap]
    if not faces:
        return
    for s in range(segs):
        nv, faces = _extrude(bm, faces)
        kink = Vector(((R() - .5), (R() - .5), (R() - .5) * .3))
        curl = 0.25 if s > segs * 0.6 else 0.0                  # tips curl outward a little
        out = Vector((d.x, d.y, 0)).normalized() if (d.x or d.y) else Vector((1, 0, 0))
        d = (d + Vector((0, 0, -0.22)) + kink * 0.55 + out * curl).normalized()
        bmesh.ops.translate(bm, verts=nv, vec=d * (L / segs))
        cen = sum((v.co for v in nv), Vector()) / max(1, len(nv))
        taper = 1.12 if s == 0 else (0.86 if s < segs - 1 else 0.3)  # flare at the base, slow taper, closed tip
        for v in nv:
            v.co = cen + (v.co - cen) * taper
        _set_col(nv, lay, mix(bark, tip, s / (segs - 1)))


def grow_roots(o, meta, n_main=5, n_thin=9, seed=21):
    """Roots start in the topsoil just below the rim and hang down along the clod.
    Five main roots (thick base, kinks, long) and nine thin ones, all grown out of the body mesh (no attached parts)."""
    bm = bmesh.new(); bm.from_mesh(o.data); bm.faces.ensure_lookup_table()
    lay = bm.verts.layers.float_color.get('Col')
    R = rng(seed); D, R0, rimT = meta['D'], meta['R0'], meta['rimT']
    bark, tip = hexlin('#3f2a1b'), hexlin('#7a5536')
    zcap = -rimT - 0.02 * D
    for f0 in _pick_faces(bm, meta, n_main, 0.04, 0.2, seed + 1, nz_max=0.5):
        if f0.is_valid:
            c = f0.calc_center_median(); out = Vector((c.x, c.y, 0)).normalized()
            _grow_one(bm, lay, f0, R0 * (0.06 + 0.025 * R()), D * (0.5 + 0.25 * R()), 10,
                      (out * 0.55 + Vector((0, 0, -0.45))).normalized(), R, bark, tip, zcap)
    bm.faces.ensure_lookup_table()
    for f0 in _pick_faces(bm, meta, n_thin, 0.03, 0.3, seed + 7, nz_max=0.5):
        if f0.is_valid:
            c = f0.calc_center_median(); out = Vector((c.x, c.y, 0)).normalized()
            _grow_one(bm, lay, f0, R0 * (0.022 + 0.012 * R()), D * (0.22 + 0.22 * R()), 6,
                      (out * 0.4 + Vector((0, 0, -0.6))).normalized(), R, bark, tip, zcap)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data); bm.free()


def cut_openings(o, meta, seed=31):
    """Two pipes (round rim out, hole in), a cellar breach and a tunnel bore, all cut into the body faces."""
    bm = bmesh.new(); bm.from_mesh(o.data); bm.faces.ensure_lookup_table()
    lay = bm.verts.layers.float_color.get('Col')
    R0 = meta['R0']
    dark, rust, frame = hexlin('#1c1511'), hexlin('#8b5a3a'), hexlin('#a39887')
    spec = [('pipe', 0.065), ('pipe', 0.05), ('cellar', 0.11), ('tunnel', 0.16)]
    picks = _pick_faces(bm, meta, len(spec), 0.2, 0.45, seed, nz_max=0.2, targets=[-48, -138, -112, -76])   # -90 deg = front (-Y), the K1 side camera
    for (kind, rr), f0 in zip(spec, picks):
        if not f0.is_valid:
            continue
        zcap = -meta['rimT'] - 0.08 * meta['D']
        faces = [f for f in _patch(bm, f0, R0 * rr * 1.3) if f.is_valid and f.calc_center_median().z < zcap]
        if len(faces) < 3:
            continue
        c0 = sum((f.calc_center_median() for f in faces), Vector()) / len(faces)
        edges = list({e for f in faces for e in f.edges})
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=1, use_grid_fill=True)
        faces = [f for f in bm.faces if f.calc_center_median().z < zcap and (f.calc_center_median() - c0).length < R0 * rr * 1.3]
        if len(faces) < 3:
            continue
        c, nrm = _round_patch(bm, faces, R0 * rr)
        if kind == 'pipe':
            nv, faces = _extrude(bm, faces)
            bmesh.ops.translate(bm, verts=nv, vec=nrm * R0 * 0.08); _set_col(nv, lay, rust)
        ins = bmesh.ops.inset_region(bm, faces=faces, thickness=R0 * rr * (0.22 if kind == 'pipe' else 0.18), depth=0)
        _set_col({v for f in ins['faces'] for v in f.verts}, lay, rust if kind == 'pipe' else frame)
        nv, faces = _extrude(bm, faces)
        deep = {'pipe': 0.1, 'cellar': 0.08, 'tunnel': 0.16}[kind]
        bmesh.ops.translate(bm, verts=nv, vec=-nrm * R0 * deep); _set_col(nv, lay, dark)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data); bm.free()


# ---------- measurement against ISLAND_ANATOMY_RULES.md ----------
def measure(o, meta):
    me = o.data
    xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; zs = [v.co.z for v in me.vertices]
    W = max(max(xs) - min(xs), max(ys) - min(ys))
    zmin = min(zs); depth = -zmin - meta['rimT']
    bm = bmesh.new(); bm.from_mesh(me)
    nonman = sum(1 for e in bm.edges if len(e.link_faces) != 2)
    tris = sum(len(f.verts) - 2 for f in bm.faces)
    mean_edge = sum(e.calc_length() for e in bm.edges) / max(1, len(bm.edges))
    # taper: mean half-width over 8 directions at 0..100 % of the depth below the plate, relative to the island radius
    Rr = W / 2; prof = []
    dirs = [Vector((math.cos(a), math.sin(a), 0)) for a in [k / 8 * TAU for k in range(8)]]
    for k in range(11):
        z = -meta['rimT'] - depth * k / 10; band = [v.co for v in bm.verts if abs(v.co.z - z) < depth * 0.04]
        if not band:
            prof.append(0.0); continue
        prof.append(round(sum(max(p.dot(d) for p in band) for d in dirs) / 8 / Rr, 2))
    # spikes: vertices lower than all 2-ring neighbours, deeper than 25 % of the depth
    bm.verts.ensure_lookup_table(); spikes = 0
    for v in bm.verts:
        if v.co.z > -meta['rimT'] - 0.25 * depth:
            continue
        ring = {w for e in v.link_edges for w in e.verts}
        ring2 = {x for w in ring for e in w.link_edges for x in e.verts} - {v}
        if all(v.co.z < w.co.z for w in ring2):
            spikes += 1
    low = min(bm.verts, key=lambda v: v.co.z).co.copy()
    bm.free()
    return dict(W=round(W, 1), W_MC=round(W / MC, 1), plate_W=round(meta['rimT'] / W, 3), depth_W=round(depth / W, 2),
                taper=prof, spikes=spikes, deepest_off_R=round(Vector((low.x, low.y)).length / Rr, 2),
                tris=tris, mean_edge_W=round(mean_edge / W, 3), facets_before_clay=meta['facets'], non_manifold_edges=nonman)


ANATOMY = dict(plate_W=[0.013, 0.041], depth_W=[0.43, 0.52], spikes=[2, 34], deepest_off_R=[0.07, 0.56],
               taper=[1.0, 0.9, 0.82, 0.74, 0.67, 0.59, 0.53, 0.44, 0.37, 0.27, 0.17], mean_edge_W=[0.031, 0.107], tris=[576, 9991])


def make_island(name, coll, pr, Dm, family='base', outline=None, terrace=None):
    m = build_scholle(pr, Dm, outline=outline, terrace=terrace, soft=2)
    if family in ('blast', 'roots'):
        apply_strata(m, terraces=0.07 if family == 'blast' else 0.03)
    if family == 'blast':
        apply_fractures(m)
    o = to_object(m, name, coll)
    if family == 'blast':
        cut_openings(o, m['meta'])
    if family == 'roots':
        grow_roots(o, m['meta'])
    for poly in o.data.polygons:
        poly.use_smooth = True
    met = measure(o, m['meta'])
    o['ifk'] = str(dict(family=family, preset=pr['id'], Dm=Dm))
    return o, m['meta'], met
