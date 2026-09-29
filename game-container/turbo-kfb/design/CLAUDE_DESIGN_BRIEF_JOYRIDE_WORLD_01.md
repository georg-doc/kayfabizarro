# CLAUDE DESIGN BRIEF · JOYRIDE-WORLD-01 · Handmade Toy Playground

**Status:** READY BRIEF · design/authoring candidate only
**Date:** 2026-09-29
**Provider:** Claude Design
**Receiving runtime:** KFB Turbo/Joyride container candidate
**Do not own:** locomotion, vehicle physics, camera runtime, input, RaceManager, audio engine, deployment

## Goal

Design **one representative KFB Joyride world chunk** that demonstrates the Handmade Toy-World language in a form that can later be consumed by the current Turbo/Joyride runtime.

This is **not a new game**, **not a new renderer**, and **not a Race redesign**.

The world should feel enjoyable to move through at speed even with no scoring:
- cruise;
- fork / choice;
- one stunt invitation;
- one destruction/play pocket;
- one Resident/POI pocket;
- one strong handmade landmark;
- clear road continuation.

## Product fantasy

**A DIY stop-motion toy playground where the player can chill, joyride, jump, bounce, smash, stop for a Resident encounter, then continue through a handmade world to music.**

Race rules are optional future content. The scene must work as free travel.

## Source locks / donors

### Runtime receiver · protect
KFB Turbo container:
- repo: `georg-doc/kayfabizarro`
- reviewed base branch: `chatgpt-web/kfb-container-turbo-01-2026-09-29`
- reviewed head before parallel work: `99ab76e7a3286676a6667cd8a7015f6a66409211`
- upstream fun/drive donor: `bridge-mind/turbo-kart-rally@c52aca3f10c7995884c316810cac6514daa40e9c` · MIT

Do **not** rewrite Kart driving, locomotion, camera, input or state routing in this job.

### Road / stunt donors
KFB Stunt Car Race:
- current repo main: `georg-doc/KFB-Stunt-Car-Race@df1e35b5692273e8a48eaa219697c927e2c39faa`
- Free Roam S04 current source pin: `a7a48a8c6e1589a18134aa619e2be22d79124c32`
- reuse its declarative road/world vocabulary: road, bypass, loop roads, corner pads, garage apron, ramp, props, shared render/collision declarations;
- Road Family Atlas is reference for Racing/City/Toy/Bridge/Dirt families.

Do not flatten this into “one race circuit”. Treat it as a road/play network.

### Look donors
Use these as visual/recipe references:
- `WORLD_CORE_MOBILITY_R0A_2026-09-29` · **candidate visual donor only**;
- K2 `clay-material.v10.js` / clay profiles / tool mixes;
- T4 `track-look.v5.js`, `transition-atlas.v1.js`, T4 clay VFX;
- ClayBound reference folder · material/form donor only.

Important: R0A is not a runtime/performance donor. It reported ~404k scene tris / 313 draw calls / ~6 fps in the design preview. Do not recreate that cost.

Do not use TinySkies source code. If a sky/atmosphere principle is useful, re-express it independently with KFB-owned code/values.

## Read first

1. `game-container/turbo-kfb/design/KFB_HANDMADE_TOY_WORLD_STYLE_BIBLE_v0_1.md`
2. current `game-container/turbo-kfb/RETURN.md`
3. World Core R0A `START_HERE.md` → `RETURN.md` → `world-recipe.r0a.json` → `DONORS.md`
4. Free Roam S04 `RETURN.md` and `site/world.js`

## Required visual grammar

### Characters / hero props
- clay-first;
- toy / craft inserts allowed;
- preserve source identity;
- do not redesign characters.

### World
Mixed handmade materials are encouraged:
- clay;
- painted cardboard;
- paper;
- wood;
- felt;
- fabric;
- toy plastic;
- bottle caps;
- boardgame / domino pieces.

Simple procedural geometry is explicitly welcome when the material story makes it intentional.

### Palette
- use the current KFB ClayBound/T4 family as the starting harmonic grammar;
- 5–8 dominant world colours;
- neutral/warm-white lighting;
- strong driving-speed readability.

## Required world chunk

Create one compact **Joyride Yard / Handmade Road Pocket** with:

1. **arrival / garage pocket**
   - readable spawn / vehicle area;
   - handmade garage or service landmark.

2. **cruise road**
   - broad readable road;
   - landscape sweeps past;
   - no race markings required.

