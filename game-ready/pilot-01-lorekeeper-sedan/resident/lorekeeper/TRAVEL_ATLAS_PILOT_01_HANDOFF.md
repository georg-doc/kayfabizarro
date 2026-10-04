# Pilot 01 · Lorekeeper → Travel Atlas Pilot 01

**Status:** PACKAGE HANDOFF READY · RUNTIME DEFERRED BY CURRENT TRAVEL GROUND HUMAN GATE  
**Travel owner:** `georg-doc/KFB-Travel-Globe`

This handoff aligns Game Dev Studio Pilot 01 with the already-existing Travel brief:

`_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/ATLAS_PILOT_01_LOREKEEPER_HEX_THRESHOLD_2026-09-17.md`

It does not create another Travel pilot or move World ownership into Game Dev Studio.

## Package contribution

Game Dev Studio supplies the exact Resident package facts:

- Lorekeeper actor;
- Tome/lectern habitat prop;
- Staff hand prop;
- `Rig_Medium`;
- `Idle_A`;
- measured relative transforms;
- explicit `handslot.r` Staff calibration;
- source revisions/provenance.

Travel remains responsible for:

- spherical world anchor;
- local tangent frame;
- Ground support;
- seven-cell Hex selection/placement;
- existing ROAD approach;
- camera/lighting;
- save/reload World Recipe;
- player locomotion.

## Travel variants

The Resident package is identical in:

`VISIBLE_HEX | SEATED_HEX | NO_VISIBLE_HEX`

Only Travel's support/presentation treatment changes.

`NO_VISIBLE_HEX` must not retain invisible Hex collision/support.

## Current gate

Do **not** start the runtime import merely because this package handoff exists.

Current Travel WSA still requires the repaired Ground state to pass Georg's human review before Lorekeeper/City/etc are added. This package is therefore **ready input, execution deferred**.

## Animation boundary

`Idle_A` is the required presentation clip. A reading clip is not required.

If `Walking_A` is used later, Travel remains translation/heading owner. Root motion must not create another movement solver.

## Acceptance

Travel-specific consumer PASS requires actual load/placement/save/reload/walk-up testing at the stable spherical anchor across all three variants. A Game Dev Studio preview or Resident Atlas preview is not Travel consumer evidence.

Machine-readable mapping:

`TRAVEL_ATLAS_PILOT_01_ADAPTER.json`
