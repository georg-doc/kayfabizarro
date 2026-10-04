"""KFB Blender pose helpers (shared by the Blender MCP lane).
exec(open(path).read(), ns) then use ns['aim'], ns['arm'], ns['identity_offset'], ns['search'].
"""
import bpy, itertools
from math import radians
from mathutils import Vector, Matrix, Quaternion, Euler

vl = bpy.context.view_layer


def aim(rig, name, d, tw=0.0):
    """Point pose bone Y along armature-space direction d (minimal arc), plus twist about d."""
    vl.update()
    pb = rig.pose.bones[name]
    M = pb.matrix.copy()
    y = (M.to_3x3().normalized() @ Vector((0, 1, 0))).normalized()
    d = Vector(d).normalized()
    R = Matrix.Rotation(radians(tw), 3, d) @ y.rotation_difference(d).to_matrix()
    N = (R @ M.to_3x3().normalized()).to_4x4()
    N.translation = M.translation
    pb.matrix = N
    pb.scale = (1, 1, 1); pb.location = (0, 0, 0)
    vl.update()


def reset(rig, names):
    for n in names:
        pb = rig.pose.bones[n]
        pb.rotation_mode = 'QUATERNION'
        pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0); pb.scale = (1, 1, 1)


ARM = ['upperarm', 'lowerarm', 'wrist', 'hand']


def arm(rig, side, ua, fa, tw, hd=None):
    """Pose one arm. Directions are given for the LEFT side (+X); mirrored for 'r'.
    Directions are in armature space (character faces -Y)."""
    s = -1 if side == 'r' else 1
    reset(rig, [f'{n}.{side}' for n in ARM])
    m = lambda v: (s * v[0], v[1], v[2])
    hd = hd or fa
    aim(rig, f'upperarm.{side}', m(ua))
    aim(rig, f'lowerarm.{side}', m(fa), s * tw / 2)
    aim(rig, f'wrist.{side}', m(hd), s * tw / 4)
    aim(rig, f'hand.{side}', m(hd), s * tw / 4)


def identity_offset(rig, side):
    """prop-in-handslot matrix for the Resident Atlas identity rule, measured in REST.
    prop +Z (glTF +Y) == handslot forward axis in T-pose."""
    pp = rig.data.pose_position
    rig.data.pose_position = 'REST'; vl.update()
    hs = rig.matrix_world @ rig.pose.bones[f'handslot.{side}'].matrix
    W = Matrix.Translation(hs.translation) @ Matrix.Rotation(radians(90), 4, 'X')
    rig.data.pose_position = pp; vl.update()
    return hs.inverted() @ W


def prop_matrix(rig, side, L, scale=1.0):
    return (rig.matrix_world @ rig.pose.bones[f'handslot.{side}'].matrix) @ L @ Matrix.Scale(scale, 4)


def search(rig, side, score, UA=None, FA=None, TW=range(-120, 121, 20)):
    """Grid search over upper-arm dir x forearm dir x twist; score(side) -> float (lower is better)."""
    UA = UA or [(x, y, z) for x in (0, 0.3, 0.6, 1.0) for y in (0.3, 0, -0.4, -0.9) for z in (-1, -0.4, 0.3)]
    FA = FA or [(x, y, z) for x in (-0.4, 0, 0.4, 0.8) for y in (0.2, -0.4, -1) for z in (-0.8, -0.3, 0.2, 0.7)]
    best = None
    for ua in UA:
        for fa in FA:
            for tw in TW:
                arm(rig, side, ua, fa, tw)
                sc = score(side)
                if best is None or sc < best[0]:
                    best = (sc, ua, fa, tw)
    arm(rig, side, *best[1:])
    return best


def _q_about(pb_name, rig, R):
    """rotate pose bone (world-space 3x3 R) about its own head."""
    vl.update()
    pb = rig.pose.bones[pb_name]
    Mw = rig.matrix_world @ pb.matrix
    N = Matrix.Translation(Mw.translation) @ (R.to_4x4() @ Matrix.Translation(-Mw.translation)) @ Mw
    pb.matrix = rig.matrix_world.inverted() @ N
    pb.scale = (1, 1, 1); pb.location = (0, 0, 0)
    vl.update()


