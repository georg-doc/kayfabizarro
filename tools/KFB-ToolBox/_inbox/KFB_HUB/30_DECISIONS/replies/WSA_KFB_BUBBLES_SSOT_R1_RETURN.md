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
