# Ideation · Living Toy World / Reactive Landmarks / Surreal Historic Scenery · 2026-09-19

**Status:** PROPOSAL / ADDITIVE IDEATION.  
**Implementation status:** only Landmark Group Rig v1 is implemented in the current slice. Everything below remains proposal/backlog until separately scoped and accepted.

## North Star

> **The world as a breathing, living toy.**

The intended world should not read as static OSM scenery plus isolated hero props. Terrain, buildings, landmarks and set dressing should appear to possess a restrained internal life that can become stronger in explicit game / music modes.

This north star is compatible with the current ownership model only if presentation signals remain separate from physics/contact and audio ownership.

## Semantic landmark groups

Current Rig v1 proof introduces the first concrete group grammar:

- `coreMass` — main deformable body;
- `rigidAttached` — clocks, plaques, roses, facade ornaments or other pieces that follow a host anchor without independent global deformation;
- `secondarySoft` — antennae, flags, cables, star/ornament pieces that may wobble or overshoot;
- `reactiveGameplay` — proposed semantic group for later contact / bumper reactions owned by the receiving gameplay/contact runtime.

The v1 Spasskaya proof maps four clocks as explicit rigid attachments. This is the model for future Dom windows/rose, Acropolis pediments, UFO panels, etc.

## Living-toy response layers

### IDLE

Subtle background life:
- breathing / volume-preserving pulse;
- slow sway;
- small secondary-soft wobble;
- restrained material/accent modulation.

### MUSIC / DISCO

Buildings and terrain become a spatial music visualizer:
- BPM / phase;
- beat and downbeat;
- later bass / mid / treble bands;
- material-zone light / colour response;
- rhythmic pulse;
- compatible with existing KFB voxel dancefloor language.

**Boundary:** current Rig v1 uses a synthetic normalized beat envelope only. No audio runtime is created. Later integration should consume the existing audio owner's signals.

### IMPACT / STUNT

Visual response to Race/Parcours events:
- squash / stretch;
- spring-back / overshoot;
- short lateral kick;
- material flash;
- shock ripple;
- secondary-soft wobble.

Large landmarks can later expose **bumper metadata** to Race/Travel:
- approximate contact volume;
- bounce profile;
- cooldown;
- impact FX profile;
- audio event name;
- animation response profile.

**Boundary:** this is not collision implementation. Race / Travel contact owners remain authoritative.

## Scenery candidates

### 1 · Acropolis / Athens

**Status:** PROPOSAL.

Why useful:
- strong readable historic silhouette;
- columns / entablature / pediment naturally map to semantic groups;
- tests attachment logic without requiring extreme detail;
- supports Base / Grotesque / Soft Cubist and possible block/voxel archaeology variant.

Suggested first scope:
- Acropolis plateau / Parthenon-inspired hero massing;
- columns as repeated grouped elements;
- pediment as rigid host attachment;
- OSM footprint/terrain placement only after source review.

### 2 · Area 51 / crashed UFO

**Status:** PROPOSAL.

Treat as a surreal scene kit, not one landmark:
- runway / low base blocks;
- hangars;
- radar / fence / towers;
- crashed UFO embedded into terrain;
- underground-base entrance hint;
- military / intelligence visual language via source-backed props where available.

Best candidate for the first full **living-toy gameplay showcase**:
- UFO or hangar as reactive bumper;
- paranormal pulse / antigravity impact response;
- disco / alarm / secret-base mode;
- terrain crater and scene dressing.

No claim of real classified underground layout should be made; use public geography plus explicitly fictional/surreal underground composition.

### 3 · JFK assassination-route / Dealey Plaza-style slice

**Status:** PROPOSAL.

Treat as a city/scenario slice:
- public OSM street/building geometry where available;
- route staging;
- grassy-knoll / plaza landmarks;
- historically recognizable massing;
- optional surreal/cubist presentation layer.

This is not one hero asset. It is primarily a **source-backed city block / route composition problem** and should reuse City Lab rather than create a parallel scene mapper.

Historical claims, event markers and speculative/conspiracy layers should remain separately labeled data/presentation layers rather than being baked into the geographic base.

### 4 · Underwater Atlantis / Escher-like city

**Status:** PROPOSAL.

Treat as a biome / impossible-architecture kit:
- submerged plazas and towers;
- impossible stairs / bridges / loops;
- coral / ruin dressing;
- underwater fog, caustic-like light language, particles;
- slow music-driven breathing / current-like deformation.

Because literal Escher works are copyrighted, the design target should be **general impossible-geometry / paradoxical architecture**, not reproduction of a particular Escher image.

## Proposed sequence after Rig v1

1. Human review of Grouped City Grotesque vs Grouped Soft Cubist.
2. One bounded **surface/material** proof using `skills/kfb-box-material.js` + `edge3.jpg`.
3. One bounded **Beat/Impact adapter** proof that consumes an existing audio/race signal seam without becoming the owner.
4. **Acropolis** as next clean historic hero landmark.
5. **Area 51** as first reactive scene-kit proof.
6. **JFK route** as a source-backed city/scenario slice.
7. **Atlantis** as a later biome / impossible-architecture slice.

## WSA review relevance

WSA should treat this document as ideation plus donor direction, not as an integration command. Current implementation evidence is only Landmark Group Rig v1. Any bumper/contact behavior needs an explicit receiver-side Race/Travel slice and its own test/acceptance gate.
