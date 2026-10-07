# KFB · 2026-10-07 Web-Chat Ideation Persistence Audit

Status: **RECOVERY INDEX · IDEAS PERSISTED / ROUTED · NO RUNTIME OWNER CHANGE**  
Date: 2026-10-07  
Owner: **KFB Production / current system owners**  
Purpose: make the full 2026-10-07 Web-Chat design work recoverable from `main` without relying on chat memory.

## Audit verdict

**No major design line from the audited discussion is now chat-only.**

The audit found two routing/persistence gaps and fixed them:
1. the Fluff construction lifecycle was only partially implied; it is now explicitly persisted on the Cell/World Grammar branch;
2. the Asset Librarian README still named the legacy Cloudflare mirror as the permanent production URL; it now points to the canonical GPT Site.

The large planning bodies remain intentionally on their named planning branches. This file is the `main` recovery index that connects them.

No new runtime owner, no merge, no Live promotion and no new REQUIRED Island-MVP row were created by this audit.

---

## 1 · Asset Librarian / 3D Asset Library / External MCP Federation

### Canonical owner
**KFB Asset Registry / Asset Librarian**

Canonical productive Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Style Reference view:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Current main owner docs:
- `tools/asset_registry/librarian/README.md`
- `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`

### External 3D discovery / MCP donor

Planning branch:
`planning/asset-librarian-external-3d-search-r1-2026-10-07`

Verified head during this audit:
`4621841fc4835258cfcad11837061e7085269a6c`

Handover root:
`tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/`

Key files:
- `START_HERE.md`
- `RETURN.md`
- `TEST_REPORT.md`
- `WORK_WSA_IMPLEMENTATION_BRIEF.md`
- `SHORT_HANDOVER_WSA_MVP_PLANNING.md`
- `ULTRATEX_TEXTURE_ADAPTATION_DONOR_NOTE.md`

Initial donor:
`arielshad/3d-asset-server@c5c408d1eb524e3bf878bb63ff47bc928980bf76`

Hosted donor service:
`https://3d.shep.bot/`

Verified donor capability:
- 20 providers at audit/prep time;
- browser + REST/OpenAPI;
- Streamable HTTP MCP;
- stdio MCP / CLI;
- common external result model for models, textures, materials, HDRIs and related assets.

Binding KFB rule:
`external discovery → candidate only → trusted intake → exact payload SHA-256 → rights/provenance → source isolation → Registry → normal Librarian handoff`

Prepared additive external tools:
- `search_external_assets`
- `get_external_asset`
- `list_external_asset_providers`
- `prepare_external_asset_intake`

Do **not** broaden/replace the canonical internal `search_assets` tool.

Status:
**PREPARED / READY FOR IMPLEMENTATION · NOT IMPLEMENTED YET**

---

## 2 · Asset intake / source isolation / Frankensteining

External or generated geometry is never production truth merely because a URL/model loads.

Required lane:
`search/discovery → exact source inspect → trusted download → hash/provenance → source object in isolation → KEEP/ADAPT/REJECT → Registry → receiving product`

This applies to:
- Asset Librarian external discovery;
- KFB Frankensteining / kitbashing;
- external 3D donors;
- AI-generated meshes;
- texture/material adaptation;
- WorldBuilder placement.

Current Island MVP also retains source isolation as a REQUIRED acceptance rule.

---

## 3 · Textures / Surface Material Language / Claybound

### Binding main canon

`skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`

Claybound remains the **visual Gold Standard**.

Separation:
- KayKit/Kenney/KFB source assets own form/identity/rig/connectors;
- KFB Clay/Surface owner owns presentation/material/relief/contact/shadows.

K1/H0 v8:
**visual Golden**

K2/v10:
**new-stage technical baseline only after Golden parity**

Relevant modules:
- `clay-material.v10.js`
- `clay-relief.v4.js`
- `clay-toolmix.v1.js`

`clay_floor_001` triplanar remains a cheap microtexture/stand-in donor, not automatic final KFB Clay.

### Hybrid/baked/material research branch

Branch:
`planning/hybrid-baked-clay-texture-architecture-2026-10-07`

Verified head:
`c5b88d9a795fce9a8efff413ad4a3df33bd0bbdf`

Key files:
- `skills/chat/KFB_SURFACE_MATERIAL_LANGUAGE_STEERING_2026-10-07.md`
- `skills/chat/KFB_HYBRID_BAKED_CLAY_TEXTURE_ARCHITECTURE_PREP_2026-10-07.md`
- `skills/chat/KFB_STYLIZED_SURFACE_SHADER_RESEARCH_2026-10-07.md`

Persisted decisions:
- Claybound-quality first; implementation technology second;
- bake expensive static low/mid-frequency detail where useful;
- cheap runtime shell + near-only microdetail;
- family/shared materials for OSM/procedural buildings;
- Toon/Cel, directional color, Matcap, biplanar and hybrid remain challengers, not automatic replacements;
- full triplanar multi-map stacks are not the default for every asset;
- same-scene A–E visual/performance lab is the next material proof.

