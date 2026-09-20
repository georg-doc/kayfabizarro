# KCC-1A · FrizzleBob Secondary Motion Facts · START HERE

**Date:** 2026-09-20  
**Status:** ACTIVE CANDIDATE · PURE PRESENTATION-FACTS ADAPTER  
**Owner:** KFB ToolBox / Character compatibility  
**Repo:** georg-doc/kayfabizarro  
**Branch:** chatgpt-web/frizzlebob-secondary-motion-kcc1a-2026-09-20  
**Base:** KCC-0 handoff head `d230909626ae24844d2b3109bc45a757b04b1959`  
**Outcome:** deterministic Race presentation facts → bounded secondary-motion target facts, with no new ear mesh, no spring fork and no Race physics ownership.  
**Intended Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KAYKIT_CHARACTER_COMPAT_V0_2026-09-20/RETURN.md`
5. `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/actor-wobble.v1.js`
6. `kfb-hub/stunt-race/track-environment-lab/host/RACE_FLOW_RUNTIME_CONFIG.json`

GitHub state overrides chat memory.

## Upstream facts

The current Race presentation hook contract is already declared by:

`kfb-hub/stunt-race/track-environment-lab/host/RACE_FLOW_RUNTIME_CONFIG.json`

Exact source blob at slice start:

`0e28076bdb7bf5dc4cbb77bc0f857b8a4ea631e2`

Race owns and may expose:

- `longitudinalAcceleration`
- `lateralAcceleration`
- `angularVelocity`
- `impactImpulse`
- `relativeAirflowVector`
- `speedNormalized`
- `stuntState`

Its stated intent is the existing seam:

`Vehicle Visual Root -> KFB rig/composite -> Driver Actor -> secondary motion`

without changing vehicle contact physics.

## Scope

KCC-1A adds one pure function:

`sampleRaceSecondaryFacts(facts, options)`

It may normalize and combine current presentation signals into **dimensionless target facts**.

It must not:

- move the vehicle;
- read input devices;
- integrate velocity or position;
- create a second clock;
- change the KayKit skeleton;
- replace `actor-wobble.v1.js`;
- create new ear geometry;
- make the current ears visually canonical;
- use randomness.

## Output contract

Schema candidate:

`kfb.secondary-motion.race-facts/0.1`

The output is stateless and dimensionless:

- `energy` · 0…1 presentation energy;
- `airflow` · normalized local direction + normalized strength;
- `root.pitch / roll / yaw` · -1…1 target facts;
- `tip.pitch / roll / yaw` · -1…1 target facts;
- `flutter.value` · deterministic -1…1 wave value;
- `flutter.amplitude` · 0…1;
- `flutter.frequencyHz` · presentation frequency candidate;
- `impact` · 0…1 normalized presentation impulse;
- `stuntState` · opaque pass-through only.

The future ear adapter maps these dimensionless facts to the approved ear mesh's actual angle/deformation limits.

## Local-frame convention

KCC expects the consumer to supply `relativeAirflowVector` in the actor/vehicle local frame:

- +X = right
- +Y = up
- +Z = forward

A forward-moving vehicle normally sees relative airflow toward -Z.

KCC does not transform world vectors itself; the consumer owns that transform.

## Determinism

The adapter is a pure function.

Flutter is generated only from:

- explicit `timeSeconds`;
- explicit `seed`;
- normalized energy.

At zero energy, flutter amplitude and value are exactly zero for all time/seed values.

Repeated calls with identical inputs must return byte-equivalent JSON data.

## Integration direction

KCC-1A does **not** apply these targets to current ears.

KCC-1B will:

1. identify/approve a real replacement ear source;
2. show that source in isolation;
3. attach it below the existing measured FrizzleBob head host;
4. reuse the current spring behavior donor;
5. map KCC-1A normalized targets into geometry-specific root/tip limits;
6. prove reset/no-drift and visual front/side/¾ behavior.

## Environment

`GAME_DEV_CLI_UNAVAILABLE`

Repository-native tests are the fallback for this bounded facts adapter.
