import bpy, bmesh, json, math, sys, os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
import numpy as np
SRC='/tmp/eye2/src'; W='/tmp/eye2/work'
ids=[l.split('\t')[0] for l in open(SRC+'/list.tsv').read().strip().split('\n')]
only=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if only: ids=[i for i in ids if i in only]
def path(i):
  for p in (f'{SRC}/g_{i}/{i}.gltf',f'{SRC}/{i}.glb',f'{SRC}/{i}.gltf'):
    if os.path.exists(p): return p
out={}
for fid in ids:
  bpy.ops.wm.read_factory_settings(use_empty=True)
  try: bpy.ops.import_scene.gltf(filepath=path(fid))
  except Exception as e: out[fid]={'error':str(e)}; continue
  sc=bpy.context.scene
  arms=[o for o in sc.objects if o.type=='ARMATURE']; arm=arms[0] if arms else None
  hb=None
  if arm:
    for b in arm.data.bones:
      if b.name.lower() in ('head','head.x','head_jnt','mixamorig:head'): hb=b.name
  meshes=[o for o in sc.objects if o.type=='MESH']
  dg=bpy.context.evaluated_depsgraph_get()
  # head vertices: per object, verts with head-group weight>0.5, or objects named *head*
  cands=[]; headP=[]
  for o in meshes:
    me=o.data; M=o.matrix_world; R3=M.to_3x3()
    gi=o.vertex_groups[hb].index if (hb and hb in o.vertex_groups) else None
    isHeadObj='head' in o.name.lower()
    bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
    def hw(v):
      if isHeadObj and gi is None: return 1.0
      if gi is None: return 0.0
      for g in me.vertices[v.index].groups:
        if g.group==gi: return g.weight
      return 0.0
    hv=[hw(v)>0.5 for v in bm.verts]
    if not any(hv): bm.free(); continue
    for v in bm.verts:
      if hv[v.index]: headP.append(list(M@v.co))
    parent=list(range(len(bm.verts)))
    def find(a):
      while parent[a]!=a: parent[a]=parent[parent[a]]; a=parent[a]
      return a
    key={}
    for v in bm.verts:
      kk=tuple(round(c,5) for c in (M@v.co))
      if kk in key: parent[find(v.index)]=find(key[kk])
      else: key[kk]=v.index
    for e in bm.edges: parent[find(e.verts[0].index)]=find(e.verts[1].index)
    comps={}
    for f in bm.faces: comps.setdefault(find(f.verts[0].index),[]).append(f.index)
    for cid,fids in comps.items():
      fs=[bm.faces[i] for i in fids]; vs={v for f in fs for v in f.verts}
      if not all(hv[v.index] for v in vs): continue
      P=np.array([list(M@v.co) for v in vs]); n=Vector((0,0,0)); A=0; c=Vector((0,0,0))
      for f in fs: a=f.calc_area(); n+=(R3@f.normal)*a; c+=(M@f.calc_center_median())*a; A+=a
      if A<=0: continue
      cands.append(dict(obj=o.name,faces=len(fids),fids=fids,c=list(c/A),n=list(n.normalized()),size=list(P.max(0)-P.min(0)),area=A))
    bm.free()
  if not headP: out[fid]={'error':'no head verts','hb':hb,'meshes':[o.name for o in meshes]}; continue
  HP=np.array(headP); hmin,hmax=HP.min(0),HP.max(0); hs=hmax-hmin
  small=[k for k in cands if max(k['size'])<0.35*hs[0] and k['n'][1]<-0.4]
  pairs=[]
  for i in range(len(small)):
    for j in range(i+1,len(small)):
      a,b=small[i],small[j]
      if a['faces']!=b['faces'] or a['obj']!=b['obj']: continue
      ca,cb=Vector(a['c']),Vector(b['c'])
      sep=abs(ca.x-cb.x)
      if sep<0.08*hs[0]: continue
      mir=abs(ca.x+cb.x)+abs(ca.y-cb.y)+abs(ca.z-cb.z)
      pairs.append(dict(i=i,j=j,mirror=round(mir,4),faces=a['faces'],obj=a['obj'],z=round((ca.z+cb.z)/2,3),size=[round(x,3) for x in a['size']],sep=round(sep,3)))
  pairs.sort(key=lambda p:p['mirror'])
  # render front + label candidates
  sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x=700; sc.render.resolution_y=700; sc.eevee.taa_render_samples=8; sc.view_settings.view_transform='Standard'
  w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.62,0.66,0.7,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.6
  sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=2.6; sun.rotation_euler=(math.radians(55),0,math.radians(-25)); sc.collection.objects.link(sun)
  c=Vector((hmin+hmax)/2); r=float(hs.max())
  cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=r*1.3
  cam.location=c+Vector((0,-r*4,0)); cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
  bpy.context.view_layer.update()
  sc.render.filepath=f'{W}/h_{fid}.png'; bpy.ops.render.render(write_still=True)
  lab=[]
  for k,p in enumerate(pairs[:6]):
    for s in ('i','j'):
      v=world_to_camera_view(sc,cam,Vector(small[p[s]]['c'])); lab.append((k,v.x,v.y))
  out[fid]=dict(hb=hb,arm=arm.name if arm else None,bones=len(arm.data.bones) if arm else 0,meshes=[o.name for o in meshes],head_size=[round(x,3) for x in hs],head_c=[round(x,3) for x in c],
    pairs=pairs[:6],small=[{k:v for k,v in s.items() if k!='fids'} for s in small],labels=lab)
  print('DONE',fid,hb,len(small),[(p['faces'],p['mirror'],p['obj']) for p in pairs[:4]],flush=True)
json.dump(out,open(f'{W}/inspect{"_"+"_".join(only) if only else ""}.json','w'),indent=1)
