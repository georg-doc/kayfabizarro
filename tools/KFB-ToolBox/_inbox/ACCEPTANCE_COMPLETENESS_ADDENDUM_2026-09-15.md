# Acceptance Completeness Addendum

**To:** `CLAUDE_DESIGN_FABLE_MEGA_SLICE_STARTZONE_2026-09-15.md` (commit `c7ba1e9`)
**Date:** 2026-09-15
**Status:** PROPOSAL · not a Georg decision until Georg says so
**Author:** Claude Coworker, independent pass

This addendum does not add scope. It adds **acceptance coverage for scope the brief already contains**, and it splits one expensive gate into a cheap one and a real one.

---

## 0 · Why this exists

Measured against the ToolBox brief that failed on 15.09:

```
ToolBox brief    39 surface obligations    11 acceptance gates
this brief       78 surface obligations     6 evidence artifacts + 5 questions
```

The failure mechanism was not ambiguity. The brief was detailed. The mechanism was:

> **What stood in the acceptance list got built. What did not stand in it got dropped or invented.**

A larger gap between obligation and acceptance reproduces the same failure at a coarser grain.

### Rule 1

> Every identity-bearing property gets a line in the acceptance list, or it is explicitly marked **MAY BE MISSING**. There is no third field.

### The third field, in this brief

Nine soft qualifiers currently occupy that third field. Each one is a place where an obligation can quietly evaporate without anyone being wrong:

```
§4 A1   camera presets              "where useful"
§4 A1   skew controls               "compact"
§4 A2   local/world mode            "if useful"
§4 A3   pivot/falloff               "where required"
§4 A3   Bulge/Pinch                 "only if cheap and stable"
§4 A5   camera state                "where appropriate"
§5 B1   coast/water                 "where consistent with"
§5 B3   haze                        "where useful"
§5 B3   cloud lighting cues         "where feasible"
```

Each must move to §A below or to §C below. Nothing stays soft.

---

## A · Pre-gate · one picture before the slice

**Insert before Mega Slice A. Nothing else is built until this is answered.**

The brief merges visual direction and authoring experience into a single stop at the end of Mega Slice A+B. If the direction is wrong, the whole editor has been built before Georg sees the first frame.

### Deliverable

**One still frame. Optionally a second from a different azimuth.** Nothing else.

- from the **real renderer with the real assets** the editor will use, not a concept render, not a moodboard, not an image model;
- Start Zone composition in `Birthday Sunset`;
- must contain: terrain silhouette, coast/water relationship, lighthouse in the terrain, readable foreground/midground/background, rainbow, cartoon cloud shapes, the reserved Birthday clearing;
- must contain **no** editor chrome, no transform handles, no panels. This is a picture of the world, not of the tool.

### Decision

`ACCEPT DIRECTION · REPAIR · REJECT DIRECTION`

Acceptance questions at this gate are only **Wallpaper** and **Extendability**. Tool, Screensaver and the rest stay at the main gate.

### Cost

Minutes. That is the entire point. A direction rejected here costs a still frame. A direction rejected at the end of Mega Slice B costs the slice.

---

## B · Eight missing acceptance lines

Continuing the numbering of §10 of the brief, which ends at 6.

Each line names the artifact, what it must show, and **what makes it red**. A number that is green on success but cannot see the defect does not count.

---

### E7 · Rainbow is in the world, not on the screen

`§5 B3` · currently in no evidence artifact, although `§14` lists it as a DECISION.

| | |
|---|---|
| **Artifact** | the wide world frame, plus one frame from a different camera azimuth |
| **Must show** | the rainbow occluded by, or occluding, at least one world element |
| **Red if** | the rainbow occupies the same screen position or the same shape in both frames |
| **Number** | screen coordinates of the rainbow apex in both frames. Identical means it is a 2D overlay. |

---

### E8 · Skewed Cartoon Perspective exists and does something

`§4 A1` · named in the brief as a KFB identity control, in no evidence artifact.

| | |
|---|---|
| **Artifact** | two frames, identical camera position and scene, skew off and skew on |
| **Must show** | a visible difference in the projection |
| **Red if** | pixel difference is zero, or the difference is indistinguishable from a field-of-view change |
| **Number** | the difference image. Empty means the control is not wired. Uniform means it is an FOV slider with a new name. |

---

### E9 · Night / Disco exists and shares the scene graph

`§5 B4` · the brief requires three variants. Evidence artifact 1 shows `Birthday Sunset`, artifact 4 shows *a* variant switch. `Night / Disco` can be absent and everything still reads green.

