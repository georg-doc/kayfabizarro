# KFB Racer · Technical Stability Gate RTECH-01 · 2026-09-23

Status: **FRESH WEB · CORE/ACCEPTANCE BUGS ONLY · NO WORK · NO CLAUDE DEBUG LOOP**
Owner: existing Race runtime owner in `georg-doc/KFB-Stunt-Car-Race`.

## Goal

Restore a trustworthy drivable Racer baseline before adding vehicle-roster features or broader visual expansion.

This gate contains exactly four current runtime defects reported by Georg:

1. dark/brown surface appears in the early tunnel sightline;
2. vehicle sometimes floats above or sinks into track;
3. engine/audio controls are not reliably audible/wired;
4. trail/speedline ribbons overlap/fold during some speed + curve/sway combinations.

Do not add new gameplay.

---

# 1 · Tunnel brown/dark surface · ACCEPTANCE_BLOCKER

Important existing source truth:

`KFB Cologne Race Option C-2/docs/POSTMORTEM_2026-09-22.md`

Previous root cause was not collision. It was a sightline to the west Hohenzollern bridge pier.

The current source claims a geometric lateral relocation fix.

Georg reports the visual defect is still present in the current rebuilt Racer.

Therefore:

## Do not

- restart blind collision tuning;
- change tunnel collision tolerances;
- hide random geometry;
- assume the old diagnosis still matches the current visible object.

## Do

1. reproduce at the exact route position/camera;
2. run existing corridor audit;
3. if corridor is clear, raycast through the exact offending screen pixel;
4. report the actual mesh/object name;
5. fix that source object/placement or sightline once.

The gate is visual: the driver must no longer appear to drive into an opaque brown/dark surface.

One diagnostic pass. If the object differs from the historical bridge pier, record the new identity rather than forcing the old theory.

---

# 2 · Vehicle / track grounding · CORE DRIVING PRESENTATION

Current Option-C code contains a heuristic lift:

`0.04 + 2.08 * abs(pitch) + 1.08 * abs(roll)`

This was introduced to compensate for the current vehicle origin during pitch/roll.

Georg still sees:
- vehicle above the track;
- vehicle partly inside the track.

Do not keep tuning the coefficients blindly.

## Required direction

Use the existing Race/vehicle grounding evidence before inventing a new rule.

Prefer:

`route/support frame + measured vehicle contact/wheel anchors → one vehicle holder transform`

over:

`pitch/roll heuristic lift`.

Check existing Wheel Socket / Grounding donors in the Race project before changing runtime.

For every accepted vehicle profile, record:

- model root/pivot;
- measured lowest contact plane;
- wheel/contact anchors where available;
- ground clearance;
- final holder offset.

Test at:

- flat;
- banked curve;
- tunnel;
- crest/dip;
- jump landing.

No second movement/contact owner.

---

# 3 · Engine / audio wiring · CORE FEEL

Current source already contains:

`lab-v9/cologne-audio.v1.js → createEngineBed()`

with:

- real pinned engine files;
- start/stop;
- muted;
- level;
- speed-based playbackRate;
- throttle/speed volume.

Stage currently calls `engine.start()`, but browsers require a user gesture and Georg reports no engine audio.

## Diagnose the actual chain

`user gesture → AudioContext resume → media play → started=true → update() → gain/volume → audible output`

Do not rewrite the audio system.

Expose compact diagnostic state in dev/report only:

- selected engine file;
- media readyState;
- AudioContext state;
- started;
- muted;
- level;
- gain/element volume;
- playbackRate.

Check radio/music controls separately from engine bed.

One small fix per proven break.

---

# 4 · Trails / Speedlines overlap/folding · ACCEPTANCE_BLOCKER

Georg reports:

- at certain speeds and curves/sway the current trail/speedline ribbons overlap/fold;
- the original donor does **not** show this problem.

This is a donor-regression problem.

## Current Option-C implementation

`lab-v9/cologne-drive.v1.js → createTrails()`

Current custom method:

- stores long world-space history ribbons;
- stores a per-sample 2D right vector `nx/nz` derived from vehicle `yaw`;
- ignores full 3D vehicle orientation in those stored ribbon frames;
- widens with speed/drift;
- draws three long additive ribbons.

At strong yaw change/drift/banking, left/right ribbon edges can geometrically cross/fold or overlap.

This is a plausible mechanism, not yet the final diagnosis.

## Original donors to compare first

Travel/TinySkies donor:

`travel/wip/travel_globe_wsa/globe-v13/contrails.js`

Important difference:

- source-faithful trail width is computed from local trail tangent and camera vector using a 3D cross product;
- actual vehicle-local anchors are transformed through the full world matrix;
- the ribbon does not rely only on stored yaw-side vectors.

Separate TinySkies screen-overlay speedlines:

`travel/wip/travel_globe_wsa/globe-v13/speed-lines.js`

Do not confuse these two effects.

## Required RTECH-01 trail method

1. reproduce overlap with deterministic speed/curve/drift state;
2. show current Option-C trail frame;
3. show original donor under comparable motion;
4. identify the first mathematical divergence;
5. adapt the smallest source-faithful orientation/width mechanism.

Do not “try quaternions” blindly.

If full vehicle matrix/quaternion is needed, use it because the donor comparison proves it, not because it sounds plausible.

Keep movement owner unchanged.

No third trail system.

---

# Gate proportionality

Apply `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`.

These four issues are allowed in RTECH-01 because they materially affect the basic drivable presentation.

Everything else is deferred:

- billboard art;
- HUD styling;
- new vehicles;
- spaceships;
- Donut/Orb variants;
- landmark styling;
- Mage/Combat work.

---

# Local-first validation

No Work.

No Cloudflare debug loop.

Use the existing local Race repo already present on Georg's Mac.

Create/update:

`LOCAL_PREVIEW.md`

with one stable HTTP preview command.

Return:

- exact branch/head;
- narrow tests;
- local preview URL;
- deterministic reproduction positions for all four issues;
- before/after screenshots where useful;
- additive changelog/Return;
- exactly one next gate.

Only after Georg locally accepts RTECH-01 should a public Racer Stage milestone be considered.
