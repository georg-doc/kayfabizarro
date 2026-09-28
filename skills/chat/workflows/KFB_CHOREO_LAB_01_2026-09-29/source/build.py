# Private working blend for choreography tests. Clips are read straight from the published Rig_Medium GLBs
# (GitHub georg-doc-patch-3) and put onto Rig_Raider by world-space transfer, so the test uses exactly the shipped data.
import bpy, sys, json, math
sys.path.insert(0,'/tmp/ch1'); import glb
from mathutils import Matrix
LIB='/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/'
bpy.ops.wm.open_mainfile(filepath='/tmp/ml4/KFB_MOTION_LIBRARY_04.blend')
sc=bpy.context.scene; sc.render.fps=30; sc.render.fps_base=1
T=bpy.data.objects['Rig_Raider']; rest={b.name:b.matrix_local.copy() for b in T.data.bones}
def use(a):
    if not T.animation_data: T.animation_data_create()
    T.animation_data.action=a; T.animation_data.action_slot=a.slots[0]
# calibration: same clip as blend action and as GLB
use(bpy.data.actions['kfb_idle_breathing_a__Rig_Medium'])
G=glb.clip_world(LIB+'KFB_Motion_idle.glb','kfb_idle_breathing_a')
corr={}; err=0
for f in (1,20,45):
    sc.frame_set(f); bpy.context.view_layer.update()
    for n in rest:
        c=G[f-1][n].inverted()@(T.matrix_world@T.pose.bones[n].matrix)
        if n in corr:
            d=(c.to_quaternion().rotation_difference(corr[n].to_quaternion())).angle
            err=max(err,math.degrees(d),(c.translation-corr[n].translation).length*100)
        else: corr[n]=c
print('calibration drift (deg / cm):',round(err,4))
def transfer(file,cid):
    G=glb.clip_world(LIB+file,cid); Ti=T.matrix_world.inverted()
    a=bpy.data.actions.new(cid+'__M'); a.use_fake_user=True
    slot=a.slots.new(id_type='OBJECT',name='Rig_Raider')
    cb=a.layers.new('L').strips.new(type='KEYFRAME').channelbag(slot,ensure=True)
    curves={}
    for n in rest:
        dp=f'pose.bones["{n}"]'
        curves[n]=([cb.fcurves.new(dp+'.rotation_quaternion',index=i) for i in range(4)],[cb.fcurves.new(dp+'.location',index=i) for i in range(3)],[None])
    for i,W in enumerate(G):
        M={n:Ti@W[n]@corr[n] for n in rest}
        for b in T.data.bones:
            n=b.name
            Bm=((rest[b.parent.name].inverted()@rest[n]).inverted()@M[b.parent.name].inverted()@M[n]) if b.parent else rest[n].inverted()@M[n]
            q=Bm.to_quaternion(); cq,cl,prev=curves[n]
            if prev[0] is not None and q.dot(prev[0])<0: q=-q
            prev[0]=q
            for j in range(4): cq[j].keyframe_points.insert(i+1,q[j],options={'FAST'})
            for j in range(3): cl[j].keyframe_points.insert(i+1,Bm.translation[j],options={'FAST'})
    return len(G)
NEED={'KFB_Motion_talk.glb':['kfb_talk_sitting_a','kfb_talk_meeting_a','kfb_talk_arguing_a','kfb_talk_arguing_b','kfb_talk_talking_a','kfb_talk_talking_e'],
 'KFB_Motion_throw.glb':['kfb_throw_dice_a'],
 'KFB_Motion_idle.glb':['kfb_idle_breathing_a','kfb_idle_happy_a'],
 'KFB_Motion_gesture.glb':['kfb_gesture_pointing_a','kfb_gesture_dismissing_gesture_a','kfb_gesture_angry_gesture_a','kfb_gesture_yelling_a','kfb_gesture_strong_gesture_a','kfb_gesture_taunt_a','kfb_gesture_cheering_a','kfb_gesture_thoughtful_head_shake_a'],
 'KFB_Motion_interaction.glb':['kfb_interaction_opening_a_lid_a'],
 'KFB_Motion_locomotion.glb':['kfb_locomotion_jogging_with_box_a','kfb_locomotion_walk_to_stop_a'],
 'KFB_Motion_reaction.glb':['kfb_reaction_dizzy_idle_a'],
 'KFB_Motion_action_i04.glb':['kfb_action_boxing_a','kfb_action_quad_punch_a','kfb_action_hook_punch_b','kfb_action_punching_b'],
 'KFB_Motion_reaction_i04.glb':['kfb_reaction_taking_punch_a','kfb_reaction_surprise_uppercut_a','kfb_reaction_getting_up_a'],
 'KFB_Motion_locomotion_i04.glb':['kfb_locomotion_walking_l']}
for f,ids in NEED.items():
    have=glb.names(LIB+f)
    for cid in ids:
        if cid not in have: print('MISSING',f,cid); continue
        print('ok',cid,transfer(f,cid),flush=True)
# check: GLB copy of breathing vs blend action (should be ~0)
a0=bpy.data.actions['kfb_idle_breathing_a__Rig_Medium']; a1=bpy.data.actions['kfb_idle_breathing_a__M']; mx=0
for f in (1,33,60):
    P=[]
    for a in (a0,a1):
        use(a); sc.frame_set(f); bpy.context.view_layer.update(); P.append({n:(T.matrix_world@pb.matrix) for n,pb in T.pose.bones.items()})
    mx=max(mx,max((P[0][n].translation-P[1][n].translation).length for n in P[0]))
print('roundtrip max cm',round(mx*100,3))
bpy.ops.wm.save_as_mainfile(filepath='/tmp/ch1/CHOREO_LAB_01.blend'); print('SAVED')
