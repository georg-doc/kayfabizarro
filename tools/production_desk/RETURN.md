# CURRENT UPDATE · CLAY PRIORITY CORRECTION · 2026-09-26

Status: **TEXTURE SECONDARY · BLENDER LANE PARALLEL · NOT MVP-BLOCKING**

- Georg reports the texture question is already handled with Blender MCP.
- Asset-01 hash/source retrieval and Asset-03 look review are removed from the active WSA/Human critical path.
- PR #231 records the correction at `60e34f26facf1f4d203833b2ebbf6574d185dc6a`; an exact Blender artifact/ref remains a later intake fact, not a current PASS claim.
- Clay Hub lane moved `LOOK_AT → WAITING` with no user action.
- World r2 remains the active bounded MVP gate: `WORLD-R2-STAGE-PREP-01`.
- No runtime, Stage, Cloudflare publication, merge or Live promotion changed.

---

### Concurrent ClayBound asset review sync

HUB-CTRL metadata now routes **ClayBound · Asset 03 r2 · Human Review** to PR #228 / `tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/START_HERE.md`.

- Asset 01: HUMAN_ACCEPTED.
- Asset 02: explicitly deferred.
- Asset 03 r2: 4/4 tile criteria PASS; human look gate OPEN.
- Asset 03 r3: X/Y seam FAIL; failure-recovery evidence only; two repair passes spent.
- Blender application remains blocked until Georg PASS.
- This is source/config synchronization only. The frozen HUB-BRIEFING-SYNC DOM gate is unchanged; **no registry rebuild, root Cloudflare publication or public-verified claim** was made.

### Concurrent #222 freshness readback

After the source sync, PR #222 advanced to `f37c620ae60aa2b6f358a53257d767641980aed6` with compatible Racer HUD/W0 dispatch additions. The current Executor Board still contains the synchronized World Stage / ENV / ToolBox / Racer states. HUB-CTRL freshness pins were updated; this does not reopen the frozen DOM gate and does not publish the root Hub.

# CURRENT UPDATE · HUB-BRIEFING-SYNC-01 · FROZEN DOM GATE · 2026-09-26

Status: **BRIEFING/SOURCE SYNC COMPLETE · ROOT PUBLICATION STOPPED · FAILURE RECOVERY PRESERVED**

## Synchronized source truth
- WorldBuilder #190: `58028b07d7618926c40ffaec3bd4053dc88c0efd` · Contract Reset PASS · next `WORLD-R2-STAGE-PREP-01`.
- Production Architecture #204: final sync head `deec05c883de02836c3d699fa6e64d647d32a9f7`; self-service remains 96 jobs, now **42 READY / 54 HOLD**.
- ENV Preview #218: `88c64c29075f31d655f4777437bb1aa82069df17` · PUBLIC STAGE VERIFIED · Georg PASS_WITH_TUNE · completed foundation.
- ToolBox r2 #221: `da20e926c38fa8576f31bffc5442d96d44fe4d1b` · Georg TUNE / direction accepted · review gate closed.
- WSA/dispatch #222: `823bdb57c2ab30027cafcac9c867f5b6c3e8c9ac`; World Stage Prep + Track Core + Racer HUD/Billboards routing synchronized.
- B2b-P1: current PR #211 frozen 39/40 after two repair passes; no rebuild/pass 3.

## Hub source result
HUB-CTRL config now shows:
- WSA = APPROVED_WITH_TUNES;
- World r2 Stage Prep = CAN_START;
- Racer HUD + Billboard System = CAN_START in parallel;
- ENV Preview = completed/pass-with-tune;
- ToolBox r2 = completed/TUNE;
- Playable Track R0 remains HOLD;
- Production Desk itself = WAITING on DOM recovery.

## Validation
Attempt 1:
- run `36212815856`;
- stopped by the separate Hub-UX Session-Cut parity suite because its source fixture is absent on this owner branch.

Repair pass 1 / attempt 2:
- run `36212892871`;
- builder **16/16 PASS**;
- render unit **2/2 PASS**;
- online registry build PASS;
- validator **VALID**;
- Desk render PASS;
- DOM FAIL on card-face technical text + stale first copy-selector assumption.

Repair pass 2 / final attempt:
- run `36213057662` / job `108323464259`;
- builder **16/16 PASS**;
- render unit **2/2 PASS**;
- online registry **PASS**: 22 lanes · 3 LOOK_AT · 4 RUNNING · 5 CAN_START · 9 WAITING · 1 problem;
- registry **VALID**;
- Desk render **PASS**;
- embedded/live/main/polling PASS;
- generic paste-ready briefing copy PASS;
- drawer/details PASS;
- DOM remains FAIL because:
  1. at least one PR/SHA-like technical token is still visible on a card face;
  2. a later DOM assertion still hardcodes `vfx-sfx .btn.primary`, which is no longer a valid current lane/button assumption.

Repair budget exhausted. **No repair pass 3.**

## Publication
- `cloudflare-live`: unchanged by this slice;
- public root Hub: **not republished**;
- no new `https://kayfabizarro.pages.dev/kfb-hub/` revision is claimed;
- no product runtime, Stage product candidate, merge or Live product promotion changed.

Failure recovery:
`tools/production_desk/recovery/HUB_BRIEFING_SYNC_01/START_HERE.md`

Exactly one next gate:
**HUB-BRIEFING-SYNC-F1 · fresh DOM-contract census only.**

# CURRENT UPDATE · WORLD r2 CONTRACT RESET PASS · 2026-09-26

Status: **CONTRACT RESET PASS · STAGE PREP CAN START · NOT LIVE**

- PR #190 exact head: `58028b07d7618926c40ffaec3bd4053dc88c0efd`.
- No third runtime repair: the stale prose/variant selftest became a structured source/role contract.
- Evidence: **13/13 contract · 24/24 static owner/closure · Hürth 55/55 · Köln 55/55 · WB2 34/34 · browser harness 12/12**, with 0 page and failed-source errors.
- Surface Adapter boundary is documented: WorldBuilder owns editable base height; OSM/Track add bounded provenance-labelled constraints; Travel/TinySkies is not the world base and remains a presentation plus selected camera/mobility donor.
- PR #204 planning wording is synchronized at `158c926cfdc1332b319e2a3ccfbb950147b76896`; PR #218 Environment Preview metadata is synchronized at `88c64c29075f31d655f4777437bb1aa82069df17`.
- No World Stage, Cloudflare publication, merge or Live promotion is claimed.

Exactly one next World gate: **WORLD-R2-STAGE-PREP-01**.

---

# CURRENT UPDATE · TOOLBOX r2 HUMAN TUNE · 2026-09-26

Status: **GEORG TUNE · DIRECTION ACCEPTED · REVIEW GATE CLOSED · NOT LIVE**

- PR #221 human-result head: `da20e926c38fa8576f31bffc5442d96d44fe4d1b`.
- Existing evidence remains **33/33 repository + 20/20 public browser PASS**, with 0 public page/request failures.
- Deferred, non-blocking: strong motion/static streak noise; incorrect actor ground contact; several State-loop animation calibrations; below-actor Orbit range for fall/flight inspection.
- These remain separate rendering, grounding, animation and shared-camera follow-ups. The ToolBox r2 integration slice is not reopened.
- No merge and no Live promotion are authorized by this decision alone.

