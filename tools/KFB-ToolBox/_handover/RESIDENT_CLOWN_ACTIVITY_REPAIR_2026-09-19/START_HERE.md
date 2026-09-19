# START HERE · Resident Clown Activity Repair R0

**Date:** 2026-09-19  
**Status:** `BRIEFING READY · IMPLEMENTATION NOT STARTED`  
**Existing owner:** Resident Atlas S6  
**Integration lead:** WSA unchanged  
**Repository:** `georg-doc/kayfabizarro`

## Required reading

Read current GitHub versions, in order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/BOUNDED_PRODUCTION_SLICE_CONTRACT.md`
5. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md`
6. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/RETURN.md`
7. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/BACKLOG.md`
8. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/GEORG_REVIEW_FAIL_C0_2026-09-19.md`
9. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/POSTMORTEM_C0_BRIEFING_INTENT_EXECUTION_2026-09-19.md`
10. Resident implementation files listed below.

GitHub state overrides chat memory.

## GOAL

Repair only the visible `juggle-cascade-v1` activity so one exact Clown with the three exact KayKit clubs reads as a believable three-club cascade without obvious club/body penetration.

This is **not** a C0 UI repair and **not** a Platformer integration.

## EXISTING OWNER

Resident Atlas S6 owns:

- Clown actor/vignette;
- rig/pose;
- prop/activity evidence;
- `juggle-cascade-v1`.

WSA remains integration lead. No new animation owner is created.

## EXACT SOURCE / OWNER FILES

Re-read at execution time:

- `tools/resident_atlas_s6/data/cast.js`
- `tools/resident_atlas_s6/lib/atlas.js`
- `tools/resident_atlas_s6/lib/juggle-math.js`
- `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
- `tools/resident_atlas_s6/tests/test-juggle-module.mjs`
- `tools/resident_atlas/modules/clown-juggling-island.module.json`
- `tools/resident_atlas/modules/runtime/s6-resident-module.js`

Exact asset identity stays with the central GitHub/Asset Registry sources already used by Resident Atlas.

## PROTECTED BOUNDARIES

Do not:

- change Platformer/Race/Travel movement or camera;
- add collision ownership to the Resident module;
- invent a second Resident runtime;
- replace the Clown model or the three exact clubs;
- patch C0 scale/UI in this slice;
- build a generic animation framework;
- use arbitrary whole-module scale changes as an animation fix;
- claim visual acceptance from CCD residual or zero console errors.

## SOURCE-ISOLATION PROOF FIRST

Before changing the activity:

1. open the exact current Resident Clown donor;
2. show the Clown + three clubs on a neutral floor;
3. fixed shared camera;
4. side and three-quarter views;
5. record the current broken state visibly.

No integration work before this proof exists.

## DONE WHEN

R0 is technically complete only when all are true:

- exact Clown source and exact three clubs are unchanged;
- left/right arm motion visibly participates in throw/catch;
- club trajectories read as a three-club cascade;
- no obvious club mesh passes through head or torso in the reviewed loop;
- catches occur in/near the hand region without obvious teleport/pop;
- loop remains deterministic and closes;
- existing module mount/update/dispose contract remains unchanged;
- static/unit checks pass;
- real browser proof at the fixed Cloudflare Stage route exists;
- side + three-quarter screenshots are stored;
- Georg acceptance remains separate.

## HUMAN REVIEW QUESTION

**Do the arms, catches and three club paths now read as believable juggling without clubs visibly crossing the Clown's head/torso?**

No scale/UI question is part of this gate.

## BRANCH

Target implementation branch:

`chatgpt-web/resident-clown-activity-r0-2026-09-19`

## FIXED STAGE TARGET

Candidate target:

`https://kayfabizarro.pages.dev/kfb-hub/stage/resident-clown-activity-r0/`

This is only a target until Cloudflare publication is verified. Do not call it deployed/live beforehand.

## REQUIRED EVIDENCE

Return:

- `RETURN.md`
- `SOURCE.json`
- `TEST_REPORT.md`
- additive `CHANGELOG.md`
- before screenshot;
- after three-quarter screenshot;
- after side screenshot;
- exact repo/branch/PR/head;
- actual test counts;
- direct verified Stage URL;
- one unresolved item;
- exactly one next gate.

## STOP RULE

If two repair passes do not materially improve the same arm/catch/clearance gate:

- stop;
- preserve the candidate;
- create the failure-recovery export;
- do not attempt a third visual rewrite in the same slice.
