# KFB Mauerwerk-Familie A (Georg YES 09.10., owner RKIT): one cartoony clay-stone family for kerbs, walls, stairs, the town
# plateau, stone arch bridges, the pyramid and the Brick-Fish. Bauweise-Blatt v7 (PASS) + SPEC_EDGE_RUBBLE_GRAMMAR_R1.
# Units: K2 lab units (MC = 6.4, H = 3.64). Local frame of every module: +Y = length / run direction (Track Core T),
# +Z = up (U), +X = right (R = T x U). Origin = centre of the bottom face. Colour is NOT baked: every module carries the
# role `stone` and a tone index 0/1/2 (light / mid / dark of ENV_ROLES[island].stone), as object props + a point attribute
# `_ROLE_TONE` that the glTF exporter writes as a custom attribute. Rounded clay edges everywhere (rule §01).
# Run in Blender: exec(open(<this>).read()); build_family()
import bpy, bmesh, json, math, os, random, hashlib
from mathutils import Vector, Matrix

MC, H = 6.4, 3.64
ROOT = os.path.expanduser('~/Developer/rkit-r3/masonry_a')
PREVIEW_STONE = [(0.90, 0.83, 0.71), (0.82, 0.73, 0.60), (0.70, 0.61, 0.49)]   # preview only (ENV_ROLES.wueste-like); runtime uses the island role

def _hash(n): v = math.sin(n * 91.345 + 47.853) * 43758.5453; return v - math.floor(v)

def prism(poly, height, bevel, seg=3, z0=0.0, top=None):
    """extrude a 2D outline (x across, y along) from z0 to z0+height (or to top(x, y) per vertex), round all edges"""
    bm = bmesh.new()
    bot = [bm.verts.new((x, y, z0)) for x, y in poly]
    tp = [bm.verts.new((x, y, (z0 + height) if top is None else top(x, y))) for x, y in poly]
    bm.faces.new(bot[::-1]); bm.faces.new(tp)
    for i in range(len(poly)):
        j = (i + 1) % len(poly); bm.faces.new((bot[i], bot[j], tp[j], tp[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=bm.edges[:], offset=bevel, segments=seg, affect='EDGES', profile=0.5, clamp_overlap=True)
    return bm

def rect(w, l): return [(-w / 2, -l / 2), (w / 2, -l / 2), (w / 2, l / 2), (-w / 2, l / 2)]
def rounded_end(w, l, r_end, n=8):
    """plan outline with a rounded free end at +Y (kerb head, wall head): semicircle-like cap of radius r_end"""
    pts = [(-w / 2, -l / 2), (w / 2, -l / 2), (w / 2, l / 2 - r_end)]
    for k in range(1, n):
        a = math.pi / 2 * k / n; pts.append((w / 2 - r_end + r_end * math.cos(a), l / 2 - r_end + r_end * math.sin(a)))
    pts += [(w / 2 - r_end, l / 2), (-w / 2 + r_end, l / 2)]
    for k in range(1, n):
        a = math.pi / 2 + math.pi / 2 * k / n; pts.append((-w / 2 + r_end + r_end * math.cos(a), l / 2 - r_end + r_end * math.sin(a)))
    pts.append((-w / 2, l / 2 - r_end)); return pts

def clayify(bm, seed, amp=0.012):
    """hand-kneaded feel: a little smooth jitter on every vertex (fixed seed per module)"""
    for v in bm.verts:
        p = v.co; d = math.sin(p.x * 7.1 + seed) * math.sin(p.y * 6.3 + seed * 1.7) * math.sin(p.z * 8.9 + seed * 0.3)
        v.co += v.normal * amp * d if v.normal.length > 0 else Vector()

def lumpy_pebble(rx, ry, rz, seed):
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    for v in bm.verts:
        k = 1.0 + 0.09 * math.sin(v.co.x * 4.7 + seed) * math.cos(v.co.y * 3.9 + seed * 2) + 0.05 * math.sin(v.co.z * 6.1 + seed)
        v.co = Vector((v.co.x * rx * k, v.co.y * ry * k, v.co.z * rz * k))
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, rz * 0.85))
    return bm

def shard(seed, size):
    """a piece broken out of a slab: irregular 5-7 sided outline, slab thickness, rounded clay edges"""
    n = 5 + int(_hash(seed) * 3); pts = []
    for k in range(n):
        a = 2 * math.pi * k / n + (_hash(seed + k) - .5) * 0.6; r = size * (0.6 + 0.4 * _hash(seed * 3 + k))
        pts.append((r * math.cos(a), r * math.sin(a)))
    return prism(pts, 0.18, 0.05, seg=2)

