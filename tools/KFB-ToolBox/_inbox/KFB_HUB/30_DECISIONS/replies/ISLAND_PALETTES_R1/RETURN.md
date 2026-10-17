# ISLAND_PALETTES_R1 · one palette per island for the 8 B27 islands · RETURN (WS0, 2026-10-18)

**Private:** the GLBs are Unity-EULA purchase assets (Low Poly Floating Islands, streakbyte). Every render is in `evidence/_privat/` and stays local. Never publish it. The palette data (`island_palettes.r1.json`) contains no asset content.

## Result in short
- I wrote 8 mood briefs and made one palette per island, with 13 roles × 3 tones each, all from the **one V-305 generator** (`kfb-cartoon-palette.js`, read only, sha256 recorded in the JSON). No new generator and no free hex values.
- The palettes are applied **at runtime by material name** (`apply-island-palette.v1.js`). The GLBs are unchanged.
- All 8 islands went through the original approval stage (clay v1.1 midground, kfb-stage-light MOODS_MESA day, ACES 1, cove): **8 × PASS** (G1 N/A, G2 PASS, G3 PASS, G4 WARN from the source as in B27, G5 PASS). Each island has 3 views, one palette contact sheet and a manifest. There is also one overview sheet.
- Checks are in the JSON for every island. Ground/grass is never a saturated green (R7) **8/8**. No mid grey **8/8**. No neon (C ≤ 0.195) **8/8**. I checked every image myself (see below).

## Files (all in `30_DECISIONS/replies/ISLAND_PALETTES_R1/`)
| File | What |
|---|---|
| `island_palettes.r1.json` | `kfb.island-palettes/1`: `islands.<id> → {mood, roles:{role:[t0,t1,t2]}, roleSource, remaps, recipe, checks, seen}`, plus `rules` R1–R10 with sources and `distinguishability` |
| `gen_island_palettes.mjs` | `node gen_island_palettes.mjs` → the JSON. It imports the generator from `../COLOR_HARMONY_R1/` and does not copy it |
| `apply-island-palette.v1.js` | `applyIslandPalette(scene, entry)` and `patchGLTFLoader(GLTFLoader, getEntry)`. Matches `/^kfb_role_([a-z]+)_([0-2])$/` and sets `material.color` (sRGB hex). The patch runs **before** the clay pass, because clay v1.1 copies `material.color` |
| `render.palette.mjs` | A copy of `PROOF_STAGE_R1/render.mjs` plus `--palette <json> --island <id\|all> [--views threeq,far,top] [--diag]`. It drives the **original** `proof-stage.html` and `kfb-proof-stage.v1.js`. Nothing in PROOF_STAGE_R1 was changed |
| `island_area_shares.py` → `area_shares.r1.json` | World-space area per material (all / underside / top). B27 face counts are inflated by the bevel; area is the honest weight |
| `evidence/_privat/<id>/` | `<id>_threeq.png`, `<id>_far.png`, `<id>_top.png`, `<id>_palette_sheet.png`, `proof_manifest.json` (stage manifest + palette report + hashes) |
| `evidence/_privat/ISLAND_PALETTES_R1_overview.png` | All 8 in ¾ view, with a strip of the 6 largest-area colours per island |
| `evidence/_privat/diag/`, `iter1`–`iter4/` | Working images: false-colour role map and the iterations (not approval images, kept because nothing is deleted) |

Commands:
```bash
node gen_island_palettes.mjs
python3 island_area_shares.py
KFB_CHROME=~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell \
  node render.palette.mjs --palette island_palettes.r1.json --island all --out evidence/_privat
```
Each run used its own ephemeral 127.0.0.1 port (e.g. 50721), never 5180/5192/8765, and the server is closed at the end.

**About `top`:** it is **not** a stage-v1 preset. `render.palette.mjs` renders it with the stage's own scene, light rig (`rig.update` with the new camera), contact AO, renderer and FOV: turntable 0°, elevation 80°, footprint at 80 % of the frame height. The sheets label it "Zusatz, nicht Bühne v1". ¾ and far are the unchanged stage presets.

