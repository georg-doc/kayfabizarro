import bpy,sys,json,hashlib,math,os
from mathutils import Vector
from mathutils.bvhtree import BVHTree
baseline,context,out=sys.argv[sys.argv.index('--')+1:][:3]
def load(path):
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=path);d={}
 for o in bpy.context.scene.objects:
  if o.type!='MESH':continue
  vs=[o.matrix_world@v.co for v in o.data.vertices];ps=[tuple(p.vertices) for p in o.data.polygons]
  o.data.calc_loop_triangles();tris=[tuple(sorted(tuple(round(c,5) for c in vs[i]) for i in t.vertices)) for t in o.data.loop_triangles]
  d[o.name]={'v':vs,'p':ps,'tris':tris,'b':BVHTree.FromPolygons(vs,ps)}
 return d
base=load(baseline);scene=load(context)
scene={n[:-4] if n.endswith('.001') and n[:-4] in base else n:d for n,d in scene.items()}
parity={}
for n,a in base.items():
 b=scene.get(n);parity[n]={'triangle_position_multiset_exact_1e5':bool(b and sorted(a['tris'])==sorted(b['tris'])),'unique_positions_exact_1e5':bool(b and {tuple(round(c,5) for c in v) for v in a['v']}=={tuple(round(c,5) for c in v) for v in b['v']}),'present':bool(b),'polygons_exact':bool(b and a['p']==b['p']),'max_vertex_delta':max(((v-w).length for v,w in zip(a['v'],b['v'])),default=0) if b and len(a['v'])==len(b['v']) else None}
soil={n:d for n,d in scene.items() if n not in base}
def top(ds,x,y):
 hits=[]
 for n,d in ds.items():
  l,no,idx,dist=d['b'].ray_cast(Vector((x,y,50)),Vector((0,0,-1)),100)
  if l is not None:hits.append((l.z,n,no.z))
 return max(hits) if hits else None
walk={n:d for n,d in scene.items() if n.startswith(('Tread','Landing'))}
paths=[];raw=[];body=[];sweeps=[]
# Dense continuous-path approximation plus swept transverse-foot disk probes.
for x in [-5.46,-5.3,-4.8,-4,0,4,4.8,5.3,5.46]:
 vals=[]
 for i in range(2401):
  y=-.5+i*.01;s=top(walk,x,y);t=top(soil,x,y);h=max([q for q in [s,t] if q],default=None)
  row={'x':x,'y':y,'walk':s,'soil':t,'top':h};raw.append(row)
  if h:vals.append((y,h[0],h[1]))
 rises=[{'y':b[0],'delta':b[1]-a[1]} for a,b in zip(vals,vals[1:]) if abs(b[1]-a[1])>.04]
 paths.append({'x':x,'samples':len(vals),'rises_over_0_68':[r for r in rises if r['delta']>.681],'drops_over_exit_limit':[r for r in rises if r['delta']<-.0728],'transitions':rises})
 # Continuous segment rays at capsule rim samples; stair maneuver raises first then advances.
 for a,b in zip(vals,vals[1:]):
  if abs(x)>4.8048:continue
  y0,z0,_=a;y1,z1,_=b
  for dz in [.73,1.82,3.3]:
   for j in range(8):
    angle=j*math.tau/8;off=Vector((math.cos(angle)*.6552,math.sin(angle)*.6552,0))
    start=Vector((x,y0,max(z0,z1)+dz))+off;end=Vector((x,y1,max(z0,z1)+dz))+off
    vec=end-start
    for nn,d in scene.items():
     loc,no,idx,dist=d['b'].ray_cast(start,vec.normalized(),vec.length)
     if loc is not None:sweeps.append({'x':x,'from_y':y0,'to_y':y1,'level':dz,'object':nn})
 for y,z,n in vals[::10]:
  # Radial swept-body samples cover radius .18H=.6552 at ankle/head elevations.
  for dz in [.73,1.82,3.3]:
   p=Vector((x,y,z+dz))
   for j in range(12):
    a=j*math.tau/12;v=Vector((math.cos(a),math.sin(a),0))
    for nn,d in scene.items():
     loc,no,ix,dist=d['b'].ray_cast(p,v,.6552)
     if loc is not None and dist>.0001:body.append({'x':x,'y':y,'z':z,'level':dz,'object':nn,'distance':dist})
# Actual pillar surfaces: upward bottom rays and transverse body-band contact rays into soil.
contacts=[]
for n,d in scene.items():
 if not n.startswith('Pillar_'):continue
 vs=d['v'];lo=[min(v[k] for v in vs) for k in range(3)];hi=[max(v[k] for v in vs) for k in range(3)]
 near=[];foot=[]
 for v in vs:
  ds=[q['b'].find_nearest(v)[3] for q in soil.values()];near.append(min(ds,default=999))
  if v.z<=lo[2]+.03:
   h=top(soil,v.x,v.y);foot.append({'point':list(v),'soil':h,'signed_top_gap':v.z-h[0] if h else None})
 contacts.append({'object':n,'bounds':[lo,hi],'surface_vertices_within_0_02H':sum(a<=.0728 for a in near),'minimum_surface_distance':min(near,default=None),'bottom_surface_soil_probes':foot})
topology=[]
for n,d in soil.items():
 # GLB UV/color seams duplicate positions: connectivity must weld positions first.
 keys={};mapping={}
 for i,v in enumerate(d['v']):
  k=tuple(round(c,5) for c in v);mapping[i]=keys.setdefault(k,len(keys))
 adj={i:set() for i in range(len(keys))}
 for p in d['p']:
  for a,b in zip(p,p[1:]+p[:1]):
   a=mapping[a];b=mapping[b];adj[a].add(b);adj[b].add(a)
 todo=set(adj);sizes=[]
 while todo:
  stack=[todo.pop()];size=0
  while stack:
   a=stack.pop();size+=1
   for b in adj[a]:
    if b in todo:todo.remove(b);stack.append(b)
  sizes.append(size)
 topology.append({'object':n,'vertex_components':sizes,'minimum_z':min(v.z for v in d['v'])})
exitprobes=[r for r in raw if 17.8<=r['y']<=20.0]
report={'baseline_sha256':hashlib.sha256(open(baseline,'rb').read()).hexdigest(),'attachment_sha256':hashlib.sha256(open(context,'rb').read()).hexdigest(),'mesh_parity':parity,'terrain_topology':topology,'dense_path_checks':paths,'continuous_segment_sweep_collisions_interior':sweeps,'body_ray_collisions':body,'pillar_soil_contacts':contacts,'exit_probes':exitprobes,'raw_surface_samples':raw,'runtime_locomotion':'NOT_RUN','method':'Independent clean GLB reimports; world BVH downward surfaces at .01lab path increments across 3H width; radial body sweep samples radius .18H at three levels. Finite geometric samples, not actual controller or continuous analytic collision proof.'}
json.dump(report,open(out,'w'),indent=2);print(out);print('PARITY',all(p['polygons_exact'] and p['max_vertex_delta']==0 for p in parity.values()));print('BODY_COLLISIONS',len(body));print('TERRAIN',topology);print('PATHS',paths)
