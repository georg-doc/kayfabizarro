import json, math
M=json.load(open('/tmp/loco/work/measure_all.json'))+json.load(open('/tmp/ml7/w/meas7.json'))
cat=json.load(open('/tmp/ml7/out/KFB_Motion_Library.catalog.json')); cmap={c['id']:c for c in cat['clips']}
HMESH={'Rig_Medium':2.204,'Rig_Large':3.981}
WORLD=1.5/HMESH['Rig_Medium']   # one factor for all rigs
LAB={'Rig_Medium':{'Walking_A':0.611,'Running_A':2.480},'Rig_Large':{'Walking_A':1.772,'Running_A':1.850}}
KKFILE={'Walking_A':'MovementBasic','Walking_B':'MovementBasic','Walking_C':'MovementBasic','Running_A':'MovementBasic','Running_B':'MovementBasic','Jump_Start':'MovementBasic','Jump_Idle':'MovementBasic','Jump_Land':'MovementBasic','Walking_Backwards':'MovementAdvanced','Running_Strafe_Left':'MovementAdvanced','Running_Strafe_Right':'MovementAdvanced','Idle_A':'General'}
def rec(rig,clip):
    r=[x for x in M if x['rig']==rig and x['clip']==clip and not x.get('missing')]
    return r[0] if r else None
TURN=('turn',)
def rung(rig,name,clip,kind,note=None):
    r=rec(rig,clip)
    if r is None: return {'rung':name,'clip':clip,'status':'MISSING_FOR_RIG'}
    c=cmap.get(clip)
    lib=('KayKit_Character_Animations_1.1/Animations/gltf/%s/%s_%s.glb'%(rig,rig,KKFILE[clip])) if clip in KKFILE else 'media/3D_Assets/Animations/KFB_Motion_Library/'+c['library'][rig]
    v=r['naturalSpeedMs']
    loopq=c.get('loopPoseDiffDeg') if c else r.get('loopPoseDiffDegMax')
    isloop=(c['loop'] if c else kind=='loop')
    d={'rung':name,'clip':clip,'family':'kaykit' if clip in KKFILE else 'library',
       'sourcePack':(c.get('sourcePack') if c else 'KayKit Character Animations 1.1'),'library':lib,
       'kind':kind,'loop':bool(isloop),'loopPoseDiffDeg':loopq,'loopPoseDiffSource':'catalog v7' if c else 'measured (max of 10 bone rotations, first vs last frame)',
       'durationSec':r['durationSec'],'frames':r['frames'],'cycleFrames':r['cycleFrames'],'fps':30,
       'rootMotion':r['rootMotion'],'speedSource':r['naturalSpeedSource'],
       'naturalSpeedMs':{rig:round(v,3),'world':round(v*WORLD,3)},
       'stanceFootSpeedMs':round(r['vStanceMs'],3),'rootTravelSpeedMs':round(r['vRootMs'],3),
       'strideLengthPerCycleM':{rig:round(v*r['durationSec'],3),'world':round(v*r['durationSec']*WORLD,3)},
       'leftFootDownPhase':r['leftFootDownPhase'],'rightFootDownPhase':r['rightFootDownPhase'],
       'forwardYawDeg':c.get('forwardYawDeg') if c else None,'travelYawDeg':c.get('travelYawDeg') if c else None,
       'travelYawDegGltfMeasured':r['travelYawDegGltf'] if v>0.05 else None,'hipsYawDeltaDeg':r['hipsYawDeltaDeg'],
       'airborneFrac':r['airborneFrac']}
    if kind in ('loop',) and v>0.05:
        sp=r['slipCm']/100/HMESH[rig]*100
        d['slip']={'cm':r['slipCm'],'pctHeight':round(sp,2),'verdict':'PASS' if sp<=2.0 else 'HOLD'}
    else: d['slip']={'verdict':'n/a','why':'not a travelling loop (turn, stop, start or jump): judged visually'}
    if clip in LAB.get(rig,{}):
        from_lab=LAB[rig][clip]; d['motionLabV1']={'reportedSpeedMs':from_lab,'labMethodReproducedMs':r.get('labMethodSpeedMs'),'diffPct':round((v-from_lab)/from_lab*100,1)}
    if note: d['note']=note
    return d
