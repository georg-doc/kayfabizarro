import json,hashlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(__file__).resolve().parents[1]
raw=(root/'track_meshes.json').read_bytes();meshes=json.loads(raw);s=json.loads((root/'candidate.stream.json').read_text())['samples']
bvhs={}
for m in meshes:
 p=m['positions'];verts=[Vector(p[i:i+3]) for i in range(0,len(p),3)];inds=m['indices'];faces=[inds[i:i+3] for i in range(0,len(inds),3)];bvhs[m['name']]=BVHTree.FromPolygons(verts,faces,all_triangles=True)
road=bvhs['fahrbahn'];body=bvhs['strang'];miss=[];boundary_retries=[];contactdev=[];overhead=[];rays=0
for i,q in enumerate(s):
 p=Vector(q['p']);R=Vector(q['R']);U=Vector(q['U'])
 for lat in [-5,-3,-2.05,0,2.05,3,5]:
  t=p+R*lat;hit=road.ray_cast(t+U*.5,-U,1);rays+=1
  if hit[0] is None:
   inset=Vector(q['T'])*(.001 if i==0 else -.001 if i==len(s)-1 else 0)
   retry=road.ray_cast(t+inset+U*.5,-U,1)
   if retry[0] is None:miss.append([i,lat])
   else:boundary_retries.append([i,lat,.001])
  else:contactdev.append(abs((hit[0]-t).dot(U)))
 for lat in [-2.05,0,2.05]:
  hit=body.ray_cast(p+R*lat+U*.06,U,7);rays+=1
  if hit[0] is not None:overhead.append([i,lat,hit[3]])
out={'mesh_sha256':hashlib.sha256(raw).hexdigest(),'sample_count':len(s),'rays':rays,'road_lateral_probes_m':[-5,-3,-2.05,0,2.05,3,5],'road_misses':miss,'exact_boundary_retries':boundary_retries,'max_surface_deviation_m':max(contactdev,default=None),'track_body_overhead_obstructions_7m':overhead,'limits':'Native exact JSON track meshes only. Does not include terrain or Maker/Protopia props. Road has donor display micro-relief, contact deviation measured against authoritative stream.'}
(root/'independent/road_mesh_test.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items()if k not in ('road_misses','track_body_overhead_obstructions_7m')}));print('misses',len(miss),'overhead',len(overhead))
