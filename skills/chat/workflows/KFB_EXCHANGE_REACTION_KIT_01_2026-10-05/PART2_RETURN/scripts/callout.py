import bpy,math,sys,os
from mathutils import Vector
FP='/tmp/f3/merge/fingerprints-512.png'
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
def lin(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(((x+0.055)/1.055)**2.4 if x>0.04045 else x/12.92 for x in c)+(1,)
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
def clay(name,cols,scale_obj=1.0,marble=False):
    m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree; N=nt.nodes; L=nt.links; p=N['Principled BSDF']
    tc=N.new('ShaderNodeTexCoord')
    if marble:
        # swirl: noise-distorted wave bands -> constant colour ramp over the source colours
        nz=N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value=1.4; nz.inputs['Detail'].default_value=3; L.new(tc.outputs['Object'],nz.inputs['Vector'])
        wv=N.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value=1.1; wv.inputs['Distortion'].default_value=9.0; wv.inputs['Detail'].default_value=2
        mix=N.new('ShaderNodeMix'); mix.data_type='VECTOR'; mix.inputs['Factor'].default_value=0.55
        L.new(tc.outputs['Object'],mix.inputs['A']); L.new(nz.outputs['Color'],mix.inputs['B']); L.new(mix.outputs['Result'],wv.inputs['Vector'])
        cr=N.new('ShaderNodeValToRGB'); cr.color_ramp.interpolation='EASE'
        els=cr.color_ramp.elements
        for i,c in enumerate(cols):
            pos=i/(len(cols)-1)
            e=els[i] if i<2 else els.new(pos); e.position=pos; e.color=lin(c)
        L.new(wv.outputs['Fac'],cr.inputs['Fac']); base=cr.outputs['Color']
    else:
        rgb=N.new('ShaderNodeRGB'); rgb.outputs[0].default_value=lin(cols[0]); base=rgb.outputs[0]
    mo=N.new('ShaderNodeTexNoise'); mo.inputs['Scale'].default_value=2.2; L.new(tc.outputs['Object'],mo.inputs['Vector'])
    mr=N.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value=0.95; mr.inputs['To Max'].default_value=1.05; L.new(mo.outputs['Fac'],mr.inputs['Value'])
    mul=N.new('ShaderNodeMix'); mul.data_type='RGBA'; mul.blend_type='MULTIPLY'; mul.inputs['Factor'].default_value=1
    L.new(base,mul.inputs['A']); L.new(mr.outputs['Result'],mul.inputs['B']); L.new(mul.outputs['Result'],p.inputs['Base Color'])
    mp=N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value=(4.5/(2*0.5)/scale_obj,)*3; L.new(tc.outputs['Object'],mp.inputs['Vector'])
    img=N.new('ShaderNodeTexImage'); img.image=bpy.data.images.load(FP,check_existing=True); img.projection='BOX'; img.projection_blend=0.3; img.image.colorspace_settings.name='Non-Color'; L.new(mp.outputs['Vector'],img.inputs['Vector'])
    vo=N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value=1/(0.65*0.3); L.new(tc.outputs['Object'],vo.inputs['Vector'])
    b1=N.new('ShaderNodeBump'); b1.inputs['Strength'].default_value=0.3; b1.inputs['Distance'].default_value=0.02; L.new(vo.outputs['Distance'],b1.inputs['Height'])
    b3=N.new('ShaderNodeBump'); b3.inputs['Strength'].default_value=0.7; b3.inputs['Distance'].default_value=0.004; b3.invert=True; L.new(img.outputs['Color'],b3.inputs['Height']); L.new(b1.outputs['Normal'],b3.inputs['Normal'])
    L.new(b3.outputs['Normal'],p.inputs['Normal'])
    p.inputs['Roughness'].default_value=0.9; p.inputs['Sheen Weight'].default_value=0.18; p.inputs['Sheen Roughness'].default_value=0.85; p.inputs['Sheen Tint'].default_value=lin('#fff1e0')
    return m
import sys; sys.path.insert(0,'/tmp/f3'); from knead import kneaded
_seed=[3]
sc.render.engine='BLENDER_EEVEE'; sc.view_settings.view_transform='Standard'
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; bg=sc.world.node_tree.nodes['Background']; bg.inputs['Color'].default_value=(0.80,0.78,0.74,1); bg.inputs['Strength'].default_value=0.35
bpy.ops.mesh.primitive_plane_add(size=400); fl=bpy.context.active_object; fm=bpy.data.materials.new('floor'); fm.use_nodes=True
fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=lin('#e2d0bc'); fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.95; fl.data.materials.append(fm)
sun=bpy.data.objects.new('key',bpy.data.lights.new('key','SUN')); sun.data.energy=2.6; sun.data.angle=math.radians(8); sun.rotation_euler=(math.radians(52),0,math.radians(35)); sc.collection.objects.link(sun)
CALLS=[('BINGO!','#f2b632','kfb_gesture_cheering_a',32,-3.3),('BONGO.','#ef5a22','kfb_gesture_thoughtful_head_shake_a',28,0.0),('BOGGLE?','#8b68c7','kfb_reaction_surprised_a',51,3.3)]
def actor(clip,f,x):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath='/tmp/x1/A_RobotOne.glb',loglevel=50); new=[o for o in sc.objects if o not in before]
    arm=[o for o in new if o.type=='ARMATURE'][0]
    for o in new:
        if o.parent is None: o.location.x=x
    a=[v for k,v in bpy.data.actions.items() if k.startswith(clip)][-1]
    arm.animation_data_create(); arm.animation_data.action=None
    tr=arm.animation_data.nla_tracks.new(); st=tr.strips.new(clip,1-f,a)
    if a.slots: st.action_slot=a.slots[0]
    return arm,1
poses=[]
for i,(txt,col,clip,f,x) in enumerate(CALLS):
    cu=bpy.data.curves.new(f't{i}','FONT'); cu.body=txt; cu.size=0.40; cu.extrude=0.09; cu.bevel_depth=0.045; cu.bevel_resolution=3; cu.align_x='CENTER'; cu.space_character=1.05
    ob=bpy.data.objects.new(f'callout_{txt}',cu); sc.collection.objects.link(ob)
    bpy.context.view_layer.objects.active=ob; ob.select_set(True); bpy.ops.object.convert(target='MESH'); ob.select_set(False)
    rm=ob.modifiers.new('rm','REMESH'); rm.mode='VOXEL'; rm.voxel_size=0.014
    tex=bpy.data.textures.new(f'kn{i}','CLOUDS'); tex.noise_scale=0.25
    dp=ob.modifiers.new('knead','DISPLACE'); dp.texture=tex; dp.strength=0.035; dp.mid_level=0.5
    sm=ob.modifiers.new('sm','SMOOTH'); sm.factor=0.6; sm.iterations=4
    ob.data.polygons.foreach_set('use_smooth',[True]*len(ob.data.polygons))
    ob.data.materials.append(clay(f'clay{i}',[col]))
    ob.rotation_euler=(math.radians(90),0,math.radians([8,-4,6][i])); ob.location=(x+0.1,0.0,2.45)
    poses.append(actor(clip,f,x))
sc.frame_set(1)
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=40
cam.location=(0.8,-10.5,2.6); cam.rotation_euler=(Vector((0,0,1.45))-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.resolution_x=1600; sc.render.resolution_y=900; sc.eevee.taa_render_samples=48
sc.render.filepath='/tmp/x2/CALLOUT_LOOK.png'; bpy.ops.render.render(write_still=True); print('ok')
