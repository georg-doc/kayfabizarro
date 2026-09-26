# Claude Design handover · voxel environment combinatorics test · 2026-09-26

**Georg's intent:** find out whether the two voxel packs work as **environment scenes by combination**, in the same way as the existing Environment Atlas scenarios and the dungeon generator (`tools/world_atlas/`).

## Ready assets
- `media/3D_Assets/GLB_voxel_park_pack/<Category>/*.glb`: 90 GLBs, CC BY 4.0, MariaIsMe (credit required).
- The manifest `voxel-park-pack.manifest.json` has per-model category, native bbox and triangle count, for footprint-based placement.
- Conventions:
  - glTF +Y up;
  - origin at the bottom centre;
  - native scale 0.1 per voxel, suggested ×0.5;
  - palette texture must keep **NEAREST** sampling (already set in the GLBs; do not override it with linear filtering or mipmaps).
- `voxel-desert-town` (9 buildings): converted, but **held** until the licence is known. Do not use it before that.

## Ask (for the Design chat, as a sparring partner, not an executor)
1. **Scale grammar:** one KFB scale for voxel props vs. KayKit / Kenney / RKIT (the track is 18 m wide). Show one mixed scene before deciding.
2. **Combination rules:** a park block recipe (hedge edges and corners, dirt or sandbox tiles, furniture, playground, animals) as seeded, no-repeat recipes, the way the dungeon generator composes rooms.
3. **Look fit:** do crisp voxel palettes sit with the KFB elastic-grotesque world, or only as a deliberate "toy district" style zone? Show both options: plain, and seed-palette recoloured (palette PNG swap).
4. Optional look idea from the lighting intake: **gradient fog from the seed palette** (see `LIGHTING_SHADERS_ASSESSMENT.md`).

## Boundaries
- No new world runtime: use the existing World Atlas / generator owners.
- No asset edits in the repo; recolouring happens at runtime.
- Credit the CC BY source on any public page.
- Return with defects first and exactly one next gate.
