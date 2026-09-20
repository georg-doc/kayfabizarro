# KFB Travel Architecture Audit v1

## Executive Summary

This audit reviews the current Travel v7 architecture from an engine perspective rather than as a feature review. The overall direction is strong: the project is evolving from a proof of concept into a reusable runtime with clear separation between Pet, Vehicle, Controllers and presentation.

Overall assessment: **8.8/10**

## Architecture Strengths

- Good separation between runtime and presentation.
- Controller-based movement architecture is extensible.
- Card carrier concept cleanly decouples pet from locomotion.
- Documentation quality is unusually high and enables parallel work.
- Existing handover documents form an emerging specification rather than isolated notes.

## Primary Risks

### 1. Runtime orchestration
The central travel runner is becoming responsible for lifecycle, update sequencing, controller switching and integration. Continue extracting orchestration into dedicated runtime services before additional travel modes are added.

### 2. Contract formalisation
Several modules already behave as if stable interfaces exist. Make those interfaces explicit before implementation grows further.

### 3. Event model
Current architecture would benefit from a unified runtime event layer (mount, dismount, land, boost, controllerChanged, surfaceChanged).

## Recommended Runtime Layers

Engine
- TravelManager
- RuntimeState
- EventBus

Controllers
- Ground
- Flight
- Future Vehicle Controllers

Presentation
- CardRig
- PetKinetics
- CameraRig
- FX

World
- Surface
- Navigation
- WorldContext

## Ownership Matrix

Pet
- emotion
- animation intent
- personality

Vehicle
- locomotion
- physics
- travel state

CardRig
- visual deformation only

CameraRig
- framing only

WorldContext
- environmental queries only

## Suggested Contracts

- ITravelController
- IVehicle
- ICameraRig
- ITravelEvents
- IWorldContext

## Technical Debt Priority

High
1. Extract TravelManager.
2. Formalise interfaces.
3. Introduce event bus.

Medium
1. Shared controller base class.
2. Camera pipeline separation.
3. Debug overlays.

Low
1. Telemetry.
2. Replay support.
3. Runtime metrics.

## Claude Design Action Items

- Preserve controller boundaries.
- Avoid presentation logic inside controllers.
- Build against contracts instead of concrete classes.
- Keep CardRig completely visual.

## Cowork Review Checklist

- Verify ownership.
- Verify update order.
- Detect cyclic dependencies.
- Review allocations per frame.
- Validate controller swap behaviour.

## Long-term Vision

Travel should become one runtime module inside a larger KFB Runtime alongside Surface, Dialogue, Inventory and NPC systems. Current architecture already supports that direction and should continue moving toward explicit contracts and small composable modules instead of feature-specific logic.
