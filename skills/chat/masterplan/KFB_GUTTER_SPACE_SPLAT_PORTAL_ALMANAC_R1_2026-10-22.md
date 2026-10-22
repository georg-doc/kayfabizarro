# KFB · Gutter Space × Gaussian Splatting × Portal/Almanac Travel — Three Idea Clusters R1

**Date:** 2026-10-22  
**Source:** Georg's three explicit idea clusters in ChatGPT Web, following the 2026-10-18 KFB Flatworld / Comic Gutter concept and the discussion of Gaussian Splatting.  
**Status:** GEORG IDEA INTAKE + DESIGN PROPOSAL. **Not** an implementation, canon promotion, new runtime, world topology decision, or human acceptance.  
**Owner:** **Existing KFB Infinite Canvas / Meta-Narration design lane**, on Draft PR #423. Receiving consumers only if separately authorized: current Card/Deck/PDF Viewer and Almanac data owners, game/world/instance owner, Track Core/Joyride, Scene/TransitionRecipe packaging, and existing KFB Audio/VFX owners.  
**Terminology correction:** The intended term is **Gutter Space** (the space *between comic panels*), NOT “Gatter-Space”. The speech-to-text/audio correction is not a request for a “cave audio bugs” feature. The meaning is the comic gutter extended into a spatial, navigable hyper-space.  
**Boundaries:** WB2/Island MVP R4 remains STOPPED / NO MVP / F-R39 FAIL and Four-Island Story Vision A/B/FAIL remains authoritative. This document does not reopen R4 or authorize geometry.

## 0 · Unifying thesis — Gutter Space as traversable closure

The black ink frame separates playable panel/deck zones; the white/negative-space gutter is not merely empty floor but can become a traversable editorial interval between scenes, cards, arguments, visual languages and world instances. At its largest scale, this interval can expand into a surreal, volumetric **Infinite Canvas / higher-dimensional-feeling transit space**: it may *suggest* a tesseract, Escher-like spatial contradictions, changing scale, animation, moving architecture or collage; no literal mathematically valid 4D engine is assumed.

This extends, without replacing, the 2026-10-18 Flatworld design and the 2026-09-14 Infinite Canvas / Meta-Narration canon/proposal split. **Aby Warburg** contributes semantic constellation/adjoining images; **Scott McCloud** contributes the omitted action/meaning reconstructed by the reader/player. Closure remains the player's act, not a forced NPC explanation.

An authored journey may therefore follow:
`KFB terrestrial / card zone → visible frame, threshold or portal → (optional) Gutter Space / Almanac constellation → destination choice or authored transit track → target deck/card/instance → same world owner resumes normal KFB Terra gameplay → lawful return`.

The optional transit may be instantaneous, short, exploratory or spectacular depending on dramaturgy; **every world transition need not become a long rollercoaster ride**.

## Cluster 1 · Splat portals, distant deck regions, instances and dungeons

**Georg's idea:** Use Gaussian Splatting or a similar volumetric scene technique for visually legible portals between widely separated card zones, deck clusters and surreal worlds; reuse the idea for separately instanced spaces such as dungeons, specifically **Plato's Dungeon Raid**.

- Portal threshold: the **existing** portal/instance/TransitionRecipe boundary determines destination, entry/return transforms, context and progression; a splat scene is a **visual presentation consumer**, never the authority for world state, collision, locomotion or teleporting.
- Through-the-portal look: a view-dependent distant splat environment, optionally masked by physically authored ink/paper frame geometry and shaders. Camera parallax, occlusion and local movement need proof; a video/asset URL is not splat source-object isolation.
- Destination: interactive walk surfaces, character rigs, gates, enemies, pickups and collisions remain owned by conventional meshes/physics and their existing owners; splats could depict static scenic shells, non-interactive interiors or background architecture.
- Plato example: existing **historical proposal** places a future philosopher RPG dungeon hook under/behind the Caveman home / goldmine. It is not an implemented dungeon, not a current Town gameplay acceptance, and its parent birthday handoff is explicitly archived/outdated; use solely as provenance for a future design exploration.
- The canonical Town/Dystopia/Utopia/Protopia geography and biographies remain intact; 130+ deck/instance exploration is an expansion direction, not a statement that 130 worlds already exist.

