# RKIT R3 · transition atlas v0.15 (QA_RULEBOOK_TRANSITIONS_R1 §1/§4): one isolated test piece per catalogue entry,
# built ONLY from Track Core v0.15 bodies (out/atlas_v015.streams.json): one lofted body per route (constant outline,
# role per face), kerb stones + 1.6 slabs as the pattern layer, flush paint strips, test ground stitched to the body's
# foot keys (shared vertices), island rock under bridge roots. Three fixed cameras per entry (§4), EEVEE clay look.
# Frames: Track Core (x, y, z) -> Blender (x, -z, y).  Run inside Blender: exec(open(<this>).read()); build_atlas(...)
import bpy, bmesh, json, math, os, random
from mathutils import Vector, Matrix

ROOT = os.path.expanduser('~/Developer/rkit-r3')
STREAMS = f'{ROOT}/trackcore/out/atlas_v015.streams.json'
OUT = f'{ROOT}/evidence/atlas_v015'
KEYS = 9; ARC = 3; PPK = ARC + 1
GROUND = -0.1   # atlas test ground (same as test-v015.mjs ATLAS_GROUND)
ROLES = ['shoulder', 'kerb_face', 'kerb', 'walk', 'parapet_in', 'parapet_top', 'side', 'underside']
ROLE_ID = {r: i for i, r in enumerate(['road'] + ROLES + ['bottom'])}
def to_bl(p): return Vector((p[0], -p[2], p[1]))
def srgb(c): return tuple(x ** 2.2 for x in c)

# ---- J17-informed colours (sRGB); ground-supported vs bridge-supported variant per role
COL = {
    'road': (0.34, 0.38, 0.48), 'marking': (0.95, 0.94, 0.90), 'kerb_stone': (0.97, 0.94, 0.87), 'slab': (0.86, 0.81, 0.72),
    'cut': (0.22, 0.22, 0.24), 'rock': (0.36, 0.20, 0.40), 'turf': (0.24, 0.62, 0.55),
}
FAM_COL = {   # role -> (ground, bridge) per family
    'TOWN': {'shoulder': (0.36, 0.40, 0.50), 'kerb_face': (0.93, 0.90, 0.83), 'kerb': (0.93, 0.90, 0.83), 'walk': (0.88, 0.83, 0.74)},
    'DRIVING_SCHOOL': {'shoulder': (0.36, 0.40, 0.50), 'kerb_face': (0.93, 0.90, 0.83), 'kerb': (0.93, 0.90, 0.83), 'walk': (0.85, 0.82, 0.76)},
    'COUNTRY': {'shoulder': (0.70, 0.64, 0.53), 'kerb_face': (0.70, 0.64, 0.53), 'kerb': (0.70, 0.64, 0.53), 'walk': (0.30, 0.62, 0.40)},
    'MOUNTAIN': {'shoulder': (0.66, 0.61, 0.53), 'kerb_face': (0.66, 0.61, 0.53), 'kerb': (0.66, 0.61, 0.53), 'walk': (0.50, 0.58, 0.44)},
    'HIGHWAY': {'shoulder': (0.38, 0.42, 0.51), 'kerb_face': (0.38, 0.42, 0.51), 'kerb': (0.38, 0.42, 0.51), 'walk': (0.80, 0.77, 0.72)},
}
PAVED = {'TOWN': 1.0, 'DRIVING_SCHOOL': 1.0}
BODY_WALK = {'TOWN': 4.9, 'DRIVING_SCHOOL': 1.7}
BRIDGE_CLAY, BRIDGE_UNDER = (0.86, 0.77, 0.64), (0.80, 0.70, 0.58)
def role_col(role, fam, v):
    if role == 'road': return COL['road']
    if role in ('parapet_in', 'parapet_top'): return BRIDGE_CLAY
    if role in ('side',): return tuple(a + (b - a) * v for a, b in zip(COL['turf'], BRIDGE_CLAY))
    if role in ('underside', 'bottom'): return BRIDGE_UNDER
    if role == 'walk' and fam == 'HIGHWAY': return (0.80, 0.77, 0.72)
    if role == 'walk' and not PAVED.get(fam): return tuple(a + (b - a) * v for a, b in zip(FAM_COL[fam][role], BRIDGE_CLAY))   # no grass on a bridge
    return FAM_COL[fam][role]

def smootherstep(u): u = max(0.0, min(1.0, u)); return u * u * u * (u * (u * 6 - 15) + 10)

