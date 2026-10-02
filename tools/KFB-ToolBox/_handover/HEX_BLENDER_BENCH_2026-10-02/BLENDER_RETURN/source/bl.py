import bpy, math, json
from mathutils import Vector
R='/tmp/hex/repo/'
M=json.load(open(R+'tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/data/HEX_BROWSER_MEASUREMENTS.json'))
PATH={r['key']:r['path'] for r in M['hexTiles']['inventory']}
W3=2.0; H3=2.309401
def reset(res=(800,600),bg=(0.80,0.83,0.86)):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x,sc.render.resolution_y=res
    sc.eevee.taa_render_samples=16; sc.view_settings.view_transform='Standard'
    w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True
    bgn=w.node_tree.nodes['Background']; bgn.inputs[0].default_value=(*bg,1); bgn.inputs[1].default_value=0.6
    sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=2.8; sun.data.angle=math.radians(8)
    sun.rotation_euler=(math.radians(50),0,math.radians(-35)); sc.collection.objects.link(sun)
    return sc
def three2bl(x,y,z): return Vector((x,-z,y))
def cell_xy(col,row):  # odd-r, three coords -> blender
    x=col*W3+(W3/2 if row&1 else 0); z=row*H3*0.75
    return three2bl(x,0,z)
def place(key,loc=Vector(),rot_deg=0.0,name=None,coll=None):
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=R+PATH[key],loglevel=50)
    new=[o for o in bpy.data.objects if o not in before]
    roots=[o for o in new if o.parent is None]
    for o in roots:
        o.location=loc; o.rotation_mode='XYZ'; o.rotation_euler=(0,0,math.radians(rot_deg))
        o['kfb_key']=key; o['kfb_rot']=rot_deg
        if name: o.name=name
    for o in new:
        if o.type=='MESH':
            for sl in o.material_slots:
                m=sl.material
                if m and '.' in m.name and m.name.rsplit('.',1)[1].isdigit():
                    base=bpy.data.materials.get(m.name.rsplit('.',1)[0])
                    if base: sl.material=base
    if coll:
        for o in new:
            for c in list(o.users_collection): c.objects.unlink(o)
            coll.objects.link(o)
    return roots,new
def bbox(objs):
    mn=Vector((1e9,)*3); mx=Vector((-1e9,)*3)
    for o in objs:
        if o.type!='MESH' or o.hide_render: continue
        for c in o.bound_box:
            w=o.matrix_world@Vector(c); mn=Vector(map(min,mn,w)); mx=Vector(map(max,mx,w))
    return mn,mx
def camera(objs,az=35,el=30,lens=50,margin=1.15,ortho=False,target=None):
    sc=bpy.context.scene
    cam=sc.camera or bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam'))
    if cam.name not in sc.collection.objects: sc.collection.objects.link(cam)
    sc.camera=cam
    mn,mx=bbox(objs); c=(mn+mx)/2 if target is None else target; r=(mx-mn).length/2*margin
    a=math.radians(az); e=math.radians(el)
    dirv=Vector((math.sin(a)*math.cos(e),-math.cos(a)*math.cos(e),math.sin(e)))
    if ortho:
        cam.data.type='ORTHO'; cam.data.ortho_scale=2*r; d=r*4
    else:
        cam.data.type='PERSP'; cam.data.lens=lens; fov=2*math.atan(18/lens); d=r/math.sin(fov/2)
    cam.location=c+dirv*d; cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
    cam.data.clip_end=d*4; cam.data.clip_start=0.01
    return cam
def label(text,loc,size=0.18,color=(0.9,0.1,0.1)):
    cu=bpy.data.curves.new('L','FONT'); cu.body=text; cu.size=size; cu.align_x='CENTER'; cu.align_y='CENTER'
    o=bpy.data.objects.new('lbl_'+text,cu); o.location=loc; bpy.context.scene.collection.objects.link(o)
    m=bpy.data.materials.new('lbl'); m.use_nodes=True
    bs=m.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Emission Color'].default_value=(*color,1); bs.inputs['Emission Strength'].default_value=1.0
    cu.materials.append(m); return o
def edge_labels(center=Vector(),z=0.02,r=0.8):
    for i in range(6):
        a=math.radians(60*i)  # three atan2(z,x)
        label(str(i),center+three2bl(math.cos(a)*r,0,math.sin(a)*r)+Vector((0,0,z)))
def render(path):
    bpy.context.scene.render.filepath=path; bpy.ops.render.render(write_still=True)
