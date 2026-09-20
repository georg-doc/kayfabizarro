# Doccy · source intake

Status: **AWAITING AUTHORITATIVE SOURCE**  
Receiving tool: 2D Animation Studio  
Prepared: 2026-09-20

## Goal

Prepare Doccy — the DocCheck dog — as the first quadruped cutout actor that reuses the same source-first rig grammar as Eumel without copying Eumel's biped proportions.

## Source rule

Drop authoritative Doccy source files under:

`sources/`

Preferred: native Illustrator/SVG/PDF-compatible vector source. Preserve original filenames and source files byte-identically.

Do not generate missing body parts from a generic dog reference.

## First-pass audit

After source arrives:

1. inventory artboards/layers/groups/masks;
2. identify body, head, four limbs, eyes/pupils and any source-separated ears/tail/accessories;
3. measure relative proportions and outline families;
4. record overlap/draw order;
5. identify which hidden limb continuations are source-visible vs derived;
6. derive a symmetric grounded quadruped neutral bind;
7. map explicit shoulder/hip anchors;
8. use the shared `kfb.eye-rig.protocol/1` for gaze/blink/emote where the source supports it;
9. test only restrained bend/stretch/squash on wrapper bones;
10. promote accepted parts into a Doccy module only after browser/source comparison.

## Topology donor

`../../templates/DOCCY_QUADRUPED_RIG_TEMPLATE.v0.1.json`

This template is structure only. It is not visual truth.

## Intended consumers

- DocCheck project scenes;
- KFB Resident Atlas candidate after its own proof;
- selected KFB mini-games / Town / Travel only through named consumer handoffs.

## Hard boundary

No runtime implementation before source audit. No invented paws, ears, tail, joints or gait timings.
