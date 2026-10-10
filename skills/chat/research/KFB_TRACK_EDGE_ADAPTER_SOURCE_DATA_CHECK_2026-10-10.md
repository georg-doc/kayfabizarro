# KFB Street ↔ Race · source-data isolation check · 2026-10-10

Status: **SOURCE-DATA AUDIT COMPLETE / 3D SOURCE ISOLATION STILL OPEN**.
Mode: BOUNDED RESEARCH EVIDENCE, NOT NEW RUNTIME.
Owner: existing Track Core + Joyride. Repo `georg-doc/kayfabizarro` branch `research/kfb-track-core-transition-rail-2026-10-10`.
Current Island WorldBuilder R4 is STOPPED, F-R39 FAIL, NO MVP. No implementation there.

## 1. What was actually isolated here

Two already-existing **original authored data/code objects** were read from `main`:

1. **Joyride J14 T4** `lab-track/transition-profiles.v1.json`
   - Git blob `af6d52c9e3506ecc99d977c66faa8e7189e6f6e2`;
   - specifically `A_track_city` (zone `ZA`, s=1470–1570 m) and `C_city_track_deck` (`ZC`, s=560–650m).
   - original `A_track_city` 10 independent authored layer windows, `C_city_track_deck` seven.
2. **Track Core v0.12** `lab-track/core/track-core.v012.mjs`
   - Git blob `1bcf7ad3a384a57d7caf83488c436f4c4835346f`;
   - original exported `PROFILE_DEFAULTS`, `SLOTS`, `profileSlots()`, `SKIN_BLEND`, `WIDTH_TAPER`.
   - `STANDARD` width=14.4m, road half=7.2, shoulder outer=9.18, barrier inner=9.9, barrier outer=11.52, barrier top in=1.35/out=1.18, underside=-2.25 (default, straight local cross section).

The source-coded `transition-atlas.v1.js` was also inspected: `w(layer,s,side)` takes the layer window, applies sideLag and smoothstep, inverts for `to=track`. It computes non-track influence weights, NOT literal visibility/opacity. Exact source-aware 2D profiles are diagnostic evidence; **they do not demonstrate the original 3D Joyride geometry in isolation**.

### Permanent source-derived diagram

`evidence/KFB_T4_AUTHORED_WINDOWS_SOURCE_2026-10-10.svg`

This SVG is faithfully drawn from the source JSON windows and is labelled `DATA-ONLY`. It is not a substitute for a screenshot of the actual track donor. An additional internal local PNG and Track Core cross-section were generated in this Webchat, but they are not treated as source-render proofs.

## 2. Original authored A_track_city windows

| Layer | u start | u end | Role |
|---|---:|---:|---|
| barrier | 0.00 | 0.55 | non-track barrier mass influence |
| mark_track | 0.10 | 0.55 | track markings transition |
| road | 0.05 | 0.72 | driving surface look influence, NOT contact mesh rewrite |
| curb | 0.28 | 1.00 | clay curb stones |
| sidewalk | 0.40 | 1.00 | sidewalk/plates |
| mark_city | 0.45 | 0.82 | street markings |
| props | 0.55 | 1.00 | houses/street dressing after massing |
| light | 0.30 | 0.90 | look/mood |
| vfx | 0.35 | 0.75 | context VFX |
| pit | 0.15 | 0.88 | RESERVED, not built T4 |

Note: these are **authored weight spans**. A barrier-to-curb transition is not proved physically continuous by the window pair alone.

## 3. Measured source-data findings

- `A_track_city` zone spans 100m, `C_city_track_deck` 90m. `SKIN_BLEND.length=32m` describes a separate core colour role blend; do not silently assume it aligns with an authored T4 look transition. Align in the actual fixture by s and socket.
- `A_track_city` has `sideLag = 0.08`, shifting a layer's effective normalized window ±0.04 between sides. For the right side `u=1`, the source smoothstep weights remain short of exact final city state by **curb ≈ 0.008916**, **sidewalk ≈ 0.012741**, **props ≈ 0.022299**. The `g.reg` path outside the zone returns the settled side (city=1). This implies a **possible small parameter endpoint step** at the zone boundary, not a proved rendered defect. Note it for a real per-side continuity test.
- `A_track_city` barrier/road blend weights end before sidewalk/curb/props finish. This is already a genuinely staggered transition system at the data level.
- `C_city_track_deck` is a **specific elevated car-park exit**, NOT a ground-level reverse of `A_track_city`. It has seven windows, including no `sidewalk` window. Its source notes say the barrier remains because of drop-off safety. Do not generalize it as a generic ground-level city→race adapter.
- The intended safe opposite-direction street→race fixture is **NOT YET SOURCE-PROVEN**. An owner-specific data/profile extension would be additive after exact source isolation and collision validation, not an independent road geometry engine.
- The plotted Track Core section is the default `STANDARD` source frame (not the world-facing render). The real Track Core includes width/roll/side state and open-end handling; don't extrapolate the default static section to a banked loop, bridge or physical collider.

## 4. Data audit checks executed here

A local, source-value-transcribed **read-only** Python audit evaluated:
- all 17 authored windows across A and C stay ordered within [0,1];
- four authored zones are ordered and non-overlapping;
- per-side `smoothstep` influence stays in [0,1] and monotone for all 34 layer-side curves, sampled at 1,001 normalized positions (34,000 neighbouring-step checks);
- `C_city_track_deck` lacks a `sidewalk` window (source fact);
- default Track Core output has internally consistent declared slot positions for `STANDARD`.

**Test boundary:** This is numerical reconstruction from exact source values, **not execution of the complete original Core or T4 WebGL runtime**, which were not transferred to the local browser. The local chart is not a source-object screenshot and does not pass the visual source-isolation gate.

## 5. Minimal follow-up within current Track Core owner

Source-isolate the **actual original KFB Joyride J14 T4 road/edge rendering** as source, without new procedural props:

1. Exact T4 `ZA` source at original TD03 route, focus on normal `A_track_city` with stable same camera/scale.
2. Frame comparisons before/during/after lane transition: `barrier`, `curb`, `sidewalk`, `markings`; left/right, near camera, driver camera, acute curve.
3. Capture source geometry and collision separately: socket frame, road top, shoulder, guardrail/barrier solid, vehicle envelope.
4. Check sideLag endpoints (tiny potential step), mismatch between core `SKIN_BLEND` and T4 layer windows, barrier nose/curb endcaps, no free-floating slabs or accidental collisions.
5. Only if source and QA prove a missing ground reverse, propose `city→track on ground` as one additive data family within the **same T4 transition grammar**, not new stage or engine. Include explicit curb/sidewalk withdrawal, barrier arrival, marking/drive envelope precedence.
6. Later extend exactly this presentation-adapter method to Dungeon S13.2 wall seam using its OWN `seamKey` semantics, then Rail via Track Core route frames and a separate constrained on-rail actor.

No City/Island R4 runtime restart and no Stage/Live publication is authorised by this investigation.

## 6. Exact next gate and status

The named gate remains **`TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01`**, currently `PARTIAL: SOURCE DATA/CONTRACT AUDITED; ORIGINAL DONOR 3D RENDER NOT INSPECTED`.

Needed to close: actual original J14 3D donor visible in isolation, then one original-vs-additive adapter comparison with geometry, collision and clearance evidence. This current Webchat can prepare/check the source data and persist the brief but cannot claim that image-based donor acceptance from source code and plots alone.

Test counts: data checks above; original WebGL source-isolated screenshots **0**; live adapter commits **0**; Blender tests **0**; public Stage/site **0**.
