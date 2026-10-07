# roads → core requests

1. **Vite glob refresh for new modules.** `src/core/main.ts` uses `import.meta.glob('../modules/*/index.ts')`; with
   `hmr: false` the dev server did not pick up the new `roads/index.ts` ("no module roads"). I touched main.ts's mtime
   once (no content change) to refresh it. Villages / props / demo will hit the same — suggest the integrator restarts
   the dev server or touches main.ts when a module folder gets its first index.ts.
2. (optional) A per-frame idle hook / time budget from streaming for layer prefetch would let roads compute new macro
   regions ahead of chunk builds without hitches.
