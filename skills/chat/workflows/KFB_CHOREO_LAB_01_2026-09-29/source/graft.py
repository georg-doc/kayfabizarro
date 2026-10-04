# Test A: seated upper body on standing legs.
import bpy, sys, json, math
sys.path.insert(0,'/tmp/ch1')
bpy.ops.wm.open_mainfile(filepath='/tmp/ch1/CHOREO_LAB_01.blend')
from common import *
T=bpy.data.objects['Rig_Raider']; rest={b.name:b.matrix_local.copy() for b in T.data.bones}
LOWER=['root','hips','upperleg.l','lowerleg.l','foot.l','toes.l','upperleg.r','lowerleg.r','foot.r','toes.r']
UPPER=[b.name for b in T.data.bones if b.name not in LOWER]
def rel(n): b=T.data.bones[n]; return rest[b.parent.name].inverted()@rest[n]
def basis_from_arm(M,n):
    b=T.data.bones[n]
    return (rel(n).inverted()@M[b.parent.name].inverted()@M[n]) if b.parent else rest[n].inverted()@M[n]
legs=bpy.data.actions['kfb_idle_breathing_a__M']; NL=nfr(legs)-1   # last frame == first (loop)
info={}
def graft(src,upright):
    S=bpy.data.actions[src+'__M']; N=nfr(S); frames=[]; leans=[]
    # pass 1: seated spine orientation relative to root
    rot=[]
    for f in range(1,N+1):
        Ms=pose_arm(T,S,f)
        r=(Ms['root'].to_quaternion().inverted()@Ms['spine'].to_quaternion()); rot.append(r)
        up=(r@Vector((0,1,0)))  # bone Y axis = along the spine
        leans.append(math.degrees(up.angle(Vector((0,0,1)))))
    # mean correction (upright variant): rotate the average spine direction back onto the standing spine direction
    corr=Quaternion()
    if upright:
        Ml=pose_arm(T,legs,1); ls=(Ml['root'].to_quaternion().inverted()@Ml['spine'].to_quaternion())@Vector((0,1,0))
        avg=Vector((0,0,0))
        for r in rot: avg+= r@Vector((0,1,0))
        corr=(avg.normalized()).rotation_difference(ls.normalized())
    for f in range(1,N+1):
        Ms=pose_arm(T,S,f); Ml=pose_arm(T,legs,1+((f-1)%NL))
        B={n:basis_from_arm(Ml,n) for n in LOWER}
        M=dict(Ml)
        tgt=Ml['root'].to_quaternion()@corr@rot[f-1]
        P=M['hips']@rel('spine'); Mspine=tgt.to_matrix().to_4x4(); Mspine.translation=P.translation
        B['spine']=basis_from_arm({'hips':M['hips'],'spine':Mspine},'spine')
        for n in UPPER:
            if n!='spine': B[n]=basis_from_arm(Ms,n)
        frames.append(B)
    a=new_action(src+('__graft_up' if upright else '__graft'),'Rig_Raider',frames,list(rest))
    return a,leans
setup(240); cam=bpy.data.objects['ml_cam']
def row(a,frs,H=1.9):
    tiles=[]
    for f in frs:
        use(T,a); sc.frame_set(f); bpy.context.view_layer.update()
        r=T.matrix_world@T.pose.bones['root'].head; tgt=Vector((r.x,r.y-0.15,0.9))
        cam.location=tgt+Vector((3.3,-3.0,0.45)); cam.rotation_euler=(tgt-cam.location).to_track_quat('-Z','Y').to_euler()
        tiles.append(render_tile())
    return np.concatenate(tiles,axis=1)
out={}
for src in ('kfb_talk_sitting_a','kfb_talk_meeting_a','kfb_throw_dice_a'):
    g,le=graft(src,False); gu,_=graft(src,True)
    S=bpy.data.actions[src+'__M']; N=nfr(S)
    frs=[1+round(i*(min(N,600)-1)/5) for i in range(6)]
    rows=[row(S,frs),row(g,frs),row(gu,frs)]
    save(rows,f'/tmp/ch1/out/A_{src}.png')
    out[src]={'frames':N,'spineLeanDeg':{'mean':round(sum(le)/len(le),1),'min':round(min(le),1),'max':round(max(le),1)},'sheetFrames':frs}
    print(src,out[src],flush=True)
json.dump(out,open('/tmp/ch1/out/A_graft.json','w'),indent=1)
bpy.ops.wm.save_as_mainfile(filepath='/tmp/ch1/CHOREO_LAB_01.blend')
