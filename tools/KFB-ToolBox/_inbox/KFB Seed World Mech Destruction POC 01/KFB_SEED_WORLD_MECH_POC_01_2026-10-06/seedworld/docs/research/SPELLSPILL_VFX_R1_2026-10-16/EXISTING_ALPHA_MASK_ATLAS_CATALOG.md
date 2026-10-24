# Existing KFB VFX-01 · White Alpha-Mask / Muzzle Atlas Donor Census · 2026-10-16

**Verdict: FOUND / SOURCE VERIFIED / REUSE FIRST — no new FX runtime.** This is very probably the catalog Georg remembered from an earlier Claude Design / ToolBox-Inbox project. The original references are already on `georg-doc/kayfabizarro@main`; no need to manufacture new particle art for the SpellSpill-inspired experiment.

## Exact original catalog and registered assets

**Original handoff catalog**, actual complete JSON read:
`tools/KFB-ToolBox/_inbox/KFB Style References/VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json`
Git blob `55c2ad6cf37dc906381949f2c0e56cc2ff3888c4`.
Of **132 asset entries**, **91** are `fx-visual` handoff candidates, including Brackeys `particles/alpha`, `particles/opague` and pre-drawn sheets. **This old handoff is a filtered, candidate-only consumer export, not the current complete asset registry.**

**Canonical current Registry index:** `registry/assets/v1/packs/index.json` blob `647412d12277a59732aaf6278318a0ab9e28d51e`, `packId: fx-visual`, `shard: packs/fx-visual.json`. Do not create another pack or recopy existing PNGs.

**Actual leaf files on current main (independent GitHub directory listing):**
- `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/particles/alpha/` — **93 white-alpha PNG objects**, including real `muzzle_01_a.png`–`muzzle_05_a.png` and `smoke_01_a.png`–`smoke_10_a.png`. Some are variants, not animation frames.
- `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/predrawn/` — **14 drawn spritesheets**, including `big_hit_6x5.png`, `impact_white_6x4.png`, `star_explosion_6x5.png`, `explosion_6x5.png`.
- Pack `LICENSE & CREDITS.txt` blob `2a10782d8761c121e6d0bc23add8b8d453777ff1`: states CC0 and cites Picster/Kenney texture masks, Thomas Iché flipbooks, CodeManu predrawn sheets; respect individual derivative/provenance for any new repackaging.

**Five exact muzzle white-alpha masks (Git blobs):**
`muzzle_01_a.png` `23984b9721140611363f1fed02f3538e12b752e6`; `muzzle_02_a.png` `0f26ac88a73080119e0bbfe5e464040b20ebd653`; `muzzle_03_a.png` `6cb99deb7783b0eb0d87ec6d217ece01917a8c29`; `muzzle_04_a.png` `5b3f13c6790e00a8e447a92397c1aaa45314a1da`; `muzzle_05_a.png` `78b99209f90cbe0c93132b8b38580e61e460401c`.

## The actual Claude Design rendering implementation (not just a catalog)
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-vfx.js` Git blob `62bb08843942c7040e452f1a4873fdf317dec6eb`.
- **4×4 atlas**, 256-px cells, assembled from original white-on-alpha Brackeys masks. 16 roles `cone`, `wide`, `star4`, `star8`, `bolt`, `flare`, `smoke`, `puff`, `dirt`, `scorch`, `ring`, `glow`, `trace`, `slash`, `flame`, `twirl`.
- Muzzle source role `cone = muzzle_01_a.png`, `wide = muzzle_02_a.png`; `flame = flame_05_a.png`, `smoke = smoke_03_a.png`, `puff = smoke_06_a.png`.
- One quad pool with four directions: camera billboard, ground, surface normal, velocity aligned; one current event/collision/gameplay owner with presentation-only `muzzle / impact / trail / aftermath` output. Tinting **one grayscale/white shape into multiple weapon palettes** reuses atlas memory across weapons.
- `FLIP.hit` = `big_hit_6x5.png` 11 frames / 36 fps, `FLIP.white` = `impact_white_6x4.png` 11 / 40, `FLIP.star` = `star_explosion_6x5.png` 26 / 42 and electric ring 30 / 40. These are **authored presentation recipe frame counts**, not a new proof that every sheet contains that number of visually non-empty frames at the current revision.
- Source design contract `tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/docs/VFX_DESIGN_v10.md` blob `5d716c2020561accb1d486f959622c34ce0ef61a`: 2D mask recipes, semantics before presentation, world-tinted tertiary smoke, no extra camera/audio/HP ownership, one dominant FX per event.
- Separate prior **VFX-01 actual interactive source review** `tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/KFB_VFX_01_REVIEW.dc.html` and `RETURN_VFX_01.md` blob `836ecd1edf83ef3930bcf7dc8ab86f7d44cf0e0c`, with opened original Brackeys, FreeHitVfx, Smoke Kenney, Tiny Swords and `explosions_smoke`. The review's historical evidence is retained but no new visual runtime acceptance claimed.

## Reuse in the SpellSpill / block-demolition candidate
**Keep rendering in the existing POC `seedworld/sw-fx.js` / `sw-destruct.js` presentation pools and the Combat FX owner. No `kfb-vfx.js` double-instantiation**. Treat its atlas assembly/mask roles and flipbook timing as a *technique donor* or style recipe to be consumed via adapters **only after source isolation in one existing fixture**.

Comparison design:
1. **A: current 3D clay smoke/blob source** (small opaque clusters at near impact center, real KFB Clay palette/shape);
2. **B: original 2D alpha-mask/flipbook donor** (single atlas/instanced quads, world palette-tinted smoke and explosion primary);
3. **C: hybrid** (few near 3D balls + real 2D smoke, angular opaque/instanced debris from real destruction source);
4. no-FX baseline for profiling.
Measure one rocket, four overlapping explosions, entire block cascade; preserve authoritative destruction cells and impact timings. Avoid per-particle physics/2nd engine. Check **GPU fill-rate/alpha overdraw**, not just draw calls; use target GPU p50/p95/p99 frame times and screenshot readability. Only if 2D masks materially reduce cost without losing source-authored Clay identity should they replace distant 3D smoke.

**Important interpretation correction from historical reviews:** `muzzle_01`–`05` are five available muzzle-form images. The VFX-01 card once cycles them for continuous-fire review, but don't claim those five are necessarily chronological frames. `slash_01`–`04` are confirmed variants; `smoke` variants are not automatically animation sequences. Only the explicit `predrawn/` sheets have documented frame-grid animation. `explosions_smoke` has packed/plist or animated GIF content with unresolved specific licensing; avoid silently adopting it before the provenance check.

This **is** directly useful for flame thrower too: `flame_05_a.png` can be tested as a tinted cone/tongue attached to repeated emission while the existing weapon owner decides firing, duration and contact; flames themselves must not write damage/HP.

**One parent next gate remains:** `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B`. No runtime replacement, generic “glowy particle pack,” automatic Stage or WorldBuilder R5.
