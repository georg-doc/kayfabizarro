
import bpy, math, json
from mathutils import Vector, Matrix
OUT="/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/_probe_batch1/"
def use(rig,a):
    rig.animation_data.action=a
    try: rig.animation_data.action_slot=a.slots[0]
    except Exception: pass
def apply_fit(ns, prm, scn='GTR_RAIDER_A', rigname='Raider_GA', rawname='GA_raider_guitarA_raw', gname='guitar_GA', parent='spine', zt=0.05, slide_max=0.2, tag='GA'):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; rig=bpy.data.objects[rigname]; pb=rig.pose.bones; W=rig.matrix_world
    raw=bpy.data.actions[rawname]
    act=raw.copy(); act.name=tag+'_fit'; use(rig,act)
    D,_=ns['gather'](scn,rigname,parent,step=4,pframes=2)
    left,up,fwd=ns['frame_axes'](D)
    th,psi,phi,s,lx,uy,fz=[prm[k] for k in ('th','psi','phi','s','lx','uy','fz')]
    Rot,nv=ns['guitar_rot'](left,up,fwd,th,psi,phi)
    S=left*lx+up*uy+fwd*fz
    pos=S-Rot@(Vector((0,0,-0.9))*s)
    Mloc=Matrix.Translation(pos)@Rot.to_4x4()@Matrix.Diagonal((s,s,s,1))
    g=bpy.data.objects.get(gname)
    if not g:
        g=bpy.data.objects['guitar_B'].copy(); g.name=gname; sc.collection.objects.link(g)
    g.parent=rig; g.parent_type='BONE'; g.parent_bone=parent
    f0,f1=sc.frame_start,sc.frame_end
    sc.frame_set(f0); g.matrix_world=W@pb[parent].matrix@Mloc
    Rs=[];Ls=[]
    for f in range(f0,f1+1):
        sc.frame_set(f); inv=(W@pb[parent].matrix).inverted()
        Rs.append(inv@(W@pb['handslot.r'].head)); Ls.append(inv@(W@pb['handslot.l'].head))
    Rm=sum(Rs,Vector())/len(Rs); Lm=sum(Ls,Vector())/len(Ls)
    Ri=Rot.transposed()
    q=Ri@(Rm-pos)/s; qx=max(-0.25,min(0.25,q.x)); qz=max(-1.1,min(-0.7,q.z))
    dr=(Mloc@Vector((qx,-(0.083+0.05),qz)))-Rm
    d=(Rot@Vector((0,0,1))).normalized(); Minv=Mloc.inverted()
    def empty(n):
        e=bpy.data.objects.get(n)
        if not e:
            e=bpy.data.objects.new(n,None); e.empty_display_size=0.05; sc.collection.objects.link(e)
        e.animation_data_clear(); return e
    E={k:empty(tag+'_'+k) for k in ('tgtL','tgtR','poleL','poleR')}
    for i,f in enumerate(range(f0,f1+1)):
        sc.frame_set(f); SP=W@pb[parent].matrix
        slide=max(-slide_max,min(0.0,((Ls[i]-Lm).dot(d))/s))
        TL=Mloc@Vector((0,-0.03,zt+slide))
        ql=Minv@(Rs[i]+dr)
        if abs(ql.x)<0.45 and ql.z<-0.45 and ql.y>-(0.083+0.03): ql.y=-(0.083+0.03)
        TR=Mloc@ql
        for side,T in (('l',SP@TL),('r',SP@TR)):
            hs=W@pb['handslot.'+side].head; wh=W@pb['wrist.'+side].head
            sh=W@pb['upperarm.'+side].head; el=W@pb['lowerarm.'+side].head
            e=E['tgt'+side.upper()]; e.location=T-(hs-wh); e.keyframe_insert('location',frame=f)
            p=E['pole'+side.upper()]; p.location=el+(el-(sh+wh)/2).normalized()*0.4; p.keyframe_insert('location',frame=f)
    for side,ang in (('l',180),('r',0)):
        b=pb['lowerarm.'+side]
        for c in list(b.constraints): b.constraints.remove(c)
        c=b.constraints.new('IK'); c.target=E['tgt'+side.upper()]; c.pole_target=E['pole'+side.upper()]; c.chain_count=2; c.pole_angle=math.radians(ang)
    bones=['upperarm.l','lowerarm.l','upperarm.r','lowerarm.r']
    rec={}; werr={'l':0,'r':0}
    for f in range(f0,f1+1):
        sc.frame_set(f); rec[f]={n:pb[n].matrix.copy() for n in bones+['chest']}
        for side in 'lr':
            werr[side]=max(werr[side],((W@pb['wrist.'+side].head)-E['tgt'+side.upper()].matrix_world.translation).length)
    for side in 'lr':
        for c in list(pb['lowerarm.'+side].constraints): pb['lowerarm.'+side].constraints.remove(c)
    for f,M in rec.items():
        for n in bones:
            b=rig.data.bones[n]; p=b.parent
            basis=(M[p.name]@p.matrix_local.inverted()@b.matrix_local).inverted()@M[n]
            pb[n].rotation_quaternion=basis.to_quaternion(); pb[n].keyframe_insert('rotation_quaternion',frame=f)
    info={'prm':prm,'dr':round(dr.length,3),'wrist_err':{k:round(v,3) for k,v in werr.items()},'Mloc':[list(r) for r in Mloc]}
    json.dump(info,open(OUT+tag+'_fit_applied.json','w'))
    return info
