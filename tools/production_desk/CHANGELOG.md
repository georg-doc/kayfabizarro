## 2026-09-26 · World r2 contract reset PASS

- moved World r2 `WAITING → CAN_START` after the bounded contract-only reset;
- pinned PR #190 at `58028b07d` with 13/13 contract, 24/24 static, Hürth/Köln 55/55 each, WB2 34/34 and browser harness 12/12 PASS;
- recorded the Surface Adapter ownership seam and synchronized PR #204/#218 metadata;
- next gate is `WORLD-R2-STAGE-PREP-01`; no Stage/Public/Live claim or runtime repair was added.

## 2026-09-26 · ToolBox r2 human TUNE

- Georg accepted the overall ToolBox r2 direction as **TUNE**;
- closed the active ToolBox review gate and moved the lane `LOOK_AT → WAITING`;
- retained four non-blocking follow-ups under their proper rendering, grounding, animation and shared-camera owners;
- pinned PR #221 human-result head `da20e926`;
- no ToolBox rewrite, merge or Live promotion.

## 2026-09-26 · ENV human gate + ToolBox r2 public verification

- ENV-PREVIEW-01 moved `LOOK_AT → WAITING` after Georg **PASS_WITH_TUNE**; shared environment/light direction accepted, five proportional follow-ups retained without reopening the slice;
- ToolBox r2 remains `LOOK_AT`, now with exact PR #221 head `36315aae`, **33/33 repository PASS** and **20/20 public Stage/ToolBox/Registry/Hub PASS**;
- public page/request failures for the ToolBox r2 gate: 0;
- Hub source now points to the already-public fixed ToolBox review route and no longer says marker verification is pending;
- no merge and no Live promotion.

## 2026-09-26 · ENV-PREVIEW-01 public and routed

- added the verified Resident Atlas + ToolBox environment comparison as one `LOOK_AT` lane;
- added the same fixed Cloudflare route to the World/Terrain tool group;
- source PR #218 is pinned at `a50f2fb0`;
- public runtime and final metadata were verified on `cloudflare-live@bec8688c` and `f4e76abd`;
- exact public browser gate: **9/9 PASS**, zero page/request errors, mobile overflow zero;
- WorldBuilder/OSM/terrain ownership stays explicit; Travel/TinySkies remains a presentation donor;
- no merge and no Live promotion.

## 2026-09-26 · ToolBox r2 recovery review routed to Human Gate

- ToolBox lane moved `RUNNING → LOOK_AT` after PR #221 final-head browser SUCCESS (**33/33**).
- Direct review path: `kfb-hub/stage/toolbox/production-01-r2/index.html`.
- Exact package mirrored to `cloudflare-live@44fda28e65ba7fd7880660159777ba4ea71f1c38`.
- Hub config now exposes a review only through the existing route-check contract.
- PUBLIC_VERIFIED remains pending until exact pages.dev marker + generated Hub link are opened/read back.
- No merge or Live promotion.

## 2026-09-26 · Racer routed to Track Core

- Racer lane updated from RKIT-08/09 LOOP_REAL-first status to the newer Track-Core architecture gate.
- Current source: stacked PR #219 / `georg-doc-patch-2@c3ccd0d85a68593f5a545fd41ae0ef2112391965`.
- Current lane: `CAN_START · TRACK-CORE-0 · ChatGPT Web census + core contract`.
- Provider sequence shown explicitly: ChatGPT Web → Claude Coworker + Blender MCP → ChatGPT Web → Claude Design.
- Perplexity transition research is summarized as mechanism input only: true Clothoid/Euler easing, connector state and staggered transitions; supplied example Python is not a production donor.
- Playable Track R0 and real Köln OSM route remain downstream.
- Race PR #42 / RKIT-11 remains the frozen acceptance fixture, not a current runtime/Stage result.
- Generated registry/root Hub was **not regenerated or republished by this metadata update**.



## 2026-09-26 · ToolBox r2 green / World r2 stopped

