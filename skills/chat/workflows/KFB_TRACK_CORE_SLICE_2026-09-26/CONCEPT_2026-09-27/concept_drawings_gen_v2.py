import math, json
def ss(t): t=max(0,min(1,t)); return t*t*t*(t*(6*t-15)+10)
def f(v): return f"{v:.2f}"
def P(pts): return " ".join(f(x)+","+f(y) for x,y in pts)
def poly(pts,cls): return f'<polygon points="{P(pts)}" class="{cls}"/>'
def pl(pts,cls): return f'<polyline points="{P(pts)}" class="{cls}" fill="none"/>'
def txt(x,y,t,a='middle',cls='lbl'): return f'<text x="{f(x)}" y="{f(y)}" text-anchor="{a}" class="{cls}">{t}</text>'
def badge(x,y,n): return f'<circle cx="{f(x)}" cy="{f(y)}" r="9" class="badge"/>'+f'<text x="{f(x)}" y="{f(y+4)}" text-anchor="middle" class="badge-t">{n}</text>'
DEFS='''<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="gore-bg"/><line x1="0" y1="0" x2="0" y2="7" class="gore-ln"/></pattern>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ink-f"/></marker></defs>'''
def scalebar(x,y,k,m=20):
    L=m*k
    return f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x+L)}" y2="{f(y)}" class="ink w2"/><line x1="{f(x)}" y1="{f(y-4)}" x2="{f(x)}" y2="{f(y+4)}" class="ink"/><line x1="{f(x+L)}" y1="{f(y-4)}" x2="{f(x+L)}" y2="{f(y+4)}" class="ink"/>'+txt(x+L/2,y+15,f"{m} m",cls='sm')
def brk(x,y0,y1):  # drafting break line (the piece continues)
    n=6; pts=[]; 
    for i in range(n*2+1):
        t=i/(n*2); pts.append((x+(4 if i%2 else -4),y0+(y1-y0)*t))
    return pl(pts,'brk')
def offset(pts,d):  # offset polyline to the left of direction by d (px)
    out=[]
    for i,(x,y) in enumerate(pts):
        a=pts[max(0,i-1)]; b=pts[min(len(pts)-1,i+1)]; tx,ty=b[0]-a[0],b[1]-a[1]; L=math.hypot(tx,ty) or 1
        out.append((x-ty/L*d, y+tx/L*d))
    return out

