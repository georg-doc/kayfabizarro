import bpy, math, json, hashlib, bmesh, ast
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path('/private/tmp/kfb-wsa-stairs-r3-attach');O=R/'output'
OLD=Path('/private/tmp/kfb-wsa-stairs-r3/output')
FROZEN=O/'KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb'
assert hashlib.sha256(FROZEN.read_bytes()).hexdigest()=='df59928f0d45cbd0ea6669cd78be7adc3850a766000e537c0ab5d09c73cb622c'
bpy.ops.wm.open_mainfile(filepath=str(OLD/'R3_STYLED_CONTEXT_WORK.blend'))
for o in list(bpy.context.scene.objects):
 if o.get('form_family') or o.get('context_only') or o.name.startswith('CTX_'):bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(FROZEN));stairs=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('form_family')]
src=Path(json.loads((OLD/'hill_source.json').read_text())['source']);before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(src));terrain=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH']
assert len(terrain)==1
o=terrain[0];o.name='ATTACH_R1_ADAPTED_KAYKIT_HILL';o['source_model']='KayKit hill_single_A';o['source_adaptation']='connected grounded sculpted attachment; not affine clone';o['context_only']=True
bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
source_positions=[list(v.co) for v in o.data.vertices];source_polygons=[list(p.vertices) for p in o.data.polygons]
lo=Vector([min(v.co[i] for v in o.data.vertices) for i in range(3)]);hi=Vector([max(v.co[i] for v in o.data.vertices) for i in range(3)]);size=hi-lo
# Retain the donor's organic footprint and closed earth/grass skin; subdivide
# that actual source before an explicitly documented local terrain adaptation.
sub=o.modifiers.new('Source footprint tessellation','SUBSURF');sub.subdivision_type='SIMPLE';sub.levels=3;bpy.ops.object.modifier_apply(modifier=sub.name)
bm=bmesh.new();bm.from_mesh(o.data)
for wy in [0,16.0,17.8,17.97]:
 ny=(wy-10)*size.y/38+(lo.y+hi.y)/2
 bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),plane_co=(0,ny,0),plane_no=(0,1,0),dist=1e-7,clear_inner=False,clear_outer=False)
bm.to_mesh(o.data);bm.free()
source_bvh=BVHTree.FromPolygons([v.co.copy() for v in o.data.vertices],[list(p.vertices) for p in o.data.polygons])
def smooth(a):a=max(0,min(1,a));return a*a*(3-2*a)
def field(x,y):
 # Real exit plateau; source bank follows the built wall and anchors both feet.
 h=.14+(5.08-.14)*max(0,min(1,y/16.0))
 # Quiet broad flank: lower source shoulders away from the construction.
 h-=.45*smooth((abs(x)-9)/10)*(1-smooth((y-16)/2))
 h=max(.05,h)
 # Earth inside the clear tread corridor is below actual tread planes.
 if abs(x)<5.68 and y<17.97:
  ends=[1.7,3.52,5.18,7.04,8.77,10.56,12.21,13.97,17.97];zs=[.62,1.28,1.87,2.55,3.16,3.81,4.41,5.08,5.08]
  for end,z in zip(ends,zs):
   if y<end:h=min(h,z-.17+(.17*smooth((y-17.8)/.17) if y>=17.8 else 0));break
 return h
miss=0
for v in o.data.vertices:
 p=v.co.copy();hit=source_bvh.ray_cast(Vector((p.x,p.y,hi.z+1)),Vector((0,0,-1)),3)[0]
 if hit is None:
  # exact boundary rays can be lost at a shared edge; an infinitesimal inward
  # query avoids fabricating a surface and is recorded in the source manifest.
  hit=source_bvh.ray_cast(Vector((p.x*.999999,p.y*.999999,hi.z+1)),Vector((0,0,-1)),3)[0];miss+=1
 top=hit.z if hit is not None else hi.z
 t=max(0,min(1,(p.z-lo.z)/max(.00001,top-lo.z)))
 x=(p.x-(lo.x+hi.x)/2)*40/size.x;y=(p.y-(lo.y+hi.y)/2)*38/size.y+10
 h=field(x,y);v.co=(x,y,-.20+t*(h+.20))
bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free();o.data.update();o.data.calc_loop_triangles()
# A single closed mesh replaces all three overlapping floating affine slabs.
manifest=dict(source=str(src),source_ref='52099710569a98393325ee94becf616f418b35f2',source_gltf_blob='7309269cfe6b26810ce87210ae88b603931b3351',source_bin_blob='0cd5780ace48dd9f827d346b4f688b36274ba8ea',source_native_positions=source_positions,source_native_polygons=source_polygons,source_native_bounds=[list(lo),list(hi)],adaptation='original hill SIMPLE subdivision3 with exact transverse attachment cuts; original footprint scaled40x38; single connected skin, anchored bottomZ-.20; top normalized to actual source upper envelope and documented attachment height field',boundary_queries=miss,triangles=len(o.data.loop_triangles),source_identity_status='SOURCE_ISOLATED_THEN_ADAPTED; not affine equality',stair_sha256=hashlib.sha256(FROZEN.read_bytes()).hexdigest(),stair_edited=False,exit_plateau_z=5.08,foot_bank_base_height=.14,receiving_world_edited=False)
(O/'SOURCE_AND_ATTACHMENT.json').write_text(json.dumps(manifest,indent=2))
for obj in bpy.context.scene.objects:obj.select_set(obj in stairs or obj in terrain)
bpy.ops.export_scene.gltf(filepath=str(O/'STAIRS_WITH_REPAIRED_ATTACHMENT.glb'),export_format='GLB',use_selection=True,export_yup=True,export_extras=True)
for obj in bpy.context.scene.objects:obj.select_set(obj in terrain)
bpy.ops.export_scene.gltf(filepath=str(O/'ADAPTED_HILL_ATTACHMENT.glb'),export_format='GLB',use_selection=True,export_yup=True,export_extras=True)
for obj in bpy.context.scene.objects:obj.select_set(False)
# Keep the accepted stair's existing render probe unchanged.
def role(obj):
 f=obj['form_family']
 if f=='tread':return [0,1,0,1,0,1,0,0][int(obj.name.split('_')[1])-1]
 if f=='crown':return 0
 if f=='pillar':return 0 if obj.name.endswith('cap') else 2 if obj.name.endswith('foot') else 1
 if f=='bearing':return 2 if obj.name.startswith('Foundation') else 1
 return 0
for obj in stairs:obj.data.materials.clear();obj.data.materials.append(bpy.data.materials['R2_DONOR_CLAY_'+str(role(obj))])
# Source grass/earth retain their actual palette roles; adapt only through the
# already used R2 render probe, with physical Object coordinates, no new shader owner.
tree=ast.parse(Path('/private/tmp/kfb-wsa-stairs-r2/scripts/build_stairs_r2.py').read_text());keep=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ('_clamp01','make_clay_material')];ns={'bpy':bpy};exec(compile(ast.Module(body=keep,type_ignores=[]),'R2_material_donor','exec'),ns)
original_mats=list(o.data.materials)
for i,m in enumerate(original_mats):
 # Preserve actual source atlas/UV base color instead of reading its white multiplier.
 p=m.node_tree.nodes['Principled BSDF'];p.inputs['Roughness'].default_value=.95
 tc=m.node_tree.nodes.new('ShaderNodeTexCoord');n=m.node_tree.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=5.2;n.inputs['Detail'].default_value=3.0;n.inputs['Roughness'].default_value=.72
 bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.14;bump.inputs['Distance'].default_value=.07
 m.node_tree.links.new(tc.outputs['Object'],n.inputs['Vector']);m.node_tree.links.new(n.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
scene=bpy.context.scene
def aim(obj,t):obj.rotation_euler=(Vector(t)-obj.location).to_track_quat('-Z','Y').to_euler()
views={'three_quarter':((25,-12,19),(0,14,3),41),'front':((0,-32,11),(0,8,3),32),'side':((30,8,9),(0,8,3),35),'foot_left':((-14,-6,6),(-7,1,1.6),9),'foot_right':((14,-6,6),(7,1,1.6),9),'landing_connection':((8,19,11),(0,17.9,5.08),13),'foot_eye':((0,-15,3.64),(0,8,3),28)}
for name,(loc,target,scale) in views.items():
 bpy.ops.object.camera_add(location=loc);cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=scale;aim(cam,target);scene.camera=cam;scene.render.filepath=str(O/'renders'/(name+'.jpg'));bpy.ops.render.render(write_still=True)
(O/'CAMERAS.json').write_text(json.dumps(views,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(O/'ATTACHMENT_REVIEW.blend'))
assert hashlib.sha256(FROZEN.read_bytes()).hexdigest()==manifest['stair_sha256']
print('ATTACHMENT_TRIANGLES',manifest['triangles'])
