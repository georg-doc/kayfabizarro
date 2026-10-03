# KFB Site / God Mode / Lean Memory architecture · 2026-10-04

Status: **CURRENT MVP ARCHITECTURE · GITHUB PERSISTENCE OF PRODUCTION-CONTROL v1.5–v1.7**
Receiving runtime owner: **KFB WorldBuilder / WB2**
Authoring surface: **KFB World Site / God Mode**
Release model: **Stage / Live manifests**
Persistence: **explicit owner-backed store; ChatGPT conversational memory is non-authoritative**

This file materializes the Site-only planning records so a fresh WSA/Codex session can recover the architecture from GitHub alone.

Read with:
- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `WSA_RESIDENT_ATLAS_MVP_INTAKE_2026-10-04.md`
- current WorldBuilder PR #332 Recovery/Return
- current Motion PR #344 Return

## 1 · Product model

KFB should become one continuously usable/playable world surface rather than a sequence of disposable Web-chat demos.

Separate five layers:

1. **Runtime code** — stable protected owners.
2. **World content/configuration** — versioned modules and recipes.
3. **Player/world state** — savegame / Lean Memory persistence.
4. **Authoring control** — God Mode, Scene Composer and World Director chat.
5. **Release channels** — Stage vs Live manifests.

The world boots from a pinned release manifest, never from “whatever is latest” or chat recollection.

## 2 · Stage / Live

Recommended model:

- `live/current` = last-known-good manifest.
- `stage/current` = same Live base + explicit candidate overlay.
- optional named Stage snapshots.
- promotion changes only selected accepted manifest references.
- no partial promotion.
- rollback pointer always preserved.

Stage and Live use the same schemas and runtime family. Runtime code differs only when the named candidate is itself a runtime-build test.

## 3 · Module registry

Versioned module families may include:

- WORLD_RECIPE
- BIOME_PROFILE
- LIGHT_PROFILE
- SKY / WEATHER_PROFILE
- AUDIO / JUKEBOX_CONTEXT
- SIGNATURE_ANCHOR / MODULE
- RESIDENT_SET / RESIDENT_ACTIVITY
- TRACK / TRANSITION recipe reference
- PLANET / WORLD_GRAPH_NODE
- ATTRACTION / INSTANCE
- MEDIA / CARD SURFACE
- MINI_SCENE_MODULE

Each version records:
- stable ID;
- version / schema;
- owner;
- exact source/provenance;
- dependencies;
- compatibility;
- status: DRAFT / STAGE / ACCEPTED / LIVE / QUARANTINED / ARCHIVED;
- validation result.

## 4 · Change classes

### CLASS 1 · Data-only / hot-loadable
Examples:
- palette / existing light parameters;
- audio/Jukebox weighting;
- seed / density;
- world biography;
- existing biome combinations;
- moving an anchor;
- existing Resident slot;
- world-graph node using the existing contract.

Path:
God Mode → validate → Stage → Georg acceptance → manifest promotion.

No WSA runtime integration required.

### CLASS 2 · New module, existing contract
Examples:
- new biome profile;
- new Resident scene module;
- new authored attraction exposing Anchor Contract;
- new destination recipe.

Path:
source authoring → package registry → validation → Stage → acceptance → promotion.

WSA only when compatibility or cross-owner packaging actually requires it.

### CLASS 3 · New runtime capability / contract change
Examples:
- new destruction runtime;
- new persistence schema;
- new transition type;
- new physics owner capability;
- network/multiplayer;
- world-owner shader/runtime change.

Path:
bounded branch → CI/browser → Stage runtime candidate → Georg → WSA/Codex reconciliation.

## 5 · Site-hosted control plane

God Mode chat should issue typed semantic actions, not arbitrary JavaScript.

Target MCP/plugin actions:

