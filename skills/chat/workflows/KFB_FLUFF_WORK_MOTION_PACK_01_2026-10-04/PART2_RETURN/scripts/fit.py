import bpy, sys, json, numpy as np
from mathutils import Vector
glb,rig,out=sys.argv[1],sys.argv[2],sys.argv[3]; balls=json.load(open('/tmp/f2/balls.json'))
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]; meshes=[o for o in sc.objects if o.type=='MESH']
acts={a.name:a for a in bpy.data.actions}; res={}
def g2b(p): return Vector((p[0],-p[2],p[1]))
for clip in ['kfb_fluff_knead_press_a','kfb_fluff_collect_debris_a']:
    b=balls[rig][clip]; a=[v for k,v in acts.items() if k.startswith(clip)][0]; arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0,f1=int(a.frame_range[0]),int(a.frame_range[1]); body=[];hands=[]
    for f in range(f0,f1+1,2):
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get(); B=[];Hh=[]
        for o in meshes:
            e=o.evaluated_get(dg); M=np.array(e.matrix_world); V=np.array([v.co for v in e.data.vertices]); V=(V@M[:3,:3].T)+M[:3,3]
            (Hh if 'arm' in o.name.lower() else B).append(V)
        body.append(np.concatenate(B)[::3]); hands.append(np.concatenate(Hh)[::2])
    C0=np.array(g2b(b['C'])); R=b['R']; best=None
    for s in np.arange(0,1.2*R,0.02*R):
        C=C0+np.array([0,-s,0])   # forward = -Y in Blender
        pen=max(float((R-np.linalg.norm(V-C,axis=1)).max()) for V in body)
        hd=[float((np.linalg.norm(V-C,axis=1)-R).min()) for V in hands]   # nearest hand/arm surface to ball surface
        if pen<=0.01*R*4.19/ (R/0.22) and best is None: best=dict(shift=float(s),shiftOverH=float(s/(R/0.22)),bodyPen=pen,armGapMin=min(hd),armGapMax=max(hd),armGapMedian=float(np.median(hd)))
    res[clip]=best; print(clip,best,flush=True)
json.dump(res,open(out,'w'))
