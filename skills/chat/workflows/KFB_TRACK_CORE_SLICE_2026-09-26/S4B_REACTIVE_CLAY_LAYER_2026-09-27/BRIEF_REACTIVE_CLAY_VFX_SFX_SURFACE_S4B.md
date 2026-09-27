# S4B · Reactive Clay Layer · track/biome VFX + SFX + temporary deformation · 2026-09-27

**Status:** PREPARED PHASE 2 · START ONLY AFTER S4 STATIC LOOK DIRECTION IS SELECTED  
**Visual authoring:** Claude Design, using the existing KFB clay/look donors  
**Runtime receiving owners:** existing Race / World / OSM / Audio owners  
**Geometry owner:** existing KFB Blender-MCP Racer / Track Core only  
**Audio owner:** existing KFB Audio/Soundscape + consumer audio runtime; this brief does not create a second audio engine  
**Purpose:** make every track/biome feel like reactive clay through surface-specific particles, sound, temporary tyre marks and dents

## 0 · Dependency on S4

S4 defines the stable visible surface/edge/biome grammar first:
- Track Core profile + sockets;
- skin/material roles;
- patch-scatter biome transitions;
- width handling;
- edge/runoff state;
- static clay look.

S4B consumes those states. It does not reopen their geometry.

Required S4 output for S4B:
- stable surface/biome ids;
- active visible clay colour/material family per surface;
- edge/runoff state;
- route-space frame and width;
- source-pinned Cosmic state when available.

Do not begin S4B by inventing new track geometry or a new biome system.

---

# 1 · Product goal

The world should behave like a **soft, animated clay set** rather than a rigid mesh with generic particles.

At driving speed the player should read, without looking at UI:

- what surface the tyres are touching;
- whether the vehicle is gripping, braking or drifting;
- whether a jump landed softly or hard;
- whether an impact hit road, barrier, prop or building;
- that the material was briefly displaced and then relaxes back into shape.

The same interaction must produce **different visual and sonic material responses** on asphalt, dirt, gravel, sand, snow, water/wet ground and later Cosmic surfaces.

---

# 2 · Hard owner boundaries

## Track / physics

Race / Track Core remains authoritative for:
- centre-line / frames;
- sockets;
- road/contact surface;
- collision;
- vehicle state;
- drift / braking / airborne / landing / impact telemetry;
- recovery and gameplay consequences.

S4B may **read** these signals. It may not alter them.

## World / OSM

WorldBuilder / OSM remain authoritative for:
- geography;
- terrain;
- OSM building identity and placement;
- world objects and persistence;
- accepted building/prop clay adapters.

S4B may temporarily deform **presentation** of eligible surfaces/objects. It must not move OSM footprints or rewrite source assets.

## Audio

Use the current KFB Audio & Soundscape baseline and the consumer's existing AudioContext/buses.

S4B provides:
- semantic surface/event mapping;
- source-bank requirements;
- mix/readability targets.

It does **not** create another global AudioContext, music engine, telemetry owner or universal replacement audio runtime.

---

# 3 · Existing donors to reuse before building

## VFX timing / pooling donors

Already present in KFB:

- `travel/KFB Travel Globe v13-1/globe-v13/drift-smoke.js`
- `travel/KFB Travel Globe v13-1/globe-v13/impact-dust.js`
- `travel/KFB Travel Globe v13-1/globe-v13/carpet-wake.js`
- `travel/KFB Travel Globe v13-1/globe-v13/contrails.js`
- `travel/travel-v16/terrain-v16/speed-lines.js`

Use them for proven ideas such as:
- emission driven by real motion state;
- particles per second, not per frame;
- pooling / lifetime;
- attachment to measured wheel/contact positions;
- visibility and cleanup.

Do not assume their old visual style is final.

## Existing FX source bank

`media/3D_Assets/FX_Visual/` includes:
- `kenney_smoke-particles/PNG/*` single-frame smoke/puff/explosion images;
- additional FX packs recorded in the vehicle VFX plan.

