import bpy, bmesh, json, math, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
import numpy as np
FIG,SRC,OUTN=sys.argv[sys.argv.index('--')+1:sys.argv.index('--')+4]
OUT='/tmp/eye/out'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=f'/tmp/eye/src/{FIG}.glb')
sc=bpy.context.scene
arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
head=[o for o in sc.objects if o.type=='MESH' and o.name.endswith('_Head')][0]
img=[n.image for m in head.data.materials for n in m.node_tree.nodes if n.type=='TEX_IMAGE'][0]
W,H=img.size; px=np.array(img.pixels[:],dtype=np.float32).reshape(H,W,4)
def hexc(c): 
  def s(x): return x   # byte PNG: Blender returns the stored sRGB values (checked against PIL)
  return '#'+''.join('%02x'%int(round(max(0,min(1,s(float(v))))*255)) for v in c[:3])
# --- islands (position-welded connectivity)
me=head.data; bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
uvl=bm.loops.layers.uv.active; M=head.matrix_world; R3=M.to_3x3()
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
def info(fids):
  fs=[bm.faces[i] for i in fids]; vs={v for f in fs for v in f.verts}
  P=np.array([list(M@v.co) for v in vs]); n=Vector((0,0,0)); A=0; c=Vector((0,0,0))
  for f in fs: a=f.calc_area(); n+=(R3@f.normal)*a; c+=(M@f.calc_center_median())*a; A+=a
  cols=np.array([px[min(H-1,int(l[uvl].uv[1]*H)),min(W-1,int(l[uvl].uv[0]*W)),:3] for f in fs for l in f.loops])
  U=np.array([list(l[uvl].uv) for f in fs for l in f.loops])
  return dict(n=n.normalized(),c=c/A,P=P,area=A,col=np.median(cols,0),uvmin=U.min(0),uvmax=U.max(0))
cands=[]
for cid,fids in comps.items():
  I=info(fids); sz=I['P'].max(0)-I['P'].min(0)
  if len(fids)<300 and I['n'].y<-0.8 and sz.max()<0.2: cands.append((cid,fids,I))
# eye pair = two islands mirrored in x with same face count, dark or white (not skin), lowest |dy| ... pick the pair whose centres mirror best and that sit closest to head front between brows and nose
best=None
for i in range(len(cands)):
  for j in range(i+1,len(cands)):
    a,b=cands[i],cands[j]
    if len(a[1])!=len(b[1]): continue
    ca,cb=a[2]['c'],b[2]['c']
    mirror=abs(ca.x+cb.x)+abs(ca.y-cb.y)+abs(ca.z-cb.z)
    sep=abs(ca.x-cb.x)
    if sep<0.1: continue
    score=mirror
    if best is None or score<best[0]: best=(score,a,b)
assert best, 'no eye pair'
_,ea,eb=best
L,Rr=(ea,eb) if ea[2]['c'].x>eb[2]['c'].x else (eb,ea)   # KayKit faces -Y: character's left eye is at +X
# BVH of the remaining head (for surface point + surround colour)
eye_faces=set(L[1])|set(Rr[1])
# surround = the shell the eye cap sits on: the non-eye island whose faces come closest to the cap centre (no brows, hair, tusks)
def base_shell(E):
  c=E[2]['c']; best=(1e9,None)
  for cid,fids in comps.items():
    if set(fids)&eye_faces: continue
    d=min(((M@bm.faces[i].calc_center_median())-c).length for i in fids)
    if d<best[0]: best=(d,cid)
  return set(comps[best[1]])
