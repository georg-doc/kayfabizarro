# ToolBox ↔ 2D Animation Studio Bridge

Status: **CURRENT ALIGNMENT CONTRACT · IMPLEMENTATION LINKS, NO OWNER MERGE**  
Updated: 2026-09-18

## Purpose

Align the browser-first **2D Animation Studio** with the existing KFB ToolBox / FrankenStein / EyeRig stack without creating duplicate owners.

The target architecture is:

```text
shared semantic control
        │
        ├─ Three.js adapter / EyeRig v6 / ToolBox
        │
        └─ SVG/2D adapter / 2D Animation Studio

consumer clips address semantics, not renderer geometry
```

2D and 3D should differ mainly in **host measurement + renderer output**, not in gaze/blink/emote/kinetics vocabulary.

## Owners

### ToolBox owns

- current 3D EyeRig implementation donor: `pet-eye-rig.v6.js`;
- 3D FaceHost measurement / arbitrary biped host binding;
- Batch EyeRig Atlas and `kfb.eye-profile/0.1-candidate`;
- FrankenStein actor/look/face composition;
- 3D rig/mixer compatibility and motion regression;
- ToolBox Stage-First shell / 3D authoring integration.

### 2D Animation Studio owns

- native 2D source-art intake and source-exact component decomposition;
- 2D/2.5D part hierarchy, bind pose and bone/pivot calibration;
- non-destructive 2D deformers;
- SVG/browser renderer adapter;
- reusable 2D animation-module export;
- DocCheck Eumel first lab and later 2D source-derived actors.

### Shared contract

- `kfb.eye-rig.protocol/1`;
- `eyeFrame()` as the public eye-relative accessory seam;
- semantic eye commands/clips;
- normalized gaze range and kinetics inputs;
- KFB Cartoon Motion choreography / recovery rules.

No shared contract authorizes copying renderer-specific geometry into the other stack.

## Current shared EyeRig seam

3D donor:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

2D protocol:

`tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json`

2D adapter:

`tools/2D Animation Studio/shared/eye-rig/eye-rig-2d-adapter.v1.js`

Shared semantic clips:

`tools/2D Animation Studio/shared/eye-rig/eye-clips.v1.json`

The shared public vocabulary currently includes:

- `eyeFrame()`
- `setBlink()`
- `blinkNow()`
- `setGazeFollow()`
- `pointTo(nx, ny)`
- `applyEmote()`
- `setKinetics({a,c,j})`
- `setLife()`
- `update(dt)`

## Profile alignment without schema migration

Do **not** replace the current ToolBox `kfb.eye-profile/0.1-candidate` schema merely to add 2D.

Use a companion renderer-binding envelope when required:

```json
{
  "schema": "kfb.eye-binding/0.1-candidate",
  "profileRef": "…",
  "protocol": "kfb.eye-rig.protocol/1",
  "renderer": "threejs | svg2d",
  "hostRef": "…",
  "adapterRef": "…",
  "eyeFrame": {},
  "assetRefs": [],
  "status": "AUTO_CANDIDATE | APPROVED | UNSUPPORTED"
}
```

The **profile** expresses eye behavior/calibration.  
The **binding** tells one renderer how to realize it.

No global contract promotion until consumer proof exists.

## Motion / clip alignment

Eye clips should call semantic methods/channels rather than manipulate Three.js or SVG nodes directly.

Current 2D semantic clip source:

`tools/2D Animation Studio/shared/eye-rig/eye-clips.v1.json`

A future ToolBox resolver may consume the same clip payload, but this bridge does not claim that runtime exists yet.

Whole-body motion remains renderer/rig-family specific. Shared names such as `idle`, `walk`, `hop` do not imply one transform track can drive both a KayKit skeleton and an SVG cutout.

## Accessory alignment

`eyeFrame()` is the common attachment seam for:

- brows;
- lashes;
- glasses / sunglasses / protective goggles;
- masks;
- future eye-relative source modifiers.

The 2D Studio's richer DocCheck Eye/Face Modifier Atlas should contribute **source assets and placement recipes**, not replace ToolBox EyeRig control semantics.

The ToolBox may contribute 3D accessory donors and attachment behavior, not redraw DocCheck source artwork.

## Stage-First integration

The 2D Animation Studio is a linked specialty tool, not another panel that must be absorbed into Stage-First immediately.

Allowed near-term ToolBox integration:

- a ToolBox resource/tool link;
- import/export of named profile/binding/clip files;
- cross-render QA references;
- shared docs and source pins.

Not required:

- redesigning the current Stage-First shell;
- embedding the entire 2D Studio inside ToolBox;
- moving 2D source assets into ToolBox ownership.

## First cross-render proof

Use exactly two actors:

1. DocCheck Eumel in 2D Animation Studio;
2. one approved Rig_Medium actor in ToolBox EyeRig Batch.

Run the same semantic eye sequence:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

Pass criteria:

- both consume the same semantic command vocabulary;
- renderer-specific implementation remains separate;
- `eyeFrame()` remains usable for an accessory layer;
- no duplicate EyeRig owner appears;
- source art / GLB stays untouched;
- each host returns to a clean neutral state.

This proves protocol alignment. It does **not** prove pixel-identical eyes or common whole-body rigging.

## Relationship to Animation Lab

2D Animation Studio does not silently replace ToolBox Animation Lab.

- ToolBox Animation Lab keeps 3D clip playback/audit ownership on 3D actor composition.
- 2D Animation Studio owns SVG/cutout playback for its modules.
- both load `skills/kfb-cartoon-animation_v2.md`.
- semantic eye clips may be shared.
- broader shared whole-body clip contracts require separate rig-family evidence.

## Recovery links

- ToolBox: `tools/KFB-ToolBox/START_HERE.md`
- ToolBox EyeRig Batch: `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
- 2D Studio: `tools/2D Animation Studio/START_HERE.md`
- Eumel lab: `tools/2D Animation Studio/labs/eumel-rig-lab/RETURN.md`
