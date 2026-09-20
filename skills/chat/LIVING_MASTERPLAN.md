# KFB Chat Production · Living Masterplan

Status: CURRENT LEAD PLAN
Updated: 2026-09-13
Owner: Georg / KFB

This document is the durable lead-level plan for the KFB ChatGPT/Astra + Claude Design production line. It is not an implementation SSOT. Project repositories remain authoritative for their code, current branches, tests and returns.

## Why this exists

Chats can end, lose context or move between execution environments. No chat may therefore be the only place where a product decision, owner boundary, next slice or recovery path exists.

The durable stack is:

1. `skills/chat/START_HERE.md` — router.
2. `skills/chat/REGISTRY.json` — what is current, legacy, superseded or unverified.
3. this Living Masterplan — cross-project priorities and sequencing.
4. tool/project nodes — where to go next.
5. the named project implementation SSOT — actual code truth.
6. current `WSA_START`, `MASTERPLAN`, `RETURN`, PR/branch and test evidence in that project.

GitHub state beats chat recollection when they conflict.

## Current production topology

### Lead / planning

ChatGPT Web with Georg owns product decisions, slice scope, owner contracts, donor selection, acceptance gates and cross-project sequencing.

### Execution

Astra Work owns implementation, tests, browser QA, PR/merge/deployment work only within the current project contract.

### Authoring / measurement

Claude Design and dedicated KFB tool sites may author, measure, preview and export configuration. They do not silently replace project implementation SSOTs.

### Shared memory

GitHub is the shared state and handoff bus. Chats do not depend on direct chat-to-chat communication.

### Shared intake

Cross-project coordination packages use the private production inbox defined in `INBOX_PROTOCOL.md` and `INBOX_REPO_BOOTSTRAP.md`.

Target repository:

`georg-doc/KFB-Production-Inbox` — private, currently `PROVISIONING` until Georg creates the empty repo once.

Structure:

`_inbox/<job-or-project>/...`

Processed packages move to:

`_inbox/archiv/<job-or-project>/...`

Each active job/project has one self-contained folder containing its briefing/docs/sources/manifests/returns. Inbox location never grants runtime ownership or SSOT status.

The older public path `georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/_inbox/` is historical staging only and should not receive new non-public coordination packages.

## Current priorities

### P1 · Travel MVP1 Bath Flight

Implementation SSOT: `georg-doc/KFB-Travel-Globe`.

Goal: FrizzleBob visibly flies the existing Travel Globe in the Bath while Travel remains the sole movement/camera/world owner.

Current acceptance work:

- final v16 FrizzleBob look must come from the Studio/profile contract, not guessed runtime tinting;
- black leather jacket and non-human-skin face presentation;
- Bath + Driver local lighting must avoid overexposure without changing accepted global Travel lighting blindly;
- Bath speedline/contrail anchors must sit on real vehicle-local rim/edge anchors;
- existing Card/Carpet trail anchors are also a known visual parity item, but broader world/VFX parity must not bloat MVP1;
- browser regression and Georg freeplay remain required before merge.

`F / interact` remains a known deferred baseline gap unless the Travel SSOT says otherwise.

### P2 · FrizzleBob Driver Profile v1

FrankenStein Studio v16 is the current actor/look/static-pose authoring owner.

Georg will visually author/approve the actual Driver look in v16. That accepted state should be persisted as a machine-readable actor profile instead of re-created from literals in each consumer.

Separate concerns:

- Actor Look profile: graft/head/face/eyes/material zones/finishes/wordmark/donor-eye state.
- Pose profiles: Bath Driver, Card Surf, Cockpit etc.
- Vehicle Fit profiles: seat/scale/contact/grip/trail-anchor measurements per vehicle.

Consumers read exported profiles; they do not become second look/pose owners.

### P3 · Tooling MVP T1 · FrankenStein Production Site

Publish the existing v16 implementation as the tool, not a greenfield rebuild.

Add a discreet Docs / LLM layer:

- START_HERE / SSOT / contracts / modules;
- current known issues;
- SOP and best-practice references;
- additive changelog;
- `llm-manifest.json` / `llms.txt` style machine-readable entry points;
- Actor Profile import/export;
- links to Asset Librarian, Animation Lab and consuming projects.

The site wraps and exposes current v16. It does not fork the actor system.

### P4 · Animation Lab

First pin the actual current implementation SSOT/site and promote the router node from `UNVERIFIED` only with evidence.

