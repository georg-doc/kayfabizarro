> **HISTORICAL EDITABLE-AUTHORING TOPOLOGY — SUPERSEDED 2026-10-13.** Georg selected GitHub Markdown author files as the working research master to avoid repetitive Google Docs edits/copies. See [GitHub Markdown → NotebookLM Source Workflow R1](GITHUB_MARKDOWN_NOTEBOOKLM_SOURCE_WORKFLOW_R1_2026-10-13.md) and [authors/README](authors/README.md). The description of actual Google Docs and their native tabs remains valuable donor evidence; the direction to update Google Docs as the sole mutable author master is **not** current. The proposed NotebookLM dynamic GitHub web-URL refresh is not yet proven.

---

# KFB Worldview Research — Multi-Doc Author Network Workflow R2

**Date:** 2026-10-13  
**Status:** USER-APPROVED WORKFLOW DIRECTION · VERIFIED FOUR GOOGLE DOCS · DESIGN/RECOVERY ONLY  
**Owner:** Existing KFB Editorial Research, `georg-doc/kayfabizarro`, `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394.  
**Supersedes as current author-document topology:** `GOOGLE_DOCS_NOTEBOOKLM_WORLDVIEW_SYNC_WORKFLOW_R1_2026-10-13.md`, preserved as historical rationale.  
**Language:** ALL project artifacts, source descriptions, metadata, prompts, scripts, reports and KFB content in English; direct ChatGPT conversation in German.  
**No claims:** This document neither changes a Google Doc, performs a NotebookLM sync, vectors an author corpus, builds a Site, integrates a game runtime nor publishes a Stage.

## 1. Architecture decision: one editable author master per researcher

**Old direction:** one large Google Doc with a separate native tab per author.  
**Current direction:** **one dedicated Google Doc per author**, with multiple *native* tabs for facets of that author's own worldview and a separate, read-only/derived comparison or Golden Test document when needed.

**Owners and authority boundaries:**
- **Original interviews, lectures and publications:** the source author's expressed worldview and its original textual/audio evidence; no model-generated synopsis may replace the original.
- **Per-author Google Doc:** human/Gemini-editable **author dossier master**; one authoritative document identity per real author, with its own revision history, tabs, provenance, source bibliography and source-native uncertainty.
- **NotebookLM:** read/research consumer of intentionally selected Google Drive **author-doc sources**, plus original primary sources. Notebooks may assemble different author combinations by cluster. A multi-tab Doc is one NotebookLM source: selecting an author selects all that Doc's tabs rather than independently selecting sub-tabs. An observed notebook import and changed-passage refresh are required before claiming a successful sync.
- **KFB GitHub Editorial Research SSOT:** workflow decisions, source references, safe author-doc catalog, typed relationship schema, evidence and versioned export/Return. The GitHub research folder is **not** a second mutable Google Docs author-master. An exported dossier snapshot is an explicitly named derivative, not a hidden override of the Google Doc.
- **Authenticated KFB Production Control Site/Inbox:** durable private workflow records/mirrors, exact connector IDs/revisions where needed for recovery. It is NOT an implemented GPT performance workbench.
- **Later KFB GPT performance Site:** source-derived Lens package in a fictional KFB Resident, Card or Landmark situation through existing ChatterBox/Resident/Card/Audio owners; proposed, not built.

**Scope:** Authors may span multiple notebooks and clusters. Never duplicate a full author document as an editable master just to use it in multiple notebooks. Use a registry reference and existing Google Drive source selection instead.

## 2. Exact observed connected Google Docs and what exists today

Read through the connected Google Drive provider on 2026-10-13, using exact document IDs from the user's supplied source mappings and explicit link. All four are accessible as native Google Docs. The exact URLs, complete file IDs and full provider revision tokens are maintained in **private** Production Control recovery for access-appropriate use, not replicated wholesale into a potentially public repository.

| Source role | Exact observed Google Docs title | Actual native tabs | Current contents | Corpus URL anchors inside dossier |
| --- | --- | --- | --- | --- |
| Author master: Daniel Liszt | `KFB Author Dossier: Daniel Liszt / Dark Journalist` | **1** (`Tab 1`) | ~4,128 text characters; internal text headings `Tab 1/2/3`; ontology, X-PROTECT/Atlantis, RDP and performance | **0** in document body |
| Author master: Catherine Austin Fitts | `KFB Author Dossier: Catherine Austin Fitts` | **1** (`Tab 1`) | ~2,787 text characters; internal text headings `Tab 1/2/3`; missing-money/finance worldview and stage adapter | **0** in document body |
| Author master: David Icke | `KFB Author Dossier: David Icke` | **1** (`Tab 1`) | ~3,334 text characters; internal text headings `Tab 1/2/3`; intercepted reality and consciousness worldview, performance adapter | **0** in document body |
| Historical comparison/fixture: Golden Test 01 | `KFB Worldview Dossier: Golden Test 01` | **1** (`Tab 1`) | ~4,454 text characters; **both** Kurt Metzger and Daniel Liszt in one comparison text; Clown instructions | **0** in document body |

**Important finding:** The strings **"Tab 1: Epistemic Core & Ontology", "Tab 2: Core Mechanics & Vocabulary", "Tab 3: Performance & Triplet Layer"** are merely paragraphs in the current author documents. They are **not** current separately addressable Google Docs native tabs. A future Gemini edit must explicitly create actual Google Docs tabs and move the corresponding contents without loss.

**Not established:** A standalone current **Kurt Metzger** author Doc has *not* been directly inspected, even though he appears in Golden Test 01; do not invent its document ID or claim it exists. The four observed docs contain derived worldview assertions but no original source links, timestamped citations or bibliography within their present text body. This is a **provenance-coverage gap**, not any external truth-rating of authors or subject matter.

**Privacy:** The provider reported these Google Docs as not shared (`shared=false` in file metadata) on this read. Keep new private document IDs and direct links in the authenticated recovery lane instead of publishing all identifiers into GitHub; publish only the meaningful safe titles, source role and validation state. The previously user-supplied Daniel Liszt link remains in the conversation and accessible through Drive.

## 3. Native tab proposal per author (do not mistake heading labels for tabs)

Preserve Gemini's existing ontology/mechanics/performance sections as the basis, while separating the primary evidence and semantic relations from the creative layer.

**Tab A — Epistemic Core & Ontology**
- `Fundamental Ontology & Cosmology`; human nature and history; agents/hierarchies/proxies; explanations of causes and effects in the author's own logic.
- Record actual source-native certainty, conditional reasoning, doubt, humor and change over time without external speculation or belief labels.

**Tab B — Core Mechanics & Vocabulary**
- Author-specific vocabulary, mechanisms, recurring explanatory chains, concepts, actors, texts, historical events and source-emphasized examples.
- Do not collapse `Hidden System of Finance`, `Breakaway Culture`, `Archontic Prison` and another author's adjacent term into one generic theory.

**Tab C — Source Ledger & Cross-Worldview Neighbors**
- References **in the ordinary document body**, not only Docs comments/footnotes (not imported to NotebookLM).
- Exact `sourceId`, episode/publication title, source URL, work date, speaker, original extract or faithful author paraphrase, page/timestamp, source-native expressed certainty if stated; concept/claim IDs.
- Links to another author's dossier or an original primary source with typed relations and both sides' source IDs. Source-claim records and their raw evidence must remain reconstructable.
- This tab contains both **documented direct citations** and separately authored **editorial cross-source comparisons**, with an explicit originator. This distinction is not an outsider truth ranking.

**Tab D — Rhetorical Signatures & KFB Performance / Triplets**
- Observable argument structure, rhetorical tempo and recurring framing **from sources** separately from editorially staged KFB comedy.
- Existing canonical KFB Clown/Resident identity drives speech and character behavior; author worldview acts as a selectable *lens*, not an impersonation or real-author avatar/voice.
- Stand-up/long monologue and player heckle are not forced into a Triplet; when desired, use the real KFB Triplets source-to-bridge grammar and preserve original semantic relations.
- Performance outputs link back to source/lens IDs and KFB Card `deckId + cardNumber`, with explicitly authored jokes/stage bridges not passed off as the researcher's own speech.

**Optional non-source sections:** a short cover/index and `Revision & Coverage Notes` inside Tab C, rather than creating many empty tabs. Start small, based on the currently existing 3-section author Docs. **Gemini is the current Google Docs authoring writer**; do not issue simultaneous destructive tab migration from ChatGPT while that editor is working.

## 4. Cluster membership / Warburg-style semantic neighborhood

**One author document can be selected into multiple NotebookLM notebooks.** Examples:
- `HIDDEN_COSMOLOGY_OCCULT`: ontology, mythic entities, consciousness, esotericism.
- `HISTORY_DEEP_STATE`: hidden history, breakaway structures, finance, intelligence and black budgets.
- `POP_CULTURE_MEDIA`: media and symbolic interpretation, public narratives, culture.
- `IMPROV_PERFORMANCE`: author-derived narrative mechanics and KFB performance adaptation.

These are **navigation clusters**, not exhaustive classifications, ideological ranking, separate belief authorities or exclusion gates.

For network connections use a lightweight, non-executable **typed graph** keyed to stable author and source IDs:
`authorId, conceptId, sourceId, claimId, relationType, targetAuthorId/targetConceptId, targetSourceId, originator, notes, reviewedRevision`.

Suggested `relationType` values:
- `DIRECT_CITATION` / `SHARED_ORIGINAL_SOURCE` / `DOCUMENTED_INTERVIEW` — source-anchored links.
- `CONCEPT_PARALLEL` / `EXPLANATORY_DIVERGENCE` / `FIELD_TRANSLATION` — explicitly named editorial comparisons.
- `KFB_CREATIVE_BRIDGE` — artistic transformation for KFB Cards and Residents.

In Warburg's good-neighbor spirit, a nearby concept may enrich, contrast or unsettle another author's explanation. In a Gabriel-inspired fields-of-sense reading, similar names may operate in different frameworks. Neither proximity nor graph similarity is evidence of an author actually making that connection. Link nodes must retain **who made the link**.

**Embeddings/vectorization are optional downstream retrieval indexes**, derived from explicitly segmented source passages and these typed concept/edge records. They are NOT a first-phase substitute for source IDs, author positions or a graph. Do not claim NotebookLM has created a user-accessible embedding API, global vector store or KFB live retrieval runtime. Prefer stable excerpt references and authored relationship edges first.

## 5. Conversion and revision/quality contract

1. **Freeze reference-only source pointers:** inspect exact original Doc identity, native tab count and current revision. Keep an authenticated private registry of Doc IDs and revision tokens, plus a public-safe author/title/status manifest.
2. **One authorized editor performs the tab conversion in place:** the existing three textual sections become 3–4 real native tabs **without silently discarding sentences, examples or viewpoint material**. Inactive legacy Golden Test remains a test fixture; it does not compete with author masters.
3. **Add in-body source anchors:** future Gemini research should append, rather than replace, the author's actual cited interviews/essays/passages to each authored premise. No external debunking labels or deletion. Preserve their own expressed certainty/uncertainty.
4. **Check exact Google Docs revision:** confirm native tab IDs/titles, section content and original count/checksums or source unit counts where possible. A renamed heading is not a successful tab conversion.
5. **NotebookLM notebook assembly:** deliberately import each **separate Google Doc** into target notebooks. Confirm the original Doc is imported as a distinct source. Verify an actual recently changed, unique passage after refresh, not merely existence of an import/source URL.
6. **Export a reviewed Lens package:** author core, mechanisms, terms, verified source pointer set and provenance, separately authored performance hints, per `authorId + docRevision + sourceClaimSetVersion + lensVersion`.
7. **KFB game/Deck/scene consumer later:** canonical Card context, actual 3D World/Genius Loci, existing fictional Resident/ChatterBox and optional Triplet/Almanac provenance. Do not introduce a second game, Card or dialogue engine.

**Acceptance at this phase:** separate Docs accessible; each one independent NotebookLM source if deliberately imported; real native tabs verified; in-body source citations recovered; no source material lost. Card/Resident dramatic QA occurs after author source fit. No need to build or publish a GPT Site to prove this research migration.

**Non-destructive recovery:** if conversion fails, leave untouched original contents and log the failed seam; after two non-improving repair loops, preserve/hold the smallest seam and continue the other author Docs unless outcome-critical. Current Google Docs are unchanged by this work.

## 6. Documentation and handoff record

**Related current project artifacts:** `LIVING_HIDDEN_COSMOLOGY_ATLAS_v0.2.md`, `WORLDVIEW_PERFORMANCE_SITE_CONCEPT_R1_2026-10-13.md`, `GOLDEN_TEST_01_DOSSIER_AND_GIZA_GENIUS_LOCI_REVIEW_2026-10-13.md`, `RETURN.md`.

**Superseded approach:** `GOOGLE_DOCS_NOTEBOOKLM_WORLDVIEW_SYNC_WORKFLOW_R1_2026-10-13.md` proposed one central Google Doc containing all author tabs. It is kept as history, with the user now selecting one author Doc per author.

**Approvals recorded:**
- **HCA-036 — MULTI_DOC_AUTHOR_MASTER — USER DIRECTION:** Each author has a single dedicated editable Google Doc; central Golden Test is a derived comparison fixture, not a second authoritative author dossier.
- **HCA-037 — NATIVE_TABS_WITHIN_AUTHOR_DOC — DESIGN TARGET:** Epistemic core, vocabulary/mechanisms, source/relations and KFB performance as internally separable tabs; actual tabs are not implemented yet.
- **HCA-038 — AUTHOR_RELATION_NETWORK — DESIGN TARGET:** Cross-author semantic edges with stable source references, distinct relation provenance and optional later embeddings; no automated vector store claimed.
- **HCA-039 — EDITABLE_SOURCE_VS_DERIVED_OUTPUT:** The author's Docs and original research corpus preserve worldview semantics; GitHub retains KFB recovery/reviewed lens exports; Site/Resident/Triplet outputs are downstream transformations.
- **HCA-040 — SOURCE_AND_PRIVACY_INTEGRITY:** Never claim NotebookLM import/sync without direct evidence; do not publish private Docs IDs; no external speculation labels or premature content pruning; source originals and historical revisions remain recoverable.

**ONE NEXT GATE — `MULTI_DOC_AUTHOR_TABS_AND_SOURCE_ANCHORS_R1`:** Under a single Docs editor, convert ONE source-rich author document to verified native tabs, preserve its exact content, attach at least a small body-text source ledger and confirm one NotebookLM import/refresh for the separate author source. Then reuse the proven donor structure for the other authors. The next gate is editorial/document QA and does not authorize KFB Site or game runtime work.
