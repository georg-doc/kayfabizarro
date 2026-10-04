# Port of Travel card-carrier.js sync() (terrain-planets-v1) for review: springs, lean, wave, gust, cup, tail, bank-tip, seat plant.
import json, math, numpy as np
FPS=30; dt=1/FPS
CW=3.0; CD=CW*447/800; TH=0.055; SEGX=10; SEGZ=14; halfW=CW/2; halfD=CD/2
W=dict(amp=0.075,rate=1.15,wlZ=1.15,wlX=0.6,bob=0.030,bobRate=1.05,sway=0.026,swayRate=1.55,pitchRate=1.13)
LECTERN=0.175
# PlaneGeometry(CW,CD,SEGX,SEGZ).rotateX(-PI/2): row iy=0 at plane y=+CD/2 -> z=-CD/2 (front)
xs=np.array([-halfW+ix*CW/SEGX for ix in range(SEGX+1)])
zs=np.array([-halfD+iy*CD/SEGZ for iy in range(SEGZ+1)])
GX,GZ=np.meshgrid(xs,zs)           # [row iy, col ix]
U=GX/halfW; Wn=GZ/halfD
# linear deformation bases (Travel formula is linear in these coefficients)
k=GZ*3.4+GX*1.6; env=(0.35+np.abs(Wn))
B_WAVE_S=np.cos(k)*env; B_WAVE_C=np.sin(k)*env           # sin(ph+k)=sin(ph)cos k+cos(ph)sin k
kg=GZ*W['wlZ']+GX*W['wlX']; envg=(0.25+np.abs(Wn)*0.9)
B_GUST_S=np.cos(kg)*envg; B_GUST_C=np.sin(kg)*envg
B_CUP=U*U*0.9
B_TAIL=np.where(Wn>0,Wn*Wn,Wn*Wn*-0.5)*0.8
B_BANK=GX*0.16
BASES=dict(WAVE_S=B_WAVE_S,WAVE_C=B_WAVE_C,GUST_S=B_GUST_S,GUST_C=B_GUST_C,CUP=B_CUP,TAIL=B_TAIL,BANKTIP=B_BANK)
def spring(c,target,stiff,damp):
    c['v']+= (target-c['x'])*stiff*dt; c['v']*=damp**(dt*60); c['x']+=c['v']*dt
# ---- review timeline: (name, seconds, inputs). root_* = Travel-owned world transform preview (review only)
S0=dict(speed=0,bank=0,pitchTilt=0,boosting=False,climbIn=0,calm=0,rootPitch=0,rootBank=0,roll=0)
CRU=dict(S0,speed=12)
TL=[('SOURCE_NEUTRAL',2.0,dict(S0,frozen=True)),
    ('CALM_LECTERN',3.5,dict(S0,calm=1)),
    ('CRUISE',3.5,dict(CRU)),
    ('BOOST',3.0,dict(CRU,speed=20,boosting=True)),
    ('BANK_LEFT',3.0,dict(CRU,bank=0.3,rootBank=10)),
    ('BANK_RIGHT',3.0,dict(CRU,bank=-0.3,rootBank=-10)),
    ('CLIMB',3.0,dict(CRU,climbIn=0.15,pitchTilt=0.25,rootPitch=14)),
    ('DIVE',3.0,dict(CRU,climbIn=-0.15,pitchTilt=-0.25,rootPitch=-16)),
    ('BRAKE_RECOVER',3.0,dict(S0,calm='ramp')),
    ('BARREL_ROLL',3.6,dict(CRU,roll='ramp')),
    ('LAND_HOVER_PREP',3.5,dict(S0,calm=1)),
]
def run():
    roll=dict(x=0,v=0); pitch=dict(x=0,v=0); yaw=dict(x=0,v=0); cup=dict(x=0,v=0); tail=dict(x=0,v=0)
    bob=wavePh=windPh=0.0; prevBoost=False; calm=0.0; frames=[]; seat=np.array([0,0,0,1.0])
    seat_x,seat_z,r=0.0,CD*0.12,0.13; t_abs=0; seg_marks=[]
    rootP=rootB=0.0
    for name,dur,st in TL:
        n=int(round(dur*FPS)); seg_marks.append((name,len(frames),len(frames)+n))
        for i in range(n):
            u=i/max(1,n-1)
            if st.get('frozen'):
                frames.append(dict(state=name,coef={k:0 for k in BASES},lean=[0,0,0],leanY=0,root=[0,0,0],seat=[seat_x,0,seat_z],seatQ=[0,0,0,1],calm=0,speed=0,bank=0,climb=0,boost=0,u=u)); continue
            c=st['calm']; calmT = (min(1,u*1.6)) if c=='ramp' else c
            calm += (calmT-calm)*min(1,dt*4)   # arrival direction eases calm (review)
            spd=st['speed'] if st.get('calm')!='ramp' else 12*(1-min(1,u*1.6))
            bank=st['bank']; pt=st['pitchTilt']; boosting=st['boosting']; climbIn=st['climbIn']
            rootP+= (st['rootPitch']-rootP)*min(1,dt*3); rootB+=(st['rootBank']-rootB)*min(1,dt*3)
            rr = 0.0
            if st.get('roll')=='ramp':
                a=min(1,max(0,(u-0.12)/0.76)); rr=360*(a*a*(3-2*a))
            boostKick=0.16 if boosting else 0
            spring(roll,max(-0.7,min(0.7,bank*1.15)),90,0.80)
            spring(pitch,max(-0.5,min(0.5,pt*0.9+boostKick)),80,0.82)
            spring(yaw,max(-0.35,min(0.35,-bank*0.5)),70,0.84)
            wind=calm
            lx=pitch['x']+math.sin(bob*W['pitchRate'])*W['sway']*wind-LECTERN*calm
            ly=yaw['x']; lz=roll['x']+math.sin(bob*W['swayRate'])*W['sway']*1.4*wind
            if boosting and not prevBoost: pitch['v']+=1.6
            prevBoost=boosting
            bob+=dt; cq=1-calm
            leanY=math.sin(bob*2.4)*0.03*cq+math.sin(bob*W['bobRate'])*W['bob']*wind
            spring(cup,min(0.5,abs(bank)*1.3+(0.14 if boosting else 0))*cq,70,0.82)
            spring(tail,max(-0.4,min(0.5,(0.42 if boosting else 0)+climbIn*3.0-pt*0.4))*cq,60,0.84)
            wavePh+=dt*(2.6+spd*0.07)*cq; windPh+=dt*W['rate']
            amp=(0.06+spd*0.0016)*cq; windAmp=W['amp']*wind
            coef=dict(WAVE_S=amp*math.sin(wavePh),WAVE_C=amp*math.cos(wavePh),GUST_S=windAmp*math.sin(windPh),GUST_C=windAmp*math.cos(windPh),
                      CUP=cup['x'],TAIL=tail['x'],BANKTIP=roll['x'])
            Y=sum(coef[k]*BASES[k] for k in BASES)
            sp,sn=seat_plant(Y,seat_x,seat_z,r)
            frames.append(dict(state=name,coef=coef,lean=[lx,ly,lz],leanY=leanY,root=[rootP,rootB,rr],seat=sp,seatN=sn,calm=calm,speed=spd,bank=bank,climb=climbIn,boost=1 if boosting else 0,u=u,
                               springs=dict(roll=roll['x'],pitch=pitch['x'],yaw=yaw['x'],cup=cup['x'],tail=tail['x'])))
    # seat quaternion: slerp toward surface normal at rate dt*8 (as plantSeat)
    q=np.array([0,0,0,1.0])
    for f in frames:
        if 'seatN' not in f: f['seatQ']=[0,0,0,1]; continue
        tq=from_up(np.array(f['seatN'])); q=slerpq(q,tq,min(1,dt*8)); f['seatQ']=list(q)
    return frames,seg_marks
