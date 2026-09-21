# WEB CHAT BUILD SLICES · KFB Card Zone v3 / Hex Project Islands

Status: **PRIMARY IMPLEMENTATION PATH**  
Provider: **ChatGPT Web / coding chat with GitHub access**  
Rule: each slice is separately reviewable and may stop without invalidating earlier slices.

## Branch policy

Do not run all slices in one branch/chat.

Recommended pattern:

`chatgpt-web/card-zone-v3-hN-<short-name>-2026-09-21`

Each slice returns:
- exact branch/PR/head;
- exact donor refs;
- actual tests;
- browser evidence;
- Return/Source/Test Report;
- one next gate.

## H0 · Working-donor parity lock

Goal: make the v2 donor impossible to accidentally “simplify”.

Read:
- this workflow;
- strict Use What Works;
- exact v2 source/handover;
- Bench v1/v1.1 only as failure evidence.

Create a parity matrix for v2:

`FEATURE_PARITY_V2.json`

Minimum behaviors:
- Card Zone renders;
- Card Cube present;
- real card/deck present;
- reveal works;
- Sky Card / projection behavior;
- seed changes integrated world data;
- fluid modes;
- river/flow seam;
- Zonen Registry handoff;
- orbit/camera;
- Face Focus seam where environment supports it.

Save four controlled screenshots:
- overview;
- card/reveal;
- sky/projection;
- fluid/river.

**No v3 geometry yet.**

Done when:
v2 is a tested source baseline and every later v3 slice can state which parity items it preserves.

## H1 · Two Hex packs · donor isolation + three-project start plate

Goal:
prove the actual hex construction language without reviving the failed Hex Atlas scene.

Sources:
- both registry shards;
- exact pack roots;
- `tools/world_atlas/source/lib/hex-grid.js`.

First show representative source objects in isolation from **both packs**.

Then build only:
- three adjacent logical project hexes;
- one flat safe start platform;
- no Residents;
- no Card Cube;
- no Babel tower;
- no fluid;
- no project labels.

Rules:
- reuse `TILE_EDGES`;
- no second edge table;
- no generic hex cylinder;
- no giant non-uniform scaling to fake “large” hexes;
- a project hex is a **logical cell**, rendered from measured source geometry at an accepted scale/assembly.

Evidence:
- top;
- side;
- player-height;
- edge/contact debug.

Required tests:
- all three cells connected;
- no unsupported seam;
- no z-fighting;
- walkable bounds measured;
- ground/contact truth independent of visual mesh names.

## H2 · Card Zone v3 shell · copy v2, add Hex mode

Goal:
create v3 by **copying the working v2 host**, not by rebuilding from the Bench.

Required design:

`worldMode = voxel-v2 | hex-project-islands-v3`

Rules:
- `voxel-v2` remains a working rollback/reference mode;
- no v2 feature is deleted to make Hex mode easier;
- Hex mode initially reuses the same:
  - card source;
  - reveal logic;
  - Card Cube / projection seam;
  - seed/world-context;
  - camera;
  - card identity.

Mount the H1 three-hex start platform as Hex mode ground.

At this gate:
- fluid may remain v2-mode-only if the Hex fluid seam is not yet proven;
- missing Hex parity must be listed, not replaced by a fake equivalent.

Done when:
same card/seed can boot in both modes and the v2 output still matches H0.

## H3 · Chill & Fun traversal · first satellite hex

Goal:
one expressive, forgiving jump from Level 0 to one nearby project hex.

Reuse only the salvageable Platformer movement/camera ideas:
- camera-relative movement;
- target scoring;
- visible anticipation → takeoff → arc → landing → recovery;
- coyote time;
- jump buffer;
- bounded steering;
- small landing magnet;
- rescue to last safe support.

Data:

`ProjectJumpEdge`
- sourceHex;
- targetHex;
- takeoffBounds;
- landingBounds;
- horizontalGap;
- heightDelta;
- assistClass;
- actualClip;
- testedActorProfile.

### Long jump

Test `Jump_Full_Long` only if the chosen actor actually contains and binds it.

