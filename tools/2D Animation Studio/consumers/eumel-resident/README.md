# Eumel · 2.5D Resident Candidate

Status: **PREPARED CANDIDATE · runtime adapter not yet proven**

## Goal

Use source-exact DocCheck Eumel as a grounded 2.5D character inside a real Three.js/KayKit world without converting him into a generic 3D mascot.

Primary first scene direction from Georg:

> a DocCheck project island built from a pinned KayKit 3D set, with Eumel present as a Resident-style 2.5D host/guide.

## Identity rule

Eumel stays the source-authored graphic character.

Do not:

- remodel him as a generic round 3D doctor;
- normalize his outline families;
- invent arms;
- replace the source eye system;
- bake world/camera transforms into the actor asset.

## 2.5D rule

Preferred first runtime mode:

`upright-yaw-billboard`

The actor root lives in world space. The consumer owns its world position, heading and ground/contact. The cutout renderer owns only local part transforms and small z-depth separation.

A fixed `world-facing-upright` mode must also be available for shots where billboard behavior looks wrong.

## Resident rule

The Eumel module should enter Resident Atlas through the existing **scene-module** seam rather than a parallel resident runtime.

Candidate manifest:

`tools/resident_atlas/modules/candidates/eumel-doccheck-project-island.module.json`

The existing Clown S33/WSA gate remains independent.

## DocCheck Project Island

The project island is a **consumer scene**, not part of Eumel's actor source.

Consumer responsibilities:

- exact KayKit environment asset selection/pins;
- island/support/collision;
- camera;
- user movement;
- interaction/progression;
- content cards/project navigation.

Eumel responsibilities:

- local acting;
- eye/face behavior;
- idle/look/walk/hop and future semantic clips;
- local secondary motion.

## Next implementation gate

Build and browser-test a `three2p5d` renderer adapter against one neutral project-island stage before Resident Atlas promotion.
