# TinySkies × OSM × Landmark Cohesion v1 · Pilot 07 · 2026-09-19

**Status:** SOURCE-BACKED DESIGN / IMPLEMENTATION CONTRACT  
**Owner:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Branch:** `img2threejs/tinyskies-osm-cohesion-v1-2026-09-19`  
**Planned Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/` — **NOT DEPLOYED / NOT VERIFIED**

## GOAL

Define one reusable visual contract for later KFB worlds where:

- TinySkies-like terrain / sky / weather provide the host atmosphere;
- OSM buildings and KFB landmarks remain geometrically distinct but visually belong to that world;
- City Grotesque stays the default landmark deformation;
- time of day / weather affect the whole scene coherently instead of requiring one-off recolours per asset.

This slice does **not** replace Travel, OSM City Lab, Race, Audio or Registry ownership.

## SOURCE DONORS

### KFB

- `georg-doc/kayfabizarro@779019712716c137746155b292c39ec486732d0f` at branch start
- OSM City style / deformer / lighting remain current owners
- Pilot 06 World Style Bridge remains the current landmark authoring donor
- default landmark deformation: **City Grotesque**
- default landmark review environment: **OSM City Lab**

### TinySkies upstream

Repository: `dannylimanseta/tinyskies`  
Default branch: `cursor/globefly-multiplayer-globe-flight-game`  
Pinned reviewed commit: `2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

Reviewed source blobs:

- `client/src/game/Globe.ts` → `c853d16bd7b5e44fcd331e6ff90ab82142e66c9e`
- `DayNightCycle.ts` → `dd485092e574037f9782f9ef68f7649e8e100287`
- `SkyPresets.ts` → `dfbab3f733eed74cc281df47a3e44967c1c7b2eb`
- `RimLight.ts` → `e2a669912b9cb65fc96889a544024bbe2e20be44`
- `RainOverlay.ts` → `02e3e690b621c67052817fa4bb81d1bc65da8491`
- `TerrainSurface.ts` → `1996a314b506144ae118665be0e1c31e2f5d4c5d`
- `Game.ts` → `3a96cae26f4c9034bacd6d60a60e2a005e261ccc`

## PROTECTED BOUNDARIES

- TinySkies is a visual/technical donor, not a KFB runtime owner.
- KFB Travel remains the current KFB world/sky/mood owner.
- OSM City Lab keeps geographic truth, local metre projection and City geometry/style.
- Race/Travel keep physics, contact and movement.
- Audio keeps weather/music playback.
- Landmark-local identity colours are not overwritten by weather/time.
- No unverified TinySkies material behaviour is promoted as fact.

## DONOR PRINCIPLES TO REUSE

1. **Terrain-aware grounding** — props query the real terrain surface and are sunk slightly into it; observatories even use a deeper foundation.
2. **Simple local albedo identity** — houses, lighthouse and observatory use a small readable palette.
3. **Flat-shaded lit materials** — MeshPhong + flat shading is common; village houses use vertex colours and instancing.
4. **Shared rim response** — a global rim colour is updated from the current sky preset, so many unrelated objects inherit the same time-of-day edge light.
5. **Local emissive accents** — village windows and lighthouse lanterns glow without recolouring the whole building.
6. **World-owned day/night** — sky, fog, hemisphere, ambient, sun/fill/back lights, cloud opacity, atmosphere, ocean and rim colour are updated together.
7. **Weather is world-first** — current TinySkies rain is confirmed as overlay/audio driven; building wetness/albedo changes are **not** a confirmed donor behaviour.
8. **Genius-loci placement** — lighthouse = coast; observatory = elevated isolated ground; villages = moderate land elevation.

## KFB TARGET CONTRACT

### A · Geometry

`terrain → OSM massing → landmark hero override → props`

Grotesque deformation is presentation-only and orthogonal to world lighting.

### B · Colour

`landmark/building identity albedo + biome relation + global world light`

- asset/landmark keeps its own six-zone identity palette;
- OSM buildings use deterministic material classes / roof/accent families;
- terrain/biome may bias hue families;
- saturation/lightness stay bounded;
- day/night does not rewrite every albedo.

### C · Lighting

One host-owned `WorldAppearanceState` drives:

- sky / fog;
- hemisphere / ambient;
- key + fill + back lights;
- global rim colour;
- optional emissive visibility/gain;
- weather intensity.

No per-landmark hero light by default.

### D · Grounding

Every world object gets a ground contract:

- `terrainHeightAt(x,z)` / surface sample;
- footprint/foundation depth;
- optional deeper foundation on sloped/rough terrain;
- no visual floating.

### E · Weather

Baseline donor match:

- rain overlay / particles;
- rain audio;
- world fog/cloud response if host implements it;
- **no automatic wet material pass yet**.

Future KFB extension, separately gated:

- bounded wetness scalar;
- roughness/specular change;
- slight albedo darkening;
- puddle/road response.

## DONE WHEN

- donor facts and source pins are persisted;
- the KFB appearance contract is machine-readable;
- a pure `WorldAppearanceState` helper exists;
- tests distinguish donor-confirmed behaviour from future KFB extension;
- WSA can review this as a visual integration contract without inheriting a new runtime.

## NEXT GATE

Use this contract when building the modular Grotesque Cologne Cathedral OSM Golden Sample and the first TinySkies-terrain / OSM-object integrated Stage proof.
