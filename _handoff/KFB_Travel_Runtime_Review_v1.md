# KFB Travel Runtime Review v1

## Executive Summary

Overall assessment: **very strong architectural direction**. The project
has evolved beyond a prototype into a modular runtime with clear
ownership boundaries. The strongest aspect is the separation between
movement, presentation and pet behaviour. The main risk is that
orchestration logic is becoming concentrated in `travel-poc.js`.

## Key strengths

-   Clear module ownership documented in headers.
-   Flight controller is independent of rendering, pet and camera.
-   Ground controller mirrors flight architecture.
-   CardRig is treated as visual vehicle embodiment.
-   Pet kinetics are layered on top of PetMotion instead of replacing
    it.
-   Extensive documentation and contracts throughout the codebase.

## Travel Runtime

### Positive

-   Runtime split into focused modules.
-   Naming is consistent.
-   Contracts are treated as first-class documentation.
-   Architecture is easy to extend with future vehicles.

### Risks

-   `travel-poc.js` (\~62 KB) is becoming the integration hub and risks
    becoming a God Object.
-   Rendering, orchestration, feature toggles and bootstrapping should
    gradually move into dedicated runtime modules.

### Recommendation

Introduce a `TravelManager` responsible only for lifecycle, update order
and dependency wiring.

------------------------------------------------------------------------

## Flight Runtime

Excellent separation.

`flight-controller.js` owns movement only.

It exposes state instead of manipulating camera or visuals.

This closely matches the intended KFB runtime architecture.

Recommendation:

-   keep quaternion/orientation logic isolated
-   expose immutable runtime state
-   avoid feature-specific branches

------------------------------------------------------------------------

## Ground Runtime

Architecture mirrors Flight.

This symmetry is valuable.

Recommendation:

Create a common Controller interface

-   update(dt,input,world)
-   state()
-   reset()

allowing TravelManager to swap controllers.

------------------------------------------------------------------------

## Camera

Current architecture already points toward camera independence.

Recommendation:

Move all follow, lag, FOV, look-ahead and shake into a dedicated
CameraRig module.

Camera should consume runtime state only.

------------------------------------------------------------------------

## CardRig

One of the strongest parts.

The card behaves as a living vehicle rather than static geometry.

Future work:

-   split deformation
-   hover
-   boost
-   wind
-   banking into independent animation layers.

------------------------------------------------------------------------

## Pet Kinetics

Excellent architectural decision.

PetMotion remains canonical.

PetKinetics adds reactions afterwards.

This prevents ownership conflicts.

------------------------------------------------------------------------

## World Context

Promising long-term foundation.

Semantic world generation is already separated from runtime.

Recommendation:

Keep it independent from rendering.

------------------------------------------------------------------------

## Main architectural risk

travel-poc.js

Current responsibility includes:

-   bootstrap
-   orchestration
-   render loop
-   controller switching
-   feature flags
-   scene wiring

This should gradually be decomposed.

------------------------------------------------------------------------

## Suggested target architecture

TravelManager

-   lifecycle
-   update pipeline
-   mode switching

Vehicle

-   runtime state

Controller

-   movement

CardRig

-   presentation

PetKinetics

-   reactions

CameraRig

-   camera

VehicleFX

-   audiovisual effects

Navigation

-   destinations

------------------------------------------------------------------------

## Priority roadmap

P1

Extract TravelManager.

P2

Introduce common Controller interface.

P3

Move camera into CameraRig.

P4

Split CardRig animation layers.

P5

Reduce travel-poc.js to bootstrap.

------------------------------------------------------------------------

## Overall assessment

Architecture: 9.5/10

Extensibility: 10/10

Code organization: 9/10

Documentation: 10/10

Maintainability: 8.5/10

Recommendation:

Continue evolving the runtime architecture rather than adding new
features into travel-poc.js. The project is ready to transition from
prototype to engine-level runtime.
