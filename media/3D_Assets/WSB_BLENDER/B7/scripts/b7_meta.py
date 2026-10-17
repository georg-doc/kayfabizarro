# WSB B7 · LOD1 aus der umgefärbten Fassung + Bühnenrand (kfb.stage-edges/1-Eintrag) headless.
# footprint = konvexe Hülle der Geometrie bis 0,5 m über dem Boden (Näherung, vereinfacht); edgePalette = Basisfarbe auf Flächen 0–0,5 m über dem Boden
# im 1-m-Saum der Hülle, k-means k = 5 in OKLab, Anteile ≥ 4 % (Methode wie WS0 Bühnen-Ränder R1).
# Usage: blender -b --factory-startup --python b7_meta.py -- <A_v2.glb> <outdir> <scale_m_per_u>
import bpy, bmesh, sys, json, colorsys
import numpy as np
src, outdir, S = sys.argv[sys.argv.index('--') + 1:][:3]; S = float(S)
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=src)
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; me = ob.data; Mw = ob.matrix_world
img = [n.image for n in ob.active_material.node_tree.nodes if n.type == 'TEX_IMAGE' and n.outputs[0].links and 'Base' in n.outputs[0].links[0].to_socket.name][0]
W, H = img.size; px = np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4)[..., :3]; uvl = me.uv_layers.active.data
lim = 0.5 / S
co = np.array([list(Mw @ v.co) for v in me.vertices]); low = co[co[:, 2] < lim][:, :2]            # Blender xy = glTF x, -z
def hull(P):
    P = sorted(set(map(tuple, np.round(P, 4)))); cr = lambda o, a, b: (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); lo, up = [], []
    for p in P:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(P):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]
hb = hull(low); fp = [[round(p[0], 4), round(-p[1], 4)] for p in hb]                                 # glTF xz
fpA = 0.5 * abs(sum(fp[i][0] * fp[i - 1][1] - fp[i - 1][0] * fp[i][1] for i in range(len(fp))))
def dseg(p, a, b):
    a, b, p = np.array(a), np.array(b), np.array(p); t = np.clip(np.dot(p - a, b - a) / max(1e-12, np.dot(b - a, b - a)), 0, 1); return np.linalg.norm(p - (a + t * (b - a)))
samp = []
for poly in me.polygons:
    c = Mw @ poly.center
    if c.z > lim: continue
    q = (c.x, -c.y); d = min(dseg(q, fp[i - 1], fp[i]) for i in range(len(fp)))
    if d * S > 1.0: continue
    u = sum((uvl[i].uv for i in poly.loop_indices), type(uvl[0].uv)((0, 0))) / poly.loop_total
    samp.append(px[min(H - 1, int((u.y % 1) * H)), min(W - 1, int((u.x % 1) * W))])
samp = np.array(samp)
def oklab(rgb):
    l = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929], [0.2119034982, 0.6806995451, 0.1073969566], [0.0883024619, 0.2817188376, 0.6299787005]])
    M2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468], [1.9779984951, -2.4285922050, 0.4505937099], [0.0259040371, 0.7827717662, -0.8086757660]])
    return np.cbrt(l @ M1.T) @ M2.T
lab = oklab(np.clip(samp, 0, 1)); keep = (lab[:, 0] > 0.28) & (lab[:, 0] < 0.97); lab, rgb = lab[keep], samp[keep]
rng = np.random.default_rng(5); C = lab[rng.choice(len(lab), 5, replace=False)]
for _ in range(40): a = np.argmin(((lab[:, None] - C[None]) ** 2).sum(-1), 1); C = np.array([lab[a == k].mean(0) if (a == k).any() else C[k] for k in range(5)])
pal = []
for k in range(5):
    m = a == k; sh = m.mean() * 100
    if sh >= 4: pal.append({'hex': '#' + ''.join(f'{int(round(v * 255)):02x}' for v in np.median(rgb[m], 0)), 'share': round(float(sh), 1)})
pal.sort(key=lambda x: -x['share'])
edges = {'stage': 'jungle_computer', 'glb': 'MeshyModels/_browser/jungle_computer/JungleComputer_A_screen.v1.glb (WSB B7)', 'units': 'GLB model units (u); Y up, front +Z',
         'scale_m_per_u': S, 'groundY_u': 0.0, 'bottomY_u': 0.0,
         'footprint': {'space': f'xz in u: convex hull of geometry 0–0,5 m above ground (approximation; WS0 method uses the slab section)', 'winding': 'counter-clockwise seen from above',
                       'points': fp, 'count': len(fp), 'area_m2': round(fpA * S * S, 1)},
         'edgePalette': pal, 'edgePaletteMethod': f'base colour on faces 0–0,5 m above ground within 1 m of the footprint edge ({len(rgb)} samples), k-means k=5 in OKLab, near-black/white dropped, shares >=4%',
         'terrainMode': 'ground'}
# LOD1 (≤ 25 k) aus der umgefärbten Fassung, Texturen 1024
m = ob.modifiers.new('dec', 'DECIMATE'); m.decimate_type = 'COLLAPSE'; me.calc_loop_triangles(); m.ratio = 25000 / len(me.loop_triangles)
bpy.context.view_layer.objects.active = ob; bpy.ops.object.modifier_apply(modifier='dec')
for im in bpy.data.images:
    if im.size[0] > 1024: im.scale(1024, 1024)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=f'{outdir}/JungleComputer_LOD1.v2.glb', export_format='GLB', export_image_format='WEBP', export_image_quality=86, export_yup=True, use_selection=True, export_materials='EXPORT', export_animations=False)
me.calc_loop_triangles(); edges['lod1Tris'] = len(me.loop_triangles)
json.dump(edges, open(f'{outdir}/data/b7_stage_edges.json', 'w'), indent=1); print('META_OK', json.dumps({k: edges[k] for k in ('edgePalette', 'lod1Tris')}), 'footprint', len(fp), edges['footprint']['area_m2'])
