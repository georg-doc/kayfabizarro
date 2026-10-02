# RETURN · HEX-BLENDER-BENCH-01 · Hexagon + Builder packs vs procedural P1/P2 · 2026-10-02

From: Coworker / Blender. To: WSA / World Corridor owner, Georg.
Handoff: PR #317 · `chatgpt-web/hex-blender-handoff-2026-10-02` @ `f4f3fdb`. Working branch: `blender-mcp/hex-blender-bench-2026-10-02`.
Status: **candidate-only · sprints 1–4 done · no runtime or FPS claim · nothing merged**.

Start with `HEX_BENCH_contact.jpg` (one page: donors, procedural controls, material bench, building seeds, scenelets).

## 1 · Problems and deviations first

1. **Headless Blender, not the local Blender MCP app.** Everything ran in Blender 5.0.1 as the `bpy` module in the Coworker cloud workspace, the same setup as the eye-cleanup and P0A jobs. The `.blend` files and scripts open in a desktop Blender; nothing depends on the local app.
2. **Scale is an open product decision.** The two worlds do not share a unit:
   - The Hexagon pack is a diorama. A tile is 2.0 wide, the windmill 1.46 tall and a pine 1.20, but a barrel is already 0.21.
   - P1/P2 are built in WC1 metres or their own donor worlds. The P0B tree is 2.18 tall (taller than the windmill), and the T3 accent rock is 9.46 wide (`evidence/02b_native_scale_mismatch.jpg`).
   - In the scenelets I scaled each procedural source world with one factor: P0B 0.55 (tree matched to the KayKit tree height), K1 0.40, T3 0.08, P2 0.50. **Only the P0B factor is derived from a source.** The other three I picked by eye.
   - If a WC1 cell stays at 17.32 m flat-to-flat, a KayKit tile scales ×8.66: the windmill becomes 12.6 m and a barrel 1.8 m. Resident scale against the KayKit props therefore needs one explicit decision.
3. **Slope tiles have no height in the browser catalog.** `hex_grass_sloped_*` are stored as `gggggg` and `hex_road_A_sloped_*` as `sggsgg`, with no level. Measured in Blender:

   | Tile | Edge 3 (low) | Edges 0 / 1 / 5 (high) | Edges 2 / 4 (side) |
   |---|---|---|---|
   | `*_sloped_high` | y ≈ 0.05–0.10 | y = 1.0 | y ≈ 0.54 |
   | `*_sloped_low` | y ≈ 0.00–0.05 | y = 0.5 | y ≈ 0.28 |

   - Because the side edges sit at mid height, they can meet neither a flat neighbour at level 0 nor one at level 1 without an exposed cliff (visible in scenelet 2).
   - A solver cannot place these tiles until the catalog carries a level/slope axis.
4. **Seam step at the low end of the ramp.** `hex_road_A_sloped_high` starts at y 0.05 at its low edge, while coast sand sits at −0.05 and flat road at 0.00. Along the shared edge in scenelet 2 the step is 0.09 at the edge centre and up to 0.20 at the corner, where the coast's water level begins. At WC1 scale that is about 0.8 m.
5. **The Builder pack is a second visual language.**
   - Its hex tiles have their deck at y = +1 (Hexagon: 0) and earth-coloured sides.
   - Its objects use 4–5 flat colour materials each; the Hexagon pack uses one atlas.
   - I classified it SKIP/OPTIONAL rather than mixing the two.
6. **The material bench is a Blender approximation of Global Clay Lite, not the shader.**
   - The packed texture, triplanar weights, colour modulation and roughness mix follow the pinned `global-clay-pack.v1.js` and `clay-material.v10` exactly.
   - The relief is a Bump node on the value channel, scaled to the shader's slope, not the RG-gradient code itself. Web must confirm the look in the browser.
7. **K1_BOULDER renders faceted.** The P1 module emits it non-indexed (2,160 vertices = 3 × 720 triangles), so normals are per face. I kept it as the module builds it.
8. **Building seeds are kit-bashed.**
   - Loose parts: home_A 281, home_B 475, tavern 973.
   - The Elastic Grotesque / LOOK-TORSION fields need a continuous shell with at least 4 meaningful Y rings, and FACADE_RULE needs wall regions. Neither exists in these meshes.
   - The seeds are good for proportions and the body/roof/plinth bands. Deforming them means one object-normalised frame over all parts (the Cartoon-Verbieger rule) or re-meshed walls. That is the next building gate, not done here.
