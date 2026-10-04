
import bpy, math, json, os, re, time
from mathutils import Matrix, Vector, Quaternion
BASE='/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/'
INBOX=BASE+'_inbox/'; ML=BASE+'MOTION_LIB/'
TARGETS={'Rig_Medium':'Rig_Raider','Rig_Large':'Rig_Brute'}
GROUPS={
 'locomotion':['Walk Backward','Run Forward','Run Backward','Sad Walk'],
 'climb':['Climbing','Climbing (1)','Climbing To Top'],
 'idle':['Breathing Idle','Breathing Idle (1)','Happy Idle','Sad Idle','Defeat Idle','Injured Idle','Kneeling Idle','Ninja Idle','Orc Idle','Laughing','Rejected'],
 'dance':['Hip Hop Dancing','Locking Hip Hop Dance','Slide Hip Hop Dance','Step Hip Hop Dance','Wave Hip Hop Dance','House Dancing','House Dancing (1)','Samba Dancing','Chicken Dance','ORC BRUTE - MIXAMO - Thriller Part 3'],
 'music':['Guitar Playing','Guitar Playing (1)','Guitar Playing (2)','Playing Drums'],
 'action':['Fireball']}
NAMES={'Walk Backward':'walk_backward','Run Forward':'run_forward','Run Backward':'run_backward','Sad Walk':'sad_walk',
 'Climbing':'up','Climbing (1)':'up','Climbing To Top':'to_top',
 'Breathing Idle':'breathing','Breathing Idle (1)':'breathing','Happy Idle':'happy','Sad Idle':'sad','Defeat Idle':'defeat','Injured Idle':'injured','Kneeling Idle':'kneeling','Ninja Idle':'ninja','Orc Idle':'orc','Laughing':'laughing','Rejected':'rejected',
 'Hip Hop Dancing':'hip_hop','Locking Hip Hop Dance':'locking_hip_hop','Slide Hip Hop Dance':'slide_hip_hop','Step Hip Hop Dance':'step_hip_hop','Wave Hip Hop Dance':'wave_hip_hop','House Dancing':'house','House Dancing (1)':'house','Samba Dancing':'samba','Chicken Dance':'chicken','ORC BRUTE - MIXAMO - Thriller Part 3':'thriller_part3',
 'Guitar Playing':'guitar','Guitar Playing (1)':'guitar','Guitar Playing (2)':'guitar','Playing Drums':'drums','Fireball':'fireball'}
LABEL_DE={'walk_backward':'Rückwärts gehen','run_forward':'Vorwärts rennen','run_backward':'Rückwärts rennen','sad_walk':'Traurig gehen','up':'Klettern','to_top':'Hochklettern über die Kante',
 'breathing':'Atmen (Stand)','happy':'Fröhlich stehen','sad':'Traurig stehen','defeat':'Niederlage','injured':'Verletzt stehen','kneeling':'Kniend','ninja':'Ninja-Stand','orc':'Ork-Stand','laughing':'Lachen','rejected':'Abgewiesen',
 'hip_hop':'Hip-Hop','locking_hip_hop':'Hip-Hop Locking','slide_hip_hop':'Hip-Hop Slide','step_hip_hop':'Hip-Hop Step','wave_hip_hop':'Hip-Hop Wave','house':'House','samba':'Samba','chicken':'Ententanz','thriller_part3':'Thriller Teil 3',
 'guitar':'Gitarre spielen','drums':'Schlagzeug spielen','fireball':'Feuerball'}
def group_of(fn):
    for g,l in GROUPS.items():
        if fn in l: return g
def variant_of(fn):
    m=re.search(r'\((\d+)\)$',fn); return 'abcdefg'[int(m.group(1))] if m else 'a'
def clip_id(fn): return f"kfb_{group_of(fn)}_{NAMES[fn]}_{variant_of(fn)}"
def fcs(a):
    return [fc for l in a.layers for s in l.strips for cb in s.channelbags for fc in cb.fcurves]
BONES=None
def import_src(fn):
    sc=bpy.context.scene
    before=set(bpy.data.objects.keys()); ba=set(bpy.data.actions.keys())
    bpy.ops.import_scene.fbx(filepath=INBOX+fn+'.fbx', automatic_bone_orientation=False, ignore_leaf_bones=False)
    objs=[o for o in bpy.data.objects if o.name not in before]
    acts=[a for a in bpy.data.actions if a.name not in ba]
    arm=[o for o in objs if o.type=='ARMATURE'][0]
    for o in objs:
        if o.type!='ARMATURE': bpy.data.objects.remove(o)
    return arm,acts
def sample_src(arm):
    sc=bpy.context.scene; a=arm.animation_data.action
    f0,f1=int(round(a.frame_range[0])),int(round(a.frame_range[1]))
    names=[b.name for b in arm.data.bones]
    frames=[]
    for f in range(f0,f1+1):
        sc.frame_set(f)
        mw=arm.matrix_world.copy()
        frames.append({n:(mw@arm.pose.bones[n].matrix).copy() for n in names})
    return f0,f1,frames
