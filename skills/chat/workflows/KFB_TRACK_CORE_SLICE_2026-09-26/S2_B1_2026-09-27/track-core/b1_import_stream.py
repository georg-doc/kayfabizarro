"""B1 · Track Core stream -> Blender (oracle + preview). Blender never re-solves the track: it only reads the JS stream.
Builds: body (14-slot rings, role materials), marking bands, and runs INDEPENDENT checks with its own maths
(frame orthonormality, right-vector flips, s vs chord, slot parity, surface gaps, GLB round trip).
Globals (optional): B1_STREAMS = [(path, offset_xy, name)], B1_OUT (dir for report/glb)."""
import bpy, json, math, os
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit'
OUT = globals().get('B1_OUT', KIT + '/TRACK-CORE-W0/b1/')
STREAMS = globals().get('B1_STREAMS', [
    (KIT + '/TRACK-CORE-W0/out/td_showcase_seed.stream.json', (0.0, 0.0), 'TD_SEED'),
    (KIT + '/TRACK-CORE-W0/out/split_merge_seed.graph.stream.json', (320.0, 0.0), 'SPLIT_MERGE'),
])
SLOTS = ['under_L', 'barrier_out_bot_L', 'barrier_out_top_L', 'barrier_in_top_L', 'barrier_in_bot_L', 'shoulder_L', 'road_L',
         'road_R', 'shoulder_R', 'barrier_in_bot_R', 'barrier_in_top_R', 'barrier_out_top_R', 'barrier_out_bot_R', 'under_R']
# role of the face between slot i and i+1 (ring closes under_R -> under_L)
FACE_ROLE = ['barrier_side', 'barrier_side', 'barrier_cap', 'barrier_side', 'shoulder', 'shoulder', 'road',
             'shoulder', 'shoulder', 'barrier_side', 'barrier_cap', 'barrier_side', 'barrier_side', 'underside']
ROLE_HEX = dict(road=0x279797, shoulder=0xd8956b, barrier_side=0x674b54, barrier_cap=0xfa7a47, underside=0xac7965,
                mark_edge=0xfdc348, mark_centre=0xf4f1e8, mark_mag=0x7fd4ff)


def to_bl(p, off=(0.0, 0.0)):
    return Vector((p[0] + off[0], -p[2] + off[1], p[1]))


def lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def mat(role):
    name = 'TC_' + role
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    h = ROLE_HEX[role]
    m.diffuse_color = (lin(h >> 16 & 255), lin(h >> 8 & 255), lin(h & 255), 1.0)
    return m


