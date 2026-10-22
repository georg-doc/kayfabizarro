# WS0 / WS1b · Particle-First Surface-Reactive VFX · R1

**Datum:** 2026-10-22  
**Status:** GEORG STYLE DECISION / SOURCE-GROUNDED PLAN; **NOT IMPLEMENTED, NOT VISUAL ACCEPTANCE**.  
**Owner/control:** existing WS0 terrain/Game Design register, `docs/kfb-decisions-register-2026-10-11`. **Only productive runtime owner:** existing WS1b `kfb-planet` on the owner-designated terrain/Racer lane; no second VFX framework.  
**Parent:** [Issue #439](https://github.com/georg-doc/kayfabizarro/issues/439), whole terrain/Banden/ramp/palette/shadow outcome. This addendum is a **candidate after the terrain baseline**, not a second mandatory workstream.  
**Source reference:** Georg's two screenshots from Reddit https://www.reddit.com/r/TopologyAI/s/ibZrdJQ6Ei (posted in chat 2026-10-22); Reddit shortlink creator/licence/code **not verified**, reference is visual behavior only. The visible reference depicts a car drifting with a bending, expanding dust wake and residual small debris.

## 0. Binding Georg correction to the previous design proposal

**REJECTED for surface wakes:** procedurally constructed "clay clouds": large handmade ball arrangements, overlapping egg/blob meshes, sculpted puff silhouettes, noise-disguised large transparent billboards, giant circular sprites. The user expects AI-made cloud sculpture to fail stylistically; **do not ask Claude Code to invent a cloud mental model**.

**APPROVED DIRECTION:** the dust *wake silhouette emerges from many small genuine particles along the historical car trajectory* through emission timing, drift direction, dispersion, ageing, height, vehicle speed and material palette. Particle-first, reuse existing emitters and pool; no new shape generator or alternate renderer. The **look is in behavior, not an object named cloud**.

Clarification: this is about **surface VFX**, not a change to the independent shadow policy: true 3D world/caster shadows, no fake blob shadows on ground, palette-responsive receiver shading. Particles are never surrogate vehicle/contact shadows.

## 1. Exact reusable KFB sources – inspected on GitHub

**Receiving snapshot:** `georg-doc/kayfabizarro@ws1/terrain-439:4df9362a156fabb32411a960915e38d3a68ae224`. These are the files of that snapshot, not proof of current WS1b local unpublished work.

| Source path under `ws1/kfb-planet/` | Exact blob | What was actually read |
| --- | --- | --- |
| `src/modules/vehicleRig.js` | `b7ec3fcbdb5da92cc99195f90c3d53258429b471` | `DUST.count=160`, `rate=46`, `life=0.5..1.1s`, `size=1.0..2.4`, `groundAt/groundColorAt`, hover anchor transforms, one `THREE.Points` pool, fixed typed arrays and source updates, existing `dustStep`; `frustumCulled=false`. Do not claim these are tuned for dramatic drift wake. |
| `src/m2/racerRig.js` | `78c7165acf1e96261b1507abdce84c2d51a08e71` | `terrainDustColor()` selects fixed sand/earth/rock/grass by height and slope. This is **not yet tied to the newly proposed organic color-field surface identity**. |
| `src/m2/M2Car.jsx` | source-read 2026-10-22 | Actually calls `R1.update(dt,{...,groundAt:terrainHeight,groundColorAt:dustColorAt})`; racer state contains `k.brake`, `k.fly`, `signals().speed`, but **does not currently pass a slip/drift intensity channel** into `R1.update`. |
| `src/vendor/vfx/kfb-flight-vfx.js` | `be9cbb90ed1f191decc5328aefc793405a560e71` | Library donor has separate `skim=240` point pool, `puff=40` instanced sculptural particles, surface `water` switch and height/velocity gates. **A source module's existence is not proof it is mounted simultaneously with the Racer pool.** Reuse behavior/reference only after owner locates actual caller/authority. Specifically, *do not* port its big sculptural puffs to drift wake. |
| `test/unit/vehicleRig.mjs` | `13d620e61a73a0caa0643ec2c83290fbca1c68cd` | Existing unit assertions already exercise `dustNearGroundOnly` and `fixedDrawCalls`, but not drift wake silhouette/biome palette/overdraw. Preserve them. |
| `src/world/perfBudget.js` | `ffad75cf7d63835ac4c06d6d2740943e9d369184` | Project target p95 ≥30 fps on base M1 / Iris Xe at 1080p, reference M1 Max ≥60 fps; budget ceilings including draw calls. |
| `WS1_STATUS.md` on `ws1/r3f-frame` | `0f579abab4d74ce09d1136b33e76f5cd9550e9be` | §120–121 report genuinely tight performance and shared GPU interference: measured drive comparison 44.4→37.1 ms (earlier), baked height map stand-drive 18.8→16.7 ms in later probe, and GPU effects 1–5 ms each in earlier audit; **different fixtures, no transferable new dust fps claim**. |

WS0 current canonical color work: `replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md` and V-305 palette generator, KFB Styleguide/GOLDEN. The present *surface source* must choose particle tint: never invent a second global palette store.

## 2. Recommended minimal behavioral change, one emitter

**Current behavior:** `vehicleRig` emits small particles from actual hover anchors with speed/height gate; initial lateral velocity is isotropically random. At full turn this can look like random local dust specks, not a coherent bend.

**One conservative future tuning seam:** keep exactly one existing racer `THREE.Points` pool and its ring buffers; make emitter direction and rate depend on existing authoritative movement/slip signals, not artistically guessed mesh silhouettes.

1. Capture **prior world-space emitter positions** at real frame steps. No extra camera follow or world-control writer. Emit where tyres/hover ground contacts *were*. Old particles remain in world coordinates and do not follow the car root.
2. Prefer existing `k2t`/Racer controller's actual lateral slip/drift or yaw/speed intent as a read-only parameter forwarded through the single current host. If no trustworthy signal, first use existing directional velocity/yaw with explicit "approximation" tag, **not** invent new physics.
3. Blend initial velocity from a fraction of vehicle velocity + small reverse wake + tangential side dispersion, scaled to drift; bounded low-frequency random variation makes a curve emerge. No complex fluid dynamics.
4. Use **time-based** emission and a strict per-frame spawn cap, fixed `DUST.count=160` for baseline A/B. The first pass varies `rate`, `life`, `spread`, `rise`, `drag`, `alpha` within existing source budget; **do not increase capacity or point-size as default**.
5. Fade individual particles modestly and naturally; **no visibly giant circular point sprites, no shapes pretending to be billowing clouds**. Particles should remain visually subordinate to the vehicle.
6. On takeoff / water switch / surface change stop or transition emitter causally: no particles spouting from midair; old wake completes its existing life, current material determines new emission. A ground-contact point and material query should be from the same existing authoritative support/receiver owner. Never create a fake ground shadow.
7. Keep no per-frame allocations in hot path. Preallocated typed buffers, one material, one draw path, source release/dispose and pause behavior preserved. If source already uploads every particle attribute each frame, investigate whether dirty ranges can help **only if measured**.

## 3. Surface-reactive palette + behavior profile, NOT six new renderers

A **surface profile** is a presentation-only lookup from the actual material/biome identity. Separate `surfaceId` from `surfaceBaseColor` and `surfaceVfxTint`. Existing Stage/Organic Color Fields remain color authority.

| Surface / mode | Palette role | Behavior delta over single pool | Additional source owner |
| --- | --- | --- | --- |
| Sand / Canyon | warm ochre/terracotta particle tint, typically less saturated than road plane | broader horizontal tail, slow drift, modest lift | none |
| Soil / grass | brown/olive from receiver palette | shorter wake, fewer larger-looking individual crumbs **without modeling cloud blobs** | no new vegetation owner |
| Snow | cream / pale biome tint | longer small-particle suspension, lower density | no separate snow runtime |
| Water | cyan/foam/glint from water owner, not fixed pure white | **short, ballistic spray**, gravity and drop; short lifetime; avoid dust-like hovering | real water owner supplies ripple/wake if already implemented, do **not** use this pool as fluid simulation |
| Mud / sludge | brown or biome tint | heavy, short ballistic arcs, low particle density | no deformation unless world owner already models it |
| Black Goo | actual Black Goo source palette, not arbitrary pitch black | if authorized later: heavier dots / splashes; gameplay infection/cure belongs to original owner | no second Goo resource/runtime |

**Important:** color-only is the first low-risk swap, but colored sand sprites must not masquerade as water. Only basic physical profile knobs vary (`gravity/rise`, `horizontal drag/spread`, `life/density`) while emitter infrastructure stays one.

**Migration note:** current `terrainDustColor(H,x,z)` ties color to terrain height/slope; later pass should consume true existing world `surfaceMaterialAt` or compatible material-role sampler **if one is actually present**, rather than inventing such an API. The exact binding is SOURCE_REQUIRED, not yet proved. Stage/track surfaces may override world biome. The receiver palette, not the car paint, tints the dust.

## 4. Cheap rendering safeguards / specific research

- First pass: existing shader, small point sprites, `depthTest=true` and `depthWrite=false` where current rendering already uses them, minimal overlap. Validate shader alpha edges visually; avoid enlarging a circular point to fake a cloud.
- **Pixel cost and overdraw**, not merely count, are the main GPU risk. Profile large close-up sprites and under-camera transparent pileups.
- `THREE.Points` can have hardware-dependent point-size ceilings; don't assume it draws giant cinematic clouds on all devices (official Three.js PointsMaterial docs). WebGPU point primitives are size-1 in Three.js's node material docs; if renderer backend changes, compare behavior with actual host instead of slipping in a new Sprite owner.
- Existing `frustumCulled=false` in pools may be acceptable for tiny fixed caps but must be assessed in A/B with viewport movement. Do not "optimize" by culling particles incorrectly.
- Avoid alpha-hash/dither grain unless an authorized real-material comparison proves stylistic fit; stylized flat color direction forbids generic speckle look.
- Candidate references for *technical validation*, not to be copied as unverified donor code: https://threejs.org/docs/pages/PointsMaterial.html ; https://threejs.org/docs/pages/Material.html ; https://threejs.org/docs/pages/PointsNodeMaterial.html .

## 5. Visual acceptance rubric / repair guard

**PASS candidate must show a coherent curving trail when viewed from top-down and from game-chase camera without any sculpted cloud geometry**:
- Curved trail follows the **previous** driving path, not steering arrows or the current rear axle; persists briefly after steering or throttle release.
- Dust is denser on slide and rough terrain, lighter on ordinary cruise; appearance no more than a handful of distinct palette colors and no massive soft discs.
- Surface transitions produce correct color from actual material; no cyan dust over rocks or sand cloud rising on water. No abrupt discontinuity at per-chunk boundaries.
- No giant ellipse/ball/mesh clumps, no stock smoke asset, no fake racing shadow, no performance collapse when camera enters wake; stop/land/resume and rewind/reset work.
- Water test additionally has fast droplet arcs, not a hovering dust wake. Nothing tries to simulate water surface dynamics without the water owner.
- Existing vehicle, terrain, real projected shadows and other visual constraints remain unchanged.

**Failure rule:** Two non-improving repair passes on same visual seam → preserve candidate and evidence, quarantine that seam under existing Guard, do not repair by importing a mesh/smoke billboard. Existing complete Racer / terrain outcome continues unless Guard proves it blocked.

## 6. Testing and integration – proposed after WS0 routing, not performed

- Baseline `no particles` vs `current 160` vs `particle-first candidate 160` in the **same actual WS1 scene and race seed**; no new demo/racer.
- Same authored 6–10 second steering pattern: straight → drift left → drift right → brake → jump/land, fixed camera chase and overhead. Three surface materials for first gate: **sand, actual water and real grass/soil**. Re-run with Racer in different costume but same world material to prove tint depends on receiver.
- Log `renderer.info.render.calls`, current `R1.info().dust`, active/peak particle counts, spawn events, CPU update duration, GPU frame p50/p95, screen resolution and backend, and screenshots. Compare image shape at 1/4 and full size; capture short clip only if needed for motion reading.
- Real performance threshold comes from **current Owner/target hardware**, not guessed percentage. On lower performance presets reduce emission density/particle size/lifetime first, keeping one active emitter. Need a real target-GPU measure before stating `PASS`.

**Exactly one next gate:** WS0 reconciles this user-approved *particle-first constraint* with existing #439 terrain/WS1b owner priorities and authorizes **one read-only source/visual baseline + bounded same-scene drift/water A/B**, only after actual receiving `kfb-planet` working head and current `VehicleRig` emitter confirmed. No separate runtime owner, no Site/Cloudflare needed for this documentation.


## 7. Current-source improvement: drift input ALREADY EXISTS (fresh readback, 2026-10-22)

**Confirmed donor source:** `ws1/kfb-planet/src/m2/k2t.js`, `ws1/terrain-439`, blob `1a09a6d700754f631492a3639919965d26f20efa`:
- `createK2t` initializes `signals: { speed, longAccel, lateral, bank, drift }`.
- `stepK2t` sets `S.drift = d.driftDir * d.drift` (approximately -1..+1) and `S.lateral` from lateral speed; Q/E are already the authoritative K2B drift inputs.
- `M2Car.jsx` `CarVisual` calls `signals?.()` into `sg` before `R1.update` (source blob `0897a3c60290499d5154c51fd918c4641ecee1a0`), **but currently forwards only `speed01`, `brake`, `groundAt`, `groundColorAt` and other non-drift controls**.

**Therefore no approximate yaw-based "drift detector" is needed for K2B.** Proposed smallest later receiving-owner integration is a **read-only parameter pass-through** `drift: sg.drift` (semantic concept, inspect exact live owner code before patch) into `vehicleRig.update`, and a bounded response of its existing `dustStep` emission rate/spread. No extra physics state, listener, input owner or standalone wake system. For frozen `ecctrl` and any flight state with no valid `sg.drift`, gracefully use zero drift and current baseline behavior. A reset/respawn must clear any stale wake state, while already emitted particles finish or reset under the original owner.

**Recommended code-level regression additions:** in `test/unit/vehicleRig.mjs` (existing suite), controlled drift=0 vs ±1 at identical ground and speed; assert same bounded pool size/draw calls and higher emission while drifting, height gate remains intact, zero-drift legacy response remains. Additional palette test should use one real receiver SurfaceRole after its exact lookup API is found. These are future test requirements, **not tests executed by this documentation turn**.

**Confirmed visual scope:** still 160 original small point particles as first candidate. Do not "solve" weak wake visuals by appending the 40 `kfb-flight-vfx.js` sculpted Knet-Puffs to the Racer.
