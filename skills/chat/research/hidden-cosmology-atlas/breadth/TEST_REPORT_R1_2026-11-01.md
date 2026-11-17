# Breadth batch AB01 — evidence and test report

Date: 2026-11-01. Result: **PASS for bounded source-lead corpus and read-only navigation**, not a complete worldview/history audit or Site release.

Input: `7b9afcfb38993589c6110d77eeeb32cec89d54aa`. Inventory checkpoint: `789c9aa37e5608d1fb23cb45e08ad756059048c5`. Source snapshot: `267e2ea50cf333c1d87d55c4970ee6ac0ec72214`. All in `georg-doc/kayfabizarro`, `research/hidden-cosmology-atlas-2026-10-13`, open Draft PR #394.

## Actual output

- Eight new author masters: Jacobsen, Hunt, Simpson, Scott, Puharich, Swann, Brown and Tesla. Sixteen total author-master files, with the original eight retained.
- 43 source records: 13 postwar, 10 psi/invention, 8 institution, 12 Solari. These include catalogs, parsed excerpts, publisher summaries, search-index-only records and unavailable leads. This is **not 43 complete originals read**.
- 35 scoped claims; 12 documentary publication/bibliographic/institutional relations and 8 explicitly noncausal comparisons. No new funding, criminal-connection or secret-command relation.
- 30 open questions, three per existing cluster. C03/C05 and much of the journalism expansion remain source-gap agendas, not completed case investigations.
- Additive Fitts/Farrell/Liszt source links and bounded C08–C10 institution note. R4's 140 candidate census is not overwritten or presented as 140 researched profiles.

## Executed checks

`validate_breadth.py` passed after resolving the FRUS work alias to `source/PW-S06`: unique source/claim/edge/entity/question IDs; all 40 edge endpoints resolve; source and claim references resolve; all 20 edges explicitly noncausal; valid input Git pins; exactly three questions in each of ten clusters; all eight dossier files exist and contain at least 300 words; targeted private-path/document-link/credential-marker scan on new material. Checks include the two Solari regression cases below. The script's source snapshot is now the immutable source commit above.

Existing Fitts/Farrell/Liszt file bodies are byte-for-byte prefixes of the expanded masters. Current author directory was re-read immediately before source persistence: all eight new paths absent, original eight present. No WCC/JM ledger, private source, Site file or Notion object was changed.

GitHub exact readback: inventory file **1/1 exact**, then source milestone **21/21 exact**, with branch heads matching their created commits. The final index/report/Return checkpoint is separately read back by the integrator; its resulting commit is supplied in the chat handoff rather than self-embedded in its own content.

## Independent review and repairs

[Independent source review](independent-review.md) sampled Tesla patent text, Puharich publisher/introduction scope and Solari passages; [Production Guard](production-guard.md) independently checked institutional and Solari claims. Their reports preserve inspected scopes and candidate fingerprints. Both accepted repair readback; unexamined records are not blanket-promoted to verified.

1. SOL-S07/E02 now distinguishes the April 27, 2017 interview/header date from June 20 public availability. Publication date remains unspecified.
2. SOL-C05 identifies FASAB as the standard issuer, not Fitts as speaker. SOL-C01 explicitly preserves Skidmore/Fitts coauthorship.
3. Institutional source pins and Solari scope/identity/access fields are present. England is a proposed separate legal-body context node.
4. `author/<slug>` transport aliases resolve to existing census slugs. Work endpoints use `source/<sourceId>`; the FRUS alias is normalized accordingly.

## Remaining limits and next gate

No complete books read; no audio listened; no financial transaction independently verified. OIG direct page/PDF access returned 403 and remains search-index scope. Solari's unavailable correspondence/key-documents bodies remain leads. The previous failed-write recovery artifact was unavailable; the new packet is a fresh reconstruction. No Webb.io provider connection tested. No newly sourced private text published. Source scans and passage reads are not original-document authentication.

**Next gate: `ATLAS_BREADTH_CORPUS_BATCH_C_02`** — source-led journalism and remaining author intake, beginning with one Webb/Goodwin article → actually read original document → independently sourced counter/explanation chain. Keep the existing Site a downstream reader; no Site release or mass Notion migration is authorized by this research checkpoint.
