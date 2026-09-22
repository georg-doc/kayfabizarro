# KFB World Building Preflight · P0 Source Reuse Matrix

Status: **P0 COMPLETE · SOURCE / DONOR PIN ONLY · NO RUNTIME CHANGE**  
Date: 2026-09-22  
Owner: **KFB ToolBox / World Authoring preflight**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/world-building-preflight-2026-09-22`  
Base checked immediately before branch creation: `f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`

This note answers P0 only: what KFB already owns, what should be adapted, what is research-only, and what must not be imported. It does not create a World runtime, Surface Adapter, Environment Profile, editor, OSM conversion or Stage.

## Classification

- **REUSE_DIRECT** — current KFB source/owner should be consumed as-is through its existing seam; do not duplicate it.
- **ADAPT** — reuse the smallest proven source blocks/behaviour behind a new isolated seam; donor remains owner of its original runtime.
- **RESEARCH_ONLY** — architecture/reference only in this preflight; no vendoring or copied implementation.
- **DO_NOT_IMPORT** — no code/visual import into KFB from this source in the current state.

## Internal KFB donors

| Donor | Classification | Exact pin | What is already proven / owned | P0 decision |
|---|---|---|---|---|
| **Travel / TinySkies terrain truth** | **REUSE_DIRECT** | `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`; `travel/CONTRACT.md` blob `f61494659b8e111c261c59acd1aa58e01c9edd7c`; `terrain-surface.js` blob `9513347b6e3192dfefbeb3371085b13ac41ebb5d`; `boden-lesung.js` blob `e3ec3d442725e06197fd62abe91b299721583f33` | One terrain-height truth. Canonical ground reads `bodenRadius(up)`; radial displacement lives in the current terrain source; `setTerrainZones(...)` modifies the same baked height truth instead of placing a second plateau mesh. | Sphere work must call/adapt this truth; never create a second Travel terrain owner. |
| **Travel WB0 World Recipe** | **REUSE_DIRECT** | same Travel head; `site/world-builder/world-recipe.js` blob `080263866129a85d42d26ceee88fdbf2f4614c2e` | Existing `kfb.world-recipe.v0` with base mode, zones, instances, splines, voxel chunks, portals, calibration families and surface anchors. | P2 may consume a tiny logical recipe shape; do not invent a parallel world document in P0. |
| **Travel WB0 support surface** | **REUSE_DIRECT** | same Travel head; `site/world-builder/support-surface.js` blob `49a095a5b9be2ce867f4b05165587a3e38598465` | Terrain remains base height truth; registered props/cards may only raise walkable support. Resolver returns terrain/support identity and metadata without replacing movement/collision/render ownership. | Reuse as the existing support-contact concept; P2 must not create a second support owner. |
| **Travel WB0 runtime mode bridge** | **REUSE_DIRECT** | same Travel head; `site/world-builder/runtime-mode.js` blob `1c55d1592cfc5d32c325be8992ed88f503ae0cf1` | Explicit one-active-movement-writer and one-active-camera-writer behaviour: Flight writer is gated while Ground owns the frame, then restored exactly. | The preflight preserves this rule. Surface proofs must not introduce movement ownership. |
| **KayKit Hex corpus / grid / edge solver** | **REUSE_DIRECT** | `georg-doc/kayfabizarro@f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`; corpus `README.md` blob `c073f318ad4e467035e22ed7d1dbce7d596fa6f1`; `PACK_TRUTH.md` blob `cae44ce3595d58a31703bc1648c475e7a6e79ce2`; `NEXT_FIVE.md` blob `8e531e4113584b8240c793d5f9c0fe4bc1ccf846`; `modules/hexrealm/lib/hex-grid.js` blob `06e3c217cca5ff806ae9aeb84f858c5118f31232` | Real measured 2.00 × 2.309 pointy-top module truth; pack-qualified identities; existing `TILE_EDGES`, `solveHexTile`, `buildNetwork`, `auditTileFit`, `rotDeg`, shore normalization and grid transforms. The corpus explicitly records earlier random-rotation/generator failures. | P2 seven-cell fixture must use these identities/rotations. No fifth solver and no guessed rotations. |
| **WhackMan environment behaviour** | **ADAPT** | `georg-doc/kayfabizarro@f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`; `wm-boot.js` blob `02f078720a28bb6ea59c2ad09453121ff97cd9d1`; `wm-gate-b.js` blob `785dd0906e8ce714e148980e3bc9fce74aced36c`; `wm-gate-c.js` blob `79116eef1922b49b1faf4a464c03158d12bbcf34` | Source behaviour is concrete: cool weak dusk sky/key + depth fog; material mattification (high roughness, zero metalness, low envMap intensity, clearcoat off); mounted-torch flame positions from the Dungeon owner; visible glow sprite at every torch; at most six nearest moving PointLights with physical decay 2; asynchronous two-frequency flicker; player-local visibility light that does **not** overwrite global dusk/fog. | Correct seam is a standalone **Environment Profile** behaviour/config candidate. Copy/adapt smallest real source blocks in P1; do not import WhackMan MazeGraph/gameplay. |
| **Combat Spindle Sky / card funnel** | **ADAPT** | `georg-doc/KFB-Combat-Arena@wsa/ca2-kaykit-prep-2026-09-20` head `735b5449bf09fb1a069d4a81db44608a58166677`; `SKY_01_SPINDLE_MODULE.md` blob `fb38e4f37bfa7a91d1ca16a4d9a6c08ce23ec115`; donor blobs: `himmel.v4.js` `5f5253ac7e20c97e7d42d402c3ef5aff8070187d`, `spindel.v4.js` `01612b2653ad4215c088e9d7c055775a1c22ac2a`, `skydome-shader.v4.js` `4d93aec8b8c5749491cb5a49d058b12b827e008c` | Existing card-motif cylindrical interior sky, lower textured funnel/closure, upper spindle/dome closure, optional vortex/lava throat/glow, independent psychedelic spiral overlay, palette hooks, camera/far-plane closure diagnostics, and lifecycle clues (`mount/update/dispose`). Current donor contains Combat-private coupling. | Existing proposed seam remains correct: `kfb.environment.spindle-sky/0.1-candidate`. Host owns scene/camera/renderer/clock/fog/gameplay; candidate owns only its meshes/materials. No World/Race integration in P0. |
| **StoryMap canonical geography + presentation transform split** | **ADAPT** | `georg-doc/kayfabizarro@f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`; `SMA1-GATE.md` blob `9dec3849dd43d7d0dd3855c7612d427b5f389907`; `sma1-map-animator.js` blob `043baa12b6186f2128ebd1e32d6940d8fbb03165` | Each piece stores canonical position/quaternion/scale; actions write presentation transforms; `resetCanonical()` restores canonical geography. Flat/Table/Flyover/Pop-up camera roles, Ink vs Shadow representation modes, D6 `cell/6` terracing, BoardGameBits, one map-owned wet-mask truth, and a radial Surface-FX ripple are already evidenced. | Reuse these as representation/FX/toy donors only. StoryMap does not become World/OSM owner. Coast-distance relief remains stylised fallback, not factual elevation. |
| **StoryMap current fluid-water appearance** | **DO_NOT_IMPORT** | same StoryMap pin; `START_HERE.md` blob `bd109bebd157cb18e321f8353fc518067bbeca49`; `POSTMORTEM-2026-09-22.md` blob `0dd721f8da58080e6ab7c7e90bfcbceb3f315861` | Source-lock/programmatic GPU wiring was verified, but Georg reported the live result as visually flat/unresolved and the authoring environment could not reliably verify animation while background-throttled. | Do not promote the current water **appearance**. The separate wet-mask/geometry/flow ownership seam remains usable. |
| **StoryMap / Travel radial ripple semantics** | **ADAPT** | StoryMap pin above; original Travel ripple donor recorded in SMA1 at `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a` | StoryMap documents one explicit seam: donor directional wave phase changed to radial distance while preserving the donor rate/amplitude weighting and normal recompute. | First Surface-FX candidate for P2; same event data should drive Flat/Sphere/Torus without touching physics/collision. |
| **OSM City Lab semantic / footprint truth** | **REUSE_DIRECT** | `georg-doc/kayfabizarro@f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`; `tools/osm-city-lab/README.md` blob `c298ce4a29da59194496c11229a99313dfcdfb27` | Cached OSM vector source → deterministic WGS84/local-metre normalization → normalized IDs/tags/roads/building footprints → consumer scene. The browser does not query Overpass at runtime. OSM IDs and source tags survive normalization. | OSM remains semantic/geographic truth. Future surface work consumes normalized source; do not create another OSM DB/runtime. |
| **OSM cartoon presentation deformation** | **REUSE_DIRECT** | same KFB head; `tools/osm-city-lab/src/style/cartoon-city.js` blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782` | Existing deterministic lean/bend/taper/twist/stack deformation. Source explicitly states: **S1 presentation only; S2 collision/export geometry is never deformed.** | This is the required presentation seam: source footprint/collision stays exact while visible massing may deform. Later OSM cartoon geometry must preserve that split. |

