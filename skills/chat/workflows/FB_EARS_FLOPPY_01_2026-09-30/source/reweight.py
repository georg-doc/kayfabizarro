# FB-EARS-FLOPPY-01 · re-weight the ear skin of FB_TEMPLATE_LOOK_v5.glb in place (byte patch of JOINTS_0 / WEIGHTS_0 only).
# Tent weights between bone MIDPOINTS along the rest chain: every joint rotation spreads over a whole segment -> a smooth arc.
import json, struct, numpy as np, sys
SRC='/tmp/fbe/FB_TEMPLATE_LOOK_v5.glb'; DST=sys.argv[1] if len(sys.argv)>1 else '/tmp/fbr/FB_TEMPLATE_LOOK_v5b.glb'
d=bytearray(open(SRC,'rb').read())
jl,=struct.unpack_from('<I',d,12); J=json.loads(bytes(d[20:20+jl])); BIN=20+jl+8
def acc(i):
    a=J['accessors'][i]; bv=J['bufferViews'][a['bufferView']]; o=BIN+bv.get('byteOffset',0)+a.get('byteOffset',0)
    assert 'byteStride' not in bv
    dt={5126:np.float32,5121:np.uint8,5123:np.uint16}[a['componentType']]; n={'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
    return o,dt,n,a['count']
def read(i):
    o,dt,n,c=acc(i); return np.frombuffer(bytes(d[o:o+c*n*np.dtype(dt).itemsize]),dtype=dt).reshape(c,n).copy()
def write(i,arr):
    o,dt,n,c=acc(i); b=arr.astype(dt).tobytes(); assert len(b)==c*n*np.dtype(dt).itemsize; d[o:o+len(b)]=b
sk=J['skins'][0]; names=[J['nodes'][j]['name'] for j in sk['joints']]
IBM=read(sk['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)   # column-major -> row-major
def jpos(nm): return np.linalg.inv(IBM[names.index(nm)])[:3,3]
report={}
for node in J['nodes']:
    if node.get('name') not in ('FB_Ear_L_v5','FB_Ear_R_v5'): continue
    side='l' if node['name'].endswith('L_v5') else 'r'
    prim=J['meshes'][node['mesh']]['primitives'][0]; at=prim['attributes']
    P=read(at['POSITION']); J0=read(at['JOINTS_0']); W0=read(at['WEIGHTS_0'])
    h=[jpos(f'ear.{side}.{k}') for k in (1,2,3)]; tip=h[2]+(h[2]-h[1])   # bone 3 length = bone 2 length (Blender import: 0.291 / 0.291)
    pts=[h[0],h[1],h[2],tip]; L=[np.linalg.norm(pts[i+1]-pts[i]) for i in range(3)]; cum=[0,L[0],L[0]+L[1]]
    # arc-length coordinate of the closest point on the chain polyline; below the root: negative distance along -axis
    best=np.full(len(P),1e9); s=np.zeros(len(P))
    for i in range(3):
        a,b=pts[i],pts[i+1]; ab=b-a; u=np.clip(((P-a)@ab)/(ab@ab),0,1); q=a+u[:,None]*ab; dd=np.linalg.norm(P-q,axis=1)
        m=dd<best; best[m]=dd[m]; s[m]=cum[i]+u[m]*L[i]
    below=((P-pts[0])@(pts[1]-pts[0]))<0; s[below]=-np.linalg.norm(P[below]-pts[0],axis=1)*np.abs(((P[below]-pts[0])@((pts[1]-pts[0])/L[0])))/np.maximum(1e-9,np.linalg.norm(P[below]-pts[0],axis=1))
    knots=np.array([-0.06*L[0]/0.283, L[0]/2, L[0]+L[1]/2, L[0]+L[1]+L[2]/2])   # head fully below ~6 cm under the root (scaled to bone 1)
    jn=[names.index('head')]+[names.index(f'ear.{side}.{k}') for k in (1,2,3)]
    newJ=np.zeros_like(J0); newW=np.zeros_like(W0)
    for vi,sv in enumerate(s):
        if sv<=knots[0]: jj,ww=[jn[0]],[1.0]
        elif sv>=knots[3]: jj,ww=[jn[3]],[1.0]
        else:
            k=int(np.searchsorted(knots,sv)-1); f=(sv-knots[k])/(knots[k+1]-knots[k]); f=f*f*(3-2*f)
            jj,ww=[jn[k],jn[k+1]],[1-f,f]
        for c,(a,b) in enumerate(zip(jj,ww)): newJ[vi,c]=a; newW[vi,c]=b
    before_set=set(np.unique(J0[W0>0.001])); after_set=set(np.unique(newJ[newW>0.001]))
    write(at['JOINTS_0'],newJ); write(at['WEIGHTS_0'],newW)
    report[node['name']]={'verts':int(len(P)),'jointsBefore':sorted(names[i] for i in before_set),'jointsAfter':sorted(names[i] for i in after_set),
        'knotsM':[round(float(k),4) for k in knots],'weightSumMaxDev':float(np.abs(newW.sum(1)-1).max())}
open(DST,'wb').write(bytes(d)); print(json.dumps(report,indent=1)); print('bytes',len(d))
