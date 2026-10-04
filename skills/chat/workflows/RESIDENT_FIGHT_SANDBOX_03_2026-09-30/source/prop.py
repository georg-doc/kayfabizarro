import sys,json,math; sys.path.insert(0,'/tmp/ch1'); sys.path.insert(0,'/tmp/fs1')
import bpy,numpy as np
from common import frames
from mathutils import Vector
F=json.load(open('/tmp/fs2/KFB_Fight_Cartoon_Contact.json'))
SC={'Rig_Medium':1.0,'Rig_Large':2.568}
CAPS={'handle':((0,-0.5,0),(0,0.55,0),0.08),'head':((0,0.9,-0.4),(0,0.9,0.4),0.34)}
AT='kfb_action_sword_and_shield_attack_a'; STANCE_FWD=-128.7
def segd(p0,p1,q0,q1):
    ts=np.linspace(0,1,15); P=p0+ts[:,None]*(p1-p0); Q=q0+ts[:,None]*(q1-q0)
    D=np.linalg.norm(P[:,None]-Q[None],axis=2); i,j=np.unravel_index(D.argmin(),D.shape); return D[i,j],P[i],Q[j]
def shapes(rig,W):
    R=F['rigs'][rig]
    return {'head':(np.array(W['head']@Vector(R['headSphere']['offsetInBoneSpace'])),)*2+(R['headSphere']['radiusM'],),
            'body':(np.array(W['hips'].translation),np.array(W['head'].translation),R['bodyCapsule']['radiusM'])}
out={}
for ra in SC:
    GA=frames(ra,AT); cf=F['attacks'][AT][ra]['contactFrame']; s=SC[ra]
    def prop(W):
        M=W['handslot.r']; Rm=np.array(M.to_3x3().normalized()); o=np.array(M.translation)
        return {k:(o+Rm@(s*np.array(a)),o+Rm@(s*np.array(b)),r*s) for k,(a,b,r) in CAPS.items()}
    PC=prop(GA[cf-1]); hd=(PC['head'][0]+PC['head'][1])/2; hA=np.array(GA[cf-1]['hips'].translation)
    ax=math.atan2(hd[1]-hA[1],hd[0]-hA[0]); axv=np.array([math.cos(ax),math.sin(ax),0])
    for rb in SC:
        WB=frames(rb,'kfb_action_boxing_a')[0]; yawS=math.degrees(ax)+180-STANCE_FWD
        cz,sz=math.cos(math.radians(yawS)),math.sin(math.radians(yawS)); Rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])
        hb=np.array(WB['hips'].translation); hb[2]=0
        SB0=shapes(rb,WB); SA_=lambda W: shapes(ra,W)
        clr=0.05*min(s,SC[rb])
        def place(dist):
            g=np.array([hA[0],hA[1],0])+axv*dist
            return {k:(g+Rz@(a-hb),g+Rz@(b-hb),r) for k,(a,b,r) in SB0.items()}
        def ok(dist):
            SB=place(dist)
            for f in range(max(1,cf-8),cf+1):   # swing window: prop and attacker must not enter the defender
                W=GA[f-1]; P=prop(W); A=SA_(W)
                for (a,b,r) in list(P.values())+list(A.values()):
                    for (c,d,rr) in SB.values():
                        if segd(a,b,c,d)[0] < r+rr+clr: return False
            return True
        d=0.5*s
        while not ok(d): d+=0.02
        SB=place(d); best=None
        for (c,dd,rr) in SB.values():
            g,p,q=segd(PC['head'][0],PC['head'][1],c,dd); gap=g-PC['head'][2]-rr
            if best is None or gap<best[0]: best=(gap,p,q,PC['head'][2],rr)
        gap,p,q,r1,r2=best; u=(q-p)/np.linalg.norm(q-p); a=p+u*r1; b=q-u*r2; puff=(a+b)/2
        key=f'{AT}|{ra}|{rb}'
        out[key]={'hipsDistanceM':round(d,2),'visualGapM':round(float(gap),3),'attackAxisYawDeg':round(math.degrees(ax),1),'defenderStanceYawDeg':round(yawS%360,1),
                  'impactPuffAt':[round(float(x),3) for x in puff],'contactFrame':cf,'hitBy':'prop head'}
        print(key,out[key],flush=True)
json.dump(out,open('/tmp/fs3/prop_table.json','w'),indent=1)
