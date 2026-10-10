# KFB RKIT R3 · Blender geometry tests on the built A1b assembly (mesh level). Writes evidence/blender_tests_a1b.json.
import bpy, bmesh, json, math, os, sys
from mathutils import Vector
from mathutils.kdtree import KDTree
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
G = json.load(open(os.path.join(ROOT, 'trackcore', 'out', 'a1b.graph.json')))
T = []
def check(name, ok, value, note=''): T.append({'test': name, 'pass': bool(ok), 'value': value, 'note': note})
def kd(ob):
    t = KDTree(len(ob.data.vertices))
    for i, v in enumerate(ob.data.vertices): t.insert(ob.matrix_world @ v.co, i)
    t.balance(); return t
def slot_pts(q):
    P, R, U = Vector(q['p']), Vector(q['R']), Vector(q['U'])
    return [L.to_bl(P + R * lat + U * lift) for lat, lift in q['slots']]
def miss(tree, pts): return max(tree.find(p)[2] for p in pts)
# 1 · every junction mouth: route body + kerb runs share the mouth section
wr = wk = 0.0; nm = 0
for node in G['nodes']:
    kt = {kb['id']: kd(bpy.data.objects[f"RKIT_kerb_{kb['id']}"]) for kb in node['kerbs']}
    for a in node['arms']:
        rid = next(k for k, r in G['routes'].items() if any(f"arm:{a['id']}" in q['tags'] and f"node:{node['id']}" in q['tags'] for q in r['samples']))
        S = G['routes'][rid]['samples']; mp = Vector(a['mouth']['p'])
        q = min((x for x in S if f"arm:{a['id']}" in x['tags'] and f"node:{node['id']}" in x['tags']), key=lambda x: (Vector(x['p']) - mp).length)
        pts = slot_pts(q); wr = max(wr, miss(kd(bpy.data.objects[f'RKIT_route_{rid}']), pts)); al = Vector(q['T']).dot(Vector(a['mouth']['T'])) > 0
        for kb in node['kerbs']:
            if kb['from'] == a['id']: side = pts[7:14] if al else pts[0:7]
            elif kb['to'] == a['id']: side = pts[0:7] if al else pts[7:14]
            else: continue
            wk = max(wk, miss(kt[kb['id']], side)); nm += 1
check('seam · both junctions: every mouth shares its section with the arm route and both kerb runs (< 1 mm)', wr < 1e-3 and wk < 1e-3, [round(wr, 6), round(wk, 6)], f'{nm} kerb ends')
# 2 · end caps carry the full stub end section
mc = 0
for rid, lab in (('OJ.arm1', 'otown_stub'), ('plaza', 'hub_plaza')):
    mc = max(mc, miss(kd(bpy.data.objects[f'A1B_end_cap_{lab}']), slot_pts(G['routes'][rid]['samples'][-1])))
check('seam · both end caps carry the full stub end section (14 slots, < 1 mm)', mc < 1e-3, round(mc, 6))
# 3 · module zones: the exit branch starts and the entry branch ends on the main road edge (mesh vertices of both bodies)
def main_edge_near(p, rid, slot):
    S = G['routes'][rid]['samples']; q = min(S, key=lambda x: (Vector(x['p']) - Vector(p)).length); return slot_pts(q)[slot]
