import bpy, bmesh, json, math, os, sys
from mathutils import Vector
OUT='/tmp/p0a/work'; EV='/tmp/p0a/out/evidence'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath='/tmp/p0a/src/donor/building_A.gltf')
src=[o for o in bpy.context.scene.objects if o.type=='MESH'][0]
me=src.data
bm=bmesh.new(); bm.from_mesh(me); bmesh.ops.triangulate(bm,faces=bm.faces); tris=len(bm.faces); bm.free()
bb=[src.matrix_world@Vector(c) for c in src.bound_box]
mn=[min(v[i] for v in bb) for i in range(3)]; mx=[max(v[i] for v in bb) for i in range(3)]
facts=dict(blender=bpy.app.version_string, object=src.name, mesh=me.name, materials=[m.name for m in me.materials], material_slots=len(src.material_slots),
  vertices=len(me.vertices), polygons=len(me.polygons), triangles=tris, uv_maps=[u.name for u in me.uv_layers],
  bounds_blender_zup=dict(min=mn,max=mx), origin=list(src.location), rotation=list(src.rotation_euler), scale=list(src.scale),
  children=[c.name for c in src.children], custom_props={k:str(v) for k,v in src.items()}, empties=[o.name for o in bpy.context.scene.objects if o.type=='EMPTY'])
json.dump(facts,open(OUT+'/source_facts.json','w'),indent=1); print('FACTS',json.dumps(facts))
# isolation render (neutral studio, no clay)
sc=bpy.context.scene; sc.render.engine='BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
sc.render.resolution_x=1200; sc.render.resolution_y=900; sc.eevee.taa_render_samples=16
w=bpy.data.worlds.new('W'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.85,0.87,0.9,1); w.node_tree.nodes['Background'].inputs[1].default_value=1.0
sun=bpy.data.objects.new('Sun',bpy.data.lights.new('Sun','SUN')); sun.data.energy=3; sun.rotation_euler=(math.radians(50),0,math.radians(-38)); sc.collection.objects.link(sun)
cam=bpy.data.objects.new('Cam',bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.lens=50
c=Vector(((mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2)); d=6.0/1.9394*1.7  # wider than the 6 m comparison view so the whole donor is visible
el=math.radians(30); az=math.radians(-35)
cam.location=c+Vector((math.sin(az)*math.cos(el)*d, -math.cos(az)*math.cos(el)*d, math.sin(el)*d))
cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.filepath=EV+'/01_source_isolation.png'; bpy.ops.render.render(write_still=True)
# working copy
col=bpy.data.collections.new('KFB_CLAY_BAKE_P0A'); sc.collection.children.link(col)
wc=src.copy(); wc.data=src.data.copy(); wc.name='building_A__kfb_clay_p0a'; col.objects.link(wc)
src.hide_render=True; src.hide_set(True)
uv=wc.data.uv_layers.new(name='KFB_CLAY_UV')
wc.data.uv_layers.active=uv
bpy.context.view_layer.objects.active=wc
for o in bpy.context.view_layer.objects: o.select_set(o==wc)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.012, area_weight=0.0, scale_to_bounds=False)
bpy.ops.uv.pack_islands(udim_source='CLOSEST_UDIM', rotate=True, margin_method='FRACTION', margin=0.008, shape_method='CONCAVE')
bpy.ops.object.mode_set(mode='OBJECT')
wc.data.uv_layers.active=wc.data.uv_layers[0]  # keep UV0 active/first
# UV1 stats: overlap check (rasterize)
import numpy as np
loops=wc.data.loops; u1=wc.data.uv_layers['KFB_CLAY_UV'].data
N=1024; cnt=np.zeros((N,N),np.uint16)
from mathutils.geometry import tessellate_polygon
area=0.0
for p in wc.data.polygons:
  pts=[u1[li].uv.copy() for li in p.loop_indices]
  for i in range(1,len(pts)-1):
    a,b,cc=pts[0],pts[i],pts[i+1]
    area+=abs((b-a).cross(cc-a))/2
    xs=[a.x,b.x,cc.x]; ys=[a.y,b.y,cc.y]
    x0,x1=max(0,int(min(xs)*N)),min(N-1,int(max(xs)*N)); y0,y1=max(0,int(min(ys)*N)),min(N-1,int(max(ys)*N))
    for y in range(y0,y1+1):
      for x in range(x0,x1+1):
        px,py=(x+0.5)/N,(y+0.5)/N
        def s(p1,p2): return (p2.x-p1.x)*(py-p1.y)-(p2.y-p1.y)*(px-p1.x)
        d1,d2,d3=s(a,b),s(b,cc),s(cc,a)
        if (d1>=0 and d2>=0 and d3>=0) or (d1<=0 and d2<=0 and d3<=0): cnt[y,x]+=1
uvst=dict(uv1_area_fraction=round(area,4), texels_covered_1024=int((cnt>0).sum()), texels_overlap_1024=int((cnt>1).sum()))
print('UV1',uvst); json.dump(uvst,open(OUT+'/uv1_stats.json','w'))
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/p0a_stage1.blend')
for o in bpy.context.view_layer.objects: o.select_set(o==wc)
bpy.ops.export_scene.gltf(filepath=OUT+'/building_A__uv1_lowpoly.glb', export_format='GLB', use_selection=True, export_texcoords=True, export_normals=True, export_materials='NONE', export_yup=True)
print('DONE')
