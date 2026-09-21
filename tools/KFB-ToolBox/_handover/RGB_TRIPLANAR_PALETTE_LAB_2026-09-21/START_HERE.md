# KFB ToolBox · One RGB Texture / Triplanar Palette Lab · START HERE

Status: **PUBLIC VERIFIED · HUMAN VISUAL GATE OPEN**  
Date: 2026-09-21  
Owner: **KFB ToolBox / material-surface compatibility lab**  
Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-rgb-triplanar-palette-2026-09-21`  
Draft PR: **#160**  
Stage: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/

## Outcome

Prove the "one texture for the game" technique on real KFB/KayKit sources without taking over a consumer runtime:

- left: exact source object with its original materials;
- right: the exact same mesh with one shared generated RGB texture;
- object-space triplanar projection;
- RGB channels remap to three live palette colors;
- one scale control;
- no UV authoring required by the adapter.

Real proof assets:
- KayKit Furniture Bits · `armchair.gltf`;
- KayKit RPG Tools Bits · `pencil_B_short.gltf`;
- KayKit Mystery · `GothGirl.glb`.

## Required donor

Do not replace this source:

`media/3D_Assets/pet-surface.v1.js`  
blob `ceffefe20ec46d82f6c0da0d6369be53f7ea4b24`

The candidate reuses its triplanar weighting and XY/XZ/YZ sampling grammar. The only new seam is RGB-channel → palette-weight remapping.

## Tested revision

Runtime/test source head recorded in the public marker:

`43d43f890f17c846232227c2cc153eb5aa28324a`

Cloudflare public proof was run from:

`c7f98ebe19e4401c00d516e45f4ec09fe896873d`

GitHub Actions run `35659617921`, public job `106531991125`: **41/41 PASS**, 0 failed resources, 0 page/console errors.

## Boundary

This is a compatibility/material experiment only.

It does **not**:
- replace `pet-surface.v1.js`;
- change actor, face, motion, physics or gameplay owners;
- change Asset Registry truth;
- promote the material into a consumer;
- merge PR #160.

## Human gate

Open the Stage and compare Armchair, Pencil and GothGirl.

Decision needed: is the common painted surface language useful enough to continue?

If yes, next gate is a **hybrid adapter** that preserves selected KayKit/material zones while applying the same shared brush field. Do not start that gate before the visual review.
