# RECOVERY · KFB Animation/Motion SSOT Foundation

## Human intent

One central 3D animation/locomotion truth.

Do not build another Travel-, Combat- or Resident-local locomotion state machine.

Parallel Island World / Residents / EyeRig work remains active.

## Current owner

KFB ToolBox / Animation-Motion authoring

Repository:
georg-doc/kayfabizarro

Branch:
chatgpt-web/kfb-animation-motion-ssot-2026-10-03

Draft PR:
#331

Current tested head:
aa0166f166c303443a74c7bbae1b84f181fa0900

## What is proven

- central pure motion-state-machine exists;
- exact existing locomotion/anim-map donors are promoted byte-identically into the same candidate owner line;
- semantic state selection consumes real motion facts instead of number-key state selection;
- gait thresholds/hysteresis derive from measured speed windows;
- missing data remains pending;
- Blender measurement intake has a versioned schema/template;
- focused Foundation CI is green.

## What remains open

Do not claim final locomotion yet.

Open:
- reconcile Blender MCP measurements against current Three.js/KCL measurements;
- resolve approved playback ranges;
- resolve Walking_A/B/C semantic use;
- resolve Jog/Fast-Walk profile;
- resolve Sprint source/rate;
- cross-check backward/strafe/jump;
- turn policy;
- clean neutral ActionFigure WASD+Shift+Space prototype;
- Georg visual/freeplay acceptance.

## Recovery source order

1. START_HERE.md
2. SOURCE.json
3. TEST_REPORT.md
4. ../../docs/MOTION_PROFILE_ROUTER.md
5. ../../kfb-lib/MOTION_STATE_CONTRACT.v1.json
6. ../../kfb-lib/motion-state-machine.v1.js
7. ../../kaykit-motion-lab-v1/BLENDER_MEASUREMENT_BRIEF.md

## Exactly one next action

Build the measurement reconciler:
existing KCL/Three.js facts + Blender intake
→ per-clip agreement/delta/unresolved report
→ one merged candidate profile
without silently preferring either measurement source.

Then use that reconciled profile for the neutral ActionFigure prototype.