# ============================================================ RAMP (true scale)
def ramp():
    k=11; D=2.25; H=1.35; lip=2.0; ang=math.radians(14); Lk=30; G=22; Ll=36; drop=4.0; Lpre=10
    v2=15*G*G/(2*math.cos(ang)**2*(G*math.tan(ang)))
    X0=30; base=150
    X=lambda s: X0+(s+Lpre)*k; Y=lambda y: base-y*k
    def herm(u,y0,m0,y1,m1,L):
        h00=2*u**3-3*u**2+1; h10=u**3-2*u**2+u; h01=-2*u**3+3*u**2; h11=u**3-u**2
        return h00*y0+h10*m0*L+h01*y1+h11*m1*L
    ks=[i*0.25 for i in range(int(Lk/0.25)+1)]
    road_k=[(-Lpre,0)]+[(s,herm(s/Lk,0,0,lip,math.tan(ang),Lk)) for s in ks]
    x0=Lk+G
    ls=[i*0.25 for i in range(int(Ll/0.25)+1)]
    road_l=[(x0+s,herm(s/Ll,lip,-math.tan(ang),lip-drop,0,Ll)) for s in ls]+[(x0+Ll+Lpre,lip-drop)]
    def semi(p0,p1,tip,prev):   # half circle from p0 to p1 that bulges away from the body (direction tip - prev)
        cx,cy=(p0[0]+p1[0])/2,(p0[1]+p1[1])/2; rr=math.hypot(p0[0]-cx,p0[1]-cy)
        dx,dy=tip[0]-prev[0],tip[1]-prev[1]; L=math.hypot(dx,dy); dx,dy=dx/L,dy/L
        a0=math.atan2(p0[1]-cy,p0[0]-cx)
        for sg in (1,-1):
            mid=(cx+rr*math.cos(a0+sg*math.pi/2),cy+rr*math.sin(a0+sg*math.pi/2))
            if (mid[0]-cx)*dx+(mid[1]-cy)*dy>0: break
        return [(cx+rr*math.cos(a0+sg*math.pi*t/24),cy+rr*math.sin(a0+sg*math.pi*t/24)) for t in range(25)]
    def body(road, nose_at_end):
        top=[(X(s),Y(y)) for s,y in road]
        bot=offset(top, D*k) if nose_at_end else offset(top,D*k)
        # nose: semicircle between top end and bottom end
        if nose_at_end:
            a=top[-1]; b=bot[-1]; cx,cy=(a[0]+b[0])/2,(a[1]+b[1])/2; r=D*k/2
            arc=semi(a,b,top[-1],top[-2])
            return top+arc[1:-1]+list(reversed(bot)), top, bot
        else:
            a=top[0]; b=bot[0]; cx,cy=(a[0]+b[0])/2,(a[1]+b[1])/2; r=D*k/2
            arc=semi(b,a,top[0],top[1])
            return arc[:-1]+top+list(reversed(bot)), top, bot
    # offset direction: left of travel in screen coords (y down) = below the road -> use +D
    kb,ktop,kbot=body(road_k,True); lb,ltop,lbot=body(road_l,False)
    out=[f'<svg viewBox="0 0 {int(X(x0+Ll+Lpre)+30)} 250" role="img" aria-label="Kicker and landing in side view at true scale: constant-thickness deck with a round bullnose at the lip and at the catch, barriers keep their height, follow the deck line and end in a round cap set back from the edge">'+DEFS]
    out.append(poly(kb,'deck')); out.append(poly(lb,'deck'))
    # barrier bands: height tapers 100% -> 50% over last 16 m, ends 1.2 m before lip with a round cap
    def barrier(road, end, rev, L):
        pts=road if not rev else list(reversed(road))
        # distance to open end along s
        top=[]; base_=[]
        for s,y in pts:
            d=abs(end-s)
            if d<1.2: continue
            h=H   # constant height: the top follows the deck line, no sag
            base_.append((X(s),Y(y))); top.append((X(s),Y(y+h)))
        # round cap at the end nearest the lip
        cap=semi(top[-1],base_[-1],base_[-1],base_[-2])
        return top+cap[1:-1]+list(reversed(base_))
    out.append(poly(barrier(road_k,Lk,False,Lk),'barrier'))
    out.append(poly(barrier(road_l,x0,True,Ll),'barrier'))
    out.append(pl(ktop[:-4],'roadline')); out.append(pl(ltop[4:],'roadline'))
    # flight
    arc=[]
    for i in range(41):
        x=G*i/40; y=lip+math.tan(ang)*x-15*x*x/(2*v2*math.cos(ang)**2); arc.append((X(Lk+x),Y(y)))
    out.append(pl(arc,'ink dash'))
    out.append(brk(X(-Lpre),Y(0)-2,Y(-D)+2)); out.append(brk(X(x0+Ll+Lpre),Y(lip-drop)-2,Y(lip-drop-D)+2))
    # dimensions
    out.append(f'<line x1="{f(X(Lk))}" y1="{f(Y(-4.2))}" x2="{f(X(x0))}" y2="{f(Y(-4.2))}" class="ink thin" marker-start="url(#ar)" marker-end="url(#ar)"/>'+txt(X(Lk+G/2),Y(-4.2)-5,f'gap {G} m',cls='sm'))
    out.append(txt(X(Lk+G/2),Y(lip+3.1),f'v ≈ {math.sqrt(v2):.1f} m/s, 14° lip',cls='sm'))
    out.append(badge(X(Lk)+16,Y(lip)-4,1)); out.append(badge(X(Lk-2.6),Y(lip+1.3)-11,2)); out.append(badge(X(x0)-18,Y(lip)+6,3)); out.append(badge(X(x0+Ll-4),Y(lip-drop-D)+22,4))
    out.append(scalebar(X(-Lpre),236,k,10))
    out.append('</svg>'); return '\n'.join(out)

