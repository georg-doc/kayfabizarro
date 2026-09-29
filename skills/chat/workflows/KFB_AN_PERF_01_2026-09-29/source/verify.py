import bpy, sys, math, json
sys.path.insert(0,'/tmp/ch1'); import glb
LIB='/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/libs/'
bpy.ops.wm.open_mainfile(filepath='/tmp/an1/AN_PERF_01_authored.blend'); sc=bpy.context.scene
RIGS={'Rig_Medium':'Rig_Raider','Rig_Large':'Rig_Brute'}; out={}
def use(ob,a):
    if not ob.animation_data: ob.animation_data_create()
    ob.animation_data.action=a; ob.animation_data.action_slot=a.slots[0]
for rig,tn in RIGS.items():
    T=bpy.data.objects[tn]; T.rotation_mode='QUATERNION'; T.rotation_quaternion=(1,0,0,0); T.location=(0,0,0)
    use(T,bpy.data.actions[f'kfb_idle_breathing_a__{rig}__D']); G=glb.clip_world(LIB+rig+'/KFB_Motion_idle.glb','kfb_idle_breathing_a')
    sc.frame_set(1); bpy.context.view_layer.update(); corr={n:G[0][n].inverted()@(T.matrix_world@pb.matrix) for n,pb in T.pose.bones.items()}
    for cid in ('kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a','kfb_locomotion_nutcracker_march_a'):
        a=bpy.data.actions[f'{cid}__{rig}__N']; use(T,a); Gn=glb.clip_world(f'/tmp/an1/out/libs/{rig}/KFB_Motion_perf_an01.glb',cid); n=int(a.frame_range[1]); mx=0
        for f in (1,n//2,n):
            sc.frame_set(f); bpy.context.view_layer.update()
            for b,pb in T.pose.bones.items(): mx=max(mx,((Gn[f-1][b].translation-Gn[f-1][rig].translation)-(T.matrix_world@pb.matrix).translation).length)
        out.setdefault(cid,{})[rig]={'frames':n,'glbFrames':len(Gn),'roundTripMaxCm':round(mx*100,3)}
print(json.dumps(out)); json.dump(out,open('/tmp/an1/out/verify.json','w'),indent=1)
