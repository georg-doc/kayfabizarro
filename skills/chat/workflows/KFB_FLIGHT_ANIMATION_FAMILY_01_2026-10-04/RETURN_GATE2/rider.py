import sys,json,math,numpy as np
sys.path.insert(0,'/tmp/loco/work'); sys.path.insert(0,'/tmp/fl')
from gl import *
from wtool import read,write,add_anim
SRC='/tmp/kn2/KAYKIT_NATIVE_BASELINE_01_Mannequin_Medium.glb'
UALP='/mnt/user-data/uploads/BLENDER MCP--_inbox/Universal Animation Library 2[Standard]/Unreal-Godot/UAL2_Standard.glb'
g=GLB(SRC); FPS=30
J=[g.nodes[j]['name'] for j in g.json['skins'][0]['joints']]
def qax(axis,deg):
    a=math.radians(deg)/2; v=np.array(axis,float)*math.sin(a); return np.array([v[0],v[1],v[2],math.cos(a)])
def qmul(a,b):
    x1,y1,z1,w1=a; x2,y2,z2,w2=b
    return np.array([w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2])
def qinv(q): return np.array([-q[0],-q[1],-q[2],q[3]])
def m2q(M):
    m=M[:3,:3]; t=np.trace(m)
    if t>0: s=math.sqrt(t+1)*2; return qnorm(np.array([(m[2,1]-m[1,2])/s,(m[0,2]-m[2,0])/s,(m[1,0]-m[0,1])/s,0.25*s]))
    i=int(np.argmax([m[0,0],m[1,1],m[2,2]]))
    if i==0: s=math.sqrt(1+m[0,0]-m[1,1]-m[2,2])*2; return qnorm(np.array([0.25*s,(m[0,1]+m[1,0])/s,(m[0,2]+m[2,0])/s,(m[2,1]-m[1,2])/s]))
    if i==1: s=math.sqrt(1+m[1,1]-m[0,0]-m[2,2])*2; return qnorm(np.array([(m[0,1]+m[1,0])/s,0.25*s,(m[1,2]+m[2,1])/s,(m[0,2]-m[2,0])/s]))
    s=math.sqrt(1+m[2,2]-m[0,0]-m[1,1])*2; return qnorm(np.array([(m[0,2]+m[2,0])/s,(m[1,2]+m[2,1])/s,0.25*s,(m[1,0]-m[0,1])/s]))
X,Y,Z=(1,0,0),(0,1,0),(0,0,1)
IDLE=Pose(g,'Idle_A')
def restT(b): return np.array(g.nodes[g.name2i[b]].get('translation',[0,0,0]),float)
def fk(rots,trans):
    # world matrices for joints given local rots/trans (root chain from skin joints)
    W={}
    def w(b):
        if b in W: return W[b]
        i=g.name2i[b]; M=trs(trans.get(b,restT(b)),rots[b],[1,1,1])
        p=g.parent.get(i); pn=g.nodes[p].get('name') if p is not None else None
        W[b]=(w(pn)@M) if pn in rots else M; return W[b]
    for b in rots: w(b)
    return W
def sole(W):
    return min(min(W['toes'+s][1,3]-0.026, W['foot'+s][1,3]-0.145) for s in ('.l','.r'))
# ---- authored CARD_SURF stance parameters (degrees). Rider faces flight forward; KayKit axes: +X left, +Y up, +Z forward.
P0=dict(lean=0,roll=0,yaw=0,crouch=6,stag=10,arm=14,armF=0,armIn=0,head_x=0,head_z=0,chest_x=0,chest_z=0,tuck=0)
ST={'SOURCE_NEUTRAL':dict(P0,crouch=0,stag=0,arm=0),
    'CALM_LECTERN':dict(P0,crouch=10,stag=14,arm=12,lean=3,head_x=-4),
    'CRUISE':dict(P0,crouch=30,stag=24,arm=36,lean=12,chest_x=6,head_x=-10,armF=8),
    'BOOST':dict(P0,crouch=44,stag=26,arm=26,lean=22,chest_x=12,head_x=-18,armF=-22),
    'BANK_LEFT':dict(P0,crouch=34,stag=24,arm=42,lean=10,roll=10,chest_z=-12,head_z=-14,armIn=1),
    'BANK_RIGHT':dict(P0,crouch=34,stag=24,arm=42,lean=10,roll=-10,chest_z=12,head_z=14,armIn=-1),
    'CLIMB':dict(P0,crouch=32,stag=24,arm=30,lean=20,chest_x=8,head_x=-18),
    'DIVE':dict(P0,crouch=36,stag=26,arm=46,lean=-10,chest_x=-6,head_x=8,armF=16),
    'BRAKE_RECOVER':dict(P0,crouch=32,stag=22,arm=38,lean=-14,head_x=4,armF=24),
    'BARREL_ROLL':dict(P0,crouch=52,stag=24,arm=64,lean=16,chest_x=10,head_x=-12,tuck=1),
    'LAND_HOVER_PREP':dict(P0,crouch=14,stag=14,arm=16,lean=2,head_x=-4)}
