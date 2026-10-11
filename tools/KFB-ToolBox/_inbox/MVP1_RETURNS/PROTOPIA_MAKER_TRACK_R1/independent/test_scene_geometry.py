import json,hashlib,math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(__file__).resolve().parents[1];raw=(root/'scene_geometry.json').read_bytes();objects=json.loads(raw);S=json.loads((root/'candidate.stream.json').read_text())['samples']
def cv(v):return Vector((v[0],-v[2],v[1]))
obstacles=[];terrain=[]
for o in objects:
 if o['name'] in ('strang','fahrbahn','markings'):continue
 vs=[Vector(v) for v in o['vertices']];b=BVHTree.FromPolygons(vs,o['triangles'],all_triangles=True);lo=Vector(tuple(min(v[k]for v in vs)for k in range(3)));hi=Vector(tuple(max(v[k]for v in vs)for k in range(3)));rec=(o['name'],b,lo,hi)
 obstacles.append(rec)
 if o['name'].endswith('_terrain'):terrain.append(rec)
hits=[];rays=0;contact=[]
for i,q in enumerate(S):
 p,R,U,T=map(cv,(q['p'],q['R'],q['U'],q['T']))
 # conservative 6.5m long,4.1m wide,7m tall vehicle sampled longitudinally and across width.
 for longitudinal in [-3.25,0,3.25]:
  if q['s']+longitudinal<.01 or q['s']+longitudinal>S[-1]['s']-.01:continue
  for lat in [-3.55,-2.05,0,2.05,3.55]:
   a=p+T*longitudinal+R*lat+U*.05
   for name,b,lo,hi in obstacles:
    if a.x<lo.x-.1 or a.x>hi.x+.1 or a.y<lo.y-.1 or a.y>hi.y+.1 or hi.z<a.z-.1:continue
    hit=b.ray_cast(a,U,6.95);rays+=1
    if hit[0] is not None:hits.append({'sample':i,'s':q['s'],'object':name,'lat':lat,'longitudinal':longitudinal,'height':hit[3]+.05})
 # docking: first/last 20m, underside vertical terrain gap through full deck width
 if q['s']<=20 or q['s']>=S[-1]['s']-20:
  for lat in [-10,-5,0,5,10]:
   a=p+R*lat-U*2.25;best=None
   for name,b,lo,hi in terrain:
    hit=b.ray_cast(a+U*3,-U,30);rays+=1
    if hit[0] is not None and(best is None or hit[3]<best['distance']):best={'object':name,'distance':hit[3],'gap_m':hit[3]-3,'point':list(hit[0])}
   contact.append({'sample':i,'s':q['s'],'lat':lat,'terrain':best})
missing=[r for r in contact if r['terrain'] is None];gaps=[r['terrain']['gap_m']for r in contact if r['terrain']]
out={'scene_sha256':hashlib.sha256(raw).hexdigest(),'evaluated_objects':len(objects),'obstacle_rays':rays,'vehicle_envelope_m':{'length':6.5,'width':4.1,'height_reserve':7,'tested_lateral_extent_including_controller_offset':3.55},'obstacle_hits':hits,'docking_contact_missing':missing,'docking_max_gap_m':max(gaps,default=None),'docking_min_gap_m':min(gaps,default=None),'docking_samples':contact,'limits':'Sampled evaluated-mesh rays, not continuous exact convex sweep; original frame and native road independently tested elsewhere. Vehicle straight oriented to local route tangent. No browser gameplay or new runtime collider owner.'}
(root/'independent/scene_geometry_test.json').write_text(json.dumps(out,indent=2));print(json.dumps({k:v for k,v in out.items()if k not in ('obstacle_hits','docking_samples','docking_contact_missing')},indent=2));print('hits',len(hits),'missing docking',len(missing));print(hits[:12])
