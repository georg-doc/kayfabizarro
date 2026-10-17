"""SC01 · Bridge scenery shells (suspension family, Mülheimer look) · Track-Core safe prework · Claude Coworker 26.09.2026
Scenery only. No road, no deck body, no parapet, no drivable surface: those belong to the Track Core (slots/profile/edge layer).
Every piece is placed from a ROUTE FRAME (heading + bank frame; pylons use the horizontal heading frame + world up):
    point = p(s) + x * R(s) + y * U(s)       (runtime coords: x right, y up, z forward)
Until W0 exists, the route is a stand-in sample stream (RKIT-11 fixture profile, frozen PR #42). Swap SC_ROUTE for the core's
stream later; the builder does not change.
exec with optional globals: SC_BASE, SC_OFFSET (Blender xy of runtime origin), SC_VARIANTS (list of param dicts), SC_EXPORT.
Independent checks run on the final vertices (own maths, not the builder's numbers)."""
import sys, math, json, os, importlib
import bpy
from mathutils import Vector, kdtree

D = globals().get('SC_BASE', '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Racetrack Blender Kit')
for p in (D + '/RKIT-01/scripts', D + '/RKIT-03/scripts'):
    if p in sys.path:
        sys.path.remove(p)
    sys.path.insert(0, p)
import rkit_lib as K, rkit3_lib as R3
for m in (K, R3):
    importlib.reload(m)
K.ROLE_HEX.setdefault('cable', 0x2f6b5e)
K.ROLE_HEX.setdefault('water', 0x3f8fc9)
COLL = 'SC01_BRIDGE_SHELLS'
DRIVABLE_ROLES = {'road', 'track', 'lane', 'shoulder', 'track_body'}


# ------------------------------------------------------------------ route stand-in (sample stream)
def fixture_route(z0=-473.0, z1=241.0, bank_y=9.0, crest_y=17.0, half_span=157.5, deck_half=14.8, ramp_w=-175.0, ramp_e=150.0, step=1.0):
    """RKIT-11 fixture profile (straight, level heading, vertical curves). Returns samples like the core will."""
    def ss(a, b, x):
        t = max(0.0, min(1.0, (x - a) / (b - a)))
        return t * t * (3 - 2 * t)

    def y(z):
        up = ss(z0, ramp_w, z) * (1.0 - ss(ramp_e, z1, z))
        crown = 1.2 * math.cos(math.pi * max(-1.0, min(1.0, z / half_span))) * 0.5 + 0.6 if abs(z) < half_span else 0.0
        return bank_y + (crest_y - bank_y) * up + crown * up
    pts = [Vector((0.0, y(z0 + k * step), z0 + k * step)) for k in range(int((z1 - z0) / step) + 1)]
    return make_samples(pts, deck_half)


def make_samples(pts, deck_half, bank=None):
    out, s = [], 0.0
    for i, p in enumerate(pts):
        if i:
            s += (p - pts[i - 1]).length
        T = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        R = Vector((0, 1, 0)).cross(T).normalized()          # flat heading-right
        b = bank(s) if bank else 0.0
        if b:
            R = (R * math.cos(b) + T.cross(R) * math.sin(b)).normalized()
        U = T.cross(R).normalized()
        out.append(dict(s=s, p=p.copy(), T=T, R=R, U=U, deck_half=deck_half))
    return out


class Route:
    def __init__(self, samples):
        self.S = samples
        self.L = samples[-1]['s']
        self.kd = kdtree.KDTree(len(samples))
        for i, q in enumerate(samples):
            self.kd.insert(q['p'], i)
        self.kd.balance()

    def at(self, s):
        s = max(0.0, min(self.L, s))
        lo, hi = 0, len(self.S) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if self.S[mid]['s'] <= s:
                lo = mid
            else:
                hi = mid
        a, b = self.S[lo], self.S[hi]
        t = 0.0 if b['s'] == a['s'] else (s - a['s']) / (b['s'] - a['s'])
        lerp = lambda u, v: (u * (1 - t) + v * t)
        T = lerp(a['T'], b['T']).normalized()
        R = lerp(a['R'], b['R'])
        R = (R - T * R.dot(T)).normalized()
        return dict(s=s, p=lerp(a['p'], b['p']), T=T, R=R, U=T.cross(R).normalized(), deck_half=lerp(a['deck_half'], b['deck_half']))

    def flat(self, s):
        """Horizontal heading frame for vertical structures (pylons, anchors)."""
        f = self.at(s)
        T = Vector((f['T'].x, 0.0, f['T'].z)).normalized()
        R = Vector((0, 1, 0)).cross(T).normalized()
        return dict(f, T=T, R=R, U=Vector((0, 1, 0)))

    def local(self, v):
        """Independent projection of a runtime point to (s, x, y) against the nearest sample."""
        _, i, _ = self.kd.find(v)
        q = self.S[i]
        d = v - q['p']
        return q['s'] + d.dot(q['T']), d.dot(q['R']), d.dot(q['U']), q['deck_half']


