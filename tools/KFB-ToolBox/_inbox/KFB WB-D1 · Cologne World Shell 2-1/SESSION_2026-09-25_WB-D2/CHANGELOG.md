# CHANGELOG · WB-DESIGN-PARALLEL-01 · Cologne World Shell (additive)

## 2026-09-25 · v0.12 · Street names (two views) · wd1-names.js NEW
- Modes `off · road · signs · both` — drawer ≡ → "Street names" and DC prop `names` (default `signs`). Live, no reload.
- **road:** name flat on the carriageway, Barlow Condensed 600, height = 0.42 × road width (1.5–3.2 m), every ≥ 110 m on a straight segment, reads W→E / S→N.
- **signs:** sprite (always faces the camera), muted street-sign blue `#46698f` / rim `#e9e1cf` / ink `#f6efe0`. One sign per street per intersection, 12 m out on its **own** leg (nearest leg to the camera), thin pin to the road. Grows with distance up to ~150 m, fades 230–320 m.
  - Replaces the first pass (names stacked in the node centre → Georg: ambiguous at crossings).
  - **Open → B2:** signs stand over the carriageway (drive-through). Georg wants them on the road edge, without pin.
- Home street labelled gold.

## 2026-09-25 · v0.11 · Zone Hürth-Alstädten + homebase
- **Finding:** `huerth-v0` origin 50.8659 / 6.877 is **not** Stotzheimer Straße, although the source label says "Stotzheimer Straße pilot". Nominatim: Stotzheimer Straße 26, 50354 Hürth → `way/372632503` at 50.88335 / 6.86070, ≈ 1.97 km NNW (Alstädten-Burbach). Burbacher / Alstädter Straße do not exist around it.
- New fixture `fixtures/huerth-alstaedten-v0.json`: 1108 buildings · 140 road parts · 15 landuse · 1 water · 3 water lines, ±350 m around No. 26.
  - Source: OSM API 0.6 `map.json?bbox=6.854862,50.879667,6.866538,50.887033`; raw sha256 in `source.rawSha256` (raw 2.2 MB, not in this export).
  - Inline normalizer v0, field mapping 1:1 to `huerth-crop-v0`. Heights: height tag → levels × 3.1 → class default → stable-id seed (675 of 1108 seeded).
  - **Rule deviation:** new OSM fetch inside Claude Design, on Georg's explicit request 25.09. To be re-cached by the OSM City Lab with a proper SOURCE_SPEC.
- Seam: additive field `zone.home {id, address, centroid}`.
- Homebase: gold ground ring around the footprint, gold sign above the roof, camera `home` (start view in this zone).
- Zone chip "Hürth-Alstädten" (`wd1.zone = alstaedten`, reload).

## 2026-09-25 · v0.10 · Contact shadows ("bright band under the houses")
- Cause: `normalBias 0.9` + `bias −0.0005` on a 2200 m depth range → shadow lifted ~1.5 m off every wall foot. Not clipping, not the deformation.
- `shadowFollow()`: shadow box follows the orbit target, half-size 90–560 m by camera distance, centre snapped to whole texels, near/far tight, `normalBias = 1.2 texel` (≈ 0.08 m at street level), `bias −0.00003`.
- Wall bottom row sunk 0.6 m below the plate (`stats.sunkBases`), after the facade pass. All zones.

## 2026-09-25 · v0.9 · Global facade rule `kfb-facade-rule-v1`
- Replaces `protectedDetails()` (1 door + 2–3 windows on the longest edge) for all zones; owner behaviour kept as comparison (`wd1.facade = owner`).
- Party walls (probe 1 m out lands in a neighbour footprint) stay blank. Other edges ≥ 2.4 m: window rows per 3.0 m floor, spacing 2.6–3.8 m per building, row shift ±0.1, 13 % gaps, jitter.
- Shapes rect / arch / trap-up / trap-down per building, 18 % outliers.
- Doors on the edge nearest an OSM road/path, extra door every ~15 m on long street edges. Garages: one wide door, no windows. Cap 140 details / building.
- Fallback: clamped door on the longest free edge when no street edge fits (130 cases in Hürth).

