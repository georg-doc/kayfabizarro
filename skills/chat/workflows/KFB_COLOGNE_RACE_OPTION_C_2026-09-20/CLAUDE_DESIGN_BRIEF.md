# CLAUDE DESIGN BRIEF · KFB Cologne Race · Option C → Option A

Date: 2026-09-20  
Status: **DESIGN / PLAYABLE PROTOTYPE BRIEF · PUBLIC-REPO COORDINATION**  
Producer: **Claude Design**  
Integration lead: **WSA / KFB**  
Public coordination repo: `georg-doc/kayfabizarro`  
Private Stunt Race repo: **NOT REQUIRED BY CLAUDE**

Read first:
- `START_HERE.md`
- `FORM_ANSWERS.md`
- `SOURCE_PINS.json`
- `DOM_ZENTRUM_OVERPASS.ql`

---

# 1 · Product fantasy

Build a playable Cologne racing/free-rider design proof.

North Star:

> **THE WORLD AS A LIVING TOY**

Player fantasy:

> **Psychedelic Cut & Play Comic Card Racing / Free Rider / Travel / Delivery World**

The first hero race is the **DOM LOOP** around the Kölner Dom.

The world must feel recognisably Cologne, but never like “OSM with a road shader”.

Target impression:

> KFB invented a living toy Cologne, while OSM remembers where the real city belongs.

---

# 2 · Design sequence

Build **Option C first**.

## OPTION C · ELASTIC CARTOON WORLD

```text
TRACK       = FLOWING / PSYCHEDELIC / RETRO-CARTOON
BUILDINGS   = SOFT OMS / ELASTIC / LIVING
LANDMARKS   = HERO ELASTIC / ICONIC
WORLD       = ONE PLAYFUL LIVING TOY
```

After Georg reviews C, build **Option A** on the same technical scene:

## OPTION A · HYBRID DEFAULT

```text
TRACK       = FLOW
BUILDINGS   = STACK / CUBIST / CARD-PILE
LANDMARKS   = ELASTIC HERO FORMS
WORLD       = CONTRAST BETWEEN FLOW / STACK / CHARACTER
```

Do not mix A and C before the first C gate.

---

# 3 · Visual authority

Georg supplies two images directly to Claude:

- `OPTION_C_VISUAL_AUTHORITY`
- `OPTION_A_VISUAL_AUTHORITY`

For Slice C:
- sample color relationships from Option C;
- reproduce its warm/cool hierarchy;
- use its saturation and contrast as the visual authority;
- do not invent a substitute palette.

For Slice A:
- use the Option A board as its own literal palette/light authority.

No generic low-poly pastel fallback.

---

# 4 · Design system

Use:

# **KFB LIVING TOY DESIGN SYSTEM · OPTION C**

Not:
- Material Design;
- Tailwind defaults;
- generic racing-game UI;
- generic “low-poly mobile game” styling.

Shared systems:

```text
TrackFlow
BuildingElastic
LandmarkElastic
VehicleCartoonDeformer
HUD Game v3
KFB CardBuilder / PDF art
TinySkies / Travel water-light donor
restrained KFB Ink where readability improves
```

Global world inputs may be shared:

```text
windDirection
worldPulse
toyElasticity
heroExaggeration
mood
```

But do **not** run the same deformation formula over Track, buildings and landmarks.

---

# 5 · Public Race baseline — do not create a second controller

Claude does not depend on the private Race repository.

Use the public accepted Race v0.8 mirror pinned in `SOURCE_PINS.json`:

```text
kfb-hub/stunt-race/track-lab-v08/index.html
kfb-hub/stunt-race/track-lab/feel-lab-v08.mjs
kfb-hub/stunt-race/track-lab/RACE_FEEL_V08_CONFIG.json
kfb-hub/stunt-race/track-lab/RACE_FLOW_RUNTIME_CONFIG.json
kfb-hub/stunt-race/FLOW_LOOP_RECIPE_A0.json
```

The public mirror is the movement/control donor for this design candidate.

Do not invent a second vehicle physics/controller/camera system.

If a design-only seam cannot be wired cleanly, leave a declarative adapter hook rather than replacing the owner.

---

# 6 · Filament Level 2 / FILAMENT reference

Verified reference-only donor:

```text
KilledByAPixel/SP13KTRA@166ad838
code/levels.js
code/skeleton.js
FILAMENT / circuit index 1
```

