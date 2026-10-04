import json,copy
F=json.load(open('/tmp/fs2/KFB_Fight_Cartoon_Contact.json')); M=json.load(open('m3.json')); FA=json.load(open('facing.json')); PT=json.load(open('prop_table.json'))
D=copy.deepcopy(F)
D['schema']='kfb.fight-cartoon-contact/0.3'; D['version']='2026-09-30'
D['replaces']='fight/KFB_Fight_Cartoon_Contact.json (0.2). 0.2 stays in the repo; 0.3 adds facing, follow-up re-facing, the dust-cloud impact beat, the lying lift, limb capsules, the hammer prop and a rig-scaled ring.'
D['changesFrom02']=[
 'facing: every clip used by the sandbox carries forwardYawDeg (absolute, clip space). The catalogue facingYawDeg is NOT a forward yaw (see facing.convention).',
 'follow-up re-facing: after an attack or a standing reaction, the next clip turns to face the opponent over 12 frames.',
 'dust cloud: run-in facing fixed, impact beat before the cloud, the cloud grows from the impact point, the dizzy fighter watches the ejected one.',
 'lying lift per rig and frame for reactions that go down, and for getting_up.',
 'limb capsules per rig (arms and legs).',
 'hammer prop: capsules, a visible window per rig without self-intersection, and prop-based staging for kfb_action_sword_and_shield_attack_a (replaces the hand-based table entries).',
 'ring size scales with the larger fighter.']
D['facing']={
 'convention':'forwardYawDeg is the direction the body faces in clip space, as a Blender yaw (degrees counter-clockwise from +X, rest facing = -90). The catalogue field facingYawDeg is the shoulder-line angle = forwardYaw + 90 (0 = rest facing). Sandbox 02 used facingYawDeg as a forward yaw; that turns every fighter by 90 degrees (sideways) and the run-in by about 140 degrees (backwards).',
 'rule':'To make an actor playing clip X face world direction D (same yaw convention, three.js rotation.y = yaw): rotation.y = D - clips[X].forwardYawDeg.',
 'method':'mean of the hip-line and shoulder-line normals. Loops: averaged over the cycle. Locomotion: the axis the feet swing along (travel direction). Rig_Medium; Rig_Large plays the same motion.',
 'clips':{k:{'forwardYawDeg':v['use'],'atFirstFrameDeg':v['atFirst'],'atLastFrameDeg':v['atLast']} for k,v in FA.items()}}
RR=D['runtimeRules']
RR['facing']=D['facing']['rule']
RR['idle']="Idle / not available for this pairing: A at (-d/2,0,0) faces +X, B at (+d/2,0,0) faces -X (d = 2.2 m x larger scale): rotation.y(A) = 0 - forward(IDLE), rotation.y(B) = 180 - forward(IDLE)."
RR['followUp']="When a clip hands over to a standing follow-up (then.attacker, then.defender, IDLE, dizzy, taunt, and after getting_up), turn the actor about its hips so the follow-up faces the opponent's hips: target = yawOf(opponentHips - ownHips) - forward(nextClip). Blend from the current rotation to the target over 12 frames (smoothstep). Keep tracking the target while the opponent moves. Lying clips are never re-faced."
RR['groundLift']="For clips in lift: add lift[clip][rig].liftM[frame-1] to the actor's height every frame (frame = the clip frame being shown, clamped to the last frame). The values already keep an allowed sink of 3 cm x rig scale. The chained get-up uses its own curve."
RR['ring']="ring.acrossM = 9 x max(scaleA, scaleB); postH and rope heights x the same factor (Raider pair 9 m, any pairing with a Brute 23.1 m). Rope rebound comes later."
D['brawlRecipe']={
 'clips':{'run':'kfb_locomotion_run_a','fist':'kfb_action_fist_fight_a_a','take':'kfb_reaction_taking_punch_a','eject':'kfb_reaction_fall_flat_a','getUp':'kfb_reaction_getting_up_a','dizzy':'kfb_reaction_dizzy_idle_a'},
 'steps':[
  "1 run-in (0.9 s): A from -X facing +X, B from +X facing -X, using the facing rule with forward(run) = -88.7 (feet travel axis). So rotation.y(A) = 88.7, rotation.y(B) = 268.7.",
  "2 impact beat when the hips are D apart: both freeze for 4 frames in their run pose, the defender-side squash plays on both, a clay puff (0.25 m x smaller scale) pops at the midpoint of the hips at 0.6 x the smaller head height.",
  "3 cloud: grows out of the puff point over 0.25 s to full size, then drifts about 2 m over 2.6 s. Inside, A plays fist and B plays take, both facing the cloud centre line: rotation.y(A) = phi - forward(fist), rotation.y(B) = phi + 180 - forward(take). A limb or the prop pokes out now and then (unchanged).",
  "4 ejection: B flies out with eject, turned so the clip knocks it away from A (knockbackYawInClipDeg, unchanged), then getUp with its lift curve. A plays dizzy and turns to watch B with the followUp rule. The cloud dissolves over 0.7 s.",
  "5 after getUp: both return to IDLE facing each other (followUp rule)."]}
