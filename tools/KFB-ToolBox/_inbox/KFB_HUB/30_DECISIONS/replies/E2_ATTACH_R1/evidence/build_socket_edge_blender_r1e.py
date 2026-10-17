# R1e socket-edge rebuild. Run: Blender -b --factory-startup --python build_r1e.py
# Per eye socket primitive (loft | shell | rim, layout measured on r4):
#  - shell = sphere (radius/centre unchanged); rings with theta < edge removed, one new ring exactly at theta_e on the same sphere
#  - rim   = closed torus; every r4 rim vertex is expressed in the sphere frame of its r4 edge point (a_n along sphere normal,
#            a_t along the meridian toward the front, a_phi azimuthal) and re-placed with identical offsets at the new edge point
#  - loft (stalk joint) untouched, all other primitives/nodes untouched (glb spliced, not re-exported through Blender)
import sys, os, json, struct, math
SCR = '/private/tmp/claude-501/-Users-georgv-westphalen-Dropbox-CLAUDE/2ecdb67e-4fc9-4128-868a-6d437e784b52/scratchpad/r1e'
sys.path.insert(0, SCR)
import numpy as np
from glbnp import load, acc, worlds, node_by_name, CT, NC

BASE = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/E2_ATTACH_R1/'
A = BASE + 'assets/'
OUT = A + 'variants/'
FIGS = {'LordHunky': ('LordHunky_RigMedium.toolbox.r4.glb', 'lordhunky-headpart-r4.ws0-2026-10-16.kfb-pets.json'),
        'LadyDory': ('LadyDory_RigMedium.toolbox.r4.glb', 'ladydory-headpart-r4.ws0-2026-10-16.kfb-pets.json')}
EDGES = [70, 80, 90]
LOFT = (0, 3904); SHELL = (3904, 6568); RIM = (6568, 8217)
TRI_LOFT = (0, 2560); TRI_SHELL = (2560, 7616); TRI_RIM = (7616, 10688)
NCOL = 65; NRING = 40


def eye_setup(g, b, pet):
    W = worlds(g); hr = node_by_name(g, pet['headPart']['root']); Mh = W[hr]; s = np.linalg.norm(Mh[:3, 0])
    mi = [i for i, m in enumerate(g['meshes']) if m['name'] == pet['headPart']['mesh']][0]
    eyes = []
    for e in pet['eyes']:
        c = (Mh @ np.array(e['pos'] + [1]))[:3]; Rw = e['R'] * s
        gz = Mh[:3, :3] @ np.array(e['gaze'], float); gz /= np.linalg.norm(gz)
        best = None
        for pi, p in enumerate(g['meshes'][mi]['primitives']):
            if 'Sockel' not in g['materials'][p['material']]['name']: continue
            P = acc(g, b, p['attributes']['POSITION']); dd = np.linalg.norm(P.mean(0) - c)
            if best is None or dd < best[0]: best = (dd, pi)
        eyes.append(dict(side=e['side'], anchor=e['anchorNode'], c=c, Rw=Rw, gaze=gz, prim=best[1], rec=e))
    return mi, eyes


def prim_data(g, b, mi, pi):
    p = g['meshes'][mi]['primitives'][pi]
    d = {k: acc(g, b, v) for k, v in p['attributes'].items()}
    d['indices'] = acc(g, b, p['indices']).astype(np.int64)
    d['targets'] = [{k: acc(g, b, v) for k, v in t.items()} for t in p.get('targets', [])]
    return d


def socket_frame(P):
    V = P[SHELL[0]:SHELL[1]].astype(float)
    A_ = np.c_[2 * V, np.ones(len(V))]; sol = np.linalg.lstsq(A_, (V ** 2).sum(1), rcond=None)[0]
    O = sol[:3]; Rs = math.sqrt(sol[3] + O @ O)
    ring0 = V[:NCOL]; c0 = ring0.mean(0); _, _, vt = np.linalg.svd(ring0 - c0); ax = vt[2]
    return O, Rs, ax


def sph(P, O, ax):
    q = P - O; z = q @ ax; rv = q - np.outer(z, ax); rho = np.linalg.norm(rv, axis=1)
    er = rv / rho[:, None]; eph = np.cross(ax, er); th = np.arctan2(rho, z)
    return q, z, rho, er, eph, th


