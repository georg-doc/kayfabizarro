import bpy, bmesh, sys, json
from mathutils.bvhtree import BVHTree
bpy.ops.wm.open_mainfile(filepath=sys.argv[sys.argv.index('--')+1])
A=bpy.data.objects['FB_Rig']; sc=bpy.context.scene
def bm(objs):
    dg=bpy.context.evaluated_depsgraph_get(); b=bmesh.new()
    for o in objs:
        e=o.evaluated_get(dg); me=e.to_mesh(); t=bmesh.new(); t.from_mesh(me); t.transform(e.matrix_world); m2=bpy.data.meshes.new('t'); t.to_mesh(m2); t.free(); b.from_mesh(m2); bpy.data.meshes.remove(m2); e.to_mesh_clear()
    bmesh.ops.triangulate(b,faces=b.faces); return b
body=[o for o in bpy.data.objects if o.type=='MESH' and o.parent==A and not o.name.startswith(('FB_Mouth','Icosphere','FB_Ear'))]
ears=[o for o in bpy.data.objects if o.type=='MESH' and o.name.startswith('FB_Ear')]
car={k:[o for o in bpy.data.objects if o.type=='MESH' and not o.hide_render and o.name.startswith(v)] for k,v in dict(door=('DoorL','WindowL','WIndowL','HandleL','Window.'),body=('CarMesh',),frame=('WindowFront','Glass','Top'),seat=('SeatL',),dash=('Dash','Torus','SteeringWheel')).items()}
car={k:v for k,v in car.items() if v}
rows=[]
for f in [int(x) for x in sys.argv[sys.argv.index('--')+2].split(',')]:
    sc.frame_set(f); bpy.context.view_layer.update(); tb=BVHTree.FromBMesh(bm(body)); te=BVHTree.FromBMesh(bm(ears)); r={}
    for k,objs in car.items():
        t=BVHTree.FromBMesh(bm(objs)); a=len(tb.overlap(t)); e=len(te.overlap(t))
        if a or e: r[k]=(a,e)
    rows.append((f,r))
for f,r in rows: print('C',f,r)
print('PARTS',{k:[o.name for o in v] for k,v in car.items()})