---

# PRIOR UPDATE · ENV-PREVIEW-01 HUMAN PASS_WITH_TUNE + TOOLBOX r2 PUBLIC VERIFIED · 2026-09-26

## ENV-PREVIEW-01

Status: **GEORG PASS_WITH_TUNE · FOUNDATION ACCEPTED · NOT LIVE**

- PR #218 final human-gate docs head: `97a07ab9d805daf4e11d8e224e60f1885dcbd268`.
- Public Stage remains **9/9 PASS**.
- Deferred, non-blocking: Resident selector discoverability; below-actor camera range; WorldBuilder duplicate-head actor assembly; bright thin-geometry shadow edges; Night readability/task lighting.
- The environment adapter is not reopened by those items.

## ToolBox Production-01 r2

Status: **PUBLIC_VERIFIED · HUMAN REVIEW OPEN · NOT LIVE**

- Runtime owner remains PR #185; no runtime-owner module changed in the review recovery.
- Review owner: PR #221 at `36315aaeffe2029300d445fdb1ffbaa569519638`.
- Repository browser: **33/33 PASS**.
- Exact public Stage + ToolBox front door + live Registry + rendered Hub: **20/20 PASS**.
- Public page/request failures: **0**.
- Direct review: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/`.

Exactly one current ToolBox gate:
**Georg reviews Source Object → State loop → Pose/IK and returns PASS / TUNE / REJECT.**

---

# PRIOR UPDATE · ENV-PREVIEW-01 PUBLIC STAGE · 2026-09-26

## 2026-09-26 · Hub UX Recovery v2 · Stage rehome preserved / public browser verify blocked

Status: **STOP AFTER TWO PUBLIC-VERIFY PASSES · CANDIDATE PRESERVED · NO LIVE HUB PROMOTION**

- owner: HUB-CTRL #202 / `tools/production_desk`
- owner branch / PR: `work/hub-ctrl-01-2026-09-24` / #202
- exact candidate rehome checkpoint: `66b84ef1ddbac48f343c29d66edccad5276c61ce`
- source-seal checkpoint: `290fda4c5394f9ed66f2a619e00c7ac6a56fda95`
- Stage-router checkpoint before stop: `64e57cf893eac300a4b694792a204e076c0b339e`
- preserved publication branch: `cloudflare-live@69cfd8c6329f23725eefb84fcf908d6526cfd19d`
- candidate blob: `1fb367c70412d18ef9b0802c3feb2019357be525`
- accepted donor blob: `0de46343ddeb70a5f423876e75dc916ae7200c5b`
- donor-proof wrapper blob: `1b1f67a7ed5497f765ac4d22f56b0933859ce12a`
- source seal: **9/9 PASS**
- Production-Desk Actions suite: **NOT_RUN on this head** because `.github/workflows/production-desk.yml` is not present on `main`; GitHub emitted no PR run.
- public branch readback: **PASS**.
- exact pages.dev browser verification: **UNKNOWN / BLOCKED BY SESSION NETWORK** after two independent attempts.
- candidate remains preserved as an unlinked Child path; Stage navigation does **not** expose it as a human gate while public verification is unknown.
- full recovery export: `tools/production_desk/failure-recovery/HUB_UX_RECOVERY_STAGE_PUBLIC_2026-09-26/START_HERE.md`.

Exactly one active next gate: **PUBLIC BROWSER VERIFY · HUB UX RECOVERY STAGE**.


Status: **HUB SOURCE → LOOK_AT · PUBLIC STAGE 9/9 PASS · HUMAN REVIEW OPEN**

- Source: PR #218 / `chatgpt-web/env-preview-01-2026-09-25@a50f2fb05eac0a6e9a8f6916905256a1a23a56a5`.
- Public runtime publication: `cloudflare-live@bec8688c0c5a4743d8f484193939a74112d977c4`.
- Final public metadata head: `cloudflare-live@f4e76abddef2f416fdccc34cb3eb6c0a4453e776`.
- Direct review: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/environment-preview-01/`.
- Contract **30/30 PASS**; existing direct consumers **15/15 PASS**; local portable Stage **9/9 PASS**; exact public Stage **9/9 PASS**.
- Resident Atlas and ToolBox keep their renderer/camera/actor/animation/editor owners.
- WorldBuilder, OSM and terrain owners retain world/height authority; Travel/TinySkies is only the current sky/weather/light/fog/mood donor.
- The Hub config now exposes one `LOOK_AT` lane and one World/Terrain tool link through the existing route-check contract.
- No merge and no Live promotion.

Exactly one next gate:
**Georg compares World Match with Source Isolation in both views and returns PASS or TUNE.**

# CURRENT UPDATE · TOOLBOX r2 STAGE REVIEW GREEN · 2026-09-26

Status: **HUB SOURCE → LOOK_AT · PUBLIC MARKER VERIFICATION PENDING**

ToolBox runtime owner remains PR #185. Runtime-tested r2 head:
`5dcf34bcdf9d87445e927c98f60d41adae72f00e`.

Fresh recovery review:
- Draft PR #221;
- branch `chatgpt-web/toolbox-r2-stage-review-recovery-2026-09-26`;
- final current review head `dc9467305a190a431d07cc91ccf397fafb0e6123`;
- final browser workflow `36201627178` SUCCESS;
- review assertions **33/33 PASS**;
- exact Stage package mirrored to `cloudflare-live@44fda28e65ba7fd7880660159777ba4ea71f1c38`.

The Hub lane now routes to the direct review path:
`kfb-hub/stage/toolbox/production-01-r2/index.html`.

This is not yet a PUBLIC_VERIFIED claim. The exact pages.dev route must still expose the recovery marker after Cloudflare deployment, and the generated Hub must still be published/read back.

Exactly one ToolBox next gate:
**direct Stage + Hub public verification → Georg PASS / TUNE / REJECT.**

No merge and no Live promotion.

---

# CURRENT UPDATE · RACER TRACK CORE ROUTING · 2026-09-26

Status: **HUB SOURCE METADATA CURRENT · ROOT REGENERATION/PUBLICATION NOT CLAIMED**

Racer lane now routes to the Track-Core planning source rather than the older RKIT-08/09 LOOP_REAL-first gate.

Current source:

- PR #219;
- branch `georg-doc-patch-2`;
- expected source head `c3ccd0d85a68593f5a545fd41ae0ef2112391965`;
- current gate `TRACK-CORE-0 · ChatGPT Web census + core contract`;
- current executor chain: Web → Claude Coworker + Blender MCP → Web → Claude Design.

Perplexity transition research is represented only as reviewed mechanism input:

- true Clothoid/Euler curvature easing;
- connector boundary state;
- staggered transition zones;
- separate visual style layers.

The supplied example Blender Python generator is not a production donor.

Downstream:

- Playable Track R0;
- real Hürth → Dom → Rhein → Mülheimer Brücke → SAE OSM Route 01.

Race PR #42 / RKIT-11 remains the frozen Track-Core acceptance fixture and is not presented as Race-driven or public.

This update changes only HUB-CTRL source/config metadata.

- new Hub builder/browser tests: **0**
- new root Hub generation: **0**
- new Cloudflare publication: **0**
- PUBLIC_VERIFIED claim: **none**

