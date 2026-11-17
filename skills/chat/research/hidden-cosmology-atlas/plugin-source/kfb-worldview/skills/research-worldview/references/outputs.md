# Source-first, project-neutral output contract v0.1.0

## Coverage report

- `subject_id`, `source_role` (author / host / guest / work / interviewer / publisher)
- `project`, `repo`, `branch`, `SSOT`, `checked_revision`
- `GITHUB_SOURCES` (exact paths and source IDs actually read)
- `GOOGLE_DRIVE_DOCS` (exact title and scoped citations actually read; private file IDs stay private)
- `NOTEBOOKLM_SOURCES`: observed source IDs if genuinely accessible, else `NOTEBOOKLM_INVENTORY_UNVERIFIED`
- `ALREADY_COVERED`: precise passages and their support
- `PARTIALLY_COVERED`: source IDs, which causal links or date ranges remain open
- `NEEDS_NEW_SOURCES`: ranked small unanswered questions
- `LAST_PUBLICATION_CHECK`: actual source date or `UNKNOWN`
- `NEXT_GATE`: single bounded check

## A targeted deep-dive prompt

```text
Research scope: <one author/source and unanswered question>
Existing reviewed coverage: <source IDs and passages already adequate; do not repeat>
Known research boundaries: <speaker attribution, edition/date, canonical source identifiers>
Missing: <specific chain, original words, exact reference, newest work since actual date>
Find: <original author texts/podcasts/videos/published revisions, source-specific details>
Output: source title, speaker, date, original URL, page/timecode, faithful passage, author's own expressed qualification, explicit source-to-source relations, searched-but-not-found and next question.
No generic baseline biography; no duplicate claims; do not interpolate a causal link or add a fictional performance layer.
```

## Patch handoff

1. `INPUT_RECEIPTS`: actual source and version inspected.
2. `SOURCE_DELTA`: new original source records only.
3. `REVIEWABLE_PATCH`: additive exact current author file/section; existing content preserved.
4. `TARGET`: existing repo, branch/PR/path or user-specified external system; private provider tokens omitted from public output.
5. `VERIFY`: expected readback and acceptance, then phase-boundary checkpoint and Return.
6. `NOTEBOOKLM_STATUS`: direct observed import/sync receipt or `UNVERIFIED`.
7. `NEXT_GATE`: one concrete next source or ingestion check.
