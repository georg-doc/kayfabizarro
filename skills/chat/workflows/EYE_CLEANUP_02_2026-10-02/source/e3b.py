import bpy, math, json, os, glob
from mathutils import Vector
ins=json.load(open('/tmp/eye2/work/inspect.json'))
lst=dict(l.split('\t') for l in open('/tmp/eye2/src/list.tsv').read().strip().split('\n'))
SRC='/tmp/eye2/src'
jobs=[]
for fid in ins:
  sp=next(x for x in (f'{SRC}/g_{fid}/{fid}.gltf',f'{SRC}/{fid}.glb') if os.path.exists(x))
  jobs.append((fid,'before',sp))
  cj=f'/tmp/eye2/work/clean_{fid}.json'
  if os.path.exists(cj): jobs.append((fid,'after',json.load(open(cj))['out']))
jobs=[j for j in jobs if not os.path.exists(f'/tmp/eye2/work/rend/{j[0]}_{j[1]}_34.png')]
for fid,tag,path in jobs:
  bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=path)
  sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x=600; sc.render.resolution_y=600; sc.eevee.taa_render_samples=16; sc.view_settings.view_transform='Standard'
  w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.62,0.66,0.7,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.55
  sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=2.6; sun.rotation_euler=(math.radians(55),0,math.radians(-25)); sc.collection.objects.link(sun)
  for o in sc.objects:
    if o.type=='EMPTY' or o.name=='Icosphere': o.hide_render=True
  hc=ins[fid].get('head_c'); hs=ins[fid].get('head_size')
  c=Vector(hc); r=max(hs)
  cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=85
  for view,az,el in (('front',0,4),('34',35,8)):
    a=math.radians(az); e=math.radians(el); d=r*2.1
    cam.location=c+Vector((math.sin(a)*math.cos(e)*d,-math.cos(a)*math.cos(e)*d,math.sin(e)*d)); cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=f'/tmp/eye2/work/rend/{fid}_{tag}_{view}.png'; bpy.ops.render.render(write_still=True)
  print('R',fid,tag,flush=True)
