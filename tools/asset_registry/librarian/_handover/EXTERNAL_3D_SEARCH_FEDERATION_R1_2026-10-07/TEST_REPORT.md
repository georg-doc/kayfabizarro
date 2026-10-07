# TEST REPORT · Asset Librarian External 3D Search Federation R1 Prep

Date: 2026-10-07  
Scope: **source/contract audit only · no KFB runtime or Site implementation**

## Evidence inspected

KFB:
- `skills/chat/tool-nodes/asset-librarian.md`
- `tools/asset_registry/librarian/README.md`
- `tools/asset_registry/librarian/state.js`
- `tools/asset_registry/librarian/render.js`
- `tools/asset_registry/librarian_tools.py`
- `tools/asset_registry/openai_librarian.py`
- current Style Reference additive Return on PR #359

External donor:
- `arielshad/3d-asset-server@c5c408d1eb524e3bf878bb63ff47bc928980bf76`
- `README.md`
- `src/core/types.ts`
- `src/providers/index.ts`
- `src/mcp/server.ts`
- `src/api/openapi.ts`
- `LICENSE`
- live landing page `https://3d.shep.bot/` observed 2026-10-07

## Source-audit assertions

**14/14 PASS**

1. PASS — existing KFB Asset Librarian remains the canonical Registry consumer/owner; no second index is required.
2. PASS — existing KFB tool facade already owns the name `search_assets`; direct MCP namespace grafting would collide semantically.
3. PASS — existing KFB normal consumer export remains `kfb.asset-handoff.v1` and candidate-only before consumer validation.
4. PASS — external donor normalizes assets with stable `provider:nativeId` identity.
5. PASS — donor model exposes source page, thumbnail, author, license metadata, free/price, formats/resolutions, poly count, rigged/animated and downloadable state.
6. PASS — donor currently registers **20 providers** in `src/providers/index.ts`.
7. PASS — current live landing page also states **20 asset sites** and exposes browser/API/MCP entry points.
8. PASS — donor exposes REST/OpenAPI 3.1 and Streamable HTTP MCP.
9. PASS — donor MCP exposes search/detail/provider listing and optional trusted local download.
10. PASS — public/remote MCP explicitly avoids caller-filesystem writes by default and can return bundle/file URLs instead.
11. PASS — provider access modes distinguish API/scrape/link and can retain link-only sources without false direct-download claims.
12. PASS — donor software is Apache-2.0; asset licenses remain per-source/per-listing facts.
13. PASS — KFB provenance UI/Registry already distinguishes stored source/license facts and explicit rights evidence, so external license claims can remain a lower-trust discovery layer.
14. PASS — the current Asset Librarian Site can receive an additive External Search view without changing the existing Style Reference GitHub-live data owner or creating a second Site.

## Important gap classifications

### Runtime / network checks not performed in this prep slice

- browser CORS behavior for `https://3d.shep.bot/v1/*` from the private Asset Librarian Site;
- live REST search/detail response against the public service;
- response-size/performance under real multi-provider queries;
- thumbnail/content-security behavior inside the existing Site;
- file-download/import of a real candidate;
- malware/content-type/zip traversal safeguards for trusted import;
- Registry registration of a downloaded external asset;
- final browser/MCP regression.

These are implementation acceptance checks, not planning blockers.

## Provenance conclusion

The donor's `license` object is sufficient for **discovery display**, not for automatic KFB rights promotion.

Binding mapping for implementation:

`external license metadata → sourceLicenseClaim`

Only controlled KFB intake with exact payload/source evidence may create normal Registry provenance/rights evidence.

## Tool-surface conclusion

Do not replace the KFB `search_assets` tool.

Add explicit external tools:

- `search_external_assets`
- `get_external_asset`
- `list_external_asset_providers`
- `prepare_external_asset_intake`

A trusted writer/import workflow remains separate.

## Result

**PREP PASS · architecture and acceptance contract are implementation-ready.**

No claim of implemented Site behavior, public Stage, Registry import or external API runtime PASS is made.
