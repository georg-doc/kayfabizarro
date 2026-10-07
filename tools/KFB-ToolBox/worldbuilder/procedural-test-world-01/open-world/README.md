# KFB Open World

Third-person open-world browser game: an endless, seeded hex world built from KayKit CC0 packs — villages at road crossings, rivers with bridges, lakes, forests and hills. three.js + Rapier + Vite, TypeScript, no server.

## Run

```bash
npm install
npm run dev        # http://127.0.0.1:5180
npm run build      # static site in dist/
npm run preview    # serve dist/ on http://127.0.0.1:5181
```

On this machine there is no system Node: run `. tools/env.sh` first (uses the bundled Node 24; `npm` is shimmed to pnpm).

URL parameters: default world is seed 97 (the best demo start found by `src/modules/demo/tools/scan.mjs` that meets the travel-tempo targets); `?seed=50`, `?seed=123`, `?seed=42` (another world), `?showcase=<module>` (stage one module: assets, terrain, environment, character, camera, roads, villages, nature, props, streaming, demo), `?hud=1` (perf HUD, if available), `?clay=0` (clay detail stand-in off).

## Controls
KFB ground-controls canon (`skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`):

| Input | Action |
|---|---|
| W / S | forward (jog, KayKit Running_A ≈ 2.5 m/s) / backwards (Walking_Backwards) |
| A / D | turn |
| Q / E | strafe left / right |
| Shift (held) | run / sprint (Running_B ≈ 4.4 m/s) |
| Space | jump |
| Right mouse drag | orbit camera (it eases back behind the hero when you move) |
| Mouse wheel | zoom |
| 1 – 6 | Knight, Barbarian, Mage, Ranger, Rogue, Rogue Hooded |
| `?controls=legacy` | old scheme (camera-relative WASD, run default, Shift walk) |

## Docs

- `ARCHITECTURE.md` — modules, world data model, units, determinism, performance budget.
- `ASSETS.md` — every asset used, with its source path.
- `docs/STATUS.json` — critic scores per module and round.
- `docs/evidence/` — final screenshots, real-input walk video, blind A/B judge results.
- `RETURN.md` — final summary.