- get_current_manifest(channel)
- list_worlds()
- get_world_recipe(worldId, channel)
- search_placeable_assets(query, filters)
- propose_world_patch(...)
- validate_candidate(candidateId)
- apply_candidate_to_stage(candidateId)
- rollback_stage(snapshot/candidate)
- mark_candidate_accepted(candidateId)
- promote_accepted_modules(...)
- get_validation_report()
- get_change_history()

Write actions enforce owners, schemas, source and validation rules.

## 6 · God Mode input / editing

One world canvas, one authoritative input router.

Modes:
- PLAY
- OBJECT_EDIT
- TERRAIN_SCULPT
- SCENE_COMPOSE
- CHAT / WORLD_DIRECTOR

Only one manipulation mode owns pointer/drag/wheel at a time.

### OBJECT_EDIT
Reuse the existing shared 3D In-Place Editor:
- Move / Rotate / Scale;
- World / Local;
- grid / connector / mount snap where relevant;
- Place on Ground against WB2 support truth;
- focus;
- undo/redo;
- object vs semantic group/module root.

Do not create another TransformControls stack.

### TERRAIN_SCULPT
Reuse:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`

Current contract:
- deterministic additive strokes;
- Raise / Lower;
- radius / strength;
- smooth falloff;
- wheel/touchpad radius;
- stored stroke list for replay/rollback.

Terrain sculpt does not become a second world owner.

### SCENE_COMPOSE
God Mode can:
- place props/nature/buildings;
- place compatible Character as Ambient Actor;
- choose existing idle/activity;
- place intact Resident Atlas scene/module;
- sculpt local support;
- group selected members into one Mini-Scene root;
- attach event/visibility/persistence metadata;
- validate and save as Stage candidate.

## 7 · Terrain ↔ object dependency

Placed objects/modules declare terrain response:

- FOLLOW_SUPPORT
- KEEP_WORLD_HEIGHT
- FIXED_AUTHORED
- OWNER_DEFINED

Defaults:
- loose props/nature/ambient actors → FOLLOW_SUPPORT;
- buildings/signature modules → footprint/support validation;
- Track Core → protected route/support owner;
- protected authored landmarks → FIXED_AUTHORED or owner-defined.

Terrain edits may not silently deform Track Core or protected signature content.

## 8 · Asset Librarian / Scene Composer

Use the existing Registry/Librarian.

God Mode exposes a curated **PLACEABLE** view, not the raw asset corpus.

Initial categories:
- Character
- Building
- Prop
- Nature
- Resident Set
- Resident Scene Module
- Mini-Scene Module
- Media / Sign
- Performance / Show Module

Useful filters:
- source family;
- category;
- rig/animation compatibility;
- static/animated;
- support type;
- biome/context;
- source status;
- Stage/Live eligibility.

## 9 · Resident integration

Resident Atlas remains source/authoring donor, not world owner.

Current intake:
`WSA_RESIDENT_ATLAS_MVP_INTAKE_2026-10-04.md`

God Mode can place:
- individual Ambient Actor;
- Resident candidate;
- intact Resident module/scenelet.

World owns root placement/support/persistence.
Resident/activity owner retains internal animation/activity/dialogue presentation.

## 10 · Lean Memory layers

Keep these separate.

### A · PLAYER_SAVE
What is true now:
- current world/anchor/transform;
- last safe return anchor;
- progression/event state;
- card collection;
- social graph refs;
- mutable world-state refs;
- memory-ledger ref;
- release manifest / schema refs.

### B · LEAN EVENT MEMORY LEDGER
What happened:
- arrivals;
- Resident encounters;
- Card handoffs;
- song discoveries;
- quest/thread changes;
- attraction/minigame milestones;
- meaningful world changes.

### C · NPC / SOCIAL MEMORY
What an NPC knows/remembers:
- EncounterReceipt refs;
- relation refs;
- salient MomentReceipts;
- unresolved threads;
- shared Card/song/world refs;
- canonical fact knowledge.

Generated summaries are caches. Receipts and canonical facts remain authoritative.

### D · FRACTAL ALMANAC / JOURNEY
Player-facing projection:
- collected source Cards;
- provenance;
- locations;
- Residents;
- Journey Entries;
- optional Hero Shots.

### E · AUTHORING HISTORY
Stage snapshots, module versions, terrain strokes, God Mode transactions, validation and review decisions.

Authoring history is not automatically player/NPC memory.

### F · CHAT MEMORY
Helpful context only; never savegame or release truth.

## 11 · Core persistence schemas

Minimum planned schemas:

- PLAYER_SAVE
- SESSION
- MOMENT_RECEIPT
- ENCOUNTER_RECEIPT
- SOCIAL_RELATION
- NPC_MEMORY_VIEW
- CARD_COLLECTION_ENTRY
- CARD_PROVENANCE_EVENT
- JOURNEY_ENTRY

### Card rule
One canonical Card identity.
Delivery / Stunt / Flight / Combat / Quest / Hidden Find / Resident Gift add provenance events to the same Card.

Hero Shots and path images are attachments to Card/Journey memory, not replacements for the Card.

## 12 · Fractal Almanac HUD

Reuse existing HUD Game v3 / Overworld fanned-card grammar and restyle through the current Playmation/Knet HUD language.

MVP:
- visible fanned/stacked collected Cards;
- real Card art/identity;
- one detail view with provenance + location + Resident/source;
- optional Hero Shot attachment;
- no full encyclopedia required.

The Cologne Race hero-shot thumbnail stack is a useful presentation donor only; it is not the final Almanac data model.

## 13 · Import / export

Keep two portable bundles.

### PLAYER JOURNEY BUNDLE
Includes:
- PlayerSave;
- Session / lean receipts;
- Card collection/provenance;
- Social graph / NPC memory rebuild inputs;
- mutable world-state refs/deltas;
- Journey Entries;
- manifest/build/schema refs;
- migration metadata;
- optional thumbnails/HeroShots as caches.

### AUTHORING WORKSPACE BUNDLE
Includes:
- Stage snapshot/manifest;
- World Director cards;
- module/profile candidate refs;
- terrain sculpt transactions;
- Scene Composer transactions;
- validation reports;
- accepted/rejected decisions.

Do not mix authoring state into player journey automatically.

## 14 · Exact replay vs semantic migration

EXACT replay requires historical build/source/package/seed/state pins.

If the historical runtime is unavailable, import may perform a **semantic migration/rebuild** while preserving logical world/Card/Resident/event identity.

Never label semantic reconstruction as exact replay.

## 15 · Minimum executable Site proofs

### SITE-STAGE-01
Known-good WB2 world → Stage manifest → one data-only biome/light/audio patch → validate → hot-apply → rollback → accept; Live untouched.

### GOD-MODE-SCENE-01
Place one source-proven Prop → shared editor → local WB2 terrain Raise/Lower → re-ground/reconcile → save Stage transaction → validate → rollback.

### LEAN-MEMORY-SITE-PERSISTENCE-01
Meet one Resident → acquire one real Card → record one encounter/provenance receipt → save/export → fresh session import → same Card/provenance in Almanac → Resident continuity resolves prior encounter → valid safe resume anchor.

## 16 · Protected boundaries

- no second world owner;
- no second Track owner;
- no second audio transport;
- no third editor;
- no second Asset Librarian;
- no full Three.js scene dump as memory;
- no full dialogue transcript as default NPC memory;
- no ChatGPT conversational memory as savegame;
- no arbitrary JavaScript through normal God Mode;
- no silent source substitution;
- no Live mutation from Stage experiments.

## 17 · Current implementation status

This document is **architecture persisted to GitHub**.

It does not claim:
- Site control plane implemented;
- persistence backend selected/implemented;
- God Mode integrated in WB2;
- Stage/Live manifests implemented;
- Resident memory runtime implemented;
- Live deployment.

Those remain explicit pre-One-Shot implementation/preflight work.
