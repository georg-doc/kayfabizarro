# KFB Triplets · Uncle FrizzleBob's 1001 Kayfabe Nights · Cards 5→6→7
Date: 2026-10-13
Status: **SOURCE_VERIFIED · EDITORIAL_CANDIDATE · NOT HUMAN ACCEPTED · NOT AUDIO TESTED**

- Owner: KFB ChatterBox Voice Layer, Draft PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
- Plugin: KFB Triplets v0.1 skills-only composer, no separate runtime.
- Exact original deck: `media/kfb/1001_Kayfabe_Nights_-_ADD_web_ID.pdf.json`.
- Original user ref: `34102e8bec6ae76e5b2e8de1f1c2a6abb4f4bd1c`; exact Git source blob: `c5b6719d6a0612f227615d9917bbfbb45563f45d`. Main current file independently confirmed same blob at authoring time.
- Registry `media/kfb/index.json`: packId `1001_kayfabe_nights`, original Card records **60**, selected source order **5, 6, 7**. This is **THREE_CARD**, not a verified four-quadrant PDF page or full-deck script. PDF visual crop was not opened.
- Speaker: **Uncle FrizzleBob** (editorial casting, from source deck title); mode **comic/deadpan**, D-bed intention only. No clip, singing provider or timing proof.

## Verified card identity and source anchors

1. #5 **SHAHRYĀR, THE DESTROYER** — POWER: The Pink Slip. One night, one match. If you bore me, you're buried permanently. LORE: THE HEEL PROMOTER: He thinks the roster is disposable. He's wrong. Power: 100.
2. #6 **SCHEHERAZADE, THE UNENDING** — POWER: The Promo. My words are a crossbody into your heart. I've got a thousand nights of heat in the tank. LORE: TOP FACE BOOKER: She's turning the shoot into a work to save the locker room. Power: 99.
3. #7 **DUNYAZAD, THE HYPE WOMAN** — POWER: Ringside Distraction. Sister, tell him the one about the apples! We aren't tapping out tonight! LORE: THE VALET: She keeps the heat alive when the main event drags. Power: 90.

The following **three one-sentence Card Triplets** are `EDITORIAL_DERIVED_NOT_VERBATIM`, not quotations or game rules; genuine title/POWER/LORE anchors are retained.

- 5: SHAHRYĀR, THE DESTROYER issues a Pink Slip after one match, burying anyone who bores the Heel Promoter permanently.
- 6: SCHEHERAZADE, THE UNENDING delivers a Promo that turns the shoot into a work, keeping the locker room alive for a thousand nights.
- 7: DUNYAZAD, THE HYPE WOMAN uses a ringside distraction to demand the story about the apples, keeping the heat alive so her sister won't tap out tonight.

## Editorial causal bridges (not Card mechanics)

- `5>6`: `retaliation` / Pink Slip → microphone rebuttal. **Shahryār reaches for the next name on the roster; Scheherazade takes the microphone before the Pink Slip lands.** Cost: the threatened firing becomes a public showdown; callback: Pink Slip. Source refs: deck `1001_kayfabe_nights` #5 and #6 at blob `c5b6719d6a0612f227615d9917bbfbb45563f45d`. Status: `LOCAL_EDITORIAL_CANDIDATE`.
- `6>7`: `obstruction` / promoter demands a finish → ringside interruption. **When Scheherazade stops for breath, Shahryār counts toward the finish; her sister starts shouting from ringside.** Cost: Scheherazade's short pause threatens the performance; callback: match finish. Source refs: same deck #6 and #7 at blob `c5b6719d6a0612f227615d9917bbfbb45563f45d`. Status: `LOCAL_EDITORIAL_CANDIDATE`.

These are authored comic stage connections, not source Card POWER; no new source LORE is claimed.

## Suno Lyrics / Speech — copy as one field

```text
[Spoken Word]

Welcome, dear Fluffheads! Tonight the main event has one night to live.

SHAHRYĀR, THE DESTROYER issues a Pink Slip after one match, burying anyone who bores the Heel Promoter permanently.

Shahryār reaches for the next name on the roster; Scheherazade takes the microphone before the Pink Slip lands.

SCHEHERAZADE, THE UNENDING delivers a Promo that turns the shoot into a work, keeping the locker room alive for a thousand nights.

When Scheherazade stops for breath, Shahryār counts toward the finish; her sister starts shouting from ringside.

DUNYAZAD, THE HYPE WOMAN uses a ringside distraction to demand the story about the apples, keeping the heat alive so her sister won't tap out tonight.

Stay Fluffy!

[End]
```

## Suno Style — separate copy field

```text
Dry theatrical English spoken-word comedy, older male raconteur with amused menace and precise wrestling-announcer timing rather than shouting. Sparse upright bass, brushed drums and restrained plucked strings held below the voice. Measured pauses after Pink Slip, Promo and the ringside interruption. Spoken, not sung; no chorus. Leave the final Stay Fluffy! dry.
```

## Boundary, QA and next gate

- Verified deterministic authoring checks: **17/17 PASS** against fetched original Card JSON and current repo registry; lyrics **735 Unicode codepoints**, Style **364 Unicode codepoints**.
- Existing Audio Site (Audio PR #365, `card-performance.js`) validates imported `deckId === 'wrinkle_rumble'`, including in `importDraft`; `1001_kayfabe_nights` **cannot honestly be called a valid Site import draft** without a separate authorized multi-deck extension. No fake import file generated.
- Existing active Voice preview `audio-site-preview-r3-card-11-tune` unchanged; pending human DRY/D/Card11 gate untouched.
- No Suno API transmission/render, no audio playback, no Site re-publish, no new Site/Cloudflare Stage, no merge/Live, no acceptance claim.
- Exactly one next gate: **GEORG_1001_5_6_7_SUNO_SCRIPT_KEEP_TUNE_CUT_R1** — Georg evaluates the actual spoken candidate as KEEP/TUNE/CUT before longer deck scaling or multi-deck Site work.
