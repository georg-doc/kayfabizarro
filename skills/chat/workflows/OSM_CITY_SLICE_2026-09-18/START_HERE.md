# KFB OSM City Slice · Köln-Ehrenfeld v0

**Datum:** 2026-09-18  
**Status:** PREPARED BRIEF · NO RUNTIME YET  
**Implementation home proposal:** `tools/osm-city-lab/`  
**Consumer owners:** Travel / Free Roam / later Race or other named consumers keep their runtime ownership.

## 0 · Goal

Build a modular pipeline that turns a small real OpenStreetMap area into a stylized low-poly KFB urban scene that can later be walked and driven.

Primary pilot: **a deliberately small Köln-Ehrenfeld area**, not all of Cologne.

Parallel complementary pilot: [**Hürth / Stotzheimer Straße**](HUERTH_PILOT.md) — suburban/off-road/high-speed Free Roam test, with a smaller v0 clip inside the broader 1.5 km discovery envelope.

Core sequence:

```text
OSM vector data
→ normalized local city graph
→ low-poly road/building/landuse geometry
→ KFB materials / cartoon massing
→ consumer-ready walk/drive scene
→ later landmark / prop / resident hooks
```

This is not a GIS product, a second Travel engine, or a city simulator.

## 1 · Hard boundaries

- OSM provides **data**, not the runtime owner.
- Travel remains World/Terrain/Mode/Persistence owner when consumed there.
- Free Roam / Drive reuses the selected existing movement owner; OSM City Lab does not invent a third vehicle controller.
- Asset Registry/Librarian remains source/provenance owner for GitHub assets.
- All existing assets come from GitHub when available.
- Do not scrape or bulk-cache OpenStreetMap raster tiles for city generation. Use vector OSM data.
- For the small pilot, a read-only Overpass query is acceptable if cached and rate-limited; production/browser runtime must not depend on repeatedly querying the public Overpass service.
- Preserve OpenStreetMap attribution and ODbL/source metadata in every exported dataset/site. Keep raw/derived OSM data clearly separated from KFB code and separately owned assets.
- No entire Cologne, no traffic simulation, no police/wanted/economy system, no photorealistic city.

## 2 · Exact proposed tool structure

Create only when implementation begins:

```text
tools/osm-city-lab/
  README.md
  START_HERE.md
  CHANGELOG.md
  index.html

  src/
    osm/
      fetch-or-import.js
      normalize.js
      tags.js
      projection.js
    geometry/
      roads.js
      sidewalks.js
      buildings.js
      roofs.js
      landuse.js
      water.js
    style/
      kfb-city-materials.js
      palette.js
    export/
      scene-recipe.js
      provenance.js
    viewer/
      app.js
      camera.js
      diagnostics.js

  data/
    ehrenfeld-v0/
      source.overpass.json
      normalized.json
      PROVENANCE.json
      STYLE.json

  scenes/
    ehrenfeld-v0.json

  docs/
    SOURCE_REVIEW.md
    OSM_DATA_PIPELINE.md
    STYLE_GUIDE.md
    CONSUMER_CONTRACT.md
    TEST_PLAN.md
    DONOR_HOOKS.md

  tests/
  evidence/
  _handover/
```

Do not create every file as empty boilerplate. Add modules only when their responsibility is real.

## 3 · The first three slices

### S0 · OSM Source + deterministic blockout

Pick one compact Ehrenfeld bbox, ideally about **400–800 m across**, around a useful mix of residential streets, at least one larger road/intersection and several building blocks.

Record exact bbox and query in `PROVENANCE.json`.

Read at minimum:

- `highway=*` ways needed for roads;
- `building=*` footprints;
- `building:levels`, `height`, `roof:shape` when present;
- useful landuse/leisure/natural polygons;
- water/waterway when present in the selected bbox.

Project WGS84 to a deterministic local ENU/metre frame around a recorded origin. Preserve OSM IDs and source tags in normalized data.

Fallback rules must be explicit, for example:
- width from `width` when usable, otherwise road-class defaults;
- building height from `height`, else levels × documented floor height, else class/default;
- no random geometry without a stable seed based on OSM identity.

**S0 gate:** reload of the same cached source produces the same normalized graph and blockout geometry.

### S1 · KFB low-poly city look

Generate:

- road ribbons and intersections;
- simple sidewalks/curbs where useful;
- extruded building footprints;
- a small deterministic roof vocabulary;
- landuse/green/water surfaces;
- a limited KFB palette/material system.

Start without photo textures.

Buildings can remain simplified, but should read as an urban fabric rather than grey GIS boxes. Use a few controlled classes: masonry/warm, pale/plaster, dark/industrial, roof families, accent shopfront bands, etc.

The style layer must be reversible and independent from OSM source geometry.

