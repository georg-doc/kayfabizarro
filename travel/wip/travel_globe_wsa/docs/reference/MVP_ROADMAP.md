# 03 · KFB Travel Globe v14+ · Product MVP Roadmap

**Status:** DECISION · 2026-09-13

This product sequence supersedes the old execution order while retaining the older slice documents as historical/detail backlog.

## B0 · Site baseline

No gameplay change.

- dedicated implementation repo
- baseline pin
- build/CI
- Cloudflare WIP
- missing normal-browser R0 QA
- docs/web-start

## MVP1 · FrizzleBob Card Rider

Goal:

> Replace the Cube Bunny passenger with the current FrizzleBob Driver Graft on the existing KFB Card.

Inputs expected from parallel authoring:

- Frankenstein Studio v16 appearance/config
- current Driver Graft
- Card surf/standing pose from Animation Lab
- additional presentation clips if required

Preserve Globe movement, card body, camera and collection behavior.

Acceptance question:

> Does the unchanged Globe immediately feel like the current KFB project when the passenger becomes the current FrizzleBob?

## MVP2 · Ground movement: Drive + Walk

Add explicit ground locomotion.

Preferred first implementation:

- Globe-native ground movement in the local tangent frame
- Drive feel borrowed from Stunt Race
- Walk/Run animation behavior from Animation Lab
- explicit Flight ↔ Ground ↔ Walk transitions

Do **not** globally transplant collision-heavy Rapier physics yet.

Vehicle presentation may initially use Rover or Bath depending on the smallest playable slice and current authored assets.

## MVP3 · Stunt Race

Add:

- open spherical race/checkpoint route
- gates
- boost
- broad ramps
- jump/landing events
- selected race-track/stunt assets
- later destruction/bumper elements

TinySkies `RaceManager` is a reference for open Globe races.

Stunt Race I1 is the later physics/recovery donor.

A local tangent-frame physics attraction may be added only if the simple Globe-native version proves fun.

## MVP4 · Ground Combat

Add selected Combat Arena systems:

- targets/enemies
- projectile/damage
- hit/death
- VFX/SFX
- drops/rewards as appropriate
- semantic actor/action adapter

Travel remains world/movement owner.

Do not transplant Arena Player or Arena Camera as competing owners.

The older `R2 Default Gun` plan is **DEFERRED to this MVP as combat preflight**, not deleted.

## MVP5 · Sky Combat

Expand flight combat using TinySkies as donor/reference.

Useful current donor concepts include:

- VoidMoths
- HP
- waves
- Elder enemy
- autofire/target behavior
- Combat VFX

First prove sky combat while Travel remains movement owner.

### MVP5b · Cosmic

Only after sky combat proves itself:

- portal to separate environment profile
- space/cosmic landmarks
- KSP/Sky Cards
- alternative encounter rules
- same actor/vehicle contracts

## Later vehicle convergence

Bath remains a strong hero-carrier candidate because one presentation can later support:

- Flight
- Water
- Ground

TinySkies `Boat` remains the Water locomotion benchmark.

Rover remains a useful low-risk ground/driver donor.

## Structural rule

Do not collapse these axes into one giant mode enum:

### Locomotion
Flight · Water · Ground · Walk

### Assist
Free · Guided/Autopilot · Rail/Attraction

### Encounter
Explore · Combat
