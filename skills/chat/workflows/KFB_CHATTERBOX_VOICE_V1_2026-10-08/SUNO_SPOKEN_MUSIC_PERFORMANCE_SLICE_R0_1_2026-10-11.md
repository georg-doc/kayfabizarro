# KFB ChatterBox · Suno Spoken-Music Performance Slice R0.1
Date: 2026-10-11
Status: **GEORG AUTHORISED DESIGN/PREPARATION SLICE · NO NEW AUDIO RUNTIME · NO NEW SITE DEPLOYMENT**
Owner: **KFB ChatterBox / Resident Speech output**, existing Draft PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Receiving consumer: **existing private KFB Audio Site** (`Voice Acting` tab), KFB Audio remains playback clock, single AudioContext, music/ducking/mix owner. Existing Resident Atlas / Performance Suite owns body gesture, speaking pose, juggling and props.
Site record: existing KFB Production Control private Site Inbox only (planning artifact, not a production Site update).
Execution mode: BOUNDED_SLICE / authoring design and candidate data only. No Site/Stage/cloud publication, no Suno calls/downloads.

## 1. Product opportunity, source vs inference
Georg provided a successful example of Suno generating a fast, spoken female philosophy-comedy monologue accompanied by a rockabilly backing band, while reporting generic AI-gag quality. **User-observed capability, not independently tested in this slice.** New useful format: a curated, pre-rendered **spoken-music performance take** (20–150 seconds), not just individual TTS sentences or a background-music loop. It can serve a juggling Clown on a miniature stage, other resident announcers, philosophical duels, Town radio, Tourbus, bookshop and stage vignettes.

Important distinctions:
- **ChatterBox** retains semantic selection, accepted script/triplet identity, speaker, thought/silence and provenance. `subject / connector / reframe` remains the source grammar for Triplets; a complete scripted performance is a **different authored media item**, not three artificially split fragments.
- **Voice Layer PR #379** remains provider-neutral playback-resolution and voice-output seam; it does not synthesize or select new dialogue meaning.
- **KFB Audio PR #365 family** remains sole timeline/mixer/ducking owner, including diegetic music, speech focus and no second AudioContext.
- **Resident Performance/Atlas** owns acting, stage, mic/prop and juggling actions. Consume cues, do not create a new rig or second 3D performance runtime.
- Suno is a **build-time third-party media provider**, not runtime speech synthesis, KFB ChatterBox, Speakrail or Resemble Chatterbox-TTS. Approved Suno file is one complete mix unless verified stems exist; never advertise stems or word timestamps that are not actually extracted/validated.

## 2. Existing donor evidence to reuse
- Existing Voice owner START_HERE / RETURN / TEST_REPORT under this folder, current `kfb.voice-asset-identity/1` output contract and `core.frame.01` non-canon source-bound Triplet audition; do not rewrite the S1–S4 integration.
- Original source-backed `tools/resident_atlas/modules/clown-juggling-island.module.json`, status **candidate-only**, residentId `clown`, activity `juggle-cascade-v1`, **three clubs** (`pin_blue`, `pin_green`, `pin_red`), `dwellBeats:0.45`; actor/consumer and placement limitations still apply. Do not imply 4–6-club geometry/QA or a performance stage exists.
- Existing `tools/KFB-ToolBox/_handover/PERFORMANCE_SUITE_2026-09-15/START_HERE.md`: Presenter / Stand-up / Monologue vocabulary, `Presenter_Punchline_Beat`, manual cue sequencing, right-hand mic candidate (GothGirl source). Rig family binding and microphone identity require actual source/visual QA; never conjure a microphone or treat a candidate as accepted.
- Existing `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md`: pool, kernel, `kfb.dialogue-presentation.v1`, silence and triplet block timing unchanged.
- Existing RoadTrip/Jukebox and KFB Audio Soundscape source library. Do not duplicate a media catalog. Pre-rendered Suno accompaniment is *inside* the whole performance mix; avoid simultaneously playing the same bed twice.

## 3. Two authoring lanes, common provenance
**A. SCRIPT_FIRST (recommended; higher comedy control):**
1. Seed from accepted Card/deck/Triplet, incident or author-supplied theme; identify actual actor, POV, stance, audience and setting.
2. Write/revise a 1–2 minute spoken script: thesis, counterpressure, distinctive concrete observations, callbacks, final reversal. One edit/read pass against anti-slop criteria.
3. Separate `spokenScript` from `stylePrompt` with music instrumentation, speech-over-music mix, pacing and ending. Export prompt packet, not new canonical dialogue.
4. Generate/audition in Suno; keep multiple unheard/discarded candidates out of the canonical pool. Approve an exact transcript/mix match before export.
5. Register accepted audio file identity, measured duration, optional verified timestamps/manual performance cues, licensing and usage scope.

