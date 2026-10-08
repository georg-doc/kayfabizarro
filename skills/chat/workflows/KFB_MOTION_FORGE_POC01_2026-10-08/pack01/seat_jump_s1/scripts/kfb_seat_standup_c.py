"""Sprint #381 item 1a rev c: stand up from the table stool, the legs push the stool back (Georg 2026-10-08).

Rev b stood up in three steps: scoot back seated (stool glued to the pelvis, reads as pushing off the table),
blend the arms, then KayKit Sit_Chair_StandUp. Rev c:
  * the KayKit stand-up starts at once (short lead-in from the activity's first frame); the actor travels back to the
    same standing spot as rev b (scoot S) during the rise, time-driven so the forward lean never reaches the table;
  * the arms blend from the activity pose to the stand-up arms; while the hands would cut through the table slab the
    upper arms are lifted forward-up just enough (per-frame search, smoothed envelope), so the hands come up off the
    table instead of through it;
  * the stool is not keyed to the actor: it is pushed by the leg vertices below the seat (collision with the
    stool's front half) and coasts out with friction after contact ends (ease-out). Its curve is stored on the
    action as stoolCurve (offset +Y from the seated placement, KayKit units of this rig).
Sit-down is unchanged (kfb_seat_transitions.build).
"""
import bpy, math
from mathutils import Matrix
import kfb_forge as F
import kfb_table_activity as TA
import kfb_table_atlas as AT
import kfb_seat_transitions as ST

N_LEAD = 6          # activity frame 0 -> stand-up frame 0 (lower body)
ARM_T0, ARM_N = 8, 10
BACK_T0, BACK_T1 = 10, 16
TAIL = 10           # standing hold so the stool can coast out
STOOL_GAP = 0.03    # x FURN
STOOL_DECAY = 0.70  # per-frame velocity kept while coasting
ARM_MESHES = ('ArmLeft', 'ArmRight')


def make_action_full(name, T, out):
    """kfb_forge.make_action keys location on the hips only. KayKit Sit_Chair_StandUp also moves the upper-leg
    joints (up to 0.09): key location on every bone that moves, so the action plays what was built."""
    a = F.make_action(name, T, out)
    slot = a.slots[0]
    cb = a.layers[0].strips[0].channelbag(slot)
    for bn in out[0]:
        if bn == 'hips' or not any(b[bn][1].length > 1e-5 for b in out):
            continue
        for i in range(3):
            fc = cb.fcurves.new(f'pose.bones["{bn}"].location', index=i, group_name=bn)
            fc.keyframe_points.add(len(out))
            co = []
            for fi, b in enumerate(out):
                co += [fi, b[bn][1][i]]
            fc.keyframe_points.foreach_set('co', co)
            for kp in fc.keyframe_points:
                kp.interpolation = 'LINEAR'
            fc.update()
    return a


def zero_locations(T):
    """Unkeyed pose locations keep whatever the last script pose left; reset before playing clips."""
    for pb in T.pose.bones:
        pb.location = (0, 0, 0)
    bpy.context.view_layer.update()


def slab(rig):
    lo, hi = AT.box_world(bpy.data.objects[f'FTP_{rig}_table'])
    return lo, hi, lo.z + 0.80 * AT.FURN_TABLE[rig]


def pen(T, rig, include=None):
    """Body vertices inside the table slab (top .. underside)."""
    lo, hi, under = slab(rig)
    return sum(1 for p in AT.mesh_points(T, include=include)
               if lo.x < p.x < hi.x and lo.y < p.y < hi.y and under < p.z < hi.z)


def pen_body(T, rig):
    """Slab penetration of everything but the arms (the arms get their own hand path)."""
    lo, hi, under = slab(rig)
    n = 0
    dg = bpy.context.evaluated_depsgraph_get()
    for o in T.children_recursive:
        if o.type != 'MESH' or o.name.startswith(('EYE_', 'FTP_')) or o.name.endswith(ARM_MESHES):
            continue
        oe = o.evaluated_get(dg); m = oe.to_mesh()
        n += sum(1 for v in m.vertices for p in (oe.matrix_world @ v.co,)
                 if lo.x < p.x < hi.x and lo.y < p.y < hi.y and under < p.z < hi.z)
        oe.to_mesh_clear()
    return n


def prop_boxes(rig):
    """BVH trees of the food on the table (sandwich at its current state), in world space."""
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get(); out = []
    for key in ('sandwich', 'plate'):
        o = bpy.data.objects.get(f'FTP_{rig}_{key}')
        if o:
            oe = o.evaluated_get(dg); m = oe.to_mesh()
            out.append(BVHTree.FromPolygons([oe.matrix_world @ v.co for v in m.vertices], [tuple(p.vertices) for p in m.polygons]))
            oe.to_mesh_clear()
    return out


