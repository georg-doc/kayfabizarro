# Phase C · Joyride-Rückgrat · Vorlagen (R1, 2026-10-11, nur gelesen)

Supplements `docs/BACKBONE_EDITOR_DONORS_R1.md` (10.10.). The Lab runs three 0.186.1; J15–J17 + deformer run 0.160.0, Organ-Inseln O1 v4 runs 0.184.0. Every 1:1 takeover gets an r160/r184 → r186 check.

## Entscheidungen (DECISIONS.md)
- **V-010 PASS:** J17 is the overall look (track, red barriers, orange road, cartoon deformer, camera, palettes). Test: image comparison against J17 `pictures/chase-*.jpg`.
- **V-053 RULE:** environment clay = canon 07.10. with near band.
- **V-095 RULE:** transition research = input; **first** a visual A/B in the original J14 renderer.
- **V-099:** island connection types = on/off ramp, tunnel with ramp exit onto the island floor, (later) Paternoster.
- **V-100:** 4+ tunnel styles from the Joyride slices, 1:1, selectable per tunnel.

## Joyride J16 r2 / J17
| Teil | Pfad | Stand |
|---|---|---|
| J16 r2 cut | `~/Dropbox/CLAUDE/KFB_JOYRIDE_J16_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2.zip` (110 files) | T1–T8 PASS, T10–T12 NOT_RUN |
| J17 (overlay on J16 r2) | `~/Dropbox/CLAUDE/KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/code/` | 1, 2, 6, 8 PASS; 3, 4 FAIL (FB cabrio, post-MVP) |
| Reference pictures | `…/JOYRIDE_J17_2026-10-01/pictures/` | chase-curve, chase-straight, chase-tunnel, face-tunnel, chase-loop-a/b |
| Stream p1b.v2 | zip `…_r2/lab-track/data/p1b.v2.stream.json.part01–06` (5 × 1.9 MB + 1.27 MB), joined sha256 `2eec6079…fb309` | schema `kfb.track-core.stream/0.3`, core **v0.12**, 4,392 m; a joined copy is nicht gefunden in ~/Dropbox/CLAUDE or ~/Developer |
| Print texture | `Fingerprints01_3K.png` (md5 26d5365a) | **already in the Lab** `public/assets/clay/` (absent from the r2 zip) |
| tc1 tube | `lab-track/tunnel-clay.tc1.js` (md5 1fc0a859, identical in J15 r1 / J16 r2 / VTR donors) | the Blender reference `blender/tc1-race-tube.v1.glb` + spec exists only in the r2 zip (reference, not runtime) |
| Look | `lab-track/track-look.v5.js` (md5 03d17908) + `core/stream-to-three.v5.mjs`, transition-atlas v1, road-markings m1/m2, crown-ao, prop-guard, lab-clay v10 | `WORLDS` canyon / bucht / otown (`track-look.v5.js:46`) |
| Drive camera | `lab-drive/joyride-drive.j10.js` l.235–343 (rail chase `FR.at(s−boom)`, camUp = road-up, FOV by speed / boost); values `joyride.j06.json` (boom 9, height 3.5, side 2.4, fov 58 …) | **not ported** (Lab = Seed-World spring arm) |
| Squash | k2b `squash` + `joyride-drive.j10.js:289` `holder.scale(1+.12sq, 1−.18sq, 1+.06sq)`; barrier wobble `lean-pass.l2.js` | Lab `drive.ts:90` uses .15/.25/.15, **not 1:1** |

**Colour finding:** V-010's sentence says „orange Fahrbahn“. J17 / v5 actually show a **slate-blue road** (`roadTrack #3d4a60`, `roadStreet #566680`) with an **orange-red clay strand / barriers** (`strang #ef5a22`, world canyon), visible in `chase-curve.jpg`.

## Track Core
- **0.16.1:** `~/Developer/rkit-r3/trackcore/track-core.mjs` (not a git repo), 116 tests green.
  - Stream schema unchanged, 0.3, plus `body.edge {L,R}`, `body.bandeSide`, TOWN_BAY / B7.
  - v5 knows only v0.12 streams, so **0.16 → v5 is untested** (Plan R1:24).
- **Research branch V-095:** georg-doc/kayfabizarro `research/kfb-track-core-transition-rail-2026-10-10` @ eb124448, `skills/chat/research/*`.
  - A = candidate (sideLag .06, 9 windows); B = extended kerb / barrier handoff (1 → 17 m over 100 m).
  - Numeric 16/16 each, gate PARTIAL; B is preferred only for a matched-camera 3D A/B against original T4.

