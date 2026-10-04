from lib import *; import pickle,json,hashlib
res=pickle.load(open('/tmp/f2/res.pkl','rb')); B=json.load(open('/tmp/f2/balls.json')); CT=json.load(open('/tmp/f2/contact.json'))
LBL={'kfb_fluff_roll_push_a':'Fluff-Ball rollen','kfb_fluff_roll_push_heavy_a':'Schweren Fluff-Ball rollen','kfb_fluff_steer_left_a':'Fluff-Ball nach links lenken','kfb_fluff_steer_right_a':'Fluff-Ball nach rechts lenken',
 'kfb_fluff_knead_press_a':'Fluff kneten','kfb_fluff_collect_debris_a':'Fluff-Brocken aufsammeln','kfb_fluff_place_small_a':'Kleinen Fluff ablegen','kfb_fluff_pack_flatten_a':'Fluff festklopfen','kfb_fluff_patch_press_a':'Fluff andrücken / flicken'}
def contacts(rig,seq):
    out={}
    for sd in 'lr':
        y=np.array([rig.fk(L)[f'foot.{sd}'][1,3] for L in seq]); thr=y.min()+0.015*H[rig.rig]
        iv=[];s=None
        for i,v in enumerate(y<thr):
            if v and s is None: s=i
            if not v and s is not None: iv.append([s+1,i]); s=None
        if s is not None: iv.append([s+1,len(y)])
        out[f'foot.{sd}']=iv
    return {'feet':out}
clips=[]; ids=list(res['Rig_Medium'].keys())
for cid in ids:
    vm=res['Rig_Medium'][cid]; e={'id':cid,'label_de':LBL[cid],'group':'interaction' if 'push' not in cid and 'steer' not in cid else 'locomotion',
      'rigs':['Rig_Medium','Rig_Large'],'frames':vm['frames'],'durationSec':round(vm['frames']/30,3),'fps':30.0,'loop':vm['loop'],
      'loopPoseDiffDeg':round(vm['seamDeg'],2) if vm['loop'] else None,'rootMotion':'in-place','rootBone':'root',
      'travelMetersPerCycle':{'Rig_Medium':0.0,'Rig_Large':0.0},
      'library':{'Rig_Medium':'libs/Rig_Medium/KFB_Motion_fluff01.glb','Rig_Large':'libs/Rig_Large/KFB_Motion_fluff01.glb'},
      'intake':'FLUFF-01','sourceFbx':None,'contacts':{},'fluff':{}}
    for rr in ['Rig_Medium','Rig_Large']:
        v=res[rr][cid]; rig=Rig(rr)
        e['contacts'][rr]=contacts(rig,v['seq'])
        f={'gap':v['gap'],'donor':v['donor'],'note':v['note'],'workpiece':{'radius':round(B[rr][cid]['R'],3),'radiusOverBodyHeight':round(B[rr][cid]['R']/H[rr],3),'centre':[round(x,3) for x in B[rr][cid]['C']],'kind':CT[f'{rr}:{cid}']['kind']},
           'handToWorkpieceSurface':{'l':CT[f'{rr}:{cid}']['surfDist_l'],'r':CT[f'{rr}:{cid}']['surfDist_r']},'trunkLeanDeg':round(v['lean'],1),'seamExcessDeg':round(v['seamExcess'],1) if v['loop'] else None}
        if v.get('speed'): f['runtimeRootSpeedMps']=round(v['speed'],3)
        if v.get('yawRateDegPerSec'): f['runtimeYawRateDegPerSec']=round(v['yawRateDegPerSec'],1)
        if v.get('ikErr') is not None: f['ikHandErrorM']=round(v['ikErr'],4); f['palmToCentreDevDeg']=round(v['palmDev'],1)
        e['fluff'][rr]=f
    e['comment']={'G1':'Push: wheelbarrow legs/rhythm kept; both palms on the ball back 20 deg above its equator, aimed at the ball centre. Ball stays in clip space; runtime rolls it and moves the root.',
       'G2':'Heavy push: walk_b legs, travel stripped, 0.75x speed, stronger lean.','G3':'Steering loop: runtime owns the turn (yaw rate given); clip carries the asymmetric step and body lean.',
       'G4':'Two-hand bench/ground work. Large uses the larger work chunk (Option A, decision c948e155): no arm correction.','G5':'One-hand work; Medium native, Large plain retarget.'}[vm['gap']]
    e['tags']=['fluff','work',vm['gap']]
    clips.append(e)
libs={}
for rr in ['Rig_Medium','Rig_Large']:
    p=f'/tmp/f2/KFB_Motion_fluff01_{rr}.glb'; b=open(p,'rb').read()
    libs[f'libs/{rr}/KFB_Motion_fluff01.glb']={'rig':rr,'group':'Fluff work motion pack 01 (FLUFF-01)','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'clipCount':len(ids)}
patch={'schema':'kfb.motion-catalog.v1/patch','batch':'FLUFF-01','date':'2026-10-04','base':'KFB_Motion_Library.catalog.json (+ patch_an01, patch_duel01)',
 'apply':'append clips[] to catalogue.clips and libraries{} to catalogue.libraries; clipCount +9. Nothing existing changes.',
 'workpieceRule':'Option A (Production Control c948e155): Rig_Large two-hand work and push use a work chunk of radius 0.22 x body height. Presentation size only; inventory/resource/pickup value and global Fluff ball size stay runtime-owned.',
 'bodyHeight':{'Rig_Medium':2.17,'Rig_Large':4.19},'libraries':libs,'clips':clips}
json.dump(patch,open('/tmp/f2/KFB_Motion_Library.catalog.patch_fluff01.json','w'),indent=1)
print(len(clips),libs)
for c in clips: print(c['id'],c['frames'],c['loop'],c['contacts']['Rig_Medium']['feet'])
