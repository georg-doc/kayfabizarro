# CLAY-B1 · FrizzleBob v5 · calibration round 1 · RETURN · 2026-09-26

**Author:** Claude Coworker (Blender MCP lane).
**Status:** round 1 done. **Look: NOT yet clay.** Stopped after two attempts on the same point, as the rule requires.
**Plan:** PR #228 (Clay Master tiers); PR #231 (C3). **Textures:** ClayDandruff01 (PR #232, CC BY).

## Defects first

1. **It reads as grain, not clay.**
   - From L2 up, the surface looks like fine sandpaper or felt.
   - Coarser settings (L4/L5) give blotchy spots, not soft thumb dents.
   - Cause: the only relief driver with real signal is the Dandruff micro texture. Soft, large clay dents need a *meso height* source. That is exactly what Asset 03 r2 is meant to be, and Georg's look on it is still open.
2. **Head and ears have no UV map** (FB v5 GLB).
   - T1/T2 therefore use rest-pose coordinates (Generated × rest bbox, box projection). These do not swim under the armature.
   - A runtime GLB (T3) needs UVs or a bake. Adding a UV layer is a data change: Georg decides.
3. **The low-poly body shows facets** (body 211 verts, arms 252, legs 186; head 6274).
   - Clay reads through soft form first. A subdivision/smooth pass on a copy would change the triangle budget: Georg decides.
4. **Round 1 had lighting drift:** AgX plus strong lights washed the yellow out to cream. Fixed: Standard view transform (parity with three.js sRGB) and half-energy lights.

## What was built

- **Scene:** `CLAY_B1_FB_v5`, as a separate scene. Georg's workbench is untouched and unsaved.
  - Saved alone as Dropbox `CLAY-B1/KFB_CLAY_B1_FB_v5_r1.blend` (via `bpy.data.libraries.write`).
- **Node group `KFB_ClayMaster` v0.1** (`build_clay_master.py`, md5 `8f3fc683…`):
  - colour stays FB's own `FB_Yellow`; clay only modulates it (mottle ±, soft AO cavity, roughness 0.72–0.90);
  - relief is a **Bump chain**: meso noise → micro texture height. No Normal Map node, because tangent space is invalid without UVs;
  - per-object seed and rest bbox are stored as object properties (`kfb_clay_seed`, `kfb_clay_bbox`).
- **Only the skin zone** (`FB_Yellow`) is replaced by `FB_Yellow_CLAY`. Eyes, brows, nose and mouth are unchanged.
- **Renders:**
  - `fbv5_clay_ladder_T1.png`: original, L0 start, L1 subtle, L2 medium, L3 strong;
  - `fbv5_clay_ladder_T1_r2.png`: original, L1, L2, L4/L5 (coarser soft dents).
  - All renders use the same camera and light; Cycles T1 renders in 1.5 s at 560².

## Not done yet

- Swim test (two poses, marker decal).
- T3 bake/GLB.
- EEVEE ladder: only one T2 frame exists.

## Exactly one next gate

**Georg:**
1. Pick the relief direction:
   - (a) use Asset 03 r2 as the meso dent map (needs his look OK);
   - (b) a procedural dent concept (thumb presses) re-conceived in Blender;
   - (c) stay subtle at L1.
2. Say yes or no to a subdivision/smooth pass on a copy of the body parts.
