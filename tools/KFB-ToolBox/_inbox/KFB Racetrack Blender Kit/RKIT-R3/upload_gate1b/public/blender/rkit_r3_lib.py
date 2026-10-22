# KFB Racetrack Construction Kit R3 · Blender construction oracle (consumer of Track Core v0.13 output; never re-solves)
#
# Input  : Track Core export JSON (profiles.v013.json, a1.graph.json) written by assemblies/export_blender.mjs.
# Output : role-separated meshes (road / gutter / kerb / sidewalk / verge / underside / deck ...), marking strips,
#          junction plate + kerb runs, socket empties (Track Core frame in custom props), non-sweepable parts.
# Frames : Track Core runtime = right-handed metres, +Y up, heading 0 -> +Z.  Blender = Z up:  bl(x, y, z) = (x, -z, y).
#          glTF export with +Y up maps it back exactly, so GLB coordinates == Track Core coordinates.
# Colour : placeholder clay palette per ROLE (not the KFB Clay Goldens; the Clay/Surface owner swaps materials by role).
import bpy, bmesh, json, math, hashlib
from mathutils import Vector, Matrix

CORE_SCHEMA = 'kfb.rkit-r3.blender/0.1'
SPAN_KEYS = ['underside_side', 'barrier_out', 'barrier_cap', 'barrier_side', 'shoulder', 'shoulder', 'road',
             'shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_out', 'underside_side', 'underside']
PALETTE = {  # placeholder clay tones by material role (sRGB 0..1)
    'road': (0.36, 0.39, 0.43), 'gutter': (0.50, 0.51, 0.52), 'kerb': (0.86, 0.83, 0.77), 'sidewalk': (0.80, 0.75, 0.67),
    'sidewalk_edge': (0.70, 0.64, 0.56), 'foundation': (0.55, 0.50, 0.46), 'apron': (0.78, 0.74, 0.68), 'apron_edge': (0.66, 0.62, 0.56),
    'gravel': (0.73, 0.65, 0.53), 'verge_lip': (0.50, 0.62, 0.32), 'verge': (0.56, 0.70, 0.35), 'ditch': (0.45, 0.55, 0.28),
    'embankment': (0.55, 0.47, 0.36), 'guardrail_strip': (0.52, 0.64, 0.33), 'rock_cut': (0.58, 0.54, 0.50), 'retaining': (0.62, 0.58, 0.54),
    'hard_shoulder': (0.44, 0.46, 0.49), 'barrier_side': (0.71, 0.72, 0.72), 'barrier_cap': (0.92, 0.90, 0.86), 'deck_box': (0.66, 0.64, 0.62),
    'underside': (0.67, 0.47, 0.40), 'shoulder': (0.85, 0.58, 0.42), 'deck': (0.70, 0.66, 0.62), 'parapet': (0.88, 0.85, 0.80),
    'marking': (0.96, 0.95, 0.91), 'marking_stop': (0.97, 0.96, 0.93), 'plate': (0.36, 0.39, 0.43), 'island_fill': (0.56, 0.70, 0.35),
    'signal_mast': (0.30, 0.33, 0.38), 'signal_head': (0.16, 0.17, 0.19), 'lamp_red': (0.90, 0.18, 0.14), 'lamp_amber': (0.98, 0.70, 0.12),
    'lamp_green': (0.20, 0.80, 0.35), 'abutment': (0.72, 0.68, 0.62), 'abutment_cornice': (0.84, 0.80, 0.74), 'bollard': (0.95, 0.93, 0.88),
    'bollard_band': (0.85, 0.22, 0.18), 'socket': (1.0, 0.2, 0.8),
}

def to_bl(p): return Vector((p[0], -p[2], p[1]))
def dir_bl(v): return Vector((v[0], -v[2], v[1]))

def mat(role):
    name = f'KFB_{role}'
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    c = PALETTE.get(role, (0.8, 0.0, 0.8))
    bsdf.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1.0)
    bsdf.inputs['Roughness'].default_value = 0.85
    m.diffuse_color = (*[x ** 2.2 for x in c], 1.0)
    m['kfb_role'] = role
    return m

