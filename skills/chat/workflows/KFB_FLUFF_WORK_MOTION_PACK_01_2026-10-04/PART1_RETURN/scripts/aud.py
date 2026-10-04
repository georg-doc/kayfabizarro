import bpy, math, sys, json, os
from mathutils import Vector
glb,tag,clips,scale=sys.argv[1],sys.argv[2],sys.argv[3],float(sys.argv[4])
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
bpy.ops.mesh.primitive_plane_add(size=30); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.82,0.84,1); fl.data.materials.append(m)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=240; sc.render.resolution_y=280
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=3.0*scale
loc=Vector((2.2*scale,-3.0*scale,1.6*scale)); tgt=Vector((0,0,1.05*scale)); cam.location=loc; cam.rotation_euler=(tgt-loc).to_track_quat('-Z','Y').to_euler()
os.makedirs(f'/tmp/fluff/aud/{tag}',exist_ok=True)
acts={a.name:a for a in bpy.data.actions}
for c in clips.split(','):
    a=[v for k,v in acts.items() if k==c or k.startswith(c+'_') or k.startswith(c)]
    if not a: print('NOACT',c); continue
    a=a[0]; arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0,f1=a.frame_range
    for i,u in enumerate([0.1,0.35,0.6,0.85]):
        f=int(f0+(f1-f0)*u); sc.frame_set(f)
        # follow hips for travel clips
        hb=arm.pose.bones['hips']; hp=arm.matrix_world@hb.head
        cam.location=Vector((hp.x,hp.y,0))+loc; cam.rotation_euler=((Vector((hp.x,hp.y,0))+tgt)-cam.location).to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=f'/tmp/fluff/aud/{tag}/{c}__{i}.png'; bpy.ops.render.render(write_still=True)
