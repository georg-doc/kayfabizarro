import bpy, json, sys
rig, tobj, fname = sys.argv[-3], sys.argv[-2], sys.argv[-1]
ids = json.load(open('/tmp/ml7/files.json'))[fname]
bpy.ops.wm.open_mainfile(filepath='/tmp/ml7/KFB_MOTION_LIBRARY_07.blend')
keep = []
for a in list(bpy.data.actions):
    n = a.name
    if n.endswith('__' + rig) and n[:-len(rig) - 2] in ids: a.name = n[:-len(rig) - 2]; keep.append(a.name)
    else: bpy.data.actions.remove(a)
ob = bpy.data.objects[tobj]; ob.name = rig
if not ob.animation_data: ob.animation_data_create()
ob.animation_data.action = None
for o in bpy.data.objects: o.select_set(False)
ob.select_set(True); bpy.context.view_layer.objects.active = ob
import os; os.makedirs(f'/tmp/ml7/out/libs/{rig}', exist_ok=True)
bpy.ops.export_scene.gltf(filepath=f'/tmp/ml7/out/libs/{rig}/{fname}', export_format='GLB', use_selection=True, export_animations=True, export_animation_mode='ACTIONS', export_yup=True, export_apply=False, export_skins=False, export_image_format='NONE', export_cameras=False, export_lights=False)
print('EXPORTED', rig, fname, len(keep), sorted(keep) == sorted(ids))
