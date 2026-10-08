"""Sprint #381 item 1b: jump up onto / down from a raised prop (stool, Clown circus podium, terrain step).

Lower and upper body = KayKit Jump_Start / Jump_Idle / Jump_Land (Rig_Medium MovementBasic, unmodified;
Rig_Large = retargeted). The KayKit clips are in place (the runtime normally moves the body), so the flight is
baked here as a ballistic arc added to the hips:
  * height h = prop top (measured from the prop's bounding box), distance d = takeoff stance -> prop centre;
  * apex = max(0, h) + CLEAR (x FURN), gravity G (cartoon-snappy), so the air time follows from h:
        t_up = sqrt(2*(apex-0)/G), t_down = sqrt(2*(apex-h)/G)   (jump up)  -- the same formula for jumping down;
  * takeoff = the KayKit Jump_Start frame where the feet leave the ground, contact = the Jump_Land frame where they
    touch again; the air frames between them are filled with the Jump_Start tail + Jump_Idle hang pose.
The end offset (forward d, up h) is baked into the hips; the runtime moves the root by it after the clip.
"""
import bpy, math
from mathutils import Vector
import kfb_forge as F
import kfb_forge_pack as P
import kfb_table_activity as TA
import kfb_table_atlas as AT

SRC = {'start': 'M|KK|MovementBasic|Jump_Start', 'idle': 'M|KK|MovementBasic|Jump_Idle', 'land': 'M|KK|MovementBasic|Jump_Land'}
TAKEOFF_F = 8          # Jump_Start: feet leave the ground (foot z 0.15 -> 0.24)
CONTACT_F = 4          # Jump_Land: feet back on the ground (foot z 0.17 at f4, 0.15 at f5)
G = 22.0               # (rev 1, floaty) kept for the record
# rev 2 (Georg 2026-10-08: "sieht aus, als würden sie schweben" -> timing): cartoon gravity per kfb-cartoon-animation
#   00-principles "snappy with a held anticipation and fast travel", 10-body-mechanics weight classes:
#   fast rise that decelerates into a short apex hang, then a much harder fall, a held crouch before takeoff and a
#   held compression on landing; heavy (Large) = longer load, shorter air, slower recovery.
G_UP = {'M': 34.0, 'L': 40.0}
G_DN = {'M': 80.0, 'L': 95.0}
APEX_HOLD = 2          # frames of tight spacing at the apex
ANTIC_HOLD = {'M': 2, 'L': 4}   # extra frames held at the deepest crouch (Jump_Start f6)
LAND_HOLD = {'M': 1, 'L': 3}    # extra frames held at the deepest landing compression (Jump_Land f5)
CLEAR = 0.30           # apex above the higher of start / end (x FURN)
LAND_GAP = 0.75        # jump down lands this far beyond the prop edge (x FURN): body half-depth + margin
FPS = 30.0
A = AT.A
PROPS = {'stool': AT.DG + 'stool.gltf',
         'podium': A + 'KayKit_Mystery_Monthly_Series_4/11 - May 2024 - Clown/assets/gltf/circus_podium.gltf'}


def src_action(rig, key):
    name = SRC[key]
    if rig == 'M':
        return bpy.data.actions[name]
    dst = 'L|FORGE|JUMP|' + name.split('|')[-1] + '_fromM'
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


def _shift(T, dy, dz):
    pb = T.pose.bones['hips']
    M = pb.matrix.copy(); M.translation.y += dy; M.translation.z += dz
    pb.matrix = M
    bpy.context.view_layer.update()


def arc(h, k, clear=None, rig='M'):
    """Cartoon-gravity flight from height 0 to h: rise under G_UP to the apex (clear above the higher end), a short
    apex hang, then a hard fall under G_DN. Horizontal travel is linear in time (even spacing in plan view keeps
    the arc honest); returns (frames_air, z(i), s(i))."""
    apex = max(0.0, h) + (CLEAR if clear is None else clear) * k
    gu, gd = G_UP[rig] / k ** 0.5, G_DN[rig] / k ** 0.5       # larger body = slightly longer fall in units
    t_up = math.sqrt(2 * apex / gu)
    t_dn = math.sqrt(2 * (apex - h) / gd)
    n_up = max(2, int(round(t_up * FPS)))
    n_dn = max(2, int(round(t_dn * FPS)))
    zs = []
    for i in range(n_up + 1):                 # decelerating rise
        t = t_up * i / n_up
        zs.append(gu * t_up * t - 0.5 * gu * t * t)
    for i in range(APEX_HOLD):                # hang
        zs.append(apex - 0.01 * k * (i + 1) / APEX_HOLD)
    a0 = zs[-1]
    for i in range(1, n_dn + 1):              # accelerating fall
        t = t_dn * i / n_dn
        zs.append(a0 - (a0 - h) * (t / t_dn) ** 2)
    zs[-1] = h
    n = len(zs) - 1
    # jumping up: rise first, move over the edge late (feet clear the rim); jumping down: leave the edge first
    ss = [(i / n) ** 1.5 if h >= 0 else 1 - (1 - i / n) ** 1.3 for i in range(n + 1)]
    return n, zs, ss