def coll(name, parent=None):
    c = bpy.data.collections.get(name)
    if not c:
        c = bpy.data.collections.new(name)
        (parent or bpy.context.scene.collection).children.link(c)
    return c

def clear_coll(c):
    for o in list(c.all_objects): bpy.data.objects.remove(o, do_unlink=True)
    for ch in list(c.children): clear_coll(ch); bpy.data.collections.remove(ch)

def mesh_obj(name, verts, faces, mats, face_mat, collection, props=None, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    for m in mats: me.materials.append(m)
    if face_mat is not None:
        for poly, mi in zip(me.polygons, face_mat): poly.material_index = mi
    me.validate(clean_customdata=False)
    me.update()
    ob = bpy.data.objects.new(name, me)
    collection.objects.link(ob)
    for k, v in (props or {}).items(): ob[k] = v
    if smooth:
        for poly in me.polygons: poly.use_smooth = False
    return ob

def fix_normals(ob, inside_out=False, clean=True):
    bm = bmesh.new(); bm.from_mesh(ob.data)
    if clean:   # profile slots may coincide (zero kerb gap etc.): weld them and drop the zero-area spans
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
        bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=1e-5)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_edges], context='VERTS')
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if inside_out: bmesh.ops.reverse_faces(bm, faces=bm.faces)
    bm.to_mesh(ob.data); bm.free(); ob.data.update()

def frame_matrix(p, T, U):
    """Object matrix whose local +Y = T (driving direction), +Z = U (road up), +X = R (driver's right)."""
    t, u = dir_bl(T).normalized(), dir_bl(U).normalized()
    r = t.cross(u).normalized()  # T x U in Blender handedness == Track Core R mapped (checked in tests)
    M = Matrix((r, t, u)).transposed().to_4x4()
    M.translation = to_bl(p)
    return M

def socket_empty(name, p, T, U, collection, props):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = 'ARROWS'; e.empty_display_size = 3.0
    e.matrix_world = frame_matrix(p, T, U)
    collection.objects.link(e)
    for k, v in props.items(): e[k] = v
    return e

def roles_for(profiles, fam):
    for pr in profiles['profiles']:
        if pr['family'] == fam: return pr['roles']
    return profiles['profiles'][0]['roles']

def span_role(fam_roles, key, bridge):
    if key in ('underside', 'underside_side'):
        return 'deck' if bridge else fam_roles.get('underside', 'underside')
    if key == 'barrier_out': return fam_roles.get('barrier_out', 'barrier_side')
    return fam_roles.get(key, key)

# ---------------------------------------------------------------- route sweep (14 slots, role per span, family per sample)
def build_route(route, rid, profiles, collection, cap_start=True, cap_end=True):
    S = route['samples']; n = len(S); verts = []; faces = []; fmat = []; roles = []
    def rix(role):
        if role not in roles: roles.append(role)
        return roles.index(role)
    for q in S:
        P, R, U = Vector(q['p']), Vector(q['R']), Vector(q['U'])
        for lat, lift in q['slots']: verts.append(to_bl(P + R * lat + U * lift))
    for i in range(n - 1):
        q = S[i]; fr = roles_for(profiles, q.get('family') or 'RACE'); bridge = 'bridge' in q['tags']
        if q['prm'].get('surface', 1) < 0.5: continue
        for k in range(14):
            k2 = (k + 1) % 14
            a, b, c, d = i * 14 + k, i * 14 + k2, (i + 1) * 14 + k2, (i + 1) * 14 + k
            faces.append((a, b, c, d)); fmat.append(rix(span_role(fr, SPAN_KEYS[k], bridge)))
    if cap_start: faces.append(tuple(range(13, -1, -1))); fmat.append(rix('foundation' if 'bridge' not in S[0]['tags'] else 'deck'))
    if cap_end: faces.append(tuple((n - 1) * 14 + k for k in range(14))); fmat.append(rix('foundation' if 'bridge' not in S[-1]['tags'] else 'deck'))
    ob = mesh_obj(f'RKIT_route_{rid}', verts, faces, [mat(r) for r in roles], fmat, collection,
                  {'kfb_kind': 'route_body', 'route': rid, 'fingerprint': route.get('fingerprint', ''), 'core': route.get('core', ''),
                   'samples': n, 'length_m': round(S[-1]['s'] - S[0]['s'], 3), 'schema': CORE_SCHEMA})
    fix_normals(ob)
    return ob

