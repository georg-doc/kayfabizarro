# Quaternius "Stylized Nature MegaKit" (PRO + SOURCE): study for the KFB rock kit

Date: 2026-10-10. Scope: observation and measurement only. Nothing was built for KFB.
Inputs: `Stylized Nature MegaKit[Pro].zip` (180 MB) and `Stylized Nature MegaKit[Source].zip` (718 MB), bought by Georg.
Unpacked to `~/KFB-AssetCache/quaternius/StylizedNatureMegaKit_PRO/` and `…_SOURCE/`; the nested engine zips went to `…_SOURCE/_engine_unpacked/`.
Method: glTF accessor parsing (Python `-I`), plus headless Blender 5.2.2 (`-b --disable-autoexec`, RSS/runtime watchdog, peak RSS 1.1 GB) for geometry, texture sampling, vertex colours and renders. Engine projects were read as text only.
Companion files: [shader_notes.md](shader_notes.md) and [palette.json](palette.json). All raw measurements come from the scripts in the session scratchpad (not shipped).

> **Short version (German):** Quaternius has no rock shader and no moss geometry. The whole rock look is *one painted texture*.
> It has dark, ground-green feet that turn into bright grey tops, light edges, dark crevices and a few moss flecks.
> The rocks sink up to 20 % into the ground, and their undersides are painted ground colour. Grass and tree trunks follow the same rule
> (dark/green at the root, bright at the top), so no contact edge ever becomes a hard line.
> For KFB we take over the *principle* (ground tint + sinking + root darkening + plane hierarchy), but not the painted light (it fights clay).

---

## 1. Inventory

### Licence
- `License_Pro.txt` and `License_Source.txt`: **CC0 1.0 Universal (public-domain dedication)**. "Models by @Quaternius". Supporting him via Patreon is welcome but not required.
  CC0 places no restriction on redistribution, modification or commercial use, and needs no attribution. Crediting Quaternius is still good practice.
- Versions: Standard = 68/116 models (already at `~/KFB-AssetCache/quaternius/StylizedNatureMegaKit/`), PRO = 116/116, SOURCE = 116 + Blender files + engine projects "with the stylized shader already set up" (Godot 4.2.2, Unity URP 2022.3.3, UE 4.27.2).
  PRO-only rocks: **Rock_Big_1, Rock_Big_2, Rock_Medium_4**.

### Formats (PRO)
| Folder | Files | Size |
|---|---|---|
| glTF (`.gltf`+`.bin`, external PNG) | 116 models, 36 textures, plus one stray `Birch_4GLB.glb` | 83 MB |
| FBX / FBX (Unity) | 116 each | 19 MB each |
| OBJ (+mtl) | 116 | 33 MB |
| Textures | 36 PNG (5× bark 2048² + normal maps, leaves cards 1024–2048², Rocks 2048², PathRocks 1024², Grass 512², Noise_Wind 1024², Noise_Perlin 512²) | 58 MB |

The SOURCE glTF/FBX/OBJ files are identical to PRO. SOURCE adds `Blends/` (116 single `.blend` files plus `All models.blend`, 30 MB) and `Engine Projects/` (Godot 89 MB, UE 204 MB, Unity URP 207 MB, all zipped).

### Models per category (PRO, glTF accessor counts; height = glTF Y extent)
| Category | n | Triangles | Height (m) |
|---|---|---|---|
| Trees (Birch, CherryBlossom, CommonTree, DeadTree, GiantPine, Pine, TallThick, TwistedTree × 5) | 40 | 1 646–14 739 | 7.0–19.0 |
| Bushes | 6 | 522–5 393 | 1.6–3.3 |
| Grass | 7 | 155–1 190 | 1.1–1.9 |
| Flowers | 12 | 93–1 690 | 0.15–2.5 |
| Petals | 6 | 13–71 | 0.2–0.5 |
| Plants | 10 | 48–560 | 0.25–3.8 |
| Clover / Fern | 4 | 180–615 | 1.1–2.7 |
| Mushrooms | 4 | 704–3 216 | 0.46–1.8 |
| **Rocks (Big/Medium)** | **6** | **244–1 944** | **1.9–4.6** |
| **Pebbles (Round/Square)** | **11** | **48–136** | **0.09–0.17** |
| **RockPath tiles** | **10** | **559–3 500** | **0.10–0.18** |
| **Total** | **116** | **341 962** | |

