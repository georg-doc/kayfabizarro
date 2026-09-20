# Postmortem · Birthday Astra Briefing Failure · 2026-09-15

**Status:** ARCHIVED INCIDENT + CURRENT LESSONS LEARNED  
**Scope:** ChatGPT Lead briefing quality for KFB visual/game-production slices  
**Audience:** current/future ChatGPT Lead chats, Astra/WSA handoff authors, Claude/Design handoff authors

## 1 · Incident in one sentence

The Lead briefing converted a rich, identity-bearing Birthday world/experience into a reduced technical vertical-slice checklist, then deferred several of the very elements that made the scene recognizably KFB/Birthday. Astra could therefore satisfy many written checks while producing a scene that was functionally incomplete, visually generic, interaction-poor, and far from Georg's intended experience.

## 2 · Concrete observed failure

The downstream build exposed that the briefing was not strong enough to protect the actual product intent:

- core world/set dressing was missing or reduced to placeholders;
- Audio D6 was deferred instead of treated as part of the Birthday identity;
- disco balls were deferred;
- lighthouse presence was conditional/weak instead of compositionally owned;
- Newton cradle and other specified world props/interactions were lost from the executable brief;
- characters read as placed on a menu/stage rather than living inside the world;
- character animation/liveliness was insufficiently enforced by evidence;
- Hihi Love-Hope was first too small and then shown without the expected KFB Cube-Pet face/eye/mouth treatment;
- fake/blob-like contact shadows passed too far into the process;
- curtain direction and interaction were under-specified, producing a cheap-looking reveal;
- Enter/loading/microinteraction feedback was not protected as a mandatory first-click sequence;
- the build could reach a purported P0/merge question while Georg still experienced basic loading/interaction failure.

This is primarily a **briefing and gating failure upstream**, not merely an implementation-quality problem downstream.

## 3 · Root causes

### A · “Vertical slice” was misapplied as “remove identity”

The Lead correctly preferred a vertical playable slice over architecture work, but then reduced the slice by moving identity-bearing scene elements to P1/P2.

That is the wrong optimization.

A vertical slice may simplify implementation depth, but it must remain **experience-complete**.

For this Birthday slice, the following were not generic garnish; they were part of the product proposition:

- the Birthday D6/music ritual;
- disco/stage energy;
- lighthouse/world landmark;
- defined interactive props such as the Newton cradle;
- living character performance;
- clear world placement rather than menu-card staging;
- tactile reveal/loading/microinteraction sequence.

**Lesson:** defer implementation sophistication, not identity-bearing experience.

Example:

- acceptable simplification: simple bounded fireworks instead of a full particle editor;
- unacceptable simplification: no fireworks/celebration beat at all when celebration is part of the intended scene grammar.

### B · Feature list replaced scene grammar

The briefing listed components but did not force a single end-to-end experiential sequence strongly enough.

A cold executor needs a literal timeline such as:

`cold load → immediate load state → Enter affordance → press feedback → audio arm → curtain opens sideways → camera reveals full world → set is already standing → characters already alive → D6/props visible → focus/select interaction → celebration → settle`

Without this, each feature can exist independently while the whole still feels broken.

**Lesson:** visual/game briefs need a **sequence contract**, not only a component checklist.

### C · No “world standing” inventory gate

The brief did not require a single complete evidence frame proving that the entire set, required props, actors and landmarks were present together before polishing.

This allowed partial compositions to advance.

**Lesson:** before animation/polish, require a `WORLD STANDING` frame with an explicit inventory checklist.

### D · P0/P1 labels were allowed to contradict product identity

The Lead moved D6, disco balls, fireworks and other elements into P1 on the theory that one track and a sparse world were sufficient for P0.

That created a technically small slice but the wrong product.

**Lesson:** P0 prioritization must ask:

> If this element is absent, does the experience still unmistakably read as the product Georg asked for?

If no, it is P0 even if the implementation is simplified.

### E · “Existing owner” caution overpowered user-visible outcome

The briefing repeatedly and correctly said not to create second owners for Travel light/audio/actors. But the protective architecture language was more explicit than the creative experience language.

A literal executor could therefore optimize for not violating owners while still under-delivering the scene.

**Lesson:** owner constraints are guardrails, not the product goal. Every owner paragraph must be subordinate to explicit visible/interactive acceptance criteria.

### F · Microinteractions were named but not operationalized

“Living UI”, “micro-interactions” and “in-place feedback” existed as quality language, but the brief did not initially define the exact state machine and timing obligations of the first click.

Therefore `Enter` could technically exist while feeling dead or broken.

**Lesson:** any important interaction needs a compact state contract:

`idle → hover/focus → press → busy/loading → success/reveal | recoverable failure`

and evidence proving each state.

### G · Character “animation” was not tied to visible acceptance

