# KFB Cascade Sphere · Mech × OSM × Card-Maze × Fluff/Goo · WS0 Design Intake R1
**2026-10-28 · GEORG CREATIVE INPUT + SOURCE-BACKED DESIGN / PROPOSAL ONLY.**
**One design owner:** existing KFB_HUB / WS0 Game Design–Fractal Canvas concept lane, Draft PR #435 on planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19.
**Sole productive receiving game owner:** WS1/WS1b R3F game host; verify actual active workspace/branch before work. Combat Arena owns weapons/damage/enemies; OSM City Lab owns geodata/extracts; World/Track/Terrain own placement/contact; KFB Audio owns mixer/SFX; Asset Librarian owns identity; Cards/Almanac/PlayerSave own grants/provenance. Existing Mindspace/HyperNorm owns visual storytelling intent. No new runtime owner, new procedural world core, new combat system, or second Save/HUD/Audio mixer.
**Mode:** RESEARCH / DESIGN PERSISTENCE. No runtime implementation or publication authorized by this note. WB2 Four-Island R4 remains STOPPED / NO MVP; do not reopen it.

## 1. Georg's intent (author input, not yet technical acceptance)

- Reuse the actual *flying KayKit Combat Mech* and the Seed World Mech Destruction POC as a playable Actor, including its real spinning Gatling/Minigun and the Mystery-Series CombatMech_Axe.gltf (file and binary now located; mount, material and animation not visually/physically verified), plus current jetpack/flight animation and layered KFB Audio.
- Make a toy-like, satisfying, reversible **destruct / reconfigure / repair** loop: fire to remove specific clay building cells; use the arm/weapon-switch for **placement** of authorized parts from flight; optional grappling hook/swing/pull to reach roof nodes, with coherent contact and camera.
- Reuse real OpenStreetMap street networks, footprints and landmarks as a believable neighborhood/maze skeleton (e.g. Cologne Cathedral and nearby streets), height and terrain context where available, transformed via KFB sci-fi/Clay/Goo design into destructible toy-scale fiction. The original landmark and urban relations should remain legible.
- Send instanced colored little Fluff creatures/data packets (possibly eye-bearing cartoon balls) through streets/corridors as Tower-Defense-like streams. Protect constructive Fluff/traffic against invading enemies, Black Goo and Card Ink censorship; clean/restabilize infected lanes, sources, cards or buildings. Alternative existing legacy mystery/WhackMan opponents require their own source isolation.
- Reuse six actual KFB Story Modes as interpretive/Fluff color identities, not six arbitrary elements. Preserve D6 actual names (Tragic, Comic, Absurd, Heroic, Mystical, Forbidden), user choice/die optional, plus Quest-Die push language (+2/+1/0/-1) in a **proposed** derived digital progression that remains distinguishable from the analog Freestyle rules.
- KFB episode form: **1 Actor Card + 3 Scene Cards + 1 Quest Card**, cards collected/played and recombined into a scene/event/machine/route recipe. A technical node or agent/cascade signal may manifest as stylized in-world graph or flowchart detail, legible to experts without mandatory technical literacy.
- A warm/chill action-strategy experience playable briefly on phone by touch and on desktop with richer third-person flight; can sit as an authored/seeded **encounter instance or Mindscape Sphere** in the existing KFB Open World, with reliable entry, safe return and player-owned memory.
- Later extend by source-checked skins, seeded neighborhood variants, multiple game modes and a Qiva incident-replay dataset. Those are *later* options, not the first proof.

## 2. One satisfying smallest game: "CASCADE SPHERE / MECH RESCUE R0"

**Logline:** A colorful little company-city is invaded by dark ink-like process failures. The player pilots the real Combat Mech above its street-maze, shoots *selected* infected cells, rescues/redirects colored Fluff streams, restores one bridge/conduit using recovered Fluff, and sees one repaired passage become traversable. One authored real Card records an incident or changes the narrative reading. The city reacts; the player can leave and return.

