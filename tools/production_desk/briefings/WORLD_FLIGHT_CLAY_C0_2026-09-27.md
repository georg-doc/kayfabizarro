# WORLD-FLIGHT-CLAY-C0 · playable World MVP

Status: READY FOR WORK  
Executor: Work · Sol High  
Target route: `https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-flight-clay-c0/`

## Product outcome

Deliver one playable WorldBuilder slice for Georg:

- enter on foot;
- switch to flight and back;
- inspect one OSM-informed area and one placed track module;
- toggle Original / Clay;
- judge the Clay direction across terrain, road, sidewalk and buildings;
- keep the center view free of debug panels.

## Read order

1. current `skills/chat/START_HERE.md`;
2. current Work/Stage/Fresh-chat protocols;
3. WB-W0 PR #203 Return/source;
4. World r2 PR #234 Return/source;
5. current Travel/flight owner and its exact accepted donor;
6. current Track Core / Rollercoaster-v11 handoff only when an exact source exists;
7. this brief.

GitHub current heads override every SHA mentioned here. Do not implement before the exact current source locks are written to `SOURCE.json`.

## Owner rules

- existing World host owns terrain, scene and persistence;
- existing movement/camera owner stays singular;
- flight is an adapter/mode, not a second world runtime;
- OSM supplies semantic layout/corridor guidance;
- Track Core supplies measured route/connector geometry;
- Clay is a reversible presentation adapter;
- renderer, camera, physics and input are not replaced.

## C0 scope

### Mobility

- WALK and FLIGHT;
- one explicit, readable switch;
- safe takeoff/landing or return-to-ground behavior;
- camera works above and below the character where appropriate;
- same world origin, scale and saved scene.

### World content

- one bounded region;
- one OSM-informed road/city corridor;
- one existing race-track module placed by connector/transform;
- buildings have a small deterministic height family, not one uniform height and not random scatter;
- enough clear space for walking, driving and later Residents.

### Clay presentation

Original / Clay toggle must affect the same scene.

Clay view includes:

- terrain with coherent clay color and surface response;
- road as darker clay, with restrained track/wear marks;
- sidewalk as a lighter/different gray clay band;
- curb made from a simple repeated stone/segment rhythm;
- one building family using the accepted scale, varied heights and restrained handmade irregularity;
- no heavy black outline, noisy full-scene displacement or sharp accidental coastline/terrain spikes.

Use the existing accepted clay texture/material evidence. Do not restart texture production.

### Interface

- play first;
- only essential controls visible;
- docs/status behind one compact icon;
- mobile/narrow viewport keeps the field of view usable;
- direct Stage URL, not a local file or GitHub viewer.

## Not in C0

- full reactive dents/bounce system;
- every OSM district;
- procedural city generator;
- NPC construction life;
- Combat;
- complete Track editor;
- new materials library;
- visual polish before movement and scale work.

## Acceptance

PASS requires:

1. boot succeeds from the fixed Stage URL;
2. WALK → FLIGHT → WALK works without duplicate camera/movement ownership;
3. Georg can inspect terrain and track from air and ground;
4. Original / Clay is a true reversible A/B view of the same world;
5. OSM corridor and track module share a believable scale and seam;
6. clay terrain, road, sidewalk, curb and buildings read as one art direction;
7. desktop and narrow viewport are usable;
8. no failed core assets or page errors;
9. source/return/changelog updated.

## Stop rule

One bounded diagnostic pass per core failure. Quarantine optional asset defects. After two failed passes on the same core gate, preserve the candidate and export recovery.

## Return

Exact repo / branch / PR / head, source locks, changed files, actual tests, public browser result, screenshots, direct Stage URL, unresolved items and exactly one next gate.