- ToolBox r2 receiving-owner CI on PR #185 is green: 31/31 + 34/34 static, 20/20 + 25/25 browser, 13/13 review-browser;
- ToolBox now advances to an owner-backed Stage review gate;
- World r2 receiving-owner static is 20/20 PASS but browser gate exhausted its repair budget;
- World final diagnostic proves Hürth/source boot and isolates the failing stale selftest variant contract;
- World recovery package persisted; Hub lane changed to WAITING / `WORLD-R2-CONTRACT-RESET-01`;
- no World Stage/Public/Human PASS;
- no merge or Live promotion.



## 2026-09-26 · ToolBox/World r2 + Hub UX intake

- ToolBox r2 Session Cut received on main; Hub lane advanced from Claude-start to RUNNING receiving-owner rehome;
- World r2 Session Cut received; Hub lane moved to WAITING behind ToolBox canonical locomotion/profile rehome;
- World r2 reported 55/55 Hürth + 55/55 Cologne; ToolBox r2 reported 19/19, preserved as Claude evidence only;
- Hub UX v2 Session Cut also arrived and is now RUNNING under HUB-CTRL rehome/public-review preparation;
- all three route through current Architecture intake instead of raw Inbox as SSOT;
- no public shell, product Stage, merge or Live promotion changed by this metadata update.



## 2026-09-25 · Current Claude continuation briefs

- Hub World card now points to the current World Integration Claude continuation brief;
- Hub ToolBox card now points to the current ToolBox Production Claude continuation brief;
- both are paste-ready and return through `/session-zip`;
- World = shared locomotion consumer + global OSM presentation;
- ToolBox = canonical locomotion/profile owner + shared Pose/IK + Ear Rig/S39 consumers;
- Blender MCP route note stays source-pin gated and VOICE_INPUT_UNCERTAIN until the export arrives;
- no new runtime owner or public shell change.



## 2026-09-25 · Graveyard / Music / World presentation routing

- removed Graveyard from current LOOK_AT; retained as archive/concept + grave-light flicker donor;
- MUSIC-PERF moved from LOOK_AT to CAN_START/TUNE; timeline/audio retained, current visible band animations are not canonical;
- routed future band performance to newer S39 Resident Band sources (Guitar A / ml.guitar.a.fit, drum.v5c) without baseplate;
- recorded terrain-placeable Resident-module rule and WorldBuilder-compatible preview environment;
- recorded global OSM facade/roof/contact-shadow presentation rules in Production Architecture;
- no public Hub shell or Cloudflare publication changed.



## 2026-09-25 · Final live registry sync after PR #215 CI

- advanced live bot registry to `cab4fcef34abfe7e438f31942db009c5ec960ca8`;
- manifest source pin = HUB-CTRL `74c6fa5cd623dc378dec880905c6616f6a171754`;
- live counts = **3 LOOK_AT / 6 RUNNING / 6 CAN_START / 4 WAITING**;
- PR #215 is now the explicit LOOK_AT merge gate for durable 30-minute registry freshness;
- ToolBox/World PROCEED PASS, Ear Rig, Hub UX Recovery and current v3 catalog remain present;
- no Hub HTML or Cloudflare publication changed.



## 2026-09-25 · HUB-STATUS-SYNC-01 CI pass

- opened Draft PR #215 with one workflow file only; no Hub shell or Cloudflare changes;
- first CI run failed because inherited render tests expected the current bot-registry fixture;
- repair pass 1 seeds `registry/production/v1` from `bot/production-desk-update` before tests;
- second CI run `36168223283` PASS;
- inherited Production Desk tests: **18/18 PASS**;
- online registry build + validator PASS / VALID;
- build result: **19 lanes · 2 LOOK_AT · 5 RUNNING · 7 CAN_START · 4 WAITING · 0 problems**;
- PR-event publish step is skipped by contract;
- merge remains a named human/owner gate.



## 2026-09-25 · Hub live-data recovery + accepted v2 UX donor