## Cluster 2 · Spatial Cards, PDF Viewer and searchable Fractal Almanac

**Georg's idea:** Make the **existing** KFB comic Card/PDF Viewer visible and usable within a spatial/portal landscape, and make the accumulated **Fractal Almanac** navigable/searchable as an Infinite Canvas. Selecting a deck/card could transport the player to the corresponding deck zone or selected card's playable locus where one exists.

**Distinct functions (do not conflate):**

1. **Canonical source and reading:** The Deck/Registry source retains real PDFs, JSON, page/crop verification, exact `deckId`/`cardId` references; existing Deck Viewer v5 deep links `?deck=&card=` and `?deck=&page=` are a *current documented product route*. The historically cited v4/v1 viewer remains a donor, not an authorization to rebuild page parsing from scratch. Keep PDFs/cards genuinely readable via the actual viewer/UI; **do not rasterize legible card text into blurry Gaussian splats**.
2. **Almanac memory and query:** Almanac keeps collected/discovered card facts, relations, provenance and save/event semantics; the spatial environment is only a **read-only projected navigation/view** over its existing records, not a new card database, inventory, indexing SSOT or fabricated player collection. Search/filter/relatedness can surface a constellation of known cards.
3. **Spatial navigation:** Selected deck/card can highlight a framed card plane, panel wall, room, node, route or portal. A `Go to world` action is allowed only when a validated `destination/worldObjectRef` exists in the receiving gameplay owner, together with permitted unlock/state checks. Otherwise open the real viewer or show a non-teleportable item; never auto-invent a world for every collected card.
4. **Fractal expansion:** card → page/panel → deck collection → related cluster → world lens may be zoomed, unfolded or entered, without requiring every deck to be a literal rigid cube. Semantic proximity and spatial distance may differ deliberately.
5. **Return:** Preserve selected `deckId`/`cardId`, instance/world context, return point and authoritative save/progress; no second teleport owner. A navigational shortcut must not silently bypass existing locks.

**Candidate small experience:** From a collected card in the Almanac, enter a physically navigable small constellation, select one real Card, inspect it through the current PDF Viewer, and either (A) return to the Almanac or (B) transition through an approved existing instance route. This tests reading + memory + travel without inventing 3D UI chrome.

## Cluster 3 · Gutter-Space rollercoaster / Track Core traversal / surreal Infinite Canvas

**Georg's idea:** Stage the comic gap between two panels as a spatial journey. The player crosses the ink boundary, enters an expanded Gutter Space and moves along a spectacular, **track-bound rollercoaster-like passage** through splat-rich scenes, animated ideas, language/color worlds, Escher-like architecture and apparent higher-dimensional spaces. At the exit, the traveler re-emerges in ordinary KFB Terra/gameplay within a different card zone.

**Authoring and control directions (all PROPOSAL):**

