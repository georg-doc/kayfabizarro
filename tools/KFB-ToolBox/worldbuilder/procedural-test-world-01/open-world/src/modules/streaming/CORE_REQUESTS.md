# CORE_REQUESTS · streaming

**Status:** #1–#3 applied by the integrator (2026-10-06) and used (`job.ts` → `chunks.adopt`, `chunks.externalBuild = streamer.buildNow`). #4 relayed to roads (still the worst frames: 258–536 ms steps in round 2). #5 nature prefetch and #7 props prefetch landed and are used (own `plan` step per job + idle prefetch well ahead).

**New (round 2) — props:** one `props.prefetch(cx, cz)` call still plans whole villages in one go: 54–97 ms single steps
measured in round 2. Please add a finer hook, e.g. `prefetchStep(cx, cz): boolean` that plans at most one village per
call and returns `true` when the chunk's plans are complete — streaming will call it once per idle slice.

Everything below works today through workarounds inside `src/modules/streaming/`; each request removes a workaround
or a measured hitch. Numbers: M1 Max, headless Chrome 1920×1080, `src/modules/streaming/tools/perf.mjs`.

---

## 1. core/chunks.ts — `adopt()` + `externalBuild` hook (replaces the workaround in `streaming/job.ts`)

Streaming builds chunks in slices (`BuildJob`: warm cells → one module per step → merge → background shader compile →
adopt) and keeps collider descs itself (Rapier only holds chunks near the player). Today `job.ts` registers the
finished chunk by writing `chunks.loaded` / `chunks.root` / `builtThisSession` directly (mirrors the tail of
`build()`). And `buildAllNow()` (boot, `__kfb.waitIdle()` in every shoot) still builds through core → those chunks get
full colliders that streaming cannot stream (their descs are gone).

Proposed (add to `ChunkManager`):

```ts
export interface LoadedChunk { cx: number; cz: number; group: THREE.Group; body: RAPIER.RigidBody | null; dist: number }   // export it

  /** When set, build() delegates to it (streaming: same result, colliders managed by distance). */
  externalBuild: ((cx: number, cz: number) => void) | null = null;

  /** Register a chunk built elsewhere (streaming's time-sliced BuildJob). */
  adopt(cx: number, cz: number, group: THREE.Group, body: RAPIER.RigidBody | null): void {
    const k = chunkKey(cx, cz);
    if (this.loaded.has(k)) return;
    this.root.add(group);
    this.loaded.set(k, { cx, cz, group, body, dist: 0 });
    this.builtThisSession++;
    this.ctx.events.emit('chunk:loaded', { cx, cz });
  }
```

and at the top of `build()` (after the `loaded.has` check):

```ts
    if (this.externalBuild) { this.externalBuild(cx, cz); return; }
```

Streaming then sets `ctx.chunks.externalBuild = (cx, cz) => streamer.buildNow(cx, cz)` (I'll add `buildNow` the moment
this lands; `job.ts` already prefers `chunks.adopt` when it exists).

## 2. core/engine.ts — `stats()` includes streaming

So every `tools/shoot.mjs` JSON log carries the frame-time statistics (p50/p95/max, hitches with cause):

```ts
      streaming: (this.services.get('streaming') as { stats?: () => unknown } | undefined)?.stats?.() ?? null,
```

(add as the last field of the object returned by `Engine.stats()`; `stats()` is cheap: no world queries.)

## 3. tools/shoot.mjs — (optional) write `__kfb.streaming.report()` into the log

After `log.stats = …`:

```js
  log.streaming = await page.evaluate(() => window.__kfb.streaming?.report?.() ?? null);
```

Note for critics' numbers: the contact-sheet timer (`--sheet`, a canvas `toDataURL` every N ms) and `page.screenshot`
themselves stall frames by 20–60 ms; fps/hitches measured during a `--sheet` run are pessimistic.
`perf.mjs` measures without them.

---

## 4. roads module (please relay to the roads owner) — the remaining big hitch

