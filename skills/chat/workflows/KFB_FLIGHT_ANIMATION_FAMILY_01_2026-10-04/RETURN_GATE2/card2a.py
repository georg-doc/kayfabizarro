import bpy, bmesh, math, sys
from mathutils import Vector
ENGINE = sys.argv[1] if len(sys.argv)>1 else 'BLENDER_EEVEE'
TEX='/tmp/g2/KFB_CARD_BACKSIDE_INK_BAND_4242.png'
CW=3.0; CD=CW*447/800; TH=0.055; SEGX=10; SEGZ=14
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.render.fps=30
def hexlin(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    return [x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]+[1]
# ---- materials
img=bpy.data.images.load(TEX); img.colorspace_settings.name='sRGB'
def texmat(name, unlit):
    m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree
    b=nt.nodes['Principled BSDF']; t=nt.nodes.new('ShaderNodeTexImage'); t.image=img; t.interpolation='Linear'
    b.inputs['Roughness'].default_value=0.9; b.inputs['Metallic'].default_value=0
    b.inputs['Specular IOR Level'].default_value=0.2
    if unlit:
        b.inputs['Base Color'].default_value=(0,0,0,1)
        nt.links.new(t.outputs['Color'],b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value=1.0
    else:
        nt.links.new(t.outputs['Color'],b.inputs['Base Color'])
    return m
mTop=texmat('CARD_TOP_face_lit',False)
mBot=texmat('CARD_BOTTOM_back_unlit',True)
mSide=bpy.data.materials.new('CARD_SIDE_ink_1f1a14'); mSide.use_nodes=True
bs=mSide.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value=hexlin('#1f1a14')
bs.inputs['Roughness'].default_value=0.92; bs.inputs['Metallic'].default_value=0; bs.inputs['Specular IOR Level'].default_value=0.2
mSide.diffuse_color=hexlin('#1f1a14')
# ---- slab: top grid (PlaneGeometry CW x CD, SEGX x SEGZ), bottom = top - TH, skirt from perimeter ring
bm=bmesh.new(); uv=bm.loops.layers.uv.new('UVMap')
nx=SEGX+1
def grid(z):
    vs=[]
    for iy in range(SEGZ+1):           # three PlaneGeometry row 0 = +y = texture top = forward edge
        for ix in range(nx):
            u=ix/SEGX; v=1-iy/SEGZ
            vs.append((bm.verts.new((-CW/2+u*CW, -CD/2+v*CD, z)),u,v))
    return vs
T=grid(0.0); B=grid(-TH)
def face(vs,idx,mat,flip=False):
    q=[vs[i] for i in idx]
    if flip: q=q[::-1]
    f=bm.faces.new([a[0] for a in q]); f.material_index=mat
    for l,a in zip(f.loops,q): l[uv].uv=(a[1],a[2])
for iy in range(SEGZ):
    for ix in range(SEGX):
        a=iy*nx+ix; b=a+1; c=a+nx+1; d=a+nx
        face(T,[a,d,c,b],0); face(B,[a,d,c,b],1,flip=True)
perim=[ix for ix in range(SEGX)]+[iy*nx+SEGX for iy in range(SEGZ)]+[SEGZ*nx+ix for ix in range(SEGX,0,-1)]+[iy*nx for iy in range(SEGZ,0,-1)]
M=len(perim)
for i in range(M):
    p,q=perim[i],perim[(i+1)%M]
    f=bm.faces.new([T[p][0],T[q][0],B[q][0],B[p][0]]); f.material_index=2
bm.normal_update()
me=bpy.data.meshes.new('CARD_SURFACE'); bm.to_mesh(me); bm.free()
for m in (mTop,mBot,mSide): me.materials.append(m)
for f in me.polygons:
    pass
card=bpy.data.objects.new('CARD_SURFACE',me); sc.collection.objects.link(card)
# outward normals check
bpy.context.view_layer.objects.active=card; card.select_set(True)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
print('verts',len(me.vertices),'faces',len(me.polygons),'perim',M, 'dims',tuple(round(x,4) for x in card.dimensions))
# ---- world / light
w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True
nt=w.node_tree; bg=nt.nodes['Background']; bg.inputs['Color'].default_value=(1,1,1,1); bg.inputs['Strength'].default_value=0.6
sky=nt.nodes.new('ShaderNodeBackground'); sky.inputs['Color'].default_value=hexlin('#9fc7e8'); sky.inputs['Strength'].default_value=1.0
lp=nt.nodes.new('ShaderNodeLightPath'); mx=nt.nodes.new('ShaderNodeMixShader'); out=nt.nodes['World Output']
nt.links.new(lp.outputs['Is Camera Ray'],mx.inputs[0]); nt.links.new(bg.outputs[0],mx.inputs[1]); nt.links.new(sky.outputs[0],mx.inputs[2]); nt.links.new(mx.outputs[0],out.inputs['Surface'])
sun=bpy.data.objects.new('SUN',bpy.data.lights.new('SUN','SUN')); sc.collection.objects.link(sun)
sun.data.energy=2.2; sun.rotation_euler=(math.radians(40),math.radians(-15),math.radians(30)); sun.data.angle=math.radians(3)
sc.view_settings.view_transform='Standard'; sc.view_settings.look='None'
sc.render.engine=ENGINE
if ENGINE=='CYCLES':
    sc.cycles.samples=48; sc.cycles.device='CPU'
    try: sc.cycles.use_denoising=True
    except: pass
else:
    try: sc.eevee.taa_render_samples=32
    except: pass
sc.render.film_transparent=False
cam=bpy.data.objects.new('CAM',bpy.data.cameras.new('CAM')); sc.collection.objects.link(cam); sc.camera=cam
def look(loc,tgt=(0,0,-TH/2)):
    cam.location=loc; d=Vector(tgt)-Vector(loc); cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
VARIANT = sys.argv[2] if len(sys.argv)>2 else 'A'
if VARIANT=='B': img.filepath='/tmp/g2/KFB_CARD_BACKSIDE_INK_BAND_4242_optB_edge.png'; img.reload()
VIEWS=[
 ('1_neutral_flat_top', dict(ortho=3.25, loc=(0,0,6)), (1280,740)),
 ('2_front', dict(lens=50, loc=(0,-6.4,1.35)), (1280,740)),
 ('3_threequarter', dict(lens=50, loc=(4.5,-4.4,2.9)), (1280,740)),
 ('4_side_grazing', dict(lens=35, loc=(3.1,-0.35,0.07), tgt=(0,0,-TH/2)), (1280,740)),
 ('5_underside', dict(lens=50, loc=(3.7,-4.6,-2.8)), (1280,740)),
 ('6_grazing_closeup_corner', dict(lens=85, loc=(2.35,-1.55,0.10), tgt=(1.42,-0.76,-TH/2)), (1280,740)),
]
ONLY = sys.argv[3].split(',') if len(sys.argv)>3 else None
for name,v,res in VIEWS:
    if ONLY and name[0] not in ONLY: continue
    sc.render.resolution_x,sc.render.resolution_y=res
    if 'ortho' in v: cam.data.type='ORTHO'; cam.data.ortho_scale=v['ortho']
    else: cam.data.type='PERSP'; cam.data.lens=v['lens']
    cam.data.clip_start=0.01
    look(v['loc'],v.get('tgt',(0,0,-TH/2)))
    sc.render.filepath=f'/tmp/g2/r/{VARIANT}_{name}.png'
    bpy.ops.render.render(write_still=True); print('rendered',name)
if VARIANT=='A': bpy.ops.wm.save_as_mainfile(filepath='/tmp/g2/KFB_CARD_SURF_GATE2A_card_only.blend')
