"""KFB table activity with Resident-Atlas seating (rev 8, Georg 2026-10-08).

Seating follows tools/resident_atlas_s6 (lib/atlas.js sitOn, data/cast.js Goth Girl):
  * lower body = KayKit Sit_Chair_Idle (Rig_Medium_Simulation), unmodified;
  * the actor is aligned by its hips bone onto the seat: seat = top centre of the host's bounding box;
    the only correction is a constant vertical offset of the whole actor (Atlas: "Das ist die ganze Korrektur");
  * upper body = a second clip on the upper-arm subtrees (MASK); chest and head stay in the sit clip;
    arms raised by THETA to clear the table, right hand IK-blended to the mouth at the bite (eat);
    write = both hands placed on the sheet by two-bone IK (build_write);
  * after sitOn the stool is pushed back until the heels clear it (push_stool_back, Georg 2026-10-08).
Furniture: KayKit Dungeon Pack 1.1 stool (box top 0.50) + table_medium (top 1.00, slab underside 0.80, yaw 90),
kit factor 1; Rig_Large uses the same furniture x1.78 (FURN). Entry point: stage_variant(rig, mode).
Earlier experiments left in the file for the record: stage() / witch_table / q_stool / table_small (all rejected).
No leg solver, no lean solver.
"""
import bpy, math
from mathutils import Vector
import kfb_forge as F
import kfb_forge_pack as P
import kfb_table_activity as TA

A = ('/Users/georg/Library/CloudStorage/Dropbox/CLAUDE/Frizzlebob fractal almanac BRIEFING anchor v2/3D TableDiorama '
     'KFB + PET Editor + PDF VIewer/3D ASSETS/')
DG = A + 'KayKit_Dungeon_Pack_1.1_FREE/Assets/gltf/'   # texture sits next to the gltf here
PP = A + 'Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/'
RPG = A + 'KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/'
HH = A + 'Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/'
DG_TEX = A + 'KayKit_Dungeon_Pack_1.1_FREE/Assets/gltf/dungeon_texture.png'
PROPS = {'stool': DG + 'stool.gltf', 'table': DG + 'table_small.gltf', 'plate': PP + 'plate_A.gltf',
         'sandwich': PP + 'sandwich.gltf', 'apple': PP + 'apple.gltf', 'apple_cut': PP + 'apple_cut.gltf',
         'mug': PP + 'mug.gltf', 'journal': RPG + 'journal_open.gltf', 'pencil': RPG + 'pencil_A_long.gltf',
         'letter': HH + 'letter.gltf', 'map': RPG + 'map.gltf'}
SIT = 'M|KK|Simulation|Sit_Chair_Idle'
SIT_SRC = {'M': SIT, 'L': 'L|FORGE|SIT|Sit_Chair_Idle_fromM'}   # Rig_Large has no KayKit chair sit: Medium clip retargeted
FURN = {'M': 1.0, 'L': 1.78}
FURN_TABLE = {'M': 1.0, 'L': 1.78}   # table may be adapted separately (Orc sits lower relative to its chest)    # adapted furniture: Orc Brute height = 1.78 H (K2 measurement); figures are never scaled
TABLE_TOP = 1.00
TABLE_UNDER = 0.80
TABLE_HALF = 0.50
GAP = 0.03


def subtree(T, root='chest'):
    return {b.name for b in T.data.bones[root].children_recursive} | {root}


def sample(T, act, frames):
    F.use_action(T, act)
    sc = bpy.context.scene
    out = []
    for f in frames:
        sc.frame_set(f + 3); sc.frame_set(f)
        out.append(TA._basis(T))
    return out


def layered(T, base_act, layer_act, n, base_f0=0, layer_frames=None, mask='chest'):
    """Atlas layering: base clip keeps every track outside the mask subtree, layer clip drives the subtree.
    mask may be one root bone or a tuple of roots (e.g. both upper arms: the sit clip keeps chest and head)."""
    roots = (mask,) if isinstance(mask, str) else tuple(mask)
    sub = set().union(*[subtree(T, r) for r in roots])
    b0, b1 = [int(round(x)) for x in base_act.frame_range]
    blen = b1 - b0 + 1
    base = sample(T, base_act, [b0 + (base_f0 + i) % blen for i in range(n)])
    lay = sample(T, layer_act, layer_frames)
    out = []
    for bb, ll in zip(base, lay):
        out.append({bn: (ll[bn] if bn in sub else bb[bn]) for bn in bb})
    return out, sorted(sub)


def hips_world(T):
    return T.matrix_world @ T.pose.bones['hips'].head


def _imp(key, name, col):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=PROPS[key])
    new = [o for o in bpy.data.objects if o not in before]
    o = [x for x in new if x.type == 'MESH'][0]
    for x in new:
        if x is not o:
            bpy.data.objects.remove(x, do_unlink=True)
    o.name = name
    o.rotation_mode = 'XYZ'                      # glTF import uses quaternions; we set Euler angles below
    for c in o.users_collection:
        c.objects.unlink(o)
    col.objects.link(o)
    if key in ('stool', 'table'):
        for m in o.data.materials:
            if m and m.use_nodes:
                for nd in m.node_tree.nodes:
                    if nd.type == 'TEX_IMAGE' and nd.image and not nd.image.has_data:
                        try:
                            nd.image.filepath = DG_TEX; nd.image.reload()
                        except Exception:
                            pass
    return o


