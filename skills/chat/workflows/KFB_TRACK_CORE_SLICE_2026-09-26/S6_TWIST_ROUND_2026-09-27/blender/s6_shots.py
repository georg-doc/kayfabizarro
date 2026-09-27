"""S6 · TD05 twisted balcony + rounded architecture shots (Workbench, colour from the stream `paint`). Runs inside KFB_TRACKCORE_S6_TD05_v1.blend.
Globals: S6_ONLY (list of shot names, optional)."""
import bpy, json, math, os
from mathutils import Vector

S5 = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/S6_TWIST_ROUND_2026-09-27/'
OUT = S5 + 'shots/'
os.makedirs(OUT, exist_ok=True)
TD = json.load(open(S5 + 'out/td05.stream.json'))['samples']
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
    sh.light = 'STUDIO'; sh.color_type = 'VERTEX'; sh.show_cavity = True; sh.cavity_type = 'BOTH'
    sh.show_shadows = True; sh.shadow_intensity = 0.35; sh.show_object_outline = False
    sh.background_type = 'VIEWPORT'; sh.background_color = (0.59, 0.745, 0.87)
    SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
    SC.render.resolution_x, SC.render.resolution_y, SC.render.resolution_percentage = 1600, 1000, 100
    SC.render.image_settings.file_format = 'PNG'; SC.render.film_transparent = False
    cam = bpy.data.objects.get('S4_CAM') or bpy.data.objects.new('S4_CAM', bpy.data.cameras.new('S4_CAM'))
    if cam.name not in SC.collection.objects:
        SC.collection.objects.link(cam)
    cam.data.clip_end = 3000; SC.camera = cam
    return cam


def look(cam, eye, tgt, lens=35):
    cam.location = eye
    cam.rotation_euler = (tgt - eye).normalized().to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens


def local(i, fwd=0.0, right=0.0, up=0.0):
    q = TD[i]
    return bl(q['p']) + bl(q['T']) * fwd + bl(q['R']) * right + bl(q['U']) * up


def fit(cam, pts, az, el, lens=32, margin=1.12, tangent=None):
    c = sum(pts, Vector()) / len(pts); r = max((p - c).length for p in pts)
    t = tangent or (pts[-1] - pts[0]); t = Vector((t.x, t.y, 0))
    t = t.normalized() if t.length > 1e-6 else Vector((0, 1, 0))
    right = Vector((t.y, -t.x, 0)); a, e = math.radians(az), math.radians(el)
    d = ((-t * math.cos(a) + right * math.sin(a)) * math.cos(e) + Vector((0, 0, math.sin(e)))).normalized()
    fov_v = 2 * math.atan(math.tan(math.atan(18 / lens)) * 1000 / 1600)
    look(cam, c + d * (r * margin / math.sin(fov_v / 2)), c, lens)


def pts(i0, i1, step=4):
    return [bl(TD[i]['p']) for i in range(i0, min(i1, len(TD) - 1) + 1, step)]


def scenery(show):
    c = bpy.data.collections.get('S3_UNICENTER_SCENERY')
    if c:
        c.hide_render = not show


SHOTS = {}


def crossing_view(cam):
    # worst headroom pair from the core check: drift ring (lower) under balcony lap 1 (upper). Eye beside the ring,
    # just above its road, looking across under the balcony deck.
    lo = min(range(len(TD)), key=lambda i: abs(TD[i]['s'] - 746.3)); hi = min(range(len(TD)), key=lambda i: abs(TD[i]['s'] - 1548.3))
    tgt = (bl(TD[lo]['p']) + bl(TD[hi]['p'])) / 2
    look(cam, local(lo, -35, -6, 1.6), tgt, 30)


def shot(fn):
    SHOTS[fn.__name__] = fn
    return fn


@shot
def d01_td05_circuit_overview(cam):
    scenery(True); fit(cam, pts(0, len(TD) - 1, 20), 200, 40, 35, 0.62, Vector((1, 0.35, 0)))


@shot
def d02_twisted_balcony_se(cam):  # two laps, corners tilted and lifted, straights twisting between them
    scenery(True); fit(cam, pts(2785, 3865), 140, 16, 35, 0.85, Vector((0.866, -0.5, 0)))


@shot
def d03_twisted_balcony_nw(cam):
    scenery(True); fit(cam, pts(2785, 3865), -40, 10, 35, 0.85, Vector((0.866, -0.5, 0)))


@shot
def d04_banked_corner(cam):  # steepest banked corner (lap 1, hub N), seen head-on: the deck leans into the turn
    scenery(False); fit(cam, pts(3215, 3280), 175, 6, 35, 0.8)


@shot
def d05_offcamber_corner(cam):  # off-camber corner (lap 1, tip S), head-on: the deck leans outwards
    scenery(False); fit(cam, pts(2945, 3010), 175, 6, 35, 0.8)


@shot
def d06_barrier_taper_lip(cam):  # barriers run out thin towards the kicker lip
    scenery(False); look(cam, local(3918, -8, -12, 5), local(3931, 0, 0, 1), 30)


@shot
def d07_barrier_taper_landing(cam):  # and grow back after touchdown
    scenery(False); look(cam, local(4000, -6, 14, 6), local(4016, 0, 0, 0), 30)


@shot
def d08_round_wing_corner(cam):  # rounded wing decks and columns at the wing tip
    scenery(True); look(cam, Vector((128, -26, 34)), Vector((106, -46, 30)), 30)


@shot
def d09_round_podium_corner(cam):  # rounded podium slabs and columns at the yellow arm tip
    scenery(True); look(cam, Vector((124, -32, 10)), Vector((106, -47, 6)), 30)


@shot
def d10_round_core_top(cam):
    scenery(True); look(cam, Vector((38, -38, 72)), Vector((0, 0, 57)), 30)


def run():
    ensure_paint(); cam = setup(); only = globals().get('S6_ONLY'); done = []
    for name, fn in SHOTS.items():
        if only and name not in only:
            continue
        fn(cam); SC.render.filepath = OUT + name + '.png'
        bpy.ops.render.render(write_still=True); done.append(name)
    scenery(True)
    return done


result = run()
