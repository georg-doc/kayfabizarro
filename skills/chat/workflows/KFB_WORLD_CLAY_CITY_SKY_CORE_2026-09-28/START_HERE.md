# KFB World MVP · Clay City + Sky Core

Status: `READY_FOR_ONE_PRODUCTIVE_SLICE`

Date: 2026-09-28

Current receiver: World M2A / World r2 / WB2

Current candidate: `georg-doc/kayfabizarro#282`

Public route: R5 human-failure evidence only. R6 is not published.

## Product decision

The MVP no longer needs every OSM building as visible runtime geometry.

Use OSM only for the parts that create useful orientation:

- road centre-lines, graph, class, width and names;
- a small number of landmark anchors;
- water or zone boundaries only where gameplay needs them;
- provenance and attribution.

Build the visible city from verified KayKit, Kenney and Tiny Treats donors in the KFB clay language. OSM building footprints may inform density offline, but they are not the visible or collision runtime truth.

World r2 / WB2 remains terrain and persistence owner. Movement, Drive, Flight, Resident and Track owners stay unchanged. This is a presenter and collision-recipe replacement, not a second world runtime.

## Why this is now the preferred MVP path

The current World M2A scene still pays for and exposes the wrong things:

- roughly 700 Hürth building extrusions plus a far block shell;
- a 4096 × 4096 canvas road/curb map whose edges become visibly rasterised;
- OSM building collision that must follow the visible city;
- hundreds of separate meshes, geometries and materials.

R6 repaired the stale mobility focus and raised the adaptive resolution floor, but it cannot make a raster road geometric or turn OSM blocks into the intended KFB city.

## One productive slice

### `CLAY-CITY-A1 · Road Skeleton + Kit District`

Do not build the whole 716 m zone. Build one coherent 184 m play tile containing:

- one residential street;
- one shop/crossroads pocket;
- one taller landmark or silhouette anchor;
- one Claymation-Trax branch or ramp socket;
- one small active Resident group;
- one light billboard/sign socket;
- continuous off-road terrain around it.

The same runtime must support Ground, direct Auto, Drive, Offroad and Flight inspection.

### Gate 0 · donor isolation

Show the actual source object before integration:

- one KayKit City Builder / compatible building donor;
- one Tiny Treats Homely House or shop donor;
- one Kenney building only if an actual source model is verified. `Kenney Buildings` is otherwise `SOURCE_REQUIRED`; Racing/Nature assets do not prove it.

Record source path/ref, visible isolated capture, bounds, pivot, material count and triangle count. A URL that loads is not design proof.

### Gate 1 · terrain-conforming Clay road seam

Replace the active tile's canvas road/curb pixels with geometry generated from the OSM road graph:

- sample chained centre-lines at 2–4 m;
- derive left/right edges from real class width;
- project every vertex through the existing terrain height owner;
- use a 2–4 cm presentation lift and a 5–10 cm side skirt against gaps/z-fighting;
- stitch intersections and tile boundaries once; never stack overlapping road bands;
- keep the driving surface stable and readable;
- make the first curb visual, not a hard collision wall;
- retain continuous terrain contact off-road.

Pass means no visible raster edge, crack, floating ribbon or vehicle fall-through in Ground, Drive and Flight views.

### Gate 2 · deterministic Kit district

Use 6–12 verified building archetypes and approximately 60–120 deterministic instances.

Each visible building is a recipe:

`family + floorCount + bodyVariant + roofVariant + facadeRhythm + palette + deformationSeed`

Rules:

- predominantly 1–3 floors, selected 4–6 floor accents, rare 7–9 floor landmark silhouettes;
- shared Clay materials and per-instance colour/seed data instead of material clones;
- fixed facade sockets for isolated doors, windows, awnings, balconies and signs;
- one-time squash/stretch, small lean and asymmetry; no per-frame deformation of every house;
- foundation pad/skirt follows the lowest support height; buildings do not tilt with terrain;
- render transforms and simple collision proxies come from the same recipe;
- remove OSM-building collision from the active tile when its visible OSM buildings are removed.

