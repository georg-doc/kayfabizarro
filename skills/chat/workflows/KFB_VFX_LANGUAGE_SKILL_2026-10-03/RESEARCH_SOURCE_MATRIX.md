# KFB Cartoon VFX · Research Source Matrix

Date: 2026-10-03
Workflow: KFB-VFX-LANGUAGE-SKILL-01
Purpose: durable evidence for skills/kfb-cartoon-vfx_v1.md

## Evidence classes

A · current KFB implementation / direct source code  
B · direct upstream public source code  
C · official engine / platform documentation  
D · production artist / conference / industry tutorial  
E · community implementation discussion  
F · academic study

The skill favors A/B/C evidence for architecture. D/E/F are used for design reasoning and cross-checks.

---

## 1 · Current KFB implementation donors

### 1.1 Neutral Combat recipe grammar

Evidence class: A

Repository:
- https://github.com/georg-doc/KFB-Combat-Arena

File:
- modules/kfb-vfx-recipes.js

Verified blob:
- 5b1ac585517d50617295e46cc4618b4108a4a7ad

Direct findings:
- effect recipes are data, not a second gameplay engine;
- anchor vocabulary includes muzzle / projectile / contact / target / ground / world;
- primary / secondary / tertiary budgets already exist;
- impact is a timeline: contact, hitstop, flash, hold, debris, ground response, smoke and residue;
- weapon / energy and contacted surface are separate axes.

Skill derivation:
- generalize the recipe grammar across combat, movement, vehicles, flight and water.

### 1.2 Combat hit response

Evidence class: A

File:
- modules/kfb-hit-response.js

Verified blob:
- 996aaed9a86967b05c273cbe133bef300f66b348

Direct findings:
- authored reaction clip, material flash, contact sign and deformation are separate layers;
- module does not own authoritative position;
- impact axis follows actual force/incoming direction rather than blindly using a curved surface normal;
- animation hitstop and drawn deformation hold are separate clocks;
- simulation dt is authoritative.

Skill derivation:
- camera, hitstop, deformation and particle feedback are sibling consumers of the same semantic event.

### 1.3 Instanced sprite renderer

Evidence class: A

File:
- modules/kfb-fx-sprites.js

Verified blob:
- df009798a09780ecd7d0341d1346aae69f517752

Direct findings:
- four fixed instanced render groups cover atlas/flipbook × additive/normal;
- fixed pools bound growth;
- deterministic seeded scatter is supported;
- fast pop / hot phase / dissolve differs from ordinary smoke fade.

Skill derivation:
- semantic recipe stays separate from renderer family;
- pool saturation drops optional effects instead of growing the scene.

### 1.4 Ribbon trail renderer

Evidence class: A

File:
- modules/kfb-fx-trails.js

Verified blob:
- 1589475df73ffe9135c9b11a14cbb9febae5d4c7

Direct findings:
- one ribbon represents a continuous trail;
- path points age, widen and fade;
- head remains attached to its source;
- camera-facing ribbon basis is derived from path tangent + camera.

Skill derivation:
- weapon, projectile, contrail, scrape and wake paths should use a TRAIL/RIBBON primitive rather than puff chains.

### 1.5 Combat semantic cue anchors

Evidence class: A

File:
- modules/kfb-combat-cues.js

Verified blob:
- ef612cdec4fd369c0e62cc4daac34aa2126095b4

Direct findings:
- launch / travel / impact / hop are explicit event anchors;
- a bounce/hop must not generate false hit confirmation;
- simultaneous feedback has a bounded beat budget;
- dropped/debounced signals are counted.

Skill derivation:
- confirmed target hit, confirmed world hit, bounce, scrape and near miss are separate VFX truth states.

### 1.6 Staged flame / smoke

Evidence class: A

File:
- modules/kfb-fx-flame.js

Verified blob:
- 03c492de881f5cc7c60ef3059e915bcb7919dbdb

Direct findings:
- ignition, burn and smoke are staggered phases;
- deterministic flicker;
- attached flame source may move with target;
- released smoke becomes world-space;
- existing host sprite pool is reused.

Skill derivation:
- ATTACHED_SOURCE and RELEASED_WORLD are mandatory ownership concepts.

---

## 2 · Current KFB Travel / mobility donors

Repository:
- https://github.com/georg-doc/kayfabizarro

### 2.1 Speed lines

Evidence class: A

File:
- travel/travel-v16/terrain-v16/speed-lines.js

Verified blob:
- c0ee910790ad1dc4dad30219b2482ae8469f69c7

Direct findings:
- screen-space tapered spindle form;
- bounded pool;
- one draw call in current KFB port;
- thresholded by speed/heat;
- high speed increases visual intensity without simply making everything bulky.

### 2.2 Drift smoke

Evidence class: A

File:
- travel/KFB Travel Globe v13-1/globe-v13/drift-smoke.js

