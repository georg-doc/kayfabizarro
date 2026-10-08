# DONOR NOTE · UltraTex for KFB 3D Texturing / Material Adaptation

Status: **PROMISING DONOR · LAB CANDIDATE · NOT PRODUCTION-READY**  
Date: 2026-10-07  
Scope: cross-project donor pool / KFB Frankensteining / surreal diegetic 3D toy world  
Upstream: `yiboz2001/UltraTex@a726678f3f3631fe2c5e3d1fb4597114784c7a8b`

## Why it fits KFB

UltraTex is a strong candidate for the stage **after geometry selection/generation and before final KFB material acceptance**.

Potential KFB flow:

`3D donor/search or generated mesh → source isolation → geometry/UV/G-buffer preparation → UltraTex image-guided texturing → KFB/Claybound material adaptation → source-isolated review → Registry/Frankensteining consumer`

Useful targets:
- external 3D donors that have good geometry but unsuitable/default materials;
- AI-generated meshes requiring coherent high-resolution appearance;
- KFB Frankensteining / kitbashing where heterogeneous geometry needs one visual language;
- surreal diegetic objects that should look like one coherent toy/clay world rather than a marketplace asset collage.

## Verified upstream facts

Current upstream repo:
- official SIGGRAPH Asia 2026 implementation;
- MIT-licensed code;
- released training + inference code and weights;
- 2048×2048 six-view generation;
- FLUX.1 and FLUX.2-Klein backbones;
- FLUX.2 path supports albedo and a separate metallic/roughness task;
- core efficiency methods: Background Token Dropping + Block-Sparse Attention + Foreground-Aware VAE decoding;
- reported 22.3×–74.6× end-to-end inference speedup over the dense baseline on common dataset samples;
- published efficiency analysis uses one NVIDIA H200.

## Important limitations / current uncertainty

Do **not** treat the reported speedup as desktop-GPU performance evidence.

Current repo does not provide a proven KFB-ready one-command path:
`GLB/FBX → textured GLB`.

The checked-in inference scripts consume prepared multi-view/G-buffer dataset structures, including six-view position/world-normal data and reference imagery.

At the inspected upstream head, no obvious standalone raw-mesh preparation / UV baking / projection-back tool is present in the repository tree.

Therefore the Reddit claim about a dedicated inference script for AI-generated meshes is **not yet accepted as source-proven** for our integration.

Also unresolved:
- absolute inference time and VRAM on RTX-class desktop GPUs;
- whether 24 GB VRAM is sufficient at full 2K;
- preprocessing cost for arbitrary donor meshes;
- UV unwrap / bake-back path;
- texture seam behavior after projection/baking;
- game-ready map packing/output;
- compatibility with KFB clay microdetail/material rules.

## KFB decision

Classify UltraTex as:

`TEXTURE_ADAPTATION_DONOR · LAB CANDIDATE`

not:
- new Asset Registry owner;
- new material runtime owner;
- MVP acceptance requirement;
- replacement for KFB Clay/Surface SSOT.

For future One-Shots / Frankensteining:

`DONOR GEOMETRY → SOURCE ISOLATE → PREP → ULTRATEX TEST → KFB/CLAYBOUND COMPATIBILITY → KEEP / ADAPT / REJECT`

Only use it when a real texture/material gap exists.

## Recommended bounded proof

One future lab test should use exactly:
1. one clean known KFB/KayKit/Kenney mesh as control;
2. one external 3D-search-pool donor;
3. one AI-generated or Frankensteined mesh;
4. one KFB visual reference image / material target per object.

Measure:
- total preprocessing time;
- VRAM peak;
- inference time;
- output consistency across six views;
- seam/bake-back quality;
- albedo quality;
- metallic/roughness usefulness;
- KFB/Claybound visual compatibility;
- game-ready final GLB size and runtime appearance.

Do not integrate into an MVP before this lab proves the full mesh→material→game-ready round trip.

## Planning placement

This extends the existing cross-project donor-pool idea:

`GEOMETRY SOURCE POOL → TEXTURE/MATERIAL ADAPTATION CANDIDATES → KFB VISUAL OWNER → PRODUCT`

It should be available to future WSA planning as an optional donor, not required infrastructure.
