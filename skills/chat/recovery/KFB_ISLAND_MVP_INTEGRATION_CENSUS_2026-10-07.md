# KFB Island MVP · Integration Census · 2026-10-07

Status: **PLANNING CENSUS · ANTI-FEATURE-LOSS INPUT · NO RUNTIME OWNER CHANGE**
Current product owner: **KFB WorldBuilder / WB2 · Issue #360 · Draft PR #348**
Product status: **NO MVP**

Purpose: enumerate current reusable owners/donors/modules before freezing the bounded-Island One-Shot, so existing systems are not silently dropped or replaced by placeholders.

## Classification
- **MVP REQUIRED** — representative real integration must be present in the same candidate.
- **MVP STRONGLY INCLUDE** — high product value / low-to-moderate integration cost; include unless source audit proves it destabilizes the product.
- **MVP OPTIONAL PROOF** — useful vertical proof, not required for product acceptance unless promoted by Georg.
- **LATER** — explicitly outside first Island MVP.
- **DO NOT SUBSTITUTE** — existing real owner/consumer must not be replaced by placeholders or generic stand-ins.

## A · World / persistence foundation

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Bounded island document/runtime | WB2 / PR #348 | accepted direction; one-owner rule | **MVP REQUIRED** |
| Continuous Surface Truth | WB2 continuous terrain foundation | topology-independent foundation present; replay/contact still needs proof | **MVP REQUIRED** |
| Stable WorldObject identity | WB2 registry/current foundation | semantic IDs survive batching; authored visible/physical replay still open | **MVP REQUIRED** |
| Island-local physics frame | WB2 | gap exported in Island Foundation Return | **MVP REQUIRED** |
| PLAY / BUILD / GOD | existing WB2 authoring/editor path | receiving owner exists; must be reconciled to bounded island | **MVP REQUIRED** |
| Place / Move / Rotate / Scale / Surface Snap | WB2 + Asset Librarian source path | owner exists; final consumer proof required | **MVP REQUIRED** |
| Terrain Raise/Lower / Sculpt | WB2 sculpt donor | mechanism exists; ordered replay/policy still open | **MVP REQUIRED** |
| Save / fresh reload / import | WB2 Scene/Store | existing mechanisms; exact bounded-island reconstruction not yet proven | **MVP REQUIRED** |
| Generator/source revision pinning | island document proposal + WB2 store | gap | **MVP REQUIRED** |
| Bounded streaming / unload / reload isolation | WB2 | same-seed/document isolation gap | **MVP REQUIRED** |
| Near/Mid/Far island LOD + impostor seam | R2C/TinySkies-style donor idea | architecture input, not accepted runtime | **MVP REQUIRED for performance if needed; implementation can be minimal** |

## B · Player / movement / drive

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Ground controls | current Ground Controls Canon | binding keys/one movement writer | **MVP REQUIRED** |
| Locomotion clips/profile | Motion SSOT / PR #344 + locomotion-profiles donor | clips/measurements exist; current consumer feel NOT accepted | **MVP REQUIRED · P0** |
| Default Jog / faster Shift Sprint / deliberate Slow Walk | product decision | needs consumer tuning; no skating | **MVP REQUIRED · P0** |
| Backward movement | Motion/ground consumer | current feel too slow; stride/speed match required | **MVP REQUIRED · P0** |
| Cartoon Jump | Jump_Start / Jump_Idle / Jump_Land donor | timing/feel not accepted; actual ballistic/contact sync required | **MVP REQUIRED · P0** |
| Camera | single camera owner; Joyride J09/J10 donor + WB2 current | known failures in complex/close geometry; must pass normal-input critic | **MVP REQUIRED · P0** |
| Joyride playable shell | J16/J17 lineage | strongest current walk/drive/track donor; not world owner | **MVP REQUIRED as donor baseline** |
| Vehicle / Drive | Joyride k2b/k2 / current Drive owner | J16/J17 drivable; bounded-island consumer integration required | **MVP REQUIRED** |
| Enter / Exit vehicle | Joyride J14–J17 lineage | existing mechanism; Cabrio special body/seat animation may be omitted | **MVP REQUIRED, simple transition allowed** |
| Cabrio seat/ear/hand special kinetics | J17 | high-speed issues remain | **LATER / TUNE, not MVP blocker** |

