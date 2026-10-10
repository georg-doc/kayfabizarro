import bpy, os, json
from mathutils import Vector
from pathlib import Path
ROOT=Path('/private/tmp/kfb-wsa-stairs-r3')
OUT=ROOT/'output/renders/source'
SRC=Path('/Users/georgv.westphalen/Dropbox/Mac/Documents/Codex/2026-10-10/kf/work/wsa-stairs/source')
SOURCES=[('R1',Path('/private/tmp/kfb-wsa-stairs/upload/KFB_TOWN_CASTLE_CLAY_STAIRS_R1.glb')),('R2',Path('/private/tmp/kfb-wsa-stairs-r2/upload/KFB_TOWN_CASTLE_CLAY_STAIRS_R2.glb')),('KayKit_walled',SRC/'kaykit/stairs_walled.gltf'),('KayKit_wide',SRC/'kaykit/stairs_wide.gltf'),('Kenney_stone',SRC/'kenney/stairs-stone.glb'),('Kenney_wall',SRC/'kenney/wall-narrow-stairs.glb')]
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
 if name not in ('R1','R2'):
  fac=17/max(size);ctr=(lo+hi)/2
  for o in meshes:o.location=(o.location-ctr)*fac+Vector((0,8,size.z*fac/2));o.scale*=fac
 for o in meshes:
  m=bpy.data.materials.new('Neutral');m.diffuse_color=(.52,.52,.52,1);m.use_nodes=True;m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.52,.52,.52,1);m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.86;o.data.materials.clear();o.data.materials.append(m)
 setup()
 for view,loc,target,scale in [('three_quarter',(24,-24,21),(0,8,3),31),('front',(0,-32,11),(0,8,3),27),('side',(30,8,7),(0,8,3),29)]:
  if name not in ('R1','R2'):
   dz=size.z*fac/2-3;loc=(loc[0],loc[1],loc[2]+dz);target=(0,8,3+dz);scale=36
  camera(name+'_'+view,loc,target,scale)
 records.append(dict(name=name,path=str(p),native_bounds=[list(lo),list(hi)],geometry_unchanged=True,material_override='neutral QA only'))
(ROOT/'output/source_isolation.json').write_text(json.dumps(records,indent=2))