- recorded ToolBox Production-01 and World Integration-01 as **PROCEED PASS** rather than exhaustive feature acceptance;
- refreshed the live `bot/production-desk-update` registry consumed directly by the public Hub;
- current registry now includes Hub UX Recovery, Hub Status Sync v1, Ear Rig / EAR-DANGLE-01, current ToolBox and World continuation;
- removed obsolete WB-W0 and Hürth architecture proof items from the current review queue;
- changed live stale threshold from 8 h to 2 h and heartbeat target to 1 h;
- recovered exact Georg-accepted Hub UI v2 donor from `dfaafac070747f9543b5eb5a635e2aaa74e57b83`;
- added `HUB_UX_RECOVERY_CLAUDE_DESIGN_2026-09-25.md`: donor-first Paper/Dark + Today + Pocket Inbox + local/exportable decision queue;
- added `HUB_STATUS_SYNC_V1_2026-09-25.md`: durable bot-registry autosync without ordinary Cloudflare redeploys;
- current public v3 shell remains **HUMAN TUNE** and is not promoted as accepted;
- no new public shell, merge or product runtime promotion.

## 2026-09-25 · WB-D2 / S40 root Hub publication

- live registry refreshed to 90 jobs / 42 READY / 48 HOLD and 19 lanes;
- WB-D2 and S40 routed to their existing owners without new runtimes;
- root fallback re-rendered to same current registry state;
- published root only to `cloudflare-live@2781b7ba...`;
- B3 handover source clarified as PR #211 branch, not main;
- public-proof/Cloudflare checks still running at checkpoint.

## 2026-09-25 · WB-D2 + Resident S40 Hub routing

- added WAITING WB-D2 shell lane pointing to current main Inbox handover;
- converted obsolete Dance-D1 continuation into CAN_START Resident Disco S40 Bridge;
- WorldBuilder Mobility now waits explicitly for WB2 Design/Rehome + WB-ZONE-SEAM;
- preserved OSM City Lab source ownership for Alstädten;
- preserved Resident/Music/Motion owners for S40;
- no new public product route created.

## 2026-09-25 · Root Hub Cloudflare publication

- published current 89-job root Hub to `cloudflare-live@8101c2c18f2210720649a3ecb6e3f388176eed23`;
- root blob matches the current HUB-CTRL render;
- embedded fallback and live bot registry both contain the current WB2/Racer/ToolBox/NPC-Life focus;
- Cloudflare/public-proof checks were still RUNNING at handoff;
- exact pages.dev URL verification unavailable in current URL tool, therefore no PUBLIC_VERIFIED claim.

## 2026-09-25 · Root Hub 89-job refresh

- restored missing `bot/production-desk-update` branch from existing HUB-CTRL owner;
- rebuilt self-service registry from current Production Architecture PR #204;
- self-service now **89 jobs / 43 READY / 46 HOLD / 89 prompts**;
- refreshed Today/To-do lanes to 18 current lanes;
- refreshed lane briefings/reviews/WSA status/open coordination problems;
- refreshed current Tools to **10/10 available** on `cloudflare-live`;
- re-rendered Production Desk + `kfb-hub/index.html` with the same current embedded fallback;
- current Hub root source includes WB2 HUMAN PASS/Claude gate, LOOP_REAL Racer gate, Direct FBX, v17+ ToolBox and NPC-LIFE;
- no second Hub/runtime created.

## 2026-09-25 · WB2 HUMAN PASS → Claude Design current gate

- Hub WorldBuilder lane corrected from old “technical donor” wording to current GEORG HUMAN PASS;
- WB2 PR #190 pinned at `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`;
- existing Claude Design terrain-editor handoff is now CAN_START / P0;
- WorldBuilder Mobility moved back to WAITING behind the WB2 design milestone and its existing dependencies;
- Smooth/Flatten remain separate later Web slices;
- no Cloudflare publish, merge or replacement owner.

## 2026-09-25 · Racer RKIT-08/09 Hub routing

- Hub Racer lane advanced from RKIT-06 to current PR #41;
- registered five stunt modules by reference only;
- current gate = LOOP_REAL first in existing Rapier host;
- all modules remain NOT_DRIVEN and no WorldBuilder placement is authorized;
- recorded registration head `0bbdc539...` separately from current PR recovery head `22c3b2e2...`;
- no new Stage route or public gameplay claim.

## 2026-09-24 · ToolBox human-fail alignment

