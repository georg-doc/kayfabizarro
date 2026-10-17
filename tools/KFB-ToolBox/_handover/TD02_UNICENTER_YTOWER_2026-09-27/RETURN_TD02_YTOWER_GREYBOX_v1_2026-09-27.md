# TD02 · Uni-Center Y-Drift-Tower · greybox v1 · RETURN · 2026-09-27

**For:** Elisa.
**Inputs:**
- `DECISION_OMS_FIDELITY_VS_FUN_2026-09-27.md` (Georg's rule);
- `KFB_Uni-Center_Tokyo-Drift_v1.md` (Perplexity);
- TD01 helix reused as one knot.

**Status:** GREYBOX. Form, scale and routes in real metres. Not drivable by design (the Track Core lays the surface on the exported centrelines). Georg decides PASS / TUNE on form.

## Defects and limits first

1. **Knot connections are missing.**
   - The helix ends in the hole at podium-roof level with no apron onto the roof drift loop.
   - The balcony starts next to the podium arm edge with no ramp or apron.
   - The helix has no exit gaps in v1.
   - Connections are Track Core pieces (transitions); they are not modelled here.
2. **The balcony passes over the roof drift loop with 4.1 m clear height.** This is checked across the full deck width.
   - A first run with the balcony starting mid-edge gave 3.32 m. It now starts right after the hub-end corner, so the crossing comes late in the lap.
   - 4.1 m is enough for cars but may feel tight for the chase camera. TUNE options: wing height 6 → 7 m, or the roof loop avoids the yellow sector.
3. **Only one wing (yellow).** Orange and green are podium arms only. This is intentional for v1.
4. **The colour code (orange/green/yellow) comes from Perplexity and is not verified.**
5. **The ribbon route preview is thin at overview distance.** Zoom in to read it.

## What was built (`build_td02_ytower.py`, md5 `7cd237a8…`)

**Plan and podium:**
- Y plan: hub r 44 m and three podium arms 28 × 50 m at 90° / 210° / 330°. The arms attach flush to hub chords.
- Podium: 3 levels × 5 m (roof at 15 m), with the helix hole r 28 m, plus a column grid.

**Core and wing:**
- Core tower: r 13 m, 60 m high, slight taper.
- Yellow wing: 6 decks × 6 m above the podium (top at 51 m), tapering 3 % per deck.

**Routes (runtime frame in `td02_ytower.routes.json`):**
- **K1 helix** (TD01 reused as one knot): r 22 m, 12 m deck, 3 turns street → podium roof, grade 3.62 %, headroom 4.55 m.
- **K2 roof drift loop:** r 35.5 m around the hole, outer edge 41.5 m (hub edge 44 m).
- **K3 yellow balcony climb:** rounded rectangle around the wing (offset 7 m, corner r 12 m).
  - 2 laps of 191 m each, 15 → 27 m, grade 3.14 %.
  - Headroom 5.55 m; 1 m clear to the wing edge.
  - It ends at the socket `crane_jump_start` (v2: crane-arm jump finale).

**Sockets:** `street_entry`, `podium_roof`, `balcony_start`, `crane_jump_start`.

**Route preview = "ribbon cables"** (Georg's reference: r/geometrynodes procedural ribbon cables). One centreline is swept into parallel strands at lateral offsets:
- lane edges ±5.4 m;
- a centre stripe;
- barrier lines ±6.2 m at 1 m height.

## The ribbon-cable principle (Coworker assessment)

It is the same structure as our Track Core: **one centreline + a frame, and each "cable" is one layer at a lateral offset** (lanes, stripes, curbs, barriers), with UVs along arc length `s` and connectors at the ends.

**What we take from it:**
- the layered-offset rule;
- UV along `s`, so markings never stretch;
- connector blocks at the ends = our sockets;
- as a **look idea**, the bundled, colour-striped cartoon cable as a candidate style for track edges and barriers (a design-language brief).

**Watch-outs:**
1. **Offset limit:** an offset larger than the local curve radius self-intersects. The rule is minimum radius > half the width plus a margin; here the minimum radius is 12 m vs 6.2 m.
2. **Corners:** their cables use polyline corners with fillets. Driving needs clothoid transitions, and the Track Core owns that.
3. **Geometry Nodes stays a Blender preview/oracle.** It is not a second source of truth next to the JS core (as already decided in #219).

## Files

- `build_td02_ytower.py`
- `td02_ytower.routes.json`
- `td02_ytower_greybox.glb` (1.8 MB, includes the ribbon preview curves)
- `td02_overview.png`
- Dropbox: `TD02-UNICENTER-Y/KFB_TD02_YTOWER_v1.blend` (new file)

**Exactly one next gate:** Georg orbits the model in Blender and gives PASS / TUNE on form and route rhythm.
