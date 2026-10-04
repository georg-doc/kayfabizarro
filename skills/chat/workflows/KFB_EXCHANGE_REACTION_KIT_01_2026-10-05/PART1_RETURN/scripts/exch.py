import bpy,sys,json,os,math
from mathutils import Vector,Matrix
mode,rig,outdir=sys.argv[1:4]
H={'M':2.17,'L':4.19}[rig]; S=H/2.17
ACT={'M':('A_RobotOne.glb','A_RobotTwo.glb'),'L':('A_OrcBrute.glb','A_OrcBrute.glb')}[rig]
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; sc.render.fps=30
os.makedirs(outdir,exist_ok=True); M={}
def imp(p):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=p,loglevel=50); new=[o for o in sc.objects if o not in before]
    return None,[o for o in new if o.parent is None],new
def gift(name='present-a-cube'):
    arm,top,new=imp(f'/tmp/x1/kh/{name}.glb')
    e=bpy.data.objects.new('gift',None); sc.collection.objects.link(e)
    lid=[o for o in new if o.name.startswith('lid')][0]; box=[o for o in new if o.type=='MESH' and o is not lid][0]
    for o in top: o.parent=e
    return e,box,lid
def imp_actor(p):
    before=set(sc.objects); bpy.ops.import_scene.gltf(filepath=p,loglevel=50); new=[o for o in sc.objects if o not in before]
    return [o for o in new if o.type=='ARMATURE'][0],[o for o in new if o.parent is None]
def setact(arm,name,offset,which=0):
    a=[v for k,v in bpy.data.actions.items() if k.startswith(name)]; act=a[which]
    arm.animation_data_create(); arm.animation_data.action=None
    tr=arm.animation_data.nla_tracks.new(); st=tr.strips.new(name,int(act.frame_range[0])-offset,act)
    if act.slots: st.action_slot=act.slots[0]
    return act
def hs(arm,s): return arm.matrix_world@arm.pose.bones['handslot.'+s].head
def mid(arm): return (hs(arm,'l')+hs(arm,'r'))/2
def sep(arm): return (hs(arm,'l')-hs(arm,'r')).length
bpy.ops.mesh.primitive_plane_add(size=200); fl=bpy.context.active_object; m=bpy.data.materials.new('f'); m.diffuse_color=(0.80,0.78,0.74,1); fl.data.materials.append(m)
sc.render.engine='BLENDER_WORKBENCH'; sh=sc.display.shading; sh.light='STUDIO'; sh.color_type='TEXTURE'; sh.show_shadows=True
sc.world=bpy.data.worlds.new('w'); sc.world.color=(0.93,0.91,0.86)
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera=cam; cam.data.type='ORTHO'
def shoot(fn,c,loc,ortho,tz,rx=640,ry=400):
    sc.render.resolution_x=rx; sc.render.resolution_y=ry; cam.data.ortho_scale=ortho*S
    L=Vector(loc)*S+c; cam.location=L; cam.rotation_euler=(Vector((c.x,c.y,tz*S))-L).to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=fn; bpy.ops.render.render(write_still=True)
PALM=0.02*H
if mode=='pair':
    D={'M':1.1488,'L':2.7735}[rig]
    A,_=imp_actor(ACT[0]); B,topB=imp_actor(ACT[1])
    for o in topB: o.rotation_mode='XYZ'; o.location=(0,-D,0); o.rotation_euler=(0,0,math.pi)
    aA=setact(A,'kfb_interaction_gift_give_a',0,0); aB=setact(B,'kfb_interaction_gift_receive_a',10,-1)
    f0=int(aA.frame_range[0]); sc.frame_set(f0+40); bpy.context.view_layer.update()
    w=sep(A)-2*PALM; e,box,lid=gift(); sc_=w/0.4; e.scale=(sc_,sc_,sc_); hbox=0.3*sc_
    M['boxWidth']=round(w,3); M['kenneyScale']=round(sc_,3)
    dev=[]
    for f in range(0,90):
        sc.frame_set(f0+f); bpy.context.view_layer.update()
        holder=A if f<=50 else B
        if f>=60 and holder is B and f-10>90: pass
        c=mid(holder); e.location=c-Vector((0,0,hbox/2))
        if (30<=f<=50): dev.append(('giver',f,round((sep(A)/2-PALM)-w/2,3)))
        if (50<=f<=78): dev.append(('receiver',f,round((sep(B)/2-PALM)-w/2,3)))
        if f in (0,30,50,68,89):
            shoot(f'{outdir}/pair_{rig}__f{f:02d}.png',Vector((0,-D/2,0)),(4.4,-2.4,2.0),3.6,0.9)
    M['palmToBoxSide']=dict(giver=[min(x[2] for x in dev if x[0]=='giver'),max(x[2] for x in dev if x[0]=='giver')],
                            receiver=[min(x[2] for x in dev if x[0]=='receiver'),max(x[2] for x in dev if x[0]=='receiver')])
