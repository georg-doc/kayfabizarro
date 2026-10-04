# Eumel Rig Lab

Status: EXPERIMENTAL FIRST LAB  
Tool: 2D Animation Studio

## Goal

Reusable DocCheck Eumel 2D/2.5D cutout actor for browser animation and mini-game reuse.

## Current donor state

A measured/traced Eumel decomposition and early browser rig prototype were produced in the originating ChatGPT work and are useful **provisional donor evidence**. They are not the final visual SSOT because Georg is supplying the DocCheck AD Illustrator source next.

Current private DocCheck project reference:

`https://github.com/georg-doc/doccheck/tree/main/doc-animation/eumel`

## Rig concept

```text
EUMEL ROOT
├── shadow
├── leg_L
├── leg_R
├── body
├── stethoscope
│   ├── loop
│   ├── stem
│   └── chestpiece
└── head
    ├── eye_L → pupil_L
    ├── eye_R → pupil_R
    └── forehead_mirror
```

No arms.

## Intended first clips

- neutral regression pose
- idle
- look around / googly-eye lag
- hampelmann
- hop with anticipation/impact/recovery

## Next gate

Do not spend time perfecting provisional geometry. Ingest the AD Illustrator source first, reconcile the asset map, then rebuild/retarget the browser rig on accepted source vectors.
