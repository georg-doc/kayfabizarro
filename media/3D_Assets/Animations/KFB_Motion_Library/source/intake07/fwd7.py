import sys,json,math,os; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy,numpy as np
import glb
c=json.load(open('/tmp/ml7/out/KFB_Motion_Library.catalog.json'))
def path(rel):
    for b in ('/tmp/ml7/out/','/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/','/tmp/ml5/out/','/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/','/tmp/an1/out/'):
        if os.path.exists(b+rel): return b+rel
    raise FileNotFoundError(rel)
def yl(W,l,r):
    a=W[l].translation; b=W[r].translation; return math.atan2(a.y-b.y,a.x-b.x)-math.pi/2
def body(W):
    a=yl(W,'upperleg.l','upperleg.r'); b=yl(W,'upperarm.l','upperarm.r'); return math.atan2(math.sin(a)+math.sin(b),math.cos(a)+math.cos(b))
d=lambda x: round((math.degrees(x)+180)%360-180,1)
out={}
for e in [e for e in c['clips'] if e.get('intake')=='07']:
    cid=e['id']; G=glb.clip_world(path(e['library']['Rig_Medium']),cid); fs=[body(W) for W in G]
    mean=math.atan2(sum(map(math.sin,fs)),sum(map(math.cos,fs)))
    use=mean if e.get('loop') else fs[0]; how='cycleMean' if e.get('loop') else 'firstFrame'
    tr=None; trm=None
    if e['group']=='locomotion':
        H=G[-1]['hips'].translation-G[0]['hips'].translation
        if math.hypot(H.x,H.y)>0.3: tr=math.atan2(H.y,H.x); trm='hipsTravel'
        else:
            V=[]
            for i in range(1,len(G)):
                for f in ('foot.l','foot.r'):
                    q=(G[i][f].translation-G[i]['hips'].translation)-(G[i-1][f].translation-G[i-1]['hips'].translation); V.append((q.x,q.y))
            V=np.array(V)
            if len(V) and np.linalg.norm(V,axis=1).mean()*30>0.3:
                w,v=np.linalg.eigh(V.T@V); ax=math.atan2(v[1,-1],v[0,-1])
                tr=min([ax,ax+math.pi],key=lambda a:abs(math.atan2(math.sin(a-mean),math.cos(a-mean)))); trm='feetAxis'
    out[cid]={'forwardYawDeg':d(use),'method':how,'travelYawDeg':d(tr) if tr is not None else None,'travelMethod':trm,'atFirstFrameDeg':d(fs[0]),'atLastFrameDeg':d(fs[-1])}
json.dump(out,open('/tmp/ml7/fwd7.json','w'),indent=0); print('done',len(out))