| | |
|---|---|
| **Artifact** | a third full frame, same camera, same scene, `Night / Disco` |
| **Must show** | environment, sky, light and emissives changed |
| **Red if** | any asset identity or any transform differs between the three variants |
| **Number** | node count and transform values across the three variants. They must be identical. A variant that rebuilds the scene is a second scene. |

---

### E10 · Coast and depth

`§5 B1` · two hard requirements, in no evidence artifact. Coast is additionally softened by *where consistent with*. Decide it: either it is here or it is in §C.

| | |
|---|---|
| **Artifact** | the wide world frame, annotated once |
| **Must show** | one named element in each of foreground, midground, background; the coastline as a terrain/water intersection |
| **Red if** | fewer than three named elements, or the water is a flat quad meeting the horizon with no terrain contact |

---

### E11 · The deformer, named by kind

`§4 A3` · evidence artifact 3 says *Cartoon Deformer*. Bend and Squash look nothing alike and both satisfy that wording.

| | |
|---|---|
| **Artifact** | one strip: the same prop, same camera, six states — undeformed, Bend, Taper, Squash/Stretch, Twist, Skew |
| **Must show** | six distinguishable silhouettes |
| **Red if** | any two states are pixel-identical |
| **Red if** | **Bend, Taper or Twist leave a straight source edge straight.** These three are non-affine by definition. A straight edge that stays straight means a scale or rotation was applied and given the deformer's name. |
| **Note** | Squash/Stretch and Skew are affine by nature. For those two, state the numeric parameter alongside the frame. |

---

### E12 · The speaker pair is related, not cloned

`§4 A3` names this as the first visible QA prop. No evidence artifact covers it.

| | |
|---|---|
| **Artifact** | one frame containing the duplicated prop pair |
| **Must show** | two instances of the same source asset, deliberately different |
| **Red if** | the two are identical up to translation |
| **Number** | the two deformer configs, printed. They must differ in at least two parameters. |

---

### E13 · What actually survives reload

`§4 A5` lists seven things that must survive. Evidence artifact 5 says *save/reload proof*, which a screenshot of a reloaded scene satisfies without any of the seven being true.

| | |
|---|---|
| **Artifact** | one table, seven rows, two columns: before and after reload |
| **Rows** | asset identity · transforms · deformer values · camera state · terrain settings · lighting preset · variant |
| **Must show** | for transforms and deformer values, **the numeric values themselves**, not a checkmark |
| **Red if** | any row is blank, `n/a`, or a tick without a value |

---

### E14 · The asset categories are actually populated

`§4 A4` requires seven categories. The placeholder/real list can be returned without naming any of them.

| | |
|---|---|
| **Artifact** | the `PLACEHOLDER / REAL` list, extended to seven named rows |
| **Rows** | building · tree/nature · rock · fence/road/path · prop · light/emissive prop · hero world landmark |
| **Must show** | the actual asset used per category |
| **Red if** | a category has no named asset, or one asset is claimed for two categories |

---

## C · MAY BE MISSING · the explicit second field

Everything listed here may be absent at this gate without being a defect. It must be named in the `PLACEHOLDER / REAL` list.

```
final GothGirl / Hihi presentation      §8    stand-ins allowed, marked as such
real cloth curtain                      §9    marked placeholder, no faked sheet
final Town geography                    §5 B1 must stay visibly provisional
fireworks                               §7    position reserved, effect absent
Bulge / Pinch deformer                  §4 A3 optional
local / world transform mode            §4 A2 optional
camera presets beyond orbit/pan/zoom    §4 A1 optional
cloud lighting cues                     §5 B3 optional
Birthday state machine and audio        §11   out of scope
```

**Anything in the brief that is neither in §10 of the brief, nor in §B above, nor in this list, is a defect if it is absent.** That is the whole of Rule 1.

The post-hoc `PLACEHOLDER / REAL` list in the brief is the right instrument pointed the wrong way. A list written after the build lets anything become a placeholder in retrospect. This list is written before.

---

## D · One boundary question, unanswered

`§13` sends the accepted visual/interaction target to Astra/Codex for production integration.

**What physically crosses that boundary?** Screenshots and a decision are not a handover. If what crosses is a self-contained Fable artifact, name now whether Astra reimplements it or consumes it, because reimplementation is a second full build of Mega Slice A and nobody has budgeted it.

This is not a blocker for the gate. It is a question that gets more expensive the later it is asked.

---

## E · How to use this

Either paste §A, §B and §C into the brief as new sections and re-commit, or hand this file to Fable alongside the brief. §B is written to be readable as a continuation of the brief's own §10.

```
STATUS        PROPOSAL
DECISION      none
IMPLEMENTATION none
TESTED        none
```
