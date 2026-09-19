# KFB OSM City → Free Roam S2 Receiver Handoff

**Date:** 2026-09-18  
**Status:** PREPARATION READY · CITY EXPORT TESTED · RUNTIME PATCH NOT STARTED

## 0 · Owner rule

Exactly one active movement writer.

- City Lab owns OSM normalization, local-metre geometry, styling and export.
- Race / Free Roam owns the existing Slice-04 vehicle solver and vehicle/contact facts.
- Travel owns world, terrain, locomotion mode switching, anchors and persistence.
- Ground remains the existing WB0 Ground controller.
- FLIGHT remains carpet.js.
- Registry/Librarian remains asset identity/provenance owner.

No City movement controller, second Rapier host, second save owner or parallel Travel world.

## 1 · Pinned inputs

### City Lab
Repository: georg-doc/kayfabizarro  
S2 hardening merge: 693ec5b54ced7887b2ccc9451a4097a0d9924453

Exports:
- tools/osm-city-lab/scenes/ehrenfeld-v0.json
- tools/osm-city-lab/scenes/huerth-v0.json

Main CI proof:
- workflow: OSM City S2 export contract
- run: 35368604652
- job: 105676946371
- result: PASS, including deterministic regeneration and git diff --exit-code.

The gate verifies local metre frame, driveable roads, sidewalk hints, building obstacles, required candidate anchors, exact source-road identity for the road↔terrain candidate and no required anchor inside a mapped building footprint.

### Free Roam / Race
Current product baseline: FR-S04-02.

Race implementation merge:
63cb97d5e321700e55f7658104b42c9c09d97d70

Tested source:
a7a48a8c6e1589a18134aa619e2be22d79124c32

Actual KFB Cloudflare proof:
- run 35367513758, attempt 2
- job 105675602369
- 62/62 PASS

Human feel review remains OPEN.

FR-S04-02 provides the existing Slice-04/Rapier vehicle line with corrected A/D semantics, stable reverse, reverse steering assist, bounded reverse speed, no reverse boost, hop/reset/lifecycle checks and a wider baked-Travel local contact proof. It does not yet implement Walk↔Drive, parked vehicle restore or a city receiver.

### Travel
Repository: georg-doc/KFB-Travel-Globe

Current documentation head observed:
6713528274cf8247947dd7149c444ee8996c0efa

Current Ground repair implementation recorded by WSA_START.md:
da7e9a5a3c4c6125e9314ced838cdfa5ff1f7a43

Current mode bridge:
site/world-builder/runtime-mode.js
blob 1c55d1592cfc5d32c325be8992ed88f503ae0cf1

The bridge currently supports only FLIGHT and GROUND and rejects another locomotion mode. DRIVE remains a named future receiver delta.

Ground remains under current human review. This handoff does not modify that gate.

## 2 · Current City S2 anchors

Coordinates are City-Lab local metres: x=east, y=up, z=north.

### Ehrenfeld
- Foot: (-26.919, 0, -54.754)
- Park: (-22.201, 0, -47.326)
- Intersection: (17.358, 0, 12.123)
- Road↔terrain: (329.620, 0, 93.195)
- Road↔terrain source: way/4919998

Spans:
- Foot → Park: 8.800 m
- Park → Intersection: 71.408 m
- Intersection → road↔terrain: 322.615 m
- Foot → road↔terrain: 386.017 m

### Hürth
- Foot: (46.098, 0, 1.848)
- Park: (53.470, 0, -6.046)
- Intersection: (-209.340, 0, -130.522)
- Road↔terrain: (-350.025, 0, 159.844)
- Road↔terrain source: way/40306265:0

Spans:
- Foot → Park: 10.801 m
- Park → Intersection: 290.798 m
- Intersection → road↔terrain: 322.653 m
- Foot → road↔terrain: 426.469 m
- widest pair among these anchors: 436.266 m

Hürth's source-derived road↔terrain anchor has mapped-green distance 0 m. Both current road↔terrain anchors lie exactly on their declared driveable source road.

## 3 · Scale finding

The source city data is real local geometry measured in metres:
- Ehrenfeld about 659 × 596 m
- Hürth about 700 × 700 m

Travel Ground uses a radius around 5 Travel units and default actor body height 0.022 Travel units.

The current Free-Roam local Travel experiment is a bounded local Cartesian vehicle frame. Its documented scale is about 0.01 Travel units per physics unit. Race normalizes the kart to 2.8 physics units. A metre-like City→physics mapping is a useful first standalone experiment, but is not automatically a globally valid Travel mapping.

At a provisional 0.01 Travel units per metre, a 700 m city spans roughly 7 Travel units, larger than the globe radius itself. More importantly, local up changes materially over hundreds of metres. The current fixed-local-gravity proof is bounded evidence, not proof that an entire 600–700 m city can be one flat tangent plate on the radius-5 globe.

Therefore:

> Full-city standalone driving and Travel-integrated Walk↔Drive are distinct acceptance steps using the same Race solver.

## 4 · Execution ladder

### C0 · Full City Drive consumer

Use the existing FR-S04-02 solver in the City local metre plane.

Mount:
- City Lab driveable road surfaces;
- building obstacles;
- explicit non-driveable / green / water exclusions;
- current park/intersection/road-edge metadata;
- existing Free-Roam control adapter and camera.

