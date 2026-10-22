# WS0 Particle-First VFX · closed source gaps and minimal integration seam R1

**2026-10-22 · SOURCE AUDIT / PLANNING ONLY · NOT IMPLEMENTED · no new runtime writer.**
**Owner/control:** existing WS0 KFB_HUB Register. **Only receiving production owner:** WS1b `kfb-planet` on the current Racer/Terrain slice. **Parent:** [Terrain Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439). Companion to `WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md`, its `TEST_REPORT` and `RETURN`. This record **closes part of their previous SOURCE_REQUIRED mapping**; it does not redefine their single next gate.
**Pinned read-only mirror:** `georg-doc/kayfabizarro@ws1/terrain-439:4df9362a156fabb32411a960915e38d3a68ae224`. Inspect actual WS1b private working HEAD before any build; GitHub mirror is a donor snapshot, not proof of local current changes.

## 1. New factual finding: real surface palette sources already exist

| Source | Blob SHA | Proven capability / limitation |
| --- | --- | --- |
| `ws1/kfb-planet/src/look/terrain2.js` | `9ef477bb018975a10b5ff575b48525156317dfb9` | `terrain2Palette(world)` returns `{world, surfaces[4], shadow}` from current `kfb-colorscript.r1.json`. The actual color-field chooser `t2Region(vec2)` is GLSL in `applyTerrain2`; it samples world XZ or wall-local chart independently of height. **No exported JS `surfaceRoleAt(x,z)` / exact color-at API** was found in this source. |
| `ws1/kfb-planet/src/data/looks/kfb-terrain2.r1.json` | `9a87d3f28f2cfa644c1896ae283da0fa89cbbc7e` | Authoritative `surfaceRoles=["top","hill0","under1","sand"]`, field wavelength/warp/seed and shadow role are configurable source data. |
| `ws1/kfb-planet/src/look/terrain3.js` | `f5571573eafa16c4b1335ca3fea128e27b0e6e36` | `TERRAIN3_CFG`, `applyTerrain3()` and `applyShadowTone3()` expose current palette/style object and shadow role. **But** `flowBands(xz,hn)` uses normalized world-height `hn` and time `uTimeT`, not the static terrain2 independent-color field. Cannot treat `terrain2Palette` colors as pixel-truth for `look=terrain3`. |
| `ws1/kfb-planet/src/data/looks/kfb-terrain3.r1.json` | `3267bfa11d5a13db569dad6aa047c25d2f92d649` | Five existing palette IDs: `mesa`, `moos`, `wueste`, `schnee`, `pastell`; roles `water,sand,low,mid,high,peak,cliff`; `flow.downhill=true` and tempo coupling on. **Do not hardcode new palette list.** |
| `ws1/kfb-planet/src/modules/m1-terrain.js` | `75f582f7e8f7d0a9582207990465eaff09272cbe` | Current `createTerrain(options)` selects `applyTerrain2` or `applyTerrain3` as variants, then provides `height(x,z)`, `surfaceAt(x,z)`, but `surfaceAt` returns a **number (actual triangle height)**, not water/material identity. Thus don't pass it off as a biomic material sampler. |
| `ws1/kfb-planet/src/vendor/palette/kfb-cartoon-palette.js` | `ab328bc0fda4bc5b918e0e08a88e51df445282db` | Existing V-305 general deterministic palette/harmony generator. **No need for second palette authority** in VFX. |
| `ws1/kfb-planet/src/data/looks/kfb-colorscript.r1.json` | `2aaaa4824052916dd942561a9b7223e365dc7c22` | Current specific `terrain2` role/hex source, rather than invented height/slope palette. |

**Important timeline nuance:** This is **not** an instruction to revert the newer `terrain3` look. WS1_STATUS (§115) records intentional later hangabwärts-/height-band flow (Georg 21.10.). The earlier `terrain2` is explicitly independent of height. Keep both modes with their recorded rationale, and **let WS0 confirm which appearance is the current look for the user's actual receiving scene**. The VFX choice should reflect the *active material/scene* instead of imposing one look on the other.

## 2. Smallest possible future VFX color seam

**Do not build a second source of truth or slow GPU readback.** For one existing material/zone, begin with **one of its actual existing palette roles** (e.g. `terrain2Palette(world).surfaces[...]` or `TERRAIN3_CFG.palettes[id].sand/low`) as a *named spawn tint*. That already removes today's totally unrelated height/slope type heuristic. This is a **coarse zone/role match**, **not** an exact per-pixel match to the moving GLSL field.

Only if exact local organic color patches are visually important: the Terrain owner can expose a **source-derived material role lookup** sampled at emitter contact in CPU **from the same underlying field definition/seed** (or a shared baked low-resolution role-ID map also used by the shader). Each method must prove parity with actual shader, domain warping and animated `terrain3` time before claiming exactness. **Do not** independently reimplement GLSL noise via approximate JavaScript or per-frame `readPixels` for 160 particles. One material query per *emission*, never per persistent particle per frame.