Decision:

> **Derive the SHAPE / route grammar, then re-proportion it to real Dom geography.**

Allowed design grammar:
- seven-anchor kidney family;
- opening/start run through dense arches / tunnel;
- tightening double-apex character;
- smooth filleted turns;
- arc-length route sampling;
- eased elevation rhythm.

Do not copy:
- original code;
- literal original corner coordinates;
- original numeric scale;
- original meshes/materials/scenery;
- original assets.

Re-author an independent KFB Dom Loop after real OSM geography is available.

---

# 7 · Dom/Zentrum OSM data · READY

The real Dom/Zentrum source gate is already closed.

Do **not** query Overpass again for Slice C.

Start with the curated public context:

`tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json`

Full canonical source stack:

```text
tools/osm-city-lab/data/dom-zentrum-v0/
  SOURCE_SPEC.json
  query.overpassql
  source.overpass.json
  PROVENANCE.json
  normalized.json
  DESIGN_CONTEXT.json
  CLAUDE_CONTEXT.json

tools/osm-city-lab/scenes/dom-zentrum-v0.json
tools/osm-city-lab/evidence/dom-zentrum-v0-s0-report.json
tools/osm-city-lab/evidence/dom-zentrum-v0-fixture-analysis.json
```

Verified source state:
- OSM base timestamp: `2026-09-20T03:20:04Z`
- raw elements: **145,967**
- roads: **5,236**
- driveable roads: **2,523**
- buildings: **6,351**
- railway ways: **665**
- water lines: **6**
- local bounds: **2,279.652 × 2,115.070 m**
- deterministic source/normalization gates: **PASS**

Local metre frame:

```text
origin WGS84 = 50.942000, 6.962250
x = east
y = up
z = north
```

Hero anchors already curated:
- Kölner Dom = `way/4532022`, local `(-301.298, -75.744)`
- Köln Hauptbahnhof = `node/2399559029`, local `(-223.020, 87.263)`
- Hohenzollernbrücke = `relation/5460390`, local `(211.812, -62.121)`
- Deutzer Brücke = `relation/3837695`, local `(266.235, -622.379)`
- Rheinufertunnel = `way/23559378`, local `(16.832, -296.032)`

The exact Dom source footprint from `way/4532022` is preserved in `CLAUDE_CONTEXT.json`.

The convenience context also supplies:
- 70 named driveable road geometries nearest the Dom;
- 120 HBF-near railway geometries;
- Rhine/water context;
- bridge/tunnel/layer topology;
- provenance and ownership rules.

Map data attribution:

**© OpenStreetMap contributors · ODbL 1.0**

OSM supplies geographic/semantic truth only. The final world look is Option C / KFB.

# 8 · Cologne world hierarchy

## Hero 1 · Kölner Dom

Central iconic anchor.

Use current public landmark style sources.

Preserve:
- twin tower silhouette;
- main mass;
- orientation value;
- immediate recognisability.

Option C:
- elastic cartoon hero;
- controlled wind bend / living-toy motion;
- not melted.

## Hero 2 · Fernsehturm

Later hero landmark:

> Fernsehturm as playful cartoon lighthouse / beacon.

Reserve:
- rotating/sweeping beacon light;
- wind-direction bend;
- navigation role;
- race/quest orientation.

## Hero 3 · Ehrenfeld Mosque

Later district hero landmark.

Preserve geographic identity and recognisable massing.

Do not replace it with a generic fantasy mosque.

---

# 9 · Option C Track language

Track should feel:
- very flowing;
- broad;
- psychedelic;
- retro-cartoon;
- elastic but readable;
- generous enough for multi-car overtaking.

Initial width targets:

```text
NARROW   ~14.4
STANDARD ~18.0
WIDE     ~21.6
HERO     ~28.8
```

Keep configurable.

Use:
- large S curves;
- long sweepers;
- readable shoulders;
- smooth banking;
- hero ramps;
- one clear tunnel beat;
- low-frequency rhythm.

Avoid:
- black asphalt band;
- terrain poking through;
- dense micro-stripes;
- moiré;
- per-face rainbow coloring;
- tiny route wiggles.

---

# 10 · Track / terrain geometry

TC-01 black-ribbon + dense zone-strip result is **rejected visual history**.

