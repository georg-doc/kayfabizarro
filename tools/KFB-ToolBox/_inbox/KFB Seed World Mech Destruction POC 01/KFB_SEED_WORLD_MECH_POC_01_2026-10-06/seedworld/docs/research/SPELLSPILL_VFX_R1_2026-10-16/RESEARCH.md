# SpellSpill VFX Study · KFB Seed World / Destruction FX / Performance Donor Audit R1

**Date:** 2026-10-16. **Mode:** source-based visual/performance research; **NOT** new World/Combat/VFX/physics runtime, **NOT** implementation or approval. **Existing owner:** KFB Seed World Mech Destruction POC 01 (research playground). Receiving KFB Combat Arena for combat semantics, Clay/Surface for materials, KFB Audio for cues. WB2 R4 STOPPED / F-R39 FAIL / no R5.

**User-owned visual source:** [Dropbox “SpellSpill VFX Study”](https://www.dropbox.com/scl/fo/khq2ourkr6ihtkvsofo3b/AF6uLp4fDDyuWr_5iGNl7_s?rlkey=75r24euxt8e6ybfo3d1y9j2pe&dl=0). Public view/download, nine PNG screenshots, collected 2026-10-16 16:52:47–16:54:58. User also supplied Reddit short URL https://www.reddit.com/r/threejs/s/rVGHVxDEdT (not yet canonically resolved). The user explicitly values waterfall/water/fluids, smoke, clay-like particle balls, angular shards/debris, explosions, flame thrower, AOE, colors/shaders and readability under mass destruction.

**Visual observation truth:** Dropbox item IDs and hashes were recovered, file preview API called. This research chat did not yet establish original video's shader code, assets, rendering pipeline or project license. Even if the game is “Spellspill: Magic Destruction Sandbox” (a similarly named public Steam listing from TCPB Arts, verified via SteamDB), link attribution to this exact Reddit screenshot set is **not proven**. Do not infer “the shader used X”, import original art/techniques or treat user screenshots as licensed FX source files.

## 1 · Nine pinned originals (Dropbox content hashes)
`Dropbox.list_folder` returned exactly nine PNGs, no further page. All in `SpellSpill VFX Study`, whose original shared URL above remains user-facing source.
| Filename suffix (2026-10-16) | Dropbox file ID | Dropbox content hash |
|---|---|---|
| 16.52.47.png | id:KeQLaY5-IIAAAAAAAAp9Sg | 5dd8c313139ed66d9927305c67e312cdbad3eb745cb90f61c4770e7521eec329 |
| 16.52.57.png | id:KeQLaY5-IIAAAAAAAAp9Sw | 64c45ba4f6d3755b6d497ee2adfdeb6935a5fb9d62ce93270914d63d18f303cb |
| 16.53.09.png | id:KeQLaY5-IIAAAAAAAAp9TA | 3d6008600074841eab6cee6348739eb961e40ba976c759d36f553ba2c61ef4ae |
| 16.53.30.png | id:KeQLaY5-IIAAAAAAAAp9TQ | 1c20cd66e5f55a411123cacb3bf7393835cb1cf28ca06481118a5774e65552d7 |
| 16.54.03.png | id:KeQLaY5-IIAAAAAAAAp9Tg | 23e494f4762d58a4d9620881143ca80d45fdb38297701ca56d9e386aa9f87ea5 |
| 16.54.20.png | id:KeQLaY5-IIAAAAAAAAp9Tw | d96d7a57af16d7611118fda46f1ac2dcb66a801044f955d421d70169aa0ebdf1 |
| 16.54.36.png | id:KeQLaY5-IIAAAAAAAAp9UA | 31bc7b2d93f136ee8a6e7ed3c2a84178e255e3bd3577724759dbd97dad256f03 |
| 16.54.50.png | id:KeQLaY5-IIAAAAAAAAp9UQ | 9f8539845130b5b9b659d65aa9b5ae001147b04b832afff9bac530fcd94eec86 |
| 16.54.58.png | id:KeQLaY5-IIAAAAAAAAp9Ug | 487acba781d5cfc15d7d1b2851b0d55221c6722945ed41969e41c7deabe6e4d5 |

An additive CI workflow `.github/workflows/kfb-spellspill-reference-source-capture.yml` attempts a **temporary only** Dropbox 9-PNG download and hash-verified 3×3 contact sheet. Until that passes and the actual original images are observed isolated, the exact visual source is **REFERENCED / NOT APPROVED**.

## 2 · Existing technical donor truth (current GitHub)
| Existing source | Current exact blob | Actual useful seam |
|---|---|---|
| `seedworld/sw-destruct.js` | `29f044b25f74633548f44a62b9506a8e42bdf6da` | Single damage/collapse authority: `rocket(p,d,radius=5.5,power=16)`, cell AOE falloff `power*(1-d/r)^0.7`; debris, rubble, chips, dust/fire pools; destruction persistence |
| `seedworld/sw-fx.js` | `292dab6b3fa52b7b2d4e5f6263638851cbbfd565` | Instanced bounded tracers, flares, sparks, dots, casings; emitter/presentation only; current gradients and additive shaders |
| `seedworld/sw-mech.js` | `a2008d2546a58cdaaaa0d5a5e52e1e32e3b856d2` | One Mech root/weapon release owner, bullets/rockets not authored by FX |
| `seedworld/docs/ARCHITECTURE.md` | `bf669b0aede61a054d26844d54e4948f59811065` | Seed/cells/support/cascades, deterministic persisted damage, fixed pools and one world material + one FX layer |
| `seedworld/docs/PERFORMANCE_BUDGET.md` | `236f8368ca9fb9563f321ffd3542d3e452597e1c` | Original experiment budgets and benchmark caveats |
| `seedworld/docs/HANDOVER_2026-10-06_r2.md` | `77e5f537b01f73517a5aaf06950ebc5721628bfb` | Known LOD/roof/shadow/rubble pops, missing final rerun, Clay owner not integrated |

This POC is **RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA**. Initial standalone look uses `clay_floor_001` stand-in, not canonical K1/H0 Golden + K2/v10 parity.

## 3 · Why cascade performance and visual readability are the **product outcome**
The old, **preview-iframe/pumped** POC measured about 3.8–11.3 ms/step *CPU + GPU submit* rather than visible-tab vsync FPS, and a first-compile spike reported as **353 ms** in cascade C; after `renderer.compileAsync` the C stress case was **not remeasured**. Peak **584/584** VFX capacity (pool eviction), **150/256** debris, **4/4** promoted building slots, 1.1–1.5 M triangles. These are reasons to audit—not green performance evidence on Georg's target device.

Existing hard pool definitions (not all simultaneously occupied):
- Destruction: `promoted 4 / cells 2200 / windows 1800 / debris 256 / rubble 1000 / chips 320 / dust 200 / fire 64`.
- Weapon: `tracers 128 / flares 48 / sparks 160 / dots 160 / casings 96`, plus Mech `rounds 96 / rockets 24`.
**Do not stack capacities into one "active particle count"**, and note fill-rate can fail with few enormous translucent quads even when draw calls are low.

## 4 · Three candidate FX presentation branches: visual quality **and** cost
All candidate designs must consume the **same existing hit/destruction event**, exact source geometry, camera, lighting, timing and color comparison. These are design hypotheses, not statements of how the Reddit/Spellspill author built their effects.

**A · Source-backed 3D Clay smoke:** limited number of non-uniformly scaled/rotated clay lobes with current KFB Clay material; best for near-camera contact shadows, billow silhouettes and rolling volumetric reads. Risks: many vertex/pixel shader invocations, transparent sorting if translucent, draw calls without instancing, costly shadows. Use for **hero core**, few near-focus lobes only.

**B · Source-backed 2D/flipbook/sprites:** actual KFB inventory `media/3D_Assets/FX_Visual/{brackeys_vfx_bundle,kenney_smoke-particles,explosions_smoke}` and `media/2D_Assets/free-cartoon-smoke-effects-asset-pack`, verified in `KFB_VFX_01_REVIEW/RETURN_VFX_01.md`; also Tiny Swords particle bank. Texture atlas + instanced camera-facing billboards + lifetime/size/color curves for mid/far smoke and shock halos. Risks: flat repetition, unwanted additive glow, alpha overdraw, flipbook wrong cell orientation. Draw the real source sheets in isolation before choosing.

**C · Hybrid (preferred candidate, NOT yet validated):** near hero **few real 3D clay balls** and an impact core; middle layer **instanced angular shards/chips** (opaque/alpha-tested where possible), pooled dust/smoke sprite flipbooks, directional velocity from **existing** explosion event; far background collapse treated as merged/LOD rubble plus short read-only distant puffs, without independent physics simulation. The actual impact/chunk ownership stays in `sw-destruct.js` and one FX emitter/pool remains owner.

A flame thrower is **repeated spatial emission over the weapon-on interval** with persistent but bounded smoke/ember tails, not one single full-screen explosion. Damage-over-time/AOE selection belongs to existing Combat/Mech owners; visuals never apply new damage. Water/waterfall is **separate receiving environment/water material research**: ribbon/mesh+moving UV/foam and pooled splash sprites are candidate cheap techniques, not proof of a fluid solver or source project method.

## 5 · Readability & performance guard for whole-block demolition
**Semantic beats:** `1 hit signal / blast core → 2 radial pressure ring / shards → 3 local dust & smoky volume → 4 delayed structural secondary collapse(s) / debris → 5 persistent rubble / low-cost settling`. Use stagger driven by actual support/cascade authority, not fake second damage. A massive scene should not be a uniform cloud of identical orange particles.

**Quality/cost priority order** (one budget arbitrator inside existing presentation owner):
1. Preserve readable **gameplay truth, target/impact and player camera** (never throttle physics/damage/persistence).
2. Preserve a single **dominant active hero burst** with directional/angular shards and selective clay spheres; emphasize silhouettes, not every tiny particle.
3. Aggregate multiple nearby impacts/overlapping smoke emitters into **one visually legible regional plume**, share instance buffers/material; prevent bright additive saturation.
4. Merge and rate-limit tertiary glows, embers, camera shake, lights and quiet dust; when overloaded reduce peripheral/far/faded visual emissions first.
5. Opaque/alpha-test chunk debris where possible; depth-sort soft smoke cautiously, avoid giant full-screen alpha quads/expensive blur, cap screen-space coverage and shader warm-up, respect color grading and existing Clay Golden.
6. Reuse collision/fragment events and pools; no new per-particle rigid bodies, huge meshes or independent render loops. Seed stochastic visual timing per destruction event for repeatable captures, while leaving gameplay state deterministic.

**Suggested tier vocabulary** (NOT approved numeric budgets): `HERO_NEAR (3D+sprites+shards)`, `MID (instanced shards+flipbook)`, `FAR (sprite cluster/LOD rubble)`, `SATURATED (one merged plume per region, visual eviction)`.

## 6 · Actual future comparison gate and measurement protocol
Test **same scene/camera/source/seed on three A/B/C presentation branches** and a no-FX baseline, with three scenarios:
- T1: **one** rocket AOE on a building: temporal read, actual cells lost, 1 dominant impact and visible shards.
- T2: **four** overlapping rockets / cascading façades: impact frequency and pool collisions, no duplicated AOE semantics.
- T3: **whole building block**, multiple delayed collapses, layered rocket + sustained flame jet + existing water/foam (only if actual water source available): worst-case smoke/alpha coverage and visual intelligibility.
Each run records: warm/cold scene start separately; target-window frame-time **p50/p95/p99** and stalls; CPU simulation/FX update vs GPU timing if available; draw calls/triangles, active/peak/evicted sprites/lobes/shards; transparent screen coverage and overdraw proxy; material/program/texture count; memory, cleanup/reload invariants, frame-exact shot/impact/cascade semantics, screenshot/clip at agreed timestamps. Measure **Georg's actual device/browser** for final performance; a headless SwiftShader/iframe is NOT target-FPS acceptance.
**Acceptance is not only speed**: no hidden impacts, no 2nd damage, no overbright soup, distinct core→debris→dust→settle, silhouettes/Clay-source identity preserved and manageable degradation under overload. Accept effects only after source-isolated actual donor and side-by-side human visual evaluation. Avoid inventing a hard ms/FPS threshold before an existing product specification / device baseline is read.

## 7 · Rights, next gate and scope
Dropbox captures = **user-supplied mood/visual benchmark**, not a grant to mirror commercial imagery or reverse-engineered game binaries. Copy neither into GitHub nor redistributable asset packs. Third-party sprite banks require pack-specific license/provenance and exact source frame checks before vendoring.
No shader replacements, Ammo.js import, Raycast vehicle, world, Combat, or FX gameplay changes in this **research** slice. The research CI is a reference-hash/contact-sheet proof only.

**Exactly one next productive gate: `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B`.** Run inside the existing research POC first: unchanged destruction facts → original source sprites and existing clay-balls isolated → compare A/B/C with 1/4/block cascades and measured render costs; choose one look only with real visual proof. No new Stage or product route for this documentation pass.
