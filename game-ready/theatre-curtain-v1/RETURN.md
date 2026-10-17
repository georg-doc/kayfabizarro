# KFB Theatre Curtain v1 · RETURN

**Date:** 2026-09-20  
**Owner:** KFB Game Dev Studio  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `chat/gds-theatre-curtain-v1-2026-09-20`  
**Draft PR:** #114  
**Technical status:** PUBLIC VERIFIED · HUMAN VISUAL/PHYSICS GATE OPEN  
**Live promotion:** NOT AUTHORIZED / NOT DONE

## Goal

Create one reusable theatre-curtain transition module from the verified Three.js cloth donor, using real KFB fabric sources and physically legible cloth gathering rather than the archived Birthday SVG/sheet approach.

## Actual result

The candidate contains:

- isolated pinned Three.js `webgpu_compute_cloth.html` donor proof;
- two independent left/right curtain panels;
- CPU Verlet/WebGL fallback with structural/shear/bend constraints;
- repeated top attachments plus visible rail/rings;
- opening/closing by moving supported top targets so the cloth gathers;
- weighted lower hem and deterministic idle wind;
- local/API impact;
- reset;
- exact KFB PBR fabric sets: `velour_velvet`, `rough_linen`, `hessian_230`, `crepe_satin`;
- reusable seam: `mount / update / setState / impulse / reset / dispose`.

The runtime remains an isolated transition overlay. It does not replace Travel/Race/Town renderers, gameplay physics, camera or persistence owners.

## Source / donor pins

Three.js donor:

- commit: `7300402f96c23bfa2174ffc0da01fb4e277d33da`
- version: `0.186.0`
- example: `examples/webgpu_compute_cloth.html`
- example blob: `0b3c18d87ac0d2428e6a558b6d09889e425dd537`

KFB implementation/runtime checkpoint:

- runtime implementation: `4e2de202f82b0f0d7dfa3241d6f0416a84eb15d0`
- test-only deterministic close wait repair: `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`

## Evidence

GitHub Actions run `35479125591` at tested branch head `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`:

- local-proof job `105993572063`: **22/22 PASS**
- public-proof job `105993698226`: **25/25 PASS**
- public Stage HTTP 200
- two panels
- 14 visible attachment rings
- open → open-rest
- impact
- real fabric switch
- close → closed-wind
- reset
- isolated donor route + exact donor pin
- zero failed main/public resources
- zero page/console errors

Artifacts:

- local `10595067437`, digest `sha256:9ea22f1e7c72e5c6b7e355e145497b80db483c9f45857654dcead97d20b2df23`
- public `10594504795`, digest `sha256:35909487ab9e8eb805801d3a5a71b92dfb0a7ec0dcdbc8f5434a23f435ad1e88`

## Fixed Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

Public browser automation has opened and exercised this exact route. Georg visual acceptance is still pending.

## Preserved boundaries

- Birthday remains archived failure history / donor requirements only.
- No consumer integration yet.
- No production WebGPU curtain backend claim yet.
- No fake burn holes, stains, torn edges or aging decals before the cloth look is accepted.
- No card breach/ripple/dissolve yet.
- No lower-third tieback/swag preset yet.
- Shader-pool / Texture Cauldron research remains deferred as a separate slice.

## One next gate

**Georg reviews the curtain alone on Stage:** weight/folds, subtle idle wind, physical side gathering, closing, impact response and the fabric choice.

Do not merge, integrate into a scene, add aging, or start card-breach effects before that gate.
