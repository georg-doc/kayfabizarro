> **CURRENT ADDITIVE R2 DIRECTION · 2026-10-15 · INTERACTIVE FIRST**  
> Georg added a reusable interactive animation construction kit for deck shuffle, flip, fan, slide, PDF panel reveals, billboards, other KFB display surfaces, game cutscenes and optional social/video. The **canonical current planning specification is [INTERACTIVE_MOTION_RECIPES_R2.md](./INTERACTIVE_MOTION_RECIPES_R2.md)**, which supersedes the **video-first** priority and old video acceptance gate below, without deleting this R1 research. Existing WS0 v5 is the first implementation receiver; KFB original CardStack v1, Living Illustration and Billboard/H13 are mandatory source donors. **MP4 is an optional downstream export**, not the first product gate.  
> Current one gate: `CLAUDE_CODE_WS0_REAL_SOURCE_INTERACTIVE_CARD_MOTION_PILOT_R2`.

---

# KFB · Claude Code + Remotion · Motion-Comic / Card-Deck / Music-Rollout R1

**Status:** RESEARCH + AUTHORING BRIEF ONLY · UNAPPROVED TECH ADOPTION · NO VIDEO RENDER / RUNTIME WRITE  
**Date:** 2026-10-15  
**Repo / research branch:** `georg-doc/kayfabizarro` / `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15`  
**One receiving product owner for R1 source/proof:** existing **WS0 KFB Comic Card Deck Viewer v5 candidate** / canonical Deck Corpus. Marketing, Game/Cutscene and MUSIC-PERF-01 are downstream consumers, **not new runtime owners**.  
**Bounded outcome:** source-true, reproducible **2D one-page/four-card storyboard-and-export research brief**, with 16:9/9:16 distribution variants. The actual implementation requires a subsequent scoped executor intake. No public Stage is required by this research.

## Recovery / what already existed

1. Follow `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`; retrieve the latest owner Return before implementing.
2. Existing `KFB Comic Card Deck Viewer v4 (WS0)/HOUSEKEEPING.md`, `RETURN.md` and `deckviewer/kfb-corpus.js`: v4 preserved, **v5 is a candidate**; `media/kfb/index.json` and verified card IDs/pages are canonical. Registry truth and fail-closed crops win over approximate PDF quadrants. The viewer is not an animation engine.
3. Existing MUSIC-PERF-01 `tools/KFB-ToolBox/stage-first/music-performance-01/export-prep/START_HERE.md` and `RETURN.md` on branch `planning/kfb-motion-to-video-prep-r1-2026-10-12`, Draft PR #391: 8 s / 240 frames / 30 fps of the **existing original ORB 3D performance**, 37/37 source/frame-plan tests passed on CI. **0 actual video frames, 0 video exports, 0 AV mux proof.** This is a different, protected 3D-performance gate, not proof of Remotion/card motion.
4. Existing KFB ChatterBox owns speech/dialog/bubble semantics; Audio owns mix, voice ducking and music transport; Music/Triplets own approved scripts/tracks. The earlier Theatre Curtain Core owns its real cloth transitions. Any offline video exporter consumes evidence from these owners, not a replacement dialog, audio or 3D scene scheduler.
5. User's collection framing: often approx. 15 landscape PDF pages and approx. 56 cards (usually four/page, 2x2) for KFB/KFV/Roxin-like decks. **These numbers are a planning example, never assume an individual deck has this exact verified layout.** Source artwork and crop/panel geometry need actual inspectable evidence.

## Capability matrix — claims vs test needs

| Surface | Remotion/Claude proposal | Verification required |
| --- | --- | --- |
| 2D page/panel reveal | Sequences, per-frame interpolation/spring, pan/zoom, transitions, deliberate reading holds | Source-exact first/last/composite stills + intermediate-frame contact sheet, typography legibility |
| Card animation | 2x2 progressive reveal, one-card emphasis, 2.5D tilt, camera over exact card art | Original card shown independently first; verified page/card crop and stable source reference |
| Bubble & narration | Subtitle and speech-bubble visual layers time-addressed from **approved** dialog/voice | Do not invent text; avoid double-baking existing PDF speech; bubble overlap & silence timing tests |
| Song-track music video | Approved track drives beat-map + edit decision list, lyrics/captions optional | Audio source/timing rights, 1-song owner, synch checkpoints, export AV playback |
| Game cutscene | Exported video or data-driven timeline as downstream **consumer** | Real host owns pause, player, camera, skip, progression, save and transitions; do not convert World R4 STOP to new runtime authorization |
| 3D presenter | Optional external original GLB via `@remotion/three` / R3F, or render from already-owned 3D host | Separate source isolation, rig/viseme/actions/render compatibility, performance; **not** a first-gate dependency |
| Distribution | Same source+edit decision list → 16:9 hero/track clip, 9:16 mobile reframed short, still teaser | Real re-layout/legibility and safe text margins, not blind center crop |

