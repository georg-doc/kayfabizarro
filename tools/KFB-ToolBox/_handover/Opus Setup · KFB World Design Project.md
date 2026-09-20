# KFB World · Travel / TinySkies / Start Zone
## OPUS SETUP PASS

You are preparing a new Claude Design project for KFB World / Environment / Start Zone work.

This pass is SETUP and CONSOLIDATION first, not final visual execution.

### Governing ownership

Implementation SSOT:
`georg-doc/KFB-Travel-Globe`

The new Design project is a design/authoring layer over that implementation.

It may:
- study;
- consolidate;
- propose;
- visually explore;
- optimise composition;
- prepare Fable work;
- maintain a living design/masterplan.

It may NOT silently replace Travel's existing ownership of:
- terrain;
- surface height;
- coast/water logic;
- sky;
- day/night;
- lighting;
- atmosphere;
- movement;
- camera/runtime integration;
- audio.

GitHub implementation state overrides chat recollection.

Always distinguish:

`DECISION`
`IMPLEMENTATION`
`TESTED RESULT`
`REFERENCE`
`PROPOSAL`
`REJECTED / ARCHIVED HISTORY`

---

## 1. WORLD FOUNDATION

Read current KFB Travel Globe first.

Priority source areas include:

- `travel/CONTRACT.md`
- terrain/surface implementation
- coast/water/ocean implementation
- sky presets
- day/night
- atmosphere
- lighting / light budget
- world moods
- lighthouse integration
- current Travel masterplan and backlog

Pinned upstream world donor:

