import sys,json,math,numpy as np
sys.path.insert(0,'/tmp/loco/work'); sys.path.insert(0,'/tmp/fl')
from gl import *
from scipy.optimize import least_squares
from wtool import read,write,add_anim
g=GLB('/tmp/bd/hero_ranged.glb'); FPS=30; FH=2.29
JN=[g.nodes[j]['name'] for j in g.json['skins'][0]['joints']]
GR=json.load(open('/tmp/bd/grips.json'))
def qax(axis,deg):
    a=math.radians(deg)/2; v=np.array(axis,float)*math.sin(a); return np.array([v[0],v[1],v[2],math.cos(a)])
def qmul(a,b):
    x1,y1,z1,w1=a; x2,y2,z2,w2=b
    return np.array([w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2])
def rv2q(r):
    a=np.linalg.norm(r)
    if a<1e-12: return np.array([0,0,0,1.])
    v=r/a*math.sin(a/2); return np.array([v[0],v[1],v[2],math.cos(a/2)])
def m2q(m):
    t=np.trace(m)
    if t>0: s=math.sqrt(t+1)*2; q=[(m[2,1]-m[1,2])/s,(m[0,2]-m[2,0])/s,(m[1,0]-m[0,1])/s,0.25*s]
    else:
        i=int(np.argmax([m[0,0],m[1,1],m[2,2]]))
        if i==0: s=math.sqrt(1+m[0,0]-m[1,1]-m[2,2])*2; q=[0.25*s,(m[0,1]+m[1,0])/s,(m[0,2]+m[2,0])/s,(m[2,1]-m[1,2])/s]
        elif i==1: s=math.sqrt(1+m[1,1]-m[0,0]-m[2,2])*2; q=[(m[0,1]+m[1,0])/s,0.25*s,(m[1,2]+m[2,1])/s,(m[0,2]-m[2,0])/s]
        else: s=math.sqrt(1+m[2,2]-m[0,0]-m[1,1])*2; q=[(m[0,2]+m[2,0])/s,(m[1,2]+m[2,1])/s,0.25*s,(m[1,0]-m[0,1])/s]
    q=np.array(q); return q/np.linalg.norm(q)
CHAIN=['root','hips','spine','chest','upperarm.l','lowerarm.l','wrist.l','hand.l','handslot.l','upperarm.r','lowerarm.r','wrist.r','hand.r','handslot.r','head']
PAR={}
for n in JN:
    i=g.name2i[n]; p=g.parent.get(i); PAR[n]=g.nodes[p]['name'] if p is not None and g.nodes[p].get('name') in JN else None
def local_trs(P,n,t):
    i=g.name2i[n]; nd=g.nodes[i]
    T=np.array(nd.get('translation',[0,0,0]),float); R=np.array(nd.get('rotation',[0,0,0,1]),float); S=np.array(nd.get('scale',[1,1,1]),float)
    if (i,'translation') in P.ch: T=sample(P.ch[(i,'translation')],t,'translation')
    if (i,'rotation') in P.ch: R=qnorm(sample(P.ch[(i,'rotation')],t,'rotation'))
    if (i,'scale') in P.ch: S=sample(P.ch[(i,'scale')],t,'scale')
    return T,R,S
def frame_locals(P,f):
    t=P.t0+min(f/FPS,P.T); return {n:local_trs(P,n,t) for n in JN}
def fk(L,names=None):
    Wd={}
    def w(n):
        if n in Wd: return Wd[n]
        T,R,S=L[n]; M=trs(T,R,S); p=PAR[n]
        Wd[n]=(w(p)@M) if p else M; return Wd[n]
    for n in (names or JN): w(n)
    return Wd
def qm(q): return qmat(np.array(q))
def weapon_world(Wd,G): M=Wd['handslot.r'].copy(); M[:3,:3]=M[:3,:3]@qm(G); return M
def ik_left(L,target,reg=0.02):
    base_u=L['upperarm.l'][1].copy(); base_l=L['lowerarm.l'][1].copy()
    def apply(x):
        L2=dict(L); L2['upperarm.l']=(L['upperarm.l'][0],qnorm(qmul(rv2q(x[:3]),base_u)),L['upperarm.l'][2]); L2['lowerarm.l']=(L['lowerarm.l'][0],qnorm(qmul(base_l,rv2q(x[3:]))),L['lowerarm.l'][2]); return L2
    def res(x):
        Wd=fk(apply(x),['handslot.l']); return np.concatenate([(Wd['handslot.l'][:3,3]-target)*10,x*reg])
    s=least_squares(res,np.zeros(6)); L2=apply(s.x); err=np.linalg.norm(fk(L2,['handslot.l'])['handslot.l'][:3,3]-target)
    return L2,err
