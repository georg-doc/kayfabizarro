from lib import *; import pickle,os
res=pickle.load(open('res3.pkl','rb'))
for rr,S in res.items():
    J,B=new_lib(rr)
    for k,v in S.items(): add_clip(J,B,k,v['seq'])
    wtool.write(J,B,f'/tmp/f3/KFB_Motion_fluff01_{rr}.glb'); print(rr,len(J['animations']),sorted(S))
