"""DANCE-01: measure the dance clips -> data/dance_pool.json.

Per clip (prepared, wrist-fixed, Idle_A-aligned; travelling clips frozen in place):
- beat period from the hips bounce (autocorrelation of the detrended hips height, 8-32 frame lags at 24 fps),
  folded into 70-140 BPM;
- beat frames = local minima of the bounce (the 'down' of each step);
- 4-beat windows that start on a measured beat (half a musical phrase), with mean hand speed as energy.
Style tags are set by hand (coarse).
"""
import bpy, json, math, os
import kfb369_lib as L
import kfb_talk as T
import kfb369_dance_clips as DC

STYLE = {"kfb_dance_breakdance_uprock_var_1_a": "breaking", "kfb_dance_chicken_a": "novelty",
         "kfb_dance_dancing_maraschino_step_a": "retro", "kfb_dance_hip_hop_a": "hiphop", "kfb_dance_hip_hop_c": "hiphop",
         "kfb_dance_hokey_pokey_a": "novelty", "kfb_dance_house_a": "house", "kfb_dance_house_b": "house",
         "kfb_dance_jazz_dancing_a": "jazz", "kfb_dance_locking_hip_hop_a": "hiphop", "kfb_dance_northern_soul_spin_a": "retro",
         "kfb_dance_samba_a": "latin", "kfb_dance_slide_hip_hop_a": "hiphop", "kfb_dance_swing_dancing_a": "jazz",
         "kfb_dance_twist_dance_a": "retro", "kfb_dance_wave_hip_hop_a": "hiphop", "kfb_dance_step_hip_hop_a": "hiphop",
         "kfb_dance_thriller_part3_a": "novelty", "kfb_dance_gangnam_style_a": "novelty"}
TRAVEL = {"kfb_dance_locking_hip_hop_a", "kfb_dance_step_hip_hop_a", "kfb_dance_thriller_part3_a"}


def inplace(rig, short):
    src = T.prepared(rig, short); out = src.replace("|MLBWn|", "|MLBWnIP|")
    if out in bpy.data.actions: return out
    a = bpy.data.actions[src].copy(); a.name = out; a.use_fake_user = True
    for fc, cb in T.fcs(a):
        bn = fc.data_path.split('"')[1]
        if bn in ("root", "hips") and fc.data_path.endswith("location"):
            ys = [k.co.y for k in fc.keyframe_points]
            if ys and max(ys) - min(ys) > 0.25:
                n = len(ys)
                for i, k in enumerate(fc.keyframe_points):   # remove the linear travel trend, keep the bounce
                    v = ys[i] - (ys[-1] - ys[0]) * i / max(1, n - 1)
                    k.co.y = v; k.handle_left.y = v; k.handle_right.y = v
                fc.update()
    return out


def action_for(rig, clip):
    short = ("dance|" if clip != "kfb_dance_gangnam_style_a" else "dance|") + clip
    return inplace(rig, short) if clip in TRAVEL else T.prepared(rig, short)


def sample(arm, an):
    ad = arm.animation_data or arm.animation_data_create(); keep = ad.use_nla; ad.use_nla = False
    ad.action = bpy.data.actions[an]
    try: ad.action_slot = ad.action.slots[0]
    except Exception: pass
    sc = bpy.context.scene; f0, f1 = [int(round(x)) for x in bpy.data.actions[an].frame_range]; rows = []
    for f in range(f0, f1 + 1):
        sc.frame_set(f); pb = arm.pose.bones
        rows.append((f, pb['hips'].head.copy(), pb['hand.l'].head.copy(), pb['hand.r'].head.copy()))
    ad.action = None; ad.use_nla = keep
    return rows


def tempo(rows):
    z = [r[1].z for r in rows]; n = len(z)
    k = 9; sm = [sum(z[max(0, i - k):i + k + 1]) / len(z[max(0, i - k):i + k + 1]) for i in range(n)]
    d = [z[i] - sm[i] for i in range(n)]
    best = None
    for lag in range(8, 33):
        if lag >= n // 2: break
        c = sum(d[i] * d[i + lag] for i in range(n - lag)) / (n - lag)
        if best is None or c > best[1]: best = (lag, c)
    P = best[0] if best else 16
    while 1440 / P > 140: P *= 2
    while 1440 / P < 70: P /= 2
    # beat frames = local minima of the detrended bounce, at least 0.6 P apart
    mins = []
    for i in range(1, n - 1):
        if d[i] <= d[i - 1] and d[i] <= d[i + 1]:
            if mins and i - mins[-1] < 0.6 * P:
                if d[i] < d[mins[-1]]: mins[-1] = i
            else: mins.append(i)
    return P, mins, (max(d) - min(d))


def run():
    sc = bpy.data.scenes['369_DEBATE']; bpy.context.window.scene = sc
    arm = bpy.data.objects['DB_farmer_b']; H = 1.49
    clips = []
    for clip in DC.DANCES + ["kfb_dance_gangnam_style_a"]:
        an = action_for("M", clip); rows = sample(arm, an); P, beats, bounce = tempo(rows)
        sp = [0.0] + [((rows[i][2] - rows[i - 1][2]).length + (rows[i][3] - rows[i - 1][3]).length) * 24 / H for i in range(1, len(rows))]
        wins = []
        for i in range(0, len(beats) - 4, 4):          # 4-beat windows (half a phrase); the engine chains two per phrase
            a0, a1 = rows[beats[i]][0], rows[beats[i + 4]][0]
            per = (a1 - a0) / 4
            if 0.7 * P <= per <= 1.4 * P:
                wins.append({"a0": a0, "a1": a1, "beats": 4, "period": round(per, 2),
                             "energy": round(sum(sp[beats[i]:beats[i + 4]]) / max(1, beats[i + 4] - beats[i]), 4)})
        clips.append({"clip": clip, "style": STYLE[clip], "travelFrozen": clip in TRAVEL, "frames": len(rows),
                      "period": round(P, 2), "bpm": round(1440 / P, 1), "bounceM": round(bounce, 3),
                      "beats": [rows[b][0] for b in beats], "windows": wins})
    es = sorted(w["energy"] for c in clips for w in c["windows"])
    t1, t2 = es[len(es) // 3], es[2 * len(es) // 3]
    for c in clips:
        for w in c["windows"]: w["intensity"] = 1 if w["energy"] < t1 else (2 if w["energy"] < t2 else 3)
    out = {"schema": "kfb.dance.pool.v1", "fps": 24, "clips": clips}
    json.dump(out, open(os.path.join(L.JOB, "data", "dance_pool.json"), "w"), indent=1)
    return [(c["clip"].replace("kfb_dance_", ""), c["bpm"], len(c["beats"]), len(c["windows"]), c["bounceM"]) for c in clips]


if __name__ == "__main__":
    print(run())
