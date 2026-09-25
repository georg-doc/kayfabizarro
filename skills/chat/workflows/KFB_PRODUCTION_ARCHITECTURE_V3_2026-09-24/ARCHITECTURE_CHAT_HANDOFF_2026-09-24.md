# ARCHITECTURE CHAT HANDOFF · KFB Production Architecture v3 · 2026-09-24

Status: **CURRENT RECOVERY / CONTINUATION ENTRY**
Role: architecture + planning steward, not product-runtime owner.

## Purpose

This chat lane exists to:
- keep the production map coherent;
- prevent duplicate owners;
- recover current source truth;
- maintain complete self-service briefings;
- assign the cheapest capable executor/model/reasoning profile;
- prepare Hub/WSA handoffs;
- preserve Return/changelog/source locks when chats break.

It should **not** become the implementation bottleneck.

## Fresh-chat start order

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this architecture `START_HERE.md`
5. current `RETURN.md`
6. `PRODUCTION_STRANDS.md`
7. `HUB_BRIEFING_CATALOG.json`
8. `EXECUTION_DISPATCH_POLICY_2026-09-24.md`
9. only the relevant decision/workflow docs for the user's new topic.

GitHub beats chat memory.

## CURRENT RECOVERY DELTA · 2026-09-25 evening · EXPORTS INTAKED

The two Claude Design exports are no longer pending.

Canonical intake:
`INTAKE_SESSION_CUTS_EAR_RIG_2026-09-25.md`.

Main upload:
`8504afa9d14ad46855d0c590bc30eea0fc38d15d`.

