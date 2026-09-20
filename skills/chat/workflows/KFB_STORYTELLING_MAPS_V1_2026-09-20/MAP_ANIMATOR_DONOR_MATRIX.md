# KFB Storytelling Map Animator · Donor Matrix

Status: **CURRENT SOURCE MAP · PLANNING**
Date: 2026-09-20
Planning branch: `planning/storytelling-map-animator-v1-2026-09-20`

This file exists to prevent donor drift and Claude "reconstruction".

## 1. Cartoon Map Board

Owner:
`tools/kfb-cartoon-map-board/`

Current main revision inspected:
`6c1b02a3338c005127d45bc7bff3ecbb785f1342`

Key source:
`tools/kfb-cartoon-map-board/src/app.js`

Verified current behavior:
- Europe board;
- OpenPlanetData country-boundary catalogue using OSM-derived GeoJSON;
- independent country extrusions;
- paper/cartoon materials;
- shadows;
- selection;
- focus;
- explode;
- story anchors;
- KFB Ink BAND adapter.

Important:
This is the implementation owner to extend.

Do not create `storytelling-map-engine-2`.

## 2. OSM City Lab

Owner:
`tools/osm-city-lab/`

Current main revision inspected:
`6c1b02a3338c005127d45bc7bff3ecbb785f1342`

### Ehrenfeld
`tools/osm-city-lab/data/ehrenfeld-v0/`

### Hürth
`tools/osm-city-lab/data/huerth-v0/`

### Corridor
`tools/osm-city-lab/data/corridors/ehrenfeld-huerth-v0/`

### Cologne Dom / Zentrum
`tools/osm-city-lab/data/dom-zentrum-v0/`

Current `dom-zentrum-v0` source package includes:
- `SOURCE_SPEC.json`
- `PROVENANCE.json`
- `normalized.json`
- `CLAUDE_CONTEXT.json`
- `DESIGN_CONTEXT.json`
- source Overpass cache/query.

OSM attribution remains:
**© OpenStreetMap contributors · ODbL 1.0**.

Animator consumes City Lab outputs.

It does not re-own:
- normalization;
- roads;
- building extrusion;
- City ENU;
- source provenance.

## 3. Hürth / Ehrenfeld Grotesque city presentation

Current City Lab modes:
- clean;
- cartoon;
- grotesque.

Grotesque remains a presentation mode.

Current City evidence includes:
- Ehrenfeld 372 roads / 1,808 buildings;
- Hürth 164 roads / 700 buildings;
- shared corridor source;
- deterministic presentation.

Do not convert Grotesque presentation into source geography.

## 4. Landmark authoring

Owner:
`tools/img2threejs/`

Current donor:
`tools/img2threejs/landmarks/pilot-06/`

Files:
- `SLICE.md`
- `index.html`
- `viewer.mjs`

Current decision:
- Grotesque = landmark-lane default;
- OSM environment = default review environment;
- Travel/TinySkies remains an alternate context;
- City building default remains separate.

Existing modular landmark set currently documented includes:
- Eiffel;
- Giza;
- Stonehenge;
- Pentagon;
- Spasskaya;
- Kremlin wall study.

A later integrated source proof also used a modular Grotesque Cathedral in Hürth as a style-only placement.

If a landmark is not geographically anchored, mark it:
`STYLE_INTEGRATION_ONLY_NOT_GEO`.

## 5. KFB deformation donors

Shared reference:
`travel/wip/travel_globe_wsa/kfb-cartoon-deform.js`

Use only where the geometry class fits.

Do not assume a building deformer is valid for country outlines.

## 6. Palette / story color

Preferred donors:
- `travel/travel-v16/terrain-v16/world-context.js`
- `travel/travel-v16/terrain-v16/world-palettes.js`
- `travel/travel-v16/terrain-v16/color-worlds.js`

Already provide:
- Story Modes;
- seed functions;
- card-derived palette logic;
- named palettes;
- story-following palette;
- color-world morphing.

Do not invent a new palette owner.

## 7. Skydome

Donor:
`travel/travel-v16/terrain-v16/skydome-shader.js`

Reuse through an adapter.

Do not create a generic Storytelling-Map gradient sky.

## 8. Map / particle FX

First donor families:
- Boxel Blitz FX foundation;
- `fx-pool.v1.js`;
- `dissolve.v1.js`;
- existing ripple logic;
- Travel ripple/fog;
- `media/3D_Assets/FX_Visual/`.

Any new effect must state why none of these donors fits.

## 9. Card / PDF / media

Existing owners:
- KFB Viewer;
- CardBuilder;
- Responsive CardRig;
- KFB Ink.

Animator receives a rendered media surface.

It does not own PDF parsing/rendering.

## 10. Theatre Curtain

Owner:
KFB Game Dev Studio.

Draft PR:
`georg-doc/kayfabizarro#114`

Branch:
`chat/gds-theatre-curtain-v1-2026-09-20`

Runtime:
`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

Technical evidence:
- local 22/22 PASS;
- public 25/25 PASS.

Human visual/physics acceptance remains separate.

### Official Three.js donor

Repo:
`mrdoob/three.js`

Pinned donor:
- commit `7300402f96c23bfa2174ffc0da01fb4e277d33da`
- Three.js `0.186.0`
- `examples/webgpu_compute_cloth.html`
- blob `0b3c18d87ac0d2428e6a558b6d09889e425dd537`

The official demo uses a real Verlet/spring cloth system.

### Hard rule

The Animator may use a curtain adapter.

It must not:
- draw an SVG curtain;
- draw a CSS curtain;
- invent a second Verlet cloth;
- copy the curtain runtime into the map module.

## 11. Animation / props

Current future donors:
- `skills/kfb-cartoon-animation_v2.md`
- Resident Atlas;
- Rig_Legacy;
- CapsuleCarl procedural motion;
- EyeRig.

Not part of SMA1.

## 12. Audio

Owner:
`media/3D_Assets/Audio/`

Board/card sources:
`media/3D_Assets/Audio/Card and Board/`

Not part of SMA1 unless one existing click/place cue is needed for clarity.

## Source-first checklist

Before an integration:

- exact path;
- exact revision;
- isolated output;
- visible donor identity;
- adapter seam;
- integrated output;
- no fallback.

A URL loaded successfully is not enough.
