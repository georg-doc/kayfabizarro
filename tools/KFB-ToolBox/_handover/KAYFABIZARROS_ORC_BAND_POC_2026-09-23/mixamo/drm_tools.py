
import bpy, math, json
from mathutils import Vector, Matrix, Quaternion
from mathutils.bvhtree import BVHTree
OUT="/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/_probe_batch1/"
STICKS={'l':'Orc_WardrumStick_DR','r':'Orc_WardrumStick.R_DR'}
def stick_pts(name, n=40):
    o=bpy.data.objects[name]; vs=[v.co.copy() for v in o.data.vertices]
    step=max(1,len(vs)//n); return vs[::step]
def mesh_bvh(o, dg):
    e=o.evaluated_get(dg); mw=o.matrix_world
    return BVHTree.FromPolygons([mw@v.co for v in e.data.vertices],[tuple(p.vertices) for p in e.data.polygons])
def collide_report(scn='DRM_BRUTE', frames=None, targets=('Head','Body','Shoulderpad'), margin=0.03):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc
    frames=frames or range(sc.frame_start, sc.frame_end+1, 2)
    SP={k:stick_pts(v) for k,v in STICKS.items()}
    rep={}; per_frame=[]
    for f in frames:
        sc.frame_set(f); dg=bpy.context.evaluated_depsgraph_get()
        bv={t:mesh_bvh(bpy.data.objects[f'OrcBrute_{t}_DR'],dg) for t in targets}
        row={}
        for side,name in STICKS.items():
            o=bpy.data.objects[name]; mw=o.matrix_world
            for t,b in bv.items():
                worst=9
                for p in SP[side]:
                    w=mw@p; h,nr,i,d=b.find_nearest(w)
                    if h is None: continue
                    sd=d if (w-h).dot(nr)>=0 else -d
                    worst=min(worst,sd)
                row[f'{side}:{t}']=round(worst,3)
                k=f'{side}:{t}'; r=rep.setdefault(k,[9,0])
                r[0]=min(r[0],worst); r[1]+= (worst<margin)
        per_frame.append((f,row))
    return {k:[round(v[0],3),v[1]] for k,v in rep.items()}, per_frame

def shoulder_offset_matrix(rig, side, alpha, beta):
    pb=rig.pose.bones; ch=pb['chest']; rb=rig.data.bones['chest']
    Rrel=(ch.matrix.to_3x3()@rb.matrix_local.to_3x3().inverted())
    F=(Rrel@Vector((0,-1,0))).normalized(); L=(Rrel@Vector((1,0,0))).normalized()
    sgn=1 if side=='l' else -1
    q=Quaternion(F, math.radians(alpha)*sgn)@Quaternion(L, -math.radians(beta))
    h=pb['upperarm.'+side].head
    return Matrix.Translation(h)@q.to_matrix().to_4x4()@Matrix.Translation(-h)
def apply_offsets_now(rig, offs):
    """offs: {'l':(a,b),'r':(a,b)} applied to current evaluated pose (not keyed)"""
    pb=rig.pose.bones
    for side,(a,b) in offs.items():
        if a==0 and b==0: continue
        up=pb['upperarm.'+side]; bone=rig.data.bones['upperarm.'+side]; par=bone.parent
        M=shoulder_offset_matrix(rig,side,a,b)@up.matrix
        base=pb[par.name].matrix@par.matrix_local.inverted()@bone.matrix_local
        up.matrix_basis=base.inverted()@M
    bpy.context.view_layer.update()
def clearance(side, targets, dg, SP):
    o=bpy.data.objects[STICKS[side]]; mw=o.matrix_world; worst=9
    for t,b in targets.items():
        for p in SP:
            w=mw@p; h,nr,i,d=b.find_nearest(w)
            if h is None: continue
            sd=d if (w-h).dot(nr)>=0 else -d
            worst=min(worst,sd)
    return worst
def eval_offsets(side, a, b, frames, tnames=('Head','Body','Shoulderpad'), scn='DRM_BRUTE', rig='Brute_DR'):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; R=bpy.data.objects[rig]
    SP=stick_pts(STICKS[side],30); worst=9; bad=0
    for f in frames:
        sc.frame_set(f); apply_offsets_now(R,{side:(a,b)})
        dg=bpy.context.evaluated_depsgraph_get()
        bv={t:mesh_bvh(bpy.data.objects[f'OrcBrute_{t}_DR'],dg) for t in tnames}
        c=clearance(side,bv,dg,SP); worst=min(worst,c); bad+=(c<0.03)
    return round(worst,3), bad

def inside_parity(bvh, p, dirs=(Vector((1,0,0)),Vector((0,1,0)),Vector((0,0,1)))):
    votes=0
    for d in dirs:
        cnt=0; o=p.copy()
        for _ in range(20):
            h,n,i,dist=bvh.ray_cast(o,d)
            if h is None: break
            cnt+=1; o=h+d*1e-4
        votes+= cnt%2
    return votes>=2
def pose_offsets(rig, prm):
    """prm: {'l':(alpha,beta,tau),'r':(...)} applied to current frame pose, not keyed"""
    pb=rig.pose.bones
    for side,(a,b,t) in prm.items():
        if a or b:
            up=pb['upperarm.'+side]; bone=rig.data.bones['upperarm.'+side]; par=bone.parent
            M=shoulder_offset_matrix(rig,side,a,b)@up.matrix
            base=pb[par.name].matrix@par.matrix_local.inverted()@bone.matrix_local
            up.matrix_basis=base.inverted()@M
        if t:
            bpy.context.view_layer.update()
            w=pb['wrist.'+side]
            w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(t),4,'Y')
    bpy.context.view_layer.update()