**First build target: ONE 90–180-second encounter, one authored zone, one meaningful route fork, three interactive nodes, 2–3 threat waves max, one repair action, one success/partial/fail result.** Start with source-isolated *one* real street block/OSM corridor, not an entire 2.28 × 2.12 km Dom data set rendered at full quality. A coherent local interaction is more important than a broad map.

A. **Approach (10–20 s):** view from above or a roof perch: one meaningful civic/industrial destination, an interrupted colored stream, a visibly infected chokepoint, a nearby alternative passage. OSM street continuity explains the route.
B. **Act (30–70 s):** move/fly with existing owner, select one target; minigun impacts precise infected shell/cells; optional limited mode toggles between DESTROY and RESTORE, or one hand-placed prevalidated source-backed bridge segment. Avoid spray-delete of an entire authentic landmark.
C. **Cascade (15–30 s):** two or three small instanced Fluff agents follow existing route topology; one Goo agent or contamination wave threatens the junction. Damage and restoration change actual graph occupancy, yielding visible downstream consequences. Viewers can infer why the choice mattered with sound, traffic and material cues.
D. **Conclude (10–25 s):** route opens, one source-backed Card/quest consequence shown by existing Card surface, player/World save receipt through existing owners, re-entry preserves chosen node state. Alternative solutions remain possible (intercept Goo, open diversion, repair after destruction); no ideology quiz.
**Optional later:** first-person mode, grappling hook, axe melee, 6-mode full economy, large hordes, online/live Qiva, open-world free-flight across an entire metropolitan extract, full WFC all deferred.

### Why this is not just Tower Defense
- A **flight-enabled maker/destructor** is an active character, not a cursor in a turret map.
- A **physically readable topology** combines streets/height/bridges/portals, not randomly scattered tiles.
- Cards alter **cause/event/available action/interpretation** while preserving source-backed KFB Card identity.
- Players may observe, intervene, restore or explore freely. A saved local consequence survives; battle is not mandatory for all open-world access.

## 3. Concrete donor / owner matrix, with evidence classes

