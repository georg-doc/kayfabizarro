# KFB Production Architecture v3 · Race / World / Look / Audio decisions · 2026-09-24

Status: **CURRENT ARCHITECTURE DECISION · IMPLEMENTATION NOT STARTED**
Owner: KFB Web Architecture lane
Parent: `START_HERE.md`

This note answers RKIT-02 D1–D5 and records Georg's latest product direction:
**prefer the shortest path to a playable authored result over a general track editor.**

---

# 1 · Racer decision for Blender MCP

## D1 · Physics basis = RAPIER for stunt dimensions

Decision:
**Use the existing real Rapier race physics as the canonical stunt-dimensioning basis.**

Measured RKIT source facts:
- Rapier `race/`: gravity magnitude 15 m/s² downward;
- max speed basis: 27 m/s;
- proven ramp: about 16°;
- actual ramp flight exists.
- C-3: 41 / 48.5 m/s, jump gravity 19, but a physical ramp **does not launch the vehicle**; only the Space jump path creates air time.

Why:
- Blender geometry must be dimensioned against a physics model that already produces real airborne motion.
- Choosing C-3 would force Race to invent the launch/contact seam before the geometry can be trusted.
- Georg explicitly allows the Cologne Race track to be rebuilt properly rather than preserving the current C-3 movement/contact implementation.

Important split:
- **Rapier owns production flight/contact physics.**
- The human-positive v0.8 Track-Lab steering/drift/grip feel remains a **handling target/donor**.
- Do not preserve C-3 route-relative fake-ground flight merely because its speed numbers are larger.

Practical target:
use a thin Race test host where existing v0.8-style input/steering feel is mapped onto the Rapier movement/contact owner rather than running two physics truths.

### Ballistic design aid

At:
- v = 27 m/s
- g = 15 m/s²
- ramp angle = 16.3°

same-height ideal range is about **26.2 m**.

For a horizontal 30 m gap, ideal flight reaches that x after about 1.16 s and is about **1.28 m below the lip height**.

Therefore a **30 m step-down gap is a reasonable RKIT target** with a landing about 1.5–3 m lower, depending on the final contact/assist envelope.

This calculation is a geometry design aid, not a substitute for Race runtime tests.

---

## D2 · Width ladder = accepted grammar

Canonical ladder:

- `NARROW = 10.8 m`
- `STANDARD = 14.4 m`
- `WIDE = 18.0 m`
- `HERO = 21.6 m`

This is the already accepted product grammar from Race PR #13.

C-3's 28.8 m is **not** promoted into the core ladder.

If 28.8 m remains useful, expose it only as an explicit special module/profile such as:
- `HERO_XL`
- `STUNT_BOWL`
- `LANDING_FAN_XL`

It must not silently redefine `HERO`.

Current 18 m route classification remains:
**WIDE**.

---

## D3 · Jump family = keep 12 m learner + add 30 m headline step-down

Do not choose one and discard the other.

Use two authored modules:

### JUMP_BASE
- existing ~12 m class;
- forgiving;
- used for normal ramp learning / route punctuation;
- does not need to read as the main spectacle.

### JUMP_HERO_30
- target horizontal gap: ~30 m;
- step-down;
- Rapier-dimensioned;
- landing lower than lip;
- designed for high/full speed;
- later Guided Driving may add `capture → commit → release → recover` assistance without invisible air rails.

Do not build a large catalogue before these two work.

---

## D4 · Launch owner = Race / Rapier

Blender/RKIT supplies:
- geometry;
- lip position/frame;
- landing frame;
- recommended speed envelope;
- stunt-zone metadata;
- optional assist-zone metadata.

Race supplies:
- wheel/contact;
- physical takeoff;
- airborne state;
- landing;
- recovery;
- reward/progress.

No geometry script teleports the vehicle or owns velocity.

---

## D5 · Flap contact = Race-owned moving-support adapter

