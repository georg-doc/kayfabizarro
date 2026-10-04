# KFB ToolBox · Scene / World Editor Reference · 2026-09-15

**Status:** DECISION / VISUAL-INTERACTION REFERENCE  
**Scope:** Stage workspace / KFB Stage / Terraformer & Worldbuilder v1  
**Source direction:** Georg's screenshots from Kay Lousberg / KayKit update demos, especially the Village Exterior work-in-progress scene editor.

## 1 · Product reading

The intended KFB Scene / World Editor should feel like a compact visual 3D level editor / diorama builder, not a settings dashboard.

The two provided KayKit references establish the interaction model more clearly than the earlier abstract Stage description:

- the 3D viewport is the dominant working surface;
- the user edits the actual world directly in the viewport;
- selected objects show an outline / direct manipulation affordance;
- transform handles operate directly on the selected prop/world element;
- the same scene can be viewed close-up for object work and zoomed/orbited out for whole-diorama composition;
- scene/environment variants such as default/day/night should be easy to switch without creating separate apps;
- terrain, buildings, fences, flags, foliage, rocks, paths and props are composed as one coherent world, not through isolated cards;
- preview/pilot/live-view behavior should be available without leaving the authoring context.

## 2 · Hard UX implication

`Stage` is a viewport-first editor.

Normal layout:

- one compact global navigation row;
- large 3D viewport consuming most of the screen;
- one context palette / inspector only when needed;
- optional scene hierarchy / resource drawer as temporary or pinnable secondary UI;
- no permanent dashboard of cards;
- no explanatory prose in the normal editing surface.

The world itself is the UI.

## 3 · Direct-manipulation grammar

Primary edit loop:

`select object in world → outline/highlight → move / rotate / scale / deform / inspect → accept/revert`

For world construction:

`Browse Resource Picker → place asset into scene → transform in viewport → duplicate / vary / delete → save scene`

For terrain/world work:

`select world/terrain context → shape/paint/place environment elements → orbit/preview → save world preset`

Do not force the user through a form before an object can be placed.

## 4 · Camera / views

Required Stage camera behavior:

- free Orbit camera;
- smooth zoom / pan / orbit;
- close object-edit view;
- whole-scene / diorama view;
- Front / 3/4 / Stage Wide presets where useful;
- optional saved camera views later;
- selected object can become temporary orbit/focus target.

The first KayKit reference shows a useful close-up authoring state; the second shows the same kind of world as a composed overview. KFB should support this continuous scale of work in one viewport.

## 5 · Scene variants

The reference UI visibly uses multiple scene states such as `Scene_Default`, `Scene_Daytime`, `Scene_Nighttime`.

KFB direction:

- support lightweight scene/world variants or presets;
- variants may override lighting, sky/environment, selected materials/emissives, FX and camera, while sharing base scene geometry where practical;
- do not duplicate whole scenes unnecessarily;
- first Elisa slice can use e.g. `Authoring`, `Birthday Sunset`, `Night/Disco` variants if useful.

This remains PROPOSAL at data-contract level until implementation proves the simplest viable representation.

## 6 · Scene hierarchy

A compact scene tree/hierarchy may be useful, but it must not dominate the UI.

Possible logical groups:

- World / Terrain
- Buildings
- Props
- Actors
- Lights
- FX
- Core Modules (e.g. Theatre Curtain)

Selecting in tree or viewport selects the same object. Tree is support UI, not the primary editing surface.

## 7 · Asset placement / Resource Picker

Reuse the existing Asset Librarian → contextual Resource Picker contract.

Stage flow:

`Browse → Preview → Place → Transform / Cartoon Deform → Accept/Revert`

Useful affordances later:

- duplicate;
- snap to ground;
- align to surface;
- multi-select;
- simple group/parent;
- favourites/recent;
- same-pack / official-demo-combo suggestions from KayKit Reference Atlas.

Do not create a second asset database.

## 8 · KFB Cartoon Deformer integration

Selected static props may expose non-destructive modifiers directly in the same viewport:

- Bend
- Skew / Shear
- Taper
- Squash / Stretch
- Twist
- optional Bulge / Pinch

Direct handles should use the same interaction grammar as transform/pose tools where practical.

This is especially important for breaking sterile symmetry in repeated props such as GothGirl's two speakers, fences, poles, signs and architectural accents.

## 9 · KFB Terraformer & Worldbuilder v1

Terraformer lives inside `Stage`, not as a separate top-level app.

The KayKit diorama reference supports a simple first target:

- rolling terrain / plateau;
- paths / roads / coast / water where relevant;
- trees / rocks / bushes / fences / flags / buildings from Resource Picker;
- world lighting / sky / fog / background;
- Travel-Dome / TinySkies-derived background concept;
- direct scene composition and live preview in the same viewport.

Georg's forthcoming world/setup drawing remains the spatial reference for the Elisa/Town composition. Do not infer missing geography from the KayKit demo.

## 10 · Render / look target

The editor must preview the intended final render language, not a sterile technical debug render.

Current direction:

`cozy / claymation substrate + KFB skew`

with:

- soft readable key/fill lighting;
- real cast/contact shadows;
- matte / painted / clay-like materials;
- restrained material imperfection;
- atmospheric depth;
- selective cartoon deformation and asymmetry;
- skewed cartoon perspective where useful;
- no generic greybox look for final visual approval.

The KayKit reference is useful for composition/direct manipulation; it is not itself the complete KFB render target.

## 11 · First acceptance reconstruction

Before broad Scene/World implementation, prove the editor by reconstructing one compact KayKit-style village/diorama arrangement from the official reference using actual available assets or closest owned equivalents.

Acceptance evidence:

1. wide scene frame;
2. close-up selected-object frame with transform handle;
3. object moved/rotated/scaled directly in viewport;
4. one prop with Cartoon Deformer applied non-destructively;
5. camera orbit between close and wide composition;
6. day/sunset or equivalent variant switch;
7. save scene → reload → same visible arrangement;
8. Resource Picker can add another prop without leaving Stage.

This is a ToolBox Stage proof, not a claim that the official KayKit demo source scene file itself has been recovered.

## 12 · Elisa connection

Once the editor proof passes, use the same Stage workflow to assemble the Birthday scene:

- GothGirl finished KFB actor;
- Hihi finished Cube-Pet actor;
- Uncle FrizzleBob;
- stool / mic / speakers;
- Birthday D6;
- disco balls;
- Newton cradle;
- lighthouse/world landmark;
- real Theatre Curtain core module;
- fireworks / FX;
- Travel/TinySkies-derived world preset;
- accepted lighting/render style.

The Birthday world should be authored as a reusable scene/world configuration, not hardcoded as a one-off menu.

## 13 · Status discipline

- **DECISION:** KayKit Village Exterior demo screenshots are now a primary interaction/authoring reference for the KFB Stage/Scene/World Editor.
- **DECISION:** viewport-first direct manipulation is the core interaction model.
- **DECISION:** Stage remains one ToolBox workspace; Scene Builder and Terraformer are contexts inside it, not new top-level apps.
- **DECISION:** Resource Picker remains the asset intake route.
- **DECISION:** Cartoon Deformer and camera/perspective tools operate directly on/around the viewport.
- **PROPOSAL:** lightweight scene variants similar to Default/Daytime/Nighttime.
- **PROPOSAL:** compact scene hierarchy as optional/pinnable support UI.
- **IMPLEMENTATION:** none by this document.
- **TESTED RESULT:** none for KFB Stage yet; references are user-provided visual direction.