def build_route_markings(route, rid, collection):
    verts = []; faces = []
    for st in route.get('markingStrips', []):
        base = len(verts)
        for l, r in st['pts']: verts += [to_bl(l), to_bl(r)]
        for i in range(len(st['pts']) - 1):
            if (Vector(st['pts'][i + 1][0]) - Vector(st['pts'][i][0])).length < 1e-6: continue   # duplicate sample at a module break
            a = base + 2 * i; faces.append((a, a + 1, a + 3, a + 2))
    if not faces: return None
    ob = mesh_obj(f'RKIT_markings_{rid}', verts, faces, [mat('marking')], None, collection, {'kfb_kind': 'markings', 'route': rid, 'strips': len(route.get('markingStrips', []))})
    for poly in ob.data.polygons:
        if poly.normal.z < 0: poly.flip()
    ob.data.update()
    return ob

def build_parapets(route, rid, collection, h=1.3, t=0.28):   # K2: wall / guard rail ~0.35 H = 1.3
    """Bridge parapet: a chunky low wall on the outer sidewalk / verge edge where the stream says 'bridge'."""
    S = route['samples']; verts = []; faces = []
    for side, slot in ((-1, 2), (1, 11)):
        run = [q for q in S if 'bridge' in q['tags']]
        if len(run) < 2: continue
        base = len(verts)
        for q in run:
            P, R, U = Vector(q['p']), Vector(q['R']), Vector(q['U'])
            lat, lift = q['slots'][slot]
            o = P + R * lat + U * lift
            inw = -side
            ring = [o, o + R * (inw * t), o + R * (inw * t) + U * h, o + U * h]
            verts += [to_bl(v) for v in ring]
        for i in range(len(run) - 1):
            for k in range(4):
                a, b = base + i * 4 + k, base + i * 4 + (k + 1) % 4
                faces.append((a, b, b + 4, a + 4))
        faces.append(tuple(base + k for k in range(4))); e = base + (len(run) - 1) * 4; faces.append(tuple(e + k for k in range(3, -1, -1)))
    if not faces: return None
    ob = mesh_obj(f'RKIT_parapet_{rid}', verts, faces, [mat('parapet')], None, collection, {'kfb_kind': 'parapet', 'route': rid, 'height_m': h})
    fix_normals(ob)
    return ob

