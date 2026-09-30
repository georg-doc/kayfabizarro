import bpy, numpy as np
from mathutils import Vector
ORDER=['hatchback','cabrio','pickup','sportster','sedan','estate','transporter','truck']
def setup():
    sc=bpy.context.scene; sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=True
    sc.render.resolution_x=400; sc.render.resolution_y=300; w=bpy.data.worlds.new('w'); sc.world=w; w.color=(0.93,0.93,0.9)
    ims=sc.render.image_settings
    if hasattr(ims,'media_type'): ims.media_type='IMAGE'
    cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=35
    return sc,cam
def shot(sc,cam,t,off,p):
    cam.location=t+off; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(t-cam.location).to_track_quat('-Z','Y')
    sc.render.filepath=p; bpy.ops.render.render(write_still=True)
for car in ORDER:
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/kfb_glb_v2/KFB_CVP1_{car}.glb')
    sc,cam=setup(); big=car in('transporter','truck')
    t=Vector((0,0.2,0.9 if big else 0.7)); k=1.25 if big else 1.0
    shot(sc,cam,t,Vector((-4.6*k,5.2*k,2.4*k)),f'/tmp/veh/v2/{car}.png')
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath='/tmp/veh/kfb_glb_v2/KFB_CVP1_cabrio.glb')
sc,cam=setup()
for fr in (0,24,52):
    sc.frame_set(fr); shot(sc,cam,Vector((0,-0.2,0.7)),Vector((-4.8,-4.0,3.2)),f'/tmp/veh/v2/cabrio_f{fr:03d}.png')