# ============================================================ PIT PLAN
def pit_plan():
    k=3.4; W=14.4; kerb=1.98; wallz=3.0; lane=7.2; apron=7.2; gar=12.0
    Lin=80; Lz=20; bays=6; bay=9; Lb=bays*bay; Lout=80; pre=20
    S=Lin+Lz+Lb+Lz+Lout
    X0=40; Y0=175
    X=lambda s: X0+(s+pre)*k; Y=lambda y: Y0-y*k
    full=kerb+wallz; tE=W/2
    def e(s):
        if s<0 or s>S: return -lane
        if s<Lin: return -lane+(full+lane)*ss(s/Lin)
        if s>S-Lout: return -lane+(full+lane)*ss((S-s)/Lout)
        return full
    ns=[-pre+i*0.5 for i in range(int((S+2*pre)/0.5)+1)]
    gy0=tE+full+lane+apron
    def edge(s):   # outer road edge on the pit side (track edge or pit lane outer edge)
        return tE+max(e(s)+lane,0)
    def outer(s):
        o=edge(s)+4.32
        if Lin<=s<=S-Lout: o=max(o, tE+full+lane+apron*ss(min((s-Lin)/10,(S-Lout-s)/10,1))+1.0)
        return o+1.0
    out=[f'<svg viewBox="0 0 {int(X(S+pre)+40)} 280" role="img" aria-label="Pit complex plan at scale: one continuous deck, the pit lane leaves the track edge, hatched gore, slim pit wall between two crash cushions, box apron and garages; the track keeps its width and line">'+DEFS]
    far=-(tE+4.32+1.0)
    out.append(poly([(X(s),Y(outer(s))) for s in ns]+[(X(s),Y(far)) for s in reversed(ns)],'deck'))
    out.append(f'<rect x="{f(X(Lin+Lz))}" y="{f(Y(gy0+1+gar))}" width="{f(Lb*k)}" height="{f(gar*k)}" class="bldg"/>')
    for b in range(1,bays): xx=X(Lin+Lz+b*bay); out.append(f'<line x1="{f(xx)}" y1="{f(Y(gy0+1+gar))}" x2="{f(xx)}" y2="{f(Y(gy0+1))}" class="bldg-ln"/>')
    out.append(f'<rect x="{f(X(Lin+Lz))}" y="{f(Y(gy0))}" width="{f(Lb*k)}" height="{f(apron*k)}" class="apron"/>')
    for b in range(bays):
        cx=X(Lin+Lz+b*bay+bay/2); out.append(f'<rect x="{f(cx-2.6*k)}" y="{f(Y(gy0-0.6))}" width="{f(5.2*k)}" height="{f(6.0*k)}" class="boxmark"/>')
    # far side kerb + barrier (continuous)
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(-tE))}" width="{f((S+2*pre)*k)}" height="{f(kerb*k)}" class="kerb"/>')
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(-tE-2.7))}" width="{f((S+2*pre)*k)}" height="{f(1.62*k)}" class="barrier"/>')
    # pit-side kerb + barrier: one continuous run along the outer road edge; it stops at the building (round caps)
    bs1=[s for s in ns if s<=Lin+Lz-1]; bs2=[s for s in ns if s>=S-Lout-Lz+1]
    for seg in (bs1,bs2):
        out.append(poly([(X(s),Y(edge(s))) for s in seg]+[(X(s),Y(edge(s)+kerb)) for s in reversed(seg)],'kerb'))
        out.append(poly([(X(s),Y(edge(s)+2.7)) for s in seg]+[(X(s),Y(edge(s)+4.32)) for s in reversed(seg)],'barrier'))
    for sx in (Lin+Lz-1,S-Lout-Lz+1): out.append(f'<circle cx="{f(X(sx))}" cy="{f(Y(edge(sx)+3.51))}" r="{f(0.81*k)}" class="barrier"/>')
    # track
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(tE))}" width="{f((S+2*pre)*k)}" height="{f(W*k)}" class="road"/>')
    # pit lane
    pn=[s for s in ns if 0<=s<=S]
    out.append(poly([(X(s),Y(tE+e(s)+lane)) for s in pn]+[(X(s),Y(tE+e(s))) for s in reversed(pn)],'road'))
    # gore
    gs=[s for s in pn if e(s)>0]
    out.append(poly([(X(s),Y(tE+min(e(s),full))) for s in gs]+[(X(s),Y(tE)) for s in reversed(gs)],'gore'))
    # pit wall between cushions
    ws=[s for s in pn if e(s)>=full-0.05]; w0,w1=ws[0]+3,ws[-1]-3; wy=tE+kerb+wallz/2
    out.append(f'<rect x="{f(X(w0))}" y="{f(Y(wy+0.5))}" width="{f((w1-w0)*k)}" height="{f(1.0*k)}" class="wall"/>')
    for sx in (w0,w1): out.append(f'<circle cx="{f(X(sx))}" cy="{f(Y(wy))}" r="{f(1.5*k)}" class="cushion"/>')
    # paint
    out.append(pl([(X(-pre),Y(-tE+0.5)),(X(S+pre),Y(-tE+0.5))],'paint'))
    out.append(pl([(X(-pre),Y(tE-0.5)),(X(S+pre),Y(tE-0.5))],'paint'))
    out.append(pl([(X(-pre),Y(0)),(X(S+pre),Y(0))],'paint dash'))
    out.append(pl([(X(s),Y(tE+e(s)+lane-0.5)) for s in pn],'paint'))
    for sx in (Lin,S-Lout): out.append(f'<line x1="{f(X(sx))}" y1="{f(Y(tE+full))}" x2="{f(X(sx))}" y2="{f(Y(tE+full+lane))}" class="paint w3"/>')
    out.append(brk(X(-pre),Y(outer(-pre)),Y(far))); out.append(brk(X(S+pre),Y(outer(S+pre)),Y(far)))
    # badges
    out.append(badge(X(28),Y(tE+e(28)+lane)-14,1)); out.append(badge(X(w0)-4,Y(wy)-18,2)); out.append(badge(X(Lin),Y(tE+full+lane)-14,3))
    out.append(badge(X(Lin+Lz+Lb/2),Y(gy0+1+gar/2),4)); out.append(badge(X(S-28),Y(tE+e(S-28)+lane)-14,5)); out.append(badge(X(55),Y(tE+2)+2,6)); out.append(badge(X(S/2),Y(-tE-5.3)+14,7))
    out.append(txt(X(S/2),Y(-3.6)+4,'track 14.4 m',cls='sm inv2'))
    out.append(scalebar(X(-pre),262,k,20)); out.append('</svg>'); return '\n'.join(out)

