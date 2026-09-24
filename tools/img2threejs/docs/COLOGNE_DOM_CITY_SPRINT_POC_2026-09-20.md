# Cologne Dom / Inner City / Rings / Rhine Sprint POC · proposal · 2026-09-20

**Status:** PREPARED_NEXT_SPRINT · do not start before Pilot 09 human gate

## Proposed city POC

Build one recognizable Cologne card/biome zone around the Cathedral using real OSM geography and the same world rules proven in Pilot 09.

### Zone A · Dom / Roncalliplatz / Hauptbahnhof

- real OSM footprint / road / pedestrian-space extraction;
- Cathedral as exact landmark override, no presentation base;
- Roncalliplatz emerges from OSM pedestrian/plaza surface, not a landmark plate;
- Hauptbahnhof kept KISS: silhouette, roof mass, main hall rhythm, station-facing entrances;
- surrounding blocks use Grotesque OSM v2 material codes.

### Zone B · city route / Kölner Ringe

- use the new Track Design compiler for selected main-road corridors;
- preserve OSM road centreline / width class as route truth;
- transform main roads into stronger playable/race-readable ribbons without replacing normal streets;
- connect Dom zone toward Rings as one driveable/parcours axis.

### Zone C · Rhine / bridges / riverbank

- Rhine becomes world terrain/water owner, not an imported flat rectangle;
- riverbank / shoreline follow OSM geometry;
- reuse current Travel/TinySkies water/coast donor concepts for:
  - river surface;
  - shallow/deep colour separation;
  - foam/edge treatment where appropriate;
  - skyline reflections only if cheap;
- selected Rhine bridges get recognizable KISS silhouettes and track-support seams.

## Landmark rule

Each landmark is built for:
1. skyline/silhouette recognition;
2. 2–5 signature geometry cues;
3. semantic groups for Grotesque deformation;
4. no invisible detail budget;
5. palette harmony with the local zone over literal original colour.

## City/biome/card-zone rule

The Cologne POC should read as one authored card/biome zone:
- same terrain / sky / fog / rim / weather;
- local OSM material families;
- stronger landmark accent only where needed;
- water / riverbank / road / building / landmark all share one world state.

## Sprint order after Pilot 09

1. fetch + pin Cologne OSM source around Dom / Hbf / Roncalliplatz;
2. exact Cathedral override + footprint/yaw/height;
3. Hbf KISS silhouette override;
4. main-road/track corridor toward the Rings;
5. Rhine shoreline + water surface;
6. one bridge;
7. browser/free-roam human gate;
8. only then expand to more bridges / Rings / landmark catalogue.

## Explicit non-goals for first Cologne POC

- no whole-city reconstruction;
- no detailed station interior;
- no all-bridge coverage;
- no literal photogrammetry;
- no full traffic simulation;
- no replacing OSM street truth with race track geometry.
