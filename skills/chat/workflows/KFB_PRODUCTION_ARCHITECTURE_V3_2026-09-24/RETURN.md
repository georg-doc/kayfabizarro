# RETURN · KFB Production Architecture v3 · Race/World/Look/Audio decisions · 2026-09-24

Status: **ARCHITECTURE CANDIDATE READY · 11 STRANDS / 53 JOBS · 73/73 PASS · UNMERGED · NO LIVE PROMOTION**

## Exact state before this Return write

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- Base: `main@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- validated architecture/source checkpoint: `b9e5f0c8d7faeb78105aa368f029ca486012c83e`
- public Stage created by this architecture slice: **no**
- Cloudflare Live promotion: **not authorized**
- existing public Hub remains: `https://kayfabizarro.pages.dev/kfb-hub/`

## Production architecture

The current self-service model remains:
**11 primary strands · 53 copy-ready jobs · 26 READY · 27 dependency-gated HOLD**.

The full strand map still covers:
ToolBox · Animation/Residents · WorldBuilder/God Mode · Racer→World · Quick 3D Review · Combat/Choreography · Cube Pets/Actor Identity · Travel Modes/World Surfaces · Vertical/Babel · Town/NPC Life · Shared Stage/Transitions.

The Hub must remain strand-first with jobs collapsed by default.

## New binding Race / RKIT decisions

Source:
`RACE_WORLD_LOOK_AUDIO_DECISIONS_2026-09-24.md`

### D1 · Physics
**Rapier is the canonical stunt-dimensioning / airborne-contact basis.**

Current design basis:
- speed: 27 m/s;
- gravity magnitude: 15 m/s² downward;
- proven physical ramp around 16°.

Reason:
current C-3 route-relative movement does not physically launch from ramps; only its explicit jump path creates air time. Stunt geometry should not be dimensioned against an airborne/contact system that still has to be invented.

The human-positive Track-Lab v0.8 steering/drift/grip feel remains a handling target/donor, **not** a second physics owner.

### D2 · Widths
Canonical:
- NARROW 10.8 m
- STANDARD 14.4 m
- WIDE 18.0 m
- HERO 21.6 m

28.8 m may remain only as an explicit special/XL module/profile.
18 m remains **WIDE**.

### D3 · Jumps
Keep both:
- `JUMP_BASE` around 12 m;
- `JUMP_HERO_30` around 30 m as a step-down spectacle jump.

Ballistic design aid:
at 27 m/s, 15 m/s² and ~16.3°, same-height ideal range is about 26 m; at 30 m horizontal distance the ideal trajectory is about 1.3 m below the lip. Therefore roughly 1.5–3 m step-down is a useful geometry study range before real Race runtime verification.

### D4 · Launch
Blender/RKIT owns geometry + lip/landing frames + stunt metadata.
Race/Rapier owns takeoff/contact, airborne state, landing and recovery.

### D5 · Moving flap
RKIT may produce the thin-deck flap-down with hinge/axis/angle/collision metadata.
Race owns trigger and the collider/support transform that follows the hinge.
An animated visual flap without matching contact is not playable acceptance.

## Track product simplification

A general track editor is explicitly **deferred**.

Fast path:
1. `TRACK_A_STUNT_8` — figure-eight / over-under + Base Jump + Hero Jump + one bridge/tunnel/flap feature.
2. `TRACK_B_OVAL_EXIT` — broad oval/zero-like loop + one exit/branch.
3. `TRACK_C_FLOW_LOOP` — handling/freeplay course.

Pipeline:
```
small authored Route Recipe
→ deterministic route compiler
→ RKIT rounded profile + stunt modules
→ baked Track Module
→ WorldBuilder placement
```

The baked module keeps compact recipe/route/stunt data plus cached visual GLB/anchors/material roles/provenance. Race retains contact/physics truth.

Current RKIT sources:
- PR #34 `f368dd0c71eb2798bcd057d30196cb8da4d967b6`
- PR #35 `37047b5a14c00e8b3cb5ddb4129e76ce3f10b2d9`

Prepared READY jobs:
- `RACE-TRACK-RECIPE-01`
- `RACE-RKIT-03`

## OSM / World Zone bake

The current Cologne `dom-zentrum-v0` normalized source/cache/anchors are the first production proof.

Pipeline:
```
source extract/query
→ normalize to semantic metre frame
→ deterministic city/world compile
→ versioned baked World Zone
→ WorldBuilder ref + transform
```