# ============================================================ PIT SECTION
def pit_section():
    k=14; W=14.4; D=2.25
    segs=[('barrier',1.62),('kerb',1.98),('road',W),('kerb',1.98),('wallzone',3.0),('road',7.2),('apron',7.2),('bldg',12.0)]
    total=sum(w for _,w in segs); X0=40+0.5*14; Yr=95
    out=[f'<svg viewBox="0 0 {int(X0*2+total*k)} 190" role="img" aria-label="Cross-section of the pit straight at scale: one deck slab from the track barrier to the garage back wall; slim pit wall; pit lane; box apron; garage">'+DEFS]
    r=D*k/2
    out.append(f'<rect x="{f(X0-0.5*k)}" y="{f(Yr)}" width="{f(total*k+0.5*k)}" height="{f(D*k)}" rx="{f(r)}" class="deck"/>')
    x=X0; n=0
    for name,w in segs:
        n+=1
        if name=='barrier': out.append(f'<rect x="{f(x)}" y="{f(Yr-1.35*k)}" width="{f(w*k)}" height="{f(1.35*k+1)}" rx="{f(0.5*k)}" class="barrier"/>')
        elif name=='bldg': out.append(f'<rect x="{f(x)}" y="{f(Yr-5*k)}" width="{f(w*k-r)}" height="{f(5*k)}" class="bldg"/>')
        elif name=='wallzone':
            out.append(f'<rect x="{f(x)}" y="{f(Yr-2.5)}" width="{f(w*k)}" height="2.5" class="gore"/>')
            out.append(f'<rect x="{f(x+1.0*k)}" y="{f(Yr-1.2*k)}" width="{f(1.0*k)}" height="{f(1.2*k)}" rx="3" class="wall"/>')
            out.append(f'<line x1="{f(x+1.5*k)}" y1="{f(Yr-1.2*k)}" x2="{f(x+1.5*k)}" y2="{f(Yr-3.2*k)}" class="ink dash"/>')
        else: out.append(f'<rect x="{f(x)}" y="{f(Yr-2.5)}" width="{f(w*k)}" height="2.5" class="{ {"road":"road","kerb":"kerb","apron":"apron"}[name]}"/>')
        out.append(f'<line x1="{f(x)}" y1="{f(Yr+D*k+8)}" x2="{f(x)}" y2="{f(Yr+D*k+22)}" class="ink thin"/>')
        if w>=3: out.append(txt(x+w*k/2,Yr+D*k+19,f'{w:g}',cls='sm'))
        out.append(badge(x+w*k/2,Yr+D*k+38,n))
        x+=w*k
    out.append(f'<line x1="{f(x)}" y1="{f(Yr+D*k+8)}" x2="{f(x)}" y2="{f(Yr+D*k+22)}" class="ink thin"/>')
    out.append('</svg>'); return '\n'.join(out)

