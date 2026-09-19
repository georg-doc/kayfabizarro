# POSTMORTEM · C0 briefing ambiguity + intent resolution + execution failure

**Date:** 2026-09-19  
**Status:** `POSTMORTEM · GEORG VISUAL REVIEW FAIL · PROCESS CORRECTION`  
**Owner lane:** Resident Atlas / C0 consumer evidence  
**Integration lead:** WSA unchanged  
**Repository:** `georg-doc/kayfabizarro`

## Executive finding

The C0 failure was not one bug.

It had three layers:

1. **BRIEFING GAP** — the C0 briefing required a “small visual catalog”, previews and measurements, but did not define the human visual comparison question tightly enough.
2. **INTENT-RESOLUTION FAIL** — the implementation recognized multiple evidence requirements but did not stop and resolve whether Georg needed an asset-inspector catalog or a shared visual-comparison stage.
3. **EXECUTION FAIL** — the chosen implementation optimized for source/measurement evidence, introduced a bespoke UI, used independent auto-framing, and treated technical browser evidence too close to visual proof.

The correct recovery is therefore not “fix the numbers” or “scale the clown up”. It is to repair the owner activity first, then prove scale on one shared stage, then reuse an established KFB Atlas/Lab shell.

## Exact briefing state at C0 start

C0 was based on:

- base commit: `5650b6c54d8789b20ea80abe857688173d506d3b`;
- briefing file: `skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md`;
- briefing blob at that base: `4e2a3f6e0b4fe4cb2ed13336afc5f1b0e170fd6c`.

The briefing said:

- build a **small visual catalog**;
- show exact path/source;
- show preview / rotatable single view;
- show measurements, bounding box, pivot, base and scale anchor;
- classify roles and evidence status;
- shortest path: `Pack → family → part → measurement evidence → usable in Dungeon / Hex / Combat`.

Those are valid requirements, but they did **not** state:

- relative actor/prop scale must be judged on one shared world-space stage;
- per-object camera auto-fit must not be used for scale acceptance;
- whole-vignette bounds must never substitute for actor height;
- the review question for `bewohnt` includes visible activity quality;
- existing Resident visual OPEN gates must remain visibly blocking in C0;
- the existing Resident Atlas / World Atlas / Plant Prop Lab shell is the required presentation donor.

## What was materially ambiguous

Two reasonable outputs fit the original words.

### Interpretation A · evidence catalog

A technical catalog with:

- pack cards;
- exact paths;
- measurements;
- isolated previews;
- evidence status.

### Interpretation B · visual Baukasten comparison

A stage that lets Georg answer by looking:

- are actors/props/modules coherent in relative scale?;
- do donor families visually belong together?;
- is the Resident activity good enough to reuse?;
- does this look/behave like the established KFB Atlas/Lab family?

The implementation silently chose A.

That was the key intent-resolution failure.

The correct process response would have been:

`INTENT AMBIGUOUS → state human review question → resolve before layout/runtime implementation`.

## Execution failures

### E1 · Human review question was never made explicit before implementation

The slice stated source/measurement deliverables, but not the actual visual acceptance question.

Result: technical completeness became the de facto design target.

### E2 · Donor runtime reuse happened; donor presentation reuse did not

Correctly reused:

- central Asset Registry;
- Resident Scene Module mount seam;
- FrizzleBob Graft seam.

Failed to reuse before designing:

- Resident Atlas shell / inspector language;
- World Atlas / Kit Lab presentation;
- Plant Prop Lab v2 split-shell / Erstbeweis pattern.

Result: another KFB UI family appeared.

### E3 · Relative scale proof was invalid by construction

C0 used per-card `Viewer.frame(root)` auto-fit.

Therefore:

- Clown vignette camera fits balloons, hoop, ball, podium and props;
- isolated actors fit only themselves;
- screen-space size across cards is normalized independently;
- cross-card visual scale cannot be judged.

The reported Resident `7.768 × 4.632 × 4.606` was whole-vignette bounds, not Clown actor height.

### E4 · Known Resident visual OPEN gates were not propagated strongly enough

Before C0, Resident Scene Module backlog already kept OPEN:

- cascade readability;
- catches without teleport/pop;
- arm motion quality;
- actual club mesh/body clearance.

C0 proved only that the module mounted, advanced and produced no runtime errors.

It should never have presented that as a green visual witness.

### E5 · Animation quality was outside the technical test

The public/browser checks verified:

- load/boot;
- expected nodes/cards;
- activity presence/advance;
- no page/console errors.

They did not verify:

- convincing throw/catch arm motion;
- club mesh clearance from head/torso;
- silhouette readability;
- motion timing as perceived by a human.

Georg's review found those failures immediately.

### E6 · First chat return under-delivered the agreed review surface

The first return exposed the Stage path in code formatting and initially described a target before providing a clearly clickable, verified KFB review link.

That violated the practical review expectation even though it was later corrected with a real Cloudflare public proof.

### E7 · Public technical PASS read too prominently relative to acceptance status

`PUBLIC DEPLOYMENT PASS` and `5/5 BROWSER PROOFS` were technically true but semantically too strong for the visual state.

The later correction to:

`TECHNICAL TEST PASS · PUBLIC STAGE PASS · GEORG VISUAL REVIEW FAIL · NOT ACCEPTED`

is the correct status split.

## Briefing gap vs execution responsibility

The briefing gap is real, but it does not transfer responsibility to Georg.

The implementation had enough signals to stop and resolve intent:

- “visual catalog”;
- human review requirement;
- anti-slop donor-first rules;
- existing Atlas/Lab tools;
- Resident visual QA already OPEN.

The execution should have surfaced the ambiguity instead of silently choosing an evidence-dashboard interpretation.

## Source drift discovered during recovery

Current `main` has since expanded the modular-minigame briefing:

- C0 now names eight Tiny Treats packs rather than the six present at the original base;
- Plant Prop Lab v2 is explicitly named as a scenery donor;
- D01/H01/C01 original execution briefs are superseded by newer generator/integration briefs.

This later drift must not be retroactively presented as what C0 originally implemented.

Historical C0 remains tied to its base revision.

## Reusable work

Keep:

- exact source/provenance wiring;
- central Registry use;
- no copied source assets;
- Tiny Treats classification work;
- browser regression checks as technical checks;
- Cloudflare failure/recovery evidence;
- Resident module seam;
- FrizzleBob Graft seam.

Do not promote:

- C0 bespoke UI;
- per-card scale comparison;
- whole-vignette bounds as actor scale;
- `BROWSER SEEN` as visual acceptance;
- current `juggle-cascade-v1` as accepted;
- H01/D01 work that assumes C0 visual acceptance.

## Process correction

New binding reference:

`skills/chat/BOUNDED_PRODUCTION_SLICE_CONTRACT.md`

The added rule is the missing one:

> Before implementation, state the human review question. If multiple materially different interpretations remain plausible, do not silently choose one.

## WSA recovery sequence

1. **Resident-Clown Activity Repair R0** in the Resident Atlas owner lane.
2. Shared-scale comparison stage only after R0 is visually acceptable.
3. C0 presentation rebuild only after 1–2, reusing an existing Atlas/Lab shell.

## Georg sequencing decision

Georg accepted **Resident-Clown Activity Repair R0 as the sole next implementation slice** on 2026-09-19.

Implementation remains not started; this decision does not pre-accept the repaired activity.

## One next gate

**After R0 implementation: do the arms, catches and three club paths read as believable juggling without clubs visibly crossing the Clown's head/torso?**