Exactly one Racer next gate:

**TRACK-CORE-0 · ChatGPT Web census + core contract.**

---



## CURRENT UPDATE · TOOLBOX r2 GREEN / WORLD r2 STOP · 2026-09-26

### ToolBox
Receiving-owner PR #185 is technically green.

Runtime-tested head:
`5dcf34bcdf9d87445e927c98f60d41adae72f00e`

Actions `36197260540` SUCCESS:
31/31 + 34/34 static, 20/20 + 25/25 browser, 13/13 plain-review browser.

A new owner-backed Stage review source now exists on PR #185; its own browser gate is separate and still pending at this checkpoint.

### World
Receiving-owner PR #190 is now in **failure recovery / WAITING**.

Frozen runtime candidate:
`204afd6dbb1285f8cd77807af0db5fdd6e75308d`.

Static 20/20 PASS.
Final browser run `36198999279` FAIL after repair budget.

Final evidence shows:
- Hürth boot;
- 700 buildings;
- 13 semantic states;
- 0 page errors;
- 0 failed requests.

Failure is the stale selftest variant-label contract, not source loading.

Recovery:
`tools/KFB-ToolBox/worldbuilder/world-integration-01/failure-recovery/`

Next World gate:
`WORLD-R2-CONTRACT-RESET-01`.

Hub routing reflects:
ToolBox = RUNNING / Stage next.
World = WAITING / contract reset next.



## CURRENT UPDATE · WORLD / TOOLBOX R2 + HUB UX CUT · 2026-09-26

Status: **SOURCE ROUTING UPDATED · LIVE REGISTRY REFRESH NEXT · NO SHELL CHANGE**

Main intake head:
`b24b129b787beecd0ca0760611ac4044d3f7189c`.

Architecture intake:
`skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/INTAKE_WORLD_TOOLBOX_R2_HUBUX_2026-09-26.md`.

### ToolBox
Current lane = **RUNNING**.
Claude r2 arrived with reported 19/19 preview selftest and new owner/profile candidates.
Next = Web/GitHub receiving-owner rehome + repository/browser checks + direct Stage review.

### World
Current lane = **WAITING** behind ToolBox locomotion/profile owner rehome.
Claude r2 arrived with reported 55/55 Hürth + 55/55 Cologne.
World must consume ToolBox shared profile truth before promotion.

### Hub UX
UX v2 Session Cut also arrived.
Current lane = **RUNNING** under HUB-CTRL.
Reproduce/rehome candidate first; no public shell replacement until direct pages.dev review + Georg final gate.

### Boundaries
- no Inbox candidate promoted by location alone;
- no raw Inbox file used as a Human review URL;
- no Cloudflare shell publication in this checkpoint;
- Status Sync PR #215 remains a separate merge gate.



## CURRENT UPDATE · WORLD / TOOLBOX CLAUDE CONTINUATION BRIEFS · 2026-09-25

Current paste-ready starts now exposed in Hub:

- World Integration:
  `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/CLAUDE_DESIGN_WORLD_INTEGRATION_CONTINUATION_2026-09-25.md`
- ToolBox Production:
  `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/CLAUDE_DESIGN_TOOLBOX_PRODUCTION_CONTINUATION_2026-09-25.md`

Both continue Georg PROCEED PASS candidates rather than restarting them.

World brief:
- shared KayKit locomotion consumer;
- preserve in-world WB2 authoring;
- global OSM facade / roof / contact-shadow presentation;
- Blender MCP route pieces are future pinned intake only.

ToolBox brief:
- canonical KayKit locomotion profiles;
- shared Pose/IK owner;
- fix pose-rig wrist/intermediate-bone chain once;
- Ear Rig first consumer;
- S39 no-baseplate band fixture;
- Vehicle/Flight seams prepared, not expanded into this gate.

Source validation: **11/11 PASS** in Architecture TEST_REPORT.

No Live shell or product runtime promoted.



## CURRENT UPDATE · FINAL GRAVEYARD / MUSIC LIVE ROUTING · 2026-09-25

Live bot registry:
`bot/production-desk-update@ce06ab9b3f04b2c58fe165fc8efa78aa22f885e6`

Manifest:
- checkedAt `2026-09-25T18:06:00Z`;
- **1 LOOK_AT · 6 RUNNING · 7 CAN_START · 4 WAITING**;
- 18 current lanes;
- 90 self-service jobs / 42 READY / 48 HOLD;
- moved = 0.

Corrections:
- Graveyard removed from current review; archive/concept/lighting donor only.
- Music Performance moved to CAN_START/TUNE; timeline/audio donor retained, newer S39 band animations are preferred.
- Music tool card marked `TUNE / Donor`.
- shared architecture rule: `WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.
- no public Hub shell changed.



## CURRENT UPDATE · GRAVEYARD / MUSIC / WORLD PRESENTATION CORRECTION · 2026-09-25

Status: **HUB ROUTING CORRECTED · NO PUBLIC SHELL CHANGE**

### Graveyard
The current Graveyard review is removed from current Human Review.

Correct status:
**historical concept prototype / lighting donor only**.

Not authoritative:
- movement;
- asset placement;
- world/gameplay integration.

Useful:
- spatial Postmortem/Graveyard concept for a future game-version of the Hub;
- grave-light illumination and flicker atmosphere.

### Music Performance
Current public MUSIC-PERF surface is no longer a human acceptance gate.

Correct status:
**TUNE / donor**.

Keep:
- timeline;
- beat/bar ruler;
- song/audio coupling.

Replace as canonical performance source:
- old visible guitarist/drummer animations.

Preferred source:
S39 Resident Band Module:
- Guitar A / ml.guitar.a.fit;
- drum.v5c + measured strike/contact work;
- no baseplate.

### Resident scene placement
S39 proves the desired module contract:
host surface + anchor, local support plane, **no mandatory baseplate**.

Future Resident demos should be terrain-placeable and use WorldBuilder-compatible sky/light/ground presentation.

### OSM / World presentation
Shared architecture rule:
`WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.

It promotes:
- WB-D2 FACADE_RULE v1 beyond Hürth to ordinary Cologne buildings;
- deterministic mildly asymmetric windows/doors;
- recurring roof/shadow fix from WB-D1 as a global OSM presenter rule;
- contact/shadow/clipping checks to prevent floating buildings/props.

No new runtime owner or public shell was introduced.



## CURRENT UPDATE · LIVE REGISTRY AFTER STATUS-SYNC CI · 2026-09-25

Status: **LIVE BOT DATA REFRESHED · PUBLIC SHELL STILL TUNE**

Current live data branch:
`bot/production-desk-update@cab4fcef34abfe7e438f31942db009c5ec960ca8`.

Manifest:
- source = HUB-CTRL `74c6fa5cd623dc378dec880905c6616f6a171754`;
- checkedAt = `2026-09-25T17:41:10Z`;
- stale threshold = **2 h**;
- **3 LOOK_AT · 6 RUNNING · 6 CAN_START · 4 WAITING**;
- 19 lanes;
- 90 self-service jobs / 42 READY / 48 HOLD.

Current new LOOK_AT item:
**HUB-STATUS-SYNC-01 · PR #215 · CI PASS**.
It asks only whether the workflow-only PR may merge to main to activate scheduled 30-minute registry refreshes.