**S1 gate:** top/oblique/street-height views read as the same neighbourhood; no gross road/building overlaps; KFB style remains legible without hand-placing assets everywhere.

### S2 · Consumer-ready Walk / Drive probe

Do not write a new locomotion or vehicle engine inside OSM City Lab.

Export a compact consumer scene recipe containing:

- origin / local frame;
- road surfaces and centreline metadata;
- walkable sidewalk/plaza surfaces;
- building obstacle footprints;
- terrain/water/green classes;
- safe spawn/parking/test anchors;
- deterministic source/provenance references.

Then mount it into the named Free Roam / Travel test consumer.

First consumer loop:

```text
spawn on foot
→ walk along sidewalk / cross a street
→ reach a parked vehicle
→ drive slowly through intersection
→ reverse / turn / park
→ short road-to-terrain transition
→ stop / exit
```

Drift/boost/ramp can be added to this same fixture after base reverse/parking control works.

**S2 gate:** consumer can walk and drive the same scene without geometry duplication or a new physics owner.

## 4 · Ehrenfeld v0 acceptance checklist

### DATA

- [ ] exact bbox + timestamp/source recorded;
- [ ] OSM IDs preserved;
- [ ] attribution / ODbL note visible in docs/site;
- [ ] cached source used for reproducible tests;
- [ ] no runtime dependency on OSM raster tiles;
- [ ] parser handles missing heights/levels without NaNs.

### GEOMETRY

- [ ] roads form continuous readable corridors;
- [ ] intersection joins do not leave major holes/spikes;
- [ ] buildings do not sit in road carriageways except where source geometry actually requires review;
- [ ] basic roof/massing orientation is stable;
- [ ] water/green polygons are not treated as driveable asphalt;
- [ ] geometry regenerates identically from the same source+style seed.

### VISUAL

- [ ] neighbourhood is clearly low-poly/cartoon, not raw GIS grey;
- [ ] top, oblique and street-height views all remain readable;
- [ ] palette works beside existing KFB/TinySkies colours;
- [ ] no photo-texture dependency in v0;
- [ ] landmark placeholders remain optional.

### WALK / DRIVE CONSUMER

- [ ] walking surface and building obstacles align visually;
- [ ] vehicle can perform slow forward/reverse;
- [ ] one three-point turn or equivalent manoeuvre works;
- [ ] parking-space test works;
- [ ] one intersection can later support controlled drift/boost;
- [ ] road↔terrain transition is explicit and tested;
- [ ] no hidden second movement/collision world;
- [ ] save/reload preserves the authored city scene in the receiving consumer.

### STATUS

- [ ] implementation, automated tests, public deployment and Georg acceptance reported separately.

## 4.1 · Game Development Studio · optional game-ready packaging lane

Use [GAME_DEV_STUDIO_ASSET_PACKAGING.md](GAME_DEV_STUDIO_ASSET_PACKAGING.md) as the bounded plugin contract. Game Development Studio may package real KFB/KayKit residents, vehicles, animation mappings, colliders, VFX/SFX anchors and reusable City asset families, while canonical GitHub sources and consumer owners remain unchanged. Start with one resident + one BOX1 vehicle + minimal event bundle before any batch expansion.

## 5 · Donor hook A · img2threejs / landmark geometry

Current source:

`tools/img2threejs/`

Current status matters:

- the Kölner Dom prototype is **handwritten procedural Three.js**, not generated by the external img2threejs pipeline;
- static source checks are PASS;
- browser render, reference fidelity, GLB export and World integration are still unverified/not implemented.

Therefore **do not make img2threejs a prerequisite for S0–S2**.

Use it later as a landmark lane:

```text
OSM landmark footprint / position
→ existing GitHub landmark asset if available
→ otherwise reference-driven low-poly landmark candidate
→ visual/reference QA
→ exportable GitHub asset or supported procedural module
→ explicit City scene override
```

Good candidates: Kölner Dom, church towers, bridges, distinctive silos/towers or other silhouette anchors.

City Lab should support a future `landmarkOverride`/landmark placement hook keyed to OSM identity, but must work without any custom landmark asset.

Do not infer architectural truth from a photo-only reconstruction; OSM footprint and other documented dimensions may provide placement/scale constraints while img2threejs-style work supplies recognizable massing.

## 6 · Donor hook B · 2D Animation Studio / 2.5D city actors

Current source:

`tools/2D Animation Studio/`

The Studio is the current browser-first owner for reusable 2D/2.5D cutout modules. Its first Eumel lab proves the intended part/pivot/hampelmann direction but is **DocCheck content**, not a KFB city resident and not the final visual source even for Eumel.

Do not copy Eumel into KFB.

Reuse the **mechanism** later for KFB-authored sources:

