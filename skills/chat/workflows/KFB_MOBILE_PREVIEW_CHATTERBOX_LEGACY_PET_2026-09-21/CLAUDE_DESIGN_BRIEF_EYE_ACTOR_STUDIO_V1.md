# Claude Design Brief · KFB Eye Actor Studio v1

**Status:** READY BRIEF · donor-first visual system.
**Owner:** KFB ToolBox / existing EyeRig authoring line.
**Current 3D donor:** EyeRig v6.
**Current brow donor:** BrowRig v2.
**Current batch owner:** Batch EyeRig Atlas.
**Do not create a second eye-control grammar.**

## Goal

Build a compact Eye Actor Studio where eyes, four eyelids and brows are treated as a coordinated acting system across characters, props, vehicles and later living scenery.

The first Claude Design visual gate is not a new character. It is the **eye system itself**.

## Read first

- current EyeRig v6 source;
- BrowRig v2;
- Batch EyeRig START_HERE and reviewed profiles;
- shared `kfb.eye-rig.protocol/1`;
- current Eye Actor Contract in this slice;
- KFB Toy/Clay style rules;
- anti-slop visual guardrails.

## Exact donor gate

Before styling:
1. show exact EyeRig v6 behavior on the neutral studio FaceHost;
2. show exact BrowRig v2 with neutral + skeptical;
3. capture donor screenshot;
4. then enable Clay Lids.

Loading the modules is not evidence.

## Visual target

Clay lids:
- clearly thicker than v6 shell lids;
- rounded external mass;
- crisp inner eye-facing rim;
- pupil never pierces the lid;
- upper/lower and left/right remain individually readable;
- slant and concave/convex opening shape must remain possible.

Brows:
- retain BrowRig v2 volumetric/tube capability;
- no flat sticker eyebrows as the Clay default.

Eye surface:
- stop reading as self-lit white plastic;
- use the same scene light and material family as the host;
- preserve readable off-white sclera;
- modelled pupil/catchlight options remain subordinate to lid occlusion.

## Required studio views

- front;
- 3/4 left;
- 3/4 right;
- side;
- mobile 390×844.

Required toggles:
- EyeRig v6 donor / Clay Lids;
- natural / material-zone debug;
- pose;
- thickness;
- concave/convex curve;
- under-eye shadow preview;
- emanata none / sweat / soot.

## Material debug

Show explicit resolver:
`face > body > main`.

For real actor batches, show:
- source mesh/material;
- measured face color;
- resolver source;
- lid resolved color;
- UV/texel scale status;
- explicit override if present.

Do not hide uncertainty behind a hex value.

## Pose shelf

Keep canonical six expressions intact. Add a separate pose shelf:
- skeptical blink;
- combat aim left;
- combat aim right;
- tired;
- angry;
- surprised.

Later:
- dizzy;
- heart eyes;
- oversized cartoon pupil;
- impact soot.

## Emanata

Treat emanata as tiny authored 3D cartoon props anchored from `eyeFrame()`.

First models:
- sweat tear;
- 3–4 soot dots.

No generic confetti tile system.

## Batch lane

The Studio eventually becomes the front end for the existing EyeRig Batch:
- Rig_Medium;
- Rig_Large;
- Legacy;
- props;
- vehicles;
- plants.

Do not duplicate profile storage or actor discovery.

## Vehicle lane

Later host presets:
- front/headlight eyes;
- rear/trunk eyes;
- optional mouth anchor.

Vehicle movement, lights and gameplay remain consumer-owned.

## Color canon note

Georg's direction is to use KayKit palette logic plus the current Cologne world/look work as the future color canon rather than washed-out legacy KFB pastels.

The exact Cologne source pin is not resolved under the spoken label “Cologne Wastefax” in the current repo. Do not hardcode a guessed palette; route this through the existing World Color/Lighting Cohesion owner after the exact source is identified.

## First acceptance question

**Do the Clay Lids read as expressive clay/cartoon forms with real volume while preserving the clean hard occlusion edge against the eyeball?**
