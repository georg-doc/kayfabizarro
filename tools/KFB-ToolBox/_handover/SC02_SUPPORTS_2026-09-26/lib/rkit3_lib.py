"""RKIT-03 · architectural detail + long jump + thin flap (builds on rkit_lib / rkit2_lib).

Runs inside Georg's Blender (5.2) via exec, or headless bpy. Everything is created in named
collections so it can be toggled in the Outliner:
  RKIT03_01_Pfeiler      old pillar vs. new built pillar (footing, tapered shaft, capital, bearing plate)
  RKIT03_02_Sprung_weit  long step-down jump (boost jump) on a straight module
  RKIT03_03_Klappe_runter thin-deck flap-down (dive) with swing clearance
"""
import math
import bpy
from mathutils import Vector
import rkit_lib as K
import rkit2_lib as J


def coll(name):
    c = bpy.data.collections.get(name)
    if not c:
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
    return c


def move_to(ob, c):
    for old in list(ob.users_collection):
        old.objects.unlink(ob)
    c.objects.link(ob)
    return ob


def rounded_box(name, sx, sy, sz, bevel, role, loc=(0, 0, 0)):
    """Box with bevelled (rounded) edges, origin at its bottom centre (Blender Z up)."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(loc[0], loc[1], loc[2] + sz / 2))
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    m = ob.modifiers.new('bevel', 'BEVEL')
    m.width = bevel
    m.segments = 4
    m.limit_method = 'NONE'
    bpy.ops.object.modifier_apply(modifier=m.name)
    for p in ob.data.polygons:
        p.use_smooth = True
    ob.data.materials.append(K.role_material(role))
    return ob


PILLAR_STYLES = {
    # style layer only: footing position, capital disc, bearing plate and soffit contact never change
    'classic': dict(lobes=0, lobe_depth=0.0, twist_deg=0.0, bend=0.0, roots=False, waist=1.0),
    'trunk':   dict(lobes=5, lobe_depth=0.13, twist_deg=80.0, bend=0.45, roots=True, waist=1.0),
    'vine':    dict(lobes=3, lobe_depth=0.24, twist_deg=320.0, bend=0.95, roots=True, waist=0.86),
    'rope':    dict(lobes=4, lobe_depth=0.17, twist_deg=560.0, bend=0.0, roots=False, waist=0.95),
}


def _profile_r(prof, z):
    """Piecewise-linear radius of a lathe profile [(r, z)] at height z."""
    if z <= prof[0][1]:
        return prof[0][0]
    for (r0, z0), (r1, z1) in zip(prof, prof[1:]):
        if z0 <= z <= z1:
            return r0 + (r1 - r0) * (z - z0) / max(1e-6, z1 - z0)
    return prof[-1][0]


def organic_shaft(name, prof, cap_top, style, seed=1, segs=48):
    """Shaft with a lobed, twisted, gently bent cross-section (tree trunk / vine / rope look).
    The top 0.9 m (capital + disc) stays round and on the axis, so the plate contact is identical to 'classic'."""
    st = dict(PILLAR_STYLES['classic']); st.update(PILLAR_STYLES.get(style, {}) if isinstance(style, str) else style)
    import random
    rnd = random.Random(seed)
    ph = [rnd.uniform(0, 2 * math.pi) for _ in range(4)]
    z_bot = prof[0][1] - (0.8 if st['roots'] else 0.0)
    z_top = prof[-1][1]
    z_org = cap_top - 0.9                      # organic part ends here, capital above is round
    zs, z = [], z_bot
    while z < z_top - 1e-6:
        zs.append(z)
        z += 0.25 if z < z_org else 0.08
    zs.append(z_top)
    for pz in (p[1] for p in prof):            # keep the profile's exact key heights (disc edges)
        if pz > z_org and pz not in zs:
            zs.append(pz)
    zs = sorted(set(round(v, 4) for v in zs))
    verts, faces = [], []
    for z in zs:
        u = max(0.0, min(1.0, (z - z_bot) / max(1e-6, z_org - z_bot)))
        fade = 1.0 - R3smooth(0.8, 1.0, u)
        r0 = _profile_r(prof, max(z, prof[0][1]))
        if z < z_org:
            r0 *= 1.0 + (st['waist'] - 1.0) * math.sin(math.pi * u)
        if st['roots'] and z < prof[0][1] + 1.6:
            t = 1.0 - (z - z_bot) / (prof[0][1] + 1.6 - z_bot)
            r0 *= 1.0 + 0.45 * t * t
        a = st['lobe_depth'] * (1.0 + (1.6 if st['roots'] else 0.0) * max(0.0, 1.0 - u * 4)) * fade
        tw = math.radians(st['twist_deg']) * u ** 1.25
        cx = st['bend'] * math.sin(math.pi * u) * fade
        cy = 0.5 * st['bend'] * math.sin(2 * math.pi * u + ph[0]) * fade
        for k in range(segs):
            th = 2 * math.pi * k / segs
            wob = 0.03 * fade * (math.sin(2 * th + ph[1] + 3 * u) + math.sin(3 * th + ph[2] - 5 * u))
            r = r0 * (1.0 + a * math.cos(st['lobes'] * (th - tw)) + wob) if st['lobes'] else r0 * (1.0 + wob)
            verts.append(Vector((cx + r * math.cos(th), cy + r * math.sin(th), z)))
    rows = len(zs)
    for i in range(rows - 1):
        for k in range(segs):
            kn = (k + 1) % segs
            faces.append((i * segs + k, i * segs + kn, (i + 1) * segs + kn, (i + 1) * segs + k))
    b = len(verts); verts.append(Vector((0, 0, zs[0])))
    t = len(verts); verts.append(Vector((0, 0, zs[-1])))
    for k in range(segs):
        kn = (k + 1) % segs
        faces.append((b, kn, k))
        faces.append((t, (rows - 1) * segs + k, (rows - 1) * segs + kn))
    ob = K.mesh_from(name, verts, faces, ['support'] * len(faces))
    ob['kfb_pillar_style'] = style if isinstance(style, str) else 'custom'
    return ob


def R3smooth(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def build_support_v2(name, f, side, ground_y=0.0, frames=None, embed=0.25, style='classic', seed=1):
    """Built pillar: footing plinth sunk into the ground, shaft thick at the foot and slimmer at the top
    (runtime radii 2.3 -> 1.5 kept as the waist), a capital with a round disc (counterpart of the footing),
    and a bearing plate that carries the deck. Plate, disc and capital follow the real soffit (bank + grade).
    `style` only changes the shaft between footing and capital (classic / trunk / vine / rope or a dict);
    the contact with the track is identical for every style. Returns a list of objects."""
    half = f['w'] * 0.5
    off = side * half
    top = K.cross(f, off, -K.TB['undersideDropM'])
    H = top[1] - ground_y
    if H < 2.5:
        return []
    base = K.to_bl(top[0], ground_y, top[2])
    objs = []
    st = PILLAR_STYLES.get(style, {}) if isinstance(style, str) else style
    if not st.get('roots'):
        # footing: square plinth, 1.0 m visible above ground, 0.8 m sunk
        foot = rounded_box(name + '_footing', 6.2, 6.2, 1.8, 0.35, 'support', (base.x, base.y, base.z - 0.8))
        objs.append(foot)
    plate_t = 0.55
    cap_top = H - plate_t
    # shaft: thick foot (r 2.9 -> 2.3 waist) tapering to 1.5, capital flaring into a round disc (r 2.6)
    prof = [(2.9, 0.8), (2.75, 1.4), (2.3, 2.6), (1.9, max(3.0, cap_top * 0.45)), (1.55, max(3.4, cap_top - 2.2)),
            (1.6, cap_top - 1.2), (1.95, cap_top - 0.72), (2.2, cap_top - 0.5), (2.55, cap_top - 0.44),
            (2.62, cap_top - 0.36), (2.62, cap_top + 0.1), (2.55, cap_top + 0.16)]
    if style == 'classic':
        shaft = K.lathe(name + '_shaft', prof, segs=40)
    else:
        shaft = organic_shaft(name + '_shaft', prof, cap_top, style, seed=seed)
    shaft.location = base
    objs.append(shaft)
    # bearing plate, aligned with the track direction; sheared to the soffit plane
    tan = Vector((f['tx'], -f['tz'], 0.0)).normalized()
    nrm = Vector((f['nx'], -f['nz'], 0.0)).normalized()
    plate = rounded_box(name + '_bearing_plate', 5.6, 7.2, plate_t + 0.25, 0.22, 'underside',
                        (0, 0, 0))
    # orient: local X -> across (nrm), local Y -> along (tan)
    yaw = math.atan2(tan.y, tan.x) - math.pi / 2
    plate.rotation_euler = (0, 0, yaw)
    plate.location = (base.x, base.y, base.z + cap_top)
    bpy.context.view_layer.update()
    me = plate.data
    mw = plate.matrix_world
    inv = mw.inverted()
    hp = plate_t + 0.25
    if frames:
        # follow the real soffit under every plate vertex (bank and grade may change along the plate)
        near = [fr for fr in frames if (fr['x'] - f['x']) ** 2 + (fr['z'] - f['z']) ** 2 < 144]

        def soffit(wx, wy):
            rx, rz = wx, -wy                         # Blender -> runtime (x, z)
            g = min(near, key=lambda q: (q['x'] - rx) ** 2 + (q['z'] - rz) ** 2)
            off = (rx - g['x']) * g['nx'] + (rz - g['z']) * g['nz']
            along = (rx - g['x']) * g['tx'] + (rz - g['z']) * g['tz']
            return g['y'] + math.sin(g['bank']) * off + g.get('grade', 0.0) * along - K.TB['undersideDropM']
        for v in me.vertices:
            z0 = v.co.z
            w = mw @ v.co
            w.z = soffit(w.x, w.y) + embed - (hp - z0)
            v.co = inv @ w
        # capital top follows the plate underside, blended over the top 0.6 m (no gap on the high side)
        s0 = soffit(base.x, base.y)
        z_from = cap_top - 0.75
        for v in shaft.data.vertices:
            if v.co.z > z_from:
                k = min(1.0, (v.co.z - z_from) / 0.33)
                v.co.z += (soffit(base.x + v.co.x, base.y + v.co.y) - s0) * k
        shaft.data.update()
    else:
        slope = math.sin(f['bank'])
        grade = f.get('grade', 0.0)
        for v in me.vertices:
            w = mw @ v.co
            d = Vector((w.x - base.x, w.y - base.y, 0))
            w.z += slope * d.dot(nrm) + grade * d.dot(tan)
            v.co = inv @ w
    me.update()
    objs.append(plate)
    for o in objs:
        o['kfb_module'] = 'support_v2'
        o['kfb_pillar_style'] = style if isinstance(style, str) else 'custom'
    return objs


def thin_profile_factory(depth=0.8):
    """Profile with the lower body squeezed to `depth` m below the road (flap deck plate).
    Points above the road stay; below-road lifts scale by depth/2.25 -> no degenerate faces."""
    base = K.profile_metres
    k = depth / K.TB['undersideDropM']

    def prof(w):
        return [(o, (l if l >= 0 else l * k), r) for o, l, r in base(w)]
    return prof


def flap_down_thin(name, open_deg=16.0, w=18.0, approach=12.0, deck=22.0, exit_len=14.0, dive=30.0,
                   clearance=0.35, depth=0.8):
    """Flap-down v2: the moving part is a thin deck plate with its barriers (depth 0.8 m).
    Fixed parts (approach, level exit, dive ramp) keep the full volumetric body."""
    orig = K.profile_metres
    # thin deck via temporary profile swap
    slot = (depth + 0.15) * math.sin(math.radians(open_deg)) + 0.05
    objs = []
    fr_app = K.synthetic_frames(approach, w=w)
    objs.append(J.sweep_split(f'{name}_approach', fr_app, lambda f: 0.0))
    K.profile_metres = thin_profile_factory(depth)
    fr_deck = K.synthetic_frames(deck - clearance - slot, w=w)
    for f in fr_deck:
        f['z'] += approach + slot
    deck_ob = J.sweep_split(f'{name}_deck', fr_deck, lambda f: 0.0)
    K.profile_metres = orig
    hinge = bpy.data.objects.new(f'{name}_HINGE', None)
    bpy.context.scene.collection.objects.link(hinge)
    hinge.empty_display_type = 'ARROWS'
    hinge.location = K.to_bl(0, 0, approach)
    bpy.context.view_layer.update()
    deck_ob.parent = hinge
    deck_ob.matrix_parent_inverse = hinge.matrix_world.inverted()
    bw = K.TB['barrierOuterU'] * w
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.45, depth=bw, location=K.to_bl(0, -0.45, approach),
                                        rotation=(0, math.pi / 2, 0))
    barrel = bpy.context.active_object
    barrel.name = f'{name}_hinge_barrel'
    barrel.data.materials.append(K.role_material('support'))
    bpy.ops.object.shade_smooth()
    objs += [hinge, deck_ob, barrel]
    fr_exit = K.synthetic_frames(exit_len, w=w)
    for f in fr_exit:
        f['z'] += approach + deck
    objs.append(J.sweep_split(f'{name}_exit_level', fr_exit, lambda f: 0.0))
    a = math.radians(open_deg)
    L = deck - clearance
    end_y = -L * math.sin(a)
    end_z = approach + L * math.cos(a) + clearance + 0.6
    fr_dive = K.synthetic_frames(dive, w=w)
    for f in fr_dive:
        t = f['z'] / dive
        f['z'] = end_z + f['z']
        f['y'] = end_y - 0.6 * math.tan(a) - (math.tan(a) * dive * (t - 0.5 * t * t))
    objs.append(J.sweep_split(f'{name}_dive_ramp', fr_dive, lambda f: 0.0))
    hinge['kfb_module'] = 'flap_down_v2_thin'
    hinge['kfb_axis'] = 'local X across the track; rotation.x = -angle lifts the free end (three.js and Blender)'
    hinge['kfb_angle_closed_deg'] = 0.0
    hinge['kfb_angle_open_deg'] = -open_deg
    hinge['kfb_deck_depth_m'] = depth
    last = fr_dive[-1]
    hinge['kfb_dive_end_yz'] = [last['y'], last['z']]      # runtime y (up) and z (along) of the dive floor end
    return objs, hinge


class JumpSD(J.Jump):
    """Long step-down jump (RKIT-03). Kicker climbs to lip_h; the landing is a straight slope that starts
    below the lip (landing top = top_below under the lip) at the gap end and falls at land_deg down to a
    run-out, ending at deck level (entry and exit on the same level -> modular connector).
    Physics: C-3 values (g 19, full throttle 41, boost 48.5) as in RKIT-02; Race owns the flight."""

    def __init__(self, land_deg=10.2, top_below=0.8, ro=18.0, **kw):
        self.land_deg, self.top_below, self.L_ro_sd = land_deg, top_below, ro
        super().__init__(**kw)

    def _build_landing(self):
        t = math.tan(math.radians(self.land_deg))
        self.t_land = t
        self.y_top = self.h - self.top_below
        self.L_ro = self.L_ro_sd
        self.y_ro = t * self.L_ro / 3.0            # cubic run-out (slope -t -> 0) drops t*L/3... approx, fixed below
        self.x_k = self.gap                        # no knuckle curve: slope starts at the gap end
        self.x_ro = self.gap + (self.y_top - self.y_ro) / t
        self.x_end = self.x_ro + self.L_ro

    def landing_y(self, x):
        if x <= self.x_ro:
            return self.y_top - self.t_land * (x - self.gap)
        u = min(1.0, (x - self.x_ro) / self.L_ro)
        m = -self.t_land * self.L_ro
        h00, h10 = 2 * u ** 3 - 3 * u ** 2 + 1, u ** 3 - 2 * u ** 2 + u
        return self.y_ro * h00 + m * h10


# ---------------------------------------------------------------- Rapier-based jumps (WSA D1, 2026-09-24)
G_RAPIER = 15.0          # race/ Rapier gravity (m/s^2)
V_RAPIER = 27.0          # race/ Rapier maxSpeed (m/s)
RAMP_RAPIER_DEG = 16.3   # proven card ramp angle in race/


def flight_report(traj, traj_slope, land_y, land_slope, gap, speeds, th):
    """Touchdown table for any jump: traj(v,x)/land_y(x) relative to the lip, x horizontal from the lip."""
    out = {}
    for v in speeds:
        if traj(v, gap) <= land_y(gap):
            out[str(v)] = dict(result='falls into the gap')
            continue
        x = gap
        while traj(v, x) > land_y(x) and x < gap + 200:
            x += 0.02
        imp = math.degrees(math.atan(-traj_slope(v, x))) - math.degrees(math.atan(-land_slope(x)))
        out[str(v)] = dict(touchdown_from_lip_m=round(x, 1), touchdown_below_lip_m=round(-land_y(x), 1),
                           impact_angle_deg=round(imp, 1), airtime_s=round(x / (v * math.cos(th)), 2))
    return out


class HeroJump30:
    """JUMP_HERO_30: step-down module on Rapier numbers. Entry deck is high, a short kicker (kick_h) gives the
    lip angle, a 30 m gap, then a landing that follows a design flight path (v_d) shifted down so that its top
    lies `top_below` under the lip; below the knuckle it continues straight at `amax` and eases into the exit
    deck. Heights relative to the LIP. All lengths horizontal, metres."""

    def __init__(self, lip_deg=RAMP_RAPIER_DEG, kick_h=1.5, kick=12.0, stage=20.0, gap=30.0, top_below=3.0,
                 v_d=28.0, amax=30.0, ro=24.0, g=G_RAPIER, catch_speed=V_RAPIER, margin=4.0,
                 w=18.0, fan_w=21.6):
        self.th, self.kick_h, self.kick, self.stage, self.gap = math.radians(lip_deg), kick_h, kick, stage, gap
        self.top_below, self.v_d, self.t, self.ro, self.g = top_below, v_d, math.tan(math.radians(amax)), ro, g
        self.w, self.fan_w = w, fan_w
        self.s_lip = stage + kick
        self.s_land = self.s_lip + gap
        c = math.cos(self.th)
        self.d = self.traj(v_d, gap) + top_below
        self.x_k = (math.tan(self.th) + self.t) * v_d * v_d * c * c / g
        self.y_k = self.traj(v_d, self.x_k) - self.d
        # exit level: below the touchdown of the fastest regular speed plus margin along the straight
        self.x_ro, self.y_ro = 1e9, -1e9
        x = gap
        while self.traj(catch_speed, x) > self._curve(x):
            x += 0.05
        x_catch = max(x + margin, self.x_k + 2.0)
        self.y_ro = self._curve(x_catch)
        self.x_ro = x_catch
        self.exit_rel = self.y_ro - self.t * ro / 2.0       # Hermite (slope -t -> 0) over ro, y drops ~ t*ro/2
        self.x_end = self.x_ro + ro
        self.entry_rel = -kick_h                              # entry deck relative to the lip

    def traj(self, v, x):
        c = math.cos(self.th)
        return math.tan(self.th) * x - self.g * x * x / (2 * v * v * c * c)

    def traj_slope(self, v, x):
        c = math.cos(self.th)
        return math.tan(self.th) - self.g * x / (v * v * c * c)

    def _curve(self, x):
        if x <= self.x_k:
            return self.traj(self.v_d, x) - self.d
        return self.y_k - self.t * (x - self.x_k)

    def land_y(self, x):
        if x <= self.x_ro:
            return self._curve(x)
        u = min(1.0, (x - self.x_ro) / self.ro)
        h00, h10, h01 = 2 * u ** 3 - 3 * u ** 2 + 1, u ** 3 - 2 * u ** 2 + u, -2 * u ** 3 + 3 * u ** 2
        return self.y_ro * h00 + (-self.t * self.ro) * h10 + self.exit_rel * h01

    def land_slope(self, x, e=0.05):
        return (self.land_y(x + e) - self.land_y(x - e)) / (2 * e)

    def kicker_rel(self, s):          # relative to the lip, s from module start
        if s <= self.stage:
            return self.entry_rel
        u = (s - self.stage) / self.kick
        m1 = math.tan(self.th) * self.kick
        return self.entry_rel + self.kick_h * (3 * u * u - 2 * u ** 3) + m1 * (u ** 3 - u * u)

    def total(self):
        return self.s_lip + self.x_end + 10

    def top(self, s):                 # deck top relative to the lip; None in the gap
        if s <= self.s_lip:
            return self.kicker_rel(s)
        if s < self.s_land:
            return None
        return self.land_y(min(s - self.s_lip, self.x_end))

    def width(self, s):
        def ss(a, b, x):
            t = max(0.0, min(1.0, (x - a) / (b - a)))
            return t * t * (3 - 2 * t)
        if s <= self.s_lip:
            return self.w
        x = s - self.s_lip
        return self.w + (self.fan_w - self.w) * (ss(self.gap, self.gap + 4, x) - ss(self.x_ro, self.x_end, x))

    def v_min(self):
        lo, hi = 5.0, 80.0
        for _ in range(60):
            mid = (lo + hi) / 2
            if self.traj(mid, self.gap) > self.land_y(self.gap):
                hi = mid
            else:
                lo = mid
        return hi

    def report(self, speeds=(22.0, 23.0, 24.0, 25.0, 26.0, 27.0)):
        return dict(module='JUMP_HERO_30', physics='Rapier race/ (g 15, maxSpeed 27) - design aid, Race verifies',
                    lip_deg=round(math.degrees(self.th), 1), kicker_rise_m=self.kick_h, gap_m=self.gap,
                    landing_top_below_lip_m=self.top_below, exit_below_lip_m=round(-self.exit_rel, 1),
                    entry_below_lip_m=self.kick_h, step_down_entry_to_exit_m=round(self.kick_h - self.exit_rel - self.kick_h * 2 + self.kick_h, 1),
                    landing_design_speed=self.v_d, landing_max_deg=round(math.degrees(math.atan(self.t)), 1),
                    v_min_clear_ms=round(self.v_min(), 1), length_m=round(self.total(), 1),
                    speeds=flight_report(self.traj, self.traj_slope, self.land_y, self.land_slope, self.gap,
                                         speeds, self.th))


class TableJump12(J.Jump):
    """JUMP_BASE_12 on Rapier numbers: a TABLETOP. The 12 m 'gap' is filled with a flat table at lip height,
    so a slow car rolls over it (forgiving, cannot fall in); fast cars fly and land on a landing that follows
    the 27 m/s flight path (flush with the table at its end), then run out to deck level."""

    def __init__(self, lip_deg=12.0, lip_h=3.0, table=12.0, stage=20.0, kick=14.0, v_design=V_RAPIER,
                 g=G_RAPIER, **kw):
        c = math.cos(math.radians(lip_deg))
        t = math.tan(math.radians(lip_deg))
        drop = (t * table - g * table * table / (2 * v_design * v_design * c * c))   # landing flush with table
        super().__init__(stage=stage, kick=kick, lip_deg=lip_deg, lip_h=lip_h, gap=table, drop=drop,
                         v_design=v_design, g=g, hero_w=21.6, fan=1.0, **kw)

    def top_dy(self, s):
        if self.s_lip < s < self.s_land:
            return self.h                      # the table
        return super().top_dy(s)

    def report(self, speeds=(12.0, 16.0, 20.0, 24.0, 27.0)):
        tr = lambda v, x: self.traj(v, x) - self.h
        ly = lambda x: (0.0 if x < self.gap else self.landing_y(x) - self.h)
        ls = lambda x, e=0.05: (ly(x + e) - ly(x - e)) / (2 * e)
        out = {}
        for v in speeds:
            x = 0.05
            while tr(v, x) > ly(x) and x < 200:
                x += 0.02
            imp = math.degrees(math.atan(-self.traj_slope(v, x))) - math.degrees(math.atan(-ls(x)))
            out[str(v)] = dict(touchdown_from_lip_m=round(x, 1), lands_on='table' if x < self.gap else 'landing',
                               impact_angle_deg=round(imp, 1), airtime_s=round(x / (v * math.cos(self.th)), 2))
        return dict(module='JUMP_BASE_12 (tabletop)', physics='Rapier race/ (g 15, maxSpeed 27) - design aid',
                    lip_deg=round(math.degrees(self.th), 1), lip_height_m=self.h, table_len_m=self.gap,
                    falls_in_gap='never (table)', length_m=round(self.total(), 1), speeds=out)


# ---------------------------------------------------------------- width funnel, sandbank bowl, city street
def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def path_frames(segments, w=18.0, step=0.5, bank_rule=True, ease=0.25):
    """Frames along chained segments [(length_m, radius_m or None, turn_deg)], heading starts +z.
    Bank per runtime rule clamp(26/R, 0.42), eased to 0 at both ends of every arc (joints stay flat)."""
    frames, x, z, hdg, s_tot = [], 0.0, 0.0, 0.0, 0.0
    for (length, radius, turn) in segments:
        if radius:
            length = radius * math.radians(abs(turn))
        n = max(2, int(round(length / step)))
        curv = (math.radians(turn) / length) if radius else 0.0
        full = max(-0.42, min(0.42, 26.0 / radius)) * (1 if turn >= 0 else -1) if (radius and bank_rule) else 0.0
        for k in range(n):
            u = k / n
            r = min(1.0, min(u, 1 - u) / ease) if ease > 0 else 1.0
            r = r * r * (3 - 2 * r)
            tx, tz = math.sin(hdg), math.cos(hdg)
            frames.append(dict(x=x, y=0.0, z=z, tx=tx, tz=tz, nx=tz, nz=-tx, w=w, bank=full * r, grade=0.0,
                               kind='MODULE', fi=len(frames), s=s_tot))
            ds = length / n
            hdg_mid = hdg + curv * ds / 2
            x += math.sin(hdg_mid) * ds
            z += math.cos(hdg_mid) * ds
            hdg += curv * ds
            s_tot += ds
    tx, tz = math.sin(hdg), math.cos(hdg)
    frames.append(dict(x=x, y=0.0, z=z, tx=tx, tz=tz, nx=tz, nz=-tx, w=w, bank=0.0, grade=0.0, kind='MODULE',
                       fi=len(frames), s=s_tot))
    return frames


def funnel_frames(length=36.0, w0=21.6, w1=10.8):
    """WIDTH FUNNEL: smoothstep from w0 to w1 over the module (grammar: 18-36 m, smoothstep)."""
    fr = K.synthetic_frames(length, w=w0)
    for f in fr:
        f['w'] = w0 + (w1 - w0) * smoothstep(0.0, length, f['z'])
    return fr


def bowl_frames(radius=50.0, turn_deg=90.0, w_edge=18.0, w_apex=28.8, lead=12.0, outward=True):
    """SANDBANK / STUNT_BOWL: banked curve whose width grows toward the apex and back (sin^2 over the arc).
    The inner edge stays on the design line; the extra width goes to the OUTSIDE of the curve.
    28.8 m is the explicit special profile STUNT_BOWL (WSA D2), not a normal width class."""
    fr = path_frames([(lead, None, 0.0), (0.0, radius, turn_deg), (lead, None, 0.0)], w=w_edge)
    s0, s1 = lead, lead + radius * math.radians(abs(turn_deg))
    sgn = 1 if turn_deg >= 0 else -1
    for f in fr:
        u = max(0.0, min(1.0, (f['s'] - s0) / (s1 - s0)))
        f['w'] = w_edge + (w_apex - w_edge) * math.sin(math.pi * u) ** 2
        d = (f['w'] - w_edge) * 0.5 if outward else 0.0
        # positive turn = right turn, centre on the +normal side -> outside is -normal
        f['x'] -= sgn * f['nx'] * d
        f['z'] -= sgn * f['nz'] * d
    return fr


def bowl_check(fr, radius, turn_deg):
    """Done-condition: centre-line radius / outer barrier offset >= 2 everywhere (no fold)."""
    worst = 99.0
    for f in fr:
        if abs(f['bank']) < 1e-6:
            continue
        d = (f['w'] - fr[0]['w']) * 0.5
        r_c = radius + d
        off = K.TB['barrierOuterU'] * f['w'] * 0.5
        worst = min(worst, r_c / off)
    return round(worst, 2)


STREET_CURB_H = 0.15      # kerb height above the road (m)
STREET_WALK = 2.5         # sidewalk width each side (m)
STREET_SLAB = 0.6         # slab depth below the road (m)


def street_profile(w):
    """City street: road, kerb, sidewalk, thin slab. No volumetric barrier. Same role names as the track
    (road / barrier_side = kerb faces / shoulder = sidewalk / underside), so any palette maps 1:1."""
    h = w * 0.5
    ch, sw, sd = STREET_CURB_H, STREET_WALK, STREET_SLAB
    poly = [(-h, 0.0, 'road'), (h, 0.0, 'barrier_side'), (h + 0.02, ch, 'shoulder'), (h + sw, ch, 'barrier_side'),
            (h + sw, -sd, 'underside'), (-h - sw, -sd, 'barrier_side'), (-h - sw, ch, 'shoulder'),
            (-h - 0.02, ch, 'barrier_side')]
    radii = [0.03, 0.03, 0.05, 0.08, 0.15, 0.15, 0.08, 0.05]
    pts, flags = K._fillet([(o, l) for o, l, _ in poly], radii, seg=3)
    roles = [poly[i - 1][2] if k * 2 < seg else poly[i][2] for i, k, seg in flags]
    return [(o, l, r) for (o, l), r in zip(pts, roles)]


def sweep_with_profile(name, frames, prof_fn):
    orig = K.profile_metres
    K.profile_metres = prof_fn
    try:
        return K.sweep_body(name, frames)
    finally:
        K.profile_metres = orig


# ---------------------------------------------------------------- palette readiness (existing owner, no new system)
# RKIT role -> runtime role in cologne-palette.v1.js (verified: the measured palette reproduces ROLE_HEX exactly)
PALETTE_ROLE_MAP = dict(road='bed', shoulder='shoulder', barrier_side='shoulderLo', barrier_cap='lineOrange',
                        underside='structureLo', support='structure', arch='bedLight', edge_line='lineOuter',
                        skirt=('buildings', 5), ground=('roofs', 2))


def palette_hex(pal, role):
    m = PALETTE_ROLE_MAP[role]
    return pal[m[0]][m[1]] if isinstance(m, tuple) else pal['roles'][m]


def apply_palette(objs, pal, suffix):
    """Give these objects their own copy of every KFB_<role> material, coloured from a kfb-palette/v1 set."""
    for o in objs:
        if o.type != 'MESH':
            continue
        for i, m in enumerate(o.data.materials):
            if not m or 'kfb_role' not in m:
                continue
            role = m['kfb_role']
            nm = f'KFB_{role}@{suffix}'
            nmat = bpy.data.materials.get(nm)
            if not nmat:
                nmat = m.copy()
                nmat.name = nm
                hx = int(palette_hex(pal, role).lstrip('#'), 16)
                rgb = [K.srgb_to_lin((hx >> s) & 255) for s in (16, 8, 0)]
                nmat.diffuse_color = (*rgb, 1.0)
                if nmat.node_tree and nmat.node_tree.nodes.get('Principled BSDF'):
                    nmat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*rgb, 1.0)
                nmat['kfb_palette'] = pal['label']
            o.data.materials[i] = nmat


# ---------------------------------------------------------------- tunnel (closes the dive of FLAP_DOWN_V2)
def arch_shell(name, frames, clear_h=6.5, shell=0.9, extra=0.4, role_in='underside', role_out='arch', segs=24):
    """Cartoon tunnel roof: a thick semi-elliptic shell over the track, feet on the road level beside the
    barriers. Quad-only mesh (inner, outer, feet, both end rims) so it exports cleanly."""
    verts, faces, roles = [], [], []
    rings = []
    for f in frames:
        hw = K.TB['barrierOuterU'] * f['w'] * 0.5 + extra
        ring = []
        for k in range(segs + 1):
            a = math.pi * k / segs                     # 0 = right foot, pi = left foot
            ring.append((math.cos(a) * hw, math.sin(a) * clear_h))
        outer = [(o * (hw + shell) / hw, l * (clear_h + shell) / clear_h) for o, l in ring]
        idx_in, idx_out = [], []
        for (o, l) in ring:
            idx_in.append(len(verts)); verts.append(K.to_bl(*K.cross(f, o, l - 0.3)))
        for (o, l) in outer:
            idx_out.append(len(verts)); verts.append(K.to_bl(*K.cross(f, o, l - 0.3)))
        rings.append((idx_in, idx_out))
    for (ai, ao), (bi, bo) in zip(rings, rings[1:]):
        for k in range(segs):
            faces.append((ai[k], bi[k], bi[k + 1], ai[k + 1])); roles.append(role_in)
            faces.append((ao[k], ao[k + 1], bo[k + 1], bo[k])); roles.append(role_out)
        for k in (0, segs):                             # feet
            faces.append((ai[k], ao[k], bo[k], bi[k]) if k == 0 else (ai[k], bi[k], bo[k], ao[k])); roles.append(role_out)
    for (ri, ro), flip in ((rings[0], False), (rings[-1], True)):   # end rims
        for k in range(segs):
            q = (ri[k], ri[k + 1], ro[k + 1], ro[k])
            faces.append(q[::-1] if flip else q); roles.append(role_out)
    ob = K.mesh_from(name, verts, faces, roles)
    ob['kfb_module'] = 'tunnel_shell'
    ob['kfb_clear_height_m'] = clear_h
    return ob


def tunnel_module(name, y0, z0, length=60.0, w=18.0, clear_h=6.5, lead=4.0, portal_len=1.6):
    """TUNNEL_60: flat track continuing from (y0, z0) with a shell roof and two thicker portal rings."""
    fr = K.synthetic_frames(length, w=w)
    for f in fr:
        f['y'] = y0
        f['z'] += z0
    objs = [K.sweep_body(f'{name}_floor', fr), K.edge_lines(f'{name}_lines', fr)]
    body = [f for f in fr if z0 + lead + 0.5 <= f['z'] <= z0 + length - lead - 0.5]
    objs.append(arch_shell(f'{name}_roof', body, clear_h=clear_h))
    p_in = [f for f in fr if z0 + lead <= f['z'] <= z0 + lead + portal_len]      # roof ends hide inside the portals
    p_out = [f for f in fr if z0 + length - lead - portal_len <= f['z'] <= z0 + length - lead]
    for tag, part in (('in', p_in), ('out', p_out)):
        objs.append(arch_shell(f'{name}_portal_{tag}', part, clear_h=clear_h - 0.35, shell=1.6, extra=0.1,
                               role_in='barrier_cap', role_out='barrier_cap'))
    for o in objs:
        o['kfb_module'] = o.get('kfb_module', 'tunnel')
    return objs
