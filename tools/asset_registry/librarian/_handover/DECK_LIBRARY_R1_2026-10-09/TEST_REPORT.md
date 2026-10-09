# Test Report · Deck Library R1

Executed on 2026-10-09 against base `909828efa85a2f85584cb47d6a7cee3fd37989bd`.

## Passing

- Python test suite: **57/57 PASS**
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
