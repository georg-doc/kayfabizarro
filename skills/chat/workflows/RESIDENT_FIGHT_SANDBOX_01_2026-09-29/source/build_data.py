import json
M=json.load(open('/tmp/fs1/out/measure2.json')); ST=json.load(open('/tmp/fs1/out/stage.json')); TH=json.load(open('/tmp/fs1/out/throw.json'))
CAT=json.load(open('/mnt/user-data/uploads/BLENDER MCP/MOTION_LIB_v5/KFB_Motion_Library.catalog.json'))
PAIRS=['Rig_Medium|Rig_Medium','Rig_Large|Rig_Large','Rig_Medium|Rig_Large','Rig_Large|Rig_Medium']
COMBOS=[
 ('jab','kfb_action_punching_b','kfb_reaction_taking_punch_a',{'defenderOut':'impact+30','then':{'defender':'kfb_action_boxing_a'}},'Quick jab; the defender plays only the first hit of the hit series.'),
 ('straight','kfb_action_punching_a','kfb_reaction_reaction_a',{},'Straight punch, short flinch.'),
 ('hook','kfb_action_hook_punch_b','kfb_reaction_standing_react_small_from_right_a',{},'Hook from the side; the defender turns its right side to the attacker.'),
 ('four_punches','kfb_action_quad_punch_a','kfb_reaction_taking_punch_a',{},'Four fast punches against the full hit series.'),
 ('headbutt','kfb_action_headbutt_a','kfb_reaction_reaction_a',{'then':{'defender':'kfb_reaction_dizzy_idle_a'}},'Headbutt, then the defender stands dizzy.'),
 ('dirty_knee','kfb_action_illegal_knee_a','kfb_reaction_death_from_the_front_a',{'then':{'attacker':'kfb_gesture_taunt_a'}},'Knee to the gut, the defender folds and drops (a comic knock-out).'),
 ('kick_shove','kfb_action_kicking_a','kfb_reaction_shoved_reaction_with_spin_a',{},'Kick that shoves the defender into a spin.'),
 ('flying_kick_ko','kfb_action_flying_kick_a','kfb_reaction_fall_flat_a',{'then':{'defender':'kfb_reaction_getting_up_a','attacker':'kfb_gesture_taunt_a'}},'Flying kick, the defender falls flat on the face and gets up.'),
 ('crescent_kick_ko','kfb_action_inside_crescent_kick_a','kfb_reaction_standing_death_left_01_a',{'then':{'attacker':'kfb_gesture_taunt_a'}},'Crescent kick, the defender topples to the side.'),
 ('uppercut_ko','kfb_action_back_flip_to_uppercut_a','kfb_reaction_surprise_uppercut_a',{'then':{'attacker':'kfb_gesture_taunt_a'}},'Back flip into an uppercut; the defender is launched and lands on the back.'),
 ('hook_uppercut_ko','kfb_action_hook_punch_a','kfb_reaction_surprise_uppercut_a',{'then':{'attacker':'kfb_gesture_taunt_a'}},'The Choreo Lab brawl finish: a hook launches the defender.'),
 ('wild_swipe','kfb_action_mutant_swiping_a','kfb_reaction_reaction_a',{},'Wild two-handed swipes.'),
 ('fist_fight_exchange','kfb_action_fist_fight_a_a','kfb_reaction_taking_punch_a',{},'4.7 s fist-fight combo against the hit series; synced on one measured hit only.'),
]
def short(s): return {k:v for k,v in s.items()}
combos=[]
for cid,a,r,extra,desc in COMBOS:
    per={p:ST[f'{a}|{r}|{p}'] for p in PAIRS}
    combos.append({'id':cid,'attacker':a,'defender':r,'description':desc,**extra,'byPairing':per})