---

## 4 · UltraTex texture/material adaptation donor

File:
`tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/ULTRATEX_TEXTURE_ADAPTATION_DONOR_NOTE.md`

Same Asset-Librarian external-search planning branch.

Upstream:
`yiboz2001/UltraTex@a726678f3f3631fe2c5e3d1fb4597114784c7a8b`

Classification:
**TEXTURE_ADAPTATION_DONOR · LAB CANDIDATE · NOT PRODUCTION-READY**

Intended optional lane:
`geometry donor → source isolation → prep/G-buffers → UltraTex test → KFB/Claybound material adaptation → visual gate → Registry/consumer`

Not accepted as:
- Registry owner;
- material runtime owner;
- MVP requirement;
- proven one-command arbitrary GLB→game-ready GLB path.

---

## 5 · Blender MCP / Resident Performance / build choreography

Main execution brief:
`skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_EXECUTION_2026-10-07.md`

Main prep:
`skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`

Issue:
**#369**

Owner:
**KFB Resident Performance / Motion Prep**

Blender MCP owns source-isolated reusable body-performance/choreography preparation, not World runtime state.

Existing reusable Fluff/work vocabulary includes:
- collect/harvest;
- carry;
- roll/push;
- growing-ball/merge;
- give/receive;
- knead/press;
- place;
- flatten;
- patch;
- team work;
- repair/rebuild choreography.

Existing prep explicitly already connects this to:
`Fluff balls → merge/knead → rough mass → place/stack → press/flatten → patch/sculpt → source-proven final prop/building`

Do not create a new animation batch before auditing existing motion coverage.

---

## 6 · Fluff Construction / Raw-Mass build grammar

Planning branch:
`planning/kfb-cell-metric-voxel-world-grammar-2026-10-07`

Verified head after audit fix:
`d1c0848bffc5bb8a5e8b8ee14fdd6a6b12209a7e`

Main planning file:
`skills/chat/KFB_CELL_METRIC_VOXEL_WORLD_GRAMMAR_PREP_2026-10-07.md`

Explicitly persisted lifecycle:
`PREVIEW → HARVEST/GATHER → AGGREGATE → ROUGH_MASS → SCULPT → RESOLVE → CONNECT/FINISH`

Large structure option:
`MATERIAL DELIVERY → SCAFFOLD → COLORED/TYPED ROUGH MASS → SCULPT → RESOLVE → EDGE HEAL/FINISH`

Rules:
- rough mass derives from real target bounds/MacroCell footprint;
- rough mass already hints at final material/color identity;
- Resident and God Mode share the same canonical structural result;
- final state returns to the real source-proven object/module;
- transition state is presentation, not durable world truth.

---

## 7 · Cube / MacroCell / Voxel world grammar

Same branch/file as §6.

Persisted:
- Cube/MacroCell is the preferred default cell grammar candidate;
- current best metric candidate = **4 world-unit MacroCell**, not yet frozen;
- D6 vertical terrain quantum candidate = Macro/6;
- finer SubCells remain available for destruction/detail;
- StoryMap donor already proves D6 stepped relief + one InstancedMesh;
- KayKit BlockBits are registered and available as a toy/block family;
- Hex is downgraded to optional Tactical/Babel/specific asset donor, not default immersive world architecture;
- measured Dungeon 4×4 module remains a high-value architecture donor;
- resource payload/mining state belongs to cell metadata, not permanent spawned inventory objects.

---

## 8 · Destruction / Build / Repair / Edge Completion

Same Cell/World Grammar file.

Persisted:
- exposed modular edges must become designed presentation edges;
- dynamic/reversible completion shell;
- construction direction:
  `EXPOSED → COMPLETED → ATTACH → CONNECTED → NEW EXPOSED → COMPLETED`;
- destruction direction:
  `CONNECTED → DAMAGE/DETACH → NEW EXPOSED → RUIN COMPLETION → SETTLE/COLLAPSE → STABLE RUIN`;
- support/collapse resolves first, completion recalculates after topology stabilizes;
- reuse Seed World promoted-cell logic and fixed rubble/debris pools;
- Build/Destroy/Repair/Rebuild are one bidirectional presentation grammar;
- no second destruction runtime.

---

## 9 · Material Identity / Color Grammar

Same Cell/World Grammar file.

Persisted material families include:
- `SOFT_CLAY`
- `CARTOON_STONE`
- `LIGHT_WOOD_BALSA`
- `TOY_PLASTIC`
- `HARD_RUBBER`
- `PAPER_CARDBOARD`

Stable identity spans:
`ROUGH_MASS → SCULPT → RESOLVED → DAMAGED → RUIN → REBUILD → RESTORED`