def eval_side(side, prm, frames, tnames=('Head','Body','Shoulderpad','LegArmor'), scn='DRM_BRUTE', rig='Brute_DR', margin=0.03):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; R=bpy.data.objects[rig]
    SP=stick_pts(STICKS[side],24); pen=0; near=0; fwd=[]; minp=9
    for f in frames:
        sc.frame_set(f); pose_offsets(R,{side:prm})
        dg=bpy.context.evaluated_depsgraph_get()
        bv=[mesh_bvh(bpy.data.objects[f'OrcBrute_{t}_DR'],dg) for t in tnames]
        o=bpy.data.objects[STICKS[side]]; mw=o.matrix_world
        fp=0
        for p in SP:
            w=mw@p
            for b in bv:
                h,nr,i,d=b.find_nearest(w)
                if h is None: continue
                if d<margin: fp+=1; break
                if d<0.6 and inside_parity(b,w): fp+=1; break
        pen+= (fp>0)
        ax=(mw.to_3x3()@Vector((0,0,1))).normalized(); fwd.append(ax.dot(Vector((0,-1,0))))
    return {'bad_frames':pen,'n':len(frames),'club_fwd':round(sum(fwd)/len(fwd),2)}

def record_raw(scn='DRM_BRUTE', rig='Brute_DR'):
    sc=bpy.data.scenes[scn]; bpy.context.window.scene=sc; R=bpy.data.objects[rig]; pb=R.pose.bones; W=R.matrix_world
    for s in 'lr':
        for c in list(pb['lowerarm.'+s].constraints): pb['lowerarm.'+s].constraints.remove(c)
    data={}
    for f in range(sc.frame_start, sc.frame_end+1):
        sc.frame_set(f); CH=W@pb['chest'].matrix; ci=CH.inverted()
        d={}
        for s in 'lr':
            hs=W@pb['handslot.'+s].head; wh=W@pb['wrist.'+s].head; el=W@pb['lowerarm.'+s].head; sh=W@pb['upperarm.'+s].head
            d[s]={'H':ci@hs,'hv':ci.to_3x3()@(hs-wh),'pole':ci@(el+(el-(sh+wh)/2).normalized()*0.6)}
        data[f]=d
    return data
def setup_ik(data, scn='DRM_BRUTE', rig='Brute_DR'):
    sc=bpy.data.scenes[scn]; R=bpy.data.objects[rig]; pb=R.pose.bones
    E={}
    for s in 'lr':
        for k in ('tgt','pole'):
            n=f'DR_{k}_{s}'; e=bpy.data.objects.get(n)
            if not e:
                e=bpy.data.objects.new(n,None); e.empty_display_size=0.08; sc.collection.objects.link(e)
            e.hide_render=True; e.parent=R; e.parent_type='BONE'; e.parent_bone='chest'
            E[k+s]=e
        b=pb['lowerarm.'+s]
        for c in list(b.constraints): b.constraints.remove(c)
        c=b.constraints.new('IK'); c.target=E['tgt'+s]; c.pole_target=E['pole'+s]; c.chain_count=2
    return E
def _chest_local_to_parent_space(R, v):
    # empties parented to chest bone: parent space origin = bone TAIL, axes = bone pose matrix axes
    b=R.data.bones['chest']; return v - Vector((0,b.length,0))
def key_targets(data, E, side, delta, scale=1.0, scn='DRM_BRUTE', rig='Brute_DR'):
    sc=bpy.data.scenes[scn]; R=bpy.data.objects[rig]
    et=E['tgt'+side]; ep=E['pole'+side]; et.animation_data_clear(); ep.animation_data_clear()
    et.matrix_parent_inverse.identity(); ep.matrix_parent_inverse.identity()
    fs=sorted(data); Hm=sum((data[f][side]['H'] for f in fs),Vector())/len(fs)
    for f in fs:
        d=data[f][side]
        H=Hm+(d['H']-Hm)*scale+Vector(delta)
        wt=H-d['hv']
        et.location=_chest_local_to_parent_space(R,wt); et.keyframe_insert('location',frame=f)
        ep.location=_chest_local_to_parent_space(R,d['pole']+Vector(delta)); ep.keyframe_insert('location',frame=f)
def set_pole_angle(side, ang, rig='Brute_DR'):
    R=bpy.data.objects[rig]; R.pose.bones['lowerarm.'+side].constraints[0].pole_angle=math.radians(ang)

def key_targets2(data, E, side, delta, pole_off=(0,0,0), scale=1.0, scn='DRM_BRUTE', rig='Brute_DR'):
    R=bpy.data.objects[rig]
    et=E['tgt'+side]; ep=E['pole'+side]; et.animation_data_clear(); ep.animation_data_clear()
    et.matrix_parent_inverse.identity(); ep.matrix_parent_inverse.identity()
    fs=sorted(data); Hm=sum((data[f][side]['H'] for f in fs),Vector())/len(fs)
    for f in fs:
        d=data[f][side]
        H=Hm+(d['H']-Hm)*scale+Vector(delta)
        et.location=_chest_local_to_parent_space(R,H-d['hv']); et.keyframe_insert('location',frame=f)
        ep.location=_chest_local_to_parent_space(R,d['pole']+Vector(delta)+Vector(pole_off)); ep.keyframe_insert('location',frame=f)
