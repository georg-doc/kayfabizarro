# KFB ToolBox · Elisa Priority · Stage / Scene Builder Vertical Slice

**Date:** 2026-09-15  
**Status:** CURRENT PRODUCT DIRECTION + IMPLEMENTATION BRIEFING CANDIDATE; implementation must wait for the current Asset Librarian KayKit reference inventory and Georg gate.  
**Purpose:** use Elisa's Birthday scene as the first real vertical product slice that proves Actor → Face → Pose → Motion/Voice → Stage authoring inside the minimal Stage-First ToolBox.

## 0 · Precedence / no silent replacement

This document is additive but intentionally updates the earlier UI direction in one explicit way.

- The minimal Stage-First shell remains accepted as the working UI direction.
- The previous persistent top-level domains `Body · Face · Motion · Voice · Messen` are **superseded for this slice** by the workflow-oriented authoring domains below because Pose and Stage are now first-class product workspaces.
- `Messen` functionality is **not deleted**. Measurement/fit tools move into the contexts where they are actually used (Actor / Pose / Stage) rather than remaining a permanent top-level tab.
- Asset Librarian remains a separate exploration tool and feeds ToolBox through the existing contextual Resource Picker / Library Drawer contract. No second Registry/index.
- This brief does not replace existing rig, voice, animation, Travel world/light/audio or Registry owners.

## 1 · Governing product goal

Build a clean, stage-first **KFB character + scene authoring tool**, not another dashboard.

Use Elisa's Birthday scene as the forcing function. Every capability in this slice must solve a real authoring need for that scene and remain reusable afterward.

The ToolBox should let Georg:

1. build/finish a KFB actor;
2. rig and test the face;
3. pose the actor directly in 3D;
4. preview/apply motion and voice;
5. browse/add props and world assets;
6. compose a reusable 3D scene;
7. save the result as reusable configuration/bundles for Travel/Town/other consumers.

No architecture rabbit hole before this path works end-to-end.

## 2 · One navigation layer

Use one persistent top bar / navigation layer only:

`Actor · Face · Pose · Motion · Voice · Stage`

The stage remains visually dominant in every workspace.

### Actor
- source character;
- body/materials/accessories;
- donor/part pools;
- actor scale / root orientation;
- relevant fit/measurement tools;
- contextual Resource Picker for actors/parts/accessories.

### Face
- EyeRig / pupils / lids / lashes;
- brows including repair of currently defective Block Brows;
- original source-character nose + standard Studio nose pool + later donor noses;
- original source-character mouth + Female Lips + standard Studio mouth pool + later donor mouths;
- same mechanism and parameter order inside each part family;
- viseme/emotion/talk preview;
- dangle/secondary-motion controls for eligible face/ear/accessory parts.

### Pose
- direct 3D posing handles;
- root translation/rotation/scale where appropriate;
- hand/foot contact targets;
- direct bone rotation for selected joints;
- stool/prop/contact calibration;
- save/load pose JSON;
- measurement/fit tools live here where useful.

### Motion
- browse/audition existing clips;
- Play / Pause / Scrub / Stop / Rest;
- pose-over-clip adjustments where technically safe;
- Performance families later consume this same workspace rather than forming a second app.

### Voice
- Talk / viseme test;
- existing Voice/TTS/audio owner;
- bubble owner;
- face-performance test while body pose/motion remains visible.

### Stage
- scene composition;
- actors + props + world assets;
- cameras/views;
- light/environment controls;
- Travel-Dome / TinySkies-derived background/world authoring;
- save/load scene/world bundles.

No second workflow rail. No permanent explanation text. No meta/provenance panels in normal authoring.

## 3 · Asset Librarian gate first

**DECISION:** wait for the current Asset Librarian KayKit reference inventory before broad Stage implementation.

The Librarian should provide:

- Pack / Series relationships;
- demonstrated official KayKit scene combinations;
- character / rig / prop / environment references;
- owned vs reference-only vs missing/paid/unknown;
- source links / Dropbox reference mapping;
- relevant KFB use tags;
- later contextual bundles where evidence is strong.

ToolBox consumes these results through the already-decided Resource Picker / Library Drawer.

Registry/Librarian discovers candidates. ToolBox remains the receiving suitability/compatibility owner.

## 4 · Elisa vertical slice · required authoring outcomes