# ---- materials
def mat_body():
    m = bpy.data.materials.get('KFB_v015_body')
    if m: return m
    m = bpy.data.materials.new('KFB_v015_body'); m.use_nodes = True; nt = m.node_tree; N, L = nt.nodes, nt.links
    bs = N.get('Principled BSDF'); bs.inputs['Roughness'].default_value = 0.9
    a = N.new('ShaderNodeVertexColor'); a.layer_name = 'colA'
    b = N.new('ShaderNodeVertexColor'); b.layer_name = 'colB'
    w = N.new('ShaderNodeAttribute'); w.attribute_name = 'mixw'; w.attribute_type = 'GEOMETRY'
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.45; nz.inputs['Detail'].default_value = 2.0
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    # Knetflecken: patch threshold = noise; mix = smoothstep(n - .12, n + .12, w)   (patches, never an alpha fade)
    sub = N.new('ShaderNodeMath'); sub.operation = 'SUBTRACT'; L.new(w.outputs['Fac'], sub.inputs[0]); L.new(nz.outputs['Fac'], sub.inputs[1])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = 4.2; L.new(sub.outputs[0], mul.inputs[0])
    add = N.new('ShaderNodeMath'); add.operation = 'ADD'; add.inputs[1].default_value = 0.5; add.use_clamp = True; L.new(mul.outputs[0], add.inputs[0])
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; L.new(add.outputs[0], mix.inputs['Factor']); L.new(a.outputs['Color'], mix.inputs[6]); L.new(b.outputs['Color'], mix.inputs[7])
    L.new(mix.outputs[2], bs.inputs['Base Color'])
    clay_bump(nt, bs, 2.6, 0.18)
    return m
def clay_bump(nt, bs, scale, strength):
    N, L = nt.nodes, nt.links
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = 4.0
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = strength; L.new(nz.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs['Normal'], bs.inputs['Normal'])
def mat_flat(name, c, bump=0.15, rough=0.9):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*srgb(c), 1); bs.inputs['Roughness'].default_value = rough
    m.diffuse_color = (*srgb(c), 1)
    if bump: clay_bump(m.node_tree, bs, 3.0, bump)
    return m

def coll(name, parent=None):
    c = bpy.data.collections.get(name)
    if not c:
        c = bpy.data.collections.new(name); (parent or bpy.context.scene.collection).children.link(c)
    return c
def clear_coll(c):
    for o in list(c.all_objects): bpy.data.objects.remove(o, do_unlink=True)
    for ch in list(c.children): clear_coll(ch); bpy.data.collections.remove(ch)

def world_pt(q, lat, y, dx):
    p, R, U = q['p'], q['R'], q['U']
    return to_bl([p[0] + R[0] * lat + U[0] * y + dx, p[1] + R[1] * lat + U[1] * y, p[2] + R[2] * lat + U[2] * y])

def _span_out(side, k):
    if side == 'R': return ROLES[k] if k < 8 else 'bottom'
    return ROLES[k - 1] if k >= 1 else 'road'
def _span_in(side, k):
    if side == 'R': return ROLES[k - 1] if k >= 1 else 'road'
    return ROLES[k] if k < 8 else 'bottom'
def seg_role(j, n):
    """outline point j -> j+1. R keys 0..8 (points 0..35), then L keys 8..0 (36..71); the closing L0 -> R0 is the road
    top. Inside a key's fillet the first arc segment keeps the incoming span's role, the rest takes the outgoing one."""
    half = KEYS * PPK
    if j < half: side, k, a = 'R', j // PPK, j % PPK
    else: idx = j - half; side, k, a = 'L', KEYS - 1 - idx // PPK, idx % PPK
    if a == ARC: return _span_out(side, k)
    return _span_in(side, k) if a == 0 else _span_out(side, k)

def fam_state(q):
    f = q['body']['fam']
    if isinstance(f, str): return f, f, 0.0
    return f['a'], f['b'], smootherstep(f['u'])

