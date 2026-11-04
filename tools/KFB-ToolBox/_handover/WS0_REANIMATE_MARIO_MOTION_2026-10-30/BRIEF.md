# WS0 · Reanimate donor qualification + Mario-like cartoon motion recovery · R1

Date: 2026-10-30
Mode: RESEARCH / BOUNDED DONOR POC, **not runtime authorization**
Status: BRIEF READY · IMPLEMENTATION NOT STARTED · EXTERNAL TOOL NOT VERIFIED
Owning lane: KFB ToolBox / Motion authoring (existing owner)
Next executor: **WS0**, source-first, isolated proof only
Repository: georg-doc/kayfabizarro
Planning branch: research/ws0-reanimate-mario-motion-donor-2026-10-30
Product outcome: decide whether the external /reanimate donor can measurably improve **one KFB cartoon jump or start/stop sequence**, based on the established KFB animation authoring contracts. A user report calls earlier attempts at recreating Super-Mario-like character movements only moderately successful.

## Read-first / authority
1. skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md.
2. skills/kfb-cartoon-animation/SKILL.md and references/kfb-integration-current-ssot.md, 20-locomotion-gaits-transitions.md, 90-validation-debug-evidence.md.
3. ToolBox START_HERE, ToolBox animation source, current Motion PR #344, current consumer PR #348/Recovery before ANY consumer integration.
4. This BRIEF.md, SOURCE.json, TEST_REPORT.md, RETURN.md.
5. The exact newest repo head / owner Return overrides the historical pins listed below.

## Georg's intent / why this exists
- Investigate https://reanimate.niazmorshed.dev/ as **a potential animation reverse-engineering donor**, primarily for recovering the recognizable timing/weight of classic Mario-like cartoon locomotion, jump, anticipation, landing, acceleration and stop.
- This extends the earlier identified opportunities: HUD/action slots, comic speech/thought FX, Emanata, portal/Cascade Sphere ripples, 2D/2.5D cutout acting and 3D actor posing.
- Georg explicitly wants these concepts persisted **for WS0 planning and trial**; this is not a request to replace the current motion system or change the live Open World.
- Super Mario/Nintendo is a **movement-quality benchmark**, not permission to copy proprietary sprites, audio, rig data or whole animation frames. Create original KFB presentation on pinned KFB actors.

## External tool identity + fact guard
The exact candidate is **Niaz Morshed's /reanimate** at https://reanimate.niazmorshed.dev/.
A public announcement describes the intention as “Reverse engineer any animation from any website, video or gif”. At this checkpoint, direct site retrieval is unavailable and no verified technical docs, export schema, source repo, license or demo output was obtained.
Never conflate with unrelated reanimate/reanimate (Haskell SVG library) or reanimate.sh (product videos). Do not claim video->3D skeletal/GLB output, API support, production suitability, open source or copyright clearance until demonstrated.
If login, payment, upload restrictions or access block qualification, record exactly; do not build an imitation tool.

## Protected KFB ownership
- KFB Cartoon Animation skill = choreography, motion QA, authoring method; no second animation doctrine.
- KFB ToolBox / current Animation Lab = existing 3D playback, authoring and rig/clip audit; preserve current Graft/EyeRig/actor/rig boundaries.
- 2D Animation Studio = source-exact SVG/cutout, 2.5D, semantic EyeRig adapter, **not** the 3D skeletal owner.
- Motion PR #344 native KayKit baseline: 21 KEEP / 3 HOLD / 0 REJECT; medium Walk Walking_B, Run Running_A, Sprint Running_B, Jog speed/phase blend. Never silently replace accepted clips or retime baseline.
- Movement/Physics owner owns world trajectory, contacts/collision, Ground controller and Space jump; animation owns presentational pose/timing/secondary motion. No second controller/camera/physics owner.
- Open World PR #348 and R4 failed/stopped Recovery are **not** a trial receiving surface. No edits, R5, geometry repair, Stage, new Site, hub routing or Live as part of this research.

## Priority experiments (in this order)
**G0 · External capability and rights audit — mandatory before calling it a donor**
1. Open exact candidate site; record date, actual interactions, available inputs (website URL/video/GIF), login, costs, license/ToS, output types and export path. Save real screenshots.
2. Verify using one **original, KFB-owned** 1–3 s motion reference first; identify whether output is video-only, 2D layer/CSS/SVG, curves/keyframes, arbitrary code, skeleton/FBX/GLB or unavailable.
3. If no editable data, classify VISUAL_REFERENCE_ONLY rather than fabricating an import path; proceed with manual measurements below if useful.

