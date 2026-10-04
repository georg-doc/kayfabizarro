# Prep evidence · KFB Environment Atlas Site 01

Status: **PREP CHECKS 22/22 PASS · SITE NOT IMPLEMENTED**
Date: 2026-10-04

## Branch state at evidence run

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/kfb-environment-atlas-site-prep-2026-10-04`
- Base head: `9c2fee62b815f19cf967867f54985bd22e3f222b`
- State before this evidence commit: 2 commits ahead / 0 behind
- Files before this evidence commit: exactly `WORK_BRIEF.md` + `SOURCE_MAP.json`

## Static prep checks

Result: **22/22 PASS**

1. `SOURCE_MAP.json` parses as JSON.
2. Current source map contains exactly 3 currently proven Hex families.
3. Current source map contains 12 initial building-bearing KayKit/Kenney pack entries.
4. Reserved human route is a direct `kayfabizarro.pages.dev/kfb-hub/stage/...` URL.
5. ChatGPT Site URL remains `NOT_CREATED`; no fake URL was invented.
6. Current source evidence resolves to exactly 2 KayKit hex-capable families + 1 Kenney Hexagon family.
7. Visible-source firewall contains the 3 current banned-by-default legacy patterns.
8. Literal “Data Generator” lane remains `SOURCE_REQUIRED` rather than being invented.
9–20. All 12 building pack Registry shards were fetched and their current `assetCount` matched the pinned source map:
   - KayKit City Builder Bits: 45
   - KayKit Medieval Builder: 233
   - KayKit Medieval Hexagon: 240
   - Kenney Building Kit: 84
   - Kenney Castle Kit: 86
   - Kenney City Kit Commercial: 48
   - Kenney City Kit Industrial: 34
   - Kenney City Kit Suburban: 49
   - Kenney Factory Kit: 148
   - Kenney Fantasy Town Kit: 168
   - Kenney Modular Buildings: 115
   - GLB/Kenney Hexagon Kit mirror: 72
21. `media/3D_Assets/CATALOG/DEDUP_REPORT.md` contains both `GLB_hexagon_kit` and `kenney_hexagon-kit`, supporting the no-double-count rule.
22. Branch diff before this evidence commit contained exactly the two intended prep files and no unrelated edits.

## Source observations carried into Work

### Hex identity

The current repository does **not** prove three distinct KayKit Hex packs under the wording used in chat. It proves:
- KayKit Medieval Hexagon;
- KayKit Medieval Builder, with 128 measured hex tiles;
- Kenney Hexagon Kit, mirrored as `GLB_hexagon_kit` and duplicated by alias elsewhere.

This is an explicit source-identity audit item, not a request back to Georg and not permission to fabricate a third KayKit pack.

### Clay visual standard

The current Clay Style SSOT and Golden Matrix are on `work/clay-style-ssot-2026-10-01`, not `main`.

Verified blobs:
- `KFB_CLAYMATION_STYLE_SSOT.md` → `435b9ca51ce23b1d8c36c7cc89c65c2b1e03b65a`
- `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` → `5d37512ed6583c1f0f005397fe0721dbbfb8bae5`

The building comparison contract is therefore source-first:
`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`.

`building_A` is Golden master; `building_E` is Golden support. A Kenney building is currently required as unchanged-source evidence but is not automatically Golden.

### World / Hex owner

Current `tools/world_atlas` remains the owner surface. Its current promoted source contains:
- Hex Realm S11/S12;
- measured `hex-grid.js`;
- Dungeon Generator S13.2;
- an existing public `/world-atlas/` surface.

Feature-parity docs explicitly show that several requested atlas data/preset capabilities remain partial/missing. The new Site must expose real status, not imply those gaps are already implemented.

### Recovery evidence boundary

The 2026-09-20 Hex failure handoff contains useful measurement/catalog evidence, including the edge atlas and part sheets, but its failed scene/Bauvorgaben work is not an authority for the new Site UI or composition.

### OSM/Hürth firewall

The current 2026-10-04 postmortem and source firewall are binding. The Site must not load or silently fall back to:
- `fixtures/huerth-b1-siblings-v0.json`
- `tools/osm-city-lab/`
- `elastic-grotesque-clay-huerth01`

Mechanism provenance can be documented separately; visible content is denied by default.

### “Data Generator”

Repository searches for literal:
- `Data Generator`
- `Data-Generator`
- `Daten Generator`
- `Daten-Generator`
- `Datengenerator`

returned no current named artifact.

Related exact sources do exist:
- Hex Terrain Generator v1 brief;
- Babel Hex Platform Generator brief/recovery;
- World Atlas Hex Realm;
- Dungeon Generator S13.2;
- R2C/R2D environment recipe work.

Work should resolve Georg's intended “Daten Generator” against those exact sources or another discovered named artifact before adding that label.

## Site precedent

KFB Production Control confirms the current Asset Librarian Site pattern:
- existing Asset Librarian Registry remains source owner;
- private ChatGPT Site may be a dedicated projection/work surface;
- GitHub contract/Return stays separate;
- no Cloudflare or Live replacement is implied by Site creation.

For this Site, the stricter current KFB workflow applies: the **human test/acceptance surface must additionally be the reserved direct Cloudflare Stage route**, linked from KFB Hub and opened at the exact revision before `PUBLIC_VERIFIED`.

## What has not been tested

- no Site implementation exists yet;
- no browser/WebGL Site route exists yet;
- no screenshots exist yet;
- no Cloudflare Stage exists yet;
- no ChatGPT Site URL exists yet;
- no Georg visual/catalog acceptance has occurred.

Those are Work execution gates, not Prep PASS claims.
