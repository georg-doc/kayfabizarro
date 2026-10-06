# BRIEF · Claude Design · Dialogue / Narration Grammar 01

Status: RESEARCH/DESIGN PREP · NO RUNTIME WRITES
Date: 2026-10-06
Executor: Claude Design
Owner: KFB Asset Registry / Asset Librarian reference pool
Consumers: existing KFB ChatterBox / Triplet / Resident presentation owners
Protected: current Open World Coworker run, ChatterBox runtime owners, Kernel #305, content pool #310

## Outcome

Turn a small verified Etherington source subset into a KFB-specific dialogue/presentation grammar for:
- speech bubbles;
- thought/silence;
- caption / off-screen narration;
- resident small talk and conversational rhythm;
- character-specific speech patterns;
- meta narrator / Historian layer;
- player-death / revival commentary and nearby NPC reaction beats.

This is a design + authoring contract, not a new dialogue engine.

## Read first

1. `ETHERINGTON_OFFICIAL_SEED_04_DIALOGUE_NARRATION.json`
2. Current ChatterBox Studio Return:
   `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/RETURN.md`
3. Current integration handover:
   `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md`
4. Existing Conversations reference from Seed 01.

## Source subset · inspect in isolation first

Start with max 6:
1. Small Talk
2. Speech
3. Caption Boxes
4. Talking
5. Speech Bubbles
6. Conversations

Second pass only if useful:
- Speech Patterns
- Silence Is Golden
- The 4th Wall
- Talking Animals

For every source:
- show the actual source visual/page in isolation before deriving rules;
- record the referenceId actually inspected;
- separate OBSERVED SOURCE FACT / CONSTRUCTION PRINCIPLE / KFB DESIGN DECISION;
- do not treat a URL load as proof of visual inspection.

## KFB design questions to answer

### A · Bubble family
Define when to use:
- speech;
- thought;
- whisper;
- shout;
- caption / narration;
- ambient / off-screen;
- interactive choice.

Preserve the existing clay bubble direction. No second renderer.

### B · Dialogue authoring grammar
Derive compact rules for:
- line length and information density;
- turn rhythm;
- small-talk vs meaningful turn;
- subtext / relationship signal;
- interruption, pause and silence;
- character-specific cadence without catchphrase spam;
- three-part Triplet reveal where relevant.

Rules must be usable by ChatterBox content authoring and Resident voice profiles.

### C · Historian / narrator layer
Design one distinct narration role, tentatively `HISTORIAN`, inspired by a friendly but opinionated chronicler rather than an omniscient quest log.

Required cases:
- scene / place / time framing;
- world-event recap;
- player failure/death;
- repeated death escalation;
- graveyard / revival commentary;
- contradiction between heroic self-image and observed result.

Narration must be additive presentation/content. It must not own quest state, death state or world simulation.

### D · NPC reaction layer
Specify short nearby reactions that can accompany a world event without creating a second dialogue system:
- witness;
- mockery;
- sympathy;
- disbelief;
- opportunism;
- silence / stare.

Example event contract only:
`player.revived { deathCount, cause, location, witnesses }`
Existing ChatterBox selects/plays the reaction. Do not implement the event owner here.

### E · Death/revival escalation
Propose an authored escalation ladder, not hardcoded jokes:
- first death: restrained acknowledgement;
- second: recognition;
- third: social commentary;
- later: relationship-/resident-specific callbacks.

Avoid generic game-over quips. Use resident voice + context + prior relationship.

## Required output

1. `KFB_DIALOGUE_PRESENTATION_GRAMMAR_01.md`
   - bubble/narration usage matrix;
   - dialogue-writing rules;
   - staging/readability rules;
   - anti-patterns.

2. `KFB_HISTORIAN_NARRATOR_CONTRACT_01.md`
   - narrative role;
   - triggers;
   - tone controls;
   - relationship to ChatterBox and world events;
   - death/revival escalation examples as patterns, not canonical lines.

3. `KFB_CHATTERBOX_AUTHORING_RULES_01.json`
   - machine-readable authoring constraints/tags only;
   - no new runtime state machine.

4. One visual design sheet showing:
   - ordinary speech;
   - thought/silence;
   - caption/Historian;
   - off-screen ambient;
   - player choice;
   all in the current KFB clay presentation language.

## Protected boundary

Do not:
- write Open World/WB2 runtime;
- replace `chatter-2d.js`, `bubble-ts.js` or Kernel #305;
- create a second dialogue/narrator runtime;
- author Sound Words in this job;
- invent replacement branding;
- mark uninspected references as inspected;
- publish a Site/Cloudflare route.

## Done when

- actual selected Etherington sources are visibly inspected in isolation;
- the resulting rules are clearly KFB-specific and mapped onto existing ChatterBox/Triplet owners;
- Historian/narration is defined as an additive presentation/content layer;
- death/revival reaction patterns are contextual and resident-aware;
- no runtime/world writes occurred.

## Next gate

Return the design grammar to the existing ChatterBox/Triplet integration owner after the current Open World Coworker result has been reconciled and the remaining dialogue seam is known.
