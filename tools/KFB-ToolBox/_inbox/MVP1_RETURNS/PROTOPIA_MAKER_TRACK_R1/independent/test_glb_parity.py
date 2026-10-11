import bpy,json,hashlib,math,struct
from pathlib import Path
from mathutils import Vector,kdtree
root=Path(__file__).resolve().parents[1];path=root/'candidate.glb';raw=path.read_bytes();truth=json.loads((root/'scene_geometry.json').read_text());native=json.loads((root/'track_meshes.json').read_text())
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(path));bpy.context.view_layer.update();meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];out=[]
for name in ['fahrbahn','strang','markings']:
 reference=next(o for o in truth if o['name']==name);objects=[o for o in meshes if o.name==name or o.name.startswith(name+'.')];vertices=[o.matrix_world@v.co for o in objects for v in o.data.vertices];kd=kdtree.KDTree(len(vertices))
 for i,v in enumerate(vertices):kd.insert(v,i)
 kd.balance();dists=[kd.find(Vector(v))[2]for v in reference['vertices']];rk=kdtree.KDTree(len(reference['vertices']))
 for i,v in enumerate(reference['vertices']):rk.insert(Vector(v),i)
 rk.balance();reverse=[rk.find(v)[2]for v in vertices]
 tris=sum(len(o.data.polygons)for o in objects)
 donor=next(o for o in native if o['name']==name);p=donor['positions'];donorvs=[Vector((p[i],-p[i+2],p[i+1]))for i in range(0,len(p),3)];dd=[kd.find(v)[2]for v in donorvs]
 out.append({'name':name,'imported_mesh_objects':len(objects),'reference_vertices':len(reference['vertices']),'imported_vertices':len(vertices),'reference_triangles':len(reference['triangles']),'imported_triangles':tris,'reference_to_glb_max_m':max(dists),'glb_to_reference_max_m':max(reverse),'native_source_to_glb_max_m':max(dd),'pass':max(dists+reverse+dd)<=1e-4 and tris==len(reference['triangles'])})
receipt={'glb_sha256':hashlib.sha256(raw).hexdigest(),'tested_scene_geometry_sha256':hashlib.sha256((root/'scene_geometry.json').read_bytes()).hexdigest(),'Blender_evaluated_mesh_count':len(truth),'GLB_imported_mesh_objects':len(meshes),'GLB_json_mesh_records':len(json.loads(raw[20:20+struct.unpack_from('<I',raw,12)[0]])['meshes']),'GLB_json_primitives':sum(len(m['primitives'])for m in json.loads(raw[20:20+struct.unpack_from('<I',raw,12)[0]])['meshes']),'GLB_material_split_explanation':'152 mesh records / Blender mesh objects; 160 material primitives are not distinct geometry objects.','tolerance_m':1e-4,'coordinates':'Blender importer restores glTF[x,z,-y] to Blender[x,y,z]; native Three[x,y,z] compared as Blender[x,-z,y].','road_body_markings':out,'pass':all(o['pass']for o in out),'limits':'World vertex bidirectional nearest-neighbor distance and triangle counts; does not verify procedural shader visual fidelity or add browser collision proof.'}
(root/'independent/glb_parity_receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt,indent=2))
