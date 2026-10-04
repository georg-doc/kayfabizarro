import bpy, bmesh, json, math, sys, os
from mathutils import Vector, Matrix
from mathutils.geometry import barycentric_transform, intersect_point_tri_2d
FID,SRCP,BASE,HEADOBJ=sys.argv[sys.argv.index('--')+1:sys.argv.index('--')+5]
T=json.load(open('/tmp/eye2/work/figure_tex.json'))
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=SRCP)
sc=bpy.context.scene; bpy.context.view_layer.update()
arm=next((o for o in sc.objects if o.type=='ARMATURE'),None)
ho=bpy.data.objects[HEADOBJ]; M=ho.matrix_world
fi=[i for i,s in enumerate(ho.material_slots) if s.material and 'face' in s.material.name][0]
mat=ho.material_slots[fi].material
tn=[n for n in mat.node_tree.nodes if n.type=='TEX_IMAGE'][0]
old=tn.image; nm=old.name
newimg=bpy.data.images.load('/tmp/eye2/work/actionfigure_faces_noeyes.png'); old.name=nm+'__orig'; newimg.name=nm; newimg.pack(); tn.image=newimg
me=ho.data; uvd=me.uv_layers.active.data
umin=min(uvd[li].uv.x for p in me.polygons if p.material_index==fi for li in p.loop_indices); umax=max(uvd[li].uv.x for p in me.polygons if p.material_index==fi for li in p.loop_indices)
mine=[b for b in T['blobs'] if umin<=b['u']<=umax]
A={}
for b in mine:
  uv=Vector((b['u'],b['v']))
  hit=None
  for p in me.polygons:
    if p.material_index!=fi: continue
    L=list(p.loop_indices)
    for k in range(1,len(L)-1):
      t=[uvd[L[0]].uv,uvd[L[k]].uv,uvd[L[k+1]].uv]
      if intersect_point_tri_2d(uv,*t):
        vs=[M@me.vertices[me.loops[l].vertex_index].co for l in (L[0],L[k],L[k+1])]
        P=barycentric_transform(uv.to_3d(),*[x.to_3d() for x in t],*vs)
        # radius: map a uv offset of rpx px horizontally
        du=Vector((b['rpx']/T['W'],0)); P2=barycentric_transform((uv+du).to_3d(),*[x.to_3d() for x in t],*vs)
        hit=(P,(M.to_3x3()@p.normal).normalized(),(P2-P).length); break
    if hit: break
  A[b['blob']]=dict(pos=hit[0],n=hit[1],r=hit[2],uvRect=b['uvRect'],skin=b['skin'])
ks=sorted(A,key=lambda k:-A[k]['pos'].x); A={'l':A[ks[0]],'r':A[ks[1]]}
hb=None
if arm:
  for bn in arm.data.bones:
    if bn.name.lower()=='head': hb=bn.name
for side in ('l','r'):
  a=A[side]; n=a['n']; up=Vector((0,0,1)); Zp=n; Yp=(up-n*up.dot(n)).normalized(); Xp=Yp.cross(Zp)
  rot=Matrix((Xp,-Zp,Yp)).transposed().to_4x4(); mw=Matrix.Translation(a['pos'])@rot@Matrix.Diagonal((a['r'],a['r'],a['r'],1))
  e=bpy.data.objects.new(f'eye_anchor.{side}',None); sc.collection.objects.link(e)
  if hb: e.parent=arm; e.parent_type='BONE'; e.parent_bone=hb; par='bone:'+hb
  else:
    root=ho
    while root.parent: root=root.parent
    e.parent=root; par='node:'+root.name
  bpy.context.view_layer.update(); e.matrix_world=mw
bpy.data.images.remove(old)
for o in sc.objects: o.select_set(True)
out=f'/tmp/eye2/out/glb/{BASE}_NoEyes.glb'
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_skins=True, export_animations=True, export_yup=True, export_materials='EXPORT', export_image_format='AUTO')
def gl(v): return [round(v[0],4),round(v[2],4),round(-v[1],4)]
rec=dict(id=FID,obj=ho.name,base=BASE,out=out,cls='texture',anchorParent=par,image=nm,
  anchors={s:dict(pos=gl(A[s]['pos']),normal=gl(A[s]['n']),r=round(A[s]['r'],4),uvRect=A[s]['uvRect'],surround=A[s]['skin']) for s in A})
json.dump(rec,open(f'/tmp/eye2/work/clean_{FID}.json','w'),indent=1); print('CLEAN',json.dumps(rec))
