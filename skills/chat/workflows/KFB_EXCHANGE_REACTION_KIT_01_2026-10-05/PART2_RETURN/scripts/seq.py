# Reference sequence: handover -> held POP -> reaction. args: variant(M|Lfit|Lgiant) outdir mode(video|stills)
import bpy,sys,json,os,math
from mathutils import Vector,Matrix
var,outdir,mode=sys.argv[1:4]
rig='M' if var=='M' else 'L'; H={'M':2.17,'L':4.19}[rig]; S=H/2.17; PALM=0.02*H
ACT={'M':('/tmp/x2/A_RobotOne.glb','/tmp/x2/A_RobotTwo.glb'),'L':('/tmp/x2/A_OrcBrute.glb','/tmp/x2/A_OrcBrute.glb')}[rig]
GIVE,RECV=('kfb_interaction_gift_give_fit_a','kfb_interaction_gift_receive_fit_a') if var=='Lfit' else ('kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a')
BOXW={'M':0.454,'Lfit':0.876,'Lgiant':1.880}[var]; D={'M':1.1488,'L':2.7735}[rig]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30; os.makedirs(outdir,exist_ok=True)
def imp(p):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=p,loglevel=50); return [o for o in sc.objects if o not in before]
newA=imp(ACT[0]); A=[o for o in newA if o.type=='ARMATURE'][0]
newB=imp(ACT[1]); B=[o for o in newB if o.type=='ARMATURE'][0]
for o in newB:
    if o.parent is None: o.rotation_mode='XYZ'; o.location=(0,-D,0); o.rotation_euler=(0,0,math.pi)
def acts(name): return [v for k,v in bpy.data.actions.items() if k.startswith(name)]
def strip(arm,name,start,which,blend_in=0):
    act=acts(name)[which]; arm.animation_data_create(); arm.animation_data.action=None
    tr=arm.animation_data.nla_tracks.new(); st=tr.strips.new(name,start,act)
    if act.slots: st.action_slot=act.slots[0]
    st.blend_in=blend_in; st.extrapolation='HOLD_FORWARD'
    return st,act
wA=0 if rig=='M' else 0; wB=-1
stG,aG=strip(A,GIVE,1,0); stR,aR=strip(B,RECV,11,wB)
T_POP=101; T_REACT=127
stG2,_=strip(A,'kfb_react_amused_a',T_REACT,0,blend_in=8)
stR2,aRe=strip(B,'kfb_react_delighted_a',T_REACT,wB,blend_in=8)
# props
newP=imp('/tmp/x2/props/KFB_Gift_Presents_clay01.glb')
keep='present-a-cube'
for o in newP:
    if keep not in o.name: o.hide_render=True; o.hide_viewport=True
gift=[o for o in newP if o.name=='gift_'+keep][0]; lid=[o for o in newP if o.name=='lid_'+keep][0]; box=[o for o in newP if o.name=='box_'+keep][0]
gift.location=(0,0,0)
s_=BOXW/0.4; gift.scale=(s_,)*3; hb=0.3*s_
newG=imp('/tmp/x1/kh/gingerbread-man.glb'); gb=[o for o in newG if o.parent is None][0]; gb.scale=(s_*1.7,)*3
bpy.ops.mesh.primitive_plane_add(size=200); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=False
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
sc.render.resolution_x=640; sc.render.resolution_y=400
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'; cam.data.ortho_scale=5.4*S
c0=Vector((0,-D/2,0)); L=Vector((5.2,-1.2,1.8))*S+c0; cam.location=L; cam.rotation_euler=(Vector((c0.x,c0.y,1.45*S))-L).to_track_quat('-Z','Y').to_euler()
def hs(arm,s): return arm.matrix_world@arm.pose.bones['handslot.'+s].head
def mid(arm): return (hs(arm,'l')+hs(arm,'r'))/2
lid_local=lid.location.copy(); events={}
frames=range(1,T_REACT+60) if mode=='video' else [1,31,51,79,99,105,111,117,127,150]
hold=None; meas=[]
for f in frames:
    sc.frame_set(f); bpy.context.view_layer.update()
    gb.hide_render=True; lid.location=lid_local
    if f<=51: c=mid(A)
    elif f<=T_POP: c=mid(B)
    if f<=T_POP:
        hold=c.copy(); gift.location=c-Vector((0,0,hb/2)); gift.scale=(s_,)*3
        if 31<=f<=51: meas.append(('giver',f,round((((hs(A,'l')-hs(A,'r')).length)/2-PALM-BOXW/2),3)))
        if 51<f<=T_POP: meas.append(('receiver',f,round((((hs(B,'l')-hs(B,'r')).length)/2-PALM-BOXW/2),3)))
    else:
        k=f-T_POP
        if k<=8: q=1-0.25*math.sin(k/8*math.pi); gift.scale=(s_/math.sqrt(q),s_/math.sqrt(q),s_*q)
        else: gift.scale=(s_,)*3
        gift.location=hold-Vector((0,0,hb/2))
        if k>=10:
            u=min(1,(k-10)/8); lid.location=lid_local+Vector((0.0,0.0,(0.9*math.sin(min(u,1)*math.pi*0.5))/s_*S))
            gb.hide_render=False; up=math.sin(min(1,(k-10)/16)*math.pi)
            gb.location=hold+Vector((0,0,hb/2+up*0.7*S)) - Vector((0,0,0)) + Vector(((k-10)/16*0.6*S if k<26 else 0.6*S,0,0))
            if k>=26: gb.location=Vector((hold.x+0.6*S,hold.y,0))
        if f>=T_REACT: gift.hide_render=True; lid.hide_render=True; box.hide_render=True
    sc.render.filepath=f'{outdir}/{var}_{f:04d}.png'; bpy.ops.render.render(write_still=True)
json.dump(dict(variant=var,boxWidth=BOXW,palmToBoxSide=dict(giver=[min(x[2] for x in meas if x[0]=='giver'),max(x[2] for x in meas if x[0]=='giver')],receiver=[min(x[2] for x in meas if x[0]=='receiver'),max(x[2] for x in meas if x[0]=='receiver')]),
  timeline=dict(giveStart=1,receiveStart=11,release=51,grab=51,securedHold=T_POP,popSquash=[T_POP,T_POP+8],lidOff=T_POP+10,reveal=T_POP+10,propLand=T_POP+26,reactStart=T_REACT)),open(f'{outdir}/{var}_seq.json','w'),indent=1)
print('done',var)
