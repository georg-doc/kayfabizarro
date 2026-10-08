"""DANCE-01: Blender realizer for the dance engine (kfb_dance_gen.py) + disco floor.

Scene '369_DANCE': cloned residents (DN_*), ground/sun/world from 369_DEBATE, a tile floor that flashes on every
music beat (colours = a first proposal). Clip windows are NLA strips time-scaled so their measured steps land on
the beats; travelling dance clips play in place; mirrored windows come from kfb_talk.mirrored.
"""
import bpy, json, math, os, importlib
from mathutils import Vector
import kfb369_lib as L
import kfb_talk as T
import kfb_dance_gen as G
import kfb369_dance_pool as P
importlib.reload(G)

SC = "369_DANCE"
SRC = {"farmer": ("DB_farmer_b", "M"), "orc": ("DB_orcbrute", "L"), "farmer_a": ("ARM_farmer_a", "M"),
       "gothgirl": ("ARM_gothgirl", "M"), "lorekeeper": ("ARM_lorekeeper", "M")}
POOL = os.path.join(L.JOB, "data", "dance_pool.json"); MUSIC = os.path.join(L.JOB, "data", "dance_music_beats.json")
TILE_COLS = ["#ef5a22", "#f2b632", "#2bb3a8", "#7a5cd6"]        # proposal: Joyride orange, gift ribbon yellow, teal, violet
REACT = {"watch": "gesture|kfb_gesture_head_nod_yes_a", "clap": "gesture|kfb_gesture_clapping_a",
         "cheer": "gesture|kfb_gesture_cheering_a"}


def hex2lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def scene():
    sc = bpy.data.scenes.get(SC)
    if sc is None:
        src = bpy.data.scenes["369_DEBATE"]; sc = bpy.data.scenes.new(SC); sc.world = src.world
        for a in ("engine", "fps", "fps_base", "resolution_x", "resolution_y"): setattr(sc.render, a, getattr(src.render, a))
        sc.view_settings.view_transform = src.view_settings.view_transform; sc.view_settings.look = src.view_settings.look
        for n in ("GH_ground", "369_SUN"): sc.collection.objects.link(bpy.data.objects[n])
        if getattr(src, "compositing_node_group", None):
            ng = src.compositing_node_group.copy(); ng.name = "DN_bloom"
            for n in ng.nodes:
                if n.type == 'R_LAYERS': n.scene = sc; n.layer = sc.view_layers[0].name
            sc.compositing_node_group = ng
    sc.render.fps = 24; return sc


def clone(sc, key):
    name = "DN_" + key
    if name in bpy.data.objects: return bpy.data.objects[name]
    col = bpy.data.collections.new(name); sc.collection.children.link(col)
    s = bpy.data.objects[SRC[key][0]]; a = s.copy(); a.name = name; a.animation_data_clear(); col.objects.link(a)
    a.rotation_mode = 'XYZ'
    for ch in s.children:
        c = ch.copy(); c.parent = a; col.objects.link(c)
        for m in c.modifiers:
            if m.type == 'ARMATURE': m.object = a
    return a


def floor(sc, nx=7, ny=5, size=1.15):
    col = bpy.data.collections.get("DN_floor") or bpy.data.collections.new("DN_floor")
    if col.name not in sc.collection.children: sc.collection.children.link(col)
    tiles = [o for o in col.objects]
    if tiles: return tiles
    import bmesh
    for i in range(nx):
        for j in range(ny):
            k = (i + j) % len(TILE_COLS); m = bpy.data.materials.new(f"DN_tile_{i}_{j}"); m.use_nodes = True
            p = m.node_tree.nodes["Principled BSDF"]; p.inputs["Base Color"].default_value = hex2lin(TILE_COLS[k])
            p.inputs["Roughness"].default_value = 0.6; p.inputs["Emission Color"].default_value = hex2lin(TILE_COLS[k])
            p.inputs["Emission Strength"].default_value = 0.0
            bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(size * 0.94, size * 0.94, 0.04), verts=bm.verts)
            me = bpy.data.meshes.new(f"DN_tile_{i}_{j}"); bm.to_mesh(me); bm.free(); me.materials.append(m)
            o = bpy.data.objects.new(f"DN_tile_{i}_{j}", me); col.objects.link(o)
            o.location = ((i - (nx - 1) / 2) * size, (j - (ny - 1) / 2) * size + 0.6, 0.02)
            o["phase"] = (i * 3 + j * 5) % 4
    return list(col.objects)


