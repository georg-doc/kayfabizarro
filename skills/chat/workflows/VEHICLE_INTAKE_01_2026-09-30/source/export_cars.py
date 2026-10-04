# Export the 9 Cartoon Vehicles Pack 1 models as KFB-ready GLBs: original node names and pivots (doors, hood, trunk, wheels, roof),
# the stray Icosphere removed, flat part materials (body / tinted glass / interior / tyre / rim / chrome / lamps). Scale 1 (as authored, metres).
import bpy, os, json, math, numpy as np
from mathutils import Vector
OUT='/tmp/veh/kfb_glb/'; os.makedirs(OUT,exist_ok=True)
PAL={'sedan':(0.93,0.55,0.18),'hatchback':(0.95,0.78,0.22),'estate':(0.36,0.30,0.72),'cabrio':(0.85,0.25,0.20),'sportster':(0.90,0.35,0.15),
     'pickup':(0.45,0.62,0.30),'transporter':(0.55,0.40,0.70),'transporterWindow':(0.55,0.40,0.70),'truck':(0.95,0.55,0.45)}
def mat(n,rgb,a=1.0,rough=0.7):
    m=bpy.data.materials.new(n); m.diffuse_color=(*rgb,a)
    b=m.node_tree.nodes.get('Principled BSDF'); b.inputs['Base Color'].default_value=(*rgb,1); b.inputs['Roughness'].default_value=rough; b.inputs['Alpha'].default_value=a
    try: m.surface_render_method='BLENDED' if a<1 else 'DITHERED'
    except Exception: pass
    return m
REP={}
for car in PAL:
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/glb/{car}.glb')
    for o in [o for o in bpy.data.objects if o.name.startswith('Icosphere')]: bpy.data.objects.remove(o)
    M=dict(body=mat('kfb_body',PAL[car],1,0.6),glass=mat('kfb_glass_tinted',(0.30,0.40,0.50),0.4,0.1),interior=mat('kfb_interior',(0.22,0.16,0.14),1,0.9),
           tyre=mat('kfb_tyre',(0.06,0.06,0.06),1,0.9),chrome=mat('kfb_chrome',(0.72,0.74,0.78),1,0.3),lamp=mat('kfb_lamp_front',(1,0.95,0.7),1,0.3),rear=mat('kfb_lamp_rear',(0.85,0.1,0.1),1,0.3))
    cnt={}
    for o in bpy.data.objects:
        if o.type!='MESH': continue
        n=o.name
        if n.startswith(('Window','WIndow','Glass','MirrorGlass')) or n in ('Mirror','Mirror.2') or n.startswith('Mirror.'): k='glass'
        elif n.startswith('Wheel'): k='tyre'
        elif n.startswith(('Bumper','Grille','Handle','Wiper','LightFrontFrame','LightRearFrame','MirrorCase','MirrorHolder','Exhaust','Antenna','MirrorInterior')): k='chrome'
        elif n.startswith(('Interior','Seat','Dash','InstrC','GearLever','Brake','Clutch','Gas','Steering','Torus','EngineBay','TrunkInter','Top')): k='interior'
        elif n.startswith('Light'):
            k='lamp' if o.matrix_world.translation.y>0 or (sum((o.matrix_world@Vector(c)).y for c in o.bound_box)/8)>0 else 'rear'
        else: k='body'
        o.data.materials.clear(); o.data.materials.append(M[k]); cnt[k]=cnt.get(k,0)+1
    bpy.ops.export_scene.gltf(filepath=OUT+f'KFB_CVP1_{car}.glb',export_format='GLB',export_apply=False,export_yup=True)
    REP[car]={'parts':cnt,'bytes':os.path.getsize(OUT+f'KFB_CVP1_{car}.glb'),'openable':sorted(o.name for o in bpy.data.objects if o.name.startswith(('Door','Hood','Trunk')) and o.type=='MESH' and '.' not in o.name)}
    print(car,REP[car],flush=True)
json.dump(REP,open(OUT+'export_report.json','w'),indent=1)
