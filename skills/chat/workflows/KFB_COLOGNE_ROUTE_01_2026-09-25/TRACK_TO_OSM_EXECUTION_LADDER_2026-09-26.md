# Cologne Route 01 · Track-first → OSM execution ladder · 2026-09-26

Status: **CURRENT EXECUTION PLAN · TRACK FIRST, OSM SEAM DESIGNED IN FROM START**

Owner split remains unchanged:

- `georg-doc/KFB-Stunt-Car-Race` owns playable Race runtime, movement/contact, route/track integration and physics;
- RKIT / Blender MCP supplies track geometry/modules + route metadata, not gameplay ownership;
- OSM City owns geography/data normalization;
- WorldBuilder owns world/terrain/object authoring;
- Web Chat prepares/pins sources, rehomes Claude exports, tests and publishes;
- Claude Design composes the player-facing track experience from pinned sources. It does not become a second runtime owner.

## Current input status

Georg reports that Blender MCP is currently building the missing connector / offset pieces for the track kit.

**GitHub check at 2026-09-26:** no new `rkit-10` branch/PR was visible yet in `georg-doc/KFB-Stunt-Car-Race`; visible RKIT branches still end at RKIT-08/09 / PR #41.

Treat the MCP work as **USER-REPORTED IN PROGRESS · GITHUB OUTPUT NOT YET PINNED** until Web Chat can read its exact branch/head/files.

Do not hard-code invented MCP output paths.

---

# Phase A · WEB-PREP-TRACK-R0

Executor: fresh ChatGPT Web chat with GitHub.

Goal:

**prepare one closed, source-pinned input pack that lets Claude Design assemble a new playable KFB track without researching/reinventing the architecture.**

Read:

- central KFB router/workflow/fresh-chat protocol;
- this Cologne Route workflow;
- current Race main / Recovery / WSA_START;
- current RKIT PR/branch chain;
- the new Blender MCP result once it appears;
- current accepted driving/runtime evidence;
- current world/look sources used by the chosen Race host.

## A1 · Pin the actual runtime owner

Do not let Claude decide between obsolete Race hosts.

Web must choose and record one exact playable runtime baseline after current-state inspection.

Selection rules:

1. preserve the accepted current driving/feel owner;
2. use the runtime that can actually consume ramp/contact/air geometry needed by the selected modules;
3. do not revive C-3 route-relative contact if that path still cannot launch from geometry;
4. do not create a second controller;
5. record exact repo/branch/head/files.

Output:

`RUNTIME_BASE.json`

## A2 · Pin the geometry module set

Build `MODULE_CATALOG.json` from actual source files, not prose.

Minimum roles:

- base RKIT swept track;
- STANDARD/WIDE/HERO width handling;
- current curve/bank transition donor;
- current S/chicane/hairpin/offset pieces from Blender MCP if delivered;
- CITY_STREET profile;
- STREET_TO_TRACK adapter if delivered;
- grade/crest/dip/bridge approach if delivered;
- switch / safe bypass;
- one grounded stunt module: prefer `LOOP_REAL` only if its source can be loaded and the Race gate is appropriate;
- tabletop/jump only if the selected runtime already supports the needed launch/landing seam.

For every visual source object:

**show it in isolation before composition.**

A path that loads is not source proof.

## A3 · Author the first playable recipe

Create a new recipe, working name:

`PLAYABLE_TRACK_R0`

Target:

- closed loop;
- roughly 1.2–2.0 km unless current geometry/physics evidence recommends another size;
- one complete lap without teleport;
- ordinary driving must be enjoyable without taking a stunt branch;
- at least one safe bypass for every optional high-risk stunt.

Recommended sequence:

```text
START / WIDE STRAIGHT
→ flowing CURVE_EASE
→ OFFSET_S
→ CHICANE
→ HAIRPIN / DRIFT BOWL
→ GRADE UP
→ short elevated / bridge section
→ optional LOOP_REAL branch + SAFE BYPASS
→ flowing descent / wide sweeper
→ STREET_TO_TRACK reverse transition
→ real CITY_STREET profile segment
→ TRACK transition
→ final readable curve
→ START
```

This is **not** a Tokyo-themed scenery level. It is a reusable drift/stunt grammar proof.

## A4 · OSM seam is planned now, not bolted on later

Even though R0 is track-first, the prep pack must expose the later OSM seam.

Create:

`OSM_SEAM_CONTRACT.md`

It must define:

- same metre/local-frame convention;
- same RouteRecipe schema;
- exact street↔track profile transition;
- route section provenance;
- controlled KFB deviation envelope from the OSM centre line;
- chunk/segment IDs;
- entry/exit anchors;
- structure/edge treatment independent from route;
- landmark/world dressing remains downstream from route geometry.