WG=json.load(open('/tmp/bd/wgeo.json'))
SOCK={'blaster':dict(grip_l=None,muzzle=[0,0.17,0.76]),
      'rifle':dict(grip_l=[0,0.04,0.60],muzzle=[0,0.20,1.53],bayonet_tip=[0,0.03,2.06]),
      'minigun':dict(grip_l=[0,0.19,0.28],muzzle=[0,0,0.77])}
def build_clip(src,frames,G,sock,yaw=0,arm_r=None,hips_x=0,jitter=None,ik=True,ramp=None,hold_from=0):
    P=Pose(g,src); out=[]; errs=[]; devs=[]
    for k,f in enumerate(frames):
        L=frame_locals(P,f)
        if yaw: T,R,S=L['root']; L['root']=(T,qnorm(qmul(qax((0,1,0),yaw),R)),S)
        if hips_x: T,R,S=L['hips']; L['hips']=(T,qnorm(qmul(qax((1,0,0),hips_x),R)),S)
        if arm_r:
            for b,(ax,deg) in arm_r.items(): T,R,S=L[b]; L[b]=(T,qnorm(qmul(qax(ax,deg),R)),S)
        if jitter:
            ph=2*math.pi*(k/FPS)/jitter['period']; T,R,S=L['chest']
            L['chest']=(T,qnorm(qmul(qmul(qax((1,0,0),-jitter['pitch']*max(0,math.sin(ph))),qax((0,1,0),jitter['yaw']*math.sin(ph*1.7))),R)),S)
        Wd=fk(L)
        if ik and sock.get('grip_l'):
            Mw=weapon_world(Wd,G); tgt=(Mw@np.array(sock['grip_l']+[1]))[:3]
            w=1.0
            if ramp: u=min(1,max(0,(f-ramp[0])/(ramp[1]-ramp[0]))); w=u*u*(3-2*u)
            nat=Wd['handslot.l'][:3,3]; tgt=nat+(tgt-nat)*w
            L,err=ik_left(L,tgt)
            if f>=hold_from: errs.append(np.linalg.norm(fk(L,['handslot.l'])['handslot.l'][:3,3]-(Mw@np.array(sock['grip_l']+[1]))[:3]))
            Wd=fk(L)
        Mw=weapon_world(Wd,G); z=Mw[:3,2]/np.linalg.norm(Mw[:3,2])
        if f>=hold_from: devs.append(math.degrees(math.acos(np.clip(z[2],-1,1))))
        out.append(L)
    return out,(max(errs)/FH if errs else None),max(devs),min(devs)
def tracks(seq):
    N=len(seq); tr={}
    for n in JN:
        i=g.name2i[n]; tr[(i,'rotation')]=np.array([s[n][1] for s in seq]); tr[(i,'translation')]=np.array([s[n][0] for s in seq])
    return tr
def solve_grip(src,frames,yaw=0,arm_r=None,hips_x=0):
    # grip so that weapon +Z = world forward (+Z) horizontal, +Y = up, averaged over frames
    acc=np.zeros((3,3))
    for f in frames:
        P=Pose(g,src); L=frame_locals(P,f)
        if yaw: T,R,S=L['root']; L['root']=(T,qnorm(qmul(qax((0,1,0),yaw),R)),S)
        if hips_x: T,R,S=L['hips']; L['hips']=(T,qnorm(qmul(qax((1,0,0),hips_x),R)),S)
        if arm_r:
            for b,(ax,deg) in arm_r.items(): T,R,S=L[b]; L[b]=(T,qnorm(qmul(qax(ax,deg),R)),S)
        R=fk(L)['handslot.r'][:3,:3]; acc+=R.T@np.eye(3)
    U,_,Vt=np.linalg.svd(acc); Rm=U@Vt
    if np.linalg.det(Rm)<0: U[:,-1]*=-1; Rm=U@Vt
    return m2q(Rm)