def reach(rig, side, grip_target, prop_axis, pole, L, iters=6, prop_scale=1.0, wrist_share=0.5):
    """Place the handslot grip at grip_target (world) and point the held prop's +Z along prop_axis (world).
    Analytic two-bone IK (upperarm/lowerarm, elbow bent toward `pole` world dir), then hand/wrist
    rotation for the prop axis; a few fixed-point iterations absorb the handslot offset.
    Returns final grip error (world units)."""
    s = side
    gt = Vector(grip_target); ax = Vector(prop_axis).normalized(); pole = Vector(pole).normalized()
    reset(rig, [f'{n}.{s}' for n in ARM])
    mw = rig.matrix_world; mwi = mw.inverted()
    aimT = gt.copy()
    for _ in range(iters):
        vl.update()
        up = rig.pose.bones[f'upperarm.{s}']; lo = rig.pose.bones[f'lowerarm.{s}']
        S = mw @ up.head
        a = up.length; b = lo.length + rig.pose.bones[f'wrist.{s}'].length
        D = aimT - S; dist = min(D.length, (a + b) * 0.999); Dn = D.normalized()
        # elbow via law of cosines
        cosA = max(-1, min(1, (a * a + dist * dist - b * b) / (2 * a * dist)))
        import math
        ang = math.acos(cosA)
        side_dir = (pole - Dn * pole.dot(Dn)).normalized()
        E = S + Dn * (a * math.cos(ang)) + side_dir * (a * math.sin(ang))
        W = S + Dn * dist
        R3 = mwi.to_3x3()
        for n in ARM:
            pb = rig.pose.bones[f'{n}.{s}']; pb.rotation_quaternion = (1, 0, 0, 0)
        aim(rig, f'upperarm.{s}', R3 @ (E - S))
        aim(rig, f'lowerarm.{s}', R3 @ (W - E))
        # prop axis: rotate wrist+hand so the prop's +Z matches ax
        for n, share in ((f'wrist.{s}', wrist_share), (f'hand.{s}', 1.0)):
            P = prop_matrix(rig, s, L, prop_scale)
            cur = (P.to_3x3().normalized() @ Vector((0, 0, 1))).normalized()
            q = cur.rotation_difference(ax)
            if share < 1.0:
                q = Quaternion().slerp(q, share)
            _q_about(n, rig, q.to_matrix())
        g = prop_matrix(rig, s, L, prop_scale).translation
        err = gt - g
        aimT = aimT + err
    return (gt - prop_matrix(rig, s, L, prop_scale).translation).length


def prop_frame(grip, axis, side_hint=Vector((1, 0, 0)), scale=1.0):
    """World matrix for a held prop: origin at grip, +Z along axis, +X as close to side_hint as possible."""
    z = Vector(axis).normalized()
    x = Vector(side_hint) - z * z.dot(Vector(side_hint))
    if x.length < 1e-4:
        x = Vector((0, 1, 0)).cross(z)
    x.normalize(); y = z.cross(x)
    M = Matrix((x, y, z)).transposed().to_4x4(); M.translation = Vector(grip)
    return M @ Matrix.Scale(scale, 4)


