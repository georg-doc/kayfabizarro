# KFB Claymation Style SSOT

Status: **CURRENT SHARED STYLE SSOT v1.0**  
Date: 2026-10-01  
Owner: Georg / KFB  
Applies to: World/Hex/Islands, Joyride/Race, Resident Atlas, ToolBox/Studio, Combat Arena, Billboard props and all future 3D consumers

This is the single read-first contract for the KFB claymation look. It does not create a new renderer, deformer, asset registry, world owner or runtime. It selects the existing sources, fixes their precedence and defines the visual gates that every consumer must pass.

## The short rule

**Do not invent “visible clay deformation”. Reproduce the named Golden Sample first.**

A new consumer may use newer implementation modules only when it proves that they reproduce the locked Golden image for the same source object, camera, light and scale. A technically newer module is not automatically a visually accepted style.

## Mandatory read order

1. This file.
2. `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` for the required source objects and views.
3. The receiving consumer's current SSOT/Return.
4. Only the source modules named for that asset family below.
5. `LESSONS_SHADOWS.md` whenever the result touches ground contact, contact AO or shadows.

Do not begin from an old session ZIP, a screenshot alone or a chat summary.

## Authority and precedence

### 1 · Visual truth: K1/H0 Golden Samples

Canonical package:

`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/`

The visual Golden line is:

- `KFB Knet-Katalog K1.dc.html` and `standalone/KFB Knet-Katalog K1 -standalone-.html`;
- `KFB Hirnwelt H0.dc.html` and its H0 screenshots;
- `lab-clay/clay-catalog.v5.js`;
- `lab-clay/clay-soften.v1.js`;
- `lab-clay/clay-profiles.v2.js`;
- `lab-clay/clay-material.v8.js` for exact K1/H0 reproduction;
- `DOKU_FASSADEN.md` for the measured process and screenshot map.

These files define what “the KFB clay look” currently means in pixels: softened but recognizable forms, low-frequency handmade massing, fixed-world-scale hand marks, bounded dents/gouges, preserved source colors/details and deliberate contact.

### 2 · New-stage implementation baseline: K2

For a new stage, K2 remains the accepted technical baseline:

`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`

Use its current modules where the receiving owner already consumes them:

- `clay-material.v10.js`;
- `clay-relief.v4.js`;
- `clay-toolmix.v1.js`;
- shared `clay-profiles.v2.js`.

But K2/v10 does **not** overrule K1/H0 visually. For a Golden-locked family, the implementer must either:

1. use the exact K1/H0 v8 path for the bounded comparison, or
2. prove in the locked A/B view that the v10 profile reproduces the Golden result.

If the images do not match, the result is `TUNE` or `FAIL`; “v10 is newer” is not a defence.

### 3 · Building ownership and deformation semantics: S5 + WorldBuilder

Entry router:

`tools/KFB-ToolBox/docs/CLAY_BUILDING_FACADE_ROUTER.md`

Prepared S5 contract, currently branch-pinned:

- branch/ref: `georg-doc-patch-2@3232a1070686896833d6b7942fcd631b9fa8cda6`;
- `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27/START_HERE.md`;
- sibling `BRIEF_CLAUDE_DESIGN_BUILDING_FACADE_CLAY_ADAPTER_S5.md`.

WorldBuilder/OSM City owns placement and the active building renderer. Track Core owns track/road. Clay is a presentation/preprocess layer. Never create a second city generator or universal deformer.

For buildings:

- keep the base anchored;
- deform body, roof, doors, windows and attached details through the same final field;
- preserve OSM footprint, height, identity and semantic façade rules;
- preserve KayKit/Kenney identity, anchors and connectors;
- never hide bad contact with a generic base plate;
- do not merge the test building into a mega-mesh before the Golden A/B gate.

### 4 · Palette and biome transitions: receiving world + Joyride atlas

Palette ownership remains with the receiving deck/biome/world recipe. Clay modules consume caller-provided colors; they do not invent a universal purple/green palette.

For current Joyride/World transitions, reuse the existing `transition-atlas.v1.js` donor from the accepted Joyride/World design line. Preserve its zone/transition roles and seed behaviour. Do not replace the transition system with linear gradients or hard-coded colors.

The style contract is:

- one stable seed produces the same palette assignment and deformation pattern;
- deck/biome supplies semantic color roles;
- transition atlas supplies the irregular clay-patch transition;
- material/deformer consumes those colors without becoming their owner.

### 5 · Contact, shadows and seams

Read `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`.

Shadows, contact AO and grounding are not optional polish. A bright seam, detached shadow, terrain poke-through or floating prop is a failed visual result even when the object reports numerical ground contact.

Do not fix contact by changing the massing deformer, adding a fake plinth or increasing random deformation. Use the shared contact/shadow recipe and validate the visible pixels.

## Asset-family contracts

### Buildings

Golden gate: `FACADE-A/B-01`.

- Master source: KayKit `building_A`.
- Secondary source: KayKit `building_E`.
- Camera: 6 m, 30 degrees from above, K1 light.
- K1 preprocessing: `softenGeometry`, `maxEdge 0.18`, maximum 3 subdivision stages, `maxTris 90000`, then `seedGeometry`.
- Golden material: `clay-material.v8`, profile `house`.
- Golden uniforms: Hand `0.5`, tile `1.6`, print `4.5`, converted against the source's real scale.

Required evidence: unchanged source | exact K1 Golden | candidate, plus roof edge and base/contact close-ups. No bending or merging before this gate passes.

After the master gate, expand the same test to one real OSM group and one verified Kenney building. Their identities and owners remain protected.

