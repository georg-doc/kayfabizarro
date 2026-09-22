# KFB World Building Preflight · Fresh Web/GitHub Chat · 2026-09-22

Status: **PREPARED EXECUTION BRIEF · PRE-CLAUDE-DESIGN TECHNICAL PREFLIGHT · NO PRODUCT OWNER CHANGE**

Repository:
`georg-doc/kayfabizarro`

Prepared against main:
`d7ff0eb8d83a1c254d3f03f08d528cbc1e5a52e3`

Named owner:
**KFB ToolBox / World Authoring preflight**

Named branch:
`chatgpt-web/world-building-preflight-2026-09-22`

Intended Stage route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`

This chat prepares technical evidence for the later Claude Design World/Environment authoring lane.

It does **not** build the final KFB World.

It does **not** replace Travel, Race, OSM, Hex, Dungeon, Scene Patch or Asset Librarian ownership.

---

# 0 · Read exactly these files first

Do not recursively read the whole repository.

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
5. `skills/session-entry-use-what-works_v1.md`
6. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/START_HERE.md`
7. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/WORLD_ARCHITECTURE_RED_TEAM_2026-09-22.md`
8. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/CLAUDE_WORLD_AUTHORING_BRIEF.md`
9. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/SOURCE_FAILURE_MATRIX.md`
10. current Return in that same handoff folder.

Then re-read current `main` head immediately before writing.

GitHub state overrides this briefing if newer source exists.

---

# 1 · Timeout / scope discipline

This task exists partly because previous large Web slices repeatedly timed out.

Therefore:

## One gate per work cycle

Never combine multiple gates into one large write.

Work in this rhythm:

1. read only the exact source needed for the current gate;
2. implement only that gate;
3. run narrow checks;
4. write one small GitHub checkpoint;
5. fetch exact branch head + intended files;
6. stop and report the checkpoint before starting the next gate.

A new user "weiter" may advance to the next gate.

Do not silently continue into the next gate inside the same large tool run.

## Hard size limits

For this preflight:

- no repo-wide source census;
- no recursive reading of giant changelogs/history;
- no full Cologne OSM city build;
- no full 12–24 Hex World Editor;
- no infinite-world generator;
- no full TinySkies rehome;
- no Möbius or hollow-world implementation;
- no general voxel engine;
- no universal ECS/framework;
- no UI redesign.

If a source file is large, search/read the relevant functions only.

## GitHub write rule

After **every** GitHub write:

- fetch exact branch head;
- fetch/read intended changed file(s);
- only then continue.

Timeout = **UNKNOWN**, never success.

Inspect branch/ref before retry.

After two failed repair passes on the same visible gate:

**STOP. Preserve candidate + failure recovery.**

---

# 2 · Goal of this preflight

Reduce uncertainty before Claude Design spends scarce authoring context.

We want to answer three technical questions only:

### Q1 · What can KFB reuse already?

Prove the relevant existing internal donors and pin the most useful external architecture references.

### Q2 · Can one tiny logical world recipe sit on different world geometries?

Prove a minimal Surface Adapter concept on:

- FLAT
- SPHERE
- TORUS

without duplicating game/world ownership.

### Q3 · Can WhackMan's good Dungeon mood be extracted as a reusable Environment Profile?

Prove the lighting/material behaviour outside WhackMan gameplay.

If these three questions are answered, stop.

The later Claude Design briefing can then be sharpened from evidence rather than speculation.

---

# 3 · Protected owners

Do not replace:

- Travel/TinySkies terrain/world/runtime ownership;
- Race movement/contact/route/camera owners;
- OSM source/geography truth;
- existing Hex grid/edge/solver logic;
- Dungeon layout owner;
- Scene Patch architecture;
- Asset Librarian discovery ownership.

This preflight may build **adapters and isolated proof harnesses only**.

---

# 4 · Gate P0 · Source and donor pin

Outcome:

one concise source note, no runtime changes yet.

Read only the relevant current source sections for:

## Internal donors

### Travel / TinySkies

From current `georg-doc/KFB-Travel-Globe`:

- `WSA_START.md`
- `travel/CONTRACT.md`
- `travel/globe-v13/terrain-surface.js`
- `site/world-builder/world-recipe.js`
- `site/world-builder/support-surface.js`
- `site/world-builder/runtime-mode.js`

Confirm:

- one terrain-height truth;
- `setTerrainZones(...)`;
- support-surface concept;
- existing World Recipe work;
- one-active-movement-writer rule.

### Hex

Use current corpus:

`tools/KFB-ToolBox/_inbox/KFB Hex Assets Worldbuilding (WIP Exporte WS1)/kfb-hex-worldbuilder-corpus_2026-09-22/`

Read only:

- `README.md`
- `PACK_TRUTH.md`
- `NEXT_FIVE.md`
- exact solver/edge files needed for the later 7-cell proof.

Do not rebuild Hex logic.

### WhackMan

Use:

`tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/`

Read only the relevant environment sections of:

- `wm-boot.js`
- `wm-gate-b.js`
- `wm-gate-c.js`

Confirm the actual source behaviour for:

- dusk/fog;
- torch pool;
- flicker;
- local visibility;
- material mattification.

### Spindle Sky / card funnel donor

Use the existing Combat planning source rather than rebuilding the effect.

Current Combat planning branch:

`georg-doc/KFB-Combat-Arena:wsa/ca2-kaykit-prep-2026-09-20`

Read:

- `_handover/CA2_KAYKIT_ACTORS_2026-09-20/prompts/SKY_01_SPINDLE_MODULE.md`
- donor `himmel.v4.js`
- donor `spindel.v4.js`
- donor `skydome-shader.v4.js`

Useful existing behaviour:

- cylindrical interior sky carrying real KFB card motifs;
- lower card funnel/trichter;
- upper spindle/dome closure;
- optional vortex/lava throat surface;
- separate psychedelic/hypno spiral overlay;
- palette/story-sky hooks;
- measured camera/far-plane and closure diagnostics;
- existing lifecycle clues `mount/update/dispose`.

Classify it as a **reusable Environment / World Element donor**, not Combat-only scenery.

Do not integrate it into Race or World in P0.

Do not couple a new module to Combat private fields.

The existing Combat brief already proposes a standalone candidate:

`kfb.environment.spindle-sky/0.1-candidate`

with host-owned scene/camera/renderer/clock/fog/gameplay.

P0 should decide only whether that extraction remains the correct modular seam and what exact donor revisions to pin.

### Storytelling Map / Tactical representation donor

Use current main intake:

`tools/KFB-ToolBox/_inbox/KFB StoryMap v1/`

Read only:

- `START_HERE.md`
- `POSTMORTEM-2026-09-22.md`
- relevant `docs/SMA1-GATE.md` sections for canonical transforms, voxel view, water and BoardGameBits;
- exact `sma1-map-animator.js` functions needed for ripple / D6 terracing / canonical reset.

Classify separately:

- canonical geography vs presentation-transform separation;
- D6 coast-distance terrace proof;
- one map-owned wet-mask truth;
- ripple as reusable Surface-FX donor;
- Ink/Shadow representation modes;
- BoardGameBits / Domino as World Toy Props.

Do **not** promote the current StoryMap water appearance. It remains visually unresolved.

Do not make StoryMap a second World or OSM owner.

### OSM

Read only enough current OSM code/docs to identify:

- semantic source truth;
- current building footprint/collision representation;
- current presentation/deformation seam.

Do not rebuild Cologne here.

## External research donors

Do not integrate them in P0.

Pin only repo + license + the specific idea worth reusing.

Priority:

1. `ZyFou/ProceduralTerrains`
   - terrain engine/editor separation;
   - Tile / Infinite / Planet;
   - chunk/LOD;
   - save/load and export.

2. `gunyakov/three-hex-map`
   - instanced visible Hex rendering;
   - shader blending;
   - water / rivers;
   - vegetation;
   - fog-state rendering.

3. `tordanik/OSM2World`
   - OSM semantic interpretation / preprocessing.

4. `uber/h3`
   - optional geographic Hex indexing bridge.

5. `willjoe/terranian`
   - renderer-independent OSM world-model separation.

Research-only secondary references:

- `kenjinp/hello-terrain`
- `Zylann/godot_voxel`
- `mscroggs/mathsteroids`

Do not vendor/copy external code in P0.

Do not assume license compatibility from a README badge; inspect the actual license.

### P0 output

Create:

`tools/KFB-ToolBox/world-building-preflight/SOURCE_REUSE_MATRIX.md`

Classify each donor:

- REUSE_DIRECT
- ADAPT
- RESEARCH_ONLY
- DO_NOT_IMPORT

Record exact revisions.

### P0 done when

The matrix answers:

- what KFB already owns;
- what is worth adapting;
- what should only inspire architecture;
- which external licenses need caution.

Commit and stop.

---

# 5 · Gate P1 · WhackMan Environment Profile isolation

Do not touch WhackMan gameplay.

Goal:

prove that the useful Dungeon mood can exist as a standalone Environment Profile.

Create a tiny isolated proof under:

`tools/KFB-ToolBox/world-building-preflight/environment-profile/`

Use existing WhackMan source behaviour as donor.

Do not rewrite from memory.

Copy/adapt the smallest real blocks necessary.

## Required proof scene

Only:

- simple ground/room surface;
- 3–6 real mounted-torch source objects if easy to resolve;
- otherwise prove the real torch donor in isolation first and fail loudly if unavailable;
- one neutral KayKit wall/floor sample;
- one camera.

Controls:

- Environment: DAY / DUSK
- Torch profile on/off
- Local visibility 0..1
- Material profile source / matte candidate

No generic dashboard.

Keep controls compact.

## Environment profile behaviour

Candidate schema may be:

`kfb.environment-profile/1`

It should represent behaviour/config, not WhackMan gameplay.

Prove:

- cool weak ambient/sky light;
- warm torch light;
- physical falloff;
- max-nearby-light pool rather than one live light per torch;
- asynchronous flicker;
- visible glow source;
- depth fog;
- player/local visibility radius;
- material calibration toggle.

Do not freeze exact numbers globally.

## P1 tests

At minimum:

- source torch proof visible;
- 0 console errors;
- pool never exceeds configured max;
- local visibility does not overwrite global dusk/fog;
- matte toggle is reversible;
- no WhackMan movement/MazeGraph dependency.

### P1 output

- environment-profile module/config;
- tiny demo;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- one screenshot/visible proof;
- additive changelog.

Commit and stop.

---

# 6 · Gate P2 · Surface Adapter micro-proof

This is the most important demo.

Do not build the World Editor.

Goal:

prove that the **same tiny logical recipe** can be embedded on different surfaces.

Create:

`tools/KFB-ToolBox/world-building-preflight/surface-adapter/`

## Logical recipe

Use one small recipe only.

Contents:

- seven real KayKit Hex cells from the existing corpus;
- one short route/road spline in local logical coordinates;
- one real prop that has been shown in isolation first;
- one Environment Profile reference from P1;
- one expanding KFB Surface-FX event.

Do not add Residents, combat, full OSM buildings or procedural biomes yet.

## Surface adapters

Implement only:

- FLAT
- SPHERE
- TORUS

Each adapter must provide the local frame needed by future consumers.

Conceptually:

```
poseAt(address, heightOffset)
→ position + normal + tangentU + tangentV + handedness + surfaceId
```

and enough inverse/project logic for this demo.

Do not freeze a large universal API.

The smallest common seam that proves the concept is preferred.

## Sphere

Reuse/adapt current Travel math/source where possible.

Do not create a second Travel terrain owner.

## Torus

Use straightforward parametric geometry/math.

Torus is deliberately chosen before Möbius because it wraps in two directions while remaining orientable.

## Hex placement

Reuse current Hex source truth.

Do not create another solver.

For the seven-cell fixture:

- real source identities;
- valid rotations only;
- local surface normal determines "up";
- cells remain seated on all three surfaces.

## Route

Same logical route data for all three adapters.

The proof is not Race physics.

Render a simple visible route/ribbon or markers demonstrating that the local frame follows the surface.

Do not import the Race controller.

## Surface FX

Reuse the current StoryMap/Travel ripple semantics before inventing a new effect system.

Implement one low-cost expanding colour field/ring.

Same event data on all three surfaces.

It may be shader-driven or instance/cell-state-driven.

Physics/collision must remain unchanged.

## P2 visible UI

One compact switch:

- FLAT
- SPHERE
- TORUS

Optional:

- FX trigger

Nothing else.

## P2 acceptance

All must be true:

- same logical recipe object is used by all three surfaces;
- same seven source Hex identities;
- same road/route data;
- same prop identity;
- same Environment Profile reference;
- correct local up/orientation;
- no duplicated world/movement owner;
- Surface FX reads coherently on all three;
- no visible object floats due to using global Y as universal up.

### P2 tests

Add deterministic numeric checks for:

- normalized normals;
- tangent orthogonality;
- right/left frame consistency;
- finite transforms;
- Flat/Sphere/Torus address round-trip within a documented tolerance;
- same recipe identity across all adapters.

Then real browser proof.

### P2 output

- adapter modules;
- tiny recipe;
- demo;
- tests/evidence;
- `RETURN.md`.

Commit and stop.

---

# 7 · Explicitly NOT in this chat

Do not start:

- Möbius;
- Klein bottle;
- hollow sphere;
- edge-fall Flat World;
- full OSM Cologne conversion;
- rounded OSM building production pipeline;
- full biome generator;
- infinite chunking;
- cave/voxel integration;
- 12–24 tile World Editor;
- TinySkies portal integration;
- weather system;
- final sky dome;
- Racer integration;
- final Dungeon Generator integration.

Record those as DEFERRED only.

The point of this chat is to make the later design brief smaller and more certain.

---

# 8 · Optional research note only: OSM cartoon geometry

If P0–P2 are all clean and the user explicitly asks to continue, do **not** implement a full OSM pass.

Only write a next-slice brief for:

**5–10 OSM buildings: exact footprint/collision vs separate rounded cartoon presentation envelope.**

No implementation in this preflight unless explicitly requested later.

---

# 9 · Stage / publication

If P1 or P2 becomes a visible demo, use only:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`