# ============================================================ WIDTH
def width_plan():
    k=3.2; S=200; W0=14.4; W1=18.0; T=45; X0=40; Y0=95
    X=lambda s: X0+s*k; Y=lambda y: Y0-y*k
    def w(s):
        a=40; b=S-40-T
        if s<a: return W0
        if s<a+T: return W0+(W1-W0)*ss((s-a)/T)
        if s<b: return W1
        if s<b+T: return W1+(W0-W1)*ss((s-b)/T)
        return W0
    ns=[i*0.5 for i in range(int(S/0.5)+1)]
    out=[f'<svg viewBox="0 0 {int(X(S)+40)} 214" role="img" aria-label="Width change at scale: road edge, kerb, barrier and deck edge move as one parallel family over 45 m per side">'+DEFS]
    out.append(poly([(X(s),Y(w(s)/2+5.32)) for s in ns]+[(X(s),Y(-w(s)/2-5.32)) for s in reversed(ns)],'deck'))
    for sg in (1,-1):
        out.append(poly([(X(s),Y(sg*(w(s)/2+2.7))) for s in ns]+[(X(s),Y(sg*(w(s)/2+4.32))) for s in reversed(ns)],'barrier'))
        out.append(poly([(X(s),Y(sg*w(s)/2)) for s in ns]+[(X(s),Y(sg*(w(s)/2+1.98))) for s in reversed(ns)],'kerb'))
    out.append(poly([(X(s),Y(w(s)/2)) for s in ns]+[(X(s),Y(-w(s)/2)) for s in reversed(ns)],'road'))
    for sg in (1,-1): out.append(pl([(X(s),Y(sg*(w(s)/2-0.5))) for s in ns],'paint'))
    out.append(pl([(X(0),Y(0)),(X(S),Y(0))],'paint dash'))
    out.append(brk(X(0),Y(W0/2+5.32),Y(-W0/2-5.32))); out.append(brk(X(S),Y(W0/2+5.32),Y(-W0/2-5.32)))
    for s0,lab in ((20,'14.4'),(S/2,'18.0'),(S-20,'14.4')): out.append(txt(X(s0),Y(3)+4,lab,cls='sm inv2'))
    yy=Y(W1/2+5.32)-12
    out.append(f'<line x1="{f(X(40))}" y1="{f(yy)}" x2="{f(X(85))}" y2="{f(yy)}" class="ink thin" marker-start="url(#ar)" marker-end="url(#ar)"/>'+txt(X(62.5),yy-5,'45 m (1:25 per side)',cls='sm'))
    out.append(scalebar(X(0),192,k,20)); out.append('</svg>'); return '\n'.join(out)

