# Licence notes: watercolour

Code MIT. Art CC0 1.0. Checked 2026-11-13.

| Part | Where it came from | Licence | In this repo? |
|---|---|---|---|
| `src/wash.js`, `src/page.js`, `src/pencil.js`, `src/shape.js`, `src/noise.js` (the paint, the page, the pencil, the solids things are built from) | Written by Patch for this block. Every wash, every touch of the brush, the paper and its grain are made in code; no picture or model is loaded for them | MIT; what it draws CC0 | Yes |
| `src/glade/` (the glade: sky, ground, stream, trees, flowers, grass, the far wood, the hills) | Written by Patch for this demo, all of it made in code | MIT; what it draws CC0 | Yes |
| `src/hood.js`, `src/main.js` | Written by Patch for this demo | MIT; what it draws CC0 | Yes |
| `src/figure/man.js`, `animator.js`, `player.js`, `input.js`, `camera.js`, `hands-anymove.json` | Patch's starter man (patch-lab, `starter-character-combined`), copied with three small changes: the three.js import, a loading-progress callback, and a caught pointer-lock refusal | CC0 1.0, Patch | Yes |
| `public/figure/starter-man.glb` | Patch's starter man: built with MPFB2 from MakeHuman system assets (the body, `male_casualsuit06`, `shoes05`, `short01` hair), rigged by Patch onto the Universal Animation Library's skeleton, its pictures taken out. The demo uses his skeleton only; his body is never drawn | CC0 1.0 (MakeHuman's system assets are released as CC0) | Yes, in Git LFS |
| `public/figure/starter-man-clips.glb` | Quaternius' Universal Animation Library 1 and 2 (idle, walk, jog, strafes, turns, jumps), and Patch's own clips made with anymove (run, sprint, starts, stops, the tired idle). The file is rewritten by `tools/compact-glb.mjs`, which leaves out data no clip reads; the clips themselves are unchanged, byte for byte | CC0 1.0 (Quaternius); CC0 1.0, Patch | Yes, in Git LFS |
| `src/figure/rapier/` | Rapier 0.21.0, `@dimforge/rapier3d-compat`, as vendored in patch-lab | Apache-2.0, `src/figure/rapier/LICENSE`, shipped as `RAPIER-LICENSE.txt` | Yes |
| `lib/patch-block.js` | Patch's block helper, from patch.gg/patch-block.js | Patch's, shipped with every block | Yes |
| `shots/` | Stills of this demo | CC0 1.0, Patch | Yes, in Git LFS |
| three.js 0.186.1 | npm | MIT | Installed by npm; its notice ships as `THIRD-PARTY-NOTICES.md` |

No picture, model of a made thing, or sound is stored or copied: the only files loaded are the figure's skeleton and his clips.

**Nothing here has no stated source.**
