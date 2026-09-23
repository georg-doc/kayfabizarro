# KFB Racer MVP Stabilization · 2026-09-23

Status: **RSTAB-1 TECHNICAL PASS · ZERO-INSTALL HUMAN GEOMETRY GATE · PUBLIC VERIFY PENDING · NO RSTAB-2**  
Runtime owner: `georg-doc/KFB-Stunt-Car-Race`  
Visual authoring source: `KFB Cologne Race Option C-3/` pinned at Race `main@cc80f4a1c6c509db9668df79fd53b13cee093a9d`.  
Goal: **one actually playable full-lap Racer MVP before further visual/feature expansion.**

## Current checkpoint · RSTAB-1 · 2026-09-23


### Zero-install review route

Intended human review surface:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`

Build marker:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/BUILD.json`

Packaging is source-complete: kayfabizarro Draft PR #178, 20/20 `lab-v9` blob parity, Cloudflare source commit `77e4bd44aac0d0ce720c5b0149eedb3eef62ac36`.

Public verification is **UNKNOWN / PENDING** from this environment due `pages.dev` access/DNS failure. Do not call the route live until the public Build marker visibly reports Race source `8dd3cd15147fe403090e00495bb632bd1cf1a203`.

Local HTTP is developer fallback only, not the human acceptance surface.


Race Draft PR: **#32** · branch `chat/racer-rstab1-geometry-2026-09-23`, stacked on RSTAB-0 PR #31.

Exact runtime + bounded-CI candidate head:

`e9c72a404aff63d46762d9101a727a9e7f94a6b0`

RSTAB-1 packet:

`_handover/RACER_MVP_STABILIZATION_2026-09-23/RSTAB-1/` in the Race repository.

Technical result:

- WEDGE seam now follows the actual banked 14-facet tunnel shell, with independent left/right cut edges and one 10-point transition owner;
- PIER supports retain all 54 instances and now terminate at their actual local banked soffit;
- old support math reproduces penetrations 166 / 179 / 187; repaired math yields 0;
- GitHub Actions run 35807766171: **5/5 PASS · 0 FAIL**;
- route and v0.8 FLOW/FEEL remain unchanged;
- RSTAB-2 has not started.

**Exactly one current next gate: RSTAB-1 HUMAN GEOMETRY GATE — visible tunnel/ground-cut + support review. Only ACCEPT advances to RSTAB-2.**

### Preserved RSTAB-0 map

RSTAB-0 source/evidence remains under `RSTAB-0/`.

- CURVE remains deferred: peak index 176 / 29.4% / s≈589 m / radius ≈35.3 m vs ≈61.6 m v0.8 full-steer radius at 41 m/s.
- Tunnel sightline, grounding, audio and trails remain later acceptance gates.


## Why this exists

The current Racer is visually progressing, but Georg reports severe runtime/track defects that prevent a trustworthy playable MVP:

### P0 CORE_BLOCKERS

1. **Ground/terrain wedges intrude into the drivable track.**
   - likely world/ground/track geometry overlap;
   - must be identified by actual source mesh/object, not guessed from appearance.

2. **First hard bend (~45° visual turn) is jerky / driving becomes unstable and strongly pushes the vehicle into the barrier.**
   - may be route curvature, steering/traction/contact, interpolation or track-frame discontinuity;
   - do not tune steering globally before the exact transition is measured.

3. **Bridge/support pillars still intrude into the play corridor.**
   - Georg suspects bridge pillars are too long / not clipped to the intended support range;
   - source object and actual collision/visual extent must be measured.

These three issues alone are enough to reject the current Racer as a playable MVP.

### Existing RTECH issues to retain

4. recurring dark/brown tunnel sightline surface;
5. vehicle sometimes floats above / sinks into track;
6. engine/audio control wiring incomplete;
7. trail/speedline ribbons overlap/fold at some speed + curves/sway.

Do not lose these, but apply gate proportionality.

---

# 0 · Wait for the current Claude Design export

Do not repair the older Option-C source if a newer Claude Design Session Cut is about to become the current candidate.

When Georg uploads the export to GitHub:

1. identify exact repository/path/branch/commit;
2. record it in `SOURCE_LOCK.md`;
3. inspect the export's own changelog/source marker;
4. mount/rehome it **1:1**;
5. prove parity before technical repairs.

If the export is incomplete, do not silently fill gaps from an older source. Record missing files and ask only for the missing source.

---

# RSTAB-0 · Parity + Showstopper Map ONLY

**First fresh-chat gate. No repairs yet unless a one-line packaging mistake prevents the export from booting.**

Goal:

produce a deterministic map of the current full lap.

Create:

`RACER_SHOWSTOPPER_MATRIX.md`

For every issue record:

- ID;
- severity: `CORE_BLOCKER / ACCEPTANCE_BLOCKER / MINOR / DEFERRED`;
- route progress / segment / landmark;
- exact reproduction input;
- screenshot/video frame if available;
- visible symptom;
- collidable? yes/no/unknown;
- object/mesh identity if known;
- suspected owner;
- historical related fixes;
- one falsifiable next diagnostic;
- can it be quarantined for MVP? yes/no.

## Required lap audit

Drive/step the whole current route and mark at minimum:

- start;
- first hard bend;
- tunnel entry;
- tunnel interior;
- tunnel exit;
- bridges/overpasses;
- crest/dip;
- jump;
- finish.

Use existing route progress/segment telemetry where available.

Do not create new gameplay to make diagnostics easier.

## Required P0 entries

At minimum:

- `RSTAB-WEDGE-01`
- `RSTAB-CURVE-01`
- `RSTAB-PIER-01`

