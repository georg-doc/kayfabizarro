import math
def ss(t): t=max(0,min(1,t)); return t*t*t*(t*(6*t-15)+10)
def fmt(v): return f"{v:.1f}"
def poly(pts, cls, extra=''):
    return f'<polygon points="{" ".join(fmt(x)+","+fmt(y) for x,y in pts)}" class="{cls}" {extra}/>'
def pline(pts, cls, extra=''):
    return f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x,y in pts)}" class="{cls}" fill="none" {extra}/>'
def text(x,y,t,anchor='middle',cls='lbl'):
    return f'<text x="{fmt(x)}" y="{fmt(y)}" text-anchor="{anchor}" class="{cls}">{t}</text>'
def defs():
    return '''<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="gore-bg"/><line x1="0" y1="0" x2="0" y2="6" class="gore-ln"/></pattern>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ink-f"/></marker></defs>'''
def scalebar(x,y,px_per_m,m=20):
    L=m*px_per_m
    return f'<line x1="{fmt(x)}" y1="{fmt(y)}" x2="{fmt(x+L)}" y2="{fmt(y)}" class="ink" stroke-width="2"/><line x1="{fmt(x)}" y1="{fmt(y-4)}" x2="{fmt(x)}" y2="{fmt(y+4)}" class="ink"/><line x1="{fmt(x+L)}" y1="{fmt(y-4)}" x2="{fmt(x+L)}" y2="{fmt(y+4)}" class="ink"/>'+text(x+L/2,y+15,f"{m} m",cls='sm')