- synced Georg's AN-PROFILE-02 Human FAIL into Hub Today and ToolBox source routing;
- retained the current ToolBox owner and technical evidence without presenting the failed human review as usable;
- recorded source/GLB loading failure and stage obstruction by measurement/data palettes;
- froze old review surfaces; no WorldBuilder Motion promotion;
- next Animation Studio / Direct-FBX review must use a new bounded unobstructed source-real review surface.

## 2026-09-24 · MVP focus / ToolBox router refresh

- Hub Today updated for current ToolBox Production/v17+, WorldBuilder Mobility, NPC-LIFE and Racer Rapier gate;
- old Dance D1 retained as history and routed to current RES-DISCO;
- ToolBox router refreshed to **10 public routes / 5 missing-blocked / 14 source-integration = 29 cards**;
- added current source/brief cards for Stage-First ToolBox owner, State/Action Animation Studio, Direct FBX Motion Intake, FrizzleBob Body Family, v17+ integration and Resident Disco;
- added Music Performance to public ToolBox routes;
- all ten public ToolBox publication paths verified present on `cloudflare-live@597930b8...`;
- Stage navigator ToolBox card updated to current counts/focus;
- architecture target is **88 jobs / 42 READY / 46 HOLD**; root generated Desk refresh remains pending and is not falsely claimed;
- no new unpublished product route was exposed as live.

## 2026-09-24 · Focus recovery / minimal Work routing

- linked HUB-CTRL recovery metadata to current Production Architecture PR #204 focus handoff;
- three new Flow Design Inbox exports remain candidate inputs, not automatically promoted Hub tools;
- current Work decision is intentionally **no execution**; Racer TRACK_A stays with the documented Web/Race owner;
- WorldBuilder bake→Flow-shell seam, Resident Card and Resident Band stay outside Work; ToolBox runtime + repaired review transport are now green and also require no Work;
- MUSIC-PERF public review remains unchanged;
- no root Production Desk republish or Live promotion claimed by this metadata checkpoint.

## 2026-09-24 · Recovery test repair

- Traced the existing Production Desk CI failure to `desk_dom_test.mjs`: the test hard-coded the `curtain` lane and dereferenced `curtain.brief.rawUrl`, although the current Curtain lane intentionally has no briefing.
- Repaired the test to select an actual lane with a real `brief.rawUrl`; no product/runtime behavior changed.
- GitHub connector writes did not automatically start a new Production Desk workflow run, so the current rebuilt Hub remains **UNVERIFIED** rather than assumed green.
- Cloudflare preview activity is tracked separately and is not accepted as Production Desk registry/browser evidence.

## 2026-09-24 · Recovery sync · current architecture briefings

- Recovered the Hub owner against the current Production Architecture source at `a7b4d9c4f6e541a50a640f42182d5ec4cf332bd7`.
- Confirmed the architecture catalog now contains the two newest READY jobs:
  - `WB-DESIGN-PARALLEL-01`;
  - `NPC-CARD-SPEC-01`.
- Expected catalog after regeneration: **13 strands · 81 jobs · 38 READY · 43 HOLD**.
- No second Hub, no second registry and no runtime owner were introduced.
- This checkpoint intentionally does not claim the public Hub has refreshed; the existing HUB-CTRL workflow/publication path remains authoritative.

## 2026-09-24 · Human triage · broken/legacy Toolbox labs removed from current Tools

Georg reported the following public Stage surfaces as broken, misleading or non-productive:
- EyeRig Legacy: no useful EyeRig, unusable buttons/UI;
- EyeRig Batch: persistent loading animation in front of character/FOV;
- KayKit Motion Lab v1: incomplete animation set and non-useful UI versus expected Animation Lab / current ToolBox direction;
- Ranged Calibration v1: wrong target axes and muzzle VFX below the muzzle;
- Tileable Macro Seam Lab: no current utility/learning value;
- World-Building Preflight: one of several failed/obsolete world proofs.

Action:
- removed all six from the current `tools` shelf;
- preserved their repo/history as evidence/donors only;
- Card Zone Lab v2 remains visible as **Recovery Reference / Donor** because Georg reports it looks good and it is still a valid source donor for Fluid/Stack/Beam/Card Cube;
- productive EyeRig/Pose/Animation/WorldBuilder work stays in the v3 self-service catalog, not in these old Stage labs.

