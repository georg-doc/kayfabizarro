# Where every part came from

| Part | From | Licence | In this repo |
|---|---|---|---|
| The library: particles, solvers, colliders, liquid surface, cloth, soft bodies, smoke | [Three.js Particle Fluids](https://github.com/dgreenheck/threejs-particle-fluids) by Daniel Greenheck, commit `26ebfd2` (0.2.0), with three fixes by Patch (`VENDOR.md`) | MIT, © 2026 Daniel Greenheck | `vendor/threejs-particle-fluids/src/`, with its `LICENSE` and `VENDOR.md` |
| The scenes and the studio | The library's demo presets and stage (`demo/presets/`, `demo/runtime/`), by Daniel Greenheck, changed by Patch: restarts on the same buffers, thickness, pushing, pouring where you point | MIT, © 2026 Daniel Greenheck | `src/scenes/`, `src/stage.ts`, and the lights and post pass in `src/app.ts` |
| The rest of the demo: async scene switching, pushing, quality steps, warm-up, the bunny's generator | Patch | MIT, © 2026 Patch | `src/`, `make-*.mjs` |
| The bunny | Patch, generated from rounded shapes by `make-bunny.mjs` | CC0 | `public/models/bunny.mesh.bin`, `public/models/bunny.sdf.bin` |
| The rubber duck | [Rubber Duck Toy](https://polyhaven.com/a/rubber_duck_toy) by Plat251, Poly Haven, with its 1K textures, as the library's demo ships it | CC0 | `public/models/rubber-duck.glb` |
| Lighting environment | `RoomEnvironment` from three.js, generated at run time | MIT | none (from npm) |
| three.js | three.js authors, r186.1 | MIT | none (from npm; bundled in the demo) |
| The Scene choice's pictures, and the cover | stills of this demo (`make-thumbs.mjs`, `make-cover.mjs`) | CC0, Patch | `thumbs/scenes/`, `cover.jpg` |
| Red Hat Mono 500 | The Red Hat Project Authors | SIL OFL 1.1 | `fonts/` |

## Left out on purpose

- **The Stanford bunny** (the library demo's `bunny.drc`, `bunny.mesh.bin`, `bunny.sdf.bin`, and the pictures of it in its docs and previews). The library's notices say Stanford permits free use and asks for credit. That isn't a licence this block can ship under, so nothing from it is in this repo or its history. `make-bunny.mjs` makes a new one and doesn't read the old one.
- **The library's preview pictures and docs images,** for the same reason: they show that bunny.
- **Kenney's Food Kit** (the library demo's banana, croissant, doughnut and gingerbread). It's CC0 and would be fine, but none of these scenes use it.

There's no sound in this demo.

## Checked file by file

- `LICENSE` of the library: read, MIT.
- The duck: Poly Haven's API lists Plat251 as its author, and everything on Poly Haven is CC0.
- The library's `THIRD_PARTY_NOTICES.md` lists the assets its demo ships; nothing else in its `public/` or `demo/assets/` folders is used here.
