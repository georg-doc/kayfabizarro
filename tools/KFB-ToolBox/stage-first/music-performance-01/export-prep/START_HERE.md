# KFB Motion-to-Video · Export Prep R1

**Status: PREPARATION ONLY · NO RENDER/MUX/NEW SITE**  
**Date:** 2026-10-12  
**One owner:** existing ToolBox MUSIC-PERF-01, protected Draft PR #207 (receiving ToolBox PR #185).  
**This branch:** `planning/kfb-motion-to-video-prep-r1-2026-10-12`, stacked on MUSIC-PERF #207 head `aef93c2521a0818318e0810752f065727c1e5622`.  
**Product outcome:** source-backed, deterministic 8-second, 30-fps **frame sampling contract** feeding a *later* browser video/audio mux; do not rebuild the song timeline or actor runtime.

## Existing truth (read first)
1. `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`.
2. Parent `../RECOVERY.md`, `../RETURN.md`, `../SOURCE.json`, `../performance-recipe.json`, `../TEST_REPORT.md` and `../music-performance-01.js`.
3. ORB original `../donor/orb_module_source.json` and GLB `../donor/orb_band_module_v5.glb` **visually in isolation first**. Reuse only original, exact song `../audio/rubbish_groove.mp3`; verify Git blob pins and 1:1 donor identity.
4. `SOURCE_MANIFEST.v1.json`, this folder's `frame-plan.mjs` and `test/frame-plan.test.mjs`.

## Scope & protocol
- Sample **240 distinct frame indices [0,239]** at **30 fps**, total output duration **8.000 s**, 1280×720.
- Use the existing Rubbish Groove, not fabricated dialog/voice. `songTimeSec = 0.465 + frameIndex/30` and `beatPos = (songTimeSec - 0.465)*100/60`. Sample at [0,8) seconds: the final image timestamp is 7.966667 s; audio trim lasts exactly 8 s.
- Drive the existing `bounce` and `strum` action refs using current source metadata durations/cycle beats. Drummer action is present in the **isolated donor**, but **HOLD → hidden** only in integrated Performance mode.
- Current browser preview uses one HTMLAudio transport and `syncActions()` with mixer.update(0). For deterministic capture, adapt the existing mixer to **seek at a supplied time on a capture-only path**; never add another song player, actor state owner or scheduler.
- Audio extraction must use the exact pinned MP3 trimmed from **0.465 s to 8.465 s** and mux once after frame generation; the silent visual frame fixture is not an AV-sync proof.
- Browser export feasibility must inspect WebGL framebuffer/canvas capture, source color-space/alpha, lost contexts, codec/browser support, audio codec/latency and mux PTS; `MediaRecorder` alone is not a deterministic video export guarantee.
- Compare Mediabunny vs. `@remotion/web-renderer` (only if it can faithfully consume real Three.js/canvas frames), plus ffmpeg as optional non-browser QA tool. No package installation or vendor adoption was authorized by this prep.
- Source mode (full donor) is proof of source identity; performance mode filters disabled drummer. No substitute meshes, generic UI, new brand, retiming or music beat changes.

## Test contract
Run from repository root:
```bash
node tools/KFB-ToolBox/stage-first/music-performance-01/export-prep/test/frame-plan.test.mjs
```
This verifies recipe/donor pins, negative cases, precise time math and repeatability **without a renderer**. It cannot prove frame pixels, rendered MP4/WebM, audio mux, real browser playback, KFB Site, or Georg approval.

## Runtime owner protection
- Frozen MUSIC-PERF PR #207 Stage candidate/human PASS-TUNE-REJECT remains untouched. This prep is a child branch; no changes to its HTML/JS, donor assets, MP3, Audio Site, Cloudflare route, WB2 or Motion Library.
- Export consumes KFB audio transport, never invents a second AudioContext or song timeline. Do not mix general Resident chatter into this proof.
- The first implementation should use the already-working ORB-Performance fixture, not reopen stopped WorldBuilder R4.
- Preview window `32 beats` = **19.2 s**; the **8.0 s video capture is intentionally a shorter crop**, not a change to the source recipe.
- Site is primary when a product-ready Site update exists; do not publish a second Site. Existing public MUSIC-PERF Stage proves the old player only, not this export.

## Exactly one next gate
`MOTION_TO_VIDEO_8S_REAL_FRAME_CAPTURE_AND_AV_MUX_R1`: a separate executor (Work/WSA or repo-native browser runner) source-isolates original ORB, renders **actual** 240 Three.js frames from current donor, muxes an **actual** 8-second pinned MP3 slice, replays the video, verifies frame repeatability (frame hashes at fixed indices), audio sync, codec/browser fallback, and produces a direct GPT Site only when the existing receiving Site/owner is confirmed. No human playback gate for technical diagnostics; original PR #207 human review remains independently pending.
