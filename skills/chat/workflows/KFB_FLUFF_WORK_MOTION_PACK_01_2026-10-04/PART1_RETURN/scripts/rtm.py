import sys,numpy as np; sys.path.insert(0,'/tmp/loco/work'); from gl import *
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
src={'Working_B':'Tools','Working_A':'Tools','Digging':'Tools','Work_A':'Tools','Work_B':'Tools','Interact':'General','Use_Item':'General','Cheering':'Simulation'}
L=GLB('C_OrcBrute_RT.glb')
def m(g,clip,H):
    P=Pose(g,clip); t=P.track(['hand.l','hand.r','head','hips'])
    sep=np.linalg.norm(t['hand.l']-t['hand.r'],axis=1)/H
    fwd=-np.minimum(t['hand.l'][:,2],t['hand.r'][:,2])  # +Z forward in glTF? report both
    hz=np.maximum(t['hand.l'][:,2],t['hand.r'][:,2])/H
    return sep.min(),sep.mean(),hz.max(),t['head'][:,1].min()/H
for c,f in src.items():
    g=GLB(A+f'Rig_Medium/Rig_Medium_{f}.glb')
    a=m(g,c,2.17); b=m(L,'RT_'+c,4.19)
    print(f"{c:10s} M sepMin {a[0]:.2f} mean {a[1]:.2f} fwdMax {a[2]:.2f} head {a[3]:.2f} | L sepMin {b[0]:.2f} mean {b[1]:.2f} fwdMax {b[2]:.2f} head {b[3]:.2f}")
