# HANDOVER · WSA Lead Chat · WB-DESIGN-PARALLEL-01 · 2026-09-24

**Status:** CANDIDATE — Georg: "sieht toll aus". Final visual acceptance is still to be recorded formally. Ran parallel to WORLD-ZONE-BAKE-01 and does not consume its output.

## What is here
One directly reviewable KFB world shell: Cologne Dom/Hbf, built from a frozen real OSM crop.
- **Buildings:** Elastic Grotesque Clay V2 with curved doors and windows.
- **Ground:** one map for roads, footways, green and the main rails.
- **Water:** Card Zone v2 fluid with presets set in the app.
- **Landmarks:** Dom and Hbf as external placements under the LANDMARK_OVERRIDES contract, in KFB colours and the clay grammar, without base plates.
- **Editor:** the shared edit-layer.
- **Track socket:** an empty, hatched socket along the Racer route.

Entry: `KFB WB-D1 · Cologne World Shell.dc.html`. Views: 01 FIXTURE · 02 LANDMARK · 03 SHELL. Details drawer at top right.

## Owner boundaries (unchanged)
- **OSM City Lab** owns WHERE. The shell adds no geometry; each exception is a named host setting.
- **WORLD-ZONE-BAKE-01** owns the zone schema, elevation, topology, conflict resolution and drivability.
- **Race / track owner** owns the track module; the socket only holds its place by reference.
- The shell owns presentation only: palette mapping, massing call, ground map, landmark placement UI.

## Seam
`wd1-seam.js` → `loadZone({kind})`.
- **Today:** `frozen-fixture` (`fixtures/cologne-dom-crop-v0.json`).
- **Swap:** `kind:'world-zone-bake'`, meaning one adapter bundle → the same form. The presenter, landmarks and editor stay unchanged.
- **Fields:** id, rectW, heightAt, buildings (roof/mc/minH), roads, railways, landuse, water, landmark, hbf, heroes, conflicts.

## Host settings (named, reversible)
- **Hbf:**
  - fitted to the OSM hall-roof envelope (x/z scale);
  - rail-PCA axis;
  - end walls and plinth hidden.
- **Dom:**
  - foundation hidden;
  - clay body with small factors;
  - tower bend/torsion at a multiple of the grotesque preset.
- **Buildings:**
  - `blockPull` points at the Dom centroid;
  - concave footprints get `flat` roofs;
  - `orientEG` repairs face orientation.
- **Rendering:**
  - rig lights ×0.6;
  - water `cz2-scaled` = vertex delta only; the fragment shader is verbatim.

## Findings for other lanes
1. **Option C mirror (unconfirmed):** `buildRhine` flips z while `buildCity`/`buildDom` do not, which would put the Rhine mirrored against the buildings. Check in the Option C runtime.
2. **edit-layer:** `hidden` has no effect on the object menu when it has inline `display:flex`. WorldBuilder v1 probably has the same bug.
3. **`normalized.json` has no Rhine centerline:** waterLines are the canal and drains only. River flow direction has to come from the polygon, or the bake must supply it.
4. **Elastic Grotesque Clay V2 in a mirrored world frame:** it produces mixed face orientation. Owner fix proposal: check the ring direction in `buildElasticShell`.
5. **The Hbf node is not the hall centre:** the offset is 37.4 m. Landmark placement for nodes needs a footprint envelope, not just the node.

## Still depends on WORLD-ZONE-BAKE-01
- Elevation and viaduct heights (Hbf tracks sit on layer 1).
- The 5 remaining OSM buildings in the socket, and how the track and the hall combine.
- Tunnel parts (111 roads, light-rail tunnels).
- Zone edge beyond the crop.

## Next integration gate
**WB-ZONE-SEAM-01:** write only the `world-zone-bake` adapter in `wd1-seam.js` and switch the shell from the frozen fixture to the bake for the same Dom/Hbf bbox. Presenter, landmarks and editor must stay untouched.
PASS means all of the following:
- same view, same palette, same landmark placements;
- socket conflicts resolved by the bake;
- `heightAt` comes from the bake;
- 0 console errors.
