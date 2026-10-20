# Test kfb_edge_bpy (K8, WS0 20.10.): (1) Kachelfeld-Ecke → free_end (Pfad-Auflösung), (2) freistehende Wand → built_end am einen, ruin_end am anderen Ende.
#   Prüft: es entstehen Stücke/Kappen/Rubbel, jedes erzeugte Objekt trägt kfb_kind/kfb_role/kfb_layer/kfb_story/kfb_edge, Quellen sind nur ausgeblendet
#   (kfb_edge_replaced, Mesh unverändert), Rubbel-Nester regelkonform (nest_ok), gleicher Seed → gleiches Ergebnis (Fingerabdruck).
#   Optional Bilder je Fall: Kachelfeld frei, Mauerende gebaut, Wandende als Ruine (Licht kfb_light_bpy MESA day, Knet-Gelände).
# Usage: blender -b --factory-startup --python test/bpy_edge_cases.py -- [out_dir_für_bilder]
import sys, os, math, json, hashlib, bpy
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'lib'))
import kfb_edge_bpy as E, kfb_clay_bpy as clay, kfb_light_bpy as light
HUB = os.path.normpath(os.path.join(HERE, '..', '..', '..')); CL = os.path.dirname(HUB)
TILE = os.path.join(HUB, '50_BLENDER', 'K6', 'out', 'KFB_Graveyard_floor_dirt.k6.glb')
WALL = os.path.join(CL, 'Frizzlebob fractal almanac BRIEFING anchor v2', '3D TableDiorama KFB + PET Editor + PDF VIewer', '3D ASSETS', 'GLB_graveyard', 'stone-wall.glb')
OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv and len(sys.argv) > sys.argv.index('--') + 1 else None
PAL = clay.load_palette({'ground': '#8b68c7', 'earth': '#7b5bb8'}); fails = []
def imp(path, loc, rz=0.0, scale=1.0):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]; ms = [o for o in new if o.type == 'MESH']
    for o in ms:
        o.parent = None; o.matrix_world = Matrix.Translation(loc) @ Matrix.Rotation(math.radians(rz), 4, 'Z') @ Matrix.Scale(scale, 4)
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o, do_unlink=True)
    return ms[0]
def fingerprint(names): return hashlib.sha1(json.dumps(sorted((n, [round(c, 4) for c in bpy.data.objects[n].matrix_world.translation]) for n in names)).encode()).hexdigest()[:12]
def check_props(names, what):
    for n in names:
        o = bpy.data.objects[n]; miss = [k for k in ('kfb_kind', 'kfb_role', 'kfb_layer', 'kfb_story', 'kfb_edge') if k not in o.keys()]
        if miss: fails.append(f'{what}: {n} ohne {miss}')
def terrain(name, x0, x1, y0, y1, step, zf, role, earth_f=None):
    nx, ny = int((x1 - x0) / step), int((y1 - y0) / step); H = [[zf(x0 + i * step, y0 + j * step) for i in range(nx + 1)] for j in range(ny + 1)]
    me = bpy.data.meshes.new(name); me.from_pydata([(x0 + i * step, y0 + j * step, H[j][i]) for j in range(ny + 1) for i in range(nx + 1)], [],
                                                   [(j * (nx + 1) + i, j * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i) for j in range(ny) for i in range(nx)])
    me.update(); ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    clay.apply(ob, role, PAL, source='own', seed='edge_test_' + name, profile='midground'); ob['kfb_ground'] = 'terrain'
    if earth_f:   # Erde als Auflage mit glatter Kontur (Schnitt je Quad am Feldwert)
        F = [[earth_f(x0 + i * step, y0 + j * step) for i in range(nx + 1)] for j in range(ny + 1)]; bv, bf = [], []
        for j in range(ny):
            for i in range(nx):
                c = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if max(F[jj][ii] for ii, jj in c) <= 0: continue
                pts = [(x0 + ii * step, y0 + jj * step, H[jj][ii], F[jj][ii]) for ii, jj in c]; poly = []
                for k in range(4):
                    a, b = pts[k], pts[(k + 1) % 4]
                    if a[3] > 0: poly.append(a)
                    if (a[3] > 0) != (b[3] > 0): t = a[3] / (a[3] - b[3]); poly.append(tuple(a[q] + (b[q] - a[q]) * t for q in range(4)))
                if len(poly) >= 3: base = len(bv); bv += [(px, py, pz + 0.003) for px, py, pz, _ in poly]; bf.append(tuple(range(base, base + len(poly))))
        if bf:
            m2 = bpy.data.meshes.new(name + '_erde'); m2.from_pydata(bv, [], bf); m2.update(); o2 = bpy.data.objects.new(m2.name, m2); bpy.context.scene.collection.objects.link(o2)
            for p in m2.polygons: p.use_smooth = True
            clay.apply(o2, 'earth', PAL, source='own', seed='edge_test_erde', profile='midground')
    return ob
