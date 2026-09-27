# TEST REPORT · PD-POOL-R2 · 2026-09-27

Status: **PASS CANDIDATE · REGISTERED IN GENERATED ASSET REGISTRY · NOT PUBLISHED**

Owner: **Asset Librarian / Billboard Media**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/public-domain-pool-r2-librarian-2026-09-27`  
Draft PR: **#246**  
Stacked base: R1 PR #242 / `05fa1be8196891f3db07fceaac958e3868ec8d3b`  
Tested implementation head: `8c8b907c3526956a90e5ddbe2d6174eab2ee16da`

## Registration contract

R2 adds `media/public_domain` to the **existing** Asset Registry roots. It does not create a second catalog.

For assets under that root, the existing deterministic builder now accepts rights/provenance only from the neighboring persisted `.license.json` sidecar. Before registration it verifies:

- sidecar is tracked;
- required source/right fields are present;
- tier is one of the already supported registerable tiers;
- sidecar `localPath` matches the exact payload;
- stored byte count matches the payload;
- stored SHA-256 matches a fresh SHA-256 of the payload.

No copyright/license classification is inferred by the Registry.

## Dedicated R2 gate

Final successful run: `36288195716` / job `108532932188`.

| Check | Result |
|---|---|
| Python/JS syntax | PASS |
| Asset Registry + Librarian unit suite | **46/46 PASS** |
| Existing Registry build | PASS |
| Existing Registry validator | PASS |
| Exact `media/public_domain` records | **4/4 PASS** |
| Generated Registry total | **14,923** |
| `media/public_domain` root count | **4** |
| CLI discoverability | **4/4 PASS** |
| Chrome search | **4/4 PASS** |
| Chrome detail view | **4/4 PASS** |
| Chrome image preview | **4/4 PASS** |
| Chrome visible provenance facts | **4/4 PASS** |
| Browser console errors | **0** |
| Browser runtime exceptions | **0** |

Browser: **Chrome 153.0.8010.52**.

Evidence artifact:
- ID `10921660721`
- name `pd-pool-r2-asset-librarian`
- size 1,245,103 bytes
- digest `sha256:93d7249f62e2cd1771bdfa35f27b47cc682d092c7dba2588b121b042be2e8906`
- includes machine-readable Registry/browser results plus four screenshots.

### Visible browser proof

The real-browser gate found, opened and previewed all four assets and visibly exposed the stored provenance:

- **Bathing suit** — 1418 × 2440 px; provider `met`; source ID `86434`; exact stored SHA visible.
- **Great Wave** — 843 × 578 px; provider `aic`; source ID `24645`; exact stored SHA visible.
- **Silent film** — 297 × 181 px SVG; provider `commons`; source ID `File:Silent film.svg`; exact stored SHA visible.
- **The General 1926** — 180 × 124 px; provider `ia`; source ID `TheGeneral1926`; exact stored SHA visible.

For all four, the existing provenance panel showed:
`license/source metadata` · `explicit-sidecar` · rights tier · external provider · external source ID/page · rights-check timestamp · payload SHA-256 · sidecar path.

## Repair history

Initial dedicated run `36288091709` / job `108532629103`:

- syntax: PASS;
- 46/46 tests: PASS;
- Registry build/validate: PASS;
- 4/4 registration: PASS;
- 4/4 CLI discoverability: PASS;
- browser proof: FAIL in test harness only.

Proven cause: the proof script tried to access non-public `getState().catalogById`. The product intentionally exposes only compact public state.

Repair pass 1 changed **only the proof script** to read the generated canonical `catalog.jsonl` through browser `fetch`. Product implementation was unchanged. Run `36288195716` then passed completely. No repair pass 2 was required.

## Existing owner regressions on PR #246

### Refresh KFB Asset Registry

Run `36288282662` / job `108533183836`: **PASS**.

- tests: **46/46 PASS**;
- canonical Registry build: PASS;
- canonical Registry validator: PASS;
- rig-facts build: PASS;
- rig-facts validator: PASS;
- query/handoff smoke: PASS;
- generated counts: 14,923 total · 6,635 image-2d · 6,550 model-3d · 1,738 audio · **4 public-domain root**.

### KFB Asset Librarian Browser Smoke

Run `36288282599` / job `108533183644`: **PASS** in Chrome 153.

Existing browser regression gates all passed:
- v1 WebGL asset preview;
- v1.3 Production Resources;
- v1.4 Live Registry + rig previews;
- v1.5 animation discovery/framing/permanent URL;
- v1.6 Town workbench/motion preview;
- v1.7 browse pagination/multiselect filters.

Console errors: **0**. Runtime exceptions: **0**.  
Regression artifact ID: `10921760773`.

## Publication boundary

R2 is **not merged and not published**. The permanent production Librarian URL is therefore **not claimed to contain R2**.

No R2 Cloudflare Stage route was created. The dedicated Chrome test is automated repository evidence, not a human public acceptance surface.

## Exactly one next gate

**PD-POOL-R3 · named human merge/publication gate.**

Reconcile the stacked R1/R2 chain with current `main`, merge only with Georg's explicit gate, allow the existing Asset Registry owner workflow to refresh `bot/asset-registry-update`, then open and verify the permanent Cloudflare Librarian before any broader public-domain pool work.
