# kfb-bubbles.v1 · source audit & QA evidence · 2026-10-18

- Core GitHub blob: f59a8a1affb3038bba903d26182c2e007cda1d07, 26722 JS characters; Dropbox Wireface: 26723. Comparison: first 26722 code units identical; Dropbox adds exactly one LF; chosen **Dropbox newer copy**, all preceding bytes untouched (ASCII/Unicode source text preserved).
- Adapter GitHub blob: 19e67ae9a5b21b37e8c368f3fde598f495bac1ff, 6305 JS characters; Dropbox Wireface: 6306. Comparison: first 6305 code units identical, one terminal LF added; chosen **Dropbox newer copy**.
- SVG-defs extract from GitHub ChatterBox Studio v2: 2905 characters, seven named ids verified; rendered sample references these actual ids (not a replacement palette).
- Binders: ES module original core side-effect plus unchanged `bubbles.module.js`; classic script contains the original adapter code except import/export shim and wraps new helpers. No state owner duplicated.
- Static source checks (in connected JavaScript run): 2 source-copy comparisons PASS; 7 defs present; all eight `KINDS` and four `WORD` classes preserved inside unmodified core by reference.
- Runtime Node syntax / browser rendering / source-isolated screenshots / Cloudflare or Site acceptance: **NOT RUN / UNVERIFIED**. Do not claim LIVE.
- Exact semantics gap: R9.1 HTML source script inaccessible through Dropbox extracted text; its *visible description* and updated WS0 briefing used, no claim of byte-port.

## Additive R10.1 intake · 2026-10-18

Outcome: finish PR424's R10.1/V519/font/single-file corrections for WS1b. Builder/only writer: /root. Tester: repository checks + actual Chrome DOM fixture. Independent internal read-only tester/Guard: /root/asset_guard. No separate Critic chat was created; the deferred WS0 Critic briefings remain deferred. Guard owns smallest-seam routing. Human product acceptance remains WS0/Georg; this package handoff is not game acceptance.

[Q] Which code is copied? [A] Actual probe_r10_1.html, SHA256108314866754b5a253f4afcac74462360416a6ccde4a9e93e072c4efa4b5a2bf,131310bytes, source lines396–470. Five exact blocks and hashes are in R101_SOURCE.json. Independent source-file comparison confirmed each block, including analyze/fluffify/FLOW/IRR_PAST/ADJ_Y, unlockStage/setKeys and fitCoded. The old probe's embedded private font and audio are excluded.

[Q] What remains the layout/geometry/anchor owner? [A] The frozen cbs-core and original Wireface host, both byte-identical to the initial PR copies. The new view config overrides exported font fallback values and applies paper to the face after host.update. It does not rewrite geometry, actor projection, stagger or flip.

[SEAM] Caller-supplied card/deck/state snapshots bind the probe logic without localStorage or encounter mutation. Deck memberships are deduplicated, so three means three distinct cards. Full-part role/key analysis precedes per-row display. A post-fit inline box reserves the hidden glyph-word advance, preserving the source transform/clamps. Before invoking the original host, its existing core budgets each token for max(source,Fluff) width and then maps its own token cuts back to plaintext; this protects short content words without squeezing Fluff or owning another layout algorithm. The first internal Guard identified this short-word overflow risk; the bounded fix was verified on a real narrow host.

[VISIBLE] Before changes, actual source forms were opened and captured in evidence/source-before.png. Current demo paper is bright warm white; title/name/FLOW/number text stays legible, non-key words begin as Fluff, two keys use Unicode glyphs. Source forms still come from the exact core. Local OFL fonts and complete licenses are embedded in the generated single file. No third-party font/network requirement remains for that demo.

[TEST] node test.mjs:12/12groups. build.mjs --check:PASS. Actual Chrome browser fixture:13/13, recorded in evidence/browser-tests.json, including375/768/1280px, no external requests from SingleHTML, actual Three186 camera/project math, moving head anchor, five-row narrow Fluff budget, state unlock without height change, and missing-font fallback. This is factual package evidence; not an actual WS1b world integration or human PASS.