## C · Roads / world construction / look

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Track Core | current Track Core owner / v0.12 lineage | route construction/contact owner | **MVP REQUIRED** |
| Joyride visible road language | J14/T4/J16/J17 lineage | proven design donor; prior MVP omitted it and failed | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Normal road + village sidewalk | Joyride/Lab donor over Track Core | donor patterns exist; source-backed consumer proof needed | **MVP REQUIRED** |
| Bridge / water crossing | Track Core + Surface Truth | representative seam required | **MVP REQUIRED** |
| Simple race/loop section | Joyride/Track Core | proven lineage; keep first slice simpler than 720° spiral | **MVP REQUIRED as one representative fun section** |
| Complex 720° spiral / Skydrive / large Race-Tube spectacle | J16 | stress-test/content donor; camera/perf risk | **LATER** |
| Settlements / city blocks | historical WB2/Coworker donors | long blocks not needed | **LATER / not required** |
| Sparse surreal Toy-World composition | current product direction | preferred over procedural suburbia | **MVP REQUIRED visual direction** |
| Signature Landmark | current signature/landmark seam | no mandatory Life Tree type | **MVP REQUIRED** |
| Life Tree | Island proposal | optional landmark family, not topology rule | **MVP OPTIONAL** |
| Water / river | Surface Truth + visual presentation | old hanging-ribbon water is explicit FAIL pattern | **MVP REQUIRED representative water seam; no ribbon placeholder** |

## D · Visual / material / environment

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| KFB Clay | K1/H0 Golden + K2/v10 routing | binding surface canon | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Claybound Compatibility Gate | design benchmark / current product rule | new content must plausibly belong to one coherent clay toy world | **MVP REQUIRED QA rule** |
| Source identity preservation | Asset/visual owners | source object must be shown in isolation before adaptation | **MVP REQUIRED** |
| Sky / Skydome / Environment | existing Sky owner | owner exists; no second sky runtime | **MVP REQUIRED** |
| Lighting / shadows / contact | current KFB canon | known world-scale bias/contact rules | **MVP REQUIRED** |
| Near/Mid/Far Clay complexity | K2/Lab donor | performance architecture input | **MVP REQUIRED if necessary for target FPS** |
| Boardgame/Paper/Fabric/custom forms | external/internal donor ideas | raw ideas only; must pass Claybound compatibility and reuse-first gate | **OPTIONAL** |

## E · Living world / character systems

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| One real Resident seam | Resident owner / Atlas | existing sources | **MVP REQUIRED** |
| ChatterBox | existing ChatterBox owner / PR #357 packet | planning/tooling ready; actual runtime consumer seam required | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Resident Life / POIs / Activities | Resident Life prep | proposal data; enough for representative activity loop | **MVP STRONGLY INCLUDE** |
| Resident Reaction / Encounter | current reaction matrix | prepared | **MVP STRONGLY INCLUDE** |
| Resident performance / choreography | #369 + current Motion/Atlas | reusable performance vocabulary in progress/ready input | **MVP STRONGLY INCLUDE where available** |
| Face/Eye/Emanata layers | EyeRig/face/performance owners | existing owners; reuse where low-risk | **MVP STRONGLY INCLUDE for visible Residents** |
| Fluff Work motions | PR #356 | source clips prepared; runtime consumer proof still next | **MVP OPTIONAL / useful if chosen activity uses Fluff** |

## F · Media / semantic content

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Clay Billboard / MediaSurface | existing Billboard owner | required by current product matrix | **MVP REQUIRED** |
| HyperNormalisation content loop | existing HyperNormalisation/Quote/Media owner | must use real consumer/content; placeholder graphics forbidden | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Card | current Card/deck source owner | canonical source/provenance required | **MVP REQUIRED representative seam** |
| Almanac | current Almanac owner | acquire/inspect/provenance chain | **MVP REQUIRED representative seam** |
| Deck → World/Card/Resident semantic chain | Deck-World pipeline | planning contract exists | **MVP STRONGLY INCLUDE as data relation** |