# ---------------------------------------------------------------- junction node (plate + kerb runs + strokes + sockets)
def build_junction(node, profiles, collection, parts):
    y = node['y']; objs = []
    # plate: fan rows [centre, rim_i] -> top + bottom + nothing else (kerb runs close the sides)
    deck = node['deck']['zones'][0]['depth']
    rows = node['deck']['zones'][0]['rows']; rim = [r[1] for r in rows]
    c = rows[0][0]; verts = [to_bl(c)] + [to_bl(p) for p in rim]
    m = len(rim); faces = [(0, 1 + i, 1 + (i + 1) % m) for i in range(m - 1)]
    cb = len(verts); verts += [to_bl([c[0], y - deck, c[2]])] + [to_bl([p[0], y - deck, p[2]]) for p in rim]
    faces += [(cb, cb + 1 + (i + 1) % m, cb + 1 + i) for i in range(m - 1)]
    ob = mesh_obj(f"RKIT_junction_{node['id']}_plate", verts, faces, [mat('plate')], None, collection, {'kfb_kind': 'junction_plate', 'node': node['id'], 'core_kind': node['kind']})
    for poly in ob.data.polygons:
        if poly.center.z > to_bl([0, y - deck / 2, 0]).z and poly.normal.z < 0: poly.flip()
        elif poly.center.z < to_bl([0, y - deck / 2, 0]).z and poly.normal.z > 0: poly.flip()
    ob.data.update(); objs.append(ob)
    # kerb runs: sweep the node's side section along every outer run (normal N points away from the road)
    fam = None
    for a in node['arms']: fam = a.get('family') or fam
    fr = roles_for(profiles, fam or 'TOWN')
    sec = node['section']; ns = len(sec)
    sec_keys = ['shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_out', 'underside_side', 'underside']
    for kb in node['kerbs']:
        verts = []; faces = []; fmat = []; roles = []
        def rix(role):
            if role not in roles: roles.append(role)
            return roles.index(role)
        for p, N in zip(kb['pts'], kb['N']):
            P, Nv = Vector(p), Vector(N)
            for out, up in sec: verts.append(to_bl(P + Nv * out + Vector((0, 1, 0)) * up))
        L = len(kb['pts'])
        for i in range(L - 1):
            for k in range(ns):
                k2 = (k + 1) % ns
                faces.append((i * ns + k, i * ns + k2, (i + 1) * ns + k2, (i + 1) * ns + k)); fmat.append(rix(span_role(fr, sec_keys[min(k, len(sec_keys) - 1)], False)))
        faces.append(tuple(range(ns - 1, -1, -1))); fmat.append(rix(fr.get('barrier_out', 'barrier_side')))
        faces.append(tuple((L - 1) * ns + k for k in range(ns))); fmat.append(rix(fr.get('barrier_out', 'barrier_side')))
        ok = mesh_obj(f"RKIT_kerb_{kb['id']}", verts, faces, [mat(r) for r in roles], fmat, collection, {'kfb_kind': 'kerb_run', 'node': node['id'], 'from_arm': kb['from'], 'to_arm': kb['to'], 'corner': kb.get('corner', '')})
        fix_normals(ok); objs.append(ok)
    # strokes: stop lines, zebras (polyline + width), lifted 3 cm
    verts = []; faces = []; fm = []
    for mk in node['markings']:
        pts = [Vector(p) for p in mk['pts']]; w = mk['w']
        for i in range(len(pts) - 1):
            d = (pts[i + 1] - pts[i]); d.y = 0
            if d.length < 1e-6: continue
            side = Vector((-d.z, 0, d.x)).normalized() * (w / 2); lift = Vector((0, 0.03, 0))
            b = len(verts); verts += [to_bl(pts[i] - side + lift), to_bl(pts[i] + side + lift), to_bl(pts[i + 1] + side + lift), to_bl(pts[i + 1] - side + lift)]
            faces.append((b, b + 1, b + 2, b + 3)); fm.append(0 if mk['kind'] != 'stop' else 1)
    if faces:
        om = mesh_obj(f"RKIT_junction_{node['id']}_markings", verts, faces, [mat('marking'), mat('marking_stop')], fm, collection, {'kfb_kind': 'junction_markings', 'node': node['id'], 'strokes': len(node['markings'])})
        for poly in om.data.polygons:
            if poly.normal.z < 0: poly.flip()
        om.data.update(); objs.append(om)
    # sockets + furniture (parts placed on Track Core anchors)
    for a in node['arms']:
        s = a['socket']; socket_empty(f"SOCKET_{node['id']}_{a['id']}", s['p'], s['T'], s['U'], collection,
            {'kfb_kind': 'socket', 'node': node['id'], 'arm': a['id'], 'family': a.get('family') or '', 'width_m': a['width'], 'track_core_T': s['T'], 'track_core_U': s['U'], 'track_core_R': s['R'], 'track_core_p': s['p']})
    for f in node['deck']['furniture']:
        T = Vector(f['T']); face = [-T.x, 0, -T.z]
        src = parts.get('signal' if f['kind'] == 'signal' else 'sign')
        if src is None: continue
        inst = src.copy(); inst.data = src.data; collection.objects.link(inst)
        inst.matrix_world = frame_matrix(f['p'], face, [0, 1, 0])
        inst.name = f"RKIT_{f['kind']}_{node['id']}_{f['arm']}"; inst['kfb_kind'] = 'furniture'; inst['anchor_role'] = f['role']; inst['arm'] = f['arm']
        objs.append(inst)
    return objs