## Sources (the recipe, found rather than invented)
- **V-305** (DECISIONS.md, Hub col04 PASS): the harmony model + generator `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` (`fromHue/fromColors/fromStoryMode`), README §1–§3. The generator is byte-identical to the WS1 vendored copies (`gh/ws1/look-mesa`, `gh/ws1/s1-weltboden` …`/vendor/palette/`), md5 `6e3a5ec6…`.
- **V-305 / README §3.7:** the story/mood colour goes on the ground.
- **V-292:** story-mode hexes. They are not used as ground, because **V-342 (1)** says a map/island has no story mode; story mode comes later as an accent. The ground hue therefore comes from the mood brief.
- **Hub col01/col02** (CHANGELOG): Absurd = ochre, Fluff high = satt, low = dunkel. Not relevant to islands; noted only. **col03** has no entry in the register, CHANGELOG or Hub data.
- **V-396 + WSB `50_BLENDER/SPEC/VORSCHLAG_BODENFARBE_R1.md`:** rule 1 (no ground with HSV 55–170° and S > 0.35) is checked as R7 for the ground **and** grass tones. Rules 2–3 (taming an edgePalette colour) do not apply, because the ground here does not come from an edge palette (that proposal's own rule 4).
- **Georg's chromatic-surreal six-colour rule:** CHANGELOG entry "2026-10-17 · V-421 R1.2" on `gh/research/v421-landmark-source-clay-proof-2026-10-17` (commit `04cfdc7bb`, PR #418), plus `replies/V421_SOURCE_PROOF/LANDMARK_CHROMATIC_DIORAMA_STYLE_R1.md`. Any role may take another colour of the same palette (purple clouds, light-blue trunks, yellow crowns). No new hex set; V-305 stays the base. I used this as **R8** for every re-assignment, and each one has a reason in the JSON.
- **ENV_ROLES** (Lab `src/palettes.ts`, read only): the role grammar. The generator's `envRoles` is exactly this grammar, mapped 1:1 (R4).
- **B27/RETURN.md + report:** material names, the snow/cloud proposal roles, and the Iceland note ("blaugrauer Fels").
- **V-102/V-174:** asphalt/bande are fixed, but the islands do not use them.

## Recipe per island (one call to the generator, seed 0 = pure rule, plus R8)
| Island | Mood (short; full two sentences in the JSON) | Call | R8 re-assignments (generator colours only) |
|---|---|---|---|
| 01 Port | Harbour at blue hour, the lighthouse lit before the boats come in | `fromHue(255,'joyride')` | stone ← ground (blue harbour plate); earth/underside ← landmark orange, lighter tones |
| 02 River | Glacier river through a pine valley, bear and canoe | `fromHue(225)` | earth/underside ← accent pink; stone (boulder) ← cream |
| 03 Backyard | Sunday backyard: swing, barbecue, an old car | `fromHue(20)` | bark ← landmark blue (light-blue trunks); earth/underside ← landmark blue |
| 04 Beach | Stilt-house beach bar, Bikini-Bucht | `fromHue(88)` (strand) | stone + earth ← `roles.rock` (J17 violet coral) |
| 05 PirateCave | Smugglers' fort on violet cliffs, Canyon recipe | `fromHue(300)` (mono) | stone ← ground violet; bark ← earth; earth/underside ← accent orange (light) |
| 06 Iceland | Peaks, fishing hamlet, aurora | `fromHue(230)` | stone (mountains + underside) ← sky (ice blue) |
| 07 PondLand | Torii at the koi pond at lantern time | `fromHue(330)` (mono) | bark + earth ← ground plum; bloom (crowns) ← pad yellow |
| 08 Forest | Woodcutter's cabin in autumn, O-Town recipe | `fromHue(198)` (autumn) | cloud (smoke) ← bark lilac (purple clouds); earth/underside ← bark lilac |

Roles not listed come 1:1 from `envRoles` (R4). The proposal roles `snow`/`cloud` = `ladderOf(roles.cloud)` at the light end (R6).

## Palette table (tone 0 light · 1 mid · 2 dark; * = R8 re-assignment)
| Role | Port | River | Backyard | Beach | PirateCave | Iceland | PondLand | Forest |
|---|---|---|---|---|---|---|---|---|
| ground | `#5d97e4` `#4889da` `#3479c7` | `#50a7c9` `#369abd` `#1c8aaa` | `#cd7b7a` `#c16b6c` `#af5b5e` | `#fee092` `#f2d07d` `#e4bb62` | `#a07ed5` `#936fcc` `#815fbb` | `#50a5cd` `#3598c2` `#1b88af` | `#c578bd` `#b968b2` `#a658a2` | `#52b0b4` `#38a3a6` `#219294` |
| grass | `#46b1da` `#1b9bc5` `#007fa3` | `#63b8c2` `#46a3ad` `#248791` | `#d19370` `#bc7d58` `#9f623e` | `#fef5af` `#e7dd94` `#cac078` | `#77a1e7` `#618bd3` `#476fb5` | `#5eb8c5` `#40a2b0` `#1a8794` | `#e38791` `#ce707b` `#b05561` | `#72bdb2` `#58a89d` `#3a8c82` |
| stone | `#5d97e4` `#4889da` `#3479c7`* | `#fff7eb` `#f2e6d3` `#d4c9b6`* | `#b58e83` `#a0786e` `#855e54` | `#bf94fb` `#aa7ce7` `#8f60c9`* | `#a07ed5` `#936fcc` `#815fbb`* | `#aadbf7` `#91c5e2` `#75a9c5`* | `#c48777` `#af7161` `#925748` | `#6d5773` `#594460` `#412c47` |
| bark | `#e39982` `#ce826b` `#b06750` | `#e39982` `#ce826b` `#b06750` | `#5b97fb` `#4280e8` `#2764c9`* | `#e39982` `#ce826b` `#b06750` | `#e7714c` `#cd5c40` `#a74635`* | `#e39982` `#ce826b` `#b06750` | `#b968b2` `#a658a2` `#a658a2`* | `#885b90` `#74467d` `#5a2e62` |
| leaf | `#4b952c` `#2c8c2c` `#287f3d` | `#4f9b2e` `#2f932e` `#2a8640` | `#4b952c` `#2c8d2c` `#28803d` | `#7acf59` `#5ec65b` `#3fbc5d` | `#49922b` `#2b892a` `#277d3b` | `#4e9b2e` `#2e922e` `#2a8540` | `#4d982d` `#2d8f2d` `#29823f` | `#f5aa42` `#ed9c3e` `#e58e39` |
| bloom | `#ffc2c7` `#ff9ea9` `#e0828d` | `#ffbfd9` `#f99dc5` `#da81a9` | `#b7e596` `#9fce7d` `#84b161` | `#ffbfd7` `#fa9dc3` `#db81a6` | `#e0dd82` `#cac665` `#adaa48` | `#ffbfd6` `#fb9cc1` `#dc81a4` | `#ffe79c` `#ffe79c` `#f7cd36`* | `#f06e8e` `#da5478` `#bb375e` |
| water | `#7396b7` `#5d81a3` `#436787` | `#7396b7` `#5d81a3` `#436787` | `#7396b7` `#5d81a3` `#436787` | `#6adbea` `#48c5d4` `#1ca8b7` | `#7396b7` `#5d81a3` `#436787` | `#7396b7` `#5d81a3` `#436787` | `#7396b7` `#5d81a3` `#436787` | `#7396b7` `#5d81a3` `#436787` |
| accent | `#ff86a8` `#f85c90` `#d83d76` | `#ff84d5` `#ed66c1` `#ce48a5` | `#f9d159` `#e4ba31` `#c59d00` | `#ff8698` `#f85e7b` `#d83f61` | `#ff9177` `#f86c4c` `#d84f2f` | `#ff84cd` `#f064b9` `#d0469d` | `#ffab6f` `#f98a2b` `#d77000` | `#f9cf58` `#e4b730` `#c59b00` |
| sand | `#fff4e1` `#e9dcc8` `#cbbfac` | = Port | = Port | `#fff8e6` `#fae7b3` `#dcc996` | = Port | = Port | = Port | = Port |
| paved | `#fff8e9` `#f5e6c9` `#d8c9ac` (all 8 the same) | | | | | | | |
| earth | `#f57b4d` `#f57b4d` `#e0622e`* | `#ff84d5` `#ed66c1` `#ce48a5`* | `#5b97fb` `#5b97fb` `#4280e8`* | `#bf94fb` `#aa7ce7` `#aa7ce7`* | `#ff9177` `#ff9177` `#f86c4c`* | `#ce826b` `#b56d5b` `#935649` | `#c578bd` `#b968b2` `#b968b2`* | `#885b90` `#885b90` `#74467d`* |
| snow | `#fff7eb` `#fff7eb` `#f2e6d3` (all 8 the same) | | | | | | | |
| cloud | `#fff7eb` `#fff7eb` `#f2e6d3` | same | same | same | same | same | same | `#885b90` `#74467d` `#5a2e62`* |

## What I learned on the way (why the re-assignments exist)
- **False-colour diagnosis + area measurement:** the underside cone is `earth` on 7 islands and `stone` on Iceland. The top is `ground`, except on Port (`stone` rim 49 %) and Beach/PirateCave (water/sand). The pure rule (iter1) left every underside in the same terracotta/brown, and the stone in a dusty mauve-brown. That was the "muddy brown" the brief forbids, and the islands were hard to tell apart. Every R8 entry fixes exactly that, using colours from the same palette.
- The underside lies in the stage's shadow (one sun, hemisphere = cove colour). Dark tones go nearly black there, so the underside re-assignments take the lighter tones (`tones [0,0,1]`).
- iter3 → iter4: the dark cream made Iceland's snow read as sand, so snow/cloud now use the light end. PirateCave's mono earth read maroon, so the underside now takes the light accent orange. PondLand's mono lime crowns read olive, so the crowns now take pad yellow.

## Image check (done myself, final images in `evidence/_privat/`)
| Island | Harmonious | Distinguishable | Ground without lime | Nothing grey |
|---|---|---|---|---|
| Port | yes: blue plate, cream sand, coral lighthouse, orange underbelly | yes | yes (blue) | yes |
| River | yes: blue meadow, green pines, cream boulder, pink underside | yes (vs Port: top ΔE 0.074, underside 0.214) | yes | yes |
| Backyard | yes, deliberately kitsch: rose lawn, blue trunks/underside, yellow car | yes | yes (rose) | yes |
| Beach | yes: sand, aqua, violet coral reef, lime palms | yes | yes (sand) | yes |
| PirateCave | yes: violet cliffs, orange accents | yes | yes (cream sand/violet) | yes. Watch point: the underside reads **dark terracotta-red** in shadow (light-dependent) |
| Iceland | yes: ice-blue rock, white snow, pink/coral accents | yes | yes (no ground role) | numerically yes (C ≈ 0.07). Watch point: the underside is a **pale steel blue** in shadow |
| PondLand | yes: plum body, yellow crowns, orange torii | yes | yes (plum) | yes. The water is the generator's dove blue, a little dull in shadow |
| Forest | yes: teal floor, orange crowns, lilac trunks, purple smoke | yes (vs River: top ΔE 0.05, otherwise very different) | yes (grass HSV 171–173°, just outside the band) | yes |

Measured: the smallest area-weighted chamfer ΔE between two islands is 0.039 (Port/PirateCave). It is low because both share cream sand. Their top colours differ by ΔE 0.384 and their undersides by 0.128. All pairs are in `distinguishability.allPairs`.

## Open points
1. **R8 interpretation:** I took "the six colours" to mean the generator outputs of the island palette (ground, accent/strang, landmark, leaf, sky, bark/earth, plus cream/pad/rock). Georg should confirm that re-assignments such as "underside = landmark/accent/sky" are meant that way. All of them are listed in `remaps`, and each one can be undone individually.
2. **Ground hue from the mood instead of an edgePalette:** V-342/V-396 require `fromColors(edgePalette)` for maps with a stage edge. The islands are their own base. A mechanical edgePalette (the source colours of the B27 GLBs, `kfbSrcColors`) would make 7/8 grounds green, which R7 rules out, or the next-best earth brown. I chose the hue from the brief (like `fromStoryMode`) instead. Georg should decide whether that is OK or whether `fromColors` should be used with two colours from the brief.
3. **Undersides in the stage shadow:** PirateCave and Port read dark terracotta, Iceland pale steel blue. That comes from the light, not the palette. If the game light (WS1, LIGHT_MODEL_R2) brightens the underside, the lighter tone shift `[0,0,1]` may become unnecessary.
4. **Shared generator constants:** water (`#5d81a3`, dove blue 247°), sand, paved and snow are the same on every island except Beach. That is the J17 rule ("Tisch-Wasser fest"). Water could take the palette's sky or ground ladder if more variety is wanted.
5. **Forest grass** is at HSV 171–173°, 1–3° outside the WSB band. It passes, but only just. The WSB thresholds are themselves still marked "bei 2–3 Bühnen gegenprüfen".
6. **`top` view** is an addition. If it should become a standard, it belongs in `kfb-proof-stage.v1` (WS0 decision); I did not change the stage.
7. **snow/cloud** remain proposal roles from B27. Here they are cream at the light end, and purple for the Forest smoke.
8. Not checked in the game (WS1). The colours are sRGB texture values; under ACES they look a little lighter and more saturated, as on the stage.

## Rules followed
Nothing pushed, no settings changed, nothing deleted. Files were written only in `ISLAND_PALETTES_R1/`. The GLBs, PROOF_STAGE_R1, COLOR_HARMONY_R1 and the Lab were read only. `KFB Open World/` was not touched (the server also refuses it). Only my own server processes were started, and each one ended itself.
