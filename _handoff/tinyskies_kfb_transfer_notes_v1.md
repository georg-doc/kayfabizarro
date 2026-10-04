# TinySkies → KFB Transfer Notes v1

## Scope

This document clusters the most useful ideas from `dannylimanseta/tinyskies` for the KFB engine.
It is intentionally KISS: what to borrow, what to adapt, what to avoid, and how to split the work into Claude-friendly modules.

## 1. What TinySkies actually is

The repository is a multiplayer Three.js game where players fly planes around customizable globes. The README states the stack as Vite, TypeScript, Three.js, Socket.io on the client; Node.js, Express, Socket.io, Prisma on the server; PostgreSQL for persistence. The architecture description explicitly says it uses quaternion-based spherical math plus relay-server multiplayer with client-side prediction and slerp interpolation. The repo layout is monorepo-style with `client`, `server`, and `shared` workspaces. fileciteturn3file0L131-L136 fileciteturn3file0L379-L384 fileciteturn1file0L4-L21

## 2. Clusters worth learning from

### A. Runtime math cluster

TinySkies’ key engine idea is the spherical globe math: flight is not free XYZ flight but movement on a curved surface with quaternion-based orientation and interpolation. The repo calls this out directly in the README. This is highly relevant for KFB because your Travel/Flight layer already wants a tangent-frame model, and TinySkies confirms that spherical/quaternion math is a clean basis for “singularity-free” globe travel. fileciteturn3file0L131-L136

**What to borrow**
- quaternion state for facing/orientation
- tangent-frame movement on curved surfaces
- explicit server/client interpolation boundary
- camera smoothing with slerp, not Euler snapping

**What to adapt**
- TinySkies is plane-centric; KFB needs vehicle-agnostic travel
- KFB cards/pets need a softer, toy-like feel; keep the math, change the motion language

**What to avoid**
- hardcoding “plane” semantics into the runtime contract
- mixing world topology with vehicle behavior

### B. Network cluster

TinySkies is not just a visual prototype; it has a relay server, Socket.io networking, and state sync/prediction. The README and package manifests show a client/server split with Socket.io on both sides and Prisma/PostgreSQL for world persistence. That is useful as a pattern if KFB ever wants authoritative multiplayer or shared world state. fileciteturn3file0L131-L136 fileciteturn4file0L13-L18 fileciteturn5file0L20-L28

**What to borrow**
- authoritative server boundary for shared travel/world state
- client-side prediction for local responsiveness
- interpolation for remote actors
- world-code / room-code join flow as a simple session model

**What to adapt**
- KFB may not need a full database-backed server immediately
- if multiplayer is added, use the same separation but keep persistence minimal

**What to avoid**
- introducing DB and auth too early for the first KFB travel module
- baking server assumptions into the client travel API

### C. Content / cozy-world cluster

TinySkies uses a lot of small ambient systems: NPC boats, rings, starfield, void hearts, birds, water spouts, landmarks, and more. The repo’s file list alone shows many discrete world systems, and the main game file imports a broad set of them. That is the “cosy” layer: small discoverable interactions, ambient life, and lots of light-weight world dressing. fileciteturn8file2turn8file19 fileciteturn9file0L35-L79

**What to borrow**
- many tiny ambient micro-systems rather than one giant content system
- landmarks and collectibles as low-friction progression
- visual weather / atmosphere systems around travel
- NPC fly-bys and ambient creatures

**What to adapt**
- replace plane/world lore with KFB’s pet-card identity
- preserve “small wonders” instead of large quest chains

**What to avoid**
- overbuilding content systems before the travel core is stable
- tying atmosphere to any single vehicle

### D. UI / onboarding cluster

The README makes onboarding very explicit: create a world, copy a world code, join in another tab, fly together. That is a strong pattern for frictionless testable multiplayer sessions. fileciteturn3file0L41-L47

**What to borrow**
- world-code join flow
- a minimal “create/join/fly” loop
- short operational instructions that fit into a single screen or panel

**What to adapt**
- KFB can replace “world code” with “travel scene code” or “session code” depending on scope

