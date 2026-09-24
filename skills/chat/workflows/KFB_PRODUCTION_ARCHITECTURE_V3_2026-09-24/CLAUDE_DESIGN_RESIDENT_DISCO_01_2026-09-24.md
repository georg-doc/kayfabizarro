# CLAUDE DESIGN BRIEF · RES-DISCO-CD-01

**Date:** 2026-09-24  
**Status:** READY · AUTHORING CANDIDATE · NO NEW RUNTIME OWNER  
**Primary executor:** Claude Design  
**Execution profile:** CLAUDE_DESIGN_STANDARD · Claude Sonnet 5 · medium reasoning · STANDARD budget  
**Receiving owner:** KFB Animation & Residents / Resident Atlas + ToolBox Animation Studio  
**Architecture owner:** PR #204 · `chatgpt-web/production-architecture-v3-2026-09-24`  
**Parent brief:** `RESIDENT_DISCO_01_2026-09-24.md`  
**Protected performance owner:** MUSIC-PERF-01 / `kfb.resident-performance.v1`  
**Human Stage target after Web rehome only:** `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/disco/` · NOT PUBLISHED

## Why Claude Design now

Resident Atlas S8 already contains the fresh Orc-band workflow:
- band appears as a Resident inside the Atlas;
- same Studio/editor/puppet layer;
- song timeline;
- rigid Legacy member support;
- source-backed band actors/props;
- shared beat clock;
- browser-authored posing/scene composition.

Therefore this job should **extend that working authoring lineage**, not invent a new disco app, Resident runtime, music engine, mixer, scene database or dashboard.

