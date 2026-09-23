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


# ------------------------------------------------------------------ BRUTE · war drum (v4)
# Mental model v4 (Georg 2026-09-23, 4th pass):
#   v3 solved every key with its own forearm twist -> the strike came out of a rotating forearm/wrist, and
#   the club hung vertically out of the fist ("so haelt kein Drummer seine Sticks").
#   A drummer (and an orc with clubs) strikes like a one-handed chop: elbow leads, forearm whips down,
#   the wrist only tips a little forward at the end, the stick is an EXTENSION of the forearm.
#   1. The club stays IN the fist exactly as the Atlas identity grip puts it (Georg: "muessen korrekt in den
#      Haenden verbleiben, nicht durch die Hand rotiert werden"). The forward angle of the club comes from a
#      small wrist tip (<= 25 deg, in the plane of club + forearm) at the impact only.
#   2. Arm = IK (shoulder + elbow only). ONE elbow direction (pole) and ONE forearm roll for all keys,
#      found at the impact -> no twisting between keys; the wrist is straight except a small forward tip
#      at impact. Wrist targets per key are fixed offsets from the shoulder (see DRUM_WRIST).
#   3. Right arm is built; left arm = exact mirror one beat later.
DRUM = {'scale': 1.6, 'loc': (0.0, -0.55, 0.0)}
STANCE = {'lean': 16, 'twist': 6, 'drop': 0.06}
BRUTE_LOC = (0.0, 1.5, 0.0)
# The big left pauldron is skinned 100 % to 'chest' in the source asset -> any raised left arm pushes the
# forearm guard into it. It now follows the upper arm part-way like a strapped pauldron (chest 0.2 / upperarm.l 0.8;
# v4 measured: 0.6 -> 9 of 24 sampled frames touch, 0.8 -> 5, pad/head 0 in both).
PAD_FOLLOW = 0.8
PAD_CLEARANCE = False    # per-frame outward swing of the left upper arm (tested: clears the pad but makes the arm flail) - off
STICK = {'scale': 2.0}                                           # Atlas factor 2, identity grip (stays in the fist)
WRIST_TIP = (0, 10, 20, 25)                                      # wrist tip at impact (deg); other keys: +-25 max
BRUTE_Y_OPTIONS = (1.7,)                                         # 20 cm further back than v3 (search over 1.5/1.7/1.9 picked 1.7)
DRUM_TARGET = (-0.30, -0.40, 1.46)                               # right stick tip at impact (world): inner head
# right-arm wrist targets, offsets from the right shoulder in world axes (x: - = outward, y: - = forward, z: up)
DRUM_WRIST = {
    'REBOUND': ('IMPACT', (-0.18, -0.05, 0.28)),     # impact wrist, lifted off the skin (and away from the face)
    'HOLD':    ('S', (-0.60, -0.75, 0.15)),          # between strokes: fist at shoulder height, club held forward (ready)
    'LIFT':    ('S', (-0.60, -0.70, 0.10)),          # elbow comes up, fist at shoulder height
    'WINDUP':  ('S', (-0.60, -0.30, 0.95)),          # fist above the head, stick pointing up and back
    'SWING':   ('S', (-0.50, -0.90, 0.35)),          # forearm whips forward/down
}


