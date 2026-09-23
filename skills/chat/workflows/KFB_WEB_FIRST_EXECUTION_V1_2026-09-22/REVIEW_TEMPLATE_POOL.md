# KFB Verified Review Artifact Pool

Status: **CURRENT SHARED REVIEW INFRASTRUCTURE**
Date: 2026-09-23
Owner: `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/`

## Purpose

Reuse accepted zero-install HTML review harnesses across KFB instead of inventing a new review UI for every visual or technical gate.

This pool extends the existing Web-First HTML-review workflow. It is **not** a runtime owner and does not replace project SSOTs, Resident Scene ownership, scene editors, movement, collision, cameras or gameplay.

Core rule:

> **Use an already human-accepted review harness first. Change only the subject-specific review seam.**

## Relation to Resident Scenes

The ownership model follows the same principle as:

- `tools/resident_atlas/SCENE_STAGING_CONTRACT.md`
- `tools/resident_atlas/modules/README.md`

A review artifact may own:

- review camera/orbit controls;
- named review viewpoints;
- layer visibility toggles;
- compact legend/status/source marker;
- optional debug overlays;
- review-only interaction needed to inspect the named gate.

A review artifact must **not** silently take ownership of:

- product movement;
- collision/contact;
- game camera;
- persistence;
- product UI;
- scene authoring;
- runtime state outside the named review target.

## Admission rule

A harness enters this pool only after:

1. it was generated from a named GitHub candidate;
2. Georg opened it directly in ChatGPT;
3. it materially helped the visual/technical decision;
4. Georg accepted the review format as useful;
5. the exact accepted artifact was archived on GitHub with source revision evidence.

Until then it is only a project-local review file.

## Current verified donor

### `threejs-focus-review-v1`

Status: **VERIFIED_DONOR · GEORG ACCEPTED**

Origin:
- project: KFB Racer / TARCH-0;
- Race Draft PR: #33;
- runtime represented: `b37cbad1038e669a0c9929d25789d54d0283b0fc`;
- accepted artifact commit: `georg-doc/KFB-Stunt-Car-Race@a8db68c15b658f9d96770946fe51c1f44915e74d`;
- acceptance evidence commit: `georg-doc/KFB-Stunt-Car-Race@5736f149fcf6e80ef80bf41b74e5be44bc758cbb`;
- artifact path:
  `_handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/review/KFB_Racer_TARCH0_R1_review.html`;
- original generated SHA-256:
  `a6f9f3d0ff06d5de04c50fcd40214021ceb6a2895412ea20749efdacd78f3ee5`.

Proven useful for:
- isolated 3D architecture review;
- track / terrain / tunnel seams;
- asset or rig source-object inspection;
- material / shader comparison where layer isolation matters;
- support / grounding / attachment inspection;
- focused technical geometry review.

Verified harness features:
- dominant interactive review canvas;
- named camera presets;
- orbit + zoom;
- independent layer toggles;
- optional debug overlay;
- compact legend;
- visible source/revision context;
- explicit in-scope / out-of-scope statement;
- zero Cloudflare dependency;
- zero local-server dependency.

## Adaptation seam

For a new `threejs-focus-review-v1` review, keep the accepted harness structure and surgically replace only:

1. review title / source marker / scope sentence;
2. subject data or source-backed scene builder;
3. named camera presets needed by the acceptance questions;
4. legend/layer names;
5. debug overlay relevant to the gate;
6. acceptance-specific diagnostics.

Keep unless the review target explicitly requires a change:

- panel placement and density;
- camera interaction grammar;
- button/toggle grammar;
- responsive behavior;
- status plaque structure;
- compact technical visual language.

Do not add generic dashboards, fake product chrome, decorative metrics or unrelated controls.

## Focus profiles

The same verified donor can be adapted into bounded focus profiles.

### A · `3d-architecture`

Use for:
- track / tunnel / bridge / room topology;
- terrain seams;
- support/contact geometry.

Typical presets:
`Mouth / Inside / Side / Top / Low side`.

Typical layers:
ground, support/background, structural frames, walls, debug seam.

### B · `source-object`

Use for:
- exact donor asset in isolation;
- rig / eye / attachment / vehicle / prop source proof.

Typical presets:
front, side, rear, close detail, top.

Typical layers:
mesh families, skeleton/anchors, attachment points, bounds/debug.

### C · `material-light`

Use for:
- shader/material strength;
- texture mapping;
- lighting comparison.

Typical controls:
material/source toggle, light donor toggle, neutral light, normals/roughness/debug.

The review harness stays the same; only subject-specific controls change.

### D · `motion-contact`

Use for:
- animation;
- grounding;
- landing/contact;
- trail or attachment continuity.

Add only the smallest motion controls needed for the gate:
play/pause, scrub/reset, debug contact/trajectory.

Do not turn the review artifact into a second gameplay runtime.

## Editor reviews

Interactive editor/productivity reviews such as WorldBuilder may need their own accepted donor because their gate is authoring behavior rather than object inspection.

Do **not** force `threejs-focus-review-v1` onto an editor.

When a WorldBuilder/ToolBox/editor review format is human-accepted and archived, register it as a separate verified donor in `review-templates/REGISTRY.json`.

## Review lifecycle

`implementation head → generate artifact from exact head → chat review → human feedback → source repair → regenerate`

After ACCEPT:

1. archive the exact accepted artifact in the project owner repo;
2. record source head + artifact hash + human result;
3. if the harness itself proved reusable, add/update its registry entry here;
4. proceed to the next project gate;
5. publish to Cloudflare only when persistent/shared public acceptance is actually useful.

## Artifact naming

Project-local reviews:

`<PROJECT>_<SLICE>_R<N>_review.html`

Examples:
- `KFB_Racer_TARCH0_R1_review.html`
- `WB1_TERRAIN_EDITOR_01_REVIEW.html`

The filename identifies the review instance. The registry ID identifies the reusable harness.

## Recovery

The artifact is disposable presentation; GitHub is source truth.

On timeout:

1. inspect the named source branch/head;
2. inspect whether the artifact/evidence write exists;
3. retry only if absent;
4. regenerate the chat artifact from the verified head;
5. never infer success from a timed-out UI.

## Registry

Machine-readable verified donors:

`review-templates/REGISTRY.json`
