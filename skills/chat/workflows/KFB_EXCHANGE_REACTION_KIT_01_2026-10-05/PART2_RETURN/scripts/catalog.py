import json,hashlib
meta=json.load(open('react_meta.json')); ver=json.load(open('verify.json')); fit=json.load(open('fit.json')); L=json.load(open('lib_clips.json'))
lidM=json.load(open('lid/lid_M.json')); lidL=json.load(open('lid/lid_L.json'))
seq={v:json.load(open(f'seqst/{v}_seq.json')) for v in ('M','Lfit','Lgiant')}
LAB={'kfb_react_delighted_a':'Jubeln (BINGO!)','kfb_react_contradict_a':'Kopfschuetteln (BONGO.)','kfb_react_boggle_a':'Verwirrt nachfragen (BOGGLE?)','kfb_react_dismiss_a':'Abwinken (Bloedsinn...)','kfb_react_fluffy_a':'Freudenhuepfer (FLUFFY!)','kfb_react_kayfabe_a':'Zeigen (Kayfabe!)','kfb_react_pop_a':'Starke Geste (Pop!)','kfb_react_outraged_a':'Empoert','kfb_react_amused_a':'Lachen','kfb_react_disappointed_a':'Enttaeuscht','kfb_react_scared_a':'Erschrocken','kfb_react_taunt_a':'Necken','kfb_react_dizzy_a':'Benommen (Bizarro Stufe 2)','kfb_react_faint_a':'Ohnmacht (Bizarro Stufe 3)'}
libs={}
for rig in ('Rig_Medium','Rig_Large'):
    b=open(f'KFB_Motion_exchange01_{rig}.glb','rb').read()
    libs[f'libs/{rig}/KFB_Motion_exchange01.glb']=dict(rig=rig,group='Exchange + reaction kit 01 (EXCH-01)',bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),clipCount=len(L[rig]))
clips=[]
for cid,m in meta.items():
    fr={r:m[r]['frames'] for r in ('Rig_Medium','Rig_Large')}
    clips.append(dict(id=cid,label_de=LAB[cid],group='reaction',rigs=['Rig_Medium','Rig_Large'],frames=fr,fps=30.0,
      loop=m['mode']=='loop',rootMotion='in-place',rootBone='root',
      library={r:f'libs/{r}/KFB_Motion_exchange01.glb' for r in fr},intake='EXCH-01',
      call=m['call'],source=m['source'],sourceTrim={r:m[r]['trim'] for r in fr},
      entryExit='starts and ends on KayKit Idle_A (12-frame ease)' if m['mode']=='io' else ('loop' if m['mode']=='loop' else 'starts on Idle_A, ends lying (hold last frame / KayKit Death_A_Pose)'),
      events={'reactStart':0,'peak':None},verify={r:ver[cid][r] for r in fr}))
fitclips=[('kfb_interaction_gift_give_fit_a','kfb_interaction_gift_give_a','Geschenk geben (Orc, Arme eingezogen)',{'offerReady':30,'release':50},fit['give']),
          ('kfb_interaction_gift_receive_fit_a','kfb_interaction_gift_receive_a','Geschenk annehmen (Orc, Arme eingezogen)',{'reachReady':38,'grab':40,'secured':68},fit['receive']),
          ('kfb_interaction_opening_a_lid_fit_a','kfb_interaction_opening_a_lid_a','Deckel abheben (Orc, Arme eingezogen)',{'lidGrab':lidL['grabFrame'],'lidOff':lidL['releaseFrame']},fit['lid'])]
for cid,src,lab,ev,f in fitclips:
    clips.append(dict(id=cid,label_de=lab,group='interaction',rigs=['Rig_Large'],fps=30.0,loop=False,rootMotion='in-place',rootBone='root',
      library={'Rig_Large':'libs/Rig_Large/KFB_Motion_exchange01.glb'},intake='EXCH-01',source=src,
      note='arm-in IK FIT for normal gift sizes; use the original clip for a giant gift (hands 1.80 m apart)',events=ev,
      fit={k:v for k,v in f.items() if k!='sepTrace'}))
patch=dict(schema='kfb.motion-catalog.v1/patch',batch='EXCH-01',date='2026-10-05',base='KFB_Motion_Library.catalog.json (+ patch_an01, patch_duel01, patch_fluff01)',
  apply='append clips[] and libraries{}; exchangeEvents{} and callSet{} annotate existing clips. Nothing existing changes.',
  bodyHeight={'Rig_Medium':2.17,'Rig_Large':4.19},libraries=libs,clips=clips,
  exchangeEvents={
    'kfb_interaction_gift_give_a':{'offerReady':30,'release':50},
    'kfb_interaction_gift_receive_a':{'reachReady':38,'grab':40,'secured':68,'startAfterGiverFrames':10},
    'kfb_interaction_opening_a_lid_a':{'Rig_Medium':{'lidGrab':lidM['grabFrame'],'lidOff':lidM['releaseFrame']},'Rig_Large':'use kfb_interaction_opening_a_lid_fit_a'},
    'kfb_fluff_knead_press_a':{'note':'Fluff -> gift: knead loop, then POP to a present (merge timing: squash 26-34, POP 36, settle 56)'},
    'heldPop':{'clip':None,'note':'unbox in the hands, no clip; frames count from the end of gift_receive (its frame 90); the receiver holds the last pose','squash':[0,8],'lidOff':10,'reveal':10,'propLand':26,'reactStart':26},
    'handoverRootDistance':{'Rig_Medium':1.149,'Rig_Large':2.774},
    'giftSize':{'rule':'per gift (small / medium / giant), runtime choice','Rig_Medium':{'boxWidth':0.454},'Rig_Large':{'normal':{'boxWidth':0.876,'clips':'*_fit_a'},'giant':{'boxWidth':1.88,'clips':'original'}}},
    'measured':{v:seq[v]['palmToBoxSide'] for v in seq}},
  callSet={'BINGO!':{'meaning':'yes / agree','clip':'kfb_react_delighted_a'},'BONGO.':{'meaning':'no / contradict','clip':'kfb_react_contradict_a','strong':'kfb_react_outraged_a'},
    'BOGGLE?':{'meaning':'unclear / confused, asks back','clip':'kfb_react_boggle_a','gap':'puzzled shrug / head tilt (Georg checks Quaternius/Mixamo)'},
    'Bloedsinn...':{'meaning':'reject + leave','clip':'kfb_react_dismiss_a','then':'runtime turn + kfb_locomotion_sad_walk_a'},
    'FLUFFY!':{'meaning':'delighted surprise','clip':'kfb_react_fluffy_a'},'Kayfabe!':{'meaning':'interjection','clip':'kfb_react_kayfabe_a'},'Pop!':{'meaning':'interjection','clip':'kfb_react_pop_a','sound':'clay POP'},
    'Bizarro...?!':{'meaning':'cognitive dissonance / disbelief','escalation':['kfb_react_contradict_a','kfb_react_dizzy_a','kfb_react_faint_a'],'runtime':'counter per NPC per session; 3rd trigger = Ontological Schick-Schock, write to Lean Memory','getUp':'kfb_reaction_getting_up_a (runtime crossfade from the lying pose)'},
    'calloutObject':'kneaded clay 3D letters, billboard to camera, collider (see CALLOUT_LOOK.png)'})
json.dump(patch,open('KFB_Motion_Library.catalog.patch_exch01.json','w'),indent=1); print(len(clips),'clips')
