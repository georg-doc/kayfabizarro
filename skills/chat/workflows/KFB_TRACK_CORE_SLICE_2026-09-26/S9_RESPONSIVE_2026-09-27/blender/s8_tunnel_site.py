"""S8 · TN01 tunnels in Blender (preview / oracle, the JS core stays authoritative).
Stages (one exec each, every stage < 60 s), global S8_STAGE:
  'new'     : empty file (own exec, the glTF exporter fails in the same exec as read_homefile)
  'track'   : B1 importer for out/tn01.graph.stream.json.gz (track bodies, markings, oracle, GLB round trip)
  'tubes'   : tube meshes swept from the stream rings (inner + outer wall + end rims) and portal collars of the same shape
  'surface' : one terrain heightfield (mountain blobs, shaft domes, cover over near-surface tubes, cut under the
              building tube, approach cuts along open road), building with the rect passage cut out, windows
  'cavern'  : hollow earth: north half of the ellipsoid shell (cutaway), floor disc, inner sun, welcome sign
Globals: S8_ROOT (slice folder)."""
import bpy, bmesh, json, gzip, math, os
import numpy as np
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S8_ROOT', KIT + 'S8_TUNNELS_2026-09-27/')
STAGE = globals().get('S8_STAGE', 'track')
SRC = globals().get('S8_SRC', ROOT + 'out/tn01.graph.stream.json.gz')   # S9 passes the TN02 stream
GROUND = -0.3


def load():
    return json.load(gzip.open(SRC, 'rt'))


def srgb(h):
    c = [((h >> s) & 255) / 255 for s in (16, 8, 0)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def coll(name, clear=True):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    if clear:
        for o in list(c.objects):
            bpy.data.objects.remove(o, do_unlink=True)
    return c


def mesh_obj(c, name, verts, faces, face_cols, role):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces])
    me.validate(clean_customdata=False)
    ca = me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
    cols = np.zeros((len(me.loops), 4), dtype=np.float32)
    for poly, fc in zip(me.polygons, face_cols):
        cols[poly.loop_start:poly.loop_start + poly.loop_total] = fc
    ca.data.foreach_set('color', cols.ravel())
    me.color_attributes.active_color = ca
    m = bpy.data.materials.get('S8_' + role) or bpy.data.materials.new('S8_' + role)
    m.diffuse_color = face_cols[0] if face_cols else (0.6, 0.6, 0.6, 1)
    me.materials.append(m)
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_s8_role'] = role
    return o


def paint_uniform(o, col):
    me = o.data
    ca = me.color_attributes.get('paint') or me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
    ca.data.foreach_set('color', np.tile(np.array(col, dtype=np.float32), len(me.loops)))
    me.color_attributes.active_color = ca
    m = bpy.data.materials.new('S8_' + o.name); m.diffuse_color = col; me.materials.clear(); me.materials.append(m)


# Blender plan frame of a runtime vector: (x, -z, y)
def B(v):
    v = np.asarray(v, dtype=float)
    return np.stack([v[..., 0], -v[..., 2], v[..., 1]], axis=-1)


def outer_ring(ring, w):
    r = np.asarray(ring, dtype=float); a = np.roll(r, 1, axis=0); b = np.roll(r, -1, axis=0)
    t = b - a; l = np.linalg.norm(t, axis=1, keepdims=True); l[l == 0] = 1
    n = np.stack([t[:, 1], -t[:, 0]], axis=1) / l
    return r + n * w


HOST = {  # (inner wall, outer shell, collar) sRGB
    'mountain': (0xf0dcc0, 0xa0714a, 0xf4f1e8),
    'building': (0xf6e0da, 0xd0453a, 0xf4f1e8),
    'shaft': (0xe4dcf4, 0x6a3fb0, 0xf4f1e8),
    'labyrinth': (0xd6f2e8, 0x1f8a70, 0xf4f1e8),
    'earth': (0xeeeeee, 0x8a8580, 0xf4f1e8),
    'bunker': (0xd9d6c8, 0x6b6f5a, 0xf2d24a),      # S9: military grey-olive, yellow collar
    'alien': (0xc8f7e8, 0x3fd6a8, 0xb07cf0),
    'toy': (0xfff0e0, 0xff7a1a, 0x4f9be8),
    'hangar': (0xe6e8ee, 0x8d96a8, 0xf2d24a),
}