The briefing named Idle/Focus/Select/Celebrate states and had tested motion inputs, but downstream evidence could still show characters that read mostly static.

**Lesson:** state existence in code is not visual performance. Require a short capture proving visible motion quality, transitions and life.

### H · Asset identity was not fully protected

Hihi could be loaded as a raw Cube-Pet-like asset without the intended KFB EyeRig/mouth/face presentation.

**Lesson:** distinguish `source model` from `finished KFB actor owner`. Every hero actor must have a named render/presentation owner and visual identity acceptance.

### I · Merge/green gates were too technical

A large PR with passing tests reached a merge question while basic Georg-facing product acceptance was still clearly false.

**Lesson:** automated PASS can never imply `GEORG FREEPLAY PASS`. For experiential slices, merge/publish gates must include explicit human-facing evidence gates.

## 4 · The missing preflight: Briefing Red Team

The briefing should have been attacked before implementation.

Mandatory question:

> Given only this brief, what important part of Georg's intended product could a competent literal executor legally omit and still claim success?

If the answer includes any identity-bearing element, the briefing is not ready.

A second mandatory question:

> What would a cold executor actually build from this document, without access to chat intent?

The predicted build should be compared against Georg's intended scene before any large implementation starts.

## 5 · Future hard rule · Coverage before compression

Before summarizing a rich discussion into an execution brief, create an internal coverage matrix with at least:

`user decision/source → requirement → P0/P1/P2 → visible evidence → owner/source → allowed simplification → forbidden omission`

Compression is allowed only after every decision is represented.

A concise brief may be short in prose while still complete in coverage.

## 6 · Future hard rule · Identity-bearing P0 test

For every item proposed for P1/P2, ask:

1. Is it merely implementation sophistication?
2. Or does it carry the scene's identity, ritual, humour, world-reading or interaction promise?

If #2, keep a simplified version in P0.

## 7 · Future hard rule · World / Sequence / Life / Feedback

Every visual-game slice brief must separately specify:

### WORLD
What must visibly exist together in the scene?

### SEQUENCE
What happens from cold load through the primary loop?

### LIFE
What is moving/animating even when the player does nothing?

### FEEDBACK
What does every important input immediately do?

A brief lacking any one of these four sections is incomplete.

## 8 · Future hard rule · Evidence mirrors the product

Do not accept only:

- unit tests;
- console PASS;
- bindings;
- static source facts.

Require evidence matching the experience:

- full scene frame;
- cold-load-to-reveal capture;
- character-life capture;
- interaction capture;
- desktop + required mobile landscape;
- audio proof where audio is core;
- Georg freeplay before final acceptance.

## 9 · Briefing anti-patterns to reject

- “P0 is small, so move the fun/identity to P1.”
- “The code path exists, therefore the animation/interaction works visually.”
- “Preserve existing features” without an explicit inventory.
- “Living UI” without state/timing/evidence.
- “Use existing owner” without specifying the visible result that owner must produce.
- “Optional if safe” on a core compositional landmark without an accepted fallback.
- scattered corrections across many addenda without one current precedence entry.
- asking a downstream model to infer which historical user ideas were actually mandatory.

## 10 · Required external-agent Q&A gate for future large briefs

Before implementation, use independent narrow critics. They do not implement.

Recommended roles:

1. **Literal Executor Simulator** — reads only the proposed brief and describes exactly what it would build. Purpose: expose ambiguity and accidental omissions.
2. **Intent/Coverage Auditor** — compares the brief against current user decisions, source docs and handoffs. Purpose: identify missing or demoted requirements.
3. **Experience Director** — reconstructs the complete cold-load-to-settle user journey. Purpose: expose dead states, missing feedback and broken sequencing.
4. **Production Designer / Set Auditor** — inventories required world, props, spatial relationships and identity-bearing set dressing.
5. **Interaction & Failure-State Auditor** — checks hover/touch/press/loading/success/failure/retry/mobile states.
6. **Technical Contract Auditor** — checks owners, sources, compatibility claims and whether the brief accidentally creates new truths.

Then one **Synthesizer** receives only the critic reports plus the proposed brief and returns:

- ranked briefing defects;
- missing requirements;
- contradictions;
- accidental P0→P1 demotions;
- exact repairs;
- a revised brief or template.

The Builder must not be its own only critic.

## 11 · Status discipline

- **ARCHIVED HISTORY:** the original Birthday execution brief and its additive corrections explain how the failure happened; do not erase them.
- **DECISION:** current Birthday build requires a full experience reset, not incremental polish.
- **DECISION:** future substantial KFB briefs require external-agent red-team review before expensive implementation where practical.
- **DECISION:** identity-bearing elements cannot be deferred solely to make P0 technically smaller.
- **IMPLEMENTATION:** this postmortem changes no runtime.
- **TESTED RESULT:** none; these are process corrections derived from the observed incident.
