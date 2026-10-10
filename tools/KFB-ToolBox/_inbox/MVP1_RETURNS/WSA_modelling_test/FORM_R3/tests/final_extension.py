import bpy,sys,json,os,hashlib,math,bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=sys.argv[sys.argv.index('--')+1];out=os.path.join(root,'tester');prod=os.path.join(root,'output')
def load(path):
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=path)
 result={}
 for o in bpy.context.scene.objects:
  if o.type!='MESH':continue
  vs=[o.matrix_world@v.co for v in o.data.vertices];ps=[tuple(p.vertices) for p in o.data.polygons];o.data.calc_loop_triangles()
  bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
  nonmanifold=sum(not e.is_manifold for e in bm.edges); angles=[e.calc_face_angle(0) for e in bm.edges if e.is_manifold];sharp=sum(e.is_manifold and e.calc_face_angle(0)>math.radians(75) and e.calc_length()>.728 for e in bm.edges); maxangle=max(angles,default=0)*180/math.pi;bm.free()
  result[o.name]={'vertices':vs,'polygons':ps,'triangles':len(o.data.loop_triangles),'bvh':BVHTree.FromPolygons(vs,ps),'nonmanifold_after_position_weld':nonmanifold,'long_edges_dihedral_over75':sharp,'max_dihedral_degrees':maxangle,'materials':[{'name':m.name,'diffuse':list(m.diffuse_color),'roughness':m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value,'basecolor_linear':list(m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value)} for m in o.data.materials if m]}
 return result
neutral=load(prod+'/KFB_TOWN_CASTLE_STAIRS_FORM_R3_NEUTRAL.glb');styled=load(prod+'/KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb');parity={}
for name,a in neutral.items():
 b=styled.get(name);delta=max(((v-w).length for v,w in zip(a['vertices'],b['vertices'])),default=0) if b and len(a['vertices'])==len(b['vertices']) else None
 parity[name]={'vertex_count_equal':bool(b and len(a['vertices'])==len(b['vertices'])),'max_vertex_world_delta':delta,'polygons_exact_equal':bool(b and a['polygons']==b['polygons']),'triangles_equal':bool(b and a['triangles']==b['triangles'])}
terrain=load(prod+'/CONTEXT_ONLY_KAYKIT_HILL.glb');rays=json.load(open(out+'/R3_independent_validation.json'))['surface_samples']
def hit(meshes,x,y):
 vals=[]
 for n,o in meshes.items():
  loc,normal,idx,dist=o['bvh'].ray_cast(Vector((x,y,30)),Vector((0,0,-1)),100)
  if loc is not None:vals.append((loc.z,n,normal.z))
 return max(vals) if vals else None
terrain_checks=[]
for s in rays:
 if s['hit'] and s['normal_z']>.98 and s['object'].startswith(('Tread','Landing')):
  t=hit(terrain,s['x'],s['y']);terrain_checks.append({'x':s['x'],'y':s['y'],'tread_z':s['z'],'object':s['object'],'terrain_z':t[0] if t else None,'terrain_minus_walk_z':t[0]-s['z'] if t else None})
connection=[]
for x in [-5.46,-4,0,4,5.46]:
 for y in [17.8,17.9,17.97,18.0,18.1,18.2,18.4,18.8,19.0,20.0]:
  a=hit(styled,x,y);t=hit(terrain,x,y);connection.append({'x':x,'y':y,'stairs':a,'terrain':t,'terrain_to_landing_delta':t[0]-5.08 if t else None})
def srgb(c):return 12.92*c if c<=.0031308 else 1.055*c**(1/2.4)-.055
mats={m['name']:dict(m,srgb_hex='#'+''.join(f'{round(srgb(v)*255):02x}' for v in m['basecolor_linear'][:3])) for o in styled.values() for m in o['materials']}
source_info=json.load(open(prod+'/hill_source.json'));source=load(source_info['source']);tf=json.load(open(prod+'/context_transform.json'));sverts=[v for o in source.values() for v in o['vertices']];tverts=[v for o in terrain.values() for v in o['vertices']];nlo=tf['native_bounds'][0];nhi=tf['native_bounds'][1];expected=[]
for instance in tf['instances']:
 if 'matrix' in instance:
  m=instance['matrix']; expected.extend(tuple(round(sum(m[i][j]*v[j] for j in range(3))+m[i][3],4) for i in range(3)) for v in sverts)
 else:
  sc=instance['axis_scales'];center=instance['center'];expected.extend(tuple(round((v[i]-(nlo[i]+nhi[i])/2)*sc[i]+center[i],4) for i in range(3)) for v in sverts)
actual=[tuple(round(v[i],4) for i in range(3)) for v in tverts]
contact_probes=[]
for x in [-8,-7.6,-7.0,-6.7,6.7,7.0,7.6,8]:
 for y in [0,.5,1.2,2,4,6,8,10,12,14,16,17.5]:
  t=hit(terrain,x,y);a=hit(styled,x,y);contact_probes.append({'x':x,'y':y,'terrain':t,'architecture':a})
report={'side_foot_terrain_probes':contact_probes,'styled_sha256':hashlib.sha256(open(prod+'/KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb','rb').read()).hexdigest(),'neutral_sha256':hashlib.sha256(open(prod+'/KFB_TOWN_CASTLE_STAIRS_FORM_R3_NEUTRAL.glb','rb').read()).hexdigest(),'exact_mesh_name_set_parity':set(neutral)==set(styled),'per_mesh_geometry_parity':parity,'materials':mats,'nonmanifold_position_weld':{n:o['nonmanifold_after_position_weld'] for n,o in styled.items()},'edge_metrics':{n:{k:o[k] for k in ['long_edges_dihedral_over75','max_dihedral_degrees']} for n,o in styled.items()},'context_meshes':list(terrain),'source_hill_vertices':len(sverts),'context_hill_vertices':len(tverts),'affine_source_vertex_set_match_1e_4':set(expected)==set(actual), 'affine_unique_vertex_max_nearest_delta':max([min(math.dist(v,w) for w in actual) for v in expected]+[min(math.dist(v,w) for w in expected) for v in actual]), 'affine_unique_expected_count':len(set(expected)), 'affine_unique_actual_count':len(set(actual)),'walk_surface_terrain_checks':terrain_checks,'connection_rays':connection,'terrain_above_walk_samples':[v for v in terrain_checks if v['terrain_minus_walk_z'] is not None and v['terrain_minus_walk_z']>.001]};json.dump(report,open(out+'/FINAL_independent_extension.json','w'),indent=2);print('PARITY',all(v['max_vertex_world_delta']==0 and v['polygons_exact_equal'] for v in parity.values()));print('MATERIALS',mats);print('TERRAIN ABOVE',len(report['terrain_above_walk_samples']));print('AFFINE',report['affine_source_vertex_set_match_1e_4']);print('CONNECTION',connection)
