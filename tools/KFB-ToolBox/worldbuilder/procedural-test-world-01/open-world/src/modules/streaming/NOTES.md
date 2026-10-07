# streaming — NOTES

Owns *when* chunk work happens (core `ChunkManager` still owns *what* a chunk is). Files:

| file | what |
|---|---|
| `index.ts` | module: init/takeover, per-frame update, service `streaming` (= `window.__kfb.streaming`), HUD lines, boot shader warm-up, showcase + presets |
| `streamer.ts` | scheduler: radius policy, priorities, time-sliced builds, deferred unloads, collider streaming, world/roads prefetch |
| `job.ts` | `BuildJob`: one chunk build split into steps (warm cells → one step per module → merge → background shader compile → adopt) |
| `recorder.ts` | frame-time ring buffer + session histogram + worst hitches with the scheduler's note of that frame |
| `fly.ts` | flythrough test mode (12 m/s along a gently curving path) |
| `hud.ts` | `?hud=1` overlay |
| `gpu.ts` | GPU frame time (EXT_disjoint_timer_query_webgl2), shown in HUD/stats |
| `adaptive.ts` | opt-in adaptive quality (`?adaptive=1`): GTAO off, then post off, when GPU-bound |
| `tools/perf.mjs` | reproducible perf test (real input / flythrough), JSON report + attribution |
| `tools/matrix.sh`, `tools/table.py` | before/after matrix (`?stream=0` = core scheduling) over 3 seeds |
| `scripts/showcase.json` | shoot script for `/?showcase=streaming` |

## How it works
- **Takeover.** `init` publishes service `streaming` (the environment then stops steering the radius) and sets
  `chunks.configure({ budgetMs: -1, urgentRadius: -1, unloadMargin: 1e7 })`: core `update()` builds/unloads nothing,
  but `wanted()`, `loaded`, `unload()`, `buildAllNow()` (boot, `__kfb.waitIdle()`) keep working. On 3 consecutive
  scheduler errors it hands everything back to core (`release()`).
