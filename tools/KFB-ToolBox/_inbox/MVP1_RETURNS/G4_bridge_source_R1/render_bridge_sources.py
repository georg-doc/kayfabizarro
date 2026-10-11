import bpy, os, json
from mathutils import Vector, Matrix
from pathlib import Path
ROOT=Path('/private/tmp/kfb-bridge-prison-audit')
OUT=ROOT/'output/source'
SRC=Path('/Users/georgv.westphalen/Dropbox/Mac/Documents/Codex/2026-10-10/kf/work/wsa-stairs/source')
SOURCES=[('Bridge_straight',Path('/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/kfb-deck-library-r1-2026-10-09/media/3D_Assets/kenney_castle-kit/Models/GLB format/bridge-straight.glb')),('Bridge_pillar',Path('/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/kfb-deck-library-r1-2026-10-09/media/3D_Assets/kenney_castle-kit/Models/GLB format/bridge-straight-pillar.glb')),('Bridge_draw',Path('/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/kfb-deck-library-r1-2026-10-09/media/3D_Assets/kenney_castle-kit/Models/GLB format/bridge-draw.glb'))]
def aim(o,t): o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
def setup():
 s=bpy.context.scene;s.render.engine='BLENDER_EEVEE';s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100
 s.render.image_settings.file_format='JPEG';s.render.image_settings.quality=92
 s.world.color=(.35,.35,.35);s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
 s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.38,.38,.38,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.5
 for loc,power,size in [((-12,-14,24),4200,12),((14,5,16),2500,10)]:
  bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.size=size;aim(o,(0,8,3))
def camera(name,loc,target,scale):
 bpy.ops.object.camera_add(location=loc);o=bpy.context.object;o.data.type='ORTHO';o.data.ortho_scale=scale;aim(o,target);bpy.context.scene.camera=o
 bpy.context.scene.render.filepath=str(OUT/(name+'.jpg'));bpy.ops.render.render(write_still=True);bpy.data.objects.remove(o,do_unlink=True)
records=[]
for name,p in SOURCES:
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.scene.world=bpy.data.worlds.new('NeutralWorld');bpy.ops.import_scene.gltf(filepath=str(p))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];pts=[o.matrix_world@v.co for o in meshes for v in o.data.vertices]
 lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)));hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)));size=hi-lo
 # R1/R2 stay at exact native scale and transform. Small original donors receive display-only uniform scaling.
 fac=17/max(size);ctr=(lo+hi)/2
 display=Matrix.Translation(Vector((0,8,5)))@Matrix.Scale(fac,4)@Matrix.Translation(-ctr)
 orig={o:o.matrix_world.copy() for o in meshes}
 for o in meshes:o.matrix_world=display@orig[o]
 for o in meshes:
  m=bpy.data.materials.new('Neutral');m.diffuse_color=(.52,.52,.52,1);m.use_nodes=True;m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.52,.52,.52,1);m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.86;o.data.materials.clear();o.data.materials.append(m)
 setup()
 for view,loc,target,scale in [('three_quarter',(24,-24,23),(0,8,5),42),('front',(0,-32,13),(0,8,5),42),('side',(30,8,9),(0,8,5),42),('top',(0,8,35),(0,8,5),42),('below',(18,-21,-16),(0,8,5),42)]:camera(name+'_'+view,loc,target,scale)
 records.append(dict(name=name,path=str(p),native_bounds=[list(lo),list(hi)],geometry_unchanged=True,material_override='neutral QA only'))
(ROOT/'output/BRIDGE_SOURCE_METRICS.json').write_text(json.dumps(records,indent=2))
