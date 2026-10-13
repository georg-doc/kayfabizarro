# KFB Modular Storytelling Research Intake R1 · Source and schema QA
Date: 2026-10-13 · Existing Voice/Triplet owner PR #379 · **RESEARCH INTAKE ONLY**.

## What was actually read
- Attached user-supplied 248,784-byte DOCX named `KFB Modular Storytelling Research: Openers, Fourth-Wall Sockets & Bridge-Free Beats`, SHA256 `663787224c8804fa65d89c799416159c94367774cac3b8ae554708d7ff6dccfd`.
- Exact mapped native Google Doc via Google Drive connector: `https://docs.google.com/document/d/1w9dRLIK5rnO1nnv8K3VVxd4i8k2eWat0-YG9gzZwUuc/edit?usp=drivesdk`. Native document title matched the attachment; one tab, eleven tables including seven twelve-column operator tables, 43 actual rows. Current Doc revision recorded in the normalized JSON.
- The supplied NotebookLM notebook `https://notebook.google.com/notebook/957e16ed-9bc5-4f49-b8e5-ee9fffcfe165` was inaccessible by available web/browser tools. Notebook content **NOT READ**, NotebookLM edit/import/sync **NOT EXECUTED**. Google Docs content edits are connector-capable but no edit was requested or done.
- Original research citations are embedded in the DOCX with hyperlinks (45 hyperlink relationships / 22 unique URL targets counted locally), but their academic accuracy or availability was **not verified** in this bounded intake. Keep evidence labels/links as user-provided research, not independent primary-source PASS.

## Durable files actually written
1. `data/KFB_PERPLEXITY_MODULAR_STORYTELLING_43_OPERATOR_RESEARCH_CATALOG_R1_2026-10-13.json`: actual all 43 research operators, with **12 unchanged original columns** and source record/row identity; 25 OP, 10 UP, 8 FW. Every entry `UNREVIEWED_RESEARCH_CANDIDATE`, `runtimeEnabled:false`, no automatic status promotion. Blob `aa9b720ba9dc07b666f3b62e797e8cb17ca27b93`.
2. `KFB_MODULAR_STORYTELLING_RESEARCH_SOURCE_TRIAGE_AND_WORLDVIEW_ADAPTER_R1_2026-10-13.md`: KFB source/WorldView/Beat integrity boundaries, provisional 10-pattern MVP shortlist, source/4th-wall/uptake anti-slop negative cases, no second runtime. Blob `2cac50b21be55acd835364e2e8580bda3d7c593a`.
3. `NOTEBOOKLM_MODULAR_STORYTELLING_ADDITIVE_GAP_RESEARCH_PROMPT_R1_2026-10-13.md`: concise additive NotebookLM gap-check prompt on original source vs hypotheses, 43/36 and eight/six count conflicts, source-qualified player/speaker uptake and four wall, no scripted extra invented lore. Blob `5a5b792cdebbbe9ac9597d655c9028764ccb09b5`.

## Measured source defects and constraints
- Research narrative claims **36** operators; original tables actually include **43**. Both facts are preserved and recorded in catalogue rather than silently cutting entries. BG section says "Use six structures first" but enumerates BG-1 to BG-8 (**8**).
- The source research contains illustrative/fake JSON IDs like `TODO_VERIFY`; these are not real source Card identities and cannot enter a game/Audio Site import without matching exact current `deckId+cardNumber+Card blob`.
- `KEEP` in the report is its author's proposed editorial recommendation, **not** acceptance by Georg or KFB critic. Some source example phrases intentionally dramatize/reframe KFB Cards, so they must not be converted into immutable source truth or research-author quotations.
- The WorldView Research Core from existing independent research owner PR #394 excludes KFB performance/Triplets from factual research, while supporting optional later source-grounded downstream creative adapters. Keep research source, worldview lens and KFB Resident speech separately versioned.
- The current Voice negative Goldens (Lore-only Card sentence and 1001 Nights rejected material), current Opener pool blob `46a48327fca3a6e6606de63623e677aa6a6923cf` and Audio/WSA source remain unchanged.

## Tests honestly performed
- Native Google Doc read back source table layouts/rows/headers; 43 original source ID matches and source columns read.
- First QA assertions **15/16** only because a check incorrectly looked for literal "43" in the discrepancy enum string despite `reportedCountInNarrative=36` and `actualExtractedCount=43` being correct. Corrected QA test predicate with those two numbers and prompt BG-1→8 gave **PASS**; this was a **test assertion bug**, not a research data error.
- Source fingerprint, 43 distinct IDs, exact group counts 25/10/8, 12 non-empty copied fields, unreviewed/non-runtime status, source URLs, research discrepancy and protected existing opener pool all verified.
- Each GitHub new-file write checked exact intended blob/text and exact branch commit; final owning Return/head verification follows.

## Non-goals and next gate
No NotebookLM source-collection read, no Google Doc edits, no plugin release, no Audio Site editor import/hot reload, no new speech, no author factual endorsement, no Composer/Wireface/World runtime, no merge, no Live. Prior Work/WSA-then-Claude-Code order remains binding.

**One next gate:** `KFB_MODULAR_STORYTELLING_43_OPERATOR_RESEARCH_SELECTION_GATE_R1`: review evidence and choose 8–12 operator candidates for existing Phase-1 Audio Site editorial bench, after targeted NotebookLM research; verify source-fidelity and short standalone vs dialogue-dependent UX before promoting any catalog entries.