# ---------------------------------------------------------------- module catalogue (K2)
def catalogue():
    Q, E8 = MC / 4, MC / 8   # 1.6, 0.8
    M = []
    def add(id_, use, build, size, rnd, tone=1, sockets='run', note=''):
        M.append(dict(id=id_, use=use, build=build, size=size, round=rnd, tone=tone, sockets=sockets, note=note))
    # kerbs (Bordsteine): 0.35 visible over the road (K2) + 0.12 bedded
    add('BORD_HOCH', 'Hochbord, Stadt', lambda: prism(rect(0.45, Q - 0.06), 0.47, 0.08), (0.45, Q - 0.06, 0.47), 0.08, 0)
    add('BORD_TIEF', 'Tiefbord (befahrbar, Zufahrt, Furt, nach dem Übergang)', lambda: prism(rect(0.45, Q - 0.06), 0.20, 0.07), (0.45, Q - 0.06, 0.20), 0.07, 0)
    add('BORD_UEBERGANG', 'Übergangsstein Hochbord → Tiefbord, genau ein Stein', lambda: prism(rect(0.45, Q - 0.06), 0.47, 0.07, top=lambda x, y: 0.20 + (0.47 - 0.20) * (0.5 - y / (Q - 0.06))), (0.45, Q - 0.06, 0.47), 0.07, 0)
    add('BORD_KOPF', 'Bordsteinkopf: gerundetes Bordende, sitzt im Rubbel', lambda: prism(rounded_end(0.45, E8, 0.22), 0.47, 0.08), (0.45, E8, 0.47), 0.22, 0, sockets='end')
    add('BORD_KURVE_R12', 'Kurvenstein für Radius 12 (radiale Fugen, kürzer statt gebogen)', lambda: prism([(-0.225, -0.38), (0.225, -0.42), (0.225, 0.42), (-0.225, 0.38)], 0.47, 0.08), (0.45, E8, 0.47), 0.08, 0)
    # paving
    add('PLATTE', 'Gehwegplatte ¼ MC, Läuferverband; Zuschnitt per Passstein-Generator', lambda: prism(rect(Q, Q), 0.22, 0.07), (Q, Q, 0.22), 0.07, 1, sockets='grid')
    add('KANTENSTEIN', 'Kantenstein an jeder Schnittkante, einzeln gerundet, Rubbel davor', lambda: prism(rect(0.3, 0.7), 0.26, 0.12), (0.3, 0.7, 0.26), 0.12, 1)
    # walls
    for nm, L in (('MAUER_18', E8), ('MAUER_14', Q), ('MAUER_12', MC / 2)):
        add(nm, f'Mauerstein {nm[-2]}/{nm[-1]} MC, Lage 0,75', (lambda L=L: lambda: prism(rect(0.8, L - 0.08), 0.72, 0.15))(), (0.8, L - 0.08, 0.72), 0.15, 1)
    add('ECKSTEIN', 'Eckstein (L), bindet zwei Mauerläufe', lambda: prism([(-0.4, -0.4), (1.2, -0.4), (1.2, 0.4), (0.4, 0.4), (0.4, 1.2), (-0.4, 1.2)], 0.72, 0.15), (1.6, 1.6, 0.72), 0.15, 2, sockets='corner')
    add('KOPFSTEIN', 'Mauerkopf: gerundetes freies Mauerende', lambda: prism(rounded_end(0.8, E8, 0.36), 0.72, 0.15), (0.8, E8, 0.72), 0.36, 1, sockets='end')
    add('DECKSTEIN_RUND', 'runder Deckstein für Brüstung und Mauerkrone', lambda: prism(rect(0.95, 1.06), 0.55, 0.26), (0.95, 1.06, 0.55), 0.26, 0)
    # stairs (town plateau, clay stair)
    add('STUFE_1MC', 'Treppenstufe 1 MC breit, Steigung 0,45, Auftritt ⅛ MC', lambda: prism(rect(MC - 0.06, E8 - 0.04), 0.45, 0.12), (MC - 0.06, E8 - 0.04, 0.45), 0.12, 1, sockets='stair')
    add('STUFE_12MC', 'Treppenstufe ½ MC breit', lambda: prism(rect(MC / 2 - 0.06, E8 - 0.04), 0.45, 0.12), (MC / 2 - 0.06, E8 - 0.04, 0.45), 0.12, 1, sockets='stair')
    # arch
    def voussoir(R=12.0, n=17, t=2.0, key=False):
        a = math.pi / n; ri, ro = R, R + t + (0.35 if key else 0)
        pts = [(ri * math.sin(-a / 2), ri * math.cos(-a / 2) - R), (ri * math.sin(a / 2), ri * math.cos(a / 2) - R), (ro * math.sin(a / 2), ro * math.cos(a / 2) - R), (ro * math.sin(-a / 2), ro * math.cos(-a / 2) - R)]
        return pts
    def upright(bm):   # arch profile stands in the X-Z plane, the barrel width runs along Y; bottom on z = 0, centred
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'X'))
        zs = [v.co.z for v in bm.verts]; ys = [v.co.y for v in bm.verts]
        bmesh.ops.translate(bm, verts=bm.verts, vec=(0, -(min(ys) + max(ys)) / 2, -min(zs))); return bm
    add('BOGENSTEIN_R12', 'Bogenstein (Radius 12, 17 Steine, Ring 2,0), stehend; Breite entlang Y wird beim Setzen auf die Gewölbebreite skaliert', lambda: upright(prism([(p[0], p[1]) for p in voussoir()], 1.0, 0.18)), (2.3, 1.0, 2.0), 0.18, 0, sockets='arch', note='Generator voussoir(R, n, t) für andere Radien')
    add('SCHLUSSSTEIN_R12', 'Schlussstein, größer und vorstehend, stehend', lambda: upright(prism([(p[0], p[1]) for p in voussoir(key=True)], 1.0, 0.2)), (2.3, 1.0, 2.35), 0.2, 2, sockets='arch')
    # end caps (rule §01: every free edge ends rounded)
    add('ABSCHLUSS_WAND', 'Abschlusskappe für Wandenden (halbe Kuppe), weicht beim Anbau', lambda: prism(rounded_end(0.8, 0.8, 0.4), 0.72, 0.3), (0.8, 0.8, 0.72), 0.4, 1, sockets='end')
    add('ABSCHLUSS_BODEN', 'Abschlusskappe für Boden- und Plattenkanten (Viertelrund)', lambda: prism(rect(Q, 0.5), 0.22, 0.2), (Q, 0.5, 0.22), 0.2, 1, sockets='edge')
    # rubble set: lumpy pebbles + shards broken out of slabs (TUNE later: visibly broken from the slab)
    for k in range(8):
        s = 0.12 + 0.03 * k
        add(f'RUBBEL_KIESEL_{k}', 'Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante', (lambda s=s, k=k: lambda: lumpy_pebble(s * 1.25, s, s * 0.78, 11 + k))(), (2.5 * s, 2 * s, 1.56 * s), s, k % 3, sockets='none')
    for k in range(4):
        add(f'RUBBEL_SCHERBE_{k}', 'aus einer Platte gebrochenes Stück (Wegende, Ruine)', (lambda k=k: lambda: shard(31 + k * 7, 0.35 + 0.08 * k))(), (0.9, 0.9, 0.18), 0.05, 1 + k % 2, sockets='none')
    return M

