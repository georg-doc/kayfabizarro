# TEST PLAN · KFB ChatterBox v1

Status: PLANNING
Date: 2026-10-05

## Static / data

1. `TRIPLET_POOL_SEED_20.json` parses.
2. Exact seed count = 20.
3. Triplet IDs unique = 20.
4. Signature distribution = 4 global + 4 Lorekeeper + 4 Goth Girl + 4 Clown + 4 Witch.
5. Relation set is limited to CATEGORY_SHIFT / ESCALATION / COLLISION / MISFIT / SYNERGY.
6. Curator schema parses.
7. Curator records cannot replace Quote Pool canonical fields.
8. Curator records cannot contain Resident Lean Card dialogue fields.
9. Current Lean Card language owner remains `ChatterBox + shared Triplet pool`.
10. Existing kernel remains external; no copied/forked adapter owner.
11. LLM Dialogue Lab extension contract is present and referenced by START_HERE / Work brief / Site packet.
12. Site packet parses as JSON and declares product name **KFB ChatterBox**.
13. Real-3D Resident source remains Resident Atlas; cutout/sprite actor substitutes remain prohibited.
14. Audio contract declares KFB Audio/mixer as ducking owner and forbids a second AudioContext.

## Site / browser baseline

- search/filter;
- review state transition;
- edit + undo/reset to source;
- Web Chat batch import;
- invalid import rejected with useful errors;
- quote-ID lookup;
- unresolved quote visibly blocked from runtime approval;
- pair preview deterministic for same seed;
- SILENCE valid;
- responsive bubble preview;
- Bubble adapter failure quarantinable;
- full export/import reload;
- mobile/narrow layout;
- zero page errors.

## LLM Dialogue Lab · first acceptance experiment

### Fixed pair

**Goth Girl ↔ Clown**

Use the same scene/Card/quote context and, where the provider allows it, the same seed/temperature envelope.

Each run:
- 8–12 dialogue turns;
- Triplet-native output, not long-form prose;
- one player intervention using either a free Triplet or KayfaBOGGLE?/BLÖDSINN!;
- real 3D actors + EyeRig v6;
- speech/thought bubble rendering;
- browser TTS;
- existing Audio-owner ducking;
- session log;
- Critic report.

### D0 · deterministic baseline

Run the existing PR #305 deterministic adapter on the same pair/scene.

Record:
- chosen Triplet IDs;
- relation/transform diversity;
- SILENCE behavior where applicable;
- provenance.

### L0 · shared-agent baseline

One model, one shared conversation context containing both Resident clamps.

Purpose:
measure the default tendency toward voice collapse.

### L1 · isolated Resident agents

Same base model as L0, but:
- separate Resident A and Resident B contexts;
- each gets its own Lean Card/voice clamps;
- only required shared scene state + latest turn cross the boundary.

Purpose:
test whether **context isolation alone** materially improves distinctness.

### L2 · model-diverse Residents

Optional, not a required first gate.

Run only if L1 still shows material voice collapse.

Different model/profile per Resident may then be compared against the same scene.

Purpose:
determine whether remaining monotony is model-level rather than orchestration-level.

## Voice-distinctness measurements

For L0 and L1 capture at minimum:
- lexical overlap between speakers;
- repeated phrase rate;
- repeated semantic move rate;
- Triplet reuse rate;
- unique vocabulary per Resident;
- sentence-length profile per Resident;
- relation/transform diversity;
- character-clamp violations;
- Critic voice-distinctness score;
- Critic semantic-loop flags;
- Georg KEEP/TUNE/CUT counts;
- latency;
- token/cost metadata when exposed.

These measurements are evidence for editorial judgment, not an automatic quality oracle.

## Critic / Repair checks

Second LLM agent must be **non-speaking**.

It evaluates:
- Resident voice distinctness;
- repetition / semantic loops;
- Triplet integrity;
- turn causality;
- Card/deck relevance;
- Lean Card clamp violations;
- Fluff-o-lect compatibility;
- comic/cartoon dialogue economy;
- exposition density;
- generic filler;
- speech-vs-thought suitability;
- **bold** / *italic* emphasis conventions.

Repair requirements:
- original transcript remains immutable evidence;
- repair creates a new revision;
- prompt/guardrail changes are separately logged;
- strong outputs may become candidate Triplets/clusters;
- failed patterns may become durable negative tests;
- no generated item becomes runtime-approved automatically.

## Reaction / choreography checks

At minimum test:
- What the FLUFF?!
- Stay fluffy!
- KayfaBINGO!
- KayfaBONGO!
- KayfaBOGGLE?
- BLÖDSINN!
- silent/thought reaction.

For each, verify references can be passed to existing:
- body animation;
- face expression;
- EyeRig eyelid/brow/pupil/gaze;
- bubble type;
- SFX/VFX.

No new animation owner is created.

## 3D / bubble / camera checks

Using exact Resident Atlas 3D actors:
- free Orbit camera;
- desktop;
- split viewport;
- narrow/mobile;
- face remains visible when reasonably possible;
- bubble avoids covering speaker/listener body where possible;
- tail/anchor remains readable;
- bubble faces camera appropriately;
- edge clamping works;
- two bubbles do not collide catastrophically;
- streaming text growth does not cause violent relayout;
- thought vs speech bubble remain distinguishable.

## TTS / Audio checks

- browser `speechSynthesis` can audition both Residents;
- voice mapping is session metadata, not canon;
- TTS emits voice activity;
- current KFB Audio mixer performs ducking;
- music timeline continues while ducked;
- no second AudioContext;
- bubble streaming / mouth/emphasis adapter receives timing events where available.

## Acceptance fixtures

Primary deterministic fixture:
Goth Girl × Clown × `forget_utopia#11` The Standing Ovation.

Secondary deterministic:
Witch × Clown × `ignore_dystopia#30` The Cortisol Economy.

Regression:
Goth Girl × Witch × `ignore_dystopia#1` The Doomsday Clock.

Primary live LLM fixture:
Goth Girl ↔ Clown, same scene seed, D0 vs L0 vs L1.

## Decision rule for per-Resident models

Do **not** introduce per-Resident base models merely because L0 sounds monotonous.

First compare L0 vs L1.

Proceed to L2 only when:
- L1 still shows repeated voice collapse or clamp violations that are materially worse than desired;
- the problem cannot be repaired with prompt/context isolation without damaging dialogue quality;
- the added model complexity/cost has a measurable editorial benefit.

## Evidence rule

Automated checks prove mechanics/data integrity only.
Critic scores are diagnostic evidence only.
Georg's PASS/TUNE/FAIL is the editorial usability gate.

No public Stage is required merely to test schema or internal data.
