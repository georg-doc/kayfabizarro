# 04 · Owner + Donor Boundaries

## Core rule

**Never silently replace an existing owner or contract.**

Before integration ask:

> Who already owns this state?

## Current Travel owners

R0 contract says:

- world/seed/terrain host → `globe-poc.js`
- globe mesh → `globe.js`
- ground height → `boden-lesung.js`
- spherical math → `spherical-math.js`
- player travel/flight position → `carpet.js` exclusively
- flight controls → `flight-controls.js`
- camera → `camera-rig.js`
- Card carrier → `card-carrier.js`
- current passenger presentation → Cube Pet path
- card acquisition → `sky-cards.js` / `card-flight.js` / `collect-hud.js`
- portals → `portal.js`
- lightweight sky enemies/fire → `sky-enemies.js` / `sky-dice.js`
- FX event entry → `fx-bus.js`
- audio → Travel audio modules

## MVP1 boundary

FrizzleBob replaces only passenger/presentation.

Actor may receive:

- card/seat frame
- speed
- bank
- pitch
- climb input
- target/look direction if needed
- `dt`

Actor may **not** own Travel position.

## Stunt Race donor

Borrow later:

- drive feel
- braking
- steering
- drift
- jump/landing
- recovery knowledge
- ramp/stunt assets
- optional local Rapier physics attraction

Do not import:

- track as world root
- global collider density
- second movement owner

## Combat Arena donor

Borrow later:

- Gunfight / projectile / damage
- enemies/mobs where suitable
- VFX/SFX event patterns
- death/drop/reward pieces
- actor/action bridge concepts

Do not import:

- Arena Player as Travel movement owner
- Arena Host as Globe owner
- Arena Camera as second camera owner
- old Actor in parallel with Graft

## Animation Lab / Frankenstein

These own authoring/evidence for:

- current Graft
- look/material config
- pose/clip analysis
- surf/standing pose
- vehicle/seat presentation
- measured adapters

Travel consumes outputs. It does not silently fork their authoring contracts.

## TinySkies donor

Reference selectively:

- spherical movement
- Boat
- RaceManager
- vehicle feature table
- Cosmic environment transition
- VoidMoths/wave combat

Do not transplant the whole `Game.ts` stack or multiplayer/server architecture.

## Asset Librarian

The Librarian owns **discovery and candidate handoff**, not implementation decisions.

See `06_ASSET_LIBRARIAN_CONTRACT.md`.