Do not repeat it.

Preferred current direction:

```text
host polygons
  ↓
identify Track corridor
  ↓
grade / bank route
  ↓
locally refine only if needed
  ↓
continuous road / shoulder material masks
  ↓
stitch cleanly to host world
```

If the existing host polygons are sufficient, use them.

If they are too coarse at road edges, locally subdivide the Track patch only.

No face-by-face random colors.

Use continuous attributes/masks such as:

```text
roadWeight
shoulderWeight
edgeWeight
routeU
routeV
bank
surfaceState
biomeWeight
```

Structures are separate:

- surface road → `SURFACE_BOUND`
- bridge / loop / overpass → `STRUCTURE`
- tunnel → `TUNNEL`
- free-space route → `FREE_SPACE`

Do not build a hill under a bridge merely to support the road.

---

# 11 · OSM / OMS buildings · Option C

OSM supplies:
- location;
- footprint;
- street topology;
- semantic tags.

KFB supplies:
- massing;
- deformation;
- materials;
- lighting;
- silhouette.

For Option C, create **BuildingElastic** rather than reusing the exact Landmark deformer.

Desired behavior:
- soft cartoon lean;
- gentle squash/stretch;
- subtle wind response;
- rounded / hand-drawn silhouette;
- playful roof exaggeration;
- low-frequency motion;
- readable city rhythm.

Do not make every building wobble identically.

Use existing OSM/Grotesque/Soft-Cubist donors as source knowledge, but Option C is intentionally softer and more elastic.

---

# 12 · Option A later

Use the same Dom Loop and same gameplay setup.

Switch the environment language to:

### Track
`TrackFlow` — still flowing and psychedelic.

### Buildings
`OMSStack`:
- cubist;
- stacked;
- offset slabs;
- card-pile architecture;
- layered rectangles;
- card-stack motif as real geometry.

### Landmarks
`LandmarkElastic`.

Option A must be a coherent alternative, not merely “C with lower deformation”.

---

# 13 · Rhine

The Rhine is a major visual system.

Use current TinySkies / Travel water language as donor.

Desired:
- stylised shader;
- animated shoreline waves;
- foam/rim where useful;
- visible motion/current;
- cartoon reflections;
- strong high-speed readability.

No flat opaque blue plane.

For pass 1:
- one visible Rhine segment is enough;
- it must be real world context from OSM, not a decorative invented lake.

---

# 14 · Future Cologne route network — reserve topology now

Do not build all of it in Slice C, but keep route anchors/data extensible for:

- Rhine bridges;
- Kölner Ringe;
- Altstadt;
- Dom / HBF underpasses;
- HBF rail tracks as later stylised race routes;
- Autobahnkreuz Köln as future merge/split/multi-level edge-case test;
- district-by-district expansion toward Ehrenfeld and Hürth.

HBF rails are not ordinary road skins.

They should later reuse route/physics logic with a distinct KFB railway Track treatment.

---

# 15 · Vehicles

First Slice C must use real public assets, not a procedural stand-in.

Primary:
`KayKit City Builder Bits / car_hatchback.gltf`

Optional:
`car_sedan.gltf`
`car_stationwagon.gltf`

Use current public Vehicle Lab v4 deformer source from `SOURCE_PINS.json`.

Validate:
- orientation;
- scale;
- contact frame;
- camera fit;
- deformation;
- trail anchor;
- rear orb anchor.

Later expand to all compatible KayKit / registered vehicles through the same measured pipeline.

Do not claim a vehicle playable merely because its GLTF loads.

---

# 16 · Vehicle Transformer later

Keep clean hooks for later current/new Vehicle Transformer animations:

- reverse driving;
- turn-around;
- hard steering;
- direction reversal;
- special manoeuvres;
- possible drive→flight seam.

Do not fabricate fake baked animation clips if current measured procedural/deformer seams exist.

---

# 17 · Speed trails / speedlines

Use colored vehicle trails inspired by the original design target, implemented independently.

Requirements:
- trail length grows with speed;
- width/scale changes with speed/boost;
- drift can fan trails laterally;
- vehicle/world palette coordinated;
- boost increases intensity;
- trails never hide the road.

Reuse current KFB Travel speedline/contrail ideas where useful.

Presentation only — no second movement owner.

---

# 18 · Rear propulsion orb

Compatible player vehicles may show:

- pulsing;
- colored;
- glowing;
- soft bloom;
- subtle scale breathing.

Required:

```text
ON/OFF
speed-responsive
boost-responsive
configurable color
```

The orb does not own propulsion physics.

---

# 19 · HUD

Use current **KFB Game HUD v3 rules**.

Do not design another generic race dashboard.

Keep:
- successful speedometer language;
- mini-map = actual route only;
- Almanac cards = real landscape cards, natural aspect, vertical/downward fan;
- Radio = approximately 3 large icon controls + volume;
- no tiny microtext;
- no decorative fake mini-map oval;
- no squeezed portrait cards.

Minimum useful race data:

```text
speed
lap / route segment
checkpoint
boost
drift
surface state
real route minimap
```

HUD inherits Option C palette but must not dominate the world.

---

# 20 · Real KFB / MED billboard art

Do not use fake card art.

Use the existing public PDF/CardBuilder pipeline.

The repo already owns:
- deck registry;
- pdf.js rendering;
- 2×2 page crop;
- canonical card aspect;
- KFB ink contour;
- real card backside.

Initial random billboard pool:

KFB:
- `forget_utopia`
- `ignore_dystopia`
- `embrace_protopia`

MED:
- `medkayfab_cardiology`
- `medkayfab_emergency_medicine`
- `medkayfab_histology`

Record real `packId + cardNumber` values in evidence.

If front rendering fails temporarily:
- use the canonical real KFB card backside;
- do not invent a replacement front.

---

# 21 · Kenney Racing Kit

Use the public registry donor.

Proof assets include:

- `billboard.glb`
- `billboardDouble_exclusive.glb`
- `camera_exclusive.glb`
- `flagCheckers.glb`
- `ramp.glb`
- `roadRamp.glb`
- `roadStart.glb`

For every integrated prop:
1. show/inspect source object alone;
2. fix orientation/support;
3. apply compatible material treatment;
4. place only for a clear gameplay/visual reason.

No random grandstand/tree/barrier scatter.

---

# 22 · Billboards

Pass 1:
- minimum one Kenney billboard;
- map real KFB/MED card texture to its display surface;
- exact physical fit may be approximate;
- correct orientation/readability is mandatory.

Later:
- random deck pool;
- scoreboard use;
- card/quest advertising;
- Fractal Almanac callbacks.

---

# 23 · CCTV / Race cameras

Use `camera_exclusive.glb` for 2–3 hero-camera placements.

Positions derive from Track geometry:

- Dom reveal;
- sweeper apex;
- tunnel exit;
- ramp / landing;
- Rhine reveal;
- finish.

Store metadata:

```text
cameraId
routeS
position
lookAt
FOV
shotType
triggerRadius
heroPriority
```

Player may be “flashed” when crossing the trigger.

For Slice C prove:
- placement;
- flash;
- shot framing;
- capture metadata.

Do not build the complete Fractal Almanac pipeline yet.

---

# 24 · Review cameras

Mandatory because TC-01 failed here.

Provide:

- Chase;
- High Oblique;
- Close Orbit;
- Track Surface inspection;
- Landmark Hero.

Close Orbit must get near enough to judge:
- shoulder;
- road/terrain seam;
- surface material;
- penetrations;
- prop support.

---

# 25 · Pass-1 required features

Nothing from the current required list is dropped.

Keep each proof bounded:

- one Dom Loop;
- cached real OSM Dom/Zentrum dataset;
- Filament-derived route grammar;
- one tunnel;
- one visible Rhine segment;
- Kölner Dom hero;
- small OSM/OMS elastic building field;
- 1–3 real vehicles;
- colored trails;
- toggleable propulsion orb;
- functional HUD v3 proof;
- one real-card billboard;
- 2–3 hero CCTV cameras;
- close-orbit review.

Not required yet:
- complete Cologne;
- all bridges;
- full HBF network;
- Autobahnkreuz;
- all vehicles;
- all transformer manoeuvres;
- full Fernsehturm;
- full Ehrenfeld Mosque;
- full Hürth corridor;
- final Almanac capture system.

---

# 26 · Color / light

Option C board is literal visual authority.

Target:
- saturated but controlled;
- warm day/sunset highlights;
- teal/cyan;
- coral/orange;
- yellow;
- magenta/pink;
- violet/blue;
- warm cream;
- deep navy only as contrast/UI support.