**What the kit does *not* contain:** no cliff meshes, no moss meshes or moss decals, no ground or terrain meshes, no ground-cover carpets. The "cliffs" in the marketing renders are Rock_Big meshes scaled up 2–5× and stacked into each other. Ground and paths there are an engine landscape that is **not shipped**.

### All rock/stone models in PRO (27)
| Model | Tris | glTF size X×Y(up)×Z (m) | Material / texture |
|---|---|---|---|
| Rock_Big_1 / _2 | 1 736 / 1 944 | 5.20×4.58×4.45 / 5.77×3.81×5.82 | Rocks / Rocks_Diffuse 2048² |
| Rock_Medium_1 / 2 / 3 / 4 | 342 / 244 / 522 / 400 | 3.23×2.26×2.99 / 3.05×1.90×2.48 / 3.42×2.32×3.48 / 3.78×2.48×3.61 | Rocks |
| Pebble_Round_1–5 | 114–136 | ~0.41–0.50 × 0.09–0.10 × 0.35–0.49 | PathRocks / PathRocks_Diffuse 1024² |
| Pebble_Square_1–6 | 48–104 | ~0.34–0.46 × 0.13–0.17 × 0.26–0.45 | PathRocks |
| RockPath_Round_Small_1–3 / _Thin / _Wide | 998–1 126 / 2 254 / 3 500 | 1.1–2.1 m square, 0.11 m high | PathRocks |
| RockPath_Square_Small_1–3 / _Thin / _Wide | 559–783 / 1 793 / 2 256 | 0.8–2.1 m, 0.15–0.18 m high | PathRocks |

Desert variants are the same meshes with `Rocks_Desert_Diffuse` / `PathRocks_Desert_Diffuse`.

### Example scenes: the honest finding
**No composed example scene ships in any format.** Godot `Scenes/L_Overview.tscn` (303 nodes), Unity `Scenes/L_Overview.unity` (≈500 prefab instances), UE `Maps/L_Overview.umap` and Blender `All models.blend` are all **catalogue line-ups** on a grid.
The only composed scenes are the four marketing images `Preview_1–4.jpg` (1920×1080). Judging by the UE map content (SkyAtmosphere, VolumetricCloud, Landscape) they are almost certainly UE renders.
§3 therefore measures (a) the shipped line-up with its own light and (b) the preview images, which are clearly labelled as visual estimates.

![Kit line-up (All models.blend, own top-down sun + white world)](renders/kit_lineup_overview.png)

---

## 2. Rocks: how they are built

### Turntables against a 1.8 m reference box (green line = pivot plane z = 0)
![Big rocks turntable](renders/rock_turntable_big.png)
![Medium rocks turntable](renders/rock_turntable_medium.png)

### Anatomy: lit / texture-only (unlit) / wireframe / normal-Z facing
![Rock anatomy](renders/rock_anatomy.png)

Row 2 (unlit, texture only) looks almost the same as row 1 (lit), so **the light is in the texture**.

![Close-up Rock_Big_2: moss flecks on ledges, green ground skirt at the base](renders/rock_closeup_Big_2.png)

