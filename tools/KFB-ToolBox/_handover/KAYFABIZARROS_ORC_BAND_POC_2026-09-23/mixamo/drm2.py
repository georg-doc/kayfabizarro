
import bpy, math, json, itertools, time
import numpy as np
from mathutils import Vector, Matrix, Quaternion
P="/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/_inbox/_probe_batch1/"
DRUM=dict(c=(0.0,-2.3),r=0.736*2,H=0.92*2)
def use(R,a):
    R.animation_data.action=a
    try: R.animation_data.action_slot=a.slots[0]
    except Exception: pass
def prep(ns):
    sc=bpy.data.scenes['DRM_BRUTE']; bpy.context.window.scene=sc; R=bpy.data.objects['Brute_DR']
    use(R,bpy.data.actions['DR_brute_drums_raw'])
    data=ns['record_raw'](); E=ns['setup_ik'](data); ns['set_pole_angle']('l',180); ns['set_pole_angle']('r',0)
    ax=json.load(open(P+'drm_search3.json'))['axes']; FW,UP,LT=[Vector(a) for a in ax]
    return sc,R,data,E,FW,UP,LT
def pose_side(ns,R,data,E,FW,UP,LT,side,prm):
    fwd,up,lat,pout,pup,tau,phi=prm
    out=-LT if side=='r' else LT
    ns['key_targets2'](data,E,side,tuple(FW*fwd+UP*up+LT*lat),tuple(out*pout+UP*pup))
def wrist_adj(R,side,tau,phi):
    w=R.pose.bones['wrist.'+side]
    w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')
def club_state(ns,side):
    o=bpy.data.objects[ns['STICKS'][side]]; mw=o.matrix_world
    head=mw@Vector((0,0,0.5)); grip=mw@Vector((0,0,0.0)); ax=(head-grip).normalized()
    return head,ax
def drum_u(p):
    cx,cy=DRUM['c']; dx=p.x-cx; dy=p.y-cy; rad=math.hypot(dx,dy)
    return p.z-DRUM['H'], rad
def contact_eval(ns,sc,R,side,frames,tau,phi):
    gaps=[];dirs=[]
    for f in frames:
        sc.frame_set(f); wrist_adj(R,side,tau,phi); bpy.context.view_layer.update()
        head,ax=club_state(ns,side); u,rad=drum_u(head)
        gaps.append(u-0.19 if rad<DRUM['r']-0.15 else 9); dirs.append((ax.z, -ax.y))
    return gaps,dirs

def search_chunk(ns, side, lats, budget=50):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    strong=json.load(open(P+'DR_strong.json'))[side]
    rows=[]; t=time.time()
    pb=R.pose.bones
    for lat in lats:
        for fwd,up,pout,pup in itertools.product((0.2,0.4,0.6),(-0.2,0,0.2,0.4),(0,0.6,1.2),(0,0.6,1.2)):
            ns['pose_side'](ns,R,data,E,FW,UP,LT,side,(fwd,up,lat,pout,pup,0,0))
            acc={}
            for f in strong:
                sc.frame_set(f); w=pb['wrist.'+side]; base=w.matrix_basis.copy()
                for tau,phi in itertools.product((-75,-50,-25,0,25,50,75),(-30,0,30)):
                    w.matrix_basis=base@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')
                    bpy.context.view_layer.update()
                    head,ax=ns['club_state'](ns,side); u,rad=ns['drum_u'](head)
                    g=(u-0.19) if rad<DRUM['r']-0.15 else 9
                    a=acc.setdefault((tau,phi),[]); a.append((g,ax.z,-ax.y))
                w.matrix_basis=base
            for (tau,phi),L in acc.items():
                gaps=[x[0] for x in L]; dz=sum(x[1] for x in L)/len(L); fw=sum(x[2] for x in L)/len(L)
                miss=sum(1 for g in gaps if g>0.15 or g<-0.3); gc=sum(min(abs(g),0.6) for g in gaps)/len(gaps)
                cost=gc*4+miss*1.0+max(0,dz+0.1)*6+max(0,0.3-fw)*4+abs(tau)/150+abs(phi)/100+(fwd+abs(up)+abs(lat))*0.5+(pout+pup)*0.3
                rows.append((round(cost,3),fwd,up,lat,pout,pup,tau,phi,round(gc,2),miss,round(dz,2),round(fw,2)))
            if time.time()-t>budget: break
    rows.sort()
    return rows

