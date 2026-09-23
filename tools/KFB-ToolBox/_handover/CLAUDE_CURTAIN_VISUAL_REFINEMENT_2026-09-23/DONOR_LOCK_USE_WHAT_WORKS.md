# DONOR LOCK · Theatre Curtain v1 · USE WHAT WORKS

**Status:** HARD GATE · SOURCE COPY FIRST · NO RECONSTRUCTION

## Canonical skill

Read first:

`skills/session-entry-use-what-works_v1.md`

Core rule:

> **Wenn eine Vorlage funktioniert, wird sie kopiert — nicht nachgebaut, nicht nachgerechnet.**

For this slice that means:

> **Theatre Curtain v1 is the source. Any new SVG/CSS/Canvas/2D/flat-plane curtain is invalid before review begins.**

## Exact donor branch

`chat/gds-theatre-curtain-v1-2026-09-20`

Current donor head:

`cd9c04cbf009b1211b9b6b008162b9d322d6e152`

Draft PR:

`#114`

## Exact files to copy / consume

### Runtime owner

`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

This file is the curtain.

It contains:
- `Panel` particle grid;
- Verlet/inertia step;
- structural/shear/bend springs;
- supported top hooks;
- physical `target(i, open)` gathering;
- real Three.js `BufferGeometry`;
- real PBR `MeshPhysicalMaterial`;
- real rail + torus rings;
- `mount / update / setState / impulse / reset / dispose`.

### Proven Stage adapter

`kfb-hub/stage/game-dev-studio/theatre-curtain-v1/lab.mjs`

This mounts the runtime directly with:

`mountKFBTheatreCurtain(stage,{texture:'velour_velvet',tint:'#8c3f37',wind:.62})`

### Proven Stage shell

`kfb-hub/stage/game-dev-studio/theatre-curtain-v1/index.html`

The HTML only hosts the real Three.js runtime.
It is not the curtain implementation.

## Mandatory first output

Before any redesign:

1. copy/consume the exact runtime donor;
2. mount it in the Claude session;
3. show **the same two physical cloth panels, rail/rings, real folds and open/close gathering**;
4. report the donor snapshot / equivalent source output;
5. only after Georg confirms that the source donor is visibly back may visual refinement start.

## Source-behaviour proof

The donor's own runtime snapshot exposes:

- `backend: CPU Verlet · WebGL fallback`
- `panelCount: 2`
- visible ring count;
- `openProgress`;
- current fabric;
- `sourcePin`;
- API list.

A reconstruction that cannot produce the donor's own runtime behaviour/snapshot is not accepted as reuse.

## Forbidden output

Reject immediately if Claude creates any of these as the curtain itself:

- SVG curtain;
- CSS curtain;
- Canvas-2D curtain;
- HTML stripes/folds;
- gradient rectangles;
- flat planes pretending to be cloth;
- a second cloth solver;
- a slider that merely changes 2D shapes;
- an "invisible cord" substitute instead of using the real v1 cloth first;
- recreated rail/frame instead of consuming the source runtime.

## Allowed seam

Only after exact donor proof:

- presentation-only replacement/addition for rod/end caps/brackets/rings;
- donor-compatible tieback anchor/constraint/choreography;
- minimal donor-compatible gathering refinements;
- crease/artifact repair inside the same cloth owner.

The seam must be named explicitly:

`HERE ENDS THE COPIED V1 DONOR / HERE BEGINS THE REFINEMENT`

## No patching of the rejected Claude attempt

Do not repair the current SVG/2D result.

Delete/abandon it and restart from the donor branch/runtime.

That is Rule 4 of Use What Works.