def box_world(o):
    bpy.context.view_layer.update()
    vs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))),
            Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs))))


def mesh_points(T, include=None, exclude=('EYE_', 'FTP_')):
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in T.children_recursive:
        if o.type != 'MESH' or o.name.startswith(exclude):
            continue
        if include and not any(k in o.name for k in include):
            continue
        oe = o.evaluated_get(dg); m = oe.to_mesh()
        pts += [oe.matrix_world @ v.co for v in m.vertices]
        oe.to_mesh_clear()
    return pts

WITCH_TABLE = A + 'KayKit_Mystery_Monthly_Series_5/5 - November 2024 - Witch/assets/gltf/Table_Small.gltf'
PROPS['witch_table'] = WITCH_TABLE


def collection():
    col = bpy.data.collections.get('FORGE_TABLE_PROPS')
    if not col:
        col = bpy.data.collections.new('FORGE_TABLE_PROPS'); bpy.context.scene.collection.children.link(col)
    elif col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)
    return col


def clear_props(rig):
    for o in [o for o in bpy.data.objects if o.name.startswith(f'FTP_{rig}_')]:
        bpy.data.objects.remove(o, do_unlink=True)


def sit_on(T, host):
    """Atlas sitOn: seat = top centre of the host's box; returns the vertical actor offset (whole-actor shift)."""
    lo, hi = box_world(host)
    seat = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, hi.z))
    hp = hips_world(T)
    return seat, hp, seat - hp


