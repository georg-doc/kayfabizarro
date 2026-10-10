"""BRICKFISH-TOSS-01 (Blender test bench): Brick Fish toss between two residents.

Beat grammar (PR #254): ready -> windup -> release -> flight -> impact | miss -> reaction -> optional retaliation -> recovery.
- Release = measured frame of peak hand speed of the prepared clip (24 fps): throw_a 22 (M) / 21 (L),
  goalkeeper_overhand 35 (both). The prop rides the hand (handslot) until release, then a deterministic cartoon
  ballistic flight (g = 12 m/s2) aimed at the target's head anchor; nose follows the velocity, slow roll + wobble.
- Impact (Georg 05.10.): short squash, then the fish shatters into clay pellets (body lumps, both eyes, fin bits)
  that bounce and roll away (ground bounces, restitution 0.42). Retaliation: the pellets crawl back together,
  the fish pops back (squash-overshoot), hops into the target's reaching hand, and is thrown back.
- Everything is keyed per frame on objects (no physics cache), so the path can be exported as data.
"""
import bpy, json, math, os, random, importlib
from mathutils import Vector, Matrix, Quaternion, Euler
import kfb369_lib as L
import kfb_talk as T
import kfb_brickfish_asset as BF
importlib.reload(BF)

SC = "369_BRICKFISH"
G = 12.0                     # cartoon gravity, m/s^2
FPS = 24
GRIP = Euler((0, 0, math.radians(90))).to_matrix().to_4x4()   # fish +X along the hand bone's +Y (out of the fist)
GRIP.translation = (0, 0.03, 0)
RELEASE = {("M", "throw|kfb_throw_throw_a"): 22, ("L", "throw|kfb_throw_throw_a"): 21,
           ("M", "throw|kfb_throw_goalkeeper_overhand_a"): 35, ("L", "throw|kfb_throw_goalkeeper_overhand_a"): 35}
GRAB_L = 31                  # pick-up clip: left hand lowest (grab) frame
SRC = {"farmer": "DB_farmer_b", "orc": "DB_orcbrute"}
FS = 1.35                    # display scale of the fish (readability at game-camera distance); pellets scale with it


# ------------------------------------------------------------------ scene / actors
def scene():
    sc = bpy.data.scenes.get(SC)
    if sc is None:
        src = bpy.data.scenes["369_TALK"]; sc = bpy.data.scenes.new(SC); sc.world = src.world
        for a in ("engine", "fps", "fps_base", "resolution_x", "resolution_y"): setattr(sc.render, a, getattr(src.render, a))
        sc.view_settings.view_transform = src.view_settings.view_transform; sc.view_settings.look = src.view_settings.look
        for n in ("GH_ground", "369_SUN"): sc.collection.objects.link(bpy.data.objects[n])
    sc.render.fps = FPS; sc.eevee.taa_render_samples = 8
    return sc


def clone(sc, key):
    name = "BF_" + key
    if name in bpy.data.objects: return bpy.data.objects[name]
    col = bpy.data.collections.new(name); sc.collection.children.link(col)
    s = bpy.data.objects[SRC[key]]; a = s.copy(); a.name = name; a.animation_data_clear(); col.objects.link(a)
    a.rotation_mode = 'XYZ'
    for ch in s.children:
        c = ch.copy(); c.parent = a; col.objects.link(c)
        for m in c.modifiers:
            if m.type == 'ARMATURE': m.object = a
    return a


def place(a, xy, face_xy):
    a.location = (xy[0], xy[1], 0); d = Vector(face_xy) - Vector(xy)
    a.rotation_euler = (0, 0, math.atan2(d.x, -d.y))
    if a.animation_data:
        a.animation_data.action = None
        for t in list(a.animation_data.nla_tracks): a.animation_data.nla_tracks.remove(t)


# ------------------------------------------------------------------ helpers
def bone_world(sc, a, bone, f, tail=False):
    sc.frame_set(f); pb = a.pose.bones[bone]
    return a.matrix_world @ (pb.tail if tail else pb.head)


def bone_matrix(sc, a, bone, f):
    sc.frame_set(f); return a.matrix_world @ a.pose.bones[bone].matrix


