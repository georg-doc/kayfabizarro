import bpy, sys, json, numpy as np
from mathutils import Vector
glb,balls,rig,out=sys.argv[1],json.load(open(sys.argv[2])),sys.argv[3],sys.argv[4]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]; meshes=[o for o in sc.objects if o.type=='MESH' and not o.name.startswith('Icosphere')]
acts={a.name:a for a in bpy.data.actions}; res={}
def g2b(p): return Vector((p[0],-p[2],p[1]))
for clip,b in balls[rig].items():
    a=[v for k,v in acts.items() if k.startswith(clip)][0]; arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    C=np.array(g2b(b['C'])); R=b['R']; worst=0; wf=None; wpart=None; hand_min=1e9
    f0,f1=int(a.frame_range[0]),int(a.frame_range[1])
    for f in range(f0,f1+1,2):
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get()
        for o in meshes:
            e=o.evaluated_get(dg); M=np.array(e.matrix_world); V=np.array([v.co for v in e.data.vertices]); V=(V@M[:3,:3].T)+M[:3,3]
            d=R-np.linalg.norm(V-C,axis=1); p=d.max()
            nm=o.name.lower(); ishand=('arm' in nm)
            if ishand: continue
            if p>worst: worst=p; wf=f; wpart=o.name
    res[clip]=dict(bodyPenetration=round(float(worst),3),frame=wf,part=wpart,R=R)
    print(clip,res[clip],flush=True)
json.dump(res,open(out,'w'))
