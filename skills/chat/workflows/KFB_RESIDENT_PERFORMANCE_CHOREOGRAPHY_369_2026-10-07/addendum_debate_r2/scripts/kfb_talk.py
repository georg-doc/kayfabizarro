"""KFB talk toolkit (Blender side): clip preparation, mirroring, hand-in-head audit, timeline -> NLA.

Used by the debate / monologue rule engine (kfb_talk_gen.py). Pure helpers, no scene side effects on import.
Action naming: '<rig>|MLB|<group>|<clip>' raw bake, '|MLBWn|' wrist-fixed + aligned, '|MLBWnM|' mirrored copy.
"""
import bpy, math
from mathutils import Vector, Quaternion


def fcs(a):
    for l in a.layers:
        for s in l.strips:
            for cb in s.channelbags:
                for fc in cb.fcurves: yield fc, cb


def refq(name):
    by = {}
    for fc, cb in fcs(bpy.data.actions[name]):
        if fc.data_path.endswith('rotation_quaternion'):
            by.setdefault(fc.data_path.split('"')[1], [0, 0, 0, 0])[fc.array_index] = fc.evaluate(0)
    return {b: Quaternion(v) for b, v in by.items()}


def align_quats(action, ref):
    """Flip every quaternion key onto the hemisphere of the previous key (seeded by the Idle_A pose)."""
    by = {}
    for fc, cb in fcs(action):
        if fc.data_path.endswith('rotation_quaternion'):
            by.setdefault(fc.data_path.split('"')[1], {})[fc.array_index] = fc
    for b, d in by.items():
        if len(d) < 4: continue
        prev = ref.get(b, Quaternion())
        for i in range(len(d[0].keyframe_points)):
            q = Quaternion([d[j].keyframe_points[i].co.y for j in range(4)])
            if q.dot(prev) < 0:
                for j in range(4):
                    k = d[j].keyframe_points[i]; k.co.y = -k.co.y; k.handle_left.y = -k.handle_left.y; k.handle_right.y = -k.handle_right.y
                q = -q
            prev = q
        for j in range(4): d[j].update()


def idle_name(rig): return f"{rig}|KK|General|Idle_A"


def prepared(rig, short):
    """'group|clip' -> wrist-fixed (wrist identity, hand = Idle_A) and Idle_A-aligned action name."""
    src = f"{rig}|MLB|{short}"; out = f"{rig}|MLBWn|{short}"
    if out in bpy.data.actions: return out
    idle = idle_name(rig)
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    hand = {}
    for fc, cb in fcs(bpy.data.actions[idle]):
        if fc.data_path.endswith('rotation_quaternion') and '"hand.' in fc.data_path:
            hand.setdefault(fc.data_path, {})[fc.array_index] = fc.evaluate(0)
    for fc, cb in fcs(a):
        p = fc.data_path; v = None
        if p.endswith('rotation_quaternion') and '"wrist.' in p: v = (1, 0, 0, 0)[fc.array_index]
        elif p.endswith('rotation_quaternion') and p in hand: v = hand[p][fc.array_index]
        if v is not None:
            for k in fc.keyframe_points: k.co.y = v; k.handle_left.y = v; k.handle_right.y = v
            fc.update()
    align_quats(a, refq(idle))
    return out


def _swap(n):
    if n.endswith('.l'): return n[:-2] + '.r'
    if n.endswith('.r'): return n[:-2] + '.l'
    return n


