import bpy,sys,json,os
from mathutils import Vector
glb,jobs,scale,outdir,res=sys.argv[1:6]; jobs=json.load(open(jobs)); scale=float(scale); res=int(res)
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
bpy.ops.mesh.primitive_plane_add(size=200); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=res; sc.render.resolution_y=res
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'
acts={a.name:a for a in bpy.data.actions}; os.makedirs(outdir,exist_ok=True)
for j in jobs:
    a=[v for k,v in acts.items() if k.startswith(j['clip'])][0]
    arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0=int(a.frame_range[0])
    for k,f in enumerate(j['frames']):
        sc.frame_set(f0+f); bpy.context.view_layer.update()
        hp=arm.matrix_world@arm.pose.bones['hips'].head
        cam.data.ortho_scale=j.get('ortho',2.9)*scale
        L=Vector((2.4,-4.6,1.7))*scale+Vector((hp.x,hp.y,0)); tgt=Vector((hp.x,hp.y,j.get('tz',0.95)*scale)); cam.location=L
        cam.rotation_euler=(tgt-L).to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=f"{outdir}/{j['clip']}__{k}.png"; bpy.ops.render.render(write_still=True)
