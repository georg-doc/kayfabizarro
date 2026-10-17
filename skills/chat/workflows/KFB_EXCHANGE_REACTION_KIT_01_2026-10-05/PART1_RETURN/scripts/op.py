import sys,json,numpy as np; sys.path.insert(0,'/tmp/f3'); from fk import *
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
for c in ['kfb_interaction_opening_a','kfb_interaction_opening_a_lid_a','kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a']:
  for rig in ['Rig_Medium']:
    C=Clip(ML+cat[c]['library'][rig],c)
    rows=[]
    for f in range(0,C.N,max(1,C.N//14)):
        W=C.fk(C.locals(f)); l=W['handslot.l'][:3,3]; r=W['handslot.r'][:3,3]; h=W['hips'][:3,3]; hd=W['head'][:3,3]
        rows.append((f,np.round((l+r)/2,2).tolist(),round(float(np.linalg.norm(l-r)),2),round(float(h[1]),2),round(float(hd[1]),2)))
    print(c,C.N); [print('  ',x) for x in rows]
