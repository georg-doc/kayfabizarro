import bpy
import json
import hashlib
from pathlib import Path

ROOT = Path('/private/tmp/kfb-wsa-stairs-r2/output')
GLB = ROOT / 'KFB_TOWN_CASTLE_CLAY_STAIRS_R2.glb'
EXPECTED = {
    'KFB_ClayStair_Core',
    'KFB_ClayStair_Wall_L',
    'KFB_ClayStair_Wall_R',
    'KFB_ClayStair_Buttress_L',
    'KFB_ClayStair_Buttress_R',
}

bpy.ops.wm.read_factory_settings(use_empty=True)
result = bpy.ops.import_scene.gltf(filepath=str(GLB))
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']

objects = []
total_triangles = 0
world_min = [float('inf')] * 3
world_max = [float('-inf')] * 3
material_colors = {}

for obj in meshes:
    obj.data.calc_loop_triangles()
    triangles = len(obj.data.loop_triangles)
    total_triangles += triangles
    corners = [obj.matrix_world @ v.co for v in obj.data.vertices]
    mins = [min(v[i] for v in corners) for i in range(3)]
    maxs = [max(v[i] for v in corners) for i in range(3)]
    world_min = [min(world_min[i], mins[i]) for i in range(3)]
    world_max = [max(world_max[i], maxs[i]) for i in range(3)]
    mats = []
    for mat in obj.data.materials:
        mats.append(mat.name)
        bsdf = mat.node_tree.nodes.get('Principled BSDF') if mat.use_nodes else None
        if bsdf:
            material_colors[mat.name] = [round(v, 5) for v in bsdf.inputs['Base Color'].default_value[:4]]
    objects.append({
        'name': obj.name,
        'vertices_after_import': len(obj.data.vertices),
        'triangles': triangles,
        'materials': mats,
        'bounds_blender_z_up': {'min': [round(v, 5) for v in mins], 'max': [round(v, 5) for v in maxs]},
    })

names = {o.name for o in meshes}
payload = {
    'validator': 'Blender 5.2.2 clean-scene glTF re-import',
    'import_result': sorted(result),
    'file': GLB.name,
    'bytes': GLB.stat().st_size,
    'sha256': hashlib.sha256(GLB.read_bytes()).hexdigest(),
    'mesh_objects': len(meshes),
    'mesh_identity_preserved': names == EXPECTED,
    'missing_meshes': sorted(EXPECTED - names),
    'unexpected_meshes': sorted(names - EXPECTED),
    'objects': sorted(objects, key=lambda item: item['name']),
    'total_triangles': total_triangles,
    'material_base_colors_after_import': material_colors,
    'non_black_materials': all(sum(color[:3]) > 0.1 for color in material_colors.values()),
    'cameras': len([o for o in bpy.context.scene.objects if o.type == 'CAMERA']),
    'lights': len([o for o in bpy.context.scene.objects if o.type == 'LIGHT']),
    'bounds_blender_z_up_after_import': {
        'min': [round(v, 5) for v in world_min],
        'max': [round(v, 5) for v in world_max],
    },
    'coordinate_note': 'glTF/GLB is Y-up by specification; Blender converts imported data to its internal Z-up view.',
    'material_note': 'Procedural Blender surface is render evidence; GLB intentionally retains safe Family-A base-color fallback.',
}
(ROOT / 'export_validation_r2.json').write_text(json.dumps(payload, indent=2) + '\n', encoding='utf-8')
print(json.dumps(payload, indent=2))
