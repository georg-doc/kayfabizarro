import sys,json,math,numpy as np
sys.path.insert(0,'/tmp/fl'); sys.path.insert(0,'/tmp/loco/work')
from wtool import *
SRC='/tmp/fl/CM_SRC3.glb'
g=GLB(SRC); FPS=30
joints=[g.nodes[j]['name'] for j in g.json['skins'][0]['joints']]
def sub(n):
    out=[n]
    for c in g.nodes[g.name2i[n]].get('children',[]):
        nm=g.nodes[c].get('name')
        if nm in joints: out+=sub(nm)
    return out
TORSO=set(sub('chest'))
BASE=Pose(g,'Jump_Idle'); UP=Pose(g,'Running_HoldingRifle'); UT=UP.t0+0.25
def bT(P,t,b):
    i=g.name2i[b]; ch=P.ch.get((i,'translation')); return sample(ch,t,'translation') if ch else np.array(g.nodes[i].get('translation',[0,0,0]),float)
def qax(axis,deg):
    a=math.radians(deg)/2; v=np.array(axis,float)*math.sin(a); return np.array([v[0],v[1],v[2],math.cos(a)])
def qmul(a,b):
    x1,y1,z1,w1=a; x2,y2,z2,w2=b
    return np.array([w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2])
X,Y,Z=(1,0,0),(0,1,0),(0,0,1)
P0=dict(lean=8,chest_x=0,head_x=-4,head_y=0,chest_y=0,chest_z=0,leg_x=0,leg_z=0,knee=0,foot_x=0,wing=30,bob=0.035,sway=2,flutter=0,vib=0,tuck=0)
CRU=dict(P0,lean=35,chest_x=-8,head_x=-22,leg_x=12,knee=-10,wing=38,bob=0.02,sway=1.5,flutter=4)
def S(**k): return k
# clip: name, frames, loop, class, keys[(t_frac, params)]
CLIPS=[
 ('flight_idle_hover',64,True,'BASE LOOP',[(0,P0),(1,P0)]),
 ('flight_cruise',64,True,'BASE LOOP',[(0,CRU),(1,CRU)]),
 ('flight_boost',32,True,'ADDITIVE/OVERLAY (or short BASE while boost>0)',[(0,dict(CRU,lean=55,chest_x=-12,head_x=-34,leg_x=22,knee=-35,foot_x=25,wing=55,bob=0.0,sway=0,flutter=2,vib=1.5)),(1,dict(CRU,lean=55,chest_x=-12,head_x=-34,leg_x=22,knee=-35,foot_x=25,wing=55,bob=0.0,sway=0,flutter=2,vib=1.5))]),
 ('flight_climb',64,True,'ADDITIVE/OVERLAY (signed climb>0)',[(0,dict(CRU,lean=12,chest_x=-4,head_x=-24,leg_x=-6,knee=10,wing=45)),(1,dict(CRU,lean=12,chest_x=-4,head_x=-24,leg_x=-6,knee=10,wing=45))]),
 ('flight_dive',64,True,'ADDITIVE/OVERLAY (signed climb<0)',[(0,dict(CRU,lean=68,chest_x=-14,head_x=-44,leg_x=18,knee=-25,foot_x=20,wing=22,flutter=2)),(1,dict(CRU,lean=68,chest_x=-14,head_x=-44,leg_x=18,knee=-25,foot_x=20,wing=22,flutter=2))]),
 ('flight_bank_left',64,True,'ADDITIVE/OVERLAY blend pair (signed bank<0)',[(0,dict(CRU,head_y=22,chest_y=10,chest_z=-8,leg_z=-13,head_x=-18)),(1,dict(CRU,head_y=22,chest_y=10,chest_z=-8,leg_z=-13,head_x=-18))]),
 ('flight_bank_right',64,True,'ADDITIVE/OVERLAY blend pair (signed bank>0)',[(0,dict(CRU,head_y=-22,chest_y=-10,chest_z=8,leg_z=13,head_x=-18)),(1,dict(CRU,head_y=-22,chest_y=-10,chest_z=8,leg_z=13,head_x=-18))]),
 ('flight_roll_reaction',30,False,'ONE-SHOT (Travel rolls the root)',[(0,CRU),(0.3,dict(CRU,tuck=1,lean=40,chest_x=12,head_x=8,leg_x=-45,knee=70,wing=20,flutter=0,bob=0)),(0.62,dict(CRU,tuck=1,lean=40,chest_x=12,head_x=8,leg_x=-45,knee=70,wing=20,flutter=0,bob=0)),(1,CRU)]),
 ('flight_brake_recover',36,False,'TRANSITION cruise -> hover',[(0,CRU),(0.33,dict(P0,lean=-22,chest_x=6,head_x=-8,leg_x=-35,knee=25,wing=14,bob=0,flutter=0)),(1,P0)]),
 ('flight_land_prepare',30,False,'TRANSITION hover -> Jump_Land (holds last pose)',[(0,P0),(1,dict(P0,lean=0,head_x=8,leg_x=0,knee=-55,foot_x=-15,wing=18,bob=0,sway=0))]),
]
def smooth(u): return u*u*(3-2*u)
def params_at(keys,u):
    for (t0,a),(t1,b) in zip(keys,keys[1:]):
        if u<=t1:
            w=smooth((u-t0)/(t1-t0) if t1>t0 else 1); return {k:a.get(k,0)*(1-w)+b.get(k,0)*w for k in set(a)|set(b)}
    return dict(keys[-1][1])
