# CHANGELOG · WB-DESIGN-PARALLEL-01 · Cologne World Shell (additive)

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
