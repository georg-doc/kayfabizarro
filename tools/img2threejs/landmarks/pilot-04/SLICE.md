# Landmark Group Rig v1 · Slice Brief · 2026-09-19

**Status:** DECISION / BOUNDED SLICE START

## GOAL

Fix the visible Pilot-03 failure where Spasskaya clock assemblies can visually separate from the deformed tower. Prove one semantic landmark-rig path on **Spasskaya Tower + Kremlin wall study**:

1. deform the structural host with the existing City grotesque / soft-cubist grammar;
2. keep clock assemblies rigidly attached through explicit anchors and a sampled local deformation frame;
3. expose a small presentation-only living-toy reactor with `idle`, synthetic `beat/disco`, and `impact` signals;
4. make the result directly reviewable in a browser viewer and hand it to the existing WSA lead.

This slice does **not** add Area 51 / JFK / Atlantis / Acropolis geometry yet. Those remain ideation/backlog after this rig seam is proven.

## EXISTING OWNER

- Landmark authoring / donor source: `georg-doc/kayfabizarro/tools/img2threejs/`
- OSM City geodata / local metres / City style / landmark override contract: `tools/osm-city-lab/`
- Existing WSA technical integration lead: WSA in `georg-doc/KFB-Stunt-Car-Race`
- Travel / Free Roam: movement, terrain contact, persistence
- Race: driving/contact/physics/camera/gameplay
- Audio: existing audio owner; this slice emits/consumes normalized preview signals only

No new technical owner is created.

## EXACT SOURCES / REVISIONS

Recovered immediately before implementation:

- `georg-doc/kayfabizarro@f30b719a8c9da3e9ac90d4d9628c0691d676d1e9`
- `georg-doc/KFB-Stunt-Car-Race@91bc567c9c36270ac970ce59e3744b8a9c21a599`
- `tools/img2threejs/landmarks/pilot-03/deform.mjs` blob `7a68ac7742cf117074af3a5e5d12ef98791ad377`
- `tools/img2threejs/landmarks/pilot-03/viewer.mjs` blob `d5a6b4b3d67f0b629ed0e14df2c31d9a8adfdfae`
- `tools/osm-city-lab/src/style/cartoon-city.js` blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- `tools/osm-city-lab/styles/kfb-city-v0.json` blob `f129cca3041b55b84de26048dad7aef8fac8b292`
- shared prop donor `travel/wip/travel_globe_wsa/kfb-cartoon-deform.js` blob `22d1d537915ad7e552dbfa942ac3dd8c291886f2`
- current WSA donor pointer: `KFB-Stunt-Car-Race/_handover/IMG2THREEJS_LANDMARK_DEFORM_PILOT_03_2026-09-18.md` blob `1949732924c585063f050d31aaee80f2ce3c0612`

## PROTECTED BOUNDARIES

- Pilot 01 / 02 / 03 and accepted Dom v0.2 are not rewritten.
- City S2 collision/export geometry remains undeformed.
- No OSM landmark manifest entry or geographic identity is invented.
- No collision/bounce force is implemented in this authoring viewer. `bumperProfile` is metadata only for a later Race/Travel receiver.
- No audio engine is created. Disco preview uses a synthetic beat envelope; the public reactor accepts normalized external signals later.
- No replacement of Race movement/contact/camera, Travel terrain/persistence, Registry asset identity, or Audio owners.
- `kfb-box-material` / `edge3` remain deferred to the next surface-material slice.

## DONE WHEN

1. Spasskaya and Kremlin study expose semantic groups:
   - `towerCore`
   - four `clock:*` rigid attachments
   - `wall:left` / `wall:right` when present
   - `secondarySoft`
2. In grouped `city-grotesque` and `soft-cubist`, every clock follows an explicit host anchor/local basis and retains its own rigid dimensions instead of receiving independent point deformation.
3. Numerical QA proves:
   - source model unchanged;
   - triangle count preserved by grouped deformation;
   - rigid clock vertex distances to their anchor are preserved within tolerance;
   - attachment anchors map through the same deformation field as the tower;
   - ground anchor remains fixed.
4. Viewer offers legacy-vs-grouped comparison plus Base / City Grotesque / Soft Cubist.
5. Living-toy preview exposes bounded `idle`, `beat`, and `impact` reaction signals with no physics/audio ownership claim.
6. Additive README / Changelog / evidence and a pinned WSA handoff are present on GitHub.

## OPEN HUMAN REVIEW QUESTION

Does **Grouped Soft Cubist** or **Grouped City Grotesque** feel closer to the intended “breathing living toy” landmark language?
