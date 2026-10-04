# Render FB Ear Rig v5 posed from Motion Library clips (delta retarget of Rig_Medium) with the simulated ear angles.
import sys; sys.path.insert(0,'/tmp/fbr'); sys.path.insert(0,'/tmp/ch1')
import bpy, numpy as np, math, json, glb
from mathutils import Matrix, Vector, Quaternion, Euler
from sim import *
bpy.ops.wm.read_factory_settings(use_empty=True)
import os
GLB=os.environ.get('GLB','/tmp/fbr/FB_TEMPLATE_LOOK_v5b.glb'); VIEW=os.environ.get('VIEW','side'); ONLY=os.environ.get('ONLY','')
bpy.ops.import_scene.gltf(filepath=GLB)
for n in ('Icosphere',):
    if n in bpy.data.objects: bpy.data.objects[n].hide_render=True
A=bpy.data.objects['Rig']
for pb in A.pose.bones:
    pb.rotation_mode='QUATERNION'
    for c in pb.constraints: c.mute=True
# clip rest (node default TRS) in the same Blender frame as clip_world
def clip_rest(path):
    J,acc=glb.load(path); nodes=J['nodes']; parent={}
    for i,n in enumerate(nodes):
        for c in n.get('children',[]): parent[c]=i
    L={}
    for i,n in enumerate(nodes):
        tr=n.get('translation',[0,0,0]); r=n.get('rotation',[0,0,0,1]); s=n.get('scale',[1,1,1])
        L[i]=Matrix.Translation(Vector(tr))@Quaternion((r[3],r[0],r[1],r[2])).to_matrix().to_4x4()@Matrix.Diagonal((*s,1))
    W={}
    def w(i):
        if i in W: return W[i]
        W[i]=(w(parent[i])@L[i]) if i in parent else L[i]; return W[i]
    C=Matrix.Rotation(math.pi/2,4,'X')
    return {nodes[i].get('name',str(i)):C@w(i) for i in range(len(nodes))}
REST={b.name:A.matrix_world@b.matrix_local for b in A.data.bones}
def pose_body(Wc,Rc):
    M={}
    for b in A.data.bones:   # parents first (bones are ordered root->leaf in Blender)
        n=b.name
        if b.parent is None or n.startswith(('IK','control','heelIK','elbowIK','handIK','kneeIK')) or n.startswith('ear.'):
            Mt=(M[b.parent.name]@(REST[b.parent.name].inverted()@REST[n])) if b.parent else REST[n]
        elif n in Wc and n in Rc:
            dR=(Wc[n].to_3x3()@Rc[n].to_3x3().inverted())
            rot=(dR@REST[n].to_3x3()).normalized()
            if n=='hips': pos=REST[n].translation+(Wc[n].translation-Rc[n].translation)
            else: pos=(M[b.parent.name]@(REST[b.parent.name].inverted()@REST[n])).translation
            Mt=Matrix.Translation(pos)@rot.to_4x4()
        else:
            Mt=M[b.parent.name]@(REST[b.parent.name].inverted()@REST[n])
        M[n]=Mt
        rel=(REST[b.parent.name].inverted()@REST[n]) if b.parent else REST[n]
        basis=(rel.inverted()@(M[b.parent.name].inverted()@Mt)) if b.parent else REST[n].inverted()@Mt
        pb=A.pose.bones[n]; pb.rotation_quaternion=basis.to_quaternion(); pb.location=basis.translation
    return M
def pose_ears(o):
    """o: [3][2] (pitch x, roll z) for L; R uses the same array from the mirrored sim. Rotation about each ear bone's local x (tip forward) and z."""
    for side,arr in (('l',o[0]),('r',o[1])):
        for j in range(3):
            x,z=arr[j]; pb=A.pose.bones[f'ear.{side}.{j+1}']
            pb.rotation_quaternion=Euler((x,0,z*(1 if side=='l' else -1))).to_quaternion()
# scene
sc=bpy.context.scene; sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'
base=np.array([0xf2,0xc9,0x3c])/255
for o in bpy.data.objects:
    if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith('FB_Yellow'): o.data.materials[0].diffuse_color=(*base,1)
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
sc.render.resolution_x=320; sc.render.resolution_y=320
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'
def shot(tgt,view='side'):
    cam.data.lens=50
    cam.location=tgt+(Vector((4.0,0.0,0.15)) if view=='side' else Vector((2.9,-2.9,0.5)))
    cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(tgt-cam.location).to_track_quat('-Z','Y')
    p='/tmp/fbr/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
def save(rows,path):
    full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=path; img.file_format='PNG'; img.save()
exec(open('/tmp/fbr/cfg.py').read())   # CFG
up=np.array([0,1.0,0])
COLS=[('idle bob','kfb_idle_idle_b',1,None,'maxabs'),('bent over','kfb_action_lifting_a',1,None,1.75),('rising (follow-through)','kfb_action_lifting_a',1,None,2.25),('racer 12 m/s','kfb_idle_idle_b',1,lambda i:up*12.0,6.0)]
cache={}
rows=[]
for cn,e in CFG.items():
    if ONLY and not cn.startswith(ONLY) or (not ONLY and cn.startswith('today')): continue
    row=[]
    for title,cid,loops,wind,when in COLS:
        if cid not in cache:
            G=glb.clip_world(libpath(cid),cid,fps=FPS); cache[cid]=(G,clip_rest(libpath(cid)))
        G,Rc=cache[cid]
        P=np.array([np.array(fr['head'].translation) for fr in G]); Q=[fr['head'].to_quaternion() for fr in G]
        wd=None if cn.startswith('today') else wind
        oL=simulate(P,Q,e,wd,side=1); oR=simulate(P,Q,e,wd,side=-1)
        if when=='maxabs':
            tip=oL[:,:,0].sum(1); tip[:FPS]=0; i=int(np.argmax(np.abs(tip)))
        else: i=min(len(G)-1,int(when*FPS))
        pose_body(G[i],Rc); pose_ears([oL[i],oR[i]]); bpy.context.view_layer.update()
        hh=A.matrix_world@A.pose.bones['head'].head; ht=A.matrix_world@A.pose.bones['ear.l.1'].head
        c=(hh+ht)/2
        row.append(shot(Vector((0,c.y,c.z+0.2)),VIEW))
        print(cn[:8],title,'frame',i,'tipL',round(math.degrees(oL[i,:,0].sum()),1))
    rows.append(np.concatenate(row,axis=1))
save(rows,f'/tmp/fbr/ears_{VIEW}_{os.path.basename(GLB)[:-4]}_{ONLY or "presets"}.png')
