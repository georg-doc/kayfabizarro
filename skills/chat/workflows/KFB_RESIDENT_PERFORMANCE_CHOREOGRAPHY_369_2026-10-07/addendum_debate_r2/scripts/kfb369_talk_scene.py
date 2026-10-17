"""KFB #369 debate r2: Blender realizer for the talk rule engine (kfb_talk_gen.py).

Scene '369_TALK' (new; 369_DEBATE r1 stays untouched): cloned residents, ground, sun, world and bloom shared/copied
from 369_DEBATE. realize(run) builds NLA from a generated run, keys turn-away + foot-locked walk-offs, sets the
camera, and exports per-frame head screen positions + labels for the 2D caption overlay.
"""
import bpy, json, math, os, importlib
from mathutils import Vector, Quaternion
import kfb369_lib as L
import kfb_talk as T
import kfb_talk_gen as G
importlib.reload(T); importlib.reload(G)
from bpy_extras.object_utils import world_to_camera_view

SC = "369_TALK"
SRC = {"farmer": "DB_farmer_b", "orc": "DB_orcbrute", "farmer_a": "ARM_farmer_a", "gothgirl": "ARM_gothgirl",
       "lorekeeper": "ARM_lorekeeper"}
POOL = os.path.join(L.JOB, "data", "talk_pool.json"); RULES = os.path.join(L.JOB, "data", "talk_rules.json")
CRATE_H = 0.42


def scene():
    sc = bpy.data.scenes.get(SC)
    if sc: return sc
    src = bpy.data.scenes["369_DEBATE"]
    sc = bpy.data.scenes.new(SC); sc.world = src.world
    for a in ("engine", "fps", "fps_base", "resolution_x", "resolution_y", "film_transparent"):
        setattr(sc.render, a, getattr(src.render, a))
    sc.eevee.taa_render_samples = 16
    sc.view_settings.view_transform = src.view_settings.view_transform
    sc.view_settings.look = src.view_settings.look
    for n in ("GH_ground", "369_SUN"): sc.collection.objects.link(bpy.data.objects[n])
    if getattr(src, "compositing_node_group", None):
        ng = src.compositing_node_group.copy(); ng.name = "TK_bloom"
        for n in ng.nodes:
            if n.type == 'R_LAYERS': n.scene = sc; n.layer = sc.view_layers[0].name
        sc.compositing_node_group = ng
    return sc


def clone(sc, key):
    name = "TK_" + key
    if name in bpy.data.objects: return bpy.data.objects[name]
    col = bpy.data.collections.new(name); sc.collection.children.link(col)
    s = bpy.data.objects[SRC[key]]; a = s.copy(); a.name = name; a.animation_data_clear(); col.objects.link(a)
    a.rotation_mode = 'XYZ'
    for ch in s.children:
        c = ch.copy(); c.parent = a; col.objects.link(c)
        for m in c.modifiers:
            if m.type == 'ARMATURE': m.object = a
    return a


def yaw_to(src, dst):
    d = Vector(dst) - Vector(src); return math.atan2(d.x, -d.y)


def crate(sc, loc):
    o = bpy.data.objects.get("TK_crate")
    if o is None:
        me = bpy.data.meshes.new("TK_crate"); o = bpy.data.objects.new("TK_crate", me)
        import bmesh
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bm.to_mesh(me); bm.free()
        o.scale = (0.9, 0.7, CRATE_H); m = bpy.data.materials.new("TK_crate_clay")
        m.use_nodes = True; m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.42, 0.24, 0.12, 1)
        m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.85; me.materials.append(m)
        bev = o.modifiers.new("bevel", 'BEVEL'); bev.width = 0.05; bev.segments = 3
    if o.name not in sc.collection.objects: sc.collection.objects.link(o)
    o.location = (loc[0], loc[1], CRATE_H / 2); return o


def clear_obj_anim(o):
    if o.animation_data:
        o.animation_data.action = None
        for t in list(o.animation_data.nla_tracks): o.animation_data.nla_tracks.remove(t)


def key_loc_rot(o, f, loc=None, yaw=None):
    if loc is not None: o.location = loc; o.keyframe_insert("location", frame=f)
    if yaw is not None: o.rotation_euler = (0, 0, yaw); o.keyframe_insert("rotation_euler", frame=f, index=2)


def _feet(arm):
    out = []
    for b in ('foot.l', 'foot.r'):
        pb = arm.pose.bones[b]; out.append(arm.matrix_world @ pb.head)
    return out


