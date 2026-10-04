import bpy, math, numpy as np
from mathutils import Vector, Matrix, Quaternion
sc=bpy.context.scene
def setup(res=260):
    sc.render.engine='BLENDER_WORKBENCH'; sc.display.shading.light='STUDIO'; sc.display.shading.color_type='TEXTURE'
    sc.render.resolution_x=sc.render.resolution_y=res; sc.render.resolution_percentage=100
    ims=sc.render.image_settings
    if hasattr(ims,'media_type'): ims.media_type='IMAGE'
    ims.file_format='PNG'; ims.color_mode='RGB'
    cam=bpy.data.objects['ml_cam']; cam.data.lens=50; sc.camera=cam
    for n in ('Rig_Raider','Rig_Brute'):
        o=bpy.data.objects[n]
        for c in [o]+list(o.children): c.hide_render=(n!='Rig_Raider')
    return cam
def use(ob,a):
    if not ob.animation_data: ob.animation_data_create()
    ob.animation_data.action=a; ob.animation_data.action_slot=a.slots[0]
def nfr(a): return int(a.frame_range[1])
def pose_arm(ob,a,f):
    use(ob,a); sc.frame_set(int(f)); bpy.context.view_layer.update()
    return {n:pb.matrix.copy() for n,pb in ob.pose.bones.items()}
def render_tile():
    p='/tmp/ch1/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False)
    a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
def save(rows,path):
    full=np.concatenate(rows[::-1],axis=0); H,W=full.shape[:2]
    img=bpy.data.images.new('s',W,H); img.pixels.foreach_set(full.ravel()); img.filepath_raw=path; img.file_format='PNG'; img.save(); bpy.data.images.remove(img)
def new_action(name,obname,frames,bones):
    a=bpy.data.actions.get(name)
    if a: bpy.data.actions.remove(a)
    a=bpy.data.actions.new(name); a.use_fake_user=True
    slot=a.slots.new(id_type='OBJECT',name=obname)
    cb=a.layers.new('L').strips.new(type='KEYFRAME').channelbag(slot,ensure=True)
    for n in bones:
        dp=f'pose.bones["{n}"]'
        cq=[cb.fcurves.new(dp+'.rotation_quaternion',index=i) for i in range(4)]; cl=[cb.fcurves.new(dp+'.location',index=i) for i in range(3)]
        prev=None
        for i,B in enumerate(frames):
            q=B[n].to_quaternion()
            if prev is not None and q.dot(prev)<0: q=-q
            prev=q
            for j in range(4): cq[j].keyframe_points.insert(i+1,q[j],options={'FAST'})
            for j in range(3): cl[j].keyframe_points.insert(i+1,B[n].translation[j],options={'FAST'})
    return a
