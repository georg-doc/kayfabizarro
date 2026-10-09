# Write one glb: KayKit mannequin (rig) + selected animations from library / KayKit glbs, retargeted by node name (same skeleton).
import json, struct, numpy as np, sys
sys.path.insert(0,'/tmp/loco/work')
from gl import GLB
def pad4(b,ch=b'\x00'): return b+ch*((4-len(b)%4)%4)
def merge(base_path, clips, out_path):
    base=GLB(base_path); J=json.loads(json.dumps(base.json)); BIN=bytearray(base.bin)
    J['animations']=[]  # drop base animations, re-add only requested
    name2i={n.get('name'):i for i,n in enumerate(J['nodes'])}
    J.setdefault('bufferViews',[]); J.setdefault('accessors',[])
    def add_acc(arr,typ):
        nonlocal BIN
        arr=np.ascontiguousarray(arr,dtype=np.float32)
        off=len(BIN); BIN+=arr.tobytes(); BIN=bytearray(pad4(bytes(BIN)))
        J['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':arr.nbytes})
        acc={'bufferView':len(J['bufferViews'])-1,'componentType':5126,'count':int(arr.shape[0]),'type':typ}
        if typ=='SCALAR': acc['min']=[float(arr.min())]; acc['max']=[float(arr.max())]
        J['accessors'].append(acc); return len(J['accessors'])-1
    for newname,src_path,clip in clips:
        g=GLB(src_path); a=g.anims[clip]; ch_out=[]; sm_out=[]
        for ch in a['channels']:
            nn=g.nodes[ch['target']['node']].get('name')
            if nn not in name2i: continue
            sm=a['samplers'][ch['sampler']]
            t=g.acc(sm['input']); v=g.acc(sm['output'])
            ti=add_acc(t[:,0],'SCALAR'); vi=add_acc(v,{3:'VEC3',4:'VEC4'}[v.shape[1]])
            sm_out.append({'input':ti,'output':vi,'interpolation':sm.get('interpolation','LINEAR')})
            ch_out.append({'sampler':len(sm_out)-1,'target':{'node':name2i[nn],'path':ch['target']['path']}})
        J['animations'].append({'name':newname,'channels':ch_out,'samplers':sm_out})
    J['buffers']=[{'byteLength':len(BIN)}]
    js=pad4(json.dumps(J,separators=(',',':')).encode(),b' ')
    out=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(BIN))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(BIN),0x004E4942)+bytes(BIN)
    open(out_path,'wb').write(out); return out_path
