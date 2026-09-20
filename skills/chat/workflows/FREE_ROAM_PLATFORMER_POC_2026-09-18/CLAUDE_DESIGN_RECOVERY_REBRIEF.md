# Claude Design Recovery Rebrief · KFB Free Roam Platformer Hub

> **CURRENT RECOVERY OVERRIDE · 2026-09-19:** After the reported third Quaternius/Platformer/Hex kit failure, do not start another world/generator rebuild from this candidate. First read [the current post-mortem](POSTMORTEM_CLAUDE_DESIGN_QUATERNIUS_HEX_2026-09-19.md), apply [the shared full-export template](../../templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md), and return a complete editable failure-recovery export. Resume only at the single measured three-part connection gate.

**Date:** 2026-09-18  
**Status:** CURRENT RECOVERY / REBUILD ORDER  
**Previous candidate:** STRUCTURAL / VISUAL FAIL, salvageable source only  
**Audio:** OUT OF SCOPE FOR THIS RECOVERY PASS

## 0 · Stop polishing the current Project Island

The current screenshot demonstrates a useful boot/camera/UI proof, but the **world assembly is rejected as a platform-kit reconstruction**.

Observed problems:
- islands are too small for the intended movement lab;
- modular pieces read as disconnected/open stacks rather than deliberately assembled terrain;
- multiple assets appear to float or sit without a convincing measured support relationship;
- the scene does not visibly follow the construction language shown in the pack previews;
- project labels were added before the platform grammar was understood.

Do not keep nudging individual meshes until the screenshot looks less wrong.

Preserve useful code:
- viewer;
- orbit camera;
- actor loading;
- UI shell;
- movement state plumbing if sound.

Rebuild the world assembly from measured source truth.

## 1 · Mandatory read order

