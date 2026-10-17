# Donor, source and negative-evidence register · Diegetic Diorama POIs R1

Date: 2026-10-17 · Mode: SOURCE ROUTING / NO SOURCE PROMOTION
Full creative brief: [WS0_RECEIVING_BRIEF.md](WS0_RECEIVING_BRIEF.md)
**Current user note:** Meshy jungle PC model exists in Georg's Meshy workspace according to Georg. Exact Meshy project ID, 3D file, asset revision, GLB screenshot and licensing **NOT RECEIVED**. Do not describe as imported, game-ready or source-isolated.

## A. Binding/current owners (read before implementing)

| Donor/owner | Verified GitHub source | Use | Status |
|---|---|---|---|
| KFB Town living document | `skills/chat/town/LIVING_KFB_TOWN.md` @ main, blob `a1bb4ec94aaa5a6d0b694b4fcc4409e8f7573a61` | J-04 embodied tools; J-05 direct link; Town vs room; J-06 running buildings; J-08 NPC continuity; J-15 event beats | CURRENT DESIGN REFERENCE |
| KFB Game Bigger Picture | `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` blob `cddaf7de44436dc1a1c763d58649eeb38d318e68` | Fractal Card→world→POI→Residents→Almanac; meaning from player's action, PULL DON'T GATE | CURRENT PRODUCT INTENT |
| Four-Island Story Recovery | `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` blob `79d7ec482124aaa31e6b2a04baea4ced7aed55f3` | World biographies and geography, Town/Dystopia/Utopia/Protopia, chronology before placement | CURRENT STORY INPUT |
| WB2/Open World #360 | Draft PR [#348](https://github.com/georg-doc/kayfabizarro/pull/348) head `0a8240b83d4fbfdb69cdba47b812e618cc5cd897` at check | Existing integrated terrain/camera/physics/placement owner; protect current STOP / NO MVP evidence | STOPPED CANDIDATE; NO R5 PERMISSION |
| Asset Librarian/Registry | `tools/asset_registry/librarian/README.md` / Asset Registry | source asset IDs, clips, source GLB/GLTF, license, mesh preview/donor isolation | CURRENT OWNER |
| KFB Clay Canon | `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` + PR [#301](https://github.com/georg-doc/kayfabizarro/pull/301), style SSOT and Golden Matrix | K1/H0 v8 *visual Golden* vs K2 v10 technical; actual source visual parity | BINDING |
| Merlin external study | [Draft PR #411](https://github.com/georg-doc/kayfabizarro/pull/411) branch `research/kfb-merlin-spaceship-workflow-r1-2026-10-16` | In-world computer interface inspiration, NOT a copied scene/code donor; Merlin build article unverified | RESEARCH ONLY |
| Asset Scene Composer skill | `skills://plugins/kfb-asset-scene-composer/compose-kfb-scene/skill.md` | scene image job, source isolation, parts-bounded kit, neutral form-first, provenance | AUTHORING PROCESS, NOT IMPORTER |
| KFB cartoon motion | `skills/kfb-cartoon-animation/references/75-vfx-audio-camera-comic-motion.md` | semantic beat/effect/camera discipline, no second game/animation owner | CURRENT CRAFT |
| Real Card Viewer | `tools/asset_registry/librarian/README.md` links v5 Deck Viewer with `?deck=&card=` / `?deck=&page=` | terminal uses existing viewer and verified card/page mapping | REAL TOOL DONOR |
| EyeRig | `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` and current EyeRig Site owner | Optional later screen-face/eyelids if explicitly approved; NOT attached to latest PC mesh by default | EXISTING FACIAL OWNER |

## B. Dungeon + editing: direct relevant sources

| Exact source | Finding | Rule for WS0 |
|---|---|---|
| `tools/world_atlas/docs/HANDOFF_dungeon_S13.md` | S13.2 room-edge graph, 4-unit floors, wall length 4, measured stairs_wood rise 4.05/run 6; original pack assertion "no wall_end/T/cross" | Treat as older orthogonal foundation; its claim about missing nodes is SUPERSEDED by S22. S13 is not a curved-building generator. |
| `tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/tools/probe-wall-nodes.html` | actual isolation/measurement code for `wall_endcap`, T, crossing, corners via `nodeFrame` | Read/import node origins, arms and lengths; show each real mesh isolated; not proof of rounded face. |
| `.../S22_RoomStudy_Handover/CHANGELOG.md` | **Measured** `wall_endcap` one arm/reach 0/outward 1.07, `wall_Tsplit` 3 arms/reach 2, `wall_crossing` 4/reach 2, `wall_corner` 2/reach 2, `wall_corner_small` offset -0.24/+0.24/reach 0.76. | Verified local figures for S22; do not assume these are Meshy metric units or 3D final contacts. |
| `.../S22_RoomStudy_Handover/docs/POSTMORTEM_R08_S22.md` | R08 FAILED after three repairs: guessed rotations, stair wall mismatches, floating props; exact recommendation to use real Gizmos and contact measurements | Negative acceptance fixture for every elevated PC, cat-glass or restaurant prop/route. No new round of guessing offsets. |
| `.../S22_RoomStudy_Handover/KayKit_Room_Study_S21.html` | Inline Three.js `TransformControls` (Editor / Translate / Rotate / Group / Grid / Place Down) with local patch/JSON export; S22 changelog says collision-free + export/import extras | Reuse as adapter or operator path only after source isolation and real browser test. ToolBox promotion is planned, not assumed finished. |
| `tools/world_atlas/source/tools/probe-dungeon-parts.html` | Candidate/load probe names for walls, stairs, corners, doors; names in this probe aren't automatically loaded/available. | Reuse source catalog and exact GLB proof; no pseudo-module inferred from an array of candidate strings. |
| S17 Restaurant room-planning methodology in `.../S22_RoomStudy_Handover/CHANGELOG.md` | `ground/backed/hung/carried` anchors, `hob/worktop/dinertop/setting/passtop/shelftop` support contracts, visitor route before table placement | Existing source **documentation** checked. `lib/restaurant-plan.js` and `KayKit_Restaurant_S17.html` are named historically but **not retrieved on current main**: source location must be resolved before reuse. |
| `media/3D_Assets/KayKit_Bits_Bundle1_1.1/README.md` | Declares Restaurant Bits directory/variant quantities in pack inventory | Inventory evidence only, no current complete loaded model proof/entitlement. Inspect direct source + license in Librarian. |

**Clarification on rounded terminations:** Georg asks for "entsprechende runde Abschlussstücke". S22 explicitly verifies a `wall_endcap` but no circular or rounded shape has been visually shown. Proposed adapter must distinguish `wall_endcap` (1-arm terminal) from **round_cap** (only if an actual donor exists). Reject any generated fake rounding used to hide an unsupported wall seam.

## C. Visual concepts created in this chat: source checksums (NOT GitHub binary commits)

The conversation generated 2D concept images; **GitHub connector has not imported these image bytes**. Exact local-session PNGs were packaged in a transferable visual-source ZIP for Georg/WS0. Original images should be uploaded to the repo branch via an appropriate file-capable workflow before calling image evidence durable in GitHub.

| Image semantic | Image file basename in local transferable ZIP | SHA256 | Resolution | Result / limits |
|---|---|---|---|---|
| Jungle PC, bright clay, old **stone stair to keyboard**, no banners, isolated | `jungle_clay_ancient_stair_to_keyboard.png` | `2be654ef8cca9aa4e6bc9c35257e48e680812a837a83d49b11d92fc1b15eab63` | 1536×1024 | Georg: "Super, das hat ganz gut geklappt. Das Modell ist da." = positive direction / model reported; **NO GLB PROVIDED** |
| Dystopian surveillance, black/dark central rectangular PC, minimal surveillance architecture | `dystopian_black_pc_surveillance_monument.png` | `a71c04ace7af5b68cf4c3e42f9ae3b38b59f4cc7115b9d56a25ae0227c156e7c` | 1448×1086 | Georg "top!" to revised black-PC clear composition; illustration only |
| Retro/industrial giant computer with stairs/platforms | `retro_pc_walkable_stage.png` | `b4840d6462968110e2f041ffedf15b19d271f45c29516d1cba680448f9ce6234` | 1536×1024 | Concept only, not source-object-isolated or Golden |

Curated ZIP of original source PNGs + local manifest: `KFB_DIEGETIC_DIORAMA_POIS_R1_VISUAL_SOURCES_2026-10-17.zip`, SHA256 `1264dae7e4e2779d6829749ef3cd343c44f85d661d05b07d22c8e92b06390595`, **7,104,135 bytes**, **LOCAL CHAT EXPORT, NOT YET IN GITHUB/ASSET REGISTRY**. Do not use a sandbox path as long-lived WS0 URL. The accompanying `CONCEPT_REGISTER.json` tracks source receipt and external Meshy asset status.

### Deliberate negative visual iterations (not build donors)

- PC lost readability under too many towers, surveillance-eye sphere, rituals/overcomplex scaffolding. Georg explicitly rejected them.
- Jungle scenic canyon/waterfall/long-distance panorama: Georg asked to **remove surrounding environment**.
- Eyes/faces on CRT: Georg asked for **no eyes**, more emphasis on PC itself.
- Jungle banners and decorative heraldry: rejected in favor of primitive-tech/crafted-stone spatial language.
- Current selected visual should be simplified to hero PC and accessible old stone staircase, not reproduce every tiny leaf/pot literally in 3D.

## D. Candidate statuses and provenance constraints

- `USER_REPORTED_MESHY_MODEL_EXISTS`: jungle PC only; **source actual GLB/FBX NOT RECEIVED**, Meshy item ID unknown, source mesh isolation NOT_RUN.
- `IMAGE_CONCEPT_ONLY`: selected 2D comps; illustration isn't collision/scale/rig/asset proof.
- `AUTHOR_CONCEPT_SEED`: cat in beer glass, evil clown restaurant; no checked canonical model, drawing, license, full narrative/room plan. Do not claim existing model or that they are already in Town.
- `INTEGRATION_NOT_STARTED`: WorldBuilder/Resident/Card/Media/3D. No new site, game scene or NPC brain.
- `GOLDEN_NOT_ASSIGNED`: Georg positive idea/visual acceptance does not equal a technical Golden, playable feature or merged card/scene.

## E. Source/handoff pin for WS0

- Original workflow research: Draft [PR #411](https://github.com/georg-doc/kayfabizarro/pull/411).
- Texture budget research if many unique screens: Draft [PR #410](https://github.com/georg-doc/kayfabizarro/pull/410); does not justify KTX2 for all Clay materials.
- Existing Town/world split and giant-object visual storytelling: `skills/chat/town/LIVING_KFB_TOWN.md` + `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`.
- For image-to-3D asset adaptation, rely on the *actual* Meshy source and verified Asset Librarian, not image-only silhouette.
