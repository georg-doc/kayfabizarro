import bpy, sys, math, json, os, time
sys.path.insert(0, '/home/claude/islandkit')
import importlib, kfb_ifk01_r2b as K; importlib.reload(K)
from mathutils import Vector
OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/home/claude/islandkit/r2b'
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 32; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.view_settings.view_transform = 'Standard'
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs[0].default_value = (0.62, 0.72, 0.9, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.45
def sun(name, d, e, col, ang=6):
    L = bpy.data.lights.new(name, 'SUN'); L.energy = e; L.color = col; L.angle = math.radians(ang)
    o = bpy.data.objects.new(name, L); sc.collection.objects.link(o)
    o.rotation_euler = (-Vector(d).normalized()).to_track_quat('-Z', 'Y').to_euler()
sun('KEY', (0.6, -0.75, 0.45), 4.6, (1.0, 0.82, 0.6), 4)          # low warm key
sun('RIM', (-0.5, 0.85, 0.25), 2.4, (1.0, 0.6, 0.3), 4)            # orange rim from behind
sun('FILL', (-0.85, -0.2, 0.2), 0.7, (0.6, 0.75, 1.0), 25)          # sky-blue fill
sun('UNDER', (-0.2, -0.6, -0.6), 0.6, (1.0, 0.75, 0.55), 30)
def cam(name, az, el, target, scale):
    C = bpy.data.cameras.new(name); C.type = 'ORTHO'; C.ortho_scale = scale; C.clip_end = 3000
    o = bpy.data.objects.new(name, C); sc.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    o.location = Vector(target) + d * 800; o.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler(); return o
cams = dict(SIDE=cam('SIDE', 0, 12, (0, 0, -32), 185), HERO=cam('HERO', 28, 26, (0, 0, -28), 195),
            UNDER=cam('UNDER', 35, -22, (0, 0, -34), 190), TOP=cam('TOP', 0, 89.9, (0, 0, 0), 175))
res = dict(SIDE=(1200, 1000), HERO=(1200, 1000), UNDER=(1200, 1000), TOP=(600, 600))
variants = [('A', dict(style='columns', openings=False, seed=7)), ('B', dict(style='boulders', openings=False, seed=7)),
            ('C', dict(style='columns', openings=True, seed=7))]
which = os.environ.get('IFK_ONLY', 'ABC')
mets = {}
for vid, kw in variants:
    if vid not in which:
        continue
    coll = bpy.data.collections.new('IFK2_' + vid); sc.collection.children.link(coll)
    t = time.time(); parts = K.build_island('IFK2_' + vid, coll, **kw)
    # scale props: pole 1 H (red) and car (blue, length 6) on the ground, front left
    for nm, sz, colr, off in [('POLE', (0.45, 0.45, K.H), '#e0245e', (-28, -36)), ('CAR', (6.0, 2.9, 2.9), '#1f5fd6', (-20, -36))]:
        bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object; o.name = f'IFK2_{vid}_{nm}'
        for c in o.users_collection: c.objects.unlink(o)
        coll.objects.link(o); o.scale = sz; o.location = (off[0], off[1], sz[2] / 2); o.data.materials.append(K.mat_basic('IFK3_' + nm, colr, 0.5))
    mets[vid] = K.measure(parts); mets[vid]['build_s'] = round(time.time() - t, 1)
    for c in sc.collection.children:
        c.hide_render = (c.name != coll.name)
    for v, cm in cams.items():
        sc.camera = cm; sc.render.resolution_x, sc.render.resolution_y = res[v]
        sc.render.filepath = f'{OUT}/K1R2_{vid}_{v}.png'; bpy.ops.render.render(write_still=True)
    # GLB of this variant
    for o in bpy.context.view_layer.objects: o.select_set(False)
    for o in coll.objects:
        if 'POLE' not in o.name and 'CAR' not in o.name: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/IFK01_K1R2_{vid}_M20MC.glb', use_selection=True, export_format='GLB', export_apply=True)
json.dump(mets, open(f'{OUT}/K1R2_metrics.json', 'w'), indent=1)
bpy.ops.wm.save_as_mainfile(filepath=f'{OUT}/IFK01_K1R2.blend')
print('METRICS', json.dumps(mets))