# ---------------------------------------------------------------- PIT PLAN
def pit_plan():
    k=3.4; W=14.4; kerb=1.98; wallz=3.0; lane=7.2; apron=7.2; gar=12.0
    Lin=80; Lz=20; bays=6; bay=9; Lb=bays*bay; Lout=80
    S=Lin+Lz+Lb+Lz+Lout
    X0=40; Y0=200  # y of track centreline in px; pit side = up (negative y)
    X=lambda s: X0+s*k; Y=lambda y: Y0-y*k   # y>0 = pit side
    full=kerb+wallz  # lateral offset of pit lane inner edge from track edge when fully out
    def e(s):  # pit lane inner edge offset from track road edge (m), negative = over the track
        if s<Lin: return -lane+(full+lane)*ss(s/Lin)
        if s>S-Lout: return -lane+(full+lane)*ss((S-s)/Lout)
        return full
    ns=[i*0.5 for i in range(int(S/0.5)+1)]
    tE=W/2
    out=[]
    out.append(f'<svg viewBox="0 0 {int(X(S)+60)} 300" role="img" aria-label="Plan of the pit complex: one continuous deck, pit lane peels off the track edge, hatched gore, pit wall with crash cushions, boxes and garages">'+defs())
    # deck outline (one slab): from far barrier side to pit lane outer edge (+apron where boxes)
    def outer(s):
        o=tE+max(e(s),-lane)+lane  # pit lane outer edge
        if Lin<=s<=S-Lout: o=tE+full+lane+apron*ss(min((s-Lin)/10,(S-Lout-s)/10,1))
        return max(o,tE+kerb)+1.0
    top=[(X(s),Y(outer(s))) for s in ns]
    bot=[(X(s),Y(-(tE+4.32+0.5))) for s in reversed(ns)]
    out.append(poly(top+bot,'deck'))
    # garages building strip
    gy0=tE+full+lane+apron+1.0
    out.append(f'<rect x="{fmt(X(Lin+Lz))}" y="{fmt(Y(gy0+gar))}" width="{fmt(Lb*k)}" height="{fmt(gar*k)}" class="bldg"/>')
    for b in range(bays+1):
        xx=X(Lin+Lz+b*bay); out.append(f'<line x1="{fmt(xx)}" y1="{fmt(Y(gy0+gar))}" x2="{fmt(xx)}" y2="{fmt(Y(gy0))}" class="bldg-ln"/>')
    # apron with box markings
    out.append(f'<rect x="{fmt(X(Lin+Lz))}" y="{fmt(Y(gy0-1.0))}" width="{fmt(Lb*k)}" height="{fmt(apron*k)}" class="apron"/>')
    for b in range(bays):
        cx=X(Lin+Lz+b*bay+bay/2); out.append(f'<rect x="{fmt(cx-3*k)}" y="{fmt(Y(gy0-1.3))}" width="{fmt(6*k)}" height="{fmt(5.8*k)}" class="boxmark"/>')
    # track road + far barrier
    out.append(f'<rect x="{fmt(X(0))}" y="{fmt(Y(tE))}" width="{fmt(S*k)}" height="{fmt(W*k)}" class="road"/>')
    out.append(f'<rect x="{fmt(X(0))}" y="{fmt(Y(-tE-kerb))}" width="{fmt(S*k)}" height="{fmt(kerb*k)}" class="kerb"/>')
    out.append(f'<rect x="{fmt(X(0))}" y="{fmt(Y(-tE-4.32))}" width="{fmt(S*k)}" height="{fmt(1.62*k)}" class="barrier"/>')
    # track kerb on pit side: only where pit lane has separated
    # pit lane asphalt
    lanepts=[(X(s),Y(tE+e(s)+lane)) for s in ns]+[(X(s),Y(tE+e(s))) for s in reversed(ns)]
    out.append(poly(lanepts,'road'))
    # gore (hatched) between track edge and pit lane inner edge where e>0, until wall zone
    gore_top=[(X(s),Y(tE+max(0,min(e(s),full)))) for s in ns]
    gore=gore_top+[(X(s),Y(tE)) for s in reversed(ns)]
    out.append(poly(gore,'gore'))
    # pit wall: where separation >= full-0.5, centred in wall zone
    ws=[s for s in ns if e(s)>=full-0.05]
    w0,w1=ws[0],ws[-1]
    wy=tE+kerb+wallz/2
    out.append(f'<rect x="{fmt(X(w0))}" y="{fmt(Y(wy+0.5))}" width="{fmt((w1-w0)*k)}" height="{fmt(1.0*k)}" class="wall"/>')
    for sx in (w0,w1):
        out.append(f'<circle cx="{fmt(X(sx))}" cy="{fmt(Y(wy))}" r="{fmt(1.6*k)}" class="cushion"/>')
    # paint: track edge line continuous; pit entry line / blend line; limiter lines
    out.append(pline([(X(0),Y(tE-0.4)),(X(S),Y(tE-0.4))],'paint'))
    out.append(pline([(X(0),Y(-tE+0.4)),(X(S),Y(-tE+0.4))],'paint'))
    out.append(pline([(X(s),Y(0)) for s in (0,S)],'paint dash'))
    for sx,lab in ((Lin,'speed limit'),(S-Lout,'end limit')):
        out.append(f'<line x1="{fmt(X(sx))}" y1="{fmt(Y(tE+full))}" x2="{fmt(X(sx))}" y2="{fmt(Y(tE+full+lane))}" class="paint thick"/>')
    # pit lane centre dashed
    out.append(pline([(X(s),Y(tE+e(s)+lane/2)) for s in ns[::4]],'paint dash thin'))
    # labels + callouts
    def call(x,y,tx,ty,t,anchor='start'):
        return f'<line x1="{fmt(tx)}" y1="{fmt(ty)}" x2="{fmt(x)}" y2="{fmt(y)}" class="ink thin" marker-end="url(#ar)"/>'+text(tx+(3 if anchor=="start" else -3),ty-3,t,anchor)
    out.append(text(X(S/2),Y(-3.6)+4,'TRACK 14.4 m · width and line never change'))
    out.append(call(X(30),Y(tE+2),X(2),Y(tE+36),'1 pit lane peels off the track edge'))
    out.append(call(X(w0),Y(wy),X(w0-8),Y(tE+full+lane+apron+14),'2 cushion starts the pit wall','end'))
    out.append(call(X(Lin-20),Y(tE+1.5),X(Lin+10),Y(-tE-14),'hatched gore island (paint, on the deck)'))
    out.append(call(X(Lin),Y(tE+full+lane),X(Lin-2),Y(tE+full+lane+apron+26),'3 speed-limit line','end'))
    out.append(text(X(Lin+Lz+Lb/2),Y(gy0+gar/2)+4,'4 garages',cls='sm'))
    out.append(call(X(S-45),Y(tE+2),X(S+8),Y(tE+30),'5 pit exit blends into the track edge','end'))
    out.append(call(X(S-8),Y(-tE-5),X(S-30),Y(-tE-18),'one continuous deck slab under everything','end'))
    out.append(scalebar(X(0),282,k,20))
    out.append('</svg>')
    return '\n'.join(out)

