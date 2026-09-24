# Grounding + World Look + Grotesque OSM v2 · Pilot 09 RETURN · 2026-09-20

**Status:** IMPLEMENTATION + STATIC + REAL BROWSER TESTED RESULT · HUMAN REVIEW OPEN  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `img2threejs/grounding-worldlook-grotesque-v2-2026-09-20`  
**Draft PR:** [#118](https://github.com/georg-doc/kayfabizarro/pull/118)  
**Exact tested head:** `2210e54e3191c478f58b35cfcf997118a9658a91`  
**Workflow:** [35479355063](https://github.com/georg-doc/kayfabizarro/actions/runs/35479355063)  
**Artifact:** `10595357252`

## User goal addressed

The three requested foundations are now one bounded POC:

1. **Grounding**
2. **World look matching**
3. **Grotesque OSM City rework**

The proposed Cologne Dom / Roncalliplatz / Hbf / Rings / Rhine sprint is separately prepared and not yet started.

## 1 · Grounding

The Cathedral no longer uses the visible presentation foundation in this POC.

Current result:
- source part `foundation` removed from presentation;
- remaining geometry rebased by **1.0 m** to ground Y=0;
- no round base;
- no plaza cylinder / ground plate;
- terrain owns the transition;
- a soft support field is derived from actual OSM building footprints, driveable roads and the landmark footprint.

The support field is invisible geometry logic, not another plate.

## 2 · Tiny Surface terrain

Pilot 08's sine/cosine terrain is not reused.

Pilot 09 uses:
- the exact current Travel/TinySkies 3D simplex core + octave recurrence;
- metre-domain adaptation only;
- a staggered triangular local mesh rather than broad regular strip bands;
- support-field flattening under roads/buildings/landmark;
- height + secondary-noise colour variation.

Browser result:
- **10,976 vertices**
- **21,534 triangles**
- 7.5 m lattice spacing
- deterministic seed 1842
- `sineTerrain=false`

The current local planar POC is deliberately not promoted as the final Travel terrain owner. It proves the surface grammar needed for later local OSM/card zones.

## 3 · Grotesque OSM v2

Legacy Grotesque stays available for A/B.

The new v2:
- preserves real OSM footprints;
- uses at most 5 semantic floor bands, not 7 thin displaced rings;
- each band gets deterministic scale / small shift / rotation;
- has one low roof cap instead of another thin card;
- emits deterministic material codes;
- adds sparse comic-shorthand windows;
- emits one street-facing door code per building by selecting the facade nearest a driveable OSM road;
- keeps collision geometry undeformed.

Current Hürth review subset:
- **90 OSM buildings**
- legacy Grotesque: **9,459 triangles**
- Grotesque v2: **4,936 triangles**
- v2 windows: **453**
- v2 street doors: **90**
- average windows/building: ~5.0

Door metadata already contains `assetHint: KayKit-door-candidate`, but **no KayKit asset is loaded yet**.

## 4 · World look matching

Default POC palette is `Dom · city-harmonic`.

The Cathedral therefore does not try to preserve literal historic grey as the main requirement. It is mapped into the same OSM City palette neighbourhood:

- pale/warm wall families;
- shared roof family;
- shared accent family;
- dark/cool glazing;
- same OSM City world light / fog / rim.

An `identity palette` switch remains for A/B.

## Tests

### Source/static

**25 / 25 PASS**

Covers:
- OSM / landmark support field;
- no visible landmark base contract;
- exact TinySkies/Travel simplex recurrence donor;
- no sine/cos stripe function in terrain-v2;
- deterministic finite terrain noise;
- Grotesque v2 semantic bands;
- window/door counts;
- street-door distances;
- KayKit replacement seam metadata;
- collision geometry remains undeformed.

### Chromium/WebGL

**15 / 15 PASS**

- HTTP PASS
- build marker PASS
- v2 default PASS
- Tiny Surface default PASS
- no landmark base PASS
- terrain simplex/triangular contract PASS
- semantic bands PASS
- windows/doors PASS
- grounded Cathedral PASS
- legacy A/B PASS
- flat terrain A/B PASS
- identity palette A/B PASS
- **0 failed resources**
- **0 page/console errors**

Evidence: [summary](../evidence/2026-09-20-grounding-worldlook-grotesque-v2/summary.json)

## Visual result

The final browser evidence makes the intended difference visible:

- v2 reads as chunky, cubist toy buildings;
- legacy remains visibly more like horizontally shifted cards;
- the large rigid stripe surfaces from Pilot 08 are gone;
- the Cathedral transitions directly to the world ground without a presentation pedestal.

This is **assistant-reviewed evidence**, not Georg acceptance yet.

## Prepared next sprint

[Cologne Dom / Inner City / Rings / Rhine POC](COLOGNE_DOM_CITY_SPRINT_POC_2026-09-20.md)

Prepared order after this human gate:

1. real OSM Dom / Roncalliplatz / Hauptbahnhof source;
2. exact Cathedral override;
3. Hauptbahnhof KISS silhouette;
4. selected main-road Track Design corridor toward the Rings;
5. Rhine shoreline + current Travel/TinySkies water logic;
6. one Rhine bridge;
7. human city/free-roam gate.

## Boundaries

Still open:
- no real Cologne geography in Pilot 09;
- no exact Dom OSM override;
- no KayKit door replacement;
- no river/water work;
- no public Stage;
- no Race/Travel physics integration.

## Next gate

**Georg visual review of Pilot 09.**

If accepted, start the Cologne sprint rather than continuing to polish Hürth.
