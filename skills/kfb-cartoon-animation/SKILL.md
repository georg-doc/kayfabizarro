---
name: kfb-cartoon-animation
description: Design, author, integrate, diagnose, repair, and validate stylized/cartoon character animation for games and animation. Use for Blender rig/action/NLA/glTF work; locomotion such as idle, walk, jog, run, sprint, starts, stops, pivots, jumps, strafing and traversal; animation state/blend systems; controller/input-to-motion mapping; retargeting and motion libraries; acting, facial/eye animation and secondary motion; cartoon timing, spacing, squash/stretch and overlap; foot/contact/IK/warping; or when existing motion feels generic, floaty, slippery, unresponsive, noisy, or mechanically blended.
---

# KFB Cartoon Animation

Use this skill as the method owner for animation craft and integration. It does not become a second movement, physics, camera, asset, or runtime-state owner.

## Core invariant

```text
DEVICE INPUT
→ NORMALIZED INTENT
→ AUTHORITATIVE MOVEMENT / PHYSICS
→ SEMANTIC MOTION FACTS
→ MOTION STATE / SELECTION
→ BASE ANIMATION
→ WARP / IK / CONTACT CORRECTION
→ ADDITIVE / ACTING / SECONDARY
→ VFX / AUDIO / CAMERA
→ RENDERED READ
```

Keep ownership explicit at every arrow.

## Start every task

1. Identify the task mode.
2. Read only the references needed for that mode.
3. Identify the current project/runtime owner before changing anything.
4. Identify actor, rig family, export skeleton, source clips and target runtime.
5. Identify what owns world position, velocity, collision and camera.
6. Establish one repeatable fixture or playback proof.
7. Reuse measured donors and existing modules before creating new animation or state logic.
8. Make one bounded change.
9. Validate the exported/runtime result, not only the DCC viewport.
10. Return evidence, unresolved items and the next safe gate.

For KFB work, always read `references/kfb-integration-current-ssot.md` and the current project Return/Recovery before implementation. GitHub/current project state overrides this skill's examples.

## Choose a task mode

### AUDIT
Use when motion feels wrong or coverage is unclear.
Read:
- `00-principles-and-choreography.md`
- `90-validation-debug-evidence.md`
- the relevant technical reference

Classify before tuning:
wrong owner · wrong semantic state · wrong clip · wrong phase/contact · wrong playback/stride · wrong blend · wrong IK/warp · wrong input · wrong rig/export · wrong style · wrong camera/evidence.

### AUTHOR
Use when creating or revising clips.
Read:
- `10-body-mechanics-cartoon-style.md`
- `40-blender-authoring-rig-export.md`
- `20-locomotion-gaits-transitions.md` for locomotion
- `70-layering-acting-face-secondary.md` for performance

### INTEGRATE
Use when wiring animation into a game/runtime.
Read:
- `50-runtime-state-blending-warping.md`
- `60-input-controller-normalization.md`
- `80-retargeting-library-metadata.md`
- `90-validation-debug-evidence.md`

### TRAVEL
Use for climb, hang, swim, flight, vehicle/mount or special traversal.
Read:
- `30-travel-modes-traversal.md`
- `50-runtime-state-blending-warping.md`
- `40-blender-authoring-rig-export.md` when authoring is required

### ACTING / CINEMATIC
Read:
- `00-principles-and-choreography.md`
- `10-body-mechanics-cartoon-style.md`
- `70-layering-acting-face-secondary.md`
- `75-vfx-audio-camera-comic-motion.md` when presentation effects are involved

### RETARGET / LIBRARY
Read:
- `40-blender-authoring-rig-export.md`
- `80-retargeting-library-metadata.md`
- `90-validation-debug-evidence.md`

### 2D / 2.5D compatibility
Read:
- `05-2d-2_5d-compatibility.md`
- `00-principles-and-choreography.md`


## Reference map

