# AN-PERF-01 workspace: donors from the published GLBs onto Rig_Raider (Rig_Medium) and Rig_Brute (Rig_Large)
import bpy, sys, math
sys.path.insert(0,'/tmp/ch1'); import glb
LIB='/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/libs/'
RIGS={'Rig_Medium':'Rig_Raider','Rig_Large':'Rig_Brute'}
bpy.ops.wm.open_mainfile(filepath='/tmp/ml4/KFB_MOTION_LIBRARY_04.blend')
sc=bpy.context.scene; sc.render.fps=30; sc.render.fps_base=1
for a in list(bpy.data.actions): 
    if not a.name.startswith('kfb_idle_breathing_a__'): bpy.data.actions.remove(a)
NEED={'KFB_Motion_idle.glb':['kfb_idle_breathing_a'],
 'KFB_Motion_locomotion.glb':['kfb_locomotion_jogging_with_box_a'],
 'KFB_Motion_action_i04.glb':['kfb_action_boxing_a','kfb_action_quad_punch_a','kfb_action_hook_punch_b','kfb_action_punching_b'],
 'KFB_Motion_reaction_i04.glb':['kfb_reaction_taking_punch_a'],
 'KFB_Motion_locomotion_i04.glb':['kfb_locomotion_walk_with_briefcase_a']}
for rig,tn in RIGS.items():
    T=bpy.data.objects[tn]; T.rotation_mode='QUATERNION'
    rest={b.name:b.matrix_local.copy() for b in T.data.bones}
    for pb in T.pose.bones: pb.rotation_mode='QUATERNION'
    if not T.animation_data: T.animation_data_create()
    a0=bpy.data.actions['kfb_idle_breathing_a__'+rig]; T.animation_data.action=a0; T.animation_data.action_slot=a0.slots[0]
    G=glb.clip_world(LIB+rig+'/KFB_Motion_idle.glb','kfb_idle_breathing_a')
    corr={}; err=0
    for f in (1,20,45):
        sc.frame_set(f); bpy.context.view_layer.update()
        for n in rest:
            c=G[f-1][n].inverted()@(T.matrix_world@T.pose.bones[n].matrix)
            if n in corr: err=max(err,math.degrees(c.to_quaternion().rotation_difference(corr[n].to_quaternion()).angle))
            else: corr[n]=c
    print(rig,'calibration drift deg',round(err,3))
    T.animation_data.action=None
    for f,ids in NEED.items():
        for cid in ids:
            Gc=glb.clip_world(LIB+rig+'/'+f,cid); Ti=T.matrix_world.inverted()
            a=bpy.data.actions.new(f'{cid}__{rig}__D'); a.use_fake_user=True
            slot=a.slots.new(id_type='OBJECT',name=tn); cb=a.layers.new('L').strips.new(type='KEYFRAME').channelbag(slot,ensure=True)
            fc={n:([cb.fcurves.new(f'pose.bones["{n}"].rotation_quaternion',index=i) for i in range(4)],[cb.fcurves.new(f'pose.bones["{n}"].location',index=i) for i in range(3)]) for n in rest}
            prev={}
            for i,W in enumerate(Gc):
                M={n:Ti@W[n]@corr[n] for n in rest}
                for b in T.data.bones:
                    n=b.name
                    Bm=((rest[b.parent.name].inverted()@rest[n]).inverted()@M[b.parent.name].inverted()@M[n]) if b.parent else rest[n].inverted()@M[n]
                    q=Bm.to_quaternion()
                    if n in prev and q.dot(prev[n])<0: q=-q
                    prev[n]=q
                    for j in range(4): fc[n][0][j].keyframe_points.insert(i+1,q[j],options={'FAST'})
                    for j in range(3): fc[n][1][j].keyframe_points.insert(i+1,Bm.translation[j],options={'FAST'})
            print(rig,cid,len(Gc),flush=True)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/an1/AN_PERF_01.blend'); print('SAVED')
