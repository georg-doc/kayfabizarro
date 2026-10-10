# KFB RKIT R3 · export GLBs (assembly A1, isolated parts, profile catalogue) + clean re-import comparison.
# GLB axes: glTF +Y up == Track Core runtime frame. Extras carry kfb_* custom props and socket frames.
import bpy, json, os, sys, re
from mathutils import Vector
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
OUT = os.path.join(ROOT, 'export'); os.makedirs(OUT, exist_ok=True)
SETS = {
    'rkit_r3_a1_assembly.glb': lambda o: o.users_collection and any(c.name.startswith('RKIT_R3_A1') and c.name != 'RKIT_R3_A1_fitted_parts_src' for c in o.users_collection),
    'rkit_r3_parts_isolated.glb': lambda o: any(c.name == 'RKIT_R3_PARTS_ISOLATED' for c in o.users_collection),
    'rkit_r3_profiles.glb': lambda o: any(c.name.startswith('RKIT_R3_PROFILES') for c in o.users_collection) and o.type == 'MESH' and not o.name.startswith('SCALE_'),
}
src_scene = bpy.context.scene
def snapshot(objs):
    snap = {}
    for o in objs:
        e = {'type': o.type, 'props': {k: (v if isinstance(v, (int, float, str)) else str(list(v)) if hasattr(v, '__len__') else str(v)) for k, v in o.items() if k.startswith(('kfb_', 'track_core', 'route', 'node', 'part', 'family', 'profile', 'arm', 'anchor', 'placed'))}}
        if o.type == 'MESH':
            e['bounds'] = L.bounds_world([o]); e['tris'] = sum(len(p.vertices) - 2 for p in o.data.polygons); used = {p.material_index for p in o.data.polygons}; e['mats'] = sorted({re.sub(r'\.\d{3}$', '', m.name) for i, m in enumerate(o.data.materials) if m and i in used})   # materials actually on faces
        else:
            e['matrix'] = [[round(v, 6) for v in row] for row in o.matrix_world]
        snap[o.name] = e
    return snap
report = {'schema': 'kfb.rkit-r3.export/0.1', 'blender': bpy.app.version_string, 'files': {}}
for fname, pick in SETS.items():
    objs = [o for o in src_scene.objects if pick(o) and (o.type in ('MESH', 'EMPTY'))]
    for o in src_scene.objects: o.select_set(False)
    for o in objs: o.hide_set(False); o.select_set(True)
    path = os.path.join(OUT, fname)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True)
    before = snapshot(objs)
    # clean re-import into a temporary scene
    tmp = bpy.data.scenes.new('_rkit_reimport'); bpy.context.window.scene = tmp
    pre = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in pre]
    after = {re.sub(r'\.\d{3}$', '', k): v for k, v in snapshot(new).items()}   # same .blend: re-imported names get .00N
    # compare (glTF splits meshes by material into primitives but keeps one node per object)
    miss = sorted(set(before) - set(after)); extra = sorted(set(after) - set(before))
    db = dm = dt = 0.0; prop_miss = 0; mat_miss = 0
    for n, b in before.items():
        a = after.get(n)
        if not a: continue
        if 'bounds' in b and 'bounds' in a:
            db = max(db, max(abs(x - y) for p, q in zip(b['bounds'], a['bounds']) for x, y in zip(p, q))); dt = max(dt, abs(b['tris'] - a['tris']))
            mat_miss += len(set(b['mats']) - set(a['mats']))
        if 'matrix' in b and 'matrix' in a: dm = max(dm, max(abs(x - y) for r1, r2 in zip(b['matrix'], a['matrix']) for x, y in zip(r1, r2)))
        prop_miss += sum(1 for k in b['props'] if k not in a['props'])
    for o in new: bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.window.scene = src_scene; bpy.data.scenes.remove(tmp)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for d in [d for d in coll if d.users == 0]: coll.remove(d)
    report['files'][fname] = {'bytes': os.path.getsize(path), 'sha256': L.sha256(path), 'objects': len(before), 'missing_after_reimport': miss, 'extra_after_reimport': extra[:10],
        'max_bounds_diff_m': round(db, 6), 'max_tri_count_diff': dt, 'max_empty_matrix_diff': round(dm, 7), 'props_lost': prop_miss, 'material_names_lost': mat_miss,
        'pass': not miss and db < 1e-3 and dt == 0 and dm < 1e-4 and prop_miss == 0 and mat_miss == 0}
json.dump(report, open(os.path.join(ROOT, 'evidence', 'glb_reimport_check.json'), 'w'), indent=1)
result = {k: {kk: v[kk] for kk in ('bytes', 'objects', 'missing_after_reimport', 'max_bounds_diff_m', 'max_tri_count_diff', 'max_empty_matrix_diff', 'props_lost', 'material_names_lost', 'pass')} for k, v in report['files'].items()}
