import bpy, json, ast, math, shutil, hashlib
from pathlib import Path
from mathutils import Vector, Matrix
R=Path('/private/tmp/kfb-wsa-stairs-r3');O=R/'output';(O/'renders/kfb_clay').mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(O/'R3_NEUTRAL_WORK.blend'))
asset=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('form_family')]
if not (O/'KFB_TOWN_CASTLE_STAIRS_FORM_R3_NEUTRAL.glb').exists():shutil.copyfile(O/'KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb',O/'KFB_TOWN_CASTLE_STAIRS_FORM_R3_NEUTRAL.glb')
def hex_rgba(h):
 h=h.lstrip('#');v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 def lin(x):return x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4
 return tuple(lin(x) for x in v)+(1,)
def make_base(name,h):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=hex_rgba(h);p=m.node_tree.nodes['Principled BSDF'];p.inputs['Base Color'].default_value=m.diffuse_color;p.inputs['Roughness'].default_value=.88
 return m
palette=['#e6d4b5','#d1ba99','#b29c7d','#9e856b'];base=[make_base('KFB_FamilyA_'+str(i),h) for i,h in enumerate(palette)]
def role(o):
 f=o['form_family']
 if f=='tread':return [0,1,0,1,0,1,0,0][int(o.name.split('_')[1])-1]
 if f=='crown':return 0
 if f=='pillar':return 0 if o.name.endswith('cap') else 2 if o.name.endswith('foot') else 1
 if f=='bearing':return 2 if o.name.startswith('Foundation') else 1
 return 0
for o in asset:o.data.materials.clear();o.data.materials.append(base[role(o)]);o.select_set(True)
for o in bpy.context.scene.objects:
 if o not in asset:o.select_set(False)
bpy.ops.export_scene.gltf(filepath=str(O/'KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_extras=True)
for o in asset:o.select_set(False)
# Reuse actual existing R2 procedural material donor. Only change coordinate source
# from bounding-box Generated to stable object-space XYZ, and lower relief slightly.
donor=Path('/private/tmp/kfb-wsa-stairs-r2/scripts/build_stairs_r2.py')
tree=ast.parse(donor.read_text());keep=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ('_clamp01','make_clay_material')]
ns={'bpy':bpy};exec(compile(ast.Module(body=keep,type_ignores=[]),str(donor),'exec'),ns)
styled=[ns['make_clay_material']('R2_DONOR_CLAY_'+str(i),hex_rgba(h),i) for i,h in enumerate(palette)]
for m in styled:
 links=m.node_tree.links
 for l in list(links):
  if l.from_node.type=='TEX_COORD' and l.from_socket.name=='Generated':
   target=l.to_socket;source=l.from_node.outputs['Object'];links.remove(l);links.new(source,target)
 for n in m.node_tree.nodes:
  if n.type=='BUMP':n.inputs['Strength'].default_value=.14;n.inputs['Distance'].default_value=.07
 m['provenance']='R2 procedural render donor; fixed object-space coordinates; not K1/K2 Golden parity'
for o in asset:o.data.materials.clear();o.data.materials.append(styled[role(o)])
def aim(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.32,.30,.27,1)
bpy.ops.mesh.primitive_plane_add(size=100,location=(0,8,-.025));floor=bpy.context.object;floor.name='QA_shadow_floor';floor.data.materials.append(make_base('NeutralFloor','#d5c9b7'));floor['render_only']=True
cams=json.loads((O/'camera_lock.json').read_text())
def render(name,loc,target,scale,folder):
 bpy.ops.object.camera_add(location=loc);cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=scale;aim(cam,target);scene.camera=cam
 scene.render.filepath=str(O/folder/(name+'.jpg'));bpy.ops.render.render(write_still=True)
for name in ['front','three_quarter','side','foot_eye']:
 loc,target,scale=cams[name];render(name,loc,target,scale,'renders/kfb_clay')
# Source-bound terrain context: actual KayKit hill, only scale/translation.
src=Path(json.loads((O/'hill_source.json').read_text())['source']);before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(src));hill=[o for o in scene.objects if o not in before and o.type=='MESH']
pts=[o.matrix_world@v.co for o in hill for v in o.data.vertices];lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);size=hi-lo
scale=Vector((35/size.x,18/size.y,5.08/size.z));center=(lo+hi)/2
for o in hill:
 o.name='CTX_REAL_KAYKIT_HILL_'+o.name;o.scale=Vector(tuple(o.scale[i]*scale[i] for i in range(3)));o.location=Vector(tuple((o.location[i]-center[i])*scale[i] for i in range(3)))+Vector((0,20.5,2.54));o['context_only']=True;o['source_model']='KayKit hill_single_A'
 bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.select_set(False)
 # Preserve original grass/earth role colors; use original materials, no purchased maps.