| Layer | Verified GitHub source | Status / scope |
|---|---|---|
| Mech + minigun + flight | Seed World POC sw-mech.js, SOURCE.json and RETURN.md in tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/ | Real KayKit CombatMech A/B, actual Minigun/Barrel pinned; standalone POC reports two switchable actor sources and flying destructible town. **Mechanism/actor donor only**, not a second WS1 player/Combat owner. A: flight gate-1 candidate; B: Atlas rigid pose. No fresh browser acceptance. |
| Destruction/reconstruction | Same donor: sw-destruct.js, sw-gen.js, sw-world.js, docs/INTEGRATION_OPEN_WORLD.md | Cell-level promotion, local collapse and 2-bit damage reconstruct after streaming reported in POC, 12/12 old checks. **Candidate**, known roof/rubble pop; World/Combat split and persistent override in owner required. |
| Current runtime | WS1 R3F branches, ws1/combo-r2 @15d672792f6974114818bcd4acd5a311f3b17c6e; ws1/r3f-frame @effefbd98b4611ba9b7b746d8d5fa272e9a3b468, WS1_STATUS.md §121 | Existing owner contains movement/flight/fluffSuck/harvest, billboard, dialog, save, terrain. Reported tests and perf are source reports, not new gameplay QA; WS1b latest local working tree is unverified. |
| Combat + action | Existing Combat Arena / Combat Mech family, WS0 V-514 BRIEF_WS1_FLIGHT_DESTRUCTION_R1 | ShotEvent→HitEvent fanout, 3 smoke bodies + 11 atlas sprites proposal budget; actual public owner acceptance for mech flight + weapons unproven. No second shooter controller. |
| Mech axe / grapple | Actual GitHub files: media/3D_Assets/KayKit_Mystery_Series6/1 - July 2024 - Combat Mech/assets/gltf/CombatMech_Axe.gltf and CombatMech_Axe.bin (directory listing on main); grapple no verified runtime donor | **Axe source AVAILABLE; fit / mount / animation NOT VERIFIED**. Source-isolate the true original axe before weapon switching. Grapple remains SOURCE_REQUIRED and a later movement/contact/physics extension under existing owner. |
| Fluff/Goo/Card Ink | WS0 decisions V-368/369/371, V-405 ACK post-MVP, V-531/532/533, PR #400 and #435 source alignment | Six types are planned; code paths for harvest/suction exist. Goo color recovery q103 STILL OPEN; no invented mapping/stats. Single Wallet/Card/Almanac/WorldSave. |
| Maze | WhackMan v1.1 wm-maze.js, wm-recipe.js, wm-pursuers.js | Actual graph/pathfinding/tunnel/gate donor. WhackMan export **not self-contained** and its 17×15 recipe is authored/static; reuse graph algorithms only through an adapted owner interface, not its scene/controller. |
| Real urban footprint | tools/osm-city-lab/START_HERE.md + README.md, data/dom-zentrum-v0/SOURCE_SPEC.json, CLAUDE_CONTEXT.json, normalized.json | Dom/Zentrum cached **145,967 elements, 5,236 roads, 6,351 buildings, 2,279.652×2,115.070 m**, source IDs and normalized local metre frame. First sample must extract an **actual** smaller walkable/defensible subset with streets/landmark context; OSM does not prove target-world collider or maze pathing. |
| Later OSM/world composition | Draft PR #447 planning/kfb-procedural-world-composition-wfc-osm-2026-10-24; OSM City Lab consumer scenes, Track Core, Landmark overrides | Preserves local geographic truth + source attribution; placement as one KFB zone with independent world transform. WFC optional for authored transition, not city street truth. Heights/terrain from explicit source first, fallback tagged as inferred. |
| Factory / maker look | Asset Registry: kenney-prototype-kit 74 registry entries; kenney-factory-kit-3-0 148; kaykit-blockbits-1-0-free 44; KayKit dungeon / Mystery | Registry presence **not image/fit proof**. Asset Librarian selects each exact GLB/GLTF; show single donor object alone, with model dimensions and actual materials/Clay, then one staged composition; no substituted generic boxes/chrome. |
| HyperNorm / sphere | Draft PR #448 corrected R5 Inner Sphere→Gutter, #450 H13 art, current HyperNorm Curator; existing KFB Audio Site | **Authored environmental wrapper** for later; must be visually isolated first. Preserve current Sphere storyline and Gutter and their existing owners. Not a new renderer or forced opening replacement. |
| Flight/destruction sound | Audio PR #428 audio/flight-crash-r1-2026-10-18, source-backed same private Audio Site | Prepared layered flight/impact/contact cues; actual in-world Mech hit/contact is not yet proven. Existing AudioContext / buses / ducking remain sole owner. |

Reference public OSM: https://www.openstreetmap.org/copyright ; https://wiki.openstreetmap.org/wiki/S3DB . ODbL attribution/redistribution review and provenance manifest are mandatory before published derived city data. Do not query Overpass at runtime: use OSM City Lab's cached normalized data.

## 4. Architecture: make one small bounded instance, not a second world

**Plan-only seam:** existing WS1/World host enters a bounded encounter by stable scene/instance ID, seed, source-provenance, actor loadout and safe-return; the receiving host owns the active camera, movement and rendering. Encounter-specific pure state computes **graph occupancy, node effects, wave schedule and quest outcome**. Existing Combat owns shot/hit/health, existing World/Save owns persistent changes. One-bridge adapter translates events to isolated effects and a stored result receipt. The encounter MUST NOT install parallel movement, Combat, Audio, physics, Card grants, camera or timer owners.

