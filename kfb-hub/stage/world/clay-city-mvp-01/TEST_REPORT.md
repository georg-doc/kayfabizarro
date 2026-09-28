# CLAY-CITY-MVP-01 · Test report

Executor: Claude Coworker Desktop (no local git checkout, no local server). Every number below was measured in a real browser on Georg's Mac (Apple M1 Max, ANGLE Metal) against files served from this branch via jsDelivr at an exact commit. Nothing here is a local-server test.

## Environments and their limits (read first)

| Surface | Used for | Limit |
|---|---|---|
| Claude desktop browser pane, **visible** | functional play probe (`playtest-probe.mjs`) at `9d1182fa` | rAF cadence throttled to ~25–38 fps even on light pages → real-time frame p95 there is **not** a valid performance number |
| Claude desktop browser pane / Chrome, **hidden** | deterministic render bench (`perf-bench.mjs`), R6 vs Clay City under identical conditions | hidden pages get deprioritised GPU time → absolute ms are inflated; **only the comparison** R6 ↔ Clay City is meaningful |
| Georg's own visible browser | real-time p95 on the target machine | **pending**: open the review page with `?probe=1` (see RETURN.md) |

## 1 · Functional play probe · `playtest-probe.mjs` · commit `9d1182fa` · visible pane · **6/7 PASS**

| Check | Result | Evidence |
|---|---|---|
| city-structure | PASS | 64 Kit buildings (storeys 1:34 · 2:9 · 3:13 · 4:3 · 5:4 · 7:1), T4 track `BUILT`, 7 OSM layers hidden, OSM building trimesh removed from Drive physics |
| ground-walk (real time, 2.5 s W) | **FAIL** | 1.09 m (0.44 m/s) at ~38 fps. The World r2 walker's own planted-foot sweep logs `walk 0.542 m/s`; the fixed-step driver gives **2.65 m / 2 s on both R6 and Clay City** (no regression from this slice). See RETURN.md → open item 1. |
| walker-kit-collision | PASS | walker walked 2.6 m straight at `kfb-kit-009` (kk-A) and stopped 5.74 m from its centre (half depth 4.33 m + 0.35 m pad) |
| auto-direct | PASS | `Auto` shortcut → mode `drive` in 904 ms, car distance 0 |
| offroad-drive | PASS | 21.1 m across open ground in 3 s, 4/4 wheel contacts, body y 0.74 |
| city-track-city | PASS | from the city road (Adolf-Dasbach-Weg) 10 m before the mouth → full T4 window 43/43 path points → 30 m past the kicker socket back onto terrain: 22.7 s, min contacts 4/4, low-contact share 0, **0 recoveries** |
| flight | PASS | mode `flight`, camera y 7.9 m |

## 2 · Render bench · `perf-bench.mjs` · same hidden pane, same poses, same sizes

Draw calls / triangles include the shadow pass (three.js `renderer.info`).

| View | R6 @`43beb50b` (host dir) calls · tris · p50 ms | Clay City @`d79d3110` calls · tris · p50 ms |
|---|---|---|
| ground 1600×900 | 215 · 192 460 · 47.5 | 93 · 213 416 · 53.8 |
| drive 1600×900 | 288 · 205 700 · 89.2 | 149 · 214 344 · 72.0 |
| flight 1600×900 | 225 · 208 468 · 65.7 | 94 · 239 342 · 64.4 |
| ground 390×844 | 183 · 168 420 · 75.7 | 74 · 210 452 · 55.9 |
| drive 390×844 | 212 · 189 708 · 71.8 | 89 · 207 788 · 49.5 |
| flight 390×844 | 174 · 194 640 · 58.5 | 55 · 237 477 · 58.3 |

- **Draw calls: 45–68 % fewer than R6 in every view** (gate "no worse than R6": PASS).
- City-owned draw calls: Kit district 13–14 (one InstancedMesh per archetype + foundation pads + sign socket), road 2, T4 track 5 (+2 when markings are in) → city ≤ 24: PASS.
- Main pass only (shadow map frozen), Clay City: calls 72–107, triangles 213–240 k. **Triangle target ≤ 200 k: NOT MET** (+7–20 %). Scene composition: WB2 terrain tile 73.7 k (host owner, unchanged), FrizzleBob 25 k (host), Kit district 74.6 k, clay road 36.0 k, T4 track 23.7 k. See RETURN.md → open item 2.
- Visible-pane single measurement at `9d1182fa` (ground, 1600×900, render + GPU drain): p50 9.5 ms, p95 16.7 ms.
- Walker fixed-step (owner driver, 2 s): R6 2.65 m · Clay City 2.65 m.

## 3 · Build / boot

| Step | ms (hidden pane, jsDelivr warm) |
|---|---|
| clay road (SDF grid 224 m, 1.0 m) | 200 |
| T4 load + build (markings deferred 1.5 s) | 498 |
| donors (13 files, parallel with road/T4) | 30 after road |
| district plan + instancing | 39 |

Boot to control from a cold jsDelivr cache: 10.2 s (visible pane, `9d1182fa`), 20–27 s hidden. **Local boot ≤ 8 s cannot be proven in this environment** (no local server); the Clay City mount itself adds ~1.6 s on top of the R6 host.

## 4 · Donor isolation (gate 0)

13/13 donors load from one pin (`7cc4a4f3`) and were rendered in isolation (contact sheet in this session; reproducible page `donors.html`). Measured bounds, pivot, materials, triangles: `DONOR_ISOLATION.json`. No donor quarantined.

## 5 · Not tested here

- Real-time p95 in a visible 60 fps browser (Georg's machine) — `?probe=1` / `?measure=1`.
- Narrow real device.
- Sky modes BASIC ↔ TINY_SKIES were switched programmatically (report `kfb.sky-core/1`); no human look check yet.