def stage(rig, table_key='witch_table', frame=0):
    """Stool under the hips (Atlas rule), table in front of the torso, legs under the slab. Armature stays put;
    the furniture is placed in the actor's frame and the Atlas offset is reported (it is applied to the clip)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    col = collection(); clear_props(rig)
    st = _imp('stool', f'FTP_{rig}_stool', col)
    hp = hips_world(T)
    lo, hi = box_world(st)
    # Atlas: actor offset = seat - hips. Here we move the stool instead (same relative result) and report it.
    st.location = Vector((hp.x - (lo.x + hi.x) / 2, hp.y - (lo.y + hi.y) / 2, 0))
    bpy.context.view_layer.update()
    seat, hp2, off = sit_on(T, st)
    tb = _imp(table_key, f'FTP_{rig}_table', col)
    tb.rotation_euler = (0, 0, math.pi)          # long side toward the actor
    bpy.context.view_layer.update()
    return dict(stool=st, table=tb, seat=seat, hips=hp2, atlasOffsetZ=off.z)


TGT = Vector((0, -0.2, 1.1))
VIEWS = {'side': (90, 8), 'front34': (35, 22), 'top': (0, 89), 'back34': (215, 22), 'front': (0, 6)}


def render_views(rig, out_dir, tag, frames, views=('side', 'front34', 'top', 'back34'), res=420, scale=2.4):
    """Workbench stills of the actor + its FTP_ props from fixed directions. yaw 0 = in front of the actor (-Y)."""
    import os
    sc = bpy.context.scene
    T = bpy.data.objects[F.TARGETS[rig]]
    os.makedirs(out_dir, exist_ok=True)
    keep = (sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.frame_current)
    cd = bpy.data.cameras.new('FTP_cam'); cam = bpy.data.objects.new('FTP_cam', cd); sc.collection.objects.link(cam)
    mine = {T} | set(T.children_recursive) | {o for o in sc.objects if o.name.startswith(f'FTP_{rig}_')}
    hide = [o for o in sc.objects if o.type in ('MESH', 'ARMATURE', 'EMPTY', 'CURVE') and o not in mine and not o.hide_render]
    for o in hide:
        o.hide_render = True
    paths = []
    try:
        base = T.matrix_world.translation
        tgt = base + TGT
        cd.type = 'ORTHO'; cd.ortho_scale = scale
        sc.camera = cam; sc.render.resolution_x = sc.render.resolution_y = res
        for f in frames:
            sc.frame_set(f + 3); sc.frame_set(f)
            for v in views:
                yaw, el = VIEWS[v]
                d = Vector((0, -1, 0))
                d.rotate(__import__('mathutils').Euler((0, 0, math.radians(yaw))))
                e = math.radians(el)
                cam.location = tgt + d * 8 * math.cos(e) + Vector((0, 0, 8 * math.sin(e)))
                up = 'Y'
                cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', up).to_euler()
                pth = os.path.join(out_dir, f'{tag}_{v}_f{f:03d}.png')
                sc.render.filepath = pth
                bpy.ops.render.render(write_still=True, scene=sc.name)
                paths.append(pth)
    finally:
        for o in hide:
            o.hide_render = False
        sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, f0 = keep
        sc.frame_set(f0)
        bpy.data.objects.remove(cam); bpy.data.cameras.remove(cd)
    return paths

PROPS['table_medium'] = DG + 'table_medium.gltf'


def raise_arms(T, seq, weights, theta):
    """Upper-body fit to the table: rotate both upper arms forward-up about the shoulder (armature X axis) by
    theta * weight[frame]. A constant offset on the layered eat motion, no IK; legs and pelvis untouched."""
    from mathutils import Matrix
    out = []
    for s, w in zip(seq, weights):
        TA._set(T, s)
        for side in ('l', 'r'):
            pb = T.pose.bones[f'upperarm.{side}']
            M = pb.matrix.copy(); h = M.translation.copy()
            R = Matrix.Translation(h) @ Matrix.Rotation(-theta * w, 4, 'X') @ Matrix.Translation(-h)
            pb.matrix = R @ M
            bpy.context.view_layer.update()
        out.append(TA._basis(T))
    return out


def ramp(n, n_in, n_out):
    w = []
    for i in range(n):
        a = min(1.0, i / n_in) if n_in else 1.0
        b = min(1.0, (n - 1 - i) / n_out) if n_out else 1.0
        x = min(a, b)
        w.append(x * x * (3 - 2 * x))
    return w

PROPS['q_stool'] = A + 'Fantasy Props MegaKit[Standard]/FantasyProps MegaKit - Quaternius/Stool.gltf'
EAT_SRC = '{rig}|FORGE|PACK|kfb_action_kneel_eat_a'
LOOP = (16, 80)          # eat clip: plate -> mouth -> plate (ramp-in 0-16 and ramp-out 80-91 dropped)
BLEND = 10
MASK = ('upperarm.l', 'upperarm.r')   # arms from the eat clip; chest + head stay in the sit clip (the kneel clip bends the chest to the floor)
HEAD_TILT = 14                        # degrees: look down at the plate / book


def _mix(a, b, w):
    out = {}
    for bn in a:
        qa, la = a[bn]; qb, lb = b[bn]
        if qa.dot(qb) < 0:
            qb = -qb
        out[bn] = (qa.slerp(qb, w), la.lerp(lb, w))
    return out


def build_clip(rig, name, stool_key, theta_deg, layer_src=None, loop=LOOP, blend=BLEND, frames=None, mouth=False):
    """Seamless loop: Sit_Chair_Idle (outside chest) + eat clip (chest subtree), actor offset from the Atlas sitOn
    rule on the given stool, arms raised by theta to clear the table top. Returns (action, facts)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    sit = bpy.data.actions[SIT_SRC[rig]]
    lay = bpy.data.actions[(layer_src or EAT_SRC).format(rig=rig)]
    for pb in T.pose.bones:
        pb.scale = (1, 1, 1)
    fr = frames or list(range(loop[0], loop[1] + 1))
    seq, sub = layered(T, sit, lay, len(fr), fr[0], fr, mask=MASK)
    if HEAD_TILT:
        seq = tilt_head(T, seq, HEAD_TILT)
    # Atlas offset measured on the first frame with the stool under the hips
    T.animation_data.action = None; TA._set(T, seq[0])
    col = collection()
    for o in [o for o in bpy.data.objects if o.name == f'FTP_{rig}_stool']:
        bpy.data.objects.remove(o, do_unlink=True)
    st = _imp(stool_key, f'FTP_{rig}_stool', col)
    st.scale = (FURN[rig],) * 3; bpy.context.view_layer.update()
    hp = hips_world(T); lo, hi = box_world(st)
    st.location += Vector((hp.x - (lo.x + hi.x) / 2, hp.y - (lo.y + hi.y) / 2, -lo.z))
    seat, hp, off = sit_on(T, st)
    dz = off.z
    base = []
    for s in seq:
        TA._set(T, s); TA._lift_hips(T, dz); base.append(TA._basis(T))
    # raise weight: full while the hands work at table height, fading to 0 as a hand travels up to the mouth,
    # so the bite keeps the source clip's hand-to-mouth path
    hz = []
    for s in base:
        TA._set(T, s)
        hz.append(max(T.pose.bones['hand.l'].head.z, T.pose.bones['hand.r'].head.z))
    lo_z, hi_z = min(hz), max(hz)
    wts = []
    for z in hz:
        x = 0.0 if hi_z - lo_z < 0.15 * FURN[rig] else min(1.0, max(0.0, (z - lo_z) / (hi_z - lo_z)))
        wts.append(1.0 - x * x * (3 - 2 * x))
    base = raise_arms(T, base, wts, math.radians(theta_deg))
    if mouth:
        base = hand_to_mouth(T, rig, base, wts)
    # seamless loop: cross-fade the tail into the head
    n = len(base)
    out = base if not blend else base[:n - blend] + [_mix(base[n - blend + i], base[0], (i + 1) / (blend + 1)) for i in range(blend)]
    a = F.make_action(name, T, out)
    a['clip_id'] = name.split('|')[-1]
    a['seating'] = 'Resident Atlas sitOn: hips bone on the top centre of the stool box'
    a['stool'] = stool_key; a['atlasOffsetZ'] = dz; a['armRaiseDeg'] = theta_deg
    a['layer'] = f'Sit_Chair_Idle outside chest; {lay.name} frames {fr[0]}..{fr[-1]} ({len(fr)}) inside chest'
    st.location.z += 0  # stool stays on the floor; the clip carries the offset
    return a, dict(frames=len(out), atlasOffsetZ=round(dz, 4), seatZ=round(seat.z, 3), theta=theta_deg)


