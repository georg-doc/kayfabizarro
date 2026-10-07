# KFB Open World · Post-Freeze Terrain Ownership Guard · 2026-10-07

Status: **BINDING RECOVERY GUARD · APPLY TO THE NEXT RESULT AFTER THE CURRENT RUNNING FREEZE**
Owner: **KFB Open World / Architecture Freeze**
Current situation: **Coworker Architecture Freeze is already running and cannot be interrupted from this chat.**

## 0 · Why this guard exists

A binding earlier WorldBuilder decision already established:

**Continuous procedural terrain = PRIMARY macro world surface.**

**Hex = OPTIONAL semantic / local kit.**

Source:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`

That source explicitly says:
- do not treat visible Hex tiles as the macro world surface;
- continuous terrain owns visible ground shape/support height;
- Hex may be used for authored local zones, semantic cells, tactical/boardgame locations, modular structures and Dungeon/Hex kits;
- Voxel remains local/special-purpose.

The current Coworker handover describes the receiving core as an “endless seeded Hex world”. Because the exact current source is not yet available under `KFB_OpenWorld/` on GitHub, it is presently unknown whether “Hex” means only spatial/semantic partitioning or whether Hex actually owns the visible macro terrain geometry.

The running Freeze may finish before this conflict can be communicated to that process. Therefore:

**Its output must not automatically become terrain canon.**

## 1 · Post-Freeze intake rule

When the current Freeze returns:

1. preserve its exact output as evidence / as-built analysis;
2. do not discard working systems;
3. do not automatically accept/freeze any terrain-topology decision;
4. inspect the actual returned source and classify the current Hex role.

Required classification:

### A · COMPATIBLE
`HEX_ROLE = SPATIAL_OR_SEMANTIC_ONLY`

Hex is used only for:
- streaming/partitioning;
- deterministic region addresses;
- seed organization;
- semantic zones;
- local gameplay/build kits.

Visible terrain/support geometry remains continuous.

Result:
**compatible with existing terrain canon.**

### B · ARCHITECTURE DRIFT
`HEX_ROLE = MACRO_TERRAIN_OWNER`

Hex cells/tiles define:
- visible macro ground geometry;
- authoritative support/height;
- landscape topology;
- or a world model that requires visible Hex terrain.

Result:
**NOT FROZEN AS CANON.**

Preserve the working core, but classify the terrain seam as:
`ARCHITECTURE_DRIFT · TERRAIN_OWNERSHIP_NOT_ACCEPTED`

## 2 · Binding target architecture

The Architecture Freeze must ultimately resolve to:

```
Continuous Terrain / Surface Truth
  ↓
Spatial Partition / Streaming
  ↓
Semantic Region Layer
  └ Hex allowed here
  ↓
WorldObject Identity
  ↓
Roads / Rivers / Villages / Farms / Forests / Props / Residents / Authoring
```

Not:

```
Visible Hex Terrain
  ↓
everything else
```

## 3 · What can still be kept from the current Coworker core

Even if macro-Hex terrain is confirmed, do not throw away the whole result.

Potentially reusable independently:
- deterministic seed/world generation;
- chunk/streaming machinery;
- villages/farms;
- roads/intersections;
- river/bridge generation;
- forests/groves;
- semantic POIs;
- collision/locomotion work;
- asset loading;
- object recipes;
- event/services infrastructure;
- performance work;
- camera findings;
- WorldObjectId/freeze analysis.

The recovery goal is:
**replace/fix the wrong terrain ownership seam, not rebuild every subsystem.**

## 4 · Freeze decisions that remain valid if surface-agnostic

The following may still be accepted from the running Freeze if they are not hard-coupled to visible Hex terrain:

- one owner per state;
- public module APIs;
- event layer;
- persistence boundary:
  `Base Recipe → Authoring Override → Dynamic State`;
- control/camera arbitration;
- stable WorldObjectId;
- one K2 material owner;
- simulation LOD;
- render batching must not erase semantic identity.

## 5 · Hard stop before integration fan-out

Before Authoring/Persistence and before Resident/UFO/Audio/Track/Billboard/Card fan-out:

**the returned source must pass the Hex-role classification above.**

If macro-Hex terrain is present:
- do not promote it as the final World terrain architecture;
- do not wire new systems to Hex-specific terrain internals;
- first define the migration seam to continuous terrain while preserving working generation/content systems.

## 6 · Evidence rule

Do not decide this from labels such as “Hex world”.

Inspect actual code:
- what generates the ground mesh;
- what owns support height;
- what collision queries;
- what roads/rivers sample;
- what chunks represent;
- whether Hex boundaries are visible/structural;
- whether terrain can become continuous without rewriting unrelated systems.

## 7 · Next gate

After the running Freeze returns:

**POST-FREEZE TERRAIN OWNERSHIP AUDIT**

Output exactly one classification:

`HEX_ROLE = SPATIAL_OR_SEMANTIC_ONLY · FREEZE COMPATIBLE`

or

`HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT · TERRAIN SEAM MUST BE CORRECTED BEFORE FAN-OUT`

No Live promotion before this classification.
