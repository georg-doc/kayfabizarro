# Recovery · KFB Cologne Race · Option C Claude Design

Date: 2026-09-20  
Status: **BRIEF + REAL OSM + VISUAL AUTHORITY READY · RUNTIME NOT STARTED**

## Owner / branch

- coordination repo: `georg-doc/kayfabizarro`
- branch: `planning/cologne-race-option-c-claude-r3-2026-09-20`
- draft PR: **#134**
- source/brief checkpoint before this Recovery file: `f0e743976d2f747e0ee0ab20160b6922d0f625d7`
- implementation owner after human design acceptance: existing WSA / Race owner
- no second movement, terrain, asset or deployment owner is introduced here

## Goal

Prepare Claude Design to build the first playable **Option C · Elastic Cartoon World** Cologne test track around the Dom with no further data-upload gate.

## GitHub-ready inputs

### Option-C visual authority

Both exact boards are already on public `main`:

1. `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (1).png`  
   blob `59fd27fcb5dae48bc159093427a3e688cc83b6a4`

2. `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (2).png`  
   blob `ac0bf0064c8af8235a49b97d3b7e5e8196ed5579`

Claude must show/open each exact board in isolation before sampling or integrating it.

Option A visual authority is **deferred until after Georg reviews Option C** and is not required to start.

### Real Dom/Zentrum OSM

Canonical dataset:

`tools/osm-city-lab/data/dom-zentrum-v0/`

Claude entry:

`tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json`

Verified source facts:

- OSM base timestamp `2026-09-20T03:20:04Z`
- raw SHA-256 `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`
- 145,967 raw elements
- 5,236 roads / 2,523 driveable
- 6,351 buildings
- 665 railway ways
- 6 water lines
- local metre frame 2,279.652 × 2,115.070 m
- deterministic source/normalization gates PASS
- © OpenStreetMap contributors · ODbL 1.0

Hero anchors include Dom, HBF, Hohenzollernbrücke, Deutzer Brücke and Rheinufertunnel.

No runtime Overpass call is required.

## FILAMENT #02 benchmark

Exact original:

- `KilledByAPixel/SP13KTRA@166ad838`
- `code/levels.js@75189173db4f1e15537992c34590f6d8f34ce9b8`
- second campaign circuit / `circuitTable[1]` / human Track #02
- license blob `1204dfb62806e7944aa43de449352081733486f3`
- license status: **All rights reserved**

Use only as a benchmark for high-level qualities such as:

- memorable opening beat
- compression / release
- tunnel/arch moment
- fast/open versus tight/technical contrast
- readable Track edges
- legible overhead silhouette

Do not copy/adapt/derive its route geometry, coordinate sequence, palette, source, meshes, materials, scenery or world scale.

Full boundary:
`FILAMENT_REFERENCE.md`

## Current product decision

For Slice C, priority is:

1. pinned Option-C design / color / light / form language
2. cool playable Track composition
3. recognisable Dom / Rhine / Cologne context
4. OSM geography
5. exact OMS architecture fidelity

The Track does **not** need to map 1:1 to streets.

It may use:
- roads / Ringe
- alleys
- plazas / courtyards
- rooftops
- ramps
- bridges
- elevated Track between or above buildings
- Rhine-side or Rhine-overlook sections

When the route leaves the ground, use explicit Track structures instead of lifting terrain to support it.

## Current brief

Read:

1. `START_HERE.md`
2. `DATA_READY.md`
3. `FILAMENT_REFERENCE.md`
4. `FORM_ANSWERS.md`
5. `SOURCE_PINS.json`
6. `CLAUDE_DESIGN_BRIEF.md`
7. `CLAUDE_START_PROMPT.md`
8. `RETURN_TEMPLATE.md`

## Not implemented

- no Cologne gameplay build yet
- no Claude export yet
- no Stage candidate
- no Cloudflare publication claim
- no Georg Option-C acceptance
- no Option A implementation

## Exactly one next gate

**Claude Design builds the first playable Option-C Dom Loop from the pinned boards + cached OSM, prioritising Track design over exact street/OMS fidelity, and returns the complete export/evidence package for GitHub/Stage intake.**
