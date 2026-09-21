# KFB Travel Runtime Review v3

> Deep architectural review based on the uploaded KFB Travel v7 repository structure and runtime modules.

## Repository Snapshot

The review is based on the uploaded archive. Key runtime modules identified include:

- `export/travel-v7_2026-07-25/KFB Travel v7.dc.html`
- `export/travel-v7_2026-07-25/PROJEKT-KONTEXT.md`
- `export/travel-v7_2026-07-25/docs/BACKLOG.md`
- `export/travel-v7_2026-07-25/docs/BACKLOG_fractal-skydome.md`
- `export/travel-v7_2026-07-25/docs/CARD_VIEWER_HANDOVER_coworker.md`
- `export/travel-v7_2026-07-25/docs/CARD_VIEWER_POC_v1.md`
- `export/travel-v7_2026-07-25/docs/CARD_VIEWER_POC_v1_POSTMORTEM.md`
- `export/travel-v7_2026-07-25/docs/CARTOON_MOTION_BIBLE.md`
- `export/travel-v7_2026-07-25/docs/CARTOON_MOTION_KB_v1.md`
- `export/travel-v7_2026-07-25/docs/CHANGELOG.md`
- `export/travel-v7_2026-07-25/docs/CHANGELOG_rollercoaster.md`
- `export/travel-v7_2026-07-25/docs/CHANGELOG_travel.md`
- `export/travel-v7_2026-07-25/docs/CONCEPT_doccheck_learning.md`
- `export/travel-v7_2026-07-25/docs/DESIGN_CONCEPT_der_lebende_druckbogen.md`
- `export/travel-v7_2026-07-25/docs/DESIGN_CONCEPT_v7_sinnfeld.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_3D_DIORAMA.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_TABLE_v1.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_TABLE_v2.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_TABLE_v2_cowork_lead.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_claude-coworker.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_cowork_lead.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_design-chat.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_rollercoaster_v3.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_rollercoaster_v4.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_travel-v6.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_v3.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_v6_3D-card.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_v7_particles.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_v7_test-hooks.md`
- `export/travel-v7_2026-07-25/docs/HANDOVER_v8.md`
- `export/travel-v7_2026-07-25/docs/HOUSEKEEPING.md`
- `export/travel-v7_2026-07-25/docs/KFB_CONTEXT.md`
- `export/travel-v7_2026-07-25/docs/KFB_INK_OUTLINE_STYLE_v1.md`
- `export/travel-v7_2026-07-25/docs/KFB_MED_STYLE.md`
- `export/travel-v7_2026-07-25/docs/MOTION_LIBRARY_v1.md`
- `export/travel-v7_2026-07-25/docs/ONBOARDING_fresh_claude.md`
- `export/travel-v7_2026-07-25/docs/POSTMORTEM_v6_pet-board.md`
- `export/travel-v7_2026-07-25/docs/PROJECT_OVERVIEW_for_external_LLMs.md`
- `export/travel-v7_2026-07-25/docs/SFX_elevenlabs_prompts.md`
- `export/travel-v7_2026-07-25/docs/SPRINT_KICKOFF_selective-bloom.md`

## Executive Summary

The project has evolved beyond a proof of concept into a modular runtime. The architectural direction is strong:
- Clear separation between travel controllers and presentation.
- Runtime terminology is consistent.
- Movement, presentation and world context are already decomposed into dedicated modules.

The primary architectural risk is not algorithmic complexity but orchestration complexity as more systems are added.

---

# 1. Ownership Review

## Strong ownership

| Module | Owns | Should NOT own |
|---|---|---|
| Travel | lifecycle, mode switching | animation details |
| FlightController | movement model | camera |
| WalkController | ground locomotion | UI |
| CardCarrier | mount transform | gameplay rules |
| PetKinetics | secondary motion | movement decisions |
| WorldContext | environment queries | rendering |

This ownership split is one of the strongest aspects of the current architecture.

---

# 2. Runtime Pipeline

Recommended frame order

1. Input
2. WorldContext update
3. Travel controller
4. Vehicle state
5. PetKinetics
6. CardCarrier
7. FX
8. Camera
9. Render

Keep this order fixed and documented.

---

# 3. Coupling Analysis

Current coupling appears generally low.

Future risk:

TravelPoC / runtime bootstrap may become an orchestration hub.

Recommendation:

Introduce a TravelManager runtime that only wires systems together.

---

# 4. Flight Runtime

Positive observations

- Surface-relative movement
- Controller isolation
- Extensible architecture

Future improvements

- Explicit state machine
- Unified controller interface
- Event-driven transitions

---

# 5. Camera Runtime

Recommendation:

Camera should consume runtime state only.

Never inspect controller internals.

Preferred inputs:

- speed
- heading
- turnRate
- boost
- grounded
- altitude

---

# 6. Suggested Interfaces

```ts
interface ITravelController {
  enter(state)
  exit(state)
  update(dt,state)
}
```

```ts
interface IVehicle {
  update(dt)
  getPose()
}
```

---

# 7. Refactoring Priorities

## High

- Introduce TravelManager
- Define controller interface
- Centralize TravelState

## Medium

- Event bus
- Camera isolation
- Runtime diagnostics

## Low

- Debug overlays
- Telemetry
- Replay hooks

---

# 8. Claude Design Action List

1. Preserve module boundaries.
2. Avoid controller-to-controller dependencies.
3. Keep CardRig presentation-only.
4. Treat Camera as a consumer.
5. Do not move gameplay into visuals.

---

# 9. Cowork Review Checklist

- Contract compliance
- Runtime ownership
- Update order
- Allocation-free update loops
- Extensibility

---

# 10. Overall Assessment

Architecture: 9/10

Modularity: 9/10

Extensibility: 9/10

Maintainability: 8.5/10

Primary recommendation:

Protect the current separation of responsibilities while introducing a lightweight runtime manager before additional gameplay systems are added.