# ------------------------------------------------------------------ mesh helpers (runtime coords in, Blender out)
def B(v, off):
    w = K.to_bl(v.x, v.y, v.z)
    return Vector((w.x + off[0], w.y + off[1], w.z))


class Piece:
    def __init__(self, name, kind, role):
        self.name, self.kind, self.role, self.v, self.f = name, kind, role, [], []

    def ring_strip(self, rings, closed=True):
        n = len(rings[0])
        base = len(self.v)
        for r in rings:
            self.v += r
        for i in range(len(rings) - 1):
            for k in range(n if closed else n - 1):
                kn = (k + 1) % n
                a = base + i * n
                self.f.append((a + k, a + kn, a + n + kn, a + n + k))
        return base, n

    def cap(self, base, n, centre, flip=False):
        c = len(self.v)
        self.v.append(centre)
        for k in range(n):
            kn = (k + 1) % n
            self.f.append((c, base + kn, base + k) if not flip else (c, base + k, base + kn))

    def build(self, coll, off):
        ob = K.mesh_from(self.name, [B(v, off) for v in self.v], self.f, [self.role] * len(self.f))
        R3.move_to(ob, coll)
        ob['kfb_module'] = self.kind
        return ob


def frame_pt(F, x, y, z=0.0):
    return F['p'] + F['R'] * x + F['U'] * y + F['T'] * z


def tube(piece, pts, r, segs=12):
    rings = []
    for i, p in enumerate(pts):
        a = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        ref = Vector((0, 1, 0)) if abs(a.y) < 0.9 else Vector((1, 0, 0))
        u = a.cross(ref).normalized()
        w = a.cross(u).normalized()
        rings.append([p + (u * math.cos(2 * math.pi * k / segs) + w * math.sin(2 * math.pi * k / segs)) * r for k in range(segs)])
    b, n = piece.ring_strip(rings)
    piece.cap(b, n, pts[0], flip=True)
    piece.cap(b + (len(pts) - 1) * n, n, pts[-1])


def blob(piece, c, rx, ry, rz, segs=24, rings=14):
    rr = []
    for i in range(1, rings):
        v = math.pi * i / rings
        rr.append([c + Vector((rx * math.sin(v) * math.cos(2 * math.pi * k / segs), ry * math.cos(v),
                                rz * math.sin(v) * math.sin(2 * math.pi * k / segs))) for k in range(segs)])
    b, n = piece.ring_strip(rr)
    piece.cap(b, n, c + Vector((0, ry, 0)), flip=True)
    piece.cap(b + (len(rr) - 1) * n, n, c + Vector((0, -ry, 0)))


def rbox(piece, F, cx, cy, sx, sy, sz, segs=8):
    """Rounded box (superellipse section in x/z, straight in y) in a flat frame F, centred at lateral cx, bottom cy."""
    rings = []
    for yy in (cy, cy + sy):
        ring = []
        for k in range(segs * 4):
            th = 2 * math.pi * k / (segs * 4)
            c_, s_ = math.cos(th), math.sin(th)
            x = sx / 2 * math.copysign(abs(c_) ** 0.35, c_)
            z = sz / 2 * math.copysign(abs(s_) ** 0.35, s_)
            ring.append(frame_pt(F, cx + x, yy, z))
        rings.append(ring)
    b, n = piece.ring_strip(rings)
    piece.cap(b, n, frame_pt(F, cx, cy, 0), flip=True)
    piece.cap(b + n, n, frame_pt(F, cx, cy + sy, 0))


# ------------------------------------------------------------------ the family
DEFAULT = dict(
    tag='MB', s_pylons=None, s_anchors=None,                # route s of pylon stations / cable anchors (None = fixture defaults)
    above_deck=46.0, foot_y=-4.0,                           # pylon top above deck; foundation top (world y, from terrain/water owner)
    corridor_h=6.5, lat_clear=0.6,                          # clearance envelope above deck; lateral gap leg <-> deck edge
    cable_off=0.75, cable_r=0.55, hanger_r=0.16, hanger_step=9.0, sag_clear=2.4,
    leg_base=(4.2, 5.2), leg_top=(2.6, 3.4), leg_shape=1.3, bulge=0.10, portal=True, portal_rise=3.0,
)


