import bpy,json,math,random
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'renders';OUT.mkdir(exist_ok=True)
sources=json.loads((ROOT/'source_manifest.json').read_text())
random.seed(47)
def aim(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def setup(size=(1800,1100)):
 s=bpy.context.scene;s.render.engine='BLENDER_EEVEE';s.render.resolution_x,s.render.resolution_y=size;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.film_transparent=False
 s.world=bpy.data.worlds.new('Warm studio');s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.66,.74,.78,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.65
 s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
 for loc,pow,size in [((-160,-220,300),1400000,220),((200,100,250),1000000,180)]:
  bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=pow;o.data.shape='DISK';o.data.size=size;aim(o,(20,-30,0))
def camera(name,loc,target,scale):
 bpy.ops.object.camera_add(location=loc);o=bpy.context.object;o.data.type='ORTHO';o.data.ortho_scale=scale;aim(o,target);bpy.context.scene.camera=o;s=bpy.context.scene;s.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True);bpy.data.objects.remove(o,do_unlink=True)
def mat(name,hexcol,clay=True):
 m=bpy.data.materials.new(name);m.use_nodes=True;c=tuple(int(hexcol[i:i+2],16)/255 for i in (1,3,5));c=tuple(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c);m.diffuse_color=(*c,1)
 n=m.node_tree.nodes;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.86
 if clay:
  tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=.7;tex.inputs['Detail'].default_value=2.4;tex.inputs['Roughness'].default_value=.7;coord=n.new('ShaderNodeTexCoord');m.node_tree.links.new(coord.outputs['Object'],tex.inputs['Vector']);b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.4;b.inputs['Distance'].default_value=.35;m.node_tree.links.new(tex.outputs['Fac'],b.inputs['Height']);m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
 return m
def mesh(name,pts,faces,m):
 d=bpy.data.meshes.new(name);d.from_pydata(pts,[],faces);d.update();o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.data.materials.append(m);return o
def track(meshes,neutral=False):
 mats={n:mat(n,c,not neutral) for n,c in [('strang','#ef5a22'),('fahrbahn','#3d4a60'),('markings','#f1eadc')]}
 objs=[]
 for rec in meshes:
  p=rec['positions'];pts=[(p[i],-p[i+2],p[i+1]) for i in range(0,len(p),3)];ids=rec['indices'];faces=[tuple(ids[i:i+3]) for i in range(0,len(ids),3)] if ids else [tuple(range(i,i+3)) for i in range(0,len(pts),3)]
  o=mesh(rec['name'],pts,faces,mat('neutral','#a8a6a0',False) if neutral else mats.get(rec['name'],mats['strang']));o['source']='Literal J16-r2 / J17 inherited T4 geometry';objs.append(o)
 return objs
def import_asset(rec):
 before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/rec['local']));objs=[o for o in set(bpy.context.scene.objects)-before if o.type=='MESH'];pts=[o.matrix_world@v.co for o in objs for v in o.data.vertices];lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));return objs,lo,hi
metrics=[]
for rec in sources:
 if (OUT/('source_'+rec['id']+'.png')).exists():continue
 bpy.ops.wm.read_factory_settings(use_empty=True);objs,lo,hi=import_asset(rec);size=hi-lo;fac=22/max(size);xform=Matrix.Scale(fac,4)@Matrix.Translation(-(lo+hi)/2)
 for o in objs:o.matrix_world=xform@o.matrix_world
 setup((700,540));camera('source_'+rec['id'],(34,-44,31),(0,0,0),36)
 metrics.append({**rec,'native_blender_bbox':[list(lo),list(hi)],'triangles':sum(len(o.data.polygons[i].vertices)-2 for o in objs for i in range(len(o.data.polygons))),'original_materials':True,'geometry_unchanged':True})
