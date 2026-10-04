# kfb_fluff_ball_bounce_reference: keyframe reference data (not runtime physics). 30 fps, R=0.5 m, drop centre height 2.0 m.
import json, math
FPS=30; G=9.81; R=0.5; H0=2.0
P={'high':dict(e=0.62,squash=0.80,contactF=[2,2,1],stretch=1.10,roll=0.35,settleWobble=0.0,maxB=3),
   'low' :dict(e=0.40,squash=0.66,contactF=[4,3,2],stretch=1.05,roll=0.12,settleWobble=0.05,maxB=3)}
def sim(p):
    fr=[]; y=H0; vy=0.0; x=0.0; dt=1/FPS; b=0; contacts=[]; peaks=[H0]; vx=p['roll']
    while True:
        # airborne step
        vy-=G*dt; y+=vy*dt; x+=vx*dt*(1 if b>0 else 0)
        if y<=R:
            # contact: hold n frames, squash in/out
            n=p['contactF'][min(b,len(p['contactF'])-1)]; contacts.append(len(fr))
            imp=min(1.0,abs(vy)/math.sqrt(2*G*(H0-R)))
            s=1-(1-p['squash'])*imp
            seq=[s] if n==1 else [1-(1-s)*math.sin(math.pi*(k+1)/(n+1)) for k in range(n)]
            seq[len(seq)//2]=s
            for q in seq:
                sxz=1/math.sqrt(q); fr.append((x,R*q,sxz,q)); x+=vx*dt
            b+=1; vy=abs(vy)*p['e']; y=R; vx*=0.6
            pk=R+vy*vy/(2*G); peaks.append(round(pk,3))
            if b>=p['maxB'] or pk-R<0.03: break
            continue
        sp=min(1.0,abs(vy)/math.sqrt(2*G*(H0-R)))
        st=1+(p['stretch']-1)*sp
        fr.append((x,y,1/math.sqrt(st),st))
    # settle: roll out + wobble
    for k in range(24):
        w=p['settleWobble']*math.exp(-k/5)*math.cos(k*1.4); q=1-abs(w) if w>0 else 1+abs(w)*0.5
        fr.append((x,R*q,1/math.sqrt(q),q)); x+=vx*math.exp(-k/6)/FPS
    return fr,contacts,peaks
out={'id':'kfb_fluff_ball_bounce_reference','fps':FPS,'radius':R,'dropCentreHeight':H0,'gravity':G,'axis':'Blender Z up (glTF +Y up); roll along +X','pivot':'ball centre; ground contact keeps the bottom at 0','variants':{}}
for k,p in P.items():
    fr,c,pk=sim(p)
    out['variants'][k]={'params':p,'frames':len(fr),'contactFrames':c,'peakCentreHeights':pk,'squashMin':round(min(f[3] for f in fr),3),'stretchMax':round(max(f[3] for f in fr),3),'track':[[round(v,4) for v in f] for f in fr]}
json.dump(out,open('/tmp/fluff/bounce/bounce_reference.json','w'),indent=0)
for k,v in out['variants'].items(): print(k,v['frames'],v['contactFrames'],v['peakCentreHeights'],v['squashMin'],v['stretchMax'])
