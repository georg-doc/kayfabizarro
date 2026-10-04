import bpy, bmesh, json, math, sys, os
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
from mathutils.geometry import barycentric_transform
import numpy as np
FID=sys.argv[sys.argv.index('--')+1]
SRC='/tmp/eye2/src'; OUT='/tmp/eye2/out/glb'; os.makedirs(OUT,exist_ok=True)
spec=json.load(open('/tmp/eye2/work/spec.json'))[FID]
lst=dict(l.split('\t') for l in open(SRC+'/list.tsv').read().strip().split('\n'))
base=os.path.splitext(os.path.basename(lst[FID]))[0]
p=next(x for x in (f'{SRC}/g_{FID}/{FID}.gltf',f'{SRC}/{FID}.glb',f'{SRC}/{FID}.gltf') if os.path.exists(x))
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=p)
sc=bpy.context.scene; bpy.context.view_layer.update()
arm=next((o for o in sc.objects if o.type=='ARMATURE'),None)
hb=None
if arm:
  for b in arm.data.bones:
    if b.name.lower()=='head': hb=b.name
eo=bpy.data.objects[spec['obj']]; M=eo.matrix_world; R3=M.to_3x3()
bm=bmesh.new(); bm.from_mesh(eo.data); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
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
def cinfo(fids):
  fs=[bm.faces[i] for i in fids]; n=Vector((0,0,0)); c=Vector((0,0,0)); A=0
  for f in fs: a=f.calc_area(); n+=(R3@f.normal)*a; c+=(M@f.calc_center_median())*a; A+=a
  P=np.array([list(M@v.co) for f in fs for v in f.verts]); return c/A, n.normalized(), P
targets=spec['centres'] or spec['raw']
chosen=[]
for t in targets:
  best=min(comps.values(),key=lambda fids:(cinfo(fids)[0]-Vector(t)).length)
  chosen.append(best)