def stone_mat(tone):
    nm = f'KFB_A_stone_t{tone}'; m = bpy.data.materials.get(nm)
    if m: return m
    m = bpy.data.materials.new(nm); m.use_nodes = True; nt = m.node_tree; N, L = nt.nodes, nt.links; bs = N.get('Principled BSDF')
    c = PREVIEW_STONE[tone]; bs.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1); bs.inputs['Roughness'].default_value = 0.85
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6.0; nz.inputs['Detail'].default_value = 6.0
    vo = N.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 16.0
    L.new(tc.outputs['Object'], nz.inputs['Vector']); L.new(tc.outputs['Object'], vo.inputs['Vector'])
    mx = N.new('ShaderNodeMath'); mx.operation = 'ADD'; L.new(nz.outputs['Fac'], mx.inputs[0]); L.new(vo.outputs['Distance'], mx.inputs[1])
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.25; bp.inputs['Distance'].default_value = 0.04; L.new(mx.outputs[0], bp.inputs['Height']); L.new(bp.outputs['Normal'], bs.inputs['Normal'])
    m['kfb_role'] = 'stone'; m['kfb_tone'] = tone; return m

def socket(name, ob, loc, fwd, props):
    e = bpy.data.objects.new(name, None); e.empty_display_type = 'ARROWS'; e.empty_display_size = 0.4; e.parent = ob
    q = Vector(fwd).to_track_quat('Y', 'Z'); e.matrix_parent_inverse = Matrix.Identity(4); e.location = loc; e.rotation_euler = q.to_euler()
    for k, v in props.items(): e[k] = v
    for c in ob.users_collection: c.objects.link(e)
    return e