def reach_ik(rig, side, prop_world, L, pole_world, prop_scale=1.0, iterations=500):
    """Full-arm IK with rotation: put the handslot where `prop_world` (prop world matrix) requires it.
    Uses a temporary IK constraint on handslot.<side> (chain 5) + pole empty, then bakes the visual
    result into the pose (visual keying) and removes the helpers. Returns (pos_err, axis_err_deg)."""
    import math
    s = side
    target_hs = prop_world @ Matrix.Scale(1 / prop_scale, 4) @ L.inverted()
    tgt = bpy.data.objects.new('_ik_tgt', None); bpy.context.scene.collection.objects.link(tgt)
    pol = bpy.data.objects.new('_ik_pole', None); bpy.context.scene.collection.objects.link(pol)
    tt = target_hs.copy(); tt.translation = target_hs @ Vector((0, rig.pose.bones[f'handslot.{s}'].length, 0))
    tgt.matrix_world = tt   # IK drives the handslot TAIL; rotation comes from the target
    S = rig.matrix_world @ rig.pose.bones[f'upperarm.{s}'].head
    pol.location = S + Vector(pole_world).normalized() * 2.0
    reset(rig, [f'{n}.{s}' for n in ARM])
    pb = rig.pose.bones[f'handslot.{s}']
    c = pb.constraints.new('IK')
    c.target = tgt; c.pole_target = pol; c.chain_count = 5; c.use_rotation = True; c.use_tail = True
    c.iterations = iterations; c.pole_angle = 0.0; c.orient_weight = 1.0; c.weight = 1.0
    vl.update()
    # choose pole angle that best matches the requested elbow side
    best = None
    for pa in range(-180, 180, 15):
        c.pole_angle = math.radians(pa); vl.update()
        E = rig.matrix_world @ rig.pose.bones[f'lowerarm.{s}'].head
        sc_ = -(E - S).normalized().dot(Vector(pole_world).normalized())
        hs = rig.matrix_world @ pb.matrix
        sc_ += 5 * (hs.translation - target_hs.translation).length
        if best is None or sc_ < best[0]:
            best = (sc_, pa)
    c.pole_angle = math.radians(best[1]); vl.update()
    chain = [f'upperarm.{s}', f'lowerarm.{s}', f'wrist.{s}', f'hand.{s}']
    vis = {n: rig.pose.bones[n].matrix.copy() for n in chain}
    pb.constraints.remove(c)
    bpy.data.objects.remove(tgt); bpy.data.objects.remove(pol)
    vl.update()
    for n in chain:
        rig.pose.bones[n].matrix = vis[n]; vl.update()
        rig.pose.bones[n].scale = (1, 1, 1)
    vl.update()
    got = prop_matrix(rig, s, L, prop_scale)
    pos_err = (got.translation - prop_world.translation).length
    a1 = (got.to_3x3().normalized() @ Vector((0, 0, 1))); a2 = (prop_world.to_3x3().normalized() @ Vector((0, 0, 1)))
    ang = math.degrees(a1.angle(a2))
    return round(pos_err, 4), round(ang, 2)


def reach_best(rig, side, grip, axis, L, pole_world, prop_scale=1.0, n=16):
    """reach_ik over n twist hints about the prop axis; keeps the pose with the smallest axis error."""
    import math
    z = Vector(axis).normalized()
    ref = Vector((0, 0, 1)) if abs(z.z) < 0.9 else Vector((0, 1, 0))
    x0 = (ref - z * z.dot(ref)).normalized(); y0 = z.cross(x0)
    best = None
    for i in range(n):
        t = 2 * math.pi * i / n
        hint = x0 * math.cos(t) + y0 * math.sin(t)
        PW = prop_frame(grip, z, hint, prop_scale)
        e = reach_ik(rig, side, PW, L, pole_world, prop_scale)
        if best is None or (e[1] + 100 * e[0]) < (best[0][1] + 100 * best[0][0]):
            best = (e, hint.copy(), {b.name: b.matrix_basis.copy() for b in rig.pose.bones if b.name.endswith('.' + side)})
    for nme, mb in best[2].items():
        rig.pose.bones[nme].matrix_basis = mb
    vl.update()
    return best[0]


def _dir(yaw, pitch):
    import math
    y, p = math.radians(yaw), math.radians(pitch)
    return Vector((math.sin(y) * math.cos(p), -math.cos(y) * math.cos(p), math.sin(p)))


