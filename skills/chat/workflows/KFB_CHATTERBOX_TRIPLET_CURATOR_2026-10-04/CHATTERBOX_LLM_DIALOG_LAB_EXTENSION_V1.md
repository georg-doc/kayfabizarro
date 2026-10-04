# KFB ChatterBox · LLM Dialogue Lab Extension v1

Status: **PRODUCT DECISION / IMPLEMENTATION EXTENSION**
Date: 2026-10-05
Owner: **KFB ChatterBox**
Repo: `georg-doc/kayfabizarro`
Branch: `planning/chatterbox-triplet-curator-site-2026-10-04`
Draft PR: **#357**

## Product naming

The umbrella product name is now:

# **KFB ChatterBox**

"Triplet Curator" is a module inside KFB ChatterBox, not a second product and not a second dialogue owner.

KFB ChatterBox contains:
1. **Triplet Pool / Curator**
2. **Dialogue Lab**
3. **Critic + Repair Lab**
4. **Reaction / Choreography Lab**
5. **3D Bubble Stage**
6. **Audio / TTS Preview**
7. **Import / Export / Session Logs**

Existing runtime ownership remains unchanged.

## Goal

Turn the current deterministic Triplet review tool into a bounded authoring and evaluation laboratory for Resident dialogue.

The lab must let Georg compare:
- curated Triplets;
- live LLM-generated Triplets;
- player-written Triplet replies;
- KayfaBINGO / KayfaBONGO / KayfaBOGGLE / BLÖDSINN! interaction;
- Resident-to-Resident conversations;
- Resident-to-player conversations;
- monologue;
- speech/thought bubble presentation;
- TTS + audio ducking;
- facial/eye/brow/body reactions;
- a second-agent editorial critique and repair loop.

The lab is for **testing, curation and prompt improvement**. It does not silently replace the deterministic Resident Chatter adapter or create a second runtime scheduler.

## A · Dialogue Lab

### First supported conversation topology

Start with exactly **two Residents**.

This is the primary comparison surface because it makes voice collapse and repetition measurable.

Later multi-Resident support may be added after the two-Resident case is proven.

Modes:
- Resident A ↔ Resident B
- Resident ↔ Georg/player
- Resident monologue

Inputs:
- Resident A;
- Resident B where applicable;
- Resident Lean Cards read-only;
- Card/deck context;
- optional quote IDs;
- optional current Affect;
- prior Triplet/session history;
- Fluff-o-lect rules;
- reaction vocabulary;
- generation temperature/seed where provider supports it.

### LLM isolation experiment

Do **not** assume one model per Resident is necessary.

Test three levels separately:

**L0 · shared-agent baseline**
- same model;
- one conversation context;
- both Resident personas in one prompt/context.

**L1 · isolated Resident agents**
- same model;
- separate prompt/context/memory window for Resident A and Resident B;
- orchestration passes only the necessary shared scene state and latest turn.

**L2 · model-diverse Residents**
- optional;
- different model/provider/profile per Resident only after L0/L1 comparison;
- used to test whether remaining monotony is model-level rather than prompt/context-level.

The Site must record which mode produced each turn.

Primary question:
**Does character voice diversity improve materially from L0 → L1 before paying the complexity/cost of L2?**

## B · Triplet generation

Generated Resident dialogue should remain Triplet-native.

The generator may produce:
- subject;
- connector;
- reframe;
- relation/transform;
- presentation hints;
- optional Fluff-o-lect transformation;
- optional reaction tag.

Do not generate long free-form paragraphs and then pretend they are Triplets.

Each generated candidate records:
- Resident;
- mode L0/L1/L2;
- model/provider label;
- prompt revision;
- seed/temperature when available;
- source scene/Card/quote refs;
- preceding turn refs;
- latency and token/cost metadata when exposed;
- candidate review state.

## C · Player interaction

Two player-entry modes:

### Free Triplet reply
Georg writes a Triplet reply directly.

### Four-call reply
Buttons use canonical labels:
- **KayfaBINGO!**
- **KayfaBONGO!**
- **KayfaBOGGLE?**
- **BLÖDSINN!**

