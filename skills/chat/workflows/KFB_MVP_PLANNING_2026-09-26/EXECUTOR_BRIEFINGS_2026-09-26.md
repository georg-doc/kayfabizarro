# KFB Executor Briefings · 2026-09-26

Status: **PLANNING CANDIDATE · WSA APPROVAL REQUIRED BEFORE START**

Use this file only after `WSA_RECON_PLAN_APPROVAL_2026-09-26.md` is reviewed. GitHub state overrides dated refs.

## Dispatch board

| Slice | Executor | State now | Start condition | Outcome |
|---|---|---|---|---|
| ENV-PREVIEW-STAGE-01 | Web/GitHub | STARTABLE | WSA approves D5 | Publish existing #218 candidate to additive Stage comparison + Hub link; no runtime change |
| TOOLBOX-R2-PUBLISH-01 | Web/GitHub | STARTABLE | WSA approves D4 | Publish existing #221 review surface + Hub link; human review only |
| TRACK-CORE-G0/W0 | Georg/WSA → Web/GitHub | WAITING ONE DECISION | G0 JS approved | Complete census/contracts + pure JS reference per latest #219 addendum |
| CAMERA-CORE-0 | Web/GitHub | STARTABLE RECON | WSA approves D2 owner | donor census + shared camera contract; no integration |
| WORLD-R2-CONTRACT-RESET-01 | Web/GitHub | WAITING | ToolBox r2 review gate + WSA D3/D6 | test/selftest contract reset only; no failed-runtime patch |
| ACTOR-FB-BODY-FAMILY-01 | Web/ToolBox → Blender only if needed | WAITING | ToolBox front-door human gate | FrizzleBob identity on Legacy/Medium/Large destination rigs + EarRig v5 compatibility |
| SURF-POSE-01 | Animation Lab / Web, Blender only if necessary | WAITING | body/profile owner pinned | source-backed card-flight pose set |
| WORLD-MOBILITY-01 | Web/WorldBuilder | WAITING | World contract reset + camera contract | ground locomotion + card flight/God Mode using shared owners |
| TRACK-CORE-1A..2 | Blender MCP → Web → Claude Design | WAITING | W0/G0 | proof → authoritative runtime parity → visual grammar |
| PLAYABLE-TRACK-R0 | Claude Design later | **DO NOT START** | Track Core proven + Web prep package complete | first playable representative route |
| COLOGNE-OSM-R0 | Web/OSM/Claude Design later | **DO NOT START** | Playable R0 pass + OSM provenance | Hürth→Köln real route |

---

## 1 · ENV-PREVIEW-STAGE-01 · copy-ready

**Owner:** existing PR #218 only.  
**No implementation changes unless required solely for publication wrapper.**

> @GitHub
> Start from current `georg-doc/kayfabizarro` PR #218 `ENV-PREVIEW-01`.
> Read current START_HERE/Stage workflow first. Verify the final candidate head and exact evidence; current observed PR head is `6718eef05f2b6dd0d79ae04884b33f3396c34379`.
> Publish the unchanged candidate as an additive KFB Cloudflare Stage comparison using the existing Hub/Stage owner. Link the direct `https://kayfabizarro.pages.dev/…` route from KFB Hub only after the exact route is browser-verified.
> Preserve WORLD_MATCH / SOURCE_ISOLATION / source-backed CONSUMER_PRESET. No second renderer, terrain, sky, camera or movement owner. Do not turn Travel Globe into world truth.
> Return exact repo/branch/PR/head, changed publication/metadata files, actual browser counts, direct Stage URL, screenshot/browser proof, unresolved items, and exactly one human next gate.
> No merge and no Live promotion.

---

## 2 · TOOLBOX-R2-PUBLISH-01 · copy-ready

**Owner:** ToolBox PR #185; review recovery PR #221.  
**No new ToolBox features in this slice.**