- flat/cutout residents;
- animated signs / posters / shop-window characters;
- murals, flags, cardboard figures;
- 2.5D prop actors;
- background crowds where full 3D residents are unnecessary.

City consumer contract should eventually accept a generic cutout module with:
- source asset/provenance;
- part/pivot hierarchy;
- world anchor / scale;
- facing policy: fixed-world, limited billboard or camera-facing;
- animation clip/state;
- collision/interact policy separate from rendering.

This is **S3/S4+**, not required for v0 geometry.

## 7 · Other later hooks

After S0–S2:

- S3: one real landmark override, e.g. a Dom candidate if it passes its own gate;
- S4: selected GitHub 3D props + Resident Atlas ensembles;
- S5: KFB 2D/2.5D cutout actors/props from accepted sources;
- S6: interaction/combat/stunt hooks in the same neighbourhood;
- later: larger bbox, multiple districts, Cologne-scale streaming/tiling only if the pilot demonstrates a real need.

## 8 · Quick new-chat prompt

> @GitHub
>
> Du bist der Produktionschat **KFB OSM City Slice · Köln-Ehrenfeld v0**.
>
> Ziel ist ein modularer, reproduzierbarer OSM→Low-Poly-KFB-City-Pilot als spätere Walk/Drive-Bühne, nicht ein GIS-Produkt und keine neue Travel-/Vehicle-Engine.
>
> Lies zuerst:
> - `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/START_HERE.md`
> - aktuelles `KFB-Travel-Globe/WSA_START.md` + relevante World/Travel Contracts;
> - `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT_PREFLIGHT.md`;
> - `tools/world_atlas/source/lib/kit-lab.js`;
> - `tools/img2threejs/README.md` und dessen Living Doc;
> - `tools/2D Animation Studio/README.md`.
>
> Baue zuerst nur **S0 Source/Blockout → S1 KFB Low-Poly Style → S2 Consumer-ready Walk/Drive Probe**. Wähle einen kleinen Ehrenfeld-Bereich und dokumentiere bbox, OSM-Abfrage, Quelle und Lizenz/Attribution. Verwende OSM-Vektordaten; kein Tile-Scraping. Cache den Pilotdatensatz reproduzierbar. Gebäude/Straßen bleiben prozedurale Geometrie; vorhandene KFB-Assets nur über GitHub.
>
> img2threejs ist ein optionaler späterer Landmark-Donor; der vorhandene Dom ist noch kein browser-/GLB-/fidelity-akzeptiertes Asset. Das 2D Animation Studio liefert später den Mechanismus für KFB-eigene 2.5D Cutout-Actors/Props; Eumel selbst ist DocCheck-Inhalt und kein KFB-Resident.
>
> OSM City Lab besitzt Geodaten-Normalisierung/City-Geometrie/Style/Export, nicht Travel-Bewegung, Race-Physik, Registry oder Resident-Animation. Für S2 exportiere eine klare Consumer-Szene und nutze den ausgewählten vorhandenen Walk/Drive-Receiver. Keine dritte Engine.
>
> Pflege additiv: `README.md`, `START_HERE.md`, `CHANGELOG.md`, Source/Provenance, Pipeline, Style, Consumer Contract, Tests und Evidence. Status immer trennen in PROPOSAL / DECISION / IMPLEMENTATION / TESTED RESULT / PUBLIC DEPLOYMENT / GEORG ACCEPTANCE / OPEN.
>
> Abschluss des ersten Chats: S0–S2-Plan bestätigt, kleines bbox gewählt, Datenquelle reproduzierbar, Ordner/Contracts angelegt und erster echter Blockout oder präziser BLOCKER. Kein ganz Köln, kein Traffic-Simulator, keine Shell-Arbeit für Georg.

## 9 · Data source policy for the pilot

For the pilot, prefer a one-off/small Overpass query or a suitable extract. Cache the response with query + bbox + retrieval metadata.

Do not use the main OSM editing API as a read backend.

Do not use `tile.openstreetmap.org` raster tiles as a source for geometry or bulk downloading.

Attribution should visibly identify OpenStreetMap contributors and the ODbL data license. Before redistributing a derived OSM database at larger scale, re-check the applicable ODbL obligations for that artifact.

## 10 · Exit condition before Astra integration

OSM City preparation is ready to feed Astra when:

1. the source/data pipeline is deterministic;
2. a small Ehrenfeld blockout is actually generated; Hürth may proceed in parallel as the suburban/off-road comparison after its v0 bbox is frozen;
3. style layer is separable from geometry;
4. the consumer export contract is explicit;
5. Free Roam preparation can name the receiving Walk/Drive engine without creating a third controller;
6. img2threejs and 2D Studio are optional hooks rather than dependencies.

Then consolidate the accepted delta into the one active Astra execution brief instead of running a competing integration plan.
