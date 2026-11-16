"""KFB #369 debate r2: build the tagged conversation clip pool -> data/talk_pool.json.

Tags (role + function) are set by hand in TAGS, coarse on purpose. Everything else is measured:
- long clips are cut into windows at calm points (local minima of hand speed), 40-100 frames;
- energy per window = mean hand speed / rig height + 0.35 * mean head angular speed;
- intensity 1-3 = energy tertiles, separately for speaker and listener windows;
- Rig_Medium hand-in-head per window (ellipsoid test, kfb_talk.hand_in_head logic); hit windows are dropped on M.
Windows play on both rigs; mirrored use is allowed per clip ('mirror').
"""
import bpy, json, math, os, importlib
from mathutils import Vector
import kfb369_lib as L
import kfb_talk as T
importlib.reload(T)

# short: (roles, functions, variant, mirror)
S, Li = "speaker", "listener"
TAGS = {
    "talk|kfb_talk_talking_a": ([S], ["explain"], "full", True),
    "talk|kfb_talk_talking_b": ([S], ["explain"], "full", True),
    "talk|kfb_talk_talking_c": ([S], ["explain"], "full", True),
    "talk|kfb_talk_talking_d": ([S], ["explain", "insist"], "full", True),
    "talk|kfb_talk_talking_e": ([S], ["explain"], "full", True),
    "talk|kfb_talk_talking_f": ([S], ["explain"], "full", True),
    "talk|kfb_talk_sitting_a": ([S], ["explain"], "upper", True),
    "talk|kfb_talk_meeting_a": ([S], ["explain", "insist"], "upper", True),
    "talk|kfb_talk_watercooler_a": ([S], ["explain"], "full", True),
    "talk|kfb_talk_arguing_a": ([S], ["insist"], "full", True),
    "talk|kfb_talk_arguing_b": ([S], ["insist"], "full", True),
    "gesture|kfb_gesture_talking_a": ([S], ["explain"], "full", True),
    "gesture|kfb_gesture_counting_a": ([S], ["explain", "insist"], "full", True),
    "gesture|kfb_gesture_strong_gesture_a": ([S], ["insist"], "full", True),
    "gesture|kfb_gesture_pointing_a": ([S], ["insist", "accuse"], "full", True),
    "gesture|kfb_gesture_being_cocky_a": ([S, Li], ["insist", "brag"], "full", True),
    "exchange01|kfb_react_contradict_a": ([S, Li], ["contradict", "oppose"], "full", True),
    "gesture|kfb_gesture_shaking_head_no_a": ([S, Li], ["contradict", "oppose"], "full", True),
    "gesture|kfb_gesture_annoyed_head_shake_a": ([S, Li], ["contradict", "oppose"], "full", True),
    "gesture|kfb_gesture_thoughtful_head_shake_a": ([S, Li], ["doubt"], "full", True),
    "exchange01|kfb_react_boggle_a": ([S, Li], ["question", "doubt"], "full", True),
    "reaction|kfb_reaction_surprised_a": ([S, Li], ["question", "surprise"], "full", True),
    "reaction|kfb_reaction_reacting_a": ([Li], ["surprise"], "full", True),
    "exchange01|kfb_react_dismiss_a": ([S, Li], ["dismiss"], "full", True),
    "gesture|kfb_gesture_dismissing_gesture_a": ([S, Li], ["dismiss"], "full", True),
    "exchange01|kfb_react_taunt_a": ([S], ["dismiss", "taunt"], "full", True),
    "gesture|kfb_gesture_taunt_b": ([S], ["taunt"], "full", True),
    "gesture|kfb_gesture_angry_gesture_a": ([S], ["rage"], "full", True),
    "exchange01|kfb_react_outraged_a": ([S, Li], ["rage", "oppose"], "full", True),
    "gesture|kfb_gesture_yelling_a": ([S], ["rage"], "full", True),
    "gesture|kfb_gesture_relieved_sigh_a": ([S, Li], ["concede"], "full", True),
    "gesture|kfb_gesture_acknowledging_a": ([S, Li], ["concede", "attend"], "full", True),
    "exchange01|kfb_react_disappointed_a": ([S, Li], ["concede", "sulk"], "full", True),
    "idle|kfb_idle_rejected_a": ([Li], ["sulk"], "full", True),
    "idle|kfb_idle_sad_a": ([Li], ["sulk"], "full", True),
    "gesture|kfb_gesture_head_nod_yes_a": ([S, Li], ["agree", "attend"], "full", True),
    "gesture|kfb_gesture_lengthy_head_nod_a": ([Li], ["attend"], "full", True),
    "gesture|kfb_gesture_hard_head_nod_a": ([S, Li], ["agree", "approve"], "full", True),
    "gesture|kfb_gesture_sarcastic_head_nod_a": ([Li], ["doubt"], "full", True),
    "gesture|kfb_gesture_happy_hand_a": ([S, Li], ["agree", "approve"], "full", True),
    "exchange01|kfb_react_amused_a": ([Li], ["approve", "mock"], "full", True),
    "idle|kfb_idle_laughing_a": ([Li], ["mock", "approve"], "full", True),
    "gesture|kfb_gesture_cheering_a": ([S, Li], ["celebrate"], "full", True),
    "gesture|kfb_gesture_clapping_a": ([Li], ["approve", "celebrate"], "full", False),
    "gesture|kfb_gesture_standing_clap_a": ([Li], ["approve", "celebrate"], "full", False),
    "gesture|kfb_gesture_look_away_a": ([Li], ["bored"], "full", True),
    "gesture|kfb_gesture_weight_shift_a": ([Li], ["bored", "idle"], "full", True),
    "gesture|kfb_gesture_look_over_shoulder_a": ([Li], ["bored"], "full", True),
    "idle|kfb_idle_looking_around_a": ([Li], ["bored"], "full", True),
    "idle|kfb_idle_unarmed_idle_looking_ver_1_a": ([Li], ["bored", "idle"], "full", True),
    "idle|kfb_idle_standing_idle_03_a": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_a": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_b": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_c": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_d": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_e": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_idle_f": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_breathing_a": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_breathing_b": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_standing_a": ([Li], ["idle"], "full", True),
    "idle|kfb_idle_happy_a": ([Li], ["approve"], "full", True),
}
ACTOR = {"M": "DB_farmer_b", "L": "DB_orcbrute"}
WMIN, WMAX, WHOLE = 40, 100, 130