After everything streaming can do (prefetch ahead in idle time, slices), the only frames > 50 ms left in a 12 m/s
flythrough are single synchronous steps of the road network: one `world.cell()` / prefetch step that routes a
macro region took **86 / 212 ms (seed 1337), 661 ms (seed 42)** in one call; in a 1.75 km flight at 12 m/s the
prefetch steps were 157–620 ms (8–9 of them, ≈ 1.9–2.6 s of main-thread work in 150 s). Note the prefetcher's river
part (`rn.gate/link` over its radius) reads stage-3 cells = road regions, which it may compute lazily in one call
when they are outside the region loop's disc (a narrower disc made it worse: 77 vs 24 own-CPU frames > 33 ms). Measured inside the existing
`Prefetcher` (3 regions): worst single step 936 ms; `net.path` max 368 ms, `net.region` max 368 ms,
`rivers.gate/link` max 370 ms, `keptDirs` max 61 ms; 2.47 M A* expansions, 113 failed routes (a failing route runs
to `maxExp` 120 000, ×3 modes strict/fallback/free ≈ 370 ms).

Why the current Prefetcher still produces huge steps: `net.region(I, J)` calls `allDirs` / `pathAny` (generation-2
repair routes) and `alive(…, PRUNE)` (pruning reads paths up to PRUNE lattice steps away), none of which the
prefetcher computes first, so `region()` fans out into many routes in one call.

Requests, in order of value:
1. **Prefetcher covers the whole dependency closure leaf-first**, one path per yield, before `region()`:
   ```ts
   // after the keptDirs/path loop of a region, before net.region(I, J):
   for (let i = I - 1 - PRUNE; i <= I + 2 + PRUNE; i++)
     for (let j = J - 1 - PRUNE; j <= J + 2 + PRUNE; j++) {
       if (!net.node(i, j)) continue;
       for (const k of net.keptDirs(i, j)) { if (!net.hasPath(i, j, k)) { yield* this.warm(net.routeCells(i, j, k)); net.path(i, j, k); } yield; }
     }
   for (let i = I - 1 - PRUNE; i <= I + 2 + PRUNE; i++)
     for (let j = J - 1 - PRUNE; j <= J + 2 + PRUNE; j++) for (const k of net.allDirs(i, j)) { net.pathAny(i, j, k); yield; }
   for (let round = 1; round <= PRUNE; round++)
     for (let i = I - 1 - PRUNE + round; i <= I + 2 + PRUNE - round; i++)
       for (let j = J - 1 - PRUNE + round; j <= J + 2 + PRUNE - round; j++) for (const k of net.allDirs(i, j)) { net.alive(i, j, k, round); yield; }
   net.region(I, J);
   ```
   (export `PRUNE` from net.ts; the same for `rivers.gate/link`: compute their inputs first.)
2. **Resumable A\***: turn `route()` into `*routeIter(...)` that `yield`s every ~2 000 expansions (`route()` = drain
   it, unchanged results); `path/indepPath/fallbackPath` get `*Iter` twins; the Prefetcher uses `yield*`. Then no
   prefetch step exceeds ~6 ms.
3. Consider a lower `maxExp` for routes that are going to fail (they dominate the worst steps) — design decision for roads.
4. Expose the prefetcher: `services.roads.prefetcher = () => prefetch` (create it always; run it in roads' own
   `update()` only when `!ctx.services.get('streaming')`). Streaming already uses `services.roads.prefetcher()` when
   present; today it imports `../roads/prefetch` + `../roads/layers` + `../roads/net` directly (read-only use of the
   same singletons, `hasRegion()` to gate its own cell warming).

## 5. nature module (relay) — plan prefetch

`buildChunk` is the largest single build step: typically 3–10 ms, **max 19–27 ms in flythroughs, 48–58 ms cold**
(plan ≈ 2/3, merge ≈ 1/3). The plan is pure and already cacheable (`planFor`). Request:
- `buildChunk` uses `planFor(ctx, cx, cz)` (raise the cache to ~128 entries) instead of calling `planChunk` itself;
- `services.nature.prefetch(cx, cz)` = `void planFor(ctx, cx, cz)`.
Streaming will call it for the next chunks in its build queue in idle time → the build step becomes merge-only.

## 7. props module (relay)

`props.buildChunk` appeared during this session: 9–12 ms typical, **63 and 115 ms** single steps in a 1.75 km
flythrough (seed 1337). Same request as nature: a pure, cacheable plan + `services.props.prefetch(cx, cz)` so
streaming can compute it in idle time, leaving only the merge in the build step.

## 6. terrain module (relay, low priority)

Terrain build step is 1–5 ms normally, 13–44 ms for a few cold chunks (first chunk of a terrain region). A
`services.terrain.prefetch(cx, cz)` that warms whatever `TerrainBuilder.build` computes lazily would let streaming
move that into idle time too.

---
**Integrator 2026-10-06:** #1 adopt()+externalBuild+export LoadedChunk applied; #2 stats().streaming applied; #3 shoot log.streaming applied. #4–#7 relayed to roads/nature/props/terrain owners.

