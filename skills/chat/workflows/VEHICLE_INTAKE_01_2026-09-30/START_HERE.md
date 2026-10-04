# VEHICLE-INTAKE-01 · Cartoon Vehicles Pack 1 for KFB: seat fit, doors, tinted glass, FrizzleBob's ears

Status: **INTAKE REPORT + ASSETS · measured in Blender (headless 5.0.1)**
Date: 2026-09-30
Sources: Dropbox `BLENDER MCP/_inbox/`, Georg 30.09.

Georg 30.09:
- Use Cartoon Vehicles Pack 1, because KayKit Medium characters may fit inside, and we already have enter / exit clips.
- If the characters fit sitting (driving clip): great. Otherwise only doors open / closed and coloured or tinted windows, without a character.
- FrizzleBob's ears must fold back so they do not poke through the roof.

Georg judges the look. Every number below is a measured value or a starting value.

## 1 · Result first

1. **The KayKit Medium characters do not fit at the cars' authored scale.**
   - The cars are modelled at real-world size: the sedan is 4.0 m long and 1.96 m high.
   - The KayKit Medium Orc Raider is 2.31 m tall sitting (seat to head top), and FrizzleBob 1.93 m, 2.73 m with ears.
   - At scale 1, the heads stand 0.4–2.0 m through the roof.
2. **Scaled up, they fit cleanly.** With the car scaled ×1.5 to ×2.0 per model, the driving clip sits with no intersection with the body, doors, glass, dashboard or steering wheel, and with head clearance (table in §3).
   - This is the chibi look: big heads in slightly oversized toy cars. It fits KayKit.
   - The sportster is too narrow for the Raider even at ×2.0 (shoulders hit the side glass). It works for FrizzleBob at ×2.0.
3. **Doors, hood and trunk are separate parts with their pivots on the hinge.** Opening is one rotation per part, measured and rendered (table in §4).
   - Exception: the transporter's front cab doors and hood have pivots off the hinge and need a pivot fix before use.
4. **The pack ships without materials** (only UV guide images). I assigned flat KFB part materials, including tinted glass (alpha 0.4). The colours are placeholders; Georg decides.
5. **FrizzleBob's ears:**
   - In a closed car, the ears must fold back about 75° plus 45° outward (root-heavy, FB-EARS-FLOPPY-01 r2). The folded ear still presses slightly into the back of the head.
   - **The clean solution is the cabrio with the roof open:** the ears stay up, and with the wind input from FB-EARS-FLOPPY-01 they blow back.
6. **The FBX files are FBX 2011 (version 6100).** Neither Blender nor assimp can read them. I converted them with FBX2glTF (Autodesk FBX SDK); node names, hierarchy and pivots are kept.

## 2 · The two packs

| | Cartoon Vehicles Pack 1 (Divinux, 2016) | Free Cars (RG Poly) |
|---|---|---|
| Licence | **CC0**, `COPYING.txt` in the pack (CC0 1.0 full text) | CC0 per the itch page, quoted by Georg. **No licence file in the download.** |
| Content | 8 vehicles + a food-truck variant (`transporterWindow`): sedan, hatchback, estate, cabrio, sportster, pickup, transporter, truck; detail meshes (antenna, police lights, burger / ice-cream signs, wheels) | 11 of the 465 models (free part): ambulance, bus, 2 cars, 2 ice-cream trucks, pickup, police car, SMAT, sports car, taxi |
| Build | Full interior (seats, dash, pedals, gear lever, steering wheel), separate doors / hood / trunk, rigged soft top (cabrio, sportster), about 2–3k vertices | One body mesh + 4 wheels, texture atlas, no interior, no doors, about 1k vertices |
| Size | Real-world, 3.5–5 m | 2–3.3 m long |
| Use for KFB | **Characters inside, doors, enter / exit** | Traffic, background, racer obstacles |
| GitHub | pushed (GLB + licence), see §6 | **held back** until the licence is on file (a screenshot or text of the itch page next to the files) |

## 3 · Seat fit (driving clip `kfb_interaction_driving_a`, middle frame, driver seat)

Method:
- The character is placed with its hips over the driver seat, 12 cm in front of the seat centre, and the underside of the seat on the cushion.
- It is rotated to face the car's front.
- The car is scaled up in steps until the character meshes intersect nothing (body, interior, dash, steering wheel, doors, glass) and the head has more than 3 cm clearance.

"Clean scale" = the smallest car scale with no intersection.

| Car | Raider, clean scale | Head clearance there | FrizzleBob, clean scale | Head clearance there | FB ears vs roof (upright) |
|---|---|---|---|---|---|
| sedan | 1.8 | 32 cm | 1.5 | 26 cm | −54 cm |
| hatchback | 2.0 | 50 cm | 1.8 | 61 cm | −59 cm |
| estate | **1.6** | 12 cm | **1.4** | 20 cm | −60 cm |
| cabrio (roof open) | 1.8 | open | 1.6 | open | free |
| sportster | none up to 2.0 (side glass) | — | 2.0 | not measured (no roof hit above the head) | −39 cm |
| pickup | 1.8 | 16 cm | 1.5 | 13 cm | −67 cm |
| transporter | **1.5** | 40 cm | **1.3** | 42 cm | −38 cm |
| truck | 1.6 | 9 cm | 1.5 | 34 cm | −46 cm |

