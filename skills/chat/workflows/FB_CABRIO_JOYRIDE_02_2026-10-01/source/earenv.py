import bpy, bmesh, json, math
from mathutils import Vector, Euler
from mathutils.bvhtree import BVHTree
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_hop.blend')
sc=bpy.context.scene; A=bpy.data.objects['FB_Rig']; sc.frame_set(140); bpy.context.view_layer.update()
def bm(objs):
    dg=bpy.context.evaluated_depsgraph_get(); b=bmesh.new()
    for o in objs:
        e=o.evaluated_get(dg); me=e.to_mesh(); t=bmesh.new(); t.from_mesh(me); t.transform(e.matrix_world); m2=bpy.data.meshes.new('t'); t.to_mesh(m2); t.free(); b.from_mesh(m2); bpy.data.meshes.remove(m2); e.to_mesh_clear()
    bmesh.ops.triangulate(b,faces=b.faces); return b
car=[o for o in bpy.data.objects if o.type=='MESH' and not o.hide_render and not o.name.startswith(('CharacterTemplate','FB_','Carl_','Icosphere','Wheel'))]
tc=BVHTree.FromBMesh(bm(car)); names=[o.name for o in car]
SH=[0.65,0.25,0.10]
# disable ear keyframes influence: set pose directly after frame_set (ears are keyed? joyride only) 
grid={}
for back in (0,15,30,45,60,75):
    for out in (-30,-15,0,15,30,45):
        for s,sg in (('l',1),('r',-1)):
            for j in range(3):
                pb=A.pose.bones[f'ear.{s}.{j+1}']; pb.rotation_mode='QUATERNION'; pb.rotation_quaternion=Euler((math.radians(-back*SH[j]),0,math.radians(out*SH[j])*sg)).to_quaternion()
        bpy.context.view_layer.update()
        te=BVHTree.FromBMesh(bm([bpy.data.objects['FB_Ear_L_v5'],bpy.data.objects['FB_Ear_R_v5']]))
        grid[f'{back}|{out}']=len(te.overlap(tc))
print('EE',json.dumps(grid))
for back in (0,75):
    for s,sg in (('l',1),('r',-1)):
        for j in range(3):
            pb=A.pose.bones[f'ear.{s}.{j+1}']; pb.rotation_quaternion=Euler((math.radians(-back*SH[j]),0,0)).to_quaternion()
    bpy.context.view_layer.update()
    dg=bpy.context.evaluated_depsgraph_get(); e=bpy.data.objects['FB_Ear_L_v5'].evaluated_get(dg); me=e.to_mesh()
    import numpy as np; V=np.array([ (e.matrix_world@v.co)[:] for v in me.vertices]); e.to_mesh_clear()
    print('TIP',back, V.min(0).round(2), V.max(0).round(2))
for nm in ('SeatL','DoorL','CarMesh'):
    o=bpy.data.objects[nm]; bb=[o.matrix_world@Vector(c) for c in o.bound_box]; print('BB',nm,[round(min(v[i] for v in bb),2) for i in range(3)],[round(max(v[i] for v in bb),2) for i in range(3)])
print('FBpos', A.matrix_world.translation)
