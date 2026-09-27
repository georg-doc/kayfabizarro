# RETURN · PD-POOL-F1 · 2026-09-27

Status: **PASS · ISOLATED AIC TRANSPORT PROVEN · HANDOFF COMPLETE**

## Exact slice

- repository: `georg-doc/kayfabizarro`
- owner: **Asset Librarian / Billboard Media**
- branch: `chatgpt-web/public-domain-pool-f1-aic-2026-09-27`
- Draft PR: **#240**
- base main: `6fb02674ea4344169778c0ae9e76b2543f1d78f9`
- source compiling commit: `154e573b8defacd17e836de049b3853578291f94`
- frozen predecessor recovery: Draft PR **#239** / head `9237cbd6cbf0b72a16caffe02386924731af6d5d`
- tested implementation head: `c4f25c156e611a2fac7063becaf4fed3e3769638`
- GitHub Actions run/job: `36285175091` / `108524466091`
- Stage: **NONE · NOT APPLICABLE**
- Live promotion: **NO**

The exact final handoff head is the PR #240 branch head containing this Return; verify the branch ref rather than inferring it from the tested implementation head.

## Actual result

PD-POOL-F1 passes its one allowed gate.

AIC artwork `24645`:
- API HTTP: **200**;
- `is_public_domain=true`: **PASS**;
- image id present: **PASS**;
- exactly one `/full/843,/0/default.jpg` request: **HTTP 200**;
- payload: **238,585 bytes**;
- SHA-256: `e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56`.

The proof remained ephemeral. No AIC image or license sidecar was committed.

## Slice changes from the compiling source

- `tools/public_domain/fetch_pool.py` — AIC-specific request handling and HTTP evidence;
- `tools/public_domain/pd-f1-aic-manifest.jsonl` — one-object probe only;
- `.github/workflows/public-domain-pool-f1-aic.yml` — isolated runner;
- `skills/chat/workflows/PD_POOL_F1_AIC_2026-09-27/SOURCE.json`;
- `skills/chat/workflows/PD_POOL_F1_AIC_2026-09-27/TEST_REPORT.md`;
- `skills/chat/workflows/PD_POOL_F1_AIC_2026-09-27/RETURN.md`;
- `skills/chat/START_HERE.md` — current router status;
- `skills/chat/CHANGELOG.md` — additive evidence entry.

The branch also inherits the bounded PD-POOL-01 harness files from the required compiling source commit; it does not claim they passed in this slice.

## Retained boundaries

- Met, Wikimedia Commons and Internet Archive code paths were not retuned or rerun.
- The frozen PR #239 implementation was not resumed.
- No four-source persistence or idempotence claim is made by F1.
- No Asset Librarian registration occurred.
- No original historical selected-hit manifest was reconstructed.
- No bulk import occurred.
- No Stage/public browser gate is required for this nonvisual transport proof.

## Exactly one next gate

**PD-POOL-R1 · resume the original four-source smoke + second-run idempotence/stale-partial persistence gate using the F1-proven AIC transport path.**

Only if that 4/4 gate passes may the four bounded smoke assets be persisted to `media/public_domain/`. Bulk population remains a later gate and still requires the original selected-hit manifest or an explicitly new curated discovery round.
