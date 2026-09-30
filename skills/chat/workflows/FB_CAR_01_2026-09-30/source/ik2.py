import bpy, bmesh, json, math, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
d=float(sys.argv[sys.argv.index('--')+1]); ang=float(sys.argv[sys.argv.index('--')+2])
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_step1.blend')
W=json.load(open('/tmp/fbcar/wheel.json')); C=Vector(W['C']); R=W['R']; up=Vector(W['up']); side=Vector(W['side']); n=Vector(W['n'])
A=bpy.data.objects['FB_Rig']; sc=bpy.context.scene
A.matrix_world=Matrix.Translation((0,d,0))@A.matrix_world
def grip(a): return C+R*(up*math.cos(math.radians(a))+side*math.sin(math.radians(a)))-n*0.02
for s,a,px in (('l',-ang,-1),('r',ang,1)):
    t=bpy.data.objects.new(f'grip.{s}',None); sc.collection.objects.link(t); t.location=grip(a)
    p=bpy.data.objects.new(f'pole.{s}',None); sc.collection.objects.link(p); p.location=grip(a)+Vector((px*0.6,-0.5,-0.4))
    c=A.pose.bones[f'lowerarm.{s}'].constraints.new('IK'); c.target=t; c.pole_target=p; c.chain_count=2; c.pole_angle=0 if s=='r' else math.pi
    # hand points along the rim tangent-ish: track towards wheel centre
    h=A.pose.bones[f'hand.{s}'].constraints.new('DAMPED_TRACK'); h.target=t; h.track_axis='TRACK_Y'; h.influence=0.0
bpy.context.view_layer.update()
def bm(objs):
    dg=bpy.context.evaluated_depsgraph_get(); b=bmesh.new()
    for o in objs:
        e=o.evaluated_get(dg); me=e.to_mesh(); t=bmesh.new(); t.from_mesh(me); t.transform(e.matrix_world); m2=bpy.data.meshes.new('t'); t.to_mesh(m2); t.free(); b.from_mesh(m2); bpy.data.meshes.remove(m2); e.to_mesh_clear()
    bmesh.ops.triangulate(b,faces=b.faces); return b
res={}
for f in (1,40,76,110,151):
    sc.frame_set(f); bpy.context.view_layer.update()
    body=[o for o in bpy.data.objects if o.type=='MESH' and o.parent==A and not o.name.startswith(('FB_Mouth','Icosphere'))]
    tb=BVHTree.FromBMesh(bm(body)); hits={}
    for part in ('CarMesh','Dash','Torus','SteeringWheel','Door','Window','WIndow','Glass','Interior','SeatL'):
        objs=[o for o in bpy.data.objects if o.type=='MESH' and o.name.startswith(part) and not o.hide_render]
        if objs:
            k=len(tb.overlap(BVHTree.FromBMesh(bm(objs))))
            if k: hits[part]=k
    reach={s:round(((A.matrix_world@A.pose.bones[f'wrist.{s}'].head)-bpy.data.objects[f'grip.{s}'].location).length,3) for s in 'lr'}
    res[f]=dict(hits=hits,wristToGrip=reach)
print('RES',json.dumps(res))
bpy.ops.wm.save_as_mainfile(filepath=f'/tmp/fbcar/fb_car_ik_{d:.2f}.blend')