def bands(rungs):
    out=[]
    for a,b in zip(rungs,rungs[1:]):
        va=a['naturalSpeedMs'][RIG]; vb=b['naturalSpeedMs'][RIG]
        h=math.sqrt(va*vb)
        pa=(a['leftFootDownPhase'] or 0); pb=(b['leftFootDownPhase'] or 0)
        out.append({'from':a['rung'],'to':b['rung'],'handoffSpeedMs':{RIG:round(h,3),'world':round(h*WORLD,3)},
          'fromRateAtHandoff':round(h/va,3),'toRateAtHandoff':round(h/vb,3),
          'stretchFlag':(h/va>1.25 or h/vb<0.75),
          'phaseOffset':round((pb-pa)%1,4),
          'sameFootAlignable':bool(a['leftFootDownPhase'] is not None and b['leftFootDownPhase'] is not None and a['rightFootDownPhase'] is not None and b['rightFootDownPhase'] is not None)})
    # windows per rung
    for i,rg in enumerate(rungs):
        v=rg['naturalSpeedMs'][RIG]
        lo=out[i-1]['handoffSpeedMs'][RIG] if i>0 else 0.0
        hi=out[i]['handoffSpeedMs'][RIG] if i<len(out) else v*1.2
        rg['band']={'speedMinMs':{RIG:round(lo,3),'world':round(lo*WORLD,3)},'speedMaxMs':{RIG:round(hi,3),'world':round(hi*WORLD,3)},
                    'playbackRateWindow':[round(lo/v,3) if lo>0 else None,round(hi/v,3)],
                    'needsMoreThan25pct':bool((lo>0 and lo/v<0.75) or hi/v>1.25)}
    return out
L='kfb_locomotion_'
DEF=[('idle','kfb_idle_idle_f','loop',None),
     ('walkStart',L+'start_walking_a','oneshot','2.9 s; female_start_walking_a (1.9 s) is the shorter option.'),
     ('walk',L+'walking_c','loop',None),
     ('jog',L+'jog_forward_a','loop','Replaces strike_foward_jog_a (a hop, rejected by Georg 03.10). jogging_a (1.35 m/s) is the calmer option.'),
     ('runEasy',L+'slow_run_a','loop','running_a (2.03 m/s) is the option.'),
     ('run',L+'medium_run_a','loop','Replaces running_d (slip HOLD).'),
     ('sprint',L+'sprint_a','loop','fast_run_a (3.85) and running_e (4.03) are options with less forward lean.'),
     ('sprintStart',L+'idle_to_sprint_a','oneshot','From standing straight into the sprint.'),
     ('walkStop',L+'female_stop_walking_a','oneshot','1.3 s, no end turn; stop_walking_a (3.0 s, ~10 deg turn) is the option.'),
     ('runStop',L+'run_to_stop_a','oneshot','0.93 s; ends with the hips turned ~45 deg. Still the only run stop.'),
     ('walkBack',L+'walk_backward_a','loop','walking_backwards_a (0.54 m/s) is the option (body turned ~40 deg).'),
     ('jogBack',L+'slow_jog_backwards_a','loop','HOLD: root travels about twice as fast as the planted feet; judge in the review scene.'),
     ('runBack',L+'running_backward_a','loop','run_backward_a (1.33 m/s) is the slower option.'),
     ('strafeWalkL',L+'left_strafe_walking_a','loop',None),
     ('strafeWalkR',L+'right_strafe_walking_b','loop','right_strafe_walking_a is not a clean loop (15.6 deg); _b is.'),
     ('strafeRunL',L+'left_strafe_a','loop',None),
     ('strafeRunR',L+'strafe_a','loop','Replaces right_strafe_a (loop 21 deg). Body turned ~60 deg to the travel line, like the KayKit strafe.'),
     ('turnInPlaceL90',L+'left_turn_90_a','oneshot',None),
     ('turnInPlaceR90',L+'right_turn_90_a','oneshot','Turns 102.6 deg, not 90.'),
     ('turnInPlaceL180',L+'left_turn_b','oneshot','Turns 168 deg.'),
     ('turnInPlaceR180',L+'right_turn_b','oneshot','Turns 175 deg.'),
     ('runTurnR',L+'running_right_turn_a','oneshot','Curves ~36 deg right while running.'),
     ('sprintTurnR',L+'sprint_turn_a','oneshot','Brakes and turns ~60 deg right.'),
     ('runTurn180',L+'change_direction_a','oneshot','Plants and runs back (~176 deg).'),
     ('jumpFull',L+'jumping_a','oneshot','Library full jump, available on both rigs.'),
     ('jumpStart','Jump_Start','oneshot','KayKit family (the only split jump); Rig_Medium only.'),
     ('jumpAir','Jump_Idle','loop','KayKit family.'),
     ('jumpLand','Jump_Land','oneshot','KayKit family.')]
