"""S8b · vehicle envelope proof: the real Kenney vehicles at race scale (Box-Stop BOX1 normalisation) in front of and
inside the tunnels. Imports the GLBs from assets/vehicles/, joins each into one object, paints it (Workbench VERTEX
colour), places lineups at the round mountain portal and in the rect building passage, renders t10 / t11.
Globals: S8_ROOT. Runs inside KFB_TRACKCORE_S8_TN01_v1.blend; the caller saves."""
import bpy, json, gzip, math, os
import numpy as np
from mathutils import Vector, Matrix

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S8_ROOT', KIT + 'S8_TUNNELS_2026-09-27/')
VEH = ROOT + 'assets/vehicles/'
G = json.load(gzip.open(ROOT + 'out/tn01.graph.stream.json.gz', 'rt'))
TD = G['routes']['M']['samples']
TUBE = {t['host']: t for t in G['routes']['M']['tunnels']}
# race scale factors = Box-Stop BOX1 `scale` (length normalised: cars 4.1 m, van 5.0 m, heavy 6.5 m, monster 5.7 m)
FLEET = [  # name, scale, colour (sRGB hex), label
    ('sedan', 4.1 / 2.55, 0x4f9be8, 'sedan 2.1 m'),
    ('van', 1.8181818, 0xf2c94c, 'van 2.45 m'),
    ('garbage-truck', 1.8840580, 0x6fbf73, 'garbage truck 3.0 m'),
    ('firetruck', 1.9117647, 0xe8452c, 'firetruck 3.25 m'),
    ('vehicle-truck', 7.5362319, 0xb07cf0, 'toy truck 3.96 m'),
    ('vehicle-monster-truck', 6.5142857, 0xff8a3d, 'monster truck 4.89 m'),
]


def srgb(h):
    c = [((h >> s) & 255) / 255 for s in (16, 8, 0)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def bl(p):
    return Vector((p[0], -p[2], p[1]))


def coll(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    for o in list(c.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    return c


def load_vehicle(name, scale, col):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=VEH + name + '.glb')
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == 'MESH']
    dg = bpy.context.evaluated_depsgraph_get()
    verts, faces, off = [], [], 0
    for o in meshes:
        me = o.evaluated_get(dg).to_mesh(); M = o.matrix_world
        verts += [M @ v.co for v in me.vertices]
        faces += [[off + i for i in p.vertices] for p in me.polygons]; off += len(me.vertices)
        o.evaluated_get(dg).to_mesh_clear()
    for o in new:
        bpy.data.objects.remove(o, do_unlink=True)
    ys = [v.z for v in verts]; z0 = min(ys)
    me = bpy.data.meshes.new('S8V_' + name)
    me.from_pydata([(v.x * scale, v.y * scale, (v.z - z0) * scale) for v in verts], [], faces)
    ca = me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
    ca.data.foreach_set('color', np.tile(np.array(col, dtype=np.float32), len(me.loops)))
    me.color_attributes.active_color = ca
    m = bpy.data.materials.new('S8V_' + name); m.diffuse_color = col; me.materials.append(m)
    for p in me.polygons:
        p.use_smooth = True
    xs = [v.co.x for v in me.vertices]; yv = [v.co.y for v in me.vertices]; zv = [v.co.z for v in me.vertices]
    return me, (max(xs) - min(xs), max(yv) - min(yv), max(zv) - min(zv))


def place(c, me, name, i, fwd, lat):
    q = TD[i]; T = bl(q['T']); R = bl(q['R'])
    p = bl(q['p']) + T * fwd + R * lat
    o = bpy.data.objects.new(name, me.copy() if me.users else me); c.objects.link(o)
    yaw = math.atan2(T.y, T.x) + math.pi / 2          # Kenney vehicles face glTF +Z = Blender -Y
    o.matrix_world = Matrix.Translation(p) @ Matrix.Rotation(yaw, 4, 'Z')
    return o


def run():
    c = coll('S8_VEHICLES'); dims = {}
    meshes = {}
    for name, sc, col, lab in FLEET:
        me, d = load_vehicle(name, sc, srgb(col)); meshes[name] = me; dims[name] = [round(x, 2) for x in d]
    # lineup 1: approaching the round mountain portal, three abreast, two rows
    i0 = TUBE['mountain']['i0']
    lanes = [-4.6, 0.0, 4.6]
    for k, (name, *_ ) in enumerate(FLEET):
        place(c, meshes[name], f'S8V_portal_{name}', i0, -14 - 12 * (k // 3), lanes[k % 3])
    # lineup 2: inside the rect building passage (the lowest tube, roof 10.4 m over the road)
    ib = TUBE['building']['i0'] + 40
    for k, (name, *_ ) in enumerate(FLEET):
        place(c, meshes[name], f'S8V_bld_{name}', ib, 12 * (k // 3), lanes[k % 3])
    return dims


dims = run()
SC = bpy.context.scene; cam = bpy.data.objects['S8_CAM']; OUT = ROOT + 'shots/'


def look(eye, tgt, lens):
    cam.location = eye; cam.rotation_euler = (tgt - eye).normalized().to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens


def local(i, fwd=0.0, right=0.0, up=0.0):
    q = TD[i]; return bl(q['p']) + bl(q['T']) * fwd + bl(q['R']) * right + bl(q['U']) * up


for name in ('S8_SURFACE',):
    bpy.data.collections[name].hide_render = False
bpy.data.collections['S8_HOLLOW_EARTH'].hide_render = True
i0 = TUBE['mountain']['i0']
look(local(i0, -62, -10, 7), local(i0, 0, 0, 5), 30); SC.render.filepath = OUT + 't10_vehicles_at_round_portal.png'
bpy.ops.render.render(write_still=True)
ib = TUBE['building']['i0'] + 40
look(local(ib, -38, 0, 4.5), local(ib, 20, 0, 4), 24); SC.render.filepath = OUT + 't11_vehicles_in_rect_passage.png'
bpy.ops.render.render(write_still=True)
bpy.data.collections['S8_HOLLOW_EARTH'].hide_render = False
result = dict(dims=dims, objects=len(bpy.data.collections['S8_VEHICLES'].objects))
