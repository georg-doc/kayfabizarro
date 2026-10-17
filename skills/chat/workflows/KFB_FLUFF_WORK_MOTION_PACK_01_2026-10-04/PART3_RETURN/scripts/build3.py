# Part 3: cartoon visual sizes. Medium ball 0.477, Large ball 0.922; Medium also baked at 0.922 (growing ball / coop Sisyphos).
from lib import *; import pickle
RS,RM,RL=0.20,2.17/3,4.19/3   # Georg: work-ball diameter ~2/3 body height per rig (Medium r 0.723, Large r 1.397); Small 0.20
res=pickle.load(open('res.pkl','rb'))
for rr in res:
    for k in [k for k in res[rr] if ('push' in k or 'steer' in k)]: del res[rr][k]
def push_family(rr,R,suffix,el=20,reach_scale=1.0):
    rig=Rig(rr); S={}
    c=Clip(lib(rr,'locomotion'),'kfb_locomotion_wheelbarrow_walk_a'); src=seq_from(c)
    C,T,a=ball_contacts(rig,src,R,el_deg=el,reach=min(0.98,0.90*reach_scale)); out,e,pa=apply_push_arms(rig,src,C,T)
    S['kfb_fluff_roll_push'+(suffix if suffix!='_a' else '_a')]=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G1',donor='kfb_locomotion_wheelbarrow_walk_a',loop=True,ball=C.tolist(),R=R,ikErr=e,palmDev=pa,speed=match_speed(rig,src),
        note='legs/root/rhythm unchanged; arms IK onto the ball back, palms aimed at the ball centre')
    c=Clip(lib(rr,'locomotion_i05'),'kfb_locomotion_wheelbarrow_walk_b'); src=seq_from(c)
    st,info=strip_travel(src); st=stretch(st,round(len(src)/0.75)/len(src))
    C2,T2,_=ball_contacts(rig,st,R,el_deg=el,reach=min(0.98,0.85*reach_scale)); out,e,pa=apply_push_arms(rig,st,C2,T2)
    S['kfb_fluff_roll_push_heavy'+suffix]=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G2',donor='kfb_locomotion_wheelbarrow_walk_b',loop=True,ball=C2.tolist(),R=R,ikErr=e,palmDev=pa,speed=match_speed(rig,out),
        note='walk_b root travel stripped, time-stretched to 0.75x, arms IK as G1')
    c=Clip(lib(rr,'locomotion_i05'),'kfb_locomotion_wheelbarrow_walk_turn_a'); src=seq_from(c)
    st,info=strip_travel(src,strip_yaw=True)
    lb=loop_blend(st,8); lb,lift=floor_clamp(rig,lb,min(foot_min(rig,src),0.009*H[rr]/2.17))
    C3,T3,_=ball_contacts(rig,lb,R,el_deg=el,reach=min(0.98,0.90*reach_scale)); out,e,pa=apply_push_arms(rig,lb,C3,T3)
    sp=match_speed(rig,out)
    S['kfb_fluff_steer_left'+suffix]=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G3',donor='kfb_locomotion_wheelbarrow_walk_turn_a',loop=True,ball=C3.tolist(),R=R,ikErr=e,palmDev=pa,speed=sp,
        yawRateDegPerSec=info['yawPerFrameDeg']*30,floorLift=lift,note='turn_a: travel + yaw drift stripped, loop crossfade 8 f, arms IK as G1')
    S['kfb_fluff_steer_right'+suffix]=dict(contactElevDeg=ball_contacts.last_el,seq=mirror(out),gap='G3',donor='kfb_fluff_steer_left'+suffix+' (mirror X)',loop=True,ball=(np.array(C3)*np.array([-1,1,1])).tolist(),R=R,ikErr=e,palmDev=pa,speed=sp,
        yawRateDegPerSec=-info['yawPerFrameDeg']*30,note='mirror of steer_left')
    for k,v in S.items():
        sq=v['seq']; v.update(frames=len(sq),lean=lean_deg(rig,sq),seamDeg=seam(sq)[0],seamExcess=seam_excess(sq)[0],footMin=foot_min(rig,sq))
        print(rr,k,'R',round(R,3),'el',v['contactElevDeg'],'ik',round(v['ikErr'],4),'palm',round(v['palmDev'],1),'seamEx',round(v['seamExcess'],1),'speed',round(v['speed'],2),flush=True)
    return S
res['Rig_Large'].update(push_family('Rig_Large',RL,'_a'))
res['Rig_Medium'].update(push_family('Rig_Medium',RM,'_a'))
res['Rig_Medium'].update(push_family('Rig_Medium',RL,'_big_a'))   # repair 1 (longer reach) made IK worse and did not clear the head: reverted, reported
for rr in res:
    for k,v in res[rr].items():
        if 'ball' in v and 'R' not in v: v['R']=RM
pickle.dump(res,open('res3.pkl','wb'))
