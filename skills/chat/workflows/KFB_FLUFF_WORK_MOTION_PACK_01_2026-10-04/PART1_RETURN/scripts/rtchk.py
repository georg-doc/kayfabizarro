import sys,numpy as np; sys.path.insert(0,'/tmp/loco/work'); from gl import *
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
m=GLB(A+'Rig_Medium/Rig_Medium_General.glb'); l=GLB(A+'Rig_Large/Rig_Large_General.glb')
for n in m.name2i:
    if n not in l.name2i: print('missing',n); continue
    a=m.nodes[m.name2i[n]]; b=l.nodes[l.name2i[n]]
    ra=np.array(a.get('rotation',[0,0,0,1])); rb=np.array(b.get('rotation',[0,0,0,1]))
    ta=np.array(a.get('translation',[0,0,0])); tb=np.array(b.get('translation',[0,0,0]))
    print(f"{n:22s} dq={1-abs(ra@rb):.4f} tM={np.round(ta,3)} tL={np.round(tb,3)}")
# compare a library clip M vs L
import json
