# CHANGELOG · CLAY-CITY-MVP-01 (additive)

## 2026-09-29 · Claude Coworker Desktop

- **CP1 · T4/M2 intake.** Exact package `KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1` (1 433 281 B, SHA-256 `101b7c66…`) verified and committed unchanged into the Track receiving owner `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/`; derived `td03.stream.json` documented (START_HERE §3). 52/52 files.
- **CP2 · geometric clay road + clean ground.** `clay-road.mjs`: OSM road graph → SDF union → exact per-triangle iso clip → terrain-projected road / sidewalk / path layers + outer skirt. Canvas road map, OSM building extrusions, far shells and facade details hidden on the active tile; WB2 tile and far ground share one clean clay colour (no tile seam).
- **CP2 · donors + district.** `kit-donors.mjs` (13 donors, one pin), `kit-district.mjs` (recipe `family + floorCount + body + roof + facadeRhythm + palette + deformationSeed`, InstancedMesh per archetype, foundation pads, collision boxes from the same recipe; walker `groundAt/solidAt/buildingAt` adapter; OSM building trimesh removed from Drive physics).
- **CP3 · T4 track segment.** `t4-segment.mjs`: TD03 window s 1245 → 1407.6 placed rigidly beside Adolf-Dasbach-Weg; strang/deck/lips/road shader ported from track-look.v5, M2 markings clipped to the window, kicker ramp socket; deck + strang are Rapier colliders. `playtest-probe.mjs`.
- **CP4 · sky + performance.** `sky-core.mjs` (`kfb.sky-core/1`: BASIC own dome/sun/clouds, TINY_SKIES via World owner; watercolor no longer default; sky button). Landmark blank sign socket. `perf-bench.mjs`. Road grid 1.0 m and outer skirt only; T4 strang rows every 1 m (deck unchanged).
- **CP5 · handoff.** RETURN, TEST_REPORT, SOURCE, HUB_UPDATE, SITE_HANDOFF, DONOR_ISOLATION, `donors.html`. Review wrapper `kfb-hub/pruefen/clay-city-mvp-01/` on `cloudflare-live` @ runtime `d79d3110`.