### Measurements (Blender, Z-up, headless analysis)
| Rock | Tris | Height | Sunk below pivot | Planar facets ≥2 % area: count / share of surface | Facets for 80 % of area | Largest facet √A / size | Median edge (rel. size) | Edge length at creases >30° | UV islands | Texel density |
|---|---|---|---|---|---|---|---|---|---|---|
| Rock_Big_1 | 1736 | 4.58 m | 0.12 m (2.7 %) | 2 / 23 % | 92 | 0.69 | 0.25 m (4.8 %) | 28 % | 14 | 97 px/m |
| Rock_Big_2 | 1944 | 3.81 m | 0.53 m (13.8 %) | 5 / 13 % | 119 | 0.30 | 0.27 m (4.6 %) | 31 % | 10 | 97 px/m |
| Rock_Medium_1 | 342 | 2.26 m | 0.27 m (12.0 %) | 14 / 55 % | 33 | 0.59 | 0.36 m (11 %) | 39 % | 4 | 97 px/m |
| Rock_Medium_2 | 244 | 1.90 m | 0.05 m (2.7 %) | 14 / 68 % | 22 | 0.72 | 0.40 m (13 %) | 39 % | 5 | 97 px/m |
| Rock_Medium_3 | 522 | 2.32 m | 0.32 m (13.6 %) | 14 / 44 % | 47 | 0.36 | 0.31 m (8.8 %) | 39 % | 6 | 97 px/m |
| Rock_Medium_4 | 400 | 2.48 m | 0.52 m (20.8 %) | 11 / 43 % | 47 | 0.46 | 0.38 m (10 %) | 37 % | 8 | 97 px/m |
| Pebble_Round_1 | 136 | 0.10 m | 0.008 m (8 %) | 10 / 85 % | 8 | 0.72 | 0.06 m | 27 % | 2 | 419 px/m |
| Pebble_Square_1 | 104 | 0.13 m | 0.002 m (2 %) | 9 / 95 % | 6 | 0.98 | 0.11 m | 33 % | 2 | 419 px/m |
| RockPath_Square_Wide | 2256 | 0.18 m | 0.01 m (6 %) | many small stones | 150 | 0.21 | 0.10 m | 41 % | 60 | 438 px/m |

(Planar facet = region grown over neighbouring faces with less than 8° normal difference and less than 18° drift from the seed face.)

**Silhouette types.**
- Medium rocks are single **low boulders with a slab-cut top**: width/height ≈ 1.4–1.6, a flat-ish top plane and 2–4 big side planes.
- Big_2 is a **wide layered ledge stack** (width/height ≈ 1.5).
- Big_1 is a **tall stepped tower** (width/height ≈ 1.1) built from 5–7 stacked blocks.
- Pebbles are flat lenses (height ≈ 0.2–0.5 × width). Round pebbles are tumbled ovals; square pebbles are chipped slabs.

**Facet strategy.** Sculpt, then retopology, then bake. The Blender mesh datablock is named `Cube_Retopology.001`.
- There is **no noise displacement**. Surfaces are big near-planar facets joined by few crisp creases: 28–39 % of all edge length sits at creases sharper than 30°, while 23–35 % is nearly flat (<5°).
- Medium rocks: 11–14 facets cover half to two thirds of the surface.
- Big rocks are *compositions of slabs*: many medium-sized facets, the largest ≈ 0.3–0.7 × the rock size.
- Detail density scales with rock size. The median edge length is about 0.25–0.40 m on 2–5 m rocks, so smaller rocks are relatively coarser (11–13 % of size against 5 % for big ones).

**Edge treatment.**
- There is **no geometric bevel** (no Bevel modifier; creases are carried by 1–2 edge loops in the retopo).
- Rocks use 100 % smooth shading through a "Smooth by Angle" geometry-nodes modifier (German UI: `Auto Weichzeichnen`).
  Pebbles and path stones are **flat-shaded** (0–8 % smooth faces): chunky facets at small scale.
- The edge *read* is painted or baked into the texture. Rock-pixel luminance at convex vertices is **+11 … +16 %** against flat areas, and at concave vertices **−9 … −21 %**:

| Rock | Convex | Flat | Concave |
|---|---|---|---|
| Big_1 | 0.44 | 0.40 | 0.36 |
| Medium_2 | 0.43 | 0.37 | 0.32 |
| Medium_4 | 0.45 | 0.39 | 0.31 |

  The close-up shows thin light lines along ridges and dark crevice lines.

**Moss / green: not geometry, not vertex colour, not shader.** It is baked into the albedo as three layers:
1. **A vertical ground-tint skirt (dominant).** The greenness index G/avg(R,B) falls steadily with height.

   | Rock | Bottom decile | 3rd decile | 5th decile | Top decile |
   |---|---|---|---|---|
   | Big_1 | 1.64 | 1.21 | 1.06 | 1.02 |
   | Big_2 | 2.57 | 1.32 | 1.14 | 1.02 |
   | Medium_2 | 1.61 | 1.30 | 1.17 | 1.03 |
   | Medium_4 | 2.70 | 1.57 | 1.26 | 1.04 |

   "Strong green" (G > 1.25 × R and B) covers 27–100 % of the bottom decile and drops to ≤8 % from the 3rd decile upward. The exceptions are Medium_3 (10 % in its 5th decile) and Medium_4, the deepest-sunk rock (45 % / 14 % in its 3rd / 4th decile).
   A faint tint (G > 1.12 × R and B) reaches up to 40–70 % of the height. Everything below the pivot is 100 % ground-tinted.
