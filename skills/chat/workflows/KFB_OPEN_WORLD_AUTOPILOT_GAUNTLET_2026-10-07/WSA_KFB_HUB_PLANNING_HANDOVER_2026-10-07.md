# WSA KFB Hub · Open World Autopilot / TestBot planning handover · 2026-10-07

Status: **PLAN / QUEUE ONLY · DO NOT INTERRUPT CURRENT COWORKER SLICE**

## Executor
**ChatGPT Work/WSA · KFB Hub planning chat**

## Outcome
Plan the already-prepared Open World Autopilot/Gauntlet work as a downstream lane. Do not send it into the currently running/closing Coworker Open World process.

Source:
- Draft PR **#366**
- branch `planning/open-world-autopilot-gauntlet-2026-10-07`
- source packet head before this planning note: `bf87006c1543749f4326e05225bce23e41989fb8` (use PR #366 for the current branch head)
- read first: `skills/chat/workflows/KFB_OPEN_WORLD_AUTOPILOT_GAUNTLET_2026-10-07/START_HERE.md`

## Scheduling decision
Split the work into two stages:

### Stage A · may start now · TestBot Core only
WSA/Work may build a **runtime-neutral TestBot Core** on its own bounded branch, without touching PR #348 or the Coworker runtime.

Safe scope:
- Playwright/browser runner using the existing repo QA patterns;
- action-script schema for real keyboard/mouse/wheel input;
- ready/wait/timeout handling;
- screenshot + console/page/network evidence capture;
- run-report JSON;
- scenario sequencing and cleanup/focus-loss safety;
- tiny self-contained fixture proving real DOM input delivery;
- adapter interface only for future WB2 binding.

Forbidden now:
- no WB2/Open World runtime writes;
- no camera/world/seed assumptions;
- no direct player transform or hidden teleport accepted as gameplay;
- no WorldObjectId implementation;
- no Site publication;
- no second input/camera/player/runtime owner.

### Stage B · only after exact Coworker intake + Architecture Freeze
Add the thin WB2 adapter against the actual imported runtime:
- real ready marker;
- real normal-input seam;
- actual deterministic seed API;
- camera occlusion scenario;
- streaming metrics;
- frozen WorldObjectId;
- Authoring/Persistence hooks;
- real Gauntlet scenarios.

Then integrate under the existing WB2 `qa/` owner and run independent critics separately.

## Why this split
The reusable browser/test infrastructure does not need the Coworker architecture and can be built now. The WB2 adapter **does** depend on the exact as-built runtime, so writing that part before Coworker intake would create guessed seams and likely duplicate ownership.

## Hub handling
Queue this as a downstream Open World support lane. Do not create a new P0/human gate and do not republish the Hub/Site merely for planning.

## Next gate
**WSA decides whether to start Stage A TestBot Core now; Stage B remains blocked on exact Coworker GitHub intake + Architecture Freeze.**
