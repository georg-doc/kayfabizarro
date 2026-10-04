exec(open('/tmp/veh/fit.py').read().split("for car in CARS:")[0])
import itertools
SH=[0.65,0.25,0.10]
res=[]
for car,k in (('sedan',1.5),('sedan',1.6),('hatchback',1.8),('estate',1.4),('transporter',1.3),('truck',1.5)):
    for o in list(bpy.data.objects):
        if o.get('kfbcar'): bpy.data.objects.remove(o)
    before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/glb/{car}.glb'); new=[o for o in bpy.data.objects if o not in before]
    for o in new: o['kfbcar']=1
    root=[o for o in new if o.parent is None and o.name.startswith('RootNode')][0]; root.scale=(k,k,k); bpy.context.view_layer.update()
    meshes=[o for o in new if o.type=='MESH' and not o.name.startswith('Icosphere')]
    sw=[o for o in new if o.name.startswith('SteeringWheel')]; swx=sw[0].matrix_world.translation.x
    seats=[o for o in meshes if o.name.startswith('Seat') and 'Rear' not in o.name]; drv=min(seats,key=lambda o:abs(o.matrix_world.translation.x-swx))
    bb=[drv.matrix_world@Vector(c) for c in drv.bound_box]; lo=Vector(map(min,*bb)); hi=Vector(map(max,*bb))
    st=BVHTree.FromBMesh(bm_world([drv])); px,py=(lo.x+hi.x)/2,(lo.y+hi.y)/2+0.12*k
    cz=st.ray_cast(Vector((px,py,hi.z+1)),Vector((0,0,-1)))[0].z
    place('frizzlebob',(px,py),cz,k)
    cab=bm_world([o for o in meshes if o.name.startswith(('CarMesh','Top','Interior','Door','Window','WIndow','Glass'))]); ct=BVHTree.FromBMesh(cab)
    head=bm_world([o for o in kids(FB) if 'Head' in o.name]); ht=BVHTree.FromBMesh(head)
    earobjs=[o for o in kids(FB) if EARS(o)]
    for pitch,roll in itertools.product((0,-30,-45,-60,-75),(0,30,45,60)):
        for s,side in ((1,'l'),(-1,'r')):
            for j in range(3):
                FB.pose.bones[f'ear.{side}.{j+1}'].rotation_quaternion=Euler((math.radians(pitch*SH[j]),0,math.radians(s*roll*SH[j]))).to_quaternion()
        bpy.context.view_layer.update()
        eb=bm_world(earobjs); hitsCar=len(BVHTree.FromBMesh(eb).overlap(ct)); hitsHead=len(BVHTree.FromBMesh(eb).overlap(ht)); eb.free()
        res.append((car,k,pitch,roll,hitsCar,hitsHead))
    for side in 'lr':
        for j in range(3): FB.pose.bones[f'ear.{side}.{j+1}'].rotation_quaternion=(1,0,0,0)
    ok=[r for r in res if r[0]==car and r[1]==k and r[4]==0]
    print(car,k,'clean ear poses (pitch,roll, headHits):',[(r[2],r[3],r[5]) for r in ok][:12],flush=True)
json.dump(res,open('/tmp/veh/earfold.json','w'))