1. `PLATFORMER_KIT_MENTAL_MODEL.md`
2. source pack `Preview.jpg` and `Preview2.jpg`
3. existing KFB process references:
   - `tools/world_atlas/source/KayKit_Hex_Tile_Model_S12.html`
   - `tools/world_atlas/source/KayKit_Dungeon_Model_S13.html`
   - `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
   - `tools/world_atlas/source/tools/measure-hex.html`
   - `tools/world_atlas/source/tools/probe-dungeon-parts.html`
4. original `CLAUDE_DESIGN_BRIEF.md`

The mental-model document and this rebrief override the earlier instruction to proceed directly to a complete Project Island.

## 2 · Hard build order

### GATE A · Asset Atlas S0

Build `Platformer_Kit_Atlas_S0.html`.

List/render/measure every GLTF.

No new Project Island composition before this page exists.

Must expose:
- exact path;
- family;
- size/min/max;
- pivot;
- ground/support facts;
- thumbnails;
- axes;
- platform edge/join role.

### GATE B · Preview Reconstruction S1

Build `Platformer_Preview_Reconstruction_S1.html`.

Use the actual two reference JPGs from the source pack.

Reconstruct Preview 1 first, then Preview 2.

This stage has:
- no project labels;
- no portals;
- no Resident Atlas;
- no BOX1 references;
- no decorative replacement assets;
- no game progression.

It exists solely to prove that the modular kit can be assembled correctly.

Do not claim pixel-identical reconstruction because only reference images, not the original scene transforms/camera, are available. Aim for faithful construction and visual logic.

### GATE C · Platform Grammar S2

Convert the measured facts into:
- module grammar JSON;
- closed platform/island builder;
- support/landing bounds;
- deterministic scene recipe;
- independent seam/contact tests.

Then build **larger islands using the same grammar**, not scaled-up preview meshes.

### GATE D · Movement Lab S3

Only now reconnect gameplay.

Default proof actor = Platformer Character.

Required:
- Idle;
- Walk;
- Run;
- Duck/Dip;
- Jump;
- Jump_Idle / airborne;
- Jump_Land;
- real grounded contact;
- one movement owner;
- orbit camera.

Then add:
- Easy / Fluid / Fun assisted traversal;
- optional double jump;
- manual KFB Game mode;
- manual clip diagnostics.

### GATE E · KFB actor adapters S4

After default character works:
- one ordinary KayKit/Resident biped;
- FrizzleBob via existing public Graft embed;
- CapsuleCarl via existing Carl reader.

Every actor has measured `footOffset`.

Do not fix floating by individually hand-tuning scene Y values.

### GATE F · Project Island / Hub S5

Only after the platform grammar + movement gates:
- larger project islands;
- project labels;
- portals;
- residents;
- pickups;
- hub navigation.

The current Hub concept may be reused, but the rejected island geometry may not become the foundation.

## 3 · Easy / Fluid / Fun mode

This is now the primary gameplay design target for the first useful POC.

The mode should feel like:

> “I point/move toward a plausible destination and the game helps turn that intent into a satisfying animated platform jump.”

Not:
- autoplay;
- teleportation;
- guaranteed arbitrary jumps.

### Camera-relative movement

For Easy mode default:
- WASD camera-relative;
- Shift faster;
- C/Ctrl Duck/Dip;
- Space jump;
- Space once in air = optional double jump;
- free LMB orbit;
- wheel zoom;
- F recenter.

Keep the earlier Travel-style preset as a selectable alternate.

### Target heuristic

Candidate platform score includes:
- forward/facing cone;
- horizontal gap;
- height delta;
- current speed;
- jump profile;
- obstacle clearance.

Highlight the best target subtly.

### Assisted arc

Use the real physical/movement arc with bounded corrections.

Allowed assists:
- generous coyote time;
- jump buffer;
- mild takeoff heading correction;
- bounded air steering;
- near-target landing magnet;
- rescue after fall.

Not allowed:
- mid-flight hard snap across a large gap;
- invisible support bridge;
- forcing land before real contact.

### Double jump

First POC:
- at most one extra jump;
- actual second vertical/horizontal impulse;
- no new invented animation;
- reuse supported Jump presentation if needed;
- preserve AIRBORNE → LAND contact truth.

## 4 · Animation / clamp requirements

Do not build movement clip by clip with disconnected UI triggers.

Semantic locomotion controller first:

```text
IDLE
MOVE_SLOW
MOVE_FAST
DUCK
TAKEOFF
AIRBORNE
DOUBLE_JUMP
LAND
HIT
EMOTE
```

Actor adapter maps semantic state to real clip/procedural presentation.

All thresholds live in a config file, not scattered magic numbers.

Required config groups:

```text
ground
air
jump
doubleJump
assist
landing
camera
actorProfile
```

Transitions:
- crossfade, do not hard cut;
- LAND triggered by actual contact;
- RUN based on measured movement speed / intent;
- DUCK/Dip returns cleanly to locomotion;
- actor switch disposes old mixer/listeners;
- no duplicate RAF owner.

## 5 · Grounding / collision rules

This is a mandatory recovery item.

- resolve floors/support before wall/obstacle response when relevant;
- actor support comes from verified walkable surfaces;
- platform landing volume derives from platform assembly, not decorative mesh AABB;
- feet offset comes from actor adapter;
- no actor may hover because its model origin is above/below feet;
- no hidden giant floor to make broken islands playable;
- falling below rescue threshold returns to last verified safe platform.

Provide a LAB toggle:
- support surfaces;
- landing bounds;
- actor foot point;
- collision capsule;
- platform node id.

## 6 · Visual reference before expansion

The two Pack Preview JPGs must remain available inside the LAB/reference workflow.

At least one screenshot in `docs/TEST_REPORT.md` should show:
- source Preview;
- reconstructed scene;
- same broad camera direction.

Do not omit this because the final hub needs larger islands.

The preview reconstruction is the evidence that the kit was actually understood.

## 7 · Audio freeze

**Do not work on audio in this recovery pass.**

No new:
- AudioContext;
- music;
- ambient loop;
- SFX engine;
- autoplay;
- audio UI.

If current project code contains optional sounds, default them OFF and ensure they cannot block boot.

Audio is a later independent integration.

## 8 · Export / recovery

Final ZIP remains lean.

Required additional files:

```text
docs/
  PLATFORMER_KIT_MENTAL_MODEL.md
  ASSET_ATLAS_REPORT.md
  PREVIEW_RECONSTRUCTION.md
  MOVEMENT_MODEL.md
  TEST_REPORT.md
  KNOWN_ISSUES.md
  RECOVERY.md

data/
  platformer-module-grammar.json
  actor-adapters.json
  movement-config.json
  preview-reconstruction-1.json
  preview-reconstruction-2.json
```

Include source code for:
- Asset Atlas;
- Preview Reconstruction;
- Project Island candidate;
- movement/controller;
- tests.

Do not copy GitHub model packs into ZIP.

## 9 · Required test report

### Asset truth
- all source GLTF entries inventoried;
- all required preview reconstruction assets load;
- measured platform grid facts reported.

### Reconstruction
- Preview 1 reference-guided rebuild;
- Preview 2 reference-guided rebuild;
- seam/support tests;
- no unexplained floating modules.

### Default actor
- 20 seconds idle/movement;
- slow/fast transition;
- Duck/Dip;
- 10 normal jumps;
- 10 assisted jumps;
- 5 double jumps if enabled;
- 10 landings with actual contact;
- fall/rescue.

### Camera
- orbit while idle;
- orbit while moving;
- orbit while airborne;
- zoom;
- recenter.

### Mode
- Easy→Game→Easy without reload;
- assist state clears on switch.

### Actor adapters
- only after default actor gate;
- test actual binding;
- report NOT_TESTED rather than infer.

### Narrow viewport
- stage remains usable;
- panels mutually exclusive;
- gameplay not covered by diagnostics.

## 10 · Return format

Return:

`SOURCE | FAILURE ANALYSIS | MENTAL MODEL | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`

The previous current-island composition should be reported as:

`ARCHIVED FAILED COMPOSITION / code donors retained`

not as an accepted visual baseline.