# ---------------------------------------------------------------- PIT SECTION
def pit_section():
    k=11; W=14.4
    parts=[('barrier',1.62,1.35),('shoulder',1.98,0),('road',W,0),('kerb',1.98,0),('wallzone',3.0,0),('road',7.2,0),('apron',7.2,0),('bldg',12.0,5.0)]
    total=sum(p[1] for p in parts)
    X0=60; Yr=80
    out=[f'<svg viewBox="0 0 {int(X0*2+total*k)} 185" role="img" aria-label="Cross-section of the pit straight: one deck, track, kerb, slim pit wall, pit lane, box apron, garages">'+defs()]
    out.append(f'<rect x="{X0}" y="{Yr}" width="{fmt(total*k)}" height="{fmt(2.25*k)}" class="deck"/>')
    x=X0; labs=[]
    names={'barrier':'track barrier 1.62','shoulder':'shoulder 1.98','road':None,'kerb':'kerb 1.98','wallzone':'wall zone 3.0','apron':'box apron 7.2','bldg':'garage 12 × 5 h'}
    for i,(n,w,h) in enumerate(parts):
        if n=='road': lab='track 14.4' if w>10 else 'pit lane 7.2'
        else: lab=names[n]
        if n=='barrier': out.append(f'<rect x="{fmt(x)}" y="{fmt(Yr-h*k)}" width="{fmt(w*k)}" height="{fmt(h*k)}" class="barrier"/>')
        elif n=='bldg': out.append(f'<rect x="{fmt(x)}" y="{fmt(Yr-h*k)}" width="{fmt(w*k)}" height="{fmt(h*k)}" class="bldg"/>')
        else: out.append(f'<rect x="{fmt(x)}" y="{fmt(Yr-3)}" width="{fmt(w*k)}" height="3" class="{ "road" if n=="road" else "kerb" if n in ("kerb","shoulder") else "apron" if n=="apron" else "deck"}"/>')
        if n=='wallzone':
            wx=x+1.0*k; out.append(f'<rect x="{fmt(wx)}" y="{fmt(Yr-1.2*k)}" width="{fmt(1.0*k)}" height="{fmt(1.2*k)}" class="wall"/>')
            out.append(f'<line x1="{fmt(wx+0.5*k)}" y1="{fmt(Yr-1.2*k)}" x2="{fmt(wx+0.5*k)}" y2="{fmt(Yr-4*k)}" class="ink dash"/>')
            out.append(text(wx+0.5*k,Yr-4*k-6,'pit wall 1.0 × 1.2 (+ fence)',cls='sm'))
        # dimension
        yy=Yr+2.25*k+18+(i%3)*16
        out.append(f'<line x1="{fmt(x)}" y1="{fmt(yy)}" x2="{fmt(x+w*k)}" y2="{fmt(yy)}" class="ink thin" marker-start="url(#ar)" marker-end="url(#ar)"/>')
        out.append(text(x+w*k/2,yy-3,lab,cls='sm'))
        x+=w*k
    out.append(text(X0+total*k/2,Yr+2.25*k/2+4,'one deck slab 2.25 m, continuous from track barrier to garage back wall',cls='sm inv'))
    out.append('</svg>'); return '\n'.join(out)

# ---------------------------------------------------------------- WIDTH CHANGE PLAN
def width_plan():
    k=3.2; S=200; W0=14.4; W1=18.0; T=45
    X0=30; Y0=110
    X=lambda s: X0+s*k; Y=lambda y: Y0-y*k
    def w(s):
        a=40; b=S-40-T
        if s<a: return W0
        if s<a+T: return W0+(W1-W0)*ss((s-a)/T)
        if s<b: return W1
        if s<b+T: return W1+(W0-W1)*ss((s-b)/T)
        return W0
    ns=[i*0.5 for i in range(int(S/0.5)+1)]
    out=[f'<svg viewBox="0 0 {int(X(S)+30)} 200" role="img" aria-label="Width change: deck, kerb, barrier and edge line move as one parallel family over 1 to 25 per side">'+defs()]
    for sgn in (1,-1):
        for off,cls in ((4.32+0.5,'deck'),(4.32,'barrier'),(2.7,'kerb'),(1.98,'kerb2')):
            pass
    # deck
    top=[(X(s),Y(w(s)/2+4.82)) for s in ns]; bot=[(X(s),Y(-w(s)/2-4.82)) for s in reversed(ns)]
    out.append(poly(top+bot,'deck'))
    for sgn in (1,-1):
        bar=[(X(s),Y(sgn*(w(s)/2+2.7))) for s in ns]+[(X(s),Y(sgn*(w(s)/2+4.32))) for s in reversed(ns)]
        out.append(poly(bar,'barrier'))
        kb=[(X(s),Y(sgn*(w(s)/2))) for s in ns]+[(X(s),Y(sgn*(w(s)/2+1.98))) for s in reversed(ns)]
        out.append(poly(kb,'kerb'))
    rd=[(X(s),Y(w(s)/2)) for s in ns]+[(X(s),Y(-w(s)/2)) for s in reversed(ns)]
    out.append(poly(rd,'road'))
    for sgn in (1,-1): out.append(pline([(X(s),Y(sgn*(w(s)/2-0.4))) for s in ns],'paint'))
    out.append(pline([(X(0),Y(0)),(X(S),Y(0))],'paint dash'))
    out.append(f'<line x1="{fmt(X(40))}" y1="{fmt(Y(W1/2+12))}" x2="{fmt(X(85))}" y2="{fmt(Y(W1/2+12))}" class="ink thin" marker-start="url(#ar)" marker-end="url(#ar)"/>'+text(X(62.5),Y(W1/2+12)-4,'45 m = 25 × 1.8 m per side'))
    out.append(text(X(20),Y(0)-4,'14.4')+text(X(100),Y(0)-4,'18.0')+text(X(180),Y(0)-4,'14.4'))
    out.append(scalebar(X(0),188,k,20)); out.append('</svg>'); return '\n'.join(out)

