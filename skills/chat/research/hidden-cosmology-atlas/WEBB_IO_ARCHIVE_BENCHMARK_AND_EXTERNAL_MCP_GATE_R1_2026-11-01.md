# KFB Research Atlas · TheWebb.io Archive Intelligence Benchmark + External Provider Gate R1
**Date:** 2026-11-01 · existing Atlas Editorial Research owner `georg-doc/kayfabizarro` / `research/hidden-cosmology-atlas-2026-10-13` / Draft PR #394. **Status:** public WEB/PUBLISHER RESEARCH + SITE/WORK DESIGN DONOR, NOT integrated provider, NOT a new source SSOT. No new Site publication, API contract or credential tested.

## 0. Important identity disambiguation
[TheWebb.io](https://www.thewebb.io/) is **NOT Whitney Webb / Unlimited Hangout**. Its [About](https://www.thewebb.io/about) explicitly explains it was **named for Gary Webb**, whose `Dark Alliance` work on Contra-era CIA/drug allegations inspired the team's research approach. Whitney Webb's investigative publishing hub is [Unlimited Hangout](https://unlimitedhangout.com/), a *separate entity and editorial/source donor*. Do not merge these identity nodes, authors, bylines, systems or data licenses.

## 1. Observed publisher claims (not independent product performance QA)
Actually retrieved publisher-page indexed text from `thewebb.io/` and `thewebb.io/about`; direct rich browser HTML open returned no readable body on this surface. **No private signed-in app, source PDF page click, API/MCP session, upload, payment or browser interaction tested.**
- Landing page advertises **35 public archives**, **1,575,415 documents** / **6,269,639 pages**, **5 subjects**. These are current vendor-supplied figures, NOT independently counted. About page separately enumerates **8 major datasets** plus later October cases; this is a different aggregation/snapshot, not proof that one specific number of files has been externally verified.
- Advertises preprocessed archived original scans → OCR/text → named person/place/organization entity extraction/dedup → hyperlinked page citations and cross-archive exact + semantic search, **more than 100 searchable languages**, per-archive guides, an exploratory **canvas** with entity maps, and bringing one's own dataset.
- About explicitly says **developers can connect their tools "over MCP"**. This is **capability advertised**, but **no public exact MCP endpoint, authenticated API schema, invocation scope, export formats, provenance metadata, batch/data access, licensing or rate limit was verified** in this turn.
- Advertised consumer subscription **$5 first month, then $20/month** (vendor landing display on read date); not a contractual guarantee, access tier reviewed or quote for API/MCP/dataset upload.
- Core story uses a Gary-Webb-inspired "citations back to the page" model. Avoid conflating with the `whitney-webb` author node already present in Atlas.

## 2. What to benchmark against the *existing* private KFB GPT Site
| Vendor-facing capability | KFB need / provenance check | State of comparison |
|---|---|---|
| Public source-library search, text + concepts | Multi-source author/claim/organization/chronology query, locale-sensitive names, quote/page lookup | PROPOSED: current KFB Site R1 is pinned limited JM source/claim case |
| OCR/page-addressable source citations | Quote opens **exact** original document + page / scan overlay, with image vs text-only reading status | PROPOSED: Webb self-claim; KFB provenance stronger when explicitly tracks actual read status and contradictory originals |
| Entity disambiguation | People vs organizations, near-name collisions, dates, byline vs guest vs holder, multiple source roots | R4 Atlas has actual identity split/audit donors; no KFB multi-corpus extraction runtime |
| Canvas maps and entity network | Progressive ego-graphs, documentary vs author-assertion vs Warburg concepts, chronological field navigation | PROPOSED: no evidence of adopted source-proven Webb visualization UI or downloaded client component |
| Dataset upload and preparation | Private Dropbox/Drive originals in **authorized Work**, without publishing restricted/licensed content to external vendor | CONTRACT/PRIVACY GATE ONLY; **no private upload authorized** |
| MCP / provider access | Potential external original-library connector for Work to request answer + **source document page links** + provenance receipt | `UNVERIFIED_PROVIDER_API`, no actual external connector currently linked to this workflow |
| Proof/export | Recover cited source IDs, original document URL, printed/PDF page, deduplication, original metadata and use rights | CRITICAL: no verified raw document export, bulk rights or evidence provenance API |
| Edits, contradictions and revisions | KFB GitHub source owner, independently reviewed claim/edge, version/falsifier/agent history | KFB's intended editorial specialization, NOT an established Webb product feature |

Do **not** try to recreate 6M-page index in KFB Web browser. Webb (if proven) is an **external search/source-recovery provider**, not our full corpus editor, NIE runtime, versioned correction master or authoritative historical claim database.

## 3. Proposed minimal integration architecture
`KFB Site source question / Work prepared task → explicitly permissioned *TheWebb provider adapter* (via documented MCP/API when available) → normalized search hits + original page URL + issue/page/edition + extraction uncertainty → KFB source-intake REVIEW → existing GitHub source/claim/edge SSOT → read-only Site/Notion/graph projection`.

The adapter does **not** automatically promote an answer cited by TheWebb to a verified historical event; it should fetch/inspect the **original cited document** itself where rights and public access permit, reconcile scan/OCR and check contradiction. Count multiple vendor hit pages from same FBI file as **one underlying source** where appropriate. Log separate `providerAnswerId`, `providerDocumentId`, actual original issuer, `sourcePageLink`, `sourceReadStatus`, content reuse permission, `originalSourceRootId`, `researchRunId`, `sourceGitSha`. Never treat a loaded URL or provider confidence score as proof a page scan was actually inspected.

**Privacy:** never export user's private NIE corpus, personal Google Docs, licensed Solari subscriber PDFs or Dropbox files to thewebb.io without an explicit separate transfer/rights/consent gate. Connection or vendor pricing claims do not confer permission. Existing private GPT Site does not inherit ChatGPT tool connections. No unauthenticated client-side API token.

## 4. Narrow proof-of-capability gate for a later Work technical audit
Before considering adoption, separately verify:
1. Official provider's current public MCP **endpoint, protocol and authentication**, exact advertised tool schemas and allowed datasets and query limits. If not publicly discoverable, return `SPEC_NOT_AVAILABLE`; no fabricated MCP server URL.
2. Read-only sample on **public** FBI-Vault / other public archive already within vendor's library, test 3 hard-to-distinguish people/organization aliases and one full citation original page. Document whether the exact original is accessible and what metadata the provider actually gives.
3. Search another public archive for a contradicting/qualified statement, test same underlying source root, cross-language query and site-linked extraction.
4. Check export permission: page citation-only, raw extracted text, source file/download, batch, derived graph edge or none; cost/scope and retention terms. A provider might support UI search but not programmatic database export.
5. Compare with existing native KFB GitHub/Notion/Web discovery in **one bounded question**. Only integrate if improved evidence retrieval and licensing make sense, not for visual imitation.
6. Capture exact provider request/response receipts, authentic pages and access statuses. No promise of integration before successful connector documentation/tests.

## 5. Existing receiving owners and priority
- Research editorial owner: current GitHub Hidden Cosmology Atlas source ledgers and existing WSA breadth-first author/claim research assignment.
- Site owner: **existing private** `https://kfb-research-atlas.frizzlebob.chatgpt.site/`, earlier R1 behind-login proof still awaiting exact authenticated check. **Update in place**, no second Site.
- Adjacent journalistic source author `authors/catherine-austin-fitts.md` and Whitney Webb `whitney-webb` source role are **not to be merged with the Webb software brand**.
- Preserve main author pipeline priority `ATLAS_BREADTH_CORPUS_BATCH_AB_01` (Solari/Fitts source corpus can be one source-rich test). **External Webb MVP evaluation is optional, later, separately authorized**, not a new urgent WSA rabbit hole.
