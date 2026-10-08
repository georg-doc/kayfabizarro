"""KFB #369 debate r2: four seeded runs of the talk rule engine (debate x3, Speaker's Corner x1).

Each run = cast profile + start heat + seed. The engine (kfb_talk_gen) decides moves, listener signals, interrupts,
heat and the outcome; kfb369_talk_scene plays it. Run files: data/talk_runs/<name>.json (re-playable, editable).
"""
import json, os, importlib
import kfb369_lib as L
import kfb_talk_gen as G
import kfb369_talk_scene as S
importlib.reload(G); importlib.reload(S)

def A(i, r, e, f, s, st="neutral"): return {"id": i, "rig": r, "engagement": e, "fuse": f, "stubbornness": s, "stance": st}

DEB = {"farmer": (1.4, 0, 0, (-1.6, 0), (1.0, 0.15)), "orc": (-1.6, 0, 0, (1.4, 0), (-1.0, 0.15))}
DEB_CAM = {"loc": (-0.1, -10.0, 2.2), "at": (-0.1, 0, 1.75), "lens": 36}
CORNER = {"farmer": (0.0, 1.6, S.CRATE_H, (0.0, -1.0)), "orc": (-3.2, -0.5, 0, (0.0, 1.6)),
          "farmer_a": (-1.3, 0.3, 0, (0.0, 1.6)), "lorekeeper": (1.2, 0.2, 0, (0.0, 1.6)),
          "gothgirl": (2.3, -0.6, 0, (0.0, 1.6), (1.0, -0.2))}
CORNER_CAM = {"loc": (-0.2, -11.6, 2.9), "at": (-0.3, 0.3, 1.55), "lens": 32}

RUNS = {
    "A_polite_chat": {"mode": "debate", "seed": 2, "heat": 0.2, "max": 640, "layout": DEB, "cam": DEB_CAM,
                      "cast": [A("farmer", "M", 1, .2, .2), A("orc", "L", 1, .2, .3)]},
    "B_heated_argument": {"mode": "debate", "seed": 10, "heat": 0.9, "max": 640, "layout": DEB, "cam": DEB_CAM,
                          "cast": [A("farmer", "M", 2, .6, .5), A("orc", "L", 3, .9, .9)]},
    "C_dogged_vs_absent": {"mode": "debate", "seed": 8, "heat": 0.7, "max": 640, "layout": DEB, "cam": DEB_CAM,
                           "cast": [A("orc", "L", 3, .7, .8), A("farmer", "M", 0, .3, .4)]},
    "D_speakers_corner": {"mode": "corner", "seed": 4, "heat": 0.3, "max": 700, "layout": CORNER, "cam": CORNER_CAM,
                          "cast": [A("farmer", "M", 3, .6, .6), A("orc", "L", 3, .8, .9, "contra"),
                                   A("farmer_a", "M", 2, .3, .3, "pro"), A("gothgirl", "M", 0, .2, .5, "neutral"),
                                   A("lorekeeper", "M", 1, .3, .6, "contra")]},
}
# r2b: outcome spread + look-at turns (rules v2). Same casts as C and D, seeds picked from a 60-seed sweep.
_C = [A("orc", "L", 3, .7, .8), A("farmer", "M", 0, .3, .4)]
_D = [A("farmer", "M", 3, .6, .6), A("orc", "L", 3, .8, .9, "contra"), A("farmer_a", "M", 2, .3, .3, "pro"),
      A("gothgirl", "M", 0, .2, .5, "neutral"), A("lorekeeper", "M", 1, .3, .6, "contra")]
RUNS.update({
    "C1_absent_walks_off": {"mode": "debate", "seed": 3, "heat": 0.7, "max": 640, "layout": DEB, "cam": DEB_CAM, "cast": _C},
    "C2_drawn_in_stalemate": {"mode": "debate", "seed": 5, "heat": 0.7, "max": 640, "layout": DEB, "cam": DEB_CAM, "cast": _C},
    "C3_drawn_in_agree": {"mode": "debate", "seed": 7, "heat": 0.7, "max": 640, "layout": DEB, "cam": DEB_CAM, "cast": _C},
    "D1_heckler_leaves_applause": {"mode": "corner", "seed": 7, "heat": 0.3, "max": 700, "layout": CORNER, "cam": CORNER_CAM, "cast": _D},
    "D2_outburst": {"mode": "corner", "seed": 12, "heat": 0.3, "max": 700, "layout": CORNER, "cam": CORNER_CAM, "cast": _D},
    "D3_deserted": {"mode": "corner", "seed": 2, "heat": 0.3, "max": 700, "layout": CORNER, "cam": CORNER_CAM, "cast": _D},
})
OUT = os.path.join(L.JOB, "data", "talk_runs")


def _load_params():
    p = os.path.join(L.JOB, "data", "debate_r2_params.json")
    if os.path.exists(p):
        for k, v in json.load(open(p)).items():
            if k in RUNS: RUNS[k].update(v)
_load_params()


def generate(name):
    r = RUNS[name]; os.makedirs(OUT, exist_ok=True)
    run = G.run(S.POOL, S.RULES, r["mode"], r["cast"], r["seed"], max_frames=r["max"], heat=r["heat"])
    run["name"] = name; json.dump(run, open(os.path.join(OUT, name + ".json"), "w"), indent=1)
    return run


def build(name, overlay=True):
    run = generate(name); r = RUNS[name]
    sc, arms = S.realize(run, r["layout"], r["cam"])
    rep = {"outcome": run["outcome"], "end": run["end"], "turns": len(run["turns"]), "variety": run["variety"]}
    if overlay:
        ov = S.overlay_track(sc, run, arms)
        json.dump({"name": name, "run": run, "frames": ov}, open(os.path.join(OUT, name + "_overlay.json"), "w"))
        rep["footStep"] = S.foot_steps(sc, arms, run["end"])
        rep["handToHead"] = S.clearance(sc, arms, run["end"])
    return rep


def render(name, f0, f1, res=(960, 540), samples=8):
    import bpy
    sc = bpy.data.scenes[S.SC]; bpy.context.window.scene = sc
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.eevee.taa_render_samples = samples; sc.render.image_settings.file_format = 'PNG'
    d = os.path.join(L.JOB, "previews", "talk_r2", name); os.makedirs(d, exist_ok=True)
    sc.render.filepath = os.path.join(d, "f_####")
    sc.frame_start = f0; sc.frame_end = f1
    bpy.ops.render.render(animation=True, scene=sc.name)
    sc.frame_start = 1
    return d