def pose_from(P,t,bank_live=0.0):
    lr=IDLE.localrots(J,IDLE.t0+(t%IDLE.T)); rots={}; trans={}
    for b in J:
        q=lr[b].copy()
        if b=='hips':
            q=qmul(qax(Z,P['roll']),qmul(qax(X,P['lean']),q))
        elif b=='chest':
            q=qmul(qax(Z,P['chest_z']),qmul(qax(X,P['chest_x']),q))
        elif b=='head':
            q=qmul(qax(Z,P['head_z']),qmul(qax(X,P['head_x']-P['lean']*0.5),q))
        elif b.startswith('upperarm'):
            s=1 if b.endswith('.l') else -1
            a=P['arm']+P['armIn']*s*(-14)      # inner (low) side arm lower, outer arm higher
            q=qmul(qax(X,P['armF']*-1),qmul(qax(Z,s*a),q))
        elif b.startswith('lowerarm'):
            s=1 if b.endswith('.l') else -1
            q=qmul(q,qax(Y,s*(8+P['tuck']*20)))
        elif b.startswith('upperleg'):
            s=1 if b.endswith('.l') else -1     # left foot forward (stagger)
            q=qmul(qax(X,-P['crouch']-s*P['stag']),qmul(qax(Z,s*4),q))
        elif b.startswith('lowerleg'):
            q=qmul(q,qax(X,2*P['crouch']))
        elif b.startswith('foot'):
            s=1 if b.endswith('.l') else -1
            q=qmul(q,qax(X,-P['crouch']+s*P['stag']))
        rots[b]=qnorm(q)
    trans['hips']=restT('hips').copy(); trans['root']=restT('root')
    W=fk(rots,trans); trans['hips'][1]-=sole(W)    # plant: lowest sole on seat plane y=0
    return rots,trans
def smooth_params(frames):
    cur=dict(ST['SOURCE_NEUTRAL']); out=[]
    for f in frames:
        tgt=ST[f['state']]; r=min(1,(1/FPS)*5)
        cur={k:cur[k]+(tgt[k]-cur[k])*r for k in cur}; out.append(dict(cur))
    return out
def retarget_frame(clip,tfrac):
    u=GLB(UALP); P=Pose(u,clip); t=P.t0+P.T*tfrac
    MAP={'hips':'pelvis','spine':'spine_01','chest':'spine_03','head':'Head','upperarm.l':'upperarm_l','lowerarm.l':'lowerarm_l','wrist.l':'hand_l',
         'upperarm.r':'upperarm_r','lowerarm.r':'lowerarm_r','wrist.r':'hand_r','upperleg.l':'thigh_l','lowerleg.l':'calf_l','foot.l':'foot_l','toes.l':'ball_l',
         'upperleg.r':'thigh_r','lowerleg.r':'calf_r','foot.r':'foot_r','toes.r':'ball_r'}
    def restW(gg,nm):
        i=gg.name2i[nm]; n=gg.nodes[i]; M=trs(n.get('translation',[0,0,0]),n.get('rotation',[0,0,0,1]),n.get('scale',[1,1,1]))
        return restW(gg,gg.nodes[gg.parent[i]]['name'])@M if i in gg.parent else M
    c={}; tgtW={}
    for b,m in MAP.items():
        Rs=P.world(u.name2i[m],t,c)[:3,:3]; Rs0=restW(u,m)[:3,:3]; Rt0=restW(g,b)[:3,:3]
        tgtW[b]=(Rs@np.linalg.inv(Rs0))@Rt0
    rots={}
    for b in J:
        i=g.name2i[b]; pnm=g.nodes[g.parent[i]]['name'] if i in g.parent else None
        if b in tgtW:
            # parent world: walk up to nearest mapped/known
            def pw(nm):
                if nm is None: return np.eye(3)
                if nm in tgtW: return tgtW[nm]
                ii=g.name2i[nm]; q=np.array(g.nodes[ii].get('rotation',[0,0,0,1]),float)
                pp=g.nodes[g.parent[ii]]['name'] if ii in g.parent else None
                R=pw(pp)@qmat(q); tgtW[nm]=R; return R
            M=np.eye(4); M[:3,:3]=np.linalg.inv(pw(pnm))@tgtW[b]; rots[b]=m2q(M)
        else: rots[b]=qnorm(np.array(g.nodes[i].get('rotation',[0,0,0,1]),float))
    trans={'hips':restT('hips').copy(),'root':restT('root')}
    W=fk(rots,trans); trans['hips'][1]-=sole(W)
    return rots,trans
if __name__=='__main__':
    sim=json.load(open('/tmp/g2b/sim.json')); frames=sim['frames']
    PP=smooth_params(frames)
    JJ,BB=read(SRC); JJ['animations']=[]
    def tracks(seq):
        N=len(seq); tr={(g.name2i[b],'rotation'):np.zeros((N,4)) for b in J}; tr[(g.name2i['hips'],'translation')]=np.zeros((N,3))
        for f,(rots,trans) in enumerate(seq):
            for b in J: tr[(g.name2i[b],'rotation')][f]=rots[b]
            tr[(g.name2i['hips'],'translation')][f]=trans['hips']
        return tr
    seq=[pose_from(P,f/FPS) for f,P in enumerate(PP)]
    add_anim(JJ,BB,'CARD_SURF_REVIEW',tracks(seq),FPS)
    man=[]
    for st,P in ST.items():
        if st=='SOURCE_NEUTRAL': continue
        N=int(round(IDLE.T*FPS)); s2=[pose_from(P,f/FPS) for f in range(N)]
        add_anim(JJ,BB,'CARD_SURF_'+st,tracks(s2),FPS); man.append(dict(clip='CARD_SURF_'+st,frames=N,loop=True,params=P,donor='KayKit Idle_A (breathing) + authored offsets'))
    sd=retarget_frame('Shield_Dash',0.45); add_anim(JJ,BB,'CARD_SURF_SHIELDDASH_STANCE',tracks([sd]*30),FPS)
    nj=retarget_frame('NinjaJump_Idle_Loop',0.3); add_anim(JJ,BB,'CARD_SURF_NINJAJUMP_STANCE',tracks([nj]*30),FPS)
    write(JJ,BB,'/tmp/g2b/KFB_CARD_SURF_RIDER_Mannequin.glb')
    json.dump(dict(params=PP,clips=man),open('/tmp/g2b/rider.json','w'))
    print('ok',len(seq))