def solve_straight(rig, side, tip_world, L, prop_scale=1.0, tip_local=(0, 0, 1),
                   extra=None, seeds=None, avoid=None, avoid_r=0.0):
    """Straight-wrist arm solve (wrist/hand follow the forearm; no bent wrists).
    Parameters: upper-arm yaw/pitch, forearm yaw/pitch, forearm twist (armature space, LEFT side;
    mirrored for 'r'). Coarse seeds + coordinate descent on |tip - target| (+ optional extra(rig) penalty,
    + penalty when the prop comes closer than avoid_r to the world point `avoid`).
    Yaw 0 = forward (-Y), +yaw = outward; pitch + = up."""
    import itertools
    sx = 1 if side == 'l' else -1
    tl = Vector(tip_local)

    def apply(p):
        uy, up_, fy, fp, tw = p
        ua = _dir(uy, up_); fa = _dir(fy, fp)
        arm(rig, side, (ua.x, ua.y, ua.z), (fa.x, fa.y, fa.z), tw)

    def cost(p):
        apply(p)
        P = prop_matrix(rig, side, L, prop_scale)
        c = (P @ tl - tip_world).length
        if avoid is not None:
            for f in (0.0, 0.5, 1.0):
                d = (P @ (tl * f) - avoid).length
                if d < avoid_r:
                    c += (avoid_r - d) * 3
        if extra:
            c += extra(rig)
        return c
    if seeds is None:
        seeds = list(itertools.product((0, 40, 80), (-60, 0, 50), (-20, 20, 60), (-40, 0, 40), (-90, 0, 90)))
    scored = sorted(((cost(list(s)), list(s)) for s in seeds), key=lambda x: x[0])[:3]
    best = scored[0]
    for c0, p in scored:
        c = c0
        for step in (20, 8, 3, 1):
            improved = True
            while improved:
                improved = False
                for i in range(5):
                    for dlt in (step, -step):
                        q = list(p); q[i] += dlt * (3 if i == 4 else 1)
                        cq = cost(q)
                        if cq < c - 1e-5:
                            c, p, improved = cq, q, True
        if c < best[0]:
            best = (c, p)
    apply(best[1])
    P = prop_matrix(rig, side, L, prop_scale)
    return round((P @ tl - tip_world).length, 3), [round(v, 1) for v in best[1]]


def ik_arm(rig, side, wrist_target_world, pole_world, flex=(0.0, 0.0), extra_bones_reset=True):
    """Natural arm pose: Blender IK on lowerarm (chain 2: upperarm + lowerarm) drives the wrist to
    `wrist_target_world`, the elbow plane follows the pole point; wrist bone stays in line with the
    forearm and the hand gets only a small flex (deg about hand X, hand Z). Baked to plain rotations."""
    s = side
    pb = rig.pose.bones
    if extra_bones_reset:
        reset(rig, [f'{n}.{s}' for n in ARM])
    tgt = bpy.data.objects.new('_ikw_tgt', None); bpy.context.scene.collection.objects.link(tgt)
    pol = bpy.data.objects.new('_ikw_pole', None); bpy.context.scene.collection.objects.link(pol)
    tgt.location = wrist_target_world; pol.location = pole_world
    c = pb[f'lowerarm.{s}'].constraints.new('IK')
    c.target = tgt; c.pole_target = pol; c.chain_count = 2; c.use_tail = True; c.iterations = 300
    import math
    # pole angle: pick the one that puts the elbow nearest the pole point
    best = None
    for pa in range(-180, 180, 30):
        c.pole_angle = math.radians(pa); vl.update()
        E = rig.matrix_world @ pb[f'lowerarm.{s}'].head
        d = (E - Vector(pole_world)).length
        if best is None or d < best[0]:
            best = (d, pa)
    c.pole_angle = math.radians(best[1]); vl.update()
    vis = {n: pb[n].matrix.copy() for n in (f'upperarm.{s}', f'lowerarm.{s}')}
    pb[f'lowerarm.{s}'].constraints.remove(c)
    bpy.data.objects.remove(tgt); bpy.data.objects.remove(pol)
    vl.update()
    for n in (f'upperarm.{s}', f'lowerarm.{s}'):
        pb[n].matrix = vis[n]; pb[n].scale = (1, 1, 1); vl.update()
    fx, fz = flex
    sx = 1 if s == 'l' else -1
    pb[f'hand.{s}'].rotation_quaternion = (Euler((radians(fx), 0, radians(sx * fz)))).to_quaternion()
    vl.update()


def joint_angles(rig, side):
    """elbow angle (180 = straight) and wrist bend (0 = straight) in degrees."""
    import math
    pb = rig.pose.bones; s = side
    def ydir(n):
        return (pb[n].matrix.to_3x3() @ Vector((0, 1, 0))).normalized()
    elbow = 180 - math.degrees(ydir(f'upperarm.{s}').angle(ydir(f'lowerarm.{s}')))
    wrist = math.degrees(ydir(f'lowerarm.{s}').angle(ydir(f'hand.{s}')))
    return round(elbow, 1), round(wrist, 1)
