# WS0 INTAKE · KFB PROCEDURAL COLLAGE OPEN WORLD · R1
Date: 2026-10-25
Status: REVIEW / PRODUCT & POC PLANNING ONLY. No runtime change, new world owner, Site/Stage, merge, material approval or automatic POC authorization.
Repository: georg-doc/kayfabizarro
Branch: planning/kfb-procedural-world-composition-wfc-osm-2026-10-24
Draft PR: https://github.com/georg-doc/kayfabizarro/pull/447
**Canonical research dossier:** [KFB PROCEDURAL TERRAIN × WFC × OSM](KFB_PROCEDURAL_TERRAIN_WFC_OSM_LANDMARK_NPC_COMPOSITION_R1_2026-10-24.md), sections 1–15.
**WS0 assignment:** classify existing donors/owners, produce a cheap real composition sanity check, then propose at most one bounded MVP/POC candidate for Georg's separate consideration. Do not interrupt WS1/WS1b.

## 1 · Product intent — keep collage, contradictions and interactivity

Georg wants a performant and genuinely immersive KFB open world whose visual grammar embraces **collage, cross-over, mixed styles and Kayfabe**, not generic uniform low-poly. Authentic existing 3D Clay/Ink/cartoon meshes coexist with continuous terrain, protected real OSM street fragments, surreal Genii Loci, 2D/2.5D staccato illustrated props, white-edge paper pop-ups, readable KFB Cards/books, changing Krazy Kat/Coconino backgrounds, portals/mindscapes and intentionally visible theater machinery. Racer, pedestrians, NPCs, encounters and meaningful routes must remain playable; visually cheap scene dressing should not fake collision truth. The art can alternate between materials and realities instead of converging to one look.

### Complete stimulus/section checklist

