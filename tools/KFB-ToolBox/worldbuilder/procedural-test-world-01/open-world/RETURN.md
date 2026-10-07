# RETURN: KFB Open World, one-shot build (SPEC_KFB_OPEN_WORLD_01)

## Result in one paragraph
The game is a runnable, endless, seeded hex world built from KayKit CC0 packs (three.js + Rapier + Vite + TypeScript):

- **World:** villages at road crossings plus farms, chapels and towers between them; meandering rivers with bridges; clustered forests with roadside groves; terraces with ramps.
- **Player:** a Rapier capsule with six switchable heroes. Controls follow the **binding KFB ground-controls canon** (W/S forward/back, A/D turn, Q/E strafe, Shift run, Space jump, right-drag camera, wheel zoom). All clips play at their natural rate with no foot sliding.

**Gate history:**
- The original gate failed after its 4 allowed rounds (camera 6.5).
- A user-approved **closing round** then fixed camera collapses at buildings, the user's bug reports (verge lines, cracks and voids, floating on road strips and ramps, jump flicker, the house-annex trap), added the canon controls and a documented **clay STAND_IN** ground detail. Its critic (**r5**) **failed on one criterion: camera 8.0**, in forests. All other criteria are ≥ 8.5, there are 0 console errors, and A1 passes.

**Blind A/B judges** preferred the KayKit sample renders (15 of 20). The original look target "KayKit style" was itself a briefing error: the look target is now the KFB Clay canon (see Notes).

## Run
```bash
. tools/env.sh       # this machine has no system Node; uses the bundled Node 24, npm → pnpm
npm install
npm run dev          # http://127.0.0.1:5180 (default seed 97)
npm run build        # typecheck + static build in dist/
npm run preview      # http://127.0.0.1:5181
```
- **Production build, checked on 2026-10-06:** 0 TypeScript errors; `vite build` ok, with a 5 MB main-chunk size warning.
- **Served dist in headless Chrome:** ready in 7.0 s, 0 console/page errors, 0 missing assets, 61 fps, 216–337 draw calls.
- **Controls:** see `README.md`.

## Whole-game gate (pass = every criterion ≥ 8.5 and 0 console errors)
| Criterion | r1 (seed 123) | r2 (seed 50) | r3 (seed 97) | r4 (seed 97) | **r5 closing (seed 97, canon controls)** |
|---|---|---|---|---|---|
| 1 Spawn | 9.0 | 9.0 | 9.5 | 9.0 | 9.5 |
| 2 Authored world | 8.0 | 8.5 | 8.5 | 8.5 | 8.5 |
| 3 Roads and water | 8.0 | 8.5 | 8.5 | 8.5 | 9.0 |
| 4 Nature | 8.0 | 8.0 | 8.5 | 8.5 | 8.5 |
| 5 Scale | 8.5 | 8.5 | 8.5 | 9.0 | 8.5 |
| 6 Ground contact | 8.5 | 8.5 | 8.5 | 9.0 | 9.0 |
| 7 Character motion | 8.5 | 8.5 | 7.5 | 8.5 | 8.5 |
| 8 Jump | 8.5 | 8.5 | 8.5 | 8.5 | 8.5 |
| 9 Camera | 7.5 | 8.0 | 6.5 | 6.5 ✗ | **8.0 ✗** |
| 10 Image quality | 8.0 | 8.0 | 8.0 | 8.5 | 8.5 |
| 11 Place | 7.5 | 7.5 | 8.0 | 8.5 | 8.5 |
| A1 Travel tempo | 8.5 | 9.0 | 9.0 | 9.0 | 9.0 |
| Console errors | 0 | 0 | 0 | 0 | 0 |
| Verdict | FAIL | FAIL | FAIL | FAIL | **FAIL** |