def build(name,N,loop,keys,uppose=None):
    UPp=uppose or UP; ut=UT if uppose is None else uppose.t0+min(uppose.T,1.2)
    tr={(g.name2i[b],p):np.zeros((N,4 if p=='rotation' else 3)) for b in joints for p in ('rotation','translation')}
    wl=np.zeros((N,4)); wr=np.zeros((N,4))
    ur=UPp.localrots(joints,ut)
    for f in range(N):
        u=f/(N-1 if not loop else N); t=f/FPS
        P=params_at(keys,u)
        tb=BASE.t0+(t%BASE.T); lr=BASE.localrots(joints,tb)
        ph=2*math.pi*(f/N if loop else t/BASE.T)
        for b in joints:
            src,tt,r=(UPp,ut,ur[b]) if b in TORSO else (BASE,tb,lr[b])
            q=r.copy(); T=bT(src,tt,b)
            if b=='hips':
                q=qmul(qax(X,P['lean']+P['vib']*math.sin(ph*10)),q); q=qmul(qax(Z,P['sway']*math.sin(ph)),q)
                T=T+np.array([0,P['bob']*math.sin(ph),0])
            elif b=='chest':
                q=qmul(qax(Y,P['chest_y']),qmul(qax(Z,P['chest_z']),qmul(qax(X,P['chest_x']),q)))
            elif b=='head':
                q=qmul(qax(Y,P['head_y']),qmul(qax(X,P['head_x']),q))
            elif b.startswith('upperarm'):
                q=qmul(qax(X,-0.85*(P['lean']+P['chest_x']-8)*(1-P['tuck'])),q)   # keep the gun near level against the body lean
            elif b.startswith('upperleg'):
                s=1 if b.endswith('.l') else -1
                q=qmul(qax(X,P['leg_x']+P['flutter']*math.sin(ph*2+(0 if s>0 else math.pi))),qmul(qax(Z,P['leg_z']),q))
            elif b.startswith('lowerleg'):
                q=qmul(q,qax(X,P['knee']))
            elif b.startswith('foot'):
                q=qmul(q,qax(X,P['foot_x']))
            tr[(g.name2i[b],'rotation')][f]=q/np.linalg.norm(q); tr[(g.name2i[b],'translation')][f]=T
        wl[f]=qax(Y,-P['wing']); wr[f]=qax(Y,P['wing'])
    tr[(g.name2i['CombatMech_WingLeft'],'rotation')]=wl; tr[(g.name2i['CombatMech_WingRight'],'rotation')]=wr
    return tr
if __name__=='__main__':
    J,B=read(SRC); J['animations']=[]
    man=[]
    for name,N,loop,cls,keys in CLIPS:
        add_anim(J,B,name,build(name,N,loop,keys)); man.append({'clip':name,'frames':N,'fps':FPS,'loop':loop,'class':cls})
    # optional: flight_aim = hover legs + Ranged_2H_Aiming hold (native, clamped)
    AIM=Pose(g,'Ranged_2H_Aiming')
    add_anim(J,B,'flight_aim',build('flight_aim',64,True,[(0,dict(P0,lean=14)),(1,dict(P0,lean=14))],uppose=AIM)); man.append({'clip':'flight_aim','frames':64,'fps':FPS,'loop':True,'class':'ADDITIVE/OVERLAY upper body (aim hold)'})
    write(J,B,'/tmp/fl/CM_FLIGHT.glb'); json.dump(man,open('/tmp/fl/manifest_clips.json','w'),indent=1); print('ok',len(man))
