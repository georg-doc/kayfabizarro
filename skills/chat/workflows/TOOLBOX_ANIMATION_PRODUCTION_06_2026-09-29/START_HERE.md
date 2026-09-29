# Claude Design · KFB TOOLBOX / ANIMATION STUDIO · PRODUCTION-06

Status: **REBRIEF · FOUR INDEPENDENT GATES · START WITH G1 ONLY**  
Date: 2026-09-29  
Project: existing Claude Design project **KFB ToolBox Production-05**  
New working copy: **Production-06** — do not overwrite Production-05  
Owner: existing KFB ToolBox / Animation Studio owner  
Stage: none. Normal iteration stays inside Claude Design / local Session Cut.

## 0 · Why the previous brief is superseded

Previous mega-brief:
`skills/chat/workflows/KFB_RESIDENT_UI_COWORKER_CLAY_CITY_2026-09-28/CLAUDE_DESIGN_TOOLBOX_ANIMATION_STUDIO_V5_01.md`
at `c78f6f00439e876958db8149311d7266503f7b59`.

Its source choices are broadly useful, but the execution shape is rejected: A–E combined Library, state player, standard editor, Clay world/Skydome/grounding and multi-actor choreography into one PASS after one design pass + one TUNE. That creates a false choice between a predictable FAIL and a dishonest all-green PASS.

Production-06 keeps the existing ToolBox shell and splits the work into four independently recoverable gates.

**Do G1 only now. Do not begin G2–G4 in the same pass.**

## 1 · Hard project boundary

This is the **ToolBox / Animation Design** Claude project.

It is not:
- World & Tracks;
- Resident Atlas & Scenery;
- WorldBuilder runtime;
- a new Motion Library owner;
- a replacement ToolBox shell.

The parallel Resident project consumes exported contracts later. Do not build Graveyard/Resident navigation here.

## 2 · First action: preserve Production-05

Before changing the project:

1. duplicate the complete current editable Production-05 state as **Production-06**;
2. keep Production-05 unchanged and recoverable;
3. record the Production-05 source/session revision in Production-06 `SOURCE.json`;
4. keep the existing shell/navigation/design unless the current gate explicitly needs a local addition.

No destructive rename or in-place overwrite.

## 3 · Exact source locks

### 3.1 Motion Library v5 + Choreo evidence

Ref:
`95a8197c76c2bae4d12bfc867d54debe15ffc1f2`