def place_table(rig, table_key='table_medium', gap=GAP, zband=(0.6, 1.05), yaw_deg=90):
    """Table near edge = torso front (body/head mesh, no arms/legs) over all frames minus gap."""
    T = bpy.data.objects[F.TARGETS[rig]]
    a = T.animation_data.action
    sc = bpy.context.scene
    f0, f1 = [int(round(x)) for x in a.frame_range]
    front = 9
    for f in range(f0, f1 + 1, 5):
        sc.frame_set(f + 3); sc.frame_set(f)
        pts = mesh_points(T, include=('Body', 'Head', 'Hat', 'Torso', 'Armor'))
        k = FURN[rig]
        ys = [p.y for p in pts if zband[0] * k < p.z - T.matrix_world.translation.z < zband[1] * k]
        front = min(front, min(ys))
    col = collection()
    for o in [o for o in bpy.data.objects if o.name == f'FTP_{rig}_table']:
        bpy.data.objects.remove(o, do_unlink=True)
    tb = _imp(table_key, f'FTP_{rig}_table', col)
    tb.scale = (FURN_TABLE[rig],) * 3
    tb.rotation_euler = (0, 0, math.radians(yaw_deg))   # Dungeon table_medium: low stretchers run along the sides, not under the knees
    bpy.context.view_layer.update()
    hp = hips_world(T); lo, hi = box_world(tb)
    tb.location += Vector((hp.x - (lo.x + hi.x) / 2, (front - gap) - hi.y, -lo.z))
    bpy.context.view_layer.update()
    return tb, round(front, 3)


# ---------- eating: the food is eaten away in bites (build/unbuild logic, like the Fluff merge) ----------
BITES = 4
PICK_F = 24        # loop frame: right hand furthest over the plate
MOUTH_F = 54       # loop frame: right hand at the mouth


