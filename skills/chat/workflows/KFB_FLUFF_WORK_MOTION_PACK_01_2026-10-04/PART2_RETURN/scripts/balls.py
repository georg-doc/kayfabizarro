from lib import *; import pickle,json
res=pickle.load(open('/tmp/f2/res.pkl','rb')); out={}; rep={}
REL={'two':{'Rig_Medium':0.11,'Rig_Large':0.22},'one':{'Rig_Medium':0.09,'Rig_Large':0.09}}
for rr,S in res.items():
    rig=Rig(rr); h=H[rr]; out[rr]={}
    for k,v in S.items():
        seq=v['seq']; W=[rig.fk(L) for L in seq]
        hl=np.array([w['handslot.l'][:3,3] for w in W]); hr=np.array([w['handslot.r'][:3,3] for w in W]); mid=(hl+hr)/2
        if 'ball' in v:
            C=np.array(v['ball']); R=RW[rr]; kind='push (0.22 H, ground)'
        elif k=='kfb_fluff_knead_press_a':
            R=REL['two'][rr]*h; C=mid.mean(0); kind=f'bench chunk {REL["two"][rr]} H between hands'
        elif k=='kfb_fluff_collect_debris_a':
            R=REL['two'][rr]*h; f=int(np.argmin(mid[:,1])); C=np.array([mid[f,0],R,mid[f,2]+R*0.6]); kind=f'ground chunk {REL["two"][rr]} H at scoop'
        else:
            R=REL['one'][rr]*h; f=int(np.argmax(np.maximum(hl[:,2],hr[:,2]))); hand=hl if hl[f,2]>=hr[f,2] else hr
            C=hand[f]+np.array([0,-R*0.2,R*0.9]); kind=f'small chunk {REL["one"][rr]} H at reach'
        dl=np.linalg.norm(hl-C,axis=1)-R; dr=np.linalg.norm(hr-C,axis=1)-R
        out[rr][k]=dict(C=C.tolist(),R=R,spin=v.get('speed',0)/R if 'ball' in v else 0.0)
        rep[f'{rr}:{k}']=dict(kind=kind,R=round(R,3),surfDist_l=[round(float(dl.min()),3),round(float(dl.max()),3)],surfDist_r=[round(float(dr.min()),3),round(float(dr.max()),3)])
        print(rr,k,rep[f'{rr}:{k}'])
json.dump(out,open('/tmp/f2/balls.json','w')); json.dump(rep,open('/tmp/f2/contact.json','w'),indent=1)
