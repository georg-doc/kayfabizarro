# Integration Slides · Voice Layer insert R1 · 2026-10-08

Status: **SLIDE-READY CONTENT · NOT A SEPARATE PRODUCT OR DECK**
Audience: KFB integration / next-runtime-MVP planning
Source truth: PR #379 + `KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md`

## Slide 1 · ChatterBox gains a Voice Layer without gaining a second brain

Headline:
**Same ChatterBox semantics. Better character voices.**

Diagram:
```
Deck/Card + world context
        ↓
Resident identity + Affect
        ↓
KFB ChatterBox
        ↓
Bubble text ───────────────→ always readable / mute-safe
        ↓
Voice Layer
  static fragment / Whole
  → optional live provider
  → browser fallback
        ↓
existing KFB Audio ducking
```

Key points:
- ChatterBox remains dialogue owner.
- Resident Affect remains emotion truth.
- KFB Audio remains AudioContext/mixer owner.
- Voice is output/presentation only.
- fixed dialogue can be pre-rendered; runtime-only text can fall back safely.

Evidence callout:
**S1: 166 real source records · 13/13 adapter tests PASS.**

## Slide 2 · Voice is tested inside the next MVP, not after it

Headline:
**Three worlds, three speaking proof actors, one existing audio owner.**

Dystopia:
- Demon Lord
- candidate preset `demon_lord`

Utopia:
- Robot One / Robot A role
- candidate preset `robot`

Protopia:
- Farmer A / Farmer Duo
- candidate preset `farmer`

Optional:
- Lorekeeper

Acceptance strip:
- canonical/source-backed dialogue only;
- bubbles readable muted;
- silence stays valid;
- no second AudioContext;
- existing Audio ducks music;
- static + Browser fallback proven;
- one real Golden-Journey Social Call voiced.

Evidence callout:
**Casting bench R1 ready · 10/10 static checks PASS · human listening open.**

## Slide 3 · Curated voices where they matter, cheap fallback everywhere else

Headline:
**Do not voice everything. Voice the identity-bearing moments.**

Tier A:
**Pool speech**
pre-rendered canonical fragments / Whole lines.

Tier B:
**Social Calls**
Kayfa-BINGO · BOGGLE · BONGO · BLÖDSINN plus later Stay Fluffy / What the FLUFF.
Existing Roger/Siren ElevenLabs clips are curated player-voice candidates.

Tier C:
**Runtime-only free text**
optional live provider when justified; browser fallback if unavailable.

Decision rule:
No bulk ElevenLabs generation until source IDs and casting are accepted.

Cost/production message:
- current Piper/espeak donor path has no runtime synthesis cost;
- the current casting bench spent no new synthesis credits;
- ElevenLabs remains optional for high-value calls/Hero lines.

## Slide 4 · Current gate sequence

```
Four-Island Story Vision A/B
        ↓ Georg selects A or B
Next Runtime MVP starts
        ↓
Voice proof is already in frozen acceptance
        ↓
Dystopia + Utopia + Protopia speaking residents
        ↓
one Social Call
        ↓
integrated audio/bubble/fallback evidence
```

Current now:
- world-design gate: **A / B / FAIL**
- Voice S1: **GREEN**
- Voice S2 bench: **READY**
- listening decision: **OPEN**

Do not show Voice as a separate parallel MVP.
It is one acceptance seam inside the next integrated runtime MVP.
