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
import sys
LEAN=float(sys.argv[sys.argv.index('--')+1])
from mathutils import Quaternion
for bn in ('spine','chest'):
    pb=A.pose.bones[bn]; pb.rotation_quaternion=Quaternion((1,0,0),LEAN/2)@pb.rotation_quaternion
bpy.context.view_layer.update()
grid={}
for back in (0,30,60,75,90):
    for out in (-55,-30,0,30,55):
        for s,sg in (('l',1),('r',-1)):
            for j in range(3):
                pb=A.pose.bones[f'ear.{s}.{j+1}']; pb.rotation_mode='QUATERNION'; pb.rotation_quaternion=Euler((math.radians(-back*SH[j]),0,math.radians(out*SH[j])*sg)).to_quaternion()
        bpy.context.view_layer.update()
        te=BVHTree.FromBMesh(bm([bpy.data.objects['FB_Ear_L_v5'],bpy.data.objects['FB_Ear_R_v5']]))
        grid[f'{back}|{out}']=len(te.overlap(tc))
print('EE',json.dumps(grid)); print('PARTS',sorted(set(names))[:0])
