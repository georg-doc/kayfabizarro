# Changelog · KFB Asset Librarian

## Style Reference Library proposal · 2026-10-05

Status: **PROPOSAL · PLANNING ONLY · NO RUNTIME / SITE CHANGE**

### Decision
- Add a future **Style References** resource scope inside the existing Asset Librarian owner rather than creating a second Registry or productive Site.
- Private drawing-reference PDFs/pages remain authenticated private source objects; GitHub and public Cloudflare Stage may contain metadata/IDs only, never private source pages.
- Reuse existing Librarian Browse, Inspector, Saved Set and Intake seams.
- Proposed machine contracts: `kfb.style-reference/1` and `kfb.style-reference-pack/1`.
- Mandatory donor proof: resolve and show the exact source page/crop in isolation before claiming it informed a design.
- ToolBox exposes the capability through the existing Librarian; no duplicate front door.

### Prepared artifacts
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/STYLE_REFERENCE_LIBRARY_PROPOSAL_2026-10-05.md`
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/STYLE_REFERENCE_SCHEMA_DRAFT_2026-10-05.json`

### Surface boundary
- Existing private product Site remains `https://kfb-asset-librarian.frizzlebob.chatgpt.site/`.
- Reserved downstream formal mirror, if ever required: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/style-reference-library/` = **NOT DEPLOYED**.
- Current PR #349 Phase-A human-review gate remains unchanged; this proposal does not start Phase B/R1 implementation.

### Next
Exactly one proposal gate: Georg decides whether this concept should become a bounded R1 implementation after the current Librarian Phase-A review.

## GPT Site Phase A built · 2026-10-04

Status: **BUILT · WSA BROWSER-QA 8/8 PASS · PRIVATELY PUBLISHED · GEORG REVIEW OPEN**

### Result
- Private GPT Site: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/`.
- Exact Site source head: `d098d37a10b869a2a6d24c3c78e721991a4dc38f`.
- Deployment `appgdep_6ac1b3f370b081919bbb3fe2d1b8ec71` reports `succeeded`.
- Live Registry observed by WSA: 15,272 assets at `64cbf1031392029f25110dd613247b32148aae42`.
- Tiny Treats = 8 packs; Bubbly Bathroom → Assets = 86 matches.
- Browser QA = **8/8 PASS**, JavaScript syntax PASS, 0 browser console errors.

### Implemented
- debounced live search;
- Family → Pack → Collection facets;
- type/quick filters;
- Gallery/List;
- image/audio/3D inspector;
- browser-local named Saved Set + notes + add/remove;
- `kfb.asset-saved-set.v1` wrapping `kfb.asset-handoff.v1`;
- shared `window.KFBAssetPicker` seam;
- Phase C Intake shown as deferred, not silently implemented.

### Boundary
- Site-owned source remains separate from KFB GitHub runtime;
- PR #349 remains the durable KFB source contract/routing packet;
- Cloudflare Librarian is unchanged compatibility/source surface;
- no second Registry, WorldBuilder scene owner, animation compatibility promotion or scrub transport.

### Verification note
This chat could not anonymously fetch the private `chatgpt.site` review URL, so WSA deployment/browser evidence is recorded without claiming independent public-browser verification.

### Next
Exactly one gate: **GEORG-REVIEW-GPT-SITE-PHASE-A**.

## GPT Site + shared Asset Picker preparation · 2026-10-04

Status: **READY FOR WSA WORKSHOP · NO RUNTIME / DEPLOYMENT CHANGE**

### Decision
- Re-home the human-facing Librarian as a GPT Site after WSA implementation/review; keep the existing Cloudflare Librarian unchanged as migration compatibility.
- Use one shared discovery/query/item model for the full Librarian and the compact God Mode / WorldBuilder picker.
- Promote Family → Pack → Collection to primary browse facets using existing Registry facts.
- Replace JSON-first human collection work with Saved Sets while preserving `kfb.asset-handoff.v1` as the machine handoff seam.
- Keep upload/import material visibly `INTAKE / UNREGISTERED` until existing Registry ingestion accepts it.
- Dropbox is an optional intake source, not Registry truth.

### Reused donors
- current main Librarian v1.7 search/filter/preview/selection/resource surfaces;
- frozen PR #304 implementation `545853924c4c177b6e26af588020b7a59307bb71`: green Family/Pack/Collection browse + KayKit family facet + Motion-on-real-actor preview only.

### Explicitly not reused
- PR #304 motion scrub / new transport bar after its two-repair stop;
- any parallel Registry, taxonomy, WorldBuilder scene owner or animation compatibility owner.