def retarget(arm,frames,tname):
    T=bpy.data.objects[tname]
    N=Matrix.Rotation(math.radians(90),4,'X')
    off=(T.data.bones['hips'].matrix_local.to_3x3()@arm.data.bones['hips'].matrix_local.to_3x3().inverted()).to_4x4()
    C=off@N.inverted()
    k=T.data.bones['hips'].head_local.z/(off@arm.data.bones['hips'].matrix_local).translation.z
    out=[]
    restT={b.name:b.matrix_local for b in T.data.bones}
    restSW={b.name:(off@b.matrix_local) for b in arm.data.bones}
    order=[b for b in T.data.bones]  # parents before children (Blender order)
    prevq={}
    for fr in frames:
        M={}; basis={}
        for b in order:
            n=b.name
            Ms=C@fr[n]
            D=Ms.to_quaternion()@restSW[n].to_quaternion().inverted()
            R=(D@restT[n].to_quaternion()).to_matrix().to_4x4()
            if n in ('root','hips'):
                R.translation=Ms.translation*k
                if b.parent: B=(M[b.parent.name]@restT[b.parent.name].inverted()@restT[n]).inverted()@R
                else: B=restT[n].inverted()@R
                M[n]=R
            else:
                P=M[b.parent.name]@restT[b.parent.name].inverted()@restT[n]
                Rot=P.to_3x3().inverted()@R.to_3x3()
                B=Rot.to_4x4()
                M[n]=P@B
            q=B.to_quaternion()
            if n in prevq and q.dot(prevq[n])<0: q=-q
            prevq[n]=q
            basis[n]=(q,B.translation.copy())
        out.append((basis,{n:M[n].translation.copy() for n in ('root','hips','foot.l','foot.r','hand.l','hand.r','head')},{n:M[n].to_quaternion() for n in M}))
    return out,k
def make_action(name,tname,out):
    T=bpy.data.objects[tname]
    a=bpy.data.actions.get(name)
    if a: bpy.data.actions.remove(a)
    a=bpy.data.actions.new(name); a.use_fake_user=True
    slot=a.slots.new(id_type='OBJECT',name=tname)
    lay=a.layers.new('L'); st=lay.strips.new(type='KEYFRAME'); cb=st.channelbag(slot,ensure=True)
    n=len(out)
    for b in T.data.bones:
        bn=b.name
        chans=[('rotation_quaternion',4)]+([('location',3)] if bn in ('root','hips') else [])
        for path,cnt in chans:
            for i in range(cnt):
                fc=cb.fcurves.new(f'pose.bones["{bn}"].{path}',index=i,group_name=bn)
                fc.keyframe_points.add(n)
                co=[]
                for fi,(basis,_,_) in enumerate(out):
                    q,l=basis[bn]; v=q[i] if path=='rotation_quaternion' else l[i]
                    co+= [fi+1, v]
                fc.keyframe_points.foreach_set('co',co)
                for kp in fc.keyframe_points: kp.interpolation='LINEAR'
                fc.update()
    return a
def measure(out,hips_h,fps):
    n=len(out)
    r0=out[0][1]['root']; r1=out[-1][1]['root']
    h0=out[0][1]['hips']; h1=out[-1][1]['hips']
    dxy=Vector((h1.x-h0.x,h1.y-h0.y)).length; dz=h1.z-h0.z
    # loop: rotation difference first vs last
    q0=out[0][2]; q1=out[-1][2]
    rot=max(math.degrees(q0[b].rotation_difference(q1[b]).angle) for b in q0 if b not in ('root',))
    travel=dxy>0.25*hips_h or abs(dz)>0.25*hips_h
    loop=rot<15 and (travel or dxy<0.15*hips_h)
    # contacts feet
    cont={}
    for ft in ('foot.l','foot.r'):
        zs=[o[1][ft].z for o in out]; zmin=min(zs); thr=zmin+0.06*hips_h
        spans=[]; cur=None
        for i,z in enumerate(zs):
            if z<=thr and cur is None: cur=i
            if z>thr and cur is not None: spans.append([cur+1,i]); cur=None
        if cur is not None: spans.append([cur+1,n])
        cont[ft]=spans
    return {'frames':n,'durationSec':round(n/fps,3),'loop':bool(loop),'loopPoseDiffDeg':round(rot,1),'rootMotion':'travel' if travel else 'in-place',
            'travelXY':round(dxy,3),'travelZ':round(dz,3),'dir':[round(h1.x-h0.x,3),round(h1.y-h0.y,3)],'contacts':cont,
            'hipsRange':[round(min(o[1]['hips'].z for o in out),3),round(max(o[1]['hips'].z for o in out),3)]}
def do_clip(fn,log):
    t0=time.time()
    sc=bpy.context.scene
    arm,acts=import_src(fn)
    fps=sc.render.fps/sc.render.fps_base
    f0,f1,frames=sample_src(arm)
    srcinfo={'hips':round(arm.data.bones['hips'].head_local.length,3),'bones':len(arm.data.bones),'upperarm':round(arm.data.bones['upperarm.l'].length,3)}
    cid=clip_id(fn); res={'id':cid,'file':fn,'fps':fps,'src':srcinfo,'rigs':{}}
    for rig,tname in TARGETS.items():
        out,k=retarget(arm,frames,tname)
        make_action(cid+'__'+rig,tname,out)
        hh=bpy.data.objects[tname].data.bones['hips'].head_local.z
        res['rigs'][rig]=measure(out,hh,fps); res['rigs'][rig]['k']=round(k,4)
    for a in acts: bpy.data.actions.remove(a)
    bpy.data.objects.remove(arm)
    res['sec']=round(time.time()-t0,1)
    log[fn]=res
    return res
