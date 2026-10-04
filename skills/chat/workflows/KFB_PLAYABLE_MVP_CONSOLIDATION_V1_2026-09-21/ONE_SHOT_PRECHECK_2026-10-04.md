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
- `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`

Production Control contains the full additive MVP ledger through v2.0.

## B · HARD pre-One-Shot gates

### P0-1 · WORLD-CONVERGENCE-BASE-01

Current facts:
- main: current planning/source line;
- World candidate PR #332 head: `e58d0ea4b97debbf8d0053d710612033b7e52908`;
- latest browser-proven WB2 runtime head: `a18846cf8128e3e1facb0b51be0e6aff873d1244`;
- comparing #332 head to current main shows a real divergence:
  - main side ahead by 54 commits at the 2026-10-04 recheck;
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
- Utopia/Dystopia/Protopia recipes resolve canonical `forget_utopia` / `ignore_dystopia` / `embrace_protopia` deck IDs;
- one small reviewed Card seed set per satellite;
- derived biome/Resident/media tags remain traceable to canonical Card refs;
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

### P1-6 · DECK / CHATTER SOURCE LOCK

Current source contract:
`DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`

Before One-Shot:
- keep PDF/Card crop as visual truth;
- keep deck JSON as semantic source;
- bind Utopia/Dystopia/Protopia Residents to deck-backed `WORLD_KNOWLEDGE_PROFILE` / `RESIDENT_KNOWLEDGE_PROFILE`;
- reuse the existing ChatterBox semantic Triplet grammar rather than inventing another dialogue engine;
- use canonical Card refs for Billboard → dialogue → Almanac continuity;
- prove one shared neutral event framed distinctly by one Resident per future island;
- expose the selected Card/deck refs in evidence/debug output.

This can ride inside `WORLD-MULTI-ISLAND-CORRIDOR-01` / `DECK-WORLD-SEED-01`; it is not a separate runtime owner.

## C2 · Additional preparation that removes One-Shot ambiguity

These are not new runtime owners. They are cheap contracts/fixtures that make the final integration deterministic.

### P1-7 · GOLDEN-FIXTURE-PACK-01 · PRODUCT DIRECTION LOCKED

Current product fixture:
`GOLDEN_JOURNEY_MVP_2026-10-04.md`
with machine-readable companion:
`GOLDEN_JOURNEY_MVP_2026-10-04.json`.

Locked first-run direction:
- Town curtain → Clown onboarding;
- first Resident = juggling Clown;
- first Card = `ignore_dystopia:1 · The Doomsday Clock`;
- optional Driver/taxi unlock in Town, but Drive is required in automated acceptance;
- first satellite = Dystopia;
- first Golden performance = Orc Band + Resident Disco + Demon Lord party;
- Golden song = `demon-afro-strut · Demon Lord Afro-Strut 01`;
- Golden dance unlock = `kfb_dance_hip_hop_a`;
- Utopia courier Card = `forget_utopia:1 · The Glossy Horizon`;
- Protopia courier Card = `embrace_protopia:1 · The Open Notebook`;
- Anti-Rules courier Card = `anti_rules_toolkit:1 · The Rules Lawyer`;
- final onboarding anchor = Lorekeeper;
- save/import proves Almanac + NPC continuity.

The journey is a reference/acceptance path, not an open-world movement lock.

### P1-8 · MVP-ID-NAMESPACE-01

Freeze stable ID conventions before data from several owners meet.

At minimum:
- world / world-recipe IDs;
- anchor / route / transition IDs;
- Resident / Resident-set / scenelet IDs;
- deck / Card refs;
- song / audio-context IDs;
- event / thread / encounter IDs;
- save / session / receipt IDs.

Rule:
human-facing names may change; persistent IDs must not casually change after the One-Shot begins.

### P1-9 · MVP-SOURCE-MANIFEST-01

Prepare one machine-readable source/owner manifest before the final integration lock.

For every required MVP capability record:
- owner;
- exact repo / branch / head or source blob;
- consumer;
- status;
- required vs optional;
- current test/human evidence;
- protected boundary;
- fallback/quarantine rule.

This should become the input to the later ONE-SHOT-INTEGRATION-LOCK rather than rediscovering sources during WSA execution.

### P1-10 · MVP-INPUT-MODE-CONTRACT-01

