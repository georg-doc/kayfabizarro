# KFB Eye Actor Studio · Living Design Line

**Status:** EXPERIMENTAL / additive ToolBox authoring line  
**Motto:** **Eye — including lids & brows — as actors.**

This file records the evolving Eye Actor design line. It does not replace EyeRig v6, BrowRig v2, Batch EyeRig profiles, FrankenStein ownership or the shared semantic EyeRig protocol.

## 1 · Core actor system

One Eye Actor presentation may combine:
- eyeballs;
- four independent lids;
- pupils;
- brows;
- gaze / point target;
- under-eye material state;
- pupil/catchlight FX;
- eye-relative 3D emanata.

The first rule is performance, not decoration: blink, squint, one-eye aim, skeptical asymmetry and tired weight should be authorable as named reusable poses.

## 2 · Geometry families

### Existing
EyeRig v6 shell lids remain the exact behavior donor.

### Candidate
Clay Lids add:
- thickness;
- rounded outer mass;
- hard inner occlusion rim;
- concave/convex opening curve.

They remain attached to the same four EyeRig lid transforms.

Future geometry work should compare rather than replace:
- shell;
- clay;
- optional stylized special-effect eyelids.

## 3 · Pose shelf

Candidate Eye Actor poses:
`neutral · skeptical · aimLeft · aimRight · tired · angry · surprised`.

Stable EyeRig expression IDs remain unchanged underneath.

Future pose metadata may include:
- intended body-motion family;
- interruptibility;
- hold/release time;
- emanata state;
- eye material state.

Gameplay owns the actual transition/trigger.

## 4 · Batch / host classes

Planned receiving sequence:
1. Rig_Medium;
2. Rig_Large;
3. Legacy;
4. static props;
5. vehicles;
6. plants/living props.

The existing EyeRig Batch remains the profile/data lane. Eye Actor Studio is intended to become its richer visual authoring front end, not a second profile database.

## 5 · Materials and colour

Resolver:
`face > body > main > fallback`.

Real actor goal:
- same texture family as face;
- same texel density/scale;
- measured source provenance visible;
- overrides explicit.

KayKit palette logic is the current concrete colour donor family. The requested Cologne world/look source must be pinned before it can become part of a shared colour canon.

## 6 · Lighting / shading

Eyes should participate in the host lighting instead of reading as self-lit white plastic.

Current candidate:
- off-white sclera;
- restrained clearcoat;
- higher roughness;
- common scene lighting.

Later:
- eye-ring / under-eye shader;
- tired shadow strength per pose;
- material-aware catchlights.

## 7 · Eye-relative 3D emanata

Attachment seam:
`EyeRig.eyeFrame()`.

First candidates:
- sweat drop;
- soot dots.

Later candidates must stay authored, small and deformable. Avoid generic billboard/confetti effects where a real tiny 3D cartoon object carries the visual idea better.

## 8 · Special pupil / iris language

Backlog:
- spiral/dizzy;
- hearts;
- oversized cartoon pupils;
- drawn catchlight geometry;
- lighting specular + drawn highlight combination.

Hard rule:
special pupil geometry never pierces lids/brows.

## 9 · Vehicle/prop use

Props:
toaster/radio only after a measured face plane/anchor exists.

Vehicles:
- front/headlight eye preset;
- rear/trunk eye preset;
- optional mouth anchor later.

Eye Actor owns neither lights nor physics.

## 10 · Current evidence

Implementation: `f6fcdfbf6ec086759b322d96c7a312dabc991c8a`  
Tested head: `2a79d398fad090aabf56d5a5d17f37fd97fa4df7`  
Run: `35557143481`  
Result: **20/20 static · 5/5 syntax · 24/24 desktop/mobile WebGL PASS**.

Public Stage remains blocked by the stacked PR Cloudflare build.

## 11 · Current visual questions

- Are lower Clay lids volumetric enough or too rim-like?
- Is current pupil clearance visually sufficient?
- Should BrowRig thickness increase automatically in Clay mode?
- How much under-eye shadow reads as expression rather than dirt?
- Which catchlight blend gives drawn charm without breaking shared lighting?

## 12 · Next gate

`EAS-PUB-1` — publication recovery only, then Georg visual review.
