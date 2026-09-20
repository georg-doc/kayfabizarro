# Dom / Zentrum OSM Data Gate · READY

Date: 2026-09-20  
Status: **REAL OSM CACHED · NORMALIZED · DESIGN CONTEXT READY · CLAUDE MAY START**

## Canonical dataset

Owner:
`tools/osm-city-lab`

Dataset:
`tools/osm-city-lab/data/dom-zentrum-v0/`

Use this lightweight entry first:

`tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json`

Then load full geometry only as needed:

- `normalized.json` — KFB local-metre roads/buildings/landuse/water;
- `DESIGN_CONTEXT.json` — railways, named anchors and topology;
- `source.overpass.json` — untouched cached Overpass source;
- `../../scenes/dom-zentrum-v0.json` — existing City Lab consumer scene recipe;
- `PROVENANCE.json` — source/license/timestamp.

## Source

BBox:

`50.9325, 6.9460 → 50.9515, 6.9785`

Local frame origin:

`50.942000, 6.962250`

Frame:

```text
x = east
y = up
z = north
units = metre
```

Retrieved:
`2026-09-20T03:21:41.072Z`

OSM base timestamp:
`2026-09-20T03:20:04Z`

Overpass endpoint:
`https://overpass-api.de/api/interpreter`

Raw source SHA-256:
`8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`

Map data:
**© OpenStreetMap contributors · ODbL 1.0**

## Actual dataset counts

- raw OSM elements: **145,967**
- normalized roads: **5,236**
- driveable roads: **2,523**
- normalized buildings: **6,351**
- landuse/surface polygons: **456**
- water lines: **6**
- railway ways: **665**
- named anchors: **4,322**
- curated hero candidates: **209**
- local bounds: **2,279.652 × 2,115.070 m**

S0 deterministic source/normalization gates:
**PASS**

- source cached
- OSM IDs preserved
- local metre frame
- roads present
- buildings present
- deterministic reload
- geometry clipped to bbox

## Hero anchors already resolved

### Kölner Dom
- OSM: `way/4532022`
- local anchor: `x=-301.298, z=-75.744`
- exact source footprint preserved in `CLAUDE_CONTEXT.json`
- footprint points: **535**
- OSM building type: `cathedral`

### Köln Hauptbahnhof
- OSM station anchor: `node/2399559029`
- local: `x=-223.020, z=87.263`

### Hohenzollernbrücke
- OSM relation: `relation/5460390`
- local: `x=211.812, z=-62.121`

### Deutzer Brücke
- OSM relation: `relation/3837695`
- local: `x=266.235, z=-622.379`

### Museum Ludwig
- OSM: `node/633480736`
- local: `x=-156.300, z=-129.721`

### Kölner Philharmonie
- OSM: `node/633480737`
- local: `x=-100.024, z=-154.088`

### Rheinufertunnel
- OSM: `way/23559378`
- local anchor: `x=16.832, z=-296.032`
- tagged `highway=primary`, `tunnel=yes`, `layer=-2`

## Claude convenience context

`CLAUDE_CONTEXT.json` additionally contains:

- **70** named driveable road geometries nearest the Dom;
- **120** HBF-near railway geometries;
- Rhine/water context;
- bridge/tunnel/layer topology;
- exact Dom footprint;
- source paths and provenance;
- ownership rules for OSM / KFB / landmark overrides.

Claude does **not** need to query Overpass at runtime or invent any Cologne geometry.

## Product rules

OSM owns:
- WHERE;
- road/building/rail/water source geometry;
- source names/tags/identity.

KFB owns:
- styling;
- controlled deformation;
- Track authoring;
- landmark replacement;
- material/light language;
- gameplay.

For the Dom:
retain the OSM anchor/footprint as geographic truth but render the verified KFB Dom landmark donor as the hero object.

For the Rhine:
retain real OSM position/geometry but use current KFB/TinySkies water presentation.

For FILAMENT:
re-author the route grammar into these real Cologne constraints. Never copy SP13KTRA source coordinates/code.

## Current gate

**OSM data gate is closed.**

Claude Slice C may start immediately from the pinned Option-C boards already on public `kayfabizarro/main`. Option A visual authority is deferred until after Georg's Option-C gate.
