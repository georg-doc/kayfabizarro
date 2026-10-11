import bpy,json,hashlib
from pathlib import Path
from mathutils import Vector
r=Path('/private/tmp/kfb-wsa-stairs-r3-attach');o=r/'critic';bpy.ops.wm.open_mainfile(filepath=str(r/'output/ATTACHMENT_REVIEW.blend'))
for ob in list(bpy.context.scene.objects):
 if ob.get('form_family') or 'ADAPTED_KAYKIT_HILL' in ob.name:bpy.data.objects.remove(ob,do_unlink=True)
before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(r/'output/STAIRS_WITH_REPAIRED_ATTACHMENT.glb'));new=[x for x in bpy.context.scene.objects if x not in before]
s=bpy.context.scene;bpy.ops.object.camera_add(location=(29,-21,22));c=bpy.context.object;c.data.type='ORTHO';c.data.ortho_scale=44;c.rotation_euler=(Vector((0,11,2.8))-c.location).to_track_quat('-Z','Y').to_euler();s.camera=c;s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100;s.render.filepath=str(o/'critic_glb_full.jpg');bpy.ops.render.render(write_still=True)
(o/'GLB_REOPEN.json').write_text(json.dumps({'combined_glb_sha256':hashlib.sha256((r/'output/STAIRS_WITH_REPAIRED_ATTACHMENT.glb').read_bytes()).hexdigest(),'meshes':len([x for x in new if x.type=='MESH']),'purpose':'independent clean production-object GLB import using retained review lighting; exported base materials not Blender probe'},indent=2))
