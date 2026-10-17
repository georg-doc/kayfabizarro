import bpy, math, json
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
acts=[('/tmp/f3/A_RobotOne.glb',-10.5),('/tmp/f3/A_SkeletonMinion.glb',-3.2),('/tmp/f3/A_OrcBrute.glb',4.4)]
for glb,x in acts:
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=glb,loglevel=50); new=[o for o in sc.objects if o not in before]
    arm=[o for o in new if o.type=='ARMATURE'][0]
    a=[v for k,v in bpy.data.actions.items() if k.startswith('kfb_fluff_place_small_a')][-1]
    arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    for o in new:
        if o.parent is None: o.location.x+=x; o.location.y+=0.8
sc.frame_set(1)
cols={'S':(0.95,0.7,0.2,1),'M':(0.55,0.41,0.78,1),'L':(0.30,0.62,0.40,1)}
import sys; sys.path.insert(0,'/tmp/f3'); from knead import kneaded
for i,(nm,r) in enumerate([('S',0.20),('M',2.17/3),('L',4.19/3)]):
    for x0 in (-10.5,-3.2,4.4):
        b=kneaded(nm,int(x0*10)+i); b.scale=(r,r,r); b.location=(x0+(1.3 if x0<4 else 2.1)+[0,0.75,2.85][i],0.8,r)
        m=bpy.data.materials.new(nm); m.diffuse_color=cols[nm]; b.data.materials.append(m)
bpy.ops.mesh.primitive_plane_add(size=80); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86); sc.render.resolution_x=2200; sc.render.resolution_y=760
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=24
cam.location=(0.9,-18,3.2); cam.rotation_euler=(Vector((0.9,0,2.6))-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.filepath='/tmp/f3/out/sizes_raw.png'; bpy.ops.render.render(write_still=True)
