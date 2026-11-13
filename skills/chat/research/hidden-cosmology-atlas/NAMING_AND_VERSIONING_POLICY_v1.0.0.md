# KFB Editorial Research — Naming and Versioning Policy

**Policy version:** 1.0.0
**Date adopted:** 2026-10-13
**Status:** CURRENT BINDING NAMING CONTRACT
**Owner:** Existing KFB Hidden Cosmology Atlas Editorial Research — `georg-doc/kayfabizarro`, research branch `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394
**Language:** All project artifacts, file metadata, prompts and public-facing KFB text in English; direct user chat in German only.

## 1. Stable purpose-based names, not promotional maturity labels

**Do not use new artifact names, filenames, links, headings used as product identifiers or approval states containing unearned finality/quality labels** such as:

- `golden` or `golden-test` (unless referring verbatim to a historical file, title, or test framework name)
- `final`, `ultimate`, `perfect`, `complete`, `definitive`, `master-final`
- `latest`, `new`, `best`, `fixed`, `vFinal2` or undated `current` as an identity
- `SSOT` as a replacement for explicit **editorial ownership** and source-of-record responsibility.

For tests, use neutral `evaluation`, `acceptance-test`, `fixture` or `validation` naming. A test is accepted only through a recorded result, not because its file was named as accepted.

**Do not rename historical files in place solely to remove these words.** Keep their paths as immutable recovery anchors and use a clear supersession alias/index for forward work. Avoid broken GitHub Issues, Site mirrors, NotebookLM source links or reviewer cross-references. When a migration is expressly approved, create a path mapping, update consumers and verify exact links before retiring prior paths.

## 2. Two naming patterns, two distinct version identities

**A. Stable URL/source IDs (content that NotebookLM or KFB references):**
- `authors/kurt-metzger.md`
- `authors/william-bramley.md`
- `authors/catherine-austin-fitts.md`

A stable file path is an **identity**, not a claim that all content is finished. Keep an explicit in-document `content_version: 0.1.0`, `review_status: seed`, `source_coverage: pending` and the Git commit SHA as the immutable byte-level revision. GitHub `blob/<branch>/...` URLs move with branch HEAD; pinned commit URLs denote frozen snapshots, not syncable living sources.

**B. Versioned research contracts, protocols, comparison datasets or exports:**
- `NAMING_AND_VERSIONING_POLICY_v1.0.0.md`
- `NOTEBOOKLM_WORLDVIEW_RESEARCH_PROMPT_v1.0.0.md`
- `WILLIAM_BRAMLEY_SOURCE_REGISTER_v0.1.0.md` (only if a separate source register is useful)
- `WORLDVIEW_COMPARISON_v0.1.0_2026-10-13.md`

Use **`vMAJOR.MINOR.PATCH`**, optional ISO `YYYY-MM-DD` when the artifact is an immutable dated export/receipt. Semantic intention: MAJOR = breaking source/schema/contract change; MINOR = additive backward-compatible content or new author coverage; PATCH = correction/formatting/source-link repair with unchanged scope. The actual Git commit is the authoritative immutable revision, never inferred from the text version number.

**C. GitHub Issues:** `RQ-001`, `RQ-011` etc. are stable question IDs; actual GitHub Issues own task status and receipts. Markdown agenda checkboxes are not a competing execution database.

## 3. Explicit, independently testable status metadata

Use neutral controlled status terms appropriate to each layer, without turning research findings into ideological reliability grades:

- **Content maturity:** `seed`, `source_intake`, `source_mapped`, `editor_reviewed`, `consumer_tested`.
- **Citation/source coverage:** `no_primary_passages_yet`, `partial_source_anchors`, `source_passages_attached`.
- **Implementation:** `proposal`, `implemented`, `tested`, `accepted`, `deferred`.
- **NotebookLM source behavior:** `web_import_untested`, `web_import_verified`, `same_source_refresh_verified`, `manual_reimport_required`, `web_import_failed`.
- **Source-native certainty:** never replace an author's expressed confidence/doubt with an outsider verdict. A source-coverage field is a **retrieval receipt**, not a truth rating.

Do not claim `tested`, `source_mapped` or `accepted` until the actual artifact revision, input corpus and observed evidence are linked.

## 4. File and version transitions

1. Read the current repository protocols, living source and Return; discover the **actual current target path**.
2. Choose the existing owner/branch/PR and exactly one bounded outcome. Reuse author/source and code donors.
3. For a new source, append an author record with bibliographic identifiers and a factual source-intake status; do not fill missing cosmological chapters with invented quotes.
4. Every actual GitHub write is followed by a read of the exact branch head and intended file blob. A timeout/block means UNKNOWN until the ref/file is inspected.
5. Versioned named contracts can supersede previous versions; mark the prior version in its header/index and preserve its original content.
6. Persist coherent implementation/source-validation/Return checkpoints in GitHub and existing KFB Production Control Site; do not update the KFB Hub/router for routine research roster growth.
7. If a research document will become a NotebookLM source, **do not assume static Web URL import automatically refreshes**. Verify a current branch URL import and an observed post-commit source update, or specify an explicit reimport/Drive mirror fallback.
8. The book/author may have editions with their **own** dates and ISBNs; do not conflate an edition year with dossier version or make a publication year part of an author identity.

## 5. Historical exceptions and examples

The existing `KFB Worldview Dossier: Golden Test 01`, `GOLDEN_TEST_01_DOSSIER_AND_GIZA_GENIUS_LOCI_REVIEW_2026-10-13.md`, and older named execution gate `GITHUB_MARKDOWN_NOTEBOOKLM_URL_GOLDEN_R1` remain **historical identifiers only**, not conventions for future files. Refer to the next test descriptively as **`NOTEBOOKLM_GITHUB_SOURCE_REFRESH_TEST_v1.0.0`**, retaining historical gate names only where required to resume previous work.

**One next gate:** `NOTEBOOKLM_GITHUB_SOURCE_REFRESH_TEST_v1.0.0` — test the existing stable GitHub author Markdown URL inside NotebookLM for import content and same-source update behavior; do not infer the result from the URL or a file name.
