# RETURN · PD-POOL-R2 · 2026-09-27

Status: **PASS CANDIDATE · ASSET LIBRARIAN REGISTRATION PROVEN · NOT MERGED · NOT PUBLISHED**

## Exact slice

- repository: `georg-doc/kayfabizarro`
- owner: **Asset Librarian / Billboard Media**
- branch: `chatgpt-web/public-domain-pool-r2-librarian-2026-09-27`
- stacked Draft PR: **#246**
- stacked base: R1 Draft PR #242 / `05fa1be8196891f3db07fceaac958e3868ec8d3b`
- default branch observed at slice start: `89a8f0a7d8a9e2e1948e8079f16eb89b616ac7db`
- tested implementation head: `8c8b907c3526956a90e5ddbe2d6174eab2ee16da`
- Stage: **NONE · NOT PUBLISHED**
- Live promotion: **NO**
- merge: **NO**

The exact final handoff head is the PR #246 branch head containing this Return. Do not infer it from the tested implementation head.

## Goal / actual result

Goal: register only the four R1-proven public-domain smoke objects in the **existing** Asset Registry/Librarian and prove human-name discovery plus visible persisted provenance.

Result: **PASS CANDIDATE**.

The existing Registry now accepts `media/public_domain` as a source root. It does not infer rights. For this root an asset is registered only when its tracked neighboring `.license.json` sidecar matches its path, byte count and SHA-256 and contains the required persisted source/rights facts.

Exactly four assets register:
- Met 86434 · Bathing suit;
- AIC 24645 · Great Wave;
- Commons · `File:Silent film.svg`;
- Internet Archive · `TheGeneral1926` Item Tile.

The existing Librarian provenance panel exposes their stored rights evidence, and query/handoff preserves it.

## Dedicated R2 evidence

Initial run:
- run/job: `36288091709` / `108532629103`;
- product/build gates: green;
- browser proof: failed only because the test harness requested a non-public internal `catalogById`.

Repair pass 1:
- changed only the browser proof lookup;
- final run/job: `36288195716` / `108532932188`;
- conclusion: **SUCCESS**;
- no repair pass 2.

Final dedicated counts:
- syntax: PASS;
- Asset Registry/Librarian tests: **46/46 PASS**;
- Registry build: PASS;
- Registry validator: PASS;
- exact public-domain registrations: **4/4 PASS**;
- Registry total in candidate build: **14,923**;
- CLI discoverability: **4/4 PASS**;
- Chrome 153 search: **4/4 PASS**;
- detail view: **4/4 PASS**;
- image preview: **4/4 PASS**;
- visible provenance evidence: **4/4 PASS**;
- console errors: **0**;
- runtime exceptions: **0**.

Dedicated artifact:
- ID: `10921660721`;
- name: `pd-pool-r2-asset-librarian`;
- digest: `sha256:93d7249f62e2cd1771bdfa35f27b47cc682d092c7dba2588b121b042be2e8906`;
- contents include machine-readable Registry/browser evidence and four screenshots.

Visible image proof:
- Bathing suit: **1418 × 2440 px**;
- Great Wave: **843 × 578 px**;
- Silent film SVG: **297 × 181 px**;
- The General Item Tile: **180 × 124 px**.

## Existing owner regressions

### Asset Registry owner

Run/job `36288282662` / `108533183836`: **SUCCESS**.

- 46/46 tests PASS;
- build PASS;
- validator PASS;
- rig-facts build PASS;
- rig-facts validate PASS;
- query/handoff smoke PASS;
- generated counts: 14,923 total · 6,635 image-2d · 6,550 model-3d · 1,738 audio · 4 public-domain.

### Asset Librarian browser owner

Run/job `36288282599` / `108533183644`: **SUCCESS** in Chrome 153.

All existing regression lanes PASS:
- v1 WebGL;
- v1.3 Production Resources;
- v1.4 Live Registry + rig previews;
- v1.5 animation discovery/framing/permanent URL;
- v1.6 Town workbench/motion preview;
- v1.7 browse/filter behavior.

Console errors: 0. Runtime exceptions: 0.  
Regression artifact ID: `10921760773`.

## R2 implementation delta

From R1, R2 adds/changes:
- `tools/asset_registry/config.json` — adds `media/public_domain` root;
- `tools/asset_registry/build.py` — explicit sidecar passthrough + integrity gate, no license inference;
- `tools/asset_registry/query.py` — preserves license/rights/tags in compact handoffs;
- `tools/asset_registry/librarian/render.js` — reuses provenance panel for explicit stored rights facts;
- `.github/workflows/asset-registry.yml` — watches `media/public_domain/**`;
- `tools/asset_registry/tests/test_public_domain_registry.py`;
- `.github/scripts/asset-librarian-public-domain-r2-smoke.mjs`;
- `.github/workflows/public-domain-pool-r2.yml`;
- owner README/changelog and this evidence package;
- central router/changelog metadata.

No generated `registry/assets/v1` output is hand-committed by R2. That remains owned by the existing Registry workflow/bot branch.

## Retained boundaries / unresolved

- no second Registry or Librarian;
- no new rights classifier;
- no bulk import;
- no Billboard runtime edit;
- historical selected-hit manifest/UI export remains missing;
- R1/R2 remain stacked Draft PRs and are not merged;
- current `main` advanced during the overall PD work; final merge/reconciliation must re-read it and rerun owner gates;
- permanent Cloudflare Librarian is **not claimed to contain R2**;
- no R2 public Stage route was created.

## Exactly one next gate

**PD-POOL-R3 · named Georg merge/publication gate.**

At that gate:
1. re-read current `main`;
2. reconcile/merge the R1 → R2 stacked chain only with Georg's explicit approval;
3. let the existing Asset Registry workflow refresh its reviewable `bot/asset-registry-update` output;
4. verify the exact permanent Cloudflare Asset Librarian URL in a browser and confirm the four objects/provenance are visibly present;
5. stop before any broader pool population.

Bulk discovery/population remains a separate later decision.
