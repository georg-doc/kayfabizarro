import json, struct, numpy as np
CT={5126:np.float32,5123:np.uint16,5125:np.uint32,5121:np.uint8,5122:np.int16,5120:np.int8}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
class GLB:
    def __init__(s,path):
        b=open(path,'rb').read(); assert b[:4]==b'glTF'
        o=12; s.json=None; s.bin=None
        while o<len(b):
            L,T=struct.unpack_from('<II',b,o); c=b[o+8:o+8+L]; o+=8+L
            if T==0x4E4F534A: s.json=json.loads(c)
            elif T==0x004E4942: s.bin=c
        j=s.json; s.nodes=j['nodes']
        s.parent={}
        for i,n in enumerate(s.nodes):
            for c in n.get('children',[]): s.parent[c]=i
        s.name2i={n.get('name'):i for i,n in enumerate(s.nodes)}
        s.anims={a.get('name'):a for a in j.get('animations',[])}
    def acc(s,i):
        a=s.json['accessors'][i]; bv=s.json['bufferViews'][a['bufferView']]
        dt=CT[a['componentType']]; n=NC[a['type']]; off=bv.get('byteOffset',0)+a.get('byteOffset',0)
        stride=bv.get('byteStride')
        cnt=a['count']; isz=np.dtype(dt).itemsize*n
        if stride and stride!=isz:
            arr=np.stack([np.frombuffer(s.bin,dtype=dt,count=n,offset=off+k*stride) for k in range(cnt)])
        else:
            arr=np.frombuffer(s.bin,dtype=dt,count=cnt*n,offset=off).reshape(cnt,n)
        arr=arr.astype(np.float64)
        if a.get('normalized'):
            if dt==np.int16: arr=np.maximum(arr/32767,-1)
            elif dt==np.uint16: arr=arr/65535
            elif dt==np.int8: arr=np.maximum(arr/127,-1)
            elif dt==np.uint8: arr=arr/255
        return arr
    def channels(s,name):
        a=s.anims[name]; out={}; tmax=0; tmin=1e9
        for ch in a['channels']:
            sm=a['samplers'][ch['sampler']]; t=s.acc(sm['input'])[:,0]; v=s.acc(sm['output'])
            interp=sm.get('interpolation','LINEAR')
            if interp=='CUBICSPLINE': v=v.reshape(len(t),3,-1)[:,1,:]
            out[(ch['target']['node'],ch['target']['path'])]=(t,v,interp)
            tmax=max(tmax,t[-1]); tmin=min(tmin,t[0])
        s.tmin=tmin
        return out,tmax
def qnorm(q): return q/np.linalg.norm(q,axis=-1,keepdims=True)
def slerp(a,b,u):
    d=np.dot(a,b)
    if d<0: b=-b; d=-d
    if d>0.9995: r=a+u*(b-a); return r/np.linalg.norm(r)
    th=np.arccos(d); return (np.sin((1-u)*th)*a+np.sin(u*th)*b)/np.sin(th)
def sample(ch,t,path):
    tt,v,interp=ch
    if t<=tt[0]: return v[0]
    if t>=tt[-1]: return v[-1]
    k=np.searchsorted(tt,t)-1; u=(t-tt[k])/(tt[k+1]-tt[k])
    if interp=='STEP': return v[k]
    if path=='rotation': return slerp(qnorm(v[k]),qnorm(v[k+1]),u)
    return v[k]*(1-u)+v[k+1]*u
def qmat(q):
    x,y,z,w=q
    return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
def trs(t,r,s):
    M=np.eye(4); M[:3,:3]=qmat(r)*np.array(s); M[:3,3]=t; return M
class Pose:
    def __init__(s,g,name,fps=30):
        s.g=g; s.ch,Tmax=g.channels(name); s.fps=fps
        s.t0=g.tmin; s.T=Tmax-s.t0   # clip length from first to last key
        s.frames=int(round(s.T*fps))+1
    def local(s,i,t):
        n=s.g.nodes[i]
        T=np.array(n.get('translation',[0,0,0]),float); R=np.array(n.get('rotation',[0,0,0,1]),float); S=np.array(n.get('scale',[1,1,1]),float)
        if 'matrix' in n: return np.array(n['matrix']).reshape(4,4).T
        if (i,'translation') in s.ch: T=sample(s.ch[(i,'translation')],t,'translation')
        if (i,'rotation') in s.ch: R=sample(s.ch[(i,'rotation')],t,'rotation')
        if (i,'scale') in s.ch: S=sample(s.ch[(i,'scale')],t,'scale')
        return trs(T,qnorm(np.array(R)),S)
    def world(s,i,t,cache):
        if i in cache: return cache[i]
        M=s.local(i,t)
        if i in s.g.parent: M=s.world(s.g.parent[i],t,cache)@M
        cache[i]=M; return M
    def track(s,names):
        idx=[s.g.name2i[n] for n in names]
        out={n:np.zeros((s.frames,3)) for n in names}; rots={n:[] for n in names}
        for f in range(s.frames):
            t=s.t0+min(f/s.fps,s.T); c={}
            for n,i in zip(names,idx):
                M=s.world(i,t,c); out[n][f]=M[:3,3]
        return out
    def localrots(s,names,t):
        res={}
        for n in names:
            i=s.g.name2i[n]; R=s.g.nodes[i].get('rotation',[0,0,0,1])
            if (i,'rotation') in s.ch: R=sample(s.ch[(i,'rotation')],t,'rotation')
            res[n]=qnorm(np.array(R,float))
        return res
