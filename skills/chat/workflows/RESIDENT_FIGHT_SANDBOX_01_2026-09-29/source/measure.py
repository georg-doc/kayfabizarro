# FIGHT-SANDBOX-01 · measure fight clips on both rigs straight from the published GLBs
import bpy, sys, json, math, os
import numpy as np
sys.path.insert(0,'/tmp/ch1'); import glb
CAT=json.load(open('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/KFB_Motion_Library.catalog.json'))
C={c['id']:c for c in CAT['clips']}
def path(rel):
    for base in ('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/','/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/'):
        if os.path.exists(base+rel): return base+rel
    raise FileNotFoundError(rel)
ATT={ # id: allowed striking limbs (None = hands)
 'kfb_action_punching_a':None,'kfb_action_punching_b':None,'kfb_action_hook_punch_a':None,'kfb_action_hook_punch_b':None,
 'kfb_action_quad_punch_a':None,'kfb_action_fist_fight_a_a':None,'kfb_action_fist_fight_b_a':None,'kfb_action_fist_fight_b_b':None,
 'kfb_action_mutant_swiping_a':None,'kfb_action_back_flip_to_uppercut_a':None,
 'kfb_action_headbutt_a':['head'],'kfb_action_headbutt_b':['head'],
 'kfb_action_illegal_knee_a':['lowerleg.l','lowerleg.r'],
 'kfb_action_kicking_a':['toes.l','toes.r'],'kfb_action_flying_kick_a':['toes.l','toes.r'],'kfb_action_hurricane_kick_a':['toes.l','toes.r'],
 'kfb_action_inside_crescent_kick_a':['toes.l','toes.r']}
REA=['kfb_reaction_taking_punch_a','kfb_reaction_receiving_an_uppercut_a','kfb_reaction_surprise_uppercut_a','kfb_reaction_reaction_a',
 'kfb_reaction_standing_react_small_from_right_a','kfb_reaction_shoved_reaction_with_spin_a','kfb_reaction_death_from_the_front_a',
 'kfb_reaction_standing_death_left_01_a','kfb_reaction_fall_flat_a']
OTHER=['kfb_action_boxing_a','kfb_gesture_taunt_a','kfb_reaction_dizzy_idle_a','kfb_reaction_getting_up_a','kfb_action_center_block_a',
 'kfb_throw_shoulder_aggressor_a','kfb_throw_shoulder_victim_a']
FPS=30
def track(rig,cid):
    G=glb.clip_world(path(C[cid]['library'][rig]),cid)
    off=np.array(G[0][rig].translation)
    return {n:np.array([np.array(fr[n].translation)-off for fr in G]) for n in G[0] if n not in (rig,)}
FWD0=np.array([0,-1,0.])
def hdist(v): return float(np.hypot(v[0],v[1]))
def yawdeg(v): return float(math.degrees(math.atan2(v[1],v[0])))
RT={}
out={'rigs':{},'attacks':{},'reactions':{},'other':{}}
for rig in ('Rig_Medium','Rig_Large'):
    T=track(rig,'kfb_action_boxing_a')
    out['rigs'][rig]={'hipsHeight':round(float(T['hips'][0][2]),3),'headBaseHeight':round(float(T['head'][0][2]),3)}
    for cid,limbs in ATT.items():
        T=track(rig,cid); hips=T['hips']; n=len(hips)
        cand=limbs or ['handslot.l','handslot.r']
        ev=C[cid].get('events',{}).get('strike')
        best=None
        for L in cand:
            rel=T[L]-hips; sp=np.linalg.norm(np.diff(rel,axis=0),axis=1)*FPS
            f=int(np.argmax(sp))+2
            if ev and L.startswith('handslot') and ('hand.'+L[-1])==ev['limb']: f=ev['frame']; best=(1e9,L,f); break
            if best is None or sp.max()>best[0]: best=(float(sp.max()),L,f)
        _,L,fs=best
        lo,hi=max(1,fs-8),min(n,fs+8)
        reach=[hdist(T[L][i-1]-hips[i-1]) for i in range(lo,hi+1)]
        fc=lo+int(np.argmax(reach))
        v=T[L][fc-1]-hips[fc-1]
        out['attacks'].setdefault(cid,{})[rig]={'limb':L,'speedPeakFrame':fs,'contactFrame':fc,
            'limbAtContact':[round(float(x),3) for x in T[L][fc-1]],'hipsAtContact':[round(float(x),3) for x in hips[fc-1]],
            'reachFromHipsM':round(hdist(v),3),'limbHeightM':round(float(T[L][fc-1][2]),3),'attackAxisYawDeg':round(yawdeg(v),1),
            'hipsTravelToContactM':round(hdist(hips[fc-1]-hips[0]),3),'frames':n,'source':'catalog events.strike' if ev else 'measured peak limb speed relative to hips'}
    for cid in REA:
        T=track(rig,cid); RT.setdefault(cid,{})[rig]=T
    for cid in OTHER:
        T=track(rig,cid); out['other'].setdefault(cid,{})[rig]={'frames':len(T['hips']),'endsLying':bool(T['head'][-1][2]<0.5*T['head'][0][2]),
            'startHips':[round(float(x),3) for x in T['hips'][0]],'endHips':[round(float(x),3) for x in T['hips'][-1]]}
    print(rig,'done',flush=True)

# one impact frame for both rigs (same motion, different size): head acceleration of both rigs, each divided by rig scale
SC={'Rig_Medium':1.0,'Rig_Large':out['rigs']['Rig_Large']['hipsHeight']/out['rigs']['Rig_Medium']['hipsHeight']}
for cid,d in RT.items():
    tot=None
    for rig,T in d.items():
        P=T['head']; span=min(len(P),70)
        acc=np.linalg.norm(P[2:span]-2*P[1:span-1]+P[:span-2],axis=1)/SC[rig]
        acc=np.where(P[1:span-1,2]>0.8*P[0,2],acc,0)
        tot=acc if tot is None else tot+acc
    pk=[i for i in range(1,len(tot)-1) if tot[i]>=tot[i-1] and tot[i]>=tot[i+1] and tot[i]>=0.5*tot.max()]
    fi=(pk[0] if pk else int(np.argmax(tot)))+2
    for rig,T in d.items():
        P=T['head']; n=len(P)
        dd=P[min(n-1,fi+3)]-P[max(0,fi-3)]
        out['reactions'].setdefault(cid,{})[rig]={'impactFrame':fi,'hitFromYawDeg':round(yawdeg(-dd),1),'headAtImpact':[round(float(x),3) for x in P[fi-1]],
            'hipsAtImpact':[round(float(x),3) for x in T['hips'][fi-1]],'endsLying':bool(P[-1][2]<0.5*P[0][2]),'travelM':round(hdist(T['hips'][-1]-T['hips'][0]),3),'frames':n}
json.dump(out,open('/tmp/fs1/out/measure.json','w'),indent=1)
