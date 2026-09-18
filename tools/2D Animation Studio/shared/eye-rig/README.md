# KFB EyeRig Protocol v1 · 2D / 3D shared control surface

## Decision

2D Animation Studio does **not** invent a second eye-control grammar.

The shared control surface is taken from the current 3D **EyeRig v6** donor in:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

The 2D renderer implements the same semantic calls. Shared clips therefore address gaze/blink/emote/kinetics/life semantics; only the rendering adapter differs.

## Common public calls

- `eyeFrame()`
- `setBlink(...)`
- `blinkNow()`
- `setGazeFollow(on)`
- `pointTo(nx, ny)`
- `applyEmote(...)`
- `setKinetics({a,c,j})`
- `setLife(...)`
- `update(dt)`

This is the important seam for the user's goal: **2D and 3D should differ mainly in output/rendering, not in clip vocabulary.**

## eyeFrame

The 3D donor already defines `eyeFrame()` as the public eye-relative anchor for brows, nose and later glasses/accessories, returning left/right positions, radius, parent, rig, generation and unit.

The 2D adapter mirrors that shape.

## Current 2D limitation

The AD source presently exposes separate eye whites/outlines and pupils, but no confirmed native lid geometry in the PDF-visible layer. Therefore v1 blink/lid behavior uses a reversible wrapper-scale fallback. This is **not** promoted as final visual canon.

The richer source/private Illustrator data and other eye modifiers (rings, eyewear, goggles, etc.) remain a separate asset-resolution task. When those source parts are identified they plug into the same `eyeFrame()` seam rather than changing the control protocol.

## Shared motion rule

Follow `skills/kfb-cartoon-animation_v2.md`:

`cause → anticipation → action → impact → follow-through → recovery`

Idle life remains subordinate; blink/gaze should not become permanent visual noise.