D['lift']={}
for cid,r in M['lift'].items():
    rows={rig:{'maxLiftM':v['maxLiftM'],'minZAtEndM':v['minZEnd'],'verticesBelowGroundAtEndPct':v['belowEndPct'],'liftM':[round(x,2) for x in v['liftM']]} for rig,v in r.items() if v['maxLiftM']>0.02}
    if rows: D['lift'][cid]=rows
lm=M['limbs']
for rig in D['rigs']:
    L=lm[rig]
    D['rigs'][rig]['limbCapsules']={'arm':[{'from':'upperarm','to':'lowerarm','radiusM':L['upperarm->lowerarm']['radiusM']},{'from':'lowerarm','to':'wrist','radiusM':L['lowerarm->wrist']['radiusM']}],
      'leg':[{'from':'upperleg','to':'lowerleg','radiusM':L['upperleg->lowerleg']['radiusM']},{'from':'lowerleg','to':'foot','radiusM':L['lowerleg->foot']['radiusM']}],
      'note':'per side (.l / .r), bone joint to joint; radius = 80th percentile of the skinned vertices around the segment in kfb_action_boxing_a frame 1. For debug display and optional arm/prop checks; the separation rule still uses head and body only.'}
PM=M['prop']['kfb_action_sword_and_shield_attack_a']
D['prop']={'id':'clown_hammer','slot':'handslot.r','asset':'media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_hammer.gltf',
 'capsulesInPropSpace':{'note':'glTF prop space (Y up along the handle, grip at the origin), multiply by the rig scale (the sandbox scales the prop by a.s / boneWorldScale)',
   'handle':{'from':[0,-0.5,0],'to':[0,0.55,0],'radiusM':0.08},'head':{'from':[0,0.9,-0.4],'to':[0,0.9,0.4],'radiusM':0.34}},
 'selfIntersection':{'kfb_action_sword_and_shield_attack_a':{rig:{'framesInOwnBody':v['framesPropInOwnBody'],'maxPenetrationM':v['maxPenetrationM']} for rig,v in PM.items()}},
 'visibleWindow':{'kfb_action_sword_and_shield_attack_a':{'Rig_Medium':[19,30],'Rig_Large':[18,32]}},
 'rule':"Cartoon 'hammer space': the hammer pops in (scale 0 to 1 over 2 frames) at the first frame of visibleWindow and pops out at the last. Outside the window it would pass through the own body (wind-up and recovery). Raider: the hammer appears exactly on the hit.",
 'checkedOther':'kfb_action_stabbing_a, kfb_action_hook_punch_a and kfb_action_punching_a intersect more; none is better for a long handle.'}
for k,v in PT.items():
    old=D['table'].get(k,{})
    D['table'][k]={'hipsDistanceM':v['hipsDistanceM'],'visualGapM':v['visualGapM'],'hitZone':old.get('hitZone','body'),'impactPuffAt':v['impactPuffAt'],
      'attackAxisYawDeg':v['attackAxisYawDeg'],'defenderStanceYawDeg':v['defenderStanceYawDeg'],'limitedBy':'hammer head (swing window contact-8 .. contact kept clear of the defender)','hitBy':'prop head','handBased02':old}
D['reactionNotes']={'fromBehind':['kfb_reaction_fall_flat_a','kfb_reaction_shoved_reaction_with_spin_a','kfb_reaction_surprise_uppercut_a','kfb_reaction_death_from_the_front_a'],
 'note':'These turn the defender away at impact. In the free pick, list them under "from behind". The followUp rule turns the defender back to the attacker afterwards; before 0.3 this was the main cause of back-to-back endings.'}
D['proofSet']=[p for p in D['proofSet']]
for p in D['proofSet']:
    if p['id']=='dust_cloud_brawl': p['recipe']='see brawlRecipe'; p['note']='0.3: facing fixed, impact beat, cloud grows from the puff point'
    if p['id']=='prop_hit': p['prop']='clown_hammer with prop.visibleWindow; staging from the 0.3 table (hammer head)'
D['catalogNotes']={'kfb_reaction_getting_up_a':'starts face down (the catalogue did not say so)','kfb_action_hurricane_kick_a':'broken: no body motion, source FBX too','kfb_action_swinging_a':'a rope swing, not a weapon swing'}
json.dump(D,open('/tmp/fs3/KFB_Fight_Cartoon_Contact_03.json','w'),indent=1)
import os; print(os.path.getsize('/tmp/fs3/KFB_Fight_Cartoon_Contact_03.json'), list(D['lift']))