## G · Audio

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Shared Audio/Jukebox owner | Audio owner / PR #365 lineage | existing owner; no second AudioContext | **MVP REQUIRED** |
| Existing runtime-verified music families | current Audio handover | some families already runtime-verified | **MVP REQUIRED representative use** |
| M/N/O Island/Dusk/Discovery stem families | Audio handover | source-present, some runtime/listening QA still pending | **MVP STRONGLY INCLUDE if QA-cleared** |
| World-side duplicate BPM/stem tables | none | forbidden | **DO NOT BUILD** |
| One coherent biome/POI transition | Audio owner consumer | product integration proof needed | **MVP REQUIRED** |

## H · Entry / game presentation modules

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Theatre Curtain r3 | Issue #372 / accepted donor packet | Georg PASS; checked into main; user now requests final KFB/Claybound claymation compatibility before integration | **MVP STRONGLY INCLUDE** |
| Curtain loading / Character Select / in-game reveal states | same module | seven-state modular use described in Return | **MVP STRONGLY INCLUDE** |
| Curtain clay/cartoon look tune | current visual owner / Claybound compatibility | still needs final style reconciliation per Georg | **MVP STRONGLY INCLUDE if bounded** |
| Minimal game HUD / Joyride HUD elements | Joyride lineage | proven donor; do not let UI dominate | **MVP STRONGLY INCLUDE** |
| Radio/Jukebox controls | Audio/Joyride UI donor | existing concept; consumer-driven only | **MVP STRONGLY INCLUDE if it exposes real Audio owner** |

## I · Shared world-event / transformation grammar

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| UFO Tractor Beam Event Lab | current UFO Lab | PASS/TUNE donor ready | **MVP OPTIONAL PROOF** |
| Shared Clay materialize/dematerialize presentation | UFO + current architecture decision | candidate common visual grammar; state ownership remains separate | **MVP STRONGLY INCLUDE as reusable presentation seam if low-risk** |
| Build / Repair / Rebuild presentation | Resident/Fluff/Destruction donors | pieces exist; common presentation can be layered | **MVP OPTIONAL PROOF** |
| Destruction state | Seed World Mech donor | 2-bit damage donor only; Combat owner not current | **LATER / optional bounded proof** |
| Full Combat | archived failed candidate / future owner | explicitly non-blocking | **LATER** |

## J · Tools that should feed MVP but are not runtime features

| Tool | Role | MVP relation |
| --- | --- | --- |
| Asset Librarian | source isolation / real asset selection | **required production input, not second runtime** |
| Style Reference Library | Claybound/KFB comparison and design QA | **required QA/reference input** |
| Production Hub / MVP Living Doc | anti-feature-loss / status | **control surface only** |
| Prototype Graveyard | negative Goldens / salvage evidence | **QA/reference input only** |
| Blender MCP | rig/animation asset authoring where genuine gap exists | **specialist input, no runtime ownership** |

## K · Explicit first-MVP non-blockers / later scope

- full 130+ island universe;
- every Deck/Resident/Card/Billboard;
- full Combat Arena/platformer;
- full quest/economy;
- multiplayer/network backend;
- OSM as second planner input;
- complex Cabrio seat/ear/hand kinetics;
- 720° spirals / full Skydrive spectacle;
- full destruction sandbox;
- full Fluff economy;
- mandatory Life Tree on every island.

## L · Placeholder / shortcut firewall

The following never count as integration:
- fake Billboard texture in place of the real Billboard/HyperNormalisation consumer;
- placeholder Audio or a second AudioContext;
- generic UI replacing the accepted Curtain/HUD owner;
- technical Track Core geometry shown as final Joyride road presentation;
- fake/generic Residents instead of the current Resident/ChatterBox seam;
- copied Card artwork without canonical provenance/Almanac relation;
- default KayKit material used as final KFB Clay;
- a generic tree/river/landmark merely because a procedural generator can make one;
- custom prop/building that fails the Claybound Compatibility Gate;
- a loaded asset URL without source-isolation proof.

