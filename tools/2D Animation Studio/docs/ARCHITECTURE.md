# 2D Animation Studio · Architecture

## Thesis

Use a deterministic **cutout puppet** rather than generic bone/mesh skinning when source identity depends on exact graphic shapes and outline families.

Conceptual actor stack:

```text
ACTOR ROOT
├── shadow / ground response
├── rear appendages / legs
├── body
├── attached props / secondary motion
└── head
    ├── eyes
    │   └── pupils
    └── rigid identity accessories
```

## Motion layers

1. primary action — body/root/main readable action;
2. secondary action — head, appendages, attached pieces;
3. tertiary life — pupil lag, tiny settle, shadow response;
4. optional 2.5D depth — small layer parallax only when it preserves identity.

Default choreography from the KFB motion skill:

`cause → anticipation → action → impact → follow-through → recovery`.

No motion clip is complete without recovery.

## Ownership

Studio owns authoring, calibration and reusable module output. Consumer projects own gameplay/state semantics. The Studio must not create a second Travel/Combat/Race movement owner.

## Source geometry rule

Accepted source shapes are immutable reference geometry. Deformers operate on transforms / approved path deformation while preserving recognizability and intended outline behavior.