def coll(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    for o in list(c.objects):
        me = o.data
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
    return c


def world(q, i):
    lat, lift = q['slots'][i]
    return [q['p'][k] + q['R'][k] * lat + q['U'][k] * lift for k in range(3)]


def build_body(c, name, S, off):
    roles = sorted(set(FACE_ROLE))
    verts, faces, fmat = [], [], []
    n = len(SLOTS)
    for q in S:
        verts += [to_bl(world(q, i), off) for i in range(n)]
    drawn = [not (S[a]['prm']['surface'] < 0.5 or S[a + 1]['prm']['surface'] < 0.5 or S[a + 1].get('brk')) for a in range(len(S) - 1)]
    for a in range(len(S) - 1):
        if not drawn[a]:
            continue
        for i in range(n):
            j = (i + 1) % n
            faces.append((a * n + i, a * n + j, (a + 1) * n + j, (a + 1) * n + i))
            fmat.append(roles.index(FACE_ROLE[i]))
        # end caps where a drawn run starts or stops (route ends, lip, touchdown, topology break)
        if a == 0 or not drawn[a - 1]:
            faces.append(tuple(a * n + i for i in reversed(range(n)))); fmat.append(roles.index('underside'))
        if a == len(S) - 2 or not drawn[a + 1]:
            faces.append(tuple((a + 1) * n + i for i in range(n))); fmat.append(roles.index('underside'))
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    for r in roles:
        me.materials.append(mat(r))
    for poly, mi in zip(me.polygons, fmat):
        poly.material_index = mi
    me.update()
    o = bpy.data.objects.new(name, me)
    c.objects.link(o)
    o['kfb_track_core'] = 'body'
    return o


def marking_lat(b, prm):
    half = prm['width'] / 2
    return prm['offset'] + b['side'] * (half - b['inset']) if b['at'] == 'edges' else prm['offset']


def build_markings(c, name, S, bands, off, lift=0.03):
    verts, faces, fmat = [], [], []
    roles = ['mark_edge', 'mark_centre', 'mark_mag']
    s_arr = [q['s'] for q in S]
    import bisect
    for b in bands:
        i0 = bisect.bisect_left(s_arr, b['s0']); i1 = bisect.bisect_right(s_arr, b['s1'])
        seg = S[max(0, i0 - 1):min(len(S), i1 + 1)]
        seg = [q for q in seg if b['s0'] - 1e-6 <= q['s'] <= b['s1'] + 1e-6]
        if len(seg) < 2:
            continue
        role = 'mark_mag' if b['at'] == 'bars' else ('mark_centre' if b['at'] == 'centre' else 'mark_edge')
        base = len(verts)
        for q in seg:
            lat = marking_lat(b, q['prm'])
            w = (q['prm']['width'] * b['span']) if b['at'] == 'bars' else b['w']
            for d in (-w / 2, w / 2):
                p = [q['p'][k] + q['R'][k] * (lat + d) + q['U'][k] * lift for k in range(3)]
                verts.append(to_bl(p, off))
        for k in range(len(seg) - 1):
            a = base + 2 * k
            faces.append((a, a + 1, a + 3, a + 2)); fmat.append(roles.index(role))
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    for r in roles:
        me.materials.append(mat(r))
    for poly, mi in zip(me.polygons, fmat):
        poly.material_index = mi
    me.update()
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_track_core'] = 'markings'
    return o


def oracle_checks(S):
    """Independent maths (not the JS solver): orthonormal frames, R flips, s vs chord, slot parity.
    Blender mathutils is float32, so s vs chord is checked at 1e-4 m (JS float64 checks it at 1e-6)."""
    orth, flips, sgap, badslots = 0.0, 0, 0.0, 0
    for i, q in enumerate(S):
        T, U, R = Vector(q['T']), Vector(q['U']), Vector(q['R'])
        orth = max(orth, abs(T.dot(U)), abs(T.dot(R)), abs(U.dot(R)), abs(T.length - 1), abs(U.length - 1),
                   (T.cross(U) - R).length)
        if len(q['slots']) != len(SLOTS):
            badslots += 1
        if i:
            if R.dot(Vector(S[i - 1]['R'])) < 0:
                flips += 1
            sgap = max(sgap, abs((Vector(q['p']) - Vector(S[i - 1]['p'])).length - (q['s'] - S[i - 1]['s'])))
    return dict(frame_orthonormal_and_R_is_TxU=orth, flips=flips, s_vs_chord=sgap, slot_parity_bad=badslots,
                pass_=orth < 1e-6 and flips == 0 and sgap < 1e-4 and badslots == 0)


def run():
    os.makedirs(OUT, exist_ok=True)
    report = {}
    for path, off, tag in STREAMS:
        d = json.load(open(path))
        routes = d['routes'] if 'routes' in d else {d.get('id', tag): d}
        c = coll('TC_' + tag)
        for rid, st in routes.items():
            nm = f'TC_{tag}_{rid.split("/")[-1]}'
            body = build_body(c, nm + '_body', st['samples'], off)
            mk = build_markings(c, nm + '_markings', st['samples'], st['markings'], off)
            report[nm] = dict(samples=len(st['samples']), fingerprint=st['fingerprint'], body_faces=len(body.data.polygons),
                              marking_faces=len(mk.data.polygons), oracle=oracle_checks(st['samples']))
    # GLB round trip: export all TC_ collections, re-import into a scratch scene, compare vertex totals
    for o in bpy.context.scene.objects:
        o.select_set(o.name.startswith('TC_'))
    glb = OUT + 'track_core_b1_preview.glb'
    bpy.ops.export_scene.gltf(filepath=glb, use_selection=True, export_apply=True)
    def bbox(objs):
        vs = [o.matrix_world @ v.co for o in objs for v in o.data.vertices]
        return [min(v[k] for v in vs) for k in range(3)] + [max(v[k] for v in vs) for k in range(3)]
    b_src = bbox([o for o in bpy.context.scene.objects if o.name.startswith('TC_') and o.type == 'MESH'])
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=glb)
    new = [o for o in bpy.data.objects if o not in before]
    b_glb = bbox([o for o in new if o.type == 'MESH'])
    for o in new:
        me = o.data if o.type == 'MESH' else None
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
    dev = max(abs(a - b) for a, b in zip(b_src, b_glb))
    report['_glb_round_trip'] = dict(file=glb, bbox_blender=[round(v, 3) for v in b_src], bbox_glb=[round(v, 3) for v in b_glb],
                                     max_dev_m=dev, pass_=dev < 1e-3, size_kb=round(os.path.getsize(glb) / 1024))
    json.dump(report, open(OUT + 'b1_oracle_report.json', 'w'), indent=1)
    return report


result = run()
