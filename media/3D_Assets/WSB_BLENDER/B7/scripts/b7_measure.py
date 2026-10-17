# WSB B7 · Messung an der Browser-Fassung (headless): Bildschirm (dunkelgrüne Front-Faces), rote Linse, Steinmaske, Treppenprofil.
# Ergebnis in glTF-Koordinaten (Y oben, vorne +Z, Einheiten u). Usage: blender -b --python b7_measure.py -- <A.glb> <out.json>
import bpy, sys, json, colorsys
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
src, out = sys.argv[sys.argv.index('--') + 1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=src)
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; me = ob.data; M = ob.matrix_world
g = lambda v: [v.x, v.z, -v.y]                       # Blender → glTF
img = None
for n in ob.active_material.node_tree.nodes:
    if n.type == 'TEX_IMAGE' and n.image and 'Base' in (n.outputs[0].links[0].to_socket.name if n.outputs[0].links else ''): img = n.image
if img is None: img = [n.image for n in ob.active_material.node_tree.nodes if n.type == 'TEX_IMAGE'][0]
W, H = img.size; px = np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4)
uvl = me.uv_layers.active.data
faces = []
for p in me.polygons:
    u = sum((uvl[i].uv for i in p.loop_indices), Vector((0, 0))) / p.loop_total
    x = min(W - 1, max(0, int((u.x % 1) * W))); y = min(H - 1, max(0, int((u.y % 1) * H)))
    r, gg, b = px[y, x, :3]; h, s, v = colorsys.rgb_to_hsv(float(r), float(gg), float(b))
    c = M @ p.center; n = (M.to_3x3() @ p.normal).normalized()
    faces.append({'c': Vector(g(c)), 'n': Vector(g(n)), 'a': p.area, 'h': h * 360, 's': s, 'v': v})
def refine(sel, plane=False, rad=0.14):
    # dichteste Gruppe: Median-Zentrum, Radius-Schnitt, iterativ; optional Ebenen-Fit (Bildschirm ist eben)
    for it in range(6):
        if len(sel) < 4: break
        c = Vector(np.median(np.array([list(f['c']) for f in sel]), 0).tolist()); sel = [f for f in sel if (f['c'] - c).length < rad] or sel
        if plane:
            P = np.array([list(f['c']) for f in sel]); m = P.mean(0); _, _, vt = np.linalg.svd(P - m); nrm = Vector(vt[2].tolist()); nrm = nrm if nrm.z > 0 else -nrm
            sel = [f for f in sel if abs((f['c'] - Vector(m.tolist())).dot(nrm)) < 0.015 and f['n'].dot(nrm) > 0.85] or sel
    return sel
def cluster(sel, label):
    if not sel: return {'label': label, 'found': False}
    A = sum(f['a'] for f in sel); c = sum((f['c'] * f['a'] for f in sel), Vector()) / A; n = sum((f['n'] * f['a'] for f in sel), Vector()).normalized()
    up = Vector((0, 1, 0)); right = up.cross(n).normalized(); up2 = n.cross(right).normalized()
    xs = [ (f['c'] - c).dot(right) for f in sel ]; ys = [ (f['c'] - c).dot(up2) for f in sel ]
    xq = np.percentile(xs, [2, 98]); yq = np.percentile(ys, [2, 98])
    return {'label': label, 'found': True, 'faces': len(sel), 'area_u2': round(A, 5), 'center_u': [round(v, 4) for v in c], 'normal': [round(v, 4) for v in n],
            'right': [round(v, 4) for v in right], 'up': [round(v, 4) for v in up2], 'width_u': round(float(xq[1] - xq[0]), 4), 'height_u': round(float(yq[1] - yq[0]), 4),
            'xRange_u': [round(float(v), 4) for v in xq], 'yRange_u': [round(float(v), 4) for v in yq]}
fr = Vector((0, 0, 1))
screen = refine([f for f in faces if 90 <= f['h'] <= 175 and f['s'] > 0.35 and f['v'] < 0.32 and f['n'].dot(fr) > 0.75 and 0.5 < f['c'].y < 0.95 and abs(f['c'].x) < 0.35], plane=True, rad=0.3)
lens = refine([f for f in faces if (f['h'] < 22 or f['h'] > 340) and f['s'] > 0.6 and f['v'] > 0.4 and f['n'].dot(fr) > 0.5 and 0.35 < f['c'].x < 0.65 and 0.5 < f['c'].y < 0.85], rad=0.08)
res = {'src': src, 'screen': cluster(screen, 'screen'), 'lens': cluster(lens, 'red lens (right speaker)')}
# Steinmaske über dem Monitor: höchste Front-Faces im Mittelstreifen oberhalb des Bildschirms
if res['screen']['found']:
    top = res['screen']['center_u'][1] + res['screen']['height_u'] / 2
    mask = [f for f in faces if abs(f['c'].x) < 0.12 and f['c'].y > top + 0.03 and f['n'].dot(fr) > 0.6 and f['s'] < 0.45]
    res['mask'] = cluster(mask, 'stone mask above monitor')
# Treppenprofil: Strahlen von oben bei x = 0 entlang z (vorne)
bm = __import__('bmesh').new(); bm.from_mesh(me); bm.transform(M); bvh = BVHTree.FromBMesh(bm)
prof = []
for z in np.linspace(-0.2, 0.95, 116):
    hit = bvh.ray_cast(Vector((0.0, -float(z), 5.0)), Vector((0, 0, -1)))
    if hit[0] is not None: prof.append([round(float(z), 4), round(hit[0].z, 4)])
res['stairProfile_x0'] = prof
json.dump(res, open(out, 'w'), indent=1); print('MEASURE_OK', json.dumps({k: (v if not isinstance(v, dict) else {kk: v.get(kk) for kk in ('found', 'center_u', 'normal', 'width_u', 'height_u', 'faces')}) for k, v in res.items() if k != 'stairProfile_x0'}))
