import bpy, sys, json
sys.path.insert(0,'/tmp/ch1'); import glb
L='/tmp/ch1/repo/media/3D_Assets/Animations/KFB_Motion_Library/libs/'
F=json.load(open('/tmp/ml7/files.json')); res={}
for r,tn in (('Rig_Medium','Rig_Raider'),('Rig_Large','Rig_Brute')):
    A,_=glb.load(L+r+'/KFB_Motion_talk.glb'); na={n['name']:n for n in A['nodes']}
    for f,ids in F.items():
        B,_=glb.load(f'/tmp/ml7/out/libs/{r}/{f}'); nb={n['name']:n for n in B['nodes']}
        d=0
        for k in na:
            for key,dv in (('translation',[0,0,0]),('rotation',[0,0,0,1]),('scale',[1,1,1])):
                d=max(d,max(abs(x-y) for x,y in zip(na[k].get(key,dv),nb[k].get(key,dv))))
        an=sorted(a['name'] for a in B['animations'])
        res[f'{r}/{f}']={'nodes':len(B['nodes']),'namesEqual':set(na)==set(nb),'restDiff':d,'meshes':len(B.get('meshes',[])),'skins':len(B.get('skins',[])),'animsMatch':an==sorted(ids)}
# round trip on 3 clips per rig
bpy.ops.wm.open_mainfile(filepath='/tmp/ml7/KFB_MOTION_LIBRARY_07.blend'); sc=bpy.context.scene
rt={}
for r,tn in (('Rig_Medium','Rig_Raider'),('Rig_Large','Rig_Brute')):
    T=bpy.data.objects[tn]
    for cid,f in (('kfb_locomotion_sprint_a','KFB_Motion_locomotion_i07.glb'),('kfb_locomotion_jumping_a','KFB_Motion_locomotion_i07.glb'),('kfb_locomotion_change_direction_a','KFB_Motion_locomotion_i07.glb')):
        a=bpy.data.actions[cid+'__'+r]; T.animation_data.action=a; T.animation_data.action_slot=a.slots[0]
        G=glb.clip_world(f'/tmp/ml7/out/libs/{r}/{f}',cid); n=int(a.frame_range[1]); mx=0
        for fr in (1,n//2,n):
            sc.frame_set(fr); bpy.context.view_layer.update()
            for b,pb in T.pose.bones.items():
                mx=max(mx,((G[fr-1][b].translation-G[fr-1][r].translation)-(T.matrix_world@pb.matrix).translation+T.matrix_world.translation).length)
        rt[f'{r}/{cid}']={'frames':n,'glbFrames':len(G),'maxCm':round(mx*100,3)}
json.dump({'files':res,'roundTrip':rt},open('/tmp/ml7/out/verify7.json','w'),indent=1)
print(all(v['namesEqual'] and v['restDiff']==0 and v['meshes']==0 and v['skins']==0 and v['animsMatch'] and v['nodes']==24 for v in res.values())); print(rt)
