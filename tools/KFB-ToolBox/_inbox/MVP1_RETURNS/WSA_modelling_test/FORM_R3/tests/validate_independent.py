import bpy,sys,json,hashlib,struct,os,math
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]; path,out=args[:2]
bpy.ops.wm.read_factory_settings(use_empty=True)
r=bpy.ops.import_scene.gltf(filepath=path)
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']; deps=bpy.context.evaluated_depsgraph_get()
def bounds(o):
 p=[o.matrix_world@Vector(v) for v in o.bound_box]; return {'min':[min(v[i] for v in p) for i in range(3)],'max':[max(v[i] for v in p) for i in range(3)]}
rows=[]
for o in meshes:
 o.data.calc_loop_triangles(); rows.append({'name':o.name,'triangles':len(o.data.loop_triangles),'bounds':bounds(o),'properties':{k:str(v) for k,v in o.items()}})
lo=[min(x['bounds']['min'][i] for x in rows) for i in range(3)]; hi=[max(x['bounds']['max'][i] for x in rows) for i in range(3)]
def ray(x,y):
 hit,loc,n,idx,obj,mat=bpy.context.scene.ray_cast(deps,Vector((x,y,hi[2]+10)),Vector((0,0,-1)),distance=hi[2]-lo[2]+20)
 return {'x':round(x,4),'y':round(y,4),'hit':hit,'z':round(loc.z,5) if hit else None,'normal_z':round(n.z,5) if hit else None,'object':obj.name if hit else None}
# Raw dense surface evidence, independent of builder dimensions. X width/Y forward/Z height in Blender.
samples=[ray(x,lo[1]+(hi[1]-lo[1])*i/1000) for x in [-5.46,-5.3,-4,0,4,5.3,5.46] for i in range(1001)]
center=[s for s in samples if s['x']==0]; flat=[s for s in center if s['hit'] and abs(s['normal_z'])>.98]
# Contiguous top-surface plateau segments; curved noses are excluded, not falsely called flat treads.
segments=[]
for s in flat:
 if not segments or s['y']-segments[-1]['end_y']>(hi[1]-lo[1])/1000*1.5 or abs(s['z']-segments[-1]['z'])>.03:
  segments.append({'start_y':s['y'],'end_y':s['y'],'z':s['z'],'object':s['object'],'samples':1})
 else: segments[-1]['end_y']=s['y'];segments[-1]['samples']+=1
segments=[dict(s,flat_run=round(s['end_y']-s['start_y'],5)) for s in segments if s['samples']>=4]
# Direction-independent signed interval surface distances, AABB only: no contact PASS inferred.
pairs=[]
for i,a in enumerate(rows):
 for b in rows[i+1:]:
  sep=[max(a['bounds']['min'][k]-b['bounds']['max'][k],b['bounds']['min'][k]-a['bounds']['max'][k]) for k in range(3)]
  if max(sep)<.12: pairs.append({'a':a['name'],'b':b['name'],'aabb_signed_separation':sep})
raw=open(path,'rb').read(); magic,ver,size=struct.unpack_from('<III',raw); json_len,json_type=struct.unpack_from('<II',raw,12); gltf=json.loads(raw[20:20+json_len]);
report={'validator':'Independent Blender clean-scene GLB import + actual downward scene raycasts','input':path,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'import_result':list(r),'glb_version':ver,'glb_length_matches':size==len(raw),'gltf_asset':gltf.get('asset'),'coordinate_system':'GLB glTF Y-up standard; imported geometry measured Blender Z-up; vertical footprint verified through rays','mesh_objects':len(meshes),'objects':rows,'total_triangles':sum(x['triangles'] for x in rows),'per_part_triangle_gate':all(x['triangles']<=20000 for x in rows),'cameras':sum(o.type=='CAMERA' for o in bpy.context.scene.objects),'lights':sum(o.type=='LIGHT' for o in bpy.context.scene.objects),'bounds':{'min':lo,'max':hi},'flat_centerline_segments':segments,'actual_surface_ray_count':len(samples),'surface_samples':samples,'candidate_near_contact_pairs_aabb_only':pairs,'limitations':['Form-family count requires grammar evidence, never inferred from mesh count.','AABB proximity is broad-phase evidence only, not physical contact proof.','Actual collision locomotion controller unavailable; raycast walkable surface and height transitions are measured, runtime player locomotion remains untested.','Independent form aesthetics and human Golden are separate gates.']}
os.makedirs(os.path.dirname(out),exist_ok=True);json.dump(report,open(out,'w'),indent=2);print('INDEPENDENT_REPORT',out);print(json.dumps({k:v for k,v in report.items() if k not in ['surface_samples','candidate_near_contact_pairs_aabb_only','objects']},indent=2))