def build_family(export=True):
    os.makedirs(f'{ROOT}/glb', exist_ok=True)
    C = bpy.data.collections.get('KFB_MASONRY_A') or bpy.data.collections.new('KFB_MASONRY_A')
    if C.name not in bpy.context.scene.collection.children: bpy.context.scene.collection.children.link(C)
    for o in list(C.all_objects): bpy.data.objects.remove(o, do_unlink=True)
    for md in catalogue():
        me = bpy.data.meshes.get(md['id'])
        if me and me.users == 0: bpy.data.meshes.remove(me)
    for me in list(bpy.data.meshes):
        if me.users == 0 and me.name.split('.')[0] in {m['id'] for m in catalogue()}: bpy.data.meshes.remove(me)
    man = {'schema': 'kfb.masonry-family/1', 'family': 'A', 'owner': 'RKIT', 'units': 'lab (K2: MC 6.4, H 3.64)',
           'frame': 'local +Y = run direction (Track Core T), +Z = up (U), +X = right (R); origin = centre of the bottom face; glTF +Y up on export',
           'colour': 'role `stone`, tone index 0 light / 1 mid / 2 dark of ENV_ROLES[island].stone; object extras kfb_role / kfb_tone; point attribute _ROLE_TONE. Brick-Fish: role `creature` (own triad), optional inheritStone',
           'rules': ['§01 no hard cut, no visible edge: every free edge ends in a rounded cap', 'rubble instanced, denser towards the edge, fixed seeds', 'colour never baked'],
           'modules': []}
    col, row, x, maxh = 0, 0, 0.0, 0.0
    for i, md in enumerate(catalogue()):
        bm = md['build'](); clayify(bm, i * 7 + 3, amp=0.008 if md['size'][2] < 0.3 else 0.012)
        me = bpy.data.meshes.new(md['id']); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        me.materials.append(stone_mat(md['tone']))
        at = me.attributes.new('_ROLE_TONE', 'FLOAT', 'POINT')
        for d in at.data: d.value = float(md['tone'])
        ob = bpy.data.objects.new(md['id'], me); C.objects.link(ob)
        ob['kfb_role'] = 'stone'; ob['kfb_tone'] = md['tone']; ob['kfb_family'] = 'A'; ob['kfb_module'] = md['id']
        sx, sy, sz = md['size']; L = sy
        socks = []
        if md['sockets'] in ('run', 'end', 'stair'):
            socks.append(('SOCKET_a', (0, -L / 2, 0), (0, -1, 0)));
            if md['sockets'] != 'end': socks.append(('SOCKET_b', (0, L / 2, 0), (0, 1, 0)))
        elif md['sockets'] == 'corner': socks += [('SOCKET_a', (0, -0.4, 0), (0, -1, 0)), ('SOCKET_b', (1.2, 0.4 - 0.4, 0), (1, 0, 0))]
        elif md['sockets'] == 'grid': socks += [('SOCKET_a', (0, -sy / 2, 0), (0, -1, 0)), ('SOCKET_b', (0, sy / 2, 0), (0, 1, 0))]
        elif md['sockets'] == 'edge': socks.append(('SOCKET_a', (0, -sy / 2, 0), (0, -1, 0)))
        for nm, loc, fwd in socks: socket(f"{md['id']}_{nm}", ob, Vector(loc), fwd, {'kfb_socket': nm})
        # lay out in rows for the overview
        if x + sx > 40: x, row = 0.0, row + 1
        ob.location = (x + sx / 2, -row * 6.0, 0); x += sx + 2.2
        dims = [round(v, 4) for v in ob.dimensions]
        entry = {'id': md['id'], 'use': md['use'], 'size_xyz': dims, 'round': md['round'], 'tone': md['tone'], 'sockets': [s[0] for s in socks], 'seed': i * 7 + 3, 'note': md['note'],
                 'glb': f'glb/{md["id"]}.glb'}
        man['modules'].append(entry)
        if export:
            bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
            for ch in ob.children: ch.select_set(True)
            bpy.context.view_layer.objects.active = ob
            loc = ob.location.copy(); ob.location = (0, 0, 0)
            bpy.ops.export_scene.gltf(filepath=f"{ROOT}/glb/{md['id']}.glb", use_selection=True, export_yup=True, export_attributes=True, export_extras=True, export_apply=True)
            ob.location = loc
            with open(f"{ROOT}/glb/{md['id']}.glb", 'rb') as fh: entry['sha256'] = hashlib.sha256(fh.read()).hexdigest()
    json.dump(man, open(f'{ROOT}/manifest.json', 'w'), indent=1, ensure_ascii=False)
    return man

