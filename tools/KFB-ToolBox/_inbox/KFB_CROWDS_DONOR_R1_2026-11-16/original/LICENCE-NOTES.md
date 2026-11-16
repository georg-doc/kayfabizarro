# Where every part came from

| Part | From | Licence | In this repo |
|---|---|---|---|
| The navmesh and the crowd's steering | [Recast and Detour](https://github.com/recastnavigation/recastnavigation) by Mikko Mononen and contributors | zlib, © 2009 Mikko Mononen | through npm, notice in `third-party/LICENSE-recastnavigation.txt` |
| The browser build | [recast-navigation-js](https://github.com/isaac-mason/recast-navigation-js) 0.44.0 by Isaac Mason: `recast-navigation`, `@recast-navigation/three`, and their `core`, `generators` and `wasm` | MIT, © 2025 Isaac Mason | through npm, notice in `third-party/LICENSE-recast-navigation-js.txt` |
| Ambient occlusion | [N8AO](https://github.com/N8python/n8ao) 2.0.1 by N8python, with [postprocessing](https://github.com/pmndrs/postprocessing) by Raoul van Rüschen, which it imports | MIT; Zlib | through npm |
| three.js | the three.js authors | MIT | through npm |
| The API in metres, groups, arrivals, milling about, walking glue, instanced figures, levels, demo | Patch | MIT, © 2026 Patch | `src/` |
| Town pieces | [Kenney, Fantasy Town Kit 2.0](https://kenney.nl/assets/fantasy-town-kit), from Patch's mirror of the zip | CC0 | `public/models/kit-town.glb` (`make-kits.mjs`) |
| Castle pieces | [Kenney, Castle Kit](https://kenney.nl/assets/castle-kit), from Patch's mirror of the zip | CC0 | `public/models/kit-castle.glb` (`make-kits.mjs`) |
| The mannequin | Patch's 1.8 m scale figure, at about 2,800 triangles | CC0, Patch | `public/models/mannequin.glb` (`mannequin/`) |
| The mannequin's clips | [Quaternius, Universal Animation Library 1 and 2](https://quaternius.com/packs/universalanimationlibrary.html): Idle_Loop, Idle_Talking_Loop, Idle_FoldArms_Loop, Walk_Loop, Jog_Fwd_Loop, Sprint_Loop, retargeted | CC0 | in `mannequin.glb` |
| The Level choice's pictures | stills of this demo (`make-thumbs.mjs`) | CC0, Patch | `thumbs/levels/` |
| Red Hat Mono 500 | The Red Hat Project Authors | SIL OFL 1.1 | `fonts/` |

Everything else in the demo (the ground's paint, the hedges and their leaves, the floating rock, the bridge, the sky, the stone block and its dust) is drawn by `src/levels.js` and `src/demo.js`, MIT.

zlib is a short permissive licence in the same family as MIT: keep the notice, and don't claim you wrote it. Nothing here is from a store or under game-only terms. There is no sound.