ex, en = G['routes']['off']['samples'][0], G['routes']['ramp_in']['samples'][-1]
d1 = (slot_pts(ex)[7] - main_edge_near(ex['p'], 'H+OJ', 7)).length; d2 = (slot_pts(en)[7] - main_edge_near(en['p'], 'H+OJ', 7)).length
tm = kd(bpy.data.objects['RKIT_route_H+OJ'])
d3 = max(miss(tm, [slot_pts(ex)[7]]), miss(tm, [slot_pts(en)[7]]))
check('modules · exit starts and entry ends exactly on the highway edge (stream + mesh)', d1 < 0.05 and d2 < 0.05 and d3 < 0.05, [round(d1, 4), round(d2, 4), round(d3, 4)], 'stream exit, stream entry, mesh (m)')
check('modules · two gore slabs, two U noses, one cushion (exit only)', all(bpy.data.objects.get(n) for n in ('RKIT_gore_off', 'RKIT_gore_on', 'RKIT_nose_off', 'RKIT_nose_on', 'RKIT_cushion_off')) and not bpy.data.objects.get('RKIT_cushion_on'), 'ok')
# 4 · no blunt ends: every open route end is a node arm, a module edge, an end cap socket or a run off the scene
blunt = []
ENDS = [(rid, r['samples'][k]['p']) for rid, r in G['routes'].items() for k in (0, -1)]
for rid, r in G['routes'].items():
    for q in (r['samples'][0], r['samples'][-1]):
        tg = q['tags']
        if 'node_arm' in tg or 'pit_junction' in tg or 'entry_converge' in tg or 'continues_off_map' in tg: continue
        if rid in ('OJ.arm1', 'plaza') and q is r['samples'][-1]: continue
        if any(o != rid and (Vector(p) - Vector(q['p'])).length < 1e-3 for o, p in ENDS): continue   # end to end with another route (node socket)
        blunt.append(f"{rid}@{q['s']:.0f}")
check('no blunt ends · every route end continues (node, module, socket join, end cap, or off the scene)', not blunt, blunt or 0)
# 5 · mesh sanity
def sanity(ob):
    bm = bmesh.new(); bm.from_mesh(ob.data)
    r = (sum(1 for e in bm.edges if not e.is_manifold), sum(1 for f in bm.faces if f.calc_area() < 1e-9), sum(1 for v in bm.verts if not v.link_edges)); bm.free(); return r
rows = {o.name: sanity(o) for o in bpy.data.collections['RKIT_R3_A1B_ASSEMBLY'].all_objects if o.type == 'MESH'}
check('mesh · no degenerate faces, no loose vertices', sum(r[1] for r in rows.values()) == 0 and sum(r[2] for r in rows.values()) == 0, [sum(r[1] for r in rows.values()), sum(r[2] for r in rows.values())], f'{len(rows)} meshes')
closed = {k: rows[k][0] for k in rows if k.startswith(('RKIT_kerb_', 'RKIT_parapet', 'RKIT_gore_', 'RKIT_nose_', 'A1B_end_cap', 'FIT_', 'RKIT_cushion'))}
check('mesh · kerb runs, parapets, gore slabs, noses, end caps closed', not any(closed.values()), {k: v for k, v in closed.items() if v} or 0, f'{len(closed)} meshes')
# 6 · signals on anchors and clear of every lane connector by half a KFB car + mast foot
dmax = 0; mind = 1e9; n = 0
for node in G['nodes']:
    for f in node['deck']['furniture']:
        ob = bpy.data.objects.get(f"RKIT_{f['kind']}_{node['id']}_{f['arm']}")
        if not ob: continue
        n += 1; dmax = max(dmax, (ob.matrix_world.translation - L.to_bl(f['p'])).length)
        for c in node['lanes']:
            for p in c['pts']:
                pb = L.to_bl(p); mind = min(mind, Vector((pb.x - ob.matrix_world.translation.x, pb.y - ob.matrix_world.translation.y)).length)
check('furniture · signals on their anchors and >= half a KFB car + 0.35 from every lane connector', dmax < 1e-6 and mind >= 3.11 / 2 + 0.35, [n, round(dmax, 9), round(mind, 3)])
res = {'schema': 'kfb.rkit-r3.blender-tests/0.2', 'core': G.get('core', ''), 'blender': bpy.app.version_string, 'passed': sum(t['pass'] for t in T), 'total': len(T), 'tests': T}
json.dump(res, open(os.path.join(ROOT, 'evidence', 'blender_tests_a1b.json'), 'w'), indent=1)
result = {'passed': res['passed'], 'total': res['total'], 'fails': [t for t in T if not t['pass']]}
