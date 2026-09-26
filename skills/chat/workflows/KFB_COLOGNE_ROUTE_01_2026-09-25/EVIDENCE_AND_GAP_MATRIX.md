# Cologne Route 01 · Evidence and gap matrix · 2026-09-25

## 2026-09-26 execution-prep delta

### Blender MCP status

Georg reports Blender MCP is currently building the missing connector/offset track pieces.

A GitHub check for current Race RKIT branches/PRs at this point found:

- visible RKIT branches through `chat/rkit-08-09-stunts-2026-09-25`;
- no GitHub-visible `rkit-10` branch/PR yet;
- no source path for the in-progress new connector pieces can therefore be pinned honestly yet.

Classification:

`USER-REPORTED IN PROGRESS · GITHUB OUTPUT NOT YET VISIBLE`.

The Web-prep briefing must recover and pin the MCP output before Claude Design consumes it. Missing pieces may not be reconstructed from prose.

### Existing continuous OSM receiver donor

Race PR #12 is an important existing donor for the later Cologne Route lane:

- title: `Stage S1: continuous Hürth → Ehrenfeld OSM corridor`;
- source corridor reported as 11,384.3 m / 510 points / 220 m half-width;
- existing Free Roam C0 remains the position/contact/collision/recovery owner;
- browser proof reported 17/17 corridor checks PASS;
- public Stage proof reported 29/29 PASS for that historical slice.

This does **not** provide the desired Hürth → Dom → Rhein → Mülheimer Brücke → SAE route, but it proves that the project already has a continuous real-scale OSM corridor/receiver pattern. Cologne Route 01 must reuse that architectural seam rather than create another city-drive receiver.

### Execution decision

Track R0 is now the first integration product, with the OSM seam specified before composition.

Order:

`WEB-PREP-TRACK-R0 → CLAUDE PLAYABLE-TRACK-R0 → WEB REHOME/TEST → OSM ROUTE PREP → CLAUDE OSM COMPOSITION`.

No new runtime/browser tests were executed by this planning update.

---

Status: **PLANNING EVIDENCE · NO NEW RUNTIME TESTS IN THIS SLICE**

This file records the source facts used for the Route 01 plan. It does not promote any open candidate.

## Current source heads observed at planning time

### kayfabizarro

- default branch: `main`
- observed head before this planning branch: `8504afa9d14ad46855d0c590bc30eea0fc38d15d`

### KFB-Stunt-Car-Race

- default branch: `main`
- observed head: `3ef3ebec6975736edb6ec8d5dabebc4ee5b51402`

## RKIT candidate chain

| PR | Branch/head observed | Reusable fact | Status used here |
|---|---|---|---|
| #34 | `chat/rkit-01-track-kit-2026-09-24` @ `f368dd0c71eb2798bcd057d30196cb8da4d967b6` | rounded swept profile, supports, arches, ground skirt | donor candidate |
| #35 | `chat/rkit-02-stunt-modules-2026-09-24` @ `37047b5a14c00e8b3cb5ddb4129e76ce3f10b2d9` | jumps + flap concepts | donor candidate |
| #36 | `chat/rkit-03-track-recipe-2026-09-24` @ `ac4a57cf32fc8e3c26162735c30e634dad3f331c` | recipe/compiler, funnel, bowl, city street, tunnel | donor candidate |
| #37 | `chat/rkit-04-switch-pit-2026-09-24` @ `3c002235a297cd8bb3343d8b4a721d10fe7e549a` | switch + pit lane | donor candidate |
| #38 | `chat/rkit-05-flap-return-2026-09-24` @ `98bc4869f06f4551a602bf03aa7287befd66ecdc` | dive/tunnel return + merge | donor candidate |
| #39 | `chat/rkit-06-trankgasse-2026-09-24` @ `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5` | real OSM Trankgasse in City-Lab metre frame; kit guide | preferred RKIT-10 geometry lineage if still current |
| #40 | `chat/rkit-07-gc-canyon-2026-09-24` @ `f70cf4866c09aefef0d120fbda78e847c0283362` | SWITCH_Y seam repair; canyon/rollercoaster probes | narrow seam donor; do not silently adopt canyon scope |
| #41 | `chat/rkit-08-09-stunts-2026-09-25` @ `22c3b2e2ebb66f1da999116e1b9547ac93d6a91d` | LOOP_REAL, MAG loops/cascade, SKYRAMP metadata | geometry/look donor only; not Race-drive-tested |