RKIT may continue the thin-deck `flap-down v2` design and export:
- hinge origin;
- hinge axis;
- angle limits;
- deck collision mesh;
- extras/semantic id.

But:
- trigger/timing is host data;
- the physics collider/support frame must follow the same hinge transform;
- animated visual mesh without matching contact is not an accepted flap.

The flap-down remains wanted. It is not blocked as a visual module, but its final playable acceptance waits for the moving-support adapter.

---

# 2 · Track product strategy = authored recipes, not a full editor

Georg does **not** need a general spline/track editor for the first playable world.

Preferred architecture:

```
small authored Route Recipe
→ Route Compiler
→ RKIT profile sweep + authored stunt modules
→ baked visual track package
→ Race contact/route metadata
→ place as WorldBuilder module
```

Initial route recipes should be deliberately few and recognizable.

Recommended first three:

1. **TRACK_A_STUNT_8**
   - figure-eight / over-under;
   - one 12 m base jump;
   - one 30 m Hero step-down;
   - one tunnel/flap or bridge feature;
   - easy to read in overview.

2. **TRACK_B_OVAL_EXIT**
   - broad oval/zero-like loop;
   - one branch/exit;
   - useful as an OSM/world-embedded race course.

3. **TRACK_C_FLOW_LOOP**
   - preserves the human-positive v0.8 Flow-Loop mental model;
   - fewer stunts;
   - handling/freeplay test course.

No UI spline editor is required to ship these.

A later authoring UI may manipulate route recipes if it becomes genuinely useful.

---

# 2A · RKIT-08/09 stunt gate update · 2026-09-25

Georg lifted the stunt HOLD from masterplan #201 and accepted the RKIT-08/09 visual direction.

Current delivered geometry/metadata:
- RKIT-08 LOOP_REAL;
- LOOP_SLIM;
- LOOP_MAG_HERO;
- LOOP_MAG_CASCADE;
- RKIT-09 SKYRAMP-01.

All are registered **by reference only** against the existing WorldBuilder track socket. None has been driven.

Binding order:
1. Race drives LOOP_REAL first under Rapier.
2. Race owns capture/commit/release/recover and reports actual entry speed / minimum load.
3. MAG adhesion/boost, cloud pads, flight/air-control and landing remain Race decisions after that gate.
4. WorldBuilder must not place RKIT-08/09 before LOOP_REAL passes its Race gate.

Every module keeps a safe ground-level bypass. Repository GLBs are Draco-compressed. Guide splines are metadata, never colliders or rails.

Architecture registry:
`TRACK_SOCKET_STUNT_REGISTRY_2026-09-25.json`.

Race source:
PR #41 · `chat/rkit-08-09-stunts-2026-09-25` · `0bbdc539c0d26c8d1feb40a7eda53162a66e7070`.

---

# 3 · Race Track Bake

Do not regenerate expensive visual geometry every world load.

Define a compiled Track Module package.

Suggested package:

```
track-module/
  recipe.json
  route.json
  stunt-zones.json
  visual.glb
  collision-or-contact.json
  anchors.json
  materials.json
  SOURCE.json
```

Rules:
- `recipe.json` is compact authored truth.
- `route.json` is deterministic compiler output.
- `visual.glb` is a cached/baked visual mesh from RKIT grammar.
- Race may derive or consume contact data from the route owner; Blender does not become physics truth.
- Runtime recolouring may use role-named materials and existing palette owner.
- rebake only when recipe/profile/module source changes.

WorldBuilder stores:
- Track Module ref;
- world transform / surface placement;
- dressing/landmark relationships.

It does not store thousands of generated vertices in the World Recipe.

---

# 4 · OSM = fetch once, normalize once, bake reusable World Zone

This already has a concrete donor:
`tools/osm-city-lab/data/dom-zentrum-v0/`.

The Cologne Option C work already proved a normalized OSM dataset and used hundreds of real building footprints.

Formalize the same idea:

```
Overpass / source extract
→ normalized metre-frame semantic data
→ deterministic City/World compiler
→ baked Zone package
→ runtime placement
```

