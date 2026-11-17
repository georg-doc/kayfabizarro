# Return · Website R1 · paper pass as the one final path R1

From Claude Design to KFB-Stunt-Car-Race #133. 17 Nov 2026. Closes the open point of the pencil and watercolour returns (`kayfabizarro@6e0e2af9`, `@ec667a6e`).

## Result

With the paper pass the pencil and the wash look read as one sheet: paper tone and tooth, a pencil outline from depth, unfinished edges (pencil) or wet passages (wash). It replaces the host's final render call while a look is on and gives the original picture back pixel for pixel when off. Headless only: no real graphics card, no frame times, no human look check.

## Source pin

- `blendi/coloured-pencil` `src/page.js`, blob `23213d95a7e8a109b56b10872635814b9577b543`, and `blendi/watercolour` `src/page.js`, blob `3dfa47d1bfc5e0e5d330cfc7451f3bb47ab619d5`. Both recomputed, both match their `SOURCE_LOCK.json`, both unchanged. Intake `kayfabizarro@b520c0ab`.

## Adapter (`adapter/kfbpage.js`)

```js
const paper = createPaper(THREE, { renderer })
paper.set('pencil' | 'wash' | null)                      // with the look switch
paper.render(scene, camera) || renderer.render(scene, camera)   // the host's one final call
paper.resize()                                            // from the host's resize
```

- **One final path:** `render` returns false when off, so the host's own call runs instead; they never both run. The scene is drawn once, into the pass's target.
- **Two sheets, one per look,** made on first use and kept for the renderer's life.
- **State:** the clear colour is put back. The sources end on the screen; a host that ends on its own target cannot use the pass as is.
- **Not combined with `post2.js`:** the website's style pass and this pass are alternatives for the final path. Chaining them needs the paper pass to end on a target, which means changing or wrapping the source. Not done.

## Tests run (`TEST_RESULT.json`, `pencil.html?toggles=2`)

| Check | Result |
|---|---|
| Pencil with paper differs from pencil without | yes |
| Wash on its paper differs from pencil on its paper | yes |
| Original after 5 rounds original ↔ pencil on paper | identical hash every time |
| Pencil on paper after the same rounds | identical hash every time |
| Render target after the pass | screen (null) |
| Resize to 390 x 844 at 2x, then draw | GL error 0 |
| Shader programs with both looks and both sheets | 25 |

## Picture (`images/KFB_website_r1_paper_pass.jpg`)

Pencil on paper, bent tree, wash at 0, 3.2, 5.5 and 30 s.

## Open

- **No dispose:** the sources keep their render targets private. The adapter cannot free them; it makes each sheet once.
- **Colour of what is not switched:** sky and cloth floor go through the pass without the game's film curve (the pass writes to a target, then applies its own gamma). They come out darker and flatter than in the game look. Acceptable for a full-sheet scene, wrong for a mixed scene where the floor should stay as approved.
- **The pass is full-frame.** It cannot treat only the pencil props. Pencil props inside an otherwise untouched game picture still need the look without the pass.
- **Outline in the dry wash state is faint** on white props against a bright sky.
- **Cost not measured.** The wash sheet keeps smaller copies of the picture for its wet passages and is the heavier of the two.
