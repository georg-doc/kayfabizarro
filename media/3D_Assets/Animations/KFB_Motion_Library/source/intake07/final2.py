import json, copy
core=json.load(open('/tmp/loco2/ladder_core2.json'))
L1=json.load(open('/tmp/loco/out/LOCOMOTION_LADDER_01.json'))
gaps=[
 {'rung':'jogStrafeL/R','need':'side jog between strafe walk 1.18 and strafe run 2.6-3.1 m/s on Rig_Medium (handoff now needs 1.5-1.6x / 0.62-0.67x)','mixamoSearch':['Jog Strafe Left','Jog Strafe Right'],'verifiedName':False},
 {'rung':'jogBack','need':'slow_jog_backwards_a is HOLD (root 1.17 vs feet 0.53 m/s), and walkBack -> jogBack still needs 1.45x; a clean backward jog around 0.8-1.0 m/s would close it','mixamoSearch':['Jog Backward','Slow Jog Backwards'],'verifiedName':False},
 {'rung':'strafeRunL','need':'left_strafe_a slips 2.0 % (HOLD); a clean left partner of strafe_a','mixamoSearch':['Strafe (with Mixamo Mirror on)'],'verifiedName':False},
 {'rung':'runTurnL / sprintTurnL','need':'only right-hand running turns exist','mixamoSearch':['Running Left Turn','Sprint Turn (with Mixamo Mirror on)'],'verifiedName':False},
 {'rung':'runStop (option)','need':'run_to_stop_a ends with the hips turned ~45 deg','mixamoSearch':['Run To Stop','Running Stop'],'verifiedName':False},
 {'rung':'jumpStart/Air/Land on Rig_Large','need':'split jump for Rig_Large; jumpFull (jumping_a) works on both rigs','mixamoSearch':['jumping up, falling idle, hard landing (Action Adventure Pack, already in _inbox)'],'verifiedName':True}]
data={'schema':'kfb.locomotion-ladder/0.2-candidate','id':'LOCOMOTION_LADDER_02','date':'2026-10-03',
 'supersedes':'LOCOMOTION_LADDER_01 kfb_ladder_v1 (Georg 03.10: strike_foward_jog_a is a hop, not a jog)',
 'schemaNote':L1['schemaNote']+' rungs[].alternatives[] = other measured clips for the same rung (Georg picks the look).',
 'units':L1['units'],'method':L1['method'],'motionLabV1Comparison':L1['motionLabV1Comparison'],
 'intake':'Motion Library intake 07 (2026-10-03): 25 new locomotion clips in libs/*/KFB_Motion_locomotion_i07.glb; 16 of the 41 staged FBX were (near) duplicates and were not baked.',
 'ladders':{'kfb_ladder_v2':{'family':'KFB Motion Library (Mixamo locomotion retargeted to KayKit rigs, intakes 01-07) + KayKit split jump on Rig_Medium','Rig_Medium':core['Rig_Medium'],'Rig_Large':core['Rig_Large']}},
 'unchanged':'kfb_ladder_kaykit_v1 (KayKit only, no jog) stays as in LOCOMOTION_LADDER_01.json',
 'gaps':gaps,'notInThisJob':['no controller/state machine','no motion edits (no mirroring)','no downloads']}
json.dump(data,open('/tmp/loco2/out/LOCOMOTION_LADDER_02.json','w'),indent=1,ensure_ascii=False)
cat=json.load(open('/tmp/ml7/out/KFB_Motion_Library.catalog.json'))
def members(rungs):
    return {r['rung']:(r['clip'] if r['family']=='library' else 'kaykit:'+r['library'].split('/')[-1].replace('.glb','')+'/'+r['clip']) for r in rungs if r.get('clip')}
sp={}
for rig in ('Rig_Medium','Rig_Large'):
    for r in core[rig]['rungs']:
        if r.get('clip'): sp.setdefault(r['rung'],{})[rig]=r['naturalSpeedMs'][rig]
alts={r['rung']:[a['clip'] for a in r['alternatives']] for r in core['Rig_Medium']['rungs'] if r.get('alternatives')}
cat['locomotionSets']['kfb_ladder_v2']={'members':members(core['Rig_Medium']['rungs']),'alternatives':alts,'speedMs':sp,'gaps':[g['rung'] for g in gaps],
 'rigNotes':{'Rig_Large':'jumpStart/jumpAir/jumpLand not available, use jumpFull; strafe_a slips 3.0 % on Rig_Large (HOLD).'},
 'ladderFile':'LOCOMOTION_LADDER_02.json','added':'2026-10-03 LOCOMOTION-LADDER-02 (candidate, Georg review open)',
 'use':'One clip per gait rung. Forward walk -> jog -> runEasy -> run -> sprint: every handoff within +-25 % playback. Hand over at the band edges in LOCOMOTION_LADDER_02.json with the phase offset given there.'}
cat['locomotionSets']['kfb_ladder_v1']['supersededBy']='kfb_ladder_v2 (2026-10-03: strike_foward_jog_a rejected as jog)'
json.dump(cat,open('/tmp/loco2/out/KFB_Motion_Library.catalog.json','w'),indent=1,ensure_ascii=False)
v6=json.load(open('/tmp/loco/src/catalog.json')); ids6={c['id']:c for c in v6['clips']}
for c in cat['clips']:
    if c['id'] in ids6: assert c==ids6[c['id']], c['id']
for k in v6['libraries']: assert v6['libraries'][k]==cat['libraries'][k]
for k in v6['locomotionSets']: assert v6['locomotionSets'][k]==cat['locomotionSets'][k]
for k in v6['intakes']: assert v6['intakes'][k]==cat['intakes'][k]
for k in v6:
    if k not in ('clips','libraries','locomotionSets','intakes','clipCount','version'): assert v6[k]==cat[k],k
print('ok',cat['clipCount'],cat['version'],sorted(cat['locomotionSets']),len(cat['libraries']))
