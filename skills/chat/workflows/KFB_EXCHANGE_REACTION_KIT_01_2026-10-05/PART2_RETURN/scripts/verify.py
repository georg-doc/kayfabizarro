import sys,json,pickle,math,numpy as np; sys.path.insert(0,'/tmp/f3'); from lib import *
R=pickle.load(open('react.pkl','rb')); meta=json.load(open('react_meta.json'))
rep={}
def ang(a,b): return math.degrees(2*math.acos(min(1,abs(float(np.dot(a,b))))))
for rig in ['Rig_Medium','Rig_Large']:
    rg=Rig(rig); p=f'/tmp/x2/KFB_Motion_exchange01_{rig}.glb'
    for cid,seq in R[rig].items():
        C=Clip(p,cid); 
        rt=max(np.linalg.norm(C.fk(C.locals(f))['handslot.r'][:3,3]-rg.fk(seq[f])['handslot.r'][:3,3]) for f in (0,len(seq)//2,len(seq)-1))
        steps=[max(ang(seq[k][n][1],seq[k+1][n][1]) for n in seq[0] if n!='root') for k in range(len(seq)-1)]
        K=12; blend=max(steps[:K]+steps[-K:]); inner=max(steps[K:-K]) if len(steps)>2*K else 0
        fm=min(min(rg.fk(L)[n][1,3] for n in ('toes.l','toes.r','foot.l','foot.r')) for L in seq)
        rep.setdefault(cid,{})[rig]=dict(frames=len(seq),roundTrip=round(float(rt),4),maxStepBlendDeg=round(blend,1),maxStepInnerDeg=round(inner,1),footMinY=round(float(fm),3))
        print(rig,cid,rep[cid][rig])
json.dump(rep,open('verify.json','w'),indent=1)
