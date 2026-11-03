# WS0 donor note · Roadster: Thrust Lab × KFB stunt physics R1

**2026-10-19 · DESIGN / READ-ONLY SOURCE AUDIT / PROPOSAL · NOT CANON · NOT IMPLEMENTED.**
**Owning inbox:** existing KFB_HUB Register / WS0 Game Design & Fractal Canvas conceptual lane; addendum to open **Draft PR #435** on `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19`.
**Future receiving runtime:** WS1/WS1b sole R3F game-world author under WS0 architecture V-228. Existing KFB Race vehicle/physics, Joyride presentation, Track Core geometry/contact, Travel flight and animation/Audio owners remain separate and authoritative in their own products. This note is *not* permission for a new physics engine, route owner or vehicle.

## 1. Source and provenance

- Donor demo (EXTERNAL ONLY, **not KFB Stage**): https://bkhan23544.github.io/roadster-thrust-lab/
- Donor source: https://github.com/bkhan23544/roadster-thrust-lab
- Reviewed donor `main@b90fec1499d61573e0cf1946fcfb949f3ecf5702`; `script.js` blob `0ae179664f6aacabab521d2daa6c7bb8aca7e486` and `README.md` blob `11b8ae49db800b5192e387cc54f87954bd03cd4f`.
- Script audit: `updatePhysics(h)` (~lines 1521–1710) implements custom force/torque vehicle movement, contact/suspension, grip, thrust, attitude control and landing-assist heuristics; `handleLanding` and scoring follow. Source-level reading **only**: no execution, browser freeplay, screenshot, perf or frame-by-frame physics validation here.
- Current public tree contains `README.md`, `index.html`, `script.js`, `styles.css`, `smoke.png`, `tesla_roadster.glb`; **no LICENSE file in reviewed tree**. README calling the repository "open source" does NOT establish legal permission to copy its JS, GLB, or graphics. Treat as conceptual/engineering reference unless a compatible license or author permission is confirmed.
- Additional Georg-submitted Reddit shortlink: https://www.reddit.com/r/threejs/s/PCUiHHvkXT · **UNRESOLVED**: redirect/post identity and its relationship to this donor could not be verified; store verbatim without asserting it is the same Roadster project. Other indexed Reddit Roadster posts may refer to a *different* project.

## 2. What KFB already has; avoid duplicate implementation

| Feature family | KFB source / current truth | Donor delta |
| --- | --- | --- |
| Driving, brakes, drift, vehicle feel | Race accepted historical v0.8 FLOW/FEEL; Joyride J14/J17 driving candidates; KFB Race remains its source project | Donor also drives/drifts; **not** an engine replacement |
| Ramps, transitions, loops, race tubes | Shared Track Core/RouteRecipe canon (`skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md`); Race RKIT-11 stunt candidate; Joyride J16/J17 Race-Tube | Reuse existing track geometry/contact; do not import a parallel tunnel/heightfield owner |
| Wall/2-wheel presentation | `tools/KFB-ToolBox/_inbox/KFB Vehicle Animation Lab v4/KFB_Vehicle_Lab_v4/lab-v7/vehicle-twowheel.v1.js`: source-measured pivot, hold and wall plane | A **scripted/presentation** wallride is **not equivalent** to contact-driven adhesion around a 360° tube |
| Jump/flight/landing | Race jump and Travel flight exist as separate owners; WS1 M1/M2 mobility is the productive integration lane | Full 3-axis vehicle attitude, thruster torque and *bounded* assisted touchdown not established as one proven integrated KFB feature |
| Feedback/stunt scoring | Existing Race/Audio/Game Feel donor families, no new HUD needed | Scoring/combo can be a later game-design consideration, **not** a reason to copy its neon HUD or Tesla identity |

**Preserve accepted visual direction:** WS0 `DECISIONS.md` V-010 designates Joyride J17 the gold-standard track/cartoon look (later specific road colors overridden by V-102). The donor's Tesla/Three.js neon presentation, model, UI and typography do not replace KFB clay/ink, FrizzleBob vehicle assets or existing audio owner.

## 3. Source-grounded promising seam ranking

