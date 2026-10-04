# FB-CAR-01 step 3: joyride on a test loop. Car follows an oval with a hump; wheels spin, front wheels and steering wheel steer,
# FB (v5b look) drives with hands IK'd to the rim, leans out of turns, bounces on the hump; ears simulated (B Floppy, wind = -car velocity).
import bpy, math, json, pickle, sys, numpy as np
sys.path.insert(0,'/tmp/fbr'); sys.path.insert(0,'/tmp/ch1')
from mathutils import Matrix, Vector, Quaternion, Euler
import sim, cfg
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_ik_0.10.blend')
sc=bpy.context.scene; FR=360; FPS=30; sc.frame_start=1; sc.frame_end=FR; sc.render.fps=FPS
UNIT=0.616   # metres per rig unit (scale A)
for n in ('Window.2','Window'): bpy.data.objects[n].hide_render=True; bpy.data.objects[n].hide_viewport=True
A=bpy.data.objects['FB_Rig']; A.animation_data_clear(); A.rotation_mode='QUATERNION'
P=pickle.load(open('/tmp/fbcar/poses.pkl','rb')); DRV=[{b:(Quaternion(q),Vector(l)) for b,(q,l) in p.items()} for p in P['DRV']]
root=bpy.data.objects['RootNode']
rig=bpy.data.objects.new('CarRig',None); sc.collection.objects.link(rig)
def reparent(o,p):
    mw=o.matrix_world.copy(); o.parent=p; o.matrix_parent_inverse=p.matrix_world.inverted() if p else Matrix(); o.matrix_world=mw
for o in (root,A): reparent(o,rig)
sw=bpy.data.objects['SteeringWheel']; tor=bpy.data.objects['Torus']
for s in 'lr':
    reparent(bpy.data.objects[f'grip.{s}'],tor); reparent(bpy.data.objects[f'pole.{s}'],rig)
W=json.load(open('/tmp/fbcar/wheel.json')); WC=Vector(W['C']); WN=Vector(W['n'])
# ---- track: ellipse with a hump, arc-length parametrised
Aax,Bax=24.0,16.0; N=4000; th=np.linspace(0,2*np.pi,N,endpoint=False)
def hump(t): return 0.9*np.exp(-((((t-np.pi*1.5+np.pi)%(2*np.pi))-np.pi)/0.28)**2)
X=Aax*np.cos(th); Y=Bax*np.sin(th); Z=hump(th)
seg=np.sqrt(np.diff(np.r_[X,X[0]])**2+np.diff(np.r_[Y,Y[0]])**2+np.diff(np.r_[Z,Z[0]])**2); S=np.r_[0,np.cumsum(seg)][:-1]; L=S[-1]+seg[-1]
V=6.9/UNIT   # 25 km/h in rig units / s
def at(s):
    s=s%L; i=np.searchsorted(S,s)-1; i=max(0,i); j=(i+1)%N; f=(s-S[i])/seg[i]
    return np.array([X[i]+(X[j]-X[i])*f,Y[i]+(Y[j]-Y[i])*f,Z[i]+(Z[j]-Z[i])*f])
WZ=-0.797; WR=0.495; WB=2.5
rec=[]
for k in range(FR):
    s=V*k/FPS; p=at(s); pa=at(s+0.3); pb=at(s-0.3); t=(pa-pb)/0.6; t/=np.linalg.norm(t)
    heading=math.atan2(-t[0],t[1]); pitch=math.asin(max(-1,min(1,t[2])))
    h1=math.atan2(-(at(s+0.6)-p)[0],(at(s+0.6)-p)[1]); h0=math.atan2(-(p-at(s-0.6))[0],(p-at(s-0.6))[1])
    dh=(h1-h0+math.pi)%(2*math.pi)-math.pi; kappa=dh/1.2
    rec.append(dict(p=p,heading=heading,pitch=pitch,kappa=kappa,s=s))
# smoothed lateral accel & vertical accel (rig units)
lat=np.array([V*V*r['kappa'] for r in rec]); zs=np.array([r['p'][2] for r in rec]); vz=np.gradient(zs,1/FPS); az=np.gradient(vz,1/FPS)
# spring-lagged bounce for the body inside the car
b=0; bv=0; bounce=[]
for k in range(FR):
    bv+=(-60*b-7*bv-az[k]*0.9)/FPS; b+=bv/FPS; bounce.append(b)
roll_car=[-0.012*l for l in lat]          # body roll (rad), outwards
for k,r in enumerate(rec):
    R=Matrix.Rotation(r['heading'],4,'Z')@Matrix.Rotation(r['pitch'],4,'X')@Matrix.Rotation(roll_car[k],4,'Y')
    rig.matrix_world=Matrix.Translation(Vector((r['p'][0],r['p'][1],r['p'][2]-WZ)))@R
    rig.keyframe_insert('location',frame=k+1); rig.keyframe_insert('rotation_euler',frame=k+1)
