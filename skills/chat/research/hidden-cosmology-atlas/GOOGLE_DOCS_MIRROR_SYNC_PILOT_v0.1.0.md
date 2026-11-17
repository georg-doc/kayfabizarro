# WorldView Google Docs Mirror Sync Pilot v0.1.0

**Date:** 2026-10-13
**Status:** `GOOGLE_DOCS_IN_PLACE_WRITE_VERIFIED` / `NOTEBOOKLM_SOURCE_SYNC_UNVERIFIED`
**Owner:** Existing `georg-doc/kayfabizarro` editorial research branch `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394
**Research source truth:** Original interviews/books; **editorial write master:** existing GitHub Markdown `authors/kurt-metzger.md`
**Purpose:** Prove existing Google Docs can accept a small revision-guarded, additive metadata update without creating a new document. NotebookLM verification is a distinct consumer gate.

## Exact bounded pilot

- Google Docs title: `KFB Author Dossier: Kurt Metzger (Updated & Consolidated)` (historical title preserved for compatibility, not an approved status label)
- Verified document URL: https://docs.google.com/document/d/1Se9B_9kvDhFUJFjEYGfn7yrplcAwOC2pHyfThUuP3Xk/edit?usp=drivesdk
- Native doc ID: `1Se9B_9kvDhFUJFjEYGfn7yrplcAwOC2pHyfThUuP3Xk`
- Actual tab: `Tab 1`, `t.0` (no other native tab proved)
- Pre-write revision: `AHj4eMQzCFfnYVqXebrL26vdDSowj1bn7pc3gtV8f8cHFMP4CjxJkTu12dYWd6NTJKDYZztL3dBfWJptKX7xviAloCJGdSEOH5OpuwZG-fE`
- Actual Google Docs API write: `documents.batchUpdate`, one `insertText` at the existing tab's `endOfSegmentLocation`, guarded by `requiredRevisionId` to reject concurrent edits.
- New revision from provider: `AHj4eMQJkl6it1BAvoqOiYVznOBN3rai52YvlI1qLYvvY7YGNDPpMqU15A1ai7gQL1XewqihGtqCBvU4A4MMOcFZXs3mOK1HUt4uCsxBNE0`
- Unique technical phrase: **`WV_DOC_SYNC_20261013_01`**
- 794 inserted characters including newlines; pre-write 4,069 extracted text characters; post-write 4,863; 30 → 38 extracted paragraphs.
- Verified after write: exact marker appears **once**, existing source body's ending remains present, original content was not replaced, no Google Doc copy was created.
- Existing GitHub author file at pilot start: `skills/chat/research/hidden-cosmology-atlas/authors/kurt-metzger.md`; blob `19163e6f13f117dd0dbfdce2e67d1bbb23addfbc`; dossier `content_version: 0.2.0`.
- The appended Google Docs note explicitly disclaims a content equivalence claim: the Doc still contains the preserved Gemini donor (including creative/performance material), not a byte-identical rendering of current source-only GitHub research. **This is a connector write test, not an actual whole-document mirror reconciliation.**

## NotebookLM consumer check — not yet tested

The supplied notebook is `Dark Journalist Underground & Political Commentary Network`. The Google Drive connector reads Docs/Drive **but does not expose NotebookLM source inventory or actions**. No author document was programmatically imported into NotebookLM and no refresh was invoked in this slice. Do not say NotebookLM sync succeeded from Google Docs' new revision alone.

**Human / browser check:**
1. Open the intended NotebookLM notebook.
2. Verify the current exact Drive-origin author source is the **same Google Doc**, not an older duplicate or a GitHub Web source snapshot.
3. If present, run the NotebookLM `Sync with Google Drive` control (or let its documented Drive-source auto-refresh complete).
4. Query the exact phrase `WV_DOC_SYNC_20261013_01` using the selected source, or inspect the imported source text.
5. Record whether it appears, source title/type/identifier and time; only then mark `NOTEBOOKLM_SYNC_VERIFIED`.
6. If missing, mark `SYNC_NOT_VERIFIED` / `SOURCE_NOT_PRESENT` / `STALE_SOURCE` and do not create another Doc or delete current NotebookLM sources without inventory and explicit source reconciliation.

## Claude Code implementation / QA handoff

Claude Code must **reuse this exact existing GitHub owner**, not introduce a separate WorldView storage runtime or new Google Docs editor. The next source-safe integration can be a one-way `GitHub-reviewed Markdown → read-only Google Docs mirror`, but must first inspect the current Google Doc's content and reconcile differences from the GitHub research-only author master.

**Acceptance plan:**
- Inventory repo branch/head, source author's version, existing Google Doc ID/revision/native tabs and whether Google Doc contains KFB creative/historical material.
- Plan a patch that **does not replace all Doc text**; keep source donor archive and explicitly mark generated content as a mirror, with the Git commit and content hash.
- Avoid duplicate editable masters: changes originate in GitHub, and Google Docs is a **generated consumer**.
- Use scoped `batchUpdate` with `requiredRevisionId` and readback; never silently overwrite a concurrent Google/Gemini edit. On timeout, inspect document revision/marker before considering retry.
- Test stable source ID and single-author NotebookLM Drive import/refresh separately; a document link or metadata-only change is not proof of a synced notebook source.
- Verify original author source passages before promoting Gemini summaries to worldviews; no invented KFB performance, Cards, Triplets, Borromean Dice or author quotations in the source-only exported mirror.
- Reuse source-specific plugins only when installed and authorized; no new Site/GitHub Pages/Cloudflare public route for this document-only experiment.
- If a future non-KFB project uses the bridge, it supplies its own GitHub project/source master and its own Google Docs mirror; never hardcode the KFB namespace in a generic implementation.

**Recovery requirements:** Save exact repo/branch/PR/head, GitHub changed file roster, actual Google Doc pre/post revisions, marker, source contents preserved, NotebookLM result or explicit no-access, one next gate. Do not merge or promote Live.

**ONE NEXT GATE:** `NOTEBOOKLM_DRIVE_SOURCE_MARKER_CHECK_v0.1.0` — observe the unique probe phrase inside the intended NotebookLM Drive-linked source, or record an explicit failed/stale/unavailable result. The GitHub-to-Docs full mirror remains unimplemented pending this check.
