
# v3_drum.py  -  Trommler v3: Arme analytisch (FK, Scharnier-Ellbogen, Daumen innen), Koerper = Mixamo
import bpy, math, json
from mathutils import Vector, Matrix, Quaternion
SC='DRUM_MANUAL'; ARM='Brute_DR'
ARMB=['upperarm','lowerarm','wrist','hand','handslot']
STICK={'r':'Orc_WardrumStick.R_DR','l':'Orc_WardrumStick_DR'}
SKIN_C=Vector((0,-2.3,1.785)); SKIN_R=0.78; RIM_Z=1.84
def S(): return bpy.data.scenes[SC]
def A(): return S().objects[ARM]

def setup_action():
    a=A(); ad=a.animation_data
    raw=bpy.data.actions['DR_brute_drums_raw']
    act=bpy.data.actions.get('DR_v3_body')
    if act: bpy.data.actions.remove(act)
    act=raw.copy(); act.name='DR_v3_body'
    n=0
    for l in act.layers:
        for st in l.strips:
            for cb in st.channelbags:
                for fc in list(cb.fcurves):
                    if any(('"%s.'%b) in fc.data_path for b in ARMB):
                        cb.fcurves.remove(fc); n+=1
    for t in ad.nla_tracks: t.mute=True
    ad.action=act; ad.action_slot=act.slots[0]; ad.action_blend_type='REPLACE'
    for s in 'lr':
        for b in ARMB:
            pb=a.pose.bones['%s.%s'%(b,s)]; pb.rotation_mode='QUATERNION'
            pb.matrix_basis=Matrix.Identity(4)
    for pb in a.pose.bones:
        for c in pb.constraints:
            if c.name.startswith('KFB_'): c.mute=True
    return n

def set_object(theta_deg, loc):
    a=A(); a.rotation_mode='XYZ'; a.rotation_euler=(0,0,math.radians(theta_deg)); a.location=loc

def set_stick_angle(adeg):
    # adeg = Winkel der Keule gegen die Unterarm-/Handachse (0 = in Verlaengerung, 90 = Original quer zur Faust)
    base={'r':Quaternion((0,0,-0.70710678,-0.70710678)),'l':Quaternion((0,0,0.70710678,0.70710678))}
    for s in 'rl':
        st=S().objects[STICK[s]]
        # handslot local: Z = Handruecken; Drehung um Z verschiebt Keule von Daumen- Richtung zur Fingerachse
        # r: distal=+x, daumen=+y -> Drehung um -Z ; l: distal=-x, daumen=+y -> um +Z
        ang=math.radians(90-adeg)*(-1 if s=='r' else 1)
        st.rotation_mode='QUATERNION'
        st.rotation_quaternion=Quaternion((0,0,1),ang) @ base[s]

def chest_M(f):
    sc=S(); sc.frame_set(f); return A().pose.bones['chest'].matrix.copy()

def rest(b): return A().data.bones[b].matrix_local.copy()

def frame_from(y,z):
    y=y.normalized(); z=(z-y*z.dot(y)).normalized(); x=y.cross(z)
    m=Matrix.Identity(3); m.col[0]=x; m.col[1]=y; m.col[2]=z; return m

def rotm(axis,ang): return Matrix.Rotation(ang,3,axis)

