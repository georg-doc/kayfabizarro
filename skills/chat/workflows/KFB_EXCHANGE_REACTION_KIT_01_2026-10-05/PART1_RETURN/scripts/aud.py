import sys,json,numpy as np; sys.path.insert(0,'/tmp/f3'); from fk import *
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
R={'delighted':['kfb_gesture_cheering_a','kfb_gesture_clapping_a','kfb_idle_happy_a'],
 'surprised':['kfb_reaction_surprised_a','kfb_reaction_reacting_a','kfb_reaction_reaction_a'],
 'unimpressed':['kfb_gesture_dismissing_gesture_a','kfb_gesture_thoughtful_head_shake_a'],
 'outraged':['kfb_gesture_angry_gesture_a','kfb_gesture_yelling_a'],
 'amused':['kfb_idle_laughing_a'],'disappointed':['kfb_idle_sad_a'],'scared':['kfb_reaction_scared_a'],
 'knockout':['kfb_reaction_fall_flat_a','kfb_reaction_getting_up_a','kfb_reaction_dizzy_idle_a'],
 'taunt':['kfb_gesture_taunt_a','kfb_gesture_taunt_b']}
H={'Rig_Medium':2.17,'Rig_Large':4.19}
out={}
for rx,cl in R.items():
  for c in cl:
    for rig in ['Rig_Medium','Rig_Large']:
      e=cat[c]; C=Clip(ML+e['library'][rig],c); N=C.N
      P=[];RT=[]
      for f in range(N):
        W=C.fk(C.locals(f)); r=W['root'][:3,3]; RT.append(r)
        P.append(np.array([W[n][:3,3]-W['hips'][:3,3] for n in JN if n not in('root',)]))
      P=np.array(P); RT=np.array(RT)
      hips=np.array([C.fk(C.locals(f))['hips'][:3,3] for f in range(0,N,max(1,N//60))])
      d=np.linalg.norm(P-P[0],axis=2).mean(1)/H[rig]
      pk=int(d.argmax()); thr=0.3*d.max()
      idx=np.where(d>=thr)[0]; a=max(0,idx[0]-6); b=min(N-1,idx[-1]+6)
      if (b-a)/30>2.5: a=max(0,pk-37); b=min(N-1,a+75)
      out.setdefault(c,{})[rig]=dict(frames=N,loop=e['loop'],peak=pk,trim=[int(a),int(b)],trimSec=round((b-a)/30,2),
         peakDevOverH=round(float(d.max()),3),hipsTravel=round(float(np.linalg.norm((hips[-1]-hips[0])[[0,2]])),3),
         hipsDropOverH=round(float((hips[0,1]-hips[:,1].min())/H[rig]),3),reaction=rx)
      print(rx,c,rig,out[c][rig])
json.dump(out,open('/tmp/x1/aud.json','w'),indent=1)
