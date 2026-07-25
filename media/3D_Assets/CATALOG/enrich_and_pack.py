#!/usr/bin/env python3
"""Enrich catalog.json with preview paths + Ease/KFB/MED fit scores,
emit catalog.js (window.CATALOG=...) for the offline HTML browser."""
import os, json

ROOT = "/sessions/gracious-upbeat-bohr/mnt/3D TableDiorama KFB/3D Assets"
CAT  = os.path.join(ROOT, "CATALOG")
cat  = json.load(open(os.path.join(CAT, "catalog.json")))

# ---- preview resolution (paths relative to 3D Assets root) ----
def resolve_preview(pack, name):
    cands = []
    if pack == "kenney_furniture-kit":
        for suf in ("_SE","_SW","_NE","_NW"):
            cands.append(f"{pack}/Isometric/{name}{suf}.png")
    cands.append(f"{pack}/Previews/{name}.png")
    for suf in ("_SE","_SW","_NE","_NW"):          # schoene 3/4-Ansicht ZUERST
        cands.append(f"{pack}/Isometric/{name}{suf}.png")
    cands.append(f"{pack}/Isometric/{name}.png")
    cands.append(f"{pack}/Side/{name}.png")        # flacher Seitenriss nur als Notnagel
    cands.append(f"{pack}/Preview.png")           # pack-level fallback
    for c in cands:
        if os.path.exists(os.path.join(ROOT, c)):
            return c
    return None

# ---- fit scoring ----
# base per-pack {ease, kfb, med} 1..5. ease=kitbash friendliness,
# kfb=warm carny/office/dystopia fit, med=clinical/MedKayfab fit.
PACK_SCORES = {
    "kenney_platformer-kit":        (5, 5, 3),  # the aliens ARE the crits
    "kenney_blocky-characters_20":  (5, 4, 4),  # cube chars, 27 anims
    "kenney_mini-characters":       (5, 4, 4),
    "kenney_hexagon-kit":           (5, 4, 4),  # D6 path board
    "kenney_prototype-kit":         (5, 4, 4),  # greybox + tokens/indicators
    "kenney_furniture-kit":         (4, 4, 5),  # office/clinic interior
    "kenney_factory-kit_3.0":       (4, 4, 3),  # industrial dystopia
    "kenney_graveyard-kit_5.0":     (4, 4, 1),  # dark satire
    "kenney_building-kit":          (4, 3, 3),
    "kenney_modular-buildings":     (4, 3, 3),
    "kenney_modular-dungeon-kit_1.0":(4, 3, 2),
    "kenney_modular-cave-kit_1.0":  (4, 2, 2),
    "kenney_mini-dungeon":          (4, 3, 2),
    "kenney_mini-market":           (4, 3, 3),  # pharmacy-ish
    "kenney_mini-arcade":           (4, 3, 2),
    "kenney_mini-arena":            (4, 3, 2),
    "kenney_fantasy-town-kit_2.0":  (3, 3, 2),
    "kenney_castle-kit":            (3, 3, 1),
    "kenney_tower-defense-kit":     (4, 2, 2),
    "kenney_coaster-kit":           (3, 2, 1),
    "kenney_survival-kit":          (4, 3, 2),
    "_loose":                       (2, 3, 3),  # scale-normalize needed
}
DEFAULT = (3, 3, 2)

def score_asset(r):
    ease, kfb, med = PACK_SCORES.get(r["pack"], DEFAULT)
    sub = r["subcategory"]; anim = bool(r["animations"])
    # nudges
    if anim and sub == "character":
        ease = min(5, ease)          # animated avatars are easy
        kfb = min(5, kfb + 0); med = min(5, med + 1)
    if sub in ("floor/tile",):
        ease = min(5, ease + 1)      # tiles snap trivially
    if sub in ("indicator/token",):
        kfb = min(5, kfb + 1); med = min(5, med + 1)  # game tokens fit both
    if sub == "prop" and r["pack"] == "kenney_furniture-kit":
        med = 5
    if r["pack"] == "_loose":
        # table clutter props (scissors, knife, dice, bottle) fit the carny desk
        if any(k in r["name"].lower() for k in ("scissor","knife","dice","bottle","book","paper","bag")):
            kfb = 4
    return {"ease": ease, "kfb": kfb, "med": med}

npre = 0
for r in cat["assets"]:
    p = resolve_preview(r["pack"], r["name"])
    r["preview"] = p
    if p and "/Previews/" in p or (p and "/Isometric/" in p): npre += 1
    r["scores"] = score_asset(r)

cat["scoring_note"] = "scores.ease/kfb/med are heuristic 1-5 defaults; user star-ratings in the browser override per asset (localStorage)."
json.dump(cat, open(os.path.join(CAT, "catalog.json"), "w"), indent=1)

# emit catalog.js (avoids file:// fetch CORS; <script src> works offline)
with open(os.path.join(CAT, "catalog.js"), "w") as f:
    f.write("window.CATALOG = ")
    json.dump(cat, f, separators=(",", ":"))
    f.write(";")

# quick preview-coverage report
per_model = sum(1 for r in cat["assets"] if r["preview"] and ("/Previews/" in r["preview"] or "/Isometric/" in r["preview"]))
pack_fallback = sum(1 for r in cat["assets"] if r["preview"] and r["preview"].endswith("/Preview.png"))
none = sum(1 for r in cat["assets"] if not r["preview"])
print(f"assets={len(cat['assets'])} per-model-preview={per_model} pack-fallback={pack_fallback} no-preview={none}")
print("catalog.js bytes:", os.path.getsize(os.path.join(CAT, "catalog.js")))