def prop_pen(T, trees, include):
    """Vertices inside a prop (nearest surface normal points away from the vertex)."""
    n = 0
    for p in AT.mesh_points(T, include=include):
        for t in trees:
            loc, nrm, idx, dist = t.find_nearest(p, 0.3)
            if loc is not None and (p - loc).dot(nrm) < 0:
                n += 1
                break
    return n


HEAD_MESHES = ('Head', 'Hat')


def lift(T, theta):
    for side in ('l', 'r'):
        pb = T.pose.bones[f'upperarm.{side}']
        M = pb.matrix.copy(); h = M.translation.copy()
        pb.matrix = Matrix.Translation(h) @ Matrix.Rotation(-theta, 4, 'X') @ Matrix.Translation(-h) @ M
        bpy.context.view_layer.update()


def build(rig, activity='eat'):
    T = bpy.data.objects[F.TARGETS[rig]]
    act = bpy.data.actions[AT.clip_name(rig, activity)]
    dz = float(act.get('atlasOffsetZ', 0.0))
    first = AT.sample(T, act, [int(act.frame_range[0])])[0]
    usrc, dsrc = ST.src_action(rig, 'up'), ST.src_action(rig, 'down')
    u0, u1 = [int(round(x)) for x in usrc.frame_range]
    up = AT.sample(T, usrc, list(range(u0, u1 + 1)))
    stand0 = AT.sample(T, dsrc, [int(round(dsrc.frame_range[0]))])[0]
    T.animation_data.action = None
    S, front, edge = ST.scoot_distance(rig, stand0)
    pu = ST._progress(T, up)
    up_l = []
    for s, p in zip(up, pu):
        TA._set(T, s); ST._shift(T, dz=dz * (1 - p)); up_l.append(TA._basis(T))
    arms = set().union(*[AT.subtree(T, r) for r in AT.MASK])
    lower = [AT._mix(first, up_l[0], ST.smooth(j / N_LEAD)) for j in range(1, N_LEAD + 1)] + up_l + [up_l[-1]] * TAIL
    n = len(lower)
    ys = [S * ST.smooth((i - BACK_T0) / (BACK_T1 - BACK_T0)) for i in range(n)]
    ws = [ST.smooth((i - ARM_T0) / ARM_N) for i in range(n)]

    def pose(i, th):
        mix = AT._mix(first, lower[i], ws[i])
        TA._set(T, {bn: (mix[bn] if bn in arms else lower[i][bn]) for bn in lower[i]})
        ST._shift(T, dy=ys[i])
        if th > 0:
            lift(T, th)
    need = []
    for i in range(n):
        th = 0.0; pose(i, 0)
        while pen(T, rig) > 0 and th < math.radians(100):
            th += math.radians(5); pose(i, th)
        need.append(th)
    dil = [max(need[max(0, i - 2):i + 3]) for i in range(n)]
    sm = [sum(dil[max(0, i - 2):i + 3]) / len(dil[max(0, i - 2):i + 3]) for i in range(n)]
    th_s = [max(a, b) for a, b in zip(sm, need)]
    # the smoothed envelope can push hands that are already below the slab up into it: per frame, take the
    # zero-penetration lift closest to the envelope
    grid = [math.radians(2.5 * j) for j in range(41)]
    for i in range(n):
        pose(i, th_s[i])
        if pen(T, rig) > 0:
            ok = []
            for th in grid:
                pose(i, th)
                if pen(T, rig) == 0:
                    ok.append(th)
            if ok:
                th_s[i] = min(ok, key=lambda t: abs(t - th_s[i]))
    out, res = [], []
    for i in range(n):
        pose(i, th_s[i]); res.append(pen(T, rig)); out.append(TA._basis(T))
    name = f'{rig}|FORGE|PACK|kfb_seat_stand_up_table_c'
    a = F.make_action(name, T, out)
    a['clip_id'] = name.split('|')[-1]; a['scoot'] = S; a['atlasOffsetZ'] = dz; a['activity'] = activity
    a['scootCurve'] = ys; a['armLiftDeg'] = [round(math.degrees(t), 1) for t in th_s]
    facts = dict(S=round(S, 3), frames=n, liftMaxDeg=round(math.degrees(max(th_s))), residualSlabPen=sum(res),
                 liftMaxStepDeg=round(max(abs(math.degrees(b - a)) for a, b in zip(th_s, th_s[1:])), 1))
    facts.update(simulate_stool(rig, a))
    return a, facts


