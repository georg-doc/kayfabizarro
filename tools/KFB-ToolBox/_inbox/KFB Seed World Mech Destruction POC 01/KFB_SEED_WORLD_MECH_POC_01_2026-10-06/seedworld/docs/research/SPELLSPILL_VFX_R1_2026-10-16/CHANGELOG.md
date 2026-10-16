# ADDITIVE CHANGELOG · SpellSpill / KFB Block Destruction FX R1
## 2026-10-16 · Screenshot reference and performance benchmark proposal
- Georg supplied 9 PNG visual references in Dropbox: waterfalls/water, fluids, smoke, clay spheres, angular debris, explosions, sustained flame effects and area-of-effect visuals.
- Product priority clarified: readable, good-looking many-emitter/cascade/whole-building-block demolition on modest GPU; compare 3D smoke vs 2D source textures vs hybrid and measure actual cost/overdraw.
- Recovered exact POC owners `sw-destruct`, `sw-fx`, `sw-mech` and original POC performance limitations; no new combat/physics engine.
- Recovered **original Claude Design alpha-mask VFX library**, including user-remembered muzzle masks, 4x4 atlas code, 14 predrawn sheets, five white-alpha muzzle masks, earlier VFX-01 source review. Source file IDs, git blobs, source license and registry pack linked.
- 25/25 cross-source guards; actual render/target-device benchmark not run. CI source screenshot attempt pending.
- One next gate: `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B` (source-isolated source visuals plus quantified cascade A/B).