> @GitHub
> Recover ToolBox owner state from PR #185 and PR #221. Verify current refs first; current observed PR #221 head is `e935f7ebbc2c40691248cd6910840a9f4b746a93`, with 33/33 browser evidence in its PR record.
> Publish only the existing r2 review surface under the existing additive ToolBox Stage route and add/update its KFB Hub human-review link through HUB-CTRL/Production Desk. Do not modify actor/motion/pose/ear owner modules.
> Human review must expose Source Object first, then semantic State, then Pose/IK, with full actor and EarRig-v5 silhouette visible on desktop and mobile.
> Open the exact `https://kayfabizarro.pages.dev/…` route and prove the intended revision before claiming Stage/public verified.
> Return exact heads, files, test counts, public browser proof, direct route, unresolved items and one next human gate. No merge/Live promotion.

---

## 3 · TRACK-CORE-G0 → W0 · copy-ready

**G0 human/WSA decision:** approve JavaScript as authoritative core unless recon finds a concrete current-owner contradiction.

After G0:

> @GitHub
> Start TRACK-CORE W0 from current PR #219, not from `main`.
> Read `skills/chat/START_HERE.md`, Stage/Fresh-Chat protocols, then PR #219 `KFB_TRACK_CORE_SLICE_2026-09-26/START_HERE.md`, `SPRINT_PLAN_TRACK_CORE_BLENDER_2026-09-26.md`, `SP13KTRA_DONOR_ALIGNMENT.md`, `WEBCHAT_TRACK_CORE_0_CENSUS_CONTRACT_BRIEF.md` and the latest W0 addendum in `WSA_DRAFTS_TRACK_CORE_2026-09-26.md`.
> Race remains implementation/physics owner. Deliver the exact track/contact census, contracts, and the small pure-JS reference requested by the latest sprint plan: arc-length samples/frames, profile sampling, paint, branch-safe projection and deterministic fingerprint. No Three.js/DOM/engine globals in the reference core.
> SP13KTRA is principles-only donor evidence; do not copy code/constants/tables.
> Add future requirements as contract fields only: free/rail drive mode, arbitrary up, gravity reference/policy, skin/profile/material/set-pieces separation.
> No Stage/Live, no Race physics migration, no Playable R0.
> Return exact repo/branch/PR/head, files, Node/static test counts, unresolved owner facts and exactly one next gate: B1 Blender oracle bridge.

---

## 4 · CAMERA-CORE-0 · copy-ready

**Goal:** choose/reuse one shared browser camera owner before World mobility integration.

> @GitHub
> Create a bounded Web/GitHub recon slice under the current ToolBox/WorldBuilder coordination layer; do not create a second renderer or movement owner.
> Source-isolate and compare:
> 1. accepted WB2 orbit/pan behavior;
> 2. WhackMan cursor-focused zoom behavior;
> 3. accepted Travel ground↔flight camera/movement transition as a donor only.
> Show each actual donor behavior/source in isolation before proposing integration.
> Write a small camera contract for orbit, pan, cursor-focused zoom, touch, fit/target, viewport resize and consumer handoff. State exactly who writes camera transform and how game/player movement remains consumer-owned.
> Recommend the existing best owner path; only if no suitable shared owner exists may WSA approve a new small module adjacent to `tools/KFB-ToolBox/lib/edit-layer.js`.
> No World runtime integration in this slice. Return donor refs, contract, risks, tests of any pure helper math, and one implementation gate.

---

## 5 · WORLD-R2-CONTRACT-RESET-01 · copy-ready

**Do not touch failed runtime first.**

> @GitHub
> Recover current WorldBuilder PR #190 and `tools/KFB-ToolBox/worldbuilder/world-integration-01/failure-recovery/START_HERE.md`.
> The previous World r2 browser gate exhausted two repair passes. Do not make repair pass 3.
> Complete only `WORLD-R2-CONTRACT-RESET-01`: identify the stale selftest/variant-label assumptions that reject the now-shared ToolBox locomotion semantics, rewrite the test/contract expectation against the current owner vocabulary, and prove the contract independently before any runtime retry.
> Preserve accepted WB2 terrain/editor behavior and shared ToolBox locomotion ownership.
> Also record the current world rule: Travel Globe is not world base; TinySkies/Travel sky/weather/light/mood and selected movement/camera donors remain reusable.
> Return exact changed contract/test files, before/after assertion counts, no hidden runtime changes, and exactly one next gate. No Stage/Live.