HAND_Z = 0.05       # x FURN_TABLE: hands stay this far above the table top while over it
HAND_Y = 0.08       # x FURN_TABLE: ... and until this far behind the near edge
POLE = {'r': (-1.0, 0.6, -0.2), 'l': (1.0, 0.6, -0.2)}


def build_ik(rig, activity='eat', back=None, back_t1=None):
    """Arms by hand path instead of the lift search: each hand goes from where the activity pose leaves it (moving
    with the body) to where the stand-up clip puts it, blended by the arm weight; while the hand is over the table
    its height is clamped above the top, so the hands slide back over the table and drop behind the edge."""
    from mathutils import Vector
    T = bpy.data.objects[F.TARGETS[rig]]
    act = bpy.data.actions[AT.clip_name(rig, activity)]
    dz = float(act.get('atlasOffsetZ', 0.0))
    zero_locations(T)
    first = AT.sample(T, act, [int(act.frame_range[0])])[0]
    usrc, dsrc = ST.src_action(rig, 'up'), ST.src_action(rig, 'down')
    u0, u1 = [int(round(x)) for x in usrc.frame_range]
    zero_locations(T)
    up = AT.sample(T, usrc, list(range(u0, u1 + 1)))
    zero_locations(T)
    stand0 = AT.sample(T, dsrc, [int(round(dsrc.frame_range[0]))])[0]
    T.animation_data.action = None
    S, front, edge = ST.scoot_distance(rig, stand0)
    pu = ST._progress(T, up)
    up_l = []
    for s, p in zip(up, pu):
        TA._set(T, s); ST._shift(T, dz=dz * (1 - p)); up_l.append(TA._basis(T))
    arms = set().union(*[AT.subtree(T, r) for r in AT.MASK])
    lower = [AT._mix(first, up_l[0], ST.smooth(j / N_LEAD)) for j in range(1, N_LEAD + 1)] + up_l + [up_l[-1]] * TAIL
    n = len(lower)
    Sb = S if back is None else back; t1 = back_t1 or BACK_T1
    ys = [Sb * ST.smooth((i - BACK_T0) / (t1 - BACK_T0)) for i in range(n)]
    ws = [ST.smooth((i - ARM_T0) / ARM_N) for i in range(n)]
    lo, hi, under = slab(rig)
    kt = AT.FURN_TABLE[rig]
    Wi = T.matrix_world.inverted()

    def plain(i, w):
        mix = AT._mix(first, lower[i], w)
        TA._set(T, {bn: (mix[bn] if bn in arms else lower[i][bn]) for bn in lower[i]})
        ST._shift(T, dy=ys[i])

    def hands():
        return {sd: T.matrix_world @ T.pose.bones[f'hand.{sd}'].head for sd in 'lr'}
    # back travel: late ramp (during the hop-off, after the hips unload) plus, earlier, only as much as the
    # forward lean needs to keep the belly out of the table slab (the stool then stays put under the butt)
    need_y = []
    for i in range(n):
        plain(i, ws[i]); y = 0.0
        while pen_body(T, rig) > 0 and y < 0.5 * kt:
            y += 0.01 * kt; ST._shift(T, dy=0.01 * kt)
        need_y.append(ys[i] + y)
    run = 0.0; early = []
    for y in need_y:
        run = max(run, y); early.append(run)
    ys = [max(a, b) for a, b in zip(ys, early)]
    AB = []
    for i in range(n):
        plain(i, 0.0); A = hands()
        plain(i, 1.0); B = hands(); pb1 = TA._basis(T)
        AB.append((A, B, pb1))

    def pose(i, raise_z):
        A, B, pb1 = AB[i]
        w = ws[i]
        plain(i, w)
        if w <= 0.0 and raise_z <= 0.0:
            return
        if w >= 1.0:
            return
        base = TA._basis(T)
        for sd in 'lr':
            t = A[sd].lerp(B[sd], w); t.z += raise_z
            AT._arm_ik(T, sd, Wi @ t, Vector(POLE[sd]))
        ik = TA._basis(T)
        g = ST.smooth((w - 0.7) / 0.3)          # last 30 % of the blend: IK hands back to the clip's own arms
        mix = AT._mix(ik, pb1, g)
        TA._set(T, {bn: (mix[bn] if bn in arms else base[bn]) for bn in base})
    boxes = prop_boxes(rig)

    def blocked(i):
        # the activity's own grip touches the sandwich (frames before the arm blend starts): only the slab counts there
        return pen(T, rig, ARM_MESHES) + (prop_pen(T, boxes, ARM_MESHES) if ws[i] > 0 else 0)
    step = 0.02 * kt
    need = []
    for i in range(n):
        r = 0.0; pose(i, r)
        while blocked(i) > 0 and r < 0.8 * kt:
            r += step; pose(i, r)
        need.append(r)
    dil = [max(need[max(0, i - 2):i + 3]) for i in range(n)]
    rz = [max(need[i], sum(dil[max(0, i - 2):i + 3]) / len(dil[max(0, i - 2):i + 3])) for i in range(n)]
    for i in range(n):
        pose(i, rz[i])
        if blocked(i) > 0:
            ok = []
            for j in range(41):
                pose(i, j * step)
                if blocked(i) == 0: ok.append(j * step)
            if ok: rz[i] = min(ok, key=lambda x: abs(x - rz[i]))
    out, res, clamp = [], [], [round(x / kt, 2) for x in rz]
    for i in range(n):
        pose(i, rz[i]); out.append(TA._basis(T))
    # feet: the actor hops down from the stool (KayKit legs dangle); after touchdown the feet stay planted and
    # never sink below the floor (the clip's own hips travel + the back travel made them skate and sink)
    k = AT.FURN[rig]; fz0 = T.matrix_world.translation.z
    land = None; ys = list(ys); zs = []; fys = []
    for i in range(n):
        TA._set(T, out[i])
        zs.append(min(p.z for p in AT.mesh_points(T, include=('Leg',))) - fz0)
        fys.append({sd: (T.matrix_world @ T.pose.bones[f'foot.{sd}'].head).y for sd in 'lr'})
        if land is None and i > N_LEAD and zs[-1] < 0.01 * k:
            land = i
    # the KayKit stand-up ends with a small step of one foot: pin the foot that moves least after touchdown
    pin = min('lr', key=lambda sd: max(f[sd] for f in fys[land:]) - min(f[sd] for f in fys[land:])) if land else 'r'
    for i in range(n):
        TA._set(T, out[i])
        zmin = zs[i]
        dy = (fys[land][pin] - fys[i][pin]) if land is not None and i >= land else 0.0
        dzf = max(0.0, -zmin)
        if dy or dzf:
            ST._shift(T, dy=dy, dz=dzf); out[i] = TA._basis(T); ys[i] += dy
    # head: the short standing Farmer passes the plate at nose height; tilt the head back just enough to keep
    # head and hat out of the food boxes (smoothed envelope)
    def tilt(th):
        pb = T.pose.bones['head']
        M = pb.matrix.copy(); h = M.translation.copy()
        pb.matrix = Matrix.Translation(h) @ Matrix.Rotation(-th, 4, 'X') @ Matrix.Translation(-h) @ M
        bpy.context.view_layer.update()
    hneed = []
    for i in range(n):
        th = 0.0; TA._set(T, out[i])
        if i >= ARM_T0:
            while prop_pen(T, boxes, HEAD_MESHES) > 0 and th < math.radians(40):
                th += math.radians(2); TA._set(T, out[i]); tilt(th)
        hneed.append(th)
    hd = [max(hneed[max(0, i - 3):i + 4]) for i in range(n)]
    hs = [max(hneed[i], sum(hd[max(0, i - 3):i + 4]) / len(hd[max(0, i - 3):i + 4])) for i in range(n)]
    for i in range(n):
        if hs[i] > 0:
            TA._set(T, out[i]); tilt(hs[i]); out[i] = TA._basis(T)
    hprop = []
    for i in range(n):
        TA._set(T, out[i]); res.append(pen(T, rig))
        hprop.append(prop_pen(T, boxes, HEAD_MESHES) + (prop_pen(T, boxes, ARM_MESHES) if ws[i] > 0 else 0))
    name = f'{rig}|FORGE|PACK|kfb_seat_stand_up_table_c'
    a = make_action_full(name, T, out)
    a['clip_id'] = name.split('|')[-1]; a['scoot'] = S; a['atlasOffsetZ'] = dz; a['activity'] = activity
    a['scootCurve'] = ys
    facts = dict(S=round(S, 3), back=round(Sb, 3), frames=n, footDown=land, pinFoot=pin, headTiltMaxDeg=round(math.degrees(max(hs))), propPenFrames=[(i, c) for i, c in enumerate(hprop) if c], earlyBack=[round(y, 3) for y in early[:16]], endTravel=round(ys[-1], 3),
                 slabPenFrames=[(i, c) for i, c in enumerate(res) if c],
                 handRaise=clamp)
    facts.update(simulate_stool(rig, a))
    return a, facts


