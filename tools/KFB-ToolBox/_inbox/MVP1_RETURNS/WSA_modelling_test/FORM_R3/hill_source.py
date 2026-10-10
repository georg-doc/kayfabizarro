import bpy, json, hashlib
from pathlib import Path
from mathutils import Vector
R=Path('/private/tmp/kfb-wsa-stairs-r3')
P=Path('/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/kfb-deck-library-r1-2026-10-09/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/hill_single_A.gltf')
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P));objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
pts=[o.matrix_world@v.co for o in objects for v in o.data.vertices];lo=[min(p[i] for p in pts) for i in range(3)];hi=[max(p[i] for p in pts) for i in range(3)];center=Vector([(a+b)/2 for a,b in zip(lo,hi)]);sz=max(b-a for a,b in zip(lo,hi));f=12/sz
for o in objects:
 o.location=(o.location-center)*f;o.scale*=f
 m=bpy.data.materials.new('Source hill gray');m.diffuse_color=(.5,.5,.5,1);o.data.materials.clear();o.data.materials.append(m)
s=bpy.context.scene;s.world=bpy.data.worlds.new('World');s.world.color=(.4,.4,.4);s.render.engine='BLENDER_EEVEE';s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100;s.render.image_settings.file_format='JPEG'
def aim(o,t):o.rotation_euler=(Vector(t)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.light_add(type='AREA',location=(-6,-8,15));o=bpy.context.object;o.data.energy=2300;o.data.size=10;aim(o,(0,0,0))
bpy.ops.object.camera_add(location=(16,-18,13));o=bpy.context.object;o.data.type='ORTHO';o.data.ortho_scale=18;aim(o,(0,0,0));s.camera=o;s.render.filepath=str(R/'output/renders/source/KayKit_hill_single_A.jpg');bpy.ops.render.render(write_still=True)
records=[]
for p in [P,P.with_suffix('.bin')]:
 b=p.read_bytes();records.append(dict(file=p.name,sha256=hashlib.sha256(b).hexdigest(),git_blob_sha=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()))
(R/'output/hill_source.json').write_text(json.dumps(dict(source=str(P),repository_path='media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/hill_single_A.gltf',ref='52099710569a98393325ee94becf616f418b35f2',bounds=[lo,hi],original_byte_hashes=records,display_scale=f,original_geometry=True),indent=2))