The bot update contains no Hub HTML and no Cloudflare publication.

Exact public pages.dev rendering of this refreshed bot data remains unverified from the current URL tool.



## CURRENT UPDATE · HUB-STATUS-SYNC-01 CI PASS · 2026-09-25

Status: **DRAFT PR #215 · CI PASS · MERGE/HUMAN GATE OPEN**

Separate status-sync PR:
- PR #215;
- branch `chatgpt-web/hub-status-sync-v1-2026-09-25`;
- tested head `d45f215bce544ad1eb7e71a6aa743ca59919f08d`;
- exactly one changed file: `.github/workflows/kfb-hub-status-sync.yml`.

Purpose:
make the existing `bot/production-desk-update` registry refresh durable from the default branch without merging the human-rejected Hub shell.

CI run:
- workflow run `36168223283`;
- job `108181095987`;
- **18/18 inherited Production Desk tests PASS**;
- online registry build PASS;
- built **19 lanes · 2 LOOK_AT · 5 RUNNING · 7 CAN_START · 4 WAITING · 0 problems**;
- registry validator: **VALID**;
- content hash `6a85be902e95…`;
- current HUB-CTRL source resolved dynamically to `work/hub-ctrl-01-2026-09-24@2bbcb7964233bc703e231e78690108f593bd075c`;
- publish decision = `content-changed`;
- publish step correctly **SKIPPED on pull_request**, proving the PR cannot mutate Live registry during review.

First CI attempt failed only because inherited render tests expected the existing bot-registry fixture. Repair pass 1 seeds that fixture before tests; second run passed. No second repair pass needed.

Merge is not authorized automatically.
After merge to main, schedule/dispatch becomes available and may update only the bot registry, not Hub HTML or Cloudflare.



## CURRENT UPDATE · HUB RECOVERY / LIVE REGISTRY / UX DONOR · 2026-09-25

Status: **LIVE DATA REFRESHED · CURRENT SHELL STILL HUMAN-TUNE · UX RECOVERY + DURABLE SYNC PREPARED**

### User decision now recorded

ToolBox Production-01 and World Integration-01 are both:
**PROCEED PASS · not exhaustive detail acceptance**.

They no longer occupy old review gates.

### Live registry recovery

The public Hub shell already polls:
`bot/production-desk-update/registry/production/v1`
before main/embedded fallback.

That live registry was manually refreshed after the timeout and now carries:
- ToolBox Production-01 → PROCEED PASS / next shared locomotion + Ear Rig;
- World Integration-01 → PROCEED PASS / rehome then OSM+Mobility;
- Ear Rig / EAR-DANGLE-01;
- Hub UX Recovery;
- Hub Status Sync v1;
- 90 self-service jobs / 42 READY / 48 HOLD.

Current bot manifest:
- checkedAt: `2026-09-25T17:15:29Z`;
- staleAfterHours: **2**;
- source: HUB-CTRL;
- old WB-W0 and Hürth proof review cards removed from current operational review queue.

This refresh changes live Hub **data**, not the public shell.

### Hub UX

The current v3 Production Desk shell remains **HUMAN TUNE / not accepted**.

Exact accepted donor recovered:
- main commit `dfaafac070747f9543b5eb5a635e2aaa74e57b83`;
- `kfb-hub/index.html`;
- blob `0de46343ddeb70a5f423876e75dc916ae7200c5b`;
- accepted Hub UI v2 Paper/Dark, Today flow and Pocket Inbox.

Prepared Claude Design sprint:
`tools/production_desk/HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md`

Hard rule:
show that exact donor in isolation first, then mount current data into it. Do not redesign from zero.

Candidate UX adds an honest decision queue:
`PASS · TUNE · HOLD · DONE · MISSING`
with local persistence + export/copy sync packet only. It must not pretend to be shared persistence.

### Durable freshness

Root cause of the hours-old state:
GitHub scheduled workflows only run from the default branch, while the Production Desk workflow/config is still on HUB-CTRL.

Prepared Web/GitHub repair:
`tools/production_desk/HUB_STATUS_SYNC_V1_2026-09-25.md`

Target:
public Hub reads fresh bot-registry state within minutes without requiring Cloudflare rebuild for ordinary status changes.

No second database / Worker / D1 is authorized before the raw-GitHub status path is proven insufficient.

### Current gates

1. **HUB STATUS SYNC V1** — make bot-registry refresh durable.
2. **HUB UX RECOVERY** — Claude Design Session Cut from accepted v2 donor.
3. Georg reviews the UX candidate.
4. Only then publish a replacement shell.

No new Live shell is claimed by this checkpoint.

# CURRENT UPDATE · WB-D2 / S40 ROOT HUB PUBLICATION · 2026-09-25

Status: **DEPLOY COMMIT WRITTEN · PUBLIC PROOF RUNNING**

Current Hub source:
- HUB-CTRL root fallback = **90 jobs / 42 READY / 48 HOLD**;
- **19 To-do lanes**;
- WB2 HUMAN PASS → Claude Design remains CAN_START;
- WB-D2 Hürth/Alstädten shell = WAITING behind WB2 Design/Rehome + WB-ZONE-SEAM;
- Resident Disco S40 Bridge = CAN_START;
- B3 Billboard handover ref remains PR #211 branch, not main.

Publication:
- `cloudflare-live@2781b7ba064a6a1bb5eedf8fe736e92fe4ccbf8e`;
- root blob `f934ee1436ee0eb1f7473fce71a448a1dc4bdbe9`;
- source markers verified in the published blob;
- Cloudflare/Public-Proof checks were RUNNING at this checkpoint.

No WB-D2 or S40 product Stage route was created. This publication changes the Hub root only.

---

# CURRENT UPDATE · WB-D2 + RESIDENT S40 HUB ROUTING · 2026-09-25

Status: **HUB SOURCE UPDATED · LIVE REGISTRY REFRESH NEXT**

New Inbox updates classified without promoting Inbox copies to owners:

### WorldBuilder WB-D2
- source upload `706c3f121bc3a305778306917613ea23eb772c16`;
- current Hub lane: **WAITING**;
- Hürth/Alstädten shell is presentation candidate only;
- current priority remains WB2 HUMAN PASS → Claude Design;
- after Web rehome, next integration gate is `WB-ZONE-SEAM-01`;
- Alstädten OSM must be re-cached by OSM City Lab before source promotion.

### Resident Disco S40
- source upload `a46dbdff150362e7153c143b21fa76ffe8ffb5e4`;
- current Hub lane: **CAN_START**;
- use the existing S9/S40 candidate; do not rebuild Source Cast/Audition;
- bridge owner hygiene, one performance transport and Motion Library metadata, then prepare bounded human review;
- unresolved Graft raw@main, mic slot, HIT-2 placeholder, set-not-measured downbeats and Band second transport remain explicit.

Architecture target after this intake: **90 jobs / 42 READY / 48 HOLD**.

No new product Stage route or Live gameplay claim.

---

# CURRENT UPDATE · ROOT HUB CLOUDFLARE PUBLISH · 2026-09-25

Status: **DEPLOY COMMIT WRITTEN · CLOUDLFARE/PUBLIC-PROOF RUNNING · EXACT URL VERIFY UNKNOWN**

