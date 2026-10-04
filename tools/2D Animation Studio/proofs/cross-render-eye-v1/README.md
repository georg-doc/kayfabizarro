# Cross-Render Eye Proof v1

Status: **IMPLEMENTATION · browser QA pending**

## Purpose

Drive two very different actor/render paths with the **same semantic EyeRig sequence**:

1. DocCheck Eumel — source-exact SVG/2D adapter.
2. FrizzleBob Driver Graft — ToolBox Three.js EyeRig v6 on the real KayKit **Rig_Medium** host.

Sequence:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

## Why FrizzleBob Driver Graft

This is currently the safest 3D protocol proof because:

- its host is explicitly measured as `Rig_Medium`, 23 joints;
- it already mounts through the public ToolBox `mountGraft()` path;
- it already owns a real EyeRig-v6 instance;
- it avoids inventing a second temporary EyeRig mount while the Batch EyeRig Atlas has not yet approved a generic Medium profile.

This proof does **not** count as a generic EyeRig Batch profile approval.

## Shared semantics

The proof loads:

- `shared/eye-rig/eye-clips.v1.json`
- `shared/eye-rig/eye-sequence-runner.v1.js`

The runner calls the same public methods on both targets. Each renderer keeps its own geometry and update owner.

## Deterministic proof harness

Autonomous eye life/kinetics are disabled. Automatic blink is parked. The visible state changes should come from the semantic sequence only.

## Browser target

`https://kayfabizarro.pages.dev/tools/2D%20Animation%20Studio/proofs/cross-render-eye-v1/`

Do not mark PASS until both sides load/play and the sequence is visibly inspected.
