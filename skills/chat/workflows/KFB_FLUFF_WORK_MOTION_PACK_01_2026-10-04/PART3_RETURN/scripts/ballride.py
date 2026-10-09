from lib import *; import json,pickle
cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
RS,RM,RL=0.20,2.17/3,4.19/3
def standing_offsets(rig):
    c=Clip(lib(rig.rig,'idle'),[k for k in GLB(lib(rig.rig,'idle')).anims if 'breathing' in k][0]); W=rig.fk(c.locals(0))
    return {n:W[n][1,3] for n in ('foot.l','foot.r','toes.l','toes.r')}
def on_ball(rr,cid,R,travel=False,name=None,note=''):
    rig=Rig(rr); e=cat[cid]; c=Clip(ML+e['library'][rr],cid); seq=seq_from(c)
    if travel: seq,_=strip_travel(seq)
    off=standing_offsets(rig)
    W=[rig.fk(L) for L in seq]
    feet=np.array([[w[n][:3,3] for n in off] for w in W])            # (F,4,3)
    cx,cz=feet[:,:,0].mean(),feet[:,:,2].mean()
    out=[]; lifts=[]; drops=[]
    for L,fp in zip(seq,feet):
        need=[]
        for (n,y0),p in zip(off.items(),fp):
            dx,dz=p[0]-cx,p[2]-cz; d2=dx*dx+dz*dz
            surf=R+math.sqrt(max(R*R-d2,0.0)) if d2<R*R else R
            need.append(surf+y0-p[1])
        lift=max(need); lifts.append(lift); drops.append(lift-min(need))
        L=dict(L); T=L['root'][0].copy(); T[0]-=cx; T[2]-=cz; T[1]+=lift; setT(L,'root',T); out.append(L)
    sm=seam_excess(out)[0] if e.get('loop') else None
    rec=dict(seq=out,gap='PLAY',donor=cid+(' (travel stripped)' if travel else ''),loop=bool(e.get('loop')),ball=[0.0,R,0.0],R=R,
             rootLiftRange=[round(min(lifts),3),round(max(lifts),3)],footGapMax=round(float(max(drops)),3),note=note,speed=0.0,
             frames=len(out),lean=lean_deg(rig,out),seamDeg=seam(out)[0],seamExcess=sm if sm is not None else 0.0,footMin=foot_min(rig,out))
    print(rr,name,'R',round(R,2),'lift',rec['rootLiftRange'],'footGapMax',rec['footGapMax'],'seamEx',None if sm is None else round(sm,1),flush=True)
    return name,rec
def foot_roll(rr,R):
    rig=Rig(rr); cid='kfb_locomotion_happy_walk_a'; e=cat[cid]; c=Clip(ML+e['library'][rr],cid); seq,info=strip_travel(seq_from(c))
    W=[rig.fk(L) for L in seq]; tl=np.array([w['toes.l'][:3,3] for w in W]); tr=np.array([w['toes.r'][:3,3] for w in W])
    zmax=max(tl[:,2].max(),tr[:,2].max()); y=float(np.mean([tl[np.argmax(tl[:,2]),1],tr[np.argmax(tr[:,2]),1]]))
    back=math.sqrt(max(R*R-(R-y)**2,0)); C=[float(np.mean([tl[:,0].mean(),tr[:,0].mean()])),R,float(zmax+back)]
    ev=[dict(frame=int(np.argmax(tl[:,2]))+1,part='toes.l'),dict(frame=int(np.argmax(tr[:,2]))+1,part='toes.r')]
    rec=dict(seq=seq,gap='PLAY',donor=cid+' (travel stripped)',loop=True,ball=C,R=R,speed=match_speed(rig,seq),events=ev,
             note='walk behind the ball; each forward swing taps the ball back (contact events); runtime rolls the ball at root speed',
             frames=len(seq),lean=lean_deg(rig,seq),seamDeg=seam(seq)[0],seamExcess=seam_excess(seq)[0],footMin=foot_min(rig,seq))
    print(rr,'foot_roll','C',np.round(C,2),'events',ev,'speed',round(rec['speed'],2),'seamEx',round(rec['seamExcess'],1))
    return 'kfb_fluff_foot_roll_a',rec
res=pickle.load(open('res3.pkl','rb'))
for rr,R in [('Rig_Medium',RM),('Rig_Large',RL)]:
    for nm,cid,tr,nt in [('kfb_fluff_ball_surf_a','kfb_locomotion_skateboarding_c',True,'skate stance on the ball top; runtime rolls the ball, actor root rides at the ball base point'),
                         ('kfb_fluff_ball_balance_a','kfb_idle_happy_a',False,'happy idle balanced on the ball top'),
                         ('kfb_fluff_ball_dance_a','kfb_dance_twist_dance_a',False,'twist dance on the ball top')]:
        k,v=on_ball(rr,cid,R,tr,nm,nt); res[rr][k]=v
    k,v=foot_roll(rr,RS*(1 if rr=='Rig_Medium' else 4.19/2.17)); res[rr][k]=v   # one size down from the rig's own work ball
pickle.dump(res,open('res3.pkl','wb'))