3. **choice / fork**
   - two visually distinct continuation paths;
   - one safe/scenic, one kinetic/stunt-oriented.

4. **stunt invitation**
   - one ramp / loop / wall-ride / jump-gap family;
   - clearly readable before commitment;
   - use existing KFB stunt vocabulary/donors before inventing a new form.

5. **destruction/play pocket**
   - visually compose 3–7 potential reactive objects;
   - e.g. domino line, card house, stacked game pieces, breakable sign;
   - **design only**: mark reaction sockets / intended behaviour; do not write a second physics system.

6. **Resident / POI pocket**
   - quiet enough to stop;
   - one obvious Resident socket;
   - one card/billboard/signature-prop socket.

7. **hero landmark**
   - one weird handmade landmark visible during approach.

## Reaction annotation

Every notable prop should be tagged conceptually as:
- `STATIC`
- `AMBIENT_REACTIVE`
- `SCRIPTED_REACTIVE`
- `PHYSICS_HERO`

Do not make every object physical.

## Material assignment rule

For each major structure, record:
- base geometry type;
- chosen craft material;
- why that material makes the simple geometry feel intentional;
- hero/mid/far material tier.

Example:
`simple extruded box → painted corrugated cardboard → folded/taped house → MID`.

## Performance-first requirements

The design must intentionally reduce cost relative to R0A:
- fewer unique meshes;
- fewer repeated individual kerb/slab objects;
- instance repeated props;
- prefer spline/extrusion roads;
- use hero/mid/far material tiers;
- keep expensive clay relief for hero/readable near-field surfaces;
- document visible triangle count, draw calls and biggest mesh/material offenders in the preview.

Do not chase a fixed FPS in Claude Design's preview; instead prove the composition is structurally budgetable.

## Donor proof rule

A loaded asset URL is not evidence of donor fidelity.

Before integrating any existing prop/vehicle/building donor:
1. show the source object alone;
2. show its handmade/material translation alone;
3. only then place it into the world.

For procedural geometry, show one isolated construction sample with its intended material before mass placement.

## Deliverables

Return:
- one editable Claude Design scene/project;
- `WORLD_RECIPE.json` or equivalent declarative scene recipe as the authoritative artifact;
- material-family table;
- reaction/socket table;
- source/donor manifest;
- overview + drive-height + stunt-approach + Resident-pocket screenshots;
- triangle/draw-call/material-cost summary;
- exact list of reused modules/assets;
- unresolved items;
- one next integration gate.

## Hard boundaries

Do not:
- edit `ground-player.js`, `walk-controller.js`, Kart physics, input or camera runtime;
- build Enter/Exit Kart;
- add AI Residents, ChatterBox or Lean Memory;
- create a Race mode;
- create a second Track/World engine;
- build WFC;
- create a full town;
- batch-create dozens of bespoke 3D assets;
- turn every surface into expensive K2 clay;
- import TinySkies code;
- promote Stage/Live.

## Human question

The only visual/product question for this design pass:

> **Does this look and read like a performant KFB handmade toy playground that we would actually want to joyride through — not merely a clay shader demo?**

## Stop rule

Two failed visual repair passes on the same gate:
- freeze the candidate;
- preserve recipe/source;
- export complete recovery;
- do not start a third redesign loop.

## Compact Claude Design start message

> Work only on **JOYRIDE-WORLD-01 · Handmade Toy Playground**. Treat the current Turbo/Joyride runtime as the receiving host and do not edit locomotion, Kart physics, input, camera or state routing. Read the Handmade Toy-World Style Bible, then reuse the current KFB Free Roam S04 road/play vocabulary and the existing K2/T4/World-Core-R0A look donors. Build one compact free-travel world chunk: garage/arrival → cruise road → fork → one stunt attraction → one destruction/play pocket → one Resident/POI pocket → one hero handmade landmark. Characters and hero props are clay-first; the world may mix cardboard, paper, wood, felt, fabric, toy plastic, bottle caps and boardgame pieces. Simple procedural geometry is preferred when the material story makes it intentional. Do not create a Race, WFC world, new renderer, new physics, or a pure-clay monoculture. R0A is a visual/recipe donor, not a performance target; reduce unique meshes/material cost and report tris/draw calls. Show every reused donor in isolation before integration. The authoritative output is a declarative world recipe plus an editable scene and screenshots. Stop after two failed repair passes.
