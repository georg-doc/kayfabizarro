# Brief · Track kit look in the clay world (Knetwelt) · S4 · 2026-09-27

**From:** Claude Coworker (Track Core line). **To:** Claude Design, project "KFB Animation Lab" (the Knetwelt / claymation line).
**Decides the look:** Georg. **Runs in parallel with:** TD04 (balcony climb + closed circuit), built by the Coworker. Nothing here waits on it.

## 1 · What we want from you

Give the KFB track kit a look that belongs in the clay world of **H0 Hirnwelt**. Georg picked H0 as the style anchor on 27.09.

The kit already exists as geometry: pieces, seams, profiles, skins and markings, computed by one JavaScript core. What it lacks is a look.

We want a **concept, not a paint-over**. Treat this as a sparring brief:

- Improve on what we did.
- Bring your own ideas.
- Red-team the parts of the kit that fight the clay look.

Where you find that the geometry itself is in the way (for example razor-thin barrier caps), say so. Propose the change as numbers the core can take (see §5).

## 2 · Style anchor (read first)

**H0 Hirnwelt package** (on GitHub, `main`):
`tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27

- `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, sections 1–5 and 7. These are the three layers: pre-pass `clay-soften.v1.js`, material `clay-material.v4.js` + `clay-relief.v2.js`, and the light table.
- H0's own road profile (How-to §7.7) has bulged kerbs, a `#5d6f86` road and `#e2d0bc` kerbs and centre line. It is the closest existing clay road.
- `ref/h0/01-h0.png` and `ref/h0/04-h0.png` in this ZIP are copies of H0's evidence frames.

