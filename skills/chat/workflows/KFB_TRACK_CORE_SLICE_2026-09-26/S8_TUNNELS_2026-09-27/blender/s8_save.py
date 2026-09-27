"""S8 · frame every 3D view on the whole course (the file is built from empty, so the view starts at the origin),
solid shading with the paint colours, long clip range, then save as the NEW S8 file. Globals: S8_ROOT."""
import bpy, math, mathutils
KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S8_ROOT', KIT + 'S8_TUNNELS_2026-09-27/')
DST = ROOT + 'b1/KFB_TRACKCORE_S8_TN01_v1.blend'
views = 0
for win in bpy.context.window_manager.windows:
    for area in win.screen.areas:
        if area.type != 'VIEW_3D':
            continue
        sp = area.spaces.active; sp.clip_start = 0.5; sp.clip_end = 12000
        r3 = sp.region_3d; r3.view_perspective = 'PERSP'
        r3.view_location = mathutils.Vector((1100, -250, -80)); r3.view_distance = 2600
        r3.view_rotation = mathutils.Euler((math.radians(62), 0, math.radians(-15)), 'XYZ').to_quaternion()
        sp.shading.type = 'SOLID'; sp.shading.color_type = 'VERTEX'; sp.shading.show_backface_culling = False
        views += 1
assert not bpy.data.filepath or 'S8_' in bpy.data.filepath, bpy.data.filepath
bpy.ops.wm.save_as_mainfile(filepath=DST, copy=False)
result = dict(views=views, saved=bpy.data.filepath)
