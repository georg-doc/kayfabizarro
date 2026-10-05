import sys,json; sys.path.insert(0,'/tmp/loco/work'); from merge import merge
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
L=json.load(open('lib_clips.json'))
extra=['kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a','kfb_interaction_opening_a_lid_a','kfb_reaction_getting_up_a','kfb_fluff_place_small_a']
for n,p,rig in [('RobotOne','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb','Rig_Medium'),('RobotTwo','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb','Rig_Medium'),('OrcBrute','KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb','Rig_Large')]:
    clips=[(c,f'/tmp/x2/KFB_Motion_exchange01_{rig}.glb',c) for c in L[rig]]
    clips+=[(c,ML+cat[c]['library'][rig],c) for c in extra[:4]]
    merge(K+p,clips,f'/tmp/x2/A_{n}.glb'); print(n,len(clips))
