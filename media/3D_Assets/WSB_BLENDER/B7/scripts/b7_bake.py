# WSB B7 · Normal-Bake Original (7 M) → Browser-Fassung (80 k), Tangentenraum, Cycles, headless (kein Live-Export).
# Ersetzt die Meshy-Normal-Map (für die Original-Oberfläche gebacken, passt nach dem Dezimieren nicht mehr → Knitter an Gitter/Lochflächen).
# Usage: blender -b --factory-startup --python b7_bake.py -- <orig.glb> <low_v2.glb> <out_v3.glb> <size> <extrusion_u>
import bpy, sys, time, numpy as np
from mathutils import Vector
orig, low, out, size, ext = sys.argv[sys.argv.index('--') + 1:][:5]; size = int(size); ext = float(ext)
T0 = time.time()
def log(*a): print('[BAKE]', f'{time.time() - T0:7.1f}s', *a, flush=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=low); lo = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; lo.name = 'LOW'
bpy.ops.import_scene.gltf(filepath=orig, merge_vertices=True); hi = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o.name != 'LOW'][0]; hi.name = 'HIGH'
# Original genauso platzieren wie b7_build_browser.py (Basis y = 0, Mitte xz = 0)
me = hi.data; co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3); Mw = np.array(hi.matrix_world); cw = co @ Mw[:3, :3].T + Mw[:3, 3]
mn, mx = cw.min(0), cw.max(0); hi.location -= Vector(((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, mn[2]))
bpy.ops.object.select_all(action='DESELECT'); hi.select_set(True); bpy.context.view_layer.objects.active = hi; bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
log('loaded', len(lo.data.polygons), 'low faces', len(hi.data.polygons), 'high faces')
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 1; sc.cycles.device = 'CPU'
mat = lo.active_material; nt = mat.node_tree
img = bpy.data.images.new('baked_normal', size, size, alpha=False, float_buffer=False); img.colorspace_settings.name = 'Non-Color'
tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = img; tn.interpolation = 'Linear'
for n in nt.nodes: n.select = False
tn.select = True; nt.nodes.active = tn
bpy.ops.object.select_all(action='DESELECT'); hi.select_set(True); lo.select_set(True); bpy.context.view_layer.objects.active = lo
b = sc.render.bake; b.use_selected_to_active = True; b.cage_extrusion = ext; b.max_ray_distance = ext * 3; b.normal_space = 'TANGENT'; b.margin = 8
bpy.ops.object.bake(type='NORMAL'); log('baked', size)
# Normal-Map-Knoten auf das gebackene Bild umhängen (Stärke 1; K1 multipliziert ohnehin mit 0,45)
nm = [n for n in nt.nodes if n.type == 'NORMAL_MAP']
if nm:
    for l in list(nm[0].inputs['Color'].links): nt.links.remove(l)
    nt.links.new(tn.outputs['Color'], nm[0].inputs['Color']); log('normal map relinked')
else:
    nmn = nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(tn.outputs['Color'], nmn.inputs['Color']); nt.links.new(nmn.outputs['Normal'], nt.nodes['Principled BSDF'].inputs['Normal']); log('normal map created')
img.filepath_raw = out.replace('.glb', '_normal.png'); img.file_format = 'PNG'; img.save(); img.pack()
bpy.data.objects.remove(hi)
bpy.ops.object.select_all(action='DESELECT'); lo.select_set(True); bpy.context.view_layer.objects.active = lo
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='WEBP', export_image_quality=90, export_yup=True, use_selection=True, export_materials='EXPORT', export_animations=False)
log('BAKE_OK', out)
