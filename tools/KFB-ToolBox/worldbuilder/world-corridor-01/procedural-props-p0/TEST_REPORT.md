# WC1 Procedural Props P0 · Source Isolation Test

Status: **TECHNICAL PASS · VISUAL STYLE NOT ACCEPTED**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
Draft PR: #311
Tested head: `94dc51128e9c4266cc880d216e9c9ad9872a60b9`

## Donor proof

External pattern donor:
- repo: `zernonia/hivebound`
- pin: `be10166e44f3d89db922ebb90671c10b89cd3e62`
- license: MIT

Only these patterns are adapted:
- generated primitive/custom geometry;
- merged geometry per prop family;
- deterministic seeded variation;
- `InstancedMesh`;
- cheap vertex colour + per-instance tint.

No Nuxt/TresJS runtime was imported and no KFB owner was replaced.

## Browser evidence

GitHub Actions:
- run: `36906220603`
- job: `110517315973`
- conclusion: **SUCCESS**
- artifact: `11185175509`
- digest: `sha256:bce7d13e462951681a5d16d09369dc2743f36625a46c9aa11afbe2792dede3f0`

Headed/visible-equivalent browser assertions from Playwright/Chromium:
- 3 procedural families;
- 16 TUFT instances;
- 16 ROCK instances;
- 16 TREE instances;
- 48 total instances;
- 7 draw calls;
- 6,826 triangles;
- WebGL2;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

The absolute `fpsWarmup` value from SwiftShader is **not product-performance evidence**.

## Visual review

The screenshot proves the source object in isolation before integration.

Observed:
- deterministic family variation reads clearly;
- instancing/tint mechanism works;
- tree trunk/crown separation works;
- geometry is cheap and coherent enough for a pattern proof;
- current shapes still read as generic low-poly, especially rocks/trees;
- this is **not KFB visual acceptance** and must not be promoted as a finished prop style.

## Gate result

**SOURCE_ISOLATION_TECH_PASS / VISUAL_STYLE_OPEN**

The next productive step may integrate this mechanism only as a bounded WorldBuilder prop-grammar experiment. It must use the existing material/WorldBuilder owners and must not present these exact shapes as finished KFB design.
