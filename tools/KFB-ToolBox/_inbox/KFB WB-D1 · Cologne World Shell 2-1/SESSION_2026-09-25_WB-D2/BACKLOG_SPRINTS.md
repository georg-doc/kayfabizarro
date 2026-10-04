# BACKLOG + SPRINT PLAN · KFB Cologne World · updated 2026-09-25

**Replaces the order in the 24.09 plan.** Georg, 25.09: **Ehrenfeld first**, then the connection to Köln.
New order: **Sprint 2 Ehrenfeld → Sprint 3 connection / shared frame → Sprint 4 Rhine/Mülheim/SAE → Sprint 5 Kölner Ringe.**
**Precondition for Sprint 2:** the new WorldBuilder/editor is integrated (separate lane). The WB-D shell docks onto it.

## Sprint 1 · WB-D2 · Hürth · status
- [x] S1.1 Hürth zone `huerth-crop-v0` + zone chips
- [x] S1.1b Alstädten zone `huerth-alstaedten-v0` + homebase Stotzheimer Str. 26 (added on Georg's request)
- [x] Global facade rule v1 · contact shadows · street names (road / signs)
- [ ] **S1.2** Zone switch without reload (dispose the city and names groups, reload them through `loadZone`)
- [ ] **S1.3 → moves into Sprint 3** (shared frame / connections)
- [ ] **S1.4** Landmark for Hürth / Alstädten. Candidate: the Alstädten church, if it is in OSM. Otherwise name the gap.

## Bugs, fix before or in Sprint 2 (Ehrenfeld's narrow streets make both worse)
### B1 · Road edges pixelated
- **Symptom:** road edges and curbs look stair-stepped or blurry at street level. They don't match the clean clay look of the rest.
- **Cause:** the curb is 0.9 m per side (`strokeNet(... col.curb, 1.8)` in `groundTexture`). It is painted into one 4096 px canvas, which gives 0.17 m/px in Hürth and ≈ 0.2 m/px in Köln. A curb is only 4–5 px wide and gets magnified at street level. This is the same class of problem as the rails at the Hbf, which v0.7 moved to geometry.
- **Fix options:**
  - **A (recommended):** curbs and road edges as geometry ribbons from the existing `chains()`. The ground map keeps only the fills. This is the same pattern as the v0.7 rails.
  - **B:** tiled or LOD ground map near the camera.
  - **C:** an SDF road shader.
- **Gate:** at the street camera (1.7 m and 4.5 m), no visible stair-steps on curbs in all three zones, and no extra draw-call explosion (≤ +3 meshes per zone).

### B2 · Street-sign anchoring
- **Georg:** the signs should sit on the **road edge**, not over the carriageway, so nobody drives through them. **No pin or stick**; they float. The road-text view stays as the separate other view.
- **Plan:**
  - Each sign is placed per street and intersection leg.
  - Offset: road width / 2 + curb + 1.5 m sideways, on the right-hand side as seen from the intersection, about 8–10 m back from the node.
  - Height about 3.2 m. Remove the pin.
  - Pick the leg nearest the camera, as now.
  - Check the offset against building footprints (the sign must not stand in a house). If it does, use the opposite side.
- **Gate:** at no intersection in Alstädten does a sign stand over the carriageway, and each sign can be matched to its street without ambiguity.

## Sprint 2 · WB-D3 · Ehrenfeld (Grimmstraße 8, 50823 Köln)
- S2.0 Integrate the new WorldBuilder/editor (precondition); fix B1 and B2.
- S2.1 Source: check the OSM City Lab `ehrenfeld-v0` (no normalized.json in the tree on 24.09). If it's still missing, use the same path as Alstädten (OSM API 0.6 map, ±350 m, raw sha, inline normalizer v0), flag it, and have the Lab re-cache it. Geocode Grimmstr. 8 via Nominatim and use it as the homebase.
- S2.2 Street camera at 1.7 m in narrow streets: façade density, sign readability, road-label size.
- S2.3 Landmark: Heliosturm, if it is in OSM or among the hero candidates. Otherwise name the gap.
- **Gate:** same look as the other zones, B1 and B2 closed, 0 console errors.

## Sprint 3 · WB-D4 · Connection Köln ⇄ Ehrenfeld ⇄ Hürth (was S1.3)
- One world frame (for example, the Dom origin). Zone fixtures stay in their own local ENU and get an offset and rotation from a `zones.json` registry (additive).
- Corridor as a socket chain. The sources are `ehrenfeld-huerth-corridor-v0` and `ehrenfeld-huerth-route.json`. No drivable geometry of our own; WORLD-ZONE-BAKE-01 owns that.
- Overview camera over all zones, with the zone edges visible.

## Sprint 4 · Rhine → Mülheimer Brücke → SAE (Carlswerkstr. 11c) · Sprint 5 · Kölner Ringe
Unchanged from the 24.09 plan (formerly Sprints 2 and 4).

## Carry-over backlog
- [ ] Georg's acceptance of WB-D1/D2, recorded formally
- [ ] WB-ZONE-SEAM-01
- [ ] Real heights: NRW 3D building data (LoD1/LoD2). Georg can get the data.
- [ ] OSM City Lab re-cache of `huerth-alstaedten-v0` (finding 7) and the relabel of `huerth-v0` (finding 6)
- [ ] Skydome presets in the app settings
- [ ] Standalone/live version via a JS build + hosting
- [ ] Hbf/Dom final hero assets (Blender → GLB via the override contract)
