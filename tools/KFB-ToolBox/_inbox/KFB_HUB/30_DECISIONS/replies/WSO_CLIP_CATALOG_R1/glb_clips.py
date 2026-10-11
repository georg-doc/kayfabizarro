import sys, json, struct, math, os

def read_glb(path):
    with open(path,'rb') as f: data=f.read()
    magic,ver,length=struct.unpack_from('<III',data,0)
    assert magic==0x46546C67, 'not glb'
    off=12; js=None; bin_=None
    while off<length:
        clen,ctype=struct.unpack_from('<II',data,off); off+=8
        chunk=data[off:off+clen]; off+=clen
        if ctype==0x4E4F534A: js=json.loads(chunk.decode('utf-8'))
        elif ctype==0x004E4942: bin_=chunk
    return js,bin_

CT={5120:('b',1),5121:('B',1),5122:('h',2),5123:('H',2),5125:('I',4),5126:('f',4)}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def accessor(js,bin_,idx):
    a=js['accessors'][idx]; bv=js['bufferViews'][a['bufferView']]
    fmt,sz=CT[a['componentType']]; n=NC[a['type']]; cnt=a['count']
    base=bv.get('byteOffset',0)+a.get('byteOffset',0)
    stride=bv.get('byteStride',sz*n)
    out=[]
    for i in range(cnt):
        o=base+i*stride
        v=struct.unpack_from('<'+fmt*n,bin_,o)
        if a.get('normalized') and fmt!='f':
            m={'b':127,'B':255,'h':32767,'H':65535}[fmt]
            v=tuple(max(x/m,-1.0) for x in v)
        out.append(v if n>1 else v[0])
    return out

def qangle(q1,q2):
    d=abs(sum(a*b for a,b in zip(q1,q2)))
    d=min(1.0,max(-1.0,d))
    return math.degrees(2*math.acos(d))

def vdist(a,b): return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def analyze(path):
    js,bin_=read_glb(path)
    nodes=js.get('nodes',[])
    names=[n.get('name',f'node{i}') for i,n in enumerate(nodes)]
    res={'file':path,'nodes':names,'animations':[]}
    for an in js.get('animations',[]):
        dur=0.0; chans=[]
        for ch in an['channels']:
            sm=an['samplers'][ch['sampler']]
            t=accessor(js,bin_,sm['input']); v=accessor(js,bin_,sm['output'])
            path_=ch['target']['path']; node=names[ch['target']['node']]
            if sm.get('interpolation')=='CUBICSPLINE': v=v[1::3]
            dur=max(dur,t[-1] if t else 0)
            if not v: continue
            if path_=='rotation':
                var=max(qangle(v[0],x) for x in v); endgap=qangle(v[0],v[-1])
            elif path_ in ('translation','scale'):
                var=max(vdist(v[0],x) for x in v); endgap=vdist(v[0],v[-1])
            else:
                var=0; endgap=0
            chans.append({'node':node,'path':path_,'keys':len(t),'var':var,'endgap':endgap,
                          'first':v[0],'last':v[-1]})
        res['animations'].append({'name':an.get('name'),'duration':round(dur,4),'channels':chans})
    return res

if __name__=='__main__':
    out=[analyze(p) for p in sys.argv[1:]]
    json.dump(out,sys.stdout)
