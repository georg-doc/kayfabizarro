# R3 · Real-source smoke readability and planar angular debris (method checkpoint)
Date: 2026-10-16 · OWNER: existing KFB Seed World Mech Destruction POC 01 **developer fixture only**.
GitHub research branch: `research/kfb-seedworld-spellspill-vfx-audit-2026-10-16` · Draft PR #406.

## Georg's new request
Make the little projected wood/debris fragments smaller, sharper and more irregular (not everything must be fully shaded 3D), borrowing the *visual hierarchy* from the exact nine user Dropbox screenshot refs. Performance and readability during whole-block cascade are outcome-critical. User did **not** authorize different weapon damage, extra physics, a new VFX engine or replacing the authoritative Clay look.

## Source-first proof
- Existing structural/dynamic **source**: `seedworld/sw-destruct.js` `mDebris` (index 3, real rounded cell/wood-sized fragments with transform/color/physics) + `mChips` (index 5, small source 3D shards); source writer owns all motion, damage, rubble persistence. `sw-mech.js` remains action/rocket owner.
- Existing smoke: source `mDust` (index 6) real icosahedral material/positions; original Brackeys source `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/particles/alpha/smoke_03_a.png` Git blob `7cbc81b89d58671748e819f5f9756d5fbe53a477`. Original mask and source 3D shown in R1 isolated.
- Added the source-only E mode: 2 near-source 3D smoke lobes (1.55×), screen-projected original-alpha smoke (max 48 at 7.8×) with 70px tiles and up to 3 representatives/tile, adapter-only muted gray. This is a **candidate** between sparse D and giant-sphere C; not licensed new art, not KFB Clay Golden.
- New source-only F: **same exact E smoke**, smaller jagged 5-vertex/3-triangle opaque instanced camera-facing polygons for the original source chip positions and far debris; retain **12 near 3D fragments** using *original debris geometry/material*. No duplicate particle position; original `mDebris`/`mChips` hidden only in F, source simulation remains live and authoritative. Prototype is a **frozen-frame read-only presentation proxy**, not a new particle simulation or production physics LOD.
- R3 `out.isolateShards('original'|'planar')` captures the original 3D debris/chip and the 2D proxy **in isolation** before same-scene E/F comparison. `shard-proof.mjs` checks both, then fixed block NONE/D/E/F source states and snapshots; CI single full source 12-hit block stress, not all past R1 scenarios.
- Mode F is deliberately **not** allowed to convert structural gameplay collision/persistence/cell damage to flat meshes; only their presentation can be chosen cheaper. Near fragments still carry real source material to support coherent KFB Clay silhouettes.

## Test discipline and guardrails
1. E and F must have **identical** source smoke counts/positions, camera and 12 rocket/cell/cascade outcome; only debris presentation differs. D is visual-sparsity baseline.
2. Source debris/visual chips count is checked against proxy + retained 3D count; zero newly invented damage events.
3. Report actual source-vs-proxy triangle difference and visible screenshots/pixel delta. The source world itself has nearly 800k triangles; no inflated “x faster FPS” from only a few thousand saved fragment triangles.
4. Headless CI SwiftShader is **NOT** target Mac GPU/visible browser frame-time proof; current static/frozen test is not sustained multi-explosion animated readability.
5. Protect `sw-destruct.js`, `sw-fx.js`, Combat Arena and KFB Clay owner; WorldBuilder R4 STOPPED/F-R39 FAIL; no Stage/Site/Live or merge.

**CI status at method checkpoint:** New `seedworld/fx-ab/shard-proof.mjs` / existing `.github/workflows/kfb-seedworld-source-fx-ab.yml` fixed to call actual shard proof (not stale R2 `budget-proof.mjs`). Test attempt now [run 38947639843](https://github.com/georg-doc/kayfabizarro/actions/runs/38947639843); outcome **UNKNOWN at this checkpoint**. Prior workflow 38947275597 returned 16/16 only because it accidentally ran R2; **NOT R3 evidence**.

**Exactly one next gate:** `KFB SEED WORLD E/F PLANAR DEBRIS SOURCE + VISIBILITY EVIDENCE REVIEW` with original isolated screenshots and actual CI data, then separate human/Mac GPU acceptance before any product adoption.