def stage_eat(rig, plate_xy=(-0.08, -0.36)):
    """Plate_A + sandwich (Tiny Treats Pleasant Picnic, kit factor 1) on the table top. The sandwich gets its origin
    on its left end so it can be shortened from the right (the side of the eating hand)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    tb = bpy.data.objects[f'FTP_{rig}_table']
    top = box_world(tb)[1].z
    col = collection()
    for k in ('plate', 'sandwich', 'bite'):
        o = bpy.data.objects.get(f'FTP_{rig}_{k}')
        if o: bpy.data.objects.remove(o, do_unlink=True)
    W = T.matrix_world
    k = FURN[rig]
    pl = _imp('plate', f'FTP_{rig}_plate', col); pl.scale = (k,) * 3
    pl.location = W @ Vector((plate_xy[0] * k, plate_xy[1] * k, 0)); pl.location.z = top
    bpy.context.view_layer.update()
    ptop = box_world(pl)[0].z + 0.03
    sw = _imp('sandwich', f'FTP_{rig}_sandwich', col); sw.scale = (k,) * 3
    # origin to the left end (+x of the actor is its left; the right hand is at -x)
    me = sw.data
    xs = [v.co.x for v in me.vertices]
    left = max(xs)
    for v in me.vertices:
        v.co.x -= left
    sw.location = pl.location + Vector((left * k, 0, ptop - pl.location.z))
    sw.rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()
    return pl, sw


def animate_bites(rig, loops=BITES, loop_len=None):
    """Per loop: at PICK_F the sandwich loses 1/BITES of its length; a bite-sized copy rides on the right hand to the
    mouth and is gone at MOUTH_F. Keys are baked on the objects (props, not bones)."""
    T = bpy.data.objects[F.TARGETS[rig]]
    sc = bpy.context.scene
    a = T.animation_data.action
    L = loop_len or int(round(a.frame_range[1] - a.frame_range[0])) + 1
    sw = bpy.data.objects[f'FTP_{rig}_sandwich']
    sw.animation_data_clear()
    full = sw.scale.x
    sw.keyframe_insert('scale', frame=0)
    bite = sw.copy(); bite.data = sw.data.copy(); bite.name = f'FTP_{rig}_bite'
    collection().objects.link(bite); bite.animation_data_clear()
    seg = 1.0 / loops
    # bite piece: the last segment of the sandwich, centred on its own origin
    xs = [v.co.x for v in bite.data.vertices]; w = max(xs) - min(xs)
    for v in bite.data.vertices:
        v.co.x = v.co.x * seg            # one segment long
    xs = [v.co.x for v in bite.data.vertices]; cx = (max(xs) + min(xs)) / 2
    ys = [v.co.y for v in bite.data.vertices]; cy = (max(ys) + min(ys)) / 2
    zs = [v.co.z for v in bite.data.vertices]; cz = (max(zs) + min(zs)) / 2
    for v in bite.data.vertices:
        v.co.x -= cx; v.co.y -= cy; v.co.z -= cz
    kb = 0.8 * FURN[rig]
    bite.scale = (kb, kb, kb)
    hand = T.pose.bones['handslot.r'] if 'handslot.r' in T.pose.bones else T.pose.bones['hand.r']

    def hide(o, f, on):
        o.hide_render = on; o.hide_viewport = on
        o.keyframe_insert('hide_render', frame=f); o.keyframe_insert('hide_viewport', frame=f)
    hide(bite, 0, True)
    for k in range(loops):
        f0 = k * L
        # sandwich shortens at the pick
        sw.scale.x = full * (1 - seg * k); sw.keyframe_insert('scale', frame=f0 + PICK_F - 1)
        sw.scale.x = full * (1 - seg * (k + 1)); sw.keyframe_insert('scale', frame=f0 + PICK_F)
        hide(bite, f0 + PICK_F - 1, True); hide(bite, f0 + PICK_F, False); hide(bite, f0 + MOUTH_F + 1, True)
        for f in range(f0 + PICK_F, f0 + MOUTH_F + 1):
            sc.frame_set(f)
            M = T.matrix_world @ hand.matrix
            bite.location = M.translation + (M.to_3x3() @ Vector((0, 0.06, 0)))
            bite.keyframe_insert('location', frame=f)
            s = kb if f < f0 + MOUTH_F - 3 else kb * (f0 + MOUTH_F + 1 - f) / 4.0   # last 4 frames: bitten away
            bite.scale = (s, s, s); bite.keyframe_insert('scale', frame=f)
    for o in (sw, bite):
        if o.animation_data and o.animation_data.action:
            for fc in fcurves(o.animation_data.action):
                for kp in fc.keyframe_points: kp.interpolation = 'CONSTANT'
    return dict(loops=loops, loopLen=L, pick=PICK_F, mouth=MOUTH_F)


def fcurves(a):
    """All F-curves of a layered (slotted) action, falling back to the legacy list."""
    out = []
    try:
        for lay in a.layers:
            for st in lay.strips:
                for sl in a.slots:
                    cb = st.channelbag(sl)
                    if cb:
                        out += list(cb.fcurves)
    except Exception:
        pass
    if not out and hasattr(a, 'fcurves'):
        out = list(a.fcurves)
    return out


def cycle(a, on=True):
    """Loop an action for preview renders (Cycles modifier on every F-curve). The baked clip itself is unchanged."""
    for fc in fcurves(a):
        mods = [m for m in fc.modifiers if m.type == 'CYCLES']
        if on and not mods:
            fc.modifiers.new('CYCLES')
        if not on:
            for m in mods: fc.modifiers.remove(m)


def pingpong(lo, hi, step=1):
    up = list(range(lo, hi + 1, step))
    return up + up[-2:0:-1]


PROPS['pencil'] = RPG + 'pencil_A_short.gltf'
SHEET = 0.5           # RPG Tools blueprint (1.49 k square) at half size = a 0.75 k sheet on the table
PENCIL_SCALE = 1.5     # the chibi fist hides a native-size pencil; 1.5x reads as a pencil sticking out on both sides
BOOK_TILT = {'write': -90, 'read': -125}   # journal_open faces -Y when imported; -90 = pages up


def stage_book(rig, mode, spot=(-0.02, -0.30)):
    """write: journal_open lying flat + pencil in the right hand slot; read: journal_open propped toward the actor."""
    T = bpy.data.objects[F.TARGETS[rig]]
    tb = bpy.data.objects[f'FTP_{rig}_table']
    top = box_world(tb)[1].z
    col = collection()
    for k in ('journal', 'pencil'):
        o = bpy.data.objects.get(f'FTP_{rig}_{k}')
        if o: bpy.data.objects.remove(o, do_unlink=True)
    W = T.matrix_world
    k = FURN[rig]
    if mode == 'write':
        jb = _imp('sheet', f'FTP_{rig}_journal', col); jb.scale = (SHEET * k,) * 3
        jb.rotation_euler = (0, 0, 0)
    else:
        jb = _imp('journal', f'FTP_{rig}_journal', col); jb.scale = (k,) * 3
        jb.rotation_euler = (math.radians(BOOK_TILT[mode]), 0, 0)
    jb.location = W @ Vector((spot[0] * k, spot[1] * k, 0))
    bpy.context.view_layer.update()
    lo, hi = box_world(jb); jb.location.z += top - lo.z
    out = [jb]
    if mode == 'write':
        bpy.context.view_layer.update()
        place_pencil(rig, page_z=box_world(jb)[0].z + 0.005)
        out.append(bpy.data.objects[f'FTP_{rig}_pencil'])
    bpy.context.view_layer.update()
    return out


def mouth_local(T):
    """Mouth point (front of the head mesh, lower third) in the head bone's local frame, measured on the current pose."""
    pts = mesh_points(T, include=('Head',))
    Wi = T.matrix_world.inverted()
    pts = [Wi @ p for p in pts]
    z0 = min(p.z for p in pts); z1 = max(p.z for p in pts)
    mz = z0 + 0.30 * (z1 - z0)
    band = [p for p in pts if abs(p.z - mz) < 0.06 * (z1 - z0) and abs(p.x) < 0.15 * (z1 - z0)]
    front = min(band, key=lambda p: p.y)
    hm = T.pose.bones['head'].matrix
    return hm.inverted() @ front, round(z1 - z0, 3)


