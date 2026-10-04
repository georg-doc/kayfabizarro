# Audit ear deformation over a grid of dangle states: self-intersection, ear-into-head, edge strain. Usage: audit.py <glb> <tag>
import bpy, bmesh, numpy as np, math, json, sys
from mathutils import Euler, Vector
from mathutils.bvhtree import BVHTree
GLB,TAG=sys.argv[-2],sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
A=bpy.data.objects['Rig']
for pb in A.pose.bones: pb.rotation_mode='QUATERNION'
EAR=bpy.data.objects['FB_Ear_L_v5']; HEAD=bpy.data.objects['CharacterTemplate_Head']
import os
SH=json.loads(os.environ.get('SH','[0.2083,0.3333,0.4583]'))
def pose(tip,roll):
    for j in range(3): A.pose.bones[f'ear.l.{j+1}'].rotation_quaternion=Euler((math.radians(tip*SH[j]),0,math.radians(roll*SH[j]))).to_quaternion()
    bpy.context.view_layer.update()
def mesh_world(o):
    dg=bpy.context.evaluated_depsgraph_get(); e=o.evaluated_get(dg); me=e.to_mesh(); bm=bmesh.new(); bm.from_mesh(me); bm.transform(e.matrix_world); e.to_mesh_clear()
    bmesh.ops.triangulate(bm,faces=bm.faces); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table(); return bm
pose(0,0); B0=mesh_world(EAR); E0=np.array([(e.verts[0].co-e.verts[1].co).length for e in B0.edges])
HB=mesh_world(HEAD); hbvh=BVHTree.FromBMesh(HB)
b1=A.data.bones['ear.l.1']; root=A.matrix_world@b1.head_local; ax=(A.matrix_world@b1.matrix_local).col[1].xyz.normalized()
far=np.array([ (v.co-root).dot(ax)>0.12 for v in B0.verts])          # ear blade, away from the root (the root legitimately sits in the head)
def audit(tip,roll):
    pose(tip,roll); B=mesh_world(EAR); bvh=BVHTree.FromBMesh(B)
    fv=[set(v.index for v in f.verts) for f in B.faces]
    pairs=[(i,j) for i,j in bvh.overlap(bvh) if i<j and not (fv[i]&fv[j])]
    E=np.array([(e.verts[0].co-e.verts[1].co).length for e in B.edges]); strain=E/np.maximum(E0,1e-9)-1
    inside=0
    for i,v in enumerate(B.verts):
        if not far[i]: continue
        loc,n,_,dd=hbvh.find_nearest(v.co)
        if loc is not None and (v.co-loc).dot(n)<-0.002: inside+=1
    B.free()
    return dict(tip=tip,roll=roll,selfX=len(pairs),intoHead=inside,strainMax=round(float(np.abs(strain).max()),3),compressP99=round(float(-np.percentile(strain,1)),3))
R=[]
for tip in json.loads(os.environ.get('TIPS','[-90,-60,-30,0,30,60,90,110,135,160]')):
    for roll in (-45,0,45):
        r=audit(tip,roll); R.append(r); print(TAG,r,flush=True)
json.dump(R,open(f'/tmp/fbr/audit_{TAG}.json','w'),indent=0)
