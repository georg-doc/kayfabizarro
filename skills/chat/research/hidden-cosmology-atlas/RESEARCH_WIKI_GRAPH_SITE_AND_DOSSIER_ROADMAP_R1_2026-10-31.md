## USER DECISION ADDENDUM · 2026-10-31 · GPT SITE DIRECTION APPROVED

Georg has **explicitly chosen the GPT Site as the meta-administrative research/workflow surface NOW**. The old conditional recommendation in Sections 1, 3 and 8 (“consider Site only later”) is historical and is **SUPERSEDED as a product-direction question**, not as a data-ownership or safety rule. A Site was **not built or published** in this research/briefing slice.

**Binding next product brief:** [KFB Research Atlas Meta-Admin GPT Site Brief R1](KFB_RESEARCH_ATLAS_META_ADMIN_GPT_SITE_BRIEF_R1_2026-10-31.md). The Site specializes in source search, cross-provider authorized retrieval, evidence/wiki/graph browsing, bounded Work research dispatch, derived author/institution register and auditable research-packet export to NIE/NotebookLM/essays/KFB editorial owners. A [Puharich–Jorjani genuine source/claim walkthrough](RESEARCH_ATLAS_END_TO_END_CASE_PUHARICH_JORJANI_R1_2026-10-31.md) and [pointer-only registry view](ATLAS_ENTITY_REGISTRY_VIEW_R1_2026-10-31.json) are prepared. Existing GitHub Atlas SSOT remains sole historical source owner; the private NIE remains a separate protected owner; KFB Production Hub remains the one cross-KFB front door. No unverified direct Site→Work or local Mac file API and no fake Live.

**ONE next product implementation gate:** `RESEARCH_ATLAS_SITE_PUHARICH_EVIDENCE_READER_01`, source-accurate read-only working Site prototype. Research-only files do not require Stage publication. No auto-merge or game runtime changes.

---

# KFB Hidden Cosmology Atlas — Research Wiki / Graph / GPT Site and Dossier Expansion Roadmap R1
**Status:** additive **RESEARCH / DESIGN PROPOSAL**, NOT new Site/runtime authorization, NOT new canonical ontology, NOT a Docs/NotebookLM migration. Date: 2026-10-31. **One owner:** existing Hidden Cosmology Atlas Editorial Research. Branch `research/hidden-cosmology-atlas-2026-10-13` / open Draft PR #394. Does **not** supersede the current WCC R4 original-access gate nor past author/worldview rules. Proposal is a read-only **projection over existing source IDs**, never a second SSOT.

## 1. Decision proposal in one sentence
**Keep GitHub Markdown source/evidence/claims/typed relationships as the one durable research truth; make a navigable wiki the first *reader*, add a derived evidence-filtered graph as the second *reader*, and consider a GPT Site only once a concrete nontechnical use case justifies a human-friendly interactive front end. Work/ChatGPT Deep Research = executor, never data owner.** Google Drive holds private original/user-authored donor dossiers and full licensed/unlicensed source copies under existing permissions. NotebookLM remains an optional per-notebook *research retrieval projection*, not an authoritative automatically synchronized source. Research files are context-portable outside KFB.

