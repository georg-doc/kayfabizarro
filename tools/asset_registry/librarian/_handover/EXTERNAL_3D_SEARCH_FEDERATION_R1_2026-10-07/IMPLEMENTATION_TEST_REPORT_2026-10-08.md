# IMPLEMENTATION TEST REPORT · Asset Librarian External 3D Search Federation R1

Date: 2026-10-08  
Result: **21 PASS · 1 GEORG-GATED BLOCKER**

## Live API and browser surface

1. PASS — `https://3d.shep.bot/openapi.json` served API version `0.1.0` with search, detail, files, download and provider routes.
2. PASS — `GET /v1/providers` returned 20 providers.
3. PASS — `GET /v1/search?q=pine+tree&type=model&free=true` returned 24 ranked candidates.
4. PASS — the owner-private Site searched the live service from the browser.
5. PASS — cards/details exposed provider claims without presenting them as KFB Registry facts.
6. PASS — two candidates were selected and compared side by side; the control enforces a maximum of four.
7. PASS — source inspection opened the provider page, not a fabricated KFB URL.
8. PASS — Add to Intake persisted `kfb.external-asset-intake/1` metadata with no downloaded/registered claim.
9. PASS — `measuredHeight` and `scaleHint` survived an asynchronous detail fetch.
10. PASS — identical requests used the bounded session cache.
11. PASS — a forced HTTP 503 failed softly and explicitly stated that Registry data was unchanged.

## Regression and responsive QA

12. PASS — existing Asset Saved Set/notes remained byte-identical.
13. PASS — existing Style Reference card notes/principles/tags remained byte-identical.
14. PASS — existing Style Reference Set/notes remained byte-identical.
15. PASS — existing Registry 3D thumbnails still mounted `model-viewer`.
16. PASS — the selected external GLB loaded in `model-viewer` after explicit user action.
17. PASS — mobile width `390 px`, document scroll width `390 px`; no horizontal overflow.
18. PASS — browser console errors: zero.

The same browser suite passed locally and against deployed Site version 9.

## Agent and Registry tests

19. PASS — 18 focused Librarian/OpenAI/external-adapter tests.
20. PASS — complete Asset Registry suite: 53 tests.
21. PASS — one-file Registry build and validation registered the CC0 GLB as `model-3d`, dependency status `embedded`, then normal `search_assets` found it by title with exact SHA/rights evidence.

## Blocker

22. BLOCKED BY EXPLICIT HUMAN GATE — production Live Registry proof requires the review asset to reach `main`, after which the existing owner workflow can refresh `bot/asset-registry-update`. This run did not merge to `main` because the handover explicitly forbids it without Georg.

## Exact proven asset evidence

- Asset ID in proof Registry: `media/public_domain/threedassets/stylized-pine-tree-tall.glb`
- Bytes: `26580`
- SHA-256: `c8c072ea3ab67c066713f5e6b21cb6eca79f46346e6e4f2da17aaad47bb70d04`
- License record: `CC0 1.0 Universal`
- Rights mode: `explicit-sidecar`
- Registry count in bounded proof: `1`
- Browser preview: loaded
- Source size: `2.300 × 4.454 × 2.187 m`

## Final label

**IMPLEMENTATION PARTIAL · NO MAIN MERGE ALLOWED, SO THE PROVEN CC0 ASSET CANNOT YET ENTER THE LIVE REGISTRY**
