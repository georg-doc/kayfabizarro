# Current Return · kfb-bubbles R10.1 · 2026-10-18

Status: PACKAGE_READY_FOR_WS1B · SOURCE_AND_BROWSER_TESTED · NO_RUNTIME_ADMISSION_OR_HUMAN_PASS.

## Result for WS0 / WS1b

PR424's requested R10.1 rules, V519 paper, font fallback and self-contained demo are implemented. Default content is Fluff with only two longest unique content lemmas as glyphs; two encounters unlock those to Fluff; card ownership or three distinct cards in the relevant deck unlock plain text. Titles/names/numbers/FLOW stay plain; assist is a view over caller-owned state. The original source functions were copied directly, not reconstructed from descriptions.

Single file: KFB_BUBBLES_SSOT_R1/kfb-bubbles.v1/demo.single.html (all scripts, local OFL fonts and licenses inline, zero external requests). It is ready for WS0's direct browser inspection. It does not need a new Site or Cloudflare deployment. WS1b consumes the package for V497 through the README's explicit module/Classic load order; it remains the sole game/World writer. The package gate that blocked that intake is closed; actual WS1b integration is not claimed.

## Exact source / branch / checkpoints

Repo georg-doc/kayfabizarro; existing branch wsa/kfb-bubbles-ssot-r1-2026-10-18; existing PR https://github.com/georg-doc/kayfabizarro/pull/424; base docs/kfb-decisions-register-2026-10-11. Implementation/tested source c21aca539189af8d463c9793bb5b0c0651dd3bb8; evidence8016ed91883af6488bf93223325e8b4d70c80b25. This Return advances documentation only; exact final head is the current PR head and is read back after push. No PR merge or Live promotion.

Actual R10.1 source: /CLAUDE/KFB_HUB/40_AUDIO/kfb_language_r1/probe_r10_1.html, SHA256108314866754b5a253f4afcac74462360416a6ccde4a9e93e072c4efa4b5a2bf,131310bytes. Five direct ranges396–470 pinned in R101_SOURCE.json, independently byte-checked. No probe audio or embedded private PottyMouth binary copied. The existing Unicode alphabet remains explicit and host-selectable.

Unchanged core/host bytes compare to original GitHub donors (plus the preexisting one terminal LF): f59a8a1affb3038bba903d26182c2e007cda1d07 and19e67ae9a5b21b37e8c368f3fde598f495bac1ff. Eight kinds, four comicWord classes, shape math, head projection,520ms stagger and300ms flip remain original. Exported font configuration now has safe sans fallback; host face paint is a bounded view override.

## Changed files / seams