Publication:
- `cloudflare-live@8101c2c18f2210720649a3ecb6e3f388176eed23`;
- root blob `ccf3a46dde16e99cdda11b13f628725e690d832b`;
- source root/desk contains **89 jobs / 43 READY / 46 HOLD**, WB2 HUMAN PASS→Claude, LOOP_REAL gate, Direct FBX, v17+ ToolBox and NPC-LIFE markers;
- live registry branch `bot/production-desk-update` is restored and carries the same 89-job self-service source.

Current checks at handoff:
- Cloudflare Pages: **RUNNING**;
- four public-proof jobs: **RUNNING**;
- exact `https://kayfabizarro.pages.dev/kfb-hub/` could not be opened by the available URL tool, so **PUBLIC_VERIFIED is not claimed yet**.

No product Stage route, merge or Live product promotion was changed by this Root-Hub refresh.

---

# CURRENT UPDATE · ROOT HUB 89-JOB REFRESH · 2026-09-25

Status: **SOURCE RENDERED · LIVE REGISTRY RECOVERED · CLOUDFLARE ROOT PUBLICATION NEXT**

Current Hub source:
- HUB-CTRL PR #202;
- rendered root/desk head `51eedf5297b19cfbf6ce1faf2986a941f4942f24`;
- `kfb-hub/index.html` and `tools/production_desk/desk/KFB_PRODUCTION_DESK_V0.html` are byte-identical.

Live registry branch:
`bot/production-desk-update` recovered from HUB-CTRL and refreshed.

Current Registry:
- **18 lanes**;
- **4 LOOK_AT / 7 RUNNING / 2 CAN_START / 5 WAITING**;
- **89 briefings / 43 READY / 46 HOLD / 89 prompts**;
- **10/10 current tools available**;
- Work/WSA = **NOT_NEEDED**.

Current focus visible in Hub:
- WB2 HUMAN PASS → Claude Design authoring/UI refinement;
- WorldBuilder Mobility waits behind WB2 design + technical dependencies;
- Racer RKIT-08/09 → LOOP_REAL first, no world placement yet;
- ToolBox Production / v17+ / Direct-FBX with AN-PROFILE human FAIL kept explicit;
- NPC-LIFE running;
- Music Performance remains a human review item;
- Resident Disco / FrizzleBob body family / Direct FBX / AI-Town-KISS available through the self-service catalogue.

Registry recovery note:
the scheduled bot branch was absent, so this sync restored the branch manually through the existing HUB-CTRL owner. The Hub already prefers this branch before main/fallback.

Exactly one next gate:
publish the rendered root Hub file to `cloudflare-live`, then verify deployment. Do not claim PUBLIC_VERIFIED unless the exact pages.dev route can be opened and the 89-job revision is visible.

---

# CURRENT UPDATE · WB2 HUMAN PASS → CLAUDE DESIGN · 2026-09-25

Status: **WB2 ACCEPTED · CLAUDE DESIGN CURRENT · NO NEW CLOUDFLARE / NO MERGE**

WorldBuilder WB2:
- PR #190 · `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`;
- GEORG HUMAN PASS;
- accepted interaction: Raise/Lower · Radius/Strength · Wheel/Touchpad Radius · Space-Orbit · `1/2/3` · Undo/Clear · Save/Reload · return to shared Object Edit.

Current Hub routing:
- WB2 Claude Design authoring/UI refinement = **CAN_START / P0**;
- use the existing `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` handoff;
- Mobility MVP is now WAITING behind this design gate and its existing technical dependencies;
- Smooth and Flatten/Set Height remain later separate Web slices;
- shared editor R3 uniform `−/+` remains optional/non-blocking.

No new WB2 Cloudflare publication is claimed. PR #190 stays Draft/unmerged.

Architecture self-service target is now **89 jobs / 43 READY / 46 HOLD**.

---

# CURRENT UPDATE · RACER RKIT-08/09 · 2026-09-25

Status: **TRACK-SOCKET REGISTERED · NOTHING DRIVEN · WORLD PLACEMENT BLOCKED**

Race source:
- PR #41 · `chat/rkit-08-09-stunts-2026-09-25`;
- registration implementation head `0bbdc539c0d26c8d1feb40a7eda53162a66e7070`;
- current PR head `22c3b2e2ebb66f1da999116e1b9547ac93d6a91d` (Recovery/Changelog added).

Registered by reference:
LOOP_REAL · LOOP_SLIM · LOOP_MAG_HERO · LOOP_MAG_CASCADE · SKYRAMP-01.

Binding gate:
**Race drives LOOP_REAL first.**

Until that measured Rapier result:
- later stunt modules remain HOLD;
- MAG/cloud-pad behavior remains unimplemented Race-owned work;
- WorldBuilder placement remains blocked;
- no Stage/public gameplay claim.

---

# CURRENT UPDATE · TOOLBOX HUMAN FAIL ALIGNMENT · 2026-09-24

Status: **HUB SOURCE ALIGNED · AN-PROFILE-02 HUMAN FAIL/HOLD · PRODUCT OWNER PRESERVED**

Parallel ToolBox recovery clarified the distinction:
- technical owner/runtime evidence remains useful;
- **AN-PROFILE-02 human review is FAIL/HOLD**;
- observed human failure: source/GLB load failure plus measurement/data palettes obstructing the 3D stage;
- failed review surfaces stay frozen;
- WorldBuilder Motion must not be promoted from that review;
- future State/Action / Direct-FBX work needs a new bounded review surface with real source loading and an unobstructed stage.

Hub Today + ToolBox source card now say this explicitly.

Root 88-job Production Desk regeneration remains pending.

---

# CURRENT UPDATE · MVP FOCUS / TOOLBOX ROUTER · 2026-09-24

Status: **HUB SOURCE CURRENT · TOOLBOX/STAGE SOURCE UPDATED · ROOT 88-JOB DESK REBUILD STILL PENDING**

Architecture source:
`georg-doc/kayfabizarro#204` · current self-service target **13 strands / 88 jobs / 42 READY / 46 HOLD**.

Current visible Hub source changes:
- Today: ToolBox Production/v17+, WorldBuilder Mobility, NPC-LIFE and Racer next gate are current;
- old Dance D1 is retained as history and points to `RES-DISCO-01`;
- ToolBox Stage page now contains **29 cards = 10 public + 5 missing/blocked + 14 source/briefs**;
- all ten public ToolBox routes were re-read on `cloudflare-live@597930b8...`;
- new v17+/Direct-FBX/FrizzleBob-body/Resident-Disco items are explicitly source/brief cards, not fake public previews;
- Stage navigator ToolBox card reflects the same counts/current focus.

Root Production Desk boundary:
- the self-service builder already points at PR #204 and will ingest the 88-job catalog;
- connector-authored commits have not yet produced a fresh Production Desk registry run on this current source;
- therefore **the public root Hub is not yet claimed to show all 88 jobs**.

Work/WSA remains unnecessary.

---

# CURRENT UPDATE · KFB FOCUS RECOVERY / WORK ROUTING · 2026-09-24

Status: **HUB SOURCE METADATA CURRENT · NO ROOT DESK REPUBLISH CLAIMED**