### Gate A · GothGirl as finished KFB actor

Build GothGirl through the real generic KFB rig path, not GothGirl-specific hardcoding.

Required visual/functional result:

- EyeRig active;
- lashes;
- eyelids;
- dark lid/eyeshadow treatment;
- pupils slightly larger than FrizzleBob's accepted baseline;
- brows including working animation/control for Block Brows;
- nose pool = original GothGirl nose + current standard Studio noses + future donor extension;
- mouth pool = original GothGirl mouth + Female Lips + current Studio mouths + future donor extension;
- every part family uses one shared mechanism/control order;
- viseme + emotion/talk preview;
- existing relevant props/accessories such as microphone/stool/headphones/phone can be browsed and fitted through the shared Resource Picker.

Official KayKit GothGirl demo/reference images are a visual reference for intended character scale, stool/microphone staging and presentation, not a substitute for measured ToolBox rig compatibility.

### Gate B · Hihi / Cube-Pet kitten KFB presentation QA

Check and optimize the Birthday kitten through the existing KFB Cube-Pet presentation owner.

Must include the actual finished KFB face/presentation layer:

- EyeRig;
- mouth/face layer;
- correct scale/readability;
- idle / expression / talk capability where supported;
- no raw-source-model shortcut that bypasses the finished KFB presentation owner.

### Gate C · KISS 3D Pose Editor

Use the Three.js IK example as a technical donor/reference, not as a UI model:

`https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_ik.html`

Relevant proven mechanisms in that example include:

- `OrbitControls`;
- `TransformControls`;
- `CCDIKSolver` / `CCDIKHelper`;
- transform target driving an IK chain;
- disabling OrbitControls while the transform handle is dragged.

P0 KFB Pose Editor should remain small:

1. free Orbit camera;
2. actor root move/rotate where needed;
3. direct selected-bone rotation;
4. hand/foot IK/contact targets where useful;
5. simple pelvis/root/head adjustment;
6. contact calibration against stool/props;
7. reset selected / reset pose;
8. save/load pose JSON.

Do not block P0 on a universal full-body IK system. Prove useful direct manipulation on current KayKit rigs first.

Concrete acceptance case:

`GothGirl + stool + microphone → relaxed seated presenter pose → save → reload → same visible contacts`.

### Gate D · Core Game Asset · Real 3D Theatre Curtain

Build a reusable **KFB Theatre Curtain** as a core game/stage asset, not Birthday-only decoration.

Reference/inspiration:

`https://github.com/mrdoob/three.js/blob/master/examples/webgpu_compute_cloth.html`

The current Three.js example is a Verlet cloth system running in compute shaders and explicitly uses `three.webgpu.js`; it currently contains a `TODO: Fix example with WebGL backend`. Therefore the KFB curtain must not silently assume universal WebGPU support.

#### Visual bar

The curtain must read as an old, heavy, textured 3D theatre curtain:

- two real left/right fabric panels;
- plausible velvet/heavy-fabric material;
- visible fold depth;
- aged/worn texture variation where appropriate;
- weighted lower hem / believable gravity;
- curtain rail/rings/hooks/attachment logic that explains how it hangs and opens;
- real 3D lighting/shadows;
- no flat sheet, blind, paper/cardboard look or physically impossible motion.

#### Required states/API

At minimum:

- `idle` — subtle living fabric motion;
- `open` — panels gather/slide toward their sides from center;
- `close`;
- `impact` — local impulse/ripple response;
- `reset`.

Treat opening as moving/pulling the supported top attachment targets and allowing fabric to gather, not translating one rigid rectangle.

#### Plug-and-play contract

One reusable module/object should expose a compact consumer seam conceptually equivalent to:

`mount / update / setState / impulse / reset / dispose`

Exact API naming remains implementation-owned, but there must be one reusable owner rather than Birthday-specific duplicate curtain code.

#### Runtime strategy

Preferred path:

- WebGPU compute cloth when supported and demonstrably stable.

Required fallback:

- deterministic lower-cost curtain presentation for non-WebGPU consumers (for example authored/skinned/morph/spring-assisted motion) that preserves the same visual states and consumer seam.

Do not downgrade the visual target merely to avoid implementing a fallback.

### Gate E · Free camera + useful views

Stage/Pose must support:

- free Orbit camera;
- Front;
- 3/4 Left / Right;
- Face close-up;
- Full actor;
- Stage wide;
- user-saveable camera/view preset later if cheap.

Camera controls remain small stage affordances, not a permanent footer/dashboard.

### Gate F · Prop / asset browse and placement

Use the contextual Resource Picker / Library Drawer.

In Stage/Pose it should support:

`Browse → Preview → Place/Attach → Transform → Accept/Revert`

At minimum for Elisa:

- stool;
- microphone;
- speaker where desired;
- Birthday D6;
- disco balls;
- Newton cradle;
- lighthouse/world prop if represented as stage/world asset;
- other source-backed Birthday props.

Stage placement needs translation / rotation / scale handles and clean remove/reset.

No second asset database.

### Gate G · KFB Stage / Scene Builder

The new `Stage` workspace is the actual reusable Scene Builder.

It composes:

- one or more finished KFB actors;
- actor poses/motions;
- props;
- curtain/core stage modules;
- cameras;
- lights/environment;
- background/world geometry;
- scene-level interaction/event references where supported.

Birthday is the first acceptance scene, not a bespoke hardcoded consumer.

Required first scene bundle should contain all accepted Birthday actors/rigs/props/world references and be reloadable.

### Gate H · KFB Terraformer & Worldbuilder v1

This lives **inside Stage**, not as another permanent top-level app/navigation band.

Source direction:

- existing TinySkies / Travel Globe terrain/background concepts;
- Travel-Dome-like geometry;
- Georg's forthcoming setup drawing is the spatial reference before hard assumptions about the Birthday/Town world layout.

P0 intent:

- choose/load a world/background preset;
- basic terrain/dome/background shaping controls;
- place environment assets from Resource Picker;
- water/coast/sky/background parameters where existing owners support them;
- camera and light preview in the same scene;
- save/load world preset/bundle.

Do not invent a second Travel renderer or second terrain truth. Reuse/adapt proven donors and contracts.

## 5 · Contextual bundle model

The Asset Librarian/reference-atlas work can feed Stage through reusable evidence-backed bundles. Keep the number of bundle classes small.

Recommended first classes:

- `actor` — finished actor config / rig presentation reference;
- `pose` — bone/IK/contact adjustments;
- `performance` — actor + motion + prop relationship;
- `scene` — actors/props/cameras/lights/module placement;
- `world` — terrain/background/environment preset.

A bundle is a reusable configuration/reference, not a new compatibility authority.

Every saved bundle should distinguish at minimum:

- source asset IDs/refs;
- transform/config data;
- referenced owner/module IDs where required internally;
- status/evidence (`SOURCE FACT / OBSERVED DEMO / TESTED / PROPOSAL / UNRESOLVED`).

Normal UI should not expose raw contract/provenance ballast.

## 6 · Elisa Birthday scene · full-world acceptance target

The vertical slice must be capable of assembling the complete Birthday scene, not a sparse selector/menu.

Minimum identity-bearing inventory remains:

- Uncle FrizzleBob;
- GothGirl as finished KFB actor;
- Hihi Love-Hope as finished KFB Cube-Pet presentation;
- editable GothGirl display name at consumer level;
- Travel/TinySkies-derived sunset/coast/world depth;
- visible lighthouse;
- Birthday D6 with six tracks available;
- three asymmetrical disco balls;
- Newton cradle;
- bounded fireworks/celebration event;
- real theatre curtain;
- source-backed Birthday props/interactions;
- real 3D shadows/lighting;
- visible living idle motion;
- minimal/in-world UI and immediate interaction feedback.

North-star visual/life tests:

1. **Wallpaper test:** would Georg/player willingly use the settled scene as a wallpaper?
2. **Screensaver test:** with no input for 30–60 seconds, is it attractive/alive enough to leave running full-screen?
3. **Interaction test:** does the world invite touching/clicking without dashboard clutter?

Automated green checks never imply these human gates passed.

## 7 · Sequence contract for the Birthday consumer

The authoring tool must be able to produce a scene supporting:

`cold load → immediate Enter/press feedback → loading/audio arm → theatre curtain opens sideways → complete world reveal → camera settle → characters already alive → focus/select/prop interaction → celebration → living rest`

The authoring ToolBox need not own the Travel consumer state machine, but it must export/provide the scene modules/configs needed to realize this accepted sequence.

