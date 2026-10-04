import bpy, bmesh, json, math, sys
from mathutils import Vector
import numpy as np
FIG=sys.argv[sys.argv.index('--')+1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=f'/tmp/eye/src/{FIG}.glb')
arm=[o for o in bpy.context.scene.objects if o.type=='ARMATURE'][0]
head=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.endswith('_Head')][0]
img=None
for m in head.data.materials:
  for n in m.node_tree.nodes:
    if n.type=='TEX_IMAGE': img=n.image
W,H=img.size; px=np.array(img.pixels[:],dtype=np.float32).reshape(H,W,4)
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
me=head.data
bm=bmesh.new(); bm.from_mesh(me)
uvl=bm.loops.layers.uv.active
# weld by position for connectivity
key={}; 
def k(v): return tuple(round(c,5) for c in (head.matrix_world@v.co))
parent=list(range(len(bm.verts)))
def find(a):
  while parent[a]!=a: parent[a]=parent[parent[a]]; a=parent[a]
  return a
def union(a,b): parent[find(a)]=find(b)
for v in bm.verts:
  kk=k(v)
  if kk in key: union(v.index,key[kk])
  else: key[kk]=v.index
for e in bm.edges: union(e.verts[0].index,e.verts[1].index)
comps={}
for f in bm.faces: comps.setdefault(find(f.verts[0].index),[]).append(f)
res=[]
for cid,faces in comps.items():
  vs={v for f in faces for v in f.verts}
  P=np.array([list(head.matrix_world@v.co) for v in vs]); c=P.mean(0); sz=P.max(0)-P.min(0)
  n=Vector((0,0,0)); area=0
  for f in faces: n+= (head.matrix_world.to_3x3()@f.normal)*f.calc_area(); area+=f.calc_area()
  cols=[]; uvs=[]
  for f in faces:
    for l in f.loops:
      u,v=l[uvl].uv; uvs.append((u,v)); x=min(W-1,max(0,int(u*W))); y=min(H-1,max(0,int(v*H))); cols.append(px[y,x,:3])
  cols=np.array(cols); U=np.array(uvs)
  res.append(dict(faces=len(faces),verts=len(vs),center=[round(x,4) for x in c],size=[round(x,4) for x in sz],area=round(area,5),normal=[round(x,3) for x in n.normalized()],
    color_mean=[round(float(x),3) for x in cols.mean(0)], color_std=round(float(cols.std(0).mean()),3), uv_min=[round(float(x),4) for x in U.min(0)], uv_max=[round(float(x),4) for x in U.max(0)]))
res.sort(key=lambda r:-r['faces'])
bones=[b.name for b in arm.data.bones]
hb=arm.data.bones['head'] if 'head' in arm.data.bones else None
out=dict(fig=FIG, head_mesh=head.name, head_faces=len(bm.faces), image=img.name, image_size=[W,H], components=res, bones=len(bones), head_bone=bool(hb),
  head_bone_head=[round(x,4) for x in (arm.matrix_world@hb.head_local)] if hb else None)
json.dump(out,open(f'/tmp/eye/work/{FIG}_inspect.json','w'),indent=1)
print('COMPS',FIG,len(res)); [print(' ',r) for r in res[:12]]
# head front close-up render
sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x=900; sc.render.resolution_y=900; sc.eevee.taa_render_samples=16
w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.8,0.8,0.82,1); w.node_tree.nodes['Background'].inputs[1].default_value=1.2
P=np.array([list(head.matrix_world@v.co) for v in bm.verts]); c=Vector(P.mean(0)); r=float((P.max(0)-P.min(0)).max())
cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=r*1.15
for tag,az in (('front',0),('34',35)):
  a=math.radians(az); cam.location=c+Vector((math.sin(a)*r*3,-math.cos(a)*r*3,0)); cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
  sc.render.filepath=f'/tmp/eye/work/{FIG}_head_{tag}.png'; bpy.ops.render.render(write_still=True)
print('DONE')
