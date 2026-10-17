# WSB B7 · gezielte Dezimierung: Detailflächen (Lautsprecher-Gitter links, Linse rechts, Steinmaske, Tastatur) behalten mehr Dreiecke,
# Gesamtziel bleibt 80 k. Vertex-Gruppe 'keep' (Gewicht 1 in den Boxen) steuert den Decimate-Collapse; Richtung per Zählung geprüft.
# Usage: blender -b --factory-startup --python b7_redecimate.py -- <orig.glb> <out.glb> <target> <factor> <invert 0|1>
import bpy, sys, json, numpy as np
from mathutils import Vector
orig, out, target, factor, inv = sys.argv[sys.argv.index('--') + 1:][:5]; target = int(target); factor = float(factor); inv = inv == '1'
BOXES = {'grille_left': ((-0.49, 0.55, -0.15), (-0.31, 0.80, 0.25)), 'lens_right': ((0.30, 0.48, -0.15), (0.44, 0.64, 0.25)),
         'mask_top': ((-0.14, 0.86, -0.25), (0.11, 1.08, 0.2)), 'keyboard': ((-0.26, 0.38, 0.0), (0.18, 0.50, 0.35))}
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=orig, merge_vertices=True, import_shading='SMOOTH')
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; me = ob.data
co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3); Mw = np.array(ob.matrix_world); cw = co @ Mw[:3, :3].T + Mw[:3, 3]
mn, mx = cw.min(0), cw.max(0); ob.location -= Vector(((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, mn[2])); bpy.context.view_layer.objects.active = ob; ob.select_set(True)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
def gl(): c = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', c); c = c.reshape(-1, 3); return np.stack([c[:, 0], c[:, 2], -c[:, 1]], 1)   # glTF
def inbox(P):
    m = np.zeros(len(P), bool)
    for lo, hi in BOXES.values(): m |= np.all((P >= np.array(lo)) & (P <= np.array(hi)), 1)
    return m
P = gl(); keep = inbox(P); vg = ob.vertex_groups.new(name='keep'); idx = np.where(keep)[0].tolist()
# Blender: Gewicht 1 = darf reduziert werden, 0 = bleibt. Überall 1, Detailflächen niedrig → werden schwächer reduziert, Gesamtziel bleibt
vg.add(np.where(~keep)[0].tolist(), 1.0, 'REPLACE'); vg.add(idx, float(__import__('os').environ.get('B7_KEEPW', '0.2')), 'REPLACE')
print('[RED] keep verts', len(idx), 'of', len(P), flush=True)
me.calc_loop_triangles(); n = len(me.loop_triangles)
m = ob.modifiers.new('dec', 'DECIMATE'); m.decimate_type = 'COLLAPSE'; m.ratio = target / n; m.use_collapse_triangulate = True; m.vertex_group = 'keep'; m.vertex_group_factor = factor; m.invert_vertex_group = inv
bpy.ops.object.modifier_apply(modifier='dec')
me.calc_loop_triangles(); P = gl(); tri = np.array([t.vertices[:] for t in me.loop_triangles]); cen = P[tri].mean(1)
res = {'tris': len(tri), 'factor': factor, 'invert': inv}
for k, (lo, hi) in BOXES.items(): res[k] = int(np.all((cen >= np.array(lo)) & (cen <= np.array(hi)), 1).sum())
for im in bpy.data.images:
    if im.size[0] > 2048: im.scale(2048, 2048)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='WEBP', export_image_quality=90, export_yup=True, use_selection=True, export_materials='EXPORT', export_animations=False)
print('[RED] RESULT', json.dumps(res), flush=True)
