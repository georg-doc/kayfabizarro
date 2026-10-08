# Tool Node · Asset Librarian

Status: CURRENT_TOOL
Source: `tools/asset_registry/librarian/`
Canonical private Site: https://kfb-asset-librarian.frizzlebob.chatgpt.site/
Legacy mirror: https://kayfabizarro.pages.dev/asset-librarian/

## Purpose

Discover and hand off KFB assets without forcing every production chat to crawl folders or rely on stale bootstrap asset dumps.

## Current reading order

1. registry manifest + pack/rig summary
2. search catalog only when needed
3. produce a compact consumer handoff

## Production rule

Prefer this current registry over legacy multi-megabyte `kfb-asset-library*.json` copies inside old bootstraps. Legacy files remain historical snapshots, not current asset SSOTs.

## 2026-10-08 · External 3D Search R1

Status: **IMPLEMENTATION PARTIAL · GEORG-GATED MAIN MERGE REMAINS**

- private Site version 9 adds Search → Compare → Inspect Source → Add to Intake;
- external results remain `EXTERNAL_DISCOVERY_CANDIDATE` and never merge into normal `search_assets` output;
- new tools: `search_external_assets`, `get_external_asset`, `list_external_asset_providers`, `prepare_external_asset_intake`;
- intake schema: `kfb.external-asset-intake/1`;
- one CC0 GLB passed download/hash/source-isolation/3D-preview and bounded Registry registration proof on the review branch;
- no browser auto-import and no second index/Site/owner;
- Live Registry registration waits for Georg's optional main merge.

Evidence:
`tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/IMPLEMENTATION_RETURN_2026-10-08.md`

## 2026-09-27 · Public-domain pool R3

Status: **PUBLIC_VERIFIED**

- main integration: `b133e66c4f8cc191501da504ebeceea67c6b4317`
- Live Registry: `bot/asset-registry-update@85776f806cec78dae4e8f8b6dce3ccd755490155`
- Cloudflare publication: `cloudflare-live@6457d0376d7577e2719cab92d482c9104157c4c8`
- permanent route: `https://kayfabizarro.pages.dev/asset-librarian/`
- public browser run `36289917378`: 4/4 public-domain search/detail/preview/provenance PASS, 0 console errors, 0 runtime exceptions
- Registry mode remains read-only Live by default; no second index and no runtime license inference.
