# Batch EyeRig · Deferred Feature Backlog · 2026-09-19

Status: **BACKLOG ONLY · NOT CURRENT SLICE**  
Owner: KFB ToolBox / Rigging  
Current class lane: `Rig_Medium`

## Why this file exists

The current slice deliberately stops at one reusable EyeRig owner plus a better authoring/batch surface. The items below are real requirements, but they must not be mixed into the current Medium-default proof before the existing eye rigging is stable across a varied actor sample.

## Eye-shape vNext

Already reused now:

- Frankensteining donor `frizzlegraft-v1/eyeoval.v1.js`;
- width;
- height;
- depth;
- mirrored inward/outward tilt.

Still missing:

- separate **top / bottom eye contour** shaping;
- independent upper/lower silhouette curvature;
- asymmetric per-eye contour overrides;
- a semantic shape preset layer above raw numeric controls.

Do not implement this as a second EyeRig. Extend the current EyeRig/sidecar shape contract only after the Medium sample proves the present oval controls.

## Mouth Batch

Future sibling lane to Batch EyeRig:

`source actor → mouth/viseme host → reusable mouth owner → class default → character override → session adjustment → batch export`.

Requirements:

- reuse the existing KFB mouth/viseme owner;
- class-level defaults plus actor overrides;
- import/export compatible with the same batch inheritance grammar;
- screenshot / expression QA;
- no destructive edits to canonical actor assets.

## Optional Nose / Brow grafts

Backlog only.

- Brows should consume the existing public EyeRig `eyeFrame()` anchor where appropriate.
- Nose remains optional and character-dependent.
- Neither should be silently added to every actor.
- Preserve actor-native geometry unless an explicit graft profile enables replacement/overlay.

## Vehicle EyeRig

Future host adapter, not a new eye implementation.

Preferred target: KayKit vehicles first.

Concept:

`Vehicle front / headlights → measured headlight pair host → existing EyeRig → vehicle-specific class seed`.

Rules:

- classic cartoon-car logic: large eyes aligned primarily to front headlights / lamp pair;
- source vehicle remains immutable;
- host adapter owns front/headlight measurement;
- EyeRig remains the only eye renderer/behavior owner;
- batch authoring should reuse the same semantic controls and import/export model as character EyeRig;
- do not assume all vehicles have symmetric headlights; fail closed to manual anchors when measurement confidence is low.

## Later object hosts

Only after character + vehicle proof:

- Living Plants;
- selected props/objects;
- other non-humanoid hosts with a meaningful paired front feature.

## Current next gate

Before any backlog item above:

1. use Georg's accepted `Rig_Medium` authoring seed;
2. verify `eyeoval.v1`, Life/Pointer/Fixed tracking and Batch I/O in the Stage;
3. run a varied 5–8 actor `Rig_Medium` sample;
4. preserve per-character overrides;
5. only then expand the class batch.