def _arm_ik(T, side, target, pole):
    import kfb_table_activity_k2 as K2
    pb = T.pose.bones
    ua, la, wr, hd = (f'upperarm.{side}', f'lowerarm.{side}', f'wrist.{side}', f'hand.{side}')
    a = (pb[la].head - pb[ua].head).length
    b = (pb[hd].head - pb[la].head).length
    S = pb[ua].head.copy(); d = target - S
    reach = 0.98 * (a + b)
    if d.length > reach:
        target = S + d.normalized() * reach; d = target - S
    L = max(d.length, 1e-4)
    A = math.acos(max(-1.0, min(1.0, (a * a + L * L - b * b) / (2 * a * L))))
    u = d.normalized(); pole = (pole - u * pole.dot(u)).normalized()
    elbow = S + a * (math.cos(A) * u + math.sin(A) * pole)
    K2._aim(pb[ua], elbow); K2._aim(pb[la], target)
    fwd = (target - elbow).normalized()
    K2._aim(pb[wr], target + fwd * 0.1); K2._aim(pb[hd], target + fwd * 0.2)
    for bn in (ua, la, wr, hd):
        pb[bn].scale = (1, 1, 1)          # _aim writes full matrices; never let scale leak into the (unkeyed) pose
    bpy.context.view_layer.update()


def hand_to_mouth(T, rig, seq, weights, side='r', ahead=0.10):
    """Blend the eating hand onto the mouth with weight (1 - raise weight): the bite reaches the mouth on every rig."""
    TA._set(T, seq[0])
    loc, head_h = mouth_local(T)
    k = FURN[rig]
    sgn = -1.0 if side == 'r' else 1.0
    out = []
    names = [f'upperarm.{side}', f'lowerarm.{side}', f'wrist.{side}', f'hand.{side}']
    for s, w in zip(seq, weights):
        m = 1.0 - w
        if m < 1e-3:
            out.append(s); continue
        TA._set(T, s)
        mouth = T.pose.bones['head'].matrix @ loc
        target = mouth + Vector((0.25 * ahead * sgn * k, -ahead * k, -0.02 * k))
        _arm_ik(T, side, target, Vector((sgn * 1.0, 0.3, -0.7)))
        bpy.context.view_layer.update()
        ik = TA._basis(T)
        mix = dict(s)
        for bn in names:
            qa, la_ = s[bn]; qb, lb = ik[bn]
            if qa.dot(qb) < 0: qb = -qb
            mix[bn] = (qa.slerp(qb, m), la_.lerp(lb, m))
        out.append(mix)
    return out


THETA = {'M': 22, 'L': 8}        # arm raise to clear the table top (scan: no arm/table overlap from M 20 / L 6 on)
MODES = {'eat': dict(frames=None, blend=BLEND, mouth=True),
         'write': dict(frames=pingpong(16, 40), blend=0, mouth=False, dtheta=6),
         'read': dict(frames=pingpong(16, 26), blend=0, mouth=False)}


def clip_name(rig, mode):
    return f'{rig}|FORGE|PACK|kfb_activity_table_{mode}_b'


def stage_variant(rig, mode, rebuild=True):
    T = bpy.data.objects[F.TARGETS[rig]]
    clear_props(rig)
    m = MODES[mode]
    if mode == 'write' and (rebuild or clip_name(rig, mode) not in bpy.data.actions):
        a, facts = build_write(rig)
    elif rebuild or clip_name(rig, mode) not in bpy.data.actions:
        a, facts = build_clip(rig, clip_name(rig, mode), 'stool', THETA[rig] + m.get('dtheta', 0), frames=m['frames'], blend=m['blend'], mouth=m['mouth'])
    else:
        a = bpy.data.actions[clip_name(rig, mode)]; facts = {}
        st = _imp('stool', f'FTP_{rig}_stool', collection()); st.scale = (FURN[rig],) * 3
        F.use_action(T, a); bpy.context.scene.frame_set(3); bpy.context.scene.frame_set(0)
        hp = hips_world(T); lo, hi = box_world(st)
        st.location += Vector((hp.x - (lo.x + hi.x) / 2, hp.y - (lo.y + hi.y) / 2, -lo.z))
    F.use_action(T, a); cycle(a, True)
    clear = push_stool_back(rig)
    facts = dict(facts or {}, **clear)
    place_table(rig)
    if mode == 'eat':
        stage_eat(rig); animate_bites(rig)
    else:
        stage_book(rig, mode)
    return a, facts


