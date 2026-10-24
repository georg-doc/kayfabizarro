# KFB Research Atlas · Wiki/Graph Concept and Research Contract R1
Date: 2026-10-24. Status: **PROPOSAL, RESEARCH-ONLY, NO NEW RUNTIME/WIKI SITE**.
Authoring owner: the existing KFB editorial/research lane. Current pilot is MKUltra / Project Monarch / Desmet / Guantánamo, Draft PR #408 on `research/kfb-mkultra-monarch-cardway-r1-2026-10-16`.
This is a **portable method and an index specification**, **not a second KFB meta canon**. The existing `skills/chat/meta/KFB_META_COMPENDIUM_v1.md` is the conceptual routing index, `skills/chat/meta/CANON_HOME_MAP.json` remains its authority-location map, and current card/iceberg/game owners remain untouched. Plugin package is a RESEARCH INTERFACE, not a new backend or corpus.

## North Star
A linked research wiki / atlas for original source documents, epistemically scoped claims, cultural and political histories, institutions, methods, theories, intellectual genealogies and creative cross-connections. Each investigation adds durable sources + carefully typed relationships. Research remains useful outside KFB. A later optional KFB card/Almanac/Triplet export is a **separate accepted editorial consumer**, not mandatory output.

The intellectual inspiration has two **different** roles:
- **Aby Warburg, law of the good neighbor / Mnemosyne:** use surprising visual/thematic neighbors to generate testable new questions, not to claim causality, institutional lineage or endorsement. Neighbors can be close, remote, contrary, or unresolved, but their rationale is documented.
- **Markus Gabriel, fields of sense:** allow a single historically stable referent (document/event/practice) to appear in distinct legal, clinical, aesthetic, organizational, media and ethical contexts without treating all these contexts as merely subjective opinion. This is a *design analogy*, not a claim to implement Gabriel's complete ontology. Fields remain extensible, not one rigid taxonomy or a claim of the totality of all knowledge.

## Architecture, deliberately small
**Layer A: GitHub original owners.** Keep existing project/topic sources and Returns in their existing directory/branch. Exact repo/branch/PR/head is the only write authority. Never move/duplicate a full master to create a wiki.
**Layer B: Read-only Atlas discovery index.** A small JSON/Markdown index stores stable references to owner files and latest *verified* research checkpoint; it does not duplicate all source text. Proposed `skills/chat/research/KFB_RESEARCH_ATLAS_INDEX_R1_2026-10-24.json`. Branch-local pilot, not automatically promoted to main.
**Layer C: Topic-slice dossier.** Reuse existing R1/R2 conventions (BRIEF, SOURCE_LEDGER, phased reports, optional CARDWAY_IDEAS, TEST_REPORT, RETURN). For new topics, minimal equivalent is `BRIEF.md`, `SOURCES_AND_CLAIMS.md`, `RELATIONS.md`, `RETURN.md`; any JSON graph record is optional until useful.
**Layer D: Plugin interface.** Private `kfb-deep-research` acts as research/router/source critic and invokes available GitHub/Web/Drive tools through the user's connected permissions. It has no private always-running agent, own search API, sync daemon or auto-write magic.
**Layer E: Downstream KFB editorial proposals.** Only after user authorization does an accepted cluster feed existing Card/Almanac/Iceberg/Triplets owners, with source IDs, creative interpretation separate, no invented historical claim. No new game runtime or second data owner.

## Seven source-aware record kinds
- **Source:** original exact URL/DOI/archive ID, edition, publisher/release versus event date, author/speaker, access level, file hash where possible, real pages/timecodes, date checked, original-scanned/text/OCR/summary status.
- **Claim:** narrow falsifiable or interpretable proposition, asserted-by, sourced-to direct passage, original language, category (archival-fact | document-reports | testimony | hypothesis | interpretation | disputed | artistic), open counter evidence, status of corroboration.
- **Event:** when/where/who/what, date precision, contemporaneous document links versus reconstructed chronology.
- **Actor/Institution/Practice:** stable identifiers and aliases, roles over time, decisions and responsibility only if sourced.
- **Concept/Field:** explicit definition, intellectual tradition, scope, distinct empirical/mechanism vs philosophical/metaphorical use, applicability/limitations.
- **Relation:** typed directional (or symmetric) edge with why it exists, support, confidence about **edge** only (not truth score of people/ideas), contrary sources and next falsifier.
- **Creative proposal:** optional KFB downstream candidate with links to researched propositions and clear fiction/satire separation.

## Relation types and guards
| Edge | Meaning | Required evidence |
| --- | --- | --- |
| `CITES` / `ATTRIBUTES_TO` | Document quotes/reports another | exact citation / page |
| `DOCUMENTS` / `AUTHORIZES` / `FUNDS` | source-grounded historical or organizational link | contemporaneous file, named witness with attribution, or official record |
| `PRECEDES` / `CO_OCCURS` | temporal correspondence | dated evidence; no automatic causality |
| `CORROBORATES` / `CONTRADICTS` | evidence relation between propositions | explicit competing passages and scope |
| `PARTICIPATES_IN` / `SAME_INSTITUTION` | personnel/organizational linkage | records, capacity and timeframe |
| `MECHANISM_SIMILARITY` | shared technique across cases | define common features; **not** a direct institutional inheritance |
| `CONCEPTUAL_ANALOGY` | parallel mechanisms/ideas | interpretive rationale with non-causal tag |
| `WARBURG_NEIGHBOR` | surprising source/concept juxtaposition | short reason + possible question/falsifier; **non-causal by default** |
| `APPEARS_IN_FIELD` | one entity considered within a specific Sinnfeld | field description and relevant criteria; not a claim of subjective reality |
| `OPEN_HYPOTHESIS` | a candidate connection not proved | both anchors, missing evidence, explicit open test |
| `INSPIRES_KFB` | research-to-creative handoff | user-approved editorial owner, attribution in final artifact |

