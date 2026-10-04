import sys,json,math
sys.path.insert(0,'/tmp/bd'); from inject import *
GR=json.load(open('/tmp/bd/grips.json')); M=json.load(open('/tmp/bd/clips_manifest.json'))
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/KayKit_Mystery_Series6/'
WP={'blaster':(K+'UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf','UltraTurboHeroMan_Blaster_KFB','G1'),
    'rifle':(K+'6 - December 2025 - Toy Soldier/gltf/ToySoldier_Rifle.gltf','ToySoldier_Rifle_KFB','G2'),
    'minigun':(K+'1 - July 2024 - Combat Mech/assets/gltf/CombatMech_Minigun.gltf','CombatMech_Minigun_KFB','G3')}
S=M['sockets']
for k,(p,name,gk) in WP.items():
    J={'asset':{'version':'2.0','generator':'KFB BLENDER-DUEL-01 (Coworker)'},'scenes':[{'nodes':[0]}],'scene':0,
       'nodes':[{'name':'socket_grip_r','extras':{'attach':'handslot.r, identity','note':'= KayKit handslot.r frame'}}]}
    B=bytearray()
    ex=[{'name':'socket_muzzle','translation':S[k]['muzzle'],'extras':{'axis':'+Z = barrel'}}]
    if S[k].get('grip_l'): ex.append({'name':'socket_grip_l','translation':S[k]['grip_l'],'extras':{'attach':'handslot.l target'}})
    if S[k].get('bayonet_tip'): ex.append({'name':'socket_bayonet_tip','translation':S[k]['bayonet_tip']})
    mi=append_gltf(J,B,p,0,'weapon_frame',GR[gk],extra_nodes=ex)
    J['nodes'][mi]['extras']={'grip':gk,'quat_xyzw':GR[gk],'note':'original KayKit mesh unchanged inside; barrel +Z, origin = grip'}
    write_glb(J,B,f'/tmp/bd/{name}.glb'); print(name,len(B))
