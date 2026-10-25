# KFB Audio Site · self-service Card Performances

Status: deployed technical checkpoint for existing KFB Audio Site Source 0.6.0 / Site version 9.  
Owner: KFB Audio / Draft PR #365.  
Content source owner: KFB ChatterBox Voice / Draft PR #379.  
Site: existing project `appgprj_6ac1c73dc28881919123106bd6d3e90e`; no second Site or runtime.

## Outcome

The existing Voice Acting tab gains one in-context Card Performance editor. It fetches an explicit preview feed from the existing Voice branch, validates the pinned 48-Card Wrinkle Rumble source, full performance script, typed Bridge sidecar and rendition-specific cue manifest, then keeps every edit as a local non-canon draft.

Routine content changes need only an ordinary GitHub data commit plus **Reload GitHub content**. They do not require another Site source version or Work/WSA run.

## Files

- `card-performance-core.mjs` — pure source/feed/deck/Bridge/draft validation and export logic.
- `card-performance.js` — GitHub hot loader, revision/ETag and last-known-good cache, editor, import/export, browser voice and exact-source audio A/B.
- `card-performance.css` — additive responsive styling inside the existing KFB Audio / Voice Acting design.
- `card-performance-qa.mjs` — deterministic 18-check unit contract.
- `card-performance-live-data-qa.mjs` — current GitHub feed and pinned-source integration test.

The managed Site source also updates its existing `index.html`, `audio-site.js`, `validate.mjs`, `README.md` and `SITE_CHAT_INSTRUCTIONS.md`. The sole `AudioContext`, `musicContext`, adaptive D bed, MusicClock and ducking remain `window.KFBAudioSite` owned.

## Security and editorial boundary

- public GitHub Contents API reads only; no browser token or raw private media;
- explicit `PREVIEW · Voice PR #379` lane; no automatic canon promotion;
- localStorage draft and IndexedDB authorized clip intake;
- no fake direct GitHub Save; provenance JSON/CSV/lyrics export is the supported ordinary Web Chat → GitHub path;
- source Cards are read-only and shown separately from editable sentences;
- missing POWER/LORE remains source silence;
- missing compatible Bridge remains `NO_EDGE` / silence;
- `Stay Fluffy!` is fixed for Card Performance outro only.

## Implementation checks at checkpoint

- live GitHub source/feed integration: 12/12 PASS;
- Card Performance core: 18/18 PASS;
- complete packaged Site validator: 172/172 PASS;
- `git diff --check`: PASS;
- Site version 9 publication: PASS;\n- two post-deploy data-only loader checks: 12/12 PASS each;\n- additional Site publishes after setup: 0;\n- owner-visible Reload and audible DRY/D verdict: pending human gate.