FrankenStein Studio decides/measures actor, look, rig and base/static pose. Animation Lab consumes that state for clip playback, audit and dynamic motion authoring.

Load `skills/kfb-cartoon-animation_v2.md` for animation/motion work unless the registry supersedes it.

Card Surf base pose should be made geometrically sound in Studio first, then animated in Animation Lab.

### P5 · TinySkies Visual Parity + KFB World Mood

This is a later dedicated visual/world slice, not part of Bath MVP1.

Benchmark `dannylimanseta/tinyskies` against current Travel for:

- vehicle contrails and screen-space speed lines;
- coastline contours, foam and sparkle;
- sky gradients, fog and lighting rig;
- atmosphere, rim, stars, aurora, god rays, lens flare and related VFX;
- intentional KFB deviations versus accidental drift.

Planned KFB extension: deck/JSON-seeded coherent world moods for the 56 cards + cover. Global deck mood should drive a harmonized palette/family, while local biome fields drive spatial variation, props and later NPC/enemy preferences. Mood and biome remain separate axes.

## Future connected-world concepts

### KFB Infinite Canvas / Museum · portal-entered instances

Status: `PRODUCT CONCEPT / FUTURE`, not current implementation scope.

Core idea: the Travel/Overworld terrain may contain portals, holes, doors or other spatial entry points that lead into separate game/content instances. The instance owns its own internal runtime; the outer world only owns the entry/return transition and does not absorb the inner runtime's responsibilities.

Planned instance families include:

#### Combat Arena instance

A terrain portal/door/hole may enter the existing Combat Arena as a separate instance.

Possible vertical/world structure inside the Arena:

- level elevator / platformer progression;
- paternoster-style vertical circulation;
- spindle / rotating central structure;
- skydome gallery as a layered or vertical exhibition/combat space.

Combat Arena remains its own implementation SSOT and combat/runtime owner. Travel/Overworld only provides the gateway and return seam.

#### KFB Museum / Infinite Canvas instance

The museum organizes KFB content as rooms and levels, especially decks/cards, while preserving the idea that semantic/content relations can become spatial transitions.

Planned spatial grammar:

- one deck may map to one room/level cluster;
- cube/dice logic may organize rooms fractally;
- a page/room may expose four walls;
- each wall may present a 2×2 card arrangement, yielding four cards per wall/page surface;
- card selection may transition into a dedicated 3D Card Viewer room;
- the Card Viewer should reuse/adapt the existing 3D rotation/view logic from Georg's earlier `KFB Time Capsule` work rather than rebuilding equivalent interaction from scratch;
- `KFB Time Capsule` is currently a donor reference by product name only; exact source/path/revision must be located and pinned before reuse is claimed.

The Museum should be treated as a KFB-specific Infinite Canvas rather than a conventional gallery: decks, cards, rooms, cube/fractal nesting and portals are one navigable structure.

#### Museum game mode / night state

A later game-state variant may allow Combat enemies to appear inside the Museum at night.

This must remain an explicit mode/encounter layer rather than silently turning the Museum runtime into Combat Arena. Shared enemies may be reused from Combat, but enemy AI/combat semantics stay with their established owners/contracts.

Potential split:

- daytime / explore mode: museum, decks, card viewing, discovery;
- nighttime / game mode: selected Combat enemies enter the Museum instance;
- transitions preserve Museum content/navigation ownership and reuse Combat-owned enemy/combat behavior through a defined adapter rather than duplication.

#### Portal / instance contract direction

Future implementation should prefer a small generic gateway contract instead of merging runtimes:

`outer world gateway → instance load/enter → instance-local runtime → return/exit → outer world resume`

Likely shared data: instance ID, entry transform, return transform, seed/world/deck context, selected card/deck context and explicit handoff payload. Movement, combat, cards, camera and scene ownership remain singular inside each active instance.

First proof should be one small vertical slice, not a generic metaverse layer: one terrain portal into one existing instance, clean return, preserved state.

### Backlog donor · KFB Comic Card Deck Viewer v4

Status: `CURRENT DONOR / FUTURE EMBED-MODULE CANDIDATE`; not yet a shared runtime module.

Source:

`georg-doc/kayfabizarro/KFB Comic Card Deck Viewer v4 (WS0)/`

Verified capabilities from current docs/history:

- embeddable + standalone deck/PDF viewer for KFB/MedKayfab 2×2 card-page decks;
- Reader, Gallery, Stack, Coverflow and v4 Full View;
- deterministic/arithmetic page-to-card layout rather than CV inference;
- current deck corpus and metadata pipeline are already separated from the viewer presentation;
- v4 retains a standalone export path while pdf.js/deck corpus remain network-loaded;
- older v1 branch exposes `KayfabizarroViewer.mount(el, opts)` and headless `.loadDeck(opts)` as an existing module/API donor.

Planned reuse:

- **Travel:** deck/card viewer as an overlay, portal-room or museum/content instance reached from world cards/portals;
- **Combat:** inspect/review collected cards, deck rewards or gallery content without rebuilding a second card reader;
- **Museum:** use the existing 2×2 page semantics and viewer logic as content/presentation donor, while the 3D museum owns spatial room/wall placement;
- **DocCheck:** adapt presentation/design tokens and content source to DocCheck/MedKayfab while preserving the viewer's proven page/card parsing and interaction contracts.

Important boundary: the mature v3/v4 viewer is primarily CSS/Canvas/pdf.js, not a Three.js room. Reuse its deck parsing, views, interaction and module seams instead of trying to turn the existing viewer itself into the museum's 3D scene. 3D room ownership remains with the consuming instance.

Before promotion to a shared module: pin the exact reusable branch/API, verify browser embedding in Travel and Combat hosts, and separate KFB/MedKayfab design skin from viewer core where that seam is real rather than inferred.

### Backlog donor · 3D Conspiracy Iceberg Explorer

Status: `UNVERIFIED PROJECT / STRONG 3D DONOR`; future KFB Conspiracy Deck instance candidate.

Source:

`georg-doc/kayfabizarro/travel/3D Conspiracy Iceberg Explorer/`

Verified donor capabilities from its current documentation:

- Three.js 3D iceberg world with seven depth tiers and 159 content entries;
- content clustering/categories/status/absurdity plus a curated 28-stop tour;
- underwater depth atmosphere, bubbles/marine snow, fog and camera light;
- deterministic node picking, viewport culling and label decluttering;
- view-agnostic scene contract around `goToAnchor`, anchors and interaction state;
- standalone build, schema/docs and a dedicated `AtmoEngine` whose sound changes with depth;
- recursive related/ghost/rabbit-hole content model already exists as a navigation donor.

Planned KFB reuse:

- treat a Conspiracy Deck or clustered conspiracy corpus as an explorable **iceberg instance** entered through a terrain portal/hole rather than flattening it into the main Travel runtime;
- preserve the existing cluster/tier/depth metaphor as the main spatial grammar;
- allow Travel to supply the entry/return seam and world/deck context while the Iceberg instance owns its own scene/camera/navigation while active;
- later introduce an actual submarine/underwater vehicle as an instance-local presentation/locomotion mode rather than embedding submarine physics into the outer Travel owner by accident;
- reuse the depth/atmo concept for a stronger descent loop, but re-audit rendering/Three.js assumptions before any production import because this donor currently documents Three.js r128 and Claude/DC-specific runtime history rather than current Travel's runtime contract.

### Animation Lab backlog · Swim / underwater locomotion

The Iceberg/submarine direction creates a concrete multi-consumer need for an Animation Lab swim family.

Future animation scope should cover KayKit-compatible characters/rigs through reusable motion profiles, for example:

- swim idle / tread;
- forward swim;
- dive / rise;
- turn / bank underwater;
- brace / grab / cockpit/submarine variant;
- optional buoyant follow-through for ears, coat, held prop etc.

This belongs to Animation Lab / `kfb-cartoon-animation` motion ownership, not to the Iceberg scene code. Start from actual available KayKit clip/rig data and current actor profiles; do not assume one skeleton/clip set covers every character until verified.

A good first proof would be one current rigged KayKit character swimming convincingly inside the Iceberg instance, then generalize only after the clip/rig seam is proven.

## Booted / parked consumers

### DocCheck Wissens-Pilli / Interactive Microlearning

Status: `UNVERIFIED` project intake. Not an active Travel slice.

Current intended destination:

`georg-doc/kayfabizarro/micro-learning/wissens-pilli/`

Current source package is still in historical public staging:

`travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`

After `georg-doc/KFB-Production-Inbox` exists, migrate that complete job folder to:

`_inbox/DC MicroLearning WS1/`

The source package establishes a reusable DocCheck medical microlearning direction and a Studio-preparation slice for CapsuleCarl. FrankenStein Studio prepares/exports the actor; the learner runtime owns cards/scene/interaction; Animation Lab is a later motion consumer. No FrizzleBob measurements may be copied into CapsuleCarl merely because the actor vocabulary is shared.