## External architecture references

No external code is vendored or copied in P0. Actual repository license files were inspected; README badges alone were not used as proof.

| External donor | Classification | Exact revision / license | Specific idea worth keeping | License / import note |
|---|---|---|---|---|
| **ZyFou/ProceduralTerrains** | **RESEARCH_ONLY** | `9f50c499e1682d1c7c362c79c8fb0ff411fd02f8`; MIT; `LICENSE` blob `30d8711c055630ea5d7a481e20c81766a5fa5abd` | Explicit editor/runtime separation; Tile / Infinite World / Planet modes; per-chunk LOD; local save/load; renderer-neutral/export-oriented project data. | MIT is permissive, but P0 imports nothing. Use only as architecture comparison until a separate import decision exists. |
| **gunyakov/three-hex-map** | **RESEARCH_ONLY** | `712f0ddd599809f67dbb920bd9905cc3aeea8aa1`; MPL-2.0; `LICENSE` blob `a612ad9813b006ce81d1ee438dd784da99a54007` | Instanced terrain layers; shader edge blending; animated water/rivers/lakes; vegetation; fog-of-war state without per-tile meshes. | MPL-2.0 requires deliberate file-level license handling if code is copied/modified. Keep architecture-only in this preflight. |
| **tordanik/OSM2World** | **RESEARCH_ONLY** | `8ec26a9ea426444a4f7882cf0cfcab432c876ae5`; MIT; `LICENSE.txt` blob `62d4e4256f594c51c9e043a3aaa3ce174fb46f0c` | Mature OSM tag/semantic interpretation separated into world modules before output generation. | Reference the interpretation/preprocessing architecture; KFB already owns its current OSM source pipeline. |
| **uber/h3** | **RESEARCH_ONLY** | `cd62033b337b128ea7c4749f2302143b424187fc`; Apache-2.0; `LICENSE` blob `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64` | Optional hierarchical geographic Hex indexing bridge from lat/lon to stable cell IDs. | Not a replacement for KFB's KayKit visible Hex solver. Use only if a later geo-indexing need is proven. |
| **willjoe/terranian** | **DO_NOT_IMPORT** | `05987901452f6e3fe4aa6d3d454ff382b47db314`; **no repository-root license file / GitHub license metadata found at this pin** | README demonstrates a useful architecture split: pure data → JSON-serializable WorldModel → renderer-independent geometry → Three/R3F scene. | No source-code import without a verified license grant. Architecture may be independently re-derived from the public description only. |
| **kenjinp/hello-terrain** | **RESEARCH_ONLY** | `51b022cc964a05217701a05edd94deca04b44af7`; MIT; `LICENSE` blob `493cfb3c8335c31bea327e0e27a8cb22004111d7` | Variable LOD for very large terrain, elevation manipulation/holes/overlays/wetness and composable compute stages. | Secondary reference only; do not let a WebGPU/terrain-engine choice pre-empt KFB's current owners. |
| **Zylann/godot_voxel** | **RESEARCH_ONLY** | `c8c34114643f1dd45a87f056101fe6cee1a9aea1`; MIT; `LICENSE.md` blob `c6df5f9b42179cfc6245605f893de66e1c04c530` | Volumetric chunk paging, editable caves/overhangs/destruction and smooth/blocky LOD patterns. | Confirms Voxel belongs to local volumetric needs, not the universal macro-world surface. |
| **mscroggs/mathsteroids** | **RESEARCH_ONLY** | `1ad193f934ff3a03d28b3661caf06232088ca1d1`; MIT; `LICENSE.txt` blob `6339ef398b01d895cd3ce7862b4e19ace8407e73` | A compact reference that the same game semantics can be presented on multiple mathematical surfaces including sphere, torus, Möbius and Klein bottle. | Research only. P2 deliberately stops at the orientable Flat/Sphere/Torus boundary; Möbius/Klein remain deferred. |

