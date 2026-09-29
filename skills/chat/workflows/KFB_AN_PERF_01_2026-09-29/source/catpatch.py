import json, hashlib, os
g=json.load(open('out/gift_meta.json')); m=json.load(open('out/march_meta.json')); v=json.load(open('out/verify.json'))
C={c['id']:c for c in json.load(open('/tmp/ml4/out/KFB_Motion_Library.catalog.json'))['clips']}
lib={r:f'libs/{r}/KFB_Motion_perf_an01.glb' for r in ('Rig_Medium','Rig_Large')}
def feet(c): return {'feet':{k:x['planted'] for k,x in c.items()}}
clips=[
 {'id':'kfb_interaction_gift_give_a','label_de':'Geschenk überreichen','group':'interaction','frames':90,'loop':False,'rootMotion':'in-place',
  'events':{'offerReady':{'frame':30},'release':{'frame':50,'note':'hand the prop to the receiver here'}},
  'props':{'hands':'both','prop':'gift box (carried from frame 1, released at 50)'},
  'variantOf':None,'authoredFrom':['kfb_idle_breathing_a (legs, torso)','kfb_locomotion_jogging_with_box_a frame 1 (carry arms)'],
  'contacts':{r:feet(g[r]['contacts']['give']) for r in g},
  'comment':'Authored in Blender (AN-PERF-01): carry pose, arms push the box forward and slightly up (frames 10-38), hold, release at 50, empty arms settle back to idle by 72. Feet stay planted.',
  'residentIdeas':'Any resident giving a present or handing over an item; pairs with kfb_interaction_gift_receive_a.',
  'tags':['gift','handover','two-hands','one-shot']},
 {'id':'kfb_interaction_gift_receive_a','label_de':'Geschenk annehmen','group':'interaction','frames':90,'loop':False,'rootMotion':'in-place',
  'events':{'reachReady':{'frame':38},'grab':{'frame':40,'note':'take the prop from the giver here'},'secured':{'frame':68}},
  'props':{'hands':'both','prop':'gift box (held from frame 40)'},
  'variantOf':None,'authoredFrom':['kfb_idle_breathing_a (legs, torso)','kfb_locomotion_jogging_with_box_a frame 1 (carry arms)'],
  'contacts':{r:feet(g[r]['contacts']['receive']) for r in g},
  'comment':'Authored in Blender (AN-PERF-01): idle, both arms reach forward (15-38), grab at 40, pull the box to the chest into the carry pose (45-68), happy head wobble while holding. Ends in the carry pose.',
  'residentIdeas':'Receiver side of a gift exchange; chain into a carry walk or an unboxing reaction.',
  'tags':['gift','handover','two-hands','one-shot']},
 {'id':'kfb_locomotion_nutcracker_march_a','label_de':'Nussknacker-Marsch','group':'locomotion','frames':32,'loop':True,'rootMotion':'travel',
  'travelMetersPerCycle':C['kfb_locomotion_walk_with_briefcase_a']['travelMetersPerCycle'],
  'props':{'hands':'right','prop':'rifle, upright in the right hand (attach at handslot.r, barrel up)'},
  'variantOf':{'id':'kfb_locomotion_walk_with_briefcase_a','kind':'authored-style','note':'same stance frames and travel; high knees, straight swinging left arm, still right arm, upright stiff torso'},
  'contacts':{r:feet(m[r]['contacts']) for r in m},
  'comment':'Authored in Blender (AN-PERF-01) from the briefcase walk: knees lifted only while the foot is in the air, left arm straight with bigger swing, right (rifle) arm held still, torso upright, chest and head steadier. Same travel per cycle as the donor.',
  'residentIdeas':'Georg: the Nutcracker marching with the rifle in the right hand. Also toy soldiers, guards, parade residents.',
  'tags':['walk-style','march','carry','one-hand']}]
for c in clips:
    c.update({'rigs':['Rig_Medium','Rig_Large'],'fps':30.0,'durationSec':round(c['frames']/30,3),'library':lib,'intake':'AN-PERF-01','sourceFbx':None,'rootBone':'root',
              'loopPoseDiffDeg':0.0 if c['loop'] else None,'roundTripMaxCm':{r:v[c['id']][r]['roundTripMaxCm'] for r in ('Rig_Medium','Rig_Large')}})
libs={}
for r in ('Rig_Medium','Rig_Large'):
    p=f'out/libs/{r}/KFB_Motion_perf_an01.glb'; b=open(p,'rb').read()
    libs[lib[r]]={'rig':r,'group':'performance batch AN-PERF-01 (interaction, locomotion)','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'clipCount':3}
patch={'schema':'kfb.motion-catalog.v1/patch','batch':'AN-PERF-01','date':'2026-09-29','base':'KFB_Motion_Library.catalog.json (263 clips, intake 04)',
       'apply':'append clips[] to catalogue.clips and libraries{} to catalogue.libraries; clipCount 263 -> 266. Nothing existing changes.',
       'libraries':libs,'clips':clips}
json.dump(patch,open('out/KFB_Motion_Library.catalog.patch_an01.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(libs,indent=1))