These are source/technical candidates. For S4B, the visible target is **clay particulate / clay puffs**, not generic photographic or game-smoke sprites.

## Clay material donors

Reuse the H0/Knetwelt stack:
- `lab-clay/clay-soften.v1.js`
- `lab-clay/clay-material.v4.js`
- `lab-clay/clay-relief.v2.js`

The same material language should be visible in particles, dents and reactive marks.

## Audio donor

Read:
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`
- Race's current telemetry/audio adapter and current consumer audio source.

Important retained finding:
- dedicated sustained tyre/skid/friction sample coverage is still incomplete;
- the rejected A2 sustained oscillator friction voices must **not** be resurrected as a shortcut.

If a sound family lacks a verified source, mark `SOURCE_REQUIRED`.

---

# 4 · One shared response contract, not separate effect hacks

Design a small presentation contract such as:

```text
ReactiveClayEvent
  eventId
  targetId
  targetClass
  surfaceId
  biomeId
  eventType
  worldPosition
  localPosition / route s,u
  contactNormal
  travelTangent
  velocity
  slip
  impulse
  radius
  intensity
  seed
  timestamp
```

Suggested `eventType` vocabulary:

```text
ROLL
TURN_LOAD
BRAKE
DRIFT
REGRIP
TAKEOFF
LAND
BOUNCE
SCRAPE
BARRIER_HIT
PROP_HIT
BUILDING_HIT
WATER_CONTACT
```

The exact runtime schema belongs to the receiving owner. Claude Design returns the minimum fields it actually needs; do not create a parallel physics API.

---

# 5 · Surface Response Profiles

Each surface/biome gets one **response profile** that links visual material and audio behaviour.

Required first profiles:

```text
ASPHALT_CLAY
DIRT_CLAY
GRAVEL_CLAY
SAND_CLAY
SNOW_CLAY
WET_WATER
COSMIC_CLAY   // SOURCE_REQUIRED until its exact donor is pinned
```

A response profile may describe:

- base clay colour sampled from the active S4 surface/skin;
- 2–4 nearby colour/value variants for debris;
- particle form family;
- particle mass/size range;
- dust/puff amount;
- tyre-mark form;
- dent/rut depth presentation;
- relaxation speed class;
- SFX role ids;
- optional wetness / splash / sparkle / special accent;
- edge-specific reaction where relevant.

**Do not hardcode one colour per biome in the VFX module.** Read the actual active S4 surface/material palette.

---

# 6 · Clay VFX grammar

## 6.1 · Particles follow the material

Small particles should look like bits of the surface that were displaced.

Examples:

### Asphalt
- small dark clay chips / crumbs;
- short low puffs during braking/drift;
- darker compressed smear at the tyre;
- optional tiny lighter edge flecks.

### Dirt / mud
- warm earth-coloured clay clumps;
- larger soft chunks;
- low lateral spray in a drift;
- visible displaced rut lip.

### Gravel
- many small firm clay pebbles;
- sharper lateral scatter;
- brief bouncing pieces;
- sparse dust/clay puff.

### Sand / desert
- pale soft pellets / pads / crumbs;
- flatter wider spray;
- softer landing puff;
- less hard clicking visual behaviour than gravel.

### Snow
- white/off-white compressed flakes and clumps;
- soft powder-like clay puffs;
- packed tyre groove with raised edges.

### Wet / water
- clay-styled droplets / splashes;
- surface-colour plus wet highlight;
- no generic blue particle if the actual water palette differs.

### Cosmic
- only after the S4 Cosmic donor is pinned;
- particles inherit that source family;
- no generic cyan/magenta neon.

## 6.2 · Required trigger states

VFX must respond to:
- hard corner load;
- braking;
- drift/slide;
- re-grip;
- jump takeoff;
- landing;
- secondary bounce impact;
- barrier scrape/hit;
- eligible prop/building impact.

The effect intensity comes from the receiving owner's telemetry, not from guessed animation timers.

## 6.3 · Smoke becomes clay

Conventional smoke may be used as a **motion/pooling donor**, but the final visible effect should read as:
- soft clay puffs;
- clustered small blobs;
- flattened squeezed forms;
- or stylised clay-billboard puffs that match the active surface palette.

For tyre smoke, allow a neutral grey/cream component only when it remains visibly tied to the surface response. Dirt, sand, snow and gravel must not all emit the same white smoke.

---

# 7 · Temporary tyre marks, dents and ruts

## 7.1 · Core rule

Reactive deformation is **presentation-only unless a receiving owner explicitly promotes a gameplay deformation**.

The authoritative collision/contact mesh remains unchanged.

A visual dent must never cause:
- a new collision lip;
- altered wheel height;
- changed track socket;
- broken OSM footprint;
- persistent source-asset mutation.

## 7.2 · Track / ground reaction

Eligible track and world surfaces can show:

- compressed tyre tracks;
- drift smears;
- braking streaks;
- dirt/sand/snow ruts;
- small landing dents;
- lateral ridges from displaced clay;
- short scrape grooves.

Preferred semantic storage is route/world local, e.g.:
- Track: `s,u` + radius/depth/age;
- terrain: local world patch coordinates;
- not permanent edits to the source mesh.

The renderer may choose a reaction texture/field, projected local patch, vertex-shader displacement or another bounded method. The brief does not force one implementation.

## 7.3 · Buildings / props

Eligible OSM and asset buildings/props may react to contact with:
- a local squash/dent;
- a shallow scrape;
- a brief compressed area;
- a soft rebound / overshoot.

Wheel tracks belong only where wheels physically contact a traversable surface. A wall/building receives a dent/scrape, not a fake horizontal tyre road mark unless the collision actually produces one.

Landmarks or protected rigid details may opt out.

## 7.4 · Relaxation animation

Reactive clay should heal smoothly.

Use a shared visual phase model:

```text
IMPULSE
→ COMPRESS / SMEAR
→ SHORT HOLD
→ RELAX
→ CLEAN / FAINT RESIDUAL
```

Different materials may relax differently:
- asphalt clay: relatively quick smoothing, faint smear may linger;
- dirt/gravel: ruts last longer;
- sand/snow: obvious track persists, then softens;
- building/prop: dent springs back with restrained overshoot;
- Cosmic: source-defined.

No permanent accumulation in the first POC.

---

# 8 · SFX grammar coupled to the same surface profile

SFX must be driven by the same `surfaceId + eventType` contract as VFX.

Required semantic families:

| Surface | Roll / grip | Brake / drift | Scatter / accent | Impact |
|---|---|---|---|---|
| Asphalt | dry rubber/clay contact | scrub / skid | sparse chips | firm clay thump |
| Dirt | soft granular roll | earthy scrape | clump spray | dull thud |
| Gravel | granular rattle | rough scrape | pebble scatter | harder granular hit |
| Sand | muted drag | soft hiss/scrape | broad fine scatter | padded thump |
| Snow | compressed crunch | sliding crunch | soft clump scatter | muffled impact |
| Water/wet | wet roll/swish | spray/scrub | splash | slap/splash |
| Cosmic | SOURCE_REQUIRED | SOURCE_REQUIRED | SOURCE_REQUIRED | SOURCE_REQUIRED |

Rules:
- sample-first where verified sources exist;
- do not resurrect the rejected sustained synthetic friction voice;
- no single universal skid sample for every surface;
- gameplay-critical landing/impact remains readable above music/ambience;
- SFX may layer one common vehicle/contact transient with one material-specific layer;
- audio reads telemetry, never writes gameplay state.

---

# 9 · Mandatory first POCs

Use one existing KFB vehicle/contact receiver and one current Track Core route. Do not build a new driving host.

## P1 · Asphalt drift + brake
Show/hear:
- track-colour clay crumbs/puffs;
- compressed skid/smear;
- brake-to-drift intensity change;
- smooth mark relaxation;
- asphalt-specific friction SFX.

## P2 · Dirt corner
Show/hear:
- larger earth clumps;
- lateral spray;
- visible rut + small displaced ridge;
- dirt-specific roll/drift layer;
- relaxation slower than asphalt.

## P3 · Gravel hard brake
Show/hear:
- small pebble scatter with bounce;
- rough short tyre trace;
- gravel scatter SFX;
- no generic smoke cloud hiding the contact.

## P4 · Sand or snow
Show/hear a clearly softer response:
- deeper visual track;
- material-coloured puffs/clumps;
- muffled/compressed SFX;
- slow smoothing.

## P5 · Jump landing + bounce
Show/hear:
- first landing dent + particle puff;
- second smaller bounce response if telemetry reports it;
- short readable impact cue;
- dent recovers without moving the real road surface.

## P6 · Barrier / building / prop impact
Show/hear:
- local clay dent/scrape on one eligible object;
- matching small surface-colour debris;
- controlled rebound/relaxation;
- object's source transform, OSM identity and collision stay unchanged.

---

# 10 · Transition-zone behaviour

Reactive effects must work *inside* S4 patch-scatter biome transitions.

If one wheel is still on asphalt and another reaches dirt:
- each contact may emit the correct local material response;
- particles use the local material state, not only a global biome label;
- tyre marks may cross the mixed zone without snapping colour/style at one metre.

At road-width transitions, use normalized lateral coordinates and real contact locations. No fixed-width VFX strip.

---

# 11 · Performance / lifetime rules

The first implementation must be bounded.

Return explicit caps for:
- active particles;
- active reaction marks/dents;
- per-object dent fields;
- max visible distance / camera relevance;
- oldest-event eviction;
- cleanup on reset/reload.

Prefer pooled/instanced transient objects and compact reaction fields.

Do not permanently subdivide every OSM building or every kilometre of track merely to support a possible future impact.

For building deformation, reuse prebaked/softened clay geometry where the S5 adapter already provides it; only the local temporary reaction is dynamic.

---

# 12 · Evidence required

For every implemented POC provide:
- source object / route / surface profile;
- event signal used;
- still before contact;
- peak reaction;
- mid-relaxation;
- settled state;
- short video/GIF only if it materially proves the animation;
- SFX source/provenance or `SOURCE_REQUIRED`;
- actual particle/mark/dent counts;
- confirmation that collision/contact geometry remained unchanged.

Also provide one comparison grid:
`same manoeuvre × asphalt / dirt / gravel / soft surface`.

---

# 13 · Deliverables

Suggested output:

```text
S4B_REACTIVE_CLAY/
  START_HERE.md
  SURFACE_RESPONSE_PROFILES.json
  REACTIVE_CLAY_EVENT_CONTRACT.md
  VFX_RESPONSE_MATRIX.md
  SFX_RESPONSE_MATRIX.md
  REACTIVE_SURFACE_POC.md
  SOURCE.json
  TEST_REPORT.md
  RETURN.md
```

Names may differ; responsibilities may not.

The response-profile data must be consumable without importing a second Track, World or Audio owner.

---

# 14 · Acceptance

S4B is useful when:

- the same manoeuvre visibly and audibly reads as different materials;
- particle colour/form follows the actual local S4 surface;
- asphalt/dirt/gravel/soft-ground reactions are unmistakably different;
- drift/brake/jump/landing/bounce are driven by real telemetry;
- tyre marks and dents visibly deform the clay presentation and then smooth back;
- an eligible building/prop can dent and recover without moving its authoritative transform/collision;
- mixed biome transition zones respond per local contact;
- Track Core/socket/contact geometry is unchanged;
- reset cleans all temporary state;
- SFX remain inside the current audio owner and do not mask gameplay cues.

## Exactly one next gate when S4B starts

**Reactive Clay P1–P6 on the selected S4 look:** prove the six material/contact responses in one existing KFB driving receiver, with the same surface profile driving VFX colour, temporary deformation and SFX semantics. Stop before broad world rollout.
