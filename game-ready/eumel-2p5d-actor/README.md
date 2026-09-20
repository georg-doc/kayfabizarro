# KFB Game-Ready Candidate · Eumel 2.5D Actor

**Status:** PACKAGE METADATA IMPLEMENTED · WORLD-SPACE ADAPTER STATIC PASS · CONSUMER/HUMAN GATES OPEN  
**Date:** 2026-09-20

This package makes the source-exact DocCheck Eumel available to named KFB/DocCheck consumers without copying or replacing the canonical source art.

## Package role

```text
DocCheck Illustrator source
→ source-exact 2D Animation Studio component/rig
→ three2p5d presentation adapter
→ this game-ready metadata package
→ named consumer
```

Canonical source geometry is referenced, not copied into this package.

## Current named consumers

- DocCheck Project Island — prepared consumer handoff;
- KFB Resident Atlas — prepared scene-module candidate, not indexed;
- later one named KFB game runtime after Resident proof.

## Source / implementation pins

- Illustrator source blob: `436143b019f0034c6d2d9183154cf613ff8c701e`
- source-exact component SVG blob: `457bca8a76bd156ba627763098f0dcfc9a54edc1`
- neutral bind blob: `3f080dc26b74e3f2b9ae6283aff18a26347a0782`
- three2p5d implementation merge: `52702836bf0740414e53abb5a3867af5981c195a`

## What is packaged

- actor/source/rig references;
- world-space presentation modes;
- local animation/eye contract;
- ownership boundary;
- consumer test plan;
- DocCheck/Resident handoff pointers.

## What is not packaged

- no copied SVG/AI source;
- no island/world geometry;
- no collision;
- no camera;
- no movement controller;
- no quest/progression;
- no persistence;
- no accepted Doccy geometry.

## Current gate

Run the real-browser `three2p5d` proof and visually accept/tune/reject it before Resident Atlas index promotion or a Project Island scene build.