## 2. What is already built and must be reused
- `LIVING_HIDDEN_COSMOLOGY_ATLAS_v0.2.md` (current editorial source owner) and owner `RETURN.md`; current researcher PR #394.
- Source and relation files: `authors/*.md`, `sources/*.md`, `relations/source-relations_v0.1.0.md`, `topics/wcc-samosa-network-2026-10-29/`, `topics/jorjani-michels-trilogy-2025-2026/`. Current separate WCC **R4 = 46 sources / 50 atomic claims**, original Moneyrex shareholder book and 1981-04-30 letter not yet acquired. Current Jorjani/Michels R1 **15/18 sources/claims** before today's new `JM-S16..21` and `JM-C19..26`.
- `MULTI_DOC_AUTHOR_WORLDVIEW_NETWORK_WORKFLOW_R2_2026-10-13.md`, existing KFB WorldView source-only author research skill, installed KFB Deep Research Atlas skill. They already define **one Doc per author**, source provenance, absence of invented quotations and separate optional KFB performance adapter.
- `HEXAGONAL_SEMANTIC_CONSTELLATIONS_R1_2026-10-13.md`: Warburg neighbors and Gabriel fields as a **non-causal interpretation view**, not a fixed six-category ontology.
- Reuse `travel/3D Conspiracy Iceberg Explorer/docs/SCHEMA-v2.md` as an **idea donor only**, not as the source database: its per-entry 3-neighbor limit cannot represent unlimited research relationships. No new runtime owner or inferred transfer of ownership.
- `WORLDVIEW_PERFORMANCE_SITE_CONCEPT_R1_2026-10-13.md` is a **separate downstream fictional KFB performance concept**, not a historical research site and not an authorization to impersonate authors.
- `KFB_SITE_SURFACE_REGISTRY_2026-10-04.json` documents current product Sites but **no confirmed existing research-specific Atlas Site**. Do not create a competing owner or call an unbuilt view Live.

## 3. User-facing reader options (comparison, not implementation)
| Option | Good at | Constraint / recommendation |
|---|---|---|
| **GitHub source Markdown** | Revision control, evidence audit, PR review, stable source IDs, multi-agent writes | **AUTHORITATIVE SSOT NOW**; not optimized for casual semantic browsing. |
| **Static Markdown Wiki (e.g. Quartz / MkDocs / Docusaurus)** | Pages per author/institution/work/topic, search, backlinks, source lists, timeline links | **FIRST optional reader**. Build from GitHub without two-way rewriting. Generic wiki links alone cannot prove historical relations; evidence IDs remain attached. Quartz is a possible Markdown/backlink donor, not a pre-selected product. |
| **Derived typed network graph (Cytoscape.js or equivalent visualization)** | Show *why* two nodes relate; filter `DOCUMENTS/FUNDS` vs `CITES/ASSERTS` vs noncausal `WARBURG_NEIGHBOR`; inspect source edge details | **SECOND reader after stable cross-topic records**. Never infer funding from shared person/name/topic. No Neo4j/knowledge graph database or dynamic ETL required for the first version. |
| **GPT Site / interactive browser** | Nontechnical investigation interface, source sidebar, claim-specific challenges, compare two authors, graph-to-document navigation | **CONDITIONAL LATER**: only after owner source contract and a narrow usability demonstration. If Site-capable, obey KFB Site-first publishing, but the Site consumes repository evidence; no editable second truth. Reuse Site donors/registry and human acceptance procedure, not generic AI chat UI. |
| **ChatGPT Work / Web Chat / KFB Deep Research / WorldView** | Source gathering, extracting passages, correcting speaker attributions, diffing claims, creating source-backed packets and additive GitHub checkpoints | **Executor/orchestrator now**, not the publishing surface or source master. Retrieval can be done inside Chat before any new front end. |
| **Private Drive dossiers + NotebookLM** | Source ingestion, user files, guided synthesis and citation within individual notebooks | Preserve Google Drive original and user privacy; per-author Docs as **donor/workspace**, NotebookLM content and sync not assumed verified from Drive. Never copy private full transcripts into public GitHub by default. |

**Suggested progression:** Wiki-like index made with GitHub Markdown first (no deployment), then independent read-only rendering with search/backlinks, then optional switchable source-backed graph, and finally GPT Site only if interactive tasks require it. Avoid separate native GitHub Wiki repository, second SQL/graph DB, or live-agent research dashboard at the beginning.

## 4. Source contract for network reuse (smallest possible)
Each existing `sourceId` record should progressively supply:
`originalWork / creator / originalURL / eventDate / publicationDate / transcriptOrScanEdition / sourceKind / privateCustodyRefIfAny / imagePagesActuallyInspected / textScope / audioActuallyListened / limitations`.

Each existing `claimId` needs:
`proposition / assertingSpeaker / sourceId / exactPageOrTimecode / claimKind / textFidelity / independentOriginalIDs / contraryOrNarrowerSourceIDs / currentState / nextFalsifier`.

