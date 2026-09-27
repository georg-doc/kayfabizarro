# RETURN · PD-POOL-R3 · 2026-09-27

Status: **MERGED · PUBLIC_VERIFIED · LIVE REGISTRY VERIFIED · BULK IMPORT NOT STARTED**

## Exact slice

- repository: `georg-doc/kayfabizarro`
- owner: **Asset Librarian / Billboard Media**
- human gate: **Georg MERGE-/R3-Freigabe = OK**
- integrated PR: **#246**
- integrated stack: **PD-POOL-R1 → PD-POOL-R2**
- reconciled stack head before merge: `83a0bed0325065087d927a0dc735da7a90249a8e`
- main merge commit: `b133e66c4f8cc191501da504ebeceea67c6b4317`
- current main observed before closeout branch: `e0c0e2187a558ac4c070443f0e61666b5e3f4bb6`
- Registry bot head: `85776f806cec78dae4e8f8b6dce3ccd755490155`
- Cloudflare publication head: `6457d0376d7577e2719cab92d482c9104157c4c8`
- permanent human route: `https://kayfabizarro.pages.dev/asset-librarian/`
- bulk import: **NO**

## Merge/reconciliation result

The R1/R2 stack had only two real overlaps with current main:

- `skills/chat/START_HERE.md`;
- `skills/chat/CHANGELOG.md`.

They were reconciled additively. Six main-only workflow/policy files were then merged into the stack unchanged. The resulting two-parent reconciliation commit:

`83a0bed0325065087d927a0dc735da7a90249a8e`

has parents:
- PD stack: `3dcba55f40e58d33a3a987ba81c8ba87f39238a9`;
- current main at reconciliation: `bd911c6492cb8994874f2b2fe61cef400060f70c`.

Exact-head owner gates before merge:
- Asset Registry run `36289329583`: **SUCCESS**;
- Asset Librarian Browser run `36289329589`: **SUCCESS**, all v1/v1.3–v1.7 regressions.

PR #246 was then marked ready and merged with `expected_head_sha=83a0bed...`.

## Main result

Main merge commit:

`b133e66c4f8cc191501da504ebeceea67c6b4317`

Post-merge:
- Asset Registry run `36289510712`: **SUCCESS**;
- Asset Librarian Browser run `36289510743`: **SUCCESS**;
- GitHub Pages build run `36289509882`: SUCCESS, retained as repository deployment evidence only and **not** used as the Cloudflare acceptance surface.

Main contains:
- four persisted public-domain smoke assets;
- four neighboring rights/provenance sidecars;
- `media/public_domain/manifest.jsonl` with 4 rows;
- `media/public_domain` as a normal existing Registry root;
- explicit-sidecar integrity validation;
- no license inference;
- Librarian visible rights provenance;
- query/handoff rights evidence passthrough.

## Registry owner result

The main Registry workflow refreshed:

`bot/asset-registry-update@85776f806cec78dae4e8f8b6dce3ccd755490155`

Generated manifest:
- source commit: `b133e66c4f8cc191501da504ebeceea67c6b4317`;
- total assets: **14,923**;
- image-2d: **6,635**;
- model-3d: **6,550**;
- audio: **1,738**;
- `media/public_domain`: **4**;
- rights mode: `persisted-sidecar-passthrough-only`;
- license inference: **false**.

Four generated pack shards were inspected directly on the bot head:
- `met` → Bathing suit / source ID 86434;
- `aic` → Great Wave / source ID 24645;
- `commons` → File:Silent film.svg;
- `ia` → TheGeneral1926 Item Tile.

All four expose the persisted rights text, source page/record/file facts, exact SHA-256, sidecar path and tier `free`.

## Cloudflare publication

Only the browser-facing file actually required for R2 provenance display was promoted to the existing publication branch:

`cloudflare-live@6457d0376d7577e2719cab92d482c9104157c4c8`

Published file:
- `tools/asset_registry/librarian/render.js`
- blob `5bf9a570952bd403f7befc9e5a9324da3bebad28`
- byte-identical to main.

Assets themselves remain served through the exact pinned Registry source URLs; they were not duplicated into a second publication library.

## Permanent Cloudflare proof

Exact human route:

`https://kayfabizarro.pages.dev/asset-librarian/`

Dedicated public browser workflow:
- workflow: **PD-POOL-R3 permanent Cloudflare Librarian proof**;
- successful run: `36289917378`;
- job: `108537898828`;
- browser: **Chrome 153.0.8010.52**;
- result: **PASS**;
- final resolved route: `https://kayfabizarro.pages.dev/tools/asset_registry/librarian/`;
- registry mode: **live**;
- exact Live Registry source: `b133e66c4f8cc191501da504ebeceea67c6b4317`;
- visible UI label: `LIVE · b133e66c4f8c · 14,923 assets · 2026-09-27T04:46:57+02:00`;
- console errors: **0**;
- runtime exceptions: **0**.

Public browser checks:
- Bathing suit: search/detail/preview/provenance PASS · 1418 × 2440 px;
- Great Wave: search/detail/preview/provenance PASS · 843 × 578 px;
- Silent film: search/detail/preview/provenance PASS · 297 × 181 px SVG;
- The General: search/detail/preview/provenance PASS · 180 × 124 px.

For every item, the permanent site visibly exposed:
- source repo + exact source commit;
- blob SHA;
- stored license/source metadata;
- `explicit-sidecar`;
- rights tier;
- external provider;
- external source ID/page;
- rights-check timestamp;
- payload SHA-256;
- neighboring evidence sidecar path.

Public proof artifact:
- ID `10922076232`;
- name `pd-pool-r3-cloudflare-librarian`;
- size **1,284,237 bytes**;
- digest `sha256:f12289a03929be80bddfe68f42f7b93ee4fd1d26cd6df7d6e050054182598adf`;
- contains `result.json` plus four public screenshots.

### Public repair history

Initial public run `36289682425` reached the correct Live Registry and visible label, but failed one proof assertion because the UI intentionally abbreviates the displayed commit to 12 characters while the harness expected 40.

Observed label:

`LIVE · b133e66c4f8c · 14,923 assets · 2026-09-27T04:46:57+02:00`

The preceding exact-state assertion had already proven the full 40-character source commit. Repair pass 1 changed only the proof assertion to accept the intended 12-character visible prefix. No product or publication code changed. Run `36289917378` then passed completely. No repair pass 2 was needed.

## Protected boundaries

- Asset Librarian remains the single discovery/registry owner.
- Billboard/runtime owners remain unchanged.
- No second asset index was introduced.
- No runtime license inference was introduced.
- The four objects remain a bounded proven smoke set.
- The historical original selection manifest behind the old 84/6/40 counts is still missing.
- No broader discovery or bulk import was started.

## Next gate

The bounded R1→R3 production slice is closed.

The next public-domain-pool step is **not automatic**. Broader population requires either:
1. recovery of the original selected-hit manifest/UI export; or
2. an explicitly new curated discovery round, clearly labeled as new rather than reconstructed history.
