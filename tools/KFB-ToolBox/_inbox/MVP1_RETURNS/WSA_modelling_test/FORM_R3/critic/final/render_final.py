import bpy,json
bpy.ops.wm.open_mainfile(filepath='/private/tmp/kfb-wsa-stairs-r3/output/R3_STYLED_CONTEXT_WORK.blend')
s=bpy.context.scene
s.render.resolution_x=1600;s.render.resolution_y=1000;s.render.resolution_percentage=100
json.dump({'file':bpy.data.filepath,'objects':[o.name for o in s.objects],'camera':s.camera.name if s.camera else None},open('/private/tmp/kfb-wsa-stairs-r3/critic/final/scene_inspection.json','w'),indent=2)
s.render.filepath='/private/tmp/kfb-wsa-stairs-r3/critic/final/context_own.png';bpy.ops.render.render(write_still=True)