def build_family(route, P, coll, off):
    out = []
    L = route.L
    s_py = P['s_pylons'] or [route.L * 0.44, route.L * 0.885]
    s_an = P['s_anchors'] or [s_py[0] - 130.0, s_py[1] + 74.5]
    deck = lambda s: route.at(s)
    tops = []
    for tag, s in zip('WE', s_py):
        F = route.flat(s)
        dh = F['deck_half']
        cable_x = dh + P['cable_off']
        y_deck = F['p'].y
        y_top = y_deck + P['above_deck']
        y_foot = P['foot_y']
        u_d = (y_deck - y_foot) / (y_top - y_foot)
        hw = lambda u, b=P['leg_base'], t=P['leg_top']: ((b[0] + (t[0] - b[0]) * u) / 2) * (1.0 + P['bulge'] * math.sin(math.pi * u) - 0.06 * u)
        u_c = (y_deck + P['corridor_h'] - y_foot) / (y_top - y_foot)      # top of the clearance envelope (legs lean inward)
        x_req = dh + P['lat_clear'] + hw(u_c)
        x_foot = cable_x + (x_req - cable_x) / max(0.05, (1 - u_c) ** P['leg_shape'])
        tops.append((s, y_top, cable_x))
        for side in (-1, 1):
            pc = Piece(f'SC01_{P["tag"]}_pylon_{tag}_{"R" if side > 0 else "L"}', 'scenery_pylon', 'arch')
            rows, segs = 60, 32
            rings = []
            for i in range(rows + 1):
                u = i / rows
                yy = y_foot + (y_top - y_foot) * u
                xc = side * (cable_x + (x_foot - cable_x) * (1 - u) ** P['leg_shape'])
                ax_, az_ = hw(u), hw(u, (P['leg_base'][1],) * 2, (P['leg_top'][1],) * 2)
                ring = []
                for k in range(segs):
                    th = 2 * math.pi * k / segs
                    c_, s_ = math.cos(th), math.sin(th)
                    ring.append(F['p'] + F['R'] * (xc + ax_ * math.copysign(abs(c_) ** (2 / 3.2), c_))
                                + Vector((0, yy - F['p'].y, 0)) + F['T'] * (az_ * math.copysign(abs(s_) ** (2 / 3.2), s_)))
                rings.append(ring)
            b, n = pc.ring_strip(rings)
            pc.cap(b, n, F['p'] + F['R'] * (side * x_foot) + Vector((0, y_foot - F['p'].y, 0)), flip=True)
            pc.cap(b + rows * n, n, F['p'] + F['R'] * (side * cable_x) + Vector((0, y_top - F['p'].y, 0)))
            out.append(pc)
            cr = Piece(f'SC01_{P["tag"]}_crown_{tag}_{"R" if side > 0 else "L"}', 'scenery_pylon', 'barrier_cap')
            blob(cr, F['p'] + F['R'] * (side * cable_x) + Vector((0, y_top + 1.2 - F['p'].y, 0)), 2.3, 2.6, 2.8)
            out.append(cr)
        pl = Piece(f'SC01_{P["tag"]}_plinth_{tag}', 'scenery_foundation', 'support')
        Ff = dict(F, p=Vector((F['p'].x, 0.0, F['p'].z)))
        rbox(pl, Ff, 0.0, y_foot - 7.5, 2 * x_foot + 9.0, 7.5, 12.0)
        out.append(pl)
        if P['portal']:
            span, rise, depth, th = 2 * cable_x, P['portal_rise'], 2.6, 2.2
            spring = y_top - 6.5
            Rr = (span * span / 4 + rise * rise) / (2 * rise)
            pt = Piece(f'SC01_{P["tag"]}_portal_{tag}', 'scenery_pylon', 'arch')
            rings = []
            for k in range(49):
                x = -span / 2 + span * k / 48
                yc = spring + rise - (Rr - math.sqrt(max(0.0, Rr * Rr - x * x)))
                ring = []
                for j in range(16):
                    a = 2 * math.pi * j / 16
                    ry = th / 2 * math.copysign(abs(math.sin(a)) ** 0.5, math.sin(a))
                    rz = depth / 2 * math.copysign(abs(math.cos(a)) ** 0.5, math.cos(a))
                    ring.append(F['p'] + F['R'] * x + Vector((0, yc + ry - F['p'].y, 0)) + F['T'] * rz)
                rings.append(ring)
            b, n = pt.ring_strip(rings)
            out.append(pt)
    # cables: world height h(s) over the route; horizontal position from the flat frame at s
    (sW, yW, cxW), (sE, yE, cxE) = tops
    y_mid = deck((sW + sE) / 2)['p'].y + P['sag_clear']
    s_mid_low = (sW + sE) / 2

    def h(s):
        if s < sW:
            u = (s - s_an[0]) / (sW - s_an[0])
            y0 = deck(s_an[0])['p'].y + 1.0
            return y0 + (yW - y0) * u - 6.0 * 4 * u * (1 - u)
        if s > sE:
            u = (s - sE) / (s_an[1] - sE)
            y1 = deck(s_an[1])['p'].y + 1.0
            return yE + (y1 - yE) * u - 6.0 * 4 * u * (1 - u)
        u = (s - sW) / (sE - sW)
        chord = yW + (yE - yW) * u
        return chord - (chord - y_mid) * 4 * u * (1 - u)
    hangers_meta = []
    for side in (-1, 1):
        cp = Piece(f'SC01_{P["tag"]}_cable_{"R" if side > 0 else "L"}', 'scenery_cable', 'cable')
        ss_ = [s_an[0] + (s_an[1] - s_an[0]) * k / 240 for k in range(241)]
        pts = []
        for s in ss_:
            F = route.flat(s)
            q = F['p'] + F['R'] * (side * (F['deck_half'] + P['cable_off']))
            pts.append(Vector((q.x, h(s), q.z)))
        tube(cp, pts, P['cable_r'])
        out.append(cp)
        hg = Piece(f'SC01_{P["tag"]}_hangers_{"R" if side > 0 else "L"}', 'scenery_cable', 'cable')
        br = Piece(f'SC01_{P["tag"]}_brackets_{"R" if side > 0 else "L"}', 'scenery_bracket', 'support')
        s = s_an[0] + P['hanger_step']
        while s < s_an[1] - 2:
            if min(abs(s - sW), abs(s - sE)) > 4.0:
                F = route.at(s)
                x = side * (F['deck_half'] + P['cable_off'])
                bottom = frame_pt(F, x, -0.25)
                top_y = h(s)
                if top_y - bottom.y > 1.2:
                    top = Vector((bottom.x, top_y, bottom.z))
                    tube(hg, [bottom, top], P['hanger_r'], 8)
                    # outrigger bracket: from the deck-edge socket (x = deck_half) out to the hanger (scenery hangs on the socket)
                    rb_c = side * (F['deck_half'] + (P['cable_off'] + 0.35) / 2)
                    rbox(br, dict(F, U=Vector((0, 1, 0))), rb_c, -0.75, P['cable_off'] + 0.35, 0.6, 0.7, 3)
                    hangers_meta.append(dict(s=round(s, 2), side=side, bottom=bottom, bracket_x=abs(x)))
            s += P['hanger_step']
        out += [hg, br]
        for tag, sa in zip('WE', s_an):
            F = route.flat(sa)
            ab = Piece(f'SC01_{P["tag"]}_anchor_{tag}_{"R" if side > 0 else "L"}', 'scenery_anchor', 'support')
            rbox(ab, F, side * (F['deck_half'] + P['cable_off'] + 0.8), -2.5, 2.4, 3.6, 3.0)
            out.append(ab)
    sockets = dict(
        pylons=[dict(tag=t, s=round(s, 2), frame='flat heading + world up', x=0.0, y='deck(s)', top_above_deck=P['above_deck'],
                     foot_y=P['foot_y'], cable_x='deck_half(s) + %.2f' % P['cable_off']) for t, (s, _, _) in zip('WE', tops)],
        anchors=[dict(tag=t, s=round(s, 2), x='±(deck_half(s) + %.2f)' % (P['cable_off'] + 0.8), y='deck(s) - 2.5') for t, s in zip('WE', s_an)],
        hangers=dict(step=P['hanger_step'], socket='deck_edge (x = ±deck_half(s)) via outrigger bracket', count=len(hangers_meta)),
        clearance=dict(corridor='|x| <= deck_half(s), 0 <= y <= %.1f' % P['corridor_h'], deck_body='|x| <= deck_half(s), -3.2 <= y < 0'),
    )
    return out, sockets, hangers_meta, (sW, sE, y_mid)


