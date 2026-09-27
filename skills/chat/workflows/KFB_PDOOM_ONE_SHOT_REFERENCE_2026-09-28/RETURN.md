# KFB PDoom / One-Shot Animation Reference · RETURN

**Date:** 2026-09-28  
**Status:** RESEARCH ANALYSIS COMPLETE · ROUTED CURRENT_REFERENCE CANDIDATE · NO STAGE  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `research/pdoom-one-shot-reference-2026-09-28`  
**Owner:** KFB Chat Production Router / reusable production research  
**Stage:** none; no public/human review surface required

## Outcome

Created a source-backed reusable analysis of:
- PDoom visual/story design;
- animation and camera grammar;
- deterministic coded-animation architecture;
- render/QA tooling;
- one-shot / autonomous prompting patterns;
- explicit differences between PDoom's 2D medium and current KFB clay/3D rules.

Primary document:
`skills/chat/workflows/KFB_PDOOM_ONE_SHOT_REFERENCE_2026-09-28/CASE_STUDY.md`

Entry:
`skills/chat/workflows/KFB_PDOOM_ONE_SHOT_REFERENCE_2026-09-28/START_HERE.md`

## External source state verified

### JohnHeibel/PDoomVideo

Inspected current head:
`fa546a38092e75f2b079e6a86d6abc54dd525d17`

Commit message:
`Update README.md with osmarks interpretation`

Head timestamp returned by GitHub:
2026-09-25T15:11:03Z

Checks:
- repository head: **1 / 1 verified**
- core production docs: **3 / 3 inspected**
  - README
  - ANIMATION_GUIDE
  - STORYBOARD
- technical surfaces: **5 / 5 inspected**
  - src/core.js
  - src/timeline.js
  - studio.html
  - render.mjs
  - package.json
- chapter roster: **9 / 9 current chapter files located**
- detailed chapter samples: **2 / 2 inspected**
  - c03_takeoff.js
  - c09_finale.js

### JohnHeibel/ClaudeAnimationBase

Inspected because PDoom README explicitly identifies it as the generalized/reliable successor.

Checks:
- README: **PASS**
- expanded ANIMATION_GUIDE: **PASS**
- explicit LICENSE: **PASS**
- license text begins `MIT License`.

This supports the inference that the author deliberately extracted a reusable coded-animation workflow from the PDoom experiment.

### Prompt / post context

Georg supplied:
https://x.com/donaldjewkes/status/2102801469976248500

Direct X retrieval was unreliable during analysis. Public indexed/mirrored text was used to inspect the prompt. Claims such as “one prompt” and reported autonomous duration are therefore recorded as **CREATOR / POST CLAIM**, not repository-verified implementation facts.

## Current KFB sources checked before writing

Read current GitHub state for:
- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/LIVING_MASTERPLAN.md`
- `skills/chat/REGISTRY.json`
- `skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`
- `skills/chat/PRODUCTION_SOP.md`
- `skills/kfb-cartoon-animation_v2.md`

Result:
**8 / 8 current coordination/canon references inspected**

Base head used for branch:
`7bd27b3d281911670250d6adad8f02e04412e149`

## Main findings

### Design
- build one framing world rather than unrelated clips;
- reuse sets/motifs and escalate them;
- plan global colour/scale/light arcs;
- keep text subordinate to visual acting;
- design opening hook and ending callback;
- reserve attention/safe areas during composition.

### Animation
- every shot must contain a meaningful event;
- time explicit viewer reads;
- fast action can coexist with held meaning;
- check semantic keyposes before interpolation;
- emotion changes are choreographed transitions;
- camera actions need purpose;
- storyboard the exit transition of every shot;
- finales should pay off known motifs.

### Tech
- deterministic time-driven capture enables parallel/out-of-order inspection;
- isolate scene/chapter writers behind a stable shared core;
- treat the production guide as an agent-readable API;
- make contact sheets / strips / crops / clips cheap;
- distinguish offline-film quality budgets from interactive game budgets;
- centralize capture/audio/compositor transport.

### Prompting
- “one-shot” means one human delegation, not one internal pass;
- specify destination/taste/source truth strongly while leaving implementation freedom;
- expose available capabilities without exposing credentials;
- establish style/production grammar before scaling;
- storyboard internally and continue without pseudo-human gates;
- explicitly require whole-output review and bounded repair;
- state resource envelope and stop conditions.

## KFB deltas proposed, not canonized

Potential reusable additions:
1. timed **viewer reads** in cinematic shot briefs;
2. explicit **OUT transition** per shot;
3. keypose-sheet before interpolation;
4. deterministic film-clock / reproducible capture contract;
5. contact-sheet → motion-strip → detail-crop → short-clip QA ladder;
6. one machine-readable production guide for subagents;
7. human one-shot + internal multi-pass as a named workflow pattern.

These remain reference proposals until adopted by the relevant owner.

## Protected KFB rules

Not changed:
- one owner per mutable concern;
- one mixer per animated actor where applicable;
- source geometry/asset identity remains stable;
- no random permanent wobble;
- current KFB motion hierarchy remains semantic;
- no external-generated replacement for verified KFB actors/assets;
- no human pseudo-gates;
- two failed repair passes on the same gate still trigger recovery/export.

## License/provenance note

PDoom `package.json` declares `ISC`, but no root LICENSE file appeared in the inspected repository root.

The linked successor `ClaudeAnimationBase` has an explicit MIT LICENSE.

This slice therefore treats PDoom as a **research/reference source**, not as a code donor. Any later code-level reuse requires its own provenance/license check.

## Runtime / Stage evidence

None.

This slice did not:
- run PDoom locally;
- publish a KFB Stage;
- build a KFB film;
- change an implementation runtime;
- create a Georg review gate.

That is intentional: the requested outcome is durable analysis/reference documentation.

## Routing / metadata closure

Completed on this branch:
- Registry entry: `kfb-pdoom-one-shot-reference-2026-09-28`;
- `START_HERE.md` router pointer;
- additive `CHANGELOG.md` entry;
- KFB Hub **Reference** briefing card;
- no Todo/P0 task and no Stage link.

The Hub card is intentionally a reference surface, not a Georg gate.

## Static closure checks

**12 / 12 PASS**

1. three reference documents exist;
2. Registry JSON parses;
3. Registry entry is present;
4. main router link is present;
5. additive changelog entry is present;
6. Hub reference card is present;
7. Hub inline JavaScript parses syntactically;
8. repository facts / creator claims / KFB inferences are separated;
9. design / animation / tech / prompting sections are present;
10. explicit non-adoption safeguards are present;
11. Elisa one-shot application is documented;
12. no Stage claim is present.

Current `main` verified during closure:
`7bd27b3d281911670250d6adad8f02e04412e149`

The branch was **7 commits ahead / 0 behind** immediately before this Return update.

## Next productive use

No new review gate.

Future coded-animation / autonomous cinematic work should load this reference when useful, then apply its portable patterns inside the actual project owner. The first concrete consumer can be the Elisa 18 one-shot when its frozen FrizzleBob Studio input is ready.
