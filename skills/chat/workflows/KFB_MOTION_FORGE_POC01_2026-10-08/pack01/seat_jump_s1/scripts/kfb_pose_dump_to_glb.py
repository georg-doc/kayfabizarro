"""Build a skeleton-only KFB motion GLB from a Blender pose dump (no glTF export in live Blender).
Skeleton nodes are copied byte-for-byte from a template GLB of the same rig (Blender glTF I/O export).
Mapping verified against that template: bone node local = parent-bone-relative pose matrix (Blender),
root bone = C @ M with C the Z-up -> Y-up basis change."""
import sys, json, numpy as np
from pygltflib import GLTF2, Scene, Node, Animation, AnimationChannel, AnimationChannelTarget, AnimationSampler, Accessor, BufferView, Buffer, Asset
tpl, dump, dst, clips = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
FPS = 30.0
g = GLTF2().load(tpl); d = json.load(open(dump))
C = np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]], float)
def m2q(R):
    t = np.trace(R)
    if t > 0:
        s = np.sqrt(t + 1) * 2; w = .25 * s; x = (R[2,1]-R[1,2])/s; y = (R[0,2]-R[2,0])/s; z = (R[1,0]-R[0,1])/s
    elif R[0,0] > R[1,1] and R[0,0] > R[2,2]:
        s = np.sqrt(1 + R[0,0] - R[1,1] - R[2,2]) * 2; w = (R[2,1]-R[1,2])/s; x = .25*s; y = (R[0,1]+R[1,0])/s; z = (R[0,2]+R[2,0])/s
    elif R[1,1] > R[2,2]:
        s = np.sqrt(1 + R[1,1] - R[0,0] - R[2,2]) * 2; w = (R[0,2]-R[2,0])/s; x = (R[0,1]+R[1,0])/s; y = .25*s; z = (R[1,2]+R[2,1])/s
    else:
        s = np.sqrt(1 + R[2,2] - R[0,0] - R[1,1]) * 2; w = (R[1,0]-R[0,1])/s; x = (R[0,2]+R[2,0])/s; y = (R[1,2]+R[2,1])/s; z = .25*s
    q = np.array([x,y,z,w]); return q / np.linalg.norm(q)
out = GLTF2(); out.asset = Asset(generator='KFB forge pose-dump -> GLB (pygltflib); skeleton copied from Blender glTF I/O template', version='2.0')
out.nodes = [Node(name=n.name, translation=n.translation, rotation=n.rotation, scale=n.scale, matrix=n.matrix, children=n.children) for n in g.nodes]
blob = bytearray()
def add(arr, typ, mx=False):
    arr = np.ascontiguousarray(arr, dtype=np.float32)
    while len(blob) % 4: blob.append(0)
    off = len(blob); blob.extend(arr.tobytes())
    out.bufferViews.append(BufferView(buffer=0, byteOffset=off, byteLength=arr.nbytes))
    a = Accessor(bufferView=len(out.bufferViews)-1, componentType=5126, count=arr.shape[0], type=typ)
    if mx: a.max = [float(arr.max())]; a.min = [float(arr.min())]
    out.accessors.append(a); return len(out.accessors)-1
idx = {n.name: i for i, n in enumerate(g.nodes)}
for cid in clips:
    frames = d['clips'][cid]; n = len(frames)
    an = Animation(name=cid, channels=[], samplers=[])
    t_full = add(np.arange(n, dtype=np.float32).reshape(-1,1) / FPS, 'SCALAR', True)
    t_step = add(np.array([[0.0], [(n-1)/FPS]], np.float32), 'SCALAR', True)
    for bn in frames[0]:
        if bn not in idx: continue
        T_, R_, S_ = [], [], []
        for fr in frames:
            M = np.array(fr[bn]).reshape(4,4)
            if d['parents'][bn] is None: M = C @ M
            S = np.linalg.norm(M[:3,:3], axis=0); R = M[:3,:3] / S
            T_.append(M[:3,3]); S_.append(S); q = m2q(R)
            if R_ and np.dot(R_[-1], q) < 0: q = -q
            R_.append(q)
        for path, vals, typ in (('translation', np.array(T_), 'VEC3'), ('rotation', np.array(R_), 'VEC4'), ('scale', np.array(S_), 'VEC3')):
            const = np.abs(vals - vals[0]).max() < 1e-6
            if const:
                si = AnimationSampler(input=t_step, output=add(np.vstack([vals[0], vals[0]]), typ), interpolation='STEP')
            else:
                si = AnimationSampler(input=t_full, output=add(vals, typ), interpolation='LINEAR')
            an.samplers.append(si)
            an.channels.append(AnimationChannel(sampler=len(an.samplers)-1, target=AnimationChannelTarget(node=idx[bn], path=path)))
    out.animations.append(an)
out.scenes = [Scene(nodes=[0])]; out.scene = 0
out.buffers = [Buffer(byteLength=len(blob))]; out.set_binary_blob(bytes(blob)); out.save_binary(dst)
print(dst, len(out.nodes), [a.name for a in out.animations], len(blob))