- **A. Ride / directed:** stable authored ride along an existing **Track Core/Joyride** route and camera/vehicle owners; rail profile, collision and transport physics remain there. The visual Gutter environment is not a parallel rail solver.
- **B. Partial agency:** optional limited speed, gaze, selection, branching or side-to-side agency **only** if existing motion/camera owners can support it safely. A brief focused ride can be preferable to introducing a new free-flight controller.
- **C. Free traversal:** separate later creative option, not assumed by the ride proposal. Must respect normal active-world input, camera, save and collision ownership.
- **Appearance:** strong changes in color, scale, typography, language and sonic landscape can express an editorial cut rather than ordinary road travel. Surreal moving Escher spaces, apparent impossibilities, tesseract-like folding and animated portal mouths can be composited from camera tricks, portal views, meshes, procedural geometry, shaders, splats and temporal editing.
- **Important technical discrimination:** Gaussian splats are *rendered scene primitives* (or a captured/render-derived scene), **not** automatically the portal shader, true geometry/collision, a train track, real non-Euclidean spatial logic, or animated Escher machinery. Static 3D splats excel at rich scenic backgrounds; actual dynamic bending/architecture often requires meshes, animation, deformation, camera transformations or dynamic-splat research with memory/performance costs.
- **Possible sources:** verified KFB 3D scene renders/Blender multi-view captures, licensed/cleared third-party photographic scans or authored splat sources of recognizable locations. Famous-site imagery has separate capture/source/provenance, privacy, trademark/rights and public-asset policies. Asset Librarian may discover/queue candidates only; source isolation and rights precede integration. Never silently promote purchased media to public routes.
- **Failure conditions:** generic neon wormhole, unrelated FX, a looping tunnel with no editorial meaning, fake fractal mathematics, a rollercoaster that ignores Track Core, invisible loading without recoverable fallback, unreadable/overgrown ink-frame interface.

## 4 · Reuse map — one owner per responsibility

| Concern | Existing receiving authority / donor | This proposal may add |
| --- | --- | --- |
| Comic gap, closure, Infinite Canvas | `skills/chat/masterplan/KFB_FLATWORLD_COMIC_GUTTER_DESIGN_2026-10-18.md`; `FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`; meta-narration | Gutter-Space presentation/experience grammar |
| Authentic panel ink, paper frame | `media/kfb/KFB_INK_OUTLINE_STYLE_v2.md` incl. `inked` and `bend` | Materialized frame/passage proposal |
| World / active mode / coordinates / physics | Current receiving world/game owner; Four-Island story source | No second world runtime |
| Instances and handoff | `skills/chat/LIVING_MASTERPLAN.md` Museum/Infinite Canvas; `GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md` TransitionRecipe proposal | Specialized Gutter Space transition class/presentation, only after owner acceptance |
| Tracks / ride / drive | Existing Track Core route/contact + Joyride presentation and Drive/camera owners | Gutter ride scenario; no custom path/collision engine |
| Card identity / real PDF pages | `media/kfb/index.json`, Registry, Card Viewer v5; Librarian Deck Library | Readable spatial arrangement; no copied or fabricated cards |
| Almanac | Existing Fractal Almanac collection/provenance owner | 3D projection/search/navigation, not new memory/save owner |
| Audio, text, voice, VFX | Existing KFB Audio, speech/ChatterBox, narrative owners | Contextual score/language/visual transitions as consumers only |
| Splats and third-party visuals | Source-verified Gaussian splat renderer/editing donors only after source isolation; Asset Librarian rights pipeline | Static/dynamic scenic visualization with mesh/portal fallback |

## 5 · Practical proof sequence (deferred, not authorized build)

1. **Read-only design/sample contract:** Recover source and owner of current Museum/PDF Viewer v5, real Almanac collection/provenance, Track Core/transition reader and a real KFB source scene. Separate factual implementations from conceptual docs.
2. **Single static/donor visual proof:** Show actual, license-safe splat source **in isolation** beside source-authentic ink panel/frame and a conventional-mesh/baked alternative. Record draw/occlusion, cameras, clipping, file size/VRAM/FPS and mobile/WebGL fallback; no claim from a loaded URL alone.
3. **Single cross-cluster demonstration only after authorization:** Source-backed Card selection from Almanac → view real PDF card → Gutter threshold with *one* short track-bound visual passage → existing reachable destination/return. If the full route is too expensive, ship the smallest legitimate owner seam and retain the others as proposals.
4. **Narrative review:** Is there a perceivable semantic contrast or 'closure' between source and destination, not just VFX? Use actual KFB art, no replacement identity or generic UI.
5. **Independent review and owner acceptance:** Current source/build owner decides whether the visual language may be adopted. No merge/Live promotion on design evidence.

