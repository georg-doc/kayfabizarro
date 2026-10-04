from fk import *
import json, copy
from scipy.optimize import least_squares
sys.path.insert(0,'/tmp/fl'); import wtool
H={'Rig_Medium':2.17,'Rig_Large':4.19}          # canonical body height: Robot One / Skeleton Minion (Medium), Orc Brute (Large)
RW={r:0.22*h for r,h in H.items()}              # Option A work chunk radius (decision c948e155)
def lib(rig,name): return ML+f'libs/{rig}/KFB_Motion_{name}.glb'
def seq_from(c,frames=None): return [c.locals(f) for f in (frames if frames is not None else range(c.N))]
def setR(L,n,q): T,R,S=L[n]; L[n]=(T,qnorm(q),S)
def setT(L,n,t): T,R,S=L[n]; L[n]=(np.array(t,float),R,S)
# ---------- root yaw / travel ----------
def yaw_of(q):
    # twist about world Y
    x,y,z,w=q; a=math.atan2(y,w)*2; return a
def strip_travel(seq,strip_yaw=False):
    N=len(seq); T=np.array([s['root'][0] for s in seq]); f=np.arange(N)
    th=np.array([yaw_of(s['root'][1]) for s in seq]); th=np.unwrap(th)
    ky=np.polyfit(f,th,1) if strip_yaw else np.array([0,0.])
    out=[]; 
    # linear drift in x,z (period N): slope from fit
    kx=np.polyfit(f,T[:,0],1); kz=np.polyfit(f,T[:,2],1)
    res=np.stack([T[:,0]-np.polyval(kx,f),T[:,1],T[:,2]-np.polyval(kz,f)],1)
    if strip_yaw:
        # remove curvature too: quadratic fit of x,z before rotating residual into body frame
        qx=np.polyfit(f,T[:,0],2); qz=np.polyfit(f,T[:,2],2)
        res=np.stack([T[:,0]-np.polyval(qx,f),T[:,1],T[:,2]-np.polyval(qz,f)],1)
    for i,s in enumerate(seq):
        L=dict(s); r=res[i].copy()
        if strip_yaw:
            d=-(np.polyval(ky,i)-ky[1])  # remove drift relative to start yaw
            dq=qax((0,1,0),math.degrees(d)); R=L['root'][1]; setR(L,'root',qmul(dq,R))
            c,sn=math.cos(d),math.sin(d); r=np.array([c*r[0]+sn*r[2],r[1],-sn*r[0]+c*r[2]])
        setT(L,'root',r); out.append(L)
    # centre x,z mean so the actor stays on the clip origin
    m=np.mean([o['root'][0] for o in out],0); m[1]=0
    for o in out: setT(o,'root',o['root'][0]-m)
    v=np.array([np.polyval(kx,1)-np.polyval(kx,0),0,np.polyval(kz,1)-np.polyval(kz,0)])
    return out,dict(travelPerFrame=v.tolist(),yawPerFrameDeg=math.degrees(ky[0]) if strip_yaw else 0.0)
# ---------- mirror (x -> -x), valid: rest rotations of .l/.r are mirror images (verified) ----------
def swap(n): return n.replace('.l','.#').replace('.r','.l').replace('.#','.r') if ('.l' in n or '.r' in n) else n
def mirror(seq):
    out=[]
    for s in seq:
        L={}
        for n,(T,R,S) in s.items():
            L[swap(n)]=(np.array([-T[0],T[1],T[2]]),np.array([R[0],-R[1],-R[2],R[3]]),S)
        out.append(L)
    return out
# ---------- time stretch ----------
def stretch(seq,factor):
    N=len(seq); M=int(round(N*factor)); out=[]
    for k in range(M):
        u=k/factor; i0=int(math.floor(u))%N; i1=(i0+1)%N; a=u-math.floor(u)
        L={}
        for n in seq[0]:
            T0,R0,S0=seq[i0][n]; T1,R1,S1=seq[i1][n]
            L[n]=(T0*(1-a)+T1*a, slerp(R0,R1,a) if True else R0, S0)
        out.append(L)
    return out
def loop_blend(seq,K):
    N=len(seq); out=[]
    for f in range(N-K):
        if f<K:
            w=(f+1)/(K+1); A=seq[f+N-K]; B=seq[f]; L={}
            for n in B: L[n]=(A[n][0]*(1-w)+B[n][0]*w, slerp(A[n][1],B[n][1],w), B[n][2])
            out.append(L)
        else: out.append(seq[f])
    return out
