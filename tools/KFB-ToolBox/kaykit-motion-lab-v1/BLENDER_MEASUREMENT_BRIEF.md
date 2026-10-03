# Blender measurement route · LOCOMOTION-LADDER-01

Status: **ROUTED TO COWORKER BLENDER BRIEF · DO NOT CREATE A SECOND MEASUREMENT CONTRACT**

The earlier local template in this branch is retained only for compatibility/history.
The active Blender measurement job is:

- branch: `coworker/locomotion-ladder-01-brief-2026-10-03`
- brief:
  `skills/chat/workflows/LOCOMOTION_LADDER_01_2026-10-03/BRIEF_BLENDER_LOCOMOTION_LADDER_01.md`
- exact brief blob:
  `746cd98e7185907cc18a95112a235e4bfbbdfd8f`

## Active Blender output

The authoritative incoming measurement artifact is:

`LOCOMOTION_LADDER_01.json`

plus the additive Motion Library catalogue entry requested by that brief.

Blender owns measurement only.
It does not write:
- the central state machine;
- Travel/Combat/Resident runtime;
- consumer movement/physics.

## Current central owner

KFB ToolBox / Animation-Motion authoring:
- `kfb-lib/motion-state-machine.v1.js`
- `kfb-lib/MOTION_STATE_CONTRACT.v1.json`
- `kfb-lib/motion-measurement-reconcile.v1.js`

When `LOCOMOTION_LADDER_01.json` arrives on GitHub:
1. inspect its actual schema;
2. compare exact same-clip values against KCL/Three.js and Motion Library facts;
3. preserve every contradiction;
4. do not silently choose a winner;
5. only then form the prototype candidate profile.

## Independently verified Motion Library v6 facts

Read directly from the connected Dropbox source on 2026-10-03:
- `RETURN_INTAKE_06.md`: Motion Library v6, 2026-09-30;
- catalogue schema: `kfb.motion-catalog.v1`;
- catalogue version: `2026-09-30`;
- **370 total clips**;
- **148 clips in group `locomotion`**;
- existing locomotion sets include `male_basic`, `female_basic`, `magic_caster`, `drunk`, `carry_box`, `carry_holding`, `wheelbarrow`.

This resolves the apparent “148” wording: it means 148 locomotion-group clips inside a 370-clip library.

The Dropbox catalogue itself is not copied into this public branch.
