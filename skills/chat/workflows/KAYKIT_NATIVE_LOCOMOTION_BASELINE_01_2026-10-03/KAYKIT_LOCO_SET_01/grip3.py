import sys,json,numpy as np
sys.path.insert(0,'/tmp/loco/work')
from gl import *
from scipy.spatial.transform import Rotation as Ro
g=GLB('WPN2.glb'); p=Pose(g,'WEAPON_LOCO_02')
D=json.load(open('wpn2_info.json')); info=D['info']; SEG=D['seg']
hs=g.name2i['handslot.r']; la=g.name2i['lowerarm.r']; wr=g.name2i['wrist.r']
F=np.array([0,0,1.]); U=np.array([0,1.,0]); nz=lambda v:v/np.linalg.norm(v)
STAFF=nz(U*np.cos(np.radians(70))+F*np.sin(np.radians(70)))
res={}
for si,sg in enumerate(SEG):
    mode={'fwd':'forearm'}.get(sg[5],sg[5]) or 'aim'
    s0=min(x['f'] for x in info if x['seg']==si)
    Ws=[];T=[];S=[]
    for r in info:
        if r['seg']!=si or (mode=='aim' and r['f']-s0<15): continue
        c={}; t=p.t0+r['f']/30; M=p.world(hs,t,c)[:3,:3]; Ws.append(M/np.linalg.norm(M,axis=0))
        if mode=='forearm':
            fa=nz(p.world(wr,t,c)[:3,3]-p.world(la,t,c)[:3,3]); T.append(fa); S.append(U)
        elif mode=='aim': T.append(F); S.append(U)
        else: T.append(STAFF); S.append(U)   # staff: model up (sights/top) toward world up -> bayonet underneath
    d=nz(sum(w.T@t for w,t in zip(Ws,T))); u=sum(w.T@s for w,s in zip(Ws,S)); u=nz(u-u.dot(d)*d)
    R=np.stack([np.cross(u,d),u,d],1)
    ang=[np.degrees(np.arccos(np.clip((w@d).dot(t),-1,1))) for w,t in zip(Ws,T)]
    res[si]={'quat_xyzw':Ro.from_matrix(R).as_quat().round(5).tolist(),'meanDevDeg':round(float(np.mean(ang)),1),'maxDevDeg':round(float(np.max(ang)),1),'target':mode}
    print(si,sg[1][:34],res[si])
json.dump(res,open('grips2.json','w'),indent=1)
