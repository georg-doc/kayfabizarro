# 2D Animation Studio ↔ KFB ToolBox Integration

Status: **CURRENT ALIGNMENT**  
Updated: 2026-09-18

Authoritative cross-tool bridge:

`tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`

## Studio role

2D Animation Studio remains the owner of source-exact 2D assets, cutout bind/bone data, 2D deformers and SVG/browser adapters.

ToolBox remains the owner of current 3D EyeRig v6 / FaceHost / EyeRig Batch and 3D actor composition.

## Shared seam

`kfb.eye-rig.protocol/1`

Shared semantics:

`eyeFrame · blink · gaze · emote · kinetics · life · update`

Current Studio implementation:

- `shared/eye-rig/eye-rig-protocol.v1.json`
- `shared/eye-rig/eye-rig-2d-adapter.v1.js`
- `shared/eye-rig/eye-clips.v1.json`

3D donor remains:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

## Integration principle

```text
semantic profile / clip
      ↓
renderer binding
      ├── Three.js / ToolBox
      └── SVG2D / 2D Animation Studio
```

Source geometry is never the shared layer.

## Current proof target

Eumel 2D + one ToolBox Rig_Medium actor should consume the same semantic eye sequence before any broader cross-render motion schema is promoted.


## Implemented proof

`proofs/cross-render-eye-v1/`

Actors:

- 2D: DocCheck Eumel, source-exact Illustrator/PDF vectors;
- 3D: FrizzleBob Driver Graft, real `Rig_Medium` host + ToolBox EyeRig v6.

Both are driven by:

- `shared/eye-rig/eye-clips.v1.json`;
- `shared/eye-rig/eye-sequence-runner.v1.js`.

Exact sequence:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

Static sanity is PASS; real browser QA remains open.