- The reports are `docs/critic/game_r1.md` to `game_r5.md`. r5 was the user-approved closing round, after the canon controls and the closing fixes.
- Evidence (gitignored) is in `tools/out/critic/game_r5/` and `game_r4/`; copies are in `docs/evidence/final_r5/` and `docs/evidence/final/`.
- **r5:** criteria 2, 4, 5, 7, 8, 10 and 11 sit exactly on 8.5, with no margin.
- **Camera history:** r3/r4 tested harder cases (360° orbits against cliffs, houses and props; walking backwards into corners) and found collapses into the knight. The closing round fixed buildings (2.6 m minimum boom plus the core occluder fade) and cliffs. **r5's remaining camera fault is in forests:** under the canopy the camera drops to ~1 m above the helmet looking down, and faded trunks and crowns cover up to 40 % of the frame.
- **Timing:** the verge-crease fix (user report) landed during or after r5, so r5 may have seen the old verges.

## Scores per module (module critics, 4 rounds each, before integration)
| Module | Final module verdict | Last-round scores | Then |
|---|---|---|---|
| props | **PASSED r4** | authored 8.5, scale 8.5, ground 9.0, IQ 9.0 | integration fixes |
| assets | FAILED after 4 | scale 8.5, IQ 8.0, tile atlas 8.5 | integration |
| terrain | FAILED after 4 | roads/water 7.5, scale 8.0, ground 8.0, IQ 6.5, place 6.5 | reworked in integration (ramps, embankments, river valleys, cliff bands) |
| environment | FAILED after 4 | ground 8.5, IQ 8.0, place 8.0 | integration (time range, fog, AO) |
| character | FAILED after 4 | scale 8.5, ground 8.0, motion 7.5, jump 8.0, IQ 8.5 | integration: natural-rate gaits, wall stop, jump crouch |
| camera | FAILED r1–r6 (5.0 / 4.5 / 6.5 / 4.5 / 7.0 / 6.0) | camera 6.0, IQ 6.5 | rebuilt; builder rounds r7–r13 |
| roads | FAILED after 4 | authored 7.5, roads/water 8.0, ground 8.0, IQ 7.5 | integration: meanders, banks, funnels, berms, road sink |
| villages | FAILED after 4 | spawn 7.5, authored 7.5, scale 8.5, ground 8.5, IQ 7.5 | integration: rural features, road facing |
| nature | FAILED after 4 | nature 8.0, scale 8.5, ground 8.5, IQ 6.5 | integration: clumped forests, whole-instance fade, groves |
| streaming | FAILED r1–r3 | IQ 8.0, performance 8.0 | r4 builder pass (boot, hitches) |
| demo | judged in the whole game | — | default seed 123 → 50 → **97** after rescans |

Module scores and rounds are in `docs/STATUS.json` (`modules`); reports are in `docs/critic/`. The evidence images of the module rounds were pruned when the disk filled. The reports are kept, so some of their image links are dangling.

**Failed rounds in total:** every module failed at least one round; all failed their 4 rounds except props, which passed in r4. Camera failed 6. The whole game failed 4 of 4.

## Blind A/B judges (`docs/evidence/ab/`)
- **Setup:** five pairs, each a KayKit sample crop (no logos) against our matched in-game shot, sides shuffled by seed. Four judges: three Claude agents (default model, Sonnet, Haiku) and one **OpenAI Codex CLI** judge.
- **Result:** ours 4 wins, KayKit 15, 1 tie. Mean score ours 7.3, ref 8.1. "Looks like the promo render": the reference in 19 of 20 answers.
- **Main gaps named:** flat lighting compared with the samples' soft AO and bevels, large plain green areas, game-camera framing, and the knight floating on roads.
- **Haiku** was unreliable (descriptions that do not match the images); this is noted in `results.md`.
- **The floating knight** was a real bug: the 0.375 m KayKit road sink was not in physics. It was found by the judges and fixed afterwards. The verdict stands as judged.

## Travel tempo (A1, binding addendum), real held keys, seed 97, canon controls (steered with A/D)
| Leg | Distance | Sprint (Shift+W, 4.39 m/s) | Jog (W, 2.49 m/s) | Target |
|---|---|---|---|---|
| Village centre → bridge | 72–75 m | 17.5–18.0 s | 29.6–30.9 s | fast ≤ 25 s ✓ |
| Village centre → forest edge | 40–49 m | 9.6–11.0 s | 17.4–18.3 s | fast ≤ 18 s ✓ |

