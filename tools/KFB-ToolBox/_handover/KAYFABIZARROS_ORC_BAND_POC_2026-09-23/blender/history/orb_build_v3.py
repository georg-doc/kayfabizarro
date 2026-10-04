"""
KFB · ORB-P1 · The KayfaBizarros band module — Blender build script (clips + attachments)

Run inside the ORB blend after assets are imported and placed (see RETURN for the layout step).
Everything that must follow a body in the runtime is PARENTED (bone / object), not baked:
  - drumsticks  -> Rig_Brute handslot.l / handslot.r   (identity rule, scale 2 like the Atlas)
  - microphone  -> character_orcBArmRight              (Legacy: prop on the arm piece, Atlas #10)
  - guitar_B    -> Rig_Raider chest                    (constructive hold, Atlas S28)
Clips are beat-normalised: FPB frames = 1 beat. The player maps beatPos -> clip time, so the
same clips follow any track / BPM (visualizer use).
  NLA track "drum"   : Brute, 2 beats (L hits beat 0, R hits beat 1)
  NLA track "strum"  : Raider, 1 beat (down-stroke crosses the strings on the beat)
  NLA track "bounce" : Orc B leader, 1 beat (contact/squash on the beat, apex on the off-beat)
"""
import bpy, math
from math import radians, sin, cos, pi
from mathutils import Vector, Matrix, Quaternion, Euler

ORB = "/Users/georgv.westphalen/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama KFB + PET Editor + PDF VIewer/3D ASSETS/BLENDER MCP/ORB/"
T = {}
exec(open(ORB + "kfb_pose_tools.py").read(), T)
aim, reach_best, reset, identity_offset, prop_matrix = T['aim'], T['reach_best'], T['reset'], T['identity_offset'], T['prop_matrix']

FPB = 24
sc = bpy.context.scene
vl = bpy.context.view_layer
O = bpy.data.objects
sc.render.fps = 24


# ------------------------------------------------------------------ helpers
def new_action(obj, name):
    if not obj.animation_data:
        obj.animation_data_create()
    ad = obj.animation_data
    ad.action = None
    for t in list(ad.nla_tracks):
        ad.nla_tracks.remove(t)
    old = bpy.data.actions.get(name)
    if old:
        bpy.data.actions.remove(old)
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    ad.action = act
    return act


def push_to_nla(obj, track, frames):
    ad = obj.animation_data
    act = ad.action
    act.use_frame_range = True
    act.frame_start, act.frame_end = 0, frames
    act.use_cyclic = True
    tr = ad.nla_tracks.new(); tr.name = track
    st = tr.strips.new(track, 0, act)
    st.action_frame_start, st.action_frame_end = 0, frames
    ad.action = None


def key_bones(rig, names, f):
    for n in names:
        pb = rig.pose.bones[n]
        pb.keyframe_insert('rotation_quaternion', frame=f, group=n)
        pb.keyframe_insert('location', frame=f, group=n)


def parent_keep(child, parent, bone=None):
    mw = child.matrix_world.copy()
    child.parent = parent
    if bone:
        child.parent_type = 'BONE'; child.parent_bone = bone
    else:
        child.parent_type = 'OBJECT'
    vl.update()
    child.matrix_world = mw
    vl.update()


def ease_segments(obj, rules):
    """rules: list of (frame_from, interpolation, easing). Applies to every key at frame_from."""
    ad = obj.animation_data
    act = ad.action
    fcs = []
    try:
        fcs = list(act.fcurves)
    except AttributeError:  # Blender 5 layered actions
        for layer in act.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    fcs += list(cb.fcurves)
    for fc in fcs:
        for kp in fc.keyframe_points:
            for fr, interp, easing in rules:
                if abs(kp.co.x - fr) < 0.01:
                    kp.interpolation = interp
                    kp.easing = easing