# ---------- FK helpers on a sequence ----------
class Rig:
    def __init__(s,rig):
        s.rig=rig; s.c=Clip(lib(rig,'locomotion'),'kfb_locomotion_wheelbarrow_walk_a')
        L=s.c.locals(0)
        s.armlen={}
        for side in 'lr':
            W=s.c.fk(L); p=lambda n:W[n][:3,3]
            s.armlen[side]=np.linalg.norm(p(f'lowerarm.{side}')-p(f'upperarm.{side}'))+np.linalg.norm(p(f'wrist.{side}')-p(f'lowerarm.{side}'))+np.linalg.norm(p(f'handslot.{side}')-p(f'wrist.{side}'))
    def fk(s,L): return s.c.fk(L)
def ik_arm(rig,L,side,target,n_in,x0=None,wpos=10.0,wpalm=1.5,wfing=0.4,reg=0.05):
    """Solve upperarm/lowerarm/wrist so handslot hits target, palm (-Z hand) along n_in, fingers (+Y) up-tangent."""
    bu=L[f'upperarm.{side}'][1].copy(); bl=L[f'lowerarm.{side}'][1].copy(); bw=L[f'wrist.{side}'][1].copy()
    up=np.array([0,1.,0]); t=up-np.dot(up,n_in)*n_in; t/=np.linalg.norm(t)
    sc=H[rig.rig]
    def apply(x):
        L2=dict(L); setR(L2,f'upperarm.{side}',qmul(rv2q(x[:3]),bu)); setR(L2,f'lowerarm.{side}',qmul(bl,rv2q(x[3:6]))); setR(L2,f'wrist.{side}',qmul(bw,rv2q(x[6:9]))); return L2
    def res(x):
        W=rig.fk(apply(x)); M=W[f'handslot.{side}']; Hm=W[f'hand.{side}'][:3,:3]
        palm=-Hm[:,2]/np.linalg.norm(Hm[:,2]); fing=Hm[:,1]/np.linalg.norm(Hm[:,1])
        return np.concatenate([(M[:3,3]-target)/sc*wpos*10,(palm-n_in)*wpalm,(fing-t)*wfing,x*reg])
    s=least_squares(res,np.zeros(9) if x0 is None else x0,max_nfev=400)
    L2=apply(s.x); W=rig.fk(L2)
    err=np.linalg.norm(W[f'handslot.{side}'][:3,3]-target)
    Hm=W[f'hand.{side}'][:3,:3]; palm=-Hm[:,2]/np.linalg.norm(Hm[:,2])
    return L2,s.x,err,math.degrees(math.acos(np.clip(np.dot(palm,n_in),-1,1)))
def ball_contacts(rig,seq,R,el_deg=20,reach=0.9,palm_gap=0.02):
    """Static ball on the ground in front of the actor; returns centre, per-side (target, inward normal)."""
    W=[rig.fk(L) for L in seq]
    sh={sd:np.mean([w[f'upperarm.{sd}'][:3,3] for w in W],0) for sd in 'lr'}
    hips=np.mean([w['hips'][:3,3] for w in W],0)
    a=min(abs(sh['l'][0]-sh['r'][0])/2*0.95,0.68*R)
    se=math.sin(math.radians(el_deg)); h=H[rig.rig]
    def nvec(sg): 
        nx=sg*a/R; return np.array([nx,se,-math.sqrt(max(0,1-nx*nx-se*se))])
    # solve centre z so mean shoulder->target distance = reach * armlen
    xc=hips[0]
    def tgt(zc,sd):
        sg=1 if sd=='l' else -1; n=nvec(sg); C=np.array([xc,R,zc]); return C+(R+palm_gap*h)*n,n
    lo,hi=hips[2],hips[2]+3*R+2*rig.armlen['l']
    for _ in range(60):
        m=(lo+hi)/2; d=np.mean([np.linalg.norm(tgt(m,sd)[0]-sh[sd])/rig.armlen[sd] for sd in 'lr'])
        if d<reach: lo=m
        else: hi=m
    zc=(lo+hi)/2; C=np.array([xc,R,zc])
    feas=np.mean([np.linalg.norm(tgt(zc,sd)[0]-sh[sd])/rig.armlen[sd] for sd in 'lr'])<=reach+0.01
    if not feas and el_deg<75:   # ball too low to reach at this contact height: move contact up the ball's back
        return ball_contacts(rig,seq,R,el_deg+5,reach,palm_gap)
    ball_contacts.last_el=el_deg
    return C,{sd:(tgt(zc,sd)[0],-tgt(zc,sd)[1]) for sd in 'lr'},a