- **Radius policy (one place).** `targetR` = `environment.requiredLoadRadius` (270 m for game/follow cameras, up to
  330 m for high cameras; fog needs it), else 190 m; `?sradius=` forces. `chunks.config.loadRadius` (= what the
  environment's edge fog uses, fog end = R − 40) is set to the **covered radius**: the largest R for which every
  chunk ChunkManager counts as wanted is actually loaded, and only grows by ≤ 40 m/s → the fog edge never lies beyond
  built ground (load edge always hidden). In steady travel covered = target.
- **Build zone** = load disc + a look-ahead band over everything not behind the direction of travel (`speed × 6 s`,
  30–90 m; a narrower forward cone let chunks enter the disc unbuilt from the flanks). Queues are refreshed every 4
  frames, after 5 m of movement, and whenever the radius changes (the environment reports 190 m before its first
  render and 270 m after — a stale queue left a ring of the boot disc unbuilt for ~2 s). **Priority**
  score = distance − forward bonus (velocity direction, up to `speed·5+30` m) − 25 m if in the camera's view direction.
  Chunks whose area comes within 70 m of the focus are built immediately, whole (only after teleports; before
  `ready` the whole disc is built synchronously = loading screen).
- **Time slicing.** One `BuildJob` at a time; per frame the scheduler runs steps while `spent + predicted ≤ 6 ms`
  (predicted = pessimistic EMA per step kind/module; the first step of a frame always runs). A finished chunk is
  compiled with `renderer.compileAsync` (both render-target and canvas output variants, since the environment renders
  through a composer) and only added to the scene when its shaders are ready (≤ 2 s) → no first-render compile stall.
- **Unloads** are deferred (1 per frame, up to 4 when far behind), with hysteresis: everything beyond
  `targetR + 40 m` that is not ahead of travel; ahead chunks are kept to the build zone + 40 m (no build/unload thrash).
- **Collider streaming.** Jobs keep the Rapier collider descs; only chunks within ~110 m (+ chunk radius) of the
  player *or* the focus have a rigid body (batches of 120 colliders/frame, all at once if the player may stand on it
  within a second); far ones are removed (1/frame). Measured `world.step()` 0.70 ms with 5.7 k colliders vs 0.15 ms
  with 1 k; in-game physics per frame 1.9–3.0 ms → 0.7–1.2 ms. `?scol=0` = all chunks get colliders.
  `ChunkManager.externalBuild` routes core's `buildAllNow` / `__kfb.waitIdle()` through `streamer.buildNow`, so every
  chunk's colliders are streamed (far preset jump: 44 chunks loaded, 8 bodies / 2.0 k colliders in Rapier).
- **Prefetch** (leftover frame budget + `requestIdleCallback` tail): (1) the roads module's `Prefetcher` around a point
  `speed × 8 s` (≤ 150 m) ahead, radius (load radius + 104 m)/15 + 4 cells (a narrower disc let the prefetcher's
  river part compute whole road regions lazily in one step: 77 vs 24 own-CPU frames > 33 ms on a 1.75 km flight), (2) world cells (`world.cell`, chunk + 2-cell border) of upcoming chunks in priority
  order, but only for chunks whose road macro regions are already routed (`net.hasRegion`) — the first cell of an
  unrouted region would compute the whole region in one call. Module plan hooks `services.nature.prefetch` /
  `services.terrain.prefetch` are called for the next chunks when those modules provide them (CORE_REQUESTS #5/#6).
- **Boot shader warm-up** (behind the loading screen, once): every chunk object made visible for one frame (nature's
  hidden near-detail/far-LOD objects), `renderer.compile(chunks.root)` for both output variants (objects outside
  the first view: a lake compiled its water/shore programs for 103 ms when it first came into view), and the full
  pipeline (environment's composer) drawn from 6 yaw directions around the spawn (the GPU process builds pipeline
  states on first draw: measured 40–135 ms GPU frames in the first seconds of a run, when the camera first turned).
- **GPU timer**: one TIME_ELAPSED query per frame → `stats().gpu` / HUD (p50/p95/max). Under contention (other agents'
  browsers on the same GPU) it includes their time slices.

## Round 2 (critic r1: IQ 8.5 ✓, Performance 7.5)
- **Module plan steps.** Every module with `services.<id>.prefetch(cx, cz)` (nature, props; terrain/villages/roads if
  they add one) gets a `plan` step of its own in each BuildJob, before the module steps → `buildChunk` is merge-only.
  In idle time / leftover budget the scheduler calls one hook per slice for the next chunks of the build order and
  then for every warmed chunk ahead (up to 40 candidates), so village plans (props: 18–63 ms each) are done long
  before the chunk is due.
- **Boot roads prefetch.** Before `ready` the roads prefetcher runs to completion around the spawn (loading screen),
  instead of 100–600 ms steps in the first seconds of play.
- **Post-ready spike (~1–3 s after ready, 315–850 ms) found and fixed**: it was mine — compiling both output variants
  (render target *and* canvas) of every chunk material; the unused canvas variants stalled the GPU process ~0.85 s a
  few seconds later. Now only the variant in use is compiled (`usesComposer()`); 3 runs after the fix: max 21–25 ms
  in the first 6 s (before: 853 ms; `swarm=0` A/B confirmed it).
- **Hitch labels.** HUD/report notes list the biggest item first with the scheduler's total (`streaming 16ms:
  plan:nature 16ms`), include idle-callback work (`idle …`), and a long frame without streaming work is labelled with
  its GPU time (`GPU-bound (gpu 61 ms…)` or `outside streaming (gpu 7 ms: another module, GC or the browser)`).
- **GPU cost at 1080p** (quiet machine, idle at the spawn, timer query p50/p95): full 6.9/10.9 ms · AO off 4.9/7.0 ·
  post off 3.9/5.6 · shadow map 2048 7.0/10.3 (no gain vs 4096) · shadows off 5.8/10.5. The critic's GPU p95
  18–26 ms are other agents' GPU time slices (the same baseline measured 26.8/56.9 while 7 other browsers ran).
  Adaptive quality (opt-in, `?adaptive=1`): GPU p95 > 16 ms and frame p95 > 20 ms for 3 s → AO off, again → post
  off; GPU p95 < 9 and frame p95 < 18 for 6 s → back. Off by default so critics see a stable image.

## Round 3 (critic r2: IQ 8.0, Performance 7.5)
- **Props planning sliced**: `services.props.prefetchStep(cx, cz, ms)` (resumable) is used in 3 ms slices — as a
  repeating `plan:props` job step and in idle slices; the drain-all `prefetch()` is only used for modules without a
  step hook and for synchronous (urgent/boot) builds. `Step.run()` may return `false` = run again next step.
- **Mid-field pop-in** (critic shots `popin_fly42_*`: bushes/rocks appearing 70–100 m ahead) was nature's near-detail
  switch (per chunk, by the chunk centre's camera distance, 125 m). Radius policy now sets
  `services.nature.detailRadius = min(250, load radius)` → the switch happens ≥ ~150 m away, in the haze. Cost measured
  at the spawn: +20 draw calls, +0.12 M triangles, GPU within noise (`?natdetail=` still overrides).
- **Merge sliced** once core has `ChunkBuilder.finishSteps()` (CORE_REQUESTS #8; feature-detected): one bucket per step.
- **Shadow-depth warm-up**: shadow-pass depth programs (alpha-tested maps, instancing) are compiled on first use and
  compileAsync cannot reach them; late ' depth' programs stalled single frames 67–124 ms. The boot warm-up now places
  one tiny caster per material (asset library + boot-disc chunks; plain + instanced) at the spawn for the 6 warm-up
  draws, then removes them. Two 40 s flythroughs afterwards: 0 new programs.
- **Hitch labels**: a hitch is "unexplained (named X of Y ms …)" unless the named causes (streaming work + idle work, or
  GPU time) cover ≥ half of the frame.
- **Flythrough camera**: game mode `?flythrough=1` now also uses the high chase view (camera override; the player is
  still teleported along so its ground/colliders stream). The follow camera behind a player teleported at 12 m/s
  through trees and rocks ended up inside crowns/rocks — a test-mode artefact that looked like a rendering fault.
  At the end of the flight the camera is handed back (`follow`).
- **Boot**: streaming's share is 1.0–1.6 s (roads prefetch 0.004–0.2 s, 270 m disc 0.75–0.96 s, 3 frames); demo's
  spawn planning takes 9.4 s (1337) / 14.9 s (42) → CORE_REQUESTS #11. `stats().boot` has the timeline.
- **Dense forest** (seed 42, forest_core cell, quiet GPU): low in-forest camera GPU p50/p95 7.7/10.7 ms vs 6.5/9.4 ms
  for a 40 m orbit over the same spot; frame p95 18.2 vs 18.1 ms; AO costs ~3 ms there too. The critic's 27 ms p95 in
  forest is not reproduced on a quiet GPU (likely contention); nothing streaming-owned stands out.

## Boot = near ring (integrator request after round 3)
- Before `ready` only chunks counted as wanted within `bootR` = 120 m (`?sbootr=`) are built (9 chunks: the spawn
  village and its surroundings, guaranteed loaded ≥ 88 m), synchronously, with roads evaluated **lazily** for exactly
  those cells. The roads prefetcher no longer runs before ready (`?sbootroads=1` restores it): seed 123 measured 8.8 s
  with it vs 4.6–7.4 s lazy; most of the remaining boot is the roads dependency closure around the spawn (the floor
  with a 30 m ring was 4.6 s, 120 m costs only +0.4 s).
- `chunks.config.loadRadius` (fog) = what is built (≈ 120–190 m at ready); core's `buildAllNow()` therefore builds
  nothing extra — no core change needed. After ready the disc grows strictly nearest-first with 10 ms/frame (+ idle
  prefetch), one adoption per frame, and the fog edge follows at ≤ 40 m/s, capped by coverage (it could overshoot by a
  frame's growth before → 1–2 m fog pulls at ready; fixed). `stats().boot.fullAt` = when the full radius is covered.
- Measured (20 s real-input run right after ready, `--settle 0`): seed 42 ready 6.0 s (was ~10–22 s), full disc +0.75 s,
  p50/p95/p99 16.7/19.2/20.9 ms, max 53, fog pulls 0; seed 123 ready 9.0 s under load 3 others (5.6–6.2 s in quieter
  runs; was 14.6 s), full +1.2 s, fog pulls 0. Contact sheet `tools/out/streaming/boot123__sheet00.jpg`, shots
  `boot123__boot_1s.jpg` (fog/load 192 m 1.5 s after ready, village complete) and `boot123__boot_20s.jpg`: no holes,
  no pop-in.

## Round 4 (critic r3: IQ 8.0, Performance 8.0)
- **No fog movement after the first visible frame**: boot builds the whole load disc again *plus* the look-ahead band
  (`sbootr` default 10000 → min(target)); roads stay lazy at boot. `ready` comes with fog/load = 270 m and nothing
  adopted in the first seconds (`ready123__t00_ready.jpg` vs `ready123__t02.jpg`: identical view, fog 270 m both).
  Boot: seed 123 6.2–6.4 s, seed 42 6.5 s (near-ring boot was 5.2–6.0 s but showed the fog wall retreat).
- **Hitch at ready + 0.5 s (52–95 ms) found**: core's loading overlay fade + delayed `remove()` (a full-screen element
  above the canvas removed while rendering → compositor re-layers the canvas). A/B 2+2 runs: 65/81 ms vs none. Streaming
  removes `#loading` in its `ready` handler (`?keepfade=1` keeps core's fade); CORE_REQUESTS #14 makes it official.
  The boot warm-up (compile + 6-direction draws + shadow casters) now runs in the `ready` handler on the complete disc.
- **High cameras**: nature radii follow camera height above the focus ground (≤ 25 m: detail 250 / far 150; ≥ 60 m:
  detail 100 / far-LOD trees beyond 60 m). Seed 42: aerial 1.71 M tris / 410 draw calls → 1.19 M / 337, disc 1.69 M /
  424 → 1.27 M / 360, overview 1.46 M / 352 → 1.07 M / 313, low 1.02 M / 239 (unchanged).
- **Roads-prefetch 68–168 ms** in the showcase flythrough: located (CORE_REQUESTS #12) — the roads prefetcher's rivers
  phase reads stage-4 cells whose villages layer reads a road region 27 cells away that was not prefetched → that
  region is routed synchronously. Roads-side fix written; still 82 ms in my last showcase run.
- **Sliced module builds**: `services.<id>.buildSteps(chunk, out)` generators are driven one slice per step when a
  module offers them (CORE_REQUESTS #13 terrain/roads); single module steps are still 11–16 ms (nature/terrain/roads).
- **First mouse drag** (61–76 ms, both seeds, at the first drag only): outside every wrapped tick function, GPU 5–15 ms,
  no new programs/geometries/textures — browser-side first input; not streaming, not fixed.

## Whole-game r2: the "~9 s after boot" frame (77–242 ms)
Cause: demo's controls-hint `<div>` is removed from `<body>` after its fade (25 m moved or 9 s) → the compositor
re-layers the WebGL canvas → one 96–242 ms frame (4/4 runs, at the logged removal time). `?hint=0` or hiding instead of
removing → gone. Not streaming code: CORE_REQUESTS #15 (exact demo diff). `tools/perf.mjs` now logs every removal of a
`<body>` child (`domRemovals`, `recorderStartS`) and has a `--noremove` test hook (hide instead of remove).

## Public API — service `streaming` (also `window.__kfb.streaming`)
- `stats()` → `{ active, frame: {fps,p50,p95,p99,max,n} (last 300 frames), session: {frames, fpsAvg, max, over33,
  over50, hist, worst: [{t, ms, note}]}, drawCalls, triangles, chunks, pendingAtTarget, queued, job, waitingShaders,
  built, urgentBuilt, unloaded, frameWorkMs, maxFrameWorkMs, maxStep, jobMsAvg, prefetch, radius: {target, covered,
  load, look}, speed, physics: {bodies, colliders, total}, budgetMs, flythrough, lastFlythrough }`
- `report()` (session + last-30-s window + flythrough summary), `resetStats()`, `config` (live `StreamConfig`),
  `fly(speed=12, secs=60, dirDeg=20)`, `stopFly()`, `flying`.
- Camera presets: `streaming.fly` (chase view along the flight heading), `streaming.disc` (high view of the loaded disc).

## URL params
`hud=1` overlay · `flythrough=1` (game mode: the player is teleported along the path each frame and the real camera
follows; `flyspeed=12`, `flysecs=60`, `flydir=20`) · `stream=0` passive (core schedules; for A/B) · `sbudget=6` ms ·
`sradius=` forced radius · `scol=110` collider radius (0 = all) · `sidle=0` no idle prefetch · `roadpf=0` no roads
prefetcher · `swarm=0` no boot shader warm-up · `gpu=0` no GPU timer · `adaptive=1` adaptive quality · `sbootr=10000` boot ring (m; < load radius = near-ring boot) · `keepfade=1` keep core's overlay fade · `sbootroads=1` roads prefetch before ready.
Showcase `/?showcase=streaming` (terrain, roads, villages, nature, props, environment; no character/camera): endless
flythrough at 12 m/s from the origin with the HUD (`fly=0`, `hud=0` to disable). A verification preset (non-follow
camera override) pauses the flight; `__kfb.streaming.fly()` restarts it.

## Perf test
```
node src/modules/streaming/tools/perf.mjs --mode run --secs 60 [--seed 42] [--attr] [--prof] [--shots 4]
node src/modules/streaming/tools/perf.mjs --mode fly --secs 60 [--speed 12] [--params "stream=0"]
SEEDS="1337 42 7" zsh src/modules/streaming/tools/matrix.sh      # before/after table
```
`run` = game mode `/`, follow camera, **real input**: W held for the whole run, every 8 s a ±38° mouse drag, and a
90° drag when the player moved < 1.5 m in a second (stuck at a cliff, as a human would steer). `fly` = `?flythrough=1`.
The in-page recorder is independent of this module (same tool measures `stream=0`). `--attr` wraps module
update/lateUpdate/buildChunk, chunk update, physics, render and world-layer apply (test harness only) and reports
for the worst frames where the time went, plus new shader programs/geometries per frame; `over33Split` separates
frames whose own JS work was < 12 ms (GPU / other processes — other agents share this machine; `otherRunsAtStart/End`
counts their verification browsers). A page reload mid-run (another agent saved a file) marks the run invalid.

## Measured (2026-10-06, M1 Max, headless Chrome 1920×1080 DPR 1, 2–9 other agents' browsers running)
`tools/out/m_*.json`, `long_*.json`. before = `?stream=0` (core ChunkManager, environment's radius), after = this module.
"own" = frames > 33 ms whose own JS work in that frame was ≥ 12 ms (the rest: GPU/other processes).

| run (60 s) | before p50/p95/p99/max ms | >33 own · >50 | after p50/p95/p99/max ms | >33 own · >50 |
|---|---|---|---|---|
| run W 1337 | 16.7 / 18.9 / 32.5 / 73.7 | 13 · 5 | 16.7 / 25.5 / 34.8 / 77.1 * | 1 · 3 |
| run W 42   | 16.6 / 19.2 / 22.0 / 62.7 | 12 · 3 | 16.7 / 17.8 / 18.7 / 59.5 | 1 · 1 |
| run W 7    | 16.8 / 28.6 / 40.2 / 131  | 17 · 8 | 16.7 / 17.9 / 19.5 / 110.7 | 2 · 1 |
| fly 12 m/s 1337 | 16.8 / 31.2 / 43.9 / 108.5 | 33 · 18 | 16.8 / 26.4 / 34.1 / 218.9 (roads) | 8 · 3 |
| fly 12 m/s 42   | 16.7 / 23.2 / 39.0 / 64.7  | 36 · 6  | 16.7 / 19.3 / 28.6 / 73.1  | 4 · 1 |
| fly 12 m/s 7    | 16.8 / 27.7 / 40.2 / 115.5 | 43 · 17 | 16.7 / 23.1 / 31.1 / 69.7  | 13 · 5 |
| fly 150 s, 1.75 km, 1337 | 16.7 / 19.1 / 33.5 / 692 | 80 · 19 | 16.8 / 27.9 / 39.2 / 500 (roads) | 59 · 23 ** |

\* this run the player was stuck at a cliff most of the time (68 m) under heavy contention (42 of 43 long frames external).
\** noisy (131 external); an earlier run of the same build-up: 24 own · 13 > 50. The long-flight worst frames are all
roads-network prefetch steps (157–620 ms), see CORE_REQUESTS #4.
Physics per frame 1.9–3.0 → 0.7–1.2 ms (collider streaming, ~10 chunks / 2–3.6 k colliders in Rapier instead of 30–47).
Draw calls 150–200 (max 202), triangles 0.5–0.8 M, GPU frame (timer query, quiet frames) p50 ≈ 6.5–7 ms.
fps averages 56–60; no console errors from this module in any run; fog pulls 0 in all final matrix runs.
Before the fixes, per-frame attribution showed: chunk builds 30–78 ms in one frame (nature 10–48, terrain 13–26,
props 9–12), cold-region world bursts 351/692 ms inside chunk builds, first-render shader compiles 50–103 ms.

## Known issues / assumptions
- **Roads network steps are atomic** (one route ≤ 370 ms, one region step up to 0.2–0.9 s on cold ground). Streaming
  moves them ahead of time and out of build frames but cannot split them → remaining worst frames in flythroughs.
  CORE_REQUESTS #4.
- Nature `buildChunk` is a single 3–40 ms step (plan + merge) → occasional 25–50 ms frames. CORE_REQUESTS #5.
  Props `buildChunk` (new) measured 63–115 ms in single chunks of long flights (CORE_REQUESTS #7).
- Frames > 33 ms with < 12 ms of own JS work remain (GPU / compositor / other processes on this shared machine);
  the GPU timer shows our own frame at ~7 ms GPU, so they are not render cost of this scene.
- A focus jump > 20 m in one frame counts as a teleport (fog stays at the target radius, 24 ms/frame catch-up budget,
  `__kfb.waitIdle()` builds the disc synchronously for screenshots). In-game teleports therefore show missing chunks
  beyond the 70 m urgent ring for up to ~1 s.
- (resolved) chunks are registered via `ChunkManager.adopt` (CORE_REQUESTS #1–#3 applied 2026-10-06).
- The roads prefetcher is imported from `../roads/prefetch` (+ `layers`, `net`) — read-only use of the same
  singletons; switches to `services.roads.prefetcher()` when roads exposes it.
- `HUD`/`stats()` numbers in a `tools/shoot.mjs --sheet` run are pessimistic: the sheet timer and screenshots stall frames.
- Device pixel ratio: measured at 1920×1080, DPR 1 (headless). On a Retina display the engine renders at DPR 2
  (4× pixels) — GPU cost is then a different question (no adaptive DPR implemented).
- Nature's own detail (125 m) and far-LOD (150 m) swaps are distance toggles inside nature, not chunk streaming;
  the radius policy leaves nature's radii at their defaults (`services.nature.detailRadius/farRadius` untouched).