### Prepared artifacts
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/START_HERE.md`
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/UI_PICKER_CONTRACT.md`
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/SOURCE_EVIDENCE.md`
- KFB Production Control workflow `WSA-ASSET-LIBRARIAN-GPT-SITE-01`

### Evidence
No runtime source changed; no new browser/WebGL/deployment PASS is claimed. Source reconciliation and all preparation-file write-backs were verified on the exact branch.

### Next
Exactly one gate: **WSA-ASSET-LIBRARIAN-GPT-SITE-01** → build Phase A GPT Site and return one direct Site review link.

## v1.6 Town Workbench · 2026-09-15

### Decision
- Add a KFB Town working view instead of creating a new asset database or semantic tagging system.
- Keep repository files and generated Registry facts authoritative; `Nature`, `Buildings`, `Space` and `Prop` remain UI/workbench groupings.
- Keep Animation Lab v2 as owner of final KayKit motion compatibility and attachment/runtime integration.
- Keep all Town outputs `candidate-only`.

### Implementation
- new `Town` production tab with Environment, KayKit Characters and Character Props lanes
- first-choice Nature ranking for KayKit Forest/Nature and Kenney Nature
- Buildings/Town and Space/Sci-fi working filters plus pack/source filtering
- repository-true Quaternius Space Kit handling (`scifi-ultimate-space-kit-quaternius`)
- Mystery Series prioritization and explicit `Rig_Small` / `Rig_Medium` / `Rig_Large` character filtering
- structural same-collection prop view in Town and character detail
- local Scene Plan with Environment + Character + Prop slots (`kfb.town-scene-candidate.v1`)
- direct local/shared KayKit motion selector in the selected character preview
- external source clip playback through the selected character's own Three.js mixer
- measured track-binding coverage; zero bindings fail closed
- v1.6 real-browser regression gate added without removing v1–v1.5 gates

### Tested result
Real Chrome 152 / WebGL 2, Live Registry:
- Town Nature view: 631 candidates; first page 18
- KayKit character view: 79 candidates; Mystery Series access including GothGirl PASS
- Buildings/Town filter: 1,003 candidates PASS
- Quaternius Space Kit view PASS
- GothGirl same-collection `GothGirl_Microphone` prop PASS
- 165 concrete local/shared motion preview choices exposed for GothGirl
- `Death_A` from local `Rig_Medium_General.glb`: **69 / 69 tracks bound and playback started**
- `kfb.town-scene-candidate.v1` remains candidate-only
- console errors: 0
- runtime exceptions: 0
- all prior browser regression gates v1 / v1.3 / v1.4 / v1.5 PASS

Browser run: `34914515885`  
Evidence artifact SHA256: `aac14624e0dc0b3f72a3616f514e29d3cceb5b0b681f14d827387fd68dcdce00`

### Preserved
- asset-file source truth and generated Registry ownership
- Live / Canonical Registry modes
- existing Selection + `kfb.asset-handoff.v1`
- Actors / Rigs / Motions / FX resource owners
- ToolBox owner readers for existing custom rigs
- Animation Lab v2 final compatibility ownership
- no Registry, asset, roster or consumer-runtime write path added

## v1.2 Core · 2026-09-12

### Decision
- Daily-use static site first; no LLM dependency.
- Reuse canonical Registry and tested Three.js browser.

### Implementation
- collection + review queue filters
- list/card result views
- exact identity/provenance
- dependency navigation
- richer rig/skeleton facts
- 3D controls and clip selector
- image and audio previews
- persistent local Selection Tray
- candidate-only consumer handoff retained
- dedicated WSA six-task acceptance gate

### Tested result
- existing v1 Chrome/WebGL regression PASS
- v1.2 T1–T6 acceptance PASS in Chrome 152 / WebGL 2
- 0 console errors / 0 runtime exceptions
- six task screenshots + machine-readable `result.json` uploaded by CI

### Preserved
- Registry/indexer owners
- consumer profiles and owner boundaries
- v1 browser WebGL regression test
- v1.1 LLM/OpenAI code, untouched and not required

## PD-POOL-R2 · public-domain provenance registration · 2026-09-27

Status: **TESTED CANDIDATE · NOT MERGED · NOT PUBLISHED**

### Decision
- Register only the four PD-POOL-R1 proven smoke assets through the existing Asset Registry/Librarian owner.
- Add `media/public_domain` as a normal Registry source root; do not create a second media index.
- Pass through only explicit persisted `.license.json` evidence. The Registry does not infer copyright/license status.
- Reuse the existing Librarian provenance detail panel and candidate-only handoff contract.

### Implementation
- Registry builder verifies tracked sidecar, required facts, allowed stored tier, exact local path, byte count and fresh SHA-256 before accepting a public-domain asset.
- Catalog records carry `license`, `rightsEvidence`, tags and explicit-sidecar provenance.
- Librarian detail exposes stored rights provenance, tier, external provider/source ID/page, check timestamp, payload SHA-256 and sidecar path.
- CLI/handoff preserves the same evidence.
- Existing Registry workflow now watches `media/public_domain/**`.

### Tested result
Dedicated R2 run `36288195716` / job `108532932188` on `8c8b907c3526956a90e5ddbe2d6174eab2ee16da`:
- 46/46 unit/regression tests PASS;
- generated Registry build + validator PASS;
- 4/4 public-domain registrations PASS;
- 4/4 CLI discoverability PASS;
- Chrome 153: 4/4 search, detail, image preview and visible provenance PASS;
- 0 console errors; 0 runtime exceptions.

Existing PR owner regressions also PASS:
- Asset Registry run `36288282662`;
- Asset Librarian Browser Smoke run `36288282599`, all v1/v1.3–v1.7 gates green.

Dedicated browser evidence artifact: `10921660721` (`pd-pool-r2-asset-librarian`), including four screenshots.

### Boundary
The permanent Cloudflare Librarian has **not** been updated by this candidate. Merge/publication remains a separate Georg-gated step. Bulk pool population remains blocked by the missing historical selected-hit manifest.

