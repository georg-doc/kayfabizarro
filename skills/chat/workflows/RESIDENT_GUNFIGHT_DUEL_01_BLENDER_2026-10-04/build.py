import sys,json,math,numpy as np
sys.path.insert(0,'/tmp/loco/work'); sys.path.insert(0,'/tmp/bd')
from gl import *
from inject import *
K='/tmp/claude-0/-home-claude/9739e4d7-eb48-5210-ae61-4cd82525f150/scratchpad/kfb2/media/3D_Assets/KayKit_Mystery_Series6/'
WP={'blaster':K+'UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf','rifle':K+'6 - December 2025 - Toy Soldier/gltf/ToySoldier_Rifle.gltf','minigun':K+'1 - July 2024 - Combat Mech/assets/gltf/CombatMech_Minigun.gltf'}
def m2q(m):
    t=np.trace(m)
    if t>0: s=math.sqrt(t+1)*2; q=[(m[2,1]-m[1,2])/s,(m[0,2]-m[2,0])/s,(m[1,0]-m[0,1])/s,0.25*s]
    else:
        i=int(np.argmax([m[0,0],m[1,1],m[2,2]]))
        if i==0: s=math.sqrt(1+m[0,0]-m[1,1]-m[2,2])*2; q=[0.25*s,(m[0,1]+m[1,0])/s,(m[0,2]+m[2,0])/s,(m[2,1]-m[1,2])/s]
        elif i==1: s=math.sqrt(1+m[1,1]-m[0,0]-m[2,2])*2; q=[(m[0,1]+m[1,0])/s,0.25*s,(m[1,2]+m[2,1])/s,(m[0,2]-m[2,0])/s]
        else: s=math.sqrt(1+m[2,2]-m[0,0]-m[1,1])*2; q=[(m[0,2]+m[2,0])/s,(m[1,2]+m[2,1])/s,0.25*s,(m[1,0]-m[0,1])/s]
    q=np.array(q); return q/np.linalg.norm(q)
g=GLB('/tmp/bd/hero_ranged.glb')
def W(P,n,t): return P.world(g.name2i[n],t,{})
G1=np.array([0,math.sin(math.pi/4),0,math.cos(math.pi/4)])
# G2 from Ranged_2H_Aiming hold, barrel along R->L with pitch halved
P=Pose(g,'Ranged_2H_Aiming'); t=P.t0+30/30; M=W(P,'handslot.r',t); L=W(P,'handslot.l',t)
R=M[:3,:3]; d=L[:3,3]-M[:3,3]; d/=np.linalg.norm(d)
yaw=math.atan2(d[0],d[2]); pit=math.asin(d[1]); pit2=pit*0.5
dw=np.array([math.cos(pit2)*math.sin(yaw),math.sin(pit2),math.cos(pit2)*math.cos(yaw)])
z=R.T@dw; yh=R.T@np.array([0,1,0.]); x=np.cross(yh,z); x/=np.linalg.norm(x); y=np.cross(z,x)
G2=m2q(np.stack([x,y,z],1))
print('G1',G1.round(5),'G2',G2.round(5),'yaw',round(math.degrees(yaw),2),'pitch',round(math.degrees(pit),2),'->',round(math.degrees(pit2),2))
json.dump(dict(G1=G1.tolist(),G2=G2.tolist(),aimYaw2H=math.degrees(yaw),barrelPitch2H=math.degrees(pit2)),open('/tmp/bd/grips.json','w'))
for ch,wpn,G in [('hero','blaster',G1),('soldier','rifle',G2),('mech','minigun',G2),('hero','rifle',G2),('soldier','blaster',G1)]:
    J,B=read_glb(f'/tmp/bd/{ch}_ranged.glb')
    ni=[i for i,n in enumerate(J['nodes']) if n.get('name')=='handslot.r'][0]
    append_gltf(J,B,WP[wpn],ni,'WPN_MOUNT',G)
    write_glb(J,B,f'/tmp/bd/T_{ch}_{wpn}.glb')
print('ok')