| User request or source | Exact GitHub concept section | Evidence/WS0 decision |
| --- | --- | --- |
| [Fleurs Terrain Study I](https://www.reddit.com/r/creativecoding/comments/1xe9np2/terrain_study_i/), [original generator](https://terrain.fleurs.studio/): layered noise terrain, tone-band stippling, threshold dithering, ~400k dots per A3, light/slope, valley fog under wind, 10-second loop, hashes/palette | Dossier **13** | Style/atmosphere source description, not accepted KFB tech; compare with same original WS1 geometry/camera, assess animated flicker and alpha/overdraw |
| WFC and alternative constraints, noise/hydrology, authored biomes, activities, terrain and NPCs | Dossier **1–4, 6–10, 13** | WFC only optional local composition, not macro terrain physics or semantic storyline; prefer exact [BlaiseLabs procedural-almanac](https://github.com/BlaiseLabs/procedural-almanac) and [WFC reference](https://github.com/mxgmn/WaveFunctionCollapse) as research leads |
| [ToastilyBreaded dynamic Voronoi](https://www.reddit.com/r/proceduralgeneration/comments/1q7joho/bonus_showcasing_the_dynamic_voronoi_graph/); screenshot of 0:05 / 0:15 shows dense urban cells against river and sparse surrounding parcels, author-described claimed cell technique | Dossier **14** | A fixed protected city/polygon+falloff vs adaptive variable-density Voronoi allocator; never crop/reshape true streets into Voronoi cells; preservation is a claim, unverified in source |
| Köln Dom/HBF/Rhein, Hürth/Ehrenfeld, future Eiffel/Paris, OSM city pocket with matching street silhouettes / skyline and meaningful social routes, Goo variants | Dossier **1–12, 14** | OSM City Lab cached city is source-true; Paris whole city crop unverified. Existing World/Track owns ground/collision/roads; coherent POI/route/social context required |
| User wants **white scissor-cut edge** pop-up scenery, 2.5D lightweight buildings, 2D staccato scenery at Racer speeds | Dossier **15.1–15.5** + **new donor section 2** | Compare authentic 3D source vs true thin white-edge silhouette mesh vs layered stage under one actual drive path/speed; don't staccato physics/camera |
| Satirical **Fassaden-Demokratie**, Brechtian Verfremdung, visible supports/backside, folding/tearing, build/destruction, Goo/Black Fluff states | Dossier **15.3 III** + [KFB recovery §§8–12](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md) | Real authorial reveal, existing paper and damage/repair/threshold owners; Goo and Black Fluff not interchangeable by assumption |
| KayKit/Tiny Treats **3D comic/books** as instanced walls, huge volumes, labyrinth/Panopticon wall gizmo, Fractal Almanac/Cards | Dossier **15.3 IV** + [Catalog](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/CATALOG/INDEX.md) | Genuine mesh/license/camera isolation still required; exact claimed KayKit/Tiny Treats book models and named Wall Gizmo implementation NOT independently verified |
| Krazy Kat/Coconino, abrupt stage/backdrop changes, surreal forced perspective, folded comic/page/optical illusions | Dossier **15.3 V–VI** + [WSB Coconino references](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/WSB_BLENDER/B2/R2/RESEARCH_SOURCES.md) + [Gutter/Portal companion PR #423](https://github.com/georg-doc/kayfabizarro/pull/423) | Preserve real contact, authored POI truth, collision-safe road; change stage if intentional, not as generic randomness |
| Performance: near real collision/actors/hero, mid instanced hybrid, far impostors/paper matte, dynamic destruction promotion, chunk streaming, meshopt/KTX2 | Dossier **8, 10, 15.4** | Compare focused GPU/CPU, frame times, draw calls, overdraw, content size, VRAM, stream stalls and actual camera/visible source parity; flat planes can be expensive |

User concepts vs assistant proposed implementation are separated in dossier. This brief is not a new SSOT or specification.

## 2 · Newly recovered existing popup precedents — source object FIRST

**A. Joyride Atlas 29 September — source-backed design popupV Köln Dom.**
[Existing main recipe](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20World%20Design%20Setup%20Claymation%20Test/JOYRIDE_SESSION_2026-09-29/code/lab-world/joyride-atlas.m01.json).
The source describes the Dom landmark in its landmarks array as kind **popupV**, material **board.popup**, fold 35, silhouette dom, 40×64 dimension, two printed silhouette extrusions meeting as V; behavior describes wobble when struck. The same recipe specifies card easel, paper cardhouse, modular lightweight city blocks. **Status DESIGN CANDIDATE only**, not a visually proven or running source scene, approved road geometry or physical building. Its Rheinland geography is explicitly story-scaled/compressed, not OSM true local-metre alignment. WS0 should isolate source and contact sheet before proposing Racer adaptation.

**B. Existing StoryMap SMA1 map piece animator.**
[Source script](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20StoryMap%20v1/sma1-map-animator.js) forks the already existing [cartoon map board](https://github.com/georg-doc/kayfabizarro/tree/main/tools/kfb-cartoon-map-board) at pinned source dadf2fa34cc3b64ae7177953387c91e6d3042bb4. Describes centroid-based pivot of country/map pieces so they can rotate/stand and camera framing. The command named **POPUP** in camera presets near line 1296 is **camera positioning only**, NOT proof of white-cut-edge physical pop-up/fold implementation. Source isolation must show the map piece, not merely asset accessibility.

**C. Original Cell/World Grammar.**
[Owner planning branch](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-cell-metric-voxel-world-grammar-2026-10-07/skills/chat/KFB_CELL_METRIC_VOXEL_WORLD_GRAMMAR_PREP_2026-10-07.md), plus [main recovery index](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md). Paper/cardboard material, white edges, side/back, braces/tabs/hinges, staged wall types, stage profiles, destruction exposed-edge completion and repair are already designed, not confirmed live. Candidate MacroCell=4 world units is **not frozen**. Do not create a second damage/door/World authority.

**D. Authentic asset catalog metadata.**
[Asset index](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/CATALOG/INDEX.md) lists KFB_PaperCard_01, OpenBook_FrizzleBobFractalAlmanac_01, jerryblessed-book-4923, Kenney Furniture books, bookcaseOpen, bookcaseClosedWide, etc. The named KayKit/Tiny Treats book-pack variants and a pre-existing Panopticon wall-gizmo need their own exact source check; **catalog entry is not visual acceptance**.

**E. Seed World POC reuse.**
[Research playground handover](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20Seed%20World%20Mech%20Destruction%20POC%2001/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/HANDOVER_2026-10-06_r2.md) + [integration owner classification](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20Seed%20World%20Mech%20Destruction%20POC%2001/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/INTEGRATION_OPEN_WORLD.md): LOD0–3, module worker chunk compile, ring streaming, instanced/cell-damage promotion, limited body pools and 2-bit damage storage. **Donor/Poc only**, pending its own complete post-walk regression; no second Open World physics/renderer/controller.

**F. Separate collaborating owners to respect.**
[Clay Surface canon](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md), [OSM City Lab](https://github.com/georg-doc/kayfabizarro/blob/main/tools/osm-city-lab/README.md), Track Core, Active WS1 (R3F/Three/Rapier), Resident Life, KFB Asset Librarian, Card Viewer, Gutter/Portal owner PR #423, Combat Arena for destruction/weapons, World State for Goo/Fluff and Audio. Previous WB2 Island R4 remains STOPPED/NO MVP, separate WS1 prototype not automatically stopped.

## 3 · Evidence truth: what is NOT archived / visually verified

- User supplied **Voronoi screenshot** is in this conversation (reference at video time 0:05), with exact original Reddit URL recorded; screenshot binary is **not** committed on GitHub. Do not claim its original video, image license or author source code was ingested.
- Fleurs original generator, source video, high-resolution stills and print files **not downloaded**, licensed or inspected in a KFB browser.
- Earlier assistant search-result images in chat were **illustrative references**, not actual verified KFB donors nor committed graphic assets.
- No source-isolated source render/contact sheet of popupV Dom, original paper facade, book wall or Tiny Treats/KayKit claimed book models; no full current WS1 scene replay.
- No public Stage/Site URL or visual QA; no software build, GPU perf or interactive game tests in this planning branch.
- Known practical risk: a screenshot or asset URL proves neither installed runtime nor original art used. Absence of a source is **SOURCE_REQUIRED**, not authorization to substitute a generic prop.

These are explicit open evidence tasks, **not missing creative intent**. WS0 can review all user concepts through the text and original source links without demanding that Georg restate them.

## 4 · Deliverable WS0 returns before any first POC authorization

1. **SOURCE/OWNER matrix** for every row in §1, including path/branch/current head, KEEP / ADAPT / REJECT / SOURCE_REQUIRED, exact existing runtime owner and donor visual isolation status. Isolate genuine Joyride popupV, real current WS1 material/terrain and at least one real book/Facade source. Surface specific blockers, not generic "needs work".
2. **Small coherent Cologne graphic topology/meaning proof**: actual City Lab Dom+HBF+Rhein routes, one real reachable meaningful POI/Resident sequence, valid full-city versus world-zone transform and grounded world/Track transitions. Real local OSM and stylized story map must be distinguished.
3. **Compare optional bounded POC directions**, no hard commitment to build all:
   A · Paper Racer: fixed actual racer route vs authentic 3D scenery vs white physical-edge pop-up vs layered stage, identical camera/speed, authored staccato props;
   B · Brecht facade: real actual front/back braces and state/hinge/tear/meaningful reveal, no generic destruction or unowned Goo mechanic;
   C · Fractal Book Canyon: authentic book/Almanac/catalog source isolated then short navigable instanced book-spine maze with meaningful card interaction;
   D · Köln OSM city protected fixed-pocket baseline vs dynamic Voronoi allocator (and optional local WFC), one road/social loop;
   E · existing colorful terrain vs stippling/Ink vs valley fog (same seed/camera).
   Recommend **at most ONE first tiny POC** if the visual question and owner are clear.
4. **Performance proof plan** with actual target GPU/browser, focused tab/no concurrent workload, fixed seed/camera/route; collect p95 and median frame time, FPS, draws, fill/alpha overdraw, triangles, GPU/CPU where accessible, VRAM/wire and upload/stream stalls, drift/shimmer at Racer speed, real collision and source-visual parity. Do not invent target FPS/tri budgets before profiling.
5. **Implementation authority and one gate:** name only the current World/WS1 receiver and appropriate actual subsystems, independent Builder/Test/Critic/Guard for a substantial authorized subsequent slice. Mark proposed stage/site only when real future product needs it; no auto-merge or live.

## 5 · One next gate and recommended operation

**SINGLE NEXT GATE: WS0 → WS1 TERRAIN/WORLD INTAKE.** WS0 reads this packet and the original dossier, confirms the actual current WS1 receiver branch and APIs, then returns source-backed KEEP/ADAPT/REJECT/SOURCE_REQUIRED, a genuine Köln POI/route/topology composition check and at most one coherent source-isolated POC candidate for later approval. This is the same terrain/world intake gate as the dossier §12, now with WS0 review responsibility explicit. The current WS1 writer is not interrupted or assigned speculative runtime work.

No action from Georg is necessary to read/review this planning packet. Separate authorization is required to implement or publicly publish any POC.

### WS0 cold-start message

"Review existing KFB World Composition planning Draft PR #447 in georg-doc/kayfabizarro. Start with skills/chat/START_HERE.md, skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md, then skills/chat/masterplan/BRIEF_WS0_KFB_PROCEDURAL_COLLAGE_OPEN_WORLD_REVIEW_R1_2026-10-25.md and the linked dossier §§1–15. Recover current WS1 receiver/owner without writes. Check the authentic popupV Dom Joyride recipe, SMA1 pivots, Cell Paper/Facade grammar, real book assets, Seed World donor, OSM City Lab. Return source/owner KEEP/ADAPT/REJECT/SOURCE_REQUIRED matrix, one meaningful Köln route/POI composition proof, and only one recommended isolated visual/performance POC with actual owner. Do not invent an engine, renderer, generic props, site, new canon, automatic code build or merge. Persist review result in owner Return and one next gate."