def build(rig, h, d, name, hold=12, z0=0.0, y0=0.0, clear=None):
    """Jump from the floor (z=0) forward by d onto height h (negative h = jump down). Returns (action, facts)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    k = AT.FURN[rig]
    for pb in T.pose.bones:
        pb.scale = (1, 1, 1)
    st, idle, land = src_action(rig, 'start'), src_action(rig, 'idle'), src_action(rig, 'land')
    s0, s1 = [int(round(x)) for x in st.frame_range]
    i0, i1 = [int(round(x)) for x in idle.frame_range]
    l0, l1 = [int(round(x)) for x in land.frame_range]
    pre_f = list(range(s0, TAKEOFF_F + 1))
    pre_f = pre_f[:7] + [6] * ANTIC_HOLD[rig] + pre_f[7:]          # hold the deepest crouch (load)
    pre = AT.sample(T, st, pre_f)
    n, zs, ss = arc(h, k, clear, rig)
    tail = AT.sample(T, st, list(range(TAKEOFF_F + 1, s1 + 1)))
    hang = AT.sample(T, idle, [i0 + (j % (i1 - i0 + 1)) for j in range(max(0, n - 1 - len(tail)))])
    air = (tail + hang)[:max(0, n - 1)]
    while len(air) < n - 1:
        air.append(air[-1] if air else pre[-1])
    post_f = list(range(l0 + CONTACT_F, l1 + 1))
    post_f = post_f[:2] + [l0 + CONTACT_F + 1] * LAND_HOLD[rig] + post_f[2:]   # hold the landing compression
    post = AT.sample(T, land, post_f)
    pre_land = AT.sample(T, land, list(range(l0, l0 + CONTACT_F)))
    # blend the last air frames into the landing approach so the legs reach down before contact
    m = min(len(pre_land), len(air))
    for j in range(m):
        w = (j + 1) / (m + 1)
        air[len(air) - m + j] = AT._mix(air[len(air) - m + j], pre_land[j], w)
    T.animation_data.action = None
    out = []
    for s in pre:
        TA._set(T, s); _shift(T, -y0, z0); out.append(TA._basis(T))
    for j, s in enumerate(air):
        TA._set(T, s); _shift(T, -y0 - d * ss[j + 1], z0 + zs[j + 1]); out.append(TA._basis(T))
    for s in post:
        TA._set(T, s); _shift(T, -y0 - d, z0 + h); out.append(TA._basis(T))
    if hold:
        idle_a = next((a for a in bpy.data.actions if a.name.startswith(rig + '|KK|') and a.name.endswith('|Idle_A')), None)
        if idle_a:
            i0_, i1_ = [int(round(x)) for x in idle_a.frame_range]
            hs = AT.sample(T, idle_a, [i0_ + (j % (i1_ - i0_ + 1)) for j in range(hold)])
            T.animation_data.action = None
            last = out[-1]
            for j, s in enumerate(hs):
                TA._set(T, s); _shift(T, -y0 - d, z0 + h)
                b = TA._basis(T)
                out.append(AT._mix(last, b, min(1.0, (j + 1) / 6)))
        else:
            out += [out[-1]] * hold
    a = F.make_action(name, T, out)
    a['clip_id'] = name.split('|')[-1]
    a['jumpHeight'] = h; a['jumpDistance'] = d; a['airFrames'] = n
    a['takeoffFrame'] = len(pre) - 1; a['contactFrame'] = len(pre) + len(air)
    a['rootEndOffset'] = [0.0, -d, h]
    return a, dict(frames=len(out), air=n, takeoff=len(pre) - 1, contact=len(pre) + len(air), apex=round(max(zs), 3))


def stage_prop(rig, key, d_centre):
    """Place the prop (x FURN) with its centre d_centre in front of the actor (actor faces -Y)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    col = AT.collection()
    for o in [o for o in bpy.data.objects if o.name.startswith(f'FTP_{rig}_')]:
        bpy.data.objects.remove(o, do_unlink=True)
    AT.PROPS['jump_' + key] = PROPS[key]
    o = AT._imp('jump_' + key, f'FTP_{rig}_{key}', col)
    o.scale = (AT.FURN[rig],) * 3
    bpy.context.view_layer.update()
    lo, hi = AT.box_world(o)
    W = T.matrix_world
    tgt = W @ Vector((0, -d_centre, 0))
    o.location += Vector((tgt.x - (lo.x + hi.x) / 2, tgt.y - (lo.y + hi.y) / 2, -lo.z))
    bpy.context.view_layer.update()
    lo, hi = AT.box_world(o)
    return o, dict(top=round(hi.z - W.translation.z, 3), nearEdge=round(-(hi.y - W.translation.y), 3), depth=round(hi.y - lo.y, 3))


