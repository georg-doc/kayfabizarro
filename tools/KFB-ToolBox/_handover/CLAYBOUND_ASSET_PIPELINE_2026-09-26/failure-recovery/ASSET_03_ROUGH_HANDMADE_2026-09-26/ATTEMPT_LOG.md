# Attempt Log · Asset 03

## Initial target

**Rough / porous clay seamless texture** adapted to Georg's requested **coarse handmade clay modelling** use.

Production form chosen:
- 2048×2048;
- 16-bit grayscale;
- Non-Color;
- relative meso-height source;
- no physical displacement calibration claim;
- no baked light;
- no fingerprint-loop overlay.

## r1 · initial

Method:
- periodic spectral macro / meso / micro fields;
- toroidal broad gesture marks;
- sparse pores.

Result:
- tile QA: PASS;
- visual read: too cloud/noise/grunge-like for the intended hand-modelled clay language.

Decision:
**REPAIR 1**.

Artifact SHA-256:
`60b48cd4133eb2f130457808860dfa7b1a3555860e3bbf69262d664cc41b130e`

## r2 · repair 1

Change:
- reduced micro-noise;
- gesture and meso structure increased;
- restrained dynamic range.

QA:
- X edge mean delta: 154.28
- Y edge mean delta: 160.75
- local X: 171.83
- local Y: 170.76
- X seam/local: **0.898**
- Y seam/local: **0.941**
- half-offset X: **1.104**
- half-offset Y: **1.268**
- threshold: **< 1.35**
- tile gate: **PASS**

Visual result:
still more cloud/noise-like than the preferred broad sculpted modelling language.

Decision:
**REPAIR 2**.

Artifact SHA-256:
`f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69`

## r3 · repair 2

Change:
- replaced most cloud-noise dominance with broad Bezier kneading/compression strokes;
- paired shallow troughs;
- sparse pressed patches / pores;
- periodic 3×3 authoring concept.

QA:
- X edge mean delta: 291.49
- Y edge mean delta: 277.79
- local X: 137.30
- local Y: 133.60
- X seam/local: **2.123**
- Y seam/local: **2.079**
- half-offset X: **1.265**
- half-offset Y: **1.184**
- threshold: **< 1.35**
- tile gate: **NEEDS FIX**

Visual result:
broad handmade modelling direction improved, but hard edge continuity regressed.

Artifact SHA-256:
`1b1a595ac8c6c88e52a42bea97a43f804fa6bf3dcfdb1e2176f8e7acc612fe8f`

## Stop

Two repair passes have been spent on the same acceptance gate.

Per KFB rule:
**STOP · preserve candidate · no r4 patch in this slice.**
