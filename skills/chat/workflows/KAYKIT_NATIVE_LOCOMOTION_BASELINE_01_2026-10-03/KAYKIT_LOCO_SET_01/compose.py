import sys,json,struct,numpy as np
sys.path.insert(0,'/tmp/loco/work')
from gl import *
g=GLB('SRC.glb'); FPS=30
M=json.load(open('/tmp/kn2/measure.json'))
UP={'spine','chest','head','upperarm.l','lowerarm.l','wrist.l','hand.l','upperarm.r','lowerarm.r','wrist.r','hand.r'}
bones=[g.nodes[j]['name'] for j in g.json['skins'][0]['joints']]
P={c:Pose(g,c) for c in g.anims}
lfd={c:(M.get(c,{}).get('leftFootDownPhase') or 0.0) for c in g.anims}
SEG=[ # weapon, label, legs, upper, speed
('sword','SWORD  ·  walk',  'Walking_B',None,0.98),
('sword','SWORD  ·  run',   'Running_A',None,3.303),
('sword','SWORD  ·  sprint','Running_B',None,5.255),
('pistol','PISTOL  ·  walk (arms free)','Walking_B',None,0.98),
('pistol','PISTOL  ·  run (arms free)','Running_A',None,3.303),
('pistol','PISTOL AIM  ·  walk  (upper body: Ranged_1H_Aiming)','Walking_B','Ranged_1H_Aiming',0.98),
('pistol','PISTOL AIM  ·  run  (upper body: Ranged_1H_Aiming)','Running_A','Ranged_1H_Aiming',3.303),
('rifle','RIFLE  ·  walk  (upper body: Running_HoldingRifle)','Walking_B','Running_HoldingRifle',0.98),
('rifle','RIFLE  ·  run  (upper body: Running_HoldingRifle)','Running_A','Running_HoldingRifle',3.303),
('rifle','RIFLE  ·  sprint  (native Running_HoldingRifle)','Running_HoldingRifle',None,5.255),
('rifle','RIFLE AIM  ·  walk  (upper body: Ranged_2H_Aiming)','Walking_B','Ranged_2H_Aiming',0.98),
('rifle','RIFLE AIM  ·  run  (upper body: Ranged_2H_Aiming)','Running_A','Ranged_2H_Aiming',3.303),
]
SEGLEN=2.5; NS=int(SEGLEN*FPS); N=NS*len(SEG)
rot={b:np.zeros((N,4)) for b in bones}; trn={b:np.zeros((N,3)) for b in bones}; rootT=np.zeros((N,3)); info=[]
def bT(Pk,t,bn):
    i=g.name2i[bn]; ch=Pk.ch.get((i,'translation'))
    return sample(ch,t,'translation') if ch else np.array(g.nodes[i].get('translation',[0,0,0]),float)
z=0; f=0
for si,(w,lab,legs,up,spd) in enumerate(SEG):
    ph=0.0; ut=0.0
    for k in range(NS):
        L=P[legs]; tl=L.t0+((ph+lfd.get(legs,0))%1)*L.T
        lr=L.localrots(bones,tl)
        if up:
            U=P[up]
            tu=U.t0+((ph+lfd.get(up,0))%1)*U.T if up.startswith('Running') else U.t0+(ut%U.T)
            ur=U.localrots(bones,tu)
        for b in bones:
            src,tt=(P[up],tu) if (up and b in UP) else (L,tl)
            rot[b][f]=(ur[b] if (up and b in UP) else lr[b]); trn[b][f]=bT(src,tt,b)
        z+=spd/FPS; rootT[f]=[0,0,z]
        info.append({'f':f,'seg':si,'weapon':w,'label':lab,'speed':spd})
        ph=(ph+1/(L.T*FPS))%1; ut+=1/FPS; f+=1
json.dump({'seg':SEG,'info':info},open('wpn_info.json','w'))
# --- write GLB: replace animations; add handslot nodes
b=open('SRC.glb','rb').read(); o=12; J=None; B=None
while o<len(b):
    Ln,T=struct.unpack_from('<II',b,o); cc=b[o+8:o+8+Ln]; o+=8+Ln
    if T==0x4E4F534A: J=json.loads(cc)
    elif T==0x004E4942: B=bytearray(cc)
for side,sg in (('r',1),('l',-1)):
    J['nodes'].append({'name':'handslot.'+side,'translation':[0,0.09612506628036499,-0.05750012397766113],'rotation':[0,0,sg*0.7071068286895752,0.7071067094802856]})
    h=g.name2i['hand.'+side]; J['nodes'][h].setdefault('children',[]).append(len(J['nodes'])-1)
def add(arr,typ,mm=False):
    global B
    while len(B)%4: B.append(0)
    off=len(B); d=np.asarray(arr,np.float32).tobytes(); B+=d
    J['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':len(d)})
    a={'bufferView':len(J['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':typ}
    if mm: a['min']=[float(np.min(arr))]; a['max']=[float(np.max(arr))]
    J['accessors'].append(a); return len(J['accessors'])-1
ti=add(np.arange(N,dtype=np.float32)[:,None]/FPS,'SCALAR',True)
an={'name':'WEAPON_LOCO_01','channels':[],'samplers':[]}
def ch(node,path,data,typ):
    an['samplers'].append({'input':ti,'output':add(data,typ),'interpolation':'LINEAR'})
    an['channels'].append({'sampler':len(an['samplers'])-1,'target':{'node':g.name2i[node],'path':path}})
for bn in bones:
    if bn=='root': continue
    ch(bn,'rotation',rot[bn],'VEC4'); ch(bn,'translation',trn[bn],'VEC3')
ch('root','translation',rootT,'VEC3')
J['animations']=[an]; J['buffers'][0]['byteLength']=len(B)
js=json.dumps(J).encode()
while len(js)%4: js+=b' '
while len(B)%4: B.append(0)
open('WPN.glb','wb').write(struct.pack('<III',0x46546C67,2,28+len(js)+len(B))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(B),0x004E4942)+bytes(B))
print('frames',N)
