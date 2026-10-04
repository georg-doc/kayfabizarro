import bpy,json,math
from mathutils import Vector
from pathlib import Path
base=Path.cwd(); data=json.loads((base/'evidence/composition.mesh.json').read_text())
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16;scene.render.resolution_x=900;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.world.use_nodes=True;scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.4,.48,.55,1);scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.7;scene.view_settings.view_transform='AgX'
def mat(hex):
 c=tuple(int(hex[i:i+2],16)/255 for i in (1,3,5));m=bpy.data.materials.new(hex);m.diffuse_color=(*c,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.9;return m
mats={}
for world in ['world.kfb-town','world.dystopia','world.utopia','world.protopia']:
 for o in list(bpy.data.objects):
  if o.type=='MESH':bpy.data.objects.remove(o,do_unlink=True)
 pts=[]
 buildings=json.loads((base/'evidence/building-clearance.json').read_text())
 for b in next(r for r in buildings if r['worldId']==world)['placed']:
  i=int(b['id'].rsplit('/',1)[-1]);before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(base/'evidence/source/buildings'/(world+'-'+str(i)+'.gltf')));new=set(bpy.data.objects)-before
  for o in new:
   if o.parent not in new:
    o.location=Vector((b['x'],-b['z'],b['base']));o.rotation_euler=(0,0,b['rotation']);o.scale=(b['scale'],)*3
 for m in data:
  if m['worldId']!=world:continue
  p=m['positions'];v=[(p[i],-p[i+2],p[i+1]) for i in range(0,len(p),3)];ind=m['indices'] or list(range(len(v)));f=[ind[i:i+3] for i in range(0,len(ind),3)];mesh=bpy.data.meshes.new(m['name']);mesh.from_pydata(v,[],f);mesh.update();o=bpy.data.objects.new(m['name'],mesh);scene.collection.objects.link(o)
  if m['color'] not in mats:mats[m['color']]=mat(m['color'])
  o.data.materials.append(mats[m['color']]);pts.extend(v)
  if m.get('colors'):
   cm=bpy.data.materials.new(m['name']+' vertex palette');cm.use_nodes=True;nt=cm.node_tree;attr=nt.nodes.new('ShaderNodeVertexColor');attr.layer_name='palette';nt.links.new(attr.outputs['Color'],nt.nodes.get('Principled BSDF').inputs['Base Color']);nt.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.9;o.data.materials[0]=cm;col=mesh.color_attributes.new(name='palette',type='FLOAT_COLOR',domain='POINT')
   for k,item in enumerate(col.data):item.color=(*m['colors'][k*3:k*3+3],1)
  for face in mesh.polygons:face.use_smooth=True
 lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));center=(lo+hi)/2;span=max(hi-lo)
 if not scene.camera:
  bpy.ops.object.camera_add();scene.camera=bpy.context.object
 cam=scene.camera;cam.data.type='ORTHO';cam.data.ortho_scale=span*1.2;cam.location=center+Vector((span*1.1,-span*1.5,span*.26));cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
 if not any(o.type=='LIGHT' for o in scene.objects):
  bpy.ops.object.light_add(type='SUN');sun=bpy.context.object;sun.data.energy=3;sun.rotation_euler=(.4,-.5,-.5)
 scene.render.filepath=str(base/'evidence'/('underside-'+world+'.png'));bpy.ops.render.render(write_still=True)
