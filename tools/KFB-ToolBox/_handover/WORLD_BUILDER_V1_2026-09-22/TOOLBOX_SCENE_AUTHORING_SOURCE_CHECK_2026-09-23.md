# WorldBuilder ToolBox Scene Authoring · Source Check · 2026-09-23

Status: **SOURCE CHECK COMPLETE · NO RUNTIME BUILD IN THIS SLICE**

## FrizzleBob lineages

Verified legacy Combat source in `georg-doc/KFB-Combat-Arena`:

- Combat v3 loads `combat-arena-v1/frizzlebob.v1.js`;
- that file uses Kenney `Platformer Game Kit - Dec 2021/Character/glTF/Character.gltf`;
- optional gun body is `Character_Gun.gltf`;
- file header describes it as a Platformer character with Pet-Studio face.

Verified current ToolBox source:

- `frizzlegraft-v1/graft-mount.v1.js`;
- `contracts/kfb-pet-graft-driver.v4.json`;
- actor id `graft-driver`;
- Rig_Medium;
- current contract includes red nose configuration and `carl-original` brow configuration.

Conclusion:
legacy Combat Platformer FrizzleBob and current Driver Graft are distinct actor lineages.

## Resident Atlas

Verified current contracts:

- `tools/resident_atlas/README.md`
- `tools/resident_atlas/SCENE_STAGING_CONTRACT.md`
- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`

They already separate:
- exact resident/rig/pose facts;
- scene composition;
- receiving-game runtime ownership.

S6 evidence includes three rig families and existing motion audition/clip-binding evidence.

Conclusion:
WorldBuilder should consume resident references, not recreate Resident Atlas.

## Animation / Motion

Dropbox current ToolBox export contains:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html`

Observed authoring surface includes:
- actor source selection;
- Move;
- Strip;
- Batch;
- Audit;
- Talk;
- Blick;
- FX;
- Data;
- Medium/Large awareness;
- clip inventory;
- Studio sync;
- import/export/test.

Generic Animation Lab is still unpromoted in the central router.

Current tested ToolBox motion donor:
`kfb-hub/stage/toolbox/kaykit-motion-lab-v1/`

Its current README records:
- FrizzleBob Driver Graft;
- GothGirl Rig_Medium;
- Black Knight Rig_Large;
- exact rig-family clip loading;
- one mixer per actor;
- 87/87 browser evidence in its own prior gate.

Conclusion:
WorldBuilder can preview existing compatible clips now, while later Animation-Lab promotion remains separate.

## Runtime tests in this slice

0.

This slice changes routing/briefing only.

Next runtime gate:
`WB1-TERRAIN-SCENE-01`.
