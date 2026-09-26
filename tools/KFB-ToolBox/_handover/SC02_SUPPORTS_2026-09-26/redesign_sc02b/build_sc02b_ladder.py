"""SC02b · Support redesign proof: HEIGHT LADDER (3 … 15 m) · Claude Coworker 26.09.2026
Every height class of the new sc_support family side by side on flat ground, under a wire proxy of the track body
(soffit -> soffit + 2.25 m). Look + checks here FIRST; only after Georg's OK does SC02 re-place them on the fixture route.
exec with optional globals: SC_BASE, SC_OFFSET, SC_HEIGHTS, SC_STYLES."""
import sys, importlib, math
import bpy
from mathutils import Vector

D = globals().get('SC_BASE', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit')
for p in (D + '/RKIT-01/scripts', D + '/RKIT-03/scripts', D + '/SC-LIB'):
    if p in sys.path:
        sys.path.remove(p)
    sys.path.insert(0, p)
import rkit_lib as K, rkit3_lib as R3, sc_support as S
for m in (K, R3, S):
    importlib.reload(m)
COLL = 'SC02B_SUPPORT_LADDER'
OFF = globals().get('SC_OFFSET', (1400.0, -2600.0))
HEIGHTS = globals().get('SC_HEIGHTS', [3.0, 3.5, 4.0, 5.0, 7.0, 9.0, 12.0, 15.0])
STYLES = globals().get('SC_STYLES', ['classic', 'trunk'])
EMBED, BODY = 0.25, K.TB['undersideDropM']

c = bpy.data.collections.get(COLL)
if c:
    for o in list(c.objects):
        me = o.data if o.type == 'MESH' else None
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
coll = R3.coll(COLL)


def body_proxy(name, cx, cz, top, w=7.2, l=9.0):
    """Wire box of the track body above the support (soffit -> soffit + BODY)."""
    v, f = [], []
    for y in (top, top + BODY):
        for dx, dz in ((-w / 2, -l / 2), (w / 2, -l / 2), (w / 2, l / 2), (-w / 2, l / 2)):
            b = K.to_bl(cx + dx, y, cz + dz)
            v.append(Vector((b.x + OFF[0], b.y + OFF[1], b.z)))
    f = [(0, 1, 2, 3), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    ob = K.mesh_from(name, v, f, ['ground'] * 6, smooth=False)
    R3.move_to(ob, coll)
    ob.display_type = 'WIRE'
    ob['kfb_module'] = 'proxy'
    return ob


report = []
for si, style in enumerate(STYLES):
    for hi, H in enumerate(HEIGHTS):
        base = Vector((hi * 14.0, 0.0, si * 18.0))
        name = f'SC02B_{style.upper()}_H{H:04.1f}'.replace('.', 'p')
        objs, info = S.build(K, R3, name, base, H, style=style, embed=EMBED, seed=hi + 1)
        for o in objs:
            R3.move_to(o, coll)
            o.location.x += OFF[0]
            o.location.y += OFF[1]
        body_proxy(name + '_BODY_PROXY', base.x, base.z, H)
        bpy.context.view_layer.update()
        # independent checks (world space, Blender z = runtime y)
        zmax = {}
        zmin = {}
        for o in objs:
            ws = [o.matrix_world @ v.co for v in o.data.vertices]
            zmax[o.name.rsplit('_', 1)[-1] if not o.name.endswith('bearing_plate') else 'plate'] = max(w.z for w in ws)
            zmin[o.name] = min(w.z for w in ws)
        shaft = [o for o in objs if o.name.endswith('_shaft')][0]
        sw = [shaft.matrix_world @ v.co for v in shaft.data.vertices]
        plate_top = H + EMBED
        pokes = sum(1 for w in sw if w.z > plate_top + 1e-3)
        lowest = min(zmin.values())
        foot = [o for o in objs if o.name.endswith('_footing')]
        rim = None
        if foot:
            fw = [foot[0].matrix_world @ v.co for v in foot[0].data.vertices]
            cx, cy = base.x + OFF[0], -base.z + OFF[1]
            rim = max(w.z for w in fw if math.hypot(w.x - cx, w.y - cy) > 3.45)
        ok = info['profile_ok'] and pokes == 0 and lowest <= 0.01 and (rim is None or rim <= 0.0)
        report.append(dict(style=style, H=H, kind=info['kind'], profile_ok=info['profile_ok'], shaft_pokes_above_plate=pokes,
                           lowest=round(lowest, 2), rim=None if rim is None else round(rim, 3), PASS=ok))
result = dict(n=len(report), all_pass=all(r['PASS'] for r in report),
              rows=[(r['style'][:2], r['H'], r['kind'][:3], r['shaft_pokes_above_plate'], r['lowest'], r['rim'], r['PASS']) for r in report])
