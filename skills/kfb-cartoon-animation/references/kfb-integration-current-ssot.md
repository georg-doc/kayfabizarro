# KFB Current SSOT Integration

Status date: 2026-10-03
This file is a routing reference. Current GitHub project state always wins.

## Doctrine owner

Current donor on main:
`skills/kfb-cartoon-animation_v2.md`

The portable folder skill is a refactor/promotion of that doctrine, not a competing second animation doctrine.

## Current 3D Motion owner

Repository:
`georg-doc/kayfabizarro`

Draft PR:
`#333`

Branch:
`chatgpt-web/motion-ssot-convergence-2026-10-03`

Current branch head observed during Site Draft:
`811855edc2a9aa1365cb3318bbd01d0c8f5b2d1e`

Owner:
KFB ToolBox / Animation-Motion authoring.

Consumers later include World, Travel, Combat and Residents; they must not fork local gait tables/state graphs.

## Current proven runtime state

Motion Library v7:
395 clips.

Technical forward ladder:
`walk → jog → run.easy → run → sprint`

Central contract consumes actual motion facts and owns:
- semantic animation state;
- clip role mapping;
- rig-family motion facts;
- foot/contact phases;
- playback-rate policy;
- phase-aware transition profile;
- animation-relative markers;
- actor-specific motion review/override.

It explicitly does not own:
- input;
- world position;
- velocity integration;
- acceleration physics;
- terrain/collision;
- camera;
- damage/ammo;
- jump trajectory.

## ActionFigure neutral freeplay

The prototype is already implemented and browser-proven.

Current tested implementation head from Recovery/Return:
`f1ce90d31a18973fa981bc982309c4bb01b204b8`

Evidence:
- ActionFigure Motion Freeplay CI SUCCESS;
- Motion Foundation 27/27 PASS;
- Resource Registry PASS;
- Asset Registry Refresh PASS;
- real Chromium proved idle, forward run, sprint, reverse, jump and Jog/Run/Sprint A/B selector switching;
- 0 console errors;
- 0 page errors.

Classification:
SITE REVIEW READY · NOT PUBLIC STAGE · HUMAN LOOK DECISION OPEN.

## Human-open product choices

Jog:
`jog_forward_a` vs `jogging_a`

Run:
`medium_run_a` vs `running_d`

Sprint:
`sprint_a` vs `fast_run_a`

Known directional gaps remain explicit:
- side jog missing;
- backward jog HOLD;
- left strafe run HOLD;
- left running turns missing;
- run stop ends about 45° turned.

## Status metadata drift

The current `MOTION_STATE_CONTRACT.v1.json` still contains older status text listing the neutral ActionFigure prototype as unresolved/to be built.

Newer Recovery/Return sections prove that prototype is already implemented and browser-passed.

Interpretation:
- runtime ownership/rules in the contract remain current;
- prototype gate/status fields in that JSON are stale metadata;
- do not re-open the already-completed technical build gate;
- current human gate is the A/B visual/freeplay choice.

This skill does not silently edit PR #333 to fix that metadata drift. Record it for the owning Motion branch.

## KFB execution rule

For KFB implementation:
1. read current `skills/chat/START_HERE.md`;
2. read current project Recovery/Return;
3. fetch current owner PR/head;
4. read this routing reference only as an index;
5. use source-backed current files;
6. preserve one movement writer and one motion-state owner.

## Do not

- create a Travel-local or Combat-local locomotion graph;
- hard-code gait thresholds in a consumer;
- copy stale prototype status from the contract;
- mark current clip choices HUMAN_ACCEPTED before Georg chooses them;
- use Travel Globe as the neutral gait-validation host.

## Current next product gate in Motion owner

Georg visual/freeplay selection of Jog A/B, Run A/B and Sprint A/B.

After that decision, ChatGPT/GitHub records the accepted look choices and the same Motion owner can dock into procedural World #332.
