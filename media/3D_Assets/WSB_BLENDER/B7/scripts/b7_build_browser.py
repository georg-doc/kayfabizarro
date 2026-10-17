# WSB B7 · Dschungel-Computer · Browser-Fassung (headless Blender, kein Live-Export).
# Nach WS0 MeshyModels/_browser/_tools/decimate.py: Import (merge) → Quell-Isolation (4 Ansichten, Workbench, Textur) →
# Collapse-Decimate auf A (≤ 80 k) und LOD1 (≤ 25 k) → Basis y = 0, Mitte xz = 0 → Texturen ≤ 2048 → GLB.
# Usage: blender -b --factory-startup --python b7_build_browser.py -- <src.glb> <outdir> <targetA> <targetLOD1>
import bpy, sys, time, json, math
import numpy as np
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
src, outdir, tA, tB = argv[0], argv[1], int(argv[2]), int(argv[3])
T0 = time.time()
def log(*a): print('[B7]', f'{time.time() - T0:7.1f}s', *a, flush=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src, merge_vertices=True, import_shading='SMOOTH')
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]
for o in bpy.context.scene.objects: o.select_set(False)
ob.select_set(True); bpy.context.view_layer.objects.active = ob
me = ob.data

def stats(label):
    me.calc_loop_triangles(); co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    M = np.array(ob.matrix_world); cw = co @ M[:3, :3].T + M[:3, 3]
    d = {'label': label, 'tris': len(me.loop_triangles), 'verts': len(me.vertices), 'bbox_min': cw.min(0).round(4).tolist(), 'bbox_max': cw.max(0).round(4).tolist()}
    log(json.dumps(d)); return d
rep = {'src': src, 'orig': stats('orig')}

# Basis auf y = 0 (Blender: z oben), Mitte xz = 0
bb = np.array(rep['orig']['bbox_min']), np.array(rep['orig']['bbox_max'])
ob.location -= Vector(((bb[0][0] + bb[1][0]) / 2, (bb[0][1] + bb[1][1]) / 2, bb[0][2]))
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
rep['placed'] = stats('placed')

# Quell-Isolation: 4 Ansichten, Workbench mit Textur, ohne Szene
sc = bpy.context.scene; sc.render.engine = 'BLENDER_WORKBENCH'; sc.display.shading.light = 'STUDIO'; sc.display.shading.color_type = 'TEXTURE'
sc.render.resolution_x, sc.render.resolution_y = 1600, 1200; sc.render.image_settings.file_format = 'PNG'
sc.world = bpy.data.worlds.new('w'); sc.world.color = (0.86, 0.84, 0.8)
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 50
mn, mx = np.array(rep['placed']['bbox_min']), np.array(rep['placed']['bbox_max']); ctr = Vector(((mn + mx) / 2).tolist()); rad = float(np.linalg.norm(mx - mn)) / 2
for name, az, el in (('front', 0, 18), ('q34', 40, 22), ('side', 90, 14), ('top', 0, 70)):
    a, e = math.radians(az), math.radians(el); d = rad / math.tan(math.radians(18)) * 1.05
    # glTF +Z (vorn) = Blender -Y
    cam.location = ctr + Vector((d * math.sin(a) * math.cos(e), -d * math.cos(a) * math.cos(e), d * math.sin(e)))
    cam.rotation_euler = (ctr - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = f'{outdir}/renders/B7_source_{name}.png'; bpy.ops.render.render(write_still=True); log('render', name)

def decimate(target):
    me.calc_loop_triangles(); n = len(me.loop_triangles)
    m = ob.modifiers.new('dec', 'DECIMATE'); m.decimate_type = 'COLLAPSE'; m.ratio = min(1.0, target / n); m.use_collapse_triangulate = True
    log('decimate', n, '->', target, 'ratio', round(m.ratio, 5))
    with bpy.context.temp_override(object=ob, active_object=ob): bpy.ops.object.modifier_apply(modifier=m.name)
for img in bpy.data.images:
    if img.size[0] > 2048: img.scale(2048, 2048); log('image', img.name, '-> 2048')
def export(path):
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_image_format='AUTO', export_normals=True, export_tangents=False,
        export_yup=True, use_selection=True, export_draco_mesh_compression_enable=False, export_texcoords=True, export_materials='EXPORT', export_animations=False)
    log('exported', path)
decimate(tA); rep['A'] = stats('A'); export(f'{outdir}/JungleComputer_A_browser.glb')
decimate(tB); rep['LOD1'] = stats('LOD1'); export(f'{outdir}/JungleComputer_LOD1.glb')
json.dump(rep, open(f'{outdir}/data/b7_blender_report.json', 'w'), indent=1); log('DONE')
