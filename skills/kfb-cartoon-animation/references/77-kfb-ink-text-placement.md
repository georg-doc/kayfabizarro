# KFB Ink and Comic Text Placement

This preserves the detailed v2 rules for hand-drawn motion marks and onomatopoeia.

## Shared ink language

Visible comic marks may include:
cards · terrain contours · characters · emanata · stars · bursts · rings · motion lines · bubbles · onomatopoeia · VFX circles.

They should feel:
slightly irregular · alive · asymmetric · stable across frames · intentional.

Use contextual presets rather than one universal jitter amount.

## Stable seed

A contour/event keeps a stable seed for its life.

Allowed:
- transform;
- scale;
- rotation;
- opacity;
- controlled path deformation.

Forbidden:
- new random contour every frame;
- new random line width every frame;
- uncontrolled per-frame particle shape regeneration.

Recognition first; irregularity second.

## Movement words versus impact words

Movement words:
- align with trajectory;
- may stretch/italicize with motion;
- sit along/behind motion;
- pair with motion lines rather than an impact starburst.

Impact words:
- sit near semantic contact;
- are compact/readable;
- may pair with one impact burst;
- should not pair with a generic large ring.

## Simultaneous words

Normally allow one active readable sound word.

A new word replaces, waits for or suppresses the previous one according to event priority.

## Real text measurement

Measure with the real loaded font/weight.
Do not estimate width from character count.

## Transform separation

Use separate layers:
- outer wrapper = persistent position/translation;
- inner wrapper = animation scale/rotation/opacity.

Do not let an animated transform overwrite persistent placement.

## Placement candidates

Evaluate candidate placements such as:
- right of contact;
- left;
- above;
- below;
- along trajectory;
- opposite trajectory.

Reject placements that:
- overlap protected face/eyes/card/bubble/UI/action areas;
- leave viewport;
- collide with the active word;
- obscure the semantic contact.

If no safe placement exists, omit the word.

## Starting word timing

KFB v2 starting point:
- pop-in roughly 80–140 ms;
- readable hold roughly 350–650 ms;
- exit roughly 160–260 ms.

Do not make readable words disappear at spark speed.
