# shoulder-throw pair: both clips root-aligned; measure hand contact and head clash for all rig pairings
exec(open('/tmp/fs1/common.py').read())
from scipy.spatial import cKDTree
CORR=open_ws()
AG,VI='kfb_throw_shoulder_aggressor_a','kfb_throw_shoulder_victim_a'
S={'Rig_Medium':1.0,'Rig_Large':2.568}
cache={}
def vv(rig,cid,f):
    k=(rig,cid,f)
    if k not in cache:
        W=frames(rig,cid)[f-1]; pose(rig,W,CORR); v=verts(rig)
        hs=[np.array(W['handslot.l'].translation),np.array(W['handslot.r'].translation)]
        cache[k]=(v,hs)
    return cache[k]
res={}
FR=list(range(1,202,4))
for ra in RIGS:
    for rb in RIGS:
        sa,sb=S[ra],S[rb]; tol=0.01*min(sa,sb); rows=[]
        for f in FR:
            va,hs=vv(ra,AG,f); vb,_=vv(rb,VI,f)
            A=np.vstack([va['ArmLeft'],va['ArmRight']]); hand=A[np.min([np.linalg.norm(A-h,axis=1) for h in hs],axis=0)<0.13*sa]
            tb=cKDTree(np.vstack(list(vb.values()))); th=cKDTree(vb['Head'])
            hg=float(tb.query(hand)[0].min()); hh=float(th.query(va['Head'])[0].min())
            rows.append((f,round(hg,3),round(hh,3)))
        touch=[f for f,g,h in rows if g<=tol]; clash=[f for f,g,h in rows if h<=tol]
        res[f'{ra}|{rb}']={'handTouchFrames':touch,'headClashFrames':clash,'minHandGapM':min(g for f,g,h in rows),
                          'handGapByFrame':{f:g for f,g,h in rows}}
        print(ra,rb,'touch',touch[:3],'...',len(touch),'clash',len(clash),'minGap',res[f'{ra}|{rb}']['minHandGapM'],flush=True)
json.dump(res,open('/tmp/fs1/out/throw.json','w'),indent=1)