Freeze one input arbitration table for:
- PLAY;
- GROUND movement;
- DRIVE;
- interaction I;
- jump SPACE;
- God Mode OBJECT_EDIT;
- TERRAIN_SCULPT;
- camera/orbit;
- side-chat/text focus.

Goal:
no key/pointer/wheel gesture has two simultaneous writers.
The exact terrain/editor donor semantics remain protected.

### P1-11 · MVP-QUARANTINE-FLAG-MATRIX-01

Classify every integrated capability as:
- REQUIRED_CORE;
- REQUIRED_PRESENTATION;
- OPTIONAL_QUARANTINABLE;
- DEFERRED.

For optional modules define:
- default flag;
- boot behavior if source/load fails;
- whether save data ignores/preserves the missing module;
- visible fallback or clean omission.

Initial optional/quarantinable examples include Flight, full Combat/Bonk, Organ attractions, extra Residents/Cube Pets, extra vehicle and non-essential VFX polish.

A failed optional module must not collapse the playable core.

### P1-12 · MVP-ACCEPTANCE-FIXTURE-01

Write the Golden Journey as machine-readable expected checkpoints before the runtime exists.

The fixture should name:
- deterministic world seed / recipe refs;
- expected anchors;
- expected Resident;
- expected Card/provenance;
- expected song/discovery;
- Ground → Drive → Ground transition;
- satellite entry/return;
- save/export/import point;
- post-import Almanac and NPC-continuity assertions.

Later browser automation consumes the same fixture.
Do not let the test invent a parallel game flow.

### P1-13 · MVP-PERF-OBSERVABILITY-01

Prepare measurement hooks before the four-island world is populated.

Measure, do not guess:
- frame time / FPS;
- active animation mixers;
- active EyeRig count;
- loaded Resident/scenelet count;
- draw calls / visible objects where available;
- audio voices;
- world/recipe load time;
- save/import time.

Use current distance/sleep/LOD donors only as mechanisms.
Final budgets are set from the integrated target device/browser, not copied from an old prototype.

### P1-14 · WORLD-BIOGRAPHY-FIXTURE-01

Turn the current product question into a reusable data fixture:
for Town, Dystopia, Utopia and Protopia write the compact six-beat history
Origin → First Use → Settlement → Institution/Power → Accretion/Scars → Present Day.

Each biography should reference its Deck/Card semantic sources where applicable and expose:
- 1–3 visible historical scars/landmarks;
- principal Resident roles;
- current conflict/tension;
- one reason to return later.

This is authoring data, not exposition text forced on the player.

### P1-15 · DECK-SEMANTIC-FIXTURE-01

Before the world geometry integration, prepare a small reviewed semantic fixture for each future deck:
- canonical deckId;
- 3–6 representative Card refs;
- derived concept/motif tags;
- Resident affinity examples;
- Billboard candidates;
- biome/light/architecture/audio cues;
- one neutral-event ChatterBox comparison.

This is a derived cache/test fixture only.
Canonical deck JSON + PDF remain provenance.

## C3 · Do not over-prepare before the One-Shot

Do not spend the preflight budget on:
- full galaxy/planet runtime;
- infinite streaming world;
- one biome per Card;
- open-ended LLM society simulation;
- full Fight Sandbox / rope physics;
- complete Combat;
- all Resident EyeRig variants;
- all Organ attractions;
- Flight if Ground/Drive core is not yet green;
- final polish of every building/prop family.

Those remain later consumers of the proven MVP contracts.

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

### Q2 · Golden Journey · RESOLVED FOR MVP FIXTURE
See `GOLDEN_JOURNEY_MVP_2026-10-04.md`.
The open-world remains free; the reference journey is Town → Dystopia → Utopia → Protopia/Lorekeeper with optional Town detours.

### Q3 · First Card/deck identity · RESOLVED FOR GOLDEN FIXTURE
- Dystopia #1: The Doomsday Clock.
- Utopia #1: The Glossy Horizon.
- Protopia #1: The Open Notebook.
- Anti-Rules #1: The Rules Lawyer.
- Town billboard begins from the canonical KFB card backside / wordmark rather than a fourth future deck.

### Q4 · First performance sequence · RESOLVED FOR GOLDEN FIXTURE
The first Golden performance encounter is the **Dystopia birthday party: Orc Band + Resident Disco + Demon Lord**.
Wrestling/Show Ring remains an MVP world module but is not required as the first narrative performance beat.

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
