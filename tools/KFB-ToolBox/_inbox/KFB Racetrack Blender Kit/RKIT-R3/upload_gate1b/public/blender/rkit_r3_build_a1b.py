# KFB RKIT R3 · build A1b (gate 1b): otown crossing (B) -> highway -> RKIT test island interchange (A). No blunt ends:
# roads run through the islands; the two stubs end in socket-fitted end caps; the highway runs out of the scene.
import bpy, json, os, sys
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
OUT = os.path.join(ROOT, 'trackcore', 'out')
prof = json.load(open(os.path.join(OUT, 'profiles.v013.json')))
G = json.load(open(os.path.join(OUT, 'a1b.graph.json')))
root = L.coll('RKIT_R3')
for name in ('RKIT_R3_A1_ASSEMBLY', 'RKIT_R3_A1B_ASSEMBLY'):   # A1 failed at gate 1 (blunt island ends): it is replaced, not kept in the scene
    c = bpy.data.collections.get(name)
    if c: L.clear_coll(c); bpy.data.collections.remove(c)
C = L.coll('RKIT_R3_A1B_ASSEMBLY', root)
CR, CN, CD, CP, CS = (L.coll(f'RKIT_R3_A1B_{k}', C) for k in ('routes', 'junctions', 'modules', 'parts', 'sockets'))
CF = L.coll('RKIT_R3_A1B_fitted_parts_src', C)
parts = {'signal': bpy.data.objects.get('PART_signal_mast') or L.part_signal(L.coll('RKIT_R3_PARTS_ISOLATED', root)), 'sign': bpy.data.objects.get('PART_sign_giveway')}
rep = {'routes': [], 'nodes': [], 'modules': [], 'placements': []}
node_arm = lambda q: 'node_arm' in q['tags']
ENDS = [(rid, k, r['samples'][k]['p']) for rid, r in G['routes'].items() for k in (0, -1)]
joined = lambda rid, k, p: any(o != rid and sum((a - b) ** 2 for a, b in zip(p, pp)) < 1e-6 for o, kk, pp in ENDS)   # end-to-end with another route (node sockets)
for rid, r in G['routes'].items():
    S = r['samples']
    # a route end is open (no cap) where a node or a module continues it: node arms, branch starts / ends on the main edge
    cap_s = not (node_arm(S[0]) or 'pit_junction' in S[0]['tags'] or 'continues_off_map' in S[0]['tags'] or joined(rid, 0, S[0]['p']))
    cap_e = not (node_arm(S[-1]) or 'entry_converge' in S[-1]['tags'] or 'continues_off_map' in S[-1]['tags'] or joined(rid, -1, S[-1]['p']))
    L.build_route(r, rid, prof, CR, cap_start=cap_s, cap_end=cap_e); L.build_route_markings(r, rid, CR); L.build_parapets(r, rid, CR)
    rep['routes'].append({'id': rid, 'samples': len(S), 'length_m': round(S[-1]['s'] - S[0]['s'], 2), 'fingerprint': r.get('fingerprint')})
for nb in G['nodes']:
    L.build_junction(nb, prof, CN, parts); rep['nodes'].append({'id': nb['id'], 'arms': len(nb['arms']), 'lanes': len(nb['lanes'])})
for i, z in enumerate(G['deck']['zones']):
    L.build_deck_zone(z, f"RKIT_gore_{z.get('module', i)}", CD, 'plate'); rep['modules'].append({'zone': z['kind'], 'module': z.get('module'), 'rows': len(z['rows']), 'depth': z.get('depth')})
for i, f in enumerate(G['deck']['furniture']):
    if f['kind'] == 'uturn': L.build_uturn(f, f"RKIT_nose_{f.get('module', i)}", CD)
    elif f['kind'] == 'cushion': L.build_cushion(f, f"RKIT_cushion_{f.get('module', i)}", CD)
def place(src, name, q, socket):
    inst = src.copy(); inst.data = src.data; CP.objects.link(inst); inst.name = name
    inst.matrix_world = L.frame_matrix(q['p'], q['T'], q['U'])
    for ch in src.children:
        c2 = ch.copy(); c2.data = ch.data; CP.objects.link(c2); c2.parent = inst; c2.matrix_parent_inverse = ch.matrix_parent_inverse.copy(); c2.name = name + ch.name[len(src.name):]
    inst['placed_on'] = socket; rep['placements'].append({'part': src.name, 'name': name, 'socket': socket})
for rid, label in (('OJ.arm1', 'otown_stub'), ('plaza', 'hub_plaza')):
    q = G['routes'][rid]['samples'][-1]
    fc = L.part_end_cap(L.profile_from_sample(q, L.roles_for(prof, q['family']), q['family'], f'socket:{rid}@end'), CF, f'FIT_end_cap_{label}')
    place(fc, f'A1B_end_cap_{label}', q, f'route {rid} end')
CF.hide_render = True; CF.hide_viewport = True
for rid, r in G['routes'].items():
    for end, q in (('start', r['samples'][0]), ('end', r['samples'][-1])):
        L.socket_empty(f'SOCKET_{rid}_{end}', q['p'], q['T'], q['U'], CS, {'kfb_kind': 'route_end', 'route': rid, 'end': end, 'family': q.get('family') or '', 'width_m': q['prm']['width'],
                       'track_core_p': q['p'], 'track_core_T': q['T'], 'track_core_U': q['U'], 'track_core_R': q['R'], 'continues_off_map': 'continues_off_map' in q['tags']})
rep['objects'] = len(C.all_objects); rep['bounds_bl'] = L.bounds_world(list(C.all_objects))
result = rep
