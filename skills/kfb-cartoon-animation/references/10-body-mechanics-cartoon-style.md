# Body Mechanics and Cartoon Style

## Order of operations

Cartoon style is controlled deformation of believable force.

Build in this order:
1. force and intention;
2. balance and support;
3. weight transfer/contact;
4. readable pose and silhouette;
5. timing and spacing;
6. arcs and momentum;
7. exaggeration;
8. asymmetry;
9. overlap/drag;
10. selective smear or extreme deformation.

Do not begin by adding random bounce or noise.

## Reference

Use video/self-reference to understand:
- where weight is supported;
- what initiates the action;
- center-of-mass path;
- joint order;
- acceleration/deceleration;
- contact duration;
- counter-rotation.

Do not mechanically trace reference when the design requires stylization.

## Strong pose

A strong pose has:
- one dominant intention;
- a readable silhouette;
- clear line of action;
- believable support;
- no accidental tangencies from the intended game camera.

## Shape change

Cartoon motion becomes readable when forms change under force:
- compress/load before release;
- stretch along travel;
- bend rigid-looking shapes into directed curves;
- overshoot after fast actions;
- settle with diminishing motion.

Preserve perceived mass unless deliberate squash/stretch is part of the style.

## Asymmetry

Perfect mirroring often looks procedural.
Use controlled left/right differences in:
- arm swing;
- shoulder height;
- step rhythm;
- head angle;
- recovery;
- accessory lag.

Asymmetry must preserve gameplay clarity and contact truth.

## Weight classes are style, not physics replacement

A heavy character may use:
- longer load;
- deeper compression;
- shorter airborne feel;
- slower recovery;
- larger secondary drag.

A springy/light character may use:
- quicker rebound;
- more vertical lift;
- larger overshoot;
- more elastic overlap.

World acceleration/collision facts remain authoritative.

## Character style profile

Treat cartoon personality as a presentation profile, not as a new state machine.

Useful dimensions:
- weightClass
- energy
- strideBias
- bounce
- squash
- stretch
- anticipation
- overshoot
- settle
- asymmetry
- armSwing
- torsoTwist
- headStabilization
- overlapDelay
- accessoryDrag
- turnSharpness
- stopCompression
- smearPolicy

Every dimension needs bounded ranges and a visual fixture.
There is no generic random-jitter parameter.

## Smear

Use a smear only when fast motion would otherwise lose the intended silhouette/read.
A smear is temporary readability, not permanent distortion.

## Responsiveness versus anticipation

For gameplay:
- authoritative movement may respond immediately;
- pelvis/torso/limbs can sell a compressed anticipation;
- use additive lean/overshoot and interruptible recovery;
- reserve long anticipation for actions where telegraphing is intentional gameplay.

Do not force player control to wait for cinematic body mechanics.
