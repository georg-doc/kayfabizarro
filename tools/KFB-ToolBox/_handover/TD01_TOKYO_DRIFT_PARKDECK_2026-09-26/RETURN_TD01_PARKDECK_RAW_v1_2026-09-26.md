# TD01 · Tokyo-Drift parking deck · raw build v1 · RETURN · 2026-09-26

**For:** Elisa (Georg's request 26.09, "Tokyo Drift parking deck / high-rise").
**Author:** Claude Coworker (Blender lane).
**Status:** RAW BUILD. Form and scale only: grey, no look, no drivable surface. Georg decides PASS / TUNE on form.

## Defects and limits first

1. **Not drivable yet, by design.** The helix deck is a scenery shell. The drivable surface comes from the Track Core (W0 frame stream) along the exported centreline. This is the same rule as SC01/SC02: no one-off track generator.
2. **The ramp type is only one of several options.** v1 uses one central helix (one full turn per level).
   - Alternatives for TUNE: split-level half-ramps, or straight ramps between flat decks. The film location was a straight-ramp multi-storey car park.
3. **Headroom between helix turns is 3.55 m.** That is fine for cars. For a chase camera it may feel tight; this can go up with the level height (4.0 → 4.5 m).
4. **The roof drift loop is tight at the outside:** 1.3 m to the roof parapet. The slab was widened from 76 m to 90 m because at 76 m the loop would have crossed the helix hole. This was found before the first run.
5. **Level entries are gaps in the outer parapet only.** There are no aprons, markings or ramp transitions. Transition design is a Track Core / visual-grammar job.

## What was built (script `build_td01_parkdeck.py`, md5 `4f89799e…`)

**Helix:**
- centre radius 22 m;
- deck 12 m (10.8 m lane + 2 × 0.6 m shoulder);
- 5 turns, 4.0 m per level, from the street (z 0) to the roof (z 20);
- grade 2.89 %;
- centreline length 691 m.

**Parts:**
- helix deck, inner parapet (continuous), outer parapet with a 14 m entry gap per level;
- hollow core tower (r 13 m, 3 m clear to the inner edge; it rises 3 m above the roof);
- 90 × 90 m floor slabs L0–L5 with a round hole (r 28 m = outer helix edge);
- columns on an 8.5 m grid;
- roof perimeter parapet.

**Routes and sockets:** `td01_parkdeck.routes.json` (runtime frame: x right, y up, z forward):
- `helix`: 481 samples (s, p, bank 0);
- `sockets`: level_0 … level_5 entries at s = 0 / 138.3 / 276.6 / 414.9 / 553.2 / 691.4 m;
- `roof_loop`: rounded rectangle for drifting (corner radius 12 m), 4.6 m clear of the hole.

## Files

- `build_td01_parkdeck.py`
- `td01_parkdeck.routes.json`
- `td01_parkdeck_raw.glb` (1 MB)
- `td01_top.png`, `td01_cutaway.png` (the cutaway hides the roof, L3 and L4 in the viewport only)
- Dropbox: `TD01-TOKYO-DRIFT/KFB_TD01_PARKDECK_v1.blend` (new file, own version)

## Next (after Georg's form verdict)

1. **TUNE:** ramp type, level height, footprint, roof loop.
2. **Satirical driving school at the Otto-Maigler-See** as the second Elisa set piece. It links to the OSM City TrafficPlan hooks in #223.
3. The look waits for the clay PASS in Claude Design (POC route), so both Elisa pieces share one material.

**Exactly one next gate:** Georg orbits the model in Blender and gives PASS / TUNE on the form.
