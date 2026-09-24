# POSTMORTEM · C0 Baukasten visual review FAIL · WSA handoff

**Date:** 2026-09-19  
**Status:** `TECHNICAL TEST PASS · GEORG VISUAL REVIEW FAIL · NOT ACCEPTED`  
**Repository:** `georg-doc/kayfabizarro`  
**C0 branch:** `chatgpt-web/baukasten-c0-2026-09-19`  
**C0 PR:** #101 · OPEN at review time · no auto-merge  
**C0 review head before this postmortem:** `719f8f7b84d5ee604789b56705269c7286fa9241`  
**Current GitHub main observed during postmortem:** `66ec6de533944334ba74aba0217561b923e79254`  
**Public Stage evidence route:** https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/baukasten-c0/

## EXECUTIVE RESULT

C0 is **not accepted as a visual Baukasten / measurement presentation**.

The previous automated results remain valid only for what they actually tested: source wiring, loading, counts, basic browser execution, raw bounds and absence of console/runtime errors. They do **not** prove correct visual scale, useful human comparison, good animation, collision-free prop motion, or UI/UX continuity with the existing KFB Atlas/Lab tools.

The central mistake was allowing a green technical state such as `MODULE MOUNTED · MEASURED · BROWSER SEEN` to read like a visual acceptance signal.

## GEORG REVIEW · OBSERVED FAILS

The following are human review findings from the 2026-09-19 Stage review. They override any implication that the C0 presentation is ready for acceptance.

### F1 · The review page does not answer the human question

Observed:

- the reviewer could not tell what exactly should be accepted;
- numeric XYZ/base/pivot values did not make the intended visual decision easier;
- the page foregrounded provenance/measurements instead of direct visual comparison.

Impact:

- C0 is useful as machine-readable evidence, but not as the shared visual review surface it was supposed to become;
- the next H01/D01 gate is blocked.

Disposition:

- **REJECT current C0 review layout as acceptance UI**;
- keep exact measurements as secondary inspector data only.

### F2 · Relative scale proof is visually invalid

Observed:

- the Clown set reads much too small relative to isolated characters / props;
- C0 does not provide one shared world-space comparison stage.

Confirmed implementation cause in C0:

- `Viewer.frame(root)` computes a bounding sphere **per proof card** and auto-fits that object/group to its own viewport;
- the Resident proof calls `viewer.frame(handle.root)`, so the camera fits the entire vignette — clown, balloons, hoop, ball, podium and props;
- the FrizzleBob proof frames the assembled figure separately;
- therefore screen-space size across cards is intentionally normalized independently and **cannot be used to judge relative world scale**.

Additional measurement mistake:

- C0 reports `7.768 × 4.632 × 4.606` for the **whole Resident vignette**, not the Clown actor height;
- that number is therefore not a useful character-scale anchor.

What is **not** proven:

- this C0 page alone does not prove that the source Clown model itself is authored at the wrong scale;
- it proves that the C0 comparison method is unsuitable for answering the scale question.

Disposition:

- **INVALIDATE C0 relative-scale acceptance**;
- next proof needs one floor, one camera, one world scale, and side-by-side actor/prop/module references.

### F3 · Clown juggling is visually broken

Observed by Georg:

- arms appear not to participate convincingly in the juggling;
- clubs rotate/pass through the body;
- the result does not read as a valid juggling performance.

Relevant owner code:

- `tools/resident_atlas_s6/lib/atlas.js` builds `juggle-cascade-v1`;
- arms are restored to a base pose each frame and then targeted procedurally by CCD;
- club motion is generated from current hand positions using hand-to-hand interpolation + vertical arc + spin;
- there is no body-volume avoidance or club-mesh-vs-body clearance solver in that motion path.

Important prior evidence that C0 failed to respect:

`tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/BACKLOG.md` already kept all of these as OPEN visual gates:

