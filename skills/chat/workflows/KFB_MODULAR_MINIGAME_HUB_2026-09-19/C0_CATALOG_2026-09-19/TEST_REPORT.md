# C0 Baukasten · TEST REPORT

**Status:** TESTED RESULT · PASS  
**GitHub SHA under test:** `df1ba37def5259996433659bebb42d3ee873b03d`  
**Route:** `http://127.0.0.1:8777/kfb-hub/stage/minigames/baukasten-c0/`  
**Browser:** Playwright Chromium  

## Assertions

- 19/19 assertions passed.
- Pack cards: 11/11.
- Tiny Treats cards: 6/6.
- Browser witnesses: 5/5.
- Page/runtime errors: 0.
- Console errors captured by QA: 0.

## Measurements from loaded browser scenes

| Role proof | XYZ bounds | Base Y | Scale anchor | Collision | Evidence |
|---|---:|---:|---|---|---|
| carry | 4.000 × 0.150 × 4.000 | -0.100 | footprint 4.000 × 4.000 @ scale 1.0 | SUPPORT_SURFACE_CANDIDATE · consumer SOLID proxy | FOUND · MEASURED · BROWSER SEEN |
| tell-modular | 1.600 × 2.800 × 0.740 | 0.000 | height 2.800 → 2.05 target = scale 0.732 | CONNECTOR VISUAL · collision REVIEW | FOUND · MEASURED · BROWSER SEEN |
| tell-loose | 2.000 × 1.406 × 1.317 | 0.000 | height @ authored scale 1.0 | LOOSE PROP · collision REVIEW | FOUND · MEASURED · BROWSER SEEN |
| inhabit | 7.768 × 4.632 × 4.606 | 0.000 | module root · scene.scale = 1 | NONE IN MODULE · support/collision consumer-owned | FOUND · MODULE MOUNTED · MEASURED · BROWSER SEEN |
| act | 1.943 × 2.278 × 0.994 | 0.000 | assembled figure height 2.278 @ scale 1.0 | ACTOR PRESENTATION · runtime owns capsule/hitbox | CONTRACT FOUND · GRAFT MOUNTED · MEASURED · BROWSER SEEN |

## Scope boundary

The test verifies catalog loading, exact registry/source wiring, visual WebGL previews, measurements, responsive layout and existing Resident/Graft seams. It does **not** claim gameplay collision, Dungeon integration, public Cloudflare deployment or Georg acceptance.
