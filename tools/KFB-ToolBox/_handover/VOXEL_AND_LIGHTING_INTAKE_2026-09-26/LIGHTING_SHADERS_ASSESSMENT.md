# "3D Lighting Shaders for GameMaker" (Chickens 1.8.3, DragoniteSpam) · assessment for KFB

**Verdict:** keep as an idea source only. **Not uploaded to GitHub.**

## What it is (read from the package, not run)
- A **GameMaker Studio** asset: GML scripts (`cluck_*`) plus GLSL ES shaders (fragment-lit, vertex-lit, unlit). It includes a demo project and a Windows demo exe.
- Features:
  - many point / spot / directional lights;
  - ambient light;
  - specular and normal maps;
  - distance fog;
  - **gradient fog** (fog colour read from a 1-D gradient texture by depth; a rainbow gradient is included);
  - gamma;
  - per-light toon banding ("Cartoon Chickens").

## Why not adopt the package
- **Engine mismatch:** KFB runs on three.js / WebGL. The package is GML-driven with its own uniform layout and cannot be dropped in.
- **three.js already covers most of it:**
  - many lights, spot and point lights;
  - fog;
  - normal and specular maps;
  - `MeshToonMaterial` with a gradient map for banded toon shading.
- **Licence unknown:** there is no licence file in the package, and it is probably a store purchase. Nothing from it goes into the public repo.
- **No asset value:** the demo meshes are GameMaker vertex buffers (`.vbuff`), not reusable models.

## Two ideas worth keeping (they cost almost nothing in three.js)
1. **Gradient fog:** fog colour as a function of depth from a small 1-D palette strip instead of one colour. That gives cartoon sunset, rainbow or seed-palette horizons, and ties directly to KFB seed palettes. In three.js it is an `onBeforeCompile` tweak or a post-pass.
2. **Per-light toon banding** as a look option next to the existing KFB materials (`MeshToonMaterial` + a 3–4 step gradient map), tuned per world zone.

Both belong to the look / world-style owner (Claude Design / WSA). They are **not** a new shader system.
