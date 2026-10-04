
import bpy
OUT='/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/_probe_batch1/v3'
def stills(tag, frames=(37,48), cams=('dr_cam_front','dr_cam_f34','dr_cam_right')):
    sc=bpy.data.scenes['DRUM_MANUAL']
    bpy.context.window.scene=sc
    r=sc.render; r.image_settings.file_format='PNG'; r.resolution_x=r.resolution_y=560
    old=sc.camera; paths=[]
    for f in frames:
        sc.frame_set(f)
        for c in cams:
            sc.camera=sc.objects[c]
            p=f"{OUT}/{tag}_f{f}_{c[7:]}.png"; r.filepath=p
            bpy.ops.render.render(write_still=True); paths.append(p)
    sc.camera=old
    return paths
