# terrain → core requests

None open. Applied by the integrator and used: `world.heightProvider` (terrain installs its exact height function),
half-ramp `defaultHeightAt`, `PLAYER_ONLY_GROUPS` (lake blockers are now player-only; a camera-only sensor keeps the
camera above the water surface).

Note for roads (not a core request): terrain softens the top-edge bevel of `hex_grass`, `hex_grass_bottom` and the
waterless coast tiles in place (look.ts `softenBevel`, rim −0.05 → −0.02 asset units, grass-UV vertices only). Road and
river tiles keep KayKit's deeper bevel; if the seam step at road/grass borders bothers anyone, roads can call the same
exported helper on their own tile ids.

## Open (2026-10-06, whole-game r2): ramp flanks
Terrain's natural ramps are now TONGUES (a low cell leaning against a one-step cliff) with earth embankments on the
4 side neighbours (stage-1 tag `embankment`, `TAG.embankment` in terrain/api.ts). Please forward to **villages** (no
building/lot on `embankment` cells) and **roads** (avoid routing through `embankment` cells when an alternative exists).
Where a building still lands on one, terrain skips the embankment and the ramp's dirt side shows (2–5 edges per 61×61
cells per seed, all next to buildings).
