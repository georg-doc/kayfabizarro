# PD-POOL-01 · execution plan

Status: IMPLEMENTATION CANDIDATE
Date: 2026-09-27
Owner: Asset Librarian / Billboard Media
Branch: chatgpt-web/public-domain-pool-pd01-2026-09-27
Source package: tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip
Authoritative slice brief: tools/production_desk/briefings/PUBLIC_DOMAIN_POOL_PD01_2026-09-27.md on HUB-CTRL PR #202

## Bounded slice

- Goal: prove one rights-rechecked, locally persisted asset from each of The Met, AIC, Wikimedia Commons and Internet Archive.
- Owner: existing Asset Librarian / Billboard Media lane.
- Source: current main plus the uploaded Claude Design fetcher/README package.
- Protected boundary: no second registry, no Billboard runtime edit, no bulk import, no live rights decision.
- Done when: 4/4 source checks pass; each file has SHA-256 + sidecar evidence; second run is idempotent; stale partial file is removed and never registered.

## Intake finding

The uploaded ZIP contains only:
1. media/public_domain/README.md
2. tools/public_domain/fetch_pool.py

It does **not** contain the selection UI or an exported pool-manifest.jsonl. Therefore this slice can execute the canonical four-source smoke test, but it cannot honestly reproduce the earlier full “silent film” result set or call a reconstructed search “all selected hits”.

## Candidate objects

- The Met 86434 · Bathing suit, 1890–95. Source page visibly marks it Public Domain; API must still return isPublicDomain=true plus a primary image.
- AIC 24645 · Hokusai, The Great Wave, 1830/33. AIC API must return is_public_domain=true plus image_id.
- Commons · File:Silent film.svg. Source page states worldwide public-domain dedication.
- Internet Archive · TheGeneral1926. The smoke test takes only the small Item Tile, not the 1.6 GB film; Archive metadata licenseurl must itself pass. External cross-checks do not override a missing/unsafe Archive licenseurl.

## Fetcher hardening relative to the intake

The provider logic remains the intake logic. Added only what the slice brief requires:
- atomic .part → final download;
- maxBytes guard;
- SHA-256 sidecars;
- idempotent hash/source check;
- stale .part removal;
- Commons title lookup;
- machine-readable reports.

No search/discovery semantics were invented.
