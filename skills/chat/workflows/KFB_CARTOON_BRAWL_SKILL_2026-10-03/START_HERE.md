# KFB Cartoon Brawl Skill · Research/Distillation Slice

Status: WIP_RESEARCH
Date: 2026-10-03
Owner: KFB shared skill layer · georg-doc/kayfabizarro
Workflow: KFB-CARTOON-BRAWL-SKILL-01
Branch: chatgpt-web/kfb-cartoon-brawl-skill-01-2026-10-03

## Goal

Research and distill a reusable, provider-neutral KFB Cartoon Brawl skill for 3D melee combat and cinematic/gameplay brawls. The skill must support Claude and other LLM implementation agents without taking runtime ownership away from consuming projects.

## Existing owners / donors

- Base motion canon: `skills/kfb-cartoon-animation_v2.md`
- Combat runtime owner: `georg-doc/KFB-Combat-Arena`
- Current concrete melee donor/evidence: CA2 Sword candidate on Combat Draft PR #7, including real `Melee_1H_Attack_Chop`, weapon mount/body-clearance concerns and swept-contact / AttackLedger concepts.
- ToolBox/FrankenStein may own weapon attachment/presentation measurement; consumers own combat consequences and runtime movement.

## Protected boundary

This slice does **not**:
- modify Combat Arena gameplay/runtime;
- replace existing actor, movement, physics, damage or target-selection owners;
- invent a second generic motion canon;
- promote any Combat candidate;
- require a public Stage route merely for documentation/research.

## Research blocks

1. Melee gameplay architecture: attacks, combos, state machines, buffering, cancels, recovery, targeting, root motion/in-place.
2. Animation craft/choreography: anticipation, silhouettes, arcs, spacing, hitstop, reactions, camera and cartoon exaggeration.
3. Weapon/rigging correctness: grip sockets, hand orientation, constraints, IK, two-hand alignment, sheaths, weapon trails, self-clearance.
4. Collision/hit validation: swept traces, hitboxes/hurtboxes, active frames, per-swing ledgers, multi-hit policy, latency/network concerns where relevant.
5. VFX/SFX sync: animation events/notifies, contact frames, trails, impact bursts, hitstop, screen shake, sound timing and cleanup.
6. Asset/motion-library adaptation: Mixamo/KayKit/retargeting, animation cleanup, semantic clip classification and mismatch repair.
7. Fight choreography: readable intent, distance, rhythm, escalation, paired interactions, crowd brawls, weapons/shields and environmental interactions.
8. KFB constraints: low-noise comic readability, clay/cartoon look, strong staging, one-primary-read event budgets and reusable fixtures.

## Deliverables

- research notebook/source matrix with official docs, GDC/industry talks and selected expert tutorials;
- first-pass design rules and failure taxonomy;
- canonical skill candidate `skills/kfb-cartoon-brawl_v1.md`;
- additive registry/router entry only after the skill candidate is coherent;
- Return with exact branch/head, files, source/test counts, unresolved items and exactly one next gate.

## Done when

A fresh LLM can use the skill to implement or review one bounded melee interaction while:
- preserving the consumer's existing runtime owners;
- keeping weapon orientation/body clearance valid;
- synchronizing active hit windows, collision, reactions and VFX/SFX to the animation;
- handling attack transitions/recovery predictably;
- producing readable cartoon choreography rather than generic animation spam;
- exposing fixed fixtures/debug evidence for verification.

## Current next gate

**RESEARCH-BLOCK-A** — establish the sourced architecture/choreography baseline before writing implementation prescriptions.
