# LP01 · route proof v4 · Sky-Deck double loop on the SC01 bridge + continuous cables · RETURN · 2026-09-27

**Why v4:** Georg's verdict on v3 was "no connection between the tracks anymore, did you use the cable logic at all?" He was right. v3 cut its ribbons at every section border and rebuilt them per skin: decoration per section, not cable logic.

**Georg's decisions (27.09):**
- **Cables are continuous; skins are parameter presets.**
- **Decoration** (rings, ties) is saved as separate elements later. It is not part of this proof.
- **The track must fit the bridge model.**
- **Double loop with the two pylon cross-beams (portals) as the loops' lower apex ("Sky-Deck").**

**Status:** Blender preview/oracle on the SC01 **MB** numbers. The Track Core reads `lp01_v4.routes.json`.

## Defects and limits first

1. **The Sky-Deck between the pylons (318 m at ~41 m height) has no support yet.**
   - Its support has to come from the bridge/design job (secondary arch, hangers to the main cable, clay stilts, …).
   - Nothing here may cross the driving surface.
2. **The portal clearance is only 0.31 m**, from the deck underside or rail of the lower knot run to the portal top; the target was 1.0 m. The pitch of the loop inside the ±1.8 m portal-depth window eats the margin. Fix: `knot_clear` 1.5, or lower the portal by 0.7 m in SC01.
3. **At the knot the two lanes run side by side over the portal with only ~2 m edge gap** (lane centres ±5.9 m, coaster deck 10 m wide).
4. **The loop is 40 m high on a 40.6 m base, so the top is at ~81 m above the bridge deck.** That is taller than the pylons (46 m). `loop_H` is one parameter.
5. **Lift and drop grade is 30 %.** That is coaster/magnet territory and only works in `magnet_push` / `locked`.
6. **The SC01 pylons, portals, crowns and main cables are a light reference proxy** built from the SC01 MB parameters. They are not the SC01 mesh, and the crossing hangers are not modelled.
7. **GLB:** the Draco-compressed copy (0.5 MB) is on GitHub because the web upload is limited to 10 MB. The uncompressed 11 MB GLB is in Dropbox.

## Cable rule (candidate for spec v0.2)

- **Every cable is ONE continuous strand per route.** Cables: `railL`, `railR`, `edgeL`, `edgeR`, `centre`, `spine`. The deck is the widest "cable", a band with a per-sample width.
- **A skin is a preset of (lateral, height, radius, colour) per cable, plus the deck width** (road 12 m, coaster/magnet 10 m).
- **At a section border the presets blend over `trans_len` = 24 m (smoothstep).**
  - The road barrier becomes the coaster rail: it moves 6.2 → 4.8 m inward, drops 1.0 → 0.45 m and thickens 0.25 → 0.42 m.
  - The spine grows from under the deck (0.05 → 0.75 m).
  - The edge and centre lines thin out but stay the same cable.
- **Junctions:**
  - The branch starts ON the through lane; all its cables start on the through lane's cables.
  - The branch's outer rail continues the through lane's left barrier.
  - That barrier then goes flush over 20 m (h 0.05, r 0.08) and stays flush across the shared deck.
  - The inner rails of both lanes rise again at the gore (decks 1.4 m apart).
  - The merge is the mirror.
- **Checks:**

| Check | L | T | Limit |
|---|---|---|---|
| Position jump (beyond the centreline step) | 0 m | 0 m | 0.05 ✔ |
| Radius change per metre | 0.044 | 0.013 | 0.05 ✔ |
| Splines per cable per route | 1 | 1 | ✔ |

## Layout (SC01 MB: pylon W x = 0, E x = 318; through lane y = −7, branch y = +7 on the 29.6 m bridge deck)

| s (m) | section | skin | mode | roll law |
|---|---|---|---|---|
| 0–111 | split S on the deck | road | assist | flat (no bank on the shared deck) |
| 111–286 | magnet lift 0 → 40.6 m (30 %) | magnet | magnet_push | auto_bank |
| 286–316 | approach | coaster | locked | auto_bank |
| 316–475 | **loop 1**, knot over the W portal | coaster | locked | loop |
| 475–735 | sky run (S −y → +y) | coaster | locked | auto_bank |
| 735–894 | **loop 2**, knot over the E portal | coaster | locked | loop |
| 894–1035 | exit + S at altitude | coaster | locked | auto_bank |
| 1035–1210 | drop (30 %) | coaster | locked | auto_bank |
| 1210–1250 | run-out, release zone | road | assist | flat |
| 1250–1361 | merge S | road | assist | flat |

## Checks

| Check | Value |
|---|---|
| Roll rate max / flip | 1.26 °/m / none |
| Min speed in the loops (`v_launch` 34 m/s at the loop base) / needed at the top | 19.3 / 11.1 m/s ✔ |
| SC01 clearance: pylon legs | 2.93 m ✔ |
| SC01 clearance: crowns | 1.81 m ✔ |
| SC01 clearance: portal | 0.31 m (tight, see defect 2) |
| Knot | lower run 4.4 m above the loop base; the base is set so the knot clears the portal top |

**Run log (this session):**
- **Run 1:** the auto-bank on the split S tilted the branch deck 1 m into the bridge deck. Fix: the `flat` roll law on all deck-level sections.
- **Run 2:** the lift start picked up the S-curve heading, a 5.95 °/m roll step. Fix: auto-bank windows stay inside contiguous auto-bank runs.

## Files

- `build_lp01_v4.py` (md5 `8b9daa82…`): pure-python core (routes, frames, cables, checks) plus a Blender layer.
- `lp01_v4.routes.json`: samples (s, p, roll), sections, skins (presets), cable rule, zones, junctions, SC01 sockets, checks.
- `lp01_skydeck_v4_draco.glb` (0.5 MB, Draco).
- `lp01_v4_overview.png`, `lp01_v4_loop_on_portal.png`, `lp01_v4_junction_cables.png`, `lp01_v4_skin_transition.png`.
- Dropbox:
  - `LP01-ELEVATED-LOOP/KFB_LP01_SKYDECK_v4.blend` (new file; v1–v3 kept);
  - `lp01_skydeck_v4.glb` (11 MB, uncompressed).
