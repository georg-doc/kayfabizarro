import bpy, json, os, math
INBOX="/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/"
OUT=INBOX+"_probe_batch1/"
def fcurves(a):
    try: return list(a.fcurves)
    except Exception: return [fc for l in a.layers for s in l.strips for cb in s.channelbags for fc in cb.fcurves]
def import_clip(fname, key):
    sc=bpy.data.scenes.get("MX_"+key) or bpy.data.scenes.new("MX_"+key)
    bpy.context.window.scene=sc
    before=set(bpy.data.objects.keys()); ba=set(bpy.data.actions.keys())
    bpy.ops.import_scene.fbx(filepath=INBOX+fname, automatic_bone_orientation=False, ignore_leaf_bones=False)
    objs=[o for o in bpy.data.objects if o.name not in before]
    acts=[a for a in bpy.data.actions if a.name not in ba]
    arm=[o for o in objs if o.type=='ARMATURE'][0]
    arm["mx_key"]=key
    info={'file':fname,'scene':sc.name,'armature':arm.name,'nbones':len(arm.data.bones),
          'bones':[b.name for b in arm.data.bones][:30],'meshes':[o.name for o in objs if o.type=='MESH'],
          'actions':[a.name for a in acts]}
    if acts:
        a=acts[0]; fcs=fcurves(a); info['range']=list(a.frame_range)
        info['animated']=sorted(set(fc.data_path.split('"')[1] for fc in fcs if '"' in fc.data_path and len(set(round(k.co.y,4) for k in fc.keyframe_points))>1))
        obj=[fc for fc in fcs if not fc.data_path.startswith('pose')]
        info['obj_motion']={f"{fc.data_path}[{fc.array_index}]":[round(min(k.co.y for k in fc.keyframe_points),3),round(max(k.co.y for k in fc.keyframe_points),3)] for fc in obj}
    json.dump(info, open(OUT+key+"_info.json","w"), indent=1)
    return info

import mathutils
def setup_view(key, step=2, res=256):
    sc=bpy.data.scenes["MX_"+key]; bpy.context.window.scene=sc
    arm=[o for o in sc.objects if o.type=='ARMATURE'][0]
    meshes=[o for o in sc.objects if o.type=='MESH' and o.parent==arm]
    a=arm.animation_data.action; f0,f1=int(a.frame_range[0]),int(a.frame_range[1])
    sc.frame_start=f0; sc.frame_end=f1; sc.frame_step=step; sc.render.fps=30
    lo=mathutils.Vector((1e9,)*3); hi=mathutils.Vector((-1e9,)*3)
    dg=bpy.context.evaluated_depsgraph_get()
    for f in range(f0,f1+1,max(1,(f1-f0)//24)):
        sc.frame_set(f)
        for m in meshes:
            for v in m.bound_box:
                w=m.matrix_world@mathutils.Vector(v)
                lo=mathutils.Vector(map(min,lo,w)); hi=mathutils.Vector(map(max,hi,w))
    c=(lo+hi)/2; size=max(hi.x-lo.x, hi.y-lo.y, hi.z-lo.z)
    # floor
    if "mx_floor_"+key not in bpy.data.objects:
        me=bpy.data.meshes.new("mx_floor_"+key); s=size*1.5
        me.from_pydata([(-s,-s,0),(s,-s,0),(s,s,0),(-s,s,0)],[],[(0,1,2,3)])
        fl=bpy.data.objects.new("mx_floor_"+key,me); fl.location=(c.x,c.y,lo.z); sc.collection.objects.link(fl)
    cam=bpy.data.objects.get("mx_cam_"+key)
    if not cam:
        cam=bpy.data.objects.new("mx_cam_"+key,bpy.data.cameras.new("mx_cam_"+key)); sc.collection.objects.link(cam)
    cam.data.type='ORTHO'; cam.data.ortho_scale=size*1.15
    d=mathutils.Vector((0.5,-1,0.35)).normalized()
    cam.location=c+d*30; cam.rotation_euler=(-d).to_track_quat('-Z','Y').to_euler()
    sc.camera=cam
    sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading
    sh.light='STUDIO'; sh.color_type='SINGLE'; sh.single_color=(0.62,0.55,0.46); sh.show_cavity=True; sh.show_shadows=True
    sc.render.resolution_x=res; sc.render.resolution_y=res; sc.render.resolution_percentage=100
    sc.render.image_settings.file_format='PNG'
    os.makedirs(OUT+key,exist_ok=True); sc.render.filepath=OUT+key+"/f"
    return {'range':[f0,f1],'size':round(size,2),'lo':[round(x,2) for x in lo],'hi':[round(x,2) for x in hi]}
def render(key):
    sc=bpy.data.scenes["MX_"+key]; bpy.context.window.scene=sc
    bpy.ops.render.render(animation=True, scene=sc.name)
