# KFB shared shadow / contact rendering recipe

Status: **CURRENT SHARED RECIPE / ROUTER**  
Date: 2026-09-29  
Scope: KFB three.js presentation surfaces (WorldBuilder, ToolBox, Resident/OMS previews, clay-world consumers)  
Owner boundary: this document does **not** create a renderer owner. The active scene/presentation owner applies the recipe.

## Why this file exists

The working solution already existed, but it was split across Claude Design / Inbox session cuts and therefore easy for a fresh chat to miss. This stable path consolidates the proven rules without replacing the original source owners.

Primary evidence:
- ToolBox Production-03 session cut: `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r2/docs/LESSONS_SHADOWS.md`
- WB-D2 contact-shadow fix: `tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/CHANGELOG.md` v0.10
- World Integration r2: `tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/HANDOVER.md`
- Global follow-up: GitHub issue #247 `GLOBAL-SHADOW-CONTACT-ARTIFACT-FIX`

The target defect is the recurring bright/light band or detached shadow at contact seams, under roofs/overhangs, around inserted parts, props, figures and buildings. It is **not** an accepted clay-style feature.

## The rule

Do not tune shadow bias as an arbitrary scene constant.

For the active shadow camera:

1. fit the orthographic shadow frustum to the casters/receivers that matter at the current view/scale;
2. keep shadow near/far as tight as practical;
3. compute world-units-per-shadow-texel;
4. snap the shadow-camera centre in light-space X/Y to that texel grid;
5. scale `normalBias` to the texel size;
6. keep the ordinary `bias` small;
7. exclude only genuinely thin/overlay surfaces from casting;
8. keep real glTF body/building meshes casting even when their material is `DoubleSide`.

A large fixed frustum plus a large hard-coded `normalBias` is the known failure mode: it produces Peter-panning, bright contact seams and detached wall-foot shadows.

## Actor / prop scale recipe

The ToolBox Production-02/03 solution used the following pattern:

```js
const smax = Math.min(4096, renderer.capabilities.maxTextureSize);
sun.shadow.mapSize.set(smax, smax);
scene.add(sun.target);

const sph = new THREE.Box3()
  .setFromObject(actorRoot)
  .getBoundingSphere(new THREE.Sphere());

const r = Math.ceil(Math.max(0.6, sph.radius * 1.12) * 8) / 8;
const texel = 2 * r / smax;

// c = desired shadow centre.
// right/up/fwd = light-space basis.
center =
  right.clone().multiplyScalar(Math.round(c.dot(right) / texel) * texel)
    .add(up.clone().multiplyScalar(Math.round(c.dot(up) / texel) * texel))
    .add(fwd.clone().multiplyScalar(c.dot(fwd)));

sun.position.copy(center).addScaledVector(lightDir, r + 30);
sun.target.position.copy(center);

const cam = sun.shadow.camera;
cam.left = -r;
cam.right = r;
cam.top = r;
cam.bottom = -r;
cam.near = 0.1;
cam.far = 2 * r + 60;

sun.shadow.bias = -0.00015;
sun.shadow.normalBias = texel * 1.5;
```

Those numbers are a proven **actor-scale example**, not universal constants. The invariant is the fitted/snapped frustum and texel-relative normal bias.

### Casting rule

Do not exclude `DoubleSide` as a category. KFB glTF/KayKit bodies are commonly double-sided; excluding them caused the regression where essentially only hair still cast a shadow.

Thin presentation overlays should normally not cast:

```js
const thin =
  mesh.userData.petOverlay ||
  material.isShaderMaterial ||
  (material.transparent && material.opacity < 0.98);

mesh.castShadow = !thin;
mesh.receiveShadow = !material.isShaderMaterial;
```

Clay lids / decals / brows / lashes / mouth overlays can remain receivers while being non-casters when their thickness is below the useful shadow texel scale.

## World / building scale recipe

WB-D2 fixed the visible “bright band under the houses” after measuring that `normalBias = 0.9` plus `bias = -0.0005` over a roughly 2200 m depth range lifted the apparent shadow about 1.5 m from wall feet.

The accepted direction was `shadowFollow()`:

- shadow box follows the orbit/camera target;
- half-size changes with camera distance (WB-D2 used roughly 90–560 m);
- centre snaps to whole shadow texels;
- near/far are tightened around the useful world volume;
- `normalBias = 1.2 * texel` at that scale;
- `bias = -0.00003` in that scene.

Again, the numeric values are scale-specific. **Do not restore the old literal `normalBias = 0.9` donor value.** World Integration r2 explicitly records that as a regression.

## Geometry/contact fixes that are not solved by bias

A bright roof/wall band can come from geometry normals rather than the shadow map.

World Integration r2 added **FACE_NORMALS**:
- wall normals are derived from wall triangles only;
- cap/roof triangles must not tilt the top wall row through shared averaged normals;
- the same applies to the bottom wall row when ground/contact geometry would contaminate the wall normal.

This removed the measured bright strip below roofs and irregular dark foot strip in the OSM presenter.

WB-D2 also sinks the wall bottom row about 0.6 m below the plate **after** the façade pass. That is a WorldBuilder/OSM contact technique, not a global prop offset. Do not apply it blindly to characters or movable props.

Host/support truth stays separate:
- a building follows its support height as one object;
- walls, roof, windows and doors move together;
- no fake base plate is introduced merely to hide a contact defect.

## Shadow-map choice

Keep `PCFSoftShadowMap` for this line.

Do not switch to VSM as a “soft shadow fix” for this problem. The existing KFB tests found its light leakage at contact/concave seams to be the exact failure we are trying to avoid.

## Verification before calling the defect fixed

Use at least one representative consumer, not an isolated diagnostic only:

1. slow orbit around a close actor/prop — no crawling/shimmering shadow grid;
2. 10 seconds idle/secondary motion — shadow grid does not swim;
3. close-up of inserted/contact parts — no bright seam and no acne stripes;
4. moving actor/prop — shadow remains attached and does not clip at frustum edge;
5. building close-up — roof/wall seam and wall/ground contact have no bright band;
6. one wider world view — no new detached shadows caused by an over-tight frustum.

## Known anti-patterns

Do not:
- use one enormous fixed world frustum for every camera scale;
- copy a `normalBias` value from another scene without converting it to current texel scale;
- continuously follow the target at sub-texel increments;
- disable every `DoubleSide` caster;
- treat a material or clay shader as the cause before checking FACE_NORMALS/contact geometry;
- patch individual props when the shared shadow camera is wrong;
- accept bright contact leakage as “clay highlight”.

## Current unresolved boundary

Issue #247 remains open because the recipe still needs to be consumed by the shared current rendering/presentation owner and verified in representative integrated World/ToolBox/clay-world scenes.

The recipe itself is no longer source-required: the missing work is **owner-correct integration and regression proof**, not rediscovery.
