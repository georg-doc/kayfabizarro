import sys,json; sys.path.insert(0,'/tmp/loco/work'); from merge import merge
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
ML='/tmp/fluff/ml/'
cl=['kfb_fluff_roll_push_a','kfb_fluff_roll_push_heavy_a','kfb_fluff_steer_left_a','kfb_fluff_steer_right_a','kfb_fluff_knead_press_a','kfb_fluff_collect_debris_a','kfb_fluff_place_small_a','kfb_fluff_pack_flatten_a','kfb_fluff_patch_press_a']
for n,p,rig in [('RobotOne','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb','Rig_Medium'),('RobotTwo','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb','Rig_Medium'),('SkeletonMinion','KayKit_Skeletons/Skeleton_Minion.glb','Rig_Medium'),('OrcBrute','KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb','Rig_Large')]:
    clips=[(c,f'/tmp/f2/KFB_Motion_fluff01_{rig}.glb',c) for c in cl]+[(c,ML+f'libs/{rig}/KFB_Motion_perf_an01.glb',c) for c in ['kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a']]
    merge(K+p,clips,f'/tmp/f2/A_{n}.glb'); print(n)
