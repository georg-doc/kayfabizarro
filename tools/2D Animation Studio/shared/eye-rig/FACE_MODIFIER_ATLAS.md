# Eye / Face Modifier Atlas · planned contract

Status: PREPARATION / source inventory incomplete.

## Goal

Provide a reusable modifier library above the common EyeRig protocol.

Candidate categories:

```text
eye-base
pupil
upper-lid / lower-lid
curved-eye-ring
brow
lashes
sunglasses
protective-goggles
welder-goggles
mask
headwear
nose / moustache / other face overlay
```

## Attachment

Every eye-relative modifier uses:

`eyeFrame() → left / right / radius / parent / rig / gen / unit`

No modifier should hard-code Eumel pixel positions when a normalized eye-frame placement is possible.

## Source rule

Native DocCheck Illustrator assets win for 2D visual identity. Existing KFB 3D assets and FrankenStein modules are donors for **control logic and attachment semantics**, not a license to replace the DocCheck drawing with generic 3D shapes.

## Status rule

A modifier becomes reusable only after:

- source identity pinned;
- layer/group geometry resolved;
- left/right/paired behavior defined;
- occlusion order documented;
- eyeFrame placement tested;
- browser evidence recorded.