def set_grip(g_r=-20, g_l=20):
    q0={'r':Quaternion((3.29e-8,-4.73e-9,-0.70710677,-0.70710677)),'l':Quaternion((3.29e-8,-2.43e-9,0.70710677,0.70710677))}
    from mathutils import Quaternion as Q
    for s,g,n in (('r',g_r,'Orc_WardrumStick.R_DR'),('l',g_l,'Orc_WardrumStick_DR')):
        o=bpy.data.objects[n]; o.rotation_mode='QUATERNION'; o.rotation_quaternion=Q((0,0,1),math.radians(g))@q0[s]
def search_chunk2(ns, side, lats, budget=50, grids=None):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    strong=json.load(open(P+'DR_strong.json'))[side]
    rows=[]; t=time.time(); pb=R.pose.bones
    G=grids or dict(fwd=(0.2,0.45,0.7),up=(-0.6,-0.4,-0.2,0),pout=(0.6,1.2),pup=(0.6,1.2,1.8),tau=(-45,-20,0,20,45),phi=(-30,0,30,45))
    for lat in lats:
        for fwd,up,pout,pup in itertools.product(G['fwd'],G['up'],G['pout'],G['pup']):
            ns['pose_side'](ns,R,data,E,FW,UP,LT,side,(fwd,up,lat,pout,pup,0,0))
            acc={}
            for f in strong:
                sc.frame_set(f); w=pb['wrist.'+side]; base=w.matrix_basis.copy()
                for tau,phi in itertools.product(G['tau'],G['phi']):
                    w.matrix_basis=base@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')
                    bpy.context.view_layer.update()
                    head,ax=ns['club_state'](ns,side); u,rad=ns['drum_u'](head)
                    g=(u-0.19) if rad<DRUM['r']-0.15 else 9
                    acc.setdefault((tau,phi),[]).append((g,ax.z,-ax.y))
                w.matrix_basis=base
            for (tau,phi),L in acc.items():
                gaps=[x[0] for x in L]; dz=sum(x[1] for x in L)/len(L); fw=sum(x[2] for x in L)/len(L)
                miss=sum(1 for g in gaps if g>0.15 or g<-0.3); gc=sum(min(abs(g),0.6) for g in gaps)/len(gaps)
                cost=gc*4+miss*1.0+abs(dz+0.05)*6+max(0,0.6-fw)*4+abs(tau)/120+abs(phi)/90+(fwd+abs(up)+abs(lat))*0.3+(pout+pup)*0.15
                rows.append((round(cost,3),fwd,up,lat,pout,pup,tau,phi,round(gc,2),miss,round(dz,2),round(fw,2)))
            if time.time()-t>budget: break
    rows.sort(); return rows

def aim_eval(ns, sc, R, side, frames, D):
    """returns required wrist-local rotation (quat) mapping club dir to mean desired dir, its angle, and spread"""
    pb=R.pose.bones; W=R.matrix_world
    o=bpy.data.objects[ns['STICKS'][side]]
    ds=[]; c=None
    for f in frames:
        sc.frame_set(f)
        Mw=(W@pb['wrist.'+side].matrix).to_3x3().normalized(); Mi=Mw.inverted()
        mw=o.matrix_world; ax=((mw@Vector((0,0,0.5)))-(mw@Vector((0,0,0)))).normalized()
        cl=(Mi@ax).normalized(); c=cl if c is None else c
        ds.append((Mi@D).normalized())
    dm=sum(ds,Vector()).normalized()
    q=c.rotation_difference(dm)
    spread=max(math.degrees((q@c).angle(d)) for d in ds)
    return q, math.degrees(q.angle), spread

def combo_eval(ns, sc, R, side, frames, D, gap_target=0.0):
    q,ang,spr=aim_eval(ns,sc,R,side,frames,D)
    pb=R.pose.bones; gaps=[]; dirs=[]
    for f in frames:
        sc.frame_set(f); w=pb['wrist.'+side]; w.matrix_basis=w.matrix_basis@q.to_matrix().to_4x4(); bpy.context.view_layer.update()
        head,ax=club_state(ns,side); u,rad=drum_u(head)
        gaps.append((u-0.19) if rad<DRUM['r']-0.1 else 9); dirs.append(ax.z)
    return q,ang,spr,gaps,sum(dirs)/len(dirs)

