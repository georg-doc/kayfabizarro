# START_HERE · WORLD-CORE-MOBILITY-R0A · Clay World Visual Donor · 2026-09-29

1. **Slice:** WORLD-CORE-MOBILITY-R0A · Claude Design · visual donor only (no runtime)
2. **Status:** `CANDIDATE` · waiting for Georg's picture verdict · not merged, not promoted
3. **Receiving job:** WORLD-CORE-MOBILITY-R0B · Codex GPT-6 Sol High (xhigh only for the final integration/verification pass)
4. **Open:** serve this folder statically (`python3 -m http.server`), open `KFB World Core R0A · Clay World Donor.dc.html`.
   Needs network: three@0.160.0 from unpkg, donors from jsDelivr `georg-doc/kayfabizarro@378b209355b13304e3cff656ec0806ca5b89df28`.
   Cold boot in the design preview ≈ 11 s (donors 7.7 s, clay tool maps 1–3 s, build 0.6 s).
5. **Read in this order:** `RETURN.md` → `lab-world/world-recipe.r0a.json` → `DONORS.md` → `evidence/` → `CHANGELOG.md`
6. **The authoritative artefact is the recipe**, not the renderer. `clay-world.r0a.js` only rebuilds what the recipe says; R0B should read the same JSON.
7. **Does NOT own:** locomotion, Walk/Auto/Flight states, [I] interaction, collision, contact shadows, vehicle physics, performance, Hub/UI.
8. **Frozen, do not reuse as base:** `kfb-hub/stage/world/clay-city-mvp-01` (ARCHIVED_FAILED_CANDIDATE, Georg freeplay FAIL 29.09.).
9. **Fingerprint map** `ref/clay-joebinns/Fingerprints01_3K.png` (CC0, 4.7 MB) is not in this folder, same as H0/K2/T4. Copy it in for the full K2 look; without it the material falls back cleanly.
