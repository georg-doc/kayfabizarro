# nature — CORE_REQUESTS

1. **Vite glob does not see new module folders.** With `hmr: false`, `import.meta.glob('../modules/*/index.ts')` in
   `src/core/main.ts` kept its old key list after `src/modules/nature/index.ts` was created ("no module nature").
   Workaround used once: `touch src/core/main.ts` (mtime only, content unchanged). Request: restart the dev server or touch
   main.ts whenever a new module folder appears (villages, props, streaming, demo will hit the same).
2. (wave 3, streaming) Nature chunk build is ≈ 7 ms warm. If the per-frame budget is enforced strictly, let modules split
   heavy chunk work over frames (e.g. nature builds one frame after terrain), or build in idle time. Nature publishes
   `services.nature.detailRadius` (bushes/rocks/grass culling radius, default 125 m) for streaming to tune.