Verified blob:
- f032e948db167b709fd95bf2323ce89f6aa8c617

Direct findings:
- consumes existing driftIntensity;
- rate is time-based;
- VFX does not own a second drift model.

### 2.3 Impact dust

Evidence class: A

File:
- travel/KFB Travel Globe v13-1/globe-v13/impact-dust.js

Verified blob:
- e898918ee7d78b7782e535ec8abd60b77e83a75f

Direct findings:
- event receives world contact point, local normal and source impulse;
- normal and tangential velocity are decomposed;
- vertical bounce and grazing contact therefore produce different debris motion with the same renderer;
- projection-aware point size plus hard pixel cap avoids giant translucent disks near camera.

### 2.4 Water wake

Evidence class: A

File:
- travel/KFB Travel Globe v13-1/globe-v13/carpet-wake.js

Verified blob:
- 12cce260080a1b0ba26e6f21b9e2373af4b63141

Direct findings:
- wake is emitted at the water surface under the vehicle;
- steady wake and one-shot entry splash are different events;
- the surface event remains meaningful even when source altitude differs.

### 2.5 Screen radial treatment

Evidence class: A

File:
- travel/KFB Travel Globe v13-1/globe-v13/post-radial.js

Verified blob:
- 9b00b785cc80bfadb13934d4c8304b13542c5d83

Direct findings:
- screen treatment is isolated as a post/screen channel;
- effect is bounded and prewarmable;
- it does not become a gameplay owner.

### 2.6 Contrails

Evidence class: A

File:
- travel/KFB Travel Globe v13-1/globe-v13/contrails.js

Direct findings:
- real source-object anchors are used;
- path history is cleared on discontinuities;
- trail head remains attached to actual rendered source.

---

## 3 · KFB clay particle donor

Evidence class: A

Repository:
- georg-doc/kayfabizarro

Branch:
- coworker/clay-city-mvp-01-2026-09-28

Files:
- tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/lab-vfx/clay-vfx.v1.js
- tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/lab-vfx/clay-particle-profiles.v1.json

Verified blobs:
- clay-vfx.v1.js: 4aa7bb3bdf195ccaf3041a33d8819113b2aa01d3
- clay-particle-profiles.v1.json: 506d3489345aeb1eadbbabd71cc7d1431a6b7945

Direct findings:
- BALL / DROP / CHIP-like mesh families;
- one InstancedMesh per primitive family;
- typed-array pooled state;
- deterministic local seed;
- gameplay payload includes event, contact point, normal, speed/energy and biome;
- bounce / stick / roll / carry-velocity behaviors;
- quality tiers.

Boundary:
- its reduced clay shader explicitly is not the current K2 material path;
- this slice reuses architecture and vocabulary, not material ownership.

---

## 4 · Prior KFB VFX donor census

Evidence class: A

Directory:
- tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/

Verified:
- RETURN_VFX_01.md blob 836ecd1edf83ef3930bcf7dc8ab86f7d44cf0e0c
- POSTMORTEM.md blob 5a557ce8a1f7f2d7e94281fdefc246a4a9d2d19e

Donor families already inventoried:
- Brackeys VFX Bundle;
- FreeHitVfx;
- free cartoon smoke;
- Tiny Swords Particle FX;
- explosions_smoke;
- Kenney smoke particles;
- KFB Combat ink atlas / recipes;
- Boxel Blitz feedback POC.

Critical retained lesson:
- numbered filenames are not evidence that files are animation frames;
- actual frames / source objects must be visually inspected before grouping or integrating.

---

## 5 · Tiny Skies direct upstream proof

Evidence class: B

Repository:
- https://github.com/dannylimanseta/tinyskies

Verified upstream commit:
- 2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6

### 5.1 CarpetLeaves.ts

Path:
- client/src/game/CarpetLeaves.ts

Verified blob:
- 9c6b68e74865f3cc3dc687edffa3b19412ce8f00

Direct findings:
- dedicated pool of leaf particles;
- curved leaf-shaped point shader;
- flutter, phase rotation and local-up gravity;
- emitted in response to low flight over land.

Important deviation for KFB:
- upstream emission includes frame-based logic;
- KFB skill requires time-based RATE for new continuous effects.

### 5.2 CarpetWake.ts

Path:
- client/src/game/CarpetWake.ts

Verified blob:
- 89d1d1cd69244ccf6db50a67c16568574711ef7a

Direct findings:
- comments explicitly state water splash is emitted at water surface directly below carpet;
- two outward wake fans;
- speed/water/elevation gates.

### 5.3 CarpetDriftSmoke.ts

Path:
- client/src/game/CarpetDriftSmoke.ts

Verified blob:
- ca57d9df2eb530744c2e0ea392beb7c044064d0f