## M · Recommended first Island MVP content contract

One bounded, persistent island containing:
- strong Player locomotion (Jog/Sprint/Slow Walk/Backwards/Cartoon Jump);
- one simple Joyride road loop with sidewalk, bridge/water and modest race/fun segment;
- Drive + enter/exit;
- one strong signature Landmark (not necessarily a tree);
- 2 visually distinct zones / Scenelets;
- small authored POI cluster, not long city blocks;
- two Residents with at least one meaningful activity/reaction/dialogue interaction;
- one real Billboard/HyperNormalisation loop;
- one Card → Almanac interaction;
- one real Audio/Jukebox environmental/POI transition;
- current Sky/Environment;
- KFB Clay + Claybound compatibility;
- Curtain/game-entry module if integration remains bounded;
- PLAY/BUILD/GOD;
- place/edit/source-snap + sculpt;
- Save → complete unload → fresh reload/import → exact replay → return to PLAY;
- module critics + different whole-product critic;
- complete frozen MVP acceptance matrix remains the final product gate.

## Next action

Web Chat should now review this census with Georg and classify each row:
**KEEP IN MVP / STRONGLY INCLUDE / OPTIONAL / LATER / REMOVE**.

Only after that classification is frozen should Work/WSA receive the next Island One-Shot briefing.


## N · Cross-chat loose ends / prepared knowledge layers

These inputs were recovered from other Web Chat lanes and must not disappear behind generic labels like "Style References" or "Billboard".

### N1 · Quote Pool / HyperNormalisation content

Owner / lane:
- Draft PR #354 · KFB Billboard Quote Hypernormalisation / Quote Curator.
- Research/data only; runtime implementation has **not** started.

Current inventory:
- **415 researched quote + FrizzleQuestion candidates** total;
- **30 mapped** candidates across the first 10 canonical decks;
- **385 deliberately unmapped** reserve candidates across Research Reserves 01–13;
- Reserve 13 added finance/money-system coverage;
- provenance/right-status is explicitly tracked; uncertain material is not silently promoted.

MVP consequence:
- **MVP REQUIRED CONTENT INPUT** for the real Billboard/HyperNormalisation seam.
- The Island MVP does **not** need to map all 415.
- It should consume a small source-proven mapped/context pool through the actual Billboard/HyperNormalisation owner and preserve quote ID, provenance, rights eligibility, FrizzleQuestion and Brain-Food link data.
- Placeholder/coded billboard graphics remain forbidden.
- Quote selection/rotation should avoid repeating not only the exact quote but also the same author/era/discipline/tone during longer sessions.
- Research expansion remains Web-Chat/data work; do not spend One-Shot runtime budget on bulk quote research.

### N2 · Etherington / Style Reference corpus is a production design input, not decoration

Current Style Reference lane:
- Draft PR #359;
- current repo corpus reports **69 curated records: 64 official Etherington + 5 supplementary**;
- accepted R2 Browser/Viewer is usable for continuation;
- one-time live-data migration is an operational Tooling task, not an Island runtime feature.

The corpus contains explicit reusable consumer packs:

1. **KFB Clouds 01**
   - Clouds + Smoke + Spacing in Composition;
   - goal: three KFB cloud construction families;
   - extract major mass grouping, silhouette breakup, overlap/depth, negative-space rhythm;
   - status: design job ready, source inspection still required before derived visual claims.

2. **KFB Environment Mass / Living World Grammar 01**
   - Mountains;
   - Forest clusters / clearings;
   - Overgrown Vegetation;
   - Foreground / Midground / Background;
   - Rock Formations;
   - Tree Roots;
   - target: reusable terrain/forest/overgrowth/depth/rock/root grammar;
   - status: source pack ready, source-isolation/design derivation still pending.

3. **Graphic/Comic carriers**
   - Sound Words;
   - Bubble / Caption Grammar;
   - Emanata / Reaction Symbols;
   - Dialogue / Interaction;
   - Narration / Reaction.
   - Curated packs exist; several are **VISUAL ANALYSIS NOT STARTED**, so they are design inputs, not finished visual runtime assets.

