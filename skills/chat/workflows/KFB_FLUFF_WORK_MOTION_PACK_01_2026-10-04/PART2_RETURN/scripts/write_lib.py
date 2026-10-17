import os
from lib import *; import pickle
res=pickle.load(open('/tmp/f2/res.pkl','rb'))
for rr,S in res.items():
    J,B=new_lib(rr)
    for k,v in S.items(): add_clip(J,B,k,v['seq'])
    wtool.write(J,B,f'/tmp/f2/KFB_Motion_fluff01_{rr}.glb')
    print(rr,len(J['animations']),os.path.getsize(f'/tmp/f2/KFB_Motion_fluff01_{rr}.glb') if False else '')