def simulate_stool(rig, a):
    """Push the stool with the leg vertices below the seat, then let it coast (ease-out). Stores a['stoolCurve']."""
    T = bpy.data.objects[F.TARGETS[rig]]
    st = bpy.data.objects[f'FTP_{rig}_stool']
    st.animation_data_clear()
    k = AT.FURN[rig]
    lo, hi = AT.box_world(st); seat = hi.z
    zero_locations(T); F.use_action(T, a)
    n = int(round(a.frame_range[1] - a.frame_range[0])) + 1
    s = v = 0.0; curve = []; pushed = []
    for f in range(n):
        bpy.context.scene.frame_set(f)
        req = 0.0
        # any body vertex below the seat top (the seated butt sinks ~0.04k into it, so 0.045k) inside or in front
        # of the stool's footprint pushes it
        for p in AT.mesh_points(T):
            if p.z < seat - 0.045 * k and lo.x - 0.01 < p.x < hi.x + 0.01 and p.y < hi.y + s:
                req = max(req, p.y - lo.y + STOOL_GAP * k)
        coast = s + v * STOOL_DECAY
        if req > coast and req > 0.015 * k:      # dead zone: the seated calves graze the front edge
            v = req - s; s = req; pushed.append(f)
        else:
            v *= STOOL_DECAY; s = coast
        curve.append(s)
    a['stoolCurve'] = curve
    return dict(stoolPushFrames=[pushed[0], pushed[-1]] if pushed else None, stoolTravel=round(curve[-1], 3),
                stoolEndSpeed=round(v, 4))


