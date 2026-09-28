import json, struct, numpy as np
from mathutils import Matrix, Quaternion, Vector
CT={5126:np.float32,5123:np.uint16,5125:np.uint32,5121:np.uint8}
NC={'SCALAR':1,'VEC3':3,'VEC4':4,'MAT4':16}
def load(path):
    d=open(path,'rb').read(); off=12; J=B=None
    while off<len(d):
        ln,ty=struct.unpack_from('<II',d,off); ch=d[off+8:off+8+ln]
        if ty==0x4E4F534A: J=json.loads(ch)
        else: B=ch
        off+=8+ln
    def acc(i):
        a=J['accessors'][i]; bv=J['bufferViews'][a['bufferView']]
        o=bv.get('byteOffset',0)+a.get('byteOffset',0); n=NC[a['type']]
        return np.frombuffer(B,dtype=CT[a['componentType']],count=a['count']*n,offset=o).reshape(a['count'],n)
    return J,acc
def clip_world(path,name,fps=30):
    J,acc=load(path); nodes=J['nodes']
    anim=next(a for a in J['animations'] if a['name']==name)
    parent={}
    for i,n in enumerate(nodes):
        for c in n.get('children',[]): parent[c]=i
    ch={}
    tmax=0
    for c in anim['channels']:
        s=anim['samplers'][c['sampler']]; t=acc(s['input'])[:,0]; v=acc(s['output'])
        ch[(c['target']['node'],c['target']['path'])]=(t,v); tmax=max(tmax,t[-1])
    nf=int(round(tmax*fps))+1
    def samp(key,time,default):
        if key not in ch: return default
        t,v=ch[key]; i=np.searchsorted(t,time)
        if i<=0: return v[0]
        if i>=len(t): return v[-1]
        a=(time-t[i-1])/(t[i]-t[i-1]) if t[i]>t[i-1] else 0
        if key[1]=='rotation':
            q0=Quaternion((v[i-1][3],*v[i-1][:3])); q1=Quaternion((v[i][3],*v[i][:3]))
            q=q0.slerp(q1,a); return np.array([q.x,q.y,q.z,q.w])
        return v[i-1]*(1-a)+v[i]*a
    C=Matrix.Rotation(1.5707963267948966,4,'X')
    out=[]
    for f in range(nf):
        time=f/fps; L={}
        for i,n in enumerate(nodes):
            tr=samp((i,'translation'),time,np.array(n.get('translation',[0,0,0])))
            r=samp((i,'rotation'),time,np.array(n.get('rotation',[0,0,0,1])))
            s=samp((i,'scale'),time,np.array(n.get('scale',[1,1,1])))
            M=Matrix.Translation(Vector(tr))@Quaternion((r[3],r[0],r[1],r[2])).to_matrix().to_4x4()@Matrix.Diagonal((*s,1))
            L[i]=M
        W={}
        def w(i):
            if i in W: return W[i]
            W[i]=(w(parent[i])@L[i]) if i in parent else L[i]; return W[i]
        out.append({nodes[i].get('name',str(i)):C@w(i) for i in range(len(nodes))})
    return out
def names(path):
    J,_=load(path); return [a['name'] for a in J['animations']]
