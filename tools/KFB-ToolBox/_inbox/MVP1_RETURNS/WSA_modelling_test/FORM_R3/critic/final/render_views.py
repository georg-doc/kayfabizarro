import bpy,json
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath='/private/tmp/kfb-wsa-stairs-r3/output/R3_STYLED_CONTEXT_WORK.blend')
s=bpy.context.scene;s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100
bpy.ops.object.camera_add();c=bpy.context.object;c.data.type='ORTHO';s.camera=c
for name,loc,target,scale,context in [('context_overview_own',(25,-12,19),(0,14,3),41,True),('styled_isolated_own',(24,-24,21),(0,8,3),31,False)]:
 for o in s.objects:
  if o.name.startswith('CTX_REAL'):o.hide_render=not context
 c.location=loc;c.rotation_euler=(Vector(target)-c.location).to_track_quat('-Z','Y').to_euler();c.data.ortho_scale=scale;s.render.filepath='/private/tmp/kfb-wsa-stairs-r3/critic/final/'+name+'.jpg';bpy.ops.render.render(write_still=True)