def head_anchor(sc, a, f):
    sc.frame_set(f); pb = a.pose.bones['head']
    return a.matrix_world @ (pb.head * 0.4 + pb.tail * 0.6)


def ballistic(p0, p1, frames):
    t = frames / FPS; v = (p1 - p0 - Vector((0, 0, -0.5 * G * t * t))) / t
    return v


def look_rot(vel, roll):
    fwd = vel.normalized(); q = fwd.to_track_quat('X', 'Z')
    return (q @ Quaternion((1, 0, 0), roll)).to_matrix().to_4x4()


def key_obj(o, f, M=None, scale=None):
    if M is not None:
        o.matrix_world = M
    if scale is not None: o.scale = tuple(x * FS for x in scale)
    o.keyframe_insert("location", frame=f); o.keyframe_insert("rotation_euler", frame=f); o.keyframe_insert("scale", frame=f)


def clear_anim(o):
    if o.animation_data: o.animation_data_clear()


# ------------------------------------------------------------------ pellets
def make_pellets(col, fish, seed, n_body=9):
    rnd = random.Random(seed); out = []
    for o in [o for o in bpy.data.objects if o.name.startswith("BF_pel_")]: bpy.data.objects.remove(o, do_unlink=True)
    import bmesh
    mats = {k: bpy.data.materials["BF_" + k] for k in ("body", "fin", "eye", "pupil")}
    def lump(name, r, mat):
        bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=r)
        for v in bm.verts: v.co *= 1 + rnd.uniform(-0.18, 0.18)
        bmesh.ops.scale(bm, vec=(1, rnd.uniform(0.7, 1.0), rnd.uniform(0.6, 0.9)), verts=bm.verts)
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(mat)
        for p in me.polygons: p.use_smooth = True
        o = bpy.data.objects.new(name, me); col.objects.link(o); o.rotation_mode = 'XYZ'; return o, r
    for i in range(n_body): out.append(lump(f"BF_pel_body_{i}", rnd.uniform(0.04, 0.075) * FS, mats["body"]))
    for i in range(2): out.append(lump(f"BF_pel_fin_{i}", rnd.uniform(0.03, 0.04) * FS, mats["fin"]))
    for s in "lr":   # the eyes pop out whole
        e, r = lump(f"BF_pel_eye_{s}", BF.EYE_R * FS, mats["eye"])
        bm_p = bpy.data.objects[f"BF_fish_pupil_{s}"].copy(); bm_p.name = f"BF_pel_pupil_{s}"; col.objects.link(bm_p)
        bm_p.parent = e; bm_p.matrix_parent_inverse.identity(); bm_p.location = (BF.EYE_R * 0.78 * FS, 0, 0.004); bm_p.scale = (FS, FS, FS)
        out.append((e, r))
    return out


def simulate(pellets, p_hit, v_in, f0, f1, seed, ground=0.0):
    """Cartoon pellet burst: radial + up kick + 25% of the incoming velocity; ground bounces + rolling."""
    rnd = random.Random(seed); tracks = []
    for o, r in pellets:
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(0.2, 1))).normalized()
        v = d * rnd.uniform(1.6, 3.2) + v_in * 0.25 + Vector((0, 0, rnd.uniform(0.8, 2.0)))
        p = p_hit + d * 0.05; rot = Vector((rnd.uniform(0, 6), rnd.uniform(0, 6), rnd.uniform(0, 6)))
        w = Vector((rnd.uniform(-12, 12), rnd.uniform(-12, 12), rnd.uniform(-6, 6)))
        tr = []
        for f in range(f0, f1 + 1):
            for _ in range(4):
                dt = 1 / FPS / 4; v.z -= G * dt; p = p + v * dt
                if p.z < ground + r * 0.75:
                    p.z = ground + r * 0.75
                    if v.z < 0: v.z = -v.z * 0.42; v.x *= 0.72; v.y *= 0.72; w *= 0.7
                    if abs(v.z) < 0.25: v.z = 0
                if p.z <= ground + r * 0.76 and v.z == 0:   # rolling with friction
                    v.x *= 0.93; v.y *= 0.93
                    sp = Vector((v.x, v.y, 0)).length
                    if sp > 0.01: w = Vector((-v.y, v.x, 0)).normalized() * (sp / max(r, 0.01))
                    else: w *= 0.5
                rot = rot + w * dt
            tr.append((f, p.copy(), rot.copy()))
        tracks.append(tr)
    return tracks


