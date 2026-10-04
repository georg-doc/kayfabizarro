import bpy, json, math, sys
from mathutils import Vector
D=json.load(open('/tmp/fluff/bounce/bounce_reference.json')); R=D['radius']
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
VAR={'high':(0.06,1.6,(0.33,0.22,0.62,1)),'low':(0.12,2.0,(0.33,0.22,0.62,1))}
objs={}
for i,(k,(lump,freq,col)) in enumerate(VAR.items()):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5,radius=R); o=bpy.context.active_object; o.name=f'kfb_fluff_ball_{k}'
    tx=bpy.data.textures.new(k,'CLOUDS'); tx.noise_scale=R/freq*1.2; tx.noise_depth=1
    d=o.modifiers.new('lump','DISPLACE'); d.texture=tx; d.texture_coords='LOCAL'; d.strength=lump*R*2; d.mid_level=0.5
    bpy.ops.object.modifier_apply(modifier='lump'); bpy.ops.object.shade_smooth()
    m=bpy.data.materials.new(k); m.diffuse_color=col; o.data.materials.append(m)
    tr=D['variants'][k]['track']; x0=-2.2+3.0*i
    for f,(x,z,sxz,sy) in enumerate(tr):
        o.location=(x+x0,0,z); o.scale=(sxz,sxz,sy)
        o.keyframe_insert('location',frame=f); o.keyframe_insert('scale',frame=f)
    objs[k]=o
sc.frame_start=0; sc.frame_end=max(len(D['variants'][k]['track']) for k in VAR)-1
bpy.ops.mesh.primitive_plane_add(size=60); fl=bpy.context.active_object; mf=bpy.data.materials.new('f'); mf.diffuse_color=(0.89,0.82,0.74,1); fl.data.materials.append(mf)
# height grid lines (0.5 m)
for h in (0.5,1.0,1.5,2.0,2.5):
    bpy.ops.mesh.primitive_cube_add(size=1,location=(0.3,3.2,h)); c=bpy.context.active_object; c.scale=(12,0.01,0.01); mc=bpy.data.materials.new('g'); mc.diffuse_color=(0.4,0.4,0.4,1); c.data.materials.append(mc)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
cam.data.type='ORTHO'; cam.data.ortho_scale=6.4; cam.location=(0.3,-12,1.45); cam.rotation_euler=(math.radians(90),0,0)
sc.render.resolution_x=960; sc.render.resolution_y=540
sc.render.image_settings.file_format='PNG'
import os; os.makedirs('/tmp/fluff/bounce/fr',exist_ok=True); sc.render.filepath='/tmp/fluff/bounce/fr/f_'
bpy.ops.render.render(animation=True)
# contact strip stills
sc.render.image_settings.file_format='PNG'
for k in VAR:
    for f in D['variants'][k]['contactFrames']:
        sc.frame_set(f); sc.render.filepath=f'/tmp/fluff/bounce/strip_{k}_{f:03d}.png'; bpy.ops.render.render(write_still=True)
for ob in list(sc.objects):
    ob.select_set(ob.name.startswith('kfb_fluff_ball'))
bpy.ops.export_scene.gltf(filepath='/tmp/fluff/bounce/kfb_fluff_ball_bounce_reference.glb',use_selection=True,export_animations=True,export_animation_mode='ACTIONS')
