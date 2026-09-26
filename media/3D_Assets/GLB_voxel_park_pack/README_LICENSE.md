# Voxel Park Pack · KFB GLB conversion

**Source:** "3D Voxel Park Pack" by **MariaIsMe** (itch.io), licensed **CC BY 4.0**: https://creativecommons.org/licenses/by/4.0/
**Attribution (required wherever it is shown or shipped):** "3D Voxel Park Pack" by MariaIsMe, CC BY 4.0. Converted to GLB for KFB (origin moved, sampling set to nearest; geometry and palette unchanged).

## What was converted (Claude Coworker, Blender 5.2.2, 26.09.2026)
- The 90 MagicaVoxel OBJ + MTL + palette PNG files became **90 GLBs**, one per model, sorted by the original category folders (the source spells `Park Foilage` that way; the name is kept).
- **Palette texture sampling is NEAREST** (Blender "Closest"), so the voxel colours stay crisp. With linear filtering the palette colours bleed.
- **Origin** is at the bottom centre of every model (x/y centre, lowest point at 0).
- Material: roughness 1, no specular. Geometry and palette are unchanged.
- **Scale is native** (MagicaVoxel export: 0.1 unit per voxel; a bench is 3.2 units long). The suggested KFB scale is **0.5** (bench ≈ 1.6 m). The scene decides; it is not baked in.
- `voxel-park-pack.manifest.json` lists every model with its category, file, source OBJ, native bbox, triangle count and size.
- Script: `convert_voxel_packs.py` (re-runnable, additive).

## Counts
Animals 10 · Bikes 8 · Foliage 27 · Furnishings 14 · Picnic 11 · Playground 20 = **90 GLBs, ≈ 13 MB**.

## Not included here
- `voxel-desert-town` (9 buildings, converted locally): **no licence file** in its zips, so it is held back until the source and licence are known.
- The original OBJ / MTL / PNG sources stay in Georg's Dropbox (`BLENDER MCP/_inbox/3D Voxel Park Pack`).