2. **A vertical value gradient.** Rock luminance in the bottom decile is 0.21–0.25 and in the top decile 0.44–0.48, roughly **×2 from foot to crown**. That is baked sky occlusion.
   Top-facing faces are also brighter than sides (0.41–0.46 against 0.35–0.39 mean luminance).
3. **Moss flecks**: small yellow-green specks on upper ledges and in crevices (see the close-up). They are a minor area share and are *not* driven by a top-facing mask.
   On average, top-facing faces are actually *less* tinted than side faces (for example Medium_2: 3 % against 54 %).

**Undersides:** in all 9 measured rocks/stones, **100 % of the downward-facing area (n_z < −0.2) is painted in ground green**. A rock that is tilted or not quite sunk therefore never flashes a light grey bottom edge.
The dark green blocks you see in `PathRocks_Diffuse.png` are exactly those undersides.

**UV / texture use.**
- One shared **2048² atlas** for all 6 rocks, each rock using 5–20 % of it, all at an identical **97 px/m**. That is low: the texture carries big painted shapes, not micro-detail.
- Pebbles and path stones share a 1024² atlas at ~420–440 px/m. Path tiles reuse overlapping UV islands (UV coverage >100 %), so the same painted stone is used several times.
- The Blender material has an unused normal-map node at strength 0, so **no normal maps on rocks**. Bark is the only part of the kit with normal maps.

**Pivot / scale.**
- The pivot is at the intended **ground line**, roughly at the footprint centre (xy offset ≤0.85 m). 2.7–20.8 % of the height lies below z = 0 (median 13 %).
- Against a 1.8 m human: Medium rocks are 1.05–1.4× human height, Big rocks 2.1–2.5×.
- **The kit has no consistent metric scale.** Grass is 1.3–1.9 m tall, Flower_3_Group 2.05 m, Clover 1.14 m and Mushroom_Common 0.46 m, which means vegetation is exaggerated about 2–3× for readability. Trees (7–19 m) are plausible.

![Scale line-up against 1.8 m boxes](renders/scale_lineup_vs_1.8m.png)
![Eye level among rocks (1.7 m camera, line-up file, own white world)](renders/kit_lineup_eyelevel_rocks.png)

---

## 3. Scenes and composition

### What the shipped files define (measured)
- **Unity L_Overview**: one sun at **34° elevation**, azimuth −30°, intensity 2, white, soft shadows. Skybox ambient. Fog off. Post: ACES, bloom (threshold 0.3, intensity 0.8), contrast +7, saturation +10, exposure +0.2, vignette 0.25.
- **Blender All models.blend**: a sun pointing straight down (energy 1), white world at 2.3, Filmic. Flat catalogue light, which explains the washed-out look of the overview renders above.
- **Godot**: no light or environment in the scene.
- **UE**: SkyAtmosphere, VolumetricCloud, SkyLight, PostProcessVolume and a Landscape with grass (from a strings scan; it cannot be rendered here).
- Line-up spacing is on a grid (trees ~10 m apart, rocks ~5–7 m apart). The grid carries **no composition information**.

### What the preview images show (visual reading, estimates; CC0 images from the pack)
![Preview 1](renders/quaternius_preview_1.jpg)
![Preview 2](renders/quaternius_preview_2.jpg)
![Preview 3](renders/quaternius_preview_3.jpg)

1. **Scale tiers instead of variety.** The cliff backdrop in Preview_1 is built from the same Rock_Big meshes at roughly 2–5× scale, interpenetrating, with ledges facing the camera. Mid-ground uses single medium rocks; foreground uses pebbles. Three tiers, each roughly ≥2× apart.
2. **Clusters:** single accents or tight groups of 2–3 with clearly different sizes. In Preview_2 (front right) there are 3 pebbles at roughly 1 : 0.6 : 0.35 visible width, plus a clover patch. In Preview_1, one dark medium rock carries a bush, shelf mushrooms and grass.
   About 12–15 pebbles are visible per image, scattered as singles or pairs along the path edge. They never form a grid or an even spacing.
