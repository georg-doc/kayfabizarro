# Reproduce the Hex Blender bench

Environment: Blender 5.0.1 as the Python module `bpy` (headless, EEVEE), node with three 0.160.0, Python 3.11 with numpy and Pillow.

1. Check out `georg-doc/kayfabizarro` at `f4f3fdbb0925653c8c76d21313416fa49a6ffb3a` to `/tmp/hex/repo` (sparse: the two KayKit packs, `clay_floor_001`, the P1/P2 folders, `tools/world_atlas/source/lib/hex-grid.js`, the handoff folder).
2. Inventory: `inv.py` (all 447 models) → `gen.py` writes `asset_inventory.json`.
3. Source isolation: `s1.py` (five donors), `ramp.py` (slope heights), `var.py` (colourways), `node dump.mjs` in a folder with `node_modules/three` → `proc_geoms.json`, then `s1p.py` / `s1s.py`.
4. Families and seeds: `thumbs.py`, `bld.py`, `gen2.py`, `gen3.py`.
5. Material: `pack.py` (rebuilds the Global Clay Lite 512² pack from the pinned maps; not committed), `clay.py` (node approximation), `bench.py`.
6. Scenelets: `recipes.py` + `scen.py`, run `runscen.py` → `SCENELET_*.blend` and raw JSON; `gen4.py` writes the recipe, socket, measurement and material JSON; `s3clay.py`, `sheets.py` make the evidence.

`bl.py` holds the shared helpers. The `.blend` files reference images by path (the KayKit atlas in the checkout); nothing is packed.
