# Test Report · Deck Library R1

## Follow-up · 2026-10-10

- Rendered page 2 of Ignore Dystopia, Protopia, Observation Underground, Pharaoh Script, AI Kayfabe and Anti-Rules from the tracked PDFs.
- Confirmed a real 2x2 card grid whose artwork and page-level headings cross the exact centre seam.
- Replaced the destructive 50/50 card-preview cut with a tested 3.5% horizontal seam overlap.
- `deck-card-crop-smoke.mjs`: **PASS** for all four quadrants and the 70 px centre overlap at a 1000 px source width.
- Python suite: **58/58 PASS**.
- Wrangler 4.149.0 dry-run: **PASS**; `.assetsignore` is applied and the sparse acceptance checkout contains 5,497 upload candidates.
- The authenticated Pages log proved that Pages skipped the Workers-style configuration because `pages_build_output_dir` was absent, then rejected the repository root for exceeding 20,000 files.
- The repair now builds a deterministic `.cloudflare-pages/` public projection and declares it with the Pages-native Wrangler key.
- Full tracked-tree calculation: 25,137 tracked files; the bulk library exclusions remove another 18,720 tracked source assets and bring the deployable upper bound below **6,000** files.
- Source guards: no changes under `media/kfb/` or `tools/KFB-ToolBox/_inbox/`.

Executed on 2026-10-09 against base `909828efa85a2f85584cb47d6a7cee3fd37989bd`.

## Passing

- Python test suite: **58/58 PASS**
- JavaScript syntax checks: **PASS**
- deterministic deck generation: **PASS**, identical hashes after regeneration
- source guard: **PASS**, no diff under `media/kfb/`
- inbox guard: **PASS**, no diff under `tools/KFB-ToolBox/_inbox/`
- whitespace/error check: **PASS**
- Chromium Librarian acceptance: **PASS**
  - 130 decks / 6,985 cards
  - Mission Control detail opens PDF page 1/15
  - candidate assignment and exact viewer link present
  - zero console errors
- Chromium Viewer acceptance: **PASS**
  - 130 comics / 1,915 measured PDF pages / 6,985 cards
  - `?deck=frizzlebob_s_mission_control&card=56` resolves to page 15
  - zero console errors
- responsive Viewer check at 375 px: **PASS**

## Evidence sample

The two JPEG contact sheets render 14 real source decks. They cover Three Futures, Mission Control, both non-canonical source schemas, safe crop mappings, and unsafe mappings shown as full pages.

## Known non-pass

`validate.py --repo-root . --out registry/assets/v1` cannot complete in this sparse checkout because the pre-existing generated `registry/assets/v1/private-projection.jsonl` is absent. This is not presented as a passing validator result.