def build_body(E, dx, C):
    S = E['samples']; n = len(S[0]['body']['outline'])
    verts, faces, fa = [], [], []
    for q in S:
        for (lat, y) in q['body']['outline']: verts.append(world_pt(q, lat, y, dx))
    roles = [seg_role(j, n) for j in range(n)]
    colA, colB, mixw = [], [], []
    for i in range(len(S) - 1):
        for j in range(n):
            a, b = i * n + j, i * n + (j + 1) % n
            faces.append((a, b, b + n, a + n)); fa.append(ROLE_ID.get(roles[j], 0))
    me = bpy.data.meshes.new(f"BODY_{E['id']}"); me.from_pydata([tuple(v) for v in verts], [], faces)
    # end caps (Pruefstueck-Schnitt, F1): n-gons in the cut colour
    cap0 = list(range(n))[::-1]; cap1 = [(len(S) - 1) * n + j for j in range(n)]
    me.update()
    bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    for cap in (cap0, cap1):
        try: f = bm.faces.new([bm.verts[k] for k in cap]); f.material_index = 1
        except ValueError: pass
    bm.to_mesh(me); bm.free()
    me.materials.append(mat_body()); me.materials.append(mat_flat('KFB_v015_cut', COL['cut'], bump=0))
    # per-corner colours: A = 'from' state, B = 'to' state, mixw = the active transition weight (family or support)
    ca = me.color_attributes.new('colA', 'FLOAT_COLOR', 'CORNER'); cb = me.color_attributes.new('colB', 'FLOAT_COLOR', 'CORNER')
    mw = me.attributes.new('mixw', 'FLOAT', 'CORNER'); rid = me.attributes.new('kfb_role', 'INT', 'FACE')
    nf = len(faces)
    for pi, poly in enumerate(me.polygons):
        if pi < nf: rid.data[pi].value = fa[pi]
        else: rid.data[pi].value = -1
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index; si, j = divmod(vi, n)
            if pi >= nf:
                ca.data[li].color = (*srgb(COL['cut']), 1); cb.data[li].color = (*srgb(COL['cut']), 1); mw.data[li].value = 0; continue
            q = S[si]; fA, fB, e = fam_state(q); v = q['body']['support']; role = roles[pi % n]
            if fA != fB: A, B, w = role_col(role, fA, v), role_col(role, fB, v), e
            else: A, B, w = role_col(role, fA, 0.0), role_col(role, fA, 1.0), v
            ca.data[li].color = (*srgb(A), 1); cb.data[li].color = (*srgb(B), 1); mw.data[li].value = w
    me.validate(clean_customdata=False); me.update()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(f"BODY_{E['id']}", me); C.objects.link(ob)
    ob['kfb_schema'] = 'kfb.rkit-r3.atlas/0.15'; ob['kfb_entry'] = E['id']; ob['kfb_outline_points'] = n
    mod = ob.modifiers.new('weld', 'WELD'); mod.merge_threshold = 1e-4
    return ob

# ---- pattern layer: rounded boxes merged into one mesh per kind
def rbox_template(seg=2, r=0.06):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.bevel(bm, geom=bm.edges[:] + bm.verts[:], offset=r, segments=seg, affect='EDGES', profile=0.5)
    return bm
def add_box(verts, faces, tmpl, M, size):
    base = len(verts)
    for v in tmpl.verts: verts.append(M @ Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2])))
    for f in tmpl.faces: faces.append([base + v.index for v in f.verts])
def frame_at(q, dx, lat, y, yaw=0.0, along=None):
    R, T, U = Vector(q['R']), Vector(q['T']), Vector(q['U'])
    r, t, u = Vector((R.x, -R.z, R.y)), Vector((T.x, -T.z, T.y)), Vector((U.x, -U.z, U.y))
    if along is not None:   # stones and slabs follow their own line (kerb / slab row), not the route tangent
        t = (along - u * along.dot(u)).normalized(); r = t.cross(u).normalized()
    if yaw: t, r = (t * math.cos(yaw) + r * math.sin(yaw)), (r * math.cos(yaw) - t * math.sin(yaw))
    M = Matrix((r, t, u)).transposed().to_4x4(); M.translation = world_pt(q, lat, y, dx); return M

def line_samples(S, latf, step):
    """walk a lateral line lat = latf(q) (None = absent) and return (sample, frac) every `step` of its own arc length."""
    out, acc, prev, prevq = [], 0.0, None, None
    nxt = 0.0
    for q in S:
        lat = latf(q)
        if lat is None: prev = None; acc = 0; nxt = 0; continue
        P = Vector(world_pt(q, lat, 0, 0))
        if prev is not None:
            d = (P - prev).length
            tdir = (P - prev).normalized() if d > 1e-9 else None
            while nxt <= acc + d:
                out.append((q, lat, tdir)); nxt += step
            acc += d
        prev = P
    return out

