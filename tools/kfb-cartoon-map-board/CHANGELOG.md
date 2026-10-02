# Changelog · KFB Cartoon Map Board

## 2026-09-18 · P0

### DECISION
- New additive tool folder: `tools/kfb-cartoon-map-board/`.
- Do not repurpose `osm-city-lab` or `world_atlas`; consume their contracts/donors instead.
- Preserve `kfb-ink-canon.js` as card-ink SSOT; world-space geographic borders are implemented as a map adapter, not a replacement canon.
- Use actual KayKit BoardGameBits from the central GitHub asset repository.

### IMPLEMENTATION
- Added Europe 3D board shell and Three.js orbit viewer.
- Added OSM-derived country GeoJSON resolver through OpenPlanetData v2 catalogue.
- Added independent country extrusions, selection lift, explode/recombine, country labels and camera presets.
- Added filled Map BAND ribbon with deterministic wobble and south-east edge weighting.
- Added actual KayKit GLTF markers for Berlin, Paris, Rome, Warsaw and London.
- Added ink / relief controls and explicit OSM attribution.

### TESTED RESULT
- `node --check src/app.js`: PASS.
- Browser/WebGL visual run: NOT YET RUN.
- Public Pages deployment: NOT YET VERIFIED.
- Georg acceptance: OPEN.


## 2026-09-18 · P0.2 Story Focus

### DECISION
- Story anchors are declarative demo content, not card canon.
- KayKit map content must remain registered to its geographic owner during explode/recombine.
- Live-boundary provenance is made explicit in `data/europe-p0/SOURCE_SPEC.json`; this is not yet a pinned snapshot.

### IMPLEMENTATION
- Added deterministic paper texture generation.
- Added hover feedback and selected-country focus ring.
- Added smooth camera choreography plus `FOCUS` and `NEXT STORY`.
- Added `data/story-demo.v1.json` as a data-driven content-anchor manifest.
- Reparented KayKit markers to their country tiles and counter-scaled marker Y against the HEIGHT presentation control.
- Added P0.2 story-focus documentation.

### TESTED RESULT
- GitHub source readback confirms the P0.2 files are on `main`.
- GitHub Pages build/deployment workflow has been triggered for the new commits; that is separate from the canonical Cloudflare `kayfabizarro.pages.dev` deployment.
- Browser/WebGL execution of P0.2: NOT YET CLAIMED.
- Cloudflare public deployment: NOT YET VERIFIED.
- Georg visual acceptance: OPEN.


## 2026-09-19 · WSA handoff / review check-in

### DECISION
- WSA / Race remains integration lead.
- Map Board stays a non-owning presentation/story donor.
- No Race/Travel movement, physics, collision, camera, persistence, Card or OSM City owner is replaced.

### IMPLEMENTATION
- Added `HANDOFF_WSA_2026-09-19.md` with exact source pins, owner map, protected boundaries, tested status and the complete ordered backlog.
- Added `RETURN_WSA_2026-09-19.md` as the compact recovery/check-in return.
- README and Recovery now route the next reviewer through the WSA package.

### TESTED RESULT
- No new runtime/browser PASS is claimed by this documentation-only handoff.
- Existing static/source PASS is preserved.
- Current real-browser P0.2 proof, exact Cloudflare deployment and Georg visual acceptance remain OPEN.

### OPEN
- First gate: run the existing P0.2 public proof against `p0.2-r7-solid-country-tiles`.
- Exactly one WSA review question is recorded in the handoff document.
