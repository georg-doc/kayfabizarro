import sys,json,struct,numpy as np
sys.path.insert(0,'/tmp/loco/work')
from gl import *
SRC='/tmp/kn2/KAYKIT_NATIVE_BASELINE_01_Mannequin_Medium.glb'
g=GLB(SRC); M=json.load(open('/tmp/kn2/measure.json'))
FPS=30
# world scale of root parent
p0=Pose(g,'Idle_A'); c={}
ri=g.name2i['root']; par=g.parent.get(ri)
S=np.linalg.norm(p0.world(par,p0.t0,c)[:3,0]) if par is not None else 1.0
print('scale',S)
clips={'idle':'Idle_A','walk':'Walking_B','run':'Running_A','sprint':'Running_B'}
P={k:Pose(g,v) for k,v in clips.items()}
lfd={k:(M[v].get('leftFootDownPhase') or 0.0) for k,v in clips.items()}
spd={'walk':0.98,'run':3.303,'sprint':5.255}
keys=[(0,0),(1.0,0),(2.0,0.98),(4.0,0.98),(6.0,3.303),(8.0,3.303),(9.0,5.255),(11.0,5.255),(12.5,0.98),(14.0,0.98),(15.0,0),(16.5,0)]
kt=np.array([k[0] for k in keys]); kv=np.array([k[1] for k in keys])
N=int(keys[-1][0]*FPS)+1
bones=[n['name'] for n in g.nodes if n.get('name') in {g.nodes[j]['name'] for j in g.json['skins'][0]['joints']}]
def weights(s):
    if s<=spd['walk']: u=s/spd['walk']; return {'idle':1-u,'walk':u}
    if s<=spd['run']: u=(s-spd['walk'])/(spd['run']-spd['walk']); return {'walk':1-u,'run':u}
    u=(s-spd['run'])/(spd['sprint']-spd['run']); return {'run':1-u,'sprint':u}
phase=0.0; z=0.0; idle_t=0.0
rot={b:np.zeros((N,4)) for b in bones}; trn={b:np.zeros((N,3)) for b in bones}; hipT=np.zeros((N,3)); rootT=np.zeros((N,3)); info=[]
loc={k:(lambda P_:None) for k in P}
def boneT(Pk,t,bn):
    i=g.name2i[bn]; ch=Pk.ch.get((i,'translation'))
    return sample(ch,t,'translation') if ch else np.array(g.nodes[i].get('translation',[0,0,0]))
for f in range(N):
    t=f/FPS; s=float(np.interp(t,kt,kv)); w=weights(s)
    # phase rate from active locomotion clips
    loco=[k for k in w if k!='idle']
    tot=sum(w[k] for k in loco)
    if tot>0:
        rate=sum(w[k]/P[k].T for k in loco)/tot
        phase=(phase+rate/FPS)%1.0
    idle_t=(idle_t+1/FPS)%P['idle'].T
    acc_r={}; acc_t={b:np.zeros(3) for b in bones}
    order=sorted(w,key=lambda k:-w[k])
    for b in bones: acc_r[b]=None
    wsum=0
    for k in order:
        if w[k]<=1e-6: continue
        tk=P[k].t0+(idle_t if k=='idle' else ((phase+lfd[k])%1.0)*P[k].T)
        lr=P[k].localrots(bones,tk)
        for b in bones:
            if acc_r[b] is None: acc_r[b]=lr[b]
            else: acc_r[b]=slerp(acc_r[b],lr[b],w[k]/(wsum+w[k]))
        for b in bones: acc_t[b]=acc_t[b]*(wsum/(wsum+w[k]))+boneT(P[k],tk,b)*(w[k]/(wsum+w[k]))
        wsum+=w[k]
    for b in bones: rot[b][f]=acc_r[b]; trn[b][f]=acc_t[b]
    z+=s/FPS/S; rootT[f]=[0,0,z]
    info.append({'f':f,'t':round(t,3),'speed':round(s,3),'w':{k:round(v,2) for k,v in w.items() if v>0.005}})
json.dump(info,open('ramp_info.json','w'))
# ---- append animation to glb
b=open(SRC,'rb').read(); o=12; J=None; B=None
while o<len(b):
    L,T=struct.unpack_from('<II',b,o); cc=b[o+8:o+8+L]; o+=8+L
    if T==0x4E4F534A: J=json.loads(cc)
    elif T==0x004E4942: B=bytearray(cc)
def add(arr,typ,mm=False):
    global B
    while len(B)%4: B.append(0)
    off=len(B); data=np.asarray(arr,np.float32).tobytes(); B+=data
    J['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':len(data)})
    a={'bufferView':len(J['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':typ}
    if mm: a['min']=[float(np.min(arr))]; a['max']=[float(np.max(arr))]
    J['accessors'].append(a); return len(J['accessors'])-1
ti=add(np.arange(N,dtype=np.float32)[:,None]/FPS,'SCALAR',True)
an={'name':'RAMP_Idle_Walk_Run_Sprint','channels':[],'samplers':[]}
def ch(node,path,data,typ):
    an['samplers'].append({'input':ti,'output':add(data,typ),'interpolation':'LINEAR'})
    an['channels'].append({'sampler':len(an['samplers'])-1,'target':{'node':g.name2i[node],'path':path}})
for bn in bones:
    if bn in ('root',): continue
    ch(bn,'rotation',rot[bn],'VEC4')
for bn in bones:
    if bn!='root': ch(bn,'translation',trn[bn],'VEC3')
ch('root','translation',rootT,'VEC3')
J['animations']=[an]
J['buffers'][0]['byteLength']=len(B)
js=json.dumps(J).encode(); 
while len(js)%4: js+=b' '
while len(B)%4: B.append(0)
out=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(B))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(B),0x004E4942)+bytes(B)
open('RAMP.glb','wb').write(out); print('frames',N,'z_end',z)