- **Source graph:** OSM roads/junctions and validated authoring overrides → walk/flight/ground navigation topology; WhackMan BFS donor only where topology contracts match. OSM street shape is **geometry evidence**, not automatically a compelling maze, accessible roof route or tower-defense lane.
- **Visible layer:** accepted GLB buildings/Factory/Prototype/BlockBits and sanctioned KFB Clay material; optional Goo infestation material authored as a *separate overlay/state*. Physical colliders/support surfaces remain authoritative and cannot silently follow decorative warp.
- **Build/destruct:** shooting only modifies designated destructible **KFB adaptation cells** keyed by stable OSM building/scene IDs. Exact heritage/landmark source should remain recognizable. Alternate channel to place/restore a **validated** module at an existing snap/socket; no unrestricted midair arbitrary mesh placement. Preserve occupancy, dynamic colliders and player safety; undo/reset locally during testing.
- **Flight:** existing WS1 actor/motion mode. Overflying a street maze ≠ trivial victory: objectives anchor to constrained process nodes, limited ammo/charge/time *where justified* and readable consequences, without artificial invisible ceiling. Add grapple only after collision/camera/anchor and stable frame tests.
- **Mobile/desktop:** mobile start with isometric tilt and large touch targets; tap target, hold to fire (optional), swipe to orbit, one mode-switch, two card slots visible. Desktop can use current movement and optional third-person flight with 1–2 meaningful tools. Cross-device action semantics identical, UI owned by host; no second joystick/key router.
- **Scale is not "only scaling":** local Cartesian meter frame vs large Earth coords/floating precision; terrain heights and building bases, near/far LOD, clip/culling, projectile travel/contact, flight camera, AI budget, mobile GPU, scene streaming, save identities and portal return all require receiving-owner integration QA. Prefer one bounded 100–300 m neighborhood sample **as a candidate, not a required measured radius**; honor local OSM origin and original geometry dimensions.

## 5. Fluff flow / six Story Modes / Quest Die: proposed formal game semantics

The six D6 modes are the **existing** Tragic, Comic, Absurd, Heroic, Mystical, Forbidden; no arbitrary new named modes, no assumed historical Heim-color correspondence. Use official Fluff colors only after WS0 source table and q103 decision are read. For first build, **one constructive stream + one Goo contamination threat + 1–2 legible variants**, not six simultaneous anonymous colors.

**Proposed finite variables (do not promote as KFB canon or balances):**
- packetsSpawned, packetsArrivedByValidatedRoute, packetsLost, contaminationAtCriticalNodes, stabilizedNodes, actionsUsed; all counted as distinct authoritative events, not VFX particles.
- Success candidate: a defensible route reaches a named target with **arrivals/eligibleSpawn >= chosen scenario threshold** and its critical node is no longer contaminated. Choose threshold only after watching a real run; zero denominator means UNKNOWN, never 100%.
- **Quest die**: proposal derived from existing +2/+1/0/-1 pushes, but pushes reflect one or two **verified world events** (e.g. route restored, genuine arrival, catastrophic loss) rather than subjective scores masquerading as formal truth. Clamp to official die domain only once KFB Freestyle semantics are checked, do not claim the game's exact die threshold or finale semantics were copied automatically.
- Actor Card identifies agency/loadout; three Scene Cards provide source-owned node/world events and one Quest Card names the objective. For first prototype, actual *source-pinned* art/provenance if cards are used; optional concept-only technical cards ("Retry Storm", "Blocked Queue", etc.) require WS0 editorial authorship and cannot pretend to be existing KFB registry Cards.
- Goo and censorship are **two separate state domains**: operational infection/obstruction vs visible ink occlusion of Card/media. A cure must reveal actual card content via existing Ink/Card owner, not mint/fake art. Make Goo reversibility easy in Chill, hard-mode escalation optional later.

## 6. Scenario seed / Qiva link without gameplay dependence

One canonical **replay dataset with separated factual/synthetic provenance** can eventually feed both:
1. KFB player-facing event/maze configuration that dramatizes causes and consequences;
2. Qiva's own signed webhook replay through its existing ingestion/query/shadow modes, evaluated separately from game-only flourishes.

