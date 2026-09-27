"""S4 · Claude Design brief shots. Clean camera renders (Workbench, colour from the stream's `paint` attribute),
no UI. Runs inside KFB_TRACKCORE_S3_TD03_v1.blend (opened, NOT saved; saved as a new S4 file by the caller).
Globals: S4_ONLY (list of shot names, optional)."""
import bpy, json, math, os
from mathutils import Vector

KIT = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit/TRACK-CORE/'
S3 = KIT + 'S3_2026-09-27/'
OUT = KIT + 'S4_DESIGN_BRIEF_2026-09-27/shots/'
os.makedirs(OUT, exist_ok=True)
TD = json.load(open(S3 + 'out/td03.stream.json'))['samples']
SC = bpy.context.scene


def bl(p):
    return Vector((p[0], -p[2], p[1]))


def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def ensure_paint():
    """Every mesh gets a 'paint' corner colour: track bodies already have it (from the stream),
    markings and scenery get their material colour so Workbench can show one colour source."""
    for o in bpy.data.objects:
        if o.type != 'MESH':
            continue
        me = o.data
        if 'paint' in me.color_attributes:
            me.color_attributes.active_color = me.color_attributes['paint']
            continue
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
    sh.light = 'STUDIO'
    sh.color_type = 'VERTEX'
    sh.show_cavity = True
    sh.cavity_type = 'BOTH'
    sh.show_shadows = True
    sh.shadow_intensity = 0.35
    sh.show_object_outline = False
    SC.display.shadow_focus = 0.2
    sh.background_type = 'VIEWPORT'
    sh.background_color = (0.59, 0.745, 0.87)  # Claybound sky #96bede (H0 look reference)
    SC.render.resolution_x, SC.render.resolution_y = 1600, 1000
    SC.render.resolution_percentage = 100
    SC.render.image_settings.file_format = 'PNG'
    SC.render.film_transparent = False
    SC.view_settings.view_transform = 'Standard'
    SC.view_settings.look = 'None'
    cam = bpy.data.objects.get('S4_CAM')
    if cam is None:
        cam = bpy.data.objects.new('S4_CAM', bpy.data.cameras.new('S4_CAM'))
        SC.collection.objects.link(cam)
    cam.data.clip_end = 3000
    SC.camera = cam
    return cam


def look(cam, eye, tgt, lens=35):
    cam.location = eye
    d = (tgt - eye).normalized()
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens


def fit(cam, pts, az, el, lens=32, margin=1.12, tangent=None):
    """Frame a point set: camera direction from azimuth/elevation (deg) relative to the mean tangent of the
    range (az 0 = from behind, 90 = from the driver's right), distance so the bounding sphere fills the frame."""
    c = sum(pts, Vector()) / len(pts)
    r = max((p - c).length for p in pts)
    t = tangent or (pts[-1] - pts[0])
    t = Vector((t.x, t.y, 0)).normalized() if Vector((t.x, t.y, 0)).length > 1e-6 else Vector((0, 1, 0))
    right = Vector((t.y, -t.x, 0))
    a, e = math.radians(az), math.radians(el)
    h = -t * math.cos(a) + right * math.sin(a)
    d = (h * math.cos(e) + Vector((0, 0, math.sin(e)))).normalized()
    cam.data.lens = lens
    fov = 2 * math.atan(18 / lens)  # 36 mm sensor width, frame is wider than tall -> use vertical half via ratio
    fov_v = 2 * math.atan(math.tan(fov / 2) * 1000 / 1600)
    dist = r * margin / math.sin(fov_v / 2)
    look(cam, c + d * dist, c, lens)


def pts_td(i0, i1, step=4):
    return [bl(TD[i]['p']) for i in range(i0, i1 + 1, step)]


def pts_graph(route, i0, i1, step=4, off=(420.0, 0.0)):
    S = GRAPH()[route]['samples']
    return [bl(S[i]['p']) + Vector((off[0], off[1], 0)) for i in range(i0, min(i1, len(S) - 1) + 1, step)]


_G = {}


def GRAPH():
    if not _G:
        _G.update(json.load(open(S3 + 'out/split_merge_seed.graph.stream.json'))['routes'])
    return _G


def frame_at(i):
    q = TD[i]
    return bl(q['p']), bl(q['T']), bl(q['U']), bl(q['R'])


