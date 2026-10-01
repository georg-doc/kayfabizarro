# Clay002 · Maßstab korrigieren

Status: **VISUAL CORRECTION READY · NO PERFORMANCE RETEST REQUIRED YET**
Date: 2026-10-02

## Georg's visual decision

Current visual ranking:
1. **Original procedural Clay = clearly best**
2. **Derek RGB = okay / usable lightweight alternative**
3. **Clay002 current application = rejected**

Important:
Clay002 itself is **not** rejected as a source texture.

The rejected result is specifically:
- downsampled to 512²;
- projected with world scale 0.62;
- repeat period about 1 / 0.62 = **1.61 m**;
- visible wallpaper/repetition across large island surfaces.

Screenshot/review conclusion:
**the texture is simply projected too small in world space.**

## Verified source facts

Clay002 source files in GitHub:
- diffuse: 1024×1024 · blob `8e7dc121cbf97154b6c67674998bb3d7c5abcd89`
- roughness: 1024×1024 · blob `7c879ace8ef221531e9fa715063997364b5d13b3`

So the source is not intrinsically a 512² tiny tile. The previous test deliberately downsampled it.

## Correction

Do not add multi-texture anti-repeat logic yet.

First test the simple physical-scale correction:

- source resolution: **1024²**
- one global shared texture only
- same triplanar shader
- compare repeat periods:
  - **6 m**
  - **9 m**
  - **12 m**

This keeps:
- one global texture;
- no extra texture memory from a second tile;
- no additional blending samples;
- source asset colour authoritative.

Only if 6–12 m still shows unacceptable repetition should a second rotated/scaled sample of the same texture be considered.

## Hybrid direction retained

Near / Hero:
- original procedural Clay remains the target look.

Mid / Far:
- Clay002 may still work after scale correction;
- Derek RGB remains an acceptable lightweight fallback.

No decision is made yet to replace Original Clay globally.

## Performance note

The latest "fair" Derek retest is still non-representative for absolute performance because Clay-off itself was only 6.6 fps / 151 ms and the render signature changed materially from the healthy run.

Do not use those absolute numbers to rank the looks.

The earlier healthy Global Clay Lite result remains valid evidence that the lightweight texture path itself can be cheap:
- Clay002 512: 92.1 fps / 10.85 ms;
- Clay off: 89.6 fps / 11.16 ms.

## Georg-facing visual test

Artifact:
`KFB_Clay002_Massstab_Doppelklick.html`

SHA-256:
`722061456925e362837b9c0bf65c64441e63d9ae82d326628c987aba883821db`

Use only for visual scale choice:
- Original Clay;
- Clay002 1024² · 6 m;
- Clay002 1024² · 9 m;
- Clay002 1024² · 12 m;
- Derek RGB.

No JSON/performance run is required for this step.

## Exactly one next action

Georg selects the best Clay002 physical scale — **6 m / 9 m / 12 m / none**.

If none works, keep Derek as the lightweight fallback and do not spend another pass forcing Clay002.