4. **Dialogue authoring discipline**
   - Etherington + NIE authoring contract exists;
   - causality (THEREFORE/BUT), SAID/MEANT/WANTED, adjacency pairs, silence, interruption, worldview voice, group-role selection, concrete-image rule;
   - consumes existing ChatterBox/Resident systems later; it is not a second dialogue engine.

5. **Living-Toy Event Grammar**
   - 13 scenario families plus a 30-activity pool exist as authoring/architecture prep;
   - useful for Resident/world-event choreography and text-scarcity rules;
   - no current runtime event IDs are claimed.

MVP consequence:
- **MVP REQUIRED QA/DESIGN INPUT** for world composition.
- Do not analyze all 69 references inside the One-Shot.
- Select 3–6 exact references for each concrete visual problem and source-isolate them before deriving rules.

### N3 · Prop/terrain grounding and "not pasted on" rule

Recovered environment/reference rules directly address prior failures:

- large readable masses before detail;
- handmade asymmetry;
- clusters and clearings instead of uniform scatter;
- visible grounding;
- foreground / midground / background separation;
- large / medium / small rock grouping;
- vegetation should break/overlap architecture and terrain edges rather than stop as a clean sticker boundary;
- roots/exposed earth must visibly explain support;
- negative space must remain navigable/readable;
- source/world setup donors also preserve coast-aware placement, beach transitions where useful, authored prop clusters and atmospheric depth.

**MVP visual gate:**
Every placed/generated prop, rock, tree, landmark or building must prove:
1. surface snap/contact is physically correct;
2. silhouette/grouping fits the scene hierarchy;
3. local terrain/vegetation/material transition makes it look embedded rather than pasted on;
4. spacing/negative space remains readable from third-person gameplay distance;
5. the result passes Claybound Compatibility.

This is a design/QA rule, not permission to create a second terrain or decoration system.

### N4 · Environment Atlas · useful but incomplete corpus

PR #353 preserves a broader Environment/Kit lineage:
- S11 Hex Realm;
- S12 Hex Tile Model;
- S13.2 Dungeon;
- S18/S19 Plant Prop + EyeRig;
- S20 Sample Atlas;
- S21 Room Study/editor;
- S22 wall/editor direction;
- documented S14–S17 Bits/Space Base/Restaurant/placement grammar.

Important limitation:
- the actual S14–S17 runtime/project source was **not found** in the lean exports;
- current instructions explicitly forbid reconstructing it from prose.

MVP consequence:
- do not make the missing S14–S17 placement grammar a hidden dependency;
- reuse only source-proven Environment Atlas modules;
- if the missing full export is recovered before the One-Shot and offers a clearly better proven placement rule, classify it then.
- Environment Atlas recovery itself is **not an MVP blocker**.

### N5 · ChatterBox is not yet "finished runtime"

PR #357 is **HOLD · TUNE DONOR**, not production-complete.

KEEP:
- real pinned Resident GLBs;
- deterministic ChatterBox kernel/pools;
- Triplet stagger + valid silence;
- social calls;
- Review/export concepts.

Still required before claiming the real MVP seam:
- existing EyeRig v6 + PetMouth on the real 3D Residents;
- no PNG/cutout fallback in the integrated presentation;
- canonical real Card front, not coded placeholder artwork;
- consumer/import/export and occlusion/mobile checks as applicable.

MVP consequence:
- ChatterBox remains **MVP REQUIRED**;
- but integration must use the real current owners and must not promote the TUNE donor wholesale.

### N6 · Audio is more integration-ready than the older census wording implied

PR #365 current status:
**AUDIO_MODULE_TECHNICAL_GREEN · NO_WORLD_WRITES · NOT_HUMAN_ACCEPTED**.

Runtime-verified families now include:
- C Cozy Base · 81 BPM · 10 stems;
- M Island Life · 112 BPM · 10 stems;
- N Dusk/Night · 70 BPM · 11 stems;
- O Discovery/POI · 82 BPM · 9 stems.

The Audio-owned module:
- accepts injected existing AudioContext/SCORE destination only;
- creates zero AudioContexts;
- exposes serialized world context/events;
- preserves TTS ducking authority;
- passed real browser decode/alignment/fallback evidence.