def sample(arm, action):
    ad = arm.animation_data or arm.animation_data_create()
    ad.use_nla = False; ad.action = bpy.data.actions[action]
    for pb in arm.pose.bones:
        pb.location = (0, 0, 0); pb.rotation_quaternion = (1, 0, 0, 0); pb.scale = (1, 1, 1)
    sc = bpy.context.scene; f0, f1 = [int(round(x)) for x in bpy.data.actions[action].frame_range]
    hm = T.head_mesh(arm); bb = [Vector(c) for c in hm.bound_box]
    lo = Vector([min(c[i] for c in bb) for i in range(3)]); hi = Vector([max(c[i] for c in bb) for i in range(3)])
    ctr = (lo + hi) / 2; half = (hi - lo) / 2 * 0.92
    rows = []
    for f in range(f0, f1 + 1):
        sc.frame_set(f)
        hands = [arm.pose.bones[h] for h in ('hand.l', 'hand.r')]
        hp = [(pb.head + pb.tail) / 2 for pb in hands]
        hq = arm.pose.bones['head'].matrix.to_quaternion()
        inv = hm.matrix_world.inverted(); hit = 0
        for p in hp:
            q = inv @ (arm.matrix_world @ p)
            if math.sqrt(sum(((q[i] - ctr[i]) / half[i]) ** 2 for i in range(3))) < 1: hit = 1
        rows.append((f, hp, hq, hit))
    return rows, arm.dimensions.z


def windows(rows, H):
    n = len(rows); sp = [0.0] * n; hs = [0.0] * n
    for i in range(1, n):
        sp[i] = sum((rows[i][1][k] - rows[i - 1][1][k]).length for k in range(2)) * 24 / H
        hs[i] = math.degrees(rows[i][2].rotation_difference(rows[i - 1][2]).angle) * 24
    sm = [sum(sp[max(0, i - 4):i + 5]) / len(sp[max(0, i - 4):i + 5]) for i in range(n)]
    cuts = [0]
    if n > WHOLE:
        while n - 1 - cuts[-1] > WMAX + WMIN:
            a = cuts[-1] + WMIN; b = min(cuts[-1] + WMAX, n - 1 - WMIN)
            cuts.append(min(range(a, b + 1), key=lambda i: sm[i]))
    cuts.append(n - 1)
    out = []
    for a, b in zip(cuts, cuts[1:]):
        e = sum(sp[a + 1:b + 1]) / max(1, b - a) + 0.35 * sum(hs[a + 1:b + 1]) / max(1, b - a) / 90.0
        out.append({"a0": rows[a][0], "a1": rows[b][0], "energy": round(e, 4),
                    "headHits": sum(r[3] for r in rows[a:b + 1])})
    return out


def run(rigs=("M", "L")):
    bpy.context.window.scene = bpy.data.scenes['369_DEBATE']
    p = os.path.join(L.JOB, "data", "talk_pool.json")
    pool = json.load(open(p)) if os.path.exists(p) else {"clips": []}
    keep = [c for c in pool["clips"] if c["rig"] not in rigs]
    new = []
    for rig in rigs:
        arm = bpy.data.objects[ACTOR[rig]]
        for short, (roles, funcs, variant, mir) in TAGS.items():
            if f"{rig}|MLB|{short}" not in bpy.data.actions: continue
            an = T.variant_action(rig, short, variant)
            rows, H = sample(arm, an)
            for i, w in enumerate(windows(rows, H)):
                if rig == "M" and w["headHits"] > 0: continue
                new.append({"id": f"{rig}:{short.split('|')[1]}#{i}", "rig": rig, "short": short, "variant": variant,
                            "roles": roles, "functions": funcs, "mirror": mir, **w,
                            "len": w["a1"] - w["a0"]})
        arm.animation_data.action = None; arm.animation_data.use_nla = True
    clips = keep + new
    for role in ("speaker", "listener"):
        for rig in ("M", "L"):
            es = sorted(c["energy"] for c in clips if c["rig"] == rig and role in c["roles"])
            if not es: continue
            t1, t2 = es[len(es) // 3], es[2 * len(es) // 3]
            for c in clips:
                if c["rig"] == rig and role in c["roles"]:
                    c.setdefault("intensity", {})[role] = 1 if c["energy"] < t1 else (2 if c["energy"] < t2 else 3)
    pool = {"schema": "kfb.talk.pool.v1", "fps": 24, "clips": clips,
            "note": "windows of prepared clips (wrist-fixed, Idle_A-aligned); 'upper' = seated talk on standing legs"}
    json.dump(pool, open(p, "w"), indent=1)
    return {r: sum(1 for c in clips if c["rig"] == r) for r in ("M", "L")}


if __name__ == "__main__":
    print(run())
