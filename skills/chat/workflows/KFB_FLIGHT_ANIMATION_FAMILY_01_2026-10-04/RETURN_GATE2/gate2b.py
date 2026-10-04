import bpy, bmesh, math, sys, json, os
from mathutils import Vector, Quaternion, Matrix, Euler
MODE=sys.argv[1]
BLEND='/tmp/g2b/KFB_CARD_SURF_REVIEW_RIG.blend'
def hexlin(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    return [x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]+[1]
if MODE=='build':
    sim=json.load(open('/tmp/g2b/sim.json')); G=sim['grid']; FR=sim['frames']; BASES=sim['bases']
    CW,CD,TH,SEGX,SEGZ=G['CW'],G['CD'],G['TH'],G['SEGX'],G['SEGZ']
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc=bpy.context.scene; sc.render.fps=30; sc.frame_start=0; sc.frame_end=len(FR)-1
    def empty(name,parent=None):
        o=bpy.data.objects.new(name,None); sc.collection.objects.link(o); o.parent=parent; o.empty_display_size=0.3; return o
    STAGE=empty('REVIEW_STAGE_YUP'); STAGE.rotation_euler=(math.radians(90),0,0)
    ROOT=empty('CARD_WORLD_ROOT',STAGE); ROOT.rotation_mode='QUATERNION'
    VIS=empty('CARD_VISUAL',ROOT); VIS.rotation_mode='ZYX'
    # materials
    img=bpy.data.images.load('/tmp/g2/KFB_CARD_BACKSIDE_INK_BAND_4242_optB_edge.png'); img.pack()
    def texmat(name,unlit):
        m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree; b=nt.nodes['Principled BSDF']
        t=nt.nodes.new('ShaderNodeTexImage'); t.image=img
        b.inputs['Roughness'].default_value=0.9; b.inputs['Specular IOR Level'].default_value=0.2
        if unlit: b.inputs['Base Color'].default_value=(0,0,0,1); nt.links.new(t.outputs['Color'],b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value=1
        else: nt.links.new(t.outputs['Color'],b.inputs['Base Color'])
        nt.nodes.active=t; return m
    mTop=texmat('CARD_TOP_face_lit',False); mBot=texmat('CARD_BOTTOM_back_unlit',True)
    mSide=bpy.data.materials.new('CARD_SIDE_ink_1f1a14'); mSide.use_nodes=True; bs=mSide.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value=hexlin('#1f1a14'); bs.inputs['Roughness'].default_value=0.92; bs.inputs['Specular IOR Level'].default_value=0.2; mSide.diffuse_color=hexlin('#1f1a14')
    # slab in Travel (three.js) coordinates
    bm=bmesh.new(); uv=bm.loops.layers.uv.new('UVMap'); nx=SEGX+1
    def grid(y):
        vs=[]
        for iy in range(SEGZ+1):
            for ix in range(nx):
                vs.append((bm.verts.new((-CW/2+ix*CW/SEGX, y, -CD/2+iy*CD/SEGZ)), ix/SEGX, 1-iy/SEGZ))
        return vs
    T=grid(0.0); B=grid(-TH)
    def face(vs,idx,mat):
        q=[vs[i] for i in idx]; f=bm.faces.new([a[0] for a in q]); f.material_index=mat
        for l,a in zip(f.loops,q): l[uv].uv=(a[1],a[2])
    for iy in range(SEGZ):
        for ix in range(SEGX):
            a=iy*nx+ix; b=a+1; c=a+nx+1; d=a+nx
            face(T,[a,d,c,b],0); face(B,[a,b,c,d],1)
    perim=[ix for ix in range(SEGX)]+[iy*nx+SEGX for iy in range(SEGZ)]+[SEGZ*nx+ix for ix in range(SEGX,0,-1)]+[iy*nx for iy in range(SEGZ,0,-1)]
    for i in range(len(perim)):
        p,q=perim[i],perim[(i+1)%len(perim)]; f=bm.faces.new([T[p][0],T[q][0],B[q][0],B[p][0]]); f.material_index=2
    me=bpy.data.meshes.new('CARD_SURFACE'); bm.to_mesh(me); bm.free()
    for m in (mTop,mBot,mSide): me.materials.append(m)
    CARD=bpy.data.objects.new('CARD_SURFACE',me); sc.collection.objects.link(CARD); CARD.parent=VIS
    bpy.context.view_layer.objects.active=CARD; CARD.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    # shape keys: SOURCE_NEUTRAL basis + linear Travel deformation terms (top and bottom get the same dy -> one slab)
    CARD.shape_key_add(name='SOURCE_NEUTRAL')
    nv=(SEGX+1)*(SEGZ+1)
    keys={}
    for k,base in BASES.items():
        sk=CARD.shape_key_add(name='TRAVEL_'+k,from_mix=False); sk.slider_min=-5; sk.slider_max=5
        for iy in range(SEGZ+1):
            for ix in range(nx):
                dy=base[iy][ix]; i=iy*nx+ix
                for j in (i,i+nv):
                    co=me.vertices[j].co; sk.data[j].co=(co.x,co.y+dy,co.z)
        keys[k]=sk
    SEAT=empty('SEAT_FRAME',VIS); SEAT.rotation_mode='QUATERNION'
    MR=empty('MANNEQUIN_ROOT',SEAT); MR.rotation_mode='QUATERNION'
    MR.rotation_quaternion=Quaternion((0,1,0),math.pi)@Quaternion((1,0,0),-math.pi/2)
    # keyframes
    for f,F in enumerate(FR):
        p,b,r=[math.radians(v) for v in F['root']]
        ROOT.rotation_quaternion=Quaternion((1,0,0),p)@Quaternion((0,0,1),b)@Quaternion((0,0,1),r); ROOT.keyframe_insert('rotation_quaternion',frame=f)
        VIS.rotation_euler=F['lean']; VIS.location=(0,F['leanY'],0); VIS.keyframe_insert('rotation_euler',frame=f); VIS.keyframe_insert('location',frame=f)
        for k,sk in keys.items(): sk.value=F['coef'][k]; sk.keyframe_insert('value',frame=f)
        SEAT.location=F['seat']; q=F['seatQ']; SEAT.rotation_quaternion=(q[3],q[0],q[1],q[2])
        SEAT.keyframe_insert('location',frame=f); SEAT.keyframe_insert('rotation_quaternion',frame=f)
    # state markers
    for nm,a,b in sim['marks']: sc.timeline_markers.new(nm,frame=a)
    # rider
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath='/tmp/g2b/KFB_CARD_SURF_RIDER_Mannequin.glb',loglevel=50)
    new=[o for o in bpy.data.objects if o not in before]
    for o in new:
        if o.parent is None: o.parent=MR; o.matrix_parent_inverse=Matrix.Identity(4)
    arm=[o for o in new if o.type=='ARMATURE'][0]; arm.name='MANNEQUIN_ARMATURE'
    acts={a.name:a for a in bpy.data.actions}
    a=[v for k,v in acts.items() if k.startswith('CARD_SURF_REVIEW')][0]
    arm.animation_data_create(); arm.animation_data.action=a
    if a.slots: arm.animation_data.action_slot=a.slots[0]
    for ac in bpy.data.actions: ac.use_fake_user=True
    for fc in [c for o in (ROOT,VIS,SEAT) for c in o.animation_data.action.fcurves] if hasattr(ROOT.animation_data.action,'fcurves') else []:
        for kp in fc.keyframe_points: kp.interpolation='LINEAR'
    # world/light/cams
    w=bpy.data.worlds.new('W'); sc.world=w; w.color=hexlin('#9fc7e8')[:3]
    sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_specular_highlight=False
    sc.view_settings.view_transform='Standard'
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print('built',len(FR))
else:
    # render: MODE=render <variant deform|rider> <f0> <f1>
    var,f0,f1=sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
    bpy.ops.wm.open_mainfile(filepath=BLEND); sc=bpy.context.scene
    rider=[o for o in sc.objects if o.name.startswith('Mannequin_Medium') or o.name=='MANNEQUIN_ARMATURE']
    for o in rider: o.hide_render=(var=='deform')
    cam=bpy.data.objects.new('CAM',bpy.data.cameras.new('CAM')); sc.collection.objects.link(cam); sc.camera=cam
    sc.render.resolution_x=640; sc.render.resolution_y=420
    if var=='deform': tz=0.0; V=[('front',(0,6.4,1.6),35),('q34',(4.6,4.6,2.6),35),('side',(6.6,0,0.35),35)]
    else: tz=0.9; V=[('front',(0,8.0,2.4),35),('q34',(6.0,6.0,3.4),35),('side',(8.2,0,1.6),35)]
    os.makedirs(f'/tmp/g2b/fr_{var}',exist_ok=True)
    for f in range(f0,f1):
        sc.frame_set(f)
        VV=V
        if var=='rider' and 810<=f<918: VV=[(n,(l[0]*1.25,l[1]*1.25,l[2]*0.5),lens) for n,l,lens in V]; tz=0.0
        elif var=='rider': tz=0.9
        for nm,loc,lens in VV:
            cam.data.lens=lens; cam.location=loc; d=Vector((0,0,tz))-Vector(loc); cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
            sc.render.filepath=f'/tmp/g2b/fr_{var}/{nm}_{f:04d}.png'; bpy.ops.render.render(write_still=True)
    print('done',var,f0,f1)