def check(scn='GTR_RAIDER_A', rigname='Raider_GA', gname='guitar_GA', step=3):
    from mathutils.bvhtree import BVHTree
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; rig=bpy.data.objects[rigname]; pb=rig.pose.bones; W=rig.matrix_world
    g=bpy.data.objects[gname]; me=g.data
    bvh=BVHTree.FromPolygons([v.co.copy() for v in me.vertices],[tuple(p.vertices) for p in me.polygons])
    pen={}; elbow={'l':[999,0],'r':[999,0]}
    for f in range(sc.frame_start,sc.frame_end+1,step):
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get(); gi=g.matrix_world.inverted(); sg=g.matrix_world.to_scale().x
        for o in sc.objects:
            if o.type!='MESH' or o.parent!=rig or o==g: continue
            e=o.evaluated_get(dg); deep=0
            for v in e.data.vertices:
                q=gi@(o.matrix_world@v.co)
                if abs(q.x)>0.45 or abs(q.y)>0.12 or q.z<-1.4 or q.z>0.6: continue
                h,nr,i,dd=bvh.find_nearest(q)
                if h is not None and (q-h).dot(nr)<0: deep=max(deep,dd*sg)
            if deep>0:
                k=o.name.split('_')[1] if o.name.startswith('OrcRaider') else o.name
                pen[k]=[pen.get(k,[0,0])[0]+1, round(max(pen.get(k,[0,0])[1],deep),3)]
        for side in 'lr':
            sh=W@pb['upperarm.'+side].head; el=W@pb['lowerarm.'+side].head; wh=W@pb['wrist.'+side].head
            a=math.degrees((sh-el).angle(wh-el)); elbow[side]=[round(min(elbow[side][0],a),1),round(max(elbow[side][1],a),1)]
    return {'penetration[frames,maxdepth]':pen,'elbow_inner_deg':elbow}