If not:
- do not invent the clip;
- use a verified supported jump presentation;
- record `LONG_CLIP_NOT_AVAILABLE` or `NOT_COMPATIBLE`.

Done when:
10 assisted jumps + 5 manual jumps have real contact evidence and no teleport.

## H4 · Project Hex graph + Cologne palette

Goal:
turn the platform proof into a readable project map.

Start with 6–9 fixture projects only.

Candidate local contract:

`ProjectHex`
- id;
- projectId;
- title;
- category;
- status;
- level;
- paletteKey;
- cells;
- stageRef?;
- sourceRef;
- residentRef?;
- propRecipe?;
- outgoingJumpEdges[];
- archiveClass?;

Color:
- source-lock current Cologne Option C color-map implementation;
- derive deterministic project/status colors through that contract;
- no screenshot-eyedropper hardcoding;
- no random rainbow.

Minecraft-like edit mode:
- add/remove valid logical project hex;
- refuse removal when actor occupies/supports the cell;
- preserve graph connectivity or report the break explicitly;
- edits export/import JSON.

No visual scene editor extraction in this slice.

## H5 · Vertical Project Atlas · Babel salvage

Goal:
use the useful **vertical progression idea**, not the failed Babel scene/generator.

Build only:
- Level 0 start cluster;
- one upper band;
- one lower band;
- lower **Graveyard** project hex for archived/post-mortem work.

Rules:
- every vertical edge has measured reachability or an explicit transport requirement;
- project placement has a reason;
- no random building scatter;
- one project = one logical project-hex node;
- static geometry first.

Do not build the moving Paternoster yet.

Evidence:
- full oblique;
- side/elevation;
- path graph;
- player view.

## H6 · Signature Resident proof

Goal:
mount exactly **one** verified signature Resident + props onto one project hex.

Use Resident Atlas owner contract:
- Resident module owns actor/props/activity presentation;
- Project Island owns support/collision/camera/project state.

Do not start by populating every hex.

Pass:
- exact Resident source;
- exact prop source;
- feet/support correct;
- no overlap;
- activity loop only if already visually accepted;
- mount/update/dispose works.

After one pass, create data profiles for later hexes.

## H7 · Hex fluid / Card-Zone environmental parity

Goal:
port the useful v2 water/fluid/narrative-flow language without rewriting its hard-won math.

First choose one bounded case:
- moat around one project hex; OR
- river between two related project hexes.

Reuse:
- v2 waterLevel vs fluidY distinction;
- one radius source;
- bank-field model;
- seed-driven mode;
- source shader path.

Adapt geometry to Hex graph cells/edges.

Do not transplant the reduced Bench fluid as a new truth unless H0 comparison proves byte/behavior parity.

## H8 · Spindle / Paternoster / Skydome

Goal:
one vertical circulation donor proof only after H5 is readable statically.

Read:
- SKY-01 brief;
- exact Combat A2 `himmel.v4.js / skydome-shader.v4.js / spindel.v4.js`.

First isolate donor behavior.

Then prove one bounded adapter:
- own meshes/materials;
- host owns scene/camera/renderer/world/gameplay;
- mount/update/dispose;
- deterministic preset;
- one static project hex boarding/landing interface.

Paternoster movement is a separate behavior from the decorative spindle unless the donor proves otherwise.

Do not make every project ride a moving structure in the first proof.

## H9 · ToolBox / Hub integration + Stage

Only after accepted prior gates:

- add the runtime to the canonical ToolBox suite;
- ToolBox Home gets one real public preview card;
- KFB Hub gets one current project/gate card;
- publish exact Stage:
  `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/card-zone-v3/`
- update Source/Return/Test Report/changelog;
- verify exact public marker/browser result.

No Live product promotion without Georg.

## What Web Chat should **not** do

- no second CardBuilder;
- no second Hex solver;
- no new Resident lifecycle;
- no new universal scene editor;
- no rebuild of Platformer failed islands;
- no “improved” copy of v2 shader from memory;
- no giant all-features branch;
- no new generic KFB dashboard UI.
