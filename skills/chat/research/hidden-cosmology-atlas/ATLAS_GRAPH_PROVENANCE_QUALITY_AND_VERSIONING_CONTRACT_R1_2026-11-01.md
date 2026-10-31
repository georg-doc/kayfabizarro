# Hidden Cosmology Atlas · Evidence Graph, Owner Attribution and Correction History R1
Date: 2026-11-01 · STATUS: DESIGN / RESEARCH CONTRACT, NO NEW APP OR DATABASE · Existing GitHub source owner: georg-doc/kayfabizarro, branch research/hidden-cosmology-atlas-2026-10-13, Draft PR #394.

## 1. Editorial objective
Make a visual, time-aware, falsifiable and source-addressable research network. Every clickable edge must answer:
- Which exact two entities/claims and legal identities?
- Who claims or documents the relationship, where, when and with what precise source passage?
- Is it documentary, an original author's asserted link, a noncausal editorial comparison, or an unresolved/disputed hypothesis?
- What contrary record and missing original could revise it?
- Which source-owning dossier, research executor and independent reviewer changed its assessment?
- What did earlier Git revisions and correction events say? Preserve rejected hypotheses without treating them as current historical facts.

A name co-occurrence, shared bank surname, symbol, period, media appearance, or visually adjacent graph node NEVER proves secret financing or common command. Warburg good-neighbor relations and Gabriel fields of sense remain permitted exploratory concepts with explicit noncausality.

## 2. Current candidate corpus
Use ATLAS_BREADTH_CENSUS_AND_CLUSTER_SEEDS_R2_2026-11-01.json, derived without rewriting earlier R1: **91 candidate nodes across ten cluster families**, comprising the old 54 and 37 additive proposed nodes in:
- C08_MONETARY_CENTRAL_BANKS: Fed, reserve-bank structure, monetary policy, money/credit, Bank of England and BIS. Original-institution publisher leads: https://www.federalreserve.gov/faqs/about_14986.htm ; https://www.stlouisfed.org/in-plain-english/who-owns-the-federal-reserve-banks ; 1913 legislation history https://www.federalreservehistory.org/essays/federal-reserve-act-signed . The original statutory text has NOT been audited in this turn. Source issuer's description is evidence of institutional account, not independently all-finance corroboration.
- C09_VATICAN_FINANCE: IOR/Vaticanbank, APSA, Banco Ambrosiano, BPF, P2, Sindona, Calvi. IOR and APSA are **distinct**: https://www.ior.va/en/faq-en/ ; https://www.vaticannews.va/en/vatican-city/news/2025-07/administration-patrimony-holy-see-apsa-tasks-mandate-vatican.html . Original annual-report discovery: https://www.ior.va/en/annual-reports/ . Preserve existing WCC R4 source claims; no assumed WCC ownership.
- C10_SECRET_SOCIETIES_MYSTERY_SCHOOLS: documented organizations versus historical initiatory traditions, myths, esoteric lineages and fictional narration. Theosophical Society founding published by institution https://www.theosophical.org/component/content/article?id=1040 and separately official UK charity-history text https://www.gov.uk/government/publications/charity-registration-decision-the-theosophical-society-in-england/charity-registration-decision-the-theosophical-society-in-england . The concept "Mystery Schools" is NOT a single transhistorical legal organization. Existing source-author master is Daniel Liszt / **Dark Journalist**, authors/daniel-liszt.md (user corrected earlier mistaken "Dark Jungle"); no second owner.

Actual KFB narrative donors exist: registry/assets/v1/decks/federal_kayfabe.json and registry/assets/v1/decks/cosmic_grift_dark_journalism.json. **Card art/Lore and comic claims are NOT historical primary evidence.** Display source Card objects separately before fictional adaptation; no Card or game edit here.

## 3. Four overlays of ONE graph dataset, not four databases
A_DOCUMENTARY: actually reviewed source evidence of dated action, roles, contracts, recorded meetings, genealogy or institutional document, with exact original-read limits.
B_AUTHOR_ASSERTION: interview/book/lecture author reports a link; establishes attribution but not automatically historical truth.
C_CONCEPTUAL_NONCAUSAL: analogy, shared question, Warburg neighbor, mythic motif, Sinnfeld translation; causality:false REQUIRED.
D_OPEN_DISPUTE_CORRECTION: proposed relation, source disagreement, missing record, mistaken identity, previously corrected/retracted link with event history.
The same node may appear in multiple clusters, but an edge's review status cannot be upgraded merely because the node is popular or appears in multiple books.

Suggested minimal machine-readable record:
```json
{
  "edgeId": "ASSIGNED_BY_CURRENT_OWNER",
  "fromEntityId": "EXACT_ENTITY",
  "toEntityId": "EXACT_ENTITY",
  "type": "ASSERTS_OR_DOCUMENTS_OR_CONCEPTUAL",
  "layer": "B_AUTHOR_ASSERTION",
  "causality": false,
  "claimIds": [],
  "sourceIds": [],
  "sourceLocator": "EXACT_PAGE_OR_TIMECODE_IF_INSPECTED",
  "eventDate": null,
  "publicationDate": null,
  "identityStatus": "EXACT_OR_UNRESOLVED",
  "originalSourceScope": "ACTUALLY_READ_SCOPE",
  "editor": "EXECUTOR_RUN_OR_HUMAN_IF_KNOWN",
  "independentReviewer": null,
  "reviewStatus": "UNREVIEWED",
  "ownerPath": "ACTUAL_GITHUB_SOURCE",
  "sourceGitSha": "ACTUAL_GIT_REVISION",
  "counterEvidence": [],
  "nextFalsifier": "SPECIFIC_MISSING_ORIGINAL",
  "auditEventIds": []
}
```
Example field values are only a schema, not implemented records or approvals. To claim documentary financing or operational control, require parties, exact corporate identities, document scope, time, provenance; if the original isn't read, retain AUTHOR_ASSERTION/OPEN instead of historical link.