if (ROOT/'source_metrics.json').exists():metrics=json.loads((ROOT/'source_metrics.json').read_text())+metrics
(ROOT/'source_metrics.json').write_text(json.dumps(metrics,indent=2))
bpy.ops.wm.read_factory_settings(use_empty=True);tm=json.loads((ROOT/'track_meshes.json').read_text());track(tm);setup((1400,850));camera('source_J17_inherited_strand',(260,-260,200),(32,56,0),460)
bpy.ops.wm.read_factory_settings(use_empty=True);tube_path=ROOT/'donors/j16/KFB_JOYRIDE_J16_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/blender/tc1-race-tube.v1.glb';bpy.ops.import_scene.gltf(filepath=str(tube_path));pts=[o.matrix_world@v.co for o in bpy.context.scene.objects if o.type=='MESH' for v in o.data.vertices];lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));ctr=(lo+hi)/2;setup((1200,850));camera('source_RaceTube',ctr+Vector((190,-190,140)),ctr,230)
bpy.ops.wm.read_factory_settings(use_empty=True);setup();track(tm)
palette={n:mat(n,c) for n,c in [('soil','#9a7656'),('rock','#8b7968'),('grass','#88a954'),('patch','#b5bd6b'),('path','#ddc59a'),('orange','#ef5a22'),('blue','#5983ac'),('yellow','#f2b632'),('wood','#8a5a3a'),('crop','#4d843e')]}
S=json.loads((ROOT/'candidate.stream.json').read_text())['samples'];road=[(q['p'][0],-q['p'][2]) for q in S]
def near_road(x,y):return min(math.hypot(x-a,y-b) for a,b in road[::4])
islands=[('Protopia',(-196,88),88,74),('MakerSpace',(228,6),102,83)]
for name,(cx,cy),rx,ry in islands:
 N=96;pts=[(cx,cy,0)];rings=[]
 for r,zbase in [(0.25,0),(0.55,0),(.8,0),(1,0),(.97,-14),(.82,-32),(.56,-56),(.25,-72)]:
  ids=[]
  for k in range(N):
   a=2*math.pi*k/N;w=1+.045*math.sin(5*a)+.035*math.sin(9*a+1.4);x=cx+rx*r*w*math.cos(a);y=cy+ry*r*w*math.sin(a);dist=near_road(x,y)
   z=zbase+(1.4*math.sin(x*.035)*math.sin(y*.046) if zbase==0 and dist>18 and name=='Protopia' else 0)
   if zbase==0 and dist<13:z=-2.24
   if zbase<0:z+=2.2*math.sin(k*2.4+r*12)
   ids.append(len(pts));pts.append((x,y,z))
  rings.append(ids)
 faces=[(0,rings[0][k],rings[0][(k+1)%N]) for k in range(N)];mi=[2]*N
 for j in range(len(rings)-1):
  for k in range(N):faces.append((rings[j][k],rings[j+1][k],rings[j+1][(k+1)%N],rings[j][(k+1)%N]));mi.append(2 if j<3 else random.choice([0,0,1]))
 pts.append((cx,cy,-79));bot=len(pts)-1
 for k in range(N):faces.append((rings[-1][k],bot,rings[-1][(k+1)%N]));mi.append(0)
 o=mesh(name+'_terrain',pts,faces,palette['soil']);o.data.materials.append(palette['rock']);o.data.materials.append(palette['grass'])
 for p,i in zip(o.data.polygons,mi):p.material_index=i
 bevel=o.modifiers.new('Soft clay facets','BEVEL');bevel.width=.5;bevel.segments=2;o['hand_built_candidate']=True
library={}
for rec in sources:
 objs,lo,hi=import_asset(rec);library[rec['id']]=(objs,lo,hi)
 for o in objs:o.hide_render=True;o.hide_viewport=True
def place(id,x,y,z,target,rot=0):
 if z==1 or z==2:
  terrain=bpy.data.objects.get('Protopia_terrain' if x<0 else 'MakerSpace_terrain');hit,p,normal,index=terrain.ray_cast(Vector((x,y,200)),Vector((0,0,-1)))
  if hit:z=p.z+.025
 objs,lo,hi=library[id];fac=target/max(hi-lo);trans=Matrix.Translation((x,y,z))@Matrix.Rotation(rot,4,'Z')@Matrix.Scale(fac,4)@Matrix.Translation(Vector((-(lo.x+hi.x)/2,-(lo.y+hi.y)/2,-lo.z)))
 clones=[]
 for src in objs:
  o=src.copy();o.data=src.data.copy();bpy.context.collection.objects.link(o);o.hide_render=False;o.hide_viewport=False;o.matrix_world=trans@src.matrix_world;o.name=id+'_placed';o['source_id']=id
  for old in list(o.data.materials):
   if old and old.use_nodes:
    m=old.copy();n=m.node_tree.nodes;p=n.get('Principled BSDF')
    if p:
     p.inputs['Roughness'].default_value=.88;t=n.new('ShaderNodeTexNoise');t.inputs['Scale'].default_value=8;b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.15;b.inputs['Distance'].default_value=.035;m.node_tree.links.new(t.outputs['Fac'],b.inputs['Height']);m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
    o.data.materials[o.data.materials[:].index(old)]=m
  clones.append(o)
 return clones
def box(name,loc,size,m,bevel=.5):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if bevel:b=o.modifiers.new('hand rounded','BEVEL');b.width=bevel;b.segments=3
 return o
