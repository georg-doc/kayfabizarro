# KFB Open World · Autopilot + Gauntlet 01 · Integration Prep · 2026-10-07

Status: **PREP ONLY · NO OPEN WORLD RUNTIME WRITES**
Execution mode: **BOUNDED_SLICE / ARCHITECTURE PREP**
Owner: **KFB WorldBuilder / WB2 · Issue #360 · receiving PR #348**
Planning branch: `planning/open-world-autopilot-gauntlet-2026-10-07`

## Executor

Current prep:
- **ChatGPT Web Chat** — GitHub/data/architecture preparation only.

Alignment:
- **Claude Coworker** — read-only fit/gap check against the actual local Coworker core; no new feature wave and no runtime mutation.

Later implementation:
- **ChatGPT Work/Astra** as Anschluss-Integrator after exact Coworker intake, camera closure and Architecture Freeze.
- One Integrator remains the only production writer.

## Outcome

Prepare one reusable QA capability for the real KFB Open World:

**KFB OPEN WORLD AUTOPILOT / GAUNTLET 01**

It combines:
1. a builder-side autonomous loop: launch → use normal controls → observe → capture → classify → repair → rerun;
2. a deterministic regression gauntlet inside the real WorldBuilder runtime;
3. independent critic separation at the end.

This is a production method and QA module, **not a new game/runtime/engine**.

## Read first

Binding current truth:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. Issue #360
5. `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md`
6. `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`
7. `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`
8. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
9. Seed World donor:
   `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/HANDOVER_2026-10-06_r2.md`
   and `INTEGRATION_OPEN_WORLD.md`.

Research seed supplied by Georg:
`https://www.reddit.com/r/aigamedev/comments/1wywfri/claude_opus_55_rebuild_terraria_in_3d_custom/`

## Current GitHub truth at prep start

- main: `26c822845a4d456f9692968a3495774182d47cf3`
- Issue #360: Coworker local core exists but exact GitHub intake still pending.
- reported local Coworker HEAD: `1d4f8c8` — **not GitHub truth until imported**.
- current blocker/gap facts from Issue #360:
  - camera acceptance defect;
  - duplicated height/ramp/slope ownership;
  - direct cross-module internal imports;
  - Authoring/Persistence absent;
  - stable individual World Object Identity is now a P0 Architecture Freeze decision;
  - required Track/Sky/Drive/Audio/Resident/Card/Billboard integrations remain downstream.

## Protected boundary

Do not:
- reconstruct the Coworker core from prose;
- mutate PR #348 or the local Coworker runtime in this prep slice;
- create a second World runtime, player owner, movement writer, camera owner, input owner, sky owner, Track owner, audio owner, editor or persistence owner;
- create a parallel debug game to satisfy QA;
- create a new World Studio Site;
- publish the failed four-island candidate as the new baseline;
- let the Builder certify its own final acceptance;
- replace source-proven KFB/KayKit/Kenney/Joyride assets with procedural lookalikes;
- interpret “KayKit style” as the material contract.

## Core decision

### A · Autopilot is builder-side QA, not acceptance

The Builder/Integrator may run an autonomous loop repeatedly:

```
boot real candidate
→ wait for ready marker
→ drive normal input path
→ capture screenshot/video/log
→ compare against source/canon/expected state
→ classify smallest failing seam
→ repair through current owner
→ rerun
```

This loop may repair the product.

It **cannot** issue the final independent critic verdict.

### B · Gauntlet is inside the real product

The Gauntlet is a deterministic WorldRecipe/QA state consumed by the current WorldBuilder runtime.

It is not:
- a second renderer;
- a separate playground;
- a synthetic teleport-only tester;
- an acceptance replacement.

It may use deterministic setup positioning, but traversal/gameplay evidence must pass through the normal input path.

### C · Identity/data model comes before render aggregation

Issue #360 now makes stable object identity P0.

The Gauntlet must address semantic objects through the frozen World Object identity model, not through temporary merged render-node identity.

Required relationship:

```
WorldObjectId / recipe data
→ semantic object state
→ authored / procedural / damage / transfer refs
→ renderer batching / merging / instancing
```

Render batching must remain free to optimize without erasing identity.

### D · Existing controls are binding

Ground control semantics remain:

```
W/S       forward/back
A/D       turn
Q/E       strafe
Shift     run
Space     jump
RMB drag  camera
wheel     zoom
```

Autopilot drives this path. No test-only second keyboard owner.

### E · KFB Clay / source fidelity are both checked

The Gauntlet does not reward default KayKit materials.

It checks two separate truths:
- source form/identity/rig/connectors remain recognizable;
- KFB Clay presentation obeys the current Clay/Surface Canon and Golden comparison.

`clay_floor_001` may remain a bounded donor/stand-in where explicitly allowed; it is not the final material owner.

## Gauntlet 01 scenario spine

The final integrated gauntlet grows in dependency order. A scenario is enabled only when its owning system is actually integrated.

1. **BOOT / READY / INPUT**
   - real candidate boot;
   - ready marker;
   - zero unexplained console/page/network errors;
   - normal Ground controls.

