import sys, json, numpy as np, os
sys.path.insert(0,'/tmp/loco/work'); from gl import GLB, Pose
SRC='/tmp/loco/src/'; cat=json.load(open(SRC+'catalog.json'))
J=['upperarm.l','lowerarm.l','hand.l','upperarm.r','lowerarm.r','hand.r','upperleg.l','lowerleg.l','foot.l','upperleg.r','lowerleg.r','foot.r','hips','head']
SEG=[(0,1),(1,2),(3,4),(4,5),(6,7),(7,8),(9,10),(10,11),(12,13)]
G={}
def desc(path,clip,n=40):
    g=G.get(path) or G.setdefault(path,GLB(path)); p=Pose(g,clip); tr=p.track(J)
    P=np.stack([tr[k] for k in J],1)  # F x J x 3 (y up)
    hl=P[:,6]-P[:,9]; yaw=np.arctan2(hl[:,2],hl[:,0])
    c,s=np.cos(-yaw),np.sin(-yaw)
    D=[]
    for a,b in SEG:
        v=P[:,b]-P[:,a]; x=v[:,0]*c-v[:,2]*s; z=v[:,0]*s+v[:,2]*c
        w=np.stack([x,v[:,1],z],1); D.append(w/np.linalg.norm(w,axis=1,keepdims=True))
    D=np.stack(D,1); idx=np.linspace(0,len(D)-1,n).round().astype(int); return D[idx], len(P)
def dist(A,B):
    best=1e9
    for sh in range(0,len(A),2):
        Bs=np.roll(B,sh,0); d=np.degrees(np.arccos(np.clip((A*Bs).sum(-1),-1,1))).mean(); best=min(best,d)
    return best
new=json.load(open('/tmp/ml7/ids.json')); NP='/tmp/ml7/out/libs/Rig_Medium/KFB_Motion_locomotion_i07.glb'
lib=[c for c in cat['clips'] if c['group']=='locomotion']
DL={}
for c in lib:
    f=SRC+'Rig_Medium__'+c['library']['Rig_Medium'].split('/')[-1]; DL[c['id']]=desc(f,c['id'])
DN={x['id']:desc(NP,x['id']) for x in new}
res={}
for x in new:
    a,na=DN[x['id']]; cands=[]
    for k,(b,nb) in list(DL.items())+[(k,v) for k,v in DN.items() if k!=x['id']]:
        cands.append((round(dist(a,b),1),k,nb))
    cands.sort(); res[x['id']]={'file':x['file'],'frames':na,'nearest':cands[:3]}
    print(x['file'].ljust(34),na,cands[:2],flush=True)
json.dump(res,open('/tmp/ml7/w/dup.json','w'),indent=1)