if __name__=='__main__':
    YAW=-GR['aimYaw2H']; rep={}
    G1=np.array(GR['G1']); G2=np.array(GR['G2'])  # rifle grip: R->L line, pitch trimmed 4.5 deg (see grips.json)
    # minigun hip: right arm lowered, hips lean back, grip solved for level forward
    ARM={'upperarm.r':((1,0,0),34),'lowerarm.r':((1,0,0),-8)}
    hold=list(range(0,33))
    G3=solve_grip('Ranged_2H_Shooting',hold,yaw=YAW*0.6,arm_r=ARM,hips_x=-4)
    json.dump(dict(GR,G3=G3.tolist(),minigunYaw=YAW*0.6),open('/tmp/bd/grips.json','w'))
    JJ,BB=read('/tmp/bd/hero_ranged.glb'); JJ['animations']=[]
    P1=Pose(g,'Ranged_1H_Shooting'); P2=Pose(g,'Ranged_2H_Shooting')
    defs=[
     ('kfb_action_aim_blaster_a','Ranged_1H_Aiming',list(range(Pose(g,'Ranged_1H_Aiming').frames)),G1,'blaster',dict(hold_from=12),'one-shot raise, hold last frame (clamp)','native copy'),
     ('kfb_action_shoot_blaster_a','Ranged_1H_Shooting',list(range(0,13)),G1,'blaster',{},'one-shot from hold, returns to hold','native: one recoil cycle of Ranged_1H_Shooting'),
     ('kfb_action_shooting_blaster_a','Ranged_1H_Shooting',list(range(P1.frames)),G1,'blaster',{},'loop','native copy'),
     ('kfb_action_aim_rifle_a','Ranged_2H_Aiming',list(range(Pose(g,'Ranged_2H_Aiming').frames)),G2,'rifle',dict(yaw=YAW,ramp=(4,12),hold_from=12),'one-shot raise, hold last frame (clamp)','native + root yaw + left-hand IK'),
     ('kfb_action_shoot_rifle_a','Ranged_2H_Shooting',list(range(0,9)),G2,'rifle',dict(yaw=YAW),'one-shot from hold','native cycle + root yaw + left-hand IK'),
     ('kfb_action_shooting_rifle_a','Ranged_2H_Shooting',list(range(P2.frames)),G2,'rifle',dict(yaw=YAW),'loop','native + root yaw + left-hand IK'),
     ('kfb_action_hold_minigun_a','Ranged_2H_Shooting',[0]*33,G3,'minigun',dict(yaw=YAW*0.6,arm_r=ARM,hips_x=-4),'loop','authored over Ranged_2H (KayKit gap)'),
     ('kfb_action_fire_minigun_a','Ranged_2H_Shooting',[0]*33,G3,'minigun',dict(yaw=YAW*0.6,arm_r=ARM,hips_x=-4,jitter=dict(period=0.11,pitch=2.2,yaw=0.8)),'loop, burst rhythm 0.11 s','authored over Ranged_2H (KayKit gap)'),
    ]
    man=[]
    for name,src,frames,G,w,kw,loop,origin in defs:
        seq,lh,dmax,dmin=build_clip(src,frames,G,SOCK[w],**kw)
        add_anim(JJ,BB,name,tracks(seq),FPS)
        man.append(dict(clip=name,source=src,frames=len(frames),loop=loop,rootMotion='in-place',weapon=w,origin=origin,lane_dev_deg=[round(dmin,2),round(dmax,2)],left_hand_to_socket_fh=None if lh is None else round(lh,4)))
        print(man[-1])
    # native reactions copied for completeness
    for name,src in [('kfb_reaction_hit_front_small_a','Hit_A'),('kfb_reaction_hit_front_big_a','Hit_B')]:
        P=Pose(g,src); seq=[frame_locals(P,f) for f in range(P.frames)]; add_anim(JJ,BB,name,tracks(seq),FPS)
        man.append(dict(clip=name,source=src,frames=P.frames,loop='one-shot',rootMotion='in-place',origin='native copy'))
    write(JJ,BB,'/tmp/bd/KFB_Motion_ranged_Rig_Medium.glb')
    json.dump(dict(clips=man,grips=dict(G1=G1.tolist(),G2=G2.tolist(),G3=G3.tolist()),sockets=SOCK),open('/tmp/bd/clips_manifest.json','w'),indent=1)