def solve_arm(s, Mchest, W, pole, twist_k, twist_max, cock, dev):
    a=A(); Aw=a.matrix_world; Ai=Aw.inverted()
    up='upperarm.'+s; lo='lowerarm.'+s; wr='wrist.'+s; ha='hand.'+s
    Mup_rest = Mchest @ rest('chest').inverted() @ rest(up)
    Sa=Mup_rest.translation; Sw=Aw@Sa
    L1=a.data.bones[up].length; L2=a.data.bones[lo].length
    d=W-Sw; dl=d.length; dmax=(L1+L2)*0.985; dmin=abs(L1-L2)+0.05
    reach=dl
    dl=max(dmin,min(dmax,dl)); u=d.normalized(); Wc=Sw+u*dl
    ca=(L1*L1+dl*dl-L2*L2)/(2*L1*dl); ca=max(-1,min(1,ca)); sa=math.sqrt(1-ca*ca)
    v=(pole-u*pole.dot(u)).normalized()
    E=Sw+L1*(ca*u+sa*v)
    yu=(E-Sw).normalized(); yl=(Wc-E).normalized()
    hinge=yu.cross(yl)
    if hinge.length<1e-4: hinge=v.cross(u)
    hinge.normalize()
    if s=='l': hinge=-hinge
    flex=math.degrees(yu.angle(yl))
    Ru=frame_from(yu,hinge)
    Rl=frame_from(yl,hinge)
    # Pronation: um Unterarmachse drehen, damit Handflaeche (-z) nach unten zeigt
    zt=Vector((0,0,1)); zt=(zt-yl*zt.dot(yl))
    tau=0.0
    if zt.length>1e-3:
        zt.normalize(); z0=Rl.col[2]
        tau=math.atan2(yl.dot(z0.cross(zt)), z0.dot(zt))
    tau=max(-math.radians(twist_max),min(math.radians(twist_max),tau*twist_k))
    Rl=rotm(yl,tau)@Rl
    # Handgelenk: cock = Streckung(+)/Beugung(-) um x ; dev = Abweichung um z
    xw=Rl.col[0]; Rw=rotm(xw,math.radians(cock))@Rl
    zw=Rw.col[2]; Rw=rotm(zw,math.radians(dev))@Rw
    Ar=Ai.to_3x3()
    def M4(R,p):
        m=(Ar@R).to_4x4(); m.translation=Ai@p; return m
    Mu=M4(Ru,Sw); Ml=M4(Rl,E); Mw=M4(Rw,Wc)
    Mh=Mw.copy(); Mh.translation=Mw.translation+ (Mw.to_3x3().col[1])*a.data.bones[wr].length
    return {'M':{up:Mu,lo:Ml,wr:Mw,ha:Mh},'Mup_parent':Mchest,'flex':flex,'tau':math.degrees(tau),'reach':reach,'dmax':dmax,'E':E,'Wc':Wc}

def basis_of(Mb,Mparent,b,p):
    return (Mparent @ rest(p).inverted() @ rest(b)).inverted() @ Mb

def stick_K(s):
    a=A(); bpy.context.view_layer.update()
    pb=a.pose.bones['handslot.'+s]
    return (a.matrix_world@pb.matrix).inverted() @ S().objects[STICK[s]].matrix_world

def head_low(s, Mhand, K):
    a=A()
    Mslot=Mhand @ rest('hand.'+s).inverted() @ rest('handslot.'+s)
    Mst=a.matrix_world@Mslot@K
    vs=[Mst@v.co for v in S().objects[STICK[s]].data.vertices if v.co.z>0.3]
    low=min(vs,key=lambda p:p.z)
    tip=Mst@Vector((0,0,0.642))
    grip=Mst.translation
    return low,tip,grip,Mst

def schedule(hits,f,first=1,last=142):
    hits=sorted(hits)
    if f in hits: return 0.0
    prev=[h for h in hits if h<f]; nxt=[h for h in hits if h>f]
    if not prev:
        n=nxt[0]; g=max(n-first,1); A_=min(1.0,max(0.3,(n-first-1)/12)); u=(f-first)/g
        return A_*(1-u**2) if n-first>2 else A_*(n-f)/max(1,(n-first))
    if not nxt:
        p=prev[-1]; u=min(1,(f-p)/8); return 0.8*math.sin(u*math.pi/2)
    p=prev[-1]; n=nxt[0]; g=n-p
    A_=min(1.0,max(0.18,(g-2)/12))
    u=(f-p)/g
    return A_*math.sin(math.pi*(u**0.85))

