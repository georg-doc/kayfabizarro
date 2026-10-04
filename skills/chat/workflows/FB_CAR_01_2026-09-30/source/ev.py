import bpy, sys, numpy as np, math
from mathutils import Vector
a=sys.argv[sys.argv.index('--')+1:]; blend,out,views=a[0],a[1],a[3].split(',')
import os
frames=[int(x) for x in a[2].split(',')] if a[2]!='all' else None
W,H=(int(a[4]),int(a[5])) if len(a)>5 else (480,400)
bpy.ops.wm.open_mainfile(filepath=blend)
sc=bpy.context.scene
try: sc.render.engine='BLENDER_EEVEE_NEXT'
except Exception: sc.render.engine='BLENDER_EEVEE'
sc.eevee.taa_render_samples=4
for at_ in ('use_raytracing','use_gtao','use_shadows'):
    try: setattr(sc.eevee,at_,False)
    except Exception: pass
sc.render.resolution_x=W; sc.render.resolution_y=H; sc.render.film_transparent=False
ims=sc.render.image_settings
if hasattr(ims,'media_type'): ims.media_type='IMAGE'
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']; bg.inputs[0].default_value=(0.85,0.87,0.9,1); bg.inputs[1].default_value=0.9
sun=bpy.data.objects.new('sun',bpy.data.lights.new('sun','SUN')); sc.collection.objects.link(sun); sun.data.energy=3.5; sun.rotation_euler=(math.radians(40),0,math.radians(-35))
for o in bpy.data.objects:
    if o.type=='MESH' and o.name.startswith(('Icosphere','Grid')): o.hide_render=True
wz=min((o.matrix_world@Vector(c)).z for o in bpy.data.objects if o.type=='MESH' and o.name.startswith('Wheel') for c in o.bound_box)
bpy.ops.mesh.primitive_plane_add(size=30,location=(-1,0,wz)); g=bpy.context.object; gm=bpy.data.materials.new('g'); gm.use_nodes=True; gm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.45,0.5,0.4,1); g.data.materials.append(gm)
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=35
V={'side':(Vector((-8.5,0.0,1.6)),Vector((-1.2,0,0.3))),'q':(Vector((-6.0,6.0,2.8)),Vector((-0.8,0,0.4))),'face':(Vector((-0.9,4.2,1.0)),Vector((-0.68,0,0.9))),'dclose':(Vector((-5.2,-2.4,1.2)),Vector((-1.2,0,0.3))),'hop':(Vector((-7.0,4.8,2.4)),Vector((-1.3,0,0.4)))}
if frames is None:
    os.makedirs(out,exist_ok=True); off,t=V[views[0]]
    cam.location=t+off; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(t-cam.location).to_track_quat('-Z','Y')
    for f in range(sc.frame_start,sc.frame_end+1):
        if os.path.exists(f'{out}/f{f:04d}.png'): continue
        sc.frame_set(f); sc.render.filepath=f'{out}/f{f:04d}.png'; bpy.ops.render.render(write_still=True)
    raise SystemExit
rows=[]
for v in views:
    off,t=V[v]; tiles=[]
    for f in frames:
        sc.frame_set(f); cam.location=t+off; cam.rotation_mode='QUATERNION'; cam.rotation_quaternion=(t-cam.location).to_track_quat('-Z','Y')
        p='/tmp/fbcar/_e.png'; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
        im=bpy.data.images.load(p,check_existing=False); tiles.append(np.array(im.pixels[:],dtype=np.float32).reshape(H,W,4)); bpy.data.images.remove(im)
    rows.append(np.concatenate(tiles,axis=1))
full=np.concatenate(rows[::-1],axis=0); img=bpy.data.images.new('s',full.shape[1],full.shape[0]); img.pixels.foreach_set(full.ravel()); img.filepath_raw=out; img.file_format='PNG'; img.save()
