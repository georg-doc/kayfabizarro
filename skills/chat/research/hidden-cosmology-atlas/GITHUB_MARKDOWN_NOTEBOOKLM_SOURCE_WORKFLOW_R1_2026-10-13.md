# KFB Hidden Cosmology Atlas — GitHub Markdown ↔ NotebookLM Source Workflow R1

**Date:** 2026-10-13  
**Status:** USER-PREFERRED AUTHORING TOPOLOGY / FOUR GITHUB-DERIVED SEEDS COMMITTED / NOTEBOOKLM WEB-URL UPDATE NOT YET VERIFIED  
**Owner:** Existing KFB Editorial Research, `georg-doc/kayfabizarro`; existing research branch `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394  
**Language rule:** Everything generated for KFB, author files, metadata, research prompts, source packets and game scripts in English; direct user chat in German.  
**No action claim:** The source URLs have not been imported into the user's NotebookLM; no automatic URL refresh, GitHub Pages, Cloudflare, new GPT Site, game runtime or autonomous agent was implemented in this documentation slice.

## 1. Revised authority split

Georg elected a GitHub-first research authoring approach to avoid document duplication and manual rewrite/copy-paste. The existing research source `skills/chat/research/hidden-cosmology-atlas/` remains the **single GitHub research owner**:

- **Original interviews, transcripts and publications:** primary source truth for what a speaker actually says.
- **GitHub Markdown files** under `authors/`: versioned, reviewable, author-specific KFB worldview dossier masters **after this migration is reviewed**. They hold source-derived positions and separately framed KFB performance material; never fabricated real-author quotes.
- **GitHub Issues**: mutable research-question execution and acceptance. The existing `RESEARCH_BACKLOG_R1_2026-10-13.md` is the durable issue index; no replacement backlog elsewhere.
- **NotebookLM / Gemini:** selectable research consumers of approved author Markdown **if their public Web-source import works**. NotebookLM does not own editorial authoring and cannot rewrite the GitHub master. It may hold independent primary works and return new research proposals.
- **Google Docs:** historical Gemini-authored original donor documents and currently reliable Drive-sync fallback. Do not delete them or run concurrent edits after GitHub authoring migration is accepted. Do not create one new Doc per small Markdown change.
- **KFB Production Control:** authenticated research Return, source provenance and crash recovery; not a new creative runtime.
- **Proposed KFB GPT Site:** downstream fictional Resident Worldview-Performance editing/QA, not a second Card/dialogue/voice/knowledge owner.

**One active authoring home per author** is the target. The previous Google Docs multi-author-tab and multi-doc ownership decisions are **superseded only regarding the editable master**. Their source-native fidelity and typed conceptual-relation requirements remain binding.

## 2. Four initial author files actually created

Existing initial research records:
- `authors/kurt-metzger.md` — Metzger portion of original mixed Golden Test Doc, with shared KFB fictional Clown instructions; originally not a standalone Kurt Google Doc.
- `authors/catherine-austin-fitts.md` — faithful Markdown transformation of the author's existing Gemini Google Doc.
- `authors/david-icke.md` — faithful Markdown transformation of that existing Gemini Google Doc.
- `authors/daniel-liszt.md` — **editorially condensed derivative**, NOT a line-by-line transformation of the separate Google Doc; original Google Doc preserved as donor.

`authors/README.md` records the source role, migration completeness, remaining source ledger gaps and one next gate. **These are Gemini-dossier seeds, not original-source-certified author profiles.** The original Docs did not contain atomic primary URLs, speaker timestamps or exact book-page evidence. No themed source material is excluded at ingestion and no outer epistemic/debunking labels are added; only original-source provenance/author attribution is tracked.

Further original seven-author roster members **Michael Wann, Jason Reza Jorjani and Joseph P. Farrell** remain research intake, not invented profile files.

## 3. NotebookLM Web vs Drive — explicit product capability distinction

Google's official help, checked 2026-10-13:
https://support.google.com/gemininotebook/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en

- **Web URL import**: Google states that only the **HTML webpage's text** is scraped. Nested pages, visual assets and embedded videos are not imported.
- **Markdown**: direct `.md` file upload is supported as a source type, but that is an upload/snapshot, not documentation of automatic future GitHub commits updating the file in NotebookLM.
- **Google Drive source**: the help separately describes periodic/automatic refresh and **`Click to sync with Google Drive`**.
- **Therefore:** Gemini's statement that a GitHub `raw.githubusercontent.com/...md` or GitHub `blob/...md` Web source definitely provides live "Source refresh" on each new commit is **NOT VERIFIED** and must not be documented as a product guarantee.
- **Raw GitHub Markdown**: text/plain response may not be treated as an HTML webpage by URL-import. **GitHub blob** is an HTML page and may expose GitHub page chrome as well as the file text. **Neither route is accepted until a user-visible NotebookLM import test proves exact content and subsequent update behavior.**
- **Stable branch URL vs immutable commit URL:** for a change-propagation experiment use a single branch URL, not one pinned commit SHA. A pinned SHA is useful for provenance but intentionally cannot change; the shared URL needs a separate revision receipt.

**No Site/Pages substitute.** GitHub Pages is not a KFB final public game acceptance surface and is not commissioned merely to support a research NotebookLM import.

## 4. Testable import → change → refresh Golden

**Pilot:** use just `authors/kurt-metzger.md` from the existing research branch (or a smaller disposable GitHub experiment file under the same research owner if source importer constraints require one). Do not assume the branch URL is publicly reachable until checked at the exact requested URL.

1. In NotebookLM, add **Website / Web URL** using the GitHub **HTML blob** page, observe whether it accepts it. Confirm exact title, ontology phrase and a distinctive citation/provenance passage from the source text. If rejected or GitHub chrome dominates, record `WEB_IMPORT_UNSUPPORTED`.
2. If the blob fails, separately attempt the **raw Markdown** URL as a distinct source input. Google help says webpage HTML only; raw success is an experiment, **not** a supported automatic-sync contract.
3. If a source imports with correct content, note NotebookLM's displayed source text and import date. Then make an **authorized version-only change** in the same GitHub file, e.g. append `IMPORT_SYNC_PROBE_2026_10_13_R1` as unambiguous metadata (not a claim about the author); verify exact branch HEAD and content.
4. Open the same NotebookLM source and look for a manual refresh control, if present. Reopen the notebook and query the exact probe phrase. Record **`UPDATED_EXISTING_SOURCE`** only if the newly committed phrase appears without source deletion/re-add. A newly reimported source is instead **`REIMPORT_REQUIRED`**. Neither result was tested or predecided here.
5. If there is no supported dynamic refresh, choose one transparent supported fallback:
   - manually remove/re-add the source at coherent editorial checkpoints, preserving source IDs and a refresh receipt; or
   - keep a Google Docs **read-only generated mirror** fed from reviewed GitHub Markdown by an explicitly authorized API integration, then use the documented Drive sync. That mirror must never become a second independently edited master.
6. Do not switch all author sources or archive the original Docs until the pilot is accepted. Store exact source URL, import excerpt, tested commit HEAD, refresh action, NotebookLM content readback and observed result in GitHub Issue/research Return.

**Important acceptance difference:** a web tool returning a `Cache miss` when fetching a new GitHub branch link is not evidence of NotebookLM failure. Only direct NotebookLM import/refresh evidence can settle NotebookLM behavior.

## 5. Research agent and backlog migration

The current GitHub Issues and `RESEARCH_BACKLOG_R1_2026-10-13.md` remain intact. **Issue #395 / RQ-001** still asks for Kurt Metzger original-source references and remains open.

`AUTONOMOUS_RESEARCH_PIPELINE_CONTRACT_R1_2026-10-13.md` remains a useful historical transport flow but its **single authorized writer now patches GitHub author Markdown**, not Google Docs, after reviewer approval and source receipt. The default new flow is:

`GitHub Issue → original source packet → attribution/editorial review → GitHub Markdown author master update → commit/branch/file verification → NotebookLM refresh/reimport if supported and witnessed → Issue source+consumer receipts / close`.

The agent cannot close the issue based only on a generated text paragraph. Original source IDs/quotations remain traceable; KFB performance is a separate adapter. After an actual GitHub write, fetch branch HEAD and changed file; interrupted writes are UNKNOWN until ref inspection.

No connected autonomous Gem or Perplexity executor has run. Do not schedule unattended research without a separately authorized recurrent/triggered task. No bulk GitHub issues/status churn and no automatic merge.

## 6. Decisions and remaining work

- **HCA-047 — GITHUB_AUTHOR_MASTER (USER DIRECTION):** Prefer GitHub Markdown for authoring; preserve the historical original Google Docs as source donors and a temporary NotebookLM Drive-sync fallback until tested.
- **HCA-048 — NO_UNVERIFIED_GITHUB_SYNC:** The documented web-URL HTML scrape is distinct from Google Drive synchronization. Treat automatic GitHub URL update claims as an open product question, not completed acceptance.
- **HCA-049 — FOUR_INITIAL_MIGRATION_SEEDS:** The first four source-derived author files are created with exact migration provenance. Three fuller copy transformations; Daniel Liszt is condensed due to an uncompleted full-copy write. Original source donor remains intact.
- **HCA-050 — SINGLE_OWNER_AND_TASKS:** Reuse the existing research branch/PR, Backlog/Issues, source corpus, Resident/ChatterBox and prospective Site boundaries; do not make a second project route.
- **HCA-051 — CONTROLLED_CONSUMER_TRANSITION:** Keep original Google Docs available to NotebookLM until one exact link's import and update behavior is actually verified. No new Site built.

**One next gate:** `GITHUB_MARKDOWN_NOTEBOOKLM_URL_GOLDEN_R1` — perform an in-NotebookLM exact import/readback and post-commit update test on one GitHub author Markdown source; if dynamic web refresh is unsupported, preserve explicit reimport or an authorized GitHub→Drive mirror as the operational fallback.