The Stage may expose P1/P2 as compact modes/tabs.

Do not create multiple public routes unless technically necessary.

Do not claim PUBLIC_VERIFIED until the exact Cloudflare URL has been opened and the expected revision is visible.

Update the KFB Hub in the same publication checkpoint if a human review route is created.

---

# 10 · Return discipline

At the end of each gate, report only:

- repo;
- branch;
- exact head;
- changed files;
- checks actually run;
- direct Stage URL if one exists;
- unresolved items;
- exactly one next gate.

Do not send long process narration.

Persist details in GitHub docs.

---

# 11 · Final preflight result

If P0–P2 pass, create:

`tools/KFB-ToolBox/world-building-preflight/CLAUDE_DESIGN_INPUT.md`

This is the compact input for the later Claude Design project.

It should contain only proven facts:

- accepted/rejected donors;
- Environment Profile contract;
- minimal Surface Adapter seam;
- Flat/Sphere/Torus proof result;
- tiny recipe schema;
- performance/instancing observations;
- unresolved visual questions for Design;
- things Design must NOT rebuild.

The later Claude Design chat should not need to replay this technical investigation.

---

# One next gate

Start with **P0 only**.

Do not implement P1 in the same work cycle.

After P0 is committed and verified, return the exact head and wait for the next user instruction.
