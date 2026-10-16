# RETURN · Seed World / SpellSpill / Original KFB Alpha VFX Research R1
Date 2026-10-16
**Status:** SOURCE/OWNER/PERFORMANCE BENCHMARK RESEARCH COMPLETE · EFFECT IMPLEMENTATION NOT STARTED · NO GOLDEN/PRODUCT PASS.

**Named research owner:** existing KFB Seed World Mech Destruction POC 01 (research playground, **not** new World Studio/Combat Arena). Product source repo `georg-doc/kayfabizarro`; research branch `research/kfb-seedworld-spellspill-vfx-audit-2026-10-16`, Draft PR to main. The exact final SHA is the verified GitHub branch head, not a self-referential future number.

## Outcome
1. **Actual Dropbox folder** `SpellSpill VFX Study`: 9 screenshots with stable Dropbox file IDs/content hashes; no source media or code copied into repository. Original look still requires side-by-side visual capture. No precise shader implementation inferred.
2. **Original KFB alpha mask catalog found:** `tools/KFB-ToolBox/_inbox/KFB Style References/VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json`, plus canonical registry `fx-visual`, Brackeys `particles/alpha` 93 files, 14 predrawn sheets, five `muzzle_0X_a.png`, and `cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-vfx.js`. It already authors a 4×4 one-pool quad atlas with 16 semantic roles and real flipbook cues. See `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md`. **Use before new art or 2nd VFX runtime.**
3. **Performance is a design criterion**, not downstream optimization. Existing POC has once-only `sw-destruct.rocket` AOE logic, support collapse, object pools (debris=256; dust=200; fire=64), instanced weapon FX. Previous under-load data 584/584 VFX, 353ms first shader compile stall; historical 3.8–11.3 ms/step was preview-pumped, not real target fps.
4. **A/B/C planned:** few near opaque 3D Clay smoke lobes; current source-backed 2D/flipbook smoke and masks; mixed hero core + masked distant smoke + angular instanced debris. Same camera/seed and 1/4/whole-block cascades; compare visual hierarchy, GPU fill-rate and p50/p95/p99 frame time, pool evictions, memory, cleanup/reload. NO results are claimed yet.

## Files and evidence
`RESEARCH.md` · `SOURCE.json` · `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md` · `TEST_REPORT.md` · `CHANGELOG.md` · `RETURN.md` and optional CI workflow `.github/workflows/kfb-spellspill-reference-source-capture.yml` (Dropbox-contact-sheet attempt only). **25/25** documentation/source consistency assertions after real branch file readback. No package import, no visual source or target GPU test, no Site/Stage or Live, no PR merge.

Existing Combat Arena owns damage/weapon decisions; existing World/Rapier owner protected, WorldBuilder R4 STOPPED/F-R39 FAIL/NO MVP/no R5. KFB Clay Golden remains surface authority. Screenshot source is visual reference, not direct copying permission.

**Exactly one next gate:** `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B` via existing POC FX presentation only, no new physics/gameplay authority. Results must include real source isolation and real screenshot/target-GPU metrics before human style/perf decision.
