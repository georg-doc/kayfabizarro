# KFB RKIT R3 · build: profile catalogue, isolated parts, assembly A1 (otown -> T junction -> TOWN/COUNTRY -> pyramide).
# Run inside Blender (MCP): exec(open(PATH).read(), {'RKIT_ROOT': '<root>'}). Deterministic: rebuilds its collections.
import bpy, json, math, os, sys
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
from mathutils import Vector, Matrix

OUT = os.path.join(ROOT, 'trackcore', 'out')
prof = json.load(open(os.path.join(OUT, 'profiles.v013.json')))
G = json.load(open(os.path.join(OUT, 'a1.graph.json')))
P = {p['id']: p for p in prof['profiles']}

scene = bpy.context.scene
for o in list(scene.collection.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(scene.collection.children):
    if c.name in ('Collection',) or c.name.startswith('RKIT_R3'): L.clear_coll(c); bpy.data.collections.remove(c)
root = L.coll('RKIT_R3')
C_PARTS = L.coll('RKIT_R3_PARTS_ISOLATED', root)
C_PROF = L.coll('RKIT_R3_PROFILES', root)
C_A1 = L.coll('RKIT_R3_A1_ASSEMBLY', root)
C_A1_ROUTES = L.coll('RKIT_R3_A1_routes', C_A1)
C_A1_NODE = L.coll('RKIT_R3_A1_junction', C_A1)
C_A1_PARTS = L.coll('RKIT_R3_A1_parts', C_A1)
C_A1_SOCK = L.coll('RKIT_R3_A1_sockets', C_A1)
report = {'schema': L.CORE_SCHEMA, 'core': prof['core'], 'objects': {}, 'placements': []}

# ---- isolated parts, each at its own origin row (x spacing 20 m, y = -60 m: away from the profile row)
parts = {}
parts['signal'] = L.part_signal(C_PARTS)
parts['sign'] = L.part_sign_giveway(C_PARTS)
parts['end_cap_TOWN'] = L.part_end_cap(P['TOWN_1_1'], C_PARTS, 'PART_end_cap_TOWN_1_1')
deck_bridge = 1.4
parts['abut_TOWN'] = L.part_abutment(P['TOWN_1_1'], deck_bridge, C_PARTS, 'PART_abutment_TOWN_1_1')
parts['abut_COUNTRY'] = L.part_abutment(P['COUNTRY_1_1'], deck_bridge, C_PARTS, 'PART_abutment_COUNTRY_1_1')
for i, k in enumerate(['signal', 'sign', 'end_cap_TOWN', 'abut_TOWN', 'abut_COUNTRY']):
    parts[k].location = Vector((i * 22.0, -60.0, 0.0))

# ---- profile catalogue: 12 m straight sample per profile + lane lines from the exported layout
x0 = 0.0
for pr in prof['profiles']:
    W = pr['overall']; cx = x0 + W / 2
    Lm = 12.0; samples = []
    for k in range(2):
        z = k * Lm   # Track Core frame: heading +Z, R = -X
        samples.append({'p': [cx, 0, z], 'R': [-1, 0, 0], 'U': [0, 1, 0], 'slots': pr['slots'], 'tags': [], 'prm': pr['prm'], 'family': pr['family'], 's': z})
    ob = L.build_route({'samples': samples}, f"profile_{pr['id']}", prof, C_PROF)
    ob['kfb_kind'] = 'profile_sample'; ob['profile'] = pr['id']; ob['family'] = pr['family']; ob['road_width_m'] = pr['prm']['width']; ob['overall_width_m'] = W
    ob['lanes'] = json.dumps(pr['lanes']); ob['side_section'] = json.dumps(pr['sideSection'])
    strips = []
    if pr['layout']:
        for ln in pr['layout']['lines']:
            if ln['kind'] == 'edge' and pr['markings'] == 'LANES_KERB': continue
            w = prof['laneMarkings'][ln['kind']]['w']; lat = ln['lat']
            pts = [[[cx - (lat - w / 2), 0.03, z], [cx - (lat + w / 2), 0.03, z]] for z in (0.0, Lm)]
            strips.append({'pts': pts})
    if strips: L.build_route_markings({'markingStrips': strips}, f"profile_{pr['id']}", C_PROF)
    t = bpy.data.curves.new(f"label_{pr['id']}", 'FONT'); t.body = f"{pr['id']}\n{pr['prm']['width']:g} / {W:g} m"; t.size = 1.4; t.align_x = 'CENTER'
    to = bpy.data.objects.new(f"LABEL_{pr['id']}", t); C_PROF.objects.link(to); to.location = L.to_bl([cx, 0.05, -3.0]); to.rotation_euler = (0, 0, 0)
    x0 += W + 6.0
C_PROF_OFFSET = Vector((0, 120, 0))
for o in C_PROF.objects: o.location += C_PROF_OFFSET   # catalogue sits north (Blender +Y) of the parts row

# ---- assembly A1
node = G['nodes'][0]
for rid, r in G['routes'].items():
    first, last = r['samples'][0]['tags'], r['samples'][-1]['tags']
    ob = L.build_route(r, rid, prof, C_A1_ROUTES, cap_start='node_arm' not in first, cap_end='node_arm' not in last or rid.startswith('J.'))
    L.build_route_markings(r, rid, C_A1_ROUTES)
    L.build_parapets(r, rid, C_A1_ROUTES)
L.build_junction(node, prof, C_A1_NODE, parts)

def place(src, name, p, T, U, coll, socket):
    inst = src.copy(); inst.data = src.data; coll.objects.link(inst); inst.name = name
    inst.matrix_world = L.frame_matrix(p, T, U)
    for ch in src.children:
        c2 = ch.copy(); c2.data = ch.data; coll.objects.link(c2); c2.parent = inst; c2.matrix_parent_inverse = ch.matrix_parent_inverse.copy(); c2.name = name + ch.name[len(src.name):]
    inst['placed_on'] = socket
    report['placements'].append({'part': src.name, 'name': name, 'socket': socket, 'p': p, 'T': T, 'U': U})
    return inst
M, MJ, stub = G['routes']['M'], G['routes']['M+J'], G['routes']['J.arm2']
q0, q1, qs = M['samples'][0], MJ['samples'][-1], stub['samples'][-1]
# socket-fitted parts: generated from the profile the stream carries at that socket (deck depth, side section, width)
C_FIT = L.coll('RKIT_R3_A1_fitted_parts_src', C_A1)
fA = L.part_abutment(L.profile_from_sample(q0, L.roles_for(prof, q0['family']), q0['family'], 'socket:M@0'), q0['prm']['deckDepth'], C_FIT, 'FIT_abutment_otown')
fB = L.part_abutment(L.profile_from_sample(q1, L.roles_for(prof, q1['family']), q1['family'], 'socket:M+J@end'), q1['prm']['deckDepth'], C_FIT, 'FIT_abutment_pyramide')
fC = L.part_end_cap(L.profile_from_sample(qs, L.roles_for(prof, qs['family']), qs['family'], 'socket:J/arm2'), C_FIT, 'FIT_end_cap_J_arm2')
place(fA, 'A1_abutment_otown', q0['p'], q0['T'], q0['U'], C_A1_PARTS, 'route M s=0 (lab connector otown)')
place(fB, 'A1_abutment_pyramide', q1['p'], [-v for v in q1['T']], q1['U'], C_A1_PARTS, 'route M+J end (lab connector pyramide)')
place(fC, 'A1_end_cap_north', qs['p'], qs['T'], qs['U'], C_A1_PARTS, 'route J.arm2 end = socket J/arm2')
C_FIT.hide_render = True; C_FIT.hide_viewport = True
for rid, r in G['routes'].items():
    for end, q, Tsgn in (('start', r['samples'][0], 1), ('end', r['samples'][-1], 1)):
        L.socket_empty(f'SOCKET_{rid}_{end}', q['p'], q['T'], q['U'], C_A1_SOCK, {'kfb_kind': 'route_end', 'route': rid, 'end': end, 'family': q.get('family') or '', 'width_m': q['prm']['width'],
                       'track_core_p': q['p'], 'track_core_T': q['T'], 'track_core_U': q['U'], 'track_core_R': q['R']})

# ---- park isolated parts out of the way of the assembly (assembly lives at the lab's world coordinates)
for o in C_PARTS.objects:
    if o.parent is None: o.location += Vector((150, 150, 0))
report['objects'] = {c.name: len(c.all_objects) for c in (C_PARTS, C_PROF, C_A1)}
report['a1_bounds_bl'] = L.bounds_world([o for o in C_A1.all_objects])
result = report