def key_pellets(pellets, tracks, show_f, hide_f=None, gather=None):
    """gather = (f_start, f_end, point): pellets crawl back to point and shrink."""
    for (o, r), tr in zip(pellets, tracks):
        clear_anim(o)
        o.scale = (0, 0, 0); o.location = tr[0][1]; key_obj(o, show_f - 1)
        last = None
        for f, p, rot in tr:
            o.location = p; o.rotation_euler = rot; o.scale = (1, 1, 1); key_obj(o, f); last = (p, rot)
        if gather:
            g0, g1, gp = gather
            for f in range(g0, g1 + 1):
                k = (f - g0) / max(1, g1 - g0); k = k * k * (3 - 2 * k)
                o.location = last[0].lerp(gp + Vector((0, 0, r * 0.6)), k); o.rotation_euler = last[1]
                s = 1 - 0.6 * k; o.scale = (s, s, s); key_obj(o, f)
            o.scale = (0, 0, 0); key_obj(o, g1 + 1)
        elif hide_f:
            o.scale = (0, 0, 0); key_obj(o, hide_f)


# ------------------------------------------------------------------ NLA
INPLACE = {"throw|kfb_throw_goalkeeper_overhand_a"}   # travel clips played in place (the run-up would run into the target)


def prepared_inplace(rig, short):
    """Copy of the prepared clip with the travelling root/hips channels frozen (range > 0.25 m -> first value)."""
    src = T.prepared(rig, short); out = src.replace("|MLBWn|", "|MLBWnIP|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    for fc, cb in T.fcs(a):
        bn = fc.data_path.split('"')[1]
        if bn in ("root", "hips") and fc.data_path.endswith("location"):
            ys = [k.co.y for k in fc.keyframe_points]
            if ys and max(ys) - min(ys) > 0.25:
                n = len(ys); y0, y1 = ys[0], ys[-1]
                for i, k in enumerate(fc.keyframe_points):
                    v = ys[0]; k.co.y = v; k.handle_left.y = v; k.handle_right.y = v
                fc.update()
    return out


def nla(a, rig, events, end):
    tl = []
    for s, st, bi, bo in events:
        an = prepared_inplace(rig, s) if s in INPLACE else T.prepared(rig, s)
        tl.append({"action": an, "start": st, "a0": 0, "a1": int(bpy.data.actions[an].frame_range[1]), "bi": bi, "bo": bo})
    T.build_nla(a, rig, tl, end)


# ------------------------------------------------------------------ sequences
def setup():
    sc = scene(); bpy.context.window.scene = sc
    col = bpy.data.collections.get('BF_prop') or bpy.data.collections.new('BF_prop')
    if col.name not in sc.collection.children: sc.collection.children.link(col)
    for m in [m for m in bpy.data.materials if m.name.startswith("BF_")]: bpy.data.materials.remove(m)
    fish = BF.build(col); fish.rotation_mode = 'XYZ'
    return sc, col, fish


def run_hit_retaliation(seed=3):
    """Orc tosses (short throw) -> hits Farmer's head -> clay burst -> pellets regather -> fish hops into her hand ->
    she throws it back (short throw) -> hits the Orc -> burst."""
    sc, col, fish = setup(); END = 330
    fm = clone(sc, "farmer"); orc = clone(sc, "orc")
    place(fm, (1.9, 0), (-1.9, 0)); place(orc, (-1.9, 0), (1.9, 0))
    sc.frame_start, sc.frame_end = 1, END
    TH = "throw|kfb_throw_throw_a"; o_start = 20; o_rel = o_start + RELEASE[("L", TH)]
    # pass 1: thrower only, to aim at the target's head
    nla(orc, "L", [(TH, o_start, 8, 10)], END); nla(fm, "M", [], END)
    p0 = (bone_matrix(sc, orc, "handslot.r", o_rel) @ GRIP).translation
    hit1 = o_rel + 12; p1 = head_anchor(sc, fm, hit1)
    v1 = ballistic(p0, p1, hit1 - o_rel)
    # farmer: flinch at impact, pick-up (grab f31 with the left hand), throw back
    pk_start = 120; grab = pk_start + GRAB_L; f_start = pk_start + 60; f_rel = f_start + RELEASE[("M", TH)]
    nla(fm, "M", [("reaction|kfb_reaction_standing_react_small_from_right_a", hit1 - 2, 3, 8),
                  ("interaction|kfb_interaction_picking_up_object_a", pk_start, 10, 12),
                  (TH, f_start, 10, 10)], END)
    q0 = (bone_matrix(sc, fm, "handslot.r", f_rel) @ GRIP).translation
    hit2 = f_rel + 13
    nla(orc, "L", [(TH, o_start, 8, 10), ("reaction|kfb_reaction_standing_react_small_from_right_a", hit2 - 2, 3, 8),
                   ("exchange01|kfb_react_outraged_a", hit2 + 22, 8, 10)], END)
    q1 = head_anchor(sc, orc, hit2); v2 = ballistic(q0, q1, hit2 - f_rel)
    # fish states
    clear_anim(fish); pellets1 = make_pellets(col, fish, seed)
    gp = Vector((fm.location.x - 0.75, 0.15, 0))          # regather spot in front of her feet
    reform0, reform1 = hit1 + 40, hit1 + 64
    hop0 = grab - 10
    for f in range(1, END + 1):
        if f <= o_rel:
            M = bone_matrix(sc, orc, "handslot.r", f) @ GRIP; key_obj(fish, f, M, (1, 1, 1))
        elif f <= hit1:
            t = (f - o_rel) / FPS; p = p0 + v1 * t + Vector((0, 0, -0.5 * G * t * t)); vel = v1 + Vector((0, 0, -G * t))
            M = look_rot(vel, (f - o_rel) * 0.35); M.translation = p
            sq = (0.55, 1.3, 1.3) if f == hit1 else (1, 1, 1); key_obj(fish, f, M, sq)
        elif f < reform1 - 4:
            fish.scale = (0, 0, 0); key_obj(fish, f)
        elif f < hop0:
            k = min(1.0, (f - (reform1 - 4)) / 6); s = 1.15 * k if k < 1 else (1.15 - 0.15 * min(1, (f - reform1 + 2) / 4))
            M = Euler((0, 0, math.radians(200))).to_matrix().to_4x4(); M.translation = gp + Vector((0, 0, BF.DIMS[2] / 2))
            key_obj(fish, f, M, (s, s * (1.2 - 0.2 * k), s * (0.75 + 0.25 * k)))
        elif f <= grab:
            k = (f - hop0) / (grab - hop0); hand = (bone_matrix(sc, fm, "handslot.l", grab) @ GRIP)
            start = gp + Vector((0, 0, BF.DIMS[2] / 2)); pos = start.lerp(hand.translation, k) + Vector((0, 0, 0.55 * math.sin(math.pi * k)))
            M = hand.to_3x3().to_4x4() if k > 0.6 else Euler((k * 6.0, 0, math.radians(200))).to_matrix().to_4x4()
            M.translation = pos; key_obj(fish, f, M, (1, 1, 1))
        elif f <= f_start + 8:
            M = bone_matrix(sc, fm, "handslot.l", f) @ GRIP; key_obj(fish, f, M, (1, 1, 1))
        elif f <= f_start + 14:      # hand-to-hand pass
            k = (f - f_start - 8) / 6; A = bone_matrix(sc, fm, "handslot.l", f) @ GRIP; B = bone_matrix(sc, fm, "handslot.r", f) @ GRIP
            M = A.lerp(B, k) if hasattr(A, "lerp") else Matrix.Translation(A.translation.lerp(B.translation, k)) @ A.to_quaternion().slerp(B.to_quaternion(), k).to_matrix().to_4x4()
            key_obj(fish, f, M, (1, 1, 1))
        elif f <= f_rel:
            M = bone_matrix(sc, fm, "handslot.r", f) @ GRIP; key_obj(fish, f, M, (1, 1, 1))
        elif f <= hit2:
            t = (f - f_rel) / FPS; p = q0 + v2 * t + Vector((0, 0, -0.5 * G * t * t)); vel = v2 + Vector((0, 0, -G * t))
            M = look_rot(vel, (f - f_rel) * 0.35); M.translation = p
            key_obj(fish, f, M, (0.55, 1.3, 1.3) if f == hit2 else (1, 1, 1))
        else:
            fish.scale = (0, 0, 0); key_obj(fish, f)
    vin1 = v1 + Vector((0, 0, -G * (hit1 - o_rel) / FPS))
    tr1 = simulate(pellets1, p1, vin1, hit1 + 1, reform0, seed)
    key_pellets(pellets1, tr1, hit1 + 1, gather=(reform0, reform1, gp))
    pellets2 = make_pellets2(col, seed + 1)
    vin2 = v2 + Vector((0, 0, -G * (hit2 - f_rel) / FPS))
    tr2 = simulate(pellets2, q1, vin2, hit2 + 1, END, seed + 1)
    key_pellets(pellets2, tr2, hit2 + 1)
    beats = [(1, o_start, "ready"), (o_start, o_rel, "ORC  →  short throw"), (o_rel, hit1, "flight"),
             (hit1, hit1 + 30, "HIT  ·  clay burst"), (reform0, reform1 + 6, "the pellets crawl back  ·  POP"),
             (pk_start, grab + 4, "FARMER reaches  ·  the fish hops into her hand"), (f_start, f_rel, "retaliation  ·  short throw"),
             (f_rel, hit2, "flight"), (hit2, END, "HIT  ·  the Orc is outraged")]
    return finish(sc, "BF_A_hit_retaliation", END, beats, {"hit1": hit1, "hit2": hit2, "release": [o_rel, f_rel]},
                  cam=((0.0, -12.5, 2.5), (0.0, 0, 1.45), 34))


def make_pellets2(col, seed):
    """Second burst set (the first set is used for the regather)."""
    rnd = random.Random(seed); out = []
    import bmesh
    for o in [o for o in bpy.data.objects if o.name.startswith("BF_pb_")]: bpy.data.objects.remove(o, do_unlink=True)
    mats = {k: bpy.data.materials["BF_" + k] for k in ("body", "fin", "eye")}
    for i in range(13):
        k = "eye" if i in (0, 1) else ("fin" if i in (2, 3) else "body")
        r = (BF.EYE_R if k == "eye" else rnd.uniform(0.04, 0.075)) * FS
        bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=r)
        for v in bm.verts: v.co *= 1 + (0 if k == "eye" else rnd.uniform(-0.18, 0.18))
        me = bpy.data.meshes.new(f"BF_pb_{i}"); bm.to_mesh(me); bm.free(); me.materials.append(mats[k])
        for p in me.polygons: p.use_smooth = True
        o = bpy.data.objects.new(f"BF_pb_{i}", me); col.objects.link(o); o.rotation_mode = 'XYZ'; out.append((o, r))
    return out