MVP consequence:
- **MVP REQUIRED and HIGH-CONFIDENCE INTEGRATION INPUT**.
- Island runtime should implement only the tiny World-owned context/event adapter.
- No duplicate BPM/stem tables or Audio graph in WB2.

### N7 · Motion and Fluff status must stay distinct

Motion PR #344:
- source policy/baseline exists;
- native KayKit locomotion first;
- but its own brief explicitly excludes browser-controller tuning, runtime jump trajectory and World/Travel integration.
- Therefore it does **not** prove the Island P0 locomotion experience.

Fluff Work PR #356:
- 17 Medium + 13 Large clips;
- no new clip required according to the Blender pass;
- next gate is runtime consumer proof.

MVP consequence:
- locomotion remains a hard P0 runtime/product gate despite Motion source readiness;
- Fluff Work is a valuable optional/strongly-include activity donor, but only if the MVP actually consumes it.

### N8 · Historical/Narrative presentation inputs

Prepared but not automatically required:
- Historian / Chronicler authoring direction;
- narration/reaction curated pack;
- Living-Toy event grammar;
- Sound Words / Bubble / Emanata visual packs.

Recommended MVP treatment:
- **do not make Historian narration a new required runtime system**;
- do use the dialogue/text-scarcity/group-witness rules as authoring QA for Resident/ChatterBox;
- use Bubble/Emanata/Sound-Word packs only if the current real presentation owner can consume them without opening a new design subsystem during the One-Shot.

## O · New anti-loss freeze rule

Before the Island One-Shot brief is issued, the Integrator input ledger must contain explicit rows for:
- Quote Pool → Billboard/HyperNormalisation content;
- Style Reference subset used for the island's actual visual problems;
- Environment grounding/cluster/transition rule;
- real ChatterBox tune requirements;
- current Audio technical-green module;
- Motion source readiness **separate from** locomotion runtime acceptance;
- Curtain;
- Clay Transform/UFO donor;
- Prototype Graveyard negative Goldens.

A generic label such as "media", "style", "animation" or "environment" may not silently absorb/delete these distinct inputs.


## P · Flight / multimodal travel / vehicle-physics correction

Georg promoted Flight back into the Island product direction. This must reuse the existing Travel/Mech lineage rather than start a new movement system.

### P1 · Existing Flight donors are real and complementary

**Travel Flight owner**
- existing Travel Globe `carpet.js` + `flight-controls.js` + `camera-rig.js`;
- owns Flight world position, heading, speed, bank, pitch, altitude relative to terrain, drift, hover and Flight-camera relationship;
- accepted Ground→Flight bridge pattern keeps one active movement writer;
- accepted product timing: first Space remains immediate Ground jump; second fresh Space within **400 ms** requests Flight.

**Seed World / Combat Mech donor**
- `sw-mech.js` already proves walk / air / flight modes and Double-Space take-off as a POC;
- current POC also has Minigun/Rockets, weapon FX, combat camera option and bounded destruction;
- Open-World integration doc already classifies its flight mode as **DONATE** to the existing WB2 player owner, not a second controller;
- mech actor becomes an actor profile, not a new movement owner.

**Travel presentation / kinetics donors**
- Travel flight-state seam already exposes speed, acceleration, turn rate, bank, pitch, yaw rate, climb, boosting, gust/impact/touchdown facts;
- existing Speed Lines / Contrails donors exist in Travel;
- Vehicle/Flight Deformer work explicitly treats these as presentation consumers of Travel state, not physics owners.

### P2 · Island MVP Flight contract

**MVP REQUIRED representative Flight seam:**
- same avatar can move Ground → Flight → Ground in the same bounded island runtime;
- first Space = Cartoon Jump;
- second fresh Space within the accepted 400-ms window = Flight request;
- exactly one movement/camera writer per mode;
- Flight supports at least take-off, forward flight, climb, descend, hover, boost, bank and safe intentional landing;
- Surface Truth remains height/support authority;
- Flight must work for world inspection from above and must not create a second terrain/world coordinate system.

