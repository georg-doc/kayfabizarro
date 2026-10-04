repo: georg-doc/kayfabizarro
branch: chat/gds-theatre-curtain-v1-2026-09-20
path: game-ready/theatre-curtain-v1/, kfb-hub/stage/game-dev-studio/theatre-curtain-v1/
secondary_repo: mrdoob/three.js@master (read-only reference: examples/webgpu_compute_cloth.html)

## Last sync
date: 2026-09-23T23:22:58Z

### Updated in this project
- Copied the v1 donor runtime (`kfb-theatre-curtain.mjs`) verbatim, then evolved it in-project: tie/untie bulge-curve state, alternating quad-diagonal triangulation, analytic per-vertex normals (cross(tangent,bitangent) from live neighbors, replacing `computeVertexNormals()`), anisotropic filtering, brighter lighting, HUD hide toggle.
- Built `KFB Theatre Curtain.dc.html` as a thin DC wrapper (mirrors `lab.mjs`/`index.html` controls) mounting the runtime via dynamic import.
- Pulled `mrdoob/three.js` `examples/webgpu_compute_cloth.html` (pinned commit 7300402f96c23bfa2174ffc0da01fb4e277d33da) read-only into `Three.js Donor - webgpu_compute_cloth.html` as a live 1:1 comparison mount — confirmed it has no fabric textures at all and computes normals analytically per quad, explaining why it never showed the KFB build's stripe artifact.
- Hard-reset the prior SVG/CSS curtain attempt per Georg's recovery instructions — replaced, not repaired.

## Screen map
| Project screen | Repo source |
|---|---|
| KFB Theatre Curtain.dc.html | georg-doc/kayfabizarro@chat/gds-theatre-curtain-v1-2026-09-20: game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs (base, then extended in-project); kfb-hub/stage/game-dev-studio/theatre-curtain-v1/index.html + lab.mjs (control-bar/wiring reference only, not copied as files) |
| Three.js Donor - webgpu_compute_cloth.html | mrdoob/three.js@master: examples/webgpu_compute_cloth.html (read via github_read_files, mounted verbatim except CSS/HDR asset paths pointed at threejs.org) |