def flash(tiles, beat_frames, end):
    """Each tile lights on every 4th beat of its own phase (a running checker), decays over one beat."""
    for o in tiles:
        p = o.material_slots[0].material.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
        m = o.material_slots[0].material
        if m.node_tree.animation_data: m.node_tree.animation_data_clear()
        p.default_value = 0.0; p.keyframe_insert("default_value", frame=1)
        for n, f in enumerate(beat_frames):
            lit = (n % 4) == o["phase"]
            nxt = beat_frames[n + 1] if n + 1 < len(beat_frames) else f + 12
            p.default_value = 2.2 if lit else 0.25; p.keyframe_insert("default_value", frame=max(1, f))
            p.default_value = 0.1; p.keyframe_insert("default_value", frame=max(2, int(f + (nxt - f) * 0.85)))


def action_for(rig, ev):
    if "react" in ev: return T.prepared(rig, REACT[ev["react"]])
    an = P.action_for(rig, ev["clip"])
    if ev.get("mirror") and not ev.get("frozen"): an = T.mirrored(rig, "dance|" + ev["clip"])
    return an


def build_nla(a, rig, events, end):
    idle = T.idle_name(rig)
    ad = a.animation_data or a.animation_data_create(); ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    tr = ad.nla_tracks.new(); ac = bpy.data.actions[idle]; st = tr.strips.new("Idle_A", 1, ac)
    try: st.action_slot = ac.slots[0]
    except Exception: pass
    st.action_frame_end = ac.frame_range[1]; st.repeat = math.ceil(end / ac.frame_range[1]) + 1
    tracks = []
    for ev in sorted(events, key=lambda e: e["start"]):
        an = action_for(rig, ev); ac = bpy.data.actions[an]
        if "react" in ev: a0, a1, sc_ = 0, int(ac.frame_range[1]), 1.0
        else:
            a0 = ev["a0"]; a1 = min(int(ac.frame_range[1]), ev["a1"] + 5); sc_ = ev["scale"]
        s0 = int(round(ev["start"])); s1 = s0 + (a1 - a0) * sc_
        top = max([i for i, (t, last) in enumerate(tracks) if last > s0 - 1] or [-1])
        idx = next((i for i in range(top + 1, len(tracks))), None)
        if idx is None: tracks.append([ad.nla_tracks.new(), s1]); idx = len(tracks) - 1
        trk = tracks[idx][0]; tracks[idx][1] = s1
        st = trk.strips.new(an.split('|')[-1][:40], s0, ac)
        try: st.action_slot = ac.slots[0]
        except Exception: pass
        st.action_frame_end = a1; st.action_frame_start = a0; st.scale = sc_
        st.use_auto_blend = False; st.extrapolation = 'NOTHING'
        ln = st.frame_end - st.frame_start; st.blend_in = min(5, ln * 0.3); st.blend_out = min(5, ln * 0.3)
    ad.use_nla = True


LAYOUTS = {
    "cluster": {"farmer": (-1.0, 0.1), "orc": (-3.0, 1.9), "farmer_a": (1.1, -0.5), "gothgirl": (0.1, 2.0), "lorekeeper": (2.9, 1.1)},
    "line": {"farmer": (-3.2, 0.6), "farmer_a": (-1.6, 0.6), "orc": (0.0, 1.1), "gothgirl": (1.6, 0.6), "lorekeeper": (3.2, 0.6)},
    "battle": {"farmer": (1.4, -0.2), "orc": (-2.2, 0.0), "farmer_a": (0.0, 2.7), "gothgirl": (2.2, 2.9), "lorekeeper": (3.9, 1.6)},
}
CAMS = {"cluster": ((0.2, -11.5, 3.2), (0.1, 0.8, 1.2), 32), "line": ((0.0, -12.0, 3.0), (0.0, 0.7, 1.25), 32),
        "battle": ((0.7, -12.0, 3.3), (0.6, 1.2, 1.25), 31)}