def rim_profile(P, N, O, Rs, ax, th0):
    """r4 rim vertex -> (a_n, a_t, a_phi) relative to the edge point E(th0) on the shell sphere, same azimuth."""
    R = P[RIM[0]:RIM[1]].astype(float); NN = N[RIM[0]:RIM[1]].astype(float)
    q, z, rho, er, eph, th = sph(R, O, ax)
    n = np.sin(th0) * er + np.cos(th0) * ax[None, :]
    t = -np.cos(th0) * er + np.sin(th0) * ax[None, :]            # meridian tangent pointing to the front (smaller theta)
    E = O + Rs * n
    d = R - E
    prof = np.c_[(d * n).sum(1), (d * t).sum(1), (d * eph).sum(1)]
    nprof = np.c_[(NN * n).sum(1), (NN * t).sum(1), (NN * eph).sum(1)]
    return prof, nprof, er, eph


def place_rim(prof, nprof, er, eph, O, Rs, ax, the):
    n = np.sin(the) * er + np.cos(the) * ax[None, :]
    t = -np.cos(the) * er + np.sin(the) * ax[None, :]
    E = O + Rs * n
    P = E + prof[:, :1] * n + prof[:, 1:2] * t + prof[:, 2:3] * eph
    N = nprof[:, :1] * n + nprof[:, 1:2] * t + nprof[:, 2:3] * eph
    N /= np.linalg.norm(N, axis=1)[:, None]
    return P, N


def build_variant(d, O, Rs, ax, th0, the_deg):
    the = math.radians(the_deg)
    P = d['POSITION'].astype(float); N = d['NORMAL'].astype(float); I = d['indices'].reshape(-1, 3)
    nv = len(P)
    # ---- shell rings
    S0 = SHELL[0]
    _, _, _, _, _, ths = sph(P[S0:SHELL[1]], O, ax)
    ring_th = ths[:NRING * NCOL].reshape(NRING, NCOL).mean(1)
    kst = int(np.argmax(ring_th > the + 1e-9))                     # first kept ring
    assert ring_th[kst] > the and (kst == 0 or ring_th[kst - 1] <= the + 1e-9)
    keep_shell = np.arange(S0 + kst * NCOL, SHELL[1])               # kept rings + pole
    # new ring exactly at theta_e, same azimuths as kept ring kst
    colP = P[S0 + kst * NCOL: S0 + (kst + 1) * NCOL]
    _, _, _, er_c, _, _ = sph(colP, O, ax)
    ringP = O + Rs * (np.sin(the) * er_c + np.cos(the) * ax[None, :])
    ringN = (ringP - O) / Rs
    uv = d['TEXCOORD_0']
    v_lo = uv[S0 + (kst - 1) * NCOL, 1] if kst > 0 else uv[S0, 1]
    v_hi = uv[S0 + kst * NCOL, 1]
    th_lo = ring_th[kst - 1] if kst > 0 else ring_th[0]
    fr = 0.0 if kst == 0 else (the - th_lo) / (ring_th[kst] - th_lo)
    ringUV = np.c_[uv[S0 + kst * NCOL: S0 + (kst + 1) * NCOL, 0], np.full(NCOL, v_lo + (v_hi - v_lo) * fr)]
    # ---- rim: identical measured profile, swept along the new edge circle
    prof, nprof, er, eph = rim_profile(P, N, O, Rs, ax, th0)
    rimP, rimN = place_rim(prof, nprof, er, eph, O, Rs, ax, the)
    # ---- assemble vertex order: loft | new ring | kept shell | rim
    old_loft = np.arange(*LOFT); old_rim = np.arange(*RIM)
    n_loft = len(old_loft); n_ring = NCOL; n_keep = len(keep_shell); n_rim = len(old_rim)
    remap = -np.ones(nv, np.int64)
    remap[old_loft] = np.arange(n_loft)
    remap[keep_shell] = n_loft + n_ring + np.arange(n_keep)
    remap[old_rim] = n_loft + n_ring + n_keep + np.arange(n_rim)
    if kst > 0:  # ring kst-1 -> new ring (only used by band kst-1 -> kst)
        ring_prev = np.arange(S0 + (kst - 1) * NCOL, S0 + kst * NCOL)
        remap_ring_prev = dict(zip(ring_prev.tolist(), (n_loft + np.arange(NCOL)).tolist()))
    else:
        remap_ring_prev = {}
    def src_rows(arr, ring_arr):
        return np.concatenate([arr[old_loft], ring_arr, arr[keep_shell], arr[old_rim]])
    out = {}
    out['POSITION'] = np.concatenate([P[old_loft], ringP, P[keep_shell], rimP]).astype(np.float32)
    out['NORMAL'] = np.concatenate([N[old_loft], ringN, N[keep_shell], rimN]).astype(np.float32)
    out['TEXCOORD_0'] = src_rows(uv, ringUV).astype(np.float32)
    for k in ('JOINTS_0', 'WEIGHTS_0', '_CLAYSEED'):
        if k in d:
            ref = d[k][S0 + kst * NCOL: S0 + (kst + 1) * NCOL]          # adjacent shell ring
            out[k] = src_rows(d[k], ref).astype(d[k].dtype)
    tg = []
    for t in d['targets']:
        tt = {}
        for k, arr in t.items():
            ref = np.zeros((NCOL, arr.shape[1]), arr.dtype)
            assert np.abs(arr[S0:RIM[1]]).max() == 0, 'socket morph deltas expected zero'
            tt[k] = src_rows(arr, ref).astype(np.float32)
        tg.append(tt)
    # ---- triangles
    tris = []
    tris.append(remap[I[TRI_LOFT[0]:TRI_LOFT[1]]])
    TS = I[TRI_SHELL[0]:TRI_SHELL[1]]
    ok = np.ones(len(TS), bool); TSn = np.empty_like(TS)
    for ti, tri in enumerate(TS):
        row = []
        for vi in tri:
            if remap[vi] >= 0: row.append(remap[vi])
            elif vi in remap_ring_prev: row.append(remap_ring_prev[vi])
            else: ok[ti] = False; break
        if ok[ti]: TSn[ti] = row
    # band (kst-1 -> kst) triangles must contain only new-ring + ring kst vertices; drop tris that use only new ring (none expected)
    tris.append(TSn[ok])
    tris.append(remap[I[TRI_RIM[0]:TRI_RIM[1]]])
    T = np.concatenate(tris)
    assert T.min() >= 0
    info = dict(edgeDeg=the_deg, firstKeptRing=kst, firstKeptRingThetaDeg=float(np.degrees(ring_th[kst])),
                removedRings=kst, newRingThetaDeg=the_deg, verts=int(len(out['POSITION'])), tris=int(len(T)),
                shellTrisKept=int(ok.sum()), shellTrisR4=int(len(TS)))
    return out, tg, T.astype(np.uint32), info, prof