# ------------------------------------------------------------------ BRUTE · war drum (v2: donor-based)
# Mental model v3 (Georg 2026-09-23, 3rd pass — v1 twisted arms, v2 "plays from the wrist, bent down"):
#   a big orc pounds the war drum with LONG ARMS and a nearly STRAIGHT WRIST; the motion comes from the
#   shoulder, the stick lands on the INNER part of the head (not the near third) and bounces.
#   Method ("anchor & target", IK not FK): every key pose is found by a small search —
#     wrist target on a sphere around the shoulder (distance d ~ arm length -> elbow 130-150 deg),
#     Blender IK (upperarm+lowerarm, pole point = elbow direction), then forearm twist + a hand flex
#     limited to +-15 deg (the "wrist limit"). The score is the stick-tip distance to a TIP TARGET.
#   Tip targets are world points (right arm; left arm = x mirrored). Drum head top z = 1.47.
#   The KayKit stick sits perpendicular in the fist and is 1.28 m long at Atlas scale 2 — so at impact the
#   arm is almost level (pitch ~10 deg below the shoulder) and the stick points down onto the head.
DRUM = {'scale': 1.6, 'loc': (0.0, -0.55, 0.0)}
STANCE = {'lean': 16, 'twist': 6, 'drop': 0.06}
BRUTE_LOC = (0.0, 1.5, 0.0)
# The big left pauldron (OrcBrute_Shoulderpad) is skinned 100 % to 'chest' in the source asset, so ANY forward
# arm raise pushes the elbow/forearm guard into it (Georg: "Unterarmschutz steckt in der Schulterruestung").
# Fix like a real strapped pauldron: it follows the upper arm part-way (chest 0.4 / upperarm.l 0.6).
# Measured over the 48-frame loop: forearm-guard/pad overlap 44-267 faces per frame (0.0) -> 0 on every frame (0.6);
# pad/head 0; 0.5 left 40, 0.9+ pushes the pad into the head.
PAD_FOLLOW = 0.6
WRIST_LIMIT = 15                     # max hand flex (deg) against the forearm
# phase: (tip target (x for the RIGHT arm, world), arm distances d, pitches (deg, + = below shoulder), yaws (deg inward))
DRUM_KEYS = {
    'IMPACT':  ((-0.30, -0.40, 1.52), (1.12, 1.16), (0, 4, 8, 12), (5, 10, 15, 20)),
    'REBOUND': ((-0.35, -0.35, 2.05), (1.12, 1.16), (-24, -16, -8), (0, 5, 10)),
    'LIFT':    (('S', -0.55, 0.00, 1.30), (1.1, 1.16), (-45, -35, -25), (-25, -15, -5)),   # arm travels up OUTSIDE the head
    'SWING':   ((-0.75, -0.25, 2.90), (1.05, 1.12), (-50, -40, -30), (-10, 0, 5)),     # comes down outside the head
    'WINDUP':  (('S', -0.45, 0.40, 1.60), (1.1, 1.16), (-65, -55, -45), (-25, -12, 0)),   # long arm: no forearm fold into the pauldron
}
POLES = ((1.0, 0.5, -0.8), (1.2, 0.3, 0.0), (1.0, -0.3, -0.6), (0.4, 0.2, -1.2))   # elbow out/back/down (x mirrored per side)


