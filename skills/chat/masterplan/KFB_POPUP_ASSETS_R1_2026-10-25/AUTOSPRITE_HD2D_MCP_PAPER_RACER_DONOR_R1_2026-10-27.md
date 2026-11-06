# KFB Popup Assets × AutoSprite MCP × HD-2.5D Paper Racer R1
Date: 2026-10-27
Classification: source-verified external workflow + proposed adapted prompt; no provider connection, code, generated animation, Site, Stage, Golden or runtime authorization.
Owner: KFB World Composition planning / existing KFB Asset Scene Composer + Asset Librarian; Draft PR #447. Current WS0 Return selected **Paper Racer** as the first POC only after Georg's Golden/P0 frame gate. Keep that gate; no second game/asset owner.

## 1 · Verified external source and source limits
- [Reddit post and author's coding-agent prompt](https://www.reddit.com/r/aigamedev/comments/1xgt0uw/ive_been_building_autosprite_for_almost_a_year/) (27 Oct 2026): author describes 8-direction isometric sprites and a playable RPG vertical-slice prompt using AutoSprite MCP + Three.js 3D scene/lighting/VFX. The author specifically credits a **mix of AutoSprite sprite animations and Three.js particles**. Author acknowledges animation loop, equipment and angle-consistency problems.
- [AutoSprite official MCP](https://www.autosprite.io/docs/mcp) reports a remotely hosted HTTP server `https://www.autosprite.io/api/mcp`, with `generate_spritesheet`, `generate_isometric_pack`, and importantly `create_asset`, `animate_asset`, `generate_asset_spritesheet`, `remove_asset_background`, `generate_asset_preview`. This is external **paid-plan access**, NOT connected in KFB during this review. ChatGPT plugin directory lookup for AutoSprite found no available plugin; do not invent installation.
- [Official exports](https://www.autosprite.io/docs/reference-export-formats): transparent PNG frame sheets + JSON atlas/frame metadata/ZIP. [Pricing](https://www.autosprite.io/docs/reference-credits) currently quotes 5 credits for Turbo 2-sec clips, and 15 credits per isometric 8-direction action pack; recheck before paid generation. [Terms](https://www.autosprite.io/terms) limit output ownership by rights in user/third-party inputs; do not assume purchased KayKit/Tiny Treats/Meshy asset uploads are allowed.
- Community/author complaints show frame size drift, wrong spritesheet ordering, broken loops, changing texture/equipment and alpha extraction. Source promises are not independently measured KFB results. No game-ready asset or stable original 3D mesh fidelity has been proven.

## 2 · KEEP / ADAPT / REJECT for KFB
| From Reddit template | For KFB | Classification |
| --- | --- | --- |
| 8-direction Knight/Rogue/etc roster and side-view combat moves | Real KFB 3D Residents/rigs and ChatterBox remain owners; 8-direction sprite packs only later for explicitly authored scenic comic/NPC cameos | DEFER |
| Pixel-art characters inside cinematic Three diorama | Preserve **KFB KayKit-derived recognizable shapes + source-locked Clay/Ink + white paper-cut edges**; HD-2D layering and theatrical spatial depth, not forced pixel-art treatment | ADAPT |
| Build game in an empty folder with Vite/TS | Work within exact current existing WS1/Track/Racer scene/ref; no new runtime, renderer, audio, controls, UI, physics or host. Build tool follows existing owner | REJECT |
| RPG cold open, random fight, XP finale | Use current **Paper Racer** three camera/route-matched alternatives: genuine 3D, thin white-edge cutout, layered paper-stage; one meaningful small motion/reveal | ADAPT |
| AutoSprite characters | Optional `animate_asset → generate_asset_spritesheet` for **one** verified KFB blank billboard / cutout prop; compare against deterministic Three.js hinge/flip animation | ADAPT after Golden |
| RPG VFX/letterboxing/hit-stop | Reuse bounded comic starbursts, soot/black Goo decals, particle dust and paper debris if current owner permits. Anim sprites + Three effects separated. No second damage/physics timing owner | ADAPT |
| “AAA quality” | Factual QA: identity retention, physically believable edge, clean alpha, no frame drift, atlas/pivot, same-road freeplay, memory and p95 frame cost at target camera | REPLACE |

## 3 · Reuse our existing pipeline
Current source: [KFB Popup Assets workflow](WORKFLOW_AND_GPT_PLUGIN_PLAN_R1.md), [previous image QA](TEST_REPORT_R1.md), [current WS0 Paper Racer decision](../WS0_RETURN_PROCEDURAL_COLLAGE_R1_2026-10-25.md). The previous four Paris/LA sheets are MOOD_ONLY: PNG integrity 4/4 but standalone clean game-ready sprites 0/4. **Do not call them approved Golden**. Keep HyperNorm video insert as an independent blank 16:9 rectangular screen, with media driven by its existing owner. No generated or fixed billboard video text is baked into the sprite. A regular `THREE.Sprite` always faces camera and doesn't cast shadows; use actual thin geometry for white physical rims/supports and real positional contact.

Source-first chain:
`REAL original donor isolated in source renderer → exact source pixel provenance / licensing → 1 standalone PNG with clear transparent gutter → optional AutoSprite animated asset → spritesheet+JSON atlas+source hash → transparent edge/scale/loop QA → integrate in existing Racer scene → compare owner-native hinge vs sprite flip under same camera → Georg selects Golden`.
No sprite import into KFB Asset Librarian/Registry without existing owner approval. Paid MCP authentication/generation requires user action; do not run automatically.

## 4 · Adapted source-aware WS0/WSA coding-agent prompt (proposal; no execution authorization)
```text
KFB PAPER RACER · SOURCE-LOCKED HD-2.5D POP-UP COMPARISON

Work in the EXACT existing KFB World/Track/Racer receiving owner and current
authorised branch, not an empty project. Read START_HERE, Chat/GitHub workflow,
Fresh Chat Slice, current owner SSOT/Return and the WS0 Paper Racer Golden gate.
Pin actual donor path/ref and show unchanged original in isolation first.
Do not create a new renderer, camera, player, collision world, AudioContext,
Asset Registry, Site, Stage or new gameplay loop.

GOAL
One short, actually drivable theatrical Paris 1950s streetside pop-up scene
using existing source-recognizable KFB assets. Visually compare 3D source,
a thin physical white-cut-edge silhouette, and an authored multilayer stage.
Keep the same road, vehicle, lighting/camera path, seed and physics.

SOURCE
One source-isolated authentic billboard/facade from current KFB source;
one paper tree/streetside prop; optional blank 16:9 HyperNorm billboard insert.
Existing generated Paris/LA sheets are mood-only, 0/4 standalone sprite-ready.
Each new sprite is independent PNG RGBA, clean transparent margin, no touching
neighbors, fixed camera angle, source-faithful silhouette, stable pivot/scale.
Any source-locked generation requires actual reference pixels, not a URL alone.

ANIMATE
Compare deterministic 3D hinge/flip or 2–4 authored staccato pose states
against ONE optional AutoSprite animate_asset and generate_asset_spritesheet
2-second asset animation. Reject shape drift, white-edge changes, moving or
painted-over 16:9 video insert, frame clipping, inconsistent light/ground
contact and contaminated alpha. Keep HyperNorm media as a separate material.
Use existing owner Three.js particle/ink/Goo effects only if justified;
do not replace driving physics, timeline or damage owner with a sprite.

PROOF
Three 10–15-sec drives along exact same actual route/camera and source object:
(A) accepted 3D; (B) physical white-edge plane; (C) layered stage.
Show unchanged source alone, then comparisons. Inspect png/atlas first-last
loop, per-frame alignment, cut edge against dark/light/checker, reader-scale
visual clarity, collision and camera continuity. Record measured GPU/CPU
frame time and memory at known device if available, not invented targets.

Handoff source pin/rights, generated image hashes and provider receipts,
sprite+atlas originals, modified files, true test counts and visible evidence.
Stop at owner boundary. Golden requires Georg approval; no auto-merge or Live.
If AutoSprite MCP is absent, label OPTIONAL_PROVIDER_NOT_CONNECTED and run
the owner-native hinge study without fake MCP generation or paid spending.
```

## 5 · Integration/QA notes
1. AutoSprite is more promising for **animated props, distant scenic silhouettes and optional 2D character cameos** than for generating stable multi-angled 3D architecture. Avoid 8-dir export on a building unless its asset purpose genuinely needs it.
2. Direct sprite-facing camera can be visually inconsistent with paper stage rotation. Preserve fixed-angle planes, crossed props or documented 4/8-angle impostors; shallow extruded geometry owns real white rim/shadow.
3. Keep crisp PNG pixels and alpha independent of depth-of-field/post blur; selectively blur far layers as authored camera choice, not entire white edges, text/video or collision cues.
4. Frame drift, color/material/shape changes, pivot alignment, foot contact, alpha halos, startup stalls, texture memory and mobile frame p95 are actual risk tests, not assumed pass.
5. Source assets/animation must remain searchable by Librarian asset ID and source SHA; candidate `KFB Popup Assets` GPT plugin stays a proposed extension of current Composer/Librarian, with AutoSprite as **optional paid animation backend** only.

## Result / unchanged next gate
Reviewed user Reddit post, current AutoSprite MCP/REST/export/pricing/terms and existing KFB WS0/Popup source. No source upload, paid API call, sprite export, runtime code/visual isolation/browser/GPU/CI/Stage/Site test (all **0**).
**One unchanged next gate:** WS0's existing **Paper Racer original source + Georg Golden/P0 frame approval**. This method becomes a nonblocking optional 1-asset comparison after that decision; no newly created RPG slice, plugin release or Site.
