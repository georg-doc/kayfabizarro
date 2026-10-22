# WSA Work · Meshy Community source in KFB Asset Librarian · implementation brief R1
Date: 2026-10-22 | Proposed execution: BOUNDED_SLICE | repo: georg-doc/kayfabizarro | intake branch: planning/asset-librarian-meshy-community-search-r1-2026-10-22

## Mandatory read-first
skills/chat/START_HERE.md
skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
tools/asset_registry/librarian/README.md + current source SSOT / Recovery / Return / branch head
tools/asset_registry/librarian current source, search/filter, Selection, intake, provenance, 3D preview and `kfb.asset-handoff.v1` handlers.
WS0 briefing alongside this file; any later WS0 decision supersedes this proposal.

## Goal
Make Meshy Community a source inside the **existing 3D asset search** and **existing import/selection list**, with no second UI/runtime/registry owner. This is not primarily generation. Do not create a separate Meshy gallery/app.

## Preflight / feasibility
Official Meshy Enterprise `GET https://api.meshy.ai/openapi/v1/showcases` supports `search`, `page_size<=10`, `format=glb`, `sort_by`, returns `id, result_id, model_url, community_url, author, topology, name, categories, tags` etc. Costs 1 credit/request and needs Enterprise. Source: https://docs.meshy.ai/en/api/enterprise-api ; regular OpenAPI does not include it: https://docs.meshy.ai/openapi.json . Cross-site Meshy API calls are blocked by CORS: https://www.meshy.ai/api . Docs evidence is NOT an authenticated integration test.
Before writing, inspect current website and GitHub owner search code, available Meshy account permissions, permitted server-side adapter deployment and credit budget. Never put Meshy keys in browser/GitHub.

## Implement smallest working variant
If verified Enterprise access and expense permission: extend current search provider adapter with **server-side** showcase fetch, server-managed secrets, bounded queries/debounce/caching, pagination/10 max, attribution and error states. If absent: add `Meshy Community` as an external-source path in existing Librarian **import/selection flow** where user pastes a Meshy community model URL and manually captures verifiable metadata. Mark this `LINK_INTAKE_ONLY` and do not fake API-backed live search. Preserve normal KFB search when Meshy is unreachable. Do not scrape private/undocumented Meshy endpoints.

Each selected candidate carries source provider, immutable ID if confirmed, page URL, author, title/tags, license status and verified proof, raw/model availability, captured-at, source and `candidate-only` status; preserve existing handoff format or add a backward-compatible source envelope. Prefer existing storage and original inspector/3D loader; a URL or thumbnail is NOT proof of donor mesh use. Render actual original source in isolation (front/side/3-4 when feasible), record tri count/bbox when downloadable. No auto-import into production Registry and no silent retexture/AI remake.

## Validation / handoff
Test existing Local/Live/Canonical search unchanged, new Meshy source UX, result selection/deselection and persistence, export/reimport handoff and duplicates, bad URLs, unavailable/unauthorized API, license unknown, credential privacy, and no-credit path. Document real pass counts and source preview evidence (or explicit blockers). Single writer: Librarian. Keep original registry, Asset Scene Composer, Clay Asset Studio and Blender owners unchanged.
If site-capable, update the existing productive Site first: https://kfb-asset-librarian.frizzlebob.chatgpt.site/ . Cloudflare `https://kayfabizarro.pages.dev/…` only as required Stage mirror, linked in KFB Hub, actually opened before public PASS claim. No GitHub Pages/githack/raw-CDN as acceptance. No merge/Live promotion without Georg human gate.

## Final Return (same handoff)
Exact repository/branch/PR/head, changed files, implementation/evidence/Return and additive changelog, test counts, real source-isolation screenshots or blocker, productive Site status, Cloudflare Stage URL only if published and verified, WS0 Hub metadata routing if gate changes, unresolved items and exactly one next gate. Two non-improving repairs: freeze smallest failing seam, export failure recovery. Optional unavailable CLI: record once and continue repo-native checks.

## Future bonus, NOT in this slice
Read/write adapter for ChatGPT Webchat to query or add Meshy assets through existing Librarian provider and import list; never a second catalog or parallel selection store.