def drum_key(rig, side, phase, roll_ref=None, spec=None):
    """Search + apply one key pose for one arm (see mental model). Returns a measurement dict."""
    pb = rig.pose.bones; s = side; sx = 1 if s == 'l' else -1
    tip_t, ds, pits, yaws = spec or DRUM_KEYS[phase]
    S = rig.matrix_world @ pb[f'upperarm.{s}'].head
    if isinstance(tip_t, Vector):
        tgt = tip_t.copy()
    elif tip_t[0] == 'S':
        tgt = S + Vector((tip_t[1] if s == 'r' else -tip_t[1], tip_t[2], tip_t[3]))
    else:
        tgt = Vector((tip_t[0] if s == 'r' else -tip_t[0], tip_t[1], tip_t[2]))
    L = identity_offset(rig, s)
    # clearance: forearm (guard radius ~0.2) and stick must stay outside the head and the chest-fixed shoulder pad
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); obst = []
    for n in ('OrcBrute_Head',):
        oe = O[n].evaluated_get(dg); me = oe.to_mesh()
        obst.append(BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], [p.vertices[:] for p in me.polygons]))
        oe.to_mesh_clear()
    Mw = rig.matrix_world
    # the pauldron follows the upper arm half-way (PAD_FOLLOW), so it is measured on the EVALUATED mesh
    # of the candidate pose. Distances from the forearm centre line; the forearm guard is ~0.3 thick
    # (calibrated: 0 face overlaps at >= 0.24 elbow / 0.33 forearm).
    padO = O['OrcBrute_Shoulderpad']

    def pad_tree():
        de = bpy.context.evaluated_depsgraph_get(); oe = padO.evaluated_get(de); me = oe.to_mesh()
        t = BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], [p.vertices[:] for p in me.polygons]); oe.to_mesh_clear()
        return t

    def clash(P):
        pts = []
        a = Mw @ pb[f'lowerarm.{s}'].head; b = Mw @ pb[f'hand.{s}'].tail
        pts += [(a, 0.15)] + [(a.lerp(b, t), 0.20) for t in (0.3, 0.6, 1.0)]
        g0 = P @ Vector((0, 0, 0)); g1 = P @ Vector((0, 0, 0.642))
        pts += [(g0.lerp(g1, t), 0.08) for t in (0.25, 0.5, 0.75, 1.0)]
        pen = 0.0
        if s == 'l':                                       # forearm guard vs pauldron (left side only)
            PT = pad_tree()
            for q, rad in [(a, 0.25)] + [(a.lerp(b, t), 0.34) for t in (0.25, 0.5, 0.75)]:
                loc, nor, _, dist = PT.find_nearest(q)
                if loc is not None and dist < rad: pen += (rad - dist)
        for q, rad in pts:
            for tr in obst:
                loc, nor, _, dist = tr.find_nearest(q)
                if loc is None: continue
                inside = (q - loc).dot(nor) < 0
                gap = -dist if inside else dist
                if gap < rad: pen += (rad - gap)
        return pen

    best = None
    for d in ds:
        for pit in pits:
            for yaw in yaws:
                p, y = radians(pit), radians(yaw)
                W = S + d * Vector((-sx * sin(y) * cos(p), -cos(y) * cos(p), -sin(p)))   # yaw turns the arm inward
                for pole in POLES:
                    P_ = S + Vector((sx * pole[0], pole[1], pole[2]))
                    T['ik_arm'](rig, s, W, P_, (0, 0))
                    el, _ = T['joint_angles'](rig, s)
                    q0 = pb[f'lowerarm.{s}'].rotation_quaternion.copy()
                    for tw in range(-180, 180, 15):
                        pb[f'lowerarm.{s}'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(tw))
                        for fx in (-WRIST_LIMIT, 0, WRIST_LIMIT):
                            pb[f'hand.{s}'].rotation_quaternion = Euler((radians(fx), 0, 0)).to_quaternion(); vl.update()
                            Pm = prop_matrix(rig, s, L, 2.0)
                            tp = Pm @ Vector((0, 0, 0.642))
                            e = (tp - tgt).length
                            # elbow < 125 deg folds the forearm back onto the (mirrored) pauldron -> strongly avoided
                            sc_ = e + max(0, 135 - el) * 0.004 + max(0, 125 - el) * 0.03 + abs(fx) * 0.002 + abs(tw) * 0.0003
                            if best is not None and sc_ >= best[0]:
                                continue
                            sc_ += 6.0 * clash(Pm)
                            if roll_ref is not None:                # forearm roll stays close to the strike roll (no spins between keys)
                                qr = roll_ref.inverted() @ pb[f'lowerarm.{s}'].rotation_quaternion
                                sc_ += abs(math.degrees(2 * math.atan2(qr.y, qr.w) + math.pi) % 360 - 180) * 0.004
                            if best is None or sc_ < best[0]:
                                best = (sc_, dict(W=W.copy(), P=P_.copy(), tw=tw, fx=fx, err=round(e, 3), elbow=el, d=d, pit=pit, yaw=yaw, clash=round(clash(Pm), 3)))
    k = best[1]
    T['ik_arm'](rig, s, k['W'], k['P'], (0, 0))
    q0 = pb[f'lowerarm.{s}'].rotation_quaternion.copy()
    pb[f'lowerarm.{s}'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(k['tw']))
    pb[f'hand.{s}'].rotation_quaternion = Euler((radians(k['fx']), 0, 0)).to_quaternion()
    pb[f'wrist.{s}'].rotation_quaternion = (1, 0, 0, 0)
    vl.update()
    return {kk: k[kk] for kk in ('err', 'elbow', 'fx', 'tw', 'd', 'pit', 'yaw', 'clash')}