def key_stool(rig, a):
    st = bpy.data.objects[f'FTP_{rig}_stool']
    st.animation_data_clear()
    base_y = st.location.y
    for f, y in enumerate(a['stoolCurve']):
        st.location.y = base_y + y
        st.keyframe_insert('location', index=1, frame=f)
    st.location.y = base_y


def render_cycle(rig, out_dir, tag, scale, tgt, activity='eat', views=('front34', 'side'), only=None):
    """Preview: sit-down (rev b) -> one activity loop -> stand-up (rev c), numbered frames per view."""
    from mathutils import Vector
    T = bpy.data.objects[F.TARGETS[rig]]
    st = bpy.data.objects[f'FTP_{rig}_stool']
    base_y = st.location.y
    bite = bpy.data.objects.get(f'FTP_{rig}_bite')
    sw = bpy.data.objects.get(f'FTP_{rig}_sandwich')
    d = bpy.data.actions[f'{rig}|FORGE|PACK|kfb_seat_sit_down_table_b']
    u = bpy.data.actions[f'{rig}|FORGE|PACK|kfb_seat_stand_up_table_c']
    act = bpy.data.actions[AT.clip_name(rig, activity)]
    AT.TGT = Vector(tgt)
    keep_bite = bite.animation_data.action if bite and bite.animation_data else None
    sw_act = sw.animation_data.action if sw and sw.animation_data else None
    n_act = int(round(act.frame_range[1] - act.frame_range[0])) + 1
    segs = [('down', d), ('act', act), ('up', u)]
    for k, (name, a) in enumerate(segs):
        if only and name not in only:
            continue
        if sw and sw_act:
            sw.animation_data.action = sw_act
        zero_locations(T); F.use_action(T, a); AT.cycle(a, False)
        if name == 'act':
            st.animation_data_clear(); st.location.y = base_y
            if bite and keep_bite: bite.animation_data.action = keep_bite
        else:
            st.location.y = base_y
            if name == 'up':
                key_stool(rig, a)
            else:
                ST.key_stool(rig, a)
            if sw and sw_act:
                bpy.context.scene.frame_set(0 if name == 'down' else n_act - 1)
                sx = sw.scale.x
                sw.animation_data.action = None; sw.scale.x = sx
            if bite:
                if bite.animation_data: bite.animation_data.action = None
                bite.hide_render = True
        n = int(round(a.frame_range[1] - a.frame_range[0])) + 1
        AT.render_seq(rig, out_dir, f'{tag}_{k:02d}{name}', list(range(0, n)), views=views, scale=scale)
    st.animation_data_clear(); st.location.y = base_y
    if bite and keep_bite: bite.animation_data.action = keep_bite
    if sw and sw_act: sw.animation_data.action = sw_act


def build_planted(rig, activity='eat'):
    """build_ik with the back travel finished by touchdown and scaled so the planted standing spot is S (the same
    spot as rev b: the standing body clears the table edge)."""
    a, f = build_ik(rig, activity)
    for _ in range(3):
        if f['endTravel'] >= f['S'] - 0.005:
            break
        a, f = build_ik(rig, activity, back=f['back'] + (f['S'] - f['endTravel']))
    return a, f