**Current Georg equipment direction:**
`Actor → Equipment/Backpack → Flight Capability → actor-specific Presentation`.

The backpack/flight gear should allow ordinary compatible characters to gain Flight independently of a Surf Card, bathtub or other special vehicle. It is a capability/equipment layer, not a new Flight physics owner.

**MVP STRONGLY INCLUDE presentation:**
- readable backpack/propulsion device;
- propulsion/thrust VFX;
- coherent propulsion/boost SFX through the existing Audio owner;
- speed lines / contrails at speed;
- body pose reacts to bank/pitch/boost.

**TUNE / MAY FOLLOW AFTER BASE FLIGHT:**
- richer Blender-authored cruise/climb/dive poses;
- stronger bank reaction;
- barrel-roll choreography;
- character-specific secondary motion;
- special flight carriers such as Surf Card / bathtub.

A barrel roll or perfect character-flight acting must not block the first valid Ground↔Flight consumer if the core flight feels coherent and safe.

### P3 · Vehicle physics status correction

Joyride/Drive remains **MVP REQUIRED**, but its current physics is **KEEP + TUNE**, not accepted-final.

Known product note from Georg:
- basic vehicle feel is already useful;
- steering, collision and recovery/continue-driving behavior are not fully clean.

First Island MVP minimum:
- enter/exit;
- accelerate/brake/reverse/steer reliably;
- collision must not trap, tunnel or corrupt mode ownership;
- recovery from ordinary contact must allow continued driving;
- one representative road/bridge/race loop works with normal input.

Handling polish may remain TUNE if it does not break traversal, collision integrity, camera or the product critic. A severe collision/recovery defect remains an acceptance blocker.

### P4 · Seeded procedural buildings / street-map grammar

Seed World donor contains:
- deterministic warped street grid;
- blocks/parcels;
- stable BuildingRecipe IDs;
- buildings oriented to streets with entrance side facing access;
- street graph exportable as Track-Core RouteRecipe intent;
- LOD0–3 shell/deformation/façade semantics;
- compact 2-bit destruction state donor.

Integration rule:
- **ADOPT/DONATE the data/grammar, not its second world/terrain/road renderer**;
- Surface Truth supplies height;
- Track Core builds roads;
- Joyride presents roads;
- near-field source-proven/Claybound-compatible buildings remain preferred;
- procedural shells are useful for far LOD, destructible stand-ins, sparse surreal structures or a bounded settlement provider only after the Claybound Compatibility Gate.

For the first Island MVP, long city blocks remain unnecessary. A small number of procedural structures may be used if they improve the scene and pass the visual Golden; they are not required merely because the generator exists.

### P5 · Inter-island travel contract

Preserve three eventual travel choices:
1. **Portal** — neutral materialize/enter/return seam;
2. **Track / Joyride Highway** — authored Track-Core connection;
3. **Free Flight** — player-controlled Flight between island-local spaces.

Architecture now should not hard-bind an island to only one travel method.

First single-Island MVP:
- prove Flight locally;
- preserve a port/portal/connection contract;
- do **not** require a second island just to prove the first Island MVP.

First multi-island expansion:
- prove at least two of the three travel methods against the same island/document identity and local-frame handoff;
- the third remains additive, not a parallel universe runtime.

### P6 · Combat / destruction relationship

Existing Mech weapons/destruction are valuable donors but full Combat remains outside first Island MVP acceptance.

**MVP OPTIONAL PROOF / STRONGLY PRESERVE SEAM:**
- one harmless target/prop transfer or bounded destructible object may prove shared event/state integration if low risk.

**LATER:**
- full Minigun/Rocket combat loop;
- enemies/health/rewards;
- full destructible settlement sandbox.

Do not let Combat ownership leak into the World player, persistence, terrain or Flight owners.


## Q · Preserved Sky / Weather / Time / Travel FX donor stack

This is **preserved capability inventory**, not a new REQUIRED row. The existing frozen requirement **F-R24 · Sky / Environment** remains the single MVP acceptance row and keeps one Environment owner.

### Q1 · Travel Globe environment stack