9. **Not my scope, found in PR #317:** the new Hub card in `kfb-hub/index.html` (line 215) contains a literal `\n` between two object literals (`].join('\\n')},\n{id:'worldbuilder-zone-seam-restart'`). That is a JavaScript syntax error in the briefings array and likely why the Cloudflare preview build for `f4f3fdb` failed. Untouched.
10. **No performance statement.** Blender cannot measure fragment cost, draw calls or instancing gains. Those are listed as hypotheses in section 6.

## 2 · Answers to the six questions

**1 · Which authored Hex modules stay core?** (USE, 95 files)
- Ground: `hex_grass`, `hex_water`.
- The complete road set A–M (all 13 non-empty edge subsets).
- Coast A–E (the island ring the coast solver uses).
- Bare hills and mountains (massing with no procedural equivalent).
- Small resident props: barrel, crates, sack, pallet, lumber/stone piles, wheelbarrow, tent, buckets.
- Normal buildings: home_A, home_B, tavern, blacksmith, market, well.
- Landmarks: church, windmill, watermill, lumbermill, mine. The windmill fan, watermill wheel and lumbermill saw are separate meshes, so they can animate without re-authoring.

**2 · Which roles go to the procedural families?**
- Tree: P0B soft tree.
- Bush: T3 2–3 lobe bush. The Hexagon pack has no bush.
- Rocks: pebble, boulder and accent rock (P0B, K1, T3).
- Mushrooms and grass tufts: P2. Neither exists in the Hexagon pack.
- Logs and stumps: authored hero (`resource_lumber`, cut-forest fields) plus P2 soft siblings.
- Reason: the KayKit pines and rocks are faceted low-poly (18–220 tris), which the Golden extraction rules out as the target language.
- KayKit forest clumps stay OPTIONAL as far filler if procedural trees prove too costly in bulk.

**3 · Which buildings are good reusable seeds?**
- `home_A`: the plain gable house.
- `home_B`: a two-storey townhouse on a plinth. Its height makes the height-dependent torsion meaningful.
- `tavern`: a hero normal building whose barrel sign can carry stronger deformation than its body (the LandmarkElastic principle).
- Each type has one geometry in four colourways. The 18 types × 4 are vertex-identical; only the UVs move on the shared atlas.
- Builder `house` is a style comparison only.

**4 · Where can `clay_floor_001` be one shared material?**
- Across the whole Hexagon pack: all 221 files share one material and one atlas. With the import duplicates merged, the bench scene ran on 1 Hexagon material plus 1 procedural material, with the atlas plus one packed texture.
- Source identity survives: roof blue, timber, road/sand/water boundaries and edges stay readable, because clay only shifts value (±22 %) and roughness.
- Pattern density depends on world scale:
  - at WC1 cell scale (×8.66) it is fine and subtle;
  - at hex-native scale (×1) it reads clearly as clay on the large decks and turns blotchy on small parts such as the chimney.

**5 · What is worth PREPARE or SKIP?**
- PREPARE (10 files):
  - the four slope tiles (level field first);
  - hills/mountains with baked pines (use the bare version plus procedural trees).
- SKIP (246 files):
  - all Builder tiles and square tiles;
  - Builder nature and military objects;
  - KayKit single pines and single rocks;
  - waterless coast and river variants (`hex_river_L_waterless` stays UNPROVEN/SKIP as briefed);
  - the catapult projectile.
- OPTIONAL (96 files): rivers, walls/fences, construction stages, military buildings, forest clumps, stumps, shore plants, clouds, Builder buildings.

**6 · What must Web/browser measure?** See section 6.

## 3 · What was done

**Sprint 1 · source truth**
- Checked out the handoff head sparsely. All 9 manifest blobs match. The pack roots have no diff against `378b209`, and both packs are CC0.
- Imported all 447 models in Blender and measured them in the three.js frame.
- All 230 browser-loaded rows match S0 exactly (triangles, size and min within 0.002). The 217 deferred rows are newly measured, including the windmill: 2,653 tris, 1.13 × 1.46 × 0.82, 3 meshes.
- Rendered the five donors in isolation with edge labels 0–5. Every rendered edge class agrees with the catalog.
- The coast_B water centroid comes out at 88.7°, reproducing the hex-grid.js ground truth.
- Ran the P1/P2 modules unchanged under node with three 0.160. The five P1 facts match the P1 test report exactly, and all 12 controls were rendered in isolation.

**Sprint 2 · kit**
- Thumbnails of every non-tile family.
- 31 family groups classified, with no file left out and none counted twice.
- Role table authored vs procedural.
- Colourway identity check.
- Structure analysis of 12 building candidates: loose parts, face classes, vertical rings.

