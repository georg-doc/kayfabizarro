# KFB Fluff High/Low look reference (Blender 5.0, EEVEE). Parameters from K1 lab-clay (clay-material.v8 / clay-profiles.v2 / clay-soften.v1).
import bpy, math, sys, json, os
from mathutils import Vector
OUT=sys.argv[1] if len(sys.argv)>1 else '/tmp/fluff/look'
FP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'fingerprints-512.png')
R=0.5  # Fluff reference radius (m, Blender units); pivot = ball centre; +Z up (glTF +Y up)
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
def lin(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(((x+0.055)/1.055)**2.4 if x>0.04045 else x/12.92 for x in c)+(1,)
VAR={ # High = cohesive/bonded; Low = looser, wobblier, sag, separation tendency
 'high':dict(lump=0.06,lumpFreq=1.6,sag=1.00,facet=0.14,dent=0.35,sep=False,rough=0.90),
 'low' :dict(lump=0.12,lumpFreq=2.0,sag=0.82,facet=0.20,dent=0.55,sep=True ,rough=0.94)}
def mat(name,col,v):
    m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree; N=nt.nodes; L=nt.links
    p=N['Principled BSDF']
    tc=N.new('ShaderNodeTexCoord'); mp=N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value=(4.5/ (2*R),)*3
    L.new(tc.outputs['Object'],mp.inputs['Vector'])
    img=N.new('ShaderNodeTexImage'); img.image=bpy.data.images.load(FP); img.projection='BOX'; img.projection_blend=0.3; img.image.colorspace_settings.name='Non-Color'
    L.new(mp.outputs['Vector'],img.inputs['Vector'])
    # facets: voronoi F1 distance (object space, size 0.65 of K1 world unit scaled to ball)
    vo=N.new('ShaderNodeTexVoronoi'); vo.feature='F1'; vo.inputs['Scale'].default_value=1/(0.65*R*0.6)
    L.new(tc.outputs['Object'],vo.inputs['Vector'])
    # mottle: low-freq noise ±0.05
    mo=N.new('ShaderNodeTexNoise'); mo.inputs['Scale'].default_value=2.2; L.new(tc.outputs['Object'],mo.inputs['Vector'])
    mr=N.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value=0.95; mr.inputs['To Max'].default_value=1.05; L.new(mo.outputs['Fac'],mr.inputs['Value'])
    mul=N.new('ShaderNodeMix'); mul.data_type='RGBA'; mul.blend_type='MULTIPLY'; mul.inputs['Factor'].default_value=1
    mul.inputs['A'].default_value=col; L.new(mr.outputs['Result'],mul.inputs['B']); L.new(mul.outputs['Result'],p.inputs['Base Color'])
    # dents: medium noise
    dn=N.new('ShaderNodeTexNoise'); dn.inputs['Scale'].default_value=7; dn.inputs['Detail'].default_value=1; L.new(tc.outputs['Object'],dn.inputs['Vector'])
    b1=N.new('ShaderNodeBump'); b1.inputs['Strength'].default_value=v['facet']*2.2; b1.inputs['Distance'].default_value=0.02
    L.new(vo.outputs['Distance'],b1.inputs['Height'])
    b2=N.new('ShaderNodeBump'); b2.inputs['Strength'].default_value=v['dent']*0.6; b2.inputs['Distance'].default_value=0.02
    L.new(dn.outputs['Fac'],b2.inputs['Height']); L.new(b1.outputs['Normal'],b2.inputs['Normal'])
    b3=N.new('ShaderNodeBump'); b3.inputs['Strength'].default_value=0.7; b3.inputs['Distance'].default_value=0.004; b3.invert=True
    L.new(img.outputs['Color'],b3.inputs['Height']); L.new(b2.outputs['Normal'],b3.inputs['Normal'])
    L.new(b3.outputs['Normal'],p.inputs['Normal'])
    # roughness 0.9, minus oil 0.22 where prints touched
    oil=N.new('ShaderNodeMapRange'); oil.inputs['From Min'].default_value=0.1; oil.inputs['From Max'].default_value=0.6
    oil.inputs['To Min'].default_value=v['rough']; oil.inputs['To Max'].default_value=v['rough']*(1-0.22)
    L.new(img.outputs['Color'],oil.inputs['Value']); L.new(oil.outputs['Result'],p.inputs['Roughness'])
    p.inputs['Sheen Weight'].default_value=0.18; p.inputs['Sheen Roughness'].default_value=0.85; p.inputs['Sheen Tint'].default_value=lin('#fff1e0')
    return m
def ball(name,col,v,loc):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=6,radius=R,location=(0,0,0)); o=bpy.context.active_object; o.name=name
    me=o.data
    # sag: flatten toward ground, widen at belly (volume-ish preserved)
    for vt in me.vertices:
        z=vt.co.z/R; s=v['sag']
        k=1+(1-s)*0.55*(1-z)*0.5
        vt.co.x*=k; vt.co.y*=k; vt.co.z*=s
    tx=bpy.data.textures.new(name+'_lump','CLOUDS'); tx.noise_scale=R/v['lumpFreq']*1.2; tx.noise_depth=1
    d=o.modifiers.new('lump','DISPLACE'); d.texture=tx; d.texture_coords='OBJECT'; d.strength=v['lump']*R*2; d.mid_level=0.5
    bpy.ops.object.shade_smooth(); o.data.materials.append(mat(name+'_m',col,v))
    zmin=min((o.matrix_world@vv.co).z for vv in o.data.vertices)-v['lump']*R  # approx; snap below
    o.location=loc
    parts=[o]
    if v['sep']:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4,radius=R*0.24,location=(0,0,0)); c=bpy.context.active_object; c.name=name+'_crumb'
        c.scale=(1,1,0.85)
        d2=c.modifiers.new('lump','DISPLACE'); d2.texture=tx; d2.texture_coords='OBJECT'; d2.strength=v['lump']*R*2
        bpy.ops.object.shade_smooth(); c.data.materials.append(o.data.materials[0])
        c.location=Vector(loc)+Vector((R*1.3,-R*0.35,R*0.24*0.85-0.0))
        parts.append(c)
    return parts
