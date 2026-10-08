"""Sprint #381 item 1a: sit down onto / stand up from the table stool (Georg 2026-10-08).

Built on the table activity r8 (kfb_table_atlas.py):
  * lower body = KayKit Sit_Chair_Down / Sit_Chair_StandUp (Rig_Medium_Simulation), unmodified;
    Rig_Large = the Medium clips retargeted (no KayKit Large chair clips exist);
  * the Atlas seat offset (hips on the stool top) is ramped in with the seating progress, so the actor starts and
    ends standing on the floor;
  * the table is in the way of a front sit-down, so the actor sits down SCOOT behind its working spot and then
    scoots in with the stool (stool keys follow the pelvis after seat contact); stand-up is the reverse;
  * the arms blend between the sit pose and the activity's first frame while the actor is still scooted back.
Sequence sit-down: DOWN (src frames) -> ARMS (blend to activity frame 0) -> SCOOT IN.
Sequence stand-up: SCOOT OUT -> ARMS (blend to the sit pose) -> UP (src frames).
"""
import bpy, math
from mathutils import Vector
import kfb_forge as F
import kfb_forge_pack as P
import kfb_table_activity as TA
import kfb_table_atlas as AT

SRC = {'down': 'M|KK|Simulation|Sit_Chair_Down', 'up': 'M|KK|Simulation|Sit_Chair_StandUp'}
N_ARMS = 14
N_SCOOT = 12
SCOOT_GAP = 0.05


