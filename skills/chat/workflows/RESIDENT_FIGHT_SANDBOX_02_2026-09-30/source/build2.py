import json
M=json.load(open('/tmp/fs1/out/measure2.json')); T=json.load(open('table.json')); K=json.load(open('knock.json')); SH=json.load(open('shapes.json'))
CAT=json.load(open('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/KFB_Motion_Library.catalog.json'))
scale={'Rig_Medium':1.0,'Rig_Large':2.568}
attacks={a:{r:{k:d[r][k] for k in ('limb','contactFrame','hipsAtContact','limbAtContact','frames','source')} for r in d} for a,d in M['attacks'].items()}
data={
 'schema':'kfb.fight-cartoon-contact/0.2','version':'2026-09-30','catalogVersion':CAT['version'],
 'replaces':'fight/KFB_Fight_Combos.json (0.1, exact mesh contact) for the Fight Sandbox; 0.1 stays for reference',
 'idea':'Nobody touches. Fighters keep their heads and bodies apart; the hit is sold by hit-stop, squash, a clay puff at the impact point and knockback away from the attacker.',
 'rigs':{r:{'scaleToMedium':scale[r],**SH[r]} for r in SH},
 'runtimeRules':{
  'coordinates':'Blender metres, Z up, yaw counter-clockwise from +X; three.js position = (x, z, -y), rotation.y = yaw. Positions are relative to the rig node (neutralise the library node offset once per actor).',
  'stance':'Both fighters idle in kfb_action_boxing_a.',
  'placement':'Attacker at the arena anchor, no extra rotation. Defender in stance, rotated by defenderStanceYawDeg, hips at attacker.hipsAtContact + hipsDistanceM along attackAxisYawDeg (from table[attack|attackerRig|defenderRig]).',
  'separation':'Every frame: if head spheres or body capsules (see rigs; head sphere = head bone matrix x offsetInBoneSpace) come closer than 5 cm x the smaller rig scale, push the defender back along the attack axis. This is the only collision check.',
  'impact':'When the attacker clip reaches its contactFrame: freeze both actors 4 frames (hit-stop), squash the defender (scale 1.1 wide / 0.9 high over 6 frames, back to 1), spawn the clay puff at impactPuffAt (attacker clip space) sized about 0.25 m x defender scale, optional small camera nudge.',
  'reaction':'After the hit-stop, the defender plays the reaction starting at the reaction impactFrame (the frames before it are skipped). Rotate the defender about its hips so the reaction knocks it away from the attacker: defenderYaw = attackAxisYawDeg - reactions[r].byRig[rig].knockbackYawInClipDeg. The turn happens inside the puff, which hides the snap.',
  'readability':'visualGapM is how far the strike stops short of the defender. Up to about 0.15 m x defender scale the puff sells it; larger gaps (mostly Brute hitting Raider high) will look like a miss.'},
 'reactions':K,
 'attacks':attacks,
 'table':T,
 'proofSet':[
  {'id':'headbutt','attacker':'kfb_action_headbutt_a','defender':'kfb_reaction_taking_punch_a','then':{'defender':'kfb_reaction_dizzy_idle_a'}},
  {'id':'kick_knockdown','attacker':'kfb_action_kicking_a','defender':'kfb_reaction_standing_death_left_01_a','then':{'attacker':'kfb_gesture_taunt_a'},'note':'the defender ends face up; getting_up starts face down, so skip the get-up or accept the pose jump'},
  {'id':'flying_kick','attacker':'kfb_action_flying_kick_a','defender':'kfb_reaction_receiving_an_uppercut_a'},
  {'id':'prop_hit','attacker':'kfb_action_sword_and_shield_attack_a','defender':'kfb_reaction_reaction_a','prop':'any hand prop in handslot.r (club, pan, sign); the prop, not the hand, meets the puff'},
  {'id':'dust_cloud_brawl','recipe':['both fighters run into each other; at contact spawn a large clay cloud that hides both','inside the cloud loop kfb_action_fist_fight_a_a and kfb_reaction_taking_punch_a; let a hand, foot or prop poke out now and then','move the cloud about 2 m over 2-3 s','eject one fighter with kfb_reaction_fall_flat_a (face down, then kfb_reaction_getting_up_a fits), the other stays in kfb_reaction_dizzy_idle_a as the cloud dissolves'],'note':'needs no staging data; works for every rig pairing'},
  {'id':'shoulder_throw','attacker':'kfb_throw_shoulder_aggressor_a','defender':'kfb_throw_shoulder_victim_a','pairings':['Rig_Large|Rig_Large'],'staging':'both actors at the same origin, no rotation, start together','note':'Raider pairs clash heads and mixed sizes do not grab: use the dust cloud there'}],
 'reactionChoice':'Reactions with hitFrom "front" keep the defender facing the attacker. "behind" reactions (fall_flat, shoved_spin, surprise_uppercut) turn the defender away at impact (hidden in the puff) and read as a sucker punch or a hit after a spin.',
 'unusable':M['unusable']}
json.dump(data,open('KFB_Fight_Cartoon_Contact.json','w'),indent=1)
print(len(json.dumps(data))//1024,'KB', len(T), len(K), len(attacks))