def pose_frame(f, P, K, iters=6):
    a=A(); Mc=chest_M(f); out={}
    for s in 'rl':
        hp=P[s]
        sv=schedule(hp['hits'],f)
        H=Vector(hp['H'])
        W=Vector(hp.get('W0',(H.x*0.6, -0.9, 1.95)))
        cock=hp['cock_hit']+sv*hp['cock_lift']
        if f in hp['hits'] or True:
            # W so waehlen, dass der Keulenkopf (tiefster Punkt) bei s=0 auf H liegt
            for i in range(iters):
                r=solve_arm(s,Mc,W,Vector(hp['pole']),hp['twist_k'],hp['twist_max'],hp['cock_hit'],hp['dev'])
                low,tip,grip,_=head_low(s,r['M']['hand.'+s],K[s])
                W=W+(H-low)
            hp['W0']=tuple(W)
        Wl=W+Vector(hp['lift'])*sv
        r=solve_arm(s,Mc,Wl,Vector(hp['pole']),hp['twist_k'],hp['twist_max'],cock,hp['dev'])
        low,tip,grip,Mst=head_low(s,r['M']['hand.'+s],K[s])
        r['s']=sv; r['low']=low; r['tip']=tip; r['grip']=grip
        out[s]=r
    return out,Mc

def apply_pose(res,Mc,key=None):
    a=A()
    for s in 'rl':
        M=res[s]['M']
        chain=[('upperarm.'+s,'chest',Mc),('lowerarm.'+s,'upperarm.'+s,None),('wrist.'+s,'lowerarm.'+s,None),('hand.'+s,'wrist.'+s,None)]
        for b,p,Mp in chain:
            Mp=Mp if Mp is not None else M[p]
            B=basis_of(M[b],Mp,b,p)
            pb=a.pose.bones[b]
            q=B.to_quaternion(); pb.rotation_quaternion=q; pb.location=(0,0,0)
            if key is not None:
                pb.keyframe_insert('rotation_quaternion',frame=key); pb.keyframe_insert('location',frame=key)

def eulers(s):
    a=A(); o={}
    for b in ['upperarm','lowerarm','wrist']:
        e=a.pose.bones[b+'.'+s].rotation_quaternion.to_euler('XYZ')
        o[b]=[round(math.degrees(x),1) for x in e]
    return o

HEAD_LOCAL=Vector((0,0,0.45)); HEAD_R=0.25
def head_c(s,res_s,K):
    a=A(); Mh=res_s['M']['hand.'+s]
    Mslot=Mh @ rest('hand.'+s).inverted() @ rest('handslot.'+s)
    Mst=a.matrix_world@Mslot@K
    return Mst@HEAD_LOCAL, Mst
def solve_W(s,Mc,hp,K,W0,Hc,cock,iters=12):
    W=Vector(W0)
    def F(W):
        r=solve_arm(s,Mc,W,Vector(hp['pole']),hp['twist_k'],hp['twist_max'],cock,hp['dev'])
        return head_c(s,r,K)[0]-Hc, r
    for i in range(iters):
        e,r=F(W)
        if e.length<0.005: break
        J=Matrix.Identity(3); h=0.01
        for k in range(3):
            d=Vector((0,0,0)); d[k]=h
            ek,_=F(W+d); J.col[k]=(ek-e)/h
        try: step=J.inverted()@e
        except Exception: step=e
        if step.length>0.25: step=step.normalized()*0.25
        W=W-step*0.8
    e,r=F(W)
    return W,e.length,r
def pose_frame2(f,P,K):
    Mc=chest_M(f); out={}
    for s in 'rl':
        hp=P[s]; sv=schedule(hp['hits'],f)
        Hc=Vector(hp['H'])+Vector((0,0,HEAD_R))
        W,err,r0=solve_W(s,Mc,hp,K[s],hp.get('W0',(0.8*hp['H'][0]*2,-0.8,2.0)),Hc,hp['cock_hit'])
        hp['W0']=tuple(W)
        Wl=W+Vector(hp['lift'])*(sv**1.8)
        cock=hp['cock_hit']+min(1.0,sv*1.6)*hp['cock_lift']
        r=solve_arm(s,Mc,Wl,Vector(hp['pole']),hp['twist_k'],hp['twist_max'],cock,hp['dev'])
        hc,Mst=head_c(s,r,K[s])
        r['s']=sv; r['err']=err; r['hc']=hc; r['Mst']=Mst
        out[s]=r
    return out,Mc