# ---- wheels, steering, FB pose (computed in car space; rig is a parent so these are local)
rig_saved=[rig.matrix_world.copy()]
wheels={n:bpy.data.objects[n] for n in ('WheelFL','WheelFR','WheelRL','WheelRR')}
sc.frame_set(1)
# do car-space math with the rig at identity
rig.animation_data_clear() if False else None
REST={}
act=rig.animation_data.action; rig.animation_data.action=None; rig.matrix_world=Matrix.Identity(4); bpy.context.view_layer.update()
for n,o in wheels.items():
    bb=[o.matrix_world@Vector(c) for c in o.bound_box]; c=sum(bb,Vector())/8; REST[n]=(o.matrix_world.copy(),c)
sw_rest=sw.matrix_world.copy()
steer_hist=[]
for k,r in enumerate(rec):
    f=k+1; delta=math.atan(WB*r['kappa']); steer_hist.append(delta); spin=-(r['s']/WR)
    for n,o in wheels.items():
        M0,c=REST[n]; Rs=Matrix.Rotation(delta,4,'Z') if n.startswith('WheelF') else Matrix()
        o.matrix_world=Matrix.Translation(c)@Rs@Matrix.Rotation(spin,4,'X')@Matrix.Translation(-c)@M0
        o.keyframe_insert('location',frame=f); o.keyframe_insert('rotation_quaternion' if o.rotation_mode=='QUATERNION' else 'rotation_euler',frame=f)
    ang=max(-2.1,min(2.1,delta*8.0))
    sw.matrix_world=Matrix.Translation(WC)@Matrix.Rotation(-ang,4,WN)@Matrix.Translation(-WC)@sw_rest
    sw.keyframe_insert('location',frame=f); sw.keyframe_insert('rotation_quaternion' if sw.rotation_mode=='QUATERNION' else 'rotation_euler',frame=f)
# FB: looped driving clip + lean (spine/chest roll against the turn) + bounce on hips
iks=[A.pose.bones[f'lowerarm.{s}'].constraints[0] for s in 'lr']
for c in iks: c.influence=1.0
for k in range(FR):
    f=k+1; pose=DRV[k%len(DRV)]; lean=max(-0.35,min(0.35,-0.02*lat[k]))
    for bname,(q,l) in pose.items():
        pb=A.pose.bones[bname]
        if bname in ('spine','chest'): q=q@Quaternion((0,0,1),lean*0.5)
        if bname=='head': q=q@Quaternion((0,0,1),-lean*0.3)
        pb.rotation_quaternion=q; pb.keyframe_insert('rotation_quaternion',frame=f)
        if bname=='hips': pb.location=l+Vector((0,bounce[k]*0.8,0)); pb.keyframe_insert('location',frame=f)
rig.animation_data.action=act
# ---- ears: simulate from the evaluated head bone
Ph=[];Qh=[]
for k in range(FR):
    sc.frame_set(k+1); M=A.matrix_world@A.pose.bones['head'].matrix; Ph.append(np.array(M.translation)*UNIT); Qh.append(M.to_quaternion())
Ph=np.array(Ph)
vel=[np.gradient(Ph[:,i],1/FPS) for i in range(3)]; vel=np.array(vel).T
wind=lambda i: -vel[i]+np.array([0.4*math.sin(i*0.21),0,0])
E=cfg.CFG['B · Floppy']
EAR={}
for side,sgn in (('l',1),('r',-1)):
    out=sim.simulate(Ph,Qh,E,wind_world=wind,side=sgn,dt=1/FPS)
    EAR[side]=out
    for k in range(FR):
        for j in range(3):
            x,z=out[k][j]; pb=A.pose.bones[f'ear.{side}.{j+1}']; pb.rotation_mode='QUATERNION'
            pb.rotation_quaternion=Euler((x,0,z*sgn)).to_quaternion(); pb.keyframe_insert('rotation_quaternion',frame=k+1)
tip={s:[round(math.degrees(sum(EAR[s][k][j][0] for j in range(3))),1) for k in range(0,FR,30)] for s in 'lr'}
print('EARTIP',json.dumps(tip)); print('LAT max',round(float(np.abs(lat).max()*UNIT/9.81),2),'g', 'hump z max',round(float(zs.max()),2),'lap s',round(L/V,2))
json.dump(dict(fps=FPS,frames=FR,speed_kmh=25,lap_s=L/V,track=dict(a=Aax,b=Bax,hump=0.9),earPreset='B · Floppy',earTipPitchDeg=tip),open('/tmp/fbcar/joy_meta.json','w'))
bpy.ops.wm.save_as_mainfile(filepath='/tmp/fbcar/fb_car_joyride.blend')
