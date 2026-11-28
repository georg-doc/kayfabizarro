---
name: research-worldview
description: Research a named thinker, interview, book or original source using existing GitHub, Google Docs and NotebookLM inventory before any new search; generate only additive deep-dive prompts, attributable source packets and reviewable versioned handoffs. Use for WorldView Research, author dossier, research gaps, source comparison or WorldView plugin help. Works for non-KFB projects; never add Cards, Triplets, comedy, dice or fictional character interpretations unless a separate downstream workflow is explicitly requested.
---

# WorldView Research v0.1.0

**One job:** faithful reconstruction of what a thinker, speaker, work or source actually says, plus useful, bounded additive source discovery. Project-neutral by default. `KFB WorldView` is the plugin's installed label, **not** a mandate to inject KFB narrative, cards, game rules or comic material.

## Entry point and optional inputs

Accept ordinary natural language. Interpret explicit options only; otherwise use available context and proceed. Options: `author` or `source`, `topic`, `project`/`repo`, `scope` (a question or author), `mode` (`audit`, `research`, `prompt`, `compare`, `prepare`, `help`), `depth` (`focused`, `deep`), `recency`/`since`, and `target` (`GitHub`, `Google Docs`, `Site` or `report`). A connected non-KFB project may supply a different repository/root and metadata convention. Default to `research`, `focused`, current project repo, English research outputs; chat language follows the user. Do not assume the same target branch or source inventory exists across projects.

If `help`, show compact modes and the minimum two examples, then stop. Research outputs and artifacts must not use maturity-branding names (`golden`, `final`, `ultimate`). Use stable author identity slugs and semantic version `vMAJOR.MINOR.PATCH` for workflow/export versions, Git commit SHA for exact revision, and explicit evidence/status fields.

## Mandatory source inventory before searching

**Do this before any deep dive or prompt.** Work from real tool reads; never synthesize an inventory merely from a prior model summary.

1. Resolve the named target, project/repo, most recent authorized research SSOT, branch/PR/Return and open issues. For KFB only, read current GitHub `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, then the actual project SSOT, Return and source briefing. GitHub state overrides past chat memory. Existing owner and target only; no second SSOT/runtime.
2. Search current GitHub author/source records and source-gap/coverage ledger for **the exact author, topic and claim identifiers**. Record source object, commit SHA, existing source IDs, current citations, verified/derived passages, unresolved gaps and checked date. Reuse existing original passages; no repeat of baseline biographies or generic summaries.
3. Search **existing Google Docs / Drive**, if connected, with narrow author/project terms or the exact supplied file ID/URL, and inspect the relevant native Doc or appropriate source range. Treat Docs as upstream donor/historical version or another project's actual master according to that project's current owner policy. Do not write or create Google Docs in this plugin by default.
4. Check whether the **specific NotebookLM notebook's source inventory is truly accessible** through an installed authorized action or a user-provided export/list. A public NotebookLM link or connected Google Drive alone does **not** prove NotebookLM source-list access. Google Docs presence is not proof a document is imported, selected, or synced in NotebookLM. Never claim actual NotebookLM sync, delete or access without a direct observed receipt. Mark `NOTEBOOKLM_INVENTORY_UNVERIFIED` and give an economical in-product verification step when necessary.
5. If existing research/known passages already answer the request, explain what is covered and stop repetitive discovery. For current/new publications, define a bounded **since date** from the most recent documented source/index, not an invented timestamp. When uncertain, state `LAST_CHECK_UNKNOWN` and request a fresh source sweep without asserting old material is complete.

Return a compact **coverage map**: `ALREADY_COVERED`, `PARTIALLY_COVERED`, `MISSING_SOURCE_PASSAGES`, `NEEDS_CURRENT_PUBLICATIONS`, `NOTEBOOKLM_INVENTORY_UNVERIFIED`. This is retrieval/coverage status, **not an ideological truth ranking**. Never conflate author statements with a host's or a Gemini/NotebookLM synthesis.

## Research and selective deep-dive prompt

Use the smallest gap-producing scope. Find new primary interviews, lectures, books, publications and specific authored assertions, prioritizing author/source originals and **current publications** if user requests freshness. Do not reperform research already present as adequately attributed original passages. Search third-party tools including Perplexity only when actually available/connected; otherwise produce a **copy-ready English Perplexity/NotebookLM deep-dive prompt** scoped to missing concepts, new dates and cross-source disagreements, naming existing source IDs to avoid duplication. A prompt is not a completed external tool execution.

Source output records must contain `author_id`, `speaker`, `original_work`, `publication_date`, `original_url`, `timecode_or_page` where available, `precise_quotation_if_verified_or_faithful_paraphrase`, `source_expressed_caveat`, `source_id`, and `editorial_relation_origin`. Differentiate `AUTHOR_DIRECT_CITATION`, `SHARED_PRIMARY_SOURCE`, `DOCUMENTED_INTERVIEW`, `EDITORIAL_PARALLEL`, and `NO_PASSAGE_FOUND_IN_SEARCHED_SET`. An author's actual uncertainty is documented when expressed; do not add blanket outsider speculation/debunking labels. No forged quotes or invented source relationships. Be cautious quoting copyrighted full passages; use brief allowable excerpts and own paraphrases.

For Jesse Michels / American Alchemy and other hosts, classify host/guest separately; an interviewer's question or podcast branding does not convert a guest claim into the host's worldview. Michels can have an independent author dossier only for **his own** attributable published statements. Do not elevate a host's show to a single worldview comprised of guests' views.

## Review and persistence

Produce English `SOURCE_COVERAGE`, `DELTA_FINDINGS`, `SOURCE_PACKET`, `DEEP_DIVE_PROMPT`, `PROPOSED_PATCH`, `OPEN_GAPS`, and `NEXT_GATE`. If no sources found, record the actual searched corpus and an explicit next search, rather than writing a plausible synthesized answer.

A `prepare` command creates a small, reviewable additive patch for the correct existing author/source file and target **GitHub** branch, plus appropriate authenticated private Site/Inbox recovery where the KFB owner needs it; for other projects use their chosen persistence connector. Always separate **prepared** from **committed**. If explicitly authorized to commit, confirm the exact existing path/branch and readback after each actual write; a timeout means UNKNOWN until ref inspection. Issue state is mutable task status, not Markdown checkbox replication. Do not merge, deploy, delete NotebookLM sources, create new Apps or publish to public sites implicitly.

Do not introduce a separate fictional layer: **no Borromean Dice, no KFB Cards, no Triplets, no Resident, no stand-up, no Satire, no KFB terminology injected into source research**. Only an explicit *separate downstream* performance request may pass an accepted reviewed Lens package to the existing KFB performance/game owner. For non-KFB projects, output only project-neutral research and cite the project's actual artifact conventions.

## Success and failure tests

1. Existing source discovered -> no duplicate foundational research; selective gaps/recency search only.
2. Google Doc present, NotebookLM inventory unavailable -> report Drive read success and NotebookLM verification limitation independently.
3. A source has multiple speakers -> do not convert guest statements into host doctrine.
4. Same themes but no original cross-citation -> editorial comparison only; never a claimed source-author alliance.
5. KFB concepts mentioned by user incidentally -> do not leak them into author study; no performance generated.
6. Other project with different repo -> avoid KFB-specific author paths/SSOT/Stage.
7. Actual GitHub write -> verify exact branch HEAD and target file, then phase checkpoint and Return only when the phase meaningfully completes.

See [output contract](references/outputs.md) for concise templates. **One next gate at a time.**
