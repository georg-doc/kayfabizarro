# WS0 · Meshy Community Search inside existing Asset Librarian · planning R1
Date: 2026-10-22 | Status: RESEARCH/PLANNING ONLY | owner: tools/asset_registry/librarian/ (georg-doc/kayfabizarro) | branch: planning/asset-librarian-meshy-community-search-r1-2026-10-22

## Georg's decision / product intent
Extend the **existing 3D Asset Search** (same query, results, selection, import-list/handoff UX) with **Meshy Community** as another selectable source. NOT a separate site, not a new asset registry, not a competing import workflow. Optional Webchat access to the **same** search/selection is a later bonus, not the first outcome.

## Verified external technical finding (2026-10-22)
Meshy official **Enterprise API** documents GET https://api.meshy.ai/openapi/v1/showcases, with search text, page_size 1–10, sort_by, format=glb, result id/result_id, model_url, community_url, author, topology, name, object_prompt, categories, tags, mode, timestamps. Each search request costs **1 Meshy credit**; Enterprise tier required. Source: https://docs.meshy.ai/en/api/enterprise-api (also https://docs.meshy.ai/it/api/enterprise-api). Meshy's public OpenAPI https://docs.meshy.ai/openapi.json intentionally excludes this Enterprise showcase endpoint. Meshy explicitly states API does NOT support direct cross-site CORS: https://www.meshy.ai/api . The endpoint was **documentation-verified**, not successfully called with an authenticated Enterprise account. No valid Meshy Community search on a normal account has been demonstrated. No claims about bulk download, CC0 suitability, license per returned model or signed URL persistence without checking each result.

## WS0 decisions requested
1. ACK/TUNE existing Librarian owner/UX: Source filter `Meshy Community` alongside current Registry sources; preserve same search results, inspector, Selection drawer, `kfb.asset-handoff.v1` candidate-only. Registry remains source of truth for imported/approved assets; unimported community hits are external candidates, never silently canonical.
2. Select technical route after entitlement check: **A** official Enterprise showcase API via authenticated server-side adapter with credit budget/consent, caching and failure handling; **B** if Enterprise unavailable: source URL capture/manual link intake in **same Librarian import list**; local search remains intact. No undocumented scraping or frontend API keys.
3. Guard license/provenance: persist source URL, provider ID, author, timestamp, evidence URL, license verification status, permitted use and download status. Do not mark CC0 automatically merely because a listing appears.
4. Stage scope: bounded WSA Work implementation + source isolation proof, no automatic generation/retexture, no writes to Game/World runtime or new Site.
5. Bonus: Webchat connector can search/add through exactly the same backend and candidate format after Librarian path is proven.

## Success / gate
WSA returns working existing-search extension, 5 representative real-source candidate records if accessible, query/selection/import-list persistence, graceful unavailable-API path, tests and real source preview proof. Keep original owners and Stage rules. WS0 next gate: choose A only if Enterprise credentials/entitlement and credit policy exist; otherwise authorize B now.
