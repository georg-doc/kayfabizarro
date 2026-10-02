# START HERE · PD-POOL historical manifest recovery · 2026-09-27

Status: **RECOVERY ACTIVE · READ-ONLY DISCOVERY FIRST · NO BULK IMPORT**

Owner: **Asset Librarian / Billboard Media**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/public-domain-manifest-recovery-2026-09-27`  
Base main at recovery start: `154f9e9e2c13d22929996d3c47288c55a7d8e55c`

## Recovery target

Recover the **original historical selected-hit manifest / selection UI export** behind the previously reported result counts:

- **84 free**
- **6 attribution**
- **40 rejected**

The purpose is historical source recovery, not reconstruction from memory and not a new search disguised as the old result set.

## Current proven state

PD-POOL-R1 → R3 is already closed and must not be reopened:

- integrated production commit: `b133e66c4f8cc191501da504ebeceea67c6b4317`;
- permanent Asset Librarian: `https://kayfabizarro.pages.dev/asset-librarian/`;
- Live Registry bot: `85776f806cec78dae4e8f8b6dce3ccd755490155`;
- exactly four bounded smoke assets are live and provenance-verified.

The intake ZIP previously inspected at:

`tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip`

contained only:
1. `media/public_domain/README.md`
2. `tools/public_domain/fetch_pool.py`

It did **not** contain the historical selection UI or exported selection manifest.

## Recovery sources · search order

### A. Dropbox · read-only
Search filenames and file contents for combinations of:

- `public domain`
- `public_domain`
- `silent film`
- `84 free`
- `84 frei`
- `6 attribution`
- `40 rejected`
- `pool manifest`
- `pool-manifest`
- `selection manifest`
- `selected hits`
- `Claude Design`
- likely exports/archives: `.zip`, `.json`, `.jsonl`, `.csv`, `.html`, `.md`

Do not modify, move or delete Dropbox content during recovery.

### B. GitHub · read-only
Search current/default branch, historical branches/PRs and commits for the same phrases plus likely paths:

- `media/public_domain`
- `tools/public_domain`
- `pool-manifest.jsonl`
- `selection`
- `84`
- `fallback-attribution`
- `reject`

Inspect source files before accepting a hit. A count mention alone is not the original manifest.

### C. Candidate validation
A file counts as a **manifest recovery candidate** only if it contains object-level rows/cards/items sufficient to reconstruct the historical selections, ideally including provider/source identity and disposition.

Required classification:
- `RECOVERED_ORIGINAL`
- `PARTIAL_ORIGINAL`
- `DERIVED_REFERENCE_ONLY`
- `UNRELATED`

Do not call a newly generated search result `RECOVERED_ORIGINAL`.

## Expected original evidence

The strongest candidate should explain or contain all three historical dispositions:

- free = 84;
- attribution = 6;
- rejected = 40;

and should contain **130 object-level decisions total** if the counts refer to mutually exclusive selected/search-result rows.

Do not assume 130 rows until verified from the actual recovered source.

## Timeout / fresh-chat recovery protocol

If this chat times out or stops unexpectedly:

1. Open current GitHub `main` and this branch.
2. Read:
   - `skills/chat/START_HERE.md`
   - `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
   - `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
   - `skills/chat/workflows/PD_POOL_R3_CLOSEOUT_2026-09-27/RETURN.md`
   - **this file**
3. Treat GitHub state as authoritative.
4. Inspect the branch ref before retrying any write.
5. Continue only from the last verified item in `RECOVERY_LOG.md` if it exists.
6. Search Dropbox/GitHub read-only before creating or copying any recovered artifact.
7. Never restart R1/R2/R3 and never run bulk import from an unverified candidate.
8. A timeout means `UNKNOWN`, not success.

## Persist-before-reply rule

After any meaningful recovery finding:
1. write/update recovery evidence on this branch;
2. fetch the exact branch head + written file;
3. only then send a concise chat update.

## Current next action

**Search Dropbox first for the historical manifest/UI/export, then cross-check GitHub history for corroborating copies or references.**
