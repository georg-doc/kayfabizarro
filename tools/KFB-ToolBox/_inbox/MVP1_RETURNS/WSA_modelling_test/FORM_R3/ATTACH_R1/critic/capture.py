import bpy,json,hashlib
from pathlib import Path
from mathutils import Vector
r=Path('/private/tmp/kfb-wsa-stairs-r3-attach');o=r/'critic'
bpy.ops.wm.open_mainfile(filepath=str(r/'output/ATTACHMENT_REVIEW.blend'))
s=bpy.context.scene
views={'critic_full':((29,-21,22),(0,11,2.8),44),'critic_foot_left':((-13,-9,5.3),(-6.8,1,1.15),10),'critic_foot_right':((13,-9,5.3),(6.8,1,1.15),10),'critic_landing':((11,22,11),(0,17.6,5.0),15)}
s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100
for name,(loc,target,scale) in views.items():
 bpy.ops.object.camera_add(location=loc);c=bpy.context.object;c.name=name;c.data.type='ORTHO';c.data.ortho_scale=scale;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();s.camera=c;s.render.filepath=str(o/(name+'.jpg'));bpy.ops.render.render(write_still=True)
(o/'CAPTURE_MANIFEST.json').write_text(json.dumps({'critic':'/root/r3_attach_critic','independent':True,'scene_sha256':hashlib.sha256((r/'output/ATTACHMENT_REVIEW.blend').read_bytes()).hexdigest(),'combined_glb_sha256':hashlib.sha256((r/'output/STAIRS_WITH_REPAIRED_ATTACHMENT.glb').read_bytes()).hexdigest(),'views':views,'production_changes':False},indent=2))