### Gate 3 · LOD and performance

- Near 0–90 m: full verified Kit silhouette/details, selected shadows.
- Mid 90–220 m: reduced donor variant, no small props and no shadow casting.
- Far beyond 220–300 m: cheap silhouette clusters or fog/cull, never generic OSM blocks.
- Use 64–96 m chunks, hysteresis and the shared Ground/Drive/Flight focus repaired in R6.
- Instance per archetype × LOD × material family.
- NPCs outside the active pocket sleep; heavy billboard media loads only on approach/interaction.

Targets for the exact comparable scene:

- city-specific draw calls at or below 24;
- total draw calls no worse than R6;
- visible triangles at or below 200k unless one measured exception clearly improves gameplay;
- desktop and narrow p95 at or below 33.3 ms;
- moving resolution never below the R6 floors (desktop 0.80, narrow 0.72);
- local boot at or below 8 s;
- zero page, request and asset errors.

## Shared Sky owner

### `SKY-CORE-01 · World + Resident environment sky`

Do not add another ad-hoc background to World or Resident. Build one shared presentation owner with adapters for World M2A, Resident Atlas/Studio, Racer and later Combat.

Verified donor line to inspect before integration:

- Travel `skydome-shader.js` / `skydome-shader.v4.js`, including S/A variants;
- WorldDesign Lab `wd-sky.js`, which already compares Three Sky, Travel S/A, watercolor and TinySkies;
- Cologne Option C `cologne-sky.v1.js`, which adapts the Travel/TinySkies shader and places sky bodies/cards/dice;
- current Travel sky presets, moods and biome colours remain the look owner where they supersede older donor snapshots.

Expose the same three performance modes in World Environment and Resident Studio:

1. `BASIC` — gradient, sun/fog and cheap clouds;
2. `TINY_SKIES` — accepted Travel/TinySkies atmosphere and distance language;
3. `KFB_UNIVERSE` — optional cards, dice, planets/pulsing bodies and richer animation.

The sky must follow camera translation without parallax drift, keep a stable horizon in Ground/Drive/Flight, and never use the current broken watercolor wall as a default fallback.

Measure the same World tile and Resident graveyard in all three modes. Record GPU/frame cost, draw calls, texture memory, boot delta and visual regressions. Expensive bodies and animated embeddings must be independently switchable and distance/visibility gated.

SKY-CORE-01 does not block Gate 1. Integrate it only after the geometric road tile is stable, then include it in the representative performance baseline before public promotion.

## Model / provider routing

Selected productive executor: **Claude Coworker Desktop**, using the real local repository checkout, browser and GitHub access.

Reason: this is a demanding but bounded repository integration job, and Georg currently has substantially more Claude budget than OpenAI Work budget. Desktop execution is preferred for real asset inspection, local browser playtesting and small crash-safe GitHub checkpoints.

Use the executor-ready brief from PR #283:
`skills/chat/workflows/KFB_RESIDENT_UI_COWORKER_CLAY_CITY_2026-09-28/CLAUDE_COWORKER_CLAY_CITY_MVP_01.md`.

It adds the required KFB Knet-Strecke T4 source gate and the GitHub-to-Site handoff. Claude Design remains a visual/UI author only and must not own runtime integration. GPT-6 Sol/Astra remain fallback reviewers, not the selected current executor.

## Stop conditions

- no whole-city import;
- no new terrain, movement, camera, Resident or Track owner;
- no generic buildings or placeholders for missing donors;
- no second sky runtime;
- no Cloudflare publication before local browser and Georg freeplay acceptance;
- after two failed repair passes on the same road/contact gate: preserve the candidate and export failure recovery.

## Acceptance

Georg can walk, switch directly to Auto, drive on and off the geometric Clay road, fly over the same tile and see a coherent, colourful, varied KFB Kit city without raster edges, OSM block popping, invisible collision walls or ground holes. The shared sky is then tested as a measured environment option, not as decorative debt added after performance acceptance.
