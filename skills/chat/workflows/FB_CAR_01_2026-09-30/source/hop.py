# FB-CAR-01 step 2 (Georg's pick): cartoon hop over the cabrio's side wall, in and out. Door stays shut.
import bpy, math, pickle, json, sys
from mathutils import Matrix, Vector, Quaternion
PEAK=float(sys.argv[sys.argv.index('--')+1]) if '--' in sys.argv else 1.25
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_ik_0.10.blend')
sc=bpy.context.scene; A=bpy.data.objects['FB_Rig']; A.animation_data_clear(); A.rotation_mode='QUATERNION'
P=pickle.load(open('/tmp/fbcar/poses.pkl','rb'))
conv=lambda p:{b:(Quaternion(q),Vector(l)) for b,(q,l) in p.items()}
DRV=[conv(p) for p in P['DRV']]; STAND=conv(P['ENT'][0]); SEAT_M=Matrix(P['SEAT_M'])
ss=lambda t:0 if t<=0 else 1 if t>=1 else t*t*(3-2*t)
def setpose(p):
    for b,(q,l) in p.items(): A.pose.bones[b].rotation_quaternion=q; A.pose.bones[b].location=l
def local_hips(p):
    setpose(p); A.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update(); return A.pose.bones['hips'].head.copy()
def feet_drop(p):   # hips height above lowest foot point in pose-local space
    setpose(p); A.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update()
    return A.pose.bones['hips'].head.z-min(A.pose.bones[f'toes.{s}'].head.z for s in 'lr')
def blend_pose(a,b,t): return {k:(a[k][0].slerp(b[k][0],t),a[k][1].lerp(b[k][1],t)) for k in a}
def objmat(pose,hips_world,yaw):
    R=Matrix.Rotation(math.radians(yaw),4,'Z'); h=R@local_hips(pose); return Matrix.Translation(hips_world-h)@R
sc.frame_set(1); bpy.context.view_layer.update()
for n in ('Window.2','Window'):   # side windows rolled down (cabrio, roof open)
    o=bpy.data.objects[n]; o.hide_render=True; o.hide_viewport=True
setpose(DRV[0]); A.matrix_world=SEAT_M; bpy.context.view_layer.update(); HD=A.matrix_world@A.pose.bones['hips'].head
WZ=min((o.matrix_world@Vector(c)).z for o in bpy.data.objects if o.type=='MESH' and o.name.startswith('Wheel') for c in o.bound_box)
STAND_H=WZ+feet_drop(STAND)+0.03
OUTX=-2.75
TL=[]
CROUCH=blend_pose(STAND,DRV[0],0.45)
def seg_in(TL):
    for i in range(20): TL.append((STAND,objmat(STAND,Vector((OUTX,HD.y,STAND_H)),90),0))
    for i in range(12):
        t=ss((i+1)/12); p=blend_pose(STAND,CROUCH,t); TL.append((p,objmat(p,Vector((OUTX,HD.y,STAND_H-0.14*t)),90),0))
    P0=Vector((OUTX,HD.y,STAND_H-0.14)); P2=HD.copy(); P1=Vector(((P0.x+P2.x)/2-0.15,HD.y,PEAK*2-(P0.z+P2.z)/2))
    for i in range(20):
        t=(i+1)/20; q=1-t; h=q*q*P0+2*q*t*P1+t*t*P2; p=blend_pose(CROUCH,DRV[0],ss(min(1,t*2.5)))
        TL.append((p,objmat(p,h,90+90*ss(t)),0))
    for i in range(10):
        t=(i+1)/10; dip=-0.07*math.sin(math.pi*t); TL.append((DRV[0],objmat(DRV[0],HD+Vector((0,0,dip)),180),ss(t)))
seg_in(TL); m_in=len(TL)
for p in DRV: TL.append((p,SEAT_M,1.0))
m_drv=len(TL)
# exit: dip in seat, fly out to the left, land standing facing away (-X), settle
for i in range(10):
    t=(i+1)/10; TL.append((DRV[-1],objmat(DRV[-1],HD+Vector((0,0,-0.07*ss(t))),180),1-ss(t)))
P0=HD+Vector((0,0,-0.07)); P2=Vector((OUTX,HD.y,STAND_H-0.14)); P1=Vector(((P0.x+P2.x)/2-0.15,HD.y,PEAK*2-(P0.z+P2.z)/2))
for i in range(20):
    t=(i+1)/20; q=1-t; h=q*q*P0+2*q*t*P1+t*t*P2; p=blend_pose(DRV[-1],CROUCH,ss(max(0,(t-0.5)*2)))
    TL.append((p,objmat(p,h,180+90*ss(t)),0))
for i in range(12):
    t=ss((i+1)/12); p=blend_pose(CROUCH,STAND,t); TL.append((p,objmat(p,Vector((OUTX,HD.y,STAND_H-0.14*(1-t))),270),0))
for i in range(20): TL.append((STAND,objmat(STAND,Vector((OUTX,HD.y,STAND_H)),270),0))
iks=[A.pose.bones[f'lowerarm.{s}'].constraints[0] for s in 'lr']
for f,(p,Mo,ik) in enumerate(TL,start=1):
    l,r,s=Mo.decompose(); A.location=l; A.rotation_quaternion=r; A.keyframe_insert('location',frame=f); A.keyframe_insert('rotation_quaternion',frame=f)
    for b,(q,lc) in p.items():
        pb=A.pose.bones[b]; pb.rotation_quaternion=q; pb.keyframe_insert('rotation_quaternion',frame=f)
        if b=='hips': pb.location=lc; pb.keyframe_insert('location',frame=f)
    for c in iks: c.influence=ik; c.keyframe_insert('influence',frame=f)
MARK=dict(standIn=(1,20),crouchIn=(21,32),hopIn=(33,52),landIn=(53,62),drive=(m_in+1,m_drv),dipOut=(m_drv+1,m_drv+10),hopOut=(m_drv+11,m_drv+30),landOut=(m_drv+31,m_drv+42),standOut=(m_drv+43,len(TL)))
sc.frame_start=1; sc.frame_end=len(TL); sc.render.fps=30
json.dump(dict(marks=MARK,peak=PEAK,outX=OUTX,standH=STAND_H,seatHips=list(HD),groundZ=WZ),open('/tmp/fbcar/hop_marks.json','w')); print('MARK',MARK)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/fbcar/fb_car_hop.blend')
