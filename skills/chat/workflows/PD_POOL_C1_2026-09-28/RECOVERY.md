# RECOVERY · PD-POOL-C1 · 2026-09-28

Status: **FROZEN_FAILED_CANDIDATE · DO NOT MERGE · NOT PUBLISHED**

## Resume identity

- Repository: `georg-doc/kayfabizarro`
- Owner: **Asset Librarian / Billboard Media**
- Branch: `chatgpt-web/public-domain-pool-c1-2026-09-28`
- Draft PR: **#281**
- Base main used by C1: `dbc7a6bc2414f3e870ff08053eb62fb67dc9202a`
- Final tested implementation head: `5ba9d609dc11a7f2d7acfbd720ded442f65c438e`
- Frozen candidate content head before recovery metadata: `253a73a64b2c42653798940140e472dc3e4638e8`
- Historical 84/6/40 manifest recovery: **separate Draft PR #251; identities not reconstructed**
- Permanent public Librarian: `https://kayfabizarro.pages.dev/asset-librarian/` — **pre-C1 R3 state only**

## What C1 proved

The current hardened `tools/public_domain/fetch_pool.py` remains a valid persistence/rights-recheck path for The Met, Art Institute of Chicago, Wikimedia Commons and Internet Archive. C1 added bounded discovery plus provider preview controls without introducing another Registry or Billboard runtime owner.

All three C1 workflows completed machine-successfully:

1. `36469308353` — initial bounded discovery; transport/rights/idempotence green; selection quality too concentrated.
2. `36469998059` — Repair 1, round-robin queries / one candidate per phrase; machine green; semantic mismatches remained.
3. `36470538545` — Repair 2, provider metadata relevance + tighter IA media/query rules; machine green; semantic mismatches still remained.

Final machine evidence from `media/public_domain/PD_C1_TEST_REPORT.json`:

- discovered: **23**
- persisted: **22**
- rejected: **1** — `aic-c1-7624`, HTTP 403
- persisted by provider: **Met 6 · AIC 4 · Commons 6 · IA 6**
- new payload: **12,753,473 bytes**
- pool rows on the frozen branch: **26** = 4 prior verified + 22 C1
- fallback-attribution rows: **5**
- original smoke regression: **4/4 UNCHANGED**
- second run: **0 loaded · 22 unchanged · 1 repeat reject**
- stale `.part`: **0**
- stored payload ↔ sidecar SHA/byte integrity: **PASS**
- `CREDITS.md` ↔ attribution sidecars: **PASS**

## Why C1 must not merge

The failed gate is **semantic source/query relevance**, not copyright persistence or download integrity.

After the second repair, broad provider/full-text metadata still admitted materially misleading category matches. Concrete examples in the final frozen manifest include:

- `met-c1-337494`: dated **1480–85**, tagged from query **scientific diagram 18th century**;
- `ia-c1-tecnopatia-biliar`: dated **2026**, selected under **Prelinger industrial film**;
- `ia-c1-the_bamboo_garden_1704.poem_librivox`: selected under **public domain music 1920**;
- `ia-c1-classic_cartoons_201603`: a later compilation selected under **silent film 1920**.

The two-pass repair limit is exhausted. **Do not make Repair 3 inside C1.** Do not salvage the branch by deleting questionable rows and merging the remainder; that would turn a failed discovery candidate into an unreviewed partial import.

## Protected state

Do not disturb:

- the four already merged/public-verified PD-POOL-R3 smoke assets;
- Asset Librarian as Registry/discovery owner;
- Billboard runtime owner;
- the historical recovery record in PR #251;
- `media/public_domain/PD_C1_TEST_REPORT.json` as raw technical evidence.

The 22 C1 payloads and sidecars remain **recovery evidence only** on PR #281.

## Fresh-chat resume

A new executor should read, in order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/PD_POOL_C1_2026-09-28/RECOVERY.md`
5. Draft PR #281 and `media/public_domain/PD_C1_TEST_REPORT.json`

Then stop C1 work.

## Exactly one next gate

**PD-POOL-C2 · explicit manually reviewed source manifest.**

Start a fresh branch from the then-current `main`. Before download, select a small bounded set of exact provider object IDs / source pages by inspecting the actual source object and rights page. It is acceptable to reuse individual C1 source IDs only after that explicit review, but do not stack C2 on PR #281 and do not reuse C1's broad semantic-search acceptance as proof. Feed only the reviewed manifest into the existing hardened `tools/public_domain/fetch_pool.py`.
