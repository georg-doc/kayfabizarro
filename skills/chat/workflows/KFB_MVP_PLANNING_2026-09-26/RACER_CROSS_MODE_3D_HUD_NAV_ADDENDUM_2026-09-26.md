# KFB Racer · Cross-Mode HUD + 3D Navigation Addendum · 2026-09-26

Status: **STARTABLE DESIGN ADDENDUM · EXISTING HUD OWNER ONLY · NO RUNTIME / TRACK / STAGE CHANGE**

Owner route:
- dispatch / planning: `georg-doc/kayfabizarro` PR #222;
- visual authoring: existing Racer Claude Design project;
- Race movement / physics / camera / route truth remains `georg-doc/KFB-Stunt-Car-Race`;
- cross-mode semantic routing remains existing `META-HUD-01` / `META-NAV-01`; this file creates no second HUD owner.

Use together with:
1. `CLAUDE_DESIGN_RACER_HUD_BILLBOARDS_CURRENT_START_2026-09-26.md`;
2. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/RACER_CLAUDE_HUD_BILLBOARDS_ADDENDUM_2026-09-23.md`;
3. Race issue #20 / HUD v3 and frozen HUD Toy C0 PR #23 as donor/evidence only.

## Product goal

Turn the current promising Racer HUD into one **adaptive KFB instrument/navigation grammar** reused across WALK, DRIVE/RACE and FLIGHT without showing irrelevant instruments.

The screen must still read primarily as the game world.

Mode changes switch providers and visibility; they do not instantiate a second HUD.

Examples:
- Tacho is visible in DRIVE/RACE and hidden in WALK.
- Flight may reuse the same instrument zone only when a real airspeed/altitude provider exists.
- Mini-map/navigation exists only when the active mode has a real route/world provider.
- Radar/sensor view exists only when a real sensor provider exists.

No empty slot gets filled with fake telemetry.

## Source locks / donors

### 3D navigation object — first choice

Exact already-proven Factory Arrow donor:

`georg-doc/kayfabizarro@ca369690d3021327b2ffc2f502ad918d417d5017`

`media/3D_Assets/kenney_factory-kit_3.0/Models/GLB format/arrow.glb`

PR #23 already proved this source object in isolation. A new Claude session must still **show the actual source object visibly before composition**; a loaded URL is not evidence.

Do not model a replacement compass/arrow before this donor is judged in the intended perspective.

If a later gimbal/ring/housing is desired and no current source-backed donor fits, record it as `SOURCE_REQUIRED / NEW_DESIGN_GATE`; do not silently improvise generic HUD chrome.

### HUD composition

Current Racer Claude direction remains the active presentation donor:
- stopwatch/time;
- LAP/BEST/settings in Race;
- ring speedometer;
- map;
- compact Radio;
- sound/settings icon language;
- `HUD_THEME / HUD_LAYOUT` seam.

Do not restore rejected old HUD-v1 composition.

### Navigation behavior reference

WoW Undermine D.R.I.V.E. research in Race main @ `24c430bedb7cc18edcd029fc1932f78f5fb7ff83` is a **functional reference only**:
- world-space direction Arrow;
- destination / pickup-dropoff spatial cue;
- route guidance tied to the same job/navigation truth.

Do not copy WoW UI skin, quest tracker or addon chrome.

## Three visual layers

Use three explicit layers rather than one flat overlay.

### L1 · World cue

The real destination / next decision exists in world/route space and comes from the active navigation provider.

The HUD does not create a second quest/path truth.

### L2 · Near-world 3D navigator

The Factory Arrow lives in a shallow 3D layer between world and ordinary HUD:
- visible perspective and parallax;
- visually near the current Mini-map cluster, but not a fixed 2D icon;
- may be camera-local or vehicle-local presentation, while its direction derives only from the active provider;
- never permanently covers the apex, horizon/vanishing point or central flight corridor.

### L3 · Screen / physical instrument HUD

Existing shared HUD slots:
- Almanac / POP / Backpack / shared media as applicable;
- mode-specific time/lap/tacho/map/radio/sensor instruments;
- settings on demand.

No generic full-screen frame.

## Provider contract

Design against one thin mode state. Do not implement new game owners in Claude.

Suggested presentation-facing shape:

```
modeId: WALK | DRIVE | FLIGHT
navProvider:
  active
  targetId
  targetWorld
  nextDecisionWorld
  distanceM
  arrivalRadiusM
  verticalDeltaM
  routeConstrained
mapProvider:
  available
  kind: WORLD_ZONE | RACE_ROUTE | FLIGHT_ZONE
telemetryProvider:
  speed
  boost
  altitude
  climbRate
sensorProvider:
  available
  contacts
mediaProvider:
  available
