# KFB Interactive Card / Comic / Billboard Motion Recipes · R2 additive direction

**Date:** 2026-10-15  
**Status:** GEORG IDEATION DIRECTION / ARCHITECTURE PROPOSAL · NO RUNTIME ADOPTION OR BUILD  
**Parent:** KFB Claude/Remotion Motion-Comic Rollout R1, same research branch and Draft PR #402.  
**One R2 implementation intake owner:** existing WS0 KFB Comic Card Deck Viewer v5 candidate (preserve v4 donor); **downstream consumers:** original KFB CardStack/Card Zone in game, Billboard/Hypernormalisation, Living Illustration, Theatre Curtain owner, social/video export.  
**User shift:** The reusable **interactive animation library is the primary product**, an MP4 or Remotion render merely an optional output. Do not force videos into viewer/game UIs.

## Recovered, authentic donor sources (NOT a new library invented from scratch)

1. **WS0 v4/v5 canonical Deck Corpus:** `KFB Comic Card Deck Viewer v4 (WS0)/HOUSEKEEPING.md`, `RETURN.md`, `deckviewer/kfb-corpus.js`, `media/kfb/index.json`. v5 supports source-backed `kfb.card-ref/1`, page/card deep links and fail-closed crop mapping. Reader, Gallery, Stack, Coverflow, Full View and Deck are **existing** viewer states. v4 frozen, v5 candidate; no Registry mutator.
2. **KFB CardStack v1** source `tools/KFB-ToolBox/_inbox/kfb-toolbox-v1.1/tools/KFB-ToolBox/kfb-cardstack-v1/kfb-card-stack.js` blob `2a6c9389c9ef011b5f81c300143055fe2ffa8341`: original Three.js deck stack and hinged paper-bend reveal/sky-card; core `createReveal().pose(p)`, normalized `p=0..1` supports arbitrary position/seek. **Extracted module self-test NOT_TESTED** per source header; donor visuals NOT re-shown this R2.
3. **WS0 Living Illustration** `KFB Comic Card Deck Viewer v4 (WS0)/docs/LIVING_ILLUSTRATION_EVAL.md`: 2D Canvas Atmosphere/Depth/Shimmer/Boil/Ken Burns, attach/destroy seam; one shared rAF, pause offscreen, reduced-motion Still; no WebGL necessary for first viewer adapter. Reuse; do not replace it.
4. **Billboard H13/H4/H5** `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/docs/SPRINT_billboard-hypernorm.md` and H6 HANDOVER: H4 Georg PASS, 2:1 Canvas 1024×512, source-managed film/card/quote layers; existing Billboard Media Residency owns selection and content. The downstream `WORLD_BILLBOARD_CLAY01 .../HANDOVER.md` has `BillboardScheduler.tick(nowMs,camera)` using **existing world frame owner** and proposed `provider.paint(ctx2d,W,H,now,bb)` output-to-texture seam. NEVER add billboard autonomous timer, duplicate WebGL renderer or video player.
5. **Theatre Curtain Core:** physical curtain remains its own owner and provides entry/exit transition when already accepted; do not substitute CSS deck transition for curtain physics.
6. **KFB Motion Library** for 3D character rigs is **not** this UI/card animation recipe collection. Do not rename or overwrite existing rig-motion catalog or introduce another global motion runtime.

Donor proof order for any actual integration: show original v5 card/page crop, original CardStack flip/pose **in isolation**, original Living Illustration treatment, original H4/H5 billboard output separately, record real source identity/pinned versions, THEN decide one KEEP/ADAPT adapter. A reachable URL or successful asset load is not visual proof.

## Proposed reusable semantic primitives (not yet implemented)

| Preset key (proposal) | Animation / behavior | First consumer | Source/protected behavior |
| --- | --- | --- | --- |
| `deck.shuffle.visual` | stack riffle/overhand/cut choreography, optionally physical irregularity | Viewer Deck/Stack | **game/card-state owner decides order and seed**; animated representation NEVER computes gameplay shuffle/result |
| `deck.deal` | distribute exact selected cards to named slots | Deck/Card Game | fixed destination IDs; gameplay turn/ownership stays host |
| `card.flip.reveal` | face-down to exact source face, hinge/bend for 3D variant | Viewer first; CardStack later | back/face/source ID must exist; no mirror artifacts/fake second card |
| `card.fan.spread` | deck spreads from stack to fan or 2x2 with focus/selection | Deck Viewer | keyboard and pointer focus, true source cards, no guessed crop |
| `card.carousel.slide` | navigate cards with deliberate reading hold and reaction pacing | Viewer Reader/Coverflow | existing nav/scroll/deep-link state authoritative |
| `page.panel.reveal` | one PDF page / real panels revealed in story order | Comic viewer | 2x2 mapping verified; if uncertain show original full page, fail closed |
| `card.inspect.hero` | zoom/focus/flip/return to game or catalog | Card pickup/Game UI | host decides item ownership and confirmation; consumes source CardRef |
| `card.living.idle` | optional approved Boil/Ink-Motes and restrained shimmer | Living Illustration | preserve original printed-card legibility and accessible still |
| `surface.billboard.sequence` | original source card / quote / cover / film cut to 2:1 face | Billboard consumer | Billboard Scheduler & quote/provenance owner remain authoritative |
| `scene.transition.card` | reveal/withdraw card as **consumer** of a transition | Comic/Game | Theatre Curtain Core remains actual cloth owner |
| `speech.bubble.cue` | bubble/caption timed to existing dialog event | ChatterBox consumer | no new dialogue, no duplicated bubble/voice engine |

