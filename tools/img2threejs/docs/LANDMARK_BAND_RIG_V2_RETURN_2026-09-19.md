# Landmark Semantic Band Rig v2 · RETURN · 2026-09-19

**Status:** IMPLEMENTATION + STATIC / NUMERICAL TESTED RESULT + CPU VISUAL TESTED RESULT · WEBGL / CONSUMER / GEORG ACCEPTANCE OPEN  
**Authoring owner:** `georg-doc/kayfabizarro/tools/img2threejs/`

## GOAL

Replace the rejected Pilot-04/v1.2 attachment scheme with a deformation structure in which clocks cannot detach from the visibly rendered clock-stage through mismatched deformation math.

## FAILURE ANALYSIS

Georg supplied screenshot evidence that v1.2 remained broken.

The previous QA proved the wrong invariant: clock geometry stayed rigid relative to its abstract socket. It did not prove that the socket stayed on the rendered host face.

Re-evaluation of the current v1.2 source against the actual transformed `clock-stage` triangles reproduced the bug:

| face | v1.2 socket → rendered host distance |
| --- | ---: |
| front | 2.162 m |
| right | 3.784 m |
| back | 2.436 m |
| left | 3.457 m |

Cause: the socket was sampled from a continuous deformation field while the visible host is a coarse box transformed through its discrete vertices / grotesque stack behaviour. Those are different geometric representations.

## NEW CONCEPT

**Semantic Affine Band Rig v2.**

The landmark is split into four assemblies:

```text
lower   0 → 30.2 m
clock   30.2 → 46.475 m
belfry  46.475 → 53.6 m
tent    53.6 → 71 m
```

Part ownership:

- `clock-stage`, `clock-stage-bottom/top`, every `clock-*`, lower hip roof, gables and pinnacles → **clock**
- belfry parts → **belfry**
- tent / ribs / star → **tent**
- remainder / walls → **lower**

Each band gets one fitted affine transform derived from the current City/Soft-Cubist field.

**Core invariant:** the visible `clock-stage` and all four clock assemblies receive the **same exact clock-band transform**. There is no second socket transform to drift away.

The lower band keeps its X/Z basis horizontal while its Y basis carries lean/bend. This preserves the authored terrain plane at exactly Y=0.

## IMPLEMENTATION

Current source:

- `landmarks/pilot-05/band-rig.mjs`
- `landmarks/pilot-05/band-three.mjs`
- `landmarks/pilot-05/band-reactor.mjs`
- `landmarks/pilot-05/viewer.mjs`
- `landmarks/pilot-05/index.html`
- `tests/check_landmark_band_rig_v2.mjs`

Viewer features:

- Band Rig v2 vs Legacy point deform A/B
- Base / City Grotesque / Soft Cubist
- normal City palettes + diagnostic Semantic Band colours
- band-joint helpers
- Idle / synthetic Disco / Impact presentation preview
- host-standoff diagnostics
- GLB export

The Three.js authoring view retains actual scene groups per semantic band with band-local pivots. This is preparation for future controlled presentation reactions, not a new gameplay/physics runtime.

## TESTED RESULT

**159 / 159 current-source checks PASS.**

Spasskaya:
- triangles: **3,496**
- base / grotesque / soft min Y: **0**
- source clock-stage standoff: **0.080 m**
- City Grotesque standoff: ~**0.071586 m** on all four faces
- City Grotesque max mount error: **2.13e-15 m**
- Soft Cubist standoff: ~**0.084910 m**
- Soft Cubist max mount error: **1.31e-15 m**

Kremlin wall study:
- triangles: **5,008**
- min Y: **0**
- City Grotesque max mount error: **2.07e-15 m**
- Soft Cubist max mount error: **2.16e-15 m**

The test intentionally reproduces the old v1.2 host miss before validating v2.

Evidence:
- [summary.json](../evidence/2026-09-19-landmark-band-rig-v2/summary.json)
- [Visual Evidence](../evidence/2026-09-19-landmark-band-rig-v2/VISUAL_EVIDENCE.md)

## SCREENSHOT / VISUAL EVIDENCE

A CPU z-buffer/triangle renderer was fed the exact generated production vertices.

GitHub contains a same-source / same-camera before-after:

[before-after.jpg](../evidence/2026-09-19-landmark-band-rig-v2/before-after.jpg)

Additional front / right / oblique views from the exact current v2 vertices were rendered and inspected in-session. The front and side clock faces remain on the transformed host.

This is real geometry-render evidence, but it is not mislabeled as a browser/WebGL screenshot.

## BROWSER LIMIT

A Chromium/WebGL screenshot probe was attempted in the agent environment. EGL/ANGLE initialization failed before a valid WebGL frame could be produced.

Therefore:

- static/numerical PASS: **yes**
- CPU visual PASS: **yes**
- new agent-side browser/WebGL PASS: **open**
- public deployment: **not claimed**
- Georg visual acceptance: **open**

## PROTECTED BOUNDARIES

Unchanged:
- City S2 collision/export geometry
- OSM geography / landmark manifest
- Registry asset identity
- Travel movement / terrain contact / persistence
- Race driving / contact / physics / camera / gameplay
- Audio runtime

Living-toy pulse / Impact and `bumperProfile` remain presentation/proposal seams only.

## PUBLIC DEPLOYMENT

None claimed. Pilot 05 is currently source / downloadable-review work, not a promoted Stage route.

## EXACTLY ONE OPEN HUMAN REVIEW QUESTION

**Now that the attachment seam is removed, should the landmark baseline use City Grotesque or Soft Cubist deformation intensity?**
