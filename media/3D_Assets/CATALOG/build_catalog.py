#!/usr/bin/env python3
"""Build an asset catalog over all Kenney (and loose) GLB packs.
Fast: reads only the GLB JSON chunk + accessor min/max, walks the node
graph applying TRS, computes a world-space AABB. No vertex data loaded.
"""
import os, json, struct, math, sys
import numpy as np

_HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(_HERE)   # CATALOG/ liegt im Asset-Root; portabel statt Hardcode
OUT  = _HERE
GITHUB_BASE = "https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets"

os.makedirs(OUT, exist_ok=True)

# ---------- GLB parsing ----------
def read_glb_json(path):
    with open(path, "rb") as f:
        data = f.read()
    if data[:4] != b"glTF":
        return None
    # header 12 bytes, then chunks
    off = 12
    length = len(data)
    while off < length:
        clen, ctype = struct.unpack_from("<II", data, off)
        off += 8
        chunk = data[off:off+clen]
        off += clen
        if ctype == 0x4E4F534A:  # 'JSON'
            return json.loads(chunk.decode("utf-8"))
    return None

def trs_matrix(node):
    if "matrix" in node:
        return np.array(node["matrix"], dtype=float).reshape(4,4).T
    T = np.eye(4)
    if "translation" in node:
        T[:3,3] = node["translation"]
    R = np.eye(4)
    if "rotation" in node:
        x,y,z,w = node["rotation"]
        R[:3,:3] = np.array([
            [1-2*(y*y+z*z), 2*(x*y-z*w),   2*(x*z+y*w)],
            [2*(x*y+z*w),   1-2*(x*x+z*z), 2*(y*z-x*w)],
            [2*(x*z-y*w),   2*(y*z+x*w),   1-2*(x*x+y*y)],
        ])
    S = np.eye(4)
    if "scale" in node:
        for i,s in enumerate(node["scale"]):
            S[i,i] = s
    return T @ R @ S

def mesh_aabb(gltf, mesh_idx):
    """local-space AABB corners for a mesh from POSITION accessor min/max."""
    lo = np.array([ math.inf]*3)
    hi = np.array([-math.inf]*3)
    found = False
    for prim in gltf["meshes"][mesh_idx].get("primitives", []):
        pi = prim.get("attributes", {}).get("POSITION")
        if pi is None: continue
        acc = gltf["accessors"][pi]
        if "min" in acc and "max" in acc:
            lo = np.minimum(lo, acc["min"][:3])
            hi = np.maximum(hi, acc["max"][:3])
            found = True
    return (lo, hi) if found else None

def world_aabb(gltf):
    if "nodes" not in gltf: return None
    scenes = gltf.get("scenes", [])
    if scenes and "scene" in gltf:
        roots = scenes[gltf["scene"]].get("nodes", [])
    elif scenes:
        roots = scenes[0].get("nodes", [])
    else:
        roots = list(range(len(gltf["nodes"])))
    glo = np.array([ math.inf]*3)
    ghi = np.array([-math.inf]*3)
    got = False
    def walk(ni, parent):
        nonlocal glo, ghi, got
        node = gltf["nodes"][ni]
        M = parent @ trs_matrix(node)
        if "mesh" in node:
            bb = mesh_aabb(gltf, node["mesh"])
            if bb:
                lo, hi = bb
                # transform 8 corners
                for cx in (lo[0],hi[0]):
                    for cy in (lo[1],hi[1]):
                        for cz in (lo[2],hi[2]):
                            p = M @ np.array([cx,cy,cz,1.0])
                            glo = np.minimum(glo, p[:3])
                            ghi = np.maximum(ghi, p[:3])
                            got = True
        for c in node.get("children", []):
            walk(c, M)
    for r in roots:
        walk(r, np.eye(4))
    return (glo, ghi) if got else None

def anim_names(gltf):
    return [a.get("name","") for a in gltf.get("animations", [])]

