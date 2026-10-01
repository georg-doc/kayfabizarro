import bpy, bmesh, json, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_hop.blend')
sc=bpy.context.scene; A=bpy.data.objects['FB_Rig']
W=json.load(open('/tmp/fbcar/wheel.json')); n=Vector(W['n'])
for pb in A.pose.bones:
    for k in pb.constraints: k.mute=True     # arms off: test body/legs/head only
sw=bpy.data.objects['SteeringWheel']; M0=sw.matrix_world.copy()
def bm(objs):
    dg=bpy.context.evaluated_depsgraph_get(); b=bmesh.new()
    for o in objs:
        e=o.evaluated_get(dg); me=e.to_mesh(); t=bmesh.new(); t.from_mesh(me); t.transform(e.matrix_world); m2=bpy.data.meshes.new('t'); t.to_mesh(m2); t.free(); b.from_mesh(m2); bpy.data.meshes.remove(m2); e.to_mesh_clear()
    bmesh.ops.triangulate(b,faces=b.faces); return b
parts={'body':['CharacterTemplate_Body','CharacterTemplate_Head','CharacterTemplate_LegLeft','CharacterTemplate_LegRight'],'ears':['FB_Ear_L_v5','FB_Ear_R_v5']}
wheel=[o for o in bpy.data.objects if o.name in ('Torus','SteeringWheel.2')]
out={}
for s in (0.0,0.10,0.18):
    sw.matrix_world=__import__('mathutils').Matrix.Translation(-n*s)@M0; bpy.context.view_layer.update()
    r={}
    for f in (80,140,200):
        sc.frame_set(f); bpy.context.view_layer.update()
        tw=BVHTree.FromBMesh(bm(wheel))
        for k,names in parts.items():
            ob=[bpy.data.objects[x] for x in names]; r[f'{f}:{k}']=len(BVHTree.FromBMesh(bm(ob)).overlap(tw))
    out[s]=r
print('WS',json.dumps(out))