def local(i, fwd=0.0, right=0.0, up=0.0):
    p, T, U, R = frame_at(i)
    return p + T * fwd + R * right + U * up


def scenery(show, graph=False):
    """show: Uni-Center scenery on/off. graph: show the split/merge seed instead of TD03."""
    for name, vis in (('S3_UNICENTER_SCENERY', show and not graph), ('TC_TD03', not graph), ('TC_SPLIT_MERGE', graph)):
        c = bpy.data.collections.get(name)
        if c:
            c.hide_render = not vis


def split_graph():
    """Import the split/merge seed next to TD03 (offset x +420) with the S3 importer's own builders."""
    if bpy.data.collections.get('TC_SPLIT_MERGE') and len(bpy.data.collections['TC_SPLIT_MERGE'].objects):
        return
    src = open(S3 + 'blender/b1_import_stream.py').read().replace('result = run()', '')
    g = {'__name__': 's4_import', 'B1_ROOT': S3}
    exec(src, g)
    d = json.load(open(S3 + 'out/split_merge_seed.graph.stream.json'))
    c = g['coll']('TC_SPLIT_MERGE')
    for rid, st in d['routes'].items():
        nm = 'TC_SPLIT_MERGE_' + rid.split('/')[-1]
        g['build_body'](c, nm + '_body', st['samples'], (420.0, 0.0))
        g['build_markings'](c, nm + '_markings', st['samples'], st['markings'], (420.0, 0.0))


SHOTS = {}


def shot(fn):
    SHOTS[fn.__name__] = fn
    return fn


@shot
def b01_td03_overview(cam):
    scenery(True); fit(cam, pts_td(0, 3124, 20), 200, 34, 35, 0.62, Vector((1, 0.35, 0)))


@shot
def b02_seam_street_to_track(cam):  # helix top -> atrium_up (skin street -> track), 32 m staggered blend
    scenery(False); fit(cam, pts_td(1175, 1250), 160, 32, 35)


@shot
def b03_mag_arrow_runin(cam):  # track -> mag seam + bar taper (arrow tip), driver-high view
    scenery(False); look(cam, local(1893, 0, -2, 11), local(1948, 0, 0, 0), 30)


@shot
def b04_loop_side(cam):
    scenery(True); look(cam, local(1964, 30, -75, 12), local(1964, 30, 0, 13), 35)


@shot
def b05_loop_driver_pov(cam):
    scenery(False); look(cam, local(1925, 0, 0, 2.2), local(1985, 0, 0, 6), 24)


@shot
def b06_wide_step_drift_ring(cam):  # STANDARD 14.4 -> WIDE 18 in the first quarter of the ring
    scenery(False); fit(cam, pts_td(1370, 1520), 80, 55, 35)


@shot
def b07_park_entry_slim_parapet(cam):  # WIDTH_STEP street -> car park profile
    scenery(False); fit(cam, pts_td(190, 290), 60, 18, 35)


@shot
def b08_helix_atrium(cam):
    scenery(False); look(cam, Vector((70, -70, 55)), Vector((0, 0, 7)), 30)


@shot
def b09_kicker_air_landing(cam):
    scenery(False); fit(cam, pts_td(2790, 2960), -80, 16, 35, 0.85)


@shot
def b10_plaza_hairpin_wide(cam):
    scenery(False); look(cam, local(2320, 0, -15, 70), local(2320, 0, 18, 0), 28)


@shot
def b11_split_merge(cam):
    split_graph()
    scenery(False, True); fit(cam, pts_graph('T', 100, 420) + pts_graph('L', 0, 260), -140, 30, 35)


@shot
def b11b_split_branch_lift(cam):
    split_graph()
    scenery(False, True); fit(cam, pts_graph('L', 320, 640), -105, 20, 35, 0.8)


@shot
def b12_barrier_closeup(cam):  # profile closeup: road, shoulder, barrier, cap, underside on the drift ring
    scenery(False); look(cam, local(1588, 0, 2, 3), local(1606, 0, 9.5, 1), 30)


def run():
    ensure_paint()
    cam = setup()
    only = globals().get('S4_ONLY')
    done = []
    for name, fn in SHOTS.items():
        if only and name not in only:
            continue
        fn(cam)
        SC.render.filepath = OUT + name + '.png'
        bpy.ops.render.render(write_still=True)
        done.append(name)
    scenery(True)
    return done


result = run()
