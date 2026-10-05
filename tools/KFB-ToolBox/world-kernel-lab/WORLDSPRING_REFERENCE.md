# Worldspring → KFB Architecture Reference

Status: **READ-ONLY EXTERNAL REFERENCE · NO CODE DONATION**
Reference pin: `Dun-John/worldspring@55684aa2700b9f4076fddea338d596bfb9bbf14a`
Reviewed: 2026-10-05

## Rights classification

Worldspring is not an open-source donor for KFB.

Observed source facts at the pinned revision:
- `README.md`: © 2026 Dun-John; all rights reserved; source is published to read; no license is granted to copy, modify or redistribute it.
- workspace `Cargo.toml`: `license = "UNLICENSED"`.

KFB classification:
- architecture reference: **YES**;
- behavior reference: **YES**;
- public algorithm/literature lead: **YES**;
- source donor/transplant: **NO**;
- copied implementation: **FORBIDDEN** unless separate permission/license is later obtained.

## High-value architecture patterns

### 1. Pure deterministic generation

Worldspring documents generator output as a pure function of `WorldFile` + job key. KFB should adopt the principle, not the code.

KFB target:
`KfbWorldRecipe + generatorVersion + hierarchicalKey → deterministic generated result`.

Benefits:
- reproducible bugs;
- compact save files;
- reliable agent/test fixtures;
- stable world biography;
- no need to precompute all possible detail.

### 2. Generator version is part of world identity

Worldspring preserves older generator builds and asks whether an older world should open as made or upgrade.

KFB target contract:
- `worldId`;
- `rootSeed`;
- `generatorVersion`;
- `recipeVersion`;
- `sourceManifestVersion`;
- authored edit layer with its originating generator version.

A generator upgrade never silently rewrites an authored world.

### 3. Hierarchical LOD with stable parent form

Worldspring refines terrain from a parent representation and adds detail only below the wavelength that the parent could represent. Samples are tied to a global coordinate system to keep seams stable.

KFB target principle:
- macro shape must remain recognisable while approaching;
- finer procedural bands may add clay/terrain detail;
- landmark identity and authored anchors are independent of LOD;
- a lower-resolution representation remains visible until finer work is ready.

POC 01 demonstrates the identity/detail split with KFB-owned value-noise bands. It is not a Worldspring terrain port.

### 4. Worker-based generation

Worldspring uses a coordinator/generator-worker architecture and transfers typed-array buffers back to the renderer.

KFB target:
- generation off main thread where useful;
- renderer/player input owner stays on main thread;
- transferable data rather than repeated object serialization;
- later: priority by visible/near-player demand.

POC 01 uses one module Worker and a transferable `Float32Array`.

### 5. Frame-budgeted presentation

Worldspring explicitly limits new texture uploads per frame because GPU upload stalls can dominate integrated GPUs.

KFB target later:
- world-generation budget;
- asset-decode budget;
- GPU upload/instantiation budget;
- visible fallback until upgrade arrives;
- performance decisions driven by measurement, not assumed Rust/WASM need.

Not implemented in POC 01 beyond latest-request selection and coarse-fallback retention.

### 6. Procedural base + authored edits

This maps strongly to World Studio/God Mode.

KFB target:
`generated connective tissue + canonical KFB anchors + authored object/sculpt edits + resident/world memory`.

Generated content should be regenerable. Authored content should remain explicit and reviewable.

### 7. Fractal semantic resolution

Worldspring's world → settlement → street → interior → underground → battle grid suggests a useful scale architecture.

KFB equivalent:
`cosmos → world/island → biome/zone → landmark/activity → building/interior → Resident/object → Card/memory`.

Critical KFB difference: procedural generation builds connective tissue. Authored KFB/KayKit/Resident/Card identity is never replaced by generic generated content.

## Algorithm leads for later independent research

These are research topics, not approved implementation imports:
- plate/Voronoi macro terrain concepts;
- stream-power erosion literature (Braun & Willett and related work);
- priority-flood basin handling;
- orographic precipitation / rain-shadow models;
- A* route finding with steep grade penalties;
- finer-grid rerouting under hard grade limits for switchbacks;
- settlement Voronoi/ward concepts;
- graph-first dungeon/interior planning.

Any later KFB implementation must cite independent/public algorithm sources and be written independently.

## KFB fit with current product rules

The reference is compatible with current KFB bigger-picture intent when used as infrastructure:
- procedural connective tissue, authored identity;
- living toy worlds;
- deterministic recipes;
- revisitable worlds with memory;
- one receiving runtime owner;
- PULL, DON'T GATE.

It is incompatible if used to justify:
- a second WorldBuilder;
- replacement terrain/runtime during PR #348's current human gate;
- generic fantasy city/world content replacing KFB sources;
- premature whole-cosmos streaming;
- a Rust/WASM rewrite without profiling evidence.

## Proposed KFB research sequence

1. **POC 01 · identity / LOD / worker / edits** — current Site.
2. **POC 02 · tiled global coordinates / seam test / request priority**.
3. **POC 03 · frame-budgeted tile + asset instantiation**.
4. **POC 04 · source-backed KFB anchor fixture** using copies of recipe facts, not WB2 runtime ownership.
5. **POC 05 · independently implemented route-on-terrain experiment**.
6. **PROFILE GATE** — only then decide whether CPU-heavy kernels justify WASM/Rust.
7. **RECEIVER GATE** — only WB2 can accept a proven mechanism into the real world runtime.
