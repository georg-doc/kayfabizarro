# kfb-bubbles.v1 · R10.1 (PR #424)

Reusable ChatterBox/Wireface presentation package for WS1b. The original `chatterbox-core.js`, `bubbles.module.js` and shape/word geometry remain unchanged. The view adapter supplies R10.1 decoding, readable font fallbacks and V-519 paper. No dialogue, audio, animation, progression or World owner is added. No merge, game admission or human visual acceptance is implied.

## Open and build

`demo.single.html` is the requested complete single-file demo: scripts, Shantell Sans, Bangers and their full OFL licenses are inline. It makes no external resource requests. `demo.html` uses the same sources as separate local files. Both show the original eight kinds/four word classes and the original R10.1 sample lines. No private PottyMouth font is included; the existing Unicode alphabet is the default and a cleared host font can be supplied separately.

Run `node build.mjs` after source changes. This deterministically generates `kfb-bubbles.classic.js` and `demo.single.html`; do not maintain either as a second source fork. Run `node build.mjs --check` and `node test.mjs` for local/CI validation. `browser-tests.html` runs the actual DOM, narrow viewport and original 3D-head projection checks using the donor's exact Three.js0.186.1 dependency. It is an internal test fixture; the single-file demo has no Three or network dependency.

## Use the existing host

ES module: `import * as B from './kfb-bubbles.mjs'`. The receiving application's existing `three` dependency/import map resolves the unchanged Wireface host. Classic: load `chatterbox-core.js`, `fluffolect-r101.js`, the receiving host's existing `THREE` global, then `kfb-bubbles.classic.js`; use `window.KFB_BUBBLES`. Do not install a second Three/runtime owner.

```js
await B.loadFonts(); // packaged OFL fonts, bounded wait, readable sans fallback
const bubbles = B.create({host: overlayHost, maxPx:420,
  cards: [{id:'card-id', text:canonicalCardText}],
  decks: [{id:'deck-id', cardIds:canonicalDeckCardIds}],
  state: {encounters:globalWordEncounters, owned:ownedCardIds}
});
bubbles.say(actor, [subject, connector, reframe], speakerColor);
bubbles.update(deltaSeconds, {camera, pads, avoid});
bubbles.setLanguageState({encounters:globalWordEncounters, owned:ownedCardIds});
bubbles.setAssist(true); // view only; the host continues recording encounters
bubbles.setPaper({storyMode:true, tint:speakerColor, light:sceneLight, timeOfDay:dayPhase});
```

State is a caller-owned read-only snapshot. The adapter never increments encounters, grants cards, writes storage or owns game time. Pass actual card texts/IDs and actual deck memberships; three distinct owned cards in the relevant deck unlock its content. `setLanguageState` updates the display after an authoritative host change. Default stage is `state`. `setDecode('glyph'|'fluff'|'plain')` and `setDecode('auto',0..1)` are explicit preview overrides; protected roles remain plain. The R10.1 `stageOf(word,percent)` signature replaces the old unaccepted R9 helper signature.

For text-only tools, `B.renderWords(element,plaintext,{decoder,assist})` uses a decoder from `B.createDecoder({cards,decks,state})`. Titles/names/numbers/FLOW are analyzed on a complete part before wrapped rows are rendered. Glyphs preserve their original word advance, use one symbol up to six letters and two above six, never adjacent duplicates, transform-only enlargement and the source's horizontal clamp. Font size/line height do not grow. Fluff remains readable at full text size: the existing core budgets the larger of each source/Fluff word before wrapping, then its own cuts are mapped to real words. Geometry and head placement remain in the original core/host.

## V-519 and fonts

Default paper is bright warm white `#fffdf8`; the previous fixed beige is no longer the active view default. Optional Story tint is a14% pastel mix. The host provides light/day phase; the view applies a small bounded adjustment and enforces at least7:1 contrast against INK `#1f1a14`. `B.paperColor` and `B.contrast` are pure helpers. Every host update applies the view color to the original shape's first face; no shape math or head anchor changes.

At initialization the exported core font configuration is set to `"Shantell Sans", "Comic Neue", system-ui, sans-serif`; comic-word/shout artwork retains Bangers/Irish Grover with the same safe fallback tail. The raw frozen donor strings are preserved for provenance, but do not govern active fallback. `fonts.css` and local files contain the official unmodified Shantell Sans/Bangers builds, with complete OFL licenses and hash receipts in `FONT_SOURCES.json`. Await fonts before first layout; unavailable fonts return promptly to the safe fallback. No Google Fonts request or private font binary is required.

## Source and actual evidence

`R101_SOURCE.json` pins the actual local `probe_r10_1.html` SHA256 and five verbatim ranges (lines396–470): helpers; `analyze`, `fluffify`, FLOW/IRR_PAST/ADJ_Y/COMPOUND; `unlockStage`/`setKeys`; `stageAt`; `fitCoded`. The probe's audio, sample progression storage and embedded private font were not copied. The factory state binding, font/paper view and width reservation are explicitly bounded seams.

`SOURCE_AUDIT.md` retains the original donor arbitration. Current tests and screenshots are in `evidence/` and the owning `WSA_KFB_BUBBLES_SSOT_R1_RETURN.md`. Source-isolated forms were opened before changes. The browser fixture uses real Three.js camera/project math and the original Wireface host, not a pretend projector. This does not claim actual WS1b integration, a game visual PASS, public deployment, audio playback or Georg acceptance. Next owner action: WS1b consumes the pinned package for V-497; WS0 can inspect the single file directly.
