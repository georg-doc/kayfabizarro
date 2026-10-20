# CANON_3D/lib (WSB K3, 2026-10-20): Kopie von MeshyModels/_blender_run_r2/scripts/glbedit.py (Original unverändert dort). Einzige Änderung: Import ohne festen Pfad.
"""WS0 Blender Run R1 - minimal glTF/GLB editor that keeps everything it is not told to change.

Usage:
    E = GLBEdit(path)
    E.add_accessor(arr, ...) -> index   (new data, appended)
    E.j[...]                            (edit JSON directly: nodes, meshes, materials, skins)
    E.set_image_bytes(i, data, mime)
    E.write(out)  -> repacks: only referenced accessors/bufferViews/images are written, order preserved.
"""
import json, struct
import numpy as np
try: from .gltfio import read_glb, acc, bview   # CANON_3D/lib als Paket
except ImportError: from gltfio import read_glb, acc, bview   # lib-Ordner auf sys.path

NP_CT = {np.dtype(np.float32): 5126, np.dtype(np.uint8): 5121, np.dtype(np.uint16): 5123,
         np.dtype(np.uint32): 5125, np.dtype(np.int8): 5120, np.dtype(np.int16): 5122}
TYP = {1: 'SCALAR', 2: 'VEC2', 3: 'VEC3', 4: 'VEC4', 16: 'MAT4'}


class GLBEdit:
    def __init__(self, path):
        self.j, self.bin = read_glb(path)
        self.j = json.loads(json.dumps(self.j))
        # bufferView payloads (bytes) by index; new ones appended
        self.views = [bview(self.j, self.bin, i) for i in range(len(self.j.get('bufferViews', [])))]

    def get(self, i):
        return acc(self.j, self.bin_for_read(), i)

    def bin_for_read(self):
        return self.bin

    def add_view(self, data, target=None, stride=None):
        bv = {'buffer': 0, 'byteOffset': 0, 'byteLength': len(data)}
        if target: bv['target'] = target
        if stride: bv['byteStride'] = stride
        self.j['bufferViews'].append(bv); self.views.append(bytes(data))
        return len(self.j['bufferViews']) - 1

    def add_accessor(self, arr, target=None, minmax=False, normalized=False):
        arr = np.ascontiguousarray(arr)
        if arr.ndim == 1: arr = arr[:, None]
        v = self.add_view(arr.tobytes(), target)
        a = {'bufferView': v, 'componentType': NP_CT[arr.dtype], 'count': int(arr.shape[0]), 'type': TYP[arr.shape[1]]}
        if normalized: a['normalized'] = True
        if minmax:
            a['min'] = [float(x) for x in arr.min(0)]; a['max'] = [float(x) for x in arr.max(0)]
        self.j['accessors'].append(a)
        return len(self.j['accessors']) - 1

    def set_image_bytes(self, i, data, mime=None):
        im = self.j['images'][i]
        im['bufferView'] = self.add_view(data)
        if mime: im['mimeType'] = mime

    # ------------------------------------------------------------------ repack
    def _refs(self):
        J = self.j; acc_used = set()
        for m in J.get('meshes', []):
            for p in m['primitives']:
                acc_used.update(p['attributes'].values())
                if 'indices' in p: acc_used.add(p['indices'])
                for t in p.get('targets', []): acc_used.update(t.values())
        for s in J.get('skins', []):
            if 'inverseBindMatrices' in s: acc_used.add(s['inverseBindMatrices'])
        for a in J.get('animations', []):
            for sm in a['samplers']: acc_used.add(sm['input']); acc_used.add(sm['output'])
        return acc_used

    def write(self, path, generator_note=None):
        J = self.j
        used = sorted(self._refs())
        amap = {o: n for n, o in enumerate(used)}
        new_acc = [J['accessors'][o] for o in used]
        view_used = sorted({a['bufferView'] for a in new_acc if 'bufferView' in a} |
                           {im['bufferView'] for im in J.get('images', []) if 'bufferView' in im})
        vmap = {o: n for n, o in enumerate(view_used)}
        binb = bytearray(); new_views = []
        for o in view_used:
            while len(binb) % 4: binb.append(0)
            bv = dict(J['bufferViews'][o]); bv['byteOffset'] = len(binb); bv['buffer'] = 0
            data = self.views[o]; bv['byteLength'] = len(data); binb += data; new_views.append(bv)
        while len(binb) % 4: binb.append(0)
        for a in new_acc:
            if 'bufferView' in a: a['bufferView'] = vmap[a['bufferView']]
        for im in J.get('images', []):
            if 'bufferView' in im: im['bufferView'] = vmap[im['bufferView']]
        for m in J.get('meshes', []):
            for p in m['primitives']:
                p['attributes'] = {k: amap[v] for k, v in p['attributes'].items()}
                if 'indices' in p: p['indices'] = amap[p['indices']]
                if 'targets' in p: p['targets'] = [{k: amap[v] for k, v in t.items()} for t in p['targets']]
        for s in J.get('skins', []):
            if 'inverseBindMatrices' in s: s['inverseBindMatrices'] = amap[s['inverseBindMatrices']]
        for an in J.get('animations', []):
            for sm in an['samplers']: sm['input'] = amap[sm['input']]; sm['output'] = amap[sm['output']]
        J['accessors'] = new_acc; J['bufferViews'] = new_views
        J['buffers'] = [{'byteLength': len(binb)}]
        if generator_note:
            J.setdefault('asset', {})['generator'] = generator_note
        js = json.dumps(J, separators=(',', ':')).encode()
        js += b' ' * ((4 - len(js) % 4) % 4)
        total = 12 + 8 + len(js) + 8 + len(binb)
        with open(path, 'wb') as f:
            f.write(struct.pack('<III', 0x46546C67, 2, total))
            f.write(struct.pack('<II', len(js), 0x4E4F534A)); f.write(js)
            f.write(struct.pack('<II', len(binb), 0x004E4942)); f.write(binb)
        # reload state from the written file so further edits stay consistent
        self.__init__(path)