def smooth(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def src_action(rig, kind):
    name = SRC[kind]
    if rig == 'M':
        return bpy.data.actions[name]
    dst = 'L|FORGE|SIT|' + name.split('|')[-1] + '_fromM'
    if dst not in bpy.data.actions:
        S = bpy.data.objects[F.TARGETS['M']]; T = bpy.data.objects[F.TARGETS['L']]
        ks, kt = S.animation_data.action, T.animation_data.action
        F.use_action(S, bpy.data.actions[name])
        frames, srest = F.sample(S)
        smap = {b.name: b.name for b in T.data.bones if b.name in S.data.bones and b.name not in ('root',)}
        out, k = F.retarget(frames, srest, smap, T, align=True)
        a = F.make_action(dst, T, out); a.use_fake_user = True
        F.use_action(S, ks); F.use_action(T, kt)
    return bpy.data.actions[dst]


def _shift(T, dy=0.0, dz=0.0):
    pb = T.pose.bones['hips']
    M = pb.matrix.copy(); M.translation.y += dy; M.translation.z += dz
    pb.matrix = M
    bpy.context.view_layer.update()


def _progress(T, seq):
    """Seating progress 0..1 from the hips' backward travel (armature space)."""
    ys = []
    for s in seq:
        TA._set(T, s); ys.append(T.pose.bones['hips'].head.y)
    y0, y1 = ys[0], ys[-1]
    return [0.0 if abs(y1 - y0) < 1e-6 else min(1.0, max(0.0, (y - y0) / (y1 - y0))) for y in ys]


def scoot_distance(rig, standing):
    """Distance the actor must sit down behind its working spot so the standing body clears the table edge."""
    T = bpy.data.objects[F.TARGETS[rig]]
    tb = bpy.data.objects[f'FTP_{rig}_table']
    lo, hi = AT.box_world(tb)
    TA._set(T, standing)
    k = AT.FURN_TABLE[rig]
    pts = AT.mesh_points(T)
    base = T.matrix_world.translation
    # only the slab band matters (table underside .. top + plate): the hat brim passes over the table
    front = min(p.y for p in pts if 0.75 * k < p.z - base.z < 1.15 * k)
    return max(0.0, hi.y + SCOOT_GAP * AT.FURN[rig] - front), round(front, 3), round(hi.y, 3)


def build(rig, activity='eat'):
    """Returns (down_action, up_action, facts). Needs stage_variant(rig, activity) first (table + stool placed)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    act = bpy.data.actions[AT.clip_name(rig, activity)]
    dz = float(act.get('atlasOffsetZ', 0.0))
    first = AT.sample(T, act, [int(act.frame_range[0])])[0]
    dsrc, usrc = src_action(rig, 'down'), src_action(rig, 'up')
    d0, d1 = [int(round(x)) for x in dsrc.frame_range]
    u0, u1 = [int(round(x)) for x in usrc.frame_range]
    down = AT.sample(T, dsrc, list(range(d0, d1 + 1)))
    up = AT.sample(T, usrc, list(range(u0, u1 + 1)))
    T.animation_data.action = None
    S, front, edge = scoot_distance(rig, down[0])
    pd = _progress(T, down)
    pu = _progress(T, up)          # 0 = seated .. 1 = standing (hips travel forward)
    facts = dict(scoot=round(S, 3), standingFrontY=front, tableEdgeY=edge, atlasOffsetZ=round(dz, 4))

    def lifted(seq, prog, inv=False):
        out = []
        for s, p in zip(seq, prog):
            TA._set(T, s); _shift(T, dz=dz * ((1 - p) if inv else p)); out.append(TA._basis(T))
        return out
    down_l = lifted(down, pd)
    up_l = lifted(up, pu, inv=True)
    # sit-down: DOWN at +S, ARMS at +S, SCOOT S -> 0
    seq_d = list(down_l)
    seq_d += [AT._mix(down_l[-1], first, smooth(j / N_ARMS)) for j in range(1, N_ARMS + 1)]
    seq_d += [first] * N_SCOOT
    scoot_d = [S] * (len(down_l) + N_ARMS) + [S * (1 - smooth(j / N_SCOOT)) for j in range(1, N_SCOOT + 1)]
    # stand-up: SCOOT 0 -> S, ARMS back to the sit pose, UP at +S
    seq_u = [first] * N_SCOOT
    seq_u += [AT._mix(first, up_l[0], smooth(j / N_ARMS)) for j in range(1, N_ARMS + 1)]
    seq_u += list(up_l)
    scoot_u = [S * smooth(j / N_SCOOT) for j in range(1, N_SCOOT + 1)] + [S] * (N_ARMS + len(up_l))

    def apply(seq, scoot):
        out = []
        for s, y in zip(seq, scoot):
            TA._set(T, s); _shift(T, dy=y); out.append(TA._basis(T))
        return out
    acts = []
    for kind, seq, scoot in (('sit_down', seq_d, scoot_d), ('stand_up', seq_u, scoot_u)):
        name = f'{rig}|FORGE|PACK|kfb_seat_{kind}_table_b'
        a = F.make_action(name, T, apply(seq, scoot))
        a['clip_id'] = name.split('|')[-1]
        a['scoot'] = S; a['atlasOffsetZ'] = dz; a['activity'] = activity
        a['scootCurve'] = scoot      # stool follows the pelvis by this Y offset after seat contact
        a['seatContactFrame'] = (len(down_l) if kind == 'sit_down' else N_SCOOT + N_ARMS)
        acts.append(a)
    facts['frames'] = [len(seq_d), len(seq_u)]
    return acts[0], acts[1], facts


def key_stool(rig, a, sit_down=True):
    """Stool keys for preview: it stands +scoot back until the actor is seated, then slides with the pelvis."""
    st = bpy.data.objects[f'FTP_{rig}_stool']
    st.animation_data_clear()
    base_y = st.location.y
    curve = list(a['scootCurve'])
    for f, y in enumerate(curve):
        st.location.y = base_y + y
        st.keyframe_insert('location', index=1, frame=f)
    st.location.y = base_y
    return len(curve)


def render_cycle(rig, out_dir, tag, scale, tgt, activity='eat', views=('front34', 'side')):
    """Preview: sit-down -> one activity loop -> stand-up, numbered frames per view (prop keys swapped per segment)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    st = bpy.data.objects[f'FTP_{rig}_stool']
    base_y = st.location.y
    bite = bpy.data.objects.get(f'FTP_{rig}_bite')
    sw = bpy.data.objects.get(f'FTP_{rig}_sandwich')
    d = bpy.data.actions[f'{rig}|FORGE|PACK|kfb_seat_sit_down_table_b']
    u = bpy.data.actions[f'{rig}|FORGE|PACK|kfb_seat_stand_up_table_b']
    act = bpy.data.actions[AT.clip_name(rig, activity)]
    AT.TGT = Vector(tgt)
    k = 0
    segs = [('down', d), ('act', act), ('up', u)]
    keep_bite = bite.animation_data.action if bite and bite.animation_data else None
    sw_act = sw.animation_data.action if sw and sw.animation_data else None
    n_act = int(round(act.frame_range[1] - act.frame_range[0])) + 1
    for name, a in segs:
        if sw and sw_act and sw.animation_data.action is None:
            sw.animation_data.action = sw_act
        F.use_action(T, a); AT.cycle(a, False)
        if name == 'act':
            st.animation_data_clear(); st.location.y = base_y
            if bite and keep_bite: bite.animation_data.action = keep_bite
        else:
            st.location.y = base_y; key_stool(rig, a)
            if sw and sw.animation_data and sw.animation_data.action:
                # hold the food at its state after one eating loop (stand-up) or untouched (sit-down)
                bpy.context.scene.frame_set(0 if name == 'down' else n_act - 1)
                sw_keep = sw.animation_data.action; sx = sw.scale.x
                sw.animation_data.action = None; sw.scale.x = sx
            if bite:
                if bite.animation_data: bite.animation_data.action = None
                bite.hide_render = True
        n = int(round(a.frame_range[1] - a.frame_range[0])) + 1
        AT.render_seq(rig, out_dir, f'{tag}_{k:02d}{name}', list(range(0, n)), views=views, scale=scale)
        k += 1
    st.animation_data_clear(); st.location.y = base_y
    if bite and keep_bite: bite.animation_data.action = keep_bite
    if sw and sw_act: sw.animation_data.action = sw_act
