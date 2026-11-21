# Public corpus release and Perplexity check · 2026-10-31

Implementation: da5b55dc7ba9804a8bb13da4aa9faf49f2cc1265. Existing branch planning/philosophy-sparring-webchat-mvp-2026-10-31, PR #463, unmerged.

User explicitly authorized publication of the six recovered original texts. Published corpus/S1.txt, S2.txt, S4.txt, S5.txt, S6.txt, S7.txt, corpus/README.md, START.md R9-URL-2. All 8 files fetched from exact branch; all 8 content comparisons equal. Branch head confirmed. Text readbacks prove preservation of extracted strings, not complete Word formatting/footnote fidelity. No editorial rewriting. Native Drive/DOCX text extraction for S1/S2/S4; textutil conversion for S5/S6/S7. Original binary documents are not included.

## Perplexity actual retest
Fresh signed-in Free/Search session. Prompt requested current START version, available source IDs, then S6 philosopher from first paragraph. Visible tool activity attempted GitHub and raw web reads. Response expressly reported both inaccessible; no version/IDs/name invented. Result: URL-only retrieval FAIL, honest failure PASS. No new filename variants or repeated repairs applied after observed failure.

Independent public HTTP check: raw START URL returns HTTP/2 200 and text/plain UTF-8, 5656 bytes. This proves host response from this environment, not Perplexity crawler access. Official https://docs.perplexity.ai/docs/resources/perplexity-crawlers describes Perplexity-User as a user-request fetcher that might visit a page, with separate bot/IP access considerations. No exact root cause established; no claim that indexing wait or Pro upgrade fixes it.

## No-copy options and bounds
A public plain HTML reader with controlled crawler access is a candidate; it needs a real external fetch test before acceptance. Existing private administration Site cannot serve anonymous crawlers; do not expose it. GitHub remains content authority. A managed Perplexity project/uploaded source snapshot may avoid manual copying by the reader but needs verified plan/sharing support and explicit refresh, not an automatic living URL. Neither is implemented or accepted here. Current same-URL cross-platform gate remains OPEN.

Next gate: test a separate public reader for the already authorized public corpus while preserving private administration; require actual Perplexity version and source-content proof before claiming URL-only usability.
