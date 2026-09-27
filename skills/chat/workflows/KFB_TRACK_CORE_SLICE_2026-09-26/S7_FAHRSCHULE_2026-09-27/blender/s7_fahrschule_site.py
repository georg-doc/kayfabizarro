"""S7 · Fahrschule site at the Otto-Maigler-See: ground with the lake cut out, water surface, beaches, car parks
(OSM extract, rough), the practice pad with its stations, then the FS01 graph stream via the B1 importer.
Runs in an EMPTY new file; the caller saves it as a new S7 file. Globals: S7_ROOT (slice folder)."""
import bpy, bmesh, json, math, os
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S7_ROOT', KIT + 'S7_FAHRSCHULE_2026-09-27/')
OSM = json.load(open(ROOT + 'track-core/layout/otto_maigler_see.osm.json'))
G = json.load(open(ROOT + 'out/fs01.graph.stream.json'))
WATER = -1.2
GROUND = -0.3   # terrain sits 0.3 m under the road level (no z-fighting with the road deck, as on the Uni-Center roof)


def coll(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    for o in list(c.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    return c


def mat(name, hexcol):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    c = [((hexcol >> s) & 255) / 255 for s in (16, 8, 0)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    m.diffuse_color = (*lin, 1)
    return m


def obj(c, name, bm, m, role):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(m)
    o = bpy.data.objects.new(name, me); c.objects.link(o); o['kfb_fs_role'] = role
    return o


def poly_face(bm, pts, z):
    vs = [bm.verts.new((x, y, z)) for x, y in pts]
    if len(vs) >= 3:
        bm.faces.new(vs)


def ring(pts):
    return pts[:-1] if pts[0] == pts[-1] else pts


site = coll('S7_SITE')
lake = next(w for w in OSM['ways'] if w['name'] == 'Otto-Maigler-See')
L = ring(lake['pts'])
# ground: large slab at 0, the lake cut out with a boolean (prism of the lake outline)
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
for v in bm.verts:
    v.co = Vector((v.co.x * 2400 - 900, v.co.y * 1800 - 700, (v.co.z - 0.5) * 3.0 + GROUND))
ground = obj(site, 'FS_ground', bm, mat('FS_grass', 0x8fbf6a), 'ground')
bm = bmesh.new(); vb = [bm.verts.new((x, y, -10)) for x, y in L]; vt = [bm.verts.new((x, y, 10)) for x, y in L]
bm.faces.new(vb[::-1]); bm.faces.new(vt)
for i in range(len(L)):
    j = (i + 1) % len(L); bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
cutter = obj(site, 'FS_lake_cutter', bm, mat('FS_cut', 0xff00ff), 'cutter'); cutter.hide_render = True; cutter.hide_set(True)
b = ground.modifiers.new('lake_cut', 'BOOLEAN'); b.operation = 'DIFFERENCE'; b.object = cutter; b.solver = 'EXACT'
# water surface, beaches, car parks (slightly above ground so they read)
bm = bmesh.new(); poly_face(bm, L, WATER); obj(site, 'FS_water', bm, mat('FS_water', 0x5aa8d8), 'water')
bm = bmesh.new()
for w in OSM['ways']:
    if w['kind'] == 'beach' and len(ring(w['pts'])) >= 3:
        poly_face(bm, ring(w['pts']), GROUND + 0.03)
obj(site, 'FS_beaches', bm, mat('FS_sand', 0xe8cf8a), 'beach')
bm = bmesh.new()
for w in OSM['ways']:
    if w['kind'] == 'parking' and len(ring(w['pts'])) >= 3:
        poly_face(bm, ring(w['pts']), GROUND + 0.04)
obj(site, 'FS_carparks', bm, mat('FS_asphalt', 0x8a8a88), 'parking')

# practice pad: slab + stations (runtime -> Blender: (x, -z, y))
pads = coll('S7_PRACTICE_PAD')
bl = lambda p, dz=0.0: Vector((p[0], -p[2], p[1] + dz))
for pad in G.get('pads', []):
    bm = bmesh.new(); top = [bm.verts.new(bl(p, -0.03)) for p in pad['outline']]; bot = [bm.verts.new(bl(p, -0.6)) for p in pad['outline']]
    bm.faces.new(top); bm.faces.new(bot[::-1]); n = len(top)
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((bot[i], bot[j], top[j], top[i]))
    obj(pads, 'FS_pad_' + pad['id'], bm, mat('FS_pad', 0x5f6b77), 'pad')
    for st in pad['stations']:
        if st['type'] == 'cones':
            for k, p in enumerate(st['pts']):
                bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.45, radius2=0.05, depth=0.9)
                for v in bm.verts:
                    v.co += bl(p, 0.47)
                obj(pads, f'FS_cone_{k}', bm, mat('FS_cone', 0xff7a1a), 'cone')
        if st['type'] == 'parking_box':
            c = [bl(p, 0.035) for p in st['corners']]
            bm = bmesh.new()
            for i in range(4):
                a, b2 = c[i], c[(i + 1) % 4]; d = (b2 - a).normalized(); nrm = Vector((-d.y, d.x, 0)) * 0.12
                bm.faces.new([bm.verts.new(a - nrm), bm.verts.new(b2 - nrm), bm.verts.new(b2 + nrm), bm.verts.new(a + nrm)])
            obj(pads, 'FS_parking_box', bm, mat('FS_line_white', 0xf4f1e8), 'parking_box')
        if st['type'] == 'brake_line':
            a, b2 = bl(st['from'], 0.035), bl(st['to'], 0.035); d = (b2 - a).normalized(); nrm = Vector((-d.y, d.x, 0)) * 0.6
            bm = bmesh.new(); bm.faces.new([bm.verts.new(a - nrm), bm.verts.new(b2 - nrm), bm.verts.new(b2 + nrm), bm.verts.new(a + nrm)])
            obj(pads, 'FS_brake_line', bm, mat('FS_line_red', 0xe8452c), 'brake_line')
        if st['type'] == 'sign':
            p = bl(st['at']); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
            for v in bm.verts:
                v.co = Vector((v.co.x * 9, v.co.y * 0.4, v.co.z * 3 + 4.5)) + p
            obj(pads, 'FS_sign_board', bm, mat('FS_sign', 0xfdc348), 'sign')
            t = bpy.data.curves.new('FS_sign_text', 'FONT'); t.body = st.get('text', ''); t.size = 1.4; t.align_x = 'CENTER'; t.extrude = 0.05
            to = bpy.data.objects.new('FS_sign_text', t); pads.objects.link(to)
            to.location = p + Vector((0, -0.25, 4.0)); to.rotation_euler = (math.pi / 2, 0, 0); t.materials.append(mat('FS_sign_ink', 0x2b2b2b))

# the course: graph stream (main circuit + jump lane) through the B1 importer (oracle checks + GLB round trip)
g = {'__name__': 's7_import', 'B1_ROOT': ROOT, 'B1_OUT': ROOT + 'b1/', 'B1_STREAMS': [(ROOT + 'out/fs01.graph.stream.json', (0.0, 0.0), 'FS01')]}
exec(open(ROOT + 'blender/b1_import_stream.py').read(), g)
result = dict(site=len(site.objects), pad_objects=len(pads.objects),
              oracle={k: (v['oracle']['pass_'] if isinstance(v, dict) and 'oracle' in v else v.get('pass_')) for k, v in g['result'].items()},
              glb=g['result']['_glb_round_trip'])