# ---------------------------------------------------------------- WEICHE PLAN
def fork_plan():
    k=3.0; S=240; W=14.4; Lsep=100
    X0=30; Y0=190
    X=lambda s: X0+s*k; Y=lambda y: Y0-y*k
    def e(s): return -W+(W+12.0)*ss(s/Lsep) if s<Lsep else -W+(W+12.0)  # branch inner edge from main edge
    ns=[i*0.5 for i in range(int(S/0.5)+1)]
    tE=W/2
    out=[f'<svg viewBox="0 0 {int(X(S)+30)} 300" role="img" aria-label="Weiche: one deck until the lanes are far enough apart, hatched gore, then the deck splits at a rounded nose with a crash cushion">'+defs()]
    nose=[s for s in ns if e(s)>=8.6][0]
    # shared deck until nose, then two decks
    top=[(X(s),Y(tE+e(s)+W+4.82)) for s in ns]
    bot=[(X(s),Y(-tE-4.82)) for s in reversed(ns)]
    out.append(poly(top+bot,'deck'))
    # cut the deck between lanes after the nose: draw a background-coloured channel
    ch=[(X(s),Y(tE+e(s)-4.32)) for s in ns if s>=nose]+[(X(s),Y(tE+4.32)) for s in reversed(ns) if s>=nose]
    out.append(poly(ch,'bg'))
    out.append(f'<circle cx="{fmt(X(nose))}" cy="{fmt(Y(tE+e(nose)/2))}" r="{fmt(1.6*k)}" class="cushion"/>')
    # barriers after nose on inner sides
    ib=[(X(s),Y(tE+2.7)) for s in ns if s>=nose]+[(X(s),Y(tE+4.32)) for s in reversed(ns) if s>=nose]
    out.append(poly(ib,'barrier'))
    ib2=[(X(s),Y(tE+e(s)-2.7)) for s in ns if s>=nose]+[(X(s),Y(tE+e(s)-4.32)) for s in reversed(ns) if s>=nose]
    out.append(poly(ib2,'barrier'))
    # outer barriers
    ob=[(X(s),Y(tE+e(s)+W+2.7)) for s in ns]+[(X(s),Y(tE+e(s)+W+4.32)) for s in reversed(ns)]
    out.append(poly(ob,'barrier'))
    out.append(f'<rect x="{fmt(X(0))}" y="{fmt(Y(-tE-2.7))}" width="{fmt(S*k)}" height="{fmt(1.62*k)}" class="barrier"/>')
    out.append(poly([(X(s),Y(tE)) for s in ns]+[(X(s),Y(-tE)) for s in reversed(ns)],'road'))
    out.append(poly([(X(s),Y(tE+e(s)+W)) for s in ns]+[(X(s),Y(tE+e(s))) for s in reversed(ns)],'road'))
    g=[(X(s),Y(tE+max(0,e(s)))) for s in ns if s<=nose]+[(X(s),Y(tE)) for s in reversed(ns) if s<=nose]
    out.append(poly(g,'gore'))
    out.append(pline([(X(s),Y(tE-0.4)) for s in (0,S)],'paint')+pline([(X(s),Y(-tE+0.4)) for s in (0,S)],'paint'))
    out.append(pline([(X(s),Y(tE+e(s)+0.4)) for s in ns if e(s)>0.4],'paint')+pline([(X(s),Y(tE+e(s)+W-0.4)) for s in ns],'paint'))
    out.append(text(X(S-40),Y(0)+4,'main lane: straight, same width'))
    out.append(text(X(S-40),Y(tE+e(S)+W/2)+4,'branch lane: same width, own line'))
    out.append(f'<line x1="{fmt(X(nose-30))}" y1="{fmt(Y(tE+3))}" x2="{fmt(X(nose-50))}" y2="{fmt(Y(-tE-14))}" class="ink thin"/>'+text(X(nose-50),Y(-tE-14)+12,'hatched gore on the shared deck'))
    out.append(f'<line x1="{fmt(X(nose))}" y1="{fmt(Y(tE+e(nose)/2))}" x2="{fmt(X(nose+30))}" y2="{fmt(Y(-tE-14))}" class="ink thin"/>'+text(X(nose+30),Y(-tE-14)+12,'deck splits at a rounded nose + cushion'))
    out.append(scalebar(X(0),285,k,20)); out.append('</svg>'); return '\n'.join(out)

