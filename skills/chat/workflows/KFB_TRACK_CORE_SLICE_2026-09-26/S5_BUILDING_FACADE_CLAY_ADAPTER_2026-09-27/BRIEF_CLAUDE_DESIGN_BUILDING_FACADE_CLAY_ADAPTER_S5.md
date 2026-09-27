# S5 · Claude Design · Building / Façade Clay Adapter · 2026-09-27

**Status:** PREPARED FOLLOW-ON SLICE · DO NOT EXECUTE INSIDE TRACK-CORE-2  
**Receiving owners:** existing WorldBuilder / OSM City Lab / KFB world-look owners  
**Does not own:** OSM geography, Track Core, Race physics/contact, Asset Registry, landmark identity  
**Purpose:** one reusable clay/cartoon façade treatment that lets real OSM buildings and verified KayKit/Kenney building donors live in the same world without rebuilding them as a new building system

## Why this slice exists

The racetrack/road is KFB-owned geometry. Buildings are a different problem.

Georg wants OSM buildings plus KayKit/Kenney city/commercial/industrial buildings and roadside props to share the same handmade clay/cartoon form language already demonstrated in H0 Hirnwelt / Knetwelt:
- slightly pressed/rounded massing;
- softened corners;
- windows and doors that read as intentionally wonky rather than broken;
- tactile clay relief and fingerprints;
- coherent façade pieces and roof/base treatment;
- no generic low-poly building next to a clay road.

## Mandatory donors / reuse first

Read and show the real donor output before adapting anything:

1. `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`
   - reuse `lab-clay/clay-soften.v1.js`;
   - reuse `lab-clay/clay-material.v4.js`;
   - reuse `lab-clay/clay-relief.v2.js`;
   - H0 rule: KayKit houses stay the original models; soft windows/doors/façades come from preprocessing + clay material.

2. `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/HANDOVER_WSA.md`
   - the same pattern is explicitly intended for OSM blocks;
   - runtime preprocessing cost was observed at roughly 40 s in H0, so Race/World use should prefer an offline/prebaked GLB path where practical.

3. **Elastic Grotesque Clay V2**
   - `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
   - geometry basis pinned in existing WorldBuilder docs at `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`;
   - preserve OSM footprint/identity/height/minHeight/material semantics and `protectedDetails`;
   - do not revive the later failed R2 road/curb rework.

4. WB-D1 / Cologne World Shell evidence
   - OSM buildings already use Elastic Grotesque Clay V2;
   - doors/windows are curved plates following the shell;
   - use this as receiving-world evidence, not as a second owner.

## Source ownership

- **OSM:** geography, footprints, building identity and semantic facts.
- **WorldBuilder / OSM City:** building/world placement and active building renderer.
- **KayKit/Kenney:** allowed as actual **building and prop donors**.
- **Track Core:** road/track geometry only; this slice must not move or rebuild it.
- **Clay modules:** shared presentation/preprocess layer, not a new city generator.

## Required adapter grammar

Treat building appearance as roles that can be applied across source families:

```text
CORE_MASS
FACADE_FIELD
CORNER / REVEAL
WINDOW
DOOR
ROOF
BASE / CONTACT
ATTACHED_DETAIL
SIGNAGE / PROP
```

For modular kit buildings, preserve original part anchors and source identity. For OSM procedural buildings, preserve footprint and semantic dimensions. Do not force both into one new topology.

The adapter may:
- subdivide/soften eligible static geometry;
- add deterministic lump/press deformation;
- apply clay relief/material;
- soften/tilt window and door presentation within bounded limits;
- give roofs a coherent clay relationship to walls;
- harmonize façade detail scale and contact grounding.

The adapter may **not**:
- move OSM footprints to make a composition prettier;
- invent new windows/doors when a protected source detail exists;
- destroy building sockets/anchors needed by modular kits;
- replace a known landmark with a generic clay block;
- alter road width, Track Core sockets or collision ownership.

## Required POC streetscape

Build one compact comparison scene on one existing world/OSM context:

- 2–3 real OSM buildings;
- at least one verified KayKit building;
- at least one verified Kenney city/commercial/industrial building;
- existing KFB road/Track Core beside them;
- a few already-approved roadside props such as lamp, traffic light, mailbox/bin/bench where sources exist.

Show:
1. exact source objects alone;
2. clay-adapted versions;
3. all sources together in one streetscape;
4. window/door/façade close-up;
5. roof/base/contact close-up;
6. driver-height view beside the KFB road.

The goal is **one world look across heterogeneous building sources**, not one homogenized mesh family.

## Façade continuity / modular assembly

Where a building pack already consists of modular façade/wall pieces, preserve its native connectors and let the clay treatment cross those joints visually without changing the snap geometry.

Where OSM buildings are procedural shells, use shared role/material/deformation parameters rather than pretending they have kit sockets.

A successful result allows adjacent façade pieces to read as one hand-worked clay building while their original assembly/identity remains intact.

## Performance / export

Because H0's runtime geometry softening was expensive, compare:
- runtime softening for a tiny sample;
- offline/prebaked softened GLB for the real World/Race consumer.

Do not choose a performance architecture from appearance alone. Report triangle counts, preprocessing time and final asset size for the POC.

## Deliverables

- `BUILDING_CLAY_ADAPTER_PROFILE.json` — bounded role/deformation/material settings by source family;
- source-isolation sheet;
- OSM + KayKit + Kenney comparison scene;
- façade/window/door/roof/base evidence;
- performance comparison runtime vs prebaked;
- `SOURCE.json`, `TEST_REPORT.md`, `RETURN.md`;
- exactly one next receiving-owner gate.

## Acceptance

PASS for this slice means:
- source identity remains recognizable;
- OSM facts/anchors remain unchanged;
- KayKit/Kenney building connectors/parts remain intact;
- windows/doors/façades read deliberately clay/cartoon, not melted noise;
- the mixed streetscape looks like one KFB world;
- no Track Core geometry was replaced;
- performance path is explicit.

No standalone pseudo-human dashboard is required. Review later in the real WorldBuilder / Cologne streetscape once this adapter produces a meaningful integrated visual milestone.