2. **CAMERA OCCLUSION CORRIDOR**
   - dense village/building/prop path;
   - intentionally force near occluders;
   - preserve practical actor framing;
   - camera may shorten legal boom;
   - if geometry would push into the actor, use the current camera owner's legal occluder treatment rather than creating another camera system.

3. **STREAMING BOUNDARY LOOP**
   - cross chunk/ring boundaries repeatedly;
   - verify time-sliced integration;
   - no burst-load stall;
   - stable semantic IDs survive unload/reload.

4. **SOURCE + CLAY CHECKPOINT**
   - show at least one current source family in isolation;
   - traverse its integrated form;
   - compare recognizable source identity and current Clay canon separately.

5. **AUTHORING / OBJECT IDENTITY**
   - search/isolate a real asset;
   - place/edit/snap;
   - terrain delta;
   - verify authored override beats procedural regeneration by stable identity.

6. **SAVE / FRESH RELOAD**
   - save;
   - fresh reload/import;
   - verify exact authored transforms, terrain deltas and semantic IDs;
   - return to PLAY.

7. **JOYride / SKY / DRIVE**
   - traverse one Track Core route with Joyride J14/T4/K2 presentation;
   - verify current Sky/Environment owner;
   - enter/drive/exit one source-proven vehicle through the existing handoff.

8. **AUDIO CONTINUITY**
   - world context transition through the one audio owner;
   - no duplicate transport/AudioContext;
   - failure in an optional family cannot break world boot.

9. **RESIDENT / CHATTERBOX**
   - encounter one real source-proven Resident;
   - use existing animation/dialogue ownership;
   - capture one deterministic encounter/dialogue seam.

10. **BILLBOARD / CARD / ALMANAC**
    - one Clay Billboard/media surface;
    - canonical Card identity/provenance;
    - acquire/inspect;
    - verify Almanac state survives reload.

11. **OPTIONAL COMBAT / DESTRUCTION DONOR**
    - only through the owner-approved activity/raid seam;
    - never turns the Open World into the Combat owner;
    - if enabled, verify stable object/damage IDs survive unload/reload.

## Seed policy

Do not invent a numeric production seed before exact Coworker intake.

During Architecture Freeze:
- inspect the imported core's actual seed API;
- choose one representative deterministic seed using that API;
- pin it in the receiving QA contract;
- record generator/version identity;
- never change the pinned Gauntlet seed silently.

Until then the machine contract uses:
`PIN_AFTER_EXACT_COWORKER_INTAKE`.

## Evidence contract

Every autonomous run should be able to emit:

- exact repo/branch/head/build identity;
- Gauntlet contract version;
- fixed seed + generator version once frozen;
- start/end timestamps;
- normal-input event script identity;
- screenshots at named checkpoints;
- one continuous traversal video for gameplay/camera gates;
- console/page/network errors;
- FPS/frame-time;
- draw calls/instances/triangles where current runtime exposes them;
- chunk integrations / integration budget observations;
- WorldObjectIds touched;
- persistence state before/after reload;
- source-family identities shown;
- module enable/disable state;
- repair classification;
- unresolved seam.

The evidence belongs under the receiving owner's `qa/` structure after integration.

## Independent critic separation

After the Builder/autopilot loop is green enough:

- spawn a fresh-context critic;
- give only candidate identity, rubric, source references and product target;
- no Builder transcript/reasoning/self-score;
- critic uses normal controls and captures its own evidence;
- critic never writes production code.

The existing >=8.5 required-dimension contract remains binding.

The Gauntlet accelerates QA; it does not lower the gate.

## Integration order

No change to Issue #360 routing:

0. exact Coworker intake;
1. narrow camera blocker repair;
2. Architecture Freeze:
   - single terrain/height/ramp/slope owners;
   - public module seams;
   - stable World Object Identity;
   - current controls/camera ownership;
   - current Clay/Source rules;
   - Gauntlet/Autopilot adapter location under `qa/`;
3. Authoring + Persistence core;
4. integrate Gauntlet phases 1–6;
5. add representative KFB module phases as their owners land;
6. run builder autopilot repair loop;
7. independent module critics;
8. different whole-product critic;
9. only then Site publication/update and Georg product gate.

## Site plan

Primary product surface remains the **existing** World Studio Site:

`https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site`

Existing project identity:
`appgprj_6ac27631f74c8191b52e4819c1973668`

Rules:
- update this Site in place;
- no second World Site;
- do not publish merely because this planning slice exists;
- publish only a frozen QA-ready candidate;
- use PUBLISH_ONLY for the host update;
- open the exact Site URL and verify the expected revision;
- Cloudflare is only a downstream formal mirror if explicitly required.

The Gauntlet may be activated through the existing product QA harness/state once the receiving runtime defines that seam. Do not add a second public dashboard or generic debug chrome.

## Done when for this prep slice

- architecture/QA prep is durable in GitHub;
- machine-readable Gauntlet contract exists;
- Coworker read-only alignment brief exists;
- same-Site publication plan is explicit;
- Issue #360 points to the packet;
- Production Control contains the durable packet/decision;
- no production runtime was changed.

Next gate:
**Coworker read-only alignment against the actual local as-built core, then exact Coworker GitHub intake.**