Suggested World Zone package:

```
world-zone/
  source-spec.json
  normalized.json
  roads.json
  building-semantics.json
  anchors.json
  visual.glb
  collision/support.json
  provenance.json
  SOURCE.json
```

No live Overpass call during gameplay/editor use.

A zone is versioned by:
- source query;
- source timestamp/hash;
- compiler version;
- look/deformer profile.

This makes Barcelona, Cologne, Hürth etc. reusable cached modules.

---

# 5 · Geographic truth vs WorldBuilder composition

OSM is geographic truth **inside the source zone**.

WorldBuilder is allowed to create fictional composition.

Example:

```
Barcelona World Zone
+ TRACK_A_STUNT_8
+ Cologne Cathedral Landmark
+ Orc Warband Resident Scene
+ billboard
```

is valid.

The Cathedral instance is then:
**AUTHORED LANDMARK PLACEMENT**, not “Barcelona OSM truth”.

This distinction lets Georg freely remix real-world modules without corrupting provenance.

Landmarks therefore remain separate searchable modules with:
- source asset;
- source geography/reference;
- local authored transform;
- deformation/look profile;
- optional interaction/scene hooks.

---

# 6 · Elastic Look: restore height-dependent torsion without reviving failed Hürth R2

Current Hürth R2 is frozen after two failed repair passes.
Do **not** patch that city block again.

However, the desired deformation itself already has good donors.

Existing current City GROTESQUE research uses approximately:
- bend .105;
- lean .09;
- taper .22;
- twist 11°;
- eight vertical steps;
plus a separate wide/skewed camera treatment.

Existing Cologne Option C `BuildingElastic` / `LandmarkElastic` also already includes lean/bend/taper/twist concepts.

Decision for the **next isolated architecture proof**:

Add an explicit **TORSION / TWIST channel** to the future Elastic grammar:
- cumulative around vertical height;
- coherent with bend/lean;
- source footprint/base remains anchored;
- stronger on tall buildings / hero landmarks;
- lower on ordinary houses;
- same deformation field can drive roof/base boundary after the roof/body-union proof.

The 11° GROTESQUE twist is a **donor/reference upper range**, not a new global constant.

Recommended first authoring ranges for the isolated proof:
- normal buildings: roughly 0–5° total height twist;
- tall/hero landmarks: roughly 5–12°;
- signed/directional and deterministic per block/landmark;
- an authoring override may exaggerate selected landmarks.

This is deliberately closer to the “wonky bent” 90s-cartoon read than the current smoother Elastic result.

Camera perspective may amplify the look, but **camera skew must not be the only source of deformation**.

The next Hürth/form-language proof still obeys its recovery:
1. single-topology road junction;
2. welded/shared roof-body boundary;
3. deterministic facade rhythm;
4. now additionally one isolated tall TORSION landmark/building.

---

# 7 · Audio production architecture

Georg should never have to choose “OGG file 8 or 9”.

Create a human-facing **Sound Library / Audition surface** over existing sources.

Existing donors already support this direction:
- Pinball audio manifest with semantic event ids;
- Race telemetry SFX POC for Boost / Jump / Land / Drift / Rail;
- Combat semantic SFX/VFX modules;
- RoadTrip/Jukebox music;
- existing KFB audio assets.

The library presents human concepts:

```
Vehicle
  engine idle
  throttle
  drift
  rail hit
  jump
  landing
Combat
  swing
  hit
  block
  ranged shot
  defeat
UI
  select
  card reveal
World
  wind
  water
  portal
  crowd
Performance
  song
  applause
```

Each candidate card:
- Play;
- A/B;
- source pack;
- one-shot / loop;
- duration;
- intensity;
- semantic tags;
- license/provenance;
- current consumers;
- ACCEPT / HOLD / REJECT.

Runtime emits semantic events such as:
`vehicle.jump`, `vehicle.land`, `melee.hit`.
It does not know the underlying filename.