# ---------------------------------------------------------------- non-sweepable parts (profile-driven, own local frame)
# Local part frame = socket frame: origin on the road centre line at the road surface, +Y = T (into the part), +Z = U, +X = R.
def _box(cx, cy, cz, sx, sy, sz):
    v = [Vector((cx + dx * sx / 2, cy + dy * sy / 2, cz + dz * sz / 2)) for dz in (-1, 1) for dy in (-1, 1) for dx in (-1, 1)]
    f = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
    return v, f

def _cyl(cx, cy, z0, z1, r, n=12):
    v = [Vector((cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n), z)) for z in (z0, z1) for i in range(n)]
    f = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
    return v, f

def _assemble(name, pieces, collection, props):
    verts = []; faces = []; fm = []; roles = []
    for role, (v, f) in pieces:
        if role not in roles: roles.append(role)
        b = len(verts); verts += v; faces += [tuple(b + i for i in ff) for ff in f]; fm += [roles.index(role)] * len(f)
    ob = mesh_obj(name, verts, faces, [mat(r) for r in roles], fm, collection, props)
    fix_normals(ob)
    return ob

def _cylY(cx, y0, y1, cz, r, n=12):
    v = [Vector((cx + r * math.cos(2 * math.pi * i / n), y, cz + r * math.sin(2 * math.pi * i / n))) for y in (y0, y1) for i in range(n)]
    f = [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)] + [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))]
    return v, f

def part_signal(collection):
    """Traffic signal mast (KFB chunky). Anchor frame: foot at origin on the sidewalk, +Y faces the approaching drivers,
    +X points over the road (the mast arm reaches 3.8 m over the inbound lanes), +Z up."""
    P = [('signal_mast', _cyl(0, 0, 0, 5.6, 0.16, 14)), ('signal_mast', _box(1.9, 0, 5.45, 3.8, 0.22, 0.22)),
         ('signal_mast', _box(0, 0, 0.12, 0.7, 0.7, 0.24)),
         ('signal_head', _box(3.2, 0.0, 4.55, 0.62, 0.5, 1.75)), ('signal_head', _box(0, 0.12, 2.6, 0.5, 0.4, 1.4))]
    for role, z in (('lamp_red', 5.1), ('lamp_amber', 4.55), ('lamp_green', 4.0)):
        P.append((role, _cylY(3.2, 0.25, 0.36, z, 0.2)))
        P.append((role, _cylY(0, 0.32, 0.4, z - 2.0 + 0.1, 0.14)))
    return _assemble('PART_signal_mast', P, collection, {'kfb_kind': 'part', 'part': 'signal_mast', 'sockets': 'foot@origin (+Y faces drivers, +X over the road)', 'height_m': 5.6, 'reach_m': 3.8})

def part_sign_giveway(collection):
    P = [('signal_mast', _cyl(0, 0, 0, 2.6, 0.07, 10)), ('bollard', _box(0, 0.09, 2.45, 1.0, 0.06, 0.9)), ('bollard_band', _box(0, 0.12, 2.45, 0.8, 0.02, 0.7))]
    return _assemble('PART_sign_giveway', P, collection, {'kfb_kind': 'part', 'part': 'sign_giveway', 'height_m': 2.9})