**B. PROMPT_FIRST (experimental; cheap novelty):**
1. Include audience, speaker profile, theme, adversarial POV, stage dramaturgy, musical style, 1–2-minute target and anti-slop constraints.
2. Audition drafts in Suno **before download**; transcribe/check the audible words; edit script in ChatterBox authoring if quality is below threshold and then try SCRIPT_FIRST.
3. Explicitly mark Suno-authored words `GENERATED_CANDIDATE` until author review. Never elevate output to an approved Card, Triplet, factual source, quotation or resident canon automatically.

The existing user Foucault/Deleuze/Derrida + rockabilly demonstration is a **user-provided reference sample**, not KFB canon, not source-backed philosophical quotation and not tested here.

## 4. Content direction / anti-AI-slop gate
- English for player-facing performance. Character-specific voice, stakes, bias, rhythm and stage business; **no generic interchangeable comedian**.
- The joke must arise from the speaker's concrete dilemma, contradiction, physical action, or discovered counterexample; abstract thesis alone is not a punchline.
- Real references are accurately attributed or plainly fictionalised; philosophical and political claims presented as the *character's perspective*, not invented scholarly quotations.
- Avoid formulaic analogies, endless 'X is Y with a podcast' punchlines, interchangeable office/HR/Zoom jokes, redundancy, moralising outro and easy audience flattery.
- Beat check: first image within 5–10s; first distinct laugh/turn within 15–25s; at least one callback/reversal; exit before the premise expires. Silence/pauses are intentional.
- Script must be spoken, **not sung**; band stays below dialogue; purposeful 1–2 bar stings/interludes only. Fail any take in which the band masks speech, the speech is unintelligible, new words are fabricated relative to an approved SCRIPT_FIRST text, or a copyrighted melody/recognisable impersonation is accidentally inserted.
- Structural review does not equal audible humor PASS: Georg's listening remains optional until the take is selected for a real character performance.

## 5. Pilot three-slot programming; no bulk generation
1. **P0 Clown on Juggling Island**: 60–90s fast rockabilly/vaudeville stand-up, stable three-club cascade, with only `pause / accent / resume` stage cues. Source resident `clown`; actual body/performance binding still candidate-only.
2. **P1 Philosophical speaker**: 90–120s educated caustic female monologist + rockabilly band, using the user's supplied Foucauldian/poststructuralist satire only as stylistic reference. Speaker identity remains **unassigned** until an actual KFB Resident is selected.
3. **P1 Reactive Triplet epilogue**: 20–45s authored callback after an actual semantic `subject/connector/reframe` turn. Triplet identity must be source-bound; performance can riff *about* the accepted Triplet but must not mutate its words or replace short interactive replies.

Initial `SCRIPT_FIRST` Suno prompt specimen (authoring candidate, not generated audio):
`Spoken-word stand-up, adult dry observant stage comedian, quick precisely articulated English delivery, conversational not sung, compact live rockabilly trio: upright bass walking lightly, brushed snare, muted hollow-body guitar, occasional two-beat sting only after a punchline. Keep instruments behind clear foreground speech. 75–90 seconds, audience room tone quiet, natural pauses, no canned laughter, no chorus or lyrical singing, decisive clean finish.`

Short original Clown sketch **candidate seed only** (editable, not KFB canon):
> I juggle three clubs for a living. The audience calls it talent. The insurance company calls it a pattern of deliberate negligence.
>
> The blue club is freedom. The red club is security. The green one's convenience. Everyone wants all three in the air. Nobody wants to stand underneath.
>
> Yesterday a man told me the trick was balance. Then he moved my feet two inches to the left and charged a consulting fee.
>
> I dropped the green one. The crowd gasped. The blue one hit the security officer. Suddenly we had a committee.
>
> They voted unanimously that juggling should continue, provided nobody throws anything.
>
> [Stop catching. Hold still. Let the last club fall.]
>
> Thank you. You've just witnessed the safest performance this venue has ever cancelled.

These stage brackets are screenplay/cue metadata, not audible words unless Suno actually interprets them as directions; use separate cue sheet for exact timing.

