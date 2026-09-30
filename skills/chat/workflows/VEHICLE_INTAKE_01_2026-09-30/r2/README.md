# VEHICLE-INTAKE-01 r2 · colours, light-blue glass, scale line-up, cabrio roof

Date: 2026-09-30 · replaces the placeholder colours of r1 (`KFB_CVP1_*.glb`). Geometry, node names, pivots and the cabrio roof animation are unchanged.

## Decision (Georg 30.09)
- **Scale A:** KayKit as shipped, one common factor for all rigs. Medium = 1.5 m, factor 0.616 (1 world unit = 1 m). No per-rig factors.
- Colours and light-blue glass as below.

## Colours (sampled from the itch.io pack screenshot, Georg 30.09)
| Car | Body (sRGB) |
|---|---|
| hatchback | #F5B928 |
| cabrio | #D73800 |
| pickup | #E64C00 |
| sportster | #C8D432 |
| sedan | #2A1690 |
| estate | #F8C24E |
| transporter (+ transporterWindow) | #8A64A0 |
| truck cab / box | #FF8A75 / #FF9A62 (`kfb_body_2`) |

Glass: `kfb_glass_tinted` #8CCBF0, alpha 0.45 (light blue), all cars.
The renders use Blender's studio light, so colours look darker than the hex values.

## Cabrio roof
`cabrio` carries one animation (`C4D Animation Take`, frames 0–104): closed at 0, fully open at 48–56 (roof folded behind the seats), closed again at 104. Use 0→52 to open and 52→104 to close.

## Scale line-up (`renders/scale_lineup.png`)
- A: KayKit as shipped with one factor (Medium = 1.5 m, factor 0.616): Large 2.49 m, Legacy 1.26 m, FrizzleBob 1.81 m with ears.
- B: per-rig factors: Large 2.0 m (0.495), Medium 1.5 m (0.616), Legacy 1.0 m (0.489).
- CVP1 sedan at KFB ×1.8 in this metre scale: 4.6 m long, 2.1 m high (race car in track-core: 4.1 m).
- The red box is only the 4.1 m race-car length; its height (1.3 m) is illustrative.
