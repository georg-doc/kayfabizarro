# Notebook inventory and additive reconciliation

Status: PREPARED_ONLY for Notebook inventory/import. No Notebook accessed, no Gemini inventory run, no source uploaded. Owner remains the existing GitHub Atlas. Date: 2026-11-01.

## Actual bounded discovery

Connected Drive metadata searches for Corbett and Hersh returned 10 and 5 results respectively; the Corbett search had a further page, not exhausted. Search relevance is not proof of authorship. A Dropbox Gary Webb query returned seven file leads, including a privately held Dark Alliance PDF; no book body read. Notion Research Atlas/Corbett/Baab searches returned 10/2/0 results; zero hits does not prove absence. One existing source-link hub was fetched, with hundreds of child pointers, and two selected child pages inspected. No whole-workspace completeness claimed.

The two child pages preserve public leads to [WEF Strategic Intelligence](https://intelligence.weforum.org/) and [a Bitcoin.com Great Reset commentary](https://news.bitcoin.com/a-look-at-the-fascist-agenda-behind-the-great-reset-and-the-wefs-reboot-propaganda/). The latter links a Corbett video; that is a citation/discovery relationship, not independent confirmation. Public originals have not been re-read in this discovery pass, so these are URL_ONLY candidates, excluded from the researched source/claim counts. Private page IDs, source-list bodies, personal annotations and storage paths are kept outside the public repository. No private Notebook membership can be inferred from these connector results.

## Handoff workflow

1. Use `GEMINI_NOTEBOOK_INVENTORY_PROMPT_DE.md` in an explicitly selected accessible notebook; preserve its access report and completeness fields.
2. Keep raw notebook identifiers and private source titles in the private inventory. Transfer only the sanitized export for ordinary Atlas reconciliation.
3. Validate export scope and parse JSON. Require direct membership evidence for every source; external URLs cited inside a source stay in `cited_links`.
4. Match observed public URLs, DOI and edition-sensitive ISBN against existing source receipts; then inspect title/creator/year/edition candidates. Same work, another file, translation and later edition remain distinct manifestations. No automatic merging from a title match.
5. Produce an additive action list: `EXACT_IDENTIFIER_MATCH`, `POSSIBLE_SAME_WORK`, `DISTINCT_EDITION`, `CITED_LINK_ONLY`, `PRIVATE_METADATA_ONLY`, `NOT_COMPARED`, `NEW_TO_COMPARED_SUBSET`. Last label is not a claim of global absence.
6. Retrieve public candidate originals and record actual read scope before adding claims. Preserve old IDs and all provenance memberships. Private originals stay in their existing authorized storage.
7. Bring accepted changes into GitHub, regenerate read-only Notebook/Atlas outputs and record their source revision. Google Docs remains the user's editorial workspace; no bidirectional automatic overwrite is established here.

## Technical representation

Each notebook source occurrence has its own record ID and notebook alias. A canonical work may have multiple occurrences and editions. A match record stores input record ID, compared Atlas source ID, match basis, compared index revision, proposed action and review state. Match candidates are proposals until reviewed. Missing fields are null; false and unknown must not be conflated. A stable public URL must not be replaced by a temporary signed URL. Do not put private account aliases or notebook names into public graph nodes.

Google's documentation describes notebook integration in Gemini, but shared notebooks can be unavailable there; Gemini answers may also use web/tools. Consequently the inventory prompt forbids external research and demands observed access. It cannot grant global account enumeration. [Official integration documentation](https://support.google.com/gemininotebook/answer/17003757?hl=en).

Markdown/Docs are supported inputs. Web URL import reads the given page's text, not nested linked pages; therefore the prepared standalone packet contains its own source index and limitations. A repository link does not itself import every cited original. [Official source-import documentation](https://support.google.com/gemininotebook/answer/16215270?hl=en).
