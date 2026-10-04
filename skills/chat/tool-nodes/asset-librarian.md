# Tool Node · Asset Librarian

Status: CURRENT_TOOL
Source: `tools/asset_registry/librarian/`
Live: https://kayfabizarro.pages.dev/asset-librarian/

## Purpose

Discover and hand off KFB assets without forcing every production chat to crawl folders or rely on stale bootstrap asset dumps.

## Current reading order

1. registry manifest + pack/rig summary
2. search catalog only when needed
3. produce a compact consumer handoff

## Production rule

Prefer this current registry over legacy multi-megabyte `kfb-asset-library*.json` copies inside old bootstraps. Legacy files remain historical snapshots, not current asset SSOTs.


## 2026-10-04 · GPT Site Phase A current review surface

Status: **BUILT · WSA QA PASS · PRIVATE REVIEW**

Primary Phase-A human review surface:
https://kfb-asset-librarian.frizzlebob.chatgpt.site/

- exact Site source head: `d098d37a10b869a2a6d24c3c78e721991a4dc38f`;
- deployment `appgdep_6ac1b3f370b081919bbb3fe2d1b8ec71`: `succeeded`;
- WSA browser QA: **8/8 PASS**, JS syntax PASS, 0 console errors;
- Live Registry observed: **15,272 assets** at `64cbf1031392029f25110dd613247b32148aae42`;
- Tiny Treats: 8 packs;
- Bubbly Bathroom → Assets: 86 matches;
- direct signed-in Georg review is current gate: **GEORG-REVIEW-GPT-SITE-PHASE-A**.

Implemented Phase A includes live search, Family→Pack→Collection, gallery/list, image/audio/3D inspector, browser-local Saved Set, candidate export and the shared `window.KFBAssetPicker` seam.

The Site-owned source is separate from the KFB repo. Draft PR #349 remains the durable KFB contract/routing packet. Existing Cloudflare URL remains compatibility/source surface during migration.

Phase B and Phase C remain deferred until Georg review:
- B: durable multi-set persistence/import + explicit WorldBuilder placement seam;
- C: Intake / Dropbox / file adapters + Registry reconciliation.

## 2026-10-04 · GPT Site / shared WorldBuilder picker preparation

Status: **READY FOR WSA WORKSHOP · SITE NOT BUILT YET**

Current preparation:
- branch: `chatgpt-web/asset-librarian-gpt-site-prep-2026-10-04`;
- brief: `tools/asset_registry/librarian/_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/START_HERE.md`;
- UI/picker contract: sibling `UI_PICKER_CONTRACT.md`;
- evidence: sibling `SOURCE_EVIDENCE.md`;
- KFB Production Control workflow: `WSA-ASSET-LIBRARIAN-GPT-SITE-01`.

Direction:
- GPT Site becomes the intended primary human working surface after WSA implementation + Georg review;
- existing Cloudflare Librarian remains unchanged compatibility/source surface during migration;
- full Site and compact God Mode / WorldBuilder picker must share Registry-backed search/facets/item identity;
- Saved Sets are the human collection UX; existing candidate handoff remains underneath;
- Dropbox/file adapters are Intake only and stay `UNREGISTERED` until Registry ingestion;
- WorldBuilder remains scene placement/save owner.

Verified donor rule:
- current main Librarian is the primary implementation source;
- frozen PR #304 implementation `545853924c4c177b6e26af588020b7a59307bb71` is donor only for green Family→Pack→Collection + Motion-on-real-actor core;
- do not revive its failed motion scrub/transport bar.

Exactly one next gate: **WSA-ASSET-LIBRARIAN-GPT-SITE-01**.

## 2026-09-27 · Public-domain pool R3

Status: **PUBLIC_VERIFIED**

- main integration: `b133e66c4f8cc191501da504ebeceea67c6b4317`
- Live Registry: `bot/asset-registry-update@85776f806cec78dae4e8f8b6dce3ccd755490155`
- Cloudflare publication: `cloudflare-live@6457d0376d7577e2719cab92d482c9104157c4c8`
- permanent route: `https://kayfabizarro.pages.dev/asset-librarian/`
- public browser run `36289917378`: 4/4 public-domain search/detail/preview/provenance PASS, 0 console errors, 0 runtime exceptions
- Registry mode remains read-only Live by default; no second index and no runtime license inference.

