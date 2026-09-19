# TEST REPORT · C0-A1 Charming Kitchen Failure Recovery

**Final status:** `FAIL · BROWSER GATE · ARCHIVED_FAILED_CANDIDATE`

## Source/static evidence

Repository-native static module-kit test step reported PASS on final workflow run.

Test file contains **7** explicit unittest cases covering:

1. 118/118 unique classifications and lane counts;
2. source/dependency existence;
3. sample recipe references;
4. CC0 + GDS boundary;
5. no copied source binaries;
6. Librarian/Stage wiring;
7. GDS catalog package entry.

## Browser evidence

### Diagnostic run

- run: `35461123803`
- head: `46415c979bf2ef3be1f24508304aab917c73866b`
- artifact: `10589419759`
- browser checks reached: **0**
- error: Chromium module parse failure
- CDP: `app.js` line 6 / col 60

### Final repair run

- run: `35461231731`
- head: `a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`
- artifact: `10589564787`
- browser checks reached: **0**
- error: Chromium module parse failure
- CDP: `app.js` line 174 / col 96
- proven source defect: single-quoted `copyHandoff` string split by real line break

## Browser sample status

- wall-grammar: **NOT RUN**
- worktop-run: **NOT RUN**
- furnished-cell: **NOT RUN**
- alias `Küche`: **NOT RUN**
- GDS direct package preview: **NOT RUN**
- Stage redirect: **NOT RUN**

## Syntax-step discrepancy

The workflow reports the separate Node `--check` step as success even though Chromium identifies invalid source in the checked `app.js`.

Status: `UNKNOWN · TEST-HARNESS GAP`.

Do not count the Node step as a browser parser PASS.

## GDS evidence

- metadata candidate created;
- CC0 source pinned;
- `game-dev` CLI unavailable;
- package build receipt: **NOT RUN**;
- package verify receipt: **NOT RUN**;
- vendor admission: **NOT RUN**.

## Public deployment

**NOT PERFORMED / NOT VERIFIED.**

## Georg acceptance

**NOT RUN** — no reviewable browser candidate existed.
