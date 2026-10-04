# Render the Cartoon Vehicles Pack 1 cars at their fit scale with a KayKit Medium driver (Orc Raider) and FrizzleBob as passenger
# (ears folded back+out for closed roofs, up for the cabrio). Flat KFB colours per part name, tinted glass.
exec(open('/tmp/veh/fit.py').read().split("for car in CARS:")[0])
import os
FIT=json.load(open('/tmp/veh/fit.json'))
PAL={'sedan':(0.93,0.55,0.18),'hatchback':(0.95,0.78,0.22),'estate':(0.36,0.30,0.72),'cabrio':(0.85,0.25,0.20),'sportster':(0.90,0.35,0.15),
     'pickup':(0.45,0.62,0.30),'transporter':(0.55,0.40,0.70),'truck':(0.95,0.55,0.45)}
def mat(n,rgb,a=1.0):
    m=bpy.data.materials.get(n) or bpy.data.materials.new(n); m.diffuse_color=(*rgb,a); m.roughness=0.7
    try: m.surface_render_method='BLENDED' if a<1 else 'DITHERED'
    except Exception: pass
    return m
def paint(objs,car):
    body=mat('car_'+car,PAL[car]); glass=mat('glass',(0.35,0.45,0.55),0.35); dark=mat('interior',(0.22,0.16,0.14)); tire=mat('tire',(0.08,0.08,0.08))
    rim=mat('rim',(0.85,0.85,0.85)); chrome=mat('chrome',(0.7,0.72,0.75)); lamp=mat('lamp',(1,0.95,0.7)); rear=mat('rearlamp',(0.8,0.1,0.1))
    for o in objs:
        n=o.name
        m=(glass if n.startswith(('Window','WIndow','Glass','Mirror')) and 'Case' not in n and 'Holder' not in n and 'Interior' not in n
           else tire if n.startswith('Wheel') else chrome if n.startswith(('Bumper','Grille','Handle','Wiper','Light'+'Front','LightRear','MirrorCase','MirrorHolder','Exhaust','Antenna'))
           else dark if n.startswith(('Interior','Seat','Dash','InstrC','GearLever','Brake','Clutch','Gas','Steering','Torus','EngineBay','TrunkInter','Top')) else body)
        if n.startswith('Light') and 'Frame' not in n: m=lamp
        o.data.materials.clear(); o.data.materials.append(m)
sc=bpy.context.scene; sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=True
try: sh.show_xray=False
except Exception: pass
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam
sc.render.resolution_x=520; sc.render.resolution_y=400; sc.render.film_transparent=False
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
ims.file_format='PNG'
world=bpy.data.worlds.new('w'); sc.world=world; world.color=(0.93,0.93,0.9)
def shot(tgt,off,lens=35):
    cam.data.lens=lens; cam.location=tgt+off; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(tgt-cam.location).to_track_quat('-Z','Y')
    p='/tmp/veh/_t.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(p,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
SH=[0.65,0.25,0.10]
def ears(pitch,roll):
    for s,side in ((1,'l'),(-1,'r')):
        for j in range(3): FB.pose.bones[f'ear.{side}.{j+1}'].rotation_quaternion=Euler((math.radians(pitch*SH[j]),0,math.radians(s*roll*SH[j]))).to_quaternion()
    bpy.context.view_layer.update()
def place_at(A,tag,seat_obj,k,fwd=0.12):
    st=BVHTree.FromBMesh(bm_world([seat_obj])); bb=[seat_obj.matrix_world@Vector(c) for c in seat_obj.bound_box]; lo=Vector(map(min,*bb)); hi=Vector(map(max,*bb))
    px,py=(lo.x+hi.x)/2,(lo.y+hi.y)/2+fwd*k; h=st.ray_cast(Vector((px,py,hi.z+1)),Vector((0,0,-1)))[0]; cz=h.z if h else lo.z+0.4*(hi.z-lo.z)
    place(tag,(px,py),cz,k)
for o in kids(RA):
    o.hide_render=False; o.hide_viewport=False
    for m in o.data.materials:
        if m: m.diffuse_color=(0.42,0.62,0.36,1)
fbm=mat('fb_yellow',(0xf2/255,0xc9/255,0x3c/255))
for o in kids(FB):
    if o.name in ('FB_Eye_L','FB_Eye_R'): continue
    for i in range(len(o.data.materials)): o.data.materials[i]=fbm
for n in ('FB_Mouth_Smile','Grid'):
    if n in bpy.data.objects: bpy.data.objects[n].hide_render=True
tiles=[]; cut=[]; REP={}
for car in CARS:
    for o in list(bpy.data.objects):
        if o.get('kfbcar'): bpy.data.objects.remove(o)
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/glb/{car}.glb'); new=[o for o in bpy.data.objects if o not in before]
    for o in new: o['kfbcar']=1
    ico=[o for o in new if o.name.startswith('Icosphere')]; new=[o for o in new if o not in ico]
    for o in ico: bpy.data.objects.remove(o)
    f=FIT['cars'][car]; ks=[f[t].get('fit',f[t].get('last'))['carScale'] for t in ('kaykit_raider','frizzlebob')]; k=max(ks)
    REP[car]=k
    root=[o for o in new if o.parent is None and o.name.startswith('RootNode')][0]; root.scale=(k,k,k); bpy.context.view_layer.update()
    meshes=[o for o in new if o.type=='MESH']; paint(meshes,car)
    if car=='cabrio':
        for o in new:
            if o.name.startswith(('Top','Glass')): o.hide_render=True
    sw=[o for o in new if o.name.startswith('SteeringWheel')]; swx=sw[0].matrix_world.translation.x
    seats=[o for o in meshes if o.name.startswith('Seat') and 'Rear' not in o.name]
    drv=min(seats,key=lambda o:abs(o.matrix_world.translation.x-swx)); pas=[s for s in seats if s!=drv]
    place_at(RA,'kaykit_raider',drv,k)
    if pas: place_at(FB,'frizzlebob',pas[0],k); ears(0,0) if car=='cabrio' else ears(-75,45)
    else: FB.matrix_world=Matrix.Translation((50,0,0))
    # paint chars
    for o in kids(RA): pass
    bb=[root.matrix_world@Vector(c) for o in meshes for c in [o.matrix_world@Vector(v) for v in o.bound_box]]
    c=Vector((0,0,0.9*k))
    tiles.append(shot(c,Vector((-3.3*k,3.8*k,1.9*k))))
    # cutaway: hide the near (left) doors, windows and body shell sides are kept; camera from the left side
    hid=[]
    for o in meshes:
        if o.name.startswith(('DoorFL','DoorRL','DoorL','Window','WIndow','Glass')) or (o.parent and o.parent.name.startswith(('DoorFL','DoorRL','DoorL'))):
            if not o.hide_render: o.hide_render=True; hid.append(o)
    cut.append(shot(c,Vector((-4.6*k,0.3*k,0.8*k))))
    for o in hid: o.hide_render=False
    print(car,'scale',k,flush=True)
def save(rows,path):
    full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=path; img.file_format='PNG'; img.save()
save([np.concatenate(tiles[:4],axis=1),np.concatenate(tiles[4:],axis=1)],'/tmp/veh/cars_3q.png')
save([np.concatenate(cut[:4],axis=1),np.concatenate(cut[4:],axis=1)],'/tmp/veh/cars_cutaway.png')
json.dump(REP,open('/tmp/veh/scales.json','w'))
