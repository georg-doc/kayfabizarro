"""SC02 · Support family on route sockets · Track-Core safe prework · Claude Coworker 26.09.2026
Supports are SCENERY under a route: they carry the route's soffit, they never define the route.
Donor: RKIT-03 `build_support_v2` (called with compact=True, the additive short-pillar fix of 26.09) (footing, tapered shaft, capital disc, bearing plate that follows the real
soffit incl. bank + grade; style layer classic / trunk / vine / rope). SC02 adds only:
  1. a PLACEMENT RULE over s (spacing, min clear height, keep-out zones of every other route + own lower branches, max span flag);
  2. a ground provider ground(x, z) (terrain / water owner later);
  3. INDEPENDENT CHECKS on the final vertices.
Stand-in routes until W0: A = banked S-flyover (bank from curvature, grade), B = ground road crossing under A, on undulating ground.
exec with optional globals: SC_BASE, SC_OFFSET, SC_STYLES, SC_EXPORT, SC_RULE (dict overrides)."""
import sys, math, json, os, importlib
import bpy
from mathutils import Vector

D = globals().get('SC_BASE', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit')
for p in (D + '/RKIT-01/scripts', D + '/RKIT-03/scripts', D + '/SC-LIB'):
    if p in sys.path:
        sys.path.remove(p)
    sys.path.insert(0, p)
import rkit_lib as K, rkit3_lib as R3, scenery_route as SR
for m in (K, R3, SR):
    importlib.reload(m)
COLL = 'SC02_SUPPORTS'
RULE = dict(spacing=12.0, min_height=3.0, max_span=32.0, foot_r=4.4, margin=1.0, self_skip=25.0,
            drop=K.TB['undersideDropM'], embed=0.25, side=0.0, footing='round')
RULE.update(globals().get('SC_RULE', {}))


# ------------------------------------------------------------------ stand-in world
def ground(x, z):
    return 1.2 * math.sin(x / 37.0) + 0.8 * math.cos(z / 53.0)


def ss(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def route_A():
    pts = []
    for k in range(401):
        z = -200.0 + k
        x = 45.0 * math.sin(2 * math.pi * (z + 200.0) / 400.0)
        e = ss(-170.0, -70.0, z) * (1.0 - ss(70.0, 170.0, z))
        y = ground(x, z) * (1 - e) + 13.0 * e + 0.05
        pts.append(Vector((x, y, z)))
    return SR.Route(SR.make_samples(pts, 7.2, bank=lambda s, i, kap: max(-0.22, min(0.22, -18.0 * kap))), 'A')


def route_B():
    pts = [Vector((x, ground(x, 0.0) + 0.05, 0.0)) for x in [-150.0 + k for k in range(301)]]
    return SR.Route(SR.make_samples(pts, 7.2), 'B')


# ------------------------------------------------------------------ donor adapter
def donor_frame(q):
    Rh = Vector((q['R'].x, 0.0, q['R'].z)).normalized()
    Th = Vector((q['T'].x, 0.0, q['T'].z))
    hl = max(1e-6, Th.length)
    Th.normalize()
    return dict(x=q['p'].x, y=q['p'].y, z=q['p'].z, w=2 * q['deck_half'], bank=math.asin(max(-1.0, min(1.0, q['R'].y))),
                nx=Rh.x, nz=Rh.z, tx=Th.x, tz=Th.z, grade=q['T'].y / hl, s=q['s'])


def place(route, others):
    """Returns accepted stations [(s, base Vector, clear height)], blocked [(s, reason)], long spans [(s0, s1)]."""
    acc, blocked, spans = [], [], []
    last = -1e9
    s = 0.0
    in_run = False
    while s <= route.L:
        q = route.at(s)
        base = Vector((q['p'].x + q['R'].x * RULE['side'], 0.0, q['p'].z + q['R'].z * RULE['side']))
        base.y = ground(base.x, base.z)
        h = q['p'].y - RULE['drop'] - base.y
        if h < RULE['min_height']:
            if in_run and acc and s - acc[-1][0] > 1.0:
                pass
            in_run = False
            s += 1.0
            continue
        if not in_run:
            in_run, last = True, -1e9
        if s - last >= RULE['spacing']:
            reason = None
            for o in others:
                if o.horizontal_hits(base, RULE['foot_r'] + RULE['margin']):
                    reason = f'keep-out {o.name}'
                    break
            if reason is None and route.horizontal_hits(base, RULE['foot_r'] + RULE['margin'], s_skip=s, skip_win=RULE['self_skip']):
                reason = f'keep-out {route.name} (own lower branch)'
            if reason:
                blocked.append((round(s, 1), reason))
            else:
                if acc and in_run and last > -1e8 and s - acc[-1][0] > RULE['max_span']:
                    spans.append((round(acc[-1][0], 1), round(s, 1)))
                acc.append((s, base, h))
                last = s
        s += 1.0
    return acc, blocked, spans


FOOT_PROFILE = [(4.6, -0.8), (4.6, -0.05), (4.3, 0.2), (3.7, 0.5), (3.25, 0.75), (3.0, 0.9)]   # (r, h) from ground level


def round_footing(name, base, segs=48):
    """Round footing (Georg 26.09: default). Sunk 0.8 m; the outer skirt sits just below the ground and follows
    ground(x, z) around its rim, the shoulder fades to a level top ring that meets the shaft foot (r 2.9 at h 0.8)."""
    v, f = [], []
    for r, h in FOOT_PROFILE:
        w = 1.0 if h <= 0.2 else max(0.0, (0.9 - h) / 0.7)          # terrain-follow weight
        for k in range(segs):
            a = 2 * math.pi * k / segs
            x, z = base.x + r * math.cos(a), base.z + r * math.sin(a)
            y = base.y + h + (ground(x, z) - base.y) * w
            bl = K.to_bl(x, y, z)
            v.append(Vector((bl.x, bl.y, bl.z)))
    n = len(FOOT_PROFILE)
    for i in range(n - 1):
        for k in range(segs):
            kn = (k + 1) % segs
            f.append((i * segs + k, i * segs + kn, (i + 1) * segs + kn, (i + 1) * segs + k))
    top = K.to_bl(base.x, base.y + FOOT_PROFILE[-1][1], base.z)
    c = len(v)
    v.append(Vector((top.x, top.y, top.z)))
    for k in range(segs):
        f.append(((n - 1) * segs + k, (n - 1) * segs + (k + 1) % segs, c))
    bot = K.to_bl(base.x, base.y - 0.8, base.z)
    c2 = len(v)
    v.append(Vector((bot.x, bot.y, bot.z)))
    for k in range(segs):
        f.append(((k + 1) % segs, k, c2))
    ob = K.mesh_from(name, v, f, ['support'] * len(f))
    return ob


def build_one(route, frames, s, base, style, name, seed):
    f = donor_frame(route.at(s))
    got = R3.build_support_v2(name, f, RULE['side'], ground_y=base.y, frames=frames, embed=RULE['embed'], style=style, seed=seed, compact=True)
    if RULE['footing'] == 'round':
        sq = [o for o in got if o.name.endswith('_footing')]
        if sq:
            remove(sq)
            got = [o for o in got if o not in sq] + [round_footing(name + '_footing', base)]
    for o in got:
        o['kfb_module'] = 'scenery_support'
        o['kfb_route_s'] = round(s, 2)
        if o.type == 'MESH':
            o.data.name = o.name
    return got


def intrudes(objs, others):
    for o in objs:
        for v in runtime_verts(o):
            for r in others:
                ss_, x, y, dh = r.local(v)
                if -1 <= ss_ <= r.L + 1 and abs(x) <= dh and 0.0 <= y <= r.corridor_h:
                    return True
    return False


def remove(objs):
    for o in objs:
        me = o.data if o.type == 'MESH' else None
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)


def build_style(route, stations, style, tag, others):
    """Check-driven placement: a support whose STYLE geometry (bend, lobes) intrudes into another route's corridor is
    removed and re-tried further along s (up to spacing - 1 m), else dropped. Footprint keep-out alone is not enough."""
    frames = [donor_frame(q) for q in route.S]
    built, moved = [], []
    for n, (s, base, h) in enumerate(stations):
        name = f'SC02_{tag}_{n:02d}'
        got = build_one(route, frames, s, base, style, name, n + 1)
        if not intrudes(got, others):
            built.append((s, base, got))
            continue
        remove(got)
        ok = False
        for ds in [d for k in range(1, int(RULE['spacing'])) for d in (k, -k)]:
            s2 = s + ds
            if built and s2 - built[-1][0] < RULE['spacing'] * 0.5:
                continue
            q = route.at(s2)
            b2 = Vector((q['p'].x, 0.0, q['p'].z))
            b2.y = ground(b2.x, b2.z)
            if q['p'].y - RULE['drop'] - b2.y < RULE['min_height']:
                continue
            if any(o.horizontal_hits(b2, RULE['foot_r'] + RULE['margin']) for o in others):
                continue
            got = build_one(route, frames, s2, b2, style, name, n + 1)
            if not intrudes(got, others):
                built.append((s2, b2, got))
                moved.append(dict(station=n, s_from=round(s, 1), s_to=round(s2, 1)))
                ok = True
                break
            remove(got)
        if not ok:
            moved.append(dict(station=n, s_from=round(s, 1), s_to=None, note='dropped: style clearance'))
    return built, moved


def runtime_verts(o):
    mw = o.matrix_world
    return [Vector(((mw @ v.co).x, (mw @ v.co).z, -(mw @ v.co).y)) for v in o.data.vertices]


def checks(route, others, built):
    """Independent checks. Plate: per 0.5 m lateral strip, the highest plate point must sit at soffit + embed (no gap on
    the low side of a banked soffit): every vertex of the up-facing top face. Foot: the lowest point of the whole support (footing or roots) is sunk 0..1 m."""
    corr_other, corr_self = 0, 0
    strip_max_rng = [1e9, -1e9]
    foot = [1e9, -1e9]
    skirt_float = -1e9
    target = -RULE['drop'] + RULE['embed']
    for s, base, objs in built:
        lowest = 1e9
        for o in objs:
            vs = runtime_verts(o)
            for v in vs:
                for r in others:
                    ss_, x, y, dh = r.local(v)
                    if -1 <= ss_ <= r.L + 1 and abs(x) <= dh and 0.0 <= y <= r.corridor_h:
                        corr_other += 1
                ss_, x, y, dh = route.local(v, s_hint=s, window=15.0)
                if abs(x) <= dh and 0.0 <= y <= route.corridor_h:
                    corr_self += 1
                lowest = min(lowest, v.y)
            if o.name.endswith('_bearing_plate'):
                mw = o.matrix_world
                n3 = mw.to_3x3().inverted().transposed()
                q = route.at(s)
                up_bl = Vector((q['U'].x, -q['U'].z, q['U'].y))
                top = set()
                for poly in o.data.polygons:
                    if (n3 @ poly.normal).normalized().dot(up_bl) > 0.95:
                        top.update(poly.vertices)
                ys = []
                for i in top:
                    w = mw @ o.data.vertices[i].co
                    ys.append(route.local(Vector((w.x, w.z, -w.y)), s_hint=s, window=15.0)[2])
                if ys:
                    strip_max_rng = [min(strip_max_rng[0], min(ys)), max(strip_max_rng[1], max(ys))]
        d = lowest - base.y
        foot = [min(foot[0], d), max(foot[1], d)]
        for o in objs:
            if o.name.endswith('_footing'):
                for v in runtime_verts(o):
                    if math.hypot(v.x - base.x, v.z - base.z) > 4.45:   # outer rim only (r 4.6); the 4.3 ring is the intended mound
                        skirt_float = max(skirt_float, v.y - ground(v.x, v.z))
    folds = []
    for s, base, objs in built:
        q = route.at(s)
        cap_top = (q['p'].y - RULE['drop']) - base.y - 0.55
        pr = R3.support_profile(cap_top, True)
        if any(b[1] < a[1] for a, b in zip(pr, pr[1:])):
            folds.append(round(s, 1))
    plate_ok = strip_max_rng[0] >= target - 0.3 and strip_max_rng[1] <= target + 0.3
    foot_ok = foot[0] >= -1.05 and foot[1] <= 0.05
    return dict(other_corridor_intrusions=corr_other, own_corridor_intrusions=corr_self,
                plate_top_per_strip_local_y=[round(v, 3) for v in strip_max_rng], plate_target_y=round(target, 3), plate_ok=plate_ok,
                lowest_point_vs_ground_m=[round(v, 3) for v in foot], foot_ok=foot_ok,
                shaft_profile_folds=folds,
                footing_skirt_above_ground_max_m=(round(skirt_float, 3) if skirt_float > -1e8 else None),
                PASS=(corr_other == 0 and corr_self == 0 and plate_ok and foot_ok and skirt_float <= 0.01 and not folds))


def ranges(pairs):
    out = []
    for s, why in pairs:
        if out and out[-1][2] == why and s - out[-1][1] <= 1.01:
            out[-1][1] = s
        else:
            out.append([s, s, why])
    return [dict(s_from=a, s_to=b, reason=w) for a, b, w in out]


def proxy(route, name, off, drop):
    v, f = [], []
    for i, q in enumerate(route.S[::3]):
        for lift in (0.0, -drop):
            for sgn in (-1, 1):
                p = q['p'] + q['R'] * (sgn * q['deck_half']) + q['U'] * lift
                w = K.to_bl(p.x, p.y, p.z)
                v.append(Vector((w.x + off[0], w.y + off[1], w.z)))
        if i:
            a, b = 4 * (i - 1), 4 * i
            f += [(a, b, b + 1, a + 1), (a + 2, b + 2, b + 3, a + 3)]
    ob = K.mesh_from(name, v, f, ['ground'] * len(f), smooth=False)
    R3.move_to(ob, coll)
    ob['kfb_module'] = 'proxy'
    ob.display_type = 'WIRE'
    return ob


def ground_proxy(name, off, half=(170.0, 215.0), g=6.0):
    v, f, idx = [], [], {}
    nx, nz = int(2 * half[0] / g), int(2 * half[1] / g)
    for i in range(nx + 1):
        for j in range(nz + 1):
            x, z = -half[0] + i * g, -half[1] + j * g
            w = K.to_bl(x, ground(x, z), z)
            idx[(i, j)] = len(v)
            v.append(Vector((w.x + off[0], w.y + off[1], w.z)))
    for i in range(nx):
        for j in range(nz):
            f.append((idx[(i, j)], idx[(i + 1, j)], idx[(i + 1, j + 1)], idx[(i, j + 1)]))
    ob = K.mesh_from(name, v, f, ['ground'] * len(f), smooth=False)
    R3.move_to(ob, coll)
    ob['kfb_module'] = 'proxy'
    return ob


# ------------------------------------------------------------------ run
OFF0 = globals().get('SC_OFFSET', (1400.0, -3000.0))
STYLES = globals().get('SC_STYLES', ['classic', 'trunk', 'vine', 'rope'])
c = bpy.data.collections.get(COLL)
if c and not globals().get('SC_KEEP'):
    for o in list(c.objects):
        me = o.data if o.type == 'MESH' else None
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
coll = R3.coll(COLL)
A, B = route_A(), route_B()
stations, blocked, spans = place(A, [B])
report = dict(rule=RULE, stations=[dict(s=round(s, 1), clear_h=round(h, 2)) for s, _, h in stations],
              blocked=ranges(blocked), long_spans=spans, styles={})
for k, style in enumerate(STYLES):
    dx = 360.0 * (['classic', 'trunk', 'vine', 'rope'].index(style) if style in ('classic', 'trunk', 'vine', 'rope') else k)
    off = (OFF0[0] + dx, OFF0[1])
    built, moved = build_style(A, stations, style, style.upper(), [B])
    ck = checks(A, [B], built)
    objs = [o for _, _, os_ in built for o in os_]
    for o in objs:
        R3.move_to(o, coll)
        o.location.x += off[0]
        o.location.y += off[1]
    proxy(A, f'SC02_{style.upper()}_ROUTE_A_PROXY', off, RULE['drop'])
    proxy(B, f'SC02_{style.upper()}_ROUTE_B_PROXY', off, 0.6)
    ground_proxy(f'SC02_{style.upper()}_GROUND_PROXY', off)
    report['styles'][style] = dict(checks=ck, supports=len(built), objects=len(objs), style_relocations=moved)
    if globals().get('SC_EXPORT'):
        out = D + '/SC02-SUPPORTS/glb/'
        os.makedirs(out, exist_ok=True)
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs:
            o.select_set(True)
        fn = out + f'sc02_supports_{style}_fixture.glb'
        bpy.ops.export_scene.gltf(filepath=fn, export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
        report['styles'][style]['glb_kb'] = os.path.getsize(fn) // 1024
if globals().get('SC_EXPORT'):
    meta = dict(schema='kfb.scenery-shell.v0', id='sc02-supports', status='CANDIDATE · scenery only',
                donor='RKIT-03 rkit3_lib.build_support_v2 (unchanged)',
                socket=dict(frame='route frame at s (heading + bank, grade)', attach='soffit = road surface - %.2f m (RKIT body; later from core profile)' % RULE['drop'],
                            base='ground(x, z) from terrain/water owner'),
                fixture=dict(A='banked S-flyover, deck_half 7.2, peak 13 m, bank = clamp(-18·kappa, ±0.22 rad)',
                             B='ground road crossing under A, deck_half 7.2', ground='1.2 sin(x/37) + 0.8 cos(z/53)'),
                **report)
    json.dump(meta, open(D + '/SC02-SUPPORTS/sc02_supports.placement.json', 'w'), indent=1, ensure_ascii=False, default=str)
result = dict(stations=len(stations), blocked=ranges(blocked), long_spans=spans,
              styles={k: dict(v['checks'], n=v['supports'], moved=v['style_relocations'], glb_kb=v.get('glb_kb')) for k, v in report['styles'].items()})
