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

bpy.ops.wm.read_factory_settings(use_empty=True);objs=track(json.loads((ROOT/'source_p1b_drift_meshes.json').read_text()));pts=[o.matrix_world@v.co for o in objs for v in o.data.vertices];lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));ctr=(lo+hi)/2;scale=max(hi-lo)*1.4;setup((1100,850));camera('source_J17_original_drift',ctr+Vector((130,-180,150)),ctr,scale)
for view,delta in [('front',(0,-250,0)),('side',(250,0,0)),('top',(0,0,250)),('below',(150,-120,-120))]:camera('source_J17_'+view,ctr+Vector(delta),ctr,scale)
for rec in [r for r in sources if r['id'] in ['Workbench_Decorated','Primitive_Floor','colored_block_blue']]:
 bpy.ops.wm.read_factory_settings(use_empty=True);objs,lo,hi=import_asset(rec);fac=22/max(hi-lo);trans=Matrix.Scale(fac,4)@Matrix.Translation(-(lo+hi)/2)
 for o in objs:o.matrix_world=trans@o.matrix_world
 setup((700,540))
 for view,loc in [('front',(0,-40,0)),('side',(40,0,0)),('top',(0,0,40))]:camera('source_'+rec['id']+'_'+view,loc,(0,0,0),36)