def grid_normals(Y):
    # vertex normals of y-displaced grid (like computeVertexNormals on a regular grid)
    dYdx=np.gradient(Y,xs,axis=1); dYdz=np.gradient(Y,zs,axis=0)
    N=np.stack([-dYdx,np.ones_like(Y),-dYdz],-1); return N/np.linalg.norm(N,axis=-1,keepdims=True)
def bil(A,x,z):
    fc=(x-xs[0])/(xs[-1]-xs[0])*SEGX; fr=(z-zs[0])/(zs[-1]-zs[0])*SEGZ
    c0=int(max(0,min(SEGX-1,math.floor(fc)))); r0=int(max(0,min(SEGZ-1,math.floor(fr)))); tx=min(1,max(0,fc-c0)); tz=min(1,max(0,fr-r0))
    return (A[r0,c0]*(1-tx)+A[r0,c0+1]*tx)*(1-tz)+(A[r0+1,c0]*(1-tx)+A[r0+1,c0+1]*tx)*tz
def seat_plant(Y,x,z,r):
    h=(bil(Y,x,z)+bil(Y,x-r,z)+bil(Y,x+r,z)+bil(Y,x,z-r)+bil(Y,x,z+r))/5
    N=grid_normals(Y); n=np.array([bil(N[...,k],x,z) for k in range(3)]); n/=np.linalg.norm(n)
    return [x,h,z],list(n)
def from_up(n):
    a=np.array([0,1.0,0]); d=float(np.dot(a,n))
    if d>0.999999: return np.array([0,0,0,1.0])
    ax=np.cross(a,n); q=np.array([ax[0],ax[1],ax[2],1+d]); return q/np.linalg.norm(q)
def slerpq(a,b,u):
    d=np.dot(a,b)
    if d<0: b=-b; d=-d
    if d>0.9995: r=a+u*(b-a); return r/np.linalg.norm(r)
    th=math.acos(d); return (math.sin((1-u)*th)*a+math.sin(u*th)*b)/math.sin(th)
if __name__=='__main__':
    fr,marks=run()
    json.dump(dict(fps=FPS,marks=marks,frames=fr,grid=dict(CW=CW,CD=CD,TH=TH,SEGX=SEGX,SEGZ=SEGZ),
                   bases={k:v.tolist() for k,v in BASES.items()}),open('/tmp/g2b/sim.json','w'))
    print(len(fr),marks)
    for nm,a,b in marks:
        f=fr[(a+b)//2]; print(nm,{k:round(v,3) for k,v in f['coef'].items()}, [round(x,3) for x in f['lean']], f['seat'][1] if isinstance(f['seat'],list) else 0, f['root'])