# ---------- category inference ----------
PACK_CATEGORY = {
    "kenney_blocky-characters_20": "character",
    "kenney_mini-characters": "character",
    "kenney_platformer-kit": "platformer/aliens+tiles",
    "kenney_hexagon-kit": "hex-floor",
    "kenney_prototype-kit": "greybox/prototype",
    "kenney_furniture-kit": "furniture/interior",
    "kenney_building-kit": "building/exterior",
    "kenney_modular-buildings": "building/modular",
    "kenney_castle-kit": "castle",
    "kenney_graveyard-kit_5.0": "graveyard",
    "kenney_fantasy-town-kit_2.0": "fantasy-town",
    "kenney_factory-kit_3.0": "factory/industrial",
    "kenney_coaster-kit": "coaster/track",
    "kenney_survival-kit": "survival/outdoor",
    "kenney_tower-defense-kit": "tower-defense",
    "kenney_modular-cave-kit_1.0": "cave",
    "kenney_modular-dungeon-kit_1.0": "dungeon",
    "kenney_mini-dungeon": "dungeon/mini",
    "kenney_mini-arcade": "arcade/mini",
    "kenney_mini-arena": "arena/mini",
    "kenney_mini-market": "market/mini",
}
CHAR_TOKENS = ("character","animal","alien","figurine","skeleton","zombie","knight","robot","pet")
FLOOR_TOKENS = ("floor","tile","ground","hexagon","hex-","path","road","street","platform")
INDICATOR_TOKENS = ("indicator","button","lever","arrow","sign","flag","coin")

def subcategory(pack, name):
    n = name.lower()
    if any(t in n for t in CHAR_TOKENS): return "character"
    if any(t in n for t in FLOOR_TOKENS): return "floor/tile"
    if any(t in n for t in INDICATOR_TOKENS): return "indicator/token"
    if "door" in n or "gate" in n: return "door"
    if "wall" in n: return "wall"
    if "stairs" in n or "ladder" in n or "ramp" in n: return "vertical"
    if "column" in n or "pillar" in n: return "structure"
    if "tree" in n or "rock" in n or "plant" in n or "bush" in n or "grass" in n: return "nature"
    return "prop"

# ---------- walk ----------
records = []
errors = []
GRID = 1.0  # nominal Kenney tile unit; footprint reported in raw units too
for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip the optimized dupes + the catalog output
    parts = dirpath.replace(ROOT,"").strip("/").split("/")
    top = parts[0] if parts and parts[0] else "_loose"
    if top in ("optimized", "CATALOG"):
        continue
    for fn in filenames:
        if not fn.lower().endswith(".glb"): continue
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, ROOT)
        pack = top
        try:
            gltf = read_glb_json(full)
            if gltf is None:
                errors.append((rel,"no-json")); continue
            bb = world_aabb(gltf)
            name = os.path.splitext(fn)[0]
            rec = {
                "name": name,
                "pack": pack,
                "path": rel.replace("\\","/"),
                "category": PACK_CATEGORY.get(pack, "misc"),
                "subcategory": subcategory(pack, name),
                "animations": anim_names(gltf),
                "n_meshes": len(gltf.get("meshes", [])),
                "skinned": len(gltf.get("skins", [])) > 0,
            }
            if bb:
                lo, hi = bb
                size = (hi - lo)
                rec["size"] = [round(float(size[0]),3), round(float(size[1]),3), round(float(size[2]),3)]  # x(w) y(h) z(d)
                rec["footprint_xz"] = [round(float(size[0]),3), round(float(size[2]),3)]
            else:
                rec["size"] = None
                rec["footprint_xz"] = None
            records.append(rec)
        except Exception as e:
            errors.append((rel, str(e)[:80]))

records.sort(key=lambda r: (r["pack"], r["subcategory"], r["name"]))

# ---------- write master json ----------
manifest = {
    "generated": "2026-07-12",
    "root": "media/3D_Assets (GitHub) / '3D Assets' (local)",
    "github_base": GITHUB_BASE,
    "total_assets": len(records),
    "total_packs": len(set(r["pack"] for r in records)),
    "note": "size = [width(x), height(y), depth(z)] in native GLB units. footprint_xz = tile footprint on the ground plane.",
    "assets": records,
    "errors": errors,
}
with open(os.path.join(OUT, "catalog.json"), "w") as f:
    json.dump(manifest, f, indent=1)

# ---------- per-pack summary ----------
from collections import defaultdict, Counter
by_pack = defaultdict(list)
for r in records: by_pack[r["pack"]].append(r)

summary_rows = []
for pack in sorted(by_pack):
    rs = by_pack[pack]
    subs = Counter(r["subcategory"] for r in rs)
    n_anim = sum(1 for r in rs if r["animations"])
    summary_rows.append((pack, len(rs), PACK_CATEGORY.get(pack,"misc"), n_anim,
                         ", ".join(f"{k}:{v}" for k,v in subs.most_common())))

