# BLENDER COMPARISON SHOTS · KAYKIT_CREATOR_SCAN_01

Status: **BLOCKED PENDING VISUAL VIDEO EVIDENCE**
Date: 2026-10-03

## Important

This file intentionally contains **no guessed creator timestamps and no fabricated matched phases**.

The binding scan requires a visible original-video frame before a creator-reference comparison shot can be assigned to Blender. In this run, all three original videos were visually inaccessible after the protocol's two-attempt stop condition.

## Existing Blender source boundary remains valid

The separate native-source Blender review in PR #344 remains the correct source-isolation lane:

- real KayKit ActionFigure;
- original KayKit Character Animations 1.1;
- `Rig_Medium`;
- native playback;
- no Mixamo;
- no browser controller;
- no World / Travel integration.

This blocked creator scan does not modify that work.

## Comparison queue after the visual retry

Only after a visual-capable executor records a real `SEEN` moment, create a row here using this contract:

| creator video | exact timestamp | visible clip / state | visible phase | readable setting | Blender source clip | matched phase | camera / framing | compare |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| original URL only | required | required if readable, otherwise `UNREADABLE` | contact / passing / airborne / landing / transition | only what is visibly readable | exact native KayKit clip | timestamp or normalized phase | derive only from visible source | feet / stride / body lean / arms / loop / transition |

### Required comparison families

1. **Gait**
   - creator Walk contact;
   - creator Walk passing;
   - creator opposite contact;
   - same three phases for creator Run;
   - any readable playback-speed / state parameter.

2. **Transitions**
   - source state immediately before change;
   - clearest visible blend/intermediate frame;
   - destination state;
   - readable State Machine / Blend Tree / AnimationTree setting if visible.

3. **Jump**
   - takeoff;
   - airborne;
   - landing;
   - readable clip-chain / condition if visible.

4. **Other movement**
   - only if visually present;
   - if the completed scan establishes absence, record `NOT_SHOWN` rather than inventing a Blender task.

## Exact native asset sources for the later comparison

Actor:
`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb`

KayKit Character Animations 1.1 / Rig_Medium first-pass files:
- `Rig_Medium_General.glb`
- `Rig_Medium_MovementBasic.glb`
- `Rig_Medium_MovementAdvanced.glb`

The source-priority rule remains native KayKit first. This evidence file does not authorize a KEEP / HOLD / REJECT decision.

## Next gate

Complete the original-video visual scan first.

When that succeeds, this document is replaced additively with actual timestamped comparison rows and **Blender MCP** becomes the next executor.