## P0 conclusions

### What KFB already owns

1. **Terrain / height truth:** Travel/TinySkies.
2. **World recipe / surface anchors:** Travel WB0.
3. **Raised walkable support seam:** Travel WB0 support-surface resolver.
4. **Movement/camera writer arbitration:** Travel WB0 mode bridge.
5. **Visible Hex grid / edge / rotation / placement truth:** existing KayKit Hex modules.
6. **OSM semantic/geographic/footprint truth:** OSM City Lab.
7. **OSM collision/export vs presentation separation:** OSM City Lab.
8. **Reusable Dungeon mood behaviour:** WhackMan source, ready to isolate but not yet extracted.
9. **Reusable card-funnel/Spindle environment element:** Combat donor, ready to extract but not yet standalone.
10. **Canonical-vs-presentation map grammar and first radial Surface-FX:** StoryMap/Travel donor chain.

### What should be adapted next

- **P1:** isolate WhackMan's environment behaviour into one small Environment Profile proof without WhackMan gameplay.
- **P2:** use the same tiny logical recipe on Flat/Sphere/Torus while consuming existing Travel/Hex/StoryMap seams and creating no movement/world owner.

### What should only inspire architecture

All external repositories above. None are implementation dependencies for P1/P2.

### Explicit exclusions

- current StoryMap water **appearance**;
- random/generated Hex placement that bypasses `solveHexTile` / `auditTileFit`;
- a second terrain-height truth;
- a second OSM world/database;
- a second movement or camera writer;
- Combat-private Spindle fields in a reusable module;
- Terranian source code while its repository license remains unverified;
- Möbius/Klein/hollow/infinite/voxel-universal world work in this preflight.

## P0 checks

- Current KFB coordination `main` re-read before write: `f1b7442012dc5c101c5a8dbe0cb00af8335b99e7`.
- Travel current `main` re-read: `8614282aab2ced43bb5dda9fcf7abadf9768100a`.
- Combat planning branch re-read: `735b5449bf09fb1a069d4a81db44608a58166677`.
- Hex / WhackMan / StoryMap / OSM source blobs read from current KFB `main`.
- External repository heads and actual license files inspected.
- Runtime files changed: **0**.
- Browser / gameplay / Stage tests: **not applicable to P0 documentation pin**.

## Exactly one next gate

**P1 · WhackMan Environment Profile isolation.**  
Do not start P2 until P1 is committed and verified.
