import sys,json,pickle,numpy as np; sys.path.insert(0,'/tmp/f3'); from lib import *
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
KK='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
# id, call, source, trim(M), trim(L) (None = full), blend in/out
R=[('kfb_react_delighted_a','BINGO!','kfb_gesture_cheering_a',(0,75),(0,75),'io'),
   ('kfb_react_contradict_a','BONGO.','kfb_gesture_thoughtful_head_shake_a',(6,64),(6,56),'io'),
   ('kfb_react_boggle_a','BOGGLE?','kfb_reaction_surprised_a',(14,89),(14,89),'io'),
   ('kfb_react_dismiss_a','Bloedsinn...','kfb_gesture_dismissing_gesture_a',(4,44),(5,44),'io'),
   ('kfb_react_fluffy_a','FLUFFY!','kfb_locomotion_joyful_jump_a',(4,46),(4,46),'io'),
   ('kfb_react_kayfabe_a','Kayfabe!','kfb_gesture_pointing_a',(0,60),(0,60),'io'),
   ('kfb_react_pop_a','Pop!','kfb_gesture_strong_gesture_a',(0,48),(0,48),'io'),
   ('kfb_react_outraged_a',None,'kfb_gesture_angry_gesture_a',(6,56),(6,56),'io'),
   ('kfb_react_amused_a',None,'kfb_idle_laughing_a',(78,153),(78,153),'io'),
   ('kfb_react_disappointed_a',None,'kfb_idle_sad_a',(3,68),(2,69),'io'),
   ('kfb_react_scared_a',None,'kfb_reaction_scared_a',(192,267),(60,135),'io'),
   ('kfb_react_taunt_a',None,'kfb_gesture_taunt_b',(0,48),(0,47),'io'),
   ('kfb_react_dizzy_a','Bizarro...?! (2)','kfb_reaction_dizzy_idle_a',None,None,'loop'),
   ('kfb_react_faint_a','Bizarro...?! (3)','Death_A',None,None,'i')]
K=12
def blendL(A,B,w):
    out={}
    for n in A:
        Ta,Ra,Sa=A[n]; Tb,Rb,Sb=B[n]; out[n]=(Ta*(1-w)+Tb*w, slerp(Ra,Rb,w), Sa*(1-w)+Sb*w)
    return out
def ease(t): return t*t*(3-2*t)
res={}; meta={}
for rig in ['Rig_Medium','Rig_Large']:
    idle=Clip(KK+f'{rig}/{rig}_General.glb','Idle_A').locals(0)
    res[rig]={}
    for cid,call,src,tm,tl,mode in R:
        if src=='Death_A': C=Clip(KK+f'{rig}/{rig}_General.glb','Death_A')
        else: C=Clip(ML+cat[src]['library'][rig],src)
        t=tm if rig=='Rig_Medium' else tl
        fr=list(range(t[0],t[1]+1)) if t else list(range(C.N))
        seq=[C.locals(f) for f in fr]
        if mode in('io','i'):
            for k in range(K): seq[k]=blendL(idle,seq[k],ease(k/K))
        if mode=='io':
            n=len(seq)
            for k in range(K): seq[n-1-k]=blendL(idle,seq[n-1-k],ease(k/K))
        res[rig][cid]=seq
        meta.setdefault(cid,{'call':call,'source':src,'mode':mode})[rig]=dict(trim=list(t) if t else [0,C.N-1],frames=len(seq))
        print(rig,cid,len(seq))
pickle.dump(res,open('react.pkl','wb')); json.dump(meta,open('react_meta.json','w'),indent=1)
