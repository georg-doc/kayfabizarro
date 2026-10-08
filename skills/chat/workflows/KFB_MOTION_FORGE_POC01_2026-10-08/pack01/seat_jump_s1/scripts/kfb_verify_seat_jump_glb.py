import sys, json, numpy as np
from pygltflib import GLTF2
glb, dump, tpl = sys.argv[1], sys.argv[2], sys.argv[3]
g = GLTF2().load(glb); blob = g.binary_blob(); d = json.load(open(dump)); t = GLTF2().load(tpl)
def acc(i):
    a = g.accessors[i]; bv = g.bufferViews[a.bufferView]; n = {'SCALAR':1,'VEC3':3,'VEC4':4}[a.type]
    off = (bv.byteOffset or 0) + (a.byteOffset or 0)
    return np.frombuffer(blob[off:off+a.count*n*4], dtype=np.float32).reshape(a.count, n)
def q2m(q):
    x,y,z,w = q
    return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
skel = all((a.name, a.translation, a.rotation, a.scale, a.children) == (b.name, b.translation, b.rotation, b.scale, b.children) for a, b in zip(g.nodes, t.nodes)) and len(g.nodes) == len(t.nodes)
names = [n.name for n in g.nodes]; parent = {}
for i, n in enumerate(g.nodes):
    for c in (n.children or []): parent[c] = i
C = np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]], float)
rep = {'skeletonIdenticalToTemplate': skel, 'nodes': len(g.nodes), 'meshes': len(g.meshes or []), 'skins': len(g.skins or []), 'clips': {}}
for an in g.animations:
    fr = d['clips'][an.name]; n = len(fr)
    loc = {}
    for ch in an.channels:
        s = an.samplers[ch.sampler]; tin = acc(s.input)[:,0]; v = acc(s.output)
        f = np.arange(n) / 30.0
        if s.interpolation == 'STEP': vv = np.repeat(v[:1], n, 0)
        else: vv = np.stack([np.interp(f, tin, v[:,k]) for k in range(v.shape[1])], 1)
        loc.setdefault(ch.target.node, {})[ch.target.path] = vv
    # world positions of every bone (glTF space) vs dump (converted)
    def world_glb(fi):
        W = {}
        def m(i):
            if i in W: return W[i]
            L = np.eye(4); nd = g.nodes[i]; c = loc.get(i, {})
            tr = c.get('translation', [np.array(nd.translation or [0,0,0])]*n)[fi]; ro = c.get('rotation', [np.array(nd.rotation or [0,0,0,1])]*n)[fi]
            L[:3,:3] = q2m(ro); L[:3,3] = tr
            W[i] = (m(parent[i]) @ L) if i in parent else L; return W[i]
        return {names[i]: m(i)[:3,3] for i in range(len(names))}
    def world_dump(fi):
        W = {}
        def m(bn):
            if bn in W: return W[bn]
            M = np.array(fr[fi][bn]).reshape(4,4); p = d['parents'][bn]
            W[bn] = (m(p) @ M) if p else C @ M; return W[bn]
        return {bn: m(bn)[:3,3] for bn in fr[0]}
    err = 0.0
    for fi in range(n):
        a, b = world_glb(fi), world_dump(fi)
        err = max(err, max(np.linalg.norm(a[k] - b[k]) for k in b if k in a))
    dur = max(acc(an.samplers[c.sampler].input)[:,0].max() for c in an.channels)
    rep['clips'][an.name] = dict(frames=n, durationS=round(float(dur), 4), roundTripMaxCm=round(err * 100, 4))
print(json.dumps(rep, indent=1))
