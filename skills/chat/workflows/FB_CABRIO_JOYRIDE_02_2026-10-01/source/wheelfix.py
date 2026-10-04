import bpy, json, math, sys
from mathutils import Vector, Matrix
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_hop.blend')
sc=bpy.context.scene; A=bpy.data.objects['FB_Rig']
W=json.load(open('/tmp/fbcar/wheel.json')); n=Vector(W['n'])
S=float(sys.argv[sys.argv.index('--')+1])
sw=bpy.data.objects['SteeringWheel']; sw.matrix_world=Matrix.Translation(-n*S)@sw.matrix_world
for s in 'lr':
    g=bpy.data.objects[f'grip.{s}']; g.location=g.location-n*S
    p=bpy.data.objects[f'pole.{s}']; p.location=p.location-n*S
res={}
for f in (80,140,200):
    sc.frame_set(f); bpy.context.view_layer.update()
    res[f]={s: round(((A.matrix_world@A.pose.bones[f'hand.{s}'].tail) - bpy.data.objects[f'grip.{s}'].matrix_world.translation).length,3) for s in 'lr'}
    res[f].update({'wrist_'+s: round(((A.matrix_world@A.pose.bones[f'wrist.{s}'].head) - bpy.data.objects[f'grip.{s}'].matrix_world.translation).length,3) for s in 'lr'})
print('WF',S,json.dumps(res))
bpy.ops.wm.save_as_mainfile(filepath=f'/tmp/fbcar/fb_car_wheel{S:.2f}.blend')