Remotion docs verified on 2026-10-15:
- Compositions/Sequences: https://www.remotion.dev/docs/composition
- Still/video render and image sequence: https://www.remotion.dev/docs/render
- Captions: https://www.remotion.dev/docs/captions/
- ThreeCanvas with declarative `useCurrentFrame` (do **not** rely on free-running `useFrame`): https://www.remotion.dev/docs/three-canvas
- Browser renderer `@remotion/web-renderer`, WebCodecs/Mediabunny, documented limits: https://www.remotion.dev/docs/client-side-rendering
- Official licensing: https://www.remotion.dev/docs/license/faq — **source-available, not OSI open source**; individuals and organizations up to three people are generally eligible for the Free License, wider commercial/automator use requires checking applicable terms. No adoption or license determination made for KFB here.

**Distinguish tools:** Claude Code is the authoring/execution assistant. Remotion is an editable React/video-composition candidate, **not** an automatic Claude built-in named "Claude Motion". Benchmark against existing Three.js capture + Mediabunny where appropriate before installing. For 2D export, Node/CLI render may be simpler and more reliable than a complex in-browser encoder; no requirement to publish a new video SaaS/editor.

## One bounded practical pilot — source-first, not production yet

**Candidate:** 12–20 s motion-comic excerpt of **one verified four-card PDF page** from an existing indexed KFB deck. Use one authentic original page + four source-mapped cards, approved text (no invented balloon lines), optional existing audio excerpt if licensed and source-pinned. It should feel like an edited comic beat, not a generic pan across four equally timed cards.

Proposed shot grammar (time ranges illustrative, MUST be revised after seeing actual chosen page and dramaturgy):
1. 0–2s: show source **page in isolation** as a real panel/contact-sheet proof.
2. 2–5s: single source-mapped card gets attention; leave legible hold rather than continuous motion.
3. 5–9s: reaction/reframe to the next source card, timed to actual wording/beat; optional bubble overlay if the original artwork lacks or permits it.
4. 9–14s: meaningful contrast/reveal using two adjacent verified cards, not random flying elements.
5. 14–20s: short payoff/track accent and approved KFB call-to-action, if relevant; avoid invented product brands/logos.

**Deliverables for a later implementation gate:**
- Proven source: original PDF/page/contact sheet, first 2x2 layout and four isolated source cards, source identity/hash and human visual check. If cards already contain baked-in bubbles, isolate text layers or use non-overprinting captions; no cloned/guessed lettering.
- JSON edit-decision list (`deckId`, `cardRef`, `sourcePage`, `cropTruth`, `shotId`, `fromFrame`, `durationFrames`, `camera`, `approvedTextRef`, `audioRef`, `aspectVariant`), explicit `UNVERIFIED` for uncertain mappings.
- Frame-accurate offline composition, captured PNG contact sheet at intro/reveal/read/transition/payoff, short 16:9 MP4 with verified audio if used, 9:16 independently composed variant.
- Tests: mapping/card-ID validation, source object identity, no invented panels/text/brand; frame bounds, text safe areas, deterministic fixed-frame pixel checks, AV lip/beat sync, actual file playability and browser codec/support boundaries, cost/license review. Count separately: authored tests, actually executed tests, browser video frames, AV mux, human review.
- The authoring workflow should be possible through concise natural-language edits: "hold card 2 eight frames longer", "move bubble over this original card", "cut on music beat" — but changes must become explicit stored frame/EDL data, not ephemeral prompt magic.

## Downstream rollout matrix — proposals only

- **Comic / digital flipbook:** one 2x2 page becomes a self-contained 20–40 s mini-sequence; optional voiced character replies.
- **56-card deck track:** multi-page narrative music video/lyric-visualization using the approved track and canonical card order; more ambitious, gated after pilot.
- **Game:** short deck discovery, card pickup, Resident story beat or quest/cutscene as exported video; the game remains authoritative for progression and skip.
- **Social:** a 9:16, 10–30 s coherent excerpt, original title/CTA, captions and music clearance; not a mindless automatic crop.
- **3D music/dance video:** later adapter for original rigged Resident/ORB performer; inherit MUSIC-PERF-01 capture gate, do not rebuild band stage or animate generic proxy avatars.

## Blockers / non-claims

- No Remotion package installed or executed; no page rendered through Remotion; no CLIP acceptance.
- The original 15-page/56-card example is user-supplied context; exact PDF/count/layout vary. Card crop must be verified in v5 corpus/Registry; candidate v5 is not promoted or merged by this brief.
- 3D GLB rigging, animated visemes/voice sync and actual MUX/export have **not** been demonstrated here; music clearance and Remotion license must be checked before real output.
- No marketing scheduler, no social posting, no Cloudflare/GPT Site publication, no new engine, AudioContext, story author, music timeline, brand, Stage, or World R4 activation.

## Exactly one next gate

**CLAUDE_CODE_WS0_SOURCE_ISOLATED_FOUR_CARD_MOTION_PILOT_R1** — inside the existing WS0/Deck Viewer source owner, select a real mapped 2x2 page and prove the **actual source page and all four source cards in isolation** before any motion. Then author one reproducible 12–20 s 2D pilot on a reviewable implementation branch, with real export + stills/tests and one 9:16 variant. Remotion is a candidate to benchmark, not an already-selected new product dependency. No human approval gate until there is a meaningful viewable result.
