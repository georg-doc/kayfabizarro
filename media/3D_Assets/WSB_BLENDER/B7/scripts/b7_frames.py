# WSB B7 · Rahmen A (Stein) und B (Holz) vor dem Monitor + kfb_screen_slot + Augen-Anker, headless (kein Live-Export).
# Eingaben: Browser-GLB, Raster-Messung (Glas/Linse, glTF-Raum u). Ausgabe: zwei Screen-GLBs + Rahmen-Maße als JSON.
# Usage: blender -b --factory-startup --python b7_frames.py -- <A.glb> <grid_measure.json> <outdir>
import bpy, bmesh, sys, json, math, random
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
src, measf, outdir, idlepng = sys.argv[sys.argv.index('--') + 1:][:4]
M = json.load(open(measf)); G, L = M['glass'], M['lens']
CARD = 1.793                                                    # Kartenformat (Viertelseite quer, wie Portal-Ruine)
B = lambda x, y, z: Vector((x, -z, y))                          # glTF (x, y oben, z vorn) → Blender
random.seed(7)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=src)
    ob = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; ob.name = 'JungleComputer'
    bm = bmesh.new(); bm.from_mesh(ob.data); bm.transform(ob.matrix_world); return ob, BVHTree.FromBMesh(bm)
def mat(name, hexc, rough=0.9):
    m = bpy.data.materials.new(name); m.use_nodes = True; c = tuple(int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5))
    p = m.node_tree.nodes['Principled BSDF']; p.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1); p.inputs['Roughness'].default_value = rough; p.inputs['Metallic'].default_value = 0; return m
def box(name, cx, cy, cz, sx, sy, sz, m, bevel=0.012, seg=4, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=B(cx, cy, cz)); o = bpy.context.object; o.name = name; o.scale = (sx, sz, sy)
    o.rotation_euler = (math.radians(rot[0]), math.radians(rot[2]), math.radians(rot[1])); bpy.ops.object.transform_apply(scale=True, rotation=True)
    if bevel: bv = o.modifiers.new('bev', 'BEVEL'); bv.width = bevel; bv.segments = seg; bv.limit_method = 'ANGLE'
    o.data.materials.append(m); return o
def apply_all(o):
    bpy.context.view_layer.objects.active = o
    for md in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
def clay_wobble(o, amt, scale):   # sanft gekneteter Rand (V-369: keine harten Kanten)
    sub = o.modifiers.new('sub', 'SUBSURF'); sub.levels = 1; sub.render_levels = 1
    tx = bpy.data.textures.new(o.name + '_n', 'CLOUDS'); tx.noise_scale = scale; d = o.modifiers.new('wob', 'DISPLACE'); d.texture = tx; d.strength = amt; d.mid_level = 0.5
def carve(o, cuts):               # Risse/Fugen als weiche V-Kerben (Boolean mit dünnen Keilen)
    for (cx, cy, cz, sx, sy, sz, rz) in cuts:
        bpy.ops.mesh.primitive_cube_add(size=1, location=B(cx, cy, cz)); k = bpy.context.object; k.scale = (sx, sz, sy); k.rotation_euler = (0, math.radians(rz), 0)
        bo = o.modifiers.new('cut', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.object = k; bo.solver = 'EXACT'
        bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier=bo.name); bpy.data.objects.remove(k)
def empty(name, p, n):
    e = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(e); e.location = B(*p)
    nb = B(*n).normalized(); e.rotation_euler = nb.to_track_quat('-Y', 'Z').to_euler(); e.empty_display_size = 0.05; return e   # glTF-lokal +Z = außen, +Y = oben (wie EYE-CLEANUP-01)
def slot(name, cx, cy, cz, w, h):
    bpy.ops.mesh.primitive_plane_add(size=1, location=B(cx, cy, cz)); o = bpy.context.object; o.name = name; o.scale = (w, h, 1)
    o.rotation_euler = (math.radians(90), 0, 0); bpy.ops.object.transform_apply(scale=True, rotation=True)
    m = bpy.data.materials.new('kfb_screen_slot'); m.use_nodes = True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.01, 0.015, 0.03, 1); o.data.materials.append(m); return o