def build_patterns(E, dx, C, rng):
    S = E['samples']; tm_k = rbox_template(r=0.06); tm_s = rbox_template(r=0.05)
    kv, kf, sv, sf = [], [], [], []
    stats = {'kerb_stones': 0, 'slabs': 0, 'slab_min_w': None, 'kerb_len': 1.6, 'slab_size': 1.6}
    for sd in ('R', 'L'):
        sgn = 1 if sd == 'R' else -1
        # kerb stones on the kerb band (keys 2..3): 1.6 long, joint 0.05; they sink with the kerb (abtauchen)
        def kerb_lat(q):
            K = q['body']['keys'][sd]; kh = K[2][1]; w = abs(K[3][0] - K[2][0])
            return None if (kh < 0.04 or w < 0.1) else (K[2][0] + K[3][0]) / 2 + sgn * 0.06
        for q, lat, tdir in line_samples(S, kerb_lat, 1.65):
            K = q['body']['keys'][sd]; kh = K[2][1]; fA, fB, e = fam_state(q); paved = PAVED.get(fA, 0) * (1 - e) + PAVED.get(fB, 0) * e
            if fA == 'HIGHWAY' or fB == 'HIGHWAY': paved = 1.0 if kh > 0.04 else 0.0
            if paved < 0.15 or kh < 0.2 or abs(K[4][0] - K[3][0]) < 1.0: continue   # stones only with the walk behind them: never loose bricks
            M = frame_at(q, dx, lat, kh / 2 - 0.02 - (1 - smootherstep(paved)) * 0.25, yaw=rng.uniform(-0.02, 0.02), along=tdir)
            add_box(kv, kf, tm_k, M, (0.45 * rng.uniform(0.97, 1.03), 1.6, kh + 0.06)); stats['kerb_stones'] += 1
        # slabs: three rows of 1.6 x 1.6 in the walk band (keys 3..4), joint 0.06; they sink into the verge where the
        # family stops being paved (abtauchende Segmente) and narrow rows end at a whole slab >= 0.6
        for r in range(3):
            def slab_lat(q, r=r):
                K = q['body']['keys'][sd]; x0 = abs(K[3][0] - (q['body']['keys'][sd][0][0])) ; inner = abs(K[3][0]) + 0.18 + r * 1.66
                avail = abs(K[4][0]) - 0.15 - inner
                if avail < 0.6: return None
                return sgn * (inner + min(1.6, avail) / 2)
            for q, lat, tdir in line_samples(S, slab_lat, 1.66):
                K = q['body']['keys'][sd]; fA, fB, e = fam_state(q); paved = PAVED.get(fA, 0) * (1 - e) + PAVED.get(fB, 0) * e
                inner = abs(K[3][0]) + 0.18 + r * 1.66; w = min(1.6, abs(K[4][0]) - 0.15 - inner)
                if fA != fB:   # inside a family body: one rule for every row -> whole slabs only, all rows dive together
                    if paved < 0.5 or w < 1.6 - 1e-6: continue
                    full = {f: BODY_WALK[f] for f in (fA, fB) if f in BODY_WALK}
                    if (PAVED.get(fA, 0) != PAVED.get(fB, 0)) and abs(K[4][0] - K[3][0]) < max(full.values()) - 0.05: continue   # paved <-> unpaved: the slab field starts / ends with ONE clean edge
                    paved = (paved - 0.5) * 2
                elif paved < 0.02: continue
                top = K[4][1] if abs(K[4][1] - K[3][1]) < 0.5 else K[3][1]
                sink = (1 - smootherstep(paved)) * 0.3
                M = frame_at(q, dx, lat, top + 0.03 - sink + rng.uniform(-0.012, 0.012), yaw=rng.uniform(-0.025, 0.025), along=tdir)
                add_box(sv, sf, tm_s, M, (w * rng.uniform(0.97, 1.0), 1.6 * rng.uniform(0.97, 1.0), 0.14)); stats['slabs'] += 1
                stats['slab_min_w'] = w if stats['slab_min_w'] is None else min(stats['slab_min_w'], w)
    tm_k.free(); tm_s.free()
    obs = []
    slab_mats = [mat_flat(f'KFB_v015_slab{k}', tuple(c * f for c in COL['slab']), bump=0.25) for k, f in enumerate((1.0, 0.95, 1.04, 0.91))]
    for nm, V, F, m in (('KERB', kv, kf, [mat_flat('KFB_v015_kerb_stone', COL['kerb_stone'], bump=0.2)]), ('SLABS', sv, sf, slab_mats)):
        if not V: continue
        me = bpy.data.meshes.new(f"{nm}_{E['id']}"); me.from_pydata([tuple(v) for v in V], [], F)
        for mm in m: me.materials.append(mm)
        if len(m) > 1:   # irregular clay slabs: each slab (one template = len(tm faces)) gets one of four tints
            per = len(F) // max(1, stats['slabs']); rr = random.Random(7)
            for k in range(stats['slabs']):
                mi = rr.randrange(len(m))
                for f in range(k * per, (k + 1) * per): me.polygons[f].material_index = mi
        me.update()
        for p in me.polygons: p.use_smooth = True
        ob = bpy.data.objects.new(f"{nm}_{E['id']}", me); C.objects.link(ob); obs.append(ob)
    return stats

def build_markings(E, dx, C):
    V, F = [], []
    for st in E['strips']:
        pts = st['pts']
        for i, (a, b) in enumerate(pts):
            V.append(to_bl([a[0] + dx, a[1], a[2]])); V.append(to_bl([b[0] + dx, b[1], b[2]]))
            if i: k = len(V) - 4; F.append((k, k + 2, k + 3, k + 1))
    if not V: return None
    me = bpy.data.meshes.new(f"MARK_{E['id']}"); me.from_pydata([tuple(v) for v in V], [], F); me.materials.append(mat_flat('KFB_v015_marking', COL['marking'], bump=0.05)); me.update()
    ob = bpy.data.objects.new(f"MARK_{E['id']}", me); C.objects.link(ob); return ob

