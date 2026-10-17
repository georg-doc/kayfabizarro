import bpy, bmesh, json
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/tmp/p0a/out/building_A__kfb-clay-k2-baked-p0a.glb')
o=[x for x in bpy.context.scene.objects if x.type=='MESH'][0]; me=o.data
bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.triangulate(bm,faces=bm.faces); tris=len(bm.faces); bm.free()
bb=[o.matrix_world@Vector(c) for c in o.bound_box]
imgs=[(i.name,i.size[0],i.size[1],i.has_data, i.colorspace_settings.name) for i in bpy.data.images]
uvnodes=[n.uv_map for n in o.material_slots[0].material.node_tree.nodes if n.type=='UVMAP']
r=dict(object=o.name, mesh=me.name, triangles=tris, vertices=len(me.vertices), uv_maps=[u.name for u in me.uv_layers], materials=[m.name for m in me.materials], images=imgs, material_uv_nodes=uvnodes,
  missing=[i.name for i in bpy.data.images if not i.has_data], bounds_zup=dict(min=[min(v[i] for v in bb) for i in range(3)],max=[max(v[i] for v in bb) for i in range(3)]), origin=list(o.location))
print('REIMPORT',json.dumps(r)); json.dump(r,open('/tmp/p0a/work/reimport.json','w'),indent=1)
import math
sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE'; sc.render.resolution_x=1000; sc.render.resolution_y=750; sc.eevee.taa_render_samples=16
w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.59,0.75,0.87,1)
sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=3; sun.rotation_euler=(math.radians(58),0,math.radians(-38)); sc.collection.objects.link(sun)
cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.sensor_fit='VERTICAL'; cam.data.angle=math.radians(34)
o.scale=(3.2/1.65,)*3; c=Vector((0,0,1.6)); d=6.0; el=math.radians(30); az=math.radians(28)
cam.location=c+Vector((math.sin(az)*math.cos(el)*d,-math.cos(az)*math.cos(el)*d,math.sin(el)*d)); cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.filepath='/tmp/p0a/out/evidence/09_glb_reimport_blender.png'; bpy.ops.render.render(write_still=True); print('RENDERED')
