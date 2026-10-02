# TEST REPORT · PROCEDURAL BUILDING B4 · REAL-WORLD PERSPECTIVE MATRIX

Status: **PERSPECTIVE MATRIX PASS · HUMAN STYLE DECISION OPEN**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Purpose

B4 isolates the perspective/camera contribution before changing the accepted Elastic V2 building geometry.

All screenshots come from the real stable WorldBuilder profile:
`WORLD_INTEGRATION_01_SOURCE.html?world=huerth-b1`

Geometry / facade / material / lighting / world context remain unchanged between camera modes.

## Source camera donor

`tools/osm-city-lab/src/viewer/app.js`

Blob:
`181edccab50c2b127b95370cc67da55e138b7a78`

Exact modes:

### Neutral
- FOV 45
- filmOffset 0
- up (0,1,0)
- position ratios (.62,.52,.62)
- targetY 0

### Cartoon
- FOV 59
- filmOffset 4.8
- up (.04,.9992,0)
- position ratios (.46,.22,.41)
- targetY 7

### Grotesque
- FOV 76
- filmOffset 10.5
- up (.085,.9964,0)
- position ratios (.31,.12,.28)
- targetY 12

## Context span

Existing owner constant:
`FACADE_RULE.roadMaxM = 40 m`

The matrix uses ±40 m around each sibling:
`span = 80 m`

This avoids inventing a review radius.

## Subjects

- compact-simple
- ordinary-notched
- large-complex

Total:
**3 subjects × 3 camera modes = 9 real WB2 screenshots**

## Test

Tested head:
`7ceb9e9b234b11cf2f4c74569149f4176dd10ec2`

Run:
`37053313648`

Job:
`110991771129`

Conclusion:
**SUCCESS**

Evidence artifact:
- id `11246839894`
- size 5,577,301 bytes
- digest `sha256:57539e1a5417301be5af956614b677abe5d6364b3a4387d7a8ae3bc994d68cd0`

Evidence:
- 9 PNG screenshots
- `state.json`

QA:
- geometryChanged: false
- roadMaxM: 40
- contextSpan: 80
- exact camera values verified
- same geometry fingerprint for blocks / roofs / merged details across all 9 captures
- 0 console errors
- 0 page errors
- 0 QA problems

## Manual visual review

### Neutral
Useful as a readable overview/reference.

It emphasizes:
- neighborhood organization;
- relative building mass;
- roof distribution.

It weakens:
- skew;
- low-angle cartoon perspective;
- spatial tension.

### Cartoon
The exact existing Cartoon camera remains readable at this local neighborhood scale.

It visibly adds:
- stronger perspective;
- more character to ordinary low-rise buildings;
- a less map-like, more cartoon-world presentation;
- useful building-to-street depth without severe foreground occlusion.

This is a viable low-rise review/presentation donor.

### Grotesque
The exact historic City Grotesque camera reproduces its intended aggressive low/close staging.

At this **local 80 m building context** it becomes too close:
- foreground walls dominate;
- selected subject can be partially occluded;
- it is not a reliable local building-review camera.

This does **not** reject the historical Grotesque lens.

It proves a scale distinction:
**Grotesque staging is a city-scale composition donor, not a direct local low-rise review camera.**

## Style-axis interpretation

### Polly
The camera layer clearly matters.
Cartoon and Grotesque framing add designed skew/perspective without changing geometry.

### Rocko
Cartoon mode is the more readable local-world donor: ordinary buildings gain perspective personality while staying legible.

### Metropolis
B4 confirms this low-rise family should remain city fabric. Monumentality should not be forced through local camera or deformation.

## What B4 proves

- perspective is a real part of the previously successful KFB grotesque read;
- it should remain separate from geometry;
- the existing Cartoon camera is useful at local low-rise scale;
- the exact Grotesque city camera should not be transplanted blindly to local house review;
- no geometry change was required to obtain a stronger cartoon presentation.

## What remains a human design decision

The matrix cannot objectively decide:

**Is V2 geometry + the recovered Cartoon perspective already characterful enough, or should ordinary buildings receive a stronger source-proven geometry transfer?**

That is now the next meaningful human design decision.

If stronger geometry is desired, the next donor is the exact historic City Grotesque preset:
- verticalSteps 8
- bend .105
- lean .09
- taper .22
- twistDeg 11
- stackSteps 7
- stackShift .065

It must be treated as a benchmark donor, not automatically as production values.

## Classification

**B4_REAL_WORLD_PERSPECTIVE_MATRIX_PASS · STYLE_DECISION_OPEN**

No production camera or geometry was changed.

## Exactly one next gate

**GEORG · B4 PERSPECTIVE RESULT**

Review the real-product 3×3 contact sheet.

Decision:
1. **V2 + Cartoon perspective is enough to continue**
or
2. **geometry still needs stronger deformation**, which opens the exact City-Grotesque geometry benchmark as B5.

No material decision.
