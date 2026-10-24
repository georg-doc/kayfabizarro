# R3 · Same-source smoke + planar jagged debris · measured visual evidence
Date: 2026-10-16. Owner: existing KFB Seed World Mech Destruction POC 01 **research sandbox only**.

**Status:** TECHNICAL SOURCE/GEOMETRY PROOF **PASS**; visual direction **KEEP AS CANDIDATE · TUNE**, not accepted KFB Clay Golden or GPU FPS improvement. Exact screenshot inspection + source-based CI evidence.

## Run receipt
- Real corrected test: [GitHub Actions run 38947639843](https://github.com/georg-doc/kayfabizarro/actions/runs/38947639843), job `117130707892`, **SUCCESS 24/24 assertions**, original source revision `e5a1ab8065d0bda9affedf4aef1b5ef5352b63aa`.
- Artifact: [12067137321](https://github.com/georg-doc/kayfabizarro/actions/runs/38947639843/artifacts/12067137321) (`results.json` plus **6 genuine screenshots**: original source 3D debris isolated, source-derived planar proxy isolated, and original block NONE/D/E/F). Artifact ZIP SHA256 `710f969add9985e4c3261c952930bf6a8da1eebf6410fdfd3f13537fb43d7c52`.
- A previous workflow [38947275597](https://github.com/georg-doc/kayfabizarro/actions/runs/38947275597) wrongly ran the **old R2 budget-proof.mjs** (reported 16/16) although its job title mentioned planar debris. This **is NOT R3 evidence**; the actual node exec path and artifact folder were fixed before successful corrected run. Retain the false-green record for provenance.
- `FX_SHARDS_R3_METHOD_2026-10-16.md` is the implementation boundary and guard; code changes confined to `seedworld/fx-ab/{comparison.mjs,index.html,shard-proof.mjs}`, the existing CI workflow. **ZERO** source/gameplay owner changes in `sw-destruct.js`, `sw-world.js`, `sw-fx.js`, Combat Arena or WorldBuilder.

## Actual source + immutable gameplay state
Same prior target seed `20261005`, original POC source `sw-destruct.rocket` and source instancing matrices/colors. Original Brackeys `smoke_03_a.png` Git blob `7cbc81b89d58671748e819f5f9756d5fbe53a477`, source 3D dust icosahedron geometry/material; exact **original** `mDebris` + `mChips` mesh instances, no invented source models. Read-back original source: **12 actual rockets, 90 lost cells, 2 cascades, 178 live debris, 320 chips, 195 smoke, 584/584 peak VFX**. All NONE/D/E/F use the same single frozen simulation outcome.

## Smoke comparisons
- Previous D sparse: **3 3D + 11 2D smoke**; 0.415% sampled pixels differ from NO-SMOKE.
- New E "layered": **2 near 3D icosahedral source lobes + 48 original 2D white-alpha source masks**, 70 px tile with up to 3 source representatives per screen tile, 1.55× 3D and 7.8× 2D original scale, prototype darker clay-gray tint. 1.078% sampled pixels differ from no-smoke, vs 0.415% D.
- F reuses **exactly the same E smoke counts and source IDs**, but changes the visual depiction of debris/chips.
- This is a **test-only smoke presentation** (frozen frame, manually selected budget). Neither KFB Clay material Golden acceptance nor dynamic temporal readability is established. Gray is not source-authored canonical surface color.

## E / F debris comparison at the same smoke, camera and damage
| Actual sampled metric | E source 3D debris | F planar/near-3D candidate |
|---|---:|---:|
| Structural source dynamic debris objects | 178 | 178 (identical authoritative) |
| Original rounded 3D debris rendered | **178** | **12** (nearest, source geometry/material) |
| Planar irregular large debris | 0 | **166** (source instance locations/colors) |
| Original 3D source chips rendered | **320** | **0** |
| Planar small jagged chips | 0 | **320** |
| Planar shape | — | **5 vertices / 3 triangles per instanced polygon** |
| Total 3D scene triangles | **797,294** | **748,800** |
| Draw calls | **145** | **143** |
| CPU render-submit p95, CI SwiftShader only | **3.9 ms** | **4.7 ms** |
| Sampled whole-scene pixel difference vs NONE | **1.078%** | **11.066%** |

**Exactly 48,494 / 797,294 = approx. 6.08% fewer scene triangles** while all actual destruction physics/cell outcomes remain unchanged. This reduction is meaningful submitted geometry, but the headless **F measured CPU submit is larger, not smaller**; no measured real GPU/FPS win should be claimed. Planar shard faces and no shadow casting may help on some devices but require actual GPU benchmarking; when too many polygon faces overlap, fill-rate may also matter.

## Actual screenshot visual review
- In original source-only screenshot, 3D chunks form large bulky rectangular/board-like pieces around a dense local explosion, with a spray of tiny chips. The source is **not automatically wood-specific**; colors are from the original cell/debris source, so do not claim a new wood material was sourced.
- In the **isolated source proxy screenshot**, 12 original 3D near chunks remain, and 166 farther chunks plus 320 chips form a finer irregular angular spray rather than repeated boxes. These are **authored proxy polygons** adapted from real positions, not externally sourced art.
- In the block scene, F foreground remains readable and feels more like flat hand-cut fragments, avoiding part of the 3D clutter, but significant structural chunks remain and **the smoke is still understated** relative to the user’s dense SpellSpill screenshot examples. This is not a visual Golden.
- No animation sequence was reviewed here. Dynamic depth ordering/flat-angle rotation/fragment lifetime under a moving camera require further work.

## Source/owner and performance gates
No new FX engine, Ammo.js, billboard render loop, simulation of additional damage, media import or generic placeholder. Existing KFB Clay materials, World/Combat owner, existing source geometry all protected. KFB WorldBuilder R4 **STOPPED / F-R39 FAIL / NO MVP / no R5**. No GPT Site / Cloudflare Stage required for this research fixture; no merge / Live.
**Exactly one next gate:** `KFB SEED WORLD PLANAR DEBRIS + CLAY/SMOKE VISUAL MOTION / TARGET-GPU REVIEW`: one bound animated whole-block view with actual source debris transforms, accepted KFB Clay tint/source style and a focused browser on Georg's Mac; measure p50/p95/p99 real frame time, GPU/transparent overdraw, visible fragment silhouettes and proper near/far depth behavior. Human pass/TUNE/FAIL before product adoption.