def render(path, tgt, v, dist, ang=34):
    sc = bpy.context.scene; cam = sc.camera
    if cam is None:
        cd = bpy.data.cameras.new('c'); cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.data.angle_y = math.radians(ang); cam.data.sensor_fit = 'VERTICAL'; v = Vector(v).normalized(); cam.location = Vector(tgt) + v * dist
    cam.rotation_euler = (Vector(tgt) - cam.location).to_track_quat('-Z', 'Y').to_euler(); sc.render.resolution_x, sc.render.resolution_y = 1600, 1100
    sc.render.engine = 'BLENDER_EEVEE'; sc.render.filepath = path; bpy.ops.render.render(write_still=True); print('BILD', path)
# ---------------------------------------------------------------- (1) Kachelfeld-Ecke: 3 × 3 Platten, Ecke vorn rechts fehlt (L-Form)
def case_tiles(seed):
    bpy.ops.wm.read_factory_settings(use_empty=True); E._SLAB.clear(); tiles = []
    for i in range(3):
        for j in range(3):
            if (i, j) == (2, 0): continue
            t = imp(TILE, Vector((i * 4.0, j * 4.0, 0.0))); t.name = f'platte_{i}{j}'; t['kfb_palette_role'] = 'earth'; tiles.append(t)
    src_hash = hashlib.sha1(bytes(str([tuple(round(c, 5) for c in v.co) for v in tiles[0].data.vertices]), 'utf8')).hexdigest()[:12]
    rep = E.free_end(tiles, seed=seed, strength=lambda x, y: 1.3 if x > 6 else 1.0)
    return tiles, rep, src_hash
tiles, rep, h0 = case_tiles('test_feld')
print('FREE_END', json.dumps({k: v for k, v in rep.items() if k not in ('objects', 'field', 'params', 'replaced')}), 'umriss_stuecke', rep['field'].nseg)
if rep['field'].D(6.0, 8.0) > 0.05: fails.append(f"free_end: Feld meldet innere Fuge als Rand (D {rep['field'].D(6.0, 8.0):.2f})")
if rep['pieces'] < 20: fails.append(f"free_end: nur {rep['pieces']} Stücke")
if rep['tiles_cut'] < 4: fails.append(f"free_end: nur {rep['tiles_cut']} Randplatten geschnitten")
check_props(rep['objects'], 'free_end')
for t in tiles:
    if t.name in rep['replaced'] and (t.get('kfb_edge_replaced') != 'free_end' or not t.hide_render): fails.append(f'{t.name}: Quelle nicht sauber ersetzt')
