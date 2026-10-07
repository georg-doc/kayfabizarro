# KFB Hybrid Baked Clay / Texture Architecture · PREP · 2026-10-07

> **CURRENT GEORG STEERING:** Read `skills/chat/KFB_SURFACE_MATERIAL_LANGUAGE_STEERING_2026-10-07.md` first. Clay is no longer the exclusive technical target; it is one visual profile inside a broader KFB Surface / Material Language. The lab must compare Clay, Hybrid, Toon/Cel and Procedural candidates and may select any coherent, performant winner.

Status: **ARCHITECTURE PREP · LAB REQUIRED · NO RUNTIME CHANGE**  
Owner: **KFB Clay presentation / receiving World**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/hybrid-baked-clay-texture-architecture-2026-10-07`  
Base: `main@619c687fc736a129796c904b6523c630aee85fba`

## Question

Can we move more of the KFB clay/material look from an expensive runtime fragment-shader setup into an offline or semi-offline authoring/baking stage, including procedurally generated buildings and OSM-derived city slices, while preserving the current KFB Clay SSOT and improving runtime performance?

## Current source-backed reason to investigate

Binding Open World Clay canon already allows:
- expensive static softening to be prebaked/offline;
- instanced families to share geometry/material;
- microdetail/fingerprints primarily in the near band;
- distance/pixel-footprint fade for microdetail.

The current Visual Terrain Recovery Lab further found:
- **the expensive item was the terrain Clay fragment shader, not terrain geometry**;
- current terrain-scale Clay LOD was not triggering usefully;
- near/mid/far material paths and simplification are the right direction.

Therefore a baked/hybrid material architecture is a source-consistent optimization direction, not a new style owner.

## Core proposal

Split the KFB clay look into two layers:

### A. Offline / baked appearance layer

Bake or pre-author:
- broad albedo/color variation;
- low- and medium-frequency clay massing/handmade variation;
- stable dents/tool marks where appropriate;
- roughness / metallic (normally low metallic for clay);
- low-frequency normal/height information;
- façade/material variation for procedural buildings;
- hero landmark texture treatment;
- optional style adaptation from tools such as UltraTex.

This layer should be deterministic and reusable by asset family / building recipe / district recipe, not regenerated every frame.

### B. Cheap runtime clay shell

Keep runtime work minimal:
- palette/tint response;
- lightweight roughness variation;
- optional very subtle near-camera micro-normal;
- distance-based microdetail fade;
- contact/shadow integration;
- environment/light response;
- owner-approved transition blending.

Avoid a heavy procedural fragment path over every terrain/building pixel when the same visual information can be baked.

## Procedural buildings

Do **not** run a generative texturing model independently on every generated building.

Prefer a family-level material system:
- deterministic building recipe / stable ID;
- façade archetype;
- roof archetype;
- district/style family;
- one of a bounded set of baked/generated material atlases;
- seed-based variation via UV offsets / palette parameters / decal masks;
- optional hero-building override.

Possible hierarchy:

`BuildingRecipe → MaterialFamily → baked atlas/array → cheap per-instance variation`

This keeps thousands of procedural buildings balanced, cacheable and instance-friendly.

UltraTex-like generation is most useful for:
- creating new material-family exemplars;
- irregular/hero structures;
- Frankensteined buildings;
- selected façade families;
not as a per-building runtime/generation dependency.

## OSM slices

OSM City Lab already owns deterministic city geometry/style export and preserves semantic IDs/tags.

For city-scale scenes:
- do not texture thousands of OSM buildings individually with diffusion;
- cluster buildings by semantic/archetype/district/material family;
- generate/bake a small controlled library of façade/roof/clay atlases;
- map those families deterministically by OSM identity/tags;
- reserve expensive image-guided texture generation for hero landmarks and visually important foreground objects.

Suggested chain:

`OSM semantic geometry → façade/roof/material family assignment → baked KFB atlas/texture array → cheap runtime material → near-only clay microdetail`

For the Dom/HBF/bridge class of landmarks, a higher-cost hero texture adaptation path may be justified.

## UltraTex role

UltraTex is one possible **offline texture-authoring donor**, not the architecture itself.

Potential use:
- adapt external/generative geometry into a coherent KFB surface language;
- create 2K multi-view texture exemplars;
- output albedo + metallic/roughness candidates;
- support hero/irregular/Frankensteined objects.

Current limits:
- desktop RTX performance unproven;
- current repo requires prepared six-view/G-buffer inputs;
- raw GLB → textured GLB/bake-back is not yet proven;
- therefore it must be lab-tested before product use.

## Performance target architecture

The important runtime metric is not “shader sophistication” but:
- GPU frame time;
- fragment cost;
- texture bandwidth;
- draw calls;
- material count;
- VRAM footprint;
- transition cost;
- near/mid/far LOD stability.

Use:
- KTX2/Basis or equivalent compressed game-ready texture delivery where feasible;
- mipmaps;
- texture atlases / arrays for shared families;
- material instancing;
- far LOD with lower-resolution maps / no micro-normal;
- bounded anisotropy;
- no unique 2K texture per ordinary building.

## Clay appearance should be frequency-split

Suggested split:

- **low frequency:** geometry/massing + baked albedo/roughness;
- **mid frequency:** baked normal/height/tool marks;
- **high frequency:** optional runtime near-band fingerprints/grain only;
- **contact:** runtime shadows/AO/contact owner;
- **lighting:** environment owner.

This prevents one shader from owning every visual frequency.

## Lab proof before architecture adoption

A bounded lab should compare the same scene across at least four material strategies:

1. current K2/v10-style runtime Clay path;
2. baked-heavy hybrid path;
3. pure/mostly Toon/Cel path;
4. procedural mathematical/material-family path;
5. optional cheap matcap/painted-toy variant when useful.

Test objects:
- one procedural KayKit/KFB building family;
- one OSM block / district sample;
- one hero landmark;
- one external/Frankensteined donor if available.

Measure:
- fixed-camera visual similarity to KFB Golden;
- FPS + GPU frame time;
- material/draw-call count;
- VRAM;
- texture memory;
- near/mid/far appearance;
- repetition artifacts;
- contact/shadow consistency;
- load time;
- city-scale scalability.

The winning path may be Clay-like, Hybrid, Toon/Cel, Procedural or Matcap/Painted-Toy. It wins only if the **whole scene** reads as one deliberate KFB world and materially improves or preserves actual runtime cost.

## Important boundaries

This does not:
- replace the KFB Clay SSOT / Golden;
- create a second material runtime owner;
- modify OSM geometry ownership;
- make UltraTex mandatory;
- add a new current Island MVP REQUIRED row;
- justify unique textures for every procedural object;
- bypass source isolation or provenance.

## Planning conclusion

The preferred research direction is:

`KFB SURFACE / MATERIAL LANGUAGE → optional offline/baked authoring → shared family parameters/textures → cheap runtime stylized shell → distance LOD`

rather than:

`EVERY SURFACE → ONE HEAVY HISTORICAL CLAY FRAGMENT SHADER`.

## One next gate

**BOUNDED KFB SURFACE-LANGUAGE LAB · CLAY vs HYBRID vs TOON/CEL vs PROCEDURAL**