`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

Relevant TinySkies concepts include:

- one terrain/surface truth;
- actual land/water topology;
- coast-aware world placement;
- shallow/deep ocean and foam;
- sky/environment presets;
- coherent multi-light world rig;
- atmosphere/fog;
- animated lighthouse + beam;
- environmental animation.

Do not turn TinySkies into a second runtime owner.

KFB Travel's current implementation is the integration surface.

---

## 2. CURRENT VISUAL / COMPOSITION INPUT

Primary Birthday reference folder:

`georg-doc/kayfabizarro/tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/`

Use its material with explicit roles.

Georg-authored mockup:
PRIMARY EVENT-STAGING / COMPOSITION INPUT.

Generated mockups:
SECONDARY interpretation/look references only.

Color sheet:
COLOR / MATERIAL / MOOD reference only.
It may not overwrite the Travel world-light contract.

Screenshots:
Treat them as deliberate World / TinySkies / KayKit / composition references, not decorative attachments.

Curtain reference:
`CURATIN-THREE-js - old-stage-red-curtains-wooden-architecture-dilapidated-velvet-set-aged-ornate-stone-architectural-frame-387640660.webp`

This establishes the visual direction for a reusable 3D KFB Theatre Curtain / Proscenium core asset:
- aged dark-red velvet;
- worn / damaged material;
- visible folds and weight;
- old theatrical architecture;
- physical 3D presence.

---

## 3. THREE.JS TECHNICAL DONORS

Cloud donor:

`mrdoob/three.js`
`examples/webgl_volume_cloud.html`

Use as technical inspiration for spatial animated cloud volumes.

KFB direction:
- clouds live in world space;
- slow drift / evolving form;
- readable cartoon/clay silhouettes;
- no flat UI clouds;
- no generic fog substitute;
- restrained enough for idle/screensaver use.

Curtain cloth donor:

`mrdoob/three.js`
`examples/webgpu_compute_cloth.html`

Relevant mechanisms:
- Verlet/spring cloth;
- fixed attachment points;
- wind;
- impact/collision;
- dynamic deformation.

Do not blindly transplant the example.

The current example is WebGPU-first, so any reusable KFB Curtain module must have a practical fallback path rather than making WebGPU support a hard dependency.

Desired reusable Curtain states:

`closed-rest`
`closed-wind`
`impact`
`opening`
`open-rest`
`closing`
`reset`

Reserve an extensibility seam for later projection / texture content such as KFB cards or rendered document pages, but DO NOT build a PDF viewer in the Birthday slice.

---

## 4. KFB WORLD LANGUAGE

Preserve and develop:

- natural rolling Travel terrain;
- actual coast / water intersection;
- beach / coastal transition where compositionally useful;
- foreground / midground / background depth;
- lighthouse integrated into the terrain;
- lighthouse beam as real world light/VFX;
- spatial rainbow;
- animated 3D cartoon clouds;
- paths / approaches / navigable negative space;
- authored prop clusters;
- KFB asymmetry;
- selective cartoon deformation;
- cozy / claymation substrate;
- readable materials and real grounding;
- atmospheric depth;
- coherent world lighting before grading.

Avoid:
- generic flat game floor;
- decorative blue water plane unrelated to terrain;
- lighthouse pasted into a convenient corner;
- generic sunset lighting replacing Travel's environment system;
- dashboard/menu staging detached from the world;
- sterile symmetry;
- random deformation everywhere.

---

## 5. CURRENT VERTICAL SLICE · ELISA BIRTHDAY

The Birthday experience is an event layer inside the Start Zone world.

Spatially reserve and compose:

- Theatre Curtain / threshold;
- Birthday/event clearing;
- Uncle FrizzleBob;
- GothGirl / Elisa actor position;
- Hihi position;
- D6 / Birthday Radio;
- three asymmetrical disco balls;
- speaker/performance props;
- physical coloured 3D-letter installation reading exactly:

`Happy Eighteenth Birthday Elisa!`

- Newton/cradle-like physical letter behaviour later;
- lighthouse;
- rainbow;
- animated clouds;
- bounded fireworks area;
- camera reveal / hero-shot path.

Final actor rigging must not block the world design.

Current GothGirl state:

`ACTOR INPUT UPDATE PENDING · FrankenStein Studio v18`

Do not treat any older/raw GothGirl presentation as final.

A later Georg/Design v18 report will replace this placeholder.

---

## 6. CREATIVE FREEDOM

This project must not turn source discipline into timid design.

Fable is expected to improve the composition, not trace a mockup.

Within the governing owner and identity contracts it MAY freely explore and optimise:

- terrain silhouette;
- coastline shape;
- local elevation;
- clearing form;
- camera position / focal length / angle;
- foreground framing;
- path curvature;
- lighthouse prominence;
- rainbow placement;
- cloud groupings;
- prop clustering;
- relative scale;
- asymmetry;
- selective deformation;
- material wear;
- local colour accents;
- staging rhythm;
- reveal timing;
- atmospheric depth;
- visual hierarchy.

When deviating from a reference, prefer a clearly better integrated world over literal copying.

The hard constraints protect identity, interoperability and ownership.
They do not prescribe pixel-perfect composition.

---

## 7. BIGGER PICTURE

Maintain an additive Living World Masterplan.

Include at minimum:

### Immediate
Elisa Birthday Start Zone visual direction.

### Near term
Reusable KFB Start Zone / Town world.

### World variants
- Neutral / Authoring
- Birthday Sunset
- Night / Disco
- later weather / mood states

### Reusable modules
- Theatre Curtain / Proscenium
- animated Clouds
- Lighthouse
- Rainbow
- physical KFB typography
- world-as-toy props
- world/event lighting
- scene variants

### Future authoring
KFB Stage / World Editor remains a later ToolBox authoring consumer.
Do not build it during this setup pass.

### Future Curtain uses
Potential later consumers may include:
- KFB cards;
- card reveals;
- Almanac objects;
- rendered PDF/document pages;
- narrative scenes;
- stage performances.

These are backlog/future consumers, not Birthday implementation scope.

### Narrative Scene Layer donor
Record `dannylimanseta/narrative-scene-layer` as a separate future architecture/presentation donor.

High-interest concepts:
- Scene = what happens;
- Presentation = how it plays;
- Theme = what it looks like;
- persistent poses as stances;
- explicit entrances;
- presentation variants.

Do not mix its 2D theatrical renderer into the current Travel-world implementation.

---

## 8. DELIVERABLES FROM THIS OPUS SETUP PASS

Produce:

1. `SOURCE_MAP`
   - source
   - role
   - status
   - owner
   - what it may constrain
   - what it may NOT override

2. `LIVING_WORLD_MASTERPLAN`
   - additive;
   - immediate Birthday slice;
   - Start Zone;
   - Town / Travel bigger picture;
   - reusable modules;
   - future backlog.

3. `OPEN_DECISIONS`
   Only decisions that genuinely remain unresolved.
   Do not reopen already decided owner/contracts.

4. `FABLE_G0_LAUNCH_BRIEF`
   Compact and executable.
   It should let Fable begin visual exploration without rereading the whole history.

5. `HANDOFF_SLOTS`
   Explicit placeholders for later inputs, especially:
   - GothGirl FrankenStein Studio v18 report/export;
   - later ToolBox;
   - later accepted Fable visual direction.

Do not start Astra implementation during this setup pass.

Stop when the Design project is ready for Fable.