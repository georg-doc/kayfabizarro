# RETURN · Asset Librarian External 3D Search Federation R1 Prep

Status: **READY FOR IMPLEMENTATION · PREP ONLY**  
Date: 2026-10-07  
Owner: **KFB Asset Registry / Asset Librarian**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/asset-librarian-external-3d-search-r1-2026-10-07`  
PR: **none created**  
Verified evidence head before this Return write: `b75672fb42cff8715448115b397bb94a9ebfec7e`

## Outcome

The proposed 3D search engine is suitable as an **external discovery federation behind the existing Asset Librarian**, not as a second Asset Registry or standalone KFB product.

Initial donor:

- `arielshad/3d-asset-server@c5c408d1eb524e3bf878bb63ff47bc928980bf76`
- public service: `https://3d.shep.bot/`
- current inspected provider count: **20**
- browser + REST/OpenAPI + MCP + CLI/agent interfaces
- donor software license: Apache-2.0

The KFB integration contract is now prepared and source-audited.

## Binding integration decisions

1. **One owner stays:** KFB Asset Registry / Asset Librarian.
2. **No second index:** external results remain `EXTERNAL_DISCOVERY_CANDIDATE`.
3. **No tool-name collision:** keep current KFB `search_assets`; add explicit external tools:
   - `search_external_assets`
   - `get_external_asset`
   - `list_external_asset_providers`
   - `prepare_external_asset_intake`
4. **No license promotion by inference:** remote license fields are `sourceLicenseClaim` until controlled KFB intake creates exact evidence.
5. **No loaded-URL shortcut:** thumbnail/API availability is not proof of the actual donor asset.
6. **Source isolation required:** exact downloaded payload must be hashed and shown in isolation before Registry registration.
7. **Normal handoff only after registration:** `kfb.asset-handoff.v1` remains for canonical Registry assets.
8. **Fail soft:** external service/provider failures may not degrade existing Registry search.
9. **No browser auto-import:** payload download/persistence belongs to a trusted authenticated agent/Work intake flow.
10. **Existing Site retained:** External Search is an additive view inside the current Asset Librarian shell.

## Prepared implementation route

Target user flow:

`Search → Compare → Inspect Source → Add to Intake → KFB Import/Verify → normal Registry`

Prepared intake contract:

`kfb.external-asset-intake/1`

The packet deliberately carries external identity/source/license/file facts but **no canonical KFB assetId**.

Implementation phases are defined in `START_HERE.md`:

- Phase A — external adapter/contracts;
- Phase B — additive Site view;
- Phase C — one real trusted import + hash/source-isolation + existing Registry registration;
- Phase D — agent-facing external search tools.

## Tests / evidence

Source/contract audit:

**14/14 PASS**

Evidence:
`TEST_REPORT.md`

Proven:
- current KFB owner/tool/handoff boundaries;
- donor field model;
- 20-provider registry in donor source;
- current public landing-page source count;
- REST/OpenAPI + MCP architecture;
- API/scrape/link source distinction;
- public remote MCP no-caller-filesystem-write default;
- compatibility with an additive KFB external-discovery lane.

Not yet tested, by design:
- Site→public-service CORS;
- live REST search/detail result correctness;
- response latency/size under real multi-provider queries;
- CSP/thumbnail behavior in the existing Site;
- secure real file download;
- archive/content-type/path traversal protections;
- exact SHA/provenance intake;
- source-isolated 3D model proof;
- existing Registry registration/refresh;
- final Site/browser/MCP regressions.

These are implementation acceptance gates, not prep claims.

## Changed files

1. `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/START_HERE.md`
2. `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/TEST_REPORT.md`
3. `tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/WORK_WSA_IMPLEMENTATION_BRIEF.md`\n4. this `RETURN.md`

## Preserved / unchanged

- current Asset Registry;
- current Asset Librarian Site/project;
- Assets/Motions/Saved Sets/Intake/Style References;
- Style Reference GitHub-live data path;
- `kfb.asset-handoff.v1`;
- ToolBox front door;
- current Hub routing;
- Open World/WorldBuilder runtime;
- consumer runtimes.

No Site deployment.  
No Cloudflare publication.  
No Hub/router update.  
No merge.  
No Live promotion.

A central Hub/ToolBox metadata update is intentionally not required for a prep-only capability that has not changed a canonical product route or human P0 gate.

## Recommended next executor

**ChatGPT Work/WSA · Asset Librarian Integrator**

One bounded productive implementation job, using the existing Asset Librarian Site/project.

For the substantial implementation run, name:
- Builder / Integrator;
- Integration Tester;
- Independent Critic;
- Production Guard;
- one production writer.

The Integrator should not stop after an adapter-only proof. It should reach the representative end-to-end seam:

**external search → one selected direct-download candidate → controlled import → SHA/provenance → source-isolated actual 3D view → existing Registry → ordinary Librarian refresh/handoff.**

## Georg action

**Nothing required for this preparation.**

A human product gate is useful only after the additive External Search surface and one real imported candidate exist.

## Exactly one next gate

**IMPLEMENT_EXTERNAL_3D_SEARCH_FEDERATION_INSIDE_EXISTING_ASSET_LIBRARIAN**
