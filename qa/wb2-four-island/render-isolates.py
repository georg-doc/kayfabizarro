import bpy,json,math
from mathutils import Vector
from pathlib import Path
base=Path.cwd(); data=json.loads((base/'evidence/tree-isolates.mesh.json').read_text())
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16;scene.render.resolution_x=900;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.world.color=(.2,.25,.3);scene.view_settings.view_transform='AgX'
def mat(hex):
 c=tuple(int(hex[i:i+2],16)/255 for i in (1,3,5));m=bpy.data.materials.new(hex);m.diffuse_color=(*c,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.9;return m
mats={}
for world in ['world.kfb-town','world.dystopia','world.utopia','world.protopia']:
 for o in list(bpy.data.objects):
  if o.type=='MESH':bpy.data.objects.remove(o,do_unlink=True)
 pts=[]
 for m in data:
  if m['worldId']!=world:continue
  p=m['positions'];v=[(p[i],-p[i+2],p[i+1]) for i in range(0,len(p),3)];ind=m['indices'] or list(range(len(v)));f=[ind[i:i+3] for i in range(0,len(ind),3)];mesh=bpy.data.meshes.new(m['name']);mesh.from_pydata(v,[],f);mesh.update();o=bpy.data.objects.new(m['name'],mesh);scene.collection.objects.link(o)
  if m['color'] not in mats:mats[m['color']]=mat(m['color'])
  o.data.materials.append(mats[m['color']]);pts.extend(v)
  for face in mesh.polygons:face.use_smooth=True
 lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));center=(lo+hi)/2;span=max(hi-lo)
 if not scene.camera:
  bpy.ops.object.camera_add();scene.camera=bpy.context.object
 cam=scene.camera;cam.data.type='ORTHO';cam.data.ortho_scale=span*1.2;cam.location=center+Vector((span*1.1,-span*1.5,span*.55));cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
 if not any(o.type=='LIGHT' for o in scene.objects):
  bpy.ops.object.light_add(type='SUN');sun=bpy.context.object;sun.data.energy=3;sun.rotation_euler=(.4,-.5,-.5)
 scene.render.filepath=str(base/'evidence'/('isolate-'+world+'.png'));bpy.ops.render.render(write_still=True)
