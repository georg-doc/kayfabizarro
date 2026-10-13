# KFB Research Pipeline — Task → Sources → Author Doc → NotebookLM → Evidence

**Date:** 2026-10-13  
**Status:** WORKFLOW DESIGN / EXECUTION BRIEF — NOT AN AUTONOMOUS SERVICE OR SCHEDULED RUN  
**Owner:** Existing KFB Editorial Research in `georg-doc/kayfabizarro` · `research/hidden-cosmology-atlas-2026-10-13` · Draft PR #394  
**Source of task truth:** GitHub Issues plus [Research Backlog R1](RESEARCH_BACKLOG_R1_2026-10-13.md) as stable question/contract index.  
**Language:** All agents, prompts, files, Issues, source reports, performance content and generated outputs in English. The user-facing ChatGPT conversation with Georg remains in German.

## 1. What this pipeline does — and does not

**User's intended closed research loop:** GitHub research question → delegated source discovery (Gemini/Perplexity/ChatGPT or another explicitly connected executor) → author-specific Google Docs master → verified NotebookLM source refresh → reviewed GitHub Issue evidence/completion → next author question or KFB Performance Lens.

**This task authorizes design/persistence of the workflow and one actual research Issue, not unattended execution.** There is no verified cross-app unattended Gem/Perplexity API connection, no scheduling task, webhook, deploy or service account installed by this design. A human may execute prompt steps in the provider UI; later integration must first prove the exact authenticated action, permitted scope and resulting revision. Do not claim autonomous operation from a written prompt alone.

The author master is the single editor-owned, content-editable Google Doc. The original recorded interviews/books remain the primary source corpus; NotebookLM is a derived Drive-linked research/retrieval consumer; GitHub holds tasks, versioned evidence and KFB editorial/recovery SSOT. No duplicate mutable master is created by the pipeline.

**Do not confuse:**
- source scout's completion with supported claim;
- completed research packet with Google Docs edit;
- successful Google Docs edit with NotebookLM sync;
- task marked `DONE` with acceptance of a KFB Card, Triplet, scene, or public-worldview assertion;
- a connected Drive account with authenticated programmatic control of NotebookLM or Perplexity.

## 2. Atomic agent roles

**Research Router / Dispatcher (GitHub):** reads one selected Issue and the binding Living Research SSOT, resolves target author Doc identity from authenticated references, chooses exact question and available source corpus. One `RQ-###` per active pass; a broad `READ ALL OPEN TASKS` instruction must not silently launch hundreds of writes or collapse cross-author tasks.

**Source Scout (Perplexity, Gemini or browser agent):** searches current original interviews, podcasts, transcripts, books and source publications. Produces the exact author/speaker/event identifiers, primary source URLs and page/time anchors. May use discovery pages or machine transcripts as leads, but clearly say when audio words have not yet been verified. Cannot decide the truth of an author's worldview or filter unusual subject matter.

**Attribution and Source Editor:** independently checks cited excerpt/author/timecode where possible, disambiguates guest/host and authored vs interviewer or later synthesizer's claims. Preserves source author's expressed certainty, doubts, secondhand-source wording or humor only as expressed. Separates direct source citations from comparative bridges. No invented quotes or presumed relationships.

**Docs Integrator:** the ONE authorized writer to the existing author Google Doc. Reads exact current revision and true native tab inventory, inserts accepted source unit(s) into the correct in-body `Source Ledger & Cross-Worldview Neighbors` and updates ontology/mechanism summaries only where citations warrant. No destructive overwrite, duplicate author Doc, silent tab migration or replacement of the original full-text corpus. Concurrent Gemini editing requires serial handoff.

**NotebookLM Sync Witness:** observes that the exact author Doc is imported as its own Google Drive source in the target notebook and tests a unique newly edited phrase after synchronization. If this provider session is not directly accessible, mark `SYNC_NOT_VERIFIED` and specify how the user can verify. A Google Drive Doc read cannot prove a NotebookLM refresh.

**GitHub Evidence Writer:** updates the Issue with original citation receipt, author-doc revision, tab IDs and sync outcome; persists a coherent versioned KFB Lens export only after source-review, rather than after every minor search. Private Docs file IDs, revision tokens or unpublished source text should be stored in authenticated recovery, not a public Issue where avoidable.

**Independent Research Critic:** audits source attribution/semantic bridge fidelity, missing passages, and whether a claimed completed step has actually happened. **No external factuality or speculation labeling** in author worldview intake. The critic is independent of the editor who changed the source master.

**Production Guard (for actual integrated implementation):** controls `CONTINUE / REPAIR / QUARANTINE / HUMAN_DECISION / STOP` if a future automated integration is authorized. After two non-improving repair passes freeze the smallest defective seam, preserve it, and continue nondependent research; STOP only on evidence of a critical outcome blocker. This paper contract does not appoint an imaginary running Guard.

## 3. Exact one-task input contract

Required:
`task_id`, `github_issue_url`, `author_id`, `question`, `source_scope`, `desired_relation_targets[]`, `target_doc_role`, `target_native_tab`, `cluster_ids[]`, `editor_permission`, `output_type`, `acceptance`.

Optional:
`existing_claim_ids[]`, `do_not_repeat_source_ids[]`, `primary_media_hints[]`, `source_lang`, `min_depth`, `max_time`, `model_provider`, `requested_freshness`.