3. **Sinking:** no rock in the previews shows its bottom edge. Rocks sit *in* the landscape, and pebbles lie flat at about 0.1 m height, which effectively reads as half-buried.
4. **Seam hiding:** every rock–ground contact visible in Previews 1 and 2 is overlapped by at least one plant (grass tuft, bush, fern, clover, flowers or mushrooms) in front of it.
   Where the contact is visible (pebbles on the path), the rock's own green-dark skirt and the dirt colour meet at similar value, so you see no light line.
5. **Value and saturation structure:** rocks are the **only near-neutral element**.

   | Element | Colour | Greenness G/avg(R,B) |
   |---|---|---|
   | Rock albedo grey | `#606660` | ≈ 1.06 |
   | Foreground grass, lit | `#77a300` | — |
   | Mid grass | `#619b09` | — |
   | Autumn red | `#de531d` | — |
   | Path dirt | `#ba9f49` / `#ddc470` | — |

   Rocks act as rest areas between saturated plants.
6. **Aerial perspective:** distance shifts toward the light sky (distant hill haze `#e5e5d8`, sky `#d8f1f7`), and contrast drops with depth. Rocks in the backdrop are lighter and greener-grey (`#97a46b` lit / `#698031` shade) than the near rock (`#5d622f`).
7. **Light:** warm sun, low to mid elevation, from back-left in Preview_1 (visible light shafts). Backlit leaves glow through the Fresnel "SSS" emission. Shadows are soft and coloured, never black.
8. **Density gradient:** the path is the empty "negative space" (dirt, a few pebbles). Density rises towards the frame edges: dense grass and ferns in the foreground corners, trees as frame columns.

Palette values: [palette.json](palette.json) (sampled point medians, k-means 8 per image, texture albedo stats, shader constants).

---

## 4. Shader: one sentence

**There is no toon shader.** Rocks are texture-only lit materials whose look is fully painted into the albedo. The rest of the kit uses Lambert/PBR plus vertex-colour height gradients (dark root to bright tip, also the wind weight), camera-facing alpha leaf cards with a Fresnel "SSS" emission, world-space noise for colour variation and wind, and engine post (ACES, bloom, +saturation/+contrast).
Details, code excerpts and a three.js r186 porting table: [shader_notes.md](shader_notes.md).

---

## 5. Transfer to KFB (clay diorama, fractured earth clods, "no hard cuts")

### Rules (measurable; Q = Quaternius measurement, KFB = proposed target)
1. **Ground-contact tint on every grounded object.** Q: greenness 1.6–2.7 in the bottom decile, 1.06–1.26 at mid-height and ≤1.05 at the top. Strong green only in the lowest 10–20 % (30 % for Medium_4), a faint tint up to 40–70 % of height, and 100 % tint below ground.
   KFB: every rock, clod side and trunk gets a ground-coloured foot that fades out over the lower **25–40 % of visible height**, implemented as a world-height mask in the material (not a separate mesh). Ground colour = the colour of the surface it stands on.
2. **The fade must be organic, not a line.** Q uses a smooth airbrush gradient. KFB: modulate the mask edge with noise (amplitude ≥15 % of the fade height, feature size about 0.1–0.3 m) and a clay-smear texture. **Pass test:** no straight horizontal colour boundary is visible on any rock at camera set "Nah".
3. **Sink, don't sit.** Q: pivot = ground line, 3–21 % of height below ground (median 13 %).
   KFB: rock-kit blocks embed **≥10 % (target 12–20 %)** of their height in the clod. Boulders resting on top are allowed only with a contact dressing (rule 8).
