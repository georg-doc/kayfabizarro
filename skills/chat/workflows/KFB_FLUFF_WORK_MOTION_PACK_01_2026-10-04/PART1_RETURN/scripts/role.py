import bpy, math, sys, json, os
from mathutils import Vector
glb,tag,jobs,scale=sys.argv[1],sys.argv[2],json.loads(sys.argv[3]),float(sys.argv[4])
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
bpy.ops.import_scene.gltf(filepath=glb,loglevel=50)
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
bpy.ops.mesh.primitive_plane_add(size=30); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.82,0.84,1); fl.data.materials.append(m)
bpy.ops.mesh.primitive_uv_sphere_add(radius=1,segments=32,ring_count=16); ball=bpy.context.active_object; mb=bpy.data.materials.new('b'); mb.diffuse_color=(0.55,0.4,0.78,1); ball.data.materials.append(mb); bpy.ops.object.shade_smooth()
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=300; sc.render.resolution_y=300
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=3.0*scale
acts={a.name:a for a in bpy.data.actions}
os.makedirs(f'/tmp/fluff/role/{tag}',exist_ok=True)
def wp(b): return arm.matrix_world@arm.pose.bones[b].head
for role,clip,u,mode,r in jobs:
    a=[v for k,v in acts.items() if k.startswith(clip)][0]; arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    f0,f1=a.frame_range; sc.frame_set(int(f0+(f1-f0)*u)); bpy.context.view_layer.update()
    hl,hr,hp=wp('hand.l'),wp('hand.r'),wp('hips'); mid=(hl+hr)/2
    R=r*scale; fwd=Vector((0,-1,0))
    if mode=='push': c=mid+fwd*R*0.85; c.z=max(R,c.z)
    elif mode=='between': c=mid.copy()
    elif mode=='ground': c=Vector((hp.x,hp.y-0.45*scale-R,R))
    else: c=Vector((0,0,-50))
    ball.location=c; ball.scale=(R,R,R)
    for nm,loc in (('side',Vector((5*scale,-0.3*scale,1.0*scale))),('q34',Vector((2.6*scale,-3.2*scale,1.8*scale)))):
        loc=loc+Vector((hp.x,hp.y,0)); tgt=Vector((hp.x,hp.y-0.3*scale,0.9*scale)); cam.location=loc; cam.rotation_euler=(tgt-loc).to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=f'/tmp/fluff/role/{tag}/{role}__{nm}.png'; bpy.ops.render.render(write_still=True)