Source-proven Travel modules already exist for:
- `sky-presets.js`;
- `day-night.js`;
- `sky-atmosphere.js` → Aurora + God Rays;
- `lens-flare.js`;
- `rain-overlay.js`;
- `starfield.js`;
- `weltstimmungen.js` / world moods;
- `sun-shadow.js` and `light-budget.js` as known donors that were **NOT_TESTED / not integrated** in the SKY1 return.

The SKY EnvironmentHost proof exposes:
- `setTime(day|evening|night|auto)`;
- `setWeather(clear|rain)`;
- `setShell(tiny|travel|spindle)`;
- `setMood(verdant|molten|frost|bone)`;
- fog;
- sun color/intensity/direction facts;
- Aurora;
- God Rays;
- Lens Flare;
- rain streaks;
- lifecycle/leak probes.

This is the preferred donor family for later time/weather/atmosphere enrichment. Extend the existing Environment owner; do not restart weather/day-night in WB2.

### Q2 · Skydome families already present

Preserve these as alternative presentation donors under the same Environment owner:

1. **TinySkies / Travel baseline**
   - radial/day-night sky path;
   - Travel atmosphere modules;
   - proven source lineage from the TinySkies port.

2. **Travel shader Skydome**
   - procedural variants S / A / Space;
   - static watercolor/night variants;
   - camera-following shell;
   - current source path includes `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`.

3. **Combat / Card Spindle**
   - real KFB Card-based sky shell lineage;
   - SKY3 candidate `spindle-sky.v5.js` / contract 0.3-candidate;
   - mantled card sky + tapered ends / palette/end-shader treatment;
   - useful surreal/Deck-specific sky option, not universal default.

4. **Shader/World Integration sky options**
   - existing world-integration donors include procedural shader, watercolor/static and realistic-three.js options;
   - they are choices inside one Environment owner, not separate runtimes.

### Q3 · Clay cloud family

Current source donor:
`media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb`.

SKY3 candidate:
- `kfb.sky.cloud-family/3-archetypes`;
- **13 variants / 6 archetypes**;
- donor-derived anatomy, not generic sphere clusters;
- shared Clay material / field logic and near-mid-far LOD.

Status:
**TUNE · not Golden**.

Known limits from the returned SKY3 evidence:
- no Cloud Golden exists yet;
- no K1/v8 parity proof;
- nighttime readability remains weak;
- performance depends strongly on screen coverage/fill rate;
- target-device/mobile not proven.

Therefore:
- preserve as strong candidate/donor;
- do not make this exact cloud family an MVP blocker;
- if used in first Island MVP, it must pass F-R19/F-R20/F-R24/F-R07 and the current Cloud visual/performance gate.

### Q4 · Travel / movement FX donors

Preserve for later Flight/Drive/environment presentation:
- `contrails.js`;
- `carpet-wake.js`;
- `drift-smoke.js`;
- `impact-dust.js`;
- Travel v16 `speed-lines.js`;
- boost/post-radial presentation donors where the receiving presentation owner accepts them.

These effects should consume real movement/environment state:
speed · bank · pitch · boost · altitude/AGL · contact/impact · weather.

They must not become physics owners.

Important evidence boundary:
the repository proves these donor modules exist. Exact reuse of each one for "low ground flyover particles" still needs source-isolated consumer audit; do not claim that semantic mapping merely from filenames.

### Q5 · Frozen-MVP treatment

**F-R24 remains REQUIRED:** one coherent real Sky/Environment owner must be integrated.

For the first Island MVP, the smallest valid proof may use:
- one strong day/environment state;
- coherent lighting/fog/sky;
- clouds if accepted/performance-safe;
- enough environment state to prove the real owner.

The following are **preserved for additive integration / later tuning**, not newly mandatory:
- full day/evening/night/auto cycle;
- rain screen overlay;
- Aurora;
- God Rays;
- Lens Flare;
- full weather system;
- Spindle sky as an alternate Deck-specific shell;
- all Travel movement FX simultaneously.

The One-Shot may include any of these when low-risk and source-ready, but their absence alone does not create a new RED row beyond the existing F-R24/F-R07/F-S03 contracts.