def checks(route, pieces, P, hangers_meta, span):
    """Independent checks on the final vertices (projection against the sample stream)."""
    corr, body, lat_min = 0, 0, 1e9
    for pc in pieces:
        for v in pc.v:
            s, x, y, dh = route.local(v)
            if s < -1 or s > route.L + 1:
                continue
            if abs(x) <= dh and 0.0 <= y <= P['corridor_h']:
                corr += 1
            if abs(x) <= dh and -3.2 <= y < 0.0 and pc.kind != 'scenery_bracket':
                body += 1
            if pc.kind == 'scenery_pylon' and 'portal' not in pc.name and -3.2 <= y <= P['corridor_h']:
                lat_min = min(lat_min, abs(x) - dh)
    drivable = sum(len(pc.f) for pc in pieces if pc.role in DRIVABLE_ROLES)
    sW, sE, y_mid = span
    cab = [pc for pc in pieces if pc.kind == 'scenery_cable' and 'cable' in pc.name]
    main_clear = 1e9
    for pc in cab:
        for v in pc.v:
            s, x, y, dh = route.local(v)
            if sW + 5 < s < sE - 5:
                main_clear = min(main_clear, y)
    gaps = [abs(route.local(hm['bottom'])[1]) - hm['bracket_x'] for hm in hangers_meta]
    return dict(
        corridor_intrusions=corr, deck_body_intrusions=body, drivable_faces=drivable,
        pylon_lateral_gap_min_m=round(lat_min, 3), pylon_lateral_gap_ok=lat_min >= P['lat_clear'] - 0.05,
        cable_underside_above_deck_main_m=round(main_clear, 3), cable_ok=main_clear >= P['sag_clear'] - P['cable_r'] - 0.05,
        hanger_socket_gap_max_m=round(max(abs(g) for g in gaps), 3) if gaps else None,
        hangers=len(hangers_meta),
        PASS=(corr == 0 and body == 0 and drivable == 0 and lat_min >= P['lat_clear'] - 0.05),
    )


