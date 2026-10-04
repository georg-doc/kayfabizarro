# WB2 / World Studio · Joyride Visual World Recovery · 2026-10-04

Status: **READY FOR ONE PRODUCT REPAIR PASS**
Execution mode: **RECOVERY · one integrated visual-world pass**
Owner: **WB2 / PR #348**
Primary product surface: **existing World Studio GPT Site**

`https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/`

Do not create another Site.
Do not start Cloudflare-first.
Do not rebuild working gameplay/editor/persistence systems.

## Product failure to repair

Georg freeplayed the published MVP1 Site and returned **HUMAN VISUAL FAIL**.

Primary evidence:
`HUMAN_VISUAL_FAIL_JOYRIDE_2026-10-04.md`

The current world reads as:
- pale technical road/support geometry;
- flat grey void/background;
- sparse source objects placed into an integration scene;
- insufficient living-place composition;
- missing Joyride/T4 clay-road/world presentation.

## Root cause

R2D had an explicit unresolved WSA requirement:

`buildClayStrand(THREE, stream, …)`

The requirement was never completed.

The technical Track Core remained visible and was accidentally promoted from:

**route/support/collision mechanism**

to:

**final product presentation**.

That is the defect.

## KEEP · zero-regression boundary

Keep all functioning current owners/features unless directly proven broken:

- WB2 renderer/world/save owner;
- four-island topology;
- Track Core route/support/collision;
- Player and current movement;
- Residents;
- Cards / ChatterBox;
- Taxi/Drive where already functional;
- audio transport;
- Almanac/Lean Memory;
- World Studio/God Mode;
- Library/editor;
- terrain sculpt;
- save/export/import;
- primary GPT Site project.

Do not reimplement these.

## Required Joyride source

Pinned donor:

`georg-doc/kayfabizarro@927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f`

Exact presentation sources:

### Track look

`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/track-look.v5.js`

Blob:
`7c0d248391c3eaf1887a0afc97ee02b25f6dec85`

### Markings

`.../lab-track/road-markings.m1.js`

Blob:
`68a0c21a2c68c0b7db72046146008b474979ec15`

### Transition atlas

`.../lab-track/transition-atlas.v1.js`

Blob:
`cfef150a74060bfc6ff00ab049529d8710845bfc`

Joyride J06/J14 source direction:

- T4 clay strand = connecting visual element;
- rolling clay terrain, not slab world;
- K2 clay presentation;
- M1/M2 road marking vocabulary;
- rounded clay barriers and ends;
- groove / rim bulge / belly volume;
- clay patch/drop transitions instead of generic fades/hard cuts;
- clay VFX;
- canonical shadow/facade rules.

## Required architecture

### Track Core remains authoritative for:

- route geometry;
- support path;
- road graph;
- collisions;
- bridge connectivity;
- gameplay traversal facts.

### Joyride presentation adapter owns only:

- visible strand mass;
- barrier/curb presentation;
- markings;
- transition presentation;
- clay materials/detail;
- support presentation where visually required.

Do not import the whole Joyride scene/runtime.

Do not create another road engine.

## Implementation requirement

Extract/rehome the existing Joyride presentation logic into a reusable adapter equivalent to the already-requested:

`buildClayStrand(THREE, stream, options)`

It may have another exact API name if repository integration demands it, but it must remain one reusable presentation module and one owner.

The implementation must consume the **existing Track stream**.

## First-frame correction

The repaired Town frame must not be dominated by bridge/road engineering.

At comparable freeplay camera height:

1. World/terrain must occupy the visual frame as the primary mass.
2. Road must feel embedded into the clay world.
3. Barriers/bridgeheads must read as KFB/Joyride clay construction.
4. Grey void must no longer be the dominant background.
5. Existing buildings/Residents/props must compose into a place with foreground/midground/background.
6. Castle, Clown/Resident activity, road and nearby buildings need an intentional hierarchy.
7. No visible legacy OSM content.
8. No generic filler objects added to fake density.

## Livingness / composition

Do not solve the screenshot by simply adding more props.

Use existing source-clean objects to establish:

- clusters rather than even scatter;
- destination/landmark hierarchy;
- paths and negative space;
- Resident/activity focal points;
- meaningful roadside/settlement relationship;
- depth and occlusion;
- world biography.

The target is an authored **living toy world**, not an asset gallery.

## Source proof

Before integrating the Joyride road presentation:

1. show original J14/T4 source road in isolation;
2. show extracted/reusable presentation adapter in isolation on a minimal Track stream;
3. show same adapter on one R2D/WB2 Town segment;
4. only then integrate the full visible world.

This is internal evidence, not four Georg gates.

## External Critic

Run the existing no-code critic after the integrated repair.

Mandatory scored dimensions for this repair:

- JOYRIDE_SOURCE_FIDELITY
- KFB_CLAY_VISUAL_COHERENCE
- ROAD_TERRAIN_INTEGRATION
- FIRST_FRAME_COMPOSITION
- LIVING_PLACE_DENSITY
- REGRESSION_HEALTH

Do not award a visual PASS from source names or green unit tests.

## Acceptance

Before returning to Georg:

- same WB2 world still boots;
- Player still works;
- Build/God Mode still works;
- object edit and terrain edit still work;
- save/import remains intact;
- actual Joyride presentation source is present in runtime/source audit;
- representative Town screenshot visibly shows the Joyride/K2 design language;
- no rejected Hürth/OSM visible source;
- no second world/road/save owner;
- update the **existing GPT Site**.

No Cloudflare requirement before Georg's Site review.

## Return

Return one updated product:

- exact PR/head;
- changed files;
- exact Joyride source mapping;
- isolated donor/adapter/integrated evidence;
- regression tests;
- critic scores;
- exact updated GPT Site version/deployment;
- same Site URL if Sites supports in-place update;
- unresolved visual issues.

Exactly one human gate:

**Georg reopens the World Studio Site and judges the repaired Town/world visually and in freeplay.**