with open(os.path.join(OUT, "PACK_SUMMARY.md"), "w") as f:
    f.write("# Kenney Asset Packs — Summary\n\n")
    f.write(f"**{len(records)} assets** across **{len(by_pack)} packs**. GLB units. Generated 2026-07-12.\n\n")
    f.write("| Pack | # | Category | # animated | Subcategories |\n")
    f.write("|---|--:|---|--:|---|\n")
    for pack, n, cat, na, subs in summary_rows:
        f.write(f"| `{pack}` | {n} | {cat} | {na} | {subs} |\n")

# ---------- browsable markdown index (grouped) ----------
with open(os.path.join(OUT, "INDEX.md"), "w") as f:
    f.write("# Asset Catalog — Browsable Index\n\n")
    f.write(f"{len(records)} assets. Columns: name · size(w×h×d) · footprint(x×z) · anim · path.\n\n")
    for pack in sorted(by_pack):
        rs = by_pack[pack]
        f.write(f"\n## {pack}  ({len(rs)})  — {PACK_CATEGORY.get(pack,'misc')}\n\n")
        cur = None
        for r in sorted(rs, key=lambda r:(r['subcategory'], r['name'])):
            if r['subcategory'] != cur:
                cur = r['subcategory']
                f.write(f"\n**{cur}**\n\n")
            sz = r["size"]
            szs = f"{sz[0]}×{sz[1]}×{sz[2]}" if sz else "—"
            fp = r["footprint_xz"]
            fps = f"{fp[0]}×{fp[1]}" if fp else "—"
            a = "🎞" if r["animations"] else ""
            f.write(f"- `{r['name']}` · {szs} · fp {fps} {a}\n")

print("assets:", len(records), "packs:", len(by_pack), "errors:", len(errors))
if errors[:5]: print("sample errors:", errors[:5])

# ---------- audio (NEU 2026-08-04) ----------
import collections
AUDIO_EXT = {".ogg", ".wav", ".mp3"}
audio_folders = {}
for base in ("Audio", "Sounds"):
    aroot = os.path.join(ROOT, base)
    if not os.path.isdir(aroot):
        continue
    for dp, dns, fns in os.walk(aroot):
        auds = [f for f in fns if os.path.splitext(f)[1].lower() in AUDIO_EXT]
        if not auds:
            continue
        rel = os.path.relpath(dp, ROOT)
        fmt = collections.Counter(os.path.splitext(f)[1].lower().lstrip(".") for f in auds)
        audio_folders[rel] = {"count": len(auds), "formats": dict(fmt), "files": sorted(auds)}
audio_cat = {
    "generated": "auto",
    "root": "media/3D_Assets (GitHub) / '3D ASSETS' (local)",
    "total_files": sum(v["count"] for v in audio_folders.values()),
    "total_folders": len(audio_folders),
    "note": "Audio-Index. sfx.json + jukebox.json (in Audio/) sind die Engine-Manifeste fuer travel-audio.js.",
    "folders": audio_folders,
}
with open(os.path.join(OUT, "audio-catalog.json"), "w") as f:
    json.dump(audio_cat, f, indent=1, ensure_ascii=False)
print("audio files:", audio_cat["total_files"], "folders:", audio_cat["total_folders"])

# ---------- 2D (NEU 2026-08-05) ----------
IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".svg"}
d2root = os.path.join(ROOT, "2D + Pixel Assets")
packs2 = {}
if os.path.isdir(d2root):
    for dp, dns, fns in os.walk(d2root):
        dns[:] = [d for d in dns if not d.startswith(".")]
        imgs = [f for f in fns if os.path.splitext(f)[1].lower() in IMG_EXT]
        if not imgs:
            continue
        rel = os.path.relpath(dp, d2root).replace(os.sep, "/")
        pk = rel.split("/")[0]
        packs2.setdefault(pk, {"count": 0, "folders": {}})
        packs2[pk]["count"] += len(imgs)
        packs2[pk]["folders"][rel] = sorted(imgs)
cat2 = {
    "generated": "auto",
    "root": "media/2D_Assets (GitHub) / '2D + Pixel Assets' (local)",
    "github_base": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/2D_Assets/",
    "total_files": sum(p["count"] for p in packs2.values()),
    "total_packs": len(packs2),
    "note": "2D-Index. Bild-Pfad = github_base + folder + '/' + file. .aseprite/.ds_store/.zip ausgeschlossen.",
    "packs": packs2,
}
with open(os.path.join(OUT, "2d-catalog.json"), "w") as f:
    json.dump(cat2, f, indent=1, ensure_ascii=False)
print("2d files:", cat2["total_files"], "packs:", cat2["total_packs"])
