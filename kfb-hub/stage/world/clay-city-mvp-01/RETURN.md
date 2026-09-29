# CLAY-CITY-MVP-01 · Return (Claude Coworker Desktop)

## Where

- Repo: `georg-doc/kayfabizarro`
- Branch: `coworker/clay-city-mvp-01-2026-09-28` (base: World R6 `work/world-m2a-r6-focus-quality-2026-09-28` @ `09077e1f`)
- Brief: PR #283 `skills/chat/workflows/KFB_RESIDENT_UI_COWORKER_CLAY_CITY_2026-09-28/CLAUDE_COWORKER_CLAY_CITY_MVP_01.md`
- Runtime head tested: `d79d311066e52893f8a33700c4d5eb4b26e5ca26` (this RETURN and the other handoff files are the next commit on top)
- PR: none opened by Coworker (no merge, no Live promotion)
- Review page (wrapper, not the fixed Stage): <https://kayfabizarro.pages.dev/kfb-hub/pruefen/clay-city-mvp-01/> → loads the unchanged stage app from jsDelivr @`d79d3110`
  - `?probe=1` runs the play probe after boot and writes `window.__clayCityProbe`
  - `?sky=basic` starts with the BASIC sky; the button bottom-right cycles Tiny Tag → Tiny Abend → Basic
- Fixed public Stage: **not touched**

## What Georg can do on the review page

Walk (Zu Fuß) · press **Auto** (direct, no long walk) · drive on the geometric clay road and off it over continuous ground · drive from **Adolf-Dasbach-Weg** into the **T4 Knet-Strecke** (TD03 s 1245 → 1407.6: nature → track transition, curve, width step) up to the kicker **ramp socket** and off its end back onto terrain · **Flug** over the tile · under a TinySkies sky instead of the watercolor wall.

## Checkpoints (all on the branch, read back after every write)

| CP | Commit | Content |
|---|---|---|
| 1 | series of 7 commits ending `7cc4a4f3` | T4/M2 exact intake: 52/52 files, sizes identical, ZIP 1 433 281 B, SHA-256 `101b7c66…` MATCH, internal checksums 49/49 · `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/` |
| 2 | `28ed161d` | geometric clay road, clean continuous ground, 13 verified donors, deterministic Kit district |
| 3 | `9d1182fa` | T4 segment (Track Core TD03, rigid placement, deck + strang colliders), play probe |
| 4 | `43beb50b`, `d79d3110` | SKY-CORE-01 adapter, landmark sign socket, render bench, triangle trims |
| 5 | next | RETURN, CHANGELOG, SOURCE, TEST_REPORT, HUB_UPDATE, SITE_HANDOFF, DONOR_ISOLATION, donors.html |

## Changed / added files

All new, in `kfb-hub/stage/world/clay-city-mvp-01/`: `index.html`, `clay-city.mjs`, `clay-road.mjs`, `kit-donors.mjs`, `kit-district.mjs`, `t4-segment.mjs`, `sky-core.mjs`, `playtest-probe.mjs`, `perf-bench.mjs`, `donors.html`, handoff files. Plus the T4 intake folder (CP1) and one wrapper `kfb-hub/pruefen/clay-city-mvp-01/index.html` on `cloudflare-live`.
**No file of the R6 host (`world-drive-interact-m2a/`) was modified.** Owners stay: WB2 terrain height, World r2 walker, Race PR10 drive, Travel flight, H0 clay.


## 2026-09-29 · HUMAN FREEPLAY VERDICT: FAIL

This candidate is frozen as **ARCHIVED_FAILED_CANDIDATE / RECOVERY EVIDENCE**. Automated probe claims above do not override Georg's public freeplay. Do not merge, promote or repair this branch piecemeal.

Observed on the public review route:

- shared shadow/contact/clipping fix is not effective on the rock/props; the screenshot also shows player/vehicle interpenetration and unreliable vehicle ground contact;
- the direct **Auto** mode button does not work;
- **E / car interaction** does not work;
- buildings sit on visible foundation plates instead of reading as terrain-integrated;
- the promised T4 world-building is not materially present: clay terrain relief/hills, T4 props, clay surface treatment and the intended sparse living world are missing or only partial;
- walking speed is acceptable now, but the selected/timed locomotion clip is visually unclean and not fun; state/stride/clip synchronization remains unresolved.