- The limit is mostly the width (shoulders and cheeks against the side glass), not the head.
- **Recommendation:** one fixed "KFB scale" per model, the larger value of the two characters: sedan 1.8, hatchback 2.0, estate 1.6, cabrio 1.8, sportster 2.0 (FrizzleBob only), pickup 1.8, transporter 1.5, truck 1.6.
- The alternative, one global ×1.8, fits everything except hatchback and sportster.
- The Brute (KayKit Large) was not tested; it will not fit these cars.

### FrizzleBob's ears in a closed car

Ear poses swept (root-heavy per FB-EARS-FLOPPY-01 r2): pitch back 0 … 75°, outward 0 … 60°.

- Clear of the roof only at **back 75° + out 45–60°** (sedan ×1.6, hatchback ×1.8, transporter ×1.3).
- With the ears folded like that, 126–172 more ear triangles touch the back of the head than at rest. The ears lie against the head and slightly into it.
- In the ToolBox this is an acted "car ears" pose (base rotation back / out, dangle physics stiff). **Georg's call:**
  - (a) accept the slight press into the head;
  - (b) the cabrio as FrizzleBob's car, ears free;
  - (c) a sunroof gag.

### Enter / exit / drive

Clip data in rig units:

| Clip | Hips height (start / end) |
|---|---|
| `entering_car` | 0.389 / 0.361 |
| `driving` | 0.208 |
| `exiting_car` | 0.361 / 0.389 |

- **Entering does not end in the driving pose,** and exiting does not start in it. The hips sit 0.15 units lower in driving.
- A settle blend of about 0.4 s is needed on both sides, plus root alignment of the clip end to the seat and door.
- Entering travels about 1.3 m sideways.
- The door and seat alignment is its own slice (see §7). The door width against the characters has not been measured yet.

## 4 · Doors, hood, trunk (`HINGES.json`, `renders/cars_doors_open.png`)

Every part rotates about an axis through its own node pivot:
- **side doors:** vertical axis;
- **hood / trunk:** lateral axis.

Axes in world terms: Blender Z-up = three.js Y-up, with the same rotation sign; the lateral axis is X in both.

| Car | Part | Axis | Open sign | Open angle |
|---|---|---|---|---|
| all | left doors (`DoorL`, `DoorFL`, `DoorRL`) | up | −1 | 65° |
| all | right doors (`DoorR`, `DoorFR`, `DoorRR`) | up | +1 | 65° |
| transporter | rear doors `DoorBackL` / `DoorBackR` | up | −1 / +1 | 100° |
| sedan, hatchback, cabrio, pickup | `Hood` (hinge at the windscreen) | side | +1 | 50° |
| estate, sportster | `Hood` (hinge at the front) | side | −1 | 50° |
| sedan, hatchback, estate | `Trunk` / tailgate | side | −1 | 50° |
| **transporter** | **front `DoorL` / `DoorR`, `Hood`** | — | — | **pivot not on the hinge (the cab doors swing about a point about 1 m away; the hood hardly moves): fix the pivots in Blender first** |

The truck has no hood part. The soft-top roof (cabrio, sportster) is a separate small armature and was not evaluated here.

## 5 · Materials in the KFB GLBs

Every mesh gets exactly one of 7 materials, by part name (`export_report.json`):

| Material | Parts |
|---|---|
| `kfb_body` | body colour (placeholder, one per car) |
| `kfb_glass_tinted` | windows, glass, mirror glass; alpha 0.4, blend |
| `kfb_interior` | seats, dash, pedals, steering wheel, engine bay |
| `kfb_tyre` | wheels |
| `kfb_chrome` | bumpers, grille, handles, wipers, mirror cases |
| `kfb_lamp_front` / `kfb_lamp_rear` | lamps |

- Recolouring a car = one material change.
- Clay look (K2) can be applied on top of these materials later.

## 6 · Files

| File | What |
|---|---|
| `glb/KFB_CVP1_<car>.glb` (9) | converted and cleaned: stray C4D icosphere in the cabrio removed, KFB part materials, scale 1 as authored (apply the KFB scale at placement) |
| `glb/COPYING.txt`, `glb/ReadMe_Divinux.txt` | the pack's CC0 licence and original readme |
| `FIT.json` | seat fit per car and character (every scale step, intersections per part, clearances) |
| `HINGES.json` | per part: axis, open sign, pivot, travel |
| `renders/cars_seated_threequarter.png` | all 8 cars at their KFB scale: Raider driving, FrizzleBob as passenger (ears folded; cabrio ears up; the pickup has one seat) |
| `renders/cars_seated_cutaway.png` | the same from the left, near doors and glass hidden |
| `renders/cars_doors_open.png` | doors, hood and trunk open, front ¾ and rear ¾ |
| `source/` | `fit.py`, `earfold.py`, `render_cars.py`, `export_cars.py`, `hinges2.py` |

GitHub (additive): `media/3D_Assets/Vehicles/KFB_CVP1/` (the 9 GLBs + licence + readme) and this folder.

## 7 · Next gates

1. **Georg:** per-model KFB scale or one global scale; the FrizzleBob ear solution for closed cars (a / b / c in §3); body colours.
2. **Blender MCP lane:** fix the transporter pivots. Then the enter → drive → exit alignment: door timing, root offset to the seat, the settle blend, and the door open / close keyed to the clip.
3. **WSA / Web Lead:** which runtime owns vehicles (Resident Atlas, WorldBuilder, Racer) and where the per-model scale is registered.