**Sprint 3 · material and composition**
- Rebuilt the Global Clay Lite pack from the pinned `clay_floor_001` maps with the pinned formula.
- Bench: neutral vs clay at ×8.66 and ×1, overview and close.
- Three scenelets built from recipes. Each one runs:
  - an edge-class audit;
  - a deck-height seam audit;
  - prop support by downward ray;
  - a walk ring per density profile;
  - an anchor clearance check.

**Sprint 4 · this return**

## 4 · Scenelets

| | Cells (odd-r, rotation) | Idea | Props LOW / TARGET / MAX | Free walk-ring samples LOW / TARGET / MAX |
|---|---|---|---|---|
| 1 | (0,0) `hex_grass` | Rule of Three: P0B tree leader, two T3 bushes, K1 boulder accent, tufts, mushrooms | 2 / 5 / 8 | 20 / 13 / 10 of 24 |
| 2 | (0,0) `hex_coast_B` r0 · (1,0) `hex_road_A_sloped_high` r0 | Beach → uphill road; sand↔sand seam; rock leader + companions; log separator | 2 / 5 / 8 | 42 / 37 / 36 of 48 |
| 3 | (0,0) `hex_grass` · (1,0) `hex_road_M` r3 (180°) · (0,1) `hex_grass` | Tavern plaza: tavern faces the dead-end road with the well; home_A faces the plaza; nature cluster behind | 4 / 9 / 12 | 55 / 46 / 43 of 72 |

- **All inter-cell edges match** (scenelet 2: s/s; scenelet 3: g/g ×3). Open edges are listed as sockets with class and deck height, for example scenelet 3's road entry at edge 0 (class s, y −0.05).
- **Anchors:** 10 resident anchors, all clear of prop footprints.
- **Height relation (scenelet 2):** `road_foot` is at y 0.19 and `road_top` at 0.93. The ramp's high edge 0 is open and needs a level-1 neighbour.
- **Supports:** every prop stands on a measured deck with tilt 0°. One grass tuft first landed on a 45° ramp bank, so I moved it to flat ground.

## 5 · Files

- `RETURN.md` (this file), `SOURCE.json`
- `asset_inventory.json`: 447 rows, Blender measurements plus agreement with browser S0.
- `asset_classification.json`: 31 families USE/PREPARE/OPTIONAL/SKIP with one reason each, the role table and the building seeds.
- `BLENDER_MEASUREMENTS.json`: donors, slope heights, deck levels, colourways, building structure, procedural facts and scale hypotheses.
- `MATERIAL_BENCH.json`
- `SCENELET_RECIPE_1CELL.json`, `SCENELET_RECIPE_2CELL.json`, `SCENELET_RECIPE_3CELL.json`: semantic recipes, not baked.
- `SOCKETS_SUPPORT.json`
- `HEX_BENCH_contact.jpg`
- `evidence/`:
  - `01` donors;
  - `02` procedural controls, `02b` scale mismatch;
  - `03` family sheets;
  - `04` material bench;
  - `05` building seeds;
  - `06` scenelets.
- `source/`: scripts, `README.md`, and three scenelet `.blend` files (images referenced by path, not packed). The rebuilt Clay Lite PNG is not committed; `pack.py` recreates it.

## 6 · Hypotheses only the browser can settle

1. **Atlas instancing:** one Hexagon material plus atlas allows merging or instancing a whole island into very few draw calls. Measure calls and frame time for 1 / 25 / 100 scenelet copies.
2. **Procedural vs authored trees in bulk:** P0B tree 1,704 tris vs KayKit `trees_B_large` 1,540 tris for a whole clump. Measure the frame-time difference at forest density before choosing the far-filler path.
3. **`clay_floor_001` on the Hexagon atlas:**
   - Cost against neutral at WC1 scale, with the same sequence as the WC1 Global-Clay-Lite run.
   - Whether the shader's RG relief matches this bench's look at ×8.66.
4. **Scale:** the resident-to-tile ratio at ×8.66, and whether KayKit props (barrel 1.8 m) need their own factor.
5. **Ramp seam:** whether the 0.09–0.20 native step reads as a visible lip at runtime scale and needs a skirt, or a choice between `_low` and `_high`.
6. **Animated parts:** cost of animating the separate windmill, watermill and lumbermill meshes vs keeping them static.

## 7 · Exactly one next gate

**Web: the catalog level field plus the scale decision**, then browser measurement of hypotheses 1–3 with the scenelet recipes. Georg only needs to answer the scale question. Nothing here is merged; Draft PR only.