def ground(o,v):
    bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get(); e=o.evaluated_get(dg)
    zmin=min((e.matrix_world@vv.co).z for vv in e.data.vertices); o.location.z-=zmin; return -zmin
sc.render.engine='BLENDER_EEVEE'; sc.view_settings.view_transform='Standard'; sc.view_settings.look='None'
sc.world=bpy.data.worlds.new('w'); sc.world.use_nodes=True; sc.world.node_tree.nodes['Background'].inputs['Color'].default_value=(0.80,0.78,0.74,1); sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0.35
bpy.ops.mesh.primitive_plane_add(size=400); fl=bpy.context.active_object; fm=bpy.data.materials.new('floor'); fm.use_nodes=True
fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=lin('#e2d0bc'); fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.95; fl.data.materials.append(fm)
sun=bpy.data.objects.new('key',bpy.data.lights.new('key','SUN')); sun.data.energy=2.6; sun.data.angle=math.radians(8); sun.rotation_euler=(math.radians(52),0,math.radians(35)); sc.collection.objects.link(sun)
fil=bpy.data.objects.new('fill',bpy.data.lights.new('fill','AREA')); fil.data.energy=300; fil.data.size=5; fil.location=(-4,-3,3); fil.rotation_euler=(math.radians(60),0,math.radians(-55)); sc.collection.objects.link(fil)
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=60
sc.render.resolution_x=1600; sc.render.resolution_y=900
info={'radius':R,'units':'Blender m (glTF +Y up)','pivot':'ball centre','variants':VAR,'source':'K1 lab-clay clay-material.v8 (sheen 0.18 #fff1e0 rough 0.85, roughness 0.9, facet 0.14 size 0.65, print tile 4.5, oil 0.22, mottle 0.05), clay-soften.v1 (lump 0.06, freq 1.6), clay-profiles.v2 prop dent 0.35-0.4; fingerprints = cgbookcase Fingerprints01 (via joebinns/clay) 512 px from KFB lab-hud'}
mode=sys.argv[2] if len(sys.argv)>2 else 'pair'
if mode=='pair':
    pal=[('knetbar','#8b68c7')]
    objs=[]
    for i,(vn) in enumerate(('high','low')):
        ps=ball('Fluff_'+vn,lin('#8b68c7'),VAR[vn],(-0.85+1.6*i,0,0)); dz=ground(ps[0],VAR[vn])
        if len(ps)>1: ground(ps[1],VAR[vn])
    cam.data.lens=50; cam.location=(0.05,-5.6,1.9); cam.rotation_euler=(Vector((0.05,0,0.45))-cam.location).to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=f'{OUT}/FLUFF_LOOK_HIGH_LOW.png'
else:
    cols=[('knetbar','#8b68c7'),('accent','#f2b632'),('ground','#ef5a22'),('leaf','#1f7a3e'),('lime','#cdc666'),('optionc_knetbar','#b86384')]
    for i,(n,h) in enumerate(cols):
        for j,vn in enumerate(('high','low')):
            ps=ball(f'Fluff_{n}_{vn}',lin(h),VAR[vn],(-4.75+1.9*i,0.0+1.7*j,0)); [ground(p,VAR[vn]) for p in ps]
    cam.location=(0,-10.5,4.6); cam.rotation_euler=(Vector((0,0.85,0.2))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.lens=40
    sc.render.filepath=f'{OUT}/FLUFF_LOOK_PALETTE.png'
bpy.ops.render.render(write_still=True)
json.dump(info,open(f'{OUT}/fluff_look_params.json','w'),indent=1)
if len(sys.argv)>3: bpy.ops.wm.save_as_mainfile(filepath=sys.argv[3])