## 8 · Implementation order / human gates

**Do not build all of this in one autonomous pass.**

### G0 · Asset/reference inventory
Asset Librarian finishes current KayKit Reference Atlas / coverage pass. No ToolBox runtime changes.

### G1 · Actor proof
GothGirl + Hihi finish/presentation in ToolBox. Georg reviews close-up and 3/4 views.

### G2 · Pose proof
Pose editor + stool/microphone acceptance case. Georg manipulates and reloads a saved pose.

### G3 · Curtain proof
Curtain alone in stage: idle/open/close/impact + fallback proof. Georg approves look and physics before scene integration.

### G4 · Stage/Resource proof
Place actor + props through Resource Picker, free camera/views, save/reload scene bundle.

### G5 · World proof
Terraformer/Worldbuilder donor integration, based on accepted Travel/TinySkies source and Georg's setup drawing.

### G6 · Birthday full scene
Assemble all accepted components into one complete world. Prove Wallpaper / Screensaver / Interaction tests.

### G7 · Consumer integration
Only after Georg accepts the ToolBox-built target, integrate/export into the actual Birthday/Travel consumer. Astra/Codex may be used for production integration after the visual/authoring target is approved; do not use expensive autonomous implementation to discover the target again.

No automatic continuation across Georg gates.

## 9 · Model / cost strategy

Use the least expensive capable mode for each phase:

- normal Chat / GPT-5.6 Sol Medium–High: planning, source reconciliation, contracts, briefing;
- Asset Librarian chat + connectors: inventory / mapping / reference atlas;
- Claude Design / Fable: visual LookDev, reconstruction, scene composition, UI/interaction prototype;
- Georg: visual/product gate;
- Codex / Astra / Work: repository integration, multi-step implementation, tests and browser QA **only after the target is sufficiently specified/accepted**.

Hard preflight before expensive agent execution:

- **Coverage:** is every identity-bearing requirement represented?
- **Reference:** is there an accepted visual/donor/reference for visual work?
- **Acceptance:** can the executor know exactly when to stop?

If one is missing, do not start the broad autonomous run.

## 10 · Do not repeat the two 2026-09-15 failures

Reject immediately:

- a feature-list implementation that loses the intended experience;
- raw source GothGirl or raw Hihi standing in for finished KFB actor owners;
- curtain implemented as a falling sheet/blind;
- generic blur/blob contact shadows;
- UI cards/panels replacing the 3D world;
- separate Stage/World/Asset dashboards creating stacked navigation;
- hardcoded mini-rosters replacing the full KayKit pool;
- `code path exists` being treated as visible interaction/animation quality;
- automatic PASS replacing Georg freeplay;
- broad agent swarms before a first meaningful frame/interaction is approved.

## 11 · Current status

- **DECISION:** accept the minimal Stage-First ToolBox design direction as the working shell for now; do not restart broad UI ideation before the Elisa slice.
- **DECISION:** Asset Librarian KayKit reference inventory comes first.
- **DECISION:** KFB Stage / Scene Builder becomes a first-class ToolBox workspace and Elisa Birthday is its first real acceptance scene.
- **DECISION:** GothGirl and Hihi must use finished KFB presentation/rig paths.
- **DECISION:** Theatre Curtain is a reusable core game/stage asset, not Birthday-only code.
- **DECISION:** Resource Picker / Library Drawer is the single in-context asset entry point.
- **DECISION:** Pose editing should reuse Three.js Orbit/Transform/CCDIK patterns where they fit, with a KISS first slice.
- **PROPOSAL:** top-level authoring domains become `Actor · Face · Pose · Motion · Voice · Stage`; measurement/fit functionality moves contextually into those workspaces.
- **PROPOSAL:** `actor / pose / performance / scene / world` as the first compact bundle classes.
- **UNRESOLVED:** exact Travel-Dome/Worldbuilder spatial layout until Georg supplies the setup drawing and current donor code is re-read.
- **IMPLEMENTATION:** none by this document.
- **TESTED RESULT:** Three.js cloth example provides a WebGPU Verlet compute-cloth donor but currently has no finished WebGL backend; Three.js IK example demonstrates OrbitControls + TransformControls + CCDIKSolver/Helper. ToolBox adaptation remains untested.
