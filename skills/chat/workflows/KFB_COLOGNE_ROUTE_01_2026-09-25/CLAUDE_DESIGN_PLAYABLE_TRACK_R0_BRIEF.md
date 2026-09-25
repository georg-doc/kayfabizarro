# CLAUDE DESIGN · PLAYABLE-TRACK-R0 · 2026-09-26

**Executor:** Claude Design  
**Input owner:** Web-prepared `PLAYABLE_TRACK_R0_CLAUDE_INPUT` package  
**Runtime owner:** `georg-doc/KFB-Stunt-Car-Race`  
**Task:** assemble one new coherent, directly playable KFB racetrack from the actual pinned RKIT pieces  
**OSM:** planned in the same route architecture, but the first visual/playable build is track-first  
**No GitHub write claim from Claude. Export a complete Session Cut.**

---

# 0 · Do not start from prose alone

Your primary input is the Web-prepared package created from:

`WEBCHAT_PLAYABLE_TRACK_R0_PREP_BRIEF.md`

It must contain at least:

- `RUNTIME_BASE.json`
- `MODULE_CATALOG.json`
- `PLAYABLE_TRACK_R0.recipe.json`
- `OSM_SEAM_CONTRACT.md`
- `SOURCE.json`
- isolated donor evidence.

If that pack is missing or a required source module is still only described in prose, mark it:

`SOURCE_REQUIRED`

Do not create a substitute model, placeholder track piece or generic fallback.

GitHub/current source state beats this document whenever the input pack records a newer exact pin.

---

# 1 · What you are building

Build **one new closed playable track**, working name:

`PLAYABLE_TRACK_R0`

This is the first integration playground for:

- normal KFB driving;
- flowing curves;
- S-offset / chicane;
- tight hairpin / drift line;
- elevation / bridge approach;
- one optional hero stunt branch with safe bypass;
- street-profile ↔ race-profile transition;
- later OSM route replacement using the exact same RouteRecipe architecture.

It is **not**:

- a debug geometry gallery;
- a Blender kit showcase;
- a copy of TRACK_A;
- a Tokyo-themed environment;
- an OSM city yet;
- a second Race engine.

The desired first-read feeling is:

**a proper weird KFB racetrack you can simply start driving, lap repeatedly and learn by driving.**

---

# 2 · Source-first rule

Before composing the track, show the actual pinned donor objects separately inside the Design project.

At minimum show:

1. base RKIT track/profile;
2. S/chicane source;
3. hairpin source;
4. grade/bridge source;
5. CITY_STREET source;
6. street↔track adapter;
7. switch/bypass source;
8. `LOOP_REAL` if included.

These isolation views are evidence, not a permanent visible UI.

A module loading successfully is not enough. The actual donor design must be visibly present before integration.

Do not remodel any of these just to make composition easier.

---

# 3 · Preserve the existing Race owners

Use exactly the runtime pinned by `RUNTIME_BASE.json`.

Do not create or fork:

- another player controller;
- another physics/contact world;
- another camera owner;
- another recovery system;
- another AudioContext;
- another world runtime.

Do not retune driving physics unless the input pack explicitly contains one narrowly authorized correction.

If geometry and physics disagree, document the seam for Web/Race. Do not hide it with animation or invisible rails.

---

# 4 · Track R0 composition

Use `PLAYABLE_TRACK_R0.recipe.json` as the route truth.

The route should read as one continuous experience, approximately:

```text
START / WIDE STRAIGHT
→ FLOWING CURVE
→ OFFSET_S
→ CHICANE
→ HAIRPIN / DRIFT BOWL
→ CLIMB
→ SHORT ELEVATED / OVERPASS
→ OPTIONAL HERO STUNT
   ├─ LOOP_REAL lane
   └─ SAFE BYPASS
→ DESCENT
→ WIDE SWEEPER
→ TRACK_TO_STREET
→ CITY_STREET
→ STREET_TO_TRACK
→ FINAL FLOWING CURVE
→ START
```

Do not force every module into the route merely because it exists.

