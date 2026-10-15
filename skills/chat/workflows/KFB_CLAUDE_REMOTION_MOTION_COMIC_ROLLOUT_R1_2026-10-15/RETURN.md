# CURRENT RETURN ADDENDUM R2 · interactive card-motion recipes

**Date:** 2026-10-15  
**Mode/Status:** research/architecture preparation only; no new runtime, UI build, video, Site or Stage.  
**Repo / branch / PR:** `georg-doc/kayfabizarro` · `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15` · **Draft PR #402** OPEN/UNMERGED. Verify latest head from PR branch before executing; never infer a mutable SHA from this Return.  
**One first implementation owner:** existing **WS0 Comic Card Deck Viewer v5 candidate**, v4 frozen. The canonical PDF/Deck Registry stays with `media/kfb/index.json`; no alternate Registry or state owner.  
**Current scope:** source-true, interactive **card animation recipes** with viewer-first pilot, not MP4-first. Motion/GSAP/Remotion remain non-adopted optional tooling; video is a downstream export.

## What changed after R1

- Georg extended the R1 media idea into **template-based live animation** of deck shuffle, deal, card reveal/flip, fan, swipe, reader/panel reveal, game pickup card focus, Hypernormalisation Billboard sequences and optional music/video outputs. Viewer/game/other presentation consumers should use timed real source objects and controls without pre-rendered video.
- Additive current spec: `INTERACTIVE_MOTION_RECIPES_R2.md`. It reuses source-reviewed **CardStack v1** `createReveal().pose(p)`, existing WS0 Living Illustration presets, v5 card refs, H13/H4/H5 Billboard and world billboard's provider/scheduler seam. Donor source identity found, **no fresh visual isolation or runtime integration** this R2.
- R1 research and Claude Code intake now have top-of-file redirects to R2. The previous 12–20s 16:9/9:16 MP4 pilot is **deferred** rather than lost; no parallel acceptance gate is active.
- No game-card order/progression side effects from `shuffle.visual` animation. Host supplies outcome, clock, camera/rendering context; preserve current ChatterBox/Audio, game, billboard and theatre-curtain owners. KFB 3D Rig Motion Library is separate, not renamed.

## Changed R2 files on PR #402

- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/INTERACTIVE_MOTION_RECIPES_R2.md` (added)
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RESEARCH_AND_PIPELINE_R1.md` (R2 override)
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/CLAUDE_CODE_WS0_BRIEF.md` (R2 override)
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/CHANGELOG.md` (additive R2 entry)
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RETURN.md` (this additive top entry)

## Executed verification and open work

- **16/16 static documentation contract assertions PASS**: source/owner, CardStack normalized seek, Living Illustration, Billboard's scheduler, visual-only shuffle, host clock, mapping fallback, reduced-motion/keyboard, progress isolation, optional MP4, one R2 gate and R1 redirect.
- All R2 GitHub writes followed by branch-head + exact-file readback. Final PR/head to be checked after metadata handoff.
- **0** CardStack rendered isolation passes, **0** real original viewer-card crops isolated this R2, **0** new animation runtime/browser/performance tests, **0** video renders, **0** AV mux, **0** human acceptance tests.
- Source `kfb-card-stack.js` states standalone extracted module NOT_TESTED. Motion and GSAP dependency size/licensing, Shadow DOM suitability, seek performance and app/mobile browser behavior remain open.
- Billboard H13 and game adapters are **later** and must not be shoehorned into first WS0 viewer gate. No KFB Hub/main router, public Stage, GPT Site or Live change warranted by this planning-only addendum.

## One CURRENT next gate

`CLAUDE_CODE_WS0_REAL_SOURCE_INTERACTIVE_CARD_MOTION_PILOT_R2` — Claude Code on the existing WS0 v5 receiving owner: isolate a real verified four-card PDF page and its true cards + original CardStack/Living donor visually, then make three controlled in-viewer animations: visual-only deck shuffle, source-true card flip, and card swipe/panel reveal. Test play/seek/reverse, keyboard/pointer, disposal, reduced-motion, fail-closed mapping. Real screen/frame evidence required. **No MP4 necessary for this gate.**

---

# RETURN · KFB Claude/Remotion Motion-Comic / Card-Deck / Music Rollout R1

**Date:** 2026-10-15  
**Status:** RESEARCH + BRIEF CHECKED IN / NOT IMPLEMENTED  
**Mode:** BOUNDED PLANNING SLICE  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15`  
**PR:** Draft PR opened after this Return write; see GitHub branch/PR for authoritative number and final head (never infer head from this text).  
**Receiving source owner:** existing KFB Comic Card Deck Viewer v5 candidate / WS0, original v4 and canonical `media/kfb/index.json`. **Marketing, Game Cutscenes and MUSIC-PERF-01 are receiving consumers, not new runtime owners**.