### ToolBox
Session Cut:
`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

Status:
**KEEP · FUNCTIONAL CANDIDATE · GEORG HUMAN REVIEW NEXT.**

Do not invent a new ToolBox brief before Georg tests the current Studio → IK/Pose → Animation Lab → contact correction → Save/Return flow.

### WorldBuilder
Session Cut:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

Status:
**KEEP · REHOME/REGRESSION → GEORG HUMAN REVIEW NEXT.**

It uses the same WB2 terrain/object/persistence state in Hürth. Preserve it 1:1 first; Web runs World 26/26 + WB2 34/34 before review.

### Ear Rig
PR #214 / `tools/KFB-ToolBox/ear-rig/`.

Owner decision is final for this candidate:
- Animation Lab / ToolBox Motion owns the single `ear-dangle.v1.js`;
- FrankenStein Studio authors geometry/placement/acted-rest pose/profile;
- consumers provide only wind/contact/impulse facts.

EAR-DANGLE-01 waits behind ToolBox Production-01 human review.

### Export skill
Current full Claude Design trigger is:
`/session-zip` → `skills/session_ZIP_v1.md`.

The older `/claude-export` skill is superseded history.

Recovery caveat:
the GitHub entry is a short fallback; the reported full canonical body incl. `zipcheck.py` still lives in Claude project Skills at `claude/session-zip-SKILL.md`. Mirror that exact full body into GitHub when available; do not reconstruct it.

### Immediate architecture action

No new product brief.

Current product gates:
1. Georg reviews ToolBox Production-01.
2. Web rehomes/tests World Integration-01; Georg reviews.
3. Architecture reacts only to those human results.

## CURRENT RECOVERY CHECKPOINT · 2026-09-25 · PLAYABLE INTEGRATION

This checkpoint supersedes older sequencing text below where it conflicts.

### User intent in plain language

Georg's current main goals are:

1. **WorldBuilder inside the real world** — edit terrain/objects in the same world state that is then played.
2. **Real OSM continuity** — Hürth/Alstädten/Köln plus the missing real corridor pieces toward SAE; no invented geography.
3. **Modular Race Track** — prove modules in the real Race/Rapier owner first, then place/handoff from the world.
4. **One usable ToolBox** — two main workspaces: **Studio** and **Animation Lab**.
5. **Shared character/motion production** — KayKit base locomotion first; Mixamo as variants/actions; shared Pose/IK/Vehicle-Fit profiles consumed by World/Travel/Race/Residents.

### Two authoring sessions are already running

- a WorldBuilder/Claude Design session based on the previous brief;
- a ToolBox/Animation authoring session based on the previous brief.

**Do not send replacement mega-briefs into those sessions while they are still running.**

Recovery action:
- request/receive the complete export or Session Cut;
- compare it against current GitHub owner state + `MVP_FOCUS_PLAN_2026-09-24.md`;
- preserve useful work;
- identify duplicate-owner/rebuild drift;
- issue one bounded correction/integration brief from the export.

### WorldBuilder correction to remember

The accepted WB2 terrain sculpt is already HUMAN PASS on PR #190 at
`ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`.

It is an authoring capability, not a second standalone product.

After the running export returns, the next product question is:

**Can Georg navigate the real World/Travel scene, switch into the accepted terrain/object editing, Save/Reload, and continue playing the same modified world?**

A rebuilt local editor that looks similar does not satisfy this.

### Locomotion correction to remember

Do not let a WorldBuilder session reconstruct Animation Lab v1 logic as its own owner.

Canonical base locomotion direction:
- KayKit Character Animations provide the default State/Action vocabulary;
- shared semantic profile binds state → clip → cadence/stride → playback rate → expected world speed → root/contact policy;
- movement/physics owns world translation;
- animation follows movement state/speed;
- Mixamo Motion Library is a variant/action layer, not the default walk/run foundation.

Core states:
`Idle · Walk · Run · source-backed Fast Run/Sprint · Backward · Strafe · Jump Start · Air/Fall · Land · Crouch/Sneak/Crawl`.

### ToolBox correction to remember

Target product is one ToolBox with two main workspaces:

**Studio**
Actor/Profile · KayKit body/graft · Legacy builder · Face/Eye/Mouth/Viseme · Materials · Bubbles · Pose/IK · prop/contact fit · Vehicle/Surface Fit.

**Animation Lab**
KayKit locomotion states · Motion Library audition · direct FBX intake · semantic roles · root/stride/speed calibration · jump-state preview · scrub/key-pose/contact correction · Blender exception queue.

The same Pose/IK owner must be usable from both tabs. No standalone Pose Lab / IK Lab as a new runtime.

### IK / contact correction

Resident Atlas IK is prototype evidence only.

Keep the existing prepared parity gate:
current KFB solver vs upstream Three.js CCDIKSolver vs constrained CCD.

Goal:
direct in-scene hand/foot targets, constrained stable posing, fewer twist/flip failures, compact context controls.

Use this for cases such as Orc drummer stick/drum contact before escalating to Blender.

### Ground → Flight continuation

Existing Travel owners already prove the mode bridge and animated CardCarrier direction.

Near-term target:
`GROUND → mount → animated KFB CardCarrier FLIGHT → intentional landing → GROUND`.

Author a proper KayKit `CARD_SURF` Pose/Vehicle-Fit profile in ToolBox Studio.

Old rigid Studio CardRider remains a measurement/pose donor only; Travel's animated CardCarrier remains the Flight vehicle.

### Vehicle/cockpit continuation

Reuse existing Seat/Cockpit/Vehicle-Fit donors.

Before the Quaternius transformer-like vehicle slice:
- resolve and pin the exact four models Georg means;
- do not substitute another vehicle family.

### Recovery reading order after a chat break

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. architecture `START_HERE.md`
5. this handoff
6. `MVP_FOCUS_PLAN_2026-09-24.md` — read its **2026-09-25 CURRENT OVERRIDE first**
7. current architecture `RETURN.md`
8. fetch current PR #204 head
9. if WorldBuilder/ToolBox exports have arrived, inspect those exports before creating any new execution brief

### Immediate next gate for this architecture chat

**WAIT FOR / INTAKE THE TWO RUNNING EXPORTS.**

Do not restart WorldBuilder or ToolBox from prose before those candidate states are recovered.

## Current architecture state

Primary product architecture:
- 13 strands;
- self-service catalog is strand-first;
- product jobs are READY or dependency-gated HOLD;
- every catalog job carries executor/model/reasoning/budget metadata.

Current cross-cutting decisions include:
- Race/Track authored recipes + bake;
- OSM World Zone bake;
- Elastic torsion proof;
- Audio/VFX audition;
- Card Zones;
- Player Journey/Almanac/HUD;
- Skills/runtime consolidation P2;
- browser-first Character/Resident workflow;
- Three.js CCD IK parity gate.

## Architecture-chat operating rule

When Georg introduces a new idea:

1. find current source/donor;
2. decide whether it belongs to an existing strand;
3. avoid a new primary strand if it is really a module/capability;
4. identify current owner;
5. define one useful production outcome;
6. prepare future downstream jobs now when dependency is clear;
7. assign execution profile;
8. persist decision / catalog / Return;
9. do not execute the product unless Georg explicitly asks this chat to do so.

## Cost routing

Default:
- Web first.
- Sol Medium for normal implementation.
- Sol High for hard solver/architecture work.
- Claude Sonnet 5 for normal Cowork/Design/Blender jobs.
- Cowork only if persistent workspace is a real advantage.
- Work only for a Work-only capability.
- Opus 5.5 only as a named deep escalation.

Do not spend Work/Cowork merely to generate another briefing or status summary.

## Current WSA gate

Prepared handoff:
`WSA_HUB_V3_MOUNT_HANDOFF_2026-09-24.md`.

HUB-CTRL #202 remains Hub owner.

WSA should mount the v3 self-service catalog + execution metadata additively, not review/rewrite all briefings.

No new Hub architecture is needed.

## Current user-side production

Georg is currently building Racer/RKIT track parts with Blender MCP.

Do not interrupt or replace that work.

After the track candidate is checked in:
- recover exact source/head;
- route it through the existing Race/RKIT architecture;
- then choose the next Blender job only if there is a genuine Blender boundary.

Current prepared Character/Resident route:
- browser pose/scene first;
- Blender only for motion/retarget/rig/weights/topology/bake.

## Current IK gate

User-provided donor:
Three.js `webgl_animation_skinning_ik.html`.

Prepared job:
`IK-CCDIK-PARITY-01`.

Do not swap the current KFB solver before same-source A/B.

## What to update after any architecture write

Always update/additively preserve:
- architecture Return;
- architecture changelog;
- top-level Chat changelog;
- top-level Chat router if entrypoint changed;
- input/source locks;
- Hub catalog if jobs/metadata changed.

Then fetch:
- exact PR #204 head;
- intended changed files.

Timeout = UNKNOWN; inspect before retrying.

## Public boundary

Do not claim v3 self-service catalog is live until existing HUB-CTRL publishes it and
`https://kayfabizarro.pages.dev/kfb-hub/`
is opened with visible new content.