- **Base gait:** the jog, KayKit `Running_A` at its natural rate. 90 m takes ≈ 36 s, which meets the walk target of ≤ 60 s.
- **Other gaits:** S is `Walking_Backwards` (0.56 m/s); Q/E are `Running_Strafe_*` (3.32 m/s).
- **Clip playback:** loop clips always play at 1.0×.
- **Foot slip:** ≤ 0.30 m/s in the worst 0.2 s window, except turning while scraping a post (open issue).

## Performance (seed 97, 1920×1080)
- **Rendering:** 61 fps (vsync), 217–355 draw calls against a budget of ≤ 800, 1.15–1.51 M triangles. The forest view is 1.51 M, just over the 1.5 M budget.
- **Boot:** `ready` in 6.4 s on a loaded machine (6.5–7 s in the critic run).

## Open issues (ranked, after the closing round)
1. **Camera** (the only failing gate criterion; r5 8.0, then the camera-only re-checks cam_r6 6.0 and cam_r7 6.5): the forest was fixed. Remaining: the orbit sticks and then teleports at cliff inner corners; terrain edges hide the hero; the camera parks inside buildings, which then vanish; coarse stipple fade; single-frame snaps. This is a structural freeze item.
2. **Q/E strafe:** faster than the jog (3.3 m/s against 2.49), and the body yaws 30° toward the strafe direction. The KayKit strafe clips travel 60° off forward.
3. **Occluder fade pattern:** coarse dither on near houses, stairs and bushes; whole houses ghost out (core fade, nature).
4. **Missing collision:** some forest rocks have none, and the knight can stand inside bushes.
5. **Terrain still reads as tiles:**
   - meadows between clusters are sparse;
   - faint hex outlines and zig-zag terrace steps from above;
   - plain cliff slabs up close (improved with bands);
   - the structural tension of a 15 m hex pitch against a 1.9 m character.
6. **Smaller items:**
   - **Character:** backwards is slow (0.56 m/s, natural clip rate); turning out of a corner while scraping a post slips for ~0.2 s; 3 stale precomputed clip measurements (boot warning); the jump is a little floaty (1.4 m).
   - **Geometry:** a 0.49 m post/box pocket at a seed-97 house (the props/villages validator should prevent it); 4 known 0.095 m corner disagreements on seed 42 (0 voids).
   - **Performance:** seeds outside the precomputed spawn table pay ~2.8 s at boot; atomic roads prefetch steps cause hitches on fast fly-throughs.
7. **Look:** below the KayKit samples in blind A/B. The real target is the KFB Clay canon (K2), see Notes.

## Exactly one next step
Run the **architecture freeze** on `docs/ARCHITECTURE_AS_BUILT.md` + `docs/FREEZE_GAP_CHECK.md`. Its order: one owner per state → public API/events → persistence boundary → arbitration → failure isolation → simulation LOD; plus object identity and the K2 material owner.