4. **Undersides are never stone-coloured.** Q: 100 % of downward faces are ground green. KFB: faces with n_y < −0.2 use the clod/earth colour, so a fracture overhang or tilted block shows earth, not a light stone edge.
5. **Root-dark foot gradient on bark too.** Q: the bark foot tint fades out by 10–40 % of trunk height (1.1–3.4 m), and trunks go 0.2–0.43 m below the pivot.
   KFB: trunks, posts and fence feet get the same foot tint and are embedded ≥0.2 m (scaled to the KFB scale contract).
6. **Value doubles from foot to crown.** Q: luminance ×≈2 from bottom to top decile (0.21–0.25 → 0.44–0.48).
   KFB: get this physically, not painted. Hemisphere/sky light plus contact AO and the dark foot tint should give **L(top 10 %) / L(bottom 10 %) ≥ 1.6** on a rock under the standard daylight rig. Measure it in the render, as in Q-gate.
7. **Plane hierarchy, few crisp creases, no noise.** Q: medium boulders have 11–14 facets covering ≥43–68 % of the surface; the largest facet's √A ≈ 0.45–0.72 × size; 28–39 % of edge length at creases >30°; no displacement noise.
   KFB rock block: **1 dominant face (√A ≥ 0.5 × size) + 2–4 secondary faces + small chips**. No fBm noise on the faces. A clay surface gets thumb or tool marks *within* the planes (≤1–2 % of block size), not lumpy noise.
8. **Contact dressing on every rock–ground seam.** Q: every visible rock base in the previews is overlapped by vegetation, and grass roots are pure dark (`#173D00`, R = 0) rising to light tips.
   KFB: each rock/clod contact gets dressing (tuft, clover, moss crumb, earth crumb) on **≥40 % of its visible perimeter** (estimate from previews; tune it). The dressing's root colour must be ≤ the ground value, never lighter.
9. **Edge value contrast ±10–20 %.** Q (baked): convex ridges +11…+16 %, concave −9…−21 % against flat.
   KFB: produce this with real geometry. Rounded creases (radius ≈ 3–6 % of block size) catch light, AO darkens crevices. Check the same ±10–20 % band in the render. No painted highlight lines.
10. **Three size tiers, factor ≥2 apart, clustered.** Q: pebbles 0.09–0.17 m high, medium 1.9–2.5 m, big 3.8–4.6 m, and cliffs = big × 2–5. Clusters of 2–3 with size ratios ≈ 1 : 0.6 : 0.35.
    KFB: the rock kit ships 3–4 tiers (crumb, stone, boulder, clod/cliff); every placed group mixes ≥2 tiers. No group of equal-size rocks.
11. **One material, fixed texel or speckle density.** Q: 6 rocks on one atlas at a fixed 97 px/m; stones at a fixed ~430 px/m.
    KFB: all rock-kit blocks share one clay material whose speckle/fingerprint scale is **world-space invariant**, so scaling a block never scales its surface detail (this matches the NotebookLM P1 "Sprenkel maßstabsinvariant" note).
12. **Rocks are the neutral rest areas.** Q: rock grey `#606660` (G/avg(R,B) ≈ 1.06) against vegetation chroma `#77a300`.
    KFB: stone/clod sides have **clearly lower chroma** than the grass cap and dressing. Proposed check: mean HSV saturation of rock pixels ≤ 0.5 × that of grass pixels.
13. **World-noise variation at landscape scale.** Q: grass colour × world noise (variation colour `#00834E`, 50 m scale).
    KFB: one low-frequency world noise (period about 30–50 m in KFB units) modulates ground and dressing hue/value by ±5–10 %. No per-instance random colours.
14. **Weighted wind with roots at zero.** Q: the wind amplitude is multiplied by the same root-to-tip gradient.
    KFB (stop-motion): foliage motion stepped on 2s/3s (12 or 8 fps), weight = 0 at the root, so nothing slides at the ground.
15. **Depth through haze, not detail.** Q: background lighter and less saturated (`#e5e5d8` haze, backdrop rock `#97a46b` against near rock `#5d622f`).
    KFB: exponential fog tuned so the farthest island's rock value is ≥+25 % lighter than the same rock near the camera.