Direct findings:
- 28 particles per second while drifting;
- event consumes isDrifting + driftIntensity;
- side-offset emitters;
- time accumulator, not per-frame count.

### 5.4 SpeedLines.ts

Path:
- client/src/game/SpeedLines.ts

Verified blob:
- 4fbb6c74d90c448d49f30669dfb6730bd26c317a

Direct findings:
- screen-space effect;
- speed threshold and boost threshold;
- tapered line shader;
- life-driven fade.

KFB conclusion:
- current Travel modules are genuine ports/adaptations of direct upstream sources rather than unverified stylistic references.

---

## 6 · Official VFX architecture references

### Riot Games · League VFX Style Guide

Evidence class: D / first-party production guidance

Article:
- https://nexus.leagueoflegends.com/en-us/2017/10/dev-leagues-vfx-style-guide/

Guide PDF:
- https://nexus.leagueoflegends.com/wp-content/uploads/2017/10/VFX_Styleguide_final_public_hidpjqwx7lqyx0pjj3ss.pdf

Relevant principles:
- gameplay clarity;
- visual hierarchy;
- minimize clutter;
- gameplay / value / color / shape / timing;
- visual impact should match gameplay impact.

KFB derivation:
- effect significance and primary/secondary/tertiary budgets are part of the semantic recipe.

### Unreal Engine · Niagara

Evidence class: C

Docs:
- https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine
- https://dev.epicgames.com/documentation/unreal-engine/events-and-event-handlers-in-niagara-effects-for-unreal-engine
- https://dev.epicgames.com/documentation/unreal-engine/niagara-data-channels-overview

Relevant principles:
- event payloads can trigger other emitters;
- typed data can be routed through data channels;
- effects can be composed from emitter systems rather than one monolith.

KFB derivation:
- semantic KfbVfxEvent is upstream of individual renderer families.

### Godot · particles / subemitters / trails

Evidence class: C

Docs:
- https://docs.godotengine.org/en/stable/tutorials/3d/particles/subemitters.html
- https://docs.godotengine.org/en/4.5/classes/class_gpuparticles3d.html
- https://github.com/godotengine/godot-docs/blob/master/tutorials/3d/particles/trails.rst

Relevant principles:
- staged subemitters;
- trails are a distinct primitive;
- deterministic seed support;
- transform / velocity / custom per-particle data.

### Three.js · InstancedMesh

Evidence class: C

Docs:
- https://threejs.org/docs/pages/InstancedMesh.html

Relevant principle:
- shared geometry/material with distinct transforms reduces draw calls.

KFB derivation:
- current clay donor strategy of one instanced group per primitive family is appropriate for KFB Three.js consumers.

---

## 7 · Production / tutorial references

### Gabriel Aguiar · Stylized smoke / impacts / weapon VFX

Evidence class: D

Tutorial index:
- https://www.gabrielaguiarprod.com/tutorials

Stylized smoke:
- https://www.youtube.com/watch?v=dPJQuD93-Ks

Relevant:
- stylized effects use explicit shape layers and timing;
- smoke can be built from animated/eroded meshes rather than expensive fluid simulation;
- impact, muzzle, sword slash and weapon-effect tutorials reinforce reusable primitive families.

### Rimaye · Niagara punch / impact

Evidence class: D

Video:
- https://www.youtube.com/watch?v=gXeoGDj3dHg

Relevant:
- impact is layered from distinct roles such as plane/flash, ring/circle, star/shards and dust;
- effect firing is tied to animation/event timing.

### Jan Willem Nijman · The Art of Screenshake

Evidence class: D

Video:
- https://www.youtube.com/watch?v=AJdEqssNZ-U

Relevant:
- impact feel is a synchronized stack of small feedback channels;
- screen/camera response is powerful and should not become the only feedback.

---

## 8 · Environment interaction

### Ghost of Tsushima VFX production discussion

Evidence class: D/E

RealTimeVFX thread:
- https://realtimevfx.com/t/vfx-of-ghost-of-tsushima-a-recent-blog/15815

Useful production statements:
- VFX systems consume explicit world data supplied by code;
- wind emitters around actors drive leaves / birds / fire response;
- expression systems map values, thresholds and curves;
- reusable open-world systems reduce bespoke one-off logic.

KFB derivation:
- near-ground leaf/dust response consumes nearGround, biome, velocity and influence/downwash data;
- it does not independently become a terrain or physics system.

Related interaction discussions:
- https://realtimevfx.com/t/niagara-5-0-player-interaction-mini-tutorial/20490
- https://realtimevfx.com/t/interactions-with-particles/1940

Leaf reference:
- https://realtimevfx.com/t/made-some-leaf-particles-in-unity-for-fall/3168

---

## 9 · Vehicle / racer reference

Evidence class: B/D

Public art-direction example:
- https://github.com/ryancampbell/kart-royale/blob/main/ART_DIRECTION.md

