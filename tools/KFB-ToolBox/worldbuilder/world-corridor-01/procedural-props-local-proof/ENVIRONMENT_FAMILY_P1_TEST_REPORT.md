# TEST REPORT · ENVIRONMENT FAMILY P1 · ROCKS + BUSHES

Status: **SOURCE-ISOLATION PASS · GEOMETRY MODULE PASS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Scope

Form/geometry only. No material decision, no WorldBuilder placement integration, no second renderer owner.

Source-derived objects:
1. approved P0B tree · positive control;
2. P0B two-blob pebble;
3. K1 Golden organic boulder;
4. T3 Knetstrang accent rock;
5. T3 Knetstrang 2–3 lobe bush.

## Reusable implementation

Geometry-only module:
`environment-family-p1.mjs`

The module owns no:
- material;
- renderer;
- world placement;
- runtime loop.

It exposes source provenance plus deterministic geometry builders for the five source-backed family roles.

## Test history

### Initial inline source-isolation

Run `36959082570` / job `110688519147`: **PASS**

Artifact:
- id `11207511253`
- digest `sha256:e4f150c758aa3adcfb8dd6ae5534c9d6eab691425bb5f39b061128ae7ef08538`

This proved the five donor-derived objects and produced screenshot/state evidence.

### Modularization transport failure

After extracting the reusable geometry into `environment-family-p1.mjs`, the old direct-`file://` QA timed out waiting for readiness.

Classification:
**QA TRANSPORT ONLY**.

Reason:
the source-isolation HTML now imports a neighboring ES module. Direct local file module loading is not a valid requirement for this internal engineering surface.

No geometry, donor, product-runtime or material failure was proven.

### Repair Pass 1

Tested head:
`b56f77165b82113757c222b1cfb80ed350553215`

Run:
`36959777774`

Job:
`110690683930`

Result:
**SUCCESS**

Evidence artifact:
- id `11207815421`
- digest `sha256:95bc5a84d5d01e9ba1bf2dc10c56e8913aa04384906e162187616909d913e8c8`

QA uses an internal localhost static server only to allow the modular ES import. This is not a Georg-facing review surface and does not alter the zero-install rule for human review artifacts.

## Verified assertions

- 5 source-isolation objects present;
- `P0B_TREE` remains the positive control;
- geometry module consumed: `environment-family-p1.mjs`;
- P0B source blob = `0174e27c2ada67753f5e29161e4973087cf04d8e`;
- K1 rock source blob = `1cb40e45dc4d2ca20a554e4315b68f9331af4152`;
- T3 source blob = `a4be0b0fb8a8c5e7b8589495c71015d30de7a5f2`;
- WebGL2;
- 0 console errors;
- 0 page errors;
- 0 QA problems;
- explicit `noMaterialDecision: true`.

## Geometry facts

| Object | Vertices | Triangles | Unscaled bounds X × Y × Z |
|---|---:|---:|---|
| P0B_TREE | 1,067 | 1,704 | 1.377 × 2.180 × 1.152 |
| P0B_PEBBLE | 337 | 512 | 1.106 × 0.532 × 0.715 |
| K1_BOULDER | 2,160 | 720 | 1.091 × 0.968 × 1.130 |
| T3_ACCENT_ROCK | 362 | 720 | 9.460 × 6.245 × 10.202 |
| T3_BUSH | 1,086 | 2,160 | 7.264 × 4.387 × 6.790 |

The T3 source objects use their historical world-sized construction before review display scaling. These bounds are donor evidence, not final WC1 prop dimensions.

## Performance boundary

The source-isolation viewer rendered 11 calls / 6,378 triangles in hosted SwiftShader.

Its warmup FPS is **not representative performance evidence** and is not used for any product verdict.

## Classification

**SOURCE_DERIVED_GEOMETRY_PASS**

The P1 family is now safe to reuse as a geometry donor/module.

It is not yet:
- a final visual family acceptance;
- a material acceptance;
- a WC1 placement/density acceptance;
- a production building system.

## Exactly one next gate

**ENVIRONMENT FAMILY P2 · EXISTING PROP VOCABULARY EXTRACTION**

Recover the next useful small-prop families from already-existing KFB/KayKit sources before generating anything new. Prioritize logs/stumps/mushrooms/grass/markers only where real donor families are already present.

No material arbitration in P2.