**What to avoid**
- elaborate onboarding before the control feel is proven

## 3. KFB-relevant engineering patterns

### Pattern 1: world state split

TinySkies separates client, server, and shared packages. The root package is a workspace shell; the shared package exports shared types/config; client and server each own their domain. This is a strong template for KFB if you want a clean division between runtime math/contracts and gameplay/scene implementations. fileciteturn1file0L4-L21 fileciteturn6file0L3-L9

**KFB mapping**
- `shared` → contracts, enums, travel state, vehicle capabilities
- `client` → rendering, input, FX, camera
- `server` → optional authoritative state, sessions, persistence

### Pattern 2: explicit runtime feature modules

The `Game.ts` import list shows a modular runtime: camera, day/night, audio, various vehicles, systems, UI overlays, progression, quests, particles/VFX, NPCs. That is not one monolith; it is a module graph. This is useful for KFB because Travel can similarly become a set of focused modules rather than a single controller blob. fileciteturn9file0L35-L130

**KFB mapping**
- TravelManager
- VehicleController
- GroundController
- FlightController
- CardRig
- CameraRig
- TravelFX
- TravelUI

### Pattern 3: comfort-first world feel

TinySkies combines system depth with playful ambient output. The right lesson is not any single effect, but the density of small readable feedback loops. For KFB that means: hover, flex, wind, banking, camera lag, trails, maybe a few ambient entities—enough to make travel feel alive without demanding complex simulation. fileciteturn9file0L35-L130

## 4. What KFB should actually copy

1. **Quaternion + tangent-frame movement** for globe travel.
2. **Client-side prediction / interpolation pattern** if multiplayer is needed.
3. **Monorepo split with shared contracts**.
4. **Small ambient world modules** instead of one giant scene script.
5. **Simple session/world-code workflow** for testing and sharing.

## 5. What KFB should not copy 1:1

- plane-specific controls and semantics
- the current server/database stack unless multiplayer/persistence is truly needed
- the full content density before Travel core is stable
- the whole cozy-world dressing without first nailing feel and contracts

## 6. KFB module proposal for Claude

### 001 Travel Runtime Contract

Define the runtime boundary: vehicle ownership, state flow, update order, and input abstraction.

### 002 Spherical Movement Core

Implement quaternion/tangent-frame math for globe travel.

### 003 Camera Rig

Implement follow, lag, look-ahead, zoom, and vehicle-relative FOV.

### 004 Card Rig

Implement the visual vehicle: hover, bank, flex, wind response, boost anticipation.

### 005 Ground Controller

Implement walking / ground traversal mode and transition into mount/travel.

### 006 Flight Controller

Implement flight mode with altitude, boost, glide, and travel-state updates.

### 007 Ambient World FX

Implement trails, particles, weather, and low-cost scenic world dressing.

### 008 Optional Multiplayer Shell

Only if needed: room/session code, prediction, interpolation, authoritative sync.

## 7. Recommended Claude implementation order

1. Travel Runtime Contract
2. Spherical Movement Core
3. Camera Rig
4. Card Rig
5. Ground Controller
6. Flight Controller
7. Ambient World FX
8. Optional Multiplayer Shell

## 8. KISS summary

TinySkies is most valuable to KFB as a **math + runtime architecture reference**, not as a direct art or content template.

The transferable core is:
- quaternion/spherical movement
- modular runtime separation
- explicit client/server split if needed
- cozy ambient micro-systems

The KFB-specific adaptation is:
- card/pet vehicle identity
- softer, toy-like travel feel
- world modules aligned with pet-driven travel, not planes

## 9. Sources used

- `dannylimanseta/tinyskies` README and root package manifests. fileciteturn3file0L131-L136 fileciteturn3file0L41-L58 fileciteturn1file0L4-L21 fileciteturn4file0L13-L18 fileciteturn5file0L20-L28
- Main runtime import graph in `client/src/game/Game.ts`. fileciteturn9file0L27-L130
- Repo file list showing the spread of ambient systems and modules. fileciteturn770267view0L199-L269