These are not four generic sentiment buttons.

Their exact digital dialogue behavior is a ChatterBox experiment and must be logged rather than silently promoted to wider game canon.

Initial dialogue-lab interpretation:
- KayfaBINGO! → landed / continue or deepen;
- KayfaBOGGLE? → request one concrete clarification/question;
- KayfaBONGO! → challenge abstraction/power-mechanic phrasing and demand a story/scene reformulation;
- BLÖDSINN! → mark rule/voice/semantic break and route to Critic/Repair.

## D · Critic + Repair Lab

A second LLM agent reviews the conversation after a configurable number of turns or on demand.

The critic is not a co-speaker.

It scores/annotates at least:
- Resident voice distinctness;
- repetition / semantic looping;
- Triplet integrity;
- turn-to-turn causality;
- relation/transform use;
- Card/deck relevance;
- quote use/provenance where applicable;
- Fluff-o-lect compatibility;
- joke/cartoon-dialogue economy;
- exposition density;
- banned/generic filler;
- formatting;
- speech vs thought suitability;
- comic emphasis conventions: plain / **bold** / *italic* usage;
- reaction/action compatibility;
- whether the two speakers sound like one model wearing two names.

Critic outputs:
1. observations;
2. turn-level flags;
3. prompt/guardrail repair proposals;
4. candidate rewrites only when explicitly requested;
5. a recommendation: KEEP / TUNE / CUT / PROMOTE_TO_POOL.

A repair pass must preserve the original transcript and create a new revision. Never overwrite evidence.

## E · Curation loop

A strong generated exchange can become durable data.

Supported actions:
- promote one generated Triplet to candidate pool;
- promote a small exchange into a new Triplet cluster;
- add a Resident-specific signature weighting;
- add a negative/banned semantic pattern;
- add/update a Fluff-o-lect rule;
- add a prompt guardrail;
- reject a turn and keep it as negative test evidence.

No generated item becomes runtime-approved automatically.

## F · Reaction / choreography lab

KFB ChatterBox should bind dialogue turns to existing reaction vocabulary and animation owners.

Include reaction-set testing for:
- "What the FLUFF?!"
- "Stay fluffy!"
- KayfaBINGO / BONGO / BOGGLE / BLÖDSINN
- thought/reactive silence;
- surprise;
- doubt;
- approval;
- irritation;
- confusion;
- amusement;
- emphasis.

Each reaction can reference, without re-owning:
- body animation clip;
- facial expression;
- EyeRig v6 eyelid/brow/pupil target;
- gaze target;
- head turn;
- speech/thought bubble type;
- SFX/VFX cue.

The test surface must allow:
- speaker reaction;
- listener reaction;
- player-triggered reaction;
- two-Resident exchange;
- monologue.

## G · Real 3D Resident stage

The Pair/Scene/Bubble stage uses the exact Resident Atlas 3D actors/sets/rigs proven in the current Resident owner.

Prohibited:
- cutout Residents;
- sprites/image planes as actor substitutes;
- generic placeholder characters.

Integrated shown Residents use EyeRig v6 after donor isolation.

Stage controls:
- Resident A/B chooser;
- Card/deck/quote context;
- orbit camera;
- responsive viewport presets;
- desktop / split / narrow/mobile;
- bubble safe-area overlay;
- speaker/listener anchor visualization;
- manual camera angle;
- auto-framing toggle.

Bubble layout must test:
- face visibility;
- body visibility;
- no character occlusion when avoidable;
- readable tail/anchor;
- camera-facing orientation;
- edge clamping;
- bubble-bubble collision;
- thought vs speech layout;
- streaming text growth without violent relayout;
- TTS-progress highlighting if supported by current bubble owner.

## H · Audio / TTS seam

Reuse the current KFB Audio owner.

Rules:
- one existing AudioContext owner;
- TTS signals voice activity;
- **the mixer owns ducking**;
- music timeline continues while ducked;
- ChatterBox does not own a second music engine.