Each **typed** edge needs:
`edgeId / from / to / relationType / evidenceSourceIds / direction / timeScope / status / causality / counterEvidence / nextFalsifier`.
Keep source quotation, faithful paraphrase, editorial field translation and KFB fiction **physically distinct**. No universal binary truth score. A 1984 recording reissued 2026 is one historical claim source, not two independent sources merely because an Acast mirror and Substack page host it.

Example three distinct links:
- `PUHARICH_1984_PUBLIC_STATEMENT -> 90_PERCENT_MANMADE_SIGHTINGS`: `SOURCE_ASSERTS`, `JM-S16`, publisher transcript, original playback not yet checked.
- `JORJANI_2026 -> PUHARICH_1984`: `ATTRIBUTES/REPHRASES`, `JM-S19`, **scope differs** (all sightings vs close encounters, man-made vs US fleet).
- `PUHARICH_1984 -> HALF_ABDUCTIONS_STAGED`: **NO verified statement edge yet**. Current only `JORJANI_2026 -> allegation` with `UNRESOLVED_SECONDHAND`; no historical factual link.

## 5. Multi-context use/export without duplicated corpora
Introduce later a small **read-only Research Packet** format, not a new master:
`packetId / topic / sourceIds / exactClaimIds / acceptedDocumentaryEdges / disputedEdges / conceptualNeighbors / caveats / originalURLs / corpusRevision / intendedContext`. The same packet can be read by a researcher, NotebookLM-curated source list, graph, philosophy sparring, historical essay or an explicitly editorially approved KFB adaptation. **KFB performance/cards** require separate decision and provenance map to canonical KFB Card owner; original named living authors are not impersonated.