def tube_mesh(c, name, S, rings, seg):
    i0, i1 = seg['i0'], seg['i1']
    idx = list(range(i0, i1 + 1, 2))
    if idx[-1] != i1:
        idx.append(i1)
    K = len(idx); N = len(rings[0]); wall = S[i0]['tunnel']['wall']
    P = B([S[i]['p'] for i in idx]); R = B([S[i]['R'] for i in idx]); U = B([S[i]['U'] for i in idx])
    RI = np.array([rings[S[i]['tunnel']['ringId']] for i in idx], dtype=float)          # K x N x 2
    RO = np.array([outer_ring(rings[S[i]['tunnel']['ringId']], wall) for i in idx])
    W = lambda RR: P[:, None, :] + R[:, None, :] * RR[..., 0:1] + U[:, None, :] * RR[..., 1:2]
    vin, vout = W(RI).reshape(-1, 3), W(RO).reshape(-1, 3)
    verts = np.concatenate([vin, vout]); off = K * N
    faces, roles = [], []
    for k in range(K - 1):
        for j in range(N):
            a, b = k * N + j, k * N + (j + 1) % N
            faces.append((a, b, b + N, a + N)); roles.append(0)                          # inner (orientation fixed below)
            faces.append((off + a + N, off + b + N, off + b, off + a)); roles.append(1)  # outer
    for k in (0, K - 1):                                                                 # end rims (annulus)
        for j in range(N):
            a, b = k * N + j, k * N + (j + 1) % N
            faces.append((a, off + a, off + b, b) if k == 0 else (b, off + b, off + a, a)); roles.append(2)
    # orientation: inner faces must face the tube axis (seen from inside); test the first quad, flip the set if needed
    f0 = faces[0]; q = verts[list(f0)]; n = np.cross(q[1] - q[0], q[3] - q[0]); ctr = P[0] + U[0] * RI[0, :, 1].mean()
    flip_in = np.dot(n, ctr - q.mean(axis=0)) < 0
    fo = faces[1]; q = verts[list(fo)]; n = np.cross(q[1] - q[0], q[3] - q[0]); flip_out = np.dot(n, q.mean(axis=0) - ctr) < 0
    faces = [tuple(reversed(f)) if (r == 0 and flip_in) or (r == 1 and flip_out) else f for f, r in zip(faces, roles)]
    ci, co, cc = (srgb(h) for h in HOST.get(seg['host'], HOST['earth']))
    o = mesh_obj(c, name, verts, faces, [ci if r == 0 else co if r == 1 else cc for r in roles], 'tube_' + seg['host'])
    o.data.polygons.foreach_set('use_smooth', [r < 2 for r in roles])
    o['kfb_tube'] = f"{seg['id']} · {seg['host']} · {'>'.join(seg['shapes'])} · {seg['length']} m"
    # portal collars: same ring shape as the tube end, 1.8 m proud of the shell, 0.6 m out of the portal face, 3 m deep
    cverts, cfaces = [], []
    for k, i, sgn in ((0, i0, -1), (K - 1, i1, 1)):
        Tn = B(S[i]['T']); base = P[k]; ring = rings[S[i]['tunnel']['ringId']]
        r_in, r_out = outer_ring(ring, 0.02), outer_ring(ring, wall + 1.8)
        planes = [(r_in, 0.6), (r_out, 0.6), (r_out, -3.0), (r_in, -3.0)]
        o0 = len(cverts)
        for rr, d in planes:
            for lat, lift in rr:
                cverts.append(base + R[k] * lat + U[k] * lift + Tn * sgn * d)
        for p in range(4):
            for j in range(N):
                a, b = o0 + p * N + j, o0 + p * N + (j + 1) % N
                a2, b2 = o0 + ((p + 1) % 4) * N + j, o0 + ((p + 1) % 4) * N + (j + 1) % N
                cfaces.append((a, b, b2, a2) if sgn > 0 else (a2, b2, b, a))
    col = mesh_obj(c, name + '_portals', np.array(cverts), cfaces, [cc] * len(cfaces), 'portal')
    me = col.data; bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    return o


def stage_new():   # separate exec: the glTF exporter needs a fresh context after read_homefile
    bpy.ops.wm.read_homefile(use_empty=True)
    return dict(stage='new', objects=len(bpy.data.objects))