def build_ground(E, dx, C):
    """test ground stitched to the body's foot keys (key 7) wherever the support is ground-side; turf runs out flat.
    The first terrain row IS the foot vertex row (shared position), so the seam is closed by construction (T2)."""
    S = E['samples']; zones = [z for z in E['bodies']['zones'] if z['kind'] == 'support']
    mids = sorted((z['s0'] + z['s1']) / 2 for z in zones)
    def ground_side(s):   # on the ground before the first rim mid / after the last
        if not mids: return True
        return s < mids[0] or (len(mids) > 1 and s > mids[-1])
    if mids: return build_islands(E, dx, C, mids, ground_side)
    V, F, rows = [], [], []
    OUTS = [0.0, 0.8, 2.0, 4.0, 7.0, 12.0, 20.0]
    for sd in ('R', 'L'):
        sgn = 1 if sd == 'R' else -1; prev = None
        for q in S:
            if not ground_side(q['s']): prev = None; continue
            K = q['body']['keys'][sd]; fx, fy = K[7]; row = []
            G = GROUND - q['p'][1]                                   # flat test ground in the sample's local height
            if q['body']['support'] > 0.02 or abs(fy - G) > 1e-3:      # root zone: the body dives under the ground; turf starts at its side
                fx = K[6][0] + sgn * 0.35
            for k, o in enumerate(OUTS):
                row.append(len(V)); V.append(world_pt(q, fx + sgn * o, G, dx))
            if prev is not None:
                for k in range(len(OUTS) - 1):
                    a, b, c, d = prev[k], prev[k + 1], row[k + 1], row[k]
                    F.append((a, b, c, d) if sd == 'L' else (a, d, c, b))
            prev = row
    me = bpy.data.meshes.new(f"GROUND_{E['id']}"); me.from_pydata([tuple(v) for v in V], [], F); me.materials.append(mat_flat('KFB_v015_turf', COL['turf'], bump=0.2)); me.update()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(f"GROUND_{E['id']}", me); C.objects.link(ob)
    # island rock under the ground part of a bridge entry: the root body overlaps the rock (grows out of it, gap 0)
    if mids:
        bl = [q for q in S if ground_side(q['s'])]
        for part in ([q for q in bl if q['s'] < mids[0]], [q for q in bl if q['s'] > mids[-1]]):
            if len(part) < 2: continue
            qa, qb = part[0], part[-1]; rim_first = part is not None and part[-1]['s'] < mids[0]
            ext = max(abs(q['body']['keys']['R'][7][0]) for q in part) + 12.0     # = the turf strips' outer edge
            pa, pb = Vector(world_pt(qa, 0, 0, dx)), Vector(world_pt(qb, 0, 0, dx))
            ctr = (pa + pb) / 2; L = (pb - pa).length; top = GROUND
            bpy.ops.mesh.primitive_cube_add(size=1)
            rk = bpy.context.active_object; rk.name = f"ROCK_{E['id']}_{len(C.objects)}"
            for cc in rk.users_collection: cc.objects.unlink(rk)
            C.objects.link(rk)
            H = 10.0; rk.scale = (2 * ext, L, H); rk.location = (ctr.x, ctr.y, top - 0.04 - H / 2)
            bv = rk.modifiers.new('round', 'BEVEL'); bv.width = 1.4; bv.segments = 5; bv.limit_method = 'ANGLE'
            rk.data.materials.append(mat_flat('KFB_v015_rock', COL['rock'], bump=0.3))
            # turf lip around the island top so the strips read as the island's own ground (rounded rim, Lab style)
    return ob

def build_islands(E, dx, C, mids, ground_side):
    """test island under each ground part of a bridge entry: rock body with a rounded rim and a turf cap at GROUND.
    The bridge root (body depth 4.8 at a rim) runs into the island past the rim: it grows out of the rock, gap 0."""
    S = E['samples']; obs = []
    for part in ([q for q in S if q['s'] < mids[0]], [q for q in S if q['s'] > mids[-1]]):
        if len(part) < 2: continue
        rim_q = part[-1] if part[-1]['s'] < mids[0] else part[0]; far_q = part[0] if rim_q is part[-1] else part[-1]
        pr, pf = Vector(world_pt(rim_q, 0, 0, dx)), Vector(world_pt(far_q, 0, 0, dx)); d = (pf - pr); d.z = 0; d.normalize()
        Lx = 46.0; W = 2 * (abs(rim_q['body']['keys']['R'][6][0]) + 22.0)
        ctr = pr + d * (Lx / 2 - 1.5); ctr.z = GROUND
        for nm, h, z0, mat_, bev in (('ROCK', 14.0, GROUND - 0.25 - 7.0, mat_flat('KFB_v015_rock', COL['rock'], bump=0.3), 3.0),
                                     ('TURF', 0.6, GROUND - 0.3, mat_flat('KFB_v015_turf', COL['turf'], bump=0.2), 0.28)):
            bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.name = f"{nm}_{E['id']}_{len(obs)}"
            for cc in o.users_collection: cc.objects.unlink(o)
            C.objects.link(o); o.scale = (W, Lx, h); o.location = (ctr.x, ctr.y, z0 if nm == 'ROCK' else GROUND - 0.3 + 0.0)
            o.rotation_euler = (0, 0, math.atan2(d.y, d.x) - math.pi / 2)
            bv = o.modifiers.new('round', 'BEVEL'); bv.width = bev; bv.segments = 6
            o.data.materials.append(mat_); obs.append(o)
    return obs[0] if obs else None

