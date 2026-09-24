# Grounding + World Look + Grotesque OSM v2 · Pilot 09 · 2026-09-20

**Status:** IMPLEMENTATION SLICE  
**Owner:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Branch:** `img2threejs/grounding-worldlook-grotesque-v2-2026-09-20`  
**Outcome:** one POC proving terrain grounding + harmonized world look + less card-stack-like OSM massing  
**Reserved Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/grounding-worldlook-osm-grotesque-v2/`

## USER DIRECTION

First fix the shared foundations before the Cologne city sprint:

1. **Grounding** — landmarks/buildings transition directly into terrain; no round bases / visible ground plates.
2. **World look matching** — landmark/OSM colours are harmonized with the host world; original landmark colour is secondary.
3. **Grotesque OSM City rework** — move beyond the current thin card-stack impression toward chunky cubist building masses with readable material codes.
4. **Then** continue landmark integration with the prepared Cologne city sprint.

## DONORS READ BEFORE IMPLEMENTATION

### Current KFB / OSM
- main at slice start: `2232e755eb41fbc4c65fe33aa92b93bb4c8294d5`
- current OSM deformer: `tools/osm-city-lab/src/style/cartoon-city.js` blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- current tested OSM presentation mesh: `city-style.mjs` blob `788de83c97d12ef71260be18c1996dae065e6e48`
- current City style: `f129cca3041b55b84de26048dad7aef8fac8b292`
- Pilot 08 terrain donor (rejected for visible stripes): blob `c70d11725e3a3ced444a3d95ff06f05e19f4b5bb`
- Pilot 08 modular Cathedral donor: blobs `8a70e132134fa56094707b97828ae70b6748f403` / `d7c81468113f42a56cd3db66d3ac5490d0081bd0`

### Current Travel / TinySkies surface truth
- `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`
- `simplex-noise.js` blob `201631f08df081f5695269923e2c744c88b7a5d7`
- `terrain-surface.js` blob `9513347b6e3192dfefbeb3371085b13ac41ebb5d`
- `globe.js` blob `80ebf8cde3649b2e0963d7d517a77f61421c70e1`

Key donor lesson: TinySkies/Travel does **not** use sinusoidal stripe terrain. It uses multi-octave simplex noise, irregular/faceted surface reading, height/biome colour logic and high-frequency surface detail/rim to prevent broad planar bands from reading as rigid strips.

## PROTECTED BOUNDARIES

- Pilot 08 remains failed-publication history; do not patch it.
- OSM collision/export geometry remains undeformed.
- no real Cologne Cathedral OSM binding in Pilot 09;
- no KayKit door asset is loaded yet — only a semantic door/material code seam;
- no new physics/audio/world owner;
- no Live promotion.

## TARGET POC

Use the current Hürth source scene as the controlled test bed.

### Grounding
- replace the old sine-strip terrain with a TinySkies-derived simplex field;
- use a staggered triangular mesh, not broad regular-strip visual bands;
- derive soft support fields from actual OSM roads/buildings and the landmark footprint;
- remove the Cathedral foundation mesh from presentation and rebase the remaining geometry to terrain;
- no plaza cylinder / no visible ground plate.

### World look
- one OSM City world light/rim/fog;
- building and landmark material families share the same palette neighbourhood;
- Cathedral may deviate from historical grey if the scene harmony improves;
- local glazing/window/door accents stay semantic.

### Grotesque OSM v2
- preserve real OSM footprints;
- create fewer, chunkier floor bands rather than 7 thin shifted cards;
- deterministic per-building band scale/shift/rotation;
- material codes: wall family, floor accent, roof cap, window warm/cool, street door;
- front door chooses the facade nearest a driveable OSM road;
- windows stay sparse comic shorthand;
- optional future KayKit/Frankenstein replacement is encoded as metadata, not invented now.

## DONE WHEN

- no visible Cathedral base/plate;
- terrain POC no longer uses sinusoidal stripe functions;
- urban support field is derived from OSM features / footprint distance;
- Grotesque v2 uses semantic chunky bands and emits window + door material codes;
- legacy Grotesque remains available for A/B;
- real browser screenshots prove Grounding / World Look / Grotesque v2;
- the Cologne sprint proposal is persisted but not started until this gate is reviewed.
