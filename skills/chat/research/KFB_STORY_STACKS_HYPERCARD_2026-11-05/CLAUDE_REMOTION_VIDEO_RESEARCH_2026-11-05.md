# Claude + Remotion + KFB Story Stacks — controlled short-video research

**Date:** 2026-11-05  
**Status:** RESEARCH / PROPOSAL ONLY. No tool/runtime adoption or video rendering authorized by this research.  
**Owner:** existing KFB Story / Fractal Almanac concept lane (WS0 consultation); potential video export only as downstream authoring output, not a second game/state/audio owner. DocCheck remains separate.  
**Related:** [RESEARCH.md](RESEARCH.md), [DOCHECK.md](DOCHECK.md), [WS0_MESSAGE.md](WS0_MESSAGE.md), PR #470, issue #471.

## Product question

Can vetted KFB Card/Deck source + HyperCard-style story-link/encounter semantics be *edited* by Claude Code and rendered by Remotion into distinctive, editable short social clips—without generic, hallucinated AI imagery, fabricated lore, slideshow sameness or a second runtime? Can a separate medical editorial implementation use the same **production grammar**, without KFB branding/state or unreviewed clinical claims?

**Short answer:** credible **candidate**. Remotion is capable of frame-accurate React-based, data-driven video, but its generative examples do not solve art direction or factual source fidelity. A brand-locked clip engine must be **asset-first / shot-first**, with Claude in the planning/supervised editing role and human creative acceptance. A running source-object-isolated proof remains pending.

## External repo / skill matrix (sources inspected 2026-11-05)

| Candidate | Evidence / use | KFB decision |
|---|---|---|
| **Official Remotion Agent Skills**: https://github.com/remotion-dev/skills and https://www.remotion.dev/docs/ai/skills | Vendor-maintained skills for Claude Code/Codex: create, markup, render, studio, captions, multimedia, interactivity, docs and license. Install options include `npx skills add remotion-dev/skills`. | **FIRST CHOICE baseline** for correct React composition/render code; not a KFB artistic preset. |
| **Official Claude plugin**: https://www.remotion.dev/docs/ai/claude-code-plugin and https://github.com/remotion-dev/claude-code-plugin | Vendor-supported Claude plugin that embeds skills. | **PREFERRED CLAUDE ENTRY** if toolchain exists; avoid duplicate packs installed twice. |
| **Video Shotcraft**: https://github.com/Vincentwei1021/video-shotcraft | Current README reports **124 recipe cards/150 shots** (10 groups), demos, editable Motion Workbench, beat sync and optional JianYing/CapCut-CN export; Apache-2.0 code/docs. Gallery/site may show outdated counts; README is preferred. Contains stock/template/audio elements with separate rights/provenance. | **BEST SHOT-RECIPE / EDITING DONOR** for _techniques_, e.g. stack fan, card reveal, 2.5D perspective and tempo. **Do not import its fixed branded presentation or music**. Inspect one real recipe **and rendered preview isolated** before adaptation. |
| **Claude Video Skills**: https://github.com/imtamiliniyan/claude-video-skills ; setup https://github.com/imtamiliniyan/claude-video-skills/blob/main/SETUP.md | Router `/make-video`: short talking-head, long-form, voiceover-only reel, script; subtitles, transcript-aligned graphics, music and SFX; configurable brand tokens. **Honest limitation**: finishing, not automatic filler/multi-take rough-cut. Supports cloud transcription; WhisperX optional local. README calls MIT license; audit repo actual license/media before reuse. | **WORKFLOW DONOR** for series discipline, transcript/beat-to-shot planning and asset manifests. Avoid default 'paper reel' brand and automatic Wikipedia logos/stock b-roll. |
| **Official Prompt-to-Video template**: https://github.com/remotion-dev/template-prompt-to-video and https://www.remotion.dev/templates/prompt-to-video | CLI creates story text, generated stills, voiceover, timed `timeline.json`; baseline Remotion composition is 1080×1920. Source package is marked `UNLICENSED` while upstream Remotion has its own license. | **TIMELINE-SCHEMA CONCEPT DONOR ONLY**. **REJECT** generic text-to-images-to-voice workflow for real KFB cards, source truth and clinical accuracy. Check code and terms before any reuse. |
| **Remotion Player / Input Props / Render**: https://www.remotion.dev/docs/player/player , https://www.remotion.dev/docs/passing-props , https://www.remotion.dev/docs/render | Parameterized JSON props can drive the same React composition in preview and MP4 render (CLI/SSR/Actions). | **STRONG TECHNICAL FIT** for card/deck and approved shot data. Export may be read-only derivative of authoritative KFB Story Stack; doesn't write back World State. |
| **Remotion license / terms**: https://www.remotion.dev/docs/license/pricing and https://www.remotion.dev/docs/terms | **Remotion is source-available with proprietary license, not unrestricted OSI open source**. Free for qualifying individuals/small teams; organizations >=4 require Company License unless exempt. Current (2026-11) paid model distinguishes manual Creators seats and Automators render usage; figures/terms may change. | **LICENSING GATE** before any commercial batch engine / DocCheck deployment; determine operating entity/headcount, automation nature, actual render volumes and hosted product features. |

