# WSB B7 · Georg-Tunes 17.10.: (1) Bildschirm-Ruhemotiv aus dem ORIGINAL unverzerrt abfotografieren (ortho, nur Albedo) →
# eigene flache Fläche kfb_screen_idle; (2) braune Flecken auf den oberen Stufen unter der Tastatur in den Stein-Ton der Nachbarstufen umfärben
# (nur deren UV-Inseln, Helligkeitsstruktur bleibt). Headless, kein Live-Export.
# Usage: blender -b --factory-startup --python b7_fix.py -- <orig.glb> <A.glb> <grid_measure.json> <outdir>
import bpy, bmesh, sys, json, math, colorsys
import numpy as np
from mathutils import Vector
orig, A, measf, outdir = sys.argv[sys.argv.index('--') + 1:][:4]
G = json.load(open(measf))['glass']
def log(*a): print('[FIX]', *a, flush=True)
def place(ob):   # wie b7_build_browser.py: Basis y = 0, Mitte xz = 0
    me = ob.data; co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3); Mw = np.array(ob.matrix_world); cw = co @ Mw[:3, :3].T + Mw[:3, 3]
    mn, mx = cw.min(0), cw.max(0); ob.location -= Vector(((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, mn[2])); bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
B = lambda x, y, z: Vector((x, -z, y))

# ---------- (1) Ruhemotiv aus dem Original ----------
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=orig)
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; place(ob)
sc = bpy.context.scene; sc.render.engine = 'BLENDER_WORKBENCH'; sc.display.shading.light = 'FLAT'; sc.display.shading.color_type = 'TEXTURE'
sc.view_settings.view_transform = 'Standard'
gw, gh = G['x'][1] - G['x'][0], G['y'][1] - G['y'][0]; cx, cy = (G['x'][0] + G['x'][1]) / 2, (G['y'][0] + G['y'][1]) / 2
RW = 2048; sc.render.resolution_x, sc.render.resolution_y = RW, int(round(RW * gh / gw)); sc.render.film_transparent = False
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'; cam.data.ortho_scale = gw; cam.location = B(cx, cy, 1.5); cam.rotation_euler = (math.radians(90), 0, 0)
cam.data.clip_start = 1.5 - (G['zMed'] + float(__import__('os').environ.get('B7_CLIP', '0.035'))); cam.data.clip_end = 3.0   # nur ab knapp vor dem Glas: Liane davor ist 3D und soll nicht doppelt ins Motiv
sc.render.image_settings.file_format = 'PNG'; sc.render.filepath = f'{outdir}/renders/B7_screen_idle_capture.png'; bpy.ops.render.render(write_still=True)
log('idle capture', sc.render.resolution_x, sc.render.resolution_y)

# ---------- (2) braune Stufen-Flecken umfärben (am Browser-GLB) ----------
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=A)
ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; me = ob.data; Mw = ob.matrix_world
img = [n.image for n in ob.active_material.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image and n.outputs[0].links and 'Base' in n.outputs[0].links[0].to_socket.name][0]
W, H = img.size; px = np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4).copy(); uvl = me.uv_layers.active.data
g = lambda v: (v.x, v.z, -v.y)
def tex(u): return px[min(H - 1, max(0, int((u.y % 1) * H))), min(W - 1, max(0, int((u.x % 1) * W))), :3]
brown, stone = [], []
for p in me.polygons:
    c = g(Mw @ p.center); uvs = [uvl[i].uv.copy() for i in p.loop_indices]; t = tex(sum(uvs, type(uvs[0])((0, 0))) / len(uvs))
    h, s, v = colorsys.rgb_to_hsv(*map(float, t)); n = g((Mw.to_3x3() @ p.normal).normalized())
    if abs(c[0]) < 0.2 and 0.3 < c[1] < 0.5 and c[2] > 0.0 and (n[1] > 0.5 or n[2] > 0.5):   # obere Stufen unter der Tastatur: Tritt- und Stirnflächen
        if (h * 360 < 38 or h * 360 > 350) and s > 0.3 and v < 0.7: brown.append(uvs)
        elif s < 0.32 and v > 0.45: stone.append(t)
