# KFB Dialogue / Narration Reference Routing 01

Status: RESEARCH/DESIGN ROUTING · NO RUNTIME WRITES
Date: 2026-10-06
Owner: KFB Asset Registry / Asset Librarian
Consumer owners: existing ChatterBox / Triplet / Resident presentation paths

## Purpose

Route Etherington writing/comic references to the KFB problems they can actually improve. This file is not a dialogue engine and does not prescribe canonical lines.

## 1 · ChatterBox authoring core

Primary references:
- Small Talk
- Speech
- Speech Patterns
- Talking
- Story Branching
- Show, Don't Tell

Use to derive:
- short turn economy;
- intent before exposition;
- resident-specific cadence and lexicon;
- subtext / relationship signal;
- optional silence instead of filler;
- response selection that respects current state without bloating into branching quest prose.

KFB clamp:
- no generic banter filler;
- no catchphrase spam;
- no lore dumping;
- no second dialogue-state owner;
- content stays compatible with the existing resident/kernel/presentation owners.

## 2 · Triplet authoring

Primary references:
- Speech
- Speech Patterns
- Small Talk
- The Callback
- Silence Is Golden

Use to test whether subject / connector / reframe:
- sounds like one resident rather than three generic fragments;
- advances or reframes the social beat;
- can stop after one or two parts if silence is stronger;
- earns callbacks from prior encounters;
- avoids repeated sentence skeletons.

The existing Triplet semantic structure remains owner truth.

## 3 · Bubble / caption presentation

Primary references:
- Speech Bubbles
- Caption Boxes
- Comic Sense
- Conversations

Use to derive:
- speech vs thought vs caption distinction;
- text density and bubble economy;
- reading order / speaker ownership;
- text-image balance;
- staging and eyeline support;
- off-screen voice without pretending the narrator is physically present.

Preserve current KFB clay bubble family and presentation owner.

## 4 · Historian / meta-narrator

Primary references:
- Caption Boxes
- The 4th Wall
- The Guide
- Show, Don't Tell
- Local Colour

Role:
- external chronicler/commentator;
- contextualizes place, time and consequence;
- may contradict heroic framing with observed facts;
- may address the player sparingly;
- does not know hidden game state unless the event contract provides it;
- does not replace quest text or Resident dialogue.

Useful trigger classes:
- arrival / transition;
- major world event;
- aftermath;
- repeated player failure;
- revival;
- unusual resident/social event.

## 5 · Death / revival social grammar

Primary references:
- Failure
- The Callback
- Excuses
- The Group Dynamic
- Speech Patterns
- Silence Is Golden

Escalation pattern:
1. first failure: acknowledgement;
2. repeat: recognition;
3. repeated pattern: callback / social judgement;
4. established relationship: resident-specific interpretation;
5. crowd case: group dynamic decides who speaks, who piles on, who stays silent.

Do not hardcode one universal joke ladder. The same death count should produce different reactions from different Residents.

## 6 · Nearby witness reactions

Primary references:
- The Group Dynamic
- Interrupt a Scene
- Talking
- Show, Don't Tell
- The Tic and the Tell

Reaction classes:
- witness;
- sympathy;
- mockery;
- disbelief;
- opportunism;
- concern;
- silence / stare;
- interruption of an ongoing conversation.

Performance note:
The Tic and the Tell also routes to Blender MCP resident-performance work as a source for recurring nonverbal behavior, but semantic meaning remains in the Resident/ChatterBox data layer.

## 7 · Resident personality / voice

Primary references:
- Speech Patterns
- Talking Animals
- Excuses
- Rivals
- Local Colour
- The Tic and the Tell

Authoring dimensions:
- cadence;
- vocabulary;
- sentence completion / interruption tendency;
- directness;
- willingness to admit uncertainty;
- social status markers;
- local/faction vocabulary;
- recurring nonverbal tell;
- relationship-specific changes in tone.

These are profile dimensions, not fixed catchphrases.

## 8 · Source-inspection packs

Do not send the whole corpus to Claude Design at once.

Pack A · Bubble + caption:
- Speech Bubbles
- Caption Boxes
- Comic Sense
- Conversations

Pack B · Dialogue voice:
- Small Talk
- Speech
- Speech Patterns
- Talking
- Show, Don't Tell

Pack C · Failure + reactions:
- Failure
- The Callback
- Excuses
- The Group Dynamic
- Silence Is Golden
- Interrupt a Scene

Pack D · Historian:
- Caption Boxes
- The 4th Wall
- The Guide
- Local Colour
- Show, Don't Tell

## Boundary

Sound Words remain outside this routing document and belong to Comic/VFX.
No Open World write.
No ChatterBox runtime write.
No new narrator runtime.
No Site/publication change.
