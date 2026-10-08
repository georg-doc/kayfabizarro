# WORK/WSA IMPLEMENTATION BRIEF · Asset Librarian External 3D Search Federation R1

Status: **READY TO RUN · IMPLEMENTATION NOT STARTED**  
Date: 2026-10-07  
Execution mode: **BOUNDED_SLICE**  
Owner: **KFB Asset Registry / Asset Librarian**  
Repo: `georg-doc/kayfabizarro`  
Receiving branch: `planning/asset-librarian-external-3d-search-r1-2026-10-07`  
Prepared head at brief creation: `bc28d577b6e33fdb6d6dbbcf94f82ab50f20a7ec`

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/tool-nodes/asset-librarian.md`
5. `tools/asset_registry/librarian/README.md`
6. `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/START_HERE.md`
7. `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/TEST_REPORT.md`
8. current additive Style Reference Return on Draft PR #359.

GitHub current state overrides this brief if it has changed since preparation.

## Outcome

Inside the **existing Asset Librarian Site/project**, add an additive External Search capability backed initially by `3d-asset-server`, then prove one real end-to-end candidate:

`external search → inspect source → prepare intake → trusted download → hash/provenance → show actual 3D source object in isolation → register through existing KFB Asset Registry → refresh ordinary Librarian → candidate-only kfb.asset-handoff.v1`.

The job is not complete at “API connected” or “search results visible”.

## Fixed roles

- **Builder / Integrator:** ChatGPT Work/WSA · Asset Librarian Integrator
- **Integration Tester:** fresh-context read/write-test process; may create test/evidence artifacts but does not accept product outcome
- **Independent Critic:** fresh-context, **no production writes**; opens the actual Site/results and audits source/provenance truth
- **Production Guard:** separate outcome classifier; only role allowed to escalate a local failure to global STOP
- **Only production writer:** Builder / Integrator
- **STOP authority:** Production Guard only, after outcome-critical evidence
- **Human gate:** Georg only after the additive External Search UI plus one real imported source-isolated asset are proven; question = “Is this external-search/intake flow useful enough to keep in the Asset Librarian?”

A failed optional provider or one unsupported asset must be quarantined/deferred, not treated as global failure.

## Protected owner boundaries

Must remain unchanged:

- KFB Asset Registry is the canonical asset truth.
- existing KFB `search_assets` keeps its semantics.
- `kfb.asset-handoff.v1` remains the canonical post-registration handoff.
- Style Reference live-data owner/path remains unchanged.
- existing Asset Librarian Site/project is updated in place; **no second Site**.
- ToolBox/Hub routes remain unchanged unless implementation creates a genuinely new canonical deep-link or human gate.
- no Open World / WorldBuilder runtime writes.

## External donor

Initial provider federation:
- repo: `arielshad/3d-asset-server`
- audited head: `c5c408d1eb524e3bf878bb63ff47bc928980bf76`
- service: `https://3d.shep.bot/`
- API/MCP version observed in source: `0.1.0`
- current provider count: 20
- software license: Apache-2.0

Do not fork/reimplement its 20 provider adapters unless the integration proves a concrete blocker.

## Phase 0 · recover actual Site/source state

Before changing anything:

1. inspect the exact existing Asset Librarian Site source/project and current deployed version;
2. recover the current branch/PR status of Style References so no newer work is overwritten;
3. inspect current `librarian_tools.py`, `openai_librarian.py`, browser state/render/preview/provenance contracts;
4. verify the external donor API/service contract still matches the audited source.

If current source has advanced, adapt additively; do not reset it to this prep snapshot.

## Phase A · external adapter and truth model

Implement a bounded adapter owned by Asset Librarian.

Required tool/data names:
- `search_external_assets`
- `get_external_asset`
- `list_external_asset_providers`
- `prepare_external_asset_intake`
- intake schema: `kfb.external-asset-intake/1`

Requirements:
- retain exact `provider:nativeId`;
- preserve source page;
- label remote license only as a source claim;
- preserve link-only vs direct-download truth;
- expose provider timeout/error/link status;
- never allocate a canonical KFB assetId at discovery time;
- fail soft if the external service is unreachable.

Do not modify the canonical Registry builder output in this phase.

### Phase A evidence gate

Automated contract tests must prove:
- internal `search_assets` unchanged;
- external names do not collide;
- external candidate cannot enter normal handoff;
- provider/link/license truth survives normalization;
- timeout/error does not break internal search.

Persist implementation checkpoint after coherent Phase A.

## Phase B · additive External Search Site view

Update the **existing Site** only.

Add one clear view/lane:

**External Search**

Required flow:
`Search → Compare → Inspect Source → Add to Intake`

Cards/detail should expose only known facts:
- provider;
- source title/author;
- thumbnail;
- external source page;
- source license claim + attribution flag when present;
- free/paid;
- downloadable/link-only;
- formats/resolutions;
- polycount;
- rigged/animated.

Do not invent KFB compatibility scores.

Preserve:
- Assets;
- Motions;
- Saved Sets;
- Intake;
- Style References;
- 3D previews;
- local state;
- mobile behavior.

