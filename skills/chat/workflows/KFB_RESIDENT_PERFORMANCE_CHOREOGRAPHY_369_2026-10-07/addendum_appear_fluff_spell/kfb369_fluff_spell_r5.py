"""KFB #369 culture mechanic: Fluff spell, r5 — uses the shared appear grammar (kfb_appear.py).

Spell-specific part only: the Farmer's magic stance + two-hand spell clip, the clay ball growing between her
hands with crumbs pulled in, and the shot. Arrival, morph, colour wave, rim glow, flash and zero-G float come
from kfb_appear.build() — the same code the gift loot will use.
"""
import bpy, bmesh, math, random, json, os
from mathutils import Vector, Quaternion, Euler
import importlib, kfb369_lib as L
import kfb_appear as A
importlib.reload(A)

SC = "369_FLUFF_TRADE"
FARMER = "FT_farmer_b"; ORC = "FT_orcbrute"
FARMER_X = 1.0; ORC_X = -2.4
CLAY_HEX = "#ef5a22"
SPELL = "M|MLBWn|action|kfb_action_two_hand_spell_casting_a"
MAGIC_IDLE = "M|MLBWn|idle|kfb_idle_magic_standing_idle_a"
READY = 10; S = 20
GROW = (22, 52)
RELEASE_CLIP = 36
FLIGHT = 18
PRESENT = (-0.7, 0.0, 1.55)
PROP = "teapot"; PROP_SCALE = 0.95
ORC_HAPPY = 96; FARMER_CHEER = 108
END = 180
FP = os.path.join(L.SRC, "9124366b", "fluff_scripts", "fingerprints-512.png")
TT = os.path.join(L.SRC, "76f2f021", "media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf")


def fcs(a):
    for l in a.layers:
        for s in l.strips:
            for cb in s.channelbags:
                for fc in cb.fcurves: yield fc, cb


def clear_anim(o):
    if o.animation_data and o.animation_data.action:
        for fc, cb in list(fcs(o.animation_data.action)): cb.fcurves.remove(fc)


def align_quats(action, ref):
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


def refq(name):
    by = {}
    for fc, cb in fcs(bpy.data.actions[name]):
        if fc.data_path.endswith('rotation_quaternion'):
            by.setdefault(fc.data_path.split('"')[1], [0, 0, 0, 0])[fc.array_index] = fc.evaluate(0)
    return {b: Quaternion(v) for b, v in by.items()}


