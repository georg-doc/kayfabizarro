import bpy, math, sys
from mathutils import Vector
import numpy as np
FIG,PATH,TAG=sys.argv[sys.argv.index('--')+1:sys.argv.index('--')+4]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=PATH)
sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x=800; sc.render.resolution_y=800; sc.eevee.taa_render_samples=24
sc.view_settings.view_transform='Standard'
w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.62,0.66,0.7,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.55
sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=2.6; sun.rotation_euler=(math.radians(55),0,math.radians(-25)); sc.collection.objects.link(sun)
head=[o for o in sc.objects if o.type=='MESH' and o.name.endswith('_Head')][0]
dg=bpy.context.evaluated_depsgraph_get(); he=head.evaluated_get(dg); me=he.to_mesh()
P=np.array([list(head.matrix_world@v.co) for v in me.vertices]); he.to_mesh_clear()
c=Vector(P.mean(0)); r=float((P.max(0)-P.min(0)).max())
for o in sc.objects:
  if o.type=='EMPTY': o.hide_render=True
cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=85
for view,az,el in (('front',0,4),('34',35,8)):
  a=math.radians(az); e=math.radians(el); d=r*4.2
  cam.location=c+Vector((math.sin(a)*math.cos(e)*d,-math.cos(a)*math.cos(e)*d,math.sin(e)*d)); cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
  sc.render.filepath=f'/tmp/eye/work/r_{FIG}_{TAG}_{view}.png'; bpy.ops.render.render(write_still=True)
print('OK')