Before implementation starts, promote the project only after its actual runtime/SSOT/start/return contract is created and pinned. See `skills/chat/tool-nodes/wissens-pilli.md`.

### Combat / Stunt

Combat Arena and Stunt Race remain independent implementation SSOTs and consumers of the shared router/skills. They are not merged into Travel. Re-activate only with an explicit slice.

## Cross-project hard decisions

- Prefer coherent vertical playable slices over micro-slices and generic architecture.
- Never silently replace an owner or contract.
- Reuse measured donors before rebuilding.
- Tool sites and project repos reference canonical skills; do not duplicate skill bodies.
- Visible look/feel/timing requires Georg acceptance when the project/slice contract requires that human gate.
- Changelogs and living history are additive; corrections supersede rather than erase.
- Legacy under `skills/` is evidence/history unless the registry marks it current.
- Inbox packages are input/staging; they never become implementation truth by location alone.
- Every inbox job/project uses one self-contained folder; processed folders move to `_inbox/archiv/` with destination/return evidence preserved.

## Recovery

If the active lead or execution chat dies, do not reconstruct the conversation from memory. Follow `RECOVERY_PATH.md`.

## Sync

All active chats/agents should follow `SYNC_PROTOCOL.md`. A chat link is not a synchronization mechanism; the central router + project SSOTs are.

## Additive planning history

### 2026-09-13 · DECISION
`skills/chat/` becomes the shared current LLM production router for ChatGPT/Astra and Claude Design.

### 2026-09-13 · DECISION
A durable Living Masterplan and explicit Recovery Path are required so loss of a chat does not lose current sequencing or owner decisions.

### 2026-09-13 · DECISION
Combat Web and other consumer chats synchronize through GitHub state, not copied prompt bundles or direct chat-to-chat assumptions.

### 2026-09-13 · DECISION
Cross-project intake moves to a dedicated private repo, `georg-doc/KFB-Production-Inbox`, once provisioned. One folder per job/project; completed packages move to `_inbox/archiv/` rather than being deleted.

### 2026-09-13 · SUPERSEDES
The public Travel-mirror inbox is no longer the planned long-term shared inbox. Existing packages there remain provenance/history until verified migration.

### 2026-09-13 · CLASSIFICATION
DocCheck Wissens-Pilli / Interactive Microlearning remains an `UNVERIFIED` project intake. Its target path and source package are known; implementation/runtime promotion remains pending.

### 2026-09-13 · PRODUCT CONCEPT
Add KFB Infinite Canvas / Museum as a future portal-entered instance family: terrain gateways may enter Combat Arena or a fractal deck/card museum. Museum concept includes cube/dice nesting, 4-wall pages with 2×2 card layouts, a reusable 3D Card Viewer based on the existing `KFB Time Capsule` interaction once its exact source is pinned, and a later nighttime mode where Combat enemies can appear through a defined reuse seam rather than duplicated combat ownership.

### 2026-09-13 · DONOR / BACKLOG
Register `KFB Comic Card Deck Viewer v4 (WS0)` as a future shared card/deck presentation donor for Travel, Combat and the Museum, with a separate DocCheck/MedKayfab design adaptation path. Reuse parsing/view/module contracts; do not confuse the existing CSS/Canvas/pdf.js viewer with the 3D room owner.

### 2026-09-13 · DONOR / BACKLOG
Register `travel/3D Conspiracy Iceberg Explorer` as a strong future 3D donor for a portal-entered KFB Conspiracy Deck iceberg instance. Preserve its tier/cluster/depth/atmo/navigation ideas, but re-audit its older Three.js/DC runtime before integration. Add submarine exploration as a future instance-local mode and a corresponding reusable KayKit swim-motion family to the Animation Lab backlog.


### 2026-09-20 · INTEGRATION FOCUS
The scoped WSA/Astra integration cursor now lives in `skills/chat/workflows/WSA_MVP_CONSOLIDATION_2026-09-20/LIVING_INTEGRATION_MASTERPLAN.md`. It inventories current branch refs separately from the curated six-lane integration set: Combat/melee/Raid, Walk→Drive→Fly, Resident Zones/ChatterBox, shared in-place editor reuse, modular Environment Scene/Zone recipes, and Storytelling Maps. This central document remains the lead-level router; project SSOTs remain implementation truth.
