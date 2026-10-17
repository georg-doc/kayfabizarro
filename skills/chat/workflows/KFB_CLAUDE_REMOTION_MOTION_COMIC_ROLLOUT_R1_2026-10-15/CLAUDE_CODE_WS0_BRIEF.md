> **R2 CURRENT ROUTE:** Interactive card-motion viewer pilot replaces the video-first next gate of this R1 historical brief. See `INTERACTIVE_MOTION_RECIPES_R2.md`. Current gate: `CLAUDE_CODE_WS0_REAL_SOURCE_INTERACTIVE_CARD_MOTION_PILOT_R2`. MP4/16:9/9:16 video is downstream optional. Existing WS0 v5 ownership and no-runtime/Stage/Live rules remain.

# Claude Code / WS0 Intake · Real Four-Card Motion Comic R1

**Execution mode:** NEXT GATE BRIEF · NOT AUTHORIZATION TO RUN OR SHIP IN THIS RESEARCH SLICE  
**Date:** 2026-10-15  
**Research ref:** `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15`  
**Receiving owner:** existing KFB Comic Card Deck Viewer v5 / WS0, with canonical `media/kfb/index.json` and existing card refs. Marketing, Game/Cutscene, Music Performance consume results downstream.  
**Intended outcome:** one edited 12–20s **real** four-card motion-comic proof with audio optional, original artwork preserved, 16:9 master plus re-composed 9:16 short. This is NOT a 56-card all-deck project, new Story editor, video studio, 3D motion renderer or marketing rollout.

## Cold start / authoritative sources

Read, in order:
1. `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`.
2. `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RESEARCH_AND_PIPELINE_R1.md` and `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RETURN.md` on current research head.
3. `KFB Comic Card Deck Viewer v4 (WS0)/HOUSEKEEPING.md`, `RETURN.md`, v4 original, v5 **candidate** and `deckviewer/kfb-corpus.js`; `media/kfb/index.json` remains data owner. Latest active WS0 branch/PR and registry mapping decide what counts as a real card crop.
4. `tools/KFB-ToolBox/stage-first/music-performance-01/export-prep/START_HERE.md` and `RETURN.md` on `planning/kfb-motion-to-video-prep-r1-2026-10-12`, Draft PR #391. R1 3D-prep is **not implemented export**, share time/addressing lessons only. Do not use MUSIC-PERF's ORB as a dummy 2D artwork.
5. Existing ChatterBox / Audio / Triplets owners only if the chosen **approved** audio/dialog needs them; no LLM-generated text substitute, no new music clock or bubble author.

## Builder/QA separation

- **Builder / Integrator (only production writer):** Claude Code in the existing WS0 Deck Viewer receiving owner; use one approved implementation branch after source arbitration.
- **Integration Tester:** independent source/card/timing/render tests against actual outputs; report executed numbers, not hypothetical counts.
- **Independent Critic:** inspect source objects alone and their rendered result; judge actual artwork identity, pacing, readability, comedy timing, vertical composition. No writes.
- **Production Guard:** decide CONTINUE/REPAIR/QUARANTINE/STOP, only if failing seam actually prevents this bounded outcome.
- **Human product gate:** one first playable/viewable creative judgment by Georg **only after** a real short clip exists; no pseudo-human sign-off on contracts alone.
- Two non-improving repair passes: freeze and export only the smallest failing seam; preserve original and record its failure, continue the parent outcome unless Production Guard proves outcome-critical.

## Source-first mandatory visual gate

1. Select one verified four-card PDF page **from existing indexed corpus**, not a generated demo page. Mission Control card 56/page 15 is an established verified example of a deep link, **not automatic proof page 15 is a four-card layout**.
2. Show exact PDF full page/contact sheet plus four real mapped source card images **in isolation**. Compare with viewer screenshot pixel/geometry. Identify bubble typography and whether art already contains text.
3. If actual mapping is unverified or page tiles aren't genuinely available, stop that card and pick another verified page. No fabricated cropped card, procedural placeholder, repainted KFB logo, fake speech bubble, generic stock background, replacement character, or internet example card.
4. Confirm actual visual source object, not just a successful image URL. Keep source IDs/path/blob/checksum and genuine layout evidence in the result.

## Implementation recipe (only after source gate)

- Keep original ink and original art readable. Separate card cropping from animation; never modify `media/kfb`, Registry or v4. Use read-only data adapter with canonical identifiers, stable page/tile dimensions, and fail-closed mapping.
- Draft four-beat **shot EDL in JSON**; source order may deviate only deliberately for dramaturgy and must retain source identification. Each shot has `startFrame`, `durationFrames`, `sourcePage`, `cardRef`, `crop`, `cameraPath`, `holdFrames`, `bubbleRef`, `audioCueRef`.
- Use frame addressable declarative animation: no independently ticking setInterval, free-running CSS playback, `useFrame()` or randomization; script revisions are stable and re-renderable.
- Benchmark lightweight Remotion 2D Composition/Sequence against simple existing owner/native browser capture before adopting/removing dependencies. Do not quietly require `@remotion/three` for the 2D gate.
- Export 16:9, then independent 9:16 composition with reading-safe reframing and captions; do not use center crop that destroys text. Keep same source/cards/edit decisions as much as possible.
- If legitimate track audio is available, reference its existing source/crop time, respect ChatterBox/audio owner and verify sync with the final decoded video. Otherwise silence is a valid first proof; don't improvise a Suno song/TTS.
- Ship source/EDL/CLI recipe, real frame/contact-sheet evidence, MP4/WebM as supported, audio synchronization only if executed, test report and owning Return. Never label merely loaded assets or frame math as accepted video.

## Acceptance checks

- 4/4 source cards visually isolated + source page; verified IDs, page and crops.
- Stable deterministic selected-frame re-render; no card leaks, wrong page/label or text overlays.
- Readable original text, visible narrative progression rather than equal-duration slideshow, no clutter.
- 16:9 + 9:16 variants actually playable; text/caption safe area independently checked.
- Audio track timing and single authority only if audio was present.
- Browser/codec/output limitation documented; source and license constraints reviewed, especially proprietary Remotion usage terms.
- Report exact runtime/browser checks, count of source/frames tested, screenshots, clips, unresolved items, branch/PR/head. Only include direct Site/Cloudflare route when actually required and visually verified.

## Protected boundaries

No overwrite of viewer v4 donor, candidate v5 state, PDF/Registry, MUSIC-PERF-01 #207/#391, original ORB assets/audio, WorldBuilder R4 STOP, theatre curtain simulation, KFB runtime AudioContext, ChatterBox bubble owner, current active Triplets or approved tracks. No new render-service infrastructure / social-posting bot / editor UI / second runtime owner. No auto-merge, Live, Stage/public proof or invented social URLs.

**Single next gate:** `CLAUDE_CODE_WS0_SOURCE_ISOLATED_FOUR_CARD_MOTION_PILOT_R1`.
