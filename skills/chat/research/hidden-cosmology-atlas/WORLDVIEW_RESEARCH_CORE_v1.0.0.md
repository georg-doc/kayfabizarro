# WorldView Research Core — Source-First, Project-Independent Contract

**contract_version:** `1.0.0`  
**adopted:** `2026-10-13`  
**status:** `current_research_boundary`  
**implemented_plugin:** [KFB WorldView v0.1.0](https://chatgpt.com/plugins/plugins_6ace954d03f48191badb64cb68ba6281) (`plugins_6ace954d03f48191badb64cb68ba6281`), private skills-only personal plugin  
**source_package:** `plugin-source/kfb-worldview/` (canonical plugin release still owned by Plugin Creator)  
**research_owner_for_this_dataset:** `georg-doc/kayfabizarro`, `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394  
**language:** English outputs; user communication follows conversation language  
**not a game runtime:** True

## 1. Absolute separation: research and downstream application

The WorldView Research Core **only** reconstructs attributed positions from actual original publications, recorded statements, lectures, transcripts and archival works. This includes ontologies, epistemic assumptions, actors and hierarchies, historical models, arguments and terminology, author-expressed certainty or doubt, source lineage and similarities/differences **where both sides are sourced**.

**Not part of the WorldView Research Core:** Borromean Dice, hypothetical game mechanics, KFB Cards, the Triplet grammar, stand-up scripts, character archetypes, KFB Residents, ChatterBox, satirical glosses, stage design, fictional transitions, made-up author catchphrases or "performance bridges". These belong to **optional, separately authorized downstream adapters** and must NEVER be introduced by a WorldView research plugin or source packet.

The pre-existing `conflicts/author-cross-matrix_v0.1.0.md` contained **KFB-staged creative examples and a Borromean Dice mention**. It is now classified `HISTORICAL_APPLICATION_IDEAS_NOT_RESEARCH`. Do not feed its fictional scene examples or dice references into author ontology records. Source research relations have a new, separate `relations/source-relations_v0.1.0.md` with pure source and editorial-evidence fields.

This non-fiction research method must also operate for **non-KFB projects**. The plugin label "KFB WorldView" is only a product name; actual project, repo and source registry must be supplied or resolved. Do not hardcode KFB author files or KFB lore for another project, and do not require KFB Production Control to research a non-KFB subject.

## 2. Author/host/source-role distinctions — Jesse Michels retained

The active 2026-10-13 corpus contains eight author dossiers: Kurt Metzger; David Icke; Daniel Liszt/Dark Journalist; William Bramley; Joseph P. Farrell; Catherine Austin Fitts; Jason Reza Jorjani; Michael Wann.

**Jesse Michels / American Alchemy remains in scope** as an interview host, original publisher/interviewer and guest/source-discovery node. His new Gemini Google Doc `KFB Author Dossier: Jesse Michels (American Alchemy)` was actually discovered and read on 2026-10-13, approx. 4,345 characters; it contains a purported own cosmology, performance suggestions and editorial links, but **zero original-source URLs/timecodes**. His own attributed arguments may be researched as an additional distinct author viewpoint, with source support. Never merge guests' positions into Michels' own model or presume he endorses interviewees. Existing source registry `SOURCE_EXPANSION_SOLARI_ICKE_MICHELS_R1_2026-10-13.md` continues as the publication/discovery anchor.

This makes **eight initial author documents plus one currently active host/author-candidate source record**, not proof that every interview guest belongs to the same worldview.

## 3. Gemini becomes a research meta-admin, not a source authority

Preferred role for **Gemini**: inspect research inventory/coverage and outstanding tasks, discover candidate sources and transcripts, identify redundancy, suggest a target author/topic/source-delta plan, and prepare narrowly scoped source-centered draft prompts. It is **not** authorized to create conflicting Docs or override GitHub author master, silently prune primary sources, write comedic adapters into core dossiers, declare a source relationship, or close a research Issue without evidence.

**Perplexity** (or any current-source web researcher) is a **discovery/deep-dive executor**, not a guaranteed installed connector or an autonomous recurring agent. If no connected Perplexity action is present, produce a copy-ready English deep-dive prompt instead of pretending a search was run there. Existing authors' basic biographical background and already covered passages should not be researched from scratch.

**NotebookLM** is an optional corpus reader/retriever and may contain preexisting research. The WorldView plugin must check its **actual readable inventory** before proposing a redundant import. A connected Google Drive or a notebook link does NOT prove it can read NotebookLM sources. If the notebook source list is inaccessible, use explicit `NOTEBOOKLM_INVENTORY_UNVERIFIED`, consult exact user-provided exports/screens/source lists where available, and never assert sync/deletion.

## 4. Mandatory additive discovery algorithm

For each `author | original work | question`:

1. **Resolve source owner**: project-specific repo, branch, path, dossier version, existing backlog/Issue, bibliography and source IDs; no second SSOT.
2. **Read what exists**: current GitHub author dossier/ledger and already catalogued primary source passages; connected Google Docs by exact ID or narrow search, source lineage and revision; user-provided NotebookLM source inventory if present. Separate `source_material`, `Gemini_summary`, `original_author_statement`, `host_statement` and `editorial_comparison`.
3. **Coverage ledger**: mark `ALREADY_COVERED`, `PARTIAL`, `PRIMARY_PASSAGE_MISSING`, `NEW_PUBLICATIONS_NEEDED`, `SOURCE_CONFLICT` or `NOTEBOOKLM_INVENTORY_UNVERIFIED` per source/claim. These statuses are only research completion evidence, **not worldview truth ratings**.
4. **Delta planning**: define a bounded source-gap list, what NOT to repeat, new primary publications since the last *actual documented* sweep (or `LAST_CHECK_UNKNOWN`), named speakers and exact missing passage/timecode.
5. **Produce one Perplexity and/or NotebookLM deep-dive prompt** that explicitly passes existing source IDs/covered arguments as context and asks for genuinely new source material, divergent statements or deeper original passages. Do not run a generic broad survey again when an existing review already covers it.
6. **Research with permitted tools** or return the prompt. Never fabricate current external results. Report inaccessible and searched-but-empty sources clearly.
7. **Prepare additive patch only**: original author/source citations and source-specific conceptual model updates; preserve primary source corpus, old author sections and source lineage. GitHub author masters are the intended writable home for the KFB Atlas; other projects use their existing chosen owners. Git commit proof + optional authorized Site/Inbox recovery after meaningful boundaries.
8. **Keep application out of research**: optional separately requested KFB narrative adapters may later read a reviewed source package, but can neither edit nor impersonate the research subject.

**Minimal citation receipt:** `author_id`, `speaker_role`, `source_id`, `source_title`, `original_url`, `publication_date`, `passage_or_timecode`, `faithful_statement`, `source_expressed_qualification`, `connection_origin`, `checked_revision`. If any evidence is missing, mark `SOURCE_ALIGNMENT_PENDING` rather than invent a statement.

## 5. Reusability outside KFB

Parameterize `project`, `repository`, `source_root`, `source_systems`, `author_or_source`, `topic`, `since`, `mode`, `output_target`, `language` and `depth`. Nothing in the data contract depends on game runtime, comic lore, Satire, Cards, Cloudflare, KFB Hub, KFB Production Control or a project-specific URL.

**Default interface modes**: `audit` (inventory), `research` (source-first delta), `prompt` (targeted current-source Perplexity/NotebookLM request), `compare` (two source-grounded positions), `prepare` (reviewable patch), `help` (options). The plugin is already a **private skills-only extension**, not a published GPT Site, and does not deploy a Perplexity or NotebookLM server. Verify its installation/skills and run a scoped audit before claiming end-to-end behavior.

## 6. QA and handoff

**Static acceptance (current slice):** plugin release exists with correct source-inventory-first and pure research boundaries; GitHub source copy exact; named research contract / provenance layers align; no new runtime owner.

**Not yet executed:** end-to-end plugin research run; Perplexity provider call; NotebookLM source inventory/import/refresh action; automated GitHub write via plugin; Site publication or game/browser QA. Thus `PLUGIN_CREATED` is not `END_TO_END_VERIFIED`.

**One next gate:** `WORLDVIEW_PLUGIN_SOURCE_AUDIT_v0.1.0` — invoke the installed plugin in `audit` mode on a source-rich subject such as Kurt Metzger and on a second non-KFB subject/project, checking that already-known sources are detected, missing citations are listed, prompts target only gaps/recent works, and no KFB performance content appears.