Qiva has a 24-day synthetic simulation report but no game connector in this KFB scope. No live company telemetry, enterprise access or shared user data. The player's actions and cinematic FX are *not* evidence that Qiva predicted or diagnosed an event. Later industry-themed cards/nodes should only be introduced with the owner's deliberate approval.

## 7. Smallest implementation order and explicit anti-scope fence

**Cheap WS0 first:** create a source plate of **three actual isolated donor objects** (Mech + Minigun; one real Factory/Prototype/BlockBits piece; one accepted OSM City Lab street/building cluster) and one original Card. Explain which donor dimensions are proven and where source/fit is unavailable. Then draw ONE source-faithful 90–180 s playable flow: approach → inspect → shoot → stream diverts → restore → result → safe return. Separate actual implementation, donor candidates and deferred imagination.

**Then only if WS0/Georg authorizes a runtime receiving slice:** WS1 lead pins active branch and host API, tests actor movement and single existing weapon vs one destructible cell; admits a minimal one-junction/one-packet wave and one repair socket; obtains actual mobile and desktop visible evidence; one save/reload proof and safe return. Full metropolitan OSM and sphere shell only after bounded street-zone proof. Combat Arena provides authoritative hit channel; do not splice POC sw-mech second player root into WS1.

**Deferred not first POC:** mounted energy axe (actual asset located, fit/clip unverified), grapple physics, FPS shooter, large instanced hordes, six-mode competitive economy, fully dynamic street replanning, full-town free destruction, automatic 3DGS sphere, deep Qiva API integration, multiplayer or procedural open-world redesign.

### Acceptance candidates for one later first playable WS1 test (no tests run yet)
- Scene uses original isolated Mech/Minigun + ≥1 real technical kit asset + real OSM excerpt with provenance; screenshot from actual runtime, no generic replacement.
- A single routed packet group physically arrives or fails because one source-owned route node changes. Replay with same seed and same action schedule yields equivalent logical outcome; VFX may vary.
- One targeted destructive hit removes exactly the intended cell and updates route/support truth; one repair action restores one valid socket, preserves local save after fresh load; other buildings/landmark geometry unaffected.
- Flight stays under one movement/camera owner; mobile touch hit targets and desktop keys do not conflict.
- Source-bound Card/Quest receipt via existing PlayerSave/Almanac (if grant is in scope), with one idempotency check.
- Audio/visual impact is one bounded cascade with measured p95 update/perf on target visible device; no unsourced 60 fps claim.
- Interaction readable/fun in one contiguous 90–180 s clip and one fresh-reload state comparison; WS0 independent review and Georg actual product choice only after working integrated scene.

## 8. State, route and one next gate

**State:** proposal documented; source files inspected, **0 new unit/gameplay/browser/GPU/visual donor isolation tests**, **0 new runtime code**, **no accepted new 3D object**, **no Stage URL**, **no Site publication**. Existing Seed World old 12/12 and Audio old test counts are historical claims, not this document's tests.

**Router / Hub:** this document lives in the existing KFB_HUB WS0 replies lane and is a source-facing review artifact, not a new Hub product card or playable Stage route. Update existing PR #435 metadata and branch-local router pointer for discovery, leave shared production Hub live metadata unchanged until there is a genuine visible acceptance milestone.

**ONE NEXT GATE: WS0_SOURCE_ISOLATION_AND_RECEIVER_TRIAGE** — WS0 checks current WS1b actual receiving owner/source, visually isolates the real Mech+Minigun, one Factory/Prototype/BlockBits source object and one OSM street cluster, and chooses a single meaningful 90–180 s Mech/Fluff/Goo node event, annotating KEEP/ADAPT/REJECT/SOURCE_REQUIRED. Only then can a later explicitly authorized WS1 gameplay slice begin. No automatic merge, Live promotion or WB2 reopening.