### Best PRO models as rock-kit blocks (reference shapes; CC0, copied to `public/assets/env/quaternius-megakit-pro/`)
| Rank | Model | Why |
|---|---|---|
| 1 | **Rock_Medium_2** (244 tris, 3.05×1.90×2.48 m) | Cleanest plane hierarchy in the kit: 14 facets cover 68 % of the surface, largest facet 0.72 × size, only 22 facets for 80 % of area. Reads well from all 4 angles. The archetype for a "single boulder" block. Rests on the ground (2.7 % sunk), so it needs embedding. |
| 2 | **Rock_Medium_4** (400 tris) | Low, wide two-block composition with the deepest sink (20.8 %) and the broadest ground skirt. The template for a "half-buried in the clod" block. |
| 3 | **Rock_Big_2** (1 944 tris) | Layered ledge stack, wide and low (13.8 % sunk). Ledges are natural shelves for moss and dressing. Best for island-edge shelves and cliff steps. |
| 4 | **Rock_Big_1** (1 736 tris) | Tall stepped tower, the vertical accent. In Preview_1 it is scaled 2–5× to form cliffs. Only 2.7 % sunk, so embed it deeper. |
| 5 | Rock_Medium_1 / _3 | Variants of 1 and 2 (55 % / 44 % big-facet share, 12–14 % sunk). |
| 6 | Pebble_Square_1–6, Pebble_Round_1–5 (48–136 tris, flat-shaded) | Scatter "crumbs" for contact dressing and clusters. Square pebbles are chipped slabs (good earth-clod crumbs), round ones tumbled. |
| — | RockPath_* | Not kit blocks: pre-assembled flat mosaics (56–60 UV islands, 0.11–0.18 m high). Use them for paths only. |

### Where Quaternius conflicts with clay, and what to adapt
- **Painted light against real light.** Quaternius bakes the vertical value gradient, edge highlights and cavities into the albedo (lit ≈ unlit in the anatomy render). Under KFB's real lighting this would double the shading and read as illustration, not clay.
  *Adapt:* keep only **hue** information (ground tint, earth undersides, moss flecks) in the material, and get value from light + AO + geometry.
- **Airbrush gradients against "no hard cuts" in clay.** A perfectly smooth gradient looks airbrushed. Clay transitions are smeared and pressed.
  *Adapt:* a noise- and tool-mark-modulated mask, or a thin separate "earth smear" clay layer with an irregular edge (still no hard line).
- **Crisp slab creases against soft clay.** Quaternius' creases are sharp (smooth shading, no bevel).
  *Adapt:* keep the plane hierarchy (rule 7) but round every crease (rule 9), and allow slight bulging of planes (1–2 % of size). Never melt the shape into a blob.
- **Low texel density (97 px/m) with big painted shapes** against clay micro-surface. *Adapt:* procedural world-space speckle and fingerprint detail (rule 11).
- **Inconsistent scale.** Vegetation is 2–3× oversized against rocks and trees. *Adapt:* rescale everything to the KFB scale contract (K1) before using any Quaternius model as a reference. Rocks are roughly usable at 1:1 as boulders.
- **Fluffy billboard leaf cards** are a painterly device. Clay foliage should be solid, rounded blobs (out of scope for the rock kit, noted for later).
- **Hard rule from Georg (world logic):** every rock needs an in-world story (fracture piece of the clod, field stone, path stone). Quaternius has no such logic; these rules only cover *how* to make it read, not *why* it is there.

---

### Files
- `renders/`: `rock_turntable_big.png`, `rock_turntable_medium.png`, `rock_anatomy.png`, `rock_closeup_Big_2.png`, `scale_lineup_vs_1.8m.png`, `kit_lineup_overview.png`, `kit_lineup_eyelevel_rocks.png`, `quaternius_preview_1–3.jpg`, `quaternius_preview_4_lineup.jpg`
- [shader_notes.md](shader_notes.md), [palette.json](palette.json)
- Assets: `public/assets/env/quaternius-megakit-pro/` (27 rock/stone glTF + bin, Rocks_Diffuse.png, PathRocks_Diffuse.png, License_Pro.txt, SOURCE.md)
- Safety: all Blender runs were headless (`-b --disable-autoexec`) with an RSS/runtime watchdog. Peak RSS was 1.1 GB, max runtime 10 s, free disk ≥105 GB throughout. A separate GUI Blender process (PID 61756, not started by this job) was running and was not touched.
