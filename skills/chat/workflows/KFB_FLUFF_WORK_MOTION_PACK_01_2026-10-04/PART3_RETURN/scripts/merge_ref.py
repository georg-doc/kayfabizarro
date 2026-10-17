# kfb_fluff_merge_6to1_reference: 6 Small Fluff roll together, squash into a lump, POP, one marbled Medium Fluff puffs up and settles.
# Prop-only timing/look donor (runtime owns the count rule 6:1). Blender 5.0, EEVEE. 30 fps. Units m, Blender Z up.
import bpy, math, sys, json, os
from mathutils import Vector
OUT=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else 'anim'
HERE=os.path.dirname(os.path.abspath(__file__)); FP=os.path.join(HERE,'fingerprints-512.png')
RS,RM=0.20,2.17/3   # Small 0.20, Medium work ball diameter = 2/3 Medium body height
PAL=['#8b68c7','#f2b632','#ef5a22','#1f7a3e','#cdc666','#b86384']   # claybound + optionc knetbar (K1 palettes)
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
def lump(name,r,mat,lumpk=0.13,freq=1.6):
    _seed[0]+=1; o=kneaded(name,_seed[0],5,lumpk,4 if r>0.3 else 2,0.10 if r>0.3 else 0.06)
    for v in o.data.vertices: v.co*=r
    o.data.materials.append(mat); return o
sc.render.engine='BLENDER_EEVEE'; sc.view_settings.view_transform='Standard'
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; bg=sc.world.node_tree.nodes['Background']; bg.inputs['Color'].default_value=(0.80,0.78,0.74,1); bg.inputs['Strength'].default_value=0.35
bpy.ops.mesh.primitive_plane_add(size=400); fl=bpy.context.active_object; fm=bpy.data.materials.new('floor'); fm.use_nodes=True
fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=lin('#e2d0bc'); fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.95; fl.data.materials.append(fm)
sun=bpy.data.objects.new('key',bpy.data.lights.new('key','SUN')); sun.data.energy=2.6; sun.data.angle=math.radians(8); sun.rotation_euler=(math.radians(52),0,math.radians(35)); sc.collection.objects.link(sun)
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=45
cam.location=(0.0,-5.6,2.8); cam.rotation_euler=(Vector((0,0,0.5))-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.resolution_x=640 if MODE=='anim' else 1600; sc.render.resolution_y=360 if MODE=='anim' else 900
sc.eevee.taa_render_samples=4 if MODE=='anim' else 64
T=dict(start=1,gather_end=26,squash_end=34,pop=36,overshoot=42,settle=56,end=64)
if MODE=='look':
    # marbled look: High (cohesive) marbled Medium ball + Low variant + the six source smalls
    mm=clay('marble',PAL,1.0,True); B=lump('Fluff_Medium_marbled',RM,mm); B.location=(-0.95,0,RM)
    mm2=clay('marble3',[PAL[0],PAL[1],PAL[3]],1.0,True); B2=lump('Fluff_Medium_marbled_3col',RM,mm2,0.18,2.0); B2.scale=(1.08,1.08,0.84); B2.location=(0.95,0,RM*0.84)
    for i,c in enumerate(PAL):
        s=lump(f'small_{i}',RS,clay(f's{i}',[c],0.3)); s.location=(-1.75+0.7*i,-1.35,RS)
    cam.location=(0.0,-6.4,2.5); cam.rotation_euler=(Vector((0,-0.3,0.55))-cam.location).to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=f'{OUT}/FLUFF_MARBLED_LOOK.png'; bpy.ops.render.render(write_still=True); raise SystemExit
smalls=[]
for i,c in enumerate(PAL):
    a=2*math.pi*i/6; s=lump(f'kfb_fluff_small_{i}',RS,clay(f's{i}',[c],0.3)); smalls.append((s,a))
med=lump('kfb_fluff_medium_merged',RM,clay('marble',PAL,1.0,True))
def key(o,f,loc=None,sc_=None):
    if loc is not None: o.location=loc; o.keyframe_insert('location',frame=f)
    if sc_ is not None: o.scale=sc_; o.keyframe_insert('scale',frame=f)
R0=1.3
for s,a in smalls:
    p0=Vector((R0*math.cos(a),R0*math.sin(a),RS))
    key(s,T['start'],p0,(1,1,1))
    # roll inward with two small hops (cartoon), arrive touching each other
    pin=Vector((0.26*math.cos(a),0.17*math.sin(a),RS))
    for k,u in enumerate([0.35,0.7,1.0]):
        f=T['start']+int((T['gather_end']-T['start'])*u); p=p0.lerp(pin,u*u*(3-2*u)); p.z=RS+(0.10 if k<2 else 0)*(1-u)
        key(s,f,p,(1,1,1))
    s.rotation_mode='XYZ'; s.rotation_euler=(0,0,0); s.keyframe_insert('rotation_euler',frame=T['start'])
    s.rotation_euler=(-math.sin(a)*4,math.cos(a)*4,0); s.keyframe_insert('rotation_euler',frame=T['gather_end'])
    # squash into a lump, pulled to the centre
    key(s,T['squash_end'],Vector((0.14*math.cos(a),0.14*math.sin(a),RS*0.7)),(1.25,1.25,0.6))
    key(s,T['pop'],Vector((0.05*math.cos(a),0.05*math.sin(a),RS*0.6)),(0.01,0.01,0.01))
key(med,T['start'],Vector((0,0,RM)),(0.001,0.001,0.001)); key(med,T['squash_end'],Vector((0,0,RM)),(0.001,0.001,0.001))
key(med,T['pop'],Vector((0,0,RM*0.55)),(0.55,0.55,0.4))
key(med,T['pop']+3,Vector((0,0,RM*1.12)),(1.05,1.05,1.25))      # puff up (stretch)
key(med,T['overshoot'],Vector((0,0,RM*0.86)),(1.18,1.18,0.86))   # land squash
key(med,T['overshoot']+5,Vector((0,0,RM*1.03)),(0.96,0.96,1.06))
key(med,T['settle'],Vector((0,0,RM)),(1,1,1)); key(med,T['end'],Vector((0,0,RM)),(1,1,1))
sc.frame_start=1; sc.frame_end=T['end']
json.dump(dict(id='kfb_fluff_merge_6to1_reference',fps=30,smallRadius=RS,mediumRadius=RM,frames=T,colours=PAL,
    notes='6 small roll in with two hops (1-26), squash into one lump (26-34), POP at 36: smalls vanish, the marbled Medium ball puffs up (stretch 1.25 at 39), lands squashed (0.86 at 42), wobbles, settles by 56. Visual size jump is cartoon (dough rising), not volume.'),open(f'{OUT}/merge_6to1_timing.json','w'),indent=1)
for o in list(sc.objects): o.select_set(o.name.startswith('kfb_fluff_'))
bpy.ops.export_scene.gltf(filepath=f'{OUT}/kfb_fluff_merge_6to1_reference.glb',use_selection=True,export_animations=True)
os.makedirs(f'{OUT}/mf',exist_ok=True); sc.render.filepath=f'{OUT}/mf/f_'
bpy.ops.render.render(animation=True)
