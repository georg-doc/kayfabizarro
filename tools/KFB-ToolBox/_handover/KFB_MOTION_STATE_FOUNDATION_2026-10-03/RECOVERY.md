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
chatgpt-web/motion-ssot-convergence-2026-10-03

Draft PR:
#333

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


## Blender lane alignment · 2026-10-03

Active Blender measurement job is NOT the earlier local template.

Use:
- branch `coworker/locomotion-ladder-01-brief-2026-10-03`
- brief blob `746cd98e7185907cc18a95112a235e4bfbbdfd8f`
- incoming artifact `LOCOMOTION_LADDER_01.json`

Motion Library v6 was independently checked from Dropbox by this chat:
- catalogue schema `kfb.motion-catalog.v1`
- version `2026-09-30`
- 370 total clips
- 148 clips in group `locomotion`
- existing locomotion sets include male_basic, female_basic, magic_caster, drunk, carry_box, carry_holding and wheelbarrow.

The private Dropbox catalogue is not copied into this public branch.

### Updated next action

Do NOT invent a second Blender schema or preselect a gait ladder.

Wait for the actual GitHub-delivered `LOCOMOTION_LADDER_01.json`, inspect its real schema, then run the existing measurement reconciler against:
1. KCL/Three.js measurements;
2. Motion Library v6 facts;
3. Blender ladder measurements.

Every disagreement remains visible and unresolved until an explicit decision.


## Blender ladder delivered · 2026-10-03

PR #334 delivered the requested measurement/data return and has now been copied byte-identically into the current Motion SSOT evidence folder.

Exact intake:
- `evidence/blender-ladder/LOCOMOTION_LADDER_01.json`
  - blob `aa089a25157b057fd2456b8305f2ce97f3858972`
- `evidence/blender-ladder/RETURN.md`
  - blob `565aa5327a3597189b53ac664a576b120055ba22`
- `evidence/blender-ladder/KFB_LOCOMOTION_LADDER_01_review_plan.json`
  - blob `8eef67369a208182bd7f470bd9ec87113033121b`

Key measured findings:
- KayKit-only Walk→Run has a large no-slip gap;
- Blender candidate ladder uses walk → jog → runEasy → run;
- no accepted clean sprint source yet;
- backward/strafe still need large stretch and remain review items;
- several same-clip measurements differ >10% from Motion Lab v1 and stay unresolved;
- no ladder is HUMAN_ACCEPTED yet.

### Current next action

Reconcile the delivered ladder against KCL/Three.js and Motion Library facts, preserving all conflicts.
Then build the clean neutral ActionFigure prototype from the explicitly resolved profile only.

Do not integrate Travel/Combat/Residents before that prototype passes Georg visually.
