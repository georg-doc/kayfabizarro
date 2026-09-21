# TEST REPORT · Card Zone v3 / Hex Project Islands planning package

Status: **PLANNING / ROUTING SOURCE CHECKS PASS · RUNTIME NOT STARTED**  
Date: 2026-09-21

## Checks run

Routing/source package checks on planning branch after the second checkpoint:

**11/11 PASS**

1. PASS · old Fluid/Card/Voxel consolidation contains current Card Zone v3 override
2. PASS · central Chat router contains Card Zone v3 recovery entry
3. PASS · REGISTRY.json parses
4. PASS · registry entry is unique
5. PASS · additive changelog contains recovery decision
6. PASS · KFB Hub contains H0 current todo
7. PASS · KFB Hub contains Card Zone v3 briefing
8. PASS · ToolBox source section contains Card Zone v3 card
9. PASS · misleading old “VERIFIED 23-FILE INTAKE” ToolBox card removed from current router
10. PASS · KFB Hub inline JavaScript parses
11. PASS · ToolBox inline JavaScript parses

## Source recon facts

- working Card Zone v2 source found and pinned in SOURCE.json;
- Bench v1 and v1.1 located;
- v1.1 shader post-mortem read and classified as partial/local;
- exact two KayKit Hex registry shards read;
- existing `hex-grid.js / TILE_EDGES` read;
- Babel/Hex failure post-mortems read;
- Platformer recovery + mental model read;
- Resident module handoff read;
- Combat A2 spindle/skydome files located in the Combat repository;
- SKY-01 planning brief located in PR #128 lineage.

## Not run

- Card Zone v2 browser parity;
- Card Zone v3 runtime;
- Hex source isolation render;
- movement/jump tests;
- Claude Design visual gate;
- public Stage;
- mobile runtime.

These are **NOT_TESTED**, not implied by the planning PASS.

## Current gate

H0 only:
browser-prove the working Card Zone v2 parity/source baseline before any v3 geometry or generator work.


---

## H0 checkpoint · 2026-09-22

Active draft PR: **#161**  
Branch: `chatgpt-web/card-zone-v3-h0-parity-2026-09-21`

Added `FEATURE_PARITY_V2.json` and the source-locked fluid handoff:
`tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/`.

Fluid source extraction checks: **10/10 PASS**:
- donor blob pin;
- source palette 5/5;
- Vertex GLSL verbatim 13 source lines;
- Fragment GLSL verbatim 31 source lines;
- two texture refs;
- texture color-space/wrapping/anisotropy contract;
- ShaderMaterial flags;
- elapsed-seconds time update;
- source foam state unchanged;
- no Bench-only fluid-kind extension.

H0 feature matrix:
- 11 required feature rows: **SOURCE_VERIFIED**
- browser parity: **NOT_RUN**
- required screenshots: **0/4**
- browser console/runtime proof: **NOT_RUN**
- H1 allowed: **NO**

`game-dev` is unavailable in this runtime. This checkpoint does not require sealed Game Development Studio evidence, so repository-native checks remain authoritative.

No Stage or Live publication was attempted.