**Camera:** the forest fault (r5 #1) was fixed, but the camera-only re-checks scored 6.0 (`cam_r6`) and then 6.5 (`cam_r7`, a harder search). Cliff inner corners still stick and teleport, terrain edges hide the hero, and the camera can park inside buildings. The camera therefore goes into the freeze as a **structural item**: replace the rule stack with one explicit camera model (see `docs/FREEZE_GAP_CHECK.md`, camera addendum), with the critic scripts in `tools/out/critic/cam_r6|cam_r7/` as its regression suite.

## Architecture (as built) and handover facts
Full details are in **`docs/ARCHITECTURE_AS_BUILT.md`**; the design written before the build is `ARCHITECTURE.md`. In short:

- **Runtime and world owner:** `src/core/engine.ts` owns the renderer, scene, Rapier physics, WorldModel (layered, memoised, pure function of seed, q, r), ChunkManager, events, services and module lifecycle. Modules are isolated folders in `src/modules/<id>/`, loaded in a fixed order. Failures are isolated per module, layer and chunk.
- **Player, motion, camera and collision:**
  - `character` owns the capsule and the KCC, gait and animation.
  - Steering follows `cameraRig.yaw`, a deliberate coupling.
  - `camera` owns the follow rig and its sight-line and collision rules.
  - Colliders are created by terrain, roads, villages, nature and props in the groups WORLD, PLAYER_ONLY and CAMERA_ONLY.
  - Nature owns the foliage fade shader.
- **Terrain, roads, settlements and streaming:**

  | Stage | Owner |
  |---|---|
  | 1 | terrain |
  | 2 | roads |
  | 3 | villages + rural |
  | 4 | rivers (roads) |
  | 5 | nature |
  | 6 | props (render-time) |

  Streaming owns the chunk lifecycle, time slicing and prefetch.
- **Authoring and persistence:** none. The world is a pure function of the seed. Generated data is checked in: `demo/presets.ts`, `character/measures.gen.ts` and the asset manifest.
- **APIs and seams:**
  - `window.__kfb`;
  - the services map;
  - world layers;
  - the `world.heightProvider` wrap chain (terrain, then roads);
  - `setRenderOverride` and `getCameraOverride`;
  - the events `ready`, `chunk:*`, `player:*`, `time:changed` and `module:error`. Several of these are emitted but nothing listens yet, so they are free integration seams.
- **KFB integration modules:** only the open-world core is real. Residents, cards, dialogue, combat, vehicles, multiplayer, hub, production-control and audio are **absent**, as the spec required. Hand items are partial (visual only). Nothing is known broken.
- **Double ownership and tight coupling:**
  - ramp shape in 4 places;
  - embankment geometry in terrain and roads;
  - road-surface height split between terrain and roads;
  - `level` written by 3 layers;
  - the river-corridor chain across terrain, roads and villages;
  - `WATER_DROP` defined twice;
  - direct imports of other modules' internals (`roads/layers`, `roads/net`, `villages/plan`, `nature/place`, `terrain/gen`).
- **Performance and streaming limits:** see the Performance section and `ARCHITECTURE_AS_BUILT.md` §9.
- **Repo:**
  - local git repository in this folder, branch `main`, about 200 commits, never pushed;
  - HEAD is the commit that updates this file after the closing round; its parent is `6d69428`;
  - no unit-test framework: verification is typecheck plus real-browser tools (`tools/shoot.mjs`, per-module tools in `src/modules/*/tools/`) plus critic reports;
  - evidence: `docs/evidence/` (canon real-input walk video `real_input_route_seed97_canon.webm` + script, `final_r5/` and `final/` screenshots, perf log, `ab/` blind judging), `docs/user/` (the user's screenshots and before/after crops), `docs/critic/` (all critic reports);
  - closing-round docs: `docs/CLAY_STAND_IN.md` (STAND_IN record), `docs/FREEZE_GAP_CHECK.md` (gap check against the user's freeze list, with the clay, rounded-edge and Joyride-plate addenda);
  - status: `docs/STATUS.json` (all rounds, decisions, perf checks, open issues).

## Canon corrections received in the closing round
- **Controls:** `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md` @ `main` `c66adc2` is implemented. There is one ground-movement writer (character) and one camera owner (camera).
- **Clay surface:** `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` @ `main` `26c8228`.
  - KayKit, Kenney and KFB supply source identity and form.
  - KFB Clay SSOT supplies the material.
  - `clay_floor_001` is used only as a documented **STAND_IN** (pin, mapping, scale, cost in `docs/CLAY_STAND_IN.md`). It is not K2.
  - The K2 material path (`clay-material.v10` + `clay-relief.v4` + `clay-toolmix.v1`, golden parity against K1/H0) belongs to the freeze. It goes together with rounded edges, the Joyride visual style and the Joyride biome plates (user decision).

## Notes on process
- **Another model:** one blind judge was the OpenAI Codex CLI (`codex exec --image …`); its raw output is in `docs/evidence/ab/judges/codex_raw.txt`.
- **Disk:** the disk filled twice. Swap grew from many parallel headless browsers to 16.5–17.9 GB, and it recovered after other apps were closed. Module-critic evidence images and old videos were pruned; the reports are kept. `tools/shoot.mjs` aborts below 1.0 GB free (1.5 GB with video).
- **Scores:** none were inflated. Every gate result above is the independent critic's number.
