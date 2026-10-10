# Donor audit · pdoom-video deterministic music-video rendering · 2026-10-10

Status: **RESEARCH / REFERENCE DONOR ONLY · NOT SOURCE-ISOLATED · NOT ADOPTED**
Owner: KFB ToolBox / Billboard Media Residency · existing PR #354
Repo/branch: georg-doc/kayfabizarro · planning/billboard-quote-hypernorm-curator-2026-10-04
Product intent: future authored, context-selected HyperNormalisation audio/visual sequences on existing clay Billboard and full-screen reading surface. No new render/audio/world owners.

## Original reference and provenance

- Original source: https://github.com/mexicat/pdoom-video (public, code marked MIT; song/lyrics expressly excluded from that license).
- Author's Reddit report dated 2026-10-10: https://www.reddit.com/r/threejs/comments/1x2dixo/i_made_a_full_music_video_in_threejs_every_frame/
- User-supplied video: https://www.youtube.com/watch?v=tfQ1hU448K4
- Source README's own video link (may be a distinct earlier upload): https://www.youtube.com/watch?v=5EoO5413dBY
- Technical docs: https://github.com/mexicat/pdoom-video/blob/main/docs/ENGINE.md and https://github.com/mexicat/pdoom-video/blob/main/docs/TREATMENT.md

**Evidence inspected:** public README, ENGINE guide, Reddit author report; current KFB PR #354 START_HERE, WORK_ONE_SHOT_BRIEF, RETURN, Audio handoff schema, H13 HANDOVER_WSA / DOKU_H5-H13 and KFB Island donor audit. Source code was not cloned or run; exact original video was not playback-reviewed; Depth Anything V2/4-layer parallax comes from author's Reddit description and is **not independently validated from source code** here. No visual/source isolation or browser proof.

## Observed reference architecture (source-supported)

- TypeScript + three.js + Vite/Bun project; 17 plate/scene modules with a timeline anchored to lyric lines and beat grid.
- Deterministic time input: each scene renders from absolute song time `t`; offline sampling can request subframes out of order, so render calls must not carry incremental visual state.
- Analysis outputs include word-level vocal timing and beat/downbeat, band envelopes/onsets; typography is laid out and timed in code.
- Offline export: headless Chromium/Playwright, sample averaging, ffmpeg; 1080p60 and true 4K60 modes. Current README/ENGINE allows adaptive **up to 324** subframes per frame, not only the older Reddit description's 108.
- This is a **code-driven scene/timeline engine**, not proof that a single prompt generated the finished video. Preview and export share the same scene code, but post-encoding/compression and shutter sampling are not literally pixel-identical to a single preview frame.
- Rights: MIT covers code, not song, lyrics or every independently sourced visual/font asset.

## Practical KFB transfer (PROPOSAL, not implementation)

1. **Authoring/export recipe donor**: borrow the deterministic scene-time interface and contact-sheet / short-range / clip render tooling as concepts; do not import the foreign runtime wholesale. Each approved quote/deck/biome seed drives a deterministic, attributed storyboard/timeline.
2. **Audio semantics**: map beat, bar, RMS, bands and transients through existing `kfb.audio-visualizer-handoff.v1` read-only contract; the accepted KFB Audio host remains the sole clock/mixer/ducking owner. Never introduce a second AudioContext.
3. **Editorial difference**: KFB's quote loop explicitly uses **clause/phrase read-along, attribution, exactly one contextual FrizzleQuestion, optional Brain Food** rather than importing the donor's word-by-word pop karaoke as default. Keep canonical Quote Pool IDs, rights, provenance and editorial mapping.
4. **Reuse real H13**: H13 already owns authored camera, typography, palette, image mixing, music response and immersive Canvas lineage. It is a frozen source reference; the rejected H13 collage-engine v0 remains rejected. New technology is an optional offline export/scene adapter, not another H13 owner.
5. **World distribution tiers**: pre-rendered, source-cleared, deterministic videos/webm clips for far/mid-distance billboards; near interactions may use the existing H13/CanvasTexture/media owner. Full-screen should continue at the host's **same media/timeline timestamp**, with no replay or restarted audio. In-world audio is optional/diegetic and routes through the existing Audio host.
6. **Camera/parallax**: author's Depth Anything V2 + four depth layers + inpainted disocclusions is an optional 2.5D look donor for selected authored stills; test source in isolation first. Limit lateral translation, validate occlusions, and do not treat an inferred depth map as true geometric reconstruction.
7. **Visual provenance**: KFB cards, public-domain material and source-verified plates only; the Reddit stills and provided song are **not** promoted as licensed KFB assets. Maintain the existing KFB billboard clay/anatomy and shared material/source identity.

## Cost and acceptance guard

- 108/324 subframes and 4K60 export belong to **offline generation only**, never to live gameplay/CanvasTexture tick. Draft low-res/low-sample first; then export target-sized video according to the real existing billboard 2:1 face aspect, LOD, memory/codec/mobile GPU budgets.
- Avoid a new shared RAF, renderer, timeline scheduler, stage, quote selector, asset registry or mixer.
- Before **any** adoption: isolate the original time-driven scene rendering, the real H13 output, the existing billboard face, and existing audio contract separately; show source objects visibly and compare against targeted KFB test material. Loaded URLs/source alone are insufficient proof.
- Required later test (not run): same quote/time/seed renders reproducibly; scrub and fullscreen transition preserve timestamp; real quotation + provenance + FrizzleQuestion appear on actual clay billboard; muted/reduced-motion modes; media reuse/texture updates under multiple billboards; mobile fps, decoding and memory; export copyright manifests.

## Decision and current status

**KEEP AS CONDITIONAL TECHNICAL DONOR (research only).** Strong fit for deterministic authored sequences and reproducible offline export. Do not replace H13, PR #354 Curator, Audio owner or live Billboard renderer. No implementation authorization, tests, public Stage, new site, PR, merge or Live promotion created by this audit.

The owning PR #354 Return's single active next step remains **Quote Research Reserve 14**; the donor is a deferred input for the already queued Work One-Shot / source-isolation gate after its existing approvals.