If cross-origin thumbnails cannot be safely embedded, preserve source links and fail closed instead of proxying/mirroring by default.

## Phase C · representative trusted import

Pick **one low-risk direct-download CC0 model** from a source that the donor can fetch directly, preferably GLB/glTF and small enough for inspection.

The Builder must:

1. obtain exact asset detail and selected files;
2. download in a trusted execution environment, not from browser auto-import;
3. validate content type, archive paths and extracted file boundaries;
4. compute exact byte count + SHA-256;
5. persist source identity/retrieval/license-claim facts;
6. **show the actual downloaded 3D object in isolation before Registry integration**;
7. record visible source-isolation proof;
8. register the asset through the existing KFB Asset Registry path with explicit provenance/rights evidence appropriate to the source;
9. run Registry refresh;
10. prove the ordinary Librarian finds the new canonical asset;
11. prove normal candidate-only `kfb.asset-handoff.v1` now works.

A thumbnail or successful remote URL load does not satisfy step 6.

If the chosen sample itself is defective, choose one replacement sample. Do not spend repeated repair passes on a non-critical external asset.

## Phase D · agent-facing proof

Prove the KFB-owned external tools from an agent-oriented surface:

- search a concrete request;
- get one candidate;
- prepare intake;
- keep internal Registry search separate.

Do not expose unrestricted public filesystem download/write.

If MCP publication requires a new product/plugin surface not already owned by Asset Librarian, stop at the owner boundary and return the exact connector/plugin handoff instead of silently creating a second owner.

## Integration Tester

The Tester must independently run:

1. existing Asset Librarian core regressions;
2. Style Reference regressions;
3. internal search before/after comparison;
4. external multi-provider search;
5. link-only result case;
6. provider failure/timeout case;
7. external-candidate cannot use normal handoff;
8. prepared intake schema validation;
9. representative trusted download security checks;
10. exact hash/provenance checks;
11. imported Registry lookup;
12. normal handoff after registration;
13. mobile/desktop External Search navigation;
14. console/runtime error audit.

Report actual counts, not “all tests passed” without numbers.

## Independent Critic

Fresh context, no production writes.

Open the actual deployed/review Site and verify:

- the Librarian still feels like one product, not two stitched browsers;
- internal vs external truth is obvious;
- license claim vs verified KFB provenance is visually unambiguous;
- source page is always reachable when present;
- no direct-download claim appears on link-only assets;
- the imported representative model shown in KFB matches the source-isolated object;
- current Assets/Motions/Style References remain intact;
- no generic replacement branding/chrome was introduced.

Critic returns raw findings + PASS/FAIL only.

## Production Guard

Classify failures:

- **CORE_BLOCKER:** internal Registry/normal Librarian broken, provenance corruption, unsafe import, second owner/site introduced.
- **ACCEPTANCE_BLOCKER:** external search/intake cannot complete representative end-to-end seam.
- **MINOR / QUARANTINABLE:** one provider broken, one thumbnail fails, one sample asset unusable.
- **COSMETIC / DEFERRED:** non-blocking layout/polish.

After two non-improving repairs on the same seam, freeze that smallest seam. Continue the parent outcome unless Guard proves it outcome-critical.

## Acceptance matrix

All required:

1. existing internal Registry search unchanged;
2. Style References unchanged;
3. existing Site/project retained;
4. external search returns normalized results from multiple providers;
5. provider source/failure/link status visible;
6. external license presented as source claim, not KFB verified rights;
7. link-only item does not claim direct download;
8. external candidate has no canonical KFB assetId;
9. external candidate cannot use normal `kfb.asset-handoff.v1`;
10. one selected real direct-download model passes safe trusted intake;
11. exact payload SHA-256 + byte count recorded;
12. actual downloaded source object shown in isolation before integration;
13. explicit provenance/rights evidence persisted;
14. asset enters the existing Registry, not a side index;
15. ordinary Librarian finds it after refresh;
16. normal candidate-only handoff works after registration;
17. external-service failure does not break internal Librarian;
18. agent external-tool flow works without overwriting internal tool semantics;
19. Tester report gives actual counts;
20. Independent Critic PASS;
21. Production Guard GO.

## Publication / review

Do not create Cloudflare merely because the slice completes.

Primary review surface is the existing Asset Librarian GPT Site. Publish/update it only when implementation is coherent enough for actual review.

No auto-merge. No Live promotion.

## Required final Return

Return:
- exact repo / branch / PR if created / verified head;
- exact existing Site project/version/deployment used;
- changed files;
- exact donor head actually consumed;
- actual test counts;
- one source-isolation screenshot/proof for the imported asset;
- browser proof for External Search;
- exact imported Registry asset identity + hash/provenance evidence;
- unresolved/quarantined providers/assets;
- no hidden second index/Site;
- one next gate.

Final outcome label must be exactly one of:

`READY FOR GEORG REVIEW · EXTERNAL SEARCH + REAL IMPORT PROVEN`

or

`IMPLEMENTATION PARTIAL · <one proven outcome-critical blocker>`.