Priorities:

1. rhythm;
2. readable approach;
3. driving line;
4. safe continuation;
5. visual surprise;
6. one clear optional spectacle beat.

The ordinary lap must still work with the hero stunt skipped.

---

# 5 · Drift zone

The S / chicane / hairpin area is the first **Tokyo-Drift mechanics fixture**, not Tokyo scenery.

Design it so the player can understand:

- approach;
- braking/turn-in;
- first slide;
- direction change;
- hairpin rotation;
- exit/re-grip.

Use geometry and sightlines to teach the movement.

Do not add arrow spam, floating tutorial cards or a wall of instructions.

If a small in-world cue is needed, reuse a verified existing Race/KFB cue family from the input pack.

Physics profiles such as `CHILL_SHOW` vs `DRIVE` belong to later Race tuning; do not fake them by animating the car along the path.

---

# 6 · Elevation / bridge act

The climb and elevated section should make the track feel spatial, not like a flat spline demo.

Requirements:

- continuous grade;
- readable crest;
- enough visual separation from the lower route;
- support/structure from actual pinned RKIT donors;
- no support through a lower drive lane;
- no one-frame vertical step;
- descent returns cleanly to normal driving.

Use one dramatic viewpoint/sky reveal if it happens naturally.

Do not create a new bridge style system.

---

# 7 · Stunt branch

If the input pack includes `LOOP_REAL`:

- reuse that exact module;
- preserve its safe bypass;
- make lane choice readable early enough;
- do not visually hide the bypass as a punishment path;
- do not claim the loop works in Race until Web/Race drives it after rehome.

If LOOP_REAL is not source-ready when this starts:

- omit the loop from R0;
- preserve the branch socket in the route;
- build the bypass as the normal lap;
- mark `LOOP_SOURCE_PENDING`.

Do not invent a replacement loop.

---

# 8 · Street ↔ track seam

This is essential for the later OSM route.

R0 must visibly prove:

```text
RKIT TRACK
→ TRACK_TO_STREET
→ actual CITY_STREET profile
→ STREET_TO_TRACK
→ RKIT TRACK
```

The street segment is not fake OSM geography. It is a **real profile/transition proof** on the authored R0 route.

Requirements:

- no road-top height pop;
- no width snap;
- curb/sidewalk appears/disappears intentionally;
- barrier/edge treatment changes independently;
- player/contact owner remains unchanged.

Do not decorate it as “Cologne” yet.

---

# 9 · OSM-ready anchors

The first track must not paint itself into a one-off topology.

Expose/retain clear semantic anchors for later Web mapping, e.g.:

- `R0_STREET_IN`
- `R0_STREET_OUT`
- `R0_STUNT_SPLIT`
- `R0_STUNT_MERGE`
- `R0_BRIDGE_IN`
- `R0_BRIDGE_OUT`
- `R0_START_FINISH`

Names may follow the actual recipe.

Do not add a separate OSM route implementation.

---

# 10 · World/look

Use the exact environment/look sources pinned by Web.

Rules:

- reuse the current KFB palette/material/light/world grammar;
- no new colour system;
- no per-piece arbitrary recolouring;
- no generic Unreal/Unity-style race chrome;
- no generic neon cyberpunk drift styling;
- no replacement KFB logo or fabricated wordmark;
- no visual wrappers around donor assets that erase their identity.

The track may look surreal, bent and cartoonish, but it must still read as one world.

The first build does not need the full Köln city around it.

---

# 11 · Player-facing presentation

Boot into the experience.

The player should not land on a lab dashboard.

Default visible UI:

- only the current player-facing Race controls/HUD actually owned by the pinned runtime;
- anything already required by that host;
- no new debug overlay by default.

Diagnostics may exist behind:

- a query flag;
- a developer key;
- a hidden debug route.

Do not make Georg toggle ten switches before driving.

---

# 12 · Camera / readability

Keep the existing Race camera owner.

You may compose the track around its real view.

Do not solve blind corners by replacing the camera system.

Check visually:

- approach to chicane;
- hairpin exit;
- split/bypass choice;
- bridge crest;
- merge after stunt;
- street transition;
- start/finish return.

If the existing camera exposes a true track-blocking problem, record it precisely for Web/Race.

---

# 13 · Failure/recovery readability

The route should be forgiving enough to freeplay.

Use current Race recovery.

Design considerations:

- runoff/space where the drift section needs it;
- barriers only where they serve the track;
- no unnecessary cliff edge on ordinary corners;
- safe bypass for stunt;
- restart/recovery point should not place the player into another collision.

Do not implement a new respawn owner.

---

# 14 · No test UI / no placeholder geometry

Explicitly forbidden:

- giant mode switcher;
- developer control wall;
- grey-box replacement modules where pinned art exists;
- handmade substitute curves;
- placeholder loop;
- invisible air rail;
- decorative minimap dummy;
- generic racing brand signage;
- “KFB” text typed in a random font as branding.

Every visible source-mandated track form should come from a real pinned donor or from the parametric RKIT route output.

---

# 15 · What Claude may change

Within the exported candidate:

- route composition using the supplied recipe/system;
- transforms/placement of track modules through their intended connectors;
- environment composition around the track using pinned sources;
- start/spawn placement;
- visual hierarchy/readability;
- source-approved material/profile assignments;
- player-facing composition needed to present the existing runtime cleanly.

Do not silently change core physics constants, vehicle behavior, controller ownership or source module geometry.

---

# 16 · Design-side review before export

Before delivery, inspect:

- full lap from overview;
- start straight;
- S/chicane;
- hairpin;
- bridge/elevation;
- stunt split + bypass;
- merge;
- street transition both directions;
- final return to start.

Verify visually that the track is continuous and no obvious deck gaps, crossings or support intrusions exist.

Do not call this a Race/browser PASS unless such a test actually ran.

---

# 17 · Export package

Claude Design cannot establish GitHub/public status.

Deliver a complete multi-file Session Cut containing:

- all project files;
- exact source files brought into the project where the workflow requires them;
- no simplified single-file lookalike.

Also include:

### `RETURN.md`

Order:

1. known defects first;
2. file tree;
3. what changed visually;
4. route sequence;
5. what is actually playable in the Design preview;
6. what requires Web/Race verification;
7. OSM-ready seams;
8. unresolved source needs.

### `SOURCE.json`

Every donor with exact:

- repo;
- branch/head;
- path;
- role.

### `CHANGELOG.md`

Additive:

- new;
- unchanged;
- deliberately not touched.

### `TRACK_R0_COMPOSITION.md`

Compact explanation of:

- route beats;
- why each module is there;
- sightline/flow decisions;
- stunt/bypass logic;
- street/OSM seam.

### Evidence images

At minimum:

- isolated donor sheet;
- full route overview;
- chase-height chicane;
- hairpin;
- bridge;
- stunt split/bypass;
- street transition.

---

# 18 · Do not start real Köln OSM composition in this slice

The actual Hürth → Dom → Rhein → Mülheimer Brücke → SAE route is Phase D/E of:

`TRACK_TO_OSM_EXECUTION_LADDER_2026-09-26.md`

Track R0 must be OSM-ready, but it does not impersonate Köln.

After Track R0 is Web-rehomed, browser-tested and human-reviewed, Web prepares the real OSM Route 01 recipe. Claude then composes that real geography using the same proven architecture.

---

# Done when

The exported candidate lets Web rehome **one coherent lap**, not a module gallery.

The candidate must visibly contain:

- a continuous closed route;
- S/chicane;
- hairpin/drift fixture;
- elevation/bridge act;
- stunt branch or preserved stunt socket + safe bypass;
- real track↔CITY_STREET↔track transition;
- clean player-facing boot;
- OSM-ready semantic anchors.

## Next gate

**WEB-REHOME-TRACK-R0**.

Web must prove source parity, integrate with the exact Race owner, run the real browser/free-drive tests and only then create the reserved Stage candidate.