def apply_push_arms(rig,seq,C,T):
    out=[]; x0={'l':None,'r':None}; errs=[]; palms=[]
    for L in seq:
        L=dict(L)
        for sd in 'lr':
            L,x,e,pa=ik_arm(rig,L,sd,T[sd][0],T[sd][1],x0[sd]); x0[sd]=x; errs.append(e); palms.append(pa)
        out.append(L)
    return out,max(errs),max(palms)
# ---------- metrics ----------
def seam(seq):
    A,B=seq[-1],seq[0]
    return max(math.degrees(2*math.acos(min(1,abs(float(np.dot(A[n][1],B[n][1])))))) for n in A if n!='root'),\
           max(math.degrees(2*math.acos(min(1,abs(float(np.dot(seq[k][n][1],seq[k+1][n][1])))))) for k in range(len(seq)-1) for n in seq[0] if n!='root')
def lean_deg(rig,seq):
    v=[]
    for L in seq:
        W=rig.fk(L); d=W['head'][:3,3]-W['hips'][:3,3]; v.append(math.degrees(math.atan2(d[2],d[1])))
    return float(np.mean(v))
def match_speed(rig,seq):
    # stance-foot backward speed (m/s) = root speed runtime should use to avoid foot slide
    sp=[]
    for sd in 'lr':
        P=np.array([rig.fk(L)[f'toes.{sd}'][:3,3] for L in seq]); y=P[:,1]; thr=y.min()+0.02*H[rig.rig]
        for k in range(len(seq)-1):
            if y[k]<thr and y[k+1]<thr: sp.append(-(P[k+1,2]-P[k,2])*30)
    return float(np.median(sp)) if sp else 0.0
def foot_min(rig,seq):
    return float(min(min(rig.fk(L)['toes.l'][1,3],rig.fk(L)['toes.r'][1,3],rig.fk(L)['foot.l'][1,3],rig.fk(L)['foot.r'][1,3]) for L in seq))
# ---------- writer ----------
def new_lib(rig):
    J,B=wtool.read(lib(rig,'locomotion')); J2={'asset':J['asset'],'scene':0,'scenes':J['scenes'],'nodes':J['nodes'],'animations':[],'accessors':[],'bufferViews':[],'buffers':[{'byteLength':0}]}
    return J2,bytearray()
def add_clip(J,B,name,seq):
    n2i={n.get('name'):i for i,n in enumerate(J['nodes'])}; tr={}
    for n in JN:
        tr[(n2i[n],'translation')]=np.array([s[n][0] for s in seq]); tr[(n2i[n],'rotation')]=np.array([s[n][1] for s in seq])
        tr[(n2i[n],'scale')]=np.array([s[n][2] for s in seq])
    wtool.add_anim(J,B,name,tr)
def step_by_joint(seq):
    r={}
    for n in seq[0]:
        if n=='root': continue
        r[n]=max(math.degrees(2*math.acos(min(1,abs(float(np.dot(seq[k][n][1],seq[k+1][n][1])))))) for k in range(len(seq)-1))
    return r
def seam_excess(seq):
    # wrap step (last->first) minus the largest interior step, per joint; <=0 means the seam is no worse than a normal frame
    worst=-1e9; wj=None
    for n in seq[0]:
        if n=='root': continue
        ang=lambda a,b: math.degrees(2*math.acos(min(1,abs(float(np.dot(a,b))))))
        inner=max(ang(seq[k][n][1],seq[k+1][n][1]) for k in range(len(seq)-1)); wrap=ang(seq[-1][n][1],seq[0][n][1])
        if wrap-inner>worst: worst=wrap-inner; wj=n
    return worst,wj
def floor_clamp(rig,seq,floor):
    out=[]; lifted=0
    for L in seq:
        W=rig.fk(L); m=min(W[n][1,3] for n in ('toes.l','toes.r','foot.l','foot.r'))
        L=dict(L)
        if m<floor:
            T=L['root'][0].copy(); T[1]+=floor-m; setT(L,'root',T); lifted=max(lifted,floor-m)
        out.append(L)
    return out,lifted