```

Fields may be absent. Absence means hide the dependent instrument.

The real implementation owner may map existing state into this shape later; Claude uses it only as a presentation contract.

## Mode matrix

| Element | WALK | DRIVE / RACE | FLIGHT / CARD FLIGHT |
|---|---|---|---|
| 3D navigator | target only | route / next decision | target / route, 3D vector |
| Mini-map | real World/OSM provider only | real route provider | real flight/world provider only |
| Tacho / speed | OFF | ON | OFF by default; reuse instrument zone only with real flight telemetry |
| Lap / Best / stopwatch | OFF | race context only | OFF |
| Boost | OFF unless real mode owns it | Race provider | only if real flight provider owns it |
| Radio | shared compact affordance where useful | compact driving control | shared compact affordance |
| Radar / sensor | OFF unless provider | normally OFF / contextual | ON only if a real sensor/contact provider exists |
| Almanac / shared meta | ordinary gameplay state | ordinary gameplay state | ordinary gameplay state |
| Settings | on demand | on demand | on demand |

Combat and immersive Almanac keep their existing separate adaptive-HUD rules; this addendum does not redesign them.

## 3D navigator behavior

### WALK
- yaw toward the next real route decision / target;
- no pitch unless terrain/target verticality is materially meaningful;
- low-motion spring smoothing;
- hide when no destination exists.

### DRIVE / RACE
- prefer the **next route decision** over a straight-line vector to the final destination;
- yaw is primary;
- pitch is tightly bounded and only represents meaningful grade/elevation;
- route anticipation may begin before the geometric turn if the real route provider supplies the next decision;
- no permanent screen-edge arrows;
- arrival = one restrained physical pulse / settle, then hide or acquire the next target.

### FLIGHT
- use the full local 3D target vector;
- yaw + pitch may both be meaningful;
- avoid continuous roll with the vehicle/camera if it harms reading; preserve a stable readable frame while still showing parallax;
- altitude/climb cues are separate provider data, not inferred from the arrow itself.

### Motion
- critically damped / spring-like orientation changes;
- no jitter from terrain contact or camera micro-bounce;
- no exaggerated idle bob;
- transition states: `HIDDEN → ACQUIRE → TRACK → ARRIVE`;
- replan changes direction without flashing generic warning panels.

## Mini-map + 3D navigator + Radar layout

Desktop target:
- existing Mini-map remains lower-right;
- 3D navigator floats **above / slightly inboard** of the map cluster with real depth separation;
- it should read as a physical guide in the world-facing layer, not as a badge attached to the map.

The current compact Radio is already below/near the map in the Racer composition. Do not stack permanent Radar + Radio + Map into a tall widget column.

Use one **conditional utility slot**:
- ordinary DRIVE: compact Radio;
- sensor-heavy FLIGHT / later modes: Radar may take that secondary slot while Radio collapses to its shared compact affordance;
- if both genuinely matter, recompose rather than shrinking both into unreadable widgets.

Radar rules:
- no generic sweeping circle with invented contacts;
- render only real `sensorProvider` data;
- if provider absent: Radar is absent;
- mobile/touch may hide or collapse Radar before encroaching on controls.

## Responsive composition

Prove:
1. 1440×900 WALK;
2. 1440×900 DRIVE/RACE;
3. 1440×900 FLIGHT;
4. 390×844 DRIVE;
5. 390×844 FLIGHT.

Mobile:
- protect touch-control bands;
- do not merely scale the desktop cluster down;
- preserve road/flight corridor first;
- Navigator may move relative to the Mini-map while retaining the same semantic relationship.

## Required Claude Design work

### H1 · source proof
Show the exact Factory Arrow alone:
- front / side / 3-quarter;
- one perspective test at intended scale.

### H2 · mode comparison
Using the current Racer HUD source, create one switchable WALK / DRIVE / FLIGHT presentation harness.

Mock state is allowed **only as clearly labelled presentation data**. Do not claim a fake map/radar/telemetry provider is implemented.

### H3 · 3D navigator integration
Place the exact Arrow in the near-world layer and prove:
- parallax;
- target rotation;
- WALK yaw;
- DRIVE next-decision behavior;
- FLIGHT yaw + pitch;
- no apex/horizon blockage.

### H4 · conditional instruments
Prove that irrelevant elements disappear cleanly:
- no Tacho in WALK;
- DRIVE has speed / Race instruments;
- FLIGHT does not invent instruments;
- Radar is provider-gated.

### H5 · token seam
Extend the existing `HUD_THEME / HUD_LAYOUT` seam with only presentation values:
- navigator anchor/depth/scale;
- navigator damping/visual pulse;
- map/nav spacing;
- utility-slot rule;
- mode visibility rules.

No gameplay state enters the theme.

## Protected boundaries

Do not:
- change Race driving/physics/contact/camera ownership;
- create route/pathfinding truth;
- create a second Mini-map source;
- create a second audio owner;
- implement fake Radar contacts;
- repair PR #23's frozen anonymous-404 gate inside this design task;
- rebuild the Factory Arrow;
- create Track Core / route geometry;
- use generic black quest panels or SaaS-style cards;
- claim Stage or Live.

## Deliverable

In the same Racer Session Cut:
- source-isolation views;
- WALK / DRIVE / FLIGHT desktop comparisons;
- DRIVE / FLIGHT narrow/mobile comparisons;
- updated HUD token/layout seam;
- mode/provider matrix;
- navigator behavior notes;
- screenshots / short motion proof;
- additive changelog;
- `SOURCE.json`;
- `RETURN.md`.

## Human gate

**Does the same HUD family feel coherent across WALK / DRIVE / FLIGHT, with the 3D navigator reading as a useful game-space instrument rather than another screen widget?**
