"""S8 · TN01 tunnel shots (Workbench, colour from `paint`). Runs inside KFB_TRACKCORE_S8_TN01_v1.blend.
Globals: S8_ROOT, S8_ONLY (list of shot names, optional)."""
import bpy, json, gzip, math, os
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S8_ROOT', KIT + 'S8_TUNNELS_2026-09-27/')
OUT = ROOT + 'shots/'
os.makedirs(OUT, exist_ok=True)
G = json.load(gzip.open(ROOT + 'out/tn01.graph.stream.json.gz', 'rt'))
M = G['routes']['M']; TD = M['samples']; JD = G['routes']['J']['samples']
TUBE = {t['host'] + ('' if t['host'] != 'shaft' else t['id'][:2]): t for t in M['tunnels']}
JOINT = {j['piece']: j['index'] for j in M['joints']}
SC = bpy.context.scene


def bl(p):
    return Vector((p[0], -p[2], p[1]))


def ensure_paint():
    for o in bpy.data.objects:
        if o.type != 'MESH':
            continue
        me = o.data
        if 'paint' in me.color_attributes:
            me.color_attributes.active_color = me.color_attributes['paint']; continue
        ca = me.color_attributes.new('paint', 'FLOAT_COLOR', 'CORNER')
        cols = [tuple(m.diffuse_color) if m else (0.6, 0.6, 0.6, 1) for m in me.materials] or [(0.6, 0.6, 0.6, 1)]
        for poly in me.polygons:
            c = cols[min(poly.material_index, len(cols) - 1)]
            for li in poly.loop_indices:
                ca.data[li].color = c
        me.color_attributes.active_color = ca


def setup():
    SC.render.engine = 'BLENDER_WORKBENCH'
    sh = SC.display.shading
    sh.light = 'STUDIO'; sh.color_type = 'VERTEX'; sh.show_cavity = True; sh.cavity_type = 'WORLD'
    sh.show_shadows = False; sh.show_object_outline = False; sh.show_backface_culling = False
    sh.background_type = 'VIEWPORT'; sh.background_color = (0.59, 0.745, 0.87)
    SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
    SC.render.resolution_x, SC.render.resolution_y, SC.render.resolution_percentage = 1600, 1000, 100
    SC.render.image_settings.file_format = 'PNG'; SC.render.film_transparent = False
    cam = bpy.data.objects.get('S8_CAM') or bpy.data.objects.new('S8_CAM', bpy.data.cameras.new('S8_CAM'))
    if cam.name not in SC.collection.objects:
        SC.collection.objects.link(cam)
    cam.data.clip_end = 8000; cam.data.clip_start = 0.3; SC.camera = cam
    return cam


def look(cam, eye, tgt, lens=35):
    cam.location = eye
    cam.rotation_euler = (tgt - eye).normalized().to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens


def local(i, fwd=0.0, right=0.0, up=0.0, S=None):
    q = (S or TD)[i]
    return bl(q['p']) + bl(q['T']) * fwd + bl(q['R']) * right + bl(q['U']) * up


def fit(cam, pts, az, el, lens=32, margin=1.12, tangent=None):
    c = sum(pts, Vector()) / len(pts); r = max((p - c).length for p in pts)
    t = tangent or (pts[-1] - pts[0]); t = Vector((t.x, t.y, 0))
    t = t.normalized() if t.length > 1e-6 else Vector((0, 1, 0))
    right = Vector((t.y, -t.x, 0)); a, e = math.radians(az), math.radians(el)
    d = ((-t * math.cos(a) + right * math.sin(a)) * math.cos(e) + Vector((0, 0, math.sin(e)))).normalized()
    fov_v = 2 * math.atan(math.tan(math.atan(18 / lens)) * 1000 / 1600)
    look(cam, c + d * (r * margin / math.sin(fov_v / 2)), c, lens)


def pts(i0, i1, step=8, S=None):
    S = S or TD
    return [bl(S[i]['p']) for i in range(i0, min(i1, len(S) - 1) + 1, step)]


def show(surface=True, cavern=True):
    for name, vis in (('S8_SURFACE', surface), ('S8_HOLLOW_EARTH', cavern)):
        c = bpy.data.collections.get(name)
        if c:
            c.hide_render = not vis


SHOTS = {}


def shot(fn):
    SHOTS[fn.__name__] = fn
    return fn


@shot
def t01_surface_overview(cam):
    show(True, False)
    look(cam, Vector((1050, -1900, 950)), Vector((1050, -60, 0)), 30)


@shot
def t02_mountain_portal_round(cam):
    show(True, False); i = TUBE['mountain']['i0']
    look(cam, local(i, -70, -22, 14), local(i, 10, 0, 8), 30)


@shot
def t03_mountain_portal_oval(cam):
    show(True, False); i = TUBE['mountain']['i1']
    look(cam, local(i, 75, 24, 12), local(i, -10, 0, 7), 30)


@shot
def t04_building_passage(cam):
    show(True, False); i = TUBE['building']['i0']
    look(cam, local(i, -75, -95, 26), local(i, 35, 0, 12), 30)


@shot
def t05_underground_xray(cam):
    show(False, True); cx, cy, cz = G['meta']['cavernCentre']
    look(cam, Vector((cx, cy - 1750, 170)), Vector((cx, cy, cz + 40)), 32)


@shot
def t06_shaft_hexagon_spiral(cam):
    show(False, False); a, b = JOINT['shaft1'], JOINT['shaft1_run']
    fit(cam, pts(a, b, 8), 150, 18, 35, 1.25, Vector((1, 0, 0)))


@shot
def t07_braid_over_under(cam):
    show(False, True); a, b = JOINT['m_swap1'], JOINT['m_close']
    fit(cam, pts(a, b, 6) + pts(0, len(JD) - 1, 12, JD), 160, 16, 35, 0.75, Vector((1, 0, 0)))


@shot
def t08_hollow_earth_loop_sun(cam):
    show(False, True); a, b = JOINT['loop_in'], JOINT['cave_out']
    c = sum(pts(a, b, 4), Vector()) / len(pts(a, b, 4))
    look(cam, c + Vector((-40, -260, 25)), c + Vector((-150, 40, 45)), 24)


@shot
def t09_inside_mountain_morph(cam):
    show(True, False); i = JOINT['mt_right'] - 60
    look(cam, local(i, 0, -2, 3.2), local(i + 160, 0, 0, 4.0), 18)


def run():
    ensure_paint(); cam = setup(); only = globals().get('S8_ONLY'); done = []
    for name, fn in SHOTS.items():
        if only and name not in only:
            continue
        fn(cam); SC.render.filepath = OUT + name + '.png'
        bpy.ops.render.render(write_still=True); done.append(name)
    show(True, True)
    return done


result = run()
