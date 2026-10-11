"""Render a Coconino mesa module: Hero 3/4, Front, Side, Top (Cycles CPU, ortho, transparent).
Run: python cc_render.py -- OUTDIR M01 [views]"""
import bpy, sys, os, math
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
OUT, MID = argv[0], argv[1]
VIEWS = argv[2].split(',') if len(argv) > 2 else ['HERO', 'FRONT', 'SIDE', 'TOP']
SAMPLES = int(os.environ.get('CC_SAMPLES', '32')); SCALE = float(os.environ.get('CC_RES', '1.0'))
bpy.ops.wm.open_mainfile(filepath=f'{OUT}/KFB_CC_{MID}.blend')
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('W'); sc.world = w
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.7, 0.66, 0.9, 1); bg.inputs[1].default_value = 0.3
def sun(name, d, e, col, ang=5):
    L = bpy.data.lights.new(name, 'SUN'); L.energy = e; L.color = col; L.angle = math.radians(ang)
    o = bpy.data.objects.new(name, L); sc.collection.objects.link(o)
    o.rotation_euler = (-Vector(d).normalized()).to_track_quat('-Z', 'Y').to_euler()
sun('KEY', (-0.62, -0.62, 0.48), 5.8, (1.0, 0.76, 0.5))           # low warm evening key, ~28 deg, 3/4 front left
sun('FILL', (0.75, -0.2, 0.3), 0.9, (0.62, 0.66, 1.0), 25)       # cool violet fill
sun('RIM', (0.3, 0.9, 0.35), 1.8, (1.0, 0.7, 0.5), 10)
isl = bpy.data.objects[f'KFB_CC_{MID}']
vs = [isl.matrix_world @ v.co for v in isl.data.vertices]
lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))); hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
ctr = (lo + hi) / 2; size = max(hi.x - lo.x, hi.y - lo.y, hi.z - lo.z)
def cam(name, az, el, scale):
    C = bpy.data.cameras.new(name); C.type = 'ORTHO'; C.ortho_scale = scale; C.clip_end = 3000
    o = bpy.data.objects.new(name, C); sc.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    o.location = ctr + d * 600; o.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler(); return o
wx, wy, wz = hi.x - lo.x, hi.y - lo.y, hi.z - lo.z
def fit(horiz, vert, res):                                 # ortho scale spans the longer image side
    ar = res[0] / res[1]
    return max(horiz, vert * ar) * 1.12 if ar >= 1 else max(horiz / ar, vert) * 1.12
spec = dict(HERO=(35, 26, size * 1.3, (1300, 1100)), FRONT=(0, 5, fit(wx, wz, (1000, 850)), (1000, 850)),
            SIDE=(90, 5, fit(wy, wz, (1000, 850)), (1000, 850)), TOP=(0, 89.5, fit(wx, wy, (1000, 1000)), (1000, 1000)))
if wz > max(wx, wy):                                       # tall module: portrait frames
    spec['HERO'] = (35, 22, fit(max(wx, wy), wz * 1.05, (900, 1200)), (900, 1200))
    spec['FRONT'] = (0, 5, fit(wx, wz, (700, 1000)), (700, 1000)); spec['SIDE'] = (90, 5, fit(wy, wz, (700, 1000)), (700, 1000))
for v in VIEWS:
    az, el, s, res = spec[v]
    sc.camera = cam(v, az, el, s)
    sc.render.resolution_x, sc.render.resolution_y = int(res[0] * SCALE), int(res[1] * SCALE)
    sc.render.filepath = f'{OUT}/CC_{MID}_{v}.png'
    bpy.ops.render.render(write_still=True); print('RENDERED', v, flush=True)