**Candidate engineering metrics (targets to set only with owner/WS0):** correct source Card and destination, real return/unlock behavior, readable PDF, no double control loop, stable camera/track contacts, clear frame crossing, measured frame-time/VRAM/assets for tested device(s), and graceful fallback. Do **not** invent success counts or FPS targets before an actual run.

## 6 · Open decisions and risks

- Is Gutter Space (i) a short transitional cut, (ii) persistent explorable instance, (iii) searchable Almanac navigation world, or (iv) multiple views of a single owner-managed instance? This document preserves the options; it does **not** name a new runtime.
- How literal is the white paper gutter versus a spectacular evolving transit interior? They may be distinct scales/treatments of one graphic grammar; compare their clarity in the existing source-based Four-Island A/B direction.
- How many destinations have actual permissible world instance mappings today? **Unverified**. Default to read/view, not teleport-to-fictional-content.
- Which renderer/web capabilities support splats under current Three.js/R3F and mobile constraints? **Unverified**; no Spark/SuperSplat adoption, code import or Stage claim.
- Animation/dynamic splat transforms, lighting/shadow parity with KFB Clay, compression/streaming, depth sorting and license/sources are explicit experiment risks.
- **Current world caution:** Four-Island R4 was stopped for composition/world-model coherence, not simply lack of effect technology. Gutter spectacle must not mask missing lived history, meaningful Resident activity or source relation.
- No finished render, page, browser, physical source isolation, critic, track ride, shader integration or functional teleport is asserted.

## 7 · Next single gate

**WS0 / existing Infinite Canvas design owner:** Triage this three-cluster proposal against Flatworld PR #423 and the Four-Island Story Vision A/B. Decide whether one **source-isolated Gutter-Space visual storyboard** (real two zones + real Card + visible threshold + possible guided passage) is worth commissioning **without** reopening R4. Implementation only after a separately scoped receiving-owner authorization.

## 8 · GitHub source anchors (verified 2026-10-22)

- Flatworld original and Return, existing Draft PR #423: `skills/chat/masterplan/KFB_FLATWORLD_COMIC_GUTTER_DESIGN_2026-10-18.md` + `KFB_FLATWORLD_COMIC_GUTTER_RETURN_2026-10-18.md`.
- `skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`; `skills/chat/masterplan/KFB_META_NARRATION_ADDENDUM_2026-09-14.md`.
- `skills/chat/LIVING_MASTERPLAN.md` (existing Museum/Infinite Canvas and historical Card Viewer donor description).
- `tools/asset_registry/librarian/README.md` (current Decks tab 130 tracked decks / 6,985 card rows; stable Card Viewer v5 links and kfb.card-ref/1; documented features, **not** a new test).
- `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md` (proposed TransitionRecipe).
- `skills/chat/recovery/KFB_ISLAND_MVP_INTEGRATION_CENSUS_2026-10-07.md` (current known ownership and portal choices).
- `media/kfb/KFB_INK_OUTLINE_STYLE_v2.md`.
- `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`; `skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md`.
- Historical/archived provenance only: `skills/chat/town/references/TOWN_POST_R022_BIRTHDAY_STARTSCREEN_TRAVEL_HANDOFF_2026-09-15.md` (§8 Plato cave/goldmine idea; archived header forbids execution).
- User-mentioned inspiration: `https://www.reddit.com/r/TopologyAI/s/2bdB4LkIdp`. Original Reddit clip is **inspiration**, not locally audited source code, license, test or verified production donor.
- Production Control earlier feasibility checkpoint: `KFB-3D-GAUSSIAN-SPLAT-RESEARCH-2026-10-22` (research only, 0 integration tests).

## Additive history

- **2026-10-22 · Georg direction captured:** Cluster 1 portals/dungeons, Cluster 2 PDF Cards/Fractal Almanac spatial navigation, Cluster 3 **Gutter Space** surreal rollercoaster/hyperspace, composable as an Infinite Canvas experience. Technical boundaries retained. Documentation only; no runtime/acceptance claim.
