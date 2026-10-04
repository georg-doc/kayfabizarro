import bpy, sys, math, numpy as np, os
from mathutils import Vector, Matrix
a=sys.argv[sys.argv.index('--')+1:]; out=a[0]; frames=[int(x) for x in a[1].split(',')] if a[1]!='all' else None; view=a[2]; W,H=int(a[3]),int(a[4]); step=int(a[5]) if len(a)>5 else 1
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_joyride.blend')
sc=bpy.context.scene
try: sc.render.engine='BLENDER_EEVEE_NEXT'
except Exception: sc.render.engine='BLENDER_EEVEE'
sc.eevee.taa_render_samples=4
for at_ in ('use_raytracing','use_gtao','use_shadows'):
    try: setattr(sc.eevee,at_,False)
    except Exception: pass
sc.render.resolution_x=W; sc.render.resolution_y=H; w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.62,0.72,0.85,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.7
sun=bpy.data.objects.new('sun',bpy.data.lights.new('sun','SUN')); sc.collection.objects.link(sun); sun.data.energy=3.2; sun.rotation_euler=(math.radians(38),0,math.radians(-30))
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
for m in bpy.data.materials:
    if m.use_nodes and m.node_tree:
        bs=[n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED']
        if bs: c=bs[0].inputs['Base Color'].default_value; m.diffuse_color=(c[0],c[1],c[2],bs[0].inputs['Alpha'].default_value)
for o in bpy.data.objects:
    if o.type=='MESH' and o.name.startswith(('Icosphere','Grid')): o.hide_render=True
mm=bpy.data.materials.get('FB_Mouth')
if mm:
    for attr,val in (('blend_method','CLIP'),('surface_render_method','DITHERED')):
        try: setattr(mm,attr,val)
        except Exception as e: print('ATTR',attr,e)
    try: mm.alpha_threshold=0.5
    except Exception: pass
# ground + road ribbon along the same ellipse/hump
def mat(n,c):
    m=bpy.data.materials.new(n); m.use_nodes=True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*c,1); m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.9; return m
bpy.ops.mesh.primitive_plane_add(size=120,location=(0,0,-0.02)); bpy.context.object.data.materials.append(mat('grass',(0.36,0.55,0.25)))
Aax,Bax=24.0,16.0; N=400; verts=[];faces=[]
for i in range(N):
    t=2*math.pi*i/N; x,y=Aax*math.cos(t),Bax*math.sin(t); z=0.9*math.exp(-((((t-math.pi*1.5+math.pi)%(2*math.pi))-math.pi)/0.28)**2)
    tx,ty=-Aax*math.sin(t),Bax*math.cos(t); l=math.hypot(tx,ty); nx,ny=ty/l,-tx/l
    verts+= [(x+nx*3.2,y+ny*3.2,z),(x-nx*3.2,y-ny*3.2,z)]
for i in range(N):
    j=(i+1)%N; faces.append((2*i,2*i+1,2*j+1,2*j))
me=bpy.data.meshes.new('road'); me.from_pydata(verts,[],faces); ro=bpy.data.objects.new('road',me); sc.collection.objects.link(ro); me.materials.append(mat('asphalt',(0.35,0.35,0.37)))
rig=bpy.data.objects['CarRig']
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=32
if view=='chase':
    cam.parent=rig; t=Vector((-0.6,0.8,1.2)); cam.location=Vector((-6.5,-8.5,4.2)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(t-cam.location).to_track_quat('-Z','Y')
elif view=='face':
    bpy.data.objects['WIndowFront.2'].hide_render=True   # windscreen glass hidden for this camera only
    cam.parent=rig; t=Vector((-0.75,0.0,1.45)); cam.location=Vector((1.2,6.2,2.9)); cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(t-cam.location).to_track_quat('-Z','Y')
elif view=='wide':
    cam.location=Vector((0,-52,30)); cam.data.lens=28; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y')
fr=frames or list(range(1,sc.frame_end+1,step))
if frames:
    tiles=[]
    for f in fr:
        sc.frame_set(f); p='/tmp/fbcar/_j.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(H,W,4)); bpy.data.images.remove(im)
    full=np.concatenate(tiles,axis=1); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=out; img.file_format='PNG'; img.save()
else:
    os.makedirs(out,exist_ok=True)
    for f in fr:
        if os.path.exists(f'{out}/f{f:04d}.png'): continue
        sc.frame_set(f); sc.render.filepath=f'{out}/f{f:04d}.png'; bpy.ops.render.render(write_still=True)
