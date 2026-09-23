# KFB WorldBuilder · ToolBox Scene Authoring Correction · 2026-09-23

Status: **CURRENT CORRECTION · TERRAIN + RESIDENT SCENE BUILDER**

Owner:
`georg-doc/kayfabizarro/tools/KFB-ToolBox/`

This corrects one important interpretation of the existing Terrain-First brief:

**WorldBuilder is not an isolated terrain demo. It is the ToolBox scene-building surface.**

Its job is to let Georg build reusable KFB scenes from:
1. continuous terrain;
2. real source objects;
3. Resident Atlas actors/recipes;
4. existing animation/motion sources;
5. saved scene state.

It does not become a game runtime and it does not replace Resident Atlas or Animation Lab.

---

## Product picture

Think of the ToolBox as a set of connected workbenches:

- **FrankenStein / actor tools** → which character is it?
- **Resident Atlas** → which exact resident, props, rig and proven setup?
- **Animation / Motion tools** → what existing movement or loop does that actor play?
- **WorldBuilder** → where is everything placed, on what terrain, with what scene settings?
- receiving game/world → gameplay, movement rules, combat, persistence at runtime.

WorldBuilder should reference these sources, not copy and fork them.

---

## Terrain

Keep the current Terrain-First decision.

Primary donor:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT.

First terrain remains deliberately small:
- seed;
- height;
- macro scale;
- detail;
- regenerate;
- optional flatten/smooth later.

No Hex macro-world.
No Sphere/Torus gate.
No voxel macro-world.

Hex/voxel may later appear as local authored content.

---

## Scene editing

Reuse the existing KFB S21/S22 / Scene Patch interaction.

WorldBuilder needs:
- select;
- move;
- rotate;
- scale where the source permits it;
- duplicate/delete props;
- drop/snap to terrain;
- save;
- reload.

Do not build another transform editor.

---

## Resident Atlas connection

Resident Atlas is the character/scene-source donor.

Read:
- `tools/resident_atlas/README.md`
- `tools/resident_atlas/SCENE_STAGING_CONTRACT.md`
- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`

Use exact Resident Atlas facts:
- resident id;
- exact model/source;
- rig family;
- proven scale/facing;
- proven prop/attachment facts;
- exact compatible animation clip where already proven.

WorldBuilder stores the **reference and placement**, not a copied resident implementation.

### First resident fixture

Use one already proven Resident Atlas actor with a simple compatible idle/pose.

Do not start by solving a difficult attachment or custom animation problem.

The first gate only needs to prove:
**terrain + real resident + real prop + save/reload**.

---

## Animation / Motion connection

There are currently two useful sources, and they must not be confused.

### A · Animation Lab v3 · donor / unpromoted

Current Dropbox source exists at:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html`

It already contains useful authoring ideas:
- character source selection;
- clip browser;
- Medium/Large rig awareness;
- weapon/fit work;
- Talk/Blick/FX/Data;
- Studio sync;
- import/export/test.

But generic Animation Lab is still **not promoted as the current canonical tool owner**.

Therefore WorldBuilder may reuse its proven interaction/source ideas, but must not depend on an invented new Animation Lab API.

### B · KayKit Motion Lab v1 · current tested motion donor

Current tested ToolBox motion source:
`kfb-hub/stage/toolbox/kaykit-motion-lab-v1/`

It already proves:
- exact rig-family clip loading;
- real clip enumeration;
- one mixer per actor;
- FrizzleBob Driver Graft;
- Rig_Medium / Rig_Large separation;
- clip preview / transitions.

Use those facts where relevant.

### WorldBuilder rule

WorldBuilder may:
- choose an existing compatible clip;
- play/pause that clip for scene preview;
- save the chosen clip reference with the scene.

WorldBuilder must not:
- retarget rigs;
- invent clips;
- become the Animation Lab;
- own locomotion/game physics.

A later **Edit Animation** action may open/hand off to the promoted Animation/Motion tool.

---

## FrizzleBob identity rule

Before any FrizzleBob enters a WorldBuilder scene, read:

`tools/KFB-ToolBox/_handover/FRIZZLEBOB_IDENTITY_MAP_2026-09-23.md`

Current default:
**FrizzleBob · Driver Graft**

Never silently replace it with:
- FrizzleBob · Cube-Pet;
- FrizzleBob · Combat Platformer.

Legacy versions may be deliberately selected as separate actors.

---

## Scene document · first useful minimum

A saved scene should be able to remember at least:

- terrain seed/settings;
- environment/profile reference;
- source object references;
- transforms;
- resident id/source reference;
- selected preview clip reference;
- prop placement;
- optional simple scene metadata.

Do not copy model bytes or animation libraries into the scene document.

---

## First new gate · WB1-TERRAIN-SCENE-01

Build only this:

1. continuous procedural terrain;
2. regenerate from seed;
3. one real source prop/landmark;
4. one real Resident Atlas actor;
5. one existing compatible idle/pose clip playing;
6. select/move/rotate the prop and resident placement;
7. drop/snap to terrain;
8. save;
9. reload;
10. continue editing.

Review file:
`WB1_TERRAIN_SCENE_01_REVIEW.html`

The review must show the source objects separately before the composed scene.

No Cloudflare.
No Work.
No Claude Design yet.

---

## Why this comes before Orc Band

The Orc Band should become a **real integration test of the same scene system**, not another one-off app.

After WB1-TERRAIN-SCENE-01 works, a later scene can reference:
- exact Orc B bandleader;
- Orc Brute / Wardrum / stick;
- Orc camp scenery;
- the existing music track;
- shared beat/performance module.

WorldBuilder owns their **scene composition**.

Resident Atlas owns the resident/source facts.

Animation/Motion owns actor motion authoring.

The Orc Band performance module owns the shared beat behavior.

No subsystem is rebuilt inside WorldBuilder.

---

## Done when

Georg can open one HTML and:

- make terrain;
- add a real Resident Atlas character;
- see one real existing animation;
- place character + prop;
- save;
- reload;
- keep editing.

That is the useful first WorldBuilder inside the ToolBox.

Exactly one next gate:

**WB1-TERRAIN-SCENE-01 · terrain + Resident Atlas + existing clip + save/reload.**