**World surface-kind** (water/grass/snow/mud/goo) is separate from **visible palette color**. Actual Water/Track owner must provide a grounded contact/material identity, not inferred from Y-height or `surfaceAt` in `m1-terrain.js`, and must not be magically deduced from one palette role named `water`. If no water receiver is proven in the actual chosen WS1 fixture, do not fake a water A/B; use existing donor water test only after owner/source proof.

### Design-only behavior sampling contract (NOT a shipped API)

```text
real receiver contact / material owned by WS1 World
  → {surfaceKind, paletteId, optional materialRole/tint}  // conceptual only
  → surface profile (same particles, shape/life/drag/gravity)
  → existing vehicleRig dustStep spawn color + drift-influenced velocity
  → fixed 160-particle ring buffer, no second material or scene
```

**Color and profile policies must remain disjoint:** palette-role selection answers what color; `surfaceKind` answers how it flies. Water effect needs a ballistic/short lifetime profile, not merely cyan-colored dust; water surface ripples remain with existing water owner.

## 3. Particle size is an actual source-level failure risk

Current Racer source `ws1/kfb-planet/src/modules/vehicleRig.js@b7ec3fcbdb5da92cc99195f90c3d53258429b471` shader:

```glsl
gl_PointSize = aSize * uScale * (0.4 + aLife) / max(0.2, -mv.z);
```

There is **no explicit pixel-size cap** in that expression. Near camera, visually huge circular sprites are possible even with only 160 particles; on GPUs this can also increase transparent overdraw. User has specifically rejected round discs, blobs and pseudo-clouds. Previous WS1_STATUS §93 reports several-meter cloud sprites before a size reduction; that **does not prove** current close-up rendering passes.

**Future low-risk candidate:** measure the current largest on-screen sprite near the chase camera, then bound `gl_PointSize` to a sensible *measured* maximum (technical candidates: shader `min(size,maxPx)`, cull/fade physically near-camera particles, or scale emitter). **No accepted maxPx number yet**. Keep existing alpha/fade, depth-test and bounded pixels so points remain individually modest. Preserve current renderer/GLSL shader stage and existing `test/unit/vehicleRig.mjs` assertions. Test mobile/backend capability; do not claim universal WebGPU behavior.

The alternative to giant sprites is **more coherent emission trajectory**, not replacing point sprites with animated cloud mesh/puff geometry.

## 4. Exact drift signal and pool integration (already present)

- `ws1/kfb-planet/src/m2/k2t.js@1a09a6d700754f631492a3639919965d26f20efa`: `signals.drift = d.driftDir * d.drift` and lateral velocity; signed range about -1..1.
- `ws1/kfb-planet/src/m2/M2Car.jsx@0897a3c60290499d5154c51fd918c4641ecee1a0` reads `sg = signals?.()`, yet `R1.update` does **not** pass `drift`. Lowest-risk receiving owner change later: forward read-only drift and apply a bounded amplification/dispersal of **existing** dust emission; initial capacity unchanged `160`.
- `ws1/kfb-planet/src/modules/vehicleRig.js` already has per-spawn palette/tint hook `groundColorAt(x,z)`, one `THREE.Points` pool, no new source dependencies needed for a coarse palette.
- `ws1/kfb-planet/src/vendor/vfx/kfb-flight-vfx.js` (separate `skim=240`) is behavior donor, **not automatically mounted beside Racer pool**. Explicitly identify actual caller first to prevent duplicate emissions. Its sculpted `puff=40` is **not** the Racer wake solution.

**No changes are authorized here to `k2t` game physics, visual material Look, Racer speed/handling, terrain mesh or shadow mapping.**

## 5. Acceptance work now reducible to three small source-backed questions

1. Which actual `look=terrain2` / `look=terrain3` / other material and palette ID does the current receiving WS1b scene use? Locate one authoritative surface-kind source for water only if water is in the selected scene. Do not invent a new `surfaceMaterialAt` implementation merely for QA.
2. With existing 160 small sprites, can the **actual drift path + a shader pixel cap** give a readable curved wake from overhead and chase without round-disc artefacts or masking the Racer? Candidate script: straight → Q → release → E → brake → optional jump, same seed/route. Record cap and plot of actual `signals.drift` for each segment.
3. On actual target GPU, what is the A/B cost of OFF / BASELINE / PARTICLE-FIRST at identical resolution/DPR/camera and speed, including near-camera overdraw? No claim based solely on headless SwiftShader. Baseline racer+world scenes must remain visually unchanged when candidate switched off.

## 6. One next gate – unchanged

**WS0 routes the user-approved Particle-First no-cloud-sculpt decision through existing #439 and asks the one WS1b owner to pin and visually isolate the real 160-point emitter plus the real active receiver palette/material.** Only then, if WS0 schedules it as part of the current terrain effort, one reversible same-scene Sand/Water/Soil A/B. No standalone effect application, no generic generated assets, no extra runtime owner, no early Site/Cloudflare work.

**Status counts here:** code/source inspection only; actual shader/gameplay/browser/GPU tests **0**; no screenshot in this task. The source checks and their actual count are recorded in the existing Particle-First TEST_REPORT addendum.
