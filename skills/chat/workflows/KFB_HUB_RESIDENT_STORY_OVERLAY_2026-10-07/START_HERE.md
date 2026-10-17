# KFB Hub Resident / Story Overlay · START HERE · 2026-10-07

Status: **PREP READY · NO RUNTIME WRITES**
Owner: **KFB Production Hub**
Issue: **#370**
Branch: `planning/hub-resident-story-overlay-2026-10-07`
Base main head recovered before planning: `34150cd17ed1975fa5a95304fe8f2756d8ee8697`

## Outcome

Prepare one additive extension of the already-proven KFB Production Hub Resident Overlay:

**Resident/Character Presenter v2 + Project Storytelling Engine**

This is a side quest. It does not replace the Hub, Resident Atlas, ToolBox, ChatterBox, Motion Library, Open World, or any current runtime owner.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/HUB_SHELL_DATA_STYLE_CONTRACT_2026-10-06.md`
5. Issue #364 final PASS comments
6. this folder's `BRIEF.md`, `SOURCE.json`, `PROJECT_STORY_REPORT_SPEC.md`, `PROJECT_STORY_CORPUS_SCHEMA.json`, `RETURN.md`

## Current proven baseline

The accepted Hub is already on Site version 10. The Resident Overlay itself was part of that acceptance and reached `Idle_A`.

Exact existing overlay donor:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/code/hub-recovery/resident-overlay.v1.js`

What it already proves:
- FrizzleBob Driver Graft;
- GothGirl;
- Black Knight;
- Rig_Medium / Rig_Large animation libraries;
- random one-shot clip on click;
- return to idle;
- drag + browser-local position;
- top-layer isolation;
- real three.js cast shadow via `DirectionalLight` + `ShadowMaterial`;
- no independent Actor/Animation owner.

Do not rebuild this.

## Protected boundary

This planning slice performs **zero** Hub/Site/Open-World runtime changes.

Do not:
- reopen #362 as a runtime job;
- mutate #364 accepted shell;
- write PR #348 / Open World;
- introduce generic avatar cards, substitute characters, placeholder branding, or a second player;
- copy Resident Atlas into the Hub;
- create a second music clock;
- create a second TTS/dialogue runtime;
- publish Site or Cloudflare.

## Product idea in one sentence

The Hub gains a movable KFB character/presenter who can demonstrate its actual current rig/look/motions, speak source-backed project status/history through the existing ChatterBox presentation grammar and browser TTS, and optionally mount reusable Resident Atlas performance scenes such as the Orc band — while every capability remains owned by its canonical source module.

## Planned delivery order

1. **Presenter v2 shell integration**
   - preserve v1.1 behavior;
   - make actor source registry data-driven;
   - source-isolated actor preview before enabling in Hub.

2. **Character inspection**
   - current model/pin;
   - rig family;
   - eye/face owner;
   - motion clip picker;
   - current source provenance;
   - no editing authority in the Hub.

3. **Project hint mode**
   - click / explicit action requests one compact source-backed current status or next action;
   - no autonomous nagging;
   - no hidden project-state mutation.

4. **Story mode**
   - reads normalized project-story corpus;
   - renders short ChatterBox triplets / bubbles;
   - optional browser TTS;
   - can jump from story beat to exact GitHub evidence.

5. **Performance mode**
   - mount approved Resident Atlas performance modules as consumers;
   - first candidate: Resident Band Module 01;
   - reuse host song clock;
   - no embedded second Atlas app.

6. **Bookmarklet / embed adapter**
   - only after the Hub module is stable;
   - same presenter package, different mount target;
   - page-safe namespace / shadow-root policy;
   - no website-destructive experiment in this slice.

## Next gate

**Work/WSA source-isolated implementation review after current Open World architecture intake is stable enough that this side quest cannot steal or duplicate shared Actor/ChatterBox ownership.**

No Stage/Site route is required for this PREP slice.
