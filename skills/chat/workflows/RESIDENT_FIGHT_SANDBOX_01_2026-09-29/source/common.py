import bpy, sys, json, math, os
import numpy as np
from mathutils import Matrix, Vector, Quaternion
sys.path.insert(0,'/tmp/ch1'); import glb
CAT=json.load(open('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/KFB_Motion_Library.catalog.json'))
C={c['id']:c for c in CAT['clips']}
RIGS={'Rig_Medium':'Rig_Raider','Rig_Large':'Rig_Brute'}
PFX={'Rig_Medium':'OrcRaider_','Rig_Large':'OrcBrute_'}
def path(rel):
    for base in ('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/','/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/'):
        if os.path.exists(base+rel): return base+rel
    raise FileNotFoundError(rel)
_G={}
def frames(rig,cid):
    k=(rig,cid)
    if k not in _G:
        G=glb.clip_world(path(C[cid]['library'][rig]),cid)
        off=Matrix.Translation(-G[0][rig].translation)
        _G[k]=[{n:off@m for n,m in fr.items()} for fr in G]
    return _G[k]
def open_ws():
    bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01.blend')
    sc=bpy.context.scene; CORR={}
    for rig,tn in RIGS.items():
        T=bpy.data.objects[tn]; T.rotation_mode='QUATERNION'; T.rotation_quaternion=(1,0,0,0); T.location=(0,0,0); T.scale=(1,1,1)
        for pb in T.pose.bones: pb.rotation_mode='QUATERNION'
        if not T.animation_data: T.animation_data_create()
        a0=bpy.data.actions['kfb_idle_breathing_a__'+rig]; T.animation_data.action=a0; T.animation_data.action_slot=a0.slots[0]
        G=frames(rig,'kfb_idle_breathing_a'); corr={}
        sc.frame_set(1); bpy.context.view_layer.update()
        for b in T.data.bones: corr[b.name]=G[0][b.name].inverted()@(T.matrix_world@T.pose.bones[b.name].matrix)
        T.animation_data.action=None
        CORR[rig]=corr
    return CORR
def pose(rig,W,CORR):
    T=bpy.data.objects[RIGS[rig]]; corr=CORR[rig]
    rest={b.name:b.matrix_local for b in T.data.bones}
    M={n:W[n]@corr[n] for n in rest}
    for b in T.data.bones:
        n=b.name
        Bm=((rest[b.parent.name].inverted()@rest[n]).inverted()@M[b.parent.name].inverted()@M[n]) if b.parent else rest[n].inverted()@M[n]
        pb=T.pose.bones[n]; pb.rotation_quaternion=Bm.to_quaternion(); pb.location=Bm.translation; pb.scale=(1,1,1)
    bpy.context.view_layer.update()
def verts(rig):
    dg=bpy.context.evaluated_depsgraph_get(); out={}
    for o in bpy.data.objects:
        if o.type=='MESH' and o.parent and o.parent.name==RIGS[rig]:
            e=o.evaluated_get(dg); me=e.to_mesh()
            a=np.empty(len(me.vertices)*3); me.vertices.foreach_get('co',a); a=a.reshape(-1,3)
            mw=np.array(e.matrix_world); a=a@mw[:3,:3].T+mw[:3,3]
            out[o.name[len(PFX[rig]):]]=a; e.to_mesh_clear()
    return out