## 2026-09-25 · v0.8 · Sprint 1 · S1.1 Hürth zone
- `fixtures/huerth-crop-v0.json` from `huerth-v0/normalized.json` @c049cae386e1: 700 buildings · 164 road parts · 22 landuse · 2 water lines. No new OSM.
- Zone chips in the bar (`wd1.zone`, reload; live switch = S1.2).
- Lite path for zones without region / landmark / socket: flat ground, same presenter (Elastic Clay V2, palette, ground map, facade rule).
- Named absences in the drawer ("Not in the source"): no landmark, no rails, no water polygons.

## 2026-09-24 · v0.7 · Street joins, ground level, crisp rails
- Streets: ways of the same class and width that meet end to end are chained into one polyline. Caps are butt; each node gets a disc with the radius of the widest road there. No more bulges or pinches at width changes.
- Ground level:
  - Dom: after the foundation was removed, the whole landmark is lowered by 1 u = 1.87 m (nave, buttresses and towers were floating).
  - Hbf: the lower half of the glass barrel sat entirely below ground and is now hidden.
  - OSM parts with `min_height` sit on the ground unless another part carries them.
- Rails as geometry instead of in the ground map (which looked pixelated at 0.2 m/px): bed band 4.4 m, InstancedMesh sleepers every 1.6 m, two steel bands.
- Socket conflicts ("transparent area") are hidden by default; details → ghosts on shows them again.

## 2026-09-24 · v0.6 · Hbf end walls, main rails
- Hbf: the donor `gable` boxes (end walls) are hidden. After the x/z fit they stood as orange slabs at the hall ends.
- Main rails: added to the fixture from `DESIGN_CONTEXT.json` `railways` (same pin), with the seam field `zone.railways`.
  - Shown: `rail` without `service`, without tunnels, 60 parts.
  - Drawn as a cartoon track in the ground map (bed / sleepers / two rails, V2 palette).

## 2026-09-24 · v0.5 · Verifier fixes
- Hbf base: area overlap in 2 m samples replaces corner counting (the old rule matched 0 parts).
- Hbf fit: the hall is scaled to the OSM hall-roof envelope, 363.1 × 100.5 m (×1.389 / ×1.543); the 24 m barrel height is kept.
  - The centre sits 37.4 m from the station node (`placement.fit`).
  - 8 parts are hidden after validation.
- Sprite labels auto-fit (`measureText`). The socket tag is clamped inside the viewport.

## 2026-09-24 · v0.4 · Landmarks KFB pass
- Hbf via `cologne-landmarks.v1.js buildGeniusLoci` (hauptbahnhof only). Axis −55.1° from a length-weighted rail PCA.
- Dom + Hbf use the KFB_WONKY_90S_CLAY_V1 role colours, slightly lifted, with a clay body (city grammar `deformElasticXZ`).
- Base plates removed: Dom `foundation`, Hbf `plinth`.
- The two landmarks are edited separately (Dom | Hbf).
- Socket drawn as hatching: no road colour, no lane dashes.
- Roof artefacts fixed:
  - `orientEG` (face orientation) + FrontSide / shadowSide Back + normalBias 0.9.
  - Concave footprints (solidity < 0.85) are routed to `flat` roofs.

## 2026-09-24 · v0.3 · Water settings in the app
- `wd1-water.js`: presets CZ2 scaled / CZ2 source / OC buildRhine, one setting per water class (river / still / sea).
  - Controls: fluid, scale, flow, textures.
  - Stored in localStorage `kfb-wd1-water-v1`.
- Rhine flow direction = PCA of the OSM river polygon, because OSM has no Rhine centerline.

## 2026-09-24 · v0.2 · Georg corrections
- Buildings use Elastic Grotesque Clay V2 (@0c59e92d) with the V2 palette; the fixture gains OSM roof / materialClass / minHeightM.
- Doors and windows are curved plates that follow the shell; the placement is `protectedDetails` verbatim.
- Streets are drawn as one ground map (canvas, round joins/caps). This replaces the bands + end discs.
- Water uses the Card Zone Lab v2 fluid (dudv + map loaded).
- Ink is off by default. The UI is segmented, and buttons have opaque backgrounds.

## 2026-09-24 · v0.1 · First shell candidate
- Views 01 FIXTURE / 02 LANDMARK / 03 SHELL. Frozen crop of dom-zentrum-v0. `wd1-seam.js` presentation seam.
- Dom placed as `LANDMARK_OVERRIDES.md` entry way/4532022 (footprint centroid, PCA axis 6.23°), with tower bend/torsion.
- edit-layer @8922d4b1: Select / Move / Rotate / Scale / Drop.
- Track socket along `cologne-route` CP0→CP2.
