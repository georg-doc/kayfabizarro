# KFB ToolBox · Claude Design / Fable · First Mega Slice to High-Value Georg Gate

**Date:** 2026-09-15  
**Status:** CURRENT DESIGN / LOOKDEV / INTERACTION BRIEF · no production-runtime merge implied  
**Primary goal:** prove a high-value KFB Stage / Scene / World authoring experience by building the first real Start Zone directly inside it, then STOP for Georg approval before broader implementation/integration.

## 0 · Read first / source hierarchy

Before building, read current ToolBox direction and do a silent red-team pass:

1. `tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md`
2. `tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/ASSET_LIBRARIAN_INTEGRATION_2026-09-15.md`
3. `tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/START_HERE.md`
4. `tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/CARTOON_DEFORMER_AND_RENDER_LOOK_ADDENDUM_2026-09-15.md`
5. `tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/SCENE_WORLD_EDITOR_REFERENCE_2026-09-15.md`
6. KayKit Reference Atlas package on `chat/kaykit-reference-atlas-2026-09-15`, head `89acd27ee7981d20bf196768bed7011b306011da`, under `tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`.
7. Local/Dropbox KayKit reference folder where available: `KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos`.
8. Visual style studies: `georg-doc/KFB-Stunt-Car-Race/_inbox/BG CARTOON ASSETS Midjourney GvW/`.
9. Three.js direct manipulation donor: `webgl_animation_skinning_ik.html`.
10. Three.js cloth donor/reference: `webgpu_compute_cloth.html`.

Do not treat historical failed Birthday/Astra composition as a visual target. Do not treat Carl/Pilot as the ToolBox UX model.

## 1 · Silent red-team before any implementation

Do a short internal critique, not a large agent swarm.

Answer before building:

- What could a competent literal executor omit and still falsely claim this slice works?
- What would make the editor technically functional but visually generic?
- What would make the world look like sterile KayKit placement rather than KFB?
- What could make the Start Zone impossible to extend into Elisa Birthday / Town / Travel later?
- What controls are actually needed for Georg to author directly after this slice, and which are ballast?
- Which source-backed scene/demo relationships should be reused instead of guessed?

Repair the build plan silently. Do not stop Georg for planning approval.

## 2 · Product promise

Build the first convincing **KFB Stage / Scene / World Editor** as a usable creative surface, not a dashboard.

The editor must already contain a real Start Zone composition so the first high-value review answers two questions at once:

1. Is this the right authoring tool?
2. Is this the right spatial/rendering direction for the world we are about to build?

After Georg accepts this gate, he should be able to continue composing the Start Zone directly instead of waiting for another abstract implementation cycle.

## 3 · One UI model

One persistent navigation layer only:

`Actor · Face · Pose · Motion · Voice · Stage`

For this slice, work primarily in `Stage`.

Stage is viewport-first. The 3D world is the workspace.

Normal loop:

`Browse → place → select → move/rotate/scale/deform → orbit/reframe → duplicate/variant → save/reload`

No card dashboard over the world. No permanent prose. No source-path/provenance panels in normal use.

A small Scene Tree is allowed as an optional compact helper, synchronized with viewport selection. It must never visually dominate the Stage.

## 4 · Mega Slice A · Authoring surface + real Start Zone seed

Do NOT make a toy cube demo. Prove the editor on the real KFB Start Zone seed.

### A1 · Viewport / camera

Required:

- free Orbit camera;
- smooth pan/zoom;
- front / 3⁄4 / wide / top-ish planning view presets where useful;
- compact `Skewed Cartoon Perspective` camera controls;
- close-to-wide transition without losing selection/context;
- camera controls never become a large dashboard.

### A2 · Selection / transform

Required:

- click object in viewport;
- clear outline/selection feedback;
- Translate / Rotate / Scale handles;
- duplicate;
- delete/remove;
- reset transform;
- local/world transform mode if useful;
- Orbit disabled while dragging transform handles.

Use Three.js TransformControls / IK example patterns as technical donors, not as visual UI templates.

### A3 · Cartoon Deformer

For selected static props, provide non-destructive modifiers:

- Bend;
- Skew/Shear;
- Taper;
- Squash/Stretch;
- Twist;
- optional Bulge/Pinch only if cheap and stable;
- pivot/falloff where required.

First visible QA props: GothGirl speaker pair or equivalent duplicated prop pair. They must read as related but deliberately asymmetric, not cloned rigid blocks.

Store deformation as config/modifier data; never destroy the Registry/source asset.

### A4 · Resource Picker

Use one contextual Asset Librarian / Registry-backed picker:

`Browse → Preview → Place → Transform → Accept/Revert`