def search3(ns, side, grid, budget=50, D=None):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    strong=json.load(open(P+'DR_strong.json'))[side]
    rows=[]; t=time.time(); pb=R.pose.bones
    for fwd,up,lat,pout,pup in itertools.product(grid['fwd'],grid['up'],grid['lat'],grid['pout'],grid['pup']):
        ns['pose_side'](ns,R,data,E,FW,UP,LT,side,(fwd,up,lat,pout,pup,0,0))
        acc={}
        for f in strong:
            sc.frame_set(f); w=pb['wrist.'+side]; base=w.matrix_basis.copy()
            for tau,phi,psi in itertools.product(grid['tau'],grid['phi'],grid['psi']):
                w.matrix_basis=base@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')@Matrix.Rotation(math.radians(psi),4,'Z')
                bpy.context.view_layer.update()
                head,ax=ns['club_state'](ns,side); u,rad=ns['drum_u'](head)
                g=(u-0.19) if rad<DRUM['r']-0.1 else 9
                acc.setdefault((tau,phi,psi),[]).append((g,ax.z,-ax.y))
            w.matrix_basis=base
        for k,L in acc.items():
            gaps=[x[0] for x in L]; dz=sum(x[1] for x in L)/len(L); fw=sum(x[2] for x in L)/len(L)
            miss=sum(1 for g in gaps if g>0.15 or g<-0.25); gc=sum(min(abs(g),0.6) for g in gaps)/len(gaps)
            cost=gc*6+miss*1.0+max(0,dz+0.05)*6+max(0,-0.5-dz)*3+max(0,0.5-fw)*4+(abs(k[1])+abs(k[2]))/60+max(0,abs(k[0])-60)/30
            rows.append((round(cost,3),fwd,up,lat,pout,pup)+k+(round(gc,2),miss,round(dz,2),round(fw,2)))
        if time.time()-t>budget: break
    rows.sort(); return rows

CFG2={'r':(0.9,0.2,0.1,1.6,0.8,-60,0,-30),'l':(0.9,0.6,0.2,1.6,0.8,45,20,30)}
def apply_and_bake(ns, cfg=None, actname='DR_brute_drums_fit2'):
    cfg=cfg or CFG2
    sc,R,data,E,FW,UP,LT=ns['prep'](ns); pb=R.pose.bones
    for s,c in cfg.items(): ns['pose_side'](ns,R,data,E,FW,UP,LT,s,c[:5]+(0,0))
    bones=[f'{b}.{s}' for s in 'lr' for b in ('upperarm','lowerarm','wrist')]
    rec={}
    for f in range(sc.frame_start,sc.frame_end+1):
        sc.frame_set(f)
        for s,c in cfg.items():
            w=pb['wrist.'+s]; w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(c[5]),4,'Y')@Matrix.Rotation(math.radians(c[6]),4,'X')@Matrix.Rotation(math.radians(c[7]),4,'Z')
        bpy.context.view_layer.update()
        rec[f]={n:pb[n].matrix.copy() for n in bones+['chest']}
    old=bpy.data.actions.get(actname)
    act=bpy.data.actions['DR_brute_drums_raw'].copy(); use(R,act)
    if old: bpy.data.actions.remove(old)
    act.name=actname; act.use_fake_user=True
    for s in 'lr':
        for cst in list(pb['lowerarm.'+s].constraints): pb['lowerarm.'+s].constraints.remove(cst)
    for f,M in rec.items():
        for n in bones:
            b=R.data.bones[n]; p=b.parent
            basis=(M[p.name]@p.matrix_local.inverted()@b.matrix_local).inverted()@M[n]
            pb[n].rotation_quaternion=basis.to_quaternion(); pb[n].keyframe_insert('rotation_quaternion',frame=f)
    return act.name

def key_targets3(data, E, side, delta, pole_off, extra, R):
    et=E['tgt'+side]; ep=E['pole'+side]; et.animation_data_clear(); ep.animation_data_clear()
    et.matrix_parent_inverse.identity(); ep.matrix_parent_inverse.identity()
    b=R.data.bones['chest']; off=Vector((0,b.length,0))
    for f in sorted(data):
        d=data[f][side]; ex=extra.get(f,Vector())
        H=d['H']+Vector(delta)+ex
        et.location=H-d['hv']-off; et.keyframe_insert('location',frame=f)
        ep.location=d['pole']+Vector(delta)+Vector(pole_off)+ex-off; ep.keyframe_insert('location',frame=f)