**P1 · Conditional physical wall adhesion.** Donor applies grip/contact forces using contact normals, surface probes and a continuously interpolated `vehicleState.ad` (around `script.js:1553–1615`). Interesting for a *real* circular race tube rather than a merely posed two-wheel lean. KFB acceptance would require support normals, continuous contact, stable transition floor→wall→ceiling→floor, intentional grip release, deterministic respawn and no hidden secondary collision/terrain system. Verify geometry/Track Core support first; not a default world-gravity change.

**P2 · Assisted landing limited to airborne vehicle stunts.** Donor enters leveling based on altitude/vertical speed/orientation and applies torque + bottom-thruster braking only during the landing phase (around `script.js:1620–1668`). Candidate: player retains airborne tricks until the intervention window, can disable assist, and gets coherent touchdown **on the actual Track Core/Surface Truth support**. Do not let automobile AUTO grab ordinary Travel/CardCarrier low flight or erase intentionally free flight; fuel/safety/invalid surface must be testable.

**P3 · Directional thrusters / six-axis stunt control.** Donor's bottom/side/rear thrusters use applied force plus torque `r × F` and input controls for pitch/roll/yaw (around `script.js:1640–1689`). Optional vehicle capability; preserve KFB's sole movement/camera/input writers and existing Race jump. Do not treat nozzle VFX or audio as evidence that forces are implemented. Need fuel/reset and impact/contact stability checks.

**Other donor traits:** configurable AUTO/MANUAL, wheel/chassis offset contacts, suspension damping, impulse/landing telemetry, reset/checkpoints, procedural SFX. Useful as comparison fixtures, **not** established KFB gaps until current receiving-source inventory and playtest.

## 4. Proposed smallest later experiment (not authorized here)

**One existing KFB vehicle × one genuine Track Core/Joyride source-isolated stunt segment × existing camera/controls**, under the receiving owner and with a clear baseline A/B.

- Gate 0: WS0/owner verifies *current* WS1b M1/M2 and KFB Race physics, existing ramp/tube source, licenses and collision interfaces; show the actual KFB donor vehicle and track **in isolation** before adding anything.
- Gate 1: same segment, physics **baseline vs optional physical grip**; log body/contact normal, contact loss, bank/ceiling transition and release; count falls/resets, no duplicate owner.
- Gate 2 (only after Gate 1 useful): baseline vs voluntary landing-assist ON/OFF with airborne manual rotations; landing orientation, speed, penetration, track support and intervention timing, ensuring Travel flight never auto-lands.
- Gate 3 (optional): directional boost and finite fuel with stable camera, gameplay feedback and unchanged audio mix ownership.
- Keep the lesson *playable fun and controllable stunts*, not three parallel engineering workstreams. Any proposal to implement requires WS0 triage and a separately authorized, measurable receiving slice. This donor is **not a replacement for the already pending source-backed Fluff acquisition → meaningful Resident/Card response encounter** of PR #435.

## 5. Evidence, risks, routing

**Confirmed from source only:** donor repository tree; README and inspected JS; existing KFB WS0 V-228 / V-010 routing, Joyride J17 source RETURN and Track Core binding canon; existing KFB TwoWheel donor; Race RECOVERY/RKIT candidate. **Not confirmed:** donor gameplay feel, 360° wall ride stability, licensing permissions, current WS1b compatibility, new browser/CI tests, target GPU performance, any live deployed KFB feature or Reddit-post identity.

**No KFB implementation, Card/Fluff canon change, external code/asset copy, new AudioContext, UI skin, Site/Stage or Live promotion.**

**One next gate for the existing Game Design owner remains unchanged:** WS0 chooses one real-source, presently WS1b-feasible two-minute Fluff acquisition → meaningful Resident/Card response encounter. Keep Roadster as a **DEFERRED donor candidate** for the first separately authorized vehicle/stunt-physics intake after the existing WS0 priority is cleared.

### Source links
- https://github.com/bkhan23544/roadster-thrust-lab/blob/b90fec1499d61573e0cf1946fcfb949f3ecf5702/script.js
- https://github.com/bkhan23544/roadster-thrust-lab/blob/b90fec1499d61573e0cf1946fcfb949f3ecf5702/README.md
- https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md
- https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/33
- https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/42
- https://github.com/georg-doc/kayfabizarro/pull/435
