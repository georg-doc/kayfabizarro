# LP01 · route proof v5 · Sky-Deck double loop ON THE APPROVED SC01 BRIDGE · RETURN · 2026-09-27

**Georg on v4:** PASS on the cable look.

**TUNE:**
1. Try a dashed centre stripe.
2. Lanes that start small and widen (as in v1).
3. Loops at least as high as the pylons stand above the water, and wider.
4. **Do not reinvent geometry:** v4 had self-made pylon proxies. Use what works, what is approved and already part of the style, and the real environment / form language, even for demos.

## Defects and limits first

1. **Water level assumption [These].** The RKIT-11 fixture has river banks at 9 m and the deck at 17 m. I take the water surface as y = 0, so the pylon top is at 17 + 46 = **63 m** above the water.
   - The loop is **64 m** high, so its top is at ~121 m absolute, 104 m above the deck.
   - If the water owner defines another level, `loop_H` follows.
2. **The Sky-Deck between the pylons is still unsupported**, ~40 m above the deck over the 318 m main span. How it is carried belongs to the bridge/design job and must reuse approved families (SC02b classic supports, SC01 hangers/cable language). No new shapes.
3. **The bridge deck body does not exist.** SC01 is scenery only; the deck profile is the Track Core's. The lanes shown are Track Core stand-ins (12 m road / 10 m coaster), not a bridge deck.
4. **Speeds need cartoon physics:** `v_launch` 42 m/s at the loop base. The minimum speed in the loops is 22.5 m/s, and the top needs 14.1 m/s.
5. **The dashed centre is a visual gap of the same strand** (the radius drops to 2 cm in the gaps). The cable stays one continuous strand in the data.

## Use what works (what changed)

- **The bridge is built by the approved SC01 builder**, `build_sc01_bridge_shells.py`, unchanged: MB variant, `SC_OFFSET` (0, 0), same file and same frame.
  - LP01 follows the SC01 route (RKIT-11 fixture profile: banks 9 m, crest 17 m, crown) and its pylon stations (s 314.41 / 632.39 → runtime z −158.59 / 159.39).
  - The self-made v4 proxies and the self-made bridge slab are gone.
  - Only fix needed: `RKIT-02/scripts` is added to `sys.path` before the builder runs (`rkit3_lib` imports `rkit2_lib`).
- **Clearance is checked against the real SC01 meshes** (BVH on all SC01 MB objects except the route proxy): **min 1.19 m**, nearest piece `SC01_MB_portal_W`. The SC01 builder's own checks still PASS (0 corridor/deck intrusions).
- **The GLB contains only LP01.** The bridge GLB is SC01's own (`sc01_bridge_shell_mb_fixture.glb`).

## New in v5

- **Taper exit / entry (lane grows next to the through lane):**
  - Over 90 m the exit lane grows from 0 to 12 m. Its right edge stays glued to T's left edge.
  - All its cables scale from 0; its outer rail comes out of T's left barrier.
  - While the decks touch, T's left barrier goes flush and T's left edge line becomes a dashed lane divider.
  - A 70 m S then opens the 1.4 m gore; the inner rails rise there.
  - The entry is the mirror image (lane shrinks into T).
- **Dashed centre stripe on road skins** (3 m on / 3 m off). `dash` is a skin parameter and blends like the rest (road dashed → coaster solid thin).
- **Bigger loops:** H 64 m, top radius 20.2 m, footprint 95 m, knot runs 7.1–7.4 m above the loop base.
  - Base at 57 m absolute, 40 m above the deck, so the knot clears the portal (`knot_clear` 3.0 m; 1.5 m still touched the real portal arch).

## Checks

| Check | Value |
|---|---|
| Cable continuity L / T (position jump; radius/m, dashes excluded) | 0 / 0.044, 0 / 0.012 ✔ |
| Splines per cable per route | 1 ✔ |
| Roll rate / flip | 1.26 °/m / none ✔ |
| Loop speed min / needed at the top | 22.5 / 14.1 m/s ✔ |
| **Clearance to the real SC01 MB geometry** | **1.19 m** (portal W) ✔ |
| SC01 builder checks | PASS |

## Files

- `build_lp01_v5.py` (md5 `5c3b7177…`): pure-python core plus a Blender layer that runs the SC01 builder.
- `lp01_v5.routes.json`: runtime frame (x right, y up, z forward).
  - Samples carry s, p, roll and width; plus sections, skins (with `dash`), cable rule, zones and taper junctions.
  - Sockets: `knot_W` / `knot_E` = SC01 portals.
  - Checks include the real SC01 clearance.
- `lp01_skydeck_v5_draco.glb` (0.5 MB, LP01 only).
- `lp01_v5_overview_on_sc01.png`, `lp01_v5_loops_on_sc01_portals.png`, `lp01_v5_taper_exit_dashed.png`.
- Dropbox: `LP01-ELEVATED-LOOP/KFB_LP01_SKYDECK_v5.blend`, a new file that contains the SC01 MB bridge built by its own builder.
