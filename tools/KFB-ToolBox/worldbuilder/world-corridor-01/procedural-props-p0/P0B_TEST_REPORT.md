# WC1 Procedural Props P0B · Soft-Form Donor Proof

Status: **TECHNICAL PASS · DONOR STYLE GRAMMAR CONFIRMED · KFB STYLE STILL OPEN**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
Draft PR: #311
Tested head: `a3a13a9618e1fa103a3f422d17feb5405dc9ec64`

## Why P0B exists

After the first P0 source-isolation proof, the Hivebound author clarified the intended visual direction:
- cozy / cute / relaxing;
- smooth stylized 3D;
- soft rounded "cushion" forms;
- pastel / warm light;
- explicitly **not low-poly**.

The repository source confirms that direction through rounded/bevelled hexes, bent tapered grass, scaled sphere pebbles, flared lathe trunks and overlapping smooth blob crowns.

P0B therefore corrects the first intentionally crude geometry without changing the architecture.

## Donor

- `zernonia/hivebound`
- pin `be10166e44f3d89db922ebb90671c10b89cd3e62`
- MIT
- pattern donor only; no Nuxt/TresJS runtime adoption.

## Browser evidence

GitHub Actions:
- run `36907603447`
- job `110521959500`
- conclusion **SUCCESS**
- artifact `11185641597`
- digest `sha256:4fe41f397f5d073fceed3cba63ebdcf899e1d663212fa54809cb5f9ba26a0813`

P0B browser assertions:
- 3 families;
- 16 soft tufts;
- 16 pebble clusters;
- 16 soft trees;
- 48 total instances;
- 7 draw calls;
- 40,354 triangles;
- WebGL2;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

SwiftShader warmup FPS is not representative product-performance evidence.

## Visual review

Compared with P0:
- tufts read as soft bent blades rather than spikes;
- pebble clusters read as rounded objects rather than faceted rocks;
- trees read as soft layered/blob canopies on flared trunks rather than polygon balls;
- the overall result now matches the donor's stated smooth-stylized construction method much more closely.

Still open:
- exact KFB silhouette language;
- KFB material treatment;
- whether these families disappear harmoniously into WC1 at real world scale;
- representative M1 Max frame cost after Clay002-lite is applied.

These source-isolation objects are not final KFB art.

## Decision

The useful donor is not "low-poly procedural generation".
It is:

**soft procedural geometry + deterministic variation + family instancing + cheap material treatment.**

Exactly one next productive gate:
mount P0B behind the existing WC1 WorldBuilder scene as a bounded diagnostic add-on, apply the current Clay002 Global Clay Lite seam, and compare visual fit / delta cost in the same camera. No new runtime owner and no Stage.
