# KFB Motion Profile Router

Status: **CANDIDATE CENTRAL ANIMATION/MOTION SSOT · 2026-10-03**
Owner: **KFB ToolBox / Animation-Motion authoring**

## Stable owner files on this candidate line

- `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
- `tools/KFB-ToolBox/kfb-lib/anim-map.v1.js`
- `tools/KFB-ToolBox/kfb-lib/motion-state-machine.v1.js`
- `tools/KFB-ToolBox/kfb-lib/MOTION_STATE_CONTRACT.v1.json`

The first two are byte-identical promotions from the proven ToolBox Production donors / PR #294.
The state machine is the missing central layer that resolves semantic presentation state from real consumer motion facts.

## One animation truth

ToolBox Animation/Motion owns:
- semantic motion state vocabulary;
- source-backed clip/role mapping;
- measured cadence/reference-speed/contact facts;
- phase-aware transition metadata;
- playback-rate policy;
- animation-relative event markers;
- actor-specific motion review/overrides.

Consumers own:
- input;
- world position / velocity integration;
- physics;
- terrain/collision;
- camera;
- damage/ammo;
- jump trajectory.

Consumers provide motion facts and receive presentation facts.
They do not maintain local locomotion clip tables or parallel state graphs.

## Source lineage

- KayKit Motion Lab v1 · PR #127 · public 87/87 PASS · human motion acceptance open.
- KayKit creator research / KCL · PR #107.
- Locomotion profiles + anim map · PR #294.
- Blender MCP measurements enter through the versioned measurement intake; they may confirm/correct numeric facts without creating a new owner.

## Promotion boundary

This candidate is NOT yet the accepted runtime default.

Before prototype promotion:
1. reconcile existing Three.js/KCL measurements with exact Blender measurements;
2. close required Rig_Medium semantic evidence;
3. build one clean ActionFigure neutral-ground prototype with WASD + Shift + Space;
4. Georg visually accepts gait, transitions, foot slip and jump;
5. only then named consumers integrate this same SSOT.

Island World and Resident/EyeRig production continue independently.
