#!/usr/bin/env python3
"""KFB · Insel-Paletten R1 · surface area per material (WS0 ISLAND_PALETTES_R1, 18.10.2026).
Reads the 8 private B27 GLBs (read only) and writes area_shares.r1.json: per island and material kfb_role_<role>_<tone>
the share of world-space surface area (all / downward faces n_y < -0.3 = underside / upward faces n_y > 0.7 = top).
Face COUNTS in the B27 report are inflated by the bevel; area is the honest weight for "how much of the picture is this role".
Usage: python3 island_area_shares.py"""
import json, struct, collections, os
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '../../../50_BLENDER/B27/_privat_kauf_asset'))
IDS = ['01_Port', '02_River', '03_Backyard', '04_Beach', '05_PirateCave', '06_Iceland', '07_PondLand', '08_Forest']
CT = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8}; NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
def quat(q):
    x, y, z, w = q
    return np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])
def local(n):
    if 'matrix' in n: return np.array(n['matrix']).reshape(4, 4).T
    M = np.eye(4); M[:3, :3] = quat(n.get('rotation', [0, 0, 0, 1])) @ np.diag(n.get('scale', [1, 1, 1])); M[:3, 3] = n.get('translation', [0, 0, 0]); return M
out = {'schema': 'kfb.island-area-shares/1', 'note': 'world-space area shares per material; down = n_y < -0.3, up = n_y > 0.7', 'islands': {}}
for nm in IDS:
    f = open(os.path.join(SRC, f'KFB_Island_{nm}.r1.glb'), 'rb').read()
    ln = struct.unpack('<I', f[12:16])[0]; j = json.loads(f[20:20+ln]); bo = 20 + ln; bl = struct.unpack('<I', f[bo:bo+4])[0]; B = f[bo+8:bo+8+bl]
    def acc(i):
        a = j['accessors'][i]; v = j['bufferViews'][a['bufferView']]; off = v.get('byteOffset', 0) + a.get('byteOffset', 0); n = NC[a['type']]
        arr = np.frombuffer(B, dtype=CT[a['componentType']], count=a['count']*n, offset=off); return arr.reshape(-1, n) if n > 1 else arr
    mats = [m['name'] for m in j['materials']]; area, down, up = collections.Counter(), collections.Counter(), collections.Counter()
    def walk(i, P):
        n = j['nodes'][i]; M = P @ local(n)
        if 'mesh' in n:
            for p in j['meshes'][n['mesh']]['primitives']:
                pos = acc(p['attributes']['POSITION']).astype(np.float64); idx = acc(p['indices']).reshape(-1, 3)
                w = (np.c_[pos, np.ones(len(pos))] @ M.T)[:, :3]; a, b, c = w[idx[:, 0]], w[idx[:, 1]], w[idx[:, 2]]
                cr = np.cross(b - a, c - a); ar = 0.5 * np.linalg.norm(cr, axis=1); ny = cr[:, 1] / (2 * ar + 1e-12); m = mats[p['material']]
                area[m] += ar.sum(); down[m] += ar[ny < -0.3].sum(); up[m] += ar[ny > 0.7].sum()
        for ch in n.get('children', []): walk(ch, M)
    for r in j['scenes'][0]['nodes']: walk(r, np.eye(4))
    norm = lambda d: {k: round(v / sum(d.values()), 4) for k, v in sorted(d.items(), key=lambda x: -x[1])}
    out['islands'][nm] = {'all': norm(area), 'down': norm(down), 'up': norm(up)}
    print(nm, 'underside:', list(out['islands'][nm]['down'].items())[:2], 'top:', list(out['islands'][nm]['up'].items())[:2])
json.dump(out, open(os.path.join(HERE, 'area_shares.r1.json'), 'w'), indent=1)