## 6. Near-term dossier intake backlog — candidates, not fabricated completed biographies
**P0, direct research leads** (these are *planned source audits*, not new author master files yet):
1. **Andrija Puharich**: Lily Dale 1984 publisher transcript/tapes (`JM-S16..18`), 1974 `Uri`, 1962 `Beyond Telepathy`, Round Table Foundation/Intelectron, 1984 ELF/psychotronics, archival provenance, alleged MKUltra role independently crosschecked. Anchor: [Psi Encyclopedia source survey](https://psi-encyclopedia.spr.ac.uk/articles/andrija-puharich/) and [The Cosmic Clock publisher](https://thecosmicclock.substack.com/p/90-of-ufo-sightings-are-man-made). **No new completed master yet.**
2. **Ingo Swann**: firsthand SRI/remote-viewing protocols and date-scoped institutional studies; first historical-government documentary lead [CIA record CIA-RDP79-00999A000300080001-3](https://www.cia.gov/readingroom/docs/CIA-RDP79-00999A000300080001-3.pdf), **PDF indexed/search text only; original image pages not read in this slice**. Distinguish experimental reports, Swann memoir/retrospective, and later intel folklore.
3. **Thomas Townsend Brown**: actual [US patent 2,949,550](https://patents.google.com/patent/US2949550A/en), filed **1957-07-03**, issued **1960-08-16**, specifically describes an electrokinetic apparatus in a surrounding dielectric medium. Patent evidence = claimed device design, not extraterrestrial propulsion proven. Track original 1930s and 1960s patents, Whitehall-Rand entity, no direct WCC tie assumed.
4. **Nikola Tesla** (correct canonical spelling): [*Colorado Springs Notes 1899–1900*](https://books.google.com/books/about/Colorado_Springs_Notes_1899_1900.html?id=nNtSAAAAMAAJ), archival notebook edited/published 1978. Distinguish Tesla's authentic patents/experiments from 1984 Puharich interpretations of `scalar waves`, and later Bearden/Farrell reconstructions.

**P1, cross-topic entities, defer creation until owner/coverage scan:** `World Commerce Corporation` **institutional dossier** (not an author, derivative from existing WCC R4, do not duplicate 46 sources); `Round Table Foundation`, `Intelectron Corporation`, `SRI`, `MKULTRA` as **institution/program records**, not pseudonymous people. Known actors/contributors for targeted first-party leads: `Uri Geller`, `Russell Targ`, `Harold Puthoff`, `Jacques Vallée`, `Otto Skorzeny`, `William Stephenson`, `William Donovan` — each only when a cited direct link justifies an actual dossier.

**P2, strengthen existing author masters rather than fork:** `authors/joseph-farrell.md` and `authors/daniel-liszt.md` (Dark Journalist), plus `authors/jason-reza-jorjani.md` and `sources/jesse-michels-american-alchemy.md`. Current condensed derivatives need primary passage-by-passage support. For Farrell track *Nazi International* and named source/edition; for Liszt catalog specific X-PROTECT/secret-space broadcasts plus episode timecodes, actual guest-vs-host voice. For Jorjani, identify exact edition of *Intelectronics: The Thought of Andrija Puharich* from his own published bibliography/book; this is a lead, not yet edition-verified.

## 7. Repeatable Work/Chat process and safeguards
1. **RECOVER** current GitHub branch + PR + Atlas Return, specific topic Return, ledger IDs and private Docs only if germane; never trust a previous chat head or reassign IDs.
2. **TARGET ONE OPEN QUESTION**; make a source gap inventory (`ALREADY_COVERED`, `ORIGINAL_MISSING`, `COUNTERSOURCE_NEEDED`, `NEW_RELEASE`), and find first-party original pages/recordings and edition history.
3. **SOURCE checkpoint** with narrowly scoped newly read material, descriptive exact URLs, access ledger and original claims. If URL indexed but file not opened, explicitly mark `INDEXED_TEXT_ONLY`. Audio requires listening/segment matching before `AUDIO_VERIFIED`.
4. **INDEPENDENT COMPARISON** with dated counterexamples, identify authors' differences and inspect actual source pages/speakers. Keep historical and conceptual graphs split. Tests validate IDs, relation types, dangling links, wrong denominator/author and noncausal flags; they are not historical truth guarantees.
5. **EVIDENCE checkpoint** report actual PDF page-image count, transcript time ranges, checks and failures.
6. **RETURN checkpoint** update topic Return + additive changelog + owning Atlas Return / existing index pointer, verify exact GitHub head and intended files. Don't touch public Hub/Main router just to list a research-only branch; no Stage unless an actual approved reader product is published.
7. **USER CONSUMPTION** provide plain-language findings, 2–5 grounded crosslinks, one next original-source question and a ready-to-use fresh chat Work brief. No automatic periodic jobs unless explicitly scheduled.

**Candidate ready-for-fresh-chat request (NOT executed or a new owner):**
> Continue `georg-doc/kayfabizarro` Draft PR #394 on `research/hidden-cosmology-atlas-2026-10-13` after reading the three chat SOPs, current Hidden Cosmology Atlas Return, `RESEARCH_WIKI_GRAPH_SITE_AND_DOSSIER_ROADMAP_R1_2026-10-31.md` and Jorjani/Michels `PUHARICH_1984_PRIMARY_SOURCE_RECOVERY_R2.md`. Bounded research outcome: inspect primary **1984 Lily Dale original audio** against the publisher transcript and search the **remaining original tapes** for Jorjani's “half of abductions staged” attribution. Keep original 1984 and 2026 speaker claims separate. Save source/claim records, independent comparison/evidence, additive Return/changelog on same branch, read back exact head/files, 0 fake audio/scan checks, no merge/Site/Stage. Stop with one next source gate.

## 8. Next design decision, not a runtime mandate
Once at least two unrelated author/topic chains can be queried end-to-end using their existing IDs, review **one** source-to-claim-to-edge-to-document cross-topic journey using GitHub Markdown. If it is cumbersome for a non-coder, evaluate a **single read-only wiki/graph exploration prototype** against an actual existing read-only source object; before integration display that existing source object **in isolation**. Human product decision only if an actual reader surface proves value. No premature generic dashboard or second canonical source schema.

**Scope owner boundary:** no KFB Cards/Residents/Audio, no Site publication, no public Stage URL, no undocumented NotebookLM sync, no private original copying into a public branch, no auto-merge/Live. Research may serve any later project under its original citation IDs.
