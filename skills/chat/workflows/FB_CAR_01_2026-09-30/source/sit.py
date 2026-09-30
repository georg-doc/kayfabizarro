# FB-CAR-01 step 1: FrizzleBob v5b seated in the open cabrio (KFB x1.8), driving clip retargeted, hands IK'd onto the wheel rim.
exec(open('/tmp/veh/fit.py').read().split("for car in CARS:")[0])
import os
from mathutils import Vector, Matrix
for o in kids(RA)+[RA]: bpy.data.objects.remove(o)
K=1.8
before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath='/tmp/veh/kfb_glb_v2/KFB_CVP1_cabrio.glb'); CAR=[o for o in bpy.data.objects if o not in before]
root=[o for o in CAR if o.parent is None and o.name.startswith('RootNode')][0]; root.scale=(K,K,K)
sc=bpy.context.scene; sc.frame_set(52); bpy.context.view_layer.update()   # roof open
M=lambda p:[o for o in CAR if o.type=='MESH' and o.name.startswith(p)]
seat=M('SeatL')[0]; place_at_seat=None
# seat placement as in fit.py
bb=[seat.matrix_world@Vector(c) for c in seat.bound_box]; lo=Vector(map(min,*bb)); hi=Vector(map(max,*bb))
st=BVHTree.FromBMesh(bm_world([seat])); px,py=(lo.x+hi.x)/2,(lo.y+hi.y)/2+0.12*K
cz=st.ray_cast(Vector((px,py,hi.z+1)),Vector((0,0,-1)))[0].z
# wheel rim: PCA of Torus verts
tor=M('Torus')[0]; TV=verts([tor]); C=TV.mean(0); U,S,Vt=np.linalg.svd(TV-C); n=Vector(Vt[2]); 
if n.y<0: n=-n
R=float(np.median(np.linalg.norm((TV-C)-np.outer((TV-C)@Vt[2],Vt[2]),axis=1)))
up=Vector((0,0,1)); up=(up-n*up.dot(n)).normalized(); side=n.cross(up).normalized()
if side.x<0: side=-side
C=Vector(C)
def grip(clock_deg):   # 0 = 12 o'clock, +90 = 3 o'clock (car right)
    a=math.radians(clock_deg); return C+R*(up*math.cos(a)+side*math.sin(a))
print('WHEEL centre',[round(x,3) for x in C],'R',round(R,3),'normal',[round(x,3) for x in n])
# retarget full clip onto FB, keyframe body bones
FBA=FB; fr=len(G)
for f in range(0,fr,1):
    pose_body(FBA,G[f],Rc)
    for pb in FBA.pose.bones:
        if not pb.name.startswith(('IK','control','heelIK','elbowIK','handIK','kneeIK','ear.')):
            pb.keyframe_insert('rotation_quaternion',frame=f+1)
            if pb.name=='hips': pb.keyframe_insert('location',frame=f+1)
sc.frame_start=1; sc.frame_end=fr
sc.frame_set(fr//2); bpy.context.view_layer.update()
place('frizzlebob',(px,py),cz,K)
print('FRAMES',fr)
json.dump(dict(C=list(C),R=R,n=list(n),up=list(up),side=list(side),seat=[px,py,cz],frames=fr),open('/tmp/fbcar/wheel.json','w'))
bpy.ops.wm.save_as_mainfile(filepath='/tmp/fbcar/fb_car_step1.blend')