## Organ-Inseln O1 v4 (Vorrang vor dem Cut 03.10.)
- **Entry:** `~/Dropbox/CLAUDE/KFB Organ-Inseln + race track v4+/V4/KFB Organ-Inseln O1 v4.dc.html` (three 0.184 from the unpkg CDN), module `lab-organ/organ-islands.v4.js`.
  - The core is `vendor-j15/lab-track/core/track-core.v012.mjs` + `stream-to-three.v5.mjs`.
  - KayKit GLBs come from raw GitHub @2ff8b350.
- **Track:** recipe `kfb.route-recipe/0.1-draft` (l.502) → `TC.compileRecipe` / `runChecks` → `buildTrack(…,{contact:true})` (l.511); kerb tube `buildStrang` (l.519–528).
  - Ring: docks + legs, SPIRAL / MAG / KICKER / LOOP (`drive:{mode:'locked'}`) / WIDTH_STEP HERO (l.438–464).
  - 10.54 km, checks green.
- **Tunnel:**
  - `tunnel_<id>` STRAIGHT `{preset:'gotthard'}`; span = ring tangent through the island SDF ±12 m (l.315–338).
  - Sphere chain `CUT_R 13 / CUT_UP 4` carved into the SDF (l.344–346, 543–547); portals = clay torus collar fused in with smin (l.347–354); the core tube mesh is hidden.
  - `schlucht_` = open cut.
  - v7: Mündung + 7 m wall jacket, CUT_R 15.
- **Connections:** dock D0/D1, `into()` = CONNECT to a run-up point 120 m before the dock + STREET (l.443–445).
  - **No exit ramp onto an island floor** (organs have no floor). Only the Hex hub has a floor.
- **Booster / driving aid:** data only (`drive:{mode:'assist',fx:['boost']}`, l.455; Niere `n_sturz_boost`, `zero_g`, `magnet_catch`, `n_katapult` l.485–491).
  - **No runtime reads fx.** The core has no grade check (1.2–1.5 measured, Sprint B open).
- **Cameras:** `tq` 3/4 · `spin` Drehen (autoRotate 0.7) · `dock` Portal · `top` Oben · `ride` Fahrt (42 m/s, −16 / +6.5, up = road-up), `shotFor` / `go` l.581–597, ride l.616–618.
- **Deformer:** not used in O1.
  - Workbench `KFB Cartoon Vehicle Deformer Lab(.v2/.v3)`, `lab-v7/vehicle-cartoon-deformer.v2.js` md5 4fd641cf (BROWSER TESTED, no Georg number).
  - It was never in J17 either.
- **Not to take over:** v4-FAILED.md / 16B-FAILED.md (Animation Lab UI / FrankenStein → remember for Phase H); POSTMORTEM_S1 = FAILED (road-scene v1–v3).
- **Cut 03.10.** (`KFB Organ-Attraktion C2/…`): same code state (v6 / v7 md5-identical); FAIL G1 / C1 / E1 (N1 template instead of the brief).

## Tunnel-Stile (V-100)
| Stil | Quelle | Wahl | Status |
|---|---|---|---|
| stone_arch „Stein-Bogen“ | `tunnel-clay.tc1.js:13` (gotthard arch 26.4×16.4) | `mountClayTunnels(T,{look})` / `__tc1.setLook(id)` (J15 `.dc.html:348`, J17 `.dc.html:262`) | PASS, clearance 1.09 m |
| stone_rect „Stein-Rechteck“ | `:15` | same | PASS, 0.41 m |
| race_tube „Race-Tube“ | `:17` (core `toy`, Ø24.93) | J16 / J17 default | PASS, Georg's pick |
| mine „Minen-Stollen“ | `:19` | same | PASS after fix |
| Organ clay cut + torus collar / Mündung | organ-islands v4 l.347–354, v7 l.472–485 | piece prefix `tunnel_` | READY_FOR_DECISION |
| Gorge / hillside road | `schlucht_` v4 l.545, `hang_` v7 l.1055 | piece prefix | READY_FOR_DECISION |

- TC1 has only ONE global `setLook`; per-tunnel selection is new.
- Per-look rings are in `p1b.export.json` `tunnelLooks`.
- J14 is gotthard only, no look layer.
