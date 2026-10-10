import bpy,sys,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
path,out=sys.argv[sys.argv.index('--')+1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=path)
obs=[o for o in bpy.context.scene.objects if o.type=='MESH'];data=[]
for o in obs:
 vs=[o.matrix_world@v.co for v in o.data.vertices];ps=[list(p.vertices) for p in o.data.polygons];bvh=BVHTree.FromPolygons(vs,ps,all_triangles=False)
 data.append((o.name,vs,bvh, [min(v[k] for v in vs) for k in range(3)],[max(v[k] for v in vs) for k in range(3)]))
contacts=[];supports=[]
for name,vs,bvh,lo,hi in data:
 sampled=vs[::max(1,len(vs)//200)];best=[]
 for name2,vs2,bvh2,lo2,hi2 in data:
  if name2==name:continue
  sep=max(max(lo[k]-hi2[k],lo2[k]-hi[k]) for k in range(3))
  if sep>.25:continue
  ds=[]
  for v in sampled:
   hit=bvh2.find_nearest(v)
   if hit[0] is not None:ds.append(hit[3])
  if ds:contacts.append({'source':name,'target':name2,'sample_count':len(ds),'minimum_vertex_to_surface_distance':min(ds),'within_0_08_samples':sum(d<=.08 for d in ds)})
 # Bottom-band geometry vertices query actual downward support against other geometry.
 lows=[v for v in vs if v.z<=lo[2]+.015];lows=lows[::max(1,len(lows)//40)]
 for v in lows:
  hits=[]
  for name2,vs2,bvh2,lo2,hi2 in data:
   if name2==name:continue
   loc,n,idx,d=bvh2.ray_cast(v+Vector((0,0,.05)),Vector((0,0,-1)),100)
   if loc is not None:hits.append((d-.05,name2,loc.z))
  supports.append({'object':name,'bottom_vertex':list(v),'nearest_downward_support':sorted(hits)[0] if hits else None,'ground_plane_gap':v.z})
intervals=[]
for name,vs,bvh,lo,hi in data:
 if name.startswith('Crown_'): targets=[d for d in data if d[0].startswith(('WallTragstein_'+name.split('_')[1], 'WallUpper_'+name.split('_')[1], 'WallLower_'+name.split('_')[1]))]
 elif name.startswith('WallUpper_'):targets=[d for d in data if d[0]==name.replace('WallUpper_','WallLower_')]
 elif name.startswith(('WallTragstein_','WallLower_')):targets=[d for d in data if d[0].startswith('Foundation_'+name.split('_')[1])]
 elif name.startswith('Pillar_') and name.endswith('_shaft'):targets=[d for d in data if d[0]==name.replace('_shaft','_foot')]
 elif name.startswith('Pillar_') and name.endswith('_cap'):targets=[d for d in data if d[0]==name.replace('_cap','_shaft')]
 else: continue
 for fx in [.3,.5,.7]:
  for fy in [.3,.5,.7]:
   x=lo[0]+(hi[0]-lo[0])*fx;y=lo[1]+(hi[1]-lo[1])*fy
   bottom=bvh.ray_cast(Vector((x,y,lo[2]-10)),Vector((0,0,1)),100)[0]
   if bottom is None:continue
   ts=[]
   for name2,vs2,bvh2,lo2,hi2 in targets:
    top=bvh2.ray_cast(Vector((x,y,max(hi[2],hi2[2])+10)),Vector((0,0,-1)),100)[0]
    if top is not None:ts.append({'target':name2,'signed_gap':bottom.z-top.z,'target_top_z':top.z})
   intervals.append({'object':name,'xy':[x,y],'source_bottom_z':bottom.z,'supports':ts})
report={'support_interval_surface_rays':intervals,'input' :path,'method':'World-space BVH surface nearest queries, sampled actual mesh vertices; downward bottom-vertex support rays against every other mesh. Ground plane is an assumed placement datum only, not a donor mesh.','surface_proximity_pairs':contacts,'bottom_support_rays':supports,'limits':['Closest sampled vertices are conservative proximity evidence, not a complete triangle intersection or structural-engineering proof.','No real terrain in isolated candidate means embedded hill contacts require separate donor-context evidence.']};json.dump(report,open(out,'w'),indent=2);print(out)