---

## 6 · ACTOR-FB-BODY-FAMILY-01 · copy-ready delta

Reuse the existing #204 prompt section; this is a delta, not a replacement brief.

> @GitHub @Dropbox
> Read current Production Architecture `ACTOR-FB-BODY-FAMILY-01`, ToolBox owner PR #185, Motion Library v2 PR #213 and EarRig-v5 PR #214.
> Requirement delta from Georg, 26.09:
> - one FrizzleBob identity/head reference;
> - prove compatibility across real KayKit Legacy, Medium and Large destination bodies/rigs, not a generic replacement body;
> - complete rig presentation includes ears/EarRig v5;
> - Medium/Large variants must preserve the destination skeleton/motion compatibility needed by the current 179-clip Motion Library;
> - scale/profile comparison is head-relative and measured;
> - source objects first in isolation; no placeholder body.
> Browser/ToolBox graft and compatibility proof first. Use Blender MCP only for a selected variant if topology/weights actually require it.
> Return 2–4 explicit variants with provenance, Idle/Walk/Run + one action, EyeRig/mouth/EarRig compatibility, measured scale facts, and one selection/human gate.

---

## 7 · SURF-POSE-01 · copy-ready

> @GitHub @Dropbox
> Add a bounded Animation Lab pose-authoring slice for card flight. Reuse current FrizzleBob/body profile, PoseRig/Animation Lab and Motion Library; do not create another rig or animation database.
> First show the exact selected actor/body source in isolation.
> Author a compact source-backed pose set for flying-card traversal: neutral surf stance, accelerate/lean, bank left, bank right, brake/flare, landing-ready. Prefer static/pose-layer authoring; only create a time-based clip if the pose owner cannot express the requirement.
> The pose set must remain compatible with the selected Medium/Large motion skeletons and consume EarRig/EyeRig rather than replacing them.
> Export named pose/profile data consumable by WorldBuilder flight. Return screenshots/pose measurements, files, tests, and one human gate.

---

## 8 · WORLD-MOBILITY-01 · WAITING brief

Start only after Camera Core and World contract reset.

> @GitHub
> Build the smallest owner-backed mobility proof inside current WorldBuilder: shared ground locomotion + card flight/God Mode + one continuous ground↔flight transition.
> Consume ToolBox locomotion/profile owner, the accepted Travel TMB-2 movement transition as donor, and the approved shared camera owner. Travel terrain is forbidden.
> One movement writer at a time. First proof is local-region only; no need for globe world base.
> Preserve WB2 edit/sculpt/save-reload. Stop before OSM/track corridor carving; height-authority seam is a separate contract.
> Stage only after real browser proof; return direct KFB Stage URL for human review.

---

## 9 · PLAYABLE-TRACK-R0 · HOLD instruction for Claude Design

**Do not start this now.**

The Claude Design R0 brief currently lives on Cologne Route PR #216, not on `main`. Its missing `RUNTIME_BASE.json`, `MODULE_CATALOG.json`, `PLAYABLE_TRACK_R0.recipe.json`, `OSM_SEAM_CONTRACT.md`, `SOURCE.json` and donor-evidence package are **expected missing prerequisites**, not files to improvise.

R0 becomes dispatchable only after:
1. G0/W0 Track Core;
2. Blender oracle sprints and authoritative Web runtime parity;
3. Web `PLAYABLE_TRACK_R0_PREP` emits the closed source package and isolated donor evidence;
4. WSA/Web confirms the exact branch/ref in the Claude brief.

Until then Claude Design should return SOURCE_REQUIRED and stop, exactly as it did.
