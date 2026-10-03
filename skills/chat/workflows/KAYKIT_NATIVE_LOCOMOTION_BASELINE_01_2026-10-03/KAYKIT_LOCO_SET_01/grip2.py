import sys,json,numpy as np
sys.path.insert(0,'/tmp/loco/work')
from gl import *
from scipy.spatial.transform import Rotation as Ro
g=GLB('WPN2.glb'); p=Pose(g,'WEAPON_LOCO_02')
D=json.load(open('wpn2_info.json')); info=D['info']; SEG=D['seg']
hs=g.name2i['handslot.r']
F=np.array([0,0,1.]); U=np.array([0,1.,0]); nz=lambda v:v/np.linalg.norm(v)
STAFF=nz(U*np.cos(np.radians(70))+F*np.sin(np.radians(70)))   # muzzle forward-up, 70 deg from vertical
res={}
for si,sg in enumerate(SEG):
    mode=sg[5] or 'aim'
    tm,ts=(F,U) if mode in ('fwd','aim') else (STAFF,F)
    Ws=[]
    for r in info:
        if r['seg']==si and (mode!='aim' or r['f']-min(x['f'] for x in info if x['seg']==si)>=15):
            c={}; w=p.world(hs,p.t0+r['f']/30,c)[:3,:3]; Ws.append(w/np.linalg.norm(w,axis=0))
    d=nz(sum(w.T@tm for w in Ws)); u=sum(w.T@ts for w in Ws); u=nz(u-u.dot(d)*d); R=np.stack([np.cross(u,d),u,d],1)
    ang=[np.degrees(np.arccos(np.clip((w@d).dot(tm),-1,1))) for w in Ws]
    res[si]={'quat_xyzw':Ro.from_matrix(R).as_quat().round(5).tolist(),'meanDevDeg':round(float(np.mean(ang)),1),'maxDevDeg':round(float(np.max(ang)),1),'target':mode}
    print(si,sg[1][:40],res[si])
json.dump(res,open('grips2.json','w'),indent=1)