h1 = hashlib.sha1(bytes(str([tuple(round(c, 5) for c in v.co) for v in tiles[0].data.vertices]), 'utf8')).hexdigest()[:12]
if h0 != h1: fails.append('free_end hat die Kit-Platte verändert')
fp1 = fingerprint(rep['objects']); field = rep['field']
if OUT:
    terrain('gelaende', -5, 15, -5, 13, 0.08, lambda x, y: field.ground_level(x, y, base=-0.02 + 0.03 * math.sin(x * 1.3) * math.sin(y * 1.1)), 'ground', field.earth)
    light.setup(bpy.context.scene, mood_set='mesa', mood='day', ground='#8b68c7', background='#96bede')
    render(os.path.join(OUT, 'K8_kachelfeld_frei.png'), (8.5, 1.5, 0), (0.55, -1.0, 0.85), 15.0)
_, rep2, _ = case_tiles('test_feld'); fp2 = fingerprint(rep2['objects'])
if fp1 != fp2: fails.append(f'free_end nicht deterministisch ({fp1} ≠ {fp2})')
print('DETERMINISMUS', fp1, fp2)
# ---------------------------------------------------------------- (2) freistehende Wand: 4 Segmente, links gebaut (Wandkopf), rechts Ruine
bpy.ops.wm.read_factory_settings(use_empty=True); E._SLAB.clear(); S = 2.4; segs = []
for k in range(4):
    w = imp(WALL, Vector((k * 1.0 * S, 0, 0)), 0.0, S); w.name = f'wand_{k}'; w['kfb_palette_role'] = 'stone'; w['kfb_group'] = 'test'; segs.append(w)
wh = hashlib.sha1(bytes(str([tuple(round(c, 5) for c in v.co) for v in segs[-1].data.vertices]), 'utf8')).hexdigest()[:12]
rb = E.built_end(segs[0], 'wall_head', end=-1, seed='test_kopf'); rr = E.ruin_end(segs[-1], end=1, seed='test_ruine')
print('BUILT_END', json.dumps({k: v for k, v in rb.items() if k != 'objects'}), len(rb['objects']), 'RUIN_END', len(rr['objects']), rr['nests'])
check_props(rb['objects'], 'built_end'); check_props(rr['objects'], 'ruin_end')
if not rb.get('rubble_rule_ok', False): fails.append('built_end: Rubbel-Nest verletzt Zahlenregeln')
if not all(rr['nests']): fails.append('ruin_end: Rubbel-Nest verletzt Zahlenregeln')
if hashlib.sha1(bytes(str([tuple(round(c, 5) for c in v.co) for v in segs[-1].data.vertices]), 'utf8')).hexdigest()[:12] != wh: fails.append('ruin_end hat die Kit-Wand verändert')
allv = [o.matrix_world @ v.co for n_ in rr['objects'] for o in [bpy.data.objects[n_]] if o.get('kfb_edge') == 'ruin_end' for v in o.data.vertices]
xe_ = max(v.x for v in allv); end_h = max([v.z for v in allv if v.x > xe_ - 0.15] or [0])
if max(v.z for v in allv) < 0.85 * 0.725 * S: fails.append('ruin_end: Wand zu stark abgetragen')
if end_h > 0.5 * 0.725 * S: fails.append(f'ruin_end: Ende nicht abgetragen (Höhe {end_h:.2f})')
if rr['blocks'] < 2: fails.append('ruin_end: keine treppigen Brocken')
if OUT:
    terrain('gelaende_w', -4, 12, -4, 5, 0.1, lambda x, y: 0.02 * math.sin(x * 1.3) * math.sin(y * 1.1), 'ground')
    light.setup(bpy.context.scene, mood_set='mesa', mood='day', ground='#8b68c7', background='#96bede')
    render(os.path.join(OUT, 'K8_mauerende_gebaut.png'), (-1.4, 0.9, 0.9), (-0.9, -1.0, 0.55), 6.0)
    render(os.path.join(OUT, 'K8_wandende_ruine.png'), (8.6, 0.9, 0.8), (0.9, -1.0, 0.55), 6.5)
print('EDGE_TEST', 'PASS' if not fails else 'FAIL', fails)