KFB-native timing presets should avoid repetitive generic bounce/slide effects; per-shot holds, visual read time and surprise/action timing are editorially controlled. Layout adapts to `viewer`, `portrait-social`, `game-overlay`, `billboard-2to1`, rather than blind 16:9 cropping.

## Contract: ONE semantic timeline, host-owned clock and surface-specific adapters

**Recipe (portable DATA, not new runtime):**
- `recipeId`, `version`, `intent`, `targetRefs` (`kfb.card-ref/1` or verified source page ID), `sourceProof`, `layout`, `durationMs` or integer frame budget, `segments` with relative offsets/holds/easing, `eventCues` (non-authoritative presentation only), `reducedMotionState`.
- Stateless evaluation `sample(recipe, t)` / `pose(p)`: stable result for any time including reverse, pause, seek and screenshot capture; `t` comes from the **host** (viewer interaction, game update, billboard scheduler, or offline export). No independently advancing requestAnimationFrame per card; no new global scheduler.
- Adapter boundary:
  * **Viewer:** DOM/Canvas 2D/possibly Web Animations API from existing PDF crop. Respect existing Shadow DOM, no-build and `getCardCanvas()` source path. Integrate in v5 candidate only, not frozen v4.
  * **Game 3D:** reuse original CardStack `pose(p)` / cardbuilder Three.js mesh, called by game host clock. Renderer/camera/input/progression/AudioContext remain host-owned.
  * **Billboard:** render a source-verified paint provider to the already-owned 1024×512 CanvasTexture; H13 compositor chooses content, billboard existing scheduler throttles display, world owns clock. Avoid full PDF parsing or DOM/React in each distant 3D sign.
  * **Video export (optional):** convert approved recipe's same timeline/assets to Remotion Composition/Player or offline image sequence, with independent output QA. MP4 is a consumer, not a requirement for interactive playback.
- `events` should be committed once by the host transaction at appropriate boundaries (e.g. card acquired) and **not** re-fired by seeking/reverse. The visual sequence must never change shuffled card order, item state, quest completion, card inventory or quote text.
- Stable deterministic optional seed controls decorative layout scatter only; actual card randomness/deck order supplied by game/Deck owner.
- Full lifecycle: `mount`, `sample/seek`, `pause/resume` via host, `cancel`, `dispose`; do not leave offscreen rAF, listeners, textures or orphaned AudioContexts. Loading failures fall back to original still/page without swapping in fabricated assets.
- Reduced motion, keyboard/gesture, text accessibility, readable holds, blocked autoplay, mobile GPU and offscreen LOD must be first-class.

**Technology selection (not binding):**
- **No-framework viewer path first**: existing Canvas/CSS plus WAAPI or Motion `animate()` in its small/native form. Motion's hybrid sequence controls support seeking time, but bundled cost and Shadow DOM behaviors must be benchmarked. Motion's direct Three.js helper integration is documented as Motion+ early access — not a free or proven KFB default.
- **GSAP** is an alternate declarative timeline/seeking tool for DOM and Three.js projects; check licence/version, bundle and lifecycle before adopting.
- **Remotion** is ideal for React `Player` and authored offline video frames; no need to introduce React/Remotion into the vanilla no-build PDF Viewer solely to flip a card.
- **Existing KFB 3D rigs/media** are not replaced by CSS or 2D sprites; reference original CardStack/billboard source before any adapter.

Official references checked 2026-10-15:
- https://motion.dev/docs/animate (hybrid sequences, seekable `animation.time`, Three.js via Motion+)
- https://gsap.com/docs/v3/GSAP/Timeline/ (seek/pause/reverse, labelled timeline)
- https://www.remotion.dev/docs/player (React interactive presentation, not video-only)
- https://threejs.org/docs/pages/CSS3DRenderer.html (HTML/DOM 3D bridging limitations)
- Existing Remotion docs in `RESEARCH_AND_PIPELINE_R1.md` (export + licensing)

## Revised single R2 next gate — interactive first, MP4 later

**`CLAUDE_CODE_WS0_REAL_SOURCE_INTERACTIVE_CARD_MOTION_PILOT_R2`**

On the current WS0 v5 receiving owner, source-isolate one truly verified PDF page and 4 exact individual card crops (and original CardStack/Living donor in separate preview). Implement **ONE bounded interactive Deck Viewer surface** that demonstrates three proposed motions reusing existing modules where feasible:
1. `deck.shuffle.visual` (mock choreography fed a fixed, host-provided ordered set; **does not mutate order**);
2. `card.flip.reveal` (real source card back/front; no fabricated art);
3. `card.carousel.slide` or `page.panel.reveal` (real user navigation and readable hold).

Test real pointer/keyboard/focus, pause/seek/reverse, deterministic time snapshots, cancel/dispose, reduced motion, source identity, 2x2 mapping failure fallback, mobile text legibility; **NO MP4 necessary for PASS**. Existing v4 frozen, v5 candidate active. Produce source-isolated screenshots of original objects and real in-viewer frames, test totals and truthful Return. Only then publish/update an existing Site if owner and site route actually require it. The earlier 12–20s 16:9/9:16 video pilot is **DEFERRED downstream**, not discarded.

Billboard/game integration is a later consumer gate after the one viewer seam works, **not** part of R2 acceptance. No new stage, no new animation editor/Site, no automated marketing, no auto-merge, no Live.
