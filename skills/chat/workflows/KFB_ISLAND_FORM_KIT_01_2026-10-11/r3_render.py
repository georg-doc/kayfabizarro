"""Render the K1 R3 views and details from IFK01_K1R3_<V>.blend (Cycles CPU).
Run: python r3_render.py -- OUTDIR VARIANT [views comma list]"""
import bpy, sys, math, json, os
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
OUT, VID = argv[0], argv[1]
VIEWS = argv[2].split(',') if len(argv) > 2 else ['SIDE', 'UNDER', 'HERO', 'RIM', 'BOULDER', 'ROOT', 'NICHE']
SAMPLES = int(os.environ.get('IFK_SAMPLES', '32'))
SCALE = float(os.environ.get('IFK_RES', '1.0'))
bpy.ops.wm.open_mainfile(filepath=f'{OUT}/IFK01_K1R3_{VID}.blend')
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('W'); sc.world = w
bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.95, 0.88, 0.78, 1); bg.inputs[1].default_value = 0.55
def sun(name, d, e, col, ang=6):
    L = bpy.data.lights.new(name, 'SUN'); L.energy = e; L.color = col; L.angle = math.radians(ang)
    o = bpy.data.objects.new(name, L); sc.collection.objects.link(o)
    o.rotation_euler = (-Vector(d).normalized()).to_track_quat('-Z', 'Y').to_euler()
sun('KEY', (-0.55, -0.75, 0.55), 4.2, (1.0, 0.9, 0.78))          # warm key from front left, above
sun('FILL', (0.8, -0.3, -0.25), 0.9, (0.85, 0.9, 1.0), 25)        # cool fill from the right, a little from below
sun('RIM', (0.2, 0.9, 0.3), 1.6, (1.0, 0.82, 0.6), 10)            # warm back light
T = json.load(open(f'{OUT}/K1R3_{VID}_targets.json'))
def cam(name, az, el, target, scale, dist=600):
    C = bpy.data.cameras.new(name); C.type = 'ORTHO'; C.ortho_scale = scale; C.clip_end = 3000; C.clip_start = 0.1
    o = bpy.data.objects.new(name, C); sc.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    o.location = Vector(target) + d * dist; o.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler(); return o
def az_of(p):
    """camera azimuth that looks straight at a point on the wall (camera az 0 sits at -Y)."""
    return math.degrees(math.atan2(p[0], -p[1]))
spec = dict(
    SIDE=(0, 12, (0, 0, -30), 168, (1400, 1100)),
    UNDER=(35, -22, (0, 0, -32), 176, (1400, 1100)),
    HERO=(28, 26, (0, 0, -24), 178, (1400, 1100)),
    RIM=(az_of(T['rim']) + 12, 18, T['rim'], 30, (1000, 900)),
    BOULDER=(az_of(T['boulder']) + 8, -8, T['boulder'], 30, (1000, 900)),
    ROOT=(az_of(T['root']) + 6, 4, T['root'], 34, (1000, 900)),
    NICHE=(az_of(T['niche']) + 4, -4, T['niche'], 30, (1000, 900)),
)
if T.get('band'):
    spec['BAND'] = (az_of(T['band']), -10, T['band'], 44, (1000, 900))
for v in VIEWS:
    if v not in spec:
        continue
    az, el, tg, s, res = spec[v]
    sc.camera = cam(v, az, el, tg, s)
    sc.render.resolution_x, sc.render.resolution_y = int(res[0] * SCALE), int(res[1] * SCALE)
    sc.render.filepath = f'{OUT}/K1R3_{VID}_{v}.png'
    bpy.ops.render.render(write_still=True)
    print('RENDERED', v, flush=True)
