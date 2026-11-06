# KFB Brave New World News · Sponsor Stingers R2
Status: **AUTHORING_CANDIDATE · NOT RENDERED · NOT INTEGRATED**. Date: 2026-11-06.
Owner: existing KFB Audio / radio voice-content lane. This is an additive script library, not a new runtime or speech engine.

## Deliverables
- TTS master: `BNWN_Sponsor_Stingers_R2_150_TTS.txt`; 150 English independent stingers, 144 newly written plus six retained from R1. No spoken IDs and no emotion tags.
- Semantic metadata: `BNWN_Sponsor_Stingers_R2_150_Cue_Map.json` with cue IDs, source status, topic lanes, suggested triggers and **estimated, not measured** speech durations.
- Review list: `BNWN_Sponsor_Stingers_R2_150_Review_Index.csv` for audition editing/reordering.
- Separator between spoken stingers: `<break time="1.6s" />`. The actual TTS pause length must be checked by waveform before cutting.

## Canon and authoring intent
Voice/style reference: Georg's `Brave New World News 02 (R3, aus Georgs BNWN-Kanon).srt`. Corporate 1970s infomercial enthusiasm combined with Orwellian doublethink, financialized governance, "protect our democracy", "trust the experts", "follow the science", technological paternalism, subliminal commands and player-linked game events. Named real-world parties or people are intentionally not used; these are satirical fictional announcements, not factual public-service notices.

Twelve new thematic lanes, twelve clips each: experts/science, democracy, surveillance, corporate state, algorithmic sovereignty, money/credits, media/truth, wellness/green, rebels/districts, behavior/social, fine print, subliminal. Old six retained unchanged. Do not add descriptions, editorial labels or numbering to audio synthesis input.

## Suggested playback, not implemented
- Prefer a shuffle bag per contextual lane, with a global recent-ID exclusion window of at least 30 cues and a last-category penalty.
- Use event lanes only as fuzzy editorial suggestions; intentional contradictions and irrelevant ads are welcome, but suppress speech during other active dialogue.
- Start from one occasional stinger per 90–180 seconds of radio playback, subject to actual listening review and event frequency.
- Game-side triggers remain owned by the world; mix/voice priority/ducking remain owned by **existing KFB Audio**. Do not create a second AudioContext, dialogue semantic owner, or radio runtime.
- Render and mark actual clip start/end/duration from waveform. Audio and video are **not** included. No direct Stage or Site route is required for this authoring-only slice.

## Next gate
Render one master with the established BNWN voice. Check both the cheerful promotional delivery and the separator silences; cut into 150 cue IDs only after checking actual waveform timing.