**Rules carried over from H0** (Georg's decisions, do not reopen):

- Models are **not** re-modelled. The look comes from the pre-pass plus the clay material.
- The sun is warm white. Saturated light re-colours clay (for example yellow × petrol reads as green).
- Sky is Claybound `#96bede`, flat.
- Sphere-in-sphere is the pattern for clouds and trees.

## 3 · What the kit is (facts, from the core)

**One core, one stream.** `track-core.mjs` v0.3 compiles a route recipe into a **stream**, a sample every 0.5 m:

- **Frame per sample:**
  - `p` position;
  - `T` forward, `U` up and `R` right, with R = T×U;
  - right-handed, +Y up, heading 0 = +Z. This is three.js's own frame.
- **14-slot cross-section** (`slots`, lateral/lift pairs in metres, driver's view):
  - `under_L`
  - `barrier_out_bot_L`, `barrier_out_top_L`, `barrier_in_top_L`, `barrier_in_bot_L`
  - `shoulder_L`
  - `road_L`, `road_R`
  - `shoulder_R`
  - `barrier_in_bot_R`, `barrier_in_top_R`, `barrier_out_top_R`, `barrier_out_bot_R`
  - `under_R`

  The face between two slots has a **role**:
  - `road`
  - `shoulder`
  - `barrier_side`
  - `barrier_cap`
  - `underside`
- **Skin per sample** (`skin`: `street` | `track` | `mag`) and **`paint`**, one colour per role. Where the skin changes, the core blends the colours:
  - over 32 m, centred on the joint;
  - **staggered per role**: cap first, then side, underside and shoulder, road last.

  So there is never a hard colour edge. This is Georg's rule; see `shots/b13_profiles_and_skins.png`.
- **Markings** (`markings`, bands with `s0`..`s1`):
  - `edges`: edge lines at the road edge minus an inset;
  - `centre`: dashed centre line;
  - `bars`: magnet stripes. The first and last 5 bars of every magnet run taper from 8 % to 70 % of the lane, so the run reads as an **arrow tip** in the driving direction (Georg).
- **Widths:** STANDARD 14.4 m, WIDE 18 m (drift), HERO 21.6 m (split into 10.8 | 10.8).
- **Topology breaks** (`brk`) at split and merge, and **no surface** over air (jumps). Every run end gets a cap.
- **Pieces:**
  - STRAIGHT, CURVE_EASE (clothoid), HAIRPIN_180, SPIRAL (car-park helix), LOOP;
  - WIDTH_STEP, OFFSET_S, SPLIT_HALF / MERGE_HALF, CONNECT;
  - CREST / DIP, KICKER → AIR → LANDING.

Contract and schema: `kit/README_TRACK-CORE.md` and the S3 RETURN. Core source: GitHub `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S3_2026-09-27/track-core/`.

## 4 · What is in this ZIP

| Path | What |
|---|---|
| `shots/b01…b12` | Blender renders of TD03 (Tokyo Drift at the Uni-Center) and the split/merge seed. Flat preview colours come from the stream `paint`. |
| `shots/b13_profiles_and_skins.png` | The five real cross-sections, the three placeholder skins, and the seam-blend stagger curves. |
| `shots/b14_three_loader_check.png` | The TD03 stream drawn in three.js by `kit/stream-to-three.mjs` (headless Chromium, SwiftShader). |
| `data/td03.stream.json` | TD03, 1,570 m, 3,125 samples, all 13 core checks green. |
| `data/split_merge_seed.graph.stream.json` | HERO road that splits into two lanes. One lane climbs a 10 m magnet lift with a crest, then merges back. |
| `kit/stream-to-three.mjs` | Reference loader, stream → three.js meshes with vertex colours (tested, see `kit/check/`). |
| `kit/check/` | The pixel check: `index.html` + `shot.mjs` (Playwright). |
| `ref/h0/` | Two H0 evidence frames, for comparison. |

**Shot list:**

| Shot | Shows | Seam or piece to design |
|---|---|---|
| b01 | TD03 overview with Uni-Center scenery | whole-route rhythm: street, car park, roof, loop, plaza, jump |
| b02 | helix top → roof straight | skin seam **street → track** |
| b03 | magnet run-in before the loop | seam **track → mag** plus the **arrow-tip bars** |
| b04 | 26 m roof loop, side | loop profile (slimmed barriers), underside visible |
| b05 | loop entry, driver's eye | readability at speed: road vs shoulder vs barrier vs bars |
| b06 | drift ring widening to WIDE 18 | width step inside a curve |
| b07 | street into the car park | WIDTH_STEP to slim parapets, crossing under the roof deck |
| b08 | three-floor helix in the atrium | repetition: floors, parapets, stacked undersides |
| b09 | kicker → air → landing | **open ends**: lip cap, landing cap |
| b10 | plaza hairpin at WIDE 18 | tight turn, inner edge |
| b11 | split start on the HERO road | **gore**: two inner edges meet, then a barrier rises from flush |
| b11b | branch lift with magnet run | crest on a split lane |
| b12 | barrier close-up (drift ring) | barrier side / cap / shoulder at driver height |

## 5 · Conditions (each one checkable)

1. **The geometry comes from the stream.** Your look reads `slots`, roles, `skin`, `paint` and `markings`; it does not re-solve the track.
   - A proposed geometry change is stated as profile numbers the core already has:
     - `shoulderW`, `shoulderDrop`, `barrierGap`, `barrierT`, `barrierH`, `barrierOuterTop`, `deckDepth`;
     - per-side scale `sideL/sideR`;
     - or as a named new slot with its lateral/lift values.
   - Check: the TD03 stream renders with your look and the centre line matches `p` to 1 cm.
2. **Roles stay the unit of style.** Keep the five face roles and three marking kinds, or name each addition and the face or band it covers.
   - Check: every face of b12's section has exactly one role in your mapping.
3. **Seams have no hard edge.** The staggered blend stays, but you may change its length and per-role zones.
   - Check: at b02 and b03, no role changes colour or material over less than 8 m.
4. **The magnet arrow stays an arrow** pointing in the driving direction.
   - Check: b03 and b05 frames read as a tip, not as a ladder.
5. **Readable at speed.** From the driver's eye at 25 m/s (b05 framing), road, shoulder, barrier and magnet bars must be told apart by value, not only by hue.
   - Check: a greyscale copy of your b05 still separates all four.
6. **Scale is stated.** H0 runs at figure ≈ 1.2 units; the track is in metres (a car is ≈ 4.5 m, a lane 14.4 m). State the relief `scale` per role for the race world and show it in one close frame (b12 framing).
7. **Same physics for all vehicles.** The look adds no collision geometry and moves no road surface. Kerb bulges go outside `road_L..road_R`.
8. **Georg decides the look.** Present **2–3 options** side by side, each with the same three cameras as H0: total, near, ride-along. Present no single "final".

## 6 · Deliverables

- **Skin set** `kfb.track-skins/0.1` (JSON):
  - per skin, per role: colour, clay `role` (`world` / `soft` / `knetbar`) and `scale`;
  - marking colours;
  - at least `street`, `track`, `mag`, plus any clay-native skin you propose.

  The core already takes `SKINS` in this shape (colour per role); the clay fields are new.
- **Connector and cap grammar:** how these look:
  - an open end (lip, landing, route start/end);
  - the split gore and merge tail;
  - a width step;
  - the loop's slimmed profile.

  One frame each, from the shots above.
- **2–3 look options,** with renders on `data/td03.stream.json` (total, near, ride) and one frame each of b03 and b11.
- **RETURN.md** with defects first. What did you not solve? What fights the look?

## 7 · Not yours (other owners)

- Track layout, piece solver and the checks: the Coworker (Track Core).
- Race physics, Option-C camera, OSM geography, World Light Rig: WSA.
- Eye and face rigs, Motion Library: their own owners.

## 8 · Open questions for Georg (ask them inside your options, with pictures)

1. Clay skins as **colour presets** (like now), or as **"clay types"** that carry colour, clay role and relief scale together?
2. **Kerb bulges** (H0 style) on the track too, or only on the street?
3. Should the **magnet run** be clay at all? It could be glossy `knetbar` or glowing strips, like a different material pressed in.
4. **Undersides and supports** under decks and loops: clay pillars in the sphere-in-sphere spirit, or none (cartoon physics: loops may stand free)?