# ============================================================ WEICHE
def fork_plan():
    k=3.0; S=250; W=14.4; Ls=110; sep=13.0; X0=40; Y0=205; pre=15
    X=lambda s: X0+(s+pre)*k; Y=lambda y: Y0-y*k
    tE=W/2
    def e(s): return -W+(W+sep)*ss(s/Ls) if s>=0 else -W   # branch inner road edge, relative to main pit-side edge
    ns=[-pre+i*0.5 for i in range(int((S+pre)/0.5)+1)]
    se=4.32   # side extent per lane (kerb 1.98, gap, barrier 2.7-4.32) - same edge on every side
    nose=[s for s in ns if e(s)>=2*se+1.5][0]
    out=[f'<svg viewBox="0 0 {int(X(S)+40)} 285" role="img" aria-label="Weiche plan at scale: the branch leaves the straight main lane, gore hatched on the shared deck, the deck splits at a round nose where one barrier wraps around a crash cushion">'+DEFS]
    far=-(tE+5.32)
    top=[(X(s),Y(tE+max(e(s)+W,0)+5.32)) for s in ns]
    out.append(poly(top+[(X(s),Y(far)) for s in reversed(ns)],'deck'))
    # channel between the lanes after the nose, closed by a semicircle at the nose
    cs=[s for s in ns if s>=nose]
    lo=lambda s: tE+se; hi=lambda s: tE+e(s)-se
    r=(hi(nose)-lo(nose))/2; cy=(hi(nose)+lo(nose))/2
    semi=[(X(nose)-r*k*math.sin(math.pi*t/20)+0, Y(cy+r*math.cos(math.pi*t/20))) for t in range(21)]
    chan=semi+[(X(s),Y(lo(s))) for s in cs]+[(X(s),Y(hi(s))) for s in reversed(cs)]
    # barrier U around the channel: offset band
    bw=1.62
    outerU=[(X(nose)-(r+bw/k*k/k)*k*math.sin(math.pi*t/20), Y(cy+(r)*math.cos(math.pi*t/20))) for t in range(21)]
    Ub=[(X(nose)-(r*k+bw*k)*math.sin(math.pi*t/20), Y(cy)-(-(r*k+bw*k))*math.cos(math.pi*t/20)*(-1)) for t in range(21)]
    # build U band as polygon: outer path (radius r+bw) then inner path (radius r) reversed
    def upath(rr, lo_off, hi_off):
        arc=[(X(nose)-rr*k*math.sin(math.pi*t/20), Y(cy)-rr*k*math.cos(math.pi*t/20)) for t in range(21)]
        return [(X(s),Y(hi(s)+hi_off)) for s in reversed(cs)]+arc+[(X(s),Y(lo(s)-lo_off)) for s in cs]
    band=upath(r+bw, bw, bw)+list(reversed(upath(r,0,0)))
    gs=[q for q in ns if q>=0 and e(q)>0 and q<=nose+12]
    out.append(poly([(X(q),Y(tE+e(q))) for q in gs]+[(X(q),Y(tE)) for q in reversed(gs)],'gore'))
    out.append(poly(band,'barrier')); out.append(poly(chan,'bg'))
    out.append(poly([(X(q),Y(tE)) for q in cs]+[(X(q),Y(tE+1.98*ss((q-nose)/12))) for q in reversed(cs)],'kerb'))
    out.append(poly([(X(q),Y(tE+e(q))) for q in cs]+[(X(q),Y(tE+e(q)-1.98*ss((q-nose)/12))) for q in reversed(cs)],'kerb'))
    out.append(f'<circle cx="{f(X(nose)-(r+bw)*k-1.5*k)}" cy="{f(Y(cy))}" r="{f(1.5*k)}" class="cushion"/>')
    # outer barriers + kerbs
    out.append(poly([(X(s),Y(tE+max(e(s)+W,0)+2.7)) for s in ns]+[(X(s),Y(tE+max(e(s)+W,0)+4.32)) for s in reversed(ns)],'barrier'))
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(-tE-2.7))}" width="{f((S+pre)*k)}" height="{f(1.62*k)}" class="barrier"/>')
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(-tE))}" width="{f((S+pre)*k)}" height="{f(1.98*k)}" class="kerb"/>')
    out.append(f'<rect x="{f(X(-pre))}" y="{f(Y(tE))}" width="{f((S+pre)*k)}" height="{f(W*k)}" class="road"/>')
    bs=[s for s in ns if s>=0]
    out.append(poly([(X(s),Y(tE+e(s)+W)) for s in bs]+[(X(s),Y(tE+e(s))) for s in reversed(bs)],'road'))
    out.append(pl([(X(-pre),Y(tE-0.5)),(X(S),Y(tE-0.5))],'paint')); out.append(pl([(X(-pre),Y(-tE+0.5)),(X(S),Y(-tE+0.5))],'paint'))
    out.append(pl([(X(s),Y(tE+e(s)+0.5)) for s in bs if e(s)>0.5],'paint')); out.append(pl([(X(s),Y(tE+max(e(s)+W,0)-0.5)) for s in ns],'paint'))
    out.append(pl([(X(-pre),Y(0)),(X(S),Y(0))],'paint dash'))
    out.append(brk(X(-pre),Y(tE+5.32),Y(far))); out.append(brk(X(S),Y(tE+e(S)+W+5.32),Y(far)))
    out.append(badge(X(40),Y(tE+e(40)+W)-16,1)); out.append(badge(X(nose)-(r+bw)*k-40,Y(tE+2.5),2)); out.append(badge(X(nose)-(r+bw)*k-1.5*k,Y(cy)-22,3)); out.append(badge(X(S-30),Y(0)+16,4)); out.append(badge(X(S-30),Y(tE+e(S)+W/2)+16,5))
    out.append(scalebar(X(-pre),272,k,20)); out.append('</svg>'); return '\n'.join(out)

json.dump({'pit_plan':pit_plan(),'pit_section':pit_section(),'width_plan':width_plan(),'fork_plan':fork_plan(),'ramp':ramp()},open('/home/claude/concept/svgs2.json','w'))
print('ok')
