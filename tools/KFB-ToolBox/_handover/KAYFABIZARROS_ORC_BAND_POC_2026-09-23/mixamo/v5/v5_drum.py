
# v5: stehender Trommler als 2-Schlag-Loop (48 Frames = 2 Beats a 24 Frames). R trifft auf Beat 0, L auf Beat 1.
# Koerper: Breathing-Idle-Grundhaltung + Zuruecklehnen beim Ausholen, Vorlehnen/Eindrehen/Einknicken beim Schlag.
exec(open(OUT+'/v4_drum.py').read())
import json
LOOP=48; HIT={'r':0,'l':24}
BASE=json.load(open(OUT+'/v5_idle_base.json'))
BODY=['root','hips','spine','chest','head','upperleg.l','lowerleg.l','foot.l','toes.l','upperleg.r','lowerleg.r','foot.r','toes.r']
def ease(x): return x*x*(3-2*x)
def lift(s,t):
    # 0 = Treffer, 1 = voll ausgeholt. Periode 48, Treffer bei HIT[s]
    u=((t-HIT[s])%LOOP)/LOOP
    if u<0.08: return 0.32*ease(u/0.08)            # Rueckprall
    if u<0.45: return 0.32                          # Bereithalten
    if u<0.78: return 0.32+0.68*ease((u-0.45)/0.33) # Ausholen
    return 1.0-ease((u-0.78)/0.22)                  # Schlag
def body_pose(t, P):
    # Signale: wer holt gerade aus, wer schlaegt
    eR=lift('r',t); eL=lift('l',t)
    wind=max(eR,eL)                    # zuruecklehnen mit dem hoeheren Arm
    # Schlagimpuls: kurz nach jedem Treffer
    def imp(s):
        u=((t-HIT[s])%LOOP)/LOOP
        return math.exp(-((u if u<0.5 else u-1)/0.06)**2)
    iR=imp('r'); iL=imp('l'); hit=max(iR,iL)
    pitch=P['lean_fwd']*hit - P['lean_back']*(wind-0.32)/0.68*(1-hit)
    yaw=P['yaw']*(iR-iL) + P['yaw']*0.6*(eL-eR)*(1-hit)   # rechte Schulter vor beim R-Schlag
    dip=-P['dip']*hit
    return pitch,yaw,dip
def key_body(P):
    sc=S(); a=A(); act=a.animation_data.action
    for l in act.layers:
        for st in l.strips:
            for cb in st.channelbags:
                for fc in list(cb.fcurves): cb.fcurves.remove(fc)
    for t in range(0,LOOP+1):
        pitch,yaw,dip=body_pose(t,P)
        for b in BODY:
            pb=a.pose.bones[b]; pb.rotation_mode='QUATERNION'
            q=Quaternion(BASE[b]['rot']); l=Vector(BASE[b]['loc'])
            if b=='hips': l=l+Vector((0,dip,0))   # hips-lokal: y = oben
            if b=='spine': q=q@Quaternion((1,0,0),math.radians(pitch*0.5))@Quaternion((0,1,0),math.radians(yaw*0.5))
            if b=='chest': q=q@Quaternion((1,0,0),math.radians(pitch*0.5))@Quaternion((0,1,0),math.radians(yaw*0.5))
            if b=='head': q=q@Quaternion((1,0,0),math.radians(-pitch*0.6))@Quaternion((0,1,0),math.radians(-yaw*0.5))
            pb.rotation_quaternion=q; pb.location=l
            pb.keyframe_insert('rotation_quaternion',frame=t+1); pb.keyframe_insert('location',frame=t+1)
def leg_ik():
    sc=S(); a=A()
    for s in 'lr':
        n='DR_foot_'+s; e=bpy.data.objects.get(n)
        if not e: e=bpy.data.objects.new(n,None); sc.collection.objects.link(e)
        e.empty_display_size=0.1; e.hide_render=True
        sc.frame_set(1); bpy.context.view_layer.update()
        e.location=a.matrix_world@a.pose.bones['foot.'+s].head
        pn='DR_knee_'+s; p=bpy.data.objects.get(pn)
        if not p: p=bpy.data.objects.new(pn,None); sc.collection.objects.link(p)
        p.hide_render=True; kn=a.matrix_world@a.pose.bones['lowerleg.'+s].head; p.location=kn+Vector((0,-1.0,0))
        b=a.pose.bones['lowerleg.'+s]
        for c in list(b.constraints):
            if c.type=='IK': b.constraints.remove(c)
        c=b.constraints.new('IK'); c.name='KFB_Fuss'; c.target=e; c.pole_target=p; c.chain_count=2; c.pole_angle=math.radians(-90)
def v5_hit_arm(P,K):
    sc=S(); Hcs={s:Vector((V4P[s]['sx']*P['hit_x'],P['hit_y'],P['skin_z']+0.25)) for s in 'rl'}
    sc.frame_set(HIT['r']+1); McR=chest_M(HIT['r']+1)
    sc.frame_set(HIT['l']+1); McL=chest_M(HIT['l']+1)
    Wref={'r':hit_W2('r',McR,K['r'],Hcs['r'],(-1.0,-1.0,2.1))[0],'l':hit_W2('l',McL,K['l'],Hcs['l'],(1.0,-1.0,2.1))[0]}
    return Hcs,Wref
def pose_v5(s,Mc,K,e,Whit,P):
    sx=V4P[s]['sx']
    Sh=A().matrix_world@(Mc@rest('chest').inverted()@rest('upperarm.'+s)).translation
    Wr=Sh+Vector((sx*P['raise_dx'],P['raise_dy'],P['raise_dz']))
    mid=(Whit+Wr)/2+Vector((sx*0.2,-0.1,0.0))
    W=(1-e)**2*Whit+2*(1-e)*e*mid+e*e*Wr
    pole=Vector((sx*1.0,0.3,-0.6)).lerp(Vector((sx*1.0,0.3,-0.3)),e)
    w=ease(max(0.0,min(1.0,(e-0.1)/0.5)))
    r0=solve_arm(s,Mc,W,pole,1.0,70,0,0,Vector((0,0,1)))      # Handruecken oben (Treffer-Rolle)
    tau=r0['tau']*(1-w)+(-sx)*P['tau_raise']*w                 # beim Ausholen Daumen hoch -> Keule steht
    dev=V4P[s]['dev_hit']*(1-w)+(-sx)*P['dev_raise']*w
    return solve_arm2(s,Mc,W,pole,tau,dev)
def shoulder(s,Mc): return A().matrix_world@(Mc@rest('chest').inverted()@rest('upperarm.'+s)).translation
def key_arms(P,K,Hcs,Wref):
    sc=S(); log=[]
    rel={}
    for s in 'rl':
        sc.frame_set(HIT[s]+1); rel[s]=Wref[s]-shoulder(s,chest_M(HIT[s]+1))
    for t in range(0,LOOP+1):
        f=t+1; sc.frame_set(f); Mc=chest_M(f); res={}; row={'f':f}
        for s in 'rl':
            e=lift(s,t); W=shoulder(s,Mc)+rel[s]; err=None
            if e==0.0: W,err=hit_W2(s,Mc,K[s],Hcs[s],Wref[s])
            r=pose_v5(s,Mc,K[s],e,W,P); hc,g,c=club(s,r,K[s]); res[s]=r
            row[s]={'e':round(e,3),'tau':round(r['tau'],1),'flex':round(r['flex'],1),'hc':[round(x,3) for x in hc],'err':err}
        apply_pose(res,Mc,key=f); log.append(row)
    return log