def walk(sc, arm, rig, w, others, exit_dir=None):
    s, e = w["start"], w["end"]; y0 = arm.rotation_euler.z
    away = Vector(arm.location) - sum((Vector(o.location) for o in others), Vector()) / max(1, len(others))
    if exit_dir: away = Vector((exit_dir[0], exit_dir[1], 0))
    away.z = 0; y1 = math.atan2(away.x, -away.y)
    while y1 - y0 > math.pi: y1 -= 2 * math.pi
    while y1 - y0 < -math.pi: y1 += 2 * math.pi
    key_loc_rot(arm, s, loc=arm.location.copy(), yaw=y0); key_loc_rot(arm, s + 14, yaw=y1)
    ad = arm.animation_data; tr = ad.nla_tracks.new(); tr.name = "walk"
    an = f"{rig}|KKa|MovementBasic|Walking_A"
    if an not in bpy.data.actions:
        c = bpy.data.actions[f"{rig}|KK|MovementBasic|Walking_A"].copy(); c.name = an; c.use_fake_user = True
        T.align_quats(c, T.refq(T.idle_name(rig)))
    ac = bpy.data.actions[an]
    st = tr.strips.new("walk", s + 8, ac)
    try: st.action_slot = ac.slots[0]
    except Exception: pass
    st.action_frame_end = ac.frame_range[1]; st.repeat = (e - s - 8) / (ac.frame_range[1] - ac.frame_range[0])
    st.blend_in = 8; st.extrapolation = 'HOLD'; st.use_auto_blend = False
    # stance-foot lock: the lower foot stays where it is; the object moves (no sliding)
    prev = None; pf = None
    for f in range(s + 8, e + 1):
        sc.frame_set(f); fl = _feet(arm); i = 0 if fl[0].z <= fl[1].z else 1
        if prev is not None and i == pf:
            d = prev - fl[i]; d.z = 0; arm.location = arm.location + d
            bpy.context.view_layer.update(); fl = _feet(arm)
        arm.keyframe_insert("location", frame=f); prev = fl[i].copy(); pf = i


