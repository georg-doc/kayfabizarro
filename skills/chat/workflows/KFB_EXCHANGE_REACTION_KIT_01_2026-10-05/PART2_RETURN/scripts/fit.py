import sys,json,pickle,numpy as np; sys.path.insert(0,'/tmp/f3'); from lib import *
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
rig=Rig('Rig_Large'); Hh=H['Rig_Large']; PALM=0.02*Hh
def ramp(f,a,b,K=8):
    if f<a-K or f>b+K: return 0.0
    if f<a: return ease((f-(a-K))/K)
    if f>b: return ease(1-(f-b)/K)
    return 1.0
def ease(t): return t*t*(3-2*t)
def fit(src,sep_target,a,b):
    C=Clip(ML+cat[src]['library']['Rig_Large'],src); out=[]; x0={'l':None,'r':None}; E=[];P=[];S=[]
    for f in range(C.N):
        L=C.locals(f); W=rig.fk(L); hl=W['handslot.l'][:3,3]; hr=W['handslot.r'][:3,3]; m=(hl+hr)/2; d=np.linalg.norm(hl-hr); u=(hl-hr)/d
        w=ramp(f,a,b)
        if w>0:
            s=(d*(1-w)+sep_target*w)/2
            for sd,sg in (('l',1),('r',-1)):
                L,x,e,pa=ik_arm(rig,L,sd,m+sg*u*s,-sg*u,x0[sd],wpalm=0.6,wfing=0.2); x0[sd]=x; E.append(e); P.append(pa)
        else: x0={'l':None,'r':None}
        W2=rig.fk(L); S.append((f,round(float(np.linalg.norm(W2['handslot.l'][:3,3]-W2['handslot.r'][:3,3])),3),round(w,2)))
        out.append(L)
    return out,dict(maxIK=round(max(E),4) if E else 0,maxPalmDeg=round(max(P),1) if P else 0,sepTrace=S[::6])
res={}; met={}
w_box=0.209*Hh   # same box/height ratio as Robot (0.454/2.17)
seq,m=fit('kfb_interaction_gift_give_a',w_box+2*PALM,18,50); res['kfb_interaction_gift_give_fit_a']=seq; met['give']=dict(m,boxWidth=round(w_box,3))
seq,m=fit('kfb_interaction_gift_receive_a',w_box+2*PALM,40,89); res['kfb_interaction_gift_receive_fit_a']=seq; met['receive']=dict(m,boxWidth=round(w_box,3))
lid=0.926; seq,m=fit('kfb_interaction_opening_a_lid_a',lid+2*0.017*Hh/2.17,40,170); res['kfb_interaction_opening_a_lid_fit_a']=seq; met['lid']=dict(m,lidWidth=lid)
pickle.dump(res,open('fit.pkl','wb')); json.dump(met,open('fit.json','w'),indent=1); print(json.dumps({k:{kk:vv for kk,vv in v.items() if kk!='sepTrace'} for k,v in met.items()}))
