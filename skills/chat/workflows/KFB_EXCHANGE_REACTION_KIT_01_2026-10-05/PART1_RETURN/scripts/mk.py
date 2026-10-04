import sys,json; sys.path.insert(0,'/tmp/loco/work'); from merge import merge
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
ML='/tmp/fluff/ml/'; cat={e['id']:e for e in json.load(open(ML+'catalog.json'))['clips']}
A=json.load(open('/tmp/x1/aud.json'))
extra=['kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a','kfb_interaction_opening_a','kfb_interaction_opening_a_lid_a','kfb_fluff_knead_press_a']
for n,p,rig in [('RobotOne','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb','Rig_Medium'),('RobotTwo','KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb','Rig_Medium'),('OrcBrute','KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb','Rig_Large')]:
    clips=[(c,ML+cat[c]['library'][rig],c) for c in list(A)+extra[:4]]+[('kfb_fluff_knead_press_a',f'/tmp/f3/KFB_Motion_fluff01_{rig}.glb','kfb_fluff_knead_press_a')]
    merge(K+p,clips,f'/tmp/x1/A_{n}.glb'); print(n,len(clips))