ref = np.median(np.array(stone), 0) if stone else np.array([0.62, 0.56, 0.46]); log('brown faces', len(brown), 'stone ref', ref.round(3).tolist(), 'from', len(stone))
mask = np.zeros((H, W), bool)
for uvs in brown:   # UV-Dreiecke (Fächer) rastern
    P = np.array([[u.x * W, u.y * H] for u in uvs])
    for k in range(1, len(P) - 1):
        a, b, c = P[0], P[k], P[k + 1]; x0, y0 = np.floor(np.minimum(np.minimum(a, b), c)).astype(int) - 2; x1, y1 = np.ceil(np.maximum(np.maximum(a, b), c)).astype(int) + 2
        x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W - 1, x1), min(H - 1, y1)
        if x1 <= x0 or y1 <= y0: continue
        X, Y = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5); d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(d) < 1e-9: continue
        l1 = ((b[1] - c[1]) * (X - c[0]) + (c[0] - b[0]) * (Y - c[1])) / d; l2 = ((c[1] - a[1]) * (X - c[0]) + (a[0] - c[0]) * (Y - c[1])) / d; l3 = 1 - l1 - l2
        mask[y0:y1 + 1, x0:x1 + 1] |= (l1 > -0.02) & (l2 > -0.02) & (l3 > -0.02)
# zusätzlich: Strahlen frontal und von oben auf den Bereich unter der Tastatur; jeder getroffene rotbraune Texel (UV am Treffer) markiert seine Umgebung
from mathutils.bvhtree import BVHTree
bmx = bmesh.new(); bmx.from_mesh(me); bmx.transform(Mw); bmx.faces.ensure_lookup_table(); bvh = BVHTree.FromBMesh(bmx); uvlay = bmx.loops.layers.uv.active; hitsN = 0
for x in np.linspace(-0.16, 0.16, 90):
    for y in np.linspace(0.31, 0.47, 64):
        for o, d in ((B(x, y, 2), B(0, 0, -1)), (B(x, 2, y - 0.45), B(0, -1, 0))):
            h = bvh.ray_cast(o, d)
            if h[0] is None: continue
            f = bmx.faces[h[2]]; L3 = list(f.loops)[:3]; P = [l.vert.co for l in L3]
            from mathutils.geometry import barycentric_transform
            uv = barycentric_transform(h[0], P[0], P[1], P[2], *[Vector((l[uvlay].uv.x, l[uvlay].uv.y, 0)) for l in L3])
            ux, uy = int((uv.x % 1) * W), int((uv.y % 1) * H); t = px[min(H - 1, uy), min(W - 1, ux), :3]; hh, ss, vv = colorsys.rgb_to_hsv(*map(float, t))
            if (hh * 360 < 32 or hh * 360 > 350) and ss > 0.33 and vv < 0.75: mask[max(0, uy - 7):uy + 8, max(0, ux - 7):ux + 8] = True; hitsN += 1
log('ray hits brown', hitsN)
rgb = px[..., :3]; sel = mask & (np.abs(rgb - rgb.mean(-1, keepdims=True)).max(-1) > 0.04)   # nur farbige (braune) Texel, Fugen/Moos bleiben
lum = rgb[sel].mean(-1, keepdims=True); m = max(float(lum.mean()), 1e-3)   # Helligkeit auf Stein-Niveau heben, Struktur relativ behalten
rgb[sel] = np.clip(ref * (0.75 + 0.25 * lum / m) * 0.9 + rgb[sel] * 0.1, 0, 1); px[..., :3] = rgb
log('recoloured texels', int(sel.sum()))
# neue Bild-Datenbank statt das eingebettete Bild zu ändern (der Exporter schrieb sonst die alten Daten), direkt ans Material gehängt
ni = bpy.data.images.new('basecolor_fixed', W, H, alpha=False); ni.colorspace_settings.name = img.colorspace_settings.name; ni.pixels.foreach_set(px.ravel())
ni.filepath_raw = f'{outdir}/data/basecolor_fixed.png'; ni.file_format = 'PNG'; ni.save(); ni.pack()
for n in ob.active_material.node_tree.nodes:
    if n.type == 'TEX_IMAGE' and n.image == img: n.image = ni
chk = np.array(ni.pixels[:], dtype=np.float32).reshape(H, W, 4)[..., :3]; log('check changed vs original', int((np.abs(chk - np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4)[..., :3]).max(-1) > 0.05).sum()))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=f'{outdir}/JungleComputer_A_browser.v2.glb', export_format='GLB', export_image_format='WEBP', export_image_quality=86, export_yup=True, use_selection=True, export_materials='EXPORT', export_animations=False)
json.dump({'brownFaces': len(brown), 'stoneRef': ref.round(4).tolist(), 'recolouredTexels': int(sel.sum()), 'idle': {'file': 'renders/B7_screen_idle_capture.png', 'glass_u': G}}, open(f'{outdir}/data/b7_fix.json', 'w'), indent=1)
log('FIX_OK')
