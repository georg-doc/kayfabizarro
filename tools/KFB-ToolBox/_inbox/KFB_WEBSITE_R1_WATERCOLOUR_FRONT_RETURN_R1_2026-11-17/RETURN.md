# Return · Website R1 · watercolour on the existing colour front R1

From Claude Design (Website R1 stage) to KFB-Stunt-Car-Race #133. 17 Nov 2026. Follows the pencil switch return (`kayfabizarro@6e0e2af9`).

## Result

Prepared props are a pencil underdrawing until the website's colour front reaches them, then take their colour as a wash from the foot up. The front has one owner (the website's step list), the clock is the host's, the approved look comes back pixel for pixel. Tested headless only (Chrome, software renderer, three 0.186.1): no real graphics card, no frame times, no human look check.

## Source pin

- Donor: Patch `blendi/watercolour`, head `713908667b250c35598a737503e68b72cb9a2192`, code MIT, art CC0.
- Intake: `kayfabizarro@b520c0ab`, `tools/KFB-ToolBox/_inbox/KFB_WATERCOLOUR_DONOR_R1_2026-11-17/`.
- Used unchanged: `src/wash.js`, git blob `135f864ed4dcfe79f697daf8079c58d2ad969573` (recomputed, matches the lock), and `src/pencil.js`, byte-identical to the pencil donor.
- Used from it: `createWash`, `paint.touch`, `paint.at`, `paint.sync`, `paint.none`, `uniforms.uNow`, `uniforms.uPx`, materials `solid` and `both`.
- Not used: `createDabs` and the brush-touch trees, `createBatch`, `paint.flood`, `water`, `hill`, `beam`, `page.js`.

## Adapter (`adapter/`)

| File | Role |
|---|---|
| `kfbwash.js` | new. `createWashLook(THREE, { renderer, pixels, compose, rect, frontSpeed })` |
| `kfbpencil.js` | changed. The switch is now shared (`lookSwitch`); `prepare()` also writes `root` |
| `kfbprops.js` | as in the pencil return: `bake()` ends in `prepare()` |
| `pencil.html` | proof page and self-test for both looks (`look=wash&t=<seconds>`) |

```js
const wash = createWashLook(THREE, { renderer, rect: { x0, z0, size, cells }, compose })
wash.add(root)
wash.set(true)                       // host rule: one look at a time
for (const step of STEPS) wash.follow(step)   // the website's own front steps { at, t0, speed }; each is written once
wash.tick(t)                         // host clock → uNow, then paint.sync()
wash.fit()                           // from the host's resize
```

How the handoff's points were met:

- **One front owner:** `follow(step)` calls `paint.touch(at.x, at.z, t0 + 0.9, 1e5, 2.6 * speed)`. With that reach the source's slow-down term is zero and the map holds `t0 + distance / (2.6 * speed)`, which is the style pass's arrival for the same step. The wash's walking defaults (reach 14 m, 11 m/s) are not used. `flood` is not needed.
- **Clock and upload:** `tick(t)` is the only writer of `uNow` and the only caller of `sync()`.
- **Coordinates and `root`:** `prepare()` gives every vertex `root = [0, 0, 0, 0.35]`: the foot is the piece's own origin, 0.35 seconds per metre of climb. The source computes world position and root without the instance matrix. The adapter replaces that one source line in the compiled shader (it throws if the line is missing after a source update) so each instance reads the map at its own foot; climb is corrected for scale. The source file is not edited.
- **Materials:** the source returns finished materials, not its maker. Each original material gets a copy of `solid` or `both` carrying the source's own `onBeforeCompile` and cache key, then the instance fix, then the host's `compose` (the bend). Cache key: `wash-false-false|kfbInst|kfbBend|kfbFold`.
- **Heavy trees left out:** no dabs. Trees are the existing baked models.
- **Render chain kept:** nothing renders twice; the page draws through the host's one `render` call. The alpha the source writes for its own paper pass is ignored.

## Tests run (`TEST_RESULT.json`, `pencil.html?toggles=3`, 1280 x 720)

| Check | Result |
|---|---|
| Original, dry (t 0), front (t 3.2), climbing (t 5.5), painted (t 30) | five different pictures |
| Painted state after 5 rounds of wash → original → pencil → original | identical hash every time |
| Original after the same rounds | identical hash every time |
| Shader programs with both looks compiled | 16 (pencil alone 14), stable |
| Arrival time in the map vs owner's formula, six props | worst difference 0.089 s (one map cell is 0.36 m, 0.14 s of travel) |
| `follow` of a step already written | refused |
| GL error | 0 |
| Bent tree (1.017 rad) | colour climbs the bent trunk; shadow bends |

## Picture (`images/KFB_website_r1_watercolour_front.jpg`)

Approved look, dry underdrawing, front passing, climbing, fully painted, the bent tree in two states, mobile.

## Open

- The dry underdrawing is almost bare paper: the source hatches graphite only in shade, and its outline comes from its paper pass, which is not wired in. On the game's sky the unpainted props read as white shapes.
- The arrival map is a fixed square of ground (92 m here). An open world needs it to follow the focus; not built.
- The style pass (`post2.js`) has its own watercolour stage. Both read the same steps, but they were not shown together; which one paints what is a look decision.
- The cloth floor is not part of the wash. Skinned meshes are refused. Clay is not shown while the wash is on.
- The source needs at least one directional light (it reads `directionalLights[0]`). The game's rig has one.