assert len({id(x) for x in chosen})==2
eyes=sorted(chosen,key=lambda fids:-cinfo(fids)[0].x)   # +X = character's left
eye_faces=set(eyes[0])|set(eyes[1])
# colour sampler over all visible non-glass meshes (eye faces excluded)
def tex_of(o,mi):
  if mi>=len(o.material_slots) or not o.material_slots[mi].material: return None,(1,1,1)
  m=o.material_slots[mi].material
  for n in m.node_tree.nodes:
    if n.type=='TEX_IMAGE' and n.image: 
      im=n.image; W,H=im.size
      if not hasattr(im,'_np'): pass
      return im,None
  bs=[n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED']
  return None, tuple(bs[0].inputs['Base Color'].default_value[:3]) if bs else (1,1,1)
pxc={}
def px(im):
  if im.name not in pxc: W,H=im.size; pxc[im.name]=(np.array(im.pixels[:],dtype=np.float32).reshape(H,W,4),W,H)
  return pxc[im.name]
bvhs=[]
for o in sc.objects:
  if o.type!='MESH' or 'glass' in o.name.lower() or o.name=='Icosphere' or o.hide_render: continue
  b2=bmesh.new(); b2.from_mesh(o.data); b2.transform(o.matrix_world)
  if o==eo:
    b2.faces.ensure_lookup_table(); keep=[f for f in b2.faces if f.index not in eye_faces]
    dele=[f for f in b2.faces if f.index in eye_faces]; fmap=[f.index for f in keep]
    bmesh.ops.delete(b2,geom=dele,context='FACES')
  else: fmap=None
  b2.faces.ensure_lookup_table(); bvhs.append((o,BVHTree.FromBMesh(b2),b2,fmap))
def sample(pt,dirn):
  best=None
  for o,bv,b2,fmap in bvhs:
    h=bv.ray_cast(pt,dirn,2.0)
    if h[0] is not None and (best is None or h[3]<best[0]): best=(h[3],o,b2,h[2],h[0])
  if best is None: return None
  _,o,b2,fi,hp=best; f=b2.faces[fi]
  im,col=tex_of(o,f.material_index)
  if im is None: return np.array(col)
  uvl=b2.loops.layers.uv.active; L=f.loops
  # triangle fan barycentric on first tri containing point (approx: use face triangles)
  vs=[l.vert.co for l in L]; uvs=[Vector((l[uvl].uv.x,l[uvl].uv.y,0)) for l in L]
  for k in range(1,len(vs)-1):
    uv=barycentric_transform(hp,vs[0],vs[k],vs[k+1],uvs[0],uvs[k],uvs[k+1])
    a,W,H=px(im); x=int((uv.x%1)*W); y=int((uv.y%1)*H); return a[min(H-1,y),min(W-1,x),:3]
def hexc(c): return '#'+''.join('%02x'%int(round(max(0,min(1,float(v)))*255)) for v in c[:3])
A={}
for side,fids in (('l',eyes[0]),('r',eyes[1])):
  c,n,P=cinfo(fids)
  fixed_n=False
  if n.y>-0.4:   # cap normal not facing forward (dangling/irregular eye): use the head surface normal behind the cap
    for o_,bv,b2,fm in bvhs:
      if o_==eo:
        h2=bv.ray_cast(c+Vector((0,-1,0)),Vector((0,1,0)),2.0)
        if h2[1] is not None: n=h2[1].normalized(); fixed_n=True
  t1=n.orthogonal().normalized(); t2=n.cross(t1).normalized(); d=P-np.array(c)
  e1=float(np.ptp(d@np.array(t1))); e2=float(np.ptp(d@np.array(t2))); r=(e1+e2)/4
  # surface point on the cap
  bi=bmesh.new()
  for f in [bm.faces[i] for i in fids]: bi.faces.new([bi.verts.new(M@v.co) for v in f.verts])
  h=BVHTree.FromBMesh(bi).ray_cast(c+n*0.5,-n); bi.free(); pos=h[0] if h[0] is not None else c
  up=Vector((0,0,1)); Yp=(up-n*up.dot(n)).normalized()
  cols=[]
  for k in range(24):
    a=2*math.pi*k/24
    for rr in (1.2,1.5):
      off=(math.cos(a)*n.cross(Yp)+math.sin(a)*Yp)*rr*r
      if off.z>0.3*r: continue
      s=sample(pos+off+n*0.3,-n)
      if s is not None: cols.append(s)
  sur=np.median(np.array(cols),0) if cols else None
  ec=sample(pos+n*0.3,-n)  # what is now behind the removed eye
  A[side]=dict(pos=list(pos),normal=list(n),r=r,extent=[round(e1,4),round(e2,4)],faces=len(fids),normalFromSurface=fixed_n,surround=hexc(sur) if sur is not None else None,samples=len(cols),
    behind=hexc(ec) if ec is not None else 'hole')
# irregular cap whose normal does not face forward: mirror the other eye's normal
for s1,s2 in (('l','r'),('r','l')):
  if A[s1]['normal'][1]>-0.3 and A[s2]['normal'][1]<=-0.3:
    nn=A[s2]['normal']; A[s1]['normal']=[-nn[0],nn[1],nn[2]]; A[s1]['normalFromSurface']='mirrored from '+s2
# delete eye faces
before=len(bm.faces)
bmesh.ops.delete(bm,geom=[bm.faces[i] for i in sorted(eye_faces)],context='FACES')
bm.to_mesh(eo.data); eo.data.update(); bm.free()
emptied = len(eo.data.polygons)==0
# anchors
for side in ('l','r'):
  a=A[side]; n=Vector(a['normal']); up=Vector((0,0,1)); Zp=n; Yp=(up-n*up.dot(n)).normalized(); Xp=Yp.cross(Zp)
  rot=Matrix((Xp,-Zp,Yp)).transposed().to_4x4(); mw=Matrix.Translation(Vector(a['pos']))@rot@Matrix.Diagonal((a['r'],a['r'],a['r'],1))
  e=bpy.data.objects.new(f'eye_anchor.{side}',None); e.empty_display_type='SINGLE_ARROW'; sc.collection.objects.link(e)
  if arm and hb: e.parent=arm; e.parent_type='BONE'; e.parent_bone=hb; par=f'bone:{hb}'
  else: e.parent=eo; par=f'node:{eo.name}'
  bpy.context.view_layer.update(); e.matrix_world=mw
bpy.context.view_layer.update()
for o in sc.objects: o.select_set(o.type in ('MESH','ARMATURE','EMPTY') and o.name!='Icosphere' or o.name=='Icosphere')
out=f'{OUT}/{base}_NoEyes.glb'
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_skins=True, export_animations=True, export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT', export_image_format='AUTO')
def gl(v): return [round(v[0],4),round(v[2],4),round(-v[1],4)]
rec=dict(id=FID,obj=eo.name,base=base,out=out,removedFaces=len(eye_faces),objFacesBefore=before,objEmptied=emptied,anchorParent=par,
  anchors={s:dict(pos=gl(A[s]['pos']),normal=gl(A[s]['normal']),r=round(A[s]['r'],4),extent=A[s]['extent'],faces=A[s]['faces'],normalFromSurface=A[s]['normalFromSurface'],surround=A[s]['surround'],samples=A[s]['samples'],behind=A[s]['behind']) for s in A},
  mirror=[round(A['l']['pos'][0]+A['r']['pos'][0],4),round(A['l']['pos'][1]-A['r']['pos'][1],4),round(A['l']['pos'][2]-A['r']['pos'][2],4)])
json.dump(rec,open(f'/tmp/eye2/work/clean_{FID}.json','w'),indent=1); print('CLEAN',json.dumps(rec)[:400])