Base/main color and material family should already be legible in the rough-mass build phase.

Material identity may inform:
- impact/bounce;
- build motion;
- fracture;
- rubble;
- repair choreography;
- later Audio/VFX hooks.

No one-size-fits-all generic rubble.

---

## 10 · Open Stage / Living Diorama

Same Cell/World Grammar file.

Persisted:
- conventional closed interiors are not mandatory;
- semantic, physical and visual room boundaries remain separate;
- OPEN / FLOOR_MARK / TWO_WALL / PARTIAL / ENCLOSED scene profiles;
- props + Resident choreography may prove a room without four walls;
- prioritizes camera/readability/character scale;
- supports deliberate ambiguity between house, stage, toy, landscape and subjective/story space;
- Claybound quality remains the visual benchmark.

---

## 11 · Paper / Cardboard Facade grammar

Same Cell/World Grammar file.

Persisted roles:
- Landmark Cutout;
- Civilization/Western Facade;
- Billboard/Prop Cutout;
- Open-Stage Backdrop;
- Comedic/Destructible Facade.

Visual/material language:
- visible white/light cut edge;
- cardboard thickness/corrugated side where useful;
- front/back asymmetry;
- balsa/cardboard supports, feet, braces, tabs/hinges;
- front may make a world claim while rear exposes construction.

Material behavior:
- bend/fold/tear/tip/collapse rather than generic stone fracture.

Use selectively; not a universal replacement for physical 3D architecture.

---

## 12 · Threshold / Door grammar

Same Cell/World Grammar file.

Persisted door roles:
- `LITERAL_DOOR`
- `FACADE_DOOR`
- `PORTAL_DOOR`
- `FALSE_OR_PUZZLE_DOOR`
- `TRUTH_SWITCH`

Separate:
- Scene Truth;
- Threshold Truth;
- Destination Truth.

State-dependent resolution:
- base/locked state = ordinary local pass-through;
- unlocked/keyed/revealed state = portal/instance/realm or deliberate controlled target;
- walking around a facade remains in current world;
- threshold consumes authoritative progression/world state and does not own it.

---

## 13 · Island MVP routing

Current main Frozen Matrix:
`skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.{md,json}`

Current operational state:
- **44 REQUIRED**
- **13 STRONGLY INCLUDE**
- **7 OPTIONAL**
- operationalVersion **4**

F-S13:
**State-dependent Threshold Door / Paper-Facade portal proof**

This did **not** add a 45th REQUIRED row.

Full quest/key/realm progression remains outside first-Island MVP scope.

Build/Repair/Rebuild and harmless destruction remain bounded optional/strong seams rather than a full destruction sandbox mandate.

---

## 14 · World Pulse / breathing living toy

Planning branch:
`planning/world-pulse-audio-reactive-living-toy-2026-10-07`

Verified head:
`5678977376d4955156aed66ff8fcc5e6cc20dc66`

Files:
- `skills/chat/KFB_WORLD_PULSE_AUDIO_REACTIVE_LIVING_TOY_CONTRACT_PREP_2026-10-07.md`
- `skills/chat/KFB_WORLD_PULSE_MVP_HANDOVER_2026-10-07.md`

North Star:
**the world is a breathing, living toy**

Ownership:
**Audio owns musical truth. World owns spatial truth. World Pulse owns presentation only.**

Persisted:
- BaseLife + Wind + Music + optional EventPulse;
- clustered foliage instead of isolated leaf units;
- semantic Audio pulse, no per-prop FFT/AudioContext;
- local Jukebox/Billboard/Band response fields;
- subtle orchestral/mood response rather than equalizer forest;
- Resident Performance remains actor choreography owner.

---

## 15 · What is intentionally NOT merged / NOT canon yet

The following are safely persisted but remain planning/donor state:
- external 3D federation implementation;
- UltraTex production integration;
- final 4-unit MacroCell canon;
- final Surface/Material challenger selection;
- full Cell Metric runtime;
- full destruction sandbox;
- full quest/key/realm progression;
- broad Paper-Facade world conversion;
- World Pulse runtime integration.

A planning branch is evidence/contract, not a runtime implementation claim.

---

## 16 · Fresh-chat recovery order for these ideas

For a future continuation of this design work:

1. read `skills/chat/START_HERE.md`;
2. read this audit;
3. choose the exact named owner/branch for the requested outcome;
4. read that branch's named planning/Return files;
5. inspect actual donor/source in isolation before implementation;
6. only then open a bounded Work/WSA/Blender implementation slice.

Do not reconstruct these ideas from chat memory.

---

## 17 · One next gate

No new implementation gate is created by this audit.

Current product route remains the Island MVP One-Shot / Frozen Matrix owner.

When one of these research lines becomes product-critical, open **one bounded receiving-owner implementation** from the linked persisted source rather than starting a parallel runtime.
