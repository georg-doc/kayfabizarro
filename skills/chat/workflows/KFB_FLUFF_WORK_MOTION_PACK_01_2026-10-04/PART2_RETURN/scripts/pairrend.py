import bpy, math, sys, json, os
from mathutils import Vector
gA,gB,D,off,hand_f,scale,outdir,R=sys.argv[1],sys.argv[2],float(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),float(sys.argv[6]),sys.argv[7],float(sys.argv[8])
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
def imp(p):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=p,loglevel=50); new=[o for o in sc.objects if o not in before]
    return [o for o in new if o.type=='ARMATURE'][0],[o for o in new if o.parent is None]
armA,topA=imp(gA); armB,topB=imp(gB)
for o in topB: o.rotation_mode='XYZ'; o.location=(0,-D,0); o.rotation_euler=(0,0,math.pi)
bpy.context.view_layer.update()
def setact(arm,name,offset):
    a=[v for k,v in bpy.data.actions.items() if k.startswith(name)]
    # prefer the action whose users map to this armature's import (names may be suffixed .001)
    arm.animation_data_create(); arm.animation_data.action=None
    tr=arm.animation_data.nla_tracks.new(); 
    act=a[0] if arm==armA else a[-1]
    st=tr.strips.new(name,int(act.frame_range[0])-offset,act)
    if act.slots: st.action_slot=act.slots[0]
    st.frame_start_ui=int(act.frame_range[0])-offset
    return act
aA=setact(armA,'kfb_interaction_gift_give_a',0); aB=setact(armB,'kfb_interaction_gift_receive_a',off)
bpy.ops.mesh.primitive_plane_add(size=80); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4,radius=R); ball=bpy.context.active_object
mb=bpy.data.materials.new('b'); mb.diffuse_color=(0.55,0.41,0.78,1); ball.data.materials.append(mb); bpy.ops.object.shade_smooth()
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=600; sc.render.resolution_y=360
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=4.2*scale
os.makedirs(outdir,exist_ok=True)
f0=int(aA.frame_range[0]); f1=int(aA.frame_range[1])
def mid(arm): return (arm.matrix_world@arm.pose.bones['handslot.l'].head+arm.matrix_world@arm.pose.bones['handslot.r'].head)/2
gaps=[]
for k,f in enumerate(range(f0,f1+1)):
    sc.frame_set(f); bpy.context.view_layer.update()
    a=mid(armA); b=mid(armB); gaps.append((f-f0,round((a-b).length,3)))
    ball.location=(a if f-f0<=hand_f else b)
    c=Vector((0,-D/2,0))
    for nm,loc in (('side',Vector((6,0,1.3))),('q34',Vector((4.2,-2.6,2.0)))):
        L=loc*scale+c; cam.location=L; cam.rotation_euler=(Vector((0,-D/2,0.9*scale))-L).to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=f'{outdir}/pair__{nm}__{k:03d}.png'; bpy.ops.render.render(write_still=True)
json.dump(gaps,open(f'{outdir}/gaps.json','w'))
