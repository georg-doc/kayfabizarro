from lib import *; import pickle,json,hashlib
res=pickle.load(open('/tmp/f3/res3.pkl','rb'))
P=json.load(open('/tmp/f3/play.json')); K=json.load(open('/tmp/f3/kaykit_kick.json'))
CT=json.load(open('/tmp/f2/contact.json'))
LBL={'kfb_fluff_roll_push_a':'Fluff-Ball rollen','kfb_fluff_roll_push_heavy_a':'Schweren Fluff-Ball rollen','kfb_fluff_steer_left_a':'Fluff-Ball links lenken','kfb_fluff_steer_right_a':'Fluff-Ball rechts lenken',
 'kfb_fluff_roll_push_big_a':'Großen Fluff-Ball rollen (Sisyphos/Team)','kfb_fluff_roll_push_heavy_big_a':'Großen Fluff-Ball schwer rollen','kfb_fluff_steer_left_big_a':'Großen Fluff-Ball links lenken','kfb_fluff_steer_right_big_a':'Großen Fluff-Ball rechts lenken',
 'kfb_fluff_knead_press_a':'Fluff kneten','kfb_fluff_collect_debris_a':'Fluff-Brocken aufsammeln','kfb_fluff_place_small_a':'Kleinen Fluff ablegen','kfb_fluff_pack_flatten_a':'Fluff festklopfen','kfb_fluff_patch_press_a':'Fluff andrücken / flicken',
 'kfb_fluff_ball_surf_a':'Auf dem Fluff-Ball surfen','kfb_fluff_ball_balance_a':'Auf dem Fluff-Ball balancieren','kfb_fluff_ball_dance_a':'Auf dem Fluff-Ball tanzen','kfb_fluff_foot_roll_a':'Fluff-Ball mit den Füßen treiben'}
H_={'Rig_Medium':2.17,'Rig_Large':4.19}
def contacts(rig,seq):
    out={}
    for sd in 'lr':
        y=np.array([rig.fk(L)[f'foot.{sd}'][1,3] for L in seq]); thr=y.min()+0.015*H[rig.rig]; iv=[];s=None
        for i,v in enumerate(y<thr):
            if v and s is None: s=i
            if not v and s is not None: iv.append([s+1,i]); s=None
        if s is not None: iv.append([s+1,len(y)])
        out[f'foot.{sd}']=iv
    return {'feet':out}
ids=sorted(set(res['Rig_Medium'])|set(res['Rig_Large']))
clips=[]
for cid in ids:
    rigs=[r for r in ['Rig_Medium','Rig_Large'] if cid in res[r]]; v0=res[rigs[0]][cid]
    e={'id':cid,'label_de':LBL[cid],'group':'locomotion' if any(s in cid for s in ['push','steer','roll','surf']) else ('dance' if 'dance' in cid else 'interaction'),
       'rigs':rigs,'frames':v0['frames'],'durationSec':round(v0['frames']/30,3),'fps':30.0,'loop':v0['loop'],'loopPoseDiffDeg':round(v0['seamDeg'],2) if v0['loop'] else None,
       'rootMotion':'in-place','rootBone':'root','travelMetersPerCycle':{r:0.0 for r in rigs},'library':{r:f'libs/{r}/KFB_Motion_fluff01.glb' for r in rigs},
       'intake':'FLUFF-01','sourceFbx':None,'contacts':{},'fluff':{}}
    for rr in rigs:
        v=res[rr][cid]; rig=Rig(rr); e['contacts'][rr]=contacts(rig,v['seq'])
        f={'gap':v['gap'],'donor':v['donor'],'note':v['note'],'trunkLeanDeg':round(v['lean'],1),'seamExcessDeg':round(v['seamExcess'],1) if v['loop'] else None}
        if 'ball' in v:
            f['workpiece']={'radius':round(v['R'],3),'radiusOverBodyHeight':round(v['R']/H_[rr],3),'centre':[round(x,3) for x in v['ball']]}
        else:
            k=f'{rr}:{cid}'; f['workpiece']={'note':CT[k]['kind'],'radius':CT[k]['R']}
        for a,b in [('speed','runtimeRootSpeedMps'),('yawRateDegPerSec','runtimeYawRateDegPerSec'),('ikErr','ikHandErrorM'),('palmDev','palmToCentreDevDeg'),('contactElevDeg','contactElevationDeg'),('rootLiftRange','rootLiftRangeM'),('footGapMax','footGapMaxM'),('events','events')]:
            if v.get(a) not in (None,0,0.0): f[b]=(round(v[a],4) if isinstance(v[a],float) else v[a])
        e['fluff'][rr]=f
    clips.append(e)
# play events on existing clips (no new animation): contact frame, body part, ball size, direction
play={}
for cid in ['kfb_action_header_soccerball_a','kfb_action_headbutt_a','kfb_action_headbutt_b','kfb_action_inside_crescent_kick_a','kfb_throw_frisbee_a']:
    play[cid]={}
    for rr in ['Rig_Medium','Rig_Large']:
        p=P[rr][cid]; play[cid][rr]=dict(library=p['library'],contactFrame=p['contactFrame'],part=p['part'],partSpeedMps=p['partSpeed'],hitDir=p['hitDir'])
for rr in ['Rig_Medium','Rig_Large']:
    k=K[rr]; play.setdefault('KayKit:'+k['clip'],{})[rr]=dict(source='KayKit_Character_Animations_1.1/Animations/gltf/'+k['source'],contactFrame=k['contactFrame'],part=k['part'],partSpeedMps=k['partSpeed'],hitDir=k['hitDir'])
libs={}
for rr in ['Rig_Medium','Rig_Large']:
    b=open(f'/tmp/f3/KFB_Motion_fluff01_{rr}.glb','rb').read()
    libs[f'libs/{rr}/KFB_Motion_fluff01.glb']={'rig':rr,'group':'Fluff work + play pack 01 (FLUFF-01)','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'clipCount':len(res[rr])}
patch={'schema':'kfb.motion-catalog.v1/patch','batch':'FLUFF-01','date':'2026-10-04','base':'KFB_Motion_Library.catalog.json (+ patch_an01, patch_duel01)',
 'apply':'append clips[] to catalogue.clips and libraries{} to catalogue.libraries. playEvents{} annotates existing clips (no change to them). Nothing existing changes.',
 'sizeRule':{'countRule':'runtime: 6 Small = 1 Medium, 3 Medium = 1 Large (Fluff Mass Ladder)','visual':'cartoon: work-ball diameter about 2/3 of the carrier body height (Georg, Part 3)',
             'radiusM':{'Small':0.20,'Medium (Rig_Medium work ball)':round(2.17/3,3),'Large (Rig_Large work ball, or 2-3 Rig_Medium)':round(4.19/3,3)},
             'growingBall':'Rig_Medium push/steer exist at r 0.723 (_a) and r 1.397 (_big_a); blend by current ball radius. Hands stay on the surface at both ends.',
             'shape':'irregular kneaded lump (low-frequency lumps, 2-5 thumb dents, slight squash); contacts measured on the sphere radius, lumps +-13 %.'},
 'bodyHeight':H_,'libraries':libs,'clips':clips,'playEvents':play}
json.dump(patch,open('/tmp/f3/KFB_Motion_Library.catalog.patch_fluff01.json','w'),indent=1)
print(len(clips),[c['id'] for c in clips]); print(libs)