def build_drum():
    import itertools
    rig = O['Rig_Brute']; drum = O['Orc_Wardrum']
    rig.location = BRUTE_LOC
    drum.scale = (DRUM['scale'],) * 3; drum.location = DRUM['loc']
    pad = O['OrcBrute_Shoulderpad']; idx = [v.index for v in pad.data.vertices]
    for g, w in (('chest', 1 - PAD_FOLLOW), ('upperarm.l', PAD_FOLLOW)):
        vg = pad.vertex_groups.get(g) or pad.vertex_groups.new(name=g)
        vg.add(idx, w, 'REPLACE')
    ARM = T['ARM']; pb = rig.pose.bones
    ad = rig.animation_data
    for t in ad.nla_tracks: t.mute = True
    sc.frame_set(0)
    new_action(rig, 'orb_drum_2beat')
    reset(rig, [b.name for b in rig.pose.bones])

    def body(fr):
        beat = fr / FPB
        hit_side = 1 if int(round(beat)) % 2 == 0 else -1      # +1: left hand strikes this beat
        on_hit = (fr % FPB <= 1)
        lean = STANCE['lean'] if on_hit else STANCE['lean'] - 4
        for n in ('hips', 'spine', 'chest', 'head'):
            p = pb[n]; p.rotation_quaternion = (1, 0, 0, 0); p.location = (0, 0, 0)
        pb['hips'].location = (0, -STANCE['drop'] if on_hit else 0, 0)
        for n in ('spine', 'chest'):
            pb[n].rotation_quaternion = Euler((radians(lean * 0.5), radians(STANCE['twist'] * 0.5 * hit_side), 0)).to_quaternion()
        pb['head'].rotation_quaternion = Euler((radians(-8 if on_hit else -2), 0, 0)).to_quaternion()
        vl.update()

    L = identity_offset(rig, 'r')                                  # Atlas identity grip: the club stays IN the fist

    def deviate(dev):
        # wrist tip: the fist turns in the plane of club + forearm, club tip toward the forearm line (forward)
        if not dev:
            return
        M = rig.matrix_world; h = pb['hand.r']
        a = ((M @ pb['handslot.r'].matrix @ L).to_3x3() @ Vector((0, 0, 1))).normalized()
        f = (M.to_3x3() @ (pb['lowerarm.r'].matrix.to_3x3() @ Vector((0, 1, 0)))).normalized()
        R = Matrix.Rotation(radians(dev), 4, a.cross(f).normalized())
        hm = h.matrix.copy(); t = hm.translation.copy()
        h.matrix = Matrix.Translation(t) @ R @ Matrix.Translation(-t) @ hm
        vl.update()

    def arm(W, pole, tw, dev):
        S = rig.matrix_world @ pb['upperarm.r'].head
        T['ik_arm'](rig, 'r', W, S + Vector(pole), (0, 0))
        q0 = pb['lowerarm.r'].rotation_quaternion.copy()
        pb['lowerarm.r'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(tw))
        pb['wrist.r'].rotation_quaternion = (1, 0, 0, 0)
        pb['hand.r'].rotation_quaternion = (1, 0, 0, 0)
        vl.update()
        deviate(dev)

    # --- impact search (right arm, right-hit torso at frame 24): wrist target, elbow direction, ONE forearm roll, wrist tip
    sc.frame_set(FPB); body(FPB)
    tgt = Vector(DRUM_TARGET)
    SC = Matrix.Scale(STICK['scale'], 4); lt = Vector((0, 0, 0.642))
    best = None
    for by, wx, wy, wz in itertools.product(BRUTE_Y_OPTIONS, (-0.15, -0.3, -0.45, -0.6), (0.0, 0.2, 0.4, 0.6), (2.3, 2.4, 2.5, 2.6)):
        rig.location.y = by; vl.update()
        W = Vector((wx, wy + (by - BRUTE_LOC[1]), wz))
        for pole in ((-0.4, 0.3, -1),):              # elbow points down-out (other elbow directions push the left forearm into the pauldron)
            arm(W, pole, 0, 0)
            el, _ = T['joint_angles'](rig, 'r')
            q0 = pb['lowerarm.r'].rotation_quaternion.copy()
            for tw in range(-180, 180, 30):
                for dev in WRIST_TIP:
                    pb['lowerarm.r'].rotation_quaternion = q0 @ Quaternion((0, 1, 0), radians(tw))
                    pb['hand.r'].rotation_quaternion = (1, 0, 0, 0); vl.update()
                    deviate(dev)
                    P = rig.matrix_world @ pb['handslot.r'].matrix @ L @ SC
                    tip = P @ lt; grip = P.translation
                    e = (tip - tgt).length
                    cd = (tip - grip).normalized()
                    # club points FORWARD and down onto the head (like a drumstick), never hanging straight down like a hammer
                    sc_ = (e + (by - BRUTE_LOC[1]) * 0.15 + max(0, 115 - el) * 0.01 + max(0, el - 160) * 0.01 + dev * 0.003
                           + max(0, 0.45 + cd.y) * 1.5 + max(0, cd.z + 0.35) * 1.5)
                    if best is None or sc_ < best[0]:
                        best = (sc_, dict(brute_y=by, W=[round(v, 3) for v in W], pole=pole, tw=tw, dev=dev,
                                          tip_err=round(e, 3), tip=[round(v, 3) for v in tip], elbow=el))
    fit = best[1]
    rig.location.y = fit['brute_y']; vl.update()
    S24 = rig.matrix_world @ pb['upperarm.r'].head
    Wimp = Vector(fit['W']); Wrel = Wimp - S24

    # club direction wanted per phase (world): the wrist may tip the club up to +-25 deg to get there
    AIM = {'HOLD': Vector((0, -1, -0.1)), 'LIFT': Vector((0, 0.3, 1)), 'WINDUP': Vector((0, 0.6, 1)), 'SWING': Vector((0, -1, 0.6))}

    def pose(phase):
        S = rig.matrix_world @ pb['upperarm.r'].head
        if phase == 'IMPACT':
            arm(S + Wrel, fit['pole'], fit['tw'], fit['dev']); return
        ref, off = DRUM_WRIST[phase]
        base = (S + Wrel) if ref == 'IMPACT' else S
        if phase == 'REBOUND':
            arm(base + Vector(off), fit['pole'], fit['tw'], fit['dev']); return
        aim = AIM[phase].normalized(); bestd = None
        for dev in range(-25, 26, 5):
            arm(base + Vector(off), fit['pole'], fit['tw'], dev)
            P = rig.matrix_world @ pb['handslot.r'].matrix @ L
            cdir = (P.to_3x3() @ Vector((0, 0, 1))).normalized()
            v = cdir.dot(aim) - abs(dev) * 0.004
            if bestd is None or v > bestd[0]:
                bestd = (v, dev)
        arm(base + Vector(off), fit['pole'], fit['tw'], bestd[1])
        devs[phase] = bestd[1]

    sched = [(0, 'IMPACT'), (1, 'IMPACT'), (5, 'REBOUND'), (14, 'HOLD'), (24, 'LIFT'), (30, 'WINDUP'), (42, 'WINDUP'), (45, 'SWING'), (48, 'IMPACT')]
    body_names = ['hips', 'spine', 'chest', 'head']
    for fr in range(0, 2 * FPB + 1, FPB // 2):
        sc.frame_set(fr); body(fr); key_bones(rig, body_names, fr)
    names = [f'{b}.r' for b in ARM]
    angles = {}; devs = {}
    for f, ph in sched:
        fr = (f + FPB) % (2 * FPB)
        sc.frame_set(fr); body(fr); pose(ph)
        angles[ph] = T['joint_angles'](rig, 'r')
        key_bones(rig, names, fr)
        if fr == 0:
            key_bones(rig, names, 2 * FPB)
    ease_segments(rig, [(42, 'QUAD', 'EASE_IN'), (5, 'SINE', 'EASE_IN_OUT'), (29, 'SINE', 'EASE_IN_OUT'), (45, 'LINEAR', 'AUTO'), (21, 'LINEAR', 'AUTO'), (1, 'CUBIC', 'EASE_OUT'), (25, 'CUBIC', 'EASE_OUT')])
    # left arm = mirror of the right arm, one beat later (local quaternion mirror w, x, -y, -z)
    samp = {}
    for fr in range(2 * FPB):
        sc.frame_set(fr)
        samp[fr] = {b: pb[f'{b}.r'].rotation_quaternion.copy() for b in ARM}
    for fr in range(2 * FPB + 1):
        for b in ARM:
            q = samp[(fr + FPB) % (2 * FPB)][b]
            pl = pb[f'{b}.l']; pl.rotation_quaternion = (q.w, q.x, -q.y, -q.z)
            pl.keyframe_insert('rotation_quaternion', frame=fr)
    # pauldron clearance (left arm only; the right has no pauldron): where the mirrored left forearm or club
    # would enter the pauldron, the left upper arm swings a little further OUT (about the forward axis),
    # smallest angle that clears it, smoothed over +-3 frames.
    from mathutils.bvhtree import BVHTree
    arm_ = O['OrcBrute_ArmLeft']; gi = {g.index: g.name for g in arm_.vertex_groups}
    fore = {v.index for v in arm_.data.vertices if v.groups and gi[max(v.groups, key=lambda x: x.weight).group].split('.')[0] in ('lowerarm', 'wrist', 'hand', 'handslot')}
    FP = [p.vertices[:] for p in arm_.data.polygons if all(i in fore for i in p.vertices)]
    # club placed now (identity grip) so it can be tested too
    rig.data.pose_position = 'REST'; vl.update()
    stL = O['Orc_WardrumStick']; stL.parent = None
    stL.matrix_world = prop_matrix(rig, 'l', identity_offset(rig, 'l'), STICK['scale']); parent_keep(stL, rig, 'handslot.l')
    rig.data.pose_position = 'POSE'; vl.update()

    def mesh_tree(n, polys=None):
        de = bpy.context.evaluated_depsgraph_get(); oe = O[n].evaluated_get(de); me = oe.to_mesh()
        t = BVHTree.FromPolygons([oe.matrix_world @ v.co for v in me.vertices], polys or [p.vertices[:] for p in me.polygons]); oe.to_mesh_clear()
        return t

    def pad_hits():
        P = mesh_tree('OrcBrute_Shoulderpad')
        return len(mesh_tree('OrcBrute_ArmLeft', FP).overlap(P)) + len(mesh_tree('Orc_WardrumStick').overlap(P))

    need = {}
    for fr in range(2 * FPB):
        sc.frame_set(fr)
        base = pb['upperarm.l'].matrix.copy(); need[fr] = 0
        if not PAD_CLEARANCE or fr in (0, 1) or not pad_hits():
            continue
        for ang in [a * sg for a in range(5, 46, 5) for sg in (1, -1)]:
            t = base.translation.copy()
            pb['upperarm.l'].matrix = Matrix.Translation(t) @ Matrix.Rotation(radians(ang), 4, 'Y') @ Matrix.Translation(-t) @ base
            vl.update()
            if not pad_hits():
                break
        need[fr] = ang if not pad_hits() else 0
        pb['upperarm.l'].matrix = base; vl.update()
    HIT = (0, 1)                                    # the left impact frames are never altered
    smooth = {fr: 0 if fr in HIT else max((need[(fr + k) % (2 * FPB)] for k in range(-3, 4)), key=abs) for fr in range(2 * FPB)}
    for fr in range(2 * FPB + 1):
        sc.frame_set(fr % (2 * FPB))
        a = smooth[fr % (2 * FPB)]
        if a:
            base = pb['upperarm.l'].matrix.copy(); t = base.translation.copy()
            pb['upperarm.l'].matrix = Matrix.Translation(t) @ Matrix.Rotation(radians(a), 4, 'Y') @ Matrix.Translation(-t) @ base
            vl.update()
        pb['upperarm.l'].keyframe_insert('rotation_quaternion', frame=fr)
    push_to_nla(rig, 'drum', 2 * FPB)
    # sticks: bone children in the identity grip
    rig.data.pose_position = 'REST'; reset(rig, [b.name for b in rig.pose.bones]); vl.update()
    for side, name in (('l', 'Orc_WardrumStick'), ('r', 'Orc_WardrumStick.R')):
        o = O[name]; o.parent = None
        o.matrix_world = prop_matrix(rig, side, identity_offset(rig, side), STICK['scale'])
        parent_keep(o, rig, f'handslot.{side}')
    rig.data.pose_position = 'POSE'
    return {'method': 'IK shoulder+elbow, one forearm roll, identity grip, wrist tip at impact (v4)', 'fit': fit, 'wrist_tip_per_phase': devs, 'pauldron_clearance_deg': {k: v for k, v in smooth.items() if v}, 'stick': STICK,
            'stance': STANCE, 'drum': DRUM, 'pad_follow': PAD_FOLLOW, 'joint_angles': angles}


# ------------------------------------------------------------------ RAIDER · pink guitar
NECK_YAW = 15        # v4: neck angled forward (deg), fretting arm further from the body
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
    S = Vector((-0.45, -0.58, 0.66))             # strum fist centre (armature space); v4: 10 cm lower than v2/v3 so the strum arm can stretch and lie over the body
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
