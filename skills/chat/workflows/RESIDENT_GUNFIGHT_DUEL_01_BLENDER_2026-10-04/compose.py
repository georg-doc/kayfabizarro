import sys,json; sys.path.insert(0,'/tmp/bd'); from inject import *
import sys as _s
pairs=[('hero','UltraTurboHeroMan_Blaster_KFB'),('soldier','ToySoldier_Rifle_KFB'),('mech','CombatMech_Minigun_KFB')]
M,MB=read_glb('/tmp/bd/KFB_Motion_ranged_Rig_Medium.glb')
for ch,w in pairs:
    J,B=read_glb(f'/tmp/bd/{ch}_ranged.glb')
    # replace animations with KFB ranged clips: copy accessors from clips glb
    W={'J':M}
    J['animations']=[]
    # append clip data
    pad(B); off=len(B); B+=MB
    bv0=len(J['bufferViews']); acc0=len(J['accessors'])
    for bv in M['bufferViews']: bv=dict(bv); bv['byteOffset']=bv.get('byteOffset',0)+off; J['bufferViews'].append(bv)
    for a in M['accessors']: a=dict(a); a['bufferView']+=bv0; J['accessors'].append(a)
    n2i={n.get('name'):i for i,n in enumerate(J['nodes'])}
    for an in M['animations']:
        an=json.loads(json.dumps(an))
        for s in an['samplers']: s['input']+=acc0; s['output']+=acc0
        for c in an['channels']: c['target']['node']=n2i[M['nodes'][c['target']['node']]['name']]
        J['animations'].append(an)
    hs=n2i['handslot.r']; append_glb(J,B,f'/tmp/bd/{w}.glb',hs,'WPN_IDENTITY',[0,0,0,1])
    write_glb(J,B,f'/tmp/bd/C_{ch}.glb'); print(ch)
