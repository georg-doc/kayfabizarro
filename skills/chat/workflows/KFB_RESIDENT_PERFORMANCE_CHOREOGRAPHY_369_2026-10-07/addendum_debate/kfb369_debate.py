"""KFB #369 culture mechanic: debate (Farmer B vs Orc Brute), first pass.

Turn-taking argument built only from existing clips (Motion Library talk / gesture + exchange reactions, KayKit idle),
all wrist-fixed (MLBWn) and quaternion-aligned to Idle_A. Medium clips were chosen from a hand-in-head audit on
Farmer B (0 samples inside the head): talk_talking_e, react_boggle, gesture_angry_gesture, react_dismiss,
gesture_thoughtful_head_shake.

Beats (24 fps) — the BEATS table is the single source; edit it or override via data/debate_params.json:
  10-120   Farmer explains (talking_e)                  Orc listens (idle)
  116-176  Farmer boggles                               Orc contradicts, then argues (arguing_a)
  176-255  Farmer gets angry (angry_gesture)            Orc outraged (react_outraged)
  255-330  Farmer waves it off (react_dismiss)          Orc yells (gesture_yelling)
  330-400  Farmer shakes her head and turns quiet       Orc disappointed
"""
import bpy, math, json, os
from mathutils import Vector, Quaternion
import kfb369_lib as L

SC = "369_DEBATE"
FARMER = "DB_farmer_b"; ORC = "DB_orcbrute"
FARMER_X = 1.2; ORC_X = -1.4            # 2.6 m apart (Large needs room for its arm swings), facing each other
END = 410
# (action short name, start frame, action range a0, a1, blend in, blend out)
BEATS = {
    "M": [("talk|kfb_talk_talking_e", 10, 0, 110, 8, 8),
          ("exchange01|kfb_react_boggle_a", 118, 0, 60, 8, 6),
          ("gesture|kfb_gesture_angry_gesture_a", 176, 0, 79, 8, 8),
          ("exchange01|kfb_react_dismiss_a", 262, 0, 32, 6, 6),
          ("gesture|kfb_gesture_dismissing_gesture_a", 292, 0, 40, 6, 8),
          ("gesture|kfb_gesture_thoughtful_head_shake_a", 334, 0, 74, 8, 10)],
    "L": [("exchange01|kfb_react_contradict_a", 116, 0, 46, 8, 6),
          ("talk|kfb_talk_arguing_a", 156, 0, 60, 8, 8),
          ("exchange01|kfb_react_outraged_a", 206, 0, 40, 6, 8),
          ("gesture|kfb_gesture_yelling_a", 256, 0, 80, 8, 10),
          ("exchange01|kfb_react_disappointed_a", 344, 0, 52, 8, 10)],
}


def _load_params():
    p = os.path.join(L.JOB, "data", "debate_params.json")
    if not os.path.exists(p): return {}
    d = json.load(open(p)); g = globals()
    for k, v in d.items():
        if k in g and not k.startswith("_"): g[k] = v
    return d
_PARAMS = _load_params()


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


def wristfix(src, ref):
    out = src.replace("|MLB|", "|MLBWn|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    hand = {}
    for fc, cb in fcs(bpy.data.actions[ref]):
        if fc.data_path.endswith('rotation_quaternion') and '"hand.' in fc.data_path:
            hand.setdefault(fc.data_path, {})[fc.array_index] = fc.evaluate(0)
    for fc, cb in fcs(a):
        p = fc.data_path; v = None
        if p.endswith('rotation_quaternion') and '"wrist.' in p: v = (1, 0, 0, 0)[fc.array_index]
        elif p.endswith('rotation_quaternion') and p in hand: v = hand[p][fc.array_index]
        if v is not None:
            for k in fc.keyframe_points: k.co.y = v; k.handle_left.y = v; k.handle_right.y = v
            fc.update()
    return out


def build_nla(arm, rig, beats):
    idle = f"{rig}|KK|General|Idle_A"
    ref = refq(idle)
    ad = arm.animation_data or arm.animation_data_create(); ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    tr = ad.nla_tracks.new(); ac = bpy.data.actions[idle]
    st = tr.strips.new("Idle_A", 1, ac)
    try: st.action_slot = ac.slots[0]
    except Exception: pass
    st.action_frame_end = ac.frame_range[1]; st.repeat = math.ceil(END / ac.frame_range[1]) + 1; st.extrapolation = 'HOLD'
    used = []
    for short, start, a0, a1, bi, bo in beats:
        src = f"{rig}|MLB|{short}"
        act = wristfix(src, idle); align_quats(bpy.data.actions[act], ref)
        tr = ad.nla_tracks.new(); ac = bpy.data.actions[act]
        st = tr.strips.new(short.split('|')[-1], int(start), ac)
        try: st.action_slot = ac.slots[0]
        except Exception: pass
        st.action_frame_end = a1; st.action_frame_start = a0
        st.blend_in = bi; st.blend_out = bo; st.extrapolation = 'NOTHING'
        used.append((act, start, start + (a1 - a0)))
    ad.use_nla = True
    return used


def run():
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc; sc.frame_start = 1; sc.frame_end = END
    fm = bpy.data.objects[FARMER]; orc = bpy.data.objects[ORC]
    for o in (fm, orc): o.rotation_mode = 'XYZ'          # glTF imports come in as quaternion mode
    fm.location = (FARMER_X, 0, 0); fm.rotation_euler = (0, 0, math.radians(-90))
    orc.location = (ORC_X, 0, 0); orc.rotation_euler = (0, 0, math.radians(90))
    rep = {"farmer": build_nla(fm, "M", BEATS["M"]), "orc": build_nla(orc, "L", BEATS["L"])}
    sc.frame_set(1)
    return rep


result = run()