For this slice, prove at least:

- building;
- tree/nature;
- rock;
- fence/road/path element;
- prop;
- light/emissive prop;
- hero world landmark candidate.

Do not create a second asset database.

### A5 · Save / reload

A Start Zone scene bundle must survive reload with:

- asset identity;
- transforms;
- deformer values;
- camera/view state where appropriate;
- world/terrain settings;
- lighting/environment preset;
- scene variant selection.

## 5 · Mega Slice B · KFB Terraformer & Worldbuilder v1 inside Stage

This is not a separate app. It is a Stage context/mode.

Use the existing Travel / TinySkies / Travel-Dome direction as donor/reference. Do not invent a second renderer or second world truth.

### B1 · Terrain/world structure

The first Start Zone must already establish a coherent terrain composition with enough spatial logic to host later Town/Travel/Birthday content.

Hard requirements for the first accepted composition:

- readable terrain plate / rolling landscape rather than a flat generic floor;
- coast/water relationship where consistent with current Travel/Town direction;
- clear foreground / midground / background depth;
- a **lighthouse planned as part of the terrain/world composition**, not pasted in later as an isolated prop;
- a clearly reserved/usable Birthday/event area integrated into the same world, not a separate menu/stage floating outside it;
- path/approach/readable movement logic between important areas;
- enough negative space for actors, props, event dressing and future expansion.

Do not hard-code unexplained Town geography if source/Georg drawing has not fixed it. Spatial assumptions that are not source-backed remain visibly provisional.

### B2 · World dressing grammar

Use KayKit official demo/reference combinations as composition evidence where available:

- buildings + paths + fences + lanterns + trees + rocks;
- clustered props rather than random scatter;
- repeated asset families with controlled scale/rotation/deformation variation;
- authored composition over procedural noise.

The goal is to make the editor understand useful scene assemblies, not only isolated assets.

### B3 · Rainbow / atmospheric identity

Integrate KFB atmospheric motifs as real world elements:

- rainbow(s) placed compositionally in depth, not pasted as 2D UI decoration;
- soft atmospheric depth/haze where useful;
- 3D cartoon clouds moving through the world;
- cloud shapes must be readable, chunky/cartoon/clay-like and spatial, not generic particle fog;
- clouds may drift slowly across camera/world space and may cast/receive subtle lighting cues where feasible;
- motion must be calm enough for the Screensaver Test.

Avoid constant spectacle. The world should breathe.

### B4 · Scene variants

Prove shared geometry with at least three scene/environment variants:

- `Authoring / Neutral`;
- `Birthday Sunset`;
- `Night / Disco`.

Variants should primarily change environment/light/sky/emissives/FX/camera mood, not duplicate the whole scene graph.

## 6 · Render look · mandatory visual target

Astra's failed Birthday look is explicitly rejected as visual precedent.

Target:

> **cozy / claymation substrate + KFB skew / asymmetry / cartoon deformation**

Required qualities:

- soft broad key light;
- warm/cool fill relationship;
- real soft cast/contact shadows;
- believable grounding/AO feel;
- matte / high-roughness clay/painted material response;
- restrained metalness except on actual metal;
- subtle surface/material variation;
- atmospheric depth;
- restrained grading only after materials/lights work;
- asymmetrical staging;
- selective skew/bend/deformation;
- varied scale/orientation;
- no sterile grid-perfect placement;
- no blanket random distortion.

Use the Midjourney BG studies as visual direction for cartoon world language, but do not claim exact asset reconstruction from them unless visually measured.

## 7 · Birthday is part of the world from the beginning

Do **not** build a separate Birthday selector scene and later try to bolt it onto the terrain.

For this first mega slice, the Start Zone world must already make spatial room for the Birthday experience.

Plan the following as integrated scene/world anchors even if some final assets arrive later:

- Birthday/event clearing/stage area;
- lighthouse as world landmark;
- curtain/reveal location or approach relationship;
- performance/character area with enough room for Uncle FrizzleBob, GothGirl and Hihi;
- prop/event positions for Birthday D6, disco balls, Newton cradle, speakers and later fireworks;
- camera reveal path / hero composition;
- surrounding terrain/background so the event reads as part of a larger living world.

The Birthday event is an event layer of the Start Zone, not a detached menu.

## 8 · Character usage at this gate

Do not block the world/editor proof on final actor rigging.

If finished GothGirl/Hihi presentation is not yet available, use clear scale/reference stand-ins **only as spatial references** and mark them as placeholders.

Do not let raw source GothGirl/Hihi accidentally become accepted visual actors.

Final Actor/Face/Pose proof remains a separate later gate.

## 9 · Core curtain consideration

