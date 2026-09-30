import sys,json; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy,numpy as np
from common import *
CORR=open_ws(); SC={'Rig_Medium':1.0,'Rig_Large':2.568}; out={}
for cid in ['kfb_reaction_surprise_uppercut_a','kfb_reaction_death_from_the_front_a','kfb_reaction_standing_death_left_01_a','kfb_reaction_fall_flat_a','kfb_reaction_getting_up_a']:
    out[cid]={}
    for rig in RIGS:
        L=[]
        for W in frames(rig,cid):
            pose(rig,W,CORR); v=verts(rig); b=min(a[:,2].min() for k,a in v.items() if k!='Head'); L.append(round(max(0,-b-0.03*SC[rig]),2))
        out[cid][rig]=L
json.dump(out,open('/tmp/fs3/liftbody.json','w'))
p='/tmp/fs3/KFB_Fight_Cartoon_Contact_03.json'; D=json.load(open(p))
for cid,r in out.items():
    for rig,L in r.items(): D['lift'][cid][rig]['liftBodyM']=L; D['lift'][cid][rig]['maxLiftBodyM']=max(L)
D['runtimeRules']['groundLift']=("For clips in lift, add a lift to the actor's height every frame (index = clip frame - 1, clamped). Two curves, Georg picks per rig in the panel: "
 "liftM = the lowest vertex touches the ground (nothing sinks; with the big Raider head the body rests on the head and floats a little); "
 "liftBodyM = the body and limbs touch the ground and the head may sink (Raider up to 0.5 m when face up). Both keep an allowed sink of 3 cm x rig scale. "
 "Optional headTuck: an extra head-bone rotation about its local X (deg) ramped in over the fall; with it the Raider head clears the ground at liftBodyM. Standing reactions are not lifted.")
D['headTuck']={'note':'optional, Rig_Medium only (the Brute head stays above its body when lying); the head lifts up, which reads as "looking up from the floor" rather than knocked out','kfb_reaction_standing_death_left_01_a':60,'kfb_reaction_surprise_uppercut_a':60,'kfb_reaction_fall_flat_a':-60,'kfb_reaction_getting_up_a':-60,'kfb_reaction_death_from_the_front_a':{'axis':'Z','deg':60}}
json.dump(D,open(p,'w'),indent=1); print('ok', {c:{g:(D['lift'][c][g]['maxLiftM'],D['lift'][c][g]['maxLiftBodyM']) for g in D['lift'][c]} for c in D['lift']})