# ---------------------------------------------------------------- assembly demo (how the modules play together)
def place(C, mod, loc, rot_z=0.0, scale=(1, 1, 1), name=None, tone=None):
    src = bpy.data.objects[mod]; ob = bpy.data.objects.new(name or f'{mod}_inst', src.data)
    ob.location = loc; ob.rotation_euler = (0, 0, rot_z); ob.scale = scale; C.objects.link(ob)
    if tone is not None and tone != src['kfb_tone']: ob.data = src.data.copy(); ob.data.materials[0] = stone_mat(tone)
    return ob

def build_demo():
    C = bpy.data.collections.get('KFB_MASONRY_A_DEMO') or bpy.data.collections.new('KFB_MASONRY_A_DEMO')
    if C.name not in bpy.context.scene.collection.children: bpy.context.scene.collection.children.link(C)
    for o in list(C.all_objects): bpy.data.objects.remove(o, do_unlink=True)
    ox, oy = 0.0, 40.0
    # 1) wall: 3 courses in stretcher bond along +X, corner stone, wall head with rounded cap, rubble at the foot
    Lq = MC / 4
    for c in range(3):
        z = c * 0.74; x = ox + (0.8 if c % 2 else 0.0); k = 0
        while x < ox + 9.6:
            mod = 'MAUER_14' if (k + c) % 3 else 'MAUER_18'; L = bpy.data.objects[mod].dimensions.y + 0.08
            place(C, mod, (x + L / 2, oy, z), rot_z=math.pi / 2, tone=(k + c) % 3); x += L; k += 1
        place(C, 'ECKSTEIN', (ox - 0.4, oy - 0.4, z), rot_z=0.0 if c % 2 == 0 else math.pi / 2, tone=2)
        place(C, 'KOPFSTEIN', (ox + 10.4, oy, z), rot_z=-math.pi / 2, tone=1)
    for x in [ox + 1.0 + i * 1.12 for i in range(8)]: place(C, 'DECKSTEIN_RUND', (x, oy, 3 * 0.74), rot_z=math.pi / 2, tone=0)
    for i in range(10):
        m = f'RUBBEL_KIESEL_{i % 8}'; place(C, m, (ox + 10.9 + 0.5 * _hash(i), oy - 0.9 + 1.4 * _hash(i + 3), 0), rot_z=_hash(i * 7) * 3, tone=i % 3)
    # 2) clay stair: 5 steps of 1 MC, each 0.45 up and 0.8 back, end caps on both sides
    sx, sy = ox + 16.0, oy - 2.0
    for k in range(5):
        place(C, 'STUFE_1MC', (sx, sy + k * 0.8, k * 0.45), tone=k % 2)
        for side in (-1, 1): place(C, 'ABSCHLUSS_WAND', (sx + side * (MC / 2 + 0.25), sy + k * 0.8, k * 0.45), rot_z=-side * math.pi / 2, scale=(1, 0.6, 0.62), tone=2)
    # 3) kerb run: high kerb x4 -> transition stone -> low kerb x2 -> kerb head, rubble at the head
    kx, ky = ox, oy - 8.0
    seq = ['BORD_HOCH'] * 4 + ['BORD_UEBERGANG'] + ['BORD_TIEF'] * 2 + ['BORD_KOPF']
    y = ky
    for mod in seq:
        L = bpy.data.objects[mod].dimensions.y; place(C, mod, (kx, y + L / 2, 0), tone=0); y += L + 0.06
    for i in range(9): place(C, f'RUBBEL_KIESEL_{i % 8}', (kx + 0.9 * (_hash(i * 3) - .4), y + 0.2 + 0.7 * _hash(i * 5), 0), rot_z=_hash(i) * 3, tone=(i + 1) % 3)
    for r in range(3):   # a few slabs behind the kerb
        for j in range(4): place(C, 'PLATTE', (kx + 0.3 + 0.8 + r * 1.66, ky + 0.8 + j * 1.66 + (0.8 if r % 2 else 0), 0.0), tone=(r * 3 + j) % 3)
    # 4) arch: 17 voussoirs on radius 12 (the module stands; barrel width 4 here)
    ax, ay, R, n = ox + 34.0, oy - 4.0, 12.0, 17
    for k in range(n):
        a = -math.pi / 2 + math.pi * (k + 0.5) / n
        mod = 'SCHLUSSSTEIN_R12' if k == n // 2 else 'BOGENSTEIN_R12'
        ob = place(C, mod, (ax + R * math.sin(a), ay, R * math.cos(a)), scale=(1, 4.0, 1), tone=2 if k == n // 2 else k % 2)
        ob.rotation_euler = (0, a, 0)
    return C