The real 3D theatre curtain remains a required reusable Core Game Asset, but do not let full cloth engineering block this first Stage/World high-value gate.

For this gate:

- reserve/integrate its location and reveal geometry in the world;
- use a clearly marked curtain placeholder only if the accepted reusable module is not ready;
- do not fake a falling sheet/blind and call it done.

Curtain visual/physics acceptance is its own later module gate.

## 10 · First high-value Georg gate

After Mega Slice A+B, STOP.

Do not continue into broad Actor rigging, final Birthday event logic or production Travel integration without explicit Georg acceptance.

### Evidence to return

Return exactly enough evidence to judge the real product:

1. one full-screen 1440×900-ish Stage frame showing the Start Zone in `Birthday Sunset`;
2. one wide/world composition view showing terrain + lighthouse + Birthday/event zone relationship;
3. one close viewport capture showing direct asset select → transform → Cartoon Deformer;
4. one short 15–30s capture showing Orbit → select/move/deform → variant switch → moving 3D clouds;
5. one save/reload proof for the scene bundle;
6. one compact `WHAT IS PLACEHOLDER / WHAT IS REAL` list.

No giant QA report in the UI. Technical evidence may be a short sidecar document.

### Acceptance questions

Georg should be able to answer:

- **Tool:** Would I actually want to build the Start Zone in this editor?
- **World:** Is this the spatial/rendering direction for KFB?
- **Wallpaper:** Is the settled composition attractive enough to keep on screen?
- **Screensaver:** With no input for 30–60 seconds, do clouds/light/world motion make it feel alive without becoming noisy?
- **Extendability:** Can Birthday, Town and later Travel content grow naturally from this world rather than being bolted on?

Decision choices only:

`ACCEPT · REPAIR · REJECT DIRECTION`

On ACCEPT: Georg may continue direct Start Zone authoring and the next module/actor gates can proceed.

On REPAIR/REJECT: stay inside this gate. No expensive downstream implementation.

## 11 · Explicit non-goals for this first high-value gate

Do not attempt yet:

- full universal KayKit Frankensteining;
- all Performance Suite families;
- final Cloth/WebGPU curtain implementation;
- complete Travel consumer integration;
- final Birthday state machine/audio implementation;
- universal full-body IK;
- complete Town geography without source/drawing support;
- giant autonomous architecture refactor;
- Blender migration.

## 12 · Blender / MCP fallback · DEFERRED EXPERIMENT

**PROPOSAL / DEFERRED:** If browser/Three.js authoring repeatedly fails on precision modelling, deformation, cloth, rigging, UV/material work or export reliability, install Blender locally and test a controlled Blender automation path through an MCP-capable agent environment (Claude/Work or equivalent).

Why it is a credible fallback:

- mature mesh/deformer/modifier stack;
- rig/pose/IK tooling;
- cloth simulation;
- UV/material authoring;
- reliable GLTF/GLB export;
- can produce source-controlled reusable assets for the browser runtime.

Why not switch now:

- adds another tool/runtime/automation boundary;
- local MCP setup/debug may consume time before producing visible value;
- creates risk of solving DCC automation instead of Elisa/Start Zone;
- browser ToolBox still needs a usable authoring experience even if Blender becomes an asset-production backend.

Trigger for a Blender experiment:

> only after a concrete browser authoring task fails twice for the same structural reason, and the expected Blender result is clearly defined.

Blender may become an offline precision workshop / asset compiler. It must not silently replace the ToolBox consumer/editor contract.

## 13 · Model / cost rule

Use Fable/Claude Design for this visual/interaction mega slice because the task is primarily world composition, visual target and authoring UX.

Do not spend Astra/Work on broad production integration before this Georg gate passes.

Astra/Codex later receives the accepted visual/interaction target plus source/owner constraints and implements/integrates it into the production repo/runtime.

## 14 · Status

- **DECISION:** first high-value Stage gate uses a real KFB Start Zone seed, not a toy demo.
- **DECISION:** Birthday is spatially planned inside the Start Zone from the beginning.
- **DECISION:** lighthouse, terrain relationship, rainbow/atmosphere and moving 3D cartoon clouds belong to the world composition target.
- **DECISION:** editor is viewport-first and must support direct transform + Cartoon Deformer + Resource Picker + save/reload.
- **DECISION:** cozy/claymation + KFB skew/asymmetry is the visual target.
- **DECISION:** stop after the first high-value Georg gate; no automatic continuation.
- **PROPOSAL / DEFERRED:** Blender + MCP as precision fallback if browser tooling structurally fails later.
- **IMPLEMENTATION:** none claimed by this briefing.
- **TESTED RESULT:** none for this new mega slice yet.
