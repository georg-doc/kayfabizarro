# TEST REPORT · Source and relationship atlas R1 · 2026-10-24

Status: **STATIC/PROVENANCE QA ONLY — NOT INDEPENDENT HISTORICAL VERDICT**.

## Tests executed within GitHub-connected Web Chat
- PASS 1: Source inventory parsed to **20** unique CH-S## IDs (CH-S01–CH-S20); count is source/lead references, not full-text reads.
- PASS 2: Atomic-claim matrix parsed to **15** unique CH-C## IDs (CH-C01–CH-C15).
- PASS 3: **19** historical/documentary typed edges validated to have 10 metadata fields (ID/from/to/type/source IDs/rationale/time/status/counterevidence/falsifier).
- PASS 4: **7** Warburg/conceptual typed edges validated to have 7 fields, explicitly flagged `causality:false` in delivered document.
- PASS 5: **45** edge-to-source references checked; **0 unresolved** source IDs; remaining research questions explicitly not presented as established causal edges.
- PASS 6: Explicit separations for source custody, uninspected original archives, and unavailable image verification in source ledger; no KFB card-owner writes.

**Static checks: 6/6 PASS**, scoped to in-memory ledger/relations structure at preparation. **No independent historian critic**: 0. **Unit/code/game tests:** 0 (no code changed). **CI:** 0 expected, not run. **Browser UI / Stage / Live:** 0 (research-only; no route required). **Source reading completeness:** 0 entire books, 0 entire archival original corpora.
**Images actually viewed from PDFs (UNIQUE pages): 4 total**: 1926 Charter conformed PDF index1 (1); Peter Grose CFR PDF index23 and38 (2); 2025/26 Chatham Annual Review PDF index7 (1). Repeated screenshots of those pages were not counted twice. Gold Taskforce and Cambridge article screenshot requests errored (Gold cache miss / Cambridge tool error); **0** image-verification for those PDFs. Some selected PDF text/pages and HTML articles were read; no claim of full-document reading.
**Original files referred to by scholarly endnotes but not opened:** CHA 9/69b, CHA 9/96b, TNA T312/1015, TNA T312/1016, UK 1920 association minutes, CFR 1919/1921 incorporation originals, Rockefeller project grants and 1939 Bowman letter.
**Source publication vs event date:** 2019 charter conformed copy describes 1926 charter; 1996/2006 CFR history describes 1919/1939–45; 2023/24 Seidel article describes 1965–66; FY2025 UK charity accounts distinct from FY2026 Chatham roster; 2026 annual report self-reports 2025/26 activities.
**Authority guard:** PR #408 on another branch is research protocol donor, not merged canon; this source-only branch is a proposal. No GitHub production branch, deployed Site, card DB or artwork modified. No file hashes for downloaded source PDFs measured (not stored in local runtime).

## Gate outcome
**Research source atlas candidate is structurally ready for Draft PR review**, not approved as factual canon. ONE next source-gate: verify original Camps meeting documents CHA 9/69b and UK TNA T312/1015 against Seidel's cited account.

## Validation ledger
- Historic edges: 19; noncausal edges: 7; sense-object rows: 6.
- Statements of source evidence versus interpretations are tagged; count conflict 682 vs 670 retained.
- Actual GitHub commit/ref/file readbacks listed in PR and final Return (verified per file after writes).
