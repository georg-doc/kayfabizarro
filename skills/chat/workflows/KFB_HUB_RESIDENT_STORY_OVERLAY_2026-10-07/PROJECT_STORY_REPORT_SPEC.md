# PROJECT STORY REPORT SPEC · KFB Making-of / Technical Chronicle

Status: **SPECIFICATION / SEED**
Audience: developer, future maintainer, researcher, LLM narrator, later public behind-the-scenes reader.

## Goal

Create one durable KFB project chronicle that can be both:
- densely machine/technician readable; and
- projected into an engaging character-guided story.

The chronicle must explain not just *what exists*, but *how it came to exist*: forks, false starts, constraints, reversals, recovered work, postmortems, rejected paths and lessons.

## Canonical forms

### 1. Corpus
Machine-readable event records using `PROJECT_STORY_CORPUS_SCHEMA.json`.

### 2. Dense technical report
Long Markdown built from the corpus. Facts first, citations/source refs inline.

### 3. Narrative views
Derived, disposable renderings:
- chronological;
- Hero's Journey;
- “failure → recovery”;
- “module family tree”;
- “why this design exists”;
- “what we threw away”;
- “FrizzleBob tells the making-of”.

No narrative view becomes source-of-truth.

## Event granularity

One event is a meaningful change in project state, not every commit.

Good event:
- a new runtime owner;
- a human PASS/TUNE/FAIL;
- a source donor accepted/rejected;
- a rollback or postmortem;
- an architectural rule;
- a module crossing from experiment to reusable donor;
- a public/site acceptance;
- a feature being deliberately killed or deferred.

Bad event:
- typo fix;
- routine generated file;
- repeated handoff that adds no new fact.

## Required event fields

- stable event id;
- date/time range;
- event kind;
- short factual title;
- systems/components;
- people/executors;
- facts;
- decision;
- before/after state;
- source refs;
- confidence;
- rejected/alternative path when relevant;
- consequence;
- lesson;
- optional narrative labels.

## Suggested long-report chapters

1. **Before the Hub** — separate experiments and early asset/tool exploration.
2. **The Need for Owners** — why reusable modules, pins and SSOT rules emerged.
3. **FrizzleBob Becomes a System** — from avatar/model to graft/rig/face/ear/presenter source.
4. **Residents Become a Cast** — Atlas, rig classes, motion, staging, band/disco and character life.
5. **From Demos to a World** — worldbuilding, movement/camera, authoring, persistence and integration pressure.
6. **ChatterBox and the Speaking World** — bubbles, triplets, TTS, social calls, narration rules.
7. **The ToolBox Problem** — productive specialist tools versus accidental second owners.
8. **Integration Crises** — regressions, wrong shells, rollbacks, source drift and failed candidates.
9. **The Production Discipline** — Sites-first, GitHub recovery, one writer, source isolation, critic/guard roles.
10. **Roads Not Taken** — rejected UI shells, abandoned candidates, deferred gimmicks and why.
11. **The One-Shot Era** — consolidation and architecture freeze.
12. **The Return With the Elixir** — a coherent open/free-to-play KFB plus its inspectable making-of.

These are initial headings only. Corpus evidence decides final chapter boundaries.

## Hero's Journey projection

Every corpus event may optionally contain:
`narrative.heroBeat`

Allowed values:
- ordinary_world
- call
- refusal_or_fragmentation
- mentor_or_rule
- threshold
- tests_allies_enemies
- approach
- ordeal
- reward
- road_back
- resurrection
- return

Use `null` when forced framing would distort the event.

## “White-coding” / implementation context

For each major technical chapter, retain:
- owner;
- runtime boundaries;
- source donors/pins;
- accepted/rejected branches;
- model/asset families;
- data schemas;
- UI/interaction contract;
- test surface;
- deployment surface;
- regressions;
- resolution;
- surviving lesson.

A future LLM should be able to answer:
- “why is this implemented this way?”;
- “what previous attempt failed?”;
- “which donor is canonical?”;
- “what is safe to reuse?”;
- “who owns this behavior?”;
- “what does Georg need to decide, if anything?”.

## Provenance policy

Priority:
1. current project SSOT / Return / Recovery;
2. exact Issue/PR/commit;
3. additive changelog;
4. archived session cuts / donors;
5. Dropbox only as provenance/export evidence when GitHub has newer truth;
6. chat recollection only as a search hint.

Every externally narrated claim must remain traceable to one or more source refs.

## LLM narration contract

The narrator receives:
- selected corpus events;
- current character voice contract;
- target length;
- narrative view;
- source links.

It may:
- condense;
- order;
- dramatize transitions;
- choose dialogue turns.

It may not:
- invent missing motivations;
- merge separate owners into one;
- turn a proposal into implementation;
- turn test PASS into human acceptance;
- suppress failures to make the story cleaner.

## ChatterBox triplet adaptation

For short interactive playback, convert a story event into:

1. **SHOW IT** — concrete fact / artifact / visible state.
2. **SPIN IT** — why it mattered / what changed.
3. **SELL IT** — consequence, next fork, or question.

This is presentation only; provenance stays attached to the event.

## First bounded corpus seed

Do not ingest a year in one opaque LLM pass.

Recommended first seed:
**Production Hub / Resident Overlay lineage**
- original Hub v2;
- Resident Overlay v1/v1.1;
- #364 regression;
- accepted shell restore;
- current Side Quest #370.

Why:
- compact;
- mixed visual/technical/decision history;
- already has PASS/FAIL/recovery;
- directly exercises the future Story Mode.

After the seed validates, expand chapter-by-chapter.
