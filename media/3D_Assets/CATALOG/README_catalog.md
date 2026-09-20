# 3D Asset Catalog — KFB / Crit-Engine

Machine + human index over all GLB packs in `3D Assets/`.
Generated 2026-07-12. **1,825 assets · 22 packs · 0 parse errors.**

## Files
- **`catalog.json`** — master manifest. One record per GLB: `name, pack, path, category, subcategory, size [w,h,d], footprint_xz, animations[], n_meshes, skinned`. This is the machine source for scene-JSON / a pickable browser.
- **`INDEX.md`** — browsable, grouped by pack → subcategory, with size + footprint + 🎞 anim flag.
- **`PACK_SUMMARY.md`** — one row per pack: count, category, # animated, subcategory breakdown.

## Notes on the data
- `size` = `[width(x), height(y), depth(z)]` in **native GLB units** (world-space AABB, node transforms applied).
- `footprint_xz` = ground-plane tile footprint → the number that matters for grid placement.
- **Scale is NOT uniform across sources.** Kenney kits are ~1 unit = 1 tile; loose non-Kenney GLBs vary wildly (e.g. `arunangshubanerjee-dice` = 0.008u). This confirms the normalization-layer need before kit-bashing across packs.
- Packs with 0 GLBs (card kit, board-game-icons, emotes, googly-eyes, interface-sounds, iso-bases, yellow-paint) are 2D/audio/OBJ-only → intentionally excluded.

## KFB use-case pointers (confirmed in data)
- **Pixel-crits as 3D** → `kenney_platformer-kit`: `character-oobi/oodi/ooli/oopi/oozi`, ~0.87×0.9×0.6u, **25 anim clips each**. The aliens 1:1.
- **Cube/block characters** (when not showing animals) → `kenney_blocky-characters_20`: 18 chars, **27 anim clips each**, 1.6×2.7×0.8u.
- **Cube Pets** (player tokens / Würfel-Rhyme) → not in this folder yet; see `../../NOTES_crit_look_layers.md` + `FABLE5_REHOME_v3/SPRINT_07`.
- **D6 story-mode paths** → `kenney_hexagon-kit`: 16 floor/tile path pieces incl. `path-intersectionA–H`, corners, crossing, start/end. 6 hex sides ↔ D6 faces = branch/exit logic.
- **Office-dystopia table dressing** → `kenney_furniture-kit` (140, interior/office) + `kenney_prototype-kit` (145, greybox + indicators/tokens).

## Home note
Assets currently live in the **3D Table WS**. Georg flagged they belong better in a **Crit-Engine WS**. This catalog travels with the assets — if the folder moves, regenerate paths (they're relative to `3D Assets/`) or just move `CATALOG/` alongside.

## Regenerate
`python3 build_catalog.py` (in outputs). Idempotent; overwrites `catalog.json`, `INDEX.md`, `PACK_SUMMARY.md`.