def run_long_miss(seed=5):
    """Orc long overhand throw from 7 m -> Farmer dodges -> the fish sails past and bursts on the ground behind her;
    she mocks him, he is disappointed."""
    sc, col, fish = setup(); END = 230
    fm = clone(sc, "farmer"); orc = clone(sc, "orc")
    place(fm, (3.0, 0), (-4.0, 0)); place(orc, (-4.0, 0), (3.0, 0))
    sc.frame_start, sc.frame_end = 1, END
    TH = "throw|kfb_throw_goalkeeper_overhand_a"; o_start = 20; o_rel = o_start + RELEASE[("L", TH)]
    nla(orc, "L", [(TH, o_start, 8, 10)], END); nla(fm, "M", [], END)
    p0 = (bone_matrix(sc, orc, "handslot.r", o_rel) @ GRIP).translation
    hitf = o_rel + 18; p1 = head_anchor(sc, fm, hitf); v = ballistic(p0, p1, hitf - o_rel)
    # where does the fish land if nothing is in the way?
    t = (hitf - o_rel) / FPS; f = hitf
    while True:
        f += 1; t = (f - o_rel) / FPS; z = p0.z + v.z * t - 0.5 * G * t * t
        if z <= BF.DIMS[2] * 0.5: break
    land = f
    dodge = hitf - 22                           # dodging_a: head fully out of the way at clip frame 22
    nla(fm, "M", [("action|kfb_action_dodging_a", dodge, 6, 10), ("gesture|kfb_gesture_taunt_b", land + 18, 8, 10),
                  ("exchange01|kfb_react_amused_a", land + 62, 8, 10)], END)
    nla(orc, "L", [(TH, o_start, 8, 10), ("exchange01|kfb_react_disappointed_a", land + 30, 8, 10)], END)
    clear_anim(fish)
    for f in range(1, END + 1):
        if f <= o_rel:
            M = bone_matrix(sc, orc, "handslot.r", f) @ GRIP; key_obj(fish, f, M, (1, 1, 1))
        elif f <= land:
            t = (f - o_rel) / FPS; p = p0 + v * t + Vector((0, 0, -0.5 * G * t * t)); vel = v + Vector((0, 0, -G * t))
            M = look_rot(vel, (f - o_rel) * 0.3); M.translation = p
            key_obj(fish, f, M, (0.55, 1.3, 1.3) if f == land else (1, 1, 1))
        else:
            fish.scale = (0, 0, 0); key_obj(fish, f)
    t = (land - o_rel) / FPS; pl = p0 + v * t + Vector((0, 0, -0.5 * G * t * t)); vin = v + Vector((0, 0, -G * t))
    pel = make_pellets2(col, seed)
    for o in [o for o in bpy.data.objects if o.name.startswith("BF_pel_")]: o.scale = (0, 0, 0); clear_anim(o)
    tr = simulate(pel, pl, vin, land + 1, END, seed); key_pellets(pel, tr, land + 1)
    # miss distance: closest approach of the fish to her head while it flies past
    md = 9.0
    for f in range(o_rel, land + 1):
        t = (f - o_rel) / FPS; p = p0 + v * t + Vector((0, 0, -0.5 * G * t * t)); md = min(md, (p - head_anchor(sc, fm, f)).length)
    beats = [(1, o_start, "ready"), (o_start, o_rel, "ORC  →  long overhand throw (7 m)"), (o_rel, land, "flight  ·  FARMER dodges"),
             (land, land + 18, "MISS  ·  the fish bursts on the ground"), (land + 18, END, "she mocks him  ·  he is disappointed")]
    return finish(sc, "BF_B_long_miss", END, beats, {"release": o_rel, "aimFrame": hitf, "land": land, "missDistanceM": round(md, 2)},
                  cam=((-0.5, -14.0, 2.6), (-0.5, 0, 1.45), 30))


def finish(sc, name, end, beats, info, cam):
    c = bpy.data.objects.get("BF_CAM") or bpy.data.objects.new("BF_CAM", bpy.data.cameras.new("BF_CAM"))
    if c.name not in sc.collection.objects: sc.collection.objects.link(c)
    c.location = cam[0]; c.data.lens = cam[2]
    c.rotation_euler = (Vector(cam[1]) - Vector(cam[0])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = c
    sc.frame_end = end
    d = os.path.join(L.JOB, "data", "brickfish"); os.makedirs(d, exist_ok=True)
    rec = {"name": name, "end": end, "beats": beats, **info}
    json.dump(rec, open(os.path.join(d, name + ".json"), "w"), indent=1)
    return rec


def render(name, f0, f1, res=(960, 540), samples=8):
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.eevee.taa_render_samples = samples; sc.render.image_settings.file_format = 'PNG'
    d = os.path.join(L.JOB, "previews", "brickfish", name); os.makedirs(d, exist_ok=True)
    sc.render.filepath = os.path.join(d, "f_####"); sc.frame_start = f0; sc.frame_end = f1
    bpy.ops.render.render(animation=True, scene=sc.name); sc.frame_start = 1
    return d