**No packages installed, no donor code downloaded or run, no KFB assets copied and no videos rendered during this research.** Repo READMEs are *source claims*, not independent visual-quality proof.

## Reddit / community review — observations, not independent benchmarks

- [Oct 24 2026, r/ClaudeAI: “How are people making ... motion graphic”](https://www.reddit.com/r/ClaudeAI/comments/1xdwfec/): creators discuss a gap between showcase examples and personal output. One describes typography/transitions, experience and supplied style references as central; **anecdotal**, no controlled quality scoring. Implication: references and iterative human direction necessary.
- [Oct 22 2026, r/ClaudeAI: “How ... motion graphic ... with Claude”](https://www.reddit.com/r/ClaudeAI/comments/1xctb84/): agent edits Remotion/React components, normal renderer produces MP4; MCP not required for basic creative coding. A quality loop is still needed.
- [Jan 25 2026, r/ClaudeCode: official Remotion agent skills tested](https://www.reddit.com/r/ClaudeCode/comments/1qm976d/): early anecdotal successful promo generation, few users commenting; no proof of brand fidelity.
- [Oct 14 2026, r/PromptEngineering: sample-based Remotion QA](https://www.reddit.com/r/PromptEngineering/comments/1x5z02v/): developer claims 6 self-run A/B tests after splitting QA into cheap measurements, selective visual critic and repair. Interesting **QA design donor**, but claims not independently verified. Do not reproduce its performance claims as product facts.
- [Oct 27 2026, r/ClaudeCode: GPU compositor alternative](https://www.reddit.com/r/ClaudeCode/comments/1xh1a8s/): alternative Kinetograph claims faster renders on developer hardware; self-reported, not a reason to switch runtime before our own real content/codec/quality benchmark.

**Synthesis:** Claude+Remotion has enough community use to justify a small technical proof; the recurrent difficulty is **art direction and iteration**, not just synthesis speed or render technology.

## KFB source / reuse alignment

1. `media/kfb/index.json` canonical `kfb-deck-registry/v2`, real `packId + cardNumber` identity; original art may require approved PDF extraction/crop through existing Card Registry (no generic replacement illustration).
2. `travel/travel-v16/terrain-v16/card-registry.js` already resolves card metadata and defers image load. Video export consumes pinned source snapshots; it must not become another card catalog.
3. `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`: Deck → world → Card → encounter → ChatterBox → Almanac → recombination. The same semantic link supports an interactive journey or a **linear editorial selection for a reel**, but a reel does not imply game state progress.
4. `skills/kfb-cartoon-animation/references/legacy-v2-full.md` is an EXISTING KFB motion style reference: **cause → anticipation → action → impact → follow-through → recovery**, primary/secondary/tertiary reads, no gratuitous shaking/particles/effects. Apply before importing shot tricks. Existing KFB Ink/Clay styling and original card silhouettes take precedence over third-party default aesthetics.
5. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/RETURN.md`: existing accepted KFB Audio/SFX pool and mix owner; offline film may export/cut approved source music/SFX within their licenses but should not add new in-game AudioContext owner.
6. Existing `overworld/docs/GLOSSAR_KFB.md`, ChatterBox `prepareResidentTurn` and Golden Journey handover control semantic naming; don't synthesize fictional Resident quotations or status changes.

## Proposed canonical *video export descriptor* (planning interface, NOT accepted schema)

An export reads pinned source and a **separate editorial cut list**:
- **Source layer**: `deckId/cardId`, exact image/crop sha/source version, optional approved Resident/scenelet frames, original lore or approved copy, audio source IDs and permitted usages.
- **Story-link layer**: graph path / semantic source refs / quote provenance / selected linear traversal; no gameplay mutation.
- **Editorial layer**: chosen theme/title, claim/hook tied to real source, fixed 3–6 shots with named intent, shot duration in frames, visual focus/camera orientation, one identified sound/action beat per shot, source-driven transitions.
- **Format layer**: output ratio, safe-text area, fps, captions/audio variant, localized copy if approved.
- **QA/receipt layer**: manifest hash, exact input refs, source-isolation evidence, thumbnail/contact sheet, timeline comparison, human creative review and eventual MP4 checksum.

This proposed interface must reuse project formats/IDs; do **not** implement a parallel `kfb-story-stack` state machine.

### Data flow

```text
KFB Card Registry + original Card artwork + current story links
    ↓ pin source IDs / media hashes / verify rights
Editorial selection in Claude (read-only of game facts)
    ↓ written shot brief + reference images + named intent per shot
KFB motion/ink/asset rules + approved Shotcraft recipe adaptation
    ↓ Remotion composition + serializable data input
Preview: selected frames/contact sheet + 1 short animatic
    ↓ deterministic MP4 render (9:16), captions, audio
automated media/rights QA → independent visual critic → Georg if meaningful creative gate
    ↓ saved export for social publishing (no auto-post)
```

### Prototypical 20–24 second KFB test reel (PROPOSAL)

**Fixture:** current Dystopia Card **The Doomsday Clock** and existing Orc Band/Demon Lord birthday encounter; reuse only pinned real artwork and real song/approved audio. 1080×1920 (vertical), 30 fps container (selective 12-fps held stop-motion poses where suited), source-based variations. 4 carefully different beats:
1. **0–4 s — the card in isolation**: actual card source, one legible primary read and semantic hook from verified lore. Zero invented overlays/stock.
2. **4–10 s — an argument unfolds**: crop/frame/ink-led revelation of card detail and source text, not generic zoom-on-poster. One motivated camera change.
3. **10–17 s — the story connection**: one accepted source actor/performance or sound motif *only if actually available and isolated*. Show card-to-encounter relation without inventing world assets/quotes.
4. **17–24 s — connective ending**: the card/almanac relation, source-backed title and final image hold; avoid automatic CTA, random lore, floating logo or repeated transition.

Create **2 editorial cuts from the same source** (not two merely recolored animations): one *satirical/reveal*, one *music/performance*. At least one cut should have a completely static held frame for contrast. These timings are candidate design, not tested.

## Anti-slop gate / visual acceptance

**Before authoring:**
- Real source identity and original card crop visibly isolated first; original artwork shown at readable scale with correct transparent asset boundaries; no invented card faces or generated filler.
- One concrete directorial claim per film. Hook must arise from real card lore or source-approved copy.
- Limit shot library selection to a few named **techniques**, not default branded templates. Distinct staging and tempo across shots; no decorative transitions merely because available.
- Design tokens from KFB existing ink/clay palette, actual card aspect and composition rules; no new default fonts, gradient/sheen/generic tech frames.
- Verify asset/voice/music copyright and no unapproved external generated art.

**During assembly:**
- Every movement must pass cause/read/impact/recovery; depth/perspective and camera shifts motivated; one primary focus at each key beat.
- Frame-accurate cut sheet, narration/music before caption timing; consistent safe zones.
- Never substitute black-background logo/stock montage when source art lacks suitable footage—leave the shot unmade and report missing source.
- Maintain separate **manual-cut / authoring** versus **batch rendering** licensing and review modes.

**After rendering:**
- Automated: source/crop hashes, resolution/fps/duration/codec, audio levels/clipping, blank/frozen intervals (intentional holds explicitly allowed), text overflow, caption legibility/safe margins, missing/mismatched media, scene order and manifest.
- Visual critic: inspect first/last/key + transition-adjacent frames and 2–3 second playback around selected seam; judge silhouette, original card fidelity, hierarchy, timing, real humor/story, no generic template look. Use human Georg PASS/TUNE/FAIL for the first artistic baseline, not an automatic AI score.
- Compare variants on **originality, visual identity, pacing and source fidelity**, not an arbitrary numerical "cinematic" score. Preserve the rejected cut as evidence if it fails.
- Stop at small failing seam after two non-improving repair passes; do not churn approved assets or redesign world.

## DocCheck independent branch

Same abstract "vetted source → approved narrative beat → deterministic timeline → review → short MP4" grammar, but content/brand/clinical review must be independent. Medical videos may derive from approved, versioned educational/CME stories, not generated patient claims or misleading outcome dramatizations. Branches can become several **specific educational cuts**, e.g. compare diagnostic decision and consequence with source citations and expert review. Medical uncertainty and proper context should survive compression to social format. Existing `DocCheck_Interactive_Microlearning_Living_Doc_v0.9.md` is a concept donor; not claimed to be the current production/deployment SSOT. CME credit has separate provider/accreditation workflow.

## Suggested bounded next gate (not authorized build)

**KFB-CARD-REEL-01 — source-backed art-direction + render POC**, receiving **existing KFB Card/Almanac/WS0 authoring** owner. One pinned actual card and one isolated source actor if applicable; two materially different 20–24s editing treatments; 9:16 first; signed asset manifest, exact shot/cut list, CLI render, representative contact sheet, exact playback/visible proof, blind critic and Georg creative decision. Separate DocCheck pilot is deferred.

**No Stage/Site/public route is required for this research.** A future POC's review surface must follow current KFB Site-first policy and the named project gate; a local preview is not PUBLIC_VERIFIED.