Required:
- `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
- `media/3D_Assets/Animations/KFB_Motion_Library/RETURN_INTAKE_05.md`
- `media/3D_Assets/Animations/KFB_Motion_Library/libs/**`
- `media/3D_Assets/Animations/KFB_Motion_Library/sheets/**`
- `skills/chat/workflows/KFB_CHOREO_LAB_01_2026-09-29/CHOREO_LAB_01_RETURN.md`

Catalog facts verified at this ref:
- version `2026-09-29b`;
- **345** unique clips;
- Rig_Medium + Rig_Large;
- seven catalog-driven `locomotionSets`;
- Intake 05 adds 79 clips and its new GLBs are catalogued under `libs/**`.

### 3.2 Intake-05 binary reachability preflight

The GitHub connector resolves all **16 Intake-05 GLB paths** at the exact Motion ref. Some binary files trigger the connector's UTF-8 text-decoder error instead of returning bytes; that is a connector limitation, not a 404/missing-path result.

Therefore Claude may start G1 without asking Georg whether `libs/` exists.

Claude still must prove its own runtime loader can fetch and decode the GLBs before claiming G1 PASS.

### 3.3 H0 / K2 / T3 / Skydome

Use exact ref:
`c78f6f00439e876958db8149311d7266503f7b59`

Verified paths:
- H0: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
- K2: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
- T3: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/`
- Skydome: `travel/travel-v16/terrain-v16/skydome-shader.js`

### 3.4 T4

Exact ref:
`939224c051afb464c553ff6f9b59609503eb1b49`

Path:
`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/`

Do not collapse these refs into one fake pin. `SOURCE.json` must list each donor ref explicitly.

## 4 · Architecture rule for shared components

Do not make Production-06 a giant DC file whose useful parts cannot be consumed elsewhere.

Reusable mechanisms must be independent libs with explicit contracts:

- **G1:** catalog loader / set resolver / state-player library;
- **G2:** standard inline editor library;
- **G3:** shared Clay stage / Diorama adapter library;
- **G4:** choreography player/sequencer library.

The Production-06 shell consumes those libs. Resident Atlas may later consume the exported editor/catalog/choreo contracts without importing the entire ToolBox shell.

"Use donor, do not reimplement" means: preserve donor mechanisms and visible output, then factor/port them into a shared module where needed. It does **not** mean copy-pasting H0/K2 code into the DC shell.

## 5 · G1 · Motion Catalog + Locomotion State Player

### Outcome

Production-06 loads the canonical catalog and can browse/play all 345 clips and the seven locomotion sets without a second hand-maintained motion list.

### Build only

1. **Catalog Loader as a library**
   - canonical input = `KFB_Motion_Library.catalog.json`;
   - resolves library GLB paths from catalog data;
   - no duplicated clip roster in UI source;
   - surfaces source ref/path for diagnostics.

2. **Library View**
   - search;
   - filters for group/tags/rig/loop-one-shot/prop requirement/variant;
   - compact status icons instead of large `PROVEN` labels;
   - large 3D preview;
   - Character/Rig selection.

3. **Seven set views directly from `locomotionSets`**
   - `male_basic`
   - `female_basic`
   - `magic_caster`
   - `drunk`
   - `carry_box`
   - `carry_holding`
   - `wheelbarrow`

4. **State Player as a library**
   - sequence: `idle → start → walk/run → turn → stop`;
   - roles missing in a set stay visibly missing;
   - root speed / visual step length / playback rate stay inspectable rather than silently normalized.

### Keep known defects visible

- `female_left_turn_b` and `female_right_turn_b` do not turn: mark unsuitable; do not default to them.
- `kfb_locomotion_standing_walk_forward_a` is Magic/Caster locomotion, not weapon walk.
- dirty loops/curves/one-shots remain marked.
- Drunk idle transitions remain a known seam.
- required props that are not inside Motion GLBs remain `PROP_REQUIRED` / missing until a real source+socket is supplied.
- no Ground IK claim for Farming knee contact.
- Survivalist / skinning test are not playable clips.

### G1 PASS

G1 passes when:

1. canonical catalog reports 345 clips;
2. every catalog clip resolves to an available library/clip entry or a truthful source failure;
3. all seven `locomotionSets` are generated from catalog data;
4. the five-state sequence can be played for the sets that contain the relevant roles;
5. intake defects above remain visible;
6. no second motion list exists;
7. Production-05 remains unchanged.

### G1 evidence

Return:
- `SOURCE.json` with all exact refs;
- loader/set-player source;
- automated catalog counts;
- resolved vs failed library/clip counts;
- one screenshot of the real Production-06 Library View;
- one screenshot/state trace for a locomotion set;
- `RETURN_G1.md` problems first;
- exactly one next gate: **G2**, not a combined G2–G4 pass.

No separate Georg gate is required if G1 can be evaluated by machine/runtime evidence inside the actual ToolBox.

## 6 · G2 · Standard Inline Editor Library

**HOLD until G1 is complete.**

Outcome: one reusable editor component with one mini-menu, one inspector, no duplicated transform palette.

Library contract includes:
- translate / rotate / scale;
- world/local;
- grid;
- ground/drop;
- focus;
- undo/redo;
- close selection;
- Grid / Connector / Mount snap modes.

Mount may only show `Outside-Fist-Offset` where a measured anchor/host fact exists. Unknown anchor facts stay UNKNOWN; do not invent defaults.

G2 PASS is editor/component behavior only. No Clay world and no choreography required.

Next gate: G3.

## 7 · G3 · Clay Stage + Skydome + Grounding

**HOLD until G2 is complete.**

Outcome: factor the H0/K2/T3/T4 presentation into a reusable shared Clay stage adapter rather than shell copy-paste.

Suggested seam:
`kfb-lib/clay-stage.v1.js`
or an equivalent existing-name seam if the project already owns one.

Requirements:
- source donor samples shown in isolation before integration;
- H0 look grammar;
- K2 material/tool mechanisms;
- T3/T4 scene/particle vocabulary;
- Skydome from the pinned source;
- `off / basic / full` quality;
- one ground/surface height truth for contact + shadow receiver;
- explicit Beauty / Shadow-off / Receiver-contact diagnostics.

Mandatory four set checks:
- `female_basic`
- `magic_caster`
- `drunk`
- one Carry set

G3 PASS concerns the real Clay-Diorama/grounding result, not a generic grey test stage.

Next gate: G4.

## 8 · G4 · Choreography + VFX

**HOLD until G3 is complete.**

CHOREO LAB 01 is source evidence, not a finished player. Its current return explicitly says the gift/argument/brawl results are **storyboards, not animation playback**.

Outcome:
- reusable ChoreographyRecipe/player;
- multi-actor transport;
- Body / Face / Prop / Event / VFX tracks;
- Play / Pause / Scrub / Loop;
- Rig_Medium first; Rig_Large only after measured fit facts exist.

First playable examples:
- gift;
- debate/argument;
- brawl.

Speaker Corner, Card explanation and `Show it / Spin it / Sell it` are **DEFERRED recipe families** until the first three actually play. Do not make them G4 PASS blockers.

Clay VFX consumes the shared event vocabulary; it does not determine gameplay timing.

## 9 · Budget / stop

Each gate gets:
- one implementation pass;
- at most one focused TUNE/repair pass on the same named acceptance blocker.

A later gate cannot be used to hide an earlier failure.

After two failed repair passes on the same gate:
- stop;
- preserve Production-06 candidate;
- export full failure recovery;
- do not start a third visual rewrite.

## 10 · Production-06 return structure

Keep one additive folder/tree inside the Claude project:

- `START_HERE.md`
- `SOURCE.json`
- `CHANGELOG.md`
- `RETURN_G1.md`
- later `RETURN_G2.md`, etc.
- reusable `kfb-lib/**` modules
- tests/evidence per gate

Do not overwrite Production-05.

## Exactly one current next gate

**G1 only: canonical Motion Catalog + seven locomotion-set views + reusable state player in Production-06.**
