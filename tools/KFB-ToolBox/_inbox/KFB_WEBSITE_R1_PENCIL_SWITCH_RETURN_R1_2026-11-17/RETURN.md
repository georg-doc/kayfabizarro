# Return · Website R1 · coloured pencil switch R1

From Claude Design (Website R1 stage) to the shared work list, KFB-Stunt-Car-Race #133. 17 Nov 2026.

## Result

The pencil switch is in the website's shared prop step and works on a static object and on an object that is already deformed. The approved look comes back pixel for pixel. Tested headless only (Chrome, software renderer, three 0.186.1): no real graphics card, no frame times, no human look check yet.

## Source pin

- Donor: Patch `blendi/coloured-pencil`, head `0400f90d08ca97aae11edb41e3ff3af830acc8c7`, code MIT, art CC0.
- Intake: `kayfabizarro@b520c0ab`, `tools/KFB-ToolBox/_inbox/KFB_COLOURED_PENCIL_DONOR_R1_2026-11-17/`.
- Used unchanged: `src/pencil.js`, git blob `8bea1ef8dd17620ffc74de8177b7d9568e6ebd06` (recomputed here, matches `SOURCE_LOCK.json`).
- Not used: `page.js` (paper pass), `shape.js`, `noise.js`, `createBatch`.
- On the stage the donor sits unchanged under `vendor/patch-coloured-pencil/` with `LICENSE`, `LICENCE-NOTES.md`, `CREDITS.md`, `SOURCE_LOCK.json`.

## Adapter (`adapter/`)

| File | Role |
|---|---|
| `kfbpencil.js` | new. `prepare(geo, { hatch, colour })` and `createPencilLook(THREE, { renderer, pixels, compose })` |
| `kfbprops.js` | changed. `bake()` now ends in `prepare()`: every baked prop carries `hatch`, laid in its rest pose. Vertex colours were already there. |
| `kfbbend.js` | unchanged since Patchworld R3. Hangs the game's rubber bend (`world/kfbFold.js`) into a material. |
| `kfbfield.js` | unchanged since Patchworld R3. Instanced props. |
| `pencil.html` | proof page and self-test |

```js
const look = createPencilLook(THREE, { renderer, pixels: 5,
  compose: (pencilMat, mesh, original) => (original.userData.kfbBend ? bendable(pencilMat) : pencilMat) })
look.add(root)      // registers every mesh that may be switched, lists the others with the reason
look.set(true)      // pencil; look.set(false) gives each mesh its own material object back
look.fit()          // call from the host's resize: px = pixels * drawingBufferHeight / 1080 (the source's rule)
look.dispose()
```

How the handoff's points were met:

- **`field` / `fieldBy` / `hue` in the prop step:** `prepare()` calls the donor's `field` (default slant), `fieldBy` when a function is given, and `hue` only when a piece has no vertex colours. It runs once per geometry, on our own baked copy, never on a source model.
- **Reversible:** the original material object is kept and put back. Nothing is cloned or edited on it.
- **Hooks composed, not replaced:** one pencil material is made per original material, then handed to `compose`. The bend wraps the pencil's own `onBeforeCompile` and adds its cache key (`pencil|kfbBend|kfbFold`). The pencil's `vAt = position` and `hatch` stay in rest coordinates, so strokes stay on the bent tree. The bent depth material is untouched, so the shadow bends too.
- **No blanket use on textured objects:** `createBatch` is not used. A mesh is refused if it has no `hatch`, no vertex colours, a texture map, or is skinned. FrizzleBob is therefore never touched.
- **Cloth floor separate:** the quilt has no `hatch` and is refused. It stays cloth.
- **Tone mapping:** the pencil material is set to `toneMapped = false`. The pencil writes what is left of the paper's white; the game's film curve would grey it. The donor file is not edited for this.

## Tests run (`TEST_RESULT.json`, `pencil.html?toggles=5`, 1280 x 720)

| Check | Result |
|---|---|
| Pencil picture differs from original | yes |
| Original after 10 switches | identical hash every time |
| Pencil after 10 switches | identical hash every time |
| Shader programs before / after 10 switches | 14 / 14 |
| Pencil materials before / after | 3 / 3 |
| Bent tree (bend 1.017 rad), outline original vs pencil | same box, 327,755 vs 325,589 changed pixels (0.7 % apart) |
| Stroke spacing desktop 720 high | 3.333 px |
| After host resize to 390 x 844 at 2x (buffer 780 x 1688) | 7.815 px, GL error 0 |
| Switched meshes / refused | 5 instanced kinds / cloth floor |

The outline check is coarse: it counts pixels that change when the props are hidden, shadows included.

## Pictures (`images/`)

- `KFB_website_r1_pencil_switch_desktop.jpg`: static objects, bent tree, shadows; each approved look beside pencil.
- `KFB_website_r1_pencil_switch_mobile.jpg`: 390 x 844 at 2x, both looks.

## Open

- Pencil pieces stand in the game's sky and on the cloth floor. The donor's paper pass (`page.js`) is not wired in; it must become the one final pass together with the existing style pass, not a second one.
- Pieces in pencil cast shadows and are hatched darker where they are shaded, but a shadow falling on a piece is faint at this light.
- The clay look and the pencil look are alternatives: in pencil mode the clay material is not shown.
- Skinned meshes are refused, not tested. Squash from `kfbtoys` is an instance matrix and needs no hook.
- Hatch is the default slant for all pieces. Form-following fields (`fieldBy`) are prepared but no piece uses one yet.
- Watercolour is the next step and not in this return.