In the package: kfb-bubbles.mjs, generated kfb-bubbles.classic.js, copied fluffolect-r101.js, R101_SOURCE.json, demo.html, demo.js, generated demo.single.html, build.mjs, test.mjs, browser-tests.html, fonts.css, official unchanged Shantell Sans/Bangers TTFs with their OFL licenses and FONT_SOURCES.json, README.md, additive SOURCE_AUDIT.md, and evidence/* (source-before and current screenshots, browser JSON, node log, hashes, internal Guard Return). Updated existing .github/workflows/kfb-bubbles-v1-static.yml. Core/host/defs source copies unchanged.

Bounded seams: caller state binding (no localStorage/encounter counting); full-part role/key analysis before wrapped-row display; exact glyph advance reservation after original fitCoded; max(source,Fluff) width budget fed into the existing core layout, whose token cuts are mapped back to source words. This closes short-word Fluff overflow without squeezing readable text or adding a layout owner. Default paper#fffdf8; optional14%pastel/daylight adjustment; minimum7:1INK contrast. Await local fonts before first host layout; missing fonts use the documented sans chain.

## Actual tests

- Source identities2/2 and five R10.1 ranges5/5:PASS. Syntax for modules and every inline script:PASS. Deterministic build --check:PASS. Node behavior12/12groups:PASS.
- Actual Chrome browser fixture13/13:PASS. Initial keys2, nonkeysFluff, protectedrolesplain; encounter1/2, owncard, threeothercards, assist while progress counts;375/768/1280px without horizontal document overflow; SingleHTML0externalrequests; missing-font readablefallback; boundedpastel/nightcontrast.
- Original Wireface host with real Three0.186.1 (exact donor dependency):190px narrow layout,5rows,110pxheight before/afterunlock, fullsourcewordroster, no row overflow. HeadWorld/camera project moved bubble fromx240 tox294.0416; original pads hold. Pastel face contrast12.4548:1. No actual WS1b avatar/world integration or GPU-performance claim.
- GitHub Actions implementation run https://github.com/georg-doc/kayfabizarro/actions/runs/39167021624 : SUCCESS at exact c21aca539189af8d463c9793bb5b0c0651dd3bb8. Final doc/evidence-head checks are verified separately before handoff.
- Independent internal read-only tester/Guard /root/asset_guard reran node/build, independently compared actual original source, raised the narrow Fluff seam, then returned CONTINUE after the bounded fix and read Chrome evidence. It did not independently rerun the browser. No deferred external Critic chat was launched.

Screenshots show the actual isolated donor forms before changes, bright paper/two-key start after changes, all eight retained forms and four comicWord classes. No hosted/public acceptance claim. The private staging Site, World branch, audio, combat code and PR425 remain untouched.

## One next productive gate

WS1b imports the pinned package and connects canonical card/deck/global-encounter snapshots to the existing V497 melody speaker. WS0 can inspect demo.single.html directly. Georg need supply no files. Only the receiving game integration and human visual/game acceptance remain open for that owner. WSA continues the requested evening sequence with platform research, read-only V536 Arena audit, then Songs Batch1 plan.

---

# Historical R1 Return (superseded by R10.1 above)

# WSA Return · kfb-bubbles.v1 SSOT proposal R1 · 18.10.2026 (V-501)

**Owner:** existing KFB ChatterBox presentation core + Wireface host adapter. **Disposition:** source-backed package candidate, STATIC CI PASS, **NOT visual acceptance / NOT runtime admission**. No Site/Stage requested for this isolated library slice; no publication, main write, merge, or canon promotion.

## Repository and evidence

- Repo: `georg-doc/kayfabizarro`; branch: `wsa/kfb-bubbles-ssot-r1-2026-10-18`; Draft PR: [#424](https://github.com/georg-doc/kayfabizarro/pull/424); base branch: `docs/kfb-decisions-register-2026-10-11` (branch created from `37801621dfc6060c70c92cb62219d1b1aada2696`).
- Verified tested head **`3fe3db84fe6a16e5f250731498182b2ab548e730`**. The Return commit itself advances the branch; the final exact PR head must be checked on closure (refer to PR head / Production Control RETURN checkpoint).
- All implementation files are **new**, under `KFB_BUBBLES_SSOT_R1/kfb-bubbles.v1/`: `chatterbox-core.js`, `bubbles.module.js`, `defs.svg`, `kfb-bubbles.mjs`, `kfb-bubbles.classic.js`, `demo.html`, `README.md`, `SOURCE_AUDIT.md`. New CI `.github/workflows/kfb-bubbles-v1-static.yml`. The only replacement was a Classic wrapper's own duplicate name on the candidate branch; **original donor files untouched**.

## Exact source arbitration, no reinvention

1. KFB ChatterBox Studio v2's `chatterbox-core.js` Github blob `f59a8a1affb3038bba903d26182c2e007cda1d07` vs newer Dropbox Wireface file: **content identical; Dropbox adds exactly one terminal LF**. Vendor latest source unchanged; retains original `window.KFB_CB`, all 8 `KINDS`, 4 `WORD` comic VFX classes, shape/layout/clay family.
2. Wireface `bubbles.module.js` Github blob `6578a795ded97ed5cf2f0f1b0d4f9841c8533cbb` vs newer Dropbox Wireface copy: same one-LF-only difference. ES module imports it unchanged; Classic uses original algorithm, with import/export/module scope adapted to global `window.THREE`. No additional dialogue/time/physics/world owner.
3. `defs.svg` carries actual `<defs>` from GitHub Studio v2; font loader uses Shantell Sans, Bangers, Irish Grover, no font files bundled.
4. New separate decode view hook: fixed R9 Smurf POS lexicon (`fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery`); `glyph → fluff → plain` per word, flow words remain legible, punctuation intact, glyph count 1–3, computed-word-width horizontal fit at 1.6em, INK `#1f1a14`, PAPER `#fbf2df`. Placeholder glyphs `✦ ◈ ◆` are explicitly temporary and not PottyMouth BB.
5. Source isolation exists as standalone `demo.html` showing actual core's eight kinds, four VFX types and decoding stage control. The source object has **not yet been visually inspected in a browser**; no claim of source-isolation visual proof.

## Actual tests

- First static CI at head `9cf95d7adb159a6ae35420a3dfc6eb1807f64b72`: **FAIL**, Classic wrapper duplicate `INK` declaration. One targeted repair corrected the wrapper without editing donors.
- Subsequent GitHub Actions run [39130932095](https://github.com/georg-doc/kayfabizarro/actions/runs/39130932095) at **`3fe3db84fe6a16e5f250731498182b2ab548e730`**: **PASS**. Checked four module JS syntaxes plus demo inline JS; byte comparison **2/2**, defs **7/7**, KINDS **8/8**, WORD classes **4/4**, documented R9 bridge assertions all PASS.
- GitHub fetch-file readback: all original implementation artifacts byte-exact after write, and patched Classic wrapper reread exact.
- **NOT RUN:** direct browser render, visual isolated donor geometry comparison, actual 3D head anchor, performance, source-host Site/GPT Site/Cloudflare. R9.1 `probe_r9.html` lives in Dropbox and had readable *description* but its script was not returned by the Dropbox text extractor; helper implements the written rules, not a code-identical probe port. Font network loading/OFL deployment review also open.

## Unresolved / next gate

**ONE NEXT GATE:** A Sites/browser-capable receiving tester opens the **existing** isolated `demo.html` directly in a real browser and captures a source-versus-package visual contact sheet for all kinds, comic words, and the three R9 decode stages; confirm word-fit, no layout jump, readability, and imported original Wireface 3D anchor before integration approval. No new site/runtime/branding as workaround. Georg need do nothing until that proof returns.