First-pass TTS:
- browser `speechSynthesis` is sufficient for the lab;
- per-Resident voice mapping is test metadata, not character canon;
- support voice/rate/pitch audition where available;
- preserve text timing events needed for bubble streaming / mouth / emphasis adapters.

KFB Audio movement/cozy/conversation beds remain external audio choices. ChatterBox requests a conversation-compatible bed; it does not copy or retune the mixer owner.

## I · Session log

Every lab session is exportable.

Record:
- session ID;
- date;
- Residents;
- Lean Card revisions;
- Card/deck/quote refs;
- L0/L1/L2 mode;
- model/provider labels;
- prompt revisions;
- turns;
- Triplet structures;
- four-call/player actions;
- critic reports;
- repairs;
- reaction/animation refs;
- TTS voice mappings;
- curation decisions.

Purpose:
- compare prompt revisions;
- compare resident-agent isolation;
- identify recurring failure patterns;
- build durable negative tests and approved Triplet clusters.

GitHub remains authoritative for curated outputs. Raw exploratory transcripts may stay session exports until explicitly promoted.

## J · Quality comparison metrics

For two-Resident experiments, show side-by-side L0/L1/L2 summaries.

Useful metrics:
- lexical overlap;
- repeated phrase rate;
- Triplet reuse rate;
- distinct vocabulary per Resident;
- sentence-length profile;
- relation/transform diversity;
- semantic-loop flags;
- critic voice-distinctness score;
- character-clamp violations;
- user KEEP/TUNE/CUT counts;
- response latency;
- approximate token/cost counts when available.

These metrics support editorial judgment; they are not an automatic quality oracle.

## K · Scope and ownership

KEEP:
- ChatterBox = umbrella authoring/dialogue product;
- Resident Chatter adapter PR #305 = deterministic semantic selection owner;
- Resident Atlas = actor/set/rig truth;
- Lean Cards = character clamps;
- Journey/Resident Social Memory = persistent episodic memory;
- Hypernormalisation = quote/provenance/rights owner;
- accepted Bubble owner = bubble geometry/presentation;
- KFB Audio = AudioContext/mixer/ducking owner;
- EyeRig v6 = eye presentation owner.

DO NOT CREATE:
- second dialogue runtime;
- second social-memory system;
- second quote database;
- second bubble geometry owner;
- second audio mixer;
- private per-Resident phrase-bank architecture.

## L · Implementation order

**Phase 1 · deterministic + live two-Resident lab**
- existing 20 Triplets;
- two real Residents;
- live L0 generation;
- player Triplet + four calls;
- session logging;
- Bubble + TTS + ducking preview.

**Phase 2 · agent-isolation comparison**
- L1 separate Resident contexts;
- side-by-side A/B comparison with same scene seed;
- critic scoring + prompt repairs.

**Phase 3 · optional model diversity**
- L2 per-Resident model profile;
- only if L1 still shows material voice collapse.

**Phase 4 · curation + reaction deepening**
- promote strong candidates;
- negative semantic rules;
- Fluff-o-lect updates;
- full reaction/choreography matrix.

## First acceptance scenario

One real pair:
**Goth Girl ↔ Clown**

Run the same scene through:
1. deterministic donor Triplet route;
2. L0 shared-agent live generation;
3. L1 isolated-agent live generation.

For each:
- 8–12 turns;
- one player KayfaBOGGLE? or BLÖDSINN! intervention;
- speech/thought bubbles on real 3D Residents;
- browser TTS;
- Audio ducking;
- session log;
- Critic report.

Success is not "the LLM answered."

Success is that Georg can visibly compare:
- whether the speakers sound distinct;
- whether Triplets stay sharp;
- whether bubble/TTS/reactions remain readable and characterful;
- whether L1 materially outperforms L0;
- and whether strong material can be promoted into the curated pool without contaminating runtime ownership.

## Publication

This is an extension of the **existing KFB ChatterBox Site plan** on PR #357.

Do not create a second Site.

Primary product remains GPT Site under the existing ToolBox slot `chatterbox-comic-vfx`.

No merge / no Live promotion without the named human gate.