def part_end_cap(prof, collection, name='PART_end_cap_TOWN'):
    """Dead-end cap for a lane road: half-disc road plate (radius = road half width) + the family side section swept around
    it + 3 bollards on the sidewalk. Entry socket = local origin, frame of the arriving road end (+Y into the cap)."""
    h = prof['prm']['width'] / 2; deck = prof['prm']['deckDepth']; sec = prof['sideSection']; n = 32; ns = len(sec)
    verts = [Vector((0, 0, 0))]; faces = []
    arc = [(math.cos(math.pi * i / n), math.sin(math.pi * i / n)) for i in range(n + 1)]   # +X (right edge) round to -X
    for cx, cy in arc: verts.append(Vector((h * cx, h * cy, 0)))
    faces += [(0, 1 + i, 2 + i) for i in range(n)]
    b0 = len(verts); verts.append(Vector((0, 0, -deck)))
    for cx, cy in arc: verts.append(Vector((h * cx, h * cy, -deck)))
    faces += [(b0, b0 + 2 + i, b0 + 1 + i) for i in range(n)]
    faces.append((1, b0 + 1, b0, 0)); faces.append((0, b0, b0 + n + 1, n + 1))   # flat back faces at the socket (hidden by the road end)
    roles = ['road']; fm = [0] * len(faces)
    fr = prof['roles']; keys = ['shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_out', 'underside_side', 'underside']
    def rix(r):
        if r not in roles: roles.append(r)
        return roles.index(r)
    kb = len(verts)
    for cx, cy in arc:
        Nn = Vector((cx, cy, 0))
        for out, up in sec: verts.append(Vector((h * cx, h * cy, 0)) + Nn * out + Vector((0, 0, up)))
    for i in range(n):
        for k in range(ns - 1):   # the closing span (deck point -> road edge) would be an inner wall on the plate rim
            k2 = k + 1
            faces.append((kb + i * ns + k, kb + i * ns + k2, kb + (i + 1) * ns + k2, kb + (i + 1) * ns + k)); fm.append(rix(span_role(fr, keys[min(k, 6)], False)))
    faces.append(tuple(kb + k for k in range(ns - 1, -1, -1))); fm.append(rix(fr.get('barrier_out', 'barrier_side')))
    faces.append(tuple(kb + n * ns + k for k in range(ns))); fm.append(rix(fr.get('barrier_out', 'barrier_side')))
    ob = mesh_obj(name, verts, faces, [mat(r) for r in roles], fm, collection,
                  {'kfb_kind': 'part', 'part': 'end_cap', 'family': prof['family'], 'profile': prof['id'], 'road_half_width_m': h, 'socket_entry': 'origin, +Y into the cap'})
    fix_normals(ob)
    # bollards on the sidewalk ring
    ext = prof['sideExtent']; rb = h + prof['prm']['shoulderW'] + 0.6
    pieces = []
    for a in (35, 90, 145):
        x, y_ = rb * math.cos(math.radians(a)), rb * math.sin(math.radians(a))
        z0 = sec[3][1] if len(sec) > 3 else 0.15
        pieces += [('bollard', _cyl(x, y_, z0, z0 + 1.0, 0.16, 12)), ('bollard_band', _cyl(x, y_, z0 + 0.7, z0 + 0.86, 0.17, 12))]
    bo = _assemble(name + '_bollards', pieces, collection, {'kfb_kind': 'part_child', 'part': 'end_cap_bollards'})
    bo.parent = ob
    return ob

def profile_from_sample(q, roles, family, pid):
    """Socket-fitted profile from a Track Core sample: road width, side section (slots 7..13 relative to the road edge,
    closing at deck depth), deck depth. A relabel of core output, no profile maths of its own."""
    s = q['slots']; x0 = s[7][0]
    sec = [[round(x - x0, 4), round(y, 4)] for x, y in s[7:]] + [[0, -q['prm']['deckDepth']]]
    return {'id': pid, 'family': family, 'prm': q['prm'], 'sideSection': sec, 'sideExtent': round(s[12][0] - s[7][0], 4), 'roles': roles}