## One architecture gate

**HUB-V3-MOUNT through existing HUB-CTRL #202.**

Everything else should proceed through self-service jobs without returning here for routine planning.


## CURRENT RECOVERY DELTA · 2026-09-25 late evening · HUB LIVE-DATA + UX RECOVERY

Georg reports the current ToolBox Production-01 and World Integration-01 candidates are usable enough to continue.

Status for both:
**PROCEED PASS · not exhaustive detail acceptance.**

Do not reopen the old human-review gates merely because not every detail was tested.

### KFB Hub current truth

HUB-CTRL remains the only Hub owner:
- PR #202
- branch `work/hub-ctrl-01-2026-09-24`
- current head `2bbcb7964233bc703e231e78690108f593bd075c`.

The public shell is still **HUMAN TUNE / not accepted**.

Useful v3 Production Desk data/catalog logic must be preserved.

Exact accepted visual/UX donor recovered:
- `kfb-hub/index.html`
- main commit `dfaafac070747f9543b5eb5a635e2aaa74e57b83`
- blob `0de46343ddeb70a5f423876e75dc916ae7200c5b`
- accepted Hub UI v2 Paper/Dark + Today + Pocket Inbox.

Claude Design brief:
`tools/production_desk/HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md`.

Mandatory rule:
show the exact accepted donor in isolation before integrating current data.

### Hub live data

The public Desk shell already polls:
`bot/production-desk-update/registry/production/v1`
before falling back to main/embedded state.

Manual recovery refresh completed:
- bot branch head `7eeb606cb318fe1ff802fbf65ba6c0ef542bc91d`;
- manifest checkedAt `2026-09-25T17:15:29Z`;
- stale threshold 2 h;
- 19 current lanes;
- 90 self-service jobs / 42 READY / 48 HOLD;
- current ToolBox/World PROCEED PASS, Ear Rig, Hub UX Recovery and Hub Status Sync lanes present;
- obsolete WB-W0 / Hürth proof review items are no longer current operational review gates.

### Why freshness was failing

The Production Desk schedule exists on HUB-CTRL, but GitHub schedules run from the default branch.

Therefore the bot registry can become stale while the public Cloudflare shell remains available.

Prepared Web/GitHub fix:
`tools/production_desk/HUB_STATUS_SYNC_V1_2026-09-25.md`.

