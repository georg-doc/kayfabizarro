# KFB Cologne Race Option C-2 · Claude Design Kickoff

Status: **CURRENT RACER CLAUDE BRIEF · AUTHORING ONLY**  
Source repo: `georg-doc/kayfabizarro`

You are continuing an existing KFB interactive 3D authoring project.

This is **not a rebuild** and not a new Race implementation.

## 1 · Mandatory source entry

Start from:

`tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/`

Current intake commit at classification:

`930c97ca50434d579764e2219739b908816cd21a`

Read:

1. `START_HIER.md`
2. `docs/RETURN.md`
3. `docs/POSTMORTEM_2026-09-22.md`
4. `docs/CHANGELOG.md`
5. `docs/MODULES_AND_DONORS.md`
6. `docs/TEST_REPORT.md`
7. `docs/SOURCE.json`

Then inspect the actual `lab-v9/` runtime modules.

Do not begin from the older public Option-C Stage source.

That Stage is comparison/evidence only.

## 2 · First gate: exact 1:1 rehome

Before changing design, mount the exported Option C-2 project **unchanged**.

The first result must prove that the actual exported interactive scene survived the rehome.

Do not improve anything during this gate.

Verify interactively:

- scene boots;
- Cologne route appears;
- OSM buildings appear;
- current landmarks appear;
- sky/palette appears;
- HUD appears;
- all current cars remain selectable;
- camera modes work;
- audio controls remain present;
- palette export/import remains present;
- reset works.

Verify current driving controls:

- `W` / Arrow Up = throttle
- `S` / Arrow Down = brake, then reverse
- `A` / `D` / arrows = steering
- `Q` / `E` = drift
- `Shift` = boost
- `Space` = jump

Current source contains:

- `reverseAccel: 10.5`
- `maxReverse: 9`

Reverse driving is protected current behavior.

Do not replace or reinterpret it.

Return a parity note:

`OPTION_C2_REHOME_PARITY.md`

State:

- source commit;
- source folder;
- mounted files;
- controls tested;
- anything that differs after rehome.

Only after parity passes may design changes begin.

## 3 · Do not undo known fixes

Read the 2026-09-22 postmortem before changing these systems.

### Camera

Current chase-camera strategy is route-based `railClamp()`.

It deliberately replaced the old obstacle-ray camera.

Do not restore a general camera obstacle ray.

Principle:

**the chase camera stays inside the known free Race corridor instead of entering scenery and being pulled back afterward.**

### Brown surface / tunnel approach

The old reported brown surface was ultimately diagnosed as a **sightline problem**, not collision.

If a similar issue appears:

1. run corridor/route audit;
2. if zero collision is reported;
3. inspect the exact screen-space sightline/raycast;
4. identify the visible object.

Do not restart blind collision-tolerance tuning.

### Curved arches

The old visible wedge seams came from chains of discrete straight segments.

Current rule:

**visible structural curves use continuous curve geometry, not rows of wedges.**

Do not regress to segmented arches.

## 4 · Main design objective

Use this Racer as the first interactive reference for the future KFB 3D environment language.

Target:

a recognisable, playable Cologne transformed into a coherent KFB cartoon world compatible with KayKit / K-Kit characters and KFB props.

Prefer:

- rounded / bowed silhouettes;
- broad readable masses;
- controlled bend;
- lean;
- taper;
- twist;
- smooth structural transitions;
- continuous arches;
- soft asymmetry;
- readable exaggeration;
- fewer tiny pieces;
- fewer hard facets;
- silhouette-first modelling.

Avoid:

- many tiny wedge segments;
- raw extrusion appearance;
- fragmented engineering-miniature detail;
- arbitrary bevel-everything;
- generic smooth plastic.

The environment should look deliberately modelled, not merely low-poly.

## 5 · Style references

Reference folder:

`tools/KFB-ToolBox/_inbox/KFB Style References/`

Classification:

**REFERENCE_ONLY · NON_CANON**

Use it to compare:

- silhouette;
- materiality;
- clay/grain;
- colour rhythm;
- surface irregularity;
- exaggeration.

Do not copy any single image literally.

Do not declare a reference the KFB canon.

The canon emerges from Georg's review of the interactive result.

## 6 · Colour authority

Keep the existing Option-C palette system.

Current sources:

- `lab-v9/option-c-style.v1.js`
- `lab-v9/cologne-palette.v1.js`

Preserve:

- teal Race surface;
- warm structural colours;
- yellow/gold route accents;
- orange/red/magenta sky family;
- dark brown/charcoal support values;
- seeded palette variation;
- `kfb-palette/v1` import/export.

Experiment at the role level, not by hand-recolouring arbitrary meshes.

## 7 · First design slice after parity

Do **not** restyle the entire city.

Make one bounded interactive Environment Style Gate with three representative targets.

### A · Track structure

One bridge / arch / gate family.

Goal:

- smoother cartoon anatomy;
- readable continuous curve;
- broad intentional supports;
- no wedge seams;
- no obstruction of the Race corridor.

### B · OSM architecture

One representative small group of real OSM buildings.

Preserve:

- footprint/geographic truth;
- collision/source identity.

Experiment only with visible presentation:

- bend;
- lean;
- taper;
- twist;
- rounded massing;
- simplified large forms.

### C · One Cologne landmark

Use an existing current landmark.

Show it **alone first**, then in the scene.

Do not build another landmark system.

Goal:

prove that the same form language works on a hero object.

## 8 · Surface / materiality

Possible direction:

- subtle handmade clay character;
- broad macro variation;
- restrained grain;
- painterly wear;
- preserved source colour;
- preserved useful material differences.

Do not automatically import the frozen Hybrid Surface runtime.

Treat ToolBox material work as donor research.

Geometry and material experiments must be independently toggleable.

Required comparison:

- Current
- Cartoon Form
- Cartoon Form + Surface

If a surface treatment produces visible seams, keep the geometry result and stop the material pass.

## 9 · Keep the game playable

Every visual pass must remain drivable.

Do not replace or fork:

- Race movement;
- Race contact;
- route;
- lap state;
- current camera owner;
- palette owner;
- current HUD owner;
- audio owner.

Do not deliver a static scene that merely resembles the game.

The primary acceptance surface is the actual interactive 3D Racer.

Static screenshots are supplementary evidence only.

## 10 · Future compatibility

Do not build these systems now, but keep compatibility with:

- World Authoring / God Mode;
- shared Scene Patch editing;
- OSM world authoring;
- landmark placement;
- Hex World;
- reusable zone recipes;
- Residents;
- later Tactical / Storytelling Map.

Visible scene objects that may later be edited should keep stable IDs / roles.

Do not bake the new appearance into anonymous unaddressable geometry.

## 11 · Working method

For every important visible object:

1. show current source object in isolation;
2. state what visible property changes;
3. implement one seam;
4. show it in the actual Racer;
5. keep an Original / Candidate comparison.

Do not polish deployment/responsive UI while the visible object is still wrong.

After two failed repair passes on the same visual gate:

**STOP.**

Preserve the complete candidate and create failure-recovery export instead of a third blind repair.

## 12 · Session Cut

Claude Design may remain the long-lived authoring workspace.

At a coherent checkpoint export:

- complete editable source tree;
- exact original intake revision;
- updated files;
- source/donor list;
- additive changelog;
- current interactive entry point;
- supplementary screenshots;
- known failures;
- unresolved design questions;
- exact next gate.

Do not rely on Claude chat history.

Do not claim GitHub or Cloudflare publication from Claude Design.

## First human gate

Ask Georg only:

**Does this interactive Cologne scene establish the shape and material direction we should reuse for tracks, OSM environments and landmarks?**

Do not expand the style across all Cologne before this gate.