def wristfix(src, ref):
    out = src.replace("|MLB|", "|MLBWn|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    hand = {}
    for fc, cb in fcs(bpy.data.actions[ref]):
        if fc.data_path.endswith('rotation_quaternion') and '"hand.' in fc.data_path:
            hand.setdefault(fc.data_path, {})[fc.array_index] = fc.evaluate(0)
    for fc, cb in fcs(a):
        p = fc.data_path
        v = None
        if p.endswith('rotation_quaternion') and '"wrist.' in p: v = (1, 0, 0, 0)[fc.array_index]
        elif p.endswith('rotation_quaternion') and p in hand: v = hand[p][fc.array_index]
        if v is not None:
            for k in fc.keyframe_points: k.co.y = v; k.handle_left.y = v; k.handle_right.y = v
            fc.update()
    return out


def nla(arm, strips):
    ad = arm.animation_data or arm.animation_data_create(); ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    for i, (act, start, a0, a1, rep, bin_, bout, scale, ext) in enumerate(strips):
        tr = ad.nla_tracks.new(); ac = bpy.data.actions[act]
        st = tr.strips.new(act.split('|')[-1], int(start), ac)
        try: st.action_slot = ac.slots[0]
        except Exception: pass
        st.action_frame_end = a1; st.action_frame_start = a0; st.scale = scale; st.repeat = rep
        st.blend_in = bin_; st.blend_out = bout; st.extrapolation = 'HOLD' if i == 0 else ext
    ad.use_nla = True


def get_prop(sc, col):
    o = bpy.data.objects.get("FF_" + PROP)
    if o: return o
    objs = L.import_into(sc, col.name, os.path.join(TT, PROP + ".gltf"))
    root = None
    for x in objs:
        if x.name.startswith("Icosphere"): bpy.data.objects.remove(x, do_unlink=True); continue
        if x.parent is None: root = x
    root.name = "FF_" + PROP
    return root



def run():
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc; sc.frame_end = END
    rnd = random.Random(21)
    for o in [o for o in bpy.data.objects if o.name.startswith(("FS_", "FF_ball", "FF_FX_", "FF_CT_", "FT_FX_", "FT_fluff", "FT_CT_"))]:
        bpy.data.objects.remove(o, do_unlink=True)
    col = bpy.data.collections["FT_props"]
    fm = bpy.data.objects[FARMER]; orc = bpy.data.objects[ORC]
    fm.location = (FARMER_X, 0, 0); orc.location = (ORC_X, 0, 0)
    spell = wristfix(SPELL.replace("|MLBWn|", "|MLB|"), "M|KK|General|Idle_A")
    idle_m = wristfix(MAGIC_IDLE.replace("|MLBWn|", "|MLB|"), "M|KK|General|Idle_A")
    for a in (spell, idle_m, "M|KK|Simulation|Cheering"): align_quats(bpy.data.actions[a], refq("M|KK|General|Idle_A"))
    align_quats(bpy.data.actions["L|MLBWn|idle|kfb_idle_happy_a"], refq("L|KK|General|Idle_A"))
    clip_end = bpy.data.actions[spell].frame_range[1]
    nla(fm, [("M|KK|General|Idle_A", 1, 0, 25.6, 6, 0, 0, 1, 'HOLD'),
             (idle_m, READY, 0, 44, 1, 8, 0, 1, 'HOLD_FORWARD'),
             (spell, S, 0, clip_end, 1, 6, 0, 1, 'HOLD_FORWARD'),
             ("M|KK|General|Idle_A", S + clip_end - 4, 0, 25.6, 2, 8, 0, 1, 'HOLD_FORWARD'),
             ("M|KK|Simulation|Cheering", FARMER_CHEER, 0, 40, 1, 8, 10, 1, 'NOTHING')])
    nla(orc, [("L|KK|General|Idle_A", 1, 0, 47.2, 5, 0, 0, 1, 'HOLD'),
              ("L|MLBWn|idle|kfb_idle_happy_a", ORC_HAPPY, 0, 71, 1, 12, 12, 1, 'NOTHING')])
    release = S + RELEASE_CLIP; arrive = release + FLIGHT
    def hand_mid(f):
        sc.frame_set(f); return (L.wpos(fm, 'handslot.l') + L.wpos(fm, 'handslot.r')) / 2 + Vector((0, 0, 0.02))
    # source path: grows between the hands until the push
    path = []
    for f in range(GROW[0], release + 1):
        g = min(1.0, max(0.0, (f - GROW[0]) / (GROW[1] - GROW[0])))
        s = max(0.001, (1 - (1 - g) ** 2) * (1.0 + 0.06 * math.sin(f * 0.9)))
        path.append((f, hand_mid(f), s))
    prop = get_prop(sc, col)
    res = A.build(sc, col, prop, path, arrive, Vector(PRESENT), name="FS", clay_hex=CLAY_HEX,
                  prop_scale=PROP_SCALE, end=END, fingerprints=FP)
    # spell-only: crumbs pulled into the ball while it grows
    csrc = bpy.data.meshes.get("FS_crumb_src")
    for i in range(12):
        fa = rnd.randint(GROW[0] + 6, GROW[1] - 2); f0 = fa - rnd.randint(6, 9)
        hm = hand_mid(fa)
        a = rnd.uniform(0, 2 * math.pi); r0 = rnd.uniform(0.45, 0.7)
        sp = hm + Vector((math.cos(a) * r0, math.sin(a) * r0, rnd.uniform(-0.2, 0.35)))
        mid = sp.lerp(hm, 0.5) + Vector((-math.sin(a) * 0.12, math.cos(a) * 0.12, 0.05))
        sz = rnd.uniform(0.025, 0.045)
        b = bpy.data.objects.new(f"FS_crumb_in{i:02d}", csrc); col.objects.link(b)
        for f, loc, s_, ip in ((1, sp, 0.0, 'CONSTANT'), (f0 - 0.5, sp, 0.0, 'CONSTANT'), (f0, sp, sz, 'BEZIER'),
                               ((f0 + fa) / 2, mid, sz, 'BEZIER'), (fa, hm, sz * 0.5, 'CONSTANT'), (fa + 1, hm, 0.0, 'CONSTANT')):
            A.key(b, "location", f, loc, ip); A.key(b, "scale", f, Vector((s_,) * 3), ip)
    res.update(release=release, arrive=arrive)
    sc.frame_set(1)
    return res


result = run()