---

## Round 3

### 8. core/chunks.ts — incremental merge `ChunkBuilder.finishSteps()` (chunk finish 13–17 ms in one frame)

Same output as `finish()`, one merge bucket / instanced set per `next()`. `finish()` becomes a drain of it, so nothing
else changes. `streaming/job.ts` already feature-detects `finishSteps` and runs one bucket per scheduler step.

```ts
  /** Same result as finish(), one merge bucket / instanced set per step (streaming spreads the merge over frames). */
  *finishSteps(): Generator<void, THREE.Group, void> {
    const group = new THREE.Group();
    group.name = `chunk ${this.chunk.cx},${this.chunk.cz}`;
    for (const b of this.buckets.values()) {
      const geo = mergeTransformed(b.items);
      if (geo) {
        const mesh = new THREE.Mesh(geo, b.material);
        mesh.castShadow = b.cast;
        mesh.receiveShadow = b.receive;
        mesh.matrixAutoUpdate = false;
        group.add(mesh);
      }
      yield;
    }
    for (const e of this.instanced.values()) {
      const a = this.assets.get(e.assetId)!;
      for (const p of a.parts) {
        const im = new THREE.InstancedMesh(p.geometry, e.opts.material ?? p.material, e.matrices.length);
        im.userData.sharedGeometry = true;
        e.matrices.forEach((m, i) => im.setMatrixAt(i, _m.multiplyMatrices(m, p.matrix)));
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = e.opts.castShadow ?? false;
        im.receiveShadow = e.opts.receiveShadow ?? true;
        im.computeBoundingSphere();
        group.add(im);
      }
      yield;
    }
    for (const o of this.objects) group.add(o);
    group.updateMatrixWorld(true);
    return group;
  }

  finish(): THREE.Group {
    const it = this.finishSteps();
    let r = it.next();
    while (!r.done) r = it.next();
    return r.value;
  }
```
(replace the body of the existing `finish()` with the drain; delete nothing else.)

### 9. nature (relay) — resumable plan `services.nature.prefetchStep(cx, cz, budgetMs): boolean`
`nature.prefetch` is a single call of up to 24–30 ms (measured `plan:nature` 30 ms). Same contract as props'
`prefetchStep` (resumable, identical output, `true` when complete). Streaming uses it automatically when present.

### 10. terrain (relay) — `services.terrain.prefetch(cx, cz)` / `prefetchStep`
Terrain `buildChunk` is 16–18.5 ms for some chunks (critic r2). If part of it is pure precomputation (shore lattice,
water mesh, column stacks), expose it like nature/props; streaming picks it up automatically (`plan:terrain` step).

### 11. demo (relay) — boot time is dominated by demo's spawn planning
Measured boot timeline (navigation start → ready): seed 1337: streaming init at 3.3 s, first frame at 12.7 s,
ready at 14.2 s; seed 42: 5.3 s → 20.2 s → 21.8 s. Between streaming's init and the first frame only `demo.init` runs
(ORDER puts demo last): **9.4 s (1337) / 14.9 s (42)** — it computes the road network over a large area synchronously
to pick the spawn village. Streaming's own boot work: roads prefetch around the spawn 0.004–0.2 s + building the 270 m
disc (29–30 chunks) 0.75–0.96 s. The rest before init (3.3–5.3 s) is asset loading + earlier module inits. Streaming
cannot shorten demo's part; demo would need to plan from a smaller radius first (or time-slice behind a loading bar).

---
**Integrator 2026-10-06:** #8 finishSteps applied. #9 relayed to nature, #10 terrain, #11 demo (boot budget ≤1 s).

---

## Round 4

