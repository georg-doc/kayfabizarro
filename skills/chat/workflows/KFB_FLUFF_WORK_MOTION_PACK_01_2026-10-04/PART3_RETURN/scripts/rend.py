import bpy, math, sys, json, os
from mathutils import Vector
glb,tag,jobs,scale,outdir=sys.argv[1],sys.argv[2],json.loads(open(sys.argv[3]).read()),float(sys.argv[4]),sys.argv[5]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
bpy.ops.mesh.primitive_plane_add(size=80); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sys.path.insert(0,'/tmp/f3'); from knead import kneaded; ball=kneaded('fluff',11)
mb=bpy.data.materials.new('b'); mb.use_nodes=True; mb.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.26,0.14,0.56,1); mb.diffuse_color=(0.55,0.41,0.78,1); ball.data.materials.append(mb)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=int(sys.argv[6]) if len(sys.argv)>6 else 360; sc.render.resolution_y=sc.render.resolution_x
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=3.4*scale
acts={a.name:a for a in bpy.data.actions}
os.makedirs(outdir,exist_ok=True)
def g2b(p): return Vector((p[0],-p[2],p[1]))
chk={}
for j in jobs:
    clip=j['clip']; a=[v for k,v in acts.items() if k.startswith(clip)][0]
    arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0,f1=int(a.frame_range[0]),int(a.frame_range[1])
    frames=j.get('frames') or list(range(f0,f1+1))
    b=j.get('ball')
    if b: ball.location=g2b(b['C']); ball.scale=(b['R'],)*3; ball.rotation_euler=(0,0,0)
    else: ball.location=(0,0,-100)
    for k,f in enumerate(frames):
        sc.frame_set(f); bpy.context.view_layer.update()
        if b and b.get('spin'): ball.rotation_euler=(-(f-f0)/30*b['spin'],0,0)
        hp=arm.matrix_world@arm.pose.bones['hips'].head
        if k==0:
            hs=arm.matrix_world@arm.pose.bones['handslot.l'].head; chk[clip]=[round(x,3) for x in hs]
        mid=hp.copy()
        if b: mid=(hp+ball.location)/2
        for nm,loc in j.get('views',{'side':[6,-0.0,1.2],'q34':[3.2,-3.9,1.9]}).items():
            L=Vector(loc)*scale+Vector((mid.x,mid.y,0)); tgt=Vector((mid.x,mid.y,0.95*scale)); cam.location=L
            cam.rotation_euler=(tgt-L).to_track_quat('-Z','Y').to_euler()
            sc.render.filepath=f'{outdir}/{clip}__{nm}__{k:03d}.png'; bpy.ops.render.render(write_still=True)
json.dump(chk,open(f'{outdir}/chk_{tag}.json','w'))
