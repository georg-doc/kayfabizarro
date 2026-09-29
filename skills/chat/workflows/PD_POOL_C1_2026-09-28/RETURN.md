# RETURN · PD-POOL-C1 · curated public-domain expansion

Status: **FROZEN_FAILED_CANDIDATE · MACHINE PASS · SEMANTIC CURATION FAIL AFTER REPAIR 2 · DRAFT PR #281 · NOT MERGED / NOT PUBLISHED**

## Source

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/public-domain-pool-c1-2026-09-28`
- Draft PR: **#281**
- Base main: `dbc7a6bc2414f3e870ff08053eb62fb67dc9202a`
- Tested implementation head: `5ba9d609dc11a7f2d7acfbd720ded442f65c438e`
- Frozen candidate content head before recovery metadata: `253a73a64b2c42653798940140e472dc3e4638e8`
- Raw machine report: `media/public_domain/PD_C1_TEST_REPORT.json`
- Recovery: `skills/chat/workflows/PD_POOL_C1_2026-09-28/RECOVERY.md`

## Actual tests / evidence

GitHub Actions:

- run `36469308353`: SUCCESS — initial bounded machine gate
- run `36469998059`: SUCCESS — Repair 1 machine gate
- run `36470538545`: SUCCESS — Repair 2 machine gate

Final machine counts:

- discovery: **23**
- persisted: **22**
- provider split: **Met 6 / AIC 4 / Commons 6 / IA 6**
- rejected: **1** — `aic-c1-7624` / HTTP 403
- new payload: **12,753,473 bytes**
- branch manifest: **26 rows** = 4 prior verified + 22 C1
- attribution fallback: **5 rows**
- smoke regression: **4/4 unchanged**
- second run: **0 loaded / 22 unchanged / 1 repeat reject**
- stale partials: **0**
- stored byte/SHA sidecar integrity: **PASS**
- generated credits vs attribution sidecars: **PASS**

No C1 Cloudflare browser proof or C1 screenshots exist because the slice stopped before publication. The only valid human route remains the previously verified pre-C1 Librarian:

`https://kayfabizarro.pages.dev/asset-librarian/`

C1 is **not present there**.

## Failed gate

Semantic discovery relevance remained materially noisy after the two allowed repair passes. The machine PASS therefore does not qualify the candidate for Registry ingestion, merge or publication.

Examples: a 1480–85 perspective diagram was selected by the query `scientific diagram 18th century`; Internet Archive metadata search still selected 2026/non-target items into historical source classes.

## Boundaries

- C1 is a **new dataset candidate**, not reconstruction of the lost historical 84/6/40 selection.
- Historical recovery remains separate in Draft PR #251.
- Asset Librarian stays the only Registry/discovery owner.
- Billboard runtime is unchanged.
- No auto-merge, Registry refresh, Stage publication or Live promotion.

## Unresolved

The broad provider semantic discovery approach is not reliable enough to admit unattended C1 selections. The 22 persisted objects are frozen as evidence, not approved pool content.

## Exactly one next gate

**PD-POOL-C2 · new branch from current main; manually inspect and record exact provider object IDs/source pages first, then feed only that reviewed manifest through the existing hardened fetcher.**
