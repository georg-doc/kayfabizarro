# NB02 — Normalized NotebookLM table return

Date: 2026-11-01. Owner: Hidden Cosmology Atlas. Additive intake after NB01.

All 745 returned rows were structurally normalized: 180 SOURCE, 352 CLAIM, 163 RELATION and 50 COVERAGE records. The separate exported source inventory contains 99 numbered items; 69 have deterministic normalized-title matches to a SOURCE row. The other 30 remain candidate/no-exact-title matches, not proof that their content is absent. Fifty extraction groups are delimited by COVERAGE rows; these are not fifty notebooks. All original fields and sheet row numbers are retained in the block JSON files. Unique NB02 row IDs supersede colliding local IDs only for import routing.

This is structural cleanup, not a factual certification of 352 claims. Original author assertions, including unconventional models, remain intact. The separate review fields distinguish attribution from truth, source-index numbers from exact passage locators, and generated relationships from verified historical edges. All 163 relationship rows are retained; zero are automatically admitted as historical edges. The original Google Sheet was not edited.

Nine reference tokens remain unresolved/ambiguous. The export omits S001 in one block, while a later block duplicates S001 for two medical documents. No cross-block identity was guessed. Source reference ranges must be interpreted within their block; raw source strings remain available for inspection. Source/title, employment-type and speaker-identity defects are visible rather than silently corrected. Dates stay raw where exact semantics are uncertain.

## NB01 reconciliation

All nine NB01 aliases map at title level to the new inventory. Five previously received visual derivatives remain NB01 assets. The Jiang entry NB02-R0264/N023 matches existing JP-S01: original YouTube URL, author identity and 2026-01-22 publication date are additive NB01 evidence, not metadata recovered by NotebookLM. Compound claim NB02-R0267 partially overlaps JP-C01/02; NB02-R0274 overlaps JP-C04 thematically. Two other lecture claims require original-passage checks. The source-only packet preserves the historical author-intake contract; downstream WS0 interpretation is separate.

## Files

- blocks/: complete 745-row normalized return, with original fields, scoped references and review flags.
- source-inventory.json: 99 numbered titles and deterministic matches/candidates.
- nb01-reconciliation.json: prior-to-current ID mapping and bounded Jiang enrichment.
- unresolved-references.json: nine unresolved tokens.
- audit.json: counts and snapshot checksum.

The full normalized CSV/JSON are available on the private Atlas projection; public GitHub preserves the same records in bounded blocks. Private Google file identifiers and local paths are omitted. No originals are newly verified just because an export names them.

Next gate: Georg reviews the three WS0 pilot entries; unresolved original-source locators remain queued, with no mass research or deck production.
