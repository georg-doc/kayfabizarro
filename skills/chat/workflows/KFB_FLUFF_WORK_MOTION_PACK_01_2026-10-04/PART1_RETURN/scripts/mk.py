import sys,json
sys.path.insert(0,'/tmp/loco/work'); from merge import merge
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
A='/home/claude/kfbhub/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/'
rows=json.load(open('metrics.json')); cat={e['id']:e for e in json.load(open('ml/catalog.json'))['clips']+json.load(open('ml/patch_an01.json'))['clips']}
med=[];lar=[]
for r in rows:
    if r['src']=='KayKit':
        f={'Interact':'General','PickUp':'General','Throw':'General','Use_Item':'General','Idle_A':'General','Cheering':'Simulation','Waving':'Simulation','Push_Ups':'Simulation','Flexing':'Simulation'}.get(r['clip'],'Tools')
        (med if r['rig']=='Rig_Medium' else lar).append((r['clip'],A+f"{r['rig']}/{r['rig']}_{f}.glb",r['clip']))
    else:
        (med if r['rig']=='Rig_Medium' else lar).append((r['clip'],'ml/'+cat[r['clip']]['library'][r['rig']],r['clip']))
for n,p in [('RobotOne','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb'),('RobotTwo','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb'),('SkeletonMinion','KayKit_Skeletons/Skeleton_Minion.glb')]:
    merge(K+p,med,f'C_{n}.glb')
merge(K+'KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb',lar,'C_OrcBrute.glb')
print(len(med),len(lar))