def build_up_down(rig, key, gap=0.35, hold=30):
    """Preview / runtime pair for one prop: jump up onto its centre, stand (hold), jump down off the far side."""
    k = AT.FURN[rig]
    T = bpy.data.objects[F.TARGETS[rig]]
    o, info = stage_prop(rig, key, gap * k + 0.0)       # provisional, re-placed below
    depth = info['depth']
    d_up = gap * k + depth / 2
    o, info = stage_prop(rig, key, d_up)
    h = info['top']
    up, fu = build(rig, h, d_up, f'{rig}|FORGE|PACK|kfb_move_jump_up_{key}_b', hold=hold)
    d_dn = depth / 2 + LAND_GAP * k
    dn, fd = build(rig, -h, d_dn, f'{rig}|FORGE|PACK|kfb_move_jump_down_{key}_b', hold=12, z0=h, y0=d_up)
    # measured edge clearance: no foot vertex over the prop footprint below its top during the flight
    for tries in range(4):
        cu = edge_clearance(rig, up, o)
        if cu >= 0.02 * k:
            break
        clear = CLEAR + 0.1 * (tries + 1)
        up, fu = build(rig, h, d_up, f'{rig}|FORGE|PACK|kfb_move_jump_up_{key}_b', hold=hold, clear=clear)
    cd = edge_clearance(rig, dn, o)
    fu['edgeClearance'] = round(cu, 3); fd['edgeClearance'] = round(cd, 3)
    up['propTop'] = h; dn['propTop'] = h
    return up, dn, dict(prop=key, top=h, depth=depth, dUp=round(d_up, 3), dDown=round(d_dn, 3), up=fu, down=fd)


def edge_clearance(rig, a, prop):
    """Min height of the feet above the prop top while they are over the prop footprint, between takeoff and
    contact (negative = through the rim/top). Feet = leg mesh vertices below the knees."""
    T = bpy.data.objects[F.TARGETS[rig]]
    sc = bpy.context.scene
    from mathutils.bvhtree import BVHTree
    dg = bpy.context.evaluated_depsgraph_get()
    oe = prop.evaluated_get(dg); m = oe.to_mesh()
    tree = BVHTree.FromPolygons([oe.matrix_world @ v.co for v in m.vertices], [tuple(q.vertices) for q in m.polygons])
    oe.to_mesh_clear()
    lo, hi = AT.box_world(prop)
    F.use_action(T, a)
    t0, t1 = int(a['takeoffFrame']), int(a['contactFrame'])
    best = 9.0
    for f in range(t0 + 1, t1 - 2):      # the last two frames before contact are the landing itself
        sc.frame_set(f + 3); sc.frame_set(f)
        for p in AT.mesh_points(T, include=('Leg',)):
            if p.z > hi.z + 0.3:
                continue
            # is the point inside the real prop shape? cast straight down and up: inside = hits above and below
            up_hit = tree.ray_cast(p, Vector((0, 0, 1)))[0]
            dn_hit = tree.ray_cast(p, Vector((0, 0, -1)))[0]
            if up_hit is not None and dn_hit is not None:
                best = min(best, p.z - hi.z)                 # inside the prop: negative
            elif up_hit is None and dn_hit is not None:
                best = min(best, p.z - dn_hit.z)            # above some prop surface: height over it
    return best
