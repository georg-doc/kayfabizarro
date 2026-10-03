# KFB LOCOMOTION-LADDER-01 · review scene for Georg's Blender (no render loop needed).
# Usage inside Blender: exec(open(path).read()); build_review(GLB_PATH, PLAN_PATH, 'Rig_Medium')
import bpy, json, math
from mathutils import Vector, Matrix
def _mat(name,rgba):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes=True; b=m.node_tree.nodes.get('Principled BSDF')
    if b: b.inputs['Base Color'].default_value=rgba
    m.diffuse_color=rgba; return m
def build_review(glb_path, plan_path, rig, x_offset=0.0, cycles=3, clear=True):
    plan=json.load(open(plan_path))[rig]
    sc=bpy.context.scene; sc.render.fps=30
    cname='KFB_LOCOMOTION_LADDER_01_'+rig
    if clear and bpy.data.collections.get(cname):
        old=bpy.data.collections[cname]
        for o in list(old.all_objects): bpy.data.objects.remove(o,do_unlink=True)
        bpy.data.collections.remove(old)
    col=bpy.data.collections.new(cname); sc.collection.children.link(col)
    before=set(bpy.data.objects); acts0=set(bpy.data.actions)
    bpy.ops.import_scene.gltf(filepath=glb_path,loglevel=50)
    tmpl=[o for o in bpy.data.objects if o not in before]
    actions={a.name.split('.')[0] if a.name.rsplit('.',1)[-1].isdigit() else a.name:a for a in bpy.data.actions if a not in acts0}
    arm0=[o for o in tmpl if o.type=='ARMATURE'][0]
    meshes0=[o for o in tmpl if o.type=='MESH']
    for o in tmpl:
        for c in list(o.users_collection): c.objects.unlink(o)
        col.objects.link(o); o.hide_set(True); o.hide_render=True
    arm0.animation_data_create(); arm0.animation_data.action=None
    matL=_mat('KFB_ladder_foot_L',(0.15,0.35,0.95,1)); matR=_mat('KFB_ladder_foot_R',(0.95,0.25,0.2,1)); matG=_mat('KFB_ladder_ground',(0.82,0.83,0.80,1))
    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=1,depth=1); disc=bpy.context.object; discmesh=disc.data; bpy.data.objects.remove(disc,do_unlink=True)
    H={'Rig_Medium':2.204,'Rig_Large':3.981}[rig]
    maxf=1; lanes=[]
    for k,s in enumerate(plan):
        lx=x_offset+s['laneX']
        lane=bpy.data.objects.new('lane_%02d_%s'%(k,s['rung']),None); lane.empty_display_type='ARROWS'; lane.empty_display_size=0.15*H/2.2
        col.objects.link(lane); lane.location=(lx,0,0)
        arm=arm0.copy(); arm.data=arm0.data; col.objects.link(arm); arm.hide_set(False); arm.hide_render=False
        arm.parent=lane; arm.matrix_parent_inverse=Matrix(); arm.location=(0,0,0)
        for m0 in meshes0:
            m=m0.copy(); col.objects.link(m); m.hide_set(False); m.hide_render=False; m.parent=arm; m.matrix_parent_inverse=m0.matrix_parent_inverse.copy()
            for md in m.modifiers:
                if md.type=='ARMATURE': md.object=arm
        src=actions[s['clip']]; act=src.copy(); act.name='LADDER_%s_%s'%(rig,s['clip'])
        arm.animation_data_create(); arm.animation_data.action=act
        if act.slots: arm.animation_data.action_slot=act.slots[0]
        f0,f1=act.frame_range
        for layer in act.layers:
            for st in layer.strips:
                for cb in st.channelbags:
                    for fc in cb.fcurves:
                        if s['rootMotion']=='travel' and fc.data_path in ('pose.bones["root"].location','pose.bones["hips"].location'):
                            kp=fc.keyframe_points
                            if len(kp)>1:
                                a0=kp[0].co; a1=kp[-1].co; slope=(a1.y-a0.y)/max(1e-6,(a1.x-a0.x))
                                if abs(a1.y-a0.y)>1e-4:
                                    for p in kp:
                                        d=slope*(p.co.x-a0.x); p.co.y-=d; p.handle_left.y-=d; p.handle_right.y-=d
                                    fc.update()
                        if not any(md.type=='CYCLES' for md in fc.modifiers): fc.modifiers.new('CYCLES')
        # align hips start to the lane origin
        sc.frame_set(int(f0)); bpy.context.view_layer.update()
        hp=arm.matrix_world@arm.pose.bones['hips'].head - lane.matrix_world.translation
        arm.location=(-hp.x,-hp.y,0)
        n=s['cycleFrames']; v=s['speed']
        if s['moving']:
            d=Vector(s['dirBl']).normalized(); F=n*cycles
            lane.keyframe_insert('location',frame=f0)
            lane.location=Vector(lane.location)+d*v*(F/30.0); lane.keyframe_insert('location',frame=f0+F)
            for layer in lane.animation_data.action.layers:
                for st in layer.strips:
                    for cb in st.channelbags:
                        for fc in cb.fcurves:
                            for p in fc.keyframe_points: p.interpolation='LINEAR'
                            fc.extrapolation='LINEAR'
            lane.location=(lx,0,0)
            maxf=max(maxf,int(f0+F))
        else: maxf=max(maxf,int(f0+n*cycles))
        # footprints (static, where each heel/toe first touches down during the first cycles)
        for (mx,my,side,jn) in s['markers']:
            o=bpy.data.objects.new('foot_%02d_%s_%s'%(k,side,jn),discmesh); col.objects.link(o)
            r=(0.045 if jn=='toes' else 0.06)*H/2.2
            o.scale=(r,r,0.004); o.location=(lx+mx+(-hp.x*0),my,0.002)
            o.data.materials.clear() if False else None
            o.active_material=matL if side=='l' else matR
            if o.material_slots: o.material_slots[0].link='OBJECT'; o.material_slots[0].material=matL if side=='l' else matR
        cu=bpy.data.curves.new('lbl_%02d'%k,'FONT'); cu.body='%s\n%s\n%.2f m/s'%(s['rung'],s['clip'].replace('kfb_locomotion_','').replace('kfb_idle_',''),v)
        cu.size=0.22*H/2.2; cu.align_x='CENTER'
        lo=bpy.data.objects.new('label_%02d'%k,cu); col.objects.link(lo); lo.location=(lx,0.45*H/2.2,0.01)
        lanes.append((lane,arm,s))
    # ground
    bpy.ops.mesh.primitive_plane_add(size=1); g=bpy.context.object; g.name='ladder_ground_'+rig
    for c in list(g.users_collection): c.objects.unlink(g)
    col.objects.link(g); xs=[x_offset+s['laneX'] for s in plan]
    g.scale=((max(xs)-min(xs))+2*H/2.2, 12*H/2.2*1.0+max(s['speed'] for s in plan)*maxf/30.0, 1)
    g.location=((max(xs)+min(xs))/2, -g.scale.y/2+1.0*H/2.2, -0.001); g.active_material=matG
    g.scale.y=min(g.scale.y,40.0); g.location.y=-g.scale.y/2+1.0*H/2.2
    # glTF importer bone display shapes (icospheres) cover the mannequins: hide them
    shapes=set()
    for _l,a,_s in lanes:
        for pb in a.pose.bones:
            if pb.custom_shape: shapes.add(pb.custom_shape)
    for o in col.objects:
        if o.type=='MESH' and (o in shapes or o.name.startswith(('Icosphere','Icokugel'))): shapes.add(o)
    for o in shapes:
        o.hide_viewport=True; o.hide_render=True
    sc.frame_start=0; sc.frame_end=max(sc.frame_end if not clear else 0, maxf)
    return col,lanes
