import bpy, json, math
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath='/tmp/fbcar/fb_car_hop.blend')
sc=bpy.context.scene; A=bpy.data.objects['FB_Rig']
W=json.load(open('/tmp/fbcar/wheel.json')); C=Vector(W['C']); R=W['R']; up=Vector(W['up']); side=Vector(W['side']); n=Vector(W['n'])
for c in [pb.constraints for pb in A.pose.bones]:
    for k in c: k.mute=True
res={}
for f in (80,120,160,200):
    sc.frame_set(f); bpy.context.view_layer.update()
    sh={s:A.matrix_world@A.pose.bones[f'upperarm.{s}'].head for s in 'lr'}
    L={s:(A.pose.bones[f'upperarm.{s}'].length+A.pose.bones[f'lowerarm.{s}'].length)*A.matrix_world.to_scale()[0] for s in 'lr'}
    wrist={s:A.matrix_world@A.pose.bones[f'wrist.{s}'].head for s in 'lr'}
    hand_len={s:(A.pose.bones[f'hand.{s}'].length)*A.matrix_world.to_scale()[0] for s in 'lr'}
    SH=float(__import__('os').environ.get('SHIFT','0'))
    def grip(a): return C-n*SH+R*(up*math.cos(math.radians(a))+side*math.sin(math.radians(a)))-n*0.02
    row={}
    for base in (45,60,75,90):
        for th in (0,20,40,60,106):
            r=[]
            for s,sg in (('l',-1),('r',1)):
                for t in (th,-th):
                    g=grip(sg*base+t); r.append((g-sh[s]).length/L[s])
            row[f'b{base}_t{th}']=round(max(r),3)
    res[f]=dict(armLen=round(L['l'],3),hand=round(hand_len['l'],3),ratios=row)
print('RE',json.dumps(res))
