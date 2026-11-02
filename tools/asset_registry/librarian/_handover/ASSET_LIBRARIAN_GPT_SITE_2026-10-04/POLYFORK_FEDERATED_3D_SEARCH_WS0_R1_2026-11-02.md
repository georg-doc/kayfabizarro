# Polyfork federated 3D search inside KFB Asset Librarian · R1

2026-11-02 · PROPOSAL / SITE-RECEIVING BRIEF · NOT IMPLEMENTED
Owner: KFB Asset Registry / Librarian, existing GPT Site contract PR #349.
Existing product: https://kfb-asset-librarian.frizzlebob.chatgpt.site/
Human proposal: extend the existing 3D asset search with Polyfork, not a new registry or new product.

## Product behavior
Use the current Find → Inspect → Collect → Candidate Handoff workflow. One Browse search with Source = KFB Registry (default) / Polyfork / All; do not silently merge Polyfork hit counts into the canonical Registry inventory. External cards visibly show Polyfork source, free-tier status when verified, name, preview and known facts. Keep the current Gallery/List, facets, inspector, Saved Sets, Style References and shared WorldBuilder Picker behavior. Preserve KFB Family→Pack→Collection facets; Polyfork kit/class are independent provider fields, never invented as KFB Registry facts.
Selecting a Polyfork hit opens the existing 3D Inspector using the actual permitted provider GLB or preview GLB when possible, not a generated substitute. Display provider page and current terms. Add to Set stores source-provider ID and user note without downloading the model; candidate-only handoff uses existing kfb.asset-handoff.v1 / kfb.asset-saved-set.v1 rather than a new scene runtime or source-truth index.

## Existing contract and donors
- tools/asset_registry/librarian/_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/START_HERE.md and UI_PICKER_CONTRACT.md: existing Site + shared window.KFBAssetPicker, one query/item contract, candidate-only handoff.
- RETURN_PHASE_A_SITE_2026-10-04.md: original 8/8 browser QA and live Registry 15,272 assets were prior Phase-A evidence; not proof that Polyfork is integrated.
- tools/asset_registry/librarian/README.md and search.js, preview3d.js, selection.js: historical code donors, not authority to recreate a Cloudflare-first product.
- WS0 source audit: tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/RESEARCH_POLYFORK_PARAMETRIC_ASSET_POOL_WS0_R1_2026-11-02.md on docs/kfb-decisions-register-2026-10-11.
- Current WSA Prop Pool R2 (V-1026), Asset Registry and KFB Clay/World ownership continue unchanged.

## Polyfork API and access facts (verify current response during implementation)
Official: https://polyfork.dev/assets ; https://polyfork.dev/licensing ; https://polyfork.dev/api ; https://polyfork.dev/llms.txt ; https://polyfork.dev/platform . Website on 2026-11-02 advertises roughly 2.8k free low-poly models, but counts change. Some cached llms.txt / API responses reflect an older Free/Pro policy; never infer eligibility from the stale catalogue total.
Provider advertises GET /api/assets with q, class, free, kit, max_triangles, pagination, GET /api/assets/{id}, GET /api/assets/{id}/matching and GET /api/kits. Read the returned access/free tier and the exact preview_glb URL. Never manufacture a CDN path, assume a model has a rig/knobs or expose an expiring download URL as permanent.
Preferred integration is a read-only REST provider adapter in the existing Site, not an autonomous MCP agent or a second runtime. API CORS/CSP, response shape, rate limits and direct GLB load are NOT tested. If denied, show an honest external link with CORS HOLD; do not use a proxy as a silent workaround. Debounce, cap pagination, abort stale queries, respect HTTP 429/backoff, never bulk mirror.
Do not execute vendor .mjs in the Site as part of the first search slice. Parameterized createAsset may be separately reviewed after genuine .mjs source inspection; a free account may be necessary for source downloads. Keep one Three.js preview owner.

## Provider-normalized external candidate (proposed fields, NOT a vendor API response)
source = external; provider = polyfork; stableId = polyfork:<asset-id>; providerAssetId = <id>; sourcePage = provider URL; sourceStatus = CANDIDATE_UNISOLATED; licenseRef = https://polyfork.dev/licensing; rightsStatus = VERIFY_CURRENT; previewGLB = exact returned provider URL; consumerDecision = owned-by-receiving-consumer.
Do not inject external records into registry/assets/v1, invent a Git SHA, mix provider kits into the KFB Pack facet, or mark a compatible rig based only on a source label. Saved Sets store references, not GLB/.mjs bytes. On revisit, re-resolve provider identity and access, with explicit offline/unavailable handling.

## Licensing boundary
Polyfork October 2026 terms allow user-facing browsing and direct free low-poly provider CDN hotlinking without a separate platform license; show provider origin at selection. They do NOT allow rehosting, proxying, mirroring or providing standalone raw asset files through the KFB Librarian under the ordinary license. HD user-serving, hosting raw binaries and offering vendor generation to users require their own agreements. Do not expose paid keys/browser secrets. KFB can store metadata and external links; not a scraped bulk catalogue or raw binary. Verify live policy again at implementation. Source: https://polyfork.dev/licensing and https://polyfork.dev/platform.

## Small existing-Site proof (not yet run)
1. Three selected real low-poly provider candidates from documented KFB inventory gaps; source objects shown IN ISOLATION in the existing Inspector, original first (not merely a loaded URL), with names, geometry/pivot, image/source evidence.
2. KFB-only query unchanged. Polyfork and All queries return source-labeled cards. Empty result, offline, 429, stale-result cancellation and pagination report correctly. KFB Registry count unchanged.
3. One real provider preview GLB loads via direct vendor CDN or reports CORS/CSP HOLD without proxy. No new Three/Renderer owner, no invented 3D placeholders.
4. Saved Set add/remove and reload survive with stable external ID. Candidate-only consumer handoff includes provenance and provider URL, no raw or expiring file and no auto-placement.
5. Existing Gallery, local facets, Style References, Site private access, narrow layout and existing Phase-A regressions remain good. Measure loaded bytes and single-asset viewer cost; do not prefetch many GLBs.
6. Independent tester/critic checks exact donor isolation and current license; record source, screenshot, real counts, failures and current Site revision before any acceptance claim.

## Authority / next gate
WS0 and the current Asset Librarian Site owner decide priority. WSA with Site-authoring capability is the intended implementation executor, inside the SAME Site project; PR #349 records contract only, not the separate Site-owned runtime source. No new repo, PR promotion, second Registry, public Stage or Cloudflare fallback.
Actual tests here: source/doc review only. 0 runtime modifications, 0 API/CORS live tests, 0 source GLB isolation, 0 Site deploys.
One next gate: ASSET_LIBRARIAN_POLYFORK_SOURCE_PROOF_01 — source-isolate one actual free GLB via direct provider access in the existing Site inspector, prove CORS/licensing, then decide KEEP/ADAPT/HOLD for federated Browse expansion.