Use existing evidence:

- RKIT-06 Trankgasse proves real OSM line → RKIT geometry;
- Race PR #12 proves a continuous Hürth→Ehrenfeld OSM receiver/corridor pattern;
- current Hürth/WorldBuilder work proves a real city/world authoring context exists.

Do not import all of Köln in Phase A.

## A5 · Claude input pack

Return a compact, self-contained packet:

- `RUNTIME_BASE.json`
- `MODULE_CATALOG.json`
- `PLAYABLE_TRACK_R0.recipe.json`
- `OSM_SEAM_CONTRACT.md`
- `SOURCE.json`
- `CLAUDE_INPUT.md`
- isolated donor screenshots/renders;
- known defects / forbidden fallbacks;
- exact branch/head.

No player-facing test UI should be required by Claude to understand the sources.

---

# Phase B · CLAUDE DESIGN · PLAYABLE-TRACK-R0

Executor: Claude Design.

Source of truth: the Web-prepared input pack + exact pinned GitHub sources.

Goal:

**assemble a coherent, directly playable new KFB track from the real RKIT pieces and existing Race runtime.**

Claude Design does not model missing geometry. If a required module is absent, mark `SOURCE_REQUIRED` and use a route variation that can be built from the pinned kit; do not fabricate a replacement.

Full brief:

`CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`

Delivery is a complete editable Session Cut/export. No GitHub claim from Claude.

---

# Phase C · WEB-REHOME-TRACK-R0

Executor: ChatGPT Web.

1. rehome Claude's export 1:1 first;
2. prove source parity before modifications;
3. bind it to the existing Race owner without adding a second movement/camera/audio owner;
4. run narrow static/contract tests;
5. run actual browser/free-driving tests;
6. produce local preview;
7. fix code/contract seams in Web; route visual/composition changes back to Claude Design;
8. after a coherent candidate, publish the exact KFB Stage route and update Hub.

Proposed future Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/race/playable-track-r0/`

This URL is **RESERVED / NOT LIVE** until opened and verified with the expected revision.

## Track R0 human gate

Georg should be able to:

- spawn and immediately drive;
- finish multiple full laps;
- stop/reverse/turn without a scripted lock;
- drift through the S/chicane/hairpin zone;
- take or bypass the stunt branch;
- traverse the elevation/bridge section;
- pass the street-profile segment without a visible/contact seam;
- recover after mistakes;
- drive without a wall of test UI.

Status after automated tests remains `TESTED`, not `HUMAN_ACCEPTED`.

---

# Phase D · WEB-PREP-OSM-ROUTE-01

Starts only after Track R0 is a useful playable baseline.

Goal:

**map the actual Hürth → Dom → Rhein → Mülheimer Brücke → SAE geography into the already-proven route grammar.**

Do not redesign the track system.

Web Chat:

1. pins the exact OSM route/corridor and provenance;
2. divides it into manageable chunks/acts;
3. simplifies centre lines only within a measured tolerance;
4. maps each section to:
   - surface profile;
   - edge profile;
   - structure profile;
   - optional stunt branch/socket;
   - KFB deviation envelope;
5. identifies only geometry that the existing kit genuinely cannot express;
6. issues narrow Blender MCP follow-up asks only for those gaps.

Recommended acts remain:

- Hürth start;
- Luxemburger axis;
- Dom / Trankgasse;
- Rheinufer;
- Mülheimer Brücke;
- Mülheim / Carlswerk;
- SAE arrival.

Output:

`COLOGNE_ROUTE_01.recipe.json` + source/corridor evidence.

---

# Phase E · CLAUDE DESIGN · OSM COMPOSITION

Only after the Web OSM recipe exists.

Claude Design does **composition/dressing/readability**, not geography invention:

- same accepted Race/Track R0 owner;
- real OSM route anchors;
- real street↔track seams;
- track/stunt exaggeration only where allowed by the recipe;
- existing KFB WorldBuilder/OSM building grammar;
- landmarks/district identity from pinned donors;
- no second city runtime.

Then Web rehomes/tests again.

---

# Why this order

The playable Track R0 isolates the hard reusable questions:

- route solver;
- seams;
- collision/contact;
- drift geometry;
- elevation;
- bypasses;
- stunt integration;
- profile changes;
- recovery;
- camera/readability.

OSM then becomes **data feeding an already working track grammar**, instead of mixing GIS, visual composition and broken driving in one first gate.

At the same time, the OSM seam contract is written before Track R0, so the first track cannot paint itself into a proprietary one-off corner.

## One next gate

**WEB-PREP-TRACK-R0**.

It should begin only when it can also inspect the latest Blender MCP result, or explicitly record that result as still unavailable and prepare the rest of the input pack without inventing it.