Target:
normal status changes update the bot registry and become visible on the public Hub without requiring a Cloudflare rebuild.

Do not introduce a second status DB / Worker / D1 unless raw-GitHub status sync proves insufficient.

### Decision capture direction

The UX candidate may expose:
`PASS · TUNE · HOLD · DONE · MISSING`
plus note.

Until a real writable owner exists:
- store locally;
- export/copy `kfb.hub-decision/1` sync packets;
- never imply localStorage is shared GitHub truth.

### Current Hub gates

1. **HUB STATUS SYNC V1** — durable live-registry freshness.
2. **HUB UX RECOVERY** — Claude Design Session Cut from accepted v2 donor.
3. Georg human review.
4. Only then publish a replacement shell.

No new Hub shell is accepted/live by this recovery checkpoint.


### HUB-STATUS-SYNC-01 technical gate

Freshness repair is now isolated in Draft PR **#215**:
- branch `chatgpt-web/hub-status-sync-v1-2026-09-25`;
- tested head `d45f215bce544ad1eb7e71a6aa743ca59919f08d`;
- one workflow file only;
- no rejected Hub shell / Cloudflare / runtime content.

CI:
- run `36168223283`;
- **18/18 Production Desk tests PASS**;
- online build PASS;
- registry **VALID**;
- result: 19 lanes · 2 LOOK_AT · 5 RUNNING · 7 CAN_START · 4 WAITING · 0 problems;
- PR events never publish the bot branch.

First CI failure was fixture setup only; repair pass 1 passed. No second repair pass.

Merge remains human/owner gated. Until merge, the manually refreshed live bot registry remains the current data source.


### Final Hub recovery pins · 2026-09-25

- HUB-CTRL current recovery docs/config lineage remains PR #202; latest owner branch continues independently.
- live bot registry: `bot/production-desk-update@cab4fcef34abfe7e438f31942db009c5ec960ca8`;
- live manifest source pin: HUB-CTRL `74c6fa5cd623dc378dec880905c6616f6a171754`;
- live counts: **3 LOOK_AT · 6 RUNNING · 6 CAN_START · 4 WAITING**;
- self-service catalog remains **90 jobs / 42 READY / 48 HOLD**;
- HUB-STATUS-SYNC-01 = Draft PR #215 @ `d45f215bce544ad1eb7e71a6aa743ca59919f08d`;
- PR #215 CI run `36168223283`: **18/18 tests PASS · online build PASS · registry VALID**;
- PR publish step correctly skipped during pull_request validation;
- merge is the remaining human/owner gate for durable scheduled freshness;
- current public Hub shell is still HUMAN TUNE; UX replacement waits for Claude Design donor-based review.

Exact pages.dev visibility of the refreshed registry is still not claimed from this tool.


### World / Resident visual corrections · 2026-09-25

Read:
`WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.

Recovery facts:
- Graveyard prototype: remove from current Human Review; keep only spatial-postmortem concept + grave-light flicker/lighting donor.
- MUSIC-PERF: TUNE, not Human Gate. Timeline/audio useful; current visible guitarist/drummer animations are superseded by newer S39 Resident Band sources.
- S39 band module is explicitly **without a baseplate** and designed to mount on arbitrary host surfaces.
- Future Resident scene reviews should be terrain-placeable, ground/support-aware and use WorldBuilder-compatible sky/light presentation.
- WB-D2 `FACADE_RULE v1` should become the ordinary-building facade rule beyond Hürth, including Cologne stock.
- Recurring OSM roof-brightening, lower-wall shadow edge and floating-contact artefacts are global presenter defects; preserve the existing `orientEG` / shadow-side / normalBias donor fix and test contact/clipping globally.


### Current Claude Design start briefs · 2026-09-25 late

Use:
- WorldBuilder: `CLAUDE_DESIGN_WORLD_INTEGRATION_CONTINUATION_2026-09-25.md`
- ToolBox: `CLAUDE_DESIGN_TOOLBOX_PRODUCTION_CONTINUATION_2026-09-25.md`

Both are continuation briefs from Georg's PROCEED PASS candidates.

Do not send the earlier WB2-design or ToolBox-Production-01 bootstrap briefs as current starts.

Blender MCP route note is parallel input only:
`VOICE_INPUT_UNCERTAIN: "Lüt" → Dom → "Müllheim"/Mülheim → "SAG"/SAE`.
Exact source/export pin required before integration.