def realize(run, layout):
    sc = scene(); bpy.context.window.scene = sc
    tiles = floor(sc); arms = {}
    keep = {c["id"] for c in run["cast"]}
    for k in SRC:
        col = bpy.data.collections.get("DN_" + k)
        if col: col.hide_render = k not in keep; col.hide_viewport = k not in keep
    pos = LAYOUTS[layout]
    for c in run["cast"]:
        a = clone(sc, c["id"]); arms[c["id"]] = a
        x, y = pos[c["id"]]; a.location = (x, y, 0)
        if layout == "battle" and c["id"] in ("farmer", "orc"):
            other = pos["orc" if c["id"] == "farmer" else "farmer"]; tx, ty = (other[0] + x) / 2, -6.0   # 3/4 to each other
            d = Vector((other[0] - x, other[1] - y)).normalized() + Vector((0, -1.3)) * 0.6
        else:
            d = Vector((0, -1))
        a.rotation_euler = (0, 0, math.atan2(d.x, -d.y))
        build_nla(a, SRC[c["id"]][1], run["timelines"].get(c["id"], []), run["end"])
    flash(tiles, run["beatFrames"], run["end"])
    cam = bpy.data.objects.get("DN_CAM") or bpy.data.objects.new("DN_CAM", bpy.data.cameras.new("DN_CAM"))
    if cam.name not in sc.collection.objects: sc.collection.objects.link(cam)
    cl, at, lens = CAMS[layout]; cam.location = cl; cam.data.lens = lens
    cam.rotation_euler = (Vector(at) - Vector(cl)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = cam
    sc.frame_start, sc.frame_end = 1, run["end"]
    return sc, arms


def A(i, st): return {"id": i, "rig": SRC[i][1], "styles": st}


CAST = [A("farmer", ["hiphop", "house"]), A("orc", ["novelty", "hiphop"]), A("farmer_a", ["retro", "jazz"]),
        A("gothgirl", ["house", "hiphop"]), A("lorekeeper", ["retro", "latin"])]
SHOWS = {
    "DANCE_A_disco_freestyle": {"music": "drum-n-bass", "layout": "cluster", "seed": 7,
                                "show": [{"mode": "freestyle", "blocks": [0, 99]}]},
    "DANCE_B_line_unison_canon": {"music": "reggae", "layout": "line", "seed": 7,
                                  "show": [{"mode": "unison", "blocks": [0, 2]}, {"mode": "canon", "blocks": [2, 4]},
                                           {"mode": "unison", "blocks": [4, 6]}, {"mode": "freestyle", "blocks": [6, 99]}]},
    "DANCE_C_dance_off": {"music": "jazz-trio", "layout": "battle", "seed": 7,
                          "show": [{"mode": "battle", "a": "farmer", "b": "orc", "blocks": [0, 99]}]},
}


def build(name):
    s = SHOWS[name]; M = json.load(open(MUSIC))["tracks"][s["music"]]
    cast = sorted(CAST, key=lambda c: LAYOUTS[s["layout"]][c["id"]][0])   # canon runs left -> right through the line
    run = G.run(POOL, M, s["music"], cast, s["show"], s["seed"]); run["name"] = name
    d = os.path.join(L.JOB, "data", "dance_runs"); os.makedirs(d, exist_ok=True)
    json.dump(run, open(os.path.join(d, name + ".json"), "w"), indent=1)
    sc, arms = realize(run, s["layout"])
    return {"end": run["end"], "bpm": run["musicBpm"], "half": run["halfTime"], "sections": run["sections"],
            "events": {k: len(v) for k, v in run["timelines"].items()}}


def render(name, f0, f1, res=(960, 540), samples=8):
    sc = bpy.data.scenes[SC]; bpy.context.window.scene = sc
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.eevee.taa_render_samples = samples; sc.render.image_settings.file_format = 'PNG'
    d = os.path.join(L.JOB, "previews", "dance", name); os.makedirs(d, exist_ok=True)
    sc.render.filepath = os.path.join(d, "f_####"); sc.frame_start = f0; sc.frame_end = f1
    bpy.ops.render.render(animation=True, scene=sc.name); sc.frame_start = 1
    return d