No live Overpass dependency during normal WorldBuilder/game use.

The package keeps source/hash/provenance/compiler/look revision and baked visual/support data.

Decision:
- **Cologne first**
- **Barcelona second-city portability proof**

WorldBuilder composition is deliberately freer than OSM geography:
Barcelona Zone + authored Cologne Cathedral + Track A + Resident Scene is valid, provided the Cathedral is recorded as an authored landmark instance rather than Barcelona OSM truth.

Prepared:
- `WORLD-ZONE-BAKE-01` READY
- `WORLD-ZONE-BAKE-02` HOLD until the compiler/package contract passes.

## Elastic / Landmark torsion

Hürth R2 remains frozen after two failed repair passes on PR #194:
`b7f28824299b15e5d8a61c4bd9d847cfbe8f18ea`.

No third city-block patch.

New READY job:
`LOOK-TORSION-01`.

It reuses existing GROTESQUE / BuildingElastic / LandmarkElastic evidence and adds an isolated height-dependent TORSION/TWIST proof:
- anchored base;
- bend/lean/taper/twist share one coherent height field;
- stronger deformation on tall/hero landmarks;
- roof/body boundary follows final silhouette;
- camera skew may amplify but never substitute for geometric deformation.

Existing City GROTESQUE twist around 11° is a donor/reference upper range, not a global constant.

## Audio / music / VFX production

### Sound
New READY:
`AUDIO-AUDITION-01`.

Goal:
Georg chooses by **human label + listening + A/B**, not OGG/WAV filenames.

Existing source-backed banks/manifests are inventoried into semantic categories:
Vehicle · Combat · UI/Card · World/Ambience · Transition · Performance/Crowd.

Games emit semantic ids such as:
`vehicle.jump`, `vehicle.land`, `melee.hit`.

The game keeps its AudioContext/master.

### Music performance
Prepared:
`MUSIC-PERF-01`.

Resident performance recipes reference:
- songRef;
- BPM;
- bar/beat offset;
- performers;
- choreography/action refs;
- start/loop/finish markers;
- Stage/Camera recipe.

Animation Studio gets a beat/bar ruler when music is present.
Audio is not baked into clips.

### VFX
New READY:
`VFX-AUDITION-01`.

Start from actual current donors:
Combat Ink/recipe stack · Kenney smoke particles · indexed Brackeys VFX sources · Race/vehicle effects.

Production rule:
```
inventory
→ moving audition board
→ select donor
→ small semantic adaptation recipe
→ shared Review Scene
→ promote
```

A continuous-fire donor may be adapted to a single-shot burst through emission/lifetime when the source supports it. Do not author a fresh effect merely because its current preset loops.

## New jobs added in this decision

- `RACE-TRACK-RECIPE-01` — READY
- `RACE-RKIT-03` — READY
- `WORLD-ZONE-BAKE-01` — READY
- `WORLD-ZONE-BAKE-02` — HOLD
- `LOOK-TORSION-01` — READY
- `AUDIO-AUDITION-01` — READY
- `MUSIC-PERF-01` — HOLD
- `VFX-AUDITION-01` — READY

## Evidence

**73/73 architecture/source checks PASS.**

New exact sources revalidated:
- RKIT #34: `f368dd0c71eb2798bcd057d30196cb8da4d967b6`
- RKIT #35: `37047b5a14c00e8b3cb5ddb4129e76ce3f10b2d9`
- Hürth/Elastic #194: `b7f28824299b15e5d8a61c4bd9d847cfbe8f18ea`
- OSM context-builder blob: `92ac7dd9a48f7bf9c9b0471d57a6b9a647fb7a96`
- City GROTESQUE donor blob: `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- VFX review bank blob: `b208eb36d869078242c93c617de92cf10d873e36`

## Public Hub boundary

The expanded catalog is still prepared for **HUB-CTRL PR #202** and is not publicly mounted by this branch.

This architecture slice does not:
- fork the Hub owner;
- publish Live;
- merge product runtimes;
- claim a public Stage for the new jobs.

## Exactly one architecture gate

**HUB-V3-MOUNT**

Existing HUB-CTRL consumes the v3 catalog and renders the current 11 strand cards, with READY/REVIEW in Today and the full 53-job roadmap only on expansion.

Normal product work does not need to wait for that public mount: the copy-ready READY briefs are already in `STRAND_BRIEFINGS.md`.