The earlier labels `PASS by construction` and `6/7 PASS` are therefore insufficient for acceptance. The public route remains evidence of failure, not a current playable MVP.

**Exactly one next gate:** create a fresh `WORLD-CORE-MOBILITY-R0` slice from the verified owner, not from this candidate. First use Claude Design (Opus 5.5 High) only to author the accepted H0/K2/T4 sparse Clay-World look and terrain/building integration reference. Then use Codex GPT-6 Sol High (xhigh only for the final integration/verification pass) to implement and prove one shared runtime for Walk/Auto/Flight, E interaction, stride-synced locomotion, ground/contact/shadow behavior and the accepted visual donor. No new broad Coworker repair pass on this branch.

## Actual test counts

- Play probe (visible pane, `9d1182fa`): **6/7 PASS** — fail = real-time walk speed (see open item 1).
- Render bench R6 ↔ Clay City (same conditions): draw calls **−45 … −68 %** in all 6 views; triangles **+7 … +20 % over the 200 k target** (open item 2).
- Donor isolation: **13/13** loaded and rendered alone, 0 quarantined.
- T4 intake: 52/52 files, 49/49 internal checksums.
Details: `TEST_REPORT.md`.

## Gate status against the brief

| Gate | Status |
|---|---|
| 0 real donors | PASS (13 donors, 3 families, `DONOR_ISOLATION.json`) |
| 1 geometric terrain-conforming road | PASS by construction + probe (no raster edge; SDF union on 1 m grid, exact iso clip, terrain-projected, outer skirt; kerb 4.5 cm lip, never a wall; ground box keeps off-road contact) · human look pending |
| 2 deterministic Kit district | PASS (64–66 buildings, recipe → render + collision; storeys 1–3 mostly, 4–5 accents, one 7-storey landmark with blank sign socket; one-time squash/stretch/lean; foundation pads) |
| 3 play loop | Auto, off-road, city→T4→terrain, Flight PASS · Ground real-time speed FAIL/UNKNOWN (open item 1) |
| 4 shared sky | PASS technically (`kfb.sky-core/1`: BASIC own, TINY_SKIES via World owner; watercolor no longer default) · human look pending |
| Performance | draw calls PASS · triangles NOT MET · real-time p95 and local boot ≤ 8 s **UNPROVEN** in this environment |

## Open items (not hidden)

1. **Ground feel.** The World r2 walker's own planted-foot sweep says `walk 0.542 m/s`; real-time at ~38 fps gave 0.44 m/s. Fixed-step displacement is identical on R6 and Clay City (2.65 m / 2 s) → this slice did not change it; it is the known R6 human fail. Needs Georg's visible 60 fps check; if still slow, one targeted walker/clip tune in the movement owner (separate gate).
2. **Triangles 213–240 k** (target 200 k). Host share: WB2 terrain tile 73.7 k + FrizzleBob 25 k. Cheapest next lever: 2×2 spatial chunks for the Kit instances (frustum culling) or a coarser road grid; both trade draw calls.
3. **Boot ≤ 8 s** cannot be proven without a local server; cold jsDelivr boot was 10.2 s visible. Clay City itself adds ~1.6 s.
4. **Resident pocket: QUARANTINED** (quarantinable per brief) — not built in this slice.
5. T4 in this slice = strang + deck + lips + M2 markings (deferred 1.5 s) + kicker socket. T4 kerb stones, embankment, fences, VFX board and clay tool reliefs are not included; fingerprint map is off (known T4 404).
6. Drive physics: Kit and T4 colliders are added directly to the Rapier world (Race PR10 physics has no second `gltf` slot) → rollover recovery still uses the last safe spot on the ground box; stuck detection ignores Kit walls. Walker has no collision with the T4 strang.
7. The flight check is formal (mode + camera height); visual stability over the tile needs the human test.

## Exactly one next gate

**CLAY-CITY-MVP-01 · Georg free play on the review page** (Ground / Auto / T4 / Flug, once with `?probe=1`). His verdict decides whether open item 1 (walker tune) or 2 (triangle trim) is the next single repair.
