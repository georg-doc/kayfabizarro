# S8b · vehicle envelope: do all vehicles pass? · 2026-09-27

**Georg (27.09):** Work out how high tunnels must be so that every vehicle passes. That includes the big Kenney vehicles (garbage truck, fire truck …) at the scale the car kit uses. Mechs, walkers and transformers get adapted so they are no taller than a tall truck. If something does not fit, scale it down.

## Defects and open points first

1. **The Tokyo-Drift balcony crossings do not pass trucks.** Clearance under the balcony decks:

   | Track | Clearance |
   |---|---|
   | TD03 | 3.35 m |
   | TD04 | 2.52 m |
   | TD05 | 3.25 m |

   The firetruck (3.25 m) clears TD03 by 0.1 m, touches under TD05 and does not fit under TD04. Toy truck and monster truck fit nowhere.
   - The old check `crossing_headroom` used a cartoon car of 2.2 m.
   - The new check `vehicle_headroom` reports these crossings as **warnings**. They are left as warnings, not errors, until Georg decides to raise the layouts (about +2.5 m at the worst TD04 crossing) or to keep trucks off that route.
2. **The monster truck is 4.89 m tall and lies above the proposed cap of 4.0 m.** It either shrinks to 4.0 m (× 0.82, 4.66 m long) or becomes the one exception. The poly "Wagon" (5.09 m) is a Frankensteining fixture, not a race vehicle.
3. **The scale is visual only.** It is the Box-Stop BOX1 normalisation (lengths: cars 4.1 m, van 5.0 m, heavy 6.5 m, monster truck 5.7 m, karts 3.5 m). The Box-Stop RETURN itself says that visual scale is no collision or handling certification: all vehicles share one contact proxy.
4. **Mech sizes are not measured yet.** The Travel-Globe vehicle contract lists `massstab` as an open measurement. The rule "mech ≤ tall truck" is therefore a contract proposal, not a checked fact.

## Measured (Kenney GLBs × Box-Stop scale factors, re-measured in Blender)

| Vehicle | Kit | W × L × H (m) |
|---|---|---|
| sedan | car kit | 2.41 × 4.10 × 2.09 |
| van | car kit | 2.73 × 5.00 × 2.45 |
| garbage truck | car kit | 3.01 × 6.50 × 3.01 |
| firetruck | car kit | 2.87 × 6.50 × 3.25 |
| truck | toy car kit | 3.96 × 6.50 × 3.96 |
| monster truck | toy car kit | 4.07 × 5.70 × **4.89** |

The Box-Stop list also holds karts (3.26 m with driver), city-builder cars (1.6–1.9 m) and toy racers (1.5–2.4 m). All of them are below 4 m.

## Proposal (core v0.7.1, `VEHICLE_ENVELOPE`)

- **height 4.0 m.** This is the tallest-truck class (toy truck 3.96 m). Mechs, walkers and transformers are scaled to fit it; the monster truck is scaled down to it.
- **reserve 1.0 m.** This covers bounce, squash-and-stretch and crests.
- **Headroom 5.0 m clear over the whole road width.** Tunnels are fitted to it (`TUNNEL_DEFAULTS.headroom`), and crossings are measured against it (`vehicle_headroom`).
- The proposal gets **one** number to change if Georg picks a different cap.

## What it means for the tunnels

**Every TN01 tube passes every vehicle.** The lowest roof over the road is 10.4 m (rect, building passage). The tubes are big because the section must hold the 23 m wide road plus barriers, not because of the vehicles (shots `t10`, `t11`).

The tunnels could be much flatter. These are the lowest heights with the 5 m envelope on a STANDARD road (14.4 m) with the default widths:

| Shape | Lowest h | Roof over the road |
|---|---|---|
| rect 26 m | 6.0 m | 5.4 m |
| oval 30 m | 7.5 m | 6.0 m |
| octagon 28 m | 7.5 m | 5.8 m |
| hexagon 28 m | 7.75 m | 5.5 m |
| round | 26 m, because a round tube is as tall as it is wide | 19.5 m |

A smaller round tube needs a narrower road in the tunnel (NARROW 10.8 → round 22.4 m) or a slightly flattened round.

**Which proportion looks right is Georg's call.** Roomy cartoon tubes (now) and tight tubes (more speed feeling) are both possible.

## Files

- `track-core/track-core.mjs` (v0.7.1) and `test.mjs`: 190 / 190 expected, 0 unexpected. The TD03 / TD04 / TD05 crossings appear in the report as `WARN`.
- `blender/s8_vehicles.py`: imports the Kenney GLBs from `assets/vehicles/` (pinned repo commit `10a7fdc…`, CC0), scales them by the Box-Stop factors, lines them up at the round portal and inside the rect passage, and renders `t10` / `t11`.
- The Blender file `KFB_TRACKCORE_S8_TN01_v1.blend` now holds the collection `S8_VEHICLES`.
