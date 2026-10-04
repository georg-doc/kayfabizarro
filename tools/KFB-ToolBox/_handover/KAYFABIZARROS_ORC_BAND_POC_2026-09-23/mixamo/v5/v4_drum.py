
# v4: Hammergriff. Keule quer durch die Faust (Originalgriff), Richtung ueber Unterarmdrehung + Handgelenk-Abweichung.
exec(open(OUT+'/v3_drum.py').read())
def solve_arm2(s,Mchest,W,pole,tau_deg,dev_deg):
    a=A(); Aw=a.matrix_world; Ai=Aw.inverted()
    up='upperarm.'+s; lo='lowerarm.'+s; wr='wrist.'+s; ha='hand.'+s
    Sa=(Mchest @ rest('chest').inverted() @ rest(up)).translation; Sw=Aw@Sa
    L1=a.data.bones[up].length; L2=a.data.bones[lo].length
    d=W-Sw; dl=max(abs(L1-L2)+0.05,min((L1+L2)*0.985,d.length)); u=d.normalized(); Wc=Sw+u*dl
    ca=max(-1,min(1,(L1*L1+dl*dl-L2*L2)/(2*L1*dl))); sa=math.sqrt(1-ca*ca)
    v=(pole-u*pole.dot(u)).normalized(); E=Sw+L1*(ca*u+sa*v)
    yu=(E-Sw).normalized(); yl=(Wc-E).normalized()
    h=yu.cross(yl); h=h.normalized() if h.length>1e-4 else v.cross(u).normalized()
    if s=='l': h=-h
    Ru=frame_from(yu,h); Rl=frame_from(yl,h)
    Rl=rotm(yl,math.radians(tau_deg))@Rl
    Rw=rotm(Rl.col[2],math.radians(dev_deg))@Rl
    Ar=Ai.to_3x3()
    def M4(R,p):
        m=(Ar@R).to_4x4(); m.translation=Ai@p; return m
    Mw=M4(Rw,Wc); Mh=Mw.copy(); Mh.translation=Mw.translation+Mw.to_3x3().col[1]*a.data.bones[wr].length
    return {'M':{up:M4(Ru,Sw),lo:M4(Rl,E),wr:Mw,ha:Mh},'flex':math.degrees(yu.angle(yl)),'tau':tau_deg,'dev':dev_deg,'Wc':Wc,'E':E}
def club(s,r,K):
    hc,Mst=head_c(s,r,K); g=Mst.translation; return hc,g,(hc-g).normalized()
TAU=(-85,85); DEV=(-35,25)
def fit(s,Mc,W,pole,D,K):
    best=None
    def ev(t,d):
        r=solve_arm2(s,Mc,W,pole,t,d); hc,g,c=club(s,r,K)
        cost=math.degrees(c.angle(D))+0.12*abs(t)+0.08*abs(d)
        return cost,r
    for t in range(TAU[0],TAU[1]+1,10):
        for d in range(DEV[0],DEV[1]+1,10):
            c,r=ev(t,d)
            if best is None or c<best[0]: best=(c,t,d,r)
    _,t0,d0,_=best
    for t in range(t0-8,t0+9,2):
        for d in range(d0-8,d0+9,2):
            if TAU[0]<=t<=TAU[1] and DEV[0]<=d<=DEV[1]:
                c,r=ev(t,d)
                if c<best[0]: best=(c,t,d,r)
    return best
def solve_hit(s,Mc,W0,pole,D,Hc,K,iters=6):
    W=Vector(W0)
    def F(W):
        b=fit(s,Mc,W,pole,D,K); hc,_,_=club(s,b[3],K); return hc-Hc,b
    for i in range(iters):
        e,b=F(W)
        if e.length<0.01: break
        J=Matrix.Identity(3); h=0.02
        for k in range(3):
            dd=Vector((0,0,0)); dd[k]=h; ek,_=F(W+dd); J.col[k]=(ek-e)/h
        try: st=J.inverted()@e
        except Exception: st=e
        if st.length>0.2: st=st.normalized()*0.2
        W=W-st*0.8
    e,b=F(W); return W,e.length,b

V4P={'r':{'sx':-1,'dev_hit':-25,'dev_raise':0},'l':{'sx':1,'dev_hit':25,'dev_raise':0}}
def pose_v4(s,Mc,K,e,Whit):
    # Treffer (e=0): Handruecken oben, Daumen innen, Keule quer durch die Faust nach innen aufs Fell.
    # Ausgeholt (e=1): Faust seitlich auf Kopfhoehe, Daumen oben, Keule hoch/nach hinten ueber die Schulter (Skizze 1).
    # Dazwischen dreht der Unterarm natuerlich (Pronation -> Neutral), die Faust laeuft im Bogen seitlich hoch.
    p=V4P[s]; sx=p['sx']
    Wr=Vector((sx*1.05,-0.8,2.55))
    mid=(Whit+Wr)/2+Vector((sx*0.2,-0.05,0.0))
    W=(1-e)**2*Whit+2*(1-e)*e*mid+e*e*Wr
    pole=Vector((sx*1.0,0.3,-0.6))
    dev=p['dev_hit']*(1-e)
    zt=Vector((0,0,1)).slerp(Vector((sx*1.0,0,0)),min(1.0,e)) if e<0.999 else Vector((sx*1.0,0,0))
    return solve_arm(s,Mc,W,pole,1.0,80,0,dev,zt)
def hit_W(s,Mc,K,Hc):
    p=V4P[s]; sx=p['sx']; W=Vector((sx*0.95,-0.95,1.8))
    for it in range(20):
        r=pose_v4(s,Mc,K,0.0,W); hc,g,c=club(s,r,K); e=Hc-hc
        if e.length<0.004: break
        W=W+Vector((0,e.y*0.7,e.z*0.8))
    return W,(Hc-hc).length

def hit_W2(s,Mc,K,Hc,W0):
    W=Vector(W0)
    for it in range(25):
        r=pose_v4(s,Mc,K,0.0,W); hc,g,c=club(s,r,K); e=Hc-hc
        if e.length<0.004: break
        W=W+e*0.7
    return W,(Hc-hc).length
def bake_v4(K,hits,Hcs,Wref):
    sc=S(); a=A(); act=a.animation_data.action
    for l in act.layers:
        for st in l.strips:
            for cb in st.channelbags:
                for fc in list(cb.fcurves):
                    if any(('"%s.'%b) in fc.data_path for b in ARMB): cb.fcurves.remove(fc)
    log=[]
    for f in range(sc.frame_start,sc.frame_end+1):
        sc.frame_set(f); Mc=chest_M(f); res={}; row={'f':f}
        for s in 'rl':
            sv=schedule(hits[s],f)
            W=Wref[s]; err=None
            if sv==0.0:
                W,err=hit_W2(s,Mc,K[s],Hcs[s],Wref[s])
            r=pose_v4(s,Mc,K[s],sv,W); hc,g,c=club(s,r,K[s])
            res[s]=r; row[s]={'s':round(sv,3),'tau':round(r['tau'],1),'flex':round(r['flex'],1),'hc':[round(x,3) for x in hc],'err':err}
        apply_pose(res,Mc,key=f); log.append(row)
    return log