def render_seq(rig, out_dir, tag, frames, views=('front34', 'side'), res=320, scale=2.6):
    """Numbered frames per view for video assembly: <tag>_<view>_<i>.png"""
    import os
    sc = bpy.context.scene
    T = bpy.data.objects[F.TARGETS[rig]]
    os.makedirs(out_dir, exist_ok=True)
    keep = (sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.frame_current)
    cd = bpy.data.cameras.new('FTP_cam'); cam = bpy.data.objects.new('FTP_cam', cd); sc.collection.objects.link(cam)
    mine = {T} | set(T.children_recursive) | {o for o in sc.objects if o.name.startswith(f'FTP_{rig}_')}
    hide = [o for o in sc.objects if o.type in ('MESH', 'ARMATURE', 'EMPTY', 'CURVE') and o not in mine and not o.hide_render]
    for o in hide: o.hide_render = True
    try:
        base = T.matrix_world.translation; tgt = base + TGT
        cd.type = 'ORTHO'; cd.ortho_scale = scale
        sc.camera = cam; sc.render.resolution_x = sc.render.resolution_y = res
        for v in views:
            yaw, el = VIEWS[v]
            d = Vector((0, -1, 0)); d.rotate(__import__('mathutils').Euler((0, 0, math.radians(yaw))))
            e = math.radians(el)
            cam.location = tgt + d * 8 * math.cos(e) + Vector((0, 0, 8 * math.sin(e)))
            cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            for i, f in enumerate(frames):
                sc.frame_set(f)
                sc.render.filepath = os.path.join(out_dir, f'{tag}_{v}_{i:04d}.png')
                bpy.ops.render.render(write_still=True, scene=sc.name)
    finally:
        for o in hide: o.hide_render = False
        sc.camera, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, f0 = keep
        sc.frame_set(f0)
        bpy.data.objects.remove(cam); bpy.data.cameras.remove(cd)


def tilt_head(T, seq, deg):
    from mathutils import Matrix
    out = []
    for s in seq:
        TA._set(T, s)
        pb = T.pose.bones['head']
        M = pb.matrix.copy(); h = M.translation.copy()
        pb.matrix = Matrix.Translation(h) @ Matrix.Rotation(math.radians(deg), 4, 'X') @ Matrix.Translation(-h) @ M
        pb.scale = (1, 1, 1)
        bpy.context.view_layer.update()
        out.append(TA._basis(T))
    return out


# ---------- writing: both hands on the book (repair 2 after the critic: hands were at the chin, pencil hidden) ----------
WRITE_LEN = 48
POLE_UP = 0.8      # elbows out and up (0.3 still put the forearms through the table edge)
PROPS['sheet'] = RPG + 'blueprint.gltf'   # flat sheet with curled edges (journal_open is a V-shaped standing book: kept for reading)
FIST = 0.07          # hand-bone height above the page (fist radius, Medium); x FURN for Large


def build_write(rig, name=None, book_xy=(-0.02, -0.30)):
    """Sit_Chair_Idle (outside the arms) + both hands placed on the open journal by two-bone IK: the left hand rests
    on the left page, the right hand draws small loops on the right page (2 per loop). Head tilted to the page."""
    T = bpy.data.objects[F.TARGETS[rig]]
    k = FURN[rig]
    name = name or clip_name(rig, 'write')
    sit = bpy.data.actions[SIT_SRC[rig]]
    for pb in T.pose.bones:
        pb.scale = (1, 1, 1)
    b0, b1 = [int(round(x)) for x in sit.frame_range]
    base = sample(T, sit, [b0 + i % (b1 - b0 + 1) for i in range(WRITE_LEN)])
    T.animation_data.action = None; TA._set(T, base[0])
    col = collection()
    for o in [o for o in bpy.data.objects if o.name == f'FTP_{rig}_stool']:
        bpy.data.objects.remove(o, do_unlink=True)
    st = _imp('stool', f'FTP_{rig}_stool', col); st.scale = (k,) * 3; bpy.context.view_layer.update()
    hp = hips_world(T); lo, hi = box_world(st)
    st.location += Vector((hp.x - (lo.x + hi.x) / 2, hp.y - (lo.y + hi.y) / 2, -lo.z))
    seat, hp, off = sit_on(T, st); dz = off.z
    seq = []
    for s in base:
        TA._set(T, s); TA._lift_hips(T, dz); seq.append(TA._basis(T))
    seq = tilt_head(T, seq, HEAD_TILT + 6)
    # targets in armature space: table top = TABLE_TOP * FURN_TABLE; book centre at book_xy * k
    top = TABLE_TOP * FURN_TABLE[rig]
    page = top + 0.03 * k
    out = []
    for i, s in enumerate(seq):
        TA._set(T, s)
        ph = 2 * math.pi * 2 * i / WRITE_LEN
        r_t = Vector((book_xy[0] * k - 0.13 * k + 0.05 * k * math.cos(ph), book_xy[1] * k + 0.02 * k + 0.025 * k * math.sin(ph), page + FIST * k + 0.015 * k * max(0.0, math.sin(ph))))
        l_t = Vector((book_xy[0] * k + 0.17 * k, book_xy[1] * k + 0.06 * k, page + FIST * k))
        _arm_ik(T, 'r', r_t, Vector((-1.0, 0.4, POLE_UP)))      # elbows out and up: forearms stay above the table edge
        _arm_ik(T, 'l', l_t, Vector((1.0, 0.4, POLE_UP)))
        bpy.context.view_layer.update()
        out.append(TA._basis(T))
    a = F.make_action(name, T, out)
    a['clip_id'] = name.split('|')[-1]
    a['seating'] = 'Resident Atlas sitOn: hips bone on the top centre of the stool box'
    a['atlasOffsetZ'] = dz; a['hands'] = 'two-bone IK onto the journal pages; right hand 2 small loops per cycle'
    return a, dict(frames=len(out), atlasOffsetZ=round(dz, 4), seatZ=round(seat.z, 3))