def arm_pts(side, n=60):
    o=bpy.data.objects['OrcBrute_Arm'+('Right' if side=='r' else 'Left')+'_DR']
    return o, list(range(0,len(o.data.vertices),max(1,len(o.data.vertices)//n)))
def need_lift(ns, sc, R, side, cfg, margin=0.02):
    pb=R.pose.bones; dr=DRUM; cx,cy=dr['c']
    o_arm,idx=arm_pts(side)
    SP=ns['stick_pts'](ns['STICKS'][side],30)
    L={}
    for f in range(sc.frame_start,sc.frame_end+1):
        sc.frame_set(f)
        w=pb['wrist.'+side]; w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(cfg[5]),4,'Y')@Matrix.Rotation(math.radians(cfg[6]),4,'X')@Matrix.Rotation(math.radians(cfg[7]),4,'Z')
        bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
        pts=[bpy.data.objects[ns['STICKS'][side]].matrix_world@p for p in SP]
        e=o_arm.evaluated_get(dg); mw=o_arm.matrix_world; vs=e.data.vertices
        pts+=[mw@vs[i].co for i in idx]
        need=0
        for p in pts:
            if math.hypot(p.x-cx,p.y-cy)<dr['r']+0.02 and p.z<dr['H']+margin and p.z>0.2:
                need=max(need,dr['H']+margin-p.z)
        L[f]=need
    return L
def fit_with_lift(ns, cfg, iters=3, actname='DR_brute_drums_fit3'):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    ex={'l':{},'r':{}}; log=[]
    for it in range(iters):
        for s,c in cfg.items():
            out=-LT if s=='r' else LT
            key_targets3(data,E,s,tuple(FW*c[0]+UP*c[1]+LT*c[2]),tuple(out*c[3]+UP*c[4]),ex[s],R)
        stat={}
        for s,c in cfg.items():
            L=need_lift(ns,sc,R,s,c)
            fs=sorted(L); sm={f:max(L[g]*(1.0 if g==f else 0.5) for g in fs if abs(g-f)<=1) for f in fs}
            for f in fs:
                ex[s][f]=ex[s].get(f,Vector())+UP*sm[f]
            stat[s]=(round(max(L.values()),3),sum(1 for v in L.values() if v>0.02))
        log.append(stat)
    # final bake
    pb=R.pose.bones
    bones=[f'{b}.{s}' for s in 'lr' for b in ('upperarm','lowerarm','wrist')]
    rec={}
    for f in range(sc.frame_start,sc.frame_end+1):
        sc.frame_set(f)
        for s,c in cfg.items():
            w=pb['wrist.'+s]; w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(c[5]),4,'Y')@Matrix.Rotation(math.radians(c[6]),4,'X')@Matrix.Rotation(math.radians(c[7]),4,'Z')
        bpy.context.view_layer.update(); rec[f]={n:pb[n].matrix.copy() for n in bones+['chest']}
    old=bpy.data.actions.get(actname); act=bpy.data.actions['DR_brute_drums_raw'].copy(); use(R,act)
    if old: bpy.data.actions.remove(old)
    act.name=actname; act.use_fake_user=True
    for s in 'lr':
        for cst in list(pb['lowerarm.'+s].constraints): pb['lowerarm.'+s].constraints.remove(cst)
    for f,M in rec.items():
        for n in bones:
            b=R.data.bones[n]; p=b.parent
            basis=(M[p.name]@p.matrix_local.inverted()@b.matrix_local).inverted()@M[n]
            pb[n].rotation_quaternion=basis.to_quaternion(); pb[n].keyframe_insert('rotation_quaternion',frame=f)
    json.dump({'cfg':cfg,'lift_log':log,'extra_max':{s:round(max((v.length for v in ex[s].values()),default=0),3) for s in 'lr'}},open(P+'DR_fit3_log.json','w'))
    return log

def eval_fit(ns):
    sc=bpy.data.scenes['DRM_BRUTE']; R=bpy.data.objects['Brute_DR']
    strong=json.load(open(P+'DR_strong.json')); dr=DRUM; out={}
    for s in 'lr':
        g=[]
        for f in strong[s]:
            sc.frame_set(f); head,ax=club_state(ns,s); u,rad=drum_u(head); g.append(round(u-0.19,2) if rad<dr['r'] else 9)
        out[s]=g
    return out

def search4(ns, side, grid, budget=50):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    strong=json.load(open(P+'DR_strong.json'))[side]
    rows=[]; t=time.time(); pb=R.pose.bones; dr=DRUM; cx,cy=dr['c']
    o_arm,idx=arm_pts(side,40)
    for fwd,up,lat,pout,pup in itertools.product(grid['fwd'],grid['up'],grid['lat'],grid['pout'],grid['pup']):
        ns['pose_side'](ns,R,data,E,FW,UP,LT,side,(fwd,up,lat,pout,pup,0,0))
        acc={}
        for f in strong:
            sc.frame_set(f); w=pb['wrist.'+side]; base=w.matrix_basis.copy()
            for tau,phi,psi in itertools.product(grid['tau'],grid['phi'],grid['psi']):
                w.matrix_basis=base@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')@Matrix.Rotation(math.radians(psi),4,'Z')
                bpy.context.view_layer.update()
                head,ax=ns['club_state'](ns,side); tip=bpy.data.objects[ns['STICKS'][side]].matrix_world@Vector((0,0,0.6)); u,rad=ns['drum_u'](head); u=min(u-0.19,tip.z-dr['H']-0.12)
                g=u if rad<dr['r']-0.1 else 9
                dg=bpy.context.evaluated_depsgraph_get(); e=o_arm.evaluated_get(dg); mw=o_arm.matrix_world; vs=e.data.vertices
                am=9
                for i in idx:
                    p=mw@vs[i].co
                    if math.hypot(p.x-cx,p.y-cy)<dr['r']: am=min(am,p.z-dr['H'])
                acc.setdefault((tau,phi,psi),[]).append((g,ax.z,-ax.y,am))
            w.matrix_basis=base
        for k,L in acc.items():
            gaps=[x[0] for x in L]; dz=sum(x[1] for x in L)/len(L); fw=sum(x[2] for x in L)/len(L)
            armpen=sum(max(0,0.02-x[3]) for x in L)/len(L)
            miss=sum(1 for g in gaps if g>0.12 or g<-0.2); gc=sum(min(abs(g),0.6) for g in gaps)/len(gaps)
            cost=gc*6+miss*1.0+armpen*15+max(0,dz+0.1)*6+max(0,0.5-fw)*4+(abs(k[1])+abs(k[2]))/60+max(0,abs(k[0])-60)/30
            rows.append((round(cost,3),fwd,up,lat,pout,pup)+k+(round(gc,2),miss,round(armpen,2),round(dz,2),round(fw,2)))
        if time.time()-t>budget: break
    rows.sort(); return rows

CFG3={'r':(0.7,0.1,0.2,1.6,0.8,-60,0,-45),'l':(0.9,0.4,0.2,1.6,0.8,45,20,45)}
def head_low(ns, side):
    o=bpy.data.objects[ns['STICKS'][side]]; mw=o.matrix_world
    pts=[mw@Vector((0,0,z)) for z in (0.45,0.55,0.62)]
    cx,cy=DRUM['c']
    best=None
    for p in pts:
        if math.hypot(p.x-cx,p.y-cy)<DRUM['r']-0.05:
            v=p.z-0.19-DRUM['H']
            best=v if best is None else min(best,v)
    return best
def contact_snap(ns, side, max_tip=20, window=3):
    sc=bpy.data.scenes['DRM_BRUTE']; R=bpy.data.objects['Brute_DR']; pb=R.pose.bones
    f0,f1=sc.frame_start,sc.frame_end
    h={}
    for f in range(f0,f1+1):
        sc.frame_set(f); h[f]=head_low(ns,side)
    # strikes: local minima of head height over drum, preceded by downward motion
    strikes=[]
    for f in range(f0+2,f1-1):
        if h[f] is None or h[f-1] is None or h[f+1] is None: continue
        if h[f]<=h[f-1] and h[f]<=h[f+1] and h.get(f-2) is not None and h[f-2]-h[f]>0.08 and h[f]<0.45:
            strikes.append(f)
    # choose tip axis: test which small wrist rotation lowers head most at first strike
    w=pb['wrist.'+side]
    tipax=None
    if strikes:
        f=strikes[0]; sc.frame_set(f); base=w.matrix_basis.copy(); h0=head_low(ns,side); best=(0,None)
        for axn in ('X','Z'):
            for sg in (1,-1):
                w.matrix_basis=base@Matrix.Rotation(math.radians(5*sg),4,axn); bpy.context.view_layer.update()
                d=h0-head_low(ns,side)
                if d>best[0]: best=(d,(axn,sg))
        w.matrix_basis=base; tipax=best[1]
    # angle per strike from gap (club length ~1.0)
    ang={}
    for f in strikes:
        sc.frame_set(f); base=w.matrix_basis.copy(); h0=head_low(ns,side)
        w.matrix_basis=base@Matrix.Rotation(math.radians(5*tipax[1]),4,tipax[0]); bpy.context.view_layer.update()
        rate=max(1e-3,(h0-head_low(ns,side))/5.0); w.matrix_basis=base; bpy.context.view_layer.update()
        gap=max(0,h[f]-0.01); a=min(max_tip, gap/rate)
        for g in range(f-window,f+window+1):
            wgt=0.5*(1+math.cos(math.pi*(g-f)/(window+1)))
            ang[g]=max(ang.get(g,0),a*wgt)
    # key wrist rotation deltas
    if tipax:
        for f in range(f0,f1+1):
            sc.frame_set(f); a=ang.get(f,0)
            q=w.rotation_quaternion.copy()
            if a>0:
                w.matrix_basis=w.matrix_basis@Matrix.Rotation(math.radians(a*tipax[1]),4,tipax[0])
            w.keyframe_insert('rotation_quaternion',frame=f)
    after=[]
    for f in strikes:
        sc.frame_set(f); after.append(round(head_low(ns,side),2))
    return {'strikes':strikes,'gap_before':[round(h[f],2) for f in strikes],'gap_after':after,'tipax':tipax,'max_tip':round(max(ang.values()),1) if ang else 0}

def search5(ns, side, grid, budget=50):
    sc,R,data,E,FW,UP,LT=ns['prep'](ns)
    strong=json.load(open(P+'DR_strong.json'))[side]
    rows=[]; t=time.time(); pb=R.pose.bones; dr=DRUM; cx,cy=dr['c']
    o_arm,idx=arm_pts(side,40)
    for fwd,up,lat,pout,pup in itertools.product(grid['fwd'],grid['up'],grid['lat'],grid['pout'],grid['pup']):
        ns['pose_side'](ns,R,data,E,FW,UP,LT,side,(fwd,up,lat,pout,pup,0,0))
        acc={}
        for f in strong:
            sc.frame_set(f); w=pb['wrist.'+side]; base=w.matrix_basis.copy()
            for tau,phi,psi in itertools.product(grid['tau'],grid['phi'],grid['psi']):
                w.matrix_basis=base@Matrix.Rotation(math.radians(tau),4,'Y')@Matrix.Rotation(math.radians(phi),4,'X')@Matrix.Rotation(math.radians(psi),4,'Z')
                bpy.context.view_layer.update()
                head,ax=ns['club_state'](ns,side); tip=bpy.data.objects[ns['STICKS'][side]].matrix_world@Vector((0,0,0.6)); u,rad=ns['drum_u'](head); u=min(u-0.19,tip.z-dr['H']-0.12)
                g=u if rad<dr['r']-0.1 else 9
                dg=bpy.context.evaluated_depsgraph_get(); e=o_arm.evaluated_get(dg); mw=o_arm.matrix_world; vs=e.data.vertices
                am=9
                for i in idx:
                    p=mw@vs[i].co
                    if math.hypot(p.x-cx,p.y-cy)<dr['r']: am=min(am,p.z-dr['H'])
                acc.setdefault((tau,phi,psi),[]).append((g,ax.z,-ax.y,am,abs(ax.x)))
            w.matrix_basis=base
        for k,L in acc.items():
            gaps=[x[0] for x in L]; dz=sum(x[1] for x in L)/len(L); fw=sum(x[2] for x in L)/len(L)
            armpen=sum(max(0,0.02-x[3]) for x in L)/len(L)
            miss=sum(1 for g in gaps if g>0.12 or g<-0.2); gc=sum(min(abs(g),0.6) for g in gaps)/len(gaps)
            side_x=sum(x[4] for x in L)/len(L)
            cost=gc*6+miss*1.0+armpen*15+max(0,dz+0.1)*6+max(0,0.6-fw)*6+side_x*8+(abs(k[1])+abs(k[2]))/60+max(0,abs(k[0])-60)/30
            rows.append((round(cost,3),fwd,up,lat,pout,pup)+k+(round(gc,2),miss,round(armpen,2),round(dz,2),round(fw,2),round(side_x,2)))
        if time.time()-t>budget: break
    rows.sort(); return rows
