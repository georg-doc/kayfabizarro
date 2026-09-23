# Audit · “Living Document Modulares Animations-System & Clip-Library v1.3”

Status: **MIXED · USEFUL IDEAS + FACTUAL ERRORS · NOT CANONICAL**

## Für Georg

Der Text enthält gute Produktionsideen, aber er ist nicht datenfest genug, um unverändert an Blender MCP/Coworker als Systemwahrheit zu gehen.

Er wird deshalb als **PROPOSAL / IDEATION SOURCE** behandelt.

Verifizierte Fakten kommen aus GitHub/Resident Atlas/PR #195.

## What is useful

Keep as candidate concepts:

- Base dance vs upper-body performance overlay as a possible modular authoring pattern;
- semantic clip names;
- named Blender Actions / NLA organization;
- BPM / beat metadata;
- explicit event/contact sidecar;
- authoring-time joint constraints;
- validation before preview/export;
- one source rig family at a time.

These concepts still need implementation proof.

## Corrections

### 1 · Rig_Medium bone list is wrong

Verified Rig_Medium:
**23 bones**

Current source-backed names do **not** include a `neck` bone.

The v1.3 text says 23 bones but lists 24 entries by adding `neck`.

Do not use that bone list for scripting.

Use exact rig facts from Asset/Resource Registry / Resident Atlas.

### 2 · Universal wrist limit is wrong

v1.3 proposes:
`wrist ≤ 45°`

PR #195 current candidate drum audit proposes:
- elbow ≥ 35°;
- wrist ≤ 35°;
- forearm twist ≤ 70°.

But even those are **not universal**.

The Georg-accepted guitar hold has about:
- wrist 15°;
- forearm twist 117°.

Therefore:
**joint budgets are action-family-specific.**

Profiles may include:
- strike;
- instrument hold;
- strum;
- carry;
- dance;
- presenter.

A global limit that rejects an accepted pose is not a valid global rule.

### 3 · ORB BPM is not 120

The v1.3 text uses 120 BPM as if it were current project truth.

Current ORB-P1 source:
- track BPM = **100**;
- phase offset = **0.465**.

120 BPM may remain an example/default parameter only.

Never overwrite measured/source BPM with a generic template value.

### 4 · Hand local-axis thresholds are not contact truth

Examples in v1.3 such as:
- drum hit = local minimum of `hand.r` Z;
- guitar strings = hand local Y crosses 0.02;
- vocal start = hand/head distance < 0.1;

are **unverified heuristics**.

Why:
- hand transform is not the stick-tip transform;
- local bone axes depend on hierarchy/pose space;
- instrument/actor transforms change world relationship;
- current PR #195 proves that forcing the arm to a fixed target causes grotesque compensation.

Canonical candidate rule:
measure/evaluate actual relevant geometry:
- stick tip;
- drum target surface;
- string/contact plane;
- prop grip;
- deformed actor mesh.

Unmeasured constants like `0.02`, `0.05`, `0.1` stay UNPROVEN.

### 5 · Timeline markers are not the runtime event contract

Blender timeline markers/custom properties may help authoring/debug.

Do not assume they become portable glTF runtime events.

Current candidate KFB rule:
- GLB/GLTF = motion clip;
- sidecar = semantic events / beat grid / contact times;
- runtime binds clip time → SFX/VFX/game event.

This keeps Blender and runtime ownership separate.

### 6 · BPM rescaling implementation is unproven

The general idea:
`source BPM → target BPM → time scaling`
is valid as a candidate.

The exact Python/F-Curve implementation in the supplied prompt is not source-verified here.

Before adopting:
- test on one real Action;
- verify loop length;
- verify interpolation;
- verify contact frames after retiming;
- compare exported GLB.

Do not canonize pseudocode as Blender API truth.

### 7 · Lower/upper clip split is candidate-only

Deleting upper-body curves from a full-body source action and layering another action may be useful.

It is **not yet proven** for KFB rigs.

Risks:
- root/hips continuity;
- spine dependency;
- foot contact;
- additive vs override semantics;
- exported NLA result.

First prove one Rig_Medium fixture.

No automatic “all dances = lower body / all performance = upper body” rule.

### 8 · “Absolute data consistency” claim is false

Because the text includes:
- wrong bone list;
- unmeasured contact thresholds;
- generic BPM replacing current ORB facts;
- universal joint limits that conflict with accepted animation evidence.

Therefore it cannot be treated as a recovered SSOT.

## Current source hierarchy for resident performance

1. exact actor / rig facts;
2. exact donor clip inventory;
3. accepted Resident/Performance source facts;
4. PR #195 measured failures/acceptances;
5. `PERFORMANCE_ANIMATION_PILOT.md`;
6. external/reference motion;
7. new authoring.

Prompt prose never outranks measured source.

## Decision

Salvage the modular/NLA/event ideas.

Reject:
- invented bone names;
- universal joint limits;
- fixed coordinate thresholds;
- runtime-marker assumptions;
- generic BPM as current ORB truth.

Next:
`RESIDENT_PERFORMANCE_NEXT_2026-09-23.md`.