# Protopia is communal farm, source house/mill and repaired foot paths.
place('building_home_A_red',-205,110,1,38);place('building_windmill_red',-235,132,2,47)
for x,y in [(-259,73),(-252,108),(-189,143),(-143,128),(-235,40),(-177,35)]:place('tree_single_A',x,y,1,22)
for r in range(5):
 box('cultivated_soil',(-213+r*12,61,1.4),(9,27,1.4),palette['soil'])
 for k in range(8):
  bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,radius=1.4,location=(-213+r*12,50+k*3,3));o=bpy.context.object;o.name='hand_built_crop';o.scale=(1,1,.65);o.data.materials.append(palette['crop'])
box('farm_shared_path',(-191,88,1.1),(68,5,.5),palette['path'])
place('Workbench_Decorated',-174,114,1,9);place('Pallet_Large',-157,114,1,6);place('wood',-165,123,1,4)
# Source modular Maker construction stays off the drive corridor.
for x,y in [(214,-36),(238,-36),(262,-36),(238,-59)]:
 for dx,dy in [(-7,-7),(-7,7),(7,-7),(7,7)]:place('Primitive_Pillar',x+dx,y+dy,1,13)
 place('Primitive_Floor',x,y,14,20)
 for dx,dy in [(-7,-7),(7,7)]:place('Primitive_Pillar',x+dx,y+dy,15,13)
 place('Primitive_Floor',x,y,28,20)
place('Primitive_Stairs',190,-37,1,18,math.pi/2)
for x,y in [(278,-7),(247,0),(217,-12),(282,-42),(261,35),(237,40)]:place('Workbench_Decorated',x,y,1,9);place('Pallet_Large',x+8,y+3,1,5)
for x,y in [(276,-10),(246,1),(216,-13),(258,35)]:
 place('anvil',x,y,1,4);place('saw',x+4,y+4,4.5,2.3);place('blueprint',x-4,y+2,4.5,2.5)
for x,y in [(209,-42),(237,-42),(260,-41),(238,-65)]:
 place('Workbench_Decorated',x,y,15,8);place('wood',x+4,y+4,15,5);place('colored_block_blue',x-6,y,15,4)
for x,y in [(209,61),(251,62),(289,41)]:place('colored_block_blue',x,y,1,6);place('metal',x+7,y,1,5)
box('Maker_shared_route',(255,-20,.2),(92,5,.4),palette['path']);box('Maker_repaired_path',(260,24,.2),(70,4,.4),palette['path'])
for x,y,z,c in [(286,-28,1,'colored_block_blue'),(294,-28,1,'colored_block_yellow'),(294,-28,9,'metal'),(268,4,1,'wood'),(276,4,1,'colored_block_blue'),(276,4,9,'colored_block_yellow'),(218,-70,1,'metal')]:place(c,x,y,z,8)
for x,y in [(302,13),(281,53),(184,-55),(206,64)]:place('tree_single_A',x,y,1,18)
for srcs,lo,hi in library.values():
 for o in srcs:bpy.data.objects.remove(o,do_unlink=True)
# Record evaluated geometry before styling review, permit independent collision queries.
deps=bpy.context.evaluated_depsgraph_get();report=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH':
  ob=o.evaluated_get(deps);me=ob.to_mesh();me.calc_loop_triangles();report.append({'name':o.name,'source_id':o.get('source_id'),'vertices':[list(ob.matrix_world@v.co) for v in me.vertices],'triangles':[list(t.vertices) for t in me.loop_triangles]});ob.to_mesh_clear()
(ROOT/'scene_geometry.json').write_text(json.dumps(report))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'candidate.blend'))
# Actual neutral construction before styled views.
original={o:(list(o.data.materials),[p.material_index for p in o.data.polygons]) for o in bpy.context.scene.objects if o.type=='MESH'};neutral=mat('Neutral form','#a6a39c',False)
for o in original:o.data.materials.clear();o.data.materials.append(neutral)
camera('neutral_two_islands',(370,590,360),(25,52,-5),650)
for o,(ms,indices) in original.items():
 o.data.materials.clear();[o.data.materials.append(m) for m in ms]
 for p,i in zip(o.data.polygons,indices):p.material_index=i
camera('clay_two_islands',(370,590,360),(25,52,-5),650)
camera('clay_reverse',(-380,-470,330),(20,50,-4),650)
camera('clay_makerspace',(365,220,185),(236,-17,12),240)
camera('clay_track_contact',(60,205,75),(130,38,-2),230)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'candidate.blend'))