## Actual outcome

Recovered preexisting October 12 KFB Motion-to-Video research from Draft PR #391 and separated its current **8s 3D performance frame-plan contract** from the proposed **2D comic/card motion** outcome. Existing source and owners identified: WS0 v4/v5 PDF/Card Corpus, authentic KFB source PDFs, ChatterBox, Audio, Music Performance, prior Theatre Curtain; no imported or replacement assets.

Documented how code-driven frame-addressable Claude Code/Remotion animation could support original comic pages, 2x2 card reveals, actual bubble/caption timing, 2.5D, song-track edits, game cutscene consumers, and marketing 16:9 / 9:16 exports. This is an **options/authoring brief**, not an implementation, video or vendor selection. Original images/crops must be shown independently before editing.

## Changed files

- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RESEARCH_AND_PIPELINE_R1.md`
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/CLAUDE_CODE_WS0_BRIEF.md`
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/CHANGELOG.md`
- `skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/RETURN.md` (this file)

No code/runtime/Registry/media files changed. No modifications to MUSIC-PERF PR #391/#207 or WS0 candidate.

## Actual executed evidence

- 10/10 independent static documentation/contract assertions **PASS** (source isolation; Registry and owners; prior 3D export state; first 2D gate; no Remotion adoption; bubbles/audio protection; mapping failures; horizontal+vertical formats; no second owner; one next gate).
- Each individual GitHub file write was followed by exact intended-file and branch-head readback; final Return/head and PR verified after writing.
- App/runtime tests **0**, real PDF crop isolation **0**, visible screenshots **0**, decoded real video frames **0**, encoded videos **0**, audio mux **0**, browser checks **0**, human tests **0**.
- External official documentation consulted for Remotion rendering, compositions, captions, ThreeCanvas and `@remotion/web-renderer` plus licensing. No package installed or source code executed.

## Deferred / unresolved

- Select one real verified four-card PDF page/card refs from current Deck Corpus; the approx. 15 pages / 56 cards is not presumed for each deck.
- Confirm exact visual source page, independent four-card crops and text/bubble bakedness; human view of isolated originals is outstanding.
- Remotion vs existing-frame-capture/Mediabunny benchmark not executed; browser/video codec, AV sync, input asset and usage-license constraints not validated.
- Marketing output strategy is a downstream intake, **not** permission for automatic posting. 3D dance/Resident export remains separate MUSIC-PERF work.
- No GPT Site/Stage created or modified, no Cloudflare route, no KFB Hub reroute or production router change warranted by this research-only checkpoint. No merge / Live promotion.

## Exactly one next gate

`CLAUDE_CODE_WS0_SOURCE_ISOLATED_FOUR_CARD_MOTION_PILOT_R1` — on a future explicit receiving implementation slice, Claude Code/WS0 selects actual mapped original 2x2 page and displays page + four cards individually, then implements one 12–20s motion-comic proof and 9:16 variant with reproducible timeline and real render QA. Marketing can then use approved results; no separate generative design or runtime owner.