### 12. roads (relay) — the 68–168 ms "roads-prefetch" step in the flythrough (critic r3 issue 2)
Reproduced in `/?showcase=streaming` (seed 1337, t ≈ 11 s). Instrumented call stack of the long step (inside
`services.roads.prefetcher().update()`):
`Prefetcher.run` rivers phase → `this.world.cellAt(4, 103, -6)` (prefetch.ts ≈ line 271, or the reads inside
`rn.linkIter`) → villages layer (stage 3) for that cell reads a stage-2 cell 27 cells away, `cellAt(3, 130, -14)` →
roads layer → `net.cell` → **`net.region(10, -2)` computed synchronously**: `alive/aliveDeg` closure 136 ms incl.
`extraDirs → needs → deg1 → net.path(15,1,1)` A* 68.8 ms and `path(13,4,0)` 41 ms; `keptDirs → cand → rescue2` 21–30 ms.
The rivers phase only prefetches the regions of the gate cells and of the link box corners (`region(...)` before
`cellAt(4, …)`), but the villages layer reads the road network around its village footprint (≥ 2 macro regions
away). Proposed fix in `prefetch.ts`, rivers phase: before every `this.world.cellAt(4, q, r)` and before
`rn.linkIter(k, n)`, prefetch the road regions in a ±2 macro-region neighbourhood (and the whole link box, not only
its corners):
```ts
const around = function* (this: Prefetcher, q: number, r: number) {
  const I = Math.floor(q / MACRO), J = Math.floor(r / MACRO);
  for (let a = I - 2; a <= I + 2; a++) for (let b = J - 2; b <= J + 2; b++) yield* region(a, b);
}.bind(this);
// gate cells: replace `yield* region(Math.floor(q / MACRO), Math.floor(r / MACRO));` by `yield* around(q, r);`
// link box: replace the corner loop by
const qa = Math.min(g0.q, g1.q) - 6, qb = Math.max(g0.q, g1.q) + 6, ra = Math.min(g0.r, g1.r) - 6, rb = Math.max(g0.r, g1.r) + 6;
for (let a = Math.floor(qa / MACRO) - 2; a <= Math.floor(qb / MACRO) + 2; a++)
  for (let b = Math.floor(ra / MACRO) - 2; b <= Math.floor(rb / MACRO) + 2; b++) yield* region(a, b);
```
(Better still: villages exposes its read footprint per village so the prefetcher can do exactly that closure.)

### 13. terrain (relay) — split `buildChunk` (critic r3 issue 4: single steps 14–15 ms)
Terrain's `buildChunk` is the largest remaining single step (14.3 ms typical max, 17–42 ms cold). Streaming runs one
module per step and cannot split inside it. Request: `services.terrain.buildSteps?(chunk, out): Generator<void>` that
yields between tops / columns / shore+water / colliders (same output as `buildChunk`); streaming will drive it like
`prefetchStep` (one slice per scheduler step), falling back to `buildChunk` when absent. Same for roads' `buildChunk`
(15 ms max in critic r3) and nature's merge if it can be cut by species.

### 14. core/debug.ts `markReady()` — remove the loading overlay immediately (no 0.4 s fade + delayed `remove()`)
Measured A/B (seed 123, real input from ready, 2 runs each): with the current fade the frame at ready + 0.49–0.50 s
takes 65–81 ms (also 57–95 ms in shoot runs: critic r3 issue 3), with immediate removal the first 3 s max out at
20 ms. Removing a full-screen fixed element above the WebGL canvas while it renders makes the compositor re-layer the
canvas. Streaming now removes `#loading` itself in its `ready` handler (the world behind is complete); please make it
official:
```ts
export function markReady(): void {
  (window as any).__kfb.ready = true;
  document.getElementById('loading')?.remove();
}
```
(and drop `transition: opacity .4s` from `#loading` in index.html).

---
**Integrator 2026-10-06:** #14 applied (markReady removes overlay immediately). #12 relayed to roads. #13 (terrain/roads buildSteps) deferred.

### 15. demo (relay) — the "~9 s after boot" 77–242 ms frame is the controls hint's DOM removal
Measured (seed 50, real input, `tools/perf.mjs` logs every removal of a `<body>` child): the hint `<div>` ("W run ·
Shift walk …") is removed at ready + 7.5 s (25 m moved; 9 s when standing = `SHOW_S`), and the frame right after it
takes 96–242 ms (4 runs). Same mechanism as the loading overlay (#14): removing a fixed full-screen-layer element above
the WebGL canvas makes the compositor re-layer the canvas. A/B: `?hint=0` → no hitch; hint kept in the DOM but hidden
(test hook `--noremove`: opacity 0 + visibility hidden) → no hitch (2/2). Fix in `src/modules/demo/hint.ts`:
```ts
      if (this.t > SHOW_S || movedMetres > 25) {
        this.fading = true;
        this.el.style.opacity = '0';
        // keep the element: removing it re-layers the canvas (one 100–240 ms frame); hide it after the fade instead
        setTimeout(() => { this.el.style.visibility = 'hidden'; this.done = true; }, FADE_S * 1000 + 50);
      }
      return true;
    }
    return !this.done;
```
(add `private done = false;`). Core's own loading overlay: #14 (streaming already removes it inside the ready frame).
