# RETURN.md — KFB/MED Deck Viewer v5 candidate

**Repository / branch / base:** `georg-doc/kayfabizarro` · `work/kfb-deck-library-r1-2026-10-09` · `909828efa85a2f85584cb47d6a7cee3fd37989bd`

**Outcome:** The existing v4 viewer is preserved as donor and v5 adds data-safe deck/card deep links over the canonical 130-deck source.

## Changed

- added `KFB Deck Viewer v5.dc.html` from the verified v4 donor;
- upgraded shared `deckviewer/kfb-corpus.js` to consume the generated v2 deck index;
- real PDF page counts are shown for every deck;
- stable `?deck=&card=` and `?deck=&page=` routes;
- copied card labels emit exact `kfb.card-ref/1` JSON;
- unsafe mappings stay available as full PDF pages but expose no card crop.

## Preserved owners and contracts

- `media/kfb/index.json` remains the deck owner;
- PDFs and source card JSON are unchanged;
- v4 and earlier viewers remain present;
- the viewer remains a static pdf.js consumer and does not write Registry/source state;
- gameplay suitability remains review-only except for the explicit Three Futures and Mission Control allow-list.

## Evidence

- 130 decks · 1,915 measured PDF pages · 6,985 card rows;
- Mission Control card 56 deep-link lands on page 15;
- real-browser viewer smoke: zero console errors;
- 14-deck rendered PDF evidence covers Three Futures, Mission Control, schema variants and fail-closed mappings;
- deterministic regeneration and 57/57 repository unit/browser-contract tests pass.

## Unresolved / deferred

- 23 source mappings are deliberately `unverified`; no synthetic card crop is emitted.
- Cross-browser coverage beyond Chromium remains open.
- This candidate was not published to GPT Site or Cloudflare.

## Next gate

Review the PR, inspect the two rendered contact sheets, and approve or request corrections. Merge and publication remain separate Georg-owned decisions.