def stage_track():
    g = {'__name__': 's8_import', 'B1_ROOT': ROOT, 'B1_OUT': ROOT + 'b1/', 'B1_STREAMS': [(SRC, (0.0, 0.0), 'TN01')]}
    exec(open(ROOT + 'blender/b1_import_stream.py').read(), g)
    r = g['result']
    return dict(stage='track', oracle={k: v['oracle']['pass_'] for k, v in r.items() if isinstance(v, dict) and 'oracle' in v},
                glb=r['_glb_round_trip']['pass_'], glb_dev=r['_glb_round_trip']['max_dev_m'], objects=len(bpy.data.objects))


def stage_tubes():
    G = load(); c = coll('S8_TUBES'); out = {}
    for rid, st in G['routes'].items():
        for seg in st.get('tunnels', []):
            o = tube_mesh(c, f"S8_tube_{rid.split('/')[-1]}_{seg['id']}", st['samples'], st['tunnelRings'], seg)
            out[o.name] = dict(faces=len(o.data.polygons), host=seg['host'], shapes=seg['shapes'])
    return dict(stage='tubes', tubes=out)


def blob(c, name, ctr, rh, rv, col, seg=40):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=1.0)
    for v in bm.verts:
        v.co = Vector((ctr[0] + v.co.x * rh, ctr[1] + v.co.y * rh, ctr[2] + v.co.z * rv))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = bpy.data.objects.new(name, me); c.objects.link(o); paint_uniform(o, col)
    return o


def grid_mesh(c, name, X, Y, Z, cols, keep=None):
    ny, nx = Z.shape
    verts = np.stack([X, Y, Z], axis=-1).reshape(-1, 3).astype(np.float32)
    ii = np.arange(ny * nx).reshape(ny, nx)
    q = np.stack([ii[:-1, :-1], ii[:-1, 1:], ii[1:, 1:], ii[1:, :-1]], axis=-1).reshape(-1, 4)
    if keep is not None:
        q = q[keep(q)]
    me = bpy.data.meshes.new(name)
    me.vertices.add(len(verts)); me.vertices.foreach_set('co', verts.ravel())
    me.loops.add(q.size); me.loops.foreach_set('vertex_index', q.ravel().astype(np.int32))
    me.polygons.add(len(q)); me.polygons.foreach_set('loop_start', (np.arange(len(q)) * 4).astype(np.int32))
    me.update(); me.validate()
    ca = me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
    ca.data.foreach_set('color', cols.reshape(-1, 4)[q.ravel()].astype(np.float32).ravel())
    me.color_attributes.active_color = ca
    m = bpy.data.materials.new('S8_' + name); m.diffuse_color = tuple(cols.reshape(-1, 4)[0]); me.materials.append(m)
    o = bpy.data.objects.new(name, me); c.objects.link(o); return o