- whether the paths read as a cascade;
- catches without teleport/pop;
- arm motion without visible twist;
- actual club mesh/vertex surface clearance;
- the backlog already records a browser screenshot with club geometry entering the head/upper-torso silhouette.

The prior low arm-target residual is therefore **not a visual-quality proof**. It measures target-solving residual, not whether the arm motion reads naturally or whether the club geometry clears the body.

Disposition:

- **`juggle-cascade-v1` remains NOT ACCEPTED**;
- do not use C0 technical mounting as evidence that the activity is ready for a consumer;
- fix/review this inside the existing Resident Atlas owner lane before further consumer promotion.

### F4 · Technical PASS was incorrectly presented as visual proof

C0's final state currently considers a proof successful when its evidence string contains `BROWSER SEEN` and no runtime error exists.

The public Stage proof likewise checks:

- page HTTP / boot;
- expected pack/card/proof counts;
- zero runtime/page/console errors.

Those are useful regression checks. They do not inspect:

- relative scale against another object in the same world;
- arm motion quality;
- club/body intersections;
- useful composition/framing;
- KFB UI continuity;
- Georg acceptance.

Disposition:

- retain the automated tests as **TECHNICAL TESTED RESULT**;
- remove any wording that implies `5/5 BROWSER PROOFS` means five accepted visual proofs;
- human visual review must remain its own status.

### F5 · C0 invented another UI instead of reusing KFB tool language

Observed:

- the C0 page introduces a new bespoke catalog/dashboard UI;
- it does not visually or interaction-wise read as part of the existing Resident Atlas / Environment-World Atlas / Plant Prop Lab family.

Existing donors that should have been consulted before C0 composition:

1. **Resident Atlas S6**
   - source: `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
   - current blob observed: `0984b7d0ac354d0203c3fd523f9a6eef0645a53e`
   - stage-dominant viewer, compact header controls, optional layers, right-side inspector, QA overlay, clean inspection modes.

2. **World / Environment Atlas**
   - source entry: `tools/world_atlas/index.html`
   - current blob observed: `abaadf7b57abce7f3f8277dd943d96454f7c8b9f`
   - established Kit Lab / measured-environment authoring family; source pages reuse the shared Kit Lab geometry tooling rather than creating a new catalog runtime.

3. **Plant Prop Lab v2**
   - current reviewed candidate source:
     `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/index.html`
   - current blob observed: `ce6ad063a3c68c298c550ec173a1d23a4aa586d1`
   - explicitly derives its shell from `ref/ui-split-shell.html`;
   - stage is the work, controls are secondary;
   - supports panel open/closed, clean view, `Erstbeweis`, compact legend, visual presets and inspector detail behind the stage.

Dropbox contains the same current Plant Prop Lab v2 export under:
`/CLAUDE/KFB KayKit Plant Toon Atlas v1/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2`.
GitHub remains SSOT.

Disposition:

- **do not evolve the bespoke C0 shell**;
- next visual proof must reuse an existing KFB Atlas/Lab shell pattern.

### F6 · Acceptance granularity was wrong

C0 mixed three different jobs on one page:

- source/provenance catalog;
- measurement/debug inspector;
- visual acceptance stage.

This made the page dense while still failing the actual visual decisions.

Disposition:

- keep provenance and exact paths available but secondary;
- visual comparison belongs on one stage;
- source/measurement detail belongs in inspector/expandable evidence;
- acceptance should ask one visual question at a time.

### F7 · Stage publication status was truthful technically but misleading product-wise

The Cloudflare route genuinely loaded and the public browser QA genuinely passed. Publishing to Stage was not itself the error.

The error was allowing `PUBLIC DEPLOYMENT PASS` + `5/5 BROWSER PROOFS` to dominate the presentation while `GEORG ACCEPTANCE` was still unresolved and while the Resident visual QA was already known to be open.

Disposition:

- keep the Stage route as failure/recovery evidence;
- mark the candidate **HOLD / GEORG REVIEW FAIL**;
- do not promote its layout or Resident activity as a shared basis.

## ROOT CAUSE

### RC1 · Optimized for machine-verifiable evidence instead of human visual judgment

The implementation successfully proved exact source identity and browser measurements, but that became the primary information architecture.

### RC2 · No shared-scale visual experiment

Independent auto-framing made cross-card scale comparison impossible by construction.

### RC3 · Existing OPEN Resident visual gates were not propagated into C0 status

The Resident handoff already said trajectory/catch/arm/clearance review was still open. C0 only tested that the module mounted and advanced.

### RC4 · Visual-success semantics were too weak

`loaded + measured + no console error` was treated as `browser proof`. For animation/scale/UI this is insufficient.

### RC5 · Donor reuse stopped at runtime seams, not presentation seams

C0 correctly reused the Asset Registry, Resident module and Graft runtime seams, but failed to reuse the established Atlas/Lab presentation language.

## WHAT REMAINS REUSABLE

Do **not** throw away the whole C0 branch.

Keep:

- central Asset Registry usage;
- exact source paths / revisions / blob identity;
- no copied source assets;
- Tiny Treats source-truth correction, including House Plants `LOOSE SCENERY · STRUCTURAL UNKNOWN`;
- technical browser regression suite, renamed/understood as technical only;
- fixed Stage route as recovery evidence;
- FrizzleBob Graft source/contract wiring, while visual acceptance remains separate;
- reference-only exports.

## WHAT IS INVALIDATED / MUST NOT BE PROMOTED

- current C0 visual review UI;
- cross-card scale judgments;
- whole-vignette bounds as a Clown scale proxy;
- `5/5 BROWSER PROOFS` as an acceptance signal;
- `juggle-cascade-v1` as accepted Resident activity;
- any H01/D01 continuation that assumes C0 visual acceptance;
- any new standalone UI family derived from this C0 page.

## SMALLEST NEXT PROOFS FOR WSA

These are proposals only; nothing here authorizes implementation.

### A · Resident activity repair proof first

Owner lane: Resident Atlas.

One Clown, one neutral floor, one fixed camera, the three exact clubs. Show:

- arms visibly throwing/catching;
- club trajectory from three-quarter and side view;
- no club mesh through head/torso;
- pause/scrub or slow-motion inspection;
- before/after evidence;
- one human visual gate.

Do not involve Platformer, Race, H01 or D01 yet.

### B · Shared-scale comparison proof after A

Use one shared world-space stage and one camera. Place:

- exact Clown actor;
- one known Rig_Medium character / FrizzleBob Driver reference;
- one small prop;
- one medium prop;
- the complete Clown vignette.

No per-item camera fit. Include grid/ruler only as secondary visual support. The decision should be possible by looking, without reading XYZ numbers.

### C · UI shell correction only after A/B

Reuse the existing Atlas/Lab shell language:

`stage dominant → compact top controls → optional right inspector → clean view`.

Plant Prop Lab v2's `Erstbeweis` pattern is especially relevant for side-by-side visual acceptance. Do not create a fourth KFB tool-shell language.

## STATUS SPLIT AFTER REVIEW

- `PROPOSAL`: next proofs A/B/C only.
- `IMPLEMENTATION`: existing C0 branch still exists.
- `TESTED RESULT`: technical C0 QA PASS remains historically valid.
- `PUBLIC DEPLOYMENT`: Cloudflare Stage PASS remains historically valid.
- `GEORG ACCEPTANCE`: **FAIL · NOT ACCEPTED**.
- `OPEN`: Resident animation repair, shared-scale proof, UI-shell reuse.
- `ARCHIVED HISTORY`: previous green technical runs are retained, but must not be read as visual approval.

## ONE OPEN HUMAN REVIEW QUESTION

**Should WSA take only the Resident-Clown activity repair as the next bounded slice before any C0.1 scale/UI work continues?**
