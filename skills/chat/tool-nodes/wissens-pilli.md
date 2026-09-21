# Project Node · DocCheck Wissens-Pilli / Interactive Microlearning

Status: UNVERIFIED PROJECT INTAKE
Kind: project
Updated: 2026-09-21

## Intended project path

`georg-doc/kayfabizarro/micro-learning/wissens-pilli/`

The path exists, but currently only contains a placeholder `demo` file. Do not claim a complete implementation SSOT/runtime from that alone.

## Current intake package

`travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`

Read first:

- `BRIEFING_STUDIO_Wissens-Pilli_Preparation_v0.1.md`
- `CONCEPT_Wissens-Pilli_WS0_SceneAssembly_v0.1.md`
- `DocCheck_Interactive_Microlearning_Living_Doc_v0.9.md` only for targeted design/history lookup
- `DocCheck_Interactive_Microlearning_Learning_Loops_Addendum_v1.0.md` for the current Adaptive Learning Loops / Loop Portals proposal

The inbox is input/staging, not the project SSOT. Follow `skills/chat/INBOX_PROTOCOL.md`.

## Product direction supported by the current intake

The living document describes a reusable interaction language and lightweight runtime for embedded DocCheck medical microlearning SPAs rather than isolated one-off mini-games.

Current target qualities include:

- embedded DocCheck content surfaces;
- roughly 1–3 minute interactions;
- no required LLM calls or heavy backend;
- medical concept first, with actual game-feel/visual polish;
- reusable scene/runtime patterns;
- calm editorial UI around one memorable interactive object.

Current WS0 concept: frameless 16:9 learning embed with themed background, Wissens-Pilli presenter, 1..n learning cards/media and one obvious CTA at each beat.

The current additive Learning Loops proposal extends this with:
- adaptive loop compression instead of repeating whole lessons;
- arbitrary entry through meaningful knowledge nodes;
- reusable Loop Portals into connected learning rooms;
- scheduled, contextual and exploratory recall;
- relation-level weak-spot tracking;
- a bounded Citric Acid Kitchen proof with Acetyl-CoA and NADH portal teasers.

This remains a conceptual proposal until the learner runtime owner and implementation SSOT are explicitly established.

## Current actor/tool boundary

The Studio preparation briefing names `CapsuleCarl` as the primary host asset and assigns KFB FrankenStein / Rigging Studio the actor-preparation slice.

Studio owns for this slice:

- source verification;
- face/eye/mouth ownership and cleanup;
- gaze targets / pointer-tracking-safe ranges;
- material/difficulty color zones;
- damage prop toggles;
- speech-bubble anchor;
- deformation-safe setup;
- exportable actor configuration;
- visual QA.

Studio explicitly does **not** own the learning app, cards, TTS engine or final animations.

Animation Lab is a later consumer for procedural/dynamic motion. The learner runtime consumes the prepared actor as presenter.

Do not copy FrizzleBob/Graft Driver measurements into CapsuleCarl. Existing actor contracts are vocabulary/architecture donors only until CapsuleCarl is measured.

## Relevant shared references

- `skills/chat/tool-nodes/frankenstein-studio.md`
- `skills/chat/tool-nodes/animation-lab.md`
- `skills/kfb-cartoon-animation_v2.md` for later animation/motion work
- `skills/chat/PRODUCTION_SOP.md`
- `skills/chat/EVIDENCE_AND_STATUS.md`

## Owner separation

FrankenStein Studio may prepare/export the presenter actor.

Wissens-Pilli runtime owns learner scene/card/interaction behavior once its implementation SSOT is established.

Animation Lab may later author/audit motion but must not become the learner runtime owner.

No Travel world/movement ownership transfers into this project merely because the intake package currently sits under a Travel mirror path.

## Promotion gate to CURRENT_PROJECT_SSOT

Before promoting this node from `UNVERIFIED`:

1. explicitly confirm the implementation owner/path/repository;
2. create a real project START/README/contract rather than relying on the inbox;
3. establish the current runtime/build entry point;
4. pin the accepted actor/tool inputs;
5. add current Return/test evidence;
6. state publication/privacy constraints for DocCheck use.

Until then, treat `micro-learning/wissens-pilli/` as the intended destination and the current inbox files as source material, not implemented truth.