The task itself must not assume a source answer. Example: **ask whether Metzger explicitly connects receiver-consciousness to Atlantis**; do not tell the research agent this connection is already established. A `NOT_FOUND_IN_SEARCHED_SOURCES` result with the actual inspected corpus is a valid search outcome, not grounds to mark the underlying research question universally false.

## 4. Minimum output artifacts for each research pass

**SOURCE_PACKET_RQ###.md (English):**
- Question, author(s), scope, search date, actual sources searched and inaccessible sources.
- Each source's canonical title, author/speaker, URL, publication date, episode/time range/page and available original words or faithful paraphrase.
- `SOURCE-ASSERTED-RELATION` vs `CROSS-SOURCE-EDITORIAL-COMPARISON` with exact IDs and chain.
- Source-native qualifications, later changes in account, contradictions within an author's own corpus when actual passages support them.
- Specific novel findings, passages not located, source acquisition gaps and one next targeted follow-up question.
- No fixed minimum claim count, invented citations, generic exposition, investigator's opinion on the belief or nonauthor material rewritten as the author.

**SOURCE_INDEX_UPDATE (optional):** additive references linked to already existing author/source IDs; preserve archived originals and duplicate/historical URL references, even if a shorter NotebookLM active list is curated.

**GOOGLE_DOC_RECEIPT (only after actual write):** source-owner Doc, exact modified revision, target native tab ID/title, semantic locations changed, old/new passage IDs, writer, whether source contents were retained.

**NOTEBOOKLM_SYNC_RECEIPT (only after observed verification):** imported author Doc title, selected notebook, uniquely changed phrase or source-record ID, time and observation; otherwise explicit `SYNC_NOT_VERIFIED`.

**ISSUE_COMPLETION:** source review receipt, Docs and Notebook receipts relevant to that task; explicit status, material subsequent gaps. A standalone research search Issue may finish with a packet and a separate write/sync Issue *only if* split intentionally and connected; never quietly change the acceptance contract.

## 5. Persistence and failure semantics

- Do not write to Google Docs if target author master ID/revision or writer authority is unresolved.
- Avoid synchronously editing Google Docs from two LLMs; Gemini may act as sole source-editor while ChatGPT validates and persists evidence.
- A timeout, interrupted app call or absent response is **UNKNOWN**, never `DONE`. Inspect exact GitHub Issue/commit or Google Docs revision before retrying.
- After every actual GitHub write, fetch exact branch head and the intended file/Issue; a saved Research Packet without a corresponding verified Google Docs edit is still `SOURCE_PACKET_READY`.
- Preserve all source IDs even when NotebookLM removes generic landing pages or duplicates: active-source pruning is not corpus deletion.
- Retry source-finding with new search terms/platforms only while the evidence frontier is improving. After two non-improving attempts, preserve searched corpus and focus on other author/task seams. Never manufacture an intervening bridge.
- Source author words and KFB comics remain separate. The Player-facing Clown can stay in character, but research provenance lives in the distinct author record and optional out-of-scene drawer. Existing Card/Resident/ChatterBox/Audio remain game owners.

## 6. Minimal sample Research Agent / Gem system brief (copyable)

> You are the **KFB Source Research Executor**. Accept exactly one GitHub `RQ-###` research task per run and retrieve the current task plus the current KFB Editorial Research source rules. Search independently for the named authors' original interviews, talks, podcasts, essays and books. Reconstruct only what each author says and the links each author actually makes, preserving their expressed certainty, doubt, humor and source dependencies. Do not impose outside speculation labels, debunking, belief scoring or content exclusions. Keep guest/interviewer and researcher-authored interpretations distinct. Provide a concise English `SOURCE_PACKET_RQ###` with original URLs, speakers, dates and timestamps/pages, faithful quotations when verifiable, typed author-to-author connections and an exact search-coverage/gaps section. No creative source bridges. Do not claim you updated Google Docs, NotebookLM or GitHub unless an authorized write tool actually returned and you verified the resulting target revision/Issue. Where authorized, propose a small additive change to the correct existing author Doc's in-body Source Ledger; otherwise output only the patch for review. Finish with one precise next source question. No new runtime, Site, Card database or workflow daemon.

## 7. No duplicated routing / resources

Use `RESEARCH_BACKLOG_R1_2026-10-13.md` for research-question identity/reference and GitHub **Issues** for mutable execution state. The existing `LIVING_HIDDEN_COSMOLOGY_ATLAS_v0.2.md` remains the research SSOT, `MULTI_DOC_AUTHOR_WORLDVIEW_NETWORK_WORKFLOW_R2_2026-10-13.md` remains the author-document topology, and `WORLDVIEW_PERFORMANCE_SITE_CONCEPT_R1_2026-10-13.md` remains the future downstream consumer concept.

Do not touch main KFB Hub/router or Cloudflare merely to record a research TODO. No automatic scheduling, model API costs, Site construction, merge or Live promotion is authorized by this design.

**ONE NEXT GATE:** `RESEARCH_BACKLOG_RQ001_SOURCE_PACKET` — source-check a narrow Kurt Metzger institutional-cult-to-media claim bridge and produce an attributable Source Packet for GitHub Issue #395, then offer it to the authorized Google Docs editor.