def build(variant):
    ob, bvh = reset()
    gx0, gx1, gy0, gy1, gz = G['x'][0], G['x'][1], G['y'][0], G['y'][1], G['zMed']
    gw, gh, cx, cy = gx1 - gx0, gy1 - gy0, (gx0 + gx1) / 2, (gy0 + gy1) / 2
    # Vorderkante des Gehäuses rund ums Glas messen → Rahmen sitzt davor
    zs = []
    for t in [i / 15 for i in range(16)]:
        for (x, y) in ((gx0 - 0.04 + t * (gw + 0.08), gy1 + 0.035), (gx0 - 0.04 + t * (gw + 0.08), gy0 - 0.035), (gx0 - 0.035, gy0 + t * gh), (gx1 + 0.035, gy0 + t * gh)):
            h = bvh.ray_cast(B(x, y, 2), B(0, 0, -1));
            if h[0] is not None: zs.append(-h[0].y)
    bezelZ = sorted(zs)[int(len(zs) * 0.8)] if zs else gz + 0.04
    cw, ch = gw, gw / CARD                                         # Kartenöffnung: volle Glasbreite, Höhe nach Kartenformat
    occ = []                                                       # vorderstes Stück Geometrie in der Kartenfläche (Liane auf dem Glas) → Karte davor
    for i in range(25):
        for j in range(15):
            h = bvh.ray_cast(B(cx - cw / 2 + cw * i / 24, cy - ch / 2 + ch * j / 14, 2), B(0, 0, -1))
            if h[0] is not None: occ.append(-h[0].y)
    bezelZ = max(bezelZ, max(occ) if occ else bezelZ)
    fz = bezelZ + 0.012; parts = []
    if variant == 'A':
        st = mat('kfb_screen_frame_stone', '#C9B796')              # Gehäuse-Stein (gemessen im Bild: helles Sandstein-Beige)
        b, d = 0.05, 0.05                                          # Rahmenbreite, Tiefe (u)
        ow, oh = gw + 2 * b, gh + 2 * b
        top = box('frame_top', cx, gy1 + b / 2, fz, ow, b, d, st); bot = box('frame_bottom', cx, gy0 - b / 2, fz, ow, b, d, st)
        lef = box('frame_left', gx0 - b / 2, cy, fz, b, gh, d, st); rig = box('frame_right', gx1 + b / 2, cy, fz, b, gh, d, st)
        bar = (gh - ch) / 2                                        # zwei Längsbalken füllen das Glas bis zum Kartenformat
        bt = box('bar_top', cx, gy1 - bar / 2, fz - 0.006, gw + 0.01, bar + 0.006, d * 0.8, st); bb = box('bar_bottom', cx, gy0 + bar / 2, fz - 0.006, gw + 0.01, bar + 0.006, d * 0.8, st)
        parts = [top, bot, lef, rig, bt, bb]
        for o in parts: apply_all(o)
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts: o.select_set(True)
        bpy.context.view_layer.objects.active = top; bpy.ops.object.join(); fr = top; fr.name = 'kfb_screen_frame'
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=0.002); bpy.ops.object.mode_set(mode='OBJECT')
        cuts = [(gx0 - 0.02, gy1 + 0.03, fz + d / 2, 0.006, 0.07, 0.03, 25), (gx1 + 0.03, gy0 + 0.05, fz + d / 2, 0.006, 0.09, 0.03, -15), (cx + 0.08, gy0 - 0.03, fz + d / 2, 0.005, 0.06, 0.03, 70),
                (cx - 0.12, gy1 + 0.02, fz + d / 2, 0.005, 0.05, 0.03, -40), (cx, gy1 - bar / 2, fz + d / 2, 0.004, 0.5 * bar, 0.03, 0),          # Fuge in der Balkenmitte
                (gx0 + 0.11, gy0 + bar / 2, fz + d / 2, 0.004, 0.6 * bar, 0.03, 0), (gx1 - 0.09, gy1 - bar / 2, fz + d / 2, 0.004, 0.6 * bar, 0.03, 10)]
        carve(fr, cuts); clay_wobble(fr, 0.004, 0.06); apply_all(fr)
        story = 'Ein Steinmetz der Anhänger hat dem Bildschirm eine Fassung aus demselben Stein gehauen; zwei Querbalken engen das Glas auf das Format der heiligen Karte ein. Risse und Fugen: alt, oft repariert.'
    else:
        wd = mat('kfb_screen_frame_wood', '#8A5634', 0.85); rp = mat('kfb_rope', '#CDB27A', 0.95)
        t, over = 0.045, 0.07                                      # Balkenstärke, Überstand an den Enden (u)
        ox0, ox1, oy0, oy1 = cx - cw / 2 - t / 2, cx + cw / 2 + t / 2, cy - ch / 2 - t / 2, cy + ch / 2 + t / 2
        BL = ox1 - ox0 + 2 * over; Hh = oy1 - oy0 + 2 * over
        hz, vz = fz + t * 0.55, fz                                  # waagerechte Balken liegen vorn auf den senkrechten (gezimmert)
        beams = [box('beam_top', cx + 0.006, oy1, hz, BL, t, t, wd, 0.016, 5, (0, 0, 1.6)), box('beam_bottom', cx - 0.004, oy0, hz, BL * 0.97, t, t, wd, 0.016, 5, (0, 0, -1.2)),
                 box('beam_left', ox0, cy, vz, t, Hh, t, wd, 0.016, 5, (0, 0, -1.0)), box('beam_right', ox1, cy + 0.004, vz, t, Hh * 1.03, t, wd, 0.016, 5, (0, 0, 1.4))]
        for o in beams: clay_wobble(o, 0.003, 0.05); apply_all(o)
        ropes = []
        for (x, y) in ((ox0, oy0), (ox0, oy1), (ox1, oy0), (ox1, oy1)):   # Seil-Bindung: 3 Wicklungen diagonal über die Kreuzung
            for k in range(3):
                bpy.ops.mesh.primitive_torus_add(major_radius=t * 0.95, minor_radius=0.0065, major_segments=40, minor_segments=10, location=B(x + (k - 1) * 0.011, y + (k - 1) * 0.011, fz + t * 0.3))
                r = bpy.context.object; r.rotation_euler = (math.radians(90), math.radians(45), math.radians(90)); r.scale = (1, 1, 1.25); bpy.ops.object.transform_apply(rotation=True, scale=True); r.data.materials.append(rp); ropes.append(r)
        bpy.ops.object.select_all(action='DESELECT')
        for o in beams + ropes: o.select_set(True)
        bpy.context.view_layer.objects.active = beams[0]; bpy.ops.object.join(); fr = beams[0]; fr.name = 'kfb_screen_frame'
        story = 'Die Anhänger haben der heiligen Karte einen Halter gezimmert: vier Balken aus dem Holz der Dschungelbäume, überstehend, mit Lianen-Seil gebunden, vor den alten Bildschirm gestellt.'
    # Ruhezustand ohne Billboard (Georg 17.10.): sauberes Motiv aus dem Original als flache Fläche knapp vor der gewölbten Glasmitte
    hc = bvh.ray_cast(B(cx, cy, 2), B(0, 0, -1)); glassFront = -hc[0].y if hc[0] is not None else gz
    bpy.ops.mesh.primitive_plane_add(size=1, location=B(cx, cy, glassFront + 0.002)); idl = bpy.context.object; idl.name = 'kfb_screen_idle'; idl.scale = (gw, gh, 1)
    idl.rotation_euler = (math.radians(90), 0, 0); bpy.ops.object.transform_apply(scale=True, rotation=True)
    mi = bpy.data.materials.new('kfb_screen_idle'); mi.use_nodes = True; nt = mi.node_tree; tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = bpy.data.images.load(idlepng)
    nt.links.new(tn.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color']); nt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.35; idl.data.materials.append(mi)
    sl = slot('kfb_screen_slot', cx, cy, bezelZ + (0.004 if variant == 'A' else 0.006), cw * (1.0 if variant == 'A' else 1.0), ch)
    # Augen-Anker (nur setzen; gerendert wird mit Augen erst mit Figurenkarte V-391): Zyklop = rote Linse, frontal (keine Außen-Normalen, V-201)
    lc = L['center']; empty('KFB_Eye_C_anchor', (lc[0], lc[1], lc[2] + 0.005), (0, 0, 1)).scale = (L['radius_u'],) * 3
    mk = (-0.0175, 0.9278, -0.0668)                                # Alternative: Steinmaske über dem Monitor, zwei Glyphen-Augen
    for side, dx in (('L', 0.048), ('R', -0.048)): empty(f'KFB_Eye_{side}_anchor_mask_alt', (mk[0] + dx, mk[1] + 0.012, mk[2] + 0.03), (0, 0, 1)).scale = (0.026,) * 3
    bpy.ops.object.select_all(action='SELECT')
    out = f'{outdir}/JungleComputer_{variant}_screen.v1.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='WEBP', export_image_quality=86, export_yup=True, use_selection=True, export_materials='EXPORT', export_animations=False)
    fr.data.calc_loop_triangles()
    return {'variant': variant, 'file': out, 'story': story, 'glassFrontZ_u': round(glassFront, 4), 'bezelFrontZ_u': round(bezelZ, 4), 'frameFrontZ_u': round(fz, 4), 'frameTris': len(fr.data.loop_triangles),
            'cardOpening_u': {'center': [round(cx, 4), round(cy, 4), round(sl.location.y * -1, 4)], 'width': round(cw, 4), 'height': round(ch, 4), 'aspect': CARD},
            'glass_u': {'x': G['x'], 'y': G['y'], 'z': round(gz, 4), 'aspect': round(gw / gh, 3)}}
res = [build('A'), build('B')]
json.dump(res, open(f'{outdir}/b7_frames.json', 'w'), indent=1); print('FRAMES_OK', json.dumps([{k: r[k] for k in ('variant', 'frameTris', 'bezelFrontZ_u', 'cardOpening_u')} for r in res]))
