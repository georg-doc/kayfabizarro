# inject a weapon .gltf (external bin + images) into a character .glb under a joint node, via a mount node with rotation
import json,struct,os,base64,numpy as np
def read_glb(p):
    b=open(p,'rb').read(); o=12; J=B=None
    while o<len(b):
        L,T=struct.unpack_from('<II',b,o); c=b[o+8:o+8+L]; o+=8+L
        if T==0x4E4F534A: J=json.loads(c)
        elif T==0x004E4942: B=bytearray(c)
    return J,B
def write_glb(J,B,p):
    while len(B)%4: B+=b'\x00'
    J['buffers']=[{'byteLength':len(B)}]
    js=json.dumps(J,separators=(',',':')).encode()
    while len(js)%4: js+=b' '
    out=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(B))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(B),0x004E4942)+bytes(B)
    open(p,'wb').write(out)
def pad(B):
    while len(B)%4: B+=b'\x00'
def append_gltf(J,B,gp,parent_node,mount_name,mount_rot,mount_t=(0,0,0),extra_nodes=None):
    W=json.load(open(gp)); d=os.path.dirname(gp)
    wb=open(os.path.join(d,W['buffers'][0]['uri']),'rb').read() if W['buffers'][0].get('uri') and not W['buffers'][0]['uri'].startswith('data:') else base64.b64decode(W['buffers'][0]['uri'].split(',')[1])
    pad(B); off=len(B); B+=wb
    bv0=len(J.setdefault('bufferViews',[]))
    for bv in W['bufferViews']:
        bv=dict(bv); bv['buffer']=0; bv['byteOffset']=bv.get('byteOffset',0)+off; J['bufferViews'].append(bv)
    acc0=len(J.setdefault('accessors',[]))
    for a in W['accessors']:
        a=dict(a); a['bufferView']+=bv0; J['accessors'].append(a)
    img0=len(J.setdefault('images',[]))
    for im in W.get('images',[]):
        im=dict(im)
        if 'uri' in im:
            data=open(os.path.join(d,im['uri']),'rb').read(); pad(B); o2=len(B); B+=data
            J['bufferViews'].append({'buffer':0,'byteOffset':o2,'byteLength':len(data)})
            im={'bufferView':len(J['bufferViews'])-1,'mimeType':'image/png','name':im.get('name',im['uri'])}
        else: im['bufferView']+=bv0
        J['images'].append(im)
    smp0=len(J.setdefault('samplers',[])); J['samplers']+=W.get('samplers',[])
    tex0=len(J.setdefault('textures',[]))
    for t in W.get('textures',[]):
        t=dict(t); t['source']+=img0
        if 'sampler' in t: t['sampler']+=smp0
        J['textures'].append(t)
    mat0=len(J.setdefault('materials',[]))
    for m in W.get('materials',[]):
        m=json.loads(json.dumps(m))
        def fix(o):
            if isinstance(o,dict):
                for k,v in o.items():
                    if k.endswith('Texture') and isinstance(v,dict) and 'index' in v: v['index']+=tex0
                    else: fix(v)
        fix(m); J['materials'].append(m)
    mesh0=len(J.setdefault('meshes',[]))
    for me in W['meshes']:
        me=json.loads(json.dumps(me))
        for pr in me['primitives']:
            pr['attributes']={k:v+acc0 for k,v in pr['attributes'].items()}
            if 'indices' in pr: pr['indices']+=acc0
            if 'material' in pr: pr['material']+=mat0
        J['meshes'].append(me)
    node0=len(J['nodes'])
    for n in W['nodes']:
        n=json.loads(json.dumps(n))
        if 'mesh' in n: n['mesh']+=mesh0
        if 'children' in n: n['children']=[c+node0 for c in n['children']]
        J['nodes'].append(n)
    roots=W['scenes'][W.get('scene',0)]['nodes']
    mount={'name':mount_name,'rotation':list(map(float,mount_rot)),'translation':list(map(float,mount_t)),'children':[r+node0 for r in roots]}
    J['nodes'].append(mount); mi=len(J['nodes'])-1
    J['nodes'][parent_node].setdefault('children',[]).append(mi)
    for en in (extra_nodes or []):
        J['nodes'].append(en); J['nodes'][mi]['children'].append(len(J['nodes'])-1)
    return mi
def append_glb(J,B,glb_path,*a,**k):
    W,wb=read_glb(glb_path); import tempfile
    W['buffers']=[{'byteLength':len(wb),'uri':'data:application/octet-stream;base64,'+base64.b64encode(bytes(wb)).decode()}]
    p=tempfile.mktemp(suffix='.gltf'); json.dump(W,open(p,'w')); return append_gltf(J,B,p,*a,**k)