def entry_cams(E, dx):
    """§4 fixed cameras: 1 oblique overview, 2 figure eye height (1 H) from the walk along the transition, 3 low across
    the seam (curve inner side / bridge root from below)."""
    S = E['samples']; zs = E['bodies']['zones']
    if zs: z0, z1 = min(z['s0'] for z in zs), max(z['s1'] for z in zs)
    else: z0, z1 = S[len(S) // 3]['s'], S[2 * len(S) // 3]['s']
    near = lambda s: min(S, key=lambda q: abs(q['s'] - s))
    c = near((z0 + z1) / 2); a = near(z0 - 8); b = near(z1 + 8)
    T, R = Vector(c['T']), Vector(c['R']); Tb, Rb = Vector((T.x, -T.z, T.y)), Vector((R.x, -R.z, R.y)); Zb = Vector((0, 0, 1))
    tgt = Vector(world_pt(c, 0, 0, dx)); span = max(20.0, z1 - z0)
    cam1 = (tgt - Tb * (0.9 * span + 10) - Rb * (0.55 * span + 10) + Zb * (0.45 * span + 9), tgt, 30)
    KR = a['body']['keys']['R']; walk = (KR[3][0] + KR[4][0]) / 2 if abs(KR[4][0] - KR[3][0]) > 1 else KR[4][0] + 1.0
    eye = Vector(world_pt(a, walk, max(KR[4][1], 0) + 3.64 * 0.92, dx)); look = Vector(world_pt(b, walk * 0.55, 0.8, dx))
    cam2 = (eye, look, 24)
    if E['id'] == 'A4':   # curve inner side: the turn is to the right -> inner side is R
        cq = near((S[0]['s'] + S[-1]['s']) / 2); f = cq['body']['keys']['R'][7]
        pos = Vector(world_pt(cq, f[0] + 9, f[1] + 0.7, dx)); cam3 = (pos, Vector(world_pt(cq, cq['body']['keys']['R'][4][0], 0.2, dx)), 24)
    elif any(z['kind'] == 'support' for z in zs):
        zz = [z for z in zs if z['kind'] == 'support'][0]; rq = near((zz['s0'] + zz['s1']) / 2 + 6); f = rq['body']['keys']['R']
        pos = Vector(world_pt(rq, f[6][0] + 14, -9.0, dx)); cam3 = (pos, Vector(world_pt(near((zz['s0'] + zz['s1']) / 2), f[6][0], -2.0, dx)), 24)
    else:
        f = c['body']['keys']['R'][7]; pos = Vector(world_pt(c, f[0] + 5.5, f[1] + 2.6, dx)) - Tb * 8
        cam3 = (pos, Vector(world_pt(c, c['body']['keys']['R'][3][0], 0.3, dx)) + Tb * 5, 24)
    return [cam1, cam2, cam3]

def setup_eevee(res=(1280, 720)):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'; sc.render.film_transparent = False
    try: sc.eevee.taa_render_samples = 24
    except Exception: pass
    w = sc.world or bpy.data.worlds.new('World'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes.get('Background'); bg.inputs['Color'].default_value = (*srgb((0.62, 0.78, 0.92)), 1); bg.inputs['Strength'].default_value = 0.65
    sun = bpy.data.objects.get('RKIT_SUN')
    if not sun:
        sun = bpy.data.objects.new('RKIT_SUN', bpy.data.lights.new('RKIT_SUN', 'SUN')); sc.collection.objects.link(sun)
    fill = bpy.data.objects.get('RKIT_FILL')
    if not fill:
        fill = bpy.data.objects.new('RKIT_FILL', bpy.data.lights.new('RKIT_FILL', 'SUN')); sc.collection.objects.link(fill)
    fill.data.energy = 2.2; fill.data.use_shadow = False; fill.rotation_euler = (math.radians(200), 0, math.radians(-30))
    sun.data.energy = 4.6; sun.data.angle = math.radians(6); sun.rotation_euler = (math.radians(48), math.radians(10), math.radians(140))
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    return sc

def render_cam(path, pos, tgt, lens, only):
    sc = bpy.context.scene
    cam = bpy.data.objects.get('RKIT_ATLAS_CAM')
    if not cam: cam = bpy.data.objects.new('RKIT_ATLAS_CAM', bpy.data.cameras.new('RKIT_ATLAS_CAM')); sc.collection.objects.link(cam)
    cam.data.lens = lens; cam.data.clip_start = 0.1; cam.data.clip_end = 3000
    cam.location = pos; cam.rotation_euler = (tgt - pos).to_track_quat('-Z', 'Y').to_euler(); sc.camera = cam
    keep = set(bpy.data.collections[only].all_objects) | {cam, bpy.data.objects.get('RKIT_SUN'), bpy.data.objects.get('RKIT_FILL')}
    was = {o.name: o.hide_render for o in sc.objects}
    for o in sc.objects: o.hide_render = o not in keep
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    for o in sc.objects: o.hide_render = was.get(o.name, False)
    return path

def build_atlas(ids=None, render=True, spacing=140.0):
    D = json.load(open(STREAMS)); root = coll('RKIT_ATLAS_V015'); clear_coll(root)
    os.makedirs(OUT, exist_ok=True); setup_eevee(); rng = random.Random(20261008)
    for o in [o for o in bpy.data.collections.get('RKIT_R3_A1B', root).all_objects] if bpy.data.collections.get('RKIT_R3_A1B') else []: o.hide_render = True
    report = {}
    for i, (k, E) in enumerate(D.items()):
        if ids and k not in ids: continue
        dx = i * spacing; C = coll(f'ATLAS_{k}', root)
        body = build_body(E, dx, C); st = build_patterns(E, dx, C, rng); build_markings(E, dx, C); build_ground(E, dx, C)
        report[k] = {'name': E['name'], 'outline_points': body['kfb_outline_points'], 'samples': len(E['samples']), **st, 'zones': E['bodies']['zones']}
        if render:
            report[k]['shots'] = [render_cam(f'{OUT}/{k}_cam{j + 1}.png', p, t, l, f'ATLAS_{k}') for j, (p, t, l) in enumerate(entry_cams(E, dx))]
    json.dump(report, open(f'{OUT}/atlas_build.json', 'w'), indent=1)
    return report


# ---------------------------------------------------------------- QA R1 measurements (T1..T12) and image pairs (§1, §4)
REFS = {   # left image of each pair: Joyride J17 (look reference) or a KFB reference picture
    'A1': 'KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-straight.jpg',
    'A4': 'KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-curve.jpg',
    'B1': 'KFB World Design Setup Claymation Test/JOYRIDE_SESSION_2026-09-29/evidence/j10-strasse.jpg',
    'B2': 'KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/pictures/hop-out-2.jpg',
    'B3': 'KFB World Design Setup Claymation Test/JOYRIDE_SESSION_2026-09-29/evidence/j10-strasse.jpg',
    'B5': 'KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/pictures/chase-loop-a.jpg',
    'C1': 'KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp', 'C1H': 'KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp',
    'C1L': 'KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp', 'C2': 'KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp',
}
def _img_px(path, w, h):
    import numpy as np
    img = bpy.data.images.load(path, check_existing=False); sw, sh = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(sh, sw, 4); bpy.data.images.remove(img)
    # fit (cover) into w x h, nearest sampling
    sc = max(w / sw, h / sh); ys = (np.arange(h) / sc + (sh - h / sc) / 2).astype(int).clip(0, sh - 1); xs = (np.arange(w) / sc + (sw - w / sc) / 2).astype(int).clip(0, sw - 1)
    return px[ys][:, xs]
def make_pairs(ids=None, w=960, h=540, pad=10):
    import numpy as np
    D = json.load(open(STREAMS)); base = os.path.expanduser('~/Dropbox/CLAUDE/'); out = []
    for k in D:
        if ids and k not in ids: continue
        ref = _img_px(base + REFS[k], w, h)
        for j in (1, 2, 3):
            right = _img_px(f'{OUT}/{k}_cam{j}.png', w, h)
            sheet = np.ones((h + 2 * pad, 2 * w + 3 * pad, 4), dtype=np.float32); sheet[..., :3] = 0.93
            sheet[pad:pad + h, pad:pad + w] = ref; sheet[pad:pad + h, 2 * pad + w:2 * pad + 2 * w] = right
            im = bpy.data.images.new('pair', sheet.shape[1], sheet.shape[0], alpha=True); im.pixels[:] = sheet.ravel()
            fp = f'{OUT}/pair_{k}_cam{j}.png'; im.filepath_raw = fp; im.file_format = 'PNG'; im.save(); bpy.data.images.remove(im); out.append(fp)
    return out

def measure(ids=None):
    """hard rules per entry, measured on the built atlas geometry (no self-judgement; numbers only)."""
    from mathutils.bvhtree import BVHTree
    D = json.load(open(STREAMS)); dg = bpy.context.evaluated_depsgraph_get(); res = {}
    keys = list(D.keys())
    for k, E in D.items():
        if ids and k not in ids: continue
        dx = keys.index(k) * 140.0; C = bpy.data.collections[f'ATLAS_{k}']
        terr = [o for o in C.objects if o.name.startswith(('GROUND_', 'TURF_', 'ROCK_'))]
        trees = [BVHTree.FromObject(o, dg) for o in terr]
        # T1: terrain above the road / kerb / walk surface (top keys 0..6, both sides, every sample)
        above, worst, inner = 0, 0.0, 0
        for q in E['samples']:
            for sd in ('L', 'R'):
                K = q['body']['keys'][sd]
                for i in range(6):
                    for t in (0.0, 0.5):
                        lat = K[i][0] + (K[i + 1][0] - K[i][0]) * t; y = K[i][1] + (K[i + 1][1] - K[i][1]) * t
                        P = Vector(world_pt(q, lat, y, dx))
                        for tr in trees:
                            hit = tr.ray_cast(P + Vector((0, 0, 60)), Vector((0, 0, -1)), 60 - 1e-3)
                            if hit[0] is not None and hit[0].z > P.z + 1e-3: above += 1; worst = max(worst, hit[0].z - P.z)
        # T2: toe keys vs first turf row (shared positions on strip entries)
        g = bpy.data.objects.get(f'GROUND_{k}'); gap = None
        if g and len(g.data.vertices):
            kd = __import__('mathutils').kdtree.KDTree(len(g.data.vertices))
            for v in g.data.vertices: kd.insert(g.matrix_world @ v.co, v.index)
            kd.balance(); gap = 0.0
            for q in E['samples']:
                if q['body']['support'] > 0.02: continue
                for sd in ('L', 'R'):
                    f = q['body']['keys'][sd][7]; _, _, d = kd.find(Vector(world_pt(q, f[0], f[1], dx))); gap = max(gap, d)
        # T5: face role attribute == outline role; no green on kerb / wall faces
        ob = bpy.data.objects[f'BODY_{k}']; me = ob.data; n = ob['kfb_outline_points']; rid = me.attributes['kfb_role']
        roles = [seg_role(j, n) for j in range(n)]; bad_role = 0; green = 0; ca = me.color_attributes['colA']; cb = me.color_attributes['colB']
        for pi, poly in enumerate(me.polygons):
            if rid.data[pi].value < 0: continue
            if rid.data[pi].value != ROLE_ID[roles[pi % n]]: bad_role += 1
            if roles[pi % n] in ('kerb', 'kerb_face', 'parapet_in', 'parapet_top'):
                for li in poly.loop_indices:
                    for c in (ca.data[li].color, cb.data[li].color):
                        if c[1] > c[0] + 0.05 and c[1] > c[2]: green += 1; break
        # T7 / T8 / T10 from the stream
        S = E['samples']; k0 = S[0]['body']['keys']['R']; k1 = S[-1]['body']['keys']['R']
        prof = lambda K: {'kerb_h': round(K[2][1], 3), 'walk_w': round(K[4][0] - K[3][0], 3), 'wall_h': round(K[5][1] - K[4][1], 3) if K[5][1] - K[4][1] > 0.01 else 0, 'overall': round(2 * K[6][0] - 0, 3)}
        bank = max(abs(math.degrees(math.asin(max(-1, min(1, q['R'][1]))))) for q in S)
        sup = [z for z in E['bodies']['zones'] if z['kind'] == 'support']
        br = {}
        if sup:
            ys = [q['p'][1] for q in S]; br = {'crest_apex': round(max(ys) - ys[0], 3), 'grade_max_pct': round(100 * max(abs(S[i + 1]['p'][1] - S[i]['p'][1]) / max(1e-9, S[i + 1]['s'] - S[i]['s']) for i in range(len(S) - 1)), 2),
                  'depth_root': max(q['body']['depth'] for q in S if q['body']['support'] > 0), 'depth_mid': S[len(S) // 2]['body']['depth'], 'piers': 0,
                  'root_into_island': 'Ueberlappung (Atlas-Testinsel); echte Naht = Lab kfb.road-bed/1'}
        cg = E['cologne']
        res[k] = {'name': E['name'], 'T1_terrain_above_road': above, 'T1_worst': round(worst, 4), 'T2_toe_gap_max': None if gap is None else round(gap, 6),
                  'T3_zones': [f"{z['id']} {z['kind']} {z['s0']}..{z['s1']}" for z in E['bodies']['zones']], 'T4_ease': 'smootherstep (C2), ein Verlauf fuer alle Stuetzpunkte',
                  'T5_role_mismatch': bad_role, 'T5_green_on_kerb_or_wall': green, 'T7_start': prof(k0), 'T7_end': prof(k1),
                  'T8_bank_max_deg': round(bank, 3), 'T8_inner_raised': cg['innerRaised'], 'T8_wave_flips': sum(w['flips'] for w in cg['waves'].values()), 'T10': br}
    json.dump(res, open(f'{OUT}/atlas_measure.json', 'w'), indent=1)
    return res