## 6. Proposed candidate manifest (data companion; no runtime owner)
`kfb.chatterbox.performance-take/0.1-candidate`:
- `performanceId`, `mode` = SCRIPT_FIRST|PROMPT_FIRST; `sourceStatus`=AUTHORING_CANDIDATE; `residentId` (nullable until pinned); `topicSourceRefs` incl `sourceId` and `sourceRevision` where available;
- `spokenScript`, `stylePrompt`, `spokenLanguage`, `targetSeconds`, `tempoFeel`, `musicStyle`; human edited `actualTranscript` nullable until audio;
- `audioAsset`: provider=Suno, providerTakeId nullable, actual file path nullable, format/duration/hash nullable, rights/license/allowPublic state, no placeholder URL;
- `cues`: labelled manual `INTRO | TALK | JUGGLE_HOLD | ACCENT | PUNCHLINE_PAUSE | OUTRO`; timing source `MANUAL_PROPOSAL` until measured; never pretend word-aligned lip sync;
- `selectionStatus`: `UNGENERATED | AUDITION_ONLY | KEEP | TUNE | CUT`; separation of creator review, rights and public promotion;
- `playbackPolicy`: diegetic/featured, voice focus and duck via KFB Audio, user-gesture start and visible bubble/caption transcript on mute, interrupt/reset lifecycle;
- `usage`: `PRIVATE_AUDITION` before clearance and approved use. No auto loop for spoken monologue, no autonomous NPC spam.

Do not use Voice `makeKey` unchanged for a **mixed speech+band** master: the existing identity contract is for source-bound speech assets, so the future receiving owner must either extend its recipe dimensions additively (master/mix/source take) or store performance media under current KFB Audio asset identity. No second renderer/mixer required.

## 7. Playback/acting integration sequencing
Flow: `semantic event → ChatterBox source/script approval → selected performanceTake ref → KFB Audio playback clock/duck and audio focus → existing caption/bubble + Resident Performance cue consumer → stop/rest`.
- One active stage performance max in the local scene, distinct from ordinary ambient Triplets.
- Before an audio file exists, show text + candidate prompts only; no false 'Play' controls.
- Real audio clock is authoritative; any hand-authored approximate beats must be visibly labelled approximate. `onSpeaking` drives talk/duck; `onBeat` drives only accepted cue events. Existing bubble remains readable muted and does not invent extra lines.
- Spoken take interrupt priorities: user exit / local quest event / direct NPC answer take precedence. Restore mix/gesture safely; do not resume random elapsed position after exiting a scene unless intentionally authored.
- If a Suno mix is full-band, KFB Audio must not independently stack another copy of the same music layer; possible future stem separation is explicitly `UNVERIFIED`.
- Source-status/license gating must be at least as strict as existing `voice-asset-identity/1`. Keep generated jokes and political satire non-canon until approved.

## 8. Budget model and decision
Georg reports **approximately 60 monthly Suno downloads**, uncertain account/plan quota. Treat this as an **editable user estimate**, never a verified entitlement or API property. Keep global allocation across soundscapes + musical performances, not an extra independent 60 for ChatterBox:
- Set `estimatedMonthlyDownloadBudget=60` (UNVERIFIED), `actualDownloadsThisMonth=null` until user supplies or Site/account confirms.
- Reserve **no purchases or downloads now**.
- Prototype 3 pilot identities; audition generations in Suno without download where possible; cap initial **selected exports at six total**, contingent on monthly remaining balance and human listening.
- Prefer one strong final mix over several minor variants; reuse one accepted take in multiple world presentations, keeping file provenance and per-consumer play limits.
- User's planned RoadTrip/soundscape batch shares the same budget; no double-counted 'free' export per module.
- Do not assume 60 downloads = 60 creations, tracks, stem sets or rights-licence grants. Verify current Suno account allowance, relevant usage/commercial rights, and whether a given export format/stem action consumes a quota **before** spending.

## 9. Explicit separation of status and tests
Done in R0.1: source audit + script/prompt design + candidate machine-readable metadata + private Production Control/GitHub check-in.
Not done: Suno render/upload/export; actual script fidelity test; acquired audio metadata; subjective humor/music QA; measured cue timestamps; clown-motion audio sync; browser/mic/live audio/Stage; user final KEEP; rights clearance; new World runtime/R5.
World Four-Island A/B gate, PR #357 HOLD/TUNE, and existing Voice R1 human listening remain unchanged. This is additive, not an automatic dependency of the world MVP.

## One next productive gate
`KFB_SUNO_CLOWN_FIRST_TAKE_AUDITION_R1`: reuse existing KFB Audio Voice Acting Site as receiving bench *when authorized to implement*; take one script-first, original-Clown 60–90s candidate, generate/audition in Suno, obtain the exact file and audited transcript/duration/license, then integrate **one** true mixed-media take with observable audio-clock + 3-club/punchline cue proof. Georg decides KEEP/TUNE/CUT **only on the resulting audible performance**. No new Site, no auto-merge, no World runtime promotion.
