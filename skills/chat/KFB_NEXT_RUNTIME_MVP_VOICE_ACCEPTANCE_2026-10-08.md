# KFB · Next Runtime MVP Voice Acceptance · 2026-10-08

Status: **GEORG AUTHORIZED REQUIREMENT · EXECUTE ONLY AFTER FOUR-ISLAND A/B VISUAL GATE**
Owner: **existing KFB ChatterBox / Resident Speech output**
Voice integration source: Draft PR **#379** · `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`
Current Voice evidence head: `5e115d7ea5e416c613312370eb319045ced58eb4`

## Decision

Georg wants the new ChatterBox Voice Layer **built into and tested in the next runtime MVP slice currently being planned**.

This does **not** alter the current Four-Island Story Vision R1 task:
- it remains visual-only;
- no runtime/code/geometry implementation occurs before Georg chooses A or B;
- this file does not authorize R5 by itself.

Instead, this Voice proof is a required acceptance seam of the **first runtime MVP slice explicitly authorized after the A/B decision**.

## Current Voice readiness

S0 source intake: COMPLETE.

S1 canonical pool adapter: COMPLETE.

Exact current source:
`overworld/overworld/chatter-phrases.js`
blob:
`72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4`

Adapter:
`skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/runtime/real-pool-adapter.js`
on PR #379.

Current adapter evidence:
- 8 factions;
- 128 faction phrase records;
- 23 synthesis records;
- 15 activity-thought records;
- **166 unique stable source IDs**;
- committed adapter tests: **13/13 PASS**;
- `AUTHORING_CANDIDATE` Triplets remain candidates;
- thoughts/activity thoughts default silent;
- VoiceRequest preserves source provenance;
- Voice output creates no dialogue semantics.

## Next runtime MVP · minimum Voice proof

The first runtime MVP after A/B must include at least three source-backed speaking actors spanning the three future worlds:

### Dystopia
- Resident: **Demon Lord**
- Resident Atlas id: `demon-lord`
- actor id: `demon`
- exact actor path: `media/3D_Assets/KayKit_Mystery_Series6/DemonLord/characters/DemonLord.glb`
- candidate audition preset: `demon_lord`

### Utopia
- Actor: **Robot One** / current Robot A role
- exact actor path: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb`
- exact blob: `b31e123c4aa4038aaa4f1c76f003570e4507eee8`
- candidate audition preset: `robot`

### Protopia
- Resident set: **Farmers**
- Resident Atlas id: `farmers`
- first actor: `farmer_a`
- exact actor path: `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_A.glb`
- candidate audition preset: `farmer`

Optional fourth proof:
- **Lorekeeper**
- Resident Atlas id: `lorekeeper`
- exact actor path: `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2025 - Lorekeeper/Lorekeeper.glb`
- candidate audition preset: `lorekeeper`

All preset mappings are audition candidates, not final voice canon.

## Acceptance

The next runtime MVP ChatterBox/Resident seam is not complete from bubbles alone.

Required Voice proof:
1. at least 3 source-backed speaking actors;
2. Dystopia + Utopia + Protopia coverage;
3. spoken content comes from current ChatterBox/accepted semantic sources, never Voice-V1 demo prose;
4. exact visible bubble text remains authoritative and works muted;
5. valid silence remains valid;
6. Voice Layer creates no second AudioContext;
7. current KFB Audio owner retains mix/ducking authority through `onSpeaking`;
8. static/Whole-or-fragment playback plus browser fallback are both demonstrated;
9. one real Golden-Journey Social Call uses a curated voice asset while keeping the visible choice label;
10. Georg hears only the MVP-proof casting and returns `KEEP / TUNE / CUT`.

No full 11-character casting is required for this proof.

## Social Call seam

The existing Golden Journey already supplies natural test points:
- Utopia CEO: KayfaBONGO;
- Protopia Farmers: KayfaBINGO;
- Lorekeeper: optional KayfaBOGGLE;
- Dystopia performance: optional KayfaBINGO applause.

Use the already-created ElevenLabs Roger/Siren Social Calls as curated player-voice candidates behind `voiceProfile`.
Do not hard-code male/female into ChatterBox semantics.

## Protected boundaries

- KFB ChatterBox remains dialogue-semantic owner.
- Resident Life/Affect remains state owner.
- KFB Audio / PR #365 family remains AudioContext/mixer/ducking owner.
- PR #357 remains HOLD/TUNE donor, not finished runtime.
- Resemble Chatterbox-TTS is unrelated and not required.
- ElevenLabs is optional, never a hard MVP dependency.
- no bulk voice generation before casting/source acceptance.
- no Site duplication.
- no merge/Live promotion implied by this planning decision.

## One next Voice gate

`KFB_CHATTERBOX_VOICE_CASTING_BENCH_R1`

This can proceed independently as a bounded listening/rendering preparation while the Four-Island A/B visual gate remains the current world-design gate.
