# Eye Actor Contract v0

Status: CANDIDATE DESIGN CONTRACT.

## Core idea

The eye is a small actor system, not an eyeball with decoration.

Components:
- left/right eyeballs;
- four independent eyelids;
- left/right pupils;
- BrowRig pair;
- optional under-eye shading;
- optional eye-relative emanata;
- later mouth/face consumers via existing FrankenStein seams.

## Clay eyelid option

Existing EyeRig v6 remains the behavior owner. The candidate Clay-Lid adapter changes only lid geometry.

Required visual grammar:
- visible outer volume;
- rounded outer surface;
- hard inner occlusion rim toward the eyeball;
- pupil stays behind the lid rim;
- upper/lower lids remain independent per eye;
- existing EyeRig slant remains usable;
- candidate lid curve adds concave/convex opening shape;
- no paper-thin shell look.

## Color/material resolution

Default source priority:
**face > body > main color > explicit fallback**.

Lids inherit the resolved face family unless explicitly overridden.

Texture/UV rule for real actors:
- same source texture family as the face;
- same texel scale as face;
- no independent random lid texture;
- modal palette sampling preferred for flat KayKit palette textures;
- debug must expose source, resolved value and override.

## Pose layer

Existing six canonical EyeRig expression IDs remain untouched.

Eye Actor poses are a higher-level candidate layer combining:
- EyeRig lid arrays / slant / gaze / pupil;
- BrowRig preset;
- optional point target;
- later temporary shader/emanata state.

First candidate poses:
- skeptical blink;
- combat aim left/right;
- tired;
- angry;
- surprised.

## Body animation coupling

Consumers may trigger named Eye Actor poses from existing motion families, but eye state never becomes movement/gameplay owner.

Examples:
- combat aim -> aim pose;
- braking -> worried/tight lids;
- impact/stun -> later dizzy eye FX;
- idle tired -> tired pose;
- speech doubt -> skeptical blink.

## Host classes

Planned adapters, in order:
1. current Rig_Medium / Rig_Large profiles through existing Batch EyeRig;
2. LegacyFaceHost through existing Legacy assembly;
3. static props (toaster/radio) with explicit measured face plane/anchor;
4. vehicles at verified front/rear anchors;
5. plants / living props.

No host gets guessed anchors when a measured owner exists.

## Eye-relative emanata

`eyeFrame()` is the starting attachment seam.

Candidate 3D emanata:
- sweat drop: deformable mini 3D tear;
- soot dots: 3–4 matte black instanced dots;
- later anger vein / surprise marks / question marks only from existing KFB Emanata canon.

Emanata remain presentation. They read state and never write gameplay state.

## Future eye FX

Candidate modelled pupil/iris effects:
- spiral/dizzy;
- heart eyes;
- oversized SpongeBob-like pupils;
- drawn-looking white catchlights + lighting-driven specular highlight.

These require separate visual proof and must not poke through Clay Lids.
