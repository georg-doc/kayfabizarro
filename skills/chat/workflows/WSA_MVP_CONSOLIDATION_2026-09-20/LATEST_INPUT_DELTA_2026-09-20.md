# Latest Input Delta · 2026-09-20 23:xx CEST

Status: **CURRENT DELTA OVER BRANCH_CENSUS · READ THIS BEFORE THE FULL CENSUS**

Coordination baseline:
`orchestration/wsa-mvp-consolidation-2026-09-20@32cbf99d93415b0b576d5031947ebb256a48d272`

The full `BRANCH_CENSUS.json` remains provenance/inventory and should not be loaded at Work startup unless a ref conflict must be resolved.

## New relevant GitHub input since the census

### Storytelling Maps · PR #149

- repo: `georg-doc/kayfabizarro`
- PR: **#149**
- branch: `planning/storytelling-map-animator-v1-2026-09-20`
- head: `dadf2fa34cc3b64ae7177953387c91e6d3042bb4`
- base: Storytelling Maps T2 branch
- status: **PLANNING ONLY · runtime not started**
- owner remains `tools/kfb-cartoon-map-board/`
- current Storytelling implementation gate remains **T2.1 Responsive Rounded CardRig**
- Map Animator SMA1 is a prepared parallel next lane, not a reason to bypass CardRig.
- public Hub routing proof: 6/6 PASS; Animator Stage itself remains target-only / NOT PUBLIC_VERIFIED.
- existing Game Dev Studio Theatre Curtain PR #114 remains the curtain module donor; do not build another curtain.

## WhackMan / Perplexity input

The user-supplied research adds no new internal implementation owner.

Useful ideas already incorporated into the WhackMan brief:
- Input → MovementIntent → PlayerMotor separation;
- orbit camera independent of motor;
- MazeGraph/logical collision independent of visible meshes;
- behaviorally distinct pursuers;
- data-driven pickup/power-up roles.

External Pac-Man repositories remain **reference-only** until an exact license/source review authorizes code reuse. No external Pac-Man runtime replaces the Dungeon-first KFB source hierarchy.

WhackMan current brief:
`skills/chat/workflows/KFB_WHACKMAN_V1_2026-09-20/CLAUDE_DESIGN_BRIEF.md`

WhackMan implementation should remain with its Claude/source gates until a returned editable candidate is available. Work must not independently rebuild the same Gate A/B/C candidate.

## Current Work implication

Do not expand the seven-lane integration scope.

At Work startup:
1. re-fetch current owner refs;
2. apply this delta;
3. classify lanes READY / WAITING_HUMAN / WAITING_CLAUDE / BLOCKED / HOLD;
4. choose exactly one executable vertical slice;
5. leave planning-only inputs pinned, not implemented.
