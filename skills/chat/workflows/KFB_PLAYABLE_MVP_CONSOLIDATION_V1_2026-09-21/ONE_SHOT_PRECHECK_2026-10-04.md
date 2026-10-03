# KFB Playable MVP · One-Shot Precheck · 2026-10-04

Status: **CURRENT PRE-ONE-SHOT AUDIT · PLANNING / SOURCE LOCK · NO RUNTIME PROMOTION**
Owner: KFB playable MVP integration
Receiving world: KFB WorldBuilder / WB2
Purpose: reduce the final WSA/Codex One-Shot to an integration job instead of a source-recovery / architecture-reinvention job.

## Executive result

The MVP concept is broad enough and now well-covered.
The main remaining risks are **source/convergence proofs**, not missing game ideas.

Do **not** spend pre-One-Shot effort merging every open PR.
Only close seams that the final integrated loop depends on.

## A · What is already sufficiently planned / persisted

- four-island topology: Town hub + Dystopia + Utopia + Protopia;
- continuous R2D terrain direction;
- invisible semantic Hex / local-only voxel rule;
- Track Core route ownership;
- World Director Card / World Recipe v1;
- Anchor / Transition Contract v1;
- World Validation v1;
- Site-native Stage / Live manifest architecture;
- God Mode Scene Composer / terrain sculpt reuse;
- Asset Librarian placeable-search direction;
- Resident Atlas S16 / Resident-set direction;
- Orc Band, Disco and Wrestling/Show Ring MVP roles;
- Lean Memory / NPC social continuity / Fractal Almanac persistence;
- HUD Game v3 / Overworld Almanac fan donor direction;
- Ground + Drive + I interaction + SPACE Jump;
- Lean Jukebox / biome audio direction;
- living-diorama / history / world-biography criterion;
- one-shot critic / two-pass stop / source isolation policy.

