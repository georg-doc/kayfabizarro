import bpy, math, numpy as np, json
from mathutils import Vector, Matrix
def fam(o):
    out=[o]; st=[o]
    while st:
        x=st.pop()
        for c in x.children: out.append(c); st.append(c)
    return [m for m in out if m.type=='MESH']
def ctr(objs):
    pts=[o.matrix_world@Vector(c) for o in objs for c in o.bound_box]; return sum(pts,Vector())/len(pts)
def rot_world(o,axis,deg):
    p=o.matrix_world.translation.copy(); R=Matrix.Translation(p)@Matrix.Rotation(math.radians(deg),4,axis)@Matrix.Translation(-p)
    o.matrix_world=R@o.matrix_world
H={}; tiles=[]
def shot(cam,sc,tgt,off):
    cam.location=tgt+off; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(tgt-cam.location).to_track_quat('-Z','Y')
    pth='/tmp/veh/_d.png'; sc.render.filepath=pth; bpy.ops.render.render(write_still=True)
    im=bpy.data.images.load(pth,check_existing=False); a=np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4); bpy.data.images.remove(im); return a
CARS=('sedan','hatchback','estate','cabrio','sportster','pickup','transporter','truck')
for car in CARS+('transporterWindow',):
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=f'/tmp/veh/kfb_glb/KFB_CVP1_{car}.glb')
    _cm=[o for o in bpy.data.objects if o.type=='MESH' and o.name.startswith('CarMesh')] or [o for o in bpy.data.objects if o.type=='MESH']
    bc=ctr(_cm)
    res={}; parts=[o for o in bpy.data.objects if o.type=='MESH' and '.' not in o.name and o.name.startswith(('Door','Hood','Trunk')) and o.name!='TrunkInter']
    for o in parts:
        n=o.name; c0=ctr(fam(o)); M0=o.matrix_world.copy(); best=None
        ax='Z' if n.startswith('Door') else 'X'     # Blender world: Z up, X lateral, +Y forward
        for sg in (1,-1):
            rot_world(o,ax,sg*60); bpy.context.view_layer.update(); d=ctr(fam(o))-c0
            score=(d.x*math.copysign(1,c0.x-bc.x)-(d.y if 'Back' in n else 0)) if n.startswith('Door') else d.z
            if best is None or score>best[0]: best=(score,sg,d.length)
            o.matrix_world=M0; bpy.context.view_layer.update()
        piv=o.matrix_world.translation
        res[n]={'hinge':('up' if ax=='Z' else 'side'),'openSignBlender':best[1],'openSignThree':best[1],'pivotBlender':[round(x,3) for x in piv],'travelAt60M':round(best[2],3),'opens':best[0]>0.05}
    H[car]=res
    if car in CARS:
        for o in parts:
            r=res[o.name]; rot_world(o,'Z' if r['hinge']=='up' else 'X', r['openSignBlender']*(100 if 'Back' in o.name else 65 if o.name.startswith('Door') else 50))
        bpy.context.view_layer.update()
        sc=bpy.context.scene; sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='MATERIAL'; sh.show_cavity=True
        sc.render.resolution_x=420; sc.render.resolution_y=320; w=bpy.data.worlds.new('w'); sc.world=w; w.color=(0.93,0.93,0.9)
        ims=sc.render.image_settings
        if hasattr(ims,'media_type'): ims.media_type='IMAGE'
        cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=28
        tiles.append(shot(cam,sc,Vector((0,0.2,0.5)),Vector((-4.0,4.4,2.3)))); tiles.append(shot(cam,sc,Vector((0,-0.3,0.5)),Vector((4.2,-4.8,2.3))))
    print(car,{k:(v['hinge'],v['openSignBlender'],v['travelAt60M'],v['opens']) for k,v in res.items()},flush=True)
json.dump(H,open('/tmp/veh/hinges.json','w'),indent=1)
rows=[np.concatenate(tiles[i:i+4],axis=1) for i in range(0,16,4)]
full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw='/tmp/veh/cars_doors_open.png'; img.file_format='PNG'; img.save()
