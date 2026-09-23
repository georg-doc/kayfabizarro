# Claude Design · KFB ToolBox Fractal Authoring · first consolidation pass

**Execute only after:** WorldBuilder WB1-P0, WB1-P1 and WB1-P2 are green **and** TFA-0 has reconciled the current KFB ToolBox Claude-project export against GitHub.

**Claude project:** use the existing fresh **KFB ToolBox** Claude Design project for this ToolBox authoring slice.

**Do not use the World Design / WhackMan-lighting Claude project as the ToolBox owner.**

The World Design project should remain the Claude context for the actual WorldBuilder/world-lighting lane.

## 1 · First deliverable only

Build **TFA-CD1 · FrizzleBob Nested Authoring Proof**.

Do not build the whole ToolBox consolidation in one pass.

Goal:

> One existing Stage-First 3D working surface lets Georg select FrizzleBob, descend into Head → Face → EyeRig → Brows, edit the real existing owners, save/reload, then return to Actor/Pose without losing the face state.

This is an integration/authoring proof, not a redesign competition.

## 2 · Source truth

Read current GitHub versions of:

1. `tools/KFB-ToolBox/_handover/TOOLBOX_FRACTAL_AUTHORING_POST_WB1_P2_2026-09-23/START_HERE.md`
2. `CURRENT_STATE.md`
3. `FRACTAL_AUTHORING_CONTRACT_v0.json`
4. current ToolBox `START_HERE.md`
5. Stage-First v1 intake brief
6. current `brow-rig.v2.js`
7. current FrizzleBob graft modules
8. current EyeRig v6
9. current minimal Stage-First UI direction

Use the **reconciled TFA-0 export** as the actual editable Stage-First source.

Do not rebuild Stage-First from screenshots or prose.

## 3 · Project routing

There are two Claude Design contexts and they keep different jobs.

### KFB ToolBox Claude project

Owns this slice:

- nested authoring UI;
- Actor / Face / Pose / Motion / Voice / Stage shell;
- EyeRig/brow controls;
- later Legacy actor authoring;
- later shared scene-edit integration.

### World Design Claude project

Owns later WorldBuilder visual authoring:

- WhackMan-derived Environment Profile;
- lighting/fog/local visibility;
- world composition;
- Surface Adapter consumer;
- WorldBuilder visual editing.

Shared seams connect them.

Do not combine the two Claude projects into one giant context.

## 4 · Keep the accepted Stage-First language

Default working surface:

- one top bar;
- dominant 3D stage;
- one context palette;
- no explanation wall;
- no permanent provenance panel;
- no stacked workflow headers;
- no giant scene-tree sidebar.

The existing Stage-First shell is the donor.

Do not replace it with a generic DCC/editor UI.

## 5 · Fractal selection model

Add a compact semantic breadcrumb over/inside the stage.

Example:

`Stage / FrizzleBob / Head / Face / EyeRig / Brows`

Rules:

- breadcrumb shows **edit scope**, not filesystem hierarchy;
- selecting a parent changes the active owner/palette;
- `Back` / breadcrumb click exits to parent;
- no permanent tree is required;
- the 3D scene remains visually dominant.

### Scope behavior

#### Actor

- actor/source identity;
- actor-level visibility/profile;
- body root selection.

#### Head / Graft

- current graft/head owner;
- no loose-prop treatment of identity grafts.

#### Face

Compact subgroups:

- Eyes
- Brows
- Nose
- Mouth
- Moustache where present

Do not add each as a top-level global tab.

#### EyeRig

Use existing EyeRig v6 controls.

Do not fork the runtime.

#### Brows

Use existing `brow-rig.v2.js`.

Do not draw a new eyebrow system.

## 6 · Brow controls · first user-visible requirement

Georg's current issue:

> changing eyebrow size/width makes the brows visually wander inward/outward instead of remaining properly registered to the eyes.

First expose the current real brow fields with human-readable labels.

Suggested mapping:

| UI | Existing field |
|---|---|
| Width | `length` |
| Inner gap | `mask` |
| Thickness | `thickness` |
| Height | `height` |
| Horizontal position | `x` |
| Vertical offset | `y` |
| Tilt L / R | `tiltLeft / tiltRight` |
| Arch L / R | `bendLeft / bendRight` |
| Follow head | `follow` |
| Depth / lift | `lift` |

Also retain existing reset/preset behavior.

### TFA-BROW-01 visual gate

Test FrizzleBob in:

- Front;
- 3/4 left;
- 3/4 right.

Stress:

- narrow Width;
- default Width;
- wide Width.

Acceptance:

1. changing Width does not unintentionally shift each brow's perceived centre away from the corresponding eye;
2. Inner gap can be changed without using Width as a substitute;
3. vertical/horizontal offsets are independently controllable;
4. brow remains attached to the real EyeRig/FaceHost frame;
5. save/reload preserves the exact result.

### If current owner fails the gate

Do not compensate in UI with magic offsets.

Measure the cause.

If the single pair-wide geometry model is the actual blocker, make a **small extension to the same `brow-rig.v2` owner**:

`per-eye-centred width / explicit spacing mode`

Concept:

- left brow has a stable centre derived from left eye;
- right brow has a stable centre derived from right eye;
- Width scales around those centres;
- spacing/gap remains a separate control.

No second brow renderer/module.

## 7 · EyeRig controls

Expose only existing supported semantics.

Useful first groups:

### Geometry
- eye width/height/depth where current owner supports;
- spacing/anchor;
- inset;
- splay.

### Pupil / gaze
- pupil size/style;
- pointer/follow;
- fixed/front target;
- life/wander/tremor.

### Lids / expression
- upper/lower lids;
- slant;
- neutral/happy/angry/sad/surprised/thinking;
- Blink now.

### Lashes

Only if current EyeRig owner supports them cleanly.
Do not block TFA-CD1 on lashes.

## 8 · 3D group behavior

The user should feel that nested authoring scopes are real groups, but do not destructively reparent source objects just to create the illusion.

Use semantic wrappers/adapters when needed.

Expected behavior:

- Actor/body can be selected as one scope;
- Head/Graft as a child scope;
- Face as child scope;
- EyeRig/Brows as child scopes;
- exiting back to Actor preserves face edits;
- actor motion does not create a second EyeRig/mixer owner.

## 9 · Save / export behavior

TFA-CD1 must preserve owner-separated state.

Do not create one flattened mega-JSON.

Required:

- existing actor/profile source refs retained;
- EyeRig profile saved through EyeRig/profile owner;
- brow params saved through the current face/actor profile path;
- Stage/scene transform, if touched, remains separate.

Export/import must restore the same visible FrizzleBob state.

## 10 · Resource Picker

Do not embed full Asset Librarian.

Keep one contextual `Browse…` affordance.

For TFA-CD1 it only needs enough to prove:

- current FrizzleBob actor source remains selectable/recoverable;
- existing source identity is visible behind optional Info;
- normal Face editing does not show provenance clutter.

No new asset index.

## 11 · No Legacy in first Claude pass

Legacy is the second consolidation gate.

Current Legacy EyeRig work exists as a stacked Draft PR and must be reconciled first.

Do not spend TFA-CD1 tokens adapting 17 Legacy heads.

After TFA-CD1 human acceptance:

**TFA-CD2** loads one Legacy actor through the same Face UI and proves that no separate Legacy editor is needed.

## 12 · No Scene Builder in first Claude pass

The shared in-scene editor contract is the later parent layer.

After FrizzleBob nested authoring and one Legacy actor work:

**TFA-CD3** proves:

`Scene → Actor → Head → Face`

with `kfb.scene-patch.v1` kept separate from face profiles.

Do not build generic scene hierarchy UI in TFA-CD1.

## 13 · No WorldBuilder implementation in this ToolBox pass

WorldBuilder has its own project/context.

After TFA-CD3:

- ToolBox can expose the selected Actor/Scene authoring seam;
- WorldBuilder consumes it as a child/source-object editor;
- Environment Profile / surface / nav remain WorldBuilder-owned.

Do not move WhackMan lighting controls into Face/Actor ToolBox.

## 14 · Later arbitrary-object EyeRig

Georg wants eventually to drop in an arbitrary object such as a car and give it KFB eyes.

That is a good later ToolBox feature.

Do it only after character/Legacy proof.

Preferred first contract:

`Manual FaceHost`

Flow:

1. select real object;
2. choose/mark its front/face plane;
3. place FaceFrame;
4. mount existing EyeRig v6;
5. tune/save host profile.

No automatic AI eye placement in the first pass.

## 15 · TFA-CD1 acceptance checklist

TFA-CD1 passes only if:

- real reconciled Stage-First source is used;
- FrizzleBob/Graft is the real existing donor;
- one top bar remains;
- stage remains dominant;
- breadcrumb can enter/exit Actor → Head → Face → EyeRig/Brows;
- EyeRig v6 is reused;
- `brow-rig.v2.js` is reused;
- Width/gap/position controls are real, not decorative UI;
- brow stress test is visibly acceptable or the exact owner-level blocker is documented;
- Face state survives Actor/Pose context switching;
- export/import restores the same visible state;
- no second Registry, EyeRig, brow runtime, scene graph or World owner appears.

## 16 · Immediate fail conditions

Stop rather than patch around:

- placeholder actor or fake FrizzleBob reconstruction;
- screenshots used instead of actual source;
- generic Three.js editor replacing Stage-First;
- a second EyeRig implementation;
- a second brow implementation;
- nested panels/cards overwhelming the 3D stage;
- WorldBuilder/environment controls added to this first Face proof;
- Legacy forced into the first pass;
- saving face values only in anonymous local UI state.

## 17 · Deliverable

Return a complete editable Session Cut / export with:

- exact source base;
- changed files;
- TFA-CD1 implementation;
- FrizzleBob Front + 3/4 screenshots;
- brow narrow/default/wide evidence;
- export/import evidence;
- unresolved owner-level issues;
- no claim of public Stage.

Web/GitHub rehomes and tests the export afterward.

## 18 · One next gate

**TFA-CD1 human visual review.**

Only after Georg accepts the nested FrizzleBob Face/EyeRig/Brow experience should Claude continue to TFA-CD2 Legacy integration.