def build_drum():
    rig = O['Rig_Brute']; drum = O['Orc_Wardrum']
    rig.location = BRUTE_LOC
    drum.scale = (DRUM['scale'],) * 3; drum.location = DRUM['loc']
    pad = O['OrcBrute_Shoulderpad']; idx = [v.index for v in pad.data.vertices]
    for g, w in (('chest', 1 - PAD_FOLLOW), ('upperarm.l', PAD_FOLLOW)):
        vg = pad.vertex_groups.get(g) or pad.vertex_groups.new(name=g)
        vg.add(idx, w, 'REPLACE')
    ad = rig.animation_data
    muted = [t.mute for t in ad.nla_tracks] if ad else []
    if ad:
        for t in ad.nla_tracks: t.mute = True
    sc.frame_set(0)
    new_action(rig, 'orb_drum_2beat')
    reset(rig, [b.name for b in rig.pose.bones])
    ARM = T['ARM']

    def body(fr):
        beat = fr / FPB
        hit_side = 1 if int(round(beat)) % 2 == 0 else -1   # +1: left hand strikes this beat
        on_hit = (fr % FPB <= 1)                             # impact + 1-frame hitstop
        lean = STANCE['lean'] if on_hit else STANCE['lean'] - 4
        for n in ('hips', 'spine', 'chest', 'head'):
            pb = rig.pose.bones[n]; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
        rig.pose.bones['hips'].location = (0, -STANCE['drop'] if on_hit else 0, 0)
        for n in ('spine', 'chest'):
            rig.pose.bones[n].rotation_quaternion = Euler((radians(lean * 0.5), radians(STANCE['twist'] * 0.5 * hit_side), 0)).to_quaternion()
        rig.pose.bones['head'].rotation_quaternion = Euler((radians(-8 if on_hit else -2), 0, 0)).to_quaternion()
        vl.update()

    # per arm, 2 beats: strike on its beat, short hitstop, rebound off the skin, lift to the wind-up, swing, strike
    sched = [(0, 'IMPACT'), (1, 'IMPACT'), (5, 'REBOUND'), (24, 'LIFT'), (30, 'WINDUP'), (42, 'WINDUP'), (45, 'SWING'), (48, 'IMPACT')]
    # LIFT at +24 also gives the other arm its key on frame 0/48, so both arms loop seamlessly
    body_names = ['hips', 'spine', 'chest', 'head']
    for fr in range(0, 2 * FPB + 1, FPB // 2):
        sc.frame_set(fr); body(fr); key_bones(rig, body_names, fr)
    meas = {}
    # only the RIGHT arm is solved; the left arm is its exact mirror one beat later (baked below)
    for side, off in (('r', FPB),):
        for f, ph in sched:
            fr = (f + off) % (2 * FPB)
            names = [f'{b}.{side}' for b in ARM]
            sc.frame_set(fr); body(fr)                      # arm solved against this frame's torso
            cache = meas.setdefault('_pose_' + side, {})
            if ph in cache:                                 # same phase = identical pose (hitstop, held wind-up)
                for b in names: rig.pose.bones[b].rotation_quaternion = cache[ph][b]
                vl.update(); m = 'same as first ' + ph
            else:
                m = drum_key(rig, side, ph, cache.get('_roll'))
                cache.setdefault('_roll', rig.pose.bones[f'lowerarm.{side}'].rotation_quaternion.copy())
                cache[ph] = {b: rig.pose.bones[b].rotation_quaternion.copy() for b in names}
                L_ = identity_offset(rig, side); P_ = prop_matrix(rig, side, L_, 2.0)
                m['tip'] = [round(v, 3) for v in P_ @ Vector((0, 0, 0.642))]
            meas.setdefault(side, {}).setdefault(f'{fr}:{ph}', m)
            key_bones(rig, names, fr)
            if fr == 0:
                key_bones(rig, names, 2 * FPB)
    ease_segments(rig, [(42, 'QUAD', 'EASE_IN'), (5, 'SINE', 'EASE_IN_OUT'), (29, 'SINE', 'EASE_IN_OUT'), (45, 'LINEAR', 'AUTO'), (21, 'LINEAR', 'AUTO'), (1, 'CUBIC', 'EASE_OUT'), (25, 'CUBIC', 'EASE_OUT')])
    # de-clash pass: key poses are clear, but an in-between can still sweep the stick through the head.
    # Where that happens, add one extra key there: same search, tip pushed OUTWARD (away from the head),
    # forearm roll kept close to the interpolated one. Repeat until the loop is clean (max 6 extra keys per arm).
    from mathutils.bvhtree import BVHTree
    def head_hits(side):
        dg = bpy.context.evaluated_depsgraph_get()
        oe = O['OrcBrute_Head'].evaluated_get(dg); me = oe.to_mesh()
        H = BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], [p.vertices[:] for p in me.polygons]); oe.to_mesh_clear()
        n = 'Orc_WardrumStick' if side == 'l' else 'Orc_WardrumStick.R'
        k = 0
        if side == 'l':
            oe = O['OrcBrute_Shoulderpad'].evaluated_get(dg); me = oe.to_mesh()
            Pd = BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], [p.vertices[:] for p in me.polygons]); oe.to_mesh_clear()
            oe = O['OrcBrute_ArmLeft'].evaluated_get(dg); me = oe.to_mesh()
            k += len(Pd.overlap(BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], FORE_POLYS))); oe.to_mesh_clear()
        for nm in (n, 'OrcBrute_ArmLeft' if side == 'l' else 'OrcBrute_ArmRight'):
            oe = O[nm].evaluated_get(dg); me = oe.to_mesh()
            k += len(H.overlap(BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], [p.vertices[:] for p in me.polygons])))
            oe.to_mesh_clear()
        return k
    arm_ = O['OrcBrute_ArmLeft']; gi = {g.index: g.name for g in arm_.vertex_groups}
    fore = {v.index for v in arm_.data.vertices if v.groups and gi[max(v.groups, key=lambda x: x.weight).group].split('.')[0] in ('lowerarm', 'wrist', 'hand', 'handslot')}
    FORE_POLYS = [p.vertices[:] for p in arm_.data.polygons if all(i in fore for i in p.vertices)]
    for side in ('r',):
        sx = 1 if side == 'l' else -1
        for _ in range(8):
            bad = []
            for fr in range(2 * FPB):
                sc.frame_set(fr); k = head_hits(side)
                if k: bad.append((k, fr))
            if not bad: break
            k, fr = max(bad)
            sc.frame_set(fr)
            L_ = identity_offset(rig, side)
            tip = prop_matrix(rig, side, L_, 2.0) @ Vector((0, 0, 0.642))
            roll = rig.pose.bones[f'lowerarm.{side}'].rotation_quaternion.copy()
            tgt = tip + Vector((sx * 0.7, 0, 0.15))
            m = drum_key(rig, side, 'DECLASH', roll, (tgt, (0.95, 1.05, 1.12), (-70, -55, -40, -25, -10, 5), (-30, -15, 0, 10)))
            names = [f'{b}.{side}' for b in ARM]
            key_bones(rig, names, fr)
            meas.setdefault(side, {})[f'{fr}:DECLASH'] = m
    # left arm = mirror of the right arm, shifted by one beat (local quaternion mirror w, x, -y, -z)
    samp = {}
    for fr in range(2 * FPB):
        sc.frame_set(fr)
        samp[fr] = {b: rig.pose.bones[f'{b}.r'].rotation_quaternion.copy() for b in ARM}
    for fr in range(2 * FPB + 1):
        for b in ARM:
            q = samp[(fr + FPB) % (2 * FPB)][b]
            pbl = rig.pose.bones[f'{b}.l']
            pbl.rotation_quaternion = (q.w, q.x, -q.y, -q.z)
            pbl.keyframe_insert('rotation_quaternion', frame=fr)
    meas['l'] = 'mirror of the right arm, one beat later (baked every frame)'
    push_to_nla(rig, 'drum', 2 * FPB)
    # sticks: bone children with identity at handslot, scale 2
    rig.data.pose_position = 'REST'; reset(rig, [b.name for b in rig.pose.bones]); vl.update()
    for side, name in (('l', 'Orc_WardrumStick'), ('r', 'Orc_WardrumStick.R')):
        o = O[name]; o.parent = None
        o.matrix_world = prop_matrix(rig, side, identity_offset(rig, side), 2.0)
        parent_keep(o, rig, f'handslot.{side}')
    rig.data.pose_position = 'POSE'
    return {'method': 'IK key-pose search v3', 'stance': STANCE, 'drum': DRUM, 'wrist_limit': WRIST_LIMIT, 'pad_follow': PAD_FOLLOW, 'keys': {k: v for k, v in meas.items() if not k.startswith('_')}}


