from lib import *; import json
cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']+json.load(open(ML+'patch_an01.json'))['clips']}
P={'kfb_action_header_soccerball_a':('head','up'),'kfb_action_kicking_a':('toes.r','kick'),'kfb_action_inside_crescent_kick_a':('toes.r','kick'),
   'kfb_action_headbutt_a':('head','fwd'),'kfb_action_headbutt_b':('head','fwd'),'kfb_throw_frisbee_a':('hand.r','speed'),'kfb_throw_goalkeeper_overhand_a':('hand.r','speed'),
   'kfb_locomotion_skateboarding_a':('feet','stand'),'kfb_locomotion_skateboarding_b':('feet','stand'),'kfb_locomotion_skateboarding_c':('feet','stand'),
   'kfb_idle_happy_a':('feet','stand'),'kfb_dance_twist_dance_a':('feet','stand')}
out={}
for rr in ['Rig_Medium','Rig_Large']:
    rig=Rig(rr); out[rr]={}
    for cid,(part,mode) in P.items():
        e=cat[cid]; c=Clip(ML+e['library'][rr],cid); seq=seq_from(c); W=[rig.fk(L) for L in seq]
        hd=np.array([w['head'][:3,3] for w in W]); hips=np.array([w['hips'][:3,3] for w in W])
        rec=dict(frames=c.N,loop=e.get('loop'),rootMotion=e.get('rootMotion'),library=e['library'][rr])
        rec['headMinOverH']=round(float(hd[:,1].min()/H[rr]),3)
        if mode=='stand':
            fl=np.array([w['foot.l'][:3,3] for w in W]); fr_=np.array([w['foot.r'][:3,3] for w in W])
            sep=np.linalg.norm((fl-fr_)[:,[0,2]],axis=1); low=np.minimum(fl[:,1],fr_[:,1])
            rec.update(footSepMax=round(float(sep.max()),3),footSepMean=round(float(sep.mean()),3),footLowMin=round(float(low.min()),3),
                       bothFeetDownFrac=round(float(np.mean((np.abs(fl[:,1]-fr_[:,1])<0.03*H[rr]))),2),travel=round(float(np.linalg.norm((hips[-1]-hips[0])[[0,2]])),2))
        else:
            p=np.array([w[part][:3,3] for w in W]); v=np.gradient(p,axis=0)*30
            if mode=='up': f=int(np.argmax(v[:,1]))
            elif mode=='fwd': f=int(np.argmax(v[:,2]))
            elif mode=='kick':   # ball resting on the ground: fastest forward toe while the toe is below ball-centre height
                Rb=0.22*H[rr]; ok=p[:,1]<=Rb*1.1; vz=np.where(ok,v[:,2],-1e9); f=int(np.argmax(vz))
            else: f=int(np.argmax(np.linalg.norm(v,axis=1)))
            d=v[f]/np.linalg.norm(v[f])
            rec.update(contactFrame=f+1,part=part,partPos=[round(x,3) for x in p[f]],partSpeed=round(float(np.linalg.norm(v[f])),2),hitDir=[round(x,2) for x in d])
        out[rr][cid]=rec; print(rr,cid,rec,flush=True)
json.dump(out,open('play.json','w'),indent=1)