---

# 8 · Music / Resident performance

Music is related to SFX but not the same owner.

A Resident performance recipe may reference:

```
songRef
bpm
bar/grid offset
performers
per-performer action/choreography refs
camera/stage recipe
loop / start / finish markers
```

Use this for:
- Orc Warband;
- dance scenes;
- Animatronic;
- later Town gigs / Hero Shots.

Animation Studio should show a beat/bar ruler when a song is present so dance/performance clips can be aligned without baking the audio into animation files.

Songs remain reusable media assets; the Resident Scene stores refs/choreography.

---

# 9 · VFX production architecture

Same principle as Audio:
**audition proven donors first, adapt second, author new only if missing.**

Existing donor bank includes:
- KFB Combat Ink Atlas + recipes;
- KFB sprite/trail/flame modules;
- Kenney smoke particle frames;
- Brackeys VFX bundle sources already indexed in the VFX review;
- vehicle/race presentation effects.

Create a human-facing **VFX Audition Library**.

Candidate cards show the actual effect in motion, not a filename.

Classify:
- burst;
- loop;
- trail;
- impact;
- muzzle;
- smoke/fire;
- reveal;
- transition;
- environmental.

Each candidate records:
- semantic role;
- anchor;
- lifetime;
- loop/burst;
- scale/intensity;
- cleanup;
- source/license;
- accepted variants.

Example adaptation:

A donor that is continuous fire is not rebuilt from scratch.
Create a recipe:
- source donor = fire loop;
- trigger = `weapon.fire.single`;
- short emission window;
- short decay;
- cleanup at end.

Only if the donor fundamentally cannot express the event is a new effect authored.

---

# 10 · Practical no-micro-slice production loop for Audio/VFX

```
source packs/manifests
→ auto-inventory
→ human-readable audition board
→ Georg selects direction
→ small semantic recipe/adaptation batch
→ test in Review Scene
→ promote selected recipe
→ games consume semantic id
```

Do not:
- make Georg inspect filenames;
- tune one opaque effect file per planning chat;
- create a separate FX engine per game;
- render dozens of context-less measurement tables.

One Review Scene should expose multiple representative events:
vehicle + combat + landing + UI + world/transition.

---

# 11 · MCP Blender answer, concise

Send this to the RKIT Blender session:

> **D1 Physics:** use **Rapier** as the stunt-dimensioning/air-contact basis: g=15 m/s² downward, speed basis 27 m/s, proven ~16° physical ramp. C-3 is not the basis because its ramps do not physically launch the car. Preserve v0.8 handling feel as a tuning target later, not as a second physics owner.
>
> **D2 Width ladder:** canonical = **10.8 / 14.4 / 18.0 / 21.6 m** = NARROW / STANDARD / WIDE / HERO. 28.8 m may exist only as an explicit special HERO_XL / landing/bowl module, not as a core class. 18 m remains WIDE.
>
> **D3 Jump:** keep the existing ~12 m jump as the forgiving/base module, and build a **30 m Hero step-down** as the spectacle module. With Rapier 27 m/s, g=15 and ~16.3°, 30 m needs only about 1.3 m lower landing in the ideal ballistic calculation; use ~1.5–3 m step-down as the geometry study range, then verify in Race runtime.
>
> **D4 City pilot:** **Cologne first**, specifically the already normalized `dom-zentrum-v0` district/data, because the source/cache/anchors/landmarks already exist. Prove the module/bake architecture there. Barcelona becomes the second-city portability proof, not the first implementation dependency.
>
> **Track strategy:** do not build a full editor. Build a few authored route recipes — first **TRACK_A_STUNT_8** (figure-eight / over-under), then an oval-with-exit and a Flow Loop. Compile/bake each into a reusable Track Module that WorldBuilder can place.
>
> **Flap:** continue flap-down as thin-deck visual/geometry module with hinge metadata. Race owns trigger and a collider/support transform that follows the hinge; animated mesh alone is not final contact.

