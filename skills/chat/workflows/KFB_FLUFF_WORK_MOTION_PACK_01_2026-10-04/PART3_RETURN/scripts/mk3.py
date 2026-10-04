import sys,json; sys.path.insert(0,'/tmp/loco/work'); from merge import merge
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
ML='/tmp/fluff/ml/'
cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
import pickle; res=pickle.load(open('/tmp/f3/res3.pkl','rb'))
play=['kfb_action_header_soccerball_a','kfb_action_kicking_a','kfb_action_inside_crescent_kick_a','kfb_action_headbutt_a','kfb_action_headbutt_b','kfb_throw_frisbee_a','kfb_throw_goalkeeper_overhand_a']
for n,p,rig in [('RobotOne','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb','Rig_Medium'),('RobotTwo','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb','Rig_Medium'),('SkeletonMinion','KayKit_Skeletons/Skeleton_Minion.glb','Rig_Medium'),('OrcBrute','KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb','Rig_Large')]:
    clips=[(c,f'/tmp/f3/KFB_Motion_fluff01_{rig}.glb',c) for c in res[rig]]+[(c,ML+cat[c]['library'][rig],c) for c in play]
    merge(K+p,clips,f'/tmp/f3/A_{n}.glb'); print(n,len(clips))