No source/runtime files for the old labs were deleted.

## 2026-09-24 · Racer external status advanced to RKIT-06

- Root cause for stale Racer card confirmed: Production Desk intentionally never fetches `external:true` repositories with the same-repo workflow token; Racer therefore remained on hand-maintained `lastKnown` PR #33 / head `71e7051…`.
- Current private Racer truth verified directly in `georg-doc/KFB-Stunt-Car-Race`: stacked RKIT PRs #34→#39, top PR #39 `RKIT-06` at `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.
- Hub config now has one consolidated Racer lane at RKIT-06 rather than six micro-lanes.
- Current summary includes TRACK_A_STUNT_8, Base/Hero jumps, Pit Lane, SWITCH_Y, flap-return/tunnel and Trankgasse on the real OSM line.
- Next technical gate is the real Race/Rapier run on TRACK_A; RKIT remains geometry/metadata only.
- Durable follow-up: replace hand-edited cross-repo `lastKnown` with a small same-repo external-status mirror written by the owning GitHub Bridge, or later a GitHub App/token with explicit cross-repo read permission.
- No public publication claimed by this config-only checkpoint.

# KFB Production Desk · additive changelog

## 2026-09-24 · HUB-V3-MOUNT

- Mounted Production Architecture v3 as a second, additive self-service registry.
- Kept operational Today lanes and their owner unchanged.
- Added 13 collapsed strand cards with 79 nested READY/HOLD jobs.
- Added visible executor/model/reasoning/budget metadata and source-linked copy actions.
- Resolve all 79 prompt bodies from their canonical named Markdown sections at build time.
- Added failure isolation so a malformed catalog cannot blank the Hub.
- Added builder and browser-facing regression coverage for counts, prompt resolution and compact rendering.

No architecture owner was replaced, no PR was merged and no Live gameplay surface was promoted.

Publication proof: `cloudflare-live@a82c38ccbdda220b668bf71a337df38586c41f3e`; the exact public Hub rendered
13 collapsed strands and 79 nested jobs in real Chrome, copied an original briefing, and logged no browser errors.

## 2026-09-24 · HUB-CTRL-01

- Confirmed the public blank Hub was caused by malformed embedded JSON, not missing project data.
- Added output-time embedded JSON validation.
- Added an independent never-empty recovery view.
- Added recovery regression tests for missing and malformed embedded data.
- Refreshed the embedded project view with WB-W0, Hürth architecture proofs, Billboard B2a and Graveyard.
- Reclassified WB2 as a retained donor instead of the current WorldBuilder direction.
- Added the gate-proportionality protocol and World/Racer/Hub masterplan to the Hub rules.

No PR was merged and no Live project was promoted by this change.

Publication proof: `cloudflare-live@620c26350d3ecb2ea48b70da42fd92f689911584`; the exact public Hub route
rendered the current 14-lane snapshot in real Chrome. HUB-CTRL-01 is complete.


## 2026-09-24 · MUSIC-PERF-01 review mount

- added `music-perf-01` as one HUB-CTRL `LOOK_AT` lane;
- added `music-performance` as one Tool entry;
- added a Stage navigator Human Gate card through the existing Hub owner;
- preserved MUSIC-PERF donor/runtime ownership in Draft PR #207;
- published only the Stage navigator delta to `cloudflare-live@5658557e...`;
- verified public direct route + navigator with **22/22 Chromium PASS** in run `36047130373`;
- human result remains PENDING;
- root Production Desk regeneration remains a separate pending HUB-CTRL task and is not claimed complete.


## 2026-09-25 · Billboard B2b research + B3 WSA handover

- updated the Billboard Hub source lane from B2a human review to B2b research choice;
- B2b Draft PR #211 / head `662611e4a28123e9e9449e2da47f57c8dbe43815`;
- primary memo: `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/OPTIONS_MEMO.md`;
- recommendation: A+ CanvasTexture collage compositor with deterministic no-repeat recipes, small provenance-tracked pool and lightweight Living Screen treatment;
- no B2b runtime or public Stage route exists;
- added a separate WAITING B3 lane for rounded/cartoon 3D billboard body authoring;
- B3 handover: `tools/KFB-ToolBox/_handover/BILLBOARD_B3_CARTOON_BODY_WSA_HANDOVER_2026-09-25.md`;
- Blender MCP is allowed for true topology/casing/post/support work;
- generated public root Hub was not manually edited or claimed republished by this source metadata checkpoint.


