# Medium->Large retarget: same joint names, identical rest rotations (verified, dq<=0.0004).
# Copy local rotations; drop non-hips translations (Large rest); hips translation = LargeRest + (Med - MedRest)*k, k=1.041/0.406
import sys,json,numpy as np; sys.path.insert(0,'/tmp/loco/work'); sys.path.insert(0,'/tmp/fl')
from gl import *; import wtool
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
src={'Working_B':'Tools','Working_A':'Tools','Digging':'Tools','Work_A':'Tools','Work_B':'Tools','Interact':'General','Use_Item':'General','Cheering':'Simulation'}
J,B=wtool.read(K+'KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb'); J['animations']=[]
n2i={n.get('name'):i for i,n in enumerate(J['nodes'])}
k=1.041/0.406; out={}
for clip,f in src.items():
    g=GLB(A+f'Rig_Medium/Rig_Medium_{f}.glb'); P=Pose(g,clip); tr={}
    for nm,i in g.name2i.items():
        if nm not in n2i or nm in('root',) : continue
        ch=P.ch
        if (i,'rotation') in ch:
            tr[(n2i[nm],'rotation')]=np.array([qnorm(sample(ch[(i,'rotation')],P.t0+min(fr/30,P.T),'rotation')) for fr in range(P.frames)])
        if nm=='hips' and (i,'translation') in ch:
            r0=np.array(g.nodes[i].get('translation',[0,0,0])); rl=np.array(J['nodes'][n2i['hips']].get('translation',[0,0,0]))
            tr[(n2i[nm],'translation')]=np.array([rl+(sample(ch[(i,'translation')],P.t0+min(fr/30,P.T),'translation')-r0)*k for fr in range(P.frames)])
    wtool.add_anim(J,B,'RT_'+clip,tr); out[clip]=P.frames
wtool.write(J,B,'C_OrcBrute_RT.glb'); print(out)
