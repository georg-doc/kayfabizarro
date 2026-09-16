# KFB Visual Scene Atlas · Claude Design · KICKOFF

**Date:** 2026-09-16  
**Track:** `CANONICAL` by default  
**Status:** `EXECUTION KICKOFF / VISUAL ANALYSIS`  
**Owner boundary:** Asset Librarian remains read-only provenance/reference. ToolBox / Animation Lab / Travel / Town / Combat / Stunt retain their existing compatibility/runtime ownership.

## Mission

Use the prepared Atlas packets and the **actual reference images/GIFs** to extract visible scene, pose, prop, camera, material, lighting and composition knowledge.

Do **not** re-inventory KayKit. Do **not** start ToolBox/runtime implementation. Do **not** convert visual evidence into compatibility claims.

Every claim must remain explicitly one of:

`SOURCE FACT / OBSERVED DEMO / INFERENCE / PROPOSAL / TESTED RESULT / UNRESOLVED`

## Access bridge — read before resuming CQ-001

Claude Design has already produced a correct `UNRESOLVED / ACCESS BLOCKER`: repository import skipped the primary CQ-001 GIF because it is >5 MiB, and the used import surface did not expose `.gif`, `.gltf` or `.glb` as importable types.

Read:

- [DESIGN ACCESS BRIDGE](https://github.com/georg-doc/kayfabizarro/blob/chat/kaykit-visual-scene-atlas-preflight-2026-09-16/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/DESIGN_ACCESS_BRIDGE_2026-09-16.md)

**Execution decision:** provide the original CQ-001–003 GIFs as direct chat attachments. Execute CQ-001 only first. `.glb/.gltf` import is not required for L1/L2 visual annotation + asset matching; defer true 3D reconstruction to a 3D-capable owner if Design still cannot ingest those formats later.

If direct GIF attachment also fails, use a bounded private PNG frame packet. Never substitute filename interpretation for missing frames.

## Read first

Pinned preflight package:

- [Claude Design START HERE](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/CLAUDE_DESIGN_START_HERE.md)
- [Living Status](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/LIVING_STATUS.md)
- [Reference Corpus Index](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/REFERENCE_CORPUS_INDEX.md)
- [Visual Review Queue](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/VISUAL_REVIEW_QUEUE.md)
- [Source Asset Match Matrix](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/SOURCE_ASSET_MATCH_MATRIX.md)
- [Scene Recipe v0 proposal](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/SCENE_RECIPE_v0_PROPOSAL.md)

Full visual reference mirror:

- [KayKit reference images / sets / demos](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/main/_inbox/KayKit_PACKS_References_Scenes_Demos)

## Canonical Job 01 · Ultra Turbo Hero Man · Blaster / Grip / Pose

### Job packet

- [CQ-001 job packet](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/VISUAL_JOB_PACKETS/CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md)

### Visual references

- [Weapon / Blaster / Grip / Pose GIF](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/_inbox/KayKit_PACKS_References_Scenes_Demos/Weapons-%20DEMO%20-%20BLASTER%20-%20GRIP%20-%20POSE%20August2026_UltraHeroTurboMan.gif)
- [Blaster + gun setting contents sheet](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/_inbox/KayKit_PACKS_References_Scenes_Demos/BLASTER%2BGUN%20SETTING%20-%20contents%20%285%29.png)

### Source set

- [UltraTurboHeroMan source family](https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan)
- [UltraTurboHeroMan Blaster](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf)

### Task

Inspect the GIF frame-by-frame and establish only what is actually visible:

- which hand(s) hold/support the weapon;
- visible grip/contact region;
- blaster orientation and scale relative to actor;
- torso / shoulder / elbow / stance relation;
- head/gaze direction;
- camera/framing;
- distinct pose/action beats.

Preserve the naming discrepancy literally:

- reference filename: `UltraHeroTurboMan`
- source tree: `UltraTurboHeroMan`

Do not invent a KFB attachment transform from the demo.

## Canonical Job 02 · Goth Girl · Performance Reference

### Job packet

- [CQ-002 job packet](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/VISUAL_JOB_PACKETS/CQ-002_GOTH_GIRL_DEMO.md)

### Visual reference

- [GothGirl demo GIF](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/_inbox/KayKit_PACKS_References_Scenes_Demos/GothGirl.gif)

### Source set

- [GothGirl source family](https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/KayKit_Mystery_Series6/GothGirl)
- [Microphone](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf)
- [Mic Stand](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_MicStand.gltf)
- [Speaker](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf)
- [Stool](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Stool.gltf)

### Task

Do not re-prove existing narrow rig-binding evidence. Spend the visual-analysis budget on:

- action/performance sequence;
- which signature props actually appear;
- contact / seating / standing relations;
- prop scale and spacing;
- camera/stage composition;
- material/light/look.

Same-collection props are source facts, not proof that they appear in the GIF.

## Canonical Job 03 · Demon Lord · Large-character Staging

### Job packet

- [CQ-003 job packet](https://github.com/georg-doc/kayfabizarro/blob/412e1dceaa7568f57845c09f2e2fb77a24e68035/tools/asset_registry/librarian/_handover/KAYKIT_VISUAL_SCENE_ATLAS_PREFLIGHT_2026-09-16/VISUAL_JOB_PACKETS/CQ-003_DEMON_LORD_DEMO.md)

### Visual reference

- [Demon Lord demo GIF](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/main/_inbox/KayKit_PACKS_References_Scenes_Demos/July2026_DemonLord.gif)

### Source set

- [DemonLord source family](https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/KayKit_Mystery_Series6/DemonLord)
- [DemonHeart](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/DemonLord/assets/gltf/DemonHeart.gltf)
- [SummoningCircle](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/KayKit_Mystery_Series6/DemonLord/assets/gltf/SummoningCircle.gltf)

### Task

Extract:

- distinct action/staging beats;
- large-character scale and silhouette;
- DemonHeart presence/use only if visibly confirmed;
- SummoningCircle presence/use only if visibly confirmed;
- material/glow/FX cues;
- camera/framing and large-body presentation.

Do not infer runtime FX, collision, combat behavior or generic Rig_Large compatibility.

## Required return per job

Return exactly three artifacts:

1. `<JOB_ID>_RETURN.md`
2. `<JOB_ID>.scene-recipe-v0.json`
3. `<JOB_ID>_SOURCE_MATCH_DELTA.md`

Use:

`kfb.scene-recipe.v0`

with:

`profile: visual-preflight`

Every job return must state:

`TRACK: CANONICAL`

and keep `OBSERVED DEMO` separate from `INFERENCE` and `TESTED RESULT`.

## Execution rule

Start with **CQ-001 only**. The original GIF should now be supplied as a direct attachment. If accessible, complete the three CQ-001 return artifacts and stop for review before CQ-002, unless Georg explicitly requests a batch.

If direct visual access still fails, return the access blocker precisely and request the reduced private PNG frame packet. Do not substitute filename interpretation or the contents sheet for the missing animation evidence.
