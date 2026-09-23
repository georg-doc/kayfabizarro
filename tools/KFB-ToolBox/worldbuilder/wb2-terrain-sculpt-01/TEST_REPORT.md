# WB2-TERRAIN-SCULPT-01 · Test Report · 2026-09-23

Status: **LOCAL CHAT REVIEW CANDIDATE · NOT PUBLIC · HUMAN TERRAIN-SHAPE REVIEW PENDING**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23`  
Stacked Draft PR: **#190**  
Base branch: `chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

## Candidate files

- canonical Source: `WB2_TERRAIN_SCULPT_01_SOURCE.html`
- zero-install Review: `WB2_TERRAIN_SCULPT_01_REVIEW.html`
- sculpt module: `terrain-sculpt.js`

Current verified blobs before this report:
- Source: `188d5b46e34407c3800edeb2b896d3cf0cf93925`
- Review: `cee8dfa49c4a67d3f3a91ec75adf5866f3154c83`
- terrain-sculpt: `182f7c42b709a00547a16cfe0040d5d636bdb680`
- shared ToolBox edit layer: `c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

## Accepted foundation retained

WB2 is stacked on the accepted WB1/R2 foundation:

- WB1 terrain + Resident scene foundation: Georg HUMAN PASS;
- shared object-attached inline editor R2: Georg HUMAN PASS;
- object editing remains owned by `tools/KFB-ToolBox/lib/edit-layer.js`;
- R3 uniform `−/+` size remains optional / non-blocking.

Accepted WB1 files are not modified by WB2. WB2 adds a new folder:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/`

## Implemented WB2 scope

- continuous seeded procedural heightfield remains the base;
- additive sculpt layer stored as compact deterministic strokes;
- Object edit / Raise / Lower modes;
- brush radius;
- strength per dab;
- visible brush ring;
- drag strokes;
- true C2 quintic radial falloff;
- Undo last stroke;
- Clear sculpt layer;
- Save / Reload sculpt strokes;
- vertex-normal recompute;
- terrain color refresh after live dabs;
- terrain-only ray hit;
- exclusive sculpt pointer ownership via `stopImmediatePropagation()`;
- shared Object Edit layer disabled only while Sculpt mode owns the gesture;
- no voxel / hex / tile / CSG / marching-cubes terrain.

Persistence model:
`finalHeight(x,z) = baseHeight(x,z) + sculptDelta(x,z)`.

## Pre-review implementation corrections

Three internal corrections were made before human review:

1. **Brush center distance**
   - corrected distance from a four-component `hypot` to the actual X/Z difference from the brush center.

2. **Pointer ownership**
   - sculpt drag now uses `stopImmediatePropagation()` so shared object picking / Orbit controls do not receive the same sculpt gesture on the same canvas.

3. **Falloff continuity**
   - replaced the initial C1 kernel with a true quintic C2 compact falloff matching the documented `smooth-c2` contract.

These are pre-review implementation corrections, not failed human repair passes.

## Tests actually run

### Sculpt math + geometry
**24/24 PASS**

Covers:
- center / edge / outside brush weights;
- true C2 edge behavior;
- Raise / Lower sign;
- translated brush centers;
- stroke spacing;
- stroke replay;
- geometry mutation;
- edge/outside vertices unchanged;
- position buffer dirty flag;
- inverse Raise/Lower roundtrip at the same center.

### Source + Review contract
**33/33 PASS**

Covers:
- Source module syntax;
- WB2 identity;
- canonical local sculpt import;
- shared ToolBox edit-layer import;
- Object / Raise / Lower UI;
- radius / strength;
- Undo / Clear;
- persisted `terrain.sculpt`;
- base + sculpt height evaluation;
- terrain-only ray;
- exclusive pointer ownership;
- object editor disabled/restored around Sculpt mode;
- visible brush footprint;
- live geometry dabs;
- normal recompute;
- Undo / Clear implementations;
- reload sculpt normalization;
- embedded Raise / Lower / Save-Reload / Undo selftest assertions;
- shared editor still owns `scaleBy`;
- no voxel / marching-cubes / CSG implementation;
- Review module syntax;
- exact bundled edit-layer module;
- exact bundled terrain-sculpt module;
- current source/module blob markers;
- no local module imports in the standalone Review;
- explicit local/not-public marker.

### Exact pinned runtime sources
**4/4 PASS**

- Caveman actor @ pinned asset commit;
- Caveman source texture @ pinned asset commit;
- Boulder prop @ pinned asset commit;
- `Rig_Medium_CombatMelee.glb` @ pinned animation commit.

### Embedded browser self-test
**28 assertions prepared / 0 executed**

Includes:
- source actor + clip + explicit texture;
- source prop;
- scene unlock;
- continuous terrain;
- shared edit layer;
- Character Y;
- terrain variation;
- Raise;
- C2 brush edge;
- Lower;
- Clear-to-base;
- sculpt Save/Reload;
- sculpt Undo;
- object mini-menu;
- uniform size helper;
- free Scale;
- shared Drop;
- World/Local;
- object transform Save/Reload;
- Character Y Save/Reload;
- reference-only scene document.

Automated browser runtime: **0**  
Screenshots: **0**

No browser PASS, visual PASS, Cloudflare PASS or Live claim is made.

## Human review target

Open `WB2_TERRAIN_SCULPT_01_REVIEW.html` directly from ChatGPT.

Review only:

1. Source actor and Source prop still load correctly;
2. enter Scene editor;
3. choose **Raise** and drag a low hill;
4. choose **Lower** and drag a shallow depression;
5. vary Radius and Strength;
6. orbit close to the result and inspect for cracks, spikes, hard stamp edges or faceted artifacts;
7. **Undo stroke**;
8. **Clear sculpt** and confirm the procedural base returns;
9. make a sculpt, Save, alter/clear it, Reload and confirm the saved terrain returns;
10. switch back to **Object edit** and confirm the accepted inline editor still works.

## Publication

Cloudflare: **HOLD · NOT PUBLISHED**  
Direct Stage URL: **none for this gate**  
Live: **not promoted**  
Merge: **not requested**

## One next gate

**Georg human Chat-HTML review of WB2-TERRAIN-SCULPT-01 terrain shape and interaction.**

STOP before Smooth / Flatten / material painting / large-world optimization / Claude Design UI cleanup.
