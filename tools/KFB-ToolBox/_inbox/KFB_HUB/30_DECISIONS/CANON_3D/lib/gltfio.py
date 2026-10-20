# CANON_3D/lib (WSB K3, 2026-10-20): unveränderte Kopie von MeshyModels/_blender_run_r2/scripts/gltfio.py (Original bleibt dort).
import json,struct,numpy as np
CT={5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32,5126:np.float32}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def read_glb(p):
    b=open(p,'rb').read(); assert b[:4]==b'glTF'
    off=12; js=None; bin_=b''
    while off<len(b):
        l,t=struct.unpack('<II',b[off:off+8]); c=b[off+8:off+8+l]
        if t==0x4E4F534A: js=json.loads(c)
        elif t==0x004E4942: bin_=c
        off+=8+l
    return js,bin_
def acc(g,binb,i):
    a=g['accessors'][i]; dt=CT[a['componentType']]; n=NC[a['type']]; cnt=a['count']
    if 'bufferView' not in a: return np.zeros((cnt,n),dt)
    bv=g['bufferViews'][a['bufferView']]; base=bv.get('byteOffset',0)+a.get('byteOffset',0)
    isz=np.dtype(dt).itemsize; stride=bv.get('byteStride',isz*n)
    if stride==isz*n:
        arr=np.frombuffer(binb,dt,cnt*n,base).reshape(cnt,n)
    else:
        raw=np.frombuffer(binb,np.uint8,stride*(cnt-1)+isz*n,base)
        arr=np.stack([np.frombuffer(raw[k*stride:k*stride+isz*n].tobytes(),dt) for k in range(cnt)])
    return arr.copy()
def bview(g,binb,i):
    bv=g['bufferViews'][i]; o=bv.get('byteOffset',0); return binb[o:o+bv['byteLength']]
def trs(n):
    M=np.eye(4)
    if 'matrix' in n: return np.array(n['matrix']).reshape(4,4).T
    t=n.get('translation',[0,0,0]); r=n.get('rotation',[0,0,0,1]); s=n.get('scale',[1,1,1])
    x,y,z,w=r
    R=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
    M[:3,:3]=R*np.array(s)[None,:]; M[:3,3]=t; return M
def worlds(g):
    N=g['nodes']; par={}
    for i,n in enumerate(N):
        for c in n.get('children',[]): par[c]=i
    W={}
    def w(i):
        if i in W: return W[i]
        M=trs(N[i]); 
        if i in par: M=w(par[i])@M
        W[i]=M; return M
    for i in range(len(N)): w(i)
    return W,par
def idx(g,name):
    for i,n in enumerate(g['nodes']):
        if n.get('name')==name: return i
    raise KeyError(name)
