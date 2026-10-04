# RETURN · WORLD-CORE-MOBILITY-R0A · Clay World Visual Donor

**From:** Claude Design (KFB World Design Setup) · **To:** WORLD-CORE-MOBILITY-R0B (Codex) · **Date:** 2026-09-29
**Status:** `CANDIDATE`, design only. No Hub, UI system, track core, locomotion, vehicle or collision code was written.

## Problems first

1. **Frame rate in the design preview is low (≈ 6 fps, 1.47 M triangles per frame incl. shadow + GTAO passes, 313 draw calls).** Scene is 404 k triangles. Biggest meshes: terrain 113 k, kerb stones 46 k, T4 strang 46 k, sidewalk slabs 31 k. The K2 material costs up to 54 extra texture reads per pixel (K2 handover, open item 4). Budget, LOD, instancing and chunking are R0B's job; nothing here was optimised.
2. **Mesh clay traces (Knetspuren) are subtle at walk height.** 2 029 stamps (thumb 719 · spatula 645 · pinch 400 · notch 265), mean displacement a few cm, max ≈ 0.6 m. They read best in raking light (evidence 11 vs 12). Terrain grid is 1.25 m, so the mesh carries forms ≥ 2.5 m; everything finer stays with the K2 material. If Georg wants them stronger: `meshTools.stamps.*.depth` in the recipe, nothing else.
3. **Markings on T4 come from the stream bands** (`edges`, `centre`) in M2 colours. The M2 renderer (`road-markings.m2.js`) is not wired into this tile; city markings follow the M2 rules by hand (all white, Wartelinie 0.6 m behind the R1 edge line, zebra).
4. **Road surface shimmers at grazing angles** (T2 road profile, legacy stroke map). Known since K2, deliberately untouched.
5. **Evening sky tints the meadow olive.** `tiny-abend` is shown as an option, not tuned.
6. **Kenney `building-type-c` keeps its own dark plinth strip** (part of the model, not a plate). Sunk 0.3 m; still visible from close.
7. **Portal:** the track section behind `s 1316` is not built; the terrain wall sits behind the tunnel mouth. Fine for the donor, needs a real tunnel or streaming in runtime.

## What the tile proves (brief items 1–6)

| # | Brief | Where to look |
|---|---|---|
| 1 | T4 track and city roads are one world | TD03 `s 1316 → 1570.37` placed with identity transform. Strang lies on a clay ridge (no pillars), jumps the Knetbach, lands, becomes the street: road colour blends via Knetflecken over `s 1516–1540`, the Wulst turns into a kerb lip over `s 1508–1534`, then real kerb stones and sidewalks continue into the junction. Same road material and road profile on both. Evidence 02, 04, 07. |
| 2 | Terrain, hills, sidewalks, buildings, trees, rocks, props in H0/K2 clay | K2 material v10 + tool mixes per class for everything; Knetflecken grass/violet slopes and grass/city plate; Rule-of-Three clusters, Kugel-in-Kugel crowns and clouds; Worley mesh traces. Evidence 01, 10, 11. |
| 3 | Buildings baseplate-free, integrated, bent facades | `*_withoutBase` KayKit files, terrace pads or slope cuts (B07 cut into the Stadthügel, back buried), 0.3–0.35 m sink, pressed clay seam (Knetwulst) in ground colour sampled from the terrain. Bend/twist/height rhythm from `transition-atlas.v1 bend()`. Evidence 09, 10, 13–15. |
| 4 | Sparse, clusters, small landmarks | 9 buildings, 21 props, 17 fence parts, 9 clusters, 4 rocks on 340 × 260 m. Landmarks: Knetberg portal, KayKit H tower with sign socket, Tiny Treats house on the Hausberg, footbridge. |
| 5 | TinySkies/KFB sky, biome palette, T4 particle cues | Sky dome from TinySkies DAY/EVENING gradients + flat Claybound; biome `kfb-claybound-meadow` seed 20260929 in the recipe; demo kart emits `roll`, `landing`, `biome` through `clay-vfx.v1`. Evidence 17, 18. |
| 6 | Walk, Auto, Flight views with clear space | Cameras in the recipe; masks overlay: yellow walk, blue drive, light blue offroad, pink sockets and jump corridor, violet flight band. Evidence 02–05, 08. |

## Numbers (design preview, 29.09.)

- Donors 19/19 loaded, 0 quarantined, 7.7 s from jsDelivr · build 0.6 s · boot 11.4 s
- Terrain 273 × 209 = 57 057 vertices · 284 sidewalk slabs · 430 kerb stones
- Scene 404 k triangles · 313 draw calls · ≈ 6 fps in the preview (not a runtime claim)

## Tests

- Run: DC loads without console errors; all 19 donors load and render alone on the donor bench (source left, clay right); every camera renders; masks/Knetspuren/VFX/sky toggles work.
- Not run: real-time budget on target hardware, mobile, static-server boot outside the design preview, any movement, collision or interaction test (all R0B).

## Exactly one next gate

**Georg's picture verdict on this tile** (overview, walk, drive, flight). If accepted, R0B implements the runtime against `lab-world/world-recipe.r0a.json`; the look is not to be re-derived.
