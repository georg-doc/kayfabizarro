import sys,json,struct,numpy as np
sys.path.insert(0,'/tmp/loco/work')
from gl import *
def read(path):
    b=open(path,'rb').read(); o=12; J=None; B=None
    while o<len(b):
        L,T=struct.unpack_from('<II',b,o); c=b[o+8:o+8+L]; o+=8+L
        if T==0x4E4F534A: J=json.loads(c)
        elif T==0x004E4942: B=bytearray(c)
    return J,B
def write(J,B,path):
    J['buffers'][0]['byteLength']=len(B)
    js=json.dumps(J).encode()
    while len(js)%4: js+=b' '
    while len(B)%4: B.append(0)
    open(path,'wb').write(struct.pack('<III',0x46546C67,2,28+len(js)+len(B))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(B),0x004E4942)+bytes(B))
def add_anim(J,B,name,node_tracks,fps=30):
    """node_tracks: {(nodeIndex,'rotation'|'translation'): array(N,4|3)}"""
    def add(arr,typ,mm=False):
        while len(B)%4: B.append(0)
        off=len(B); d=np.asarray(arr,np.float32).tobytes(); B.extend(d)
        J['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':len(d)})
        a={'bufferView':len(J['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':typ}
        if mm: a['min']=[float(np.min(arr))]; a['max']=[float(np.max(arr))]
        J['accessors'].append(a); return len(J['accessors'])-1
    N=len(next(iter(node_tracks.values())))
    ti=add(np.arange(N,dtype=np.float32)[:,None]/fps,'SCALAR',True)
    an={'name':name,'channels':[],'samplers':[]}
    for (ni,path),data in node_tracks.items():
        an['samplers'].append({'input':ti,'output':add(data,'VEC4' if path=='rotation' else 'VEC3'),'interpolation':'LINEAR'})
        an['channels'].append({'sampler':len(an['samplers'])-1,'target':{'node':ni,'path':path}})
    J.setdefault('animations',[]).append(an)
