# Independent source and fidelity review

Reviewer: `/root/reader_review` · Date: 2026-11-01 · Production/GitHub writes: 0.

**Route: CONDITIONAL PASS as bounded source-lead intake; REPAIR two integration seams before graph promotion.** This is a sampled fidelity review, not verification of the authors’ larger historical or empirical propositions. The reviewer did not edit the reviewed drafts. Institution coverage is excluded because this reviewer authored it.

## Scope and checks

Read `nikola-tesla.md`, `andrija-puharich.md`, `psi-source-receipts.json`, `postwar-profiles-receipts.json`, and `solari-intake.json`/`.md`. Parsed all three JSON packets. Within each packet all IDs are unique and every claim/edge `sourceIds` and `claimIds` reference resolves (BPS: 10 sources/11 claims/8 edges; PW: 13/11/5; SOL: 12/5/3). A targeted scan of these six files found no local user paths, Dropbox links, private Notion/Drive URLs, passwords, or API-key markers. This is a bounded leakage check, not a comprehensive security audit. Existing JM references are explicitly reused external records, not newly inspected evidence.

## Independently reopened evidence

- [Tesla US685957A](https://patents.google.com/patent/US685957A/en): metadata gives filing 1901-03-21 and publication 1901-11-05; the OCR specification describes the conductor/condenser/discharge apparatus. The draft correctly treats the patent as a technical disclosure, not proof of working performance, suppression, or intelligence links. Original scan not visually inspected.
- [Beyond Telepathy publisher excerpt](https://www.simonandschuster.com/books/Beyond-Telepathy/Andrija-Puharich/9781644116906): the excerpt is explicitly Mitch Horowitz’s new-edition introduction. His statement that he lacks access to Puharich’s records and cannot verify the findings appears in its early paragraphs. The dossier’s separation of introduction, promotional description, historical book, and unverified empirical claims is supported. No full book or audio reviewed.
- [Missing Money May 2020](https://missingmoney.solari.com/missing-money-update-may-2020/): title/byline/date and opening paragraphs support coauthorship and preliminary interpretation. The 170 adjustments are presented as part of the $6.5 trillion figure, not an additional cash amount. The text itself describes incomplete explanations and repeated entries. SOL-C01 appropriately attributes the possibility of unrecognized spending/debt to the authors rather than reporting stolen cash as established.
- [Dark Journalist episode page](https://darkjournalist.com/s-fitts17.php), header, and [Solari Archived Events](https://solari.com/archived-events/), 2017 Empire Endgame entry: the first displays April 27; the latter explicitly separates interview date April 27 from public availability June 20. This reveals the date-field repair below.
- The official OIG indexed result for DODIG-2016-113 was independently inspected: its summary/footnotes concern unsupported journal-voucher adjustments, unreliable statements and noncumulative quarter/yearend amounts. This was indexed text only. No direct original OIG PDF or underlying transaction records were reviewed. SOL-S04 must retain `SEARCH_INDEX_TEXT_ONLY_DIRECT_403`; it must not become an original-PDF-read receipt.

## Required repairs

1. **SOL-S07 / SOL-E02 date semantics:** currently `publicationDate: 2017-04-27` and `eventDate: null`, contrary to SOL-C03/S10’s explicit distinction. Set interview `eventDate: 2017-04-27`; retain the publisher header date separately. Use `publicAvailabilityDate: 2017-06-20` with SOL-S10 provenance; publication date may remain unknown unless its meaning is explicitly defined. April 27 must not silently serve as the online publication date.
2. **Entity IDs at integration:** BPS uses `author/nikola-tesla`, `author/andrija-puharich`, and `source/BPS-S01` forms while PW/SOL use bare slugs. Normalize through an explicit canonical map or declare those node IDs in the merged registry. The local source/claim joins pass, but graph endpoint closure has not yet been demonstrated. Do not manufacture duplicate author nodes.

## Source boundaries and disposition

Tesla and Puharich narrow attributions: PASS within the stated metadata/OCR/excerpt scopes. Postwar packet: PASS for internal references and cautious source-scope language; no independent reopening of its book/review/policy sources in this sampled review. Publisher descriptions remain claims about what books argue; catalog entries remain bibliographic leads. Neither qualifies as reading the entire book or corroborating its assertions.

Solari: conditional PASS after date repair. Indexed-only OIG, unavailable SOL-S12, search-only correspondence SOL-S11, and public index/description sources must preserve their distinct access states. No subscriber content, audio listening, complete financial audit, cash-loss measurement, or transaction proof is asserted. Host/guest appearance is not endorsement. No unsupported financial/control allegation was promoted by the sampled claims.

Do not bulk mark the corpus historically verified on the strength of this review. Record this reviewer as a bounded independent source/fidelity check and retain original access receipts. Next gate: Builder repairs the date fields and proves canonical endpoint closure, then Guard may CONTINUE integration as visibly scoped research leads.

## Repair readback acceptance — 2026-11-01

Independently read the Builder's prepared `breadth/publish/breadth/solari-intake.json` and `psi-source-receipts.json`. SOL-S07 and SOL-E02 now correctly encode interview event date 2017-04-27, unknown publication date, and public availability 2017-06-20 with SOL-S10 provenance. The publisher header date is preserved separately. SOL-C05 now identifies FASAB as the standard issuer rather than Fitts. The coauthored Solari interpretation retains both authors. All eight BPS relation endpoints now use bare canonical author slugs, with `source/BPS-Sxx` explicitly reserved for work nodes.

**Repair acceptance: PASS. Guard route: CONTINUE preparation/integration as bounded source leads.** Final merged endpoint closure still belongs to the Builder's deterministic validation: the retained work-node IDs must actually appear in the registry. This readback does not upgrade inaccessible sources, verify financial transactions, or mark the entire research corpus historically verified. Earlier access-scope boundaries remain in force.
