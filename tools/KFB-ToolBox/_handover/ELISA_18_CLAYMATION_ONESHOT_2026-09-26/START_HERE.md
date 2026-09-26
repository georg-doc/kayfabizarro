# KFB Elisa 18 · Autonomous Claymation One-Shot · INPUT HANDOVER

**Status:** READY FOR FRIZZLEBOB INPUT FREEZE · EXECUTION NOT STARTED  
**Date:** 2026-09-26  
**Human:** Georg  
**Owner:** Elisa 18 cinematic consumer input handover only  
**Repository:** `georg-doc/kayfabizarro`  
**Planning branch:** `planning/elisa-18-claymation-film-v1-2026-09-26`

## Purpose

This folder is the small frozen-input handover for the autonomous Elisa 18 birthday-film run.

It does not create a new FrizzleBob owner and does not revive the archived Birthday runtime.

The production contract lives at:
`skills/chat/workflows/KFB_ELISA_18_CLAYMATION_FILM_V1_2026-09-26/MASTER_PROMPT.md`

## Required input

Georg exports the newly rendered Studio profile here:

`profiles/frizzlebob.georg-2026-09-26.json`

That exact file becomes the **run-frozen FrizzleBob input** for this one-shot.

It is not automatically promoted to the global canonical FrizzleBob profile.

Optional evidence may be placed beside it:
- `refs/frizzlebob-preview.png`
- `notes/export-notes.md`

Do not substitute an older FrizzleBob profile if the required JSON is absent.

## Autonomous execution rule

Once the required JSON exists, WSA should execute the film end-to-end without routine human micro-gates:

1. recon current GitHub owners and freeze inputs;
2. internal source-isolation / rig / look preflight;
3. script / timing / animatic;
4. scene assembly, rigging integration, animation, lighting, camera and transitions;
5. TTS / music / Foley / mix;
6. deterministic capture;
7. independent Critic QA;
8. silent targeted repair and re-review;
9. final candidate.

The internal preflight is evidence, not a human approval stop.

The intended first human review is the **finished candidate**, unless a hard missing-source/runtime blocker or the repository-wide two-repair stop rule is reached.

## QA separation

The Production Agent may not self-certify final quality.

Use a separate Critic context/agent/model when the execution environment supports it. The Critic checks source fidelity, rig integrity, clay/paper look, animation, camera, transitions, compositing, story clarity, audio and technical errors.

Failed criteria return only to targeted repair. Preserve passing work.

After two failed repair passes on the same gate, freeze the candidate and create the standard failure-recovery export rather than starting a third pass.

## Human acceptance / publication

No Live promotion is authorized by this handover.

Any human review URL must be a direct `https://kayfabizarro.pages.dev/…` route linked from KFB Hub and visibly proven at the intended revision.
