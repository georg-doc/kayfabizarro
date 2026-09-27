# Reconciliation · old KFB Stunt Car Race work vs the new Track Core · 2026-09-27

**Why:** Georg (27.09) asked for a check of the old KFB Stunt Car Race research and concept input. This covers the private repo `georg-doc/KFB-Stunt-Car-Race` (local clone, remote refs up to 26.09), its `_inbox`, and the kayfabizarro repo. The goal is that nothing gets lost and nothing gets built or designed twice.

**Method:** read-only census by three parallel readers:

- concept / planning;
- RKIT / geometry branches;
- runtime / environment.

Every claim below comes with a path. `C3/` = `KFB Cologne Race Option C-3/`, `HO/` = `_handover/RKIT_TRACK_KIT_2026-09-24/`. Branch paths are given as `branch:path`.

**Not verified:**

- Anything pushed after 26.09 (the clone cannot fetch).
- `KFB_TRACK_ENVIRONMENT_GRAMMAR_2026-09-19.md`, read only by the concept reader.
- RKIT-10 / PR #216 details.

## 1. Conflicts to decide (canon questions)

| # | Topic | Old line (evidence) | Track Core now | Proposal |
|---|---|---|---|---|
| C1 | **Driving model** | Georg accepted the v0.8 **route-relative flow model** ("geil! fühlt sich top an"). It is not Rapier: maxForward 41, boost 48.5, rubber rails (`ChatGPT_web/track-lab/site/RACE_FEEL_V08_CONFIG.json`, `RACE_FLOW_RUNTIME_CONFIG.json`). The old `race/` is Rapier, marked "historical". PR #204 D1 names Rapier g 15 / 27 m/s as the design numbers and v0.8 as the later handling target. | `PHYS {g 15, vMax 27}` is used for jump design only. | **Decide.** The v0.8 flow model is route-relative, and the core stream *is* a route (frames, s, slots). It is the natural first consumer. Rapier numbers stay as the design check for jumps (D1), until the Rapier TRACK_A run exists. |
| C2 | **Width classes** | Ladder 10.8 / 14.4 / 18 / 21.6 accepted 19.09 (`KFB_TRACK_ENVIRONMENT_GRAMMAR_2026-09-19.md`, planning branch). D2: 28.8 only as a named special profile (`HO/RKIT_KIT_GUIDE.md` §4). | `HERO_XL 28.8` sits in the width table like a normal class; FORK uses it for the Weiche. | Keep 28.8 only as a named special profile (Weiche / stunt bowl). Mark it in the core. |
| C3 | **Stunt state model** | `free → capture → commit → release → recover`, every stunt with a bypass (`ChatGPT_web/track-lab/LIVING_MASTERPLAN.md` §3.5; `_inbox/KFB_P2_GUIDED_DRIVING_v0_1/stunt-zone.schema.json`, `assist-profile.json` off/chill/show; RKIT-08 stunt modules). | Per-section `drive {mode: free/assist/locked, fx}`. | **Map, don't replace.** Stunt zones become a zone layer on the stream with those five states. Drive mode stays the per-section control. Bypass becomes a check. |
| C4 | **Surface physics** | Presets GRIP, DRIFT, ICE, BLACK_ICE, OIL, BOOST, BOUNCE, MAGNETIC, LOW_GRAVITY, RUMBLE, with weather coupling (terrain-coupling addendum §7–8, planning branch). | fx bounce / magnet_catch / zero_g only. | Adopt the preset list as the stream's `surface` field. The fx become a subset of it. |
| C5 | **Skins vs bands** | Bands RACE / FREEWAY / ROAMING / INTERSTATE / GALACTIC / TUNNEL / BRIDGE. Colour authority TinySkies → KayKit → accent → semantic (`KFB_TRACK_COLOR_BANDS_ASSET_HANDOFF_2026-09-19.md`). | Skins street / track / mag / buoy / toy (placeholders). | Bands = context; skins = palette per band. Fold together in the S4 look pass. |
| C6 | **Road markings / toy grid** | KFB TOY GRID: route-space UV grid (u = width, v = s, 4.5 m / 18 m lines, `fwidth` AA), never an overlay mesh (grammar §5; `wsa/track-ribbon-st01`, Georg's acceptance open). | Marking bands carry a placement rule; consumers render them. | Compatible: the stream already gives u and v. The toy grid becomes a marking style. |
| C7 | **Tunnel architecture** | TARCH (PR #33): one road owner; ground below the whole banked body; inside edge lower; causeway plus dense arches (arch frame 0.96 m radius); half-shells with their own floor rejected (`tarch0:…/TARCH-0/review/R3d_TUNE_2026-09-23.md`). | Tubes are separate shells; the road deck stays the only road; the fill under the road is the tube, not a second floor. | Compatible by construction. Keep the TARCH rule explicit, and add "dense arches" as a tunnel skin option later. |
| C8 | **Loop clearance** | RKIT loops reach 2.5–2.7 m self-clearance, 0.78 m to the hangers on the Rhein-Run (`rkit-08-09:C3/rkit-08/scripts/stunt_lib.py`). | Self-clearance 2.5 m; vehicle envelope 4 + 3 m is applied to tunnels and crossings only. | Decide whether loops must also clear the full envelope (trucks through loops). |
| C9 | **Owner boundary** | D4: RKIT / core owns geometry; Race owns launch, flight, landing, recovery. D5: Race moves the flap collider. `race/CONTRACT.md`: physics is the only recovery owner (`HO/RKIT_KIT_GUIDE.md`). | Same intent; drive modes are metadata. | Binding. The first runtime consumer must not create a second contact owner. |

## 2. Already built in the old line — reuse, do not rebuild

| Need (MVP gap) | Existing work | Path |
|---|---|---|
| Driving feel | v0.8 flow runtime, accepted | `ChatGPT_web/track-lab/site/*V08*`, `RACE_FLOW_RUNTIME_CONFIG.json` |
| Laps, best lap, start / finish, checkpoints | Cologne C-3 lap counter and arch gates with checkpoint / start-finish roles | `C3/lab-v9/cologne-play.v1.js`, `cologne-gates.v1.js` |
| Recovery / respawn | Safe checkpoint: stored only after 0.5 s with 4 wheels on road; stuck detector at 1.5 s; reset pose checked against colliders | `race/src/physics.js`, `race/CONTRACT.md` |
| Recovery acceptance numbers | Six trap states freed within 2.5–2.93 s; parking 30 s ≠ rescue; card idempotency | `MASTERPLAN.md` I1 result, §12 |
| Camera | `railClamp()` keeps the camera target on the route corridor. Lesson: fix the camera on the route, not by pulling back after hits | `C3/lab-v9/cologne-play.v1.js`, `C3/docs/POSTMORTEM_2026-09-22.md` |
| Tyre trails | `createTrails()`, distance-sampled, ~55 m per anchor | `C3/lab-v9/cologne-drive.v1.js` |
| Billboards with card art | `buildBillboardFamily()`, 8 Kenney bodies with KFB card art (`renderCardQuarter`); registry / PDF must be cached | `C3/lab-v9/cologne-props.v1.js` |
| Vehicle deformer | WS1-v2 visual-only deformer in BOX1 and osm-city-drive c1 | `vehicle-cartoon-deformer.v2.js` (kayfabizarro), `track-environment-lab/box-stop/` |
| HUD, countdown | HUD theme contract `kfb.racer-hud-theme/1`, 2D / 3D countdown; HUD v4 brief | `C3/lab-v9/hud-theme.v1.js`, `cologne-countdown3d.v1.js`, `origin/design/hud-v4-*` |
| Audio | Three layers (engine, jukebox, SFX); `kfb.vehicle-sound-facts.v0`; A1 source still not transferred | `C3/lab-v9/cologne-audio.v1.js`, `_handover/AUDIO_A1_SOURCE_TRANSFER_2026-09-18.md` |
| Race runtime contract | Input `{throttle, steer, brake, drift, hop}`, fact events (`ramp-contact`, `landing`, `stunt-complete`, `recovery` …), single progress writer, `dispose()` | `race/CONTRACT.md` |
| Recipe validation | A0 adapter (`validateA0TrackRecipe`); W9 validator, 13 checks (reachability, bypass coverage, safety corridor …); W8 port rules; P1.1 measurement truth (connect only through named ports; width ≠ surface) | `ChatGPT_web/track-lab/site/race-track-adapter.mjs`, `_inbox/KFB_W8…`, `KFB_W9…`, `KFB_P1_1…` |
| Environment placement | ENV1 placement rules: deterministic seed, corridor clearance, `protectRoad`, near / mid / far / sky layers | `track-environment-lab/placement-rules.mjs` |
| Building passages | Buildings over the track kept on piers above 11 m clearance | Cologne C (see postmortem / changelog) |

## 3. RKIT geometry the Track Core lacks — port as recipes, fixtures or pieces

| Item | What | Path |
|---|---|---|
| **TRACK_A_STUNT_8** | Figure-eight recipe, 1,285.8 m, crossing clearance 5.79 m, 17 pillars, shortcut lap 595.6 m. Golden numbers for a core acceptance fixture. | `rkit-05:C3/rkit-05/track_a_stunt_8.recipe.json`, `rkit-06:C3/rkit-06/track_a_checks.json` |
| **Rapier TRACK_A test brief** | A1–A10 / T1–T7, **never run** | `rkit-06:HO/RACE_BRIEF_TRACK_A_RAPIER_TEST.md`, `C3/rkit-05/RACE_BRIEF_ADDENDUM_RKIT05_FLAP_RETURN.md` |
| **Pit lane** | Offset lane, 3–4 bays, entry / exit angles, anchors `PIT_ENTRY` / `PIT_EXIT`. BOX1 is triggered by a real pit approach (settle → button, no teleport). | `rkit-06:C3/rkit-06/scripts/rkit4_lib.py`, `_handover/BOX_STOP_RADIO_FACILITY_DECISIONS_2026-09-18.md`, `_handover/RACE_NEXT_SLICES_2026-09-18.md` R1 / R2 |
| **Flap return** | Moving flap (hinge +X, 0…−16°, the deck child is the collider, rule in glTF extras); 22.7 m dive → TUNNEL_60 → side merge | `rkit-05`, `rkit-03:C3/rkit-03/glb/flap_down_v2_thin.glb` |
| **Supports / pillars v2** | Footing 6.2 m, shaft 2.9 → 1.55 m, capital disc, bearing plate following bank and grade; styles classic / trunk / vine / rope; no footing on a lower deck | `rkit-03:C3/rkit-03/scripts/rkit3_lib.py` |
| **Ground coupling** | Embankment skirt; terrain-yield rule (26 m cut / fill slope, ≥ 2 m under a soffit, fill over a tunnel roof + 1 m); terrain modes EMBEDDED / CUT_FILL / CLIFF / BRIDGE / TUNNEL / FREE_SPAN | `rkit_lib.build_skirt`, `rkit-07:C3/rkit-gc01/scripts/canyon_lib.py`, terrain addendum |
| **City street profile** | Kerb 0.15 m, sidewalk 2.5 m, slab 0.6 m | RKIT-03 / RKIT-06 (Trankgasse), `rkit-06:C3/rkit-06/trankgasse.*.json` |
| **Switch lessons** | Sections perpendicular to the main line, fixed barrier size, crash-cushion nose, `trim_to_seam`, the flatter 12° lay Georg approved | `rkit-07:C3/rkit-07/scripts/rkit4_lib.py`, `rkit-06:HO/CHANGELOG.md` |
| **Transition v2 timings** | Staggered over 26 m (funnel, barriers, lines, magnet stripes last) | `rkit-11:C3/rkit-11/scripts/transition_lib.py` |
| **Stunt modules** | LOOP_REAL, SLIM, MAG_HERO, MAG_CASCADE, SKYRAMP-01 (`kfb.rkit.stunt-module.v0`, with bypass and zones); gate: **Race drives LOOP_REAL first** | `rkit-08-09:C3/rkit-08/*.stunt-module.json`, `C3/TRACK_SOCKET_STUNT_REGISTRATION_2026-09-25.json`, `RECOVERY.md` |
| **Extra checks** | Coplanar / duplicate-face seam check; swing test for moving parts; BVH self-intersection with a negative control; abort if neighbouring frames jump > 0.5 m in height | RKIT-03…07 test scripts |
| **GLB conventions** | y-up metres, role-named materials, UVs in metres, anchors as empties, 1 m bake steps (< 10 MB), Draco for stunt GLBs, re-import check | `HO/RKIT_KIT_GUIDE.md`, RKIT RETURNs |
| **Acceptance scenes** | Trankgasse (OSM, ODbL), GC-02 canyon rollercoaster, RKIT-11 Rhein-Run (frozen acceptance test) | `rkit-06`, `rkit-07:C3/rkit-gc02/gc02.baked-route.json`, `rkit-11:C3/rkit-11/*` |

## 4. Concepts the Track Core has not covered yet (must not get lost)

- **Edge / environment grammar:**
  - environment layers A–E with a deterministic EnvironmentRecipe;
  - Rule-of-Three trackside clusters (anchor, support, accent);
  - prop collision roles (non-blocking / breakable / glancing);
  - surface affordance slots (boost pad, recharge, rough shoulder, drift zone, pit entry / exit, stunt approach, landing zone).

  Sources: `_handover/WEBCHAT_TRACK_ENVIRONMENT_2026-09-18.md`, grammar §8. This **is** the spec for the planned edge layer: build from it; do not design a new one.
- **Rubber rail feel (v0.5):** soft inward field, one elastic rebound, then a refractory window; speed is kept. There are 8 contact test cases (`LIVING_MASTERPLAN.md` §3.4).
- **Mode handoffs:** Drive ↔ Walk, gifted NPC vehicles, Drive → Flight cliff gate (Cosmic Interstate / Grand Canyon addendum).
- **World graph and card seed:**
  - WorldNode / RibbonEdge;
  - Cadence Field;
  - `kfb.stunt-world.biome-seed/0.1`;
  - World Media Surface for cards and ad-busting triplets. This is the older home of the "They Live" billboards: link the S9 WSA billboard note to it.
- **Game invariants:**
  - "Choose the route. Ride the consequences."
  - a failure never costs won cards;
  - card idempotency;
  - 0 + 3 + 1 run arc;
  - Quest Die → POP (open).

  Source: `MASTERPLAN.md` §00–03, §12–15.
- **Ink World adapter:** OFF / INK / BEND / TORN, with the anti-shimmer rule (never seed from screen pixels or frame time). Relevant for the clay deformation rule (s-based noise) (`planning/track-environment-design-v02:…/KFB_INK_WORLD_OUTLINE_ADAPTER_2026-09-19.md`).
- **Elastic surface (P3 / W8):** a visual-only deform field over the hit tile and its neighbours; ports and colliders are untouched. Precedent for the S4B reactive clay layer (`_inbox/KFB_P3_STUNT_MODULES_v0_1/ELASTIC_SURFACE_NOTE.md`).
- **Research:**
  - WoW Undermine drive: drift regenerates turbo; turbo archetypes; collision anti-patterns (`_handover/WOW_UNDERMINE_DRIVE_RESEARCH_2026-09-19/RESEARCH.md`).
  - Rollercoaster v11: arc-length card placement (`_handover/WSA_REFERENCE_ROLLERCOASTER_V11.md`).
  - Frankenstein racing audit (`_handover/WSA_ANALYSE_RACING_FRANKENSTEIN.md`).
  - Claybound visual benchmark, 5 axes, 26.09 (`_handover/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_WSA_INPUT_2026-09-26.md`).
- **Lessons (postmortems):**
  - v0.9: switch ≠ bridge ≠ pit, never fused.
  - HUD Rig v1: "AI slop" — copy working templates; green tests are not design proof.
  - Cologne C: camera on the route; ray-cast the exact screenshot pixel; `updateMatrixWorld` before `Box3`.
  - Kenney gates scaled up are wrong.
  - Stop after two failed repairs.

## 5. Duplicate risk

| Area | Status |
|---|---|
| Continuous track solver, arbitrary 3D frames, loop | The core superseded track-lab T1 / T3 and the Kenney-keyframe descriptor. Keep the old lessons as checks. |
| Switch (SWITCH_Y vs FORK / JOIN) | Two designs. Keep the core's, and port the SWITCH_Y lessons as check cases (perpendicular sections, fixed barrier size, nose, flatter lay, seam trim). |
| Width funnel vs WIDTH_STEP | Same result. The core wins. |
| Tunnel (TUNNEL_60 / TARCH vs core tunnels) | The core supersedes TUNNEL_60. TARCH's grammar feedback (dense arches, 0.96 m radius) becomes a tunnel skin option. |
| Loop (RKIT stunt_lib vs core LOOP) | Two implementations. Decide the canonical clearance (C8). Port LOOP_REAL / MAG_CASCADE as core recipes so the "Race drives LOOP_REAL first" gate uses the core stream. |
| Billboards (S9 note vs MASTERPLAN ad-busting / Cologne billboard family) | Merge. The S9 note adds placement anchors; the content and body family already exist. |
| Edge layer (S4 brief catalogue vs environment grammar) | One spec. The grammar owns layers and roles; the S4 brief owns the look catalogue. |

## 6. Revised MVP order (proposal)

1. **Decide C1–C9.** C1 (driving model) and C8 (loop clearance) matter most.
2. **Race data in the stream:**
   - start / finish;
   - checkpoints;
   - respawn anchors (using the `race/` safe-checkpoint rule);
   - pit lane with `PIT_ENTRY` / `PIT_EXIT` (using RKIT pit lessons);
   - stunt zones with bypass (C3);
   - surface presets (C4).
3. **Drive on the core:**
   - the v0.8 flow runtime reads the core stream (C1);
   - Cologne gates / laps / `railClamp` / trails are reused;
   - fixtures: TRACK_A_STUNT_8 re-authored as a core recipe, plus FS01;
   - then run the never-run Rapier TRACK_A brief A1–A10 on the same stream.
4. **Edge layer from the environment grammar:**
   - kerb / sidewalk (RKIT city profile);
   - barrier variants;
   - gravel / sand runoff;
   - ditch;
   - affordance slots;
   - supports / pillars ported from RKIT-03;
   - ground coupling modes.
5. **After the S4 look choice** (Claybound benchmark): reactive clay (dents, tyre tracks via `createTrails`, elastic surface) and billboards on anchors.
