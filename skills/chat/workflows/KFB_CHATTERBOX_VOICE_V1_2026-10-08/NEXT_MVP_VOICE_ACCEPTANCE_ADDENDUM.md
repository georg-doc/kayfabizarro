# Next Runtime MVP · ChatterBox Voice Acceptance Addendum · 2026-10-08

Status: **GEORG AUTHORIZED REQUIREMENT · PREP NOW · EXECUTE AFTER FOUR-ISLAND A/B GATE**
Owner: existing KFB ChatterBox / Resident Speech output
Does not modify: current Four-Island Story Vision R1, PR #348, World runtime, PR #365 Audio ownership.

## Why this exists

Georg explicitly wants the new Voice Layer **built into and tested in the next MVP slice now being planned**.

The currently active Four-Island Story Vision R1 is still a visual-only A/B gate after the R4 composition failure. It forbids runtime/code/geometry implementation.

Therefore:

- Voice integration is **not** added to that visual task.
- Voice integration becomes a **named acceptance seam of the first runtime MVP slice authorized immediately after Georg selects A or B**.
- S1 source-ID work is implemented now so the future MVP does not start with another late integration surprise.

## S1 result · canonical source adapter

New adapter:
`runtime/real-pool-adapter.js`

It consumes the existing `window.OW_PHRASES` object from:
`overworld/overworld/chatter-phrases.js`.

It creates stable source records without selecting dialogue.

Current source census at blob:
`72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4`

- 8 faction voices;
- 128 faction phrase records;
- 23 synthesis records;
- 15 activity-thought records;
- **166 stable source records total**.

Stable ID examples:
- `phrases-v1:F:kingCourt:ueber:0`
- `phrases-v1:S:camp:0`
- `phrases-v1:T:arbeit:0`

For `{X}` templates, source identity stays on the template while the concrete rendered wording gets its own text revision/hash.

This means audio can be invalidated/regenerated when wording changes without pretending the text string itself is canon identity.

## Candidate Triplets stay candidates

The adapter also accepts semantic Triplet records with:
`tripletId + subject + connector + reframe`.

It preserves the source status supplied by the owner.

Therefore:
`AUTHORING_CANDIDATE` stays `AUTHORING_CANDIDATE`.

The current 20-item Curator seed is **not promoted** by this work.

## Next MVP proof actors

Use source-backed story actors that already match Voice V1 audition presets well enough for a bounded proof:

### Dystopia
**Demon Lord**
- Resident Atlas id: `demon-lord`
- actor: `demon`
- Rig_Large
- candidate voice preset: `demon_lord`
- story anchor: existing Demon Lord birthday-party world

### Utopia
**Robot One / Robot A role**
- exact source: `Robot_One.glb`
- source blob: `b31e123c4aa4038aaa4f1c76f003570e4507eee8`
- Rig_Medium
- candidate voice preset: `robot`
- story anchor: Robot A + Robot B visibly build/repair in the Golden Journey / Four-Island source

### Protopia
**Farmer A / Farmer Duo**
- Resident Atlas id: `farmers`
- actor: `farmer_a`
- Rig_Medium
- candidate voice preset: `farmer`
- story anchor: Golden Journey Protopia Farmers

Optional fourth proof:
**Lorekeeper**
- Resident Atlas id: `lorekeeper`
- candidate voice preset: `lorekeeper`
- existing Golden Journey handoff.

These preset assignments are **audition candidates**, not final character canon.

## MVP Acceptance · Voice

The next runtime MVP slice may not count its ChatterBox/Resident seam as complete merely because text bubbles appear.

For the bounded Voice proof:

1. at least **three source-backed Residents** speak through the new output seam;
2. the proof covers Dystopia + Utopia + Protopia;
3. the spoken text comes from the existing ChatterBox semantic source/accepted Triplet source, not Voice-V1 demo prose;
4. visible bubble text remains authoritative and readable with audio muted;
5. valid silence remains valid;
6. Voice Layer creates **no AudioContext**;
7. KFB Audio remains mixer/ducking owner via `onSpeaking`;
8. at least one static/Whole hit and browser fallback are proven;
9. one real Golden-Journey social call (BINGO/BONGO/BOGGLE/BLÖDSINN) uses an accepted curated voice asset while keeping its visible choice label;
10. Georg hears only the voices actually used and returns **KEEP / TUNE / CUT**.

No full 11-character casting gate is required for this MVP proof.

## Social Calls fit naturally into the Golden Journey

Existing Golden Journey already uses:
- KayfaBONGO at the Utopia CEO decision;
- KayfaBINGO at the Protopia Farmers decision;
- optional KayfaBOGGLE at Lorekeeper;
- optional KayfaBINGO applause around the Dystopia performance.

Therefore the existing ElevenLabs Roger/Siren Social Call assets can be tested as **curated player-voice stingers** without inventing a new gameplay mechanic.

The chosen player `voiceProfile` selects the accepted asset.
Do not hard-code `male/female` into ChatterBox semantics.

## Not required yet

- no bulk ElevenLabs generation;
- no full dialogue voicing;
- no viseme/lipsync gate;
- no Resemble Chatterbox-TTS;
- no second Voice Site;
- no runtime changes before the A/B world-direction gate.

## Exactly one next runtime gate

After Georg selects Four-Island Direction A or B:

**NEXT_MVP_RUNTIME_WITH_VOICE_R1**

The runtime brief must include this Voice Acceptance addendum from its first frozen matrix, not append it after the world is otherwise complete.
