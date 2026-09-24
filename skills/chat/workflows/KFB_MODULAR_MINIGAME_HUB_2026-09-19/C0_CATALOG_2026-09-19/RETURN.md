# RETURN · C0 Baukasten Catalog

**Status:** `TECHNICAL TEST PASS · GEORG VISUAL REVIEW FAIL · NOT ACCEPTED`  
**Repository:** `georg-doc/kayfabizarro`  
**Base main:** `5650b6c54d8789b20ea80abe857688173d506d3b`  
**Branch:** `chatgpt-web/baukasten-c0-2026-09-19`  
**PR:** [#101 · C0: add modular minigame Baukasten catalog](https://github.com/georg-doc/kayfabizarro/pull/101) · OPEN · no auto-merge  
**Tested implementation head:** `df1ba37def5259996433659bebb42d3ee873b03d`  
**Evidence persistence head:** `bfd72cb46a0315e903a213911cdab96cc223a105`  
**Fixed Stage target:** `https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/baukasten-c0/`

## GOAL

Build only C0: a small visual Baukasten catalog for Kenney Platformer, KayKit Dungeon, KayKit Medieval Hexagon + Builder, all six Tiny Treats packs, KayKit Mystery Series 6, Resident Scene Modules and the FrizzleBob Driver Graft. Use the central registries and existing module contracts; do not copy source assets or create another Asset Library.

## EXISTING OWNER

- Asset identity/provenance: central Asset Registry / Asset Librarian.
- Resident presentation/activity: Resident Atlas S6 + Resident Scene Module adapter.
- FrizzleBob construction/face/rig: current Driver Graft contract + reader.
- Receiving game runtime retains movement, physics, collision, camera, progression, persistence and combat ownership.
- Deployment ownership is unchanged.

## EXACT SOURCES / REVISIONS

- GitHub base: `main@5650b6c54d8789b20ea80abe857688173d506d3b`.
- Central Asset Registry manifest source: `29aac1061bdd73736351cb856fa9f1e322478abc`.
- C0 source manifest: `SOURCE.json`.
- Resident proof: `tools/resident_atlas/modules/clown-juggling-island.module.json` through `tools/resident_atlas/modules/runtime/s6-resident-module.js`.
- FrizzleBob proof: `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json` through `frizzlegraft-v1/graft-mount.v1.js`, using the exact KayKit Mystery Series 6 Driver host.

## IMPLEMENTATION

Stage source: `kfb-hub/stage/minigames/baukasten-c0/`.

The catalog shows:

- 11 scoped registry-backed pack cards;
- all six Tiny Treats packs with explicit structural/scenery classification;
- five browser witnesses covering the four required roles: `carries`, `tells` modular, `tells` loose, `inhabits`, `acts`;
- exact source path, source revision/blob, browser-measured bounds, pivot/base, scale anchor, collision role and evidence status;
- reference-only Scene Recipe and Module Manifest exports.

### Tiny Treats source-truth correction

Current Registry evidence positively proves:

- Bakery Interior: modular interior + loose props;
- Bubbly Bathroom: modular interior + loose props;
- Pretty Park: ground modules + loose scenery;
- Pleasant Picnic: loose scenery;
- Homely House: limited scene/ground parts, not promoted to a universal interior grammar.

For **House Plants**, the current registry shard exposes plant/pot/leaf/vine families but no positive `wall` / `floor` / `door` / `modular` filename in the C0 scan. It is therefore kept as `LOOSE SCENERY · STRUCTURAL UNKNOWN`. This intentionally records the conflict with the workflow briefing instead of inventing a structural claim.

## PROTECTED BOUNDARIES

No asset copy, no second Asset Library, no second Resident runtime, no second Graft/animation owner, no collision takeover, no movement/camera/progression/combat rewrite and no auto-merge.

## TESTED RESULT

GitHub Actions workflow **KFB C0 Baukasten Browser QA**, run **#3 / 35443475397**, completed successfully.

- **19/19 assertions PASS**
- **11/11** scoped pack cards
- **6/6** Tiny Treats cards
- **5/5** measured WebGL browser witnesses
- **0** page/runtime errors
- **0** console errors
- desktop + mobile screenshots persisted in `screenshots/`

Measured browser bounds:

| Role proof | XYZ bounds | Base Y | Scale anchor | Collision |
|---|---:|---:|---|---|
| carries · Dungeon floor | 4.000 × 0.150 × 4.000 | -0.100 | footprint 4.000 × 4.000 @ scale 1.0 | support-surface candidate; consumer owns SOLID proxy |
| tells · Bakery door | 1.600 × 2.800 × 0.740 | 0.000 | 2.800 height → 2.05 target = **0.732** scale | connector visual; collision review |
| tells · Pretty Park bench | 2.000 × 1.406 × 1.317 | 0.000 | authored scale 1.0 | loose prop; collision review |
| inhabits · Clown module | 7.768 × 4.632 × 4.606 | 0.000 | module root · scene.scale = 1 | module owns none; consumer owns support/collision |
| acts · FrizzleBob graft | 1.943 × 2.278 × 0.994 | 0.000 | assembled figure height 2.278 @ scale 1.0 | actor presentation; runtime owns capsule/hitbox |

Evidence:

- `SOURCE.json`
- `TEST_REPORT.md`
- compact `browser-report.json`
- `screenshots/01-overview-desktop.png`
- `screenshots/02-tiny-treats-desktop.png`
- `screenshots/03-resident-desktop.png`
- `screenshots/04-graft-desktop.png`
- `screenshots/05-mobile-carry.png`

The screenshots were visually inspected after CI. Source models are visibly present; no mandated donor is replaced by fallback geometry.

## STATUS SPLIT

- `PROPOSAL`: none promoted beyond this bounded C0.
- `IMPLEMENTATION`: present on the branch / PR.
- `TESTED RESULT`: PASS as above.
- `PUBLIC DEPLOYMENT`: **PASS · CLOUDFLARE STAGE** — fixed route `https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/baukasten-c0/` returned HTTP 200 and passed the dedicated public browser proof.
- `GEORG ACCEPTANCE`: **FAIL · NOT ACCEPTED** — 2026-09-19 visual review rejected the current scale presentation, Clown activity quality and bespoke C0 UI as an acceptance basis.
- `ARCHIVED HISTORY`: failed Run #1/#2 were evidence-persist race conditions caused by concurrent branch writes; their browser proof step itself was not the product failure. Run #3 is the clean final test.

## PUBLIC DEPLOYMENT EVIDENCE

- publication mirror branch: `cloudflare-live`
- publish commit: `915b9f64451ba7e692505e598b74a0ace2db423f`
- public proof run: `35447051965` · SUCCESS
- public proof artifact: `10586540044`
- public checks: **8/8 PASS**
- HTTP: **200**
- runtime: **11 packs · 6 Tiny Treats · 5/5 browser proofs · 0 runtime/console/page errors**
- public Stage remains a candidate; PR #101 is still open and unmerged, and Georg acceptance is still OPEN.

## GEORG VISUAL REVIEW FAIL · 2026-09-19

Canonical postmortem:

`POSTMORTEM_VISUAL_REVIEW_FAIL_2026-09-19.md`

The technical/browser results above remain valid only for source wiring, loading, counts, bounds and runtime health. They do **not** establish visual scale correctness, animation quality, club/body clearance, UI continuity or acceptance.

Key review failures:

- per-card auto-framing makes relative scale comparison invalid;
- the Resident measurement is whole-vignette bounds, not Clown actor height;
- Clown juggling is visually rejected: arm participation is not convincing and clubs cross the body;
- the Resident handoff had already kept arm/catch/club-clearance QA open;
- the bespoke C0 UI does not reuse the Resident Atlas / World Atlas / Plant Prop Lab presentation language;
- H01/D01 continuation is blocked until the visual basis is repaired.

WSA entry:
`tools/KFB-ToolBox/_handover/C0_BAUKASTEN_VISUAL_FAIL_WSA_2026-09-19/START_HERE.md`

## ONE OPEN HUMAN REVIEW QUESTION

**Should WSA take only the Resident-Clown activity repair as the next bounded slice before any C0.1 scale/UI work continues?**
