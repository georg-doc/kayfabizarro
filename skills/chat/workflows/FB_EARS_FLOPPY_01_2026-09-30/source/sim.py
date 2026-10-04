# FB-EARS-FLOPPY-01 · Python port of ear-dangle.v1.js DangleChain.update (PR #214 @19088b14), driven by the
# head bone of real Motion Library clips (Rig_Medium). Frames: parent space = head bone frame (x left, y up, z forward),
# identical to the FB Ear Rig v5 head bone (checked in Blender).
import sys, json, math, numpy as np
sys.path.insert(0,'/tmp/ch1'); import glb
from mathutils import Matrix, Quaternion, Vector
LIB='/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v6/'
CAT={c['id']:c for c in json.load(open(LIB+'KFB_Motion_Library.catalog.json'))['clips']}
def libpath(cid):
    rel=CAT[cid]['library']['Rig_Medium']
    for base in (LIB,'/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/','/tmp/ml6/out/'):
        import os
        if os.path.exists(base+rel): return base+rel
    raise FileNotFoundError(rel)
FPS=60
def head_track(cid,loops=1):
    G=glb.clip_world(libpath(cid),cid,fps=FPS)
    # Blender coords after glb's C: z up, character faces -y. Head frame: bone x, y (up), z (forward) = Blender (x, z, -y) at rest.
    P=[];Q=[]
    for k in range(loops):
        for fr in G:
            M=fr['head']; P.append(np.array(M.translation)); Q.append(M.to_quaternion())
    return np.array(P),Q
D=dict(stiffness=[60,38,24],damping=[7,5,3.5],maxDeg=[40,65,80],inertia=0.016,spin=0.05,wind=0.012,flutter=0.0045,gravity=0.0,elastic=0.6,substep=1/120)
def params(e):
    """ToolBox _applyEars mapping (P06): dangle, stiff, damp, limit, inertia, spin, wind, gravity."""
    d=e.get('dangle',1); k=e.get('stiff',1)/max(0.05,d*d); dm=e.get('damp',1)
    return dict(stiffness=[x*k for x in D['stiffness']],damping=[x*dm*math.sqrt(k) for x in D['damping']],maxDeg=[x*e.get('limit',1) for x in D['maxDeg']],
                inertia=D['inertia']*e.get('inertia',1),spin=D['spin']*e.get('spin',1),wind=D['wind']*e.get('wind',1),flutter=D['flutter']*e.get('wind',1),
                gravity=e.get('gravity',0),sagFrom=e.get('sagFrom',0),sagShare=e.get('sagShare'),maxFwd=e.get('maxFwd'),maxBack=e.get('maxBack'),maxRoll=e.get('maxRoll'),bob=e.get('bob',0),bobHz=e.get('bobHz',0.6),substep=1/120)
def simulate(P,Q,e,wind_world=None,side=1,dt=1/FPS,seed=0.0):
    """returns per frame: pitch/roll of each bone (rad), tip pitch sum. wind_world: fn(i)-> np.array (Blender world, m/s air velocity rel. character)."""
    p=params(e); M=side
    S=[dict(x=0,z=0,vx=0,vz=0) for _ in range(3)]
    prevP=P[0].copy(); prevV=np.zeros(3); acc=np.zeros(3); prevQ=Q[0].copy(); om=np.zeros(3); t=seed
    out=[]
    # world (Blender) -> three-style head frame: head frame axes in world are the head bone columns (x, y=up, z=fwd)
    for i in range(len(P)):
        R=np.array(Q[i].to_matrix())      # columns = head bone axes in Blender world: x, y (bone axis, up), z (forward = -Y at rest)
        inv=R.T
        vel=(P[i]-prevP)/dt; a=(vel-prevV)/dt; acc=acc+(a-acc)*0.25; prevV=vel; prevP=P[i].copy()
        dq=prevQ.inverted()@Q[i] if False else (Q[i]@prevQ.inverted())   # world-space rotation since last frame
        ang=2*math.acos(max(-1,min(1,dq.w))); ax=np.array([dq.x,dq.y,dq.z]); n=np.linalg.norm(ax)
        ax=ax/n if n>1e-9 else ax
        if ang>math.pi: ang-=2*math.pi
        om=om+(ax*ang/dt-om)*0.3; prevQ=Q[i].copy()
        aL=inv@acc; wL=inv@om
        wv=wind_world(i) if wind_world else np.zeros(3); windL=inv@wv; ws=np.linalg.norm(windL)
        downL=inv@np.array([0,0,-1.0])
        steps=max(1,math.ceil(dt/p['substep'])); h=dt/steps
        for _ in range(steps):
            t+=h
            for j,s in enumerate(S):
                g=1+j*0.6
                tx=(-aL[1]*p['inertia']-aL[2]*p['inertia']*1.2)*g-wL[0]*p['spin']*g
                tz=(aL[0]*p['inertia']*0.75*M)*g+wL[2]*p['spin']*g*M
                tx+=windL[2]*p['wind']*(0.6+j*0.4); tz+=-windL[0]*p['wind']*0.5*M
                fl=ws*p['flutter']*(1+j)*(math.sin(t*(7+j*3.1)+j+(1.7 if M<0 else 0))+0.5*math.sin(t*(13.3+j*5)))
                tx+=fl; tz+=fl*0.6
                if p['gravity']:
                    s0=math.sin(math.radians(p['sagFrom']))   # proposed dead zone: no sag while the head leans less than sagFrom
                    dz=lambda v: math.copysign(max(0.0,abs(v)-s0)/(1-s0),v)
                    gs=g if not p['sagShare'] else 4.8*p['sagShare'][j]   # proposed: root-heavy sag -> the ear swings at the root and stays straight
                    tx+=dz(downL[2])*p['gravity']*0.8*gs; tz+=-dz(downL[0])*p['gravity']*0.8*M*gs
                if p['bob']:   # proposed: idle bob (not in ear-dangle.v1 today)
                    tx+=p['bob']/4.8*math.radians(1)*g*(math.sin(2*math.pi*p['bobHz']*t+(0.9 if M<0 else 0))+0.35*math.sin(2*math.pi*p['bobHz']*2.37*t+1.3))
                k=p['stiffness'][j]; c=p['damping'][j]
                s['vx']+=(k*(tx-s['x'])-c*s['vx'])*h; s['x']+=s['vx']*h
                s['vz']+=(k*(tz-s['z'])-c*s['vz'])*h; s['z']+=s['vz']*h
                if p['maxFwd']:   # proposed asymmetric per-bone limits (clean deformation envelope of FB_TEMPLATE_LOOK_v5b)
                    s['x']=max(-math.radians(p['maxBack'][j]),min(math.radians(p['maxFwd'][j]),s['x'])); lr=math.radians(p['maxRoll'][j]); s['z']=max(-lr,min(lr,s['z']))
                else:
                    lim=math.radians(p['maxDeg'][j]); s['x']=max(-lim,min(lim,s['x'])); s['z']=max(-lim,min(lim,s['z']))
        out.append([(s['x'],s['z']) for s in S])
    return np.array(out)
def head_pitch_deg(Q):
    """head forward tilt vs rest: angle of the head's up axis from world up, signed by forward component."""
    r=[]
    for q in Q:
        R=np.array(q.to_matrix()); up=R[:,1]; r.append(math.degrees(math.atan2(-up[1],up[2])))   # + = leaning forward (-y)
    return np.array(r)