The road should be mid-value/colorful, not near-black.

Readability comes from:
- silhouette;
- value separation;
- shoulder contrast;
- large color fields;
- hierarchy.

Not from rigidifying the world.

---

# 27 · World motion

Desired:
- tall buildings gently bend with wind;
- towers respond more than low buildings;
- signs can spring;
- trees sway;
- billboard supports flex;
- water moves;
- landmark pieces have low-amplitude life.

Amplitude hierarchy is mandatory.

The world is alive, not melted.

---

# 28 · WorldSurface future compatibility

Do not build a mega-engine now.

Avoid decisions that prevent later:

- spherical Travel worlds;
- flat worlds with drivable edges;
- hollow / inner-sphere worlds;
- tunnels;
- underwater routes;
- free-space / space routes;
- card-delivery missions.

Conceptual future contract:

```text
RouteGraph
+ WorldSurface
+ TrackPatch / Structure
+ EnvironmentStyle
+ MovementMode
```

First useful hosts remain Sphere + Plane.

---

# 29 · Claude handback

Claude returns a complete export, not just screenshots.

Required:

```text
KFB_COLOGNE_OPTION_C_EXPORT/
  KFB Cologne Option C.dc.html
  standalone/
  RETURN.md
  SOURCE.json
  TEST_REPORT.md
  CHANGELOG.md
  STAGE_METADATA.json
  screenshots/
  evidence/
```

`SOURCE.json` must pin every donor actually used.

`TEST_REPORT.md` must state actual:
- browser;
- viewport;
- interaction checks;
- page errors;
- failed assets;
- vehicle count;
- cameras;
- billboard/card IDs;
- OSM source status.

Work/ChatGPT performs the GitHub commit/PR/Cloudflare Stage step after handback.

---

# 30 · GitHub / Stage metadata

Prepare metadata for:

Public repo:
`georg-doc/kayfabizarro`

Intended implementation branch:
`claude/cologne-race-option-c-2026-09-20`

Intended Stage route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

Do not claim:
- pushed;
- CI pass;
- deployed;
- PUBLIC VERIFIED;
- Georg accepted;

unless Work/ChatGPT has actually completed those gates.

---

# 31 · Option A after C

Do not rebuild gameplay.

Reuse:
- route;
- geography;
- vehicles;
- controller;
- camera;
- HUD data;
- card system;
- Rhine;
- landmarks;
- hero cameras.

Swap the design language only.

Then create a matched Option A evidence set using identical camera positions where possible.

After Georg reviews both, prepare a component-by-component **BEST-OF** for the MVP/Astra slice.

Do not choose a global winner automatically.

Evaluate separately:
- Track geometry;
- Track material;
- buildings;
- landmarks;
- color/light;
- HUD;
- vehicle VFX;
- water;
- billboards;
- camera/cutscene language;
- OSM translation.

---

# 32 · No-go list

Do not:
- copy SP13KTRA code/data/assets;
- invent OSM;
- depend on private Race GitHub access;
- create a second controller;
- recreate TC-01 black ribbon;
- allow terrain to poke through;
- use dense micro-stripes;
- use face-by-face color noise;
- randomly scatter props;
- apply one deformer blindly to all object families;
- make all buildings wobble the same way;
- invent cards;
- replace Dom with a generic cathedral;
- show fake minimap geometry;
- squeeze cards into portrait ratios;
- fill HUD with tiny text;
- claim public/live before Cloudflare proof.

---

# 33 · Start sequence

1. Load both visual authority boards.
2. Read `SOURCE_PINS.json`.
3. Isolate/inspect Filament reference source; derive grammar only.
4. Load the cached `dom-zentrum-v0/CLAUDE_CONTEXT.json`; use full `normalized.json` only where needed.
5. Isolate Dom donor.
6. Isolate one KayKit vehicle + current deformer.
7. Isolate billboard + CCTV camera + real card pipeline.
8. Block out independent Dom Loop using real geography + derived Filament rhythm.
9. Prove clean Track/world surface and Close Orbit before adding decoration.
10. Add Option C buildings / Dom / Rhine.
11. Add vehicle VFX / HUD.
12. Add billboard / hero cameras.
13. Run browser evidence.
14. Return complete export.
15. Stop for Georg Option C gate.
