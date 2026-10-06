# ChatGPT Work/WSA · Resident Performance Architecture Review Prep · 2026-10-06

Status: **OPTIONAL READ-ONLY PREP · NO OPEN-WORLD RUNTIME WRITES**
Executor: **ChatGPT Work/WSA**
Owner: **KFB Resident Performance architecture**
Current Open World writer: **Claude Coworker · protected**

## Outcome

Perform a token-disciplined architecture review of the prepared Resident Performance contract without implementing it.

This job is useful only if Georg wants additional parallel architecture preparation while Coworker is still running.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`
3. `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`
4. Resident Atlas Return + cast
5. EyeRig v6
6. PetMouth
7. PR #356 Return/body
8. PR #357 current planning packet

Do not recursively crawl unrelated history.

## Review questions

Return a compact matrix:

- owner for Resident intent/state;
- owner for Affect;
- owner for Pose;
- owner for Gesture;
- owner for EyeRig/Brows/PetMouth;
- owner for Emanata;
- owner for Bubble;
- owner for Audio reaction hooks;
- event source;
- persistence boundary;
- simulation-LOD boundary;
- conflicts/duplicate owners;
- adapter seams required after Coworker return.

Review specifically:
- Pose vs locomotion ownership;
- step-in/out vs navigation;
- gesture vs upper-body action;
- face layering;
- Emanata read-only state rule;
- bubble/Emanata protected placement;
- optional Emanata SFX through existing Audio owner;
- reaction/encounter event priority;
- recovery to valid activity/idle;
- far-distance performance LOD.

## Deliverables

1. `RESIDENT_PERFORMANCE_OWNER_MATRIX.md`
2. `RESIDENT_PERFORMANCE_EVENT_API_PROPOSAL.md`
3. `RESIDENT_PERFORMANCE_ARCH_FREEZE_CHECKLIST.md`
4. exactly one recommended post-Coworker integration sequence.

## Token firewall

- read-only;
- no browser/game run;
- no Open World writes;
- no Blender invocation;
- no Site work;
- no ChatterBox implementation;
- no repo-wide search after required donor paths are sufficient;
- mark uncertain seams `UNKNOWN` rather than prolonged investigation.

## Done when

The eventual Architecture Freeze can compare this prepared contract against the exact Coworker return in one pass.

No merge. No Live promotion.