Current architecture recovery source:
`georg-doc/kayfabizarro#204` at `298378fc00f13bcca5fda35b3e1564063d88187f`.

Current focus:
World Building · Resident Scenes · ToolBox · Car Racer.

The three newest Flow Design Inbox exports have been classified in the architecture owner and are not promoted as Hub tools merely because they were uploaded.

Minimal WSA/Work routing:
- current Work decision: **no Work execution**;
- WorldBuilder Flow shell → baked Cologne seam stays Web/GitHub;
- Resident Card / Resident Band wait for Georg visual/pose gates;
- Audio calibration is accepted;
- MUSIC-PERF remains the existing public human-review gate;
- ToolBox direct runtime and repaired plain review transport are green (20/20 coherent · 25/25 Animation Studio · 13/13 plain review);
- Racer TRACK_A real Rapier runtime/contact proof stays with the documented Web/Race owner.

Handoff:
`skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/WSA_WORK_FOCUS_HANDOFF_2026-09-24.md`.

Public root Production Desk refresh remains a separate HUB-CTRL gate. This metadata update does not claim a new public root snapshot.

---

# CURRENT UPDATE · MUSIC-PERF-01 PUBLIC REVIEW MOUNT · 2026-09-24

Status: **STAGE NAVIGATOR + DIRECT REVIEW PUBLIC_VERIFIED · ROOT DESK REBUILD STILL SEPARATE**

HUB-CTRL remains the only Hub/registry/render owner.

MUSIC-PERF source additions on this owner:
- `tools/production_desk/config.json` now contains one `LOOK_AT` lane `music-perf-01`;
- the same config contains one Tool entry `music-performance`;
- `kfb-hub/stage/index.html` contains one Human Gate card linked to the exact Stage route;
- HUB-CTRL source head carrying those additions before this note: `79309a28f90b1b65643ac3ecf13363ae82a01619`.

Public publication:
- exact MUSIC-PERF stage files were mirrored without rebuilding the donor at `cloudflare-live@a29b2cdb140238d2d1056dbffaad7065d87f9fe3`;
- the Stage navigator link was published additively at `cloudflare-live@5658557e8d23a68ea1f5f6183d237c9a3284e29a`;
- direct review: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`;
- Stage navigator: `https://kayfabizarro.pages.dev/kfb-hub/stage/`.

Public proof:
- MUSIC-PERF public QA run `36047130373` / job `107793328531`;
- **22/22 PASS**;
- artifact `10829491166`;
- digest `sha256:d9461a8b85e30b2e53d32b8d26db3af7fbd365147e65b048c465e10c657c2b56`;
- direct route marker, exact ORB/song pins, public scrub/playback, Stage card/link, 0 page errors and 0 HTTP failures all verified.

Important boundary:
- this does **not** claim the generated root `kfb-hub/index.html` Production Desk snapshot has been rebuilt from the newest HUB-CTRL config;
- the existing Production Desk workflow still needs its separate regeneration gate;
- the public Stage navigator is current and reachable through the existing Hub → Stage path;
- MUSIC-PERF human result remains **PENDING**;
- no PR #207 merge or ToolBox owner promotion occurred.

Exactly one next MUSIC-PERF gate:
Georg reviews the direct Stage route and returns PASS / TUNE / REJECT.

---

# CURRENT UPDATE · Recovery test status · 2026-09-24

Status: **TEST FIX COMMITTED · HUB REBUILD NOT YET VERIFIED · PUBLIC REFRESH PENDING**

What happened:
- the last Production Desk workflow failure was traced to a stale browser-test assumption, not to the Hub catalog;
- the test expected the Curtain lane to own a briefing even though that lane intentionally has no briefing now;
- the test was repaired to use any current lane that actually has a real briefing source;
- the current architecture source still contains the two newest READY jobs and remains the regeneration source.

Important evidence boundary:
- the GitHub connector write did not launch a new `KFB Production Desk Registry` workflow run;
- therefore the refreshed 81-job Hub build is still **UNVERIFIED**;
- a Cloudflare preview check started separately, but that is not a substitute for the Hub registry/browser test;
- no public refresh is claimed.

Exactly one next gate:
run the existing Production Desk workflow against the current HUB-CTRL head, confirm the regenerated catalog/browser tests, then use the existing publication path once.

---

# CURRENT UPDATE · Recovery sync · 2026-09-24

Status: **SOURCE SYNC CHECKPOINT · PUBLIC HUB REFRESH NOT YET CLAIMED**

In plain language:
- the current production plan now contains two additional startable briefings:
  1. the Cologne WorldBuilder visual/authoring shell;
  2. the Resident Card speculation scene based on the Pet Podcast donor.
- the architecture source already contains both jobs;
- this existing HUB-CTRL branch remains the only Hub owner;
- the Hub must regenerate from the current architecture source rather than creating another registry or Hub;
- no runtime owner changes, no merge and no Live promotion are authorized by this checkpoint.

Current architecture source for regeneration:
`a7b4d9c4f6e541a50a640f42182d5ec4cf332bd7`.

Expected result of the existing builder:
**13 strands · 81 jobs · 38 READY · 43 HOLD**.

Next gate:
the existing HUB-CTRL pull-request workflow must regenerate and validate the Hub from that source. Only after that evidence exists may the normal publication owner refresh the public Hub once.

---

# CURRENT UPDATE · Toolbox Stage triage · 2026-09-24

Status: **HUMAN TRIAGE APPLIED IN HUB SOURCE · PUBLICATION PENDING**

Removed from the current Hub Tools shelf:
- EyeRig Batch
- EyeRig Legacy
- KayKit Motion Lab v1
- Ranged Calibration v1
- Tileable Macro Seam Lab
- World-Building Preflight

Reason: Georg reports these public Stage surfaces as broken, misleading, incomplete or no longer useful.

Kept:
- Card Zone Lab v2, renamed **Recovery Reference / Donor** rather than current product tool.

Important:
the old pages and source remain in the repository/history. This is a Hub visibility/status correction, not destructive cleanup.

Current productive replacements live in the v3 catalog:
- ToolBox coherent integration
- TB-EYE-01
- TB-POSE-01
- TB-ANIM-01
- WorldBuilder / World Zone / Locomotion jobs

This source correction still needs one Hub regenerate/publish pass before the public page reflects it.

---

# CURRENT UPDATE · Racer external status sync · 2026-09-24

Status: **HUB SOURCE UPDATED · PUBLICATION PENDING**

- HUB-CTRL branch now records Racer at private PR #39 / RKIT-06 / head `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.
- Previous public/registry Racer entry at PR #33 was stale because `build.py` deliberately returns early for `external:true` lanes and never queries private cross-repo state.
- One consolidated Racer lane remains; RKIT #34→#39 are a stacked implementation history, not six Hub lanes.
- Current RKIT-06 package contains TRACK_A_STUNT_8, Pit Lane, SWITCH_Y, flap-return/tunnel shortcut and Trankgasse OSM geometry.
- Next gate: real Race/Rapier runtime test on TRACK_A; WorldBuilder consumes baked geometry/metadata later.
- This checkpoint does **not** claim the public Hub has been regenerated/published yet.

### Durable fix

Recommended low-cost bridge:

`private owner repo → owning Web/GitHub Bridge writes compact status mirror into kayfabizarro → Production Desk reads same-repo mirror`.

