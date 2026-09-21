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