Purpose:
- prove real OSM street geometry with the current vehicle solver;
- tune collider construction, curb/road tolerances and parking;
- let Georg drive the broad city before Travel integration.

Status label:
**DRIVE-only city consumer · not Travel Walk↔Drive acceptance.**

First acceptance:
spawn vehicle → forward → reverse → three-point turn → park → normal intersection → broad city corridor → stop/reset

Check road width vs hull, building collision, boundary traps, reverse/steering preservation, ordinary parking without forced drift/boost, and no silent green/water asphalt.

### C1 · Travel-integrated micro fixture

Do not mount the full city as one fixed tangent plane.

Start with:
Foot → nearby parked vehicle → enter/exit

because Foot↔Park is only about 9–11 m in both cities.

Then add only as much road/intersection geometry as fits the measured local-up/contact budget.

Each receiver window records:
- source city ID;
- exact OSM feature refs;
- local city-metre bounds;
- Travel spherical anchor;
- City→physics scale;
- physics→Travel scale;
- tangent frame/quaternion;
- maximum distance from frame origin;
- measured maximum local-up error;
- included Road/Building/Green/Water IDs;
- boundary recovery policy.

If the desired intersection lies outside the accepted budget, choose a nearer source intersection or use a second receiver window. Do not silently enlarge the error budget.

### C2 · Travel mode bridge

Extend the existing bridge additively:

FLIGHT | GROUND | DRIVE

Expected active movement owner:
- FLIGHT → carpet.js
- GROUND → wb0-ground-controller
- DRIVE → named FR-S04-02 / Slice-04 receiver adapter

No second rAF loop. No simultaneous Ground+Drive pose writing. No City-owned camera host.

### C3 · Walk↔Drive transaction

Use Prepare → Validate → Commit.

First proof:
GROUND walk to parked vehicle → enter → DRIVE → forward/reverse → stop → safe exit → GROUND

Requirements:
- same vehicle identity;
- parked vehicle remains;
- no actor spawn inside vehicle/building;
- exit validates support + body/head clearance;
- blocked exit remains DRIVE;
- input/camera/listeners switch atomically;
- failed async preparation keeps previous valid mode.

Do not assign a conflicting interaction key before the real host input map is checked.

### C4 · Road / intersection / terrain

After C3, extend the accepted receiver window or use a second window:

reverse → turn → park → intersection → city road ↔ real Travel terrain → stop → exit

A City-Lab road-terrain anchor is only a source candidate. Receiver PASS requires actual Travel terrain contact and the same visible/contact mapping.

### C5 · Save / reload

Travel World Recipe remains persistence owner.

Add only:
- stable vehicle ID/profile;
- locomotion mode;
- vehicle pose/orientation and minimum physical state;
- actor/seat relation;
- safe restore point;
- receiver window/city source ref.

No parallel garage save, Registry or City localStorage truth.

### C6 · Full city in Travel

Only after C0–C5 choose one existing-owner adaptation:
1. radial gravity / local-frame rebasing on the existing Slice-04 solver;
2. Travel-owned local map/instance transition into a City scene;
3. another measured approach preserving one movement owner.

Do not imply that visual rotation or global scale-down solves gravity, suspension and contact.

## 5 · Public KFB Hub contract

Permanent source routes:
- /kfb-hub/free-roam/cities/ehrenfeld/
- /kfb-hub/free-roam/cities/huerth/

Each keeps separate actions:

### View current city
Shared City Lab S1 viewer.

### Drive current city
Enable only when a named runtime has actual public browser evidence.

If C0 standalone City Drive appears before C3 Travel integration, label it:
**Standalone City Drive · Travel Walk↔Drive still open**

Later the same permanent city page may expose both Drive city and Open in Travel without changing recovery URLs.

## 6 · Evidence classes

Keep separate:
- TESTED RESULT · City export — already green.
- TESTED RESULT · Standalone City Drive — only after real browser/physics city tests.
- TESTED RESULT · Travel micro receiver — only after mapping into the real Travel host.
- PUBLIC DEPLOYMENT — only after actual kayfabizarro.pages.dev bytes/runtime are checked.
- GEORG ACCEPTANCE — separate manual feel/visual judgment.

## 7 · Do not do

- no third vehicle engine;
- no City-specific player root;
- no duplicate Travel terrain;
- no full-city flat tangent claim on radius-5 globe;
- no hidden switch back to BOX1 coordinates;
- no City-owned save schema;
- no traffic/police/economy before core receiver proof;
- no stunt layer before reverse/turn/parking/contact;
- no concurrent patch to current Travel Ground files while its human regression review is active.

## 8 · Readiness

**CITY SOURCE / EXPORT:** READY  
**FR-S04-02 DRIVE DONOR:** SOURCE + PUBLIC BROWSER PASS · HUMAN FEEL OPEN  
**TRAVEL GROUND:** AUTOMATED REGRESSION REPAIRED · HUMAN REVIEW OPEN  
**TRAVEL DRIVE MODE:** NOT IMPLEMENTED  
**C0 STANDALONE CITY DRIVE:** READY TO IMPLEMENT AFTER CURRENT DONOR FEEL GATE  
**C1–C4 TRAVEL RECEIVER:** PREPARED · NOT STARTED  
**SAVE/RELOAD:** OPEN  
**PUBLIC CITY S1:** separate Cloudflare proof required  
**GEORG ACCEPTANCE:** OPEN

This is a preparation artifact. It does not change Race or Travel runtime owners.