instances=[dict(role='upper_terrace',axis_scales=list(scale),center=[0,20.5,2.54],x_rotation=0)]
for side,sign in [('L',-1),('R',1)]:
 before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(src));added=[o for o in scene.objects if o not in before and o.type=='MESH']
 bankscale=Vector((12/size.x,26/size.y,.9/size.z));angle=math.atan(5.08/18)
 affine=Matrix.Translation(Vector((sign*12.6,9,2.10)))@Matrix.Rotation(angle,4,'X')@Matrix.Diagonal(Vector((*bankscale,1)))@Matrix.Translation(-center)
 for o in added:
  o.name='CTX_REAL_SIDE_'+side+'_'+o.name;o.matrix_world=affine@o.matrix_world;o['context_only']=True;o['source_model']='KayKit hill_single_A';o['affine_only']=True
 hill+=added
 instances.append(dict(role='bank_'+side,axis_scales=list(bankscale),center=[sign*12.6,9,2.10],x_rotation=angle,matrix=list(map(list,affine))))
context_transform=dict(native_bounds=[list(lo),list(hi)],instances=instances,vertex_deformation=False,owner='KayKit hill_single_A render-only context; receiving terrain untouched',source=str(src),source_ref='52099710569a98393325ee94becf616f418b35f2')
(O/'context_transform.json').write_text(json.dumps(context_transform,indent=2))
render('hill_connection',(25,-12,19),(0,14,3),41,'renders/kfb_clay')
render('hill_contact_detail',(16,11,13),(6,16.8,4.5),13,'renders/kfb_clay')
bpy.ops.wm.save_as_mainfile(filepath=str(O/'R3_STYLED_CONTEXT_WORK.blend'))
# Context-only export for independent tester/critic access, never the isolated production asset.
for o in scene.objects:o.select_set(o in hill)
bpy.ops.export_scene.gltf(filepath=str(O/'CONTEXT_ONLY_KAYKIT_HILL.glb'),export_format='GLB',use_selection=True,export_yup=True)
for o in hill:o.hide_render=True;o.select_set(False)
# Same new camera/light/floor for real R2 baseline comparison.
for o in asset:o.hide_render=True
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath='/private/tmp/kfb-wsa-stairs-r2/upload/KFB_TOWN_CASTLE_CLAY_STAIRS_R2.glb');r2=[o for o in scene.objects if o not in before and o.type=='MESH']
for o in r2:
 role_i=0 if 'Core' in o.name else 1 if 'Wall_L' in o.name else 2 if 'Wall_R' in o.name else 3
 o.data.materials.clear();o.data.materials.append(styled[role_i])
loc,target,scale=cams['three_quarter'];render('R2_styled_three_quarter',loc,target,scale,'renders/source')
for o in r2:bpy.data.objects.remove(o,do_unlink=True)
(O/'MATERIAL_PROVENANCE_R3.json').write_text(json.dumps(dict(donor='tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_modelling_test/TUNE_R2/build_stairs_r2.py',donor_ref='52099710569a98393325ee94becf616f418b35f2',donor_blob='fc43d03108ce20ada0448208252a0080b3ad7258',functions=['_clamp01','make_clay_material'],adaptation='Object-rest-space coordinates; bump strength .14 distance .07; correct sRGB->linear Family A colors',palette=palette,geometry_changed=False,GLB='Family A base colors/roughness only; procedural micro-surface is Blender-render-only',runtime_microtexture='QUARANTINED_OPTIONAL_BAKE_SEAM; no repeat bake',K2_integrated=False,golden_parity='NOT_TESTED'),indent=2))