# ---------------------------------------------------------------- RAMP ELEVATION
def ramp_elev():
    k=6.5; X0=20; Y0=130
    X=lambda s: X0+s*k; Y=lambda y: Y0-2*y*k
    L=30; lip=2.0; G=22; Ll=35
    def kick(s):
        u=s/L; return lip*(3*u*u-2*u*u*u) if False else lip*(u**2)  # simple
    out=[f'<svg viewBox="0 0 {int(X(L+G+Ll+10)+20)} 235" role="img" aria-label="Kicker and landing in side view: deck ends as a rounded bullnose, barriers end with rounded terminal caps">'+defs()]
    ks=[i*0.25 for i in range(int(L/0.25)+1)]
    top=[(X(s),Y(kick(s))) for s in ks]
    D=2.25
    def depth(s): d=L-s; p=max(0,1-d/9); return D*math.sqrt(max(0,1-p*p))
    bot=[(X(s),Y(kick(s)-depth(s))) for s in reversed(ks)]
    out.append(poly(top+bot,'deck'))
    out.append(pline(top,'roadline'))
    # barrier on top with rounded terminal cap
    bh=1.35
    def bar(s): d=L-s; w=1-ss(d/16); return bh*(1-0.5*w)*math.sqrt(max(0,1-max(0,1-d/9)**2))
    bt=[(X(s),Y(kick(s)+bar(s))) for s in ks]
    out.append(pline(bt,'barline'))
    # landing
    ls=[i*0.25 for i in range(int(Ll/0.25)+1)]
    x0=L+G
    def land(s): u=s/Ll; return lip-4*(3*u*u-2*u*u*u)
    def ldepth(s): p=max(0,1-s/9); return D*math.sqrt(max(0,1-p*p))
    ltop=[(X(x0+s),Y(land(s))) for s in ls]
    lbot=[(X(x0+s),Y(land(s)-ldepth(s))) for s in reversed(ls)]
    out.append(poly(ltop+lbot,'deck')); out.append(pline(ltop,'roadline'))
    lb=[(X(x0+s),Y(land(s)+bh*(1-0.5*(1-ss(s/16)))*math.sqrt(max(0,1-max(0,1-s/9)**2)))) for s in ls]
    out.append(pline(lb,'barline'))
    # flight arc
    arc=[(X(L+t*G),Y(lip+ (math.tan(math.radians(14))*t*G) - 15*(t*G)**2/(2*27**2*0.94))) for t in [i/40 for i in range(41)]]
    out.append(pline(arc,'ink dash'))
    out.append(text(X(2),Y(lip+3.6),'lip: bullnose, road full width to the edge','start'))
    out.append(text(X(x0),Y(lip+3.6),'landing: rounded catch lip','start'))
    out.append(text(X(2),228,'barrier lowers to 50 % and ends in a rounded cap (no sinking) · heights ×2','start'))
    out.append('</svg>'); return '\n'.join(out)

open('/home/claude/concept/svgs.py','w').write('')
import json
json.dump({'pit_plan':pit_plan(),'pit_section':pit_section(),'width_plan':width_plan(),'fork_plan':fork_plan(),'ramp':ramp_elev()},open('/home/claude/concept/svgs.json','w'))
print('ok')
