# KFB RKIT R3 · Blender geometry tests on the built A1 assembly (mesh level, after build). Writes a JSON report.
import bpy, bmesh, json, math, os, sys
from mathutils import Vector
from mathutils.kdtree import KDTree
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
G = json.load(open(os.path.join(ROOT, 'trackcore', 'out', 'a1.graph.json')))
prof = json.load(open(os.path.join(ROOT, 'trackcore', 'out', 'profiles.v013.json')))
T = []
def check(name, ok, value, note=''): T.append({'test': name, 'pass': bool(ok), 'value': value, 'note': note})

def kd(ob):
    t = KDTree(len(ob.data.vertices))
    for i, v in enumerate(ob.data.vertices): t.insert(ob.matrix_world @ v.co, i)
    t.balance(); return t
def slot_pts(q):   # expected world positions (Blender) of a stream sample's 14 slots
    P, R, U = Vector(q['p']), Vector(q['R']), Vector(q['U'])
    return [L.to_bl(P + R * lat + U * lift) for lat, lift in q['slots']]
def miss(tree, pts): return max(tree.find(p)[2] for p in pts)

node = G['nodes'][0]
# 1 · seam: at every arm mouth, the arm route body has vertices on all 14 slots of its mouth sample AND the kerb runs
#     touching that mouth have vertices on the 6 side slots of the side they serve (mesh level, after welding)
worst_route = worst_kerb = 0.0; n_m = 0
kerb_trees = {kb['id']: kd(bpy.data.objects[f"RKIT_kerb_{kb['id']}"]) for kb in node['kerbs']}
for a in node['arms']:
    rid = next(k for k, r in G['routes'].items() if any(f"arm:{a['id']}" in q['tags'] and f"node:{node['id']}" in q['tags'] for q in r['samples']))
    S = G['routes'][rid]['samples']; mouth = Vector(a['mouth']['p'])
    q = min((x for x in S if f"arm:{a['id']}" in x['tags']), key=lambda x: (Vector(x['p']) - mouth).length)
    pts = slot_pts(q); worst_route = max(worst_route, miss(kd(bpy.data.objects[f'RKIT_route_{rid}']), pts))
    for kb in node['kerbs']:
        if kb['from'] == a['id']: side = pts[7:14] if (Vector(q['T']).dot(Vector(a['mouth']['T'])) > 0) else pts[0:7]
        elif kb['to'] == a['id']: side = pts[0:7] if (Vector(q['T']).dot(Vector(a['mouth']['T'])) > 0) else pts[7:14]
        else: continue
        worst_kerb = max(worst_kerb, miss(kerb_trees[kb['id']], side)); n_m += 1
check('seam · every junction mouth: route body and both kerb runs share the mouth section (mesh vertices within 1 mm)', worst_route < 1e-3 and worst_kerb < 1e-3, [round(worst_route, 6), round(worst_kerb, 6)], f'{len(node["arms"])} mouths, {n_m} kerb ends; max miss route / kerb (m)')

# 2 · seam stub route end <-> socket-fitted end cap: cap has vertices on all 14 slots of the stub end sample
cap = bpy.data.objects['A1_end_cap_north']; qs = G['routes']['J.arm2']['samples'][-1]
m_cap = miss(kd(cap), slot_pts(qs))
check('seam · end cap entry carries the full stub end section (14 slots, mesh vertices within 1 mm)', m_cap < 1e-3, round(m_cap, 6), 'max miss (m)')

# 3 · parts on sockets: placed part frame == Track Core frame of the socket / route end
def frame_err(ob, p, Tv, Uv):
    M = L.frame_matrix(p, Tv, Uv); return max(abs(a - b) for ra, rb2 in zip(ob.matrix_world, M) for a, b in zip(ra, rb2))
M0 = G['routes']['M']['samples'][0]; E1 = G['routes']['M+J']['samples'][-1]; SE = G['routes']['J.arm2']['samples'][-1]
errs = [frame_err(bpy.data.objects['A1_abutment_otown'], M0['p'], M0['T'], M0['U']),
        frame_err(bpy.data.objects['A1_abutment_pyramide'], E1['p'], [-v for v in E1['T']], E1['U']),
        frame_err(cap, SE['p'], SE['T'], SE['U'])]
