from lib import *
import pickle
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
KK={'kfb_fluff_knead_press_a':('Tools','Working_B','G4'),'kfb_fluff_collect_debris_a':('Tools','Digging','G4'),
    'kfb_fluff_place_small_a':('General','Interact','G5'),'kfb_fluff_pack_flatten_a':('Tools','Working_A','G5'),'kfb_fluff_patch_press_a':('Tools','Work_A','G5')}
KLOOP={'Working_B':True,'Digging':True,'Interact':False,'Working_A':True,'Work_A':True}
def kaykit_seq(clip,f):
    c=Clip(A+f'Rig_Medium/Rig_Medium_{f}.glb',clip); return c,seq_from(c)
def retarget(seqM,rig):
    # identical rest rotations (max 1-|q.q| 0.0004): copy local rotations; Large rest translations; hips/root translation delta scaled
    base=Clip(lib(rig,'locomotion'),'kfb_locomotion_wheelbarrow_walk_a'); g=base.g
    restT={n:np.array(g.nodes[g.name2i[n]].get('translation',[0,0,0]),float) for n in JN}
    gm=Clip(lib('Rig_Medium','locomotion'),'kfb_locomotion_wheelbarrow_walk_a').g
    restM={n:np.array(gm.nodes[gm.name2i[n]].get('translation',[0,0,0]),float) for n in JN}
    k=restT['hips'][1]/restM['hips'][1]; out=[]
    for L in seqM:
        L2={}
        for n,(T,R,S) in L.items():
            if n in ('hips','root'): T2=restT[n]+(T-restM[n])*k
            else: T2=restT[n]
            L2[n]=(T2,R,S)
        out.append(L2)
    return out,k
# Fluff Mass Ladder (brief cd69323): 3 Medium Fluff = 1 Large Fluff (volume) -> r_L = r_M * 3^(1/3).
# One Rig_Medium rolls one Medium ball (r = 0.22 x 2.17 m, my reading), one Rig_Large rolls one Large ball.
PUSH_R={'Rig_Medium':0.22*2.17,'Rig_Large':0.22*2.17*3**(1/3)}
res={}; man=[]
for rr in ['Rig_Medium','Rig_Large']:
    rig=Rig(rr); R=PUSH_R[rr]; S={}
    # G1 roll_push: walk_a legs/rhythm, arms IK onto ball back (palm aimed at centre)
    c=Clip(lib(rr,'locomotion'),'kfb_locomotion_wheelbarrow_walk_a'); src=seq_from(c)
    C,T,a=ball_contacts(rig,src,R,el_deg=20,reach=0.90); out,e,pa=apply_push_arms(rig,src,C,T)
    S['kfb_fluff_roll_push_a']=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G1',donor='kfb_locomotion_wheelbarrow_walk_a',loop=True,ball=C.tolist(),ikErr=e,palmDev=pa,speed=match_speed(rig,src),
        note='legs/root/rhythm unchanged; arms IK to ball back at 20 deg above equator, palms aimed at ball centre')
    # G2 heavy: walk_b legs in place, 0.75x speed, its stronger lean
    c=Clip(lib(rr,'locomotion_i05'),'kfb_locomotion_wheelbarrow_walk_b'); src=seq_from(c)
    st,info=strip_travel(src); travel=np.linalg.norm(info['travelPerFrame'])*len(src)
    st=stretch(st,round(len(src)/0.75)/len(src))
    C2,T2,_=ball_contacts(rig,st,R,el_deg=20,reach=0.85); out,e,pa=apply_push_arms(rig,st,C2,T2)
    S['kfb_fluff_roll_push_heavy_a']=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G2',donor='kfb_locomotion_wheelbarrow_walk_b',loop=True,ball=C2.tolist(),ikErr=e,palmDev=pa,speed=travel/(len(out)/30),
        strippedTravelPerCycle=travel,note='walk_b root travel stripped (linear drift), time-stretched to 0.75x, arms IK as G1')
    # G3 steer_left: turn_a, travel + yaw drift stripped, loop-blended (8 f), arms IK; steer_right = mirror
    c=Clip(lib(rr,'locomotion_i05'),'kfb_locomotion_wheelbarrow_walk_turn_a'); src=seq_from(c)
    st,info=strip_travel(src,strip_yaw=True); yawcyc=info['yawPerFrameDeg']*len(src)
    lb=loop_blend(st,8); lb,lift=floor_clamp(rig,lb,min(foot_min(rig,src),0.009*H[rr]/2.17))
    C3,T3,_=ball_contacts(rig,lb,R,el_deg=20,reach=0.90); out,e,pa=apply_push_arms(rig,lb,C3,T3)
    trav=np.linalg.norm(info['travelPerFrame'])*len(src)
    S['kfb_fluff_steer_left_a']=dict(contactElevDeg=ball_contacts.last_el,seq=out,gap='G3',donor='kfb_locomotion_wheelbarrow_walk_turn_a',loop=True,ball=C3.tolist(),ikErr=e,palmDev=pa,
        speed=trav/(len(src)/30),yawRateDegPerSec=info['yawPerFrameDeg']*30,floorLift=lift,note='turn_a: root travel + yaw drift stripped (runtime turns the actor), loop crossfade 8 f, arms IK as G1')
    mb=mirror(out); Cm=np.array(C3)*np.array([-1,1,1])
    S['kfb_fluff_steer_right_a']=dict(contactElevDeg=ball_contacts.last_el,seq=mb,gap='G3',donor='kfb_fluff_steer_left_a (mirror X)',loop=True,ball=Cm.tolist(),ikErr=e,palmDev=pa,
        speed=trav/(len(src)/30),yawRateDegPerSec=-info['yawPerFrameDeg']*30,note='mirror of steer_left across the sagittal plane')
    # G4/G5: KayKit Medium native (Medium) / Medium->Large retarget (Large)
    for cid,(f,clip,gp) in KK.items():
        _,sq=kaykit_seq(clip,f)
        if rr=='Rig_Large': sq,k=retarget(sq,rr)
        S[cid]=dict(seq=sq,gap=gp,donor=f'KayKit Rig_Medium_{f}/{clip}'+(' (retarget)' if rr=='Rig_Large' else ' (native copy)'),loop=KLOOP[clip],speed=0.0,
                    note='native KayKit copy' if rr=='Rig_Medium' else 'Medium->Large retarget: rotations copied, Large rest translations, hips/root delta x2.564; no arm correction (Option A)')
    for k,v in S.items():
        sq=v['seq']; sm,smax=seam(sq); sj=step_by_joint(sq)
        armstep=max(sj[n] for n in sj if 'arm' in n or 'wrist' in n or 'hand' in n)
        v.update(frames=len(sq),lean=lean_deg(rig,sq),seamDeg=sm,seamExcess=seam_excess(sq)[0],armStepMax=armstep,footMin=foot_min(rig,sq))
        print(rr,k,v.get('contactElevDeg'),v['frames'],'seam',round(sm,1),'armstep',round(armstep,1),'lean',round(v['lean'],1),'ik',round(v.get('ikErr',0),4),'palm',round(v.get('palmDev',0),1),'speed',round(v['speed'],2),'yawRate',round(v.get('yawRateDegPerSec',0),1),'footMin',round(v['footMin'],3))
    res[rr]=S
pickle.dump(res,open('/tmp/f2/res.pkl','wb'))