## 4. Owners, agents and independent correction audit
Existing GitHub Markdown dossiers and topic-ledgers remain the sole editable research truth. Site, Notion and future Obsidian-style Markdown viewer are read-only projections keyed by canonical entityId, sourceId, claimId, edgeId and Git revision. Private Drive/Dropbox are source archives or donor docs; the NIE knowledge graph is private/local-only. Never publish credentials, personal private Docs IDs, unpublished transcripts or full private NIE graph.

A Work research product must carry:
- researchRunId, agent/model identification **only when observed**, prompt/ref version, source-access receipt and exact original pages/audio/minutes read;
- named existing GitHub topic/author owner, sole Builder/writer; separate source/claim/graph editorial roles if assigned;
- source-specific independent reviewer and Guard classification on major WSA changes; if reviewer missing, mark UNREVIEWED;
- actual GitHub branch head before write, resulting commit SHA, exact file readback and PR; timeout UNKNOWN until ref verified.

**Append-only correction-event fields:** eventId, recordedAt, affectedClaimOrEdgeIds, action (ADDED / NARROWED / SOURCE_MISATTRIBUTION / PERSON_SPLIT / EDGE_RETRACTED / DISCONFIRMED / REOPENED), originalAttributedActor, priorGitRefOrDocVersion, newGitRef, evidenceSourceIds, beforeClaim, afterClaim, reviewerState, nextPrimarySourceGate. Actual Git history remains append-only revision evidence; a correction event explains semantics. An asserted edge can be narrowed/retracted and later reopened after new evidence without deleting prior states. Distinguish the author of a wrong statement from any extraction AI; **do not invent agent blame**.

**Existing actual research correction fixtures, NOT new proofs:**
1. WCC R3 WC-C32 asserted Jocelyn Olaf Hambro was son of Sir Charles Jocelyn. WC-S33/34/35 instead identify father **Ronald Olaf Hambro**, while Charles Eric Alexander was Sir Charles Jocelyn's son. Person identity correction retains valid bank business links separately.
2. WCC R3 WC-C36 attributed 25% Hambros equity to Moneyrex, while the referenced WC-S31 passage discusses **BPF**. Existing status SOURCE_MISATTRIBUTION_LIKELY / MONEYREX_EQUITY_OPEN; no universal claim of no Moneyrex stake.
3. JM-C19 (~90% all UFO sightings/man-made) versus JM-C21 (2026 Jorjani US close encounters) and JM-C22 (missing original for half staged abductions) is text-scope difference JM-W10 with causality:false. Original audio 0 minutes independently listened. Do not hide previous weaker claim.

## 5. QA rules and human-readable research history
Automate unique entity and relation IDs, real source refs, no duplicate independent witnesses via mirrors, identity collision checks, exact temporal scope, original vs transcript distinction, no private material leaks and noncausal flags. Run an independent historical source/attribution pass for promoted edges, do not count structural tests as historical fact checks. Keep negative evidence and open questions reversible.

Site user experience when real source corpus is ready:
- Cluster-level zoom (10 candidate families) -> selected person/institution -> scoped ego graph -> source claim / archive passage, with wiki and chronological-list fallback.
- Distinguishable solid documentary lines, dotted attributed-claim lines, dashed explicitly noncausal comparisons, faded unresolved questions, archived/retracted lines. Color is supplemental; labels and legend must carry meaning.
- Click edge to inspect source, stated strength, independent witnesses, opposing evidence and *what would change the claim*.
- **Version/Provenance lens:** select old/new Git SHA or date, compare before/after source claim and graph edge; show correction event, author/agent if actually logged, review status and return. A layout reposition is not epistemic change.
- **Quality lens:** orphan nodes, ambiguous identities, unreviewed AI output, missing originals, incompatible timelines, disputed edges, source loss, false overclaim. No blanket truth score on a person's philosophy or topic.
- Only after WSA returns actual source-backed source files should current private GPT Site https://kfb-research-atlas.frizzlebob.chatgpt.site/ integrate the new graph view. Reuse existing approved KFB source design and private NIE sanitized donor only with owner consent. No second runtime, new Site, fake Work button or unverified publication.

## 6. Receiving handoffs and ONE next production gate
WSA Work extends WSA_WORK_BREADTH_FIRST_AUTHOR_ATLAS_EXPANSION_BRIEF_R1_2026-11-01.md with C08–C10, sources and appender correction history. Existing Site receives a bounded in-place meta-navigation/version-history upgrade per RESEARCH_ATLAS_SITE_BREADTH_WIKI_NOTION_GRAPH_FOLLOWON_BRIEF_R1_2026-11-01.md. Do not delay actual author dossier work with a graph engine project.

ONE next: ATLAS_BREADTH_CORPUS_BATCH_AB_01, now covering ten clusters. Original deep-source gates remain research queue only. No Stage or Live/merge promotion in this planning slice.