def anchor(E):
  global main_faces
  main_faces=base_shell(E)
  I=E[2]; n=I['n']; c=I['c']
  # in-plane extents -> radius
  t1=n.orthogonal().normalized(); t2=n.cross(t1).normalized()
  d=I['P']-np.array(c); e1=np.ptp(d@np.array(t1)); e2=np.ptp(d@np.array(t2)); r=float((e1+e2)/4)
  # surface point: ray from outside along -n onto the island itself
  bmi=bmesh.new(); 
  for f in [bm.faces[i] for i in E[1]]:
    vv=[bmi.verts.new(M@v.co) for v in f.verts]; bmi.faces.new(vv)
  bv=BVHTree.FromBMesh(bmi); hit=bv.ray_cast(c+n*0.5,-n); bmi.free()
  p=hit[0] if hit[0] is not None else c
  # surround colour: head faces (not eye) whose centre lies within 0.6r..1.6r of the eye centre in the face plane
  cols=[]
  for f in bm.faces:
    if f.index in eye_faces or f.index not in main_faces: continue
    fc=M@f.calc_center_median(); dv=fc-p; dpl=dv-n*dv.dot(n)
    if 0.6*r<dpl.length<1.8*r and abs(dv.dot(n))<r and (R3@f.normal).dot(n)>0.3 and dv.z<0.3*r:
      for l in f.loops: u,v=l[uvl].uv; cols.append(px[min(H-1,int(v*H)),min(W-1,int(u*W)),:3])
  sur=np.median(np.array(cols),0) if cols else np.array([0,0,0])
  return dict(pos=[round(x,5) for x in p],normal=[round(x,4) for x in n],r=round(r,5),extent=[round(float(e1),4),round(float(e2),4)],faces=len(E[1]),
    eyeColor=hexc(I['col']),surround=hexc(sur),surroundSamples=len(cols),uvRect=[round(float(x),4) for x in list(I['uvmin'])+list(I['uvmax'])])
A={'l':anchor(L),'r':anchor(Rr)}
mir=[round(A['l']['pos'][0]+A['r']['pos'][0],5),round(A['l']['pos'][1]-A['r']['pos'][1],5),round(A['l']['pos'][2]-A['r']['pos'][2],5)]
# --- remove eye islands (only those faces)
before=len(bm.faces)
bmesh.ops.delete(bm,geom=[bm.faces[i] for i in sorted(eye_faces)],context='FACES')
bm.to_mesh(me); me.update(); bm.free()
after=len(me.polygons)
# --- anchors as children of head bone
hb=arm.pose.bones['head']
for side in ('l','r'):
  a=A[side]; n=Vector(a['normal']).normalized(); up=Vector((0,0,1))
  # glTF export maps Blender local (x, y, z) -> glTF local (x, -z?) : glTF X=x_b, glTF Y=z_b, glTF Z=-y_b. Build the glTF/three frame first.
  Zp=n; Yp=(up-n*up.dot(n)).normalized(); Xp=Yp.cross(Zp)
  xb, yb, zb = Xp, -Zp, Yp
  rot=Matrix((xb,yb,zb)).transposed().to_4x4(); mw=Matrix.Translation(Vector(a['pos']))@rot@Matrix.Diagonal((a['r'],a['r'],a['r'],1))
  e=bpy.data.objects.new(f'eye_anchor.{side}',None); e.empty_display_type='SINGLE_ARROW'; sc.collection.objects.link(e)
  e.parent=arm; e.parent_type='BONE'; e.parent_bone='head'; bpy.context.view_layer.update(); e.matrix_world=mw
bpy.context.view_layer.update()
for o in sc.objects: o.select_set(o.type in ('MESH','ARMATURE','EMPTY'))
bpy.ops.export_scene.gltf(filepath=f'{OUT}/{OUTN}', export_format='GLB', use_selection=True, export_skins=True, export_animations=False, export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT', export_image_format='AUTO')
rec=dict(fig=FIG,head=head.name,headFacesBefore=before,headFacesAfter=after,removedFaces=len(eye_faces),anchors=A,mirrorDelta=mir,image=img.name)
json.dump(rec,open(f'/tmp/eye/work/{FIG}_clean.json','w'),indent=1); print('CLEAN',json.dumps(rec))