This avoids broad private-repo crawl permissions and avoids a Work/LLM refresh just to keep Hub status current.

---

# RETURN · HUB-V3-MOUNT · self-service catalog beside Today · 2026-09-24

Status: **PUBLIC_VERIFIED · 13 STRANDS / 79 JOBS · EXISTING HUB OWNER PRESERVED**

Owner: existing KFB Production Desk / HUB-CTRL PR #202. Architecture source: Draft PR #204 at
`531a8f4c2c26b4f5ed042cc360c49546017641c6`.

## Result

- The current **Today** lanes remain unchanged and answer “what is happening now?”.
- A separate **What you can start** surface mounts the v3 architecture catalog strand-first.
- Default view is 13 collapsed strands, not a 79-card wall.
- Expanded strands group jobs into READY and a second collapsed HOLD list.
- Every job shows executor, model, reasoning and budget; its start action copies the canonical prompt.
- All prompts are extracted from their exact `## promptSection` in `STRAND_BRIEFINGS.md` or
  `SELF_SERVICE_BRIEFINGS.md`. No prompt body is duplicated in Hub config.
- An unreadable catalog degrades only this surface. Today, tools and the independent HUB-CTRL recovery remain visible.

## Evidence before publication

- Production Architecture source: **13 strands · 79 jobs · 36 READY · 43 HOLD**.
- Prompt resolution: **79/79** exact named sections; execution-profile gaps: **0**.
- Python builder/render/validation: **18/18 PASS · VALID · 0 problems**.
- Real Chrome desktop: Today lanes unchanged; all 13 strand cards render collapsed; one strand expands to its
  READY/HOLD jobs; compact execution metadata renders; copy action reports success; **0 console errors**.
- Real Chrome mobile at 390×844: single-column strand view, all 13 areas visible without a 79-card wall.

## Publication state

`PUBLIC_VERIFIED` at `https://kayfabizarro.pages.dev/kfb-hub/`.

- HUB-CTRL implementation branch after mount checkpoint: `work/hub-ctrl-01-2026-09-24@2eee5e4fc99c9dd95f7a46fff9247bcd2adff84f`.
- Architecture source remains unmerged Draft PR #204 at `531a8f4c2c26b4f5ed042cc360c49546017641c6`.
- Cloudflare publication head: `a82c38ccbdda220b668bf71a337df38586c41f3e`.
- Exact public route opened in Chrome with source marker `f89eac1`; Katalog navigation, 13 strands,
  79 nested jobs, compact execution metadata and successful start-copy feedback were visible.
- Public browser console: **0 errors / 0 warnings**.

## One next gate

Use the new WorldBuilder strand to start exactly one bounded next job: `WORLD-ZONE-BAKE-01` (Cologne OSM
Zone Bake) in Web. It is READY and does not require Work or Cloudflare.

---

# Earlier return · HUB-CTRL-01 · never-empty KFB Hub · 2026-09-24

Owner: KFB Production Desk / public route `https://kayfabizarro.pages.dev/kfb-hub/`.

## Root cause

The published `cloudflare-live:kfb-hub/index.html` contained one extra closing brace inside
`#embedded-registry`. The page script itself was valid, but the embedded JSON was not. Live raw registry
sources were unavailable at the same time, so all three data attempts returned nothing and the old UI
displayed “Es konnte kein Stand geladen werden.” The underlying GitHub work was not lost.

## Fix

- The public Hub is again generated from `render_desk.py`; no hand-edited JSON assembly.
- `render_desk.py` reparses the exact embedded payload before it writes the output.
- A separate minimal recovery registry is compiled into the page script. Even malformed live and embedded
  data now leave a visible recovery card plus direct Stage, ToolBox and GitHub links.
- The current embedded snapshot has 14 lanes and includes WB-W0, current Hürth A/B/C proofs, Billboard B2a
  and the Graveyard review route. WB2 is retained as donor and no longer presented as the current world plan.
- Gate proportionality and the current World/Racer/Hub masterplan are visible under working rules.

## Evidence before publication

- Python builder/render tests: **16/16 PASS**.
- Registry validator: **VALID**, **0 problems**.
- Generated embedded JSON: **PASS**, 14 lanes; page-script syntax: **PASS**.
- Real Chrome at local HTTP route: full embedded Hub renders with 3 LOOK_AT, 6 RUNNING, 1 CAN_START,
  4 WAITING and all configured tools.
- Real Chrome with deliberately malformed embedded JSON: `Notfall-Stand`, one recovery card and two direct
  tool links render; the old blank-state message does not appear.

## Publication state

`PUBLIC_VERIFIED` at `https://kayfabizarro.pages.dev/kfb-hub/`.

- `cloudflare-live` publication head: `620c26350d3ecb2ea48b70da42fd92f689911584`.
- The exact public route was opened in real Chrome and visibly showed the current 14-lane Hub.
- Visible counts: 3 LOOK_AT · 6 RUNNING · 1 CAN_START · 4 WAITING.
- Hürth, Billboard and Graveyard review links plus WB-W0, VFX-01 and Curtain-v2 intake cards were present.
- The page rendered from the valid embedded snapshot while GitHub raw propagation was still pending; this is
  the designed fallback, not a blank state.

## One next gate

HUB-CTRL-01 is complete. Start the separate WB-W0 source-lock gate; do not add more Hub architecture.

---

# Earlier return · KFB Production Desk v0 (PD1 + PD2) · 2026-09-23

Executor: Claude Coworker (Opus 5.5), STEP 2 of `COWORKER_OPUS55_SEQUENCE.md`.

## Built

- `tools/production_desk/config.json` — 12 lanes (4 buckets, 2 external), WSA, standards.
- `tools/production_desk/build.py` — online/fixture builder, validator, contentHash (timestamp-free).
- `tools/production_desk/render_desk.py` + `desk/desk.template.html` → `desk/KFB_PRODUCTION_DESK_V0.html`.
- `.github/workflows/production-desk.yml` — schedule/dispatch/main-push, publish to `bot/production-desk-update`.
- `registry/production/v1/*` — canonical snapshot from `snapshots/coworker-2026-09-23.json`.

## Evidence (local, sandbox)

- builder unit tests: **14/14 PASS**
- registry validate: **VALID**, problems 0
- desk behaviour (jsdom, runs the page script): **30/30 PASS** — embedded/Live/Hauptstand source selection,
  poll switch without reload, real brief copy, link fallback, blocked-clipboard manual copy, stale banner,
  launcher rules, "Kein Stand" on no data, no PR/SHA on card faces, external lanes marked LAST_KNOWN.
- publish decision logic: first-publish / unchanged / content-changed / heartbeat — PASS.
- `node --check` on page script: PASS.

## Not verified (honest)

- `--online` against the real GitHub API was **not** run: sandbox has no network. First real run = Actions.
- No real-browser screenshot (no Chromium in sandbox); behaviour covered by jsdom only.
- Travel/Racer: GitHub connector returns 404 for both repos → values are LAST_KNOWN from `CURRENT_STATE.md`.
- PR `updatedAt` for #188/#189/#190/#192 not captured in snapshot (null); heads are from `list_branches`.

## Design deviations from PRODUCTION_DESK_AUTOSYNC_V1.md (intentional)