def part_abutment(prof, deck, collection, name, drop=5.0, back=4.0):
    """Bridge abutment / bridgehead where a deck leaves a rim: bearing block under the deck end, wing walls, cornice,
    footing reaching `drop` m below the road into the host. Socket = local origin on the road surface at the deck end,
    +Y = T pointing ONTO the bridge (away from the host)."""
    W = prof['prm']['width'] + 2 * prof['sideExtent']; ww = W / 2 + 0.35
    P = [('abutment', _box(0, -back / 2 + 0.6, -deck - drop / 2, 2 * ww, back + 1.2, drop)),        # wall under the deck end (front face at +0.6)
         ('abutment_cornice', _box(0, 0.35, -deck - 0.18, 2 * ww + 0.3, 0.9, 0.36)),                 # bearing shelf / cornice under the deck
         ('abutment', _box(-ww - 0.3, -back / 2, -deck - drop * 0.45, 0.6, back + 1.6, drop * 0.9 + 0.2)),   # wing walls
         ('abutment', _box(ww + 0.3, -back / 2, -deck - drop * 0.45, 0.6, back + 1.6, drop * 0.9 + 0.2))]
    # (v0.1 had wing caps above the road; they stuck out onto the host surface in the lab proof -> removed, critic 08.10)
    return _assemble(name, P, collection, {'kfb_kind': 'part', 'part': 'abutment', 'family': prof['family'], 'profile': prof['id'], 'deck_depth_m': deck,
                                           'overall_width_m': round(W, 3), 'drop_m': drop, 'socket_deck_end': 'origin, +Y onto the bridge'})

def bounds_world(objs):
    mn = Vector((1e18,) * 3); mx = -mn
    for o in objs:
        if o.type != 'MESH': continue
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c); mn = Vector(map(min, mn, w)); mx = Vector(map(max, mx, w))
    return [list(map(lambda v: round(v, 4), mn)), list(map(lambda v: round(v, 4), mx))]

def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''): h.update(chunk)
    return h.hexdigest()

# ---------------------------------------------------------------- evidence renders (Workbench: material colours, shadow, cavity)
def setup_render(res=(1600, 900)):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sh = sc.display.shading
    sh.light = 'STUDIO'; sh.color_type = 'MATERIAL'; sh.show_shadows = True; sh.show_cavity = True; sh.cavity_type = 'BOTH'
    sh.show_object_outline = True; sh.object_outline_color = (0.12, 0.10, 0.10)
    sc.display.shadow_focus = 0.6
    sc.world = sc.world or bpy.data.worlds.new('World')
    sh.background_type = 'VIEWPORT' if hasattr(sh, 'background_type') else None
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = 'PNG'
    return sc

def render_view(path, target, cam_from, lens=35, ortho=None, only=None):
    """Render one evidence view. target / cam_from in Blender coordinates. `only` = collections to show (others hidden)."""
    sc = bpy.context.scene
    cam = bpy.data.objects.get('RKIT_EVIDENCE_CAM')
    if not cam:
        cam = bpy.data.objects.new('RKIT_EVIDENCE_CAM', bpy.data.cameras.new('RKIT_EVIDENCE_CAM')); sc.collection.objects.link(cam)
    cam.data.clip_end = 5000; cam.data.lens = lens
    cam.data.type = 'ORTHO' if ortho else 'PERSP'
    if ortho: cam.data.ortho_scale = ortho
    cam.location = Vector(cam_from)
    d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    hidden = []
    def walk(lc):
        for ch in lc.children:
            if only is None or ch.name in only: continue          # shown with everything below it
            if any(n.startswith(ch.name) for n in only): walk(ch)  # a parent of a shown collection
            elif not ch.exclude: ch.exclude = True; hidden.append(ch)
    walk(bpy.context.view_layer.layer_collection)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    for ch in hidden: ch.exclude = False
    return path

def contact_sheet(paths, out_path, cols, tile=(800, 450), pad=8, bg=(0.93, 0.92, 0.89)):
    """Compose rendered PNG tiles into one sheet (numpy inside Blender; no external deps)."""
    import numpy as np
    rows = (len(paths) + cols - 1) // cols
    W, H = cols * tile[0] + (cols + 1) * pad, rows * tile[1] + (rows + 1) * pad
    sheet = np.ones((H, W, 4), dtype=np.float32); sheet[..., 0], sheet[..., 1], sheet[..., 2] = bg
    for i, p in enumerate(paths):
        img = bpy.data.images.load(p, check_existing=False)
        if img.size[0] != tile[0] or img.size[1] != tile[1]: img.scale(tile[0], tile[1])
        px = np.array(img.pixels[:], dtype=np.float32).reshape(tile[1], tile[0], 4)
        r, c = divmod(i, cols); y0 = H - pad - (r + 1) * tile[1] - r * pad; x0 = pad + c * (tile[0] + pad)
        sheet[y0:y0 + tile[1], x0:x0 + tile[0]] = px
        bpy.data.images.remove(img)
    out = bpy.data.images.new('rkit_sheet', W, H, alpha=True)
    out.pixels[:] = sheet.ravel(); out.filepath_raw = out_path; out.file_format = 'PNG'; out.save()
    bpy.data.images.remove(out)
    return out_path