CAND={'jog':['jogging_a','jog_forward_a','running_f','strike_foward_jog_a'],'runEasy':['slow_run_a','running_a'],'run':['medium_run_a','running_d','run_forward_c'],
      'sprint':['sprint_a','fast_run_a','running_e'],'walkBack':['walk_backward_a','walking_backwards_a'],'jogBack':['slow_jog_backwards_a'],'runBack':['run_backward_a','running_backward_a'],
      'strafeRunR':['strafe_a','right_strafe_a'],'walkStart':['start_walking_a','female_start_walking_a'],'walkStop':['female_stop_walking_a','stop_walking_a']}
KAY=[('idle','Idle_A','loop',None),('walkSlow','Walking_C','loop',None),('walk','Walking_A','loop',None),('walkBrisk','Walking_B','loop',None),
     ('jog',None,'loop','GAP: nothing between 0.98 and 3.30 m/s in this family.'),('run','Running_A','loop',None),('sprint','Running_B','loop','HOLD in Motion Lab v1; +59% over run.'),
     ('walkBack','Walking_Backwards','loop',None),('strafeRunL','Running_Strafe_Left','loop',None),('strafeRunR','Running_Strafe_Right','loop',None),
     ('jumpStart','Jump_Start','oneshot',None),('jumpAir','Jump_Idle','loop',None),('jumpLand','Jump_Land','oneshot',None)]
def build(rig,spec):
    out=[]
    for name,clip,kind,note in spec:
        if clip is None: out.append({'rung':name,'clip':None,'status':'GAP','note':note}); continue
        out.append(rung(rig,name,clip,kind,note))
    return out
res={}
for RIG in ('Rig_Medium','Rig_Large'):
    spec=DEF if RIG=='Rig_Medium' else [x if not x[1] or not x[1].startswith('Jump') else (x[0],None,x[2],'GAP: KayKit split jump does not exist for Rig_Large; use jumpFull.') for x in DEF]
    rows=build(RIG,spec)
    for r in rows:
        if r['rung'] in CAND and r.get('clip'):
            alts=[]
            for cc in CAND[r['rung']]:
                if L+cc==r['clip']: continue
                q=rec(RIG,L+cc)
                if q: alts.append({'clip':L+cc,'naturalSpeedMs':{RIG:round(q['naturalSpeedMs'],3),'world':round(q['naturalSpeedMs']*WORLD,3)},'slipPctHeight':round(q['slipCm']/100/HMESH[RIG]*100,2) if q.get('slipCm') is not None else None})
            r['alternatives']=alts
    pick=lambda names:[r for r in rows if r['rung'] in names and r.get('clip')]
    res[RIG]={'rungs':rows,'forwardBands':bands(pick(('walk','jog','runEasy','run','sprint'))),'backwardBands':bands(pick(('walkBack','jogBack','runBack'))),
              'strafeLeftBands':bands(pick(('strafeWalkL','strafeRunL'))),'strafeRightBands':bands(pick(('strafeWalkR','strafeRunR')))}
RIG='Rig_Medium'
kk=build('Rig_Medium',KAY); kf=[r for r in kk if r['rung'] in ('walkSlow','walk','walkBrisk','run','sprint') and r.get('clip')]
res['Rig_Medium_kaykitAlternative']={'rungs':kk,'forwardBands':bands(kf)}
json.dump(res,open('/tmp/loco2/ladder_core2.json','w'),indent=1)
for k,v in res.items():
    print('==',k)
    for r in v['rungs']:
        if r.get('clip') is None or r.get('status'): print('  ',r['rung'],r.get('status'),r.get('note','')); continue
        rg=[x for x in r['naturalSpeedMs'] if x!='world'][0]
        print(f"   {r['rung']:16s} {r['clip'][-26:]:26s} v{r['naturalSpeedMs'][rg]:5.2f} w{r['naturalSpeedMs']['world']:5.2f} L{r['leftFootDownPhase']} slip{r['slip']} band{r.get('band',{}).get('playbackRateWindow')} flag{r.get('band',{}).get('needsMoreThan25pct')}")
    for b in v['forwardBands']: print('   band',b['from'],'->',b['to'],b['handoffSpeedMs'],b['fromRateAtHandoff'],b['toRateAtHandoff'],'flag',b['stretchFlag'],'phase',b['phaseOffset'])
    for key in ('backwardBands','strafeLeftBands','strafeRightBands'):
        for b in v.get(key,[]): print('   ',key,b['from'],'->',b['to'],b['handoffSpeedMs'],b['fromRateAtHandoff'],b['toRateAtHandoff'],'flag',b['stretchFlag'])