1. Triggers: added `schedule` (30 min) because lane state lives on unmerged draft branches; main-push alone goes stale.
2. No auto bot PR: the Desk reads the bot branch directly; a PR per refresh would be noise.
3. Heartbeat publish (6 h) so `checkedAt` stays meaningful even when nothing changed.
4. Georg-facing UI in plain German (LOOK_AT → „Schau dir das an“, RUNNING → „Läuft gerade“,
   CAN_START → „Kannst du parallel starten“, WAITING → „Wartet“). Technical facts only in the drawer.

## Human gate

Georg: one decision only — merge the workflow file (or the whole slice) to `main` so the Desk updates itself.
Plus: does the Desk answer „was läuft, was muss ich entscheiden, was kann ich starten“ at a glance?

## Next

STEP 3 — resume ToolBox Source-Safe Integration (state: project memory `toolbox_model_switch_checkpoint`).


## 2026-09-26 · WSA MVP dispatch / Racer R0 hold sync

Status: **SOURCE METADATA UPDATED · NO NEW PUBLIC HUB CLAIM**

Config checkpoint:
`7dc340afd94023e65d68561228472a4dc19bdffb`

Changes:
- added LOOK_AT lane for WSA review-only PR #222;
- changed Racer lane from generic CAN_START to **G0 → W0** review/start semantics;
- updated Track-Core expected head to PR #219 `6610e5b0…`;
- added separate WAITING lane for **Playable Track R0 · SOURCE_REQUIRED HOLD**;
- records Claude Design’s no-build stop as correct and forbids replacement recipes;
- WSA summary now says REVIEW_ONLY; approved execution returns to normal Web/Claude/Blender owners.

Verification on the config write:
- updated `config.json` was fetched back from `work/hub-ctrl-01-2026-09-24` and JSON-parsed;
- PR #202 head resolved to `7dc340af…` after refresh;
- expected refs were checked against PR #219, #216 and #222;
- GitHub returned **0 PR workflow runs** associated with `7dc340af…`; therefore no new builder/CI PASS count is claimed for this metadata change.

Publication:
- generated root Hub HTML: unchanged by this sync;
- Cloudflare/public root: no new publication claim;
- Live promotion: none.

Exactly one next gate for this sync:
**WSA reviews PR #222; HUB-CTRL may regenerate/publish status through its existing owner path afterward.**

## 2026-09-26 · Fragile Web-chat recovery inventory sync

Status: **SOURCE METADATA UPDATED · REVIEW ONLY · NO PUBLICATION CLAIM**

Config checkpoint:
`6b736a0dc887609b7296a77fedb4f0f9c04f6e04`

HUB-CTRL now exposes PR #222 as both MVP plan review and aborted/fragile Web-chat recovery inventory.

Current recon distinguishes:
- recovered complete;
- recovered with one open gate;
- closure orphan;
- recon not formalized;
- intentional hold.

Two current real recovery orphans:
1. Billboard B2b-P1 PR #212 — tested implementation exists; closure/Return/Hub/Stage handoff missing.
2. KayKit City Builder Bits application recon — exact 41-model pack is indexed; product application matrix/source-isolation memo missing.

Candidate long-job rule:
persist C0_PREFLIGHT / JOB_STATE + recovery stub before expensive research/browser/CI work; `Stream cache expired` = UNKNOWN / inspect first.

No generated Hub HTML changed.
No Cloudflare/public publication changed.
No Runtime/Stage/Live promotion.

Exactly one next gate:
**WSA reviews PR #222 D8 + A1/A9 recovery starts.**


### Final recovery-inventory pin

Final PR #222 pin: `1271ca4ea310ec1bc33c9f8e0ba499f890b81b82`
HUB-CTRL config commit: `f66a59ee6eaf5bb8b26fdef0406f75b03697c9e6`.
The WSA recovery lane now pins the exact final planning head rather than a moving branch snapshot. Generated Hub HTML/public root remain unchanged.


## 2026-09-26 · Racer Design working page sync

Status: **SOURCE METADATA UPDATED · NO PUBLICATION CLAIM**

- added separate CAN_START lane `racer-design-hud-billboards` for the current productive Claude Design slice;
- lane points to PR #222 current Fresh Chat Start for HUD + Billboard System;
- existing Track-Core lane remains the technical G0→W0 path;
- Playable Track R0 remains SOURCE_REQUIRED HOLD;
- stale B2b Hub lane corrected to current PR #211 frozen 39/40 recovery truth;
- generated Hub HTML/public root unchanged; no Cloudflare publication.

Exactly one current Claude Racer gate: **HUD + Billboard visual system**.


## Addendum · Racer W0 / Cross-Mode HUD Hub-source sync · 2026-09-26

Status: **SOURCE METADATA UPDATED · PUBLIC HUB NOT REPUBLISHED**

### Synced source state
- planning source: PR #222 @ `974989ae29449a5cfab8881d84bfef9aacba22f9`;
- Track Core lane: **CAN_START · W0 NOW**;
- Racer Design lane: **CAN_START · Cross-Mode HUD + Billboards**;
- Playable Track R0: **WAITING / SOURCE_REQUIRED HOLD**.

### Meaning
- current lead/WSA decision has already selected JavaScript as authoritative Track Core; the old Hub G0 prompt was stale;
- Blender/Python remains Track-Core oracle/consumer, not a second solver;
- current Claude Design HUD start now includes WALK / DRIVE / FLIGHT adaptive visibility plus the source-proven Factory Arrow as a 3D navigator;
- no new Race/HUD/Map/Radar owner was created.

### Hub/public boundary
Changed only Hub source metadata/docs on this owner branch.
- generated Hub HTML: **not edited in this sync**;
- Cloudflare publication: **not run / not claimed**;
- public `https://kayfabizarro.pages.dev/kfb-hub/`: remains whatever previously verified snapshot is currently deployed and must be treated as stale for this new Racer wording until the existing Hub pipeline republishes and the exact route is browser-verified.

### Tests
New Hub builder/browser/public tests in this sync: **0**.
The config JSON was fetched back and parsed after the write.

### Exactly one next Hub gate
**Existing HUB-CTRL pipeline may later regenerate/publish the source update; do not claim it public until the exact Cloudflare route visibly shows the W0 / Cross-Mode HUD wording.**


## 2026-09-26 · ClayBound production lane checkpoint

- Owner: HUB-CTRL #202 / `tools/production_desk`.
- Source owner remains KFB ToolBox / ClayBound material exploration.
- New source intake on main:
  `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAYBOUND_INPUT_INTAKE_2026-09-26.md`.
- Four NotebookLM PDFs registered as source-only; none opened/rendered/web-optimized in this sync.
- New Hub lane: `claybound-materials` · **CAN_START**.
- New self-service strand: `clay-handmade-assets`.
- Jobs: **7 total · 1 READY · 6 HOLD**.
- Current READY job: `clay-asset-01` · Smooth matte clay seamless texture.
- Plugin execution lane: KFB Clay Asset Studio v0.1.0, private USER plugin.
- No PDF processing, no asset integration, no Cloudflare publication, no Stage/Live claim.

Exactly one next gate:
**Run CLAY-ASSET-01 and get Georg's review on source + 3×3 repeat before Asset 2.**