# ------------------------------------------------------------------ RAIDER · pink guitar
NECK_YAW = 10        # v3: neck angled forward (deg)
FRET_Z = -0.04       # v3: fretting grip further up the neck (guitar local z; v2 was -0.12, near the body)


def fret_grip(rig, g, L, z):
    """Relaxed fretting hand (v3): IK arm (elbow down and out, away from the ribs), then forearm twist +
    hand flex; the neck runs through the fist (handslot on the neck point, fist axis along the neck,
    <= ~20 deg off). Scored on grip error, axis error, wrist bend > 45 deg, elbow < 100 deg, elbow
    distance from the chest axis < 0.4."""
    import itertools
    pb = rig.pose.bones; A = rig.matrix_world; Ai = A.inverted()
    ax = (g.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
    S = A @ pb['upperarm.l'].head; lc = Ai @ (A @ pb['chest'].head)
    P = g.matrix_world @ Vector((0, 0, z))
    best = None
    for dx, dy, dz in itertools.product((-0.12, 0, 0.12), repeat=3):
        W = P + Vector((dx, dy, dz))
        for pole in ((1, 0.2, -1), (1, -0.3, -0.8), (1, -0.8, -0.3)):
            T['ik_arm'](rig, 'l', W, S + A.to_3x3() @ Vector(pole), (0, 0))
            el, _ = T['joint_angles'](rig, 'l')
            eo = ((Ai @ (A @ pb['lowerarm.l'].head)) - lc).xy.length
            q0 = pb['lowerarm.l'].rotation_quaternion.copy()
            for tw in range(-180, 180, 30):
                pb['lowerarm.l'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(tw))
                for fx in (-40, -20, 0, 20, 40):
                    for fz in (-30, 0, 30):
                        pb['hand.l'].rotation_quaternion = Euler((radians(fx), 0, radians(fz))).to_quaternion(); vl.update()
                        M = prop_matrix(rig, 'l', L, 1.0)
                        pe = (M.translation - P).length
                        if pe > 0.08:
                            continue
                        ang = math.degrees((M.to_3x3() @ Vector((0, 0, 1))).angle(ax))
                        _, wb = T['joint_angles'](rig, 'l')
                        sc_ = pe * 4 + ang * 0.004 + max(0, wb - 45) * 0.01 + max(0, 100 - el) * 0.006 + max(0, 0.4 - eo)
                        if best is None or sc_ < best[0]:
                            best = (sc_, W.copy(), S + A.to_3x3() @ Vector(pole), tw, fx, fz, dict(grip_err=round(pe, 3), axis_deg=round(ang, 1), elbow=el, wrist=wb, elbow_out=round(eo, 2)))
    _, W, Pp, tw, fx, fz, m = best
    T['ik_arm'](rig, 'l', W, Pp, (0, 0))
    q0 = pb['lowerarm.l'].rotation_quaternion.copy()
    pb['lowerarm.l'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(tw))
    pb['hand.l'].rotation_quaternion = Euler((radians(fx), 0, radians(fz))).to_quaternion(); vl.update()
    return m


def build_strum():
    rig = O['Rig_Raider']; g = O['guitar_B']  # pink (guitar_A is the blue one; same geometry)
    sc.frame_set(0)
    act = new_action(rig, 'orb_strum_1beat')
    reset(rig, [b.name for b in rig.pose.bones])
    vl.update()
    A = rig.matrix_world
    # constructive hold in armature space (character faces -Y, its left = +X)
    # v2: neck tilted 32 deg, body hangs lower on his right (Georg).
    # v3: neck turned NECK_YAW deg FORWARD (like a real player holds it): the fretting hand moves out in front
    #     of the chest instead of sitting on it (Georg: "linke Hand zu sehr im Koerper, laessigere Haltung").
    ny = math.radians(NECK_YAW)
    neck = Vector((math.cos(math.radians(32)) * math.cos(ny), -math.cos(math.radians(32)) * math.sin(ny), math.sin(math.radians(32))))
    Yl = Vector((math.sin(ny), math.cos(ny), 0))   # guitar local -Y (deck) faces forward, turned with the neck
    Xl = Yl.cross(neck).normalized(); Yl = neck.cross(Xl).normalized()
    Rg = Matrix((Xl, Yl, neck)).transposed()      # columns = local axes in armature space
    # anchored on what the short Rig_Medium arms can reach (measured: belly front y=-0.365,
    # right handslot reach ~0.7 from the shoulder). Guitar back sits 2.5 cm in front of the belly.
    strum_c = Vector((0.0, -0.20, -0.72))        # guitar placement anchor (fist centre, v2 search)
    strum_hand = Vector((0.0, -0.28, -0.72))     # where the fist actually works: 19 cm in front of the deck, resting on the strings
    # v1: strum fist sits in front of the right hip corner (reachable with a straight wrist by the short
    # Rig_Medium arm); the guitar body hangs to the character's right, the neck crosses the chest 8 cm clear.
    S = Vector((-0.45, -0.58, 0.76))             # strum fist centre (armature space); v2 placement search: 0 guitar/head/body/leg overlaps
    pivot = S - Rg @ strum_c
    g.parent = None
    g.matrix_world = A @ (Matrix.Translation(pivot) @ Rg.to_4x4())
    vl.update()
    parent_keep(g, rig, 'chest')
    L = {s: identity_offset(rig, s) for s in 'lr'}

    def gw(p):  # guitar-local point -> world
        return g.matrix_world @ Vector(p)

    errs = []
    gi = None

    GB = {}
    STRUM = {}

    def build_guitar_bvh():
        from mathutils.bvhtree import BVHTree
        M = g.matrix_world
        GB['t'] = BVHTree.FromPolygons([M @ v.co for v in g.data.vertices], [list(p.vertices) for p in g.data.polygons])
        GB['ny'] = (M.to_3x3() @ Vector((0, 1, 0))).normalized()

    def no_clip(r):
        """penalty: strum-arm centre line inside the guitar, or closer than a limb radius to it"""
        t, ny = GB['t'], GB['ny']
        pb = r.pose.bones; W = r.matrix_world
        chain = [W @ pb['upperarm.r'].head, W @ pb['lowerarm.r'].head, W @ pb['wrist.r'].head, W @ pb['hand.r'].head]
        pen = 0.0
        for a_, b_ in zip(chain, chain[1:]):
            for k in (0.0, 0.33, 0.66):
                q = a_.lerp(b_, k)
                h1 = t.ray_cast(q, ny, 0.4); h2 = t.ray_cast(q, -ny, 0.4)
                if h1[0] is not None and h2[0] is not None:
                    pen += 0.3 + min(h1[3], h2[3]) * 4
                else:
                    loc, nrm, idx, d = t.find_nearest(q)
                    if d is not None and d < 0.07:
                        pen += (0.07 - d) * 3
        return pen

    # strum positions: travel across the strings, in the deck plane, mostly vertical in world
    deck_n = (g.matrix_world.to_3x3() @ Vector((0, -1, 0))).normalized()
    keys = [(0, 'MID'), (4, 'LOW'), (12, 'MID'), (20, 'HIGH'), (24, 'MID')]
    travel = {'HIGH': 0.08, 'MID': 0.0, 'LOW': -0.08}
    sway = {0: 1.5, 12: -1.5, 24: 1.5}
    for fr, pos in keys:
        sc.frame_set(fr)
        reset(rig, ['spine', 'chest', 'head'])
        s = sway.get(fr, 0.0)
        rig.pose.bones['spine'].rotation_quaternion = Euler((0, 0, radians(s))).to_quaternion()
        rig.pose.bones['head'].rotation_quaternion = Euler((radians(10 if fr in (0, 24) else 0), 0, radians(-s))).to_quaternion()
        vl.update()
        up_in_deck = (Vector((0, 0, 1)) - deck_n * deck_n.dot(Vector((0, 0, 1)))).normalized()
        c = gw(strum_hand) + up_in_deck * travel[pos]
        # strum arm: straight wrist, forearm drapes OVER the guitar body (no fist inside the guitar)
        # strum = one clean arm pose (solved once, straight wrist, arm clear of the guitar)
        #         + a small additive wrist flick along the strings (strumming is a wrist motion)
        if 'mid' not in STRUM:
            build_guitar_bvh()
            c0 = gw(strum_hand)
            STRUM['err'] = T['solve_straight'](rig, 'r', c0, L['r'], 1.0, (0, 0, 0), extra=no_clip)[0]
            STRUM['mid'] = {n: rig.pose.bones[n].matrix_basis.copy() for n in [f'{x}.r' for x in T['ARM']]}
        for n, mb in STRUM['mid'].items():
            rig.pose.bones[n].matrix_basis = mb
        vl.update()
        flick = {'HIGH': -14, 'MID': 0, 'LOW': 14}[pos]
        if flick:
            hs = rig.matrix_world @ rig.pose.bones['handslot.r'].head
            wr = rig.matrix_world @ rig.pose.bones['wrist.r'].head
            axis = (hs - wr).cross(up_in_deck).normalized()
            T['_q_about']('wrist.r', rig, Matrix.Rotation(radians(flick), 3, axis))
        e1 = STRUM['err']
        e2 = fret_grip(rig, g, L['l'], FRET_Z)
        errs.append((fr, pos, e1, e2))
        key_bones(rig, ['spine', 'chest', 'head'] + [f'{n}.{s_}' for n in T['ARM'] for s_ in 'lr'], fr)
    ease_segments(rig, [(20, 'QUAD', 'EASE_IN'), (0, 'QUAD', 'EASE_OUT')])
    push_to_nla(rig, 'strum', FPB)
    return errs


# ------------------------------------------------------------------ ORC B · dancing leader (Legacy, no skeleton)
# v2 (Georg): hops AROUND the front of the stage in a musical pattern, not on one spot; mic held at a
# natural angle and moving. Legacy arms are rigid one-piece blocks (no elbow), so the "bent elbow" read is
# made with a diagonal arm angle + a tilted mic + a small pump on the beat.
# One clip = 8 beats = 2 bars: bar 1 travels A -> B, bar 2 travels B -> A; the downbeat hop of each bar is
# the big one (1.0 x H), the others 0.6 x H; the last hop of bar 2 is a full turn (cartoon flourish).
DANCE = {'A': (3.1, -1.7), 'B': (1.7, -2.5), 'H': 0.7, 'mic_arm': (-100, 0, 28)}


def build_bounce():
    body = O['character_orcBBody']; head = O['character_orcBHead']
    armR = O['character_orcBArmRight']; armL = O['character_orcBArmLeft']
    for o in (body, head, armR, armL):
        o.rotation_mode = 'XYZ'
        if o.animation_data:
            for t in list(o.animation_data.nla_tracks): o.animation_data.nla_tracks.remove(t)
    new_action(body, 'orb_dance_body'); new_action(head, 'orb_dance_head')
    new_action(armR, 'orb_dance_armR'); new_action(armL, 'orb_dance_armL')
    A = Vector((*DANCE['A'], 0)); B = Vector((*DANCE['B'], 0)); H = DANCE['H']
    mic = DANCE['mic_arm']
    # facing: the leader looks at the audience (-Y) but turns ~35 deg into the travel direction
    def yaw_for(d):
        return math.atan2(d.x, -d.y) * 0.35
    # per-beat hop shape (fraction of a beat -> height fraction, squash)
    hop = [(0.0, 0.0, 0.80), (0.12, 0.35, 1.14), (0.35, 0.85, 1.04), (0.5, 1.0, 1.0), (0.65, 0.85, 1.03), (0.88, 0.30, 1.10)]
    for beat in range(8):
        bar, bib = divmod(beat, 4)
        src, dst = (A, B) if bar == 0 else (B, A)
        p0 = src.lerp(dst, bib / 4); p1 = src.lerp(dst, (bib + 1) / 4)
        big = (bib == 0)
        h = H * (1.0 if big else 0.6)
        spin = (beat == 7)
        base_yaw = yaw_for(dst - src)
        for fr_frac, hf, sz in hop:
            fr = int(round((beat + fr_frac) * FPB))
            pos = p0.lerp(p1, fr_frac) + Vector((0, 0, h * hf))
            sxy = 1 / math.sqrt(sz)
            body.location = pos; body.scale = (sxy, sxy, sz)
            body.rotation_euler = (0, 0, base_yaw + (2 * math.pi * fr_frac if spin else 0))
            head.location = (0, 0, 0.7 + (-0.06 if hf == 0 else 0.02 if hf < 0.9 else 0.0))
            head.rotation_euler = (radians(6 if hf == 0 else -5), 0, radians(8 * math.sin(math.pi * (beat + fr_frac))))
            # free arm pumps with the hop, mic arm stays near the mouth with a small beat pump
            fa = -40 + 190 * hf
            armL.rotation_euler = (radians(-fa * 0.5), 0, radians(-fa * 0.25))
            pump = 8 * math.cos(2 * math.pi * fr_frac)
            armR.rotation_euler = (radians(mic[0] + pump), radians(mic[1]), radians(mic[2] + 6 * math.sin(math.pi * (beat + fr_frac))))
            for o in (body,):
                o.keyframe_insert('location', frame=fr); o.keyframe_insert('scale', frame=fr); o.keyframe_insert('rotation_euler', frame=fr)
            head.keyframe_insert('location', frame=fr); head.keyframe_insert('rotation_euler', frame=fr)
            armL.keyframe_insert('rotation_euler', frame=fr); armR.keyframe_insert('rotation_euler', frame=fr)
    # close the loop on frame 8 beats = frame 0 pose (A, contact)
    fr = 8 * FPB
    body.location = A; body.scale = (1 / math.sqrt(0.8), 1 / math.sqrt(0.8), 0.8); body.rotation_euler = (0, 0, yaw_for(B - A) + 2 * math.pi)
    body.keyframe_insert('location', frame=fr); body.keyframe_insert('scale', frame=fr); body.keyframe_insert('rotation_euler', frame=fr)
    for o, key in ((head, None), (armL, None), (armR, None)):
        pass
    # gravity spacing on the hops: ease out of the ground, ease into the apex
    for o in (body,):
        rules = []
        for beat in range(8):
            rules += [(int(round((beat + 0.12) * FPB)), 'QUAD', 'EASE_OUT'), (int(round((beat + 0.5) * FPB)), 'QUAD', 'EASE_IN')]
        ease_segments(o, rules)
    for o in (body, head, armR, armL):
        push_to_nla(o, 'bounce', 8 * FPB)


def set_mic_rest():
    """re-seat the mic on the rigid arm at the v2 arm angle (mic tilted ~30 deg toward the mouth)"""
    armR = O['character_orcBArmRight']; body = O['character_orcBBody']; mic = O['GothGirl_Microphone']
    for o in (body, O['character_orcBHead'], armR, O['character_orcBArmLeft']):
        if o.animation_data:
            o.animation_data.action = None
            for t in list(o.animation_data.nla_tracks): o.animation_data.nla_tracks.remove(t)
    body.scale = (1, 1, 1); body.rotation_euler = (0, 0, 0); body.location = (*DANCE['A'], 0)
    armR.rotation_euler = tuple(radians(a) for a in DANCE['mic_arm'])
    vl.update()
    paw = [armR.matrix_world @ v.co for v in armR.data.vertices if v.co.z < -0.33]
    pc = sum(paw, Vector()) / len(paw)
    up = (body.matrix_world.to_3x3() @ Vector((-0.25, -0.45, 1))).normalized()
    R = Vector((0, 0, 1)).rotation_difference(up).to_matrix().to_4x4()
    mic.parent = None; mic.matrix_world = Matrix.Translation(pc) @ R; vl.update()
    parent_keep(mic, armR)


def build_all():
    out = {'drum': build_drum(), 'strum': build_strum()}
    set_mic_rest(); build_bounce()
    sc.frame_start, sc.frame_end = 0, 8 * FPB - 1
    return out


if __name__ == '__main__':
    print(build_all())