## Required first reads

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/START_HERE.md`
5. `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/RESIDENT_DISCO_01_2026-09-24.md`
6. current Resident Band source:
   - `tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/KFB_Resident_Atlas_S8.html`
   - `.../docs/RESIDENT_BAND_MODULE_01.md`
   - `.../data/resident-band-module-01.json`
   - `.../lib/band-module.js`
   - `.../lib/band-workshop.js`
7. MUSIC-PERF-01 current performance recipe/owner.

Do not treat Inbox location as ownership. The Resident Band export is donor/input; production ownership stays with existing Resident Scene / `kfb.resident-performance.v1`.

## Goal

Build one directly reviewable Claude Design candidate for an **outdoor Resident disco / street-party ensemble** using the current Resident Atlas authoring grammar.

It should visibly prove:

1. seven real source characters;
2. three character classes represented;
3. existing dance/bounce actions applied appropriately;
4. one shared music/beat clock;
5. coherent party blocking with radio/speakers;
6. a first reusable Disco Ball Core object;
7. no generic stage/dashboard wrappers.

This is an authoring/review artifact, not the final production runtime.

## Cast · fixed for this pass

Do not substitute or add actors without recording it.

### Legacy / rigid-parts
**Skeleton Minion**

Preferred user source:
`media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_minion.gltf`

User revision:
`e0037d79af9f0546c73cee02e361f78f7d662df2`

Performance:
reuse the **Orc-band bounce principle** first:
- vertical body bounce;
- optional squash/stretch;
- slight lean;
- driven from shared beat clock;
- stable canonical scene anchor;
- no fake Medium/Large footwork.

The Orc-band donor already proves the accepted conceptual pattern: Legacy Orc B uses an 8-beat `bounce` performance on the shared music clock.

### Rig_Medium
- **Avian Swordsman**
- **Protagonist_A** · role: teenager
- **Toy Soldier**
- **Witch**

### Rig_Large
- **Black Knight**
- **Demon Lord**

Current repository manifests/cast already evidence these actor families. If a literal supplied raw URL does not resolve, resolve the canonical current file from repository truth and record the exact path/revision. Never silently substitute a different character.

## Source-object-first gate

Before composing the party, provide a **Source Cast** mode.

Show every selected actor separately:
- neutral floor/support only;
- correct source materials;
- source/revision label;
- rig/presentation family;
- no party lights hiding the model;
- no proxy meshes.

Then provide **Motion Audition** mode:
- one actor at a time or compact side-by-side;
- current owned motions only;
- simple clip selector;
- play/pause;
- speed only if current Animation Studio already permits it;
- no new Mixamo imports in this pass.

A loaded URL alone is not source proof.

## Motion direction for first audition

Use current Motion Library actions, not invented clips.

Starting pairings:

- Skeleton Minion → beat-driven bounce presentation;
- Avian Swordsman → `kfb_dance_wave_hip_hop_a` / `kfb_dance_hip_hop_a`;
- Protagonist_A → `kfb_dance_house_a` / `kfb_dance_slide_hip_hop_a`;
- Toy Soldier → `kfb_dance_chicken_a` / `kfb_dance_house_a`;
- Witch → `kfb_dance_samba_a` / `kfb_dance_house_a`;
- Black Knight → `kfb_dance_house_a` / `kfb_dance_slide_hip_hop_a`;
- Demon Lord → `kfb_dance_hip_hop_a` / `kfb_dance_wave_hip_hop_a`, optional Thriller break only if spatial travel is handled explicitly.

Prefer in-place clips for fixed dance positions.

Do not silently zero root motion on travel clips.

## Scene composition

Outdoor / open-air disco, not a boxed nightclub.

Use:
- loose semicircle / irregular party cluster;
- Large characters rear/outer;
- Medium dancers foreground/mid;
- Skeleton Minion near radio/speaker as comic hype figure;
- room for later band placement;
- no mandatory baseplate;
- host support surface stays separate.

Props:
- Tiny Treats radio;
- Goth Girl speaker(s);
- optional existing ORB band at one side only after the dancer scene reads cleanly;
- Disco Ball Core overhead.

No generic black stage, no SaaS panels, no replacement branding.

## DISCO-BALL-CORE-01 · build as separate reusable object

This is not just scene decoration.

Create a first **reusable in-game module candidate** analogous in product role to Theatre Curtain Core.

Required:
- freely placeable;
- freely rotatable/scalable;
- continuous spin;
- optional beat impulse / spin kick;
- own bounded disco effects;
- spot/beam sweep;
- configurable intensity/range/spread;
- palette/color source;
- optional beat response;
- host scene can mount/unmount it;
- no second global lighting owner;
- deterministic/simple fallback;
- future EyeRig host seam reserved.

The future EyeRig requirement means:
- do not bake an eye into the base mesh now;
- expose a stable transform/face-host anchor or equivalent mount point for later EyeRig;
- keep geometry/materials usable with or without eyes.

Suggested modes:
`OFF · AMBIENT · DISCO · BEAT_PULSE · SPOT_SWEEP`.

Suggested consumer shape is conceptual only:
`mount / update(beatState) / setMode / setSpin / impulse / dispose`.

Do not create a proprietary Disco Runtime.

## Lighting / VFX boundary

The module may own its local effect recipe but must consume the current world/event lighting and VFX budgets.

Avoid:
- dozens of real shadow-casting point lights;
- full-scene color replacement;
- post-processing that destroys actor readability;
- effects tied to UI frame rate instead of the scene clock.

Prefer a small bounded set of real lights + emissive/projected/beam effects.

## Choreography proof

After Source Cast and Motion Audition work, build one compact ensemble phrase.

For this Claude pass:
- 8 or 16 bars is enough;
- individual dancers may have beat offsets;
- synchronize one or two group hits;
- action swaps on bar boundaries;
- crossfade where current owner supports it;
- keep one song transport.

Do not spend the session making the full 32-bar final recipe if the basic ensemble read is not yet proven.

## Audio

Consume current MUSIC-PERF timing semantics.

For preview, existing `Rubbish Groove` may be used as a clock if it is easiest to reuse, but do not silently declare it the permanent Disco song.

No per-Resident audio players.

## UI

This is primarily a 3D authoring/review scene.

Keep controls minimal and task-local:
- Source Cast / Motion Audition / Ensemble;
- play/pause/restart;
- performer visibility;
- clip choice where needed;
- Disco Ball mode/spin/intensity;
- orbit camera.

No dashboard, no giant explanatory cards, no duplicate asset browser.

## Deliverable

Return a complete editable Claude Design Session Cut containing:
- HTML/source;
- all authored modules;
- source/path table;
- actor-motion pairing table;
- Disco Ball Core source/module;
- current unresolved list;
- one concise Return.

Also return one direct review artifact suitable for Web rehome.

Do not publish Cloudflare from Claude Design.

## Acceptance questions

Ask Georg only:

1. Which of the seven actor/motion pairings should stay?
2. Does Skeleton Minion's bounce read as intentional party motion?
3. Does the Disco Ball Core feel like a reusable KFB world object rather than scene decoration?
4. Are the disco beams/lights lively without burying the characters?

## Stop rules

Stop rather than patch around:
- missing exact actor source;
- actor substituted with a proxy;
- broken source textures;
- second music/Resident runtime emerging;
- disco effect only working by replacing the whole scene renderer;
- generic dashboard/UI taking over the experience.

After two failed visual repair passes on the same gate, preserve/export the candidate and use the failure-recovery template.

## Web handoff after Claude

Web/GitHub Bridge:
1. refreshes current Resident/Architecture heads;
2. compares the Claude candidate against source locks;
3. rejects silent source/owner replacement;
4. integrates accepted deltas into the current owner;
5. runs browser checks;
6. only then prepares:
   `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/disco/`.

No auto-merge / Live promotion.

## Exactly one next gate

**CLAUDE RES-DISCO-CD-01 · Source Cast → Motion Audition → 8/16-bar Ensemble + Disco Ball Core.**