GitHub durable architecture:
- `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
- `WSA_RESIDENT_ATLAS_MVP_INTAKE_2026-10-04.md`

Production Control contains the full additive MVP ledger through v1.8.

## B · HARD pre-One-Shot gates

### P0-1 · WORLD-CONVERGENCE-BASE-01

Current facts:
- main: current planning/source line;
- World candidate PR #332 head: `e58d0ea4b97debbf8d0053d710612033b7e52908`;
- latest browser-proven WB2 runtime head: `a18846cf8128e3e1facb0b51be0e6aff873d1244`;
- comparing #332 head to current main shows a real divergence:
  - main side ahead by 40 commits;
  - #332 side carries 17 commits not in main;
  - common merge base `74f7a690fbec88cf98ce0936f31b72ad3f1148f5`;
  - comparison spans hundreds of changed files, including new audio/source work.

Decision:
**Do not use PR #332 itself as the final One-Shot branch.**

Required preflight:
- start one clean convergence branch from current main;
- re-home the proven WB2/R2D world owner from #332 source-first;
- preserve exact world/support facts and tests;
- no Player/Drive/Residents yet;
- run WB2 source/browser regression;
- leave one current Recovery/Return.

This becomes the actual One-Shot receiving base.

### P0-2 · WORLD-MULTI-ISLAND-CORRIDOR-01

After clean convergence:
- prove Town + three connected satellite destination nodes as world data;
- three real Track-Core ROAD_BRIDGE connections;
- stable world IDs / anchor IDs;
- four World Recipe fixtures;
- validation report;
- no Player/Drive yet.

Why before One-Shot:
The final integrator should attach gameplay to a proven world graph rather than debug world topology and player integration simultaneously.

### P0-3 · KAYKIT-NATIVE-BLENDER-BASELINE-01 / Motion #344

Current Motion PR #344 is open.
Current branch Return still says:
**PREPARED FOR BLENDER · NOT RUN**.

Good news:
the exact native source is now pinned:
- real ActionFigure;
- KayKit Character Animations 1.1;
- Rig_Medium General / MovementBasic / MovementAdvanced;
- native-first policy.

Still unresolved:
- which native Idle/Walk/Run/Sprint/Jump/turn candidates are KEEP / HOLD / REJECT;
- final integrated player baseline.

Required before One-Shot:
run the native Blender review and persist the selected source set.
Do not revive the failed mixed browser candidate.

### P0-4 · WSA-RES-SET-01

Use current Resident Atlas S16.
Prove:
Mummy + Combat Mech + Clown
→ `kfb.resident-set/0.1`
→ current WB2 scene
→ terrain grounding
→ shared editor
→ Save
→ Reload
→ same set/root/variant/placement.

Why before One-Shot:
Once this seam exists, principal Residents, Band, Disco and other Resident scenelets become data/module work rather than a new integration problem.

### P0-5 · KFB-SITE-WORLD-PLATFORM-ARCH-01 / SITE-STAGE-01

Architecture is now persisted, implementation is not.

Minimum proof before final One-Shot:
- one Site/world shell;
- Stage manifest;
- Live manifest or explicit last-known-good placeholder channel;
- module/recipe registry;
- validator entry point;
- one data-only world patch;
- apply to Stage;
- rollback;
- accept candidate;
- Live untouched.

Also choose and pin the actual persistence backing owner/API.

Why:
Without this, the final One-Shot would have to invent deployment, editing and persistence while also integrating the game.

### P0-6 · LEAN-MEMORY-SITE-PERSISTENCE-01

Minimum executable proof:
- meet one real Resident;
- acquire one real Card;
- write one Encounter/Moment/Card provenance receipt;
- save/export;
- import in a fresh session context;
- same Card appears in Almanac;
- Resident continuity can resolve the prior encounter;
- valid safe resume anchor;
- no dependence on ChatGPT conversational memory.

This may reuse PR #210 NPC-LIFE-01 as encounter-bus donor and PR #272 Resident Social Memory / AIDA / POI as semantic donor.
Do not merge either wholesale unless the receiving-owner integration requires it.

## C · High-value cheap prework

### P1-1 · KFB_JUKEBOX_CATALOG_01

Current main `media/3D_Assets/Sounds/jukebox.json` is still version 1.0.0 / 2026-07-18 and lists only the old small track set.

Meanwhile the current RoadTrip/Jukebox source pool contains the larger authored inventory and PR #346 records the accepted master-safe/stem-certified direction plus new Beetle-Wrestling/Surf sources.

Before One-Shot:
- reconcile the canonical Jukebox catalog to the current actual song inventory;
- store master/stem provenance, BPM where known, discovery/unlock metadata seam;
- no arbitrary cross-song stem mixing;
- Band/Disco/biome contexts consume this same catalog.

This is a cheap way to avoid audio path drift during final integration.

### P1-2 · ASSET-LIBRARIAN-COLLECTIONS-MOTION-SALVAGE-01

PR #304 is a frozen partial candidate.
Salvage only the proven useful core:
- real Family → Pack → Collection browsing;
- KayKit family shortcut;
- animated Motion-on-Actor preview + binding report;
- no new scrub/speed/loop transport.

Why:
God Mode needs a fast curated Placeable search.
This can be proven before the full Site Scene Composer.

### P1-3 · PLAYMATION LOOK SOURCE LOCK

The current Clay SSOT exists on open PR #301 / branch `work/clay-style-ssot-2026-10-01`, not on main.

Current exact docs observed:
- `KFB_CLAYMATION_STYLE_SSOT.md` blob `435b9ca51ce23b1d8c36c7cc89c65c2b1e03b65a`;
- `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` blob `5d37512ed6583c1f0f005397fe0721dbbfb8bae5`.

Before One-Shot:
either reconcile those documents into the stable source line, or pin the exact branch/head in the final integration lock.
Do not let WSA invent a generic “clay look.”

### P1-4 · HUD / ALMANAC donor lock

Pin one current HUD presentation path:
- HUD Game v3 for speed/radio/minimap/almanac layout language;
- Overworld Almanac fan/card-view grammar;
- Playmation/Knet restyle as presentation layer;
- collected Cards are primary Almanac objects;
- Hero Shots are attachments only.

No new generic HUD architecture.

### P1-5 · MVP Eye policy

Current S16 has mixed EyeRig review state.
Do not block the whole MVP on every Medium/Legacy profile.

Lock before One-Shot:
- use explicitly accepted EyeRig profiles where accepted;
- otherwise preserve original/source eyes or an explicitly named safe fallback;
- never silently promote ADJUSTED/UNREVIEWED to accepted;
- only principal MVP Residents need a source-clean visual result.

## D · Useful donors to PIN, not “integrate everything”

### Resident social layer
- PR #210 NPC-LIFE-01: semantic encounter bus, 21/21 contract PASS, browser/public proof still pending.
- PR #272 Resident Social Memory + POI/AIDA: design-only, useful semantic contract.

Use them as donors for Lean Memory / baseline I interaction.
Do not create another NPC runtime.

### Performance
- PR #261 adaptive resolution / clay distance budget is a useful performance donor, but it belongs to an older world line.
Do not cherry-pick blindly.
Port only the performance policy/mechanism after the current four-island WB2 consumer exists.

### VFX / SFX
- PR #347 VFX semantic skill and PR #345 SFX language are useful method donors.
Combat/VFX is not required to block MVP1.
Consume later in existing runtime owners.

### Billboard / media
Current billboard work has multiple proven donors and one blocked Travel receiving-owner branch.
For MVP use an existing source-proven media surface/Canvas/Card presentation path inside WB2.
Do not make recovery of the old Travel-v25 host a prerequisite.

### Track Core
PR #219 is the current architectural Track-Core contract.
Race PR #42 is a frozen acceptance fixture, not the architecture.
The final world consumes Track Core; it does not resurrect stacked Race track branches.

## E · Product questions worth deciding before the One-Shot

These are the remaining decisions where Georg adds more value than another technical pass.

### Q1 · Four island biographies
For Town / Dystopia / Utopia / Protopia:
lock at least a compact six-beat history:
Origin → First Use → Settlement → Institution/Power → Accretion/Scars → Present Day.

This should drive layout, props, architecture and Resident context.

### Q2 · Golden Journey
Lock the first complete player journey in narrative order.

Suggested template:
1. spawn in Town;
2. first Resident encounter;
3. first real Card;
4. first song/discovery;
5. first God Mode or world-edit proof if authoring is part of the review;
6. enter vehicle;
7. choose first satellite;
8. biome/audio transition;
9. second Resident/context;
10. return to Town;
11. save/export;
12. fresh import/resume;
13. Almanac and NPC continuity prove memory.

The exact Resident/Card/song/first satellite should be chosen before final WSA execution.

### Q3 · First Card/deck identity per island
The four islands need one concrete Card/deck/media identity for the MVP fixture.
Do not leave the billboard/Almanac content generic.

### Q4 · First performance sequence
All three modules stay in the MVP:
- Orc Band;
- Resident Disco;
- Wrestling/Show Ring.

Before One-Shot, decide which one is the **first active Golden performance encounter** in the acceptance journey.
The other two still ship as usable world modules but need not carry equal narrative weight in the first 10–15 minutes.

## F · One-Shot branch strategy

Do not stack the final One-Shot on an old feature PR.

Recommended sequence:
1. finish the P0 preflight seams;
2. cut a **fresh integration branch from then-current main**;
3. import only source-proven current owners;
4. use one release manifest / feature flag table;
5. optional capabilities default OFF unless source-clean;
6. persist implementation → evidence → Return/changelog/Hub in small checkpoints;
7. human Stage only after the integrated journey is genuinely playable.

## G · Feature flags / quarantine

The One-Shot should have explicit optional-module switches for:
- Flight;
- Bonk/full Combat;
- Organ attractions;
- extra Residents;
- optional Cube Pets;
- extra vehicle;
- optional VFX polish.

If an optional module fails, quarantine it without breaking the core journey.

Required modules may not be silently dropped to make tests green.

## H · One-Shot acceptance script

One fresh boot should prove:

- stable world boot;
- Idle / Walk / Run / Sprint / Jump;
- one Resident interaction through I;
- real Card acquisition;
- Almanac Card appears;
- Jukebox/song discovery;
- living performance encounter;
- animated Ground → Drive → Ground;
- user-controlled drive across a real Town↔satellite route;
- visible biome/light/audio transition;
- save/reload;
- fresh import/resume;
- NPC/Card continuity;
- no duplicate world/movement/audio/editor/save owners;
- actual target-browser/device performance;
- no console/page errors;
- one direct Cloudflare Stage route only at the meaningful integrated gate.

## I · Current final recommendation

Do **not** start the full One-Shot yet.

First close, in this order:

1. WORLD-CONVERGENCE-BASE-01
2. WORLD-MULTI-ISLAND-CORRIDOR-01
3. KAYKIT-NATIVE-BLENDER-BASELINE-01
4. WSA-RES-SET-01
5. SITE-STAGE-01 + persistence backing choice
6. LEAN-MEMORY-SITE-PERSISTENCE-01

In parallel / cheap:
- KFB_JUKEBOX_CATALOG_01
- Asset Librarian salvage
- Clay/Playmation source lock
- Golden Journey + four island biographies

After those, create the final frozen **ONE-SHOT-INTEGRATION-LOCK** with exact owner/ref/source matrix and run WSA/Codex once against that lock.