def proxy(route, coll, off, tag):
    """Grey route proxy (NOT exported, NOT the road): shows where the Track Core ribbon will be."""
    v, f = [], []
    for i, q in enumerate(route.S[::4]):
        v += [B(q['p'] - q['R'] * q['deck_half'], off), B(q['p'] + q['R'] * q['deck_half'], off)]
        if i:
            a = 2 * (i - 1)
            f.append((a, a + 2, a + 3, a + 1))
    ob = K.mesh_from(f'SC01_{tag}_ROUTE_PROXY', v, f, ['ground'] * len(f), smooth=False)
    R3.move_to(ob, coll)
    ob['kfb_module'] = 'proxy'
    ob.display_type = 'WIRE'
    return ob


# ------------------------------------------------------------------ run
OFF0 = globals().get('SC_OFFSET', (800.0, -3000.0))
VARIANTS = globals().get('SC_VARIANTS', [dict(tag='MB')])
c = bpy.data.collections.get(COLL)
if c:
    for o in list(c.objects):
        me = o.data if o.type == 'MESH' else None
        bpy.data.objects.remove(o, do_unlink=True)
        if me is not None and me.users == 0:
            bpy.data.meshes.remove(me)
coll = R3.coll(COLL)
report = {}
for vi, V in enumerate(VARIANTS):
    P = dict(DEFAULT, **{k: v for k, v in V.items() if k not in ('route',)})
    rt = Route(V.get('route') or fixture_route(**V.get('route_args', {})))
    off = (OFF0[0] + V.get('dx', 0.0), OFF0[1])
    pieces, sockets, hm, span = build_family(rt, P, coll, off)
    objs = [pc.build(coll, off) for pc in pieces]
    proxy(rt, coll, off, P['tag'])
    ck = checks(rt, pieces, P, hm, span)
    report[P['tag']] = dict(checks=ck, sockets=sockets, route_len=round(rt.L, 1), objects=len(objs),
                            tris=sum(len(p.f) for p in pieces))
    if globals().get('SC_EXPORT'):
        out = D + '/SC01-BRIDGE-SHELLS/'
        os.makedirs(out + 'glb', exist_ok=True)
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs:
            o.select_set(True)
        fn = out + f'glb/sc01_bridge_shell_{P["tag"].lower()}_fixture.glb'
        bpy.ops.export_scene.gltf(filepath=fn, export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
        report[P['tag']]['glb_kb'] = os.path.getsize(fn) // 1024
if globals().get('SC_EXPORT'):
    meta = dict(schema='kfb.scenery-shell.v0', id='sc01-bridge-suspension', status='CANDIDATE · scenery only',
                rule='placed by route frame (frameAt(s)); no drivable geometry; stand-in route = RKIT-11 fixture profile until W0',
                variants=report)
    json.dump(meta, open(D + '/SC01-BRIDGE-SHELLS/sc01_bridge_shells.sockets.json', 'w'), indent=1, ensure_ascii=False, default=str)
result = {k: dict(v['checks'], tris=v['tris'], objects=v['objects'], route_len=v['route_len'], glb_kb=v.get('glb_kb')) for k, v in report.items()}