def label(text, loc, size=1.2, coll=None, name=None):
    t = bpy.data.curves.new(name or 'label', 'FONT'); t.body = text; t.size = size; t.align_x = 'CENTER'
    o = bpy.data.objects.new(name or 'LABEL', t); (coll or bpy.context.scene.collection).objects.link(o); o.location = loc
    o.data.materials.append(mat('signal_head'))
    return o

# ---------------------------------------------------------------- v0.14 module deck (gore fill, U nose barrier, cushion)
def build_deck_zone(z, name, collection, role='plate'):
    """Strip zone (rows of [a, b] world points) as a slab: top, bottom (depth along -U), and the two long sides + ends."""
    rows = z['rows']; U = Vector(z.get('U', [0, 1, 0])); dep = z.get('depth', 0.6)
    verts = []; faces = []
    for a, b in rows:
        A, B = Vector(a), Vector(b)
        verts += [to_bl(A), to_bl(B), to_bl(A - U * dep), to_bl(B - U * dep)]
    n = len(rows)
    for i in range(n - 1):
        o, p = 4 * i, 4 * (i + 1)
        faces += [(o, o + 1, p + 1, p), (o + 2, p + 2, p + 3, o + 3), (o, p, p + 2, o + 2), (o + 1, o + 3, p + 3, p + 1)]
    faces += [(0, 2, 3, 1), (4 * (n - 1), 4 * (n - 1) + 1, 4 * (n - 1) + 3, 4 * (n - 1) + 2)]
    ob = mesh_obj(name, verts, faces, [mat(role)], None, collection, {'kfb_kind': 'deck_zone', 'zone': z['kind'], 'module': z.get('module', '')})
    fix_normals(ob)
    return ob

def build_uturn(f, name, collection, n=16):
    """U barrier around a gore nose: section (thickness t, base..hIn) swept on a half circle from `from` through T to -from."""
    c, a, T, U = Vector(f['c']), Vector(f['from']), Vector(f['T']).normalized(), Vector(f['U']).normalized()
    r, t, base, hIn = f['r'], f['t'], f['base'], f['hIn']
    verts = []; faces = []
    for i in range(n + 1):
        th = math.pi * i / n; d = a * math.cos(th) + T * (r * math.sin(th)); rad = d.normalized() if d.length > 1e-9 else T
        p = c + d
        for off, h in ((-t / 2, base), (t / 2, base), (t / 2, hIn), (-t / 2, hIn)): verts.append(to_bl(p + rad * off + U * h))
    for i in range(n):
        for k in range(4): faces.append((4 * i + k, 4 * i + (k + 1) % 4, 4 * (i + 1) + (k + 1) % 4, 4 * (i + 1) + k))
    faces += [(0, 3, 2, 1), (4 * n, 4 * n + 1, 4 * n + 2, 4 * n + 3)]
    ob = mesh_obj(name, verts, faces, [mat('barrier_cap')], None, collection, {'kfb_kind': 'nose_barrier', 'module': f.get('module', '')})
    fix_normals(ob)
    return ob

def build_cushion(f, name, collection):
    v, fc = _cyl(0, 0, 0, f.get('h', 1.0), f['r'], 16)
    pieces = [('lamp_amber', (v, fc)), ('signal_head', _cyl(0, 0, f.get('h', 1.0) * 0.4, f.get('h', 1.0) * 0.6, f['r'] + 0.02, 16))]
    ob = _assemble(name, pieces, collection, {'kfb_kind': 'cushion', 'module': f.get('module', '')})
    ob.location = to_bl(f['p'])
    return ob
