import sys,json,pickle; sys.path.insert(0,'/tmp/f3'); from lib import *
R=pickle.load(open('react.pkl','rb')); F=pickle.load(open('fit.pkl','rb'))
out={}
for rig in ['Rig_Medium','Rig_Large']:
    J,B=new_lib(rig); names=[]
    for cid,seq in R[rig].items(): add_clip(J,B,cid,seq); names.append(cid)
    if rig=='Rig_Large':
        for cid,seq in F.items(): add_clip(J,B,cid,seq); names.append(cid)
    p=f'/tmp/x2/KFB_Motion_exchange01_{rig}.glb'; wtool.write(J,B,p); out[rig]=names; print(rig,len(names))
json.dump(out,open('/tmp/x2/lib_clips.json','w'),indent=1)
