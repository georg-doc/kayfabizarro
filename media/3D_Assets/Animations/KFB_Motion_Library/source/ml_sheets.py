
import bpy, json, math, os
import numpy as np
from mathutils import Vector
ML='/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/MOTION_LIB/'
def setup_render():
    sc=bpy.context.scene
    sc.render.engine='BLENDER_WORKBENCH'; sc.display.shading.light='STUDIO'; sc.display.shading.color_type='TEXTURE'
    sc.render.resolution_x=sc.render.resolution_y=220; sc.render.resolution_percentage=100
    ims=sc.render.image_settings
    if hasattr(ims,'media_type'): ims.media_type='IMAGE'
    ims.file_format='PNG'; ims.color_mode='RGB'
    sc.render.film_transparent=False
    cam=bpy.data.objects.get('ml_cam')
    if not cam:
        cam=bpy.data.objects.new('ml_cam',bpy.data.cameras.new('ml_cam')); sc.collection.objects.link(cam)
    cam.data.lens=50; sc.camera=cam
    fl=bpy.data.objects.get('ml_floor')
    if not fl:
        me=bpy.data.meshes.new('ml_floor'); s=40
        me.from_pydata([(-s,-s,0),(s,-s,0),(s,s,0),(-s,s,0)],[],[(0,1,2,3)]); fl=bpy.data.objects.new('ml_floor',me); sc.collection.objects.link(fl)
    for n in ('Rig_Raider','Rig_Brute'):
        o=bpy.data.objects[n]
        for c in [o]+list(o.children): c.hide_viewport=False; c.hide_render=True
    return cam
def show_only(tname):
    for n in ('Rig_Raider','Rig_Brute'):
        o=bpy.data.objects[n]
        for c in [o]+list(o.children): c.hide_render=(n!=tname)
def assign(tname,act):
    T=bpy.data.objects[tname]
    if not T.animation_data: T.animation_data_create()
    T.animation_data.action=act; T.animation_data.action_slot=act.slots[0]
def sheet(cid,rigs={'Rig_Medium':'Rig_Raider','Rig_Large':'Rig_Brute'}):
    sc=bpy.context.scene; cam=bpy.data.objects['ml_cam']
    rows=[]
    for rig,tname in rigs.items():
        act=bpy.data.actions[cid+'__'+rig]; assign(tname,act); show_only(tname)
        T=bpy.data.objects[tname]; H={'Rig_Raider':1.9,'Rig_Brute':3.9}[tname]
        n=int(act.frame_range[1]); fr=[1+round(i*(n-1)/5) for i in range(6)]
        tiles=[]
        for f in fr:
            sc.frame_set(f)
            r=T.matrix_world@T.pose.bones['hips'].head
            tgt=Vector((r.x,r.y,max(r.z,H*0.2)+H*0.2))
            cam.location=tgt+Vector((H*1.0,-H*1.8,H*0.45))
            cam.rotation_euler=(tgt-cam.location).to_track_quat('-Z','Y').to_euler()
            p=ML+'sheets/_tmp.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
            im=bpy.data.images.load(p,check_existing=False)
            a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)
            bpy.data.images.remove(im); tiles.append(a)
        rows.append(np.concatenate(tiles,axis=1))
    full=np.concatenate(rows[::-1],axis=0)   # pixels are bottom-up: first rig ends on top
    H,W=full.shape[:2]
    img=bpy.data.images.new('sheet',W,H); img.pixels.foreach_set(full.ravel())
    img.filepath_raw=ML+'sheets/'+cid+'.png'; img.file_format='PNG'; img.save(); bpy.data.images.remove(img)
    return ML+'sheets/'+cid+'.png'