## Existing numeric/source evidence

### RKIT-03 / TRACK_A

Recorded in its Return:

- figure-eight length about 1.29 km;
- closure error 0.6 mm;
- bridge clearance 5.8 m;
- no self-intersection in reported compiler check;
- no lower-deck pillar footing conflict in reported compiler check;
- baked route + GLB generated.

These are source-return facts, not rerun in this planning slice.

### RKIT-06 / Trankgasse

PR #39 reports:

- real OSM line from `dom-zentrum-v0`;
- 13 ways;
- about 356 m;
- NARROW 10.8 road + sidewalks;
- two OSM tunnel stretches receive `TUNNEL_60` shells;
- centre-line maximum reported smoothing deviation: 4 m.

This is the key evidence that OSM centre-line and RKIT geometry can already share one metre frame.

### RKIT-08/09

PR #41 reports:

- `LOOP_REAL`: 17 m teardrop with safe bypass;
- additional MAG loops/cascade;
- SKYRAMP-01 with boost/pad envelope;
- no Rapier drive result yet;
- MAG adhesion, pads and air-control are not current Race runtime facts.

Therefore Route 01 may use these as module sockets/donors, but must not call them proven gameplay.

## Hürth / World evidence

### Hürth OSM v0

Current Hürth pilot records:

- fixed 700 × 700 m bbox;
- 5,640 Overpass elements;
- 164 road parts;
- 116 driveable road parts;
- 700 buildings;
- 154 intersection/link nodes;
- longest contiguous normalized driveable road part: 478.64 m;
- deterministic reload PASS;
- OSM ID preservation PASS;
- fixed-bbox clipping PASS.

Visual/runtime acceptance remains separate.

### WORLD-INTEGRATION-01 session cut

Current Return in kayfabizarro reports:

- real Hürth mounted in the existing WB2 editor;
- same terrain/edit/save ownership;
- 26/26 world selftests in the preview;
- 700/700 buildings;
- current human gate open;
- no Cloudflare/public acceptance claimed in that Return.

This supports the architecture claim that Route 01 should reuse the existing WorldBuilder/OSM owners instead of creating a separate Köln world runtime.

## Gap classification

### Already solved enough to reuse

- route-first swept geometry;
- multiple width classes;
- banked route frames;
- street profile;
- race profile;
- profile funnel;
- switch/merge grammar;
- tunnel/dive branch;
- supports/arches;
- recipe → compiler → baked route;
- OSM → local metre frame;
- stunt socket/module metadata.

### Generic geometry still missing

1. curvature/bank easing between arbitrary route gestures;
2. S/chicane/hairpin/serpentine parametric family;
3. street↔track cross-section morph;
4. reusable grade/crest/dip/bridge approach;
5. independent edge-treatment layer beyond the current race-body assumptions.

### Product/runtime later, not RKIT-10

- full Hürth→SAE OSM corridor capture and chunking;
- Race drive test for LOOP_REAL;
- drift-assist tuning;
- editor UI;
- seeded track grammar UI;
- chunk streaming;
- final bridge/world dressing.

## Planning-slice test count

No runtime, Blender or browser tests were executed by this planning slice.

Checks performed here:

- current kayfabizarro main head read;
- current Race main head read;
- PR #34–#41 states/heads read;
- RKIT kit guide read;
- RKIT WSA handover read;
- RKIT-03 Return read;
- RKIT-08/09 handover read;
- Hürth pilot read;
- World Integration 01 Return/current state read.

The next implementation slice must produce its own Blender/repository test counts.