def mirrored(rig, short):
    """Left/right mirror of a prepared clip. KayKit rigs are exactly symmetric in rest (checked: 0.0 deviation), so
    mirror = swap .l/.r, quaternion (w, x, -y, -z), location (-x, y, z)."""
    src = prepared(rig, short); out = src.replace("|MLBWn|", "|MLBWnM|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    _mirror_inplace(a, rig)
    return out


def head_mesh(arm):
    for o in arm.children_recursive:
        if o.type == 'MESH' and 'Head' in o.name and 'Hat' not in o.name: return o


def hand_in_head(arm, action, step=2, shrink=0.92):
    """Count sampled hand positions inside the head ellipsoid (inscribed in the head mesh bounding box, shrunk)."""
    ad = arm.animation_data or arm.animation_data_create()
    keep = (ad.action, ad.use_nla); ad.use_nla = False; ad.action = bpy.data.actions[action]
    try: ad.action_slot = ad.action.slots[0]
    except Exception: pass
    hm = head_mesh(arm); bb = [Vector(c) for c in hm.bound_box]
    lo = Vector([min(c[i] for c in bb) for i in range(3)]); hi = Vector([max(c[i] for c in bb) for i in range(3)])
    ctr = (lo + hi) / 2; half = (hi - lo) / 2 * shrink
    sc = bpy.context.scene; f0, f1 = bpy.data.actions[action].frame_range; hits = 0; n = 0; worst = 9
    for f in range(int(f0), int(f1) + 1, step):
        sc.frame_set(f); bpy.context.view_layer.update(); inv = hm.matrix_world.inverted()
        for h in ('hand.l', 'hand.r'):
            pb = arm.pose.bones[h]; p = inv @ (arm.matrix_world @ ((pb.head + pb.tail) / 2))
            d = math.sqrt(sum(((p[i] - ctr[i]) / half[i]) ** 2 for i in range(3))); worst = min(worst, d)
            if d < 1: hits += 1
        n += 1
    ad.action = keep[0]; ad.use_nla = keep[1]
    return hits, round(worst, 2)


def build_nla(arm, rig, timeline, end):
    """timeline: list of dicts {action, start, a0, a1, bi, bo}; base layer = looping Idle_A."""
    idle = idle_name(rig)
    ad = arm.animation_data or arm.animation_data_create(); ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    tr = ad.nla_tracks.new(); tr.name = "base"; ac = bpy.data.actions[idle]
    st = tr.strips.new("Idle_A", 1, ac)
    try: st.action_slot = ac.slots[0]
    except Exception: pass
    st.action_frame_end = ac.frame_range[1]; st.repeat = math.ceil(end / ac.frame_range[1]) + 1; st.extrapolation = 'HOLD'
    # pack strips into as few tracks as possible (no overlap inside a track); later tracks override earlier ones
    tracks = []
    for ev in sorted(timeline, key=lambda e: e['start']):
        ac = bpy.data.actions[ev['action']]
        s0 = int(round(ev['start'])); s1 = s0 + (ev['a1'] - ev['a0'])
        top = max([i for i, (t, last) in enumerate(tracks) if last > s0 - 1] or [-1])
        idx = next((i for i in range(top + 1, len(tracks))), None)
        if idx is None:
            tracks.append([ad.nla_tracks.new(), s1]); idx = len(tracks) - 1
        tr = tracks[idx][0]; tracks[idx][1] = s1
        st = tr.strips.new(ev['action'].split('|')[-1][:40], s0, ac)
        try: st.action_slot = ac.slots[0]
        except Exception: pass
        st.action_frame_end = ev['a1']; st.action_frame_start = ev['a0']
        st.frame_end = s0 + (ev['a1'] - ev['a0'])
        st.use_auto_blend = False; st.extrapolation = 'NOTHING'
        ln = st.frame_end - st.frame_start
        st.blend_in = min(ev.get('bi', 8), ln * 0.45); st.blend_out = min(ev.get('bo', 8), ln * 0.45)
    ad.use_nla = True


LOWER = ('root', 'hips', 'upperleg.l', 'lowerleg.l', 'foot.l', 'toes.l', 'upperleg.r', 'lowerleg.r', 'foot.r', 'toes.r')


def upper_only(rig, short):
    """Seated talk on standing legs (Choreo Lab test A, 'upright' variant, simplified): the lower-body channels are
    dropped so the Idle_A base layer carries legs and hips; the spine's mean local rotation is moved onto the
    Idle_A spine so the seated forward lean goes, the sway stays."""
    src = prepared(rig, short); out = src.replace("|MLBWn|", "|MLBWnU|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    spine = {}
    for fc, cb in list(fcs(a)):
        bn = fc.data_path.split('"')[1]
        if bn in LOWER: cb.fcurves.remove(fc); continue
        if bn == 'spine' and fc.data_path.endswith('rotation_quaternion'): spine[fc.array_index] = fc
    if len(spine) == 4:
        n = len(spine[0].keyframe_points)
        qs = [Quaternion([spine[j].keyframe_points[i].co.y for j in range(4)]) for i in range(n)]
        acc = Quaternion((0, 0, 0, 0))
        for q in qs: acc = Quaternion([acc[k] + (q[k] if q.dot(qs[0]) >= 0 else -q[k]) for k in range(4)])
        mean = acc.normalized(); idle = refq(idle_name(rig)).get('spine', Quaternion())
        corr = idle @ mean.inverted()
        for i, q in enumerate(qs):
            q2 = corr @ q
            for j in range(4):
                k = spine[j].keyframe_points[i]; k.co.y = q2[j]; k.handle_left.y = q2[j]; k.handle_right.y = q2[j]
        for j in range(4): spine[j].update()
    return out


def variant_action(rig, short, variant='full', mirror=False):
    if variant == 'upper':
        an = upper_only(rig, short)
        if mirror:
            m = an.replace('|MLBWnU|', '|MLBWnUM|')
            if m not in bpy.data.actions:
                b = bpy.data.actions[an].copy(); b.name = m; b.use_fake_user = True
                _mirror_inplace(b, rig)
            an = m
        return an
    return mirrored(rig, short) if mirror else prepared(rig, short)


def _mirror_inplace(a, rig):
    for fc, cb in list(fcs(a)):
        p = fc.data_path; bn = p.split('"')[1]; nb = _swap(bn)
        if (p.endswith('rotation_quaternion') and fc.array_index in (2, 3)) or (p.endswith('location') and fc.array_index == 0):
            for k in fc.keyframe_points:
                k.co.y = -k.co.y; k.handle_left.y = -k.handle_left.y; k.handle_right.y = -k.handle_right.y
        if nb != bn: fc.data_path = p.replace(f'"{bn}"', f'"__{nb}"')
        fc.update()
    for fc, cb in fcs(a):
        if '"__' in fc.data_path: fc.data_path = fc.data_path.replace('"__', '"')
    align_quats(a, refq(idle_name(rig)))