def apply_fit2(ns, prm, scn='GTR_RAIDER_A', rigname='Raider_GA', rawname='GA_raider_guitarA_raw', gname='guitar_GA', parent='spine', zt=0.05, slide_max=0.2, tag='GA', strum=(0,-0.15,-0.95), iters=3):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; rig=bpy.data.objects[rigname]; pb=rig.pose.bones; W=rig.matrix_world
    raw=bpy.data.actions[rawname]
    old=bpy.data.actions.get(tag+'_fit')
    act=raw.copy(); use(rig,act)
    if old: bpy.data.actions.remove(old)
    act.name=tag+'_fit'
    D,_=ns['gather'](scn,rigname,parent,step=4,pframes=2)
    left,up,fwd=ns['frame_axes'](D)
    th,psi,phi,s,lx,uy,fz=[prm[k] for k in ('th','psi','phi','s','lx','uy','fz')]
    Rot,nv=ns['guitar_rot'](left,up,fwd,th,psi,phi)
    S=left*lx+up*uy+fwd*fz
    pos=S-Rot@(Vector((0,0,strum[2]))*s)
    Mloc=Matrix.Translation(pos)@Rot.to_4x4()@Matrix.Diagonal((s,s,s,1))
    g=bpy.data.objects.get(gname)
    if not g:
        g=bpy.data.objects['guitar_B'].copy(); g.name=gname; sc.collection.objects.link(g)
    g.parent=rig; g.parent_type='BONE'; g.parent_bone=parent
    f0,f1=sc.frame_start,sc.frame_end
    sc.frame_set(f0); g.matrix_world=W@pb[parent].matrix@Mloc
    Rs=[];Ls=[];HV={'l':[],'r':[]}
    for f in range(f0,f1+1):
        sc.frame_set(f); inv=(W@pb[parent].matrix).inverted()
        Rs.append(inv@(W@pb['handslot.r'].head)); Ls.append(inv@(W@pb['handslot.l'].head))
    Rm=sum(Rs,Vector())/len(Rs); Lm=sum(Ls,Vector())/len(Ls)
    d=(Rot@Vector((0,0,1))).normalized(); Minv=Mloc.inverted()
    TRloc=Mloc@Vector(strum)
    # desired handslot targets in parent space
    TT={'l':[],'r':[]}
    for i in range(len(Rs)):
        slide=max(-slide_max,min(0.0,((Ls[i]-Lm).dot(d))/s))
        TT['l'].append(Mloc@Vector((0,-0.03,zt+slide)))
        ql=Minv@(TRloc+(Rs[i]-Rm))
        if abs(ql.x)<0.45 and ql.z<-0.45 and ql.y>-(0.083+0.06): ql.y=-(0.083+0.06)
        TT['r'].append(Mloc@ql)
    def empty(n):
        e=bpy.data.objects.get(n)
        if not e:
            e=bpy.data.objects.new(n,None); e.empty_display_size=0.05; sc.collection.objects.link(e)
        e.animation_data_clear(); e.hide_render=True; return e
    E={k:empty(tag+'_'+k) for k in ('tgtL','tgtR','poleL','poleR')}
    # initial wrist targets and poles from raw pose
    WT={'l':[],'r':[]}
    for i,f in enumerate(range(f0,f1+1)):
        sc.frame_set(f); SP=W@pb[parent].matrix
        for side in 'lr':
            hs=W@pb['handslot.'+side].head; wh=W@pb['wrist.'+side].head
            sh=W@pb['upperarm.'+side].head; el=W@pb['lowerarm.'+side].head
            WT[side].append(SP@TT[side][i]-(hs-wh))
            p=E['pole'+side.upper()]; p.location=el+(el-(sh+wh)/2).normalized()*0.4; p.keyframe_insert('location',frame=f)
    for side,ang in (('l',180),('r',0)):
        b=pb['lowerarm.'+side]
        for c in list(b.constraints): b.constraints.remove(c)
        c=b.constraints.new('IK'); c.target=E['tgt'+side.upper()]; c.pole_target=E['pole'+side.upper()]; c.chain_count=2; c.pole_angle=math.radians(ang)
    errs=[]
    for it in range(iters):
        for side in 'lr':
            e=E['tgt'+side.upper()]; e.animation_data_clear()
            for i,f in enumerate(range(f0,f1+1)):
                e.location=WT[side][i]; e.keyframe_insert('location',frame=f)
        m={'l':0,'r':0}
        for i,f in enumerate(range(f0,f1+1)):
            sc.frame_set(f); SP=W@pb[parent].matrix
            for side in 'lr':
                err=SP@TT[side][i]-(W@pb['handslot.'+side].head)
                WT[side][i]=WT[side][i]+err
                m[side]=max(m[side],err.length)
        errs.append({k:round(v,3) for k,v in m.items()})
    # final set + bake
    for side in 'lr':
        e=E['tgt'+side.upper()]; e.animation_data_clear()
        for i,f in enumerate(range(f0,f1+1)):
            e.location=WT[side][i]; e.keyframe_insert('location',frame=f)
    bones=['upperarm.l','lowerarm.l','upperarm.r','lowerarm.r']
    rec={}; fin={'l':0,'r':0}
    for i,f in enumerate(range(f0,f1+1)):
        sc.frame_set(f); rec[f]={n:pb[n].matrix.copy() for n in bones+['chest']}
        SP=W@pb[parent].matrix
        for side in 'lr': fin[side]=max(fin[side],(SP@TT[side][i]-(W@pb['handslot.'+side].head)).length)
    for side in 'lr':
        for c in list(pb['lowerarm.'+side].constraints): pb['lowerarm.'+side].constraints.remove(c)
    for f,M in rec.items():
        for n in bones:
            b=rig.data.bones[n]; p=b.parent
            basis=(M[p.name]@p.matrix_local.inverted()@b.matrix_local).inverted()@M[n]
            pb[n].rotation_quaternion=basis.to_quaternion(); pb[n].keyframe_insert('rotation_quaternion',frame=f)
    info={'prm':prm,'strum':list(strum),'zt':zt,'dr':round((TRloc-Rm).length,3),'handslot_err_iter':errs,'handslot_err_final':{k:round(v,3) for k,v in fin.items()},'Mloc':[list(r) for r in Mloc]}
    json.dump(info,open(OUT+tag+'_fit_applied.json','w'))
    return info