check('sockets · abutments and end cap sit exactly on their Track Core frames', max(errs) < 1e-5, [round(e, 8) for e in errs], 'max matrix element difference')
lab = G['labConnectors']
dA = (Vector(M0['p']) - Vector(lab['otown']['p'])).length; dB = (Vector(E1['p']) - Vector(lab['pyramide']['p'])).length
def ang(T, d, sgn): n = math.hypot(T[0], T[2]) * math.hypot(d[0], d[1]); return math.degrees(math.acos(max(-1, min(1, sgn * (T[0] * d[0] + T[2] * d[1]) / n))))
hA, hB = ang(M0['T'], lab['otown']['dir'], 1), ang(E1['T'], lab['pyramide']['dir'], -1)
check('island connectors · route starts / ends on the measured lab rim connectors, heading along / against their outward dir, level', dA < 1e-6 and dB < 1e-6 and hA < 0.01 and hB < 0.01 and abs(M0['U'][1] - 1) < 1e-9 and abs(E1['U'][1] - 1) < 1e-9,
      [round(dA, 9), round(dB, 9), round(hA, 4), round(hB, 4)], 'position error A/B (m), heading error A/B (deg)')

# 4 · signals on the junction furniture anchors (foot on the anchor point)
fur = node['deck']['furniture']; dmax = 0
for f in fur:
    ob = bpy.data.objects[f"RKIT_{f['kind']}_{node['id']}_{f['arm']}"]; dmax = max(dmax, (ob.matrix_world.translation - L.to_bl(f['p'])).length)
check('furniture · one signal per arm on its Track Core anchor', len(fur) == len(node['arms']) and dmax < 1e-6, [len(fur), round(dmax, 9)], 'count, max foot offset (m)')

# 5 · mesh sanity on every generated mesh of the assembly + isolated parts
def sanity(ob):
    bm = bmesh.new(); bm.from_mesh(ob.data)
    nm = sum(1 for e in bm.edges if not e.is_manifold); deg = sum(1 for f in bm.faces if f.calc_area() < 1e-9); loose = sum(1 for v in bm.verts if not v.link_edges)
    bm.free(); return nm, deg, loose
rows = {}
for c in ('RKIT_R3_A1_ASSEMBLY', 'RKIT_R3_PARTS_ISOLATED'):
    for ob in bpy.data.collections[c].all_objects:
        if ob.type == 'MESH' and ob.name not in rows: rows[ob.name] = sanity(ob)
deg = sum(r[1] for r in rows.values()); loose = sum(r[2] for r in rows.values())
closed = [k for k in rows if k.startswith(('RKIT_kerb_', 'PART_', 'RKIT_parapet', 'FIT_', 'A1_'))]
nm_closed = {k: rows[k][0] for k in closed if rows[k][0]}
check('mesh · no degenerate faces, no loose vertices (all generated meshes)', deg == 0 and loose == 0, [deg, loose], f'{len(rows)} meshes')
check('mesh · kerb runs, parapets and parts are closed (no non-manifold edges)', not nm_closed, nm_closed or 0, f'{len(closed)} closed meshes')
# route bodies are open only where the junction closes them: every non-manifold vertex lies on an arm mouth section
mouth_pts = []
for a in node['arms']:
    rid = next(k for k, r in G['routes'].items() if any(f"arm:{a['id']}" in q['tags'] and f"node:{node['id']}" in q['tags'] for q in r['samples']))
    S = G['routes'][rid]['samples']; mp = Vector(a['mouth']['p'])
    mouth_pts += slot_pts(min((x for x in S if f"arm:{a['id']}" in x['tags']), key=lambda x: (Vector(x['p']) - mp).length))
off = {}
for k in rows:
    if not k.startswith('RKIT_route_'): continue
    ob = bpy.data.objects[k]; bm = bmesh.new(); bm.from_mesh(ob.data)
    vs = {v for e in bm.edges if not e.is_manifold for v in e.verts}
    bad = [v for v in vs if min(((ob.matrix_world @ v.co) - p).length for p in mouth_pts) > 1e-3]; bm.free()
    off[k] = [len(vs), len(bad)]
check('mesh · route bodies are closed except at the junction mouths (open vertices all on a mouth section)', all(b == 0 for _, b in off.values()), off, 'route: [open vertices, open vertices off a mouth]')

# 6 · clearance: KFB car envelope on every lane connector vs signal masts (foot ring r = 0.35 m)
masts = [L.to_bl(f['p']) for f in fur]; mind = 1e9
for c in node['lanes']:
    for p in c['pts']:
        pb = L.to_bl(p); mind = min(mind, min((Vector((pb.x - m.x, pb.y - m.y, 0))).length for m in masts))
need = prof['vehicle']['width'] / 2 + 0.35
check('clearance · signal mast feet stay off every lane connector by half a KFB car + mast foot', mind >= need, round(mind, 3), f'needs {need:.3f} m')

res = {'schema': 'kfb.rkit-r3.blender-tests/0.1', 'core': G.get('core', ''), 'blender': bpy.app.version_string, 'passed': sum(t['pass'] for t in T), 'total': len(T), 'tests': T}
json.dump(res, open(os.path.join(ROOT, 'evidence', 'blender_tests_a1.json'), 'w'), indent=1)
result = {'passed': res['passed'], 'total': res['total'], 'fails': [t for t in T if not t['pass']]}
