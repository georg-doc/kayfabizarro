# Data Corrections and Fail-Closed Decisions

No source PDF or source JSON was edited.

## Path normalization

Two manifest paths use ASCII apostrophes while the tracked filenames use smart apostrophes. The adapter records and resolves these exact, deterministic equivalents:

- `geopolitical_thrillers_conspiracy_theories`
- `platos_dungeon_raid_hero_set_01`

Both corrections remain visible in `registry/assets/v1/decks/qa-report.json`.

## Schema normalization

Observed source card schemas are projected without rewriting the source:

- canonical `cardNumber/cardName`;
- `num/name`;
- name-only cards with stable source-position numbering;
- empty card arrays.

## Mapping policy

Measured PDF pages are authoritative. A mapping is verified only when the PDF/card geometry supports a defensible zero- or one-page cover offset. All other cases remain searchable and page-viewable, but exact card crops and card references are disabled.

The current QA report records 28 index/PDF page-count mismatches and 23 unverified mappings. The full 130-deck table is in `DECK_PDF_TRUTH_TABLE.md`.
