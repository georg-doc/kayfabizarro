# KFB Cartoon Map Board

**Status:** P0.2 IMPLEMENTATION · STORY FOCUS ADDED · BROWSER / CLOUDFLARE RESULT NOT YET CLAIMED

Browser entry: `tools/kfb-cartoon-map-board/index.html`

Intended public entry after the normal Pages deployment:

`https://kayfabizarro.pages.dev/tools/kfb-cartoon-map-board/`

## Decision / ownership

This tool is a **presentation + interaction consumer** for geographic data. It does not replace the existing owners:

- `tools/osm-city-lab/` remains the owner for detailed OSM city normalization, local-metre city geometry and city export.
- `skills/kfb-ink-canon.js` remains the SSOT for the KFB **card** ink edge. Its own contract says card ink lives in image space. This map therefore uses a separate, non-destructive **Map BAND Adapter** in the map plane. The adapter imports the canon only to verify the capability/version and reuse the canonical ink colour; it does not redefine the card contract.
- `media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/` remains the asset source. The P0 loads the actual GitHub GLTFs; it does not rebuild substitute meeples/tokens.
- KFB CardBuilder / PDF cards are a later consumer layer, not silently bundled into P0.

## P0 / P0.2 implementation

The first vertical slice is a Europe board:

- OSM-derived country boundaries are resolved at runtime from the OpenPlanetData v2 boundary catalogue (OpenStreetMap-derived GeoJSON).
- Each country is an independent extruded Three.js puzzle piece with a paper/cartoon material, physical shadow and click selection.
- Borders are continuous filled ribbon geometry rather than line-segment tubes. They use deterministic long-wave wobble and a south-east directional width bias so the lower/right-facing edge reads heavier, matching the KFB ink/shadow logic.
- `EXPLODE` separates country pieces while preserving their geography; `RECOMBINE` restores them.
- Orbit camera presets: HERO, TOP, LOW.
- Real KayKit Board Game Bits are loaded for Berlin, Paris, Rome, Warsaw and London as content markers.
- Labels, tokens, ink gain and piece height are interactive.
- P0.2 adds deterministic paper texture, hover discovery, a selected-country focus ring and smooth camera moves.
- `FOCUS` frames the selected tile; `NEXT STORY` cycles declarative story anchors from `data/story-demo.v1.json`.
- KayKit story markers are children of their country tile, so EXPLODE / RECOMBINE cannot detach content from geography.
- `data/europe-p0/SOURCE_SPEC.json` records the current live OSM-derived source contract.
- No raster map tiles are used as the country geometry.

## Data path

```text
OpenPlanetData boundary catalogue
  -> v2 country GeoJSON derived from OpenStreetMap
  -> Europe polygon filter + projection
  -> deterministic contour simplification
  -> independent extruded country pieces
  -> KFB Map BAND Adapter + physical shadows
  -> KayKit board-game markers
```

The P0 is intentionally runtime-fed so the visual/interaction idea can be tested immediately. A promoted production version should cache and pin the selected boundary snapshot in this repo with provenance/checksum, following the same deterministic-source discipline as `osm-city-lab`.

## KFB ink relationship

The card-ink SSOT explicitly requires card ink to stay on the image plane. A geographic border is a different rendering problem: it must remain attached to a world-space country tile while the board is orbited, exploded and recombined.

P0 therefore implements an adapter with the same **BAND semantics** (one continuous filled ribbon, not a noisy polyline), but gives it map-specific responsibilities:

1. follow a projected OSM ring;
2. add restrained deterministic contour wobble;
3. thicken the outward edge toward south-east / lower-right;
4. stay `toneMapped:false` so the ink reads as print rather than lit plastic;
5. remain a child of the country piece so explode/recombine cannot desynchronise it.

This is **implementation**, not a new canon decision. If the map treatment is accepted, a later change can extract a generic ribbon kernel only with the existing ink owner preserved.

## Controls

- Drag: orbit
- Wheel / pinch: zoom
- Click country: select and lift
- `HERO`, `TOP`, `LOW`: smooth camera presets
- `FOCUS`: frame the selected country
- `NEXT STORY`: cycle through data-driven KayKit content anchors
- `EXPLODE`: separate / recombine country pieces
- `LABELS`: toggle country names
- `TOKENS`: toggle KayKit markers
- `INK`: border weight
- `HEIGHT`: country relief

## Tested result

As of 2026-09-18:

- `src/app.js`: `node --check` **PASS**.
- Repo/source review against current `osm-city-lab`, `kfb-embed-bundle v3`, KFB ink SOP and KayKit BoardGameBits: **PASS** for ownership/path assumptions.
- Browser/WebGL execution: **NOT YET RUN** in this handoff.
- Cloudflare Pages publication: **NOT YET CLAIMED** until the deployed URL is read back.
- Georg visual acceptance: **OPEN**.

## Next slices

1. **P0.2 browser/visual acceptance:** inspect the deployed board, then tune board scale, palette, ink wobble, south-east weight and KayKit marker scale from screenshots.
2. **P1 deterministic data:** cache/pin Europe boundary GeoJSON + provenance/checksums instead of depending on the live catalogue at runtime.
3. **P2 hierarchy:** continent -> country -> region -> city, reusing `osm-city-lab` where detailed street/building geometry begins.
4. **P3 story expansion:** route arcs, multi-anchor sequences and timed explode/recombine choreography.
5. **P4 KFB cards:** instantiate KFB CardBuilder/PDF cards above map anchors, keeping card ink on its own image-plane contract.
6. **P5 authoring:** save/load scenes with map level, focus area, token/card placement and camera state.

## Attribution

Map data © OpenStreetMap contributors, ODbL 1.0. Boundary delivery in P0: OpenPlanetData. KayKit assets are loaded from the existing KFB asset repository and remain under their source licence/provenance.
