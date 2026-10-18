# kfb-bubbles.v1 — presentation SSOT candidate (V-501)

**Status:** isolated package, DESIGN/INTEGRATION CANDIDATE — not accepted into game/tool/Hub runtime. Ownership remains with the existing KFB ChatterBox presentation core and the Wireface host adapter. No new dialogue, audio, camera or world state owner.

## Sources (copied unchanged)

- `chatterbox-core.js`: Dropbox `/CLAUDE/KFB Wireface Stage R2/vendor/chatterbox/chatterbox-core.js` (2026-10-14), equivalent GitHub `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/lib/chatterbox/chatterbox-core.js` @ f59a8a1affb3038bba903d26182c2e007cda1d07 except **one additional terminal LF** in Dropbox. Original global `window.KFB_CB` and its full API intact, including layout, silhouette, clayFront and comicWord.
- `bubbles.module.js`: Dropbox `/CLAUDE/KFB Wireface Stage R2/modules/bubbles.module.js` (2026-10-14), equivalent GitHub `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/CLAUDE_DESIGN_STAGE_LIVE_R1/modules/bubbles.module.js` @ 19e67ae9a5b21b37e8c368f3fde598f495bac1ff except one terminal LF. Original import `three`, `create(o)`, 520ms stagger, 300ms flip, headWorld projector untouched.
- `defs.svg` comes from unchanged <defs> tree in ChatterBox Studio v2 source (GitHub register), including `kfbFaceShade`, `kfbWallShade`, `kfbSoftShadow`, `kfbCornerMask`, four `kfbDots*` patterns and clay shading filters. `injectDefs()` is idempotent.
- `Shantell Sans` (body), `Bangers` / `Irish Grover` (impact/word), loaded once through Google Fonts. Font availability depends on host network; fallback fonts retained. Use OFL when locally vendoring fonts; **no font binary vendored here**.

## Browser usage

**Classic:** Load `chatterbox-core.js` then `kfb-bubbles.classic.js`. For `create({host,maxPx,...})`, pass an existing global `THREE` before instantiating; original Wireface `actor.headWorld()`, `update(dt,{camera,pads,avoid})`, `say(actor,parts,color)`, `clear`, `dispose` API still applies. `window.KFB_BUBBLES` has `create`, `loadFonts`, `injectDefs`, `stageOf`, `renderWords`, `fluffify`, `fitCoded`.

**ES module / Vite-like bundler:** `import { create, renderWords, stageOf } from './kfb-bubbles.mjs'`; install/provide the existing `three` package resolved by the unchanged host adapter. Side-effect import of bundled core exposes `window.KFB_CB`. **Browser-native bare imports require an import map**; the build does not introduce a new copy of Three.js.

```js
const bubbles = create({ host: overlayHost, maxPx: 420, stage: 'glyph' });
bubbles.say(actor, ['Subject', 'Connector', 'Reframe'], '#8faac1');
bubbles.update(deltaSeconds, { camera, pads, avoid });
bubbles.setDecode('auto', 0.65); // or glyph | fluff | plain
```

**Tools/Hub:** Use the same package's font+defs loader and `renderWords(element, plaintext, {stage,progress,glyphFont})` to render text without a Three host; the bubble geometry, kind variants and comic words remain `window.KFB_CB` authority. Avoid copying a new layout algorithm. `demo.html` isolates 8 kinds + 4 comicWord classes + decode stages; it is **not** a public Stage acceptance or 3D Wireface integration.

## Fluff-o-lect hook — R9 / R9.1 source constraints

Plain flow words stay visible; punctuation is outside the encoded word. Morphology maps strictly to `fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery`; never invent padded pseudo-words. Each 1–4, 5–8, 9+ letter source word maps to 1, 2 or 3 nonlicensed glyphs, rendered at **1.6em**, with horizontal `scaleX` derived from canvas measurement of the original word using computed bubble font. All glyph ink is `#1f1a14`, bubble PAPER `#fbf2df`. `stageOf(index,total,progress)` supports per-word decoding through glyph → fluff → plain. Glyph family is an overridable parameter; PottyMouth BB is **not licensed**. The Dropbox `probe_r9.html` was discoverable but its text extractor stripped executable JS; this hook implements the written R9/R9.1 contract, not a source-byte port of `fitCoded()`.

## QA limits / exact usage

Source byte comparison against both copies is recorded; all eight kinds and four word classes draw only using copied `KFB_CB`. Full real browser demonstration / Site visual QA and headWorld-anchored 3D test remain for receiving integration. No acceptance or publication claim without opening that exact host.