unusable=M['unusable']
data={
 'schema':'kfb.fight-combos/0.1','version':'2026-09-29','status':'measured candidates for a test sandbox; not a finished choreography',
 'catalogVersion':CAT['version'],
 'pairingKey':'attackerRig|defenderRig',
 'rigs':{r:{**M['rigs'][r],'scaleToMedium':round(M['rigs'][r]['hipsHeight']/M['rigs']['Rig_Medium']['hipsHeight'],3)} for r in M['rigs']},
 'howToStage':{
   'frames':'All frame numbers are 1-based clip frames at 30 fps, as in the catalogue.',
   'attacker':'Place the attacker actor at the stage origin with no extra rotation; the clip plays with its own root motion.',
   'timing':'Start the defender clip when the attacker clip reaches defenderStartOnAttackerFrame. If that value is below 1, start the defender clip at frame (2 - value) instead, at the same moment as the attacker.',
   'defenderPlacement':'Rotate the defender actor by defenderYawDeg about the vertical axis (degrees, counter-clockwise seen from above). Then move it so that the defender hips at its impact frame land at attackerHipsAtContact + hipsDistanceM along attackAxisYawDeg (+ defenderSideShiftM to the left of that axis, when present). Helper: defenderRootOffset = target - rotate(defenderYawDeg, reaction.hipsAtImpact.xy).',
   'axes':'Blender coordinates: metres, Z up, yaw 0 = +X, rigs face -Y (yaw -90) at rest; the glTF runtime maps Blender (x, y, z) to three.js (x, z, -y).',
   'statuses':{
     'LANDS':'The striking hand/foot/head touches the defender mesh at the contact frame and the bodies are apart.',
     'BODIES_TOUCH':'The strike reaches, but other body parts (not the heads) already touch. hipsDistanceM keeps the hit; clearHipsDistanceM keeps the bodies apart and then misses by missAtClearM.',
     'HEADS_COLLIDE':'The strike reaches only when the big heads overlap (mostly Raider vs Raider). Same two distances as above. This is the look decision that is still open.',
     'NO_CONTACT':'No placement makes the limb touch the defender (why: over the head / under / beside). The sandbox still plays it at hipsDistanceM, which is the closest measured placement.'},
   'freeChoice':'pairMatrix has the same staging for every attacker x reaction x rig pairing, so a free pick needs no runtime solver.'},
 'method':{
   'source':'Published Motion Library GLBs of both rigs, sampled at every frame; meshes of Orc Raider (Rig_Medium) and Orc Brute (Rig_Large) posed from the same data (bone position error 0.0 cm).',
   'attackContact':'Frame of the widest reach of the striking limb within 8 frames of its speed peak (catalogue events.strike where present). Kicks: frame of the highest toe. Back flip to uppercut: highest hand after the landing.',
   'reactionImpact':'Frame of the strongest head jolt (largest head acceleration) in the first 70 frames.',
   'placement':'The defender faces the attacker (its hip line at the impact frame), or turns its right side for hits from the right. It is pushed along the attack axis until the limb mesh touches its mesh (1 cm tolerance x rig scale). If there is no touch straight on, a sideways shift of up to 0.4 x defender scale is tried.'},
 'attacks':M['attacks'],'reactions':M['reactions'],
 'followUps':{'stance':'kfb_action_boxing_a','block':'kfb_action_center_block_a','winner':'kfb_gesture_taunt_a','dazed':'kfb_reaction_dizzy_idle_a',
   'getUp':{'clip':'kfb_reaction_getting_up_a','startsLying':'face down',
            'fitsAfter':['kfb_reaction_fall_flat_a'],
            'poseJumpAfter':['kfb_reaction_surprise_uppercut_a','kfb_reaction_standing_death_left_01_a','kfb_throw_shoulder_victim_a (all end face up)','kfb_reaction_death_from_the_front_a (ends on the side)']}},
 'combos':combos,
 'pairedClips':[{'id':'shoulder_throw','attacker':'kfb_throw_shoulder_aggressor_a','defender':'kfb_throw_shoulder_victim_a',
   'staging':'both actors at the same origin, no rotation, both clips start together (root-aligned pair)',
   'byPairing':{p.replace('|','|'):{'handTouchFramesSampledEvery4':TH[p]['handTouchFrames'],'headClashFrames':TH[p]['headClashFrames'],'minHandGapM':TH[p]['minHandGapM'],
      'result':{'Rig_Medium|Rig_Medium':'WORKS_WITH_HEAD_CLASH','Rig_Large|Rig_Large':'WORKS','Rig_Medium|Rig_Large':'NO_GRAB','Rig_Large|Rig_Medium':'NO_GRAB'}[p]} for p in PAIRS},
   'then':{'defender':'kfb_reaction_getting_up_a (pose jump: victim ends face up)','attacker':'kfb_gesture_taunt_a'}}],
 'unusable':unusable,
 'pairMatrix':ST}
json.dump(data,open('/tmp/fs1/out/KFB_Fight_Combos.json','w'),indent=1)
import collections
print(len(json.dumps(data))//1024,'KB')
for c in combos: print(c['id'],{p[4]+p.split('|')[1][4]:(v['status'],v.get('zone',v.get('why'))) for p,v in c['byPairing'].items()})
