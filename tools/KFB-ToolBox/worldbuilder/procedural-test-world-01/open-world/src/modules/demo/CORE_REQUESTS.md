# demo — core requests

## 1. Default seed of game mode `/` → 123 (round 2, BLOCKING for "the default game opens on the best demo")
`src/core/engine.ts` line 56, exact one-line change:

```diff
-    this.world = new WorldModel(Number(params.get('seed') ?? 1337) | 0);
+    this.world = new WorldModel(Number(params.get('seed') ?? 123) | 0);
```

Why 123: best of 150 scanned seeds (1–150 + 1337) by the offline spawn scorer (`src/modules/demo/score.ts`,
`tools/scan.mjs`): score 98.5 / 100 — village v-14,5 (17 buildings all on one level, core 19/19 cells flat, 0 cliff
edges, paved plaza + well, tavern/market/church/blacksmith), bridge 75 m by road (A1 ≤ 110 m), forest edge 64 m on
foot (A1 ≤ 80 m), a forest 34 m beyond the bridge (one continuous route), spawn view with 5 buildings + the well
in frame, 184 m from the origin. Seed 1337 scores 76.7 (best village 12 buildings, no forest beyond the bridge).
Seed 123 is precomputed in `src/modules/demo/presets.ts` (FIXED → zero world lookups at boot; demo init 1–3 ms).
Real input (closed-loop script, held W from the crossing): bridge 19.3 s, forest edge 17.5 s (A1 25 / 18 s ✓).
Other places that hard-code 1337 as "the default world" (critic prompts, docs, tools/scripts) should follow.

## 2. (done) `{"until": "<js>", "timeout": ms}` steps in tools/shoot.mjs — thanks, the route scripts use them.
