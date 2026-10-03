import bpy, json, sys
from mathutils import Vector, Matrix
A='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/'
WP={'sword':A+'KayKit_Adventurers_2.0_FREE/Assets/gltf/sword_1handed.gltf','pistol':A+'KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf','rifle':A+'KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/gltf/ToySoldier_Rifle.gltf'}
import math
RIFLE_ROT=None
TEST=len(sys.argv)>1 and sys.argv[-1]=='test'
ROT=float(sys.argv[-2]) if len(sys.argv)>2 and sys.argv[-1]=='rot' else None
if ROT is not None: RIFLE_ROT=(0,math.radians(ROT),0) if ROT else None
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.render.fps=30  # must be set BEFORE the glTF import (importer converts seconds with the scene fps)
bpy.ops.import_scene.gltf(filepath='/tmp/wpn/WPN2.glb',loglevel=50)
sc=bpy.context.scene; sc.render.fps=30
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
for o in sc.objects:
    if o.type=='MESH' and o.name.lower().startswith(('icosphere','icokugel')): o.hide_render=True
a=bpy.data.actions[0]; arm.animation_data_create(); arm.animation_data.action=a
if a.slots: arm.animation_data.action_slot=a.slots[0]
slot=[o for o in sc.objects if o.name.startswith('handslot.r')][0]
print('slot',slot.name,slot.type,slot.parent, slot.parent_type, slot.parent_bone)
info=json.load(open('/tmp/wpn/wpn2_info.json'))['info']
wobj={}
for k,p in WP.items():
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=p,loglevel=50)
    new=[o for o in sc.objects if o not in before]
    roots=[o for o in new if o.parent is None]
    for r in roots:
        r.parent=slot; r.matrix_parent_inverse=Matrix(); r.location=(0,0,0); r.rotation_mode='QUATERNION'
    wobj[k]=new
    print(k,[o.name for o in new])
# grip rotations per segment (glTF handslot frame -> Blender: A R A^T)
import numpy as np
from mathutils import Quaternion, Matrix as Mx
GR=json.load(open('/tmp/wpn/grips2.json'))
A=np.array([[1,0,0],[0,0,-1],[0,1,0]])
def gq(si):
    x,y,z,w=GR[str(si)]['quat_xyzw']; R=np.array(Quaternion((w,x,y,z)).to_matrix())
    return Mx((A@R@A.T).tolist()).to_quaternion()
for f,r in enumerate(info):
    if True:
        q=gq(r['seg'])
        for k,objs in wobj.items():
            for o in objs:
                if o.parent==slot:
                    o.rotation_mode='QUATERNION'; o.rotation_quaternion=q; o.keyframe_insert('rotation_quaternion',frame=f)
for k,objs in wobj.items():
    for o in objs:
        if o.animation_data and o.animation_data.action:
            for fc in (o.animation_data.action.fcurves if hasattr(o.animation_data.action,'fcurves') else []):
                for kp in fc.keyframe_points: kp.interpolation='CONSTANT'
# visibility keys
for f,r in enumerate(info):
    for k,objs in wobj.items():
        for o in objs:
            o.hide_render=(r['weapon']!=k); o.keyframe_insert('hide_render',frame=f)
bpy.ops.mesh.primitive_plane_add(size=1); g=bpy.context.object; g.scale=(8,110,1); g.location=(0,-53,0)
NX=80; NY=1100; img=bpy.data.images.new('chk',NX,NY); px=[]
for y in range(NY):
    for x in range(NX):
        c=0.90 if ((x//5+y//5)%2==0) else 0.80
        if y%10==0: c-=0.18
        px+=[c,c,c*0.98,1]
img.pixels=px
mg=bpy.data.materials.new('grid'); mg.use_nodes=True; nt=mg.node_tree; bs=nt.nodes['Principled BSDF']
it=nt.nodes.new('ShaderNodeTexImage'); it.image=img; it.interpolation='Closest'; nt.links.new(it.outputs['Color'],bs.inputs['Base Color']); g.active_material=mg
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.93,0.92)
sc.render.engine='BLENDER_WORKBENCH'; sc.display.shading.light='STUDIO'; sc.display.shading.color_type='TEXTURE'; sc.display.shading.show_shadows=True; sc.display.shading.background_type='WORLD'
sc.render.resolution_x=1280; sc.render.resolution_y=540
cam=bpy.data.cameras.new('c'); cam.type='ORTHO'; cam.ortho_scale=5.6; co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
pb=arm.pose.bones['root']
frames=[s*75+40 for s in range(8)] if TEST else ([440,490,640,700,790,860] if ROT is not None else range(len(info)))
for f in frames:
    sc.frame_set(f)
    y=(arm.matrix_world@pb.head).y
    co.location=Vector((-9,y-2.6,2.7)) if ROT is None else Vector((-9,y,1.2)); tgt=Vector((0,y-0.3,1.05)); d=tgt-co.location; co.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=(f'/tmp/wpn/rt/r{ROT}_{f:04d}.png' if ROT is not None else f'/tmp/wpn/fr2/f{f:04d}.png'); bpy.ops.render.render(write_still=True)
print('done')
