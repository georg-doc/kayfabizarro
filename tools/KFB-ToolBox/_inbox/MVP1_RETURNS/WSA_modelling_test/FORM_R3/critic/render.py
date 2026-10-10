import bpy,json
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/private/tmp/kfb-wsa-stairs-r3/output/KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb')
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
mat=bpy.data.materials.new('critic_neutral');mat.diffuse_color=(.48,.48,.48,1)
for o in objects:
 o.data.materials.clear();o.data.materials.append(mat)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('critic_world');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.2,.2,.2,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.8
for loc,power,size in [((0,-10,25),2600,20),((-15,15,18),1800,15)]:
 bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.rotation_euler=(Vector((0,8,2))-l.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;cam.data.type='ORTHO';scene.camera=cam
cams=json.load(open('/private/tmp/kfb-wsa-stairs-r3/output/camera_lock.json'))
for name in ['three_quarter','front','side','pedestal_detail','upper_detail']:
 loc,target,scale=cams[name];cam.location=loc;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=scale
 scene.render.filepath='/private/tmp/kfb-wsa-stairs-r3/critic/'+name+'.png';bpy.ops.render.render(write_still=True)
json.dump({'clean_import':True,'mesh_objects':len(objects),'names':[o.name for o in objects]},open('/private/tmp/kfb-wsa-stairs-r3/critic/import.json','w'),indent=2)