Load only what the task needs:

- `references/00-principles-and-choreography.md` — shared motion meaning, staging, timing/spacing, overlap and recovery.
- `references/05-2d-2_5d-compatibility.md` — retained 2D/SVG/cutout compatibility.
- `references/10-body-mechanics-cartoon-style.md` — weight, posing, exaggeration, asymmetry and style profiles.
- `references/20-locomotion-gaits-transitions.md` — walk/jog/run/sprint, starts/stops/pivots, phase/contact and foot truth.
- `references/30-travel-modes-traversal.md` — ground/air/climb/swim/flight/vehicle/special traversal.
- `references/40-blender-authoring-rig-export.md` — Blender blocking, Graph Editor, NLA, constraints, bake and glTF export.
- `references/50-runtime-state-blending-warping.md` — state/blend architecture, additive layers, IK/warping, motion matching.
- `references/60-input-controller-normalization.md` — keyboard, gamepad, pointer, touch and wheel normalization.
- `references/70-layering-acting-face-secondary.md` — acting, gaze, face, gesture layers and secondary motion.
- `references/75-vfx-audio-camera-comic-motion.md` — semantic VFX, audio punctuation and camera budgets.
- `references/76-kfb-motion-presets.md` — retained KFB motion preset/event contracts.
- `references/77-kfb-ink-text-placement.md` — stable ink, onomatopoeia, safe text placement and timing.
- `references/80-retargeting-library-metadata.md` — donor verification, retargeting and motion-catalog semantics.
- `references/90-validation-debug-evidence.md` — fixtures, debug overlays, failure taxonomy and evidence.
- `references/kfb-integration-current-ssot.md` — current KFB routing only; re-read live GitHub state before implementation.
- `references/research-sources.md` — research trail and external primary references.

## Prime directives

- Motion is meaning in time.
- One important moment gets one primary read.
- The whole body participates; permanent fidgeting is not life.
- Weight, contact, balance, force, timing and spacing come before cartoon exaggeration.
- Continuous speed is not the same thing as semantic gait.
- Starts, stops, pivots, turns and landings are first-class motion problems.
- Animation presentation may correct or exaggerate authoritative motion; it may not silently replace it.
- Device input never selects clips directly.
- A missing clip or measurement stays missing/HOLD; do not fabricate coverage.
- Do not solve every mismatch with more playback-rate stretch.
- Do not adopt motion matching, procedural animation or learned systems merely because they are more advanced.
- Validate the smallest technique that solves the visible problem.

## Complexity ladder

Prefer the least complex layer that works:

0. authored clips + bounded crossfade
1. parameter blending + hysteresis + phase synchronization
2. additive / per-bone layers
3. contact-aware IK + slope/orientation/stride correction
4. distance/motion warping for transitions and interactions
5. motion matching when data density, metadata and runtime needs justify it
6. learned/physics-driven animation only for a demonstrated need

## Required owner boundaries

Animation may own:
- pose and visual timing
- clip selection within its declared motion owner
- playback rate within measured/approved ranges
- transition presentation
- additive pose/lean/recoil
- animation-relative contact/event markers
- IK/warping presentation
- secondary/facial presentation

Animation must not silently own:
- raw input
- world position integration
- collision
- terrain truth
- vehicle/flight physics
- damage/game rules
- camera authority unless explicitly assigned

## Recovery rule

After two non-improving repair passes on the same explicit gate, stop repairing the **smallest failing animation seam**. Preserve that seam's candidate/evidence and classify known vs hypothesized. Quarantine/defer it and continue the parent animation/product outcome unless the Production Guard proves the seam is outcome-critical.

## Output contract

Every completed slice reports:
- owner and protected boundaries
- exact source/rig/clip facts used
- what changed
- tests actually run
- visual/playback evidence
- known HOLD/missing coverage
- whether the result is technical evidence or human-accepted
- exactly one next productive gate