def realize(run, layout, cam):
    sc = scene(); bpy.context.window.scene = sc
    keep = set(layout)
    for k in SRC:
        o = bpy.data.objects.get("TK_" + k)
        if o is not None:
            col = bpy.data.collections.get("TK_" + k)
            if col: col.hide_render = k not in keep; col.hide_viewport = k not in keep
    ct = bpy.data.objects.get("TK_crate")
    if ct and ct.name in sc.collection.objects: sc.collection.objects.unlink(ct)
    arms = {}
    exits = {}
    for k, spec in layout.items():
        x, y, z, face = spec[:4]
        if len(spec) > 4: exits[k] = spec[4]
        a = clone(sc, k); clear_obj_anim(a); arms[k] = a
        a.location = (x, y, z); a.rotation_euler = (0, 0, yaw_to((x, y), face))
        a.keyframe_insert("location", frame=1); a.keyframe_insert("rotation_euler", frame=1, index=2)
        if z > 0.01: crate(sc, (x, y))
    end = run["end"]; sc.frame_start = 1; sc.frame_end = end
    for ac in run["actors"]:
        k = ac["id"]; a = arms[k]; rig = ac["rig"]; tl = []
        for ev in run["timelines"].get(k, []):
            an = T.variant_action(rig, ev["short"], ev["variant"], ev["mirror"])
            tl.append({"action": an, "start": ev["start"], "a0": ev["a0"], "a1": ev["a1"], "bi": ev["bi"], "bo": ev["bo"]})
        T.build_nla(a, rig, tl, end)
    for w in run["walks"]:
        k = w["actor"]; rig = next(x["rig"] for x in run["actors"] if x["id"] == k)
        walk(sc, arms[k], rig, w, [arms[o] for o in arms if o != k], exits.get(k))
    look_layer(sc, run, arms)
    c = bpy.data.objects.get("TK_CAM")
    if c is None:
        c = bpy.data.objects.new("TK_CAM", bpy.data.cameras.new("TK_CAM")); sc.collection.objects.link(c)
    c.location = cam["loc"]; c.data.lens = cam.get("lens", 40)
    c.rotation_euler = (Vector(cam["at"]) - Vector(cam["loc"])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = c
    return sc, arms


LOOK_SPLIT = (("spine", 0.25), ("chest", 0.30), ("head", 0.45))
LOOK_MAX = math.radians(75); LOOK_IN, LOOK_OUT = 10, 12


def _wrap(a):
    while a > math.pi: a -= 2 * math.pi
    while a < -math.pi: a += 2 * math.pi
    return a


def look_layer(sc, run, arms):
    """Upper-body turn toward a target (heckler, walker): spine/chest/head twist about their local Y (verified:
    +Y twist = +yaw in the atan2(x, -y) facing convention), on a COMBINE track above the clips, so feet stay planted.
    Follows moving targets; clamped to +-75 deg; ramps in 10 f, out 12 f."""
    by = {}
    for lk in run.get("looks", []): by.setdefault(lk["actor"], []).append(lk)
    rep = {}
    for k, lks in by.items():
        a = arms[k]; name = f"TK_LOOK_{k}"
        old = bpy.data.actions.get(name)
        if old: bpy.data.actions.remove(old)
        act = bpy.data.actions.new(name); act.use_fake_user = True
        slot = act.slots.new(id_type='OBJECT', name=a.name)
        cb = act.layers.new("L").strips.new(type='KEYFRAME').channelbag(slot, ensure=True)
        fcs = {(b, i): cb.fcurves.new(f'pose.bones["{b}"].rotation_quaternion', index=i, group_name=b)
               for b, _ in LOOK_SPLIT for i in range(4)}
        keys = {}
        lks = sorted([x for x in lks if x["target"] in arms], key=lambda x: x["start"])
        # union of look windows; inside a union the latest-started window picks the target (a new heckler wins)
        spans = []
        for lk in lks:
            s1 = min(lk["end"], run["end"])
            if spans and lk["start"] <= spans[-1][1]: spans[-1][1] = max(spans[-1][1], s1); spans[-1][2].append(lk)
            else: spans.append([lk["start"], s1, [lk]])
        for s0, s1, group in spans:
            frames = sorted(set([s0 - 1] + list(range(s0, s1 + 1, 3)) + [s1, s1 + LOOK_OUT // 2, s1 + LOOK_OUT]))
            prev = None
            for f in frames:
                act_ = [g for g in group if g["start"] <= f < g["end"]]
                tg = (max(act_, key=lambda g: g["start"]) if act_ else group[-1])["target"]
                sc.frame_set(max(1, f))
                me = a.matrix_world @ a.pose.bones['head'].head
                th = arms[tg].matrix_world @ arms[tg].pose.bones['head'].head
                d = th - me; yaw = _wrap(math.atan2(d.x, -d.y) - a.matrix_world.to_euler().z)
                yaw = max(-LOOK_MAX, min(LOOK_MAX, yaw))
                if prev is not None and abs(yaw - prev) > math.radians(12):   # target switch: turn over ~6 frames
                    yaw = prev + math.copysign(math.radians(12), yaw - prev)
                prev = yaw
                w = 0.0 if f < s0 or f >= s1 + LOOK_OUT else (min(1.0, (f - s0) / LOOK_IN) if f < s1 else 1 - (f - s1) / LOOK_OUT)
                w = w * w * (3 - 2 * w)
                keys[f] = yaw * w
                rep[k] = max(rep.get(k, 0), round(math.degrees(abs(yaw)), 1))
        for f in sorted(keys):
            for b, share in LOOK_SPLIT:
                q = Quaternion((0, 1, 0), keys[f] * share)
                for i in range(4):
                    fcs[(b, i)].keyframe_points.insert(f, q[i], options={'FAST'})
        for fc in fcs.values(): fc.update()
        ad = a.animation_data; tr = ad.nla_tracks.new(); tr.name = "look"
        st = tr.strips.new("look", int(min(keys)), act)
        try: st.action_slot = act.slots[0]
        except Exception: pass
        st.blend_type = 'COMBINE'; st.extrapolation = 'NOTHING'; st.use_auto_blend = False
        st.blend_in = 0; st.blend_out = 0
    return rep


def overlay_track(sc, run, arms):
    """Per frame: head screen position (0..1, origin bottom-left) and active label per actor."""
    labels = {}
    for k, evs in run["timelines"].items():
        lab = [None] * (run["end"] + 2)
        for ev in sorted(evs, key=lambda e: e["start"]):
            for f in range(ev["start"], min(run["end"] + 1, ev["start"] + ev["a1"] - ev["a0"])): lab[f] = ev["label"]
        labels[k] = lab
    for w in run["walks"]:
        for f in range(w["start"], min(run["end"] + 1, w["end"] + 1)): labels[w["actor"]][f] = "walks off"
    out = []
    for f in range(1, run["end"] + 1, 1):
        sc.frame_set(f); row = {}
        for k, a in arms.items():
            p = a.matrix_world @ a.pose.bones['head'].tail
            p.z += 0.32
            v = world_to_camera_view(sc, sc.camera, p)
            row[k] = [round(v.x, 4), round(v.y, 4), labels.get(k, [None] * (f + 1))[f] if f < len(labels.get(k, [])) else None]
        out.append(row)
    return out


def clearance(sc, arms, end, step=2):
    """Nearest hand of any other resident to each resident's head centre (m), with frame."""
    rep = {}
    for f in range(1, end + 1, step):
        sc.frame_set(f)
        heads = {k: a.matrix_world @ ((a.pose.bones['head'].head + a.pose.bones['head'].tail) / 2) for k, a in arms.items()}
        for k, a in arms.items():
            for o, b in arms.items():
                if o == k: continue
                for h in ('hand.l', 'hand.r'):
                    d = (b.matrix_world @ b.pose.bones[h].tail - heads[k]).length
                    if d < rep.get(k, (9, 0))[0]: rep[k] = (round(d, 2), f)
    return rep


def foot_steps(sc, arms, end):
    """Max per-frame foot rotation step (deg) per actor, outside walks (sanity check for blend jumps)."""
    rep = {}; prev = {}
    for f in range(1, end + 1):
        sc.frame_set(f)
        for k, a in arms.items():
            q = [(a.matrix_world @ a.pose.bones[b].matrix).to_quaternion() for b in ('foot.l', 'foot.r')]
            if k in prev:
                d = max(min(a_, 360 - a_) for a_ in (math.degrees(q[i].rotation_difference(prev[k][i]).angle) for i in range(2)))
                if d > rep.get(k, (0, 0))[0]: rep[k] = (round(d, 1), f)
            prev[k] = q
    return rep