Useful concepts:
- rear-wheel drift effects;
- smoke vs off-road dust;
- speed-line thresholds;
- boost layers;
- stacked-effect readability / whiteout review.

KFB derivation:
- vehicle events consume wheel contacts, surface, speed, slip/drift, yaw and boost state.

---

## 10 · Water / boats

Evidence class: E

RealTimeVFX:
- https://realtimevfx.com/t/question-do-anyone-know-how-to-make-this-water-wake-effect/17491
- https://realtimevfx.com/t/realtime-water-and-ship-fx-in-ue5-3/25524
- https://realtimevfx.com/t/looking-for-help-on-my-boat-wake/30954

Repeated pattern:
- wake body / trail;
- bow/side wave;
- foam / whitewater;
- spray / mist;
- tuning from boat speed and rotation.

KFB derivation:
- default water language is layered and data-driven;
- full fluid simulation is not the default requirement.

---

## 11 · Comic typography / onomatopoeia

### HAWKED production breakdown

Evidence class: D

Article:
- https://www.gamedeveloper.com/art/how-to-create-comic-book-style-vfx-for-games-like-in-hawked

Relevant:
- reusable onomatopoeia atlas;
- text can be spawned as part of VFX;
- threshold/cutoff animation can animate compact textures.

### Comic Book Impact tutorial

Evidence class: D

Reference:
- https://www.gamesinprogress.com/indie-game-developers/game-dev-guide/creating-a-comic-book-impact-effect-with-vfx-graph

Relevant:
- comic impact text / shapes can be authored as one effect composition rather than pasted UI.

### Visual sound-effect semantics

Evidence class: D / educational

Reference:
- https://soundofcomics.sdsu.edu/sound-effects/

Relevant:
- motion and impact sound words have different communicative functions.

KFB derivation:
- GLYPH mode distinguishes motion / impact / reaction.

### Juicy Text · ICMI 2024

Evidence class: F

Paper:
- https://arxiv.org/abs/2512.13695

Bibliographic record:
- https://dblp.org/rec/conf/icmi/FabreSV0R24.html

DOI:
- 10.1145/3678957.3685755

Reported study finding:
- animated/juicy text feedback was evaluated similarly to particle feedback in the study;
- text feedback was comparably performant and more reliable as feedback;
- combined text + particle treatment showed potential additional benefit.

KFB derivation:
- comic words are a first-class VFX feedback channel rather than an afterthought.

---

## 12 · Open-source VFX architecture references

Evidence classes: B/C

Unity VFX Graph samples:
- https://github.com/Unity-Technologies/VisualEffectGraph-Samples

Effekseer:
- https://github.com/effekseer/Effekseer
- https://effekseer.github.io/en/

three.quarks:
- https://github.com/Alchemist0823/three.quarks

three-nebula:
- https://github.com/creativelifeform/three-nebula

Architecture lesson:
- effects can be reusable data/assets;
- sprites, meshes, ribbons and curves can share an authoring model;
- renderer batching and gameplay/event logic should remain separated.

KFB decision:
- these are reference architectures only;
- no new library dependency is selected by this slice.

---

## 13 · Reddit / community sanity checks

Evidence class: E

Examples:
- https://www.reddit.com/r/gamedev/comments/vug4x2
- https://www.reddit.com/r/gamedev/comments/1emc3cn
- https://www.reddit.com/r/gamedev/comments/1uxokz1

Recurring practitioner observations:
- hit feel often combines reaction, flash, particles, sound and a bounded hitstop/camera response;
- excessive global hitstop/screenshake can read as lag or become uncomfortable.

Use:
- sanity check only;
- not architecture authority.

---

## 14 · Research conclusions promoted into the skill

Promoted:

1. truth before style;
2. semantic event envelope;
3. energy separate from significance;
4. attached source separate from released world effect;
5. anchors are explicit;
6. primary / secondary / tertiary hierarchy;
7. clay BALL / DROP / CHIP as primary KFB particle syllables;
8. RIBBON as continuous-motion primitive;
9. RING/SHEET for ground, water and AOE;
10. GLYPH as first-class feedback;
11. simulation-dt continuous emission;
12. fixed pools and graceful tertiary shedding;
13. deterministic local seeds;
14. surface response separated from weapon/source energy;
15. direct hit / world hit / bounce / scrape / near miss separation;
16. vehicle enter/exit as transition-concealment choreography rather than fake physics;
17. near-ground environment effects consume world/motion data;
18. wake belongs at water surface;
19. screen/camera channels are bounded siblings;
20. donor source object/frame must be inspected before integration.

Not promoted:

- no external particle library dependency;
- no full fluid simulation mandate;
- no global replacement of KFB Combat / Travel VFX;
- no replacement of current KFB clay material owner;
- no unverified donor sequence inferred from filenames.
