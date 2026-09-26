# CITY-BITS-WORLD-DRESSING-RECON-01 · KayKit City Builder Bits application recon · 2026-09-26

**Executor:** ChatGPT Web + GitHub  
**Source identity owner:** Asset Registry / Asset Librarian  
**Receiving owners:** WorldBuilder / OSM City / Race presentation as applicable  
**Runtime implementation:** NO  
**Goal:** classify the already-owned KayKit City Builder Bits pack into safe KFB city-liveliness uses without creating a second road/world generator.

## Source lock

Current exact structural source:
`registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`

The registry currently contains **41 model-3d assets**.

Useful exact source objects include:
- `trafficlight_A`
- `trafficlight_B`
- `trafficlight_C`
- `streetlight`
- `road_straight_crossing`
- `road_junction`
- `road_tsplit`
- `road_straight`
- `road_corner`
- `road_corner_curved`
- `bench`
- `firehydrant`
- `dumpster`
- `trash_A`
- `trash_B`
- `car_hatchback`
- `car_police`
- `car_sedan`
- `car_stationwagon`
- `car_taxi`
- buildings A–H, with and without base
- `watertower`
- `bush`

Existing repo consumers/donors already include KayKit City Sample S4 and Road Network S5. Reuse them before writing another scene.

## Mandatory donor proof

Before classification/integration recommendations, show actual source objects in isolation:
1. traffic lights A/B/C;
2. streetlight;
3. crossing + junction road pieces;
4. bench + hydrant + dumpster/trash;
5. one car;
6. one building without base.

A loaded URL/path is not evidence; actual geometry must be visibly inspected.

Record:
- exact ref/path/blob where available;
- local axes/orientation;
- measured bounds/scale;
- useful attachment/placement anchor assumptions;
- texture/material dependency.

## Application matrix

Classify every model into one of:

### ROAD_SEMANTIC
Examples: traffic lights, crossing/junction fixtures.

Rules:
- placement is driven by road/intersection semantics, never generic random scatter;
- OSM/World road truth remains external owner;
- signals do not invent intersection topology.

### CITY_DRESSING
Examples: streetlight, bench, hydrant, dumpster/trash, boxes.

Rules:
- sparse deterministic placement;
- legal support/curb/sidewalk relationship;
- no uniform repeated wallpaper.

### VEHICLE_AMBIENCE
Examples: hatchback/police/sedan/stationwagon/taxi.

Rules:
- parked/static ambience first;
- moving traffic needs an explicit traffic/movement owner;
- Race physics is not inferred from a city prop.

### BUILDING_BACKGROUND
Buildings A–H, with/without base; watertower.

Rules:
- useful as stylized background/diorama/source donor;
- never replace OSM building/geographic truth merely because they look nicer;
- may become authored landmarks/props only through receiving owner.

### NATURE_ACCENT
Example: bush.

Rules:
- curated accent only;
- procedural Nature owner remains separate.

### ROAD_GEOMETRY_DONOR
Road pieces.

Rules:
- visual/modular donor and measurement fixture only;
- do not create a second Track Core or OSM road compiler.

## Required output

Create one application memo with:
- all 41 model names;
- category;
- recommended receiver;
- KEEP / LATER / NO CURRENT USE;
- placement semantics;
- source proof status;
- scale/orientation notes;
- collision/interaction expectation;
- whether it belongs in Asset Librarian tags or a consumer recipe.

Also identify any missing categories the FREE pack does **not** provide; do not hallucinate signs or props not present.

## First implementation proof after recon

Only if the recon is accepted:

Use an **existing Hürth/Cologne street fixture** and place **3–5 source-exact props**:
- one traffic-light treatment at a semantically valid junction/crossing;
- one streetlight pattern;
- 1–3 sparse curb/sidewalk props.

No new city generator.
No full road replacement.
No moving traffic system.
No building replacement pass.

## Return

Return:
- exact source ref;
- isolated-source screenshots/evidence;
- 41-row classification;
- candidate first-proof recipe;
- missing/unsupported pack gaps;
- one next gate.

## Exactly one next gate

**WSA/Georg accepts the City Bits application matrix before any city-dressing implementation.**
