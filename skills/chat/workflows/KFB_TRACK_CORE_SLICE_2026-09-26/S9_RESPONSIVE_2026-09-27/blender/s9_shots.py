"""S9 · TN02 shots (Workbench, `paint` colours). Runs inside KFB_TRACKCORE_S9_TN02_v1.blend. Globals: S9_ROOT, S9_ONLY."""
import bpy, json, gzip, math, os
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
ROOT = globals().get('S9_ROOT', KIT + 'S9_RESPONSIVE_2026-09-27/')
OUT = ROOT + 'shots/'; os.makedirs(OUT, exist_ok=True)
G = json.load(gzip.open(ROOT + 'out/tn02.graph.stream.json.gz', 'rt'))
M = G['routes']['M']; TD = M['samples']; JD = G['routes']['J']['samples']
SEG = {t['id']: t for t in M['tunnels']}
SC = bpy.context.scene


def bl(p):
    return Vector((p[0], -p[2], p[1]))


def setup():
    SC.render.engine = 'BLENDER_WORKBENCH'
    sh = SC.display.shading
    sh.light = 'STUDIO'; sh.color_type = 'VERTEX'; sh.show_cavity = True; sh.cavity_type = 'WORLD'
    sh.show_shadows = False; sh.show_object_outline = False; sh.show_backface_culling = False
    sh.background_type = 'VIEWPORT'; sh.background_color = (0.59, 0.745, 0.87)
    SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
    SC.render.resolution_x, SC.render.resolution_y, SC.render.resolution_percentage = 1600, 1000, 100
    SC.render.image_settings.file_format = 'PNG'
    cam = bpy.data.objects.get('S9_CAM') or bpy.data.objects.new('S9_CAM', bpy.data.cameras.new('S9_CAM'))
    if cam.name not in SC.collection.objects:
        SC.collection.objects.link(cam)
    cam.data.clip_end = 8000; cam.data.clip_start = 0.3; SC.camera = cam
    return cam


def look(cam, eye, tgt, lens=35):
    cam.location = eye; cam.rotation_euler = (tgt - eye).normalized().to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens


def local(i, fwd=0.0, right=0.0, up=0.0, S=None):
    q = (S or TD)[i]; return bl(q['p']) + bl(q['T']) * fwd + bl(q['R']) * right + bl(q['U']) * up


def seg(host, kind='tube', n=0):
    return [t for t in M['tunnels'] if t['host'] == host and t['kind'] == kind][n]


SHOTS = {}
def shot(fn):
    SHOTS[fn.__name__] = fn; return fn


@shot
def r01_overview(cam):
    pts = [bl(q['p']) for q in TD[::40]]
    c = sum(pts, Vector()) / len(pts); r = max((p - c).length for p in pts)
    look(cam, c + Vector((-0.35, -1.0, 0.75)).normalized() * r * 2.1, c, 35)


@shot
def r02_gotthard_hero_width(cam):
    i = next(k for k, q in enumerate(TD) if q.get('tunnel', {}).get('host') == 'mountain' and abs(q['prm']['width'] - 21.6) < 1e-3)
    look(cam, local(i, 0, -3, 3.5), local(i + 240, 0, 0, 4), 20)


@shot
def r03_gotthard_width_change(cam):
    t = seg('mountain'); pts = [bl(q['p']) for q in TD[t['i0']:t['i1']:10]]; c = sum(pts, Vector()) / len(pts)
    look(cam, c + Vector((0, -700, 420)), c, 32)


@shot
def r04_fork_hall_mouths(cam):
    h = seg('bunker', 'hall', 0); i = h['i0'] + 12
    look(cam, local(i, 0, 0, 6.5), local(h['i1'], 0, 0, 4), 18)


@shot
def r05_toy_branch(cam):
    t = next(t for t in G['routes']['J']['tunnels']); i = (t['i0'] + t['i1']) // 2
    look(cam, local(i, 0, -2, 3.2, JD), local(i + 160, 0, 0, 3.5, JD), 20)


@shot
def r06_alien_tube(cam):
    t = seg('alien'); i = t['i0'] + 100
    look(cam, local(i, 0, 2, 3.5), local(i + 200, 0, 0, 4), 20)


@shot
def r07_hangar_ship(cam):
    t = seg('hangar'); i = t['i0'] + 30
    look(cam, local(i, 0, -4, 6), local((t['i0'] + t['i1']) // 2, 0, 28, 12), 18)


@shot
def r08_join_hall(cam):
    h = seg('bunker', 'hall', 1); i = h['i1'] - 10
    look(cam, local(i, 0, 0, 7), local(h['i0'], 0, 0, 4), 18)


def run():
    cam = setup(); only = globals().get('S9_ONLY'); done = []
    for name, fn in SHOTS.items():
        if only and name not in only:
            continue
        fn(cam); SC.render.filepath = OUT + name + '.png'; bpy.ops.render.render(write_still=True); done.append(name)
    return done


result = {'done': run()}