## 2026-09-25 · Billboard B2b-P1 locked + 5 future drafts

- Georg chose **KFB + small curated CC0 pool** and **mixed hypernormalisation** for B2b-P1.
- Billboard lane is now **CAN_START** and points to the ultra-short Fresh Chat Start on PR #211.
- B2b branch current handoff head: `ec475c5d3ae8d975a75e85cf2c60ecae0a0e527b`.
- B3 WSA/Blender handover now also contains five explicitly non-blocking future drafts:
  Palimpsest, Billboard Chorus, World Memory, Neighborhood Dialects, Signal Takeover.
- B3 remains WAITING / NOT STARTED.
- No generated public root Hub or B2b Stage route is claimed by this metadata update.


## 2026-09-26 · WSA dispatch review + Racer R0 hold

- config commit `7dc340afd94023e65d68561228472a4dc19bdffb` adds PR #222 as WSA review-only lane;
- Racer now routes first to Track-Core G0 → W0 instead of generic CAN_START;
- separate Playable Track R0 lane is WAITING / SOURCE_REQUIRED until Track-Core proof + Web closed package;
- updated PR #219 expected head to `6610e5b0…`;
- no generated Hub HTML or Cloudflare publication changed;
- config was fetched back and parsed; no PR workflow run was emitted for the config checkpoint, so no new CI count is claimed.

## 2026-09-26 · Fragile Web-chat recovery inventory

- config checkpoint `6b736a0dc887609b7296a77fedb4f0f9c04f6e04`;
- WSA lane now points to PR #222 aborted/fragile Web-chat recovery inventory + C0 long-job protocol;
- two current recovery orphans surfaced: B2b-P1 closure and City Builder Bits application recon;
- no generated Hub HTML, Cloudflare publication or Runtime/Live claim.

- Final PR #222 pin: `1271ca4ea310ec1bc33c9f8e0ba499f890b81b82`; HUB-CTRL config checkpoint `f66a59ee6eaf5bb8b26fdef0406f75b03697c9e6`; no generated/public Hub change.

## 2026-09-26 · Hub UX Recovery v2 · Stage rehome + two-pass public verification STOP
- Re-homed the exact Claude v2 candidate into the existing HUB-CTRL Stage owner; no source rewrite and no second Hub runtime.
- Exact blobs preserved: candidate `1fb367c70412d18ef9b0802c3feb2019357be525`, donor proof `1b1f67a7ed5497f765ac4d22f56b0933859ce12a`, accepted donor `0de46343ddeb70a5f423876e75dc916ae7200c5b`.
- Connector source seal: **9/9 PASS**.
- Added `tools/production_desk/tests/test_hub_ux_recovery_stage.py`; GitHub Actions remained **NOT_RUN** because the workflow exists only on PR #202, not on `main`.
- Published only the child payload to `cloudflare-live`; branch readback PASS.
- Public verify pass 1: integrated web viewer could not access pages.dev.
- Public verify pass 2: browser/container network failed DNS resolution for `kayfabizarro.pages.dev`.
- Two-pass rule applied: STOP, preserve candidate, full failure recovery; public Stage navigation now says **PUBLIC VERIFY BLOCKED** and does not expose the unverified human-test link.
- No root `kfb-hub/index.html` replacement, no Live Hub promotion, no merge.
- Recovery: `tools/production_desk/failure-recovery/HUB_UX_RECOVERY_STAGE_PUBLIC_2026-09-26/START_HERE.md`.
- Active next gate: **PUBLIC BROWSER VERIFY · HUB UX RECOVERY STAGE**.


## 2026-09-26 · Racer Design working page sync

- Production Desk source now exposes a dedicated CAN_START Racer Design lane for HUD + Billboards;
- Track Core remains parallel technical path; R0 remains HOLD;
- stale B2b lane corrected to PR #211 39/40 frozen recovery state;
- no generated/public Hub change.