# ---------- stool clearance (Georg 2026-10-08: the stool stood in the heels; push it back so the feet dangle) ----------
HEEL_GAP = 0.03


def push_stool_back(rig, step=0.005, gap=HEEL_GAP):
    """Move the stool backwards (+Y, away from the table) until no leg vertex below the seat lies inside the stool's
    footprint, over every frame of the active clip, plus a gap. The clip is unchanged; the offset is the stool's."""
    T = bpy.data.objects[F.TARGETS[rig]]
    st = bpy.data.objects[f'FTP_{rig}_stool']
    k = FURN[rig]
    sc = bpy.context.scene
    a = T.animation_data.action
    f0, f1 = [int(round(x)) for x in a.frame_range]
    lo, hi = box_world(st)
    seat = hi.z
    back = 0.0
    for f in range(f0, f1 + 1, 2):
        sc.frame_set(f + 3); sc.frame_set(f)
        for p in mesh_points(T, include=('Leg',)):
            if p.z < seat - 0.05 * k and lo.x - 0.01 < p.x < hi.x + 0.01 and p.y > lo.y - gap * k:
                back = max(back, p.y - lo.y + gap * k)
    st.location.y += back
    bpy.context.view_layer.update()
    lo2, hi2 = box_world(st)
    hp = hips_world(T)
    a['stoolBackY'] = back
    return dict(stoolBackY=round(back, 3), hipsFromStoolFront=round(hp.y - lo2.y, 3), stoolDepth=round(hi2.y - lo2.y, 3))


# ---------- writing pencil (Georg 2026-10-08): the long pencil with the eraser, cartoon-big, in a writing grip ----------
PROPS['pencil_long'] = RPG + 'pencil_B_long.gltf'    # B_long = the one with the eraser cap (0.65 k native)
PENCIL_LONG_SCALE = 1.3     # cartoon-big; x FURN for the Orc, like the furniture
PENCIL_DIR = Vector((-0.65, 0.20, 0.73))   # tip -> eraser, actor space: up and out to the right, a little back (0.35/0.40/0.85 crossed the face)
GRIP_FWD = 0.04                            # grip point this far in front of handslot.r (x FURN): the tip shows at the front of the fist


def place_pencil(rig, page_z=None):
    """Writing grip: the pencil runs through the right fist (handslot.r), tip down-forward on the page, eraser up,
    back and out. Placed on frame 0 of the active clip and parented to handslot.r, so it follows the writing loops."""
    T = bpy.data.objects[F.TARGETS[rig]]
    k = FURN[rig]
    sc = bpy.context.scene
    col = collection()
    for o in [o for o in bpy.data.objects if o.name == f'FTP_{rig}_pencil']:
        bpy.data.objects.remove(o, do_unlink=True)
    pc = _imp('pencil_long', f'FTP_{rig}_pencil', col)
    s = PENCIL_LONG_SCALE * k
    zs = [v.co.z for v in pc.data.vertices]
    tip_local, top_local = min(zs), max(zs)
    L = (top_local - tip_local) * s
    sc.frame_set(3); sc.frame_set(0)
    W = T.matrix_world
    slot = W @ T.pose.bones['handslot.r'].head + W.to_3x3() @ Vector((0, -GRIP_FWD * k, 0))
    if page_z is None:
        page_z = W.translation.z + TABLE_TOP * FURN_TABLE[rig] + 0.03 * k
    d = (W.to_3x3() @ PENCIL_DIR).normalized()
    down = max(0.0, (slot.z - (page_z + 0.01 * k)) / d.z)        # grip -> tip distance along the pencil
    down = min(down, 0.6 * L)
    tip = slot - d * down
    from mathutils import Matrix
    zaxis = d
    xaxis = zaxis.cross(Vector((0, 0, 1)));
    if xaxis.length < 1e-4: xaxis = Vector((1, 0, 0))
    xaxis.normalize(); yaxis = zaxis.cross(xaxis).normalized()
    R = Matrix((xaxis, yaxis, zaxis)).transposed().to_4x4()
    origin = tip - zaxis * (tip_local * s)
    Mw = Matrix.Translation(origin) @ R @ Matrix.Diagonal((s, s, s, 1))
    pc.parent = T; pc.parent_type = 'BONE'; pc.parent_bone = 'handslot.r'
    bpy.context.view_layer.update()
    pc.matrix_world = Mw
    bpy.context.view_layer.update()
    return dict(length=round(L, 3), gripToTip=round(down, 3), gripFraction=round(down / L, 2), tipZ=round(tip.z - W.translation.z, 3))