### Terrain and islands

Golden visual references:

- H0 terrain overview and close view: `screenshots/05-h0-totale.png` and `screenshots/07-h0-gelaende-nah.png` in the K1/H0 package;
- H0 terrain owner: `lab-brain/brain-world.v8.js` plus its baked `brain-world.v1.bin/.json`;
- current track/world palette transitions: Joyride `transition-atlas.v1.js`.

Hex may be a visible tile family or an invisible WFC/snap grid. It is not permission to turn a floating island into stacked columns. Continuous island tops and undersides remain authored/procedural landforms; tiled versions must be compared against that result, not assumed inferior or superior.

Required evidence: near, traversal-height and far view; silhouette; track/terrain seam; underside; shadow/contact; triangle count, draw calls and frame timing for the same camera.

### Nature

Current K1 sources:

- `tree`;
- KayKit `bush`;
- `rock`.

Use profile `nature`. Preserve groups supplied by a pack; do not replace an authored tree/rock cluster with random scattering. Interpenetrating clay blobs require the proven contact/AO treatment so no bright ring appears between them.

### Clouds and skydome environment

Read `KFB_SKYDOME_ENVIRONMENT_SSOT_WIP.md` before editing clouds, sky shells, day/night, weather, Aurora, God Rays, Lens Flare or the Card-Spindle.

The canonical cloud-anatomy donor is:

`media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb`

It defines the base silhouette and lobe anatomy for later clay variants. It is a pinned source donor, not yet a Golden Sample. Show the unchanged donor first; derive a compact deterministic family from its anatomy; do not replace it with generic sphere clusters. The sky/environment layer retains one shared `EnvironmentHost` and does not create a second lighting, clock, fog or weather owner.

### Props and street furniture

Current K1 Golden candidates:

- `streetlight`;
- `trafficlight_A`;
- `firehydrant`;
- `bench`.

Use profile `prop`. Golden intent is readable source identity with softened edges and restrained hand marks. Small props must not inherit terrain-scale fingerprints or building-scale lump deformation.

### Characters

Current surface references in K1:

- Black Knight, Rig_Large;
- Farmer A, Rig_Medium.

Current FrizzleBob/character integration sources live in ToolBox Production-06 and Joyride J17. For skinned figures:

- do not run static `softenGeometry` over the skinned mesh;
- preserve rig, weights, face/eye/lid/ear owners and locomotion contracts;
- apply clay surface through the character-safe material/profile path;
- use body-shape or named character deformers only through their existing owner;
- never infer that the building torsion field applies to a character.

The character Golden catalogue must show Rig_Medium, Rig_Large and FrizzleBob v5b using the same light/camera scale, neutral pose and one moving pose.

### Vehicles

Current K1 surface references:

- KayKit taxi;
- KayKit police car.

Current gameplay/scale donor: Joyride J17 `KFB_CVP1_cabrio` with FrizzleBob v5b.

Preserve wheel/contact roots, vehicle rig and driving physics. Clay surface adaptation, collision-direction body deformation, suspension/bounce and temporary tyre/impact marks are separate layers and must not silently rewrite one another.

### Clay particles and cartoon VFX

Current candidate modules are the Resident/ToolBox clay VFX and particle profiles. They are reusable event consumers, not automatically Golden visuals. Calibrate them against named events (`land`, `impact`, `prop_break`, drift/slip, gift burst) in an isolated sheet and then in the receiving gameplay owner.

## Universal Golden A/B protocol

Every new asset family or material version must show:

1. unchanged real source object;
2. named Golden Sample/reference;
3. candidate using the proposed implementation;
4. same camera, projection, scale, light, background and shadow settings;
5. near, middle and far views when distance matters;
6. geometry/material/performance facts for the same view;
7. explicit `MATCH`, `TUNE`, `FAIL` or `NOT_TESTED`.

Do not approve from a candidate-only screenshot. Do not call a loaded URL donor reuse. Do not replace a visual mismatch with a table of numbers.

## Runtime/performance rules

- Static expensive softening should be prebaked/offline when the receiving runtime proves the runtime path too costly.
- Instanced families share geometry/material and carry variation through instance attributes/seed where supported.
- A failed non-instanced hex scene is not evidence that real instancing fails.
- Texture/shader microdetail must fade by distance and pixel footprint.
- Large source textures and baked streams stay referenced by Git commit or build recipe; they do not travel in every chat export.
- Design/session handoffs target under 10 MB and contain code, recipes, evidence and manifests — not duplicate canonical assets.

## Consumer rule

Every Hex, World, Joyride, Resident, ToolBox, Combat or Billboard brief must contain this exact line near the top:

> **Clay style SSOT:** read `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` before editing geometry, materials, palettes, deformation, shadows or contact. Do not invent a replacement look.

If those files are unavailable, the task stops as `SOURCE_REQUIRED`; it does not ask Georg what “Golden Samples” means again.

## Change control

- This file is the routing/style contract; consumer Returns may not silently supersede it.
- A new Golden Sample requires source path, fixed comparison view, human acceptance and an additive matrix entry.
- New material/deformer versions remain candidates until the locked A/B view passes.
- Historical samples remain labelled; never rewrite a previous FAIL into a PASS.
- Changes to this SSOT update the KFB Hub clay-style card and affected active briefs in the same handoff.

## Exactly one next expansion gate

Execute `KFB_CLAY_GOLDEN_CATALOG_V2_BRIEF.md`: one compact, public-source-backed comparison catalogue covering buildings, terrain, nature, props, characters and vehicles. It extends the accepted matrix without creating a new runtime owner.