plus existing:
- `RSTAB-TUNNEL-01`
- `RSTAB-GROUND-01`
- `RSTAB-AUDIO-01`
- `RSTAB-TRAIL-01`

### Done when

We know exactly **where** the full lap becomes unplayable and which three defects are on the critical path.

Commit and STOP.

---

# RSTAB-1 · Track geometry intrusions

Start only after RSTAB-0.

Scope:

- ground/terrain wedges;
- bridge/support pillars;
- other static geometry actually intruding into the drivable corridor.

## Method

For every visible intrusion:

1. identify exact scene object / mesh;
2. run current corridor/route audit;
3. compare visual bounds and collision bounds separately;
4. determine owner:
   - track surface;
   - ground/world;
   - bridge/support structure;
   - OSM/landmark;
   - decoration.

Do not solve all intrusions with one giant hide-list.

### Ground wedges

Do not assume they are `ground-plate`.

Use screen pixel/raycast + scene hierarchy + bounds.

If the ground/world surface intersects the track because the road cutout/corridor is missing:
repair the **presentation/terrain seam**, not Race physics.

If the wedge is optional scenery:
quarantine it for MVP.

### Bridge pillars

Measure:
- source pillar geometry;
- world transform;
- intended support endpoints;
- actual track clearance;
- collision extent.

If a pillar visually extends through the drivable band, clip/scale/place it from actual support geometry.

Do not shorten every pillar globally because one span is wrong.

### Acceptance

A full lap must have no unavoidable static visual/collision obstruction inside the intended driving envelope.

---

# RSTAB-2 · First hard curve / driving stability

Start after geometry intrusions are no longer confusing the test.

This is a **CORE_BLOCKER**.

Goal:

the first hard bend must be drivable without an automatic wall hit under ordinary steering.

## Diagnose before tuning

At the bend record:

- route curvature;
- banking / local frame;
- track width;
- input steer;
- speed;
- yaw;
- yaw rate;
- lateral velocity;
- traction/drift state;
- contact normals;
- camera state;
- render interpolation vs physics pose.

Check for discontinuities in:
- route tangent;
- route normal;
- banking;
- collision surface;
- steering target;
- support frame.

Historical accepted baseline:
**Race v0.8 feel was human accepted.**

Compare the current curve behavior against that accepted driving donor before changing global handling.

Do not globally nerf steering/acceleration to make one broken bend survivable.

### Acceptance

Using ordinary non-drift controls, Georg can enter and exit the bend repeatedly without:
- steering snap;
- forced barrier contact;
- camera discontinuity causing loss of control;
- physics jitter.

---

# RSTAB-3 · Vehicle contact / grounding

Use the separate RTECH-01 evidence.

Replace/repair the current pitch/roll lift heuristic only if the new export still contains it and the issue reproduces.

Prefer measured support/wheel contact over coefficient tuning.

Acceptance:
vehicle does not visibly float/sink on flat, bend, tunnel, crest/dip and landing.

---

# RSTAB-4 · Remaining visual/runtime acceptance blockers

Only after the lap is mechanically playable:

- tunnel brown/dark sightline;
- trails/speedlines overlap/folding;
- engine/audio chain.

These are important, but they must not delay fixing RSTAB-WEDGE / CURVE / PIER.

Reuse:
`RACER_TECH_GATE_RTECH_01_2026-09-23.md`

Trail donor rule:
compare against Travel/TinySkies original before touching quaternion/orientation math.

---

# What is explicitly NOT part of stabilization

HOLD until full-lap MVP is playable:

- new vehicle roster;
- spaceships;
- new Donut/Orb propulsion profiles;
- roadside billboards;
- collage loops;
- further HUD redesign;
- new OSM style pass;
- new landmarks;
- WorldBuilder integration;
- new race modes.

Claude Design may finish/export its current visual work, but do not expand further until technical stabilization returns.

---

# Local-first workflow

Use the private Race repo already local on Georg's Mac.

No Work/WSA.

No Cloudflare debugging loop.

Web produces branch + tests + `LOCAL_PREVIEW.md`.

Georg tests localhost.

Repair loop:

`Web fix → GitHub → local pull/preview → Georg test → next bounded fix`

If Georg's local checkout becomes too messy, do not clean destructively inside this slice. Use a named clean worktree/temporary copy or a portable preview pack.

---

# Budget rules

Apply:

- `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
- Web-first execution;
- one gate per cycle.

For each defect:

- one focused diagnosis;
- one bounded repair;
- second repair only if the first made measurable progress.

If the issue can be safely quarantined without falsifying the full-lap MVP, quarantine it.

If Georg can clarify a visual/object ambiguity faster than another diagnostic, ask Georg.

No 15-turn single-object archaeology.

---

# Playable MVP acceptance

The technical stabilization target is deliberately simple:

Georg can:

1. start;
2. drive the whole route;
3. pass the first hard curve;
4. enter/exit the tunnel;
5. pass bridges/overpasses;
6. complete the lap;
7. do so without unavoidable geometry intrusion or severe physics jitter;
8. see the vehicle consistently seated on the track.

Then:

- trail/audio/tunnel-look may be acceptance polish if still open;
- HUD/Billboards may resume;
- new vehicles may resume.

---

# Return after every gate

Return only:

- repo;
- branch;
- exact head;
- current Claude export source lock;
- changed files;
- actual tests;
- local preview command/URL;
- showstopper matrix delta;
- unresolved blockers;
- exactly one next gate.

No public/Live promotion during stabilization unless Georg explicitly requests a milestone publish.
