# PD-POOL-01 · Failure Recovery

Status: **ARCHIVED_FAILED_CANDIDATE · STOP RULE APPLIED · NO BULK IMPORT**
Date: 2026-09-27
Owner: **Asset Librarian / Billboard Media**
Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/public-domain-pool-pd01-2026-09-27`
Draft PR: **#239**
Frozen implementation head: `b49ae450aa378718e5e595fd8f00bfd215c1df65`
Base main: `6fb02674ea4344169778c0ae9e76b2543f1d78f9`
Stage: **NONE · NOT APPLICABLE**
Live promotion: **NO**

## Read in this order

1. `SOURCE_SNAPSHOT.md`
2. `ATTEMPT_LOG.md`
3. `TEST_REPORT.md`
4. `POSTMORTEM.md`
5. `SALVAGE_MAP.md`
6. `KNOWN_ISSUES.md`
7. `NEXT_GATE.md`
8. `EXPORT_MANIFEST.json`
9. exact PR #239 state/head

## Result

The intended four-source smoke test did not close.

The **last working execution** proved:
- Python syntax: PASS;
- The Met candidate: downloaded;
- Wikimedia Commons candidate: downloaded;
- Internet Archive candidate: downloaded;
- Art Institute of Chicago candidate: API/object path reached, but IIIF image request returned HTTP 403;
- therefore 3/4 source candidates loaded in the runner and nothing was persisted.

Two repair passes then failed before network execution because the AIC-header edit introduced a literal `\\n` into `fetch_pool.py`. The second repair did not change that blob. Per KFB stop discipline there is **no repair pass 3**.

## Important intake boundary

The uploaded source ZIP contains only:
- `media/public_domain/README.md`;
- `tools/public_domain/fetch_pool.py`.

It does **not** contain the original selection UI or exported `pool-manifest.jsonl`. Therefore no chat may claim that it has reconstructed or bulk-downloaded the earlier complete hit list.

## Exactly one next gate

**PD-POOL-F1 · isolated AIC transport proof.**

Start from the last compiling source at implementation commit `154e573b8defacd17e836de049b3853578291f94`, apply the AIC request-header change without touching the other providers, and prove **AIC artwork 24645 API + one 843 px IIIF image download** in a single runner. Only after that passes may PD-POOL-01 resume its four-source test.