def stage_surface():
    """One terrain heightfield (4 m grid) instead of loose blobs: blobs and domes only feed its height. Rules:
    over a near-surface mountain / shaft tube the terrain is lifted to the shell top + 1.5 m (cover), it ends at the
    portal plane (so the portal is a face in the slope); under the building tube it is cut below the tube floor;
    near open road it drops to the ground (approach cuts). The terrain never enters a tube."""
    from mathutils.kdtree import KDTree
    G = load(); M = G['routes']['M']; S = M['samples']; c = coll('S8_SURFACE')
    road = [B(q['p']) for r in G['routes'].values() for q in r['samples'][::2] if 'tunnel' not in q and q['p'][1] > -1]
    kd_open = KDTree(len(road))
    for k, p in enumerate(road):
        kd_open.insert((p[0], p[1], 0), k)
    kd_open.balance()
    open_xy = np.array([p[:2] for p in road])
    free = lambda xy, pad=16.0: float(np.min(np.linalg.norm(open_xy - np.asarray(xy)[None, :], axis=1))) - pad
    # tube samples that reach the surface: cover (mountain, shaft) or cut (building)
    tub = []
    for r in G['routes'].values():
        Sr, rings = r['samples'], r.get('tunnelRings', [])
        for seg in r.get('tunnels', []):
            mode = {'mountain': 'cover', 'shaft': 'cover', 'building': 'cut'}.get(seg['host'])
            if not mode:
                continue
            for i in range(seg['i0'], seg['i1'] + 1):
                q = Sr[i]; P, R, U = B(q['p']), B(q['R']), B(q['U'])
                o = outer_ring(rings[q['tunnel']['ringId']], q['tunnel']['wall'])
                w = P[None, :] + R[None, :] * o[:, 0:1] + U[None, :] * o[:, 1:2]
                top, bot = w[:, 2].max(), w[:, 2].min()
                if top < GROUND - 1:
                    continue
                Tp = B(q['T'])[:2]; Tp = Tp / (np.linalg.norm(Tp) or 1)
                tub.append((P[0], P[1], top, bot, np.abs(o[:, 0]).max(), Tp, -1 if i == seg['i0'] else 1 if i == seg['i1'] else 0, mode))
    kd_t = KDTree(len(tub))
    for k, t in enumerate(tub):
        kd_t.insert((t[0], t[1], 0), k)
    kd_t.balance()
    x = np.arange(-600, 2801, 4.0); y = np.arange(-950, 551, 4.0); X, Y = np.meshgrid(x, y); Z = np.full(X.shape, GROUND - 0.05)
    SAND = np.zeros(X.shape, dtype=bool)
    # mountain blobs along the mountain tube (heights only)
    seg = next(t for t in M['tunnels'] if t['host'] == 'mountain'); blobs = 0
    for i in range(seg['i0'] + 40, seg['i1'] - 40, 60):
        q = S[i]; p = B(q['p']); Rv = B(q['R'])
        for lat, rmax in ((0, 120), (55, 85), (-55, 85), (110, 60), (-110, 60)):
            xy = p[:2] + Rv[:2] * lat; rh = min(rmax, free(xy))
            if rh < 25:
                continue
            rv = 0.6 * rh + 8; zc = GROUND - 0.2 * rv
            d2 = ((X - xy[0]) ** 2 + (Y - xy[1]) ** 2) / rh ** 2
            Z = np.maximum(Z, np.where(d2 < 1, zc + rv * np.sqrt(np.clip(1 - d2, 0, 1)), -1e9)); blobs += 1
    domes = []
    for ax, ay in G['meta']['shafts']:
        rh = min(95, free((ax, ay), 18)); domes.append(round(rh, 1))
        d2 = ((X - ax) ** 2 + (Y - ay) ** 2) / rh ** 2; dz = np.where(d2 < 1, GROUND - 6 + 30 * np.sqrt(np.clip(1 - d2, 0, 1)), -1e9)
        SAND |= dz > Z; Z = np.maximum(Z, dz)
    # approach cuts along open road, then tube cover / cut (cover wins over the cut, the terrain never enters a tube)
    flat = Z.ravel(); XX, YY = X.ravel(), Y.ravel(); covered = 0; cut = 0; state = np.zeros(flat.size, dtype=np.int8)
    for k in range(flat.size):
        px, py = XX[k], YY[k]
        _, _, dist = kd_open.find((px, py, 0))
        if dist < 38:
            w = min(1.0, max(0.0, (dist - 13) / 25)); w = w * w * (3 - 2 * w)
            flat[k] = min(flat[k], GROUND - 0.05 + (flat[k] - GROUND + 0.05) * w)
        if not tub:
            continue
        co, j, dt = kd_t.find((px, py, 0)); t = tub[j]
        if t[6] and np.dot((px - t[0], py - t[1]), t[5]) * t[6] > 0:  # beyond the portal plane: no cover, open cut
            if dt < t[4] + 4:
                flat[k] = min(flat[k], GROUND - 0.05); state[k] = 2
            continue
        if t[7] == 'cut':
            if dt < t[4] + 1.5:
                flat[k] = min(flat[k], t[3] - 0.2); cut += 1
            continue
        if dt < t[4] + 2:
            f = 1.0; state[k] = 1
        elif dt < t[4] + 42:
            u = (dt - t[4] - 2) / 40; f = 1 - u * u * (3 - 2 * u)
        else:
            continue
        zc = GROUND + (t[2] + 1.5 - GROUND) * f
        if zc > flat[k]:
            flat[k] = zc; covered += 1
    Z = flat.reshape(X.shape)
    g0, g1, rock, sand = (np.array(srgb(h)) for h in (0x8fbf6a, 0x6f9a4c, 0xa08a6a, 0xc9a36b))
    hgt = np.clip((Z - GROUND) / 40, 0, 1)[..., None]
    cols = g0 * (1 - hgt) + g1 * hgt
    cols = np.where((Z > GROUND + 45)[..., None], rock, cols); cols = np.where(SAND[..., None] & (Z > GROUND + 0.5)[..., None], sand, cols)
    # a heightfield cannot overhang a portal: faces that would climb from the open cut onto the cover run through the
    # tube mouth, so they are left out; the headwall (below) closes that gap around the collar
    st = state
    ter = grid_mesh(c, 'S8_terrain', X, Y, Z, cols, keep=lambda q: ~((st[q] == 1).any(axis=1) & (st[q] == 2).any(axis=1)))
    dropped = int(((st.reshape(X.shape)[:-1, :-1] >= 0)).size) - len(ter.data.polygons)
    hv, hf = [], []
    for r in G['routes'].values():
        Sr, rings = r['samples'], r.get('tunnelRings', [])
        for seg in r.get('tunnels', []):
            if seg['host'] not in ('mountain', 'shaft'):
                continue
            for i, sg in ((seg['i0'], -1), (seg['i1'], 1)):
                q = Sr[i]; P, R, U, Tn = B(q['p']), B(q['R']), B(q['U']), B(q['T']); ring = rings[q['tunnel']['ringId']]
                a, b2 = outer_ring(ring, q['tunnel']['wall'] + 1.8), outer_ring(ring, q['tunnel']['wall'] + 12)
                wa = P[None] + R[None] * a[:, 0:1] + U[None] * a[:, 1:2] + Tn * sg * 0.3
                wb = P[None] + R[None] * b2[:, 0:1] + U[None] * b2[:, 1:2] + Tn * sg * 0.3
                if wa[:, 2].max() < GROUND:
                    continue
                wb[:, 2] = np.maximum(wb[:, 2], GROUND - 3); n = len(ring); o0 = len(hv)
                hv.extend(list(wa) + list(wb))
                hf.extend([(o0 + j, o0 + (j + 1) % n, o0 + n + (j + 1) % n, o0 + n + j) for j in range(n)])
    if hv:
        hw = mesh_obj(c, 'S8_portal_headwalls', np.array(hv), hf, [srgb(0xd9c9ad)] * len(hf), 'headwall')
    for p in ter.data.polygons:
        p.use_smooth = True
    # building: block around the rect tube, rounded edges, the passage cut out with the tube's own outer ring
    bt = next(t for t in M['tunnels'] if t['host'] == 'building'); im = (bt['i0'] + bt['i1']) // 2; q = S[im]
    p, Tn, Rv = B(q['p']), B(q['T']), B(q['R'])
    Lb, Wb, Hb = bt['length'] - 12, 90, 38
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        w = p + Tn * v.co.x * Lb + Rv * v.co.y * Wb; v.co = Vector((w[0], w[1], GROUND + (v.co.z + 0.5) * Hb))
    me = bpy.data.meshes.new('S8_building'); bm.to_mesh(me); bm.free()
    bld = bpy.data.objects.new('S8_building', me); c.objects.link(bld); paint_uniform(bld, srgb(0xf2c6a0))
    bv = bld.modifiers.new('KFB_round_edges', 'BEVEL'); bv.width = 2.5; bv.segments = 4; bv.limit_method = 'ANGLE'; bv.harden_normals = True
    ring = outer_ring(M['tunnelRings'][q['tunnel']['ringId']], q['tunnel']['wall'] + 0.05); U = B(q['U'])
    cv = [p + Tn * d + Rv * lat + U * lift for d in (-80, 80) for lat, lift in ring]; n = len(ring)
    cf = [(j, (j + 1) % n, n + (j + 1) % n, n + j) for j in range(n)] + [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
    cutter = mesh_obj(c, 'S8_building_cutter', np.array(cv), cf, [srgb(0xff00ff)] * len(cf), 'cutter')
    me = cutter.data; bmc = bmesh.new(); bmc.from_mesh(me); bmesh.ops.recalc_face_normals(bmc, faces=bmc.faces); bmc.to_mesh(me); bmc.free()
    cutter.hide_set(True); cutter.hide_render = True
    bo = bld.modifiers.new('passage', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.object = cutter; bo.solver = 'EXACT'
    # windows on all four facades (above the passage on the portal facades), floor bands between the rows
    wv, wf, wc = [], [], []
    def pane(ctr, along, z0, w, h, col):
        o0 = len(wv)
        for a, b2 in ((-w / 2, 0), (w / 2, 0), (w / 2, h), (-w / 2, h)):
            e = ctr + along * a; wv.append((e[0], e[1], z0 + b2))
        wf.append((o0, o0 + 1, o0 + 2, o0 + 3)); wc.append(col)
    for side in (-1, 1):
        for fl in range(1, 9):
            for k in range(-int(Lb / 2 / 7) + 1, int(Lb / 2 / 7)):
                pane(p + Tn * k * 7 + Rv * side * (Wb / 2 + 0.08), Tn, GROUND + fl * 4.2 + 0.9, 4, 2.4, srgb(0x3b4a6b))
        for fl in range(4, 9):
            for k in range(-int(Wb / 2 / 7) + 1, int(Wb / 2 / 7)):
                pane(p + Tn * side * (Lb / 2 + 0.08) + Rv * k * 7, Rv, GROUND + fl * 4.2 + 0.9, 4, 2.4, srgb(0x3b4a6b))
    mesh_obj(c, 'S8_building_windows', np.array(wv), wf, wc, 'windows')
    return dict(stage='surface', headwall_faces=len(hf), terrain_faces_dropped=dropped, mountain_blobs=blobs, domes=domes, terrain_verts=int(X.size), covered=covered, cut=cut, near_surface_tube_samples=len(tub))


def stage_cavern():
    G = load(); h = G['hosts'][0]; c = coll('S8_HOLLOW_EARTH')
    cx, cy, cz = B(h['center']); rx, ry, rz = h['radii'][0], h['radii'][2], h['radii'][1]; floorZ = h['floorY']
    # shell: north half (cutaway towards the viewer in the south), above the floor, normals inwards
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=48, radius=1.0)
    for v in bm.verts:
        v.co = Vector((cx + v.co.x * rx, cy + v.co.y * ry, cz + v.co.z * rz))
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, cy, 0), plane_no=(0, 1, 0), clear_inner=True)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, floorZ), plane_no=(0, 0, 1), clear_inner=True)
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    me = bpy.data.meshes.new('S8_cavern_shell'); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    sh = bpy.data.objects.new('S8_cavern_shell', me); c.objects.link(sh); paint_uniform(sh, srgb(0xd9a86c))
    # floor: flat inner land (full disc), a lake, the sun
    fr = G['meta']['floorR']
    bm = bmesh.new(); bmesh.ops.create_circle(bm, cap_ends=True, segments=128, radius=fr)
    for v in bm.verts:
        v.co = Vector((cx + v.co.x, cy + v.co.y, floorZ))
    me = bpy.data.meshes.new('S8_cavern_floor'); bm.to_mesh(me); bm.free()
    fl = bpy.data.objects.new('S8_cavern_floor', me); c.objects.link(fl); paint_uniform(fl, srgb(0xa7d36e))
    bm = bmesh.new(); bmesh.ops.create_circle(bm, cap_ends=True, segments=48, radius=70)
    for v in bm.verts:
        v.co = Vector((cx - 200 + v.co.x * 1.4, cy - 260 + v.co.y, floorZ + 0.3))
    me = bpy.data.meshes.new('S8_inner_sea'); bm.to_mesh(me); bm.free()
    sea = bpy.data.objects.new('S8_inner_sea', me); c.objects.link(sea); paint_uniform(sea, srgb(0x5aa8d8))
    sx, sy, sz = B(h['sun']['at'])
    blob(c, 'S8_inner_sun', (sx, sy, sz), h['sun']['r'], h['sun']['r'], srgb(0xffd23a), seg=48)
    t = bpy.data.curves.new('S8_welcome', 'FONT'); t.body = 'WILLKOMMEN IN DER HOHLERDE'; t.size = 14; t.align_x = 'CENTER'; t.extrude = 1.2
    to = bpy.data.objects.new('S8_welcome', t); c.objects.link(to)
    to.location = (cx - 150, cy + 300, floorZ + 1); to.rotation_euler = (math.pi / 2, 0, 0)
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(to.evaluated_get(dg))
    tm = bpy.data.objects.new('S8_welcome_sign', me); c.objects.link(tm); tm.location = to.location.copy(); tm.rotation_euler = to.rotation_euler.copy()
    bpy.data.objects.remove(to, do_unlink=True); paint_uniform(tm, srgb(0xe8452c))
    return dict(stage='cavern', floorR=round(fr, 1), shell_faces=len(sh.data.polygons))


result = {'new': stage_new, 'track': stage_track, 'tubes': stage_tubes, 'surface': stage_surface, 'cavern': stage_cavern}[STAGE]()