def topo_check(P, T, ranges):
    """weld by exact position, count boundary / non-manifold edges and Euler characteristic per component (bmesh)."""
    import bmesh
    key = np.round(P.astype(np.float64), 7); u, inv = np.unique(key, axis=0, return_inverse=True); inv = inv.ravel()
    bm = bmesh.new(); vs = [bm.verts.new(tuple(x)) for x in u]; bm.verts.ensure_lookup_table()
    bad = 0
    for t in inv[T]:
        if len(set(t.tolist())) < 3: bad += 1; continue
        try: bm.faces.new([vs[i] for i in t])
        except ValueError: bad += 1
    bm.verts.index_update(); bm.edges.index_update(); bm.faces.index_update()
    bm.edges.ensure_lookup_table(); bm.faces.ensure_lookup_table()
    res = {}
    # components by face connectivity
    comp = {}
    seen = set(); cid = 0
    for f in bm.faces:
        if f.index in seen: continue
        stack = [f]; seen.add(f.index); faces = []
        while stack:
            x = stack.pop(); faces.append(x)
            for e in x.edges:
                for y in e.link_faces:
                    if y.index not in seen: seen.add(y.index); stack.append(y)
        vset = set(v.index for x in faces for v in x.verts); eset = set(e.index for x in faces for e in x.edges)
        bd = sum(1 for ei in eset if len(bm.edges[ei].link_faces) == 1)
        nm = sum(1 for ei in eset if len(bm.edges[ei].link_faces) > 2)
        minA = min(x.calc_area() for x in faces)
        res[f'comp{cid}'] = dict(faces=len(faces), verts=len(vset), boundaryEdges=bd, nonManifoldEdges=nm,
                                euler=len(vset) - len(eset) + len(faces), minFaceArea=float(minA))
        cid += 1
    res['failedFaces'] = bad
    bm.free()
    return res