**P1 · Main experiment: one cartoon jump lifecycle**
- Use source-backed **KFB Mannequin_Medium** or an already approved Rig_Medium actor from the real Motion donor; do not substitute ActionFigure or an invented model as the accepted native baseline.
- Reference motion qualities: brief anticipatory crouch; readable extension / takeoff; ascent silhouette; apex hold/read; falling anticipation; foot-ground contact; short squash/compression; recovery to locomotion/idle.
- Preserve authoritative Ground movement/physics: trajectory must come from existing controller. The visual layer may express compression/stretch, torso/arm/leg poses, additive secondary motion, not move the player in world space.
- If /reanimate cannot provide skeleton-compatible output, extract or measure neutral parameters (beats/duration/easing/pose poses); manually author via existing KFB animation layers, label this as manual translation (not automated export).

**P2 · If P1 proves useful: start → accelerate → run → brake/stop**
- Use the approved native gait ladder without replacing Walk_B / Running_A / Running_B. Concentrate on short entrance/exit poses, head/torso lean, cadence transition, deceleration recoil and grounded foot phase.
- Compare fixed-camera baseline against source-informed presentation for identical input traces, movement/camera and physics.

**P3 · Secondary consumers only after P1/P2**
- HUD/action button micro-interaction, 2D Emanata/speech-thought bounce, or Cascade Sphere ripple. Choose **one** only when the relevant existing owner requests a donor; don't widen this WS0 research slice into three implementations.

## Required reproducible evidence
1. **Actual source shown in isolation**, original motion reference and exported /reanimate object displayed alone; URL loading alone is NOT donor-use proof.
2. Record source clip identity, rights, input form, exact export file/format, timestamped motion beats/key poses, target rig identity, and which stage is manual.
3. Side-by-side fixed camera A/B at identical scale/fps: accepted KFB baseline vs source-informed candidate, input trace + authoritative world/camera unchanged.
4. Assess launch readability, apex, landing/compression/recovery, planted-foot slip, unexpected double motion, interpolation noise, and whether it settles cleanly to neutral.
5. Browser playback / source object proof; screenshot or <=15 s recorded clip. Verify with an independent tester/critic before declaring **TESTED RESULT**. Qualitative **visual judgment** is required; numeric tests alone don't prove Nintendo-level feel.
6. Explicit licensing/usage classification for external reference and generated output before retention or distribution. Keep source reference out of distributable game assets unless independently permitted.
7. Record performance/memory only if actual target integration is authorized and observed; don't invent frame timings.

## Decision table
- **ADOPT AS EDITABLE DONOR**: specific reusable editable output exists, license is resolved, isolated source is inspected, and A/B on an existing KFB actor clearly improves read without breaking owner boundaries.
- **ADOPT AS REFERENCE-ONLY**: useful timing/easing analysis but no viable skeletal/semantic export; retain measured motion recipes and manually authored source-backed KFB clip.
- **REJECT / DEFER**: unavailable, incompatible, restrictive rights, unsatisfactory visual comparison or no material gain over existing native clip.
- **UNKNOWN** until proof. A marketing claim is not a tested result.

## Stop and fallback
- Two non-improving repair passes on *the same small donor seam* => preserve candidate + failure evidence, quarantine/defer donor, continue parent KFB motion work using existing clips/manual choreography unless Production Guard proves it outcome-critical.
- External tool unavailable => source identity/capability gate stays UNKNOWN; do not attempt game integration on speculation.
- Do not implement on PR #348, change published Stage, merge or promote Live without separate existing-owner authorization.

## WS0 handoff / one next gate
**Next: G0 source/capability/rights audit on the exact Niaz /reanimate site with one original KFB-owned 1–3 s reference.** Return actual screenshot/export evidence and a yes/no on editable input→output feasibility. Only then run P1 isolated Mario-like jump A/B through current Motion owner.

## 2026-10-30 · Claude SOP playlist training (additive companion)
Georg supplied a YouTube playlist to train Claude on correct use of KFB production SOPs. The URL and **unverified** video inventory are captured in `PLAYLIST_SOURCE.json`; full learning-by-doing protocol in `CLAUDE_SOP_PLAYLIST_TRAINING.md` and `SOP_TRAINING_TEST_PLAN.md`. This is a preparatory **training/evaluation** exercise, not a claim of watching videos, successful model fine-tuning or an adopted /reanimate integration. Claude must demonstrate E1 authority recovery, E2 donor-object isolation, conditional E3 original KFB jump A/B, E4 crash-safe GitHub readback with independent assessment. Do not treat videos as SSOT or replace accepted motion owners.
**One next gate remains WS0 G0:** prove exact playlist inventory/access **and** /reanimate input/export on an original KFB-owned reference before P1.