Do **not** infer `FUNDS`, `DIRECT_SUCCESSOR`, `CAUSES` from similar terminology, a shared city, a chronology, an unreferenced NGO opinion, archives lost in 1973 or an attractive Warburg neighbor.

## Claim-status two axes
Separate **source custody** (ORIGINAL_IMAGE_SEEN | PRIMARY_TEXT_READ | EDITION_REPRODUCTION | OFFICIAL_RETROSPECTIVE | TESTIMONY | SECONDARY | URL_ONLY | UNAVAILABLE) from **epistemic status** (SUPPORTED_AS_REPORTED | INDEPENDENTLY_CORROBORATED | CONTESTED | INFERENCE | HYPOTHESIS | NOT_YET_CHECKED). A government primary source can contain a false, overstated or contested claim; "original" describes provenance, not truth.

## Relation example from real pilot, without duplicating its underlying files
- Original `MKULTRA` clinical experiments and 1950s CIA documents: documented historical program.
- `MKDELTA` operative use: documented distinct CIA codeword, 1963 IG report.
- `Project Monarch`: autobiographical/alleged successor, uncorroborated in currently read documents.
- `SERE → Guantánamo 2002`: documented training and policy transfer.
- `MKULTRA ⇄ Guantánamo`: valid `MECHANISM_SIMILARITY` for coercive psychological practices, **NOT** verified `DIRECT_SUCCESSOR`.
- `Desmet Mass Formation ⇄ Asch / social identity`: theories/empirical neighbors for comparative conceptual investigation, not one total explanation.
- `CIA OMS May 2005 memo ⇄ PHR 2010 report`: documented original→later ethical interpretation, with precise distinction between observations and a claim of experimentation.
- `Sinnfeld: clinical ethics`, `Sinnfeld: law`, `Sinnfeld: media` may each interpret the same `OMS memo` without copying or altering the source.

## Research life cycle per future chat
1. Determine **exact topic and one testable research question**. Read GitHub workflow and existing research index/owner before searching. Never ask for known answers.
2. Recover previously curated source IDs, claims, relations, incomplete readings, recency and last verified head. Use archive search before writing a new dossier or card.
3. Find primary documents: CIA/NSA/FOIA, government archives, original manuscripts/books, recordings; then scholarly/critical and competing interpretations. For PDFs, visually inspect the relevant original page, and record PDF page index separately from printed page. Full scans may be partial or unavailable.
4. Produce a claim/evidence matrix. If a witness says they found documents, find those **documents** before calling the witness's interpretation corroborated. Missing documentation is an archival gap, not positive proof.
5. Write a **causal/temporal map** and a **Warburg-neighborhood panel** separately. Limit initial edges to a few high-value supported connections and surprising but explicit hypotheses. Track proposed Sinnfelder with criteria.
6. Search existing author/card/atlas records for ID collisions and overlap. Link/reuse, don't duplicate. No arbitrary new runtime/tool/indexer.
7. Persist a coherent research checkpoint on the **named branch**; after every write read back branch HEAD and target content. Use incremental sources/evidence/Return/changelog/router; do not convert an access error into a successful read.
8. Return a compact ordinary-language account, exact links/source IDs, verified commit/PR, real inspection/test counts, unresolved gaps, **one next gate**. Research does not need a Cloudflare Stage.
9. Share a **separate portable Research Prompt** for Perplexity/NotebookLM/another LLM when native source access is impossible. Do not claim that external research or NotebookLM sync was executed without proof.

## Acceptance criteria of a topic slice
- New value, not generic re-summary; each novel historical claim cites the strongest available exact source.
- At least one counter-reading or evidence gap on a contested claim, with fair scope.
- Source identities and original-vs-summary classification explicit.
- Relations typed: causal/historical ≠ analogy/Warburg neighborhood.
- No deleted or silently overwritten prior source IDs or human creative decisions.
- Main writer GitHub after each write verified; timeout → UNKNOWN; PR Draft; user controls merge, publishing and any accepted creative branch.
- Human access remains via GitHub source/PR for research; any later public interactive Wiki must be a separately authorized KFB Stage / Site product with real visible proof.

## References (method, not authority substitution)
Warburg association/visual knowledge system: https://www.tandfonline.com/doi/full/10.1080/01973762.2026.2705660
Gabriel, *Fields of Sense* (2015): https://www.degruyterbrill.com/document/doi/10.1515/9780748692903/html and https://ndpr.nd.edu/reviews/fields-of-sense-a-new-realist-ontology/
KFB meta index: `skills/chat/meta/KFB_META_COMPENDIUM_v1.md`.