def write_glb(path, g, chunks):
    js = json.dumps(g, separators=(',', ':')).encode()
    js += b' ' * ((4 - len(js) % 4) % 4)
    binb = bytes(chunks); binb += b'\0' * ((4 - len(binb) % 4) % 4)
    tot = 12 + 8 + len(js) + 8 + len(binb)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, tot)); f.write(struct.pack('<II', len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack('<II', len(binb), 0x004E4942)); f.write(binb)


def splice(g0, b0, mi, replacements):
    """replacements: {prim_index: (attrs, targets, indices)}. Returns new (gltf json, bin) with compacted buffer."""
    g = json.loads(json.dumps(g0)); b = bytearray(b0)
    new_acc = []
    def add_acc(arr, ctype, typ, minmax=False, target=None):
        raw = np.ascontiguousarray(arr).tobytes()
        while len(b) % 4: b.append(0)
        off = len(b); b.extend(raw)
        bv = {'buffer': 0, 'byteOffset': off, 'byteLength': len(raw)}
        if target: bv['target'] = target
        g['bufferViews'].append(bv)
        a = {'bufferView': len(g['bufferViews']) - 1, 'componentType': ctype, 'count': int(len(arr)), 'type': typ}
        if minmax:
            a['min'] = [float(x) for x in arr.min(0)]; a['max'] = [float(x) for x in arr.max(0)]
        g['accessors'].append(a); return len(g['accessors']) - 1
    TYPES = {1: 'SCALAR', 2: 'VEC2', 3: 'VEC3', 4: 'VEC4'}
    CTYPE = {np.dtype(np.float32): 5126, np.dtype(np.uint8): 5121, np.dtype(np.uint16): 5123, np.dtype(np.uint32): 5125}
    for pi, (attrs, targets, idx) in replacements.items():
        p = g['meshes'][mi]['primitives'][pi]
        for k in list(p['attributes'].keys()):
            arr = attrs[k]
            p['attributes'][k] = add_acc(arr, CTYPE[arr.dtype], TYPES[arr.shape[1]], minmax=(k == 'POSITION'), target=34962)
        for ti, t in enumerate(targets):
            for k in list(p['targets'][ti].keys()):
                arr = t[k]
                p['targets'][ti][k] = add_acc(arr, 5126, 'VEC3', minmax=(k == 'POSITION'), target=34962)
        ct0 = g0['accessors'][g0['meshes'][mi]['primitives'][pi]['indices']]['componentType']
        if ct0 == 5123 and idx.max() < 65535: p['indices'] = add_acc(idx.astype(np.uint16).ravel(), 5123, 'SCALAR', target=34963)
        else: p['indices'] = add_acc(idx.astype(np.uint32).ravel(), 5125, 'SCALAR', target=34963)
    # ---- garbage-collect accessors and bufferViews, rebuild binary compactly
    used_acc = []
    def ua(i):
        if i not in used_acc: used_acc.append(i)
    for m in g['meshes']:
        for p in m['primitives']:
            for v in p['attributes'].values(): ua(v)
            if 'indices' in p: ua(p['indices'])
            for t in p.get('targets', []):
                for v in t.values(): ua(v)
    for s in g.get('skins', []):
        if 'inverseBindMatrices' in s: ua(s['inverseBindMatrices'])
    for an in g.get('animations', []):
        for sm in an['samplers']: ua(sm['input']); ua(sm['output'])
    used_acc.sort(); amap = {o: n for n, o in enumerate(used_acc)}
    used_bv = sorted(set([g['accessors'][i]['bufferView'] for i in used_acc] + [im['bufferView'] for im in g.get('images', []) if 'bufferView' in im]))
    bmap = {o: n for n, o in enumerate(used_bv)}
    nb = bytearray(); nbv = []
    for o in used_bv:
        bv = dict(g['bufferViews'][o]); s0 = bv.get('byteOffset', 0); L = bv['byteLength']
        while len(nb) % 4: nb.append(0)
        bv['byteOffset'] = len(nb); nb.extend(b[s0:s0 + L]); nbv.append(bv)
    while len(nb) % 4: nb.append(0)
    g['bufferViews'] = nbv
    accs = []
    for o in used_acc:
        a = dict(g['accessors'][o]); a['bufferView'] = bmap[a['bufferView']]; accs.append(a)
    g['accessors'] = accs
    for m in g['meshes']:
        for p in m['primitives']:
            p['attributes'] = {k: amap[v] for k, v in p['attributes'].items()}
            if 'indices' in p: p['indices'] = amap[p['indices']]
            p['targets'] = [{k: amap[v] for k, v in t.items()} for t in p.get('targets', [])] if 'targets' in p else None
            if p['targets'] is None: del p['targets']
    for s in g.get('skins', []):
        if 'inverseBindMatrices' in s: s['inverseBindMatrices'] = amap[s['inverseBindMatrices']]
    for an in g.get('animations', []):
        for sm in an['samplers']: sm['input'] = amap[sm['input']]; sm['output'] = amap[sm['output']]
    for im in g.get('images', []):
        if 'bufferView' in im: im['bufferView'] = bmap[im['bufferView']]
    g['buffers'] = [{'byteLength': len(nb)}]
    return g, nb


def main():
    os.makedirs(OUT, exist_ok=True)
    report = {'schema': 'kfb.e2-attach-r1e.build/1', 'method': __doc__ if False else
              'shell rings below theta_e removed + one new ring at theta_e on the unchanged sphere; r4 rim (closed torus) re-placed '
              'vertex by vertex with identical (a_n, a_t, a_phi) offsets in the sphere frame of the new edge point; loft and all '
              'other primitives untouched; glb spliced (no Blender re-export)', 'figures': {}}
    for fig, (glb, rec) in FIGS.items():
        g, b = load(A + glb); pet = json.load(open(A + rec))['pets'][0]
        mi, eyes = eye_setup(g, b, pet)
        fr = report['figures'][fig] = {'r4': glb, 'eyes': [], 'variants': {}}
        per_eye = []
        for e in eyes:
            d = prim_data(g, b, mi, e['prim']); P = d['POSITION'].astype(float); N = d['NORMAL'].astype(float)
            O, Rs, ax = socket_frame(P)
            if ax @ e['gaze'] < 0: ax = -ax
            Rw = e['Rw']
            # r4 edge angle = tube-centre angle of the rim (circle fit in the meridian plane)
            q, z, rho, er, eph, th = sph(P[RIM[0]:RIM[1]], O, ax)
            A_ = np.c_[2 * rho, 2 * z, np.ones(len(rho))]; s2 = np.linalg.lstsq(A_, rho ** 2 + z ** 2, rcond=None)[0]
            tc = s2[:2]; tr = math.sqrt(s2[2] + tc @ tc); th0 = math.atan2(tc[0], tc[1])
            prof, nprof, _, _ = rim_profile(P, N, O, Rs, ax, th0)
            # profile samples around the edge: 16 azimuths x 16 profile points (radial = along sphere normal, axial = along meridian)
            phi = np.degrees(np.arctan2((P[RIM[0]:RIM[1]] - O) @ np.cross(ax, np.cross([0, 1, 0], ax) / np.linalg.norm(np.cross([0, 1, 0], ax))),
                                        (P[RIM[0]:RIM[1]] - O) @ (np.cross([0, 1, 0], ax) / np.linalg.norm(np.cross([0, 1, 0], ax)))))
            samples = []
            for a0 in np.arange(-180, 180, 22.5):
                m = np.abs(((phi - a0 + 180) % 360) - 180) < 1.0
                pr = prof[m] / Rw
                pr = pr[np.argsort(np.arctan2(pr[:, 1], pr[:, 0]))]
                samples.append({'azimuthDeg': float(a0), 'n': int(m.sum()),
                                'radial_R': [round(float(x), 5) for x in pr[:, 0]], 'axial_R': [round(float(x), 5) for x in pr[:, 1]],
                                'azimuthal_R': float(np.abs(pr[:, 2]).max().round(7))})
            dist = np.sqrt(prof[:, 0] ** 2 + prof[:, 1] ** 2) / Rw
            ei = {'side': e['side'], 'anchor': e['anchor'], 'prim': e['prim'],
                  'eyeCentreW': [round(float(x), 6) for x in e['c']], 'R_w': round(Rw, 6),
                  'shellCentreMinusEye_R': [round(float(x), 6) for x in (O - e['c']) / Rw], 'shellRadius_R': round(Rs / Rw, 5),
                  'openingAxis': [round(float(x), 6) for x in ax], 'openingAxisVsGazeDeg': round(math.degrees(math.acos(min(1, ax @ e['gaze']))), 3),
                  'r4EdgeDeg_tubeCentre': round(math.degrees(th0), 4), 'r4InnerLipDeg': round(math.degrees(th0) - math.degrees(tr / Rs), 3),
                  'rimProfile': {'shape': 'closed circle around the edge point (torus tube), normals outward from the tube centre',
                                 'tubeRadius_R': round(tr / Rw, 5), 'tubeCentreOnSphere_R': round((math.hypot(*tc) - Rs) / Rw, 6),
                                 'distFromEdgePoint_R': [round(float(dist.min()), 5), round(float(dist.max()), 5)],
                                 'inwardPart': 'half of the tube lies inside the shell sphere (rolled inward to r = %.4f R)' % ((Rs - tr) / Rw),
                                 'samples': samples}}
            fr['eyes'].append(ei)
            per_eye.append((e, d, O, Rs, ax, th0, prof, Rw))
        # regression: generator at the r4 angle must reproduce r4
        reg = []
        for (e, d, O, Rs, ax, th0, prof, Rw) in per_eye:
            out, tg, T, info, _ = build_variant(d, O, Rs, ax, th0, math.degrees(th0))
            P0 = d['POSITION'].astype(float)
            # compare rim and kept shell positions
            dr = np.abs(out['POSITION'][-(RIM[1] - RIM[0]):] - P0[RIM[0]:RIM[1]]).max() / Rw
            ds = np.abs(out['POSITION'][LOFT[1]:LOFT[1] + NCOL] - P0[SHELL[0]:SHELL[0] + NCOL]).max() / Rw
            reg.append({'side': e['side'], 'rimMaxDev_R': float(dr), 'edgeRingMaxDev_R': float(ds), 'tris': info['tris'], 'trisR4': int(len(d['indices']) // 3)})
        fr['regressionAtR4Angle'] = reg
        fr['r4Topology'] = [topo_check(d['POSITION'], d['indices'].reshape(-1,3), None) for (e, d, O, Rs, ax, th0, prof, Rw) in per_eye]
        for edge in EDGES:
            repl = {}; vinfo = []
            for (e, d, O, Rs, ax, th0, prof, Rw) in per_eye:
                out, tg, T, info, _ = build_variant(d, O, Rs, ax, th0, edge)
                # verify swept profile is identical
                prof2, _, _, _ = rim_profile(out['POSITION'][-(RIM[1] - RIM[0]):].astype(float).repeat(1, 0) if False else
                                             np.concatenate([np.zeros((RIM[0], 3)), out['POSITION'][-(RIM[1] - RIM[0]):].astype(float)]),
                                             np.concatenate([np.zeros((RIM[0], 3)), out['NORMAL'][-(RIM[1] - RIM[0]):].astype(float)]),
                                             O, Rs, ax, math.radians(edge))
                info['rimProfileMaxDev_R'] = float(np.abs(prof2 - prof).max() / Rw)
                Pn = out['POSITION'].astype(float)
                _, _, _, _, _, thn = sph(Pn, O, ax); rn = np.linalg.norm(Pn - O, axis=1)
                shellpart = np.arange(LOFT[1], len(Pn) - (RIM[1] - RIM[0]))
                info['shellRadiusRange_R'] = [round(float(rn[shellpart].min() / Rw), 6), round(float(rn[shellpart].max() / Rw), 6)]
                info['shellMinThetaDeg'] = round(float(np.degrees(thn[shellpart].min())), 4)
                rimpart = np.arange(len(Pn) - (RIM[1] - RIM[0]), len(Pn))
                info['rimThetaRangeDeg'] = [round(float(np.degrees(thn[rimpart].min())), 3), round(float(np.degrees(thn[rimpart].max())), 3)]
                info['rimRadiusRange_R'] = [round(float(rn[rimpart].min() / Rw), 4), round(float(rn[rimpart].max() / Rw), 4)]
                info['innerLipDeg'] = round(edge - math.degrees(0.075 * Rw / Rs) if False else float(np.degrees(thn[rimpart].min())), 3)
                info['topology'] = topo_check(out['POSITION'], T, None)
                info['side'] = e['side']
                vinfo.append(info)
                repl[e['prim']] = (out, tg, T)
            g2, b2 = splice(g, b, mi, repl)
            path = OUT + f'{fig}_edge{edge}.r4e.glb'
            write_glb(path, g2, b2)
            fr['variants'][str(edge)] = {'glb': os.path.relpath(path, BASE), 'bytes': os.path.getsize(path), 'eyes': vinfo}
            print('wrote', path, os.path.getsize(path), flush=True)
    json.dump(report, open(SCR + '/build_report.json', 'w'), indent=1)
    print('BUILD OK', flush=True)


main()