elif mode=='lid':
    A,_=imp_actor(ACT[0]); a=setact(A,'kfb_interaction_opening_a_lid_a',0,0); f0=int(a.frame_range[0])
    best=None
    for f in range(40,80):
        sc.frame_set(f0+f); bpy.context.view_layer.update(); z=mid(A).z
        if best is None or z<best[1]: best=(f,z)
    fg=best[0]; sc.frame_set(f0+fg); bpy.context.view_layer.update(); cg=mid(A).copy(); sg=sep(A)
    top_z=cg.z-PALM; sc_=top_z/0.3; e,box,lid=gift(); e.scale=(sc_,sc_,sc_); e.location=(cg.x,cg.y,0)
    M.update(grabFrame=fg,handSep=round(sg,3),lidWidth=round(0.4*sc_,3),boxHeight=round(top_z,3),kenneyScale=round(sc_,3))
    # lid release: frame where hands reach top
    top=None
    for f in range(fg,200):
        sc.frame_set(f0+f); bpy.context.view_layer.update(); z=mid(A).z
        if top is None or z>top[1]: top=(f,z)
    fr=top[0]; M['releaseFrame']=fr; M['liftHeight']=round(top[1]-cg.z,3)
    lid0=lid.location.copy()
    for f in (0,30,fg,90,120,fr,fr+12):
        sc.frame_set(f0+min(f,220)); bpy.context.view_layer.update()
        if fg<=f<=fr: d=(mid(A)-cg)/sc_; lid.location=lid0+Vector((d.x,-d.z,d.y)) if False else lid0
        # lid follows hands in world space
        if fg<=f<=fr: lid.matrix_world.translation=(Matrix.Translation(mid(A)-cg)@ (e.matrix_world@Matrix.Translation(lid0))).translation
        if f>fr: lid.matrix_world.translation=(Matrix.Translation(mid(A)-cg+Vector((0,0.5*S,0.3*S)))@(e.matrix_world@Matrix.Translation(lid0))).translation
        shoot(f'{outdir}/lid_{rig}__f{f:03d}.png',Vector((cg.x,cg.y/2,0)),(4.0,-3.2,1.6),2.6,0.7,520,400)
elif mode=='heldpop':
    B,_=imp_actor(ACT[1]); a=setact(B,'kfb_interaction_gift_receive_a',0,-1); f0=int(a.frame_range[0])
    sc.frame_set(f0+75); bpy.context.view_layer.update(); w=sep(B)-2*PALM; sc_=w/0.4
    e,box,lid=gift(); e.scale=(sc_,sc_,sc_); hb=0.3*sc_; c=mid(B); e.location=c-Vector((0,0,hb/2))
    gb=imp('/tmp/x1/kh/gingerbread-man.glb'); gtop=gb[1]
    for o in gtop: o.scale=(sc_*1.6,)*3; o.location=(c.x,c.y,-5)
    lid0=lid.matrix_world.translation.copy()
    for k,(lidup,gz,sq) in enumerate([(0,None,1),(0.0,None,0.8),(0.55,0.3,1.15),(0.9,0.55,1)]):
        e.scale=(sc_/math.sqrt(sq),sc_/math.sqrt(sq),sc_*sq) if sq!=1 else (sc_,)*3
        lid.matrix_world.translation=lid0+Vector((0,0.1*lidup*S,lidup*S))
        for o in gtop: o.location=(c.x,c.y,(c.z+hb/2+gz*S) if gz is not None else -5)
        shoot(f'{outdir}/heldpop_{rig}__{k}.png',Vector((c.x,c.y,0)),(3.2,-3.6,1.6),2.4,1.0,420,420)
elif mode=='knead':
    A,_=imp_actor(ACT[0]); a=setact(A,'kfb_fluff_knead_press_a',0,0); f0=int(a.frame_range[0])
    sys.path.insert(0,'/tmp/f3'); from knead import kneaded
    ball=kneaded('fl',7); mb=bpy.data.materials.new('b'); mb.diffuse_color=(0.55,0.41,0.78,1); ball.data.materials.append(mb)
    seps=[]
    for f in range(0,77):
        sc.frame_set(f0+f); bpy.context.view_layer.update(); seps.append((f,sep(A),mid(A).copy()))
    smin=min(s[1] for s in seps); r=max(0.08,(smin-2*PALM)/2); M['kneadBallR']=round(r,3)
    e,box,lid=gift(); e.scale=(0.001,)*3
    for k,(f,mode2) in enumerate([(10,'k'),(40,'k'),(60,'squash'),(60,'pop')]):
        sc.frame_set(f0+f); bpy.context.view_layer.update(); c=mid(A)
        if mode2=='pop':
            ball.scale=(0.001,)*3; s_=2*r/0.4*1.3; e.scale=(s_,)*3; e.location=c-Vector((0,0,0.15*s_))
        else:
            q=0.6 if mode2=='squash' else 1.0; ball.scale=(r/math.sqrt(q),r/math.sqrt(q),r*q); ball.location=c
        shoot(f'{outdir}/knead_{rig}__{k}.png',Vector((c.x,c.y,0)),(3.2,-3.6,1.6),2.4,0.8,420,420)
json.dump(M,open(f'{outdir}/{mode}_{rig}.json','w'),indent=1); print(mode,rig,M)
