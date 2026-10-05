# KFB Open World · Production Reset One-Shot · 2026-10-05

Status: **CURRENT PRIMARY PRODUCT CONTRACT**
Execution mode: **ONE_SHOT · CONTINUE UNTIL WHOLE-PRODUCT INTERNAL PASS OR PROVEN OUTCOME BLOCKER**
Owner: **KFB WorldBuilder / WB2**
Repo: `georg-doc/kayfabizarro`
Draft PR: **#348**
Current owner branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`

This contract **supersedes** the narrower `OPEN_WORLD_AUTHORING_RECOVERY_2026-10-05.md` as execution scope.

## 0 · Product outcome

Build one coherent **KFB Open World authoring product** that Georg can use as reusable visual/contextual space for comics and stories.

It must combine two things in one product:

1. **a world worth moving through** — coherent, built-looking, extensible open world;
2. **a world Georg can directly author** — place/edit/sculpt/save/reload in that same world.

Do not stop after proving an editor seam.
Do not stop after proving a procedural landscape.
Do not stop after proving one village.
Do not stop after one module passes.

The final internal candidate must be a coherent usable product.

## 1 · Product target

First complete world fixture:

- start in a real KayKit/KFB village;
- move continuously into an extensible seeded world;
- world generation reads as **authored / placed**, never random scatter;
- terrain/water first;
- roads next;
- settlements align to roads/intersections;
- buildings face/access roads;
- rivers/bridges respect the road and terrain graph;
- vegetation appears in coherent clusters and ecological zones;
- props appear only where semantic placement rules justify them;
- real KayKit/KFB source assets remain recognisable;
- real player collision;
- locomotion clips run only in their credible speed bands; visible foot sliding is measured and repaired;
- stable third-person camera;
- no Combat, Residents, Cards, quests, server or social simulation required for acceptance.

The four existing islands are **deferred world recipes/content**, not the proof target.

## 2 · Open-world authoring target

In the same running world:

- PLAY / BUILD / GOD or equivalent one-owner modes;
- Asset Librarian / Registry search;
- actual source object shown in isolation before first integration of a source family;
- place real building/prop/nature assets;
- Move / Rotate / Scale;
- Place on Ground / Surface Snap;
- terrain Raise / Lower;
- authored placement must override/reconcile with procedural generation without being regenerated away;
- Save;
- fresh reload/import;
- exact authored identities/transforms/terrain deltas survive;
- return to PLAY and walk through the authored result.

World content/state is data, not hard-coded scene reconstruction.

## 3 · Do not polish the failed candidate forward

The current four-island published candidate is **HUMAN TOTAL FAIL** and remains failure evidence.

Do not treat its:
- world composition;
- prop distribution;
- current visible island arrangement;
- published Site state

as the baseline to patch.

Reuse verified mechanisms/owners only.

## 4 · Architecture first — internal phase, not a stop

Before feature work, the Integrator writes/refreshes `ARCHITECTURE.md` for the candidate.

Required subsystem boundaries:

- `terrain/`
- `water/`
- `roads-rivers-bridges/`
- `settlements/`
- `buildings/`
- `nature/`
- `props/`
- `player-motion-camera/`
- `world-streaming/`
- `authoring/`
- `persistence/`
- `visual-lighting/`
- `audio/` only if already safely reusable
- `qa/`

Architecture must name:
- one world data model;
- metres / +Y-up or exact existing WB2 units;
- seeded determinism only;
- chunk/stream ownership;
- support/collision owner;
- authoring override rules;
- persistence/migration rules;
- per-module public API/events;
- performance budget derived from a measured baseline;
- exact asset/source policy;
- module-failure isolation.

Architecture is an internal checkpoint. **CONTINUE automatically.**

## 5 · Reuse matrix · mandatory

Do not restart from zero, but do not inherit failed composition.

Mechanism donors to inspect and reuse where sound:

### WB0 live-authoring mechanism
`georg-doc/KFB-Travel-Globe/site/world-builder/`

KEEP candidates:
- PLAY / BUILD / GOD state separation;
- placement/editing;
- Surface Snap;
- World Recipe concept;
- persistent authored instances;
- ROAD / BlockBits seams;
- save/reload.

### Current WB2
KEEP candidates:
- current renderer/world owner;
- `wb2-studio.v1.js` Asset Librarian/source-isolation/place/save seam;
- current shared in-scene editor;
- `wb2-terrain-sculpt-01/terrain-sculpt.js`;
- source manifests / Registry/Librarian identity;
- any current player/motion mechanism that survives real-input verification.

### Existing source/reference packs
Use exact KayKit/KFB/Tiny Treats pack/demo/sample references where available.

A loaded URL or model name is never proof. First show the real source object/family in isolation.

## 6 · Verification harness before feature expansion

Build the verification loop before the world expands.

It must drive the **actual product**, not a parallel debug app.

Minimum:
- launch real candidate;
- explicit ready marker;
- real visible browser;
- real keyboard/mouse/controller events through the normal input path;
- fixed seed and named camera presets;
- PNG screenshots;
- 30–60 s continuous real-input video for locomotion/world traversal;
- JSON log: exact head/build, console/page/network errors, FPS/frame time, draw calls/instances where available, loaded visible source families;
- save/reload/import proof;
- module showcase route/state inside the real app for each subsystem.

No agent may claim visual/gameplay quality from hidden state, synthetic teleport/autoplay or test-only movement.

Automation may prepare deterministic positions, but **human-like gameplay QA uses the normal input path**.

## 7 · Internal multi-agent fan-out

Use true separate builder contexts where the executor supports them.

Suggested dependency waves:

### Wave 1
- terrain/water
- roads/rivers/bridges
- player-motion-camera
- world-streaming
- visual-lighting
- QA harness

### Wave 2
- settlements/buildings
- nature
- semantic props
- authoring/editor integration
- persistence

### Wave 3
- integrated demo/open world
- performance/stream tuning
- whole-product repair

Rules:
- one builder agent owns one module/folder;
- module builders do not edit core/shared integration;
- one Integrator is the only core/receiving-runtime writer;
- core change requests return to Integrator;
- modules stay loadable independently;
- a broken optional module cannot take down world boot.

If agent fan-out is unavailable, the Integrator performs the same dependency sequence. It may not pretend that self-review is independent critique.

## 8 · Mandatory independent Critic separation

For this product, "Independent Critic" means a **separate fresh-context agent/process**, not a persona switch inside the Builder context.

The Critic:
- receives **no Builder transcript, reasoning, self-score or ranked issue list**;
- receives no production-write permission;
- receives only:
  - candidate URL/build identity;
  - fixed rubric;
  - accepted KFB/KayKit reference images/source samples;
  - exact user-facing product target;
- opens the candidate itself;
- waits for ready itself;
- takes its **own screenshots**;
- records its **own continuous traversal video** using normal controls;
- inspects several locations/zoom levels;
- may inspect console/perf facts but cannot use green metrics to excuse visible failure;
- writes only `qa/critic/<round>/REPORT.md` + evidence;
- never writes production code.

Persist:
- critic agent/session identity;
- exact critic prompt;
- candidate head it inspected;
- evidence filenames;
- raw scores/verdict.

Same orchestrator may spawn the critic, but the critic context must be isolated and fresh.

If the executor cannot provide this separation or cannot open/drive the real app:
**CRITIC NOT RUN → candidate is not human-ready.**
Do not send it to Georg as a replacement for missing internal QA.

## 9 · Critic rubrics and hard pass

Module/world critic dimensions:

1. SOURCE_FIDELITY
2. KFB_VISUAL_COHERENCE
3. WORLD_COMPOSITION
4. BUILT_NOT_SCATTERED
5. ROAD_SETTLEMENT_RELATION
6. RIVER_BRIDGE_TERRAIN_RELATION
7. VEGETATION_PROP_SEMANTICS
8. PLAYER_MOVEMENT_CAMERA_COLLISION
9. AUTHORING_USABILITY
10. PERSISTENCE
11. TECHNICAL_HEALTH
12. PERFORMANCE / STREAMING

Score:
- 10 = target-defining;
- 8.5 = release-quality candidate with nits;
- 7 = good unfinished prototype;
- 5 = programmer-art / technical-demo territory.

**Hard pass:**
- every REQUIRED dimension >= 8.5;
- SOURCE_FIDELITY PASS;
- no unexplained page/console/network errors;
- no boot/load stall;
- no visible placeholder/generic replacement;
- real-input traversal PASS;
- save/reload PASS.

Scores are **binding**, not advisory.

Any required FAIL returns a ranked issue list to the Integrator.
Repair shared causes, not screenshot-specific symptoms.

Up to four visual/product rounds are allowed **only while scores improve**.
The general two-non-improving-pass Production Guard rule still stops or quarantines a non-improving seam.

## 10 · Reference comparison

Critics compare against:
- official/source KayKit pack/demo/sample images for the visible source family;
- accepted KFB clay/Playmation references;
- exact source objects before adaptation;
- current user-approved world references.

For taste-sensitive surfaces, use blind A/B pairs:
- candidate vs accepted KFB/KayKit reference;
- candidate vs previous recovery candidate where useful.

Do not use generic AAA photorealism as the KFB art target.

## 11 · Whole-product critic

Only after module critics pass, launch a **different fresh-context whole-product critic**.

It must:
1. boot the real product;
2. play continuously for at least five minutes through normal controls;
3. start at village;
4. follow road;
5. cross/inspect bridge or river relation;
6. visit water edge;
7. enter forest/nature cluster;
8. inspect another settlement/chunk if generated;
9. enter BUILD;
10. search/show source/place/edit a real asset;
11. sculpt terrain;
12. save;
13. fresh reload/import;
14. verify authored result;
15. return to PLAY;
16. continue walking.

It captures canonical screenshots + continuous video.

No hidden-tab autoplay substitutes for this gate.

## 12 · Human gate

Georg does **not** debug this One-Shot.

Georg receives the candidate only after:
- module critics PASS;
- whole-product critic PASS;
- technical health PASS;
- authoring persistence PASS;
- real-input traversal PASS.

His task is one product decision:
**Would I actually build comic/story locations in this and keep walking/exploring?**

Georg remains final authority and may still FAIL the candidate.

## 13 · Publication firewall

`DEPLOYED` never means `QA PASS`.

A Site may be deployed for internal critic access, but it is not routed as a Georg gate until:
- critic PASS;
- whole-product PASS;
- exact Site visible verification.

If browser/critic infrastructure is unavailable:
- preserve candidate;
- record `INTERNAL_QA_BLOCKED`;
- do not convert Georg into the missing QA system.

## 14 · Preserve last-known-good

Before integration:
- pin previous candidate/baseline;
- world authored data stored independently from runtime build;
- Stage candidate cannot overwrite last-known-good authoring data;
- migrations are explicit and reversible;
- no silent world reset.

## 15 · Exactly one stop condition

The One-Shot stops before Georg only when:
- the named product outcome is demonstrably impossible with the current owner/source constraints; or
- the same outcome-critical seam has two non-improving repairs and Production Guard proves it blocks the whole product.

Architecture done, module done, screenshots done, editor done, village done, internal Stage deployed are **not stop conditions**.

## 16 · Final return

Return:
- exact owner/branch/PR/head;
- architecture;
- module roster + owners;
- critic agent/session identities;
- critic prompts and raw reports;
- real screenshots/video list;
- test counts;
- performance evidence;
- source isolation evidence;
- authoring save/reload evidence;
- exact Site candidate;
- unresolved/deferred items;
- one human gate.

No auto-merge. No Live promotion.
