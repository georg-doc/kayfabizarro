# KFB Visual Critic · Replay Evidence & Quality Ladder R1
Date: 2026-11-22 · Status: **PROPOSAL / SOURCE-REVIEW ONLY** · coordination owner: KFB Visual Studio (#479) · receiving writer: existing game WS0/Claude Code.

**Outcome:** make every defect, correction and visual acceptance traceable from a *real* rendered frame/timecode through its exact player/game/renderer state to the next reproducible game build; progressively raise measured quality without losing approved Goldens.

## Source and boundaries
- Coordination SSOT / intake: [KFB Visual Studio #479](https://github.com/georg-doc/kayfabizarro/issues/479); shareable scene/presets [#478](https://github.com/georg-doc/kayfabizarro/issues/478); Diorama consumer [KFB-Stunt-Car-Race #152](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/152).
- Current playable receiving owner: `georg-doc/KFB-Stunt-Car-Race` → `game/integration-r2`; current source must be re-fetched before execution. This document does not authorize runtime edits, a second recorder/renderer, or a new Side/Site.
- **Verified donor scripts** at the reviewed race branch: `src/flags.js` (`rec=1`, named flags), `src/siteHash.js` (`TESTFAHRT_HASH`, `SLICE1_HASH`), `test/criticShots.mjs` (Playwright real in-game screenshots, alternate cameras and grayscale/thumbnail), `scripts/ir2/profil-fahrt.mjs` (per-frame rAF durations, CPU-profiler, renderer resource deltas, p50/p95/p99), `docs/UEBERGABE_WS1_INTEGRATION_R2.md`. Reuse these instead of building a parallel capture engine. They do **not yet prove** frame-perfect shader-uniform snapshots or video+input replay.
- Actual Aquarium Claude Code 4.0 ideal-path source, current runnable Aquarium module and Site route are **UNVERIFIED**. A design brief is not proof of an executable playthrough.

## 1 · Two traces, common stable contract
- `LINEAR_IDEAL`: named route/beat sequence from the real source, scripted or controlled by existing input harness, with expected reward/trigger and actual observed behavior. Status `PLANNED_NOT_EXECUTABLE` if source contains story beats only.
- `FREE_ROAM_DEVIATION`: an independent reviewer/tester explores detours, camera changes, fails/retries, alternative routes and loads. It must record its own capture rather than merely reusing the builder video. Missing independent execution = `CRITIC_NOT_RUN`.
- `TARGET_EDIT`: Webchat/ImageGen edits of a *copy* of a real captured frame; always stored as a **proposal or Georg-approved design Golden**, NEVER identified as an actual engine render.

## 2 · Capture precisely enough to reproduce
Each review run has a `run_id`, evidence schema version, scenario/beat IDs and one read-only manifest (`review.schema.json`; example `EXAMPLE_NOT_A_TEST.json`). Record **every significant state change** and anomalies, not a huge full uniform dump every frame.
- **Provenance/build**: exact repo/branch/head, dependency/build bundle ID/hash, deployed release marker verified or `NOT_VERIFIED`, private asset-manifest hash and source object identity, script/scene/seed IDs, last accepted target and source pins.
- **Clock alignment**: UTC capture wall clock + monotonic clock start; game tick / sim-time, screenshot index, video PTS/frame index, event ID and cause-parent IDs. Keep explicit paused/slow-motion/dropped/repeated-frame markers. UTC alone is insufficient for input/VFX ordering. Record clock sync tolerance and missing frames.
- **Game state**: allowlisted ordered active flags (and hash), mode/world/biome/level, game-state checkpoint/scenelet, authoritative world seed, RNG stream if deterministic, camera pose/projection/FoV/exposure, player pos/rotation/velocity and active input/action buttons, player health/rewards, event triggers/spawns/despawns, collider contact. `null` or `UNKNOWN` when unobtainable.
- **Renderer / cascading material context**: renderer/backend/version, color space/tone mapping/AA/shadow/fog/lighting state, active LOD and visible asset IDs/transforms, material ID and shader source/defines hash, relevant texture/UV/normal maps and source hash, **allowlisted relevant shader uniforms** at event time, particle systems emitter + spawn/velocity/age/depth/occlusion, parent/child effect/event chains, async asset/load status with request timings/network errors and resource ready state. Never assume a screenshot reveals shader causality by itself.
- **Device**: coarse device class/test rig ID, OS version, browser/WebView version, GPU vendor/model, renderer API/driver if available, CSS viewport, physical render resolution, DPR, orientation, refresh/cap, graphics preset, battery/power or GPU concurrent load when measurable. Capture `UNKNOWN` when unavailable; exclude personal serials, account IDs, cookies and credentials.
- **Performance**: frame time p50/p95/p99/max and region of the spike, CPU/GPU timing with distinct `measured`/ `estimated`/ `unavailable`, draw calls, triangles, texture count/memory if supported, asset loader timings, console/network errors and shader compile/link failures.
- **Evidence**: original untouched PNG/WEBM and audio when meaningful, contact sheet, per-event before/during/after frame images, target PNG, annotation PNG, media file SHA-256, precise path/URI in permissioned storage, UTC creation, byte length and whether the image is `ACTUAL_GAME` / `TARGET_GENERATED` / `ANNOTATION`. Avoid putting private licensed assets/game media into public `kayfabizarro`.
- **Snapshot modes**: baseline every checkpoint, low-overhead event log each tick/when changed, short pre/post-event ring buffer on stutter/load/glitch, optional on-demand deep shader-state probe. Render capture may perturb FPS: mark diagnostic overhead and rerun timing without heavy capture before declaring perf PASS.

### Minimum anomaly record
`event_id, run_id, beat_id, frame_id, pts_ms, sim_tick, monotonic_ms, severity, trigger_input, previous_event_ids, state_snapshot_id, device_profile_id, related_asset/material/shader_ids, timing/error details, screenshot_sha, next_replay_id`. Store the exact *observed* values, not hallucinated measurements. A screenshot only proves pixels at that pose/time, not the originating shader cause.

## 3 · Replay fidelity / drift guard
1. Before comparing, ensure source+assets+flags+seed+camera/lighting+renderer+device class match or record intentional deltas. Version both baseline and candidate. Reconstruct the run from same checkpoint, replay controlled input and state trigger. Capture a second view when 3D contact/occlusion is at issue.
2. Generate side-by-side triptych **actual before / approved image target / actual after**, and motion strips with equivalent PTS/beat ID. Mask approved unaffected regions to prevent silent regression elsewhere.
3. Quality metrics: image alignment, region semantic/object overlap, silhouette, perceptual similarity (e.g. SSIM/LPIPS only if tool implemented), temporal onset/duration and visible artifacts, correct material/asset origin, verified gameplay events; state weights and measurement method in the review. Never call raw pixel similarity a universal perceptual-quality score.
4. Georg's notion of **80% visually indistinguishable** is a **proposed calibrated target-fidelity threshold**, not a verified objective fact. Use it as `TARGET_FIDELITY >= 80/100` **only after** a fixed rubric + reference pair + human calibration and report uncertainty; dynamic particle scenes require temporal parity, not a single frame. 100/100 is an aspirational maximum of the rubric, never automatic artistic acceptance.
5. Stop/inhibit PASS if a critical failure exists (broken controls, severe loading/glitch, missing asset, wrong identity, failed source isolation, major audio/video desync, invalid comparator, bad frame synchronization), regardless of average quality. Both independent critic and technical tester are distinct from builder.

## 4 · Multi-dimensional quality hierarchy (KFB rubric, NOT a vendor studio's secret standard)
Per beat score each relevant dimension 0–4 with screenshot/timecodes, then normalize: `dimension_score = 25 × rubric_level`. Avoid an overall score without evidence. Default optional weights (adjust per task):
| Dimension | Weight | 0 → 4 evidence |
| --- | ---: | --- |
| Target fidelity / source integrity | 25% | wrong/absent → visually and provenance-correct |
| Spatial composition / scale / grounding / readable scene | 20% | incoherent → intentional and robust across cameras |
| Animation / VFX / timing / sound cues | 20% | absent/broken → integrated, synchronized and convincing |
| Gameplay / dramaturgy / reward legibility | 15% | blocked/unreadable → well-staged and understandable in actual play |
| Runtime technical health | 15% | crashed/regressive → stable target-device measurements |
| UX/accessibility / visibility / input clarity | 5% | blocked → clear and consistent |
Mark `NOT_APPLICABLE` and renormalize weights, not 0; `UNKNOWN` blocks a fabricated composite. Save raw dimension assessments, weight version, evaluator, target, evidence and confidence; a computed summary is **diagnostic**, not automatic `GEORG PASS`.

**Three reference ladders, not inherited brand laws:**
- `MINIMUM_TOP_INDIE`: coherent art/readability, playable interaction, stable scene, no critical visual/technical failures.
- `PREMIUM_GAME`: comparable professional polish, responsive camera/action feedback, meaningful materials, integrated effects and good temporal continuity.
- `AAA_REFERENCE / ANIMATION_REFERENCE`: opt-in *stretch comparisons* based on specific lawfully sourced screenshots/clips and observed properties (e.g. Riot/Rockstar visual feedback, Nickelodeon character acting). Do **not** claim those companies have an official numerical KFB benchmark or import their art direction automatically. Georg decides reference adoption per scene.

Differentiate **quality tier**, **target-fidelity score** and **verified runtime/test PASS**. An effect can match a painted screenshot at 90 while remaining invalid under actual play.

## 5 · Low-effort / high-impact prioritized defect backlog
Each finding records `finding_id`, run/beat/frame/timecode and source anchor, before/target/after images, issue type, local defect, intended fix, owner/module, risk, dependencies, status, acceptance probe and decision history. Triage:
- P0: crash/unplayable, wrong source identity, user-specified accepted Golden destroyed, critical visual/gameplay failure.
- P1: repeated or very prominent visual/temporal fault (camera, transition, key moment, illegible rewards).
- P2: bounded local defect with clear improvement.
- P3: speculative cosmetic polish / optional variants.
**Priority heuristic (for ordering only)**: `ROI = (impact_1_to_5 × visible_frequency_1_to_5 × confidence_0_to_1) / (estimated_effort_1_to_5 × regression_risk_1_to_5)`; never override P0/owner boundaries with this number. Do quick high-impact one-seam improvements first; each repair is an additive child revision.
**No score inflation**: reproduce before repairing, lock target and unaffected Goldens, take one known-good baseline and negative case, run narrow code tests + capture again. Keep full per-dimension history (e.g. 30 → 55 → 78 → 86), but use `NOT_MEASURED` rather than inventing improvements.
After **two non-improving repair passes** on the same seam, preserve candidate + evidence and perform smallest-seam failure recovery under existing Production Guard contract. No infinite silent loop.

## 6 · Review lifecycle and output
`CAPTURED → CONTEXT_VERIFIED → CRITIC_REVIEWED → TARGET_PROPOSED → [GEORG_DESIGN_APPROVED] → BUILDER_REPAIR → TESTED → INDEPENDENT_REVIEWED → [GEORG_PRODUCT_ACCEPTED]`. Skipped statuses remain explicit. Only verified media can establish evidence. Immutable accepted Golden is a file+SHA, never overwrite it; rollback requires compatible source+asset+runtime+configuration replay and fresh tests.
- **ChatGPT Web / private plugin**: source references, critique and target paintovers, no runtime write; plugin binary ImageGen roundtrip/GitHub upload still needs a real proof.
- **Claude Code / WS0**: only writer of owning game modules/flags/level logic and build; produce real rendering and perf evidence.
- **Independent critic**: can review packaged screenshots/clips (design evidence) but cannot claim independently performed free-play or browser PASS unless it actually ran the game.
- **Site/Hub**: optional eventual read-only projection; no new Game Site, Stage or Live by this research brief.
- **Audit trail**: include source commit SHA, immutable media hashes, UTC, critic report, code PR/head, changed files, actual test counts, next one gate; all historical records additive.

## 7 · Smallest productive receiving proof
Owner resolves current Aquarium ideal path (if found) or uses existing, source-backed Race Diorama camera proof. Capture **one 10–30 s actual beat** + a deliberate deviation, log original + same-camera frame, one complete cause-linked state snapshot and simulated/discovered anomaly **from real evidence**, one ChatGPT paintover, one critic finding and one narrowly repaired candidate. Verify private artifact hashes and replay on a named device, and show before/target/after. **Do not fabricate test evidence, result or 80% score**.

**One next gate:** `KFB_VISUAL_REPLAY_CAPTURE_01` – reuse real capture/profiler/flags to produce one evidence-complete, replayable real frame/clip and versioned defect report; only then automate a rubric and calibration.
