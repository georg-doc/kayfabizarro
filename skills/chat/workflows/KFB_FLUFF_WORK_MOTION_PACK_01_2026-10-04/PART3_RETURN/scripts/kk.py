from lib import *; import json
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
out={}
for rr,f,cl in [('Rig_Medium','Rig_Medium/Rig_Medium_CombatMelee.glb','Melee_Unarmed_Attack_Kick'),('Rig_Large','Rig_Large/Rig_Large_CombatMelee.glb','Melee_Unarmed_Kick')]:
    rig=Rig(rr); c=Clip(A+f,cl); seq=seq_from(c); W=[rig.fk(L) for L in seq]
    hips=np.array([w['hips'][:3,3] for w in W])
    best=None
    for sd in 'lr':
        p=np.array([w[f'toes.{sd}'][:3,3] for w in W]); v=np.gradient(p,axis=0)*30; k=int(np.argmax(v[:,2]))
        if best is None or v[k,2]>best[0]: best=(v[k,2],sd,k,p[k],v[k])
    vz,sd,k,p,v=best
    out[rr]=dict(clip=cl,source=f,frames=c.N,contactFrame=k+1,part=f'toes.{sd}',partPos=[round(x,3) for x in p],partSpeed=round(float(np.linalg.norm(v)),2),hitDir=[round(x,2) for x in v/np.linalg.norm(v)],travel=round(float(np.linalg.norm((hips[-1]-hips[0])[[0,2]])),3),headMin=round(float(min(w['head'][1,3] for w in W)),3))
    print(rr,out[rr])
json.dump(out,open('kaykit_kick.json','w'),indent=1)
